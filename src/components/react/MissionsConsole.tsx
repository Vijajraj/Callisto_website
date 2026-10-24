import React, { useState } from 'react';
import { playTelemetryBeep, playThrusterBurst, playBeaconPing, playWarpSurge } from '../../lib/audio';

interface CelestialTarget {
  id: string;
  name: string;
  badge: string;
  bodyType: string;
  distanceKm: string;
  distanceNumKm: number;
  baseTransitSols: number; // Base Sols on Hohmann transfer
  signalDelayMin: string; // One-way light speed delay
  gravity: string; // Surface gravity in m/s^2
  solarFlux: string; // Solar irradiance in W/m^2
  primaryObjective: string;
  accent: string;
}

const CELESTIAL_TARGETS: CelestialTarget[] = [
  {
    id: 'callisto',
    name: 'Callisto (Jupiter IV)',
    badge: 'FLAGSHIP EXPEDITION',
    bodyType: 'Cratered Ocean Moon',
    distanceKm: '628,300,000 km',
    distanceNumKm: 628300000,
    baseTransitSols: 640,
    signalDelayMin: '34.9 min',
    gravity: '1.236 m/s²',
    solarFlux: '50.3 W/m²',
    primaryObjective: 'Analyze ancient untouched cratered crust & detect subsurface saline ocean conductivity.',
    accent: 'var(--orbit)',
  },
  {
    id: 'europa',
    name: 'Europa (Jupiter II)',
    badge: 'OCEAN WORLD',
    bodyType: 'Ice-Crusted Moon',
    distanceKm: '628,300,000 km',
    distanceNumKm: 628300000,
    baseTransitSols: 610,
    signalDelayMin: '34.9 min',
    gravity: '1.315 m/s²',
    solarFlux: '50.3 W/m²',
    primaryObjective: 'Survey cryovolcanic surface plumes and map ice-shell tidal fractures for hydrothermal vents.',
    accent: '#38bdf8',
  },
  {
    id: 'mars',
    name: 'Mars (Jezero Basin)',
    badge: 'RED PLANET OUTPOST',
    bodyType: 'Terrestrial Planet',
    distanceKm: '225,000,000 km',
    distanceNumKm: 225000000,
    baseTransitSols: 210,
    signalDelayMin: '12.5 min',
    gravity: '3.721 m/s²',
    solarFlux: '586.2 W/m²',
    primaryObjective: 'Sample paleolake delta clay sediment and track seasonal atmospheric methane plumes.',
    accent: 'var(--sol-dust)',
  },
  {
    id: 'moon',
    name: 'Moon (Shackleton Crater)',
    badge: 'CISLUNAR TESTBED',
    bodyType: 'Earth Satellite',
    distanceKm: '384,400 km',
    distanceNumKm: 384400,
    baseTransitSols: 3,
    signalDelayMin: '1.28 sec',
    gravity: '1.622 m/s²',
    solarFlux: '1,361 W/m²',
    primaryObjective: 'Extract volatile water ice in permanently shadowed polar craters for propellent synthesis.',
    accent: '#a3e635',
  },
  {
    id: 'titan',
    name: 'Titan (Saturn VI)',
    badge: 'PREBIOTIC LAB',
    bodyType: 'Hydrocarbon Ocean Moon',
    distanceKm: '1,427,000,000 km',
    distanceNumKm: 1427000000,
    baseTransitSols: 1820,
    signalDelayMin: '79.3 min',
    gravity: '1.352 m/s²',
    solarFlux: '15.1 W/m²',
    primaryObjective: 'Navigate liquid methane-ethane sea shores (Kraken Mare) beneath dense nitrogen haze.',
    accent: 'var(--astrophage)',
  },
];

interface SpacecraftArchitecture {
  id: string;
  name: string;
  icon: string;
  type: string;
  baseMassKg: number;
  instruments: string[];
}

