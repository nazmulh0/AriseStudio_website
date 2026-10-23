import { createHash, randomBytes } from "node:crypto";
import { getDatabase } from "./turso";
import { bookingStartIso, HOST_TIMEZONE } from "./booking";
import { getBookingHost } from "./bookingHost";
import { createGoogleCalendarEvent, googleCalendarConnectionId } from "@/lib/googleCalendar";
import { confirmationEmail } from "./bookingEmail";
import { mailTransport } from "./mail";
import { SubmissionError } from "./submissions";
import type { Booking } from "./turso";

export const newBookingToken = () => randomBytes(32).toString("hex");
export const bookingTokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
export function requestBookingToken(req: Request): string | null {
  const header = req.headers.get("authorization");
  if (!header) return null;
  if (!/^Bearer [a-f0-9]{64}$/.test(header)) throw new SubmissionError("Invalid booking recovery token.");
  return header.slice(7);
}

async function tokenRecord(token: string) {
  const db = await getDatabase();
  const r = await db.execute({ sql: `SELECT delivery.*, event.snapshot, event.cancelledAt, event.connectionId
    FROM booking_delivery delivery JOIN booking_calendar_events event ON event.eventId = delivery.eventId
    WHERE delivery.recoveryHash = ?`, args: [bookingTokenHash(token)] });
  return r.rows[0];
}

export async function bookingResponse(token: string) {
  const row = await tokenRecord(token);
  if (!row) return null;
  const booking: Booking = JSON.parse(String(row.snapshot));
  const startIso = bookingStartIso(booking.date, booking.timeSlot);
  const state = row.cancelledAt || row.state === "cancelled" ? "cancelled" : String(row.state);
  const emailSent = Boolean(row.clientEmailSentAt);
  return {
    success: true, emailSent, hostEmailSent: Boolean(row.hostEmailSentAt),
    emailNotice: emailSent ? undefined : "Your slot is saved. We will retry the confirmation email. Please keep these details.",
    booking: { ...booking, startIso, googleMeetUrl: state === "ready" ? String(row.meetUrl || "") : "",
      calendarEventUrl: row.calendarEventUrl ? String(row.calendarEventUrl) : null,
      gcalStatus: state, gcalNotice: state === "ready" ? undefined : state === "cancelled" ? "This session has been cancelled." : "Your slot is saved. Meeting setup is still pending; you can check again or retry below." },
  };
}

export async function existingBooking(token: string, booking: Booking) {
  const row = await tokenRecord(token);
  if (!row) return null;
  const saved: Booking = JSON.parse(String(row.snapshot));
  if (Object.keys(booking).some(key => booking[key as keyof Booking] !== saved[key as keyof Booking])) throw new SubmissionError("This recovery token already belongs to another booking.", 409);
  return bookingResponse(token);
}

