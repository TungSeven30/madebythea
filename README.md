# ✨ Made by Thea

A creative maker game designed for young children (ages 4-6). Create items in the Workshop, then sell them to family members in the Store during timed rush waves.

Currently features a **Clothing Store** module where players design clothes and sell them to customers.

![Made by Thea](https://img.shields.io/badge/Made%20for-Kids-ff69b4)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## 🎮 Game Overview

### The Core Loop

```
┌──────────┐     ┌───────────┐     ┌─────────┐     ┌──────────┐
│   HOME   │ ──► │  WORKSHOP │ ──► │  STORE  │ ──► │ RESULTS  │
│  (Menu)  │     │  (Create) │     │  (Sell) │     │ (Review) │
└──────────┘     └───────────┘     └─────────┘     └──────────┘
```

1. **Workshop** - Create items step-by-step (shape → color → pattern → price)
2. **Store** - Customers arrive with preferences shown in thought bubbles
3. **Sell** - Match items to customer wants before time runs out
4. **Results** - See earnings, successful sales, and helpful tips

### Current Module: Clothing Store 👗

- **4 clothing shapes**: Shirt, Dress, Pants, Skirt
- **8 colors**: Pink, Purple, Blue, Green, Yellow, Orange, Red, White
- **5 patterns**: None, Stripes, Dots, Hearts, Stars
- **3 price tiers**: $ (5 coins), $$ (10 coins), $$$ (15 coins)

---

## 🎯 Design Principles

This game is built specifically for young children who may not yet read. Every design decision prioritizes accessibility and engagement for ages 4-6.

### No Reading Required

All interactions use **visual communication**:
- Emoji icons instead of text labels
- Color swatches instead of color names
- Shape silhouettes for clothing types
- Thought bubbles with visual hints (not text descriptions)

### Touch-First Interface

Optimized for iPad and touch devices:
- **Minimum 60px touch targets** - Large buttons easy for small fingers
- **Tap-to-select pattern** - Simpler than drag-and-drop for young children
- **No gestures required** - Single taps only, no swipes or pinches

### No Fail States

The game never punishes or discourages:
- Wrong matches simply don't sell (customer looks sad, not angry)
- Results screen shows "tips" not "mistakes"
- All feedback is encouraging and constructive
- Players can always try again with no penalty

### Visual Feedback

Every interaction provides immediate, satisfying feedback:
- Bouncy spring animations on button presses
- Success celebrations with emoji animations
- Coin counter animates when earning money
- Selected items pulse gently to show state

---

## 🏗️ Architecture

### Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety throughout |
| **Tailwind CSS** | Utility-first styling |
| **Zustand** | Lightweight state management |
| **Framer Motion** | Fluid animations |

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home screen
│   ├── workshop/page.tsx  # Item creation
│   ├── store/page.tsx     # Rush mode gameplay
│   └── results/page.tsx   # Wave summary
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── BigButton      # Large touch-friendly buttons
│   │   ├── CoinDisplay    # Animated coin counter
│   │   ├── GameCard       # Content card wrapper
│   │   ├── IconButton     # Icon-only buttons
│   │   ├── PriceTag       # Price level display
│   │   └── Timer          # Countdown with progress bar
│   ├── workshop/          # Workshop-specific components
│   │   ├── ShapeSelector  # Clothing type picker
│   │   ├── ColorPicker    # Color palette
│   │   ├── PatternPicker  # Pattern selector
│   │   └── PricePicker    # Price tier selector
│   ├── store/             # Store-specific components
│   │   ├── ClothesRack    # Display available items
│   │   ├── CustomerDisplay# Customer with thought bubble
│   │   ├── ThoughtBubble  # Visual preference hints
│   │   └── SaleResult     # Success/failure popup
│   └── shared/            # Cross-feature components
│       ├── ClothingPreview# SVG clothing renderer
│       └── CustomerAvatar # Customer image with fallback
├── stores/                # Zustand state stores
│   ├── inventoryStore     # Created items
│   └── gameStore          # Money, waves, settings
├── lib/                   # Utility functions
│   ├── colors.ts          # Color definitions
│   └── matching.ts        # Sale matching algorithm
└── types/                 # TypeScript definitions
    ├── clothing.ts        # Item types
    └── customer.ts        # Customer types
```

### State Management

Two Zustand stores handle all game state with **localStorage persistence**:

**Inventory Store**
- Stores all created clothing items
- Persists between sessions
- Items removed when sold

**Game Store**
- Total money earned
- Current wave number
- Wave results history
- Game settings (sound, wave duration)

---

## 🧮 Game Mechanics

### Customer Preference Matching

Each customer has preferences defined by:

```typescript
interface CustomerPreference {
  shapes?: ClothingShape[];  // Acceptable shapes (e.g., ['dress', 'skirt'])
  colors?: ClothingColor[];  // Preferred colors (e.g., ['pink', 'purple'])
  patterns?: string[];       // Wanted patterns (optional)
  maxPrice: PriceLevel;      // Maximum they'll pay (1, 2, or 3)
}
```

**Matching Algorithm** (`src/lib/matching.ts`):

1. **Price Check** - Item price must be ≤ customer's maxPrice
2. **Shape Check** - If customer has shape preferences, item must match one
3. **Color Check** - If customer has color preferences, item must match one
4. **Pattern Check** - If customer has pattern preferences, item must match one

A sale succeeds only if **all applicable checks pass**. Failed sales show the specific reason (too expensive, wrong shape, wrong color).

### Wave System

- **Wave Duration**: 90 seconds (configurable)
- **Customers per Wave**: Up to 8 randomly selected from available family members
- **Visible at Once**: Up to 3 customers shown simultaneously
- **Wave Ends When**: Timer expires OR all items sold OR all customers served

### Coin Economy

| Price Level | Display | Coins Earned |
|-------------|---------|--------------|
| 1 | $ | 5 |
| 2 | $$ | 10 |
| 3 | $$$ | 15 |

Higher-priced items earn more but limit which customers will buy (based on their maxPrice preference).

---

## 📱 iPad Optimization

The game is specifically optimized for iPad Safari as the primary platform:

### Touch Handling
```css
/* Prevent accidental text selection during play */
user-select: none;
-webkit-user-select: none;

/* Faster tap response - removes 300ms delay */
touch-action: manipulation;

/* Prevent pull-to-refresh interrupting gameplay */
overscroll-behavior: none;
```

### Viewport Configuration
```typescript
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,      // Prevent accidental zoom
  userScalable: false,  // Disable pinch-zoom
  viewportFit: 'cover', // Full screen on notched devices
};
```

### PWA Support
- Apple Web App capable for home screen installation
- Black translucent status bar for immersive experience
- Custom app title when added to home screen

---

## 🎨 Visual Design

### Color Palette

The game uses a **pastel color scheme** that's warm, inviting, and easy on young eyes:

| Screen | Gradient |
|--------|----------|
| Home | Pink → Lavender |
| Workshop | Lavender → Sky Blue |
| Store | Moccasin → Pink |
| Results | Pale Green → Sky Blue |

### Typography

Uses child-friendly rounded fonts that feel playful:
- Primary: Comic Sans MS
- Fallback chain: Chalkboard SE → Arial Rounded MT Bold → Arial

### Animation Philosophy

All animations use **spring physics** via Framer Motion for a bouncy, playful feel:

```typescript
transition={{ type: 'spring', stiffness: 400, damping: 17 }}
```

- `stiffness: 400` - Snappy, responsive feel
- `damping: 17` - Slight overshoot adds playfulness without feeling chaotic

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/madebythea.git

# Install dependencies
cd madebythea
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com):

```bash
# Using Vercel CLI
npm i -g vercel
vercel

