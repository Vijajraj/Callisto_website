import React, { useState, useEffect, useRef } from 'react';
import { playTelemetryBeep } from '../../lib/audio';

interface JovianBody {
  id: string;
  name: string;
  type: string;
  orbitalRadiusPx: number; // scaled for canvas
  actualRadiusKm: number;
  orbitalPeriodDays: number;
  bodyColor: string;
  orbitColor: string;
  diameterKm: number;
  orbitalSpeedRadPerSec: number;
  description: string;
  atmosphere: string;
  surfaceTemp: string;
  lore: string;
}

const JOVIAN_BODIES: JovianBody[] = [
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'Gas Giant (Primary)',
    orbitalRadiusPx: 0,
    actualRadiusKm: 0,
    orbitalPeriodDays: 0,
    bodyColor: '#C98A66',
    orbitColor: 'transparent',
    diameterKm: 139820,
    orbitalSpeedRadPerSec: 0,
    description: 'The monarch of our planetary system, hosting a swirling turbulent atmosphere, the Great Red Spot, and an immense magnetic sheath.',
    atmosphere: 'Hydrogen (89%), Helium (10%)',
    surfaceTemp: '-110°C (Cloud tops)',
    lore: 'Center of mass for our expedition coordinates. Its gravitational resonance shapes all outer Galilean trajectories.',
  },
  {
    id: 'io',
    name: 'Io',
    type: 'Galilean Moon I',
    orbitalRadiusPx: 65,
    actualRadiusKm: 421700,
    orbitalPeriodDays: 1.77,
    bodyColor: '#FFB86B',
    orbitColor: 'rgba(255, 184, 107, 0.25)',
    diameterKm: 3643,
    orbitalSpeedRadPerSec: 1.2,
    description: 'The most volcanically active body in the Solar System, driven by immense tidal flexing from Jupiter and Europa.',
    atmosphere: 'Sulfur Dioxide traces',
    surfaceTemp: '-130°C to 1600°C (volcanic vents)',
    lore: 'Continuous silicate plumes surge over 300 km into space, creating the Jovian plasma torus.',
  },
  {
    id: 'europa',
    name: 'Europa',
    type: 'Galilean Moon II',
    orbitalRadiusPx: 105,
    actualRadiusKm: 670900,
    orbitalPeriodDays: 3.55,
    bodyColor: '#CFCBF2',
    orbitColor: 'rgba(207, 203, 242, 0.25)',
    diameterKm: 3122,
    orbitalSpeedRadPerSec: 0.6,
    description: 'A smooth, bright shell of water ice crisscrossed by chaotic reddish cycloid fractures, hiding a vast saline ocean beneath.',
    atmosphere: 'Trace molecular Oxygen',
    surfaceTemp: '-160°C (Equator)',
    lore: 'Estimated to contain more liquid water than all of Earth’s oceans combined. High priority for exobiological reconnaissance.',
  },
  {
    id: 'ganymede',
    name: 'Ganymede',
    type: 'Galilean Moon III',
    orbitalRadiusPx: 155,
    actualRadiusKm: 1070400,
    orbitalPeriodDays: 7.15,
    bodyColor: '#94A3B8',
    orbitColor: 'rgba(148, 163, 184, 0.25)',
    diameterKm: 5268,
    orbitalSpeedRadPerSec: 0.3,
    description: 'The largest moon in the Solar System—larger than Mercury—and the only satellite with its own internally generated magnetic field.',
    atmosphere: 'Thin Oxygen exosphere',
    surfaceTemp: '-163°C',
    lore: 'Features dual terrain: ancient cratered dark regions interspersed with younger, grooved tectonic fractures.',
  },
  {
    id: 'callisto',
    name: 'Callisto',
    type: 'Galilean Moon IV (Club Namesake)',
    orbitalRadiusPx: 215,
    actualRadiusKm: 1882700,
    orbitalPeriodDays: 16.69,
    bodyColor: '#F7F5FF',
    orbitColor: 'rgba(247, 245, 255, 0.4)',
    diameterKm: 4821,
    orbitalSpeedRadPerSec: 0.128,
    description: 'The ancient, crater-scarred outpost of the Jovian realm. Lying outside Jupiter’s lethal radiation belts, it is our sanctuary.',
    atmosphere: 'Carbon Dioxide & Oxygen traces',
    surfaceTemp: '-139°C',
    lore: 'Discovered by Galileo Galilei in 1610. Undisturbed for 4 billion years, it serves as the ultimate deep-space staging ground.',
  },
];

