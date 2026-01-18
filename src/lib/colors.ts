/**
 * Color utilities for Thea's Clothing Store Game
 */

import { ClothingColor, COLOR_HEX } from '@/types';

/**
 * Get the hex color value for a clothing color
 */
export function getColorHex(color: ClothingColor): string {
  return COLOR_HEX[color];
}

/**
 * Background colors for the game UI (pastel theme)
 */
export const UI_COLORS = {
  primary: '#FFB6C1', // Light pink
  secondary: '#E6E6FA', // Lavender
  accent: '#87CEEB', // Sky blue
  success: '#98FB98', // Pale green
  warning: '#FFE4B5', // Moccasin
  background: '#FFF5EE', // Seashell
  cardBg: '#FFFFFF',
  text: '#4A4A4A',
  textLight: '#6B6B6B',
};

/**
 * Gradient backgrounds for different screens
 */
export const GRADIENTS = {
  home: 'linear-gradient(135deg, #FFB6C1 0%, #E6E6FA 100%)',
  workshop: 'linear-gradient(135deg, #E6E6FA 0%, #87CEEB 100%)',
  store: 'linear-gradient(135deg, #FFE4B5 0%, #FFB6C1 100%)',
  results: 'linear-gradient(135deg, #98FB98 0%, #87CEEB 100%)',
};
