import React, { useState, useEffect, useCallback } from 'react';

/* =========================================================================
   NASA DEEP SPACE OBSERVATORY FEED // APOD INTEGRATION
   Powered by NASA's Open API (Goddard Space Flight Center)
   Retrieves official daily deep-space discoveries, scientific annotations,
   and historical cosmic observations.
   ========================================================================= */

const NASA_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_NASA_API_KEY) || 'DEMO_KEY';

interface ApodData {
  title: string;
  date: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
  copyright?: string;
}

// Resilient fallback cosmic dispatches if network is offline
const FALLBACK_DISPATCHES: ApodData[] = [
  {
    title: 'The Great Red Spot & Swirling Storms of Jupiter',
    date: '2026-10-24',
    explanation:
      'Captured by the Juno spacecraft during its close perijove pass over Jupiter. Ammonia-water clouds swirl in turbulent anticyclonic storms across the Jovian atmosphere, while the Great Red Spot has raged for over 350 years.',
    url: '/nasa/jupiter-storm.svg',
    hdurl: '/nasa/jupiter-storm.svg',
    media_type: 'image',
    copyright: 'NASA / JPL-Caltech / SwRI / MSSS',
  },
  {
    title: 'Pillars of Creation in the Eagle Nebula (M16)',
    date: '2026-07-12',
    explanation:
      'James Webb Space Telescope near-infrared view of the iconic Pillars of Creation. Penetrating through thick interstellar dust clouds, new protostars blaze into existence within columns of cool molecular hydrogen gas.',
    url: '/nasa/pillars-creation.svg',
    hdurl: '/nasa/pillars-creation.svg',
    media_type: 'image',
    copyright: 'NASA, ESA, CSA, STScI',
  },
  {
    title: 'Carina Nebula Cosmic Cliffs (NGC 3324)',
    date: '2026-03-15',
    explanation:
      'Gaseous cavity carved by intense ultraviolet radiation and stellar winds from massive, hot, young stars located at the center of NGC 3324, approximately 7,600 light-years from Earth.',
    url: '/nasa/carina-nebula.svg',
    hdurl: '/nasa/carina-nebula.svg',
    media_type: 'image',
    copyright: 'NASA / Webb Space Telescope Team',
  },
  {
    title: 'Core of the Andromeda Spiral Galaxy (M31)',
    date: '2025-11-08',
    explanation:
      'Multiwavelength composite of our nearest galactic neighbor Andromeda (M31). Spanning over 220,000 light-years across, its core blazes with billions of ancient stars surrounded by dense dust lanes and young star clusters.',
    url: '/nasa/andromeda-core.svg',
    hdurl: '/nasa/andromeda-core.svg',
    media_type: 'image',
    copyright: 'NASA / STScI / CIT Deep Space Survey',
  },
];

interface IconicDispatch {
  label: string;
  date: string;
  icon: string;
}

const ICONIC_DISPATCHES: IconicDispatch[] = [
  { label: 'Pillars of Creation (JWST)', date: '2022-10-19', icon: '🦅' },
  { label: 'Deep Field SMACS 0723', date: '2022-07-12', icon: '🌌' },
  { label: "Webb's Saturn Rings", date: '2023-07-05', icon: '🪐' },
  { label: 'Juno Over Great Red Spot', date: '2019-07-11', icon: '🌪️' },
  { label: 'Io Volcano Plumes', date: '2024-01-03', icon: '🌋' },
  { label: 'Perseverance at Jezero', date: '2021-03-05', icon: '🔴' },
  { label: 'Total Solar Eclipse 2024', date: '2024-04-09', icon: '🌑' },
  { label: 'Andromeda Spiral Core', date: '2023-11-08', icon: '🌀' },
];

