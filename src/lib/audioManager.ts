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

/**
 * Callisto Cinematic Audio Manager
 *
 * Dedicated to the immersive Cinematic Background Music:
 * - Multi-rank Cathedral Pipe Organ (32' sub contra pedal, 16' bourdon, 8' diapason, 4' flue)
 * - Soft Celestial Piano Melodies & Repeating Motifs
 * - Subtle Chronometer Ticking (passage of time across light-years)
 * - Slowly Rising Strings Ensemble & Rich Orchestral Swells
 * - Distant Cosmic Textures & Synthetic Cathedral Convolution Reverb
 * - 72-Second Seamless Deep-Space Symphony Cycle
 *
 * Volume slider, smooth fade in/out, and persistent state across navigation.
 * Channel B (Sound Effects) removed per user requirement.
 */

const STORAGE_KEYS = {
  MUSIC_ENABLED: 'callisto_audio_music_enabled',
  MUSIC_VOLUME: 'callisto_audio_music_volume',
};

function getStorageItem(key: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = localStorage.getItem(key);
    return val !== null ? val : fallback;
  } catch {
    return fallback;
  }
}

function setStorageItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {}
}

// Master Audio Nodes
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let musicMasterGain: GainNode | null = null;
let musicFaderGain: GainNode | null = null;
let reverbNode: ConvolverNode | null = null;

// Audio States
let musicEnabled: boolean = false;
let musicVolume: number = 0.8;

// Conductor / Score State
let isPlayingScore: boolean = false;
let scoreLoopTimeout: number | null = null;
let chronometerInterval: number | null = null;
let currentPhaseIndex: number = 0;
let chronometerStep: number = 0;

/**
 * Lazy initialization of the Web Audio Context and Node Graph
 */
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx) {
    if (!masterGain) {
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.85, audioCtx.currentTime);

      // Synthetic cathedral impulse response for spatial depth
      reverbNode = createCathedralReverb(audioCtx);

      // Music Channel: musicFaderGain (fade in/out) -> musicMasterGain (volume slider) -> reverb & master
      musicMasterGain = audioCtx.createGain();
      musicMasterGain.gain.setValueAtTime(musicVolume, audioCtx.currentTime);

      musicFaderGain = audioCtx.createGain();
      musicFaderGain.gain.setValueAtTime(0.001, audioCtx.currentTime);

      musicFaderGain.connect(musicMasterGain);

      // Reverb wet/dry mix
      const reverbSend = audioCtx.createGain();
      reverbSend.gain.setValueAtTime(0.42, audioCtx.currentTime);
      musicMasterGain.connect(reverbSend);
      reverbSend.connect(reverbNode);

      musicMasterGain.connect(masterGain);
      reverbNode.connect(masterGain);

      masterGain.connect(audioCtx.destination);
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  }

  return audioCtx;
}

/**
 * Procedural cathedral convolution reverb buffer (4.2-second natural spatial decay)
 */
function createCathedralReverb(ctx: AudioContext): ConvolverNode {
  const convolver = ctx.createConvolver();
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * 4.2);
  const impulse = ctx.createBuffer(2, length, rate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  for (let i = 0; i < length; i++) {
    const t = i / rate;
    const decay = Math.exp(-t * 1.45);
    left[i] = (Math.random() * 2 - 1) * decay;
    right[i] = (Math.random() * 2 - 1) * decay * (1.0 - 0.06 * Math.sin(t * 14));
  }

  convolver.buffer = impulse;
  return convolver;
}

/* =========================================================================
   CINEMATIC SCORE COMPOSITION (72-Second Seamless Deep-Space Cycle)
   - Phase 1: Solitude & Earthview (A Minor 9) — 18s
   - Phase 2: Journey into Vast Unknown (F Major 7) — 18s
   - Phase 3: Cosmic Revelation & Discovery Crescendo (D Minor 9 -> G11 / C) — 18s
   - Phase 4: Peaceful Drift & Gentle Resolution (E Minor 9 / sus4) — 18s
   ========================================================================= */

interface MovementPhase {
  name: string;
  theme: string;
  subPedalBass: number;
  pedalBass: number;
  organNotes: number[];
  pianoMotif: number[];
  stringNotes: number[];
}

