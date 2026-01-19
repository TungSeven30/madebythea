'use client';

/**
 * useAudio - React hook for playing game audio
 *
 * Provides easy access to sound effects and background music.
 * Respects game settings for sound enabled/disabled.
 */

import { useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { AudioManager, type SfxId, type BgmId } from '@/lib/audio';

interface UseAudioReturn {
  /** Play a sound effect */
  playSfx: (id: SfxId) => void;
  /** Play background music with crossfade */
  playBgm: (id: BgmId) => void;
  /** Stop current background music */
  stopBgm: () => void;
  /** Toggle sound on/off */
  toggleSound: () => void;
  /** Check if sound is enabled */
  soundEnabled: boolean;
}

export function useAudio(): UseAudioReturn {
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled);
  const toggleSoundSetting = useGameStore((state) => state.toggleSound);

  const playSfx = useCallback(
    (id: SfxId) => {
      if (soundEnabled) {
        AudioManager.playSfx(id);
      }
    },
    [soundEnabled]
  );

  const playBgm = useCallback(
    (id: BgmId) => {
      if (soundEnabled) {
        AudioManager.playBgm(id);
      } else {
        AudioManager.stopBgm();
      }
    },
    [soundEnabled]
  );

  const stopBgm = useCallback(() => {
    AudioManager.stopBgm();
  }, []);

  const toggleSound = useCallback(() => {
    toggleSoundSetting();
    const newState = !soundEnabled;
    AudioManager.setMuted(!newState);

    // If turning sound on, don't auto-play BGM - let the page handle it
    if (!newState) {
      AudioManager.stopBgm(0);
    }
  }, [soundEnabled, toggleSoundSetting]);

  return {
    playSfx,
    playBgm,
    stopBgm,
    toggleSound,
    soundEnabled,
  };
}

/**
 * Convenience hooks for specific sound types
 */

export function useClickSound(): () => void {
  const { playSfx, soundEnabled } = useAudio();
  return useCallback(() => {
    if (soundEnabled) playSfx('click');
  }, [playSfx, soundEnabled]);
}

export function useSuccessSound(): () => void {
  const { playSfx, soundEnabled } = useAudio();
  return useCallback(() => {
    if (soundEnabled) playSfx('cha-ching');
  }, [playSfx, soundEnabled]);
}

export function useLevelUpSound(): () => void {
  const { playSfx, soundEnabled } = useAudio();
  return useCallback(() => {
    if (soundEnabled) playSfx('level-up');
  }, [playSfx, soundEnabled]);
}
