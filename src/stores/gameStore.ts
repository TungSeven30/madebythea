/**
 * Game Store - Manages game state (money, waves, settings, results)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ClothingItem, Customer } from '@/types';

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

  // Settings
  settings: GameSettings;

  // Actions
  addMoney: (amount: number) => void;
  startWave: () => void;
  endWave: (result: WaveResult) => void;
  recordSale: (sale: SaleRecord) => void;

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
      settings: initialSettings,

      addMoney: (amount: number) => {
        set((state) => ({
          totalMoney: state.totalMoney + amount,
        }));
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
          settings: initialSettings,
        });
      },
    }),
    {
      name: 'thea-game',
    }
  )
);
