'use client';

/**
 * Display a customer with their thought bubble and patience indicator
 * Supports make-to-order state with "Making..." badge
 */

import { motion, AnimatePresence } from 'framer-motion';
import { CustomerAvatar } from '@/components/shared';
import { ThoughtBubble } from './ThoughtBubble';
import type { Customer, RuntimeCustomer, CustomerMood } from '@/types';

interface CustomerDisplayProps {
  customer: Customer | RuntimeCustomer;
  isSelected: boolean;
  onTap: () => void;
  mood?: CustomerMood;
  showBubble?: boolean;
  isMakingOrder?: boolean; // Shows "Making..." badge and blue patience bar
}

/**
 * Check if customer is a RuntimeCustomer
 */
function isRuntimeCustomer(customer: Customer | RuntimeCustomer): customer is RuntimeCustomer {
  return 'patience' in customer;
}

/**
 * Get patience bar color based on patience level and make-to-order state
 */
function getPatienceColor(patience: number, isMakingOrder: boolean): string {
  if (isMakingOrder) {
    return 'bg-blue-400'; // Blue for make-to-order (waiting for crafted item)
  }
  if (patience > 60) return 'bg-green-400';
  if (patience > 30) return 'bg-yellow-400';
  return 'bg-red-400';
}

export function CustomerDisplay({
  customer,
  isSelected,
  onTap,
  mood = 'neutral',
  showBubble = true,
  isMakingOrder = false,
}: CustomerDisplayProps) {
  const isRuntime = isRuntimeCustomer(customer);
  const isVIP = isRuntime && customer.modifiers.isVIP;
  const patience = isRuntime ? customer.patience : 100;
  const maxPatience = isRuntime ? customer.maxPatience : 100;
  const patiencePercent = (patience / maxPatience) * 100;

  return (
    <motion.div
      className={`
        relative flex flex-col items-center cursor-pointer p-4 rounded-2xl
        ${isSelected ? 'bg-purple-100 ring-4 ring-purple-400' : ''}
        ${isVIP ? 'bg-gradient-to-b from-yellow-50 to-yellow-100' : ''}
        ${isMakingOrder ? 'bg-gradient-to-b from-blue-50 to-purple-50 ring-2 ring-blue-300' : ''}
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
      {showBubble && !isMakingOrder && (
        <div className="mb-2">
          <ThoughtBubble wants={customer.wants} />
        </div>
      )}

      {/* Making order thought bubble replacement */}
      {isMakingOrder && (
        <motion.div
          className="mb-2 bg-blue-100 border-2 border-blue-300 px-3 py-1 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <motion.span
            className="text-blue-600 font-bold flex items-center gap-1"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <span>Making...</span>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              ✨
            </motion.span>
          </motion.span>
        </motion.div>
      )}

      {/* Avatar */}
      <CustomerAvatar
        customer={customer}
        size="medium"
        mood={mood}
        showName={true}
      />

      {/* Patience bar (only for runtime customers) */}
      {isRuntime && (
        <div className="w-full mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${getPatienceColor(patience, isMakingOrder)} rounded-full`}
            initial={{ width: '100%' }}
            animate={{ width: `${patiencePercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* VIP indicator */}
      {isVIP && !isMakingOrder && (
        <motion.div
          className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full shadow"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.5 }}
        >
          2x💰
        </motion.div>
      )}

      {/* Make-to-order indicator (replaces VIP badge when making) */}
      {isMakingOrder && (
        <motion.div
          className="absolute -top-1 -right-1 bg-blue-400 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          🪡
        </motion.div>
      )}

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

      {/* Impatient shake effect (disabled for make-to-order) */}
      {mood === 'impatient' && !isMakingOrder && (
        <motion.div
          className="absolute inset-0 border-4 border-red-400 rounded-2xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
