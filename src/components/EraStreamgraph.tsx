import React, { useState, useMemo } from 'react';
import { PlayRecord } from '../types';
import { SONIC_CURRENTS } from '../lib/mockData';
import { computeRiverStreamData, computeEmergentEras } from '../lib/analytics';
import { Sliders, Clock, TrendingUp } from 'lucide-react';

interface EraStreamgraphProps {
  records: PlayRecord[];
  activeOnly: boolean;
}

export const EraStreamgraph: React.FC<EraStreamgraphProps> = ({ records }) => {
  const [granularity, setGranularity] = useState<'monthly' | 'quarterly'>('monthly');
  const [metric, setMetric] = useState<'minutes' | 'plays'>('minutes');
  const [maxActiveCurrents, setMaxActiveCurrents] = useState<number>(4);
  const [sensitivity, setSensitivity] = useState<'strict' | 'balanced' | 'broad'>('balanced');
  const [selectedPointKey, setSelectedPointKey] = useState<string | null>(null);
  const [hoveredCurrentId, setHoveredCurrentId] = useState<string | null>(null);

  // Compute stream timeline with Top N Saliency Filter & Genre Sensitivity
  const streamPoints = useMemo(() => {
    return computeRiverStreamData(records, granularity, metric, maxActiveCurrents, sensitivity);
  }, [records, granularity, metric, maxActiveCurrents, sensitivity]);

  // Compute Emergent Life Eras (Chapters I-IV) dynamically from the co-dominant currents
  const emergentEras = useMemo(() => {
    return computeEmergentEras(records, sensitivity);
  }, [records, sensitivity]);

  // Compute SVG dimensions and centered organic stream curves
  const svgWidth = 1040;
  const svgHeight = 350;
  const paddingX = 42;
  const paddingY = 34;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const stackData = useMemo(() => {
    if (streamPoints.length === 0) return { paths: [], maxVal: 1 };

    const currentKeys = SONIC_CURRENTS.map(c => c.id);

    // Find max total volume across points for scaling
    let maxVal = 0;
    streamPoints.forEach(p => {
      const sum = currentKeys.reduce((acc, k) => acc + (p.eraValues[k] || 0), 0);
      if (sum > maxVal) maxVal = sum;
    });

    if (maxVal === 0) maxVal = 1;

    const stepX = streamPoints.length > 1 ? chartWidth / (streamPoints.length - 1) : chartWidth;

    // Symmetric Lee Byron silhouette streamgraph baseline
    const paths = currentKeys.map(currentId => {
      const upperPoints: { x: number; y: number }[] = [];
      const lowerPoints: { x: number; y: number }[] = [];

      streamPoints.forEach((p, idx) => {
        const x = paddingX + idx * stepX;

        const totalSlice = currentKeys.reduce((acc, k) => acc + (p.eraValues[k] || 0), 0);
        const sliceNormalizedHeight = (totalSlice / maxVal) * chartHeight;

        const centerBaseline = paddingY + chartHeight / 2 + sliceNormalizedHeight / 2;

        let cumulativeBefore = 0;
        for (const prevId of currentKeys) {
          if (prevId === currentId) break;
          cumulativeBefore += p.eraValues[prevId] || 0;
        }

        const currentVal = p.eraValues[currentId] || 0;
        const cumulativeTop = cumulativeBefore + currentVal;

        const yBottom = centerBaseline - (cumulativeBefore / maxVal) * chartHeight;
        const yTop = centerBaseline - (cumulativeTop / maxVal) * chartHeight;

        lowerPoints.push({ x, y: yBottom });
        upperPoints.push({ x, y: yTop });
      });

      let d = `M ${upperPoints[0].x} ${upperPoints[0].y}`;
      for (let i = 1; i < upperPoints.length; i++) {
        const pPrev = upperPoints[i - 1];
        const pCurr = upperPoints[i];
        const cx1 = pPrev.x + (pCurr.x - pPrev.x) * 0.5;
        const cx2 = cx1;
        d += ` C ${cx1} ${pPrev.y}, ${cx2} ${pCurr.y}, ${pCurr.x} ${pCurr.y}`;
      }

      const lastLower = lowerPoints[lowerPoints.length - 1];
      d += ` L ${lastLower.x} ${lastLower.y}`;
      for (let i = lowerPoints.length - 2; i >= 0; i--) {
        const pNext = lowerPoints[i + 1];
        const pCurr = lowerPoints[i];
        const cx1 = pNext.x - (pNext.x - pCurr.x) * 0.5;
        const cx2 = cx1;
        d += ` C ${cx1} ${pNext.y}, ${cx2} ${pCurr.y}, ${pCurr.x} ${pCurr.y}`;
      }
      d += ' Z';

      const currentInfo = SONIC_CURRENTS.find(c => c.id === currentId)!;

      return {
        currentId,
        currentInfo,
        d
      };
    });

    return { paths, maxVal };
  }, [streamPoints, chartWidth, chartHeight]);

  const activePoint =
    streamPoints.find(p => p.key === selectedPointKey) || streamPoints[streamPoints.length - 1];

  return (
    <div className="space-y-10">
      {/* Editorial Header + Stream Engine Controls */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5 border-b border-[var(--border-hairline)] pb-5">
        <div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-normal tracking-tight text-[var(--text-primary)]">
            The Living River of Sound
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
            Pure musical currents flowing from 2020 to 2026. To preserve clarity, each time window surfaces the{' '}
            <span className="text-[var(--text-primary)] font-medium">Top {maxActiveCurrents} co-dominant currents</span>, allowing life chapters to emerge naturally from overlapping genres.
          </p>
        </div>

        {/* Tactile Archival Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Top N Saliency Cap */}
          <div className="flex items-center gap-1 bg-white/[0.03] px-2.5 py-1 rounded-full border border-[var(--border-hairline)] text-xs">
            <Sliders className="w-3 h-3 text-[#d4a359] mr-1" />
            <span className="text-[var(--text-muted)] text-[11px] mr-1">Cap:</span>
            {[3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setMaxActiveCurrents(n)}
                className={`px-2 py-0.5 rounded-full font-tabular text-[11px] transition ${
                  maxActiveCurrents === n
                    ? 'bg-[#d4a359]/25 text-[#f4f0ea] border border-[#d4a359]/40 font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title={`Display at most ${n} dominant currents in any single period`}
              >
                Top {n}
              </button>
            ))}
          </div>

          {/* Genre Resolution Sensitivity */}
          <div className="flex items-center bg-white/[0.03] p-0.5 rounded-full border border-[var(--border-hairline)] text-[11px]">
            {(
              [
                { id: 'strict', label: 'Nuanced Indie' },
                { id: 'balanced', label: 'Balanced' },
                { id: 'broad', label: 'Macro Genres' }
              ] as const
            ).map(mode => (
              <button
                key={mode.id}
                onClick={() => setSensitivity(mode.id)}
                className={`px-2.5 py-1 rounded-full transition font-medium ${
                  sensitivity === mode.id
                    ? 'bg-white/12 text-[var(--text-primary)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Monthly vs Quarterly */}
          <div className="flex items-center bg-white/[0.03] p-0.5 rounded-full border border-[var(--border-hairline)] text-[11px]">
            <button
              onClick={() => setGranularity('monthly')}
              className={`px-2.5 py-1 rounded-full transition font-medium ${
                granularity === 'monthly'
                  ? 'bg-white/12 text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setGranularity('quarterly')}
              className={`px-2.5 py-1 rounded-full transition font-medium ${
                granularity === 'quarterly'
                  ? 'bg-white/12 text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Quarterly
            </button>
          </div>

          {/* Minutes vs Plays */}
          <div className="flex items-center bg-white/[0.03] p-0.5 rounded-full border border-[var(--border-hairline)] text-[11px]">
            <button
              onClick={() => setMetric('minutes')}
              className={`px-2.5 py-1 rounded-full transition font-medium flex items-center gap-1 ${
                metric === 'minutes'
                  ? 'bg-white/12 text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <Clock className="w-3 h-3 text-[#d4a359]" />
              <span>Hours</span>
            </button>
            <button
              onClick={() => setMetric('plays')}
              className={`px-2.5 py-1 rounded-full transition font-medium flex items-center gap-1 ${
                metric === 'plays'
                  ? 'bg-white/12 text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <TrendingUp className="w-3 h-3 text-[#c85a32]" />
              <span>Plays</span>
            </button>
          </div>
        </div>
      </div>

      {/* Centerpiece Streamgraph Canvas */}
      <div className="relative rounded-2xl archive-plate p-4 sm:p-6 overflow-hidden">
        {/* Interactive Current Swatch Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4 pb-3 border-b border-[var(--border-hairline)]">
          <div className="flex items-center gap-2 flex-wrap">
            {SONIC_CURRENTS.map(current => {
              const isHovered = hoveredCurrentId === current.id;
              return (
                <button
                  key={current.id}
                  onMouseEnter={() => setHoveredCurrentId(current.id)}
                  onMouseLeave={() => setHoveredCurrentId(null)}
                  onClick={() =>
                    setHoveredCurrentId(prev => (prev === current.id ? null : current.id))
                  }
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] transition-all border ${
                    isHovered
                      ? 'bg-white/12 text-[var(--text-primary)] border-white/25 scale-[1.02]'
                      : hoveredCurrentId
                      ? 'opacity-40 border-transparent text-[var(--text-muted)]'
                      : 'bg-white/[0.02] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: current.color }}
                  />
                  <span>{current.shortName}</span>
                </button>
              );
            })}
          </div>

          <span className="font-tabular text-[11px] text-[var(--text-muted)]">
            Scrub across the river to inspect any period
          </span>
        </div>

        {/* SVG Streamgraph */}
        <div className="w-full overflow-x-auto pb-2 scrollbar-none">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[740px] select-none"
          >
            <defs>
              {SONIC_CURRENTS.map(c => (
                <linearGradient
                  key={`grad-${c.id}`}
                  id={`grad-${c.id}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={c.color} stopOpacity="0.92" />
                  <stop offset="100%" stopColor={c.secondaryColor} stopOpacity="0.78" />
                </linearGradient>
              ))}
            </defs>

            {/* Subtle Vertical Time Hairlines */}
            {streamPoints.map((p, idx) => {
              const stepX =
                streamPoints.length > 1 ? chartWidth / (streamPoints.length - 1) : chartWidth;
              const x = paddingX + idx * stepX;
              const isSelected = activePoint?.key === p.key;

              const showLabel =
                granularity === 'quarterly'
                  ? idx % 2 === 0 || isSelected
                  : p.month === 1 || isSelected;

              return (
                <g key={p.key}>
                  <line
                    x1={x}
                    y1={paddingY - 6}
                    x2={x}
                    y2={svgHeight - paddingY + 4}
                    stroke={
                      isSelected ? 'rgba(212, 163, 89, 0.7)' : 'rgba(244, 240, 234, 0.05)'
                    }
                    strokeDasharray={isSelected ? 'none' : '2 4'}
                    strokeWidth={isSelected ? 1.5 : 1}
                  />

                  {showLabel && (
                    <text
                      x={x}
                      y={svgHeight - 10}
                      fill={isSelected ? '#f4f0ea' : '#736d65'}
                      fontSize={isSelected ? '10.5' : '9.5'}
                      fontFamily="JetBrains Mono, monospace"
                      textAnchor="middle"
                      fontWeight={isSelected ? '600' : '400'}
                    >
                      {p.shortLabel}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Flowing Silk Ribbon Paths */}
            {stackData.paths.map(({ currentId, d }) => {
              const isDimmed = hoveredCurrentId && hoveredCurrentId !== currentId;
              const isHighlighted = hoveredCurrentId === currentId;

              return (
                <path
                  key={currentId}
                  d={d}
                  fill={`url(#grad-${currentId})`}
                  opacity={isDimmed ? 0.14 : isHighlighted ? 1 : 0.88}
                  stroke={
                    isHighlighted
                      ? 'rgba(244, 240, 234, 0.55)'
                      : 'rgba(244, 240, 234, 0.14)'
                  }
                  strokeWidth={isHighlighted ? '1.4' : '0.8'}
                  className="transition-opacity duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredCurrentId(currentId)}
                  onMouseLeave={() => setHoveredCurrentId(null)}
                />
              );
            })}

            {/* Overlay Interactive Scrub Hitboxes */}
            {streamPoints.map((p, idx) => {
              const stepX =
                streamPoints.length > 1 ? chartWidth / (streamPoints.length - 1) : chartWidth;
              const x = paddingX + idx * stepX;
              const w = stepX;

              return (
                <rect
                  key={`hit-${p.key}`}
                  x={x - w / 2}
                  y={0}
                  width={w}
                  height={svgHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => setSelectedPointKey(p.key)}
                  onMouseEnter={() => setSelectedPointKey(p.key)}
                />
              );
            })}
          </svg>
        </div>

        {/* Active Slice Archival Readout */}
        {activePoint && (
          <div className="mt-4 pt-5 border-t border-[var(--border-hairline)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Selected Window + Anchor Artist */}
            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
              <div>
                <span className="font-tabular text-[10px] uppercase tracking-widest text-[var(--text-muted)] block">
                  Selected Window
                </span>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  <span className="font-editorial text-2xl text-[var(--text-primary)]">
                    {activePoint.label}
                  </span>
                  {activePoint.isCrossover && (
                    <span className="font-tabular text-[10px] px-2 py-0.5 rounded-full bg-[#d4a359]/15 text-[#d4a359] border border-[#d4a359]/30">
                      Current Shift
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="font-tabular text-[10px] uppercase tracking-widest text-[var(--text-muted)] block">
                  Volume
                </span>
                <span className="font-tabular text-lg font-semibold text-[var(--text-primary)]">
                  {metric === 'minutes'
                    ? `${Math.round(activePoint.totalValue / 60)} hrs`
                    : `${activePoint.totalValue} plays`}
                </span>
                {metric === 'minutes' && (
                  <span className="font-tabular text-xs text-[var(--text-muted)] ml-1.5">
                    ({activePoint.totalValue.toLocaleString()}m)
                  </span>
                )}
              </div>

              <div>
                <span className="font-tabular text-[10px] uppercase tracking-widest text-[var(--text-muted)] block">
                  Anchor Voice
                </span>
                <span className="text-base font-medium text-[#d4a359]">
                  {activePoint.topArtist}
                </span>
              </div>
            </div>

            {/* Right: Top Active Currents Breakdown */}
            <div className="flex-1 max-w-xl">
              <div className="w-full h-2 rounded-full overflow-hidden flex bg-white/5 mb-2.5">
                {SONIC_CURRENTS.map(current => {
                  const pct = activePoint.eraPercentages[current.id] || 0;
                  if (pct <= 0) return null;
                  return (
                    <div
                      key={current.id}
                      style={{ width: `${pct}%`, backgroundColor: current.color }}
                      title={`${current.name}: ${pct}%`}
                    />
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {SONIC_CURRENTS.filter(c => (activePoint.eraPercentages[c.id] || 0) > 0)
                  .sort(
                    (a, b) =>
                      (activePoint.eraPercentages[b.id] || 0) -
                      (activePoint.eraPercentages[a.id] || 0)
                  )
                  .slice(0, maxActiveCurrents)
                  .map(current => {
                    const pct = activePoint.eraPercentages[current.id] || 0;
                    return (
                      <div key={current.id} className="flex items-center gap-1.5 text-xs">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: current.color }}
                        />
                        <span className="text-[var(--text-secondary)]">{current.shortName}</span>
                        <span className="font-tabular font-semibold text-[var(--text-primary)]">
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Emergent Life Chapters (I–IV): Liner-Notes Index */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--border-hairline)] pb-3">
          <h3 className="font-editorial text-2xl text-[var(--text-primary)]">
            Emergent Life Eras (Chapters I – IV)
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Mathematically synthesized from the co-dominant musical currents of each chronological window
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {emergentEras.map(chapter => (
            <div
              key={chapter.id}
              className="rounded-xl archive-plate p-5 flex flex-col justify-between space-y-4 hover:border-[var(--border-specular)] transition"
            >
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="font-editorial italic text-2xl text-[#d4a359]">
                    Chapter {chapter.roman}
                  </span>
                  <span className="font-tabular text-[11px] text-[var(--text-muted)]">
                    {chapter.periodLabel}
                  </span>
                </div>

                <div>
                  <h4 className="font-editorial text-lg text-[var(--text-primary)] leading-snug">
                    {chapter.title}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                    {chapter.narrative}
                  </p>
                </div>

                {/* Co-Dominant Currents Pill Bars */}
                <div className="space-y-1.5 pt-1">
                  {chapter.dominantCurrents.map(dc => (
                    <div key={dc.currentId} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: dc.color }}
                        />
                        <span className="text-[var(--text-secondary)]">{dc.name}</span>
                      </div>
                      <span className="font-tabular text-[var(--text-primary)] font-medium">
                        {dc.sharePct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between text-[11px]">
                <span className="text-[var(--text-muted)] truncate max-w-[150px]">
                  {chapter.topArtists.slice(0, 2).join(', ')}
                </span>
                <span className="font-tabular text-[#d4a359]">
                  {chapter.totalHours.toLocaleString()} hrs
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pure Sonic Currents Directory (Showing Tamil Indie Soul vs Tamil Rap separation) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--border-hairline)] pb-3">
          <h3 className="font-editorial text-2xl text-[var(--text-primary)]">
            Active Sonic Currents Taxonomy
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Tap any current to isolate its ribbon in the River of Sound above
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {SONIC_CURRENTS.map(current => {
            const isSelected = hoveredCurrentId === current.id;
            return (
              <div
                key={current.id}
                onClick={() =>
                  setHoveredCurrentId(prev => (prev === current.id ? null : current.id))
                }
                className={`rounded-xl p-4 cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-white/[0.06] border-[#d4a359]/60 shadow-lg'
                    : 'archive-plate hover:border-[var(--border-specular)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: current.color }}
                    />
                    <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                      {current.name}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                  {current.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {current.anchorArtists.slice(0, 4).map((artist: string) => (
                    <span
                      key={artist}
                      className="text-[11px] px-2 py-0.5 rounded bg-white/[0.03] border border-[var(--border-hairline)] text-[var(--text-secondary)]"
                    >
                      {artist}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
