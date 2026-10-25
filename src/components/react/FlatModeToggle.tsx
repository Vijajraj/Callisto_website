/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

import React, { useEffect, useState, useCallback } from 'react';

export interface FlatModeToggleProps {
  /** Optional custom CSS class name */
  className?: string;
  /** Optional inline style override */
  style?: React.CSSProperties;
}

/**
 * FlatModeToggle: Navigation control switching between full immersive space expedition
 * mode (3D starfield, canvas telemetry, glow animations) and Flat Mode (reduced motion,
 * low-contrast high-readability static UI).
 */
export default function FlatModeToggle({
  className,
  style,
}: FlatModeToggleProps): React.ReactElement {
  const [isFlat, setIsFlat] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Sync state on client mount
  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    const savedMode = localStorage.getItem('callisto_mode');
    const rootHasClass = document.documentElement.classList.contains('flat-mode');

    if (savedMode === 'flat' || rootHasClass) {
      setIsFlat(true);
      document.documentElement.classList.add('flat-mode');
    } else {
      setIsFlat(false);
      document.documentElement.classList.remove('flat-mode');
    }
  }, []);

  const toggleMode = useCallback(() => {
    setIsFlat((prev) => {
      const nextState = !prev;
      if (typeof window !== 'undefined') {
        if (nextState) {
          document.documentElement.classList.add('flat-mode');
          localStorage.setItem('callisto_mode', 'flat');
          window.dispatchEvent(
            new CustomEvent('callisto-mode-change', { detail: { mode: 'flat' } })
          );
        } else {
          document.documentElement.classList.remove('flat-mode');
          localStorage.setItem('callisto_mode', 'immersive');
          window.dispatchEvent(
            new CustomEvent('callisto-mode-change', {
              detail: { mode: 'immersive' },
            })
          );
        }
      }
      return nextState;
    });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleMode();
    }
  };

  const currentLabel = isFlat
    ? 'Flat mode active. Switch to immersive 3D expedition mode.'
    : 'Immersive mode active. Switch to flat document mode.';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isFlat}
      aria-label={currentLabel}
      title={currentLabel}
      onClick={toggleMode}
      onKeyDown={handleKeyDown}
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '92px',
        height: '28px',
        padding: '0 6px',
        backgroundColor: 'var(--deep)',
        border: '1px solid var(--steel)',
        borderRadius: 'var(--radius-full)',
        cursor: 'pointer',
        outline: 'none',
        userSelect: 'none',
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--orbit)';
        e.currentTarget.style.boxShadow =
          '0 0 0 2px color-mix(in srgb, var(--orbit) 35%, transparent)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'var(--steel)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      onMouseEnter={(e) => {
        if (document.activeElement !== e.currentTarget) {
          e.currentTarget.style.borderColor = 'var(--star)';
        }
      }}
      onMouseLeave={(e) => {
        if (document.activeElement !== e.currentTarget) {
          e.currentTarget.style.borderColor = 'var(--steel)';
        }
      }}
    >
      {/* Immersive Label & Rocket Icon */}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          color: !isFlat && mounted ? 'var(--moon)' : 'var(--steel)',
          zIndex: 1,
          transition: 'color 200ms ease',
          pointerEvents: 'none',
        }}
      >
        <svg
          viewBox="0 0 16 16"
          width="10"
          height="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Rocket Icon */}
          <path d="M9.5 2.5a5 5 0 0 1 4 4c0 3.5-3.5 6.5-6.5 6.5l-2-2C5 8 8 4.5 9.5 2.5z" />
          <path d="M5 11l-3 1 1-3" />
          <circle cx="9.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
        IMM
      </span>

      {/* Flat Label & Document Icon */}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          color: isFlat && mounted ? 'var(--moon)' : 'var(--steel)',
          zIndex: 1,
          transition: 'color 200ms ease',
          pointerEvents: 'none',
        }}
      >
        FLAT
        <svg
          viewBox="0 0 16 16"
          width="10"
          height="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Document Icon */}
          <rect x="3" y="2" width="10" height="12" rx="1.5" />
          <line x1="6" y1="5.5" x2="10" y2="5.5" />
          <line x1="6" y1="8" x2="10" y2="8" />
          <line x1="6" y1="10.5" x2="9" y2="10.5" />
        </svg>
      </span>

      {/* Sliding Indicator Knob */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '2px',
          left: isFlat ? 'calc(100% - 24px - 2px)' : '2px',
          width: '24px',
          height: '22px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: isFlat ? 'var(--steel)' : 'var(--orbit)',
          boxShadow: isFlat
            ? 'none'
            : '0 0 8px color-mix(in srgb, var(--orbit) 50%, transparent)',
          transition:
            'left 250ms cubic-bezier(0.4, 0, 0.2, 1), background-color 250ms ease, box-shadow 250ms ease',
          zIndex: 0,
        }}
      />
    </button>
  );
}
