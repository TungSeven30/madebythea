/**
 * Inventory Store - Manages clothing items created in the workshop
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ClothingItem } from '@/types';

interface InventoryState {
  items: ClothingItem[];
  addItem: (item: ClothingItem) => void;
  removeItem: (id: string) => void;
  removeItems: (ids: string[]) => void;
  getItem: (id: string) => ClothingItem | undefined;
  clearInventory: () => void;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: ClothingItem) => {
        set((state) => ({
          items: [...state.items, item],
        }));
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      removeItems: (ids: string[]) => {
        set((state) => ({
          items: state.items.filter((item) => !ids.includes(item.id)),
        }));
      },

      getItem: (id: string) => {
        return get().items.find((item) => item.id === id);
      },

      clearInventory: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'thea-inventory',
    }
  )
);