export default function NasaDeepSpaceFeed() {
  const [currentApod, setCurrentApod] = useState<ApodData>(FALLBACK_DISPATCHES[0]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [apiOnline, setApiOnline] = useState<boolean>(true);

  // Fetch from NASA APOD API
  const fetchNasaApod = useCallback(async (dateParam?: string) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      let url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;
      if (dateParam) {
        url += `&date=${dateParam}`;
      }

      let res = await fetch(url);

      // If querying without a specific date and NASA returns an error (common if today's APOD is pending publish),
      // retry with yesterday's observation
      if (!res.ok && !dateParam) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const retryUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${yesterday}`;
        const retryRes = await fetch(retryUrl);
        if (retryRes.ok) {
          res = retryRes;
        }
      }

      if (!res.ok) {
        throw new Error(`NASA API returned HTTP ${res.status}`);
      }

      const data: ApodData = await res.json();
      setCurrentApod(data);
      setApiOnline(true);
    } catch (err: any) {
      console.warn('NASA API live request failed, switching to cached space dispatch:', err);
      setApiOnline(false);
      setErrorMsg('Deep-space archive dispatch loaded. You can explore historical dates or browse cached astronomical captures.');
      // Random fallback
      const randomFallback =
        FALLBACK_DISPATCHES[Math.floor(Math.random() * FALLBACK_DISPATCHES.length)];
      setCurrentApod(randomFallback);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    fetchNasaApod();
  }, [fetchNasaApod]);

  // Handle random cosmic dispatch
  const handleRandomDate = () => {
    // Generate random date between 2000-01-01 and 2025-12-31
    const start = new Date(2000, 0, 1).getTime();
    const end = new Date(2025, 11, 31).getTime();
    const randomDate = new Date(start + Math.random() * (end - start));
    const dateStr = randomDate.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    fetchNasaApod(dateStr);
  };

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      fetchNasaApod(selectedDate);
    }
  };

  return (
    <div className="nasa-feed-panel">
      {/* Header Bar */}
      <div className="nasa-header-bar">
        <div className="nasa-brand-left">
          <span className="nasa-logo-badge">NASA OPEN API</span>
          <span className="nasa-feed-title">DEEP SPACE OBSERVATORY & APOD FEED</span>
        </div>
        <div className="nasa-status-right">
          <span className={`live-status-pill ${apiOnline ? 'online' : 'cached'}`}>
            <span className="status-dot"></span>
            {apiOnline ? 'LIVE NASA GATEWAY CONNECTED' : 'CACHED ARCHIVE'}
          </span>
          <span className="station-badge">
            STATION: CIT-OBSERVATORY // CHENNAI
          </span>
        </div>
      </div>

      {/* Main Content Showcase */}
      <div className="nasa-content-grid">
        {/* Left: Interactive Media Viewport */}
        <div className="nasa-media-container">
          {loading ? (
            <div className="nasa-loading-box">
              <span className="loading-spinner"></span>
              <p>Receiving deep-space transmission from NASA Goddard...</p>
            </div>
          ) : currentApod.media_type === 'video' ? (
            <div className="nasa-video-wrapper">
              <iframe
                src={currentApod.url}
                title={currentApod.title}
                allowFullScreen
                className="nasa-iframe"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-presentation"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          ) : (
            <div className="nasa-image-wrapper" onClick={() => setLightboxOpen(true)}>
              <img
                src={currentApod.url}
                alt={currentApod.title}
                className="nasa-img"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/nasa/jupiter-storm.svg';
                }}
              />
              <div className="image-hover-scrim">
                <span className="scrim-icon">🔍</span>
                <span className="scrim-text">Click for Fullscreen HD Observation</span>
              </div>
            </div>
          )}

          {/* Quick Filter & Historical Time Travel Bar */}
          <div className="time-travel-bar">
            <form onSubmit={handleDateSubmit} className="date-form">
              <label htmlFor="apod-date-picker" className="date-label">
                CHOOSE OBSERVATION DATE:
              </label>
              <input
                id="apod-date-picker"
                type="date"
                min="1995-06-16"
                max={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
              <button type="submit" className="time-btn submit-btn">
                LOOKUP
              </button>
            </form>

            <button type="button" className="time-btn random-btn" onClick={handleRandomDate}>
              🎲 RANDOM COSMIC ARCHIVE
            </button>
          </div>

          {/* Curated Iconic Deep-Space Expeditions (Quick Discovery Pills) */}
          <div className="iconic-expeditions-bar">
            <span className="expeditions-label">ICONIC EXPEDITIONS // ONE-CLICK DISCOVERY:</span>
            <div className="expeditions-pills-row">
              {ICONIC_DISPATCHES.map((item) => (
                <button
                  key={item.date}
                  type="button"
                  className={`expedition-pill ${currentApod.date === item.date || selectedDate === item.date ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedDate(item.date);
                    fetchNasaApod(item.date);
                  }}
                  title={`View NASA Observation from ${item.date}`}
                >
                  <span className="pill-icon">{item.icon}</span>
                  <span className="pill-title">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Scientific Metadata & Explanation */}
        <div className="nasa-metadata-col">
          <div className="meta-card">
            <div className="meta-top">
              <span className="meta-date">OBSERVATION DATE: {currentApod.date}</span>
              {currentApod.copyright && (
                <span className="meta-credit">© {currentApod.copyright.trim()}</span>
              )}
            </div>

            <h3 className="meta-title">{currentApod.title}</h3>

            <div className="meta-explanation-wrapper">
              <span className="explanation-label">SCIENTIFIC ANNOTATION (NASA ASTROPHYSICS):</span>
              <p className="meta-explanation">{currentApod.explanation}</p>
            </div>

            {errorMsg && <div className="notice-banner">{errorMsg}</div>}

            <div className="meta-actions">
              {currentApod.hdurl && (
                <a
                  href={currentApod.hdurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nasa-link-btn"
                >
                  <span>DOWNLOAD FULL HD ASSET</span>
                  <span className="link-arrow">↗</span>
                </a>
              )}
              <button
                type="button"
                className="nasa-link-btn secondary-btn"
                onClick={() => fetchNasaApod()}
              >
                <span>REFRESH TODAY'S APOD</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && currentApod.media_type === 'image' && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setLightboxOpen(false)}
            >
              ✕
            </button>
            <img
              src={currentApod.hdurl || currentApod.url}
              alt={currentApod.title}
              className="lightbox-img"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/nasa/jupiter-storm.svg';
              }}
            />
            <div className="lightbox-caption">
              <h4>{currentApod.title}</h4>
              <p>{currentApod.date} • {currentApod.copyright ? `© ${currentApod.copyright}` : 'Public Domain NASA Asset'}</p>
            </div>
          </div>
        </div>
      )}

      {/* High-Contrast Stylesheet */}
      <style>{`
        .nasa-feed-panel {
          background-color: var(--surface, #0c121e);
          border: 1px solid color-mix(in srgb, var(--border, #334155) 45%, transparent);
          border-radius: var(--radius-lg, 12px);
          overflow: hidden;
          font-family: var(--font-mono, ui-monospace, SFMono-Regular, monospace);
          color: var(--moon, #f8fafc);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
          margin-top: 2rem;
        }

        .nasa-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 1.75rem;
          background: rgba(6, 10, 18, 0.95);
          border-bottom: 1px solid rgba(56, 189, 248, 0.2);
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .nasa-brand-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .nasa-logo-badge {
          background: #e11d48;
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
        }

        .nasa-feed-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: #38bdf8;
          letter-spacing: 0.06em;
        }

        .nasa-status-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .live-status-pill {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .live-status-pill.online {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.35);
        }

        .live-status-pill.cached {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.35);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 6px currentColor;
        }

        .station-badge {
          font-size: 0.68rem;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.25);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        .nasa-content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          padding: 1.75rem;
        }

        @media (min-width: 1024px) {
          .nasa-content-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .nasa-media-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .nasa-image-wrapper {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background: #000000;
          aspect-ratio: 16 / 10;
          cursor: pointer;
          border: 1px solid rgba(51, 65, 85, 0.5);
        }

        .nasa-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .nasa-image-wrapper:hover .nasa-img {
          transform: scale(1.03);
        }

        .image-hover-scrim {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .nasa-image-wrapper:hover .image-hover-scrim {
          opacity: 1;
        }

        .scrim-icon {
          font-size: 1.5rem;
        }

        .scrim-text {
          font-size: 0.75rem;
          font-weight: 700;
          color: #38bdf8;
          letter-spacing: 0.05em;
        }

        .nasa-video-wrapper {
          aspect-ratio: 16 / 9;
          border-radius: 8px;
          overflow: hidden;
        }

        .nasa-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        .nasa-loading-box {
          aspect-ratio: 16 / 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 8px;
          color: #94a3b8;
          font-size: 0.8rem;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(56, 189, 248, 0.2);
          border-top-color: #38bdf8;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .time-travel-bar {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(51, 65, 85, 0.4);
          border-radius: 6px;
          padding: 0.75rem 1rem;
        }

        .date-form {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .date-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: #94a3b8;
        }

        .date-input {
          background: #0b1120;
          border: 1px solid rgba(56, 189, 248, 0.35);
          color: #f8fafc;
          padding: 0.3rem 0.5rem;
          border-radius: 4px;
          font-size: 0.72rem;
          color-scheme: dark;
          outline: none;
        }

        .time-btn {
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.4);
          color: #38bdf8;
          padding: 0.4rem 0.75rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .time-btn:hover {
          background: #38bdf8;
          color: #070b13;
        }

        .random-btn {
          background: rgba(245, 158, 11, 0.15);
          border-color: rgba(245, 158, 11, 0.4);
          color: #fbbf24;
        }

        .random-btn:hover {
          background: #f59e0b;
          color: #070b13;
        }

        .iconic-expeditions-bar {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: rgba(15, 23, 42, 0.45);
          border: 1px solid rgba(51, 65, 85, 0.35);
          border-radius: 6px;
          padding: 0.65rem 0.85rem;
        }

        .expeditions-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.08em;
        }

        .expeditions-pills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .expedition-pill {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.25);
          color: #cbd5e1;
          padding: 0.3rem 0.65rem;
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

        .expedition-pill:hover {
          border-color: #38bdf8;
          color: #ffffff;
          background: rgba(56, 189, 248, 0.15);
          transform: translateY(-1px);
        }

        .expedition-pill.active {
          background: #38bdf8;
          color: #030712;
          border-color: #38bdf8;
          font-weight: 700;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
        }

        .pill-icon {
          font-size: 0.75rem;
        }

        /* Metadata Column */
        .meta-card {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          height: 100%;
        }

        .meta-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          font-size: 0.68rem;
        }

        .meta-date {
          font-weight: 700;
          color: #38bdf8;
        }

        .meta-credit {
          color: #94a3b8;
        }

        .meta-title {
          font-family: var(--font-display, inherit);
          font-size: 1.45rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          line-height: 1.3;
        }

        .meta-explanation-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .explanation-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: #38bdf8;
          letter-spacing: 0.06em;
        }

        .meta-explanation {
          font-family: var(--font-body, inherit);
          font-size: 0.85rem;
          line-height: 1.65;
          color: #cbd5e1;
          margin: 0;
          max-height: 220px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .notice-banner {
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.4);
          color: #fbbf24;
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          font-size: 0.72rem;
        }

        .meta-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(51, 65, 85, 0.4);
          flex-wrap: wrap;
        }

        .nasa-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #0284c7;
          color: #ffffff;
          border: 1px solid #38bdf8;
          padding: 0.6rem 1.1rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nasa-link-btn:hover {
          background: #0369a1;
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.4);
        }

        .nasa-link-btn.secondary-btn {
          background: rgba(30, 41, 59, 0.7);
          border-color: rgba(148, 163, 184, 0.3);
          color: #e2e8f0;
        }

        .nasa-link-btn.secondary-btn:hover {
          background: rgba(51, 65, 85, 0.9);
          border-color: #94a3b8;
        }

        /* Lightbox */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          padding: 2rem;
        }

        .lightbox-inner {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .lightbox-img {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
          border-radius: 6px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8);
        }

        .lightbox-close-btn {
          position: absolute;
          top: -2.5rem;
          right: 0;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .lightbox-caption {
          margin-top: 0.75rem;
          text-align: center;
        }

        .lightbox-caption h4 {
          font-size: 1rem;
          color: #ffffff;
          margin: 0;
        }

        .lightbox-caption p {
          font-size: 0.75rem;
          color: #94a3b8;
          margin: 0.25rem 0 0 0;
        }
      `}</style>
    </div>
  );
}
