'use client';

/**
 * Store Page - Rush mode gameplay
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BigButton, CoinDisplay, Timer, GameCard } from '@/components/ui';
import { ClothesRack, CustomerDisplay, SaleResult } from '@/components/store';
import { useGameStore, useInventoryStore } from '@/stores';
import { ALL_CUSTOMERS, type Customer } from '@/types';
import { doesItemMatchCustomer, getPriceInCoins, selectRandomCustomers } from '@/lib/matching';

type GamePhase = 'ready' | 'playing' | 'result' | 'ended';

interface SaleResultData {
  success: boolean;
  reason?: string;
  coins?: number;
  itemId: string;
  customerId: string;
}

export default function StorePage() {
  const router = useRouter();
  const items = useInventoryStore((state) => state.items);
  const removeItem = useInventoryStore((state) => state.removeItem);
  const { settings, startWave, endWave, totalMoney, currentWave, addMoney } = useGameStore();

  const [phase, setPhase] = useState<GamePhase>('ready');
  const [timeLeft, setTimeLeft] = useState(settings.waveDuration);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [saleResult, setSaleResult] = useState<SaleResultData | null>(null);
  const [waveSales, setWaveSales] = useState<SaleResultData[]>([]);
  const [servedCustomerIds, setServedCustomerIds] = useState<Set<string>>(new Set());

  // Available items (not sold yet)
  const availableItems = items.slice(0, 6);

  // Current customers to show (up to 3 at a time)
  const visibleCustomers = customers
    .filter((c) => !servedCustomerIds.has(c.id))
    .slice(0, 3);

  // Start the wave
  const handleStart = useCallback(() => {
    const selectedCustomers = selectRandomCustomers(ALL_CUSTOMERS, 8);
    setCustomers(selectedCustomers);
    setPhase('playing');
    setTimeLeft(settings.waveDuration);
    setWaveSales([]);
    setServedCustomerIds(new Set());
    startWave();
  }, [settings.waveDuration, startWave]);

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

  // End wave when time's up or all customers served
  useEffect(() => {
    if (phase === 'ended') {
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

      // Navigate to results after a short delay
      setTimeout(() => {
        router.push('/results');
      }, 500);
    }
  }, [phase, waveSales, customers, items, currentWave, endWave, router]);

  // Handle clothing selection
  const handleSelectItem = (itemId: string) => {
    if (phase !== 'playing') return;
    setSelectedItemId(selectedItemId === itemId ? null : itemId);
  };

  // Handle customer tap (attempt sale)
  const handleCustomerTap = (customer: Customer) => {
    if (phase !== 'playing' || !selectedItemId) return;

    const item = items.find((i) => i.id === selectedItemId);
    if (!item) return;

    const matchResult = doesItemMatchCustomer(item, customer);
    const coins = getPriceInCoins(item.price);

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

  // Handle sale result dismissal
  const handleResultDone = () => {
    if (!saleResult) return;

    // Add to wave sales
    setWaveSales((prev) => [...prev, saleResult]);

    // If successful, remove item and add money
    if (saleResult.success) {
      removeItem(saleResult.itemId);
      addMoney(saleResult.coins ?? 0);
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

  return (
    <main className="bg-store min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <BigButton onClick={() => router.push('/')} color="pink" size="normal">
          <span className="text-2xl">🏠</span>
        </BigButton>

        {phase === 'playing' && (
          <Timer seconds={timeLeft} totalSeconds={settings.waveDuration} />
        )}

        <CoinDisplay amount={totalMoney} size="medium" />
      </div>

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
                  <CustomerDisplay
                    key={customer.id}
                    customer={customer}
                    isSelected={false}
                    onTap={() => handleCustomerTap(customer)}
                    showBubble={true}
                  />
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
    </main>
  );
}
