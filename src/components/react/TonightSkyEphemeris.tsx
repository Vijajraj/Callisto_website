/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

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
import {
  CIT_COORDINATES,
  getJulianDate,
  getLocalSiderealTime,
  equatorialToHorizontal,
  calculateCelestialTransits,
  calculateLunarEphemeris,
  calculatePlanetaryCoordinates,
} from '../../lib/astronomy';

/* =========================================================================
   TONIGHT'S SKY & CELESTIAL EPHEMERIS ENGINE
   Genuine real-time celestial mechanics powered by Jean Meeus spherical
   astronomy algorithms, Local Sidereal Time (LST), and Keplerian elements.
   Includes complete Solar System (Moon, Venus, Mars, Jupiter, Saturn, Uranus, Neptune)
   and iconic telescopic Deep-Sky objects, Nebulae, Clusters, and Binary Stars.
   Location: Chennai Institute of Technology (CIT)
   Coordinates: +12.9716° N, +80.0431° E
   ========================================================================= */

interface BaseCatalogItem {
  id: string;
  name: string;
  category: 'solarsystem' | 'nebula' | 'galaxy' | 'cluster' | 'doublestar';
  categoryLabel: string;
  fixedRaHours?: number; // For non-planetary targets
  fixedDecDeg?: number;
  fixedConstell?: string;
  fixedMag?: string;
  recommendedOptics: string;
  notes: string;
  color: string;
}

