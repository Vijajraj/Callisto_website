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

interface RadioFrequencyPreset {
  id: string;
  name: string;
  freq: string;
  band: string;
  description: string;
}

interface PodcastEpisode {
  id: string;
  episodeNumber: string;
  title: string;
  series: string;
  host: string;
  episodeUrl: string;
  embedUrl: string;
  badge: string;
  targetTag: string;
  targetClassification: string;
  synopsis: string;
  stats: {
    label: string;
    value: string;
  }[];
  dossier: {
    heading1: string;
    text1: string;
    heading2: string;
    text2: string;
  };
  graphicType: 'singularity' | 'probe' | 'atmosphere';
}

const FREQUENCY_PRESETS: RadioFrequencyPreset[] = [
  {
    id: 'ton618',
    name: 'TON 618 QUASAR CARRIER',
    freq: '1420.405 MHz',
    band: 'HYDROGEN LINE (HI)',
    description: 'Relayed broadcast from the 66-billion-solar-mass hyperluminous quasar core in Canes Venatici.',
  },
  {
    id: 'voyager',
    name: 'DSN GOLDSTONE DEEP SPACE',
    freq: '2295.000 MHz',
    band: 'S-BAND DEEP SPACE',
    description: 'Deep Space Network microwave downlink tracking Voyager 1 across 163+ astronomical units.',
  },
  {
    id: 'almanac',
    name: 'MOLECULAR LINE SPECTROGRAPH',
    freq: '86.846 GHz',
    band: 'MILLIMETER WAVE',
    description: 'High-altitude sub-millimeter radiometer tuned to organic molecular transitions in cosmic gas clouds.',
  },
];

const SHOW_SPOTIFY_URL = 'https://open.spotify.com/show/6cKcglU4Qe6p4eCqFA24b5?si=2b33bc126e1a44a1';

