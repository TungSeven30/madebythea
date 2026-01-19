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
  /** List of unlocked patterns. If not provided, all patterns are available. */
  unlockedPatterns?: ClothingPattern[];
}

export function PatternPicker({ selected, onSelect, unlockedPatterns }: PatternPickerProps) {
  // Use all patterns if no unlock list provided
  const availablePatterns = unlockedPatterns ?? PATTERNS;

  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {PATTERNS.map((pattern) => {
        const isUnlocked = availablePatterns.includes(pattern);

        return (
          <motion.button
            key={pattern}
            onClick={() => isUnlocked && onSelect(pattern)}
            disabled={!isUnlocked}
            className={`
              w-16 h-16 rounded-2xl border-4 text-2xl relative
              flex items-center justify-center
              transition-all
              ${
                selected === pattern
                  ? 'bg-purple-200 border-purple-500 scale-110 shadow-lg'
                  : isUnlocked
                  ? 'bg-white border-gray-300 hover:border-purple-300'
                  : 'bg-gray-100 border-gray-200 opacity-40 cursor-not-allowed'
              }
            `}
            whileHover={isUnlocked ? { scale: selected === pattern ? 1.1 : 1.05 } : {}}
            whileTap={isUnlocked ? { scale: 0.95 } : {}}
          >
            {isUnlocked ? (
              PATTERN_ICONS[pattern]
            ) : (
              <span className="text-xl">🔒</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