const MASTER_ASTRONOMICAL_CATALOG: BaseCatalogItem[] = [
  // --- SOLAR SYSTEM & PLANETARY TARGETS ---
  {
    id: 'moon',
    name: 'The Moon (Luna)',
    category: 'solarsystem',
    categoryLabel: 'EARTH MOON',
    recommendedOptics: 'Neutral Density Moon Filter + 12mm to 25mm Eyepiece (48x – 100x)',
    notes: 'Examine shadow contrast along the day/night terminator. Craters Tycho, Copernicus, Kepler, and the towering Montes Apenninus mountain range stand out in sharp relief.',
    color: '#fef08a',
  },
  {
    id: 'jupiter',
    name: 'Jupiter & Galilean Ocean Moons',
    category: 'solarsystem',
    categoryLabel: 'GAS GIANT',
    recommendedOptics: '8" Dobsonian / 6mm Eyepiece (200x) or 102mm Refractor',
    notes: 'Io, Europa, Ganymede, and Callisto form a sharp linear orbital plane. Watch for Great Red Spot transits and black shadow transits cast by the moons across Jovian cloud belts.',
    color: '#f59e0b',
  },
  {
    id: 'saturn',
    name: 'Saturn & Ring Plane Angle',
    category: 'solarsystem',
    categoryLabel: 'RINGED PLANET',
    recommendedOptics: '6" Reflecting Telescope / 9mm Plössl (133x)',
    notes: 'Ring system tilted at an ultra-narrow angle approaching edge-on crossing. Dark Cassini Division separates A and B rings; giant moon Titan resolved like a golden beacon.',
    color: '#eab308',
  },
  {
    id: 'venus',
    name: 'Venus (Evening / Morning Star)',
    category: 'solarsystem',
    categoryLabel: 'INFERIOR PLANET',
    recommendedOptics: 'Variable Polarizing Filter / 9mm Eyepiece (133x)',
    notes: 'Dazzling planetary body displaying dramatic crescent phases like a miniature moon. Thick sulfurous clouds reflect over 70% of incident sunlight.',
    color: '#fde047',
  },
  {
    id: 'mars',
    name: 'Mars (The Red Planet)',
    category: 'solarsystem',
    categoryLabel: 'TERRESTRIAL PLANET',
    recommendedOptics: '8" Dobsonian / 5mm Planetary Eyepiece (240x) + Red/Orange Filter',
    notes: 'Distinct ochre-red disc. Look for dark albedo features (Syrtis Major, Sinus Sabaeus) and the bright reflective seasonal polar ice cap during meridian culmination.',
    color: '#ef4444',
  },
  {
    id: 'uranus',
    name: 'Uranus (Cyan Ice Giant)',
    category: 'solarsystem',
    categoryLabel: 'ICE GIANT',
    recommendedOptics: '8" Telescope / 6mm Eyepiece (200x)',
    notes: 'Seventh planet from the Sun; 2.8 billion km distant. Appears through telescopes as a distinct, unmistakable pale turquoise-cyan planetary disk.',
    color: '#22d3ee',
  },
  {
    id: 'neptune',
    name: 'Neptune & Triton',
    category: 'solarsystem',
    categoryLabel: 'ICE GIANT',
    recommendedOptics: '8"–10" Telescope / High Power 250x',
    notes: 'Outermost major planet at 4.4 billion km. High-power magnification reveals a tiny deep azure-blue disc; retrograde moon Triton visible in dark skies.',
    color: '#3b82f6',
  },
  {
    id: 'mercury',
    name: 'Mercury (Innermost World)',
    category: 'solarsystem',
    categoryLabel: 'INNER PLANET',
    recommendedOptics: '80mm–102mm Refractor / 100x magnification',
    notes: 'Telescopic challenge nestled low in evening or morning twilight. Shows crescent and gibbous phases; cratered surface obscured by thick atmospheric dispersion.',
    color: '#94a3b8',
  },

  // --- ICONIC DEEP-SKY NEBULAE ---
  {
    id: 'orion-nebula',
    name: 'Orion Nebula (M42 / NGC 1976)',
    category: 'nebula',
    categoryLabel: 'EMISSION NEBULA',
    fixedRaHours: 5.588, // 05h 35m 17s
    fixedDecDeg: -5.388, // -05° 23′ 28″
    fixedConstell: 'Orion',
    fixedMag: '+4.0',
    recommendedOptics: 'Widefield 25mm Eyepiece (48x) + UHC or OIII Narrowband Filter',
    notes: 'Active stellar nursery 1,344 light-years distant. Four massive young O-type stars of the central Trapezium Cluster ignite emerald and violet gas curtains.',
    color: '#06b6d4',
  },
  {
    id: 'ring-nebula',
    name: 'Ring Nebula (Messier 57)',
    category: 'nebula',
    categoryLabel: 'PLANETARY NEBULA',
    fixedRaHours: 18.893, // 18h 53m 35s
    fixedDecDeg: 33.029, // +33° 01′ 45″
    fixedConstell: 'Lyra',
    fixedMag: '+8.8',
    recommendedOptics: '8" Reflecting Telescope / 9mm Eyepiece (133x) + OIII Filter',
    notes: 'The celestial smoke ring in Lyra. Expanding luminous gas shell blown off by a dying Sun-like star 20,000 years ago; tiny white dwarf core remains at center.',
    color: '#10b981',
  },
  {
    id: 'dumbbell-nebula',
    name: 'Dumbbell Nebula (Messier 27)',
    category: 'nebula',
    categoryLabel: 'PLANETARY NEBULA',
    fixedRaHours: 19.993, // 19h 59m 36s
    fixedDecDeg: 22.721, // +22° 43′ 16″
    fixedConstell: 'Vulpecula',
    fixedMag: '+7.4',
    recommendedOptics: 'Widefield 20mm Eyepiece (60x) + UHC Filter',
    notes: 'The first planetary nebula ever discovered (Charles Messier, 1764). Displays a bright, distinct hourglass or apple-core emission profile.',
    color: '#14b8a6',
  },
  {
    id: 'crab-nebula',
    name: 'Crab Nebula (M1 / Supernova Remnant)',
    category: 'nebula',
    categoryLabel: 'SUPERNOVA REMNANT',
    fixedRaHours: 5.575, // 05h 34m 31s
    fixedDecDeg: 22.014, // +22° 00′ 52″
    fixedConstell: 'Taurus',
    fixedMag: '+8.4',
    recommendedOptics: '8" Reflecting Telescope + OIII Filter / 12mm Plössl (100x)',
    notes: 'Expanding debris cloud of the historical supernova witnessed in 1054 AD. Houses a spinning neutron star (pulsar) rotating 30.2 times per second.',
    color: '#ec4899',
  },

  // --- GALAXIES & STAR CLUSTERS ---
  {
    id: 'andromeda',
    name: 'Andromeda Galaxy (Messier 31)',
    category: 'galaxy',
    categoryLabel: 'SPIRAL GALAXY',
    fixedRaHours: 0.712, // 00h 42m 44s
    fixedDecDeg: 41.269, // +41° 16′ 09″
    fixedConstell: 'Andromeda',
    fixedMag: '+3.4',
    recommendedOptics: '10x50 Binoculars or 80mm ED Refractor / 32mm Plössl Widefield',
    notes: '2.53 million light-years away. Our giant sister spiral galaxy; spans over 3 degrees across the sky with visible dust lanes and satellite dwarf M32.',
    color: '#8b5cf6',
  },
  {
    id: 'pleiades',
    name: 'Pleiades Open Cluster (M45 / Seven Sisters)',
    category: 'cluster',
    categoryLabel: 'OPEN STAR CLUSTER',
    fixedRaHours: 3.791, // 03h 47m 24s
    fixedDecDeg: 24.105, // +24° 07′ 00″
    fixedConstell: 'Taurus',
    fixedMag: '+1.6',
    recommendedOptics: '10x50 Binoculars or Low-Power Widefield Refractor (30x)',
    notes: 'Luminous cluster of over 1,000 hot blue B-type stars enveloped in ethereal reflection nebulosity, passing nearly overhead from Chennai\'s latitude.',
    color: '#38bdf8',
  },
  {
    id: 'hercules',
    name: 'Great Hercules Globular Cluster (Messier 13)',
    category: 'cluster',
    categoryLabel: 'GLOBULAR CLUSTER',
    fixedRaHours: 16.695, // 16h 41m 41s
    fixedDecDeg: 36.460, // +36° 27′ 37″
    fixedConstell: 'Hercules',
    fixedMag: '+5.8',
    recommendedOptics: '8" Telescope / 10mm Eyepiece (120x)',
    notes: 'A swarm of over 300,000 ancient stars bound by gravity in a 145 light-year ball. Core resolves into thousands of glittering diamond pinpricks.',
    color: '#a855f7',
  },
  {
    id: 'double-cluster',
    name: 'Double Cluster in Perseus (NGC 869 & 884)',
    category: 'cluster',
    categoryLabel: 'OPEN CLUSTERS',
    fixedRaHours: 2.317, // 02h 19m 00s
    fixedDecDeg: 57.150, // +57° 09′ 00″
    fixedConstell: 'Perseus',
    fixedMag: '+3.7',
    recommendedOptics: '10x50 Binoculars or 80mm Refractor (40x Widefield)',
    notes: 'Two neighboring open star clusters side by side in the Perseus arm of the Milky Way, crowded with blue supergiant stars and ruby red giants.',
    color: '#6366f1',
  },
  {
    id: 'bodes-galaxy',
    name: 'Bode\'s & Cigar Galaxies (M81 & M82)',
    category: 'galaxy',
    categoryLabel: 'GALAXY PAIR',
    fixedRaHours: 9.926, // 09h 55m 33s
    fixedDecDeg: 69.065, // +69° 03′ 55″
    fixedConstell: 'Ursa Major',
    fixedMag: '+6.9 / +8.4',
    recommendedOptics: '8" Reflecting Telescope / 25mm Eyepiece (48x)',
    notes: 'A famous interacting galaxy pair visible in the same eyepiece field of view. M81 shows a grand spiral design while M82 is an edge-on starburst galaxy with red hydrogen jets.',
    color: '#d946ef',
  },

  // --- TELESCOPIC BINARY & DOUBLE STARS ---
  {
    id: 'albireo',
    name: 'Albireo (Beta Cygni Double Star)',
    category: 'doublestar',
    categoryLabel: 'OPTICAL BINARY',
    fixedRaHours: 19.512, // 19h 30m 43s
    fixedDecDeg: 27.959, // +27° 57′ 35″
    fixedConstell: 'Cygnus',
    fixedMag: '+3.1 / +5.1',
    recommendedOptics: 'Any Telescope or 10x50 Binoculars (30x – 60x)',
    notes: 'The most beautiful color-contrast double star in the entire night sky. Easily splits into a brilliant golden-topaz primary and an electric sapphire-blue companion.',
    color: '#f59e0b',
  },
  {
    id: 'castor',
    name: 'Castor (Alpha Geminorum Sextuple)',
    category: 'doublestar',
    categoryLabel: 'MULTIPLE STAR',
    fixedRaHours: 7.576, // 07h 34m 36s
    fixedDecDeg: 31.888, // +31° 53′ 18″
    fixedConstell: 'Gemini',
    fixedMag: '+1.9 / +3.0',
    recommendedOptics: '4"–8" Telescope / 100x – 150x magnification',
    notes: 'A classic telescope benchmark split. Two brilliant white A-type stars separated by just 5 arcseconds, part of an intricate 6-star gravitational system.',
    color: '#38bdf8',
  },
  {
    id: 'sirius',
    name: 'Sirius (Alpha Canis Majoris)',
    category: 'doublestar',
    categoryLabel: 'BINARY STAR SYSTEM',
    fixedRaHours: 6.752, // 06h 45m 09s
    fixedDecDeg: -16.716, // -16° 42′ 58″
    fixedConstell: 'Canis Major',
    fixedMag: '-1.46',
    recommendedOptics: 'Naked Eye or High-Power Telescope Split for White Dwarf Sirius B',
    notes: 'The brightest star in Earth\'s sky. Emits dazzling diamond scintilation as light refracts through atmospheric moisture columns; white dwarf companion (The Pup) nearby.',
    color: '#60a5fa',
  },
];

