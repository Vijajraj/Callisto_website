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
 * Callisto Audio API - Backward Compatibility Adapter
 * Proxies all calls to audioManager.
 */

export * from './audioManager';

import {
  setMusicEnabled,
  toggleMusic,
  isMusicEnabled,
  getCurrentMovementInfo,
} from './audioManager';

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

export function initAutoAudio(): void {}
