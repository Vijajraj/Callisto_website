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

import path from 'node:path';
import fs from 'node:fs';
import { SCHEMA_SQL } from './schema';

interface QueryResult<T = unknown> {
  rows: T[];
  changes?: number;
  lastInsertRowid?: number | bigint;
}

class CallistoDatabase {
  private db: any = null;
  private isMemoryFallback = false;
  private memoryStore: Map<string, any[]> = new Map();
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.initialized) return;

    try {
      // Check for node:sqlite DatabaseSync
      const { DatabaseSync } = require('node:sqlite');
      const dataDir = path.resolve(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const dbPath = path.join(dataDir, 'callisto.db');
      this.db = new DatabaseSync(dbPath);
      this.db.exec(SCHEMA_SQL);
      this.initialized = true;
    } catch {
      // Fallback for isolated environments or environments without node:sqlite
      this.isMemoryFallback = true;
      this.memoryStore.set('members', []);
      this.memoryStore.set('telemetry_logs', []);
      this.memoryStore.set('flight_passes', []);
      this.memoryStore.set('contact_inquiries', []);
      this.memoryStore.set('events_rsvp', []);
      this.initialized = true;
    }
  }

  public query<T = unknown>(sql: string, params: any[] = []): T[] {
    this.init();
    if (!this.isMemoryFallback && this.db) {
      try {
        const stmt = this.db.prepare(sql);
        return stmt.all(...params) as T[];
      } catch (err) {
        console.error('[DB Query Error]', err);
        return [];
      }
    }

    // In-Memory Simple Dispatch
    return this.fallbackQuery<T>(sql, params);
  }

  public execute(sql: string, params: any[] = []): QueryResult {
    this.init();
    if (!this.isMemoryFallback && this.db) {
      try {
        const stmt = this.db.prepare(sql);
        const info = stmt.run(...params);
        return {
          rows: [],
          changes: info.changes,
          lastInsertRowid: info.lastInsertRowid,
        };
      } catch (err) {
        console.error('[DB Execute Error]', err);
        return { rows: [], changes: 0 };
      }
    }

    return this.fallbackExecute(sql, params);
  }

  private fallbackQuery<T = unknown>(sql: string, _params: any[]): T[] {
    const lower = sql.toLowerCase();
    for (const table of ['members', 'telemetry_logs', 'flight_passes', 'contact_inquiries', 'events_rsvp']) {
      if (lower.includes(`from ${table}`)) {
        return (this.memoryStore.get(table) || []) as T[];
      }
    }
    return [];
  }

  private fallbackExecute(sql: string, params: any[]): QueryResult {
    const lower = sql.toLowerCase();
    for (const table of ['members', 'telemetry_logs', 'flight_passes', 'contact_inquiries', 'events_rsvp']) {
      if (lower.includes(`insert into ${table}`)) {
        const rows = this.memoryStore.get(table) || [];
        rows.push({ _record: params, createdAt: new Date().toISOString() });
        this.memoryStore.set(table, rows);
        return { rows: [], changes: 1 };
      }
    }
    return { rows: [], changes: 0 };
  }

  public getStatus() {
    return {
      status: 'ONLINE',
      mode: this.isMemoryFallback ? 'IN_MEMORY_ADAPTER' : 'NODE_SQLITE_PERSISTENT',
      database: 'callisto.db',
      architect: 'vijayraj.s',
      github: 'https://github.com/Vijajraj',
      timestamp: new Date().toISOString(),
    };
  }
}

export const db = new CallistoDatabase();
