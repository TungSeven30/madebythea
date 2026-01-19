'use client';

/**
 * Animated hand gesture indicator for tutorials
 * Shows tap, swipe, or hold gestures visually
 */

import { motion } from 'framer-motion';

interface GestureIndicatorProps {
  type: 'tap' | 'swipe' | 'hold';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sizeMap = {
  small: 'text-4xl',
  medium: 'text-6xl',
  large: 'text-8xl',
};

export function GestureIndicator({
  type,
  size = 'medium',
  className = '',
}: GestureIndicatorProps) {
  const sizeClass = sizeMap[size];

  // Tap animation - finger pointing and pressing
  if (type === 'tap') {
    return (
      <motion.div
        className={`${sizeClass} ${className}`}
        initial={{ scale: 1, y: 0 }}
        animate={{
          scale: [1, 0.9, 1],
          y: [0, 10, 0],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
      >
        👆
      </motion.div>
    );
  }

  // Swipe animation - hand moving side to side or up/down
  if (type === 'swipe') {
    return (
      <motion.div
        className={`${sizeClass} ${className}`}
        initial={{ x: -20, rotate: -10 }}
        animate={{
          x: [20, -20, 20],
          rotate: [-10, 10, -10],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        ✋
      </motion.div>
    );
  }

  // Hold animation - finger pressing and staying
  if (type === 'hold') {
    return (
      <div className={`relative ${className}`}>
        <motion.div
          className={sizeClass}
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 0.85, 0.85, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            times: [0, 0.2, 0.8, 1],
          }}
        >
          👇
        </motion.div>
        {/* Progress ring to show hold duration */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            times: [0, 0.2, 0.8, 1],
          }}
        >
          <svg className="w-20 h-20" viewBox="0 0 100 100">
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(168, 85, 247, 0.5)"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 1, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                times: [0, 0.8, 0.8, 1],
              }}
              style={{
                rotate: -90,
                transformOrigin: 'center',
              }}
            />
          </svg>
        </motion.div>
      </div>
    );
  }

  return null;
}
