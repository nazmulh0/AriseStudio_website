import { pageMetadata } from "@/lib/site";
import { connection } from "next/server";
import { getBookingHost } from "@/lib/bookingHost";
import { Suspense } from "react";
import { Metadata } from "next";
import { Loader2 } from "lucide-react";
import AppointmentScheduler from "@/components/AppointmentScheduler";

export const metadata: Metadata = pageMetadata("Schedule a Call | AriseStudio", "Book a 30-minute technical architecture discovery call with AriseStudio's lead engineering team.", "/schedule");

async function Scheduler() {
  await connection();
  return <AppointmentScheduler host={getBookingHost()} />;
}

export default function SchedulePage() {
  return (
    <div data-compact-footer className="pt-28 pb-16 relative bg-canvas overflow-hidden min-h-screen">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Clean Header - AriseSell Style */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <h1 className="text-4xl sm:text-5xl font-semibold text-ink tracking-tight">
            Book a discovery call
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted">
            30-minute technical architecture consultation with our engineering team.
          </p>
        </div>

        <p className="mb-5 text-center text-xs text-muted">We use your details to arrange this call. <a href="/privacy" className="text-accent underline underline-offset-4">Privacy notice</a></p>
        {/* Appointment Scheduler Widget */}
        <Suspense
          fallback={
            <div className="w-full max-w-7xl mx-auto rounded-3xl bg-surface border border-line p-16 text-center flex items-center justify-center gap-2 text-muted">
              <Loader2 className="w-5 h-5 animate-spin text-accent" />
              <span className="text-xs">Loading calendar...</span>
            </div>
          }
        >
          <Scheduler />
        </Suspense>
      </div>
    </div>
  );
}

