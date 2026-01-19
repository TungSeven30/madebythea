'use client';

/**
 * Store Page - Rush mode gameplay
 * Features patience system, VIP customers, upgrade bonuses, and make-to-order
 */

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BigButton, CoinDisplay, Timer, GameCard } from '@/components/ui';
import { ClothesRack, CustomerDisplay, SaleResult, MakeItButton } from '@/components/store';
import { useGameStore, useInventoryStore, useAchievementTracker, useUpgradeStore, XP_REWARDS } from '@/stores';
import { useHydration } from '@/lib/useHydration';
import { useAudio } from '@/hooks/useAudio';
import { useParticles } from '@/hooks/useParticles';
import { CoinBurst } from '@/components/effects';
import {
  ALL_CUSTOMERS,
  type RuntimeCustomer,
  createRuntimeCustomer,
  getMoodFromPatience,
} from '@/types';
import { doesItemMatchCustomer, getPriceInCoins, selectRandomCustomers, hasMatchingItem } from '@/lib/matching';

type GamePhase = 'ready' | 'playing' | 'result' | 'ended';

interface SaleResultData {
  success: boolean;
  reason?: string;
  coins?: number;
  itemId: string;
  customerId: string;
}

// Patience decrease per second (base rate)
const PATIENCE_DECAY_PER_SECOND = 2;
// Make-to-order patience decay multiplier (50% slower)
const MAKE_TO_ORDER_PATIENCE_MULTIPLIER = 0.5;
// VIP chance (20% of customers)
const VIP_CHANCE = 0.2;

/**
 * Inner store content component
 */
