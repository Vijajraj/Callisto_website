import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  playTelemetryBeep,
  playBeaconPing,
  playThrusterBurst,
  playWarpSurge,
} from '../../lib/audio';

interface BeaconSite {
  id: number;
  x: number; // world X coordinate in meters
  name: string;
  deployed: boolean;
  scoreValue: number;
}

interface FuelCanister {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

interface TerrainPoint {
  x: number;
  y: number;
}

interface ActMission {
  id: number;
  act: string;
  name: string;
  objective: string;
  storyBrief: string;
  destinationName: string;
  distanceKm: number;
  terrainSeed: number;
  beacons: { name: string; xPct: number }[];
  fuelCount: number;
  hazardSpikesCount: number;
  badge: string;
}

export default function ExpeditionSimulator(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // High-Level State
  const [missionIndex, setMissionIndex] = useState<number>(0);
  const [stage, setStage] = useState<'briefing' | 'driving' | 'finished' | 'flipped'>('briefing');
  const [score, setScore] = useState<number>(0);
  const [beaconsDeployed, setBeaconsDeployed] = useState<number>(0);
  const [fuel, setFuel] = useState<number>(100);
  const [earnedBadge, setEarnedBadge] = useState<string | null>(null);

  // Live HUD Readouts
  const [telemetry, setTelemetry] = useState({
    speedKmh: 0,
    distanceM: 0,
    totalDistanceM: 2400,
    airtimeSec: 0,
    status: 'SURFACE ROVER SYSTEMS NOMINAL',
  });

  const MISSIONS: ActMission[] = [
    {
      id: 0,
      act: 'ACT I',
      name: 'Asgard Basin Rim Exploration',
      objective: 'Drive the Callisto rover across rolling crater dunes, deploy 3 scientific sensor masts, and reach the Outpost Alpha airlock.',
      storyBrief: 'Touching down on the outer perimeter of Asgard Basin. Drive east through low-gravity basalt dunes, scout ice ridges, and deploy telemetry anchors.',
      destinationName: 'Outpost Alpha Airlock',
      distanceKm: 2.2,
      terrainSeed: 101,
      beacons: [
        { name: 'Magnetometer Mast 01', xPct: 0.28 },
        { name: 'Saline Core Drill Site', xPct: 0.58 },
        { name: 'Thermal Flux Sensor', xPct: 0.84 },
      ],
      fuelCount: 7,
      hazardSpikesCount: 3,
      badge: 'Asgard Rim Surveyor',
    },
    {
      id: 1,
      act: 'ACT II',
      name: 'Utgard Fracture Chasm',
      objective: 'Traverse treacherous tectonic crevasses. Use jump jet thrusters to leap across ice chasms and deploy 3 deep-strata transceivers.',
      storyBrief: 'The Utgard fault line features steep ice cliffs and deep ravines. Maintain forward momentum and engage ventral thrusters [SPACE] over chasms.',
      destinationName: 'Utgard Seismic Station',
      distanceKm: 2.8,
      terrainSeed: 204,
      beacons: [
        { name: 'Faultline Strain Gauge', xPct: 0.32 },
        { name: 'Cryovolcanic Vent Sensor', xPct: 0.62 },
        { name: 'Subsurface Echo Relay', xPct: 0.86 },
      ],
      fuelCount: 8,
      hazardSpikesCount: 6,
      badge: 'Chasm Pilot Vanguard',
    },
    {
      id: 2,
      act: 'ACT III',
      name: 'Valhalla Multiring Ridge',
      objective: 'Climb the colossal concentric ripple ridges of the Valhalla impact basin. Gather telemetry canisters and deploy 4 array antennas.',
      storyBrief: 'Approaching the vast Valhalla multi-ring system, the largest impact structure in the Jovian system. Steep terraced scarps ahead.',
      destinationName: 'Valhalla Outer Gate',
      distanceKm: 3.2,
      terrainSeed: 309,
      beacons: [
        { name: 'Crater Ridge Beacon A', xPct: 0.22 },
        { name: 'Impact Glass Core Probe', xPct: 0.48 },
        { name: 'Aurora Interceptor Mast', xPct: 0.72 },
        { name: 'Outer Gateway Beacon', xPct: 0.9 },
      ],
      fuelCount: 10,
      hazardSpikesCount: 8,
      badge: 'Valhalla Ridge Master',
    },
    {
      id: 3,
      act: 'ACT IV',
      name: 'Callisto Expedition Main Colony Touchdown',
      objective: 'Final approach to Callisto Primary Habitat Colony! Speed through the frost dunes and drive safely inside Dome Bay 01.',
      storyBrief: 'Callisto Base is in sight on the horizon beneath Jupiter’s glowing auroral disk. Deploy the final expedition flag and enter the pressurized hangar.',
      destinationName: 'Callisto Dome Bay 01',
      distanceKm: 3.6,
      terrainSeed: 412,
      beacons: [
        { name: 'Colony Guidance Relay', xPct: 0.25 },
        { name: 'Hydroponics Dome Sensor', xPct: 0.52 },
        { name: 'Main Power Grid Beacon', xPct: 0.76 },
        { name: 'Expedition Memorial Marker', xPct: 0.92 },
      ],
      fuelCount: 12,
      hazardSpikesCount: 6,
      badge: 'Callisto Base Pioneer',
    },
  ];

  const currentMission = MISSIONS[missionIndex];

  // Engine Physics Mutable State Ref
  const engineRef = useRef({
    // Rover state in world space
    rover: {
      x: 100, // world position X
      y: 0, // world position Y (calculated from terrain)
      vx: 0,
      vy: 0,
      angle: 0,
      angVel: 0,
      onGround: true,
      fuel: 100,
      nitroCooldown: 0,
      wheelRot: 0,
      suspensionCompression: 0,
      airtimeFrames: 0,
    },
    camera: { x: 0, y: 0 },
    keys: {
      forward: false,
      backward: false,
      jump: false,
      boost: false,
    },
    touchControls: {
      forward: false,
      backward: false,
      jump: false,
      boost: false,
    },
    terrain: [] as TerrainPoint[],
    beacons: [] as BeaconSite[],
    fuelItems: [] as FuelCanister[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number }[],
    stars: [] as { x: number; y: number; size: number; alpha: number }[],
    totalTrackLength: 2600,
    lastSoundTime: 0,
  });

  // Procedural Terrain Height Generator for Callisto Crater Surface
  const getTerrainHeight = (worldX: number, seed: number): number => {
    // Multi-octave sinusoidal terrain with craters
    const baseHeight = 380;
    const wave1 = Math.sin(worldX * 0.0032 + seed) * 45;
    const wave2 = Math.sin(worldX * 0.009 + seed * 2) * 22;
    const wave3 = Math.cos(worldX * 0.0012 + seed * 0.5) * 60;

    // Crater dips
    let craterDip = 0;
    const craterSpacing = 650;
    const localX = (worldX + seed * 100) % craterSpacing;
    if (localX > 180 && localX < 380) {
      const craterCenter = 280;
      const distFromCenter = Math.abs(localX - craterCenter);
      craterDip = Math.max(0, (1 - distFromCenter / 100)) * 55;
    }

    return baseHeight + wave1 + wave2 + wave3 + craterDip;
  };

  // Initialize Act Mission
  const initMission = useCallback(
    (index: number) => {
      const m = MISSIONS[index];
      const eng = engineRef.current;
      const trackLength = m.distanceKm * 1000;
      eng.totalTrackLength = trackLength;

      // Generate sampled terrain points for world track
      const pts: TerrainPoint[] = [];
      const step = 20;
      for (let x = -200; x <= trackLength + 400; x += step) {
        pts.push({ x, y: getTerrainHeight(x, m.terrainSeed) });
      }
      eng.terrain = pts;

      // Spawn Beacons along the track
      eng.beacons = m.beacons.map((b, i) => ({
        id: i,
        x: trackLength * b.xPct,
        name: b.name,
        deployed: false,
        scoreValue: 350,
      }));

      // Spawn Fuel Canisters
      eng.fuelItems = [];
      for (let i = 0; i < m.fuelCount; i++) {
        const itemX = 250 + (i / m.fuelCount) * (trackLength - 500) + (Math.random() - 0.5) * 80;
        const groundY = getTerrainHeight(itemX, m.terrainSeed);
        eng.fuelItems.push({
          id: i,
          x: itemX,
          y: groundY - 35 - Math.random() * 30, // floating above terrain
          collected: false,
        });
      }

      // Stars in sky
      if (eng.stars.length === 0) {
        for (let i = 0; i < 120; i++) {
          eng.stars.push({
            x: Math.random() * 1160,
            y: Math.random() * 320,
            size: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.7 + 0.3,
          });
        }
      }

      // Reset Rover position
      const startGroundY = getTerrainHeight(100, m.terrainSeed);
      eng.rover = {
        x: 100,
        y: startGroundY - 22,
        vx: 0,
        vy: 0,
        angle: 0,
        angVel: 0,
        onGround: true,
        fuel: 100,
        nitroCooldown: 0,
        wheelRot: 0,
        suspensionCompression: 0,
        airtimeFrames: 0,
      };

      eng.particles = [];
      setScore(0);
      setBeaconsDeployed(0);
      setFuel(100);
      setEarnedBadge(null);
      setStage('driving');
    },
    [MISSIONS]
  );

  const startMission = () => {
    initMission(missionIndex);
    playTelemetryBeep(980, 0.15);
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = engineRef.current.keys;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        keys.forward = true;
        e.preventDefault();
      }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        keys.backward = true;
        e.preventDefault();
      }
      if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
        keys.jump = true;
        e.preventDefault();
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        keys.boost = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keys = engineRef.current.keys;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.forward = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.backward = false;
      if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') keys.jump = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.boost = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 60 FPS Physics Simulation & Render Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let soundThrottle = 0;

