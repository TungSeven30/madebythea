'use client';

/**
 * Large touch-friendly button for child interaction
 */

import { motion } from 'framer-motion';
import { ReactNode, useCallback } from 'react';
import { useClickSound } from '@/hooks/useAudio';

interface BigButtonProps {
  onClick: () => void;
  children: ReactNode;
  color?: 'pink' | 'purple' | 'blue' | 'green' | 'yellow' | 'orange';
  disabled?: boolean;
  size?: 'normal' | 'large' | 'huge';
  className?: string;
  /** Set to true to skip the click sound (useful for custom sounds) */
  silent?: boolean;
}

const colorStyles: Record<string, string> = {
  pink: 'bg-pink-300 hover:bg-pink-400 border-pink-500',
  purple: 'bg-purple-300 hover:bg-purple-400 border-purple-500',
  blue: 'bg-blue-300 hover:bg-blue-400 border-blue-500',
  green: 'bg-green-300 hover:bg-green-400 border-green-500',
  yellow: 'bg-yellow-300 hover:bg-yellow-400 border-yellow-500',
  orange: 'bg-orange-300 hover:bg-orange-400 border-orange-500',
};

const sizeStyles: Record<string, string> = {
  normal: 'px-6 py-4 text-xl min-w-[120px] min-h-[60px]',
  large: 'px-8 py-6 text-2xl min-w-[160px] min-h-[80px]',
  huge: 'px-12 py-8 text-3xl min-w-[200px] min-h-[100px]',
};

export function BigButton({
  onClick,
  children,
  color = 'pink',
  disabled = false,
  size = 'normal',
  className = '',
  silent = false,
}: BigButtonProps) {
  const playClick = useClickSound();

  const handleClick = useCallback(() => {
    if (!disabled) {
      if (!silent) playClick();
      onClick();
    }
  }, [disabled, silent, playClick, onClick]);

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      className={`
        rounded-2xl border-4 font-bold shadow-lg
        transition-colors
        ${colorStyles[color]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}
