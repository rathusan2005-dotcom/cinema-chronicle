import React, { useState, useMemo, useEffect } from 'react';
import { PlayRecord, CleanserConfig } from './types';
import { generateMockPlayHistory } from './lib/mockData';
import { DEFAULT_CLEANSER_CONFIG, calculateCleanserStats, filterRecords } from './lib/cleanser';
import { Navbar } from './components/Navbar';
import { EraStreamgraph } from './components/EraStreamgraph';
import { CircadianMatrix } from './components/CircadianMatrix';
import { DiscoverySpikes } from './components/DiscoverySpikes';
import { OnRepeat } from './components/OnRepeat';
import { ComfortBlanket } from './components/ComfortBlanket'; // Dormant: reserved for future Journal / Mood sync
import { CrossGenreRecommender } from './components/CrossGenreRecommender';
import { GranularTimeline } from './components/GranularTimeline';
import { UploadModal } from './components/UploadModal';
import { CleanserSettingsModal } from './components/CleanserSettingsModal';
import { loadArchiveFromDB, saveArchiveToDB, clearArchiveFromDB } from './lib/storage';

export function App() {
  const [records, setRecords] = useState<PlayRecord[]>(() => generateMockPlayHistory());
  const [isCustomData, setIsCustomData] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('river');
  const [activeOnly, setActiveOnly] = useState<boolean>(true);
  const [theme, setTheme] = useState<'oled' | 'vinyl'>(() => {
    try {
      const saved = localStorage.getItem('sonic_chronicle_theme');
      if (saved === 'oled' || saved === 'vinyl') return saved;
    } catch {}
    return 'vinyl';
  });
  const [cleanserConfig, setCleanserConfig] = useState<CleanserConfig>(DEFAULT_CLEANSER_CONFIG);

  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Restore persisted IndexedDB archive on launch
  useEffect(() => {
    let isMounted = true;
    loadArchiveFromDB().then(saved => {
      if (isMounted && saved && saved.records.length > 0) {
        setRecords(saved.records);
        setIsCustomData(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('sonic_chronicle_theme', theme);
    } catch {}
  }, [theme]);

  // Compute Cleanser statistics
  const stats = useMemo(() => {
    return calculateCleanserStats(records, cleanserConfig);
  }, [records, cleanserConfig]);

  // Filtered dataset according to active/full toggle & cleanser settings
  const filteredRecords = useMemo(() => {
    return filterRecords(records, activeOnly, cleanserConfig);
  }, [records, activeOnly, cleanserConfig]);

  const handleCustomDataLoaded = (newRecords: PlayRecord[], filename: string = 'Apple Music Play Activity.csv') => {
    setRecords(newRecords);
    setIsCustomData(true);
    saveArchiveToDB(newRecords, filename);
  };

  const handleResetData = () => {
    setRecords(generateMockPlayHistory());
    setIsCustomData(false);
    clearArchiveFromDB();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col font-sans transition-colors duration-300 selection:bg-[#d4a359]/30 selection:text-[#f4f0ea]">
      {/* Archival Masthead + Floating Liquid-Glass Dock */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeOnly={activeOnly}
        setActiveOnly={setActiveOnly}
        theme={theme}
        setTheme={setTheme}
        stats={stats}
        isCustomData={isCustomData}
        onOpenUpload={() => setIsUploadOpen(true)}
        onResetData={handleResetData}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area — Immediate First-Viewport Immersion */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-28 space-y-12">
        {/* Tab Views */}
        {activeTab === 'river' && (
          <EraStreamgraph records={filteredRecords} activeOnly={activeOnly} />
        )}

        {activeTab === 'discovery' && (
          <DiscoverySpikes records={filteredRecords} isCustomData={isCustomData} />
        )}

        {activeTab === 'onrepeat' && (
          <OnRepeat records={filteredRecords} isCustomData={isCustomData} />
        )}

        {activeTab === 'lens' && (
          <GranularTimeline records={filteredRecords} activeOnly={activeOnly} />
        )}

        {activeTab === 'circadian' && (
          <CircadianMatrix records={filteredRecords} activeOnly={activeOnly} />
        )}

        {/* Dormant: Reserved for future journal/cross-genre sync */}
        {activeTab === 'comfort' && (
          <ComfortBlanket records={filteredRecords} isCustomData={isCustomData} />
        )}
        {activeTab === 'recommendations' && (
          <CrossGenreRecommender />
        )}
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataLoaded={handleCustomDataLoaded}
        config={cleanserConfig}
      />

      <CleanserSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={cleanserConfig}
        onUpdateConfig={setCleanserConfig}
      />

      {/* Archival Colophon Footer */}
      <footer className="border-t border-[var(--border-hairline)] bg-[var(--bg-canvas)] pt-6 pb-28 text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4a359]" />
            <span className="font-editorial italic text-sm text-[var(--text-secondary)]">
              Sonic Chronicle — Personal Archive for Rath (@justrath)
            </span>
          </div>

          <div className="flex items-center gap-4 font-tabular text-[11px]">
            <span>2020 – 2026</span>
            <span>·</span>
            <span>100% Local-First Execution</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
