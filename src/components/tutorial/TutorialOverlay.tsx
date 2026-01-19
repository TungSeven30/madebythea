'use client';

/**
 * Tutorial overlay with spotlight effect
 * Shows current tutorial step with gesture indicators
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useCallback } from 'react';
import { GestureIndicator } from './GestureIndicator';
import { useTutorialStore, TUTORIAL_DEFINITIONS, type TutorialId } from '@/stores';

interface TutorialOverlayProps {
  /** If provided, only show this specific tutorial */
  tutorialId?: TutorialId;
}

export function TutorialOverlay({ tutorialId }: TutorialOverlayProps) {
  const activeTutorial = useTutorialStore((state) => state.activeTutorial);
  const activeStepIndex = useTutorialStore((state) => state.activeStepIndex);
  const nextStep = useTutorialStore((state) => state.nextStep);
  const skipTutorial = useTutorialStore((state) => state.skipTutorial);

  const handleTap = useCallback(() => {
    nextStep();
  }, [nextStep]);

  const handleSkip = useCallback(() => {
    skipTutorial();
  }, [skipTutorial]);

  // If tutorialId is provided, only show that one
  const showTutorial = tutorialId ? activeTutorial === tutorialId : activeTutorial !== null;

  if (!showTutorial || !activeTutorial) {
    return null;
  }

  const steps = TUTORIAL_DEFINITIONS[activeTutorial];
  const currentStep = steps[activeStepIndex];

  if (!currentStep) {
    return null;
  }

  // Position mapping
  const positionClasses: Record<string, string> = {
    top: 'items-start pt-20',
    bottom: 'items-end pb-20',
    left: 'items-center justify-start pl-20',
    right: 'items-center justify-end pr-20',
    center: 'items-center justify-center',
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleTap}
      >
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div
          className={`relative w-full h-full flex flex-col ${
            positionClasses[currentStep.position || 'center']
          }`}
        >
          {/* Tutorial card */}
          <motion.div
            className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm mx-4 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Large emoji */}
            <motion.div
              className="text-7xl mb-4"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentStep.emoji}
            </motion.div>

            {/* Gesture indicator */}
            {currentStep.gesture && (
              <div className="flex justify-center mb-4">
                <GestureIndicator type={currentStep.gesture} size="large" />
              </div>
            )}

            {/* Tap to continue hint */}
            <motion.div
              className="text-purple-500 text-lg font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Tap anywhere to continue!
            </motion.div>

            {/* Skip button */}
            <button
              className="mt-4 text-gray-400 text-sm underline"
              onClick={handleSkip}
            >
              Skip
            </button>

            {/* Step indicator dots */}
            {steps.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === activeStepIndex
                        ? 'bg-purple-500'
                        : index < activeStepIndex
                        ? 'bg-purple-300'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
