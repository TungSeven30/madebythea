'use client';

/**
 * Customer avatar display with fallback to emoji
 * Supports VIP badge and patience-based moods
 */

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import type { Customer, CustomerMood, RuntimeCustomer } from '@/types';

interface CustomerAvatarProps {
  customer: Customer | RuntimeCustomer;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  mood?: CustomerMood;
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

const emojiSizes = {
  small: 'text-3xl',
  medium: 'text-5xl',
  large: 'text-6xl',
};

/**
 * Check if avatar is an emoji (creature types use emojis)
 */
function isEmojiAvatar(avatar: string): boolean {
  return !avatar.startsWith('/') && !avatar.startsWith('http');
}

/**
 * Get fallback emoji for people
 */
function getPersonEmoji(): string {
  return '👤';
}

/**
 * Check if customer is a RuntimeCustomer with modifiers
 */
function isRuntimeCustomer(customer: Customer | RuntimeCustomer): customer is RuntimeCustomer {
  return 'modifiers' in customer;
}

export function CustomerAvatar({
  customer,
  size = 'medium',
  showName = true,
  mood = 'neutral',
  className = '',
}: CustomerAvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  const isVIP = isRuntimeCustomer(customer) && customer.modifiers.isVIP;
  const useEmoji = isEmojiAvatar(customer.avatar);

  const moodAnimation = {
    neutral: {},
    happy: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
    },
    impatient: {
      x: [-2, 2, -2, 2, 0],
      transition: { duration: 0.3, repeat: Infinity, repeatDelay: 1 },
    },
  };

  const moodEmoji: Record<CustomerMood, string> = {
    happy: '😊',
    neutral: '',
    impatient: '😤',
  };

  return (
    <motion.div
      className={`relative flex flex-col items-center gap-1 ${className}`}
      animate={moodAnimation[mood]}
      transition={{ duration: 0.5, repeat: mood === 'happy' ? 2 : 0 }}
    >
      {/* VIP Crown */}
      {isVIP && (
        <motion.div
          className="absolute -top-4 z-10 text-2xl"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          👑
        </motion.div>
      )}

      <div
        className={`
          ${sizeStyles[size]}
          rounded-full 
          ${isVIP 
            ? 'bg-gradient-to-br from-yellow-200 to-yellow-400 border-yellow-500 ring-4 ring-yellow-300' 
            : 'bg-gradient-to-br from-purple-200 to-pink-200'
          }
          border-4 ${isVIP ? 'border-yellow-500' : 'border-white'} shadow-lg
          flex items-center justify-center
          overflow-hidden
        `}
      >
        {useEmoji || imageError ? (
          <span className={emojiSizes[size]}>
            {useEmoji ? customer.avatar : getPersonEmoji()}
          </span>
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
            font-bold ${isVIP ? 'text-yellow-700' : 'text-purple-800'}
            ${nameStyles[size]}
          `}
        >
          {customer.displayName}
          {isVIP && ' ⭐'}
        </span>
      )}

      {/* Mood indicator */}
      {mood !== 'neutral' && moodEmoji[mood] && (
        <motion.span
          className="absolute -top-2 -right-2 text-xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {moodEmoji[mood]}
        </motion.span>
      )}
    </motion.div>
  );
}
