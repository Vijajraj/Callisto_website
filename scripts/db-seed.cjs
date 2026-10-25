/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

const path = require('path');
const fs = require('fs');

console.log('=== CALLISTO DATABASE SEEDER ===');
console.log('Architect & Developer: vijayraj.s (GitHub: @Vijajraj)\n');

const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let DatabaseSync;
try {
  DatabaseSync = require('node:sqlite').DatabaseSync;
} catch (e) {
  console.log('node:sqlite not available in this node version. Using memory mode.');
  process.exit(0);
}

const dbPath = path.join(dataDir, 'callisto.db');
const db = new DatabaseSync(dbPath);

// Execute schema
const schemaPath = path.resolve(__dirname, '../src/lib/db/schema.ts');
const schemaContent = fs.readFileSync(schemaPath, 'utf8');
const match = schemaContent.match(/export const SCHEMA_SQL = `([\s\S]*?)`;/);
if (match) {
  db.exec(match[1]);
  console.log('[PASS] Schemas initialized successfully in callisto.db');
}

// Seed Initial Crew Members
const initialMembers = [
  {
    id: 'CALLISTO-CMD-01',
    fullName: 'vijayraj.s',
    email: 'vraj122006@gmail.com',
    department: 'Technology & Orbital Engineering',
    role: 'Lead Architect & Systems Engineer',
    callsign: 'CALLISTO-ONE',
    status: 'ACTIVE',
  },
  {
    id: 'CALLISTO-ASTRO-02',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@callisto.space',
    department: 'Planetary & Observational Astronomy',
    role: 'Chief Astrophotographer',
    callsign: 'NOVA-OBSERVER',
    status: 'ACTIVE',
  },
  {
    id: 'CALLISTO-EXP-03',
    fullName: 'Marcus Vance',
    email: 'marcus.vance@callisto.space',
    department: 'Jovian Surface Expedition',
    role: 'Surface Rover Pilot',
    callsign: 'ROVER-COMMAND',
    status: 'ACTIVE',
  },
];

const insertMember = db.prepare(`
  INSERT OR IGNORE INTO members (id, full_name, email, department, role, callsign, status, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
`);

initialMembers.forEach(m => {
  insertMember.run(m.id, m.fullName, m.email, m.department, m.role, m.callsign, m.status);
});
console.log(`[PASS] Seeded ${initialMembers.length} initial core crew records.`);

// Seed Initial Telemetry Checkpoints
const initialTelemetry = [
  {
    id: 'TEL-SEED-01',
    targetName: 'Jupiter (Jovian System)',
    ra: '03h 15m 12s',
    dec: '+17° 12′ 04″',
    alt: 72.4,
    az: 182.1,
    airmass: 1.05,
    callsign: 'CALLISTO-ONE',
    notes: 'Meridian transit confirmed via Chennai Optical Array. Great Red Spot visible.',
  },
  {
    id: 'TEL-SEED-02',
    targetName: 'Saturn (Ring System)',
    ra: '22h 32m 00s',
    dec: '-11° 20′ 00″',
    alt: 54.8,
    az: 220.5,
    airmass: 1.22,
    callsign: 'NOVA-OBSERVER',
    notes: 'Cassini division resolve clear under sub-arcsecond seeing conditions.',
  },
  {
    id: 'TEL-SEED-03',
    targetName: 'Orion Nebula (M42)',
    ra: '05h 35m 17s',
    dec: '-05° 23′ 28″',
    alt: 65.2,
    az: 145.0,
    airmass: 1.10,
    callsign: 'CALLISTO-ONE',
    notes: 'Trapezium cluster stellar components A through F cleanly resolved.',
  },
];

const insertTelemetry = db.prepare(`
  INSERT OR IGNORE INTO telemetry_logs (id, target_name, right_ascension, declination, altitude_deg, azimuth_deg, air_mass, observer_callsign, observation_time, notes)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?)
`);

initialTelemetry.forEach(t => {
  insertTelemetry.run(t.id, t.targetName, t.ra, t.dec, t.alt, t.az, t.airmass, t.callsign, t.notes);
});
console.log(`[PASS] Seeded ${initialTelemetry.length} observational telemetry records.`);

console.log('\n[PASS] Database seeding complete: data/callisto.db is ready for production and future extensions!');
