/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { playTelemetryBeep } from '../../lib/audio';

export interface SolarSystemBody {
  id: string;
  name: string;
  type: string;
  category: 'star' | 'terrestrial' | 'gas_giant' | 'ice_giant' | 'dwarf';
  orbitalRadiusPxFull: number;
  orbitalRadiusPxInner: number;
  actualRadiusKm: number;
  distanceFromSunAU: number;
  distanceFromSunKm: string;
  orbitalPeriodDays: number;
  orbitalPeriodLabel: string;
  bodyColor: string;
  lightBodyColor: string;
  orbitColor: string;
  diameterKm: number;
  orbitalSpeedRadPerSec: number;
  surfaceTemp: string;
  moonsCount: number;
  rotationPeriod: string;
  description: string;
  lore: string;
  hasRings?: boolean;
}

export const SOLAR_BODIES: SolarSystemBody[] = [
  {
    id: 'sun',
    name: 'Sun (Sol)',
    type: 'Yellow Dwarf Star (G2V)',
    category: 'star',
    orbitalRadiusPxFull: 0,
    orbitalRadiusPxInner: 0,
    actualRadiusKm: 696340,
    distanceFromSunAU: 0,
    distanceFromSunKm: '0 km (Barycenter)',
    orbitalPeriodDays: 0,
    orbitalPeriodLabel: 'Heliocentric Center',
    bodyColor: '#F59E0B',
    lightBodyColor: '#D97706',
    orbitColor: 'transparent',
    diameterKm: 1392700,
    orbitalSpeedRadPerSec: 0,
    surfaceTemp: '5,500°C (Core 15,000,000°C)',
    moonsCount: 8, // Major planetary satellites
    rotationPeriod: '27.0 Earth Days',
    description: 'The monarch star of our planetary system, containing 99.86% of all mass in the Solar System. Its radiant thermonuclear furnace powers planetary atmospheres, solar wind, and the heliosphere.',
    lore: 'Primary energy origin for all astronomical imaging and deep-space solar propulsion trajectories cataloged by Callisto Observatory.',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'Terrestrial Planet',
    category: 'terrestrial',
    orbitalRadiusPxFull: 34,
    orbitalRadiusPxInner: 48,
    actualRadiusKm: 2439.7,
    distanceFromSunAU: 0.39,
    distanceFromSunKm: '57.9 Million km',
    orbitalPeriodDays: 87.97,
    orbitalPeriodLabel: '88 Earth Days',
    bodyColor: '#A1A1AA',
    lightBodyColor: '#475569',
    orbitColor: 'rgba(161, 161, 170, 0.35)',
    diameterKm: 4879,
    orbitalSpeedRadPerSec: 2.1,
    surfaceTemp: '-180°C to 430°C',
    moonsCount: 0,
    rotationPeriod: '58.6 Earth Days',
    description: 'The innermost planet, heavily cratered with virtually no atmosphere. Subjected to extreme thermal swings and solar tidal forces, it sports a massive metallic iron core.',
    lore: 'Trajectory benchmark for relativistic gravitational perihelion precession and orbital insertion maneuvers.',
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'Terrestrial Planet',
    category: 'terrestrial',
    orbitalRadiusPxFull: 58,
    orbitalRadiusPxInner: 92,
    actualRadiusKm: 6051.8,
    distanceFromSunAU: 0.72,
    distanceFromSunKm: '108.2 Million km',
    orbitalPeriodDays: 224.7,
    orbitalPeriodLabel: '224.7 Earth Days',
    bodyColor: '#FBBF24',
    lightBodyColor: '#B45309',
    orbitColor: 'rgba(251, 191, 36, 0.35)',
    diameterKm: 12104,
    orbitalSpeedRadPerSec: 1.5,
    surfaceTemp: '465°C (Runaway Greenhouse)',
    moonsCount: 0,
    rotationPeriod: '243 Earth Days (Retrograde)',
    description: 'Shrouded in dense, reflective clouds of toxic sulfuric acid, Venus endures crushing atmospheric pressure 92 times that of Earth and a runaway greenhouse effect.',
    lore: 'Site of early planetary atmospheric probes and a prime testing ground for super-rotation atmospheric modeling.',
  },
  {
    id: 'earth',
    name: 'Earth (Terra)',
    type: 'Terrestrial Planet (Home World)',
    category: 'terrestrial',
    orbitalRadiusPxFull: 84,
    orbitalRadiusPxInner: 142,
    actualRadiusKm: 6371.0,
    distanceFromSunAU: 1.00,
    distanceFromSunKm: '149.6 Million km',
    orbitalPeriodDays: 365.25,
    orbitalPeriodLabel: '365.25 Earth Days (1.0 Year)',
    bodyColor: '#38BDF8',
    lightBodyColor: '#0284C7',
    orbitColor: 'rgba(56, 189, 248, 0.4)',
    diameterKm: 12742,
    orbitalSpeedRadPerSec: 1.15,
    surfaceTemp: '-88°C to 58°C (Mean 15°C)',
    moonsCount: 1, // Luna
    rotationPeriod: '23h 56m 04s',
    description: 'The vibrant blue marble of the inner solar system, rich in liquid water oceans, a protective nitrogen-oxygen atmosphere, and a dynamic geomagnetic dynamo.',
    lore: 'Origin of Callisto Space Club, anchored from the rooftop observation facilities at Chennai Institute of Technology.',
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'Terrestrial Planet',
    category: 'terrestrial',
    orbitalRadiusPxFull: 112,
    orbitalRadiusPxInner: 198,
    actualRadiusKm: 3389.5,
    distanceFromSunAU: 1.52,
    distanceFromSunKm: '227.9 Million km',
    orbitalPeriodDays: 686.98,
    orbitalPeriodLabel: '687 Earth Days (1.88 Years)',
    bodyColor: '#EF4444',
    lightBodyColor: '#DC2626',
    orbitColor: 'rgba(239, 68, 68, 0.35)',
    diameterKm: 6779,
    orbitalSpeedRadPerSec: 0.85,
    surfaceTemp: '-140°C to 20°C',
    moonsCount: 2, // Phobos & Deimos
    rotationPeriod: '24h 37m 22s (1 Sol)',
    description: 'The rust-hued desert world hosting the solar system’s tallest shield volcano, Olympus Mons, and the ancient dry riverbeds of a warmer, wetter past.',
    lore: 'Primary target for crewed exploration corridors and robotic sample return architectures.',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'Gas Giant (Jovian Monarch)',
    category: 'gas_giant',
    orbitalRadiusPxFull: 154,
    orbitalRadiusPxInner: 235,
    actualRadiusKm: 69911,
    distanceFromSunAU: 5.20,
    distanceFromSunKm: '778.5 Million km',
    orbitalPeriodDays: 4332.59,
    orbitalPeriodLabel: '11.86 Earth Years',
    bodyColor: '#FB923C',
    lightBodyColor: '#C2410C',
    orbitColor: 'rgba(251, 146, 60, 0.35)',
    diameterKm: 139820,
    orbitalSpeedRadPerSec: 0.52,
    surfaceTemp: '-110°C (Cloud tops)',
    moonsCount: 95,
    rotationPeriod: '9h 55m 30s',
    description: 'The gas giant monarch of our solar system, with churning ammonia cloud bands, the centuries-old Great Red Spot, and a massive magnetosphere.',
    lore: 'Home system of Callisto—our club’s namesake moon orbiting peacefully in the tranquil outer radiation haven.',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'Gas Giant (Ringed Wonder)',
    category: 'gas_giant',
    orbitalRadiusPxFull: 194,
    orbitalRadiusPxInner: 245,
    actualRadiusKm: 58232,
    distanceFromSunAU: 9.58,
    distanceFromSunKm: '1.43 Billion km',
    orbitalPeriodDays: 10759.22,
    orbitalPeriodLabel: '29.45 Earth Years',
    bodyColor: '#FDE047',
    lightBodyColor: '#CA8A04',
    orbitColor: 'rgba(253, 224, 71, 0.35)',
    diameterKm: 116460,
    orbitalSpeedRadPerSec: 0.38,
    surfaceTemp: '-140°C',
    moonsCount: 146,
    rotationPeriod: '10h 33m 38s',
    description: 'Distinguished by its stunning, expansive ring system comprised of countless billions of ice crystals and rock particles spanning hundreds of thousands of kilometers.',
    lore: 'Host to ocean moon Enceladus and methane-laked Titan, central to astrobiological life surveys.',
    hasRings: true,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'Ice Giant',
    category: 'ice_giant',
    orbitalRadiusPxFull: 232,
    orbitalRadiusPxInner: 250,
    actualRadiusKm: 25362,
    distanceFromSunAU: 19.22,
    distanceFromSunKm: '2.87 Billion km',
    orbitalPeriodDays: 30687.15,
    orbitalPeriodLabel: '84.0 Earth Years',
    bodyColor: '#2DD4BF',
    lightBodyColor: '#0D9488',
    orbitColor: 'rgba(45, 212, 191, 0.35)',
    diameterKm: 50724,
    orbitalSpeedRadPerSec: 0.26,
    surfaceTemp: '-195°C',
    moonsCount: 28,
    rotationPeriod: '17h 14m 24s (Retrograde)',
    description: 'An icy giant world tipped dramatically on its side with a 97.8° axial tilt, rolling along its orbit through extreme polar seasons.',
    lore: 'Key target for next-generation outer planet orbiter and atmospheric probe flagship missions.',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'Ice Giant (Outermost Guardian)',
    category: 'ice_giant',
    orbitalRadiusPxFull: 268,
    orbitalRadiusPxInner: 255,
    actualRadiusKm: 24622,
    distanceFromSunAU: 30.05,
    distanceFromSunKm: '4.50 Billion km',
    orbitalPeriodDays: 60190.03,
    orbitalPeriodLabel: '164.8 Earth Years',
    bodyColor: '#60A5FA',
    lightBodyColor: '#1D4ED8',
    orbitColor: 'rgba(96, 165, 250, 0.35)',
    diameterKm: 49244,
    orbitalSpeedRadPerSec: 0.18,
    surfaceTemp: '-200°C',
    moonsCount: 16,
    rotationPeriod: '16h 06m 36s',
    description: 'The windiest domain in the Solar System, where methane atmospheric gales surpass 2,100 km/h and geyser-active retrograde moon Triton orbits.',
    lore: 'Outermost sentinel bordering the Kuiper Belt, anchoring deep trans-Neptunian baseline telemetry.',
  },
];

