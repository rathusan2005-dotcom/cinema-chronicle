import React, { useMemo } from 'react';
import { PlayRecord, ComfortAlbum, LoopObsession } from '../types';
import { MOCK_COMFORT_ALBUMS, MOCK_LOOP_OBSESSIONS } from '../lib/mockData';
import { computeLoopObsessions } from '../lib/analytics';
import { HeartHandshake, Repeat, ShieldAlert, Sparkles, Disc, Flame } from 'lucide-react';

interface ComfortBlanketProps {
  records: PlayRecord[];
  isCustomData: boolean;
}

export const ComfortBlanket: React.FC<ComfortBlanketProps> = ({ records, isCustomData }) => {
  const dynamicObsessions = useMemo(() => {
    if (isCustomData) {
      const computed = computeLoopObsessions(records);
      return computed.length > 0 ? computed : MOCK_LOOP_OBSESSIONS;
    }
    return MOCK_LOOP_OBSESSIONS;
  }, [records, isCustomData]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono mb-2">
          <HeartHandshake className="w-3.5 h-3.5 text-indigo-400" />
          Module E: Mental Health & Emotional Resonance
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
          Comfort Blankets & Headspace Correlation
        </h2>
        <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
          Tracking the reliable anchor records you retreat to during intense deadlines, exam seasons, and emotional reset phases. Music is not just background audio—it is your emotional stabilizer.
        </p>
      </div>

      {/* Comfort Blanket Records Showcase */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 font-mono">
            Anchor Albums (High-Stress & Sanctuary Loops)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MOCK_COMFORT_ALBUMS.map((album) => (
            <div
              key={album.albumName}
              className="rounded-2xl glass-card p-5 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-zinc-900 border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={album.coverUrl}
                      alt={album.albumName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-[10px] font-semibold mb-1">
                      {album.emotionalTag}
                    </span>
                    <h4 className="text-base font-bold text-white truncate font-heading">
                      {album.albumName}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate font-medium">
                      {album.artistName}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate mt-1">
                      Top Track: <span className="text-zinc-300 font-medium">{album.topTrack}</span>
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Total Lifetime Listens</span>
                    <span className="font-bold text-white">{album.totalPlays} plays</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Immersion Time</span>
                    <span className="font-bold text-indigo-300">{Math.round(album.totalMinutes / 60)} hours</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Repeat Density</span>
                    <span className="font-bold text-amber-300">{album.repeatRatio}x per session</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-zinc-400 italic">
                Triggered during: <span className="text-zinc-300 not-italic font-medium">{album.highStressSpikePeriod}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 24-Hour Single-Track Repeat Obsessions */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Repeat className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 font-mono">
              24-Hour Single-Track Loop Obsessions (&gt;10x in a day)
            </h3>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            Pure hyperfixation moments
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {dynamicObsessions.slice(0, 5).map((obs, idx) => (
            <div
              key={`${obs.trackName}-${obs.date}-${idx}`}
              className="p-4 rounded-xl glass-card border border-white/10 hover:border-rose-500/30 transition flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-zinc-900 border border-white/10">
                  {obs.coverUrl ? (
                    <img
                      src={obs.coverUrl}
                      alt={obs.trackName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Disc className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-white truncate font-heading">
                    {obs.trackName}
                  </h5>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {obs.artistName}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-zinc-500">{obs.date}</span>
                <span className="font-bold text-rose-400 font-mono">
                  {obs.loopCount24h} loops
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