const SPACECRAFT_CLASSES: SpacecraftArchitecture[] = [
  {
    id: 'rover',
    name: 'Autonomous Surface Rover',
    icon: '/icons/craft-rover.jpg',
    type: 'Mobile Surface Explorer',
    baseMassKg: 320,
    instruments: ['Raman Spectrometer Arm', 'Mastcam Multispectral Imager', 'Subsurface Ground Radar'],
  },
  {
    id: 'orbiter',
    name: 'Orbital Reconnaissance Satellite',
    icon: '/icons/craft-orbiter.jpg',
    type: 'High-Altitude Surveyor',
    baseMassKg: 180,
    instruments: ['Synthetic Aperture Radar', 'Thermal Infrared Radiometer', 'Magnetometer Boom'],
  },
  {
    id: 'drill',
    name: 'Cryogenic Deep-Ice Drill',
    icon: '/icons/craft-drill.jpg',
    type: 'Subsurface Probe',
    baseMassKg: 410,
    instruments: ['Thermal Melting Penetrator', 'Fluorescence Biosensor', 'Deep Acoustic Sonar'],
  },
  {
    id: 'drone',
    name: 'Atmospheric Aerobotics Drone',
    icon: '/icons/craft-drone.jpg',
    type: 'Aerial Aerial Scout',
    baseMassKg: 95,
    instruments: ['Coaxial Rotor Array', 'Mini-Gas Chromatograph', 'Wide-Angle Navigational Lidar'],
  },
];

interface PropulsionOption {
  id: string;
  name: string;
  efficiencyMult: number; // Faster transit
  deltaVBoost: number; // km/s
  tag: string;
}

const PROPULSION_TYPES: PropulsionOption[] = [
  { id: 'chemical', name: 'Chemical Bipropellant (LOX/Methane)', efficiencyMult: 1.0, deltaVBoost: 4.8, tag: 'High-Thrust Injection' },
  { id: 'ion', name: 'Solar-Electric Hall Thruster (Xenon Ion)', efficiencyMult: 0.75, deltaVBoost: 9.2, tag: 'High Specific Impulse (Isp)' },
  { id: 'nuclear', name: 'Nuclear Thermal Rocket (NTR Engine)', efficiencyMult: 0.55, deltaVBoost: 14.5, tag: 'Deep-Space Fast Transit' },
];

