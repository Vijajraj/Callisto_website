/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

import React, { useState } from 'react';
import { playBeaconPing, playTelemetryBeep } from '../../lib/audio';

interface SignalTarget {
  id: string;
  name: string;
  classification: string;
  distanceDisplay: string;
  lightTimeOneWay: string;
  lightTimeRoundTrip: string;
  radioFrequency: string;
  podcastOrClubRef: string;
  targetDescription: string;
  speedFractionOfC: string;
  reticleCoords: { ra: string; dec: string };
  color: string;
}

const SIGNAL_TARGETS: SignalTarget[] = [
  {
    id: 'luna',
    name: 'The Moon (Luna)',
    classification: 'NATURAL SATELLITE',
    distanceDisplay: '384,400 km (0.0026 AU)',
    lightTimeOneWay: '1.28 Seconds',
    lightTimeRoundTrip: '2.56 Seconds',
    radioFrequency: '2,200 MHz (S-Band)',
    podcastOrClubRef: 'CIT Campus Lunar Cartography Benchmark',
    targetDescription:
      'Reflected sunlight leaves the lunar crater Copernicus and reaches the eyepiece of our campus telescopes in just over one second. Ground radar pulses bounced off lunar regolith return with a 2.56-second round-trip delay.',
    speedFractionOfC: '1.00 c (299,792 km/s)',
    reticleCoords: { ra: '12h 45m', dec: '+08° 12′' },
    color: '#f8fafc',
  },
  {
    id: 'sun',
    name: 'Sol (Our Star)',
    classification: 'YELLOW DWARF (G2V)',
    distanceDisplay: '149,600,000 km (1.00 AU)',
    lightTimeOneWay: '8 Minutes 19 Seconds',
    lightTimeRoundTrip: '16 Minutes 38 Seconds',
    radioFrequency: '1,420.405 MHz (Hydrogen Line)',
    podcastOrClubRef: 'Solar Continuum Filter Observation',
    targetDescription:
      'Photons born in the thermonuclear solar core take over 100,000 years to reach the photosphere via radiative diffusion, then cross the interplanetary void to CIT ground station in precisely 499 seconds.',
    speedFractionOfC: '1.00 c (299,792 km/s)',
    reticleCoords: { ra: '04h 32m', dec: '+21° 08′' },
    color: '#f59e0b',
  },
  {
    id: 'callisto',
    name: 'Jovian Moon Callisto',
    classification: 'GALILEAN ICE MOON (4.2 AU)',
    distanceDisplay: '628,700,000 km (4.20 AU)',
    lightTimeOneWay: '34 Minutes 58 Seconds',
    lightTimeRoundTrip: '1 Hour 9 Minutes 56 Seconds',
    radioFrequency: '8,400 MHz (X-Band)',
    podcastOrClubRef: 'Callisto Club Namesake & Mission Vision',
    targetDescription:
      'Commands transmitted from Earth to robotic spacecraft exploring Jupiter take more than half an hour each way. By the time ground controllers receive telemetry confirming a thruster burn, the event occurred 35 minutes in the past.',
    speedFractionOfC: '1.00 c (299,792 km/s)',
    reticleCoords: { ra: '03h 18m', dec: '+16° 44′' },
    color: '#38bdf8',
  },
  {
    id: 'voyager1',
    name: 'Voyager 1 Spacecraft',
    classification: 'EXTRASOLAR PROBE (163+ AU)',
    distanceDisplay: '24,400,000,000 km (163.4 AU)',
    lightTimeOneWay: '22 Hours 37 Minutes',
    lightTimeRoundTrip: '45 Hours 14 Minutes',
    radioFrequency: '8,415 MHz (DSN Microwave Link)',
    podcastOrClubRef: 'StarCast Episode 02 (Hosted by Lathika Raj)',
    targetDescription:
      'Humanity’s most distant emissary. When NASA JPL engineers sent the memory patch to resolve the Flight Data Subsystem corruption (explored by Lathika Raj in Episode 02), they waited nearly two full days for Voyager 1 to reply.',
    speedFractionOfC: '1.00 c (299,792 km/s)',
    reticleCoords: { ra: '17h 14m', dec: '+12° 03′' },
    color: '#10b981',
  },
  {
    id: 'sgr-b2',
    name: 'Sagittarius B2 Molecular Cloud',
    classification: 'GALACTIC CENTER GAS COMPLEX',
    distanceDisplay: '26,000 Light-Years (Galactic Core)',
    lightTimeOneWay: '26,000 Years',
    lightTimeRoundTrip: '52,000 Years',
    radioFrequency: '86.846 GHz (Molecular Line)',
    podcastOrClubRef: 'StarCast Episode 03 (Hosted by V S Daksha)',
    targetDescription:
      'A dense cosmic gas nursery spanning 150 light-years. Radio emissions carrying the spectroscopic scent of ethyl formate (explored by V S Daksha in Episode 03) started traveling toward Earth during the last terrestrial glacial maximum.',
    speedFractionOfC: '1.00 c (299,792 km/s)',
    reticleCoords: { ra: '17h 47m', dec: '-28° 23′' },
    color: '#a855f7',
  },
  {
    id: 'ton-618',
    name: 'TON 618 Ultramassive Engine',
    classification: 'RADIO-LOUD HYPER-ACCRETION QUASAR',
    distanceDisplay: '18.2 Billion Light-Years (Comoving)',
    lightTimeOneWay: '10.4 Billion Years (Lookback Time)',
    lightTimeRoundTrip: 'N/A (Cosmological Horizon)',
    radioFrequency: '408 MHz (Metric Radio Band)',
    podcastOrClubRef: 'StarCast Episode 01 (Hosted by Sanjay V V)',
    targetDescription:
      'The largest black hole ever measured (66 billion solar masses, explored by Sanjay V V in Episode 01). The blinding optical radiation now hitting our detectors left its swirling accretion disk when the universe was less than a third of its current age.',
    speedFractionOfC: '1.00 c (Cosmological Redshift z=2.219)',
    reticleCoords: { ra: '12h 28m', dec: '+31° 28′' },
    color: '#f97316',
  },
];

