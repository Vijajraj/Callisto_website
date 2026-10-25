/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

const sharp = require('c:/projects/callisto/node_modules/sharp');
const path = require('path');
const fs = require('fs');

const outputDir = 'c:/projects/callisto/public/icons';

const icons = [
  {
    name: 'icon-pillars.jpg',
    svg: `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="100%" stop-color="#090514"/>
          </radialGradient>
          <linearGradient id="pillar" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f59e0b"/>
            <stop offset="60%" stop-color="#b45309"/>
            <stop offset="100%" stop-color="#3b0764"/>
          </linearGradient>
          <linearGradient id="gas" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#ec4899" stop-opacity="0.1"/>
          </linearGradient>
        </defs>
        <rect width="128" height="128" rx="28" fill="url(#bg)"/>
        <circle cx="64" cy="64" r="56" fill="none" stroke="#6366f1" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4 3"/>
        <!-- Star field -->
        <circle cx="30" cy="28" r="1.5" fill="#ffffff" opacity="0.8"/>
        <circle cx="102" cy="34" r="2" fill="#38bdf8" opacity="0.9"/>
        <circle cx="95" cy="80" r="1" fill="#ffffff" opacity="0.6"/>
        <circle cx="22" cy="88" r="1.5" fill="#f59e0b" opacity="0.7"/>
        <!-- Pillars -->
        <path d="M38 108 L42 62 Q44 40 52 32 Q58 42 56 65 L60 108 Z" fill="url(#pillar)"/>
        <path d="M58 108 L62 48 Q66 22 74 16 Q80 26 78 52 L82 108 Z" fill="url(#pillar)"/>
        <path d="M80 108 L84 68 Q88 48 94 44 Q98 52 96 74 L98 108 Z" fill="url(#pillar)"/>
        <!-- Ionization glow tips -->
        <circle cx="52" cy="32" r="4" fill="#67e8f9" opacity="0.8"/>
        <circle cx="74" cy="16" r="5" fill="#fef08a" opacity="0.9"/>
        <circle cx="94" cy="44" r="3.5" fill="#67e8f9" opacity="0.8"/>
        <!-- Border glow -->
        <rect width="124" height="124" x="2" y="2" rx="26" fill="none" stroke="#f59e0b" stroke-opacity="0.5" stroke-width="2"/>
      </svg>
    `
  },
  {
    name: 'icon-storm.jpg',
    svg: `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="stormbg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stop-color="#451a03"/>
            <stop offset="100%" stop-color="#0f0702"/>
          </radialGradient>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fb923c"/>
            <stop offset="70%" stop-color="#ea580c"/>
            <stop offset="100%" stop-color="#7c2d12"/>
          </radialGradient>
        </defs>
        <rect width="128" height="128" rx="28" fill="url(#stormbg)"/>
        <circle cx="64" cy="64" r="56" fill="none" stroke="#fb923c" stroke-opacity="0.25" stroke-width="1.5"/>
        <!-- Cloud bands -->
        <path d="M16 44 Q64 36 112 44" stroke="#d97706" stroke-width="3" fill="none" opacity="0.4"/>
        <path d="M14 84 Q64 92 114 84" stroke="#d97706" stroke-width="3" fill="none" opacity="0.4"/>
        <!-- Storm Oval Swirls -->
        <ellipse cx="64" cy="64" rx="38" ry="24" fill="url(#coreGlow)"/>
        <ellipse cx="64" cy="64" rx="28" ry="16" fill="none" stroke="#fed7aa" stroke-width="2" opacity="0.7"/>
        <ellipse cx="64" cy="64" rx="16" ry="9" fill="#f97316"/>
        <circle cx="64" cy="64" r="4" fill="#ffffff" opacity="0.9"/>
        <!-- Swirling eddies -->
        <path d="M38 60 Q52 46 76 50 Q92 56 86 70" fill="none" stroke="#fed7aa" stroke-width="2" stroke-linecap="round"/>
        <path d="M90 68 Q76 82 52 78 Q36 72 42 58" fill="none" stroke="#ea580c" stroke-width="2" stroke-linecap="round"/>
        <rect width="124" height="124" x="2" y="2" rx="26" fill="none" stroke="#f97316" stroke-opacity="0.6" stroke-width="2"/>
      </svg>
    `
  },
  {
    name: 'icon-deepfield.jpg',
    svg: `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="fieldbg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#020617"/>
          </radialGradient>
        </defs>
        <rect width="128" height="128" rx="28" fill="url(#fieldbg)"/>
        <circle cx="64" cy="64" r="56" fill="none" stroke="#38bdf8" stroke-opacity="0.3" stroke-width="1.5"/>
        <!-- Gravitational lensing arcs -->
        <path d="M32 46 A 42 42 0 0 1 48 28" stroke="#38bdf8" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.8"/>
        <path d="M84 100 A 46 46 0 0 1 100 78" stroke="#f43f5e" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.75"/>
        <path d="M26 82 A 40 40 0 0 1 36 102" stroke="#fbbf24" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.75"/>
        <!-- Distant Galaxies -->
        <!-- Center bright elliptical cluster -->
        <ellipse cx="64" cy="64" rx="14" ry="9" fill="#fef08a" transform="rotate(-25 64 64)"/>
        <circle cx="64" cy="64" r="5" fill="#ffffff"/>
        <!-- 6-spike diffraction spikes on foreground star -->
        <path d="M64 42 L64 86 M42 64 L86 64 M48 48 L80 80 M48 80 L80 48" stroke="#ffffff" stroke-width="1.2" opacity="0.7"/>
        <!-- Small spiral galaxy -->
        <ellipse cx="92" cy="40" rx="9" ry="5" fill="#818cf8" transform="rotate(45 92 40)"/>
        <circle cx="92" cy="40" r="2" fill="#ffffff"/>
        <!-- Small red galaxy -->
        <circle cx="36" cy="64" r="3" fill="#f87171"/>
        <circle cx="78" cy="88" r="2.5" fill="#38bdf8"/>
        <rect width="124" height="124" x="2" y="2" rx="26" fill="none" stroke="#38bdf8" stroke-opacity="0.5" stroke-width="2"/>
      </svg>
    `
  },
  {
    name: 'icon-saturn.jpg',
    svg: `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="satbg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="100%" stop-color="#050515"/>
          </radialGradient>
          <radialGradient id="satbody" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="60%" stop-color="#d97706"/>
            <stop offset="100%" stop-color="#78350f"/>
          </radialGradient>
        </defs>
        <rect width="128" height="128" rx="28" fill="url(#satbg)"/>
        <circle cx="64" cy="64" r="56" fill="none" stroke="#fbbf24" stroke-opacity="0.2" stroke-width="1.5"/>
        <!-- Back of ring -->
        <g transform="rotate(-22 64 64)">
          <path d="M12 64 A 52 14 0 0 1 116 64" stroke="#fbbf24" stroke-width="6" fill="none" opacity="0.4"/>
          <path d="M18 64 A 46 11 0 0 1 110 64" stroke="#fde68a" stroke-width="3" fill="none" opacity="0.7"/>
          <path d="M24 64 A 40 8 0 0 1 104 64" stroke="#f59e0b" stroke-width="2" fill="none" opacity="0.9"/>
        </g>
        <!-- Planet body -->
        <circle cx="64" cy="64" r="26" fill="url(#satbody)"/>
        <circle cx="64" cy="64" r="26" fill="none" stroke="#fbbf24" stroke-width="1.5" opacity="0.4"/>
        <!-- Front of ring -->
        <g transform="rotate(-22 64 64)">
          <path d="M12 64 A 52 14 0 0 0 116 64" stroke="#fbbf24" stroke-width="6" fill="none" opacity="0.85"/>
          <path d="M18 64 A 46 11 0 0 0 110 64" stroke="#fde68a" stroke-width="3" fill="none" opacity="0.95"/>
          <path d="M24 64 A 40 8 0 0 0 104 64" stroke="#f59e0b" stroke-width="2" fill="none" opacity="0.95"/>
        </g>
        <rect width="124" height="124" x="2" y="2" rx="26" fill="none" stroke="#fbbf24" stroke-opacity="0.5" stroke-width="2"/>
      </svg>
    `
  },
  {
    name: 'icon-nebula.jpg',
    svg: `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="nebbg" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="100%" stop-color="#020617"/>
          </radialGradient>
          <linearGradient id="ridge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fb7185"/>
            <stop offset="40%" stop-color="#d97706"/>
            <stop offset="100%" stop-color="#451a03"/>
          </linearGradient>
        </defs>
        <rect width="128" height="128" rx="28" fill="url(#nebbg)"/>
        <circle cx="64" cy="64" r="56" fill="none" stroke="#fb7185" stroke-opacity="0.25" stroke-width="1.5"/>
        <!-- Blue ionized cavity -->
        <circle cx="64" cy="40" r="32" fill="#38bdf8" opacity="0.18"/>
        <circle cx="50" cy="30" r="20" fill="#a855f7" opacity="0.25"/>
        <!-- Stars in upper cavity -->
        <circle cx="48" cy="32" r="2" fill="#ffffff"/>
        <circle cx="72" cy="24" r="1.5" fill="#fef08a"/>
        <circle cx="88" cy="38" r="2.5" fill="#67e8f9"/>
        <!-- Cosmic Cliffs Mountainous Ridge -->
        <path d="M12 116 L12 80 Q28 66 42 78 Q58 90 74 62 Q86 48 98 64 Q108 76 116 70 L116 116 Z" fill="url(#ridge)"/>
        <!-- Luminous edge -->
        <path d="M12 80 Q28 66 42 78 Q58 90 74 62 Q86 48 98 64 Q108 76 116 70" fill="none" stroke="#fef08a" stroke-width="2.5" opacity="0.9"/>
        <rect width="124" height="124" x="2" y="2" rx="26" fill="none" stroke="#fb7185" stroke-opacity="0.5" stroke-width="2"/>
      </svg>
    `
  },
  {
    name: 'icon-andromeda.jpg',
    svg: `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="andbg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="100%" stop-color="#020617"/>
          </radialGradient>
        </defs>
        <rect width="128" height="128" rx="28" fill="url(#andbg)"/>
        <circle cx="64" cy="64" r="56" fill="none" stroke="#818cf8" stroke-opacity="0.2" stroke-width="1.5"/>
        <!-- Spiral Arms rotated -->
        <g transform="rotate(-30 64 64)">
          <!-- Outer Arm 1 -->
          <ellipse cx="64" cy="64" rx="46" ry="18" fill="none" stroke="#6366f1" stroke-width="3" opacity="0.4" stroke-dasharray="14 8"/>
          <!-- Outer Arm 2 -->
          <ellipse cx="64" cy="64" rx="36" ry="14" fill="none" stroke="#38bdf8" stroke-width="3.5" opacity="0.65" stroke-dasharray="10 6"/>
          <!-- Inner Arm -->
          <ellipse cx="64" cy="64" rx="24" ry="9" fill="none" stroke="#c084fc" stroke-width="3" opacity="0.85"/>
          <!-- Bright Galactic Core -->
          <ellipse cx="64" cy="64" rx="14" ry="6" fill="#fef08a" opacity="0.95"/>
          <circle cx="64" cy="64" r="4" fill="#ffffff"/>
        </g>
        <!-- Satellite galaxies M32 & M110 -->
        <ellipse cx="88" cy="88" rx="6" ry="3" fill="#93c5fd" opacity="0.75" transform="rotate(30 88 88)"/>
        <ellipse cx="38" cy="40" rx="5" ry="3" fill="#f472b6" opacity="0.75" transform="rotate(-20 38 40)"/>
        <rect width="124" height="124" x="2" y="2" rx="26" fill="none" stroke="#818cf8" stroke-opacity="0.5" stroke-width="2"/>
      </svg>
    `
  },
  {
    name: 'icon-volcano.jpg',
    svg: `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="volcbg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stop-color="#361a05"/>
            <stop offset="100%" stop-color="#0c0502"/>
          </radialGradient>
          <linearGradient id="plume" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#ef4444"/>
            <stop offset="50%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#67e8f9"/>
          </linearGradient>
        </defs>
        <rect width="128" height="128" rx="28" fill="url(#volcbg)"/>
        <circle cx="64" cy="64" r="56" fill="none" stroke="#ef4444" stroke-opacity="0.25" stroke-width="1.5"/>
        <!-- Umbrella plume eruption -->
        <path d="M64 74 Q52 46 36 32 Q48 22 64 22 Q80 22 92 32 Q76 46 64 74 Z" fill="url(#plume)" opacity="0.8"/>
        <!-- Gas umbrella rim -->
        <path d="M34 34 Q64 16 94 34" stroke="#67e8f9" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.9"/>
        <!-- Volcano mountain caldera -->
        <path d="M20 112 L50 80 L78 80 L108 112 Z" fill="#78350f"/>
        <!-- Lava lake in caldera -->
        <ellipse cx="64" cy="80" rx="14" ry="4" fill="#f59e0b"/>
        <ellipse cx="64" cy="80" rx="8" ry="2" fill="#ffffff"/>
        <!-- Eruption fountain center -->
        <line x1="64" y1="80" x2="64" y2="28" stroke="#ffffff" stroke-width="2.5" opacity="0.9"/>
        <rect width="124" height="124" x="2" y="2" rx="26" fill="none" stroke="#ef4444" stroke-opacity="0.5" stroke-width="2"/>
      </svg>
    `
  },
  {
    name: 'icon-blackhole.jpg',
    svg: `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bhbg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stop-color="#180e29"/>
            <stop offset="100%" stop-color="#020005"/>
          </radialGradient>
          <radialGradient id="accretion" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#f97316"/>
            <stop offset="70%" stop-color="#dc2626"/>
            <stop offset="100%" stop-color="#7f1d1d"/>
          </radialGradient>
        </defs>
        <rect width="128" height="128" rx="28" fill="url(#bhbg)"/>
        <circle cx="64" cy="64" r="56" fill="none" stroke="#f97316" stroke-opacity="0.25" stroke-width="1.5"/>
        <!-- Accretion disk halo behind -->
        <ellipse cx="64" cy="64" rx="46" ry="18" fill="none" stroke="url(#accretion)" stroke-width="12" opacity="0.8" transform="rotate(-15 64 64)"/>
        <ellipse cx="64" cy="64" rx="46" ry="18" fill="none" stroke="#fef08a" stroke-width="2" opacity="0.9" transform="rotate(-15 64 64)"/>
        <!-- Event Horizon (Pitch Black Sphere) -->
        <circle cx="64" cy="64" r="22" fill="#000000"/>
        <!-- Gravitational lensing photon ring -->
        <circle cx="64" cy="64" r="22" fill="none" stroke="#f97316" stroke-width="2.5" opacity="0.95"/>
        <!-- Relativistic beaming hotspot -->
        <ellipse cx="48" cy="60" rx="8" ry="4" fill="#fef08a" opacity="0.9"/>
        <circle cx="48" cy="60" r="2" fill="#ffffff"/>
        <rect width="124" height="124" x="2" y="2" rx="26" fill="none" stroke="#f97316" stroke-opacity="0.5" stroke-width="2"/>
      </svg>
    `
  },
  {
    name: 'icon-random.jpg',
    svg: `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dicebg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
          <linearGradient id="cube" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="100%" stop-color="#2563eb"/>
          </linearGradient>
        </defs>
        <rect width="128" height="128" rx="28" fill="url(#dicebg)"/>
        <circle cx="64" cy="64" r="56" fill="none" stroke="#38bdf8" stroke-opacity="0.25" stroke-width="1.5"/>
        <!-- Isometric Cube Die -->
        <!-- Top Face -->
        <path d="M64 28 L94 44 L64 60 L34 44 Z" fill="#60a5fa"/>
        <!-- Left Face -->
        <path d="M34 44 L64 60 L64 96 L34 80 Z" fill="#2563eb"/>
        <!-- Right Face -->
        <path d="M64 60 L94 44 L94 80 L64 96 Z" fill="#1d4ed8"/>
        <!-- Dots / Pips -->
        <!-- Top face center dot -->
        <circle cx="64" cy="44" r="3.5" fill="#ffffff"/>
        <!-- Left face dots -->
        <circle cx="44" cy="58" r="3" fill="#ffffff"/>
        <circle cx="54" cy="78" r="3" fill="#ffffff"/>
        <!-- Right face dots -->
        <circle cx="74" cy="74" r="3" fill="#ffffff"/>
        <circle cx="84" cy="56" r="3" fill="#ffffff"/>
        <!-- Orbit loop around die -->
        <ellipse cx="64" cy="64" rx="52" ry="20" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="6 4" transform="rotate(-25 64 64)"/>
        <circle cx="106" cy="46" r="3" fill="#f43f5e"/>
        <rect width="124" height="124" x="2" y="2" rx="26" fill="none" stroke="#38bdf8" stroke-opacity="0.5" stroke-width="2"/>
      </svg>
    `
  },
  {
    name: 'icon-cite.jpg',
    svg: `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="citebg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#141c2e"/>
            <stop offset="100%" stop-color="#0b0f19"/>
          </linearGradient>
          <linearGradient id="paper" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#334155"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
        </defs>
        <rect width="128" height="128" rx="28" fill="url(#citebg)"/>
        <circle cx="64" cy="64" r="56" fill="none" stroke="#38bdf8" stroke-opacity="0.25" stroke-width="1.5"/>
        <!-- Clipboard Base -->
        <rect x="36" y="28" width="56" height="74" rx="8" fill="#475569"/>
        <rect x="40" y="32" width="48" height="66" rx="6" fill="url(#paper)"/>
        <!-- Clip on top -->
        <rect x="50" y="22" width="28" height="12" rx="4" fill="#38bdf8"/>
        <circle cx="64" cy="28" r="2.5" fill="#0f172a"/>
        <!-- Document Text Lines -->
        <line x1="48" y1="46" x2="80" y2="46" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="48" y1="56" x2="74" y2="56" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="48" y1="66" x2="80" y2="66" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="48" y1="76" x2="68" y2="76" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Verification Stamp Checkmark -->
        <circle cx="78" cy="84" r="10" fill="#22c55e"/>
        <path d="M74 84 L77 87 L83 81" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <rect width="124" height="124" x="2" y="2" rx="26" fill="none" stroke="#38bdf8" stroke-opacity="0.5" stroke-width="2"/>
      </svg>
    `
  },
  {
    name: 'icon-certificate.jpg',
    svg: `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="certbg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e1e38"/>
            <stop offset="100%" stop-color="#090915"/>
          </linearGradient>
          <linearGradient id="diploma" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef3c7"/>
            <stop offset="100%" stop-color="#fde68a"/>
          </linearGradient>
        </defs>
        <rect width="128" height="128" rx="28" fill="url(#certbg)"/>
        <circle cx="64" cy="64" r="56" fill="none" stroke="#fbbf24" stroke-opacity="0.25" stroke-width="1.5"/>
        <!-- Certificate Scroll Page -->
        <rect x="28" y="26" width="72" height="76" rx="6" fill="url(#diploma)"/>
        <rect x="32" y="30" width="64" height="68" rx="4" fill="none" stroke="#d97706" stroke-width="1.5" stroke-dasharray="4 2"/>
        <!-- Decorative Header -->
        <path d="M42 42 L86 42" stroke="#92400e" stroke-width="3" stroke-linecap="round"/>
        <path d="M46 50 L82 50" stroke="#b45309" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M42 58 L78 58" stroke="#b45309" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M42 66 L68 66" stroke="#b45309" stroke-width="1.5" stroke-linecap="round"/>
        <!-- Golden Star / Medal Seal -->
        <circle cx="76" cy="80" r="11" fill="#f59e0b"/>
        <circle cx="76" cy="80" r="9" fill="#fbbf24"/>
        <polygon points="76,73 78,77 82,78 79,81 80,85 76,83 72,85 73,81 70,78 74,77" fill="#b45309"/>
        <!-- Ribbon hanging from seal -->
        <polygon points="73,90 70,102 76,98 82,102 79,90" fill="#dc2626"/>
        <rect width="124" height="124" x="2" y="2" rx="26" fill="none" stroke="#fbbf24" stroke-opacity="0.5" stroke-width="2"/>
      </svg>
    `
  },
  {
    name: 'icon-loupe.jpg',
    svg: `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="loupbg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#131e33"/>
            <stop offset="100%" stop-color="#080c14"/>
          </linearGradient>
          <radialGradient id="lens" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.5"/>
            <stop offset="70%" stop-color="#0284c7" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#0369a1" stop-opacity="0.6"/>
          </radialGradient>
        </defs>
        <rect width="128" height="128" rx="28" fill="url(#loupbg)"/>
        <circle cx="64" cy="64" r="56" fill="none" stroke="#38bdf8" stroke-opacity="0.25" stroke-width="1.5"/>
        <!-- Lens Circle -->
        <circle cx="56" cy="54" r="28" fill="url(#lens)"/>
        <circle cx="56" cy="54" r="28" fill="none" stroke="#38bdf8" stroke-width="4"/>
        <!-- Crosshairs inside lens -->
        <line x1="56" y1="34" x2="56" y2="46" stroke="#f43f5e" stroke-width="2" stroke-linecap="round"/>
        <line x1="56" y1="62" x2="56" y2="74" stroke="#f43f5e" stroke-width="2" stroke-linecap="round"/>
        <line x1="36" y1="54" x2="48" y2="54" stroke="#f43f5e" stroke-width="2" stroke-linecap="round"/>
        <line x1="64" y1="54" x2="76" y2="54" stroke="#f43f5e" stroke-width="2" stroke-linecap="round"/>
        <circle cx="56" cy="54" r="4" fill="none" stroke="#ffffff" stroke-width="1.5"/>
        <!-- Lens glare reflection -->
        <path d="M40 38 A 20 20 0 0 1 68 38" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.75"/>
        <!-- Handle -->
        <line x1="76" y1="74" x2="98" y2="96" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/>
        <line x1="82" y1="80" x2="98" y2="96" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
        <rect width="124" height="124" x="2" y="2" rx="26" fill="none" stroke="#38bdf8" stroke-opacity="0.5" stroke-width="2"/>
      </svg>
    `
  }
];

async function run() {
  for (const item of icons) {
    const filePath = path.join(outputDir, item.name);
    const buf = Buffer.from(item.svg);
    await sharp(buf)
      .resize(128, 128)
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(filePath);
    console.log(`Generated: ${item.name}`);
  }
  console.log('All icons generated successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
