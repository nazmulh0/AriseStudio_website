"use client";

import { useState, useSyncExternalStore } from "react";
import { RotateCw, WifiOff, X } from "lucide-react";

const subscribeOnline = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
};

const getOnlineSnapshot = () => {
  if (typeof window === "undefined") return true;
  return window.navigator.onLine;
};

const getServerSnapshot = () => true;

export default function NetworkStatusWatcher() {
  const isOnline = useSyncExternalStore(subscribeOnline, getOnlineSnapshot, getServerSnapshot);
  const [dismissed, setDismissed] = useState(false);
  const [reloading, setReloading] = useState(false);

  const handleReload = () => {
    setReloading(true);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  if (isOnline || dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)] animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-surface border border-warning/40 shadow-overlay text-ink text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="p-1.5 rounded-lg bg-warning/15 text-warning shrink-0">
            <WifiOff className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-ink truncate">Connection interrupted</p>
            <p className="text-xs text-muted truncate">Internet appears unstable or offline</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReload}
            disabled={reloading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent text-on-accent text-xs font-semibold hover:bg-accent-strong transition-colors cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${reloading ? "animate-spin" : ""}`} />
            <span>{reloading ? "Reloading..." : "Reload"}</span>
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg text-muted hover:text-ink hover:bg-surface-muted transition-colors cursor-pointer"
            title="Dismiss"
            aria-label="Dismiss connection notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

