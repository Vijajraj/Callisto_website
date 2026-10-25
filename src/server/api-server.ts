/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

import http from 'node:http';
import { db } from '../lib/db';
import {
  MembersRepository,
  TelemetryRepository,
  FlightPassRepository,
  ContactRepository,
} from '../lib/db/repositories';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4322;

function sendJson(res: http.ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'X-Powered-By': 'Callisto-Engine/vijayraj.s',
  });
  res.end(JSON.stringify(data, null, 2));
}

function parseBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', (err) => reject(err));
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = req.method || 'GET';

  // Handle CORS preflight
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
    // 1. Healthcheck Route
    if (pathname === '/api/health' && method === 'GET') {
      sendJson(res, 200, {
        status: 'ONLINE',
        system: 'Callisto Astrodynamics & Space Telemetry Server',
        version: '2.0.0',
        author: 'vijayraj.s',
        github: 'https://github.com/Vijajraj',
        database: db.getStatus(),
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // 2. Members / Crew Route
    if (pathname === '/api/members') {
      if (method === 'GET') {
        const members = MembersRepository.getAll();
        sendJson(res, 200, {
          success: true,
          count: members.length,
          members,
          author: 'vijayraj.s',
        });
        return;
      }

      if (method === 'POST') {
        const body = await parseBody(req);
        if (!body.fullName || !body.email || !body.department) {
          sendJson(res, 400, { success: false, error: 'Missing required member fields.' });
          return;
        }

        const newMember = MembersRepository.create({
          fullName: body.fullName,
          email: body.email,
          department: body.department,
          role: body.role || 'Cadet Observer',
          callsign: body.callsign || `CALL-${Math.floor(Math.random() * 899 + 100)}`,
        });

        sendJson(res, 201, { success: true, member: newMember, author: 'vijayraj.s' });
        return;
      }
    }

    // 3. Telemetry Logs Route
    if (pathname === '/api/telemetry') {
      if (method === 'GET') {
        const limit = parseInt(url.searchParams.get('limit') || '20', 10);
        const logs = TelemetryRepository.getRecent(limit);
        sendJson(res, 200, {
          success: true,
          count: logs.length,
          logs,
          author: 'vijayraj.s',
        });
        return;
      }

      if (method === 'POST') {
        const body = await parseBody(req);
        if (!body.targetName || !body.rightAscension || !body.declination) {
          sendJson(res, 400, { success: false, error: 'Incomplete coordinates for telemetry entry.' });
          return;
        }

        const logEntry = TelemetryRepository.log({
          targetName: body.targetName,
          rightAscension: body.rightAscension,
          declination: body.declination,
          altitudeDeg: parseFloat(body.altitudeDeg) || 0,
          azimuthDeg: parseFloat(body.azimuthDeg) || 0,
          airMass: parseFloat(body.airMass) || 1.0,
          observerCallsign: body.observerCallsign || 'GUEST-OBSERVER',
          notes: body.notes,
        });

        sendJson(res, 201, { success: true, telemetry: logEntry, author: 'vijayraj.s' });
        return;
      }
    }

    // 4. Flight Pass Verification & Issuance Route
    if (pathname === '/api/flight-pass') {
      if (method === 'POST') {
        const body = await parseBody(req);
        if (body.action === 'verify') {
          const pass = FlightPassRepository.verify(body.qrSignature);
          sendJson(res, 200, { success: !!pass, pass });
          return;
        }

        const issued = FlightPassRepository.issue({
          callsign: body.callsign || 'EXPLORER-01',
          rank: body.rank || 'Astrodynamicist',
          specialization: body.specialization || 'Planetary Science',
          vessel: body.vessel || 'Zephyr Surface Rover',
          qrSignature: body.qrSignature || `SIG-${Date.now().toString(36)}`,
        });

        sendJson(res, 201, { success: true, pass: issued, author: 'vijayraj.s' });
        return;
      }
    }

    // 5. Contact Inquiries Route
    if (pathname === '/api/contact' && method === 'POST') {
      const body = await parseBody(req);
      if (!body.name || !body.email || !body.message) {
        sendJson(res, 400, { success: false, error: 'Name, email, and message are required.' });
        return;
      }

      const inquiry = ContactRepository.create({
        name: body.name,
        email: body.email,
        subject: body.subject || 'General Inquiry',
        message: body.message,
        priority: body.priority || 'NORMAL',
      });

      sendJson(res, 201, { success: true, inquiry, author: 'vijayraj.s' });
      return;
    }

    // Default 404 Route
    sendJson(res, 404, {
      error: 'ENDPOINT_NOT_FOUND',
      message: 'Unknown API sector trajectory.',
      author: 'vijayraj.s',
      github: 'https://github.com/Vijajraj',
    });
  } catch (err: any) {
    console.error('[API Server Error]', err);
    sendJson(res, 500, { error: 'INTERNAL_SERVER_ERROR', message: err.message });
  }
});

export function startServer(port = PORT) {
  server.listen(port, () => {
    console.log(`[Callisto Backend] API Server listening on http://localhost:${port}`);
    console.log(`[Callisto Backend] Architect & Developer: vijayraj.s (GitHub: @Vijajraj)`);
  });
}

// Auto-run if executed directly
if (require.main === module) {
  startServer();
}

export default server;
