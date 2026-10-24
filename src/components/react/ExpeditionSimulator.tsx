import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  playTelemetryBeep,
  playBeaconPing,
  playThrusterBurst,
  playWarpSurge,
} from '../../lib/audio';

/* =========================================================================
   SUB-SURFACE OCEAN CRYOBOT PROBE // THE DEEP ICE DESCENT
   Scientific simulation of an autonomous nuclear-thermal melt probe descending
   through Callisto's 150 km cryogenic ice shell down to the hidden liquid ocean.
   ========================================================================= */

interface IceLayer {
  name: string;
  depthStartKm: number;
  depthEndKm: number;
  tempK: number;
  pressureMpa: number;
  color: string;
  bgGrad: string;
  description: string;
  spectralTarget: string;
}

const ICE_STRATIGRAPHY: IceLayer[] = [
  {
    name: 'Layer 1: Cryo-Regolith & Impact Mantle',
    depthStartKm: 0,
    depthEndKm: 25,
    tempK: 115,
    pressureMpa: 8,
    color: '#ffb86b',
    bgGrad: 'linear-gradient(180deg, #181115 0%, #0d1624 100%)',
    description: 'Fine-grained silicate impact ejecta mixed with amorphous water-ice frost and frozen CO2.',
    spectralTarget: 'Amorphous H2O Ice (84%) + Silicates (14%)',
  },
  {
    name: 'Layer 2: Brittle Crystalline Ice Shell',
    depthStartKm: 25,
    depthEndKm: 70,
    tempK: 155,
    pressureMpa: 42,
    color: '#38bdf8',
    bgGrad: 'linear-gradient(180deg, #0d1624 0%, #092338 100%)',
    description: 'Dense, cold crystalline ice-I lattice laced with extensive extensional thermal stress fractures.',
    spectralTarget: 'Hexagonal Ice-Ih (92%) + Trace Noble Gases',
  },
  {
    name: 'Layer 3: Ductile Convective Ice & Gas Clathrates',
    depthStartKm: 70,
    depthEndKm: 120,
    tempK: 215,
    pressureMpa: 110,
    color: '#a855f7',
    bgGrad: 'linear-gradient(180deg, #092338 0%, #0f172a 100%)',
    description: 'Warm flowing plastic ice undergoing slow solid-state thermal convection; cages of methane clathrates.',
    spectralTarget: 'CH4 Methane Clathrate Hydrates (18%)',
  },
  {
    name: 'Layer 4: Basal Dielectric Melting Boundary',
    depthStartKm: 120,
    depthEndKm: 145,
    tempK: 265,
    pressureMpa: 165,
    color: '#34d399',
    bgGrad: 'linear-gradient(180deg, #0f172a 0%, #062e33 100%)',
    description: 'High-pressure slush transition boundary where geothermal heat from Callisto’s core softens the basal crust.',
    spectralTarget: 'Partially Molten Saline Slush + MgSO4 Salts',
  },
  {
    name: 'Layer 5: Sub-Surface Saline Ocean Interface',
    depthStartKm: 145,
    depthEndKm: 160,
    tempK: 274,
    pressureMpa: 195,
    color: '#22d3ee',
    bgGrad: 'linear-gradient(180deg, #062e33 0%, #021a24 100%)',
    description: 'Vast, conductive liquid saltwater ocean sustained by radioactive core decay and ancient Jovian tidal resonance.',
    spectralTarget: 'Liquid Saline Ocean (3.8 S/m Conductivity)',
  },
];

interface ObstacleRock {
  id: number;
  depthKm: number;
  xPct: number; // 15 to 85%
  radiusKm: number;
  density: string;
}

const METEORITE_INCLUSIONS: ObstacleRock[] = [
  { id: 1, depthKm: 18, xPct: 35, radiusKm: 6, density: 'Chondritic Stony Silicate' },
  { id: 2, depthKm: 42, xPct: 65, radiusKm: 8, density: 'Nickel-Iron Metallic Core Clast' },
  { id: 3, depthKm: 62, xPct: 25, radiusKm: 7, density: 'Basaltic Impact Fragment' },
  { id: 4, depthKm: 92, xPct: 70, radiusKm: 9, density: 'High-Density Carbonaceous Chondrite' },
  { id: 5, depthKm: 115, xPct: 40, radiusKm: 7, density: 'Deep Crustal Olivine Inclusion' },
  { id: 6, depthKm: 135, xPct: 60, radiusKm: 6, density: 'Hydrothermal Sulfide Nodules' },
];

