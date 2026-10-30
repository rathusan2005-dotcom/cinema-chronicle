import React, { useState, useMemo, useEffect } from 'react';
import { FilmRecord } from './types';
import { getPreloadedFilmRecords } from './lib/letterboxdArchive';
import { computeArchiveStats } from './lib/analytics';
import { Navbar } from './components/Navbar';
import { EraStreamgraph } from './components/EraStreamgraph';
import { ReviewLedger } from './components/ReviewLedger';
import { DiscoverySpikes } from './components/DiscoverySpikes';
import { RewatchSanctuary } from './components/RewatchSanctuary';
import { GranularTimeline } from './components/GranularTimeline';
import { UploadModal } from './components/UploadModal';
import { loadArchiveFromDB, saveArchiveToDB, clearArchiveFromDB } from './lib/storage';

export function App() {
  const [records, setRecords] = useState<FilmRecord[]>(() => getPreloadedFilmRecords());
  const [isCustomData, setIsCustomData] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('river');
  const [theme, setTheme] = useState<'oled' | 'criterion'>(() => {
    try {
      const saved = localStorage.getItem('cinema_chronicle_theme');
      if (saved === 'oled' || saved === 'criterion') return saved;
    } catch {}
    return 'criterion';
  });

  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [reviewJumpTitle, setReviewJumpTitle] = useState<string | null>(null);

  // Restore persisted IndexedDB archive on launch
  useEffect(() => {
    let isMounted = true;
    loadArchiveFromDB().then((saved) => {
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
      localStorage.setItem('cinema_chronicle_theme', theme);
    } catch {}
  }, [theme]);

  const stats = useMemo(() => {
    return computeArchiveStats(records);
  }, [records]);

  const handleCustomDataLoaded = (newRecords: FilmRecord[], filename: string = 'Letterboxd Export') => {
    setRecords(newRecords);
    setIsCustomData(true);
    saveArchiveToDB(newRecords, filename);
  };

  const handleResetData = () => {
    setRecords(getPreloadedFilmRecords());
    setIsCustomData(false);
    clearArchiveFromDB();
  };

  const handleJumpToFilmReview = (filmTitle: string) => {
    setReviewJumpTitle(filmTitle);
    setActiveTab('ledger');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col font-sans transition-colors duration-300 selection:bg-[#d4a359]/30 selection:text-[#f4f0ea]">
      {/* Archival Masthead + Floating Liquid-Glass Dock */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        stats={stats}
        isCustomData={isCustomData}
        onOpenUpload={() => setIsUploadOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Content Area — Immediate First-Viewport Immersion */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-28 space-y-12">
        {activeTab === 'river' && (
          <EraStreamgraph
            records={records}
            onSelectFilmReview={handleJumpToFilmReview}
          />
        )}

        {activeTab === 'ledger' && (
          <ReviewLedger
            records={records}
            initialSearchTitle={reviewJumpTitle}
            onClearInitialSearch={() => setReviewJumpTitle(null)}
          />
        )}

        {activeTab === 'directors' && (
          <DiscoverySpikes
            records={records}
            onOpenReview={handleJumpToFilmReview}
          />
        )}

        {activeTab === 'sanctuary' && (
          <RewatchSanctuary
            records={records}
            onOpenReview={handleJumpToFilmReview}
          />
        )}

        {activeTab === 'lens' && (
          <GranularTimeline
            records={records}
            onOpenReview={handleJumpToFilmReview}
          />
        )}
      </main>

      {/* Letterboxd CSV Ingest Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataLoaded={handleCustomDataLoaded}
      />

      {/* Archival Colophon Footer */}
      <footer className="border-t border-[var(--border-hairline)] bg-[var(--bg-canvas)] pt-6 pb-28 text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4a359]" />
            <span className="font-editorial italic text-sm text-[var(--text-secondary)]">
              Cinema Chronicle — Personal 35mm Celluloid Archive for Rath (@rathhh · eelam 🐅)
            </span>
          </div>

          <div className="flex items-center gap-4 font-tabular text-[11px]">
            <span>2021 – 2026</span>
            <span>·</span>
            <span>477 Films · 287 Written Reviews</span>
            <span>·</span>
            <span>100% Local-First Execution</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