    const gameLoop = () => {
      animId = requestAnimationFrame(gameLoop);
      const eng = engineRef.current;
      const rover = eng.rover;
      const m = currentMission;

      // 1. CLEAR VIEWPORT WITH DEEP SPACE OBSIDIAN VOID
      ctx.fillStyle = '#0B0507';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. DRAW STARFIELD WITH PARALLAX DRIFT
      ctx.fillStyle = '#FFFFFF';
      eng.stars.forEach((star) => {
        const parallaxX = (star.x - rover.x * 0.08) % canvas.width;
        const drawX = parallaxX < 0 ? parallaxX + canvas.width : parallaxX;
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(drawX, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // 3. DRAW JUPITER & CALLISTO'S SKY HORIZON
      drawSkyCelestialBodies(ctx, canvas, rover.x);

      // If briefing or victory, render background scene and exit update
      if (stage === 'briefing') {
        drawTerrainSlice(ctx, eng.terrain, 0, canvas);
        return;
      }

      // 4. ROVER PHYSICAL SIMULATION
      if (stage === 'driving') {
        const isFwd = eng.keys.forward || eng.touchControls.forward;
        const isBack = eng.keys.backward || eng.touchControls.backward;
        const isJump = eng.keys.jump || eng.touchControls.jump;
        const isBoost = eng.keys.boost || eng.touchControls.boost;

        // Ground Height at current rover X
        const groundY = getTerrainHeight(rover.x, m.terrainSeed);
        const frontGroundY = getTerrainHeight(rover.x + 18, m.terrainSeed);
        const backGroundY = getTerrainHeight(rover.x - 18, m.terrainSeed);
        const slopeAngle = Math.atan2(frontGroundY - backGroundY, 36);

        // Callisto Low Gravity: 0.18 (very floaty, authentic moon physics)
        const gravity = 0.22;
        rover.vy += gravity;

        // Drive Acceleration
        const accel = rover.onGround ? (isBoost ? 0.32 : 0.16) : 0.06;
        if (isFwd && rover.fuel > 0) {
          rover.vx += Math.cos(rover.angle) * accel;
          rover.wheelRot += 0.25;
          rover.fuel = Math.max(0, rover.fuel - (isBoost ? 0.08 : 0.02));
        }
        if (isBack) {
          rover.vx -= Math.cos(rover.angle) * (accel * 0.8);
          rover.wheelRot -= 0.2;
        }

        // Air Tilt Controls (balance the rover mid-jump)
        if (!rover.onGround) {
          if (isBack) rover.angVel -= 0.005;
          if (isFwd) rover.angVel += 0.005;
          rover.airtimeFrames++;
        } else {
          rover.airtimeFrames = 0;
        }

        // Jump Jet Thrusters
        if (isJump && rover.fuel > 0) {
          rover.vy -= 0.48; // Upward jet burst
          rover.fuel = Math.max(0, rover.fuel - 0.12);

          // Thruster exhaust particles
          for (let p = 0; p < 2; p++) {
            eng.particles.push({
              x: rover.x - Math.sin(rover.angle) * 8 + (Math.random() - 0.5) * 10,
              y: rover.y + 14,
              vx: -Math.sin(rover.angle) * 2 + (Math.random() - 0.5) * 2,
              vy: 3 + Math.random() * 3,
              life: 1,
              color: Math.random() > 0.4 ? '#F43F5E' : '#FF6633',
              size: Math.random() * 3 + 2,
            });
          }

          soundThrottle++;
          if (soundThrottle % 12 === 0) {
            playThrusterBurst();
          }
        }

        // Apply velocities
        rover.x += rover.vx;
        rover.y += rover.vy;
        rover.angle += rover.angVel;
        rover.angVel *= 0.92;

        // Ground Contact & Terrain Collision
        const chassisRadius = 18;
        if (rover.y >= groundY - chassisRadius) {
          rover.y = groundY - chassisRadius;
          rover.vy = 0;
          rover.onGround = true;

          // Align rover angle to terrain slope with damping
          const targetAngle = slopeAngle;
          rover.angle += (targetAngle - rover.angle) * 0.22;

          // Rolling friction
          rover.vx *= 0.985;

          // Emit ground dust particles when driving fast
          if (Math.abs(rover.vx) > 2) {
            eng.particles.push({
              x: rover.x - Math.cos(rover.angle) * 16,
              y: rover.y + 16,
              vx: -rover.vx * 0.3 + (Math.random() - 0.5) * 1.5,
              vy: -0.5 - Math.random() * 1.5,
              life: 1,
              color: '#8C7F87',
              size: Math.random() * 3 + 1.5,
            });
          }
        } else {
          rover.onGround = false;
        }

        // Nitro Boost surge
        if (isBoost && rover.nitroCooldown === 0 && rover.fuel > 15) {
          rover.vx += Math.cos(rover.angle) * 3.5;
          rover.nitroCooldown = 90;
          rover.fuel -= 10;
          playWarpSurge();
        }
        if (rover.nitroCooldown > 0) rover.nitroCooldown--;

        // Check Beacons Deployment
        eng.beacons.forEach((b) => {
          if (!b.deployed) {
            const dist = Math.abs(b.x - rover.x);
            if (dist < 45) {
              b.deployed = true;
              setBeaconsDeployed((prev) => prev + 1);
              setScore((s) => s + b.scoreValue);
              playBeaconPing(1320, 0.4);

              // Celebration beacon spark particles
              for (let i = 0; i < 25; i++) {
                const angle = Math.random() * Math.PI * 2;
                eng.particles.push({
                  x: b.x,
                  y: getTerrainHeight(b.x, m.terrainSeed) - 40,
                  vx: Math.cos(angle) * (2 + Math.random() * 4),
                  vy: Math.sin(angle) * (2 + Math.random() * 4),
                  life: 1,
                  color: '#4ade80',
                  size: 2.5,
                });
              }
            }
          }
        });

        // Check Fuel Items
        eng.fuelItems.forEach((f) => {
          if (!f.collected) {
            const d = Math.hypot(f.x - rover.x, f.y - rover.y);
            if (d < 35) {
              f.collected = true;
              rover.fuel = Math.min(100, rover.fuel + 25);
              setScore((s) => s + 100);
              playBeaconPing(1760, 0.2);
            }
          }
        });

        // Check End Destination
        if (rover.x >= eng.totalTrackLength) {
          // MISSION COMPLETED!
          setStage('finished');
          setEarnedBadge(m.badge);
          playBeaconPing(1760, 0.6);
          playWarpSurge();
        }

        // Live Telemetry Readout
        setFuel(Math.round(rover.fuel));
        const currentSpeedKmh = Math.round(Math.abs(rover.vx) * 18);
        setTelemetry({
          speedKmh: currentSpeedKmh,
          distanceM: Math.round(rover.x),
          totalDistanceM: Math.round(eng.totalTrackLength),
          airtimeSec: Number((rover.airtimeFrames / 60).toFixed(1)),
          status:
            rover.fuel < 20
              ? 'WARNING: LOW POWER CELL'
              : !rover.onGround
              ? 'LOW-GRAVITY TRAJECTORY LEAP'
              : 'ROVER TRACTION NOMINAL',
        });
      }

      // Smooth Camera tracking rover horizontally
      const targetCamX = rover.x - canvas.width * 0.35;
      eng.camera.x += (targetCamX - eng.camera.x) * 0.1;

      // 5. RENDER SCENE WITH CAMERA OFFSET
      ctx.save();
      ctx.translate(-eng.camera.x, 0);

      // A. Callisto Rugged Crater Surface
      drawTerrainSlice(ctx, eng.terrain, eng.camera.x, canvas);

      // B. Beacons & Science Sites
      eng.beacons.forEach((b) => {
        const by = getTerrainHeight(b.x, m.terrainSeed);
        drawBeaconSite(ctx, b, by);
      });

      // C. Fuel Cells
      eng.fuelItems.forEach((f) => {
        if (!f.collected) {
          drawFuelCanister(ctx, f.x, f.y);
        }
      });

      // D. Final Destination Hangar (Callisto Base)
      drawEndDestination(ctx, eng.totalTrackLength, getTerrainHeight(eng.totalTrackLength, m.terrainSeed), m.destinationName);

      // E. Particles
      eng.particles = eng.particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.04;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        return p.life > 0;
      });

      // F. The Callisto Expedition Surface Rover
      drawRover(ctx, rover);

      ctx.restore();
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [stage, missionIndex]);

  // Cross-browser canvas rounded rectangle polyfill (Safari < 16.2 / legacy Android WebView fallback)
  const drawCompatRoundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, width, height, radius);
    } else {
      const r = Math.min(radius, width / 2, height / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + width - r, y);
      ctx.arcTo(x + width, y, x + width, y + r, r);
      ctx.lineTo(x + width, y + height - r);
      ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
      ctx.lineTo(x + r, y + height);
      ctx.arcTo(x, y + height, x, y + height - r, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
    }
  };

  // Renderer: Sky with Jupiter & Auroral Bands
  const drawSkyCelestialBodies = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, roverX: number) => {
    // Vast Jovian gas giant in sky with parallax
    const jupX = canvas.width * 0.75 - (roverX * 0.02) % (canvas.width * 0.5);
    const jupY = 95;
    const jupRadius = 68;

    // Jupiter atmospheric glow
    const jupGrad = ctx.createRadialGradient(jupX, jupY, jupRadius * 0.7, jupX, jupY, jupRadius * 1.6);
    jupGrad.addColorStop(0, '#E05A2B');
    jupGrad.addColorStop(0.5, 'rgba(244, 63, 94, 0.35)');
    jupGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = jupGrad;
    ctx.beginPath();
    ctx.arc(jupX, jupY, jupRadius * 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Jupiter planet body
    ctx.beginPath();
    ctx.arc(jupX, jupY, jupRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#E05A2B';
    ctx.fill();

    // Jupiter storm bands
    ctx.save();
    ctx.clip();
    ctx.fillStyle = '#991B1B';
    ctx.fillRect(jupX - jupRadius, jupY - 14, jupRadius * 2, 9);
    ctx.fillRect(jupX - jupRadius, jupY + 8, jupRadius * 2, 14);
    ctx.fillStyle = '#FF7A00';
    ctx.fillRect(jupX - jupRadius, jupY + 28, jupRadius * 2, 6);
    ctx.restore();

    // Distant jagged Callisto mountain silhouettes (titanium steel haze)
    ctx.fillStyle = 'rgba(43, 18, 28, 0.45)';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (let x = 0; x <= canvas.width; x += 60) {
      const my = 290 + Math.sin(x * 0.01 + roverX * 0.0008) * 35;
      ctx.lineTo(x, my);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();
  };

  // Renderer: Rugged Callisto Basalt Surface
  const drawTerrainSlice = (
    ctx: CanvasRenderingContext2D,
    terrain: TerrainPoint[],
    camX: number,
    canvas: HTMLCanvasElement
  ) => {
    if (terrain.length === 0) return;

    ctx.beginPath();
    ctx.moveTo(terrain[0].x, canvas.height);
    terrain.forEach((pt) => {
      ctx.lineTo(pt.x, pt.y);
    });
    ctx.lineTo(terrain[terrain.length - 1].x, canvas.height);
    ctx.closePath();

    // Subsurface Gradient: Titanium dark basalt to deep void
    const grad = ctx.createLinearGradient(0, 300, 0, canvas.height);
    grad.addColorStop(0, '#2B121C'); // Crimson-nebula basalt ridge
    grad.addColorStop(0.3, '#160B10');
    grad.addColorStop(1, '#0B0507');
    ctx.fillStyle = grad;
    ctx.fill();

    // Surface Crust Line (Glowing Ember Edge)
    ctx.beginPath();
    terrain.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Highlight frost sheen on crests
    ctx.strokeStyle = '#FFB399';
    ctx.lineWidth = 1;
    ctx.setLineDash([12, 18]);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // Renderer: 6-Wheeled Expedition Rover
  const drawRover = (ctx: CanvasRenderingContext2D, rover: typeof engineRef.current.rover) => {
    ctx.save();
    ctx.translate(rover.x, rover.y);
    ctx.rotate(rover.angle);

    // Rover Headlight Cone
    const lightGrad = ctx.createRadialGradient(28, 0, 5, 120, 0, 110);
    lightGrad.addColorStop(0, 'rgba(255, 179, 153, 0.45)');
    lightGrad.addColorStop(1, 'rgba(255, 179, 153, 0)');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.moveTo(24, -2);
    ctx.lineTo(130, -35);
    ctx.lineTo(130, 35);
    ctx.closePath();
    ctx.fill();

    // Main Chassis Body (Titanium Steel with Crimson Embers)
    ctx.fillStyle = '#160B10';
    ctx.beginPath();
    drawCompatRoundRect(ctx, -24, -14, 48, 18, 6);
    ctx.fill();
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pressurized Cockpit Dome (Glowing Solar Amber Glass)
    ctx.beginPath();
    ctx.arc(6, -12, 10, Math.PI, 0);
    ctx.fillStyle = '#FF7A00';
    ctx.fill();
    ctx.strokeStyle = '#FFB399';
    ctx.lineWidth = 1;
    ctx.stroke();

    // High-Gain Telemetry Dish on Back
    ctx.save();
    ctx.translate(-14, -16);
    ctx.rotate(-0.4);
    ctx.beginPath();
    ctx.arc(0, 0, 6, Math.PI * 0.8, Math.PI * 1.8);
    ctx.strokeStyle = '#FFB399';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Ventral Jet Thruster Nozzles
    ctx.fillStyle = '#7F1D1D';
    ctx.fillRect(-12, 4, 6, 4);
    ctx.fillRect(8, 4, 6, 4);

    // 3 Wheels Pair (6-Wheeled Rover)
    const wheelPositions = [-18, 0, 18];
    wheelPositions.forEach((wx) => {
      ctx.save();
      ctx.translate(wx, 12);
      ctx.rotate(rover.wheelRot);

      // Outer Tire (Heavy tread basalt grip)
      ctx.beginPath();
      ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
      ctx.fillStyle = '#2B121C';
      ctx.fill();
      ctx.strokeStyle = '#F43F5E';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Wheel Rim
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFB399';
      ctx.fill();

      // Rim Spoke Spokes
      ctx.strokeStyle = '#160B10';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-6, 0);
      ctx.lineTo(6, 0);
      ctx.moveTo(0, -6);
      ctx.lineTo(0, 6);
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  };

  // Renderer: Deployable Science Beacon Mast
  const drawBeaconSite = (ctx: CanvasRenderingContext2D, b: BeaconSite, groundY: number) => {
    ctx.save();
    ctx.translate(b.x, groundY);

    if (b.deployed) {
      // Deployed Active Transmitter Mast
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -42);
      ctx.stroke();

      // Pulsing Transmission Rings
      const pulse = (Date.now() * 0.003) % 1;
      ctx.strokeStyle = `rgba(74, 222, 128, ${1 - pulse})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, -42, 10 + pulse * 25, 0, Math.PI * 2);
      ctx.stroke();

      // Flag / Sensor Head
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(0, -42, 4, 0, Math.PI * 2);
      ctx.fill();

      // Deployed Tag
      ctx.fillStyle = '#4ade80';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('DEPLOYED', 0, -52);
      ctx.fillText(b.name.toUpperCase(), 0, -62);
    } else {
      // Un-deployed Holographic Target Site
      ctx.strokeStyle = '#F43F5E';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -32);
      ctx.stroke();
      ctx.setLineDash([]);

      // Beacon Diamond Hologram
      const pulseH = Math.sin(Date.now() * 0.005) * 3;
      ctx.fillStyle = '#FF7A00';
      ctx.beginPath();
      ctx.moveTo(0, -38 - pulseH);
      ctx.lineTo(6, -32 - pulseH);
      ctx.lineTo(0, -26 - pulseH);
      ctx.lineTo(-6, -32 - pulseH);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FFB399';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SURVEY SITE', 0, -46);
      ctx.fillText(b.name.toUpperCase(), 0, -56);
    }

    ctx.restore();
  };

  // Renderer: Fuel Cell
  const drawFuelCanister = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const bob = Math.sin(Date.now() * 0.006 + x) * 4;
    ctx.save();
    ctx.translate(x, y + bob);

    // Glowing canister body
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    drawCompatRoundRect(ctx, -6, -10, 12, 20, 3);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Core lightning bolt vector
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(1, -5);
    ctx.lineTo(-4, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(-1, 5);
    ctx.lineTo(4, -1);
    ctx.lineTo(0, -1);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  // Renderer: Callisto Base Airlock Destination Hangar
  const drawEndDestination = (ctx: CanvasRenderingContext2D, x: number, groundY: number, name: string) => {
    ctx.save();
    ctx.translate(x, groundY);

    // Pressurized Colony Dome
    ctx.beginPath();
    ctx.arc(45, 0, 85, Math.PI, 0);
    ctx.fillStyle = 'rgba(43, 18, 28, 0.85)';
    ctx.fill();
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Illuminated Hangar Gate
    ctx.fillStyle = '#160B10';
    ctx.fillRect(-20, -50, 48, 50);
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2;
    ctx.strokeRect(-20, -50, 48, 50);

    // Gate beacon rings
    ctx.fillStyle = '#4ade80';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DESTINATION AIRLOCK', 4, -62);
    ctx.fillText(name.toUpperCase(), 4, -76);

    ctx.restore();
  };

  return (
    <div
      style={{
        backgroundColor: '#0B0507',
        border: '1px solid rgba(244, 63, 94, 0.35)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(244, 63, 94, 0.2)',
        fontFamily: 'var(--font-mono)',
        color: '#FFF5F5',
      }}
    >
      {/* Flight Deck Header with Act Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.25rem',
          backgroundColor: 'rgba(22, 11, 16, 0.95)',
          borderBottom: '1px solid rgba(244, 63, 94, 0.25)',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: stage === 'driving' ? '#4ade80' : '#F43F5E',
              boxShadow: `0 0 10px ${stage === 'driving' ? '#4ade80' : '#F43F5E'}`,
            }}
          />
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.08em' }}>
              CALLISTO SURFACE ROVER EXPEDITION // {currentMission.act}
            </div>
            <div style={{ fontSize: '0.625rem', color: '#F43F5E' }}>
              {currentMission.name.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Act Level Switcher */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {MISSIONS.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => {
                setMissionIndex(idx);
                initMission(idx);
              }}
              style={{
                padding: '0.35rem 0.65rem',
                backgroundColor: missionIndex === idx ? '#F43F5E' : 'rgba(43, 18, 28, 0.6)',
                color: missionIndex === idx ? '#0B0507' : '#FFB399',
                border: '1px solid rgba(244, 63, 94, 0.35)',
                borderRadius: '4px',
                fontSize: '0.6875rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {m.act}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Canvas Viewport */}
      <div style={{ position: 'relative', width: '100%', height: '520px', backgroundColor: '#0B0507' }}>
        <canvas
          ref={canvasRef}
          width={1160}
          height={520}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />

        {/* Live Cockpit Rover HUD Overlays */}
        {stage === 'driving' && (
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              pointerEvents: 'none',
              backgroundColor: 'rgba(22, 11, 16, 0.85)',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <div style={{ fontSize: '0.625rem', color: '#F43F5E', letterSpacing: '0.1em' }}>
              ROVER EXPEDITION TELEMETRY
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
              VELOCITY: <span style={{ color: '#FFB399' }}>{telemetry.speedKmh} km/h</span>
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
              POWER CELL: <span style={{ color: fuel < 25 ? '#ef4444' : '#4ade80' }}>{fuel}%</span>
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
              ODOMETER: <span style={{ color: '#FFF5F5' }}>{telemetry.distanceM}m / {telemetry.totalDistanceM}m</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#4ade80' }}>
              BEACONS DEPLOYED: {beaconsDeployed}/{currentMission.beacons.length}
            </div>
            <div
              style={{
                fontSize: '0.6875rem',
                color: '#FF7A00',
                fontWeight: 700,
                marginTop: '0.2rem',
              }}
            >
              // {telemetry.status}
            </div>
          </div>
        )}

        {/* Mission Briefing Overlay */}
        {stage === 'briefing' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(11, 5, 7, 0.88)',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <img
              src="/logo.jpg"
              alt=""
              width="80"
              height="80"
              style={{ borderRadius: '50%', marginBottom: '1rem', border: '2px solid #F43F5E' }}
            />
            <div
              style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '0.4rem',
                fontFamily: 'var(--font-display)',
              }}
            >
              SURFACE MISSION: {currentMission.name}
            </div>
            <p style={{ maxWidth: '560px', fontSize: '0.85rem', color: '#FFB399', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {currentMission.storyBrief}
            </p>
            <div
              style={{
                display: 'flex',
                gap: '1.25rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '0.75rem',
                color: '#F43F5E',
                marginBottom: '1.5rem',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <img src="/icons/craft-rover.jpg" alt="" width="16" height="16" style={{ borderRadius: '3px', objectFit: 'cover' }} />
                <span>DRIVE: [D / RIGHT ARROW] or [A / LEFT ARROW]</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <img src="/icons/icon-rocket.jpg" alt="" width="16" height="16" style={{ borderRadius: '3px', objectFit: 'cover' }} />
                <span>JET THRUSTERS: [SPACE / W]</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <img src="/icons/icon-energy.jpg" alt="" width="16" height="16" style={{ borderRadius: '3px', objectFit: 'cover' }} />
                <span>NITRO BOOST: [SHIFT]</span>
              </span>
            </div>
            <button
              onClick={startMission}
              style={{
                padding: '0.85rem 2.2rem',
                backgroundColor: '#F43F5E',
                color: '#0B0507',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 24px rgba(244, 63, 94, 0.65)',
                transition: 'transform 0.2s',
              }}
            >
              DEPLOY SURFACE ROVER
            </button>
          </div>
        )}

        {/* Finish / Success Overlay */}
        {stage === 'finished' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(11, 5, 7, 0.92)',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: '0.65rem' }}>
              <img
                src="/icons/icon-flag.jpg"
                alt=""
                width="64"
                height="64"
                style={{ borderRadius: '16px', objectFit: 'cover', margin: '0 auto', border: '2px solid #22c55e' }}
              />
            </div>
            <div
              style={{
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#4ade80',
                marginBottom: '0.3rem',
                fontFamily: 'var(--font-display)',
              }}
            >
              AIRLOCK SECURED — EXPEDITION RECON COMPLETE!
            </div>
            <p style={{ color: '#FFB399', fontSize: '0.875rem', marginBottom: '1rem' }}>
              You successfully piloted the rover into {currentMission.destinationName} with all survey sites deployed!
            </p>
            <div
              style={{
                backgroundColor: 'rgba(43, 18, 28, 0.75)',
                padding: '0.85rem 1.8rem',
                borderRadius: '8px',
                border: '1px solid #4ade80',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#F43F5E' }}>EXPEDITION SCORE & BADGE AWARDED</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>{score} PTS</div>
              <div style={{ fontSize: '0.85rem', color: '#FF7A00', fontWeight: 700, marginTop: '0.2rem' }}>
                EXPEDITION BADGE: {earnedBadge}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => initMission(missionIndex)}
                style={{
                  padding: '0.65rem 1.4rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #F43F5E',
                  color: '#FFF5F5',
                  borderRadius: '6px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Replay Route
              </button>
              {missionIndex < MISSIONS.length - 1 && (
                <button
                  onClick={() => {
                    const next = missionIndex + 1;
                    setMissionIndex(next);
                    initMission(next);
                  }}
                  style={{
                    padding: '0.65rem 1.4rem',
                    backgroundColor: '#F43F5E',
                    border: 'none',
                    color: '#0B0507',
                    borderRadius: '6px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 0 16px rgba(244, 63, 94, 0.5)',
                  }}
                >
                  Proceed to Next Act &rarr;
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cockpit Physical Control Deck (Mobile & Touch Buttons) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          padding: '1rem 1.25rem',
          backgroundColor: 'rgba(22, 11, 16, 0.95)',
          borderTop: '1px solid rgba(244, 63, 94, 0.25)',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        {/* Left: Mission Directive */}
        <div>
          <div style={{ fontSize: '0.625rem', color: '#F43F5E', letterSpacing: '0.08em' }}>MISSION DIRECTIVE</div>
          <div style={{ fontSize: '0.8125rem', color: '#FFF5F5', fontWeight: 600, marginTop: '0.2rem' }}>
            {currentMission.objective}
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#8C7F87', marginTop: '0.35rem' }}>
            Keyboard: [D/A] Drive • [SPACE/W] Jet Jump • [SHIFT] Nitro Surge
          </div>
        </div>

        {/* Center: On-Screen Touch Drive & Jump Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onMouseDown={() => (engineRef.current.touchControls.backward = true)}
            onMouseUp={() => (engineRef.current.touchControls.backward = false)}
            onTouchStart={() => (engineRef.current.touchControls.backward = true)}
            onTouchEnd={() => (engineRef.current.touchControls.backward = false)}
            style={roverControlBtnStyle}
            title="Reverse / Brake"
          >
            REVERSE
          </button>
          <button
            onMouseDown={() => (engineRef.current.touchControls.jump = true)}
            onMouseUp={() => (engineRef.current.touchControls.jump = false)}
            onTouchStart={() => (engineRef.current.touchControls.jump = true)}
            onTouchEnd={() => (engineRef.current.touchControls.jump = false)}
            style={{ ...roverControlBtnStyle, backgroundColor: '#F43F5E', color: '#0B0507', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            title="Fire Ventral Jet Thrusters"
          >
            <img src="/icons/icon-rocket.jpg" alt="" width="14" height="14" style={{ borderRadius: '2px', objectFit: 'cover' }} />
            <span>JET JUMP</span>
          </button>
          <button
            onMouseDown={() => (engineRef.current.touchControls.forward = true)}
            onMouseUp={() => (engineRef.current.touchControls.forward = false)}
            onTouchStart={() => (engineRef.current.touchControls.forward = true)}
            onTouchEnd={() => (engineRef.current.touchControls.forward = false)}
            style={{ ...roverControlBtnStyle, borderColor: '#FFB399', color: '#FFB399' }}
            title="Accelerate Forward"
          >
            DRIVE FORWARD
          </button>
          <button
            onMouseDown={() => (engineRef.current.touchControls.boost = true)}
            onMouseUp={() => (engineRef.current.touchControls.boost = false)}
            onTouchStart={() => (engineRef.current.touchControls.boost = true)}
            onTouchEnd={() => (engineRef.current.touchControls.boost = false)}
            style={{ ...roverControlBtnStyle, borderColor: '#FF7A00', color: '#FF7A00', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            title="Nitro Boost"
          >
            <img src="/icons/icon-energy.jpg" alt="" width="14" height="14" style={{ borderRadius: '2px', objectFit: 'cover' }} />
            <span>NITRO</span>
          </button>
        </div>

        {/* Right: Quick Sector Reset */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            onClick={() => initMission(missionIndex)}
            style={{
              padding: '0.45rem 0.85rem',
              backgroundColor: 'rgba(43, 18, 28, 0.7)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              borderRadius: '4px',
              color: '#FFB399',
              fontSize: '0.6875rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <img src="/icons/icon-refresh.jpg" alt="" width="14" height="14" style={{ borderRadius: '2px', objectFit: 'cover' }} />
            <span>RESTART ROUTE</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const roverControlBtnStyle: React.CSSProperties = {
  padding: '0.6rem 0.95rem',
  backgroundColor: 'rgba(43, 18, 28, 0.9)',
  border: '1px solid rgba(244, 63, 94, 0.5)',
  borderRadius: '6px',
  color: '#FFFFFF',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6875rem',
  fontWeight: 700,
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'transform 0.1s',
};
