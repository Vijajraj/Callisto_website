import React, { useState, useEffect, useRef, useCallback } from 'react';

/* =========================================================================
   OUTPOST CALLISTO // CLOSED-LOOP ISRU & LIFE SUPPORT
   Bio-Astronautics Command Deck • Valhalla Basin, Jupiter IV
   Simulates human habitat environmental control (ECLSS) and in-situ resource
   utilization (ISRU) for a permanent 6-person crew in the Jovian system.
   ========================================================================= */

// --- Chemical & Environmental Constants ---
const CALLISTO_SURFACE_GRAVITY = 1.236; // m/s^2 (0.126 g)
const NOMINAL_CABIN_PRESSURE = 101.3; // kPa
const NOMINAL_O2_KPA = 21.2; // kPa pO2 (20.9%)
const MAX_SAFE_CO2_KPA = 0.50; // kPa pCO2 (safe limit < 0.5 kPa, warning > 0.8 kPa)
const KILOPOWER_BASE_CAPACITY_KW = 80; // dual 40 kWe Kilopower Stirling reactors

interface SubsystemTelemetry {
  id: string;
  name: string;
  code: string;
  category: 'ISRU' | 'ECLSS' | 'POWER' | 'THERMAL' | 'BIO';
  powerKw: number;
  status: 'NOMINAL' | 'ELEVATED' | 'STRAINED' | 'STANDBY' | 'FAULT';
  primaryMetric: string;
  metricLabel: string;
  description: string;
  chemicalReaction?: string;
}

interface OutpostState {
  sol: number;
  isJovianDay: boolean; // 16.7-day diurnal cycle: Day (165 K) vs Night (110 K)
  ambientTempK: number;
  
  // Habitat Cabin Atmosphere
  cabinPressureKpa: number;
  oxygenPartialKpa: number;
  co2PartialKpa: number;
  cabinTempC: number;
  humidityPct: number;
  
  // Consumables & Inventories
  potableWaterL: number;
  greywaterL: number;
  algaeBiomassKg: number;
  propellantLoxTons: number;
  propellantLh2Tons: number;
  crewHealthPct: number;
  
  // User Interactive Sliders / Inputs
  melterPowerPct: number;       // 0 - 100%
  electrolyzerLoadPct: number;  // 0 - 100%
  sabatierState: 'OFFLINE' | 'BALANCED' | 'MAX_FLUX';
  algaeIrradiancePct: number;   // 0 - 100%
  radiatorBypassPct: number;    // 0 - 100%
  
  // System Health & Events
  siltClogPct: number;
  activeScenarioId: string | null;
  scenarioMessage: string | null;
  radiationFluxMsv: number;
}

const INITIAL_OUTPOST_STATE: OutpostState = {
  sol: 42,
  isJovianDay: true,
  ambientTempK: 165,
  
  cabinPressureKpa: 101.3,
  oxygenPartialKpa: 21.2,
  co2PartialKpa: 0.38,
  cabinTempC: 21.4,
  humidityPct: 44.5,
  
  potableWaterL: 3850,
  greywaterL: 140,
  algaeBiomassKg: 28.5,
  propellantLoxTons: 14.8,
  propellantLh2Tons: 1.85,
  crewHealthPct: 99.2,
  
  melterPowerPct: 65,
  electrolyzerLoadPct: 60,
  sabatierState: 'BALANCED',
  algaeIrradiancePct: 75,
  radiatorBypassPct: 50,
  
  siltClogPct: 0,
  activeScenarioId: null,
  scenarioMessage: null,
  radiationFluxMsv: 0.012,
};

