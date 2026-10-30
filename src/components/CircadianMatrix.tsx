import React, { useState, useMemo } from 'react';
import { PlayRecord, CircadianHourCell } from '../types';
import { computeCircadianMatrix } from '../lib/analytics';
import { Clock, Sun, Moon, Sunset, Compass, Music2 } from 'lucide-react';

interface CircadianMatrixProps {
  records: PlayRecord[];
  activeOnly: boolean;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CircadianMatrix: React.FC<CircadianMatrixProps> = ({ records, activeOnly }) => {
  const [hoveredCell, setHoveredCell] = useState<CircadianHourCell | null>(null);

  const matrix = useMemo(() => computeCircadianMatrix(records), [records]);

  // Find max plays for scaling color
  const maxPlays = useMemo(() => {
    let max = 1;
    matrix.forEach(c => {
      if (c.plays > max) max = c.plays;
    });
    return max;
  }, [matrix]);

  const formatHour = (h: number) => {
    if (h === 0) return '12 AM';
    if (h === 12) return '12 PM';
    return h < 12 ? `${h} AM` : `${h - 12} PM`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-hairline)] pb-5">
        <div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-normal tracking-tight text-[var(--text-primary)]">
            24-Hour Circadian Mood Matrix
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
            Unveiling your biophysical listening cadence across the week. Witness the contrast between 2:00 AM introspective sessions versus sunset cinematic scores and midday Tamil rap surges.
          </p>
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>Less active</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-zinc-900 border border-white/5" />
            <span className="w-3 h-3 rounded bg-purple-950/70" />
            <span className="w-3 h-3 rounded bg-purple-700/80" />
            <span className="w-3 h-3 rounded bg-indigo-500" />
            <span className="w-3 h-3 rounded bg-amber-400" />
          </div>
          <span>Peak flow</span>
        </div>
      </div>

      {/* 7x24 Heatmap Grid Card */}
      <div className="rounded-2xl glass-card p-6 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Day-Hour Grid */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[720px]">
            {/* Hour header */}
            <div className="grid grid-cols-[50px_repeat(24,1fr)] gap-1 mb-2">
              <span className="text-[10px] font-mono text-zinc-500">Day</span>
              {Array.from({ length: 24 }).map((_, h) => (
                <span
                  key={h}
                  className="text-[9px] font-mono text-zinc-500 text-center"
                >
                  {h % 3 === 0 ? formatHour(h) : '•'}
                </span>
              ))}
            </div>