const SCORE_MOVEMENTS: MovementPhase[] = [
  {
    name: 'A Minor 9',
    theme: 'Solitude & Earthview',
    subPedalBass: 27.50, // A0 (chest rumble)
    pedalBass: 55.00,    // A1
    organNotes: [220.00, 261.63, 329.63, 440.00, 523.25], // A3, C4, E4, A4, C5
    pianoMotif: [440.00, 523.25, 493.88, 659.25, 523.25, 440.00], // A4, C5, B4, E5, C5, A4
    stringNotes: [110.00, 220.00, 329.63, 659.25],
  },
  {
    name: 'F Major 7',
    theme: 'Vast Ocean of Stars',
    subPedalBass: 43.65, // F1
    pedalBass: 87.31,    // F2
    organNotes: [174.61, 220.00, 261.63, 329.63, 440.00, 523.25], // F3, A3, C4, E4, A4, C5
    pianoMotif: [349.23, 440.00, 523.25, 659.25, 783.99, 659.25], // F4, A4, C5, E5, G5, E5
    stringNotes: [87.31, 174.61, 261.63, 523.25],
  },
  {
    name: 'D Minor 9 / C',
    theme: 'Cosmic Revelation & Discovery',
    subPedalBass: 36.71, // D1
    pedalBass: 73.42,    // D2
    organNotes: [196.00, 261.63, 293.66, 349.23, 440.00, 587.33, 659.25], // G3, C4, D4, F4, A4, D5, E5
    pianoMotif: [293.66, 349.23, 440.00, 587.33, 523.25, 440.00], // D4, F4, A4, D5, C5, A4
    stringNotes: [73.42, 146.83, 293.66, 587.33],
  },
  {
    name: 'E Minor 9',
    theme: 'Gentle Horizon Return',
    subPedalBass: 41.20, // E1
    pedalBass: 82.41,    // E2
    organNotes: [164.81, 246.94, 293.66, 329.63, 392.00, 493.88], // E3, B3, D4, E4, G4, B4
    pianoMotif: [659.25, 587.33, 493.88, 392.00, 329.63, 440.00], // E5, D5, B4, G4, E4, A4
    stringNotes: [82.41, 164.81, 246.94, 493.88],
  },
];

/**
 * Synthesize Cathedral Organ Manual & Pedals
 */
function playOrganLayer(ctx: AudioContext, phase: MovementPhase, duration: number) {
  if (!musicFaderGain) return;
  const now = ctx.currentTime;

  const organGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(320, now);
  filter.frequency.exponentialRampToValueAtTime(1450, now + duration * 0.45);
  filter.frequency.exponentialRampToValueAtTime(380, now + duration);

  organGain.gain.setValueAtTime(0.001, now);
  organGain.gain.linearRampToValueAtTime(0.28, now + 2.5);
  organGain.gain.setValueAtTime(0.28, now + duration - 2.0);
  organGain.gain.linearRampToValueAtTime(0.001, now + duration);

  // 1. 32' Sub-bass contra pedal
  const subSine = ctx.createOscillator();
  subSine.type = 'sine';
  subSine.frequency.setValueAtTime(phase.subPedalBass, now);
  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(0.35, now);
  subSine.connect(subGain);
  subGain.connect(filter);
  subSine.start(now);
  subSine.stop(now + duration);

  // 2. 16' Bourdon pedal
  const pedalTri = ctx.createOscillator();
  pedalTri.type = 'triangle';
  pedalTri.frequency.setValueAtTime(phase.pedalBass, now);
  const pedalGain = ctx.createGain();
  pedalGain.gain.setValueAtTime(0.30, now);
  pedalTri.connect(pedalGain);
  pedalGain.connect(filter);
  pedalTri.start(now);
  pedalTri.stop(now + duration);

  // 3. Multi-rank manuals
  phase.organNotes.forEach((freq, idx) => {
    const oscFlue = ctx.createOscillator();
    oscFlue.type = 'sine';
    oscFlue.frequency.setValueAtTime(freq, now);

    const oscPrincipal = ctx.createOscillator();
    oscPrincipal.type = 'triangle';
    oscPrincipal.frequency.setValueAtTime(freq * 1.002, now);

    const pipeGain = ctx.createGain();
    const amp = 0.10 / Math.sqrt(idx + 1);
    pipeGain.gain.setValueAtTime(amp, now);

    oscFlue.connect(pipeGain);
    oscPrincipal.connect(pipeGain);
    pipeGain.connect(filter);

    oscFlue.start(now);
    oscPrincipal.start(now);
    oscFlue.stop(now + duration);
    oscPrincipal.stop(now + duration);
  });

  filter.connect(organGain);
  organGain.connect(musicFaderGain);
}

/**
 * Synthesize Slowly Rising Strings Ensemble Layer
 */
