'use client';

/**
 * CoinBurst - Animated coin effect
 *
 * Shows floating coins with the amount earned.
 * Used after successful sales.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CoinBurstProps {
  /** Amount to display */
  amount: number;
  /** Whether to show the animation */
  show: boolean;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Duration in milliseconds */
  duration?: number;
}

interface FloatingCoin {
  id: number;
  x: number;
  delay: number;
}

export function CoinBurst({
  amount,
  show,
  onComplete,
  duration = 1500,
}: CoinBurstProps): React.ReactNode {
  const [coins, setCoins] = useState<FloatingCoin[]>([]);

  useEffect(() => {
    if (show) {
      // Generate random floating coins
      const newCoins = Array.from({ length: Math.min(amount, 10) }, (_, i) => ({
        id: i,
        x: -20 + Math.random() * 40, // -20 to +20 offset
        delay: i * 0.1,
      }));
      setCoins(newCoins);

      // Call completion callback
      const timer = setTimeout(() => {
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setCoins([]);
    }
  }, [show, amount, duration, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {/* Floating coins */}
          {coins.map((coin) => (
            <motion.div
              key={coin.id}
              className="absolute text-4xl"
              initial={{ y: 0, x: coin.x, opacity: 1, scale: 0 }}
              animate={{
                y: -150,
                opacity: [1, 1, 0],
                scale: [0, 1.2, 1],
                rotate: [-10, 10, -10],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: duration / 1000,
                delay: coin.delay,
                ease: 'easeOut',
              }}
            >
              🪙
            </motion.div>
          ))}

          {/* Amount display */}
          <motion.div
            className="text-5xl font-bold text-yellow-500 drop-shadow-lg"
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: [0, 1.3, 1], y: [20, -30, -50] }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.8, ease: 'backOut' }}
          >
            +{amount}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
