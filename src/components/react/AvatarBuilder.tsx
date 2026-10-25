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

/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

import React, { useState } from 'react';
import { playTelemetryBeep } from '../../lib/audio';

interface SuitTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  trimColor: string;
}

interface VisorTint {
  id: string;
  name: string;
  gradStart: string;
  gradEnd: string;
  glowColor: string;
}

const SUIT_THEMES: SuitTheme[] = [
  { id: 'void', name: 'Void Obsidian', primaryColor: '#0a0f26', secondaryColor: '#14204f', trimColor: 'var(--orbit)' },
  { id: 'jovian', name: 'Jovian Arctic', primaryColor: '#fff5f5', secondaryColor: '#ffb399', trimColor: 'var(--astrophage)' },
  { id: 'mars', name: 'Martian Regolith', primaryColor: '#e05a2b', secondaryColor: '#7f1d1d', trimColor: 'var(--astrophage)' },
  { id: 'stellar', name: 'Stellar Gold', primaryColor: '#ffb86b', secondaryColor: '#2b121c', trimColor: 'var(--moon)' },
  { id: 'tesseract', name: 'Cyber Deep Space', primaryColor: '#2b121c', secondaryColor: '#0b0507', trimColor: '#f43f5e' },
];

const VISOR_TINTS: VisorTint[] = [
  { id: 'gold', name: 'Solar Gold', gradStart: '#ffb86b', gradEnd: '#e05a2b', glowColor: 'var(--astrophage)' },
  { id: 'obsidian', name: 'Deep Polarized', gradStart: '#2b121c', gradEnd: '#0b0507', glowColor: 'var(--orbit)' },
  { id: 'crimson', name: 'Crimson Ember', gradStart: '#f43f5e', gradEnd: '#991b1b', glowColor: 'var(--orbit)' },
  { id: 'cyan', name: 'Nebula Cyan', gradStart: '#38bdf8', gradEnd: '#0284c7', glowColor: '#38bdf8' },
];

const HELMET_STYLES = [
  { id: 'classic', name: 'Apollo Classic Dome', desc: 'Spherical polycarbonate bubble with maximum peripheral view.' },
  { id: 'tactical', name: 'Explorer HUD Visor', desc: 'Angular ballistic visor with integrated holographic reticle.' },
  { id: 'heavy', name: 'Heavy Deep-Space Rig', desc: 'Reinforced dual-shell visor with ionizing radiation shield.' },
];

const PATCHES = [
  { id: 'astronomy', label: 'LUNAR Society', icon: '/icons/dept-astronomy.png' },
  { id: 'tech', label: 'Tesseract Core', icon: '/icons/dept-tech.png' },
  { id: 'event', label: 'Event Horizon', icon: '/icons/dept-event.png' },
  { id: 'design', label: 'Nebula Studio', icon: '/icons/dept-design.png' },
  { id: 'research', label: 'Aether Wing', icon: '/icons/dept-research.png' },
  { id: 'content', label: 'StarCast Scribe', icon: '/icons/dept-content.png' },
];

