import { createHash, randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import { cleanEnvValue } from "./mail";

interface CreateMeetingParams {
  title: string; description: string; attendeeName: string; attendeeEmail: string;
  startIso: string; eventId?: string; attempt?: number;
}

export interface CalendarEventResult {
  success: boolean;
  status: "ready" | "pending" | "failed" | "cancelled";
  retryable: boolean;
  meetUrl: string | null;
  eventId: string | null;
  calendarEventUrl: string | null;
  error?: string;
}

class GoogleProviderError extends Error {
  constructor(message: string, public retryable: boolean) { super(message); }
}

async function getGoogleAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", signal: AbortSignal.timeout(5000),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: "refresh_token" }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) throw new GoogleProviderError("Google authorization is unavailable.", res.status === 429 || res.status >= 500);
  return data.access_token;
}

interface MeetingEvent {
  id?: string; status?: string; htmlLink?: string; hangoutLink?: string;
  organizer?: { self?: boolean }; start?: { dateTime?: string }; attendees?: { email?: string }[];
  conferenceData?: { createRequest?: { status?: { statusCode?: string } }; entryPoints?: { entryPointType: string; uri?: string }[] };
}

export async function createGoogleCalendarEvent(params: CreateMeetingParams): Promise<CalendarEventResult> {
  const clientId = cleanEnvValue(process.env.GOOGLE_CLIENT_ID), secret = cleanEnvValue(process.env.GOOGLE_CLIENT_SECRET), refresh = cleanEnvValue(process.env.GOOGLE_REFRESH_TOKEN);
  const eventId = params.eventId || randomUUID().replace(/-/g, "");
  let event: MeetingEvent | undefined;
  const result = (status: CalendarEventResult["status"], retryable: boolean, error?: string): CalendarEventResult => ({
    success: status === "ready", status, retryable, error,
    meetUrl: status === "ready" ? event?.hangoutLink || event?.conferenceData?.entryPoints?.find(point => point.entryPointType === "video")?.uri || null : null,
    eventId, calendarEventUrl: event?.htmlLink || null,
  });
  if (!clientId || !secret || !refresh) return result("failed", false, "Google Calendar credentials are missing.");
  try {
    const token = await getGoogleAccessToken(clientId, secret, refresh);
    const options = { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, cache: "no-store" as const, signal: AbortSignal.timeout(12000) };
    const base = "https://www.googleapis.com/calendar/v3/calendars/primary/events";
    const read = async (): Promise<MeetingEvent | undefined> => {
      const response = await fetch(`${base}/${encodeURIComponent(eventId)}`, options);
      if (response.status === 404) return undefined;
      if (response.status === 410) return { id: eventId, status: "cancelled" };
      const data = await response.json();
      if (!response.ok) throw new GoogleProviderError("Google Calendar event lookup failed.", response.status === 429 || response.status >= 500);
      if (data.id !== eventId || (data.status !== "cancelled" && (data.organizer?.self === false || Date.parse(data.start?.dateTime || "") !== Date.parse(params.startIso) || !data.attendees?.some((attendee: { email?: string }) => attendee.email?.toLowerCase() === params.attendeeEmail.toLowerCase())))) throw new GoogleProviderError("Calendar event identity does not match this reservation.", false);
      return data;
    };
    if (params.attempt) event = await read();
    if (!event) {
      const response = await fetch(`${base}?conferenceDataVersion=1&sendUpdates=all`, {
        ...options, method: "POST", body: JSON.stringify({
          id: eventId, summary: params.title, description: params.description,
          start: { dateTime: params.startIso, timeZone: "UTC" },
          end: { dateTime: new Date(Date.parse(params.startIso) + 1800000).toISOString(), timeZone: "UTC" },
          attendees: [{ email: params.attendeeEmail, displayName: params.attendeeName }],
          conferenceData: { createRequest: { requestId: randomUUID(), conferenceSolutionKey: { type: "hangoutsMeet" } } },
          reminders: { useDefault: false, overrides: [{ method: "email", minutes: 1440 }, { method: "popup", minutes: 15 }] },
        }),
      });
      if (response.status === 409) event = await read();
      else {
        const data = await response.json();
        if (!response.ok) {
          const quota = data.error?.errors?.some((error: { reason?: string }) => ["rateLimitExceeded", "userRateLimitExceeded"].includes(error.reason || ""));
          throw new GoogleProviderError("Google Calendar event creation failed.", response.status === 429 || response.status >= 500 || Boolean(quota));
        }
        event = data;
      }
    }
    if (event?.status === "cancelled") return result("cancelled", false);
    // A failed conference belongs to the same event; never insert another appointment.
    if (params.attempt && event?.conferenceData?.createRequest?.status?.statusCode === "failure") {
      const response = await fetch(`${base}/${encodeURIComponent(eventId)}?conferenceDataVersion=1&sendUpdates=all`, {
        ...options, method: "PATCH", body: JSON.stringify({ conferenceData: { createRequest: { requestId: randomUUID(), conferenceSolutionKey: { type: "hangoutsMeet" } } } }),
      });
      if (!response.ok) throw new GoogleProviderError("Google Meet generation could not be restarted.", response.status === 429 || response.status >= 500);
      event = await response.json();
    }
    for (let poll = 0; poll < 3; poll++) {
      if (event?.status === "cancelled") return result("cancelled", false);
      if (event?.hangoutLink || event?.conferenceData?.entryPoints?.some(point => point.entryPointType === "video" && point.uri)) return result("ready", false);
      if (event?.conferenceData?.createRequest?.status?.statusCode === "failure") return result("failed", true, "Google Meet generation failed.");
      if (poll < 2) { await delay(250 * 2 ** poll, undefined, { signal: options.signal }); event = await read() || event; }
    }
    return result("pending", true, "Google Meet is still being prepared.");
  } catch (error) {
    console.warn("[Google Calendar]:", error instanceof GoogleProviderError ? error.message : "Provider request interrupted.");
    return result("failed", error instanceof GoogleProviderError ? error.retryable : true, "Meeting setup could not finish. Your reservation is saved.");
  }
}

