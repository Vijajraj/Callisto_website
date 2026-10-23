/**
 * Callisto Web Audio API — Procedural Deep-Space Cathedral Organ & Ostinato Symphony
 *
 * Fully procedural synthesis using zero external audio files.
 * Architected to deliver a vast, awe-inspiring deep-space score:
 * - Multi-rank Cathedral Pipe Organ (32' sub-bass contra pedal, 16' bourdon, 8' diapason, 4' octave flue, 2' shimmer)
 * - The majestic 4-chord progression (Am -> Fmaj7 -> C -> Em9)
 * - Clockwork 16th-note ostinato arpeggiator with dynamic breathing swell filters
 * - Spatial acoustic cathedral convolution / reverberation (4.2s natural tail)
 * - Relativistic chronometer pulses simulating the relentless slip of deep time
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let reverbNode: ConvolverNode | null = null;
let musicGain: GainNode | null = null;
let sfxGain: GainNode | null = null;

let isPlayingScore: boolean = false;
let scoreLoopTimeout: number | null = null;
let currentChordIndex: number = 0;
let ostinatoStep: number = 0;
let ostinatoInterval: number | null = null;

interface OrganVoice {
  oscillators: OscillatorNode[];
  gain: GainNode;
  filter: BiquadFilterNode;
}
let currentOrganVoice: OrganVoice | null = null;

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
      masterGain.gain.setValueAtTime(0.82, audioCtx.currentTime);

      // Create synthetic cathedral impulse response for vast acoustic space reverb
      reverbNode = createCathedralReverb(audioCtx);

      musicGain = audioCtx.createGain();
      musicGain.gain.setValueAtTime(0.88, audioCtx.currentTime);

      sfxGain = audioCtx.createGain();
      sfxGain.gain.setValueAtTime(0.72, audioCtx.currentTime);

      // Connect music through reverb + direct dry path to master
      musicGain.connect(reverbNode);
      musicGain.connect(masterGain);
      reverbNode.connect(masterGain);

      sfxGain.connect(masterGain);
      masterGain.connect(audioCtx.destination);
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  return audioCtx;
}

/**
 * Procedural impulse response generator simulating a vast stone cathedral
 * with rich spatial reflections and a 4.2-second natural decay tail.
 */
function createCathedralReverb(ctx: AudioContext): ConvolverNode {
  const convolver = ctx.createConvolver();
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * 4.2); // 4.2 seconds deep space decay
  const impulse = ctx.createBuffer(2, length, rate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  for (let i = 0; i < length; i++) {
    const t = i / rate;
    // Exponential decay with slight early acoustic diffusion
    const decay = Math.exp(-t * 1.55);
    // Left and right channels with subtle phase offset for stereophonic breadth
    left[i] = (Math.random() * 2 - 1) * decay;
    right[i] = (Math.random() * 2 - 1) * decay * (1.0 - 0.08 * Math.sin(t * 12));
  }

  convolver.buffer = impulse;
  return convolver;
}

// Deep Space 4-Chord Progression (Chords with precise acoustic frequencies in Hz)
interface ChordDef {
  name: string;
  subPedalBass: number;   // 32' Ultra-deep sub-bass contra pedal (chest rumble)
  pedalBass: number;      // 16' Organ pedal bass
  bassFundamental: number;// 8' Diapason bass
  chordNotes: number[];   // Main organ pipe manuals across multiple octaves
  ostinatoNotes: number[];// Rapid clockwork arpeggiator notes
}

