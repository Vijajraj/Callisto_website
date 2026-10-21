import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  playTelemetryBeep,
  playBeaconPing,
  playWarpSurge,
  playLaserFire,
  playAsteroidBlast,
} from '../../lib/audio';

interface Planet {
  x: number;
  y: number;
  radius: number;
  name: string;
  color: string;
  glowColor: string;
  slingshotRadius: number;
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

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
  size: number;
}

interface LaserBolt {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  life: number;
}

interface Collectible {
  id: number;
  x: number;
  y: number;
  collected: boolean;
  name: string;
  type: 'telemetry' | 'stardust' | 'anomaly';
}

interface Asteroid {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  angle: number;
  vRot: number;
  hp: number;
  color: string;
}

interface Gate {
  x: number;
  y: number;
  radius: number;
  name: string;
  active: boolean;
  pulseTimer: number;
}

interface MissionDef {
  id: number;
  act: string;
  name: string;
  objective: string;
  storyBrief: string;
  targetName: string;
  planets: Planet[];
  gate: Gate;
  collectiblesCount: number;
  asteroidsCount: number;
  badge: string;
  colorTheme: string;
}

export default function ExpeditionSimulator(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // High-Level UI States
  const [missionIndex, setMissionIndex] = useState<number>(0);
  const [stage, setStage] = useState<'briefing' | 'flying' | 'victory' | 'respawn'>('briefing');
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [scienceCount, setScienceCount] = useState<number>(0);
  const [warpReady, setWarpReady] = useState<number>(100);
  const [shields, setShields] = useState<number>(100);
  const [earnedBadge, setEarnedBadge] = useState<string | null>(null);

  // HUD Readout
  const [hudStatus, setHudStatus] = useState<string>('SYSTEMS CALIBRATED');

  // Mutable Game Engine (for seamless 60fps canvas performance)
  const engineRef = useRef({
    mouse: { x: 200, y: 260, isDown: false, hasMoved: false },
    ship: {
      x: 140,
      y: 260,
      vx: 0,
      vy: 0,
      angle: 0,
      targetAngle: 0,
      speed: 0,
      warpCooldown: 0,
      invulnerable: 0,
    },
    trail: [] as TrailPoint[],
    lasers: [] as LaserBolt[],
    asteroids: [] as Asteroid[],
    collectibles: [] as Collectible[],
    particles: [] as Particle[],
    planets: [] as Planet[],
    gate: null as Gate | null,
    stars: [] as { x: number; y: number; size: number; speed: number; alpha: number }[],
    lastLaserTime: 0,
    scoreRef: 0,
    comboRef: 1,
    comboTimer: 0,
    anomalyTimer: 0,
    width: 1160,
    height: 520,
  });

  const MISSIONS: MissionDef[] = [
    {
      id: 0,
      act: 'ACT I',
      name: 'Earth Departure & Lunar Gateway',
      objective: 'Glide using your cursor/finger. Collect 4 Telemetry Crystals and fly through the Lunar Accelerator Gate.',
      storyBrief: 'Departing Earth parking orbit. Steer through orbital space, gather sensor crystals, and enter the Lunar transit corridor.',
      targetName: 'Lunar Accelerator Gate',
      colorTheme: '#38bdf8',
      planets: [
        { x: 120, y: 440, radius: 64, name: 'Earth', color: '#38bdf8', glowColor: 'rgba(56, 189, 248, 0.4)', slingshotRadius: 130 },
        { x: 740, y: 180, radius: 28, name: 'Moon', color: '#e2e8f0', glowColor: 'rgba(226, 232, 240, 0.35)', slingshotRadius: 70 },
      ],
      gate: { x: 1040, y: 260, radius: 46, name: 'Lunar Gate', active: true, pulseTimer: 0 },
      collectiblesCount: 4,
      asteroidsCount: 4,
      badge: 'Departure Vanguard',
    },
    {
      id: 1,
      act: 'ACT II',
      name: 'Martian Gravity Corridor',
      objective: 'Navigate Martian dust corridors, zap red silica asteroids with your Pulse Laser, and dock at Mars Orbital Station.',
      storyBrief: 'Approaching Mars and Phobos. Mineral dust clouds detected. Fire pulse lasers (click/tap) to clear the path.',
      targetName: 'Mars Orbital Station',
      colorTheme: '#c98a66',
      planets: [
        { x: 580, y: 380, radius: 62, name: 'Mars', color: '#c98a66', glowColor: 'rgba(201, 138, 102, 0.45)', slingshotRadius: 130 },
        { x: 280, y: 150, radius: 20, name: 'Phobos', color: '#94a3b8', glowColor: 'rgba(148, 163, 184, 0.35)', slingshotRadius: 55 },
      ],
      gate: { x: 1030, y: 260, radius: 46, name: 'Mars Orbital Station', active: true, pulseTimer: 0 },
      collectiblesCount: 5,
      asteroidsCount: 9,
      badge: 'Red Planet Navigator',
    },
    {
      id: 2,
      act: 'ACT III',
      name: 'Asteroid Belt & Project Hail Mary',
      objective: 'Blast drifting space debris with Pulse Lasers and establish resonance with the Alien Anomaly Beacon.',
      storyBrief: 'Cruising through the dense asteroid belt. Strange harmonious acoustic frequencies detected — locate the first contact beacon.',
      targetName: 'Hail Mary Resonance Beacon',
      colorTheme: '#ffb366',
      planets: [
        { x: 480, y: 140, radius: 36, name: 'Ceres', color: '#cbd5e1', glowColor: 'rgba(203, 213, 225, 0.35)', slingshotRadius: 85 },
      ],
      gate: { x: 1020, y: 280, radius: 50, name: 'Hail Mary Beacon', active: true, pulseTimer: 0 },
      collectiblesCount: 6,
      asteroidsCount: 16,
      badge: 'Asteroid Belt Survivor',
    },
    {
      id: 3,
      act: 'ACT IV',
      name: 'Callisto Base Final Touchdown',
      objective: 'Pass Jovian moons, sweep up all expedition science cores, and land safely inside Valhalla Base harbor.',
      storyBrief: 'Entering the Jovian system. Jupiter radiates vast magnetic bands. Callisto Base illuminated below in the icy crater basin.',
      targetName: 'Callisto Valhalla Base',
      colorTheme: '#9C84D6',
      planets: [
        { x: 440, y: 440, radius: 88, name: 'Jupiter', color: '#e0b588', glowColor: 'rgba(224, 181, 136, 0.45)', slingshotRadius: 160 },
        { x: 800, y: 160, radius: 26, name: 'Ganymede', color: '#a5b4fc', glowColor: 'rgba(165, 180, 252, 0.35)', slingshotRadius: 65 },
      ],
      gate: { x: 1040, y: 260, radius: 52, name: 'Callisto Base', active: true, pulseTimer: 0 },
      collectiblesCount: 6,
      asteroidsCount: 8,
      badge: 'Callisto Expedition Pioneer',
    },
  ];

  const currentMission = MISSIONS[missionIndex];

  // Fire Pulse Laser
  const fireLaser = useCallback(() => {
    const eng = engineRef.current;
    const now = Date.now();
    if (now - eng.lastLaserTime < 180) return; // rate limit 5 shots/sec
    eng.lastLaserTime = now;

    const ship = eng.ship;
    const cos = Math.cos(ship.angle);
    const sin = Math.sin(ship.angle);
    const speed = 14;

    // Twin lasers from left and right wingtips
    const wingOffset = 10;
    eng.lasers.push(
      {
        x: ship.x + cos * 16 - sin * wingOffset,
        y: ship.y + sin * 16 + cos * wingOffset,
        vx: cos * speed,
        vy: sin * speed,
        angle: ship.angle,
        life: 50,
      },
      {
        x: ship.x + cos * 16 + sin * wingOffset,
        y: ship.y + sin * 16 - cos * wingOffset,
        vx: cos * speed,
        vy: sin * speed,
        angle: ship.angle,
        life: 50,
      }
    );

    // Muzzle flash particles
    for (let i = 0; i < 4; i++) {
      eng.particles.push({
        x: ship.x + cos * 18,
        y: ship.y + sin * 18,
        vx: cos * 3 + (Math.random() - 0.5) * 2,
        vy: sin * 3 + (Math.random() - 0.5) * 2,
        life: 1,
        maxLife: 10,
        color: '#9C84D6',
        size: Math.random() * 2 + 1,
      });
    }

    playLaserFire();
  }, []);

  // Trigger Warp Surge (Hyper Boost)
  const triggerWarpBoost = useCallback(() => {
    const eng = engineRef.current;
    if (eng.ship.warpCooldown > 0) return;

    const ship = eng.ship;
    const cos = Math.cos(ship.angle);
    const sin = Math.sin(ship.angle);

    // Warp forward impulse
    ship.vx += cos * 18;
    ship.vy += sin * 18;
    ship.warpCooldown = 150; // 2.5s cooldown
    ship.invulnerable = 60; // 1s invulnerability

    // Dimensional distortion warp shockwave
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 2 + Math.random() * 8;
      eng.particles.push({
        x: ship.x,
        y: ship.y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 1,
        maxLife: 25,
        color: Math.random() > 0.4 ? '#CFCBF2' : '#9C84D6',
        size: Math.random() * 4 + 2,
      });
    }

    setHudStatus('WARP DRIVE SURGE ENGAGED');
    playWarpSurge();
  }, []);

  // Initialize or Reset a Mission
  const initMission = useCallback(
    (index: number) => {
      const m = MISSIONS[index];
      const eng = engineRef.current;

      eng.ship = {
        x: 120,
        y: 260,
        vx: 2.5,
        vy: 0,
        angle: 0,
        targetAngle: 0,
        speed: 2.5,
        warpCooldown: 0,
        invulnerable: 90, // 1.5s staging invulnerability
      };

      eng.mouse = { x: 300, y: 260, isDown: false, hasMoved: false };
      eng.trail = [];
      eng.lasers = [];
      eng.particles = [];
      eng.scoreRef = 0;
      eng.comboRef = 1;
      eng.comboTimer = 0;
      eng.anomalyTimer = 0;

      eng.planets = m.planets.map((p) => ({ ...p }));
      eng.gate = { ...m.gate };

      // Spawn Telemetry Crystals along the flight corridor
      eng.collectibles = [];
      for (let i = 0; i < m.collectiblesCount; i++) {
        const spreadX = 220 + (i / m.collectiblesCount) * 650;
        const spreadY = 120 + Math.sin(i * 1.5) * 160 + (Math.random() - 0.5) * 60;
        eng.collectibles.push({
          id: i,
          x: spreadX,
          y: Math.max(80, Math.min(440, spreadY)),
          collected: false,
          name: `Sector-${i + 1} Sensor Crystal`,
          type: 'telemetry',
        });
      }

      // Spawn Asteroids (away from starting point)
      eng.asteroids = [];
      for (let i = 0; i < m.asteroidsCount; i++) {
        eng.asteroids.push({
          id: i,
          x: 320 + Math.random() * 600,
          y: 70 + Math.random() * 380,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          radius: 14 + Math.random() * 16,
          angle: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.04,
          hp: 1,
          color: index === 1 ? '#c98a66' : '#64748b',
        });
      }

      // Generate Cosmic Starfield once
      if (eng.stars.length === 0) {
        for (let i = 0; i < 160; i++) {
          eng.stars.push({
            x: Math.random() * eng.width,
            y: Math.random() * eng.height,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.6 + 0.15,
            alpha: Math.random() * 0.7 + 0.3,
          });
        }
      }

      setScore(0);
      setCombo(1);
      setScienceCount(0);
      setWarpReady(100);
      setShields(100);
      setStage('flying');
      setEarnedBadge(null);
      setHudStatus('MISSION LAUNCHED — STEER WITH CURSOR');
    },
    [MISSIONS]
  );

  const startMission = () => {
    initMission(missionIndex);
    playTelemetryBeep(980, 0.15);
  };

  // Canvas Mouse and Touch Events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updatePos = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;
      engineRef.current.mouse.x = Math.max(20, Math.min(canvas.width - 20, x));
      engineRef.current.mouse.y = Math.max(20, Math.min(canvas.height - 20, y));
      engineRef.current.mouse.hasMoved = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePos(e.clientX, e.clientY);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        engineRef.current.mouse.isDown = true;
        fireLaser();
      } else if (e.button === 2) {
        e.preventDefault();
        triggerWarpBoost();
      }
    };

    const handleMouseUp = () => {
      engineRef.current.mouse.isDown = false;
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    // Touch Support for Mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePos(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePos(e.touches[0].clientX, e.touches[0].clientY);
        fireLaser();
      }
    };

    // Keyboard Shortcuts (Space: Laser, W/Shift: Warp)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        fireLaser();
        e.preventDefault();
      }
      if (e.code === 'KeyW' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        triggerWarpBoost();
        e.preventDefault();
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('contextmenu', handleContextMenu);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('contextmenu', handleContextMenu);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fireLaser, triggerWarpBoost]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      animId = requestAnimationFrame(gameLoop);
      const eng = engineRef.current;
      const ship = eng.ship;

      // 1. CLEAR VIEWPORT WITH NEBULA CANVAS
      ctx.fillStyle = '#060919';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. PARALLAX DRIFTING STARFIELD
      ctx.fillStyle = '#FFFFFF';
      eng.stars.forEach((star) => {
        star.x -= star.speed * (1 + Math.abs(ship.vx) * 0.15);
        if (star.x < 0) star.x = canvas.width;
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // If briefing or victory, render background scene and exit update
      if (stage === 'briefing') {
        drawPlanets(ctx, eng.planets);
        drawGate(ctx, eng.gate);
        return;
      }

      // 3. FLUID SHIP FLIGHT DYNAMICS (Tracks Cursor/Finger Effortlessly)
      if (stage === 'flying') {
        if (eng.mouse.hasMoved) {
          const dx = eng.mouse.x - ship.x;
          const dy = eng.mouse.y - ship.y;
          const dist = Math.hypot(dx, dy);

          // Smooth easing towards cursor (no awkward inertia spinning)
          const spring = 0.085;
          const damp = 0.86;
          ship.vx += dx * spring;
          ship.vy += dy * spring;
          ship.vx *= damp;
          ship.vy *= damp;

          // Limit max glide speed
          const maxSpd = ship.invulnerable > 0 ? 16 : 8.5;
          const curSpd = Math.hypot(ship.vx, ship.vy);
          if (curSpd > maxSpd) {
            ship.vx = (ship.vx / curSpd) * maxSpd;
            ship.vy = (ship.vy / curSpd) * maxSpd;
          }

          // Smoothly rotate toward travel heading
          if (curSpd > 0.4) {
            const targetAngle = Math.atan2(ship.vy, ship.vx);
            // Angle interpolation
            let diff = targetAngle - ship.angle;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            ship.angle += diff * 0.18;
          }
        }

        ship.x += ship.vx;
        ship.y += ship.vy;

        // Keep inside bounds
        ship.x = Math.max(25, Math.min(canvas.width - 25, ship.x));
        ship.y = Math.max(25, Math.min(canvas.height - 25, ship.y));

        // Cooldown tickers
        if (ship.warpCooldown > 0) ship.warpCooldown--;
        if (ship.invulnerable > 0) ship.invulnerable--;
        setWarpReady(Math.round(((150 - ship.warpCooldown) / 150) * 100));

        // Add Bioluminescent Trail Points
        if (Math.hypot(ship.vx, ship.vy) > 0.8) {
          eng.trail.push({
            x: ship.x - Math.cos(ship.angle) * 12,
            y: ship.y - Math.sin(ship.angle) * 12,
            alpha: 0.85,
            size: ship.invulnerable > 0 ? 6 : 3.5,
          });
        }
        if (eng.trail.length > 35) eng.trail.shift();

        // 4. PLANET GRAVITY ASSISTS (Wholesome Slingshot Accelerations)
        eng.planets.forEach((p) => {
          const dx = p.x - ship.x;
          const dy = p.y - ship.y;
          const dist = Math.hypot(dx, dy);

          // Slingshot corridor (orbiting around planet adds speed bonus)
          if (dist < p.slingshotRadius && dist > p.radius) {
            const tangentAngle = Math.atan2(dy, dx) + Math.PI / 2;
            ship.vx += Math.cos(tangentAngle) * 0.45;
            ship.vy += Math.sin(tangentAngle) * 0.45;

            // Spawn slingshot starlight particles
            if (Math.random() > 0.6) {
              eng.particles.push({
                x: ship.x,
                y: ship.y,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                life: 1,
                maxLife: 18,
                color: p.color,
                size: 2.5,
              });
            }
          }

          // Gentle bounce off planetary surface (no instant death!)
          if (dist < p.radius + 14) {
            const pushAngle = Math.atan2(ship.y - p.y, ship.x - p.x);
            ship.x = p.x + Math.cos(pushAngle) * (p.radius + 16);
            ship.y = p.y + Math.sin(pushAngle) * (p.radius + 16);
            ship.vx = Math.cos(pushAngle) * 4;
            ship.vy = Math.sin(pushAngle) * 4;
            setHudStatus(`GRAVITATIONAL SLINGSHOT // ${p.name.toUpperCase()}`);
            playTelemetryBeep(1200, 0.1);
          }
        });

        // 5. UPDATE LASERS
        eng.lasers = eng.lasers.filter((l) => {
          l.x += l.vx;
          l.y += l.vy;
          l.life--;

          // Check laser collisions with asteroids
          let hit = false;
          eng.asteroids.forEach((ast) => {
            if (hit) return;
            const dist = Math.hypot(ast.x - l.x, ast.y - l.y);
            if (dist < ast.radius + 6) {
              hit = true;
              ast.hp--;

              // Explosion particles
              for (let i = 0; i < 18; i++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = 1.5 + Math.random() * 4;
                eng.particles.push({
                  x: ast.x,
                  y: ast.y,
                  vx: Math.cos(angle) * spd,
                  vy: Math.sin(angle) * spd,
                  life: 1,
                  maxLife: 22,
                  color: ast.color,
                  size: Math.random() * 3 + 1.5,
                });
              }

              // Drop Stardust collectible from shattered asteroid
              eng.collectibles.push({
                id: Date.now() + Math.random(),
                x: ast.x,
                y: ast.y,
                collected: false,
                name: 'Cosmic Stardust',
                type: 'stardust',
              });

              // Respawn asteroid on edge
              ast.x = canvas.width + 40;
              ast.y = 80 + Math.random() * 360;
              ast.hp = 1;

              eng.scoreRef += 100 * eng.comboRef;
              setScore(eng.scoreRef);
              setHudStatus('ASTEROID PULVERIZED +100');
              playAsteroidBlast();
            }
          });

          return l.life > 0 && !hit && l.x < canvas.width + 20 && l.x > -20;
        });

        // 6. UPDATE ASTEROIDS
        eng.asteroids.forEach((ast) => {
          ast.x += ast.vx;
          ast.y += ast.vy;
          ast.angle += ast.vRot;
          if (ast.x < -30) ast.x = canvas.width + 30;
          if (ast.x > canvas.width + 30) ast.x = -30;
          if (ast.y < -30) ast.y = canvas.height + 30;
          if (ast.y > canvas.height + 30) ast.y = -30;

          // Check collision with ship
          const dist = Math.hypot(ast.x - ship.x, ast.y - ship.y);
          if (dist < ast.radius + 12 && ship.invulnerable === 0) {
            // Deflect ship and reduce shield safely
            const pushAngle = Math.atan2(ship.y - ast.y, ship.x - ast.x);
            ship.vx += Math.cos(pushAngle) * 5;
            ship.vy += Math.sin(pushAngle) * 5;
            ship.invulnerable = 45; // 0.75s grace

            setShields((prev) => {
              const next = Math.max(20, prev - 15);
              return next;
            });

            // Spark particles
            for (let i = 0; i < 15; i++) {
              eng.particles.push({
                x: ship.x,
                y: ship.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 1,
                maxLife: 20,
                color: '#ef4444',
                size: 2.5,
              });
            }

            setHudStatus('SHIELD DEFLECTION TRIGGERED');
            playAsteroidBlast();
          }
        });

        // 7. COLLECT SCIENCE CRYSTALS
        eng.collectibles.forEach((item) => {
          if (!item.collected) {
            const dist = Math.hypot(item.x - ship.x, item.y - ship.y);
            if (dist < 32) {
              item.collected = true;
              const points = item.type === 'telemetry' ? 250 : 50;
              eng.scoreRef += points * eng.comboRef;
              setScore(eng.scoreRef);

              if (item.type === 'telemetry') {
                setScienceCount((c) => c + 1);
                eng.comboRef = Math.min(5, eng.comboRef + 1);
                setCombo(eng.comboRef);
                playBeaconPing(1320 + eng.comboRef * 110, 0.3);
                setHudStatus(`SENSOR CRYSTAL LOGGED (+${points * eng.comboRef} PTS)`);
              } else {
                playBeaconPing(1760, 0.15);
              }

              // Collection sparkle burst
              for (let i = 0; i < 12; i++) {
                const angle = Math.random() * Math.PI * 2;
                eng.particles.push({
                  x: item.x,
                  y: item.y,
                  vx: Math.cos(angle) * (2 + Math.random() * 3),
                  vy: Math.sin(angle) * (2 + Math.random() * 3),
                  life: 1,
                  maxLife: 24,
                  color: item.type === 'telemetry' ? '#9C84D6' : '#ffb366',
                  size: 2.5,
                });
              }
            }
          }
        });

        // 8. CHECK GATE TOUCHDOWN / COMPLETION
        if (eng.gate) {
          const gDist = Math.hypot(eng.gate.x - ship.x, eng.gate.y - ship.y);
          if (gDist < eng.gate.radius + 15) {
            // VICTORY! TOUCHDOWN NOMINAL
            setStage('victory');
            setEarnedBadge(currentMission.badge);
            playBeaconPing(1760, 0.7);
            playWarpSurge();
          }
        }
      }

      // 9. DRAW GAME WORLD

      // A. Planets & Halos
      drawPlanets(ctx, eng.planets);

      // B. Arrival Harbor Gate
      drawGate(ctx, eng.gate);

      // C. Collectibles (Telemetry Crystals & Stardust)
      drawCollectibles(ctx, eng.collectibles);

      // D. Asteroids
      drawAsteroids(ctx, eng.asteroids);

      // E. Laser Bolts
      drawLasers(ctx, eng.lasers);

      // F. Bioluminescent Starlight Trail
      drawTrail(ctx, eng.trail);

      // G. Particles
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

      // H. Spaceship
      drawSpaceship(ctx, ship);

      // I. Cursor Target Crosshair
      drawCursorAura(ctx, eng.mouse.x, eng.mouse.y);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [stage, missionIndex]);

  // Visual Renderers
  const drawSpaceship = (ctx: CanvasRenderingContext2D, ship: typeof engineRef.current.ship) => {
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);

    // Warp / Invulnerability Shield Bubble
    if (ship.invulnerable > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(156, 132, 214, ${0.5 + Math.sin(Date.now() * 0.015) * 0.4})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(156, 132, 214, 0.15)';
      ctx.fill();
    }

    // Engine Glow Halo
    ctx.beginPath();
    ctx.arc(-10, 0, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.fill();

    // Twin Solar Wings
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-6, -16, 10, 4);
    ctx.fillRect(-6, 12, 10, 4);

    // Sleek Arrowhead Fuselage
    ctx.beginPath();
    ctx.moveTo(18, 0); // Nose tip
    ctx.lineTo(-12, -12); // Left wing
    ctx.lineTo(-6, 0); // Engine socket
    ctx.lineTo(-12, 12); // Right wing
    ctx.closePath();
    ctx.fillStyle = '#F7F5FF';
    ctx.fill();
    ctx.strokeStyle = '#9C84D6';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Amber Visor Glass
    ctx.beginPath();
    ctx.ellipse(3, 0, 5, 2.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#FFB86B';
    ctx.fill();

    ctx.restore();
  };

  const drawTrail = (ctx: CanvasRenderingContext2D, trail: TrailPoint[]) => {
    if (trail.length < 2) return;
    for (let i = 0; i < trail.length; i++) {
      const pt = trail[i];
      const prog = i / trail.length;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size * prog, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(156, 132, 214, ${prog * 0.45})`;
      ctx.fill();
    }
  };

  const drawLasers = (ctx: CanvasRenderingContext2D, lasers: LaserBolt[]) => {
    ctx.strokeStyle = '#9C84D6';
    ctx.lineWidth = 2.5;
    lasers.forEach((l) => {
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.angle);

      // Glowing laser core
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(8, 0);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-4, -1, 8, 2);

      ctx.restore();
    });
  };

  const drawPlanets = (ctx: CanvasRenderingContext2D, planets: Planet[]) => {
    planets.forEach((p) => {
      // Slingshot Orbital Ring
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.slingshotRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(156, 132, 214, 0.12)';
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Atmospheric Glow
      const grad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.6, p.x, p.y, p.radius * 1.5);
      grad.addColorStop(0, p.color);
      grad.addColorStop(0.65, p.glowColor);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Planet Sphere
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Planet Title
      ctx.fillStyle = '#CFCBF2';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(p.name.toUpperCase(), p.x, p.y + p.radius + 16);
    });
  };

  const drawGate = (ctx: CanvasRenderingContext2D, gate: Gate | null) => {
    if (!gate) return;
    const now = Date.now() * 0.002;
    ctx.save();
    ctx.translate(gate.x, gate.y);

    // Rotating Acceleration Rings
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, gate.radius, now, now + Math.PI * 2);
    ctx.stroke();

    ctx.setLineDash([6, 8]);
    ctx.strokeStyle = '#9C84D6';
    ctx.beginPath();
    ctx.arc(0, 0, gate.radius * 0.7, -now * 1.5, -now * 1.5 + Math.PI * 2);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(0, 0, gate.radius * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(74, 222, 128, 0.2)';
    ctx.fill();

    // Gate Marker Label
    ctx.fillStyle = '#4ade80';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ARRIVAL HARBOR', 0, gate.radius + 18);
    ctx.fillText(gate.name.toUpperCase(), 0, gate.radius + 30);

    ctx.restore();
  };

  const drawCollectibles = (ctx: CanvasRenderingContext2D, items: Collectible[]) => {
    const pulse = Math.sin(Date.now() * 0.006) * 3;
    items.forEach((item) => {
      if (item.collected) return;
      ctx.save();
      ctx.translate(item.x, item.y);

      if (item.type === 'telemetry') {
        // Glowing Sensor Crystal (Four-point star shape from club logo)
        ctx.fillStyle = '#CFCBF2';
        ctx.beginPath();
        ctx.moveTo(0, -11 - pulse);
        ctx.lineTo(3, -3);
        ctx.lineTo(11 + pulse, 0);
        ctx.lineTo(3, 3);
        ctx.lineTo(0, 11 + pulse);
        ctx.lineTo(-3, 3);
        ctx.lineTo(-11 - pulse, 0);
        ctx.lineTo(-3, -3);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#9C84D6';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        // Stardust pearl
        ctx.beginPath();
        ctx.arc(0, 0, 4 + pulse * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = '#FFB86B';
        ctx.fill();
      }

      ctx.restore();
    });
  };

  const drawAsteroids = (ctx: CanvasRenderingContext2D, asteroids: Asteroid[]) => {
    asteroids.forEach((ast) => {
      ctx.save();
      ctx.translate(ast.x, ast.y);
      ctx.rotate(ast.angle);

      ctx.beginPath();
      ctx.arc(0, 0, ast.radius, 0, Math.PI * 2);
      ctx.fillStyle = ast.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Crater details
      ctx.beginPath();
      ctx.arc(ast.radius * 0.3, ast.radius * 0.2, ast.radius * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fill();

      ctx.restore();
    });
  };

  const drawCursorAura = (ctx: CanvasRenderingContext2D, mx: number, my: number) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(156, 132, 214, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(mx, my, 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#9C84D6';
    ctx.beginPath();
    ctx.arc(mx, my, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  return (
    <div
      style={{
        backgroundColor: '#070B1F',
        border: '1px solid rgba(156, 132, 214, 0.35)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(156, 132, 214, 0.2)',
        fontFamily: 'var(--font-mono)',
        color: '#F7F5FF',
      }}
    >
      {/* Cockpit Header with Act Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.25rem',
          backgroundColor: 'rgba(12, 18, 55, 0.95)',
          borderBottom: '1px solid rgba(156, 132, 214, 0.25)',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: stage === 'flying' ? '#4ade80' : '#38bdf8',
              boxShadow: `0 0 10px ${stage === 'flying' ? '#4ade80' : '#38bdf8'}`,
            }}
          />
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.08em' }}>
              EXPEDITION FLIGHT DECK // {currentMission.act}
            </div>
            <div style={{ fontSize: '0.625rem', color: '#9C84D6' }}>
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
                backgroundColor: missionIndex === idx ? '#9C84D6' : 'rgba(20, 32, 79, 0.6)',
                color: missionIndex === idx ? '#060919' : '#CFCBF2',
                border: '1px solid rgba(156, 132, 214, 0.35)',
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

      {/* Main Interactive Flight Viewport */}
      <div style={{ position: 'relative', width: '100%', height: '520px', backgroundColor: '#060919' }}>
        <canvas
          ref={canvasRef}
          width={1160}
          height={520}
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
        />

        {/* Flight Telemetry HUD Overlays */}
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
              backgroundColor: 'rgba(7, 11, 31, 0.8)',
              padding: '0.65rem 0.95rem',
              borderRadius: '8px',
              border: '1px solid rgba(156, 132, 214, 0.3)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div style={{ fontSize: '0.625rem', color: '#9C84D6', letterSpacing: '0.1em' }}>
              ORBITAL TELEMETRY
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
              EXPEDITION SCORE: <span style={{ color: '#4ade80' }}>{score} PTS</span>{' '}
              {combo > 1 && <span style={{ color: '#FFB86B', fontSize: '0.75rem' }}>[{combo}x COMBO]</span>}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
              WARP DRIVE: <span style={{ color: warpReady === 100 ? '#4ade80' : '#38bdf8' }}>{warpReady}% READY</span>
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
              SENSOR DATA: <span style={{ color: '#CFCBF2' }}>{scienceCount}/{currentMission.collectiblesCount} CRYSTALS</span>
            </div>
            <div
              style={{
                fontSize: '0.6875rem',
                color: '#38bdf8',
                fontWeight: 700,
                marginTop: '0.2rem',
              }}
            >
              // {hudStatus}
            </div>
          </div>
        )}

        {/* Briefing Modal Overlay */}
        {stage === 'briefing' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(6, 9, 25, 0.88)',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <img
              src="/logo.jpg"
              alt=""
              width="80"
              height="80"
              style={{ borderRadius: '50%', marginBottom: '1rem', border: '2px solid #9C84D6' }}
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
              MISSION: {currentMission.name}
            </div>
            <p style={{ maxWidth: '560px', fontSize: '0.85rem', color: '#CFCBF2', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {currentMission.storyBrief}
            </p>
            <div
              style={{
                display: 'flex',
                gap: '1.25rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
                fontSize: '0.75rem',
                color: '#9C84D6',
                marginBottom: '1.5rem',
              }}
            >
              <span>🖱️ MOVE: Cursor / Touch tracks ship smoothly</span>
              <span>⚡ CLICK / TAP: Pulse Lasers</span>
              <span>🚀 DOUBLE-CLICK / SPACE: Warp Boost</span>
            </div>
            <button
              onClick={startMission}
              style={{
                padding: '0.85rem 2.2rem',
                backgroundColor: '#9C84D6',
                color: '#060919',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 24px rgba(156, 132, 214, 0.65)',
                transition: 'transform 0.2s',
              }}
            >
              ENGAGE FLIGHT CONTROLS
            </button>
          </div>
        )}

        {/* Victory Touchdown Modal Overlay */}
        {stage === 'victory' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(6, 9, 25, 0.92)',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>🌟</div>
            <div
              style={{
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#4ade80',
                marginBottom: '0.3rem',
                fontFamily: 'var(--font-display)',
              }}
            >
              TOUCHDOWN NOMINAL — SECTOR SECURED!
            </div>
            <p style={{ color: '#CFCBF2', fontSize: '0.875rem', marginBottom: '1rem' }}>
              You successfully docked at {currentMission.targetName} with all flight parameters nominal!
            </p>
            <div
              style={{
                backgroundColor: 'rgba(20, 32, 79, 0.75)',
                padding: '0.85rem 1.8rem',
                borderRadius: '8px',
                border: '1px solid #4ade80',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#9C84D6' }}>EXPEDITION LOG SCORE & BADGE AWARDED</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>{score} PTS</div>
              <div style={{ fontSize: '0.85rem', color: '#FFB86B', fontWeight: 700, marginTop: '0.2rem' }}>
                EXPEDITION BADGE: {earnedBadge}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => initMission(missionIndex)}
                style={{
                  padding: '0.65rem 1.4rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #9C84D6',
                  color: '#F7F5FF',
                  borderRadius: '6px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Replay Act
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
                    backgroundColor: '#9C84D6',
                    border: 'none',
                    color: '#060919',
                    borderRadius: '6px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 0 16px rgba(156, 132, 214, 0.5)',
                  }}
                >
                  Proceed to Next Act &rarr;
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cockpit Interactive Action Deck (Mobile Buttons & Controls) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          padding: '1rem 1.25rem',
          backgroundColor: 'rgba(12, 18, 55, 0.95)',
          borderTop: '1px solid rgba(156, 132, 214, 0.25)',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        {/* Left: Mission Directive */}
        <div>
          <div style={{ fontSize: '0.625rem', color: '#9C84D6', letterSpacing: '0.08em' }}>MISSION DIRECTIVE</div>
          <div style={{ fontSize: '0.8125rem', color: '#F7F5FF', fontWeight: 600, marginTop: '0.2rem' }}>
            {currentMission.objective}
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#4A5A7C', marginTop: '0.35rem' }}>
            Control: Glide with cursor/finger • Click/Space to shoot • Double-Click/W to Warp
          </div>
        </div>

        {/* Center: Touch/Click Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
          <button
            onClick={fireLaser}
            style={{
              padding: '0.65rem 1.2rem',
              backgroundColor: '#9C84D6',
              color: '#060919',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 0 14px rgba(156, 132, 214, 0.45)',
            }}
          >
            🎯 FIRE PULSE LASER
          </button>
          <button
            onClick={triggerWarpBoost}
            style={{
              padding: '0.65rem 1.2rem',
              backgroundColor: warpReady === 100 ? 'rgba(20, 32, 79, 0.9)' : 'rgba(20, 32, 79, 0.4)',
              color: warpReady === 100 ? '#38bdf8' : '#4A5A7C',
              border: `1px solid ${warpReady === 100 ? '#38bdf8' : '#4A5A7C'}`,
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: warpReady === 100 ? 'pointer' : 'not-allowed',
            }}
          >
            ⚡ WARP SURGE [{warpReady}%]
          </button>
        </div>

        {/* Right: Quick Reset */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            onClick={() => initMission(missionIndex)}
            style={{
              padding: '0.45rem 0.85rem',
              backgroundColor: 'rgba(20, 32, 79, 0.7)',
              border: '1px solid rgba(156, 132, 214, 0.4)',
              borderRadius: '4px',
              color: '#CFCBF2',
              fontSize: '0.6875rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🔄 RESTART SECTOR
          </button>
        </div>
      </div>
    </div>
  );
}
