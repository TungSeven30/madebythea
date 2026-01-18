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
 * All customers (only those with images for now)
 */
export const ALL_CUSTOMERS: Customer[] = [...FAMILY_CUSTOMERS];
