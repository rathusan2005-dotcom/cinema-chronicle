import React, { useMemo, useState, useRef } from 'react';
import * as d3 from 'd3';
import { FilmRecord } from '../types';
import {
  getActiveCinemaCurrents,
  mapRecordToCurrentId,
  computeEmergentEras,
  CurrentResolution
} from '../lib/analytics';
import { RATH_PROFILE } from '../lib/letterboxdArchive';
import {
  Sparkles,
  Layers,
  Sliders,
  Film,
  Star,
  Heart,
  Clock,
  BookOpen
} from 'lucide-react';

interface EraStreamgraphProps {
  records: FilmRecord[];
  onSelectFilmReview?: (filmTitle: string) => void;
}

export const EraStreamgraph: React.FC<EraStreamgraphProps> = ({
  records,
  onSelectFilmReview
}) => {
  const [metric, setMetric] = useState<'films' | 'hours'>('films');
  const [granularity, setGranularity] = useState<'quarter' | 'month'>('quarter');
  const [resolution, setResolution] = useState<CurrentResolution>('nuanced');
  const [saliencyCap, setSaliencyCap] = useState<number>(5);
  const [excludeImdbBackfill, setExcludeImdbBackfill] = useState<boolean>(false);
  const [hoveredPeriod, setHoveredPeriod] = useState<string | null>(null);
  const [selectedCurrentId, setSelectedCurrentId] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Leave the 70 undated watched.csv entries out of the chronological streamgraph automatically
  const datedStreamRecords = useMemo(() => {
    return records.filter((r) => {
      if (!r.isDiaryLogged) return false;
      if (excludeImdbBackfill && r.isImdbBackfill) return false;
      return true;
    });
  }, [records, excludeImdbBackfill]);

  const activeCurrents = useMemo(() => getActiveCinemaCurrents(resolution), [resolution]);
  const emergentEras = useMemo(() => computeEmergentEras(records), [records]);

  const { timeSeriesData, periods, periodLabels, displayedCurrents, periodTopFilms } = useMemo(() => {
    const map = new Map<string, Record<string, number>>();
    const labels = new Map<string, string>();
    const currentTotals: Record<string, number> = {};
    const pFilms = new Map<string, FilmRecord[]>();

    activeCurrents.forEach((c) => {
      currentTotals[c.id] = 0;
    });

    const sorted = [...datedStreamRecords].sort((a, b) => a.watchedDate.localeCompare(b.watchedDate));

    sorted.forEach((r) => {
      const yr = parseInt(r.watchedDate.slice(0, 4), 10);
      const mo = parseInt(r.watchedDate.slice(5, 7), 10) - 1;
      if (isNaN(yr) || isNaN(mo)) return;

      let key: string;
      let label: string;

      if (granularity === 'quarter') {
        const q = Math.floor(mo / 3) + 1;
        key = `${yr}-Q${q}`;
        label = `Q${q} '${String(yr).slice(2)}`;
      } else {
        key = `${yr}-${String(mo + 1).padStart(2, '0')}`;
        const d = new Date(yr, mo, 1);
        label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      }

      if (!map.has(key)) {
        const init: Record<string, number> = {};
        activeCurrents.forEach((c) => {
          init[c.id] = 0;
        });
        init.__other__ = 0;
        map.set(key, init);
        labels.set(key, label);
      }

      const cid = mapRecordToCurrentId(r, resolution);
      const val = metric === 'hours' ? r.runtimeMinutes / 60 : 1;
      const entry = map.get(key)!;
      entry[cid] = (entry[cid] || 0) + val;
      currentTotals[cid] = (currentTotals[cid] || 0) + val;

      const list = pFilms.get(key) || [];
      list.push(r);
      pFilms.set(key, list);
    });

    const rankedIds = Object.entries(currentTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);

    const effectiveCap = Math.min(saliencyCap, activeCurrents.length);
    const topSet = new Set(rankedIds.slice(0, effectiveCap));
    const hasResidual = effectiveCap < activeCurrents.length;

    const finalCurrents = activeCurrents.filter((c) => topSet.has(c.id));
    if (hasResidual) {
      finalCurrents.push({
        id: '__other__',
        name: 'Other Cinema Streams',
        shortName: 'Other Streams',
        color: '#57534e',
        secondaryColor: '#292524',
        description: 'Remaining cinematic movements folded for streamgraph visual clarity.',
        anchorDirectors: []
      });
    }

    const sortedKeys = Array.from(map.keys()).sort();
    const series = sortedKeys.map((k) => {
      const raw = map.get(k)!;
      const row: Record<string, any> = { period: k, __other__: 0 };
      activeCurrents.forEach((c) => {
        if (topSet.has(c.id)) {
          row[c.id] = Number((raw[c.id] || 0).toFixed(2));
        } else {
          row.__other__ = Number((row.__other__ + (raw[c.id] || 0)).toFixed(2));
        }
      });
      return row;
    });

    return {
      timeSeriesData: series,
      periods: sortedKeys,
      periodLabels: labels,
      displayedCurrents: finalCurrents,
      periodTopFilms: pFilms
    };
  }, [datedStreamRecords, metric, granularity, resolution, saliencyCap, activeCurrents]);

  const width = 1040;
  const height = 390;
  const margin = { top: 24, right: 24, bottom: 38, left: 24 };

  const { layers, xScale, yScale } = useMemo(() => {
    if (timeSeriesData.length === 0) {
      return {
        layers: [],
        xScale: d3.scalePoint<string>().domain([]).range([margin.left, width - margin.right]),
        yScale: d3.scaleLinear().domain([0, 1]).range([height - margin.bottom, margin.top])
      };
    }

    const keys = displayedCurrents.map((c) => c.id);
    const stack = d3
      .stack<Record<string, any>>()
      .keys(keys)
      .offset(d3.stackOffsetSilhouette)
      .order(d3.stackOrderInsideOut);

    const stackedLayers = stack(timeSeriesData);

    const x = d3
      .scalePoint<string>()
      .domain(periods)
      .range([margin.left, width - margin.right]);

    const yMin = d3.min(stackedLayers, (layer) => d3.min(layer, (d) => d[0])) || 0;
    const yMax = d3.max(stackedLayers, (layer) => d3.max(layer, (d) => d[1])) || 1;

    const y = d3
      .scaleLinear()
      .domain([yMin * 1.08, yMax * 1.08])
      .range([height - margin.bottom, margin.top]);

    return { layers: stackedLayers, xScale: x, yScale: y };
  }, [timeSeriesData, periods, displayedCurrents]);

  const areaGenerator = useMemo(() => {
    return d3
      .area<any>()
      .x((d) => xScale(d.data.period) || 0)
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]))
      .curve(d3.curveBasis);
  }, [xScale, yScale]);

  const activePeriodKey = useMemo(() => {
    if (hoveredPeriod && periods.includes(hoveredPeriod)) return hoveredPeriod;
    return periods.find((p) => p.startsWith('2025-Q1') || p.startsWith('2024-Q4')) || periods[periods.length - 1] || '';
  }, [hoveredPeriod, periods]);

  const activeSliceStats = useMemo(() => {
    const row = timeSeriesData.find((d) => d.period === activePeriodKey);
    if (!row) return { total: 0, breakdown: [], filmsInPeriod: [] as FilmRecord[] };

    let total = 0;
    const breakdown = displayedCurrents
      .map((c) => {
        const val = row[c.id] || 0;
        total += val;
        return { current: c, val };
      })
      .filter((item) => item.val > 0)
      .sort((a, b) => b.val - a.val);

    const filmsInPeriod = (periodTopFilms.get(activePeriodKey) || []).sort(
      (a, b) => (b.rating || 0) * 10 + b.reviewWordCount / 100 - ((a.rating || 0) * 10 + a.reviewWordCount / 100)
    );

    return {
      total: Number(total.toFixed(1)),
      breakdown: breakdown.map((b) => ({
        ...b,
        pct: total > 0 ? Math.round((b.val / total) * 100) : 0
      })),
      filmsInPeriod
    };
  }, [timeSeriesData, activePeriodKey, displayedCurrents, periodTopFilms]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || periods.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * width;

    let closest = periods[0];
    let minDiff = Infinity;
    periods.forEach((p) => {
      const px = xScale(p) || 0;
      const diff = Math.abs(px - relX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = p;
      }
    });
    setHoveredPeriod(closest);
  };

  return (
    <div className="space-y-10">
      {/* 1. The River of Cinema Hero Canvas */}
      <section className="archive-plate rounded-3xl p-5 sm:p-8 relative overflow-hidden">
        <div
          className="absolute -top-28 right-1/4 w-[28rem] h-[28rem] rounded-full blur-3xl pointer-events-none opacity-15"
          style={{
            background: 'radial-gradient(circle, #e05a47 0%, #a78bfa 50%, transparent 75%)'
          }}
        />

        {/* Editorial Header & Stream Controls */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-6 relative z-10">
          <div>
            <p className="font-tabular text-[11px] uppercase tracking-[0.2em] text-[#d4a359] mb-1.5">
              I · The Living River of Cinema (2021 – 2026)
            </p>
            <h2 className="font-editorial text-2xl sm:text-4xl font-normal text-[var(--text-primary)] tracking-tight">
              Cinematic Currents & The 2024–2025 Supernova
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
              Scrub across your 6-year screening history to trace how Tamil New Wave grit, poetic heartbreak, South Indian soul, and IMAX sci-fi flowed into your 254-film marathon era.
            </p>
          </div>

          {/* Control Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Resolution Switcher */}
            <div className="flex items-center bg-black/40 p-1 rounded-full border border-[var(--border-hairline)]">
              <Layers className="w-3.5 h-3.5 text-[#d4a359] ml-2 mr-1 hidden sm:inline" />
              {(['nuanced', 'balanced', 'broad', 'decades'] as CurrentResolution[]).map((res) => (
                <button
                  key={res}
                  onClick={() => {
                    setResolution(res);
                    setSelectedCurrentId(null);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium capitalize transition-all ${
                    resolution === res
                      ? 'bg-[#d4a359]/20 text-[#f4f0ea] border border-[#d4a359]/40'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  {res === 'nuanced'
                    ? '8 Movements'
                    : res === 'balanced'
                    ? '5 Streams'
                    : res === 'broad'
                    ? '3 Macro'
                    : 'By Decade'}
                </button>
              ))}
            </div>

            {/* Saliency Cap */}
            {resolution === 'nuanced' && (
              <div className="flex items-center bg-black/40 p-1 rounded-full border border-[var(--border-hairline)]">
                <Sliders className="w-3 h-3 text-[var(--text-muted)] ml-2 mr-1" />
                {[3, 5, 8].map((cap) => (
                  <button
                    key={cap}
                    onClick={() => setSaliencyCap(cap)}
                    className={`px-2 py-1 rounded-full text-[11px] font-tabular transition-all ${
                      saliencyCap === cap
                        ? 'bg-white/12 text-white font-semibold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                    }`}
                  >
                    {cap === 8 ? 'All 8' : `Top ${cap}`}
                  </button>
                ))}
              </div>
            )}

            {/* Cadence Switcher */}
            <div className="flex items-center bg-black/40 p-1 rounded-full border border-[var(--border-hairline)]">
              {(['quarter', 'month'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGranularity(g)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    granularity === g
                      ? 'bg-white/12 text-white'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  {g === 'quarter' ? 'Quarterly' : 'Monthly'}
                </button>
              ))}
            </div>

            {/* IMDb Backfill Scope Switcher */}
            <div className="flex items-center bg-black/40 p-1 rounded-full border border-[var(--border-hairline)]">
              <button
                onClick={() => setExcludeImdbBackfill(false)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  !excludeImdbBackfill
                    ? 'bg-white/12 text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                Full 2021–2026
              </button>
              <button
                onClick={() => setExcludeImdbBackfill(true)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  excludeImdbBackfill
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/35'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
                title="Excludes the 177 pre-Oct 26, 2022 IMDb retrospective import logs"
              >
                Post-IMDb Only (Nov '22+)
              </button>
            </div>

            {/* Metric Switcher */}
            <div className="flex items-center bg-black/40 p-1 rounded-full border border-[var(--border-hairline)]">
              <button
                onClick={() => setMetric('films')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  metric === 'films'
                    ? 'bg-[#e05a47]/25 text-[#f4f0ea] border border-[#e05a47]/40'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                Screenings
              </button>
              <button
                onClick={() => setMetric('hours')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  metric === 'hours'
                    ? 'bg-[#e05a47]/25 text-[#f4f0ea] border border-[#e05a47]/40'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                Hours
              </button>
            </div>
          </div>
        </div>

        {/* Streamgraph SVG Canvas */}
        <div className="relative w-full overflow-x-auto">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            onMouseMove={handleMouseMove}
            className="w-full h-auto min-w-[680px] select-none cursor-crosshair"
          >
            <defs>
              {displayedCurrents.map((c) => (
                <linearGradient key={c.id} id={`grad-${c.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={c.color} stopOpacity={0.78} />
                  <stop offset="50%" stopColor={c.color} stopOpacity={0.94} />
                  <stop offset="100%" stopColor={c.secondaryColor} stopOpacity={0.82} />
                </linearGradient>
              ))}
            </defs>

            {/* Vertical Year Gridlines */}
            {periods.map((p, idx) => {
              const isYearStart = granularity === 'quarter' ? p.endsWith('-Q1') : p.endsWith('-01');
              if (!isYearStart && idx % (granularity === 'quarter' ? 2 : 6) !== 0) return null;
              const x = xScale(p) || 0;
              return (
                <g key={p}>
                  <line
                    x1={x}
                    y1={margin.top}
                    x2={x}
                    y2={height - margin.bottom}
                    stroke="rgba(242, 240, 234, 0.06)"
                    strokeDasharray={isYearStart ? undefined : '3 3'}
                  />
                  <text
                    x={x}
                    y={height - 12}
                    textAnchor="middle"
                    className="fill-[var(--text-muted)] font-tabular text-[10px]"
                  >
                    {periodLabels.get(p)}
                  </text>
                </g>
              );
            })}

            {/* Stream Ribbon Layers */}
            {layers.map((layer) => {
              const currentMeta = displayedCurrents.find((c) => c.id === layer.key);
              if (!currentMeta) return null;
              const isDimmed = selectedCurrentId !== null && selectedCurrentId !== currentMeta.id;

              return (
                <path
                  key={layer.key}
                  d={areaGenerator(layer) || ''}
                  fill={`url(#grad-${currentMeta.id})`}
                  stroke={currentMeta.color}
                  strokeWidth={selectedCurrentId === currentMeta.id ? 1.5 : 0.5}
                  strokeOpacity={0.45}
                  opacity={isDimmed ? 0.16 : 0.92}
                  onClick={() =>
                    setSelectedCurrentId(selectedCurrentId === currentMeta.id ? null : currentMeta.id)
                  }
                  className="transition-opacity duration-300 cursor-pointer hover:brightness-110"
                />
              );
            })}

            {/* Active Scrubber Line */}
            {activePeriodKey && xScale(activePeriodKey) !== undefined && (
              <g>
                <line
                  x1={xScale(activePeriodKey)}
                  y1={margin.top - 6}
                  x2={xScale(activePeriodKey)}
                  y2={height - margin.bottom}
                  stroke="#d4a359"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                />
                <circle
                  cx={xScale(activePeriodKey)}
                  cy={margin.top - 6}
                  r={4}
                  fill="#d4a359"
                />
              </g>
            )}
          </svg>
        </div>

        {/* Interactive Legend Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--border-hairline)]">
          {displayedCurrents.map((c) => {
            const isSelected = selectedCurrentId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCurrentId(isSelected ? null : c.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all border ${
                  isSelected
                    ? 'bg-white/15 text-white border-white/30 shadow-sm'
                    : selectedCurrentId
                    ? 'opacity-45 bg-white/[0.02] border-transparent text-[var(--text-muted)]'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] border-[var(--border-hairline)] text-[var(--text-secondary)]'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: c.color }}
                />
                <span className="font-medium">{c.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Live Scrubber Readout Panel: Breakdown + Actual Films Watched in Period */}
        <div className="mt-6 pt-5 border-t border-[var(--border-hairline)] grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 5 cols: Period Movement Balance */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-tabular text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                  Inspected Window
                </span>
                <h3 className="font-editorial text-xl text-[var(--text-primary)]">
                  {periodLabels.get(activePeriodKey) || activePeriodKey}
                </h3>
              </div>
              <div className="text-right">
                <span className="font-tabular text-lg font-semibold text-[#d4a359]">
                  {activeSliceStats.total}
                </span>
                <span className="text-xs text-[var(--text-muted)] ml-1">
                  {metric === 'hours' ? 'hrs screened' : 'screenings'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {activeSliceStats.breakdown.slice(0, 4).map((b) => (
                <div key={b.current.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: b.current.color }}
                      />
                      {b.current.name}
                    </span>
                    <span className="font-tabular text-[var(--text-primary)]">
                      {b.val} {metric === 'hours' ? 'h' : ''} ({b.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${b.pct}%`, backgroundColor: b.current.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 7 cols: Highlight Screenings from Inspected Period */}
          <div className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-[var(--border-hairline)] pt-4 lg:pt-0 lg:pl-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-tabular text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                Key Screenings in {periodLabels.get(activePeriodKey) || activePeriodKey} (
                {activeSliceStats.filmsInPeriod.length} logged)
              </span>
              <span className="text-[11px] text-[#d4a359]">Click any reviewed film to read</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeSliceStats.filmsInPeriod.slice(0, 6).map((f) => (
                <div
                  key={f.id}
                  onClick={() => f.review && onSelectFilmReview && onSelectFilmReview(f.title)}
                  className={`p-3 rounded-2xl bg-white/[0.02] border border-[var(--border-hairline)] flex items-start justify-between gap-2 transition-all ${
                    f.review
                      ? 'cursor-pointer hover:bg-white/[0.06] hover:border-[#d4a359]/40'
                      : ''
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-editorial text-sm font-medium text-[var(--text-primary)] truncate">
                        {f.title}
                      </p>
                      {f.isLiked && (
                        <Heart className="w-3 h-3 text-rose-400 fill-rose-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] truncate">
                      {f.director} · {f.releaseYear} · {f.watchedDate}
                    </p>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    {f.rating !== null && (
                      <span className="font-tabular text-[11px] px-1.5 py-0.5 rounded bg-[#d4a359]/15 text-[#d4a359] border border-[#d4a359]/30">
                        {f.rating}★
                      </span>
                    )}
                    {f.review && (
                      <span className="text-[10px] text-emerald-300/90 flex items-center gap-1">
                        <BookOpen className="w-2.5 h-2.5" />
                        {f.reviewWordCount}w
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Rath's Letterboxd Top 4 Patron Saints */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <p className="font-tabular text-[11px] uppercase tracking-[0.2em] text-[#d4a359]">
              II · Letterboxd Patron Saints (@{RATH_PROFILE.username} · {RATH_PROFILE.location})
            </p>
            <h3 className="font-editorial text-2xl text-[var(--text-primary)]">
              The 4 Cornerstones of Your Soul — <span className="italic text-[var(--text-secondary)]">"{RATH_PROFILE.bio}"</span>
            </h3>
          </div>
          <span className="font-tabular text-xs text-[var(--text-muted)]">
            Poetic devotion, musical yearning & bittersweet romance
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {RATH_PROFILE.favoriteFilms.map((fav, idx) => (
            <div
              key={fav.title}
              onClick={() => onSelectFilmReview && onSelectFilmReview(fav.title)}
              className="archive-plate rounded-2xl p-5 relative overflow-hidden group cursor-pointer hover:border-[#d4a359]/50 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-tabular text-[11px] uppercase tracking-widest text-[#d4a359]">
                  Top 0{idx + 1} · Patron Saint
                </span>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span className="font-tabular text-xs font-semibold text-[#d4a359]">
                    {fav.rating.toFixed(1)}★
                  </span>
                </div>
              </div>

              <h4 className="font-editorial text-xl font-medium text-[var(--text-primary)] group-hover:text-[#d4a359] transition-colors">
                {fav.title}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {fav.director} · {fav.year}
              </p>

              <p className="text-xs text-[var(--text-muted)] mt-3 pt-3 border-t border-[var(--border-hairline)] leading-relaxed">
                {fav.tagline}
              </p>

              <div className="mt-3 flex items-center justify-between text-[11px] font-tabular text-[#d4a359]">
                <span>{fav.screenings} diary screenings</span>
                <span className="group-hover:translate-x-0.5 transition-transform">
                  Read reviews →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Emergent Life Eras (Chapters I - IV) */}
      <section className="space-y-4">
        <div>
          <p className="font-tabular text-[11px] uppercase tracking-[0.2em] text-[#d4a359]">
            III · Chronological Life Chapters
          </p>
          <h3 className="font-editorial text-2xl text-[var(--text-primary)]">
            Four Eras of Your Cinephile Autobiography
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {emergentEras.map((era) => (
            <div
              key={era.id}
              className="archive-plate rounded-3xl p-6 flex flex-col justify-between space-y-5 relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-tabular text-xs uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/[0.04] border border-[var(--border-hairline)] text-[#d4a359]">
                    Chapter {era.roman} · {era.periodLabel}
                  </span>
                  <div className="flex items-center gap-3 font-tabular text-xs text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                      <Film className="w-3.5 h-3.5 text-[#d4a359]" />
                      {era.totalFilms} films
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      {era.totalHours}h
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      {era.avgRating}★
                    </span>
                  </div>
                </div>

                <h4 className="font-editorial text-2xl text-[var(--text-primary)]">
                  {era.title}
                </h4>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {era.narrative}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-[var(--border-hairline)]">
                {/* Dominant Currents Bar */}
                <div className="flex flex-wrap gap-2">
                  {era.dominantCurrents.map((dc) => (
                    <span
                      key={dc.currentId}
                      className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-white/[0.03] border border-[var(--border-hairline)]"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: dc.color }}
                      />
                      <span className="text-[var(--text-secondary)]">{dc.name}</span>
                      <span className="font-tabular text-[var(--text-primary)]">{dc.sharePct}%</span>
                    </span>
                  ))}
                </div>

                {/* Anchor Films */}
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span className="truncate">
                    <strong className="text-[var(--text-secondary)] font-medium">Anchors: </strong>
                    {era.topFilms.join(' · ')}
                  </span>
                  <span className="font-tabular text-[#d4a359] shrink-0 ml-2">
                    {era.totalReviews} reviews penned
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
