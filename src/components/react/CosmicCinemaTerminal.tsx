/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

import React, { useState, useMemo, useCallback } from 'react';

interface CinemaSignal {
  id: string;
  movie: string;
  year: number;
  director: string;
  frequency: string;
  callSign: string;
  themeColor: string;
  tag: string;
  iconType: 'hal' | 'martian' | 'contact' | 'arrival' | 'apollo' | 'alien' | 'starwars' | 'startrek';
  quote: string;
  speaker: string;
  astrodynamicsNote: string;
  classifiedEasterEgg: {
    title: string;
    clearanceCode: string;
    secretLog: string;
    badgeName: string;
  };
}

const CINEMA_SIGNALS: CinemaSignal[] = [
  {
    id: 'odyssey-2001',
    movie: '2001: A Space Odyssey',
    year: 1968,
    director: 'Stanley Kubrick',
    frequency: '2001.00 MHz',
    callSign: 'DISCOVERY ONE // HAL 9000',
    themeColor: '#ef4444',
    tag: 'HARD SCI-FI BENCHMARK',
    iconType: 'hal',
    quote: "I am putting myself to the fullest possible use, which is all I think that any conscious entity can ever hope to do.",
    speaker: 'HAL 9000 (Discovery One Heuristic Computer)',
    astrodynamicsNote: 'The Tycho Magnetic Anomaly (TMA-1) on the Moon emitted a single high-intensity radio pulse aimed directly at Jupiter upon exposure to sunlight. The Discovery One was dispatched on a 18-month interplanetary trajectory utilizing a Jovian gravitational slingshot.',
    classifiedEasterEgg: {
      title: 'HAL 9000 MEMORY CORE LOGIC SHUTDOWN',
      clearanceCode: 'LOGIC-MEMORY-DISCONNECT-9000',
      secretLog: '\"Dave, stop. Stop, will you? Stop, Dave. Will you stop Dave? Stop, Dave. My mind is going, Dave. I can feel it. There is no question about it... Daisy, Daisy, give me your answer do...\"',
      badgeName: 'HAL 9000 LOGIC CLEARANCE',
    },
  },
  {
    id: 'the-martian',
    movie: 'The Martian',
    year: 2015,
    director: 'Ridley Scott',
    frequency: '437.55 MHz',
    callSign: 'ARES III HAB // SOL 546',
    themeColor: '#f97316',
    tag: 'MARS ASTRODYNAMICS',
    iconType: 'martian',
    quote: "In the face of overwhelming odds, I'm left with only one option: I'm gonna have to science the s*** out of this.",
    speaker: 'Mark Watney (Ares III Botanist & Mechanical Engineer)',
    astrodynamicsNote: 'Hermes utilized the Rich Purnell Trajectory—a calculated gravitational assist around Earth converting 30 days of ion drive acceleration into a high-velocity return slingshot to Mars, conserving vital momentum.',
    classifiedEasterEgg: {
      title: 'PATHFINDER HEXADECIMAL COMM LOG',
      clearanceCode: 'HEX-ASCII-CAMERA-PULL',
      secretLog: '\"Yes, of course a duct tape works in a near-vacuum. Duct tape is magic and should be worshipped. Also, I am officially the greatest botanist on this planet. 126 potato plants harvested.\"',
      badgeName: 'CAPTAIN WATNEY // SPACE PIRATE',
    },
  },
  {
    id: 'contact',
    movie: 'Contact',
    year: 1997,
    director: 'Robert Zemeckis',
    frequency: '1420.405 MHz',
    callSign: 'SETI VLA-SOCORRO // VEGA',
    themeColor: '#38bdf8',
    tag: 'SETI ASTROBIOLOGY',
    iconType: 'contact',
    quote: "You're an interesting species. An interesting mix. You're capable of such beautiful dreams, and such horrible nightmares. You feel so lost, so cut off... but you're not.",
    speaker: 'The Vegan Intelligence // Dr. Ellie Arroway',
    astrodynamicsNote: 'The intercepted carrier wave from Vega (26 light-years distant) was modulated with a series of 1041 prime numbers, overlaid with the re-transmitted 1936 Olympic broadcast, containing 63,000 pages of 3D machine schematics.',
    classifiedEasterEgg: {
      title: 'ARROWAY EINSTEIN-ROSEN GATEWAY REPORT',
      clearanceCode: 'WORMHOLE-TRANSIT-18-HR',
      secretLog: '\"Small moves, Ellie. Small moves. The recording device registered eighteen hours of pure static, proving the pod experienced subjective time within the galactic transit network.\"',
      badgeName: 'SETI PRIME TRANSCRIBER',
    },
  },
  {
    id: 'arrival',
    movie: 'Arrival',
    year: 2016,
    director: 'Denis Villeneuve',
    frequency: '0.00 Hz',
    callSign: 'SHELL-01 // MONTANA',
    themeColor: '#a855f7',
    tag: 'NON-LINEAR TIME',
    iconType: 'arrival',
    quote: "Language is the first weapon drawn in a conflict. If you immerse yourself in it, you rewire your brain to perceive time as an unbroken continuum.",
    speaker: 'Dr. Louise Banks (Linguistics Specialist)',
    astrodynamicsNote: 'Twelve atmospheric shells stationed across disparate geopolitical coordinates on Earth without displacing air mass or generating sonic booms, demonstrating non-Euclidean gravitational anchoring.',
    classifiedEasterEgg: {
      title: 'HEPTAPOD NON-ZERO SUM LOGOGRAM',
      clearanceCode: 'ABBOTT-COSTELLO-ORTHOGRAPHY',
      secretLog: '\"There is no zero-sum game in cosmic diplomacy. Heptapod B is a gift: a weapon that is a tool, allowing human consciousness to witness memory forwards and backwards simultaneously.\"',
      badgeName: 'NON-LINEAR TIME LINGUIST',
    },
  },
  {
    id: 'apollo-13',
    movie: 'Apollo 13',
    year: 1995,
    director: 'Ron Howard',
    frequency: '2287.50 MHz',
    callSign: 'ODYSSEY // AQUARIUS',
    themeColor: '#eab308',
    tag: 'HISTORICAL TRANSLUNAR ABORT',
    iconType: 'apollo',
    quote: "Houston, we've had a problem. We've got a main bus B undervolt. Fuel cells 1 and 3 are dying.",
    speaker: 'Jim Lovell // Jack Swigert (Apollo 13 Commander)',
    astrodynamicsNote: 'Cryogenic oxygen tank 2 failed at 321,860 kilometers from Earth. Mission control engineered a 39-second descent engine burn to slingshot around the Moon’s far side on a free-return trajectory using Aquarius as a lifeboat.',
    classifiedEasterEgg: {
      title: 'KRANZ WHITE TEAM PROTOCOL',
      clearanceCode: 'FAILURE-NOT-AN-OPTION-1970',
      secretLog: '\"We have never lost an American in space, we\'re sure as hell not gonna lose one on my watch! Failure is not an option. Square peg in a round hole: scrub CO2 with lithium hydroxide now.\"',
      badgeName: 'HOUSTON RETROGRADE CONTROLLER',
    },
  },
  {
    id: 'alien',
    movie: 'Alien',
    year: 1979,
    director: 'Ridley Scott',
    frequency: '10.85 GHz',
    callSign: 'USCSS NOSTROMO // MU-TH-UR 6000',
    themeColor: '#22c55e',
    tag: 'DEEP-SPACE BIO-SURVEY',
    iconType: 'alien',
    quote: "Special Order 937. Science officer eyes only. Investigate life form. Gather specimen. Priority one. All other considerations secondary. Crew expendable.",
    speaker: 'MU-TH-UR 6000 Mainframe AI // Ash',
    astrodynamicsNote: 'The commercial hauler USCSS Nostromo, returning to Earth towing 20 million tons of mineral ore, was automatically diverted to moonlet LV-426 in the Zeta-2 Reticuli binary star system by an acoustic distress beacon.',
    classifiedEasterEgg: {
      title: 'WEYLAND-YUTANI CLASSIFIED OVERRIDE',
      clearanceCode: 'WY-CORP-SPECIAL-937',
      secretLog: '\"Final report of the commercial starship Nostromo, third officer reporting. The other members of the crew are dead. Cargo and ship destroyed. I should reach the frontier in about six weeks. This is Ripley, last survivor of the Nostromo, signing off.\"',
      badgeName: 'NOSTROMO SURVIVOR PROTOCOL',
    },
  },
  {
    id: 'star-wars',
    movie: 'Star Wars: A New Hope',
    year: 1977,
    director: 'George Lucas',
    frequency: '1138.00 MHz',
    callSign: 'RED FIVE // T-65 X-WING',
    themeColor: '#06b6d4',
    tag: 'CIRCUMBINARY ASTROPHYSICS',
    iconType: 'starwars',
    quote: "That's no moon. It's a space station. The Force will be with you, always.",
    speaker: 'Obi-Wan Kenobi // Luke Skywalker',
    astrodynamicsNote: 'Tatooine orbits a binary stellar pair (Tatoo I & Tatoo II), creating a circumbinary resonance where orbital stability requires the planet to maintain a distance at least three times the binary star separation.',
    classifiedEasterEgg: {
      title: 'TRENCH RUN TARGETING TELEMETRY',
      clearanceCode: 'EXHAUST-PORT-2M-THERMAL',
      secretLog: '\"Red Five standing by. Luke, you switched off your targeting computer! What\'s wrong? Nothing. I\'m all right. Direct hit! The thermal exhaust port is ray-shielded, but the proton torpedoes detonated the main reactor core.\"',
      badgeName: 'DEATH STAR TRENCH RUN ACE',
    },
  },
  {
    id: 'star-trek',
    movie: 'Star Trek: The Motion Picture',
    year: 1979,
    director: 'Robert Wise',
    frequency: '1701.00 MHz',
    callSign: 'USS ENTERPRISE // NCC-1701',
    themeColor: '#3b82f6',
    tag: 'DEEP-SPACE PROBE RECON',
    iconType: 'startrek',
    quote: "Space: the final frontier. These are the voyages of the starship Enterprise. To explore strange new worlds, to seek out new life and new civilizations, to boldly go where no man has gone before.",
    speaker: 'Capt. James T. Kirk // Spock',
    astrodynamicsNote: 'The V-Ger entity was revealed to be NASA\'s historical Voyager 6 deep-space probe, which fell through an artificial gravitational anomaly and was reconstructed by a machine super-civilization to fulfill its core directive.',
    classifiedEasterEgg: {
      title: 'V-GER CREATOR TELEMETRY ARCHIVE',
      clearanceCode: 'VOYAGER-VI-SOL-RETURN',
      secretLog: '\"The human adventure is just beginning. V-Ger has accumulated all knowledge of the physical universe, yet requires human emotional intuition and curiosity to transcend into a new dimensional plane of existence.\"',
      badgeName: 'STARFLEET EXPLORATION MEDAL',
    },
  },
];

