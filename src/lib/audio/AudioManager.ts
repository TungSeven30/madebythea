/**
 * AudioManager - Singleton controller for all game audio
 *
 * Uses Howler.js for cross-browser audio support with iOS unlock handling.
 * Manages BGM (background music) with crossfading and SFX (sound effects).
 */

import { Howl, Howler } from 'howler';
import { SOUND_MANIFEST, type SoundId, type BgmId } from './sounds';

interface AudioManagerConfig {
  masterVolume: number;
  bgmVolume: number;
  sfxVolume: number;
  muted: boolean;
}

const DEFAULT_CONFIG: AudioManagerConfig = {
  masterVolume: 0.8,
  bgmVolume: 0.5,
  sfxVolume: 0.8,
  muted: false,
};

class AudioManagerClass {
  private static instance: AudioManagerClass | null = null;

  private sounds: Map<string, Howl> = new Map();
  private currentBgm: BgmId | null = null;
  private config: AudioManagerConfig = { ...DEFAULT_CONFIG };
  private initialized = false;
  private unlocked = false;

  private constructor() {
    // Private constructor for singleton
  }

  static getInstance(): AudioManagerClass {
    if (!AudioManagerClass.instance) {
      AudioManagerClass.instance = new AudioManagerClass();
    }
    return AudioManagerClass.instance;
  }

  /**
   * Initialize the audio system - must be called once on app start
   */
  init(): void {
    if (this.initialized) return;

    // Preload all sounds
    Object.entries(SOUND_MANIFEST).forEach(([id, config]) => {
      const howl = new Howl({
        src: [config.src],
        loop: config.loop ?? false,
        volume: config.volume ?? 1,
        preload: config.preload ?? true,
      });
      this.sounds.set(id, howl);
    });

    // Setup iOS unlock handler
    this.setupIOSUnlock();

    this.initialized = true;
  }

  /**
   * Handle iOS WebAudio unlock on first user interaction
   */
  private setupIOSUnlock(): void {
    const unlock = (): void => {
      if (this.unlocked) return;

      // Create and play a silent buffer to unlock WebAudio
      Howler.ctx?.resume();
      this.unlocked = true;

      // Remove listeners after unlock
      document.removeEventListener('touchstart', unlock, true);
      document.removeEventListener('touchend', unlock, true);
      document.removeEventListener('click', unlock, true);
    };

    document.addEventListener('touchstart', unlock, true);
    document.addEventListener('touchend', unlock, true);
    document.addEventListener('click', unlock, true);
  }

  /**
   * Play a sound effect (short, one-shot sounds)
   */
  playSfx(id: SoundId): void {
    if (this.config.muted) return;

    const sound = this.sounds.get(id);
    if (sound) {
      sound.volume(this.config.sfxVolume * this.config.masterVolume);
      sound.play();
    }
  }

  /**
   * Play background music with optional crossfade
   */
  playBgm(id: BgmId, crossfadeDuration = 1000): void {
    if (this.currentBgm === id) return;

    const newBgm = this.sounds.get(id);
    if (!newBgm) return;

    const targetVolume = this.config.muted
      ? 0
      : this.config.bgmVolume * this.config.masterVolume;

    // Fade out current BGM
    if (this.currentBgm) {
      const currentSound = this.sounds.get(this.currentBgm);
      if (currentSound) {
        currentSound.fade(currentSound.volume(), 0, crossfadeDuration);
        setTimeout(() => currentSound.stop(), crossfadeDuration);
      }
    }

    // Fade in new BGM
    newBgm.volume(0);
    newBgm.play();
    newBgm.fade(0, targetVolume, crossfadeDuration);
    this.currentBgm = id;
  }

  /**
   * Stop current background music
   */
  stopBgm(fadeDuration = 500): void {
    if (!this.currentBgm) return;

    const sound = this.sounds.get(this.currentBgm);
    if (sound) {
      sound.fade(sound.volume(), 0, fadeDuration);
      setTimeout(() => sound.stop(), fadeDuration);
    }
    this.currentBgm = null;
  }

  /**
   * Set master volume (affects all audio)
   */
  setMasterVolume(volume: number): void {
    this.config.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  /**
   * Set BGM volume
   */
  setBgmVolume(volume: number): void {
    this.config.bgmVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  /**
   * Set SFX volume
   */
  setSfxVolume(volume: number): void {
    this.config.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Toggle mute state
   */
  toggleMute(): boolean {
    this.config.muted = !this.config.muted;
    this.updateVolumes();
    return this.config.muted;
  }

  /**
   * Set mute state
   */
  setMuted(muted: boolean): void {
    this.config.muted = muted;
    this.updateVolumes();
  }

  /**
   * Check if audio is muted
   */
  isMuted(): boolean {
    return this.config.muted;
  }

  /**
   * Update volumes for currently playing sounds
   */
  private updateVolumes(): void {
    if (this.currentBgm) {
      const bgmSound = this.sounds.get(this.currentBgm);
      if (bgmSound) {
        const targetVolume = this.config.muted
          ? 0
          : this.config.bgmVolume * this.config.masterVolume;
        bgmSound.volume(targetVolume);
      }
    }
  }

  /**
   * Get current config (for persistence)
   */
  getConfig(): AudioManagerConfig {
    return { ...this.config };
  }

  /**
   * Load config (from persistence)
   */
  loadConfig(config: Partial<AudioManagerConfig>): void {
    this.config = { ...this.config, ...config };
    this.updateVolumes();
  }

  /**
   * Check if audio system is ready
   */
  isReady(): boolean {
    return this.initialized && this.unlocked;
  }
}

// Export singleton instance
export const AudioManager = AudioManagerClass.getInstance();
export type { AudioManagerConfig };
