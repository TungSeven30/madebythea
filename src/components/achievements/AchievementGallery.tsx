'use client';

/**
 * AchievementGallery - Grid display of all achievements
 *
 * Shows all achievements with their locked/unlocked states.
 * Used in a modal or dedicated page.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useAchievementStore } from '@/stores/achievementStore';
import { AchievementBadge } from './AchievementBadge';
import { GameCard } from '@/components/ui';

interface AchievementGalleryProps {
  show: boolean;
  onClose: () => void;
}

export function AchievementGallery({
  show,
  onClose,
}: AchievementGalleryProps): React.ReactNode {
  const achievements = useAchievementStore((state) => state.achievements);
  const getUnlockedCount = useAchievementStore((state) => state.getUnlockedCount);
  const getTotalCount = useAchievementStore((state) => state.getTotalCount);

  const unlockedCount = getUnlockedCount();
  const totalCount = getTotalCount();

  // Sort achievements: unlocked first, then by ID
  const sortedAchievements = Object.values(achievements).sort((a, b) => {
    if (a.unlockedAt && !b.unlockedAt) return -1;
    if (!a.unlockedAt && b.unlockedAt) return 1;
    return a.id.localeCompare(b.id);
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-lg max-h-[80vh] overflow-hidden"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <GameCard className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-purple-600 flex items-center gap-2">
                  🏆 Trophies
                </h2>
                <div className="text-lg text-purple-500">
                  {unlockedCount}/{totalCount}
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-3 bg-gray-200 rounded-full mb-6 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>

              {/* Achievement grid */}
              <div className="grid grid-cols-4 gap-3 overflow-y-auto flex-1 pb-4">
                {sortedAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <AchievementBadge
                      achievement={achievement}
                      size="small"
                      showProgress={true}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Close button */}
              <motion.button
                className="mt-4 bg-purple-300 hover:bg-purple-400 border-4 border-purple-500 rounded-2xl px-6 py-3 font-bold text-xl w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
              >
                ✓ Done
              </motion.button>
            </GameCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * TrophyButton - Button to open the achievement gallery
 */
interface TrophyButtonProps {
  onClick: () => void;
}

export function TrophyButton({ onClick }: TrophyButtonProps): React.ReactNode {
  const getUnlockedCount = useAchievementStore((state) => state.getUnlockedCount);

  const unlockedCount = getUnlockedCount();

  return (
    <motion.button
      className="relative bg-yellow-200 hover:bg-yellow-300 border-4 border-yellow-400 rounded-2xl px-4 py-2 font-bold shadow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <span className="text-3xl">🏆</span>
      <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
        {unlockedCount}
      </span>
    </motion.button>
  );
}
