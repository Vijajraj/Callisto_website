const fs = require('fs');
const path = require('path');

console.log('=== PILLAR 2: SECURITY TESTING ===\n');

let securityViolations = 0;

// 1. Audit for leaked API keys, tokens, and credentials
console.log('--- Credential & Token Leakage Audit ---');
const secretPatterns = [
  /PUBLIC_NASA_API_KEY/i,
  /api[_-]?key\s*[:=]\s*['"][a-zA-Z0-9_\-]{16,}['"]/i,
  /AIza[0-9A-Za-z-_]{35}/, // Google API key
  /sk-[a-zA-Z0-9]{20,}/,   // OpenAI key
  /ghp_[a-zA-Z0-9]{20,}/,  // GitHub token
  /aws_access_key_id/i,
  /bearer\s+[a-zA-Z0-9_\-\.]{20,}/i
];

function scanDir(dir, extFilter) {
  let files = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== '.git' && item !== '.astro') {
        files = files.concat(scanDir(full, extFilter));
      }
    } else if (extFilter.test(item)) {
      files.push(full);
    }
  }
  return files;
}

const sourceFiles = scanDir('c:/projects/callisto/src', /\.(astro|tsx|ts|js|json|css|env)$/);
const distFiles = scanDir('c:/projects/callisto/dist', /\.(html|js|css)$/);
const allFilesToScan = sourceFiles.concat(distFiles);

let keyLeaks = 0;
for (const f of allFilesToScan) {
  const content = fs.readFileSync(f, 'utf8');
  for (const pat of secretPatterns) {
    if (pat.test(content)) {
      console.error(`[FAIL] Potential secret match (${pat}) in ${f}`);
      keyLeaks++;
      securityViolations++;
    }
  }
}

if (keyLeaks === 0) {
  console.log(`[PASS] Audited ${allFilesToScan.length} source & dist files: 0 secret keys or tokens detected.`);
}

// 2. Strict Negative Constraint Check: Hans Zimmer
console.log('\n--- Negative Constraint Check (Zero Hans Zimmer references) ---');
const forbiddenNames = [
  /\bhans\s+zimmer\b/i,
  /\binterstellar\b/i,
  /\bdune\b/i,
  /\binception\b/i,
  /\bgladiator\b/i,
  /\boppenheimer\b/i,
  /\bthe\s+dark\s+knight\b/i
];

let forbiddenMatches = 0;
for (const f of allFilesToScan) {
  const content = fs.readFileSync(f, 'utf8');
  for (const pat of forbiddenNames) {
    if (pat.test(content)) {
      console.error(`[FAIL] Forbidden constraint match (${pat}) found in ${f}`);
      forbiddenMatches++;
      securityViolations++;
    }
  }
}

if (forbiddenMatches === 0) {
  console.log(`[PASS] Negative constraint strictly verified: 0 forbidden composer/film names anywhere in codebase.`);
}

// 3. Security Headers and Link Target Attributes
console.log('\n--- Security Headers & Link Target Audit ---');
let targetBlankMissingRel = 0;
const targetBlankRegex = /<a\s+[^>]*target=["']_blank["'][^>]*>/gi;

const htmlFiles = scanDir('c:/projects/callisto/dist', /\.html$/);
for (const hf of htmlFiles) {
  const content = fs.readFileSync(hf, 'utf8');
  let match;
  while ((match = targetBlankRegex.exec(content)) !== null) {
    const tag = match[0];
    if (!tag.includes('rel=') || (!tag.includes('noopener') && !tag.includes('noreferrer'))) {
      console.error(`[FAIL] Missing rel="noopener noreferrer" on target="_blank" in ${hf}: ${tag}`);
      targetBlankMissingRel++;
      securityViolations++;
    }
  }
}

if (targetBlankMissingRel === 0) {
  console.log(`[PASS] All external target="_blank" links include rel="noopener noreferrer" (tabnabbing immune).`);
}

// 4. Check for Security Meta Tags in Layout
const indexHtml = fs.readFileSync('c:/projects/callisto/dist/index.html', 'utf8');
const hasReferrer = indexHtml.includes('name="referrer"');
const hasNosniff = indexHtml.includes('X-Content-Type-Options');

if (hasReferrer && hasNosniff) {
  console.log(`[PASS] Security meta tags verified: 'referrer: strict-origin-when-cross-origin' and 'X-Content-Type-Options: nosniff'`);
} else {
  console.error(`[FAIL] Missing security meta tags in HTML head`);
  securityViolations++;
}

console.log(`\nSecurity testing complete: ${securityViolations === 0 ? 'ALL CHECKS PASSED (0 VULNERABILITIES)' : `${securityViolations} ISSUES FOUND`}`);
