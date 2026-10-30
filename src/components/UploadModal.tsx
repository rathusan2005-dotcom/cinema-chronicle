import React, { useState } from 'react';
import { FilmRecord } from '../types';
import { parseLetterboxdFiles } from '../lib/parser';
import { Upload, X, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (records: FilmRecord[], filename: string) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded
}) => {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsParsing(true);
    setError(null);
    try {
      const parsed = await parseLetterboxdFiles(files);
      if (parsed.length === 0) {
        setError('No valid Letterboxd rows found. Select diary.csv, reviews.csv, ratings.csv, or watched.csv.');
        setIsParsing(false);
        return;
      }
      const names = Array.from(files)
        .map((f) => f.name)
        .join(', ');
      onDataLoaded(parsed, names);
      setIsParsing(false);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to parse Letterboxd CSV files.');
      setIsParsing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="archive-plate rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-[#d4a359]/35 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="font-tabular text-xs uppercase tracking-widest text-[#d4a359]">
              Local-First Letterboxd Ingest
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl text-[var(--text-primary)] mt-1">
              Import Letterboxd Export CSVs
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Your personal archive (@rathhh) is already pre-loaded! Drop fresh <code className="text-[#d4a359]">diary.csv</code>, <code className="text-[#d4a359]">reviews.csv</code>, <code className="text-[#d4a359]">ratings.csv</code>, or <code className="text-[#d4a359]">watched.csv</code> files here anytime to update your local IndexedDB vault.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[var(--text-secondary)] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <label className="block border-2 border-dashed border-[#d4a359]/35 hover:border-[#d4a359] rounded-2xl p-8 text-center cursor-pointer bg-black/30 transition-all">
          <Upload className="w-8 h-8 text-[#d4a359] mx-auto mb-3" />
          <p className="font-editorial text-lg text-[var(--text-primary)]">
            {isParsing ? 'Reconciling Letterboxd CSVs...' : 'Select one or multiple Letterboxd CSV files'}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Supports multi-select (diary.csv + reviews.csv + ratings.csv + watched.csv)
          </p>
          <input
            type="file"
            accept=".csv"
            multiple
            className="hidden"
            onChange={(e) => handleFilesSelected(e.target.files)}
          />
        </label>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-[var(--border-hairline)] text-[11px] text-[var(--text-muted)] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>100% Private: Processed strictly in your browser and cached in local IndexedDB.</span>
        </div>
      </div>
    </div>
  );
};
