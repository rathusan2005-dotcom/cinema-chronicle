import React from 'react';
import { APP_VERSION } from '../version';
import {
  Waves,
  Moon,
  Upload,
  BookOpen,
  Compass,
  BarChart3,
  Flame,
  Film,
  Heart,
  Calendar
} from 'lucide-react';
import { ArchiveStats } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  diaryOnly: boolean;
  setDiaryOnly: (val: boolean) => void;
  theme: 'oled' | 'criterion';
  setTheme: (theme: 'oled' | 'criterion') => void;
  stats: ArchiveStats;
  isCustomData: boolean;
  onOpenUpload: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  diaryOnly,
  setDiaryOnly,
  theme,
  setTheme,
  stats,
  isCustomData,
  onOpenUpload,
  onResetData
}) => {
  const tabs = [
    { id: 'river', label: 'River', fullLabel: 'River of Cinema', icon: Waves },
    { id: 'ledger', label: 'Reviews', fullLabel: 'Review Ledger', icon: BookOpen },
    { id: 'directors', label: 'Directors', fullLabel: 'The Rabbit Hole', icon: Compass },
    { id: 'sanctuary', label: 'Sanctuary', fullLabel: 'Rewatch Sanctuary', icon: Flame },
    { id: 'lens', label: 'Velocity', fullLabel: 'Velocity Lens', icon: BarChart3 }
  ];

  return (
    <>
      {/* Top Archival Masthead */}
      <header className="sticky top-0 z-30 w-full border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)]/88 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left: Editorial Masthead + Inline Celluloid Telemetry */}
          <div className="flex flex-wrap items-baseline justify-between lg:justify-start gap-x-6 gap-y-2">
            <div className="flex items-baseline gap-2.5">
              <h1 className="font-editorial text-xl sm:text-2xl font-medium tracking-tight text-[var(--text-primary)]">
                Cinema Chronicle
              </h1>
              <span className="font-tabular text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
                @rathhh · 2021–2026
              </span>
              <span
                id="header-beta-badge"
                className="font-tabular text-[10px] uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300/90 border border-amber-500/25 tracking-wider"
              >
                {APP_VERSION}
              </span>
            </div>

            {/* Inline Archival Telemetry */}
            <div className="flex items-center flex-wrap gap-3 sm:gap-4 text-xs border-l border-[var(--border-hairline)] pl-3 sm:pl-5">
              <div>
                <span className="font-tabular font-semibold text-[var(--text-primary)]">
                  {diaryOnly ? stats.totalDiaryScreenings : stats.totalCatalogRecords}
                </span>
                <span className="text-[var(--text-muted)] ml-1">
                  {diaryOnly ? 'diary logs' : 'total logs'}
                </span>
              </div>
              <span className="text-[var(--text-muted)]">·</span>
              <div>
                <span className="font-tabular font-semibold text-[#d4a359]">
                  {stats.totalWrittenReviews}
                </span>
                <span className="text-[var(--text-muted)] ml-1">reviews</span>
                <span className="text-[var(--text-muted)] ml-1 hidden md:inline font-tabular text-[11px]">
                  ({(stats.totalReviewWords / 1000).toFixed(1)}k words)
                </span>
              </div>
              <span className="text-[var(--text-muted)] hidden sm:inline">·</span>
              <div className="hidden sm:block">
                <span className="font-tabular font-semibold text-[#e05a47]">
                  {stats.totalRewatchScreenings}
                </span>
                <span className="text-[var(--text-muted)] ml-1">rewatches</span>
              </div>
              <span className="text-[var(--text-muted)] hidden md:inline">·</span>
              <div className="hidden md:flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400/80" />
                <span className="font-tabular font-semibold text-[var(--text-primary)]">
                  {stats.totalLikedFilms}
                </span>
                <span className="text-[var(--text-muted)]">loved</span>
              </div>
            </div>
          </div>

          {/* Right: Dual Surface Mode Switcher, Diary/Catalog Toggle & CSV Ingest */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-2.5 flex-wrap">
            {/* Dual Surface Mode Switcher: OLED Screening Room vs 35mm Criterion Archive */}
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
                title="True Pitch-Black #000000 OLED Screening Room"
              >
                <Moon className="w-3 h-3 text-sky-300" />
                <span>OLED</span>
              </button>
              <button
                onClick={() => setTheme('criterion')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  theme === 'criterion'
                    ? 'bg-[#d4a359]/20 text-[#f4f0ea] border border-[#d4a359]/30 shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
                title="Warm #0d0c0a Criterion 35mm Celluloid Archive"
              >
                <Film className="w-3 h-3 text-[#d4a359]" />
                <span>35mm</span>
              </button>
            </div>

            {/* Diary Only vs Full Catalog Master Switch */}
            <div className="flex items-center p-0.5 rounded-full bg-white/[0.03] border border-[var(--border-hairline)]">
              <button
                onClick={() => setDiaryOnly(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  diaryOnly
                    ? 'bg-[#e05a47]/20 text-[#f4f0ea] border border-[#e05a47]/40'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
                title="Exact dated screenings from diary.csv + reviews.csv"
              >
                <Calendar className="w-3 h-3 text-[#d4a359]" />
                <span>Diary ({stats.totalDiaryScreenings})</span>
              </button>
              <button
                onClick={() => setDiaryOnly(false)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  !diaryOnly
                    ? 'bg-white/10 text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
                title="Includes +70 unlogged watched/rated catalog films"
              >
                <span>All ({stats.totalCatalogRecords})</span>
              </button>
            </div>

            {/* Upload CSV Button */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-[var(--border-specular)] text-[11px] font-medium text-[var(--text-primary)] transition-all"
            >
              <Upload className="w-3 h-3 text-[#d4a359]" />
              <span>{isCustomData ? 'Update Boxd' : 'Import Boxd'}</span>
            </button>

            {isCustomData && (
              <button
                onClick={onResetData}
                className="text-[11px] text-[#e05a47] hover:underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Floating Liquid-Glass Bottom Pill Dock */}
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