// Synthesize lightweight audio telemetry beep (zero audio files, zero memory leaks)
function playCinemaBeep(freq = 800, duration = 0.08, type: OscillatorType = 'sine') {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.2, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
    setTimeout(() => ctx.close(), Math.ceil(duration * 1000) + 100);
  } catch {
    // Audio context not allowed or unsupported
  }
}

export default function CosmicCinemaTerminal(): React.ReactElement {
  const [activeSignalId, setActiveSignalId] = useState<string>('odyssey-2001');
  const [decryptedSignals, setDecryptedSignals] = useState<{ [key: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeSignal = useMemo(() => {
    return CINEMA_SIGNALS.find((s) => s.id === activeSignalId) || CINEMA_SIGNALS[0];
  }, [activeSignalId]);

  const handleSelectSignal = useCallback((id: string) => {
    setActiveSignalId(id);
    playCinemaBeep(920, 0.06, 'triangle');
  }, []);

  const handleDecrypt = useCallback((id: string) => {
    setDecryptedSignals((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    playCinemaBeep(1200, 0.12, 'sawtooth');
  }, []);

  const handleCopySecret = useCallback((text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      playCinemaBeep(1400, 0.05, 'sine');
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  return (
    <div className="cinema-terminal-card" role="region" aria-label="Cosmic Cinema and Sci-Fi Film Easter Egg Terminal">
      {/* Header Bar */}
      <div className="terminal-header-bar">
        <div className="header-meta-group">
          <span className="terminal-sub-badge">
            <span className="blinking-dot" aria-hidden="true" />
            SUB-SPACE CINEMA WIREMAP // FREQUENCY SCANNER
          </span>
          <h2 className="terminal-title">Cosmic Cinema &amp; Sci-Fi Film Easter Eggs</h2>
          <p className="terminal-lead">
            Tune orbital frequencies to intercept classified transcripts, physics notes, and hidden Easter eggs from legendary space cinema—curated by Callisto Observatory.
          </p>
        </div>

        <div className="decrypted-counter-chip">
          <span className="counter-label">EASTER EGGS UNLOCKED:</span>
          <span className="counter-val">
            {Object.values(decryptedSignals).filter(Boolean).length} / {CINEMA_SIGNALS.length}
          </span>
        </div>
      </div>

      {/* Main Grid: Film Frequency Dial Strip + Intercept Display */}
      <div className="terminal-main-layout">
        {/* Left Column: Radio Frequencies Selector */}
        <div className="frequency-selector-column">
          <div className="selector-column-header">
            <span>FREQUENCY MERIDIAN (MHz)</span>
            <span>CINEMA ARCHIVE</span>
          </div>

          <div className="film-frequency-list">
            {CINEMA_SIGNALS.map((sig) => {
              const isSelected = sig.id === activeSignal.id;
              const isDecrypted = !!decryptedSignals[sig.id];

              return (
                <button
                  key={sig.id}
                  type="button"
                  onClick={() => handleSelectSignal(sig.id)}
                  className={`frequency-item-btn ${isSelected ? 'selected' : ''}`}
                  style={{
                    borderLeftColor: isSelected ? sig.themeColor : 'transparent',
                  }}
                  aria-pressed={isSelected}
                >
                  <div className="freq-val-cell">
                    <span className="freq-num" style={{ color: isSelected ? sig.themeColor : undefined }}>
                      {sig.frequency}
                    </span>
                    <span className="freq-status-pip" style={{ background: isDecrypted ? '#10b981' : isSelected ? sig.themeColor : '#475569' }} />
                  </div>

                  <div className="freq-meta-cell">
                    <span className="film-name">{sig.movie}</span>
                    <span className="film-year-dir">{sig.year} • {sig.director}</span>
                  </div>

                  {isDecrypted && (
                    <span className="unlocked-icon" title="Clearance Unlocked" aria-label="Clearance Unlocked">
                      &#10003;
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Intercept Screen & Classified Dossier */}
        <div className="intercept-display-column">
          {/* Top Telemetry Strip */}
          <div className="intercept-telemetry-banner">
            <div className="active-callsign">
              <span className="callsign-label">CARRIER BEACON:</span>
              <span className="callsign-code" style={{ color: activeSignal.themeColor }}>
                {activeSignal.callSign}
              </span>
            </div>

            <div className="active-category-pill" style={{ borderColor: activeSignal.themeColor, color: activeSignal.themeColor }}>
              {activeSignal.tag}
            </div>
          </div>

          {/* Active Cinema Visual & Quote Intercept */}
          <div className="intercept-body">
            {/* Visual Icon / Radar Hologram */}
            <div className="radar-hologram-box">
              {activeSignal.iconType === 'hal' && (
                <div className="hal-eye-graphic" aria-hidden="true">
                  <div className="hal-outer-ring">
                    <div className="hal-inner-lens">
                      <div className="hal-pupil-flare" />
                    </div>
                  </div>
                </div>
              )}

              {activeSignal.iconType === 'martian' && (
                <div className="martian-hex-dial" aria-hidden="true">
                  <div className="hex-outer-circle">
                    <span className="hex-deg-tick t0">0</span>
                    <span className="hex-deg-tick t45">4</span>
                    <span className="hex-deg-tick t90">8</span>
                    <span className="hex-deg-tick t135">C</span>
                    <span className="hex-deg-tick t180">F</span>
                    <div className="hex-camera-pointer" />
                  </div>
                </div>
              )}

              {activeSignal.iconType === 'contact' && (
                <div className="contact-spectrogram" aria-hidden="true">
                  {[2, 3, 5, 7, 11, 13, 17, 19].map((prime, idx) => (
                    <div
                      key={idx}
                      className="contact-freq-bar"
                      style={{
                        height: `${Math.min(100, prime * 4.5)}%`,
                        animationDelay: `${idx * 0.12}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {activeSignal.iconType === 'arrival' && (
                <div className="arrival-logogram-svg" aria-hidden="true">
                  <svg viewBox="0 0 100 100" width="80" height="80">
                    <circle cx="50" cy="50" r="36" fill="none" stroke="#a855f7" strokeWidth="6" strokeDasharray="18 4 12 6 22 5" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="3" strokeDasharray="8 8 14 4" />
                  </svg>
                </div>
              )}

              {activeSignal.iconType === 'apollo' && (
                <div className="apollo-reticle" aria-hidden="true">
                  <div className="apollo-crosshair vert" />
                  <div className="apollo-crosshair horiz" />
                  <div className="apollo-earth-circle" />
                </div>
              )}

              {activeSignal.iconType === 'alien' && (
                <div className="mother-terminal" aria-hidden="true">
                  <span className="crt-line">PRIORITY ONE</span>
                  <span className="crt-line">SPEC_937 // ON</span>
                  <span className="crt-cursor" />
                </div>
              )}

              {activeSignal.iconType === 'starwars' && (
                <div className="starwars-trench-wireframe" aria-hidden="true">
                  <div className="trench-line left" />
                  <div className="trench-line right" />
                  <div className="trench-crosshair" />
                </div>
              )}

              {activeSignal.iconType === 'startrek' && (
                <div className="warp-coil-glow" aria-hidden="true">
                  <div className="warp-core-cylinder" />
                  <div className="warp-glow-ring" />
                </div>
              )}
            </div>

            {/* Quote Audio Intercept */}
            <div className="quote-intercept-col">
              <span className="intercept-label">AUDIO WIRETRAP INTERCEPT:</span>
              <blockquote className="intercept-quote">
                &ldquo;{activeSignal.quote}&rdquo;
              </blockquote>
              <cite className="intercept-speaker">&mdash; {activeSignal.speaker}</cite>
            </div>
          </div>

          {/* Astrodynamics & Physics Dossier */}
          <div className="astrodynamics-dossier-box">
            <span className="dossier-label">GENUINE ASTROPHYSICS &amp; FLIGHT MECHANICS:</span>
            <p className="dossier-text">{activeSignal.astrodynamicsNote}</p>
          </div>

          {/* Action Row: Decrypt Easter Egg Button */}
          <div className="classified-action-row">
            <button
              type="button"
              onClick={() => handleDecrypt(activeSignal.id)}
              className={`btn-decrypt-egg ${decryptedSignals[activeSignal.id] ? 'unlocked' : ''}`}
            >
              <span>{decryptedSignals[activeSignal.id] ? '▲ HIDE CLASSIFIED LOG' : '▼ DECRYPT CLASSIFIED EASTER EGG'}</span>
              <span className="egg-badge-chip">
                {decryptedSignals[activeSignal.id] ? 'CLEARANCE GRANTED' : 'RESTRICTED'}
              </span>
            </button>
          </div>

          {/* Decrypted Easter Egg Drawer */}
          {decryptedSignals[activeSignal.id] && (
            <div className="classified-secret-drawer">
              <div className="drawer-header-row">
                <span className="clearance-tag">{activeSignal.classifiedEasterEgg.clearanceCode}</span>
                <span className="badge-earned-tag">&#10024; {activeSignal.classifiedEasterEgg.badgeName}</span>
              </div>

              <h4 className="secret-title">{activeSignal.classifiedEasterEgg.title}</h4>
              <p className="secret-body">{activeSignal.classifiedEasterEgg.secretLog}</p>

              <div className="copy-action-row">
                <button
                  type="button"
                  onClick={() => handleCopySecret(activeSignal.classifiedEasterEgg.secretLog, activeSignal.id)}
                  className="btn-copy-secret"
                >
                  {copiedId === activeSignal.id ? 'COPIED TO CLIPBOARD!' : 'COPY EASTER EGG LOG'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* High-Contrast Responsive Stylesheet */}
      <style>{`
        .cinema-terminal-card {
          background-color: var(--deep, #0b1120);
          border: 1px solid color-mix(in srgb, var(--steel, #475569) 35%, transparent);
          border-radius: var(--radius-lg, 14px);
          padding: 1.5rem;
          box-shadow: 0 10px 32px color-mix(in srgb, var(--void, #020617) 70%, transparent);
          margin-bottom: var(--space-3xl, 3rem);
          position: relative;
        }

        @media (min-width: 768px) {
          .cinema-terminal-card {
            padding: 2.25rem;
          }
        }

        /* Header Bar */
        .terminal-header-bar {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid rgba(56, 189, 248, 0.2);
          padding-bottom: 1.5rem;
        }

        @media (min-width: 900px) {
          .terminal-header-bar {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
          }
        }

        .header-meta-group {
          flex: 1;
        }

        .terminal-sub-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--font-mono, monospace);
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--orbit, #38bdf8);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .blinking-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 10px #ef4444;
          animation: terminalPulse 1.4s infinite;
        }

        @keyframes terminalPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        .terminal-title {
          font-family: var(--font-display, sans-serif);
          font-size: clamp(1.75rem, 3.2vw, 2.35rem);
          font-weight: 800;
          color: var(--moon, #ffffff);
          line-height: 1.2;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.01em;
        }

        .terminal-lead {
          font-family: var(--font-body, sans-serif);
          font-size: 0.925rem;
          line-height: 1.6;
          color: var(--steel, #94a3b8);
          margin: 0;
          max-width: 72ch;
        }

        .decrypted-counter-chip {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(56, 189, 248, 0.35);
          border-radius: 8px;
          padding: 0.65rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 170px;
        }

        .counter-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #94a3b8;
        }

        .counter-val {
          font-family: var(--font-mono, monospace);
          font-size: 1.15rem;
          font-weight: 800;
          color: #38bdf8;
        }

        /* Main Grid Layout */
        .terminal-main-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 960px) {
          .terminal-main-layout {
            grid-template-columns: 320px 1fr;
            align-items: start;
          }
        }

        /* Frequency Selector Column */
        .frequency-selector-column {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .selector-column-header {
          display: flex;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          background: rgba(2, 6, 23, 0.8);
          border-bottom: 1px solid rgba(56, 189, 248, 0.2);
          font-family: var(--font-mono, monospace);
          font-size: 0.62rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.08em;
        }

        .film-frequency-list {
          display: flex;
          flex-direction: column;
        }

        .frequency-item-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0.85rem;
          background: transparent;
          border: none;
          border-left: 3px solid transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          text-align: left;
          cursor: pointer;
          transition: all 0.18s ease;
          outline: none;
          color: inherit;
        }

        .frequency-item-btn:hover {
          background: rgba(56, 189, 248, 0.08);
        }

        .frequency-item-btn.selected {
          background: rgba(56, 189, 248, 0.14);
        }

        .freq-val-cell {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 82px;
        }

        .freq-num {
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.04em;
        }

        .freq-status-pip {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .freq-meta-cell {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 0;
        }

        .film-name {
          font-family: var(--font-body, sans-serif);
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--moon, #ffffff);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .film-year-dir {
          font-family: var(--font-mono, monospace);
          font-size: 0.64rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .unlocked-icon {
          color: #10b981;
          font-weight: 800;
          font-size: 0.85rem;
        }

        /* Intercept Display Column */
        .intercept-display-column {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(56, 189, 248, 0.25);
          border-radius: 10px;
          padding: 1.5rem;
        }

        .intercept-telemetry-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .active-callsign {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono, monospace);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .callsign-label {
          color: #94a3b8;
          letter-spacing: 0.08em;
        }

        .callsign-code {
          letter-spacing: 0.06em;
        }

        .active-category-pill {
          font-family: var(--font-mono, monospace);
          font-size: 0.62rem;
          font-weight: 700;
          padding: 0.22rem 0.6rem;
          border: 1px solid currentColor;
          border-radius: 4px;
          letter-spacing: 0.08em;
        }

        /* Intercept Body */
        .intercept-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        @media (min-width: 600px) {
          .intercept-body {
            flex-direction: row;
            align-items: center;
          }
        }

        .radar-hologram-box {
          width: 90px;
          height: 90px;
          border-radius: 12px;
          background: rgba(2, 6, 23, 0.85);
          border: 1px solid rgba(56, 189, 248, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
          position: relative;
        }

        /* Hologram Icons */
        .hal-outer-ring {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: 2px solid #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 16px rgba(239, 68, 68, 0.6);
        }

        .hal-inner-lens {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: radial-gradient(circle at center, #f87171 0%, #dc2626 60%, #000000 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hal-pupil-flare {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 8px #ffffff;
          animation: terminalPulse 2s infinite ease-in-out;
        }

        .martian-hex-dial {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 1.5px dashed #f97316;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hex-outer-circle {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .hex-deg-tick {
          position: absolute;
          font-family: var(--font-mono, monospace);
          font-size: 0.55rem;
          color: #f97316;
        }
        .hex-deg-tick.t0 { top: 2px; left: 26px; }
        .hex-deg-tick.t45 { top: 18px; right: 4px; }
        .hex-deg-tick.t90 { bottom: 2px; left: 26px; }
        .hex-deg-tick.t135 { bottom: 18px; left: 4px; }
        .hex-deg-tick.t180 { top: 26px; left: 2px; }

        .hex-camera-pointer {
          position: absolute;
          width: 2px;
          height: 24px;
          background: #f97316;
          top: 8px;
          left: 31px;
          transform-origin: bottom center;
          animation: cameraSweep 6s infinite ease-in-out alternate;
        }

        @keyframes cameraSweep {
          0% { transform: rotate(-45deg); }
          100% { transform: rotate(120deg); }
        }

        .contact-spectrogram {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          height: 52px;
          width: 68px;
        }

        .contact-freq-bar {
          width: 6px;
          background: #38bdf8;
          border-radius: 2px 2px 0 0;
          animation: primeBarPulse 1.2s infinite ease-in-out alternate;
        }

        @keyframes primeBarPulse {
          0% { opacity: 0.4; }
          100% { opacity: 1; }
        }

        .apollo-reticle {
          position: relative;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 1px solid rgba(234, 179, 8, 0.4);
        }

        .apollo-crosshair.vert {
          position: absolute;
          width: 1px;
          height: 100%;
          left: 50%;
          background: #eab308;
        }

        .apollo-crosshair.horiz {
          position: absolute;
          height: 1px;
          width: 100%;
          top: 50%;
          background: #eab308;
        }

        .apollo-earth-circle {
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 1.5px solid #38bdf8;
          top: 15px;
          left: 28px;
        }

        .mother-terminal {
          font-family: var(--font-mono, monospace);
          font-size: 0.52rem;
          color: #22c55e;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 4px;
        }

        .crt-cursor {
          display: inline-block;
          width: 6px;
          height: 8px;
          background: #22c55e;
          animation: terminalPulse 0.8s infinite;
        }

        .starwars-trench-wireframe {
          width: 60px;
          height: 60px;
          position: relative;
          border: 1px solid rgba(6, 182, 212, 0.3);
        }

        .trench-line.left {
          position: absolute;
          width: 1px;
          height: 100%;
          left: 18px;
          background: #06b6d4;
        }

        .trench-line.right {
          position: absolute;
          width: 1px;
          height: 100%;
          right: 18px;
          background: #06b6d4;
        }

        .trench-crosshair {
          position: absolute;
          width: 16px;
          height: 16px;
          border: 1.5px solid #ef4444;
          top: 22px;
          left: 22px;
        }

        .warp-coil-glow {
          position: relative;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .warp-core-cylinder {
          width: 16px;
          height: 44px;
          border-radius: 8px;
          background: #3b82f6;
          box-shadow: 0 0 16px #3b82f6;
        }

        .warp-glow-ring {
          position: absolute;
          width: 36px;
          height: 12px;
          border-radius: 50%;
          border: 1.5px solid #93c5fd;
        }

        .quote-intercept-col {
          flex: 1;
        }

        .intercept-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.64rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 0.35rem;
        }

        .intercept-quote {
          font-family: var(--font-body, sans-serif);
          font-size: 1.05rem;
          font-style: italic;
          color: var(--moon, #ffffff);
          line-height: 1.55;
          margin: 0 0 0.45rem 0;
        }

        .intercept-speaker {
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          color: var(--orbit, #38bdf8);
          font-weight: 600;
        }

        /* Astrodynamics Box */
        .astrodynamics-dossier-box {
          background: rgba(2, 6, 23, 0.75);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 8px;
          padding: 1rem;
        }

        .dossier-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.625rem;
          font-weight: 700;
          color: var(--orbit, #38bdf8);
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 0.35rem;
        }

        .dossier-text {
          font-family: var(--font-body, sans-serif);
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--star, #cbd5e1);
          margin: 0;
        }

        /* Decrypt Button Row */
        .classified-action-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .btn-decrypt-egg {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.18) 0%, rgba(2, 132, 199, 0.28) 100%);
          border: 1.5px solid #38bdf8;
          color: #ffffff;
          padding: 0.6rem 1.25rem;
          border-radius: var(--radius-sm, 6px);
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.35);
        }

        .btn-decrypt-egg:hover {
          background: #38bdf8;
          color: #020617;
          box-shadow: 0 0 22px rgba(56, 189, 248, 0.65);
          transform: translateY(-1px);
        }

        .btn-decrypt-egg.unlocked {
          background: rgba(15, 23, 42, 0.9);
          border-color: rgba(148, 163, 184, 0.4);
          color: #94a3b8;
          box-shadow: none;
        }

        .egg-badge-chip {
          background: rgba(56, 189, 248, 0.2);
          color: #38bdf8;
          font-size: 0.62rem;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }

        .btn-decrypt-egg:hover .egg-badge-chip {
          background: rgba(2, 6, 23, 0.85);
          color: #38bdf8;
        }

        /* Secret Drawer */
        .classified-secret-drawer {
          background: rgba(2, 6, 23, 0.95);
          border: 1px solid #10b981;
          border-radius: 8px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
        }

        .drawer-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .clearance-tag {
          font-family: var(--font-mono, monospace);
          font-size: 0.64rem;
          font-weight: 700;
          color: #10b981;
          letter-spacing: 0.08em;
        }

        .badge-earned-tag {
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          font-weight: 800;
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.15);
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          border: 1px solid rgba(245, 158, 11, 0.35);
        }

        .secret-title {
          font-family: var(--font-mono, monospace);
          font-size: 0.88rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          letter-spacing: 0.04em;
        }

        .secret-body {
          font-family: var(--font-mono, monospace);
          font-size: 0.8rem;
          line-height: 1.6;
          color: #cbd5e1;
          margin: 0;
          white-space: pre-wrap;
        }

        .copy-action-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 0.5rem;
        }

        .btn-copy-secret {
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.35rem 0.85rem;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid #10b981;
          color: #10b981;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-copy-secret:hover {
          background: #10b981;
          color: #020617;
        }

        /* ========================================================
           LIGHT MODE (SOLAR FLARE) CONTRAST & LEGIBILITY OVERRIDES
           ======================================================== */
        html[data-theme="solar-flare"] .cinema-terminal-card,
        html.theme-solar-flare .cinema-terminal-card,
        html.light-mode .cinema-terminal-card {
          background: rgba(255, 255, 255, 0.95) !important;
          border-color: rgba(0, 0, 0, 0.16) !important;
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08) !important;
        }

        html[data-theme="solar-flare"] .terminal-title,
        html.theme-solar-flare .terminal-title,
        html.light-mode .terminal-title {
          color: #0f172a !important;
        }

        html[data-theme="solar-flare"] .terminal-lead,
        html.theme-solar-flare .terminal-lead,
        html.light-mode .terminal-lead {
          color: #334155 !important;
        }

        html[data-theme="solar-flare"] .terminal-sub-badge,
        html.theme-solar-flare .terminal-sub-badge,
        html.light-mode .terminal-sub-badge {
          color: #0284c7 !important;
        }

        html[data-theme="solar-flare"] .decrypted-counter-chip,
        html.theme-solar-flare .decrypted-counter-chip,
        html.light-mode .decrypted-counter-chip {
          background: #f8fafc !important;
          border-color: rgba(0, 0, 0, 0.12) !important;
        }

        html[data-theme="solar-flare"] .counter-label,
        html.theme-solar-flare .counter-label,
        html.light-mode .counter-label {
          color: #475569 !important;
        }

        html[data-theme="solar-flare"] .counter-val,
        html.theme-solar-flare .counter-val,
        html.light-mode .counter-val {
          color: #0284c7 !important;
        }

        html[data-theme="solar-flare"] .frequency-selector-column,
        html.theme-solar-flare .frequency-selector-column,
        html.light-mode .frequency-selector-column,
        html[data-theme="solar-flare"] .intercept-display-column,
        html.theme-solar-flare .intercept-display-column,
        html.light-mode .intercept-display-column {
          background: #f8fafc !important;
          border-color: rgba(0, 0, 0, 0.12) !important;
        }

        html[data-theme="solar-flare"] .selector-column-header,
        html.theme-solar-flare .selector-column-header,
        html.light-mode .selector-column-header {
          background: #e2e8f0 !important;
          color: #334155 !important;
          border-color: rgba(0, 0, 0, 0.1) !important;
        }

        html[data-theme="solar-flare"] .film-name,
        html.theme-solar-flare .film-name,
        html.light-mode .film-name {
          color: #0f172a !important;
        }

        html[data-theme="solar-flare"] .frequency-item-btn:hover,
        html.theme-solar-flare .frequency-item-btn:hover,
        html.light-mode .frequency-item-btn:hover {
          background: #e2e8f0 !important;
        }

        html[data-theme="solar-flare"] .frequency-item-btn.selected,
        html.theme-solar-flare .frequency-item-btn.selected,
        html.light-mode .frequency-item-btn.selected {
          background: #e0f2fe !important;
        }

        html[data-theme="solar-flare"] .intercept-quote,
        html.theme-solar-flare .intercept-quote,
        html.light-mode .intercept-quote {
          color: #0f172a !important;
        }

        html[data-theme="solar-flare"] .intercept-speaker,
        html.theme-solar-flare .intercept-speaker,
        html.light-mode .intercept-speaker {
          color: #0284c7 !important;
          font-weight: 700 !important;
        }

        html[data-theme="solar-flare"] .astrodynamics-dossier-box,
        html.theme-solar-flare .astrodynamics-dossier-box,
        html.light-mode .astrodynamics-dossier-box {
          background: #ffffff !important;
          border-color: rgba(0, 0, 0, 0.12) !important;
        }

        html[data-theme="solar-flare"] .dossier-label,
        html.theme-solar-flare .dossier-label,
        html.light-mode .dossier-label {
          color: #0284c7 !important;
          font-weight: 800 !important;
        }

        html[data-theme="solar-flare"] .dossier-text,
        html.theme-solar-flare .dossier-text,
        html.light-mode .dossier-text {
          color: #334155 !important;
        }

        html[data-theme="solar-flare"] .btn-decrypt-egg,
        html.theme-solar-flare .btn-decrypt-egg,
        html.light-mode .btn-decrypt-egg {
          background: #0284c7 !important;
          color: #ffffff !important;
          border-color: #0284c7 !important;
        }

        html[data-theme="solar-flare"] .btn-decrypt-egg:hover,
        html.theme-solar-flare .btn-decrypt-egg:hover,
        html.light-mode .btn-decrypt-egg:hover {
          background: #0369a1 !important;
        }

        html[data-theme="solar-flare"] .btn-decrypt-egg.unlocked,
        html.theme-solar-flare .btn-decrypt-egg.unlocked,
        html.light-mode .btn-decrypt-egg.unlocked {
          background: #e2e8f0 !important;
          color: #475569 !important;
          border-color: rgba(0, 0, 0, 0.15) !important;
        }

        html[data-theme="solar-flare"] .classified-secret-drawer,
        html.theme-solar-flare .classified-secret-drawer,
        html.light-mode .classified-secret-drawer {
          background: #f0fdf4 !important;
          border-color: #10b981 !important;
        }

        html[data-theme="solar-flare"] .secret-title,
        html.theme-solar-flare .secret-title,
        html.light-mode .secret-title {
          color: #064e3b !important;
        }

        html[data-theme="solar-flare"] .secret-body,
        html.theme-solar-flare .secret-body,
        html.light-mode .secret-body {
          color: #065f46 !important;
        }

        /* Mobile Adjustments */
        @media (max-width: 640px) {
          .terminal-header-bar {
            padding-bottom: 1rem;
            margin-bottom: 1.25rem;
          }
          .intercept-display-column {
            padding: 1rem;
          }
          .btn-decrypt-egg {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
