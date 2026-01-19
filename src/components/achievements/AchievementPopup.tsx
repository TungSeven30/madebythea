'use client';

/**
 * AchievementPopup - Full-screen celebration for achievement unlock
 *
 * Shows emoji and celebration animation when an achievement is earned.
 * Auto-dismisses or tap to dismiss.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import type { Achievement } from '@/stores/achievementStore';

interface AchievementPopupProps {
  achievement: Achievement | null;
  onDismiss: () => void;
  autoDismissMs?: number;
}

export function AchievementPopup({
  achievement,
  onDismiss,
  autoDismissMs = 3000,
}: AchievementPopupProps): React.ReactNode {
  // Auto-dismiss after delay
  useEffect(() => {
    if (!achievement) return;

    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [achievement, onDismiss, autoDismissMs]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
        >
          <motion.div
            className="bg-gradient-to-b from-yellow-200 to-yellow-100 rounded-3xl p-8 mx-4 text-center shadow-2xl border-4 border-yellow-400"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Trophy decoration */}
            <motion.div
              className="text-6xl mb-2"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'easeInOut',
              }}
            >
              🏆
            </motion.div>

            {/* Achievement emoji */}
            <motion.div
              className="text-8xl mb-4"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: 3,
              }}
            >
              {achievement.emoji}
            </motion.div>

            {/* Stars decoration */}
            <div className="flex justify-center gap-2 mb-4">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="text-4xl"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.2,
                    repeat: Infinity,
                  }}
                >
                  ⭐
                </motion.span>
              ))}
            </div>

            {/* Tap to continue hint */}
            <motion.p
              className="text-yellow-700 text-lg"
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
