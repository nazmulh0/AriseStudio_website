import type { Booking } from "./turso";
import { getBookingHost } from "./bookingHost";
import { formatBookingDate, formatBookingRange, googleCalendarUrl } from "./booking";

const escapeHtml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

const CDN_BASE = "https://raw.githubusercontent.com/fksifat/AriseStudio_website/main";
const logoLightUrl = `${CDN_BASE}/public/brand/arisestudio-logo.png`;
const logoDarkUrl = `${CDN_BASE}/public/brand/arisestudio-logo-darkmode.png`;
const iconVideoUrl = `${CDN_BASE}/public/email-icons/video-meet.png`;
const iconCalendarUrl = `${CDN_BASE}/public/email-icons/calendar.png`;
const iconGlobeUrl = `${CDN_BASE}/public/email-icons/globe.png`;
const iconCheckUrl = `${CDN_BASE}/public/email-icons/check-circle.png`;
const iconCalendarBtnDarkUrl = `${CDN_BASE}/public/email-icons/calendar-btn-dark.png`;
const iconCalendarBtnLightUrl = `${CDN_BASE}/public/email-icons/calendar-btn.png`;


export function confirmationEmail(bookingData: Booking & { startIso: string; googleMeetUrl: string }) {
  const { name, email, phone, notes: notesStr, startIso, timezone: displayTimezone, googleMeetUrl } = bookingData;
  const host = getBookingHost();
  const timeRangeStr = formatBookingRange(startIso, displayTimezone);
  const displayDate = formatBookingDate(startIso, displayTimezone);
  const hasNotes = Boolean(notesStr && notesStr !== "No additional notes provided");
  const gCalUrl = googleCalendarUrl(startIso, `30 minutes with ${host.name} | AriseStudio`,
    `30-Minute Discovery Session with AriseStudio.\nAttendee: ${name} (${phone})\nEmail: ${email}\nHost: ${host.name} (${host.title})${hasNotes ? `\nNotes: ${notesStr}` : ""}\nGoogle Meet: ${googleMeetUrl}`, googleMeetUrl);
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Appointment Confirmation · AriseStudio</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    @media (prefers-color-scheme: dark) {
      .body-bg { background-color: #030712 !important; }
      .card-bg { background-color: #0b0f19 !important; border-color: #1e293b !important; }
      .header-bg { background-color: #0b0f19 !important; border-color: #1e293b !important; }
      .highlight-box { background-color: #111827 !important; border-color: #1f2937 !important; }
      .border-inner { border-color: #1f2937 !important; }
      .footer-bg { background-color: #080c16 !important; border-color: #1e293b !important; }
      .text-title { color: #ffffff !important; }
      .text-sub { color: #94a3b8 !important; }
      .text-body { color: #cbd5e1 !important; }
      .text-strong { color: #f8fafc !important; }
      .text-muted { color: #64748b !important; }
      .border-divider { border-color: #1e293b !important; }
      .badge-box { background-color: rgba(16, 185, 129, 0.12) !important; border-color: rgba(16, 185, 129, 0.3) !important; color: #34d399 !important; }
      .gcal-btn { background-color: #1e293b !important; border-color: #334155 !important; color: #f1f5f9 !important; }
      .logo-light { display: none !important; }
      .logo-dark { display: block !important; margin: 0 auto !important; }
      .gcal-icon-light { display: none !important; }
      .gcal-icon-dark { display: inline-block !important; }
    }
  </style>
</head>
<body class="body-bg" style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="body-bg" style="background-color: #f1f5f9; padding: 20px 12px;">
    <tr>
      <td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="card-bg" style="max-width: 520px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);">

  <!-- Brand Logo Header (Centered & Compact) -->
  <tr>
    <td class="header-bg" align="center" style="padding: 20px 20px 16px 20px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9; text-align: center;">
      <!-- Default Light Logo -->
      <div class="logo-light" style="display: block; text-align: center;">
        <img src="${logoLightUrl}" alt="AriseStudio" width="148" height="44" style="display: block; margin: 0 auto; width: 148px; max-width: 148px; height: auto; border: 0;" />
      </div>
      <!-- Dark Mode Logo -->
      <!--[if !mso]><!-->
      <div class="logo-dark" style="display: none; text-align: center;">
        <img src="${logoDarkUrl}" alt="AriseStudio" width="148" height="44" style="display: block; margin: 0 auto; width: 148px; max-width: 148px; height: auto; border: 0;" />
      </div>
      <!--<![endif]-->
    </td>
  </tr>

  <!-- Main Body (Compact) -->
  <tr>
    <td style="padding: 22px 24px 18px 24px;">
      <!-- Status Pill -->
      <div class="badge-box" style="display: inline-block; padding: 4px 10px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 9999px; color: #059669; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 12px;">
        <img src="${iconCheckUrl}" width="12" height="12" style="vertical-align: -1px; margin-right: 5px; display: inline-block; border: 0;" alt="" />
        30-Minute Consultation Confirmed
      </div>

      <!-- Main Heading -->
      <h1 class="text-title" style="color: #0f172a; font-size: 19px; font-weight: 700; line-height: 1.3; margin: 0 0 6px 0;">
        30 minutes with AriseStudio
      </h1>
      <p class="text-sub" style="color: #475569; font-size: 13.5px; line-height: 1.45; margin: 0 0 16px 0;">
        Hi ${escapeHtml(bookingData.name)}, your discovery session has been scheduled with ${escapeHtml(host.name)}, ${escapeHtml(host.title)}. Here are your meeting details:
      </p>

      <!-- Session Highlight Card (Compact) -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="highlight-box" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 16px;">
        <tr>
          <td style="padding: 14px 16px;">
            <!-- Date & Time Row -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 6px;">
              <tr>
                <td width="22" valign="middle" style="vertical-align: middle; padding-right: 8px;">
                  <img src="${iconCalendarUrl}" width="15" height="15" style="display: block; width: 15px; height: 15px; border: 0;" alt="" />
                </td>
                <td valign="middle" style="vertical-align: middle;">
                  <span class="text-strong" style="color: #0f172a; font-size: 14px; font-weight: 600;">
                    ${escapeHtml(displayDate)} &nbsp;·&nbsp; ${escapeHtml(timeRangeStr)}
                  </span>
                </td>
              </tr>
            </table>

            <!-- Timezone Row -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
              <tr>
                <td width="22" valign="middle" style="vertical-align: middle; padding-right: 8px;">
                  <img src="${iconGlobeUrl}" width="15" height="15" style="display: block; width: 15px; height: 15px; border: 0;" alt="" />
                </td>
                <td valign="middle" style="vertical-align: middle;">
                  <span class="text-muted" style="color: #64748b; font-size: 11.5px; font-family: monospace;">
                    ${escapeHtml(bookingData.timezone)}
                  </span>
                </td>
              </tr>
            </table>

            <!-- Host Row -->
            <div class="border-inner" style="border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 8px; font-size: 12.5px;">
              <span class="text-muted" style="color: #64748b; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 2px;">Host</span>
              <strong class="text-strong" style="color: #0f172a;">${escapeHtml(host.name)}</strong> &nbsp;·&nbsp; <span class="text-sub" style="color: #475569;">${escapeHtml(host.title)}</span>
            </div>
          </td>
        </tr>
      </table>

      <!-- Google Meet CTA Box (Compact) -->
      ${googleMeetUrl ? `
      <div style="text-align: center; margin: 18px 0 14px 0;">
        <a href="${encodeURI(googleMeetUrl)}" target="_blank" rel="noopener noreferrer" style="display: block; width: 100%; box-sizing: border-box; background-color: #10b981; color: #022c22; font-size: 14px; font-weight: 700; text-align: center; text-decoration: none; padding: 11px 18px; border-radius: 8px; letter-spacing: 0.01em;">
          <img src="${iconVideoUrl}" width="16" height="16" style="vertical-align: -2px; display: inline-block; margin-right: 6px; border: 0;" alt="" />
          Join with Google Meet
        </a>
        <p class="text-muted" style="margin: 6px 0 0 0; font-size: 11.5px; color: #64748b; word-break: break-all; text-align: center;">
          Direct link: <a href="${encodeURI(googleMeetUrl)}" style="color: #0284c7; text-decoration: underline;">${escapeHtml(googleMeetUrl)}</a>
        </p>
        <div style="margin-top: 10px; text-align: center;">
          <a href="${gCalUrl}" target="_blank" rel="noopener noreferrer" class="gcal-btn" style="display: inline-block; color: #0f172a; background-color: #ffffff; border: 1px solid #cbd5e1; font-size: 12px; font-weight: 600; text-decoration: none; padding: 7px 14px; border-radius: 6px;">
            <span class="gcal-icon-light" style="display: inline-block; vertical-align: -2px; margin-right: 5px;">
              <img src="${iconCalendarBtnDarkUrl}" width="13" height="13" style="display: inline-block; vertical-align: middle; border: 0;" alt="" />
            </span>
            <!--[if !mso]><!-->
            <span class="gcal-icon-dark" style="display: none; vertical-align: -2px; margin-right: 5px;">
              <img src="${iconCalendarBtnLightUrl}" width="13" height="13" style="display: inline-block; vertical-align: middle; border: 0;" alt="" />
            </span>
            <!--<![endif]-->
            Add to Google Calendar
          </a>
        </div>
      </div>
      ` : `
      <div style="text-align: center; margin: 18px 0 14px 0;">
        <div style="margin-top: 10px; text-align: center;">
          <a href="${gCalUrl}" target="_blank" rel="noopener noreferrer" class="gcal-btn" style="display: inline-block; color: #0f172a; background-color: #ffffff; border: 1px solid #cbd5e1; font-size: 12px; font-weight: 600; text-decoration: none; padding: 7px 14px; border-radius: 6px;">
            <span class="gcal-icon-light" style="display: inline-block; vertical-align: -2px; margin-right: 5px;">
              <img src="${iconCalendarBtnDarkUrl}" width="13" height="13" style="display: inline-block; vertical-align: middle; border: 0;" alt="" />
            </span>
            <!--[if !mso]><!-->
            <span class="gcal-icon-dark" style="display: none; vertical-align: -2px; margin-right: 5px;">
              <img src="${iconCalendarBtnLightUrl}" width="13" height="13" style="display: inline-block; vertical-align: middle; border: 0;" alt="" />
            </span>
            <!--<![endif]-->
            Add to Google Calendar
          </a>
        </div>
      </div>
      `}

      <!-- Reservation Details Table (Compact) -->
      <div class="border-divider" style="border-top: 1px solid #e2e8f0; padding-top: 14px; margin-top: 16px;">
        <div class="text-muted" style="font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 8px;">
          Reservation Details
        </div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 12.5px;">
          <tr>
            <td class="text-muted" style="padding: 4px 0; color: #64748b; width: 110px;">Full Name</td>
            <td class="text-strong" style="padding: 4px 0; color: #0f172a; font-weight: 600;">${escapeHtml(bookingData.name)}</td>
          </tr>
          <tr>
            <td class="text-muted" style="padding: 4px 0; color: #64748b;">Email Address</td>
            <td style="padding: 4px 0; font-weight: 500;">
              <a href="mailto:${encodeURIComponent(bookingData.email)}" style="color: #0284c7; text-decoration: none;">${escapeHtml(bookingData.email)}</a>
            </td>
          </tr>
          <tr>
            <td class="text-muted" style="padding: 4px 0; color: #64748b;">Phone Number</td>
            <td style="padding: 4px 0; font-weight: 500;">
              <a href="tel:${escapeHtml(bookingData.phone)}" style="color: #0284c7; text-decoration: none;">${escapeHtml(bookingData.phone)}</a>
            </td>
          </tr>
          ${hasNotes ? `
          <tr>
            <td class="text-muted" style="padding: 4px 0; color: #64748b; vertical-align: top;">Notes</td>
            <td class="text-body" style="padding: 4px 0; color: #334155; font-weight: 400; line-height: 1.4; white-space: pre-wrap;">${escapeHtml(bookingData.notes)}</td>
          </tr>
          ` : ""}
        </table>
      </div>
    </td>
  </tr>

  <!-- Footer (Compact) -->
  <tr>
    <td class="footer-bg" style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px 20px; text-align: center;">
      <p class="text-muted" style="margin: 0 0 3px 0; font-size: 11.5px; color: #64748b; line-height: 1.4;">
        Need to reschedule or update details? Simply reply directly to this email or reach us at <a href="mailto:contact@arisestudio.com" style="color: #0284c7; text-decoration: none;">contact@arisestudio.com</a>.
      </p>
      <p style="margin: 0; font-size: 10.5px; color: #94a3b8;">
        © ${new Date().getFullYear()} AriseStudio · Architecture & Cloud Engineering
      </p>
    </td>
  </tr>
</table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return {
    html: htmlContent,
    text: `Your AriseStudio session is reserved.\n${displayDate}\n${timeRangeStr}\nHost: ${host.name} (${host.title})\n${googleMeetUrl ? `Google Meet: ${googleMeetUrl}` : "Your meeting link is being prepared."}`,
    clientSubject: `Confirmed: 30 minutes with AriseStudio on ${bookingData.date} (${timeRangeStr})`,
    hostSubject: `[New Appointment] 30m with ${bookingData.name.replace(/[\r\n]/g, " ")} - ${bookingData.date} (${timeRangeStr})`,
  };
}
