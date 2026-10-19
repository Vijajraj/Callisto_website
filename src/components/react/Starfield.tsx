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

/**
 * Starfield: Canvas-based performant background starfield.
 * Features slow organic drift, subtle mouse parallax depth,
 * sinusoidal twinkling, chromatic stellar classification tints,
 * and telescopic diffraction spikes on beacon stars.
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

    // Detect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Palette tints based on design system
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

    // Compute star count based on viewport area and density prop (clamped between 400 and 800 at 1x density)
    const computeStarCount = (w: number, h: number): number => {
      const area = w * h;
      const base = Math.floor(Math.min(800, Math.max(400, area / 2400)));
      return Math.round(base * Math.max(0.2, Math.min(density, 2.5)));
    };

    let stars: Star[] = [];

    const initStars = () => {
      const starCount = computeStarCount(width, height);
      stars = [];

      // Determine spike count (5 to 10 prominent stars)
      const spikeIndices = new Set<number>();
      const totalSpikes = Math.floor(Math.random() * 6) + 5; // 5 - 10
      while (spikeIndices.size < totalSpikes && spikeIndices.size < starCount) {
        spikeIndices.add(Math.floor(Math.random() * starCount));
      }

      for (let i = 0; i < starCount; i++) {
        const isSpikeStar = spikeIndices.has(i);
        // Size: 0.5px - 2.5px. Spiked stars are in the upper range (1.8 - 2.5px)
        const size = isSpikeStar
          ? Math.random() * 0.7 + 1.8
          : Math.random() * 1.8 + 0.5;

        // Depth correlates with size
        const parallaxDepth = 0.15 + (size / 2.5) * 0.75;

        // Base opacity
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

    // Handle high DPI scaling
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
      // Offset relative to center of screen: -1 to +1
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

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Debounced window resize
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

      ctx.clearRect(0, 0, width, height);

      // Parallax max pixel shift
      const maxParallaxShift = 30;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (!prefersReducedMotion) {
          // Slow continuous drift to left and slightly up
          const driftX = -10 * star.parallaxDepth * speed * dt;
          const driftY = -4 * star.parallaxDepth * speed * dt;
          star.x += driftX;
          star.y += driftY;

          // Wrap around canvas boundaries
          if (star.x < -10) star.x = width + 10;
          if (star.x > width + 10) star.x = -10;
          if (star.y < -10) star.y = height + 10;
          if (star.y > height + 10) star.y = -10;

          // Twinkle formula: sinusoidal oscillation
          const twinkle = Math.sin(now * 0.001 * star.twinkleSpeed + star.twinklePhase);
          star.currentOpacity = Math.max(
            0.15,
            Math.min(1.0, star.baseOpacity * (0.65 + 0.35 * twinkle))
          );
        } else {
          star.currentOpacity = star.baseOpacity;
        }

        // Apply mouse shift opposite to cursor
        const shiftedX =
          star.x - currentMouseX * maxParallaxShift * star.parallaxDepth;
        const shiftedY =
          star.y - currentMouseY * maxParallaxShift * star.parallaxDepth;

        // Normalised drawing position with screen wrap for seamless edges
        const drawX = ((shiftedX % width) + width) % width;
        const drawY = ((shiftedY % height) + height) % height;

        // Draw radial star body
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

        // Draw diffraction cross spikes for designated beacon stars
        if (star.hasSpike) {
          const spikeLength = radius * 4.5;
          const spikeAlpha = star.currentOpacity * 0.6;

          ctx.strokeStyle = `rgba(${star.colorRgb}, ${spikeAlpha})`;
          ctx.lineWidth = 0.75;

          // Horizontal spike
          ctx.beginPath();
          ctx.moveTo(drawX - spikeLength, drawY);
          ctx.lineTo(drawX + spikeLength, drawY);
          ctx.stroke();

          // Vertical spike
          ctx.beginPath();
          ctx.moveTo(drawX, drawY - spikeLength);
          ctx.lineTo(drawX, drawY + spikeLength);
          ctx.stroke();

          // Core pinpoint
          ctx.fillStyle = `rgba(255, 255, 255, ${star.currentOpacity})`;
          ctx.beginPath();
          ctx.arc(drawX, drawY, 0.75, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(drawScene);
      }
    };

    if (prefersReducedMotion) {
      // Draw single frame for users who prefer reduced motion
      drawScene(performance.now());
    } else {
      animationFrameId = requestAnimationFrame(drawScene);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
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
