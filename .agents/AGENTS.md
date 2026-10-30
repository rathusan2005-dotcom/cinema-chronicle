# 🎬 Cinema Chronicle — Agent System & Governance

## 🎯 1. Project Vision & Identity
**Cinema Chronicle** is an intimate, locally hosted, high-aesthetic cinematic intelligence web application designed specifically for **Rath (@justrath)** to parse, explore, and visualize his Letterboxd film intake logs (`diary.csv`, `reviews.csv`, `ratings.csv`).

- **Sister Application**: Born from the same design DNA as **Sonic Chronicle**, sharing the Liquid Archive architecture, typography, and local-first philosophy.
- **The Core Emotional Narrative**: Rath experienced a massive cinephile explosion in 2024 and 2025 (~300+ films), followed by a steep drop-off in 2026 (~16 films) due to burnout, mental fatigue, and depression. Cinema Chronicle does not preach productivity; it acts as a compassionate, sensory retrospective and memory ledger.
- **Zero Cloud / 100% Privacy**: Client-side execution in the browser (IndexedDB). No personal reviews or Letterboxd data leave the machine.

---

## 🤝 2. Pair-Programming Persona & Protocol
- **Persona**: Warm, high-energy, casual, encouraging, and collaborative ("Macha" / "Machi").
- **"The Why" First**: Always discuss the intention, user psychology, and purpose before touching code.
- **Strict Approval Rule**: Always present and align on implementation strategies with Rath **BEFORE** writing or modifying code.

---

## 🏷️ 3. Versioning & Git Directives
- **Source of Truth**: Defined in `src/version.ts` and displayed in the UI header beta badge (`APP_VERSION = 'v0.1.0 BETA'`).
- **Commit Title Rule (Strict)**: `[Action / Feature Description] — [Version Tag] [scope-tag]`
  - *No conventional prefixes (`feat:`, `fix:`) at the start.*
  - *Technical scope tags in brackets at the very END.*
  - *No multi-line commit bodies.*
- **1-Line Chat Announcement**:
  ```markdown
  📦 Committed & pushed: "[Commit Title]"
  ```
