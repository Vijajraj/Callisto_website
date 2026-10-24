/**
 * Callisto Cinematic Audio Manager
 *
 * Implements two strictly independent audio channels:
 * - Channel A: Cinematic Background Music (multi-rank cathedral pipe organ, soft celestial piano,
 *   subtle chronometer ticking, rising string ensemble, and distant cosmic textures).
 * - Channel B: Interface Sound Effects (subtle, unique page sounds, telemetry tones, and interaction SFX).
 *
 * Both controls operate independently and persist preferences in browser storage.
 * Initial default: Both OFF (silent until user explicitly engages).
 */

export interface AudioPreferences {
  musicEnabled: boolean;
  musicVolume: number; // 0.0 to 1.0
  sfxEnabled: boolean;
}

const STORAGE_KEYS = {
  MUSIC_ENABLED: 'callisto_audio_music_enabled',
  MUSIC_VOLUME: 'callisto_audio_music_volume',
  SFX_ENABLED: 'callisto_audio_sfx_enabled',
};

// Safe storage access
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
let sfxGain: GainNode | null = null;
let reverbNode: ConvolverNode | null = null;

// Audio States (Strictly independent)
let musicEnabled: boolean = false;
let musicVolume: number = 0.8;
let sfxEnabled: boolean = false;

// Conductor / Score State
let isPlayingScore: boolean = false;
let scoreLoopTimeout: number | null = null;
let chronometerInterval: number | null = null;
let currentPhaseIndex: number = 0;
let chronometerStep: number = 0;

// SFX Throttle to prevent overlapping cacophony on rapid clicks
let lastSfxTimestamp: number = 0;
const SFX_THROTTLE_MS = 90;

// Initial page load flag — prevents ANY audio from playing on initial load
let isInitialPageLoaded: boolean = false;

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

      // Music Channel: musicFaderGain (for fade-in/out) -> musicMasterGain (for volume slider) -> reverb & master
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

      // SFX Channel: completely separate bus
      sfxGain = audioCtx.createGain();
      sfxGain.gain.setValueAtTime(0.75, audioCtx.currentTime);
      sfxGain.connect(masterGain);

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
  // Expression swell: breathing open filter
  filter.frequency.exponentialRampToValueAtTime(1450, now + duration * 0.45);
  filter.frequency.exponentialRampToValueAtTime(380, now + duration);

  organGain.gain.setValueAtTime(0.001, now);
  organGain.gain.linearRampToValueAtTime(0.28, now + 2.5);
  organGain.gain.setValueAtTime(0.28, now + duration - 2.0);
  organGain.gain.linearRampToValueAtTime(0.001, now + duration);

  // 1. 32' Sub-bass contra pedal (chest resonance)
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

  // 3. Multi-rank manuals (Flue + Diapason + Octave detuned ranks)
  phase.organNotes.forEach((freq, idx) => {
    const oscFlue = ctx.createOscillator();
    oscFlue.type = 'sine';
    oscFlue.frequency.setValueAtTime(freq, now);

    const oscPrincipal = ctx.createOscillator();
    oscPrincipal.type = 'triangle';
    oscPrincipal.frequency.setValueAtTime(freq * 1.002, now); // Natural pipe acoustic chorus

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
  stringGain.gain.linearRampToValueAtTime(0.18, now + 3.5); // Slow orchestral string bow attack
  stringGain.gain.setValueAtTime(0.18, now + duration - 2.5);
  stringGain.gain.linearRampToValueAtTime(0.001, now + duration);

  phase.stringNotes.forEach((freq) => {
    // 3 detuned unison voices for rich analog string section warmth
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

  // Soft piano envelope: crisp hammer strike with long, warm natural resonance
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
 * Subtle Chronometer Clock Tick (irreversible slip of deep time)
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
 * Atmospheric Cosmic Texture (distant stellar breath)
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

  const phaseDuration = 18.0; // 18s per phase * 4 phases = 72s seamless loop
  const phase = SCORE_MOVEMENTS[currentPhaseIndex];
  const now = ctx.currentTime;

  // 1. Organ Manual & Pedals
  playOrganLayer(ctx, phase, phaseDuration + 2.0); // 2.0s crossfade overlap

  // 2. Rising Strings Ensemble
  playStringEnsemble(ctx, phase, phaseDuration + 1.8);

  // 3. Cosmic Texture
  playCosmicTexture(ctx, now, phaseDuration);

  // 4. Schedule Piano Motif notes across the 18 seconds
  const pianoSpacing = phaseDuration / (phase.pianoMotif.length + 1);
  phase.pianoMotif.forEach((note, idx) => {
    const noteTime = now + 1.2 + idx * pianoSpacing;
    playPianoNote(ctx, note, noteTime);
  });

  // Schedule next movement
  scoreLoopTimeout = window.setTimeout(() => {
    if (!isPlayingScore) return;
    currentPhaseIndex = (currentPhaseIndex + 1) % SCORE_MOVEMENTS.length;
    runSymphonyConductor();
    dispatchAudioStateEvent();
  }, phaseDuration * 1000);
}

/**
 * Start chronometer pulses (subtle quarter-note clock ticking)
 */
function startChronometer(ctx: AudioContext) {
  if (chronometerInterval) return;
  const tickIntervalMs = 750; // 80 BPM quarter-note timekeeping

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
        sfxEnabled,
        movementName: isPlayingScore ? SCORE_MOVEMENTS[currentPhaseIndex]?.name : 'SILENT',
        movementTheme: isPlayingScore ? SCORE_MOVEMENTS[currentPhaseIndex]?.theme : 'STANDBY',
      },
    })
  );
}

