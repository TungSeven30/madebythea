'use client';

/**
 * Visual countdown timer for wave gameplay
 */

import { motion } from 'framer-motion';

interface TimerProps {
  seconds: number;
  totalSeconds: number;
}

export function Timer({ seconds, totalSeconds }: TimerProps) {
  const progress = seconds / totalSeconds;
  const isLow = seconds <= 10;

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className={`
          text-4xl font-bold
          ${isLow ? 'text-red-500' : 'text-purple-600'}
        `}
        animate={isLow ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
      >
        {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
      </motion.div>

      {/* Progress bar */}
      <div className="w-48 h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
        <motion.div
          className={`h-full ${isLow ? 'bg-red-400' : 'bg-purple-400'}`}
          initial={{ width: '100%' }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
