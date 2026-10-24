import React, { useState, useEffect, useRef, useCallback } from 'react';

/* =========================================================================
   3D LIDAR POINT-CLOUD & TERRAIN RADAR FLYOVER
   Callisto Orbital Survey Platform // Valhalla Multi-Ring Basin
   Real-time 3D perspective terrain rendering, multi-spectral band visualization,
   radar sweep pulses, and geological waypoint tracking.
   ========================================================================= */

type SensorBand = 'LIDAR' | 'SUBSURFACE' | 'THERMAL' | 'SAR';

interface Waypoint {
  id: string;
  name: string;
  gridX: number; // -1 to 1
  gridY: number; // -1 to 1
  elevationM: number;
  description: string;
  classification: string;
  hazardRating: 'LOW' | 'MODERATE' | 'SEVERE';
}

const CALLISTO_WAYPOINTS: Waypoint[] = [
  {
    id: 'valhalla_center',
    name: 'Valhalla Basin Ground Zero',
    gridX: 0.0,
    gridY: 0.0,
    elevationM: -1820,
    description: 'Central bright impact palimpsest (~360 km diameter) formed by ancient hypervelocity asteroidal impact into ice shell.',
    classification: 'Class I Impact Palimpsest',
    hazardRating: 'LOW',
  },
  {
    id: 'concentric_ridge_alpha',
    name: 'Valhalla Outer Ridge Escarpment',
    gridX: 0.45,
    gridY: -0.35,
    elevationM: 2150,
    description: 'Concentric extensional normal fault scarp towering over frozen cryo-slopes with active mass wasting.',
    classification: 'Extensional Fault Scarp',
    hazardRating: 'MODERATE',
  },
  {
    id: 'tornarsuk_catena',
    name: 'Tornarsuk Secondary Crater Chain',
    gridX: -0.55,
    gridY: 0.40,
    elevationM: -640,
    description: 'Linear catena created by fragmented comet train impacts, exposing fresh icy bedrock below dark regolith blanket.',
    classification: 'Cometary Crater Catena',
    hazardRating: 'MODERATE',
  },
  {
    id: 'outpost_alpha_site',
    name: 'Candidate Outpost Alpha Touchdown Zone',
    gridX: 0.28,
    gridY: 0.52,
    elevationM: 140,
    description: 'Ultra-flat dielectric plains shielded by concentric crater walls with stable sub-surface ice and low boulder roughness.',
    classification: 'Smooth Cryo-Regolith Plain',
    hazardRating: 'LOW',
  },
  {
    id: 'dielectric_anomaly',
    name: 'Basal Dielectric Permittivity Anomaly',
    gridX: -0.32,
    gridY: -0.48,
    elevationM: -1450,
    description: 'High-attenuation radar sounding anomaly indicating liquid saline brines or methane clathrates 15 km beneath the fractured ice.',
    classification: 'Sub-Surface Ocean Interface',
    hazardRating: 'SEVERE',
  },
];