export default function MissionsConsole(): React.ReactElement {
  const [selectedTarget, setSelectedTarget] = useState<CelestialTarget>(CELESTIAL_TARGETS[0]); // Callisto default
  const [selectedCraft, setSelectedCraft] = useState<SpacecraftArchitecture>(SPACECRAFT_CLASSES[0]); // Rover default
  const [selectedPropulsion, setSelectedPropulsion] = useState<PropulsionOption>(PROPULSION_TYPES[0]);
  const [payloadMassKg, setPayloadMassKg] = useState<number>(250);
  const [flightApproved, setFlightApproved] = useState<boolean>(false);
  const [computingTrajectory, setComputingTrajectory] = useState<boolean>(false);

  // Compute Space Physics & Mission Metrics
  const calculatedTransitSols = Math.max(
    1,
    Math.round(selectedTarget.baseTransitSols * selectedPropulsion.efficiencyMult)
  );

  const baseDeltaV = selectedTarget.id === 'moon' ? 3.9 : selectedTarget.id === 'mars' ? 5.8 : selectedTarget.id === 'titan' ? 16.4 : 14.2;
  const safePayload = Number.isFinite(payloadMassKg) && payloadMassKg >= 0 ? payloadMassKg : 0;
  const totalDeltaV = (baseDeltaV + (safePayload / 500) * 0.8).toFixed(1);
  const totalSpacecraftMass = selectedCraft.baseMassKg + safePayload;
  const telemetryBandwidth = selectedTarget.id === 'moon' ? '250 Mbps' : selectedTarget.id === 'mars' ? '12.4 Mbps' : '1.8 Mbps';

  const handleCalculateTrajectory = () => {
    setComputingTrajectory(true);
    playThrusterBurst();

    setTimeout(() => {
      playTelemetryBeep(1200, 0.08);
    }, 350);

    setTimeout(() => {
      playWarpSurge();
      setComputingTrajectory(false);
      setFlightApproved(true);
    }, 850);
  };

  const handleReset = () => {
    playBeaconPing();
    setFlightApproved(false);
  };

  return (
    <div style={{ marginBottom: 'var(--space-3xl)' }}>
      {/* Main Interactive Mission Trajectory Planner */}
      <div
        style={{
          backgroundColor: 'var(--deep)',
          border: '1px solid color-mix(in srgb, var(--orbit) 35%, transparent)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(1.25rem, 3vw, 2.25rem)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25), 0 0 20px color-mix(in srgb, var(--orbit) 15%, transparent)',
        }}
      >
        {/* Module Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'color-mix(in srgb, var(--orbit) 15%, transparent)',
              border: '1px solid color-mix(in srgb, var(--orbit) 35%, transparent)',
              color: 'var(--orbit)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              marginBottom: '0.75rem',
            }}
          >
            <span>✦</span>
            <span>EXPEDITION FLIGHT DYNAMICS // ORBITAL TRAJECTORY PLANNER</span>
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              color: 'var(--moon)',
              margin: '0 0 0.5rem 0',
            }}
          >
            Configure Your Deep-Space Mission
          </h3>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              color: 'var(--steel)',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Select a target celestial world, configure your spacecraft payload architecture, and compute your Hohmann transfer flight trajectory in real time.
          </p>
        </div>

        {flightApproved ? (
          /* Flight Trajectory Clearance Card */
          <div
            style={{
              backgroundColor: 'color-mix(in srgb, var(--navy) 40%, var(--deep))',
              border: '2px solid var(--orbit)',
              borderRadius: 'var(--radius-md)',
              padding: 'clamp(1.5rem, 3vw, 2.5rem)',
              boxShadow: '0 16px 40px color-mix(in srgb, var(--orbit) 25%, transparent)',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid color-mix(in srgb, var(--steel) 25%, transparent)', paddingBottom: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--orbit)', letterSpacing: '0.12em', fontWeight: 700 }}>
                  [✓] HOHMANN TRANSFER TRAJECTORY VERIFIED & COMPUTED
                </span>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--moon)', margin: '0.2rem 0 0 0' }}>
                  Mission Dossier: {selectedTarget.name}
                </h4>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'color-mix(in srgb, #22c55e 18%, transparent)',
                  border: '1px solid #22c55e',
                  color: '#22c55e',
                  fontWeight: 700,
                }}
              >
                STATUS: TRAJECTORY CERTIFIED
              </div>
            </div>

            {/* Flight Summary Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1.75rem',
              }}
            >
              <div style={metricBoxStyle}>
                <span style={metricLabelStyle}>TARGET DESTINATION</span>
                <span style={metricValStyle}>{selectedTarget.name}</span>
                <span style={metricSubStyle}>{selectedTarget.distanceKm}</span>
              </div>

              <div style={metricBoxStyle}>
                <span style={metricLabelStyle}>TRANSIT FLIGHT DURATION</span>
                <span style={{ ...metricValStyle, color: 'var(--orbit)' }}>{calculatedTransitSols} Sols</span>
                <span style={metricSubStyle}>Hohmann Transfer Orbit</span>
              </div>

              <div style={metricBoxStyle}>
                <span style={metricLabelStyle}>REQUIRED DELTA-V (Δv)</span>
                <span style={{ ...metricValStyle, color: 'var(--astrophage)' }}>{totalDeltaV} km/s</span>
                <span style={metricSubStyle}>{selectedPropulsion.tag}</span>
              </div>

              <div style={metricBoxStyle}>
                <span style={metricLabelStyle}>ONE-WAY LIGHT DELAY</span>
                <span style={{ ...metricValStyle, color: 'var(--sol-dust)' }}>{selectedTarget.signalDelayMin}</span>
                <span style={metricSubStyle}>Deep Space Radio Comms</span>
              </div>
            </div>

            {/* Spacecraft Architecture Specs */}
            <div
              style={{
                backgroundColor: 'var(--deep)',
                border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.25rem',
                marginBottom: '1.75rem',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--steel)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                SPACECRAFT VEHICLE ARCHITECTURE & SCIENTIFIC SUITE
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <img
                  src={selectedCraft.icon}
                  alt=""
                  width="44"
                  height="44"
                  style={{ borderRadius: '8px', objectFit: 'cover', border: '1.5px solid var(--orbit)' }}
                />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--moon)' }}>
                    {selectedCraft.name} ({totalSpacecraftMass} kg wet mass)
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--orbit)' }}>
                    {selectedPropulsion.name}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {selectedCraft.instruments.map((inst, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'color-mix(in srgb, var(--navy) 60%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--steel) 25%, transparent)',
                      color: 'var(--moon)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <img
                      src="/icons/icon-gear.jpg"
                      alt=""
                      width="12"
                      height="12"
                      style={{ borderRadius: '2px', objectFit: 'cover' }}
                    />
                    <span>{inst}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  padding: '0.75rem 1.75rem',
                  backgroundColor: 'var(--deep)',
                  border: '1px solid color-mix(in srgb, var(--steel) 45%, transparent)',
                  color: 'var(--moon)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                &larr; Recalculate Another Trajectory
              </button>

              <a
                href="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.75rem',
                  background: 'linear-gradient(135deg, var(--orbit), var(--dusk))',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                  boxShadow: '0 0 20px color-mix(in srgb, var(--orbit) 40%, transparent)',
                }}
              >
                <span>Submit Flight Plan to Callisto Club &rarr;</span>
              </a>
            </div>
          </div>
        ) : (
          /* Step-by-Step Trajectory Builder */
          <div>
            {/* Step 1: Destination Selection */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={stepHeaderStyle}>
                <span style={stepBadgeStyle}>STEP 01</span>
                <span style={stepTitleStyle}>CHOOSE TARGET CELESTIAL WORLD</span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                {CELESTIAL_TARGETS.map((target) => {
                  const isSel = selectedTarget.id === target.id;
                  return (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => {
                        playTelemetryBeep(880, 0.05);
                        setSelectedTarget(target);
                      }}
                      style={{
                        textAlign: 'left',
                        padding: '0.85rem',
                        backgroundColor: isSel
                          ? 'color-mix(in srgb, var(--orbit) 15%, var(--deep))'
                          : 'var(--deep)',
                        border: `1.5px solid ${isSel ? 'var(--orbit)' : 'color-mix(in srgb, var(--steel) 30%, transparent)'}`,
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        boxShadow: isSel ? '0 0 16px color-mix(in srgb, var(--orbit) 25%, transparent)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: isSel ? 'var(--orbit)' : 'var(--steel)', fontWeight: 700 }}>
                          {target.badge}
                        </span>
                        {isSel && <span style={{ color: 'var(--orbit)', fontSize: '0.75rem' }}>✓</span>}
                      </div>

                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--moon)', marginBottom: '0.25rem' }}>
                        {target.name}
                      </div>

                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--steel)' }}>
                        {target.distanceKm}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Spacecraft & Payload Architecture */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
              <div>
                <div style={stepHeaderStyle}>
                  <span style={stepBadgeStyle}>STEP 02</span>
                  <span style={stepTitleStyle}>SPACECRAFT VEHICLE CLASS</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  {SPACECRAFT_CLASSES.map((craft) => {
                    const isSel = selectedCraft.id === craft.id;
                    return (
                      <button
                        key={craft.id}
                        type="button"
                        onClick={() => {
                          playTelemetryBeep(980, 0.05);
                          setSelectedCraft(craft);
                        }}
                        style={{
                          textAlign: 'left',
                          padding: '0.75rem',
                          backgroundColor: isSel
                            ? 'color-mix(in srgb, var(--orbit) 15%, var(--deep))'
                            : 'var(--deep)',
                          border: `1.5px solid ${isSel ? 'var(--orbit)' : 'color-mix(in srgb, var(--steel) 30%, transparent)'}`,
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ marginBottom: '0.35rem' }}>
                          <img
                            src={craft.icon}
                            alt=""
                            width="36"
                            height="36"
                            style={{ borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--orbit)' }}
                          />
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--moon)' }}>
                          {craft.name}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--steel)' }}>
                          {craft.type}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Propulsion Architecture & Payload Mass */}
              <div>
                <div style={stepHeaderStyle}>
                  <span style={stepBadgeStyle}>STEP 03</span>
                  <span style={stepTitleStyle}>PROPULSION & PAYLOAD MASS</span>
                </div>

                {/* Propulsion Dropdown */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={controlLabelStyle}>PROPULSION SYSTEM INJECTION:</label>
                  <select
                    value={selectedPropulsion.id}
                    onChange={(e) => {
                      const found = PROPULSION_TYPES.find((p) => p.id === e.target.value);
                      if (found) setSelectedPropulsion(found);
                    }}
                    style={selectInputStyle}
                  >
                    {PROPULSION_TYPES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mass Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={controlLabelStyle}>SCIENTIFIC PAYLOAD MASS:</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--orbit)' }}>
                      {payloadMassKg} kg (Wet Mass: {totalSpacecraftMass} kg)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="650"
                    step="25"
                    value={payloadMassKg}
                    onChange={(e) => setPayloadMassKg(parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: 'var(--orbit)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--steel)', marginTop: '0.2rem' }}>
                    <span>50 kg (CubeSat Scale)</span>
                    <span>650 kg (Heavy Lander Suite)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Computed Trajectory Telemetry Bar & Action */}
            <div
              style={{
                backgroundColor: 'color-mix(in srgb, var(--navy) 50%, var(--deep))',
                border: '1px solid color-mix(in srgb, var(--orbit) 30%, transparent)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--steel)' }}>ESTIMATED TRANSIT TIME</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--orbit)' }}>
                  {calculatedTransitSols} Sols
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--steel)' }}>
                  Hohmann Orbital Transfer
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--steel)' }}>INJECTION DELTA-V (Δv)</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--astrophage)' }}>
                  {totalDeltaV} km/s
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--steel)' }}>
                  Escape & Capture Velocity
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--steel)' }}>LIGHT-SPEED COMM DELAY</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--sol-dust)' }}>
                  {selectedTarget.signalDelayMin}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--steel)' }}>
                  DSN Downlink: {telemetryBandwidth}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleCalculateTrajectory}
                  disabled={computingTrajectory}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    background: 'linear-gradient(135deg, var(--orbit), var(--dusk))',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: computingTrajectory ? 'wait' : 'pointer',
                    boxShadow: '0 0 20px color-mix(in srgb, var(--orbit) 40%, transparent)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {computingTrajectory ? (
                    'Computing Orbit Trajectory...'
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <img
                        src="/icons/icon-rocket.jpg"
                        alt=""
                        width="18"
                        height="18"
                        style={{ borderRadius: '3px', objectFit: 'cover' }}
                      />
                      <span>Calculate Flight Trajectory</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const stepHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '0.75rem',
};

const stepBadgeStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.625rem',
  fontWeight: 700,
  padding: '0.15rem 0.45rem',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'color-mix(in srgb, var(--orbit) 20%, transparent)',
  color: 'var(--orbit)',
  border: '1px solid color-mix(in srgb, var(--orbit) 40%, transparent)',
};

const stepTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  color: 'var(--moon)',
};

const controlLabelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6875rem',
  color: 'var(--steel)',
  letterSpacing: '0.06em',
  marginBottom: '0.35rem',
};

const selectInputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'var(--deep)',
  border: '1px solid color-mix(in srgb, var(--steel) 40%, transparent)',
  borderRadius: 'var(--radius-sm)',
  padding: '0.55rem 0.75rem',
  color: 'var(--moon)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.75rem',
  cursor: 'pointer',
  outline: 'none',
};

const metricBoxStyle: React.CSSProperties = {
  backgroundColor: 'var(--deep)',
  border: '1px solid color-mix(in srgb, var(--steel) 30%, transparent)',
  borderRadius: 'var(--radius-sm)',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
};

const metricLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.625rem',
  color: 'var(--steel)',
  letterSpacing: '0.08em',
};

const metricValStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.35rem',
  fontWeight: 700,
  color: 'var(--moon)',
};

const metricSubStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6875rem',
  color: 'var(--steel)',
};
