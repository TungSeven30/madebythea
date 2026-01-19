/**
 * Tutorial Store - Tracks which tutorials have been completed
 *
 * Tutorials are visual-only (no reading) and show on first visit
 * to each major feature.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tutorial IDs for each feature
export type TutorialId =
  | 'workshop-intro'      // First time in workshop
  | 'workshop-color'      // How to pick colors
  | 'workshop-pattern'    // How to pick patterns
  | 'workshop-draw'       // How to draw on clothes
  | 'store-intro'         // First time in store
  | 'store-select'        // How to select clothes
  | 'store-sell'          // How to sell to customers
  | 'upgrades-intro'      // First time in upgrades
  | 'home-navigation';    // First time - show buttons

export interface TutorialStep {
  id: string;
  targetSelector?: string;  // CSS selector for spotlight
  emoji: string;            // Emoji to show
  gesture?: 'tap' | 'swipe' | 'hold';  // Gesture indicator type
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

// Tutorial definitions with steps
export const TUTORIAL_DEFINITIONS: Record<TutorialId, TutorialStep[]> = {
  'workshop-intro': [
    { id: 'welcome', emoji: '🎨', position: 'center' },
  ],
  'workshop-color': [
    { id: 'pick-color', emoji: '🌈', gesture: 'tap', position: 'bottom' },
  ],
  'workshop-pattern': [
    { id: 'pick-pattern', emoji: '⭐', gesture: 'tap', position: 'bottom' },
  ],
  'workshop-draw': [
    { id: 'draw', emoji: '✏️', gesture: 'swipe', position: 'center' },
  ],
  'store-intro': [
    { id: 'welcome', emoji: '🏪', position: 'center' },
  ],
  'store-select': [
    { id: 'select-clothes', emoji: '👕', gesture: 'tap', position: 'bottom' },
  ],
  'store-sell': [
    { id: 'sell', emoji: '👤', gesture: 'tap', position: 'top' },
  ],
  'upgrades-intro': [
    { id: 'welcome', emoji: '🛠️', position: 'center' },
    { id: 'hold-to-buy', emoji: '👆', gesture: 'hold', position: 'center' },
  ],
  'home-navigation': [
    { id: 'workshop', emoji: '🎨', gesture: 'tap', position: 'center' },
  ],
};

interface TutorialState {
  // Which tutorials have been completed
  completedTutorials: Set<TutorialId>;

  // Currently active tutorial (if any)
  activeTutorial: TutorialId | null;
  activeStepIndex: number;

  // Actions
  startTutorial: (id: TutorialId) => void;
  nextStep: () => boolean;  // Returns false if tutorial finished
  skipTutorial: () => void;
  completeTutorial: (id: TutorialId) => void;
  hasCompleted: (id: TutorialId) => boolean;
  shouldShowTutorial: (id: TutorialId) => boolean;

  // Reset (for testing)
  resetTutorials: () => void;
}

export const useTutorialStore = create<TutorialState>()(
  persist(
    (set, get) => ({
      completedTutorials: new Set(),
      activeTutorial: null,
      activeStepIndex: 0,

      startTutorial: (id: TutorialId) => {
        if (get().completedTutorials.has(id)) return;
        set({ activeTutorial: id, activeStepIndex: 0 });
      },

      nextStep: () => {
        const state = get();
        if (!state.activeTutorial) return false;

        const steps = TUTORIAL_DEFINITIONS[state.activeTutorial];
        const nextIndex = state.activeStepIndex + 1;

        if (nextIndex >= steps.length) {
          // Tutorial finished
          set((s) => ({
            completedTutorials: new Set([...Array.from(s.completedTutorials), state.activeTutorial!]),
            activeTutorial: null,
            activeStepIndex: 0,
          }));
          return false;
        }

        set({ activeStepIndex: nextIndex });
        return true;
      },

      skipTutorial: () => {
        const state = get();
        if (!state.activeTutorial) return;

        set((s) => ({
          completedTutorials: new Set([...Array.from(s.completedTutorials), state.activeTutorial!]),
          activeTutorial: null,
          activeStepIndex: 0,
        }));
      },

      completeTutorial: (id: TutorialId) => {
        set((s) => ({
          completedTutorials: new Set([...Array.from(s.completedTutorials), id]),
        }));
      },

      hasCompleted: (id: TutorialId) => {
        return get().completedTutorials.has(id);
      },

      shouldShowTutorial: (id: TutorialId) => {
        return !get().completedTutorials.has(id);
      },

      resetTutorials: () => {
        set({
          completedTutorials: new Set(),
          activeTutorial: null,
          activeStepIndex: 0,
        });
      },
    }),
    {
      name: 'thea-tutorials',
      // Custom serialization for Set
      partialize: (state) => ({
        completedTutorials: Array.from(state.completedTutorials),
      }),
      merge: (persisted, current) => ({
        ...current,
        completedTutorials: new Set((persisted as { completedTutorials: TutorialId[] }).completedTutorials || []),
      }),
    }
  )
);
