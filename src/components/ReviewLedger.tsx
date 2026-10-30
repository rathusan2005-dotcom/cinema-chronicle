import React, { useMemo, useState, useEffect } from 'react';
import { FilmRecord, CuratedList, UserPersonalNote } from '../types';
import {
  PRELOADED_LISTS,
  PRELOADED_COMMENTS,
  PRELOADED_WATCHLIST
} from '../lib/letterboxdArchive';
import { computePersonalTagStats } from '../lib/analytics';
import { loadNotesFromDB, saveNotesToDB } from '../lib/storage';
import {
  BookOpen,
  Search,
  Star,
  Heart,
  Tag,
  MessageSquare,
  ListChecks,
  Clock,
  Sparkles,
  X,
  RotateCcw,
  ExternalLink,
  PenLine,
  Check
} from 'lucide-react';

interface ReviewLedgerProps {
  records: FilmRecord[];
  initialSearchTitle?: string | null;
  onClearInitialSearch?: () => void;
}

export const ReviewLedger: React.FC<ReviewLedgerProps> = ({
  records,
  initialSearchTitle,
  onClearInitialSearch
}) => {
  const [subView, setSubView] = useState<'reviews' | 'lists' | 'comments' | 'watchlist'>('reviews');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4.5+' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'longest' | 'newest' | 'highest' | 'oldest'>('longest');
  const [selectedReviewRecord, setSelectedReviewRecord] = useState<FilmRecord | null>(null);
  const [activeListId, setActiveListId] = useState<string>(PRELOADED_LISTS[0]?.id || 'movies-that-make-me-feel-something');

  // Personal retrospective annotations persisted to IndexedDB
  const [personalNotes, setPersonalNotes] = useState<Record<string, UserPersonalNote>>({});
  const [draftNote, setDraftNote] = useState<string>('');
  const [noteSavedToast, setNoteSavedToast] = useState<boolean>(false);

  useEffect(() => {
    loadNotesFromDB().then((saved) => {
      if (saved) setPersonalNotes(saved);
    });
  }, []);

  useEffect(() => {
    if (initialSearchTitle) {
      setSubView('reviews');
      setSearchQuery(initialSearchTitle);
      setSelectedTag(null);
      setRatingFilter('all');
      if (onClearInitialSearch) onClearInitialSearch();
    }
  }, [initialSearchTitle, onClearInitialSearch]);

  const reviewedRecords = useMemo(() => {
    return records.filter((r) => r.review && r.review.trim().length > 0);
  }, [records]);

  const tagStats = useMemo(() => computePersonalTagStats(records), [records]);

  // Star distribution across all rated logs
  const starDistribution = useMemo(() => {
    const buckets = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    const counts: Record<number, number> = {};
    buckets.forEach((b) => (counts[b] = 0));
    records.forEach((r) => {
      if (r.rating !== null && counts[r.rating] !== undefined) {
        counts[r.rating] += 1;
      }
    });
    const max = Math.max(...Object.values(counts), 1);
    return buckets.map((star) => ({
      star,
      count: counts[star] || 0,
      pct: Math.round(((counts[star] || 0) / max) * 100)
    }));
  }, [records]);

  const filteredReviews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = reviewedRecords.filter((r) => {
      if (selectedTag && !r.tags.includes(selectedTag)) return false;
      if (ratingFilter === '5' && r.rating !== 5) return false;
      if (ratingFilter === '4.5+' && (r.rating === null || r.rating < 4.5)) return false;
      if (ratingFilter === 'low' && (r.rating === null || r.rating > 2.5)) return false;

      if (q) {
        const inTitle = r.title.toLowerCase().includes(q);
        const inDirector = r.director.toLowerCase().includes(q);
        const inReview = r.review.toLowerCase().includes(q);
        const inTags = r.tags.some((t) => t.toLowerCase().includes(q));
        return inTitle || inDirector || inReview || inTags;
      }
      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'longest') return b.reviewWordCount - a.reviewWordCount;
      if (sortBy === 'newest') return b.watchedDate.localeCompare(a.watchedDate);
      if (sortBy === 'oldest') return a.watchedDate.localeCompare(b.watchedDate);
      if (sortBy === 'highest') return (b.rating || 0) - (a.rating || 0) || b.reviewWordCount - a.reviewWordCount;
      return 0;
    });
  }, [reviewedRecords, searchQuery, selectedTag, ratingFilter, sortBy]);

  const activeList: CuratedList | undefined = useMemo(() => {
    return PRELOADED_LISTS.find((l) => l.id === activeListId) || PRELOADED_LISTS[0];
  }, [activeListId]);

  const filteredComments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return PRELOADED_COMMENTS.slice(0, 120);
    return PRELOADED_COMMENTS.filter((c) => c.comment.toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredWatchlist = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return PRELOADED_WATCHLIST;
    return PRELOADED_WATCHLIST.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        String(w.year).includes(q) ||
        w.director.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const openReviewModal = (r: FilmRecord) => {
    setSelectedReviewRecord(r);
    const existing = personalNotes[r.id]?.meaningNote || '';
    setDraftNote(existing);
    setNoteSavedToast(false);
  };

  const handleSaveRetrospectiveNote = () => {
    if (!selectedReviewRecord) return;
    const updated: Record<string, UserPersonalNote> = {
      ...personalNotes,
      [selectedReviewRecord.id]: {
        id: selectedReviewRecord.id,
        itemType: 'review',
        title: selectedReviewRecord.title,
        subtitle: selectedReviewRecord.watchedDate,
        meaningNote: draftNote.trim(),
        evokedEmotion: 'Retrospective Reflection',
        updatedAt: new Date().toISOString()
      }
    };
    setPersonalNotes(updated);
    saveNotesToDB(updated);
    setNoteSavedToast(true);
    setTimeout(() => setNoteSavedToast(false), 2500);
  };

  // All screenings of the currently opened film in modal
  const siblingScreenings = useMemo(() => {
    if (!selectedReviewRecord) return [];
    return records
      .filter(
        (r) =>
          r.title === selectedReviewRecord.title &&
          r.releaseYear === selectedReviewRecord.releaseYear &&
          r.isDiaryLogged
      )
      .sort((a, b) => a.watchedDate.localeCompare(b.watchedDate));
  }, [selectedReviewRecord, records]);

  return (
    <div className="space-y-8">
      {/* Header & Sub-View Navigation */}
      <section className="archive-plate rounded-3xl p-5 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="font-tabular text-[11px] uppercase tracking-[0.2em] text-[#d4a359] mb-1.5">
              II · Rath's Inner Monologue & Personal Prose Archive
            </p>
            <h2 className="font-editorial text-2xl sm:text-4xl text-[var(--text-primary)] tracking-tight">
              The Review Ledger & Curated Vaults
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
              550 KB of raw emotional honesty across {reviewedRecords.length} written reviews, 19 custom diary tags, 5 personal lists (including <span className="italic text-[#f4f0ea]">grieving</span> & <span className="italic text-[#f4f0ea]">movies that make me feel something</span>), and 754 post-theatre comments.
            </p>
          </div>

          {/* 4-Way Vault Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-[var(--border-hairline)]">
            <button
              onClick={() => setSubView('reviews')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                subView === 'reviews'
                  ? 'bg-[#d4a359]/20 text-[#f4f0ea] border border-[#d4a359]/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#d4a359]" />
              <span>Written Reviews ({reviewedRecords.length})</span>
            </button>

            <button
              onClick={() => setSubView('lists')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                subView === 'lists'
                  ? 'bg-[#d4a359]/20 text-[#f4f0ea] border border-[#d4a359]/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5 text-[#e05a47]" />
              <span>Curated Lists ({PRELOADED_LISTS.length})</span>
            </button>

            <button
              onClick={() => setSubView('comments')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                subView === 'comments'
                  ? 'bg-[#d4a359]/20 text-[#f4f0ea] border border-[#d4a359]/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              <span>Comments ({PRELOADED_COMMENTS.length})</span>
            </button>

            <button
              onClick={() => setSubView('watchlist')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                subView === 'watchlist'
                  ? 'bg-[#d4a359]/20 text-[#f4f0ea] border border-[#d4a359]/40'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Watchlist ({PRELOADED_WATCHLIST.length})</span>
            </button>
          </div>
        </div>

        {/* Star Distribution Histogram + Search Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-[var(--border-hairline)] items-center">
          {/* Search Input */}
          <div className="lg:col-span-7 relative">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                subView === 'reviews'
                  ? 'Search 550KB of reviews by film, quote, feeling ("saved my life", "royal albert hall", "surya", "crying")...'
                  : subView === 'comments'
                  ? 'Search 754 Letterboxd comments...'
                  : 'Search film title or director...'
              }
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-black/45 border border-[var(--border-hairline)] focus:border-[#d4a359] text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mini Star Rating Curve */}
          <div className="lg:col-span-5 flex items-end justify-between gap-1.5 bg-black/30 px-4 py-2.5 rounded-2xl border border-[var(--border-hairline)]">
            <div className="mr-2">
              <span className="font-tabular text-[10px] uppercase tracking-wider text-[var(--text-muted)] block">
                Star Curve
              </span>
              <span className="font-editorial text-sm text-[#d4a359]">0.5★ – 5.0★</span>
            </div>
            <div className="flex items-end gap-1.5 flex-1 h-10">
              {starDistribution.map((b) => (
                <div
                  key={b.star}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative"
                  title={`${b.star}★: ${b.count} logs`}
                >
                  <div
                    className="w-full rounded-t bg-[#d4a359]/45 group-hover:bg-[#d4a359] transition-all"
                    style={{ height: `${Math.max(b.pct, 8)}%` }}
                  />
                  <span className="font-tabular text-[9px] text-[var(--text-muted)] mt-1">
                    {b.star % 1 === 0 ? `${b.star}★` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SUBVIEW A: WRITTEN REVIEWS CONTROLS (Rath's 19 Custom Tags + Sort) */}
        {subView === 'reviews' && (
          <div className="space-y-4 pt-2">
            {/* Rath's Personal Tag Taxonomy */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-tabular text-[11px] uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-[#d4a359]" />
                  Your Personal Letterboxd Tag Taxonomy (Click to filter)
                </span>
                {selectedTag && (
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="text-[11px] text-[#e05a47] hover:underline"
                  >
                    Clear tag filter
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-3 py-1 rounded-full text-xs transition-all border ${
                    selectedTag === null
                      ? 'bg-[#d4a359]/20 text-[#f4f0ea] border-[#d4a359]/40 font-medium'
                      : 'bg-white/[0.02] border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  All Reviews ({reviewedRecords.length})
                </button>
                {tagStats.map((ts) => {
                  const active = selectedTag === ts.tag;
                  return (
                    <button
                      key={ts.tag}
                      onClick={() => setSelectedTag(active ? null : ts.tag)}
                      className={`px-3 py-1 rounded-full text-xs transition-all border flex items-center gap-1.5 ${
                        active
                          ? 'bg-[#e05a47]/25 text-[#f4f0ea] border-[#e05a47]/50 font-medium shadow-sm'
                          : 'bg-white/[0.03] hover:bg-white/[0.07] border-[var(--border-hairline)] text-[var(--text-secondary)]'
                      }`}
                    >
                      <span>{ts.tag}</span>
                      <span className="font-tabular text-[10px] text-[#d4a359]">{ts.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating & Sort Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 bg-black/35 p-1 rounded-full border border-[var(--border-hairline)]">
                {(
                  [
                    { id: 'all', label: 'All Ratings' },
                    { id: '5', label: '👑 5★ Pantheon' },
                    { id: '4.5+', label: '❤️ 4.5★+ Loved' },
                    { id: 'low', label: '💀 ≤2.5★ Rants' }
                  ] as const
                ).map((rf) => (
                  <button
                    key={rf.id}
                    onClick={() => setRatingFilter(rf.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                      ratingFilter === rf.id
                        ? 'bg-white/12 text-white'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                    }`}
                  >
                    {rf.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[var(--text-muted)]">Sort by:</span>
                {(
                  [
                    { id: 'longest', label: 'Longest Essays' },
                    { id: 'newest', label: 'Newest First' },
                    { id: 'highest', label: 'Highest Rated' },
                    { id: 'oldest', label: 'Oldest First' }
                  ] as const
                ).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSortBy(s.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] transition-all ${
                      sortBy === s.id
                        ? 'bg-[#d4a359]/20 text-[#d4a359] border border-[#d4a359]/35 font-medium'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ==================== SUBVIEW A: WRITTEN REVIEWS GRID ==================== */}
      {subView === 'reviews' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="font-tabular text-xs text-[var(--text-muted)]">
              Showing <strong className="text-[var(--text-primary)]">{filteredReviews.length}</strong> personal reviews
              {selectedTag ? ` tagged "${selectedTag}"` : ''}
            </span>
            <span className="text-xs text-[#d4a359]">
              Tap any card to open full Criterion Reading Room
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredReviews.map((r) => {
              const hasNote = Boolean(personalNotes[r.id]?.meaningNote);
              return (
                <article
                  key={r.id}
                  onClick={() => openReviewModal(r)}
                  className="archive-plate rounded-3xl p-6 flex flex-col justify-between gap-4 cursor-pointer hover:border-[#d4a359]/45 transition-all group"
                >
                  <div className="space-y-3">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-editorial text-xl sm:text-2xl text-[var(--text-primary)] group-hover:text-[#d4a359] transition-colors">
                            {r.title}
                          </h3>
                          <span className="font-tabular text-xs text-[var(--text-muted)]">
                            ({r.releaseYear})
                          </span>
                          {r.isLiked && (
                            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                          )}
                          {r.isRewatch && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-tabular bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              <RotateCcw className="w-2.5 h-2.5" />
                              Rewatch
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                          Directed by <span className="text-[var(--text-primary)]">{r.director}</span> · Screened{' '}
                          <span className="font-tabular">{r.watchedDate}</span>
                        </p>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        {r.rating !== null && (
                          <span className="font-tabular text-sm font-semibold px-2.5 py-1 rounded-xl bg-[#d4a359]/15 text-[#d4a359] border border-[#d4a359]/30">
                            {r.rating} ★
                          </span>
                        )}
                        <span className="font-tabular text-[10px] text-[var(--text-muted)] mt-1">
                          {r.reviewWordCount} words
                        </span>
                      </div>
                    </div>

                    {/* Review Excerpt */}
                    <div className="text-xs sm:text-sm text-[var(--text-primary)]/90 leading-relaxed whitespace-pre-line line-clamp-6 font-sans bg-black/25 p-4 rounded-2xl border border-[var(--border-hairline)]">
                      {r.review}
                    </div>
                  </div>

                  {/* Card Footer: Tags & Read Full Button */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border-hairline)]">
                    <div className="flex flex-wrap gap-1.5">
                      {r.tags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-[var(--border-hairline)] text-[var(--text-secondary)]"
                        >
                          {t}
                        </span>
                      ))}
                      {r.tags.length > 4 && (
                        <span className="text-[11px] text-[var(--text-muted)] font-tabular">
                          +{r.tags.length - 4}
                        </span>
                      )}
                      {hasNote && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#d4a359]/20 text-[#d4a359]">
                          + Liner Note
                        </span>
                      )}
                    </div>

                    <span className="font-tabular text-[11px] text-[#d4a359] shrink-0 group-hover:translate-x-0.5 transition-transform">
                      Read essay →
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* ==================== SUBVIEW B: RATH'S 5 CURATED LISTS ==================== */}
      {subView === 'lists' && (
        <section className="space-y-6">
          {/* List Selector Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PRELOADED_LISTS.map((lst) => {
              const active = lst.id === activeList?.id;
              return (
                <button
                  key={lst.id}
                  onClick={() => setActiveListId(lst.id)}
                  className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                    active
                      ? 'bg-[#d4a359]/15 border-[#d4a359]/50 shadow-md'
                      : 'archive-plate hover:border-white/20'
                  }`}
                >
                  <div>
                    <span className="font-tabular text-[10px] uppercase tracking-wider text-[#d4a359]">
                      Created {lst.createdDate}
                    </span>
                    <h4 className="font-editorial text-lg text-[var(--text-primary)] mt-0.5">
                      {lst.name}
                    </h4>
                    {lst.description && (
                      <p className="text-xs italic text-[var(--text-secondary)] mt-1 line-clamp-2">
                        "{lst.description}"
                      </p>
                    )}
                  </div>
                  <div className="mt-3 pt-2 border-t border-[var(--border-hairline)] flex items-center justify-between font-tabular text-[11px] text-[var(--text-muted)]">
                    <span>{lst.items.length} films</span>
                    <span className="text-[#d4a359]">Inspect →</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active List Showcase */}
          {activeList && (
            <div className="archive-plate rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
                <div>
                  <span className="font-tabular text-xs uppercase tracking-widest text-[#d4a359]">
                    Curated Letterboxd List · {activeList.createdDate}
                  </span>
                  <h3 className="font-editorial text-3xl text-[var(--text-primary)] mt-1">
                    {activeList.name}
                  </h3>
                  {activeList.description && (
                    <p className="font-editorial italic text-lg text-[#e05a47] mt-1">
                      "{activeList.description}"
                    </p>
                  )}
                </div>
                <div className="font-tabular text-xs text-[var(--text-secondary)]">
                  {activeList.items.filter((i) => i.isWatched).length} / {activeList.items.length} watched
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeList.items.map((item) => (
                  <div
                    key={`${item.position}-${item.title}`}
                    onClick={() => {
                      const match = reviewedRecords.find((r) => r.title === item.title);
                      if (match) openReviewModal(match);
                    }}
                    className="p-4 rounded-2xl bg-black/30 border border-[var(--border-hairline)] hover:border-[#d4a359]/40 transition-all flex flex-col justify-between gap-3 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-tabular text-xs text-[#d4a359]">
                          #{String(item.position).padStart(2, '0')}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {item.isLiked && (
                            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                          )}
                          {item.rating !== null && (
                            <span className="font-tabular text-xs px-2 py-0.5 rounded bg-[#d4a359]/15 text-[#d4a359]">
                              {item.rating}★
                            </span>
                          )}
                          <span
                            className={`font-tabular text-[10px] px-2 py-0.5 rounded-full ${
                              item.isWatched
                                ? 'bg-emerald-500/15 text-emerald-300'
                                : 'bg-white/[0.05] text-[var(--text-muted)]'
                            }`}
                          >
                            {item.isWatched ? 'Watched' : 'Unwatched'}
                          </span>
                        </div>
                      </div>

                      <h5 className="font-editorial text-lg text-[var(--text-primary)] mt-1.5">
                        {item.title}{' '}
                        <span className="font-tabular text-xs text-[var(--text-muted)]">
                          ({item.year})
                        </span>
                      </h5>
                      <p className="text-xs text-[var(--text-muted)]">{item.director}</p>
                    </div>

                    {item.note && (
                      <div className="p-3 rounded-xl bg-[#d4a359]/10 border border-[#d4a359]/25 text-xs text-[#f5f1e6] whitespace-pre-line">
                        {item.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ==================== SUBVIEW C: 754 COMMENTS ARCHIVE ==================== */}
      {subView === 'comments' && (
        <section className="archive-plate rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-editorial text-2xl text-[var(--text-primary)]">
                Post-Screening Banter & Community Comments
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Showing {filteredComments.length} of {PRELOADED_COMMENTS.length} comments from <code className="text-[#d4a359]">comments.csv</code>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredComments.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-black/30 border border-[var(--border-hairline)] space-y-2 flex flex-col justify-between"
              >
                <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
                  "{c.comment}"
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-hairline)] font-tabular text-[11px] text-[var(--text-muted)]">
                  <span>{c.date}</span>
                  <a
                    href={c.contentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#d4a359] hover:underline flex items-center gap-1"
                  >
                    <span>Context</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==================== SUBVIEW D: 233 WATCHLIST VAULT ==================== */}
      {subView === 'watchlist' && (
        <section className="archive-plate rounded-3xl p-6 sm:p-8 space-y-5">
          <div>
            <h3 className="font-editorial text-2xl text-[var(--text-primary)]">
              The Unwatched Horizon ({filteredWatchlist.length} films)
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Films waiting patiently in your <code className="text-[#d4a359]">watchlist.csv</code> for when the time and energy feel right.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredWatchlist.slice(0, 120).map((w, idx) => (
              <div
                key={`${w.title}-${idx}`}
                className="p-3.5 rounded-2xl bg-black/30 border border-[var(--border-hairline)] flex flex-col justify-between gap-2"
              >
                <div>
                  <h4 className="font-editorial text-base text-[var(--text-primary)]">
                    {w.title}
                  </h4>
                  <p className="font-tabular text-xs text-[var(--text-muted)]">
                    {w.year} · Added {w.dateAdded}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-hairline)] text-[11px]">
                  <span className="text-[var(--text-secondary)] truncate">{w.director}</span>
                  <a
                    href={w.uri}
                    target="_blank"
                    rel="noreferrer"
                    className="font-tabular text-[#d4a359] hover:underline shrink-0"
                  >
                    Boxd ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==================== CRITERION READING ROOM MODAL ==================== */}
      {selectedReviewRecord && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedReviewRecord(null)}
        >
          <div
            className="archive-plate rounded-3xl max-w-3xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-[#d4a359]/35 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-tabular text-xs uppercase tracking-widest text-[#d4a359]">
                    Criterion Reading Room · Screened {selectedReviewRecord.watchedDate}
                  </span>
                  {selectedReviewRecord.isRewatch && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-tabular bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Rewatch Log
                    </span>
                  )}
                </div>
                <h3 className="font-editorial text-3xl sm:text-4xl text-[var(--text-primary)] mt-1">
                  {selectedReviewRecord.title}{' '}
                  <span className="font-tabular text-lg text-[var(--text-muted)]">
                    ({selectedReviewRecord.releaseYear})
                  </span>
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Directed by <strong className="text-[var(--text-primary)]">{selectedReviewRecord.director}</strong> ·{' '}
                  {selectedReviewRecord.language} · {selectedReviewRecord.movement} ·{' '}
                  <span className="font-tabular">{selectedReviewRecord.runtimeMinutes} mins</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedReviewRecord(null)}
                className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[var(--text-secondary)] hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rating, Likes & Custom Tags */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {selectedReviewRecord.rating !== null && (
                  <span className="font-tabular text-base font-semibold px-3 py-1 rounded-xl bg-[#d4a359]/20 text-[#d4a359] border border-[#d4a359]/40">
                    {selectedReviewRecord.rating} ★
                  </span>
                )}
                {selectedReviewRecord.isLiked && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs">
                    <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                    Loved
                  </span>
                )}
                {selectedReviewRecord.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-3 py-1 rounded-full bg-white/[0.05] border border-[var(--border-hairline)] text-[var(--text-secondary)]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <span className="font-tabular text-xs text-[var(--text-muted)]">
                {selectedReviewRecord.reviewWordCount} words
              </span>
            </div>

            {/* Sibling Screenings Switcher (If watched multiple times, e.g. La La Land 11x!) */}
            {siblingScreenings.length > 1 && (
              <div className="p-4 rounded-2xl bg-[#d4a359]/10 border border-[#d4a359]/25 space-y-2">
                <span className="font-tabular text-[11px] uppercase tracking-wider text-[#d4a359] block">
                  Multi-Screening Odyssey ({siblingScreenings.length} Diary Logs of {selectedReviewRecord.title})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {siblingScreenings.map((sib, idx) => (
                    <button
                      key={sib.id}
                      onClick={() => openReviewModal(sib)}
                      className={`px-3 py-1 rounded-xl font-tabular text-xs transition-all border ${
                        sib.id === selectedReviewRecord.id
                          ? 'bg-[#d4a359] text-black font-semibold border-[#d4a359]'
                          : 'bg-black/40 text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-white'
                      }`}
                    >
                      #{idx + 1} · {sib.watchedDate} {sib.rating ? `(${sib.rating}★)` : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Full Review Text */}
            <div className="p-6 rounded-2xl bg-black/40 border border-[var(--border-hairline)] text-sm sm:text-base text-[var(--text-primary)] leading-relaxed whitespace-pre-line font-sans">
              {selectedReviewRecord.review || 'No written review for this specific screening.'}
            </div>

            {/* Retrospective Liner Note Attachment (IndexedDB persisted) */}
            <div className="pt-4 border-t border-[var(--border-hairline)] space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-tabular text-xs uppercase tracking-wider text-[#d4a359] flex items-center gap-1.5">
                  <PenLine className="w-3.5 h-3.5" />
                  2026 Retrospective Liner Note (Saved Locally to IndexedDB)
                </label>
                {noteSavedToast && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Saved to archive
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={draftNote}
                  onChange={(e) => setDraftNote(e.target.value)}
                  placeholder="Add a look-back note on what this screening or review means to you now..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/50 border border-[var(--border-hairline)] focus:border-[#d4a359] text-xs sm:text-sm text-[var(--text-primary)] outline-none"
                />
                <button
                  onClick={handleSaveRetrospectiveNote}
                  className="px-4 py-2.5 rounded-xl bg-[#d4a359] text-black font-medium text-xs hover:brightness-110 transition shrink-0"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
