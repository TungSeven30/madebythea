/**
 * Particle Effects Library
 *
 * Wrapper around canvas-confetti for game-specific particle effects.
 * All effects are optimized for mobile performance.
 */

import confetti, { type Options } from 'canvas-confetti';

// Performance constants
const MAX_PARTICLES = 150;

/**
 * Base confetti with performance guardrails
 */
function safeConfetti(options: Options): ReturnType<typeof confetti> {
  return confetti({
    ...options,
    particleCount: Math.min(options.particleCount ?? 50, MAX_PARTICLES),
    disableForReducedMotion: true,
  });
}

/**
 * Celebration confetti burst - for wave completion, level up
 */
export function fireCelebration(): void {
  const duration = 2000;
  const end = Date.now() + duration;

  const colors = ['#ff6b9d', '#c084fc', '#60a5fa', '#4ade80', '#facc15'];

  (function frame() {
    safeConfetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors,
    });
    safeConfetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

/**
 * Coin burst - for successful sales
 * Gold/yellow themed with gravity
 */
export function fireCoinBurst(originX = 0.5, originY = 0.5): void {
  const coinColors = ['#fbbf24', '#f59e0b', '#d97706', '#fcd34d', '#fef3c7'];

  safeConfetti({
    particleCount: 50,
    spread: 60,
    origin: { x: originX, y: originY },
    colors: coinColors,
    shapes: ['circle'],
    gravity: 1.2,
    scalar: 1.2,
    ticks: 100,
  });
}

/**
 * Sparkle effect - for item creation, achievements
 * Star-shaped particles floating upward
 */
export function fireSparkles(originX = 0.5, originY = 0.5): void {
  const sparkleColors = ['#fff', '#fef3c7', '#fde68a', '#fcd34d'];

  safeConfetti({
    particleCount: 30,
    spread: 360,
    origin: { x: originX, y: originY },
    colors: sparkleColors,
    shapes: ['star'],
    gravity: -0.5,
    scalar: 0.8,
    ticks: 80,
    drift: 0,
  });
}

/**
 * Success burst - green themed for positive actions
 */
export function fireSuccess(originX = 0.5, originY = 0.5): void {
  const greenColors = ['#4ade80', '#22c55e', '#16a34a', '#bbf7d0'];

  safeConfetti({
    particleCount: 40,
    spread: 70,
    origin: { x: originX, y: originY },
    colors: greenColors,
    gravity: 0.8,
    scalar: 1,
    ticks: 80,
  });
}

/**
 * Failure burst - soft, short, sympathetic
 */
export function fireSoftFail(originX = 0.5, originY = 0.5): void {
  const softColors = ['#d4d4d8', '#a1a1aa', '#71717a'];

  safeConfetti({
    particleCount: 15,
    spread: 40,
    origin: { x: originX, y: originY },
    colors: softColors,
    gravity: 1.5,
    scalar: 0.6,
    ticks: 50,
  });
}

/**
 * Level up explosion - big celebration
 */
export function fireLevelUp(): void {
  const colors = ['#fbbf24', '#f59e0b', '#c084fc', '#a855f7'];

  // Big center burst
  safeConfetti({
    particleCount: 100,
    spread: 100,
    origin: { x: 0.5, y: 0.6 },
    colors,
    shapes: ['star', 'circle'],
    scalar: 1.5,
  });

  // Side bursts
  setTimeout(() => {
    safeConfetti({
      particleCount: 30,
      angle: 60,
      spread: 40,
      origin: { x: 0.2, y: 0.7 },
      colors,
    });
    safeConfetti({
      particleCount: 30,
      angle: 120,
      spread: 40,
      origin: { x: 0.8, y: 0.7 },
      colors,
    });
  }, 200);
}

/**
 * Achievement unlock - special rainbow burst
 */
export function fireAchievement(): void {
  const rainbowColors = [
    '#ef4444', // red
    '#f97316', // orange
    '#facc15', // yellow
    '#22c55e', // green
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
  ];

  // Staggered rainbow bursts
  rainbowColors.forEach((color, i) => {
    setTimeout(() => {
      safeConfetti({
        particleCount: 15,
        spread: 50,
        origin: { x: 0.3 + (i * 0.06), y: 0.6 },
        colors: [color],
        gravity: 0.6,
      });
    }, i * 50);
  });
}

/**
 * Reset/clear all particles
 */
export function clearParticles(): void {
  confetti.reset();
}

/**
 * Get confetti canvas element (for cleanup)
 */
export function getConfettiCanvas(): HTMLCanvasElement | null {
  return document.querySelector('canvas.confetti-canvas');
}
