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

export interface CallistoEvent {
  slug: string;
  title: string;
  date: string; // ISO date string
  endDate?: string;
  description: string;
  longDescription: string;
  location: string;
  type: 'observation' | 'talk' | 'workshop' | 'hackathon' | 'social' | 'expedition';
  image?: string;
  speakers?: string[];
  capacity?: number;
  registrationOpen: boolean;
}

// Kept blank for user future events
export const events: CallistoEvent[] = [];

export function getUpcomingEvents(): CallistoEvent[] {
  return events.filter((e) => new Date(e.date).getTime() >= Date.now());
}

export function getPastEvents(): CallistoEvent[] {
  return events.filter((e) => new Date(e.date).getTime() < Date.now());
}

export function getEventBySlug(slug: string): CallistoEvent | undefined {
  return events.find((e) => e.slug === slug);
}
