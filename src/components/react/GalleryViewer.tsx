import React, { useState } from 'react';
import { playTelemetryBeep } from '../../lib/audio';

interface AstroPhoto {
  id: string;
  title: string;
  category: 'deepsky' | 'planetary' | 'milkyway' | 'solar';
  author: string;
  date: string;
  telescope: string;
  camera: string;
  exposure: string;
  filter: string;
  bortle: string;
  colorGrad: string;
  svgGraphic: React.ReactNode;
}

const PHOTOS: AstroPhoto[] = [
  {
    id: 'rosette-nebula',
    title: 'Rosette Nebula in Monoceros (NGC 2237)',
    category: 'deepsky',
    author: 'Guru & LUNAR Society',
    date: 'April 2026',
    telescope: 'Sky-Watcher Esprit 100ED Triplet APO',
    camera: 'ZWO ASI2600MM Pro Mono CMOS',
    exposure: '48 x 300s (4.0 hrs Total Integration)',
    filter: 'Antlia 3nm H-alpha & O-III Narrowband',
    bortle: 'Bortle 2 (High Desert Outpost)',
    colorGrad: 'linear-gradient(135deg, #be123c, #1e1b4b)',
    svgGraphic: (
      <svg viewBox="0 0 400 300" width="100%" height="100%">
        <defs>
          <radialGradient id="rosette" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#881337" stopOpacity="0.7" />
            <stop offset="80%" stopColor="#1e1b4b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#060919" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="300" fill="#060919" />
        <circle cx="200" cy="150" r="110" fill="url(#rosette)" />
        <circle cx="200" cy="150" r="35" fill="#060919" opacity="0.8" />
        {/* Open cluster NGC 2244 stars */}
        <circle cx="190" cy="140" r="2.5" fill="#ffffff" />
        <circle cx="210" cy="145" r="2.2" fill="#ffffff" />
        <circle cx="195" cy="160" r="2.8" fill="#ffffff" />
        <circle cx="215" cy="158" r="2.4" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: 'jupiter-grs',
    title: 'Jupiter Cloud Belts & Great Red Spot',
    category: 'planetary',
    author: 'Mridhula Nataraj',
    date: 'February 2026',
    telescope: 'Celestron EdgeHD 8" with 2.5x Barlow',
    camera: 'ZWO ASI678MC Planetary Cam',
    exposure: 'Best 15% of 12,000 video frames (Lucky Imaging)',
    filter: 'UV/IR Cut with Baader Moon & Skyglow',
    bortle: 'Bortle 5 (CIT Rooftop Observatory)',
    colorGrad: 'linear-gradient(135deg, #d97706, #14204f)',
    svgGraphic: (
      <svg viewBox="0 0 400 300" width="100%" height="100%">
        <rect width="400" height="300" fill="#060919" />
        <circle cx="200" cy="150" r="70" fill="#d97706" />
        <path d="M 134 130 Q 200 126 266 130" stroke="#78350f" strokeWidth="10" fill="none" />
        <path d="M 130 150 Q 200 153 270 150" stroke="#92400e" strokeWidth="12" fill="none" />
        <path d="M 136 170 Q 200 168 264 170" stroke="#78350f" strokeWidth="9" fill="none" />
        <ellipse cx="230" cy="156" rx="14" ry="8" fill="#dc2626" />
      </svg>
    ),
  },
  {
    id: 'milkyway-desert',
    title: 'Galactic Core Over High Desert Array',
    category: 'milkyway',
    author: 'Azmina & Mirudhula',
    date: 'May 2026',
    telescope: 'Sony FE 14mm f/1.8 GM Ultra-Wide',
    camera: 'Sony Alpha 7 IV Full-Frame',
    exposure: '10 Tracked Frames x 120s @ ISO 1600 (Star Adventurer)',
    filter: 'Natural Starlight',
    bortle: 'Bortle 1 (Pristine Desert Outpost)',
    colorGrad: 'linear-gradient(135deg, #6366f1, #0c1237)',
    svgGraphic: (
      <svg viewBox="0 0 400 300" width="100%" height="100%">
        <rect width="400" height="300" fill="#060919" />
        {/* Milky way diagonal dust stream */}
        <ellipse cx="200" cy="150" rx="190" ry="50" transform="rotate(-40 200 150)" fill="radial-gradient(ellipse, #fde047 0%, #6366f1 50%, transparent 100%)" opacity="0.45" />
        {/* Silhouette of telescope tripod */}
        <polygon points="190,300 200,240 210,300" fill="#060919" stroke="var(--orbit)" strokeWidth="1.5" />
        <circle cx="200" cy="240" r="10" fill="var(--orbit)" />
      </svg>
    ),
  },
  {
    id: 'solar-chromosphere',
    title: 'Solar Chromosphere Prominence & Flares',
    category: 'solar',
    author: 'Siddh & Aether Wing',
    date: 'March 2026',
    telescope: 'Lunt Solar Systems 60mm Pressure-Tuned H-alpha',
    camera: 'Player One Apollo-M MINI (IMX429)',
    exposure: '5,000 Frames stacked with AutoStakkert!3',
    filter: '0.5 Angstrom Hydrogen-Alpha Etalon',
    bortle: 'Daytime Solar (Observatory Quad)',
    colorGrad: 'linear-gradient(135deg, #ef4444, #7f1d1d)',
    svgGraphic: (
      <svg viewBox="0 0 400 300" width="100%" height="100%">
        <rect width="400" height="300" fill="#060919" />
        <circle cx="200" cy="150" r="75" fill="#f97316" />
        {/* Solar Eruptive Prominences */}
        <path d="M 265 110 Q 285 95 272 135" stroke="#ef4444" strokeWidth="4" fill="none" opacity="0.9" />
        <path d="M 135 180 Q 115 200 125 160" stroke="#f43f5e" strokeWidth="3.5" fill="none" opacity="0.85" />
      </svg>
    ),
  },
  {
    id: 'orion-sword',
    title: 'The Great Orion Complex & Running Man',
    category: 'deepsky',
    author: 'Vijay Raj (Tech Lead)',
    date: 'January 2026',
    telescope: 'William Optics Zenithstar 73 III APO',
    camera: 'ASI294MC Pro Cooled Color',
    exposure: '60 x 120s (2.0 hrs Total Exposure)',
    filter: 'Optolong L-eXtreme 7nm Dual-Band',
    bortle: 'Bortle 3 (Yelagiri Hills Reserve)',
    colorGrad: 'linear-gradient(135deg, #ec4899, #312e81)',
    svgGraphic: (
      <svg viewBox="0 0 400 300" width="100%" height="100%">
        <rect width="400" height="300" fill="#060919" />
        <ellipse cx="220" cy="160" rx="90" ry="70" fill="#ec4899" opacity="0.7" />
        <circle cx="140" cy="110" r="35" fill="#38bdf8" opacity="0.6" />
        <circle cx="218" cy="158" r="4" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: 'leonid-bolide',
    title: 'Minus-4 Magnitude Leonid Bolide Fireball',
    category: 'milkyway',
    author: 'All Expedition Attendees',
    date: 'November 2026',
    telescope: 'Canon EOS R6 with 24mm f/1.4L II',
    camera: 'Canon EOS R6 Full-Frame',
    exposure: 'Single 25s exposure @ ISO 3200',
    filter: 'None',
    bortle: 'Bortle 2 (Outpost Charlie)',
    colorGrad: 'linear-gradient(135deg, #22c55e, #14204f)',
    svgGraphic: (
      <svg viewBox="0 0 400 300" width="100%" height="100%">
        <rect width="400" height="300" fill="#060919" />
        {/* Bright green bolide fireball streak across sky */}
        <line x1="60" y1="40" x2="340" y2="240" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" />
        <line x1="60" y1="40" x2="340" y2="240" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="340" cy="240" r="8" fill="#4ade80" opacity="0.8" />
      </svg>
    ),
  },
];

export default function GalleryViewer(): React.ReactElement {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<AstroPhoto | null>(null);

  const filteredPhotos = activeCategory === 'all'
    ? PHOTOS
    : PHOTOS.filter((p) => p.category === activeCategory);

  const openLightbox = (photo: AstroPhoto) => {
    playTelemetryBeep(1000, 0.05);
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  return (
    <div style={{ marginBottom: 'var(--space-3xl)' }}>
      {/* Category Filter Pills */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-sm)',
          flexWrap: 'wrap',
          marginBottom: 'var(--space-2xl)',
        }}
      >
        {[
          { id: 'all', label: 'All Visual Logs' },
          { id: 'deepsky', label: 'Deep-Sky Nebulae' },
          { id: 'planetary', label: 'Planetary Systems' },
          { id: 'milkyway', label: 'Milky Way & Widefield' },
          { id: 'solar', label: 'Solar Flares' },
        ].map((cat) => {
          const isSel = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                playTelemetryBeep(850, 0.04);
                setActiveCategory(cat.id);
              }}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                backgroundColor: isSel ? 'var(--orbit)' : 'color-mix(in srgb, var(--navy) 60%, transparent)',
                color: isSel ? 'var(--void)' : 'var(--star)',
                border: `1px solid ${isSel ? 'var(--orbit)' : 'color-mix(in srgb, var(--steel) 30%, transparent)'}`,
                boxShadow: isSel ? '0 0 16px color-mix(in srgb, var(--orbit) 35%, transparent)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Interactive Astrophotography Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-xl)',
        }}
      >
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => openLightbox(photo)}
            style={{
              backgroundColor: 'var(--deep)',
              border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'var(--orbit)';
              e.currentTarget.style.boxShadow = '0 12px 30px color-mix(in srgb, var(--orbit) 25%, transparent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--steel) 30%, transparent)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Image Preview Container */}
            <div style={{ height: '210px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              {photo.svgGraphic}
              <div
                style={{
                  position: 'absolute',
                  bottom: 'var(--space-xs)',
                  right: 'var(--space-xs)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  backgroundColor: 'rgba(6,9,25,0.85)',
                  color: 'var(--astrophage)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
                }}
              >
                🔍 CLICK TO INSPECT EXIF
              </div>
            </div>

            {/* Card Metadata */}
            <div style={{ padding: 'var(--space-md) var(--space-lg)', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--orbit)', textTransform: 'uppercase' }}>
                  {photo.category}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--steel)' }}>
                  {photo.date}
                </span>
              </div>

              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--moon)', margin: '0 0 var(--space-xs) 0' }}>
                {photo.title}
              </h4>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--steel)', marginTop: 'auto' }}>
                Imaged by: <span style={{ color: 'var(--star)' }}>{photo.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal with Full EXIF Telemetry */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(6,9,25,0.95)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-md)',
          }}
          onClick={closeLightbox}
        >
          <div
            style={{
              maxWidth: '820px',
              width: '100%',
              backgroundColor: 'var(--deep)',
              border: '1px solid var(--orbit)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 0 48px color-mix(in srgb, var(--orbit) 40%, transparent)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-md) var(--space-lg)',
                borderBottom: '1px solid color-mix(in srgb, var(--steel) 25%, transparent)',
              }}
            >
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--astrophage)', letterSpacing: '0.12em' }}>
                  HIGH-RESOLUTION OBSERVATIONAL RECORD
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--moon)', margin: 0 }}>
                  {selectedPhoto.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeLightbox}
                style={{
                  background: 'none',
                  border: '1px solid var(--steel)',
                  color: 'var(--moon)',
                  fontSize: '1.25rem',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Image Frame */}
            <div style={{ height: '320px', width: '100%', backgroundColor: 'var(--void)' }}>
              {selectedPhoto.svgGraphic}
            </div>

            {/* Detailed EXIF Optical Telemetry */}
            <div style={{ padding: 'var(--space-lg)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
              <div>
                <span style={exifLabelStyle}>OPTICAL SYSTEM:</span>
                <span style={exifValStyle}>{selectedPhoto.telescope}</span>
              </div>
              <div>
                <span style={exifLabelStyle}>IMAGING SENSOR:</span>
                <span style={exifValStyle}>{selectedPhoto.camera}</span>
              </div>
              <div>
                <span style={exifLabelStyle}>TOTAL INTEGRATION:</span>
                <span style={exifValStyle}>{selectedPhoto.exposure}</span>
              </div>
              <div>
                <span style={exifLabelStyle}>BANDPASS FILTER:</span>
                <span style={exifValStyle}>{selectedPhoto.filter}</span>
              </div>
              <div>
                <span style={exifLabelStyle}>SKY QUALITY:</span>
                <span style={exifValStyle}>{selectedPhoto.bortle}</span>
              </div>
              <div>
                <span style={exifLabelStyle}>ASTROPHOTOGRAPHER:</span>
                <span style={exifValStyle}>{selectedPhoto.author}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const exifLabelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.625rem',
  color: 'var(--steel)',
  letterSpacing: '0.08em',
};

const exifValStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--moon)',
};
