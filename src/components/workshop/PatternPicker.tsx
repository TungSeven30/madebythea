'use client';

/**
 * Pattern picker for choosing clothing pattern
 */

import { motion } from 'framer-motion';
import type { ClothingPattern } from '@/types';
import { PATTERNS, PATTERN_ICONS } from '@/types';

interface PatternPickerProps {
  selected: ClothingPattern;
  onSelect: (pattern: ClothingPattern) => void;
}

export function PatternPicker({ selected, onSelect }: PatternPickerProps) {
  return (
    <div className="flex gap-3 justify-center">
      {PATTERNS.map((pattern) => (
        <motion.button
          key={pattern}
          onClick={() => onSelect(pattern)}
          className={`
            w-16 h-16 rounded-2xl border-4 text-2xl
            flex items-center justify-center
            transition-all
            ${
              selected === pattern
                ? 'bg-purple-200 border-purple-500 scale-110 shadow-lg'
                : 'bg-white border-gray-300 hover:border-purple-300'
            }
          `}
          whileHover={{ scale: selected === pattern ? 1.1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {PATTERN_ICONS[pattern]}
        </motion.button>
      ))}
    </div>
  );
}
