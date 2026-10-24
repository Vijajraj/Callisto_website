import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  playTelemetryBeep,
  playBeaconPing,
  playThrusterBurst,
  playWarpSurge,
} from '../../lib/audio';

/* =========================================================================
   CALLISTO ADVANCED SURFACE ROVER EXPEDITION // MISSION SIMULATION
   Complex multi-subsystem planetary exploration:
   - Power & Thermal Management (RTG, Battery, RHU Cryo-Heaters)
   - Terrain Traction, Wheel Slip & Geological Hazards (Penitentes, Crevasses)
   - Interactive Science Tools (LIBS Laser Spectrometer, GPR Ice Sounder, Cryo-Drill)
   - Jovian Radiation Spikes & Relativistic Orbital Comm Uplink
   ========================================================================= */

interface TerrainSector {
  id: number;
  name: string;
  code: string;
  x: number; // 0-100%
  y: number; // 0-100%
  hazardType: 'penitentes' | 'fissure' | 'steep_slope' | 'radiation_pocket' | 'safe';
  hazardLabel: string;
  icePurityPct: number;
  subsurfaceDepthKm: number;
  scienceTarget: {
    spectralKey: number; // 0-100 target wavelength
    drillTorqueReq: number; // 40-80 optimal RPM
    radarFreqMhz: number; // 15-60 optimal MHz
    sampleTitle: string;
    sampleLore: string;
  };
  surveyed: boolean;
}

const SECTORS: TerrainSector[] = [
  {
    id: 1,
    name: 'Valhalla Outer Multiring Basin',
    code: 'SECTOR-ALPHA',
    x: 20,
    y: 28,
    hazardType: 'steep_slope',
    hazardLabel: '28° Basalt Rim Incline (Slip Risk)',
    icePurityPct: 88,
    subsurfaceDepthKm: 146,
    scienceTarget: {
      spectralKey: 42,
      drillTorqueReq: 60,
      radarFreqMhz: 20,
      sampleTitle: 'Primordial Impact Glass & Water Ice',
      sampleLore: 'Crystalline ice laced with amorphous silicates from the 3.8-billion-year-old Valhalla impact.',
    },
    surveyed: false,
  },
  {
    id: 2,
    name: 'Catena Crater Chain Corridor',
    code: 'SECTOR-BETA',
    x: 78,
    y: 22,
    hazardType: 'fissure',
    hazardLabel: 'Deep Cryogenic Fissure Chasm',
    icePurityPct: 76,
    subsurfaceDepthKm: 140,
    scienceTarget: {
      spectralKey: 68,
      drillTorqueReq: 75,
      radarFreqMhz: 35,
      sampleTitle: 'Tidal Cometary Impact Core',
      sampleLore: 'Trapped carbon dioxide ices and volatile noble gases from a fragmented Jovian comet.',
    },
    surveyed: false,
  },
  {
    id: 3,
    name: 'Utgard Tectonic Fracture Ridge',
    code: 'SECTOR-GAMMA',
    x: 52,
    y: 58,
    hazardType: 'penitentes',
    hazardLabel: 'Sublimation Razor-Ice Spires',
    icePurityPct: 82,
    subsurfaceDepthKm: 132,
    scienceTarget: {
      spectralKey: 55,
      drillTorqueReq: 50,
      radarFreqMhz: 18,
      sampleTitle: 'Deep Crustal Brine Discontinuity',
      sampleLore: 'Strong dielectric echo verifying liquid conductive ocean layer at 132 km depth!',
    },
    surveyed: false,
  },
  {
    id: 4,
    name: 'Asgard Multi-Ring Seismic Uplift',
    code: 'SECTOR-DELTA',
    x: 82,
    y: 75,
    hazardType: 'radiation_pocket',
    hazardLabel: 'Jovian Plasma Sheet Magnetic Lobe',
    icePurityPct: 71,
    subsurfaceDepthKm: 154,
    scienceTarget: {
      spectralKey: 84,
      drillTorqueReq: 65,
      radarFreqMhz: 45,
      sampleTitle: 'Hydrated Magnesium Sulfate Regolith',
      sampleLore: 'Salts dissolved by hydrothermal leaching and deposited through crustal stress cracks.',
    },
    surveyed: false,
  },
  {
    id: 5,
    name: 'Tiamat Cryovolcanic Venting Dome',
    code: 'SECTOR-EPSILON',
    x: 22,
    y: 80,
    hazardType: 'fissure',
    hazardLabel: 'Sub-Zero Vapor Outgassing Vents',
    icePurityPct: 64,
    subsurfaceDepthKm: 124,
    scienceTarget: {
      spectralKey: 30,
      drillTorqueReq: 80,
      radarFreqMhz: 15,
      sampleTitle: 'Prebiotic Organic Tholin Complex',
      sampleLore: 'Complex carbon molecules synthesized by solar UV radiation interacting with methane ices.',
    },
    surveyed: false,
  },
];

