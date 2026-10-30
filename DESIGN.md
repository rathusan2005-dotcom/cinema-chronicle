# Cinema Chronicle — Visual & Interaction Design System

## 🎞️ The Aesthetic: "The 35mm Celluloid Archive"
A direct sibling to Sonic Chronicle's **Liquid Archive**, but subtly shifted from prestige vinyl gatefolds into **Criterion Collection packaging, dark screening rooms, and 35mm warm incandescent film stock**.

---

## 🎨 Dual Surface Modes

### 1. OLED Screening Room (`#000000`)
- True pitch-black background optimized for late-night mobile review reading.
- Crisp high-contrast film title serifs, illuminated film stills, and glowing amber accent highlights.

### 2. Criterion Archive (`#0d0c0a`)
- Deep espresso & warm soot canvas.
- Evokes vintage cinema program booklets, warm projection lamp glow, and archival paper stock.

---

## ✍️ Editorial Typography
- **Headings & Film Titles**: `Newsreader` (Editorial serif with optical sizing, italic flair for movie titles).
- **Body & Reviews**: `Plus Jakarta Sans` (Clean, hyper-readable modern sans-serif for reading long-form reviews).
- **Technical Telemetry & Run-times**: `JetBrains Mono` (Aspect ratios, release years, star counts, timestamps).

---

## 🫧 Key UI Components (Reused from Sonic Chronicle)

1. **The Floating Liquid-Glass Bottom Dock (`liquid-dock`)**:
   - Translucent rounded pill dock (`backdrop-filter: blur(28px) saturate(190%)`).
   - 44pt+ touch targets for mobile thumb ergonomics.
   - 5 Main Pillars: `River`, `Reviews`, `Directors`, `Rewatches`, `Timeline`.

2. **The 35mm Celluloid Card (`archive-plate`)**:
   - Subtle 2.39:1 / 1.85:1 aspect ratio film stills and poster artwork.
   - Warm golden star badges (`#d4a359`) and film grain glow.

3. **Client-Side Poster Image Caching**:
   - Letterboxd URIs mapped to clean, lightweight poster thumbnails cached client-side.
