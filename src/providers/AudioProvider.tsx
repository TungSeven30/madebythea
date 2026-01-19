'use client';

/**
 * AudioProvider - Initializes and manages game audio
 *
 * Wraps the app to initialize the AudioManager and sync with game settings.
 */

import { useEffect, useRef, type ReactNode } from 'react';
import { AudioManager } from '@/lib/audio';
import { useGameStore } from '@/stores/gameStore';

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps): ReactNode {
  const initialized = useRef(false);
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled);

  // Initialize audio system once on mount
  useEffect(() => {
    if (!initialized.current) {
      AudioManager.init();
      initialized.current = true;
    }
  }, []);

  // Sync mute state with game settings
  useEffect(() => {
    AudioManager.setMuted(!soundEnabled);
  }, [soundEnabled]);

  return <>{children}</>;
}
