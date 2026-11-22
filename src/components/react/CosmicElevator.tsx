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
import { playTelemetryBeep } from '../../lib/audio';

interface AltitudeTier {
  id: string;
  altitudeDisplay: string;
  name: string;
  region: string;
  pressure: string;
  temperature: string;
  seeingCondition: string;
  callistoScope: string;
  classification: string;
  badgeColor: string;
}

const ALTITUDE_TIERS: AltitudeTier[] = [
  {
    id: 'campus',
    altitudeDisplay: '54 m',
    name: 'CIT Campus Observation Deck',
    region: 'Chennai Urban-Suburban Ground Station (12.97° N, 80.04° E)',
    pressure: '1,013 hPa',
    temperature: '+28°C',
    seeingCondition: 'Bortle 6.5 • High Contrast Planetary & Lunar Targets',
    callistoScope:
      'Primary ground-truth tracking deck. Weekly student observation sessions with 8-inch Newtonian reflectors for lunar crater cartography, Jupiter cloud belts, and Saturn ring geometry.',
    classification: 'GROUND STATION BASELINE',
    badgeColor: '#38bdf8',
  },
  {
    id: 'ghats',
    altitudeDisplay: '750 m',
    name: 'Western Ghats Dark-Sky Sanctuary',
    region: 'Topslip & Anaikatti Mountain Foothills (Bortle Class 2-3)',
    pressure: '925 hPa',
    temperature: '+19°C',
    seeingCondition: 'Bortle 2.8 • Pristine Darkness • NELM 6.6m',
    callistoScope:
      'Annual dark-sky wilderness expeditions. Unfiltered view of the Milky Way core, faint reflection nebulae in Orion, and star clusters beyond the reach of suburban city lights.',
    classification: 'DARK-SKY EXPEDITION SITE',
    badgeColor: '#10b981',
  },
  {
    id: 'stratosphere',
    altitudeDisplay: '35 km',
    name: 'Stratospheric Near-Space Horizon',
    region: 'Middle Stratosphere • 99% Atmospheric Mass Below',
    pressure: '5.7 hPa',
    temperature: '-52°C',
    seeingCondition: 'Diffraction-Limited Seeing • Negligible Scintillation',
    callistoScope:
      'Future research horizon for Callisto technical wings: high-altitude atmospheric telemetry, solar UV flux logging, and airborne sensor payload testing.',
    classification: 'NEAR-SPACE SOUNDING HORIZON',
    badgeColor: '#a855f7',
  },
  {
    id: 'mesosphere',
    altitudeDisplay: '90 km',
    name: 'Mesosphere Meteor Ablation Zone',
    region: 'Upper Mesopause • Coldest Layer of Terrestrial Atmosphere',
    pressure: '0.01 hPa',
    temperature: '-88°C',
    seeingCondition: 'Transient Optical Ionization Trails',
    callistoScope:
      'Nocturnal optical tracking window for meteor showers (Perseids, Geminids, Leonids). High-speed all-sky cameras record radiant trajectories and entry kinetics.',
    classification: 'METEORIC IONIZATION HORIZON',
    badgeColor: '#f59e0b',
  },
  {
    id: 'karman',
    altitudeDisplay: '100 km',
    name: 'The Kármán Boundary',
    region: 'Official Edge of Space • Aerodynamic Lift Replaced by Orbit',
    pressure: '10⁻⁴ hPa',
    temperature: '-75°C',
    seeingCondition: 'Zero Atmosphere • Pure Vacuum Radiometry',
    callistoScope:
      'The threshold of astronautics. Where Callisto Club study circles transition from observational optics to orbital mechanics, CubeSat orbital decay, and attitude control physics.',
    classification: 'ASTRONAUTICAL BOUNDARY',
    badgeColor: '#ec4899',
  },
  {
    id: 'leo',
    altitudeDisplay: '420 km',
    name: 'Low Earth Orbit (ISS Station Track)',
    region: 'Thermosphere • Orbital Velocity 7.66 km/s (Mach 22)',
    pressure: 'Hard Vacuum',
    temperature: '-120°C to +120°C',
    seeingCondition: 'Orbital Path • 92-Minute Earth Revolution Period',
    callistoScope:
      'Solar and lunar transit tracking from campus. Using motorized GoTo mounts and solar continuum filters, members time the micro-second silhouettes of orbital satellites passing across celestial discs.',
    classification: 'ORBITAL TRANSIT TRACKING',
    badgeColor: '#06b6d4',
  },
  {
    id: 'luna',
    altitudeDisplay: '384,400 km',
    name: 'The Moon (Lunar Exosphere)',
    region: 'Earth-Moon Orbital System • Light Delay: 1.28 Seconds',
    pressure: 'Ultra-high Vacuum',
    temperature: '-130°C to +120°C',
    seeingCondition: 'Airless Regolith • Shadow-Sharp Terminator Relief',
    callistoScope:
      'High-resolution astrophotography and crater ray mapping (Tycho, Copernicus, Oceanus Procellarum). Baseline benchmark for telescope optical collimation and barlow lens imaging.',
    classification: 'DEEP LUNAR TARGET',
    badgeColor: '#f97316',
  },
  {
    id: 'callisto',
    altitudeDisplay: '628,000,000 km',
    name: 'Jovian Moon Callisto',
    region: 'Outer Galilean Orbit • Light Delay: 35 to 52 Minutes (4.2 AU)',
    pressure: 'Trace CO₂ Atmosphere',
    temperature: '-139°C',
    seeingCondition: 'Heavily Cratered Ancient Ice Shield • Subsurface Ocean',
    callistoScope:
      'The namesake and guiding vision of our club. Orbiting safely outside Jupiter’s lethal radiation belts, its saline interior ocean represents the enduring mystery of habitability on icy worlds.',
    classification: 'EXPEDITION INSPIRATION & CLUB NAMESAKE',
    badgeColor: '#38bdf8',
  },
];

