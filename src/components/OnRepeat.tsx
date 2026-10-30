import React, { useState, useMemo, useEffect } from 'react';
import { PlayRecord, LoopObsession, UserPersonalNote, DormantBanger } from '../types';
import { MOCK_LOOP_OBSESSIONS, MOCK_DORMANT_BANGERS } from '../lib/mockData';
import { computeLoopObsessions, computeRepeatLeaderboard, computeDormantBangers } from '../lib/analytics';
import { useAudioPlayer } from '../context/AudioContext';
import { 
  Repeat, 
  Flame, 
  Calendar, 
  Disc, 
  Clock, 
  Heart, 
  MessageSquarePlus, 
  Sparkles, 
  X, 
  Save, 
  BookHeart,
  TrendingUp,
  Layers,
  Play,
  Pause,
  Loader2,
  History,
  Hourglass
} from 'lucide-react';

interface OnRepeatProps {
  records: PlayRecord[];
  isCustomData: boolean;
}

const STORAGE_NOTES_KEY = 'sonic_chronicle_user_notes';

export const OnRepeat: React.FC<OnRepeatProps> = ({ records, isCustomData }) => {
  const { activeTrack, isPlaying, isLoading, togglePreview } = useAudioPlayer();
  const [dimension, setDimension] = useState<'tracks' | 'albums' | 'artists'>('tracks');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [dormantSortBy, setDormantSortBy] = useState<'hibernation' | 'peak'>('hibernation');
  const [userNotes, setUserNotes] = useState<{ [key: string]: UserPersonalNote }>({});
  const [editingItem, setEditingItem] = useState<{ title: string; artist: string; type: 'track' | 'album' } | null>(null);
  const [noteText, setNoteText] = useState('');
  const [emotionTag, setEmotionTag] = useState('');

  // Load user personal notes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTES_KEY);
      if (saved) {
        setUserNotes(JSON.parse(saved));
      } else {
        // Preload authentic seed notes for Rath's anchors
        const seedNotes: { [key: string]: UserPersonalNote } = {
          'JanZee Official:::Bad Love': {
            id: 'n-1',
            itemType: 'track',
            title: 'Bad Love',
            artist: 'JanZee Official',
            meaningNote: 'Discovered during late summer 2024 gym and evening walks; the 808 cadence and street lyricism was an instant adrenaline reset.',
            evokedEmotion: 'Electric Focus & Adrenaline',
            updatedAt: '2024-09-15'
          },
          'SiR:::Chasing Summer': {
            id: 'n-2',
            itemType: 'album',
            title: 'Chasing Summer',
            artist: 'SiR',
            meaningNote: 'The ultimate quarantine & midnight coding companion. Hair Down and John Redcorn provide instant grounding whenever overstimulated.',
            evokedEmotion: 'Midnight Sanctuary & Grounding',
            updatedAt: '2021-02-18'
          },
          'Govind Vasantha:::96 (Original Motion Picture Soundtrack)': {
            id: 'n-3',
            itemType: 'album',
            title: '96 (Original Motion Picture Soundtrack)',
            artist: 'Govind Vasantha',
            meaningNote: 'The acoustic violin swells in The Life of Ram and Kaathalae Kaathalae are pure emotional medicine for quiet introspective train rides.',
            evokedEmotion: 'Melancholic Healing',
            updatedAt: '2022-03-24'
          },
          'Laufey:::Bewitched (Goddess Edition)': {
            id: 'n-4',
            itemType: 'album',
            title: 'Bewitched (Goddess Edition)',
            artist: 'Laufey',
            meaningNote: 'The signature soundtrack of rainy autumn and cold winter mornings. Soft cello chords and intimate velvet vocals like warm tea.',
            evokedEmotion: 'Autumn Nostalgia & Velvet Comfort',
            updatedAt: '2023-11-12'
          }
        };
        setUserNotes(seedNotes);
        localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(seedNotes));
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleSaveNote = () => {
    if (!editingItem) return;
    const key = `${editingItem.artist}:::${editingItem.title}`;
    const newNote: UserPersonalNote = {
      id: `note-${Date.now()}`,
      itemType: editingItem.type,
      title: editingItem.title,
      artist: editingItem.artist,
      meaningNote: noteText.trim(),
      evokedEmotion: emotionTag.trim() || 'Personal Resonance',
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updated = { ...userNotes, [key]: newNote };
    setUserNotes(updated);
    try {
      localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(updated));
    } catch {}

    setEditingItem(null);
    setNoteText('');
    setEmotionTag('');
  };

  // Compute 24-hour single-track loop spikes
  const obsessions = useMemo(() => {
    if (isCustomData) {
      const computed = computeLoopObsessions(records);
      return computed.length > 0 ? computed : MOCK_LOOP_OBSESSIONS;
    }
    return MOCK_LOOP_OBSESSIONS;
  }, [records, isCustomData]);

  // Compute Dormant Bangers (The Relic Vault)
  const dormantBangers = useMemo(() => {
    let list: DormantBanger[] = [];
    if (isCustomData) {
      list = computeDormantBangers(records);
      if (list.length === 0) list = MOCK_DORMANT_BANGERS;
    } else {
      list = MOCK_DORMANT_BANGERS;
    }

    return [...list].sort((a, b) => {
      if (dormantSortBy === 'hibernation') {
        return b.daysInHibernation - a.daysInHibernation;
      }
      return b.peakPlaysInMonth - a.peakPlaysInMonth;
    });
  }, [records, isCustomData, dormantSortBy]);

  // Compute leaderboard
  const leaderboard = useMemo(() => {
    return computeRepeatLeaderboard(records, dimension, selectedYear);
  }, [records, dimension, selectedYear]);

  const years: (number | 'all')[] = ['all', 2026, 2025, 2024, 2023, 2022, 2021, 2020];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-hairline)] pb-5">
        <div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-normal tracking-tight text-[var(--text-primary)]">
            On Repeat & Personal Liner Notes
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
            Empirically tracked repeat habits across multiple time scales. Explore the 24-hour hyperfixations where you couldn't stop hitting replay, and attach your own real memories to the songs and albums that anchored your life.
          </p>
        </div>
      </div>

      {/* 24-Hour Single-Day Hyperfixation Wall */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 font-mono">
              The 24-Hour Hyperfixation Wall (&gt;20x Loops in 1 Day)
            </h3>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            Pure single-day loop spikes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {obsessions.slice(0, 5).map((obs, idx) => {
            const noteKey = `${obs.artistName}:::${obs.trackName}`;
            const personal = userNotes[noteKey];
            const isThisPlaying = activeTrack?.id === noteKey && isPlaying;
            const isThisLoading = activeTrack?.id === noteKey && isLoading;

            return (
              <div
                key={`${obs.trackName}-${obs.date}-${idx}`}
                className="rounded-2xl archive-plate p-4 border border-[var(--border-hairline)] hover:border-[#d4a359]/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-white/10 mb-3 shadow-md group-hover:scale-[1.02] transition-transform">
                    {obs.coverUrl ? (
                      <img
                        src={obs.coverUrl}
                        alt={obs.trackName}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as any).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <Disc className="w-8 h-8" />
                      </div>
                    )}

                    {/* Audio Preview Overlay Button */}
                    <button
                      onClick={() => togglePreview(obs.artistName, obs.trackName, noteKey)}
                      aria-label={`${isThisPlaying ? 'Pause' : 'Play'} preview of ${obs.trackName}`}
                      className={`absolute bottom-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-lg flex items-center justify-center ${
                        isThisPlaying
                          ? 'bg-[#d4a359] text-black scale-105'
                          : 'bg-black/60 text-[#f4f0ea] hover:bg-[#d4a359] hover:text-black hover:scale-105'
                      }`}
                    >
                      {isThisLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isThisPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[var(--text-muted)] font-tabular flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[var(--text-muted)]" />
                      {obs.date}
                    </span>
                    <span className="font-tabular font-bold text-[#c85a32] text-xs">
                      {obs.loopCount24h} loops
                    </span>
                  </div>

                  <h4 className="font-editorial text-base text-[var(--text-primary)] truncate">
                    {obs.trackName}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] truncate">
                    {obs.artistName}
                  </p>

                  <div className="mt-2 text-[10px] text-[var(--text-muted)] font-tabular flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#d4a359]" />
                    <span>{obs.totalMinutes24h} mins spent in 24 hours</span>
                  </div>
                </div>

                {/* Personal Note or Add Note Button */}
                <div className="mt-3 pt-2.5 border-t border-[var(--border-hairline)]">
                  {personal ? (
                    <div className="space-y-1">
                      <span className="inline-block px-1.5 py-0.5 rounded bg-[#d4a359]/15 text-[#d4a359] border border-[#d4a359]/25 text-[9px] font-semibold">
                        {personal.evokedEmotion}
                      </span>
                      <p className="text-[11px] text-[var(--text-secondary)] italic line-clamp-2">
                        "{personal.meaningNote}"
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingItem({ title: obs.trackName, artist: obs.artistName, type: 'track' });
                        setNoteText('');
                        setEmotionTag('');
                      }}
                      className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 transition"
                    >
                      <MessageSquarePlus className="w-3 h-3 text-[#d4a359]" />
                      <span>Attach memory / note</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The Relic Vault: Dormant Bangers */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[var(--border-hairline)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#d4a359]" />
              <h3 className="font-editorial text-2xl text-[var(--text-primary)]">
                The Relic Vault (Dormant Bangers)
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl leading-relaxed">
              Songs you once binge-looped obsessively in past chapters that have since slipped into prolonged hibernation. Tap play to revive the memory.
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-[var(--border-hairline)] text-xs shrink-0">
            <button
              onClick={() => setDormantSortBy('hibernation')}
              className={`px-3 py-1.5 rounded-full transition font-medium flex items-center gap-1.5 ${
                dormantSortBy === 'hibernation'
                  ? 'bg-[#d4a359]/25 text-[#f4f0ea] border border-[#d4a359]/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Hourglass className="w-3 h-3 text-[#d4a359]" />
              <span>Deepest Hibernation</span>
            </button>
            <button
              onClick={() => setDormantSortBy('peak')}
              className={`px-3 py-1.5 rounded-full transition font-medium flex items-center gap-1.5 ${
                dormantSortBy === 'peak'
                  ? 'bg-white/12 text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Flame className="w-3 h-3 text-[#c85a32]" />
              <span>Peak Loop Intensity</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dormantBangers.map((banger) => {
            const noteKey = `${banger.artistName}:::${banger.trackName}`;
            const personal = userNotes[noteKey];
            const isThisPlaying = activeTrack?.id === noteKey && isPlaying;
            const isThisLoading = activeTrack?.id === noteKey && isLoading;

            return (
              <div
                key={banger.id}
                className="rounded-xl archive-plate p-4 flex gap-4 items-center justify-between hover:border-[var(--border-specular)] transition group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Artwork + Play Button */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shrink-0 shadow-md">
                    {banger.coverUrl ? (
                      <img
                        src={banger.coverUrl}
                        alt={banger.trackName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => { (e.target as any).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <Disc className="w-7 h-7" />
                      </div>
                    )}

                    <button
                      onClick={() => togglePreview(banger.artistName, banger.trackName, noteKey)}
                      aria-label={`${isThisPlaying ? 'Pause' : 'Play'} preview of ${banger.trackName}`}
                      className={`absolute inset-0 flex items-center justify-center transition-all ${
                        isThisPlaying
                          ? 'bg-black/55 text-[#d4a359]'
                          : 'bg-black/40 text-white opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {isThisLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-[#d4a359]" />
                      ) : isThisPlaying ? (
                        <Pause className="w-5 h-5 fill-current text-[#d4a359]" />
                      ) : (
                        <Play className="w-5 h-5 fill-current" />
                      )}
                    </button>
                  </div>

                  {/* Track Details */}
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-editorial text-base text-[var(--text-primary)] truncate">
                        {banger.trackName}
                      </h4>
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: banger.eraColor }}
                        title={banger.eraName}
                      />
                    </div>
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      {banger.artistName}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] font-tabular text-[var(--text-muted)] pt-0.5">
                      <span className="text-[#c85a32] font-semibold">
                        {banger.daysInHibernation} days silent
                      </span>
                      <span>·</span>
                      <span>Peak: {banger.peakPlaysInMonth} plays ({banger.peakPeriodLabel})</span>
                    </div>

                    {personal && (
                      <p className="text-[10px] text-[var(--text-secondary)] italic truncate max-w-[200px]">
                        "{personal.meaningNote}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Attach note trigger */}
                <button
                  onClick={() => {
                    setEditingItem({ title: banger.trackName, artist: banger.artistName, type: 'track' });
                    setNoteText(personal?.meaningNote || '');
                    setEmotionTag(personal?.evokedEmotion || '');
                  }}
                  className="p-2 rounded-full hover:bg-white/[0.06] text-[var(--text-muted)] hover:text-[#d4a359] transition shrink-0"
                  title="Attach personal memory"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Heavy Rotation Leaderboard Across Timeframes */}
      <div className="rounded-2xl glass-card p-6 border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              Heavy Rotation Leaderboard
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Ranked by total plays, immersion hours, and daily replay density
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Dimension: Tracks, Albums, Artists */}
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
              {(['tracks', 'albums', 'artists'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDimension(d)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition font-medium ${
                    dimension === d ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Year Selector */}
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs overflow-x-auto">
              {years.map(y => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`px-2.5 py-1 rounded-lg transition font-medium capitalize ${
                    selectedYear === y ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard Table / Cards */}
        <div className="space-y-3">
          {leaderboard.slice(0, 10).map((item, idx) => {
            const noteKey = `${item.artist}:::${item.name}`;
            const personal = userNotes[noteKey];

            return (
              <div
                key={`${item.name}-${idx}`}
                className="p-3.5 rounded-xl archive-plate border border-[var(--border-hairline)] hover:border-[var(--border-specular)] transition flex flex-col md:flex-row md:items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="font-tabular text-sm font-bold text-[var(--text-muted)] w-6 text-center">
                    #{idx + 1}
                  </span>

                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-zinc-900 border border-white/10 shadow">
                    {item.coverUrl ? (
                      <img src={item.coverUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <Disc className="w-6 h-6" />
                      </div>
                    )}

                    {dimension === 'tracks' && (
                      <button
                        onClick={() => togglePreview(item.artist, item.name, noteKey)}
                        aria-label={`Preview ${item.name}`}
                        className={`absolute inset-0 flex items-center justify-center transition-all ${
                          activeTrack?.id === noteKey && isPlaying
                            ? 'bg-black/60 text-[#d4a359]'
                            : 'bg-black/40 text-white opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        {activeTrack?.id === noteKey && isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-[#d4a359]" />
                        ) : activeTrack?.id === noteKey && isPlaying ? (
                          <Pause className="w-4 h-4 fill-current text-[#d4a359]" />
                        ) : (
                          <Play className="w-4 h-4 fill-current" />
                        )}
                      </button>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-bold text-white truncate font-heading">
                        {item.name}
                      </h5>
                      {personal && (
                        <span className="px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-mono">
                          {personal.evokedEmotion}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 truncate">
                      {item.artist}
                    </p>
                    {personal && (
                      <p className="text-[11px] text-zinc-300 italic mt-0.5 line-clamp-1">
                        "{personal.meaningNote}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-5 text-xs font-mono shrink-0 pl-10 md:pl-0">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Total Plays</span>
                    <span className="font-bold text-white">{item.plays}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 block">Immersion</span>
                    <span className="font-bold text-purple-300">{Math.round(item.minutes / 60)} hrs</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 block">Repeat Density</span>
                    <span className="font-bold text-amber-300">{item.repeatRatio}x / day</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 block">Peak 24h</span>
                    <span className="font-bold text-rose-400">{item.peakDayLoops} loops</span>
                  </div>

                  <button
                    onClick={() => {
                      setEditingItem({
                        title: item.name,
                        artist: item.artist,
                        type: dimension === 'tracks' ? 'track' : 'album'
                      });
                      setNoteText(personal?.meaningNote || '');
                      setEmotionTag(personal?.evokedEmotion || '');
                    }}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition"
                    title="Edit personal memory note"
                  >
                    <MessageSquarePlus className="w-4 h-4 text-purple-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Note Annotation Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg p-6 rounded-2xl glass-card border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  <BookHeart className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Attach Personal Meaning & Emotion
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {editingItem.title} • {editingItem.artist}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">
                  Evoked Emotion / Mood Tag (e.g. "Adrenaline Sprints", "Midnight Reflection")
                </label>
                <input
                  type="text"
                  placeholder="e.g. Midnight Sanctuary, Exam Sprint, Rainy Nostalgia..."
                  value={emotionTag}
                  onChange={(e) => setEmotionTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">
                  What does this music mean to you? (Personal Memory / Context)
                </label>
                <textarea
                  rows={4}
                  placeholder="Why do you loop this? What life chapter, mindset, or memory is tied to this track?..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white transition flex items-center gap-1.5 shadow"
              >
                <Save className="w-3.5 h-3.5" />
                Save Memory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
