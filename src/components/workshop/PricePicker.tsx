'use client';

/**
 * Price picker for setting clothing price level
 */

import { motion } from 'framer-motion';
import type { PriceLevel } from '@/types';

interface PricePickerProps {
  selected: PriceLevel;
  onSelect: (price: PriceLevel) => void;
}

const prices: { level: PriceLevel; display: string; coins: number }[] = [
  { level: 1, display: '$', coins: 5 },
  { level: 2, display: '$$', coins: 10 },
  { level: 3, display: '$$$', coins: 15 },
];

export function PricePicker({ selected, onSelect }: PricePickerProps) {
  return (
    <div className="flex gap-4 justify-center">
      {prices.map(({ level, display, coins }) => (
        <motion.button
          key={level}
          onClick={() => onSelect(level)}
          className={`
            px-6 py-4 rounded-2xl border-4 text-xl font-bold
            flex flex-col items-center gap-1
            transition-all
            ${
              selected === level
                ? 'bg-green-200 border-green-500 scale-110 shadow-lg'
                : 'bg-white border-gray-300 hover:border-green-300'
            }
          `}
          whileHover={{ scale: selected === level ? 1.1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-green-600">{display}</span>
          <span className="text-sm text-gray-500">🪙 {coins}</span>
        </motion.button>
      ))}
    </div>
  );
}
