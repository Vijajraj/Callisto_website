import React, { useState } from 'react';
import { playTelemetryBeep } from '../../lib/audio';

interface TargetObject {
  id: string;
  name: string;
  type: string;
  constellation: string;
  ra: string;
  dec: string;
  magnitude: string;
  optimalZoom: number;
  description: string;
}

const TARGETS: TargetObject[] = [
  {
    id: 'jupiter',
    name: 'Jupiter & Galilean Moons',
    type: 'Gas Giant Planetary System',
    constellation: 'Taurus',
    ra: '04h 12m 30s',
    dec: '+18° 42\' 10"',
    magnitude: '-2.7',
    optimalZoom: 150,
    description: 'Notice Callisto, Ganymede, Europa, and Io positioned like luminous pearls flanking the Great Red Spot.',
  },
  {
    id: 'saturn',
    name: 'Saturn & Cassini Division',
    type: 'Ringed Planetary System',
    constellation: 'Aquarius',
    ra: '22h 30m 15s',
    dec: '-10° 15\' 40"',
    magnitude: '+0.7',
    optimalZoom: 200,
    description: 'Prominent ring tilt displaying the dark Cassini gap and atmospheric equatorial bands.',
  },
  {
    id: 'm42',
    name: 'Orion Nebula (M42 / NGC 1976)',
    type: 'Diffuse Emission / Reflection Nebula',
    constellation: 'Orion',
    ra: '05h 35m 17s',
    dec: '-05° 23\' 28"',
    magnitude: '+4.0',
    optimalZoom: 60,
    description: 'Stellar nursery energized by the Trapezium open cluster, glowing with ionized hydrogen and oxygen.',
  },
  {
    id: 'andromeda',
    name: 'Andromeda Galaxy (M31)',
    type: 'Barred Spiral Galaxy',
    constellation: 'Andromeda',
    ra: '00h 42m 44s',
    dec: '+41° 16\' 09"',
    magnitude: '+3.4',
    optimalZoom: 40,
    description: 'Spanning over 2.5 million light-years away, featuring dust lanes and satellite galaxies M32 and M110.',
  },
];

const FILTERS = [
  { id: 'clear', label: 'Clear Optical', color: '#f7f5ff', filterStyle: 'none' },
  { id: 'halpha', label: 'Hydrogen-Alpha (656nm)', color: '#ef4444', filterStyle: 'drop-shadow(0 0 16px #ef4444) hue-rotate(330deg)' },
  { id: 'oiii', label: 'Oxygen-III (501nm)', color: '#06b6d4', filterStyle: 'drop-shadow(0 0 16px #06b6d4) hue-rotate(140deg)' },
  { id: 'lpro', label: 'City Light-Pollution Cut', color: '#a855f7', filterStyle: 'contrast(1.4) brightness(1.1)' },
];

