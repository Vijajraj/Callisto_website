/**
 * Callisto Web Audio API — Procedural Hans Zimmer "Interstellar" Sound Engine
 *
 * Fully procedural synthesis using zero external audio files.
 * Architected to reproduce Hans Zimmer's iconic Interstellar score:
 * - Multi-rank Cathedral Pipe Organ (16', 8', 4', 2' ranks + 32' pedal bass)
 * - The iconic 4-chord progression (Am -> F -> C -> Em)
 * - Time-dilation clockwork ostinato / arpeggiator ("Day One" / "Cornfield Chase")
 * - Spatial acoustic cathedral convolution / reverberation
 * - Dynamic crescendo / decrescendo breathing filters
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

// Organ voice nodes currently active for smooth voice-stealing / crossfade
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
      masterGain.gain.setValueAtTime(0.75, audioCtx.currentTime);

      // Create synthetic cathedral impulse response for Hans Zimmer space reverb
      reverbNode = createCathedralReverb(audioCtx);

      musicGain = audioCtx.createGain();
      musicGain.gain.setValueAtTime(0.85, audioCtx.currentTime);

      sfxGain = audioCtx.createGain();
      sfxGain.gain.setValueAtTime(0.7, audioCtx.currentTime);

      // Connect music through reverb + dry path to master
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
 * Procedural impulse response generator simulating a vast stone cathedral (Temple Church, London)
 * where the Interstellar organ score was recorded.
 */
