import React from 'react';
import { CROSS_GENRE_RECOMMENDATIONS } from '../lib/analytics';
import { Compass, Sparkles, ExternalLink, Music, Layers } from 'lucide-react';

export const CrossGenreRecommender: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-2">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          Module F: Niche Cross-Genre Recommendation Engine
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
          Taste Crossings & Triangulations
        </h2>
        <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
          Algorithmic recommendation engines group you by generic pop genres. This model finds deep catalog gems specifically sitting at the tri-point of:
        </p>

        {/* Intersection formula visual */}
        <div className="mt-4 p-4 rounded-xl glass-card border border-cyan-500/20 max-w-2xl flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-pink-500/20 border border-pink-500/30 text-pink-300">
            Laufey Vocal Jazz
          </span>
          <span className="text-zinc-500 font-bold">∩</span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300">
            Santhosh Narayanan / Tamil Scores
          </span>
          <span className="text-zinc-500 font-bold">∩</span>
          <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300">
            SiR & Brent Faiyaz Atmospheric R&B
          </span>
        </div>
      </div>

      {/* Recommended Tracks List */}
      <div className="space-y-4">
        {CROSS_GENRE_RECOMMENDATIONS.map((rec) => {
          const appleMusicUrl = `https://music.apple.com/us/search?term=${encodeURIComponent(rec.spotifyOrAppleQuery)}`;

          return (
            <div
              key={rec.id}
              className="rounded-2xl glass-card p-5 border border-white/10 hover:border-cyan-400/40 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-zinc-900 border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  {rec.coverUrl ? (
                    <img
                      src={rec.coverUrl}
                      alt={rec.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Music className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-white font-heading">
                      {rec.title}
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                      {rec.vibeScore}% Match
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 font-medium">
                    {rec.artist} • <span className="text-zinc-500">{rec.album}</span>
                  </p>

                  <p className="text-xs text-zinc-300 mt-2 max-w-xl leading-relaxed">
                    {rec.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {rec.genreIntersection.map((g) => (
                      <span
                        key={g}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-300 border border-white/5"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="shrink-0 self-end md:self-center">
                <a
                  href={appleMusicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 text-xs font-semibold text-white transition-all shadow-sm"
                >
                  <span>Listen on Apple Music</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
