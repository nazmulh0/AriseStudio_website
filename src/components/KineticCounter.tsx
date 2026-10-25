"use client";

import { useEffect, useRef, useState } from "react";

interface KineticCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export default function KineticCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 1400,
  className = "",
}: KineticCounterProps) {
  const [value, setValue] = useState(0);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setValue(end);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            let startTime: number | null = null;

            const step = (timestamp: number) => {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              // Ease-out cubic: 1 - Math.pow(1 - progress, 3)
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              const currentVal = Math.floor(easeProgress * end);
              setValue(currentVal);

              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                setValue(end);
              }
            };

            requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [end, duration]);

  return (
    <span ref={counterRef} className={`tabular-nums ${className}`}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

