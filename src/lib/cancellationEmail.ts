import { createHash } from "node:crypto";
import { mailTransport, cleanEnvValue as clean } from "./mail";
import { getDatabase } from "./turso";
import { getBookingHost } from "./bookingHost";
import { googleCalendarConnectionId } from "@/lib/googleCalendar";
import { bookingStartIso, bookingTimezones, formatBookingDate, formatBookingRange, HOST_TIMEZONE } from "./booking";

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

function siteUrl(): string {
  const url = new URL(clean(process.env.SITE_URL) || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || "arise-studio-website.vercel.app"}`);
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new Error("SITE_URL must be an HTTP(S) origin without credentials.");
  return url.origin;
}

export function renderCancellationEmail(booking: { name: string; date: string; timeSlot: string; timezone?: string }) {
  const start = bookingStartIso(booking.date, booking.timeSlot);
  if (!start) throw new Error("Cancelled booking has an invalid appointment time.");
  const timezone = bookingTimezones.some(zone => zone.value === booking.timezone) ? booking.timezone! : HOST_TIMEZONE;
  const date = formatBookingDate(start, timezone), time = formatBookingRange(start, timezone);
  const host = getBookingHost(), origin = siteUrl();
  const subject = `Cancelled: your AriseStudio session on ${date}`;
  const text = `Hi ${booking.name},\n\nYour 30-minute discovery session has been cancelled.\n\nDate: ${date}\nTime: ${time}\nTimezone: ${timezone}\nHost: ${host.name} (${host.title})\n\nPlease do not use the previous meeting link for this cancelled session. Choose a new time: ${origin}/schedule\n\nAriseStudio`;
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>Appointment cancelled · AriseStudio</title></head>
<body style="margin:0;padding:0;background:#f2f5f8;font-family:Arial,Helvetica,sans-serif;color:#152235;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Your AriseStudio session has been cancelled. Choose another time whenever you are ready.</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f2f5f8;"><tr><td align="center" style="padding:36px 16px;">
    <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="width:100%;max-width:560px;background:#ffffff;border:1px solid #e1e8ef;border-radius:18px;overflow:hidden;">
      <tr><td style="background:#09101d;padding:25px 30px;border-bottom:3px solid #10b981;">
        <img src="${origin}/brand/arisestudio-logo-darkmode.png" alt="AriseStudio" width="152" height="45" style="display:block;width:152px;height:45px;object-fit:contain;border:0;">
      </td></tr>
      <tr><td style="padding:32px 30px 30px;">
        <span style="display:inline-block;padding:7px 11px;border-radius:6px;background:#fff1f2;color:#be123c;font-size:11px;font-weight:bold;letter-spacing:1px;">APPOINTMENT CANCELLED</span>
        <h1 style="margin:19px 0 12px;font-size:27px;line-height:1.25;letter-spacing:-.5px;color:#152235;">A change to your plans.</h1>
        <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#526174;">Hi ${escapeHtml(booking.name)}, your discovery session with AriseStudio has been cancelled.</p>
        <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#526174;">We would still love to connect. You can choose another time whenever you are ready.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f9fb;border:1px solid #e5ebf0;border-radius:12px;">
          <tr><td style="padding:20px 22px;">
            <p style="margin:0 0 13px;font-size:10px;letter-spacing:1.5px;color:#8491a3;font-weight:bold;">CANCELLED SESSION · 30 MINUTES</p>
            <p style="margin:0 0 6px;font-size:16px;font-weight:bold;color:#152235;">${escapeHtml(date)}</p>
            <p style="margin:0 0 5px;font-size:14px;color:#526174;">${escapeHtml(time)}</p>
            <p style="margin:0 0 18px;font-size:12px;color:#8491a3;">${escapeHtml(timezone)}</p>
            <p style="margin:0;padding-top:15px;border-top:1px solid #e1e8ef;font-size:14px;line-height:1.6;color:#152235;"><strong>${escapeHtml(host.name)}</strong><br><span style="font-size:12px;color:#526174;">${escapeHtml(host.title)}</span></p>
          </td></tr>
        </table>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:26px 0 14px;">
          <a href="${origin}/schedule" style="display:inline-block;padding:15px 28px;background:#059669;color:#ffffff;border-radius:8px;font-size:14px;font-weight:bold;text-decoration:none;">Choose a new time &nbsp;→</a>
        </td></tr></table>
        <p style="margin:0;text-align:center;font-size:12px;line-height:1.7;color:#8491a3;">Please do not use the previous meeting link for this cancelled session.</p>
      </td></tr>
      <tr><td style="padding:20px 30px;background:#f7f9fb;border-top:1px solid #e5ebf0;text-align:center;">
        <p style="margin:0;font-size:12px;line-height:1.8;color:#8491a3;">Questions? Reply to this email. We are happy to help.<br>© ${new Date().getFullYear()} AriseStudio</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
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
        const content = renderCancellationEmail({ name: booking.name, date: booking.date, timeSlot: booking.timeSlot, timezone: "timezone" in booking && typeof booking.timezone === "string" ? booking.timezone : HOST_TIMEZONE });
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