const EXPEDITION_CHORDS: ChordDef[] = [
  // 1. A Minor — Contemplative quiet awe and infinite distance
  {
    name: 'A Minor',
    subPedalBass: 27.50, // A0 (ultra sub rumble)
    pedalBass: 55.00,    // A1
    bassFundamental: 110.00, // A2
    chordNotes: [220.00, 261.63, 329.63, 440.00, 523.25, 659.25], // A3, C4, E4, A4, C5, E5
    ostinatoNotes: [440.00, 523.25, 659.25, 880.00, 659.25, 523.25, 440.00, 659.25],
  },
  // 2. F Major 7 — Soaring emotional gravity and celestial beauty
  {
    name: 'F Major 7',
    subPedalBass: 43.65, // F1
    pedalBass: 87.31,    // F2
    bassFundamental: 174.61, // F3
    chordNotes: [174.61, 220.00, 261.63, 329.63, 440.00, 523.25], // F3, A3, C4, E4, A4, C5
    ostinatoNotes: [349.23, 440.00, 523.25, 659.25, 523.25, 440.00, 349.23, 523.25],
  },
  // 3. C Major — Infinite cosmic expanse and triumphant clarity
  {
    name: 'C Major',
    subPedalBass: 32.70, // C1
    pedalBass: 65.41,    // C2
    bassFundamental: 130.81, // C3
    chordNotes: [196.00, 261.63, 329.63, 392.00, 523.25, 659.25, 783.99], // G3, C4, E4, G4, C5, E5, G5
    ostinatoNotes: [523.25, 659.25, 783.99, 1046.50, 783.99, 659.25, 523.25, 783.99],
  },
  // 4. E Minor 9 — Solitude across light-years and deep time
  {
    name: 'E Minor 9',
    subPedalBass: 41.20, // E1
    pedalBass: 82.41,    // E2
    bassFundamental: 164.81, // E3
    chordNotes: [164.81, 246.94, 293.66, 329.63, 392.00, 493.88], // E3, B3, D4, E4, G4, B4
    ostinatoNotes: [329.63, 392.00, 493.88, 587.33, 493.88, 392.00, 329.63, 493.88],
  },
];

/**
 * Synthesizes a grand pipe organ chord with multi-rank acoustic harmonics.
 */
function playOrganChord(ctx: AudioContext, chord: ChordDef, duration: number) {
  if (!musicGain) return;

  const now = ctx.currentTime;
  const voiceGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(280, now);
  // Majestic expression swell: filter gently blooms as the organ ranks draw air
  filter.frequency.exponentialRampToValueAtTime(1750, now + duration * 0.48);
  filter.frequency.exponentialRampToValueAtTime(360, now + duration);

  voiceGain.gain.setValueAtTime(0.001, now);
  voiceGain.gain.linearRampToValueAtTime(0.32, now + 2.4); // Slow, majestic cathedral attack
  voiceGain.gain.setValueAtTime(0.32, now + duration - 2.2);
  voiceGain.gain.linearRampToValueAtTime(0.001, now + duration); // Smooth release crossfade

  const oscList: OscillatorNode[] = [];

  // 1. Ultra-deep 32' Contra Pedal (Sub-bass sine wave - physical vibration)
  const subSine = ctx.createOscillator();
  subSine.type = 'sine';
  subSine.frequency.setValueAtTime(chord.subPedalBass, now);

  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(0.38, now);
  subSine.connect(subGain);
  subGain.connect(filter);
  subSine.start(now);
  subSine.stop(now + duration);
  oscList.push(subSine);

  // 2. 16' Bourdon Pedal (Warm triangle wave)
  const pedalTri = ctx.createOscillator();
  pedalTri.type = 'triangle';
  pedalTri.frequency.setValueAtTime(chord.pedalBass, now);

  const pedalGain = ctx.createGain();
  pedalGain.gain.setValueAtTime(0.42, now);
  pedalTri.connect(pedalGain);
  pedalGain.connect(filter);
  pedalTri.start(now);
  pedalTri.stop(now + duration);
  oscList.push(pedalTri);

  // 3. 8' Diapason Fundamental
  const bassOsc = ctx.createOscillator();
  bassOsc.type = 'sawtooth';
  bassOsc.frequency.setValueAtTime(chord.bassFundamental, now);
  const bassFilter = ctx.createBiquadFilter();
  bassFilter.type = 'lowpass';
  bassFilter.frequency.setValueAtTime(450, now);
  const bassGain = ctx.createGain();
  bassGain.gain.setValueAtTime(0.18, now);
  bassOsc.connect(bassFilter);
  bassFilter.connect(bassGain);
  bassGain.connect(filter);
  bassOsc.start(now);
  bassOsc.stop(now + duration);
  oscList.push(bassOsc);

  // 4. Manual Pipe Ranks: Flue + Principal + Octave detuned ranks
  chord.chordNotes.forEach((freq, idx) => {
    // Rank A: Flue pipe (pure sine)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Rank B: Principal pipe (warm triangle with 1.002x natural pipe detune)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.002, now);

    // Rank C: High octave shimmer pipe (2.0015x detuned harmonic)
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 2.0015, now);

    const pipeGain = ctx.createGain();
    const relativeAmp = 0.13 / Math.sqrt(idx + 1);
    pipeGain.gain.setValueAtTime(relativeAmp, now);

    const shimmerGain = ctx.createGain();
    shimmerGain.gain.setValueAtTime(relativeAmp * 0.32, now);

    osc1.connect(pipeGain);
    osc2.connect(pipeGain);
    osc3.connect(shimmerGain);

    pipeGain.connect(filter);
    shimmerGain.connect(filter);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + duration);
    osc2.stop(now + duration);
    osc3.stop(now + duration);

    oscList.push(osc1, osc2, osc3);
  });

  filter.connect(voiceGain);
  voiceGain.connect(musicGain);

  currentOrganVoice = {
    oscillators: oscList,
    gain: voiceGain,
    filter,
  };
}

