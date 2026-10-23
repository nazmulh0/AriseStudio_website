export const HOST_TIMEZONE = "Asia/Dhaka";
export const bookingTimezones = [
  { value: HOST_TIMEZONE, label: "Bangladesh" },
  { value: "America/New_York", label: "Eastern US & Canada" },
  { value: "America/Los_Angeles", label: "Pacific US & Canada" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Berlin", label: "Central Europe" },
  { value: "Asia/Dubai", label: "Dubai" },
  { value: "Asia/Singapore", label: "Singapore" },
];
export const bookingSlots = ["10:00am", "11:00am", "12:00pm", "1:00pm", "2:00pm", "3:00pm", "4:00pm"];

export function bookingStartIso(date: string, timeSlot: string): string | null {
  const parsed = new Date(`${date} 00:00:00 GMT+0000`);
  if (!Number.isFinite(parsed.getTime()) ||
      parsed.toLocaleDateString("en-US", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric", year: "numeric" }) !== date ||
      parsed.getUTCDay() === 5 || !bookingSlots.includes(timeSlot)) return null;
  const match = timeSlot.match(/^(\d+):00(am|pm)$/);
  if (!match) return null;
  const hour = Number(match[1]) % 12 + (match[2] === "pm" ? 12 : 0);
  parsed.setUTCHours(hour - 6);
  return parsed.toISOString();
}

export function hostToday(now = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: HOST_TIMEZONE, year: "numeric", month: "numeric", day: "numeric" }).formatToParts(now);
  const part = (type: string) => Number(parts.find(p => p.type === type)?.value);
  return new Date(part("year"), part("month") - 1, part("day"), 12);
}

export function formatBookingDate(startIso: string, timeZone: string): string {
  return new Date(startIso).toLocaleDateString("en-US", { timeZone, weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export function formatBookingTime(startIso: string, timeZone: string, includeZone = true): string {
  return new Date(startIso).toLocaleTimeString("en-US", { timeZone, hour: "numeric", minute: "2-digit", timeZoneName: includeZone ? "short" : undefined });
}

export function formatBookingRange(startIso: string, timeZone: string): string {
  const endIso = new Date(Date.parse(startIso) + 30 * 60000).toISOString();
  const formatter = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" });
  const zone = (iso: string) => formatter.formatToParts(new Date(iso)).find(part => part.type === "timeZoneName")?.value;
  const sameZone = zone(startIso) === zone(endIso);
  return `${formatBookingTime(startIso, timeZone, !sameZone)} – ${formatBookingTime(endIso, timeZone)}`;
}

export function googleCalendarUrl(startIso: string, title: string, details: string, location: string): string {
  const format = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: "TEMPLATE", text: title, dates: `${format(new Date(startIso))}/${format(new Date(Date.parse(startIso) + 30 * 60000))}`, details, location })}`;
}
