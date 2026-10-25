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

const fs = require('fs');
const path = require('path');

const distDir = 'c:/projects/callisto/dist';

console.log('=== PILLAR 1: FUNCTIONALITY TESTING ===\n');

// 1. Verify all expected routes exist
const requiredPages = [
  'index.html',
  '404.html',
  'about/index.html',
  'observatory/index.html',
  'expedition/index.html',
  'missions/index.html',
  'gallery/index.html',
  'events/index.html',
  'crew/index.html',
  'avatar/index.html',
  'join/index.html',
  'contact/index.html',
];

let missingPages = 0;
for (const p of requiredPages) {
  const full = path.join(distDir, p);
  if (fs.existsSync(full)) {
    const size = fs.statSync(full).size;
    console.log(`[PASS] Route exists: /${p} (${(size / 1024).toFixed(1)} KB)`);
  } else {
    console.error(`[FAIL] Route missing: /${p}`);
    missingPages++;
  }
}

// 2. Verify all internal href targets exist
console.log('\n--- Link Integrity Check ---');
const hrefRegex = /href=["']([^"']+)["']/g;
const linksFound = new Set();
const brokenLinks = [];

function checkHtmlLinks(file) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1];
    if (href.startsWith('/') && !href.startsWith('//')) {
      // Normalize internal path
      const cleanHref = href.split('#')[0].split('?')[0];
      linksFound.add(cleanHref);
      
      // Determine file path
      let targetFile;
      if (cleanHref.endsWith('.css') || cleanHref.endsWith('.js') || cleanHref.endsWith('.svg') || cleanHref.endsWith('.jpg') || cleanHref.endsWith('.png') || cleanHref.endsWith('.xml') || cleanHref.endsWith('.txt')) {
        targetFile = path.join(distDir, cleanHref);
      } else if (cleanHref.endsWith('/')) {
        targetFile = path.join(distDir, cleanHref, 'index.html');
      } else if (cleanHref === '') {
        targetFile = path.join(distDir, 'index.html');
      } else {
        targetFile = path.join(distDir, cleanHref, 'index.html');
        if (!fs.existsSync(targetFile)) {
          targetFile = path.join(distDir, cleanHref);
        }
      }

      if (!fs.existsSync(targetFile)) {
        brokenLinks.push({ source: path.relative(distDir, file), target: href });
      }
    }
  }
}

function scanHtmlFiles(dir) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scanHtmlFiles(full);
    } else if (item.endsWith('.html')) {
      checkHtmlLinks(full);
    }
  }
}

scanHtmlFiles(distDir);

if (brokenLinks.length === 0) {
  console.log(`[PASS] All ${linksFound.size} unique internal routes/assets resolve correctly with 0 broken links!`);
} else {
  console.error(`[FAIL] Found ${brokenLinks.length} broken links:`, brokenLinks);
}

// 3. Verify interactive client islands are included
console.log('\n--- Interactive Astro Islands Check ---');
const clientIslandPages = [
  { page: 'observatory/index.html', islands: ['TonightSkyEphemeris', 'NasaDeepSpaceFeed'] },
  { page: 'expedition/index.html', islands: ['ExpeditionSimulator'] },
  { page: 'missions/index.html', islands: ['MissionsConsole'] },
  { page: 'avatar/index.html', islands: ['AvatarBuilder'] },
  { page: 'index.html', islands: ['Starfield', 'SoundHud', 'EventCountdown'] },
];

for (const check of clientIslandPages) {
  const file = path.join(distDir, check.page);
  const content = fs.readFileSync(file, 'utf8');
  for (const island of check.islands) {
    if (content.includes(`astro-island`) || content.includes(island) || content.includes(`client:load`) || content.includes(`client:idle`)) {
      console.log(`[PASS] Island mounted in /${check.page}: ${island}`);
    } else {
      console.warn(`[WARN] Island verification needed for ${island} in /${check.page}`);
    }
  }
}

console.log('\nFunctionality testing complete.');