/**
 * Clockwork Ostinato: delicate glass organ flute pipes weaving hypnotic arpeggios.
 */
function startOstinato(ctx: AudioContext) {
  if (ostinatoInterval) return;

  const stepDuration = 210; // 210ms per 16th-note pulse

  ostinatoInterval = window.setInterval(() => {
    if (!isPlayingScore || !musicGain) return;

    const chord = EXPEDITION_CHORDS[currentChordIndex];
    if (!chord) return;

    const freq = chord.ostinatoNotes[ostinatoStep % chord.ostinatoNotes.length];
    ostinatoStep++;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.45, now);
    filter.Q.value = 3.8;

    // Delicate staccato organ flute envelope
    gain.gain.setValueAtTime(0.048, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(musicGain);

    osc.start(now);
    osc.stop(now + 0.2);

    // Relativistic Chronometer clock tick every 4 steps (quarter-note pulse)
    if (ostinatoStep % 4 === 0) {
      playClockTick(ctx);
    }
  }, stepDuration);
}

/**
 * Ticking chronometer pulse representing the irreversible slip of deep time.
 */
function playClockTick(ctx: AudioContext) {
  if (!sfxGain) return;
  const now = ctx.currentTime;

  // Dual resonant metallic/wood clock pulse
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1450, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.045);

  gain.gain.setValueAtTime(0.022, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

  osc.connect(gain);
  gain.connect(sfxGain);

  osc.start(now);
  osc.stop(now + 0.05);
}

/**
 * Main score conductor loop cycling through the majestic 4-chord progression.
 */
function runScoreConductor() {
  if (!isPlayingScore) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const chordDuration = 11.0; // Each chord breathes for 11 seconds
  const chord = EXPEDITION_CHORDS[currentChordIndex];

  playOrganChord(ctx, chord, chordDuration + 1.8); // 1.8s crossfade overlap

  scoreLoopTimeout = window.setTimeout(() => {
    if (!isPlayingScore) return;
    currentChordIndex = (currentChordIndex + 1) % EXPEDITION_CHORDS.length;
    runScoreConductor();
    notifyStateChange();
  }, chordDuration * 1000);
}

function notifyStateChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('callisto-audio-state', {
        detail: {
          enabled: isPlayingScore,
          chord: getCurrentChordName(),
        },
      })
    );
  }
}

/**
 * Public control: Toggle the Expedition Cathedral Score.
 */
