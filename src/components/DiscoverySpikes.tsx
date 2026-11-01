import React, { useMemo, useState } from 'react';
import { FilmRecord, DirectorDossier, DirectorFilmLog } from '../types';
import { computeDirectorDossiers } from '../lib/analytics';
import {
  Compass,
  Crown,
  Sparkles,
  Film,
  Star,
  Heart,
  Clock,
  BookOpen,
  X,
  RotateCcw,
  Zap,
  Brain
} from 'lucide-react';

// Unsplash-Style Watch Trajectory Sparkline Curve Generator
const getSparklinePath = (logs: DirectorFilmLog[], width = 240, height = 28) => {
  if (!logs || logs.length === 0) return { lineD: '', areaD: '', points: [] };
  const padX = 4;
  const padY = 4;
  const n = logs.length;

  const pts = logs.map((l, i) => {
    const x = n === 1 ? width / 2 : padX + (i / (n - 1)) * (width - 2 * padX);
    const val = l.rating !== null ? l.rating : 3.5;
    const norm = Math.max(0, Math.min(1, (val - 1.0) / 4.0));
    const y = height - padY - norm * (height - 2 * padY);
    return {
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      rating: l.rating,
      title: l.title,
      date: l.watchedDate
    };
  });

  if (pts.length === 1) {
    return {
      lineD: `M ${padX} ${pts[0].y} L ${width - padX} ${pts[0].y}`,
      areaD: `M ${padX} ${pts[0].y} L ${width - padX} ${pts[0].y} L ${width - padX} ${height} L ${padX} ${height} Z`,
      points: pts
    };
  }

  let lineD = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    lineD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }

  const last = pts[pts.length - 1];
  const first = pts[0];
  const areaD = `${lineD} L ${last.x} ${height} L ${first.x} ${height} Z`;

  return { lineD, areaD, points: pts };
};

// Extracts top unique films with ratings for director chips
const getTopFilms = (logs: DirectorFilmLog[]) => {
  const seen = new Set<string>();
  const list: DirectorFilmLog[] = [];
  const sorted = [...logs].sort(
    (a, b) => (b.rating || 0) - (a.rating || 0) || b.watchedDate.localeCompare(a.watchedDate)
  );
  for (const log of sorted) {
    if (!seen.has(log.title)) {
      seen.add(log.title);
      list.push(log);
    }
    if (list.length >= 4) break;
  }
  return list;
};

interface DiscoverySpikesProps {
  records: FilmRecord[];
  onOpenReview?: (filmTitle: string) => void;
}

