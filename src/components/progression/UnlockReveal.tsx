'use client';

/**
 * UnlockReveal - Shows newly unlocked colors or patterns
 *
 * Displays one unlock at a time with celebration animation.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { COLOR_HEX, PATTERN_ICONS } from '@/types/clothing';
import type { PendingUnlock } from '@/stores/gameStore';

interface UnlockRevealProps {
  unlock: PendingUnlock | null;
  onDismiss: () => void;
  autoDismissMs?: number;
}

export function UnlockReveal({
  unlock,
  onDismiss,
  autoDismissMs = 2500,
}: UnlockRevealProps): React.ReactNode {
  // Auto-dismiss after delay
  useEffect(() => {
    if (unlock === null) return;

    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [unlock, onDismiss, autoDismissMs]);

  const isColor = unlock?.type === 'color';
  const colorHex = isColor && unlock ? COLOR_HEX[unlock.value as keyof typeof COLOR_HEX] : undefined;
  const patternIcon = !isColor && unlock ? PATTERN_ICONS[unlock.value as keyof typeof PATTERN_ICONS] : undefined;

  return (
    <AnimatePresence>
      {unlock && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 mx-4 text-center shadow-2xl border-4 border-purple-400"
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -50 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* New label */}
            <motion.div
              className="text-purple-500 font-bold text-xl mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              ✨ NEW UNLOCK! ✨
            </motion.div>

            {/* Color unlock */}
            {isColor && colorHex && (
              <motion.div
                className="w-24 h-24 mx-auto rounded-2xl border-4 border-gray-300 mb-4"
                style={{ backgroundColor: colorHex }}
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              />
            )}

            {/* Pattern unlock */}
            {!isColor && patternIcon && (
              <motion.div
                className="text-8xl mb-4"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                {patternIcon}
              </motion.div>
            )}

            {/* Type label */}
            <motion.p
              className="text-gray-600 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {isColor ? '🎨 New Color!' : '✨ New Pattern!'}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
