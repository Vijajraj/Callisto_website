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

// Exhaustive Unicode Emoji RegEx
const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.astro' && file !== 'dist') {
        results = results.concat(walk(fullPath));
      }
    } else if (/\.(astro|tsx|ts|jsx|js|html|md|css)$/.test(file)) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walk('c:/projects/callisto/src');
const matches = [];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const found = line.match(emojiRegex);
    if (found) {
      // Filter out standard typographic quotes, dashes, copyright if purely editorial, but flag actual emoji pictographs
      const pictographs = found.filter(ch => {
        const code = ch.codePointAt(0);
        // Exclude ordinary typography like en-dash, em-dash, smart quotes, bullets, arrows
        if (code >= 0x2010 && code <= 0x2026) return false; // dashes, quotes, ellipses
        if (code >= 0x2190 && code <= 0x21FF) return false; // arrows
        if (code === 0x2022 || code === 0x25cf || code === 0x25cb) return false; // bullets
        return true;
      });
      if (pictographs.length > 0) {
        matches.push({ file: path.relative('c:/projects/callisto', f), line: idx + 1, chars: pictographs.join(' '), text: line.trim() });
      }
    }
  });
}

console.log('Total emoji/pictograph occurrences found:', matches.length);
matches.forEach(m => console.log(`${m.file}:${m.line} [${m.chars}] -> ${m.text}`));
