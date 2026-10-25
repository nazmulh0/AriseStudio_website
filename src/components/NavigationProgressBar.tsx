"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const barRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const bar = barRef.current;
    if (!bar) return;

    bar.style.opacity = "1";
    bar.style.width = "25%";

    let currentProgress = 25;
    timerRef.current = setInterval(() => {
      currentProgress = Math.min(currentProgress + 15, 85);
      if (bar) {
        bar.style.width = `${currentProgress}%`;
      }
      if (currentProgress >= 85 && timerRef.current) {
        clearInterval(timerRef.current);
      }
    }, 150);
  };

  const completeProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const bar = barRef.current;
    if (!bar) return;

    bar.style.width = "100%";
    setTimeout(() => {
      if (bar) {
        bar.style.opacity = "0";
        setTimeout(() => {
          if (bar) bar.style.width = "0%";
        }, 200);
      }
    }, 200);
  };

  // Complete progress whenever the pathname or searchParams update
  useEffect(() => {
    completeProgress();
  }, [pathname, searchParams]);

  // Intercept click on internal links
  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      const target = anchor.getAttribute("target");
      if (target && target !== "_self") return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      try {
        const targetUrl = new URL(anchor.href, window.location.href);
        if (
          targetUrl.origin === window.location.origin &&
          (targetUrl.pathname !== window.location.pathname ||
            targetUrl.search !== window.location.search)
        ) {
          startProgress();
        }
      } catch {
        // Ignore malformed URLs
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, {
        capture: true,
      });
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[100] h-[2.5px] pointer-events-none bg-transparent"
    >
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-accent via-accent-strong to-accent transition-all duration-200 ease-out shadow-[0_0_10px_var(--accent)]"
        style={{ width: "0%", opacity: 0 }}
      />
    </div>
  );
}
