import React, { useMemo, useState } from 'react';
import { FilmRecord, RewatchAnchor } from '../types';
import { computeRewatchAnchors, computeFranchiseArcs } from '../lib/analytics';
import { PRELOADED_LISTS } from '../lib/letterboxdArchive';
import {
  RotateCcw,
  Heart,
  Sparkles,
  Crown,
  X,
  Brain,
  Layers,
  Film,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface RewatchSanctuaryProps {
  records: FilmRecord[];
  onOpenReview?: (filmTitle: string) => void;
}

export const RewatchSanctuary: React.FC<RewatchSanctuaryProps> = ({ records, onOpenReview }) => {
  const anchors = useMemo(() => computeRewatchAnchors(records), [records]);
  const franchiseArcs = useMemo(() => computeFranchiseArcs(records), [records]);

  const laLaLandAnchor = useMemo(
    () => anchors.find((a) => a.title === 'La La Land') || anchors[0],
    [anchors]
  );

  const [selectedLLLIndex, setSelectedLLLIndex] = useState<number>(
    laLaLandAnchor ? Math.max(0, laLaLandAnchor.screenings.length - 1) : 0
  );
  const [selectedAnchor, setSelectedAnchor] = useState<RewatchAnchor | null>(null);
  const [anchorFilter, setAnchorFilter] = useState<
    'all' | 'duology' | 'multi_rewatch' | 'childhood_revival' | 'comfort_tag'
  >('all');

  const displayedAnchors = useMemo(() => {
    if (anchorFilter === 'all') return anchors;
    if (anchorFilter === 'duology') return anchors.filter((a) => a.anchorKind === 'duology');
    if (anchorFilter === 'multi_rewatch') return anchors.filter((a) => a.anchorKind === 'multi_rewatch');
    if (anchorFilter === 'childhood_revival')
      return anchors.filter((a) => a.anchorKind === 'childhood_revival');
    return anchors.filter((a) =>
      a.allTags.some((t) => t.includes('comfort movie') || t.includes('literally me'))
    );
  }, [anchors, anchorFilter]);

  // Vaanu's Aftersun poem (2026-01-26) & the 'grieving' list
  const aftersunPoemLog = useMemo(() => {
    return records.find(
      (r) =>
        r.title.toLowerCase() === 'aftersun' &&
        (r.watchedDate === '2026-01-26' || r.review.toLowerCase().includes('dear vaanu'))
    );
  }, [records]);

  const grievingList = useMemo(() => {
    return PRELOADED_LISTS.find((l) => l.id === 'grieving') || null;
  }, []);

  const watchedTitleSet = useMemo(() => {
    const s = new Set<string>();
    records.forEach((r) => s.add(r.title.toLowerCase()));
    return s;
  }, [records]);

  const activeLLL = laLaLandAnchor?.screenings[selectedLLLIndex] || laLaLandAnchor?.screenings[0];

  const oneGoSeries = useMemo(
    () => franchiseArcs.filter((f) => f.bingeMode === 'all_in_one_go'),
    [franchiseArcs]
  );
  const spreadSeries = useMemo(
    () => franchiseArcs.filter((f) => f.bingeMode === 'spread_over_time'),
    [franchiseArcs]
  );

  return (
    <div className="space-y-12">
      {/* 1. Hero Exhibit: The 11-Screening La La Land Odyssey (2022 - 2026) */}
      {laLaLandAnchor && activeLLL && (
        <section className="archive-plate rounded-3xl p-6 sm:p-8 relative overflow-hidden space-y-6 border border-[#d4a359]/30">
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{
              background: 'radial-gradient(circle, #a78bfa 0%, #d4a359 55%, transparent 75%)'
            }}
          />

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 relative z-10">
            <div>
              <p className="font-tabular text-[11px] uppercase tracking-[0.2em] text-[#d4a359] mb-1.5">
                I · Crown Comfort Anchor — 11 Diary Logs · 23.5 Hours · 25,000+ Characters of Prose
              </p>
              <h2 className="font-editorial text-2xl sm:text-4xl text-[var(--text-primary)] tracking-tight">
                The 11-Chapter <span className="italic text-[#d4a359]">La La Land</span> Odyssey (2022–2026)
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-3xl">
                "update : hell nah la la land overtook it 😭😭😭" — From your first watch in Oct 2022 to the Royal Albert Hall live orchestra, buying a guitar to learn Justin Hurwitz's score, finally seeing it in a cinema in July 2025, and your New Year's Day 2026 reflection.
              </p>
            </div>

            <div className="flex items-center gap-3 font-tabular text-xs bg-black/40 px-4 py-2.5 rounded-2xl border border-[var(--border-hairline)] shrink-0">
              <Crown className="w-4 h-4 text-[#d4a359]" />
              <span>70GB SSD Print · Top #1 Patron Saint</span>
            </div>
          </div>

          {/* Psychoanalytical Synthesis of Rath's 11 La La Land Logs */}
          <div className="p-5 rounded-2xl bg-[#d4a359]/[0.07] border border-[#d4a359]/30 space-y-2 relative z-10">
            <div className="flex items-center gap-2 text-[#d4a359]">
              <Brain className="w-4 h-4 shrink-0" />
              <span className="font-tabular text-[11px] uppercase tracking-[0.18em] font-semibold">
                Psychoanalytical Synthesis · What Your 11 Logs Reveal About You
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
              {laLaLandAnchor.psychoanalysis}
            </p>
          </div>

          {/* 11-Chapter Interactive Timeline Scrubber */}
          <div className="space-y-3 relative z-10">
            <span className="font-tabular text-[11px] uppercase tracking-wider text-[var(--text-muted)] block">
              Select any of your {laLaLandAnchor.screenings.length} diary entries to read what you wrote that night:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11 gap-2">
              {laLaLandAnchor.screenings.map((scr, idx) => {
                const isSelected = idx === selectedLLLIndex;
                return (
                  <button
                    key={scr.id}
                    onClick={() => setSelectedLLLIndex(idx)}
                    className={`p-2.5 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#d4a359] text-black border-[#d4a359] shadow-lg scale-[1.02]'
                        : 'bg-black/40 hover:bg-white/[0.06] text-[var(--text-secondary)] border-[var(--border-hairline)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-tabular text-[11px] font-bold">#{idx + 1}</span>
                      <span
                        className={`font-tabular text-[10px] ${
                          isSelected ? 'text-black/80 font-semibold' : 'text-[#d4a359]'
                        }`}
                      >
                        {scr.rating ? `${scr.rating}★` : 'Log'}
                      </span>
                    </div>
                    <p
                      className={`font-tabular text-[10px] mt-1.5 truncate ${
                        isSelected ? 'text-black font-medium' : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {scr.watchedDate}
                    </p>
                    <span
                      className={`font-tabular text-[9px] mt-0.5 ${
                        isSelected ? 'text-black/75' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {scr.reviewWordCount}w
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active La La Land Screening Reader */}
          <div className="p-5 sm:p-6 rounded-2xl bg-black/45 border border-[var(--border-hairline)] space-y-4 relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-hairline)]">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#d4a359]/20 text-[#d4a359] border border-[#d4a359]/40 font-tabular text-xs font-semibold">
                  Screening #{selectedLLLIndex + 1} of {laLaLandAnchor.screenings.length}
                </span>
                <span className="font-editorial text-xl text-[var(--text-primary)]">
                  {activeLLL.watchedDate}
                </span>
                {activeLLL.rating && (
                  <span className="font-tabular text-sm text-[#d4a359]">{activeLLL.rating} ★</span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {activeLLL.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-[var(--border-hairline)] text-[var(--text-secondary)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto pr-2">
              {activeLLL.review}
            </div>
          </div>
        </section>
      )}

      {/* 2. All Comfort Rewatches, Duologies & Childhood Revivals */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <p className="font-tabular text-[11px] uppercase tracking-[0.2em] text-[#d4a359]">
              II · The Psychoanalytical Comfort Vault ({displayedAnchors.length} Exhibits)
            </p>
            <h3 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)]">
              Duologies, Repeat Rituals & What Your Reviews Say About Your Soul
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 max-w-3xl">
              Every film or duology here carries an intimate synthesis of your own review prose, tracing why you returned to it and how your feelings shifted over time. Click any card to compare every screening side-by-side.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-[var(--border-hairline)] self-start">
            {(
              [
                { id: 'all', label: `All Anchors (${anchors.length})` },
                {
                  id: 'duology',
                  label: `🌊 Duologies (${anchors.filter((a) => a.anchorKind === 'duology').length})`
                },
                {
                  id: 'multi_rewatch',
                  label: `🔁 Multi-Rewatches (${anchors.filter((a) => a.anchorKind === 'multi_rewatch').length})`
                },
                {
                  id: 'childhood_revival',
                  label: `🕯️ Childhood / Past-Life Revivals (${anchors.filter((a) => a.anchorKind === 'childhood_revival').length})`
                },
                {
                  id: 'comfort_tag',
                  label: '🍿 Tagged "comfort movie"'
                }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAnchorFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  anchorFilter === tab.id
                    ? 'bg-[#d4a359]/20 text-[#f4f0ea] border border-[#d4a359]/40'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedAnchors.map((anchor) => (
            <article
              key={`${anchor.title}-${anchor.year}`}
              onClick={() => setSelectedAnchor(anchor)}
              className="archive-plate rounded-3xl p-6 flex flex-col justify-between gap-4 cursor-pointer hover:border-[#d4a359]/50 transition-all group"
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full bg-[#e05a47]/20 text-[#e05a47] border border-[#e05a47]/35 font-tabular text-xs font-semibold flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" />
                      {anchor.totalScreenings}x logged
                    </span>
                    {anchor.anchorKind === 'duology' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/35 font-tabular text-[10px] uppercase tracking-wider">
                        🌊 Paired Duology
                      </span>
                    )}
                    {anchor.anchorKind === 'childhood_revival' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/35 font-tabular text-[10px] uppercase tracking-wider">
                        🕯️ Childhood / Past-Life Revival
                      </span>
                    )}
                    {anchor.isTopFour && (
                      <span className="px-2 py-0.5 rounded-full bg-[#d4a359]/20 text-[#d4a359] font-tabular text-[10px] uppercase">
                        Top 4 Saint
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {anchor.isLiked && (
                      <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                    )}
                    <span className="font-tabular text-xs font-semibold text-[#d4a359]">
                      {anchor.avgRating}★
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-editorial text-2xl text-[var(--text-primary)] group-hover:text-[#d4a359] transition-colors">
                    {anchor.title}{' '}
                    <span className="font-tabular text-xs text-[var(--text-muted)]">
                      ({anchor.year})
                    </span>
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {anchor.director} · {anchor.language}
                  </p>
                </div>

                {/* Screening Dates Pill Trail */}
                <div className="flex flex-wrap gap-1.5">
                  {anchor.screenings.map((s, idx) => (
                    <span
                      key={s.id}
                      className="font-tabular text-[10px] px-2 py-0.5 rounded-md bg-black/40 border border-[var(--border-hairline)] text-[var(--text-secondary)]"
                    >
                      #{idx + 1}: {s.watchedDate}
                      {s.isImdbBackfill ? ' (IMDb)' : ''}
                    </span>
                  ))}
                </div>

                {/* Therapist Psychoanalysis Card Block */}
                <div className="p-3.5 rounded-2xl bg-[#d4a359]/[0.06] border border-[#d4a359]/25 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#d4a359]">
                    <Brain className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-tabular text-[10px] uppercase tracking-wider font-semibold">
                      Psychoanalytical Synthesis
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                    {anchor.psychoanalysis}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {anchor.allTags.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-[var(--text-muted)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span className="font-tabular text-[11px] text-[#d4a359] shrink-0 group-hover:translate-x-0.5 transition-transform">
                  Inspect all logs →
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Series Watched All-In-One-Go vs Franchises Spread Across Time */}
      <section className="archive-plate rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <p className="font-tabular text-[11px] uppercase tracking-[0.2em] text-[#d4a359] mb-1">
            III · Complete Series Binges vs Multi-Year Universe Runs
          </p>
          <h3 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)]">
            Franchises You Devoured In One Breath vs Universes You Lived With Over Years
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-3xl">
            Per your distinction: multi-part stories and franchises you binged back-to-back in a single continuous run (<span className="text-[#f4f0ea] italic">SSE Side A & B</span>, <span className="text-[#f4f0ea] italic">The Before Trilogy</span>, <span className="text-[#f4f0ea] italic">Karry Potturr</span>, <span className="text-[#f4f0ea] italic">Bāhubali</span>) versus cinematic universes you experienced across years (<span className="text-[#f4f0ea] italic">LCU</span>, <span className="text-[#f4f0ea] italic">The Dark Knight Trilogy</span>, <span className="text-[#f4f0ea] italic">Spider-Verse</span>).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column A: Watched All In One Go */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-hairline)]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4a359]" />
                <h4 className="font-editorial text-xl text-[var(--text-primary)]">
                  Watched All In One Go (Back-to-Back Binges)
                </h4>
              </div>
              <span className="font-tabular text-[11px] text-[#d4a359]">
                {oneGoSeries.length} Series Pills
              </span>
            </div>

            {oneGoSeries.map((arc) => (
              <div
                key={arc.id}
                className="p-5 rounded-2xl bg-black/40 border border-[#d4a359]/30 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-tabular text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#d4a359]/20 text-[#d4a359]">
                      ⚡ Unified Series Pill · {arc.dateSpanLabel}
                    </span>
                    <h5 className="font-editorial text-xl text-[var(--text-primary)] mt-1.5">
                      {arc.title}
                    </h5>
                    <p className="text-xs text-[var(--text-secondary)]">{arc.subtitle}</p>
                  </div>
                  <div className="text-right font-tabular shrink-0">
                    <span className="text-sm font-bold text-[#d4a359]">{arc.avgRating}★</span>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      {arc.totalScreenings} logs · {arc.uniqueFilms} films
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-primary)] leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-[var(--border-hairline)]">
                  {arc.psychoanalysis}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {arc.films.map((f, idx) => (
                    <button
                      key={`${f.title}-${f.watchedDate}-${idx}`}
                      onClick={() => f.fullReview && onOpenReview && onOpenReview(f.title)}
                      className="text-[10px] font-tabular px-2.5 py-1 rounded-lg bg-black/50 hover:bg-[#d4a359]/20 border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {f.title} ({f.watchedDate.slice(5)}) {f.rating ? `· ${f.rating}★` : ''}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Column B: Watched Spread Across Time */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-hairline)]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#e05a47]" />
                <h4 className="font-editorial text-xl text-[var(--text-primary)]">
                  Watched Spread Over Time (Universes & Trilogies)
                </h4>
              </div>
              <span className="font-tabular text-[11px] text-[#e05a47]">
                {spreadSeries.length} Universe Arcs
              </span>
            </div>

            {spreadSeries.map((arc) => (
              <div
                key={arc.id}
                className="p-5 rounded-2xl bg-black/40 border border-[var(--border-hairline)] space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-tabular text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#e05a47]/20 text-[#e05a47]">
                      🌌 Multi-Year Arc · {arc.dateSpanLabel}
                    </span>
                    <h5 className="font-editorial text-xl text-[var(--text-primary)] mt-1.5">
                      {arc.title}
                    </h5>
                    <p className="text-xs text-[var(--text-secondary)]">{arc.subtitle}</p>
                  </div>
                  <div className="text-right font-tabular shrink-0">
                    <span className="text-sm font-bold text-[#d4a359]">{arc.avgRating}★</span>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      {arc.totalScreenings} logs · {arc.uniqueFilms} films
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-primary)] leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-[var(--border-hairline)]">
                  {arc.psychoanalysis}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {arc.films.map((f, idx) => (
                    <button
                      key={`${f.title}-${f.watchedDate}-${idx}`}
                      onClick={() => f.fullReview && onOpenReview && onOpenReview(f.title)}
                      className="text-[10px] font-tabular px-2.5 py-1 rounded-lg bg-black/50 hover:bg-[#e05a47]/20 border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {f.title} ({f.watchedDate.slice(0, 7)}) {f.rating ? `· ${f.rating}★` : ''}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Sacred Memorial Exhibit: Vaanu's Poem (Aftersun, Jan 26 2026) & The "grieving" Sanctuary List */}
      <section className="archive-plate rounded-3xl p-6 sm:p-8 border border-sky-400/25 relative overflow-hidden space-y-6">
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-15"
          style={{
            background: 'radial-gradient(circle, #38bdf8 0%, #a78bfa 50%, transparent 75%)'
          }}
        />

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 relative z-10">
          <div>
            <p className="font-tabular text-[11px] uppercase tracking-[0.2em] text-sky-300 mb-1.5">
              IV · In Memoriam · Vaanu & The 2026 Healing Sanctuary
            </p>
            <h3 className="font-editorial text-2xl sm:text-4xl text-[var(--text-primary)]">
              "dear vaanu, how lucky was i, to feel the pressure of your paws..."
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-3xl">
              After losing Vaanu in January 2026, you curated the <span className="italic text-[#f4f0ea]">grieving ("i need to heal")</span> comfort list and logged <span className="italic text-[#f4f0ea]">Aftersun</span> on 26 Jan 2026—not with a film critique, but with an elegy for her. Even when grief and depression pulled you away from cinema before you could finish the list, this space holds her memory and those waiting films gently until you are ready.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          {/* Left: Vaanu's Poem from Aftersun (2026-01-26) */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-black/50 border border-sky-400/25 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
              <div>
                <span className="font-tabular text-[10px] uppercase tracking-widest text-sky-300">
                  Logged Under Aftersun · 26 Jan 2026 · journal 📝
                </span>
                <h4 className="font-editorial text-2xl text-[var(--text-primary)] mt-0.5">
                  Elegy for Vaanu
                </h4>
              </div>
              <Heart className="w-5 h-5 text-sky-300 fill-sky-300/30" />
            </div>

            <div className="font-editorial text-sm sm:text-base text-[var(--text-primary)] leading-relaxed whitespace-pre-line italic px-1">
              {aftersunPoemLog?.review ||
                `dear vaanu\nhow lucky was i, to feel the pressure of your paws against my skin.\nhow lucky was i, to find dependency within your independence.\n...`}
            </div>

            <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
              <span>First film watched after losing Vaanu</span>
              <span className="font-tabular text-sky-300">Forever in the Archive 🐾</span>
            </div>
          </div>

          {/* Right: The "grieving" ("i need to heal") List — Watched vs Waiting */}
          {grievingList && (
            <div className="lg:col-span-6 p-6 rounded-2xl bg-black/40 border border-[var(--border-hairline)] flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-tabular text-[10px] uppercase tracking-widest text-[#d4a359]">
                    Curated List · {grievingList.items.length} Films for Healing
                  </span>
                  <span className="font-tabular text-xs text-[var(--text-secondary)]">
                    {
                      grievingList.items.filter((i) =>
                        watchedTitleSet.has(i.title.toLowerCase())
                      ).length
                    }{' '}
                    watched ·{' '}
                    {
                      grievingList.items.filter(
                        (i) => !watchedTitleSet.has(i.title.toLowerCase())
                      ).length
                    }{' '}
                    waiting patiently
                  </span>
                </div>
                <h4 className="font-editorial text-2xl text-[var(--text-primary)]">
                  "{grievingList.name}" — <span className="italic text-sky-300">{grievingList.description}</span>
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  No pressure or deadlines—these are the comfort films you gathered when you needed shelter.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {grievingList.items.map((item) => {
                  const isWatched = watchedTitleSet.has(item.title.toLowerCase());
                  return (
                    <div
                      key={`${item.position}-${item.title}`}
                      onClick={() => isWatched && onOpenReview && onOpenReview(item.title)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                        isWatched
                          ? 'bg-sky-500/10 border-sky-400/30 cursor-pointer hover:border-sky-300'
                          : 'bg-black/35 border-[var(--border-hairline)] opacity-80'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="font-editorial text-base text-[var(--text-primary)] truncate">
                          {item.title}{' '}
                          <span className="font-tabular text-[11px] text-[var(--text-muted)]">
                            ({item.year})
                          </span>
                        </p>
                        <span className="font-tabular text-[10px] text-[var(--text-secondary)]">
                          {isWatched ? 'Watched & Logged in Archive' : 'Unwatched · Waiting for you'}
                        </span>
                      </div>
                      {isWatched ? (
                        <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================== MULTI-SCREENING COMPARISON MODAL ==================== */}
      {selectedAnchor && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedAnchor(null)}
        >
          <div
            className="archive-plate rounded-3xl max-w-3xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-[#d4a359]/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
              <div>
                <span className="font-tabular text-xs uppercase tracking-widest text-[#d4a359]">
                  Rewatch Sanctuary · {selectedAnchor.totalScreenings} Logged Screenings
                </span>
                <h3 className="font-editorial text-3xl sm:text-4xl text-[var(--text-primary)] mt-1">
                  {selectedAnchor.title}{' '}
                  <span className="font-tabular text-lg text-[var(--text-muted)]">
                    ({selectedAnchor.year})
                  </span>
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                  Directed by {selectedAnchor.director} · {selectedAnchor.language} ·{' '}
                  {Math.round((selectedAnchor.totalScreenings * selectedAnchor.runtimeMinutes) / 60)}{' '}
                  total hours invested
                </p>
              </div>

              <button
                onClick={() => setSelectedAnchor(null)}
                className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[var(--text-secondary)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Psychoanalytical Summary inside Modal */}
            <div className="p-4 rounded-2xl bg-[#d4a359]/10 border border-[#d4a359]/30 space-y-1.5">
              <div className="flex items-center gap-2 text-[#d4a359]">
                <Brain className="w-4 h-4 shrink-0" />
                <span className="font-tabular text-[11px] uppercase tracking-wider font-semibold">
                  Psychoanalytical Synthesis Across Your Screenings
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                {selectedAnchor.psychoanalysis}
              </p>
            </div>

            <div className="space-y-4">
              {selectedAnchor.screenings.map((scr, idx) => (
                <div
                  key={scr.id}
                  className="p-5 rounded-2xl bg-black/40 border border-[var(--border-hairline)] space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg bg-[#d4a359]/20 text-[#d4a359] font-tabular text-xs font-semibold">
                        Watch #{idx + 1}
                      </span>
                      <span className="font-tabular text-sm text-[var(--text-primary)]">
                        {scr.watchedDate}
                      </span>
                      {scr.filmTitle && (
                        <span className="font-editorial italic text-xs text-[var(--text-secondary)]">
                          {scr.filmTitle}
                        </span>
                      )}
                      {scr.isImdbBackfill && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-tabular">
                          IMDb Retrospective Backfill (≤ Oct 2022)
                        </span>
                      )}
                      {scr.isRewatch && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-tabular">
                          Rewatch
                        </span>
                      )}
                    </div>

                    {scr.rating !== null && (
                      <span className="font-tabular text-sm font-semibold text-[#d4a359]">
                        {scr.rating} ★
                      </span>
                    )}
                  </div>

                  {scr.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {scr.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-[var(--border-hairline)] text-[var(--text-secondary)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {scr.review ? (
                    <p className="text-xs sm:text-sm text-[var(--text-primary)] whitespace-pre-line leading-relaxed pt-2 border-t border-[var(--border-hairline)]">
                      {scr.review}
                    </p>
                  ) : (
                    <p className="text-xs italic text-[var(--text-muted)]">
                      Logged without written prose on this screening.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
