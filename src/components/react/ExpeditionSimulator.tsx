import React, { useState, useEffect } from 'react';
import { playTelemetryBeep, playThrusterBurst, toggleAmbientSound, isAudioEnabled } from '../../lib/audio';

interface ActData {
  id: number;
  actRoman: string;
  title: string;
  subtitle: string;
  location: string;
  velocity: number;
  distance: number;
  oxygen: number;
  pressure: number;
  description: string;
  challenge: {
    prompt: string;
    choices: { text: string; outcome: string; bonus: string }[];
  };
  visualTone: string;
  beaconFrequency: number;
}

const ACTS: ActData[] = [
  {
    id: 1,
    actRoman: 'ACT I',
    title: 'Earth Orbital Departure',
    subtitle: 'Leaving the Cradle of Humanity',
    location: 'Low Earth Orbit (380 km)',
    velocity: 11.2, // km/s
    distance: 0.0004, // Mkm
    oxygen: 99.8,
    pressure: 101.3,
    visualTone: 'var(--orbit)',
    beaconFrequency: 1420.4,
    description:
      'Atmospheric friction fades into the silent void. Below, Earth’s blue limb curves against the black abyss. Main fusion drives are armed for trans-planetary injection.',
    challenge: {
      prompt: 'Flight Controller: Orbital injection window is opening. Confirm departure vector:',
      choices: [
        {
          text: 'Direct Hohmann Transfer (Fuel conservative, standard orbital curve)',
          outcome: 'Course locked. Velocity steady at 11.2 km/s. Trajectory nominal.',
          bonus: '+0.5% Reaction Mass Reserve',
        },
        {
          text: 'Lunar Gravity Assist Slingshot (High delta-V boost, tighter window)',
          outcome: 'Lunar swing-by successful! Gravitational acceleration boost +2.8 km/s.',
          bonus: 'Transit Time Reduced by 14 Sols',
        },
      ],
    },
  },
  {
    id: 2,
    actRoman: 'ACT II',
    title: 'Sol 1 — Martian Waypoint',
    subtitle: 'Regolith, Red Horizon, Survival',
    location: 'Chryse Planitia Outpost (Mars)',
    velocity: 24.6,
    distance: 78.3,
    oxygen: 96.2,
    pressure: 98.4,
    visualTone: 'var(--sol-dust)',
    beaconFrequency: 2290.0,
    description:
      'The red dust settling over the habitat airlocks. Cosmic radiation meters tick rhythmically. You step out onto the rust-colored iron oxide sands of Mars to deploy deep-sky sensors.',
    challenge: {
      prompt: 'A seasonal dust front approaches the solar tracking array. Choose your protocol:',
      choices: [
        {
          text: 'Retract primary panels and rely on radioactive thermal generators (RTG)',
          outcome: 'Optical sensors protected. Essential life support maintained without grit abrasion.',
          bonus: 'Array Structural Health: 100%',
        },
        {
          text: 'Deploy electrostatic repulsion field and maintain continuous spectral logging',
          outcome: 'Electrostatically deflected particulate storm! Captured rare Martian lightning spectra.',
          bonus: 'Atmospheric Research Data +400 MB',
        },
      ],
    },
  },
  {
    id: 3,
    actRoman: 'ACT III',
    title: 'The Cruiser Habitat',
    subtitle: 'Deep-Space Enigma & The Hail Mary Protocol',
    location: 'Asteroid Belt Crossing (2.8 AU)',
    velocity: 38.1,
    distance: 418.5,
    oxygen: 94.1,
    pressure: 99.0,
    visualTone: 'var(--astrophage)',
    beaconFrequency: 4850.5,
    description:
      'Months into the void. The centrifuge habitat ring spins gently to simulate 0.4g. The radio telescope array has picked up an anomalous narrowband carrier wave from the Jovian magnetosphere.',
    challenge: {
      prompt: 'Quasar and Tesseract wings detect harmonic modulation. Calibrate receiver:',
      choices: [
        {
          text: 'Shift narrowband filter to 21cm Neutral Hydrogen interstellar line',
          outcome: 'Decoded signal! It is Callisto Base automated orbital beacon confirming arrival readiness.',
          bonus: 'Navigational Telemetry Locked',
        },
        {
          text: 'Run Fourier transform algorithm across the Jovian radio burst burst spectra',
          outcome: 'Identified Io plasma torus interference. Synthesized filter cleared all telemetry channels.',
          bonus: 'Signal-to-Noise Ratio +18 dB',
        },
      ],
    },
  },
  {
    id: 4,
    actRoman: 'ACT IV',
    title: 'Touchdown: Callisto Base',
    subtitle: 'Permanent Observatory in Jovian Orbit',
    location: 'Valhalla Crater Rim, Callisto',
    velocity: 4.8,
    distance: 628.3,
    oxygen: 98.5,
    pressure: 100.2,
    visualTone: 'var(--star)',
    beaconFrequency: 8400.0,
    description:
      'Landing thrusters extinguish in the crater basin of Callisto. Above the icy horizon, Jupiter hangs immense and silent—a marbled canvas of amber storms and bands. Humanity’s furthest collegiate astronomical observatory is active.',
    challenge: {
      prompt: 'All modules are on station. Inaugurate the first scientific campaign:',
      choices: [
        {
          text: 'Power on the 2.5-meter Schmidt-Cassegrain cryogenic optical array',
          outcome: 'First light achieved! Imaging deep exoplanetary systems without atmospheric scatter.',
          bonus: 'Callisto Sky Survey Initiated',
        },
        {
          text: 'Deploy deep ice core acoustic sensors to map the subsurface ocean',
          outcome: 'Saline layer depth verified at 120 km! Life detection telemetry initialized.',
          bonus: 'Ocean Discovery Log Certified',
        },
      ],
    },
  },
];

