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

const sharp = require('c:/projects/callisto/node_modules/sharp');
const path = require('path');
const fs = require('fs');

const outputDir = 'c:/projects/callisto/public/icons';

const badges = [
  {
    name: 'badge-astro.png',
    svg: `
      <svg width="140" height="28" viewBox="0 0 140 28" xmlns="http://www.w3.org/2000/svg">
        <rect width="140" height="28" rx="6" fill="#0f172a" stroke="#f43f5e" stroke-width="1"/>
        <circle cx="16" cy="14" r="6" fill="#f43f5e"/>
        <text x="32" y="18" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="700">ASTRO 5 SSG</text>
      </svg>
    `
  },
  {
    name: 'badge-react.png',
    svg: `
      <svg width="140" height="28" viewBox="0 0 140 28" xmlns="http://www.w3.org/2000/svg">
        <rect width="140" height="28" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1"/>
        <circle cx="16" cy="14" r="6" fill="#38bdf8"/>
        <text x="32" y="18" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="700">REACT 19</text>
      </svg>
    `
  },
  {
    name: 'badge-sqlite.png',
    svg: `
      <svg width="140" height="28" viewBox="0 0 140 28" xmlns="http://www.w3.org/2000/svg">
        <rect width="140" height="28" rx="6" fill="#0f172a" stroke="#22c55e" stroke-width="1"/>
        <circle cx="16" cy="14" r="6" fill="#22c55e"/>
        <text x="32" y="18" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="700">SQLITE 3</text>
      </svg>
    `
  },
  {
    name: 'badge-audit.png',
    svg: `
      <svg width="150" height="28" viewBox="0 0 150 28" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="28" rx="6" fill="#0f172a" stroke="#fbbf24" stroke-width="1"/>
        <circle cx="16" cy="14" r="6" fill="#fbbf24"/>
        <text x="32" y="18" fill="#ffffff" font-family="sans-serif" font-size="11" font-weight="700">5-PILLAR TESTED</text>
      </svg>
    `
  }
];

async function run() {
  for (const b of badges) {
    const buf = Buffer.from(b.svg);
    await sharp(buf).png().toFile(path.join(outputDir, b.name));
    console.log(`Generated: ${b.name}`);
  }
}

run();
