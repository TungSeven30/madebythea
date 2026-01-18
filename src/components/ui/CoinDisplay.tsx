'use client';

/**
 * Display current coins/money with animation
 */

import { motion, AnimatePresence } from 'framer-motion';

interface CoinDisplayProps {
  amount: number;
  size?: 'small' | 'medium' | 'large';
}

const sizeStyles = {
  small: 'text-lg px-3 py-1',
  medium: 'text-2xl px-4 py-2',
  large: 'text-4xl px-6 py-3',
};

export function CoinDisplay({ amount, size = 'medium' }: CoinDisplayProps) {
  return (
    <div
      className={`
        inline-flex items-center gap-2
        bg-yellow-200 border-4 border-yellow-400 rounded-full
        font-bold text-yellow-800
        ${sizeStyles[size]}
      `}
    >
      <span className="text-yellow-500">🪙</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={amount}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {amount}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
