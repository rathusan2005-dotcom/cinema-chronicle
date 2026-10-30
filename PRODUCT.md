# Cinema Chronicle — Product Requirements & Vision

## 🎯 Executive Summary
Cinema Chronicle is an ultra-tactile personal film intelligence and archival platform for Rath (@justrath). It ingests Letterboxd export files (`diary.csv`, `reviews.csv`, `ratings.csv`, `watched.csv`) to map Rath's cinephile trajectory—most notably his monumental 2024–2025 movie marathon era and the introspective themes behind his personal reviews.

---

## 👤 User & Context
- **Target User**: Rath (@justrath).
- **Recent Emotional Shift**: Logged ~300+ movies in 2025 during an intense cinematic exploration phase, followed by an abrupt slowdown in 2026 (~16 films) due to burnout, mental exhaustion, and depression.
- **Goal**: Not to "encourage more movie watching" or track gamified streaks, but to provide a gorgeous, comforting museum space to revisit what he felt, loved, and wrote during his most intense film phases.

---

## 🏛️ Core Architectural Modules

### 1. 🎞️ The River of Cinema (Film Waves & Decades)
- Organic silhouette streamgraph depicting movies watched over time.
- Ribbon layers mapped by **Release Decades** (70s, 80s, 90s, 2000s, 2010s, 2020s) or **Film Language / Movement** (Tamil / Indian Cinema, Hollywood Noir, European Arthouse, Anime / Animation).
- Scrubbing through late 2024 and 2025 highlights the peak marathon density.

### 2. 📝 The Review Ledger (Rath's Inner Monologue)
- Letterboxd exports include over **500KB of Rath's actual written reviews** (`reviews.csv`).
- Visualizes review sentiment, key recurring aesthetic words, favorite quotes, and star distributions.
- Ability to search and filter reviews by rating (5-star masterpieces vs guilty pleasures) and rewatch status.

### 3. 🎬 Director & Franchise Deep Dives ("The Rabbit Hole")
- Discovers sudden director binging arcs: When Rath watched his first film by a director (e.g. Nolan, Vetri Maaran, Lokesh, Denis Villeneuve, Mani Ratnam), how quickly did he consume their remaining catalog?
- Gateway Film vs Crown Masterpiece.

### 4. 🕯️ The Rewatch Sanctuary & Comfort Vault
- Filters films marked with `Rewatch = 'Yes'` in `diary.csv`.
- Displays Rath's true comfort cinema—the films returned to during high-stress or lonely periods for solace.

### 5. 🗓️ The 2024–2025 Velocity Lens
- Multi-scale scrubber (Year ➔ Month ➔ Week) illustrating the sheer density of films watched on single weekends or during holiday breaks.

---

## 💽 Data & Privacy
- **Source**: User drops their downloaded Letterboxd folder (containing `diary.csv`, `reviews.csv`, etc.).
- **Persistence**: Cached 100% client-side in browser **IndexedDB**.
- **No Third-Party Tracking**: Fully private and offline-capable.
