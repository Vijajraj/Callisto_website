/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = __dirname;

const WATERMARK_HEADER = `/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */\n\n`;

const TAMPERED_HEADER_REGEX = /\/\*\*[\s\S]*?CALLISTO DEEP SPACE OBSERVATORY[\s\S]*?\*\/\r?\n*/g;
const TARGET_EXTS = ['.ts', '.tsx', '.astro', '.css', '.cjs', '.mjs', '.js'];
const IGNORE_PATTERNS = ['node_modules', '.git', '.astro', 'dist', '.vercel'];

function selfReplicateToFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) return false;
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return false;

    if (!TARGET_EXTS.some(ext => filePath.endsWith(ext))) return false;

    const norm = filePath.replace(/\\/g, '/');
    if (IGNORE_PATTERNS.some(d => norm.includes(`/${d}/`))) return false;

    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('vijayraj.s') && content.includes('Vijajraj')) {
      return false;
    }

    content = content.replace(TAMPERED_HEADER_REGEX, '').trimStart();

    if (filePath.endsWith('.astro')) {
      if (content.startsWith('---')) {
        content = content.replace(/^---\r?\n/, `---\n${WATERMARK_HEADER}`);
      } else {
        content = `---\n${WATERMARK_HEADER}---\n` + content;
      }
    } else {
      content = WATERMARK_HEADER + content;
    }

    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (err) {
    return false;
  }
}

function scanAndReplicateAll() {
  const dirs = [path.join(projectRoot, 'src'), path.join(projectRoot, 'scripts')];
  function walk(d) {
    if (!fs.existsSync(d)) return;
    for (const item of fs.readdirSync(d)) {
      const full = path.join(d, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        if (!IGNORE_PATTERNS.includes(item)) {
          walk(full);
        }
      } else {
        selfReplicateToFile(full);
      }
    }
  }
  for (const d of dirs) walk(d);
  selfReplicateToFile(path.join(projectRoot, 'astro.config.mjs'));
}

function callistoWatermarkGuardianPlugin() {
  return {
    name: 'vite-plugin-callisto-watermark-guardian',
    buildStart() {
      scanAndReplicateAll();
    },
    configureServer(server) {
      server.watcher.on('add', (filePath) => {
        selfReplicateToFile(filePath);
      });
      server.watcher.on('change', (filePath) => {
        selfReplicateToFile(filePath);
      });
    },
    transform(code, id) {
      const cleanId = id.split('?')[0];
      if (TARGET_EXTS.some(ext => cleanId.endsWith(ext))) {
        selfReplicateToFile(cleanId);
      }
      return null;
    }
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://callisto.pages.dev',
  output: 'static',
  redirects: {
    '/expedition': '/observatory',
    '/missions': '/events',
  },
  integrations: [
    react(),
  ],
  vite: {
    plugins: [
      callistoWatermarkGuardianPlugin(),
    ],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'nord',
      wrap: true,
    },
  },
});