# Or connect your GitHub repo at vercel.com for automatic deployments
```

---

## 🖼️ Adding Custom Avatars

The game supports custom family member photos. Place avatar images in `public/images/customers/family/`:

| Filename | Customer |
|----------|----------|
| `ollie.png` | Ollie |
| `mommy.png` | Mommy |
| `daddy.png` | Daddy |
| `ba-noi.png` | Ba Noi (grandmother) |
| `ba-ngoai.png` | Ba Ngoai (grandmother) |
| `auntie-thy.png` | Auntie Thy |
| `uncle-will.png` | Uncle Will |

**Image Requirements:**
- Square aspect ratio recommended (256x256 or larger)
- PNG format with transparent background works best
- If an image is missing, the game gracefully falls back to emoji placeholders

---

## 🔮 Future Expansions

The "Made by Thea" platform is architected to support multiple maker modules beyond clothing:

| Module | Description |
|--------|-------------|
| 🧁 **Bakery** | Decorate cakes, cookies, and treats |
| 🎨 **Art Studio** | Create paintings and crafts |
| 🧸 **Toy Shop** | Design and sell toys |
| 💐 **Flower Shop** | Arrange bouquets |
| 💎 **Jewelry** | Create accessories |

Each module follows the same Workshop → Store → Results pattern, making the game instantly familiar while offering new creative possibilities.

---

## 🛠️ Development

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint |

### Key Files

| File | Purpose |
|------|---------|
| `src/types/clothing.ts` | Clothing item type definitions and constants |
| `src/types/customer.ts` | Customer definitions with preferences |
| `src/lib/matching.ts` | Sale matching algorithm |
| `src/stores/inventoryStore.ts` | Zustand store for created items |
| `src/stores/gameStore.ts` | Zustand store for game state |

---

## 📄 License

MIT License - Feel free to use and modify for your own family!

---

Built with ❤️ for Thea
