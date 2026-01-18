'use client';

/**
 * Workshop Page - Create new clothing items
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { BigButton, GameCard } from '@/components/ui';
import { ClothingPreview } from '@/components/shared';
import {
  ShapeSelector,
  ColorPicker,
  PatternPicker,
  PricePicker,
} from '@/components/workshop';
import { useInventoryStore } from '@/stores';
import type { ClothingShape, ClothingColor, ClothingPattern, PriceLevel } from '@/types';

type WorkshopStep = 'shape' | 'color' | 'pattern' | 'price' | 'done';

const stepOrder: WorkshopStep[] = ['shape', 'color', 'pattern', 'price', 'done'];

const stepEmojis: Record<WorkshopStep, string> = {
  shape: '✂️',
  color: '🎨',
  pattern: '✨',
  price: '💰',
  done: '🎉',
};

export default function WorkshopPage() {
  const router = useRouter();
  const addItem = useInventoryStore((state) => state.addItem);
  const itemCount = useInventoryStore((state) => state.items.length);

  // Current creation state
  const [currentStep, setCurrentStep] = useState<WorkshopStep>('shape');
  const [shape, setShape] = useState<ClothingShape>('shirt');
  const [color, setColor] = useState<ClothingColor>('pink');
  const [pattern, setPattern] = useState<ClothingPattern>('none');
  const [price, setPrice] = useState<PriceLevel>(1);
  const [showSuccess, setShowSuccess] = useState(false);

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
    setShowSuccess(true);

    // Reset after animation
    setTimeout(() => {
      setShowSuccess(false);
      setCurrentStep('shape');
      setShape('shirt');
      setColor('pink');
      setPattern('none');
      setPrice(1);
    }, 1500);
  };

  return (
    <main className="bg-workshop min-h-screen flex flex-col p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <BigButton onClick={() => router.push('/')} color="purple" size="normal">
          <span className="text-2xl">🏠</span>
        </BigButton>

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

        <div className="text-purple-600 font-bold text-xl">
          🧺 {itemCount}
        </div>
      </div>

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
                <ColorPicker selected={color} onSelect={setColor} />
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
                <PatternPicker selected={pattern} onSelect={setPattern} />
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
                  Ready to add to your collection?
                </p>
                <BigButton onClick={saveClothing} color="green" size="large">
                  <span className="flex items-center gap-2">
                    <span className="text-3xl">✅</span>
                    Save It!
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
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold text-purple-600">
                Saved!
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
