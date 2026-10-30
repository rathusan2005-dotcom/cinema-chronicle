# 🗺️ Cinema Chronicle — Active Roadmap

## 🚀 Phase 1: Repository Setup & Mobile PWA Pipeline (Current Focus)
- [x] **GitHub Remote Connection**: Link local repo to GitHub (`rathusan2005-dotcom/cinema-chronicle`) & push `main`.
- [x] **Vercel Continuous Deployment**: Wire GitHub repo to Vercel for continuous deployment to mobile (Live at cinema-chronicle-brown.vercel.app).
- [x] **iPhone PWA Meta & Branding**: Update `index.html` and `package.json` for seamless iOS "Add to Home Screen" launch.
- [x] **Clean Build Verification**: Ensure zero-error Vite build pipeline (`npm run build`).

## 📥 Phase 2: Letterboxd Parser & Local Ingestion Engine
- [ ] **Letterboxd Multi-File CSV Parser**: Ingest and reconcile `diary.csv`, `reviews.csv`, `ratings.csv`, and `watched.csv`.
- [ ] **Client-Side IndexedDB Storage**: Persist ingested movie records, written reviews, and custom settings locally with 100% privacy.
- [ ] **Cinematic Mock Dataset**: Generate authentic Letterboxd sample records reflecting Rath's 2024–2025 marathon era (~300+ films) and 2026 cooldown (~16 films).

## 🎞️ Phase 3: The 5 Core Visualizations
- [ ] **The River of Cinema (Streamgraph)**: Symmetric silhouette streamgraph tracking release decades and film languages across time.
- [ ] **The Review Ledger**: Deep-dive into Rath's written reviews (`reviews.csv`), star distributions, recurring motifs, and favorite quotes.
- [ ] **The Rabbit Hole (Director & Franchise Arcs)**: Discovery velocity, Gateway film vs Crown Masterpiece, and director binging trajectories.
- [ ] **The Rewatch Sanctuary**: Comfort vault filtering `Rewatch = 'Yes'` for films revisited during emotional/stressful periods.
- [ ] **The 2024–2025 Velocity Lens**: Multi-scale timeline scrubber (Year ➔ Month ➔ Week ➔ Day) revealing peak marathon weekends.

## 🎨 Phase 4: Aesthetic Craft & 35mm Celluloid System
- [ ] **Dual Surface Modes**: OLED Screening Room (`#000000`) and Criterion Archive (`#0d0c0a`).
- [ ] **Typography & Aspect Ratios**: 2.39:1 / 1.85:1 celluloid poster cards, `Newsreader` editorial serifs, `JetBrains Mono` telemetry.
- [ ] **Floating Liquid Bottom Dock**: Touch-first ergonomic pill dock with tactile haptics.
