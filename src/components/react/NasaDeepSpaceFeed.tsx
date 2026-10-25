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

import React, { useState, useRef, useCallback } from 'react';

/* =========================================================================
   CALLISTO DEEP SPACE OBSERVATORY & COSMIC ARCHIVE
   High-resolution deep-space mission discoveries, multi-spectral filters,
   and interactive optical inspection loupe.
   100% self-contained, offline-resilient, zero credentials or tokens required.
   ========================================================================= */

interface CosmicDispatch {
  id: string;
  title: string;
  mission: string;
  instrument: string;
  category: 'jwst' | 'jovian' | 'deepsky' | 'solar';
  categoryLabel: string;
  date: string;
  distance: string;
  coordinates: string;
  spectralBand: string;
  explanation: string;
  url: string;
  hdurl: string;
  credit: string;
  citation: string;
  icon: string;
}

const COSMIC_DISPATCHES: CosmicDispatch[] = [
  {
    id: 'pillars',
    title: 'Pillars of Creation in the Eagle Nebula (Messier 16)',
    mission: 'James Webb Space Telescope (JWST)',
    instrument: 'NIRCam (Near-Infrared Camera)',
    category: 'jwst',
    categoryLabel: 'JWST INFRARED',
    date: '2022-10-19',
    distance: '6,500 Light-Years (2,000 Parsecs)',
    coordinates: 'RA 18h 18m 48s | Dec -13° 49′ 00″',
    spectralBand: '0.9 – 4.4 µm Near-Infrared',
    explanation:
      'Towering columns of cool molecular hydrogen gas and semi-transparent cosmic dust in the Serpens constellation. Penetrating near-infrared wavelengths unveil newly formed protostars blazing like ruby embers as gravitational collapse triggers thermonuclear fusion within the finger-like evaporating gaseous globules (EGGs).',
    url: '/nasa/pillars-creation.svg',
    hdurl: '/nasa/pillars-creation.svg',
    credit: 'NASA, ESA, CSA, STScI // JWST Science Team',
    citation: 'NASA/ESA/CSA (2022). JWST NIRCam Observation of M16: Protostellar Genesis in the Eagle Nebula.',
    icon: '/icons/icon-pillars.jpg',
  },
  {
    id: 'jupiter',
    title: 'The Great Red Spot & Swirling Jovian Storm Belts',
    mission: 'NASA Juno Deep-Space Orbiter',
    instrument: 'JunoCam Multispectral Imager',
    category: 'jovian',
    categoryLabel: 'JOVIAN SYSTEM',
    date: '2019-07-11',
    distance: '628 Million km (4.20 AU from Earth)',
    coordinates: 'System III Longitude: 130°W | Lat: 22°S',
    spectralBand: 'Visible RGB & 889nm Methane Absorption',
    explanation:
      'Captured during Juno\'s low-altitude perijove flyby over Jupiter\'s cloud tops. The Great Red Spot is an anticyclonic storm system over 16,000 kilometers in diameter—large enough to engulf Earth. Winds at the outer perimeter exceed 430 km/h, flanked by chaotic ammonia-water updrafts and cyclonic white ovals.',
    url: '/nasa/jupiter-storm.svg',
    hdurl: '/nasa/jupiter-storm.svg',
    credit: 'NASA / JPL-Caltech / SwRI / MSSS / CIT Astrophysics',
    citation: 'NASA/JPL (2019). JunoCam Perijove Composite: Atmospheric Dynamics of Jupiter’s South Equatorial Belt.',
    icon: '/icons/icon-storm.jpg',
  },
  {
    id: 'smacs0723',
    title: 'Webb\'s First Deep Field: Galaxy Cluster SMACS 0723',
    mission: 'James Webb Space Telescope (JWST)',
    instrument: 'NIRCam High-Resolution Composite',
    category: 'jwst',
    categoryLabel: 'DEEP UNIVERSE',
    date: '2022-07-12',
    distance: '4.6 Billion LY (Foreground Cluster) • 13.1 Billion LY (Arcs)',
    coordinates: 'RA 07h 23m 19s | Dec -73° 27′ 15″',
    spectralBand: '0.9 to 4.4 µm (6-Filter NIRCam Mosaic)',
    explanation:
      'The deepest and sharpest infrared survey of the early universe in astronomical history. The massive gravitational field of galaxy cluster SMACS 0723 acts as a natural cosmic magnifying glass, bending and magnifying spacetime light paths from ancient background galaxies that emitted their photons over 13.1 billion years ago.',
    url: '/nasa/smacs-deepfield.svg',
    hdurl: '/nasa/smacs-deepfield.svg',
    credit: 'NASA, ESA, CSA, STScI // Webb First Observations',
    citation: 'NASA/STScI (2022). JWST Deep Field SMACS 0723: Relativistic Gravitational Lensing of Primordial Galaxies.',
    icon: '/icons/icon-deepfield.jpg',
  },
  {
    id: 'saturn',
    title: 'Saturn\'s Rings in Infrared & Titan Transit',
    mission: 'James Webb Space Telescope (JWST)',
    instrument: 'NIRCam Narrowband Filter F323N',
    category: 'jovian',
    categoryLabel: 'RING SYSTEMS',
    date: '2023-07-05',
    distance: '1.43 Billion km (9.58 AU from Earth)',
    coordinates: 'RA 22h 32m 00s | Dec -11° 20′ 00″',
    spectralBand: '3.23 µm Methane Gas Absorption Filter',
    explanation:
      'At 3.23 microns, methane gas in Saturn’s atmosphere absorbs nearly all incident solar radiation, rendering the planetary sphere extraordinarily dark. Meanwhile, the icy ring system—composed of 99% pure water ice boulders and pebbles—lacks methane and shines with intense infrared luminescence, bifurcated by the dark Cassini Division.',
    url: '/nasa/saturn-rings.svg',
    hdurl: '/nasa/saturn-rings.svg',
    credit: 'NASA, ESA, CSA, STScI, M. Tiscareno (SETI Institute)',
    citation: 'JWST NIRCam Team (2023). Methane Absorption Observation of Saturnian Ring Particulates and Titan.',
    icon: '/icons/icon-saturn.jpg',
  },
  {
    id: 'carina',
    title: 'Cosmic Cliffs of the Carina Nebula (NGC 3324)',
    mission: 'James Webb Space Telescope (JWST)',
    instrument: 'NIRCam & MIRI Multiwavelength Composite',
    category: 'jwst',
    categoryLabel: 'JWST INFRARED',
    date: '2022-07-12',
    distance: '7,600 Light-Years (2,330 Parsecs)',
    coordinates: 'RA 10h 37m 20s | Dec -58° 38′ 30″',
    spectralBand: 'Near-IR & Mid-IR (0.9 – 18.0 µm)',
    explanation:
      'A canyon-like boundary of a giant gaseous cavity within NGC 3324, carved out by intense ultraviolet radiation and fierce stellar winds emanated by extremely massive, hot young stars located above the frame. Protostellar jets emerge like incandescent spikes from the dense amber dust wall.',
    url: '/nasa/carina-nebula.svg',
    hdurl: '/nasa/carina-nebula.svg',
    credit: 'NASA, ESA, CSA, STScI // NIRCam Science Archive',
    citation: 'NASA/STScI (2022). Cosmic Cliffs in NGC 3324: Photoevaporation and Protostellar Jets in the Carina Complex.',
    icon: '/icons/icon-nebula.jpg',
  },
  {
    id: 'andromeda',
    title: 'Core Bulge of the Andromeda Galaxy (Messier 31)',
    mission: 'Hubble & Spitzer Deep Space Reconnaissance',
    instrument: 'Wide Field Camera 3 (WFC3) & IRAC',
    category: 'deepsky',
    categoryLabel: 'SPIRAL GALAXIES',
    date: '2023-11-08',
    distance: '2.537 Million Light-Years (778 Kiloparsecs)',
    coordinates: 'RA 00h 42m 44s | Dec +41° 16′ 09″',
    spectralBand: 'Multiwavelength Optical, UV & Infrared',
    explanation:
      'Our giant sister spiral galaxy spanning over 220,000 light-years across. Its brilliant galactic nucleus harbors a 140-million-solar-mass supermassive black hole enveloped by an eccentric stellar disk of ancient yellow stars, wrapped in interwoven dust extinction lanes and blue OB star clusters.',
    url: '/nasa/andromeda-core.svg',
    hdurl: '/nasa/andromeda-core.svg',
    credit: 'NASA / ESA / STScI / CIT Deep Sky Survey Cohort',
    citation: 'Hubble Heritage (2023). Messier 31 High-Density Optical Bulge and Dust Extinction Profiles.',
    icon: '/icons/icon-andromeda.jpg',
  },
  {
    id: 'io',
    title: 'Io: Volcanic Caldrons & Loki Patera Plumes',
    mission: 'NASA Juno Orbiter // Close Flyby 57',
    instrument: 'JunoCam Optical & JIRAM Infrared',
    category: 'jovian',
    categoryLabel: 'JOVIAN SYSTEM',
    date: '2024-01-03',
    distance: '628 Million km (1,500 km Altitude Flyby)',
    coordinates: 'Sub-Jovian Hemisphere | Pele Caldera',
    spectralBand: '0.48 – 0.88 µm Optical & 4.8 µm Thermal IR',
    explanation:
      'The most geologically active and volcanic celestial body in our solar system. Locked in an orbital Laplace resonance with Europa and Ganymede, tidal gravitational flexure generates continuous internal magma oceans. Plumes of sulfur dioxide erupt hundreds of kilometers into the vacuum of space from the glowing caldera of Loki Patera.',
    url: '/nasa/io-volcano.svg',
    hdurl: '/nasa/io-volcano.svg',
    credit: 'NASA / JPL-Caltech / SwRI / ASI / INAF',
    citation: 'NASA/JPL Juno Mission (2024). High-Resolution Imaging of Active Magma Lakes and Plumes on Io.',
    icon: '/icons/icon-volcano.jpg',
  },
  {
    id: 'blackhole',
    title: 'Event Horizon of Sagittarius A* (Milky Way Core)',
    mission: 'Event Horizon Telescope (EHT) Global VLBI',
    instrument: 'Global Millimeter Array Interferometer',
    category: 'deepsky',
    categoryLabel: 'RELATIVISTIC ASTROPHYSICS',
    date: '2022-05-12',
    distance: '26,670 Light-Years (8,180 Parsecs)',
    coordinates: 'RA 17h 45m 40s | Dec -29° 00′ 28″',
    spectralBand: '1.3 mm Submillimeter (230 GHz Radio Waves)',
    explanation:
      'Direct radio-interferometric visualization of the supermassive black hole at the center of our Milky Way galaxy. The dark central shadow represents the event horizon—the boundary beyond which nothing, not even light, can escape—encircled by a brilliant photon ring composed of synchrotron plasma orbiting at relativistic speeds.',
    url: '/nasa/blackhole-sgra.svg',
    hdurl: '/nasa/blackhole-sgra.svg',
    credit: 'Event Horizon Telescope Collaboration // EHT Science Team',
    citation: 'EHT Collaboration (2022). First Sagittarius A* Event Horizon Imaging: General Relativity in Strong Field Limits.',
    icon: '/icons/icon-blackhole.jpg',
  },
];

