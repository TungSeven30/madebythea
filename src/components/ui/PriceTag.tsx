'use client';

/**
 * Visual price tag showing $, $$, or $$$
 */

import { motion } from 'framer-motion';
import type { PriceLevel } from '@/types';

interface PriceTagProps {
  price: PriceLevel;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  selected?: boolean;
}

const sizeStyles = {
  small: 'text-lg px-2 py-1',
  medium: 'text-xl px-3 py-2',
  large: 'text-2xl px-4 py-3',
};

const priceDisplay: Record<PriceLevel, string> = {
  1: '$',
  2: '$$',
  3: '$$$',
};

export function PriceTag({
  price,
  size = 'medium',
  onClick,
  selected = false,
}: PriceTagProps) {
  const Component = onClick ? motion.button : motion.span;

  return (
    <Component
      onClick={onClick}
      className={`
        inline-block rounded-full font-bold
        ${sizeStyles[size]}
        ${
          selected
            ? 'bg-green-300 border-4 border-green-500 text-green-800'
            : 'bg-green-100 border-2 border-green-300 text-green-600'
        }
        ${onClick ? 'cursor-pointer' : ''}
      `}
      whileHover={onClick ? { scale: 1.1 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
    >
      {priceDisplay[price]}
    </Component>
  );
}
