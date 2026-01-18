'use client';

/**
 * Sale result popup
 */

import { motion } from 'framer-motion';

interface SaleResultProps {
  success: boolean;
  reason?: string;
  coins?: number;
  onDone: () => void;
}

export function SaleResult({ success, reason, coins, onDone }: SaleResultProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDone}
    >
      <motion.div
        className={`
          rounded-3xl p-8 text-center shadow-2xl
          ${success ? 'bg-green-100 border-4 border-green-400' : 'bg-red-100 border-4 border-red-300'}
        `}
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="text-8xl mb-4"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: 2, duration: 0.3 }}
        >
          {success ? '😊' : '😢'}
        </motion.div>

        <h2 className={`text-3xl font-bold mb-2 ${success ? 'text-green-600' : 'text-red-500'}`}>
          {success ? 'Sold!' : 'No thanks...'}
        </h2>

        {success && coins && (
          <motion.div
            className="text-2xl text-yellow-600 font-bold"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            +🪙 {coins}
          </motion.div>
        )}

        {!success && reason && (
          <p className="text-lg text-gray-600">{reason}</p>
        )}

        <p className="text-sm text-gray-400 mt-4">Tap to continue</p>
      </motion.div>
    </motion.div>
  );
}
