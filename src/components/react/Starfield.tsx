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
 * - Primary Theme: Pure pitch-black void (#000000) with radiant white stars & luminous 3D perspective wireframe grid.
 * - Alternative Theme: High-contrast pure white void (#FFFFFF) with sharp black stars & wireframe grid plane.
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
    let isRunning = true;
    let isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // Detect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const computeStarCount = (w: number, h: number): number => {
      if (w < 768) {
        // Mobile: lightweight 70 stars for optimal memory footprint and 60fps scrolling
        return Math.round(70 * Math.max(0.4, Math.min(density, 1.2)));
      }
      const area = w * h;
      const base = Math.floor(Math.min(420, Math.max(200, area / 3400)));
      return Math.round(base * Math.max(0.3, Math.min(density, 1.8)));
    };

    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let ripples: CosmicRipple[] = [];
    let nextMeteorTime = performance.now() + 3500 + Math.random() * 4500;

    let cachedHorizonY = -1;
    let cachedGlowDark: CanvasGradient | null = null;
    let cachedGlowLight: CanvasGradient | null = null;

    const initStars = () => {
      const starCount = computeStarCount(width, height);
      stars = [];

      const spikeIndices = new Set<number>();
      const totalSpikes = isMobile ? 3 : Math.floor(Math.random() * 6) + 6;
      while (spikeIndices.size < totalSpikes && spikeIndices.size < starCount) {
        spikeIndices.add(Math.floor(Math.random() * starCount));
      }

      for (let i = 0; i < starCount; i++) {
        const isSpikeStar = spikeIndices.has(i);
        const size = isSpikeStar
          ? Math.random() * 1.0 + 2.0
          : Math.random() * 1.6 + 0.75;

        const parallaxDepth = 0.15 + (size / 2.8) * 0.8;
        const baseOpacity = isSpikeStar
          ? Math.random() * 0.2 + 0.8
          : Math.random() * 0.75 + 0.25;

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
      if (prefersReducedMotion || (isMobile && meteors.length >= 1)) return;
      const originX = startX !== undefined ? startX : Math.random() * width * 0.8 + width * 0.1;
      const originY = startY !== undefined ? startY : Math.random() * (height * 0.45);
      const angle = (Math.PI / 4) + (Math.random() * 0.35 - 0.18);
      const velocity = 550 + Math.random() * 380;

      meteors.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        length: 100 + Math.random() * 130,
        thickness: 1.5 + Math.random() * 1.3,
        opacity: 0.95,
        decay: 0.75 + Math.random() * 0.35,
        color: '255, 255, 255',
      });
    };

    const spawnRipple = (x: number, y: number) => {
      if (prefersReducedMotion || (isMobile && ripples.length >= 2)) return;
      ripples.push({
        x,
        y,
        radius: 2,
        maxRadius: 140,
        opacity: 0.85,
        color: '255, 255, 255',
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
      isMobile = window.innerWidth < 768;
      // On mobile devices, capping DPR strictly to 1.0 reduces memory by up to 88% and prevents GPU fill rate throttling
      const dpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cachedHorizonY = -1; // invalidate gradient cache
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
      if (Math.random() > 0.5) {
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

    // Visibility change handler to pause RAF when tab is hidden or backgrounded
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!isRunning && !prefersReducedMotion) {
          isRunning = true;
          lastTime = performance.now();
          animationFrameId = requestAnimationFrame(drawScene);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Render loop
    let lastTime = performance.now();

    const drawScene = (now: number) => {
      if (!isRunning) return;

      // Allow fluid native display refresh rates (60Hz, 90Hz, 120Hz) without frame hitching
      if (now - lastTime < 7) {
        if (!prefersReducedMotion) {
          animationFrameId = requestAnimationFrame(drawScene);
        }
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Detect current theme mode: Default is Deep Space (#000000 Wireframe)
      const isLightMode =
        document.documentElement.classList.contains('theme-solar-flare') ||
        document.documentElement.classList.contains('light-mode') ||
        document.documentElement.getAttribute('data-theme') === 'solar-flare';

      const isDarkMode = !isLightMode;

      // Color palette: Default (Pure Black Void & Radiant White Grid) vs Alternative (Pure White Void & Sharp Black Grid)
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

      // 2. Horizon geometry (horizon positioned at ~58% of viewport height, matching reference image)
      const horizonY = Math.round(height * 0.58);
      const vanishX = width / 2 - currentMouseX * 35;
      const groundHeight = height - horizonY;

      // 3. Render Stars across the celestial sky and subtly behind grid
      const starBaseColor = isDarkMode ? '#FFFFFF' : '#000000';
      ctx.fillStyle = starBaseColor;
      ctx.strokeStyle = starBaseColor;

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
            0.25,
            Math.min(1.0, star.baseOpacity * (0.7 + 0.3 * twinkle))
          );
        } else {
          star.currentOpacity = star.baseOpacity;
        }

        const shiftedX = star.x - currentMouseX * 25 * star.parallaxDepth;
        const shiftedY = star.y - currentMouseY * 25 * star.parallaxDepth;
        const drawX = ((shiftedX % width) + width) % width;
        const drawY = ((shiftedY % height) + height) % height;

        // Render star dot without per-frame string allocation
        const finalAlpha = isDarkMode
          ? Math.min(1.0, star.currentOpacity * 1.15)
          : star.currentOpacity * 0.8;

        ctx.globalAlpha = finalAlpha;
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Diffraction cross spikes for designated beacon stars in the sky
        if (star.hasSpike && drawY < horizonY) {
          const spikeLength = star.size * 3.8;
          ctx.globalAlpha = finalAlpha * 0.65;
          ctx.lineWidth = isDarkMode ? 0.9 : 0.75;

          ctx.beginPath();
          ctx.moveTo(drawX - spikeLength, drawY);
          ctx.lineTo(drawX + spikeLength, drawY);
          ctx.moveTo(drawX, drawY - spikeLength);
          ctx.lineTo(drawX, drawY + spikeLength);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1.0;

      // 4. Render 3D Perspective Ground Grid (Retro-futuristic Vector Wireframe)
      // Cache atmospheric horizon glow gradient to eliminate 60 allocations/sec GC churn
      if (cachedHorizonY !== horizonY) {
        cachedHorizonY = horizonY;
        cachedGlowDark = ctx.createLinearGradient(0, horizonY - 45, 0, horizonY + 30);
        cachedGlowDark.addColorStop(0, 'rgba(255, 255, 255, 0)');
        cachedGlowDark.addColorStop(0.55, 'rgba(255, 255, 255, 0.22)');
        cachedGlowDark.addColorStop(1, 'rgba(255, 255, 255, 0)');

        cachedGlowLight = ctx.createLinearGradient(0, horizonY - 30, 0, horizonY + 30);
        cachedGlowLight.addColorStop(0, 'rgba(0, 0, 0, 0)');
        cachedGlowLight.addColorStop(0.5, 'rgba(0, 0, 0, 0.06)');
        cachedGlowLight.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }

      ctx.fillStyle = isDarkMode ? cachedGlowDark! : cachedGlowLight!;
      ctx.fillRect(0, horizonY - (isDarkMode ? 45 : 30), width, isDarkMode ? 75 : 60);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, horizonY, width, groundHeight);
      ctx.clip();

      // Advance infinite forward flight motion
      if (!prefersReducedMotion) {
        const flightSpeed = 0.38 * speed * (warpFactor > 1.2 ? warpFactor * 2.2 : 1.0);
        gridOffset = (gridOffset + flightSpeed * dt) % 1.0;
      }

      // 4a. Transverse (Horizontal) Perspective Lines
      // True 3D perspective formula:
      // z starts at near plane and extends toward the horizon.
      // u(z) = 1 / (1 + 0.32 * z) gives the exact non-linear optical foreshortening from the image!
      const totalHorizontalLines = isMobile ? 13 : 24;
      ctx.strokeStyle = isDarkMode ? '#FFFFFF' : '#000000';

      for (let k = 0; k < totalHorizontalLines; k++) {
        const z = k + (1 - gridOffset);
        if (z < 0) continue;
        const u = 1 / (1 + 0.32 * z);
        const lineY = horizonY + groundHeight * u;
        if (lineY < horizonY || lineY > height + 2) continue;

        // Smooth anti-aliased opacity fade near horizon without per-frame string churn
        const minAlpha = isDarkMode ? 0.32 : 0.2;
        const lineAlpha = Math.min(1.0, Math.max(minAlpha, u * 1.3));
        ctx.globalAlpha = lineAlpha;
        ctx.lineWidth = Math.min(2.2, Math.max(isDarkMode ? 1.2 : 0.85, 0.9 + u * 1.1));

        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(width, lineY);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      // 4b. Longitudinal (Perspective Converging) Grid Lines fanning from vanishing point
      const bottomSpacing = isMobile
        ? Math.max(54, width / 7)
        : Math.max(45, Math.min(75, width / 14));
      const rayCount = Math.ceil(width / bottomSpacing) + (isMobile ? 8 : 16);
      const halfRays = Math.ceil(rayCount / 2);

      ctx.lineWidth = isDarkMode ? (isMobile ? 1.0 : 1.35) : (isMobile ? 0.8 : 1.0);
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
      ctx.lineWidth = isDarkMode ? 2.5 : 1.8;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.stroke();

      ctx.restore();

      // 5. Cosmic Ripples
      if (!prefersReducedMotion && !isMobile) {
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
          nextMeteorTime = now + (isMobile ? 7000 : 5000) + Math.random() * (isMobile ? 8000 : 6000);
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

      if (!prefersReducedMotion && isRunning) {
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
      cachedHorizonY = -1;
      if (prefersReducedMotion) {
        drawScene(performance.now());
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
