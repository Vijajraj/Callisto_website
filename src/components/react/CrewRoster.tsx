/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

import React, { useState, useMemo } from 'react';
import type { CrewOfficer } from '../../data/departments';

interface CrewRosterProps {
  initialOfficers: CrewOfficer[];
}

export default function CrewRoster({ initialOfficers }: CrewRosterProps): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const departmentsList = useMemo(() => {
    const map = new Map<string, string>();
    initialOfficers.forEach((o) => {
      if (!map.has(o.departmentId)) {
        map.set(o.departmentId, o.departmentName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [initialOfficers]);

  const filteredOfficers = useMemo(() => {
    return initialOfficers.filter((officer) => {
      const matchesDept = selectedDept === 'all' || officer.departmentId === selectedDept;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        officer.name.toLowerCase().includes(query) ||
        officer.role.toLowerCase().includes(query) ||
        officer.departmentName.toLowerCase().includes(query) ||
        officer.themedName.toLowerCase().includes(query) ||
        officer.description.toLowerCase().includes(query);
      return matchesDept && matchesSearch;
    });
  }, [initialOfficers, selectedDept, searchQuery]);

  return (
    <section className="crew-roster-section" aria-label="Command Officers & Flight Leads Directory">
      <div className="roster-header-bar">
        <div>
          <div className="roster-telemetry-tag">PERSONNEL DOSSIER // CALLISTO FLIGHT WINGS</div>
          <h2 className="roster-heading">Command Officers & Flight Leads</h2>
          <p className="roster-subheading">
            Meet the researchers, developers, mission planners, and astrophotographers directing Callisto operations.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="roster-search-container">
          <label htmlFor="officer-search" className="sr-only">Search officers</label>
          <div className="search-input-wrapper">
            <svg
              className="search-icon"
              viewBox="0 0 20 20"
              width="16"
              height="16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <input
              id="officer-search"
              type="text"
              className="roster-search-input"
              placeholder="Search by name, role, wing, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Filter officers by keyword"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search input"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Department Filter Chips */}
      <div className="roster-filter-row" role="tablist" aria-label="Filter by department wing">
        <button
          type="button"
          role="tab"
          aria-selected={selectedDept === 'all'}
          className={`filter-chip ${selectedDept === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedDept('all')}
        >
          All Officers ({initialOfficers.length})
        </button>
        {departmentsList.map((dept) => (
          <button
            key={dept.id}
            type="button"
            role="tab"
            aria-selected={selectedDept === dept.id}
            className={`filter-chip ${selectedDept === dept.id ? 'active' : ''}`}
            onClick={() => setSelectedDept(dept.id)}
          >
            {dept.name}
          </button>
        ))}
      </div>

      {/* Officers Grid */}
      {filteredOfficers.length > 0 ? (
        <div className="officers-grid" role="list">
          {filteredOfficers.map((officer) => (
            <article key={officer.id} className="officer-card" role="listitem">
              <div className="card-top-row">
                <div className="officer-avatar-box">
                  <img
                    src={officer.avatar}
                    alt={`${officer.name} profile portrait`}
                    width="72"
                    height="72"
                    className="officer-avatar-img"
                    loading="lazy"
                  />
                  <div className="avatar-status-pip" title="Active Duty" aria-hidden="true" />
                </div>

                <div className="officer-badges">
                  <span className="wing-badge">{officer.themedName}</span>
                </div>
              </div>

              <div className="officer-content">
                <h3 className="officer-name">{officer.name}</h3>
                <div className="officer-role-row">
                  <span className="officer-role">{officer.role}</span>
                  <span className="dot-sep" aria-hidden="true">•</span>
                  <span className="officer-dept">{officer.departmentName}</span>
                </div>

                <p className="officer-desc">{officer.description}</p>
              </div>

              <div className="officer-footer">
                <div className="social-links-row" aria-label={`Connect with ${officer.name}`}>
                  {officer.socialLinks.github && (
                    <a
                      href={officer.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-btn"
                      aria-label={`${officer.name} on GitHub`}
                      title="GitHub"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </a>
                  )}
                  {officer.socialLinks.linkedin && (
                    <a
                      href={officer.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-btn"
                      aria-label={`${officer.name} on LinkedIn`}
                      title="LinkedIn"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  )}
                  {officer.socialLinks.comms && (
                    <a
                      href={officer.socialLinks.comms}
                      className="social-btn"
                      aria-label={`Send communication to ${officer.name}`}
                      title="Transmit Comms"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
                      </svg>
                    </a>
                  )}
                </div>

                <a href={`/crew/${officer.departmentId}`} className="dept-station-link">
                  <span>Visit Station</span>
                  <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="no-results-panel">
          <p className="no-results-title">No officers found matching "{searchQuery}"</p>
          <p className="no-results-desc">Try clearing your search query or choosing another department wing.</p>
          <button
            type="button"
            className="reset-search-btn"
            onClick={() => {
              setSearchQuery('');
              setSelectedDept('all');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      <style>{`
        .crew-roster-section {
          margin-top: var(--space-3xl);
          margin-bottom: var(--space-3xl);
        }

        .roster-header-bar {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
        }

        @media (min-width: 768px) {
          .roster-header-bar {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
          }
        }

        .roster-telemetry-tag {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--astrophage);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: var(--space-xs);
        }

        .roster-heading {
          font-family: var(--font-display);
          font-size: var(--text-3xl);
          font-weight: 700;
          color: var(--moon);
          margin: 0 0 var(--space-xs);
        }

        .roster-subheading {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          color: var(--steel);
          margin: 0;
          max-width: 580px;
          line-height: 1.5;
        }

        .roster-search-container {
          min-width: 0;
          width: 100%;
          max-width: 100%;
        }

        @media (min-width: 768px) {
          .roster-search-container {
            width: 320px;
          }
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--steel);
          pointer-events: none;
        }

        .roster-search-input {
          width: 100%;
          padding: 10px 36px 10px 36px;
          background: var(--deep);
          border: 1px solid var(--dusk);
          border-radius: var(--radius-md);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--moon);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .roster-search-input:focus {
          outline: none;
          border-color: var(--astrophage);
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--astrophage) 25%, transparent);
        }

        .clear-search-btn {
          position: absolute;
          right: 10px;
          background: transparent;
          border: none;
          color: var(--steel);
          cursor: pointer;
          font-size: 12px;
          padding: 4px;
        }

        .roster-filter-row {
          display: flex;
          gap: var(--space-xs);
          overflow-x: auto;
          padding-bottom: var(--space-sm);
          margin-bottom: var(--space-xl);
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
        }

        .filter-chip {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          padding: 6px 14px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.04em;
          border-radius: var(--radius-full);
          border: 1px solid var(--dusk);
          background: var(--deep);
          color: var(--steel);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-chip:hover {
          color: var(--moon);
          border-color: var(--steel);
        }

        .filter-chip.active {
          background: var(--moon);
          color: var(--void);
          border-color: var(--moon);
          font-weight: 700;
        }

        .officers-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-lg);
        }

        @media (min-width: 640px) {
          .officers-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .officers-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .officer-card {
          background: var(--deep);
          border: 1px solid var(--dusk);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .officer-card:hover {
          transform: translateY(-2px);
          border-color: color-mix(in srgb, var(--astrophage) 50%, var(--dusk));
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }

        html.light-mode .officer-card:hover,
        html[data-theme="light"] .officer-card:hover,
        html[data-theme="solar-flare"] .officer-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .card-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-md);
        }

        .officer-avatar-box {
          position: relative;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .officer-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: block;
          object-fit: cover;
        }

        .avatar-status-pip {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #10B981;
          border: 2px solid var(--void);
        }

        .officer-badges {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .wing-badge {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--steel);
          background: color-mix(in srgb, var(--steel) 10%, transparent);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }

        .officer-content {
          margin-bottom: var(--space-md);
        }

        .officer-name {
          font-family: var(--font-display);
          font-size: var(--text-xl);
          font-weight: 700;
          color: var(--moon);
          margin: 0 0 4px;
          line-height: 1.2;
        }

        .officer-role-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--steel);
          margin-bottom: var(--space-sm);
        }

        .officer-role {
          color: var(--moon);
          font-weight: 600;
        }

        .dot-sep {
          opacity: 0.5;
        }

        .officer-desc {
          font-family: var(--font-body);
          font-size: var(--text-xs);
          color: var(--steel);
          line-height: 1.5;
          margin: 0;
        }

        .officer-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--space-sm);
          border-top: 1px solid var(--dusk);
          margin-top: auto;
        }

        .social-links-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .social-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          background: color-mix(in srgb, var(--steel) 12%, transparent);
          color: var(--steel);
          transition: all 0.2s ease;
        }

        .social-btn:hover {
          background: var(--astrophage);
          color: #000000;
          transform: translateY(-1px);
        }

        .dept-station-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--moon);
          text-decoration: none;
          font-weight: 600;
          transition: gap 0.2s ease;
        }

        .dept-station-link:hover {
          color: var(--astrophage);
          gap: 6px;
        }

        .no-results-panel {
          text-align: center;
          padding: var(--space-2xl) var(--space-md);
          background: var(--deep);
          border: 1px dashed var(--dusk);
          border-radius: var(--radius-lg);
        }

        .no-results-title {
          font-family: var(--font-display);
          font-size: var(--text-lg);
          color: var(--moon);
          margin: 0 0 var(--space-xs);
        }

        .no-results-desc {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          color: var(--steel);
          margin: 0 0 var(--space-md);
        }

        .reset-search-btn {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          padding: 8px 16px;
          background: var(--moon);
          color: var(--void);
          border: none;
          border-radius: var(--radius-md);
          font-weight: 700;
          cursor: pointer;
        }

        @media (max-width: 640px) {
          .crew-roster-section {
            margin-top: var(--space-xl);
            margin-bottom: var(--space-xl);
            width: 100%;
            overflow-x: hidden;
          }
          .roster-header-bar {
            gap: var(--space-sm);
          }
          .roster-heading {
            font-size: var(--text-2xl);
          }
          .roster-search-container {
            min-width: 0 !important;
            width: 100% !important;
          }
          .officers-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
            width: 100%;
          }
          .officer-card {
            padding: 1.15rem 1rem;
            min-width: 0;
            width: 100%;
            box-sizing: border-box;
          }
          .officer-avatar-box {
            width: 60px;
            height: 60px;
          }
          .officer-name {
            font-size: 1.25rem;
            word-break: break-word;
          }
          .wing-badge {
            font-size: 9px;
            padding: 2px 6px;
            white-space: normal;
            text-align: right;
            max-width: 140px;
            word-break: break-word;
          }
          .officer-footer {
            flex-wrap: wrap;
            gap: 0.5rem;
          }
        }
      `}</style>
    </section>
  );
}