const EPISODES: PodcastEpisode[] = [
  {
    id: 'ep-ton618',
    episodeNumber: 'EPISODE 01',
    title: 'TON 618 – Exploring the Giant Black Hole',
    series: 'WHISPERS OF THE UNIVERSE',
    host: 'SANJAY V V',
    episodeUrl: 'https://open.spotify.com/episode/7Cua98anBVaMCRzlCHi60D?si=E8OqIumUTTqXjRt5iAQHcA',
    embedUrl: 'https://open.spotify.com/embed/episode/7Cua98anBVaMCRzlCHi60D?utm_source=generator&theme=0',
    badge: 'ASTROPHYSICS SPECIAL',
    targetTag: 'TARGET: TON 618',
    targetClassification: 'ULTRAMASSIVE BLACK HOLE',
    synopsis:
      'Journey past the cosmological event horizon of TON 618—the most titanic ultramassive black hole ever documented in observational astrophysics. Host Sanjay V V breaks down the staggering mechanics of this 66-billion-solar-mass singularity, the physics of hyper-accretion disks, and what its extraordinary light reveals about the dawn of early galaxies.',
    stats: [
      { label: 'MASS', value: '66 Billion M☉' },
      { label: 'RADIUS', value: '~390 Billion km' },
      { label: 'DISTANCE', value: '18.2B Light Yrs' },
      { label: 'LUMINOSITY', value: '140 Trillion Suns' },
    ],
    dossier: {
      heading1: 'SINGULARITY CLASSIFICATION',
      text1:
        'TON 618 is an extreme, optically violent variable radio-loud quasar located near the border of Canes Venatici and Coma Berenices. Its central supermassive engine is so massive that it exceeds the mass of all stars in the Milky Way combined by more than thirty times.',
      heading2: 'ACCRETION DISK & EDDINGTON LIMIT',
      text2:
        'The broad absorption lines in its spectrum indicate infalling plasma traveling at over 7,000 kilometers per second. The accretion disk shines with the incandescent power of 140 trillion suns, outshining its host galaxy and ionizing gas clouds thousands of light-years across.',
    },
    graphicType: 'singularity',
  },
  {
    id: 'ep-voyager1',
    episodeNumber: 'EPISODE 02',
    title: "One Light-Day Away: Voyager 1's Comeback",
    series: 'WHISPERS OF THE UNIVERSE',
    host: 'SANJAY V V',
    episodeUrl: 'https://open.spotify.com/episode/23Sy8BvI5BxEluyfpwCwNl?si=LNk5Be2cTvyY9e2qzfSH_Q',
    embedUrl: 'https://open.spotify.com/embed/episode/23Sy8BvI5BxEluyfpwCwNl?utm_source=generator&theme=0',
    badge: 'DEEP SPACE RESCUE',
    targetTag: 'TARGET: VOYAGER 1',
    targetClassification: 'EXTRASOLAR PROBE (163+ AU)',
    synopsis:
      "Over 24 billion kilometers from Earth, humanity's most distant emissary Voyager 1 went silent after a flight data system hardware corruption. Host Sanjay V V explores the historic remote engineering rescue by NASA JPL engineers who diagnosed and patched an extrasolar deep space probe using 1970s assembly code across a 45-hour round-trip radio delay.",
    stats: [
      { label: 'DISTANCE', value: '>24B km (163 AU)' },
      { label: 'SIGNAL DELAY', value: '22.5h (One-Way)' },
      { label: 'LAUNCH DATE', value: 'Sept 5, 1977' },
      { label: 'VELOCITY', value: '17 km/s (Mach 50)' },
    ],
    dossier: {
      heading1: 'FDS MEMORY HARDWARE CORRUPTION',
      text1:
        'In November 2023, Voyager 1 began transmitting a repeating, unparseable binary telemetry stream. Deep Space Network engineers traced the failure to a single corrupted 256-word memory chip in the Flight Data Subsystem (FDS), which formats science and engineering data packets.',
      heading2: 'REMOTE CODE SPLIT & REASSEMBLY',
      text2:
        'With no physical access, JPL engineered an ingenious solution: splitting the corrupted code into micro-segments, modifying memory pointers, and relocating code fragments across functional sectors. On April 20, 2024, Voyager 1 resumed transmitting pristine scientific telemetry.',
    },
    graphicType: 'probe',
  },
  {
    id: 'ep-scent',
    episodeNumber: 'EPISODE 03',
    title: 'Scent beyond the Horizon',
    series: 'WHISPERS OF THE UNIVERSE',
    host: 'SANJAY V V',
    episodeUrl: 'https://open.spotify.com/episode/2ngtuoAxOu9K2ijfnKAcmE?si=vOzO8xcxTZiqseB99WV30w',
    embedUrl: 'https://open.spotify.com/embed/episode/2ngtuoAxOu9K2ijfnKAcmE?utm_source=generator&theme=0',
    badge: 'COSMIC ASTROCHEMISTRY',
    targetTag: 'TARGET: MOLECULAR CLOUDS',
    targetClassification: 'PLANETARY VOLATILES & ORGANICS',
    synopsis:
      "What does outer space smell and taste like? From the ethyl formate raspberry and rum aroma detected in Sagittarius B2's deep cosmic gas clouds to the volcanic sulfur dioxide frost of Jovian moon Io and Titan's dense hydrocarbon atmosphere, explore the rich aromatic chemistry and spectroscopic discoveries of the cosmos.",
    stats: [
      { label: 'KEY ORGANICS', value: 'Ethyl Formate & HCN' },
      { label: 'FIELD', value: 'Astrochemistry' },
      { label: 'DETECTION', value: 'Radio Spectroscopy' },
      { label: 'ANALOGUES', value: 'Titan, Io, Sgr B2' },
    ],
    dossier: {
      heading1: 'ORGANIC MOLECULES IN DEEP SPACE',
      text1:
        'Using radiotelescope interferometers, astrophysicists identified ethyl formate—the ester responsible for the flavor of raspberries and the smell of rum—inside the giant molecular cloud Sagittarius B2 near the galactic center, proving organic precursors abound in star-forming cosmic nurseries.',
      heading2: 'PLANETARY ATMOSPHERE VOLATILES',
      text2:
        "Planetary probes confirm unique sensory profiles across our solar system: Apollo astronauts reported lunar regolith smelling of spent gunpowder, comet 67P/C-G releases sharp ammonia and rotten-egg hydrogen sulfide vapors, and Titan's orange atmosphere mimics industrial photochemical smog.",
    },
    graphicType: 'atmosphere',
  },
];

