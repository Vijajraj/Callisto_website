/**
 * Callisto Web Audio API Procedural Synthesizer
 * Zero-asset procedural cosmic sound engine.
 */

let audioCtx: AudioContext | null = null;
let ambientOsc1: OscillatorNode | null = null;
let ambientOsc2: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;
let masterGain: GainNode | null = null;
let isMuted: boolean = true;

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
      masterGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }
  return audioCtx;
}

export function playTelemetryBeep(freq: number = 880, duration: number = 0.08) {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx || !masterGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    /* Safe fallback if blocked */
  }
}

export function playBeaconPing(freq: number = 1046.5, duration: number = 0.35) {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx || !masterGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.setValueAtTime(freq * 1.25, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    /* Safe fallback */
  }
}

export function playThrusterBurst() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx || !masterGain) return;

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
    gain.connect(masterGain);

    noise.start();
  } catch (e) {
    /* Safe fallback */
  }
}

export function playWarpSurge() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx || !masterGain) return;

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
    gain.connect(masterGain);

    osc.start();
    osc.stop(ctx.currentTime + 0.9);
  } catch (e) {
    /* Safe fallback */
  }
}

export function toggleAmbientSound(enable?: boolean): boolean {
  try {
    const ctx = getAudioContext();
    if (!ctx || !masterGain) return false;

    if (enable !== undefined) {
      isMuted = !enable;
    } else {
      isMuted = !isMuted;
    }

    if (isMuted) {
      if (ambientGain) {
        ambientGain.gain.setValueAtTime(ambientGain.gain.value, ctx.currentTime);
        ambientGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      }
      return false;
    } else {
      if (!ambientOsc1 || !ambientOsc2) {
        ambientOsc1 = ctx.createOscillator();
        ambientOsc2 = ctx.createOscillator();
        ambientGain = ctx.createGain();

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 220;

        ambientOsc1.type = 'sine';
        ambientOsc1.frequency.value = 55; // A1 low drone

        ambientOsc2.type = 'triangle';
        ambientOsc2.frequency.value = 82.41; // E2 harmonic

        ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
        ambientGain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 1.5);

        ambientOsc1.connect(filter);
        ambientOsc2.connect(filter);
        filter.connect(ambientGain);
        ambientGain.connect(masterGain);

        ambientOsc1.start();
        ambientOsc2.start();
      } else if (ambientGain) {
        ambientGain.gain.setValueAtTime(ambientGain.gain.value, ctx.currentTime);
        ambientGain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 1);
      }
      playBeaconPing(1046.5, 0.15);
      return true;
    }
  } catch (e) {
    return false;
  }
}

export function isAudioEnabled(): boolean {
  return !isMuted;
}
