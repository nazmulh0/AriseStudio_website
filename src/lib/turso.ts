import { createClient, type Client } from "@libsql/client";
import fs from "fs/promises";
import path from "path";
import { SubmissionError } from "./submissions";

let database: Promise<Client> | undefined;
const clean = (value?: string) => (value || "").trim().replace(/^(["'])(.*)\1$/, "$2").trim();

export async function getDatabase(): Promise<Client> {
  if (!database) database = openDatabase().catch(error => { database = undefined; throw error; });
  return database;
}

async function openDatabase(): Promise<Client> {
  let url = clean(process.env.TURSO_DATABASE_URL);
  if (!url) {
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === "production") {
      throw new Error("TURSO_DATABASE_URL is required in production. Local development uses data/arisestudio.db.");
    }
    await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
    url = `file:${path.join(process.cwd(), "data", "arisestudio.db")}`;
  }
  const client = createClient({ url, authToken: clean(process.env.TURSO_AUTH_TOKEN) || undefined });
  try {
    await client.execute(`CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, timeSlot TEXT NOT NULL,
      name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, company TEXT, timezone TEXT,
      service TEXT, notes TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, UNIQUE(date, timeSlot)
    )`);
    const columns = await client.execute("PRAGMA table_info(bookings)");
    if (!columns.rows.some(row => row.name === "phone")) await client.execute("ALTER TABLE bookings ADD COLUMN phone TEXT");
    await client.execute(`CREATE TABLE IF NOT EXISTS contact_leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT, submission TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    await client.execute(`CREATE TABLE IF NOT EXISTS booking_calendar_events (
      eventId TEXT PRIMARY KEY, connectionId TEXT NOT NULL DEFAULT '', bookingId INTEGER,
      legacyKey TEXT NOT NULL, snapshot TEXT NOT NULL, cancelledAt TEXT
    )`);
    await client.execute(`CREATE TABLE IF NOT EXISTS calendar_sync_state (
      connectionId TEXT PRIMARY KEY, syncToken TEXT NOT NULL
    )`);
    await client.execute(`CREATE TABLE IF NOT EXISTS booking_cancellation_emails (
      eventId TEXT PRIMARY KEY, sentAt TEXT, claimUntil INTEGER NOT NULL DEFAULT 0
    )`);
    await client.execute(`CREATE TABLE IF NOT EXISTS booking_delivery (
      eventId TEXT PRIMARY KEY, recoveryHash TEXT NOT NULL UNIQUE,
      state TEXT NOT NULL DEFAULT 'pending', meetUrl TEXT, calendarEventUrl TEXT,
      clientEmailSentAt TEXT, hostEmailSentAt TEXT, attempts INTEGER NOT NULL DEFAULT 0,
      claimUntil INTEGER NOT NULL DEFAULT 0, nextAttemptAt INTEGER
    )`);
    await client.execute(`CREATE TABLE IF NOT EXISTS submission_limits (
      key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL
    )`);
    await client.execute("CREATE INDEX IF NOT EXISTS submission_limits_expiry ON submission_limits(expires)");
    await client.execute(`CREATE TABLE IF NOT EXISTS contact_notification_delivery (
      leadId INTEGER PRIMARY KEY, sentAt TEXT, claimUntil INTEGER NOT NULL DEFAULT 0
    )`);
    return client;
  } catch (error) { client.close(); throw error; }
}

export interface Booking {
  date: string; timeSlot: string; name: string; email: string; phone: string;
  company: string; timezone: string; service: string; notes: string;
}

export function bookingIdentity(booking: Pick<Booking, "date" | "timeSlot" | "name" | "email">): string {
  return JSON.stringify([booking.date.trim().toLowerCase(), booking.timeSlot.trim().toLowerCase(), booking.name.trim(), booking.email.trim().toLowerCase()]);
}

// Source files remain intact; archived cancellations suppress only the matching old reservation.
export async function legacyBookings(): Promise<Booking[]> {
  const bookings: Booking[] = [];
  for (const filename of [path.join(process.cwd(), "data", "bookings.jsonl"), "/tmp/bookings.jsonl"]) {
    let content: string;
    try { content = await fs.readFile(filename, "utf8"); }
    catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") continue;
      throw error;
    }
    for (const line of content.split("\n").filter(Boolean)) {
      const entry = JSON.parse(line);
      if (typeof entry.date !== "string" || typeof entry.timeSlot !== "string") throw new Error("Invalid legacy booking record");
      bookings.push({ ...entry, name: typeof entry.name === "string" ? entry.name : "", email: typeof entry.email === "string" ? entry.email : "" });
    }
  }
  return bookings;
}

export async function legacyBookedSlots(): Promise<string[]> {
  const client = await getDatabase();
  const cancelled = await client.execute("SELECT legacyKey FROM booking_calendar_events WHERE cancelledAt IS NOT NULL");
  const archived = new Set(cancelled.rows.map(row => row.legacyKey));
  return (await legacyBookings()).filter(booking => !archived.has(bookingIdentity(booking))).map(booking => `${booking.date.trim()}_${booking.timeSlot.trim()}`);
}

export async function reserveBooking(booking: Booking, calendar?: { eventId: string; connectionId: string; recoveryHash?: string }): Promise<void> {
  const key = `${booking.date}_${booking.timeSlot}`.toLowerCase();
  if ((await legacyBookedSlots()).some(slot => slot.toLowerCase() === key)) throw new SubmissionError("This slot is already reserved. Please choose another time.", 409);
  const client = await getDatabase();
  const insert = {
    sql: `INSERT INTO bookings (date, timeSlot, name, email, phone, company, timezone, service, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(date, timeSlot) DO NOTHING RETURNING id`,
    args: [booking.date, booking.timeSlot, booking.name, booking.email, booking.phone, booking.company, booking.timezone, booking.service, booking.notes],
  };
  const result = calendar ? (await client.batch([insert, {
    sql: `INSERT INTO booking_calendar_events (eventId, connectionId, bookingId, legacyKey, snapshot)
      SELECT ?, ?, id, ?, ? FROM bookings WHERE date = ? AND timeSlot = ? AND changes() = 1`,
    args: [calendar.eventId, calendar.connectionId, bookingIdentity(booking), JSON.stringify(booking), booking.date, booking.timeSlot],
  }, ...(calendar.recoveryHash ? [{
    sql: "INSERT INTO booking_delivery (eventId, recoveryHash, nextAttemptAt) SELECT ?, ?, 0 WHERE EXISTS (SELECT 1 FROM booking_calendar_events WHERE eventId = ?)",
    args: [calendar.eventId, calendar.recoveryHash, calendar.eventId],
  }] : [])], "write"))[0] : await client.execute(insert);
  if (result.rows.length !== 1) throw new SubmissionError("This slot is already reserved. Please choose another time.", 409);
}
