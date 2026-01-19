'use client';

/**
 * Results Page - Wave summary
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BigButton, CoinDisplay, GameCard } from '@/components/ui';
import { ClothingPreview, CustomerAvatar } from '@/components/shared';
import { useGameStore, useInventoryStore } from '@/stores';
import { useHydration } from '@/lib/useHydration';
import { useParticles } from '@/hooks/useParticles';
import { useAudio } from '@/hooks/useAudio';

export default function ResultsPage() {
  const router = useRouter();
  const hydrated = useHydration();
  const { celebration } = useParticles();
  const { playSfx } = useAudio();
  const { currentWaveResult, totalMoney } = useGameStore();
  const itemCount = useInventoryStore((state) => state.items.length);

  // Celebrate on mount if there are successful sales
  useEffect(() => {
    if (hydrated && currentWaveResult && currentWaveResult.itemsSold > 0) {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        celebration();
        playSfx('success');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [hydrated, currentWaveResult, celebration, playSfx]);

  if (!hydrated) {
    return (
      <main className="bg-results min-h-screen flex items-center justify-center">
        <motion.div
          className="text-6xl"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        >
          🎉
        </motion.div>
      </main>
    );
  }

  // If no results, redirect to home
  if (!currentWaveResult) {
    return (
      <main className="bg-results min-h-screen flex flex-col items-center justify-center p-6">
        <GameCard className="text-center">
          <h1 className="text-3xl font-bold text-gray-600 mb-4">
            No results yet!
          </h1>
          <BigButton onClick={() => router.push('/')} color="purple" size="large">
            🏠 Go Home
          </BigButton>
        </GameCard>
      </main>
    );
  }

  const { sales, totalEarned, itemsSold, itemsNotSold } = currentWaveResult;
  const successfulSales = sales.filter((s) => s.success);
  const failedSales = sales.filter((s) => !s.success);

  // Simple tips based on performance
  const getTip = () => {
    if (failedSales.length === 0 && successfulSales.length > 0) {
      return '⭐ Perfect! You matched everything!';
    }
    if (failedSales.some((s) => s.reason?.includes('expensive'))) {
      return '💡 Some items were too pricey. Try lower prices!';
    }
    if (failedSales.some((s) => s.reason?.includes('Wanted'))) {
      return '💡 Watch the thought bubbles to see what customers want!';
    }
    if (successfulSales.length === 0) {
      return '💪 Keep trying! Match colors and shapes to thought bubbles!';
    }
    return '👍 Good job! Keep practicing!';
  };

  return (
    <main className="bg-results min-h-screen flex flex-col p-6">
      {/* Header */}
      <motion.div
        className="text-center mb-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-4xl font-bold text-teal-600">
          🎉 Wave {currentWaveResult.waveNumber} Done! 🎉
        </h1>
      </motion.div>

      {/* Stats */}
      <div className="flex justify-center gap-8 mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <CoinDisplay amount={totalEarned} size="large" />
          <p className="text-center text-sm text-gray-600 mt-1">Earned</p>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-4xl font-bold text-green-600">{itemsSold}</div>
          <p className="text-sm text-gray-600">Sold 👍</p>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-4xl font-bold text-red-400">{itemsNotSold}</div>
          <p className="text-sm text-gray-600">No sale 👎</p>
        </motion.div>
      </div>

      {/* Sales breakdown */}
      <div className="flex-1 overflow-auto">
        {/* Successful sales */}
        {successfulSales.length > 0 && (
          <GameCard className="mb-4">
            <h2 className="text-xl font-bold text-green-600 mb-3">
              ✅ Sold! ({successfulSales.length})
            </h2>
            <div className="flex flex-wrap gap-4">
              {successfulSales.map((sale, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 bg-green-50 rounded-xl p-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <ClothingPreview item={sale.item} size="small" />
                  <span className="text-xl">→</span>
                  <CustomerAvatar customer={sale.customer} size="small" showName={false} />
                  <span className="text-green-600 font-bold">🪙{sale.price}</span>
                </motion.div>
              ))}
            </div>
          </GameCard>
        )}

        {/* Failed sales */}
        {failedSales.length > 0 && (
          <GameCard className="mb-4">
            <h2 className="text-xl font-bold text-red-400 mb-3">
              ❌ No Sale ({failedSales.length})
            </h2>
            <div className="flex flex-wrap gap-4">
              {failedSales.map((sale, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 bg-red-50 rounded-xl p-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + successfulSales.length * 0.1 + i * 0.1 }}
                >
                  <ClothingPreview item={sale.item} size="small" />
                  <span className="text-xl">→</span>
                  <CustomerAvatar customer={sale.customer} size="small" showName={false} />
                  <span className="text-red-400 text-sm">{sale.reason}</span>
                </motion.div>
              ))}
            </div>
          </GameCard>
        )}
      </div>

      {/* Tip */}
      <motion.div
        className="bg-yellow-100 border-4 border-yellow-300 rounded-2xl p-4 text-center mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-lg text-yellow-800">{getTip()}</p>
      </motion.div>

      {/* Total coins */}
      <motion.div
        className="text-center mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-gray-600">Total coins:</p>
        <CoinDisplay amount={totalMoney} size="large" />
      </motion.div>

      {/* Navigation buttons */}
      <motion.div
        className="flex justify-center gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <BigButton onClick={() => router.push('/workshop')} color="purple" size="large">
          <span className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            Make More
          </span>
        </BigButton>

        {itemCount > 0 && (
          <BigButton onClick={() => router.push('/store')} color="green" size="large">
            <span className="flex items-center gap-2">
              <span className="text-2xl">🏪</span>
              Next Wave!
            </span>
          </BigButton>
        )}

        <BigButton onClick={() => router.push('/')} color="pink" size="large">
          <span className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            Home
          </span>
        </BigButton>
      </motion.div>
    </main>
  );
}
