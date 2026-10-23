import { NextResponse, after } from "next/server";
import { bookingResponse, requestBookingToken, retryBookingDelivery, processBookingDelivery, processPendingBookingDeliveries } from "@/lib/bookingDelivery";
import { limitSubmission, SubmissionError } from "@/lib/submissions";

async function respond(req: Request, retry: boolean) {
  try {
    const token = requestBookingToken(req);
    if (!token) throw new SubmissionError("A booking recovery token is required.", 401);
    const response = await bookingResponse(token);
    if (!response) throw new SubmissionError("Booking not found.", 404);
    if (retry) {
      await limitSubmission(req, "booking-retry");
      const id = await retryBookingDelivery(token);
      after(() => processBookingDelivery(id));
    } else after(processPendingBookingDeliveries);
    return NextResponse.json(response, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const status = error instanceof SubmissionError ? error.status : 503;
    return NextResponse.json({ success: false, error: error instanceof SubmissionError ? error.message : "Booking recovery is temporarily unavailable." }, { status });
  }
}

export const GET = (req: Request) => respond(req, false);
export const POST = (req: Request) => respond(req, true);