export default function TelescopeSimulator(): React.ReactElement {
  const [selectedTarget, setSelectedTarget] = useState<TargetObject>(TARGETS[0]);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [focusLevel, setFocusLevel] = useState<number>(100);

  const handleTargetChange = (target: TargetObject) => {
    playTelemetryBeep(600, 0.1);
    setSelectedTarget(target);
    setZoomLevel(target.optimalZoom);
    setPanOffset({ x: 0, y: 0 });
  };

  const pan = (dx: number, dy: number) => {
    playTelemetryBeep(900, 0.03);
    setPanOffset((prev) => ({
      x: Math.max(-120, Math.min(120, prev.x + dx)),
      y: Math.max(-120, Math.min(120, prev.y + dy)),
    }));
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--deep)',
        border: '1px solid color-mix(in srgb, var(--orbit) 35%, transparent)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-xl)',
        boxShadow: '0 12px 40px color-mix(in srgb, var(--void) 85%, transparent)',
        marginBottom: 'var(--space-3xl)',
      }}
    >
      <style>{`
        .slewer-btn:hover {
          background-color: var(--orbit) !important;
          color: var(--void) !important;
        }
        .target-btn:hover {
          border-color: var(--orbit) !important;
          color: var(--moon) !important;
        }
      `}</style>

      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-md)',
          borderBottom: '1px solid color-mix(in srgb, var(--steel) 25%, transparent)',
          paddingBottom: 'var(--space-md)',
          marginBottom: 'var(--space-xl)',
        }}
      >
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--orbit)', letterSpacing: '0.15em' }}>
            ROOFTOP OPTICAL ARRAY // INTERACTIVE TELESCOPE RIG
          </span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', margin: '0.2rem 0 0 0', color: 'var(--moon)' }}>
            Observatory Eyepiece Simulator
          </h3>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--steel)' }}>
            OPTICS: <span style={{ color: 'var(--astrophage)' }}>203mm f/10 Schmidt-Cassegrain</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Eyepiece View + Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: 'var(--space-2xl)',
          alignItems: 'center',
        }}
      >
        {/* Left: Circular Telescope Eyepiece */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              backgroundColor: '#02040a',
              border: '6px solid #14204f',
              boxShadow: '0 0 0 4px var(--deep), 0 0 32px color-mix(in srgb, var(--void) 90%, transparent), inset 0 0 40px rgba(0,0,0,0.9)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Celestial Target Rendering Layer with Filter & Pan */}
            <div
              style={{
                position: 'absolute',
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel / 100})`,
                filter: activeFilter.filterStyle,
                transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                opacity: focusLevel / 100,
              }}
            >
              {selectedTarget.id === 'jupiter' && (
                <svg viewBox="0 0 200 200" width="200" height="200">
                  {/* Outer Jovian Globe */}
                  <circle cx="100" cy="100" r="42" fill="#d97706" />
                  {/* Cloud Belts */}
                  <path d="M 60 88 Q 100 85 140 88" stroke="#92400e" strokeWidth="6" fill="none" />
                  <path d="M 58 100 Q 100 102 142 100" stroke="#78350f" strokeWidth="8" fill="none" />
                  <path d="M 62 112 Q 100 110 138 112" stroke="#b45309" strokeWidth="6" fill="none" />
                  {/* Great Red Spot */}
                  <ellipse cx="118" cy="104" rx="8" ry="5" fill="#dc2626" />
                  {/* Galilean Moons (Io, Europa, Ganymede, Callisto) */}
                  <circle cx="28" cy="98" r="2.5" fill="#fef08a" />
                  <circle cx="50" cy="101" r="2.2" fill="#e0e7ff" />
                  <circle cx="158" cy="99" r="3.2" fill="#fed7aa" />
                  <circle cx="188" cy="102" r="2.8" fill="#cbd5e1" />
                </svg>
              )}

              {selectedTarget.id === 'saturn' && (
                <svg viewBox="0 0 240 200" width="240" height="200">
                  {/* Rings Behind Globe */}
                  <ellipse cx="120" cy="100" rx="90" ry="24" fill="none" stroke="#d97706" strokeWidth="12" opacity="0.8" />
                  <ellipse cx="120" cy="100" rx="72" ry="18" fill="none" stroke="#02040a" strokeWidth="2" />
                  {/* Saturn Globe */}
                  <circle cx="120" cy="100" r="32" fill="#fbbf24" />
                  <ellipse cx="120" cy="100" rx="30" ry="8" fill="#b45309" opacity="0.4" />
                  {/* Rings In Front of Globe */}
                  <path d="M 30 100 A 90 24 0 0 0 210 100" fill="none" stroke="#f59e0b" strokeWidth="12" />
                </svg>
              )}

              {selectedTarget.id === 'm42' && (
                <svg viewBox="0 0 220 220" width="220" height="220">
                  <defs>
                    <radialGradient id="nebulaGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.6" />
                      <stop offset="85%" stopColor="#06b6d4" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#02040a" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="110" cy="110" r="85" fill="url(#nebulaGrad)" />
                  {/* Trapezium cluster core stars */}
                  <circle cx="108" cy="108" r="2" fill="#ffffff" />
                  <circle cx="112" cy="107" r="1.8" fill="#ffffff" />
                  <circle cx="111" cy="113" r="1.7" fill="#ffffff" />
                  <circle cx="106" cy="112" r="1.5" fill="#ffffff" />
                </svg>
              )}

              {selectedTarget.id === 'andromeda' && (
                <svg viewBox="0 0 220 220" width="220" height="220">
                  <ellipse cx="110" cy="110" rx="95" ry="32" transform="rotate(-35 110 110)" fill="radial-gradient(circle, #fde047 0%, #38bdf8 60%, transparent 100%)" opacity="0.65" />
                  <ellipse cx="110" cy="110" rx="35" ry="14" transform="rotate(-35 110 110)" fill="#fef08a" />
                  <circle cx="110" cy="110" r="5" fill="#ffffff" />
                </svg>
              )}
            </div>

            {/* Crosshairs & Reticle Overlay */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <svg viewBox="0 0 320 320" width="100%" height="100%">
                <circle cx="160" cy="160" r="150" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <circle cx="160" cy="160" r="70" fill="none" stroke="rgba(156,132,214,0.25)" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="160" cy="160" r="16" fill="none" stroke="rgba(255,184,107,0.4)" strokeWidth="1" />
                <line x1="160" y1="20" x2="160" y2="300" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" />
                <line x1="20" y1="160" x2="300" y2="160" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" />
              </svg>
            </div>

            {/* Slew Coordinates Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                color: 'var(--steel)',
                letterSpacing: '0.08em',
                backgroundColor: 'rgba(6,9,25,0.7)',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              OFFSET: [X:{panOffset.x} | Y:{panOffset.y}]
            </div>
          </div>

          {/* Slew D-Pad Controls */}
          <div style={{ marginTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
            <button type="button" onClick={() => pan(0, 25)} className="slewer-btn" style={dPadStyle}>▲</button>
            <div style={{ display: 'flex', gap: '3px' }}>
              <button type="button" onClick={() => pan(25, 0)} className="slewer-btn" style={dPadStyle}>◀</button>
              <button type="button" onClick={() => setPanOffset({ x: 0, y: 0 })} className="slewer-btn" style={{ ...dPadStyle, fontSize: '0.625rem' }}>CTR</button>
              <button type="button" onClick={() => pan(-25, 0)} className="slewer-btn" style={dPadStyle}>▶</button>
            </div>
            <button type="button" onClick={() => pan(0, -25)} className="slewer-btn" style={dPadStyle}>▼</button>
          </div>
        </div>

        {/* Right: Optical Controls & Target Selection */}
        <div>
          {/* Target Selector */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <span style={sectionLabelStyle}>SELECT CELESTIAL TARGET</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xs)' }}>
              {TARGETS.map((t) => {
                const isSel = selectedTarget.id === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTargetChange(t)}
                    className="target-btn"
                    style={{
                      textAlign: 'left',
                      padding: 'var(--space-xs) var(--space-sm)',
                      backgroundColor: isSel ? 'color-mix(in srgb, var(--orbit) 25%, var(--navy))' : 'color-mix(in srgb, var(--void) 50%, transparent)',
                      border: `1px solid ${isSel ? 'var(--orbit)' : 'color-mix(in srgb, var(--steel) 30%, transparent)'}`,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: 600, color: isSel ? 'var(--orbit)' : 'var(--moon)' }}>
                      {t.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--steel)' }}>
                      {t.constellation} &bull; Mag {t.magnitude}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optical Filters */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <span style={sectionLabelStyle}>OPTICAL NARROWBAND FILTER</span>
            <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
              {FILTERS.map((f) => {
                const isSel = activeFilter.id === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      playTelemetryBeep(1000, 0.05);
                      setActiveFilter(f);
                    }}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSel ? 'color-mix(in srgb, var(--navy) 90%, transparent)' : 'color-mix(in srgb, var(--void) 60%, transparent)',
                      border: `1px solid ${isSel ? f.color : 'color-mix(in srgb, var(--steel) 25%, transparent)'}`,
                      color: isSel ? f.color : 'var(--steel)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Magnification Zoom Slider */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--steel)', marginBottom: '0.25rem' }}>
              <span>MAGNIFICATION ZOOM:</span>
              <span style={{ color: 'var(--astrophage)', fontWeight: 700 }}>{zoomLevel}x</span>
            </div>
            <input
              type="range"
              min="30"
              max="350"
              step="5"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: 'var(--astrophage)', cursor: 'pointer' }}
            />
          </div>

          {/* Target Telemetry Card */}
          <div
            style={{
              backgroundColor: 'color-mix(in srgb, var(--void) 70%, transparent)',
              border: '1px solid color-mix(in srgb, var(--steel) 25%, transparent)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-sm) var(--space-md)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
            }}
          >
            <div style={{ color: 'var(--moon)', fontWeight: 600, marginBottom: '0.2rem' }}>
              {selectedTarget.name} — Ephemeris
            </div>
            <div style={{ color: 'var(--steel)', fontSize: '0.6875rem', display: 'flex', gap: 'var(--space-md)', marginBottom: '0.4rem' }}>
              <span>RA: {selectedTarget.ra}</span>
              <span>DEC: {selectedTarget.dec}</span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--star)', margin: 0, lineHeight: 1.5 }}>
              {selectedTarget.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const sectionLabelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.1em',
  color: 'var(--orbit)',
  marginBottom: '0.4rem',
  textTransform: 'uppercase',
};

const dPadStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--navy)',
  border: '1px solid var(--steel)',
  color: 'var(--star)',
  borderRadius: '4px',
  cursor: 'pointer',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.75rem',
};
