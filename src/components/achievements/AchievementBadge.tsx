'use client';

/**
 * AchievementBadge - Display a single achievement
 *
 * Shows emoji, progress bar, and locked/unlocked state.
 * Designed to be visual-only (no reading required).
 */

import { motion } from 'framer-motion';
import type { Achievement } from '@/stores/achievementStore';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
  onClick?: () => void;
}

const sizeStyles = {
  small: {
    container: 'w-16 h-16',
    emoji: 'text-3xl',
    progress: 'h-1',
  },
  medium: {
    container: 'w-24 h-24',
    emoji: 'text-5xl',
    progress: 'h-1.5',
  },
  large: {
    container: 'w-32 h-32',
    emoji: 'text-7xl',
    progress: 'h-2',
  },
};

export function AchievementBadge({
  achievement,
  size = 'medium',
  showProgress = true,
  onClick,
}: AchievementBadgeProps): React.ReactNode {
  const isUnlocked = achievement.unlockedAt !== undefined;
  const progressPercent = Math.min(
    (achievement.progress / achievement.requirement) * 100,
    100
  );
  const styles = sizeStyles[size];

  return (
    <motion.button
      className={`
        ${styles.container}
        rounded-2xl border-4 flex flex-col items-center justify-center
        transition-all relative overflow-hidden
        ${isUnlocked
          ? 'bg-yellow-100 border-yellow-400 shadow-lg cursor-pointer'
          : 'bg-gray-100 border-gray-300 cursor-default'
        }
        ${onClick ? 'hover:scale-105 active:scale-95' : ''}
      `}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      disabled={!onClick}
    >
      {/* Emoji */}
      <motion.span
        className={`${styles.emoji} ${isUnlocked ? '' : 'grayscale opacity-40'}`}
        animate={isUnlocked ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
      >
        {achievement.emoji}
      </motion.span>

      {/* Progress bar */}
      {showProgress && !isUnlocked && (
        <div className={`absolute bottom-2 left-2 right-2 ${styles.progress} bg-gray-200 rounded-full overflow-hidden`}>
          <motion.div
            className="h-full bg-yellow-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Unlocked shine effect */}
      {isUnlocked && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            repeatDelay: 2,
          }}
        />
      )}

      {/* Lock icon for locked achievements */}
      {!isUnlocked && (
        <div className="absolute top-1 right-1 text-xs opacity-50">
          🔒
        </div>
      )}
    </motion.button>
  );
}
