'use client';

/**
 * Pulsing beacon to draw attention to interactive elements
 * Use when an element needs attention but tutorial isn't active
 */

import { motion } from 'framer-motion';

interface TutorialBeaconProps {
  /** Position relative to parent */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  /** Size of the beacon */
  size?: 'small' | 'medium' | 'large';
  /** Color theme */
  color?: 'purple' | 'pink' | 'yellow' | 'green';
  /** Whether beacon is visible */
  show?: boolean;
  className?: string;
}

const sizeMap = {
  small: 'w-3 h-3',
  medium: 'w-4 h-4',
  large: 'w-6 h-6',
};

const pulseSize = {
  small: 'w-6 h-6',
  medium: 'w-8 h-8',
  large: 'w-12 h-12',
};

const colorMap = {
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
};

const pulseColorMap = {
  purple: 'bg-purple-400',
  pink: 'bg-pink-400',
  yellow: 'bg-yellow-400',
  green: 'bg-green-400',
};

const positionMap = {
  'top-left': '-top-1 -left-1',
  'top-right': '-top-1 -right-1',
  'bottom-left': '-bottom-1 -left-1',
  'bottom-right': '-bottom-1 -right-1',
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
};

export function TutorialBeacon({
  position = 'top-right',
  size = 'medium',
  color = 'purple',
  show = true,
  className = '',
}: TutorialBeaconProps) {
  if (!show) return null;

  return (
    <div className={`absolute ${positionMap[position]} ${className}`}>
      {/* Pulsing ring */}
      <motion.div
        className={`absolute ${pulseSize[size]} ${pulseColorMap[color]} rounded-full`}
        style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Solid center */}
      <div
        className={`relative ${sizeMap[size]} ${colorMap[color]} rounded-full shadow-lg`}
      />
    </div>
  );
}