export default function CosmicLightDelay(): React.ReactElement {
  const [selectedTargetIndex, setSelectedTargetIndex] = useState<number>(2); // Default to Callisto
  const [isPulsing, setIsPulsing] = useState<boolean>(false);
  const activeTarget = SIGNAL_TARGETS[selectedTargetIndex];

  const handleSelectTarget = (index: number) => {
    playTelemetryBeep(920 + index * 40, 0.05);
    setSelectedTargetIndex(index);
  };

  const handleTransmitPulse = () => {
    if (isPulsing) return;
    setIsPulsing(true);
    playBeaconPing(1200, 0.15);

    setTimeout(() => {
      setIsPulsing(false);
    }, 2200);
  };

  return (
    <div className="light-delay-card" role="region" aria-label="Cosmic Speed-of-Light & Signal Telemetry Visualizer">
      {/* Header Bar */}
      <div className="delay-header">
        <div className="delay-header-left">
          <div className="speed-c-badge">
            <span className="speed-c-symbol">c</span>
            <span className="speed-c-text">299,792 km/s</span>
          </div>
          <div className="delay-title-group">
            <h3 className="delay-main-title">COSMIC SIGNAL DELAY &amp; PHOTON PROPAGATION</h3>
            <span className="delay-sub-title">
              SPEED-OF-LIGHT TELEMETRY &bull; CIT GROUND STATION TO COSMOLOGICAL HORIZONS
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTransmitPulse}
          disabled={isPulsing}
          className={`btn-transmit-pulse ${isPulsing ? 'transmitting' : ''}`}
          aria-label="Transmit simulated deep-space radio pulse"
        >
          <span className="pulse-dot" />
          <span>{isPulsing ? 'TRANSMITTING...' : 'TRANSMIT RADIO PULSE'}</span>
        </button>
      </div>

      {/* Target Navigation Tabs */}
      <div className="target-tabs-bar" role="tablist" aria-label="Cosmic Targets">
        {SIGNAL_TARGETS.map((target, idx) => {
          const isSelected = idx === selectedTargetIndex;
          return (
            <button
              key={target.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => handleSelectTarget(idx)}
              className={`target-tab-btn ${isSelected ? 'selected' : ''}`}
              style={{
                borderColor: isSelected ? target.color : 'transparent',
              }}
            >
              <span
                className="target-color-indicator"
                style={{
                  backgroundColor: target.color,
                  boxShadow: isSelected ? `0 0 8px ${target.color}` : 'none',
                }}
              />
              <span className="target-tab-name">{target.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Visualizer Stage */}
      <div className="visualizer-stage-grid">
        {/* Left: FREX-Inspired Celestial Tracking Gyro Reticle */}
        <div className="reticle-stage-col">
          <div className="gyro-reticle-wrap">
            {/* Outer Slow Counter-Rotating Ring */}
            <div className="reticle-outer-ring" style={{ borderColor: `${activeTarget.color}40` }}>
              <div className="degree-mark deg-0">000°</div>
              <div className="degree-mark deg-90">090°</div>
              <div className="degree-mark deg-180">180°</div>
              <div className="degree-mark deg-270">270°</div>
            </div>

            {/* Inner Clockwise Rotating Ring */}
            <div className="reticle-inner-ring" style={{ borderColor: `${activeTarget.color}80` }} />

            {/* Crosshair Axes */}
            <div className="reticle-crosshair-h" style={{ backgroundColor: `${activeTarget.color}60` }} />
            <div className="reticle-crosshair-v" style={{ backgroundColor: `${activeTarget.color}60` }} />

            {/* Center Target Beacon with Pulse Wave */}
            <div
              className={`reticle-target-beacon ${isPulsing ? 'ping-active' : ''}`}
              style={{
                backgroundColor: activeTarget.color,
                boxShadow: `0 0 16px ${activeTarget.color}`,
              }}
            />

            {/* Corner Framing Brackets */}
            <div className="reticle-corner top-left" style={{ borderColor: activeTarget.color }} />
            <div className="reticle-corner top-right" style={{ borderColor: activeTarget.color }} />
            <div className="reticle-corner bottom-left" style={{ borderColor: activeTarget.color }} />
            <div className="reticle-corner bottom-right" style={{ borderColor: activeTarget.color }} />

            {/* Coordinate Readout Box */}
            <div className="reticle-coords-tag">
              <span>RA: {activeTarget.reticleCoords.ra}</span>
              <span>DEC: {activeTarget.reticleCoords.dec}</span>
            </div>
          </div>

          <div className="reticle-caption">
            <span className="reticle-target-title" style={{ color: activeTarget.color }}>
              {activeTarget.name}
            </span>
            <span className="reticle-target-class">{activeTarget.classification}</span>
          </div>
        </div>

        {/* Right: Telemetry & Delay Metrics */}
        <div className="delay-telemetry-col">
          {/* Linked Feature Badge */}
          <div className="linked-ref-badge">
            <span className="linked-icon">&bull;</span>
            <span className="linked-text">{activeTarget.podcastOrClubRef}</span>
          </div>

          {/* Primary Distance & Light Delay Grid */}
          <div className="telemetry-metrics-grid">
            <div className="metric-box delay-hero-box" style={{ borderColor: `${activeTarget.color}60` }}>
              <span className="metric-label">ONE-WAY LIGHT DELAY</span>
              <div className="delay-hero-val" style={{ color: activeTarget.color }}>
                {activeTarget.lightTimeOneWay}
              </div>
              <span className="metric-hint">Elapsed time for photons/radio signals to cross void</span>
            </div>

            <div className="metric-box">
              <span className="metric-label">ROUND-TRIP DELAY (RTT)</span>
              <div className="metric-val">{activeTarget.lightTimeRoundTrip}</div>
              <span className="metric-hint">Earth transmit $\rightarrow$ echo receive latency</span>
            </div>

            <div className="metric-box">
              <span className="metric-label">PHYSICAL DISTANCE</span>
              <div className="metric-val">{activeTarget.distanceDisplay}</div>
              <span className="metric-hint">Current astronomical coordinates from CIT deck</span>
            </div>

            <div className="metric-box">
              <span className="metric-label">CARRIER FREQUENCY</span>
              <div className="metric-val">{activeTarget.radioFrequency}</div>
              <span className="metric-hint">Downlink spectral wavelength window</span>
            </div>
          </div>

          {/* Detailed Scientific Target Dossier */}
          <div className="target-description-card">
            <div className="dossier-label">
              <span>ASTROPHYSICS &amp; TELEMETRY BRIEFING</span>
            </div>
            <p className="dossier-body">{activeTarget.targetDescription}</p>
          </div>

          {/* Animated Photon Propagation Vector Beam */}
          <div className="propagation-vector-wrap">
            <div className="vector-label-row">
              <span className="v-label-left">CIT GROUND STATION (0.00s)</span>
              <span className="v-label-right">{activeTarget.name.toUpperCase()} ({activeTarget.lightTimeOneWay})</span>
            </div>
            <div className="vector-beam-track" aria-hidden="true">
              <div
                className={`photon-packet ${isPulsing ? 'firing' : ''}`}
                style={{
                  backgroundColor: activeTarget.color,
                  boxShadow: `0 0 10px ${activeTarget.color}`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scoped High-Contrast CSS */}
      <style>{`
        .light-delay-card {
          background-color: var(--deep, #0b1120);
          border: 1px solid color-mix(in srgb, var(--orbit, #38bdf8) 40%, transparent);
          border-radius: var(--radius-lg, 14px);
          overflow: hidden;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.75), 0 0 24px rgba(56, 189, 248, 0.16);
          margin-top: var(--space-xl, 2rem);
          margin-bottom: var(--space-3xl, 3rem);
          width: 100%;
          position: relative;
        }

        .delay-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          background: rgba(15, 23, 42, 0.85);
          border-bottom: 1px solid rgba(56, 189, 248, 0.25);
        }

        .delay-header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .speed-c-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.4);
          padding: 0.35rem 0.65rem;
          border-radius: 4px;
        }

        .speed-c-symbol {
          font-family: var(--font-heading, serif);
          font-style: italic;
          font-size: 0.95rem;
          font-weight: 800;
          color: #f59e0b;
        }

        .speed-c-text {
          font-family: var(--font-mono, monospace);
          font-size: 0.7rem;
          font-weight: 700;
          color: #f59e0b;
          letter-spacing: 0.06em;
        }

        .delay-title-group {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .delay-main-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 1rem;
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: 0.05em;
          margin: 0;
        }

        .delay-sub-title {
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          color: var(--orbit, #38bdf8);
          letter-spacing: 0.06em;
        }

        .btn-transmit-pulse {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid #38bdf8;
          color: #38bdf8;
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          letter-spacing: 0.08em;
          transition: all 0.2s ease;
        }

        .btn-transmit-pulse:hover:not(:disabled) {
          background: rgba(56, 189, 248, 0.3);
          color: #f8fafc;
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.4);
        }

        .btn-transmit-pulse.transmitting {
          border-color: #10b981;
          color: #10b981;
          background: rgba(16, 185, 129, 0.2);
        }

        .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 6px currentColor;
        }

        .target-tabs-bar {
          display: flex;
          gap: 0.35rem;
          padding: 0.75rem 1.5rem;
          background: rgba(10, 15, 30, 0.6);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          overflow-x: auto;
          scrollbar-width: thin;
        }

        .target-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.4rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .target-tab-btn:hover {
          background: rgba(56, 189, 248, 0.1);
        }

        .target-tab-btn.selected {
          background: rgba(56, 189, 248, 0.18);
        }

        .target-color-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .target-tab-name {
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          font-weight: 700;
          color: #f8fafc;
        }

        .visualizer-stage-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          min-height: 400px;
        }

        .reticle-stage-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          background: rgba(8, 12, 24, 0.75);
          border-right: 1px solid rgba(56, 189, 248, 0.18);
        }

        .gyro-reticle-wrap {
          width: 200px;
          height: 200px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reticle-outer-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px dashed;
          animation: spinCounterClockwise 36s linear infinite;
        }

        @keyframes spinCounterClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        .degree-mark {
          position: absolute;
          font-family: var(--font-mono, monospace);
          font-size: 0.55rem;
          color: #64748b;
          font-weight: 700;
        }

        .deg-0 { top: -8px; left: 50%; transform: translateX(-50%); }
        .deg-90 { right: -12px; top: 50%; transform: translateY(-50%); }
        .deg-180 { bottom: -8px; left: 50%; transform: translateX(-50%); }
        .deg-270 { left: -14px; top: 50%; transform: translateY(-50%); }

        .reticle-inner-ring {
          position: absolute;
          inset: 24px;
          border-radius: 50%;
          border: 1px solid;
          opacity: 0.6;
          animation: spinClockwise 24s linear infinite;
        }

        @keyframes spinClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .reticle-crosshair-h {
          position: absolute;
          left: 10px;
          right: 10px;
          height: 1px;
        }

        .reticle-crosshair-v {
          position: absolute;
          top: 10px;
          bottom: 10px;
          width: 1px;
        }

        .reticle-target-beacon {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .reticle-target-beacon.ping-active {
          animation: beaconPulseAnim 1.2s infinite ease-out;
        }

        @keyframes beaconPulseAnim {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.8); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }

        .reticle-corner {
          position: absolute;
          width: 14px;
          height: 14px;
        }

        .reticle-corner.top-left { top: -6px; left: -6px; border-top: 2px solid; border-left: 2px solid; }
        .reticle-corner.top-right { top: -6px; right: -6px; border-top: 2px solid; border-right: 2px solid; }
        .reticle-corner.bottom-left { bottom: -6px; left: -6px; border-bottom: 2px solid; border-left: 2px solid; }
        .reticle-corner.bottom-right { bottom: -6px; right: -6px; border-bottom: 2px solid; border-right: 2px solid; }

        .reticle-coords-tag {
          position: absolute;
          bottom: -22px;
          display: flex;
          gap: 0.6rem;
          font-family: var(--font-mono, monospace);
          font-size: 0.62rem;
          color: #94a3b8;
          font-weight: 700;
          letter-spacing: 0.06em;
          background: rgba(0, 0, 0, 0.7);
          padding: 0.15rem 0.45rem;
          border-radius: 3px;
        }

        .reticle-caption {
          margin-top: 2.2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.25rem;
        }

        .reticle-target-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .reticle-target-class {
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          color: #94a3b8;
          letter-spacing: 0.08em;
        }

        .delay-telemetry-col {
          padding: 1.75rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .linked-ref-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: #38bdf8;
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          border-radius: 4px;
          letter-spacing: 0.06em;
          align-self: flex-start;
        }

        .telemetry-metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.85rem;
        }

        .metric-box {
          background: rgba(15, 23, 42, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 0.75rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .delay-hero-box {
          background: rgba(15, 23, 42, 0.9);
          grid-column: 1 / -1;
        }

        .metric-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.62rem;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.08em;
        }

        .delay-hero-val {
          font-family: var(--font-mono, monospace);
          font-size: 1.65rem;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .metric-val {
          font-family: var(--font-mono, monospace);
          font-size: 0.95rem;
          font-weight: 800;
          color: #f8fafc;
        }

        .metric-hint {
          font-size: 0.65rem;
          color: #64748b;
        }

        .target-description-card {
          background: rgba(15, 23, 42, 0.55);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 6px;
          padding: 0.85rem 1.15rem;
        }

        .dossier-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          font-weight: 800;
          color: #f59e0b;
          letter-spacing: 0.08em;
          margin-bottom: 0.4rem;
        }

        .dossier-body {
          font-size: 0.85rem;
          color: #cbd5e1;
          line-height: 1.55;
          margin: 0;
        }

        .propagation-vector-wrap {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .vector-label-row {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono, monospace);
          font-size: 0.62rem;
          color: #94a3b8;
          font-weight: 700;
        }

        .vector-beam-track {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          position: relative;
          overflow: hidden;
        }

        .photon-packet {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 24px;
          border-radius: 3px;
          transition: transform 0.1s linear;
        }

        .photon-packet.firing {
          animation: packetBeamTraverse 2.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes packetBeamTraverse {
          0% { left: 0%; transform: scaleX(1); opacity: 1; }
          80% { left: 92%; transform: scaleX(1.8); opacity: 1; }
          100% { left: 100%; transform: scaleX(0.5); opacity: 0; }
        }

        @media (max-width: 860px) {
          .visualizer-stage-grid {
            grid-template-columns: 1fr;
          }

          .reticle-stage-col {
            border-right: none;
            border-bottom: 1px solid rgba(56, 189, 248, 0.18);
          }
        }

        @media (max-width: 640px) {
          .delay-header {
            padding: 1rem;
          }

          .delay-telemetry-col {
            padding: 1rem;
          }

          .delay-hero-val {
            font-size: 1.3rem;
          }

          .telemetry-metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
