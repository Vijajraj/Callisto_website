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

export const SCHEMA_SQL = `
-- 1. Members and Crew Registry
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  role TEXT NOT NULL,
  callsign TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'PENDING',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Astrodynamic Telemetry Logs
CREATE TABLE IF NOT EXISTS telemetry_logs (
  id TEXT PRIMARY KEY,
  target_name TEXT NOT NULL,
  right_ascension TEXT NOT NULL,
  declination TEXT NOT NULL,
  altitude_deg REAL NOT NULL,
  azimuth_deg REAL NOT NULL,
  air_mass REAL NOT NULL,
  observer_callsign TEXT NOT NULL,
  observation_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);

-- 3. Verified Flight Credentials / Expedition Passes
CREATE TABLE IF NOT EXISTS flight_passes (
  id TEXT PRIMARY KEY,
  callsign TEXT NOT NULL,
  rank TEXT NOT NULL,
  specialization TEXT NOT NULL,
  vessel TEXT NOT NULL,
  qr_signature TEXT NOT NULL,
  issued_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Comms & Contact Inquiries
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'NORMAL',
  status TEXT DEFAULT 'UNREAD',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Celestial Events RSVP
CREATE TABLE IF NOT EXISTS events_rsvp (
  id TEXT PRIMARY KEY,
  event_slug TEXT NOT NULL,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  status TEXT DEFAULT 'CONFIRMED',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indices for instant query lookups
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_callsign ON members(callsign);
CREATE INDEX IF NOT EXISTS idx_telemetry_target ON telemetry_logs(target_name);
CREATE INDEX IF NOT EXISTS idx_telemetry_time ON telemetry_logs(observation_time);
CREATE INDEX IF NOT EXISTS idx_flight_passes_callsign ON flight_passes(callsign);
`;
