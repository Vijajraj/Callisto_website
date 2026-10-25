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

console.log('=== WATERMARK INJECTION SUITE ===');
console.log('Target Author: vijayraj.s | GitHub: @Vijajraj\n');

const WATERMARK_COMMENT = `/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */\n\n`;

function walkDir(dir, exts) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== '.git' && item !== '.astro' && item !== 'dist') {
        results = results.concat(walkDir(full, exts));
      }
    } else {
      if (exts.some(ext => item.endsWith(ext))) {
        results.push(full);
      }
    }
  }
  return results;
}

const files = [
  ...walkDir('c:/projects/callisto/src', ['.ts', '.tsx', '.astro', '.css']),
  ...walkDir('c:/projects/callisto/scripts', ['.cjs', '.js']),
  'c:/projects/callisto/astro.config.mjs',
];

let injectedCount = 0;
let alreadyPresentCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Check if watermark already present
  if (content.includes('vijayraj.s') && content.includes('@Vijajraj')) {
    alreadyPresentCount++;
    continue;
  }

  if (file.endsWith('.astro')) {
    if (content.startsWith('---')) {
      // Inject inside frontmatter
      content = content.replace(/^---\r?\n/, `---\n${WATERMARK_COMMENT}`);
    } else {
      content = `---\n${WATERMARK_COMMENT}---\n` + content;
    }
  } else {
    // Standard JS/TS/CSS header
    content = WATERMARK_COMMENT + content;
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`[INJECTED] ${path.relative('c:/projects/callisto', file)}`);
  injectedCount++;
}

console.log(`\nWatermark injection summary:`);
console.log(`- Injected in ${injectedCount} files.`);
console.log(`- Already present in ${alreadyPresentCount} files.`);
console.log(`- Total files covered: ${injectedCount + alreadyPresentCount}`);
