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
const zlib = require('zlib');

console.log('=== PILLAR 3: PERFORMANCE TESTING ===\n');

const distDir = 'c:/projects/callisto/dist';
const astroAssetsDir = path.join(distDir, '_astro');
const iconsDir = 'c:/projects/callisto/public/icons';
const nasaDir = 'c:/projects/callisto/public/nasa';

let perfWarnings = 0;

// 1. JavaScript Bundle Analysis
console.log('--- JavaScript Bundle Budget Audit ---');
if (fs.existsSync(astroAssetsDir)) {
  const jsFiles = fs.readdirSync(astroAssetsDir).filter(f => f.endsWith('.js'));
  let totalJsRaw = 0;
  let totalJsGzip = 0;

  jsFiles.forEach(f => {
    const raw = fs.readFileSync(path.join(astroAssetsDir, f));
    const gzipped = zlib.gzipSync(raw);
    totalJsRaw += raw.length;
    totalJsGzip += gzipped.length;
    const rawKb = (raw.length / 1024).toFixed(1);
    const gzKb = (gzipped.length / 1024).toFixed(1);

    // Island budget check: each single island < 60KB raw or < 15KB gzip
    if (!f.startsWith('client.') && raw.length > 60 * 1024) {
      console.warn(`[WARN] Large chunk: ${f} (${rawKb} KB raw / ${gzKb} KB gzip)`);
      perfWarnings++;
    } else {
      console.log(`[PASS] Bundle: ${f.padEnd(45)} ${rawKb.padStart(6)} KB raw │ ${gzKb.padStart(5)} KB gzip`);
    }
  });

  console.log(`\nTotal Client JS: ${(totalJsRaw / 1024).toFixed(1)} KB raw │ ${(totalJsGzip / 1024).toFixed(1)} KB gzip`);
}

// 2. Icon & Image Payload Audit
console.log('\n--- Icon & Image Payload Audit ---');
const iconFiles = fs.readdirSync(iconsDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
let maxIconSize = 0;
let totalIconSize = 0;

iconFiles.forEach(f => {
  const stat = fs.statSync(path.join(iconsDir, f));
  totalIconSize += stat.size;
  if (stat.size > maxIconSize) maxIconSize = stat.size;
  if (stat.size > 25 * 1024) {
    console.warn(`[WARN] Large icon: ${f} (${(stat.size / 1024).toFixed(1)} KB)`);
    perfWarnings++;
  }
});
console.log(`[PASS] ${iconFiles.length} icons scanned. Total size: ${(totalIconSize / 1024).toFixed(1)} KB (Avg: ${(totalIconSize / iconFiles.length / 1024).toFixed(1)} KB, Max: ${(maxIconSize / 1024).toFixed(1)} KB)`);

// 3. Vector Space Assets Audit
console.log('\n--- NASA / Cosmic Vector Assets Audit ---');
const nasaFiles = fs.readdirSync(nasaDir).filter(f => f.endsWith('.svg'));
let totalNasaSize = 0;
nasaFiles.forEach(f => {
  const stat = fs.statSync(path.join(nasaDir, f));
  totalNasaSize += stat.size;
  console.log(`[PASS] SVG Asset: ${f.padEnd(25)} ${(stat.size / 1024).toFixed(1)} KB`);
});
console.log(`[PASS] ${nasaFiles.length} deep space vector assets total: ${(totalNasaSize / 1024).toFixed(1)} KB (100% offline-ready, 0 API latency)`);

// 4. HTML Static Page Footprint Audit
console.log('\n--- Static Page HTML Footprint Audit ---');
function scanHtml(dir) {
  let list = [];
  const entries = fs.readdirSync(dir);
  for (const e of entries) {
    const full = path.join(dir, e);
    const s = fs.statSync(full);
    if (s.isDirectory()) {
      list = list.concat(scanHtml(full));
    } else if (e.endsWith('.html')) {
      list.push({ path: path.relative(distDir, full), size: s.size });
    }
  }
  return list;
}

const htmlPages = scanHtml(distDir);
htmlPages.forEach(p => {
  const kb = (p.size / 1024).toFixed(1);
  if (p.size > 150 * 1024) {
    console.warn(`[WARN] Large HTML page: ${p.path} (${kb} KB)`);
    perfWarnings++;
  } else {
    console.log(`[PASS] Page: ${p.path.padEnd(35)} ${kb.padStart(6)} KB`);
  }
});

console.log(`\nPerformance testing complete: ${perfWarnings === 0 ? 'ALL BENCHMARKS SATISFIED' : `${perfWarnings} WARNINGS`}`);
