'use client';

/**
 * Sparkles - CSS-based sparkle animation overlay
 *
 * Pure CSS animation for lightweight, continuous sparkle effects.
 * Used for highlighting items or areas of interest.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SparkleProps {
  /** Number of sparkle particles */
  count?: number;
  /** Color of sparkles */
  color?: string;
  /** Size range for sparkles */
  sizeRange?: [number, number];
  /** Duration of animation cycle in seconds */
  duration?: number;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

function generateSparkle(
  id: number,
  sizeRange: [number, number]
): Sparkle {
  return {
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
    delay: Math.random() * 2,
  };
}

export function Sparkles({
  count = 8,
  color = '#fbbf24',
  sizeRange = [4, 12],
  duration = 1.5,
}: SparkleProps): React.ReactNode {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const initial = Array.from({ length: count }, (_, i) =>
      generateSparkle(i, sizeRange)
    );
    setSparkles(initial);

    // Regenerate sparkles periodically
    const interval = setInterval(() => {
      setSparkles((prev) =>
        prev.map((s) => generateSparkle(s.id, sizeRange))
      );
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [count, sizeRange, duration]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: sparkle.size,
              height: sparkle.size,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180],
            }}
            transition={{
              duration,
              delay: sparkle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill={color}
              className="w-full h-full"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * SparkleWrapper - Wraps children with optional sparkle overlay
 */
interface SparkleWrapperProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  sparkleProps?: SparkleProps;
}

export function SparkleWrapper({
  children,
  active = true,
  className = '',
  sparkleProps,
}: SparkleWrapperProps): React.ReactNode {
  return (
    <div className={`relative ${className}`}>
      {children}
      {active && <Sparkles {...sparkleProps} />}
    </div>
  );
}
