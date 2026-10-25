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

/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

import React, { useEffect, useState, useRef } from 'react';
import { toggleAmbientSound } from '../../lib/audio';

/**
 * CrescentLoader: Act 0 Pre-launch loading sequence.
 * Features SVG stroke drawing, fill morphing, starburst arrival,
 * telemetry typewriter, and smooth exit revelation.
 */
export default function CrescentLoader(): React.ReactElement | null {
  const [mounted, setMounted] = useState<boolean>(false);
  const [stage, setStage] = useState<number>(0);
  const [typedChars, setTypedChars] = useState<number>(0);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const fullText = 'Systems nominal';
  const timerRefs = useRef<number[]>([]);

  // Clear timers on cleanup
  const clearAllTimers = () => {
    timerRefs.current.forEach((id) => window.clearTimeout(id));
    timerRefs.current = [];
  };

  const finishSequence = () => {
    clearAllTimers();
    setIsFadingOut(true);
    const endTimer = window.setTimeout(() => {
      setIsDismissed(true);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('loader-complete'));
      }
    }, 500);
    timerRefs.current.push(endTimer);
  };

  useEffect(() => {
    setMounted(true);

    if (typeof window === 'undefined') return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Check sessionStorage for previous visits
    const hasVisited = Boolean(sessionStorage.getItem('callisto_visited'));

    if (prefersReducedMotion || hasVisited) {
      // Fast path: show completed state briefly, then fade out
      setStage(4);
      setTypedChars(fullText.length);
      const fastTimer = window.setTimeout(() => {
        finishSequence();
      }, 500);
      timerRefs.current.push(fastTimer);
      sessionStorage.setItem('callisto_visited', 'true');
      return () => clearAllTimers();
    }

    sessionStorage.setItem('callisto_visited', 'true');

    // Stage 0: 0 -> 1000ms: Crescent arc draws itself
    setStage(0);

    // Stage 1: 1000ms -> 1500ms: Crescent fills in
    const t1 = window.setTimeout(() => {
      setStage(1);
    }, 1000);
    timerRefs.current.push(t1);

    // Stage 2: 1500ms -> 2000ms: Four-point star fades in and scales
    const t2 = window.setTimeout(() => {
      setStage(2);
    }, 1500);
    timerRefs.current.push(t2);

    // Stage 3: 2000ms -> 2500ms: Orbit ring spins up
    const t3 = window.setTimeout(() => {
      setStage(3);
    }, 2000);
    timerRefs.current.push(t3);

    // Stage 4: 2500ms -> 3000ms: Typewriter for "Systems nominal"
    const t4 = window.setTimeout(() => {
      setStage(4);
      // Typewriter effect across 500ms for 15 characters (~33ms per char)
      for (let i = 1; i <= fullText.length; i++) {
        const typeTimer = window.setTimeout(() => {
          setTypedChars(i);
        }, (i * 500) / fullText.length);
        timerRefs.current.push(typeTimer);
      }
    }, 2500);
    timerRefs.current.push(t4);

    // Stage 5: 3000ms -> 3500ms: Exit sequence (fade and slide up)
    const t5 = window.setTimeout(() => {
      finishSequence();
    }, 3000);
    timerRefs.current.push(t5);

    // Escape key listener for fast skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        finishSequence();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearAllTimers();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!mounted || isDismissed) {
    return null;
  }

  // Styles computed based on stages
  const isCrescentDrawn = stage >= 0;
  const isCrescentFilled = stage >= 1;
  const isStarVisible = stage >= 2;
  const isOrbitVisible = stage >= 3;
  const isTextStage = stage >= 4;

  return (
    <aside
      role="status"
      aria-live="polite"
      aria-label="Expedition launch sequence loading"
      onClick={finishSequence}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'var(--void)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        overflow: 'hidden',
        cursor: 'pointer',
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isFadingOut ? 'none' : 'auto',
      }}
    >
      <style>{`
        @keyframes callistoDrawArc {
          0% {
            stroke-dashoffset: 240;
            opacity: 0.2;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        @keyframes callistoOrbitSpin {
          0% {
            transform: rotate(0deg);
            opacity: 0;
          }
          40% {
            opacity: 0.8;
          }
          100% {
            transform: rotate(360deg);
            opacity: 1;
          }
        }
        @keyframes callistoBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes callistoSubtleGlow {
          0%, 100% {
            filter: drop-shadow(0 0 10px color-mix(in srgb, var(--orbit) 40%, transparent));
          }
          50% {
            filter: drop-shadow(0 0 24px color-mix(in srgb, var(--orbit) 80%, transparent));
          }
        }
      `}</style>

      {/* Centerpiece SVG */}
      <div
        style={{
          position: 'relative',
          width: '280px',
          height: '220px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: stage >= 2 ? 'callistoSubtleGlow 3s ease-in-out infinite' : 'none',
        }}
      >
        <svg
          viewBox="0 0 310 200"
          width="100%"
          height="100%"
          style={{ overflow: 'visible' }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="crescentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--moon)" />
              <stop offset="60%" stopColor="var(--star)" />
              <stop offset="100%" stopColor="var(--orbit)" />
            </linearGradient>
            <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--moon)" stopOpacity="1" />
              <stop offset="60%" stopColor="var(--star)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--orbit)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Orbit Ring */}
          <g
            style={{
              transformOrigin: '155px 100px',
              animation: isOrbitVisible ? 'callistoOrbitSpin 12s linear infinite' : 'none',
              transition: 'opacity 500ms ease-out',
              opacity: isOrbitVisible ? 0.9 : 0,
            }}
          >
            <ellipse
              cx="155"
              cy="100"
              rx="96"
              ry="38"
              fill="none"
              stroke="var(--orbit)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              strokeOpacity="0.75"
            />
            {/* Orbital Satellite Node */}
            <circle
              cx="251"
              cy="100"
              r="3.5"
              fill="var(--astrophage)"
              style={{
                filter: 'drop-shadow(0 0 6px var(--astrophage))',
              }}
            />
          </g>

          {/* Stroke Outline Arc (0s -> 1s) */}
          <path
            d="M 155 40 A 75 75 0 1 0 155 160"
            fill="none"
            stroke="var(--moon)"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{
              strokeDasharray: 240,
              strokeDashoffset: isCrescentDrawn ? 0 : 240,
              transition: 'stroke-dashoffset 1000ms cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: isCrescentFilled ? 0.4 : 1,
            }}
          />

          {/* Filled Crescent (1s -> 1.5s crossfade) */}
          <path
            d="M 155 40 A 75 75 0 1 0 155 160 A 60 60 0 0 1 155 40 Z"
            fill="url(#crescentGrad)"
            style={{
              opacity: isCrescentFilled ? 1 : 0,
              transition: 'opacity 500ms ease-in-out',
              filter: 'drop-shadow(0 0 14px color-mix(in srgb, var(--orbit) 50%, transparent))',
            }}
          />

          {/* Four-Point Star (1.5s -> 2s) */}
          <g
            style={{
              transformOrigin: '152px 58px',
              transform: isStarVisible ? 'scale(1)' : 'scale(0.3)',
              opacity: isStarVisible ? 1 : 0,
              transition: 'transform 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 500ms ease-out',
            }}
          >
            {/* Halo behind the star */}
            <circle cx="152" cy="58" r="22" fill="url(#starGlow)" opacity="0.65" />
            <path
              d="M 152 28 L 159 51 L 182 58 L 159 65 L 152 88 L 145 65 L 122 58 L 145 51 Z"
              fill="var(--star)"
              style={{
                filter: 'drop-shadow(0 0 8px var(--moon))',
              }}
            />
            {/* Central Star Pinpoint */}
            <circle cx="152" cy="58" r="2.5" fill="var(--moon)" />
          </g>
        </svg>
      </div>

      {/* Telemetry Status Readout */}
      <div
        style={{
          marginTop: 'var(--space-xl)',
          minHeight: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-xs)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.875rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--star)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <span>{fullText.slice(0, typedChars)}</span>
          {isTextStage && typedChars < fullText.length && (
            <span
              style={{
                display: 'inline-block',
                width: '7px',
                height: '14px',
                backgroundColor: 'var(--orbit)',
                animation: 'callistoBlink 600ms infinite',
              }}
            />
          )}
          {typedChars === fullText.length && (
            <span
              style={{
                display: 'inline-block',
                color: 'var(--astrophage)',
                marginLeft: '0.25rem',
                fontSize: '0.75rem',
              }}
            >
              [OK]
            </span>
          )}
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            letterSpacing: '0.12em',
            color: 'var(--steel)',
            opacity: isTextStage ? 0.9 : 0,
            transition: 'opacity 400ms ease-in',
          }}
        >
          CALLISTO MISSION CONTROL // ACT 0 INITIALIZATION
        </div>
      </div>

      {/* Launch Action Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: 'var(--space-xl)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <button
          type="button"
          onClick={finishSequence}
          style={{
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--orbit) 25%, transparent), color-mix(in srgb, var(--astrophage) 20%, transparent))',
            border: '1px solid var(--orbit)',
            color: 'var(--moon)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            padding: '0.55rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            boxShadow: '0 0 15px color-mix(in srgb, var(--orbit) 30%, transparent)',
            transition: 'all 200ms ease',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.04)';
            e.currentTarget.style.boxShadow = '0 0 25px color-mix(in srgb, var(--orbit) 50%, transparent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 15px color-mix(in srgb, var(--orbit) 30%, transparent)';
          }}
          aria-label="Enter Expedition with Audio"
        >
          ✦ ENTER EXPEDITION
        </button>

        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            letterSpacing: '0.08em',
            color: 'var(--steel)',
          }}
        >
          CLICK ANYWHERE OR PRESS ESC TO PROCEED
        </span>
      </div>
    </aside>
  );
}
