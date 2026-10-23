import { createHash } from "node:crypto";
import { mailTransport, cleanEnvValue as clean } from "./mail";
import { getDatabase } from "./turso";
import { appointmentSiteUrl as siteUrl, renderAppointmentEmail } from "./appointmentEmail";
import { getBookingHost } from "./bookingHost";
import { googleCalendarConnectionId } from "@/lib/googleCalendar";
import { bookingStartIso, bookingTimezones, formatBookingDate, formatBookingRange, HOST_TIMEZONE } from "./booking";

export function renderCancellationEmail(booking: { name: string; date: string; timeSlot: string; timezone?: string; cancellationNote?: string }) {
  const start = bookingStartIso(booking.date, booking.timeSlot);
  if (!start) throw new Error("Cancelled booking has an invalid appointment time.");
  const timezone = bookingTimezones.some(zone => zone.value === booking.timezone) ? booking.timezone! : HOST_TIMEZONE;
  const date = formatBookingDate(start, timezone), time = formatBookingRange(start, timezone);
  const host = getBookingHost(), origin = siteUrl();
  const note = booking.cancellationNote?.trim();
  const subject = `Cancelled: your AriseStudio session on ${date}`;
  const text = `Hello ${booking.name},\n\nWe’re sorry for the change of plans. Please choose another time when it suits you.\n\nYour session is cancelled.\n\nDate: ${date}\nTime: ${time}\nTimezone: ${timezone}\nHost: ${host.name} (${host.title})\n${note ? `\nCancellation note:\n${note}\n` : ""}\nChoose a new time: ${origin}/schedule\n\nKind regards,\nAriseStudio`;
  const html = renderAppointmentEmail({ cancelled: true, name: booking.name, date, time, timezone, cancellationNote: note });
  return { subject, text, html };
}

// Called with Next.js after() so SMTP cannot delay availability or reservation responses.
export async function sendPendingCancellationEmails(): Promise<void> {
  const connectionId = googleCalendarConnectionId();
  if (!connectionId) return;
  try {
    const mail = mailTransport();
    if (!mail) return;
    const database = await getDatabase();
    const pending = await database.execute({
      sql: `SELECT mail.eventId, event.snapshot FROM booking_cancellation_emails mail
        JOIN booking_calendar_events event ON event.eventId = mail.eventId
        WHERE mail.sentAt IS NULL AND mail.claimUntil <= ? AND event.cancelledAt IS NOT NULL AND event.connectionId = ?
        ORDER BY event.cancelledAt LIMIT 5`,
      args: [Date.now(), connectionId],
    });
    if (!pending.rows.length) return;
    for (const row of pending.rows) {
      const claim = await database.execute({
        sql: "UPDATE booking_cancellation_emails SET claimUntil = ? WHERE eventId = ? AND sentAt IS NULL AND claimUntil <= ? RETURNING eventId",
        args: [Date.now() + 120000, row.eventId, Date.now()],
      });
      if (!claim.rows.length) continue;
      try {
        const booking: unknown = JSON.parse(String(row.snapshot));
        if (!booking || typeof booking !== "object" || !("name" in booking) || typeof booking.name !== "string" || !("email" in booking) || typeof booking.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email) || !("date" in booking) || typeof booking.date !== "string" || !("timeSlot" in booking) || typeof booking.timeSlot !== "string") throw new Error("Invalid cancelled booking snapshot.");
        const content = renderCancellationEmail({ name: booking.name, date: booking.date, timeSlot: booking.timeSlot, timezone: "timezone" in booking && typeof booking.timezone === "string" ? booking.timezone : HOST_TIMEZONE, cancellationNote: "cancellationNote" in booking && typeof booking.cancellationNote === "string" ? booking.cancellationNote : undefined });
        await mail.transporter.sendMail({
          from: `"AriseStudio Appointments" <${mail.sender}>`, to: booking.email,
          replyTo: clean(process.env.CONTACT_NOTIFICATION_EMAIL) || mail.sender,
          messageId: `<cancellation.${createHash("sha256").update(String(row.eventId)).digest("hex")}@${new URL(siteUrl()).hostname}>`,
          ...content,
        });
        // shortcut: SMTP acceptance before a process crash can duplicate mail; use provider idempotency for exactly-once delivery.
        await database.execute({ sql: "UPDATE booking_cancellation_emails SET sentAt = ? WHERE eventId = ?", args: [new Date().toISOString(), row.eventId] });
      } catch {
        console.error("[Cancellation Email]: Delivery failed; queued for retry.");
        await database.execute({ sql: "UPDATE booking_cancellation_emails SET claimUntil = ? WHERE eventId = ? AND sentAt IS NULL", args: [Date.now() + 60000, row.eventId] });
      }
    }
  } catch {
    console.error("[Cancellation Email]: Queue unavailable; cancellation remains saved.");
  }
}
