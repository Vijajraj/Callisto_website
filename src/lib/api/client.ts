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

import type { ApiResponse, DbMember, DbTelemetryLog, DbFlightPass } from '../../types';

export class CallistoApiClient {
  private baseUrl: string;

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  async getHealth(): Promise<{ status: string; database: any; author: string }> {
    const res = await fetch(`${this.baseUrl}/api/health.json`);
    if (!res.ok) throw new Error(`Healthcheck failed: ${res.statusText}`);
    return res.json();
  }

  async getTelemetry(): Promise<{ logs: DbTelemetryLog[]; totalLogs: number }> {
    const res = await fetch(`${this.baseUrl}/api/telemetry.json`);
    if (!res.ok) throw new Error(`Telemetry fetch failed: ${res.statusText}`);
    return res.json();
  }

  async getManifest(): Promise<{ crew: DbMember[]; totalRegisteredCrew: number }> {
    const res = await fetch(`${this.baseUrl}/api/manifest.json`);
    if (!res.ok) throw new Error(`Manifest fetch failed: ${res.statusText}`);
    return res.json();
  }

  async submitJoin(memberData: {
    fullName: string;
    email: string;
    department: string;
    role?: string;
    callsign?: string;
  }): Promise<ApiResponse<DbMember>> {
    // When live backend on port 4322 is running, dispatch to live API, else fallback gracefully
    try {
      const res = await fetch('http://localhost:4322/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
      });
      return res.json();
    } catch {
      return {
        success: true,
        data: {
          id: `OFFLINE-MBR-${Date.now().toString(36).toUpperCase()}`,
          ...memberData,
          role: memberData.role || 'Cadet',
          callsign: memberData.callsign || 'CALLISTO-RECRUIT',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
        author: 'vijayraj.s',
        github: 'https://github.com/Vijajraj',
      };
    }
  }

  async submitContact(inquiryData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<ApiResponse> {
    try {
      const res = await fetch('http://localhost:4322/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData),
      });
      return res.json();
    } catch {
      return {
        success: true,
        timestamp: new Date().toISOString(),
        author: 'vijayraj.s',
        github: 'https://github.com/Vijajraj',
      };
    }
  }

  async verifyFlightPass(qrSignature: string): Promise<DbFlightPass | null> {
    try {
      const res = await fetch('http://localhost:4322/api/flight-pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', qrSignature }),
      });
      const data = await res.json();
      return data.pass || null;
    } catch {
      return null;
    }
  }
}

export const apiClient = new CallistoApiClient();
