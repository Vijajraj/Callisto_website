/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

import React, { useEffect, useRef } from 'react';

export interface StarfieldProps {
  /** Multiplier for star density. Defaults to 1.0 */
  density?: number;
  /** Global speed multiplier for drift and twinkle. Defaults to 1.0 */
  speed?: number;
  /** Optional custom CSS class name */
  className?: string;
  /** Optional inline style override */
  style?: React.CSSProperties;
}

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  currentOpacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  parallaxDepth: number; // 0.1 (deep background) to 0.9 (foreground)
  hasSpike: boolean;
  colorRgb: string; // e.g., '247, 245, 255'
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  thickness: number;
  opacity: number;
  decay: number;
  color: string;
}

interface CosmicRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  color: string;
}

/**
 * Starfield: High-performance interactive background starfield.
 * Features:
 * - Sinusoidal twinkling & parallax depth
 * - Interactive click/touch cosmic ripple waves
 * - Warp drive acceleration pulse on click or 'W' keypress
 * - Spontaneous luminous shooting stars (meteors)
 * - Telescopic diffraction spikes on beacon stars
 * - Strict prefers-reduced-motion support
 */
export default function Starfield({
  density = 1.0,
  speed = 1.0,
  className,
  style,
}: StarfieldProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates & lerped parallax offsets
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    // Warp acceleration state
    let warpFactor = 1.0;
    let targetWarpFactor = 1.0;

    // Detect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Palette tints based on design system tokens
    const colorPalette = [
      '247, 245, 255', // --moon (primary stellar white)
      '247, 245, 255',
      '247, 245, 255',
      '207, 203, 242', // --star (subtle lavender)
      '207, 203, 242',
      '156, 132, 214', // --orbit (soft purple nebula tint)
      '255, 184, 107', // --astrophage (warm star)
      '201, 138, 102', // --sol-dust (warm reddish star)
    ];

    const computeStarCount = (w: number, h: number): number => {
      const area = w * h;
      const base = Math.floor(Math.min(750, Math.max(380, area / 2600)));
      return Math.round(base * Math.max(0.2, Math.min(density, 2.5)));
    };

    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let ripples: CosmicRipple[] = [];
    let nextMeteorTime = performance.now() + 3000 + Math.random() * 4000;

    const initStars = () => {
      const starCount = computeStarCount(width, height);
      stars = [];

      const spikeIndices = new Set<number>();
      const totalSpikes = Math.floor(Math.random() * 6) + 6;
      while (spikeIndices.size < totalSpikes && spikeIndices.size < starCount) {
        spikeIndices.add(Math.floor(Math.random() * starCount));
      }

      for (let i = 0; i < starCount; i++) {
        const isSpikeStar = spikeIndices.has(i);
        const size = isSpikeStar
          ? Math.random() * 0.7 + 1.8
          : Math.random() * 1.8 + 0.5;

        const parallaxDepth = 0.15 + (size / 2.5) * 0.75;
        const baseOpacity = isSpikeStar
          ? Math.random() * 0.2 + 0.8
          : Math.random() * 0.75 + 0.2;

        const colorRgb =
          colorPalette[Math.floor(Math.random() * colorPalette.length)];

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          baseOpacity,
          currentOpacity: baseOpacity,
          twinkleSpeed: (Math.random() * 2.0 + 0.8) * speed,
          twinklePhase: Math.random() * Math.PI * 2,
          parallaxDepth,
          hasSpike: isSpikeStar,
          colorRgb,
        });
      }
    };

    const spawnMeteor = (startX?: number, startY?: number) => {
      if (prefersReducedMotion) return;
      const originX = startX !== undefined ? startX : Math.random() * width * 0.8 + width * 0.1;
      const originY = startY !== undefined ? startY : Math.random() * (height * 0.4);
      const angle = (Math.PI / 4) + (Math.random() * 0.4 - 0.2); // ~45 deg downward-right
      const velocity = 550 + Math.random() * 400; // px/sec

      meteors.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        length: 100 + Math.random() * 140,
        thickness: 1.5 + Math.random() * 1.5,
        opacity: 0.95,
        decay: 0.7 + Math.random() * 0.4,
        color: Math.random() > 0.4 ? '255, 184, 107' : '207, 203, 242',
      });
    };

    const spawnRipple = (x: number, y: number) => {
      if (prefersReducedMotion) return;
      ripples.push({
        x,
        y,
        radius: 2,
        maxRadius: 140,
        opacity: 0.8,
        color: '156, 132, 214', // var(--orbit)
      });
    };

    const triggerWarpPulse = () => {
      if (prefersReducedMotion) return;
      targetWarpFactor = 7.5;
      window.setTimeout(() => {
        targetWarpFactor = 1.0;
      }, 700);
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initStars();
    };

    resizeCanvas();

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - width / 2) / (width / 2);
      targetMouseY = (e.clientY - height / 2) / (height / 2);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        targetMouseX = (touch.clientX - width / 2) / (width / 2);
        targetMouseY = (touch.clientY - height / 2) / (height / 2);
      }
    };

    // Click handler: trigger cosmic ripple and subtle warp impulse
    const handleWindowClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      // Don't interfere with form inputs, buttons or link clicks
      if (target && (target.closest('input') || target.closest('textarea') || target.closest('select'))) {
        return;
      }
      spawnRipple(e.clientX, e.clientY);
      if (Math.random() > 0.5) {
        spawnMeteor(e.clientX - 60, e.clientY - 60);
      }
      triggerWarpPulse();
    };

    // Keyboard 'W' key for warp drive toggle
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'w' || e.key === 'W') {
        triggerWarpPulse();
        spawnMeteor();
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('click', handleWindowClick, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    let resizeTimeout: number;
    const handleResize = () => {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resizeCanvas, 150);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let lastTime = performance.now();

    const drawScene = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Smooth warp lerp
      warpFactor += (targetWarpFactor - warpFactor) * 0.1;

      ctx.clearRect(0, 0, width, height);

      const maxParallaxShift = 30;

      // 1. Draw Starfield
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (!prefersReducedMotion) {
          const effectiveSpeed = speed * (warpFactor > 1.2 ? warpFactor * 3.5 : 1.0);
          const driftX = -12 * star.parallaxDepth * effectiveSpeed * dt;
          const driftY = -5 * star.parallaxDepth * effectiveSpeed * dt;
          star.x += driftX;
          star.y += driftY;

          if (star.x < -20) star.x = width + 20;
          if (star.x > width + 20) star.x = -20;
          if (star.y < -20) star.y = height + 20;
          if (star.y > height + 20) star.y = -20;

          const twinkle = Math.sin(now * 0.001 * star.twinkleSpeed + star.twinklePhase);
          star.currentOpacity = Math.max(
            0.15,
            Math.min(1.0, star.baseOpacity * (0.65 + 0.35 * twinkle))
          );
        } else {
          star.currentOpacity = star.baseOpacity;
        }

        const shiftedX =
          star.x - currentMouseX * maxParallaxShift * star.parallaxDepth;
        const shiftedY =
          star.y - currentMouseY * maxParallaxShift * star.parallaxDepth;

        const drawX = ((shiftedX % width) + width) % width;
        const drawY = ((shiftedY % height) + height) % height;

        // Warp Streak Effect when warpFactor > 1.8
        if (warpFactor > 1.8 && !prefersReducedMotion) {
          const streakLen = star.size * warpFactor * 4 * star.parallaxDepth;
          ctx.strokeStyle = `rgba(${star.colorRgb}, ${star.currentOpacity * 0.8})`;
          ctx.lineWidth = Math.max(0.75, star.size * 0.8);
          ctx.beginPath();
          ctx.moveTo(drawX, drawY);
          ctx.lineTo(drawX + streakLen, drawY + streakLen * 0.4);
          ctx.stroke();
        } else {
          // Standard radial star body
          const radius = star.size;
          const gradient = ctx.createRadialGradient(
            drawX,
            drawY,
            0,
            drawX,
            drawY,
            radius * 1.5
          );
          gradient.addColorStop(0, `rgba(${star.colorRgb}, ${star.currentOpacity})`);
          gradient.addColorStop(
            0.4,
            `rgba(${star.colorRgb}, ${star.currentOpacity * 0.7})`
          );
          gradient.addColorStop(1, `rgba(${star.colorRgb}, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(drawX, drawY, radius * 1.5, 0, Math.PI * 2);
          ctx.fill();

          // Diffraction cross spikes for designated beacon stars
          if (star.hasSpike) {
            const spikeLength = radius * 4.5;
            const spikeAlpha = star.currentOpacity * 0.6;

            ctx.strokeStyle = `rgba(${star.colorRgb}, ${spikeAlpha})`;
            ctx.lineWidth = 0.75;

            ctx.beginPath();
            ctx.moveTo(drawX - spikeLength, drawY);
            ctx.lineTo(drawX + spikeLength, drawY);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(drawX, drawY - spikeLength);
            ctx.lineTo(drawX, drawY + spikeLength);
            ctx.stroke();

            ctx.fillStyle = `rgba(255, 255, 255, ${star.currentOpacity})`;
            ctx.beginPath();
            ctx.arc(drawX, drawY, 0.75, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 2. Cosmic Ripples
      if (!prefersReducedMotion) {
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rip = ripples[i];
          rip.radius += 120 * dt;
          rip.opacity -= 1.1 * dt;

          if (rip.opacity <= 0 || rip.radius >= rip.maxRadius) {
            ripples.splice(i, 1);
            continue;
          }

          ctx.strokeStyle = `rgba(${rip.color}, ${rip.opacity})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // 3. Spontaneous Shooting Stars / Meteors
      if (!prefersReducedMotion) {
        if (now > nextMeteorTime) {
          spawnMeteor();
          nextMeteorTime = now + 5000 + Math.random() * 7000;
        }

        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          m.opacity -= m.decay * dt;

          if (m.opacity <= 0 || m.x > width + 200 || m.y > height + 200) {
            meteors.splice(i, 1);
            continue;
          }

          const tailX = m.x - (m.vx / 500) * m.length;
          const tailY = m.y - (m.vy / 500) * m.length;

          const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
          grad.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`);
          grad.addColorStop(0.3, `rgba(${m.color}, ${m.opacity * 0.8})`);
          grad.addColorStop(1, `rgba(${m.color}, 0)`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = m.thickness;
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          // Meteor core glow
          ctx.fillStyle = `rgba(255, 255, 255, ${m.opacity})`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.thickness * 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(drawScene);
      }
    };

    if (prefersReducedMotion) {
      drawScene(performance.now());
    } else {
      animationFrameId = requestAnimationFrame(drawScene);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleWindowClick);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      window.clearTimeout(resizeTimeout);
    };
  }, [density, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block',
        backgroundColor: 'transparent',
        ...style,
      }}
    />
  );
}
