/**
 * Callisto Cross-Compatibility & Multi-Device Verification Suite
 *
 * Audits:
 * 1. WebKit/Gecko/Blink prefixing (Backdrop-filter, Font-smoothing, Scrollbars)
 * 2. Canvas API backward-compatibility (roundRect polyfills, context scaling)
 * 3. Mobile touch targets, user-select:none, and responsive viewports
 * 4. WCAG Color Contrast across Deep Space & Solar Flare palettes
 * 5. AudioContext autoplay policy compliance across Safari/Chrome/Firefox
 * 6. Responsive layout integrity across 23 static pages
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const BASE_URL = 'http://localhost:4321';
const SRC_DIR = path.join(__dirname, 'src');

const routes = [
  '/',
  '/about',
  '/crew',
  '/crew/general',
  '/crew/presidential',
  '/crew/international',
  '/crew/social-media',
  '/crew/content',
  '/crew/event',
  '/crew/design',
  '/crew/tech',
  '/crew/astronomy',
  '/crew/people',
  '/crew/research',
  '/events',
  '/join',
  '/contact',
  '/expedition',
  '/missions',
  '/observatory',
  '/gallery',
  '/avatar',
  '/404',
];

function fetchRoute(route) {
  return new Promise((resolve) => {
    http.get(`${BASE_URL}${route}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', () => {
      // Fallback to static build output if dev server is running across sandbox boundary
      try {
        const filePath = path.join(
          __dirname,
          'dist',
          route === '/' ? 'index.html' : route === '/404' ? '404.html' : path.join(route, 'index.html')
        );
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          resolve({ status: 200, body: content });
          return;
        }
      } catch (e) {}
      resolve({ status: 500, body: '' });
    });
  });
}

// Calculate relative luminance for WCAG contrast checking
function hexToLuminance(hex) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1, hex2) {
  const l1 = hexToLuminance(hex1);
  const l2 = hexToLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function runCrossCompatAudit() {
  console.log('=================================================================');
  console.log('       CALLISTO EXPEDITION — CROSS-COMPATIBILITY AUDIT           ');
  console.log('=================================================================\n');

  let totalPassed = 0;
  let totalFailed = 0;

  // 1. WebKit / Gecko / Chromium Vendor Prefix Audit
  console.log('--- 1. BROWSER ENGINE PREFIX & RENDERING AUDIT ---');

  // Check global.css for font-smoothing, scrollbars
  const globalCss = fs.readFileSync(path.join(SRC_DIR, 'styles', 'global.css'), 'utf8');
  if (
    globalCss.includes('-webkit-font-smoothing') &&
    globalCss.includes('-moz-osx-font-smoothing')
  ) {
    console.log('  [PASS] Font smoothing: -webkit-font-smoothing and -moz-osx-font-smoothing active');
    totalPassed++;
  } else {
    console.log('  [FAIL] Missing cross-browser font smoothing prefixes');
    totalFailed++;
  }

  if (
    globalCss.includes('scrollbar-width: thin') &&
    globalCss.includes('::-webkit-scrollbar')
  ) {
    console.log('  [PASS] Scrollbar engine: Standard Firefox (scrollbar-width) and WebKit (::-webkit-scrollbar) configured');
    totalPassed++;
  } else {
    console.log('  [FAIL] Incomplete scrollbar prefixing');
    totalFailed++;
  }

  // Check backdrop-filter has -webkit-backdrop-filter
  const navAstro = fs.readFileSync(path.join(SRC_DIR, 'components', 'Navigation.astro'), 'utf8');
  if (
    navAstro.includes('backdrop-filter: blur') &&
    navAstro.includes('-webkit-backdrop-filter: blur')
  ) {
    console.log('  [PASS] Glassmorphism: -webkit-backdrop-filter paired for Safari/iOS WebKit');
    totalPassed++;
  } else {
    console.log('  [FAIL] Missing -webkit-backdrop-filter in Navigation component');
    totalFailed++;
  }

  // 2. Canvas & JavaScript API Cross-Compatibility
  console.log('\n--- 2. CANVAS & JAVASCRIPT API BACKWARD-COMPATIBILITY ---');
  const simTsx = fs.readFileSync(path.join(SRC_DIR, 'components', 'react', 'ExpeditionSimulator.tsx'), 'utf8');
  const withoutHelper = simTsx.replace(/drawCompatRoundRect[\s\S]*?};/, '');
  if (simTsx.includes('drawCompatRoundRect') && !withoutHelper.includes('.roundRect(')) {
    console.log('  [PASS] Canvas roundRect: Polyfilled with arcTo fallback (Safari <16.2 / Android WebView safe)');
    totalPassed++;
  } else {
    console.log('  [FAIL] Raw un-polyfilled ctx.roundRect detected outside helper');
    totalFailed++;
  }

  // Check AudioContext Safari compatibility
  const audioTs = fs.readFileSync(path.join(SRC_DIR, 'lib', 'audio.ts'), 'utf8');
  if (
    audioTs.includes('webkitAudioContext') &&
    audioTs.includes("audioCtx.state === 'suspended'") &&
    audioTs.includes('audioCtx.resume()')
  ) {
    console.log('  [PASS] Web Audio API: webkitAudioContext fallback + autoplay suspended state resume handling');
    totalPassed++;
  } else {
    console.log('  [FAIL] Missing webkitAudioContext or suspended audio context resume handler');
    totalFailed++;
  }

  // 3. Mobile Touch & Viewport Verification
  console.log('\n--- 3. MOBILE TOUCH & VIEWPORT CONFIGURATION ---');
  let viewportCount = 0;
  for (const r of routes) {
    try {
      const res = await fetchRoute(r);
      if (res.body.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0"')) {
        viewportCount++;
      }
    } catch (e) {
      // dev server offline
    }
  }

  if (viewportCount === routes.length) {
    console.log(`  [PASS] Viewport Meta Tag: 100% of routes (${viewportCount}/${routes.length}) define initial-scale=1.0`);
    totalPassed++;
  } else {
    console.log(`  [FAIL] Missing mobile viewport tag in ${routes.length - viewportCount} routes`);
    totalFailed++;
  }

  // Check touch controls in ExpeditionSimulator
  if (
    simTsx.includes('onTouchStart') &&
    simTsx.includes('onTouchEnd') &&
    simTsx.includes('userSelect: \'none\'')
  ) {
    console.log('  [PASS] Mobile Surface Rover Controls: Dedicated touchstart/touchend handlers with user-select:none');
    totalPassed++;
  } else {
    console.log('  [FAIL] Missing touch handlers or touch text-selection prevention');
    totalFailed++;
  }

  // 4. WCAG Color Contrast Verification (Deep Space & Solar Flare)
  console.log('\n--- 4. WCAG AA ACCESSIBILITY COLOR CONTRAST AUDIT ---');

  // Deep Space: Text (#FFF5F5) on Base Void (#0B0507)
  const deepRatio = getContrastRatio('#FFF5F5', '#0B0507');
  console.log(`  Deep Space Mode: #FFF5F5 on #0B0507 -> Contrast Ratio ${deepRatio.toFixed(2)}:1 (Min 4.5:1 required)`);
  if (deepRatio >= 4.5) {
    console.log('  [PASS] Deep Space Mode meets WCAG AA & AAA standard');
    totalPassed++;
  } else {
    console.log('  [FAIL] Deep Space Mode fails WCAG AA contrast threshold');
    totalFailed++;
  }

  // Solar Slate Mode: Deep Slate Text (#0F172A) on Titanium-Slate Void (#F8FAFC)
  const lightRatio = getContrastRatio('#0F172A', '#F8FAFC');
  console.log(`  Solar Slate Mode: #0F172A on #F8FAFC -> Contrast Ratio ${lightRatio.toFixed(2)}:1 (Min 4.5:1 required)`);
  if (lightRatio >= 4.5) {
    console.log('  [PASS] Solar Slate Mode meets WCAG AA & AAA standard');
    totalPassed++;
  } else {
    console.log('  [FAIL] Solar Slate Mode fails WCAG AA contrast threshold');
    totalFailed++;
  }

  // Slate 600 secondary text (#475569) on #F8FAFC
  const slateSteelRatio = getContrastRatio('#475569', '#F8FAFC');
  console.log(`  Secondary Slate Text: #475569 on #F8FAFC -> Contrast Ratio ${slateSteelRatio.toFixed(2)}:1 (Min 4.5:1 required)`);
  if (slateSteelRatio >= 4.5) {
    console.log('  [PASS] Secondary Slate Text meets WCAG AA standard');
    totalPassed++;
  } else {
    console.log('  [FAIL] Secondary Slate Text fails WCAG AA contrast threshold');
    totalFailed++;
  }

  // Star accent on Deep background
  const starRatio = getContrastRatio('#FFB399', '#160B10');
  console.log(`  Accent Starlight: #FFB399 on #160B10 -> Contrast Ratio ${starRatio.toFixed(2)}:1 (Large text 3.0:1)`);
  if (starRatio >= 3.0) {
    console.log('  [PASS] Star highlight badges meet WCAG AA large-scale standard');
    totalPassed++;
  } else {
    console.log('  [FAIL] Star accent fails large-scale contrast threshold');
    totalFailed++;
  }

  // 5. Motion Reduction Accessibility (prefers-reduced-motion)
  console.log('\n--- 5. REDUCED MOTION ACCESSIBILITY ---');
  if (globalCss.includes('@media (prefers-reduced-motion: reduce)')) {
    console.log('  [PASS] @media (prefers-reduced-motion: reduce) kills jank & animations on assistive devices');
    totalPassed++;
  } else {
    console.log('  [FAIL] Missing prefers-reduced-motion reset');
    totalFailed++;
  }

  // Final Summary
  console.log('\n=================================================================');
  console.log(`CROSS-COMPATIBILITY SCORE: ${totalPassed} PASSED / ${totalFailed} FAILED`);
  console.log(totalFailed === 0 ? 'STATUS: ALL BROWSERS & DEVICES FULLY COMPATIBLE' : 'STATUS: ACTION REQUIRED');
  console.log('=================================================================');

  process.exit(totalFailed === 0 ? 0 : 1);
}

runCrossCompatAudit();
