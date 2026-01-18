'use client';

/**
 * Shape selector for choosing clothing type
 */

import { motion } from 'framer-motion';
import type { ClothingShape } from '@/types';

interface ShapeSelectorProps {
  selected: ClothingShape;
  onSelect: (shape: ClothingShape) => void;
}

interface ShapeOption {
  shape: ClothingShape;
  emoji: string;
}

const shapes: ShapeOption[] = [
  { shape: 'shirt', emoji: '👕' },
  { shape: 'dress', emoji: '👗' },
  { shape: 'pants', emoji: '👖' },
  { shape: 'skirt', emoji: '🩱' },
];

export function ShapeSelector({ selected, onSelect }: ShapeSelectorProps) {
  return (
    <div className="flex gap-4 justify-center">
      {shapes.map(({ shape, emoji }) => (
        <motion.button
          key={shape}
          onClick={() => onSelect(shape)}
          className={`
            w-20 h-20 rounded-2xl border-4 text-4xl
            flex items-center justify-center
            transition-all
            ${
              selected === shape
                ? 'bg-purple-200 border-purple-500 scale-110 shadow-lg'
                : 'bg-white border-gray-300 hover:border-purple-300'
            }
          `}
          whileHover={{ scale: selected === shape ? 1.1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {emoji}
        </motion.button>
      ))}
    </div>
  );
}
