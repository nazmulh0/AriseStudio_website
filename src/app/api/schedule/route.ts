import { NextResponse, connection, after } from "next/server";
import { randomUUID } from "node:crypto";
import { sendPendingContactNotifications } from "@/lib/contactNotification";
import { syncCancelledBookings } from "@/lib/bookingSync";
import { sendPendingCancellationEmails } from "@/lib/cancellationEmail";
import { getDatabase, legacyBookedSlots, reserveBooking } from "@/lib/turso";
import { googleCalendarConnectionId } from "@/lib/googleCalendar";
import { bookingStartIso, bookingTimezones, HOST_TIMEZONE } from "@/lib/booking";
import { limitSubmission, readSubmission, SubmissionError } from "@/lib/submissions";
import { bookingTokenHash, newBookingToken, requestBookingToken, existingBooking, bookingResponse, processBookingDelivery, processPendingBookingDeliveries } from "@/lib/bookingDelivery";

export async function POST(req: Request) {
  try {
    await limitSubmission(req, "schedule");
    const booking = await readSubmission(req, {
      name: { min: 1, max: 120 }, email: { min: 1, max: 254 }, phone: { min: 1, max: 64 },
      company: { max: 300 }, date: { min: 1, max: 60 }, timeSlot: { min: 1, max: 10 },
      timezone: { max: 100 }, service: { max: 100 }, notes: { max: 5000 },
    });
    const { name, email, phone, company, date, timeSlot, service, notes } = booking;
    const timezone = booking.timezone || HOST_TIMEZONE;
    const snapshot = { name, email, phone, company, date, timeSlot, timezone, service, notes };
    const token = requestBookingToken(req) || newBookingToken();
    const previous = await existingBooking(token, snapshot);
    if (previous) return NextResponse.json({ ...previous, recoveryToken: token }, { headers: { "Cache-Control": "no-store" } });
    if (!bookingTimezones.some(zone => zone.value === timezone)) throw new SubmissionError("Please choose a supported timezone.");
    const startIso = bookingStartIso(date, timeSlot);
    if (!startIso || Date.parse(startIso) <= Date.now()) throw new SubmissionError("Please choose a valid future appointment during studio hours.");
    await limitSubmission(req, "schedule", email);
    after(sendPendingCancellationEmails);
    after(sendPendingContactNotifications);
    after(processPendingBookingDeliveries);
    await syncCancelledBookings();
    const eventId = randomUUID().replace(/-/g, "");
    try {
      await reserveBooking(snapshot, { eventId, connectionId: googleCalendarConnectionId() || "", recoveryHash: bookingTokenHash(token) });
    } catch (error) {
      const concurrent = await existingBooking(token, snapshot);
      if (concurrent) return NextResponse.json({ ...concurrent, recoveryToken: token }, { headers: { "Cache-Control": "no-store" } });
      throw error;
    }
    // Reservation is committed before provider work. The same event ID is used for recovery.
    await processBookingDelivery(eventId);
    return NextResponse.json({ ...await bookingResponse(token), recoveryToken: token }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SubmissionError) return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    console.error("[Schedule API]: Reservation response unavailable.");
    return NextResponse.json({ success: false, error: "We could not finish your request. If you submitted it, use booking recovery before choosing another slot." }, { status: 503 });
  }
}

export async function GET() {
  await connection();
  try {
    after(sendPendingCancellationEmails);
    after(sendPendingContactNotifications);
    after(processPendingBookingDeliveries);
    await syncCancelledBookings();
    const database = await getDatabase();
    const result = await database.execute("SELECT date, timeSlot FROM bookings");
    const bookedSlots = [...await legacyBookedSlots(), ...result.rows.map(row => `${row.date}_${row.timeSlot}`)];
    return NextResponse.json({ success: true, bookedSlots: Array.from(new Set(bookedSlots)) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ success: false, error: "Booking availability is temporarily unavailable. Please try again." }, { status: 503 });
  }
}
