'use client';

/**
 * Customer avatar display with fallback to emoji
 */

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import type { Customer } from '@/types';

interface CustomerAvatarProps {
  customer: Customer;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  mood?: 'neutral' | 'happy' | 'sad';
  className?: string;
}

const sizeStyles = {
  small: 'w-16 h-16',
  medium: 'w-24 h-24',
  large: 'w-32 h-32',
};

const nameStyles = {
  small: 'text-xs',
  medium: 'text-sm',
  large: 'text-base',
};

/**
 * Get fallback emoji for creature types
 */
function getCreatureEmoji(id: string): string {
  const emojiMap: Record<string, string> = {
    unicorn: '🦄',
    fairy: '🧚',
    dragon: '🐉',
    cat: '🐱',
    bunny: '🐰',
  };
  return emojiMap[id] ?? '😊';
}

/**
 * Get fallback emoji for people
 */
function getPersonEmoji(): string {
  return '👤';
}

export function CustomerAvatar({
  customer,
  size = 'medium',
  showName = true,
  mood = 'neutral',
  className = '',
}: CustomerAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const fallbackEmoji =
    customer.type === 'creature'
      ? getCreatureEmoji(customer.id)
      : getPersonEmoji();

  const moodAnimation = {
    neutral: {},
    happy: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
    },
    sad: {
      y: [0, 5, 0],
    },
  };

  return (
    <motion.div
      className={`flex flex-col items-center gap-1 ${className}`}
      animate={moodAnimation[mood]}
      transition={{ duration: 0.5, repeat: mood !== 'neutral' ? 2 : 0 }}
    >
      <div
        className={`
          ${sizeStyles[size]}
          rounded-full bg-gradient-to-br from-purple-200 to-pink-200
          border-4 border-white shadow-lg
          flex items-center justify-center
          overflow-hidden
        `}
      >
        {imageError ? (
          <span className="text-4xl">{fallbackEmoji}</span>
        ) : (
          <Image
            src={customer.avatar}
            alt={customer.displayName}
            width={128}
            height={128}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {showName && (
        <span
          className={`
            font-bold text-purple-800
            ${nameStyles[size]}
          `}
        >
          {customer.displayName}
        </span>
      )}

      {/* Mood indicator */}
      {mood === 'happy' && (
        <motion.span
          className="absolute -top-2 -right-2 text-2xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          😊
        </motion.span>
      )}
      {mood === 'sad' && (
        <motion.span
          className="absolute -top-2 -right-2 text-2xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          😢
        </motion.span>
      )}
    </motion.div>
  );
}
