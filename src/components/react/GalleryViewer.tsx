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

// Blank astrophotography archive kept for user future photos
const PHOTOS: AstroPhoto[] = [];

export default function GalleryViewer(): React.ReactElement {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<AstroPhoto | null>(null);

  const filteredPhotos =
    activeCategory === 'all'
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
                backgroundColor: isSel
                  ? 'var(--orbit)'
                  : 'color-mix(in srgb, var(--navy) 60%, transparent)',
                color: isSel ? 'var(--void)' : 'var(--star)',
                border: isSel
                  ? '1px solid var(--star)'
                  : '1px solid color-mix(in srgb, var(--steel) 35%, transparent)',
                transition: 'all 0.2s ease',
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Astrophotography Cards or Blank Container */}
      {filteredPhotos.length > 0 ? (
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
            >
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
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <img
                    src="/icons/icon-search.jpg"
                    alt=""
                    width="12"
                    height="12"
                    style={{ borderRadius: '2px', objectFit: 'cover' }}
                  />
                  <span>INSPECT EXIF</span>
                </div>
              </div>

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

                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--steel)', margin: '0 0 var(--space-md) 0' }}>
                  Captured by {photo.author}
                </p>

                <div
                  style={{
                    marginTop: 'auto',
                    borderTop: '1px solid color-mix(in srgb, var(--steel) 20%, transparent)',
                    paddingTop: 'var(--space-xs)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--star)',
                  }}
                >
                  <span>{photo.telescope}</span>
                  <span style={{ color: 'var(--sol-dust)' }}>{photo.bortle}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--deep)',
            border: '1px dashed color-mix(in srgb, var(--steel) 35%, transparent)',
            borderRadius: 'var(--radius-lg)',
            padding: '4rem 1.5rem',
            textAlign: 'center',
          }}
          aria-label="Astrophotography archive kept blank for user future photos"
        >
          <div style={{ marginBottom: '1rem' }}>
            <img
              src="/icons/icon-camera.jpg"
              alt=""
              width="56"
              height="56"
              style={{ borderRadius: '14px', objectFit: 'cover', margin: '0 auto', border: '1.5px solid var(--orbit)' }}
            />
          </div>
          <h4
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              color: 'var(--moon)',
              margin: '0 0 0.5rem 0',
            }}
          >
            Astrophotography Archives
          </h4>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              color: 'var(--steel)',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Field trip observation captures, plate-solved nebulae, and planetary imaging stacks will be showcased here in the future.
          </p>
        </div>
      )}

      {/* Modal Lightbox for EXIF Telemetry Inspection */}
      {selectedPhoto && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 9, 25, 0.92)',
            backdropFilter: 'blur(16px)',
            zIndex: 'var(--z-modal, 1000)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-md)',
          }}
          aria-modal="true"
          role="dialog"
          aria-label={selectedPhoto.title}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--deep)',
              border: '1px solid color-mix(in srgb, var(--orbit) 50%, transparent)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 60px rgba(0,0,0,0.85)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-md) var(--space-xl)', borderBottom: '1px solid color-mix(in srgb, var(--steel) 25%, transparent)' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--orbit)', letterSpacing: '0.1em' }}>
                  EXIF OPTICAL TELEMETRY
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--moon)', margin: 0 }}>
                  {selectedPhoto.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeLightbox}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--moon)',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                }}
                aria-label="Close Lightbox"
              >
                &times;
              </button>
            </div>

            <div style={{ height: '360px', width: '100%', backgroundColor: 'var(--void)' }}>
              {selectedPhoto.svgGraphic}
            </div>

            <div style={{ padding: 'var(--space-xl)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
              <div>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--steel)' }}>TELESCOPE OPTICS</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--moon)' }}>{selectedPhoto.telescope}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--steel)' }}>CAMERA SENSOR</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--moon)' }}>{selectedPhoto.camera}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--steel)' }}>EXPOSURE / INTEGRATION</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--astrophage)' }}>{selectedPhoto.exposure}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--steel)' }}>FILTERS USED</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--star)' }}>{selectedPhoto.filter}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--steel)' }}>NIGHT SKY QUALITY</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--sol-dust)' }}>{selectedPhoto.bortle}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--steel)' }}>ASTROPHOTOGRAPHER</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--moon)' }}>{selectedPhoto.author}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