function playStringEnsemble(ctx: AudioContext, phase: MovementPhase, duration: number) {
  if (!musicFaderGain) return;
  const now = ctx.currentTime;

  const stringGain = ctx.createGain();
  const stringFilter = ctx.createBiquadFilter();

  stringFilter.type = 'lowpass';
  stringFilter.frequency.setValueAtTime(260, now);
  stringFilter.frequency.exponentialRampToValueAtTime(1100, now + duration * 0.55);
  stringFilter.frequency.exponentialRampToValueAtTime(320, now + duration);

  stringGain.gain.setValueAtTime(0.001, now);
  stringGain.gain.linearRampToValueAtTime(0.18, now + 3.5);
  stringGain.gain.setValueAtTime(0.18, now + duration - 2.5);
  stringGain.gain.linearRampToValueAtTime(0.001, now + duration);

  phase.stringNotes.forEach((freq) => {
    [-1.0025, 1.0, 1.0025].forEach((detuneMult) => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * detuneMult, now);

      const voiceGain = ctx.createGain();
      voiceGain.gain.setValueAtTime(0.04, now);

      osc.connect(voiceGain);
      voiceGain.connect(stringFilter);
      osc.start(now);
      osc.stop(now + duration);
    });
  });

  stringFilter.connect(stringGain);
  stringGain.connect(musicFaderGain);
}

/**
 * Synthesize Soft Celestial Piano Motif
 */
function playPianoNote(ctx: AudioContext, freq: number, time: number) {
  if (!musicFaderGain) return;

  const oscFundamental = ctx.createOscillator();
  const oscHarmonic = ctx.createOscillator();
  const noteGain = ctx.createGain();
  const bodyFilter = ctx.createBiquadFilter();

  oscFundamental.type = 'triangle';
  oscFundamental.frequency.setValueAtTime(freq, time);

  oscHarmonic.type = 'sine';
  oscHarmonic.frequency.setValueAtTime(freq * 2.001, time);

  bodyFilter.type = 'lowpass';
  bodyFilter.frequency.setValueAtTime(freq * 3.5, time);
  bodyFilter.frequency.exponentialRampToValueAtTime(freq * 1.2, time + 2.8);

  noteGain.gain.setValueAtTime(0.001, time);
  noteGain.gain.linearRampToValueAtTime(0.095, time + 0.015);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, time + 3.2);

  oscFundamental.connect(noteGain);
  oscHarmonic.connect(noteGain);
  noteGain.connect(bodyFilter);
  bodyFilter.connect(musicFaderGain);

  oscFundamental.start(time);
  oscHarmonic.start(time);
  oscFundamental.stop(time + 3.4);
  oscHarmonic.stop(time + 3.4);
}

/**
 * Subtle Chronometer Clock Tick
 */
function playChronometerTick(ctx: AudioContext, time: number) {
  if (!musicFaderGain) return;

  const osc = ctx.createOscillator();
  const tickGain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1450, time);
  osc.frequency.exponentialRampToValueAtTime(220, time + 0.04);

  tickGain.gain.setValueAtTime(0.018, time);
  tickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

  osc.connect(tickGain);
  tickGain.connect(musicFaderGain);

  osc.start(time);
  osc.stop(time + 0.045);
}

/**
 * Atmospheric Cosmic Texture
 */
function playCosmicTexture(ctx: AudioContext, time: number, duration: number) {
  if (!musicFaderGain) return;

  const bufferSize = Math.floor(ctx.sampleRate * 2.5);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;
  noiseSource.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(450, time);
  filter.frequency.exponentialRampToValueAtTime(850, time + duration * 0.5);
  filter.frequency.exponentialRampToValueAtTime(380, time + duration);
  filter.Q.value = 4.2;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(0.018, time + 3.0);
  gain.gain.setValueAtTime(0.018, time + duration - 3.0);
  gain.gain.linearRampToValueAtTime(0.001, time + duration);

  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(musicFaderGain);

  noiseSource.start(time);
  noiseSource.stop(time + duration);
}

/**
 * Conductor loop cycling through the 72-second 4-movement symphony
 */
function runSymphonyConductor() {
  if (!isPlayingScore) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const phaseDuration = 18.0;
  const phase = SCORE_MOVEMENTS[currentPhaseIndex];
  const now = ctx.currentTime;

  playOrganLayer(ctx, phase, phaseDuration + 2.0);
  playStringEnsemble(ctx, phase, phaseDuration + 1.8);
  playCosmicTexture(ctx, now, phaseDuration);

  const pianoSpacing = phaseDuration / (phase.pianoMotif.length + 1);
  phase.pianoMotif.forEach((note, idx) => {
    const noteTime = now + 1.2 + idx * pianoSpacing;
    playPianoNote(ctx, note, noteTime);
  });

  scoreLoopTimeout = window.setTimeout(() => {
    if (!isPlayingScore) return;
    currentPhaseIndex = (currentPhaseIndex + 1) % SCORE_MOVEMENTS.length;
    runSymphonyConductor();
    dispatchAudioStateEvent();
  }, phaseDuration * 1000);
}