export default function ExpeditionSimulator(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Tab View
  const [activeTab, setActiveTab] = useState<'nav' | 'power' | 'science' | 'uplink'>('nav');

  // Rover Position & Dynamics
  const [roverX, setRoverX] = useState<number>(50);
  const [roverY, setRoverY] = useState<number>(50);
  const [roverHeading, setRoverHeading] = useState<number>(0); // radians
  const [driveSpeed, setDriveSpeed] = useState<number>(0); // km/h
  const [driveMode, setDriveMode] = useState<'crawler' | 'standard' | 'overdrive'>('standard');
  const [odometerKm, setOdometerKm] = useState<number>(0);

  // Rover Subsystems Health & Resources (Static Baseline Telemetry)
  const [batteryPct, setBatteryPct] = useState<number>(100);
  const rtgWatts = 140; // Base RTG output
  const [coreTempK, setCoreTempK] = useState<number>(278); // Kelvin (~5°C nominal internal)
  const [heaterActive, setHeaterActive] = useState<boolean>(true);
  const [wheelIntegrity, setWheelIntegrity] = useState<number>(100); // 0-100%

  // Sectors & Missions
  const [sectors, setSectors] = useState<TerrainSector[]>(SECTORS);
  const [targetSector, setTargetSector] = useState<TerrainSector | null>(null);
  const [scienceDataBuffer, setScienceDataBuffer] = useState<number>(0); // MB of buffered data
  const [uplinkedDataMb, setUplinkedDataMb] = useState<number>(0);
  const solNumber = 1117; // Static mission Sol

  // Science Minigame Interactive Tools
  const [laserTuner, setLaserTuner] = useState<number>(50); // 0-100 slider
  const [drillRpm, setDrillRpm] = useState<number>(50); // 0-100 slider
  const [radarFreq, setRadarFreq] = useState<number>(25); // 10-60 MHz slider
  const [toolStatus, setToolStatus] = useState<string>('Select an instrument to calibrate for the target sector.');
  const [isDrilling, setIsDrilling] = useState<boolean>(false);
  const [isRadaring, setIsRadaring] = useState<boolean>(false);
  const [missionComplete, setMissionComplete] = useState<boolean>(false);

  // Steer & Move Rover
  const moveRover = useCallback(
    (dx: number, dy: number) => {
      if (!Number.isFinite(dx) || !Number.isFinite(dy)) return;
      if (batteryPct <= 10) {
        setToolStatus('[WARNING] Battery critically depleted! Switch to Low-Torque Crawler mode.');
        return;
      }

      // Drive mode speed multipliers
      const speedMult = driveMode === 'crawler' ? 0.5 : driveMode === 'overdrive' ? 1.6 : 1.0;
      const batteryDraw = driveMode === 'crawler' ? 0.2 : driveMode === 'overdrive' ? 0.8 : 0.4;

      setRoverX((prevX) => {
        const nextX = Math.max(6, Math.min(94, prevX + dx * speedMult));
        return parseFloat(nextX.toFixed(2));
      });

      setRoverY((prevY) => {
        const nextY = Math.max(6, Math.min(94, prevY + dy * speedMult));
        return parseFloat(nextY.toFixed(2));
      });

      const dist = Math.hypot(dx * speedMult, dy * speedMult);
      if (dist > 0.05) {
        setRoverHeading(Math.atan2(dy, dx));
        setDriveSpeed(parseFloat((dist * 3.8).toFixed(1)));
        setOdometerKm((o) => parseFloat((o + dist * 0.08).toFixed(2)));
        setBatteryPct((b) => Math.max(8, parseFloat((b - batteryDraw).toFixed(1))));

        // Wheel wear on rugged ice terrain
        if (driveMode === 'overdrive' && Math.random() < 0.25) {
          setWheelIntegrity((w) => Math.max(30, w - 1));
        }
      }

      // Reset speed after burst
      setTimeout(() => setDriveSpeed(0), 400);
    },
    [batteryPct, driveMode]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        moveRover(0, -3.2);
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        moveRover(0, 3.2);
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        moveRover(-3.2, 0);
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        moveRover(3.2, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveRover]);

  // Sector proximity check
  useEffect(() => {
    const PROXIMITY_PCT = 9.5;
    let closest: TerrainSector | null = null;
    let minDist = Infinity;

    sectors.forEach((sec) => {
      const d = Math.hypot(sec.x - roverX, sec.y - roverY);
      if (d < PROXIMITY_PCT && d < minDist) {
        minDist = d;
        closest = sec;
      }
    });

    setTargetSector(closest);
  }, [roverX, roverY, sectors]);

  // Canvas Radar Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Deep Space Basalt Regolith Background
    ctx.fillStyle = '#060913';
    ctx.fillRect(0, 0, w, h);

    // Geological Elevation Radar Contours
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.07)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 36) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Impact Basin Ring Ridges
    [80, 150, 220, 290, 360].forEach((r) => {
      ctx.strokeStyle = 'rgba(255, 184, 107, 0.1)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(w * 0.48, h * 0.54, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Draw Geological Sectors
    sectors.forEach((sec) => {
      const sx = (sec.x / 100) * w;
      const sy = (sec.y / 100) * h;

      // Hazard Zone Ring
      if (sec.hazardType !== 'safe') {
        ctx.beginPath();
        ctx.arc(sx, sy, 24, 0, Math.PI * 2);
        ctx.strokeStyle = sec.surveyed
          ? 'rgba(74, 222, 128, 0.3)'
          : sec.hazardType === 'radiation_pocket'
          ? 'rgba(239, 68, 68, 0.4)'
          : 'rgba(245, 158, 11, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Sector Core Beacon
      ctx.beginPath();
      ctx.arc(sx, sy, 7, 0, Math.PI * 2);
      ctx.fillStyle = sec.surveyed ? '#4ade80' : '#ffb86b';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Sector Label
      ctx.fillStyle = sec.surveyed ? '#86efac' : '#ffedd5';
      ctx.font = '700 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(sec.code, sx, sy - 13);
    });

    // Draw Rover Rig
    const rx = (roverX / 100) * w;
    const ry = (roverY / 100) * h;

    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(roverHeading);

    // Forward Sensor Scanning Cone
    const scanGrad = ctx.createRadialGradient(0, 0, 4, 45, 0, 60);
    scanGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
    scanGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
    ctx.fillStyle = scanGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 60, -0.4, 0.4);
    ctx.closePath();
    ctx.fill();

    // Rover Chassis Box
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-15, -11, 30, 22, 4);
    ctx.fill();
    ctx.stroke();

    // 6 Rocker-Bogie All-Terrain Wheels
    ctx.fillStyle = wheelIntegrity > 50 ? '#ffb86b' : '#ef4444';
    [-13, 0, 13].forEach((wx) => {
      ctx.fillRect(wx - 2.5, -14, 5, 3.5);
      ctx.fillRect(wx - 2.5, 11, 5, 3.5);
    });

    // Masthead Sensor Turret & Pointer
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(5, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(18, 0);
    ctx.stroke();

    ctx.restore();

    // Real-Time Telemetry HUD Overlay in Canvas
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`GRAV: 0.126g  //  SPEED: ${driveSpeed} km/h  //  TEMP: ${coreTempK}K`, 12, h - 12);
  }, [roverX, roverY, roverHeading, driveSpeed, sectors, wheelIntegrity, coreTempK]);

  // LIBS Laser Spectrometry Mini-Game
  const executeLaserScan = () => {
    if (!targetSector) {
      setToolStatus('Drive within range of a designated sector (Alpha-Epsilon) to fire spectrometer.');
      return;
    }
    const targetWl = targetSector.scienceTarget.spectralKey;
    const diff = Math.abs(laserTuner - targetWl);

    if (diff <= 8) {
      playBeaconPing(1400, 0.25);
      setToolStatus(`[SPECTRA MATCHED] Peak absorption lines resolved! ${targetSector.scienceTarget.sampleTitle}.`);
      setScienceDataBuffer((prev) => prev + 45);
    } else {
      playTelemetryBeep(450, 0.2);
      setToolStatus(`[SPECTRAL DRIFT] Tuned to ${laserTuner}nm. Target resonance is ${diff > 0 ? (laserTuner > targetWl ? 'lower' : 'higher') : 'exact'}. Align slider.`);
    }
  };

  // Cryogenic Percussive Core Drill Mini-Game
  const executeDrill = () => {
    if (!targetSector) {
      setToolStatus('No solid geological target in range. Position rover on sector bedrock.');
      return;
    }
    const targetRpm = targetSector.scienceTarget.drillTorqueReq;
    const diff = Math.abs(drillRpm - targetRpm);

    setIsDrilling(true);
    playThrusterBurst();

    setTimeout(() => {
      setIsDrilling(false);
      if (diff <= 10) {
        playBeaconPing(1200, 0.3);
        setToolStatus(`[CORE EXTRACTION SUCCESS] Retained pristine ice sample at ${targetSector.icePurityPct}% purity!`);
        setScienceDataBuffer((prev) => prev + 60);

        // Mark sector surveyed
        setSectors((prev) =>
          prev.map((s) => (s.id === targetSector.id ? { ...s, surveyed: true } : s))
        );
      } else {
        playTelemetryBeep(320, 0.25);
        setToolStatus(`[DRILL JAM] RPM deviation too high (${drillRpm} vs optimum ${targetRpm}). Frictional thermal sublimation detected. Recalibrate torque.`);
      }
    }, 1200);
  };

  // Ground-Penetrating Radar Sounding
  const executeRadar = () => {
    if (!targetSector) {
      setToolStatus('Drive over ice fracture or ridge to sound sub-surface strata.');
      return;
    }

    setIsRadaring(true);
    playTelemetryBeep(880, 0.3);

    setTimeout(() => {
      setIsRadaring(false);
      playBeaconPing(1550, 0.35);
      setToolStatus(`[GPR RADAR SOUNDING COMPLETE] Ice shell measured: ${targetSector.subsurfaceDepthKm} km. Conductive liquid ocean reflector verified!`);
      setScienceDataBuffer((prev) => prev + 50);

      setSectors((prev) =>
        prev.map((s) => (s.id === targetSector.id ? { ...s, surveyed: true } : s))
      );
    }, 1100);
  };

  // Earth Relativistic Comm Uplink
  const transmitDataToOrbit = () => {
    if (scienceDataBuffer <= 0) {
      setToolStatus('No new scientific telemetry in onboard buffer to uplink.');
      return;
    }

    playWarpSurge();
    setUplinkedDataMb((prev) => prev + scienceDataBuffer);
    setToolStatus(`[UPLINK VERIFIED] Transmitted ${scienceDataBuffer} MB of deep-space science data to Earth via CIT Ground Station!`);
    setScienceDataBuffer(0);

    // Check complete
    const remaining = sectors.filter((s) => !s.surveyed).length;
    if (remaining === 0) {
      setMissionComplete(true);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    if (!Number.isFinite(clickX) || !Number.isFinite(clickY)) return;

    moveRover((clickX - roverX) * 0.35, (clickY - roverY) * 0.35);
  };

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
      {/* Top Avionics Mission Control Bar */}
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
            CALLISTO SURFACE ROVER EXPEDITION // ACT IV DEEP-SPACE SIMULATION
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: '0.2rem 0 0 0', color: 'var(--moon)' }}>
            Valhalla Basin Autonomous Science Rig
          </h2>
        </div>

        {/* Telemetry Badges (Static Baseline) */}
        <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
          <div style={telemetryBadgeStyle}>
            <span style={{ color: 'var(--steel)' }}>SOL:</span> {solNumber}
          </div>
          <div style={telemetryBadgeStyle}>
            <span style={{ color: 'var(--steel)' }}>POWER:</span>{' '}
            <span style={{ color: '#4ade80' }}>{batteryPct}% RTG</span>
          </div>
          <div style={telemetryBadgeStyle}>
            <span style={{ color: 'var(--steel)' }}>TEMP:</span>{' '}
            <span style={{ color: '#38bdf8' }}>{coreTempK} K</span>
          </div>
          <div style={telemetryBadgeStyle}>
            <span style={{ color: 'var(--steel)' }}>WHEELS:</span> {wheelIntegrity}%
          </div>
          <div style={telemetryBadgeStyle}>
            <span style={{ color: 'var(--steel)' }}>BUFFER:</span> {scienceDataBuffer} MB
          </div>
        </div>
      </div>

      {/* Subsystem Navigation Tabs */}
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
          onClick={() => setActiveTab('nav')}
          style={tabStyle(activeTab === 'nav')}
        >
          1. SURFACE RADAR & CONTROLS
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('science')}
          style={tabStyle(activeTab === 'science')}
        >
          2. SCIENCE INSTRUMENT SUITE
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('power')}
          style={tabStyle(activeTab === 'power')}
        >
          3. POWER & THERMAL AVIONICS
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('uplink')}
          style={tabStyle(activeTab === 'uplink')}
        >
          4. RELAY UPLINK ({uplinkedDataMb} MB SENT)
        </button>
      </div>

      {/* Tab 1: Navigation Radar & Tactile Mobile D-Pad */}
      {activeTab === 'nav' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-lg)',
            alignItems: 'start',
          }}
        >
          {/* Radar Screen */}
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
                height={430}
                onClick={handleCanvasClick}
                style={{ width: '100%', height: 'auto', display: 'block', cursor: 'crosshair' }}
                title="Tap or click on terrain to steer rover"
              />

              {/* In-Range Sector Overlay */}
              {targetSector && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: `1px solid ${targetSector.surveyed ? '#4ade80' : 'var(--orbit)'}`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.5rem 0.8rem',
                    fontSize: '0.75rem',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div style={{ color: targetSector.surveyed ? '#4ade80' : 'var(--orbit)', fontWeight: 700 }}>
                    IN RANGE: {targetSector.name} ({targetSector.code})
                  </div>
                  <div style={{ color: '#f59e0b', fontSize: '0.6875rem' }}>
                    HAZARD: {targetSector.hazardLabel}
                  </div>
                  <div style={{ color: 'var(--steel)', fontSize: '0.625rem' }}>
                    ICE PURITY: {targetSector.icePurityPct}% // DEPTH: {targetSector.subsurfaceDepthKm} km
                  </div>
                </div>
              )}
            </div>

            {/* Tactile Mobile / Desktop Steering Console */}
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
              {/* Responsive D-Pad */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 40px)', gap: '4px' }}>
                <div />
                <button type="button" onClick={() => moveRover(0, -4.5)} style={dpadBtnStyle} title="Drive North">▲</button>
                <div />
                <button type="button" onClick={() => moveRover(-4.5, 0)} style={dpadBtnStyle} title="Drive West">◀</button>
                <button type="button" onClick={() => moveRover(0, 4.5)} style={dpadBtnStyle} title="Drive South">▼</button>
                <button type="button" onClick={() => moveRover(4.5, 0)} style={dpadBtnStyle} title="Drive East">▶</button>
              </div>

              {/* Drive Mode Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.625rem', color: 'var(--steel)' }}>TRACTION DRIVE GEAR</span>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  {(['crawler', 'standard', 'overdrive'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDriveMode(m)}
                      style={{
                        padding: '0.4rem 0.65rem',
                        backgroundColor:
                          driveMode === m
                            ? 'var(--orbit)'
                            : 'color-mix(in srgb, var(--navy) 60%, transparent)',
                        color: driveMode === m ? 'var(--void)' : 'var(--moon)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Science Trigger */}
              <button
                type="button"
                onClick={() => setActiveTab('science')}
                style={{
                  padding: '0.65rem 1.1rem',
                  backgroundColor: targetSector && !targetSector.surveyed ? 'var(--astrophage)' : 'color-mix(in srgb, var(--navy) 80%, transparent)',
                  color: 'var(--moon)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                🔬 DEPLOY SCIENCE SUITE →
              </button>
            </div>
          </div>

          {/* Geological Sector Manifest & Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--orbit)', fontWeight: 700 }}>
              EXPEDITION SECTORS // VALHALLA MULTI-RING MAP
            </div>

            {sectors.map((sec) => (
              <div
                key={sec.id}
                style={{
                  backgroundColor: sec.surveyed
                    ? 'color-mix(in srgb, var(--navy) 65%, transparent)'
                    : 'color-mix(in srgb, var(--void) 80%, transparent)',
                  border: `1px solid ${
                    sec.surveyed ? '#4ade80' : 'color-mix(in srgb, var(--steel) 30%, transparent)'
                  }`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.6875rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: sec.surveyed ? '#86efac' : 'var(--moon)' }}>
                    [{sec.code}] {sec.name}
                  </span>
                  <span style={{ color: sec.surveyed ? '#4ade80' : 'var(--steel)', fontWeight: 600 }}>
                    {sec.surveyed ? 'SURVEYED' : 'PENDING'}
                  </span>
                </div>
                <div style={{ color: 'var(--steel)', fontSize: '0.625rem', marginTop: '0.2rem' }}>
                  Hazard: <span style={{ color: '#f59e0b' }}>{sec.hazardLabel}</span>
                </div>
                <div style={{ color: 'var(--astrophage)', fontSize: '0.625rem', marginTop: '0.2rem' }}>
                  Target: {sec.scienceTarget.sampleTitle}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Science Instrument Minigames */}
      {activeTab === 'science' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-lg)',
          }}
        >
          {/* Tool 1: LIBS Laser Spectrometer */}
          <div style={toolCardStyle}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem' }}>
              1. LIBS LASER SPECTROMETER
            </div>
            <p style={{ fontSize: '0.6875rem', color: 'var(--steel)', margin: '0 0 0.8rem 0' }}>
              Tune the laser wavelength to vaporize regolith and match chemical emission lines.
            </p>

            <div style={{ marginBottom: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', marginBottom: '0.3rem' }}>
                <span>Laser Resonance Tuner</span>
                <span style={{ color: 'var(--orbit)' }}>{laserTuner} nm</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={laserTuner}
                onChange={(e) => setLaserTuner(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--orbit)' }}
              />
            </div>

            <button
              type="button"
              onClick={executeLaserScan}
              style={actionBtnStyle}
            >
              FIRE LASER SPECTROMETER
            </button>
          </div>

          {/* Tool 2: Percussive Cryo-Drill */}
          <div style={toolCardStyle}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffb86b', marginBottom: '0.4rem' }}>
              2. ROTARY PERCUSSION CRYO-DRILL
            </div>
            <p style={{ fontSize: '0.6875rem', color: 'var(--steel)', margin: '0 0 0.8rem 0' }}>
              Calibrate RPM torque against 150K ice hardness to extract core samples without thermal sublimation.
            </p>

            <div style={{ marginBottom: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', marginBottom: '0.3rem' }}>
                <span>Drill Torque RPM</span>
                <span style={{ color: 'var(--astrophage)' }}>{drillRpm} RPM</span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                value={drillRpm}
                onChange={(e) => setDrillRpm(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--astrophage)' }}
              />
            </div>

            <button
              type="button"
              onClick={executeDrill}
              disabled={isDrilling}
              style={actionBtnStyle}
            >
              {isDrilling ? 'DRILLING CORING ICE...' : 'COMMENCE CRYO DRILLING'}
            </button>
          </div>

          {/* Tool 3: Ground-Penetrating Radar (GPR) */}
          <div style={toolCardStyle}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4ade80', marginBottom: '0.4rem' }}>
              3. GROUND-PENETRATING RADAR (GPR)
            </div>
            <p style={{ fontSize: '0.6875rem', color: 'var(--steel)', margin: '0 0 0.8rem 0' }}>
              Pulse high-frequency electromagnetic radar through the 140 km cryogenic ice crust to echo the ocean.
            </p>

            <div style={{ marginBottom: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', marginBottom: '0.3rem' }}>
                <span>Radar Sounding Frequency</span>
                <span style={{ color: '#4ade80' }}>{radarFreq} MHz</span>
              </div>
              <input
                type="range"
                min="15"
                max="55"
                value={radarFreq}
                onChange={(e) => setRadarFreq(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#4ade80' }}
              />
            </div>

            <button
              type="button"
              onClick={executeRadar}
              disabled={isRadaring}
              style={actionBtnStyle}
            >
              {isRadaring ? 'PULSING RADAR WAVE...' : 'FIRE GPR ICE SOUNDER'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Power & Thermal Avionics */}
      {activeTab === 'power' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-md)',
          }}
        >
          {/* RTG & Battery Grid */}
          <div style={toolCardStyle}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--orbit)', marginBottom: '0.5rem' }}>
              ELECTRICAL POWER DISTRIBUTION
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--steel)', lineHeight: 1.5 }}>
              <div>• Power Source: Plutonium-238 MMRTG (Radioisotope Generator)</div>
              <div>• Steady RTG Power Output: {rtgWatts} W continuous</div>
              <div>• Lithium-Ion Main Storage: {batteryPct}%</div>
              <div>• Current Draw Rate: {heaterActive ? '185 W' : '95 W'}</div>
            </div>

            <div style={{ marginTop: '0.8rem' }}>
              <div style={barTrackStyle}>
                <div style={{ ...barFillStyle, width: `${batteryPct}%`, backgroundColor: batteryPct > 35 ? '#4ade80' : '#f87171' }} />
              </div>
            </div>
          </div>

          {/* Cryo Thermal Loop */}
          <div style={toolCardStyle}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.5rem' }}>
              THERMAL REGULATION // RHU HEATERS
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--steel)', lineHeight: 1.5, marginBottom: '0.8rem' }}>
              <div>• Callisto Surface Ambient: 120 K (-153°C)</div>
              <div>• Internal Core Avionics Temp: {coreTempK} K (Nominal: 278 K)</div>
              <div>• RHU Cryo-Heater Status: <span style={{ color: heaterActive ? '#4ade80' : '#f87171' }}>{heaterActive ? 'ACTIVE' : 'OFF'}</span></div>
            </div>

            <button
              type="button"
              onClick={() => setHeaterActive(!heaterActive)}
              style={actionBtnStyle}
            >
              {heaterActive ? 'DISABLE HEATERS (SAVE BATTERY)' : 'ENGAGE RHU CRYO HEATERS'}
            </button>
          </div>

          {/* Mechanical Wheel Health */}
          <div style={toolCardStyle}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ec4899', marginBottom: '0.5rem' }}>
              MOBILITY CHASSIS // WHEEL STATUS
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--steel)', lineHeight: 1.5 }}>
              <div>• Wheel Drive Mechanism: 6-Wheel Rocker Bogie</div>
              <div>• Titanium Grouser Tread Wear: {wheelIntegrity}%</div>
              <div>• Drive Gear Mode: <span style={{ textTransform: 'uppercase', color: 'var(--orbit)' }}>{driveMode}</span></div>
              <div>• Surface Odometer: {odometerKm} km traversed</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Earth Relativistic Comm Uplink */}
      {activeTab === 'uplink' && (
        <div style={toolCardStyle}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--astrophage)', marginBottom: '0.5rem' }}>
            JOVIAN POLAR ORBITER RELAY // EARTH DSN UPLINK
          </div>
          <p style={{ fontSize: '0.6875rem', color: 'var(--steel)', lineHeight: 1.4, margin: '0 0 0.8rem 0' }}>
            Scientific datasets collected on Callisto must be transmitted during orbital satellite alignment passes.
            Speed-of-light radio delay to Earth CIT ground control: <strong>41.8 minutes</strong>.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)', marginBottom: '1rem' }}>
            <div style={{ backgroundColor: '#040711', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.625rem', color: 'var(--steel)' }}>ORBITER RELAY STATUS</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4ade80' }}>
                READY // SATELLITE LOCKED
              </div>
            </div>

            <div style={{ backgroundColor: '#040711', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.625rem', color: 'var(--steel)' }}>BUFFERED TELEMETRY</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--orbit)' }}>
                {scienceDataBuffer} MB READY
              </div>
            </div>

            <div style={{ backgroundColor: '#040711', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.625rem', color: 'var(--steel)' }}>TOTAL TRANSMITTED</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#86efac' }}>
                {uplinkedDataMb} MB SENT
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={transmitDataToOrbit}
            disabled={scienceDataBuffer <= 0}
            style={{
              ...actionBtnStyle,
              backgroundColor: scienceDataBuffer > 0 ? '#4ade80' : 'color-mix(in srgb, var(--navy) 60%, transparent)',
              color: scienceDataBuffer > 0 ? 'var(--void)' : 'var(--steel)',
              cursor: scienceDataBuffer > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            TRANSMIT BUFFER TO JOVIAN ORBITER
          </button>
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
        <span style={{ color: 'var(--astrophage)', fontWeight: 700 }}>TELEMETRY STATUS: </span>
        {toolStatus}
      </div>

      {/* Mission Victory Banner */}
      {missionComplete && (
        <div
          style={{
            marginTop: 'var(--space-md)',
            backgroundColor: 'color-mix(in srgb, #4ade80 18%, transparent)',
            border: '2px solid #4ade80',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            textAlign: 'center',
            boxShadow: '0 0 24px rgba(74, 222, 128, 0.35)',
          }}
        >
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#86efac', marginBottom: '0.3rem' }}>
            [MISSION CERTIFIED] CALLISTO SURFACE EXPLORATION TRIUMPH
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--moon)', margin: 0 }}>
            All 5 sectors mapped. Saline subsurface ocean confirmed at 132 km. High-frequency GPR & LIBS datasets transmitted to Earth.
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

const dpadBtnStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
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

const toolCardStyle: React.CSSProperties = {
  backgroundColor: 'color-mix(in srgb, var(--void) 80%, black)',
  border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
  borderRadius: 'var(--radius-md)',
  padding: 'var(--space-md)',
};

const actionBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem',
  backgroundColor: 'var(--orbit)',
  color: 'var(--void)',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.75rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s',
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

const barTrackStyle: React.CSSProperties = {
  height: '8px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '4px',
  overflow: 'hidden',
};

const barFillStyle: React.CSSProperties = {
  height: '100%',
  borderRadius: '4px',
  transition: 'width 0.3s ease',
};