export default function ExpeditionSimulator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sensor & Viewport States
  const [activeBand, setActiveBand] = useState<SensorBand>('LIDAR');
  const [isFlyoverActive, setIsFlyoverActive] = useState<boolean>(true);
  const [elevationScale, setElevationScale] = useState<number>(1.8);
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint>(CALLISTO_WAYPOINTS[0]);
  const [wireframeMeshEnabled, setWireframeMeshEnabled] = useState<boolean>(true);
  const [pointCloudDensity, setPointCloudDensity] = useState<'STANDARD' | 'HIGH' | 'ULTRA'>('HIGH');
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Camera 3D Angles
  const cameraRef = useRef({
    yaw: 0.75, // Horizontal orbit angle (radians)
    pitch: 0.62, // Vertical tilt angle (radians)
    zoom: 1.05,
    panX: 0,
    panY: 0,
    flyoverProgress: 0,
  });

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const sweepOffsetRef = useRef(0);

  // Resolution Grid Size
  const gridDim = pointCloudDensity === 'STANDARD' ? 36 : pointCloudDensity === 'HIGH' ? 48 : 60;

  // Elevation Math Function for Callisto's Valhalla Multi-Ring System
  const getElevation = useCallback(
    (x: number, y: number, exag: number) => {
      const r = Math.sqrt(x * x + y * y);
      // Central impact basin depression
      const centralBasin = -Math.exp(-r * r * 8.0) * 1.6;
      // Concentric multi-ring ridges (damped cosine waves around center)
      const concentricRings = Math.cos(r * 18.0) * Math.exp(-r * 1.6) * 0.45;
      // Secondary craters and catena fractures
      const cr1 = Math.exp(-((x - 0.4) ** 2 + (y + 0.3) ** 2) * 32.0) * 0.6;
      const cr2 = -Math.exp(-((x + 0.45) ** 2 + (y - 0.35) ** 2) * 24.0) * 0.7;
      const microRoughness = Math.sin(x * 32.0) * Math.cos(y * 32.0) * 0.08;

      return (centralBasin + concentricRings + cr1 + cr2 + microRoughness) * exag;
    },
    []
  );

  // --- 3D Projection Canvas Render Loop ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Deep space background with subtle grid lines
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      // Subtle background orbital grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const bgStep = 40;
      for (let x = 0; x < width; x += bgStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += bgStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Flyover auto-rotation
      if (isFlyoverActive && !isDraggingRef.current) {
        cameraRef.current.yaw += 0.0035;
        cameraRef.current.flyoverProgress = (cameraRef.current.flyoverProgress + 0.002) % (Math.PI * 2);
      }

      // Radar sweep wave progress
      sweepOffsetRef.current = (sweepOffsetRef.current + 0.012) % 2.0;
      const currentSweepWave = sweepOffsetRef.current - 1.0; // -1 to 1

      const yaw = cameraRef.current.yaw;
      const pitch = cameraRef.current.pitch;
      const zoom = cameraRef.current.zoom;
      const cosYaw = Math.cos(yaw);
      const sinYaw = Math.sin(yaw);
      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);

      const fovDistance = 3.2;
      const baseScale = Math.min(width, height) * 0.58 * zoom;
      const centerX = width * 0.5 + cameraRef.current.panX;
      const centerY = height * 0.52 + cameraRef.current.panY;

      // Generate & Project 3D Grid Points
      const projectedGrid: Array<Array<{ sx: number; sy: number; sz: number; elev: number; rawX: number; rawY: number }>> = [];

      for (let i = 0; i <= gridDim; i++) {
        projectedGrid[i] = [];
        const gy = (i / gridDim) * 2 - 1; // -1 to 1

        for (let j = 0; j <= gridDim; j++) {
          const gx = (j / gridDim) * 2 - 1; // -1 to 1
          const elev = getElevation(gx, gy, elevationScale);

          // 3D Rotate around Y axis (yaw)
          const rx1 = gx * cosYaw - gy * sinYaw;
          const ry1 = gx * sinYaw + gy * cosYaw;
          const rz1 = -elev;

          // 3D Rotate around X axis (pitch)
          const rx2 = rx1;
          const ry2 = ry1 * cosPitch - rz1 * sinPitch;
          const rz2 = ry1 * sinPitch + rz1 * cosPitch;

          // Perspective transformation
          const depth = fovDistance + rz2;
          const pFactor = depth > 0.1 ? fovDistance / depth : 0.1;
          const sx = centerX + rx2 * baseScale * pFactor;
          const sy = centerY + ry2 * baseScale * pFactor;

          projectedGrid[i][j] = { sx, sy, sz: rz2, elev, rawX: gx, rawY: gy };
        }
      }

      // Render Wireframe Mesh Lines if enabled
      if (wireframeMeshEnabled) {
        ctx.lineWidth = 1;

        // Draw horizontal mesh rows
        for (let i = 0; i <= gridDim; i++) {
          ctx.beginPath();
          let started = false;
          for (let j = 0; j <= gridDim; j++) {
            const p = projectedGrid[i][j];
            if (!started) {
              ctx.moveTo(p.sx, p.sy);
              started = true;
            } else {
              ctx.lineTo(p.sx, p.sy);
            }
          }
          const alpha = 0.14 + (i / gridDim) * 0.12;
          ctx.strokeStyle =
            activeBand === 'LIDAR'
              ? `rgba(56, 189, 248, ${alpha})`
              : activeBand === 'SUBSURFACE'
              ? `rgba(168, 85, 247, ${alpha})`
              : activeBand === 'THERMAL'
              ? `rgba(244, 63, 94, ${alpha})`
              : `rgba(34, 197, 94, ${alpha})`;
          ctx.stroke();
        }

        // Draw vertical mesh columns
        for (let j = 0; j <= gridDim; j++) {
          ctx.beginPath();
          let started = false;
          for (let i = 0; i <= gridDim; i++) {
            const p = projectedGrid[i][j];
            if (!started) {
              ctx.moveTo(p.sx, p.sy);
              started = true;
            } else {
              ctx.lineTo(p.sx, p.sy);
            }
          }
          const alpha = 0.14 + (j / gridDim) * 0.12;
          ctx.strokeStyle =
            activeBand === 'LIDAR'
              ? `rgba(56, 189, 248, ${alpha})`
              : activeBand === 'SUBSURFACE'
              ? `rgba(168, 85, 247, ${alpha})`
              : activeBand === 'THERMAL'
              ? `rgba(244, 63, 94, ${alpha})`
              : `rgba(34, 197, 94, ${alpha})`;
          ctx.stroke();
        }
      }

      // Render Glowing Point-Cloud Voxel Points
      for (let i = 0; i <= gridDim; i++) {
        for (let j = 0; j <= gridDim; j++) {
          const p = projectedGrid[i][j];
          const normElev = (p.elev / elevationScale + 1.6) / 3.2; // 0 to 1

          // Calculate distance to radar sweep plane
          const sweepDist = Math.abs(p.rawX - currentSweepWave);
          const isSweeping = sweepDist < 0.14;

          let ptColor = '#38bdf8';
          let ptRadius = 1.4;

          if (activeBand === 'LIDAR') {
            // Cyan-to-Emerald Topographic Gradient
            if (normElev > 0.72) ptColor = '#f8fafc'; // snow/frost peaks
            else if (normElev > 0.55) ptColor = '#38bdf8'; // elevated crater rims
            else if (normElev > 0.38) ptColor = '#2dd4bf'; // mid plain
            else ptColor = '#0284c7'; // deep depression
          } else if (activeBand === 'SUBSURFACE') {
            // Subsurface Radar: Purple to Hot Gold Dielectric
            if (normElev > 0.65) ptColor = '#fbbf24';
            else if (normElev > 0.40) ptColor = '#c084fc';
            else ptColor = '#4c1d95';
          } else if (activeBand === 'THERMAL') {
            // Thermal IR: Deep Indigo (110 K) to Magenta & White (165 K)
            if (normElev > 0.68) ptColor = '#f43f5e';
            else if (normElev > 0.45) ptColor = '#e11d48';
            else ptColor = '#4338ca';
          } else {
            // SAR: High-Contrast Green Phosphor Radar
            ptColor = normElev > 0.5 ? '#4ade80' : '#15803d';
          }

          if (isSweeping) {
            ptColor = '#ffffff';
            ptRadius = 2.8;
          }

          ctx.beginPath();
          ctx.arc(p.sx, p.sy, ptRadius, 0, Math.PI * 2);
          ctx.fillStyle = ptColor;
          ctx.fill();
        }
      }

      // Draw Animated Radar Sweep Beam Curtain
      const sweepX1 = currentSweepWave;
      const sweepPts: Array<{ sx: number; sy: number }> = [];
      for (let i = 0; i <= gridDim; i += 4) {
        const gy = (i / gridDim) * 2 - 1;
        const elev = getElevation(sweepX1, gy, elevationScale);
        const rx1 = sweepX1 * cosYaw - gy * sinYaw;
        const ry1 = sweepX1 * sinYaw + gy * cosYaw;
        const rz1 = -elev;
        const rx2 = rx1;
        const ry2 = ry1 * cosPitch - rz1 * sinPitch;
        const rz2 = ry1 * sinPitch + rz1 * cosPitch;
        const depth = fovDistance + rz2;
        const pFactor = depth > 0.1 ? fovDistance / depth : 0.1;
        sweepPts.push({
          sx: centerX + rx2 * baseScale * pFactor,
          sy: centerY + ry2 * baseScale * pFactor,
        });
      }

      if (sweepPts.length > 1) {
        ctx.beginPath();
        ctx.moveTo(sweepPts[0].sx, sweepPts[0].sy);
        for (let k = 1; k < sweepPts.length; k++) {
          ctx.lineTo(sweepPts[k].sx, sweepPts[k].sy);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Render 3D Geological Waypoints & Floating Reticles
      CALLISTO_WAYPOINTS.forEach((wp) => {
        const elev = getElevation(wp.gridX, wp.gridY, elevationScale);
        const rx1 = wp.gridX * cosYaw - wp.gridY * sinYaw;
        const ry1 = wp.gridX * sinYaw + wp.gridY * cosYaw;
        const rz1 = -elev;

        const rx2 = rx1;
        const ry2 = ry1 * cosPitch - rz1 * sinPitch;
        const rz2 = ry1 * sinPitch + rz1 * cosPitch;

        const depth = fovDistance + rz2;
        const pFactor = depth > 0.1 ? fovDistance / depth : 0.1;
        const px = centerX + rx2 * baseScale * pFactor;
        const py = centerY + ry2 * baseScale * pFactor;

        const isTarget = selectedWaypoint.id === wp.id;
        const pinColor = isTarget ? '#38bdf8' : 'rgba(248, 250, 252, 0.75)';

        // Vertical holographic tether
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px, py - 32);
        ctx.strokeStyle = pinColor;
        ctx.lineWidth = isTarget ? 2 : 1;
        ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Waypoint beacon diamond
        ctx.beginPath();
        ctx.moveTo(px, py - 38);
        ctx.lineTo(px + 6, py - 32);
        ctx.lineTo(px, py - 26);
        ctx.lineTo(px - 6, py - 32);
        ctx.closePath();
        ctx.fillStyle = isTarget ? '#38bdf8' : 'rgba(15, 23, 42, 0.85)';
        ctx.fill();
        ctx.strokeStyle = pinColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (isTarget) {
          // Radar lock-on brackets
          ctx.beginPath();
          ctx.arc(px, py - 32, 12, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Waypoint HUD label tag
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1;
          const tagW = 140;
          const tagH = 26;
          const tagX = px + 12;
          const tagY = py - 45;
          ctx.fillRect(tagX, tagY, tagW, tagH);
          ctx.strokeRect(tagX, tagY, tagW, tagH);

          ctx.fillStyle = '#38bdf8';
          ctx.font = '700 9px ui-monospace, SFMono-Regular, monospace';
          ctx.textAlign = 'left';
          ctx.fillText(`LOC: ${wp.elevationM > 0 ? '+' : ''}${wp.elevationM}m`, tagX + 8, tagY + 11);
          ctx.fillStyle = '#ffffff';
          ctx.font = '600 10px system-ui, sans-serif';
          ctx.fillText(wp.name.slice(0, 18), tagX + 8, tagY + 22);
        }
      });

      // Compass & Sensor Reticle Overlay (Bottom Right)
      const compassX = width - 55;
      const compassY = height - 55;
      ctx.beginPath();
      ctx.arc(compassX, compassY, 28, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Heading needle
      const needleX = compassX + Math.sin(yaw) * 20;
      const needleY = compassY - Math.cos(yaw) * 20;
      ctx.beginPath();
      ctx.moveTo(compassX, compassY);
      ctx.lineTo(needleX, needleY);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = '700 8px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('N', needleX, needleY - 4);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeBand, isFlyoverActive, elevationScale, selectedWaypoint, wireframeMeshEnabled, pointCloudDensity, getElevation]);

  // Touch and Mouse Controls for 3D Camera Rotation
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    cameraRef.current.yaw += dx * 0.007;
    cameraRef.current.pitch = Math.max(0.15, Math.min(1.45, cameraRef.current.pitch + dy * 0.006));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    cameraRef.current.yaw += dx * 0.008;
    cameraRef.current.pitch = Math.max(0.15, Math.min(1.45, cameraRef.current.pitch + dy * 0.007));
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Reset Camera View
  const handleResetCamera = () => {
    cameraRef.current.yaw = 0.75;
    cameraRef.current.pitch = 0.62;
    cameraRef.current.zoom = 1.05;
    cameraRef.current.panX = 0;
    cameraRef.current.panY = 0;
  };

  // Focus on Selected Waypoint
  const handleSelectWaypoint = (wp: Waypoint) => {
    setSelectedWaypoint(wp);
    // Smooth angle transition towards waypoint
    const targetYaw = Math.atan2(wp.gridX, wp.gridY) + Math.PI * 0.5;
    cameraRef.current.yaw = targetYaw;
    cameraRef.current.pitch = 0.55;
  };

  return (
    <div className="lidar-cockpit">
      {/* Platform Header */}
      <div className="cockpit-header">
        <div className="header-left">
          <div className="tag-row">
            <span className="platform-badge">CALLISTO ORBITAL SURVEYOR // 3D LIDAR ALTIMETRY</span>
            <span className="orbit-badge">ALT: 150.0 KM • INCLINATION: 88.4° POLAR</span>
          </div>
          <h2 className="deck-title">3D LIDAR Point-Cloud & Terrain Radar Flyover</h2>
          <p className="deck-subtitle">
            Pulsed Nd:YAG laser altimeter and synthetic aperture radar mapping of Callisto’s Valhalla impact multi-ring system.
          </p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className={`action-btn flyover-btn ${isFlyoverActive ? 'active' : ''}`}
            onClick={() => setIsFlyoverActive(!isFlyoverActive)}
            title="Toggle autonomous orbital flyover camera"
          >
            <span className="btn-icon">{isFlyoverActive ? '⏸' : '▶'}</span>
            <span>{isFlyoverActive ? 'PAUSE FLYOVER' : 'AUTO FLYOVER'}</span>
          </button>
          <button
            type="button"
            className="action-btn report-btn"
            onClick={() => setReportModalOpen(true)}
            title="View geological topographic report"
          >
            <span className="btn-icon">📑</span>
            <span>MISSION BRIEFING</span>
          </button>
        </div>
      </div>

      {/* Static Telemetry Badges (CLEAN STATIC READOUTS) */}
      <div className="telemetry-bar" aria-label="Static Radar Telemetry">
        <div className="telemetry-card">
          <span className="card-label">SENSOR PAYLOAD</span>
          <span className="card-value">
            {activeBand === 'LIDAR'
              ? 'LIDAR 1064nm'
              : activeBand === 'SUBSURFACE'
              ? 'RADAR 15MHz'
              : activeBand === 'THERMAL'
              ? 'THERMAL IR'
              : 'SAR 1.2GHz'}
          </span>
          <span className="card-subtext">Spatial Resolution: 0.85 m/pixel</span>
        </div>

        <div className="telemetry-card">
          <span className="card-label">ORBITAL TARGET</span>
          <span className="card-value">VALHALLA BASIN</span>
          <span className="card-subtext">Coordinates: 15.9°N, 55.6°W</span>
        </div>

        <div className="telemetry-card">
          <span className="card-label">RELIEF RANGE</span>
          <span className="card-value">-1,820 m to +2,150 m</span>
          <span className="card-subtext">Vertical Exaggeration: {elevationScale.toFixed(1)}x</span>
        </div>

        <div className="telemetry-card">
          <span className="card-label">ACTIVE RADAR WAYPOINT</span>
          <span className="card-value">{selectedWaypoint.name.slice(0, 16)}</span>
          <span className="card-subtext">Elev: {selectedWaypoint.elevationM > 0 ? '+' : ''}{selectedWaypoint.elevationM} m</span>
        </div>

        <div className="telemetry-card">
          <span className="card-label">SURFACE REGOLITH</span>
          <span className="card-value">H₂O ICE + SILICATE</span>
          <span className="card-subtext">Dielectric Permittivity: ε = 3.1</span>
        </div>
      </div>

      {/* Main 3D Viewport Workspace */}
      <div className="deck-workspace">
        <div className="viewport-col">
          <div className="canvas-container">
            <canvas
              ref={canvasRef}
              width={860}
              height={500}
              className="lidar-canvas"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />

            {/* Overlaid Interactive Controls within Canvas HUD */}
            <div className="canvas-hud-overlay">
              <div className="hud-band-picker">
                {(
                  [
                    { id: 'LIDAR', label: 'LIDAR TOPOGRAPHY' },
                    { id: 'SUBSURFACE', label: 'SUBSURFACE RADAR' },
                    { id: 'THERMAL', label: 'THERMAL INFRARED' },
                    { id: 'SAR', label: 'SAR WIREFRAME' },
                  ] as const
                ).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className={`hud-band-btn ${activeBand === b.id ? 'active' : ''}`}
                    onClick={() => setActiveBand(b.id)}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              <div className="hud-floating-tools">
                <button
                  type="button"
                  className="hud-tool-btn"
                  onClick={handleResetCamera}
                  title="Reset 3D camera angles"
                >
                  RESET VIEW
                </button>
                <button
                  type="button"
                  className={`hud-tool-btn ${wireframeMeshEnabled ? 'active' : ''}`}
                  onClick={() => setWireframeMeshEnabled(!wireframeMeshEnabled)}
                  title="Toggle topographic mesh wireframe lines"
                >
                  MESH: {wireframeMeshEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Bottom Gradient Scale Legend */}
            <div className="spectrum-legend">
              <span className="legend-title">SPECTRAL BAND ELEVATION SPECTRUM</span>
              <div className="gradient-bar-wrapper">
                <span className="legend-bound">-1,850 m (Depression)</span>
                <div className={`gradient-fill band-${activeBand.toLowerCase()}`}></div>
                <span className="legend-bound">+2,320 m (Crater Rim)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Geological Waypoint & Flight Deck Side Panel */}
        <div className="sidebar-col">
          <div className="sidebar-card">
            <span className="sidebar-category">TARGETED GEOLOGICAL SITES</span>
            <h3 className="sidebar-title">Surface Radar Waypoints</h3>

            <div className="waypoint-list">
              {CALLISTO_WAYPOINTS.map((wp) => {
                const isSelected = selectedWaypoint.id === wp.id;
                return (
                  <div
                    key={wp.id}
                    className={`waypoint-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectWaypoint(wp)}
                  >
                    <div className="wp-header">
                      <span className="wp-name">{wp.name}</span>
                      <span className={`wp-hazard hazard-${wp.hazardRating.toLowerCase()}`}>
                        {wp.hazardRating}
                      </span>
                    </div>
                    <div className="wp-meta">
                      <span>Elev: {wp.elevationM > 0 ? '+' : ''}{wp.elevationM} m</span>
                      <span>{wp.classification}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Target Deep Telemetry Card */}
          <div className="sidebar-card target-detail-card">
            <span className="sidebar-category">SELECTED TARGET PROFILE</span>
            <h4 className="detail-name">{selectedWaypoint.name}</h4>
            <p className="detail-desc">{selectedWaypoint.description}</p>

            <div className="detail-stat-grid">
              <div className="stat-cell">
                <span className="stat-label">GEOLOGIC UNIT</span>
                <span className="stat-val">{selectedWaypoint.classification}</span>
              </div>
              <div className="stat-cell">
                <span className="stat-label">ELEVATION</span>
                <span className="stat-val">{selectedWaypoint.elevationM > 0 ? '+' : ''}{selectedWaypoint.elevationM} m</span>
              </div>
              <div className="stat-cell">
                <span className="stat-label">TOUCHDOWN HAZARD</span>
                <span className="stat-val">{selectedWaypoint.hazardRating}</span>
              </div>
              <div className="stat-cell">
                <span className="stat-label">SLOPE STABILITY</span>
                <span className="stat-val">Stable (&lt; 6.5°)</span>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="control-slider-box">
              <div className="slider-label-row">
                <span>Relief Exaggeration</span>
                <span>{elevationScale.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.1"
                value={elevationScale}
                onChange={(e) => setElevationScale(Number(e.target.value))}
                className="terrain-slider"
              />
            </div>

            <div className="control-slider-box">
              <div className="slider-label-row">
                <span>Point Cloud Density</span>
                <span>{pointCloudDensity}</span>
              </div>
              <div className="density-toggle-group">
                {(['STANDARD', 'HIGH', 'ULTRA'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`density-btn ${pointCloudDensity === d ? 'active' : ''}`}
                    onClick={() => setPointCloudDensity(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Briefing Modal */}
      {reportModalOpen && (
        <div className="modal-overlay" onClick={() => setReportModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-tag">EXPEDITION TECHNICAL ARCHIVE // GEOLOGICAL SURVEY</div>
              <h3 className="modal-title">Valhalla Basin LIDAR & Radar Altimetry</h3>
            </div>
            <div className="modal-content">
              <h4>1. The Multi-Ring Architecture of Valhalla</h4>
              <p>
                Valhalla is the largest multi-ring impact structure in the entire Solar System, spanning
                approximately $3,800\text{ km}$ across Callisto’s crust. Its concentric fault scarps formed
                as the shockwave of a titanic ancient impact shattered the brittle frozen crust over a warmer,
                ductile ice-slush asthenosphere.
              </p>
              <h4>2. Multi-Spectral Orbital Sounding</h4>
              <p>
                - <strong>LIDAR (1064 nm):</strong> Emits nanosecond laser pulses to register sub-meter surface
                elevation and crater depth geometries.
                <br />
                - <strong>Sub-Surface Radar (15 MHz):</strong> Penetrates through dark cryo-regolith to bounce off
                dielectric transitions, mapping the boundary of the hypothesized sub-surface ocean at depth.
                <br />
                - <strong>Thermal IR:</strong> Identifies bedrock outcrops exhibiting high thermal inertia compared
                to loose, highly insulating impact dust.
              </p>
              <h4>3. Touchdown Site Selection</h4>
              <p>
                Candidate Outpost Alpha resides on the sheltered floor between Valhalla’s third and fourth concentric
                rings, offering flat terrain, low boulder scatter, and shielding from solar cosmic ray flux.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="action-btn report-btn"
                onClick={() => setReportModalOpen(false)}
              >
                RETURN TO ORBITAL SURVEYOR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded High-Contrast Stylesheet */}
      <style>{`
        .lidar-cockpit {
          background-color: var(--surface, #0c121e);
          border: 1px solid color-mix(in srgb, var(--border, #334155) 45%, transparent);
          border-radius: var(--radius-lg, 12px);
          overflow: hidden;
          font-family: var(--font-mono, ui-monospace, SFMono-Regular, monospace);
          color: var(--moon, #f8fafc);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
        }

        .cockpit-header {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 1.75rem 2rem;
          border-bottom: 1px solid color-mix(in srgb, var(--border, #334155) 35%, transparent);
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(12, 18, 30, 0.5) 100%);
        }

        @media (min-width: 860px) {
          .cockpit-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .tag-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .platform-badge {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.3);
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
        }

        .orbit-badge {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #94a3b8;
          background: rgba(148, 163, 184, 0.08);
          border: 1px solid rgba(148, 163, 184, 0.2);
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
        }

        .deck-title {
          font-family: var(--font-display, inherit);
          font-size: 1.6rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.01em;
          color: #ffffff;
        }

        .deck-subtitle {
          font-size: 0.85rem;
          color: #94a3b8;
          margin: 0.35rem 0 0 0;
          font-family: var(--font-body, inherit);
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.1rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .flyover-btn {
          background: #0284c7;
          color: #ffffff;
          border: 1px solid #38bdf8;
        }

        .flyover-btn:hover {
          background: #0369a1;
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.4);
        }

        .flyover-btn.active {
          background: #0ea5e9;
          box-shadow: 0 0 16px rgba(14, 165, 233, 0.5);
        }

        .report-btn {
          background: rgba(30, 41, 59, 0.7);
          color: #e2e8f0;
          border: 1px solid rgba(148, 163, 184, 0.3);
        }

        .report-btn:hover {
          background: rgba(51, 65, 85, 0.9);
          border-color: #94a3b8;
        }

        /* Telemetry Cards */
        .telemetry-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.85rem;
          padding: 1.25rem 2rem;
          background: rgba(8, 13, 22, 0.6);
          border-bottom: 1px solid color-mix(in srgb, var(--border, #334155) 30%, transparent);
        }

        .telemetry-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 6px;
          padding: 0.85rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .card-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #94a3b8;
        }

        .card-value {
          font-size: 1.05rem;
          font-weight: 800;
          color: #f8fafc;
        }

        .card-subtext {
          font-size: 0.72rem;
          color: #64748b;
        }

        /* Workspace Grid */
        .deck-workspace {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          padding: 1.75rem 2rem;
        }

        @media (min-width: 1024px) {
          .deck-workspace {
            grid-template-columns: 1fr 340px;
          }
        }

        .canvas-container {
          position: relative;
          background: #060a12;
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 8px;
          overflow: hidden;
        }

        .lidar-canvas {
          width: 100%;
          height: auto;
          aspect-ratio: 860 / 500;
          display: block;
          cursor: grab;
          touch-action: none;
        }

        .lidar-canvas:active {
          cursor: grabbing;
        }

        /* Canvas HUD Overlay */
        .canvas-hud-overlay {
          position: absolute;
          top: 1rem;
          left: 1rem;
          right: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 0.5rem;
          pointer-events: none;
        }

        .hud-band-picker {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          pointer-events: auto;
        }

        .hud-band-btn {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(51, 65, 85, 0.6);
          color: #94a3b8;
          padding: 0.4rem 0.75rem;
          border-radius: 4px;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          backdrop-filter: blur(4px);
          transition: all 0.2s ease;
        }

        .hud-band-btn:hover {
          color: #ffffff;
          border-color: #38bdf8;
        }

        .hud-band-btn.active {
          background: rgba(56, 189, 248, 0.2);
          color: #38bdf8;
          border-color: #38bdf8;
        }

        .hud-floating-tools {
          display: flex;
          gap: 0.4rem;
          pointer-events: auto;
        }

        .hud-tool-btn {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(51, 65, 85, 0.6);
          color: #94a3b8;
          padding: 0.4rem 0.75rem;
          border-radius: 4px;
          font-size: 0.68rem;
          font-weight: 700;
          cursor: pointer;
          backdrop-filter: blur(4px);
          transition: all 0.2s ease;
        }

        .hud-tool-btn:hover {
          color: #ffffff;
        }

        .hud-tool-btn.active {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border-color: #38bdf8;
        }

        /* Spectrum Legend Bar */
        .spectrum-legend {
          padding: 0.75rem 1rem;
          background: rgba(8, 12, 20, 0.9);
          border-top: 1px solid rgba(51, 65, 85, 0.4);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .legend-title {
          font-size: 0.65rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.05em;
        }

        .gradient-bar-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.65rem;
          color: #64748b;
        }

        .gradient-fill {
          flex: 1;
          height: 8px;
          border-radius: 4px;
        }

        .gradient-fill.band-lidar {
          background: linear-gradient(90deg, #0284c7 0%, #2dd4bf 50%, #38bdf8 75%, #f8fafc 100%);
        }

        .gradient-fill.band-subsurface {
          background: linear-gradient(90deg, #4c1d95 0%, #c084fc 60%, #fbbf24 100%);
        }

        .gradient-fill.band-thermal {
          background: linear-gradient(90deg, #4338ca 0%, #e11d48 50%, #f43f5e 100%);
        }

        .gradient-fill.band-sar {
          background: linear-gradient(90deg, #15803d 0%, #4ade80 100%);
        }

        /* Sidebar Column */
        .sidebar-col {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .sidebar-card {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 8px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .sidebar-category {
          font-size: 0.68rem;
          font-weight: 700;
          color: #38bdf8;
          letter-spacing: 0.08em;
        }

        .sidebar-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .waypoint-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .waypoint-item {
          background: rgba(7, 11, 19, 0.6);
          border: 1px solid rgba(51, 65, 85, 0.4);
          border-radius: 6px;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .waypoint-item:hover {
          border-color: #38bdf8;
          background: rgba(15, 23, 42, 0.8);
        }

        .waypoint-item.selected {
          border-color: #38bdf8;
          background: rgba(56, 189, 248, 0.12);
        }

        .wp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .wp-name {
          font-size: 0.78rem;
          font-weight: 700;
          color: #f1f5f9;
        }

        .wp-hazard {
          font-size: 0.62rem;
          font-weight: 800;
          padding: 0.1rem 0.35rem;
          border-radius: 3px;
        }

        .hazard-low { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        .hazard-moderate { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
        .hazard-severe { background: rgba(239, 68, 68, 0.2); color: #f87171; }

        .wp-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.68rem;
          color: #94a3b8;
        }

        /* Target Detail Card */
        .detail-name {
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .detail-desc {
          font-size: 0.76rem;
          line-height: 1.5;
          color: #cbd5e1;
          margin: 0;
          font-family: var(--font-body, inherit);
        }

        .detail-stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          background: rgba(7, 11, 19, 0.6);
          padding: 0.75rem;
          border-radius: 6px;
        }

        .stat-cell {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .stat-label {
          font-size: 0.62rem;
          color: #64748b;
          font-weight: 700;
        }

        .stat-val {
          font-size: 0.74rem;
          color: #38bdf8;
          font-weight: 700;
        }

        .control-slider-box {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .slider-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 600;
        }

        .terrain-slider {
          width: 100%;
          accent-color: #38bdf8;
          cursor: pointer;
        }

        .density-toggle-group {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.4rem;
        }

        .density-btn {
          background: rgba(7, 11, 19, 0.6);
          border: 1px solid rgba(51, 65, 85, 0.4);
          color: #94a3b8;
          padding: 0.35rem;
          border-radius: 4px;
          font-size: 0.68rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .density-btn.active {
          background: rgba(56, 189, 248, 0.2);
          color: #38bdf8;
          border-color: #38bdf8;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 1.5rem;
        }

        .modal-dialog {
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 10px;
          max-width: 680px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
        }

        .modal-tag {
          font-size: 0.7rem;
          font-weight: 800;
          color: #38bdf8;
          letter-spacing: 0.08em;
          margin-bottom: 0.35rem;
        }

        .modal-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .modal-content h4 {
          font-size: 0.95rem;
          color: #38bdf8;
          margin: 1rem 0 0.4rem 0;
        }

        .modal-content p {
          font-size: 0.85rem;
          line-height: 1.6;
          color: #cbd5e1;
          margin: 0;
          font-family: var(--font-body, inherit);
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}
