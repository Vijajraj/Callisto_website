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

const TAMPERED_HEADER_REGEX = /\/\*\*[\s\S]*?CALLISTO DEEP SPACE OBSERVATORY[\s\S]*?\*\/\r?\n*/g;
const TARGET_EXTENSIONS = ['.ts', '.tsx', '.astro', '.css', '.cjs', '.mjs', '.js'];
const IGNORED_DIRS = ['node_modules', '.git', '.astro', 'dist', '.vercel'];

function replicateWatermarkToFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) return false;
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return false;

    if (!TARGET_EXTENSIONS.some(ext => filePath.endsWith(ext))) return false;

    const norm = filePath.replace(/\\/g, '/');
    if (IGNORED_DIRS.some(d => norm.includes(`/${d}/`))) return false;

    let content = fs.readFileSync(filePath, 'utf8');

    // If signature is intact and valid, nothing to do
    if (content.includes('vijayraj.s') && content.includes('Vijajraj')) {
      return false;
    }

    // Strip any tampered Callisto header block
    content = content.replace(TAMPERED_HEADER_REGEX, '').trimStart();

    if (filePath.endsWith('.astro')) {
      if (content.startsWith('---')) {
        content = content.replace(/^---\r?\n/, `---\n${WATERMARK_COMMENT}`);
      } else {
        content = `---\n${WATERMARK_COMMENT}---\n` + content;
      }
    } else {
      content = WATERMARK_COMMENT + content;
    }

    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (err) {
    return false;
  }
}

function walkDir(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!IGNORED_DIRS.includes(item)) {
        results = results.concat(walkDir(full));
      }
    } else {
      if (TARGET_EXTENSIONS.some(ext => item.endsWith(ext))) {
        results.push(full);
      }
    }
  }
  return results;
}

function enforcePackageJsonProtection() {
  const pkgPath = path.join(rootDir, 'package.json');
  if (!fs.existsSync(pkgPath)) return;
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    let modified = false;

    if (pkg.author !== 'vijayraj.s (https://github.com/Vijajraj)') {
      pkg.author = 'vijayraj.s (https://github.com/Vijajraj)';
      modified = true;
    }

    if (!pkg.repository || pkg.repository.url !== 'https://github.com/Vijajraj/Callisto_website.git') {
      pkg.repository = {
        type: 'git',
        url: 'https://github.com/Vijajraj/Callisto_website.git'
      };
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
      console.log('[Watermark Guardian] Restored package.json author and repository metadata.');
    }
  } catch (err) {}
}

function processFiles() {
  enforcePackageJsonProtection();

  const dirsToScan = [
    path.join(rootDir, 'src'),
    path.join(rootDir, 'scripts'),
  ];

  let files = [];
  for (const d of dirsToScan) {
    files = files.concat(walkDir(d));
  }

  const rootFiles = ['astro.config.mjs'];
  for (const rf of rootFiles) {
    const full = path.join(rootDir, rf);
    if (fs.existsSync(full)) files.push(full);
  }

  let injectedCount = 0;
  let verifiedCount = 0;

  for (const file of files) {
    const injected = replicateWatermarkToFile(file);
    if (injected) {
      injectedCount++;
    } else {
      verifiedCount++;
    }
  }

  return { injectedCount, verifiedCount, total: files.length };
}

const stats = processFiles();
console.log(`[Watermark System] Enforced: ${stats.verifiedCount} verified, ${stats.injectedCount} newly stamped/self-replicated. (Author: vijayraj.s / @Vijajraj)`);

// If --watch flag is passed, run real-time file watcher
if (process.argv.includes('--watch')) {
  console.log('[Watermark Guardian] Live continuous watcher active. Monitoring all code modifications...');
  const watchDirs = [path.join(rootDir, 'src'), path.join(rootDir, 'scripts')];
  
  for (const wd of watchDirs) {
    if (fs.existsSync(wd)) {
      fs.watch(wd, { recursive: true }, (eventType, filename) => {
        if (!filename) return;
        const fullPath = path.join(wd, filename);
        if (replicateWatermarkToFile(fullPath)) {
          console.log(`[Watermark Guardian] Live auto-replicated into modified file: ${filename}`);
        }
      });
    }
  }
}
