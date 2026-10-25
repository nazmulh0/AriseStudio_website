import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="pt-32 pb-24 relative bg-canvas overflow-hidden min-h-[85vh]">
      <div className="hero-ambient-glow" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-1">
        {/* Intro Skeleton */}
        <div className="page-intro border-b border-line pb-8 mb-12">
          {/* Eyebrow Pill */}
          <div className="w-36 h-6 rounded-full skeleton-shimmer mb-4" />

          {/* Heading Lines */}
          <div className="space-y-3 max-w-2xl">
            <div className="w-full h-10 sm:h-12 rounded-2xl skeleton-shimmer" />
            <div className="w-3/4 h-10 sm:h-12 rounded-2xl skeleton-shimmer" />
          </div>

          {/* Subheading Line */}
          <div className="mt-5 space-y-2 max-w-xl">
            <div className="w-full h-4 rounded-lg skeleton-shimmer" />
            <div className="w-5/6 h-4 rounded-lg skeleton-shimmer" />
          </div>
        </div>

        {/* Content Cards Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((card) => (
            <div
              key={card}
              className="p-6 sm:p-8 rounded-3xl border border-line bg-surface/70 space-y-4 shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl skeleton-shimmer" />
              <div className="w-2/3 h-6 rounded-xl skeleton-shimmer" />
              <div className="space-y-2 pt-2">
                <div className="w-full h-3.5 rounded-lg skeleton-shimmer" />
                <div className="w-4/5 h-3.5 rounded-lg skeleton-shimmer" />
                <div className="w-3/5 h-3.5 rounded-lg skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Loading Feedback */}
        <div className="mt-14 flex items-center justify-center gap-2.5 text-xs text-muted">
          <Loader2 className="w-4 h-4 animate-spin text-accent" />
          <span>Synchronizing page content…</span>
        </div>
      </div>
    </div>
  );
}