export default function CosmicElevator(): React.ReactElement {
  const [activeTierIndex, setActiveTierIndex] = useState<number>(0);
  const activeTier = ALTITUDE_TIERS[activeTierIndex];

  const handleSelectTier = (index: number) => {
    playTelemetryBeep(880 + index * 60, 0.05);
    setActiveTierIndex(index);
  };

  return (
    <div className="cosmic-elevator-card" role="region" aria-label="Atmospheric to Deep Space Cosmic Flight Profile">
      {/* HUD Header Bar */}
      <div className="elevator-header">
        <div className="header-left">
          <div className="telemetry-radar-badge">
            <span className="radar-ping" />
            <span className="radar-label">ALTITUDE PROFILER</span>
          </div>
          <div className="header-text-group">
            <h3 className="elevator-title">ATMOSPHERIC TO COSMIC FLIGHT PROFILE</h3>
            <span className="elevator-subtitle">
              STANFORD SSI &amp; FREX ARCHITECTURE &bull; CIT CAMPUS TO JOVIAN HORIZONS
            </span>
          </div>
        </div>
        <div className="elevator-level-pill" style={{ borderColor: activeTier.badgeColor, color: activeTier.badgeColor }}>
          LEVEL {activeTierIndex + 1} OF {ALTITUDE_TIERS.length}
        </div>
      </div>

      {/* Main Scrubber Grid */}
      <div className="elevator-body-grid">
        {/* Left: Interactive Altitude Track */}
        <div className="altitude-scrubber-column" role="tablist" aria-label="Altitude Layers">
          <div className="scrubber-line-rail" aria-hidden="true" />
          {ALTITUDE_TIERS.map((tier, idx) => {
            const isActive = idx === activeTierIndex;
            return (
              <button
                key={tier.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectTier(idx)}
                className={`altitude-node-btn ${isActive ? 'active' : ''}`}
                style={{
                  borderColor: isActive ? tier.badgeColor : 'rgba(255, 255, 255, 0.12)',
                }}
              >
                <div
                  className="node-dot"
                  style={{
                    backgroundColor: isActive ? tier.badgeColor : 'rgba(255, 255, 255, 0.3)',
                    boxShadow: isActive ? `0 0 10px ${tier.badgeColor}` : 'none',
                  }}
                />
                <div className="node-text-wrap">
                  <span className="node-alt">{tier.altitudeDisplay}</span>
                  <span className="node-name">{tier.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Active Dossier & Telemetry Readouts */}
        <div className="telemetry-dossier-column">
          {/* Active Classification Tag */}
          <div className="dossier-header-row">
            <span
              className="tier-classification-badge"
              style={{ color: activeTier.badgeColor, borderColor: activeTier.badgeColor }}
            >
              {activeTier.classification}
            </span>
            <span className="dossier-coords">{activeTier.region}</span>
          </div>

          <h4 className="active-tier-name">{activeTier.name}</h4>

          {/* Metric Telemetry Cards */}
          <div className="telemetry-badges-row">
            <div className="telemetry-stat-card">
              <span className="stat-label">ALTITUDE</span>
              <span className="stat-val" style={{ color: activeTier.badgeColor }}>
                {activeTier.altitudeDisplay}
              </span>
            </div>
            <div className="telemetry-stat-card">
              <span className="stat-label">PRESSURE</span>
              <span className="stat-val">{activeTier.pressure}</span>
            </div>
            <div className="telemetry-stat-card">
              <span className="stat-label">TEMPERATURE</span>
              <span className="stat-val">{activeTier.temperature}</span>
            </div>
          </div>

          {/* Seeing & Sky Conditions */}
          <div className="seeing-condition-box">
            <div className="condition-label-bar">
              <span className="cond-tag">SEEING &amp; OPTICAL PROFILE</span>
            </div>
            <p className="condition-desc">{activeTier.seeingCondition}</p>
          </div>

          {/* Callisto Club Connection */}
          <div className="club-scope-box">
            <div className="scope-label-bar">
              <span className="scope-tag">CIT CALLISTO OBSERVATIONAL ROLE</span>
            </div>
            <p className="scope-desc">{activeTier.callistoScope}</p>
          </div>

          {/* Step Navigation Controls */}
          <div className="elevator-nav-controls">
            <button
              type="button"
              disabled={activeTierIndex === 0}
              onClick={() => handleSelectTier(activeTierIndex - 1)}
              className="btn-elevator-nav"
            >
              &larr; LOWER ALTITUDE
            </button>
            <span className="nav-step-indicator">
              STATION {activeTierIndex + 1} / {ALTITUDE_TIERS.length}
            </span>
            <button
              type="button"
              disabled={activeTierIndex === ALTITUDE_TIERS.length - 1}
              onClick={() => handleSelectTier(activeTierIndex + 1)}
              className="btn-elevator-nav"
            >
              HIGHER ALTITUDE &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Scoped High-Contrast CSS */}
      <style>{`
        .cosmic-elevator-card {
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

        .elevator-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          background: rgba(15, 23, 42, 0.85);
          border-bottom: 1px solid rgba(56, 189, 248, 0.25);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .telemetry-radar-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.4);
          padding: 0.35rem 0.65rem;
          border-radius: 4px;
        }

        .radar-ping {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #38bdf8;
          box-shadow: 0 0 8px #38bdf8;
          animation: pulsePing 1.8s infinite ease-in-out;
        }

        @keyframes pulsePing {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
        }

        .radar-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.7rem;
          font-weight: 700;
          color: #38bdf8;
          letter-spacing: 0.1em;
        }

        .header-text-group {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .elevator-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 1rem;
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: 0.05em;
          margin: 0;
        }

        .elevator-subtitle {
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          color: var(--orbit, #38bdf8);
          letter-spacing: 0.06em;
        }

        .elevator-level-pill {
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          font-weight: 800;
          border: 1px solid currentColor;
          padding: 0.35rem 0.75rem;
          border-radius: 4px;
          letter-spacing: 0.08em;
          background: rgba(0, 0, 0, 0.4);
        }

        .elevator-body-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          min-height: 440px;
        }

        .altitude-scrubber-column {
          background: rgba(10, 15, 30, 0.75);
          border-right: 1px solid rgba(56, 189, 248, 0.18);
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          position: relative;
        }

        .scrubber-line-rail {
          position: absolute;
          left: 1.8rem;
          top: 2rem;
          bottom: 2rem;
          width: 2px;
          background: rgba(56, 189, 248, 0.2);
          pointer-events: none;
        }

        .altitude-node-btn {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 0.55rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          position: relative;
          z-index: 1;
        }

        .altitude-node-btn:hover {
          background: rgba(56, 189, 248, 0.08);
        }

        .altitude-node-btn.active {
          background: rgba(56, 189, 248, 0.15);
        }

        .node-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .node-text-wrap {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .node-alt {
          font-family: var(--font-mono, monospace);
          font-size: 0.75rem;
          font-weight: 800;
          color: #f8fafc;
        }

        .node-name {
          font-size: 0.68rem;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .altitude-node-btn.active .node-name {
          color: #e2e8f0;
          font-weight: 600;
        }

        .telemetry-dossier-column {
          padding: 1.75rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .dossier-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .tier-classification-badge {
          font-family: var(--font-mono, monospace);
          font-size: 0.7rem;
          font-weight: 800;
          border: 1px solid currentColor;
          padding: 0.25rem 0.55rem;
          border-radius: 4px;
          letter-spacing: 0.08em;
          background: rgba(0, 0, 0, 0.4);
        }

        .dossier-coords {
          font-family: var(--font-mono, monospace);
          font-size: 0.7rem;
          color: #94a3b8;
          letter-spacing: 0.04em;
        }

        .active-tier-name {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.35rem;
          font-weight: 800;
          color: #f8fafc;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .telemetry-badges-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 0.75rem;
        }

        .telemetry-stat-card {
          background: rgba(15, 23, 42, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 0.65rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.62rem;
          color: #94a3b8;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .stat-val {
          font-family: var(--font-mono, monospace);
          font-size: 0.95rem;
          font-weight: 800;
          color: #f8fafc;
        }

        .seeing-condition-box,
        .club-scope-box {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 8px;
          padding: 1rem 1.25rem;
        }

        .condition-label-bar,
        .scope-label-bar {
          margin-bottom: 0.45rem;
        }

        .cond-tag {
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          font-weight: 800;
          color: #f59e0b;
          letter-spacing: 0.08em;
        }

        .scope-tag {
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          font-weight: 800;
          color: #38bdf8;
          letter-spacing: 0.08em;
        }

        .condition-desc,
        .scope-desc {
          font-size: 0.875rem;
          color: #cbd5e1;
          line-height: 1.55;
          margin: 0;
        }

        .elevator-nav-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          margin-top: auto;
        }

        .btn-elevator-nav {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.4);
          color: #38bdf8;
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.45rem 0.85rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.06em;
        }

        .btn-elevator-nav:hover:not(:disabled) {
          background: rgba(56, 189, 248, 0.2);
          color: #f8fafc;
        }

        .btn-elevator-nav:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          border-color: rgba(255, 255, 255, 0.15);
          color: #64748b;
        }

        .nav-step-indicator {
          font-family: var(--font-mono, monospace);
          font-size: 0.7rem;
          color: #94a3b8;
          letter-spacing: 0.08em;
        }

        @media (max-width: 860px) {
          .elevator-body-grid {
            grid-template-columns: 1fr;
          }

          .altitude-scrubber-column {
            border-right: none;
            border-bottom: 1px solid rgba(56, 189, 248, 0.18);
            max-height: 240px;
            overflow-y: auto;
          }

          .scrubber-line-rail {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .elevator-header {
            padding: 1rem;
          }

          .telemetry-dossier-column {
            padding: 1rem;
          }

          .active-tier-name {
            font-size: 1.15rem;
          }

          .telemetry-badges-row {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