export interface CalendarEvent {
  id: string;
  status: string;
  summary?: string;
  organizer?: { self?: boolean; email?: string };
  start?: { dateTime?: string };
  end?: { dateTime?: string };
  attendees?: { email?: string }[];
  recurringEventId?: string;
}

// Scope sync state to the OAuth connection without requiring any new Google permissions.
export function googleCalendarConnectionId(): string | null {
  const clientId = cleanEnvValue(process.env.GOOGLE_CLIENT_ID);
  const refresh = cleanEnvValue(process.env.GOOGLE_REFRESH_TOKEN);
  return clientId && refresh ? createHash("sha256").update(`${clientId}\n${refresh}`).digest("hex") : null;
}

// A complete page chain is required: partial/error responses must never release a slot.
export async function readGoogleCalendarChanges(tokens: Record<string, string>): Promise<{
  connectionId: string; events: CalendarEvent[]; syncToken: string;
} | null> {
  const clientId = cleanEnvValue(process.env.GOOGLE_CLIENT_ID);
  const secret = cleanEnvValue(process.env.GOOGLE_CLIENT_SECRET);
  const refresh = cleanEnvValue(process.env.GOOGLE_REFRESH_TOKEN);
  if (!clientId || !secret || !refresh) return null;
  const accessToken = await getGoogleAccessToken(clientId, secret, refresh);
  const options = { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" as const, signal: AbortSignal.timeout(10000) };
  const connectionId = googleCalendarConnectionId();
  if (!connectionId) return null;
  let syncToken = tokens[connectionId];
  let pageToken = "";
  const events: CalendarEvent[] = [];
  const seenPages = new Set<string>();
  for (let page = 0; page < 100; page++) {
    const query = new URLSearchParams({ showDeleted: "true", maxResults: "2500" });
    if (syncToken) query.set("syncToken", syncToken);
    if (pageToken) query.set("pageToken", pageToken);
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${query}`, options);
    if (response.status === 410 && syncToken) {
      syncToken = ""; pageToken = ""; events.length = 0; seenPages.clear();
      continue;
    }
    if (!response.ok) throw new Error("Calendar changes are unavailable");
    const data = await response.json();
    if (data.accessRole !== "owner" || !Array.isArray(data.items) || data.items.some((event: CalendarEvent) => !event || typeof event.id !== "string" || !event.id || !["confirmed", "tentative", "cancelled"].includes(event.status))) {
      throw new Error("Incomplete organizer Calendar response");
    }
    events.push(...data.items);
    if (data.nextPageToken) {
      if (typeof data.nextPageToken !== "string" || seenPages.has(data.nextPageToken)) throw new Error("Invalid Calendar pagination");
      seenPages.add(data.nextPageToken); pageToken = data.nextPageToken;
    } else {
      if (typeof data.nextSyncToken !== "string" || !data.nextSyncToken) throw new Error("Calendar sync token is missing");
      return { connectionId, events, syncToken: data.nextSyncToken };
    }
  }
  throw new Error("Calendar page limit exceeded");
}