/* =========================================================================
   PUBLIC API — CONTROL A: BACKGROUND MUSIC
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
        musicFaderGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 1.8); // Short fade-in
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
        musicFaderGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.2); // Short fade-out
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
   PUBLIC API — CONTROL B: SOUND EFFECTS (SFX)
   ========================================================================= */

export function setSfxEnabled(enable: boolean): boolean {
  sfxEnabled = enable;
  setStorageItem(STORAGE_KEYS.SFX_ENABLED, enable ? 'true' : 'false');
  dispatchAudioStateEvent();
  return sfxEnabled;
}

export function toggleSfx(): boolean {
  return setSfxEnabled(!sfxEnabled);
}

export function isSfxEnabled(): boolean {
  return sfxEnabled;
}

/**
 * Throttle check helper: prevents overlapping cacophony on rapid clicks
 */
function shouldThrottleSfx(): boolean {
  if (!sfxEnabled) return true;
  const now = Date.now();
  if (now - lastSfxTimestamp < SFX_THROTTLE_MS) {
    return true;
  }
  lastSfxTimestamp = now;
  return false;
}

/* =========================================================================
   PAGE-SPECIFIC UNIQUE SOUND EFFECTS
   ========================================================================= */

/**
 * 1. Home: Soft celestial chime (pentatonic harmonic resonance)
 */
export function playCelestialChime(): void {
  try {
    if (shouldThrottleSfx()) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = startTime + idx * 0.045;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.045 / (idx + 1), noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.42);

      osc.connect(gain);
      gain.connect(sfxGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.45);
    });
  } catch {}
}

/**
 * 2. Missions: Short spacecraft-console sound (dual-tone telemetry chirp)
 */
export function playConsoleChirp(): void {
  try {
    if (shouldThrottleSfx()) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1320, now + 0.05);

    gain.gain.setValueAtTime(0.055, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(sfxGain);

    osc.start(now);
    osc.stop(now + 0.13);
  } catch {}
}

/**
 * 3. Observatory: Delicate glass-like ping (crystalline resonance)
 */
export function playGlassPing(): void {
  try {
    if (shouldThrottleSfx()) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760, now); // A6 high glass harmonic

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1760, now);
    filter.Q.value = 8.5;

    gain.gain.setValueAtTime(0.065, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(sfxGain);

    osc.start(now);
    osc.stop(now + 0.4);
  } catch {}
}

/**
 * 4. Expedition: Subtle electronic confirmation tone (clean two-step handshake)
 */
export function playConfirmationTone(): void {
  try {
    if (shouldThrottleSfx()) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(660, now + 0.07);

    gain.gain.setValueAtTime(0.055, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(sfxGain);

    osc.start(now);
    osc.stop(now + 0.19);
  } catch {}
}

/**
 * 5. Events: Short radio-inspired signal (pulsed microwave radio frequency chirp)
 */
export function playRadioSignal(): void {
  try {
    if (shouldThrottleSfx()) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(740, now);
    osc.frequency.exponentialRampToValueAtTime(1120, now + 0.08);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950, now);
    filter.Q.value = 5.0;

    gain.gain.setValueAtTime(0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.20);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(sfxGain);

    osc.start(now);
    osc.stop(now + 0.21);
  } catch {}
}

