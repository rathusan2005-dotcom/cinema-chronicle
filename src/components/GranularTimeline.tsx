import React, { useMemo, useState } from 'react';
import { FilmRecord } from '../types';
import {
  BarChart3,
  Calendar,
  Flame,
  Users,
  Heart,
  Star,
  Clock,
  BookOpen,
  RotateCcw,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface GranularTimelineProps {
  records: FilmRecord[];
  diaryOnly: boolean;
  onOpenReview?: (filmTitle: string) => void;
}

export const GranularTimeline: React.FC<GranularTimelineProps> = ({
  records,
  onOpenReview
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [metric, setMetric] = useState<'screenings' | 'hours' | 'reviews' | 'words'>('screenings');

  const diaryRecords = useMemo(
    () => records.filter((r) => r.isDiaryLogged),
    [records]
  );

  // 1. Yearly summary (2021 - 2026)
  const yearBuckets = useMemo(() => {
    const years = ['2021', '2022', '2023', '2024', '2025', '2026'];
    return years.map((yr) => {
      const slice = diaryRecords.filter((r) => r.watchedDate.startsWith(yr));
      const hours = Math.round(slice.reduce((s, r) => s + r.runtimeMinutes, 0) / 60);
      const reviews = slice.filter((r) => r.review && r.review.trim().length > 0).length;
      const words = slice.reduce((s, r) => s + r.reviewWordCount, 0);
      const rated = slice.filter((r) => r.rating !== null);
      const avgRating =
        rated.length > 0
          ? Number((rated.reduce((s, r) => s + (r.rating || 0), 0) / rated.length).toFixed(2))
          : 0;
      const rewatches = slice.filter((r) => r.isRewatch).length;

      return {
        year: yr,
        screenings: slice.length,
        hours,
        reviews,
        words,
        avgRating,
        rewatches
      };
    });
  }, [diaryRecords]);

  // 2. Monthly breakdown for selected year
  const monthBuckets = useMemo(() => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return monthNames.map((name, idx) => {
      const mKey = `${selectedYear}-${String(idx + 1).padStart(2, '0')}`;
      const slice = diaryRecords.filter((r) => r.watchedDate.startsWith(mKey));
      const hours = Math.round(slice.reduce((s, r) => s + r.runtimeMinutes, 0) / 60);
      const reviews = slice.filter((r) => r.review && r.review.trim().length > 0).length;
      const words = slice.reduce((s, r) => s + r.reviewWordCount, 0);
      return {
        monthKey: mKey,
        label: name,
        screenings: slice.length,
        hours,
        reviews,
        words,
        films: slice
      };
    });
  }, [diaryRecords, selectedYear]);

  // 3. Double / Triple Feature Marathon Days (2+ films watched on the exact same date)
  const marathonDays = useMemo(() => {
    const byDate = new Map<string, FilmRecord[]>();
    diaryRecords.forEach((r) => {
      // Skip 2022-10-26 bulk backfill date if watchedDate was used
      const list = byDate.get(r.watchedDate) || [];
      list.push(r);
      byDate.set(r.watchedDate, list);
    });

    const days: { date: string; count: number; totalMinutes: number; films: FilmRecord[] }[] = [];
    byDate.forEach((films, date) => {
      if (films.length >= 2) {
        days.push({
          date,
          count: films.length,
          totalMinutes: films.reduce((s, f) => s + f.runtimeMinutes, 0),
          films
        });
      }
    });

    return days.sort((a, b) => b.count - a.count || b.date.localeCompare(a.date)).slice(0, 18);
  }, [diaryRecords]);

  // 4. Social Companions Breakdown (from Rath's diary tags)
  const companionGroups = useMemo(() => {
    const companions = [
      { tag: 'niko', label: 'With Niko', emoji: '🎬', desc: '56 shared screenings & watch parties' },
      { tag: 'with niki 🎥', label: 'With Niki', emoji: '🎥', desc: '27 cinema & movie night memories' },
      { tag: 'delsya', label: 'With Delsya', emoji: '✨', desc: '9 screenings together' },
      { tag: 'nadu !', label: 'With Nadu', emoji: '🍿', desc: '7 movie nights (incl. La La Land initiation!)' },
      { tag: 'karry potturr', label: 'Karry Potturr Marathon', emoji: '⚡', desc: 'Wizarding World binge run' }
    ];

    return companions.map((c) => {
      const logs = diaryRecords.filter((r) => r.tags.includes(c.tag));
      return {
        ...c,
        count: logs.length,
        films: logs
      };
    });
  }, [diaryRecords]);

  const maxMonthVal = useMemo(() => {
    return Math.max(...monthBuckets.map((m) => m[metric]), 1);
  }, [monthBuckets, metric]);

  const inspectedMonthBucket = useMemo(() => {
    if (selectedMonth) {
      return monthBuckets.find((m) => m.monthKey === selectedMonth) || null;
    }
    const nonZero = [...monthBuckets].sort((a, b) => b.screenings - a.screenings)[0];
    return nonZero || null;
  }, [monthBuckets, selectedMonth]);

  return (
    <div className="space-y-10">
      {/* 1. Multi-Scale Year & Month Velocity Lens */}
      <section className="archive-plate rounded-3xl p-5 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="font-tabular text-[11px] uppercase tracking-[0.2em] text-[#d4a359] mb-1.5">
              V · The Velocity Lens — Multi-Scale Chronological Scrubber
            </p>
            <h2 className="font-editorial text-2xl sm:text-4xl text-[var(--text-primary)] tracking-tight">
              The 2024–2025 Supernova vs 2026 Sanctuary
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
              Explore your viewing density across years and months—from your 256-screening peak across 2024–2025 to your quiet 2026 period of rest.
            </p>
          </div>

          {/* Metric Switcher */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-full border border-[var(--border-hairline)] self-start">
            {(
              [
                { id: 'screenings', label: 'Screenings' },
                { id: 'hours', label: 'Hours' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'words', label: 'Words Written' }
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => setMetric(m.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  metric === m.id
                    ? 'bg-[#d4a359]/20 text-[#f4f0ea] border border-[#d4a359]/40'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6-Year Macro Cards (Click to select year) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {yearBuckets.map((yb) => {
            const isSelected = yb.year === selectedYear;
            const isSupernova = yb.year === '2024' || yb.year === '2025';
            return (
              <button
                key={yb.year}
                onClick={() => {
                  setSelectedYear(yb.year);
                  setSelectedMonth(null);
                }}
                className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#d4a359]/18 border-[#d4a359] shadow-lg'
                    : 'bg-black/35 border-[var(--border-hairline)] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-editorial text-2xl text-[var(--text-primary)]">
                    {yb.year}
                  </span>
                  {isSupernova && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-tabular uppercase bg-[#e05a47]/20 text-[#e05a47] border border-[#e05a47]/30">
                      Peak
                    </span>
                  )}
                  {yb.year === '2026' && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-tabular uppercase bg-sky-500/15 text-sky-300 border border-sky-500/30">
                      Rest
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-0.5">
                  <p className="font-tabular text-xl font-bold text-[#d4a359]">
                    {yb[metric].toLocaleString()}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {yb.screenings} films · {yb.hours}h · {yb.avgRating}★
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* 12-Month Bar Chart for Selected Year */}
        <div className="pt-4 border-t border-[var(--border-hairline)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-xl text-[var(--text-primary)]">
              Monthly Cadence in {selectedYear} — Click any month to inspect screenings
            </h3>
            <span className="font-tabular text-xs text-[var(--text-muted)]">
               Metric: <strong className="text-[#d4a359] uppercase">{metric}</strong>
            </span>
          </div>

          <div className="grid grid-cols-12 gap-2 items-end h-44 pt-6 px-2 bg-black/30 rounded-2xl border border-[var(--border-hairline)]">
            {monthBuckets.map((mb) => {
              const val = mb[metric];
              const heightPct = Math.max((val / maxMonthVal) * 100, val > 0 ? 10 : 3);
              const isSelected = inspectedMonthBucket?.monthKey === mb.monthKey;

              return (
                <button
                  key={mb.monthKey}
                  onClick={() => setSelectedMonth(mb.monthKey)}
                  className="flex flex-col items-center justify-end h-full group focus:outline-none"
                >
                  <span
                    className={`font-tabular text-[10px] mb-1 transition-colors ${
                      isSelected ? 'text-[#d4a359] font-bold' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {val > 0 ? val : ''}
                  </span>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#d4a359] shadow-[0_0_12px_rgba(212,163,89,0.5)]'
                        : val > 0
                        ? 'bg-[#e05a47]/65 group-hover:bg-[#d4a359]/80'
                        : 'bg-white/[0.04]'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span
                    className={`font-tabular text-[10px] py-2 ${
                      isSelected ? 'text-white font-semibold' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {mb.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inspected Month Screenings List */}
        {inspectedMonthBucket && (
          <div className="pt-4 border-t border-[var(--border-hairline)] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-editorial text-lg text-[var(--text-primary)]">
                Screenings Logged in {inspectedMonthBucket.label} {selectedYear} (
                {inspectedMonthBucket.films.length} films · {inspectedMonthBucket.hours} hrs ·{' '}
                {inspectedMonthBucket.words.toLocaleString()} review words)
              </h4>
            </div>

            {inspectedMonthBucket.films.length === 0 ? (
              <p className="text-xs italic text-[var(--text-muted)] py-4">
                No screenings logged in {inspectedMonthBucket.label} {selectedYear} — a quiet month off the screen.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {inspectedMonthBucket.films.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => f.review && onOpenReview && onOpenReview(f.title)}
                    className={`p-3.5 rounded-2xl bg-black/35 border border-[var(--border-hairline)] flex items-start justify-between gap-2 transition-all ${
                      f.review
                        ? 'cursor-pointer hover:border-[#d4a359]/45 hover:bg-white/[0.04]'
                        : ''
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-tabular text-[10px] text-[#d4a359]">
                          {f.watchedDate.slice(8)} {inspectedMonthBucket.label}
                        </span>
                        {f.isRewatch && (
                          <RotateCcw className="w-3 h-3 text-emerald-400 shrink-0" />
                        )}
                        {f.isLiked && (
                          <Heart className="w-3 h-3 text-rose-400 fill-rose-400 shrink-0" />
                        )}
                      </div>
                      <p className="font-editorial text-base text-[var(--text-primary)] truncate mt-0.5">
                        {f.title}{' '}
                        <span className="font-tabular text-xs text-[var(--text-muted)]">
                          ({f.releaseYear})
                        </span>
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate">
                        {f.director}
                      </p>
                    </div>

                    <div className="flex flex-col items-end shrink-0 gap-1">
                      {f.rating !== null && (
                        <span className="font-tabular text-xs px-2 py-0.5 rounded bg-[#d4a359]/15 text-[#d4a359]">
                          {f.rating}★
                        </span>
                      )}
                      {f.review && (
                        <span className="font-tabular text-[10px] text-emerald-300">
                          {f.reviewWordCount}w
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 2. Social Companions & Shared Cinema Memories */}
      <section className="space-y-4">
        <div>
          <p className="font-tabular text-[11px] uppercase tracking-[0.2em] text-[#d4a359]">
            II · Shared Screenings & Watch Parties
          </p>
          <h3 className="font-editorial text-2xl text-[var(--text-primary)]">
            Who You Watched With (From Your Diary Tags)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {companionGroups.map((cg) => (
            <div
              key={cg.tag}
              className="archive-plate rounded-2xl p-5 flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xl">{cg.emoji}</span>
                  <span className="font-tabular text-sm font-bold text-[#d4a359]">
                    {cg.count} logs
                  </span>
                </div>
                <h4 className="font-editorial text-lg text-[var(--text-primary)] mt-2">
                  {cg.label}
                </h4>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{cg.desc}</p>
              </div>

              <div className="pt-3 border-t border-[var(--border-hairline)] space-y-1">
                {cg.films.slice(0, 3).map((f) => (
                  <p
                    key={f.id}
                    onClick={() => f.review && onOpenReview && onOpenReview(f.title)}
                    className="text-xs text-[var(--text-secondary)] truncate hover:text-[#d4a359] cursor-pointer"
                  >
                    • {f.title} ({f.watchedDate.slice(0, 4)})
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. High-Density Marathon Days (2, 3+ Movies in a Single Day) */}
      <section className="space-y-4">
        <div>
          <p className="font-tabular text-[11px] uppercase tracking-[0.2em] text-[#d4a359]">
            III · Single-Day Double & Triple Features
          </p>
          <h3 className="font-editorial text-2xl text-[var(--text-primary)]">
            Peak Marathon Days (Back-to-Back Screenings)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marathonDays.map((md) => (
            <div
              key={md.date}
              className="archive-plate rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-hairline)]">
                <span className="font-tabular text-xs font-semibold text-[#d4a359]">
                  {md.date}
                </span>
                <span className="font-tabular text-xs px-2.5 py-0.5 rounded-full bg-[#e05a47]/20 text-[#e05a47]">
                  {md.count} films · {Math.round(md.totalMinutes / 60)}h {md.totalMinutes % 60}m
                </span>
              </div>

              <div className="space-y-1.5">
                {md.films.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => f.review && onOpenReview && onOpenReview(f.title)}
                    className="flex items-center justify-between text-xs hover:text-[#d4a359] cursor-pointer"
                  >
                    <span className="font-editorial text-sm text-[var(--text-primary)] truncate">
                      {f.title} ({f.releaseYear})
                    </span>
                    <span className="font-tabular text-[#d4a359] shrink-0 ml-2">
                      {f.rating ? `${f.rating}★` : 'Logged'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