function StoreContent() {
  const router = useRouter();
  const hydrated = useHydration();
  const { playSfx, playBgm, stopBgm } = useAudio();
  const { coinBurst, softFail } = useParticles();
  const achievementTracker = useAchievementTracker();
  const items = useInventoryStore((state) => state.items);
  const removeItem = useInventoryStore((state) => state.removeItem);
  const {
    settings,
    startWave,
    endWave,
    totalMoney,
    currentWave,
    addMoney,
    addXP,
    makeToOrderCustomerId,
    clearMakeToOrder,
  } = useGameStore();

  // Upgrade bonuses
  const getWaveTimeBonus = useUpgradeStore((state) => state.getWaveTimeBonus);
  const getTipBonus = useUpgradeStore((state) => state.getTipBonus);

  // Calculate wave duration with upgrade bonus
  const waveDuration = settings.waveDuration + getWaveTimeBonus();
  const tipBonus = getTipBonus();

  // Play store BGM on mount
  useEffect(() => {
    playBgm('store-loop');
    return () => stopBgm();
  }, [playBgm, stopBgm]);

  const [phase, setPhase] = useState<GamePhase>('ready');
  const [timeLeft, setTimeLeft] = useState(waveDuration);
  const [customers, setCustomers] = useState<RuntimeCustomer[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [saleResult, setSaleResult] = useState<SaleResultData | null>(null);
  const [waveSales, setWaveSales] = useState<SaleResultData[]>([]);
  const [servedCustomerIds, setServedCustomerIds] = useState<Set<string>>(new Set());
  const [showCoinBurst, setShowCoinBurst] = useState<number | null>(null);
  const [impatientLeft, setImpatientLeft] = useState<string | null>(null);

  // Make-to-order state
  const [showMakeItFor, setShowMakeItFor] = useState<string | null>(null);
  const [makeToOrderReturnMessage, setMakeToOrderReturnMessage] = useState<string | null>(null);

  // Track item count to detect when new item is created
  const previousItemCountRef = useRef(items.length);

  // Ref for patience interval
  const patienceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Available items (not sold yet)
  const availableItems = items.slice(0, 6);

  // Current customers to show (up to 3 at a time)
  const visibleCustomers = customers
    .filter((c) => !servedCustomerIds.has(c.id))
    .slice(0, 3);

  // Handle return from workshop with make-to-order
  useEffect(() => {
    if (!hydrated || !makeToOrderCustomerId) return;

    // Check if we're returning from workshop (new item was added)
    const currentItemCount = items.length;
    const previousItemCount = previousItemCountRef.current;

    if (currentItemCount > previousItemCount && phase === 'playing') {
      // New item was created! Find the newest item
      const newestItem = items[items.length - 1];

      // Find the reserved customer
      const reservedCustomer = customers.find((c) => c.id === makeToOrderCustomerId);

      if (reservedCustomer && !servedCustomerIds.has(reservedCustomer.id)) {
        // Customer is still here! Auto-select the new item
        setSelectedItemId(newestItem.id);
        playSfx('sparkle');

        // Show delivery animation message
        setMakeToOrderReturnMessage(`Delivered to ${reservedCustomer.displayName}! 🚀`);
        setTimeout(() => setMakeToOrderReturnMessage(null), 2000);
      } else {
        // Customer left while crafting - friendly message
        setMakeToOrderReturnMessage('Customer left, but you kept the item! 🎁');
        setTimeout(() => setMakeToOrderReturnMessage(null), 3000);
      }

      // Clear the make-to-order state
      clearMakeToOrder();

      // Clear make-to-order flag on the customer
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === makeToOrderCustomerId ? { ...c, makeToOrder: undefined } : c
        )
      );
    }

    previousItemCountRef.current = currentItemCount;
  }, [hydrated, items.length, makeToOrderCustomerId, customers, servedCustomerIds, phase, items, clearMakeToOrder, playSfx]);

  // Start the wave
  const handleStart = useCallback(() => {
    const selectedBase = selectRandomCustomers(ALL_CUSTOMERS, 8);

    // Convert to runtime customers with random VIP status
    const runtimeCustomers = selectedBase.map((c) => {
      const isVIP = Math.random() < VIP_CHANCE;
      return createRuntimeCustomer(c, { isVIP });
    });

    setCustomers(runtimeCustomers);
    setPhase('playing');
    setTimeLeft(waveDuration);
    setWaveSales([]);
    setServedCustomerIds(new Set());
    setImpatientLeft(null);
    setShowMakeItFor(null);
    previousItemCountRef.current = items.length;
    startWave();
  }, [waveDuration, startWave, items.length]);

  // Timer countdown
  useEffect(() => {
    if (phase !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setPhase('ended');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  // Patience countdown for visible customers
  useEffect(() => {
    if (phase !== 'playing') {
      if (patienceIntervalRef.current) {
        clearInterval(patienceIntervalRef.current);
        patienceIntervalRef.current = null;
      }
      return;
    }

    patienceIntervalRef.current = setInterval(() => {
      setCustomers((prev) => {
        // Pre-compute visible customer IDs for O(1) lookup instead of O(n) per customer
        const visibleIds = new Set(
          prev
            .filter((c) => !servedCustomerIds.has(c.id))
            .slice(0, 3)
            .map((c) => c.id)
        );

        const updated = prev.map((c) => {
          // Only decrease patience for visible customers
          if (servedCustomerIds.has(c.id)) return c;
          if (!visibleIds.has(c.id)) return c;

          // Apply make-to-order slowdown if customer is reserved
          const decayMultiplier = c.makeToOrder?.isWaitingForOrder
            ? MAKE_TO_ORDER_PATIENCE_MULTIPLIER
            : 1;

          const newPatience = Math.max(
            0,
            c.patience - PATIENCE_DECAY_PER_SECOND * decayMultiplier
          );
          return {
            ...c,
            patience: newPatience,
            mood: getMoodFromPatience(newPatience),
          };
        });

        // Check if any visible customer ran out of patience
        const leftCustomer = updated.find(
          (c) =>
            c.patience === 0 &&
            !servedCustomerIds.has(c.id) &&
            prev.find((pc) => pc.id === c.id)?.patience !== 0
        );

        if (leftCustomer) {
          // Customer left due to impatience - mark as served
          setServedCustomerIds((s) => new Set(s).add(leftCustomer.id));

          // Check if this was a make-to-order customer
          if (leftCustomer.makeToOrder?.isWaitingForOrder) {
            setImpatientLeft(`${leftCustomer.displayName} couldn't wait!`);
          } else {
            setImpatientLeft(`${leftCustomer.displayName} got tired of waiting!`);
          }
          playSfx('fail');

          // Clear the notification after a delay
          setTimeout(() => setImpatientLeft(null), 2000);
        }

        return updated;
      });
    }, 1000);

    return () => {
      if (patienceIntervalRef.current) {
        clearInterval(patienceIntervalRef.current);
        patienceIntervalRef.current = null;
      }
    };
  }, [phase, servedCustomerIds, playSfx]);

  // End wave when time's up or all customers served
  useEffect(() => {
    if (phase === 'ended') {
      // Clear any make-to-order state when wave ends
      clearMakeToOrder();

      const successfulSales = waveSales.filter((s) => s.success);
      const failedSales = waveSales.filter((s) => !s.success);

      endWave({
        waveNumber: currentWave,
        sales: waveSales.map((s) => ({
          itemId: s.itemId,
          item: items.find((i) => i.id === s.itemId)!,
          customer: customers.find((c) => c.id === s.customerId)!,
          price: s.coins ?? 0,
          success: s.success,
          reason: s.reason,
        })),
        totalEarned: successfulSales.reduce((sum, s) => sum + (s.coins ?? 0), 0),
        itemsSold: successfulSales.length,
        itemsNotSold: failedSales.length,
      });

      // Track wave achievements
      achievementTracker.trackWaveSales(successfulSales.length, waveSales.length);

      // Track unique customers served
      const uniqueCustomers = new Set(successfulSales.map((s) => s.customerId));
      achievementTracker.trackUniqueCustomers(uniqueCustomers);

      // Grant XP for wave completion
      if (successfulSales.length > 0) {
        addXP(XP_REWARDS.waveComplete);
      }

      // Navigate to results after a short delay
      setTimeout(() => {
        router.push('/results');
      }, 500);
    }
  }, [phase, waveSales, customers, items, currentWave, endWave, router, achievementTracker, addXP, clearMakeToOrder]);

  // Handle clothing selection
  const handleSelectItem = (itemId: string) => {
    if (phase !== 'playing') return;
    setSelectedItemId(selectedItemId === itemId ? null : itemId);
    // Clear make-it prompt when selecting an item
    setShowMakeItFor(null);
  };

  // Handle customer tap (attempt sale or show make-it button)
  const handleCustomerTap = (customer: RuntimeCustomer) => {
    if (phase !== 'playing') return;

    // If no item selected, check if we should show the MakeIt button
    if (!selectedItemId) {
      // Check if there's any matching item in inventory
      if (!hasMatchingItem(availableItems, customer)) {
        // No matching item - show MakeIt button
        setShowMakeItFor(showMakeItFor === customer.id ? null : customer.id);
      }
      return;
    }

    // Clear make-it prompt
    setShowMakeItFor(null);

    const item = items.find((i) => i.id === selectedItemId);
    if (!item) return;

    const matchResult = doesItemMatchCustomer(item, customer);
    let coins = getPriceInCoins(item.price);

    // Apply bonuses if successful
    if (matchResult.matches) {
      // VIP bonus (2x)
      if (customer.modifiers.isVIP) {
        coins *= 2;
      }
      // Tip jar bonus
      coins += tipBonus;
    }

    const result: SaleResultData = {
      success: matchResult.matches,
      reason: matchResult.reason,
      coins: matchResult.matches ? coins : undefined,
      itemId: item.id,
      customerId: customer.id,
    };

    setSaleResult(result);
    setPhase('result');
  };

  // Handle make-it button pressed - reserve customer and navigate to workshop
  const handleMakeItStart = (customerId: string) => {
    // Mark customer as reserved for make-to-order
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              makeToOrder: {
                isWaitingForOrder: true,
                orderStartedAt: Date.now(),
              },
            }
          : c
      )
    );
    setShowMakeItFor(null);
  };

  // Handle sale result dismissal
  const handleResultDone = () => {
    if (!saleResult) return;

    // Play appropriate sound and particles
    if (saleResult.success) {
      playSfx('cha-ching');
      coinBurst();
      setShowCoinBurst(saleResult.coins ?? 0);
    } else {
      playSfx('fail');
      softFail();
    }

    // Add to wave sales
    setWaveSales((prev) => [...prev, saleResult]);

    // If successful, remove item and add money
    if (saleResult.success) {
      removeItem(saleResult.itemId);
      addMoney(saleResult.coins ?? 0);

      // Grant XP for successful sale
      addXP(XP_REWARDS.saleSuccess);

      // Track achievements
      achievementTracker.trackSale();
      achievementTracker.trackCoinsEarned(totalMoney + (saleResult.coins ?? 0));
    }

    // Mark customer as served
    setServedCustomerIds((prev) => new Set(prev).add(saleResult.customerId));

    // Reset selection
    setSelectedItemId(null);
    setSaleResult(null);

    // Check if wave should end (no more items or customers)
    const remainingItems = items.filter((i) => i.id !== saleResult.itemId);
    const remainingCustomers = customers.filter(
      (c) => !servedCustomerIds.has(c.id) && c.id !== saleResult.customerId
    );

    if (remainingItems.length === 0 || remainingCustomers.length === 0) {
      setPhase('ended');
    } else {
      setPhase('playing');
    }
  };

  if (!hydrated) {
    return (
      <main className="bg-store min-h-screen flex items-center justify-center">
        <motion.div
          className="text-6xl"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        >
          🏪
        </motion.div>
      </main>
    );
  }

  return (
    <main className="bg-store min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <BigButton onClick={() => router.push('/')} color="pink" size="normal">
          <span className="text-2xl">🏠</span>
        </BigButton>

        {phase === 'playing' && (
          <Timer seconds={timeLeft} totalSeconds={waveDuration} />
        )}

        <CoinDisplay amount={totalMoney} size="medium" />
      </div>

      {/* Impatient customer notification */}
      <AnimatePresence>
        {impatientLeft && (
          <motion.div
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg z-50"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            😤 {impatientLeft}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Make-to-order return notification */}
      <AnimatePresence>
        {makeToOrderReturnMessage && (
          <motion.div
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-6 py-3 rounded-full shadow-lg z-50"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            {makeToOrderReturnMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ready phase */}
      {phase === 'ready' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <GameCard className="text-center">
            <motion.h1
              className="text-4xl font-bold text-orange-600 mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              🏪 Wave {currentWave}! 🏪
            </motion.h1>
            <p className="text-xl text-gray-600 mb-2">
              Customers are coming!
            </p>
            <p className="text-lg text-gray-500">
              Match clothes to what they want! 👕→👤
            </p>
            {/* Show active bonuses */}
            {(tipBonus > 0 || getWaveTimeBonus() > 0) && (
              <div className="mt-3 flex gap-3 justify-center">
                {getWaveTimeBonus() > 0 && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    ⏰ +{getWaveTimeBonus()}s
                  </span>
                )}
                {tipBonus > 0 && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    💵 +{tipBonus} coin/sale
                  </span>
                )}
              </div>
            )}
          </GameCard>

          <BigButton onClick={handleStart} color="green" size="huge" disabled={availableItems.length === 0}>
            <span className="flex items-center gap-3">
              <span className="text-4xl">🚀</span>
              {availableItems.length > 0 ? 'Start Wave!' : 'No clothes!'}
            </span>
          </BigButton>

          {availableItems.length === 0 && (
            <BigButton onClick={() => router.push('/workshop')} color="purple" size="large">
              Go to Workshop 🎨
            </BigButton>
          )}
        </div>
      )}

      {/* Playing phase */}
      {(phase === 'playing' || phase === 'result') && (
        <div className="flex-1 flex flex-col gap-4">
          {/* Customers area */}
          <GameCard className="flex-1">
            <h2 className="text-xl font-bold text-center text-orange-600 mb-4">
              🛍️ Customers Shopping! 🛍️
            </h2>
            <div className="flex justify-center gap-4 flex-wrap">
              <AnimatePresence mode="popLayout">
                {visibleCustomers.map((customer) => (
                  <div key={customer.id} className="flex flex-col items-center gap-2">
                    <CustomerDisplay
                      customer={customer}
                      isSelected={false}
                      onTap={() => handleCustomerTap(customer)}
                      mood={customer.mood}
                      showBubble={true}
                      isMakingOrder={customer.makeToOrder?.isWaitingForOrder}
                    />

                    {/* Show MakeIt button for this customer */}
                    <AnimatePresence>
                      {showMakeItFor === customer.id && !customer.makeToOrder?.isWaitingForOrder && (
                        <MakeItButton
                          customer={customer}
                          onMakeItStart={handleMakeItStart}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </AnimatePresence>

              {visibleCustomers.length === 0 && (
                <motion.div
                  className="text-2xl text-gray-500 py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  All customers served! 🎉
                </motion.div>
              )}
            </div>

            {selectedItemId && (
              <motion.p
                className="text-center text-purple-600 font-bold mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                👆 Tap a customer to sell!
              </motion.p>
            )}

            {!selectedItemId && showMakeItFor === null && (
              <motion.p
                className="text-center text-gray-500 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Select an item below, or tap a customer to make something special!
              </motion.p>
            )}
          </GameCard>

          {/* Clothes rack */}
          <ClothesRack
            items={availableItems}
            selectedId={selectedItemId}
            onSelect={handleSelectItem}
          />
        </div>
      )}

      {/* Sale result popup */}
      <AnimatePresence>
        {phase === 'result' && saleResult && (
          <SaleResult
            success={saleResult.success}
            reason={saleResult.reason}
            coins={saleResult.coins}
            onDone={handleResultDone}
          />
        )}
      </AnimatePresence>

      {/* Coin burst effect */}
      <CoinBurst
        amount={showCoinBurst ?? 0}
        show={showCoinBurst !== null}
        onComplete={() => setShowCoinBurst(null)}
      />
    </main>
  );
}

/**
 * Store page with loading fallback
 */
export default function StorePage() {
  return (
    <Suspense
      fallback={
        <main className="bg-store min-h-screen flex items-center justify-center">
          <motion.div
            className="text-6xl"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          >
            🏪
          </motion.div>
        </main>
      }
    >
      <StoreContent />
    </Suspense>
  );
}
