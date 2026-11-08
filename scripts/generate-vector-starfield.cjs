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
const sharp = require('sharp');

// Create the ultimate pixel-perfect vector Starfield emblem
// Dimensions: 512x512
// All elements, text, and graphics are 100% INSIDE the white circle!
// Zero overlapping of letters with the circle!
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Master clip path for outer edge -->
    <clipPath id="badgeCircleClip">
      <circle cx="256" cy="256" r="250" />
    </clipPath>

    <!-- Clip path strictly inside the white ring (r=230) -->
    <clipPath id="innerCircleClip">
      <circle cx="256" cy="256" r="230" />
    </clipPath>

    <!-- Gradients -->
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3B5F8D" />
      <stop offset="35%" stop-color="#476F9E" />
      <stop offset="70%" stop-color="#3B608F" />
      <stop offset="100%" stop-color="#223859" />
    </linearGradient>

    <!-- Luminous Ring Filter -->
    <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- All contents clipped to the round badge -->
  <g clip-path="url(#badgeCircleClip)">
    <!-- Base dark cosmic background -->
    <rect width="512" height="512" fill="#182A48" />

    <!-- Sky gradient core -->
    <rect width="512" height="512" fill="url(#skyGrad)" />

    <!-- Left & Right darker blue atmospheric curved curtains -->
    <!-- Left curtain -->
    <path d="M 0 0 L 210 0 C 180 90, 160 160, 140 256 C 160 350, 180 420, 210 512 L 0 512 Z" fill="#22395C" opacity="0.9" />
    <path d="M 0 0 L 160 0 C 130 90, 110 170, 95 256 C 110 340, 130 420, 160 512 L 0 512 Z" fill="#182944" />

    <!-- Right curtain -->
    <path d="M 512 0 L 302 0 C 332 90, 352 160, 372 256 C 352 350, 332 420, 302 512 L 512 512 Z" fill="#22395C" opacity="0.9" />
    <path d="M 512 0 L 352 0 C 382 90, 402 170, 417 256 C 402 340, 382 420, 352 512 L 512 512 Z" fill="#182944" />

    <!-- Horizon Sunrises / Planetary Arcs (Yellow, Orange, Red) -->
    <!-- Yellow / Gold Upper Rim -->
    <path d="M 45 435 Q 256 295 467 435 L 480 465 Q 256 315 32 465 Z" fill="#F0A638" />

    <!-- Orange Middle Arc -->
    <path d="M 70 460 Q 256 325 442 460 L 458 490 Q 256 345 54 490 Z" fill="#E85A26" />

    <!-- Red Bottom Core Horizon Dome -->
    <path d="M 80 485 Q 256 355 432 485 C 390 520, 330 542, 256 542 C 182 542, 122 520, 80 485 Z" fill="#BF2222" />
    <path d="M 115 512 Q 256 380 397 512 Z" fill="#A01818" />

    <!-- Signature Crisp White STARFIELD Ring -->
    <!-- Clean, unbroken, luminous white circular ring with stroke 9 -->
    <circle cx="256" cy="256" r="236" fill="none" stroke="#FFFFFF" stroke-width="8.5" />
    <circle cx="256" cy="256" r="236" fill="none" stroke="rgba(255, 255, 255, 0.35)" stroke-width="15" />

    <!-- S T Λ R F I E L D Typography -->
    <!-- Centered perfectly at x=256, y=259. Height: 58px. Stroke: 7.5px. -->
    <!-- Bounds: x from 65 to 447. Margins to white ring: 41px on left, 41px on right! -->
    <!-- ZERO OVERLAPPING with the white ring or borders! -->
    <g fill="none" stroke="#FFFFFF" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#ringGlow)">
      <!-- S (center x: 86) -->
      <path d="M 99 241 C 97 234, 91 230, 83 230 C 73 230, 68 236, 68 243 C 68 253, 77 256, 87 259 C 98 262, 104 266, 104 274 C 104 282, 96 288, 84 288 C 74 288, 67 283, 65 274" />

      <!-- T (center x: 129) -->
      <path d="M 113 230 L 145 230" />
      <path d="M 129 230 L 129 288" />

      <!-- Λ (Starfield signature chevron 'A', center x: 175) -->
      <path d="M 159 288 L 175 230 L 191 288" />

      <!-- R (center x: 222) -->
      <path d="M 209 288 L 209 230 L 226 230 C 236 230, 241 235, 241 244 C 241 253, 236 257, 226 257 L 209 257" />
      <path d="M 224 257 L 241 288" />

      <!-- F (center x: 269) -->
      <path d="M 258 288 L 258 230 L 286 230" />
      <path d="M 258 257 L 279 257" />

      <!-- I (center x: 306) -->
      <path d="M 306 230 L 306 288" />

      <!-- E (center x: 342) -->
      <path d="M 358 230 L 330 230 L 330 288 L 358 288" />
      <path d="M 330 258 L 353 258" />

      <!-- L (center x: 385) -->
      <path d="M 374 230 L 374 288 L 400 288" />

      <!-- D (center x: 427) -->
      <path d="M 416 230 L 416 288 L 428 288 C 439 288, 447 278, 447 259 C 447 240, 439 230, 428 230 Z" />
    </g>
  </g>
</svg>`;

async function run() {
  const publicIconsDir = path.resolve(__dirname, '../public/icons');
  if (!fs.existsSync(publicIconsDir)) {
    fs.mkdirSync(publicIconsDir, { recursive: true });
  }

  const svgPath = path.join(publicIconsDir, 'starfield-badge.svg');
  fs.writeFileSync(svgPath, svg, 'utf8');
  console.log('Saved vector SVG to:', svgPath);

  // Render high-res PNG badges
  const png512 = await sharp(Buffer.from(svg))
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();

  const pngBadgePath = path.join(publicIconsDir, 'starfield-badge.png');
  const pngRocketPath = path.join(publicIconsDir, 'starfield-rocket-badge.png');

  fs.writeFileSync(pngBadgePath, png512);
  fs.writeFileSync(pngRocketPath, png512);

  console.log('Successfully wrote 512x512 high-res starfield-badge.png and starfield-rocket-badge.png!');
}

run().catch((err) => {
  console.error('Error generating vector starfield:', err);
  process.exit(1);
});
