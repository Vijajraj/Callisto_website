import React, { useState, useEffect } from 'react';
import {
  toggleAmbientSound,
  playTelemetryBeep,
  playThrusterBurst,
  playBeaconPing,
  playWarpSurge,
  isAudioEnabled,
} from '../../lib/audio';

export default function SoundHud(): React.ReactElement {
  const [enabled, setEnabled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [lastAction, setLastAction] = useState<string>('STANDBY');

  useEffect(() => {
    setEnabled(isAudioEnabled());
  }, []);

  const handleToggleSound = () => {
    const newState = toggleAmbientSound();
    setEnabled(newState);
    setLastAction(newState ? 'ATMOSPHERIC AUDIO ACTIVE' : 'AUDIO MUTED');
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
      aria-label="Expedition Audio Synthesizer Controls"
    >
      {/* Expanded Controls Drawer */}
      {expanded && (
        <div
          style={{
            marginBottom: '0.5rem',
            backgroundColor: 'var(--deep)',
            border: '1px solid color-mix(in srgb, var(--orbit) 40%, transparent)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(12px)',
            width: '240px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
              paddingBottom: '0.4rem',
              marginBottom: '0.65rem',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--star)',
                letterSpacing: '0.1em',
              }}
            >
              AUDIO SYNTHESIZER
            </span>
            <button
              onClick={() => setExpanded(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--steel)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                padding: '0 0.25rem',
              }}
              aria-label="Close Sound Controls"
            >
              &times;
            </button>
          </div>

          <div
            style={{
              fontSize: '0.625rem',
              color: 'var(--orbit)',
              marginBottom: '0.65rem',
              letterSpacing: '0.05em',
              minHeight: '1rem',
            }}
          >
            &gt; {lastAction}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button
              onClick={handleToggleSound}
              style={{
                padding: '0.45rem 0.65rem',
                fontSize: '0.6875rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: enabled ? 'var(--moon)' : 'var(--star)',
                backgroundColor: enabled
                  ? 'color-mix(in srgb, var(--astrophage) 20%, transparent)'
                  : 'color-mix(in srgb, var(--navy) 60%, transparent)',
                border: `1px solid ${
                  enabled
                    ? 'color-mix(in srgb, var(--astrophage) 50%, transparent)'
                    : 'color-mix(in srgb, var(--steel) 30%, transparent)'
                }`,
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>AMBIENT DRONE</span>
              <span
                style={{
                  color: enabled ? 'var(--astrophage)' : 'var(--steel)',
                  fontWeight: 700,
                }}
              >
                {enabled ? 'ONLINE' : 'MUTED'}
              </span>
            </button>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '0.35rem',
                marginTop: '0.25rem',
              }}
            >
              <button
                onClick={handlePing}
                title="Procedural Comms Ping"
                style={{
                  padding: '0.4rem 0.2rem',
                  fontSize: '0.625rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--moon)',
                  backgroundColor: 'color-mix(in srgb, var(--navy) 70%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--orbit) 35%, transparent)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                PING
              </button>
              <button
                onClick={handleThruster}
                title="Procedural Thruster Noise Burst"
                style={{
                  padding: '0.4rem 0.2rem',
                  fontSize: '0.625rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--moon)',
                  backgroundColor: 'color-mix(in srgb, var(--navy) 70%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--sol-dust) 35%, transparent)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                BURST
              </button>
              <button
                onClick={handleWarp}
                title="Procedural Warp Surge Sound"
                style={{
                  padding: '0.4rem 0.2rem',
                  fontSize: '0.625rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--moon)',
                  backgroundColor: 'color-mix(in srgb, var(--navy) 70%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--star) 35%, transparent)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                WARP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pill Toggle Button */}
      <button
        type="button"
        onClick={() => {
          if (!expanded) {
            setExpanded(true);
            if (!enabled) handleToggleSound();
          } else {
            handleToggleSound();
          }
        }}
        aria-label="Toggle Cosmic Audio"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.45rem 0.75rem',
          backgroundColor: 'color-mix(in srgb, var(--deep) 90%, black)',
          border: `1px solid ${
            enabled
              ? 'color-mix(in srgb, var(--orbit) 60%, transparent)'
              : 'color-mix(in srgb, var(--steel) 35%, transparent)'
          }`,
          borderRadius: 'var(--radius-full)',
          boxShadow: enabled
            ? '0 0 16px color-mix(in srgb, var(--orbit) 35%, transparent)'
            : '0 4px 12px rgba(0,0,0,0.4)',
          cursor: 'pointer',
          color: enabled ? 'var(--moon)' : 'var(--steel)',
          fontSize: '0.6875rem',
          letterSpacing: '0.08em',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Animated Wave Indicator */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
            height: '12px',
          }}
          aria-hidden="true"
        >
          <span
            style={{
              width: '2px',
              height: enabled ? '10px' : '4px',
              backgroundColor: enabled ? 'var(--astrophage)' : 'var(--steel)',
              borderRadius: '1px',
              transition: 'height 0.2s ease',
            }}
          />
          <span
            style={{
              width: '2px',
              height: enabled ? '14px' : '6px',
              backgroundColor: enabled ? 'var(--orbit)' : 'var(--steel)',
              borderRadius: '1px',
              transition: 'height 0.2s ease',
            }}
          />
          <span
            style={{
              width: '2px',
              height: enabled ? '8px' : '3px',
              backgroundColor: enabled ? 'var(--star)' : 'var(--steel)',
              borderRadius: '1px',
              transition: 'height 0.2s ease',
            }}
          />
        </span>

        <span>{enabled ? 'COSMIC AUDIO' : 'AUDIO OFF'}</span>

        <span
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          style={{
            marginLeft: '0.2rem',
            color: 'var(--star)',
            opacity: 0.7,
            cursor: 'pointer',
            padding: '0 2px',
          }}
          title="Audio Settings"
        >
          {expanded ? '▾' : '▴'}
        </span>
      </button>
    </div>
  );
}
