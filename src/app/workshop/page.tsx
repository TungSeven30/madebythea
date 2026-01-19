'use client';

/**
 * Workshop Page - Create new clothing items
 * Supports make-to-order mode when coming from store
 */

import { useState, useEffect, Suspense, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { BigButton, GameCard } from '@/components/ui';
import { ClothingPreview, CustomerAvatar } from '@/components/shared';
import {
  ShapeSelector,
  ColorPicker,
  PatternPicker,
  PricePicker,
} from '@/components/workshop';
import { useInventoryStore, useAchievementTracker, useGameStore } from '@/stores';
import { useHydration } from '@/lib/useHydration';
import { useAudio } from '@/hooks/useAudio';
import { useParticles } from '@/hooks/useParticles';
import { ALL_CUSTOMERS } from '@/types';
import type { ClothingShape, ClothingColor, ClothingPattern, PriceLevel, Customer } from '@/types';

type WorkshopStep = 'shape' | 'color' | 'pattern' | 'price' | 'done';

const stepOrder: WorkshopStep[] = ['shape', 'color', 'pattern', 'price', 'done'];

const stepEmojis: Record<WorkshopStep, string> = {
  shape: '✂️',
  color: '🎨',
  pattern: '✨',
  price: '💰',
  done: '🎉',
};

/**
 * Inner component that uses search params
 * Wrapped in Suspense for Next.js App Router requirements
 */
function WorkshopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrated = useHydration();
  const { playSfx, playBgm, stopBgm } = useAudio();
  const { sparkles } = useParticles();
  const achievementTracker = useAchievementTracker();
  const addItem = useInventoryStore((state) => state.addItem);
  const items = useInventoryStore((state) => state.items);
  const itemCount = items.length;
  const unlockedColors = useGameStore((state) => state.getUnlockedColors());
  const unlockedPatterns = useGameStore((state) => state.getUnlockedPatterns());

  // Check if we're in make-to-order mode
  const makeToOrderParam = searchParams.get('makeToOrder');
  const isMakeToOrder = Boolean(makeToOrderParam);

  // Find the customer for make-to-order
  const makeToOrderCustomer: Customer | undefined = isMakeToOrder
    ? ALL_CUSTOMERS.find((c) => c.id === makeToOrderParam)
    : undefined;

  // Play workshop BGM on mount
  useEffect(() => {
    playBgm('workshop-loop');
    return () => stopBgm();
  }, [playBgm, stopBgm]);

  // Get default values from customer preferences for make-to-order
  const getDefaultShape = useCallback((): ClothingShape => {
    if (makeToOrderCustomer?.wants.shapes?.length) {
      return makeToOrderCustomer.wants.shapes[0];
    }
    return 'shirt';
  }, [makeToOrderCustomer]);

  const getDefaultColor = useCallback((): ClothingColor => {
    if (makeToOrderCustomer?.wants.colors?.length) {
      // Find the first preferred color that is unlocked
      const preferredUnlocked = makeToOrderCustomer.wants.colors.find((c) =>
        unlockedColors.includes(c)
      );
      return preferredUnlocked || unlockedColors[0] || 'pink';
    }
    return 'pink';
  }, [makeToOrderCustomer, unlockedColors]);

  // Current creation state
  const [currentStep, setCurrentStep] = useState<WorkshopStep>('shape');
  const [shape, setShape] = useState<ClothingShape>('shirt');
  const [color, setColor] = useState<ClothingColor>('pink');
  const [pattern, setPattern] = useState<ClothingPattern>('none');
  const [price, setPrice] = useState<PriceLevel>(1);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize with customer preferences when they load
  useEffect(() => {
    if (makeToOrderCustomer && unlockedColors.length > 0) {
      setShape(getDefaultShape());
      setColor(getDefaultColor());
      if (makeToOrderCustomer.wants.maxPrice) {
        setPrice(makeToOrderCustomer.wants.maxPrice);
      }
    }
  }, [makeToOrderCustomer, unlockedColors, getDefaultShape, getDefaultColor]);

  const currentStepIndex = stepOrder.indexOf(currentStep);

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex]);
    }
  };

  const goPrev = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex]);
    }
  };

  const saveClothing = () => {
    const newItem = {
      id: uuidv4(),
      shape,
      color,
      pattern,
      doodles: [],
      price,
      createdAt: Date.now(),
    };
    addItem(newItem);
    playSfx('sparkle');
    sparkles();
    setShowSuccess(true);

    // Track achievements
    achievementTracker.trackItemCreated();

    // Track unique colors used across all items (including the new one)
    const allColors = new Set([...items.map((item) => item.color), color]);
    achievementTracker.trackColorsUsed(allColors);

    // Reset after animation - navigate based on mode
    setTimeout(() => {
      setShowSuccess(false);
      if (isMakeToOrder) {
        // Return to store for make-to-order
        router.push('/store');
      } else {
        // Normal flow - stay in workshop
        setCurrentStep('shape');
        setShape('shirt');
        setColor('pink');
        setPattern('none');
        setPrice(1);
      }
    }, 1500);
  };

  // Handle back navigation based on mode
  const handleBackToHome = () => {
    if (isMakeToOrder) {
      // In make-to-order mode, go back to store
      router.push('/store');
    } else {
      router.push('/');
    }
  };

  if (!hydrated) {
    return (
      <main className="bg-workshop min-h-screen flex items-center justify-center">
        <motion.div
          className="text-6xl"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        >
          🎨
        </motion.div>
      </main>
    );
  }

  return (
    <main className="bg-workshop min-h-screen flex flex-col p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <BigButton onClick={handleBackToHome} color="purple" size="normal">
          <span className="text-2xl">{isMakeToOrder ? '🏪' : '🏠'}</span>
        </BigButton>

        {/* Make-to-order indicator or step indicator */}
        {isMakeToOrder && makeToOrderCustomer ? (
          <motion.div
            className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full border-2 border-purple-300"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <span className="text-purple-600 font-bold">For</span>
            <CustomerAvatar customer={makeToOrderCustomer} size="small" showName={true} />
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              ✨
            </motion.span>
          </motion.div>
        ) : (
          <div className="flex items-center gap-2 text-2xl">
            {stepOrder.slice(0, -1).map((step, i) => (
              <motion.span
                key={step}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${i <= currentStepIndex ? 'bg-purple-300' : 'bg-gray-200'}
                `}
                animate={i === currentStepIndex ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {stepEmojis[step]}
              </motion.span>
            ))}
          </div>
        )}

        <div className="text-purple-600 font-bold text-xl">
          🧺 {itemCount}
        </div>
      </div>

      {/* Make-to-order hint banner */}
      {isMakeToOrder && makeToOrderCustomer && (
        <motion.div
          className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-xl border-2 border-purple-200 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <p className="text-purple-700">
            {makeToOrderCustomer.displayName} is waiting! Make something they&apos;ll love! 💜
          </p>
          {makeToOrderCustomer.wants.colors && makeToOrderCustomer.wants.colors.length > 0 && (
            <p className="text-sm text-purple-500 mt-1">
              Hint: They like {makeToOrderCustomer.wants.colors.slice(0, 3).join(', ')} colors
            </p>
          )}
        </motion.div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 items-center justify-center">
        {/* Preview */}
        <GameCard className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-bold text-purple-600">Preview</h2>
          <motion.div
            layout
            className="relative"
          >
            <ClothingPreview
              shape={shape}
              color={color}
              pattern={pattern}
              size="large"
            />
          </motion.div>
        </GameCard>

        {/* Step content */}
        <GameCard className="flex-1 max-w-md flex flex-col items-center gap-6">
          <AnimatePresence mode="wait">
            {currentStep === 'shape' && (
              <motion.div
                key="shape"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex flex-col items-center gap-6"
              >
                <h2 className="text-2xl font-bold text-purple-600">
                  ✂️ Pick a Shape!
                </h2>
                <ShapeSelector selected={shape} onSelect={setShape} />
              </motion.div>
            )}

            {currentStep === 'color' && (
              <motion.div
                key="color"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex flex-col items-center gap-6"
              >
                <h2 className="text-2xl font-bold text-purple-600">
                  🎨 Pick a Color!
                </h2>
                <ColorPicker selected={color} onSelect={setColor} unlockedColors={unlockedColors} />
              </motion.div>
            )}

            {currentStep === 'pattern' && (
              <motion.div
                key="pattern"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex flex-col items-center gap-6"
              >
                <h2 className="text-2xl font-bold text-purple-600">
                  ✨ Pick a Pattern!
                </h2>
                <PatternPicker selected={pattern} onSelect={setPattern} unlockedPatterns={unlockedPatterns} />
              </motion.div>
            )}

            {currentStep === 'price' && (
              <motion.div
                key="price"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex flex-col items-center gap-6"
              >
                <h2 className="text-2xl font-bold text-purple-600">
                  💰 Set a Price!
                </h2>
                <PricePicker selected={price} onSelect={setPrice} />
                {isMakeToOrder && makeToOrderCustomer && price > makeToOrderCustomer.wants.maxPrice && (
                  <motion.p
                    className="text-red-500 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    ⚠️ {makeToOrderCustomer.displayName} can only afford {'$'.repeat(makeToOrderCustomer.wants.maxPrice)}!
                  </motion.p>
                )}
              </motion.div>
            )}

            {currentStep === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-6"
              >
                <h2 className="text-2xl font-bold text-purple-600">
                  🎉 All Done!
                </h2>
                <p className="text-gray-600 text-center">
                  {isMakeToOrder
                    ? `Ready to deliver to ${makeToOrderCustomer?.displayName}?`
                    : 'Ready to add to your collection?'}
                </p>
                <BigButton onClick={saveClothing} color="green" size="large">
                  <span className="flex items-center gap-2">
                    <span className="text-3xl">{isMakeToOrder ? '🚀' : '✅'}</span>
                    {isMakeToOrder ? 'Deliver It!' : 'Save It!'}
                  </span>
                </BigButton>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {currentStep !== 'done' && (
            <div className="flex gap-4 mt-4">
              {currentStepIndex > 0 && (
                <BigButton onClick={goPrev} color="purple" size="normal">
                  ⬅️ Back
                </BigButton>
              )}
              <BigButton onClick={goNext} color="green" size="normal">
                Next ➡️
              </BigButton>
            </div>
          )}

          {currentStep === 'done' && (
            <BigButton onClick={goPrev} color="purple" size="normal">
              ⬅️ Change Something
            </BigButton>
          )}
        </GameCard>
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-white rounded-3xl p-12 text-center"
            >
              <motion.div
                className="text-8xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: 2, duration: 0.3 }}
              >
                {isMakeToOrder ? '🚀' : '🎉'}
              </motion.div>
              <h2 className="text-3xl font-bold text-purple-600">
                {isMakeToOrder ? 'Delivering!' : 'Saved!'}
              </h2>
              {isMakeToOrder && makeToOrderCustomer && (
                <p className="text-gray-500 mt-2">
                  Heading back to {makeToOrderCustomer.displayName}...
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/**
 * Workshop page wrapper with Suspense boundary
 * Required for useSearchParams in Next.js App Router
 */
export default function WorkshopPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-workshop min-h-screen flex items-center justify-center">
          <motion.div
            className="text-6xl"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          >
            🎨
          </motion.div>
        </main>
      }
    >
      <WorkshopContent />
    </Suspense>
  );
}
