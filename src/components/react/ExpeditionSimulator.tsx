import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  playTelemetryBeep,
  playThrusterBurst,
  playBeaconPing,
  playWarpSurge,
  toggleAmbientSound,
  isAudioEnabled,
} from '../../lib/audio';

interface Planet {
  x: number;
  y: number;
  radius: number;
  mass: number;
  name: string;
  color: string;
  glowColor: string;
  hasRings?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Collectible {
  x: number;
  y: number;
  collected: boolean;
  name: string;
}

interface Asteroid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  angle: number;
  vRot: number;
}

export default function ExpeditionSimulator(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mission State
  const [stage, setStage] = useState<'briefing' | 'flying' | 'landed' | 'crashed'>('briefing');
  const [missionIndex, setMissionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [scienceCollected, setScienceCollected] = useState<number>(0);
  const [earnedBadge, setEarnedBadge] = useState<string | null>(null);

  // Live Telemetry Readouts
  const [telemetry, setTelemetry] = useState({
    speed: 0,
    fuel: 100,
    altitude: 0,
    targetDist: 0,
    gForce: 1.0,
    status: 'SYSTEMS NOMINAL',
  });

  // Game Engine Mutable State Ref (for 60fps canvas loop without react re-render lag)
  const engineRef = useRef({
    ship: {
      x: 120,
      y: 350,
      vx: 1.8,
      vy: 0,
      angle: 0, // radians, 0 is right
      angVel: 0,
      thrust: false,
      reverse: false,
      turnLeft: false,
      turnRight: false,
      fuel: 100,
      exploded: false,
    },
    planets: [] as Planet[],
    target: { x: 950, y: 350, radius: 45, name: 'Callisto Base' },
    collectibles: [] as Collectible[],
    asteroids: [] as Asteroid[],
    particles: [] as Particle[],
    stars: [] as { x: number; y: number; size: number; speed: number }[],
    keys: {
      up: false,
      down: false,
      left: false,
      right: false,
      warp: false,
    },
    camera: { x: 0, y: 0, scale: 1 },
    touchControls: {
      thrust: false,
      left: false,
      right: false,
      brake: false,
    },
    lastTime: 0,
  });

  const MISSIONS = [
    {
      id: 0,
      act: 'ACT I',
      name: 'Earth Departure & Lunar Slingshot',
      objective: 'Clear Earth orbit, collect the telemetry beacon, and slingshot to deep space.',
      originName: 'Earth (Low Orbit)',
      targetName: 'Lunar Gateway',
      targetDistKm: '384,400 km',
      shipStart: { x: 120, y: 320, vx: 2.2, vy: -0.4 },
      planets: [
        { x: 100, y: 320, radius: 55, mass: 2200, name: 'Earth', color: '#38bdf8', glowColor: 'rgba(56, 189, 248, 0.4)' },
        { x: 620, y: 220, radius: 26, mass: 650, name: 'Moon', color: '#e2e8f0', glowColor: 'rgba(226, 232, 240, 0.3)' },
      ],
      target: { x: 960, y: 300, radius: 36, name: 'Lunar Gateway' },
      asteroidsCount: 3,
      badge: 'Departure Vanguard',
    },
    {
      id: 1,
      act: 'ACT II',
      name: 'Martian Gravity Slingshot',
      objective: 'Navigate the Martian gravity well to gain delta-V while avoiding orbital dust.',
      originName: 'Phobos Relay',
      targetName: 'Mars Orbital Station',
      targetDistKm: '78.3 Million km',
      shipStart: { x: 100, y: 180, vx: 2.8, vy: 0.8 },
      planets: [
        { x: 500, y: 360, radius: 60, mass: 2600, name: 'Mars', color: '#c98a66', glowColor: 'rgba(201, 138, 102, 0.45)' },
        { x: 260, y: 160, radius: 16, mass: 220, name: 'Phobos', color: '#94a3b8', glowColor: 'rgba(148, 163, 184, 0.3)' },
      ],
      target: { x: 980, y: 440, radius: 40, name: 'Mars Orbital Station' },
      asteroidsCount: 8,
      badge: 'Red Planet Navigator',
    },
    {
      id: 2,
      act: 'ACT III',
      name: 'Asteroid Belt Crossing',
      objective: 'Pilot through the dense main asteroid belt. Collect classified research canisters.',
      originName: 'Inner Belt',
      targetName: 'Ceres Outpost',
      targetDistKm: '418 Million km',
      shipStart: { x: 80, y: 300, vx: 2.5, vy: 0 },
      planets: [
        { x: 480, y: 140, radius: 38, mass: 900, name: 'Ceres', color: '#cbd5e1', glowColor: 'rgba(203, 213, 225, 0.3)' },
      ],
      target: { x: 1020, y: 320, radius: 38, name: 'Jupiter Gateway' },
      asteroidsCount: 22,
      badge: 'Asteroid Belt Survivor',
    },
    {
      id: 3,
      act: 'ACT IV',
      name: 'Callisto Base Landing',
      objective: 'Jovian insertion! Retro-brake smoothly and touch down in Valhalla Crater (< 3.0 m/s).',
      originName: 'Jovian Orbit',
      targetName: 'Callisto Base',
      targetDistKm: '628 Million km',
      shipStart: { x: 90, y: 140, vx: 3.2, vy: 1.1 },
      planets: [
        { x: 440, y: 480, radius: 105, mass: 5500, name: 'Jupiter', color: '#e0b588', glowColor: 'rgba(224, 181, 136, 0.45)' },
        { x: 860, y: 220, radius: 24, mass: 450, name: 'Ganymede', color: '#a5b4fc', glowColor: 'rgba(165, 180, 252, 0.3)' },
      ],
      target: { x: 1050, y: 260, radius: 48, name: 'Callisto Base' },
      asteroidsCount: 6,
      badge: 'Callisto Expedition Pioneer',
    },
  ];

  const currentMission = MISSIONS[missionIndex];

  // Initialize Mission Setup
  const initMission = useCallback((index: number) => {
    const m = MISSIONS[index];
    const eng = engineRef.current;

    eng.ship.x = m.shipStart.x;
    eng.ship.y = m.shipStart.y;
    eng.ship.vx = m.shipStart.vx;
    eng.ship.vy = m.shipStart.vy;
    eng.ship.angle = Math.atan2(m.shipStart.vy, m.shipStart.vx);
    eng.ship.angVel = 0;
    eng.ship.fuel = 100;
    eng.ship.exploded = false;

    eng.planets = m.planets.map((p) => ({ ...p }));
    eng.target = { ...m.target };

    // Spawn 4 science beacons per mission
    eng.collectibles = [
      { x: m.shipStart.x + 180, y: m.shipStart.y - 40, collected: false, name: 'Optical Telemetry' },
      { x: (m.shipStart.x + m.target.x) * 0.45, y: 320, collected: false, name: 'Cosmic Ray Spectrum' },
      { x: (m.shipStart.x + m.target.x) * 0.72, y: 220, collected: false, name: 'Gravitational Wave Data' },
      { x: m.target.x - 90, y: m.target.y - 30, collected: false, name: 'Jovian Ice Core Core' },
    ];

    // Spawn asteroids
    eng.asteroids = [];
    for (let i = 0; i < m.asteroidsCount; i++) {
      eng.asteroids.push({
        x: 250 + Math.random() * 650,
        y: 80 + Math.random() * 460,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: 12 + Math.random() * 18,
        angle: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.04,
      });
    }

    // Stars background
    if (eng.stars.length === 0) {
      for (let i = 0; i < 140; i++) {
        eng.stars.push({
          x: Math.random() * 1280,
          y: Math.random() * 620,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.4 + 0.1,
        });
      }
    }

    eng.particles = [];
    setStage('flying');
    setEarnedBadge(null);
  }, []);

  const startMission = () => {
    initMission(missionIndex);
    playTelemetryBeep(980, 0.12);
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const eng = engineRef.current;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        eng.keys.up = true;
        e.preventDefault();
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        eng.keys.down = true;
        e.preventDefault();
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        eng.keys.left = true;
        e.preventDefault();
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        eng.keys.right = true;
        e.preventDefault();
      }
      if (e.code === 'Space') {
        eng.keys.warp = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const eng = engineRef.current;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') eng.keys.up = false;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') eng.keys.down = false;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') eng.keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') eng.keys.right = false;
      if (e.code === 'Space') eng.keys.warp = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main 60 FPS Physics & Animation Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let soundThrottle = 0;

    const gameLoop = (time: number) => {
      animId = requestAnimationFrame(gameLoop);
      const eng = engineRef.current;
      const ship = eng.ship;

      // Clear Screen with deep cosmic gradient
      ctx.fillStyle = '#06091A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Starfield background
      ctx.fillStyle = '#FFFFFF';
      eng.stars.forEach((star) => {
        star.x -= star.speed * (1 + Math.abs(ship.vx) * 0.3);
        if (star.x < 0) star.x = canvas.width;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // If briefing, draw static preview
      if (stage === 'briefing') {
        drawBriefingView(ctx, canvas);
        return;
      }

      // PHYSICS UPDATE
      if (stage === 'flying' && !ship.exploded) {
        // Controls Handling
        const isUp = eng.keys.up || eng.touchControls.thrust;
        const isDown = eng.keys.down || eng.touchControls.brake;
        const isLeft = eng.keys.left || eng.touchControls.left;
        const isRight = eng.keys.right || eng.touchControls.right;
        const isWarp = eng.keys.warp;

        if (isLeft) ship.angVel -= 0.005;
        if (isRight) ship.angVel += 0.005;
        ship.angVel *= 0.94; // Rotational damping
        ship.angle += ship.angVel;

        // Thrust Propulsion
        if (isUp && ship.fuel > 0) {
          const power = isWarp ? 0.22 : 0.085;
          ship.vx += Math.cos(ship.angle) * power;
          ship.vy += Math.sin(ship.angle) * power;
          ship.fuel = Math.max(0, ship.fuel - (isWarp ? 0.35 : 0.08));

          // Spawn Ion Thruster Exhaust Particles
          for (let p = 0; p < (isWarp ? 5 : 2); p++) {
            const exhaustAngle = ship.angle + Math.PI + (Math.random() - 0.5) * 0.4;
            const spd = 3 + Math.random() * 4;
            eng.particles.push({
              x: ship.x - Math.cos(ship.angle) * 16,
              y: ship.y - Math.sin(ship.angle) * 16,
              vx: Math.cos(exhaustAngle) * spd + ship.vx * 0.4,
              vy: Math.sin(exhaustAngle) * spd + ship.vy * 0.4,
              life: 1,
              maxLife: 20 + Math.random() * 15,
              color: isWarp ? '#a855f7' : Math.random() > 0.4 ? '#38bdf8' : '#f8fafc',
              size: Math.random() * 3 + 2,
            });
          }

          soundThrottle++;
          if (soundThrottle % 8 === 0) {
            playThrusterBurst();
          }
        }

        // Retro-Braking RCS
        if (isDown && ship.fuel > 0) {
          ship.vx *= 0.975;
          ship.vy *= 0.975;
          ship.fuel = Math.max(0, ship.fuel - 0.04);
        }

        // Gravity Wells from Planets
        eng.planets.forEach((p) => {
          const dx = p.x - ship.x;
          const dy = p.y - ship.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);

          if (dist > p.radius) {
            const force = (p.mass / Math.max(distSq, 1000)) * 0.45;
            ship.vx += (dx / dist) * force;
            ship.vy += (dy / dist) * force;
          }

          // Crash into Planet
          if (dist < p.radius + 10) {
            triggerExplosion(ship.x, ship.y, '#ef4444');
            ship.exploded = true;
            setStage('crashed');
            playWarpSurge();
          }
        });

        // Update Ship Position
        ship.x += ship.vx;
        ship.y += ship.vy;

        // Boundaries Wrapping
        if (ship.x < 0) ship.x = canvas.width;
        if (ship.x > canvas.width) ship.x = 0;
        if (ship.y < 0) ship.y = canvas.height;
        if (ship.y > canvas.height) ship.y = 0;

        // Asteroids motion & collisions
        eng.asteroids.forEach((ast) => {
          ast.x += ast.vx;
          ast.y += ast.vy;
          ast.angle += ast.vRot;
          if (ast.x < 0) ast.x = canvas.width;
          if (ast.x > canvas.width) ast.x = 0;
          if (ast.y < 0) ast.y = canvas.height;
          if (ast.y > canvas.height) ast.y = 0;

          // Check hit
          const dx = ast.x - ship.x;
          const dy = ast.y - ship.y;
          if (Math.hypot(dx, dy) < ast.radius + 10) {
            triggerExplosion(ship.x, ship.y, '#f97316');
            ship.exploded = true;
            setStage('crashed');
            playWarpSurge();
          }
        });

        // Collect Science Beacons
        eng.collectibles.forEach((item) => {
          if (!item.collected) {
            const d = Math.hypot(item.x - ship.x, item.y - ship.y);
            if (d < 30) {
              item.collected = true;
              setScore((s) => s + 250);
              setScienceCollected((c) => c + 1);
              playBeaconPing(1320, 0.25);
            }
          }
        });

        // Check Target Landing Zone
        const targetDist = Math.hypot(eng.target.x - ship.x, eng.target.y - ship.y);
        const currentSpeed = Math.hypot(ship.vx, ship.vy);

        if (targetDist < eng.target.radius + 12) {
          if (currentSpeed < 3.2) {
            // SUCCESSFUL LANDING / INJECTION!
            setStage('landed');
            const bonusFuel = Math.round(ship.fuel * 5);
            const totalScore = 1000 + bonusFuel + scienceCollected * 250;
            setScore(totalScore);
            setEarnedBadge(currentMission.badge);
            playBeaconPing(1760, 0.6);
          } else {
            // TOO FAST CRASH
            triggerExplosion(ship.x, ship.y, '#ef4444');
            ship.exploded = true;
            setStage('crashed');
            playWarpSurge();
          }
        }

        // Live Telemetry Sync
        setTelemetry({
          speed: Number((currentSpeed * 4.2).toFixed(1)),
          fuel: Math.round(ship.fuel),
          altitude: Math.round(targetDist * 8),
          targetDist: Math.round(targetDist),
          gForce: Number((1 + (currentSpeed * 0.3)).toFixed(2)),
          status:
            currentSpeed > 3.8
              ? 'WARNING: RETRO-BRAKE REQUIRED'
              : targetDist < 120
              ? 'APPROACHING TARGET HARBOR'
              : 'TRAJECTORY STABLE',
        });
      }

      // RENDER GAME WORLD

      // 1. Draw Target Landing Harbor
      drawTarget(ctx, eng.target);

      // 2. Draw Planets & Gravitational Halos
      eng.planets.forEach((p) => drawPlanet(ctx, p));

      // 3. Draw Predictive Trajectory Arc (Flight Path)
      drawPredictiveTrajectory(ctx, ship, eng.planets);

      // 4. Draw Collectibles
      eng.collectibles.forEach((col) => drawCollectible(ctx, col));

      // 5. Draw Asteroids
      eng.asteroids.forEach((ast) => drawAsteroid(ctx, ast));

      // 6. Update and Draw Particles
      eng.particles = eng.particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1 / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        return p.life > 0;
      });

      // 7. Draw Player Spaceship
      if (!ship.exploded) {
        drawShip(ctx, ship);
      }
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [stage, missionIndex, scienceCollected]);

  // Trigger ship explosion particle shockwave
  const triggerExplosion = (x: number, y: number, color: string) => {
    const eng = engineRef.current;
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 1 + Math.random() * 6;
      eng.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 1,
        maxLife: 35 + Math.random() * 25,
        color: Math.random() > 0.4 ? color : '#f8fafc',
        size: Math.random() * 4 + 2,
      });
    }
  };

  // Visual Renderers
  const drawShip = (ctx: CanvasRenderingContext2D, ship: typeof engineRef.current.ship) => {
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);

    // Glowing shield aura
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(158, 130, 222, 0.15)';
    ctx.fill();

    // Solar Wings
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-8, -18, 12, 6);
    ctx.fillRect(-8, 12, 12, 6);

    // Main Fuselage (Arrowhead spaceship)
    ctx.beginPath();
    ctx.moveTo(18, 0); // Nose cone
    ctx.lineTo(-14, -12); // Left wingtip
    ctx.lineTo(-8, 0); // Engine socket
    ctx.lineTo(-14, 12); // Right wingtip
    ctx.closePath();
    ctx.fillStyle = '#F8F6FF';
    ctx.fill();
    ctx.strokeStyle = '#9E82DE';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Cockpit Visor
    ctx.beginPath();
    ctx.ellipse(4, 0, 6, 3, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffb366';
    ctx.fill();

    ctx.restore();
  };

  const drawPlanet = (ctx: CanvasRenderingContext2D, p: Planet) => {
    // Gravitational Atmospheric Glow
    const grad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.7, p.x, p.y, p.radius * 1.6);
    grad.addColorStop(0, p.color);
    grad.addColorStop(0.6, p.glowColor);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Planet Solid Body
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Name Label
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(p.name.toUpperCase(), p.x, p.y + p.radius + 16);
  };

  const drawTarget = (ctx: CanvasRenderingContext2D, t: typeof engineRef.current.target) => {
    // Rotating Reticle Rings
    const now = Date.now() * 0.002;
    ctx.save();
    ctx.translate(t.x, t.y);

    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, t.radius, now, now + Math.PI * 2);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(0, 0, t.radius * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(74, 222, 128, 0.2)';
    ctx.fill();
    ctx.stroke();

    // Pulsing Beacon Core
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#4ade80';
    ctx.fill();

    ctx.fillStyle = '#4ade80';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('LANDING VECTOR', 0, t.radius + 18);
    ctx.fillText(t.name.toUpperCase(), 0, t.radius + 30);
    ctx.restore();
  };

  const drawCollectible = (ctx: CanvasRenderingContext2D, col: Collectible) => {
    if (col.collected) return;
    const pulse = Math.sin(Date.now() * 0.005) * 3;
    ctx.save();
    ctx.translate(col.x, col.y);

    // Beacon diamond
    ctx.beginPath();
    ctx.moveTo(0, -10 - pulse);
    ctx.lineTo(8 + pulse, 0);
    ctx.lineTo(0, 10 + pulse);
    ctx.lineTo(-8 - pulse, 0);
    ctx.closePath();
    ctx.fillStyle = '#ffb366';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  };

  const drawAsteroid = (ctx: CanvasRenderingContext2D, ast: Asteroid) => {
    ctx.save();
    ctx.translate(ast.x, ast.y);
    ctx.rotate(ast.angle);

    ctx.beginPath();
    ctx.arc(0, 0, ast.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#475569';
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Crater mark
    ctx.beginPath();
    ctx.arc(ast.radius * 0.3, ast.radius * 0.2, ast.radius * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#334155';
    ctx.fill();

    ctx.restore();
  };

  // Trajectory Prediction Arc
  const drawPredictiveTrajectory = (
    ctx: CanvasRenderingContext2D,
    ship: typeof engineRef.current.ship,
    planets: Planet[]
  ) => {
    let simX = ship.x;
    let simY = ship.y;
    let simVx = ship.vx;
    let simVy = ship.vy;

    ctx.beginPath();
    ctx.moveTo(simX, simY);

    for (let step = 0; step < 40; step++) {
      planets.forEach((p) => {
        const dx = p.x - simX;
        const dy = p.y - simY;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);
        if (dist > p.radius) {
          const force = (p.mass / Math.max(distSq, 1000)) * 0.45;
          simVx += (dx / dist) * force;
          simVy += (dy / dist) * force;
        }
      });
      simX += simVx;
      simY += simVy;
      ctx.lineTo(simX, simY);
    }

    ctx.strokeStyle = 'rgba(158, 130, 222, 0.4)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawBriefingView = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#F8F6FF';
    ctx.font = '22px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(`FLIGHT MANIFEST — ${currentMission.act}: ${currentMission.name}`, canvas.width / 2, 220);

    ctx.fillStyle = 'var(--steel)';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(currentMission.objective, canvas.width / 2, 255);
    ctx.fillText(`TARGET HARBOR: ${currentMission.targetName} [${currentMission.targetDistKm}]`, canvas.width / 2, 280);

    ctx.fillStyle = '#4ade80';
    ctx.fillText('CLICK [LAUNCH FLIGHT SIMULATOR] TO ENGAGE THRUSTERS', canvas.width / 2, 340);
  };

  return (
    <div
      style={{
        backgroundColor: '#070B1F',
        border: '1px solid rgba(158, 130, 222, 0.35)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(158, 130, 222, 0.2)',
        fontFamily: 'var(--font-mono)',
        color: '#F8F6FF',
      }}
    >
      {/* Flight Control Cockpit Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.25rem',
          backgroundColor: 'rgba(13, 20, 56, 0.95)',
          borderBottom: '1px solid rgba(158, 130, 222, 0.25)',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: stage === 'flying' ? '#4ade80' : stage === 'crashed' ? '#ef4444' : '#38bdf8',
              boxShadow: `0 0 10px ${stage === 'flying' ? '#4ade80' : '#38bdf8'}`,
            }}
          />
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.08em' }}>
              ORBITAL FLIGHT SIMULATOR // {currentMission.act}
            </div>
            <div style={{ fontSize: '0.625rem', color: '#9E82DE' }}>
              {currentMission.name.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Mission Level Switcher */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {MISSIONS.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => {
                setMissionIndex(idx);
                initMission(idx);
              }}
              style={{
                padding: '0.3rem 0.6rem',
                backgroundColor: missionIndex === idx ? '#9E82DE' : 'rgba(21, 34, 84, 0.6)',
                color: missionIndex === idx ? '#070B1F' : '#D4CEF8',
                border: '1px solid rgba(158, 130, 222, 0.35)',
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

      {/* Main Canvas Flight Viewport */}
      <div style={{ position: 'relative', width: '100%', height: '520px', backgroundColor: '#06091A' }}>
        <canvas
          ref={canvasRef}
          width={1160}
          height={520}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />

        {/* HUD Overlay Gauges */}
        {stage === 'flying' && (
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              pointerEvents: 'none',
              backgroundColor: 'rgba(7, 11, 31, 0.75)',
              padding: '0.65rem 0.95rem',
              borderRadius: '8px',
              border: '1px solid rgba(158, 130, 222, 0.3)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div style={{ fontSize: '0.625rem', color: '#9E82DE', letterSpacing: '0.1em' }}>FLIGHT TELEMETRY</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
              VELOCITY: <span style={{ color: telemetry.speed > 16 ? '#f87171' : '#38bdf8' }}>{telemetry.speed} km/s</span>
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
              FUEL CELL: <span style={{ color: telemetry.fuel < 25 ? '#ef4444' : '#4ade80' }}>{telemetry.fuel}%</span>
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
              TARGET RANGE: <span style={{ color: '#D4CEF8' }}>{telemetry.targetDist} km</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#ffb366', marginTop: '0.2rem' }}>
              SCIENCE BEACONS: {scienceCollected}/4
            </div>
            <div
              style={{
                fontSize: '0.6875rem',
                color: telemetry.status.includes('WARNING') ? '#ef4444' : '#4ade80',
                fontWeight: 700,
                marginTop: '0.25rem',
              }}
            >
              // {telemetry.status}
            </div>
          </div>
        )}

        {/* Flight Modal Overlays: Briefing, Landed, or Crashed */}
        {stage === 'briefing' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(7, 11, 31, 0.88)',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <img src="/logo.jpg" alt="" width="80" height="80" style={{ borderRadius: '50%', marginBottom: '1rem', border: '2px solid #9E82DE' }} />
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem', fontFamily: 'var(--font-display)' }}>
              MISSION: {currentMission.name}
            </div>
            <p style={{ maxWidth: '580px', fontSize: '0.85rem', color: '#D4CEF8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {currentMission.objective} Use thrusters to navigate celestial gravity wells, collect science data beacons, and touch down safely at the target harbor.
            </p>
            <div style={{ fontSize: '0.75rem', color: '#9E82DE', marginBottom: '1.5rem', display: 'flex', gap: '1.5rem' }}>
              <span>CONTROLS: [W / UP] = Thrust</span>
              <span>[A / D / ARROWS] = Steer</span>
              <span>[S / DOWN] = Airbrake</span>
              <span>[SPACE] = Warp Boost</span>
            </div>
            <button
              onClick={startMission}
              style={{
                padding: '0.85rem 2.2rem',
                backgroundColor: '#9E82DE',
                color: '#070B1F',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 24px rgba(158, 130, 222, 0.65)',
                transition: 'transform 0.2s',
              }}
            >
              LAUNCH EXPEDITION CRAFT
            </button>
          </div>
        )}

        {stage === 'landed' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(7, 11, 31, 0.92)',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#4ade80', marginBottom: '0.3rem', fontFamily: 'var(--font-display)' }}>
              TOUCHDOWN NOMINAL — HARBOR SECURED
            </div>
            <p style={{ color: '#D4CEF8', fontSize: '0.875rem', marginBottom: '1rem' }}>
              You successfully landed at {currentMission.targetName} with flight velocity nominal!
            </p>
            <div
              style={{
                backgroundColor: 'rgba(21, 34, 84, 0.7)',
                padding: '0.8rem 1.6rem',
                borderRadius: '8px',
                border: '1px solid #4ade80',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#9E82DE' }}>MISSION SCORE & BADGE AWARDED</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>{score} PTS</div>
              <div style={{ fontSize: '0.85rem', color: '#ffb366', fontWeight: 700, marginTop: '0.2rem' }}>
                BADGE: {earnedBadge}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => initMission(missionIndex)}
                style={{
                  padding: '0.65rem 1.4rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #9E82DE',
                  color: '#F8F6FF',
                  borderRadius: '6px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Replay Mission
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
                    backgroundColor: '#9E82DE',
                    border: 'none',
                    color: '#070B1F',
                    borderRadius: '6px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 0 16px rgba(158, 130, 222, 0.5)',
                  }}
                >
                  Proceed to Next Act &rarr;
                </button>
              )}
            </div>
          </div>
        )}

        {stage === 'crashed' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(7, 11, 31, 0.9)',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.4rem', fontFamily: 'var(--font-display)' }}>
              HULL BREACH DETECTED — CRAFT DESTROYED
            </div>
            <p style={{ color: '#D4CEF8', fontSize: '0.85rem', maxWidth: '460px', marginBottom: '1.25rem' }}>
              Impact force exceeded structural threshold or high-velocity orbital collision occurred. Deploy maneuvering retro-thrusters earlier to slow your descent.
            </p>
            <button
              onClick={() => initMission(missionIndex)}
              style={{
                padding: '0.75rem 1.8rem',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 0 18px rgba(239, 68, 68, 0.5)',
              }}
            >
              RESPAWN SHIP & RETRY
            </button>
          </div>
        )}
      </div>

      {/* Flight Control Cockpit Deck / Interactive Controller Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          padding: '1rem 1.25rem',
          backgroundColor: 'rgba(13, 20, 56, 0.95)',
          borderTop: '1px solid rgba(158, 130, 222, 0.25)',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        {/* Left: Mission Objectives & Instructions */}
        <div>
          <div style={{ fontSize: '0.625rem', color: '#9E82DE', letterSpacing: '0.08em' }}>MISSION DIRECTIVE</div>
          <div style={{ fontSize: '0.8125rem', color: '#F8F6FF', fontWeight: 600, marginTop: '0.2rem' }}>
            {currentMission.objective}
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#5E709C', marginTop: '0.35rem' }}>
            Keyboard: [W] Thrust • [A/D] Steer • [S] Brake • [SPACE] Warp
          </div>
        </div>

        {/* Center: Interactive On-Screen Touch / Click Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          <button
            onMouseDown={() => (engineRef.current.touchControls.left = true)}
            onMouseUp={() => (engineRef.current.touchControls.left = false)}
            onTouchStart={() => (engineRef.current.touchControls.left = true)}
            onTouchEnd={() => (engineRef.current.touchControls.left = false)}
            style={cockpitControlBtnStyle}
            title="Rotate Left"
          >
            ◀ ROTATE
          </button>
          <button
            onMouseDown={() => (engineRef.current.touchControls.thrust = true)}
            onMouseUp={() => (engineRef.current.touchControls.thrust = false)}
            onTouchStart={() => (engineRef.current.touchControls.thrust = true)}
            onTouchEnd={() => (engineRef.current.touchControls.thrust = false)}
            style={{ ...cockpitControlBtnStyle, backgroundColor: '#9E82DE', color: '#070B1F', fontWeight: 800 }}
            title="Fire Main Engines"
          >
            🚀 MAIN THRUST
          </button>
          <button
            onMouseDown={() => (engineRef.current.touchControls.right = true)}
            onMouseUp={() => (engineRef.current.touchControls.right = false)}
            onTouchStart={() => (engineRef.current.touchControls.right = true)}
            onTouchEnd={() => (engineRef.current.touchControls.right = false)}
            style={cockpitControlBtnStyle}
            title="Rotate Right"
          >
            ROTATE ▶
          </button>
          <button
            onMouseDown={() => (engineRef.current.touchControls.brake = true)}
            onMouseUp={() => (engineRef.current.touchControls.brake = false)}
            onTouchStart={() => (engineRef.current.touchControls.brake = true)}
            onTouchEnd={() => (engineRef.current.touchControls.brake = false)}
            style={{ ...cockpitControlBtnStyle, borderColor: '#f87171' }}
            title="Retro-Brake"
          >
            🛑 RETRO
          </button>
        </div>

        {/* Right: Restart & Audio */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            onClick={() => initMission(missionIndex)}
            style={{
              padding: '0.45rem 0.85rem',
              backgroundColor: 'rgba(21, 34, 84, 0.7)',
              border: '1px solid rgba(158, 130, 222, 0.4)',
              borderRadius: '4px',
              color: '#D4CEF8',
              fontSize: '0.6875rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🔄 RESTART FLIGHT
          </button>
        </div>
      </div>
    </div>
  );
}

const cockpitControlBtnStyle: React.CSSProperties = {
  padding: '0.55rem 0.85rem',
  backgroundColor: 'rgba(21, 34, 84, 0.9)',
  border: '1px solid rgba(158, 130, 222, 0.5)',
  borderRadius: '6px',
  color: '#FFFFFF',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6875rem',
  fontWeight: 700,
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'transform 0.1s',
};
