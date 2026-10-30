import React, { useState, useMemo } from 'react';
import { PlayRecord, TimeResolution } from '../types';
import { 
  Calendar, 
  Disc, 
  Clock, 
  Users, 
  Flame, 
  BarChart3, 
  Music, 
  Radio, 
  Search, 
  ListMusic, 
  Layers, 
  TrendingUp,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

interface GranularTimelineProps {
  records: PlayRecord[];
  activeOnly: boolean;
}

export const GranularTimeline: React.FC<GranularTimelineProps> = ({ records, activeOnly }) => {
  const [resolution, setResolution] = useState<TimeResolution>('year');
  const [metric, setMetric] = useState<'minutes' | 'plays' | 'artists' | 'tracks'>('minutes');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [activeBucketKey, setActiveBucketKey] = useState<string | null>(null);

  // Filter records by selected year if not 'all'
  const filteredRecords = useMemo(() => {
    if (selectedYear === 'all') return records;
    return records.filter(r => r.timestamp.getFullYear() === selectedYear);
  }, [records, selectedYear]);

  // Aggregate by time buckets
  const bucketData = useMemo(() => {
    const buckets: { 
      [key: string]: { 
        key: string;
        label: string; 
        date: Date; 
        minutes: number; 
        plays: number; 
        artists: Set<string>; 
        tracks: Set<string>;
        sources: { album: number; playlist: number; search: number; radio: number };
      } 
    } = {};

    filteredRecords.forEach(r => {
      const d = r.timestamp;
      let key = '';
      let label = '';

      if (resolution === 'year' || selectedYear === 'all') {
        const y = d.getFullYear();
        key = `${y}`;
        label = `${y}`;
      } else if (resolution === 'month') {
        const y = d.getFullYear();
        const m = d.toLocaleString('en-US', { month: 'short' });
        key = `${y}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        label = `${m} ${y}`;
      } else if (resolution === 'week') {
        const weekNum = Math.ceil(d.getDate() / 7);
        const m = d.toLocaleString('en-US', { month: 'short' });
        key = `${d.getFullYear()}-${d.getMonth()}-W${weekNum}`;
        label = `${m} W${weekNum}`;
      } else {
        // Day
        const m = d.toLocaleString('en-US', { month: 'short' });
        key = d.toISOString().split('T')[0];
        label = `${m} ${d.getDate()}`;
      }

      if (!buckets[key]) {
        buckets[key] = { 
          key,
          label, 
          date: d, 
          minutes: 0, 
          plays: 0, 
          artists: new Set(), 
          tracks: new Set(),
          sources: { album: 0, playlist: 0, search: 0, radio: 0 }
        };
      }

      const mins = r.playDurationMs / (1000 * 60);
      buckets[key].minutes += mins;
      buckets[key].plays += 1;
      buckets[key].artists.add(r.artistName);
      buckets[key].tracks.add(`${r.artistName}:::${r.trackName}`);

      const sMode = r.sourceMode || 'album';
      buckets[key].sources[sMode] = (buckets[key].sources[sMode] || 0) + mins;
    });

    const list = Object.values(buckets).sort((a, b) => a.date.getTime() - b.date.getTime());
    return list.slice(-18); // Show up to 18 buckets cleanly
  }, [filteredRecords, resolution, selectedYear]);

  // Overall Source Attribution in this window
  const sourceAttribution = useMemo(() => {
    let albumMins = 0;
    let playlistMins = 0;
    let searchMins = 0;
    let radioMins = 0;

    filteredRecords.forEach(r => {
      const mins = r.playDurationMs / (1000 * 60);
      const s = r.sourceMode || 'album';
      if (s === 'album') albumMins += mins;
      else if (s === 'playlist') playlistMins += mins;
      else if (s === 'search') searchMins += mins;
      else radioMins += mins;
    });

    const total = (albumMins + playlistMins + searchMins + radioMins) || 1;
    return {
      album: { minutes: Math.round(albumMins), percent: Math.round((albumMins / total) * 100) },
      playlist: { minutes: Math.round(playlistMins), percent: Math.round((playlistMins / total) * 100) },
      search: { minutes: Math.round(searchMins), percent: Math.round((searchMins / total) * 100) },
      radio: { minutes: Math.round(radioMins), percent: Math.round((radioMins / total) * 100) }
    };
  }, [filteredRecords]);

  // Top artists in this window
  const topArtists = useMemo(() => {
    const counts: { [artist: string]: { plays: number; minutes: number; cover?: string } } = {};
    filteredRecords.forEach(r => {
      if (!counts[r.artistName]) {
        counts[r.artistName] = { plays: 0, minutes: 0, cover: r.coverUrl };
      }
      counts[r.artistName].plays += 1;
      counts[r.artistName].minutes += r.playDurationMs / (1000 * 60);
    });

    return Object.entries(counts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => (metric === 'minutes' ? b.minutes - a.minutes : b.plays - a.plays))
      .slice(0, 5);
  }, [filteredRecords, metric]);

  const maxVal = useMemo(() => {
    let max = 1;
    bucketData.forEach(b => {
      const val = metric === 'minutes' 
        ? b.minutes 
        : metric === 'plays' 
        ? b.plays 
        : metric === 'artists' 
        ? b.artists.size 
        : b.tracks.size;
      if (val > max) max = val;
    });
    return max;
  }, [bucketData, metric]);

  const activeBucket = bucketData.find(b => b.key === activeBucketKey) || bucketData[bucketData.length - 1];

  const years: (number | 'all')[] = ['all', 2026, 2025, 2024, 2023, 2022, 2021, 2020];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-hairline)] pb-5">
        <div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-normal tracking-tight text-[var(--text-primary)]">
            Multi-Scale Timeline Lens
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
            Zoom dynamically from 6-year macro patterns all the way down to single days. Inspect source attribution to see whether you were in <span className="text-[var(--text-primary)] font-medium">Full Album Immersion</span>, curating <span className="text-[var(--text-primary)] font-medium">Playlists</span>, or making intentional <span className="text-[var(--text-primary)] font-medium">Direct Searches</span>.
          </p>
        </div>

        {/* Year Filter Pills */}
        <div className="flex items-center bg-white/[0.03] p-1 rounded-full border border-[var(--border-hairline)] text-xs overflow-x-auto scrollbar-none">
          {years.map(y => (
            <button
              key={y}
              onClick={() => {
                setSelectedYear(y);
                if (y !== 'all' && resolution === 'year') setResolution('month');
              }}
              className={`px-3 py-1.5 rounded-full transition font-tabular font-medium capitalize whitespace-nowrap ${
                selectedYear === y
                  ? 'bg-[#d4a359]/25 text-[#f4f0ea] border border-[#d4a359]/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {y === 'all' ? 'All Years' : y}
            </button>
          ))}
        </div>
      </div>

      {/* Listening Source Attribution Cards (Albums vs Playlists vs Search vs Radio) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Full Album Plays */}
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Disc className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white">Full Albums</span>
            </div>
            <span className="text-xs font-mono font-bold text-purple-300">
              {sourceAttribution.album.percent}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden my-1">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${sourceAttribution.album.percent}%` }} />
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            {Math.round(sourceAttribution.album.minutes / 60)} hrs intentional immersion
          </span>
        </div>

        {/* Playlists */}
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white">Curated Playlists</span>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-300">
              {sourceAttribution.playlist.percent}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden my-1">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${sourceAttribution.playlist.percent}%` }} />
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            {Math.round(sourceAttribution.playlist.minutes / 60)} hrs playlist streaming
          </span>
        </div>

        {/* Direct Search */}
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">Direct Search</span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-300">
              {sourceAttribution.search.percent}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden my-1">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${sourceAttribution.search.percent}%` }} />
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            {Math.round(sourceAttribution.search.minutes / 60)} hrs targeted queries
          </span>
        </div>

        {/* Radio & Autoplay */}
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">Radio / Autoplay</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-300">
              {sourceAttribution.radio.percent}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden my-1">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${sourceAttribution.radio.percent}%` }} />
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            {Math.round(sourceAttribution.radio.minutes / 60)} hrs passive autoplay
          </span>
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div className="rounded-2xl glass-card p-6 border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              Temporal Volume Distribution
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select time resolution scale and metric lens
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Resolution scale: Years, Months, Weeks, Days */}
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
              {(['year', 'month', 'week', 'day'] as TimeResolution[]).map(r => (
                <button
                  key={r}
                  onClick={() => setResolution(r)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition font-medium ${
                    resolution === r ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {r}s
                </button>
              ))}
            </div>

            {/* Metric dimension */}
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setMetric('minutes')}
                className={`px-2.5 py-1.5 rounded-lg transition font-medium ${
                  metric === 'minutes' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Minutes
              </button>
              <button
                onClick={() => setMetric('plays')}
                className={`px-2.5 py-1.5 rounded-lg transition font-medium ${
                  metric === 'plays' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Plays
              </button>
              <button
                onClick={() => setMetric('artists')}
                className={`px-2.5 py-1.5 rounded-lg transition font-medium ${
                  metric === 'artists' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Unique Artists
              </button>
              <button
                onClick={() => setMetric('tracks')}
                className={`px-2.5 py-1.5 rounded-lg transition font-medium ${
                  metric === 'tracks' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Unique Tracks
              </button>
            </div>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="space-y-2">
          <div className="h-48 flex items-end gap-2 pt-6 pb-2">
            {bucketData.map((b) => {
              const rawVal = metric === 'minutes' 
                ? Math.round(b.minutes) 
                : metric === 'plays' 
                ? b.plays 
                : metric === 'artists' 
                ? b.artists.size 
                : b.tracks.size;
              const heightPercent = Math.max(8, (rawVal / maxVal) * 100);
              const isSelected = activeBucket?.key === b.key;

              return (
                <div
                  key={b.key}
                  onClick={() => setActiveBucketKey(b.key)}
                  onMouseEnter={() => setActiveBucketKey(b.key)}
                  className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end cursor-pointer"
                >
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap bg-zinc-900 border border-white/15 px-2.5 py-1 rounded-lg text-[11px] text-white shadow-xl">
                    {b.label}: <span className="font-bold text-purple-300">{rawVal.toLocaleString()} {metric}</span>
                  </div>

                  {/* Bar */}
                  <div
                    className={`w-full rounded-t-lg transition-all duration-200 shadow-sm ${
                      isSelected
                        ? 'bg-gradient-to-t from-purple-500 to-amber-300 shadow-lg shadow-purple-500/30'
                        : 'bg-gradient-to-t from-purple-800 to-indigo-500 group-hover:from-purple-600 group-hover:to-pink-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />

                  {/* X-axis label */}
                  <span className={`text-[10px] font-mono truncate w-full text-center ${isSelected ? 'text-white font-bold' : 'text-zinc-500'}`}>
                    {b.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Bucket Quick Stats Pill */}
        {activeBucket && (
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono text-zinc-400">Slice:</span>
              <span className="font-bold text-white text-sm">{activeBucket.label}</span>
              <span className="text-purple-300 font-mono font-bold">
                {Math.round(activeBucket.minutes).toLocaleString()} mins ({activeBucket.plays.toLocaleString()} plays)
              </span>
            </div>

            <div className="flex items-center gap-4 text-zinc-400 font-mono text-[11px]">
              <span>{activeBucket.artists.size} unique artists</span>
              <span>•</span>
              <span>{activeBucket.tracks.size} unique tracks</span>
            </div>
          </div>
        )}

        {/* Top 5 Resonance Artists in Selected Window */}
        <div className="pt-4 border-t border-white/5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-3">
            Top Resonance Artists in this Window
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {topArtists.map((artist, idx) => (
              <div
                key={artist.name}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3"
              >
                <span className="font-mono text-xs font-bold text-purple-400">#{idx + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate font-heading">{artist.name}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    {metric === 'minutes' ? `${Math.round(artist.minutes)} mins` : `${artist.plays} plays`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
