import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { parseAppleMusicCSV } from '../lib/parser';
import { PlayRecord, CleanserConfig } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (records: PlayRecord[], filename: string) => void;
  config: CleanserConfig;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded,
  config
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewStats, setPreviewStats] = useState<{
    count: number;
    startDate: string;
    endDate: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setError('Please provide a valid CSV file (e.g. "Apple Music Play Activity.csv")');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const records = await parseAppleMusicCSV(file, undefined, config);
      if (records.length === 0) {
        throw new Error('No valid play activity rows found in this CSV.');
      }

      setPreviewStats({
        count: records.length,
        startDate: records[0].timestamp.toLocaleDateString(),
        endDate: records[records.length - 1].timestamp.toLocaleDateString()
      });

      // Brief delay for smooth UX transition
      setTimeout(() => {
        onDataLoaded(records, file.name);
        setIsProcessing(false);
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err?.message || 'Failed to parse Apple Music Play Activity CSV.');
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl p-6 rounded-2xl glass-card border border-white/10 shadow-2xl overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Ingest Apple Music Archive
              </h2>
              <p className="text-xs text-zinc-400">
                100% Private & Stored Locally in IndexedDB • Zero data leaves your device
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

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-6 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-purple-400 bg-purple-500/10 scale-[0.99]'
              : 'border-white/15 bg-white/[0.02] hover:bg-white/[0.04] hover:border-purple-500/40'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            accept=".csv"
            className="hidden"
          />

          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-3 shadow-inner">
            <FileText className="w-8 h-8 text-purple-300" />
          </div>

          <h3 className="text-sm font-semibold text-white">
            {isProcessing ? 'Processing stream history...' : 'Drop "Apple Music Play Activity.csv" here'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm">
            or click to browse your files. Works directly with the official Apple Media Services GDPR data export.
          </p>

          {isProcessing && (
            <div className="mt-4 flex items-center gap-2 text-xs text-purple-300 font-mono animate-pulse">
              <Sparkles className="w-4 h-4" />
              Parsing timestamps & scrubbing sleep playlists...
            </div>
          )}
        </div>

        {/* Feedback / Alerts */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {previewStats && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              Loaded {previewStats.count.toLocaleString()} plays ({previewStats.startDate} – {previewStats.endDate})
            </span>
          </div>
        )}

        {/* Privacy Note */}
        <div className="mt-6 p-3 rounded-xl bg-zinc-900/50 border border-white/5 text-[11px] text-zinc-400 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-zinc-300">Zero Data Leakage:</span> Your music listening records, IP addresses, and Apple IDs remain 100% inside your local browser memory. Nothing is ever uploaded to any remote server.
          </div>
        </div>
      </div>
    </div>
  );
};
