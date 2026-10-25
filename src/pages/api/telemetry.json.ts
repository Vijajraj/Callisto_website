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
import { TelemetryRepository } from '../../lib/db/repositories';

export const GET: APIRoute = async () => {
  const recentLogs = TelemetryRepository.getRecent(20);

  return new Response(
    JSON.stringify({
      status: 'SYNCHRONOUS_TELEMETRY_ONLINE',
      station: 'Callisto Optical Array // Sector Chennai (13.0827°N, 80.2707°E)',
      totalLogs: recentLogs.length,
      logs: recentLogs,
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
