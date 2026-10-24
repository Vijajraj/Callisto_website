import React, { useState } from 'react';
import { playTelemetryBeep } from '../../lib/audio';

interface ClassifiedMission {
  code: string;
  title: string;
  phase: 'Active Orbit' | 'Hardware Lab' | 'Data Reduction';
  leadWing: string;
  securityLevel: string;
  confidentialData: string;
  publicSummary: string;
  accent: string;
}

// Blank missions log kept for user future missions
const MISSIONS: ClassifiedMission[] = [];

export default function MissionsConsole(): React.ReactElement {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [decryptedCodes, setDecryptedCodes] = useState<{ [code: string]: boolean }>({});
  const [isDecrypting, setIsDecrypting] = useState<string | null>(null);

  // Proposal Calculator State
  const [projectType, setProjectType] = useState<string>('probe');
  const [teamSize, setTeamSize] = useState<number>(4);
  const [missionDuration, setMissionDuration] = useState<number>(30); // Sols
  const [proposalSubmitted, setProposalSubmitted] = useState<boolean>(false);

  const filteredMissions = activeFilter === 'all'
    ? MISSIONS
    : MISSIONS.filter((m) => m.phase === activeFilter);

  const handleDecrypt = (code: string) => {
    playTelemetryBeep(1200, 0.08);
    setIsDecrypting(code);

    setTimeout(() => {
      setDecryptedCodes((prev) => ({ ...prev, [code]: true }));
      setIsDecrypting(null);
      playTelemetryBeep(1600, 0.12);
    }, 600);
  };

  return (
    <div style={{ marginBottom: 'var(--space-3xl)' }}>
      {/* Category Pills */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-sm)',
          flexWrap: 'wrap',
          marginBottom: 'var(--space-2xl)',
        }}
      >
        {['all', 'Active Orbit', 'Hardware Lab', 'Data Reduction'].map((tab) => {
          const isSel = activeFilter === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                playTelemetryBeep(800, 0.04);
                setActiveFilter(tab);
              }}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: isSel ? 'var(--orbit)' : 'color-mix(in srgb, var(--navy) 60%, transparent)',
                color: isSel ? 'var(--void)' : 'var(--star)',
                border: `1px solid ${isSel ? 'var(--orbit)' : 'color-mix(in srgb, var(--steel) 30%, transparent)'}`,
                boxShadow: isSel ? '0 0 16px color-mix(in srgb, var(--orbit) 35%, transparent)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {tab === 'all' ? 'All Missions' : tab}
            </button>
          );
        })}
      </div>

      {/* Grid of Missions */}
      {filteredMissions.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-xl)',
            marginBottom: 'var(--space-3xl)',
          }}
        >
          {filteredMissions.map((mission) => {
            const isDecrypted = Boolean(decryptedCodes[mission.code]);
            const decryptingThis = isDecrypting === mission.code;

            return (
              <div
                key={mission.code}
                style={{
                  backgroundColor: 'var(--deep)',
                  border: `1px solid color-mix(in srgb, ${mission.accent} 35%, transparent)`,
                  borderTop: `3px solid ${mission.accent}`,
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-xl)',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 8px 30px color-mix(in srgb, var(--void) 70%, transparent)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: mission.accent }}>
                    {mission.code}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#4ade80', backgroundColor: 'rgba(34,197,94,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                    {mission.phase}
                  </span>
                </div>

                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 600, color: 'var(--moon)', margin: '0 0 var(--space-xs) 0', lineHeight: 1.25 }}>
                  {mission.title}
                </h4>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--steel)', marginBottom: 'var(--space-md)' }}>
                  LEAD WING: <span style={{ color: 'var(--star)' }}>{mission.leadWing}</span>
                </div>

                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--steel)', lineHeight: 1.6, marginBottom: 'var(--space-md)' }}>
                  {mission.publicSummary}
                </p>

                {/* Confidential Encrypted Area */}
                <div
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--void) 90%, transparent)',
                    border: '1px dashed color-mix(in srgb, var(--steel) 30%, transparent)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 'var(--space-md)',
                    marginBottom: 'var(--space-md)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    lineHeight: 1.5,
                  }}
                >
                  {isDecrypted ? (
                    <div style={{ color: 'var(--moon)' }}>
                      <span style={{ color: '#4ade80', display: 'block', fontSize: '0.6875rem', marginBottom: '0.25rem' }}>
                        ✔ DOSSIER DECRYPTED // VERIFIED CLEARANCE
                      </span>
                      {mission.confidentialData}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 'var(--space-xs)' }}>
                      <span style={{ color: 'var(--astrophage)', display: 'block', marginBottom: '0.4rem', fontSize: '0.6875rem' }}>
                        🔒 {mission.securityLevel} ENCRYPTED
                      </span>
                      <button
                        type="button"
                        disabled={decryptingThis}
                        onClick={() => handleDecrypt(mission.code)}
                        style={{
                          padding: '0.35rem 0.85rem',
                          backgroundColor: 'color-mix(in srgb, var(--navy) 80%, transparent)',
                          border: '1px solid var(--orbit)',
                          color: 'var(--moon)',
                          borderRadius: 'var(--radius-sm)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.6875rem',
                          cursor: 'pointer',
                        }}
                      >
                        {decryptingThis ? '⚡ Decrypting Hash...' : '🔓 Decrypt Classified Dossier'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--deep)',
            border: '1px dashed color-mix(in srgb, var(--steel) 35%, transparent)',
            borderRadius: 'var(--radius-lg)',
            padding: '3.5rem 1.5rem',
            textAlign: 'center',
            marginBottom: 'var(--space-3xl)',
          }}
          aria-label="Classified missions log kept blank for user future missions"
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🛰</div>
          <h4
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              color: 'var(--moon)',
              margin: '0 0 0.5rem 0',
            }}
          >
            Classified Missions Log
          </h4>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              color: 'var(--steel)',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Research projects and departmental flight campaigns will be registered and classified here in the future.
          </p>
        </div>
      )}

      {/* Interactive Mission Proposal Estimator */}
      <div
        style={{
          backgroundColor: 'linear-gradient(145deg, color-mix(in srgb, var(--navy) 60%, var(--deep)), var(--deep))',
          border: '1px solid color-mix(in srgb, var(--orbit) 35%, transparent)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-2xl)',
          boxShadow: '0 12px 40px color-mix(in srgb, var(--void) 80%, transparent)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--astrophage)', letterSpacing: '0.15em' }}>
            RESEARCH FLIGHT PROPOSAL ESTIMATOR
          </span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', fontWeight: 600, color: 'var(--moon)', margin: '0.2rem 0' }}>
            Simulate Your Mission Budget & Timeline
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--steel)', margin: 0 }}>
            Configure your research requirements to generate resource allocations from Callisto Club command.
          </p>
        </div>

        {proposalSubmitted ? (
          <div
            style={{
              padding: 'var(--space-xl)',
              textAlign: 'center',
              backgroundColor: 'color-mix(in srgb, var(--navy) 60%, transparent)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #4ade80',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-xs)' }}>🚀</div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--moon)', margin: '0 0 var(--space-xs) 0' }}>
              Mission Proposal Initialized!
            </h4>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--steel)', margin: '0 0 var(--space-md) 0' }}>
              Your simulation parameters have been queued for review by Aether Wing and the Executive Circle.
            </p>
            <button
              type="button"
              onClick={() => setProposalSubmitted(false)}
              style={{
                padding: '0.4rem 1rem',
                backgroundColor: 'transparent',
                border: '1px solid var(--steel)',
                color: 'var(--moon)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              Simulate Another Proposal &rarr;
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-xl)', alignItems: 'center' }}>
            <div>
              {/* Project Type */}
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <span style={labelStyle}>MISSION ARCHITECTURE:</span>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  style={selectStyle}
                >
                  <option value="probe">Atmospheric Stratosphere Probe (Borealis class)</option>
                  <option value="telescope">Automated Solar Heliostat & Spectroscopy Rig</option>
                  <option value="cubesat">CubeSat 1U Avionics & Telemetry Payload</option>
                  <option value="exoplanet">Photometric Exoplanet Transit Analysis Pipeline</option>
                </select>
              </div>

              {/* Team Size Slider */}
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--steel)' }}>
                  <span>CADET CREW COMPLEMENT:</span>
                  <span style={{ color: 'var(--orbit)', fontWeight: 700 }}>{teamSize} Researchers</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  value={teamSize}
                  onChange={(e) => setTeamSize(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--orbit)', cursor: 'pointer' }}
                />
              </div>

              {/* Duration Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--steel)' }}>
                  <span>EXPEDITION TIMELINE:</span>
                  <span style={{ color: 'var(--astrophage)', fontWeight: 700 }}>{missionDuration} Sols</span>
                </div>
                <input
                  type="range"
                  min="7"
                  max="90"
                  step="7"
                  value={missionDuration}
                  onChange={(e) => setMissionDuration(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--astrophage)', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Calculated Allocation Output */}
            <div
              style={{
                backgroundColor: 'var(--void)',
                border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-lg)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
              }}
            >
              <div style={{ color: 'var(--astrophage)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
                SIMULATED FLIGHT ALLOCATION:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', color: 'var(--star)' }}>
                <div>&bull; Laboratory Bench Hours: <span style={{ color: 'var(--moon)' }}>{teamSize * 15} hrs</span></div>
                <div>&bull; Telescope Array Access: <span style={{ color: 'var(--moon)' }}>{Math.round(missionDuration * 0.4)} Nights</span></div>
                <div>&bull; Compute Telemetry Bandwidth: <span style={{ color: 'var(--moon)' }}>{teamSize * 250} GB Storage</span></div>
                <div>&bull; Faculty Mentorship Tier: <span style={{ color: '#4ade80' }}>Class Alpha Certified</span></div>
              </div>

              <button
                type="button"
                onClick={() => {
                  playTelemetryBeep(1400, 0.1);
                  setProposalSubmitted(true);
                }}
                style={{
                  width: '100%',
                  marginTop: 'var(--space-lg)',
                  padding: '0.65rem',
                  backgroundColor: 'var(--orbit)',
                  color: 'var(--void)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Submit Proposal Draft &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6875rem',
  color: 'var(--steel)',
  marginBottom: '0.25rem',
  letterSpacing: '0.08em',
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'color-mix(in srgb, var(--void) 80%, transparent)',
  border: '1px solid var(--steel)',
  borderRadius: 'var(--radius-sm)',
  padding: 'var(--space-xs) var(--space-sm)',
  color: 'var(--moon)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
};
