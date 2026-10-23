import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  playTelemetryBeep,
  playBeaconPing,
  playThrusterBurst,
  playWarpSurge,
} from '../../lib/audio';

interface Coin {
  id: number;
  x: number;
  y: number;
  collected: boolean;
  value: number;
}

interface FuelCanister {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

interface StuntBanner {
  text: string;
  points: number;
  alpha: number;
  yOffset: number;
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
  hillSteepness: number;
  fuelSpacingM: number;
  badge: string;
}

export default function ExpeditionSimulator(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // High-Level State
  const [missionIndex, setMissionIndex] = useState<number>(0);
  const [stage, setStage] = useState<'briefing' | 'driving' | 'flipped' | 'out_of_fuel' | 'finished'>('briefing');
  const [score, setScore] = useState<number>(0);
  const [coinsCollected, setCoinsCollected] = useState<number>(0);
  const [fuel, setFuel] = useState<number>(100);
  const [distanceM, setDistanceM] = useState<number>(0);
  const [bestDistanceM, setBestDistanceM] = useState<number>(0);
  const [stuntMessage, setStuntMessage] = useState<string | null>(null);
  const [earnedBadge, setEarnedBadge] = useState<string | null>(null);

  // HUD Readouts
  const [hudSpeed, setHudSpeed] = useState<number>(0);
  const [hudAirtime, setHudAirtime] = useState<number>(0);

  const MISSIONS: ActMission[] = [
    {
      id: 0,
      act: 'ACT I',
      name: 'Asgard Crater Dunes',
      objective: 'Climb rolling crater dunes, collect cosmic coins, and reach the Outpost Alpha Airlock before running out of fuel.',
      storyBrief: 'Welcome to Callisto low-gravity hill climbing. Use [GAS] to accelerate and tilt back; use [BRAKE] to stop and tilt forward in mid-air.',
      destinationName: 'Outpost Alpha Airlock',
      distanceKm: 2.0,
      terrainSeed: 101,
      hillSteepness: 1.0,
      fuelSpacingM: 350,
      badge: 'Asgard Dune Climber',
    },
    {
      id: 1,
      act: 'ACT II',
      name: 'Utgard Chasm Peaks',
      objective: 'Conquer steep jagged icy scarps and massive valley leaps. Balance your rover mid-air to land without cracking your helmet.',
      storyBrief: 'Steeper hills and deep crater valleys. Hold GAS on ascents, and level out your rover mid-jump for clean two-wheel landings.',
      destinationName: 'Utgard Seismic Station',
      distanceKm: 2.5,
      terrainSeed: 204,
      hillSteepness: 1.35,
      fuelSpacingM: 320,
      badge: 'Utgard Peak Conqueror',
    },
    {
      id: 2,
      act: 'ACT III',
      name: 'Valhalla Multiring Ripples',
      objective: 'Scale the concentric ripple ridges of the largest impact basin in the Jovian system. Perform backflips for massive air bonuses.',
      storyBrief: 'Extreme low-gravity terrain. Full 360-degree backflips in mid-air award +1,000 points. Keep your eye on the fuel gauge!',
      destinationName: 'Valhalla Outer Gate',
      distanceKm: 3.0,
      terrainSeed: 309,
      hillSteepness: 1.6,
      fuelSpacingM: 300,
      badge: 'Valhalla Ridge Stuntman',
    },
    {
      id: 3,
      act: 'ACT IV',
      name: 'Callisto Base Final Ascent',
      objective: 'The final mountain pass to Callisto Primary Colony! Overcome giant ice hills and cruise inside Dome Bay 01.',
      storyBrief: 'The highest peaks on Callisto stand between you and the pressurized habitat dome. Gun the throttle and conquer the final summit.',
      destinationName: 'Callisto Dome Bay 01',
      distanceKm: 3.5,
      terrainSeed: 412,
      hillSteepness: 1.85,
      fuelSpacingM: 280,
      badge: 'Callisto Expedition Legend',
    },
  ];

  const currentMission = MISSIONS[missionIndex];

  // Load best distance from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`callisto_hill_best_${missionIndex}`);
      if (saved) {
        setBestDistanceM(parseInt(saved, 10));
      } else {
        setBestDistanceM(0);
      }
    } catch {
      /* ignore */
    }
  }, [missionIndex]);

  // Game Engine Mutable State Ref (60fps simulation loop without react state latency)
  const engineRef = useRef({
    rover: {
      x: 100,
      y: 0,
      vx: 0,
      vy: 0,
      angle: 0,
      angVel: 0,
      rearWheelY: 0,
      frontWheelY: 0,
      rearOnGround: false,
      frontOnGround: false,
      fuel: 100,
      wheelRot: 0,
      headX: 0,
      headY: 0,
      airtimeFrames: 0,
      cumulativeRotation: 0,
      stoppedFrames: 0,
    },
    input: {
      gas: false,
      brake: false,
    },
    camera: { x: 0, y: 0 },
    terrain: [] as TerrainPoint[],
    coins: [] as Coin[],
    fuels: [] as FuelCanister[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number }[],
    stuntBanners: [] as StuntBanner[],
    stars: [] as { x: number; y: number; size: number; alpha: number }[],
    totalTrackLength: 2000,
    scoreRef: 0,
    coinsRef: 0,
    soundThrottle: 0,
  });

  // Procedural Smooth Hill Climb Terrain Height
  const getTerrainHeight = (worldX: number, seed: number, steepness: number): number => {
    const baseHeight = 360;
    // Layer 1: Long rolling hills
    const w1 = Math.sin(worldX * 0.0028 + seed) * (65 * steepness);
    // Layer 2: Medium bumps & steep climbs
    const w2 = Math.sin(worldX * 0.0065 + seed * 2) * (35 * steepness);
    // Layer 3: Small ridges
    const w3 = Math.cos(worldX * 0.012 + seed * 3) * (14 * steepness);

    // Occasional giant launch jump slopes
    const rampX = (worldX + seed * 50) % 750;
    let jumpRamp = 0;
    if (rampX > 480 && rampX < 620) {
      const progress = (rampX - 480) / 140;
      jumpRamp = -Math.sin(progress * Math.PI) * 55 * steepness;
    }

    return baseHeight + w1 + w2 + w3 + jumpRamp;
  };

  // Initialize or Reset Mission Route
  const initMission = useCallback(
    (index: number) => {
      const m = MISSIONS[index];
      const eng = engineRef.current;
      const trackLength = m.distanceKm * 1000;
      eng.totalTrackLength = trackLength;

      // Sample terrain points for smooth polygon fill
      const pts: TerrainPoint[] = [];
      const step = 15;
      for (let x = -200; x <= trackLength + 400; x += step) {
        pts.push({ x, y: getTerrainHeight(x, m.terrainSeed, m.hillSteepness) });
      }
      eng.terrain = pts;

      // Generate Coins in beautiful airborne parabolic arches above hill crests
      eng.coins = [];
      let coinId = 0;
      for (let x = 180; x < trackLength - 200; x += 180) {
        const groundY = getTerrainHeight(x, m.terrainSeed, m.hillSteepness);
        // String of 5 coins in an arc
        for (let j = -2; j <= 2; j++) {
          const cx = x + j * 24;
          const arcOffset = 30 + (4 - j * j) * 8;
          eng.coins.push({
            id: coinId++,
            x: cx,
            y: getTerrainHeight(cx, m.terrainSeed, m.hillSteepness) - arcOffset,
            collected: false,
            value: 50,
          });
        }
      }

      // Generate Fuel Jerrycans every `fuelSpacingM` meters
      eng.fuels = [];
      let fuelId = 0;
      for (let x = m.fuelSpacingM; x < trackLength - 100; x += m.fuelSpacingM) {
        const fy = getTerrainHeight(x, m.terrainSeed, m.hillSteepness);
        eng.fuels.push({
          id: fuelId++,
          x,
          y: fy - 24,
          collected: false,
        });
      }

      // Generate Background Cosmic Starfield
      if (eng.stars.length === 0) {
        for (let i = 0; i < 140; i++) {
          eng.stars.push({
            x: Math.random() * 1160,
            y: Math.random() * 320,
            size: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.7 + 0.3,
          });
        }
      }

      // Position Rover at start on ground
      const startGround = getTerrainHeight(80, m.terrainSeed, m.hillSteepness);
      eng.rover = {
        x: 80,
        y: startGround - 24,
        vx: 0,
        vy: 0,
        angle: 0,
        angVel: 0,
        rearWheelY: startGround,
        frontWheelY: startGround,
        rearOnGround: true,
        frontOnGround: true,
        fuel: 100,
        wheelRot: 0,
        headX: 80,
        headY: startGround - 38,
        airtimeFrames: 0,
        cumulativeRotation: 0,
        stoppedFrames: 0,
      };

      eng.particles = [];
      eng.stuntBanners = [];
      eng.scoreRef = 0;
      eng.coinsRef = 0;

      setScore(0);
      setCoinsCollected(0);
      setFuel(100);
      setDistanceM(0);
      setStuntMessage(null);
      setEarnedBadge(null);
      setStage('driving');
    },
    [MISSIONS]
  );

  const startMission = () => {
    initMission(missionIndex);
    playTelemetryBeep(980, 0.15);
  };

  // Keyboard Event Handlers (Cross-browser keyboard standard)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const input = engineRef.current.input;
      if (e.code === 'KeyD' || e.code === 'ArrowRight' || e.code === 'Space') {
        input.gas = true;
        e.preventDefault();
      }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft' || e.code === 'KeyS' || e.code === 'ArrowDown') {
        input.brake = true;
        e.preventDefault();
      }
      if (e.code === 'KeyR') {
        initMission(missionIndex);
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const input = engineRef.current.input;
      if (e.code === 'KeyD' || e.code === 'ArrowRight' || e.code === 'Space') {
        input.gas = false;
      }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft' || e.code === 'KeyS' || e.code === 'ArrowDown') {
        input.brake = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [initMission, missionIndex]);

  // 60 FPS Physics Simulation & Animation Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      animId = requestAnimationFrame(gameLoop);
      const eng = engineRef.current;
      const rover = eng.rover;
      const m = currentMission;

      // 1. CLEAR VIEWPORT (Obsidian Space Base)
      ctx.fillStyle = '#0B0507';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. DRAW STARFIELD WITH SMOOTH HORIZONTAL PARALLAX
      ctx.fillStyle = '#FFFFFF';
      eng.stars.forEach((star) => {
        const px = (star.x - rover.x * 0.06) % canvas.width;
        const drawX = px < 0 ? px + canvas.width : px;
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(drawX, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // 3. DRAW CELESTIAL SKY (Glowing Jupiter & Aurora)
      drawCelestialSky(ctx, canvas, rover.x);

      // If briefing, render terrain slice and pause physics
      if (stage === 'briefing') {
        drawTerrainSlice(ctx, eng.terrain, 0, canvas);
        return;
      }

      // 4. HILL CLIMB VEHICLE PHYSICS UPDATE
      if (stage === 'driving') {
        const isGas = eng.input.gas;
        const isBrake = eng.input.brake;

        // Wheel offsets from chassis center (distance = 26px each side)
        const wheelBaseHalf = 26;
        const wheelRadius = 12;

        const cosA = Math.cos(rover.angle);
        const sinA = Math.sin(rover.angle);

        // Calculate world positions of rear and front wheels
        const rearWheelX = rover.x - cosA * wheelBaseHalf - sinA * 12;
        const rearWheelY = rover.y - sinA * wheelBaseHalf + cosA * 12;

        const frontWheelX = rover.x + cosA * wheelBaseHalf - sinA * 12;
        const frontWheelY = rover.y + sinA * wheelBaseHalf + cosA * 12;

        // Calculate world position of driver's astronaut helmet
        rover.headX = rover.x - sinA * 26;
        rover.headY = rover.y - cosA * 26;

        // Query ground heights directly beneath each wheel & head
        const groundRearY = getTerrainHeight(rearWheelX, m.terrainSeed, m.hillSteepness);
        const groundFrontY = getTerrainHeight(frontWheelX, m.terrainSeed, m.hillSteepness);
        const groundHeadY = getTerrainHeight(rover.headX, m.terrainSeed, m.hillSteepness);

        // Low Gravity on Callisto (authentic floaty moon gravity)
        const gravity = 0.26;
        rover.vy += gravity;

        // Suspension Spring Forces
        const rearPenetration = rearWheelY + wheelRadius - groundRearY;
        const frontPenetration = frontWheelY + wheelRadius - groundFrontY;

        rover.rearOnGround = rearPenetration >= 0;
        rover.frontOnGround = frontPenetration >= 0;
        const anyWheelOnGround = rover.rearOnGround || rover.frontOnGround;

        // Spring stiffness and damping
        if (rover.rearOnGround) {
          const spring = rearPenetration * 0.32;
          rover.vy -= spring;
          // Rear wheel push generates upward torque on chassis
          rover.angVel -= spring * 0.007;
          // Traction friction
          rover.vx *= 0.988;
        }

        if (rover.frontOnGround) {
          const spring = frontPenetration * 0.32;
          rover.vy -= spring;
          // Front wheel push generates downward torque on chassis
          rover.angVel += spring * 0.007;
          // Traction friction
          rover.vx *= 0.988;
        }

        // HILL CLIMB RACING SIGNATURE CONTROLS:
        // GAS PEDAL:
        if (isGas && rover.fuel > 0) {
          if (anyWheelOnGround) {
            // Forward drive force along rover angle
            const power = 0.36;
            rover.vx += cosA * power;
            // Gas creates wheelie torque! (lifts front wheel)
            rover.angVel -= 0.006;
            rover.wheelRot += 0.3;
          } else {
            // Mid-air Gas tilts vehicle BACKWARDS (Counter-clockwise rotation / backflip)
            rover.angVel -= 0.024;
          }

          // Consume fuel
          rover.fuel = Math.max(0, rover.fuel - 0.05);

          // Exhaust spark particles
          if (Math.random() > 0.4) {
            eng.particles.push({
              x: rearWheelX - cosA * 10,
              y: rearWheelY + sinA * 5,
              vx: -cosA * 3 + (Math.random() - 0.5) * 2,
              vy: -sinA * 3 - Math.random() * 2,
              life: 1,
              color: Math.random() > 0.5 ? '#F43F5E' : '#FF6633',
              size: Math.random() * 3 + 2,
            });
          }

          eng.soundThrottle++;
          if (eng.soundThrottle % 15 === 0) {
            playThrusterBurst();
          }
        }

        // BRAKE / REVERSE PEDAL:
        if (isBrake) {
          if (anyWheelOnGround) {
            // Strong braking deceleration
            rover.vx *= 0.92;
            // If stopped, reverse
            if (rover.vx > -2.5) {
              rover.vx -= cosA * 0.18;
            }
            // Brake pitches nose DOWN
            rover.angVel += 0.007;
            rover.wheelRot -= 0.2;
          } else {
            // Mid-air Brake tilts vehicle FORWARD (Clockwise rotation / frontflip)
            rover.angVel += 0.024;
          }
        }

        // Natural passive fuel burn
        if (anyWheelOnGround && Math.abs(rover.vx) > 0.1) {
          rover.fuel = Math.max(0, rover.fuel - 0.015);
        }

        // Apply velocities and angular rotation
        rover.x += rover.vx;
        rover.y += rover.vy;
        rover.angle += rover.angVel;
        rover.angVel *= 0.93; // Angular damping

        // AIRTIME & STUNT FLIP RECOGNITION
        if (!anyWheelOnGround) {
          rover.airtimeFrames++;
          rover.cumulativeRotation += rover.angVel;

          // Check 360-degree backflip
          if (rover.cumulativeRotation <= -Math.PI * 1.85) {
            rover.cumulativeRotation = 0;
            triggerStunt('BACKFLIP!', 1000);
            playBeaconPing(1760, 0.4);
          }
          // Check 360-degree frontflip
          else if (rover.cumulativeRotation >= Math.PI * 1.85) {
            rover.cumulativeRotation = 0;
            triggerStunt('FRONTFLIP!', 1000);
            playBeaconPing(1760, 0.4);
          }
        } else {
          // Landing after big airtime
          if (rover.airtimeFrames > 45) {
            const airSeconds = (rover.airtimeFrames / 60).toFixed(1);
            const airPoints = Math.round(rover.airtimeFrames * 4);
            triggerStunt(`AIR TIME ${airSeconds}s!`, airPoints);
            playTelemetryBeep(1200, 0.15);
          }
          rover.airtimeFrames = 0;
          rover.cumulativeRotation = 0;
        }

        // CRASH DETECTION 1: HEAD KNOCKED / DRIVER DOWN (Hill Climb neck break)
        if (rover.headY >= groundHeadY - 2) {
          setStage('flipped');
          playWarpSurge();
          saveBestDistance(Math.round(rover.x));
        }

        // CRASH DETECTION 2: OUT OF FUEL
        if (rover.fuel <= 0) {
          if (Math.abs(rover.vx) < 0.25) {
            rover.stoppedFrames++;
            if (rover.stoppedFrames > 60) {
              setStage('out_of_fuel');
              playTelemetryBeep(440, 0.5);
              saveBestDistance(Math.round(rover.x));
            }
          } else {
            rover.stoppedFrames = 0;
          }
        }

        // COLLECT COINS
        eng.coins.forEach((c) => {
          if (!c.collected) {
            const d = Math.hypot(c.x - rover.x, c.y - rover.y);
            if (d < 36) {
              c.collected = true;
              eng.coinsRef++;
              eng.scoreRef += c.value;
              setCoinsCollected(eng.coinsRef);
              setScore(eng.scoreRef);
              playTelemetryBeep(1480, 0.08);

              // Sparkle particles
              for (let i = 0; i < 8; i++) {
                const spd = 2 + Math.random() * 3;
                const a = Math.random() * Math.PI * 2;
                eng.particles.push({
                  x: c.x,
                  y: c.y,
                  vx: Math.cos(a) * spd,
                  vy: Math.sin(a) * spd,
                  life: 1,
                  color: '#FFB399',
                  size: 2.5,
                });
              }
            }
          }
        });

        // COLLECT FUEL JERRYCANS
        eng.fuels.forEach((f) => {
          if (!f.collected) {
            const d = Math.hypot(f.x - rover.x, f.y - rover.y);
            if (d < 38) {
              f.collected = true;
              rover.fuel = 100;
              eng.scoreRef += 500;
              setScore(eng.scoreRef);
              triggerStunt('⛽ REFUEL!', 500);
              playBeaconPing(1046, 0.5);
            }
          }
        });

        // FINISH LINE REACHED
        if (rover.x >= eng.totalTrackLength) {
          setStage('finished');
          setEarnedBadge(m.badge);
          playBeaconPing(1760, 0.7);
          playWarpSurge();
          saveBestDistance(Math.round(eng.totalTrackLength));
        }

        // Update React HUD state
        setFuel(Math.round(rover.fuel));
        const curDist = Math.max(0, Math.round(rover.x));
        setDistanceM(curDist);
        setHudSpeed(Math.round(Math.abs(rover.vx) * 20));
        setHudAirtime(Number((rover.airtimeFrames / 60).toFixed(1)));
      }

      // Smooth Camera tracking rover with lookahead
      const targetCamX = rover.x - canvas.width * 0.3;
      eng.camera.x += (targetCamX - eng.camera.x) * 0.12;

      // 5. RENDER SCENE WITH CAMERA OFFSET
      ctx.save();
      ctx.translate(-eng.camera.x, 0);

      // A. Callisto Rugged Hill Terrain Fill
      drawTerrainSlice(ctx, eng.terrain, eng.camera.x, canvas);

      // B. Coins along hills
      eng.coins.forEach((c) => {
        if (!c.collected && Math.abs(c.x - rover.x) < canvas.width) {
          drawCoin(ctx, c.x, c.y);
        }
      });

      // C. Fuel Jerrycans
      eng.fuels.forEach((f) => {
        if (!f.collected && Math.abs(f.x - rover.x) < canvas.width) {
          drawFuelCanister(ctx, f.x, f.y);
        }
      });

      // D. Finish Gateway Airlock
      drawFinishAirlock(
        ctx,
        eng.totalTrackLength,
        getTerrainHeight(eng.totalTrackLength, m.terrainSeed, m.hillSteepness),
        m.destinationName
      );

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

      // F. The Hill Climb Rover & Driver
      drawHillClimbRover(ctx, rover);

      ctx.restore();

      // 6. DRAW STUNT NOTIFICATIONS (In screen space)
      eng.stuntBanners = eng.stuntBanners.filter((b) => {
        b.alpha -= 0.015;
        b.yOffset -= 0.8;
        ctx.save();
        ctx.globalAlpha = Math.max(0, b.alpha);
        ctx.fillStyle = '#4ade80';
        ctx.font = 'bold 22px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(b.text, canvas.width / 2, 160 + b.yOffset);
        ctx.fillStyle = '#FFB399';
        ctx.font = 'bold 15px "JetBrains Mono", monospace';
        ctx.fillText(`+${b.points} PTS`, canvas.width / 2, 185 + b.yOffset);
        ctx.restore();
        return b.alpha > 0;
      });
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [stage, missionIndex]);

  // Save best distance helper
  const saveBestDistance = (dist: number) => {
    try {
      const curBest = parseInt(localStorage.getItem(`callisto_hill_best_${missionIndex}`) || '0', 10);
      if (dist > curBest) {
        localStorage.setItem(`callisto_hill_best_${missionIndex}`, dist.toString());
        setBestDistanceM(dist);
      }
    } catch {
      /* ignore */
    }
  };

  const triggerStunt = (text: string, points: number) => {
    const eng = engineRef.current;
    eng.scoreRef += points;
    setScore(eng.scoreRef);
    eng.stuntBanners.push({
      text,
      points,
      alpha: 1,
      yOffset: 0,
    });
  };

  // Celestial Sky with Jupiter & Auroral Arc
  const drawCelestialSky = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, roverX: number) => {
    const jupX = canvas.width * 0.72 - (roverX * 0.015) % (canvas.width * 0.4);
    const jupY = 85;
    const jupRadius = 60;

    // Jupiter atmospheric glow
    const grad = ctx.createRadialGradient(jupX, jupY, jupRadius * 0.7, jupX, jupY, jupRadius * 1.5);
    grad.addColorStop(0, '#E05A2B');
    grad.addColorStop(0.55, 'rgba(244, 63, 94, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(jupX, jupY, jupRadius * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Planet sphere
    ctx.beginPath();
    ctx.arc(jupX, jupY, jupRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#E05A2B';
    ctx.fill();

    // Jupiter storm bands
    ctx.save();
    ctx.clip();
    ctx.fillStyle = '#7F1D1D';
    ctx.fillRect(jupX - jupRadius, jupY - 12, jupRadius * 2, 8);
    ctx.fillRect(jupX - jupRadius, jupY + 6, jupRadius * 2, 12);
    ctx.fillStyle = '#FF7A00';
    ctx.fillRect(jupX - jupRadius, jupY + 22, jupRadius * 2, 5);
    ctx.restore();
  };

  // Rugged Hill Climb Terrain Polygon
  const drawTerrainSlice = (
    ctx: CanvasRenderingContext2D,
    terrain: TerrainPoint[],
    camX: number,
    canvas: HTMLCanvasElement
  ) => {
    if (terrain.length === 0) return;

    ctx.beginPath();
    ctx.moveTo(terrain[0].x, canvas.height + 100);
    terrain.forEach((pt) => ctx.lineTo(pt.x, pt.y));
    ctx.lineTo(terrain[terrain.length - 1].x, canvas.height + 100);
    ctx.closePath();

    // Deep basalt rock gradient
    const grad = ctx.createLinearGradient(0, 280, 0, canvas.height + 100);
    grad.addColorStop(0, '#2B121C'); // Crimson Ember basalt
    grad.addColorStop(0.35, '#160B10');
    grad.addColorStop(1, '#0B0507');
    ctx.fillStyle = grad;
    ctx.fill();

    // Glowing Crimson Ember crust line
    ctx.beginPath();
    terrain.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Titanium starlight highlight on hill peaks
    ctx.strokeStyle = '#FFB399';
    ctx.lineWidth = 1;
    ctx.setLineDash([16, 20]);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // The Hill Climb Rover with Dual Bouncy Wheels & Astronaut
  const drawHillClimbRover = (ctx: CanvasRenderingContext2D, rover: typeof engineRef.current.rover) => {
    ctx.save();
    ctx.translate(rover.x, rover.y);
    ctx.rotate(rover.angle);

    // Rover Headlight Beam
    const lightGrad = ctx.createRadialGradient(28, 0, 5, 130, 0, 110);
    lightGrad.addColorStop(0, 'rgba(255, 179, 153, 0.4)');
    lightGrad.addColorStop(1, 'rgba(255, 179, 153, 0)');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.moveTo(25, -2);
    ctx.lineTo(135, -35);
    ctx.lineTo(135, 35);
    ctx.closePath();
    ctx.fill();

    // Main Chassis Body (Titanium Steel & Crimson Accents)
    ctx.fillStyle = '#160B10';
    ctx.beginPath();
    ctx.roundRect(-28, -12, 56, 18, [6, 10, 4, 4]);
    ctx.fill();
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Roll Cage / Safety Bars
    ctx.strokeStyle = '#8C7F87';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-16, -12);
    ctx.lineTo(-4, -28);
    ctx.lineTo(14, -28);
    ctx.lineTo(24, -12);
    ctx.stroke();

    // ASTRONAUT DRIVER (Head & Visor)
    ctx.save();
    ctx.translate(0, -20);
    // Helmet
    ctx.beginPath();
    ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF5F5';
    ctx.fill();
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Visor
    ctx.beginPath();
    ctx.arc(3, 0, 5, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.fillStyle = '#FF7A00';
    ctx.fill();
    ctx.restore();

    // Dual Suspension Spring Arms & Heavy Bouncy Tires
    const wheelOffset = 26;
    [-wheelOffset, wheelOffset].forEach((wx) => {
      // Suspension Strut
      ctx.strokeStyle = '#8C7F87';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(wx * 0.5, 0);
      ctx.lineTo(wx, 12);
      ctx.stroke();

      // Wheel Hub
      ctx.save();
      ctx.translate(wx, 12);
      ctx.rotate(rover.wheelRot);

      // Deep Tread Tire
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#2B121C';
      ctx.fill();
      ctx.strokeStyle = '#F43F5E';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Rim
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFB399';
      ctx.fill();

      // Wheel Spokes
      ctx.strokeStyle = '#160B10';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-9, 0);
      ctx.lineTo(9, 0);
      ctx.moveTo(0, -9);
      ctx.lineTo(0, 9);
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  };

  // Cosmic Coin
  const drawCoin = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const pulse = Math.sin(Date.now() * 0.008 + x) * 2;
    ctx.save();
    ctx.translate(x, y + pulse);

    ctx.beginPath();
    ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFB399';
    ctx.fill();
    ctx.strokeStyle = '#FFF5F5';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner Star Glyph
    ctx.fillStyle = '#0B0507';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★', 0, 3);

    ctx.restore();
  };

  // Fuel Jerrycan [⛽ FUEL]
  const drawFuelCanister = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const pulse = Math.sin(Date.now() * 0.005) * 3;
    ctx.save();
    ctx.translate(x, y + pulse);

    // Jerrycan body
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(-8, -12, 16, 24, 3);
    ctx.fill();
    ctx.strokeStyle = '#FFF5F5';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Handle
    ctx.strokeRect(-4, -16, 8, 4);

    // Fuel Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 8px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAS', 0, 4);

    ctx.restore();
  };

  // Destination Airlock Gate
  const drawFinishAirlock = (ctx: CanvasRenderingContext2D, x: number, groundY: number, name: string) => {
    ctx.save();
    ctx.translate(x, groundY);

    // Base Dome
    ctx.beginPath();
    ctx.arc(50, 0, 90, Math.PI, 0);
    ctx.fillStyle = 'rgba(43, 18, 28, 0.9)';
    ctx.fill();
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Gate
    ctx.fillStyle = '#160B10';
    ctx.fillRect(-20, -55, 50, 55);
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-20, -55, 50, 55);

    // Sign
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FINISH AIRLOCK', 5, -68);
    ctx.fillText(name.toUpperCase(), 5, -82);

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
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* Header with Act Selector */}
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
              CALLISTO HILL CLIMB EXPEDITION // {currentMission.act}
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

      {/* Main Game Canvas Viewport */}
      <div style={{ position: 'relative', width: '100%', height: '520px', backgroundColor: '#0B0507' }}>
        <canvas
          ref={canvasRef}
          width={1160}
          height={520}
          style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none' }}
        />

        {/* Live Gauges Overlay (Classic Hill Climb Dash) */}
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
            }}
          >
            <div style={{ fontSize: '0.625rem', color: '#F43F5E', letterSpacing: '0.1em' }}>
              HILL CLIMB TELEMETRY
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
              DISTANCE: <span style={{ color: '#FFF5F5' }}>{distanceM}m</span>{' '}
              {bestDistanceM > 0 && (
                <span style={{ color: '#8C7F87', fontSize: '0.6875rem' }}>[BEST: {bestDistanceM}m]</span>
              )}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
              COINS: <span style={{ color: '#FFB399' }}>★ {coinsCollected}</span> •{' '}
              <span style={{ color: '#4ade80' }}>{score} PTS</span>
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
              FUEL CELL:{' '}
              <span style={{ color: fuel < 25 ? '#ef4444' : '#4ade80' }}>
                {fuel}% {fuel < 20 && '⚠️ LOW'}
              </span>
            </div>
            {hudAirtime > 0 && (
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                AIRTIME: {hudAirtime}s
              </div>
            )}
          </div>
        )}

        {/* Top-Right Big Speedo Needle HUD */}
        {stage === 'driving' && (
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              pointerEvents: 'none',
              backgroundColor: 'rgba(22, 11, 16, 0.85)',
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFB399' }}>
              {hudSpeed}
            </div>
            <div style={{ fontSize: '0.625rem', color: '#8C7F87', lineHeight: 1.1 }}>
              KM/H
              <br />
              SPEED
            </div>
          </div>
        )}

        {/* Briefing Overlay */}
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
              HILL CLIMB: {currentMission.name}
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
                fontSize: '0.75rem',
                color: '#F43F5E',
                marginBottom: '1.5rem',
              }}
            >
              <span>🏎️ [GAS / RIGHT ARROW / D]: Drive & Backflip</span>
              <span>🛑 [BRAKE / LEFT ARROW / A]: Brake & Frontflip</span>
              <span>⛽ Collect Gas Cans before your tank empties!</span>
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
              START HILL CLIMB
            </button>
          </div>
        )}

        {/* Flipped / Driver Down Modal */}
        {stage === 'flipped' && (
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
            <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>💥</div>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#ef4444',
                marginBottom: '0.3rem',
                fontFamily: 'var(--font-display)',
              }}
            >
              DRIVER DOWN — VEHICLE FLIPPED!
            </div>
            <p style={{ color: '#FFB399', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Your helmet touched the basalt terrain! Level your rover mid-air using [BRAKE] and [GAS] to land cleanly on both wheels.
            </p>
            <div
              style={{
                backgroundColor: 'rgba(43, 18, 28, 0.8)',
                padding: '0.85rem 1.8rem',
                borderRadius: '8px',
                border: '1px solid #ef4444',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#8C7F87' }}>DISTANCE REACHED</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>{distanceM} METERS</div>
              <div style={{ fontSize: '0.85rem', color: '#FFB399', marginTop: '0.2rem' }}>
                SCORE: {score} PTS • COINS: ★ {coinsCollected}
              </div>
            </div>
            <button
              onClick={() => initMission(missionIndex)}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#F43F5E',
                color: '#0B0507',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 0 16px rgba(244, 63, 94, 0.6)',
              }}
            >
              RETRY CLIMB [R]
            </button>
          </div>
        )}

        {/* Out of Fuel Modal */}
        {stage === 'out_of_fuel' && (
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
            <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>⛽</div>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#FF7A00',
                marginBottom: '0.3rem',
                fontFamily: 'var(--font-display)',
              }}
            >
              OUT OF FUEL!
            </div>
            <p style={{ color: '#FFB399', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Your rover ran out of fuel! Accelerate smoothly and scoop up red gas cans along the ridges to keep driving.
            </p>
            <div
              style={{
                backgroundColor: 'rgba(43, 18, 28, 0.8)',
                padding: '0.85rem 1.8rem',
                borderRadius: '8px',
                border: '1px solid #FF7A00',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#8C7F87' }}>DISTANCE REACHED</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>{distanceM} METERS</div>
              <div style={{ fontSize: '0.85rem', color: '#FFB399', marginTop: '0.2rem' }}>
                SCORE: {score} PTS • COINS: ★ {coinsCollected}
              </div>
            </div>
            <button
              onClick={() => initMission(missionIndex)}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#FF7A00',
                color: '#0B0507',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              RESTART SECTOR [R]
            </button>
          </div>
        )}

        {/* Stage Finished / Summit Reached */}
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
            <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>🏆</div>
            <div
              style={{
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#4ade80',
                marginBottom: '0.3rem',
                fontFamily: 'var(--font-display)',
              }}
            >
              SUMMIT CONQUERED — AIRLOCK SECURED!
            </div>
            <p style={{ color: '#FFB399', fontSize: '0.875rem', marginBottom: '1rem' }}>
              You successfully piloted the rover across all hills into {currentMission.destinationName}!
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
                BADGE: {earnedBadge}
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
                  Next Summit &rarr;
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Scoped CSS for Cross-Browser & Mobile Responsiveness */}
      <style>{`
        .hill-climb-pedal-deck {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 2rem;
          background-color: rgba(22, 11, 16, 0.95);
          border-top: 1px solid rgba(244, 63, 94, 0.25);
          touch-action: none;
          -webkit-user-select: none;
          user-select: none;
        }
        .hill-climb-center-info {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .hill-pedal-btn {
          width: clamp(100px, 22vw, 135px);
          height: clamp(68px, 14vw, 80px);
          border-radius: 12px;
          font-family: var(--font-mono);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          user-select: none;
          -webkit-user-select: none;
          touch-action: none;
          -webkit-touch-callout: none;
          transition: transform 0.08s ease, box-shadow 0.08s ease;
        }
        .hill-pedal-btn:active {
          transform: scale(0.92) !important;
        }
        @media (max-width: 640px) {
          .hill-climb-pedal-deck {
            padding: 0.85rem 1rem;
          }
          .hill-climb-center-info {
            display: none;
          }
        }
      `}</style>

      {/* Classic Hill Climb Racing Dual Pedal Deck (Mobile & Touch Optimized) */}
      <div className="hill-climb-pedal-deck">
        {/* LEFT PEDAL: BRAKE / REVERSE */}
        <button
          className="hill-pedal-btn"
          onPointerDown={(e) => {
            e.preventDefault();
            engineRef.current.input.brake = true;
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            engineRef.current.input.brake = false;
          }}
          onPointerCancel={(e) => {
            e.preventDefault();
            engineRef.current.input.brake = false;
          }}
          onContextMenu={(e) => e.preventDefault()}
          style={brakePedalStyle}
          aria-label="Brake on Ground or Tilt Forward in Air"
          title="Brake on Ground / Tilt Forward in Air [A / LEFT]"
        >
          <div style={{ fontSize: '1.1rem', marginBottom: '0.15rem' }}>🛑</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.08em' }}>BRAKE</div>
          <div style={{ fontSize: '0.6rem', color: '#8C7F87', marginTop: '0.1rem' }}>TILTS FORWARD</div>
        </button>

        {/* Center: Mission info & Keyboard instructions */}
        <div className="hill-climb-center-info">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFB399' }}>
            HILL CLIMB CONTROLS
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#8C7F87' }}>
            Keyboard: [D / RIGHT] Gas • [A / LEFT] Brake • [R] Restart
          </div>
          <div style={{ fontSize: '0.625rem', color: '#F43F5E' }}>
            Perform in-air 360° flips for +1,000 stunt bonuses!
          </div>
        </div>

        {/* RIGHT PEDAL: GAS / ACCELERATE */}
        <button
          className="hill-pedal-btn"
          onPointerDown={(e) => {
            e.preventDefault();
            engineRef.current.input.gas = true;
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            engineRef.current.input.gas = false;
          }}
          onPointerCancel={(e) => {
            e.preventDefault();
            engineRef.current.input.gas = false;
          }}
          onContextMenu={(e) => e.preventDefault()}
          style={gasPedalStyle}
          aria-label="Gas on Ground or Tilt Backward in Air"
          title="Accelerate on Ground / Tilt Backwards in Air [D / RIGHT / SPACE]"
        >
          <div style={{ fontSize: '1.1rem', marginBottom: '0.15rem' }}>⚡</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.08em' }}>GAS</div>
          <div style={{ fontSize: '0.6rem', color: '#0B0507', marginTop: '0.1rem' }}>TILTS BACKWARD</div>
        </button>
      </div>
    </div>
  );
}

const brakePedalStyle: React.CSSProperties = {
  backgroundColor: 'rgba(43, 18, 28, 0.9)',
  border: '2px solid rgba(244, 63, 94, 0.5)',
  color: '#FFFFFF',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
};

const gasPedalStyle: React.CSSProperties = {
  backgroundColor: '#F43F5E',
  border: '2px solid #FFB399',
  color: '#0B0507',
  boxShadow: '0 4px 20px rgba(244, 63, 94, 0.5)',
};
