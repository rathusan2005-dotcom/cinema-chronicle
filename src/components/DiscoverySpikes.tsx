import React, { useState, useMemo } from 'react';
import { PlayRecord, DiscoverySpike } from '../types';
import { MOCK_DISCOVERY_SPIKES } from '../lib/mockData';
import { computeDynamicDiscoverySpikes } from '../lib/analytics';
import { useAudioPlayer } from '../context/AudioContext';
import { 
  Flame, 
  Calendar, 
  Disc, 
  Zap, 
  ArrowUpRight, 
  TrendingUp, 
  X, 
  Sparkles, 
  Clock, 
  Layers, 
  Crown, 
  Activity,
  PieChart,
  Play,
  Pause,
  Loader2
} from 'lucide-react';

interface DiscoverySpikesProps {
  records: PlayRecord[];
  isCustomData: boolean;
}

export const DiscoverySpikes: React.FC<DiscoverySpikesProps> = ({ records, isCustomData }) => {
  const { activeTrack, isPlaying, isLoading, togglePreview } = useAudioPlayer();
  const [sortBy, setSortBy] = useState<'velocity' | 'date' | 'plays'>('velocity');
  const [selectedArtistDossier, setSelectedArtistDossier] = useState<DiscoverySpike | null>(null);

  // If using custom data, dynamically compute first contact and binge velocities
  const spikes = useMemo(() => {
    if (isCustomData) {
      const dynamic = computeDynamicDiscoverySpikes(records);
      return dynamic.length > 0 ? dynamic : MOCK_DISCOVERY_SPIKES;
    }
    return MOCK_DISCOVERY_SPIKES;
  }, [records, isCustomData]);

  const sortedSpikes = useMemo(() => {
    return [...spikes].sort((a, b) => {
      if (sortBy === 'velocity') return b.bingeVelocityScore - a.bingeVelocityScore;
      if (sortBy === 'date') return b.firstPlayedDate.getTime() - a.firstPlayedDate.getTime();
      return b.playsNext30Days - a.playsNext30Days;
    });
  }, [spikes, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-hairline)] pb-5">
        <div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-normal tracking-tight text-[var(--text-primary)]">
            First Contact & Binge Velocity
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
            The exact calendar date you first encountered an artist, paired with your immediate 30-day obsession trajectory. Select any artist to open their <span className="text-[var(--text-primary)] font-medium">Lifecycle Dossier</span>, gateway track, catalog friction, and peak share of ear.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-[var(--border-hairline)] text-xs">
          <button
            onClick={() => setSortBy('velocity')}
            className={`px-3 py-1.5 rounded-full transition font-medium ${
              sortBy === 'velocity'
                ? 'bg-[#c85a32]/25 text-[#f4f0ea] border border-[#c85a32]/40'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Binge Velocity
          </button>
          <button
            onClick={() => setSortBy('date')}
            className={`px-3 py-1.5 rounded-full transition font-medium ${
              sortBy === 'date'
                ? 'bg-white/12 text-[var(--text-primary)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Chronological
          </button>
          <button
            onClick={() => setSortBy('plays')}
            className={`px-3 py-1.5 rounded-full transition font-medium ${
              sortBy === 'plays'
                ? 'bg-white/12 text-[var(--text-primary)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            30-Day Volume
          </button>
        </div>
      </div>

      {/* Discovery Spikes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedSpikes.map((spike) => {
          const formattedDate = spike.firstPlayedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });

          return (
            <div
              key={spike.artistName}
              onClick={() => setSelectedArtistDossier(spike)}
              className="rounded-2xl glass-card p-5 border border-white/10 hover:border-rose-500/40 transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-950/20"
            >
              <div>
                {/* Top: Album Art + Velocity Score Badge */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-zinc-900 border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-300 relative">
                    {spike.albumCover ? (
                      <img
                        src={spike.albumCover}
                        alt={spike.artistName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as any).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <Disc className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        {formattedDate}
                      </span>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] font-bold font-mono">
                        <Zap className="w-3 h-3 fill-rose-400 text-rose-400" />
                        {spike.bingeVelocityScore}/100
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white truncate font-heading mt-1 flex items-center gap-1.5">
                      {spike.artistName}
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-rose-400 transition" />
                    </h3>
                    <p className="text-xs text-zinc-400 truncate flex items-center gap-1">
                      <span className="text-zinc-500 font-mono text-[10px] uppercase">Gateway:</span>
                      <span className="text-purple-300 font-medium truncate">{spike.firstTrack}</span>
                    </p>
                  </div>
                </div>

                {/* Binge Velocity Bar Chart (7d, 14d, 30d) */}
                <div className="space-y-2 p-3 rounded-xl bg-black/40 border border-white/5 mb-3">
                  <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                    <span>First 7 Days</span>
                    <span className="text-rose-300 font-bold">{spike.playsNext7Days} plays</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full"
                      style={{ width: `${Math.min(100, (spike.playsNext7Days / 50) * 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-zinc-400 font-mono pt-1">
                    <span>First 14 Days</span>
                    <span className="text-amber-300 font-semibold">{spike.playsNext14Days} plays</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full"
                      style={{ width: `${Math.min(100, (spike.playsNext14Days / 120) * 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-zinc-400 font-mono pt-1">
                    <span>First 30 Days</span>
                    <span className="text-purple-300 font-semibold">{spike.playsNext30Days} plays</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                      style={{ width: `${Math.min(100, (spike.playsNext30Days / 250) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Quick Tag */}
              <div className="pt-2 flex items-center justify-between text-[11px]">
                <span className="text-zinc-500 font-mono">
                  {spike.patternType || 'Permanent Anchor'}
                </span>
                <span className="text-rose-400/80 font-medium text-[10px] group-hover:underline">
                  View Full Dossier →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Artist Lifecycle Deep Dive Dossier Modal */}
      {selectedArtistDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl p-6 rounded-2xl glass-card border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-zinc-900 border border-white/10 shadow-xl">
                  {selectedArtistDossier.albumCover ? (
                    <img
                      src={selectedArtistDossier.albumCover}
                      alt={selectedArtistDossier.artistName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Disc className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-mono font-bold">
                      {selectedArtistDossier.patternType}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      Discovered {selectedArtistDossier.firstPlayedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white font-heading">
                    {selectedArtistDossier.artistName}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Binge Velocity Score: <strong className="text-rose-400">{selectedArtistDossier.bingeVelocityScore}/100</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedArtistDossier(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
              {/* Gateway Track */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 relative group/gw">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-0.5">
                  The Gateway Spark
                </span>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-purple-300 truncate block">
                    {selectedArtistDossier.firstTrack}
                  </span>
                  <button
                    onClick={() => togglePreview(selectedArtistDossier.artistName, selectedArtistDossier.firstTrack)}
                    className="p-1 rounded-full bg-white/10 hover:bg-[#d4a359] hover:text-black transition shrink-0"
                    title={`Preview ${selectedArtistDossier.firstTrack}`}
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                  </button>
                </div>
                <span className="text-[10px] text-zinc-500">First contact</span>
              </div>

              {/* All-Time Crown Track */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 relative group/crown">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-0.5">
                  All-Time Crown
                </span>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-amber-300 truncate block">
                    {selectedArtistDossier.allTimeCrownTrack}
                  </span>
                  <button
                    onClick={() => togglePreview(selectedArtistDossier.artistName, selectedArtistDossier.allTimeCrownTrack)}
                    className="p-1 rounded-full bg-white/10 hover:bg-[#d4a359] hover:text-black transition shrink-0"
                    title={`Preview ${selectedArtistDossier.allTimeCrownTrack}`}
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                  </button>
                </div>
                <span className="text-[10px] text-zinc-500">Most looped track</span>
              </div>

              {/* Peak Share of Ear */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-0.5">
                  Peak Share of Ear
                </span>
                <span className="text-xs font-bold text-emerald-400 block font-mono">
                  {selectedArtistDossier.peakMonthShareOfEar}%
                </span>
                <span className="text-[10px] text-zinc-500">In {selectedArtistDossier.peakMonth}</span>
              </div>

              {/* Catalog Exploration */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-0.5">
                  Catalog Friction
                </span>
                <span className="text-xs font-bold text-indigo-300 block font-mono">
                  {selectedArtistDossier.daysToSecondRelease} days
                </span>
                <span className="text-[10px] text-zinc-500">To 2nd project</span>
              </div>
            </div>

            {/* 30-Day Binge Acceleration Trajectory Curve */}
            {selectedArtistDossier.trajectoryCurve && selectedArtistDossier.trajectoryCurve.length > 1 && (
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 mb-5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                    30-Day Cumulative Binge Velocity Trajectory
                  </span>
                  <span className="text-zinc-500 text-[10px] font-mono">
                    {selectedArtistDossier.playsNext30Days} plays in 30 days
                  </span>
                </div>

                {/* Trajectory Sparkline SVG */}
                <div className="h-20 w-full pt-2">
                  <svg viewBox="0 0 400 60" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="traj-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#fbbf24" />
                      </linearGradient>
                    </defs>
                    {/* Points path */}
                    {(() => {
                      const data = selectedArtistDossier.trajectoryCurve;
                      const max = Math.max(...data, 1);
                      const points = data.map((val, idx) => {
                        const x = (idx / (data.length - 1)) * 390 + 5;
                        const y = 55 - (val / max) * 45;
                        return { x, y };
                      });
                      const d = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
                      return (
                        <>
                          <path d={d} fill="none" stroke="url(#traj-grad)" strokeWidth="2.5" strokeLinecap="round" />
                          {points.map((p, idx) => (
                            <circle key={idx} cx={p.x} cy={p.y} r="3" fill="#fbbf24" className="shadow" />
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>
            )}

            {/* Catalog Exploration Spread (Projects Listened) */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold">
                  Discography Spread & Projects Ventured Into
                </h4>
              </div>

              <div className="space-y-2">
                {selectedArtistDossier.discographySpread.map((item, idx) => (
                  <div
                    key={item.albumName}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs text-zinc-500">#{idx + 1}</span>
                      <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-zinc-900 border border-white/5">
                        {item.coverUrl ? (
                          <img src={item.coverUrl} alt={item.albumName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600">
                            <Disc className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold text-white truncate font-heading">
                        {item.albumName}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                      <span className="text-zinc-400">{item.plays} plays</span>
                      <span className="text-purple-300 font-semibold">{item.minutes} mins</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Memory Note */}
            {selectedArtistDossier.notes && (
              <div className="mt-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200/90 italic">
                "{selectedArtistDossier.notes}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
