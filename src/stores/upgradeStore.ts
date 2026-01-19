/**
 * Upgrade Store - Manages purchasable game upgrades
 *
 * Upgrades improve gameplay and persist across sessions.
 * Purchased with coins earned from sales.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Upgrade IDs
export type UpgradeId = 'bigger-rack' | 'patient-customers' | 'tip-jar';

export interface Upgrade {
  id: UpgradeId;
  emoji: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  costs: number[]; // Cost for each level (index 0 = level 1 cost)
}

// Upgrade definitions
export const UPGRADE_DEFINITIONS: Record<UpgradeId, Omit<Upgrade, 'level'>> = {
  'bigger-rack': {
    id: 'bigger-rack',
    emoji: '🧺',
    name: 'Bigger Rack',
    description: '+2 items in store',
    maxLevel: 3,
    costs: [50, 150, 300],
  },
  'patient-customers': {
    id: 'patient-customers',
    emoji: '⏰',
    name: 'Patient Customers',
    description: '+15s wave time',
    maxLevel: 3,
    costs: [75, 200, 400],
  },
  'tip-jar': {
    id: 'tip-jar',
    emoji: '💵',
    name: 'Tip Jar',
    description: '+1 coin per sale',
    maxLevel: 3,
    costs: [100, 250, 500],
  },
};

interface UpgradeState {
  upgrades: Record<UpgradeId, Upgrade>;

  // Actions
  purchaseUpgrade: (id: UpgradeId) => boolean; // Returns true if successful
  getUpgradeCost: (id: UpgradeId) => number | null; // null if maxed
  isMaxLevel: (id: UpgradeId) => boolean;

  // Effect getters (for game logic)
  getRackBonus: () => number;
  getWaveTimeBonus: () => number;
  getTipBonus: () => number;

  // Reset
  resetUpgrades: () => void;
}

function createInitialUpgrades(): Record<UpgradeId, Upgrade> {
  const upgrades: Record<UpgradeId, Upgrade> = {} as Record<UpgradeId, Upgrade>;

  for (const [id, def] of Object.entries(UPGRADE_DEFINITIONS)) {
    upgrades[id as UpgradeId] = {
      ...def,
      level: 0, // Start at level 0 (not purchased)
    };
  }

  return upgrades;
}

export const useUpgradeStore = create<UpgradeState>()(
  persist(
    (set, get) => ({
      upgrades: createInitialUpgrades(),

      purchaseUpgrade: (id: UpgradeId) => {
        const state = get();
        const upgrade = state.upgrades[id];

        // Check if maxed
        if (upgrade.level >= upgrade.maxLevel) {
          return false;
        }

        // Just update the level - money deduction happens in the UI
        set((state) => ({
          upgrades: {
            ...state.upgrades,
            [id]: {
              ...state.upgrades[id],
              level: state.upgrades[id].level + 1,
            },
          },
        }));

        return true;
      },

      getUpgradeCost: (id: UpgradeId) => {
        const upgrade = get().upgrades[id];
        if (upgrade.level >= upgrade.maxLevel) {
          return null; // Maxed out
        }
        return upgrade.costs[upgrade.level];
      },

      isMaxLevel: (id: UpgradeId) => {
        const upgrade = get().upgrades[id];
        return upgrade.level >= upgrade.maxLevel;
      },

      // Effect getters
      getRackBonus: () => {
        const level = get().upgrades['bigger-rack'].level;
        return level * 2; // +2 slots per level
      },

      getWaveTimeBonus: () => {
        const level = get().upgrades['patient-customers'].level;
        return level * 15; // +15 seconds per level
      },

      getTipBonus: () => {
        const level = get().upgrades['tip-jar'].level;
        return level; // +1 coin per level
      },

      resetUpgrades: () => {
        set({ upgrades: createInitialUpgrades() });
      },
    }),
    {
      name: 'thea-upgrades',
    }
  )
);
