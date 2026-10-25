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

console.log('=== PILLAR 5: SEO & METADATA AUDIT ===\n');

const distDir = 'c:/projects/callisto/dist';
let seoViolations = 0;

// 1. Robots.txt and Sitemap Verification
console.log('--- Search Engine Crawl Directives ---');
const robotsDist = path.join(distDir, 'robots.txt');
const sitemapDist = path.join(distDir, 'sitemap.xml');

if (fs.existsSync(robotsDist)) {
  const robotsTxt = fs.readFileSync(robotsDist, 'utf8');
  if (robotsTxt.includes('Sitemap:')) {
    console.log('[PASS] robots.txt present with valid Sitemap directive.');
  } else {
    console.warn('[WARN] robots.txt present but missing Sitemap link.');
  }
} else {
  console.error('[FAIL] robots.txt missing in dist');
  seoViolations++;
}

if (fs.existsSync(sitemapDist)) {
  const sitemapXml = fs.readFileSync(sitemapDist, 'utf8');
  const countUrls = (sitemapXml.match(/<loc>/g) || []).length;
  console.log(`[PASS] sitemap.xml present with ${countUrls} indexed URLs.`);
} else {
  console.error('[FAIL] sitemap.xml missing in dist');
  seoViolations++;
}

// 2. HTML Meta Tags Audit
console.log('\n--- HTML Open Graph, Twitter & Canonical Audit ---');
function scanHtml(dir) {
  let list = [];
  const entries = fs.readdirSync(dir);
  for (const e of entries) {
    const full = path.join(dir, e);
    const s = fs.statSync(full);
    if (s.isDirectory()) {
      list = list.concat(scanHtml(full));
    } else if (e.endsWith('.html')) {
      list.push(full);
    }
  }
  return list;
}

const htmlPages = scanHtml(distDir);
htmlPages.forEach(hp => {
  const rel = path.relative(distDir, hp);
  const content = fs.readFileSync(hp, 'utf8');

  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const hasCanonical = content.includes('rel="canonical"');
  const hasDesc = content.includes('name="description"');
  const hasOgTitle = content.includes('property="og:title"');
  const hasOgImage = content.includes('property="og:image"');
  const hasTwitter = content.includes('name="twitter:card"');

  const issues = [];
  if (!title) issues.push('missing <title>');
  if (!hasCanonical) issues.push('missing canonical');
  if (!hasDesc) issues.push('missing description');
  if (!hasOgTitle) issues.push('missing og:title');
  if (!hasOgImage) issues.push('missing og:image');
  if (!hasTwitter) issues.push('missing twitter:card');

  if (issues.length === 0) {
    console.log(`[PASS] ${rel.padEnd(32)} │ Title: "${title.slice(0, 35)}..."`);
  } else {
    console.error(`[FAIL] ${rel}: ${issues.join(', ')}`);
    seoViolations++;
  }
});

console.log(`\nSEO testing complete: ${seoViolations === 0 ? 'ALL METADATA CRITERIA PASSED' : `${seoViolations} ISSUES FOUND`}`);
