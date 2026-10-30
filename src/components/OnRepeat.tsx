import React, { useMemo, useState } from 'react';
import { FilmRecord, RewatchAnchor } from '../types';
import { computeRewatchAnchors } from '../lib/analytics';
import {
  Flame,
  RotateCcw,
  Heart,
  Star,
  BookOpen,
  Sparkles,
  Calendar,
  Clock,
  Crown,
  X
} from 'lucide-react';

interface OnRepeatProps {
  records: FilmRecord[];
  onOpenReview?: (filmTitle: string) => void;
}

export const OnRepeat: React.FC<OnRepeatProps> = ({ records }) => {
  const anchors = useMemo(() => computeRewatchAnchors(records), [records]);

  const laLaLandAnchor = useMemo(
    () => anchors.find((a) => a.title === 'La La Land') || anchors[0],
    [anchors]
  );

  const [selectedLLLIndex, setSelectedLLLIndex] = useState<number>(
    laLaLandAnchor ? Math.max(0, laLaLandAnchor.screenings.length - 3) : 0
  );
  const [selectedAnchor, setSelectedAnchor] = useState<RewatchAnchor | null>(null);
  const [filterComfortOnly, setFilterComfortOnly] = useState<boolean>(false);

  const displayedAnchors = useMemo(() => {
    if (!filterComfortOnly) return anchors;
    return anchors.filter((a) =>
      a.allTags.some((t) => t.includes('comfort movie') || t.includes('literally me'))
    );
  }, [anchors, filterComfortOnly]);

  const activeLLL = laLaLandAnchor?.screenings[selectedLLLIndex] || laLaLandAnchor?.screenings[0];

  return (
    <div className="space-y-10">
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

      {/* 2. All Comfort Rewatches & Multi-Screening Anchors */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="font-tabular text-[11px] uppercase tracking-[0.2em] text-[#d4a359]">
              II · The Comfort Vault ({displayedAnchors.length} Rewatch Anchors)
            </p>
            <h3 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)]">
              Films You Returned To When You Needed Solace
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Choosing to rewatch a 2.5-hour film is the ultimate act of emotional trust. Click any card to compare your reviews across screenings.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-full border border-[var(--border-hairline)] self-start">
            <button
              onClick={() => setFilterComfortOnly(false)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                !filterComfortOnly
                  ? 'bg-[#d4a359]/20 text-[#f4f0ea] border border-[#d4a359]/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              All Rewatches ({anchors.length})
            </button>
            <button
              onClick={() => setFilterComfortOnly(true)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filterComfortOnly
                  ? 'bg-[#e05a47]/25 text-[#f4f0ea] border border-[#e05a47]/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              🍿 Tagged "comfort movie" / "literally me"
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedAnchors.map((anchor) => (
            <article
              key={`${anchor.title}-${anchor.year}`}
              onClick={() => setSelectedAnchor(anchor)}
              className="archive-plate rounded-3xl p-6 flex flex-col justify-between gap-4 cursor-pointer hover:border-[#d4a359]/50 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full bg-[#e05a47]/20 text-[#e05a47] border border-[#e05a47]/35 font-tabular text-xs font-semibold flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" />
                      {anchor.totalScreenings}x logged
                    </span>
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
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {anchor.screenings.map((s, idx) => (
                    <span
                      key={s.id}
                      className="font-tabular text-[10px] px-2 py-0.5 rounded-md bg-black/40 border border-[var(--border-hairline)] text-[var(--text-secondary)]"
                    >
                      #{idx + 1}: {s.watchedDate}
                    </span>
                  ))}
                </div>

                {/* Latest Review Preview */}
                {anchor.screenings.some((s) => s.review) && (
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-3 bg-black/25 p-3 rounded-xl border border-[var(--border-hairline)] whitespace-pre-line">
                    {
                      [...anchor.screenings]
                        .reverse()
                        .find((s) => s.review && s.review.length > 0)?.review
                    }
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {anchor.allTags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-[var(--text-muted)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span className="font-tabular text-[11px] text-[#d4a359] shrink-0 group-hover:translate-x-0.5 transition-transform">
                  Compare logs →
                </span>
              </div>
            </article>
          ))}
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

            <div className="space-y-4">
              {selectedAnchor.screenings.map((scr, idx) => (
                <div
                  key={scr.id}
                  className="p-5 rounded-2xl bg-black/40 border border-[var(--border-hairline)] space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg bg-[#d4a359]/20 text-[#d4a359] font-tabular text-xs font-semibold">
                        Watch #{idx + 1}
                      </span>
                      <span className="font-tabular text-sm text-[var(--text-primary)]">
                        {scr.watchedDate}
                      </span>
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
