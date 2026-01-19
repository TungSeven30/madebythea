'use client';

/**
 * Home Screen - Main menu for Made by Thea
 */

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BigButton, CoinDisplay, GameCard } from '@/components/ui';
import { AchievementGallery, TrophyButton, AchievementPopup } from '@/components/achievements';
import { XPBar, LevelUpPopup, UnlockReveal } from '@/components/progression';
import { useGameStore, useInventoryStore, useAchievementStore, useTutorialStore, type PendingUnlock } from '@/stores';
import { useHydration } from '@/lib/useHydration';
import { useAudio } from '@/hooks/useAudio';
import { useParticles } from '@/hooks/useParticles';
import { TutorialOverlay } from '@/components/tutorial';

export default function HomePage() {
  const router = useRouter();
  const hydrated = useHydration();
  const { playBgm, stopBgm, playSfx } = useAudio();
  const { achievement: achievementParticles } = useParticles();
  const totalMoney = useGameStore((state) => state.totalMoney);
  const pendingLevelUp = useGameStore((state) => state.pendingLevelUp);
  const clearPendingLevelUp = useGameStore((state) => state.clearPendingLevelUp);
  const popGameUnlock = useGameStore((state) => state.popPendingUnlock);
  const itemCount = useInventoryStore((state) => state.items.length);
  const achievements = useAchievementStore((state) => state.achievements);
  const popAchievementUnlock = useAchievementStore((state) => state.popPendingUnlock);

  // Tutorial state
  const shouldShowTutorial = useTutorialStore((state) => state.shouldShowTutorial);
  const startTutorial = useTutorialStore((state) => state.startTutorial);

  // UI state
  const [showGallery, setShowGallery] = useState(false);
  const [currentAchievementUnlock, setCurrentAchievementUnlock] = useState<string | null>(null);
  const [currentGameUnlock, setCurrentGameUnlock] = useState<PendingUnlock | null>(null);

  // Play home BGM on mount
  useEffect(() => {
    playBgm('home-loop');
    return () => stopBgm();
  }, [playBgm, stopBgm]);

  // Trigger first-time tutorial
  useEffect(() => {
    if (hydrated && shouldShowTutorial('home-navigation')) {
      // Delay slightly to let page render
      const timer = setTimeout(() => {
        startTutorial('home-navigation');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hydrated, shouldShowTutorial, startTutorial]);

  // Check for pending achievement unlocks
  useEffect(() => {
    if (hydrated && !currentAchievementUnlock && !pendingLevelUp && !currentGameUnlock) {
      const pending = popAchievementUnlock();
      if (pending) {
        setCurrentAchievementUnlock(pending);
        playSfx('achievement');
        achievementParticles();
      }
    }
  }, [hydrated, currentAchievementUnlock, pendingLevelUp, currentGameUnlock, popAchievementUnlock, playSfx, achievementParticles]);

  // Check for pending game unlocks (colors/patterns) after level up dismissed
  useEffect(() => {
    if (hydrated && !pendingLevelUp && !currentGameUnlock && !currentAchievementUnlock) {
      const pending = popGameUnlock();
      if (pending) {
        setCurrentGameUnlock(pending);
        playSfx('sparkle');
      }
    }
  }, [hydrated, pendingLevelUp, currentGameUnlock, currentAchievementUnlock, popGameUnlock, playSfx]);

  const handleDismissAchievementUnlock = useCallback(() => {
    setCurrentAchievementUnlock(null);
  }, []);

  const handleDismissLevelUp = useCallback(() => {
    clearPendingLevelUp();
  }, [clearPendingLevelUp]);

  const handleDismissGameUnlock = useCallback(() => {
    setCurrentGameUnlock(null);
  }, []);

  // Show loading state until hydrated to prevent mismatch
  if (!hydrated) {
    return (
      <main className="bg-home min-h-screen flex items-center justify-center">
        <motion.div
          className="text-6xl"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        >
          ✨
        </motion.div>
      </main>
    );
  }

  return (
    <main className="bg-home min-h-screen flex flex-col items-center justify-center p-8">
      {/* Floating decorations */}
      <motion.div
        className="absolute top-10 left-10 text-6xl animate-float"
        style={{ animationDelay: '0s' }}
      >
        ✨
      </motion.div>
      <motion.div
        className="absolute top-20 right-16 text-5xl animate-float"
        style={{ animationDelay: '0.5s' }}
      >
        🌸
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-16 text-5xl animate-float"
        style={{ animationDelay: '1s' }}
      >
        🦋
      </motion.div>
      <motion.div
        className="absolute bottom-16 right-10 text-6xl animate-float"
        style={{ animationDelay: '1.5s' }}
      >
        ⭐
      </motion.div>

      {/* Top bar */}
      <div className="absolute top-6 left-6 right-6 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          {/* Trophy button */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <TrophyButton onClick={() => setShowGallery(true)} />
          </motion.div>

          {/* Money display */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CoinDisplay amount={totalMoney} size="large" />
          </motion.div>
        </div>

        {/* XP Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <XPBar size="medium" showLevel={true} />
        </motion.div>
      </div>

      {/* Main content */}
      <motion.div
        className="flex flex-col items-center gap-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Title */}
        <GameCard className="text-center">
          <motion.h1
            className="text-5xl font-bold text-purple-600 mb-2"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ✨ Made by Thea ✨
          </motion.h1>
          <p className="text-xl text-purple-400">
            Create & Sell!
          </p>
        </GameCard>

        {/* Navigation buttons */}
        <div className="flex flex-col gap-6">
          {/* Workshop button */}
          <BigButton
            onClick={() => router.push('/workshop')}
            color="purple"
            size="huge"
          >
            <div className="flex items-center gap-4">
              <span className="text-5xl">🎨</span>
              <div className="text-left">
                <div>Workshop</div>
                <div className="text-sm font-normal opacity-80">
                  Make new clothes!
                </div>
              </div>
            </div>
          </BigButton>

          {/* Store button */}
          <BigButton
            onClick={() => router.push('/store')}
            color="pink"
            size="huge"
            disabled={itemCount === 0}
          >
            <div className="flex items-center gap-4">
              <span className="text-5xl">🏪</span>
              <div className="text-left">
                <div>Open Store</div>
                <div className="text-sm font-normal opacity-80">
                  {itemCount === 0
                    ? 'Make clothes first!'
                    : `${itemCount} item${itemCount === 1 ? '' : 's'} ready`}
                </div>
              </div>
            </div>
          </BigButton>

          {/* Upgrades button */}
          <BigButton
            onClick={() => router.push('/upgrades')}
            color="orange"
            size="large"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">🛠️</span>
              <div className="text-left">
                <div>Upgrades</div>
                <div className="text-sm font-normal opacity-80">
                  Improve your shop!
                </div>
              </div>
            </div>
          </BigButton>
        </div>

        {/* Inventory hint */}
        {itemCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-purple-600 text-lg"
          >
            🧺 {itemCount} clothes in your collection!
          </motion.div>
        )}
      </motion.div>

      {/* Achievement gallery modal */}
      <AchievementGallery
        show={showGallery}
        onClose={() => setShowGallery(false)}
      />

      {/* Level up popup - shown first */}
      <LevelUpPopup
        level={pendingLevelUp}
        onDismiss={handleDismissLevelUp}
      />

      {/* Unlock reveal - shown after level up */}
      <UnlockReveal
        unlock={currentGameUnlock}
        onDismiss={handleDismissGameUnlock}
      />

      {/* Achievement unlock popup - shown last */}
      <AchievementPopup
        achievement={currentAchievementUnlock ? achievements[currentAchievementUnlock as keyof typeof achievements] : null}
        onDismiss={handleDismissAchievementUnlock}
      />

      {/* Tutorial overlay */}
      <TutorialOverlay />
    </main>
  );
}
