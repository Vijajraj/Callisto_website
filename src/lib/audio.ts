/**
 * Callisto Audio API - Backward Compatibility Adapter
 * Proxies all requests to the central audioManager module.
 */

export * from './audioManager';

import {
  setMusicEnabled,
  toggleMusic,
  isMusicEnabled,
  getCurrentMovementInfo,
} from './audioManager';

// Backward-compatible alias functions
export function toggleAmbientSound(enable?: boolean): boolean {
  if (enable !== undefined) {
    return setMusicEnabled(enable);
  }
  return toggleMusic();
}

export function isAudioEnabled(): boolean {
  return isMusicEnabled();
}

export function getCurrentChordName(): string {
  const info = getCurrentMovementInfo();
  return `${info.name} (${info.theme})`;
}

export function initAutoAudio(): void {
  // Silent initialization respecting user preference
}
