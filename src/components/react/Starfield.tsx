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
  /** Global speed multiplier for grid flight and twinkle. Defaults to 1.0 */
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
  parallaxDepth: number;
  hasSpike: boolean;
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
 * Starfield: High-performance 3D perspective wireframe grid & cosmic starfield engine.
 * - Default Mode: Pure white void (#FFFFFF) with high-contrast black stars & 3D wireframe grid plane.
 * - Dark Mode: Pure pitch-black void (#000000) with radiant white stars & luminous perspective grid.
 * - Smooth infinite forward flight motion across the celestial grid.
 * - Interactive mouse parallax, warp acceleration on 'W', and shooting stars.
 * - Respects prefers-reduced-motion for a majestic static perspective wallpaper.
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

    const ctx = canvas.getContext('2d', { alpha: false });
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

    // Infinite forward grid scroll offset
    let gridOffset = 0.0;

    // Detect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const computeStarCount = (w: number, h: number): number => {
      const area = w * h;
      const base = Math.floor(Math.min(700, Math.max(350, area / 2600)));
      return Math.round(base * Math.max(0.3, Math.min(density, 2.0)));
    };

    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let ripples: CosmicRipple[] = [];
    let nextMeteorTime = performance.now() + 4000 + Math.random() * 5000;

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
          ? Math.random() * 1.0 + 2.0
          : Math.random() * 1.6 + 0.8;

        const parallaxDepth = 0.15 + (size / 2.8) * 0.8;
        const baseOpacity = isSpikeStar
          ? Math.random() * 0.2 + 0.8
          : Math.random() * 0.7 + 0.3;

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
        });
      }
    };

    const spawnMeteor = (startX?: number, startY?: number) => {
      if (prefersReducedMotion) return;
      const originX = startX !== undefined ? startX : Math.random() * width * 0.8 + width * 0.1;
      const originY = startY !== undefined ? startY : Math.random() * (height * 0.45);
      const angle = (Math.PI / 4) + (Math.random() * 0.35 - 0.18);
      const velocity = 550 + Math.random() * 380;

      meteors.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        length: 90 + Math.random() * 120,
        thickness: 1.5 + Math.random() * 1.2,
        opacity: 0.95,
        decay: 0.75 + Math.random() * 0.35,
        color: '244, 63, 94',
      });
    };

    const spawnRipple = (x: number, y: number) => {
      if (prefersReducedMotion) return;
      ripples.push({
        x,
        y,
        radius: 2,
        maxRadius: 130,
        opacity: 0.8,
        color: '244, 63, 94',
      });
    };

    const triggerWarpPulse = () => {
      if (prefersReducedMotion) return;
      targetWarpFactor = 6.0;
      window.setTimeout(() => {
        targetWarpFactor = 1.0;
      }, 650);
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    };

    resizeCanvas();

    // Mouse movement listeners
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

    const handleWindowClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.closest('input') || target.closest('textarea') || target.closest('select') || target.closest('button') || target.closest('a'))) {
        return;
      }
      spawnRipple(e.clientX, e.clientY);
      if (Math.random() > 0.6) {
        spawnMeteor(e.clientX - 50, e.clientY - 50);
      }
      triggerWarpPulse();
    };

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

      // Detect current theme mode (Default is Light Mode unless theme-deep-space is explicitly set)
      const isDarkMode =
        document.documentElement.classList.contains('theme-deep-space') ||
        document.documentElement.getAttribute('data-theme') === 'deep-space';

      const isLightMode = !isDarkMode;

      // High-contrast color palette: Light (Default) vs Dark (Pure Black Void)
      const bgColor = isDarkMode ? '#000000' : '#FFFFFF';
      const starColorRgb = isDarkMode ? '255, 255, 255' : '0, 0, 0';
      const gridColorRgb = isDarkMode ? '255, 255, 255' : '0, 0, 0';

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Smooth warp lerp
      warpFactor += (targetWarpFactor - warpFactor) * 0.1;

      // 1. Clear background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // 2. Horizon geometry (horizon positioned at ~60% of viewport height)
      const horizonY = Math.round(height * 0.60);
      const vanishX = width / 2 - currentMouseX * 35;
      const groundHeight = height - horizonY;

      // 3. Render Stars (visible across entire canvas, upper sky & through grid)
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (!prefersReducedMotion) {
          const effectiveSpeed = speed * (warpFactor > 1.2 ? warpFactor * 3.5 : 1.0);
          star.x += -8 * star.parallaxDepth * effectiveSpeed * dt;
          star.y += -3 * star.parallaxDepth * effectiveSpeed * dt;

          if (star.x < -20) star.x = width + 20;
          if (star.x > width + 20) star.x = -20;
          if (star.y < -20) star.y = height + 20;
          if (star.y > height + 20) star.y = -20;

          const twinkle = Math.sin(now * 0.001 * star.twinkleSpeed + star.twinklePhase);
          star.currentOpacity = Math.max(
            0.2,
            Math.min(1.0, star.baseOpacity * (0.68 + 0.32 * twinkle))
          );
        } else {
          star.currentOpacity = star.baseOpacity;
        }

        const shiftedX = star.x - currentMouseX * 25 * star.parallaxDepth;
        const shiftedY = star.y - currentMouseY * 25 * star.parallaxDepth;
        const drawX = ((shiftedX % width) + width) % width;
        const drawY = ((shiftedY % height) + height) % height;

        // Render star dot
        const finalAlpha = isDarkMode
          ? Math.min(1.0, star.currentOpacity * 1.1)
          : star.currentOpacity * 0.8;

        ctx.fillStyle = `rgba(${starColorRgb}, ${finalAlpha})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Diffraction cross spikes for designated beacon stars in the sky
        if (star.hasSpike && drawY < horizonY) {
          const spikeLength = star.size * 3.5;
          ctx.strokeStyle = `rgba(${starColorRgb}, ${finalAlpha * 0.6})`;
          ctx.lineWidth = isDarkMode ? 0.9 : 0.75;

          ctx.beginPath();
          ctx.moveTo(drawX - spikeLength, drawY);
          ctx.lineTo(drawX + spikeLength, drawY);
          ctx.moveTo(drawX, drawY - spikeLength);
          ctx.lineTo(drawX, drawY + spikeLength);
          ctx.stroke();
        }
      }

      // 4. Render 3D Perspective Ground Grid (Retro-futuristic Vector Wireframe)
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, horizonY, width, groundHeight);
      ctx.clip();

      // Atmospheric horizon glow in dark mode so the horizon stands out brilliantly
      if (isDarkMode) {
        const horizonGlow = ctx.createLinearGradient(0, horizonY - 45, 0, horizonY + 35);
        horizonGlow.addColorStop(0, 'rgba(255, 255, 255, 0)');
        horizonGlow.addColorStop(0.55, 'rgba(255, 255, 255, 0.18)');
        horizonGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = horizonGlow;
        ctx.fillRect(0, horizonY - 45, width, 80);
      } else {
        const horizonGlow = ctx.createLinearGradient(0, horizonY - 30, 0, horizonY + 30);
        horizonGlow.addColorStop(0, 'rgba(0, 0, 0, 0)');
        horizonGlow.addColorStop(0.5, 'rgba(0, 0, 0, 0.05)');
        horizonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = horizonGlow;
        ctx.fillRect(0, horizonY - 30, width, 60);
      }

      // Advance infinite forward flight motion
      if (!prefersReducedMotion) {
        const flightSpeed = 0.22 * speed * (warpFactor > 1.2 ? warpFactor * 2.2 : 1.0);
        gridOffset = (gridOffset + flightSpeed * dt) % 1.0;
      }

      // 4a. Transverse (Horizontal) Perspective Lines
      const horizontalLineCount = 26;
      for (let k = 1; k <= horizontalLineCount; k++) {
        const normK = (k + gridOffset) / horizontalLineCount;
        if (normK <= 0 || normK > 1.04) continue;

        // Non-linear cubic perspective curve: tightly compressed at horizon, wide in foreground
        const lineY = horizonY + groundHeight * Math.pow(normK, 2.7);
        if (lineY < horizonY || lineY > height + 2) continue;

        // Smooth anti-aliased opacity fade near horizon
        const minAlpha = isDarkMode ? 0.25 : 0.14;
        const lineAlpha = Math.min(1.0, Math.max(minAlpha, Math.pow(normK, 1.1) * 1.15));
        ctx.strokeStyle = `rgba(${gridColorRgb}, ${lineAlpha})`;
        ctx.lineWidth = Math.min(2.0, Math.max(isDarkMode ? 1.0 : 0.75, 0.8 + normK * 1.0));

        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(width, lineY);
        ctx.stroke();
      }

      // 4b. Longitudinal (Perspective Converging) Grid Lines fanning from vanishing point
      const bottomSpacing = Math.max(38, Math.min(68, width / 18));
      const rayCount = Math.ceil(width / bottomSpacing) + 16;
      const halfRays = Math.ceil(rayCount / 2);

      ctx.lineWidth = isDarkMode ? 1.25 : 1.0;
      ctx.strokeStyle = `rgba(${gridColorRgb}, ${isDarkMode ? 0.95 : 0.85})`;

      for (let j = -halfRays; j <= halfRays; j++) {
        const xBottom = vanishX + j * bottomSpacing;
        ctx.beginPath();
        ctx.moveTo(vanishX, horizonY);
        ctx.lineTo(xBottom, height);
        ctx.stroke();
      }

      // 4c. Crisp Horizon Boundary Line
      ctx.strokeStyle = `rgba(${gridColorRgb}, 1.0)`;
      ctx.lineWidth = isDarkMode ? 2.0 : 1.5;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.stroke();

      ctx.restore();

      // 5. Cosmic Ripples
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

      // 6. Spontaneous Shooting Stars (Meteors)
      if (!prefersReducedMotion) {
        if (now > nextMeteorTime) {
          spawnMeteor();
          nextMeteorTime = now + 5000 + Math.random() * 6000;
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
          const coreColor = isDarkMode ? '255, 255, 255' : '0, 0, 0';
          grad.addColorStop(0, `rgba(${coreColor}, ${m.opacity})`);
          grad.addColorStop(0.35, `rgba(${m.color}, ${m.opacity * 0.75})`);
          grad.addColorStop(1, `rgba(${m.color}, 0)`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = m.thickness;
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          ctx.fillStyle = `rgba(${coreColor}, ${m.opacity})`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.thickness * 1.1, 0, Math.PI * 2);
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

    // Re-draw on theme mutation
    const observer = new MutationObserver(() => {
      if (prefersReducedMotion) {
        drawScene(performance.now());
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
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
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
        ...style,
      }}
    />
  );
}
