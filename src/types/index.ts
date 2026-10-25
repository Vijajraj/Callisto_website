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

/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

// --- Database Models ---

export interface DbMember {
  id: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
  callsign: string;
  status: 'PENDING' | 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
}

export interface DbTelemetryLog {
  id: string;
  targetName: string;
  rightAscension: string;
  declination: string;
  altitudeDeg: number;
  azimuthDeg: number;
  airMass: number;
  observerCallsign: string;
  observationTime: string;
  notes?: string;
}

export interface DbFlightPass {
  id: string;
  callsign: string;
  rank: string;
  specialization: string;
  vessel: string;
  qrSignature: string;
  issuedAt: string;
}

export interface DbContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: 'LOW' | 'NORMAL' | 'URGENT';
  status: 'UNREAD' | 'READ' | 'RESOLVED';
  createdAt: string;
}

export interface DbEventRsvp {
  id: string;
  eventSlug: string;
  attendeeName: string;
  attendeeEmail: string;
  status: 'CONFIRMED' | 'WAITLIST';
  createdAt: string;
}

// --- Astronomical Models ---

export type CelestialCategory = 'planet' | 'nebula' | 'galaxy' | 'cluster' | 'double_star' | 'satellite';

export interface CelestialTarget {
  id: string;
  name: string;
  catalog: string;
  constellation: string;
  magnitude: number;
  category: CelestialCategory;
  categoryLabel: string;
  distanceLightYears?: number;
  fixedRaDeg?: number;
  fixedDecDeg?: number;
  epochCoords?: string;
  transitHoursChennai: number;
  bestHoursUTC: [number, number];
  apparentAltitudeDeg: number;
  azimuthDeg: number;
  airMass: number;
  compassHeading: string;
  visibilityStatus: 'SUPERB' | 'OBSERVABLE' | 'LOW_HORIZON' | 'BELOW_HORIZON';
  telescopicRecommendation: string;
  notes: string;
}

// --- Observatory Cosmic Feed ---

export interface CosmicDispatch {
  id: string;
  title: string;
  mission: string;
  instrument: string;
  category: 'jwst' | 'jovian' | 'deepsky';
  categoryLabel: string;
  date: string;
  distance: string;
  coordinates: string;
  spectralBand: string;
  explanation: string;
  url: string;
  hdurl: string;
  credit: string;
  citation: string;
  icon: string;
}

// --- API Response Wrapper ---

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  author: 'vijayraj.s';
  github: 'https://github.com/Vijajraj';
}
