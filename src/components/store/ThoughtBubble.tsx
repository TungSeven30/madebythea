'use client';

/**
 * Thought bubble showing what a customer wants
 */

import { motion } from 'framer-motion';
import type { CustomerPreference } from '@/types';
import { COLOR_HEX } from '@/types';

interface ThoughtBubbleProps {
  wants: CustomerPreference;
}

const shapeEmojis: Record<string, string> = {
  shirt: '👕',
  dress: '👗',
  pants: '👖',
  skirt: '🩱',
};

export function ThoughtBubble({ wants }: ThoughtBubbleProps) {
  return (
    <motion.div
      className="relative bg-white rounded-2xl border-4 border-gray-300 px-4 py-2 shadow-lg"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Bubble pointer */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
      </div>
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
        <div className="w-0 h-0 border-l-10 border-r-10 border-t-10 border-l-transparent border-r-transparent border-t-gray-300" />
      </div>

      {/* Content */}
      <div className="flex items-center gap-2 text-xl">
        <span>💭</span>

        {/* Shapes wanted */}
        {wants.shapes && wants.shapes.length > 0 && (
          <div className="flex gap-1">
            {wants.shapes.slice(0, 2).map((shape) => (
              <span key={shape}>{shapeEmojis[shape]}</span>
            ))}
          </div>
        )}

        {/* Colors wanted */}
        {wants.colors && wants.colors.length > 0 && (
          <div className="flex gap-1">
            {wants.colors.slice(0, 3).map((color) => (
              <div
                key={color}
                className="w-5 h-5 rounded-full border-2 border-gray-400"
                style={{ backgroundColor: COLOR_HEX[color] }}
              />
            ))}
          </div>
        )}

        {/* Price limit */}
        <span className="text-green-600 font-bold">
          {'$'.repeat(wants.maxPrice)}
        </span>
      </div>
    </motion.div>
  );
}
