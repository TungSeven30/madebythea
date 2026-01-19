'use client';

/**
 * "Make it!" button that appears when tapping a customer without a matching item.
 * Triggers make-to-order flow: reserves customer and navigates to workshop.
 */

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/stores/gameStore';
import { useClickSound } from '@/hooks/useAudio';
import type { RuntimeCustomer } from '@/types';

interface MakeItButtonProps {
  customer: RuntimeCustomer;
  onMakeItStart: (customerId: string) => void;
}

export function MakeItButton({ customer, onMakeItStart }: MakeItButtonProps) {
  const router = useRouter();
  const playClick = useClickSound();
  const setMakeToOrder = useGameStore((state) => state.setMakeToOrder);

  const handleMakeIt = () => {
    playClick();

    // Set the customer as make-to-order in global state
    setMakeToOrder(customer.id);

    // Notify parent to mark customer as reserved
    onMakeItStart(customer.id);

    // Navigate to workshop with make-to-order param
    router.push(`/workshop?makeToOrder=${customer.id}`);
  };

  return (
    <motion.button
      onClick={handleMakeIt}
      className="
        px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400
        text-white font-bold text-lg rounded-full
        border-4 border-purple-500 shadow-lg
        flex items-center gap-2
      "
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <span>Make it!</span>
      <motion.span
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, duration: 0.5 }}
      >
        ✨
      </motion.span>
    </motion.button>
  );
}
