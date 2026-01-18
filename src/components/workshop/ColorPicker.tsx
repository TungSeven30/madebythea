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
}

export function ColorPicker({ selected, onSelect }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center max-w-[320px]">
      {COLORS.map((color) => (
        <motion.button
          key={color}
          onClick={() => onSelect(color)}
          className={`
            w-16 h-16 rounded-2xl border-4
            transition-all
            ${
              selected === color
                ? 'border-purple-600 scale-110 shadow-lg ring-4 ring-purple-300'
                : 'border-gray-300 hover:border-purple-300'
            }
          `}
          style={{ backgroundColor: COLOR_HEX[color] }}
          whileHover={{ scale: selected === color ? 1.1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
        />
      ))}
    </div>
  );
}