type SpectralFilter = 'optical' | 'infrared' | 'halpha' | 'enhanced';

export default function NasaDeepSpaceFeed(): React.ReactElement {
  const [currentDispatch, setCurrentDispatch] = useState<CosmicDispatch>(COSMIC_DISPATCHES[0]);
  const [activeFilter, setActiveFilter] = useState<SpectralFilter>('optical');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  // Optical Magnifier / Loupe Inspection State
  const [loupeActive, setLoupeActive] = useState<boolean>(false);
  const [loupePos, setLoupePos] = useState<{ x: number; y: number; pctX: number; pctY: number }>({
    x: 0,
    y: 0,
    pctX: 50,
    pctY: 50,
  });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Handle Mouse Hover Loupe
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pctX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const pctY = Math.max(0, Math.min(100, (y / rect.height) * 100));
    setLoupePos({ x, y, pctX, pctY });
  }, []);

  // Handle Touch Screen Loupe (Mobile / Tablet compatibility)
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const pctX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const pctY = Math.max(0, Math.min(100, (y / rect.height) * 100));
    setLoupePos({ x, y, pctX, pctY });
  }, []);

  // Filter Categories
  const filteredDispatches =
    activeCategory === 'all'
      ? COSMIC_DISPATCHES
      : COSMIC_DISPATCHES.filter((d) => d.category === activeCategory);

  // Handle Random Cosmic Dispatch
  const handleRandomDispatch = () => {
    const remaining = COSMIC_DISPATCHES.filter((d) => d.id !== currentDispatch.id);
    const randomItem = remaining[Math.floor(Math.random() * remaining.length)];
    setCurrentDispatch(randomItem);
  };

  // Copy Citation to Clipboard
  const handleCopyCitation = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(currentDispatch.citation);
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2500);
    }
  };

  // Get CSS Filter based on Spectral Mode
  const getFilterStyle = (): string => {
    switch (activeFilter) {
      case 'infrared':
        return 'contrast(125%) saturate(160%) hue-rotate(-20deg) brightness(105%)';
      case 'halpha':
        return 'contrast(140%) saturate(180%) hue-rotate(330deg) drop-shadow(0 0 8px rgba(239,68,68,0.35))';
      case 'enhanced':
        return 'contrast(150%) brightness(115%) saturate(135%)';
      case 'optical':
      default:
        return 'none';
    }
  };

  return (
    <div className="observatory-feed-card">
      {/* Header Bar */}
      <div className="feed-header-bar">
        <div className="brand-left">
          <span className="brand-badge">CALLISTO OBSERVATORY</span>
          <span className="brand-title">DEEP SPACE DISCOVERY & ASTROPHYSICS ARCHIVE</span>
        </div>
        <div className="status-right">
          <span className="status-pill online">
            <span className="pulse-dot"></span>
            CIT DEEP SKY ARCHIVE // FULL RESOLUTION
          </span>
          <span className="station-badge">STATION: CIT-OBSERVATORY // CHENNAI</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="feed-content-grid">
        {/* Left Column: Interactive Multi-Spectral Viewport */}
        <div className="media-column">
          {/* Spectral Filter Controls Strip */}
          <div className="spectral-bar">
            <span className="spectral-label">SPECTRAL BAND:</span>
            <div className="spectral-buttons">
              {[
                { id: 'optical', label: 'VIS (OPTICAL)' },
                { id: 'infrared', label: 'NIR (INFRARED)' },
                { id: 'halpha', label: 'H-ALPHA (EMISSION)' },
                { id: 'enhanced', label: 'HIGH-CONTRAST' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`spectral-btn ${activeFilter === f.id ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f.id as SpectralFilter)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image Viewport with Optical Loupe Inspection */}
          <div
            ref={imageContainerRef}
            className="viewport-wrapper"
            onMouseEnter={() => setLoupeActive(true)}
            onMouseLeave={() => setLoupeActive(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={(e) => {
              setLoupeActive(true);
              handleTouchMove(e);
            }}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => setLoupeActive(false)}
            onClick={() => setLightboxOpen(true)}
            title="Click for Fullscreen HD Observation"
          >
            <img
              src={currentDispatch.url}
              alt={currentDispatch.title}
              className="viewport-img"
              style={{ filter: getFilterStyle() }}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/logo.png';
              }}
            />

            {/* Interactive Optical Magnifier Loupe */}
            {loupeActive && (
              <div
                className="optical-loupe"
                style={{
                  left: `${loupePos.x}px`,
                  top: `${loupePos.y}px`,
                  backgroundImage: `url(${currentDispatch.hdurl})`,
                  backgroundPosition: `${loupePos.pctX}% ${loupePos.pctY}%`,
                  backgroundSize: '260%',
                  filter: getFilterStyle(),
                }}
              >
                <div className="loupe-reticle">
                  <span className="reticle-line vert"></span>
                  <span className="reticle-line horiz"></span>
                  <span className="reticle-label">2.5× OPTICAL ZOOM</span>
                </div>
              </div>
            )}

            {/* Hover Scrim Hint */}
            <div className="viewport-scrim">
              <span className="scrim-icon">
                <img src="/icons/icon-loupe.jpg" alt="" width="18" height="18" style={{ borderRadius: '3px', verticalAlign: 'middle' }} />
              </span>
              <span className="scrim-text">Click to Inspect in Fullscreen HD</span>
            </div>
          </div>

          {/* Curated Iconic Expeditions Quick-Discovery Pills */}
          <div className="expeditions-bar">
            <div className="expeditions-header">
              <span className="expeditions-title">CURATED EXPEDITIONS // QUICK DISCOVERY:</span>
              <button
                type="button"
                className="random-discovery-btn"
                onClick={handleRandomDispatch}
                title="Explore a random cosmic dispatch"
              >
                <img src="/icons/icon-random.jpg" alt="" width="14" height="14" style={{ borderRadius: '3px', objectFit: 'cover' }} />
                <span>RANDOM EXPEDITION</span>
              </button>
            </div>

            <div className="pills-scroll-row">
              {COSMIC_DISPATCHES.map((item) => {
                const isSelected = currentDispatch.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`expedition-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => setCurrentDispatch(item)}
                  >
                    <span className="chip-icon">
                      <img src={item.icon} alt="" width="16" height="16" style={{ borderRadius: '3px', objectFit: 'cover', display: 'block' }} />
                    </span>
                    <span className="chip-name">{item.title.split(':')[0].split('(')[0].trim()}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Scientific Telemetry & Metadata */}
        <div className="metadata-column">
          <div className="meta-card">
            {/* Top Meta Badges */}
            <div className="meta-top-strip">
              <span className="meta-category">{currentDispatch.categoryLabel}</span>
              <span className="meta-date">EPOCH: {currentDispatch.date}</span>
            </div>

            {/* Object Title */}
            <h3 className="object-title">{currentDispatch.title}</h3>

            {/* Astrophysical Telemetry Chip Grid */}
            <div className="telemetry-grid">
              <div className="telemetry-chip">
                <span className="chip-label">OBSERVATORY // PLATFORM:</span>
                <span className="chip-val highlight">{currentDispatch.mission}</span>
              </div>
              <div className="telemetry-chip">
                <span className="chip-label">INSTRUMENT:</span>
                <span className="chip-val">{currentDispatch.instrument}</span>
              </div>
              <div className="telemetry-chip">
                <span className="chip-label">LIGHT TRAVEL DISTANCE:</span>
                <span className="chip-val">{currentDispatch.distance}</span>
              </div>
              <div className="telemetry-chip">
                <span className="chip-label">EQUATORIAL COORDINATES:</span>
                <span className="chip-val mono">{currentDispatch.coordinates}</span>
              </div>
            </div>

            {/* Scientific Explanation */}
            <div className="explanation-wrap">
              <span className="explanation-heading">ASTROPHYSICAL ANNOTATION (CIT RESEARCH COHORT):</span>
              <p className="explanation-prose">{currentDispatch.explanation}</p>
            </div>

            {/* Action Buttons */}
            <div className="actions-strip">
              <a
                href={currentDispatch.hdurl}
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn primary"
              >
                <span>OPEN FULL HD ASSET</span>
                <span className="arrow">↗</span>
              </a>

              <button
                type="button"
                className={`action-btn secondary ${copiedCitation ? 'copied' : ''}`}
                onClick={handleCopyCitation}
              >
                {copiedCitation ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>✓ CITATION COPIED</span>
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <img src="/icons/icon-cite.jpg" alt="" width="14" height="14" style={{ borderRadius: '2px', objectFit: 'cover' }} />
                    <span>CITE DISPATCH</span>
                  </span>
                )}
              </button>
            </div>

            {/* Scientific Credits */}
            <div className="credit-footer">
              <span className="credit-text">Source: {currentDispatch.credit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close fullscreen view"
            >
              ✕
            </button>
            <img
              src={currentDispatch.hdurl}
              alt={currentDispatch.title}
              className="lightbox-img"
              style={{ filter: getFilterStyle() }}
            />
            <div className="lightbox-footer">
              <h4>{currentDispatch.title}</h4>
              <p>
                {currentDispatch.mission} • {currentDispatch.date} • {currentDispatch.distance}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* High-Contrast Responsive Stylesheet */}
      <style>{`
        .observatory-feed-card {
          background-color: var(--surface, #0c121e);
          border: 1px solid color-mix(in srgb, var(--border, #334155) 45%, transparent);
          border-radius: var(--radius-lg, 14px);
          overflow: hidden;
          box-shadow: 0 10px 32px rgba(2, 6, 23, 0.6);
          margin-bottom: var(--space-3xl, 3rem);
        }

        .feed-header-bar {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: rgba(15, 23, 42, 0.7);
          border-bottom: 1px solid color-mix(in srgb, var(--border, #334155) 40%, transparent);
        }

        .brand-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .brand-badge {
          background: #ef4444;
          color: #ffffff;
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.25rem 0.55rem;
          border-radius: 4px;
          letter-spacing: 0.08em;
        }

        .brand-title {
          font-family: var(--font-mono, monospace);
          font-size: 0.82rem;
          font-weight: 700;
          color: #e2e8f0;
          letter-spacing: 0.06em;
        }

        .status-right {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .status-pill {
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.22rem 0.6rem;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
        }

        .status-pill.online {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.35);
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 6px currentColor;
        }

        .station-badge {
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.25);
          padding: 0.22rem 0.55rem;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        /* Content Grid */
        .feed-content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          padding: 1.5rem;
        }

        @media (min-width: 1024px) {
          .feed-content-grid {
            grid-template-columns: 1fr 1fr;
            padding: 1.75rem;
          }
        }

        .media-column {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        /* Spectral Bar */
        .spectral-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(51, 65, 85, 0.4);
          border-radius: 6px;
          padding: 0.4rem 0.75rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .spectral-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.08em;
        }

        .spectral-buttons {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
        }

        .spectral-btn {
          background: transparent;
          border: 1px solid rgba(51, 65, 85, 0.5);
          color: #94a3b8;
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .spectral-btn:hover {
          color: #ffffff;
          border-color: #38bdf8;
        }

        .spectral-btn.active {
          background: #38bdf8;
          color: #020617;
          border-color: #38bdf8;
          font-weight: 700;
        }

        /* Viewport */
        .viewport-wrapper {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background: #000000;
          aspect-ratio: 16 / 10;
          cursor: crosshair;
          border: 1px solid rgba(51, 65, 85, 0.5);
        }

        .viewport-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: filter 0.3s ease;
        }

        /* Optical Loupe */
        .optical-loupe {
          position: absolute;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          border: 2px solid #38bdf8;
          box-shadow: 0 0 16px rgba(56, 189, 248, 0.6), inset 0 0 10px rgba(0, 0, 0, 0.8);
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 10;
          background-repeat: no-repeat;
          overflow: hidden;
        }

        .loupe-reticle {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .reticle-line {
          position: absolute;
          background: rgba(56, 189, 248, 0.5);
        }

        .reticle-line.vert {
          width: 1px;
          height: 100%;
          left: 50%;
          top: 0;
        }

        .reticle-line.horiz {
          height: 1px;
          width: 100%;
          top: 50%;
          left: 0;
        }

        .reticle-label {
          position: absolute;
          bottom: 8px;
          left: 0;
          right: 0;
          text-align: center;
          font-family: var(--font-mono, monospace);
          font-size: 0.55rem;
          font-weight: 800;
          color: #38bdf8;
          letter-spacing: 0.05em;
          background: rgba(2, 6, 23, 0.7);
          padding: 1px 0;
        }

        /* Scrim Hint */
        .viewport-scrim {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(2, 6, 23, 0.8);
          border: 1px solid rgba(51, 65, 85, 0.6);
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          pointer-events: none;
        }

        .scrim-icon {
          font-size: 0.75rem;
        }

        .scrim-text {
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          font-weight: 600;
          color: #38bdf8;
        }

        /* Expeditions Bar */
        .expeditions-bar {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(51, 65, 85, 0.35);
          border-radius: 6px;
          padding: 0.75rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .expeditions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .expeditions-title {
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.08em;
        }

        .random-discovery-btn {
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.35);
          color: #fbbf24;
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .random-discovery-btn:hover {
          background: #f59e0b;
          color: #020617;
        }

        .pills-scroll-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .expedition-chip {
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(56, 189, 248, 0.25);
          color: #cbd5e1;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .expedition-chip:hover {
          border-color: #38bdf8;
          color: #ffffff;
          background: rgba(56, 189, 248, 0.15);
          transform: translateY(-1px);
        }

        .expedition-chip.active {
          background: #38bdf8;
          color: #030712;
          border-color: #38bdf8;
          font-weight: 700;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.35);
        }

        .chip-icon {
          font-size: 0.75rem;
        }

        /* Metadata Column */
        .metadata-column {
          display: flex;
          flex-direction: column;
        }

        .meta-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(51, 65, 85, 0.4);
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          height: 100%;
        }

        .meta-top-strip {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
        }

        .meta-category {
          color: #38bdf8;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .meta-date {
          color: #94a3b8;
        }

        .object-title {
          font-family: var(--font-display, serif);
          font-size: 1.45rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          line-height: 1.3;
        }

        /* Telemetry Grid */
        .telemetry-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          background: rgba(2, 6, 23, 0.4);
          border: 1px solid rgba(51, 65, 85, 0.3);
          border-radius: 6px;
          padding: 0.85rem;
        }

        .telemetry-chip {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .chip-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.58rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.06em;
        }

        .chip-val {
          font-family: var(--font-mono, monospace);
          font-size: 0.78rem;
          font-weight: 600;
          color: #e2e8f0;
          line-height: 1.3;
        }

        .chip-val.highlight {
          color: #38bdf8;
          font-weight: 700;
        }

        .chip-val.mono {
          font-size: 0.72rem;
          color: #cbd5e1;
        }

        /* Explanation */
        .explanation-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .explanation-heading {
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          font-weight: 700;
          color: #38bdf8;
          letter-spacing: 0.06em;
        }

        .explanation-prose {
          font-family: var(--font-body, sans-serif);
          font-size: 0.85rem;
          line-height: 1.6;
          color: #cbd5e1;
          margin: 0;
          max-height: 180px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        /* Actions */
        .actions-strip {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-top: auto;
          padding-top: 0.5rem;
        }

        .action-btn {
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.55rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .action-btn.primary {
          background: #38bdf8;
          color: #020617;
          border: 1px solid #38bdf8;
        }

        .action-btn.primary:hover {
          background: #7dd3fc;
          box-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
        }

        .action-btn.secondary {
          background: transparent;
          border: 1px solid rgba(148, 163, 184, 0.35);
          color: #cbd5e1;
        }

        .action-btn.secondary:hover {
          border-color: #38bdf8;
          color: #ffffff;
        }

        .action-btn.secondary.copied {
          border-color: #34d399;
          color: #34d399;
          background: rgba(16, 185, 129, 0.1);
        }

        .credit-footer {
          border-top: 1px solid rgba(51, 65, 85, 0.3);
          padding-top: 0.5rem;
        }

        .credit-text {
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          color: #64748b;
        }

        /* Lightbox */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.92);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .lightbox-content {
          position: relative;
          max-width: 1100px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          background: #0b1120;
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          overflow: hidden;
        }

        .lightbox-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .lightbox-img {
          max-width: 100%;
          max-height: 75vh;
          object-fit: contain;
          background: #000;
        }

        .lightbox-footer {
          padding: 0.85rem 1.25rem;
          background: rgba(15, 23, 42, 0.9);
          border-top: 1px solid rgba(51, 65, 85, 0.4);
        }

        .lightbox-footer h4 {
          margin: 0 0 0.25rem 0;
          color: #ffffff;
          font-family: var(--font-display, serif);
          font-size: 1.1rem;
        }

        .lightbox-footer p {
          margin: 0;
          font-family: var(--font-mono, monospace);
          font-size: 0.7rem;
          color: #94a3b8;
        }

        /* Responsive Mobile Breakpoints */
        @media (max-width: 768px) {
          .feed-content-grid {
            padding: 1rem;
            gap: 1.25rem;
          }
          .feed-header-bar {
            padding: 0.85rem 1rem;
          }
          .object-title {
            font-size: 1.25rem;
          }
          .meta-card {
            padding: 1.15rem;
          }
        }

        @media (max-width: 640px) {
          .feed-header-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .brand-left {
            gap: 0.5rem;
          }
          .optical-loupe {
            width: 105px;
            height: 105px;
          }
          .spectral-bar {
            flex-direction: column;
            align-items: flex-start;
          }
          .spectral-buttons {
            width: 100%;
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 0.25rem;
            -webkit-overflow-scrolling: touch;
          }
          .telemetry-grid {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          .actions-strip {
            flex-direction: column;
          }
          .action-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
