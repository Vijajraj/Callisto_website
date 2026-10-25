import React, { useState, useEffect, useRef } from 'react';

/* =========================================================================
   COSMIC SYSTEMS & EXOPLANET EXPLORER // INTERACTIVE ORRERY
   Expedition Command Deck • Callisto Space Club
   Visualizes multi-star systems, planets, moons, and exoplanets with
   habitable zone overlays, transit light curves, and comparative scale physics.
   ========================================================================= */

export interface CelestialBody {
  id: string;
  name: string;
  type: 'STAR' | 'TERRESTRIAL' | 'GAS_GIANT' | 'ICE_GIANT' | 'MOON' | 'EXOPLANET';
  orbitalRadiusAuOrKm: number; // AU for planets, km for moons
  actualDiameterKm: number;
  orbitalPeriodDays: number;
  color: string;
  glowColor: string;
  orbitColor: string;
  surfaceTempC: string;
  atmosphere: string;
  surfaceGravityG: number;
  habitableStatus: 'IN_HABITABLE_ZONE' | 'POTENTIALLY_HABITABLE' | 'NON_HABITABLE' | 'HOST_STAR';
  habitabilityIndexPct: number;
  funAnalogy: string;
  description: string;
  discoveryMethod?: string;
  discoveryYear?: number;
  hasRings?: boolean;
}

export interface CosmicSystem {
  id: string;
  name: string;
  subtitle: string;
  systemType: string;
  distanceLightYears: number;
  centralStar: {
    name: string;
    spectralClass: string;
    tempK: number;
    color: string;
    diameterSunRatio: number;
  };
  habitableZoneAu: { min: number; max: number };
  bodies: CelestialBody[];
  overviewLore: string;
}