// Only new, linked reservations are recovered; historical unlinked bookings are never recreated.
export async function processBookingDelivery(eventId: string): Promise<void> {
  const db = await getDatabase(), lease = Date.now() + 90000;
  const claim = await db.execute({ sql: `UPDATE booking_delivery SET claimUntil = ?, attempts = attempts + 1
    WHERE eventId = ? AND claimUntil <= ? AND nextAttemptAt IS NOT NULL AND nextAttemptAt <= ?
      AND EXISTS (SELECT 1 FROM booking_calendar_events WHERE eventId = ? AND cancelledAt IS NULL)
    RETURNING *`, args: [lease, eventId, Date.now(), Date.now(), eventId] });
  if (!claim.rows.length) return;
  let nextAttemptAt: number | null = null;
  try {
    const links = await db.execute({ sql: "SELECT snapshot, connectionId, cancelledAt FROM booking_calendar_events WHERE eventId = ?", args: [eventId] });
    const link = links.rows[0], delivery = claim.rows[0];
    if (!link || link.cancelledAt || String(link.connectionId) !== googleCalendarConnectionId()) return;
    const booking: Booking = JSON.parse(String(link.snapshot));
    const startIso = bookingStartIso(booking.date, booking.timeSlot);
    if (!startIso || Date.parse(startIso) <= Date.now()) return;
    const host = getBookingHost();
    let state = String(delivery.state), meetUrl = String(delivery.meetUrl || ""), calendarEventUrl = delivery.calendarEventUrl;
    let retryable = false;
    if (state !== "ready" || !meetUrl) {
      const result = await createGoogleCalendarEvent({
        eventId, attempt: Number(delivery.attempts) > 1 || delivery.state !== "pending" || delivery.calendarEventUrl ? 1 : 0, startIso,
        title: `30-Min Discovery Session | AriseStudio with ${booking.name}`,
        description: `Technical Discovery Consultation with AriseStudio.\n\nAttendee: ${booking.name} (${booking.phone})\nEmail: ${booking.email}${booking.notes ? `\nNotes: ${booking.notes}` : ""}\n\nHost: ${host.name} (${host.title})`,
        attendeeName: booking.name, attendeeEmail: booking.email,
      });
      state = result.success && result.meetUrl ? "ready" : result.status || "failed";
      meetUrl = state === "ready" ? result.meetUrl || "" : "";
      calendarEventUrl = result.calendarEventUrl || calendarEventUrl;
      retryable = result.retryable;
      await db.execute({ sql: "UPDATE booking_delivery SET state = ?, meetUrl = ?, calendarEventUrl = ? WHERE eventId = ? AND claimUntil = ?", args: [state, meetUrl || null, calendarEventUrl, eventId, lease] });
    }
    const current = await db.execute({ sql: "SELECT cancelledAt FROM booking_calendar_events WHERE eventId = ?", args: [eventId] });
    if (state === "cancelled" || current.rows[0]?.cancelledAt) return;
    if (state === "ready" && meetUrl) {
      const mail = mailTransport();
      const pending = [!delivery.clientEmailSentAt && "client", !delivery.hostEmailSentAt && "host"].filter(Boolean);
      if (mail) {
        const content = confirmationEmail({ ...booking, timezone: booking.timezone || HOST_TIMEZONE, startIso, googleMeetUrl: meetUrl });
        await Promise.all(pending.map(async recipient => {
          try {
            await mail.transporter.sendMail({ from: `"AriseStudio Appointments" <${mail.sender}>`, to: recipient === "client" ? booking.email : mail.recipient,
              replyTo: recipient === "client" ? mail.recipient : booking.email,
              subject: recipient === "client" ? content.clientSubject : content.hostSubject,
              html: content.html, text: content.text, messageId: `<booking.${eventId}.${recipient}@arisestudio.com>` });
            const column = recipient === "client" ? "clientEmailSentAt" : "hostEmailSentAt";
            await db.execute({ sql: `UPDATE booking_delivery SET ${column} = ? WHERE eventId = ? AND claimUntil = ?`, args: [new Date().toISOString(), eventId, lease] });
          } catch { console.warn(`[Booking Email]: ${recipient} delivery pending.`); }
        }));
      }
      const sent = await db.execute({ sql: "SELECT clientEmailSentAt, hostEmailSentAt FROM booking_delivery WHERE eventId = ?", args: [eventId] });
      retryable = !sent.rows[0]?.clientEmailSentAt || !sent.rows[0]?.hostEmailSentAt;
    }
    if (retryable && (state === "ready" || Number(delivery.attempts) < 5)) nextAttemptAt = Date.now() + Math.min(60000 * 2 ** (Number(delivery.attempts) - 1), 900000);
  } catch {
    console.warn("[Booking Delivery]: Saved reservation needs another attempt.");
    if (Number(claim.rows[0].attempts) < 5) nextAttemptAt = Date.now() + 60000;
  } finally {
    await db.execute({ sql: "UPDATE booking_delivery SET claimUntil = 0, nextAttemptAt = ? WHERE eventId = ? AND claimUntil = ?", args: [nextAttemptAt, eventId, lease] });
  }
}

export async function retryBookingDelivery(token: string) {
  const row = await tokenRecord(token);
  if (!row) throw new SubmissionError("Booking not found.", 404);
  if (row.cancelledAt || row.state === "cancelled") throw new SubmissionError("This session has been cancelled.", 409);
  if (Number(row.claimUntil) <= Date.now()) {
    const db = await getDatabase();
    await db.execute({ sql: "UPDATE booking_delivery SET nextAttemptAt = 0, attempts = 0 WHERE eventId = ? AND claimUntil <= ?", args: [row.eventId, Date.now()] });
  }
  return String(row.eventId);
}

// shortcut: retries follow scheduler activity; use a scheduled worker if delivery must progress without site traffic.
export async function processPendingBookingDeliveries(): Promise<void> {
  try {
    const db = await getDatabase();
    const rows = await db.execute({ sql: `SELECT delivery.eventId FROM booking_delivery delivery
      JOIN booking_calendar_events event ON event.eventId = delivery.eventId
      WHERE event.cancelledAt IS NULL AND delivery.nextAttemptAt <= ? AND delivery.claimUntil <= ?
      AND event.connectionId = ? LIMIT 2`, args: [Date.now(), Date.now(), googleCalendarConnectionId() || ""] });
    for (const row of rows.rows) await processBookingDelivery(String(row.eventId));
  } catch { console.warn("[Booking Delivery]: Retry queue unavailable."); }
}
