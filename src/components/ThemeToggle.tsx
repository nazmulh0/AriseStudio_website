"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { THEME_EVENT, THEME_KEY } from "@/lib/theme";

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  return () => window.removeEventListener(THEME_EVENT, callback);
}
const snapshot = () => document.documentElement.dataset.themePreference ?? "system";
const choices = [
  { value: "system", label: "Device theme", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

export default function ThemeToggle() {
  const preference = useSyncExternalStore(subscribe, snapshot, () => "system");
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const Icon = preference === "system" ? Monitor : preference === "dark" ? Moon : Sun;

  useEffect(() => {
    if (!open) return;
    container.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus();
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  function choose(value: string) {
    try {
      if (value === "system") localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, value);
    } catch {
      /* The choice still applies to this page when storage is blocked. */
    }
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: value }));
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <div
      ref={container}
      className="relative shrink-0"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-label="Color theme"
        aria-expanded={open}
        aria-controls="theme-options"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line/70 bg-transparent text-ink transition-colors hover:bg-surface-muted/80"
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </button>
      {open && (
        <div
          id="theme-options"
          role="group"
          aria-label="Color theme options"
          className="frosted-popover absolute right-0 top-full z-20 mt-5 w-56 max-w-[calc(100vw-2rem)] rounded-2xl p-1.5 sm:left-1/2 sm:right-auto sm:-translate-x-1/2"
        >
          <p className="px-3 pb-2 pt-2.5 text-[11px] font-semibold uppercase tracking-[.14em] text-ink">Appearance</p>
          {choices.map((choice) => (
            <button
              key={choice.value}
              type="button"
              aria-pressed={preference === choice.value}
              onClick={() => choose(choice.value)}
              className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-ink transition-colors ${preference === choice.value ? "bg-accent/10" : "hover:bg-surface-muted/60"}`}
            >
              <choice.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="flex-1">
                <span className="block font-semibold">{choice.label}</span>
                {choice.value === "system" && <span className="mt-0.5 block text-xs text-ink">Automatic</span>}
              </span>
              {preference === choice.value && <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
