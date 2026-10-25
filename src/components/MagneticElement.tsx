"use client";

import React, { useRef, useState, useEffect } from "react";

interface MagneticElementProps {
  children: React.ReactNode;
  strength?: number; // 0.1 to 0.4
  className?: string;
}

export default function MagneticElement({
  children,
  strength = 0.32,
  className = "",
}: MagneticElementProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (touch || reducedMotion) {
      setIsTouch(true);
      return;
    }

    // High performance continuous LERP loop
    const animate = () => {
      const el = elementRef.current;
      if (!el) return;

      const lerp = 0.14;
      current.current.x += (target.current.x - current.current.x) * lerp;
      current.current.y += (target.current.y - current.current.y) * lerp;

      // Small threshold to avoid unnecessary paint when near zero
      if (
        Math.abs(current.current.x) > 0.05 ||
        Math.abs(current.current.y) > 0.05 ||
        target.current.x !== 0
      ) {
        el.style.transform = `translate3d(${current.current.x.toFixed(2)}px, ${current.current.y.toFixed(2)}px, 0)`;
      } else {
        el.style.transform = "translate3d(0, 0, 0)";
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !elementRef.current) return;
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    target.current.x = (e.clientX - centerX) * strength;
    target.current.y = (e.clientY - centerY) * strength;
  };

  const handleMouseLeave = () => {
    if (isTouch) return;
    target.current.x = 0;
    target.current.y = 0;
  };

  return (
    <div
      ref={elementRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