function startChronometer(ctx: AudioContext) {
  if (chronometerInterval) return;
  const tickIntervalMs = 750;

  chronometerInterval = window.setInterval(() => {
    if (!isPlayingScore || !musicFaderGain) return;
    playChronometerTick(ctx, ctx.currentTime);
    chronometerStep++;
  }, tickIntervalMs);
}

function stopChronometer() {
  if (chronometerInterval) {
    clearInterval(chronometerInterval);
    chronometerInterval = null;
  }
}

function dispatchAudioStateEvent() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('callisto-audio-manager-state', {
      detail: {
        musicEnabled,
        musicVolume,
        movementName: isPlayingScore ? SCORE_MOVEMENTS[currentPhaseIndex]?.name : 'SILENT',
        movementTheme: isPlayingScore ? SCORE_MOVEMENTS[currentPhaseIndex]?.theme : 'STANDBY',
      },
    })
  );
}

/* =========================================================================
   PUBLIC API: BACKGROUND MUSIC
   ========================================================================= */

export function setMusicEnabled(enable: boolean): boolean {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    musicEnabled = enable;
    setStorageItem(STORAGE_KEYS.MUSIC_ENABLED, enable ? 'true' : 'false');

    if (enable) {
      isPlayingScore = true;
      if (musicFaderGain) {
        musicFaderGain.gain.setValueAtTime(0.001, ctx.currentTime);
        musicFaderGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 1.8);
      }
      currentPhaseIndex = 0;
      chronometerStep = 0;
      runSymphonyConductor();
      startChronometer(ctx);
    } else {
      isPlayingScore = false;
      if (scoreLoopTimeout) {
        clearTimeout(scoreLoopTimeout);
        scoreLoopTimeout = null;
      }
      stopChronometer();
      if (musicFaderGain) {
        musicFaderGain.gain.setValueAtTime(musicFaderGain.gain.value, ctx.currentTime);
        musicFaderGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      }
    }

    dispatchAudioStateEvent();
    return musicEnabled;
  } catch {
    return false;
  }
}

export function toggleMusic(): boolean {
  return setMusicEnabled(!musicEnabled);
}

export function isMusicEnabled(): boolean {
  return musicEnabled;
}

export function setMusicVolume(vol: number): void {
  const clamped = Math.max(0, Math.min(1, vol));
  musicVolume = clamped;
  setStorageItem(STORAGE_KEYS.MUSIC_VOLUME, clamped.toFixed(2));

  if (audioCtx && musicMasterGain) {
    musicMasterGain.gain.setValueAtTime(clamped, audioCtx.currentTime);
  }
  dispatchAudioStateEvent();
}

export function getMusicVolume(): number {
  return musicVolume;
}

export function getCurrentMovementInfo(): { name: string; theme: string } {
  if (!isPlayingScore) {
    return { name: 'MUTED', theme: 'STANDBY' };
  }
  const cur = SCORE_MOVEMENTS[currentPhaseIndex];
  return {
    name: cur ? cur.name : 'EXPEDITION',
    theme: cur ? cur.theme : 'DEEP SPACE',
  };
}

/* =========================================================================
   SAFE NO-OP STUBS (Clean backward compatibility for simulators)
   ========================================================================= */

export function playTelemetryBeep(_freq?: number, _duration?: number): void {}
export function playBeaconPing(_freq?: number, _duration?: number): void {}
export function playThrusterBurst(): void {}
export function playWarpSurge(): void {}
export function playLaserFire(): void {}
export function playAsteroidBlast(): void {}

/* =========================================================================
   INITIALIZATION
   ========================================================================= */

export function initAudioManager(): void {
  if (typeof window === 'undefined') return;

  const savedMusic = getStorageItem(STORAGE_KEYS.MUSIC_ENABLED, 'false') === 'true';
  const savedVolumeStr = getStorageItem(STORAGE_KEYS.MUSIC_VOLUME, '0.8');

  const parsedVol = parseFloat(savedVolumeStr);
  musicVolume = isNaN(parsedVol) ? 0.8 : Math.max(0, Math.min(1, parsedVol));

  if (savedMusic) {
    const resumeOnGesture = () => {
      setMusicEnabled(true);
      ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click'].forEach((evt) => {
        window.removeEventListener(evt, resumeOnGesture);
      });
    };
    ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click'].forEach((evt) => {
      window.addEventListener(evt, resumeOnGesture, { once: true, passive: true });
    });
  }

  dispatchAudioStateEvent();
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initAudioManager();
  } else {
    window.addEventListener('DOMContentLoaded', initAudioManager, { once: true });
  }
}