            {/* Rows for each day */}
            {DAYS.map((dayName, dIdx) => (
              <div
                key={dayName}
                className="grid grid-cols-[50px_repeat(24,1fr)] gap-1 mb-1 items-center"
              >
                <span className="text-xs font-semibold text-zinc-400 font-mono">
                  {dayName}
                </span>

                {Array.from({ length: 24 }).map((_, h) => {
                  const cell = matrix.find(c => c.dayOfWeek === dIdx && c.hour === h) || {
                    dayOfWeek: dIdx,
                    hour: h,
                    plays: 0,
                    totalMinutes: 0,
                    dominantGenre: '',
                    topArtist: ''
                  };

                  const ratio = cell.plays / maxPlays;
                  let bgClass = 'bg-white/[0.02] border border-white/5';

                  if (cell.plays > 0) {
                    if (ratio < 0.2) bgClass = 'bg-purple-950/60 border border-purple-900/40';
                    else if (ratio < 0.45) bgClass = 'bg-purple-800/70 border border-purple-600/50';
                    else if (ratio < 0.75) bgClass = 'bg-indigo-600/90 border border-indigo-400/60';
                    else bgClass = 'bg-gradient-to-tr from-amber-500 to-amber-300 text-black border border-amber-200 shadow-md shadow-amber-500/20';
                  }

                  return (
                    <div
                      key={h}
                      onMouseEnter={() => setHoveredCell(cell)}
                      className={`h-7 rounded-md cursor-pointer transition-transform duration-150 hover:scale-110 hover:z-10 ${bgClass}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Hovered Cell Detail Drawer */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          {hoveredCell ? (
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  {DAYS[hoveredCell.dayOfWeek]} at {formatHour(hoveredCell.hour)}
                </span>
                <span className="text-zinc-500 font-mono">({hoveredCell.hour}:00 - {hoveredCell.hour}:59)</span>
              </div>

              <div>
                <span className="text-zinc-400 text-[11px] block">Plays Recorded</span>
                <span className="font-semibold text-purple-300 text-sm">
                  {hoveredCell.plays} tracks ({hoveredCell.totalMinutes} mins)
                </span>
              </div>

              <div>
                <span className="text-zinc-400 text-[11px] block">Dominant Vibe</span>
                <span className="font-semibold text-amber-300">
                  {hoveredCell.dominantGenre || 'Ambient Rest'}
                </span>
              </div>

              {hoveredCell.topArtist && hoveredCell.topArtist !== 'None' && (
                <div>
                  <span className="text-zinc-400 text-[11px] block">Frequent Artist</span>
                  <span className="font-semibold text-white">
                    {hoveredCell.topArtist}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-zinc-500 italic">
              Hover over any cell in the 7×24 grid to view specific hourly listening characteristics.
            </div>
          )}

          <div className="text-[11px] font-mono text-zinc-400">
            {activeOnly ? '⚡ Filtered (Sleep Purged)' : '🌙 Unfiltered Activity'}
          </div>
        </div>
      </div>

      {/* Time-of-Day Sonic Profile Archetypes (From Spec) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Late Night */}
        <div className="rounded-2xl glass-card p-5 border border-indigo-500/20 relative overflow-hidden">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-indigo-400 tracking-wider">
                1:00 AM – 5:00 AM
              </span>
              <h3 className="text-sm font-bold text-white font-heading">
                Late Night Introspection
              </h3>
            </div>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed mb-3">
            Minimalist soul, acoustic guitar, and quiet reflections. Heavily populated by SiR's <em>Chasing Summer</em>, Brent Faiyaz's <em>Sonder Son</em>, and Laufey's cello-led ballads.
          </p>
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-200 border border-indigo-800/30">Quiet Soul</span>
            <span className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-200 border border-indigo-800/30">Minor Key</span>
            <span className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-200 border border-indigo-800/30">Solitary</span>
          </div>
        </div>

        {/* Dusk / Sunset */}
        <div className="rounded-2xl glass-card p-5 border border-amber-500/20 relative overflow-hidden">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <Sunset className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider">
                5:00 PM – 8:00 PM
              </span>
              <h3 className="text-sm font-bold text-white font-heading">
                Golden Hour Cinema & Scores
              </h3>
            </div>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed mb-3">
            Emotional, sweeping orchestration. Swelling strings and brass from Govind Vasantha's <em>96</em>, Ludwig Göransson's <em>Oppenheimer</em>, and Justin Hurwitz's <em>La La Land</em>.
          </p>
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-200 border border-amber-800/30">Cinematic Violin</span>
            <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-200 border border-amber-800/30">Golden Hour</span>
            <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-200 border border-amber-800/30">High Valence</span>
          </div>
        </div>

        {/* Daytime / Midday Peak */}
        <div className="rounded-2xl glass-card p-5 border border-emerald-500/20 relative overflow-hidden">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">
                11:00 AM – 4:00 PM
              </span>
              <h3 className="text-sm font-bold text-white font-heading">
                Midday Rhythm & Drill
              </h3>
            </div>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed mb-3">
            High tempo, heavy 808s, and intense lyrical velocity. The home of JanZee Official's street verses, 3D bass remixes, and UK/US trap workouts.
          </p>
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-200 border border-emerald-800/30">Underground Rap</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-200 border border-emerald-800/30">3D Spatial</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-200 border border-emerald-800/30">Adrenaline Flow</span>
          </div>
        </div>
      </div>
    </div>
  );
};
