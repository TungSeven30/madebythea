'use client';

/**
 * Home Screen - Main menu for Made by Thea
 */

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BigButton, CoinDisplay, GameCard } from '@/components/ui';
import { useGameStore, useInventoryStore } from '@/stores';
import { useHydration } from '@/lib/useHydration';

export default function HomePage() {
  const router = useRouter();
  const hydrated = useHydration();
  const totalMoney = useGameStore((state) => state.totalMoney);
  const itemCount = useInventoryStore((state) => state.items.length);

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

      {/* Money display */}
      <motion.div
        className="absolute top-6 right-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <CoinDisplay amount={totalMoney} size="large" />
      </motion.div>

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
    </main>
  );
}