export const COSMIC_SYSTEMS: CosmicSystem[] = [
  {
    id: 'trappist1',
    name: 'TRAPPIST-1 System',
    subtitle: '7 Earth-Sized Terrestrial Worlds • Aquarius Constellation',
    systemType: 'Ultra-Cool Red Dwarf Planetary System',
    distanceLightYears: 39.5,
    centralStar: {
      name: 'TRAPPIST-1',
      spectralClass: 'M8V Ultra-Cool Dwarf',
      tempK: 2566,
      color: '#ff6b4a',
      diameterSunRatio: 0.12,
    },
    habitableZoneAu: { min: 0.024, max: 0.052 },
    overviewLore:
      'Discovered in 2017, TRAPPIST-1 hosts the largest known cluster of Earth-sized planets around a single star. Three of its worlds (e, f, g) orbit directly inside the temperate habitable zone where surface liquid water can exist.',
    bodies: [
      {
        id: 'trappist1_b',
        name: 'TRAPPIST-1b',
        type: 'EXOPLANET',
        orbitalRadiusAuOrKm: 0.0115,
        actualDiameterKm: 14220,
        orbitalPeriodDays: 1.51,
        color: '#f97316',
        glowColor: 'rgba(249, 115, 22, 0.4)',
        orbitColor: 'rgba(249, 115, 22, 0.25)',
        surfaceTempC: '+127°C (400 K)',
        atmosphere: 'Dense CO2 / Volatile envelope',
        surfaceGravityG: 0.81,
        habitableStatus: 'NON_HABITABLE',
        habitabilityIndexPct: 18,
        funAnalogy: 'Orbits so close to its dwarf star that a full year passes in just 36 hours!',
        description: 'Innermost rocky world subjected to intense tidal baking and stellar flares.',
        discoveryMethod: 'Transit Photometry (Spitzer / TRAPPIST)',
        discoveryYear: 2016,
      },
      {
        id: 'trappist1_c',
        name: 'TRAPPIST-1c',
        type: 'EXOPLANET',
        orbitalRadiusAuOrKm: 0.0158,
        actualDiameterKm: 13950,
        orbitalPeriodDays: 2.42,
        color: '#fbbf24',
        glowColor: 'rgba(251, 191, 36, 0.4)',
        orbitColor: 'rgba(251, 191, 36, 0.25)',
        surfaceTempC: '+68°C (341 K)',
        atmosphere: 'Thin CO2 / Nitrogen (JWST MIRI observation)',
        surfaceGravityG: 1.15,
        habitableStatus: 'NON_HABITABLE',
        habitabilityIndexPct: 29,
        funAnalogy: 'Similar in size and mass to Venus, but bathed in infrared red-dwarf light.',
        description: 'Hot terrestrial planet. JWST infrared spectroscopy revealed little to no thick atmosphere.',
        discoveryMethod: 'Transit Photometry',
        discoveryYear: 2016,
      },
      {
        id: 'trappist1_d',
        name: 'TRAPPIST-1d',
        type: 'EXOPLANET',
        orbitalRadiusAuOrKm: 0.0223,
        actualDiameterKm: 9990,
        orbitalPeriodDays: 4.05,
        color: '#38bdf8',
        glowColor: 'rgba(56, 189, 248, 0.4)',
        orbitColor: 'rgba(56, 189, 248, 0.3)',
        surfaceTempC: '+15°C (288 K)',
        atmosphere: 'Water vapor / Volatile rich',
        surfaceGravityG: 0.48,
        habitableStatus: 'POTENTIALLY_HABITABLE',
        habitabilityIndexPct: 68,
        funAnalogy: 'A lightweight cousin of Earth sitting right at the inner edge of the habitable zone.',
        description: 'Low density suggests it may possess significant water content or deep volatile oceans.',
        discoveryMethod: 'Transit Photometry',
        discoveryYear: 2016,
      },
      {
        id: 'trappist1_e',
        name: 'TRAPPIST-1e (Prime Candidate)',
        type: 'EXOPLANET',
        orbitalRadiusAuOrKm: 0.0293,
        actualDiameterKm: 11720,
        orbitalPeriodDays: 6.10,
        color: '#34d399',
        glowColor: 'rgba(52, 211, 153, 0.5)',
        orbitColor: 'rgba(52, 211, 153, 0.45)',
        surfaceTempC: '-22°C to +18°C',
        atmosphere: 'Nitrogen / Carbon Dioxide / Water vapor',
        surfaceGravityG: 0.93,
        habitableStatus: 'IN_HABITABLE_ZONE',
        habitabilityIndexPct: 89,
        funAnalogy: 'The most Earth-like exoplanet in the system: almost identical size, gravity, and rock-to-iron ratio!',
        description: 'Located dead-center in the Goldilocks zone. High probability of maintaining liquid surface water.',
        discoveryMethod: 'Transit Photometry',
        discoveryYear: 2017,
      },
      {
        id: 'trappist1_f',
        name: 'TRAPPIST-1f',
        type: 'EXOPLANET',
        orbitalRadiusAuOrKm: 0.0385,
        actualDiameterKm: 13320,
        orbitalPeriodDays: 9.21,
        color: '#06b6d4',
        glowColor: 'rgba(6, 182, 212, 0.4)',
        orbitColor: 'rgba(6, 182, 212, 0.3)',
        surfaceTempC: '-54°C (219 K)',
        atmosphere: 'Water-rich / Volatile layer',
        surfaceGravityG: 0.82,
        habitableStatus: 'IN_HABITABLE_ZONE',
        habitabilityIndexPct: 76,
        funAnalogy: 'A potential global water-world with a global ocean under a protective ice shell.',
        description: 'Tidally locked water-world in the outer habitable zone with possible geothermal thermal vents.',
        discoveryMethod: 'Transit Photometry',
        discoveryYear: 2017,
      },
      {
        id: 'trappist1_g',
        name: 'TRAPPIST-1g',
        type: 'EXOPLANET',
        orbitalRadiusAuOrKm: 0.0469,
        actualDiameterKm: 14640,
        orbitalPeriodDays: 12.35,
        color: '#818cf8',
        glowColor: 'rgba(129, 140, 248, 0.4)',
        orbitColor: 'rgba(129, 140, 248, 0.25)',
        surfaceTempC: '-75°C (198 K)',
        atmosphere: 'Nitrogen / Methane / CO2',
        surfaceGravityG: 1.06,
        habitableStatus: 'IN_HABITABLE_ZONE',
        habitabilityIndexPct: 62,
        funAnalogy: 'The heavyweight of TRAPPIST-1: 1.15 Earth masses bathed in dim scarlet twilight.',
        description: 'Largest world in the system. Cold terrestrial planet with a deep volatile icy mantle.',
        discoveryMethod: 'Transit Photometry',
        discoveryYear: 2017,
      },
      {
        id: 'trappist1_h',
        name: 'TRAPPIST-1h',
        type: 'EXOPLANET',
        orbitalRadiusAuOrKm: 0.0619,
        actualDiameterKm: 9870,
        orbitalPeriodDays: 18.77,
        color: '#c084fc',
        glowColor: 'rgba(192, 132, 252, 0.4)',
        orbitColor: 'rgba(192, 132, 252, 0.2)',
        surfaceTempC: '-104°C (169 K)',
        atmosphere: 'Frozen CO2 / Trace volatile gases',
        surfaceGravityG: 0.54,
        habitableStatus: 'NON_HABITABLE',
        habitabilityIndexPct: 22,
        funAnalogy: 'Resembles Jupiter’s icy moons, orbiting far beyond the system’s frost line.',
        description: 'Outermost cryogenic ball of rock and ice, perpetually frozen in deep cosmic cold.',
        discoveryMethod: 'Transit Photometry',
        discoveryYear: 2017,
      },
    ],
  },
  {
    id: 'jovian',
    name: 'Jovian Realm (Jupiter IV)',
    subtitle: 'Gas Giant & The Four Galilean Moons • Jupiter Sub-System',
    systemType: 'Gas Giant Planetary System',
    distanceLightYears: 0.00008, // ~5.2 AU
    centralStar: {
      name: 'Jupiter (Primary)',
      spectralClass: 'Gas Giant Monarch',
      tempK: 165,
      color: '#d97706',
      diameterSunRatio: 0.10,
    },
    habitableZoneAu: { min: 0.8, max: 2.2 }, // Relative to tidal heating zones
    overviewLore:
      'Home base of our club namesake! Jupiter is a miniature planetary system in its own right with 95 moons. Its Galilean satellites showcase extreme diversity: volcanic Io, oceanic Europa, magnetic Ganymede, and cratered Callisto.',
    bodies: [
      {
        id: 'io',
        name: 'Io',
        type: 'MOON',
        orbitalRadiusAuOrKm: 421700,
        actualDiameterKm: 3643,
        orbitalPeriodDays: 1.77,
        color: '#facc15',
        glowColor: 'rgba(250, 204, 21, 0.4)',
        orbitColor: 'rgba(250, 204, 21, 0.25)',
        surfaceTempC: '-130°C to +1,600°C',
        atmosphere: 'Sulfur Dioxide volcanic plumes',
        surfaceGravityG: 0.183,
        habitableStatus: 'NON_HABITABLE',
        habitabilityIndexPct: 5,
        funAnalogy: 'Tidal flexing from Jupiter stretches Io like a rubber ball, creating 400 active volcanoes!',
        description: 'Most geologically active body in the Solar System, erupting sulfur plumes 300 km high.',
      },
      {
        id: 'europa',
        name: 'Europa',
        type: 'MOON',
        orbitalRadiusAuOrKm: 670900,
        actualDiameterKm: 3122,
        orbitalPeriodDays: 3.55,
        color: '#e0e7ff',
        glowColor: 'rgba(224, 231, 255, 0.5)',
        orbitColor: 'rgba(224, 231, 255, 0.3)',
        surfaceTempC: '-160°C',
        atmosphere: 'Trace molecular Oxygen exosphere',
        surfaceGravityG: 0.134,
        habitableStatus: 'POTENTIALLY_HABITABLE',
        habitabilityIndexPct: 82,
        funAnalogy: 'Hides a global liquid ocean containing more water than all of Earth’s oceans combined!',
        description: 'Smooth icy crust crisscrossed by red tectonic cycloid fractures over a warm saline ocean.',
      },
      {
        id: 'ganymede',
        name: 'Ganymede',
        type: 'MOON',
        orbitalRadiusAuOrKm: 1070400,
        actualDiameterKm: 5268,
        orbitalPeriodDays: 7.15,
        color: '#94a3b8',
        glowColor: 'rgba(148, 163, 184, 0.4)',
        orbitColor: 'rgba(148, 163, 184, 0.25)',
        surfaceTempC: '-163°C',
        atmosphere: 'Thin Oxygen exosphere',
        surfaceGravityG: 0.146,
        habitableStatus: 'POTENTIALLY_HABITABLE',
        habitabilityIndexPct: 65,
        funAnalogy: 'Bigger than the planet Mercury and the only moon known to generate its own magnetic field!',
        description: 'Massive moon featuring sandwich layers of ice and liquid brines around a metallic core.',
      },
      {
        id: 'callisto',
        name: 'Callisto (Our Namesake)',
        type: 'MOON',
        orbitalRadiusAuOrKm: 1882700,
        actualDiameterKm: 4821,
        orbitalPeriodDays: 16.69,
        color: '#38bdf8',
        glowColor: 'rgba(56, 189, 248, 0.5)',
        orbitColor: 'rgba(56, 189, 248, 0.4)',
        surfaceTempC: '-139°C',
        atmosphere: 'Carbon Dioxide & Oxygen traces',
        surfaceGravityG: 0.126,
        habitableStatus: 'POTENTIALLY_HABITABLE',
        habitabilityIndexPct: 74,
        funAnalogy: 'Outside Jupiter’s lethal radiation belts, making it the safest sanctuary for human bases!',
        description: 'Ancient, heavily cratered icy world holding a quiescent sub-surface conductive ocean.',
      },
    ],
  },
  {
    id: 'inner_solar',
    name: 'Inner Solar System',
    subtitle: 'Sun (Sol) & Terrestrial Planets • Our Cosmic Backyard',
    systemType: 'Main-Sequence Yellow Dwarf System',
    distanceLightYears: 0.0,
    centralStar: {
      name: 'The Sun (Sol)',
      spectralClass: 'G2V Yellow Dwarf',
      tempK: 5778,
      color: '#facc15',
      diameterSunRatio: 1.0,
    },
    habitableZoneAu: { min: 0.95, max: 1.67 },
    overviewLore:
      'Our home planetary system. Formed 4.6 billion years ago, its habitable zone encompasses Earth and reaches past the orbit of Mars. Understanding our own system is the baseline for comparing all exoplanets.',
    bodies: [
      {
        id: 'mercury',
        name: 'Mercury',
        type: 'TERRESTRIAL',
        orbitalRadiusAuOrKm: 0.387,
        actualDiameterKm: 4879,
        orbitalPeriodDays: 87.97,
        color: '#9ca3af',
        glowColor: 'rgba(156, 163, 175, 0.3)',
        orbitColor: 'rgba(156, 163, 175, 0.2)',
        surfaceTempC: '-180°C to +430°C',
        atmosphere: 'Exosphere (Sodium, Helium, Oxygen)',
        surfaceGravityG: 0.38,
        habitableStatus: 'NON_HABITABLE',
        habitabilityIndexPct: 4,
        funAnalogy: 'A dense ball of iron with a paper-thin rock crust baking under intense solar glare.',
        description: 'Innermost planet with extreme temperature swings and deep cratered polar ice traps.',
      },
      {
        id: 'venus',
        name: 'Venus',
        type: 'TERRESTRIAL',
        orbitalRadiusAuOrKm: 0.723,
        actualDiameterKm: 12104,
        orbitalPeriodDays: 224.7,
        color: '#fde047',
        glowColor: 'rgba(253, 224, 71, 0.4)',
        orbitColor: 'rgba(253, 224, 71, 0.25)',
        surfaceTempC: '+464°C (Runaway Greenhouse)',
        atmosphere: '96.5% Carbon Dioxide, Sulfuric Acid clouds',
        surfaceGravityG: 0.90,
        habitableStatus: 'NON_HABITABLE',
        habitabilityIndexPct: 14,
        funAnalogy: 'Earth’s runaway greenhouse twin: hot enough to melt lead, with pressure like 900m under the sea!',
        description: 'Shrouded in dense reflective clouds with crushing surface atmospheric pressure of 92 bar.',
      },
      {
        id: 'earth',
        name: 'Earth (The Pale Blue Dot)',
        type: 'TERRESTRIAL',
        orbitalRadiusAuOrKm: 1.0,
        actualDiameterKm: 12742,
        orbitalPeriodDays: 365.25,
        color: '#0284c7',
        glowColor: 'rgba(2, 132, 199, 0.5)',
        orbitColor: 'rgba(2, 132, 199, 0.4)',
        surfaceTempC: '+15°C (Average)',
        atmosphere: '78% Nitrogen, 21% Oxygen, 1% Argon/CO2',
        surfaceGravityG: 1.0,
        habitableStatus: 'IN_HABITABLE_ZONE',
        habitabilityIndexPct: 100,
        funAnalogy: 'The only known world with open oceans, plate tectonics, and thriving student space clubs!',
        description: 'Benchmark for planetary habitability: dynamic magnetic dynamo, liquid water, and active biosphere.',
      },
      {
        id: 'mars',
        name: 'Mars (The Red Planet)',
        type: 'TERRESTRIAL',
        orbitalRadiusAuOrKm: 1.524,
        actualDiameterKm: 6779,
        orbitalPeriodDays: 686.98,
        color: '#ef4444',
        glowColor: 'rgba(239, 68, 68, 0.4)',
        orbitColor: 'rgba(239, 68, 68, 0.25)',
        surfaceTempC: '-63°C',
        atmosphere: '95% Carbon Dioxide (0.006 atm)',
        surfaceGravityG: 0.38,
        habitableStatus: 'POTENTIALLY_HABITABLE',
        habitabilityIndexPct: 64,
        funAnalogy: 'Hosts Olympus Mons, a volcano three times the height of Mount Everest!',
        description: 'Dry, cold desert world with ancient dry river valleys, polar dry-ice caps, and subsurface ice.',
      },
    ],
  },
  {
    id: 'proxima',
    name: 'Proxima Centauri System',
    subtitle: 'Our Nearest Stellar Neighbor • Alpha Centauri Triple Star',
    systemType: 'Red Dwarf Planetary System',
    distanceLightYears: 4.246,
    centralStar: {
      name: 'Proxima Centauri',
      spectralClass: 'M5.5Ve Flare Star',
      tempK: 3042,
      color: '#ef4444',
      diameterSunRatio: 0.15,
    },
    habitableZoneAu: { min: 0.042, max: 0.095 },
    overviewLore:
      'At 4.25 light-years away, Proxima Centauri is the closest star to our Solar System. Its planet Proxima b is the closest known exoplanet to Earth and orbits squarely inside its star’s habitable zone.',
    bodies: [
      {
        id: 'proxima_d',
        name: 'Proxima d',
        type: 'EXOPLANET',
        orbitalRadiusAuOrKm: 0.0288,
        actualDiameterKm: 10200,
        orbitalPeriodDays: 5.12,
        color: '#fb923c',
        glowColor: 'rgba(251, 146, 60, 0.4)',
        orbitColor: 'rgba(251, 146, 60, 0.2)',
        surfaceTempC: '+87°C (360 K)',
        atmosphere: 'Tenuous / Sputtered',
        surfaceGravityG: 0.26,
        habitableStatus: 'NON_HABITABLE',
        habitabilityIndexPct: 19,
        funAnalogy: 'One of the lightest exoplanets ever discovered—only a quarter of Earth’s mass!',
        description: 'Sub-Earth mass world in rapid orbit close to its host flare star.',
        discoveryMethod: 'Radial Velocity (ESPRESSO / VLT)',
        discoveryYear: 2022,
      },
      {
        id: 'proxima_b',
        name: 'Proxima b (Nearest Exoplanet)',
        type: 'EXOPLANET',
        orbitalRadiusAuOrKm: 0.0485,
        actualDiameterKm: 13380,
        orbitalPeriodDays: 11.19,
        color: '#10b981',
        glowColor: 'rgba(16, 185, 129, 0.5)',
        orbitColor: 'rgba(16, 185, 129, 0.4)',
        surfaceTempC: '-39°C (Equilibrium)',
        atmosphere: 'Nitrogen / Carbon Dioxide / Water',
        surfaceGravityG: 1.08,
        habitableStatus: 'IN_HABITABLE_ZONE',
        habitabilityIndexPct: 87,
        funAnalogy: 'If extrasolar travel becomes real, Proxima b will be humanity’s very first destination!',
        description: 'Terrestrial exoplanet orbiting within the habitable zone; faces intense stellar flare activity.',
        discoveryMethod: 'Radial Velocity (HARPS / ESO)',
        discoveryYear: 2016,
      },
      {
        id: 'proxima_c',
        name: 'Proxima c',
        type: 'EXOPLANET',
        orbitalRadiusAuOrKm: 1.489,
        actualDiameterKm: 31800,
        orbitalPeriodDays: 1928,
        color: '#818cf8',
        glowColor: 'rgba(129, 140, 248, 0.4)',
        orbitColor: 'rgba(129, 140, 248, 0.2)',
        surfaceTempC: '-234°C (39 K)',
        atmosphere: 'Hydrogen / Helium / Methane',
        surfaceGravityG: 1.25,
        habitableStatus: 'NON_HABITABLE',
        habitabilityIndexPct: 12,
        funAnalogy: 'A freezing mini-Neptune coasting in the outer fringes, taking over 5 years to complete an orbit.',
        description: 'Candidate cold super-Earth or mini-Neptune far beyond the snow line.',
        discoveryMethod: 'Radial Velocity & Astrometry',
        discoveryYear: 2020,
      },
    ],
  },
  {
    id: 'kepler186',
    name: 'Kepler-186 System',
    subtitle: 'First Earth-Sized Habitable World Discovered • Cygnus',
    systemType: 'M-Dwarf Multiple Planetary System',
    distanceLightYears: 582,
    centralStar: {
      name: 'Kepler-186',
      spectralClass: 'M1V Red Dwarf',
      tempK: 3755,
      color: '#f87171',
      diameterSunRatio: 0.52,
    },
    habitableZoneAu: { min: 0.32, max: 0.70 },
    overviewLore:
      'In April 2014, NASA announced Kepler-186f: the historic first validated Earth-sized exoplanet orbiting within the habitable zone of another star, proving that temperate rocky worlds exist across the galaxy.',
    bodies: [
      {
        id: 'kepler186_b',
        name: 'Kepler-186b',
        type: 'EXOPLANET',
        orbitalRadiusAuOrKm: 0.0343,
        actualDiameterKm: 13630,
        orbitalPeriodDays: 3.89,
        color: '#fb923c',
        glowColor: 'rgba(251, 146, 60, 0.3)',
        orbitColor: 'rgba(251, 146, 60, 0.2)',
        surfaceTempC: '+310°C',
        atmosphere: 'Superheated silicate crust',
        surfaceGravityG: 1.1,
        habitableStatus: 'NON_HABITABLE',
        habitabilityIndexPct: 10,
        funAnalogy: 'Tidally locked with a scorching dayside magma ocean.',
        description: 'Innermost rocky world in a tight resonant orbit.',
        discoveryMethod: 'Transit Photometry (Kepler)',
        discoveryYear: 2014,
      },
      {
        id: 'kepler186_e',
        name: 'Kepler-186e',
        type: 'EXOPLANET',
        orbitalRadiusAuOrKm: 0.110,
        actualDiameterKm: 16180,
        orbitalPeriodDays: 22.41,
        color: '#fbbf24',
        glowColor: 'rgba(251, 191, 36, 0.4)',
        orbitColor: 'rgba(251, 191, 36, 0.25)',
        surfaceTempC: '+75°C',
        atmosphere: 'Dense steam / CO2',
        surfaceGravityG: 1.25,
        habitableStatus: 'NON_HABITABLE',
        habitabilityIndexPct: 35,
        funAnalogy: 'A super-Venus bathed in infrared warmth.',
        description: 'Sub-Neptune or super-Earth positioned just inside the habitable boundary.',
        discoveryMethod: 'Transit Photometry (Kepler)',
        discoveryYear: 2014,
      },
      {
        id: 'kepler186_f',
        name: 'Kepler-186f (Historic Discovery)',
        type: 'EXOPLANET',
        orbitalRadiusAuOrKm: 0.432,
        actualDiameterKm: 14900,
        orbitalPeriodDays: 129.9,
        color: '#34d399',
        glowColor: 'rgba(52, 211, 153, 0.5)',
        orbitColor: 'rgba(52, 211, 153, 0.4)',
        surfaceTempC: '-45°C to +10°C',
        atmosphere: 'Protective Nitrogen / CO2 greenhouse layer',
        surfaceGravityG: 1.05,
        habitableStatus: 'IN_HABITABLE_ZONE',
        habitabilityIndexPct: 84,
        funAnalogy: 'The very first Earth-sized planet ever confirmed in another star’s habitable zone!',
        description: 'Receives about 32% of the stellar flux Earth gets, making its midday look like an hour before sunset on Earth.',
        discoveryMethod: 'Transit Photometry (Kepler Space Telescope)',
        discoveryYear: 2014,
      },
    ],
  },
];

