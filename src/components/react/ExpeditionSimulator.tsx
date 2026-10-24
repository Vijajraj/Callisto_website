import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  playTelemetryBeep,
  playBeaconPing,
  playThrusterBurst,
  playWarpSurge,
} from '../../lib/audio';

interface ScientificSite {
  id: number;
  name: string;
  code: string;
  gridX: number; // 0 to 100 percentage
  gridY: number; // 0 to 100 percentage
  feature: string;
  scienceType: 'spectrometry' | 'drill' | 'radar' | 'antenna' | 'thermal';
  iceThicknessKm: number;
  composition: { ice: number; co2: number; minerals: number; organics: number };
  surveyed: boolean;
  discoveryNote: string;
}

const INITIAL_SITES: ScientificSite[] = [
  {
    id: 1,
    name: 'Valhalla Outer Rim Ridge',
    code: 'SITE-ALPHA',
    gridX: 22,
    gridY: 30,
    feature: 'Multi-ring impact fault with exposed primordial water-ice ridges.',
    scienceType: 'spectrometry',
    iceThicknessKm: 148,
    composition: { ice: 86, co2: 10, minerals: 3, organics: 1 },
    surveyed: false,
    discoveryNote: 'Spectrometer detected high-purity crystalline ice with trace carbon dioxide frost.',
  },
  {
    id: 2,
    name: 'Catena Crater Chain',
    code: 'SITE-BETA',
    gridX: 74,
    gridY: 24,
    feature: 'Linear impact chain caused by a fragmented Jovian cometary tidal breakup.',
    scienceType: 'drill',
    iceThicknessKm: 142,
    composition: { ice: 78, co2: 14, minerals: 6, organics: 2 },
    surveyed: false,
    discoveryNote: 'Extracted 150K cryogenic core sample containing primordial noble gases.',
  },
  {
    id: 3,
    name: 'Utgard Tectonic Fracture Chasm',
    code: 'SITE-GAMMA',
    gridX: 48,
    gridY: 62,
    feature: 'Deep extensional fault line opening deep crustal fracture corridors.',
    scienceType: 'radar',
    iceThicknessKm: 135,
    composition: { ice: 82, co2: 8, minerals: 8, organics: 2 },
    surveyed: false,
    discoveryNote: 'GPR echo confirms dielectric discontinuity at 135 km — Subsurface liquid ocean layer verified!',
  },
  {
    id: 4,
    name: 'Asgard Basin Uplift',
    code: 'SITE-DELTA',
    gridX: 80,
    gridY: 78,
    feature: 'Ancient central plateau with optimal line-of-sight to Jovian orbit.',
    scienceType: 'antenna',
    iceThicknessKm: 152,
    composition: { ice: 74, co2: 12, minerals: 11, organics: 3 },
    surveyed: false,
    discoveryNote: 'Erected deep-space microwave relay mast. Telemetry link with Earth CIT ground station active.',
  },
  {
    id: 5,
    name: 'Sub-surface Hydrothermal Vent Zone',
    code: 'SITE-EPSILON',
    gridX: 18,
    gridY: 82,
    feature: 'Localized geothermal anomaly with elevated thermal gradient in ice crust.',
    scienceType: 'thermal',
    iceThicknessKm: 126,
    composition: { ice: 68, co2: 15, minerals: 12, organics: 5 },
    surveyed: false,
    discoveryNote: 'Thermal probe recorded unexpected 8.4 mK/m positive thermal gradient sustained by internal core warmth.',
  },
];

