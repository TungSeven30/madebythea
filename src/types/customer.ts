/**
 * Customer types for Thea's Clothing Store Game
 */

import type { ClothingShape, ClothingColor, PriceLevel } from './clothing';

export type CustomerType = 'family' | 'friend' | 'creature';

export interface CustomerPreference {
  shapes?: ClothingShape[];
  colors?: ClothingColor[];
  patterns?: string[];
  maxPrice: PriceLevel;
}

export interface Customer {
  type: CustomerType;
  id: string;
  displayName: string;
  avatar: string;
  wants: CustomerPreference;
}

/**
 * Customer mood state - changes based on patience
 */
export type CustomerMood = 'happy' | 'neutral' | 'impatient';

/**
 * Customer modifiers for special customers
 */
export interface CustomerModifiers {
  isVIP?: boolean;      // 2x pay, gold border
  groupSize?: number;   // Buys multiple items (future)
}

/**
 * Make-to-order state for customers waiting for custom items
 */
export interface MakeToOrderState {
  isWaitingForOrder: boolean;
  orderStartedAt: number;  // Timestamp when order started
}

/**
 * Runtime customer state - used during gameplay
 */
export interface RuntimeCustomer extends Customer {
  mood: CustomerMood;
  patience: number;       // 0-100, decreases over time
  maxPatience: number;    // Starting patience
  modifiers: CustomerModifiers;
  makeToOrder?: MakeToOrderState;  // Present when customer is reserved for make-to-order
}

/**
 * Create a runtime customer from a static customer definition
 */
export function createRuntimeCustomer(
  customer: Customer,
  modifiers: CustomerModifiers = {}
): RuntimeCustomer {
  const maxPatience = modifiers.isVIP ? 80 : 100; // VIPs are more demanding
  return {
    ...customer,
    mood: 'happy',
    patience: maxPatience,
    maxPatience,
    modifiers,
  };
}

/**
 * Calculate mood based on patience level
 */
export function getMoodFromPatience(patience: number): CustomerMood {
  if (patience > 60) return 'happy';
  if (patience > 30) return 'neutral';
  return 'impatient';
}

/**
 * Family members - will use stylized photos
 */
export const FAMILY_CUSTOMERS: Customer[] = [
  {
    type: 'family',
    id: 'ollie',
    displayName: 'Ollie',
    avatar: '/images/customers/family/ollie.png',
    wants: { shapes: ['shirt', 'pants'], maxPrice: 2 },
  },
  {
    type: 'family',
    id: 'mommy',
    displayName: 'Mommy',
    avatar: '/images/customers/family/mommy.png',
    wants: { shapes: ['dress', 'skirt'], colors: ['pink', 'purple', 'blue'], maxPrice: 3 },
  },
  {
    type: 'family',
    id: 'daddy',
    displayName: 'Daddy',
    avatar: '/images/customers/family/daddy.png',
    wants: { shapes: ['shirt', 'pants'], colors: ['blue', 'green'], maxPrice: 3 },
  },
  {
    type: 'family',
    id: 'ba-noi',
    displayName: 'Ba Noi',
    avatar: '/images/customers/family/ba-noi.png',
    wants: { shapes: ['dress', 'skirt'], maxPrice: 3 },
  },
  {
    type: 'family',
    id: 'ba-ngoai',
    displayName: 'Ba Ngoai',
    avatar: '/images/customers/family/ba-ngoai.png',
    wants: { shapes: ['dress', 'skirt'], maxPrice: 3 },
  },
  {
    type: 'family',
    id: 'auntie-thy',
    displayName: 'Auntie Thy',
    avatar: '/images/customers/family/auntie-thy.png',
    wants: { shapes: ['dress', 'skirt'], colors: ['pink', 'purple'], maxPrice: 3 },
  },
  {
    type: 'family',
    id: 'uncle-will',
    displayName: 'Uncle Will',
    avatar: '/images/customers/family/uncle-will.png',
    wants: { shapes: ['shirt', 'pants'], maxPrice: 2 },
  },
];

/**
 * Creature customers - magical friends!
 */
export const CREATURE_CUSTOMERS: Customer[] = [
  {
    type: 'creature',
    id: 'unicorn',
    displayName: 'Sparkle',
    avatar: '🦄',  // Emoji avatar for creatures
    wants: { colors: ['pink', 'purple', 'white'], maxPrice: 3 },
  },
  {
    type: 'creature',
    id: 'dragon',
    displayName: 'Blaze',
    avatar: '🐉',
    wants: { colors: ['red', 'orange', 'yellow'], maxPrice: 3 },
  },
  {
    type: 'creature',
    id: 'bunny',
    displayName: 'Fluffy',
    avatar: '🐰',
    wants: { colors: ['white', 'pink', 'blue'], maxPrice: 2 },
  },
  {
    type: 'creature',
    id: 'cat',
    displayName: 'Whiskers',
    avatar: '🐱',
    wants: { shapes: ['dress', 'skirt'], maxPrice: 2 },
  },
  {
    type: 'creature',
    id: 'bear',
    displayName: 'Honey',
    avatar: '🧸',
    wants: { colors: ['yellow', 'orange', 'red'], maxPrice: 2 },
  },
];

/**
 * All customers
 */
export const ALL_CUSTOMERS: Customer[] = [...FAMILY_CUSTOMERS, ...CREATURE_CUSTOMERS];
