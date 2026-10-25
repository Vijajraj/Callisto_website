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

import { db } from './index';
import type { DbMember, DbTelemetryLog, DbFlightPass, DbContactInquiry } from '../../types';

export const MembersRepository = {
  getAll(): DbMember[] {
    return db.query<DbMember>('SELECT id, full_name as fullName, email, department, role, callsign, status, created_at as createdAt FROM members ORDER BY created_at DESC');
  },

  create(member: Omit<DbMember, 'id' | 'createdAt' | 'status'> & { id?: string }): DbMember {
    const id = member.id || `CALLISTO-MBR-${Date.now().toString(36).toUpperCase()}`;
    const createdAt = new Date().toISOString();
    const status: DbMember['status'] = 'ACTIVE';

    db.execute(
      `INSERT INTO members (id, full_name, email, department, role, callsign, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, member.fullName, member.email, member.department, member.role, member.callsign, status, createdAt]
    );

    return {
      id,
      fullName: member.fullName,
      email: member.email,
      department: member.department,
      role: member.role,
      callsign: member.callsign,
      status,
      createdAt,
    };
  },

  findByEmail(email: string): DbMember | null {
    const rows = db.query<DbMember>(
      'SELECT id, full_name as fullName, email, department, role, callsign, status, created_at as createdAt FROM members WHERE email = ? LIMIT 1',
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  },
};

export const TelemetryRepository = {
  getRecent(limit = 20): DbTelemetryLog[] {
    return db.query<DbTelemetryLog>(
      `SELECT id, target_name as targetName, right_ascension as rightAscension, declination,
              altitude_deg as altitudeDeg, azimuth_deg as azimuthDeg, air_mass as airMass,
              observer_callsign as observerCallsign, observation_time as observationTime, notes
       FROM telemetry_logs ORDER BY observation_time DESC LIMIT ?`,
      [limit]
    );
  },

  log(entry: Omit<DbTelemetryLog, 'id' | 'observationTime'>): DbTelemetryLog {
    const id = `TEL-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
    const observationTime = new Date().toISOString();

    db.execute(
      `INSERT INTO telemetry_logs (id, target_name, right_ascension, declination, altitude_deg, azimuth_deg, air_mass, observer_callsign, observation_time, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        entry.targetName,
        entry.rightAscension,
        entry.declination,
        entry.altitudeDeg,
        entry.azimuthDeg,
        entry.airMass,
        entry.observerCallsign,
        entry.observationTime || observationTime,
        entry.notes || null,
      ]
    );

    return {
      id,
      ...entry,
      observationTime,
    };
  },
};

export const FlightPassRepository = {
  issue(pass: Omit<DbFlightPass, 'id' | 'issuedAt'>): DbFlightPass {
    const id = `PASS-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 8999 + 1000)}`;
    const issuedAt = new Date().toISOString();

    db.execute(
      `INSERT INTO flight_passes (id, callsign, rank, specialization, vessel, qr_signature, issued_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, pass.callsign, pass.rank, pass.specialization, pass.vessel, pass.qrSignature, issuedAt]
    );

    return {
      id,
      ...pass,
      issuedAt,
    };
  },

  verify(qrSignature: string): DbFlightPass | null {
    const rows = db.query<DbFlightPass>(
      `SELECT id, callsign, rank, specialization, vessel, qr_signature as qrSignature, issued_at as issuedAt
       FROM flight_passes WHERE qr_signature = ? OR id = ? LIMIT 1`,
      [qrSignature, qrSignature]
    );
    return rows.length > 0 ? rows[0] : null;
  },
};

export const ContactRepository = {
  create(inquiry: Omit<DbContactInquiry, 'id' | 'createdAt' | 'status'>): DbContactInquiry {
    const id = `COMMS-${Date.now().toString(36).toUpperCase()}`;
    const createdAt = new Date().toISOString();
    const status: DbContactInquiry['status'] = 'UNREAD';

    db.execute(
      `INSERT INTO contact_inquiries (id, name, email, subject, message, priority, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, inquiry.name, inquiry.email, inquiry.subject, inquiry.message, inquiry.priority, status, createdAt]
    );

    return {
      id,
      ...inquiry,
      status,
      createdAt,
    };
  },

  getAll(): DbContactInquiry[] {
    return db.query<DbContactInquiry>(
      'SELECT id, name, email, subject, message, priority, status, created_at as createdAt FROM contact_inquiries ORDER BY created_at DESC'
    );
  },
};
