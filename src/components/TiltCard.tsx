"use client";

import React, { useRef, useState, useEffect } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glareEffect?: boolean;
  spotlightBorder?: boolean;
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 7,
  glareEffect = true,
  spotlightBorder = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: -1000, y: -1000, opacity: 0 });

  // Physics animation state using refs for buttery 120fps LERP
  const target = useRef({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovering: false });
  const current = useRef({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (touch || reducedMotion) {
      setIsTouchDevice(true);
      return;
    }

    // Continuous LERP spring animation loop
    const animate = () => {
      const card = cardRef.current;
      if (!card) return;

      // Silky spring interpolation (LERP factor 0.12)
      const lerpFactor = 0.12;
      current.current.rotateX += (target.current.rotateX - current.current.rotateX) * lerpFactor;
      current.current.rotateY += (target.current.rotateY - current.current.rotateY) * lerpFactor;
      current.current.glareX += (target.current.glareX - current.current.glareX) * lerpFactor;
      current.current.glareY += (target.current.glareY - current.current.glareY) * lerpFactor;

      const targetOpacity = target.current.isHovering ? 0.18 : 0;
      current.current.glareOpacity += (targetOpacity - current.current.glareOpacity) * lerpFactor;

      const scale = target.current.isHovering ? 1.012 : 1;
      card.style.transform = `perspective(1000px) rotateX(${current.current.rotateX.toFixed(3)}deg) rotateY(${current.current.rotateY.toFixed(3)}deg) scale3d(${scale}, ${scale}, ${scale})`;

      const glareEl = card.querySelector<HTMLDivElement>(".tilt-glare-layer");
      if (glareEl) {
        glareEl.style.opacity = current.current.glareOpacity.toFixed(3);
        glareEl.style.background = `radial-gradient(circle 340px at ${current.current.glareX.toFixed(1)}% ${current.current.glareY.toFixed(1)}%, var(--accent) 0%, transparent 75%)`;
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    target.current.rotateX = -((y - centerY) / centerY) * maxTilt;
    target.current.rotateY = ((x - centerX) / centerX) * maxTilt;
    target.current.glareX = (x / rect.width) * 100;
    target.current.glareY = (y / rect.height) * 100;
    target.current.isHovering = true;

    if (spotlightBorder) {
      setSpotlightPos({ x, y, opacity: 1 });
    }
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    target.current.rotateX = 0;
    target.current.rotateY = 0;
    target.current.isHovering = false;
    if (spotlightBorder) {
      setSpotlightPos((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative will-change-transform ${className}`}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* Dynamic Cursor Spotlight Border illumination */}
      {spotlightBorder && !isTouchDevice && (
        <div
          className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300 z-10"
          style={{
            opacity: spotlightPos.opacity,
            background: `radial-gradient(circle 220px at ${spotlightPos.x}px ${spotlightPos.y}px, var(--accent) 0%, transparent 70%)`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: "1px",
          }}
          aria-hidden="true"
        />
      )}

      {children}

      {/* Dynamic Liquid Glass Sheen */}
      {glareEffect && !isTouchDevice && (
        <div
          className="tilt-glare-layer pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-0"
          style={{ opacity: 0 }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
