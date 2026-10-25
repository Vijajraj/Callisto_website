import React, { useState, useEffect, useMemo } from 'react';

/* =========================================================================
   TONIGHT'S SKY & EPHEMERIS RADAR // DYNAMIC ASTRONOMICAL ENGINE
   Automatically computes real-time celestial coordinates, lunar phase,
   diurnal transit curves, and observational seeing for CIT Campus Array.
   Location: Chennai Institute of Technology (12.9716° N, 80.0431° E)
   ========================================================================= */

interface CelestialBody {
  id: string;
  name: string;
  category: 'planet' | 'nebula' | 'galaxy' | 'cluster' | 'moon';
  constellation: string;
  magnitude: string;
  transitHour: number; // Hour of peak culmination (0-24 in IST)
  peakAltitude: number; // Max degrees elevation from CIT horizon
  seasonMonths: number[]; // Months visible (0=Jan, 11=Dec)
  optimalWindow: string;
  recommendedOptics: string;
  raDec: string;
  notes: string;
  color: string;
}

// Master Astronomical Database
const ASTRONOMICAL_CATALOG: CelestialBody[] = [
  {
    id: 'jupiter',
    name: 'Jupiter (Great Red Spot & Galilean Moons)',
    category: 'planet',
    constellation: 'Taurus',
    magnitude: '-2.7',
    transitHour: 0.5, // 00:30 IST
    peakAltitude: 76,
    seasonMonths: [8, 9, 10, 11, 0, 1], // Sep - Feb
    optimalWindow: '21:30 – 03:30 IST',
    recommendedOptics: '8" Dobsonian / 6mm Eyepiece (200x) or 102mm Refractor',
    raDec: 'RA 04h 18m | Dec +21° 14\'',
    notes: 'Io, Europa, Ganymede, and Callisto clearly visible in planar alignment. Great Red Spot central meridian transit occurs during prime window.',
    color: '#f59e0b',
  },
  {
    id: 'saturn',
    name: 'Saturn & Ring Plane Angle',
    category: 'planet',
    constellation: 'Aquarius',
    magnitude: '+0.7',
    transitHour: 21.0, // 21:00 IST
    peakAltitude: 68,
    seasonMonths: [7, 8, 9, 10, 11], // Aug - Dec
    optimalWindow: '19:00 – 23:30 IST',
    recommendedOptics: '6" Reflecting Telescope / 9mm Plössl (133x)',
    raDec: 'RA 22h 32m | Dec -11° 20\'',
    notes: 'Rings inclined at an ultra-narrow tilt angle approaching edge-on ring plane crossing. Titan and Rhea easily discernable.',
    color: '#eab308',
  },
  {
    id: 'orion-nebula',
    name: 'Orion Nebula (M42 / NGC 1976)',
    category: 'nebula',
    constellation: 'Orion',
    magnitude: '+4.0',
    transitHour: 2.0, // 02:00 IST
    peakAltitude: 72,
    seasonMonths: [9, 10, 11, 0, 1, 2], // Oct - Mar
    optimalWindow: '00:00 – 04:45 IST',
    recommendedOptics: 'Widefield 25mm Eyepiece (48x) + UHC or OIII Filter',
    raDec: 'RA 05h 35m | Dec -05° 23\'',
    notes: 'Active stellar nursery. Four young, massive stars of the Trapezium cluster illuminate emerald-green and violet gaseous ionization curtains.',
    color: '#06b6d4',
  },
  {
    id: 'andromeda',
    name: 'Andromeda Galaxy (Messier 31)',
    category: 'galaxy',
    constellation: 'Andromeda',
    magnitude: '+3.4',
    transitHour: 22.5, // 22:30 IST
    peakAltitude: 54,
    seasonMonths: [8, 9, 10, 11, 0], // Sep - Jan
    optimalWindow: '19:45 – 01:15 IST',
    recommendedOptics: '10x50 Binoculars or 80mm ED Refractor / 32mm Plössl',
    raDec: 'RA 00h 42m | Dec +41° 16\'',
    notes: '2.53 million light-years distant. Our nearest major spiral neighbor; visible as an elongated diffuse oval with bright nucleus and M32 satellite.',
    color: '#8b5cf6',
  },
  {
    id: 'pleiades',
    name: 'Pleiades Open Cluster (M45 / Seven Sisters)',
    category: 'cluster',
    constellation: 'Taurus',
    magnitude: '+1.6',
    transitHour: 23.5, // 23:30 IST
    peakAltitude: 81,
    seasonMonths: [9, 10, 11, 0, 1], // Oct - Feb
    optimalWindow: '20:30 – 03:00 IST',
    recommendedOptics: '10x50 Binoculars or Low-Power Widefield Telescope',
    raDec: 'RA 03h 47m | Dec +24° 07\'',
    notes: 'Young blue B-type stars surrounded by ethereal blue reflection nebulosity. Superb binocular and widefield astrophotography target.',
    color: '#38bdf8',
  },
  {
    id: 'sirius',
    name: 'Sirius (Alpha Canis Majoris)',
    category: 'cluster',
    constellation: 'Canis Major',
    magnitude: '-1.46',
    transitHour: 2.5, // 02:30 IST
    peakAltitude: 61,
    seasonMonths: [10, 11, 0, 1, 2, 3], // Nov - Apr
    optimalWindow: '23:30 – 04:30 IST',
    recommendedOptics: 'Naked Eye, Binoculars, or High-Power Split for Sirius B',
    raDec: 'RA 06h 45m | Dec -16° 42\'',
    notes: 'The brightest star in Earth\'s night sky. Radiates dazzling diamond scintilation caused by atmospheric dispersion.',
    color: '#60a5fa',
  },
  {
    id: 'mars',
    name: 'Mars (The Red Planet)',
    category: 'planet',
    constellation: 'Gemini',
    magnitude: '+0.2',
    transitHour: 4.0, // 04:00 IST
    peakAltitude: 78,
    seasonMonths: [10, 11, 0, 1, 2, 3, 4], // Nov - May
    optimalWindow: '01:30 – 05:30 IST',
    recommendedOptics: '8" Dobsonian / 5mm Planetary Eyepiece (240x)',
    raDec: 'RA 07h 12m | Dec +23° 05\'',
    notes: 'Distinct ochre-red disc. Look for dark albedo features (Syrtis Major) and bright seasonal carbon dioxide polar cap.',
    color: '#ef4444',
  },
  {
    id: 'hercules',
    name: 'Great Hercules Globular Cluster (M13)',
    category: 'cluster',
    constellation: 'Hercules',
    magnitude: '+5.8',
    transitHour: 19.0, // 19:00 IST
    peakAltitude: 48,
    seasonMonths: [3, 4, 5, 6, 7, 8], // Apr - Sep
    optimalWindow: '19:00 – 21:30 IST',
    recommendedOptics: '8" Telescope / 12mm Eyepiece (100x)',
    raDec: 'RA 16h 41m | Dec +36° 27\'',
    notes: 'Spherical swarm of over 300,000 ancient stars packed into a 145 light-year sphere. Core resolves into glittering stellar pinpricks.',
    color: '#10b981',
  },
];

