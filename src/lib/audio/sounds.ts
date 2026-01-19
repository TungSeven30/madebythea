/**
 * Sound manifest and type definitions
 *
 * All game sounds are defined here with their paths and settings.
 * Actual audio files should be placed in public/sounds/
 */

// Sound effect IDs
export type SfxId =
  | 'click'
  | 'pop'
  | 'whoosh'
  | 'cha-ching'
  | 'sparkle'
  | 'success'
  | 'fail'
  | 'level-up'
  | 'achievement';

// Background music IDs
export type BgmId = 'home-loop' | 'workshop-loop' | 'store-loop';

// Combined sound ID type
export type SoundId = SfxId | BgmId;

interface SoundConfig {
  src: string;
  loop?: boolean;
  volume?: number;
  preload?: boolean;
}

/**
 * Sound manifest - defines all sounds and their settings
 *
 * Note: For production, you'll need to add actual audio files.
 * Good free sources:
 * - https://freesound.org
 * - https://opengameart.org
 * - https://soundsnap.com (subscription)
 *
 * Recommended formats: MP3 for broad compatibility, with WebM/OGG fallbacks
 */
export const SOUND_MANIFEST: Record<SoundId, SoundConfig> = {
  // UI Sound Effects
  click: {
    src: '/sounds/sfx/click.mp3',
    volume: 0.6,
  },
  pop: {
    src: '/sounds/sfx/pop.mp3',
    volume: 0.7,
  },
  whoosh: {
    src: '/sounds/sfx/whoosh.mp3',
    volume: 0.5,
  },

  // Game Sound Effects
  'cha-ching': {
    src: '/sounds/sfx/cha-ching.mp3',
    volume: 0.8,
  },
  sparkle: {
    src: '/sounds/sfx/sparkle.mp3',
    volume: 0.7,
  },
  success: {
    src: '/sounds/sfx/success.mp3',
    volume: 0.8,
  },
  fail: {
    src: '/sounds/sfx/fail.mp3',
    volume: 0.6,
  },
  'level-up': {
    src: '/sounds/sfx/level-up.mp3',
    volume: 0.9,
  },
  achievement: {
    src: '/sounds/sfx/achievement.mp3',
    volume: 0.9,
  },

  // Background Music
  'home-loop': {
    src: '/sounds/bgm/home-loop.mp3',
    loop: true,
    volume: 0.4,
  },
  'workshop-loop': {
    src: '/sounds/bgm/workshop-loop.mp3',
    loop: true,
    volume: 0.4,
  },
  'store-loop': {
    src: '/sounds/bgm/store-loop.mp3',
    loop: true,
    volume: 0.4,
  },
};

/**
 * Helper to check if a sound ID is BGM
 */
export function isBgm(id: SoundId): id is BgmId {
  return id.endsWith('-loop');
}

/**
 * Sound categories for easy filtering
 */
export const SOUND_CATEGORIES = {
  ui: ['click', 'pop', 'whoosh'] as SfxId[],
  game: ['cha-ching', 'sparkle', 'success', 'fail', 'level-up', 'achievement'] as SfxId[],
  bgm: ['home-loop', 'workshop-loop', 'store-loop'] as BgmId[],
};
