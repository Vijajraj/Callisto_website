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

import React, { useState, useEffect } from 'react';
import {
  isMusicEnabled,
  toggleMusic,
  getMusicVolume,
  setMusicVolume,
  getCurrentMovementInfo,
} from '../../lib/audioManager';

export default function SoundHud(): React.ReactElement {
  const [musicOn, setMusicOn] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [movement, setMovement] = useState<{ name: string; theme: string }>({
    name: 'SILENT',
    theme: 'STANDBY',
  });

  useEffect(() => {
    setMusicOn(isMusicEnabled());
    setVolume(getMusicVolume());
    setMovement(getCurrentMovementInfo());

    const handleStateUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{
        musicEnabled: boolean;
        musicVolume: number;
        movementName: string;
        movementTheme: string;
      }>;
      if (customEvent.detail) {
        setMusicOn(customEvent.detail.musicEnabled);
        setVolume(customEvent.detail.musicVolume);
        setMovement({
          name: customEvent.detail.movementName,
          theme: customEvent.detail.movementTheme,
        });
      }
    };

    window.addEventListener('callisto-audio-manager-state', handleStateUpdate);

    const pollInterval = window.setInterval(() => {
      if (isMusicEnabled()) {
        setMovement(getCurrentMovementInfo());
      }
    }, 1000);

    return () => {
      window.removeEventListener('callisto-audio-manager-state', handleStateUpdate);
      clearInterval(pollInterval);
    };
  }, []);

  const handleToggleMusic = () => {
    const next = toggleMusic();
    setMusicOn(next);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setMusicVolume(newVol);
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
      role="region"
      aria-label="Expedition Background Music Audio Console"
    >
      {/* Expanded Master Music Console */}
      {expanded && (
        <div
          style={{
            marginBottom: '0.65rem',
            backgroundColor: 'color-mix(in srgb, var(--deep) 96%, black)',
            border: '1px solid color-mix(in srgb, var(--orbit) 55%, transparent)',
            borderRadius: 'var(--radius-md)',
            padding: '1.1rem',
            boxShadow:
              '0 16px 40px rgba(0, 0, 0, 0.5), 0 0 24px color-mix(in srgb, var(--orbit) 25%, transparent)',
            backdropFilter: 'blur(20px)',
            width: '300px',
            maxWidth: 'calc(100vw - 2.5rem)',
            boxSizing: 'border-box',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
              paddingBottom: '0.6rem',
              marginBottom: '0.85rem',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--moon)',
                  letterSpacing: '0.1em',
                }}
              >
                EXPEDITION CATHEDRAL SCORE
              </div>
              <div
                style={{
                  fontSize: '0.625rem',
                  color: 'var(--astrophage)',
                  letterSpacing: '0.06em',
                }}
              >
                CINEMATIC INSTRUMENTAL SUITE
              </div>
            </div>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--steel)',
                cursor: 'pointer',
                fontSize: '1.2rem',
                lineHeight: 1,
                padding: '0 0.25rem',
              }}
              aria-label="Close Music Console"
            >
              &times;
            </button>
          </div>

          {/* Active Movement Status */}
          <div
            style={{
              backgroundColor: 'color-mix(in srgb, var(--void) 75%, transparent)',
              border: `1px solid ${
                musicOn
                  ? 'color-mix(in srgb, var(--orbit) 60%, transparent)'
                  : 'color-mix(in srgb, var(--steel) 25%, transparent)'
              }`,
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem',
              marginBottom: '0.85rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.35rem',
              }}
            >
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--moon)' }}>
                ACTIVE MOVEMENT
              </span>
              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  color: musicOn ? '#4ade80' : 'var(--steel)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: musicOn ? '#4ade80' : 'var(--steel)',
                    boxShadow: musicOn ? '0 0 6px #4ade80' : 'none',
                  }}
                />
                {musicOn ? 'PLAYING' : 'MUTED'}
              </span>
            </div>

            <div
              style={{
                fontSize: '0.6875rem',
                color: musicOn ? 'var(--orbit)' : 'var(--steel)',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {musicOn
                ? `${movement.name} // ${movement.theme}`
                : 'Score in standby (click to engage)'}
            </div>
          </div>

          {/* Master Music Toggle */}
          <button
            type="button"
            onClick={handleToggleMusic}
            style={{
              width: '100%',
              padding: '0.65rem',
              backgroundColor: musicOn
                ? 'color-mix(in srgb, var(--orbit) 25%, var(--void))'
                : 'color-mix(in srgb, var(--navy) 60%, transparent)',
              border: `1px solid ${
                musicOn ? 'var(--orbit)' : 'color-mix(in srgb, var(--steel) 40%, transparent)'
              }`,
              borderRadius: 'var(--radius-sm)',
              color: 'var(--moon)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
            }}
            aria-pressed={musicOn}
          >
            <span>{musicOn ? 'Pause Background Music' : 'Start Background Music'}</span>
          </button>

          {/* Volume Slider */}
          <div style={{ marginBottom: '0.5rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.625rem',
                color: 'var(--steel)',
                marginBottom: '0.35rem',
              }}
            >
              <span>Score Volume</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={volume}
              onChange={handleVolumeChange}
              disabled={!musicOn}
              aria-label="Background Music Volume"
              style={{
                width: '100%',
                accentColor: 'var(--orbit)',
                cursor: musicOn ? 'pointer' : 'not-allowed',
                opacity: musicOn ? 1 : 0.45,
              }}
            />
          </div>

          <div
            style={{
              marginTop: '0.75rem',
              fontSize: '0.5625rem',
              color: 'var(--steel)',
              textAlign: 'center',
              letterSpacing: '0.04em',
            }}
          >
            PREFERENCES PERSISTED ACROSS NAVIGATION
          </div>
        </div>
      )}

      {/* Floating HUD Pill Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'color-mix(in srgb, var(--deep) 90%, black)',
          border: '1px solid color-mix(in srgb, var(--orbit) 40%, transparent)',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(12px)',
          padding: '0.25rem',
          gap: '0.2rem',
        }}
      >
        <button
          type="button"
          onClick={handleToggleMusic}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 0.85rem',
            backgroundColor: musicOn
              ? 'color-mix(in srgb, var(--orbit) 25%, var(--void))'
              : 'transparent',
            border: `1px solid ${
              musicOn ? 'var(--orbit)' : 'transparent'
            }`,
            borderRadius: 'var(--radius-full)',
            color: musicOn ? 'var(--moon)' : 'var(--steel)',
            cursor: 'pointer',
            fontSize: '0.6875rem',
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
          title={musicOn ? 'Background Music: ON (Click to pause)' : 'Background Music: OFF (Click to play)'}
          aria-pressed={musicOn}
          aria-label="Background Music Toggle"
        >
          {/* Animated Waveform Visualizer */}
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
                height: musicOn ? '10px' : '3px',
                backgroundColor: musicOn ? '#4ade80' : 'var(--steel)',
                borderRadius: '1px',
                transition: 'height 0.2s ease',
              }}
            />
            <span
              style={{
                width: '2px',
                height: musicOn ? '14px' : '5px',
                backgroundColor: musicOn ? 'var(--orbit)' : 'var(--steel)',
                borderRadius: '1px',
                transition: 'height 0.2s ease',
              }}
            />
            <span
              style={{
                width: '2px',
                height: musicOn ? '8px' : '3px',
                backgroundColor: musicOn ? 'var(--astrophage)' : 'var(--steel)',
                borderRadius: '1px',
                transition: 'height 0.2s ease',
              }}
            />
          </span>
          <span>{musicOn ? 'EXPEDITION SCORE' : 'SCORE OFF'}</span>
        </button>

        {/* Expand / Collapse Drawer Toggle */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--orbit)',
            padding: '0.45rem 0.55rem',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
          }}
          title={expanded ? 'Collapse score console' : 'Open score console & volume controls'}
          aria-expanded={expanded}
          aria-label="Open detailed music volume settings"
        >
          {expanded ? '▾' : '▴'}
        </button>
      </div>
    </div>
  );
}