export default function ExpeditionSimulator() {
  const [selectedSystemId, setSelectedSystemId] = useState<string>('trappist1');
  const currentSystem = COSMIC_SYSTEMS.find((s) => s.id === selectedSystemId) || COSMIC_SYSTEMS[0];

  const [selectedBodyId, setSelectedBodyId] = useState<string>(currentSystem.bodies[3]?.id || currentSystem.bodies[0].id);
  const selectedBody =
    currentSystem.bodies.find((b) => b.id === selectedBodyId) || currentSystem.bodies[0];

  // Simulation controls
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [showHabitableZone, setShowHabitableZone] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'ORBITAL' | 'SCALE_COMPARISON' | 'TRANSIT_LIGHTCURVE'>('ORBITAL');
  const [briefingModalOpen, setBriefingModalOpen] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const anglesRef = useRef<{ [key: string]: number }>({});

  // Reset selected body when system changes
  const handleSystemChange = (sysId: string) => {
    setSelectedSystemId(sysId);
    const targetSys = COSMIC_SYSTEMS.find((s) => s.id === sysId) || COSMIC_SYSTEMS[0];
    const defaultBody = targetSys.bodies.find((b) => b.habitableStatus === 'IN_HABITABLE_ZONE') || targetSys.bodies[0];
    setSelectedBodyId(defaultBody.id);
  };

  // --- Main 2D Canvas Orbital Simulation Loop ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Deep space canvas background
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      // Subtle celestial coordinate grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.35)';
      ctx.lineWidth = 1;
      const step = 45;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const centerX = width * 0.5;
      const centerY = height * 0.5;

      // Update orbital angles
      if (isPlaying) {
        currentSystem.bodies.forEach((b) => {
          if (!anglesRef.current[b.id]) anglesRef.current[b.id] = Math.random() * Math.PI * 2;
          const orbitalSpeed = (1 / Math.max(1, b.orbitalPeriodDays)) * 0.08 * speedMultiplier;
          anglesRef.current[b.id] += orbitalSpeed;
        });
      }

      // 1. Draw Habitable Zone Torus (The Goldilocks Band)
      if (showHabitableZone && viewMode === 'ORBITAL') {
        const hzMinPx = 130;
        const hzMaxPx = 230;

        const hzGrad = ctx.createRadialGradient(centerX, centerY, hzMinPx, centerX, centerY, hzMaxPx);
        hzGrad.addColorStop(0, 'rgba(16, 185, 129, 0.02)');
        hzGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.12)');
        hzGrad.addColorStop(1, 'rgba(16, 185, 129, 0.02)');

        ctx.beginPath();
        ctx.arc(centerX, centerY, hzMaxPx, 0, Math.PI * 2);
        ctx.arc(centerX, centerY, hzMinPx, 0, Math.PI * 2, true);
        ctx.fillStyle = hzGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(centerX, centerY, (hzMinPx + hzMaxPx) * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#34d399';
        ctx.font = '700 9px ui-monospace, SFMono-Regular, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('HABITABLE "GOLDILOCKS" ZONE', centerX, centerY - (hzMinPx + hzMaxPx) * 0.5 - 6);
      }

      // 2. Draw Central Star
      const star = currentSystem.centralStar;
      const starRadius = Math.max(16, Math.min(32, star.diameterSunRatio * 28));

      // Star outer corona glow
      const coronaGrad = ctx.createRadialGradient(centerX, centerY, starRadius * 0.5, centerX, centerY, starRadius * 3.2);
      coronaGrad.addColorStop(0, star.color);
      coronaGrad.addColorStop(0.4, 'rgba(249, 115, 22, 0.25)');
      coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, starRadius * 3.2, 0, Math.PI * 2);
      ctx.fillStyle = coronaGrad;
      ctx.fill();

      // Star core sphere
      ctx.beginPath();
      ctx.arc(centerX, centerY, starRadius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.fill();

      // Star text label
      ctx.fillStyle = '#f8fafc';
      ctx.font = '700 10px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(star.name, centerX, centerY + starRadius + 15);

      // 3. Draw Orbit Rings & Celestial Bodies
      const totalBodies = currentSystem.bodies.length;
      const minRadiusPx = 55;
      const maxRadiusPx = Math.min(width, height) * 0.44;
      const radiusStep = (maxRadiusPx - minRadiusPx) / Math.max(1, totalBodies);

      currentSystem.bodies.forEach((b, idx) => {
        const orbitRadiusPx = minRadiusPx + (idx + 1) * radiusStep;
        const currentAngle = anglesRef.current[b.id] || 0;

        // Draw orbital trajectory ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbitRadiusPx, 0, Math.PI * 2);
        ctx.strokeStyle = b.orbitColor || 'rgba(100, 116, 139, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Calculate body position
        const bx = centerX + Math.cos(currentAngle) * orbitRadiusPx;
        const by = centerY + Math.sin(currentAngle) * orbitRadiusPx;

        const isSelected = selectedBodyId === b.id;
        const bodyRadius = Math.max(4.5, Math.min(14, (b.actualDiameterKm / 14000) * 8));

        // Selected body pulsing target bracket
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(bx, by, bodyRadius + 9, 0, Math.PI * 2);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Target reticle crosshairs
          ctx.beginPath();
          ctx.moveTo(bx - (bodyRadius + 14), by);
          ctx.lineTo(bx - (bodyRadius + 5), by);
          ctx.moveTo(bx + (bodyRadius + 5), by);
          ctx.lineTo(bx + (bodyRadius + 14), by);
          ctx.moveTo(bx, by - (bodyRadius + 14));
          ctx.lineTo(bx, by - (bodyRadius + 5));
          ctx.moveTo(bx, by + (bodyRadius + 5));
          ctx.lineTo(bx, by + (bodyRadius + 14));
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Body sphere
        ctx.beginPath();
        ctx.arc(bx, by, bodyRadius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.glowColor;
        ctx.shadowBlur = isSelected ? 15 : 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Planet text tag
        ctx.fillStyle = isSelected ? '#38bdf8' : '#e2e8f0';
        ctx.font = isSelected ? '700 10px system-ui, sans-serif' : '600 9px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(b.name.replace(/ \(.*\)/, ''), bx, by + bodyRadius + 12);
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [currentSystem, selectedBodyId, isPlaying, speedMultiplier, showHabitableZone, viewMode]);

  // Click on Canvas to Select Nearest Body
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const centerX = canvas.width * 0.5;
    const centerY = canvas.height * 0.5;

    const totalBodies = currentSystem.bodies.length;
    const minRadiusPx = 55;
    const maxRadiusPx = Math.min(canvas.width, canvas.height) * 0.44;
    const radiusStep = (maxRadiusPx - minRadiusPx) / Math.max(1, totalBodies);

    for (let idx = 0; idx < totalBodies; idx++) {
      const b = currentSystem.bodies[idx];
      const orbitRadiusPx = minRadiusPx + (idx + 1) * radiusStep;
      const angle = anglesRef.current[b.id] || 0;
      const bx = centerX + Math.cos(angle) * orbitRadiusPx;
      const by = centerY + Math.sin(angle) * orbitRadiusPx;

      const dist = Math.hypot(clickX - bx, clickY - by);
      if (dist < 28) {
        setSelectedBodyId(b.id);
        break;
      }
    }
  };

  // Touch on Canvas to Select Nearest Body (Mobile / Tablet)
  const handleCanvasTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const touch = e.changedTouches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const touchX = (touch.clientX - rect.left) * scaleX;
    const touchY = (touch.clientY - rect.top) * scaleY;

    const centerX = canvas.width * 0.5;
    const centerY = canvas.height * 0.5;

    const totalBodies = currentSystem.bodies.length;
    const minRadiusPx = 55;
    const maxRadiusPx = Math.min(canvas.width, canvas.height) * 0.44;
    const radiusStep = (maxRadiusPx - minRadiusPx) / Math.max(1, totalBodies);

    for (let idx = 0; idx < totalBodies; idx++) {
      const b = currentSystem.bodies[idx];
      const orbitRadiusPx = minRadiusPx + (idx + 1) * radiusStep;
      const angle = anglesRef.current[b.id] || 0;
      const bx = centerX + Math.cos(angle) * orbitRadiusPx;
      const by = centerY + Math.sin(angle) * orbitRadiusPx;

      const dist = Math.hypot(touchX - bx, touchY - by);
      if (dist < 34) {
        setSelectedBodyId(b.id);
        break;
      }
    }
  };

  return (
    <div className="cosmos-cockpit">
      {/* Top Command Ribbon */}
      <div className="cockpit-top-ribbon">
        <div className="ribbon-brand">
          <span className="ribbon-star">✦</span>
          <span className="station-badge">COSMIC ORRERY // MULTI-SYSTEM EXPLORER</span>
        </div>
        <div className="ribbon-telemetry">
          <span className="orbit-badge">
            <span className="status-live-dot"></span>
            {currentSystem.distanceLightYears === 0
              ? 'SOLAR SYSTEM (ORIGIN 0 LY)'
              : `${currentSystem.distanceLightYears} LIGHT YEARS FROM EARTH`}
          </span>
        </div>
      </div>

      {/* Main Command Header */}
      <div className="cockpit-header">
        <div className="header-left">
          <h2 className="deck-title">{currentSystem.name}</h2>
          <p className="deck-subtitle">{currentSystem.subtitle}</p>
        </div>

        {/* System Selector Dropdown & Briefing Modal */}
        <div className="header-actions">
          <div className="system-selector-group">
            <span className="selector-prefix">SECTOR:</span>
            <select
              className="system-select-dropdown"
              value={selectedSystemId}
              onChange={(e) => handleSystemChange(e.target.value)}
              aria-label="Select Cosmic System"
            >
              {COSMIC_SYSTEMS.map((sys) => (
                <option key={sys.id} value={sys.id}>
                  {sys.name} ({sys.centralStar.name})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="action-btn report-btn"
            onClick={() => setBriefingModalOpen(true)}
            title="Read system astrobiology briefing"
          >
            <img
              src="/icons/icon-certificate.jpg"
              alt=""
              width="14"
              height="14"
              style={{ borderRadius: '2px', objectFit: 'cover' }}
            />
            <span>SYSTEM DOSSIER</span>
          </button>
        </div>
      </div>

      {/* Static Mission Telemetry Badges (CLEAN STATIC READOUTS) */}
      <div className="telemetry-bar" aria-label="Static Stellar Telemetry">
        <div className="telemetry-card">
          <span className="card-label">CENTRAL STAR</span>
          <span className="card-value">{currentSystem.centralStar.name}</span>
          <span className="card-subtext">Class: {currentSystem.centralStar.spectralClass}</span>
        </div>

        <div className="telemetry-card">
          <span className="card-label">STELLAR TEMPERATURE</span>
          <span className="card-value">{currentSystem.centralStar.tempK.toLocaleString()} K</span>
          <span className="card-subtext">Radius: {currentSystem.centralStar.diameterSunRatio}x Solar</span>
        </div>

        <div className="telemetry-card">
          <span className="card-label">HABITABLE GOLDILOCKS ZONE</span>
          <span className="card-value">
            {currentSystem.habitableZoneAu.min} – {currentSystem.habitableZoneAu.max} AU
          </span>
          <span className="card-subtext">Water Stability Range</span>
        </div>

        <div className="telemetry-card">
          <span className="card-label">ACTIVE SELECTION</span>
          <span className="card-value">{selectedBody.name}</span>
          <span className="card-subtext">{selectedBody.type} // {selectedBody.surfaceTempC}</span>
        </div>

        <div className="telemetry-card">
          <span className="card-label">EARTH SIMILARITY (ESI)</span>
          <span className="card-value" style={{ color: selectedBody.habitabilityIndexPct > 70 ? '#34d399' : '#38bdf8' }}>
            {selectedBody.habitabilityIndexPct}%
          </span>
          <span className="card-subtext">Gravity: {selectedBody.surfaceGravityG}g</span>
        </div>
      </div>

      {/* Main Interactive Workspace */}
      <div className="deck-workspace">
        {/* Left Column: Interactive Canvas / Viewport */}
        <div className="viewport-col">
          <div className="canvas-container">
            {/* View Mode 1: Real-Time Orbital Orrery */}
            {viewMode === 'ORBITAL' && (
              <canvas
                ref={canvasRef}
                width={860}
                height={520}
                className="orrery-canvas"
                onClick={handleCanvasClick}
                onTouchEnd={handleCanvasTouch}
              />
            )}

            {/* View Mode 2: True Relative Planetary Scale Comparison */}
            {viewMode === 'SCALE_COMPARISON' && (
              <div className="scale-comparison-view">
                <div className="scale-header">
                  <span className="scale-title">TRUE RELATIVE PHYSICAL DIAMETERS</span>
                  <span className="scale-subtitle">Planetary sizes drawn to scale against Earth (12,742 km)</span>
                </div>
                <div className="scale-body-row">
                  {currentSystem.bodies.map((b) => {
                    const diameterPx = Math.max(22, Math.min(120, (b.actualDiameterKm / 14000) * 48));
                    const isSelected = selectedBodyId === b.id;
                    return (
                      <div
                        key={b.id}
                        className={`scale-body-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedBodyId(b.id)}
                      >
                        <div
                          className="scale-sphere"
                          style={{
                            width: `${diameterPx}px`,
                            height: `${diameterPx}px`,
                            backgroundColor: b.color,
                            boxShadow: `0 0 16px ${b.glowColor}`,
                          }}
                        />
                        <span className="scale-name">{b.name.replace(/ \(.*\)/, '')}</span>
                        <span className="scale-km">{b.actualDiameterKm.toLocaleString()} km</span>
                        <span className="scale-ratio">{(b.actualDiameterKm / 12742).toFixed(2)}x Earth</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View Mode 3: Exoplanet Transit Photometry Light Curve */}
            {viewMode === 'TRANSIT_LIGHTCURVE' && (
              <div className="transit-view">
                <div className="transit-header">
                  <span className="transit-title">TRANSIT PHOTOMETRY LIGHT CURVE SIMULATION</span>
                  <span className="transit-subtitle">
                    How NASA Kepler & JWST detect exoplanets when they block a fraction of stellar flux
                  </span>
                </div>
                <div className="transit-graph-box">
                  <svg viewBox="0 0 760 220" className="transit-svg">
                    <line x1="50" y1="40" x2="710" y2="40" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="50" y1="180" x2="710" y2="180" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    
                    {/* Transit Dip Curve */}
                    <path
                      d="M 60 50 L 260 50 Q 330 50 350 140 Q 380 165 410 140 Q 430 50 500 50 L 700 50"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3"
                    />
                    
                    {/* Measurement Labels */}
                    <text x="70" y="42" fill="#94a3b8" fontSize="11" fontFamily="monospace">100.0% Baseline Flux</text>
                    <text x="380" y="185" fill="#f43f5e" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      TRANSIT DEPTH ΔF = (R_planet / R_star)² = 0.84%
                    </text>
                    <text x="380" y="130" fill="#38bdf8" fontSize="11" textAnchor="middle" fontFamily="monospace">
                      {selectedBody.name} Mid-Transit
                    </text>
                  </svg>
                </div>
                <div className="transit-explanation">
                  <span className="transit-tag">METHODOLOGY:</span>
                  <p>
                    As <strong>{selectedBody.name}</strong> transits across the disc of{' '}
                    <strong>{currentSystem.centralStar.name}</strong>, it obscures a small percentage of the star’s light.
                    By measuring the depth and duration of this dip, astronomers determine the planet’s precise diameter,
                    orbital inclination, and atmospheric transmission spectrum.
                  </p>
                </div>
              </div>
            )}

            {/* Canvas HUD Controls Bar */}
            <div className="canvas-hud-bar">
              <div className="hud-view-modes">
                <button
                  type="button"
                  className={`hud-tab-btn ${viewMode === 'ORBITAL' ? 'active' : ''}`}
                  onClick={() => setViewMode('ORBITAL')}
                >
                  ORBITAL ORRERY
                </button>
                <button
                  type="button"
                  className={`hud-tab-btn ${viewMode === 'SCALE_COMPARISON' ? 'active' : ''}`}
                  onClick={() => setViewMode('SCALE_COMPARISON')}
                >
                  SCALE COMPARISON
                </button>
                <button
                  type="button"
                  className={`hud-tab-btn ${viewMode === 'TRANSIT_LIGHTCURVE' ? 'active' : ''}`}
                  onClick={() => setViewMode('TRANSIT_LIGHTCURVE')}
                >
                  TRANSIT PHOTOMETRY
                </button>
              </div>

              {viewMode === 'ORBITAL' && (
                <div className="hud-time-controls">
                  <button
                    type="button"
                    className="hud-ctrl-btn"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? '⏸ PAUSE' : '▶ RESUME'}
                  </button>
                  <button
                    type="button"
                    className={`hud-ctrl-btn ${showHabitableZone ? 'active' : ''}`}
                    onClick={() => setShowHabitableZone(!showHabitableZone)}
                  >
                    GOLDILOCKS ZONE: {showHabitableZone ? 'ON' : 'OFF'}
                  </button>
                  <div className="speed-pills">
                    {[0.5, 1.0, 5.0, 20.0].map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`speed-btn ${speedMultiplier === s ? 'active' : ''}`}
                        onClick={() => setSpeedMultiplier(s)}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Planetary Dossier & Educational Analysis */}
        <div className="sidebar-col">
          {/* Body Selector List */}
          <div className="sidebar-card">
            <span className="sidebar-category">SYSTEM ROSTER</span>
            <h3 className="sidebar-title">Planets & Moons</h3>

            <div className="body-roster-list">
              {currentSystem.bodies.map((b) => {
                const isSelected = selectedBodyId === b.id;
                return (
                  <div
                    key={b.id}
                    className={`roster-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedBodyId(b.id)}
                  >
                    <span className="roster-dot" style={{ backgroundColor: b.color, boxShadow: `0 0 8px ${b.glowColor}` }} />
                    <div className="roster-info">
                      <span className="roster-name">{b.name}</span>
                      <span className="roster-meta">
                        {b.orbitalPeriodDays}d Orbit • {b.surfaceTempC}
                      </span>
                    </div>
                    {b.habitableStatus === 'IN_HABITABLE_ZONE' && (
                      <span className="hz-badge" title="Inside Temperate Habitable Zone">HZ</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Selected Body Card */}
          <div className="sidebar-card target-dossier-card">
            <div className="dossier-header">
              <span className="sidebar-category">{selectedBody.type}</span>
              <span className={`status-pill pill-${selectedBody.habitableStatus.toLowerCase()}`}>
                {selectedBody.habitableStatus === 'IN_HABITABLE_ZONE'
                  ? 'HABITABLE ZONE'
                  : selectedBody.habitableStatus === 'POTENTIALLY_HABITABLE'
                  ? 'SUB-SURFACE OCEAN'
                  : 'EXTREME ENVIRONMENT'}
              </span>
            </div>

            <h4 className="dossier-name">{selectedBody.name}</h4>
            <p className="dossier-desc">{selectedBody.description}</p>

            {/* "In Plain English" Cosmic Analogy Box */}
            <div className="analogy-box">
              <span className="analogy-title">IN PLAIN ENGLISH (COSMIC ANALOGY):</span>
              <p className="analogy-text">"{selectedBody.funAnalogy}"</p>
            </div>

            {/* Physical Parameter Grid */}
            <div className="param-grid">
              <div className="param-cell">
                <span className="param-label">DIAMETER</span>
                <span className="param-val">{selectedBody.actualDiameterKm.toLocaleString()} km</span>
              </div>
              <div className="param-cell">
                <span className="param-label">SURFACE GRAVITY</span>
                <span className="param-val">{selectedBody.surfaceGravityG} g ({selectedBody.surfaceGravityG === 1 ? 'Earth Normal' : `${(selectedBody.surfaceGravityG * 100).toFixed(0)}% Earth`})</span>
              </div>
              <div className="param-cell">
                <span className="param-label">SURFACE TEMP</span>
                <span className="param-val">{selectedBody.surfaceTempC}</span>
              </div>
              <div className="param-cell">
                <span className="param-label">ORBITAL PERIOD</span>
                <span className="param-val">{selectedBody.orbitalPeriodDays} Earth Days</span>
              </div>
            </div>

            {/* Atmosphere Readout */}
            <div className="atm-box">
              <span className="atm-label">ATMOSPHERIC COMPOSITION:</span>
              <span className="atm-val">{selectedBody.atmosphere}</span>
            </div>

            {selectedBody.discoveryMethod && (
              <div className="discovery-footer">
                <span>Discovered via {selectedBody.discoveryMethod} ({selectedBody.discoveryYear})</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Dossier Briefing Modal */}
      {briefingModalOpen && (
        <div className="modal-overlay" onClick={() => setBriefingModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-tag">CALLISTO ASTRONOMICAL ARCHIVE // SYSTEM BRIEFING</div>
              <h3 className="modal-title">{currentSystem.name} Comprehensive Dossier</h3>
            </div>
            <div className="modal-content">
              <h4>1. System Architecture & Context</h4>
              <p>{currentSystem.overviewLore}</p>
              <h4>2. The Habitable Zone (The Goldilocks Band)</h4>
              <p>
                The circumstellar habitable zone ({currentSystem.habitableZoneAu.min} AU to {currentSystem.habitableZoneAu.max} AU)
                is the distance from a star where liquid water can pool on a planet’s surface without freezing or boiling away.
                Around dim red dwarf stars like TRAPPIST-1 and Proxima Centauri, this band is extremely close to the star—often
                orbiting in days rather than years.
              </p>
              <h4>3. Detection & Astrobiological Potential</h4>
              <p>
                Transit photometry measures tiny dips in star brightness to determine exoplanet sizes. By pairing transit data
                with transmission spectroscopy from the James Webb Space Telescope (JWST), astronomers search for biosignatures:
                water vapor, carbon dioxide, methane, and oxygen in these alien atmospheres.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="action-btn report-btn"
                onClick={() => setBriefingModalOpen(false)}
              >
                RETURN TO ORBITAL EXPLORER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded High-Contrast Stylesheet */}
      <style>{`
        .cosmos-cockpit {
          background-color: var(--surface, #0c121e);
          border: 1px solid color-mix(in srgb, var(--border, #334155) 45%, transparent);
          border-radius: var(--radius-lg, 12px);
          overflow: hidden;
          font-family: var(--font-mono, ui-monospace, SFMono-Regular, monospace);
          color: var(--moon, #f8fafc);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
        }

        .cockpit-top-ribbon {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 2rem;
          background: rgba(6, 10, 18, 0.95);
          border-bottom: 1px solid rgba(56, 189, 248, 0.2);
          flex-wrap: wrap;
          gap: 0.65rem;
        }

        .ribbon-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .ribbon-star {
          color: #38bdf8;
          font-size: 0.85rem;
        }

        .station-badge {
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.35);
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
        }

        .ribbon-telemetry {
          display: flex;
          align-items: center;
        }

        .status-live-dot {
          width: 7px;
          height: 7px;
          background-color: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 8px #10b981;
          display: inline-block;
          margin-right: 0.45rem;
        }

        .orbit-badge {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #94a3b8;
          background: rgba(148, 163, 184, 0.08);
          border: 1px solid rgba(148, 163, 184, 0.2);
          padding: 0.25rem 0.65rem;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
        }

        .cockpit-header {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid color-mix(in srgb, var(--border, #334155) 35%, transparent);
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(12, 18, 30, 0.6) 100%);
        }

        @media (min-width: 860px) {
          .cockpit-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
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
          align-items: center;
        }

        .system-selector-group {
          display: flex;
          align-items: center;
          background: #0f172a;
          border: 1px solid rgba(56, 189, 248, 0.45);
          border-radius: 6px;
          padding-left: 0.75rem;
          color-scheme: dark;
        }

        .selector-prefix {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #38bdf8;
        }

        .system-select-dropdown {
          background-color: #0f172a;
          color: #38bdf8;
          border: none;
          padding: 0.65rem 0.85rem;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          outline: none;
          color-scheme: dark;
        }

        .system-select-dropdown option {
          background-color: #0b1120;
          color: #f8fafc;
          padding: 0.6rem 1rem;
          font-weight: 600;
        }

        .system-select-dropdown option:checked,
        .system-select-dropdown option:hover {
          background-color: #0284c7;
          color: #ffffff;
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
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

        /* Workspace Grid */
        .deck-workspace {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          padding: 1.75rem 2rem;
        }

        @media (min-width: 1024px) {
          .deck-workspace {
            grid-template-columns: 1fr 340px;
          }
        }

        .canvas-container {
          position: relative;
          background: #060a12;
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .orrery-canvas {
          width: 100%;
          height: auto;
          aspect-ratio: 860 / 520;
          display: block;
          cursor: crosshair;
        }

        /* Scale Comparison View */
        .scale-comparison-view {
          padding: 2rem;
          min-height: 480px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 2rem;
        }

        .scale-header {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .scale-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #38bdf8;
          letter-spacing: 0.05em;
        }

        .scale-subtitle {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .scale-body-row {
          display: flex;
          align-items: flex-end;
          gap: 1.5rem;
          overflow-x: auto;
          padding: 2rem 1rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(51, 65, 85, 0.4);
          border-radius: 8px;
        }

        .scale-body-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          min-width: 90px;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .scale-body-item:hover,
        .scale-body-item.selected {
          background: rgba(56, 189, 248, 0.12);
        }

        .scale-sphere {
          border-radius: 50%;
        }

        .scale-name {
          font-size: 0.78rem;
          font-weight: 700;
          color: #ffffff;
          text-align: center;
        }

        .scale-km {
          font-size: 0.7rem;
          color: #38bdf8;
        }

        .scale-ratio {
          font-size: 0.65rem;
          color: #94a3b8;
        }

        /* Transit View */
        .transit-view {
          padding: 1.5rem;
          min-height: 480px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .transit-header {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .transit-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #38bdf8;
          letter-spacing: 0.05em;
        }

        .transit-subtitle {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .transit-graph-box {
          background: rgba(7, 11, 19, 0.8);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 8px;
          padding: 1rem;
        }

        .transit-svg {
          width: 100%;
          height: auto;
        }

        .transit-explanation {
          background: rgba(15, 23, 42, 0.6);
          border-left: 2px solid #38bdf8;
          padding: 0.85rem 1rem;
          border-radius: 0 6px 6px 0;
          font-size: 0.78rem;
          line-height: 1.6;
          color: #cbd5e1;
        }

        .transit-tag {
          font-weight: 800;
          color: #38bdf8;
          margin-right: 0.5rem;
        }

        /* Canvas Bottom HUD Bar */
        .canvas-hud-bar {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          background: rgba(8, 12, 20, 0.95);
          border-top: 1px solid rgba(51, 65, 85, 0.4);
        }

        .hud-view-modes {
          display: flex;
          gap: 0.4rem;
        }

        .hud-tab-btn {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(51, 65, 85, 0.5);
          color: #94a3b8;
          padding: 0.4rem 0.75rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .hud-tab-btn:hover {
          color: #ffffff;
        }

        .hud-tab-btn.active {
          background: rgba(56, 189, 248, 0.2);
          color: #38bdf8;
          border-color: #38bdf8;
        }

        .hud-time-controls {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .hud-ctrl-btn {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(51, 65, 85, 0.5);
          color: #e2e8f0;
          padding: 0.4rem 0.7rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          cursor: pointer;
        }

        .hud-ctrl-btn.active {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          border-color: #10b981;
        }

        .speed-pills {
          display: flex;
          gap: 0.25rem;
        }

        .speed-btn {
          background: transparent;
          border: 1px solid rgba(51, 65, 85, 0.5);
          color: #94a3b8;
          padding: 0.35rem 0.55rem;
          border-radius: 4px;
          font-size: 0.68rem;
          font-weight: 700;
          cursor: pointer;
        }

        .speed-btn.active {
          background: #38bdf8;
          color: #070b13;
          border-color: #38bdf8;
        }

        /* Sidebar Column */
        .sidebar-col {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .sidebar-card {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 8px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .sidebar-category {
          font-size: 0.68rem;
          font-weight: 700;
          color: #38bdf8;
          letter-spacing: 0.08em;
        }

        .sidebar-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .body-roster-list {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          max-height: 230px;
          overflow-y: auto;
        }

        .roster-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.75rem;
          background: rgba(7, 11, 19, 0.6);
          border: 1px solid rgba(51, 65, 85, 0.4);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .roster-item:hover {
          border-color: #38bdf8;
          background: rgba(15, 23, 42, 0.85);
        }

        .roster-item.selected {
          border-color: #38bdf8;
          background: rgba(56, 189, 248, 0.12);
        }

        .roster-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .roster-info {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          flex: 1;
        }

        .roster-name {
          font-size: 0.78rem;
          font-weight: 700;
          color: #f1f5f9;
        }

        .roster-meta {
          font-size: 0.68rem;
          color: #94a3b8;
        }

        .hz-badge {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          border: 1px solid #10b981;
          font-size: 0.62rem;
          font-weight: 800;
          padding: 0.1rem 0.35rem;
          border-radius: 3px;
        }

        /* Selected Target Dossier Card */
        .dossier-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status-pill {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }

        .pill-in_habitable_zone {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
        }

        .pill-potentially_habitable {
          background: rgba(56, 189, 248, 0.2);
          color: #38bdf8;
        }

        .pill-non_habitable {
          background: rgba(244, 63, 94, 0.2);
          color: #fb7185;
        }

        .dossier-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .dossier-desc {
          font-size: 0.76rem;
          line-height: 1.5;
          color: #cbd5e1;
          margin: 0;
          font-family: var(--font-body, inherit);
        }

        .analogy-box {
          background: rgba(2, 6, 23, 0.65);
          border-left: 2px solid #f59e0b;
          padding: 0.65rem 0.85rem;
          border-radius: 0 4px 4px 0;
        }

        .analogy-title {
          font-size: 0.62rem;
          font-weight: 800;
          color: #fbbf24;
          display: block;
          margin-bottom: 0.25rem;
        }

        .analogy-text {
          font-size: 0.74rem;
          line-height: 1.5;
          color: #fef3c7;
          font-style: italic;
          margin: 0;
        }

        .param-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          background: rgba(7, 11, 19, 0.6);
          padding: 0.75rem;
          border-radius: 6px;
        }

        .param-cell {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .param-label {
          font-size: 0.62rem;
          color: #64748b;
          font-weight: 700;
        }

        .param-val {
          font-size: 0.74rem;
          color: #38bdf8;
          font-weight: 700;
        }

        .atm-box {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          font-size: 0.72rem;
        }

        .atm-label {
          font-size: 0.62rem;
          color: #94a3b8;
          font-weight: 700;
        }

        .atm-val {
          color: #e2e8f0;
        }

        .discovery-footer {
          border-top: 1px solid rgba(51, 65, 85, 0.4);
          padding-top: 0.5rem;
          font-size: 0.65rem;
          color: #64748b;
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

        /* Responsive Mobile Breakpoints */
        @media (max-width: 768px) {
          .command-ribbon {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .system-selector-bar {
            width: 100%;
            overflow-x: auto;
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
          }
          .system-btn {
            flex-shrink: 0;
            white-space: nowrap;
          }
          .telemetry-bar {
            grid-template-columns: repeat(2, 1fr);
          }
          .canvas-hud-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .view-toggle-group {
            width: 100%;
            overflow-x: auto;
          }
        }

        @media (max-width: 480px) {
          .telemetry-bar {
            grid-template-columns: 1fr;
          }
          .orrery-canvas {
            height: 340px;
          }
        }
      `}</style>
    </div>
  );
}
