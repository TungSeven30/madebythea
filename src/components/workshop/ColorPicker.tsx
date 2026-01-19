'use client';

/**
 * Color picker for choosing clothing color
 */

import { motion } from 'framer-motion';
import type { ClothingColor } from '@/types';
import { COLORS, COLOR_HEX } from '@/types';

interface ColorPickerProps {
  selected: ClothingColor;
  onSelect: (color: ClothingColor) => void;
  /** List of unlocked colors. If not provided, all colors are available. */
  unlockedColors?: ClothingColor[];
}

export function ColorPicker({ selected, onSelect, unlockedColors }: ColorPickerProps) {
  // Use all colors if no unlock list provided
  const availableColors = unlockedColors ?? COLORS;

  return (
    <div className="flex flex-wrap gap-3 justify-center max-w-[320px]">
      {COLORS.map((color) => {
        const isUnlocked = availableColors.includes(color);

        return (
          <motion.button
            key={color}
            onClick={() => isUnlocked && onSelect(color)}
            disabled={!isUnlocked}
            className={`
              w-16 h-16 rounded-2xl border-4 relative
              transition-all
              ${
                selected === color
                  ? 'border-purple-600 scale-110 shadow-lg ring-4 ring-purple-300'
                  : isUnlocked
                  ? 'border-gray-300 hover:border-purple-300'
                  : 'border-gray-200 opacity-40 cursor-not-allowed'
              }
            `}
            style={{ backgroundColor: COLOR_HEX[color] }}
            whileHover={isUnlocked ? { scale: selected === color ? 1.1 : 1.05 } : {}}
            whileTap={isUnlocked ? { scale: 0.95 } : {}}
          >
            {/* Lock icon for locked colors */}
            {!isUnlocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