export default function ExpeditionSimulator(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Probe Telemetry State
  const [depthKm, setDepthKm] = useState<number>(0);
  const [probeXPct, setProbeXPct] = useState<number>(50); // 15% to 85% horizontal position
  const [meltPowerKw, setMeltPowerKw] = useState<number>(45); // 10 to 80 kW thermal melt power
  const [thermalHeadTempK, setThermalHeadTempK] = useState<number>(340); // Heated tungsten cone
  const [batteryPct, setBatteryPct] = useState<number>(100);
  const [isMelting, setIsMelting] = useState<boolean>(false);
  const [sonarActive, setSonarActive] = useState<boolean>(false);
  const [samplesCollected, setSamplesCollected] = useState<string[]>([]);
  const [missionLog, setMissionLog] = useState<string>(
    'Nuclear-thermal cryobot anchored at Valhalla Ice Shelf. Ready for deep ice descent.'
  );
  const [oceanDiscovered, setOceanDiscovered] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'sonar' | 'stratigraphy' | 'samples'>('sonar');

  // Identify current layer based on depth
  const currentLayer =
    ICE_STRATIGRAPHY.find(
      (l) => depthKm >= l.depthStartKm && depthKm < l.depthEndKm
    ) || ICE_STRATIGRAPHY[ICE_STRATIGRAPHY.length - 1];

  // Manual Descent Step
  const stepMeltDescent = useCallback(() => {
    if (depthKm >= 148) {
      if (!oceanDiscovered) {
        setOceanDiscovered(true);
        playWarpSurge();
        setMissionLog(
          '[BREAKTHROUGH CONFIRMED] Basal ice penetrated at 148 km! Cryobot deployed into Callisto Subsurface Ocean!'
        );
      }
      return;
    }

    // Descent rate proportional to melt thermal power (kW)
    const deltaKm = parseFloat((meltPowerKw * 0.08).toFixed(1));
    const nextDepth = Math.min(150, parseFloat((depthKm + deltaKm).toFixed(1)));

    // Check collision with meteorite inclusions
    const collidedRock = METEORITE_INCLUSIONS.find(
      (rock) =>
        Math.abs(rock.depthKm - nextDepth) < 3.5 &&
        Math.abs(rock.xPct - probeXPct) < 12
    );

    if (collidedRock) {
      playTelemetryBeep(320, 0.25);
      setMissionLog(
        `[IMPEDANCE WARNING] Probe deflected by ${collidedRock.density}. Use Lateral Water-Jets [◀ / ▶] to steer around inclusion.`
      );
      setBatteryPct((b) => Math.max(15, b - 4));
      return;
    }

    setDepthKm(nextDepth);
    setBatteryPct((b) => Math.max(12, Math.round(b - meltPowerKw * 0.02)));
    setThermalHeadTempK(300 + Math.round(meltPowerKw * 1.5));
    playTelemetryBeep(900 + Math.round(nextDepth * 4), 0.06);

    if (nextDepth >= 148 && !oceanDiscovered) {
      setOceanDiscovered(true);
      playWarpSurge();
      setMissionLog(
        '[BREAKTHROUGH CONFIRMED] Saline liquid ocean detected at 148 km depth! Conductivity: 3.8 S/m. Mission complete!'
      );
    }
  }, [depthKm, meltPowerKw, probeXPct, oceanDiscovered]);

  // Steer Lateral Water Jets (Left / Right)
  const steerProbe = useCallback((direction: 'left' | 'right') => {
    playThrusterBurst();
    setProbeXPct((prev) => {
      const step = direction === 'left' ? -8 : 8;
      const next = Math.max(18, Math.min(82, prev + step));
      return next;
    });
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        steerProbe('left');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        steerProbe('right');
      } else if (['ArrowDown', 'KeyS', 'Space'].includes(e.code)) {
        e.preventDefault();
        stepMeltDescent();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [steerProbe, stepMeltDescent]);

  // Trigger Acoustic Sonar Scan
  const pulseAcousticSonar = () => {
    setSonarActive(true);
    playBeaconPing(1450, 0.35);

    setTimeout(() => {
      setSonarActive(false);
      // Find nearest upcoming obstacle
      const ahead = METEORITE_INCLUSIONS.filter((r) => r.depthKm > depthKm).sort(
        (a, b) => a.depthKm - b.depthKm
      )[0];

      if (ahead) {
        setMissionLog(
          `[SONAR ECHO] Detected ${ahead.density} at depth ${ahead.depthKm} km (Lateral Pos: ${ahead.xPct}%). Align probe trajectory.`
        );
      } else {
        setMissionLog(
          '[SONAR CLEAR] Acoustic reflection indicates clear cryogenic ice column. Downward path unobstructed.'
        );
      }
    }, 900);
  };

  // Collect Raman Laser Spectrometry Sample
  const sampleCurrentLayer = () => {
    if (samplesCollected.includes(currentLayer.name)) {
      setMissionLog(`[LOGGED] Scientific core data for ${currentLayer.name} already recorded in sample bay.`);
      return;
    }

    playBeaconPing(1200, 0.25);
    setSamplesCollected((prev) => [...prev, currentLayer.name]);
    setMissionLog(
      `[RAMAN SPECTROMETRY] Core sampled at ${depthKm} km depth: ${currentLayer.spectralTarget}.`
    );
  };

  // Render Tactical Vertical Stratigraphy Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Background: Deep Ice Chamber
    ctx.fillStyle = '#060913';
    ctx.fillRect(0, 0, w, h);

    // Calculate Viewport window around probe depth
    // Canvas displays a 40 km window centered on current depth
    const viewTopKm = Math.max(0, depthKm - 15);
    const viewBottomKm = viewTopKm + 45;

    // Draw Strata Bands within view
    ICE_STRATIGRAPHY.forEach((layer) => {
      if (layer.depthEndKm >= viewTopKm && layer.depthStartKm <= viewBottomKm) {
        const topY = ((layer.depthStartKm - viewTopKm) / 45) * h;
        const btmY = ((layer.depthEndKm - viewTopKm) / 45) * h;

        ctx.fillStyle = layer.color + '18'; // faint tint
        ctx.fillRect(0, Math.max(0, topY), w, btmY - topY);

        // Boundary Line
        ctx.strokeStyle = layer.color + '60';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, topY);
        ctx.lineTo(w, topY);
        ctx.stroke();

        // Boundary Label
        ctx.fillStyle = layer.color;
        ctx.font = '700 10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${layer.name.toUpperCase()} [${layer.depthStartKm} km]`, 12, topY + 14);
      }
    });

    // Draw Ocean Water Floor at 145+ km
    if (viewBottomKm >= 145) {
      const oceanY = ((145 - viewTopKm) / 45) * h;
      ctx.fillStyle = 'rgba(6, 182, 212, 0.35)';
      ctx.fillRect(0, Math.max(0, oceanY), w, h - oceanY);

      // Water Waves
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 20) {
        const wy = oceanY + Math.sin(x * 0.05 + Date.now() * 0.003) * 4;
        if (x === 0) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.stroke();
    }

    // Draw Meteorite Inclusions within viewport
    METEORITE_INCLUSIONS.forEach((rock) => {
      if (rock.depthKm >= viewTopKm - 5 && rock.depthKm <= viewBottomKm + 5) {
        const rx = (rock.xPct / 100) * w;
        const ry = ((rock.depthKm - viewTopKm) / 45) * h;

        // Sonar glow if sonar active
        if (sonarActive) {
          ctx.beginPath();
          ctx.arc(rx, ry, rock.radiusKm * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
          ctx.fill();
        }

        // Rock Ingot Body
        ctx.beginPath();
        ctx.arc(rx, ry, rock.radiusKm * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#451a03';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Hazard Tag
        ctx.fillStyle = '#ffedd5';
        ctx.font = '600 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`OBSTACLE: ${rock.depthKm} km`, rx, ry - rock.radiusKm * 2.5);
      }
    });

    // Draw Melt Probe
    const probeX = (probeXPct / 100) * w;
    const probeY = ((depthKm - viewTopKm) / 45) * h;

    // Thermal Melt Glow beneath cone
    const meltGlow = ctx.createRadialGradient(probeX, probeY + 16, 2, probeX, probeY + 28, 30);
    meltGlow.addColorStop(0, 'rgba(239, 68, 68, 0.7)');
    meltGlow.addColorStop(0.5, 'rgba(251, 191, 36, 0.4)');
    meltGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = meltGlow;
    ctx.beginPath();
    ctx.arc(probeX, probeY + 22, 28, 0, Math.PI * 2);
    ctx.fill();

    // Communications / Power Tether Line going up to surface
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(probeX, 0);
    ctx.lineTo(probeX, probeY - 14);
    ctx.stroke();
    ctx.setLineDash([]);

    // Cylindrical Probe Body
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(probeX - 9, probeY - 14, 18, 28, 3);
    ctx.fill();
    ctx.stroke();

    // Heated Tungsten Nose Cone
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(probeX - 9, probeY + 14);
    ctx.lineTo(probeX + 9, probeY + 14);
    ctx.lineTo(probeX, probeY + 24);
    ctx.closePath();
    ctx.fill();

    // Optical Sensor Window
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(probeX, probeY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Sonar Beam Arc if active
    if (sonarActive) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 2;
      [30, 55, 80].forEach((sr) => {
        ctx.beginPath();
        ctx.arc(probeX, probeY + 20, sr, 0.25 * Math.PI, 0.75 * Math.PI);
        ctx.stroke();
      });
    }

    // Depth Gauge on Left Margin
    ctx.fillStyle = 'rgba(148, 163, 184, 0.75)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    for (let d = Math.floor(viewTopKm); d <= Math.ceil(viewBottomKm); d += 10) {
      const dy = ((d - viewTopKm) / 45) * h;
      ctx.fillText(`${d} km -`, 48, dy + 3);
    }
  }, [depthKm, probeXPct, sonarActive]);

  return (
    <div
      style={{
        backgroundColor: 'var(--deep)',
        border: '1px solid color-mix(in srgb, var(--orbit) 40%, transparent)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        boxShadow: '0 16px 44px rgba(0, 0, 0, 0.55)',
        fontFamily: 'var(--font-mono)',
        color: 'var(--moon)',
      }}
    >
      {/* Top Avionics Mission Control Bar (Clean Static Telemetry Badges) */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-md)',
          borderBottom: '1px solid color-mix(in srgb, var(--steel) 25%, transparent)',
          paddingBottom: 'var(--space-md)',
          marginBottom: 'var(--space-lg)',
        }}
      >
        <div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--astrophage)', letterSpacing: '0.14em' }}>
            CALLISTO EXPEDITION // CRYOBOT OCEAN PROBE
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: '0.2rem 0 0 0', color: 'var(--moon)' }}>
            The Deep Ice Descent // Sub-Surface Ocean Mission
          </h2>
        </div>

        {/* Clean Static Telemetry Badges */}
        <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
          <div style={telemetryBadgeStyle}>
            <span style={{ color: 'var(--steel)' }}>SOL:</span> 1117
          </div>
          <div style={telemetryBadgeStyle}>
            <span style={{ color: 'var(--steel)' }}>TARGET:</span> SUB-SURFACE OCEAN
          </div>
          <div style={telemetryBadgeStyle}>
            <span style={{ color: 'var(--steel)' }}>DEPTH:</span>{' '}
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>{depthKm} km / 150 km</span>
          </div>
          <div style={telemetryBadgeStyle}>
            <span style={{ color: 'var(--steel)' }}>MELT TEMP:</span> {thermalHeadTempK} K
          </div>
          <div style={telemetryBadgeStyle}>
            <span style={{ color: 'var(--steel)' }}>PRESSURE:</span> {currentLayer.pressureMpa} MPa
          </div>
          <div style={telemetryBadgeStyle}>
            <span style={{ color: 'var(--steel)' }}>OCEAN:</span>{' '}
            <span style={{ color: oceanDiscovered ? '#4ade80' : '#f59e0b', fontWeight: 700 }}>
              {oceanDiscovered ? 'REACHED [148 km]' : 'PENDING'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Subsystem Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-sm)',
          borderBottom: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
          marginBottom: 'var(--space-md)',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('sonar')}
          style={tabStyle(activeTab === 'sonar')}
        >
          1. VERTICAL DESCENT RADAR & CONTROLS
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('stratigraphy')}
          style={tabStyle(activeTab === 'stratigraphy')}
        >
          2. ICE CRUST STRATIGRAPHY (5 LAYERS)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('samples')}
          style={tabStyle(activeTab === 'samples')}
        >
          3. ASTROBIOLOGY SAMPLE BAY ({samplesCollected.length}/5)
        </button>
      </div>

      {/* Tab 1: Vertical Descent Chamber & Controls */}
      {activeTab === 'sonar' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-lg)',
            alignItems: 'start',
          }}
        >
          {/* Vertical Stratigraphy Canvas */}
          <div>
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '2px solid color-mix(in srgb, var(--orbit) 50%, transparent)',
                backgroundColor: '#060913',
                boxShadow: '0 0 24px color-mix(in srgb, var(--orbit) 25%, transparent)',
              }}
            >
              <canvas
                ref={canvasRef}
                width={640}
                height={420}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                title="Cross-section of Callisto ice crust. Use controls below to steer and melt downward."
              />

              {/* In-Range Stratigraphy Horizon HUD */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: `1px solid ${currentLayer.color}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.75rem',
                  backdropFilter: 'blur(8px)',
                  maxWidth: '260px',
                }}
              >
                <div style={{ color: currentLayer.color, fontWeight: 700 }}>
                  CURRENT HORIZON
                </div>
                <div style={{ color: 'var(--moon)', fontSize: '0.6875rem' }}>
                  {currentLayer.name}
                </div>
                <div style={{ color: 'var(--steel)', fontSize: '0.625rem', marginTop: '2px' }}>
                  Ambient: {currentLayer.tempK} K // Hydrostatic: {currentLayer.pressureMpa} MPa
                </div>
              </div>
            </div>

            {/* Tactile Mobile & Desktop Steering & Melt Controls */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'var(--space-md)',
                padding: 'var(--space-sm) var(--space-md)',
                backgroundColor: 'color-mix(in srgb, var(--void) 70%, transparent)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid color-mix(in srgb, var(--steel) 25%, transparent)',
                gap: 'var(--space-md)',
              }}
            >
              {/* Lateral Water Jet Steering */}
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.625rem', color: 'var(--steel)', marginRight: '4px' }}>
                  LATERAL JETS:
                </span>
                <button
                  type="button"
                  onClick={() => steerProbe('left')}
                  style={steerBtnStyle}
                  title="Steer Cryobot Left"
                  aria-label="Steer Cryobot Left"
                >
                  ◀ STEER LEFT
                </button>
                <button
                  type="button"
                  onClick={() => steerProbe('right')}
                  style={steerBtnStyle}
                  title="Steer Cryobot Right"
                  aria-label="Steer Cryobot Right"
                >
                  STEER RIGHT ▶
                </button>
              </div>

              {/* Action Buttons: Pulse Sonar & Melt Step */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={pulseAcousticSonar}
                  style={secondaryActionBtnStyle}
                  title="Pulse downward acoustic sonar to detect rock obstacles"
                >
                  📡 PULSE SONAR
                </button>

                <button
                  type="button"
                  onClick={stepMeltDescent}
                  style={{
                    padding: '0.65rem 1.25rem',
                    backgroundColor: oceanDiscovered ? '#4ade80' : 'var(--orbit)',
                    color: 'var(--void)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 0 16px color-mix(in srgb, var(--orbit) 40%, transparent)',
                    transition: 'all 0.2s',
                  }}
                  title="Engage thermal melt head to penetrate ice"
                >
                  {oceanDiscovered ? 'OCEAN PENETRATED [148 KM]' : '🔥 MELT ICE DESCENT ↓'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Instrument Sliders & Layer Data */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {/* Thermal Melt Power Control Card */}
            <div style={toolCardStyle}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--astrophage)', marginBottom: '0.4rem' }}>
                NUCLEAR-THERMAL MELT-HEAD POWER
              </div>
              <p style={{ fontSize: '0.6875rem', color: 'var(--steel)', margin: '0 0 0.8rem 0' }}>
                Adjust wattage sent to the tungsten heated nose cone to melt through cryogenic ice.
              </p>

              <div style={{ marginBottom: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', marginBottom: '0.3rem' }}>
                  <span>Thermal Power Output</span>
                  <span style={{ color: 'var(--astrophage)', fontWeight: 700 }}>{meltPowerKw} kW</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="80"
                  value={meltPowerKw}
                  onChange={(e) => setMeltPowerKw(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--astrophage)' }}
                />
              </div>

              <button
                type="button"
                onClick={sampleCurrentLayer}
                style={secondaryActionBtnStyle}
              >
                🔬 SAMPLE RAMAN SPECTRA AT CURRENT DEPTH
              </button>
            </div>

            {/* Current Stratigraphy Summary */}
            <div style={toolCardStyle}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: currentLayer.color, marginBottom: '0.4rem' }}>
                LOCAL STRATIGRAPHY PROFILE
              </div>
              <p style={{ fontSize: '0.6875rem', color: 'var(--moon)', lineHeight: 1.5, margin: '0 0 0.6rem 0' }}>
                {currentLayer.description}
              </p>
              <div style={{ fontSize: '0.6875rem', color: 'var(--steel)' }}>
                Target Compounds: <strong style={{ color: 'var(--moon)' }}>{currentLayer.spectralTarget}</strong>
              </div>
            </div>

            {/* Ocean Conductivity Breakthrough Indicator */}
            <div style={toolCardStyle}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22d3ee', marginBottom: '0.4rem' }}>
                SALINITY & CONDUCTIVITY DETECTOR
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.4rem' }}>
                <span>Electrolytic Conductivity:</span>
                <span style={{ color: oceanDiscovered ? '#4ade80' : 'var(--steel)', fontWeight: 700 }}>
                  {oceanDiscovered ? '3.82 S/m [SALINE WATER]' : '0.00 S/m [SOLID ICE]'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Ice Crust Stratigraphy Overview */}
      {activeTab === 'stratigraphy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--astrophage)', fontWeight: 700 }}>
            CALLISTO CRUSTAL PROFILE // 0 TO 160 KM DEPTH MAPPING
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
            {ICE_STRATIGRAPHY.map((layer, idx) => {
              const isCurrent = currentLayer.name === layer.name;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: isCurrent
                      ? 'color-mix(in srgb, var(--navy) 80%, transparent)'
                      : 'color-mix(in srgb, var(--void) 85%, black)',
                    border: `1px solid ${isCurrent ? layer.color : 'color-mix(in srgb, var(--steel) 30%, transparent)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-md)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: layer.color }}>
                      {layer.name}
                    </span>
                    <span style={{ fontSize: '0.625rem', color: 'var(--steel)' }}>
                      {layer.depthStartKm} - {layer.depthEndKm} km
                    </span>
                  </div>

                  <p style={{ fontSize: '0.6875rem', color: 'var(--moon)', lineHeight: 1.4, margin: '0 0 0.6rem 0' }}>
                    {layer.description}
                  </p>

                  <div style={{ fontSize: '0.625rem', color: 'var(--steel)' }}>
                    <div>• Temperature: {layer.tempK} K (-{Math.round(273.15 - layer.tempK)}°C)</div>
                    <div>• Hydrostatic Pressure: {layer.pressureMpa} MPa</div>
                    <div>• Key Analyte: {layer.spectralTarget}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Astrobiology Sample Bay */}
      {activeTab === 'samples' && (
        <div style={toolCardStyle}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--astrophage)', marginBottom: '0.5rem' }}>
            CRYO-CORE ASTROBIOLOGY RETRIEVAL BAY
          </div>
          <p style={{ fontSize: '0.6875rem', color: 'var(--steel)', lineHeight: 1.4, margin: '0 0 1rem 0' }}>
            Sample clathrates, ancient trapped noble gases, and ocean electrolytes by clicking &ldquo;Sample Raman Spectra&rdquo; as the probe descends through each ice layer.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {ICE_STRATIGRAPHY.map((layer, idx) => {
              const collected = samplesCollected.includes(layer.name);
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: collected
                      ? 'color-mix(in srgb, #4ade80 12%, var(--void))'
                      : 'color-mix(in srgb, var(--void) 80%, black)',
                    border: `1px solid ${
                      collected ? '#4ade80' : 'color-mix(in srgb, var(--steel) 25%, transparent)'
                    }`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.65rem 0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: collected ? '#86efac' : 'var(--moon)' }}>
                      [{collected ? 'ANALYZED' : 'PENDING'}] {layer.name}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--steel)', marginTop: '2px' }}>
                      Depth: {layer.depthStartKm} - {layer.depthEndKm} km // Analyte: {layer.spectralTarget}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: collected ? '#4ade80' : 'var(--steel)' }}>
                    {collected ? '✓ CORE SECURED' : 'UNVISITED'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Real-Time Live Status Feedback Bar */}
      <div
        style={{
          marginTop: 'var(--space-md)',
          backgroundColor: '#040711',
          border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem',
          fontSize: '0.6875rem',
          lineHeight: 1.4,
        }}
      >
        <span style={{ color: 'var(--astrophage)', fontWeight: 700 }}>CRYOBOT TELEMETRY: </span>
        {missionLog}
      </div>

      {/* Mission Victory Banner on Ocean Breakthrough */}
      {oceanDiscovered && (
        <div
          style={{
            marginTop: 'var(--space-md)',
            backgroundColor: 'color-mix(in srgb, #22d3ee 16%, transparent)',
            border: '2px solid #22d3ee',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            textAlign: 'center',
            boxShadow: '0 0 24px rgba(34, 211, 238, 0.35)',
          }}
        >
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#67e8f9', marginBottom: '0.3rem' }}>
            [BREAKTHROUGH ACHIEVED] CALLISTO SUB-SURFACE OCEAN PENETRATED
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--moon)', margin: 0 }}>
            Tungsten melt-head penetrated the 148 km basal ice boundary. The nuclear cryobot is now buoyant in the saline liquid Jovian ocean!
          </p>
        </div>
      )}
    </div>
  );
}