export default function AvatarBuilder(): React.ReactElement {
  const [selectedTheme, setSelectedTheme] = useState<SuitTheme>(SUIT_THEMES[0]);
  const [selectedVisor, setSelectedVisor] = useState<VisorTint>(VISOR_TINTS[0]);
  const [selectedHelmet, setSelectedHelmet] = useState<string>('classic');
  const [selectedPatch, setSelectedPatch] = useState(PATCHES[0]);
  const [explorerName, setExplorerName] = useState<string>('Elena Rostova');
  const [callsign, setCallsign] = useState<string>('VANGUARD-01');
  const [showIdCard, setShowIdCard] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const generateCardCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1050;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Deep Space Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, 800, 1050);
    bgGrad.addColorStop(0, '#060913');
    bgGrad.addColorStop(0.5, '#0c1224');
    bgGrad.addColorStop(1, '#030509');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 1050);

    // Starlight field
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 60; i++) {
      const sx = (i * 137.5) % 800;
      const sy = (i * 229.3) % 1050;
      const sr = (i % 3 === 0) ? 1.5 : 0.8;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer Holographic Frame
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 740, 990);

    // Corner Ticks
    const drawCorner = (x: number, y: number) => {
      ctx.strokeStyle = '#ffb86b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 12, y);
      ctx.lineTo(x + 12, y);
      ctx.moveTo(x, y - 12);
      ctx.lineTo(x, y + 12);
      ctx.stroke();
    };
    drawCorner(30, 30);
    drawCorner(770, 30);
    drawCorner(30, 1020);
    drawCorner(770, 1020);

    // Header Telemetry
    ctx.fillStyle = '#ffb86b';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('CALLISTO EXPEDITION // CREW FLIGHT PASS', 55, 70);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('MANIFEST #8492-CIT', 745, 70);
    ctx.textAlign = 'left';

    // Header divider
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(55, 85);
    ctx.lineTo(745, 85);
    ctx.stroke();

    // Center Spacesuit Rig Rendering
    ctx.save();
    ctx.translate(400 - 160 * 1.35, 110);
    ctx.scale(1.35, 1.35);

    // Outer guidance circle
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.arc(160, 190, 140, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Torso Harness
    ctx.beginPath();
    ctx.moveTo(100, 240);
    ctx.quadraticCurveTo(80, 250, 65, 290);
    ctx.lineTo(65, 370);
    ctx.lineTo(255, 370);
    ctx.lineTo(255, 290);
    ctx.quadraticCurveTo(240, 250, 220, 240);
    ctx.quadraticCurveTo(160, 260, 100, 240);
    ctx.closePath();
    ctx.fillStyle = selectedTheme.primaryColor;
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Chest Plate
    ctx.fillStyle = selectedTheme.secondaryColor;
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(120, 275, 80, 60, 6);
    ctx.fill();
    ctx.stroke();

    // Chest label
    ctx.fillStyle = '#ffb86b';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(selectedPatch.label.toUpperCase().slice(0, 12), 160, 312);

    // Collar
    ctx.beginPath();
    ctx.ellipse(160, 235, 46, 14, 0, 0, Math.PI * 2);
    ctx.fillStyle = selectedTheme.secondaryColor;
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Helmet Outer Shell
    ctx.beginPath();
    if (selectedHelmet === 'heavy') {
      ctx.roundRect(85, 85, 150, 150, 35);
    } else {
      ctx.arc(160, 155, 74, 0, Math.PI * 2);
    }
    ctx.fillStyle = selectedTheme.primaryColor;
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Visor with Radial Reflection
    const visorGrad = ctx.createRadialGradient(160, 140, 10, 160, 155, 60);
    visorGrad.addColorStop(0, selectedVisor.gradStart);
    visorGrad.addColorStop(0.7, selectedVisor.gradEnd);
    visorGrad.addColorStop(1, selectedTheme.secondaryColor);

    ctx.beginPath();
    if (selectedHelmet === 'tactical') {
      ctx.moveTo(120, 120);
      ctx.lineTo(200, 120);
      ctx.lineTo(215, 160);
      ctx.lineTo(195, 190);
      ctx.lineTo(125, 190);
      ctx.lineTo(105, 160);
      ctx.closePath();
    } else {
      ctx.ellipse(160, 155, 54, 44, 0, 0, Math.PI * 2);
    }
    ctx.fillStyle = visorGrad;
    ctx.fill();
    ctx.strokeStyle = selectedVisor.glowColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Glint Arc
    ctx.beginPath();
    ctx.ellipse(155, 135, 30, 8, -0.2, 0, Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.restore();

    // Crew Identity Card Box
    const cardY = 640;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(55, cardY, 690, 275, 10);
    ctx.fill();
    ctx.stroke();

    // Cadet Name & Callsign
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 28px sans-serif';
    ctx.fillText((explorerName || 'CADET EXPLORER').slice(0, 28), 80, cardY + 45);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.fillText(`CALLSIGN: ${(callsign || 'ORBIT-01').slice(0, 20)}`, 80, cardY + 75);

    // Specification Grid
    const specs = [
      { label: 'MISSION WING', val: selectedPatch.label },
      { label: 'SUIT REGIME', val: selectedTheme.name },
      { label: 'HELMET CLASS', val: selectedHelmet.toUpperCase() },
      { label: 'VISOR COATING', val: selectedVisor.name },
      { label: 'RADIATION SHIELD', val: 'CLASS 4 - JOVIAN COMPLIANT' },
      { label: 'FACILITY NODE', val: 'CHENNAI INST. OF TECH (CIT)' },
    ];

    specs.forEach((item, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 80 + col * 340;
      const y = cardY + 118 + row * 46;

      ctx.fillStyle = '#64748b';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText(item.label, x, y);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '600 13px "JetBrains Mono", monospace';
      ctx.fillText(item.val, x, y + 18);
    });

    // Verification Footer
    ctx.fillStyle = '#22c55e';
    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.fillText('[✓] FLIGHT READY // PASS VERIFIED & SEALED', 55, 960);

    // Barcode Telemetry
    ctx.fillStyle = '#94a3b8';
    let bx = 500;
    for (let i = 0; i < 38; i++) {
      const barW = (i % 4 === 0) ? 4 : (i % 2 === 0 ? 2 : 1);
      ctx.fillRect(bx, 945, barW, 25);
      bx += barW + 3;
    }

    return canvas;
  };

  const handleDownloadImage = () => {
    playTelemetryBeep(1200, 0.1);
    const canvas = generateCardCanvas();
    const link = document.createElement('a');
    const safeCallsign = (callsign || 'EXPLORER').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `Callisto_EVA_Suit_${safeCallsign}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setExportNotice('Holographic Pass exported as high-res PNG image!');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleDownloadPdf = () => {
    playTelemetryBeep(1320, 0.12);
    const canvas = generateCardCanvas();
    const dataUrl = canvas.toDataURL('image/png');
    const safeCallsign = (callsign || 'EXPLORER').replace(/[^a-zA-Z0-9_-]/g, '_');

    const printWin = window.open('', '_blank', 'width=900,height=1150');
    if (!printWin) {
      alert('Pop-up was blocked. Please allow pop-ups for localhost to download/print the PDF pass.');
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Callisto_Expedition_Flight_Pass_${safeCallsign}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 8mm;
            }
            body {
              margin: 0;
              padding: 24px;
              background-color: #050811;
              color: #f8fafc;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              box-sizing: border-box;
            }
            .pass-card {
              max-width: 750px;
              width: 100%;
              border-radius: 12px;
              box-shadow: 0 0 40px rgba(56, 189, 248, 0.35);
              overflow: hidden;
            }
            .pass-card img {
              width: 100%;
              display: block;
            }
            .notice-bar {
              margin-top: 16px;
              font-size: 13px;
              color: #94a3b8;
              font-family: monospace;
              text-align: center;
            }
            @media print {
              body {
                background: #ffffff !important;
                padding: 0 !important;
              }
              .pass-card {
                box-shadow: none !important;
                max-width: 96% !important;
              }
              .notice-bar {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="pass-card">
            <img src="${dataUrl}" alt="Callisto EVA Spacesuit Flight Pass" />
          </div>
          <div class="notice-bar">
            Use your browser's Print dialog destination: <strong>"Save as PDF"</strong> to save this flight certificate.
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
    setExportNotice('PDF Flight Pass generated! Select "Save as PDF" in your print dialog.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleThemeChange = (theme: SuitTheme) => {
    playTelemetryBeep(880, 0.05);
    setSelectedTheme(theme);
  };

  const handleVisorChange = (visor: VisorTint) => {
    playTelemetryBeep(1020, 0.05);
    setSelectedVisor(visor);
  };

  const handleHelmetChange = (helmetId: string) => {
    playTelemetryBeep(940, 0.05);
    setSelectedHelmet(helmetId);
  };

  const handlePatchChange = (patch: typeof PATCHES[0]) => {
    playTelemetryBeep(1100, 0.05);
    setSelectedPatch(patch);
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--deep)',
        border: '1px solid color-mix(in srgb, var(--orbit) 35%, transparent)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-xl)',
        boxShadow: '0 12px 40px color-mix(in srgb, var(--void) 85%, transparent)',
      }}
    >
      <style>{`
        .customizer-btn:hover {
          transform: translateY(-2px);
          border-color: var(--orbit) !important;
        }
        .color-swatch:hover {
          transform: scale(1.1);
        }
      `}</style>

      {/* Top Banner */}
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
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--astrophage)', letterSpacing: '0.14em' }}>
            EVA SPACESUIT FABRICATION BAY // PHASE 2 ACTIVE
          </span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', margin: '0.2rem 0 0 0', color: 'var(--moon)' }}>
            Custom Suit Fabricator
          </h3>
        </div>

        <button
          type="button"
          onClick={() => {
            playTelemetryBeep(1200, 0.08);
            setShowIdCard(!showIdCard);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: showIdCard ? 'var(--moon)' : 'linear-gradient(135deg, var(--orbit), var(--dusk))',
            color: showIdCard ? 'var(--void)' : 'var(--moon)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <span>{showIdCard ? 'Edit Customization' : 'Generate Flight Pass'}</span>
        </button>
      </div>

      {showIdCard ? (
        /* Holographic Flight Badge View */
        <div
          style={{
            maxWidth: '460px',
            margin: '0 auto',
            backgroundColor: 'color-mix(in srgb, var(--navy) 75%, var(--void))',
            border: '2px solid var(--orbit)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-xl)',
            boxShadow: '0 0 32px color-mix(in srgb, var(--orbit) 40%, transparent)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Hologram sheen gradient */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, var(--orbit), var(--astrophage), var(--star))',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--astrophage)', letterSpacing: '0.15em' }}>
              CALLISTO EXPEDITION // CREW ID
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--steel)' }}>
              PASS #8492-CIT
            </span>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            {/* Mini Avatar Portrait */}
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--void)',
                border: `2px solid ${selectedTheme.trimColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${selectedVisor.gradStart}, ${selectedVisor.gradEnd})`,
                  boxShadow: `0 0 12px ${selectedVisor.glowColor}`,
                }}
              />
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--moon)' }}>
                {explorerName || 'Cadet Explorer'}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--orbit)' }}>
                CALLSIGN: {callsign || 'ORBIT-01'}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--steel)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>ASSIGNED: {selectedPatch.label}</span>
                <img src={selectedPatch.icon} alt="" width="16" height="16" style={{ objectFit: 'contain' }} />
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-xs)',
              backgroundColor: 'color-mix(in srgb, var(--void) 60%, transparent)',
              padding: 'var(--space-sm)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--steel)',
              marginBottom: 'var(--space-lg)',
            }}
          >
            <div>SUIT CLASS: <span style={{ color: 'var(--moon)' }}>{selectedTheme.name}</span></div>
            <div>HELMET: <span style={{ color: 'var(--moon)' }}>{selectedHelmet.toUpperCase()}</span></div>
            <div>VISOR TINT: <span style={{ color: selectedVisor.glowColor }}>{selectedVisor.name}</span></div>
            <div>STATUS: <span style={{ color: '#4ade80' }}>ACTIVE FLIGHT READY</span></div>
          </div>

          {exportNotice && (
            <div
              style={{
                backgroundColor: 'color-mix(in srgb, var(--orbit) 15%, transparent)',
                border: '1px solid var(--orbit)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--moon)',
                textAlign: 'center',
                marginBottom: 'var(--space-md)',
              }}
            >
              {exportNotice}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
            <button
              type="button"
              onClick={handleDownloadImage}
              style={{
                padding: '0.65rem 0.5rem',
                backgroundColor: 'var(--orbit)',
                color: 'var(--void)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
              }}
            >
              <span>Download Image (.PNG)</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              style={{
                padding: '0.65rem 0.5rem',
                backgroundColor: 'transparent',
                color: 'var(--moon)',
                border: '1px solid var(--orbit)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
              }}
            >
              <span>Download PDF Pass</span>
            </button>
          </div>
        </div>
      ) : (
        /* Interactive Suit Customizer Grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: 'var(--space-2xl)',
            alignItems: 'center',
          }}
        >
          {/* Left: Dynamic Live Spacesuit SVG Canvas */}
          <div
            style={{
              backgroundColor: 'var(--void)',
              border: `1px solid ${selectedTheme.trimColor}`,
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-xl)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: `0 0 30px color-mix(in srgb, ${selectedVisor.glowColor} 20%, transparent)`,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 'var(--space-sm)',
                left: 'var(--space-md)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--steel)',
              }}
            >
              LIVE RIG // {selectedTheme.name.toUpperCase()}
            </div>

            <div style={{ width: '240px', height: '300px', margin: 'var(--space-md) 0' }}>
              <svg viewBox="0 0 320 380" width="100%" height="100%">
                <defs>
                  <radialGradient id="interactiveVisor" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor={selectedVisor.gradStart} stopOpacity="0.95" />
                    <stop offset="70%" stopColor={selectedVisor.gradEnd} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={selectedTheme.secondaryColor} stopOpacity="0.5" />
                  </radialGradient>
                </defs>

                {/* Outer Holographic Guidance Rings */}
                <circle cx="160" cy="190" r="140" fill="none" stroke={selectedTheme.trimColor} strokeWidth="1" strokeDasharray="6 6" opacity="0.3" />

                {/* Torso & Shoulder Harness */}
                <path
                  d="M 100 240 Q 80 250 65 290 L 65 370 L 255 370 L 255 290 Q 240 250 220 240 Q 160 260 100 240 Z"
                  fill={selectedTheme.primaryColor}
                  stroke={selectedTheme.trimColor}
                  strokeWidth="2"
                />

                {/* Chest Telemetry Plate with Department Patch */}
                <rect x="120" y="275" width="80" height="60" rx="6" fill={selectedTheme.secondaryColor} stroke="var(--steel)" strokeWidth="1" />
                <image href={selectedPatch.icon} x="145" y="282" width="30" height="30" />
                <text x="160" y="324" textAnchor="middle" fill={selectedTheme.trimColor} fontFamily="monospace" fontSize="8" fontWeight="bold">
                  {selectedPatch.label.substring(0, 10).toUpperCase()}
                </text>

                {/* Neck Collar */}
                <ellipse cx="160" cy="235" rx="46" ry="14" fill={selectedTheme.secondaryColor} stroke={selectedTheme.trimColor} strokeWidth="2" />

                {/* Helmet Outer Shell based on style */}
                {selectedHelmet === 'heavy' ? (
                  <rect x="85" y="85" width="150" height="150" rx="35" fill={selectedTheme.primaryColor} stroke={selectedTheme.trimColor} strokeWidth="2.5" />
                ) : (
                  <circle cx="160" cy="155" r="74" fill={selectedTheme.primaryColor} stroke={selectedTheme.trimColor} strokeWidth="2" />
                )}

                {/* Visor based on style */}
                {selectedHelmet === 'tactical' ? (
                  <polygon
                    points="120,120 200,120 215,160 195,190 125,190 105,160"
                    fill="url(#interactiveVisor)"
                    stroke={selectedVisor.glowColor}
                    strokeWidth="2"
                  />
                ) : (
                  <ellipse
                    cx="160"
                    cy="155"
                    rx="54"
                    ry="44"
                    fill="url(#interactiveVisor)"
                    stroke={selectedVisor.glowColor}
                    strokeWidth="2"
                  />
                )}

                {/* Glint Arc */}
                <path d="M 130 135 Q 160 125 185 135" fill="none" stroke="var(--moon)" strokeWidth="2.5" opacity="0.85" />
              </svg>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--star)', textAlign: 'center' }}>
              <div>{explorerName} // [{callsign}]</div>
              <div style={{ color: 'var(--steel)', fontSize: '0.6875rem' }}>WING: {selectedPatch.label}</div>
            </div>

            {exportNotice && (
              <div
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--orbit) 15%, transparent)',
                  border: '1px solid var(--orbit)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.4rem 0.6rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--moon)',
                  textAlign: 'center',
                  marginTop: 'var(--space-sm)',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                {exportNotice}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xs)', marginTop: 'var(--space-md)', width: '100%' }}>
              <button
                type="button"
                onClick={handleDownloadImage}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'var(--orbit)',
                  color: 'var(--void)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Download Image
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'transparent',
                  color: 'var(--moon)',
                  border: '1px solid var(--orbit)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Save as PDF
              </button>
            </div>
          </div>

          {/* Right: Customization Controls */}
          <div>
            {/* Identity Inputs */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <span style={sectionLabelStyle}>1. EXPLORER CALLSIGN & NAME</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                <input
                  type="text"
                  value={explorerName}
                  onChange={(e) => setExplorerName(e.target.value)}
                  placeholder="Explorer Name"
                  style={inputStyle}
                />
                <input
                  type="text"
                  value={callsign}
                  onChange={(e) => setCallsign(e.target.value)}
                  placeholder="Callsign"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Suit Color Scheme */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <span style={sectionLabelStyle}>2. SUIT COLOR REGIME</span>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                {SUIT_THEMES.map((theme) => {
                  const isSel = selectedTheme.id === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleThemeChange(theme)}
                      className="color-swatch"
                      title={theme.name}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: theme.primaryColor,
                        border: `2px solid ${isSel ? 'var(--moon)' : 'var(--steel)'}`,
                        boxShadow: isSel ? `0 0 12px ${theme.trimColor}` : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Visor Coating */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <span style={sectionLabelStyle}>3. VISOR COATING & TINT</span>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                {VISOR_TINTS.map((visor) => {
                  const isSel = selectedVisor.id === visor.id;
                  return (
                    <button
                      key={visor.id}
                      type="button"
                      onClick={() => handleVisorChange(visor)}
                      className="color-swatch"
                      title={visor.name}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${visor.gradStart}, ${visor.gradEnd})`,
                        border: `2px solid ${isSel ? 'var(--moon)' : 'var(--steel)'}`,
                        boxShadow: isSel ? `0 0 12px ${visor.glowColor}` : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Helmet Design */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <span style={sectionLabelStyle}>4. HELMET PROFILE</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--space-xs)' }}>
                {HELMET_STYLES.map((h) => {
                  const isSel = selectedHelmet === h.id;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => handleHelmetChange(h.id)}
                      className="customizer-btn"
                      style={{
                        padding: 'var(--space-xs) var(--space-sm)',
                        backgroundColor: isSel ? 'color-mix(in srgb, var(--orbit) 25%, var(--navy))' : 'color-mix(in srgb, var(--void) 50%, transparent)',
                        border: `1px solid ${isSel ? 'var(--orbit)' : 'color-mix(in srgb, var(--steel) 30%, transparent)'}`,
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: isSel ? 'var(--moon)' : 'var(--star)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {h.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Department Mission Patch */}
            <div>
              <span style={sectionLabelStyle}>5. DEPARTMENT MISSION PATCH</span>
              <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
                {PATCHES.map((patch) => {
                  const isSel = selectedPatch.id === patch.id;
                  return (
                    <button
                      key={patch.id}
                      type="button"
                      onClick={() => handlePatchChange(patch)}
                      className="customizer-btn"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.3rem 0.6rem',
                        backgroundColor: isSel ? 'color-mix(in srgb, var(--astrophage) 20%, var(--navy))' : 'color-mix(in srgb, var(--void) 60%, transparent)',
                        border: `1px solid ${isSel ? 'var(--astrophage)' : 'color-mix(in srgb, var(--steel) 25%, transparent)'}`,
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: isSel ? 'var(--moon)' : 'var(--star)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <img src={patch.icon} alt="" width="18" height="18" style={{ objectFit: 'contain' }} />
                      <span>{patch.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
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

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'color-mix(in srgb, var(--void) 70%, transparent)',
  border: '1px solid var(--steel)',
  borderRadius: 'var(--radius-sm)',
  padding: 'var(--space-xs) var(--space-sm)',
  color: 'var(--moon)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
  outline: 'none',
  boxSizing: 'border-box',
};