export default function ExpeditionSimulator() {
  const [state, setState] = useState<OutpostState>(INITIAL_OUTPOST_STATE);
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>('melter');
  const [activeTab, setActiveTab] = useState<'schematic' | 'controls' | 'scenarios' | 'log'>('schematic');
  const [logEntries, setLogEntries] = useState<Array<{ id: number; time: string; text: string; type: 'info' | 'warn' | 'success' | 'action' }>>([
    { id: 1, time: '08:00:14', text: 'ECLSS Master Telemetry established: 6 crew metabolism synchronized.', type: 'info' },
    { id: 2, time: '08:00:15', text: 'Valhalla Basin Cryo-Melter engaged at 65% power flux.', type: 'info' },
    { id: 3, time: '08:00:15', text: 'Spirulina photobioreactor columns nominal: carbon fixation rate at 94.2%.', type: 'success' },
    { id: 4, time: '08:00:16', text: 'Kilopower dual Stirling bus routing 54.2 kW of 80.0 kW total capacity.', type: 'info' },
  ]);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Helper to add log entries
  const addLog = useCallback((text: string, type: 'info' | 'warn' | 'success' | 'action' = 'info') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogEntries((prev) => [{ id: Date.now() + Math.random(), time: timeStr, text, type }, ...prev.slice(0, 49)]);
  }, []);

  // Calculate live energy demands and mass flows based on user inputs
  const melterKw = (state.melterPowerPct / 100) * 18.0;
  const electrolyzerKw = (state.electrolyzerLoadPct / 100) * 24.0;
  const sabatierKw = state.sabatierState === 'OFFLINE' ? 0 : state.sabatierState === 'BALANCED' ? 2.5 : 4.2;
  const algaeKw = (state.algaeIrradiancePct / 100) * 12.0;
  const habitatBaseloadKw = 16.5;
  const totalPowerDrawKw = Number((melterKw + electrolyzerKw + sabatierKw + algaeKw + habitatBaseloadKw).toFixed(1));
  const powerReserveKw = Number((KILOPOWER_BASE_CAPACITY_KW - totalPowerDrawKw).toFixed(1));

  // Flow rates (kg/h and L/h)
  const iceMeltRateLh = Number(((state.melterPowerPct / 100) * 35.0 * (1 - state.siltClogPct / 100)).toFixed(1));
  const waterElectrolyzedLh = Number(((state.electrolyzerLoadPct / 100) * 14.0).toFixed(1));
  const o2GeneratedKgh = Number((waterElectrolyzedLh * 0.889 + (state.algaeIrradiancePct / 100) * 0.45).toFixed(2));
  const h2GeneratedKgh = Number((waterElectrolyzedLh * 0.111).toFixed(2));
  const co2ScrubbedKgh = Number((
    (state.sabatierState === 'MAX_FLUX' ? 0.32 : state.sabatierState === 'BALANCED' ? 0.25 : 0) +
    (state.algaeIrradiancePct / 100) * 0.18
  ).toFixed(2));
  
  // Crew metabolic consumption (6 crew members)
  const crewO2ConsumptionKgh = 0.21; // 5.04 kg/day / 24h = 0.21 kg/h
  const crewCo2ProductionKgh = 0.25; // 6.00 kg/day / 24h = 0.25 kg/h
  const netO2FluxKgh = Number((o2GeneratedKgh - crewO2ConsumptionKgh).toFixed(2));
  const netCo2FluxKgh = Number((crewCo2ProductionKgh - co2ScrubbedKgh).toFixed(2));

  // Determine Habitat Safety Index & Status Color
  const isHypoxia = state.oxygenPartialKpa < 17.5;
  const isHyperoxia = state.oxygenPartialKpa > 24.5;
  const isHypercapnia = state.co2PartialKpa > MAX_SAFE_CO2_KPA;
  const isPressureLow = state.cabinPressureKpa < 92.0;
  const isOverheating = state.cabinTempC > 27.0;
  const isFreezing = state.cabinTempC < 16.0;

  let habitatCondition: 'OPTIMAL' | 'NOMINAL' | 'CAUTION' | 'CRITICAL' = 'OPTIMAL';
  let habitatColor = '#10b981'; // green

  if (isHypoxia || isHypercapnia || isPressureLow || isFreezing || isOverheating) {
    habitatCondition = 'CRITICAL';
    habitatColor = '#ef4444'; // red
  } else if (state.oxygenPartialKpa < 19.5 || state.co2PartialKpa > 0.44 || state.cabinPressureKpa < 97.0) {
    habitatCondition = 'CAUTION';
    habitatColor = '#f59e0b'; // amber
  } else if (powerReserveKw < 5.0 || state.siltClogPct > 40) {
    habitatCondition = 'NOMINAL';
    habitatColor = '#38bdf8'; // sky
  }

  // --- Animation Loop: Interactive Schematic Canvas ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particleOffset = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Nodes Coordinates (Normalized for responsiveness)
      const nodes = {
        melter: { x: width * 0.16, y: height * 0.30, label: 'ISRU CRYO-MELTER', color: '#38bdf8' },
        waterTank: { x: width * 0.38, y: height * 0.30, label: 'WATER RESERVOIR', color: '#06b6d4' },
        electrolyzer: { x: width * 0.60, y: height * 0.30, label: 'PEM ELECTROLYZER', color: '#a855f7' },
        propellant: { x: width * 0.84, y: height * 0.30, label: 'PROPELLANT DEPOT', color: '#f59e0b' },
        habitat: { x: width * 0.50, y: height * 0.70, label: 'CREW HABITAT (ECLSS)', color: habitatColor },
        sabatier: { x: width * 0.25, y: height * 0.70, label: 'SABATIER METHANATION', color: '#fb923c' },
        algae: { x: width * 0.75, y: height * 0.70, label: 'SPIRULINA ALGAE PBR', color: '#10b981' },
      };

      // Draw Flow Pipelines with Animated Particle Pulses
      const drawPipe = (
        from: { x: number; y: number },
        to: { x: number; y: number },
        strokeColor: string,
        active: boolean
      ) => {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = active ? strokeColor : 'rgba(100, 116, 139, 0.25)';
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        if (active) {
          // Flowing pulse particles
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const steps = Math.floor(dist / 40);
          for (let i = 0; i < steps; i++) {
            const t = ((i / steps) + (particleOffset / dist)) % 1;
            const px = from.x + dx * t;
            const py = from.y + dy * t;
            ctx.beginPath();
            ctx.arc(px, py, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = strokeColor;
            ctx.shadowColor = strokeColor;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      };

      // Connect nodes
      drawPipe(nodes.melter, nodes.waterTank, '#38bdf8', state.melterPowerPct > 0);
      drawPipe(nodes.waterTank, nodes.electrolyzer, '#06b6d4', state.electrolyzerLoadPct > 0);
      drawPipe(nodes.electrolyzer, nodes.propellant, '#f59e0b', state.electrolyzerLoadPct > 30);
      drawPipe(nodes.electrolyzer, nodes.habitat, '#38bdf8', state.electrolyzerLoadPct > 0);
      drawPipe(nodes.habitat, nodes.sabatier, '#a855f7', state.sabatierState !== 'OFFLINE');
      drawPipe(nodes.sabatier, nodes.waterTank, '#06b6d4', state.sabatierState !== 'OFFLINE');
      drawPipe(nodes.habitat, nodes.algae, '#10b981', state.algaeIrradiancePct > 0);
      drawPipe(nodes.algae, nodes.habitat, '#34d399', state.algaeIrradiancePct > 0);

      // Render Nodes
      Object.entries(nodes).forEach(([key, node]) => {
        const isSelected = selectedSubsystem === key;

        // Outer glow on selected
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 34, 0, Math.PI * 2);
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 2;
          ctx.shadowColor = node.color;
          ctx.shadowBlur = 15;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Base circular node
        ctx.beginPath();
        ctx.arc(node.x, node.y, 24, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Node center pip
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Node Text
        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + 38);
      });

      particleOffset = (particleOffset + 0.8) % 40;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [state, selectedSubsystem, habitatColor]);

  // Handle canvas click to select subsystem node
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const width = canvas.width;
    const height = canvas.height;
    const nodeCoords: Record<string, { x: number; y: number }> = {
      melter: { x: width * 0.16, y: height * 0.30 },
      waterTank: { x: width * 0.38, y: height * 0.30 },
      electrolyzer: { x: width * 0.60, y: height * 0.30 },
      propellant: { x: width * 0.84, y: height * 0.30 },
      habitat: { x: width * 0.50, y: height * 0.70 },
      sabatier: { x: width * 0.25, y: height * 0.70 },
      algae: { x: width * 0.75, y: height * 0.70 },
    };

    for (const [id, coord] of Object.entries(nodeCoords)) {
      const dist = Math.hypot(clickX - coord.x, clickY - coord.y);
      if (dist < 32) {
        setSelectedSubsystem(id);
        addLog(`Inspected subsystem telemetry: ${id.toUpperCase()}`, 'info');
        break;
      }
    }
  };

  // --- Subsystem Dictionary ---
  const subsystems: Record<string, SubsystemTelemetry> = {
    melter: {
      id: 'melter',
      name: 'Valhalla Sub-Surface Cryo-Melter',
      code: 'ISRU-MELT-01',
      category: 'ISRU',
      powerKw: melterKw,
      status: state.siltClogPct > 50 ? 'FAULT' : state.melterPowerPct > 80 ? 'ELEVATED' : 'NOMINAL',
      primaryMetric: `${iceMeltRateLh} L/h`,
      metricLabel: 'Cryo-Ice Sublimation Flux',
      description: 'Heated mechanical melt-head drilling into fractured cryo-regolith at 115 K to extract ice and filter rocky chondritic silt.',
      chemicalReaction: 'H2O(s, 115K) + ΔH_melt → H2O(l, 277K) [Filtered]',
    },
    waterTank: {
      id: 'waterTank',
      name: 'Primary Potable & Greywater Reservoir',
      code: 'ECLSS-H2O-RES',
      category: 'ECLSS',
      powerKw: 1.8,
      status: 'NOMINAL',
      primaryMetric: `${state.potableWaterL} L`,
      metricLabel: 'Current Reserve Storage',
      description: 'Multi-barrier water recovery processor incorporating catalytic oxidation, vacuum distillation, and silver biocide stabilization.',
    },
    electrolyzer: {
      id: 'electrolyzer',
      name: 'Solid Polymer Electrolyzer Stack',
      code: 'ISRU-ELEC-44',
      category: 'ISRU',
      powerKw: electrolyzerKw,
      status: state.electrolyzerLoadPct > 85 ? 'ELEVATED' : 'NOMINAL',
      primaryMetric: `${o2GeneratedKgh} kg/h O2`,
      metricLabel: 'Electrolytic Oxygen Output',
      description: 'Proton Exchange Membrane (PEM) cells splitting deionized water at 35 bar to supply crew metabolic air and cryogenic ascent rocket tanks.',
      chemicalReaction: '2 H2O(l) + 285.8 kJ/mol → 2 H2(g) + O2(g)',
    },
    propellant: {
      id: 'propellant',
      name: 'Cryogenic LOX / LH2 Propellant Depot',
      code: 'DEPOT-VAL-03',
      category: 'ISRU',
      powerKw: 6.2,
      status: 'NOMINAL',
      primaryMetric: `${state.propellantLoxTons} T LOX / ${state.propellantLh2Tons} T LH2`,
      metricLabel: 'Ascent Stage Fuel Loaded',
      description: 'Cryo-cooled multi-layer insulation spherical dewars accumulating cryogenic propellant for Earth return trajectory stages.',
    },
    habitat: {
      id: 'habitat',
      name: 'Primary Crew Habitat Module (ECLSS)',
      code: 'HAB-CORE-VAL',
      category: 'ECLSS',
      powerKw: habitatBaseloadKw,
      status: habitatCondition === 'OPTIMAL' ? 'NOMINAL' : habitatCondition === 'CRITICAL' ? 'FAULT' : 'STRAINED',
      primaryMetric: `${state.cabinPressureKpa} kPa (${state.oxygenPartialKpa} kPa pO2)`,
      metricLabel: 'Atmospheric Envelope',
      description: 'Pressurized Kevlar-aluminum structural shell housing 6 crew members with active air circulation, HEPA filtration, and temperature regulation.',
    },
    sabatier: {
      id: 'sabatier',
      name: 'Sabatier Catalytic Methanation Reactor',
      code: 'ECLSS-SAB-02',
      category: 'ECLSS',
      powerKw: sabatierKw,
      status: state.sabatierState === 'OFFLINE' ? 'STANDBY' : 'NOMINAL',
      primaryMetric: `${co2ScrubbedKgh} kg/h CO2`,
      metricLabel: 'Carbon Reduction Rate',
      description: 'Ruthenium-on-alumina catalyst bed operating at 400°C combining respired CO2 with electrolyzer H2 to recover potable water.',
      chemicalReaction: 'CO2(g) + 4 H2(g) → CH4(g) + 2 H2O(v) + 165 kJ/mol',
    },
    algae: {
      id: 'algae',
      name: 'Helical Spirulina Photobioreactor',
      code: 'BIO-PBR-09',
      category: 'BIO',
      powerKw: algaeKw,
      status: state.algaeIrradiancePct > 90 ? 'ELEVATED' : 'NOMINAL',
      primaryMetric: `${state.algaeBiomassKg.toFixed(1)} kg`,
      metricLabel: 'Accumulated Protein Biomass',
      description: 'High-density micro-algae culture tubes utilizing 660nm LED photon arrays to absorb metabolic CO2 and produce dietary proteins & O2.',
      chemicalReaction: '6 CO2 + 6 H2O + hν → C6H12O6 + 6 O2',
    },
  };

  // --- Tactical Actions (User Controlled) ---

  // 1. Advance Sol (24-hour mission cycle step)
  const handleAdvanceSol = () => {
    setState((prev) => {
      const nextSol = prev.sol + 1;
      const nextIsDay = (nextSol % 17) < 9; // Callisto 16.7 day cycle: ~8.5 days day, ~8.2 days night
      const nextTempK = nextIsDay ? 165 : 110;

      // Calculate 24-hr net changes
      const dailyMeltL = iceMeltRateLh * 24;
      const dailyElectrolyzedL = waterElectrolyzedLh * 24;
      const dailyCrewWaterUsed = 15.0; // 2.5 L/day * 6 crew
      const dailyNetWater = dailyMeltL - dailyElectrolyzedL - dailyCrewWaterUsed;

      const dailyO2Kg = o2GeneratedKgh * 24;
      const dailyCrewO2Kg = crewO2ConsumptionKgh * 24;
      const o2SurplusKg = Math.max(0, dailyO2Kg - dailyCrewO2Kg);
      const loxAddedTons = Number((o2SurplusKg * 0.0008).toFixed(3));
      const lh2AddedTons = Number((loxAddedTons / 8).toFixed(3));

      // Atmospheric changes based on net fluxes
      let nextO2Kpa = prev.oxygenPartialKpa + (netO2FluxKgh > 0 ? 0.2 : -0.3);
      nextO2Kpa = Math.max(14.0, Math.min(26.0, Number(nextO2Kpa.toFixed(1))));

      let nextCo2Kpa = prev.co2PartialKpa + (netCo2FluxKgh > 0 ? 0.04 : -0.05);
      nextCo2Kpa = Math.max(0.15, Math.min(1.2, Number(nextCo2Kpa.toFixed(2))));

      // Temperature regulation based on radiator bypass and ambient cycle
      let nextCabinTemp = prev.cabinTempC;
      if (!nextIsDay && prev.radiatorBypassPct > 70) {
        nextCabinTemp -= 1.8; // heat leaking during deep night
      } else if (nextIsDay && prev.radiatorBypassPct < 30) {
        nextCabinTemp += 1.5; // slight heat buildup
      } else {
        nextCabinTemp = 21.4; // regulated
      }
      nextCabinTemp = Number(nextCabinTemp.toFixed(1));

      // Silt buildup increases slightly per sol if melter runs
      const nextSilt = prev.melterPowerPct > 0 ? Math.min(100, prev.siltClogPct + 4) : prev.siltClogPct;

      return {
        ...prev,
        sol: nextSol,
        isJovianDay: nextIsDay,
        ambientTempK: nextTempK,
        oxygenPartialKpa: nextO2Kpa,
        co2PartialKpa: nextCo2Kpa,
        cabinTempC: nextCabinTemp,
        potableWaterL: Math.max(200, Math.min(12000, Math.round(prev.potableWaterL + dailyNetWater))),
        propellantLoxTons: Number((prev.propellantLoxTons + loxAddedTons).toFixed(2)),
        propellantLh2Tons: Number((prev.propellantLh2Tons + lh2AddedTons).toFixed(2)),
        algaeBiomassKg: Number((prev.algaeBiomassKg + (prev.algaeIrradiancePct / 100) * 1.8).toFixed(1)),
        siltClogPct: nextSilt,
      };
    });

    addLog(`Advanced Sol Cycle to SOL ${state.sol + 1}. Consumables reconciled over 24-hr period.`, 'action');
  };

  // 2. Emergency O2 Cabin Injection
  const handleEmergencyO2Flush = () => {
    setState((prev) => ({
      ...prev,
      oxygenPartialKpa: 21.4,
      cabinPressureKpa: 101.4,
      potableWaterL: Math.max(100, prev.potableWaterL - 12),
    }));
    addLog('EMERGENCY O2 INJECTION: High-pressure reserve discharge restored cabin pO2 to 21.4 kPa.', 'warn');
  };

  // 3. Filter Backwash (Clean Silt)
  const handleFilterBackwash = () => {
    setState((prev) => ({
      ...prev,
      siltClogPct: 0,
      potableWaterL: Math.max(100, prev.potableWaterL - 8),
    }));
    addLog('FILTER BACKWASH: High-pressure sonic flush cleared chondritic silt from melter intake.', 'success');
  };

  // 4. Purge CO2 Amine Scrubbers
  const handlePurgeCO2 = () => {
    setState((prev) => ({
      ...prev,
      co2PartialKpa: 0.28,
    }));
    addLog('CO2 DESORPTION PURGE: Thermal amine beds flushed. Cabin pCO2 dropped to 0.28 kPa.', 'success');
  };

  // 5. Restore Nominal Equilibrium Setpoints
  const handleRestoreNominal = () => {
    setState((prev) => ({
      ...prev,
      melterPowerPct: 65,
      electrolyzerLoadPct: 60,
      sabatierState: 'BALANCED',
      algaeIrradiancePct: 75,
      radiatorBypassPct: 50,
      oxygenPartialKpa: 21.2,
      co2PartialKpa: 0.38,
      cabinPressureKpa: 101.3,
      cabinTempC: 21.4,
      activeScenarioId: null,
      scenarioMessage: null,
    }));
    addLog('SETPOINTS BALANCED: All ECLSS and ISRU control loops restored to nominal equilibrium.', 'info');
  };

  // 6. Launch Simulation Scenario Challenges
  const handleTriggerScenario = (scenarioId: string) => {
    if (scenarioId === 'cryo_freeze') {
      setState((prev) => ({
        ...prev,
        activeScenarioId: 'cryo_freeze',
        ambientTempK: 108,
        isJovianDay: false,
        cabinTempC: 15.2,
        radiatorBypassPct: 85,
        scenarioMessage: 'CRITICAL CHILL: Radiator loop chilling near freeze point! Close bypass valve (<40%) to conserve internal thermal heat.',
      }));
      addLog('SIMULATION SCENARIO TRIGGERED: Cryogenic Night Radiator Freeze Hazard.', 'warn');
    } else if (scenarioId === 'silt_blockage') {
      setState((prev) => ({
        ...prev,
        activeScenarioId: 'silt_blockage',
        siltClogPct: 85,
        scenarioMessage: 'INTAKE CLOG: Cryo-melter silt filter at 85% restriction. Execute Filter Backwash to recover water flux.',
      }));
      addLog('SIMULATION SCENARIO TRIGGERED: Chondritic Silt Intrusion in Melter Head.', 'warn');
    } else if (scenarioId === 'radiation_surge') {
      setState((prev) => ({
        ...prev,
        activeScenarioId: 'radiation_surge',
        radiationFluxMsv: 0.85,
        scenarioMessage: 'MAGNETOSPHERIC SURGE: Jovian plasma flux wave detected. Divert Kilopower grid to magnetic storm shelter.',
      }));
      addLog('SIMULATION SCENARIO TRIGGERED: Jovian Magnetospheric Plasma Shockwave.', 'warn');
    }
  };

  const currentSubsystem = subsystems[selectedSubsystem] || subsystems.melter;

  return (
    <div className="outpost-cockpit">
      {/* Flight Deck Header */}
      <div className="cockpit-header">
        <div className="header-left">
          <div className="tag-row">
            <span className="station-badge">OUTPOST CALLISTO // ECLSS & ISRU COMMAND</span>
            <span className="orbit-badge">VALHALLA BASIN • 15.9°N, 55.6°W</span>
          </div>
          <h2 className="deck-title">Bio-Astronautics Closed-Loop Simulator</h2>
          <p className="deck-subtitle">
            Autonomous environmental control and resource synthesis supporting permanent Jovian surface outposts.
          </p>
        </div>

        {/* Action Controls in Header */}
        <div className="header-actions">
          <button
            type="button"
            className="action-btn cycle-btn"
            onClick={handleAdvanceSol}
            title="Advance simulation by 24 hours (1 Sol)"
          >
            <span className="btn-icon">⟳</span>
            <span>ADVANCE SOL (24H)</span>
          </button>
          <button
            type="button"
            className="action-btn report-btn"
            onClick={() => setReportModalOpen(true)}
            title="Open comprehensive telemetry briefing"
          >
            <span className="btn-icon">📋</span>
            <span>MISSION BRIEFING</span>
          </button>
        </div>
      </div>

      {/* Static Mission Telemetry Badges (NO RESTLESS TICKING / PURE STATIC TELEMETRY) */}
      <div className="telemetry-bar" aria-label="Static Outpost Telemetry">
        <div className="telemetry-card status-card" style={{ borderColor: habitatColor }}>
          <span className="card-label">HABITAT SAFETY INDEX</span>
          <span className="card-value" style={{ color: habitatColor }}>
            {habitatCondition} ({state.crewHealthPct.toFixed(1)}%)
          </span>
          <span className="card-subtext">All 6 Crew Compartments Pressurized</span>
        </div>

        <div className="telemetry-card">
          <span className="card-label">SURFACE ENVIRONMENT</span>
          <span className="card-value">
            SOL {state.sol} // {state.isJovianDay ? 'DAY' : 'NIGHT'}
          </span>
          <span className="card-subtext">
            Ext: {state.ambientTempK} K • Grav: {CALLISTO_SURFACE_GRAVITY} m/s²
          </span>
        </div>

        <div className="telemetry-card">
          <span className="card-label">ATMOSPHERIC ENVELOPE</span>
          <span className="card-value">
            {state.cabinPressureKpa} kPa • {state.oxygenPartialKpa} kPa pO₂
          </span>
          <span className="card-subtext">
            pCO₂: {state.co2PartialKpa} kPa • Temp: {state.cabinTempC}°C
          </span>
        </div>

        <div className="telemetry-card">
          <span className="card-label">KILOPOWER GRID LOAD</span>
          <span className="card-value">
            {totalPowerDrawKw} / {KILOPOWER_BASE_CAPACITY_KW} kW
          </span>
          <span className="card-subtext">Reserve: +{powerReserveKw} kW Available</span>
        </div>

        <div className="telemetry-card">
          <span className="card-label">ASCENT FUEL ACCUMULATED</span>
          <span className="card-value">
            {state.propellantLoxTons} T LOX / {state.propellantLh2Tons} T LH₂
          </span>
          <span className="card-subtext">Reserve Target: 25.0 Tons Required</span>
        </div>
      </div>

      {/* Active Incident Warning Alert (if any) */}
      {state.scenarioMessage && (
        <div className="incident-alert">
          <div className="alert-content">
            <span className="alert-badge">PRIORITY ALERT</span>
            <span className="alert-text">{state.scenarioMessage}</span>
          </div>
          <button
            type="button"
            className="alert-dismiss-btn"
            onClick={handleRestoreNominal}
          >
            RESOLVE SETPOINTS
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="deck-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'schematic' ? 'active' : ''}`}
          onClick={() => setActiveTab('schematic')}
        >
          <span className="tab-icon">☵</span>
          <span>CLOSED-LOOP SCHEMATIC</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'controls' ? 'active' : ''}`}
          onClick={() => setActiveTab('controls')}
        >
          <span className="tab-icon">⚙</span>
          <span>SYSTEM CONTROLS & FLUX</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'scenarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('scenarios')}
        >
          <span className="tab-icon">⚡</span>
          <span>MISSION SCENARIOS & DRILLS</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'log' ? 'active' : ''}`}
          onClick={() => setActiveTab('log')}
        >
          <span className="tab-icon">⌨</span>
          <span>ENGINEERING LOG ({logEntries.length})</span>
        </button>
      </div>

      {/* Main Workspace Body */}
      <div className="deck-body">
        {/* Tab 1: Interactive Flow Schematic */}
        {activeTab === 'schematic' && (
          <div className="schematic-layout">
            <div className="canvas-wrapper">
              <div className="canvas-header">
                <span className="canvas-title">MASS & ENERGY CONSERVATION MAPPING</span>
                <span className="canvas-hint">Click any node to inspect subsystem telemetry</span>
              </div>
              <canvas
                ref={canvasRef}
                width={860}
                height={440}
                className="schematic-canvas"
                onClick={handleCanvasClick}
              />
              <div className="canvas-legend">
                <span className="legend-item"><span className="legend-dot water"></span> H₂O Water Flow</span>
                <span className="legend-item"><span className="legend-dot oxygen"></span> O₂ Oxygen Flux</span>
                <span className="legend-item"><span className="legend-dot co2"></span> CO₂ Absorption</span>
                <span className="legend-item"><span className="legend-dot fuel"></span> LOX/LH₂ Propellant</span>
                <span className="legend-item"><span className="legend-dot biomass"></span> Algae Biomass</span>
              </div>
            </div>

            {/* Subsystem Telemetry Inspector Card */}
            <div className="inspector-panel">
              <div className="inspector-header">
                <span className="subsys-category">{currentSubsystem.category}</span>
                <span className={`status-pill status-${currentSubsystem.status.toLowerCase()}`}>
                  {currentSubsystem.status}
                </span>
              </div>
              <h3 className="subsys-name">{currentSubsystem.name}</h3>
              <span className="subsys-code">{currentSubsystem.code}</span>

              <div className="metric-box">
                <span className="metric-label">{currentSubsystem.metricLabel}</span>
                <span className="metric-val">{currentSubsystem.primaryMetric}</span>
                <span className="metric-power">⚡ Power Draw: {currentSubsystem.powerKw} kW</span>
              </div>

              <p className="subsys-desc">{currentSubsystem.description}</p>

              {currentSubsystem.chemicalReaction && (
                <div className="reaction-box">
                  <span className="reaction-title">STOICHIOMETRIC REACTION:</span>
                  <code className="reaction-code">{currentSubsystem.chemicalReaction}</code>
                </div>
              )}

              <div className="quick-action-row">
                {currentSubsystem.id === 'melter' && (
                  <button
                    type="button"
                    className="subsys-action-btn"
                    onClick={handleFilterBackwash}
                  >
                    CLEAN SILT FILTERS (BACKWASH)
                  </button>
                )}
                {currentSubsystem.id === 'habitat' && (
                  <button
                    type="button"
                    className="subsys-action-btn"
                    onClick={handleEmergencyO2Flush}
                  >
                    EMERGENCY O2 INJECTION
                  </button>
                )}
                {currentSubsystem.id === 'sabatier' && (
                  <button
                    type="button"
                    className="subsys-action-btn"
                    onClick={handlePurgeCO2}
                  >
                    PURGE AMINE BEDS
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: System Controls & Dynamic Sliders */}
        {activeTab === 'controls' && (
          <div className="controls-layout">
            <div className="control-group">
              <div className="slider-card">
                <div className="slider-header">
                  <span className="slider-title">1. Cryo-Regolith Melter Power Flux</span>
                  <span className="slider-badge">{state.melterPowerPct}% ({melterKw} kW)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={state.melterPowerPct}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setState((prev) => ({ ...prev, melterPowerPct: val }));
                    addLog(`Cryo-Melter set to ${val}% (${((val / 100) * 18.0).toFixed(1)} kW)`, 'action');
                  }}
                  className="cockpit-slider"
                />
                <div className="slider-meta">
                  <span>Melts Callisto 115 K surface ice</span>
                  <span>Yield: {iceMeltRateLh} L/h Water</span>
                </div>
              </div>

              <div className="slider-card">
                <div className="slider-header">
                  <span className="slider-title">2. PEM Water Electrolyzer Load</span>
                  <span className="slider-badge">{state.electrolyzerLoadPct}% ({electrolyzerKw} kW)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={state.electrolyzerLoadPct}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setState((prev) => ({ ...prev, electrolyzerLoadPct: val }));
                    addLog(`Electrolyzer load adjusted to ${val}%`, 'action');
                  }}
                  className="cockpit-slider"
                />
                <div className="slider-meta">
                  <span>Splits H2O into O2 + H2</span>
                  <span>Generates: {o2GeneratedKgh} kg/h O2</span>
                </div>
              </div>

              <div className="slider-card">
                <div className="slider-header">
                  <span className="slider-title">3. Sabatier Methanation Mode</span>
                  <span className="slider-badge">{state.sabatierState}</span>
                </div>
                <div className="mode-toggle-group">
                  {(['OFFLINE', 'BALANCED', 'MAX_FLUX'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`mode-btn ${state.sabatierState === m ? 'active' : ''}`}
                      onClick={() => {
                        setState((prev) => ({ ...prev, sabatierState: m }));
                        addLog(`Sabatier reactor mode switched to ${m}`, 'action');
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div className="slider-meta">
                  <span>Recycles CO2 + H2 → CH4 + 2 H2O</span>
                  <span>Scrubbing: {co2ScrubbedKgh} kg/h CO2</span>
                </div>
              </div>
            </div>

            <div className="control-group">
              <div className="slider-card">
                <div className="slider-header">
                  <span className="slider-title">4. Spirulina Photobioreactor LED Flux</span>
                  <span className="slider-badge">{state.algaeIrradiancePct}% ({algaeKw} kW)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={state.algaeIrradiancePct}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setState((prev) => ({ ...prev, algaeIrradiancePct: val }));
                    addLog(`Algae PBR LED irradiance set to ${val}%`, 'action');
                  }}
                  className="cockpit-slider"
                />
                <div className="slider-meta">
                  <span>Biological photosynthetic CO2 fixation</span>
                  <span>Yield: +0.07 kg/h Protein</span>
                </div>
              </div>

              <div className="slider-card">
                <div className="slider-header">
                  <span className="slider-title">5. Radiator Heat Rejection Bypass</span>
                  <span className="slider-badge">{state.radiatorBypassPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={state.radiatorBypassPct}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setState((prev) => ({ ...prev, radiatorBypassPct: val }));
                    addLog(`Radiator thermal bypass adjusted to ${val}%`, 'action');
                  }}
                  className="cockpit-slider"
                />
                <div className="slider-meta">
                  <span>Rejects waste reactor heat to space</span>
                  <span>Cabin Temp: {state.cabinTempC}°C</span>
                </div>
              </div>

              <div className="tactical-actions-card">
                <span className="card-heading">DIRECT CONTINGENCY INTERVENTIONS</span>
                <div className="tactical-btn-grid">
                  <button
                    type="button"
                    className="contingency-btn"
                    onClick={handleEmergencyO2Flush}
                  >
                    INJECT RESERVE O₂
                  </button>
                  <button
                    type="button"
                    className="contingency-btn"
                    onClick={handleFilterBackwash}
                  >
                    FLUSH SILT INTAKE
                  </button>
                  <button
                    type="button"
                    className="contingency-btn"
                    onClick={handlePurgeCO2}
                  >
                    PURGE AMINE BEDS
                  </button>
                  <button
                    type="button"
                    className="contingency-btn reset-btn"
                    onClick={handleRestoreNominal}
                  >
                    RESTORE NOMINAL
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Mission Scenarios & Training Drills */}
        {activeTab === 'scenarios' && (
          <div className="scenarios-layout">
            <div className="scenarios-grid">
              <div className="scenario-card">
                <div className="scenario-tag">DRILL ALPHA</div>
                <h4 className="scenario-title">Deep Cryogenic Night Freeze (110 K)</h4>
                <p className="scenario-desc">
                  Callisto rotates into Jovian shadow. Exterior temperatures plunge to 110 K.
                  Radiator coolant lines risk freezing solid, while habitat insulation is tested.
                </p>
                <div className="scenario-objectives">
                  <span>• Target: Throttle radiator bypass to prevent fluid stagnation.</span>
                  <span>• Maintain cabin interior temperature between 18°C and 23°C.</span>
                </div>
                <button
                  type="button"
                  className="scenario-start-btn"
                  onClick={() => handleTriggerScenario('cryo_freeze')}
                >
                  SIMULATE NIGHT FREEZE
                </button>
              </div>

              <div className="scenario-card">
                <div className="scenario-tag">DRILL BRAVO</div>
                <h4 className="scenario-title">Chondritic Silt Intrusion in Melter</h4>
                <p className="scenario-desc">
                  Dense basaltic impact dust from Valhalla Basin invades the sub-surface melt chamber,
                  throttling water recovery flow by 85%.
                </p>
                <div className="scenario-objectives">
                  <span>• Target: Execute high-pressure backwash sequence.</span>
                  <span>• Balance water conservation until flow is restored.</span>
                </div>
                <button
                  type="button"
                  className="scenario-start-btn"
                  onClick={() => handleTriggerScenario('silt_blockage')}
                >
                  SIMULATE SILT CLOG
                </button>
              </div>

              <div className="scenario-card">
                <div className="scenario-tag">DRILL CHARLIE</div>
                <h4 className="scenario-title">Jovian Magnetospheric Compression</h4>
                <p className="scenario-desc">
                  A solar coronal mass ejection compresses Jupiter’s magnetosphere, causing radiation
                  flux spikes on Callisto's surface.
                </p>
                <div className="scenario-objectives">
                  <span>• Target: Divert 20 kW power to the subterranean active storm shelter.</span>
                  <span>• Confirm crew health metrics remain above 95%.</span>
                </div>
                <button
                  type="button"
                  className="scenario-start-btn"
                  onClick={() => handleTriggerScenario('radiation_surge')}
                >
                  SIMULATE RADIATION SURGE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Engineering Telemetry Log */}
        {activeTab === 'log' && (
          <div className="log-layout">
            <div className="log-header">
              <span className="log-title">REAL-TIME SUBSYSTEM TRANSACTION FEED</span>
              <button
                type="button"
                className="log-clear-btn"
                onClick={() => setLogEntries([])}
              >
                CLEAR LOGS
              </button>
            </div>
            <div className="log-terminal">
              {logEntries.map((entry) => (
                <div key={entry.id} className={`log-row log-${entry.type}`}>
                  <span className="log-time">[{entry.time}]</span>
                  <span className="log-badge">{entry.type.toUpperCase()}</span>
                  <span className="log-message">{entry.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mission Briefing Modal */}
      {reportModalOpen && (
        <div className="modal-overlay" onClick={() => setReportModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-tag">EXPEDITION-4 FLIGHT MANUAL // CLASSIFIED BRIEFING</div>
              <h3 className="modal-title">Outpost Callisto: Closed-Loop Bio-Astronautics</h3>
            </div>
            <div className="modal-content">
              <h4>1. The Strategic Value of Callisto</h4>
              <p>
                Unlike Europa or Io which sit inside Jupiter’s lethal radiation belts ($&gt;50\text&#123; Sv/day&#125;$),
                Callisto is located at 1.88 million kilometers from Jupiter. Radiation exposure on Callisto
                is only $\approx 0.01\text&#123; mSv/day&#125;$&mdash;comparable to Earth surface levels. This makes it
                humanity’s primary staging outpost for deep Jovian space exploration.
              </p>
              <h4>2. ECLSS Mass Conservation</h4>
              <p>
                A 6-person crew requires 5.04 kg of $O_2$ and 15 liters of drinking water per day.
                The Outpost achieves a 98.4% closure loop by combining high-temperature Sabatier catalytic
                methanation with Spirulina photobioreactors, converting respired $CO_2$ back into breathable
                oxygen and edible caloric biomass.
              </p>
              <h4>3. In-Situ Resource Utilization (ISRU)</h4>
              <p>
                By sublimating the cryo-regolith ice shell with Kilopower Stirling reactors, excess water
                is electrolyzed into cryogenic liquid oxygen ($LOX$) and liquid hydrogen ($LH_2$), refueling
                interplanetary transfer craft without requiring propellant launches from Earth.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="action-btn report-btn"
                onClick={() => setReportModalOpen(false)}
              >
                RETURN TO COMMAND DECK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded High-Contrast Stylesheet */}
      <style>{`
        .outpost-cockpit {
          background-color: var(--surface, #0c121e);
          border: 1px solid color-mix(in srgb, var(--border, #334155) 45%, transparent);
          border-radius: var(--radius-lg, 12px);
          overflow: hidden;
          font-family: var(--font-mono, ui-monospace, SFMono-Regular, monospace);
          color: var(--moon, #f8fafc);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
        }

        .cockpit-header {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 1.75rem 2rem;
          border-bottom: 1px solid color-mix(in srgb, var(--border, #334155) 35%, transparent);
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(12, 18, 30, 0.5) 100%);
        }

        @media (min-width: 860px) {
          .cockpit-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .tag-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .station-badge {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.3);
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
        }

        .orbit-badge {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #94a3b8;
          background: rgba(148, 163, 184, 0.08);
          border: 1px solid rgba(148, 163, 184, 0.2);
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
        }

        .deck-title {
          font-family: var(--font-display, inherit);
          font-size: 1.6rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.01em;
          color: #ffffff;
        }

        .deck-subtitle {
          font-size: 0.85rem;
          color: #94a3b8;
          margin: 0.35rem 0 0 0;
          font-family: var(--font-body, inherit);
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.1rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cycle-btn {
          background: #0284c7;
          color: #ffffff;
          border: 1px solid #38bdf8;
        }

        .cycle-btn:hover {
          background: #0369a1;
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.4);
        }

        .report-btn {
          background: rgba(30, 41, 59, 0.7);
          color: #e2e8f0;
          border: 1px solid rgba(148, 163, 184, 0.3);
        }

        .report-btn:hover {
          background: rgba(51, 65, 85, 0.9);
          border-color: #94a3b8;
        }

        /* Telemetry Cards */
        .telemetry-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 0.85rem;
          padding: 1.25rem 2rem;
          background: rgba(8, 13, 22, 0.6);
          border-bottom: 1px solid color-mix(in srgb, var(--border, #334155) 30%, transparent);
        }

        .telemetry-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 6px;
          padding: 0.85rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .status-card {
          border-width: 2px;
        }

        .card-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #94a3b8;
        }

        .card-value {
          font-size: 1.05rem;
          font-weight: 800;
          color: #f8fafc;
        }

        .card-subtext {
          font-size: 0.72rem;
          color: #64748b;
        }

        /* Incident Alert */
        .incident-alert {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: rgba(239, 68, 68, 0.15);
          border-bottom: 1px solid rgba(239, 68, 68, 0.4);
        }

        @media (min-width: 768px) {
          .incident-alert {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .alert-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .alert-badge {
          background: #ef4444;
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .alert-text {
          font-size: 0.85rem;
          color: #fca5a5;
        }

        .alert-dismiss-btn {
          background: rgba(239, 68, 68, 0.25);
          color: #fee2e2;
          border: 1px solid #ef4444;
          padding: 0.45rem 0.85rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }

        .alert-dismiss-btn:hover {
          background: #ef4444;
          color: #ffffff;
        }

        /* Tabs */
        .deck-tabs {
          display: flex;
          overflow-x: auto;
          background: rgba(10, 16, 26, 0.8);
          border-bottom: 1px solid color-mix(in srgb, var(--border, #334155) 30%, transparent);
          padding: 0 1rem;
        }

        .tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.25rem;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: #94a3b8;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          color: #f1f5f9;
        }

        .tab-btn.active {
          color: #38bdf8;
          border-bottom-color: #38bdf8;
          background: rgba(56, 189, 248, 0.05);
        }

        /* Deck Body */
        .deck-body {
          padding: 1.75rem 2rem;
          min-height: 480px;
        }

        /* Tab 1: Schematic Layout */
        .schematic-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 1024px) {
          .schematic-layout {
            grid-template-columns: 1fr 340px;
          }
        }

        .canvas-wrapper {
          background: rgba(10, 15, 26, 0.7);
          border: 1px solid rgba(51, 65, 85, 0.4);
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
        }

        .canvas-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          font-size: 0.75rem;
        }

        .canvas-title {
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.04em;
        }

        .canvas-hint {
          color: #64748b;
          font-size: 0.7rem;
        }

        .schematic-canvas {
          width: 100%;
          height: auto;
          aspect-ratio: 860 / 440;
          cursor: pointer;
          border-radius: 4px;
          background: #070b13;
        }

        .canvas-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          margin-top: 0.85rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(51, 65, 85, 0.3);
          font-size: 0.72rem;
          color: #94a3b8;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .legend-dot.water { background: #38bdf8; }
        .legend-dot.oxygen { background: #06b6d4; }
        .legend-dot.co2 { background: #a855f7; }
        .legend-dot.fuel { background: #f59e0b; }
        .legend-dot.biomass { background: #10b981; }

        /* Inspector Panel */
        .inspector-panel {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 8px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .inspector-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .subsys-category {
          font-size: 0.7rem;
          font-weight: 700;
          color: #38bdf8;
          letter-spacing: 0.08em;
        }

        .status-pill {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }

        .status-nominal { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        .status-elevated { background: rgba(56, 189, 248, 0.2); color: #38bdf8; }
        .status-strained { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
        .status-standby { background: rgba(148, 163, 184, 0.2); color: #cbd5e1; }
        .status-fault { background: rgba(239, 68, 68, 0.2); color: #f87171; }

        .subsys-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .subsys-code {
          font-size: 0.7rem;
          color: #64748b;
        }

        .metric-box {
          background: rgba(7, 11, 19, 0.7);
          border: 1px solid rgba(51, 65, 85, 0.3);
          border-radius: 6px;
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .metric-label {
          font-size: 0.68rem;
          color: #94a3b8;
        }

        .metric-val {
          font-size: 1.25rem;
          font-weight: 800;
          color: #38bdf8;
        }

        .metric-power {
          font-size: 0.72rem;
          color: #e2e8f0;
          margin-top: 0.25rem;
        }

        .subsys-desc {
          font-size: 0.78rem;
          line-height: 1.5;
          color: #cbd5e1;
          margin: 0;
          font-family: var(--font-body, inherit);
        }

        .reaction-box {
          background: rgba(2, 6, 23, 0.6);
          border-left: 2px solid #a855f7;
          padding: 0.6rem 0.8rem;
          border-radius: 0 4px 4px 0;
        }

        .reaction-title {
          display: block;
          font-size: 0.62rem;
          font-weight: 700;
          color: #c084fc;
          margin-bottom: 0.25rem;
        }

        .reaction-code {
          font-size: 0.75rem;
          color: #e2e8f0;
        }

        .subsys-action-btn {
          width: 100%;
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.4);
          padding: 0.65rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .subsys-action-btn:hover {
          background: #38bdf8;
          color: #070b13;
        }

        /* Tab 2: Controls Layout */
        .controls-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 860px) {
          .controls-layout {
            grid-template-columns: 1fr 1fr;
          }
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .slider-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(51, 65, 85, 0.4);
          border-radius: 8px;
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .slider-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .slider-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #f1f5f9;
        }

        .slider-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.12);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }

        .cockpit-slider {
          width: 100%;
          accent-color: #38bdf8;
          cursor: pointer;
        }

        .slider-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: #94a3b8;
        }

        .mode-toggle-group {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }

        .mode-btn {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(51, 65, 85, 0.5);
          color: #94a3b8;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mode-btn.active {
          background: rgba(251, 146, 60, 0.2);
          color: #fb923c;
          border-color: #fb923c;
        }

        .tactical-actions-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(51, 65, 85, 0.4);
          border-radius: 8px;
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .card-heading {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #94a3b8;
        }

        .tactical-btn-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.65rem;
        }

        .contingency-btn {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(71, 85, 105, 0.5);
          color: #e2e8f0;
          padding: 0.65rem 0.5rem;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .contingency-btn:hover {
          background: rgba(56, 189, 248, 0.2);
          border-color: #38bdf8;
          color: #ffffff;
        }

        .contingency-btn.reset-btn {
          border-color: #10b981;
          color: #34d399;
        }

        .contingency-btn.reset-btn:hover {
          background: rgba(16, 185, 129, 0.2);
        }

        /* Tab 3: Scenarios Layout */
        .scenarios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .scenario-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .scenario-tag {
          font-size: 0.68rem;
          font-weight: 800;
          color: #f59e0b;
          letter-spacing: 0.08em;
        }

        .scenario-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .scenario-desc {
          font-size: 0.8rem;
          line-height: 1.5;
          color: #cbd5e1;
          margin: 0;
          font-family: var(--font-body, inherit);
        }

        .scenario-objectives {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: 0.74rem;
          color: #94a3b8;
          background: rgba(2, 6, 23, 0.5);
          padding: 0.75rem;
          border-radius: 4px;
        }

        .scenario-start-btn {
          margin-top: auto;
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.4);
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .scenario-start-btn:hover {
          background: #f59e0b;
          color: #070b13;
        }

        /* Tab 4: Logs Layout */
        .log-layout {
          background: rgba(8, 12, 20, 0.8);
          border: 1px solid rgba(51, 65, 85, 0.4);
          border-radius: 8px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .log-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .log-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.05em;
        }

        .log-clear-btn {
          background: transparent;
          border: 1px solid rgba(71, 85, 105, 0.5);
          color: #94a3b8;
          font-size: 0.68rem;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .log-clear-btn:hover {
          color: #f1f5f9;
          border-color: #94a3b8;
        }

        .log-terminal {
          max-height: 380px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .log-row {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
          font-size: 0.75rem;
          line-height: 1.4;
          padding: 0.2rem 0;
          border-bottom: 1px solid rgba(30, 41, 59, 0.4);
        }

        .log-time {
          color: #64748b;
          font-size: 0.7rem;
        }

        .log-badge {
          font-size: 0.62rem;
          font-weight: 800;
          padding: 0.1rem 0.35rem;
          border-radius: 3px;
        }

        .log-info .log-badge { background: rgba(56, 189, 248, 0.2); color: #38bdf8; }
        .log-warn .log-badge { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
        .log-success .log-badge { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        .log-action .log-badge { background: rgba(168, 85, 247, 0.2); color: #c084fc; }

        .log-message {
          color: #e2e8f0;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 1.5rem;
        }

        .modal-dialog {
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 10px;
          max-width: 680px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
        }

        .modal-tag {
          font-size: 0.7rem;
          font-weight: 800;
          color: #38bdf8;
          letter-spacing: 0.08em;
          margin-bottom: 0.35rem;
        }

        .modal-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .modal-content h4 {
          font-size: 0.95rem;
          color: #38bdf8;
          margin: 1rem 0 0.4rem 0;
        }

        .modal-content p {
          font-size: 0.85rem;
          line-height: 1.6;
          color: #cbd5e1;
          margin: 0;
          font-family: var(--font-body, inherit);
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}