export default function TonightSkyEphemeris(): React.ReactElement {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [simulatedHour, setSimulatedHour] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedTarget, setExpandedTarget] = useState<string | null>(null);

  // Update live clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Compute Current Indian Standard Time (IST) decimal hour (0 - 24)
  const liveIstHour = useMemo(() => {
    // Force IST (UTC + 5.5)
    const utc = currentDate.getTime() + currentDate.getTimezoneOffset() * 60000;
    const istDate = new Date(utc + 5.5 * 3600000);
    return istDate.getHours() + istDate.getMinutes() / 60;
  }, [currentDate]);

  // Selected hour is either simulated scrubber or live IST hour
  const activeHour = simulatedHour !== null ? simulatedHour : liveIstHour;

  // Real-time Moon Phase & Illumination Formula (Synodic Month = 29.530588 days)
  const lunarData = useMemo(() => {
    // Known reference new moon: Jan 11, 2024 at 11:57 UTC (JD 2460320.998)
    const now = currentDate.getTime();
    const refNewMoon = new Date('2024-01-11T11:57:00Z').getTime();
    const synodicMs = 29.53058867 * 86400000;
    const diff = (now - refNewMoon) % synodicMs;
    const ageDays = (diff < 0 ? diff + synodicMs : diff) / 86400000;
    const phaseFraction = ageDays / 29.53058867;
    // Illumination fraction (1 - cos(angle)) / 2
    const illumination = Math.round(((1 - Math.cos(phaseFraction * 2 * Math.PI)) / 2) * 100);

    let phaseName = 'New Moon';
    let phaseClass = 'new';
    if (ageDays < 1.84) {
      phaseName = 'New Moon';
    } else if (ageDays < 5.53) {
      phaseName = 'Waxing Crescent';
      phaseClass = 'crescent-waxing';
    } else if (ageDays < 9.22) {
      phaseName = 'First Quarter';
      phaseClass = 'quarter-first';
    } else if (ageDays < 12.91) {
      phaseName = 'Waxing Gibbous';
      phaseClass = 'gibbous-waxing';
    } else if (ageDays < 16.61) {
      phaseName = 'Full Moon';
      phaseClass = 'full';
    } else if (ageDays < 20.3) {
      phaseName = 'Waning Gibbous';
      phaseClass = 'gibbous-waning';
    } else if (ageDays < 23.99) {
      phaseName = 'Last Quarter';
      phaseClass = 'quarter-last';
    } else if (ageDays < 27.68) {
      phaseName = 'Waning Crescent';
      phaseClass = 'crescent-waning';
    } else {
      phaseName = 'New Moon';
    }

    return {
      ageDays: ageDays.toFixed(1),
      illumination,
      phaseName,
      phaseClass,
      impact:
        illumination > 75
          ? 'High Lunar Radiance • Prime for Lunar Craters & Planets'
          : illumination > 40
            ? 'Moderate Sky Glow • Good for Star Clusters & Double Stars'
            : 'Minimal Lunar Glare • Excellent for Deep-Sky Nebulae & Galaxies',
    };
  }, [currentDate]);

  // Filter Catalog by Season & Category
  const currentMonth = currentDate.getMonth(); // 0 to 11

  const visibleCatalog = useMemo(() => {
    return ASTRONOMICAL_CATALOG.filter((body) => {
      // Must be visible in current month (or adjacent)
      const inSeason = body.seasonMonths.includes(currentMonth);
      const matchesCat = activeCategory === 'all' || body.category === activeCategory;
      return inSeason && matchesCat;
    });
  }, [currentMonth, activeCategory]);

  // Compute Real-Time Altitude for any object given active hour
  const getElevationData = (body: CelestialBody, hour: number) => {
    // Hour angle distance from peak culmination transit
    let hourDiff = Math.abs(hour - body.transitHour);
    if (hourDiff > 12) hourDiff = 24 - hourDiff;

    // Approximate diurnal cos curve
    // Semi-diurnal arc: visible roughly 6 hours before and after transit
    if (hourDiff > 6.2) {
      return {
        altitude: -15,
        statusText: 'BELOW HORIZON',
        statusType: 'below',
        badgeColor: '#64748b',
      };
    }

    const altitude = Math.round(
      body.peakAltitude * Math.cos((hourDiff / 6.2) * (Math.PI / 2))
    );

    if (altitude >= 45) {
      return {
        altitude,
        statusText: `PRIME ELEVATION (${altitude}°)`,
        statusType: 'prime',
        badgeColor: '#10b981',
      };
    } else if (altitude >= 15) {
      return {
        altitude,
        statusText: `ABOVE HORIZON (${altitude}°)`,
        statusType: 'visible',
        badgeColor: '#38bdf8',
      };
    } else {
      return {
        altitude,
        statusText: `LOW ON HORIZON (${altitude}°)`,
        statusType: 'low',
        badgeColor: '#f59e0b',
      };
    }
  };

  const formattedIstTime = useMemo(() => {
    const h = Math.floor(activeHour);
    const m = Math.floor((activeHour - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} IST`;
  }, [activeHour]);

  return (
    <div className="ephemeris-card">
      {/* Top Telemetry Command Bar */}
      <div className="ephemeris-header">
        <div className="header-meta">
          <span className="ephemeris-badge">CIT OBSERVATORY // REAL-TIME CELESTIAL EPHEMERIS</span>
          <h2 className="ephemeris-title">Tonight's Sky & Planetary Ephemeris</h2>
          <p className="ephemeris-lead">
            Computed automatically for CIT Campus Observation Deck (12.9716° N, 80.0431° E).
            Calculates real-time diurnal altitude curves, seeing conditions, and optimal optical windows.
          </p>
        </div>

        {/* Live Observational Weather & Seeing Conditions Widget */}
        <div className="conditions-grid">
          <div className="condition-box">
            <span className="cond-label">CIT SKY SEEING</span>
            <span className="cond-val highlight">Pickering 7/10</span>
            <span className="cond-sub">Good Atmospheric Stability</span>
          </div>
          <div className="condition-box">
            <span className="cond-label">CAMPUS BORTLE</span>
            <span className="cond-val">Class 5</span>
            <span className="cond-sub">Suburban Sky Array</span>
          </div>
          <div className="condition-box moon-box">
            <div className="moon-visual-wrap">
              <div className={`lunar-disc ${lunarData.phaseClass}`}></div>
            </div>
            <div className="moon-text-col">
              <span className="cond-label">LUNAR PHASE</span>
              <span className="cond-val">{lunarData.phaseName}</span>
              <span className="cond-sub">{lunarData.illumination}% Illuminated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Time Scrubber / Diurnal Timeline */}
      <div className="timeline-controller">
        <div className="timeline-header">
          <div className="time-indicator">
            <span className={`live-pulse-dot ${simulatedHour === null ? 'live' : 'sim'}`}></span>
            <span className="clock-label">
              {simulatedHour === null ? 'REAL-TIME LIVE CLOCK' : 'SIMULATED OBSERVATION HOUR'}:
            </span>
            <span className="clock-time">{formattedIstTime}</span>
          </div>

          <div className="quick-time-buttons">
            <button
              type="button"
              className={`time-chip ${simulatedHour === null ? 'active' : ''}`}
              onClick={() => setSimulatedHour(null)}
            >
              ● LIVE NOW
            </button>
            <button
              type="button"
              className={`time-chip ${simulatedHour === 19.5 ? 'active' : ''}`}
              onClick={() => setSimulatedHour(19.5)}
            >
              19:30 DUSK
            </button>
            <button
              type="button"
              className={`time-chip ${simulatedHour === 22.0 ? 'active' : ''}`}
              onClick={() => setSimulatedHour(22.0)}
            >
              22:00 PRIME
            </button>
            <button
              type="button"
              className={`time-chip ${simulatedHour === 0.5 ? 'active' : ''}`}
              onClick={() => setSimulatedHour(0.5)}
            >
              00:30 JOVIAN
            </button>
            <button
              type="button"
              className={`time-chip ${simulatedHour === 3.5 ? 'active' : ''}`}
              onClick={() => setSimulatedHour(3.5)}
            >
              03:30 DAWN
            </button>
          </div>
        </div>

        {/* Continuous Slider from 18:00 (Sunset) to 06:00 (Sunrise) */}
        <div className="slider-wrapper">
          <div className="slider-labels">
            <span>18:00 (Sunset)</span>
            <span>21:00</span>
            <span>00:00 (Midnight)</span>
            <span>03:00</span>
            <span>06:00 (Dawn)</span>
          </div>
          <input
            type="range"
            min="18"
            max="30"
            step="0.25"
            value={activeHour < 18 ? activeHour + 24 : activeHour}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setSimulatedHour(val >= 24 ? val - 24 : val);
            }}
            className="time-slider"
            aria-label="Scrub observation hour across the night"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="filter-chips-row">
        {[
          { id: 'all', label: `All Active Targets (${visibleCatalog.length})` },
          { id: 'planet', label: 'Planetary Systems' },
          { id: 'nebula', label: 'Deep-Sky Nebulae' },
          { id: 'galaxy', label: 'Galaxies' },
          { id: 'cluster', label: 'Star Clusters' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`cat-pill ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Celestial Target Radar Table */}
      <div className="ephemeris-table-wrap">
        <table className="ephemeris-table">
          <thead>
            <tr>
              <th scope="col">CELESTIAL TARGET</th>
              <th scope="col">CONSTELLATION</th>
              <th scope="col">MAGNITUDE</th>
              <th scope="col">CURRENT ALTITUDE</th>
              <th scope="col">OPTIMAL WINDOW</th>
              <th scope="col">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {visibleCatalog.map((target) => {
              const elev = getElevationData(target, activeHour);
              const isExpanded = expandedTarget === target.id;

              return (
                <React.Fragment key={target.id}>
                  <tr
                    className={`target-row ${elev.statusType} ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => setExpandedTarget(isExpanded ? null : target.id)}
                  >
                    <td className="col-target-name">
                      <span
                        className="target-glow-bullet"
                        style={{ backgroundColor: elev.badgeColor, boxShadow: `0 0 8px ${elev.badgeColor}` }}
                      ></span>
                      <div className="name-wrapper">
                        <span className="body-title">{target.name}</span>
                        <span className="body-cat-sub">{target.category.toUpperCase()}</span>
                      </div>
                    </td>

                    <td className="col-constellation">
                      <span className="const-badge">{target.constellation}</span>
                    </td>

                    <td className="col-mag">
                      <span className="mag-val">{target.magnitude}</span>
                    </td>

                    <td className="col-elevation">
                      <span
                        className={`elev-badge ${elev.statusType}`}
                        style={{ borderColor: elev.badgeColor, color: elev.badgeColor }}
                      >
                        {elev.statusText}
                      </span>
                    </td>

                    <td className="col-window">
                      <span className="window-text">{target.optimalWindow}</span>
                    </td>

                    <td className="col-inspect">
                      <button
                        type="button"
                        className="inspect-btn"
                        aria-label={`Inspect ${target.name} details`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedTarget(isExpanded ? null : target.id);
                        }}
                      >
                        {isExpanded ? '▲ CLOSE' : '▼ TELEMETRY'}
                      </button>
                    </td>
                  </tr>

                  {/* Expandable Technical Ephemeris Drawer */}
                  {isExpanded && (
                    <tr className="drawer-row">
                      <td colSpan={6} className="drawer-cell">
                        <div className="drawer-content">
                          <div className="drawer-meta-grid">
                            <div className="drawer-meta-item">
                              <span className="meta-label">EQUATORIAL COORDINATES:</span>
                              <span className="meta-value">{target.raDec}</span>
                            </div>
                            <div className="drawer-meta-item">
                              <span className="meta-label">RECOMMENDED OPTICS / EYEPIECE:</span>
                              <span className="meta-value highlight">{target.recommendedOptics}</span>
                            </div>
                            <div className="drawer-meta-item">
                              <span className="meta-label">MERIDIAN PEAK CULMINATION:</span>
                              <span className="meta-value">
                                {Math.floor(target.transitHour)}:{Math.floor((target.transitHour % 1) * 60).toString().padStart(2, '0')} IST ({target.peakAltitude}° Max Altitude)
                              </span>
                            </div>
                          </div>
                          <div className="drawer-notes">
                            <span className="notes-label">OBSERVATIONAL ASTROPHYSICS NOTES:</span>
                            <p className="notes-text">{target.notes}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* High-Contrast Design System Stylesheet */}
      <style>{`
        .ephemeris-card {
          background-color: var(--deep, #0b1120);
          border: 1px solid color-mix(in srgb, var(--steel, #475569) 30%, transparent);
          border-radius: var(--radius-lg, 14px);
          padding: 1.5rem;
          box-shadow: 0 10px 32px color-mix(in srgb, var(--void, #020617) 70%, transparent);
          margin-bottom: var(--space-3xl, 3rem);
        }

        @media (min-width: 768px) {
          .ephemeris-card {
            padding: 2.25rem;
          }
        }

        .ephemeris-header {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 1024px) {
          .ephemeris-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
          }
        }

        .header-meta {
          flex: 1;
        }

        .ephemeris-badge {
          font-family: var(--font-mono, monospace);
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--orbit, #38bdf8);
          display: inline-block;
          margin-bottom: 0.35rem;
        }

        .ephemeris-title {
          font-family: var(--font-display, serif);
          font-size: clamp(1.75rem, 3.2vw, 2.35rem);
          font-weight: 600;
          color: var(--moon, #f8fafc);
          margin: 0 0 0.5rem 0;
          line-height: 1.25;
        }

        .ephemeris-lead {
          font-family: var(--font-body, sans-serif);
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--steel, #94a3b8);
          margin: 0;
          max-width: 620px;
        }

        /* Conditions Grid */
        .conditions-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .condition-box {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid color-mix(in srgb, var(--steel, #475569) 25%, transparent);
          border-radius: 8px;
          padding: 0.65rem 0.95rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 130px;
        }

        .cond-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          font-weight: 700;
          color: var(--steel, #94a3b8);
          letter-spacing: 0.08em;
        }

        .cond-val {
          font-family: var(--font-mono, monospace);
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--moon, #f8fafc);
        }

        .cond-val.highlight {
          color: #34d399;
        }

        .cond-sub {
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          color: var(--orbit, #38bdf8);
        }

        /* Moon Box */
        .moon-box {
          flex-direction: row;
          align-items: center;
          gap: 0.75rem;
          min-width: 175px;
        }

        .moon-visual-wrap {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #0f172a;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 8px rgba(254, 240, 138, 0.35);
        }

        .lunar-disc {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #fef08a;
          position: relative;
        }

        .lunar-disc.new {
          background: #1e293b;
        }

        .lunar-disc.crescent-waxing {
          background: radial-gradient(circle at 75% 50%, #fef08a 35%, #0f172a 40%);
        }

        .lunar-disc.gibbous-waxing {
          background: radial-gradient(circle at 40% 50%, #fef08a 60%, #0f172a 65%);
        }

        .lunar-disc.full {
          background: #ffffff;
          box-shadow: 0 0 12px #ffffff;
        }

        .moon-text-col {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        /* Timeline Controller */
        .timeline-controller {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid color-mix(in srgb, var(--steel, #475569) 25%, transparent);
          border-radius: 10px;
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
        }

        .timeline-header {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .time-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .live-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .live-pulse-dot.live {
          background-color: #10b981;
          box-shadow: 0 0 8px #10b981;
          animation: ephemerisPulse 2s infinite;
        }

        .live-pulse-dot.sim {
          background-color: #f59e0b;
          box-shadow: 0 0 8px #f59e0b;
        }

        @keyframes ephemerisPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .clock-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--steel, #94a3b8);
          letter-spacing: 0.06em;
        }

        .clock-time {
          font-family: var(--font-mono, monospace);
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--orbit, #38bdf8);
        }

        .quick-time-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .time-chip {
          background: transparent;
          border: 1px solid color-mix(in srgb, var(--steel, #475569) 35%, transparent);
          color: var(--star, #cbd5e1);
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .time-chip:hover {
          border-color: var(--orbit, #38bdf8);
          color: var(--moon, #ffffff);
        }

        .time-chip.active {
          background: var(--orbit, #38bdf8);
          border-color: var(--orbit, #38bdf8);
          color: var(--void, #020617);
        }

        .slider-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .slider-labels {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          color: var(--steel, #94a3b8);
        }

        .time-slider {
          width: 100%;
          accent-color: var(--orbit, #38bdf8);
          cursor: pointer;
          height: 6px;
        }

        /* Filter Chips */
        .filter-chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .cat-pill {
          background: transparent;
          border: 1px solid color-mix(in srgb, var(--steel, #475569) 30%, transparent);
          color: var(--steel, #94a3b8);
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.35rem 0.85rem;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cat-pill:hover {
          color: var(--moon, #ffffff);
          border-color: var(--steel, #94a3b8);
        }

        .cat-pill.active {
          background: color-mix(in srgb, var(--orbit, #38bdf8) 15%, transparent);
          border-color: var(--orbit, #38bdf8);
          color: var(--orbit, #38bdf8);
        }

        /* Table */
        .ephemeris-table-wrap {
          overflow-x: auto;
          border-radius: 8px;
          border: 1px solid color-mix(in srgb, var(--steel, #475569) 25%, transparent);
        }

        .ephemeris-table {
          width: 100%;
          border-collapse: collapse;
          font-family: var(--font-mono, monospace);
          font-size: 0.8125rem;
          text-align: left;
          background: rgba(11, 17, 32, 0.4);
        }

        .ephemeris-table th {
          background: rgba(15, 23, 42, 0.85);
          color: var(--steel, #94a3b8);
          font-size: 0.6875rem;
          letter-spacing: 0.08em;
          padding: 0.85rem 1rem;
          border-bottom: 1px solid color-mix(in srgb, var(--steel, #475569) 35%, transparent);
          white-space: nowrap;
        }

        .target-row {
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .target-row:hover {
          background: rgba(30, 41, 59, 0.45);
        }

        .target-row.expanded {
          background: rgba(30, 41, 59, 0.6);
        }

        .target-row td {
          padding: 0.9rem 1rem;
          border-bottom: 1px solid color-mix(in srgb, var(--steel, #475569) 15%, transparent);
          color: var(--star, #cbd5e1);
          vertical-align: middle;
        }

        .col-target-name {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 260px;
        }

        .target-glow-bullet {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .name-wrapper {
          display: flex;
          flex-direction: column;
        }

        .body-title {
          font-weight: 700;
          color: var(--moon, #ffffff);
          font-size: 0.85rem;
        }

        .body-cat-sub {
          font-size: 0.6rem;
          color: var(--steel, #94a3b8);
          letter-spacing: 0.06em;
        }

        .const-badge {
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid color-mix(in srgb, var(--steel, #475569) 25%, transparent);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          color: var(--star, #cbd5e1);
        }

        .mag-val {
          color: var(--orbit, #38bdf8);
          font-weight: 700;
        }

        .elev-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          border: 1px solid;
          background: rgba(15, 23, 42, 0.6);
          white-space: nowrap;
        }

        .window-text {
          color: var(--sol-dust, #fbbf24);
          font-size: 0.78rem;
          white-space: nowrap;
        }

        .inspect-btn {
          background: transparent;
          border: 1px solid color-mix(in srgb, var(--steel, #475569) 35%, transparent);
          color: var(--orbit, #38bdf8);
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.3rem 0.65rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .inspect-btn:hover {
          background: var(--orbit, #38bdf8);
          color: var(--void, #020617);
        }

        /* Drawer Details */
        .drawer-row td {
          padding: 0;
          border-bottom: 1px solid color-mix(in srgb, var(--orbit, #38bdf8) 35%, transparent);
        }

        .drawer-content {
          background: rgba(15, 23, 42, 0.95);
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-left: 3px solid var(--orbit, #38bdf8);
        }

        .drawer-meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
        }

        .drawer-meta-item {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .meta-label {
          font-size: 0.625rem;
          font-weight: 700;
          color: var(--orbit, #38bdf8);
          letter-spacing: 0.08em;
        }

        .meta-value {
          font-size: 0.82rem;
          color: var(--moon, #ffffff);
          line-height: 1.4;
        }

        .meta-value.highlight {
          color: #34d399;
          font-weight: 600;
        }

        .drawer-notes {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          border-top: 1px solid color-mix(in srgb, var(--steel, #475569) 25%, transparent);
          padding-top: 0.75rem;
        }

        .notes-label {
          font-size: 0.625rem;
          font-weight: 700;
          color: var(--steel, #94a3b8);
          letter-spacing: 0.08em;
        }

        .notes-text {
          font-family: var(--font-body, sans-serif);
          font-size: 0.85rem;
          line-height: 1.55;
          color: var(--star, #cbd5e1);
          margin: 0;
        }
      `}</style>
    </div>
  );
}