export default function TonightSkyEphemeris(): React.ReactElement {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [simulatedHour, setSimulatedHour] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedTarget, setExpandedTarget] = useState<string | null>(null);

  // Live Clock Ticker (updates every 15 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Compute Active Evaluation Date: either live or simulated at today's chosen IST hour
  const targetDate = useMemo(() => {
    if (simulatedHour === null) {
      return currentDate;
    }
    const d = new Date(currentDate);
    // Convert simulated IST hour to UTC
    let hour = simulatedHour;
    if (hour >= 24) hour -= 24;
    const utcHours = hour - CIT_COORDINATES.timezoneOffsetHours;
    d.setUTCHours(Math.floor(utcHours), Math.floor((utcHours % 1) * 60), 0, 0);
    return d;
  }, [currentDate, simulatedHour]);

  // Real-Time Local Sidereal Time for Chennai
  const currentLST = useMemo(() => {
    return getLocalSiderealTime(targetDate, CIT_COORDINATES.longitude);
  }, [targetDate]);

  // Julian Date
  const currentJD = useMemo(() => {
    return getJulianDate(targetDate).toFixed(3);
  }, [targetDate]);

  // Real-time Moon Phase & Coordinates Calculation
  const lunarData = useMemo(() => {
    return calculateLunarEphemeris(targetDate);
  }, [targetDate]);

  // Real-time Keplerian Planetary Coordinates
  const planetaryCoords = useMemo(() => {
    return calculatePlanetaryCoordinates(targetDate);
  }, [targetDate]);

  // Complete Computed Ephemeris Catalog
  const computedCatalog = useMemo(() => {
    return MASTER_ASTRONOMICAL_CATALOG.map((item) => {
      let raHours = 0;
      let decDeg = 0;
      let constellation = item.fixedConstell || '';
      let magnitude = item.fixedMag || '';

      if (item.id === 'moon') {
        raHours = lunarData.raHours;
        decDeg = lunarData.decDeg;
        constellation = 'Pisces / Aries';
        magnitude = `-${(10 + (lunarData.illuminationPct / 100) * 2.7).toFixed(1)}`;
      } else if (item.id === 'jupiter') {
        raHours = planetaryCoords.jupiter.raHours;
        decDeg = planetaryCoords.jupiter.decDeg;
        constellation = planetaryCoords.jupiter.constell;
        magnitude = planetaryCoords.jupiter.mag.toFixed(1);
      } else if (item.id === 'saturn') {
        raHours = planetaryCoords.saturn.raHours;
        decDeg = planetaryCoords.saturn.decDeg;
        constellation = planetaryCoords.saturn.constell;
        magnitude = `+${planetaryCoords.saturn.mag.toFixed(1)}`;
      } else if (item.id === 'venus') {
        raHours = planetaryCoords.venus.raHours;
        decDeg = planetaryCoords.venus.decDeg;
        constellation = planetaryCoords.venus.constell;
        magnitude = planetaryCoords.venus.mag.toFixed(1);
      } else if (item.id === 'mars') {
        raHours = planetaryCoords.mars.raHours;
        decDeg = planetaryCoords.mars.decDeg;
        constellation = planetaryCoords.mars.constell;
        magnitude = `+${planetaryCoords.mars.mag.toFixed(1)}`;
      } else if (item.id === 'uranus') {
        raHours = planetaryCoords.uranus.raHours;
        decDeg = planetaryCoords.uranus.decDeg;
        constellation = planetaryCoords.uranus.constell;
        magnitude = `+${planetaryCoords.uranus.mag.toFixed(1)}`;
      } else if (item.id === 'neptune') {
        raHours = planetaryCoords.neptune.raHours;
        decDeg = planetaryCoords.neptune.decDeg;
        constellation = planetaryCoords.neptune.constell;
        magnitude = `+${planetaryCoords.neptune.mag.toFixed(1)}`;
      } else if (item.id === 'mercury') {
        raHours = planetaryCoords.mercury.raHours;
        decDeg = planetaryCoords.mercury.decDeg;
        constellation = planetaryCoords.mercury.constell;
        magnitude = planetaryCoords.mercury.mag.toFixed(1);
      } else {
        raHours = item.fixedRaHours || 0;
        decDeg = item.fixedDecDeg || 0;
      }

      // Exact Spherical Astronomy: Altitude, Azimuth, Air Mass
      const horizontal = equatorialToHorizontal(
        raHours,
        decDeg,
        currentLST,
        CIT_COORDINATES.latitude
      );

      // Exact Celestial Transits: Peak Culmination, Rise, Set
      const transits = calculateCelestialTransits(
        raHours,
        decDeg,
        targetDate,
        CIT_COORDINATES.latitude,
        CIT_COORDINATES.longitude
      );

      // Formatted RA and Dec Strings
      const raH = Math.floor(raHours);
      const raM = Math.floor((raHours - raH) * 60);
      const decSign = decDeg >= 0 ? '+' : '-';
      const decAbs = Math.abs(decDeg);
      const decD = Math.floor(decAbs);
      const decM = Math.floor((decAbs - decD) * 60);
      const raDecFormatted = `RA ${raH.toString().padStart(2, '0')}h ${raM.toString().padStart(2, '0')}m | Dec ${decSign}${decD.toString().padStart(2, '0')}° ${decM.toString().padStart(2, '0')}′`;

      return {
        ...item,
        raHours,
        decDeg,
        constellation,
        magnitude,
        raDecFormatted,
        horizontal,
        transits,
      };
    });
  }, [planetaryCoords, lunarData, currentLST, targetDate]);

  // Filter Catalog
  const filteredCatalog = useMemo(() => {
    return computedCatalog.filter((item) => {
      if (activeCategory === 'all') return true;
      return item.category === activeCategory;
    });
  }, [computedCatalog, activeCategory]);

  // Formatted LST String (hh:mm:ss)
  const formattedLST = useMemo(() => {
    const h = Math.floor(currentLST);
    const m = Math.floor((currentLST - h) * 60);
    const s = Math.floor(((currentLST - h) * 60 - m) * 60);
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  }, [currentLST]);

  // Formatted IST Time
  const formattedIST = useMemo(() => {
    return targetDate.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, [targetDate]);

  return (
    <div className="ephemeris-card">
      {/* Top Telemetry Header Bar */}
      <div className="ephemeris-header">
        <div className="header-meta">
          <span className="ephemeris-badge">CIT OBSERVATORY // REAL-TIME CELESTIAL EPHEMERIS</span>
          <h2 className="ephemeris-title">Tonight's Sky & Telescope Radar</h2>
          <p className="ephemeris-lead">
            Real-time orbital tracking for the Solar System (Moon & planets), planetary nebulae, star clusters, galaxies, and binary stars from CIT Campus Observation Deck (12.9716° N, 80.0431° E).
          </p>
        </div>

        {/* Real-time Astronomical Observational Radar Conditions */}
        <div className="conditions-grid">
          <div className="condition-box">
            <span className="cond-label">LOCAL SIDEREAL TIME</span>
            <span className="cond-val highlight">{formattedLST}</span>
            <span className="cond-sub">Chennai Meridian (80.04° E)</span>
          </div>

          <div className="condition-box">
            <span className="cond-label">JULIAN EPOCH</span>
            <span className="cond-val">JD {currentJD}</span>
            <span className="cond-sub">J2000.0 Ephemeris</span>
          </div>

          <div className="condition-box moon-box">
            <div className="moon-visual-wrap">
              <div className={`lunar-disc ${lunarData.phaseClass}`}></div>
            </div>
            <div className="moon-text-col">
              <span className="cond-label">LUNAR ILLUMINATION</span>
              <span className="cond-val">{lunarData.phaseName}</span>
              <span className="cond-sub">{lunarData.illuminationPct}% • Age {lunarData.ageDays}d</span>
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
              {simulatedHour === null ? 'REAL-TIME LIVE ASTRO-CLOCK' : 'SIMULATED OBSERVATION HOUR'}:
            </span>
            <span className="clock-time">{formattedIST} IST</span>
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
              className={`time-chip ${simulatedHour === 19.0 ? 'active' : ''}`}
              onClick={() => setSimulatedHour(19.0)}
            >
              19:00 DUSK
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
            <span>00:00 (Midnight Culmination)</span>
            <span>03:00</span>
            <span>06:00 (Dawn)</span>
          </div>
          <input
            type="range"
            min="18"
            max="30"
            step="0.25"
            value={
              simulatedHour !== null
                ? simulatedHour < 18
                  ? simulatedHour + 24
                  : simulatedHour
                : (() => {
                    const h = targetDate.getHours() + targetDate.getMinutes() / 60;
                    return h < 18 ? h + 24 : h;
                  })()
            }
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
          { id: 'all', label: `All Observable Targets (${computedCatalog.length})` },
          { id: 'solarsystem', label: 'Solar System & Planets (8)' },
          { id: 'nebula', label: 'Deep-Sky Nebulae (4)' },
          { id: 'galaxy', label: 'Galaxies & Clusters (5)' },
          { id: 'doublestar', label: 'Binary & Double Stars (3)' },
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

      {/* Real-Time Celestial Target Radar Table */}
      <div className="ephemeris-table-wrap">
        <table className="ephemeris-table">
          <thead>
            <tr>
              <th scope="col">CELESTIAL TARGET</th>
              <th scope="col">CONSTELLATION</th>
              <th scope="col">MAGNITUDE</th>
              <th scope="col">REAL-TIME ALTITUDE</th>
              <th scope="col">AZIMUTH / COMPASS</th>
              <th scope="col">MERIDIAN TRANSIT</th>
              <th scope="col">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredCatalog.map((target) => {
              const isExpanded = expandedTarget === target.id;
              const alt = target.horizontal.altitudeDeg;
              const isAbove = alt > 0;
              const isPrime = alt >= 45;

              return (
                <React.Fragment key={target.id}>
                  <tr
                    className={`target-row ${isAbove ? 'visible' : 'below'} ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => setExpandedTarget(isExpanded ? null : target.id)}
                  >
                    <td className="col-target-name">
                      <span
                        className="target-glow-bullet"
                        style={{
                          backgroundColor: isPrime ? '#10b981' : isAbove ? '#38bdf8' : '#64748b',
                          boxShadow: isPrime
                            ? '0 0 8px #10b981'
                            : isAbove
                              ? '0 0 6px #38bdf8'
                              : 'none',
                        }}
                      ></span>
                      <div className="name-wrapper">
                        <span className="body-title">{target.name}</span>
                        <span className="body-cat-sub">{target.categoryLabel}</span>
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
                        className={`elev-badge ${isPrime ? 'prime' : isAbove ? 'above' : 'below'}`}
                      >
                        {isAbove ? `${alt > 0 ? '+' : ''}${alt}° (${target.horizontal.seeingQuality.toUpperCase()})` : `SUBMERGED (${alt}°)`}
                      </span>
                    </td>

                    <td className="col-azimuth">
                      <span className="azimuth-text">
                        {isAbove ? `${target.horizontal.azimuthDeg}° ${target.horizontal.compassDirection}` : '—'}
                      </span>
                    </td>

                    <td className="col-window">
                      <span className="window-text">{target.transits.transitIST}</span>
                    </td>

                    <td className="col-inspect">
                      <button
                        type="button"
                        className="inspect-btn"
                        aria-label={`Inspect ${target.name} real-time coordinates`}
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
                      <td colSpan={7} className="drawer-cell">
                        <div className="drawer-content">
                          <div className="drawer-meta-grid">
                            <div className="drawer-meta-item">
                              <span className="meta-label">EQUATORIAL COORDINATES (J2000):</span>
                              <span className="meta-value mono">{target.raDecFormatted}</span>
                            </div>

                            <div className="drawer-meta-item">
                              <span className="meta-label">TRUE ALTITUDE & AZIMUTH (CHENNAI):</span>
                              <span className="meta-value highlight">
                                Alt: {target.horizontal.altitudeDeg}° | Az: {target.horizontal.azimuthDeg}° ({target.horizontal.compassDirection})
                              </span>
                            </div>

                            <div className="drawer-meta-item">
                              <span className="meta-label">AIR MASS & OPTICAL EXTINCTION:</span>
                              <span className="meta-value">
                                {isAbove ? `${target.horizontal.airMass} Air Mass (Atmospheric Column)` : 'N/A (Below Horizon)'}
                              </span>
                            </div>

                            <div className="drawer-meta-item">
                              <span className="meta-label">TRANSIT / RISE / SET TIMES:</span>
                              <span className="meta-value">
                                Transit: {target.transits.transitIST} • Peak: +{target.transits.peakAltitudeDeg}°
                                {target.transits.riseIST ? ` • Rise: ${target.transits.riseIST} • Set: ${target.transits.setIST}` : ''}
                              </span>
                            </div>

                            <div className="drawer-meta-item">
                              <span className="meta-label">RECOMMENDED CIT OPTICS / EYEPIECE:</span>
                              <span className="meta-value highlight">{target.recommendedOptics}</span>
                            </div>
                          </div>

                          <div className="drawer-notes">
                            <span className="notes-label">TELESCOPIC OBSERVATION NOTES:</span>
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

      {/* High-Contrast Responsive Stylesheet */}
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
          min-width: 135px;
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
          color: #38bdf8;
        }

        .cond-sub {
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          color: #94a3b8;
        }

        /* Moon Box */
        .moon-box {
          flex-direction: row;
          align-items: center;
          gap: 0.75rem;
          min-width: 185px;
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
          white-space: nowrap;
        }

        .elev-badge.prime {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border-color: rgba(16, 185, 129, 0.4);
        }

        .elev-badge.above {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border-color: rgba(56, 189, 248, 0.4);
        }

        .elev-badge.below {
          background: rgba(100, 116, 139, 0.1);
          color: #94a3b8;
          border-color: rgba(100, 116, 139, 0.3);
        }

        .azimuth-text {
          font-size: 0.78rem;
          color: #cbd5e1;
          font-weight: 600;
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
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
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

        .meta-value.mono {
          font-family: var(--font-mono, monospace);
          color: #f1f5f9;
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

        /* Mobile & Tablet Responsiveness */
        @media (max-width: 768px) {
          .ephemeris-card {
            padding: 1.25rem;
          }
          .ephemeris-header {
            gap: 1.25rem;
            margin-bottom: 1.5rem;
          }
          .drawer-meta-grid {
            grid-template-columns: 1fr;
          }
          .drawer-content {
            padding: 1rem;
          }
        }

        @media (max-width: 640px) {
          .conditions-grid {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          .condition-box {
            min-width: 0;
            width: 100%;
          }
          .moon-box {
            min-width: 0;
          }
          .timeline-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .quick-time-buttons {
            width: 100%;
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 0.35rem;
            -webkit-overflow-scrolling: touch;
          }
          .filter-chips-row {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 0.35rem;
            -webkit-overflow-scrolling: touch;
          }
          .cat-pill {
            flex-shrink: 0;
            white-space: nowrap;
          }
          .time-chip {
            flex-shrink: 0;
            white-space: nowrap;
          }
          .slider-labels span:nth-child(2),
          .slider-labels span:nth-child(4) {
            display: none;
          }
          .col-target-name {
            min-width: 220px;
          }
        }
      `}</style>
    </div>
  );
}
