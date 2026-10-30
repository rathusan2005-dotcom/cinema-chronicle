import React, { useState } from 'react';
import { X, ShieldCheck, Moon, Clock, Sliders, Plus, Trash2 } from 'lucide-react';
import { CleanserConfig } from '../types';

interface CleanserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CleanserConfig;
  onUpdateConfig: (newConfig: CleanserConfig) => void;
}

export const CleanserSettingsModal: React.FC<CleanserSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig
}) => {
  const [localConfig, setLocalConfig] = useState<CleanserConfig>({ ...config });
  const [newKeyword, setNewKeyword] = useState('');

  if (!isOpen) return null;

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !localConfig.customSleepKeywords.includes(newKeyword.trim())) {
      setLocalConfig({
        ...localConfig,
        customSleepKeywords: [...localConfig.customSleepKeywords, newKeyword.trim()]
      });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setLocalConfig({
      ...localConfig,
      customSleepKeywords: localConfig.customSleepKeywords.filter(k => k !== kw)
    });
  };

  const handleSave = () => {
    onUpdateConfig(localConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg p-6 rounded-2xl glass-card border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Smart Data Cleanser Settings
              </h2>
              <p className="text-xs text-zinc-400">
                Purge sleep loops & isolate authentic intentional listening
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="space-y-5 my-6 max-h-[60vh] overflow-y-auto pr-1">
          {/* Toggles */}
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition">
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-white block">
                    Purge Known Sleep Playlists
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Filters out '🥱chilling and sleeping ?!?', '😴 sleeping in tamil', etc.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={localConfig.purgeSleepPlaylists}
                onChange={(e) => setLocalConfig({ ...localConfig, purgeSleepPlaylists: e.target.checked })}
                className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-white block">
                    Purge Circadian Night Hours
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Removes ambient background sessions between 11:30 PM and 7:00 AM
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={localConfig.purgeNightHours}
                onChange={(e) => setLocalConfig({ ...localConfig, purgeNightHours: e.target.checked })}
                className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
              />
            </label>
          </div>

          {/* Accidental skip duration */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-200">
                Accidental Skip Threshold (Seconds)
              </span>
              <span className="font-mono text-purple-400 font-bold">
                {localConfig.minPlaySeconds}s
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="30"
              step="1"
              value={localConfig.minPlaySeconds}
              onChange={(e) => setLocalConfig({ ...localConfig, minPlaySeconds: Number(e.target.value) })}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <p className="text-[10px] text-zinc-500">
              Plays skipped in under {localConfig.minPlaySeconds} seconds are treated as inadvertent and excluded from intentional totals.
            </p>
          </div>

          {/* Custom Sleep Keywords */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-3">
            <div className="text-xs font-semibold text-zinc-200">
              Sleep Playlist Name Filter Keywords
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add keyword (e.g. 'kan mooditu')..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={handleAddKeyword}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {localConfig.customSleepKeywords.map(kw => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/10 text-xs text-zinc-300"
                >
                  <span>{kw}</span>
                  <button
                    onClick={() => handleRemoveKeyword(kw)}
                    className="text-zinc-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white transition shadow-lg shadow-purple-600/30"
          >
            Apply Cleanse
          </button>
        </div>
      </div>
    </div>
  );
};
