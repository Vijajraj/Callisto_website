/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

import React, { useState, useCallback } from 'react';

/**
 * JoinRocketHud
 *
 * Replaces the legacy sound console with an interactive rocket-launch "JOIN NOW" trigger.
 * Features the Starfield expedition insignia badge, orbital thruster glow,
 * and a supersonic rocket liftoff animation sequence that launches upwards
 * into the cosmos before navigating to the expedition enlistment protocol (/join).
 */
export default function SoundHud(): React.ReactElement {
  const [launchState, setLaunchState] = useState<'idle' | 'igniting' | 'launched'>('idle');

  const handleLaunch = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (launchState !== 'idle') return;

    // Phase 1: Thruster Ignition & Micro-rumble
    setLaunchState('igniting');

    // Phase 2: Full Supersonic Liftoff Acceleration
    const ignitionTimer = setTimeout(() => {
      setLaunchState('launched');
    }, 180);

    // Phase 3: Departure Navigation to /join
    const navTimer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        if (window.location.pathname === '/join' || window.location.pathname === '/join/') {
          const formEl = document.getElementById('join-form') || document.querySelector('form');
          if (formEl) {
            formEl.scrollIntoView({ behavior: 'smooth' });
          }
          setLaunchState('idle');
        } else {
          window.location.href = '/join';
        }
      }
    }, 850);

    return () => {
      clearTimeout(ignitionTimer);
      clearTimeout(navTimer);
    };
  }, [launchState]);

  return (
    <div
      className={`callisto-join-rocket-hud ${launchState !== 'idle' ? `state-${launchState}` : ''}`}
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 850,
        pointerEvents: launchState === 'launched' ? 'none' : 'auto',
      }}
      role="region"
      aria-label="Expedition Enlistment Rocket Launcher"
    >
      <style>{`
        .callisto-join-rocket-hud {
          transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .rocket-launch-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          outline: none;
          position: relative;
          text-decoration: none;
          color: inherit;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .rocket-badge-wrapper {
          position: relative;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #213250;
          border: 1.5px solid rgba(56, 189, 248, 0.4);
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.65), 0 0 16px rgba(56, 189, 248, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          overflow: hidden;
        }

        .rocket-badge-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          pointer-events: none;
        }

        .rocket-label-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #FFFFFF;
          background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%);
          border: 1px solid rgba(125, 211, 252, 0.6);
          padding: 0.22rem 0.65rem;
          border-radius: 9999px;
          box-shadow: 0 2px 10px rgba(2, 132, 199, 0.45);
          white-space: nowrap;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }

        .rocket-launch-btn:hover .rocket-badge-wrapper {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.8), 0 0 22px rgba(56, 189, 248, 0.65);
          border-color: #38BDF8;
        }

        .rocket-launch-btn:hover .rocket-label-pill {
          background: linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(14, 165, 233, 0.65);
        }

        .rocket-launch-btn:focus-visible .rocket-badge-wrapper {
          outline: 2px solid #38BDF8;
          outline-offset: 4px;
        }

        /* Thruster Exhaust & Flames */
        .thruster-plume {
          position: absolute;
          top: 96%;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 0px;
          opacity: 0;
          pointer-events: none;
          z-index: -1;
          transition: height 0.15s ease, opacity 0.15s ease;
        }

        .plume-core {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 100%;
          background: linear-gradient(to bottom, #FFFFFF 0%, #F59E0B 40%, #EF4444 80%, transparent 100%);
          border-radius: 50% 50% 20% 20%;
          filter: blur(1px);
        }

        .plume-outer {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 26px;
          height: 120%;
          background: radial-gradient(ellipse at top, rgba(56, 189, 248, 0.8) 0%, rgba(249, 115, 22, 0.6) 50%, transparent 90%);
          filter: blur(4px);
        }

        /* State: Igniting Rumble */
        .callisto-join-rocket-hud.state-igniting {
          animation: rocketRumble 0.08s ease-in-out infinite alternate;
        }

        .callisto-join-rocket-hud.state-igniting .thruster-plume {
          opacity: 1;
          height: 48px;
        }

        .callisto-join-rocket-hud.state-igniting .rocket-badge-wrapper {
          box-shadow: 0 0 30px rgba(245, 158, 11, 0.85), 0 0 50px rgba(239, 68, 68, 0.65);
          border-color: #F59E0B;
        }

        /* State: Launched Blastoff */
        .callisto-join-rocket-hud.state-launched {
          animation: rocketBlastoff 0.8s cubic-bezier(0.5, 0, 0.75, 0) forwards;
        }

        .callisto-join-rocket-hud.state-launched .thruster-plume {
          opacity: 1;
          height: 160px;
        }

        .callisto-join-rocket-hud.state-launched .rocket-badge-wrapper {
          box-shadow: 0 0 45px rgba(245, 158, 11, 1), 0 0 70px rgba(239, 68, 68, 0.9);
          border-color: #FEF08A;
        }

        @keyframes rocketRumble {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(-1.5px, 1px) rotate(-1.5deg);
          }
          100% {
            transform: translate(1.5px, -1px) rotate(1.5deg);
          }
        }

        @keyframes rocketBlastoff {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          20% {
            transform: translate(0, 4px) scale(0.96) rotate(-0.5deg);
            opacity: 1;
          }
          50% {
            transform: translate(0, -35vh) scale(1.08) rotate(-1.5deg);
            opacity: 1;
          }
          85% {
            transform: translate(0, -95vh) scale(0.9) rotate(-1deg);
            opacity: 0.95;
          }
          100% {
            transform: translate(0, -140vh) scale(0.75) rotate(-0.5deg);
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .callisto-join-rocket-hud {
            bottom: 0.75rem !important;
            right: 0.75rem !important;
          }
          .rocket-badge-wrapper {
            width: 52px;
            height: 52px;
          }
          .rocket-badge-img {
            width: 100%;
            height: 100%;
          }
          .rocket-label-pill {
            font-size: 0.62rem;
            padding: 0.18rem 0.5rem;
            letter-spacing: 0.1em;
          }
        }
      `}</style>

      <button
        type="button"
        className="rocket-launch-btn"
        onClick={handleLaunch}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleLaunch(e);
          }
        }}
        aria-label="Join Callisto Expedition - Launch Rocket"
        title="Launch Expedition // Join Callisto"
      >
        <div className="rocket-badge-wrapper">
          <img
            src="/icons/starfield-rocket-badge.png"
            alt="Callisto Starfield Insignia"
            className="rocket-badge-img"
            width="66"
            height="66"
            decoding="async"
          />

          {/* Rocket Thruster Engine Plume */}
          <div className="thruster-plume" aria-hidden="true">
            <div className="plume-outer" />
            <div className="plume-core" />
          </div>
        </div>

        <span className="rocket-label-pill">
          JOIN NOW
        </span>
      </button>
    </div>
  );
}
