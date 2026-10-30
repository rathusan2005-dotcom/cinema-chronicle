import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { fetchAudioPreview } from '../lib/audioPreview';
import { Play, Pause, Loader2, Volume2, X } from 'lucide-react';

interface ActiveTrackInfo {
  id: string;
  artist: string;
  track: string;
  previewUrl: string;
  artworkUrl?: string;
}

interface AudioContextType {
  activeTrack: ActiveTrackInfo | null;
  isPlaying: boolean;
  isLoading: boolean;
  playPreview: (artist: string, track: string, customId?: string) => Promise<void>;
  stopPreview: () => void;
  togglePreview: (artist: string, track: string, customId?: string) => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTrack, setActiveTrack] = useState<ActiveTrackInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleEnded = () => {
      setIsPlaying(false);
      setActiveTrack(null);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      setActiveTrack(null);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('error', handleError);
      audioRef.current = null;
    };
  }, []);

  const stopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setActiveTrack(null);
  };

  const playPreview = async (artist: string, track: string, customId?: string) => {
    const trackId = customId || `${artist}:::${track}`;

    // If currently playing this exact track, do nothing or let toggle handle it
    if (activeTrack?.id === trackId && isPlaying) {
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    setIsLoading(true);
    setActiveTrack({
      id: trackId,
      artist,
      track,
      previewUrl: ''
    });

    const result = await fetchAudioPreview(artist, track);
    if (!result || !result.previewUrl) {
      setIsLoading(false);
      setActiveTrack(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.src = result.previewUrl;
      try {
        await audioRef.current.play();
        setActiveTrack({
          id: trackId,
          artist: result.artistName,
          track: result.trackName,
          previewUrl: result.previewUrl,
          artworkUrl: result.artworkUrl
        });
        setIsPlaying(true);
      } catch (err) {
        console.warn('Audio playback was prevented by browser policy:', err);
        setActiveTrack(null);
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePreview = async (artist: string, track: string, customId?: string) => {
    const trackId = customId || `${artist}:::${track}`;
    if (activeTrack?.id === trackId) {
      if (isPlaying) {
        audioRef.current?.pause();
      } else if (audioRef.current?.src) {
        audioRef.current.play();
      } else {
        await playPreview(artist, track, customId);
      }
    } else {
      await playPreview(artist, track, customId);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        activeTrack,
        isPlaying,
        isLoading,
        playPreview,
        stopPreview,
        togglePreview
      }}
    >
      {children}

      {/* Floating Velvet Audio Preview Island (Fixed above the bottom pill dock) */}
      {activeTrack && (
        <div
          role="region"
          aria-label="30-second audio preview player"
          className="fixed bottom-20 sm:bottom-22 left-1/2 -translate-x-1/2 z-40 max-w-[92vw] sm:max-w-md w-full px-3.5 py-2 rounded-2xl bg-[#14120f]/90 border border-[#d4a359]/35 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {activeTrack.artworkUrl ? (
              <img
                src={activeTrack.artworkUrl}
                alt=""
                className="w-9 h-9 rounded-lg object-cover border border-white/10 shrink-0 shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-[#d4a359]/20 border border-[#d4a359]/30 flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4 text-[#d4a359]" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-editorial text-[13px] font-medium text-[var(--text-primary)] truncate">
                  {activeTrack.track}
                </span>
                <span className="font-tabular text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#d4a359]/15 text-[#d4a359] border border-[#d4a359]/25 shrink-0">
                  Preview
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] truncate">
                {activeTrack.artist}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Play/Pause Button */}
            <button
              onClick={() => togglePreview(activeTrack.artist, activeTrack.track, activeTrack.id)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/15 text-[#f4f0ea] transition flex items-center justify-center"
              aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d4a359]" />
              ) : isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current text-[#d4a359]" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current text-[#d4a359]" />
              )}
            </button>

            {/* Dismiss Button */}
            <button
              onClick={stopPreview}
              className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition"
              aria-label="Close audio preview"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </AudioContext.Provider>
  );
};

export function useAudioPlayer() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioProvider');
  }
  return context;
}
