import { getDatabase, legacyBookings, bookingIdentity, type Booking } from "./turso";
import { bookingStartIso } from "./booking";
import { readGoogleCalendarChanges, type CalendarEvent } from "@/lib/googleCalendar";

let syncing: Promise<void> | undefined;
let nextSyncAt = 0;

// shortcut: refresh while the scheduler is in use; add a worker/webhook for background sync at larger scale.
export async function syncCancelledBookings(): Promise<void> {
  if (syncing) return syncing;
  if (Date.now() < nextSyncAt) return;
  syncing = reconcile().catch(error => {
    console.error("[Calendar Cancellation Sync]:", error);
  }).finally(() => { nextSyncAt = Date.now() + 15000; syncing = undefined; });
  return syncing;
}

function matchesLegacy(event: CalendarEvent, booking: Booking): boolean {
  const start = bookingStartIso(booking.date, booking.timeSlot);
  return Boolean(start && booking.name && booking.email && !event.recurringEventId && event.organizer?.self === true &&
    event.summary === `30-Min Discovery Session | AriseStudio with ${booking.name.trim()}` &&
    Date.parse(event.start?.dateTime || "") === Date.parse(start) &&
    Date.parse(event.end?.dateTime || "") === Date.parse(start) + 30 * 60000 &&
    event.attendees?.some(attendee => attendee.email?.toLowerCase() === booking.email.trim().toLowerCase()));
}

async function reconcile(): Promise<void> {
  const database = await getDatabase();
  const rows = await database.execute("SELECT * FROM bookings");
  const links = await database.execute("SELECT * FROM booking_calendar_events");
  const linked = new Set(links.rows.map(row => row.legacyKey));
  const candidates = new Map<string, { booking: Booking; id: string | null }>();
  for (const booking of await legacyBookings()) {
    const start = bookingStartIso(booking.date, booking.timeSlot);
    if (start && Date.parse(start) > Date.now() && !linked.has(bookingIdentity(booking))) candidates.set(bookingIdentity(booking), { booking, id: null });
  }
  for (const row of rows.rows) {
    // libSQL rows are boundary data; only complete identities can be matched to legacy events.
    if (typeof row.date !== "string" || typeof row.timeSlot !== "string" || typeof row.name !== "string" || typeof row.email !== "string") continue;
    const booking: Booking = { date: row.date, timeSlot: row.timeSlot, name: row.name, email: row.email, phone: String(row.phone || ""), company: String(row.company || ""), timezone: String(row.timezone || ""), service: String(row.service || ""), notes: String(row.notes || "") };
    const start = bookingStartIso(booking.date, booking.timeSlot);
    if (start && Date.parse(start) > Date.now() && !linked.has(bookingIdentity(booking))) candidates.set(bookingIdentity(booking), { booking, id: String(row.id) });
  }
  if (!candidates.size && !links.rows.some(row => row.cancelledAt === null)) return;
  const state = await database.execute("SELECT connectionId, syncToken FROM calendar_sync_state");
  const tokens: Record<string, string> = {};
  // Legacy matching needs a full snapshot to detect ambiguous duplicate meetings.
  if (!candidates.size) for (const row of state.rows) tokens[String(row.connectionId)] = String(row.syncToken);
  const changes = await readGoogleCalendarChanges(tokens);
  if (!changes) return;
  const events = new Map(changes.events.map(event => [event.id, event]));
  for (const [key, { booking, id }] of candidates) {
    const matches = changes.events.filter(event => matchesLegacy(event, booking));
    if (matches.length !== 1) continue;
    await database.execute({
      sql: "INSERT INTO booking_calendar_events (eventId, connectionId, bookingId, legacyKey, snapshot) VALUES (?, ?, ?, ?, ?) ON CONFLICT(eventId) DO NOTHING",
      args: [matches[0].id, changes.connectionId, id, key, JSON.stringify(booking)],
    });
  }
  const active = await database.execute({ sql: "SELECT * FROM booking_calendar_events WHERE cancelledAt IS NULL AND connectionId = ?", args: [changes.connectionId] });
  for (const link of active.rows) {
    const event = events.get(String(link.eventId));
    // Absence, access errors and attendee declines are not cancellation evidence.
    if (event?.status !== "cancelled" || event.organizer?.self === false || event.recurringEventId) continue;
    const transaction = await database.transaction("write");
    try {
      const current = await transaction.execute({ sql: "SELECT * FROM booking_calendar_events WHERE eventId = ? AND cancelledAt IS NULL", args: [link.eventId] });
      if (current.rows.length) {
        const snapshot: Booking = JSON.parse(String(current.rows[0].snapshot));
        const booking = await transaction.execute({
          sql: "SELECT * FROM bookings WHERE id = ? AND date = ? AND timeSlot = ? AND name = ? AND lower(email) = lower(?)",
          args: [current.rows[0].bookingId, snapshot.date, snapshot.timeSlot, snapshot.name, snapshot.email],
        });
        await transaction.execute({
          sql: "UPDATE booking_calendar_events SET cancelledAt = ?, snapshot = ? WHERE eventId = ? AND cancelledAt IS NULL",
          args: [new Date().toISOString(), booking.rows.length ? JSON.stringify(booking.rows[0]) : String(current.rows[0].snapshot), link.eventId],
        });
        await transaction.execute({ sql: "INSERT INTO booking_cancellation_emails (eventId) VALUES (?) ON CONFLICT(eventId) DO NOTHING", args: [link.eventId] });
        if (booking.rows.length) await transaction.execute({ sql: "DELETE FROM bookings WHERE id = ?", args: [booking.rows[0].id] });
      }
      await transaction.commit();
    } catch (error) { await transaction.rollback(); throw error; }
    finally { transaction.close(); }
  }
  await database.execute({ sql: "INSERT INTO calendar_sync_state (connectionId, syncToken) VALUES (?, ?) ON CONFLICT(connectionId) DO UPDATE SET syncToken = excluded.syncToken", args: [changes.connectionId, changes.syncToken] });
}
