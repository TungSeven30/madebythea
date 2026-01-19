'use client';

/**
 * XPBar - Visual display of current XP and level progress
 *
 * Shows current level, XP bar, and stars indicator.
 * Designed to be compact and child-friendly.
 */

import { motion } from 'framer-motion';
import { useGameStore, LEVEL_THRESHOLDS } from '@/stores/gameStore';

interface XPBarProps {
  size?: 'small' | 'medium' | 'large';
  showLevel?: boolean;
}

const sizeStyles = {
  small: {
    container: 'h-6',
    bar: 'h-3',
    levelText: 'text-sm',
    starSize: 'text-lg',
  },
  medium: {
    container: 'h-10',
    bar: 'h-4',
    levelText: 'text-lg',
    starSize: 'text-2xl',
  },
  large: {
    container: 'h-14',
    bar: 'h-5',
    levelText: 'text-2xl',
    starSize: 'text-3xl',
  },
};

export function XPBar({
  size = 'medium',
  showLevel = true,
}: XPBarProps): React.ReactNode {
  const xp = useGameStore((state) => state.xp);
  const level = useGameStore((state) => state.level);
  const styles = sizeStyles[size];

  // Calculate progress to next level
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const xpInLevel = xp - currentThreshold;
  const xpNeeded = nextThreshold - currentThreshold;
  const progressPercent = Math.min((xpInLevel / xpNeeded) * 100, 100);

  // Check if max level
  const isMaxLevel = level >= LEVEL_THRESHOLDS.length;

  return (
    <div className={`flex items-center gap-2 ${styles.container}`}>
      {/* Level indicator */}
      {showLevel && (
        <motion.div
          className={`flex items-center gap-1 font-bold text-yellow-600 ${styles.levelText}`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className={styles.starSize}>⭐</span>
          <span>{level}</span>
        </motion.div>
      )}

      {/* XP bar */}
      <div className="flex-1 relative">
        <div className={`bg-gray-200 rounded-full ${styles.bar} overflow-hidden border-2 border-yellow-400`}>
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: isMaxLevel ? '100%' : `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Sparkle effect at progress tip */}
        {!isMaxLevel && progressPercent > 10 && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 text-xs"
            style={{ left: `${progressPercent}%` }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            ✨
          </motion.div>
        )}
      </div>

      {/* Max level indicator */}
      {isMaxLevel && (
        <motion.span
          className="text-yellow-500"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🏆
        </motion.span>
      )}
    </div>
  );
}

/**
 * Compact XP display for header areas
 */
export function XPDisplay(): React.ReactNode {
  const xp = useGameStore((state) => state.xp);
  const level = useGameStore((state) => state.level);

  return (
    <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl px-3 py-1 flex items-center gap-2">
      <motion.span
        className="text-xl"
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
      >
        ⭐
      </motion.span>
      <span className="font-bold text-yellow-700">{level}</span>
      <span className="text-yellow-500 text-sm">({xp} XP)</span>
    </div>
  );
}
