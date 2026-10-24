import React, { useState, useEffect } from 'react';
import {
  isMusicEnabled,
  setMusicEnabled,
  toggleMusic,
  getMusicVolume,
  setMusicVolume,
  isSfxEnabled,
  setSfxEnabled,
  toggleSfx,
  getCurrentMovementInfo,
  playCelestialChime,
  playConsoleChirp,
  playGlassPing,
  playConfirmationTone,
  playRadioSignal,
  playSyntheticClick,
} from '../../lib/audioManager';

export default function SoundHud(): React.ReactElement {
  const [musicOn, setMusicOn] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [sfxOn, setSfxOn] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [movement, setMovement] = useState<{ name: string; theme: string }>({
    name: 'SILENT',
    theme: 'STANDBY',
  });
  const [previewFeedback, setPreviewFeedback] = useState<string | null>(null);

  // Sync state from audioManager and listen to custom state changes
  useEffect(() => {
    setMusicOn(isMusicEnabled());
    setVolume(getMusicVolume());
    setSfxOn(isSfxEnabled());
    setMovement(getCurrentMovementInfo());

    const handleStateUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{
        musicEnabled: boolean;
        musicVolume: number;
        sfxEnabled: boolean;
        movementName: string;
        movementTheme: string;
      }>;
      if (customEvent.detail) {
        setMusicOn(customEvent.detail.musicEnabled);
        setVolume(customEvent.detail.musicVolume);
        setSfxOn(customEvent.detail.sfxEnabled);
        setMovement({
          name: customEvent.detail.movementName,
          theme: customEvent.detail.movementTheme,
        });
      }
    };

    window.addEventListener('callisto-audio-manager-state', handleStateUpdate);

    // Periodically poll movement info if music is active
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

  const handleToggleSfx = () => {
    const next = toggleSfx();
    setSfxOn(next);
  };

  const triggerPreview = (name: string, fn: () => void) => {
    if (!sfxOn) {
      setPreviewFeedback('Enable Sound Effects to preview sounds');
      setTimeout(() => setPreviewFeedback(null), 2500);
      return;
    }
    fn();
    setPreviewFeedback(`Previewed: ${name}`);
    setTimeout(() => setPreviewFeedback(null), 2000);
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
      aria-label="Cinematic Audio & Sound Controls"
    >
      {/* Expanded Master Drawer */}
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
            width: '320px',
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
              marginBottom: '1rem',
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
                EXPEDITION AUDIO CONSOLE
              </div>
              <div
                style={{
                  fontSize: '0.625rem',
                  color: 'var(--astrophage)',
                  letterSpacing: '0.06em',
                }}
              >
                TWO INDEPENDENT CHANNELS
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
              aria-label="Close Audio Console"
            >
              &times;
            </button>
          </div>

          {/* CHANNEL A: CINEMATIC BACKGROUND MUSIC */}
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
                marginBottom: '0.45rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: 'var(--moon)',
                  letterSpacing: '0.06em',
                }}
              >
                CHANNEL A: BACKGROUND MUSIC
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
                {musicOn ? 'ENGAGED' : 'OFF'}
              </span>
            </div>

            {/* Live Movement / Motif Status */}
            <div
              style={{
                fontSize: '0.625rem',
                color: musicOn ? 'var(--orbit)' : 'var(--steel)',
                marginBottom: '0.65rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {musicOn
                ? `Active: ${movement.name} // ${movement.theme}`
                : 'Score in standby (click button to engage)'}
            </div>

            {/* Toggle Button */}
            <button
              type="button"
              onClick={handleToggleMusic}
              style={{
                width: '100%',
                padding: '0.55rem',
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
                marginBottom: '0.65rem',
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
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.625rem',
                  color: 'var(--steel)',
                  marginBottom: '0.25rem',
                }}
              >
                <span>Music Volume</span>
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
          </div>

          {/* CHANNEL B: INTERACTION SOUND EFFECTS */}
          <div
            style={{
              backgroundColor: 'color-mix(in srgb, var(--void) 75%, transparent)',
              border: `1px solid ${
                sfxOn
                  ? 'color-mix(in srgb, var(--astrophage) 60%, transparent)'
                  : 'color-mix(in srgb, var(--steel) 25%, transparent)'
              }`,
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.45rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: 'var(--moon)',
                  letterSpacing: '0.06em',
                }}
              >
                CHANNEL B: SOUND EFFECTS
              </span>
              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  color: sfxOn ? '#4ade80' : 'var(--steel)',
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
                    backgroundColor: sfxOn ? '#4ade80' : 'var(--steel)',
                    boxShadow: sfxOn ? '0 0 6px #4ade80' : 'none',
                  }}
                />
                {sfxOn ? 'ENABLED' : 'MUTED'}
              </span>
            </div>

            <p
              style={{
                fontSize: '0.625rem',
                color: 'var(--steel)',
                margin: '0 0 0.55rem 0',
                lineHeight: 1.35,
              }}
            >
              Controls navigation chimes, telemetry clicks, and interface audio.
            </p>

            {/* Toggle Button */}
            <button
              type="button"
              onClick={handleToggleSfx}
              style={{
                width: '100%',
                padding: '0.55rem',
                backgroundColor: sfxOn
                  ? 'color-mix(in srgb, var(--astrophage) 25%, var(--void))'
                  : 'color-mix(in srgb, var(--navy) 60%, transparent)',
                border: `1px solid ${
                  sfxOn ? 'var(--astrophage)' : 'color-mix(in srgb, var(--steel) 40%, transparent)'
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
                gap: '0.4rem',
                transition: 'all 0.2s',
              }}
              aria-pressed={sfxOn}
            >
              <span>{sfxOn ? 'Mute Sound Effects' : 'Enable Sound Effects'}</span>
            </button>

            {/* Page Sound Profile Audition Grid */}
            <div
              style={{
                fontSize: '0.5625rem',
                color: 'var(--steel)',
                letterSpacing: '0.06em',
                marginBottom: '0.35rem',
              }}
            >
              AUDITION PAGE AUDIO PROFILES:
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.3rem',
              }}
            >
              <button
                type="button"
                onClick={() => triggerPreview('Home Chime', playCelestialChime)}
                style={previewBtnStyle}
                title="Home: Soft celestial chime"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => triggerPreview('Missions Console', playConsoleChirp)}
                style={previewBtnStyle}
                title="Missions: Spacecraft console telemetry"
              >
                Missions
              </button>
              <button
                type="button"
                onClick={() => triggerPreview('Observatory Glass', playGlassPing)}
                style={previewBtnStyle}
                title="Observatory: Delicate glass ping"
              >
                Observatory
              </button>
              <button
                type="button"
                onClick={() => triggerPreview('Expedition Confirm', playConfirmationTone)}
                style={previewBtnStyle}
                title="Expedition: Electronic confirmation tone"
              >
                Expedition
              </button>
              <button
                type="button"
                onClick={() => triggerPreview('Events Radio', playRadioSignal)}
                style={previewBtnStyle}
                title="Events: Radio signal chirp"
              >
                Events
              </button>
              <button
                type="button"
                onClick={() => triggerPreview('About Click', playSyntheticClick)}
                style={previewBtnStyle}
                title="About/Crew/Join: Warm synthetic click"
              >
                About
              </button>
            </div>
          </div>

          {/* Feedback notice */}
          {previewFeedback && (
            <div
              style={{
                marginTop: '0.55rem',
                fontSize: '0.625rem',
                color: 'var(--astrophage)',
                textAlign: 'center',
              }}
            >
              {previewFeedback}
            </div>
          )}

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

      {/* Floating HUD Bar with Two Independent Controls */}
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
        {/* Control A: Music Pill */}
        <button
          type="button"
          onClick={handleToggleMusic}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.75rem',
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
          title={musicOn ? 'Background Music: ON (Click to turn off)' : 'Background Music: OFF (Click to turn on)'}
          aria-pressed={musicOn}
          aria-label="Background Music Toggle"
        >
          {/* Animated audio bar visualizer */}
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
          <span>{musicOn ? 'MUSIC ON' : 'MUSIC OFF'}</span>
        </button>

        {/* Control B: Sound Effects Pill */}
        <button
          type="button"
          onClick={handleToggleSfx}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.75rem',
            backgroundColor: sfxOn
              ? 'color-mix(in srgb, var(--astrophage) 25%, var(--void))'
              : 'transparent',
            border: `1px solid ${
              sfxOn ? 'var(--astrophage)' : 'transparent'
            }`,
            borderRadius: 'var(--radius-full)',
            color: sfxOn ? 'var(--moon)' : 'var(--steel)',
            cursor: 'pointer',
            fontSize: '0.6875rem',
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
          title={sfxOn ? 'Sound Effects: ON (Click to mute)' : 'Sound Effects: OFF (Click to enable)'}
          aria-pressed={sfxOn}
          aria-label="Interface Sound Effects Toggle"
        >
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: sfxOn ? '#4ade80' : 'var(--steel)',
              boxShadow: sfxOn ? '0 0 6px #4ade80' : 'none',
            }}
            aria-hidden="true"
          />
          <span>{sfxOn ? 'SFX ON' : 'SFX OFF'}</span>
        </button>

        {/* Options / Drawer Toggle */}
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
          title={expanded ? 'Collapse audio panel' : 'Open audio console & volume controls'}
          aria-expanded={expanded}
          aria-label="Open detailed audio settings"
        >
          {expanded ? '▾' : '▴'}
        </button>
      </div>
    </div>
  );
}

const previewBtnStyle: React.CSSProperties = {
  padding: '0.35rem 0.2rem',
  backgroundColor: 'color-mix(in srgb, var(--navy) 75%, transparent)',
  border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--moon)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.625rem',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'all 0.15s ease',
};
