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

const rootDir = path.resolve(__dirname, '..');

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
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== '.git' && item !== '.astro' && item !== 'dist' && item !== '.vercel') {
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

function processFiles() {
  const targetExtensions = ['.ts', '.tsx', '.astro', '.css', '.cjs', '.mjs', '.js'];
  const dirsToScan = [
    path.join(rootDir, 'src'),
    path.join(rootDir, 'scripts'),
  ];

  let files = [];
  for (const d of dirsToScan) {
    files = files.concat(walkDir(d, targetExtensions));
  }

  // Also include root config files
  const rootFiles = ['astro.config.mjs'];
  for (const rf of rootFiles) {
    const full = path.join(rootDir, rf);
    if (fs.existsSync(full)) files.push(full);
  }

  let injectedCount = 0;
  let alreadyPresentCount = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // Check if watermark signature already present
    if (content.includes('vijayraj.s') && content.includes('Vijajraj')) {
      alreadyPresentCount++;
      continue;
    }

    if (file.endsWith('.astro')) {
      if (content.startsWith('---')) {
        content = content.replace(/^---\r?\n/, `---\n${WATERMARK_COMMENT}`);
      } else {
        content = `---\n${WATERMARK_COMMENT}---\n` + content;
      }
    } else {
      content = WATERMARK_COMMENT + content;
    }

    fs.writeFileSync(file, content, 'utf8');
    injectedCount++;
  }

  return { injectedCount, alreadyPresentCount, total: files.length };
}

const stats = processFiles();

console.log(`[Watermark System] Enforced: ${stats.alreadyPresentCount} verified, ${stats.injectedCount} newly stamped. (Author: vijayraj.s / @Vijajraj)`);
