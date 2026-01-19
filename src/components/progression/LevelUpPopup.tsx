'use client';

/**
 * LevelUpPopup - Celebration screen for leveling up
 *
 * Shows new level with celebration animation.
 * Auto-dismisses or tap to dismiss.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface LevelUpPopupProps {
  level: number | null;
  onDismiss: () => void;
  autoDismissMs?: number;
}

export function LevelUpPopup({
  level,
  onDismiss,
  autoDismissMs = 4000,
}: LevelUpPopupProps): React.ReactNode {
  // Auto-dismiss after delay
  useEffect(() => {
    if (level === null) return;

    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [level, onDismiss, autoDismissMs]);

  return (
    <AnimatePresence>
      {level !== null && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
        >
          <motion.div
            className="bg-gradient-to-b from-purple-200 via-purple-100 to-yellow-100 rounded-3xl p-8 mx-4 text-center shadow-2xl border-4 border-yellow-400"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stars burst */}
            <div className="relative h-20 mb-4">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2 text-4xl"
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  animate={{
                    x: Math.cos((i / 8) * Math.PI * 2) * 80,
                    y: Math.sin((i / 8) * Math.PI * 2) * 80,
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  ⭐
                </motion.div>
              ))}

              {/* Center star */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  scale: { repeat: Infinity, duration: 1 },
                  rotate: { repeat: Infinity, duration: 3, ease: 'linear' },
                }}
              >
                ⭐
              </motion.div>
            </div>

            {/* Level up text */}
            <motion.div
              className="text-3xl font-bold text-purple-600 mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              LEVEL UP!
            </motion.div>

            {/* New level */}
            <motion.div
              className="text-8xl font-bold text-yellow-500 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              {level}
            </motion.div>

            {/* Encouragement */}
            <motion.p
              className="text-purple-600 text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Amazing! Keep going! 🎉
            </motion.p>

            {/* Tap hint */}
            <motion.p
              className="text-purple-400 text-sm mt-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              👆 Tap to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
