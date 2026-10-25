import { Loader2 } from "lucide-react";

export default function ScheduleLoading() {
  return (
    <div data-compact-footer className="pt-28 pb-16 relative bg-canvas overflow-hidden min-h-screen">
      <div className="hero-ambient-glow" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-1">
        {/* Header Skeleton */}
        <div className="text-center max-w-xl mx-auto mb-6 space-y-2">
          <div className="w-64 h-10 rounded-2xl skeleton-shimmer mx-auto" />
          <div className="w-80 h-4 rounded-lg skeleton-shimmer mx-auto" />
        </div>

        {/* Scheduler Panel Skeleton */}
        <div className="w-full max-w-7xl mx-auto rounded-3xl border border-line bg-surface p-5 sm:p-7 shadow-panel space-y-6">
          {/* Host Toolbar Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full skeleton-shimmer shrink-0" />
              <div className="space-y-1.5">
                <div className="w-32 h-4 rounded-lg skeleton-shimmer" />
                <div className="w-24 h-3 rounded-md skeleton-shimmer" />
              </div>
            </div>
            <div className="w-40 h-8 rounded-xl skeleton-shimmer" />
          </div>

          {/* Sub Toolbar Skeleton */}
          <div className="flex justify-between items-center pb-3 border-b border-line">
            <div className="w-48 h-5 rounded-lg skeleton-shimmer" />
            <div className="flex items-center gap-2">
              <div className="w-28 h-4 rounded-lg skeleton-shimmer" />
              <div className="w-16 h-8 rounded-lg skeleton-shimmer" />
              <div className="w-16 h-8 rounded-lg skeleton-shimmer" />
            </div>
          </div>

          {/* Calendar & Slots Skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-7 items-start">
            {/* Left Mini Calendar Skeleton */}
            <div className="hidden xl:block space-y-4 border-r border-line pr-6">
              <div className="flex justify-between items-center">
                <div className="w-28 h-5 rounded-lg skeleton-shimmer" />
                <div className="flex gap-1">
                  <div className="w-7 h-7 rounded-lg skeleton-shimmer" />
                  <div className="w-7 h-7 rounded-lg skeleton-shimmer" />
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full skeleton-shimmer mx-auto" />
                ))}
              </div>
            </div>

            {/* Right Days & Slots Skeleton */}
            <div className="space-y-6">
              {/* 7 Days Row */}
              <div className="grid grid-cols-7 gap-2 sm:gap-2.5 pb-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-7 h-3 rounded skeleton-shimmer" />
                    <div className="w-10 h-10 rounded-full skeleton-shimmer" />
                  </div>
                ))}
              </div>

              {/* Slots Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-7 gap-2.5">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div key={i} className="w-full h-10 rounded-xl skeleton-shimmer" />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Loading Feedback */}
          <div className="pt-4 border-t border-line flex items-center justify-center gap-2 text-xs text-muted">
            <Loader2 className="w-4 h-4 animate-spin text-accent" />
            <span>Fetching real-time Google Calendar slot availability…</span>
          </div>
        </div>
      </div>
    </div>
  );
}