export default function ExpeditionSimulator(): React.ReactElement {
  const [activeActIndex, setActiveActIndex] = useState<number>(0);
  const [isThrusting, setIsThrusting] = useState<boolean>(false);
  const [logMessages, setLogMessages] = useState<string[]>([
    'T-00:00:00 - Expedition Simulator Initialized. All telemetry systems nominal.',
  ]);
  const [soundActive, setSoundActive] = useState<boolean>(false);
  const [userDecisions, setUserDecisions] = useState<{ [actId: number]: number }>({});
  const [customFrequency, setCustomFrequency] = useState<number>(1420.4);

  const currentAct = ACTS[activeActIndex];

  useEffect(() => {
    setCustomFrequency(currentAct.beaconFrequency);
  }, [activeActIndex]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toISOString().substring(11, 19);
    setLogMessages((prev) => [`[${timestamp}] ${msg}`, ...prev.slice(0, 7)]);
  };

  const handleActSelect = (index: number) => {
    playTelemetryBeep(700 + index * 150, 0.08);
    setActiveActIndex(index);
    addLog(`Navigational vector transferred to ${ACTS[index].actRoman}: ${ACTS[index].title}`);
  };

  const handleThrust = () => {
    setIsThrusting(true);
    playThrusterBurst();
    addLog(`MAIN THRUSTERS ENGAGED: Pulsed delta-V burn in ${currentAct.location}`);

    setTimeout(() => {
      setIsThrusting(false);
      addLog(`Thrust cut-off verified. Orbital velocity adjusted +1.4 km/s.`);
    }, 700);
  };

  const handleChoice = (choiceIndex: number) => {
    playTelemetryBeep(1100, 0.1);
    setUserDecisions((prev) => ({ ...prev, [currentAct.id]: choiceIndex }));
    const choice = currentAct.challenge.choices[choiceIndex];
    addLog(`DECISION LOG: ${choice.outcome} (${choice.bonus})`);
  };

  const handleSoundToggle = () => {
    const active = toggleAmbientSound();
    setSoundActive(active);
    addLog(`Audio synthesizer ${active ? 'ENGAGED [Ambient Cosmic Drone]' : 'MUTED'}`);
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--deep)',
        border: '1px solid color-mix(in srgb, var(--orbit) 35%, transparent)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        color: 'var(--moon)',
        boxShadow: '0 12px 40px color-mix(in srgb, var(--void) 85%, transparent)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease',
        transform: isThrusting ? 'scale(1.008) translateY(-2px)' : 'none',
      }}
    >
      <style>{`
        .cockpit-tab:hover {
          background-color: color-mix(in srgb, var(--orbit) 25%, transparent) !important;
          color: var(--moon) !important;
        }
        .cockpit-choice-btn:hover {
          border-color: var(--orbit) !important;
          background-color: color-mix(in srgb, var(--navy) 90%, transparent) !important;
          transform: translateX(4px);
        }
        .thrust-btn:active {
          transform: scale(0.97);
        }
        @keyframes sweepLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}</style>

      {/* Cockpit HUD Top Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-md)',
          borderBottom: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
          paddingBottom: 'var(--space-md)',
          marginBottom: 'var(--space-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isThrusting ? '#ef4444' : 'var(--astrophage)',
              boxShadow: `0 0 10px ${isThrusting ? '#ef4444' : 'var(--astrophage)'}`,
              transition: 'background-color 0.2s',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: 'var(--moon)',
            }}
          >
            FLIGHT DECK TELEMETRY // SIMULATOR
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <button
            type="button"
            onClick={handleSoundToggle}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: soundActive ? 'color-mix(in srgb, var(--orbit) 25%, transparent)' : 'color-mix(in srgb, var(--navy) 60%, transparent)',
              border: `1px solid ${soundActive ? 'var(--orbit)' : 'color-mix(in srgb, var(--steel) 30%, transparent)'}`,
              color: soundActive ? 'var(--moon)' : 'var(--steel)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title="Toggle procedural synthesizer sound"
          >
            <span>{soundActive ? '🔊 AUDIO ON' : '🔈 AUDIO OFF'}</span>
          </button>

          <button
            type="button"
            onClick={handleThrust}
            className="thrust-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: isThrusting ? 'var(--astrophage)' : 'linear-gradient(135deg, var(--orbit), var(--dusk))',
              color: isThrusting ? 'var(--void)' : 'var(--moon)',
              border: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              letterSpacing: '0.08em',
              boxShadow: '0 0 16px color-mix(in srgb, var(--orbit) 40%, transparent)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>🚀 ENGAGE THRUST</span>
          </button>
        </div>
      </div>

      {/* Act Navigation Tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 'var(--space-xs)',
          marginBottom: 'var(--space-xl)',
        }}
      >
        {ACTS.map((act, index) => {
          const isActive = index === activeActIndex;
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => handleActSelect(index)}
              className="cockpit-tab"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 'var(--space-sm)',
                backgroundColor: isActive ? 'color-mix(in srgb, var(--navy) 90%, transparent)' : 'color-mix(in srgb, var(--void) 50%, transparent)',
                border: `1px solid ${isActive ? act.visualTone : 'color-mix(in srgb, var(--steel) 25%, transparent)'}`,
                borderTop: isActive ? `3px solid ${act.visualTone}` : '1px solid color-mix(in srgb, var(--steel) 25%, transparent)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: isActive ? act.visualTone : 'var(--steel)',
                }}
              >
                {act.actRoman}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: isActive ? 'var(--moon)' : 'var(--star)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}
              >
                {act.title.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Telemetry Flight Gauges */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-xl)',
        }}
      >
        <div style={gaugeBoxStyle}>
          <span style={gaugeLabelStyle}>COORDINATES</span>
          <span style={gaugeValStyle}>{currentAct.location}</span>
        </div>
        <div style={gaugeBoxStyle}>
          <span style={gaugeLabelStyle}>VELOCITY</span>
          <span style={{ ...gaugeValStyle, color: 'var(--orbit)' }}>
            {currentAct.velocity.toFixed(1)} km/s
          </span>
        </div>
        <div style={gaugeBoxStyle}>
          <span style={gaugeLabelStyle}>DISTANCE / SUN</span>
          <span style={gaugeValStyle}>{currentAct.distance} Mkm</span>
        </div>
        <div style={gaugeBoxStyle}>
          <span style={gaugeLabelStyle}>CABIN O2 / HAB</span>
          <span style={{ ...gaugeValStyle, color: '#4ade80' }}>
            {currentAct.oxygen}%
          </span>
        </div>
      </div>

      {/* Active Act Display & Visual Radar Screen */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-xl)',
          marginBottom: 'var(--space-xl)',
          alignItems: 'start',
        }}
      >
        {/* Left: Narrative & Interactive Challenge */}
        <div>
          <div
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: currentAct.visualTone,
              marginBottom: 'var(--space-xs)',
            }}
          >
            MISSION STAGE {currentAct.id} OF 4
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 600,
              color: 'var(--moon)',
              margin: '0 0 0.25rem 0',
            }}
          >
            {currentAct.title}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              color: 'var(--star)',
              margin: '0 0 var(--space-md) 0',
            }}
          >
            {currentAct.subtitle}
          </p>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              lineHeight: 1.65,
              color: 'var(--steel)',
              marginBottom: 'var(--space-lg)',
            }}
          >
            {currentAct.description}
          </p>

          {/* Interactive Flight Decision */}
          <div
            style={{
              backgroundColor: 'color-mix(in srgb, var(--navy) 60%, var(--deep))',
              border: `1px solid color-mix(in srgb, ${currentAct.visualTone} 40%, transparent)`,
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-md)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: currentAct.visualTone,
                display: 'block',
                marginBottom: 'var(--space-xs)',
              }}
            >
              DECISION PROTOCOL:
            </span>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: 'var(--moon)',
                margin: '0 0 var(--space-md) 0',
              }}
            >
              {currentAct.challenge.prompt}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {currentAct.challenge.choices.map((choice, cIndex) => {
                const isSelected = userDecisions[currentAct.id] === cIndex;
                return (
                  <button
                    key={cIndex}
                    type="button"
                    onClick={() => handleChoice(cIndex)}
                    className="cockpit-choice-btn"
                    style={{
                      textAlign: 'left',
                      padding: 'var(--space-sm) var(--space-md)',
                      backgroundColor: isSelected ? 'color-mix(in srgb, var(--orbit) 25%, var(--navy))' : 'color-mix(in srgb, var(--void) 70%, transparent)',
                      border: `1px solid ${isSelected ? currentAct.visualTone : 'color-mix(in srgb, var(--steel) 30%, transparent)'}`,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: isSelected ? 'var(--moon)' : 'var(--star)', fontWeight: 500 }}>
                      {choice.text}
                    </div>
                    {isSelected && (
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.6875rem',
                          color: '#4ade80',
                          marginTop: '0.25rem',
                        }}
                      >
                        ✔ {choice.outcome} — [{choice.bonus}]
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Radar Display & Spectral Scanner */}
        <div
          style={{
            backgroundColor: 'var(--void)',
            border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 'var(--space-xs)',
              left: 'var(--space-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--steel)',
              letterSpacing: '0.08em',
            }}
          >
            RADAR SCOPE // 360° SWEEP
          </div>

          {/* Radar Screen Graphic */}
          <div
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              border: `2px solid color-mix(in srgb, ${currentAct.visualTone} 60%, transparent)`,
              margin: 'var(--space-lg) 0',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `inset 0 0 20px color-mix(in srgb, ${currentAct.visualTone} 25%, transparent)`,
            }}
          >
            {/* Concentric rings */}
            <div style={{ position: 'absolute', width: '130px', height: '130px', borderRadius: '50%', border: '1px dashed color-mix(in srgb, var(--steel) 30%, transparent)' }} />
            <div style={{ position: 'absolute', width: '60px', height: '60px', borderRadius: '50%', border: '1px solid color-mix(in srgb, var(--steel) 40%, transparent)' }} />
            {/* Crosshairs */}
            <div style={{ position: 'absolute', width: '100%', height: '1px', backgroundColor: 'color-mix(in srgb, var(--steel) 25%, transparent)' }} />
            <div style={{ position: 'absolute', height: '100%', width: '1px', backgroundColor: 'color-mix(in srgb, var(--steel) 25%, transparent)' }} />

            {/* Target Blip */}
            <div
              style={{
                position: 'absolute',
                top: `${40 + currentAct.id * 15}%`,
                left: `${30 + currentAct.id * 12}%`,
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: currentAct.visualTone,
                boxShadow: `0 0 10px ${currentAct.visualTone}`,
              }}
            />

            {/* Center Ship Beacon */}
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--moon)' }} />
          </div>

          {/* Interactive Receiver Frequency Slider */}
          <div style={{ width: '100%', marginTop: 'var(--space-xs)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--steel)', marginBottom: '0.25rem' }}>
              <span>BEACON FREQ:</span>
              <span style={{ color: currentAct.visualTone }}>{customFrequency.toFixed(1)} MHz</span>
            </div>
            <input
              type="range"
              min="1000"
              max="9000"
              step="10"
              value={customFrequency}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setCustomFrequency(val);
                if (Math.abs(val - currentAct.beaconFrequency) < 50) {
                  playTelemetryBeep(1400, 0.05);
                }
              }}
              style={{ width: '100%', cursor: 'pointer', accentColor: currentAct.visualTone }}
            />
          </div>
        </div>
      </div>

      {/* Real-time Telemetry Terminal Logs */}
      <div
        style={{
          backgroundColor: 'color-mix(in srgb, var(--void) 90%, transparent)',
          border: '1px solid color-mix(in srgb, var(--steel) 25%, transparent)',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-sm) var(--space-md)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          lineHeight: 1.5,
          color: 'var(--star)',
        }}
      >
        <div style={{ color: 'var(--steel)', fontSize: '0.6875rem', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
          TERMINAL DISPATCH BUFFER:
        </div>
        {logMessages.map((log, lIdx) => (
          <div key={lIdx} style={{ opacity: Math.max(0.35, 1 - lIdx * 0.1) }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}

const gaugeBoxStyle: React.CSSProperties = {
  backgroundColor: 'color-mix(in srgb, var(--navy) 50%, var(--deep))',
  border: '1px solid color-mix(in srgb, var(--steel) 25%, transparent)',
  borderRadius: 'var(--radius-sm)',
  padding: 'var(--space-xs) var(--space-sm)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.15rem',
};

const gaugeLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.625rem',
  letterSpacing: '0.08em',
  color: 'var(--steel)',
  textTransform: 'uppercase',
};

const gaugeValStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--moon)',
};
