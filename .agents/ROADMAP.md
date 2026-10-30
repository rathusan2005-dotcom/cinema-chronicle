# 🗺️ Cinema Chronicle — Active Roadmap

## 🚀 Phase 1: Repository Setup & Mobile PWA Pipeline
- [x] **GitHub Remote Connection**: Link local repo to GitHub (`rathusan2005-dotcom/cinema-chronicle`) & push `main`.
- [x] **Vercel Continuous Deployment**: Wire GitHub repo to Vercel for continuous deployment to mobile (Live at cinema-chronicle-brown.vercel.app).
- [x] **iPhone PWA Meta & Branding**: Update `index.html` and `package.json` for seamless iOS "Add to Home Screen" launch.
- [x] **Clean Build Verification**: Ensure zero-error Vite build pipeline (`npm run build`).

## 📥 Phase 2: Letterboxd Parser & Local Ingestion Engine (v0.2.0 BETA)
- [x] **Raw Letterboxd Export Migration**: Moved Rath's complete Letterboxd archive into `data/letterboxd/`.
- [x] **Letterboxd Multi-File CSV Parser**: Reconciles `diary.csv` (480 logs), `reviews.csv` (287 essays), `ratings.csv` (430 ratings), `watched.csv` (477 films), `likes/films.csv` (133 ❤️), `lists/*.csv` (5 personal lists), `comments.csv` (754 comments), and `watchlist.csv` (233 films).
- [x] **100% Film Metadata Enrichment**: Mapped all 477 watched films with exact Director, Language, Cinema Movement, and Runtime.
- [x] **Client-Side IndexedDB Storage**: Persists custom records, theme preference, and 2026 retrospective liner notes locally.

## 🎞️ Phase 3: The 5 Core Visualizations (v0.2.0 BETA)
- [x] **The River of Cinema (Streamgraph)**: Symmetric silhouette streamgraph tracking 8 Cinema Movements, 5 Balanced Streams, 3 Macro Streams, and Release Decades across 2021–2026 + Top 4 Patron Saints & 4 Emergent Life Chapters.
- [x] **The Review Ledger**: Criterion Reading Room for Rath's 287 written reviews (550KB prose), 19 custom diary tags (`fav review`, `journal 📝`, `made me cry`, `comfort movie 🍿🤗`, `literally me`, etc.), 5 Curated Lists (`grieving`, `movies that make me feel something`, `ssd movies`, `review backlog`), and 754 Comments.
- [x] **The Rabbit Hole (Director & Auteur Dossiers)**: Gateway Spark vs Crown Opus, Binge Velocity Score, and chronological screening logs across all directors.
- [x] **The Rewatch Sanctuary**: Dedicated 11-Screening *La La Land* Odyssey timeline (2022–2026) + multi-screening review comparator across all comfort rewatches.
- [x] **The Velocity Lens**: Multi-scale Year ➔ Month ➔ Screening scrubber, Single-Day Double/Triple Feature detector, and Social Companion breakdown (`niko`, `with niki 🎥`, `delsya`, `nadu !`).

## 🎨 Phase 4: Next Refinements & Interactive Polish
- [ ] **Poster Artwork / Visual Stills Integration**: Optional client-side TMDB/Letterboxd poster artwork fetcher or custom still cards.
- [ ] **Vocabulary & Sentiment Deep-Dive**: Recurring phrase & emotional lexicon cloud from Rath's 287 reviews.
