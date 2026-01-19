/**
 * Game Store - Manages game state (money, waves, settings, results, progression)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ClothingItem, ClothingColor, ClothingPattern, Customer } from '@/types';

// XP rewards for different actions
export const XP_REWARDS = {
  saleSuccess: 10,
  perfectMatch: 25,  // Bonus for exact match (color + shape)
  waveComplete: 50,
  achievementUnlock: 100,
} as const;

// Level thresholds - XP needed to reach each level
export const LEVEL_THRESHOLDS = [
  0,     // Level 1
  100,   // Level 2
  250,   // Level 3
  450,   // Level 4
  700,   // Level 5
  1000,  // Level 6
  1400,  // Level 7
  1900,  // Level 8
  2500,  // Level 9
  3200,  // Level 10+
];

// Colors unlocked at each level
export const COLOR_UNLOCK_SCHEDULE: Record<number, ClothingColor[]> = {
  1: ['pink', 'purple', 'blue', 'green'],
  2: ['yellow'],
  4: ['orange'],
  6: ['red'],
  8: ['white'],
};

// Patterns unlocked at each level
export const PATTERN_UNLOCK_SCHEDULE: Record<number, ClothingPattern[]> = {
  1: ['none', 'stripes'],
  3: ['dots'],
  5: ['hearts'],
  7: ['stars'],
};

// Calculate level from XP
export function calculateLevel(xp: number): number {
  for (let level = LEVEL_THRESHOLDS.length - 1; level >= 0; level--) {
    if (xp >= LEVEL_THRESHOLDS[level]) {
      return level + 1;
    }
  }
  return 1;
}

// Get unlocked colors for a level
export function getUnlockedColors(level: number): ClothingColor[] {
  const colors: ClothingColor[] = [];
  for (let l = 1; l <= level; l++) {
    if (COLOR_UNLOCK_SCHEDULE[l]) {
      colors.push(...COLOR_UNLOCK_SCHEDULE[l]);
    }
  }
  return colors;
}

// Get unlocked patterns for a level
export function getUnlockedPatterns(level: number): ClothingPattern[] {
  const patterns: ClothingPattern[] = [];
  for (let l = 1; l <= level; l++) {
    if (PATTERN_UNLOCK_SCHEDULE[l]) {
      patterns.push(...PATTERN_UNLOCK_SCHEDULE[l]);
    }
  }
  return patterns;
}

// Pending unlock for level up display
export interface PendingUnlock {
  type: 'color' | 'pattern';
  value: ClothingColor | ClothingPattern;
}

interface SaleRecord {
  itemId: string;
  item: ClothingItem;
  customer: Customer;
  price: number;
  success: boolean;
  reason?: string;
}

interface WaveResult {
  waveNumber: number;
  sales: SaleRecord[];
  totalEarned: number;
  itemsSold: number;
  itemsNotSold: number;
}

interface GameSettings {
  soundEnabled: boolean;
  waveDuration: number; // in seconds
}

interface GameState {
  // Money
  totalMoney: number;

  // Wave state
  currentWave: number;
  waveInProgress: boolean;
  currentWaveResult: WaveResult | null;

  // Wave history
  waveHistory: WaveResult[];

  // Progression
  xp: number;
  level: number;
  pendingLevelUp: number | null;  // New level if just leveled up
  pendingUnlocks: PendingUnlock[];

  // Make-to-order state
  makeToOrderCustomerId: string | null;

  // Settings
  settings: GameSettings;

  // Money actions
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean; // Returns true if successful

  // Wave actions
  startWave: () => void;
  endWave: (result: WaveResult) => void;
  recordSale: (sale: SaleRecord) => void;

  // XP/Progression actions
  addXP: (amount: number) => boolean;  // Returns true if leveled up
  getUnlockedColors: () => ClothingColor[];
  getUnlockedPatterns: () => ClothingPattern[];
  clearPendingLevelUp: () => void;
  popPendingUnlock: () => PendingUnlock | null;

  // Make-to-order actions
  setMakeToOrder: (customerId: string) => void;
  clearMakeToOrder: () => void;

  // Settings actions
  toggleSound: () => void;
  setWaveDuration: (duration: number) => void;

  // Reset
  resetGame: () => void;
}

const initialSettings: GameSettings = {
  soundEnabled: true,
  waveDuration: 90,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      totalMoney: 0,
      currentWave: 1,
      waveInProgress: false,
      currentWaveResult: null,
      waveHistory: [],
      xp: 0,
      level: 1,
      pendingLevelUp: null,
      pendingUnlocks: [],
      makeToOrderCustomerId: null,
      settings: initialSettings,

      addMoney: (amount: number) => {
        set((state) => ({
          totalMoney: state.totalMoney + amount,
        }));
      },

      spendMoney: (amount: number) => {
        const state = get();
        if (state.totalMoney < amount) {
          return false;
        }
        set({ totalMoney: state.totalMoney - amount });
        return true;
      },

      startWave: () => {
        set({
          waveInProgress: true,
          currentWaveResult: {
            waveNumber: get().currentWave,
            sales: [],
            totalEarned: 0,
            itemsSold: 0,
            itemsNotSold: 0,
          },
        });
      },

      endWave: (result: WaveResult) => {
        set((state) => ({
          waveInProgress: false,
          currentWaveResult: result,
          waveHistory: [...state.waveHistory, result],
          currentWave: state.currentWave + 1,
          totalMoney: state.totalMoney + result.totalEarned,
        }));
      },

      recordSale: (sale: SaleRecord) => {
        set((state) => {
          if (!state.currentWaveResult) return state;

          const updatedResult: WaveResult = {
            ...state.currentWaveResult,
            sales: [...state.currentWaveResult.sales, sale],
            totalEarned: state.currentWaveResult.totalEarned + (sale.success ? sale.price : 0),
            itemsSold: state.currentWaveResult.itemsSold + (sale.success ? 1 : 0),
            itemsNotSold: state.currentWaveResult.itemsNotSold + (sale.success ? 0 : 1),
          };

          return { currentWaveResult: updatedResult };
        });
      },

      addXP: (amount: number) => {
        const state = get();
        const newXP = state.xp + amount;
        const oldLevel = state.level;
        const newLevel = calculateLevel(newXP);
        const leveledUp = newLevel > oldLevel;

        // Collect new unlocks if leveled up
        const newUnlocks: PendingUnlock[] = [];
        if (leveledUp) {
          for (let l = oldLevel + 1; l <= newLevel; l++) {
            // Check for new colors at this level
            if (COLOR_UNLOCK_SCHEDULE[l]) {
              for (const color of COLOR_UNLOCK_SCHEDULE[l]) {
                newUnlocks.push({ type: 'color', value: color });
              }
            }
            // Check for new patterns at this level
            if (PATTERN_UNLOCK_SCHEDULE[l]) {
              for (const pattern of PATTERN_UNLOCK_SCHEDULE[l]) {
                newUnlocks.push({ type: 'pattern', value: pattern });
              }
            }
          }
        }

        set({
          xp: newXP,
          level: newLevel,
          pendingLevelUp: leveledUp ? newLevel : null,
          pendingUnlocks: leveledUp ? [...state.pendingUnlocks, ...newUnlocks] : state.pendingUnlocks,
        });

        return leveledUp;
      },

      getUnlockedColors: () => {
        return getUnlockedColors(get().level);
      },

      getUnlockedPatterns: () => {
        return getUnlockedPatterns(get().level);
      },

      clearPendingLevelUp: () => {
        set({ pendingLevelUp: null });
      },

      popPendingUnlock: () => {
        const state = get();
        if (state.pendingUnlocks.length === 0) return null;

        const [first, ...rest] = state.pendingUnlocks;
        set({ pendingUnlocks: rest });
        return first;
      },

      setMakeToOrder: (customerId: string) => {
        set({ makeToOrderCustomerId: customerId });
      },

      clearMakeToOrder: () => {
        set({ makeToOrderCustomerId: null });
      },

      toggleSound: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            soundEnabled: !state.settings.soundEnabled,
          },
        }));
      },

      setWaveDuration: (duration: number) => {
        set((state) => ({
          settings: {
            ...state.settings,
            waveDuration: duration,
          },
        }));
      },

      resetGame: () => {
        set({
          totalMoney: 0,
          currentWave: 1,
          waveInProgress: false,
          currentWaveResult: null,
          waveHistory: [],
          xp: 0,
          level: 1,
          pendingLevelUp: null,
          pendingUnlocks: [],
          makeToOrderCustomerId: null,
          settings: initialSettings,
        });
      },
    }),
    {
      name: 'thea-game',
    }
  )
);
