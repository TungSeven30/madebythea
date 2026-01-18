/**
 * Matching logic for customer purchases
 */

import type { ClothingItem, Customer, CustomerPreference } from '@/types';

export interface MatchResult {
  matches: boolean;
  reason?: string;
}

/**
 * Check if a clothing item matches a customer's preferences
 */
export function doesItemMatchCustomer(item: ClothingItem, customer: Customer): MatchResult {
  const { wants } = customer;

  // Check price first
  if (item.price > wants.maxPrice) {
    return {
      matches: false,
      reason: 'Too expensive!',
    };
  }

  // Check shape preference
  if (wants.shapes && wants.shapes.length > 0) {
    if (!wants.shapes.includes(item.shape)) {
      return {
        matches: false,
        reason: `Wanted ${wants.shapes.join(' or ')}`,
      };
    }
  }

  // Check color preference
  if (wants.colors && wants.colors.length > 0) {
    if (!wants.colors.includes(item.color)) {
      return {
        matches: false,
        reason: `Wanted ${wants.colors.join(' or ')} color`,
      };
    }
  }

  // Check pattern preference (if specified)
  if (wants.patterns && wants.patterns.length > 0) {
    if (!wants.patterns.includes(item.pattern)) {
      return {
        matches: false,
        reason: `Wanted ${wants.patterns.join(' or ')} pattern`,
      };
    }
  }

  return { matches: true };
}

/**
 * Calculate the actual price in coins based on price level
 */
export function getPriceInCoins(priceLevel: 1 | 2 | 3): number {
  const priceMap: Record<1 | 2 | 3, number> = {
    1: 5,
    2: 10,
    3: 15,
  };
  return priceMap[priceLevel];
}

/**
 * Get a random preference hint to display in thought bubble
 */
export function getPreferenceHint(wants: CustomerPreference): string {
  const hints: string[] = [];

  if (wants.shapes && wants.shapes.length > 0) {
    hints.push(wants.shapes[Math.floor(Math.random() * wants.shapes.length)]);
  }

  if (wants.colors && wants.colors.length > 0) {
    hints.push(wants.colors[Math.floor(Math.random() * wants.colors.length)]);
  }

  if (hints.length === 0) {
    return 'anything!';
  }

  return hints.join(' ');
}

/**
 * Select random customers for a wave
 */
export function selectRandomCustomers(
  allCustomers: Customer[],
  count: number
): Customer[] {
  const shuffled = [...allCustomers].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
