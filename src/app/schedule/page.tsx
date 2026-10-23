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
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-accent/20 via-accent/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Clean Header - AriseSell Style */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            Schedule a <span className="gradient-text-teal-emerald">Discovery Call</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            30-minute technical architecture consultation with our engineering team.
          </p>
        </div>

        <p className="mb-5 text-center text-xs text-muted">We use your details to arrange this call. <a href="/privacy" className="text-accent underline underline-offset-4">Privacy notice</a></p>
        {/* Appointment Scheduler Widget */}
        <Suspense
          fallback={
            <div className="w-full max-w-7xl mx-auto rounded-3xl bg-canvas/90 backdrop-blur-xl border border-line p-16 text-center flex items-center justify-center gap-2 text-muted">
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