export const DiscoverySpikes: React.FC<DiscoverySpikesProps> = ({
  records,
  onOpenReview
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'indian' | 'global' | 'obsessions'>('all');
  const [sortBy, setSortBy] = useState<'screenings' | 'unique' | 'rating' | 'velocity'>('screenings');
  const [selectedDossier, setSelectedDossier] = useState<DirectorDossier | null>(null);

  const dossiers = useMemo(() => computeDirectorDossiers(records), [records]);

  const filteredDossiers = useMemo(() => {
    const indianLangs = new Set(['Tamil', 'Malayalam', 'Telugu', 'Kannada', 'Hindi']);
    const list = dossiers.filter((d) => {
      if (filterMode === 'indian') return indianLangs.has(d.primaryLanguage);
      if (filterMode === 'global') return !indianLangs.has(d.primaryLanguage);
      if (filterMode === 'obsessions') return d.uniqueFilmsWatched >= 4 || d.totalScreenings >= 5;
      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'screenings') return b.totalScreenings - a.totalScreenings || b.avgRating - a.avgRating;
      if (sortBy === 'unique') return b.uniqueFilmsWatched - a.uniqueFilmsWatched || b.avgRating - a.avgRating;
      if (sortBy === 'rating') return b.avgRating - a.avgRating || b.totalScreenings - a.totalScreenings;
      if (sortBy === 'velocity') return b.bingeVelocityScore - a.bingeVelocityScore;
      return 0;
    });
  }, [dossiers, filterMode, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <section className="archive-plate rounded-3xl p-5 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="font-tabular text-[11px] uppercase tracking-[0.2em] text-[#d4a359] mb-1.5">
              III · The Rabbit Hole — Director & Auteur Trajectories
            </p>
            <h2 className="font-editorial text-2xl sm:text-4xl text-[var(--text-primary)] tracking-tight">
              First Contact, Gateway Films & Crown Masterpieces
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
              From your 8-film Christopher Nolan & Karthik Subbaraj binges to Vetrimaaran's raw grit, Damien Chazelle's 12-screening reign, and Mani Ratnam / GVM poetic romance.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-[var(--border-hairline)]">
            {(
              [
                { id: 'all', label: `All Directors (${dossiers.length})` },
                { id: 'indian', label: '🐅 Tamil & Indian Auteurs' },
                { id: 'global', label: '🌍 Global & Hollywood' },
                { id: 'obsessions', label: '🔥 Deep Rabbit Holes (4+)' }
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterMode(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  filterMode === f.id
                    ? 'bg-[#d4a359]/20 text-[#f4f0ea] border border-[#d4a359]/40'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--border-hairline)]">
          <span className="font-tabular text-xs text-[var(--text-muted)]">
            Tap any director plate to open their full chronological screening dossier
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[var(--text-muted)]">Rank by:</span>
            {(
              [
                { id: 'screenings', label: 'Total Screenings' },
                { id: 'unique', label: 'Unique Films' },
                { id: 'rating', label: 'Avg Star Rating' },
                { id: 'velocity', label: 'Binge Velocity' }
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                onClick={() => setSortBy(s.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] transition-all ${
                  sortBy === s.id
                    ? 'bg-[#e05a47]/20 text-[#f4f0ea] border border-[#e05a47]/40 font-medium'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Director Dossier Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDossiers.map((d) => (
          <article
            key={d.director}
            onClick={() => setSelectedDossier(d)}
            className="archive-plate rounded-3xl p-6 flex flex-col justify-between gap-5 cursor-pointer hover:border-[#d4a359]/50 transition-all group"
          >
            <div className="space-y-4">
              {/* Top Row: Badge & Velocity */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-tabular text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.04] border border-[var(--border-hairline)] text-[#d4a359]">
                  {d.patternType} · {d.primaryLanguage}
                </span>
                <div className="flex items-center gap-1.5 font-tabular text-xs text-[#e05a47]">
                  <Zap className="w-3.5 h-3.5" />
                  <span>BVI {d.bingeVelocityScore}</span>
                </div>
              </div>

              {/* Director Name & Movement */}
              <div>
                <h3 className="font-editorial text-2xl text-[var(--text-primary)] group-hover:text-[#d4a359] transition-colors">
                  {d.director}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{d.primaryMovement}</p>
              </div>

              {/* Gateway Spark vs Crown Masterpiece */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="p-3 rounded-2xl bg-black/30 border border-[var(--border-hairline)]">
                  <span className="font-tabular text-[10px] uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                    <Compass className="w-3 h-3 text-sky-400" />
                    Gateway Spark
                  </span>
                  <p className="font-editorial text-sm text-[var(--text-primary)] mt-1 truncate">
                    {d.gatewayFilm}
                  </p>
                  <p className="font-tabular text-[10px] text-[var(--text-muted)] mt-0.5">
                    {d.gatewayDate} {d.gatewayRating ? `· ${d.gatewayRating}★` : ''}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#d4a359]/10 border border-[#d4a359]/25">
                  <span className="font-tabular text-[10px] uppercase tracking-wider text-[#d4a359] flex items-center gap-1">
                    <Crown className="w-3 h-3 text-[#d4a359]" />
                    Crown Opus
                  </span>
                  <p className="font-editorial text-sm text-[var(--text-primary)] mt-1 truncate">
                    {d.crownFilm}
                  </p>
                  <p className="font-tabular text-[10px] text-[#d4a359] mt-0.5">
                    {d.crownYear} · {d.crownRating}★
                  </p>
                </div>
              </div>

              {/* Psychoanalytical Insight Snippet */}
              <div className="p-3 rounded-2xl bg-[#d4a359]/[0.05] border border-[#d4a359]/20 space-y-1">
                <div className="flex items-center gap-1.5 text-[#d4a359]">
                  <Brain className="w-3 h-3 shrink-0" />
                  <span className="font-tabular text-[9px] uppercase tracking-wider font-semibold">
                    Psychological Mirror
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {d.psychoanalysis}
                </p>
              </div>

              {/* Unsplash-Style Inline Sparkline & Micro Film Chips */}
              <div className="space-y-2 pt-1">
                {/* Sparkline Canvas */}
                <div className="p-2.5 rounded-2xl bg-black/40 border border-[var(--border-hairline)] space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-tabular text-[var(--text-muted)] px-0.5">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#d4a359]" />
                      Watch Trajectory ({d.filmographyLogs.length} screenings)
                    </span>
                    <span className="text-[#d4a359]">
                      {d.gatewayDate.slice(0, 4)} → {d.filmographyLogs[d.filmographyLogs.length - 1]?.watchedDate.slice(0, 4) || '2026'}
                    </span>
                  </div>

                  {/* SVG Sparkline */}
                  <div className="w-full h-8 relative">
                    <svg
                      viewBox="0 0 240 28"
                      preserveAspectRatio="none"
                      className="w-full h-full overflow-visible"
                    >
                      <defs>
                        <linearGradient id={`spark-${d.director.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#d4a359" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#d4a359" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {(() => {
                        const { lineD, areaD, points } = getSparklinePath(d.filmographyLogs, 240, 28);
                        const lastPt = points[points.length - 1];
                        return (
                          <>
                            <path d={areaD} fill={`url(#spark-${d.director.replace(/[^a-zA-Z0-9]/g, '')})`} />
                            <path d={lineD} fill="none" stroke="#d4a359" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            {lastPt && (
                              <circle
                                cx={lastPt.x}
                                cy={lastPt.y}
                                r="2.5"
                                fill="#d4a359"
                                className="animate-pulse"
                              />
                            )}
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                </div>

                {/* Micro Filmography Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                  {getTopFilms(d.filmographyLogs).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={(e) => {
                        if (f.hasReview && onOpenReview) {
                          e.stopPropagation();
                          onOpenReview(f.title);
                        }
                      }}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-tabular whitespace-nowrap transition-all border ${
                        f.hasReview
                          ? 'bg-[#d4a359]/10 text-[#d4a359] border-[#d4a359]/30 hover:bg-[#d4a359]/20 hover:border-[#d4a359]'
                          : 'bg-white/[0.03] text-[var(--text-secondary)] border-white/[0.06] hover:bg-white/[0.06]'
                      }`}
                      title={f.hasReview ? `Read review for ${f.title}` : `${f.title} (${f.year})`}
                    >
                      <span className="truncate max-w-[95px]">{f.title}</span>
                      {f.rating && <span className="text-[#d4a359] font-semibold">{f.rating}★</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Telemetry Bar */}
            <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between font-tabular text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-3">
                <span>
                  <strong className="text-[var(--text-primary)]">{d.uniqueFilmsWatched}</strong> films
                </span>
                <span>·</span>
                <span>
                  <strong className="text-[var(--text-primary)]">{d.totalScreenings}</strong> logs
                </span>
                <span>·</span>
                <span className="text-[#d4a359]">{d.avgRating}★ avg</span>
              </div>
              <span className="text-[11px] text-[#d4a359] group-hover:translate-x-0.5 transition-transform">
                Dossier →
              </span>
            </div>
          </article>
        ))}
      </section>

      {/* ==================== DIRECTOR LIFECYCLE DOSSIER MODAL ==================== */}
      {selectedDossier && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedDossier(null)}
        >
          <div
            className="archive-plate rounded-3xl max-w-3xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-[#d4a359]/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
              <div>
                <span className="font-tabular text-xs uppercase tracking-widest text-[#d4a359]">
                  Auteur Lifecycle Dossier · {selectedDossier.primaryLanguage} Cinema
                </span>
                <h3 className="font-editorial text-3xl sm:text-4xl text-[var(--text-primary)] mt-1">
                  {selectedDossier.director}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                  {selectedDossier.primaryMovement} · Peak Activity in{' '}
                  <span className="font-tabular text-[var(--text-primary)]">
                    {selectedDossier.peakMonth}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setSelectedDossier(null)}
                className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[var(--text-secondary)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Key Dossier Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-black/35 border border-[var(--border-hairline)]">
                <span className="font-tabular text-[10px] uppercase text-[var(--text-muted)]">
                  Unique Films
                </span>
                <p className="font-tabular text-xl font-semibold text-[var(--text-primary)] mt-0.5">
                  {selectedDossier.uniqueFilmsWatched}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/35 border border-[var(--border-hairline)]">
                <span className="font-tabular text-[10px] uppercase text-[var(--text-muted)]">
                  Total Screenings
                </span>
                <p className="font-tabular text-xl font-semibold text-[#d4a359] mt-0.5">
                  {selectedDossier.totalScreenings} ({selectedDossier.totalHours}h)
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/35 border border-[var(--border-hairline)]">
                <span className="font-tabular text-[10px] uppercase text-[var(--text-muted)]">
                  Average Rating
                </span>
                <p className="font-tabular text-xl font-semibold text-amber-400 mt-0.5">
                  {selectedDossier.avgRating} ★
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/35 border border-[var(--border-hairline)]">
                <span className="font-tabular text-[10px] uppercase text-[var(--text-muted)]">
                  Reviews Penned
                </span>
                <p className="font-tabular text-xl font-semibold text-emerald-400 mt-0.5">
                  {selectedDossier.reviewCount}
                </p>
              </div>
            </div>

            {/* Psychological Mirror Dossier Plate */}
            <div className="p-4 rounded-2xl bg-[#d4a359]/10 border border-[#d4a359]/30 space-y-1.5">
              <div className="flex items-center gap-2 text-[#d4a359]">
                <Brain className="w-4 h-4 shrink-0" />
                <span className="font-tabular text-xs uppercase tracking-wider font-semibold">
                  Psychological Mirror · What {selectedDossier.director} Unlocks in Rath
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                {selectedDossier.psychoanalysis}
              </p>
            </div>

            {/* Chronological Screening Log */}
            <div className="space-y-3">
              <h4 className="font-editorial text-xl text-[var(--text-primary)]">
                Chronological Screening Trajectory
              </h4>

              <div className="space-y-3">
                {selectedDossier.filmographyLogs.map((log, idx) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl bg-black/35 border border-[var(--border-hairline)] space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-tabular text-xs text-[#d4a359]">
                            #{idx + 1} · {log.watchedDate}
                          </span>
                          <h5 className="font-editorial text-lg text-[var(--text-primary)]">
                            {log.title}{' '}
                            <span className="font-tabular text-xs text-[var(--text-muted)]">
                              ({log.year})
                            </span>
                          </h5>
                          {log.isLiked && (
                            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                          )}
                          {log.isRewatch && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-tabular bg-emerald-500/15 text-emerald-300">
                              Rewatch
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {log.rating !== null && (
                          <span className="font-tabular text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#d4a359]/15 text-[#d4a359]">
                            {log.rating}★
                          </span>
                        )}
                        {log.hasReview && onOpenReview && (
                          <button
                            onClick={() => {
                              setSelectedDossier(null);
                              onOpenReview(log.title);
                            }}
                            className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-[#d4a359] font-tabular"
                          >
                            Full Review ↗
                          </button>
                        )}
                      </div>
                    </div>

                    {log.fullReview && (
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] whitespace-pre-line leading-relaxed bg-black/30 p-3.5 rounded-xl border border-[var(--border-hairline)]">
                        {log.fullReview}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
