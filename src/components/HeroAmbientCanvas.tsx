"use client";

import { useEffect, useRef } from "react";
import { THEME_EVENT } from "@/lib/theme";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  opacity: number;
  colorVariation: number;
}

export default function HeroAmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect user motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    const particles: Particle[] = [];
    
    // Raw mouse target vs smoothly interpolated mouse (LERP for liquid feel)
    const rawMouse = { x: -2000, y: -2000, isOver: false };
    const smoothMouse = { x: -2000, y: -2000 };

    // Ripple wave effect on mouse interaction
    let rippleRadius = 0;
    let rippleMaxRadius = 180;
    let rippleOpacity = 0;
    let rippleOrigin = { x: 0, y: 0 };

    // Dynamic theme state detection
    let isDark = document.documentElement.classList.contains("dark");
    const updateThemeState = () => {
      isDark = document.documentElement.classList.contains("dark");
    };

    // Listen to theme events and root mutations
    window.addEventListener(THEME_EVENT, updateThemeState);
    const observer = new MutationObserver(() => updateThemeState());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);

      // Particle density optimized for silky 60-120 FPS
      const count = width < 640 ? 36 : width < 1024 ? 54 : 76;
      particles.length = 0;

      for (let i = 0; i < count; i++) {
        const radius = Math.random() * 2.2 + 1.2;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          baseRadius: radius,
          radius,
          opacity: Math.random() * 0.45 + 0.35,
          colorVariation: Math.random(),
        });
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      rawMouse.x = e.clientX - rect.left;
      rawMouse.y = e.clientY - rect.top;
      rawMouse.isOver = true;

      if (smoothMouse.x === -2000) {
        smoothMouse.x = rawMouse.x;
        smoothMouse.y = rawMouse.y;
      }
    };

    const onMouseLeave = () => {
      rawMouse.x = -2000;
      rawMouse.y = -2000;
      rawMouse.isOver = false;
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      rippleOrigin.x = e.clientX - rect.left;
      rippleOrigin.y = e.clientY - rect.top;
      rippleRadius = 10;
      rippleOpacity = 0.5;
    };

    const heroSection = canvas.closest("section") || canvas.parentElement;
    if (heroSection) {
      heroSection.addEventListener("mousemove", onMouseMove as EventListener);
      heroSection.addEventListener("mouseleave", onMouseLeave as EventListener);
      heroSection.addEventListener("click", onClick as EventListener);
    }

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // LERP smooth mouse position (creates liquid-like lag & momentum)
      if (rawMouse.isOver) {
        smoothMouse.x += (rawMouse.x - smoothMouse.x) * 0.12;
        smoothMouse.y += (rawMouse.y - smoothMouse.y) * 0.12;
      }

      // Theme-dependent color palette
      // Dark Mode: Emerald Glow (#2cc78a & #4ade80)
      // Light Mode: Forest Jade (#16714b & #0f766e)
      const primaryRgb = isDark ? "44, 199, 138" : "22, 113, 75";
      const secondaryRgb = isDark ? "74, 222, 128" : "15, 118, 110";

      // Render expanding ripple on click
      if (rippleOpacity > 0.01) {
        ctx.beginPath();
        ctx.arc(rippleOrigin.x, rippleOrigin.y, rippleRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${primaryRgb}, ${rippleOpacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        rippleRadius += delta * 240;
        rippleOpacity *= 0.94;
      }

      // Draw subtle ambient cursor halo
      if (rawMouse.isOver && smoothMouse.x > 0 && smoothMouse.y > 0) {
        const haloGrad = ctx.createRadialGradient(
          smoothMouse.x,
          smoothMouse.y,
          0,
          smoothMouse.x,
          smoothMouse.y,
          160
        );
        haloGrad.addColorStop(0, `rgba(${primaryRgb}, ${isDark ? 0.08 : 0.05})`);
        haloGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.beginPath();
        ctx.arc(smoothMouse.x, smoothMouse.y, 160, 0, Math.PI * 2);
        ctx.fillStyle = haloGrad;
        ctx.fill();
      }

      // Render and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Lusion-style fluid cursor reactivity
        if (rawMouse.isOver && smoothMouse.x > 0) {
          const dx = smoothMouse.x - p.x;
          const dy = smoothMouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 2) {
            const force = (180 - dist) / 180;
            // Smooth gravitational pull + slight angular swirl
            p.vx += (dx / dist) * force * 1.1 * delta;
            p.vy += (dy / dist) * force * 1.1 * delta;
            p.radius = p.baseRadius * (1 + force * 0.9);
          } else {
            p.radius = p.baseRadius;
          }
        }

        // Apply velocities with silky damping
        p.x += p.vx * (delta * 60);
        p.y += p.vy * (delta * 60);
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle dot with soft glow
        const chosenRgb = p.colorVariation > 0.4 ? primaryRgb : secondaryRgb;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${chosenRgb}, ${p.opacity * (isDark ? 1 : 0.85)})`;
        ctx.fill();

        // Connect adjacent particles with subtle constellation lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 95) {
            const lineOpacity = (1 - dist / 95) * (isDark ? 0.22 : 0.14);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${primaryRgb}, ${lineOpacity})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Pause when tab is hidden to save energy
    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener(THEME_EVENT, updateThemeState);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (heroSection) {
        heroSection.removeEventListener("mousemove", onMouseMove as EventListener);
        heroSection.removeEventListener("mouseleave", onMouseLeave as EventListener);
        heroSection.removeEventListener("click", onClick as EventListener);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-70 dark:opacity-80 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
}
