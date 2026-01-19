/**
 * Achievement Store - Tracks player achievements
 *
 * All achievements are emoji-based for non-readers.
 * Progress is tracked automatically and persisted.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Achievement IDs
export type AchievementId =
  | 'first-sale'
  | 'rainbow-maker'
  | 'speed-demon'
  | 'family-favorite'
  | 'perfect-wave'
  | 'big-earner'
  | 'clothing-creator'
  | 'super-seller';

export interface Achievement {
  id: AchievementId;
  emoji: string;
  name: string; // For accessibility/screen readers
  progress: number;
  requirement: number;
  unlockedAt?: number; // Timestamp when unlocked
}

// Achievement definitions
export const ACHIEVEMENT_DEFINITIONS: Record<AchievementId, Omit<Achievement, 'progress' | 'unlockedAt'>> = {
  'first-sale': {
    id: 'first-sale',
    emoji: '🪙',
    name: 'First Sale',
    requirement: 1,
  },
  'rainbow-maker': {
    id: 'rainbow-maker',
    emoji: '🌈',
    name: 'Rainbow Maker',
    requirement: 8, // All 8 colors used
  },
  'speed-demon': {
    id: 'speed-demon',
    emoji: '⚡',
    name: 'Speed Demon',
    requirement: 5, // 5 sales in one wave
  },
  'family-favorite': {
    id: 'family-favorite',
    emoji: '👨‍👩‍👧‍👦',
    name: 'Family Favorite',
    requirement: 7, // Sell to all 7 family members
  },
  'perfect-wave': {
    id: 'perfect-wave',
    emoji: '⭐',
    name: 'Perfect Wave',
    requirement: 1, // 100% match rate in a wave
  },
  'big-earner': {
    id: 'big-earner',
    emoji: '💰',
    name: 'Big Earner',
    requirement: 100, // 100 total coins earned
  },
  'clothing-creator': {
    id: 'clothing-creator',
    emoji: '👗',
    name: 'Clothing Creator',
    requirement: 10, // Create 10 items
  },
  'super-seller': {
    id: 'super-seller',
    emoji: '🏆',
    name: 'Super Seller',
    requirement: 50, // 50 total successful sales
  },
};

interface AchievementState {
  achievements: Record<AchievementId, Achievement>;
  /** Queue of newly unlocked achievements to show */
  pendingUnlocks: AchievementId[];

  // Progress tracking actions
  incrementProgress: (id: AchievementId, amount?: number) => boolean;
  setProgress: (id: AchievementId, progress: number) => boolean;

  // Popup management
  popPendingUnlock: () => AchievementId | null;
  clearPendingUnlocks: () => void;

  // Queries
  isUnlocked: (id: AchievementId) => boolean;
  getProgress: (id: AchievementId) => number;
  getUnlockedCount: () => number;
  getTotalCount: () => number;

  // Reset
  resetAchievements: () => void;
}

function createInitialAchievements(): Record<AchievementId, Achievement> {
  const achievements: Record<AchievementId, Achievement> = {} as Record<AchievementId, Achievement>;

  for (const [id, def] of Object.entries(ACHIEVEMENT_DEFINITIONS)) {
    achievements[id as AchievementId] = {
      ...def,
      progress: 0,
    };
  }

  return achievements;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      achievements: createInitialAchievements(),
      pendingUnlocks: [],

      incrementProgress: (id: AchievementId, amount = 1) => {
        const state = get();
        const achievement = state.achievements[id];

        // Already unlocked, no need to update
        if (achievement.unlockedAt) return false;

        const newProgress = Math.min(
          achievement.progress + amount,
          achievement.requirement
        );
        const justUnlocked = newProgress >= achievement.requirement;

        set((state) => ({
          achievements: {
            ...state.achievements,
            [id]: {
              ...state.achievements[id],
              progress: newProgress,
              unlockedAt: justUnlocked ? Date.now() : undefined,
            },
          },
          pendingUnlocks: justUnlocked
            ? [...state.pendingUnlocks, id]
            : state.pendingUnlocks,
        }));

        return justUnlocked;
      },

      setProgress: (id: AchievementId, progress: number) => {
        const state = get();
        const achievement = state.achievements[id];

        // Already unlocked, no need to update
        if (achievement.unlockedAt) return false;

        const newProgress = Math.min(progress, achievement.requirement);
        const justUnlocked = newProgress >= achievement.requirement;

        set((state) => ({
          achievements: {
            ...state.achievements,
            [id]: {
              ...state.achievements[id],
              progress: newProgress,
              unlockedAt: justUnlocked ? Date.now() : undefined,
            },
          },
          pendingUnlocks: justUnlocked
            ? [...state.pendingUnlocks, id]
            : state.pendingUnlocks,
        }));

        return justUnlocked;
      },

      popPendingUnlock: () => {
        const state = get();
        if (state.pendingUnlocks.length === 0) return null;

        const [first, ...rest] = state.pendingUnlocks;
        set({ pendingUnlocks: rest });
        return first;
      },

      clearPendingUnlocks: () => {
        set({ pendingUnlocks: [] });
      },

      isUnlocked: (id: AchievementId) => {
        return get().achievements[id].unlockedAt !== undefined;
      },

      getProgress: (id: AchievementId) => {
        return get().achievements[id].progress;
      },

      getUnlockedCount: () => {
        const achievements = get().achievements;
        return Object.values(achievements).filter((a) => a.unlockedAt).length;
      },

      getTotalCount: () => {
        return Object.keys(ACHIEVEMENT_DEFINITIONS).length;
      },

      resetAchievements: () => {
        set({
          achievements: createInitialAchievements(),
          pendingUnlocks: [],
        });
      },
    }),
    {
      name: 'thea-achievements',
    }
  )
);

/**
 * Helper hook to check and update multiple achievements at once
 * Useful for batch updates after game events
 */
export function useAchievementTracker() {
  const incrementProgress = useAchievementStore((state) => state.incrementProgress);
  const setProgress = useAchievementStore((state) => state.setProgress);

  return {
    /** Track a successful sale */
    trackSale: () => {
      incrementProgress('first-sale');
      incrementProgress('super-seller');
    },

    /** Track total coins earned */
    trackCoinsEarned: (totalCoins: number) => {
      setProgress('big-earner', totalCoins);
    },

    /** Track a new item created */
    trackItemCreated: () => {
      incrementProgress('clothing-creator');
    },

    /** Track unique colors used (pass Set of all colors ever used) */
    trackColorsUsed: (uniqueColors: Set<string>) => {
      setProgress('rainbow-maker', uniqueColors.size);
    },

    /** Track sales in a single wave */
    trackWaveSales: (salesCount: number, totalAttempts: number) => {
      // Speed demon - 5+ sales in one wave
      if (salesCount >= 5) {
        setProgress('speed-demon', salesCount);
      }

      // Perfect wave - 100% success rate with at least 3 sales
      if (salesCount >= 3 && salesCount === totalAttempts) {
        incrementProgress('perfect-wave');
      }
    },

    /** Track unique customers sold to */
    trackUniqueCustomers: (uniqueCustomerIds: Set<string>) => {
      setProgress('family-favorite', uniqueCustomerIds.size);
    },
  };
}