const telemetryBadgeStyle: React.CSSProperties = {
  backgroundColor: 'color-mix(in srgb, var(--void) 85%, black)',
  border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
  borderRadius: 'var(--radius-sm)',
  padding: '0.3rem 0.6rem',
  fontSize: '0.6875rem',
};

const steerBtnStyle: React.CSSProperties = {
  padding: '0.45rem 0.75rem',
  backgroundColor: 'color-mix(in srgb, var(--navy) 75%, transparent)',
  border: '1px solid color-mix(in srgb, var(--steel) 40%, transparent)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--moon)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6875rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.1s',
};

const secondaryActionBtnStyle: React.CSSProperties = {
  padding: '0.65rem 0.85rem',
  backgroundColor: 'color-mix(in srgb, var(--navy) 80%, transparent)',
  border: '1px solid var(--orbit)',
  color: 'var(--moon)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.75rem',
  fontWeight: 700,
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};

const toolCardStyle: React.CSSProperties = {
  backgroundColor: 'color-mix(in srgb, var(--void) 80%, black)',
  border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
  borderRadius: 'var(--radius-md)',
  padding: 'var(--space-md)',
};

const tabStyle = (active: boolean): React.CSSProperties => ({
  background: 'transparent',
  border: 'none',
  borderBottom: active ? '2px solid var(--orbit)' : '2px solid transparent',
  color: active ? 'var(--orbit)' : 'var(--steel)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6875rem',
  fontWeight: 700,
  padding: '0.5rem 0.75rem',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
});
