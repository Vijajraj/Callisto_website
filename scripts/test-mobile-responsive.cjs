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

console.log('=== PILLAR 4: MOBILE RESPONSIVENESS TESTING ===\n');

const distDir = 'c:/projects/callisto/dist';
const srcDir = 'c:/projects/callisto/src';

let responsiveIssues = 0;

// 1. Viewport Meta Tag Audit on all HTML files
console.log('--- Viewport Meta Tag Audit ---');
function getHtmlFiles(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      files = files.concat(getHtmlFiles(full));
    } else if (item.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

const htmlPages = getHtmlFiles(distDir);
let missingViewport = 0;
htmlPages.forEach(hp => {
  const content = fs.readFileSync(hp, 'utf8');
  if (!content.includes('name="viewport"') || !content.includes('width=device-width')) {
    console.error(`[FAIL] Missing or invalid viewport meta tag in ${hp}`);
    missingViewport++;
    responsiveIssues++;
  }
});

if (missingViewport === 0) {
  console.log(`[PASS] All ${htmlPages.length} HTML pages contain standard responsive viewport meta tags.`);
}

// 2. Component Mobile Breakpoints Audit
console.log('\n--- Component Mobile Breakpoints & Touch Handlers Audit ---');
const componentsToCheck = [
  { file: 'src/components/react/TonightSkyEphemeris.tsx', name: 'TonightSkyEphemeris' },
  { file: 'src/components/react/NasaDeepSpaceFeed.tsx', name: 'NasaDeepSpaceFeed' },
  { file: 'src/components/react/ExpeditionSimulator.tsx', name: 'ExpeditionSimulator' },
  { file: 'src/components/react/SoundHud.tsx', name: 'SoundHud' },
  { file: 'src/pages/404.astro', name: 'Custom 404 Page' },
  { file: 'src/styles/global.css', name: 'Global Stylesheet' },
];

componentsToCheck.forEach(c => {
  const full = path.join('c:/projects/callisto', c.file);
  const content = fs.readFileSync(full, 'utf8');

  const hasMediaQueries = /@media\s*\([^)]*max-width[^)]*\)/i.test(content);
  const hasTouchScroll = content.includes('overflow-x') || content.includes('touch');

  if (hasMediaQueries) {
    console.log(`[PASS] ${c.name} implements responsive CSS media queries.`);
  } else {
    console.warn(`[WARN] ${c.name} may lack explicit max-width media query.`);
  }

  if (c.name === 'NasaDeepSpaceFeed') {
    const hasTouchEvents = content.includes('onTouchStart') && content.includes('onTouchMove');
    if (hasTouchEvents) {
      console.log(`[PASS] ${c.name} has native mobile touch handlers (onTouchStart, onTouchMove).`);
    } else {
      console.warn(`[WARN] ${c.name} missing native touch listeners.`);
      responsiveIssues++;
    }
  } else if (c.name === 'ExpeditionSimulator') {
    const hasTouchEvents = content.includes('onTouchEnd');
    if (hasTouchEvents) {
      console.log(`[PASS] ${c.name} has native mobile touch tap selection handler (onTouchEnd).`);
    } else {
      console.warn(`[WARN] ${c.name} missing native touch listeners.`);
      responsiveIssues++;
    }
  }
});

// 3. Overflow and Viewport Width Safety
console.log('\n--- Mobile Viewport Horizontal Bleed Audit ---');
const globalCss = fs.readFileSync('c:/projects/callisto/src/styles/global.css', 'utf8');
const hasOverflowProtection = globalCss.includes('overflow-x') || globalCss.includes('max-width');
if (hasOverflowProtection) {
  console.log(`[PASS] Global CSS guards against viewport width horizontal bleed.`);
} else {
  console.warn(`[WARN] Global CSS should include overflow-x: hidden on body/root.`);
}

console.log(`\nMobile Responsiveness testing complete: ${responsiveIssues === 0 ? 'ALL CHECKS PASSED' : `${responsiveIssues} ISSUES`}`);
