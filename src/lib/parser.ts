import Papa from 'papaparse';
import { FilmRecord } from '../types';
import { FILM_METADATA_MAP } from './letterboxdArchive';

function getDecade(year: number): string {
  if (year >= 2020) return '2020s';
  if (year >= 2010) return '2010s';
  if (year >= 2000) return '2000s';
  if (year >= 1990) return '1990s';
  return 'Classic ≤80s';
}

function cleanReviewText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/<\/?p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(b|strong|i|em|blockquote|a)[^>]*>/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parseSingleCsv(file: File): Promise<{ filename: string; rows: any[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve({ filename: file.name.toLowerCase(), rows: results.data as any[] });
      },
      error: (err) => reject(err)
    });
  });
}

/**
 * Parses one or multiple Letterboxd CSV files (diary.csv, reviews.csv, ratings.csv, watched.csv)
 * and merges them into unified FilmRecord objects.
 */
export async function parseLetterboxdFiles(files: FileList | File[]): Promise<FilmRecord[]> {
  const fileArray = Array.from(files);
  const parsedFiles = await Promise.all(fileArray.map(parseSingleCsv));

  const diaryRows: any[] = [];
  const reviewRows: any[] = [];
  const ratingRows: any[] = [];
  const watchedRows: any[] = [];

  for (const pf of parsedFiles) {
    if (pf.filename.includes('review')) {
      reviewRows.push(...pf.rows);
    } else if (pf.filename.includes('diary')) {
      diaryRows.push(...pf.rows);
    } else if (pf.filename.includes('rating')) {
      ratingRows.push(...pf.rows);
    } else if (pf.filename.includes('watched')) {
      watchedRows.push(...pf.rows);
    } else {
      // Auto-detect by columns
      const sample = pf.rows[0] || {};
      if ('Review' in sample) {
        reviewRows.push(...pf.rows);
      } else if ('Watched Date' in sample || 'Rewatch' in sample) {
        diaryRows.push(...pf.rows);
      } else if ('Rating' in sample) {
        ratingRows.push(...pf.rows);
      } else if ('Name' in sample && 'Year' in sample) {
        watchedRows.push(...pf.rows);
      }
    }
  }

  const ratingsMap = new Map<string, number>();
  ratingRows.forEach((r) => {
    const key = `${(r.Name || '').trim()}::${(r.Year || '').trim()}`;
    if (r.Rating) ratingsMap.set(key, parseFloat(r.Rating));
  });

  const reviewsByUri = new Map<string, any>();
  reviewRows.forEach((r) => {
    const uri = (r['Letterboxd URI'] || '').trim();
    if (uri) reviewsByUri.set(uri, r);
  });

  const diaryUris = new Set<string>();
  const loggedFilmKeys = new Set<string>();
  const records: FilmRecord[] = [];

  diaryRows.forEach((d, idx) => {
    const uri = (d['Letterboxd URI'] || '').trim();
    if (uri) diaryUris.add(uri);
    const title = (d.Name || 'Untitled Film').trim();
    const yr = parseInt(d.Year, 10) || 2020;
    const fKey = `${title}::${yr}`;
    loggedFilmKeys.add(fKey);

    const revRow = uri ? reviewsByUri.get(uri) : undefined;
    const review = revRow ? cleanReviewText(revRow.Review || '') : '';
    const wordCount = review ? review.split(/\s+/).filter(Boolean).length : 0;

    const ratingRaw = d.Rating || (revRow ? revRow.Rating : '');
    const rating = ratingRaw ? parseFloat(ratingRaw) : ratingsMap.get(fKey) ?? null;

    const isRewatch =
      String(d.Rewatch || '').trim().toLowerCase() === 'yes' ||
      (revRow && String(revRow.Rewatch || '').trim().toLowerCase() === 'yes');

    const tagsStr = d.Tags || (revRow ? revRow.Tags : '') || '';
    const tags = tagsStr
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean);

    const watchedDate = (d['Watched Date'] || (revRow && revRow['Watched Date']) || d.Date || '2024-01-01').trim();
    const loggedDate = (d.Date || watchedDate).trim();
    const meta = FILM_METADATA_MAP[title] || ['Independent / Auteur', 'English', 'Prestige Crime, Sci-Fi & Thrillers', 120];

    records.push({
      id: `upload-diary-${idx + 1}`,
      title,
      releaseYear: yr,
      releaseDecade: getDecade(yr),
      director: meta[0],
      language: meta[1],
      movement: meta[2],
      runtimeMinutes: meta[3],
      watchedDate,
      loggedDate,
      timestamp: new Date(watchedDate + 'T20:00:00'),
      rating,
      isRewatch,
      isLiked: rating !== null && rating >= 4.5,
      isDiaryLogged: true,
      review,
      reviewWordCount: wordCount,
      tags,
      lists: [],
      letterboxdUri: uri
    });
  });

  // Add review rows not in diary
  reviewRows.forEach((r, idx) => {
    const uri = (r['Letterboxd URI'] || '').trim();
    if (uri && diaryUris.has(uri)) return;
    const title = (r.Name || 'Untitled Film').trim();
    const yr = parseInt(r.Year, 10) || 2020;
    const fKey = `${title}::${yr}`;
    loggedFilmKeys.add(fKey);

    const review = cleanReviewText(r.Review || '');
    const wordCount = review ? review.split(/\s+/).filter(Boolean).length : 0;
    const rating = r.Rating ? parseFloat(r.Rating) : ratingsMap.get(fKey) ?? null;
    const isRewatch = String(r.Rewatch || '').trim().toLowerCase() === 'yes';
    const tags = String(r.Tags || '')
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean);
    const watchedDate = (r['Watched Date'] || r.Date || '2024-01-01').trim();
    const loggedDate = (r.Date || watchedDate).trim();
    const meta = FILM_METADATA_MAP[title] || ['Independent / Auteur', 'English', 'Prestige Crime, Sci-Fi & Thrillers', 120];

    records.push({
      id: `upload-rev-${idx + 1}`,
      title,
      releaseYear: yr,
      releaseDecade: getDecade(yr),
      director: meta[0],
      language: meta[1],
      movement: meta[2],
      runtimeMinutes: meta[3],
      watchedDate,
      loggedDate,
      timestamp: new Date(watchedDate + 'T20:00:00'),
      rating,
      isRewatch,
      isLiked: rating !== null && rating >= 4.5,
      isDiaryLogged: true,
      review,
      reviewWordCount: wordCount,
      tags,
      lists: [],
      letterboxdUri: uri
    });
  });

  // Add catalog-only watched films
  watchedRows.forEach((w, idx) => {
    const title = (w.Name || '').trim();
    const yr = parseInt(w.Year, 10) || 2020;
    const fKey = `${title}::${yr}`;
    if (!title || loggedFilmKeys.has(fKey)) return;
    const watchedDate = (w.Date || '2022-01-01').trim();
    const rating = ratingsMap.get(fKey) ?? null;
    const meta = FILM_METADATA_MAP[title] || ['Independent / Auteur', 'English', 'Prestige Crime, Sci-Fi & Thrillers', 120];

    records.push({
      id: `upload-cat-${idx + 1}`,
      title,
      releaseYear: yr,
      releaseDecade: getDecade(yr),
      director: meta[0],
      language: meta[1],
      movement: meta[2],
      runtimeMinutes: meta[3],
      watchedDate,
      loggedDate: watchedDate,
      timestamp: new Date(watchedDate + 'T20:00:00'),
      rating,
      isRewatch: false,
      isLiked: rating !== null && rating >= 4.5,
      isDiaryLogged: false,
      review: '',
      reviewWordCount: 0,
      tags: [],
      lists: [],
      letterboxdUri: (w['Letterboxd URI'] || '').trim()
    });
  });

  return records.sort((a, b) => a.watchedDate.localeCompare(b.watchedDate));
}