export function toggleAmbientSound(enable?: boolean): boolean {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (enable !== undefined) {
      isPlayingScore = enable;
    } else {
      isPlayingScore = !isPlayingScore;
    }

    if (isPlayingScore) {
      if (musicGain) {
        musicGain.gain.setValueAtTime(0.001, ctx.currentTime);
        musicGain.gain.linearRampToValueAtTime(0.88, ctx.currentTime + 2.2);
      }
      currentChordIndex = 0;
      ostinatoStep = 0;
      runScoreConductor();
      startOstinato(ctx);
      notifyStateChange();
      return true;
    } else {
      // Graceful fadeout
      if (scoreLoopTimeout) {
        clearTimeout(scoreLoopTimeout);
        scoreLoopTimeout = null;
      }
      if (ostinatoInterval) {
        clearInterval(ostinatoInterval);
        ostinatoInterval = null;
      }
      if (musicGain) {
        musicGain.gain.setValueAtTime(musicGain.gain.value, ctx.currentTime);
        musicGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      }
      notifyStateChange();
      return false;
    }
  } catch (e) {
    return false;
  }
}

export function isAudioEnabled(): boolean {
  return isPlayingScore;
}

export function getCurrentChordName(): string {
  if (!isPlayingScore) return 'SILENCE';
  return EXPEDITION_CHORDS[currentChordIndex]?.name ?? 'EXPEDITION';
}

/**
 * Automatically initializes and begins audio playback on website opening.
 * If browser autoplay policy suspends AudioContext initially,
 * it attaches seamless first-interaction capture listeners to wake up
 * and start the score the instant the visitor touches, clicks, or scrolls.
 */
let hasBoundAutoListeners = false;

export function initAutoAudio(): void {
  if (typeof window === 'undefined') return;

  // Attempt direct start immediately
  const started = toggleAmbientSound(true);

  if (hasBoundAutoListeners) return;
  hasBoundAutoListeners = true;

  const triggerOnGesture = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => {
        if (!isPlayingScore) {
          toggleAmbientSound(true);
        }
      }).catch(() => {});
    } else if (!isPlayingScore) {
      toggleAmbientSound(true);
    }

    // Clean up one-time listeners once engaged
    ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'scroll', 'click'].forEach((event) => {
      window.removeEventListener(event, triggerOnGesture);
      document.removeEventListener(event, triggerOnGesture);
    });
  };

  ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'scroll', 'click'].forEach((event) => {
    window.addEventListener(event, triggerOnGesture, { once: true, passive: true });
    document.addEventListener(event, triggerOnGesture, { once: true, passive: true });
  });
}

// Auto-run if running in browser
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initAutoAudio();
  } else {
    window.addEventListener('DOMContentLoaded', initAutoAudio, { once: true });
  }
}

/**
 * Telemetry Sound Effects
 */
export function playTelemetryBeep(freq: number = 880, duration: number = 0.08) {
  try {
    const ctx = getAudioContext();
    if (!ctx || !sfxGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(sfxGain);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    /* Safe fallback */
  }
}

export function playBeaconPing(freq: number = 1046.5, duration: number = 0.35) {
  try {
    const ctx = getAudioContext();
    if (!ctx || !sfxGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.setValueAtTime(freq * 1.25, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(sfxGain);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    /* Safe fallback */
  }
}

export function playThrusterBurst() {
  try {
    const ctx = getAudioContext();
    if (!ctx || !sfxGain) return;

    const bufferSize = ctx.sampleRate * 0.45;
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
    filter.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.2);
    filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.45);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(sfxGain);

    noise.start();
  } catch (e) {
    /* Safe fallback */
  }
}

export function playWarpSurge() {
  try {
    const ctx = getAudioContext();
    if (!ctx || !sfxGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.9);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.4);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.9);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(sfxGain);

    osc.start();
    osc.stop(ctx.currentTime + 0.9);
  } catch (e) {
    /* Safe fallback */
  }
}

export function playLaserFire() {
  try {
    const ctx = getAudioContext();
    if (!ctx || !sfxGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.15);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(sfxGain);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    /* Safe fallback */
  }
}

export function playAsteroidBlast() {
  try {
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
  } catch (e) {
    /* Safe fallback */
  }
}
