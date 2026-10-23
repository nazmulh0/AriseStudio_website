"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { THEME_KEY } from "@/lib/theme";

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_KEY && event.key !== null) return;
    document.documentElement.classList.toggle(
      "dark",
      event.newValue === "dark" ||
        (event.newValue !== "light" &&
          matchMedia("(prefers-color-scheme: dark)").matches),
    );
    callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener("arisestudio-theme", callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("arisestudio-theme", callback);
  };
}
const snapshot = () => document.documentElement.classList.contains("dark");

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, snapshot, () => false);
  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => {
        document.documentElement.classList.toggle("dark", !dark);
        try {
          localStorage.setItem(THEME_KEY, dark ? "light" : "dark");
        } catch {
          /* The theme still works when storage is unavailable. */
        }
        window.dispatchEvent(new Event("arisestudio-theme"));
      }}
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink hover:bg-surface-muted"
    >
      <Sun className="hidden h-4 w-4 dark:block" aria-hidden="true" />
      <Moon className="h-4 w-4 dark:hidden" aria-hidden="true" />
    </button>
  );
}
