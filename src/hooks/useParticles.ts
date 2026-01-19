'use client';

/**
 * useParticles - React hook for particle effects
 *
 * Provides easy access to game particle effects with
 * optional coordinate targeting.
 */

import { useCallback, useRef } from 'react';
import {
  fireCelebration,
  fireCoinBurst,
  fireSparkles,
  fireSuccess,
  fireSoftFail,
  fireLevelUp,
  fireAchievement,
  clearParticles,
} from '@/lib/effects';

interface UseParticlesReturn {
  /** Celebration confetti for wave complete, major achievements */
  celebration: () => void;
  /** Gold coin burst for successful sales */
  coinBurst: (x?: number, y?: number) => void;
  /** Sparkle effect for item creation */
  sparkles: (x?: number, y?: number) => void;
  /** Green success burst */
  success: (x?: number, y?: number) => void;
  /** Soft gray puff for failures */
  softFail: (x?: number, y?: number) => void;
  /** Big explosion for level up */
  levelUp: () => void;
  /** Rainbow burst for achievements */
  achievement: () => void;
  /** Clear all active particles */
  clear: () => void;
  /** Fire effect at element's position */
  fireAtElement: (element: HTMLElement | null, effect: 'coinBurst' | 'sparkles' | 'success') => void;
}

/**
 * Convert element position to viewport-relative coordinates (0-1)
 */
function getElementCenter(element: HTMLElement): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;
  return { x, y };
}

export function useParticles(): UseParticlesReturn {
  // Debounce ref to prevent spam
  const lastFired = useRef<Record<string, number>>({});
  const DEBOUNCE_MS = 100;

  const debounced = useCallback((key: string, fn: () => void) => {
    const now = Date.now();
    if (now - (lastFired.current[key] ?? 0) > DEBOUNCE_MS) {
      lastFired.current[key] = now;
      fn();
    }
  }, []);

  const celebration = useCallback(() => {
    debounced('celebration', fireCelebration);
  }, [debounced]);

  const coinBurst = useCallback((x?: number, y?: number) => {
    debounced('coinBurst', () => fireCoinBurst(x, y));
  }, [debounced]);

  const sparkles = useCallback((x?: number, y?: number) => {
    debounced('sparkles', () => fireSparkles(x, y));
  }, [debounced]);

  const success = useCallback((x?: number, y?: number) => {
    debounced('success', () => fireSuccess(x, y));
  }, [debounced]);

  const softFail = useCallback((x?: number, y?: number) => {
    debounced('softFail', () => fireSoftFail(x, y));
  }, [debounced]);

  const levelUp = useCallback(() => {
    debounced('levelUp', fireLevelUp);
  }, [debounced]);

  const achievement = useCallback(() => {
    debounced('achievement', fireAchievement);
  }, [debounced]);

  const clear = useCallback(() => {
    clearParticles();
  }, []);

  const fireAtElement = useCallback((
    element: HTMLElement | null,
    effect: 'coinBurst' | 'sparkles' | 'success'
  ) => {
    if (!element) return;
    const { x, y } = getElementCenter(element);

    switch (effect) {
      case 'coinBurst':
        fireCoinBurst(x, y);
        break;
      case 'sparkles':
        fireSparkles(x, y);
        break;
      case 'success':
        fireSuccess(x, y);
        break;
    }
  }, []);

  return {
    celebration,
    coinBurst,
    sparkles,
    success,
    softFail,
    levelUp,
    achievement,
    clear,
    fireAtElement,
  };
}
