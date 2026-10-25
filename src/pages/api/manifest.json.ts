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
import { MembersRepository } from '../../lib/db/repositories';

export const GET: APIRoute = async () => {
  const members = MembersRepository.getAll();

  return new Response(
    JSON.stringify({
      vessel: 'Callisto Deep Space Fleet & Research Cohort',
      totalRegisteredCrew: members.length,
      crew: members,
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
