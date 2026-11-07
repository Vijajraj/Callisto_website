/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'crew', 'avatars');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const officers = [
  { id: 'aswin-ponnuraj', name: 'Aswin Ponnuraj', accent: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)', initials: 'AP' },
  { id: 'lathika-raj', name: 'Lathika Raj S R', accent: '#EC4899', glow: 'rgba(236, 72, 153, 0.4)', initials: 'LR' },
  { id: 'harshitha', name: 'Harshitha', accent: '#38BDF8', glow: 'rgba(56, 189, 248, 0.4)', initials: 'HA' },
  { id: 'mirudhula', name: 'Mirudhula', accent: '#A855F7', glow: 'rgba(168, 85, 247, 0.4)', initials: 'MI' },
  { id: 'mukilan', name: 'Mukilan', accent: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)', initials: 'MU' },
  { id: 'mahavishnu', name: 'Mahavishnu', accent: '#06B6D4', glow: 'rgba(6, 182, 212, 0.4)', initials: 'MV' },
  { id: 'siddiksha', name: 'Siddiksha', accent: '#EC4899', glow: 'rgba(236, 72, 153, 0.4)', initials: 'SI' },
  { id: 'azmina', name: 'Azmina', accent: '#F43F5E', glow: 'rgba(244, 63, 94, 0.4)', initials: 'AZ' },
  { id: 'vijayraj', name: 'vijayraj s', accent: '#10B981', glow: 'rgba(16, 185, 129, 0.4)', initials: 'VS' },
  { id: 'guru', name: 'Guru', accent: '#3B82F6', glow: 'rgba(59, 130, 246, 0.4)', initials: 'GU' },
  { id: 'aishmica', name: 'Aishmica Harish', accent: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.4)', initials: 'AH' },
  { id: 'sheetal', name: 'Sheetal BN', accent: '#14B8A6', glow: 'rgba(20, 184, 166, 0.4)', initials: 'SB' },
  { id: 'mridula', name: 'Mridula Natraj', accent: '#6366F1', glow: 'rgba(99, 102, 241, 0.4)', initials: 'MN' },
  { id: 'executive-council', name: 'Executive Council', accent: '#E2E8F0', glow: 'rgba(226, 232, 240, 0.4)', initials: 'EC' }
];

officers.forEach((o) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="bg-${o.id}" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#090D16" />
    </radialGradient>
    <linearGradient id="ring-${o.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${o.accent}" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>
    <linearGradient id="visor-${o.id}" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.85" />
      <stop offset="60%" stop-color="#0284C7" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#0F172A" stop-opacity="0.9" />
    </linearGradient>
  </defs>

  <!-- Outer Ring Badge -->
  <circle cx="60" cy="60" r="56" fill="url(#bg-${o.id})" stroke="url(#ring-${o.id})" stroke-width="2.5" />
  
  <!-- Subtly Textured Starlight Orbit -->
  <circle cx="60" cy="60" r="49" fill="none" stroke="${o.accent}" stroke-opacity="0.25" stroke-dasharray="3 3" />

  <!-- Astronaut Suit Shoulders -->
  <path d="M 26 102 C 32 82, 88 82, 94 102 C 84 109, 36 109, 26 102 Z" fill="#334155" stroke="#475569" stroke-width="1.5" />
  
  <!-- Astronaut Collar Ring -->
  <path d="M 40 85 C 48 90, 72 90, 80 85 C 76 89, 44 89, 40 85 Z" fill="#64748B" />

  <!-- Astronaut Helmet Outer Shell -->
  <ellipse cx="60" cy="54" rx="27" ry="29" fill="#F1F5F9" stroke="#94A3B8" stroke-width="2" />
  
  <!-- Outer Helmet Ear Modules / Comms Antenna -->
  <rect x="30" y="48" width="4" height="12" rx="2" fill="#64748B" />
  <rect x="86" y="48" width="4" height="12" rx="2" fill="#64748B" />

  <!-- Visor Aperture -->
  <ellipse cx="60" cy="53" rx="21" ry="19" fill="url(#visor-${o.id})" stroke="#0F172A" stroke-width="1.5" />
  
  <!-- Visor Reflection Highlight Glint -->
  <path d="M 46 43 C 54 39, 66 39, 74 43 C 71 45, 50 45, 46 43 Z" fill="#FFFFFF" fill-opacity="0.65" />
  <ellipse cx="50" cy="49" rx="3" ry="1.5" fill="#FFFFFF" fill-opacity="0.45" />

  <!-- Officer Initials Telemetry Tag -->
  <rect x="47" y="93" width="26" height="13" rx="3" fill="#090D16" stroke="${o.accent}" stroke-width="1" />
  <text x="60" y="103" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="${o.accent}" letter-spacing="0.5">${o.initials}</text>
</svg>`;

  fs.writeFileSync(path.join(targetDir, `${o.id}.svg`), svg, 'utf8');
});

console.log(`Generated ${officers.length} officer avatars in ${targetDir}`);
