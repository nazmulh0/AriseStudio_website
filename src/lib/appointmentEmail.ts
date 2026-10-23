import { getBookingHost } from "./bookingHost";
import { cleanEnvValue } from "./mail";

export const escapeEmailHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

export function appointmentSiteUrl(): string {
  const url = new URL(cleanEnvValue(process.env.SITE_URL) || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || "arise-studio-website.vercel.app"}`);
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new Error("SITE_URL must be an HTTP(S) origin without credentials.");
  return url.origin;
}

interface AppointmentEmail {
  cancelled: boolean;
  name: string;
  date: string;
  time: string;
  timezone: string;
  meetUrl?: string;
  calendarUrl?: string;
  notes?: string;
  cancellationNote?: string;
}

export function renderAppointmentEmail(details: AppointmentEmail): string {
  const { cancelled, name, date, time, meetUrl, calendarUrl } = details;
  const note = (cancelled ? details.cancellationNote : details.notes)?.trim();
  const host = getBookingHost(), origin = appointmentSiteUrl(), escape = escapeEmailHtml;
  const title = cancelled ? "Your session is cancelled." : "Your session is confirmed.";
  const message = cancelled
    ? "We’re sorry for the change of plans. Please choose another time when it suits you."
    : "Thank you for booking with AriseStudio. We look forward to our conversation.";
  const actionUrl = cancelled ? `${origin}/schedule` : meetUrl;
  const showCalendar = !cancelled && Boolean(calendarUrl);
  const firstUrl = actionUrl || (showCalendar ? calendarUrl : undefined);
  const safeMeetUrl = meetUrl ? new URL(meetUrl) : null;
  if (safeMeetUrl && (safeMeetUrl.protocol !== "https:" || safeMeetUrl.hostname !== "meet.google.com" || safeMeetUrl.username || safeMeetUrl.password)) throw new Error("Invalid Google Meet URL.");
  const button = "display:block;height:46px;line-height:44px;padding:0 8px;box-sizing:border-box;border:1px solid;border-radius:8px;font-size:12px;font-weight:bold;text-align:center;text-decoration:none;white-space:nowrap;";
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<title>${title} · AriseStudio</title>
<style>
body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
table { border-collapse:separate; mso-table-lspace:0; mso-table-rspace:0; }
a { text-decoration:none; }
@media only screen and (max-width:480px) {
  .outer { padding:16px 10px !important; }
  .inset { padding-left:20px !important; padding-right:20px !important; }
  .headline { font-size:23px !important; }
}
</style></head>
<body style="margin:0;padding:0;background-color:#f2f7f3;font-family:Arial,Helvetica,sans-serif;color:#234e37;">
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escape(`${date} · ${time}`)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background-color:#f2f7f3;"><tr><td class="outer" align="center" style="padding:32px 16px;">
<!--[if mso]><table role="presentation" width="600" align="center"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;table-layout:fixed;background-color:#ffffff;border:1px solid #d7e5dc;border-radius:16px;overflow:hidden;">
<tr><td class="inset" align="center" bgcolor="#eaf4ed" style="text-align:center;padding:18px 28px;background-color:#eaf4ed;border-radius:15px 15px 0 0;border-bottom:1px solid #d7e5dc;">
<a href="${origin}" style="display:inline-block;"><img src="${origin}/brand/arisestudio-logo.png" alt="AriseStudio" width="132" style="display:block;width:132px;height:auto;border:0;color:#ffffff;font-size:20px;font-weight:bold;"></a>
</td></tr>
<tr><td class="inset" style="padding:28px;">
<h1 class="headline" style="margin:0 0 20px;color:#1c603c;font-size:25px;line-height:32px;font-weight:700;letter-spacing:-.5px;">${title}</h1>
<p style="margin:0 0 8px;color:#234e37;font-size:14px;line-height:22px;word-break:break-word;">Hello ${escape(name)},</p>
<p style="margin:0 0 24px;color:#54735f;font-size:13px;line-height:22px;">${message}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;table-layout:fixed;">
<tr><td style="padding:0 0 20px;border-bottom:1px solid #e1ebe4;">
<p style="margin:0 0 6px;color:#234e37;font-size:17px;line-height:25px;font-weight:bold;">${escape(date)}</p>
<p style="margin:0 0 6px;color:#234e37;font-size:15px;line-height:23px;">${escape(time)}</p>
<p style="margin:0;color:#54735f;font-size:12px;line-height:18px;">30 min${cancelled ? "" : " · Google Meet"}</p>
</td></tr>
<tr><td style="padding:16px 0;">
<p style="margin:0;color:#234e37;font-size:13px;line-height:21px;font-weight:bold;word-break:break-word;">${escape(host.name)}</p>
<p style="margin:0;color:#54735f;font-size:12px;line-height:19px;word-break:break-word;">${escape(host.title)}</p>
</td></tr>
${note ? `<tr><td style="padding:0 0 16px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;table-layout:fixed;"><tr><td style="padding:0 0 0 12px;border-left:2px solid #bdd8c6;">
<p style="margin:0 0 4px;color:#54735f;font-size:11px;line-height:18px;">${cancelled ? "A note from your host" : "Your note"}</p>
<p style="margin:0;color:#3b614b;font-size:13px;line-height:21px;white-space:pre-wrap;word-break:break-word;">${escape(note)}</p>
</td></tr></table></td></tr>` : ""}
${actionUrl || showCalendar ? `<tr><td style="padding:8px 0 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;table-layout:fixed;"><tr>
${cancelled ? '<td width="26%" style="width:26%;padding:0;font-size:0;line-height:0;">&nbsp;</td>' : ""}
<td width="48%" valign="top" style="width:48%;padding:0;">${firstUrl ? `<a href="${escape(firstUrl)}" target="_blank" rel="noopener noreferrer" style="${button}${actionUrl ? "background-color:#1c7147;border-color:#1c7147;color:#ffffff;" : "background-color:#f4faf6;border-color:#89ad96;color:#235c3c;"}">${actionUrl ? cancelled ? "Choose a new time" : "Join meeting" : "Add to Calendar"}</a>` : ""}</td>
${cancelled ? '<td width="26%" style="width:26%;padding:0;font-size:0;line-height:0;">&nbsp;</td>' : `<td width="4%" style="width:4%;padding:0;font-size:0;line-height:0;">&nbsp;</td>
<td width="48%" valign="top" style="width:48%;padding:0;">${actionUrl && showCalendar && calendarUrl ? `<a href="${escape(calendarUrl)}" target="_blank" rel="noopener noreferrer" style="${button}background-color:#f4faf6;border-color:#89ad96;color:#235c3c;">Add to Calendar</a>` : ""}</td>`}
</tr></table></td></tr>` : ""}
</table>
<p style="margin:24px 0 0;color:#54735f;font-size:12px;line-height:20px;">Kind regards,<br><strong style="font-weight:600;color:#235c3c;">AriseStudio</strong></p>
</td></tr>
<tr><td class="inset" align="center" style="text-align:center;padding:14px 28px;border-top:1px solid #e1ebe4;border-radius:0 0 15px 15px;color:#718b7a;font-size:10px;line-height:16px;">© ${new Date().getFullYear()} AriseStudio</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>`;
}