export default function ExpeditionSimulator(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Rover Position (% of map 0-100)
  const [roverPos, setRoverPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [roverAngle, setRoverAngle] = useState<number>(0); // radians
  const [battery, setBattery] = useState<number>(100);
  const [odometerKm, setOdometerKm] = useState<number>(0);
  const [activeSite, setActiveSite] = useState<ScientificSite | null>(null);
  const [sites, setSites] = useState<ScientificSite[]>(INITIAL_SITES);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanLog, setScanLog] = useState<string>('Rover landed at Valhalla Basin Center. Commencing scientific expedition.');
  const [completedMission, setCompletedMission] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'map' | 'radar' | 'samples'>('map');

  const surveyedCount = sites.filter((s) => s.surveyed).length;

  // Move Rover by delta percentage
  const moveRover = useCallback((dx: number, dy: number) => {
    setRoverPos((prev) => {
      const nextX = Math.max(6, Math.min(94, prev.x + dx));
      const nextY = Math.max(6, Math.min(94, prev.y + dy));
      const dist = Math.hypot(nextX - prev.x, nextY - prev.y);

      if (dist > 0.1) {
        const angle = Math.atan2(dy, dx);
        setRoverAngle(angle);
        setOdometerKm((o) => parseFloat((o + dist * 0.12).toFixed(2)));
        setBattery((b) => Math.max(12, Math.round(b - dist * 0.08)));
      }

      return { x: nextX, y: nextY };
    });
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        moveRover(0, -3.5);
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        moveRover(0, 3.5);
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        moveRover(-3.5, 0);
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        moveRover(3.5, 0);
      } else if (e.code === 'Space') {
        e.preventDefault();
        triggerSurvey();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveRover]);

  // Proximity detection for scientific sites
  useEffect(() => {
    const PROXIMITY_RADIUS = 9.0; // % distance
    let nearest: ScientificSite | null = null;
    let minDist = Infinity;

    sites.forEach((site) => {
      const dist = Math.hypot(site.gridX - roverPos.x, site.gridY - roverPos.y);
      if (dist < PROXIMITY_RADIUS && dist < minDist) {
        minDist = dist;
        nearest = site;
      }
    });

    setActiveSite(nearest);
  }, [roverPos, sites]);

  // Canvas Rendering (Tactical Topographical Radar Display)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background: Deep Jovian Regolith Basalt
    ctx.fillStyle = '#070a14';
    ctx.fillRect(0, 0, width, height);

    // Coordinate Grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Topographical Contour Rims (Valhalla multi-ring impact basin)
    ctx.strokeStyle = 'rgba(255, 184, 107, 0.12)';
    ctx.lineWidth = 1.5;
    [100, 180, 260, 340].forEach((r) => {
      ctx.beginPath();
      ctx.arc(width * 0.45, height * 0.52, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Draw Scientific Target Sites
    sites.forEach((site) => {
      const sx = (site.gridX / 100) * width;
      const sy = (site.gridY / 100) * height;

      // Pulsing Beacon Range
      ctx.beginPath();
      ctx.arc(sx, sy, 22, 0, Math.PI * 2);
      ctx.strokeStyle = site.surveyed ? 'rgba(74, 222, 128, 0.4)' : 'rgba(255, 184, 107, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Site Core Indicator
      ctx.beginPath();
      ctx.arc(sx, sy, 7, 0, Math.PI * 2);
      ctx.fillStyle = site.surveyed ? '#4ade80' : '#ffb86b';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.fillStyle = site.surveyed ? '#86efac' : '#ffedd5';
      ctx.font = '600 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(site.code, sx, sy - 14);
    });

    // Draw Rover
    const rx = (roverPos.x / 100) * width;
    const ry = (roverPos.y / 100) * height;

    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(roverAngle);

    // Headlight Beam Cone
    const lightGrad = ctx.createRadialGradient(0, 0, 5, 45, 0, 55);
    lightGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
    lightGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 55, -0.45, 0.45);
    ctx.closePath();
    ctx.fill();

    // Rover Chassis (Autonomous Multi-Axle Science Vehicle)
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-14, -10, 28, 20, 4);
    ctx.fill();
    ctx.stroke();

    // 6 Rocker-Bogie All-Terrain Wheels
    ctx.fillStyle = '#ffb86b';
    [-12, 0, 12].forEach((wx) => {
      ctx.fillRect(wx - 2.5, -13, 5, 3);
      ctx.fillRect(wx - 2.5, 10, 5, 3);
    });

    // Mast / Camera Sensor Turret
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(4, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    // Directional Pointer Needle
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(4, 0);
    ctx.lineTo(16, 0);
    ctx.stroke();

    ctx.restore();

    // Scale Bar & Coordinates in Corner
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`LAT: 18.3°S  LON: 54.1°W  ALT: -1.2 km`, 12, height - 12);
  }, [roverPos, roverAngle, sites]);

  // Trigger Scientific Survey
  const triggerSurvey = () => {
    if (!activeSite) {
      setScanLog('No geological site in sensor range. Drive closer to a glowing beacon (Alpha-Epsilon).');
      return;
    }

    if (activeSite.surveyed) {
      setScanLog(`${activeSite.name} already surveyed. Telemetry logged in Mission Manifest.`);
      return;
    }

    setIsScanning(true);
    playTelemetryBeep(1100, 0.15);

    setTimeout(() => {
      setSites((prev) =>
        prev.map((s) => (s.id === activeSite.id ? { ...s, surveyed: true } : s))
      );
      playBeaconPing(1320, 0.3);
      setIsScanning(false);
      setScanLog(`[SUCCESS] ${activeSite.discoveryNote}`);

      // Check if all sites completed
      const remaining = sites.filter((s) => s.id !== activeSite.id && !s.surveyed).length;
      if (remaining === 0) {
        setCompletedMission(true);
        playWarpSurge();
      }
    }, 1200);
  };

  // Click on map to drive rover to coordinate
  const handleMapClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const dx = clickX - roverPos.x;
    const dy = clickY - roverPos.y;
    moveRover(dx * 0.4, dy * 0.4);
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--deep)',
        border: '1px solid color-mix(in srgb, var(--orbit) 35%, transparent)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
        fontFamily: 'var(--font-mono)',
        color: 'var(--moon)',
      }}
    >
      {/* Header Bar */}
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
            CALLISTO SURFACE ROVER EXPEDITION // ACT IV FLIGHT DECK
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', margin: '0.2rem 0 0 0', color: 'var(--moon)' }}>
            Valhalla Basin Cryo-Rover
          </h2>
        </div>

        {/* Live Telemetry Pill Readouts */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          <div style={telemetryPillStyle}>
            <span style={{ color: 'var(--steel)' }}>GRAVITY:</span> 0.126 g (Callisto)
          </div>
          <div style={telemetryPillStyle}>
            <span style={{ color: 'var(--steel)' }}>BATTERY:</span>{' '}
            <span style={{ color: battery > 40 ? '#4ade80' : '#f87171' }}>{battery}% RTG</span>
          </div>
          <div style={telemetryPillStyle}>
            <span style={{ color: 'var(--steel)' }}>SURVEYED:</span>{' '}
            <span style={{ color: 'var(--orbit)', fontWeight: 700 }}>
              {surveyedCount} / {sites.length} SITES
            </span>
          </div>
          <div style={telemetryPillStyle}>
            <span style={{ color: 'var(--steel)' }}>ODOMETER:</span> {odometerKm} km
          </div>
        </div>
      </div>

      {/* Main Expedition Interface Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-lg)',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Interactive Radar Surface Map & On-Screen Controls */}
        <div>
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '2px solid color-mix(in srgb, var(--orbit) 50%, transparent)',
              backgroundColor: '#070a14',
              boxShadow: '0 0 24px color-mix(in srgb, var(--orbit) 20%, transparent)',
            }}
          >
            <canvas
              ref={canvasRef}
              width={640}
              height={440}
              onClick={handleMapClick}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                cursor: 'crosshair',
              }}
              title="Click on terrain to navigate rover, or use arrow keys / D-pad below"
            />

            {/* Target Proximity Indicator Overlay */}
            {activeSite && (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  border: `1px solid ${activeSite.surveyed ? '#4ade80' : 'var(--orbit)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.75rem',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{ color: activeSite.surveyed ? '#4ade80' : 'var(--orbit)', fontWeight: 700 }}>
                  NEARBY: {activeSite.name} ({activeSite.code})
                </div>
                <div style={{ color: 'var(--steel)', fontSize: '0.6875rem' }}>
                  {activeSite.surveyed ? '[✓] Site data collected' : 'READY TO SURVEY [PRESS SPACE OR SCAN]'}
                </div>
              </div>
            )}
          </div>

          {/* Touch / Mobile / Desktop Control D-Pad */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'var(--space-md)',
              gap: 'var(--space-sm)',
              padding: 'var(--space-sm)',
              backgroundColor: 'color-mix(in srgb, var(--void) 70%, transparent)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid color-mix(in srgb, var(--steel) 25%, transparent)',
            }}
          >
            {/* Tactile D-Pad for all devices */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 38px)', gap: '4px' }}>
              <div />
              <button
                type="button"
                onClick={() => moveRover(0, -5)}
                style={dpadBtnStyle}
                aria-label="Drive North"
                title="Drive Forward / North"
              >
                ▲
              </button>
              <div />
              <button
                type="button"
                onClick={() => moveRover(-5, 0)}
                style={dpadBtnStyle}
                aria-label="Drive West"
                title="Drive West"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={() => moveRover(0, 5)}
                style={dpadBtnStyle}
                aria-label="Drive South"
                title="Drive South"
              >
                ▼
              </button>
              <button
                type="button"
                onClick={() => moveRover(5, 0)}
                style={dpadBtnStyle}
                aria-label="Drive East"
                title="Drive East"
              >
                ▶
              </button>
            </div>

            {/* Action Buttons: Deploy Science Instrument */}
            <div style={{ display: 'flex', gap: '0.5rem', flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={triggerSurvey}
                disabled={!activeSite || activeSite.surveyed || isScanning}
                style={{
                  padding: '0.65rem 1.25rem',
                  backgroundColor:
                    activeSite && !activeSite.surveyed
                      ? 'var(--orbit)'
                      : 'color-mix(in srgb, var(--navy) 60%, transparent)',
                  color: activeSite && !activeSite.surveyed ? 'var(--void)' : 'var(--steel)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: activeSite && !activeSite.surveyed ? 'pointer' : 'not-allowed',
                  boxShadow:
                    activeSite && !activeSite.surveyed
                      ? '0 0 16px color-mix(in srgb, var(--orbit) 50%, transparent)'
                      : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {isScanning ? 'ANALYZING...' : 'DEPLOY INSTRUMENTS'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSites(INITIAL_SITES);
                  setRoverPos({ x: 50, y: 50 });
                  setCompletedMission(false);
                  setScanLog('Expedition reset. Rover ready for fresh survey pass.');
                }}
                style={{
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'transparent',
                  border: '1px solid color-mix(in srgb, var(--steel) 40%, transparent)',
                  color: 'var(--steel)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
                title="Reset Rover & Sites"
              >
                RESET
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Scientific Telemetry & Analysis Bay */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid color-mix(in srgb, var(--steel) 25%, transparent)', paddingBottom: '0.4rem' }}>
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              style={tabBtnStyle(activeTab === 'map')}
            >
              1. SPECTRAL & GPR DATA
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('samples')}
              style={tabBtnStyle(activeTab === 'samples')}
            >
              2. CRYO SAMPLES ({surveyedCount}/5)
            </button>
          </div>

          {activeTab === 'map' ? (
            <div>
              {/* Ground-Penetrating Ice Radar (GPR) Visualizer */}
              <div
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--void) 85%, black)',
                  border: '1px solid color-mix(in srgb, var(--orbit) 40%, transparent)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-md)',
                  marginBottom: 'var(--space-md)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--astrophage)', fontWeight: 700 }}>
                    GROUND-PENETRATING RADAR (GPR) // SUB-SURFACE ECHO
                  </span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--steel)' }}>
                    TARGET DEPTH: 160 KM
                  </span>
                </div>

                {/* Subsurface Stratigraphy Graph */}
                <div
                  style={{
                    height: '110px',
                    position: 'relative',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    backgroundColor: '#040711',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Regolith Dust Layer */}
                  <div style={{ height: '18px', backgroundColor: '#332722', display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: '0.5625rem', color: '#ffb86b' }}>
                    0 - 2 km: Regolith & Ice-Dust Mantle
                  </div>

                  {/* Dense Cryogenic Ice Shell */}
                  <div style={{ flex: 1, backgroundColor: '#0f2942', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', color: '#7dd3fc', borderBottom: '2px dashed #38bdf8' }}>
                    Solid Ice Crust: ~135 km Thickness (150 Kelvin)
                  </div>

                  {/* Liquid Saline Ocean Boundary */}
                  <div style={{ height: '32px', backgroundColor: '#044e54', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', fontSize: '0.625rem', color: '#67e8f9', fontWeight: 700 }}>
                    <span>135 - 160+ km: Conductive Saline Ocean Layer</span>
                    <span style={{ color: '#4ade80' }}>[RADAR ECHO DETECTED]</span>
                  </div>
                </div>
              </div>

              {/* Chemical Spectrometry Composition Bar */}
              <div
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--void) 85%, black)',
                  border: '1px solid color-mix(in srgb, var(--steel) 25%, transparent)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-md)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--orbit)', fontWeight: 700, marginBottom: '0.5rem' }}>
                  INFRARED SPECTROMETRY // REGOLITH COMPOUND RATIOS
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.6875rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ color: '#7dd3fc' }}>Water Ice (H2O)</span>
                      <span>82%</span>
                    </div>
                    <div style={barTrackStyle}>
                      <div style={{ ...barFillStyle, width: '82%', backgroundColor: '#38bdf8' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ color: '#ffedd5' }}>Carbon Dioxide Frost (CO2)</span>
                      <span>11%</span>
                    </div>
                    <div style={barTrackStyle}>
                      <div style={{ ...barFillStyle, width: '11%', backgroundColor: '#f97316' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ color: '#cbd5e1' }}>Silicate Hydrated Minerals</span>
                      <span>7%</span>
                    </div>
                    <div style={barTrackStyle}>
                      <div style={{ ...barFillStyle, width: '7%', backgroundColor: '#94a3b8' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Cryogenic Samples Inventory */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              {sites.map((site) => (
                <div
                  key={site.id}
                  style={{
                    backgroundColor: site.surveyed
                      ? 'color-mix(in srgb, var(--navy) 60%, transparent)'
                      : 'color-mix(in srgb, var(--void) 70%, transparent)',
                    border: `1px solid ${
                      site.surveyed ? '#4ade80' : 'color-mix(in srgb, var(--steel) 25%, transparent)'
                    }`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.65rem',
                    fontSize: '0.6875rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: site.surveyed ? '#86efac' : 'var(--moon)' }}>
                      [{site.code}] {site.name}
                    </span>
                    <span style={{ color: site.surveyed ? '#4ade80' : 'var(--steel)' }}>
                      {site.surveyed ? 'ANALYZED' : 'UNVISITED'}
                    </span>
                  </div>
                  <div style={{ color: 'var(--steel)', fontSize: '0.625rem', marginTop: '0.2rem' }}>
                    {site.feature}
                  </div>
                  {site.surveyed && (
                    <div style={{ color: 'var(--astrophage)', fontSize: '0.625rem', marginTop: '0.3rem', fontStyle: 'italic' }}>
                      Discovery: {site.discoveryNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Real-Time Mission Console Output Log */}
          <div
            style={{
              backgroundColor: '#040711',
              border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem',
              fontSize: '0.6875rem',
              color: 'var(--moon)',
              lineHeight: 1.4,
            }}
          >
            <span style={{ color: 'var(--astrophage)', fontWeight: 700 }}>LOG TELEMETRY: </span>
            {scanLog}
          </div>

          {/* Mission Success Banner */}
          {completedMission && (
            <div
              style={{
                backgroundColor: 'color-mix(in srgb, #4ade80 15%, transparent)',
                border: '2px solid #4ade80',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-md)',
                textAlign: 'center',
                boxShadow: '0 0 20px rgba(74, 222, 128, 0.3)',
              }}
            >
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#86efac', marginBottom: '0.3rem' }}>
                [MISSION COMPLETE] CALLISTO SURFACE EXPLORATION SUCCESSFUL
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--moon)', margin: 0 }}>
                All 5 geological sectors surveyed. Subsurface ocean confirmed at 135 km depth. Data beamed to CIT ground control.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const telemetryPillStyle: React.CSSProperties = {
  backgroundColor: 'color-mix(in srgb, var(--void) 80%, black)',
  border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
  borderRadius: 'var(--radius-sm)',
  padding: '0.35rem 0.65rem',
  fontSize: '0.6875rem',
};

const dpadBtnStyle: React.CSSProperties = {
  width: '38px',
  height: '38px',
  backgroundColor: 'color-mix(in srgb, var(--navy) 75%, transparent)',
  border: '1px solid color-mix(in srgb, var(--steel) 40%, transparent)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--moon)',
  fontSize: '0.875rem',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.1s',
};

const tabBtnStyle = (active: boolean): React.CSSProperties => ({
  background: 'transparent',
  border: 'none',
  borderBottom: active ? '2px solid var(--orbit)' : '2px solid transparent',
  color: active ? 'var(--orbit)' : 'var(--steel)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6875rem',
  fontWeight: 700,
  padding: '0.4rem 0.6rem',
  cursor: 'pointer',
});

const barTrackStyle: React.CSSProperties = {
  height: '6px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '3px',
  overflow: 'hidden',
};

const barFillStyle: React.CSSProperties = {
  height: '100%',
  borderRadius: '3px',
  transition: 'width 0.4s ease',
};
