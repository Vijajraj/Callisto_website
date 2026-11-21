/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

import React, { useState, useEffect, useMemo } from 'react';
import { playTelemetryBeep } from '../../lib/audio';

interface ObservingSite {
  id: string;
  name: string;
  region: string;
  coords: string;
  elevation: string;
  baseBortle: number;
  baseMpsas: number;
  baseNelm: number;
  notes: string;
}

const OBSERVING_SITES: ObservingSite[] = [
  {
    id: 'campus',
    name: 'CIT Campus Station',
    region: 'Suburban / Campus Ground Station',
    coords: '12.97° N, 80.04° E',
    elevation: '54m',
    baseBortle: 6.5,
    baseMpsas: 18.8,
    baseNelm: 4.8,
    notes: 'Urban-suburban baseline. Optimal for high-contrast lunar cartography and major bright planetary discs.',
  },
  {
    id: 'anaikatti',
    name: 'Anaikatti Foothills Station',
    region: 'Western Ghats Dark-Sky Field',
    coords: '11.10° N, 76.77° E',
    elevation: '650m',
    baseBortle: 3.5,
    baseMpsas: 21.2,
    baseNelm: 6.3,
    notes: 'Rural dark sky. Minimal sodium flare, low aerosol scattering, prime for deep-sky nebulae integration.',
  },
  {
    id: 'topslip',
    name: 'Topslip Dark-Sky Sanctuary',
    region: 'Anamalai Reserve Baseline',
    coords: '10.48° N, 76.83° E',
    elevation: '800m',
    baseBortle: 2.5,
    baseMpsas: 21.8,
    baseNelm: 6.8,
    notes: 'Exceptional transparency. Limiting naked-eye magnitude ~6.8, zodiacal light and stellar clouds resolved.',
  },
];

type TimeSimulation = 'now' | '2200' | '0100' | '0330';