export default function SolarSystemOrrery(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedBody, setSelectedBody] = useState<SolarSystemBody>(SOLAR_BODIES[3]); // Default to Earth
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [viewScope, setViewScope] = useState<'full' | 'inner'>('full');
  const [showOrbits, setShowOrbits] = useState<boolean>(false);

  // Orbital angles storage
  const anglesRef = useRef<{ [key: string]: number }>({
    mercury: 0.8,
    venus: 2.1,
    earth: 3.4,
    mars: 4.8,
    jupiter: 1.2,
    saturn: 5.3,
    uranus: 2.9,
    neptune: 4.1,
  });

  const speedRef = useRef(speedMultiplier);
  speedRef.current = speedMultiplier;

  const viewScopeRef = useRef(viewScope);
  viewScopeRef.current = viewScope;

  const showOrbitsRef = useRef(showOrbits);
  showOrbitsRef.current = showOrbits;

  // Cached planet positions on canvas for click/touch detection
  const bodyPositionsRef = useRef<{ [key: string]: { x: number; y: number; r: number } }>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isVisible = true;
    let isRunning = true;
    let animationId: number;
    let lastTime = performance.now();

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry ? entry.isIntersecting : true;
        if (isVisible && isRunning) {
          lastTime = performance.now();
          cancelAnimationFrame(animationId);
          animationId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const handleVisibility = () => {
      isRunning = !document.hidden;
      if (isRunning && isVisible) {
        lastTime = performance.now();
        cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const render = (time: number) => {
      if (!isVisible || !isRunning) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      const isLight =
        typeof document !== 'undefined' &&
        (document.documentElement.classList.contains('light-mode') ||
          document.documentElement.getAttribute('data-theme') === 'solar-flare');

      ctx.clearRect(0, 0, width, height);

      const isInner = viewScopeRef.current === 'inner';

      // Advance planetary orbital angles
      SOLAR_BODIES.slice(1).forEach((planet) => {
        anglesRef.current[planet.id] =
          (anglesRef.current[planet.id] + planet.orbitalSpeedRadPerSec * speedRef.current * dt * 0.45) %
          (Math.PI * 2);
      });

      // Filter bodies according to view scope
      const activeBodies = isInner
        ? SOLAR_BODIES.filter((b) => ['sun', 'mercury', 'venus', 'earth', 'mars'].includes(b.id))
        : SOLAR_BODIES;

      // Draw Orbit Tracks
      if (showOrbitsRef.current) {
        activeBodies.slice(1).forEach((planet) => {
          const orbitRadius = isInner ? planet.orbitalRadiusPxInner : planet.orbitalRadiusPxFull;
          ctx.beginPath();
          ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
          ctx.strokeStyle = isLight
            ? 'rgba(15, 23, 42, 0.14)'
            : 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        });

        // Asteroid belt representation in inner/full view
        const asteroidBeltRadius = isInner ? 228 : 133;
        ctx.beginPath();
        ctx.arc(centerX, centerY, asteroidBeltRadius, 0, Math.PI * 2);
        ctx.strokeStyle = isLight ? 'rgba(71, 85, 105, 0.18)' : 'rgba(148, 163, 184, 0.18)';
        ctx.lineWidth = 2;
        ctx.setLineDash([1, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Sun at Center
      const sunRadius = isInner ? 22 : 17;
      bodyPositionsRef.current['sun'] = { x: centerX, y: centerY, r: sunRadius };

      // Sun Outer Corona Pulse
      const sunPulse = Math.sin(time * 0.003) * 3;
      const coronaGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        sunRadius,
        centerX,
        centerY,
        sunRadius + 14 + sunPulse
      );
      coronaGrad.addColorStop(0, isLight ? 'rgba(245, 158, 11, 0.4)' : 'rgba(251, 191, 36, 0.35)');
      coronaGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = coronaGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sunRadius + 14 + sunPulse, 0, Math.PI * 2);
      ctx.fill();

      // Sun Core Body
      const sunGrad = ctx.createRadialGradient(
        centerX - 4,
        centerY - 4,
        2,
        centerX,
        centerY,
        sunRadius
      );
      sunGrad.addColorStop(0, '#FEF08A');
      sunGrad.addColorStop(0.35, '#F59E0B');
      sunGrad.addColorStop(0.85, '#D97706');
      sunGrad.addColorStop(1, '#B45309');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      // Sun Edge Definition
      ctx.strokeStyle = isLight ? '#B45309' : '#FEF08A';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Sun Selection Reticle
      if (selectedBody.id === 'sun') {
        drawReticle(ctx, centerX, centerY, sunRadius + 6, isLight);
      }

      // Draw Planets
      activeBodies.slice(1).forEach((planet) => {
        const orbitRadius = isInner ? planet.orbitalRadiusPxInner : planet.orbitalRadiusPxFull;
        const angle = anglesRef.current[planet.id];
        const px = centerX + Math.cos(angle) * orbitRadius;
        const py = centerY + Math.sin(angle) * orbitRadius;

        // Visual radius scaling
        let pRadius = 4.5;
        if (planet.id === 'jupiter') pRadius = isInner ? 10 : 8.5;
        else if (planet.id === 'saturn') pRadius = isInner ? 8.5 : 7.5;
        else if (planet.id === 'uranus' || planet.id === 'neptune') pRadius = 5.5;
        else if (planet.id === 'earth' || planet.id === 'venus') pRadius = isInner ? 6 : 5;
        else if (planet.id === 'mercury') pRadius = isInner ? 4 : 3.5;
        else if (planet.id === 'mars') pRadius = isInner ? 4.5 : 4;

        bodyPositionsRef.current[planet.id] = { x: px, y: py, r: pRadius };

        const isSelected = planet.id === selectedBody.id;

        // Selection Target Reticle
        if (isSelected) {
          drawReticle(ctx, px, py, pRadius + (planet.hasRings ? 8 : 5), isLight);
        }

        // Saturn Rings (drawn behind planet first)
        if (planet.hasRings) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(0.35); // Axial tilt angle
          ctx.beginPath();
          ctx.ellipse(0, 0, pRadius * 2.3, pRadius * 0.75, 0, 0, Math.PI * 2);
          ctx.strokeStyle = isLight ? 'rgba(202, 138, 4, 0.7)' : 'rgba(253, 224, 71, 0.65)';
          ctx.lineWidth = 2.2;
          ctx.stroke();
          ctx.restore();
        }

        // Planet Body
        const fillColor = isLight ? planet.lightBodyColor : planet.bodyColor;
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(px, py, pRadius, 0, Math.PI * 2);
        ctx.fill();

        // Planet Rim Outline
        ctx.strokeStyle = isLight ? '#0F172A' : 'rgba(0, 0, 0, 0.65)';
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // Special Planet Details
        if (planet.id === 'jupiter') {
          // Cloud band and red spot
          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, pRadius, 0, Math.PI * 2);
          ctx.clip();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(px - pRadius, py - 1.5);
          ctx.lineTo(px + pRadius, py - 1.5);
          ctx.stroke();
          ctx.fillStyle = '#DC2626';
          ctx.beginPath();
          ctx.arc(px + 2, py + 1.5, 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (planet.id === 'earth') {
          // Atmosphere aura
          ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.4)' : 'rgba(56, 189, 248, 0.5)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Planet Name Label (High-contrast with halo outline)
        ctx.font = isSelected ? 'bold 10px monospace' : '9px monospace';
        ctx.textAlign = 'center';
        ctx.lineWidth = 3;
        ctx.strokeStyle = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(2, 6, 23, 0.95)';
        ctx.strokeText(planet.name.toUpperCase(), px, py + pRadius + 13);

        ctx.fillStyle = isLight
          ? isSelected ? '#0F172A' : '#334155'
          : isSelected ? '#FFFFFF' : '#CBD5E1';
        ctx.fillText(planet.name.toUpperCase(), px, py + pRadius + 13);
      });

      if (isVisible && isRunning) {
        animationId = requestAnimationFrame(render);
      }
    };

    animationId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [selectedBody]);

  function drawReticle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    isLight: boolean
  ) {
    ctx.strokeStyle = isLight ? '#0284C7' : '#38BDF8';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Four corner crosshair ticks
    const tickLen = 4;
    ctx.beginPath();
    ctx.moveTo(x - radius - tickLen, y);
    ctx.lineTo(x - radius + 1, y);
    ctx.moveTo(x + radius - 1, y);
    ctx.lineTo(x + radius + tickLen, y);
    ctx.moveTo(x, y - radius - tickLen);
    ctx.lineTo(x, y - radius + 1);
    ctx.moveTo(x, y + radius - 1);
    ctx.lineTo(x, y + radius + tickLen);
    ctx.stroke();
  }

  // Handle canvas click / tap to select nearest celestial body
  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = (clientX - rect.left) * scaleX;
    const canvasY = (clientY - rect.top) * scaleY;

    // Hit test against recorded positions
    let closestBody: SolarSystemBody | null = null;
    let minDistance = 28; // Hit detection threshold

    Object.entries(bodyPositionsRef.current).forEach(([id, pos]) => {
      const dist = Math.hypot(canvasX - pos.x, canvasY - pos.y);
      if (dist < minDistance) {
        minDistance = dist;
        const found = SOLAR_BODIES.find((b) => b.id === id);
        if (found) closestBody = found;
      }
    });

    if (closestBody) {
      selectBody(closestBody);
    }
  };

  const selectBody = (body: SolarSystemBody) => {
    setSelectedBody(body);
    playTelemetryBeep(body.id === 'earth' ? 1046 : body.id === 'jupiter' ? 880 : 660, 0.08);
  };

  return (
    <div
      className="solar-system-orrery-container"
      style={{
        backgroundColor: 'var(--deep)',
        border: '1px solid color-mix(in srgb, var(--orbit) 30%, transparent)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
      aria-label="Interactive Solar System Orrery & Planetary Telemetry"
    >
      <style>{`
        .solar-pill-btn {
          padding: 0.35rem 0.75rem;
          font-size: 0.75rem;
          font-family: var(--font-mono);
          font-weight: 600;
          letter-spacing: 0.04em;
          color: var(--moon) !important;
          background-color: transparent;
          border: 1px solid transparent;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all 0.18s ease;
          white-space: nowrap;
        }
        .solar-pill-btn:hover {
          background-color: color-mix(in srgb, var(--orbit) 18%, transparent);
          border-color: color-mix(in srgb, var(--orbit) 35%, transparent);
          color: var(--moon) !important;
        }
        .solar-pill-btn.active {
          background-color: var(--orbit) !important;
          color: var(--void) !important;
          border-color: var(--orbit) !important;
          font-weight: 700 !important;
          box-shadow: 0 0 16px color-mix(in srgb, var(--orbit) 50%, transparent) !important;
        }
        .solar-ctrl-btn {
          padding: 0.4rem 0.85rem;
          font-size: 0.75rem;
          font-family: var(--font-mono);
          font-weight: 600;
          letter-spacing: 0.05em;
          background-color: color-mix(in srgb, var(--navy) 70%, transparent);
          color: var(--moon);
          border: 1px solid color-mix(in srgb, var(--steel) 40%, transparent);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .solar-ctrl-btn:hover {
          border-color: var(--orbit);
          background-color: color-mix(in srgb, var(--orbit) 15%, transparent);
          color: var(--moon);
        }

        /* Light Mode Overrides */
        html[data-theme="solar-flare"] .solar-system-orrery-container,
        html.theme-solar-flare .solar-system-orrery-container,
        html.light-mode .solar-system-orrery-container {
          background-color: #ffffff !important;
          border-color: rgba(0, 0, 0, 0.14) !important;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06) !important;
        }
        html[data-theme="solar-flare"] .solar-canvas-wrap,
        html.theme-solar-flare .solar-canvas-wrap,
        html.light-mode .solar-canvas-wrap {
          background-color: #f8fafc !important;
          border-color: rgba(0, 0, 0, 0.12) !important;
        }
        html[data-theme="solar-flare"] .solar-dossier,
        html.theme-solar-flare .solar-dossier,
        html.light-mode .solar-dossier {
          background-color: #f1f5f9 !important;
          border-color: rgba(0, 0, 0, 0.12) !important;
        }
        html[data-theme="solar-flare"] .solar-pill-bar,
        html.theme-solar-flare .solar-pill-bar,
        html.light-mode .solar-pill-bar {
          background-color: rgba(255, 255, 255, 0.95) !important;
          border-color: rgba(0, 0, 0, 0.15) !important;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08) !important;
        }
        html[data-theme="solar-flare"] .solar-pill-btn,
        html.theme-solar-flare .solar-pill-btn,
        html.light-mode .solar-pill-btn {
          color: #334155 !important;
        }
        html[data-theme="solar-flare"] .solar-pill-btn.active,
        html.theme-solar-flare .solar-pill-btn.active,
        html.light-mode .solar-pill-btn.active {
          background-color: #0284c7 !important;
          color: #ffffff !important;
          border-color: #0284c7 !important;
        }
        html[data-theme="solar-flare"] .solar-ctrl-btn,
        html.theme-solar-flare .solar-ctrl-btn,
        html.light-mode .solar-ctrl-btn {
          background-color: #ffffff !important;
          color: #0f172a !important;
          border-color: rgba(0, 0, 0, 0.18) !important;
        }
        html[data-theme="solar-flare"] .solar-metric-box,
        html.theme-solar-flare .solar-metric-box,
        html.light-mode .solar-metric-box {
          background-color: #ffffff !important;
          border-color: rgba(0, 0, 0, 0.1) !important;
        }
        html[data-theme="solar-flare"] .solar-heading,
        html.theme-solar-flare .solar-heading,
        html.light-mode .solar-heading {
          color: #0f172a !important;
        }
        html[data-theme="solar-flare"] .solar-prose,
        html.theme-solar-flare .solar-prose,
        html.light-mode .solar-prose {
          color: #334155 !important;
        }
        html[data-theme="solar-flare"] .solar-metric-val,
        html.theme-solar-flare .solar-metric-val,
        html.light-mode .solar-metric-val {
          color: #0f172a !important;
        }
        html[data-theme="solar-flare"] .solar-metric-lbl,
        html.theme-solar-flare .solar-metric-lbl,
        html.light-mode .solar-metric-lbl {
          color: #475569 !important;
          font-weight: 700 !important;
        }
      `}</style>

      {/* Header & Controls Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          borderBottom: '1px solid color-mix(in srgb, var(--steel) 25%, transparent)',
          paddingBottom: '1rem',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--orbit)',
              letterSpacing: '0.15em',
            }}
          >
            INTERACTIVE HELIOCENTRIC SIMULATOR
          </div>
          <h3
            className="solar-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: 'var(--moon)',
              margin: '0.2rem 0 0 0',
            }}
          >
            Interactive Solar System Orrery
          </h3>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Zoom/Scope Toggle */}
          <button
            onClick={() => {
              setViewScope((prev) => (prev === 'full' ? 'inner' : 'full'));
              playTelemetryBeep(700, 0.05);
            }}
            className="solar-ctrl-btn"
            title="Toggle between Full Solar System and Inner Planets view"
            aria-label="Toggle view scope"
          >
            {viewScope === 'full' ? 'INNER PLANETS ZOOM' : 'FULL SYSTEM VIEW'}
          </button>

          {/* Speed Multiplier */}
          <button
            onClick={() => {
              const speeds = [0.5, 1.0, 2.0, 5.0];
              const nextIdx = (speeds.indexOf(speedMultiplier) + 1) % speeds.length;
              setSpeedMultiplier(speeds[nextIdx]);
              playTelemetryBeep(600, 0.05);
            }}
            className="solar-ctrl-btn"
            title="Cycle orbital speed"
            aria-label="Cycle orbital speed"
          >
            {speedMultiplier}x SPEED
          </button>

          {/* Orbit Tracks Toggle */}
          <button
            onClick={() => setShowOrbits((prev) => !prev)}
            className="solar-ctrl-btn"
            title="Toggle orbital tracks"
            aria-label="Toggle orbital tracks"
          >
            {showOrbits ? 'ORBITS: ON' : 'ORBITS: OFF'}
          </button>
        </div>
      </div>

      {/* Main Body: Canvas + Telemetry Dossier */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center',
        }}
      >
        {/* Canvas Display */}
        <div
          className="solar-canvas-wrap"
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 1',
            maxHeight: '520px',
            backgroundColor: 'var(--void)',
            border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <canvas
            ref={canvasRef}
            width={540}
            height={540}
            onClick={handleCanvasInteraction}
            onTouchStart={handleCanvasInteraction}
            style={{
              width: '100%',
              height: '100%',
              maxWidth: '540px',
              maxHeight: '540px',
              display: 'block',
              cursor: 'crosshair',
            }}
            title="Tap any planet or the Sun to inspect telemetry"
          />

          {/* Quick Select Buttons Overlay (Horizontal Scrollable Strip) */}
          <div
            className="solar-pill-bar"
            style={{
              position: 'absolute',
              bottom: '0.65rem',
              left: '0.65rem',
              right: '0.65rem',
              display: 'flex',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              gap: '0.35rem',
              backgroundColor: 'color-mix(in srgb, var(--deep) 94%, var(--navy))',
              backdropFilter: 'blur(16px)',
              padding: '0.4rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid color-mix(in srgb, var(--steel) 35%, transparent)',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
              zIndex: 10,
              scrollbarWidth: 'none',
            }}
          >
            {SOLAR_BODIES.map((b) => {
              const isSelected = selectedBody.id === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => selectBody(b)}
                  className={`solar-pill-btn ${isSelected ? 'active' : ''}`}
                >
                  {b.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Body Telemetry Dossier */}
        <div
          className="solar-dossier"
          style={{
            backgroundColor: 'var(--navy)',
            border: '1px solid color-mix(in srgb, var(--orbit) 35%, transparent)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--astrophage)',
                  letterSpacing: '0.1em',
                }}
              >
                {selectedBody.type.toUpperCase()}
              </span>
              <span
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: selectedBody.bodyColor,
                  border: '1.5px solid var(--steel)',
                  boxShadow: `0 0 10px ${selectedBody.bodyColor}`,
                  display: 'inline-block',
                }}
              />
            </div>
            <h4
              className="solar-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.875rem',
                color: 'var(--moon)',
                margin: '0.25rem 0 0 0',
              }}
            >
              {selectedBody.name}
            </h4>
          </div>

          <p
            className="solar-prose"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              color: 'var(--moon)',
              margin: 0,
            }}
          >
            {selectedBody.description}
          </p>

          {/* Telemetry Metrics Grid */}
          <div
            className="solar-metric-box"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.75rem',
              backgroundColor: 'color-mix(in srgb, var(--void) 50%, transparent)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid color-mix(in srgb, var(--steel) 25%, transparent)',
            }}
          >
            <div>
              <div
                className="solar-metric-lbl"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  color: 'var(--steel)',
                }}
              >
                DISTANCE FROM SUN
              </div>
              <div
                className="solar-metric-val"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  color: 'var(--moon)',
                  fontWeight: 600,
                }}
              >
                {selectedBody.distanceFromSunAU > 0
                  ? `${selectedBody.distanceFromSunAU} AU (${selectedBody.distanceFromSunKm})`
                  : 'Central Star (0 AU)'}
              </div>
            </div>

            <div>
              <div
                className="solar-metric-lbl"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  color: 'var(--steel)',
                }}
              >
                ORBITAL PERIOD
              </div>
              <div
                className="solar-metric-val"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  color: 'var(--moon)',
                  fontWeight: 600,
                }}
              >
                {selectedBody.orbitalPeriodLabel}
              </div>
            </div>

            <div>
              <div
                className="solar-metric-lbl"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  color: 'var(--steel)',
                }}
              >
                MEAN DIAMETER
              </div>
              <div
                className="solar-metric-val"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  color: 'var(--moon)',
                  fontWeight: 600,
                }}
              >
                {selectedBody.diameterKm.toLocaleString()} km
              </div>
            </div>

            <div>
              <div
                className="solar-metric-lbl"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  color: 'var(--steel)',
                }}
              >
                SURFACE TEMPERATURE
              </div>
              <div
                className="solar-metric-val"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  color: 'var(--moon)',
                  fontWeight: 600,
                }}
              >
                {selectedBody.surfaceTemp}
              </div>
            </div>

            <div>
              <div
                className="solar-metric-lbl"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  color: 'var(--steel)',
                }}
              >
                NATURAL SATELLITES
              </div>
              <div
                className="solar-metric-val"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  color: 'var(--moon)',
                  fontWeight: 600,
                }}
              >
                {selectedBody.id === 'sun'
                  ? '8 Major Planets'
                  : `${selectedBody.moonsCount} Confirmed Moons`}
              </div>
            </div>

            <div>
              <div
                className="solar-metric-lbl"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  color: 'var(--steel)',
                }}
              >
                ROTATIONAL DAY
              </div>
              <div
                className="solar-metric-val"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  color: 'var(--moon)',
                  fontWeight: 600,
                }}
              >
                {selectedBody.rotationPeriod}
              </div>
            </div>
          </div>

          {/* Expedition Lore / Astrodynamics Reconnaissance */}
          <div
            style={{
              borderLeft: '2px solid var(--orbit)',
              paddingLeft: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              lineHeight: 1.5,
              color: 'var(--star)',
            }}
          >
            <span style={{ color: 'var(--astrophage)', fontWeight: 600 }}>ASTRODYNAMICS RECON: </span>
            {selectedBody.lore}
          </div>
        </div>
      </div>
    </div>
  );
}
