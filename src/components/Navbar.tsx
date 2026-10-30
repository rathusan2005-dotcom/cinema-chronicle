import React from 'react';
import { APP_VERSION } from '../version';
import {
  Waves,
  Moon,
  Sun,
  Upload,
  SlidersHorizontal,
  Compass,
  Clock,
  BarChart3,
  Repeat,
  Disc3
} from 'lucide-react';
import { CleanserStats } from '../lib/cleanser';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeOnly: boolean;
  setActiveOnly: (val: boolean) => void;
  theme: 'oled' | 'vinyl';
  setTheme: (theme: 'oled' | 'vinyl') => void;
  stats: CleanserStats;
  isCustomData: boolean;
  onOpenUpload: () => void;
  onResetData: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeOnly,
  setActiveOnly,
  theme,
  setTheme,
  stats,
  isCustomData,
  onOpenUpload,
  onResetData,
  onOpenSettings
}) => {
  const tabs = [
    { id: 'river', label: 'River', fullLabel: 'River of Sound', icon: Waves },
    { id: 'discovery', label: 'First Contact', fullLabel: 'First Contact', icon: Compass },
    { id: 'onrepeat', label: 'On Repeat', fullLabel: 'On Repeat', icon: Repeat },
    { id: 'lens', label: 'Timeline', fullLabel: 'Timeline Lens', icon: BarChart3 },
    { id: 'circadian', label: 'Circadian', fullLabel: 'Circadian Matrix', icon: Clock }
  ];

  return (
    <>
      {/* Top Archival Masthead */}
      <header className="sticky top-0 z-30 w-full border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)]/85 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left: Editorial Masthead + Inline Telemetry Ledger */}
          <div className="flex flex-wrap items-baseline justify-between lg:justify-start gap-x-6 gap-y-2">
            <div className="flex items-baseline gap-2.5">
              <h1 className="font-editorial text-xl sm:text-2xl font-medium tracking-tight text-[var(--text-primary)]">
                Sonic Chronicle
              </h1>
              <span className="font-tabular text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
                2020–2026
              </span>
              <span
                id="header-beta-badge"
                className="font-tabular text-[10px] uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300/90 border border-amber-500/25 tracking-wider"
              >
                {APP_VERSION}
              </span>
            </div>

            {/* Inline Archival Telemetry (Replaces Top SaaS Stat Cards) */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs border-l border-[var(--border-hairline)] pl-3 sm:pl-5">
              <div>
                <span className="text-[var(--text-muted)] mr-1.5">Active:</span>
                <span className="font-tabular font-semibold text-[var(--text-primary)]">
                  {stats.totalCleanPlays.toLocaleString()}
                </span>
                <span className="text-[var(--text-muted)] ml-1 hidden sm:inline">streams</span>
              </div>
              <span className="text-[var(--text-muted)]">·</span>
              <div>
                <span className="font-tabular font-semibold text-[#d4a359]">
                  {Math.round(stats.totalCleanMinutes / 60).toLocaleString()}
                </span>
                <span className="text-[var(--text-muted)] ml-1">hrs</span>
              </div>
              <span className="text-[var(--text-muted)] hidden md:inline">·</span>
              <button
                onClick={onOpenSettings}
                className="hidden md:flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition group"
                title="Configure Smart Sleep Cleanser"
              >
                <span className="font-tabular text-[#c85a32] font-medium">
                  −{stats.sleepPlaylistPurged.toLocaleString()}
                </span>
                <span className="text-[var(--text-muted)] group-hover:underline">sleep loops purged</span>
                <SlidersHorizontal className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[#d4a359] transition" />
              </button>
            </div>
          </div>

          {/* Right: Surface Theme Toggle, Active Filter Switch & CSV Ingest */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-2.5 flex-wrap">
            {/* Dual Surface Mode Switcher: OLED Midnight vs Vinyl Archive */}
            <div
              className="flex items-center p-0.5 rounded-full bg-white/[0.03] border border-[var(--border-hairline)]"
              role="group"
              aria-label="Surface aesthetic mode"
            >
              <button
                onClick={() => setTheme('oled')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  theme === 'oled'
                    ? 'bg-white/12 text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
                title="True Pitch-Black #000000 for late-night iPhone inspection"
              >
                <Moon className="w-3 h-3 text-sky-300" />
                <span>OLED</span>
              </button>
              <button
                onClick={() => setTheme('vinyl')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  theme === 'vinyl'
                    ? 'bg-[#d4a359]/20 text-[#f4f0ea] border border-[#d4a359]/30 shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
                title="Warm Espresso & Parchment gatefold sleeve mode"
              >
                <Disc3 className="w-3 h-3 text-[#d4a359]" />
                <span>Vinyl</span>
              </button>
            </div>

            {/* Active Listening Master Switch */}
            <div className="flex items-center p-0.5 rounded-full bg-white/[0.03] border border-[var(--border-hairline)]">
              <button
                onClick={() => setActiveOnly(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  activeOnly
                    ? 'bg-[#c85a32]/20 text-[#f4f0ea] border border-[#c85a32]/40'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <Sun className="w-3 h-3 text-[#d4a359]" />
                <span>Pure Active</span>
              </button>
              <button
                onClick={() => setActiveOnly(false)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  !activeOnly
                    ? 'bg-white/10 text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <span>Raw Log</span>
              </button>
            </div>

            {/* Mobile Cleanser Settings Button */}
            <button
              onClick={onOpenSettings}
              className="md:hidden p-1.5 rounded-full bg-white/[0.03] border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-white"
              title="Configure Sleep Cleanser"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Upload CSV Button */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-[var(--border-specular)] text-[11px] font-medium text-[var(--text-primary)] transition-all"
            >
              <Upload className="w-3 h-3 text-[#d4a359]" />
              <span>{isCustomData ? 'Update CSV' : 'Import CSV'}</span>
            </button>

            {isCustomData && (
              <button
                onClick={onResetData}
                className="text-[11px] text-[#c85a32] hover:underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Style C Floating Liquid-Glass Bottom Pill Dock */}
      <nav
        aria-label="Primary Chronicle Navigation"
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 px-2 py-1.5 rounded-full liquid-dock flex items-center gap-1 sm:gap-1.5 max-w-[95vw] overflow-x-auto scrollbar-none"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center justify-center gap-2 px-3.5 sm:px-4 min-h-[42px] sm:min-h-[44px] rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-white/[0.13] text-[var(--text-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] border border-white/15'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.05]'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 transition-colors ${
                  isActive ? 'text-[#d4a359]' : 'text-[var(--text-muted)]'
                }`}
              />
              <span className="hidden sm:inline">{tab.fullLabel}</span>
              <span className="sm:hidden">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4a359] shadow-[0_0_8px_#d4a359]" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
