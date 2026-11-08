/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

import React, { useState, useEffect } from 'react';
import { playTelemetryBeep } from '../../lib/audio';

interface RadioFrequencyPreset {
  id: string;
  name: string;
  freq: string;
  band: string;
  description: string;
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
    id: 'seti',
    name: 'SUB-SPACE EXTRASOLAR BEACON',
    freq: '1665.402 MHz',
    band: 'HYDROXYL RADICAL (OH)',
    description: 'Deep-space molecular line receiver tuned to cosmic radio emissions.',
  },
  {
    id: 'maser',
    name: 'WATER MASER RESONANCE',
    freq: '22235.08 MHz',
    band: 'K-BAND ASTROPHYSICS',
    description: 'High-frequency telemetry line mapped to active galactic nucleus relativistic gas accretion.',
  },
];

export default function PodcastTransmission(): React.ReactElement {
  const [selectedFreq, setSelectedFreq] = useState<RadioFrequencyPreset>(FREQUENCY_PRESETS[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [showDossier, setShowDossier] = useState<boolean>(false);
  const [visualizerActive, setVisualizerActive] = useState<boolean>(true);

  const podcastUrl = 'https://open.spotify.com/episode/7Cua98anBVaMCRzlCHi60D?si=E8OqIumUTTqXjRt5iAQHcA';
  const embedUrl = 'https://open.spotify.com/embed/episode/7Cua98anBVaMCRzlCHi60D?utm_source=generator&theme=0';

  const handleCopy = () => {
    playTelemetryBeep(1200, 0.08);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(podcastUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
    }
  };

  const handleFreqChange = (preset: RadioFrequencyPreset) => {
    playTelemetryBeep(980, 0.06);
    setSelectedFreq(preset);
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
            <span className="station-title">CALLISTO SUB-SPACE RADIO // WHISPERS OF THE UNIVERSE</span>
            <span className="station-sub">OFFICIAL CLUB PODCAST &bull; HOSTED BY SANJAY V V</span>
          </div>
        </div>

        {/* Radio Carrier Frequency Tuning Selector */}
        <div className="freq-selector-wrap">
          <span className="freq-label">CARRIER FREQ:</span>
          <div className="freq-chips">
            {FREQUENCY_PRESETS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => handleFreqChange(f)}
                className={`freq-chip ${selectedFreq.id === f.id ? 'active' : ''}`}
                title={`${f.name} - ${f.description}`}
              >
                {f.freq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Broadcast Console */}
      <div className="broadcast-main-grid">
        {/* Left Column: Singularity Hologram & Episode Cover */}
        <div className="singularity-visual-col">
          <div className="singularity-frame">
            {/* CSS / SVG Gravitational Lensing & Accretion Halo */}
            <div className="accretion-disk-graphic" aria-hidden="true">
              <div className="disk-halo outer" />
              <div className="disk-halo middle" />
              <div className="photon-sphere" />
              <div className="event-horizon-core" />
              <div className="relativistic-beam" />
            </div>

            {/* Overlaid Telemetry Badges */}
            <div className="singularity-overlay-meta">
              <div className="cosmic-badge-tag">TARGET: TON 618</div>
              <div className="cosmic-badge-val">ULTRAMASSIVE BLACK HOLE</div>
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
            <div className="stat-pill">
              <span className="stat-name">MASS</span>
              <span className="stat-number">66 Billion M☉</span>
            </div>
            <div className="stat-pill">
              <span className="stat-name">RADIUS</span>
              <span className="stat-number">~390 Billion km</span>
            </div>
            <div className="stat-pill">
              <span className="stat-name">DISTANCE</span>
              <span className="stat-number">18.2B Light Yrs</span>
            </div>
            <div className="stat-pill">
              <span className="stat-name">LUMINOSITY</span>
              <span className="stat-number">140 Trillion Suns</span>
            </div>
          </div>
        </div>

        {/* Right Column: Audio Player & Editorial Details */}
        <div className="episode-content-col">
          <div className="episode-tag-row">
            <span className="series-pill">SERIES: WHISPERS OF THE UNIVERSE</span>
            <span className="host-pill">HOST: SANJAY V V</span>
            <span className="badge-new">FEATURED TRANSMISSION</span>
          </div>

          <h3 className="episode-title">TON 618 &ndash; Exploring the Giant Black Hole</h3>

          <p className="episode-synopsis">
            Journey past the cosmological event horizon of TON 618&mdash;the most titanic ultramassive black hole ever documented in observational astrophysics. Host <strong>Sanjay V V</strong> breaks down the staggering mechanics of this 66-billion-solar-mass singularity, the physics of hyper-accretion disks, and what its extraordinary light reveals about the dawn of early galaxies.
          </p>

          {/* Live Spotify Audio Player Iframe */}
          <div className="spotify-embed-container">
            <iframe
              src={embedUrl}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Embed: TON 618 – Exploring the Giant Black Hole by Sanjay V V"
              className="spotify-iframe"
            />
          </div>

          {/* Interactive Action Controls */}
          <div className="transmission-actions-strip">
            <a
              href={podcastUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-spotify-direct"
              aria-label="Open TON 618 podcast episode directly on Spotify in a new tab"
            >
              {/* Spotify Official Vector Logo */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.494 17.306c-.215.353-.674.464-1.027.249-2.812-1.718-6.352-2.107-10.523-1.154-.403.092-.806-.16-.898-.563-.092-.403.16-.806.563-.898 4.568-1.044 8.487-.6 11.636 1.339.353.215.464.674.249 1.027zm1.468-3.264c-.27.44-.847.579-1.287.31-3.219-1.978-8.125-2.55-11.932-1.393-.497.151-1.025-.133-1.176-.63-.151-.497.133-1.025.63-1.176 4.35-1.32 9.757-.68 13.455 1.593.44.27.579.847.31 1.287zm.126-3.411c-3.86-2.292-10.223-2.503-13.886-1.391-.592.18-1.222-.154-1.402-.746-.18-.592.154-1.222.746-1.402 4.225-1.283 11.237-1.037 15.684 1.603.533.316.707 1.009.391 1.542-.316.533-1.009.707-1.542.391z" />
              </svg>
              <span>LISTEN ON SPOTIFY</span>
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
            <div className="dossier-drawer" role="region" aria-label="TON 618 Astrophysics Briefing">
              <div className="dossier-grid">
                <div className="dossier-block">
                  <span className="dossier-heading">SINGULARITY CLASSIFICATION</span>
                  <p className="dossier-text">
                    TON 618 is an extreme, optically violent variable radio-loud quasar located near the border of Canes Venatici and Coma Berenices. Its central supermassive engine is so massive that it exceeds the mass of all stars in the Milky Way combined by more than thirty times.
                  </p>
                </div>
                <div className="dossier-block">
                  <span className="dossier-heading">ACCRETION DISK & EDDINGTON LIMIT</span>
                  <p className="dossier-text">
                    The broad absorption lines in its spectrum indicate infalling plasma traveling at over 7,000 kilometers per second. The accretion disk shines with the incandescent power of 140 trillion suns, outshining its host galaxy and ionising gas clouds thousands of light-years across.
                  </p>
                </div>
              </div>
              <div className="dossier-footer">
                <span>PODCAST CREATED BY CIT CALLISTO STARCAST TEAM &bull; PRODUCED BY SANJAY V V</span>
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
          font-size: 0.625rem;
          font-weight: 700;
          color: var(--steel, #94a3b8);
          letter-spacing: 0.08em;
        }

        .freq-chips {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
        }

        .freq-chip {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(56, 189, 248, 0.25);
          color: var(--steel, #94a3b8);
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.25rem 0.55rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .freq-chip:hover {
          color: #ffffff;
          border-color: var(--orbit, #38bdf8);
        }

        .freq-chip.active {
          background: color-mix(in srgb, var(--orbit, #38bdf8) 20%, transparent);
          color: var(--orbit, #38bdf8);
          border-color: var(--orbit, #38bdf8);
          font-weight: 700;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
        }

        /* Broadcast Main Grid */
        .broadcast-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.75rem;
          padding: 1.75rem;
        }

        @media (min-width: 900px) {
          .broadcast-main-grid {
            grid-template-columns: 340px 1fr;
            align-items: start;
          }
        }

        /* Singularity Column */
        .singularity-visual-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .singularity-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          background: radial-gradient(circle at center, #020617 0%, #000000 100%);
          border: 1px solid rgba(245, 158, 11, 0.35);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 0 40px rgba(245, 158, 11, 0.15);
        }

        /* Simulated Black Hole Accretion Disk */
        .accretion-disk-graphic {
          position: relative;
          width: 220px;
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .disk-halo.outer {
          position: absolute;
          width: 210px;
          height: 100px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(245, 158, 11, 0.85) 0%, rgba(239, 68, 68, 0.6) 45%, transparent 75%);
          filter: blur(10px);
          transform: rotate(-18deg);
          animation: spinAccretion 20s linear infinite;
        }

        .disk-halo.middle {
          position: absolute;
          width: 170px;
          height: 70px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(254, 240, 138, 0.95) 0%, rgba(245, 158, 11, 0.75) 50%, transparent 80%);
          filter: blur(5px);
          transform: rotate(-18deg);
        }

        .photon-sphere {
          position: absolute;
          width: 95px;
          height: 95px;
          border-radius: 50%;
          border: 2px solid rgba(254, 240, 138, 0.85);
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.9), inset 0 0 12px rgba(239, 68, 68, 0.8);
        }

        .event-horizon-core {
          position: absolute;
          width: 86px;
          height: 86px;
          border-radius: 50%;
          background: #000000;
          box-shadow: 0 0 25px #000000, 0 0 8px rgba(0, 0, 0, 0.9);
          z-index: 2;
        }

        .relativistic-beam {
          position: absolute;
          width: 180px;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.9) 50%, transparent 100%);
          transform: rotate(-18deg);
          filter: blur(1px);
          z-index: 3;
        }

        @keyframes spinAccretion {
          0% { transform: rotate(-18deg) scale(1); }
          50% { transform: rotate(-15deg) scale(1.04); }
          100% { transform: rotate(-18deg) scale(1); }
        }

        .singularity-overlay-meta {
          position: absolute;
          top: 0.85rem;
          left: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          z-index: 4;
        }

        .cosmic-badge-tag {
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          font-weight: 800;
          color: #f59e0b;
          letter-spacing: 0.08em;
        }

        .cosmic-badge-val {
          font-family: var(--font-mono, monospace);
          font-size: 0.58rem;
          color: var(--steel, #94a3b8);
          letter-spacing: 0.06em;
        }

        /* Audio Spectrogram Strip */
        .audio-spectrogram-strip {
          position: absolute;
          bottom: 0.75rem;
          left: 1rem;
          right: 1rem;
          height: 24px;
          display: flex;
          align-items: flex-end;
          gap: 3px;
          z-index: 4;
          background: rgba(2, 6, 23, 0.65);
          padding: 3px 6px;
          border-radius: 4px;
          border: 1px solid rgba(56, 189, 248, 0.2);
        }

        .spectrum-bar {
          flex: 1;
          background: linear-gradient(to top, #0284c7 0%, #38bdf8 60%, #1ed760 100%);
          border-radius: 1px;
          transition: height 0.15s ease;
        }

        .spectrum-bar.animating {
          animation: spectrumPulse 0.9s infinite alternate ease-in-out;
        }

        @keyframes spectrumPulse {
          0% { transform: scaleY(0.3); opacity: 0.5; }
          100% { transform: scaleY(1); opacity: 1; }
        }

        /* Singularity Stats Grid */
        .singularity-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }

        .stat-pill {
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(51, 65, 85, 0.4);
          border-radius: 6px;
          padding: 0.5rem 0.65rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .stat-name {
          font-family: var(--font-mono, monospace);
          font-size: 0.58rem;
          color: #94a3b8;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .stat-number {
          font-family: var(--font-mono, monospace);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--moon, #ffffff);
        }

        /* Episode Content Column */
        .episode-content-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .episode-tag-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .series-pill {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.35);
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          letter-spacing: 0.06em;
        }

        .host-pill {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.35);
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          letter-spacing: 0.06em;
        }

        .badge-new {
          background: #ef4444;
          color: #ffffff;
          font-family: var(--font-mono, monospace);
          font-size: 0.58rem;
          font-weight: 800;
          padding: 0.15rem 0.45rem;
          border-radius: 3px;
          letter-spacing: 0.08em;
        }

        .episode-title {
          font-family: var(--font-display, sans-serif);
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--moon, #ffffff);
          line-height: 1.25;
          margin: 0;
          letter-spacing: -0.01em;
        }

        @media (min-width: 768px) {
          .episode-title {
            font-size: 1.75rem;
          }
        }

        .episode-synopsis {
          font-family: var(--font-body, sans-serif);
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--star, #cbd5e1);
          margin: 0;
        }

        .episode-synopsis strong {
          color: #ffffff;
        }

        /* Spotify Player Embed */
        .spotify-embed-container {
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          background: #000000;
          border: 1px solid rgba(56, 189, 248, 0.25);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
        }

        .spotify-iframe {
          display: block;
          border: none;
          min-height: 152px;
        }

        /* Action Controls Strip */
        .transmission-actions-strip {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .btn-spotify-direct {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #1ed760;
          color: #000000;
          border: 1px solid #1ed760;
          border-radius: var(--radius-sm, 6px);
          padding: 0.55rem 1.15rem;
          font-family: var(--font-mono, monospace);
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-decoration: none;
          box-shadow: 0 0 16px rgba(30, 215, 96, 0.35);
          transition: all 0.2s ease;
        }

        .btn-spotify-direct:hover {
          background: #1fdf64;
          transform: translateY(-2px);
          box-shadow: 0 0 24px rgba(30, 215, 96, 0.55);
        }

        .btn-copy-transmission,
        .btn-dossier-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(15, 23, 42, 0.75);
          color: var(--moon, #ffffff);
          border: 1px solid color-mix(in srgb, var(--steel, #475569) 40%, transparent);
          border-radius: var(--radius-sm, 6px);
          padding: 0.55rem 0.95rem;
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-copy-transmission:hover,
        .btn-dossier-toggle:hover {
          background: rgba(56, 189, 248, 0.15);
          border-color: var(--orbit, #38bdf8);
          color: #ffffff;
        }

        .btn-dossier-toggle.active {
          background: color-mix(in srgb, var(--orbit, #38bdf8) 20%, transparent);
          border-color: var(--orbit, #38bdf8);
          color: var(--orbit, #38bdf8);
        }

        .chevron-indicator {
          font-size: 0.6rem;
        }

        /* Dossier Drawer */
        .dossier-drawer {
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-top: 0.5rem;
        }

        .dossier-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.85rem;
        }

        @media (min-width: 640px) {
          .dossier-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .dossier-block {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .dossier-heading {
          font-family: var(--font-mono, monospace);
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--orbit, #38bdf8);
          letter-spacing: 0.08em;
        }

        .dossier-text {
          font-family: var(--font-body, sans-serif);
          font-size: 0.78rem;
          color: var(--star, #cbd5e1);
          line-height: 1.5;
          margin: 0;
        }

        .dossier-footer {
          border-top: 1px solid rgba(51, 65, 85, 0.4);
          padding-top: 0.5rem;
          font-family: var(--font-mono, monospace);
          font-size: 0.6rem;
          color: #94a3b8;
          letter-spacing: 0.08em;
        }

        /* ========================================================
           LIGHT MODE (SOLAR FLARE) CONTRAST & LEGIBILITY OVERRIDES
           ======================================================== */
        html[data-theme="solar-flare"] .podcast-transmission-card,
        html.theme-solar-flare .podcast-transmission-card,
        html.light-mode .podcast-transmission-card {
          background-color: rgba(255, 255, 255, 0.95) !important;
          border-color: rgba(0, 0, 0, 0.16) !important;
          box-shadow: 0 8px 32px rgba(15, 23, 42, 0.08) !important;
        }

        html[data-theme="solar-flare"] .radio-header-bar,
        html.theme-solar-flare .radio-header-bar,
        html.light-mode .radio-header-bar {
          background: #f8fafc !important;
          border-color: rgba(0, 0, 0, 0.1) !important;
        }

        html[data-theme="solar-flare"] .station-title,
        html.theme-solar-flare .station-title,
        html.light-mode .station-title,
        html[data-theme="solar-flare"] .episode-title,
        html.theme-solar-flare .episode-title,
        html.light-mode .episode-title {
          color: #0f172a !important;
        }

        html[data-theme="solar-flare"] .station-sub,
        html.theme-solar-flare .station-sub,
        html.light-mode .station-sub {
          color: #0284c7 !important;
        }

        html[data-theme="solar-flare"] .episode-synopsis,
        html.theme-solar-flare .episode-synopsis,
        html.light-mode .episode-synopsis {
          color: #334155 !important;
        }

        html[data-theme="solar-flare"] .stat-pill,
        html.theme-solar-flare .stat-pill,
        html.light-mode .stat-pill {
          background: #f1f5f9 !important;
          border-color: rgba(0, 0, 0, 0.1) !important;
        }

        html[data-theme="solar-flare"] .stat-number,
        html.theme-solar-flare .stat-number,
        html.light-mode .stat-number {
          color: #0f172a !important;
        }

        html[data-theme="solar-flare"] .btn-copy-transmission,
        html.theme-solar-flare .btn-copy-transmission,
        html.light-mode .btn-copy-transmission,
        html[data-theme="solar-flare"] .btn-dossier-toggle,
        html.theme-solar-flare .btn-dossier-toggle,
        html.light-mode .btn-dossier-toggle {
          background: #f1f5f9 !important;
          color: #0f172a !important;
          border-color: rgba(0, 0, 0, 0.15) !important;
        }

        html[data-theme="solar-flare"] .dossier-drawer,
        html.theme-solar-flare .dossier-drawer,
        html.light-mode .dossier-drawer {
          background: #f8fafc !important;
          border-color: rgba(0, 0, 0, 0.12) !important;
        }

        html[data-theme="solar-flare"] .dossier-text,
        html.theme-solar-flare .dossier-text,
        html.light-mode .dossier-text {
          color: #334155 !important;
        }

        /* Mobile Adjustments */
        @media (max-width: 640px) {
          .radio-header-bar {
            padding: 0.85rem 1rem;
          }
          .broadcast-main-grid {
            padding: 1rem 0.75rem;
            gap: 1.25rem;
          }
          .episode-title {
            font-size: 1.25rem;
          }
          .transmission-actions-strip {
            flex-direction: column;
            width: 100%;
          }
          .btn-spotify-direct,
          .btn-copy-transmission,
          .btn-dossier-toggle {
            width: 100%;
            justify-content: center;
            box-sizing: border-box;
          }
        }
      `}</style>
    </div>
  );
}
