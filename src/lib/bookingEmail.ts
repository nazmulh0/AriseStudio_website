import type { Booking } from "./turso";
import { getBookingHost } from "./bookingHost";
import { formatBookingDate, formatBookingRange, googleCalendarUrl } from "./booking";
import { renderAppointmentEmail } from "./appointmentEmail";

export function confirmationEmail(booking: Booking & { startIso: string; googleMeetUrl: string }) {
  const { name, email, phone, notes, startIso, timezone, googleMeetUrl } = booking;
  const host = getBookingHost();
  const time = formatBookingRange(startIso, timezone), date = formatBookingDate(startIso, timezone);
  const sessionNotes = notes && notes !== "No additional notes provided" ? notes : "";
  const calendarUrl = googleCalendarUrl(startIso, `30 minutes with ${host.name} | AriseStudio`,
    `30-Minute Discovery Session with AriseStudio.\nAttendee: ${name} (${phone})\nEmail: ${email}\nHost: ${host.name} (${host.title})${sessionNotes ? `\nNotes: ${sessionNotes}` : ""}\nGoogle Meet: ${googleMeetUrl}`, googleMeetUrl);
  return {
    html: renderAppointmentEmail({ cancelled: false, name, notes: sessionNotes, date, time, timezone, meetUrl: googleMeetUrl, calendarUrl }),
    text: `Hello ${name},\n\nThank you for booking with AriseStudio. We look forward to our conversation.\n\nYour session is confirmed.\n\nDate: ${date}\nTime: ${time}\nTimezone: ${timezone}\nHost: ${host.name} (${host.title})\n\n${googleMeetUrl ? `Join with Google Meet: ${googleMeetUrl}` : "Your meeting link is being prepared."}\nAdd to Google Calendar: ${calendarUrl}\n${sessionNotes ? `\nYour notes: ${sessionNotes}\n` : ""}\nKind regards,\nAriseStudio`,
    clientSubject: `Confirmed: your AriseStudio discovery session on ${date}`,
    hostSubject: `[New Appointment] ${name.replace(/[\r\n]/g, " ")} · ${date} (${time})`,
  };
}
