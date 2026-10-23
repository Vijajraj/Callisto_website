import React, { useState, useEffect } from 'react';
import {
  toggleAmbientSound,
  playTelemetryBeep,
  playThrusterBurst,
  playBeaconPing,
  playWarpSurge,
  isAudioEnabled,
  getCurrentChordName,
} from '../../lib/audio';

export default function SoundHud(): React.ReactElement {
  const [enabled, setEnabled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [currentChord, setCurrentChord] = useState<string>('A MINOR');
  const [lastAction, setLastAction] = useState<string>('STANDBY');

  useEffect(() => {
    setEnabled(isAudioEnabled());
    const interval = setInterval(() => {
      if (isAudioEnabled()) {
        setCurrentChord(getCurrentChordName());
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const newState = toggleAmbientSound();
    setEnabled(newState);
    setLastAction(newState ? 'EXPEDITION CATHEDRAL SCORE ENGAGED' : 'SCORE MUTED');
    if (newState) {
      setCurrentChord(getCurrentChordName());
    }
  };

  const handlePing = () => {
    playBeaconPing();
    setLastAction('BEACON PING TRANSMITTED');
  };

  const handleThruster = () => {
    playThrusterBurst();
    setLastAction('RCS BURST PULSED');
  };

  const handleWarp = () => {
    playWarpSurge();
    setLastAction('WARP ACCELERATION SURGE');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 'var(--z-fixed, 800)',
        fontFamily: 'var(--font-mono)',
      }}
      aria-label="Expedition Orchestral Synthesizer Controls"
    >
      {/* Expanded Controls Drawer */}
      {expanded && (
        <div
          style={{
            marginBottom: '0.5rem',
            backgroundColor: 'color-mix(in srgb, var(--deep) 94%, black)',
            border: '1px solid color-mix(in srgb, var(--orbit) 50%, transparent)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.75), 0 0 20px color-mix(in srgb, var(--orbit) 25%, transparent)',
            backdropFilter: 'blur(16px)',
            width: '270px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
              paddingBottom: '0.5rem',
              marginBottom: '0.75rem',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--moon)',
                  letterSpacing: '0.08em',
                }}
              >
                EXPEDITION CATHEDRAL SCORE
              </div>
              <div
                style={{
                  fontSize: '0.625rem',
                  color: 'var(--orbit)',
                  letterSpacing: '0.05em',
                }}
              >
                CATHEDRAL PIPE ORGAN
              </div>
            </div>
            <button
              onClick={() => setExpanded(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--steel)',
                cursor: 'pointer',
                fontSize: '1.1rem',
                padding: '0 0.25rem',
              }}
              aria-label="Close Sound Controls"
            >
              &times;
            </button>
          </div>

          {/* Current Live Chord Monitor */}
          <div
            style={{
              backgroundColor: 'color-mix(in srgb, var(--void) 80%, black)',
              border: '1px solid color-mix(in srgb, var(--steel) 25%, transparent)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 0.65rem',
              marginBottom: '0.75rem',
            }}
          >
            <div style={{ fontSize: '0.5625rem', color: 'var(--steel)', letterSpacing: '0.1em' }}>
              ACTIVE TEMPLE HARMONIC
            </div>
            <div
              style={{
                fontSize: '0.8125rem',
                color: enabled ? 'var(--astrophage)' : 'var(--steel)',
                fontWeight: 700,
                marginTop: '0.15rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: enabled ? '#4ade80' : 'var(--steel)',
                  boxShadow: enabled ? '0 0 8px #4ade80' : 'none',
                }}
              />
              {enabled ? `${currentChord} • CATHEDRAL ORGAN` : 'SYNTHESIZER STANDBY'}
            </div>
          </div>

          {/* Master Score Toggle */}
          <button
            onClick={handleToggleSound}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem',
              backgroundColor: enabled
                ? 'color-mix(in srgb, var(--orbit) 25%, var(--void))'
                : 'color-mix(in srgb, var(--navy) 60%, transparent)',
              border: `1px solid ${
                enabled ? 'var(--orbit)' : 'color-mix(in srgb, var(--steel) 40%, transparent)'
              }`,
              borderRadius: 'var(--radius-sm)',
              color: 'var(--moon)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
              boxShadow: enabled ? '0 0 12px color-mix(in srgb, var(--orbit) 40%, transparent)' : 'none',
            }}
          >
            <span>{enabled ? '⏸ PAUSE EXPEDITION SCORE' : '▶ ENGAGE EXPEDITION SCORE'}</span>
          </button>

          {/* Telemetry SFX Action Buttons */}
          <div
            style={{
              fontSize: '0.5625rem',
              color: 'var(--steel)',
              letterSpacing: '0.08em',
              marginBottom: '0.35rem',
            }}
          >
            SPATIAL EXPEDITION FX
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.35rem' }}>
            <button
              onClick={handlePing}
              style={{
                padding: '0.35rem 0.2rem',
                backgroundColor: 'color-mix(in srgb, var(--navy) 50%, transparent)',
                border: '1px solid color-mix(in srgb, var(--steel) 35%, transparent)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--star)',
                fontSize: '0.625rem',
                cursor: 'pointer',
              }}
              title="Transmit navigational acoustic beacon"
            >
              BEACON
            </button>
            <button
              onClick={handleThruster}
              style={{
                padding: '0.35rem 0.2rem',
                backgroundColor: 'color-mix(in srgb, var(--navy) 50%, transparent)',
                border: '1px solid color-mix(in srgb, var(--steel) 35%, transparent)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--star)',
                fontSize: '0.625rem',
                cursor: 'pointer',
              }}
              title="Test maneuvering thruster impulse"
            >
              RCS
            </button>
            <button
              onClick={handleWarp}
              style={{
                padding: '0.35rem 0.2rem',
                backgroundColor: 'color-mix(in srgb, var(--navy) 50%, transparent)',
                border: '1px solid color-mix(in srgb, var(--steel) 35%, transparent)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--star)',
                fontSize: '0.625rem',
                cursor: 'pointer',
              }}
              title="Trigger warp engine burst"
            >
              WARP
            </button>
          </div>

          <div
            style={{
              marginTop: '0.65rem',
              fontSize: '0.5625rem',
              color: 'var(--steel)',
              textAlign: 'center',
              letterSpacing: '0.04em',
            }}
          >
            STATUS: {lastAction}
          </div>
        </div>
      )}

      {/* Floating Pill HUD Button */}
      <button
        onClick={handleToggleSound}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          padding: '0.5rem 0.95rem',
          backgroundColor: 'color-mix(in srgb, var(--void) 92%, black)',
          border: `1px solid ${
            enabled ? 'var(--orbit)' : 'color-mix(in srgb, var(--steel) 45%, transparent)'
          }`,
          borderRadius: 'var(--radius-full)',
          boxShadow: enabled
            ? '0 0 20px color-mix(in srgb, var(--orbit) 50%, transparent), 0 4px 16px rgba(0,0,0,0.6)'
            : '0 4px 14px rgba(0,0,0,0.5)',
          cursor: 'pointer',
          color: enabled ? '#FFFFFF' : 'var(--star)',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          transition: 'all 0.25s ease',
        }}
        title={enabled ? 'Pause expedition orchestral score (or click arrow for options)' : 'Play expedition orchestral score'}
      >
        {/* Animated Pipe Organ Waveform Indicator */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2.5px',
            height: '14px',
          }}
          aria-hidden="true"
        >
          <span
            style={{
              width: '2px',
              height: enabled ? '12px' : '4px',
              backgroundColor: enabled ? 'var(--astrophage)' : 'var(--steel)',
              borderRadius: '1px',
              transition: 'height 0.2s ease',
            }}
          />
          <span
            style={{
              width: '2.5px',
              height: enabled ? '16px' : '6px',
              backgroundColor: enabled ? 'var(--orbit)' : 'var(--steel)',
              borderRadius: '1px',
              transition: 'height 0.2s ease',
            }}
          />
          <span
            style={{
              width: '2px',
              height: enabled ? '10px' : '3px',
              backgroundColor: enabled ? 'var(--star)' : 'var(--steel)',
              borderRadius: '1px',
              transition: 'height 0.2s ease',
            }}
          />
        </span>

        <span>{enabled ? 'EXPEDITION SCORE' : 'SCORE OFF'}</span>

        <span
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          style={{
            marginLeft: '0.35rem',
            color: 'var(--orbit)',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '0 4px',
            fontSize: '0.85rem',
          }}
          title="Open Audio Controls"
        >
          {expanded ? '▾' : '▴'}
        </span>
      </button>
    </div>
  );
}