export default function PodcastTransmission(): React.ReactElement {
  const [activeEpisodeIndex, setActiveEpisodeIndex] = useState<number>(0);
  const [selectedFreq, setSelectedFreq] = useState<RadioFrequencyPreset>(FREQUENCY_PRESETS[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [showDossier, setShowDossier] = useState<boolean>(false);
  const [visualizerActive] = useState<boolean>(true);

  const activeEpisode = EPISODES[activeEpisodeIndex];

  const handleCopy = () => {
    playTelemetryBeep(1200, 0.08);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(activeEpisode.episodeUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
    }
  };

  const handleSelectEpisode = (index: number) => {
    playTelemetryBeep(1050, 0.07);
    setActiveEpisodeIndex(index);
    if (FREQUENCY_PRESETS[index]) {
      setSelectedFreq(FREQUENCY_PRESETS[index]);
    }
  };

  const handleFreqChange = (preset: RadioFrequencyPreset, idx?: number) => {
    playTelemetryBeep(980, 0.06);
    setSelectedFreq(preset);
    const targetIdx = idx !== undefined ? idx : FREQUENCY_PRESETS.findIndex((p) => p.id === preset.id);
    if (targetIdx !== -1 && EPISODES[targetIdx]) {
      setActiveEpisodeIndex(targetIdx);
    }
  };

  const toggleDossier = () => {
    playTelemetryBeep(850, 0.05);
    setShowDossier(!showDossier);
  };

  return (
    <div className="podcast-transmission-card" role="region" aria-label="Whispers of the Universe Podcast Hub">
      {/* Radio Carrier Frequency Banner */}
      <div className="radio-header-bar">
        <div className="station-brand">
          <span className="live-signal-badge">
            <span className="pulse-dot" />
            AUDIO FEED
          </span>
          <div className="station-meta">
            <span className="station-title">CALLISTO SUB-SPACE RADIO // {activeEpisode.series}</span>
            <span className="station-sub" key={activeEpisode.id}>
              NOW TUNED: <strong className="station-sub-highlight">{activeEpisode.episodeNumber}</strong> &ndash; {activeEpisode.title.toUpperCase()} &bull; HOSTED BY {activeEpisode.host}
            </span>
          </div>
        </div>

        {/* Radio Carrier Frequency Tuning Selector */}
        <div className="freq-selector-wrap">
          <span className="freq-label">CARRIER FREQ:</span>
          <div className="freq-chips">
            {FREQUENCY_PRESETS.map((f, fIdx) => (
              <button
                key={f.id}
                type="button"
                onClick={() => handleFreqChange(f, fIdx)}
                className={`freq-chip ${selectedFreq.id === f.id ? 'active' : ''}`}
                title={`${f.name} - ${f.description}`}
              >
                {f.freq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Episode Navigation Tabs */}
      <div className="episode-selector-bar" role="tablist" aria-label="Podcast Episodes">
        <span className="episodes-label">TRANSMISSION LOGS:</span>
        <div className="episode-tabs-list">
          {EPISODES.map((ep, idx) => (
            <button
              key={ep.id}
              type="button"
              role="tab"
              aria-selected={activeEpisodeIndex === idx}
              onClick={() => handleSelectEpisode(idx)}
              className={`episode-tab-btn ${activeEpisodeIndex === idx ? 'active' : ''}`}
            >
              <span className="ep-num">{ep.episodeNumber}</span>
              <span className="ep-title-short">{ep.title.split('–')[0].split(':')[0]}</span>
              {activeEpisodeIndex === idx && (
                <span className="now-playing-pill" aria-label="Currently tuned">
                  <span className="tiny-pulse" />
                  TUNED
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Broadcast Console */}
      <div className="broadcast-main-grid">
        {/* Left Column: Astronomical Graphic & Telemetry Strip */}
        <div className="singularity-visual-col">
          <div className="singularity-frame">
            {/* Dynamic CSS / SVG Graphic depending on episode */}
            {activeEpisode.graphicType === 'singularity' && (
              <div className="accretion-disk-graphic" aria-hidden="true">
                <div className="disk-halo outer" />
                <div className="disk-halo middle" />
                <div className="photon-sphere" />
                <div className="event-horizon-core" />
                <div className="relativistic-beam" />
              </div>
            )}

            {activeEpisode.graphicType === 'probe' && (
              <div className="probe-graphic" aria-hidden="true">
                <div className="deep-space-grid" />
                <div className="probe-high-gain-dish" />
                <div className="probe-boom left" />
                <div className="probe-boom right" />
                <div className="probe-rtg-core" />
                <div className="probe-signal-wave wave-1" />
                <div className="probe-signal-wave wave-2" />
                <div className="probe-signal-wave wave-3" />
              </div>
            )}

            {activeEpisode.graphicType === 'atmosphere' && (
              <div className="atmosphere-graphic" aria-hidden="true">
                <div className="nebula-dust-cloud cloud-1" />
                <div className="nebula-dust-cloud cloud-2" />
                <div className="planetary-limb" />
                <div className="spectrograph-emission-lines" />
              </div>
            )}

            {/* Overlaid Telemetry Badges */}
            <div className="singularity-overlay-meta">
              <div className="cosmic-badge-tag">{activeEpisode.targetTag}</div>
              <div className="cosmic-badge-val">{activeEpisode.targetClassification}</div>
            </div>

            {/* Radio Spectrogram Waveform Bars */}
            <div className="audio-spectrogram-strip" aria-hidden="true">
              {[42, 68, 85, 30, 95, 75, 50, 88, 100, 60, 45, 90, 70, 35, 80, 55].map((h, i) => (
                <div
                  key={i}
                  className={`spectrum-bar ${visualizerActive ? 'animating' : ''}`}
                  style={{
                    height: `${h}%`,
                    animationDelay: `${(i * 0.07).toFixed(2)}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="singularity-stats-grid">
            {activeEpisode.stats.map((st, i) => (
              <div key={i} className="stat-pill">
                <span className="stat-name">{st.label}</span>
                <span className="stat-number">{st.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Audio Player & Editorial Details */}
        <div className="episode-content-col">
          <div className="episode-tag-row">
            <span className="series-pill">SERIES: {activeEpisode.series}</span>
            <span className="host-pill">HOST: {activeEpisode.host}</span>
            <span className="badge-new">{activeEpisode.badge}</span>
          </div>

          <h3 className="episode-title">{activeEpisode.title}</h3>

          <p className="episode-synopsis">{activeEpisode.synopsis}</p>

          {/* Live Spotify Audio Player Iframe */}
          <div className="spotify-embed-container">
            <iframe
              key={activeEpisode.id}
              src={activeEpisode.embedUrl}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title={`Spotify Embed: ${activeEpisode.title} hosted by ${activeEpisode.host}`}
              className="spotify-iframe"
            />
          </div>

          {/* Interactive Action Controls */}
          <div className="transmission-actions-strip">
            <a
              href={activeEpisode.episodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-spotify-direct"
              aria-label={`Open "${activeEpisode.title}" directly on Spotify in a new tab`}
            >
              {/* Spotify Official Vector Logo */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.494 17.306c-.215.353-.674.464-1.027.249-2.812-1.718-6.352-2.107-10.523-1.154-.403.092-.806-.16-.898-.563-.092-.403.16-.806.563-.898 4.568-1.044 8.487-.6 11.636 1.339.353.215.464.674.249 1.027zm1.468-3.264c-.27.44-.847.579-1.287.31-3.219-1.978-8.125-2.55-11.932-1.393-.497.151-1.025-.133-1.176-.63-.151-.497.133-1.025.63-1.176 4.35-1.32 9.757-.68 13.455 1.593.44.27.579.847.31 1.287zm.126-3.411c-3.86-2.292-10.223-2.503-13.886-1.391-.592.18-1.222-.154-1.402-.746-.18-.592.154-1.222.746-1.402 4.225-1.283 11.237-1.037 15.684 1.603.533.316.707 1.009.391 1.542-.316.533-1.009.707-1.542.391z" />
              </svg>
              <span>LISTEN ON SPOTIFY</span>
            </a>

            <a
              href={SHOW_SPOTIFY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-spotify-show"
              aria-label="Follow the Callisto show on Spotify in a new tab"
            >
              <span>FOLLOW SHOW</span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="btn-copy-transmission"
              aria-label="Copy podcast link to clipboard"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>{copied ? 'LINK COPIED' : 'SHARE FREQUENCY'}</span>
            </button>

            <button
              type="button"
              onClick={toggleDossier}
              className={`btn-dossier-toggle ${showDossier ? 'active' : ''}`}
              aria-expanded={showDossier}
              aria-label="Toggle astronomical briefing dossier"
            >
              <span>{showDossier ? 'COLLAPSE LOG' : 'ASTROPHYSICS DOSSIER'}</span>
              <span className="chevron-indicator">{showDossier ? '▲' : '▼'}</span>
            </button>
          </div>

          {/* Expandable Scientific Dossier */}
          {showDossier && (
            <div className="dossier-drawer" role="region" aria-label={`${activeEpisode.title} Astrophysics Briefing`}>
              <div className="dossier-grid">
                <div className="dossier-block">
                  <span className="dossier-heading">{activeEpisode.dossier.heading1}</span>
                  <p className="dossier-text">{activeEpisode.dossier.text1}</p>
                </div>
                <div className="dossier-block">
                  <span className="dossier-heading">{activeEpisode.dossier.heading2}</span>
                  <p className="dossier-text">{activeEpisode.dossier.text2}</p>
                </div>
              </div>
              <div className="dossier-footer">
                <span>PODCAST CREATED BY CIT CALLISTO STARCAST TEAM &bull; HOSTED BY SANJAY V V</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* High-Contrast Responsive Stylesheet */}
      <style>{`
        .podcast-transmission-card {
          background-color: var(--deep, #0b1120);
          border: 1px solid color-mix(in srgb, var(--orbit, #38bdf8) 40%, transparent);
          border-radius: var(--radius-lg, 14px);
          overflow: hidden;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.75), 0 0 24px rgba(56, 189, 248, 0.18);
          margin-top: var(--space-xl, 2rem);
          margin-bottom: var(--space-3xl, 3rem);
          width: 100%;
          box-sizing: border-box;
        }

        /* Radio Header Bar */
        .radio-header-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: rgba(15, 23, 42, 0.85);
          border-bottom: 1px solid color-mix(in srgb, var(--steel, #475569) 30%, transparent);
        }

        .station-brand {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
        }

        .live-signal-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(29, 185, 84, 0.15);
          color: #1ed760;
          border: 1px solid #1ed760;
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.22rem 0.55rem;
          border-radius: 4px;
          letter-spacing: 0.08em;
        }

        .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #1ed760;
          box-shadow: 0 0 8px #1ed760;
          animation: signalBlink 1.4s infinite ease-in-out;
        }

        @keyframes signalBlink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.85); }
        }

        .station-meta {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .station-title {
          font-family: var(--font-mono, monospace);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--moon, #ffffff);
          letter-spacing: 0.06em;
        }

        .station-sub {
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          color: var(--orbit, #38bdf8);
          letter-spacing: 0.08em;
          transition: all 0.25s ease;
        }

        .station-sub-highlight {
          color: #f59e0b;
          font-weight: 800;
        }

        .now-playing-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(30, 215, 96, 0.15);
          color: #1ed760;
          border: 1px solid #1ed760;
          font-size: 0.55rem;
          font-weight: 800;
          padding: 0.1rem 0.35rem;
          border-radius: 3px;
          letter-spacing: 0.06em;
          margin-left: 0.25rem;
        }

        .tiny-pulse {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #1ed760;
          box-shadow: 0 0 6px #1ed760;
          animation: signalBlink 1.2s infinite ease-in-out;
        }

        /* Frequency Selector */
        .freq-selector-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .freq-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--starlight, #94a3b8);
          letter-spacing: 0.08em;
        }

        .freq-chips {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
        }

        .freq-chip {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.25);
          color: var(--starlight, #94a3b8);
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          font-weight: 600;
          padding: 0.2rem 0.5rem;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .freq-chip:hover {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border-color: #38bdf8;
        }

        .freq-chip.active {
          background: rgba(56, 189, 248, 0.25);
          color: #ffffff;
          border-color: #38bdf8;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
        }

        /* Episode Navigation Tabs */
        .episode-selector-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1.5rem;
          background: rgba(11, 17, 32, 0.95);
          border-bottom: 1px solid color-mix(in srgb, var(--steel, #475569) 25%, transparent);
          overflow-x: auto;
          scrollbar-width: thin;
        }

        .episodes-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--starlight, #94a3b8);
          letter-spacing: 0.1em;
          white-space: nowrap;
        }

        .episode-tabs-list {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .episode-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 6px;
          padding: 0.4rem 0.85rem;
          color: var(--starlight, #cbd5e1);
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .episode-tab-btn:hover {
          background: rgba(56, 189, 248, 0.12);
          border-color: rgba(56, 189, 248, 0.5);
          color: #ffffff;
        }

        .episode-tab-btn.active {
          background: rgba(56, 189, 248, 0.2);
          border-color: #38bdf8;
          color: #38bdf8;
          box-shadow: 0 0 12px rgba(56, 189, 248, 0.25);
        }

        .ep-num {
          font-weight: 800;
          color: #f59e0b;
        }

        .episode-tab-btn.active .ep-num {
          color: #38bdf8;
        }

        .ep-title-short {
          font-weight: 600;
        }

        /* Main Broadcast Grid */
        .broadcast-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          padding: 2rem 1.5rem;
        }

        @media (min-width: 992px) {
          .broadcast-main-grid {
            grid-template-columns: 380px 1fr;
            align-items: start;
          }
        }

        /* Singularity & Probe Frame Visuals */
        .singularity-visual-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .singularity-frame {
          position: relative;
          width: 100%;
          height: 280px;
          background: radial-gradient(circle at center, #020617 0%, #000000 100%);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* CSS Gravitational Lensing & Accretion Halo */
        .accretion-disk-graphic {
          position: relative;
          width: 220px;
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .disk-halo {
          position: absolute;
          border-radius: 50%;
          border: 2px dashed rgba(245, 158, 11, 0.4);
        }

        .disk-halo.outer {
          width: 200px;
          height: 200px;
          animation: rotateHalo 32s infinite linear;
          box-shadow: 0 0 30px rgba(245, 158, 11, 0.25);
        }

        .disk-halo.middle {
          width: 150px;
          height: 150px;
          border: 2px solid rgba(56, 189, 248, 0.5);
          animation: rotateHaloReverse 20s infinite linear;
          box-shadow: 0 0 25px rgba(56, 189, 248, 0.35);
        }

        .photon-sphere {
          position: absolute;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(254, 240, 138, 0.8) 0%, rgba(245, 158, 11, 0.4) 60%, transparent 100%);
          filter: blur(4px);
          animation: photonPulse 4s infinite ease-in-out;
        }

        .event-horizon-core {
          position: absolute;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: #000000;
          box-shadow: 0 0 16px rgba(0, 0, 0, 1), 0 0 30px rgba(56, 189, 248, 0.3);
          z-index: 2;
        }

        .relativistic-beam {
          position: absolute;
          width: 2px;
          height: 260px;
          background: linear-gradient(to bottom, transparent, rgba(56, 189, 248, 0.8), rgba(255, 255, 255, 0.9), rgba(56, 189, 248, 0.8), transparent);
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.9);
          transform: rotate(35deg);
          z-index: 3;
        }

        /* Probe Graphic Visual */
        .probe-graphic {
          position: relative;
          width: 220px;
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .deep-space-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at center, rgba(56, 189, 248, 0.15) 1px, transparent 1px);
          background-size: 20px 20px;
          opacity: 0.5;
        }

        .probe-high-gain-dish {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          border: 3px solid rgba(226, 232, 240, 0.8);
          background: radial-gradient(circle at 40% 40%, rgba(203, 213, 225, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%);
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
          z-index: 2;
        }

        .probe-boom {
          position: absolute;
          height: 2px;
          background: rgba(148, 163, 184, 0.7);
        }

        .probe-boom.left {
          width: 70px;
          left: 10px;
          top: 50%;
          transform: rotate(-25deg);
        }

        .probe-boom.right {
          width: 80px;
          right: 5px;
          top: 45%;
          transform: rotate(30deg);
        }

        .probe-rtg-core {
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 3px;
          background: #f59e0b;
          box-shadow: 0 0 12px #f59e0b;
          z-index: 4;
          bottom: 45px;
          left: 70px;
        }

        .probe-signal-wave {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(56, 189, 248, 0.6);
          animation: waveExpand 3s infinite ease-out;
        }

        .wave-1 { width: 50px; height: 50px; animation-delay: 0s; }
        .wave-2 { width: 90px; height: 90px; animation-delay: 1s; }
        .wave-3 { width: 140px; height: 140px; animation-delay: 2s; }

        @keyframes waveExpand {
          0% { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        /* Atmosphere Graphic Visual */
        .atmosphere-graphic {
          position: relative;
          width: 220px;
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .nebula-dust-cloud {
          position: absolute;
          border-radius: 50%;
          filter: blur(20px);
        }

        .cloud-1 {
          width: 140px;
          height: 140px;
          background: rgba(236, 72, 153, 0.25);
          top: 20px;
          left: 20px;
        }

        .cloud-2 {
          width: 130px;
          height: 130px;
          background: rgba(56, 189, 248, 0.3);
          bottom: 20px;
          right: 20px;
        }

        .planetary-limb {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border-top: 3px solid rgba(147, 197, 253, 0.9);
          border-right: 3px solid rgba(147, 197, 253, 0.6);
          transform: rotate(45deg);
          box-shadow: 0 -10px 30px rgba(56, 189, 248, 0.5);
        }

        .spectrograph-emission-lines {
          position: absolute;
          width: 180px;
          height: 2px;
          background: linear-gradient(90deg, #38bdf8 15%, transparent 15%, transparent 25%, #ec4899 25%, #ec4899 35%, transparent 35%, transparent 50%, #f59e0b 50%, #f59e0b 60%, transparent 60%, transparent 80%, #10b981 80%, #10b981 90%, transparent 90%);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
          bottom: 40px;
        }

        @keyframes rotateHalo {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes rotateHaloReverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        @keyframes photonPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 0.95; }
        }

        .singularity-overlay-meta {
          position: absolute;
          top: 0.85rem;
          left: 0.85rem;
          z-index: 5;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .cosmic-badge-tag {
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          font-weight: 800;
          color: #f59e0b;
          letter-spacing: 0.08em;
          text-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
        }

        .cosmic-badge-val {
          font-family: var(--font-mono, monospace);
          font-size: 0.58rem;
          font-weight: 600;
          color: #38bdf8;
          letter-spacing: 0.06em;
        }

        .audio-spectrogram-strip {
          position: absolute;
          bottom: 0.75rem;
          left: 1rem;
          right: 1rem;
          height: 28px;
          display: flex;
          align-items: flex-end;
          gap: 3px;
          z-index: 5;
        }

        .spectrum-bar {
          flex: 1;
          background: linear-gradient(to top, rgba(56, 189, 248, 0.3), #38bdf8);
          border-radius: 1px 1px 0 0;
          min-height: 4px;
        }

        .spectrum-bar.animating {
          animation: spectrumBounce 1.2s infinite ease-in-out;
        }

        @keyframes spectrumBounce {
          0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
          50% { transform: scaleY(1); opacity: 1; }
        }

        .singularity-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .stat-pill {
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 6px;
          padding: 0.5rem 0.65rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .stat-name {
          font-family: var(--font-mono, monospace);
          font-size: 0.58rem;
          font-weight: 700;
          color: var(--starlight, #94a3b8);
          letter-spacing: 0.06em;
        }

        .stat-number {
          font-family: var(--font-mono, monospace);
          font-size: 0.78rem;
          font-weight: 800;
          color: #ffffff;
        }

        /* Episode Content Column */
        .episode-content-col {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }

        .episode-tag-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
        }

        .series-pill, .host-pill {
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          font-weight: 700;
          background: rgba(30, 41, 59, 0.75);
          color: var(--starlight, #cbd5e1);
          border: 1px solid rgba(148, 163, 184, 0.25);
          padding: 0.25rem 0.65rem;
          border-radius: 4px;
          letter-spacing: 0.06em;
        }

        .badge-new {
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          font-weight: 800;
          background: rgba(245, 158, 11, 0.18);
          color: #f59e0b;
          border: 1px solid #f59e0b;
          padding: 0.25rem 0.65rem;
          border-radius: 4px;
          letter-spacing: 0.08em;
        }

        .episode-title {
          font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
          font-size: 1.45rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }

        .episode-synopsis {
          color: var(--starlight, #cbd5e1);
          font-size: 0.92rem;
          line-height: 1.6;
          margin: 0;
        }

        .spotify-embed-container {
          border-radius: 12px;
          overflow: hidden;
          background: #000000;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
        }

        .spotify-iframe {
          display: block;
          border: none;
        }

        /* Action Controls Strip */
        .transmission-actions-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
          align-items: center;
        }

        .btn-spotify-direct {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #1ed760;
          color: #000000;
          font-family: var(--font-mono, monospace);
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.6rem 1.1rem;
          border-radius: 6px;
          text-decoration: none;
          letter-spacing: 0.06em;
          transition: all 0.2s ease;
        }

        .btn-spotify-direct:hover {
          background: #22e668;
          box-shadow: 0 0 16px rgba(30, 215, 96, 0.4);
          transform: translateY(-1px);
        }

        .btn-spotify-show {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(30, 215, 96, 0.12);
          color: #1ed760;
          border: 1px solid #1ed760;
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.6rem 0.95rem;
          border-radius: 6px;
          text-decoration: none;
          letter-spacing: 0.06em;
          transition: all 0.2s ease;
        }

        .btn-spotify-show:hover {
          background: rgba(30, 215, 96, 0.22);
          box-shadow: 0 0 12px rgba(30, 215, 96, 0.25);
          transform: translateY(-1px);
        }

        .btn-copy-transmission, .btn-dossier-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(30, 41, 59, 0.75);
          color: var(--starlight, #cbd5e1);
          border: 1px solid rgba(148, 163, 184, 0.3);
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.6rem 0.95rem;
          border-radius: 6px;
          cursor: pointer;
          letter-spacing: 0.05em;
          transition: all 0.2s ease;
        }

        .btn-copy-transmission:hover, .btn-dossier-toggle:hover {
          background: rgba(56, 189, 248, 0.15);
          border-color: #38bdf8;
          color: #ffffff;
        }

        .btn-dossier-toggle.active {
          background: rgba(56, 189, 248, 0.22);
          border-color: #38bdf8;
          color: #38bdf8;
        }

        .chevron-indicator {
          font-size: 0.65rem;
        }

        /* Dossier Drawer */
        .dossier-drawer {
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(56, 189, 248, 0.35);
          border-radius: 8px;
          padding: 1.25rem;
          margin-top: 0.5rem;
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.6);
        }

        .dossier-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        @media (min-width: 768px) {
          .dossier-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .dossier-block {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .dossier-heading {
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          font-weight: 800;
          color: #38bdf8;
          letter-spacing: 0.08em;
        }

        .dossier-text {
          font-size: 0.85rem;
          line-height: 1.55;
          color: var(--starlight, #cbd5e1);
          margin: 0;
        }

        .dossier-footer {
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px dashed rgba(148, 163, 184, 0.25);
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          color: var(--starlight, #94a3b8);
          letter-spacing: 0.08em;
          text-align: center;
        }
        @media (max-width: 640px) {
          .broadcast-main-grid {
            padding: 1.25rem 1rem;
            gap: 1.5rem;
          }
          .singularity-frame {
            height: 240px;
          }
          .episode-title {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}