export default function JovianOrrery(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedBody, setSelectedBody] = useState<JovianBody>(JOVIAN_BODIES[4]); // Default to Callisto
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [showOrbits, setShowOrbits] = useState<boolean>(true);

  const anglesRef = useRef<{ [key: string]: number }>({
    io: 0.5,
    europa: 2.1,
    ganymede: 4.0,
    callisto: 1.2,
  });

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const speedRef = useRef(speedMultiplier);
  speedRef.current = speedMultiplier;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Advance angles if playing
      if (isPlayingRef.current) {
        JOVIAN_BODIES.slice(1).forEach((moon) => {
          anglesRef.current[moon.id] =
            (anglesRef.current[moon.id] + moon.orbitalSpeedRadPerSec * speedRef.current * dt) %
            (Math.PI * 2);
        });
      }

      // Draw Orbit Lines
      if (showOrbits) {
        JOVIAN_BODIES.slice(1).forEach((moon) => {
          ctx.strokeStyle = moon.orbitColor;
          ctx.lineWidth = moon.id === selectedBody.id ? 1.5 : 1;
          ctx.setLineDash(moon.id === 'callisto' ? [4, 4] : []);
          ctx.beginPath();
          ctx.arc(centerX, centerY, moon.orbitalRadiusPx, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        });
      }

      // Draw Jupiter (Center)
      const jupiterRadius = 24;
      const jupGrad = ctx.createRadialGradient(
        centerX - 6,
        centerY - 6,
        2,
        centerX,
        centerY,
        jupiterRadius
      );
      jupGrad.addColorStop(0, '#FFD8A8');
      jupGrad.addColorStop(0.4, '#C98A66');
      jupGrad.addColorStop(0.7, '#8C4D28');
      jupGrad.addColorStop(1, '#4A2411');

      ctx.fillStyle = jupGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, jupiterRadius, 0, Math.PI * 2);
      ctx.fill();

      // Jupiter cloud bands
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, jupiterRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX - jupiterRadius, centerY - 6);
      ctx.lineTo(centerX + jupiterRadius, centerY - 6);
      ctx.moveTo(centerX - jupiterRadius, centerY + 5);
      ctx.lineTo(centerX + jupiterRadius, centerY + 5);
      ctx.stroke();

      // Great Red Spot
      ctx.fillStyle = '#C94A29';
      ctx.beginPath();
      ctx.ellipse(centerX + 8, centerY + 6, 4, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Jupiter Glow
      const jupGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        jupiterRadius,
        centerX,
        centerY,
        jupiterRadius + 12
      );
      jupGlow.addColorStop(0, 'rgba(201, 138, 102, 0.35)');
      jupGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = jupGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, jupiterRadius + 12, 0, Math.PI * 2);
      ctx.fill();

      // Draw Galilean Moons
      JOVIAN_BODIES.slice(1).forEach((moon) => {
        const angle = anglesRef.current[moon.id];
        const mx = centerX + Math.cos(angle) * moon.orbitalRadiusPx;
        const my = centerY + Math.sin(angle) * moon.orbitalRadiusPx;

        const isSelected = moon.id === selectedBody.id;
        const moonRadius = moon.id === 'ganymede' ? 6 : moon.id === 'callisto' ? 5.5 : 4.5;

        // Selection Target Reticle
        if (isSelected) {
          ctx.strokeStyle = 'var(--moon, #F7F5FF)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(mx, my, moonRadius + 6, 0, Math.PI * 2);
          ctx.stroke();

          // Reticle ticks
          ctx.beginPath();
          ctx.moveTo(mx - moonRadius - 9, my);
          ctx.lineTo(mx - moonRadius - 5, my);
          ctx.moveTo(mx + moonRadius + 5, my);
          ctx.lineTo(mx + moonRadius + 9, my);
          ctx.moveTo(mx, my - moonRadius - 9);
          ctx.lineTo(mx, my - moonRadius - 5);
          ctx.moveTo(mx, my + moonRadius + 5);
          ctx.lineTo(mx, my + moonRadius + 9);
          ctx.stroke();
        }

        // Moon Body
        ctx.fillStyle = moon.bodyColor;
        ctx.beginPath();
        ctx.arc(mx, my, moonRadius, 0, Math.PI * 2);
        ctx.fill();

        // Moon Name Label
        ctx.fillStyle = isSelected ? 'var(--moon, #FFF5F5)' : 'var(--star, #FFB399)';
        ctx.font = isSelected ? 'bold 10px monospace' : '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(moon.name.toUpperCase(), mx, my + moonRadius + 14);
      });

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [selectedBody, showOrbits]);

  const selectBody = (body: JovianBody) => {
    setSelectedBody(body);
    playTelemetryBeep(body.id === 'callisto' ? 1046 : 880, 0.08);
  };

  return (
    <div
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
      aria-label="Interactive Jovian System Orbital Orrery"
    >
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
            INTERACTIVE CELESTIAL SIMULATOR
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: 'var(--moon)',
              margin: '0.2rem 0 0 0',
            }}
          >
            Jovian System Orbital Orrery
          </h3>
        </div>

        {/* Playback Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              backgroundColor: isPlaying
                ? 'color-mix(in srgb, var(--navy) 70%, transparent)'
                : 'color-mix(in srgb, var(--astrophage) 25%, transparent)',
              color: 'var(--moon)',
              border: '1px solid color-mix(in srgb, var(--orbit) 40%, transparent)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}
          >
            {isPlaying ? '⏸ PAUSE' : '▶ RESUME'}
          </button>

          <button
            onClick={() => {
              const speeds = [0.5, 1.0, 2.0, 5.0];
              const nextIdx = (speeds.indexOf(speedMultiplier) + 1) % speeds.length;
              setSpeedMultiplier(speeds[nextIdx]);
              playTelemetryBeep(600, 0.05);
            }}
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              backgroundColor: 'color-mix(in srgb, var(--navy) 70%, transparent)',
              color: 'var(--star)',
              border: '1px solid color-mix(in srgb, var(--steel) 40%, transparent)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}
            title="Cycle orbital speed"
          >
            {speedMultiplier}x SPEED
          </button>

          <button
            onClick={() => setShowOrbits(!showOrbits)}
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              backgroundColor: showOrbits
                ? 'color-mix(in srgb, var(--orbit) 25%, transparent)'
                : 'color-mix(in srgb, var(--navy) 70%, transparent)',
              color: 'var(--moon)',
              border: '1px solid color-mix(in srgb, var(--orbit) 35%, transparent)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}
          >
            {showOrbits ? 'ORBITS: ON' : 'ORBITS: OFF'}
          </button>
        </div>
      </div>

      {/* Main Body: Canvas + Telemetry Dossier */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center',
        }}
      >
        {/* Canvas Display */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 1',
            maxHeight: '480px',
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
            width={480}
            height={480}
            style={{
              width: '100%',
              height: '100%',
              maxWidth: '480px',
              maxHeight: '480px',
              display: 'block',
            }}
          />

          {/* Quick Select Buttons overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '0.65rem',
              left: '0.65rem',
              right: '0.65rem',
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '0.35rem',
              backgroundColor: 'rgba(6, 9, 25, 0.8)',
              backdropFilter: 'blur(8px)',
              padding: '0.4rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid color-mix(in srgb, var(--steel) 25%, transparent)',
            }}
          >
            {JOVIAN_BODIES.map((b) => (
              <button
                key={b.id}
                onClick={() => selectBody(b)}
                style={{
                  padding: '0.25rem 0.55rem',
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: selectedBody.id === b.id ? 700 : 500,
                  color: selectedBody.id === b.id ? 'var(--moon)' : 'var(--star)',
                  backgroundColor:
                    selectedBody.id === b.id
                      ? 'color-mix(in srgb, var(--orbit) 50%, var(--deep))'
                      : 'transparent',
                  border:
                    selectedBody.id === b.id
                      ? '1px solid var(--orbit)'
                      : '1px solid transparent',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Body Telemetry Dossier */}
        <div
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
                {selectedBody.type}
              </span>
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: selectedBody.bodyColor,
                  boxShadow: `0 0 10px ${selectedBody.bodyColor}`,
                  display: 'inline-block',
                }}
              />
            </div>
            <h4
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
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              color: 'var(--star)',
              margin: 0,
            }}
          >
            {selectedBody.description}
          </p>

          {/* Telemetry Metrics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              backgroundColor: 'color-mix(in srgb, var(--void) 50%, transparent)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid color-mix(in srgb, var(--steel) 25%, transparent)',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  color: 'var(--steel)',
                }}
              >
                DIAMETER
              </div>
              <div
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
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  color: 'var(--steel)',
                }}
              >
                ORBITAL PERIOD
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  color: 'var(--moon)',
                  fontWeight: 600,
                }}
              >
                {selectedBody.orbitalPeriodDays > 0
                  ? `${selectedBody.orbitalPeriodDays} Earth Days`
                  : 'Central Body'}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  color: 'var(--steel)',
                }}
              >
                ORBITAL DISTANCE
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  color: 'var(--moon)',
                  fontWeight: 600,
                }}
              >
                {selectedBody.actualRadiusKm > 0
                  ? `${selectedBody.actualRadiusKm.toLocaleString()} km`
                  : 'Barycenter'}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  color: 'var(--steel)',
                }}
              >
                SURFACE TEMP
              </div>
              <div
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
          </div>

          {/* Expedition Lore / Historical Significance */}
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
            <span style={{ color: 'var(--astrophage)', fontWeight: 600 }}>MISSION RECON: </span>
            {selectedBody.lore}
          </div>
        </div>
      </div>
    </div>
  );
}