function createCathedralReverb(ctx: AudioContext): ConvolverNode {
  const convolver = ctx.createConvolver();
  const rate = ctx.sampleRate;
  const length = rate * 3.5; // 3.5 seconds decay
  const impulse = ctx.createBuffer(2, length, rate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  for (let i = 0; i < length; i++) {
    const t = i / rate;
    // Exponential decay with slight early reflections
    const decay = Math.exp(-t * 1.8);
    left[i] = (Math.random() * 2 - 1) * decay;
    right[i] = (Math.random() * 2 - 1) * decay;
  }

  convolver.buffer = impulse;
  return convolver;
}

// Interstellar 4-Chord Progression (Chords with frequencies in Hz)
interface ChordDef {
  name: string;
  pedalBass: number;   // Deep 32'/16' organ pedal bass
  bassFundamental: number; // 8' bass
  chordNotes: number[]; // Main organ pipe manuals
  ostinatoNotes: number[]; // Rapid clockwork arpeggiator notes
}

const INTERSTELLAR_CHORDS: ChordDef[] = [
  // 1. A Minor — Contemplative quiet awe
  {
    name: 'A Minor',
    pedalBass: 55.0, // A1
    bassFundamental: 110.0, // A2
    chordNotes: [220.0, 261.63, 329.63, 440.0, 523.25], // A3, C4, E4, A4, C5
    ostinatoNotes: [440.0, 523.25, 659.25, 880.0, 659.25, 523.25, 440.0, 659.25], // A4-C5-E5-A5-E5-C5-A4-E5
  },
  // 2. F Major — Soaring emotional gravity
  {
    name: 'F Major',
    pedalBass: 43.65, // F1
    bassFundamental: 87.31, // F2
    chordNotes: [174.61, 220.0, 261.63, 349.23, 440.0], // F3, A3, C4, F4, A4
    ostinatoNotes: [349.23, 440.0, 523.25, 698.46, 523.25, 440.0, 349.23, 523.25], // F4-A4-C5-F5-C5-A4-F4-C5
  },
  // 3. C Major — Infinite cosmic expanse
  {
    name: 'C Major',
    pedalBass: 65.41, // C2
    bassFundamental: 130.81, // C3
    chordNotes: [196.0, 261.63, 329.63, 392.0, 523.25], // G3, C4, E4, G4, C5
    ostinatoNotes: [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 523.25, 783.99], // C5-E5-G5-C6-G5-E5-C5-G5
  },
  // 4. E Minor — Solitude across space and time
  {
    name: 'E Minor',
    pedalBass: 41.20, // E1
    bassFundamental: 82.41, // E2
    chordNotes: [164.81, 246.94, 329.63, 392.0, 493.88], // E3, B3, E4, G4, B4
    ostinatoNotes: [329.63, 392.0, 493.88, 659.25, 493.88, 392.0, 329.63, 493.88], // E4-G4-B4-E5-B4-G4-E4-B4
  },
];

/**
 * Synthesizes a pipe organ chord with multi-rank harmonics.
 */
function playOrganChord(ctx: AudioContext, chord: ChordDef, duration: number) {
  if (!musicGain) return;

  const now = ctx.currentTime;
  const voiceGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(350, now);
  // Hans Zimmer dynamic swell: filter opens as organ pipes breathe, then slowly settles
  filter.frequency.exponentialRampToValueAtTime(1200, now + duration * 0.45);
  filter.frequency.exponentialRampToValueAtTime(450, now + duration);

  voiceGain.gain.setValueAtTime(0.001, now);
  voiceGain.gain.linearRampToValueAtTime(0.24, now + 2.2); // Slow, majestic church organ attack
  voiceGain.gain.setValueAtTime(0.24, now + duration - 2.0);
  voiceGain.gain.linearRampToValueAtTime(0.001, now + duration); // Smooth release

  const oscList: OscillatorNode[] = [];

  // Deep 32' / 16' pedal organ pipe (Sub-bass sine + warm triangle)
  const pedalSine = ctx.createOscillator();
  pedalSine.type = 'sine';
  pedalSine.frequency.setValueAtTime(chord.pedalBass, now);

  const pedalTri = ctx.createOscillator();
  pedalTri.type = 'triangle';
  pedalTri.frequency.setValueAtTime(chord.bassFundamental, now);

  const pedalGain = ctx.createGain();
  pedalGain.gain.setValueAtTime(0.45, now);
  pedalSine.connect(pedalGain);
  pedalTri.connect(pedalGain);
  pedalGain.connect(filter);

  pedalSine.start(now);
  pedalTri.start(now);
  pedalSine.stop(now + duration);
  pedalTri.stop(now + duration);

  oscList.push(pedalSine, pedalTri);

  // Manual pipes: fundamental + octave detuned ranks
  chord.chordNotes.forEach((freq, idx) => {
    // Rank 1: Soft flue pipe (Sine)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Rank 2: Principal pipe (Triangle with slight detune for natural chorus)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.002, now);

    const pipeGain = ctx.createGain();
    const relativeAmp = 0.12 / Math.sqrt(idx + 1);
    pipeGain.gain.setValueAtTime(relativeAmp, now);

    osc1.connect(pipeGain);
    osc2.connect(pipeGain);
    pipeGain.connect(filter);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);

    oscList.push(osc1, osc2);
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
 * Clockwork Ostinato ("Day One" / "Cornfield Chase" rhythmic arpeggio).
 * Simulates delicate glass organ flute pipes weaving through the chords.
 */
function startOstinato(ctx: AudioContext) {
  if (ostinatoInterval) return;

  const stepDuration = 220; // 220ms per 16th-note pulse

  ostinatoInterval = window.setInterval(() => {
    if (!isPlayingScore || !musicGain) return;

    const chord = INTERSTELLAR_CHORDS[currentChordIndex];
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
    filter.frequency.setValueAtTime(freq * 1.5, now);
    filter.Q.value = 3.5;

    // Delicate staccato organ flute envelope
    gain.gain.setValueAtTime(0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(musicGain);

    osc.start(now);
    osc.stop(now + 0.2);

    // Subtle Interstellar clock tick every 4 steps
    if (ostinatoStep % 4 === 0) {
      playClockTick(ctx);
    }
  }, stepDuration);
}

/**
 * Ticking clock pulse representing time dilation on Miller's planet
 * (Every tick represents earth time slipping away)
 */
function playClockTick(ctx: AudioContext) {
  if (!sfxGain) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1400, now);
  osc.frequency.exponentialRampToValueAtTime(250, now + 0.04);

  gain.gain.setValueAtTime(0.018, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

  osc.connect(gain);
  gain.connect(sfxGain);

  osc.start(now);
  osc.stop(now + 0.045);
}

/**
 * Main score conductor loop cycling through the majestic 4-chord progression.
 */
function runScoreConductor() {
  if (!isPlayingScore) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const chordDuration = 10.5; // Each chord breathes for 10.5 seconds
  const chord = INTERSTELLAR_CHORDS[currentChordIndex];

  playOrganChord(ctx, chord, chordDuration + 1.5); // 1.5s crossfade overlap

  scoreLoopTimeout = window.setTimeout(() => {
    if (!isPlayingScore) return;
    currentChordIndex = (currentChordIndex + 1) % INTERSTELLAR_CHORDS.length;
    runScoreConductor();
  }, chordDuration * 1000);
}

/**
 * Public control: Toggle Hans Zimmer Interstellar Score.
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
        musicGain.gain.linearRampToValueAtTime(0.85, ctx.currentTime + 2.0);
      }
      currentChordIndex = 0;
      ostinatoStep = 0;
      runScoreConductor();
      startOstinato(ctx);
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
  return INTERSTELLAR_CHORDS[currentChordIndex]?.name ?? 'INTERSTELLAR';
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
