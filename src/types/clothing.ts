/**
 * Clothing item types for Thea's Clothing Store Game
 */

export type ClothingShape = 'shirt' | 'dress' | 'pants' | 'skirt';

export type ClothingColor =
  | 'pink'
  | 'purple'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'white';

export type ClothingPattern = 'none' | 'stripes' | 'dots' | 'hearts' | 'stars';

export type PriceLevel = 1 | 2 | 3;

export interface DoodleStroke {
  points: Array<{ x: number; y: number }>;
  color: string;
  width: number;
}

export interface ClothingItem {
  id: string;
  shape: ClothingShape;
  color: ClothingColor;
  pattern: ClothingPattern;
  doodles: DoodleStroke[];
  price: PriceLevel;
  createdAt: number;
}

export const SHAPES: ClothingShape[] = ['shirt', 'dress', 'pants', 'skirt'];

export const COLORS: ClothingColor[] = [
  'pink',
  'purple',
  'blue',
  'green',
  'yellow',
  'orange',
  'red',
  'white',
];

export const PATTERNS: ClothingPattern[] = ['none', 'stripes', 'dots', 'hearts', 'stars'];

/**
 * Color hex values for the palette (pastel/bright child-friendly colors)
 */
export const COLOR_HEX: Record<ClothingColor, string> = {
  pink: '#FF9ECD',
  purple: '#C5A3FF',
  blue: '#7EC8FF',
  green: '#7EFFB2',
  yellow: '#FFE57E',
  orange: '#FFB27E',
  red: '#FF7E7E',
  white: '#FFFFFF',
};

/**
 * Display names for patterns (using emoji for child-friendly UI)
 */
export const PATTERN_ICONS: Record<ClothingPattern, string> = {
  none: '✨',
  stripes: '〰️',
  dots: '⚫',
  hearts: '❤️',
  stars: '⭐',
};
