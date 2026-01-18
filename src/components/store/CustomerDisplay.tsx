'use client';

/**
 * Display a customer with their thought bubble
 */

import { motion, AnimatePresence } from 'framer-motion';
import { CustomerAvatar } from '@/components/shared';
import { ThoughtBubble } from './ThoughtBubble';
import type { Customer } from '@/types';

interface CustomerDisplayProps {
  customer: Customer;
  isSelected: boolean;
  onTap: () => void;
  mood?: 'neutral' | 'happy' | 'sad';
  showBubble?: boolean;
}

export function CustomerDisplay({
  customer,
  isSelected,
  onTap,
  mood = 'neutral',
  showBubble = true,
}: CustomerDisplayProps) {
  return (
    <motion.div
      className={`
        relative flex flex-col items-center cursor-pointer p-4 rounded-2xl
        ${isSelected ? 'bg-purple-100 ring-4 ring-purple-400' : ''}
      `}
      onClick={onTap}
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -200, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {/* Thought bubble */}
      {showBubble && (
        <div className="mb-2">
          <ThoughtBubble wants={customer.wants} />
        </div>
      )}

      {/* Avatar */}
      <CustomerAvatar
        customer={customer}
        size="medium"
        mood={mood}
        showName={true}
      />

      {/* Selection indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute -bottom-2 text-2xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            👆 Tap clothes!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
