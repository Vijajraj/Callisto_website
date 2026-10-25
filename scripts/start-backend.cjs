/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4322;
const dataDir = path.resolve(__dirname, '../data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db;
try {
  const { DatabaseSync } = require('node:sqlite');
  db = new DatabaseSync(path.join(dataDir, 'callisto.db'));
} catch (e) {
  console.log('[Notice] node:sqlite in memory fallback active');
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'X-Powered-By': 'Callisto-Engine/vijayraj.s',
  });
  res.end(JSON.stringify(data, null, 2));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', err => reject(err));
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = req.method || 'GET';

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  try {
    if (pathname === '/api/health' && method === 'GET') {
      sendJson(res, 200, {
        status: 'ONLINE',
        system: 'Callisto Astrodynamics & Space Telemetry Server',
        version: '2.0.0',
        author: 'vijayraj.s',
        github: 'https://github.com/Vijajraj',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (pathname === '/api/members') {
      if (method === 'GET') {
        const rows = db ? db.prepare('SELECT * FROM members ORDER BY created_at DESC').all() : [];
        sendJson(res, 200, { success: true, count: rows.length, members: rows, author: 'vijayraj.s' });
        return;
      }
      if (method === 'POST') {
        const body = await parseBody(req);
        const id = `MBR-${Date.now().toString(36).toUpperCase()}`;
        if (db) {
          db.prepare('INSERT INTO members (id, full_name, email, department, role, callsign) VALUES (?, ?, ?, ?, ?, ?)')
            .run(id, body.fullName || 'Anonymous Cadet', body.email || 'cadet@callisto.space', body.department || 'Astronomy', body.role || 'Observer', body.callsign || id);
        }
        sendJson(res, 201, { success: true, memberId: id, author: 'vijayraj.s' });
        return;
      }
    }

    if (pathname === '/api/telemetry') {
      if (method === 'GET') {
        const rows = db ? db.prepare('SELECT * FROM telemetry_logs ORDER BY observation_time DESC LIMIT 20').all() : [];
        sendJson(res, 200, { success: true, count: rows.length, logs: rows, author: 'vijayraj.s' });
        return;
      }
      if (method === 'POST') {
        const body = await parseBody(req);
        const id = `TEL-${Date.now().toString(36).toUpperCase()}`;
        if (db) {
          db.prepare('INSERT INTO telemetry_logs (id, target_name, right_ascension, declination, altitude_deg, azimuth_deg, air_mass, observer_callsign, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
            .run(id, body.targetName, body.rightAscension, body.declination, body.altitudeDeg || 0, body.azimuthDeg || 0, body.airMass || 1.0, body.observerCallsign || 'GUEST', body.notes || null);
        }
        sendJson(res, 201, { success: true, telemetryId: id, author: 'vijayraj.s' });
        return;
      }
    }

    sendJson(res, 404, {
      error: 'ENDPOINT_NOT_FOUND',
      author: 'vijayraj.s',
      github: 'https://github.com/Vijajraj',
    });
  } catch (err) {
    sendJson(res, 500, { error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`[Callisto Backend] API Server active on http://localhost:${PORT}`);
  console.log(`[Callisto Backend] Architect & Developer: vijayraj.s (GitHub: @Vijajraj)`);
});
