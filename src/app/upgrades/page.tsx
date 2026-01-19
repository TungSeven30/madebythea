'use client';

/**
 * Upgrades Page - Purchase game upgrades with coins
 *
 * Features tap-and-hold (3 seconds) to confirm purchases,
 * preventing accidental buys while staying child-friendly.
 */

import { useEffect, useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BigButton, CoinDisplay, GameCard } from '@/components/ui';
import { useGameStore, useUpgradeStore, type UpgradeId, UPGRADE_DEFINITIONS } from '@/stores';
import { useHydration } from '@/lib/useHydration';
import { useAudio } from '@/hooks/useAudio';
import { useParticles } from '@/hooks/useParticles';

const HOLD_DURATION_MS = 3000; // 3 seconds to confirm
const UPDATE_INTERVAL_MS = 50; // Progress update frequency

interface UpgradeCardProps {
  id: UpgradeId;
  onPurchase: () => void;
  canAfford: boolean;
}

function UpgradeCard({ id, onPurchase, canAfford }: UpgradeCardProps) {
  const { playSfx } = useAudio();
  const upgrade = useUpgradeStore((state) => state.upgrades[id]);
  const getUpgradeCost = useUpgradeStore((state) => state.getUpgradeCost);
  const isMaxLevel = useUpgradeStore((state) => state.isMaxLevel);

  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const cost = getUpgradeCost(id);
  const maxed = isMaxLevel(id);
  const canPurchase = !maxed && canAfford;

  // Get current effect value for display
  const getEffectText = () => {
    const level = upgrade.level;
    switch (id) {
      case 'bigger-rack':
        return level > 0 ? `+${level * 2} slots` : '';
      case 'patient-customers':
        return level > 0 ? `+${level * 15}s` : '';
      case 'tip-jar':
        return level > 0 ? `+${level} coin` : '';
      default:
        return '';
    }
  };

  const startHold = useCallback(() => {
    if (!canPurchase) return;

    setIsHolding(true);
    startTimeRef.current = Date.now();
    playSfx('pop');

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((elapsed / HOLD_DURATION_MS) * 100, 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        // Purchase complete!
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsHolding(false);
        setHoldProgress(0);
        onPurchase();
      }
    }, UPDATE_INTERVAL_MS);
  }, [canPurchase, onPurchase, playSfx]);

  const endHold = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsHolding(false);
    setHoldProgress(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Level indicator dots
  const levelDots = Array.from({ length: upgrade.maxLevel }, (_, i) => (
    <motion.div
      key={i}
      className={`w-4 h-4 rounded-full border-2 ${
        i < upgrade.level
          ? 'bg-yellow-400 border-yellow-500'
          : 'bg-white/50 border-white/70'
      }`}
      initial={false}
      animate={i < upgrade.level ? { scale: [1, 1.2, 1] } : {}}
    />
  ));

  return (
    <motion.div
      className={`relative rounded-3xl border-4 p-6 ${
        maxed
          ? 'bg-gradient-to-br from-yellow-200 to-yellow-300 border-yellow-400'
          : canAfford
          ? 'bg-gradient-to-br from-purple-200 to-pink-200 border-purple-300'
          : 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-400 opacity-70'
      }`}
      whileHover={canPurchase ? { scale: 1.02 } : {}}
      animate={isHolding ? { scale: 0.98 } : { scale: 1 }}
    >
      {/* Emoji and name */}
      <div className="text-center mb-4">
        <motion.div
          className="text-6xl mb-2"
          animate={maxed ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ repeat: maxed ? Infinity : 0, duration: 2 }}
        >
          {upgrade.emoji}
        </motion.div>
        <h3 className="text-2xl font-bold text-purple-700">{upgrade.name}</h3>
        <p className="text-purple-500">{upgrade.description}</p>
        {upgrade.level > 0 && (
          <p className="text-lg font-semibold text-green-600 mt-1">
            {getEffectText()}
          </p>
        )}
      </div>

      {/* Level dots */}
      <div className="flex justify-center gap-2 mb-4">
        {levelDots}
      </div>

      {/* Purchase button / maxed indicator */}
      {maxed ? (
        <div className="text-center py-3">
          <span className="text-2xl font-bold text-yellow-600">⭐ MAX! ⭐</span>
        </div>
      ) : (
        <div
          className={`relative rounded-2xl p-4 ${
            canAfford
              ? 'bg-purple-400 cursor-pointer'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          onTouchCancel={endHold}
        >
          {/* Progress overlay */}
          <div
            className="absolute inset-0 bg-green-400 rounded-2xl transition-none"
            style={{
              width: `${holdProgress}%`,
              opacity: holdProgress > 0 ? 0.7 : 0,
            }}
          />

          {/* Content */}
          <div className="relative z-10 text-center">
            {isHolding ? (
              <div className="text-white font-bold text-xl">
                Hold... {Math.ceil((100 - holdProgress) / 100 * 3)}s
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">🪙</span>
                <span className="text-2xl font-bold text-white">{cost}</span>
              </div>
            )}
            {!isHolding && (
              <p className="text-white/80 text-sm mt-1">
                {canAfford ? 'Hold to buy' : 'Not enough coins'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Sparkle effect when maxed */}
      {maxed && (
        <motion.div
          className="absolute -top-2 -right-2 text-3xl"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          ✨
        </motion.div>
      )}
    </motion.div>
  );
}

export default function UpgradesPage() {
  const router = useRouter();
  const hydrated = useHydration();
  const { playBgm, stopBgm, playSfx } = useAudio();
  const { celebration } = useParticles();

  const totalMoney = useGameStore((state) => state.totalMoney);
  const spendMoney = useGameStore((state) => state.spendMoney);
  const purchaseUpgrade = useUpgradeStore((state) => state.purchaseUpgrade);
  const getUpgradeCost = useUpgradeStore((state) => state.getUpgradeCost);

  const [justPurchased, setJustPurchased] = useState<string | null>(null);

  // Play background music
  useEffect(() => {
    playBgm('home-loop');
    return () => stopBgm();
  }, [playBgm, stopBgm]);

  const handlePurchase = useCallback((id: UpgradeId) => {
    const cost = getUpgradeCost(id);
    if (cost === null || totalMoney < cost) return;

    // Deduct money and upgrade
    spendMoney(cost);
    const success = purchaseUpgrade(id);

    if (success) {
      playSfx('cha-ching');
      celebration();
      setJustPurchased(id);
      setTimeout(() => setJustPurchased(null), 1000);
    }
  }, [getUpgradeCost, totalMoney, spendMoney, purchaseUpgrade, playSfx, celebration]);

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

  const upgradeIds = Object.keys(UPGRADE_DEFINITIONS) as UpgradeId[];

  return (
    <main className="bg-home min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <BigButton
          onClick={() => router.push('/')}
          color="purple"
          size="normal"
        >
          ← Back
        </BigButton>

        <CoinDisplay amount={totalMoney} size="large" />
      </div>

      {/* Title */}
      <GameCard className="text-center mb-6">
        <motion.h1
          className="text-4xl font-bold text-purple-600"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🛠️ Upgrades 🛠️
        </motion.h1>
        <p className="text-purple-400 mt-2">
          Make your store even better!
        </p>
      </GameCard>

      {/* Upgrade grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {upgradeIds.map((id) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: upgradeIds.indexOf(id) * 0.1 }}
          >
            <UpgradeCard
              id={id}
              onPurchase={() => handlePurchase(id)}
              canAfford={totalMoney >= (getUpgradeCost(id) ?? Infinity)}
            />
          </motion.div>
        ))}
      </div>

      {/* Purchase celebration overlay */}
      <AnimatePresence>
        {justPurchased && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-8xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              🎉
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint at bottom */}
      <motion.div
        className="text-center mt-8 text-purple-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        💡 Tip: Upgrades help you earn more coins!
      </motion.div>
    </main>
  );
}