/**
 * 6. About / Crew / Join / Avatar: Warm low synthetic tactile click
 */
export function playSyntheticClick(): void {
  try {
    if (shouldThrottleSfx()) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.05);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    osc.connect(gain);
    gain.connect(sfxGain);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch {}
}

/**
 * Route-specific Sound Dispatcher
 * Plays the corresponding sound for the target path upon user navigation.
 */
export function playSoundForRoute(path: string): void {
  if (!sfxEnabled) return;

  const normalized = path.replace(/\/$/, '') || '/';

  if (normalized === '/') {
    playCelestialChime();
  } else if (normalized.startsWith('/missions')) {
    playConsoleChirp();
  } else if (normalized.startsWith('/observatory')) {
    playGlassPing();
  } else if (normalized.startsWith('/expedition')) {
    playConfirmationTone();
  } else if (normalized.startsWith('/events')) {
    playRadioSignal();
  } else {
    playSyntheticClick();
  }
}

/* =========================================================================
   INTERACTION SOUND EFFECTS (Backward-compatible with existing components)
   ========================================================================= */

export function playTelemetryBeep(freq: number = 880, duration: number = 0.08): void {
  try {
    if (!sfxEnabled) return;
    if (shouldThrottleSfx()) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + duration);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(sfxGain);

    osc.start(now);
    osc.stop(now + duration);
  } catch {}
}

export function playBeaconPing(freq: number = 1046.5, duration: number = 0.35): void {
  try {
    if (!sfxEnabled) return;
    if (shouldThrottleSfx()) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.setValueAtTime(freq * 1.25, now + 0.08);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(sfxGain);

    osc.start(now);
    osc.stop(now + duration);
  } catch {}
}

export function playThrusterBurst(): void {
  try {
    if (!sfxEnabled) return;
    if (shouldThrottleSfx()) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGain) return;

    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.18);
    filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(sfxGain);

    noise.start();
  } catch {}
}

export function playWarpSurge(): void {
  try {
    if (!sfxEnabled) return;
    if (shouldThrottleSfx()) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.85);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(1600, now + 0.35);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.85);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(sfxGain);

    osc.start(now);
    osc.stop(now + 0.85);
  } catch {}
}

export function playLaserFire(): void {
  try {
    if (!sfxEnabled) return;
    if (shouldThrottleSfx()) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch {}
}

export function playAsteroidBlast(): void {
  try {
    if (!sfxEnabled) return;
    if (shouldThrottleSfx()) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGain) return;

    const bufferSize = ctx.sampleRate * 0.35;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(220, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.35);
    filter.Q.setValueAtTime(2.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(sfxGain);

    noise.start();
  } catch {}
}

/* =========================================================================
   INITIALIZATION & NAVIGATION LISTENERS
   ========================================================================= */

export function initAudioManager(): void {
  if (typeof window === 'undefined') return;

  // Restore saved preferences
  const savedMusic = getStorageItem(STORAGE_KEYS.MUSIC_ENABLED, 'false') === 'true';
  const savedVolumeStr = getStorageItem(STORAGE_KEYS.MUSIC_VOLUME, '0.8');
  const savedSfx = getStorageItem(STORAGE_KEYS.SFX_ENABLED, 'false') === 'true';

  const parsedVol = parseFloat(savedVolumeStr);
  musicVolume = isNaN(parsedVol) ? 0.8 : Math.max(0, Math.min(1, parsedVol));

  // Default: BOTH ARE FALSE unless user has previously explicitly saved true
  sfxEnabled = savedSfx;

  if (savedMusic) {
    // If user previously turned music ON, attach gesture listener to resume audio context
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

  // Intercept navigation link clicks to trigger unique page sounds
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement)?.closest('a');
    if (!target) return;

    const href = target.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;

    // Trigger page-specific navigation sound if SFX is enabled
    if (sfxEnabled && isInitialPageLoaded) {
      playSoundForRoute(href);
    }
  });

  // Flag initial load complete so sounds NEVER play automatically on initial load
  setTimeout(() => {
    isInitialPageLoaded = true;
  }, 300);

  dispatchAudioStateEvent();
}

// Auto-bind on client load
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initAudioManager();
  } else {
    window.addEventListener('DOMContentLoaded', initAudioManager, { once: true });
  }
}
