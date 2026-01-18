'use client';

/**
 * Button with just an icon for toolbar actions
 */

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface IconButtonProps {
  onClick: () => void;
  children: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sizeStyles = {
  small: 'w-12 h-12 text-lg',
  medium: 'w-16 h-16 text-2xl',
  large: 'w-20 h-20 text-3xl',
};

export function IconButton({
  onClick,
  children,
  selected = false,
  disabled = false,
  size = 'medium',
  className = '',
}: IconButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-2xl border-4 font-bold
        flex items-center justify-center
        transition-all
        ${sizeStyles[size]}
        ${
          selected
            ? 'bg-purple-300 border-purple-500 shadow-lg scale-110'
            : 'bg-white border-gray-300 hover:border-purple-400'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={disabled ? {} : { scale: selected ? 1.1 : 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}
