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

import React, { useEffect, useState } from 'react';

export interface EventCountdownProps {
  /** Target date as an ISO-8601 string or valid Date string */
  targetDate: string;
  /** Name or title of the upcoming expedition / mission event */
  eventTitle: string;
  /** Whether to render in compact single-line telemetry format */
  compact?: boolean;
  /** Optional custom CSS class */
  className?: string;
  /** Optional inline style override */
  style?: React.CSSProperties;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isLaunched: boolean;
}

function calculateTimeRemaining(targetIso: string): TimeRemaining {
  const targetTime = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = targetTime - now;

  if (isNaN(targetTime) || diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      isLaunched: true,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMs: diff,
    isLaunched: false,
  };
}

/**
 * EventCountdown: Live telemetry countdown timer for mission launches and stargazing events.
 * Features 1-second refresh intervals, display typography, orbit glow effects,
 * and launched pulse states.
 */
export default function EventCountdown({
  targetDate,
  eventTitle,
  compact = false,
  className,
  style,
}: EventCountdownProps): React.ReactElement {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(targetDate)
  );
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
    // Initial immediate calculation
    setTimeLeft(calculateTimeRemaining(targetDate));

    const intervalId = window.setInterval(() => {
      const remaining = calculateTimeRemaining(targetDate);
      setTimeLeft(remaining);

      if (remaining.isLaunched) {
        window.clearInterval(intervalId);
      }
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [targetDate]);

  const pad = (n: number): string => String(n).padStart(2, '0');

  const formattedAccessibilityString = timeLeft.isLaunched
    ? `${eventTitle} has launched`
    : `T-minus ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds until ${eventTitle}`;

  // Pulse animation style injection
  const pulseKeyframes = `
    @keyframes callistoLaunchPulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
        filter: drop-shadow(0 0 12px var(--astrophage));
      }
      50% {
        opacity: 0.75;
        transform: scale(1.02);
        filter: drop-shadow(0 0 24px var(--astrophage));
      }
    }
  `;

  if (compact) {
    return (
      <div
        className={className}
        role="timer"
        aria-live="polite"
        aria-label={formattedAccessibilityString}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-xs)',
          fontFamily: 'var(--font-mono)',
          fontSize: '1rem',
          color: timeLeft.isLaunched ? 'var(--astrophage)' : 'var(--moon)',
          ...style,
        }}
      >
        <style>{pulseKeyframes}</style>
        {timeLeft.isLaunched ? (
          <span
            style={{
              fontWeight: 700,
              letterSpacing: '0.1em',
              animation: 'callistoLaunchPulse 2s ease-in-out infinite',
            }}
          >
            [LAUNCHED]
          </span>
        ) : (
          <span style={{ letterSpacing: '0.06em' }}>
            <span style={{ color: 'var(--orbit)', fontWeight: 600 }}>T-</span>
            {hasMounted
              ? `${timeLeft.days}d ${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m ${pad(timeLeft.seconds)}s`
              : '--d --h --m --s'}
          </span>
        )}
      </div>
    );
  }

  // Non-compact full display
  return (
    <section
      className={className}
      role="timer"
      aria-live="polite"
      aria-label={formattedAccessibilityString}
      style={{
        backgroundColor: 'var(--deep)',
        border: '1px solid color-mix(in srgb, var(--orbit) 30%, transparent)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-md) var(--space-lg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 32px color-mix(in srgb, var(--void) 60%, transparent)',
        ...style,
      }}
    >
      <style>{pulseKeyframes}</style>

      {/* Header telemetry badge & title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-md)',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: timeLeft.isLaunched
              ? 'var(--astrophage)'
              : 'var(--orbit)',
            boxShadow: `0 0 8px ${timeLeft.isLaunched ? 'var(--astrophage)' : 'var(--orbit)'}`,
          }}
        />
        <h4
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--star)',
            margin: 0,
            fontWeight: 500,
          }}
        >
          {eventTitle}
        </h4>
      </div>

      {timeLeft.isLaunched ? (
        <div
          style={{
            padding: 'var(--space-md) 0',
            textAlign: 'center',
            animation: 'callistoLaunchPulse 2s ease-in-out infinite',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '3rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'var(--astrophage)',
              textShadow:
                '0 0 24px color-mix(in srgb, var(--astrophage) 60%, transparent)',
              lineHeight: 1.1,
            }}
          >
            LAUNCHED
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--star)',
              letterSpacing: '0.18em',
              marginTop: 'var(--space-xs)',
              textTransform: 'uppercase',
            }}
          >
            MISSION IN PROGRESS // TELEMETRY ACTIVE
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-xs)',
            flexWrap: 'wrap',
          }}
        >
          {/* DAYS */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '68px',
              padding: 'var(--space-xs) var(--space-sm)',
              backgroundColor: 'color-mix(in srgb, var(--navy) 60%, transparent)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                fontWeight: 600,
                color: 'var(--moon)',
                lineHeight: 1,
                textShadow:
                  '0 0 16px color-mix(in srgb, var(--orbit) 50%, transparent)',
              }}
            >
              {hasMounted ? pad(timeLeft.days) : '--'}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.12em',
                color: 'var(--steel)',
                marginTop: 'var(--space-xs)',
                textTransform: 'uppercase',
              }}
            >
              DAYS
            </span>
          </div>

          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              color: 'var(--orbit)',
              opacity: 0.8,
              lineHeight: 1,
              alignSelf: 'center',
              paddingBottom: '1rem',
            }}
            aria-hidden="true"
          >
            :
          </span>

          {/* HOURS */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '68px',
              padding: 'var(--space-xs) var(--space-sm)',
              backgroundColor: 'color-mix(in srgb, var(--navy) 60%, transparent)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                fontWeight: 600,
                color: 'var(--moon)',
                lineHeight: 1,
                textShadow:
                  '0 0 16px color-mix(in srgb, var(--orbit) 50%, transparent)',
              }}
            >
              {hasMounted ? pad(timeLeft.hours) : '--'}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.12em',
                color: 'var(--steel)',
                marginTop: 'var(--space-xs)',
                textTransform: 'uppercase',
              }}
            >
              HRS
            </span>
          </div>

          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              color: 'var(--orbit)',
              opacity: 0.8,
              lineHeight: 1,
              alignSelf: 'center',
              paddingBottom: '1rem',
            }}
            aria-hidden="true"
          >
            :
          </span>

          {/* MINUTES */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '68px',
              padding: 'var(--space-xs) var(--space-sm)',
              backgroundColor: 'color-mix(in srgb, var(--navy) 60%, transparent)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                fontWeight: 600,
                color: 'var(--moon)',
                lineHeight: 1,
                textShadow:
                  '0 0 16px color-mix(in srgb, var(--orbit) 50%, transparent)',
              }}
            >
              {hasMounted ? pad(timeLeft.minutes) : '--'}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.12em',
                color: 'var(--steel)',
                marginTop: 'var(--space-xs)',
                textTransform: 'uppercase',
              }}
            >
              MIN
            </span>
          </div>

          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              color: 'var(--orbit)',
              opacity: 0.8,
              lineHeight: 1,
              alignSelf: 'center',
              paddingBottom: '1rem',
            }}
            aria-hidden="true"
          >
            :
          </span>

          {/* SECONDS */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '68px',
              padding: 'var(--space-xs) var(--space-sm)',
              backgroundColor: 'color-mix(in srgb, var(--navy) 60%, transparent)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                fontWeight: 600,
                color: 'var(--moon)',
                lineHeight: 1,
                textShadow:
                  '0 0 16px color-mix(in srgb, var(--orbit) 50%, transparent)',
              }}
            >
              {hasMounted ? pad(timeLeft.seconds) : '--'}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.12em',
                color: 'var(--steel)',
                marginTop: 'var(--space-xs)',
                textTransform: 'uppercase',
              }}
            >
              SEC
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