export default function SkyQualityIndex(): React.ReactElement {
  const [selectedSiteId, setSelectedSiteId] = useState<string>('campus');
  const [timeMode, setTimeMode] = useState<TimeSimulation>('now');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Update real-time clock every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (timeMode === 'now') {
        setCurrentTime(new Date());
      }
    }, 10000);
    return () => clearInterval(timer);
  }, [timeMode]);

  const activeSite = useMemo(() => {
    return OBSERVING_SITES.find((s) => s.id === selectedSiteId) || OBSERVING_SITES[0];
  }, [selectedSiteId]);

  // Compute simulated observing date
  const evalDate = useMemo(() => {
    const d = new Date(currentTime);
    if (timeMode === '2200') {
      d.setHours(22, 0, 0, 0);
    } else if (timeMode === '0100') {
      d.setHours(1, 0, 0, 0);
      d.setDate(d.getDate() + 1);
    } else if (timeMode === '0330') {
      d.setHours(3, 30, 0, 0);
      d.setDate(d.getDate() + 1);
    }
    return d;
  }, [currentTime, timeMode]);

  // Astronomical calculations
  const telemetry = useMemo(() => {
    const hour = evalDate.getHours() + evalDate.getMinutes() / 60;

    // Approximate Sun Altitude based on hour (simplified for 13° N latitude)
    // Noon ~ 12:00 (+75°), Midnight ~ 00:00 (-55°), Sunset ~ 18:00 (0°), Sunrise ~ 06:00 (0°)
    const sunAngle = -Math.cos(((hour - 12) / 12) * Math.PI) * 65 - 10;

    let twilightStatus = 'NIGHT // ASTRONOMICAL DARK';
    let daylightFactor = 0; // 0 = dark, 1 = broad daylight

    if (sunAngle > 0) {
      twilightStatus = 'DAYLIGHT // SOLAR WINDOW';
      daylightFactor = 1;
    } else if (sunAngle > -6) {
      twilightStatus = 'CIVIL TWILIGHT';
      daylightFactor = 0.7;
    } else if (sunAngle > -12) {
      twilightStatus = 'NAUTICAL TWILIGHT';
      daylightFactor = 0.35;
    } else if (sunAngle > -18) {
      twilightStatus = 'ASTRONOMICAL TWILIGHT';
      daylightFactor = 0.15;
    } else {
      twilightStatus = 'TRUE ASTRONOMICAL DARKNESS';
      daylightFactor = 0;
    }

    // Lunar Phase computation (Conway lunar age approximation)
    const year = evalDate.getFullYear();
    const month = evalDate.getMonth() + 1;
    const day = evalDate.getDate();
    const c = 365.25 * year;
    const e = 30.6 * month;
    const jd = c + e + day - 694039.09;
    const b = jd / 29.53058867;
    const cycleFrac = b - Math.floor(b);
    const moonAgeDays = cycleFrac * 29.53;
    const moonIllumination = Math.round((1 - Math.cos(cycleFrac * 2 * Math.PI)) * 50);

    let moonPhaseName = 'New Moon';
    if (moonAgeDays < 1.8) moonPhaseName = 'New Moon';
    else if (moonAgeDays < 7.4) moonPhaseName = 'Waxing Crescent';
    else if (moonAgeDays < 9.2) moonPhaseName = 'First Quarter';
    else if (moonAgeDays < 14.7) moonPhaseName = 'Waxing Gibbous';
    else if (moonAgeDays < 16.5) moonPhaseName = 'Full Moon';
    else if (moonAgeDays < 22.1) moonPhaseName = 'Waning Gibbous';
    else if (moonAgeDays < 23.9) moonPhaseName = 'Last Quarter';
    else moonPhaseName = 'Waning Crescent';

    // Moon visibility check (rough approximation: Waxing visible in early night, Waning in late night)
    const moonIsUp = (moonAgeDays < 14.7 && hour >= 18) || (moonAgeDays >= 14.7 && hour <= 6) || moonIllumination < 15;

    // Light pollution & Seeing degradation calculations
    const moonPenalty = moonIsUp ? (moonIllumination / 100) * 1.8 : 0;
    const daylightPenalty = daylightFactor * 5;

    const dynamicBortle = Math.min(9, Math.max(1, +(activeSite.baseBortle + moonPenalty * 0.8 + daylightPenalty).toFixed(1)));
    const dynamicMpsas = +(activeSite.baseMpsas - moonPenalty * 1.2 - daylightPenalty * 4).toFixed(2);
    const dynamicNelm = +(Math.max(1.5, activeSite.baseNelm - moonPenalty * 0.9 - daylightPenalty * 3)).toFixed(1);

    // Pickering Seeing Scale (1 to 10) & FWHM
    const basePickering = selectedSiteId === 'topslip' ? 8.5 : selectedSiteId === 'anaikatti' ? 7.5 : 5.8;
    const pickering = Math.round(Math.max(2, Math.min(10, basePickering - daylightFactor * 3)));
    const fwhm = (3.2 - pickering * 0.22).toFixed(1);

    // Seeing quality label
    let qualityRating = 'EXCELLENT';
    let qualityColor = '#10b981';
    let recommendation = 'Pristine observing conditions. Optimal for faint emission nebulae, distant galaxies, and photometric star cataloging.';

    if (daylightFactor > 0.5) {
      qualityRating = 'DAYLIGHT';
      qualityColor = '#f59e0b';
      recommendation = 'Sun above horizon. Daytime solar observing only with certified Baader or H-Alpha safety filters.';
    } else if (dynamicBortle > 6.0) {
      qualityRating = 'MODERATE';
      qualityColor = '#38bdf8';
      recommendation = 'Urban glow or moonlight present. Recommended: High-magnification lunar craters, double stars, and planetary rings.';
    } else if (dynamicBortle > 4.5) {
      qualityRating = 'GOOD';
      qualityColor = '#38bdf8';
      recommendation = 'Favorable transparency. Ideal for open clusters, bright planetary nebulae, and wide-field tracking.';
    }

    return {
      sunAngle: sunAngle.toFixed(1),
      twilightStatus,
      moonPhaseName,
      moonIllumination,
      moonIsUp,
      dynamicBortle,
      dynamicMpsas,
      dynamicNelm,
      pickering,
      fwhm,
      qualityRating,
      qualityColor,
      recommendation,
      localTimeString: evalDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      utcString: evalDate.toUTCString().slice(17, 22) + ' UTC',
    };
  }, [evalDate, activeSite, selectedSiteId]);

  const handleSiteChange = (id: string) => {
    playTelemetryBeep(920, 0.05);
    setSelectedSiteId(id);
  };

  const handleTimeChange = (mode: TimeSimulation) => {
    playTelemetryBeep(1040, 0.06);
    setTimeMode(mode);
  };

  const handleRefresh = () => {
    playTelemetryBeep(1200, 0.08);
    setIsRefreshing(true);
    setCurrentTime(new Date());
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="sky-quality-widget" role="region" aria-label="Dynamic Sky Quality and Atmospheric Seeing Index">
      {/* Widget Header Strip */}
      <div className="sqi-header-bar">
        <div className="sqi-brand-group">
          <span className="live-pulse-badge">
            <span className={`pulse-circle ${isRefreshing ? 'refreshing' : ''}`} />
            REAL-TIME TELEMETRY
          </span>
          <div className="sqi-title-meta">
            <h3 className="sqi-main-title">ATMOSPHERIC SEEING &amp; SKY QUALITY INDEX</h3>
            <span className="sqi-sub-title">DYNAMIC FIELD TELEMETRY &bull; LOCAL SEEING FORECAST ENGINE</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="btn-refresh-telemetry"
          aria-label="Refresh seeing telemetry calculation"
        >
          <svg
            className={`refresh-icon ${isRefreshing ? 'spin' : ''}`}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          <span>RECALCULATE</span>
        </button>
      </div>

      {/* Control Strip: Site Selector & Time Simulation */}
      <div className="sqi-controls-row">
        {/* Site Selector Chips */}
        <div className="control-group">
          <span className="control-label">FIELD STATION:</span>
          <div className="chips-list" role="tablist">
            {OBSERVING_SITES.map((site) => (
              <button
                key={site.id}
                type="button"
                role="tab"
                aria-selected={selectedSiteId === site.id}
                onClick={() => handleSiteChange(site.id)}
                className={`site-chip ${selectedSiteId === site.id ? 'active' : ''}`}
              >
                {site.name}
              </button>
            ))}
          </div>
        </div>

        {/* Time Mode Simulation Chips */}
        <div className="control-group">
          <span className="control-label">OBSERVATION WINDOW:</span>
          <div className="chips-list">
            <button
              type="button"
              onClick={() => handleTimeChange('now')}
              className={`time-chip ${timeMode === 'now' ? 'active' : ''}`}
            >
              LIVE NOW ({telemetry.localTimeString})
            </button>
            <button
              type="button"
              onClick={() => handleTimeChange('2200')}
              className={`time-chip ${timeMode === '2200' ? 'active' : ''}`}
            >
              22:00 PRIME
            </button>
            <button
              type="button"
              onClick={() => handleTimeChange('0100')}
              className={`time-chip ${timeMode === '0100' ? 'active' : ''}`}
            >
              01:00 MERIDIAN
            </button>
            <button
              type="button"
              onClick={() => handleTimeChange('0330')}
              className={`time-chip ${timeMode === '0330' ? 'active' : ''}`}
            >
              03:30 PRE-DAWN
            </button>
          </div>
        </div>
      </div>

      {/* Main Dynamic Seeing Display Grid */}
      <div className="sqi-content-grid">
        {/* Left Column: Live Bortle & Sky Brightness Metrics */}
        <div className="sqi-metrics-col">
          {/* Primary Seeing Verdict Card */}
          <div className="seeing-verdict-card" style={{ borderColor: telemetry.qualityColor }}>
            <div className="verdict-top-row">
              <span className="verdict-tag">SEEING REGIME</span>
              <span className="verdict-pill" style={{ color: telemetry.qualityColor, borderColor: telemetry.qualityColor }}>
                {telemetry.qualityRating}
              </span>
            </div>

            <div className="bortle-hero-value">
              <span className="bortle-num">CLASS {telemetry.dynamicBortle}</span>
              <span className="bortle-label">DYNAMIC BORTLE INDEX</span>
            </div>

            {/* Visual Bortle Scale Meter Bar */}
            <div className="bortle-meter-wrap" aria-hidden="true">
              <div
                className="bortle-meter-fill"
                style={{
                  width: `${(telemetry.dynamicBortle / 9) * 100}%`,
                  backgroundColor: telemetry.qualityColor,
                }}
              />
            </div>
            <div className="bortle-meter-scale">
              <span>Class 1 (Pristine)</span>
              <span>Class 5 (Suburban)</span>
              <span>Class 9 (Inner City)</span>
            </div>

            <p className="seeing-recommendation-text">{telemetry.recommendation}</p>
          </div>

          {/* 4 Quantitative Astrometric Metric Badges */}
          <div className="sqi-badges-grid">
            <div className="astrometric-badge">
              <span className="badge-k">SKY BRIGHTNESS</span>
              <span className="badge-v">{telemetry.dynamicMpsas}</span>
              <span className="badge-unit">mag / arcsec²</span>
            </div>

            <div className="astrometric-badge">
              <span className="badge-k">LIMITING MAG (NELM)</span>
              <span className="badge-v">{telemetry.dynamicNelm}m</span>
              <span className="badge-unit">naked-eye limit</span>
            </div>

            <div className="astrometric-badge">
              <span className="badge-k">PICKERING SEEING</span>
              <span className="badge-v">{telemetry.pickering} / 10</span>
              <span className="badge-unit">atmospheric stability</span>
            </div>

            <div className="astrometric-badge">
              <span className="badge-k">STELLAR FWHM</span>
              <span className="badge-v">{telemetry.fwhm}&Prime;</span>
              <span className="badge-unit">angular resolution</span>
            </div>
          </div>
        </div>

        {/* Right Column: Celestial Context & Site Coordinates */}
        <div className="sqi-celestial-col">
          {/* Site Telemetry Card */}
          <div className="site-dossier-card">
            <div className="dossier-header-tag">ACTIVE GROUND SITE DOSSIER</div>
            <h4 className="site-name-display">{activeSite.name}</h4>
            <div className="site-meta-line">
              <span>{activeSite.region}</span>
              <span>&bull;</span>
              <span>Elevation: {activeSite.elevation}</span>
            </div>
            <div className="site-coords-pill">COORDINATES: {activeSite.coords}</div>
            <p className="site-baseline-note">{activeSite.notes}</p>
          </div>

          {/* Lunar & Solar Interference Status */}
          <div className="sky-illumination-card">
            <div className="dossier-header-tag">CELESTIAL ILLUMINATION &amp; TWILIGHT</div>
            <div className="illumination-rows">
              <div className="illum-row">
                <span className="illum-k">SUN ELEVATION:</span>
                <span className="illum-v">{telemetry.sunAngle}° ({telemetry.twilightStatus})</span>
              </div>
              <div className="illum-row">
                <span className="illum-k">LUNAR PHASE:</span>
                <span className="illum-v">{telemetry.moonPhaseName} ({telemetry.moonIllumination}% illuminated)</span>
              </div>
              <div className="illum-row">
                <span className="illum-k">MOON INTERFERENCE:</span>
                <span className="illum-v" style={{ color: telemetry.moonIsUp ? '#f59e0b' : '#10b981' }}>
                  {telemetry.moonIsUp ? 'MOON ABOVE HORIZON (SKY-GLOW ACTIVE)' : 'MOON BELOW HORIZON (ZERO WASHOUT)'}
                </span>
              </div>
              <div className="illum-row">
                <span className="illum-k">TELEMETRY TIMESTAMP:</span>
                <span className="illum-v">{telemetry.localTimeString} LOCAL &bull; {telemetry.utcString}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scoped CSS Stylesheet */}
      <style>{`
        .sky-quality-widget {
          background: linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(11, 17, 32, 0.98));
          border: 1px solid rgba(56, 189, 248, 0.35);
          border-radius: var(--radius-lg, 12px);
          overflow: hidden;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7), 0 0 24px rgba(56, 189, 248, 0.12);
          margin-bottom: var(--space-3xl, 3rem);
          width: 100%;
          box-sizing: border-box;
        }

        /* Header Bar */
        .sqi-header-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: rgba(15, 23, 42, 0.85);
          border-bottom: 1px solid rgba(148, 163, 184, 0.18);
        }

        .sqi-brand-group {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
        }

        .live-pulse-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(56, 189, 248, 0.12);
          color: #38bdf8;
          border: 1px solid #38bdf8;
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.22rem 0.55rem;
          border-radius: 4px;
          letter-spacing: 0.08em;
        }

        .pulse-circle {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #38bdf8;
          box-shadow: 0 0 8px #38bdf8;
          animation: pulseGlow 1.6s infinite ease-in-out;
        }

        .pulse-circle.refreshing {
          background: #f59e0b;
          box-shadow: 0 0 12px #f59e0b;
        }

        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.8); opacity: 0.4; }
        }

        .sqi-title-meta {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .sqi-main-title {
          font-family: var(--font-mono, monospace);
          font-size: 0.85rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          letter-spacing: 0.06em;
        }

        .sqi-sub-title {
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          color: #38bdf8;
          letter-spacing: 0.08em;
        }

        .btn-refresh-telemetry {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(30, 41, 59, 0.8);
          color: #cbd5e1;
          border: 1px solid rgba(148, 163, 184, 0.3);
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.45rem 0.85rem;
          border-radius: 6px;
          cursor: pointer;
          letter-spacing: 0.06em;
          transition: all 0.2s ease;
        }

        .btn-refresh-telemetry:hover {
          background: rgba(56, 189, 248, 0.15);
          border-color: #38bdf8;
          color: #ffffff;
        }

        .refresh-icon.spin {
          animation: spin360 0.6s linear infinite;
        }

        @keyframes spin360 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Controls Row */
        .sqi-controls-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.85rem 1.5rem;
          background: rgba(11, 17, 32, 0.8);
          border-bottom: 1px solid rgba(148, 163, 184, 0.12);
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .control-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }

        .chips-list {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .site-chip, .time-chip {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.22);
          color: #94a3b8;
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.3rem 0.65rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .site-chip:hover, .time-chip:hover {
          color: #ffffff;
          border-color: #38bdf8;
        }

        .site-chip.active, .time-chip.active {
          background: rgba(56, 189, 248, 0.2);
          border-color: #38bdf8;
          color: #38bdf8;
          font-weight: 700;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.25);
        }

        /* Main Grid */
        .sqi-content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          padding: 1.5rem;
        }

        @media (min-width: 900px) {
          .sqi-content-grid {
            grid-template-columns: 1.15fr 0.85fr;
            align-items: stretch;
          }
        }

        /* Metrics Column */
        .sqi-metrics-col {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .seeing-verdict-card {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(56, 189, 248, 0.4);
          border-radius: 8px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .verdict-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .verdict-tag {
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.1em;
        }

        .verdict-pill {
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.2rem 0.6rem;
          border: 1px solid currentColor;
          border-radius: 4px;
          letter-spacing: 0.08em;
        }

        .bortle-hero-value {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .bortle-num {
          font-family: var(--font-display, sans-serif);
          font-size: 1.85rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }

        .bortle-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.7rem;
          font-weight: 700;
          color: #38bdf8;
          letter-spacing: 0.08em;
        }

        /* Meter Bar */
        .bortle-meter-wrap {
          width: 100%;
          height: 8px;
          background: rgba(30, 41, 59, 0.8);
          border-radius: 4px;
          overflow: hidden;
        }

        .bortle-meter-fill {
          height: 100%;
          transition: width 0.4s ease, background-color 0.4s ease;
          border-radius: 4px;
        }

        .bortle-meter-scale {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono, monospace);
          font-size: 0.58rem;
          color: #64748b;
        }

        .seeing-recommendation-text {
          font-size: 0.85rem;
          line-height: 1.5;
          color: #cbd5e1;
          margin: 0;
          padding-top: 0.5rem;
          border-top: 1px dashed rgba(148, 163, 184, 0.18);
        }

        /* Astrometric Badges Grid */
        .sqi-badges-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .astrometric-badge {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 6px;
          padding: 0.75rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .badge-k {
          font-family: var(--font-mono, monospace);
          font-size: 0.58rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.06em;
        }

        .badge-v {
          font-family: var(--font-mono, monospace);
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffffff;
        }

        .badge-unit {
          font-family: var(--font-mono, monospace);
          font-size: 0.58rem;
          color: #38bdf8;
        }

        /* Celestial Column */
        .sqi-celestial-col {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .site-dossier-card, .sky-illumination-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 8px;
          padding: 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .dossier-header-tag {
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          font-weight: 800;
          color: #f59e0b;
          letter-spacing: 0.08em;
        }

        .site-name-display {
          font-family: var(--font-display, sans-serif);
          font-size: 1.15rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .site-meta-line {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          color: #94a3b8;
          flex-wrap: wrap;
        }

        .site-coords-pill {
          display: inline-block;
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.25);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          width: fit-content;
        }

        .site-baseline-note {
          font-size: 0.8rem;
          line-height: 1.5;
          color: #cbd5e1;
          margin: 0;
        }

        .illumination-rows {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .illum-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          padding-bottom: 0.35rem;
        }

        .illum-k {
          color: #94a3b8;
          font-weight: 600;
        }

        .illum-v {
          color: #ffffff;
          text-align: right;
          font-weight: 700;
        }

        @media (max-width: 640px) {
          .sqi-header-bar, .sqi-controls-row {
            padding: 0.85rem 1rem;
          }
          .sqi-content-grid {
            padding: 1rem;
            gap: 1rem;
          }
          .sqi-badges-grid {
            grid-template-columns: 1fr;
          }
          .bortle-num {
            font-size: 1.45rem;
          }
          .illum-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .illum-v {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}
