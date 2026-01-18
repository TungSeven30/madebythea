'use client';

/**
 * Card wrapper for content areas with rounded corners and shadow
 */

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GameCardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export function GameCard({
  children,
  className = '',
  animate = true,
}: GameCardProps) {
  const Component = animate ? motion.div : 'div';
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
      }
    : {};

  return (
    <Component
      className={`
        bg-white/90 backdrop-blur-sm
        rounded-3xl border-4 border-white
        shadow-xl p-6
        ${className}
      `}
      {...animationProps}
    >
      {children}
    </Component>
  );
}
