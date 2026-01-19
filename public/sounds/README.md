# Sound Files for Thea's Game

This directory contains the audio files for the game. You'll need to add the actual MP3 files.

## Where to Get Free Game Sounds

1. **OpenGameArt.org** - https://opengameart.org (CC0/Public Domain)
   - Search "UI sounds", "coin sound", "sparkle", "level up"
   
2. **Freesound.org** - https://freesound.org (Various licenses)
   - Great for specific sounds, check licenses
   
3. **Kenney.nl** - https://kenney.nl/assets (CC0)
   - Search "Interface Sounds" pack

## Required Sound Effects (sfx/)

| File | Description | Search Terms |
|------|-------------|--------------|
| `click.mp3` | Button tap | "UI click", "pop", "button" |
| `pop.mp3` | Selection/bubble | "bubble pop", "blip" |
| `whoosh.mp3` | Transitions | "whoosh", "swish" |
| `cha-ching.mp3` | Sale success | "cash register", "coin", "money" |
| `sparkle.mp3` | Item created | "magic sparkle", "twinkle", "chime" |
| `success.mp3` | Wave complete | "success", "win jingle", "fanfare short" |
| `fail.mp3` | Sale failed | "wrong", "soft fail", "aww" |
| `level-up.mp3` | Level up | "level up", "upgrade", "fanfare" |
| `achievement.mp3` | Achievement unlock | "achievement", "celebration", "tada" |

## Required Background Music (bgm/)

| File | Description | Search Terms |
|------|-------------|--------------|
| `home-loop.mp3` | Home screen | "cheerful loop", "happy", "menu music" |
| `workshop-loop.mp3` | Workshop/crafting | "creative music", "crafting", "playful loop" |
| `store-loop.mp3` | Store gameplay | "upbeat loop", "shop music", "exciting" |

## Format Requirements

- **Format**: MP3 (best compatibility, especially iOS Safari)
- **Sample Rate**: 44100 Hz
- **Bit Rate**: 128-192 kbps (good balance of quality/size)
- **Loops**: BGM should loop seamlessly

## Quick Download (OpenGameArt Recommendations)

1. **UI Sounds**: https://opengameart.org/content/51-ui-sound-effects-buttons-switches-and-டிசkcs
2. **Cash Register**: https://opengameart.org/content/cash-register
3. **Level Up/Success**: https://opengameart.org/content/level-up-power-up-coin-get
4. **Cute Music Loops**: https://opengameart.org/content/cute-piano-background-music

## Volume Levels (Pre-configured)

The AudioManager has these default volumes:
- SFX: 60-90% (varies per sound)
- BGM: 40% (background, not distracting)
- Master: 80%

## Testing

After adding files, test on iPad Safari specifically (iOS has WebAudio quirks).
The AudioManager includes iOS unlock handling that triggers on first user tap.
