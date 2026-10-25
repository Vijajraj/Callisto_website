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

import type { APIRoute } from 'astro';
import { db } from '../../lib/db';

export const GET: APIRoute = async () => {
  const dbStatus = db.getStatus();

  return new Response(
    JSON.stringify({
      status: 'ONLINE',
      system: 'Callisto Astrodynamics & Space Telemetry Engine',
      version: '2.0.0',
      database: dbStatus,
      author: 'vijayraj.s',
      github: 'https://github.com/Vijajraj',
      timestamp: new Date().toISOString(),
    }, null, 2),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Powered-By': 'Callisto-Engine/vijayraj.s',
      },
    }
  );
};
