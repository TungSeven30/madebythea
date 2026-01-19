# Made by Thea - Project Instructions

## Design Context

### Target Users
- **Primary**: 6-8 year old children (specifically Thea, age 6)
- **Device**: iPad-first, touch-only interaction
- **Reading Level**: Visual-only UI - no reading required to play

### Brand & Tone
- **Personality**: Playful, warm, encouraging
- **Theme**: Kawaii fashion boutique run by a child
- **Emotional Goal**: Delight and pride in creation, no frustration or failure states

### Visual Language

#### Color Palette
Soft pastels with high contrast for accessibility:
- **Pink**: `#FFB5D8` (primary accent)
- **Purple**: `#C9A0DC` (secondary accent)
- **Blue**: `#87CEEB` (sky blue)
- **Yellow**: `#FFFACD` (lemon)
- **Green**: `#98FB98` (pale green)
- **Orange**: `#FFDAB9` (peach)
- **Red**: `#FF6B6B` (coral)
- **White/Cream**: `#FFF5EE` (seashell)
- **Black**: `#4A4A4A` (soft black for outlines)

#### Typography
- **Primary Font**: `Comic Sans MS`, cursive fallback
- **Use**: Large, friendly text sizes for child readability

#### Iconography
- **Style**: Emoji-driven interface throughout
- **Examples**: Clothes (👗👕👖), emotions (😊😍), actions (✨🎉💰)
- **Purpose**: Universal understanding without text

### Interaction Patterns

#### Touch Targets
- **Minimum Size**: 60px × 60px for all interactive elements
- **Spacing**: Generous padding to prevent mis-taps
- **Feedback**: Immediate visual response on every tap

#### Animation Philosophy
- **Library**: Framer Motion with spring physics
- **Defaults**: `stiffness: 400, damping: 17` for bouncy feel
- **Principles**:
  - Every action gets animated feedback
  - Celebratory animations for success (sparkles, bounces)
  - Gentle transitions between states
  - No sudden or jarring movements

#### Feedback Loops
- **Success**: Sparkles, coins, happy sounds
- **Progress**: Visual patience bars, step indicators
- **Mistakes**: Gentle guidance, no punishment
- **Achievement**: Confetti, celebration overlays

### Page-Specific Contexts

#### Home (`/`)
- Welcoming hub with clear navigation
- Soft gradient background (`bg-home`)
- Large, inviting buttons to each activity

#### Workshop (`/workshop`)
- Creative crafting space
- Step-by-step wizard: Shape → Color → Pattern → Price
- Live preview of creation
- Celebratory save animation

#### Store (`/store`)
- Gameplay area serving customers
- Customer queue with patience indicators
- Inventory selection panel
- Coin rewards and streak bonuses

### Accessibility Considerations
- High contrast ratios on interactive elements
- No reliance on color alone for information
- Large touch targets exceed WCAG guidelines
- Audio feedback complements visual (when sounds added)

### Technical Constraints
- **Framework**: Next.js 14 with App Router
- **State**: Zustand with localStorage persistence
- **Animation**: Framer Motion (spring physics)
- **Styling**: Tailwind CSS with custom theme
- **Audio**: Web Audio API via AudioManager (files pending)
