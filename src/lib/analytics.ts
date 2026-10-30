import {
  FilmRecord,
  CinemaCurrent,
  EmergentEra,
  DirectorDossier,
  RewatchAnchor,
  ArchiveStats
} from '../types';
import { RATH_PROFILE } from './letterboxdArchive';

export type CurrentResolution = 'nuanced' | 'balanced' | 'broad' | 'decades';

export const CINEMA_CURRENTS: CinemaCurrent[] = [
  {
    id: 'tamil_new_wave',
    name: 'Tamil New Wave & Grit',
    shortName: 'Tamil New Wave',
    color: '#e05a47',
    secondaryColor: '#9e3526',
    description: 'Raw, politically conscious, and visceral Tamil auteur cinema exploring caste, survival, underworld loyalty, and human resilience.',
    anchorDirectors: ['Vetrimaaran', 'Pa. Ranjith', 'Mari Selvaraj', 'Karthik Subbaraj', 'Thiagarajan Kumararaja']
  },
  {
    id: 'tamil_romance',
    name: 'Tamil Romance & Melodrama',
    shortName: 'Tamil Romance',
    color: '#e87a90',
    secondaryColor: '#a3485b',
    description: 'Poetic yearning, rain-soaked nostalgia, Ilaiyaraaja & A.R. Rahman musical soul, and coming-of-age heartbreak.',
    anchorDirectors: ['Mani Ratnam', 'Gautham Vasudev Menon', 'C. Prem Kumar', 'Ashwath Marimuthu', 'Halitha Shameem']
  },
  {
    id: 'tamil_mass',
    name: 'Tamil Mass & Adrenaline',
    shortName: 'Tamil Mass',
    color: '#f0a830',
    secondaryColor: '#b37714',
    description: 'First-day-first-show theatre euphoria, Anirudh basslines, high-voltage commercial entertainers, and larger-than-life charisma.',
    anchorDirectors: ['Lokesh Kanagaraj', 'Nelson Dilipkumar', 'A.R. Murugadoss', 'Venkat Prabhu', 'Atlee']
  },
  {
    id: 'south_pan_indian',
    name: 'South Indian & Pan-Indian Soul',
    shortName: 'Mollywood / Tollywood / Hindi',
    color: '#3eb489',
    secondaryColor: '#237a5b',
    description: 'Malayalam new-wave intimacy, Kannada poetic tragedy (SSE), Telugu emotional warmth, and Hindi musical devotion.',
    anchorDirectors: ['Hemanth M. Rao', 'Vivek Athreya', 'S. S. Rajamouli', 'Alphonse Puthren', 'Imtiaz Ali']
  },
  {
    id: 'poetic_romance',
    name: 'Poetic Romance & Heartbreak',
    shortName: 'Poetic Romance',
    color: '#a78bfa',
    secondaryColor: '#6d4ec9',
    description: 'Bittersweet dreamers, walk-and-talk intimacy, jazz-inflected longing, and tender coming-of-age vulnerability.',
    anchorDirectors: ['Damien Chazelle', 'Richard Linklater', 'Celine Song', 'Charlotte Wells', 'Greta Gerwig']
  },
  {
    id: 'prestige_thrillers',
    name: 'Prestige Crime, Sci-Fi & Thrillers',
    shortName: 'Prestige & Sci-Fi',
    color: '#38bdf8',
    secondaryColor: '#1d7ba6',
    description: 'Grand IMAX-scale sci-fi odysseys, neo-noir psychological thrillers, and meticulous crime epics.',
    anchorDirectors: ['Christopher Nolan', 'Denis Villeneuve', 'David Fincher', 'Martin Scorsese', 'Bong Joon-ho']
  },
  {
    id: 'blockbuster_genre',
    name: 'Blockbuster Epics, Action & Horror',
    shortName: 'Blockbusters & Horror',
    color: '#fb923c',
    secondaryColor: '#b55912',
    description: 'Wizarding marathons, superhero sagas, buddy-cop comedy, and late-night supernatural horror thrills.',
    anchorDirectors: ['David Yates', 'Sam Raimi', 'Edgar Wright', 'Guy Ritchie', 'James Wan']
  },
  {
    id: 'animation_whimsy',
    name: 'Animation, Comfort & Whimsy',
    shortName: 'Animation & Whimsy',
    color: '#a3e635',
    secondaryColor: '#659914',
    description: 'Hand-crafted animation, existential Pixar warmth, Studio Ghibli wonder, and pure comfort escapism.',
    anchorDirectors: ['Pete Docter', 'Hayao Miyazaki', 'Chris McKay', 'Phil Lord & Christopher Miller', 'Brad Bird']
  }
];

export const BALANCED_CURRENTS: CinemaCurrent[] = [
  {
    id: 'bal_tamil_auteur',
    name: 'Tamil New Wave, Romance & Soul',
    shortName: 'Tamil Auteur & Romance',
    color: '#e05a47',
    secondaryColor: '#9e3526',
    description: 'Vetrimaaran grit, Mani Ratnam & GVM romance, and C. Prem Kumar nostalgia.',
    anchorDirectors: ['Vetrimaaran', 'Mani Ratnam', 'Gautham Vasudev Menon', 'C. Prem Kumar', 'Mari Selvaraj']
  },
  {
    id: 'bal_tamil_mass',
    name: 'Tamil Mass & Theatre Euphoria',
    shortName: 'Tamil Commercial Mass',
    color: '#f0a830',
    secondaryColor: '#b37714',
    description: 'High-voltage theatre experiences led by Lokesh, Nelson, Murugadoss, and Venkat Prabhu.',
    anchorDirectors: ['Lokesh Kanagaraj', 'Nelson Dilipkumar', 'A.R. Murugadoss', 'Venkat Prabhu']
  },
  {
    id: 'bal_indian_pan',
    name: 'Malayalam, Telugu, Kannada & Hindi',
    shortName: 'Pan-Indian Cinema',
    color: '#3eb489',
    secondaryColor: '#237a5b',
    description: 'Sapta Sagaradaache Ello, Manjummel Boys, Ante Sundaraniki, Aashiqui 2, and Rajamouli epics.',
    anchorDirectors: ['Hemanth M. Rao', 'Vivek Athreya', 'S. S. Rajamouli', 'Imtiaz Ali', 'Chidambaram']
  },
  {
    id: 'bal_western_prestige',
    name: 'Western Romance & Prestige Auteur',
    shortName: 'Western Romance & Auteur',
    color: '#a78bfa',
    secondaryColor: '#6d4ec9',
    description: 'La La Land, Before trilogy, Nolan IMAX epics, Villeneuve sci-fi, and Fincher thrillers.',
    anchorDirectors: ['Damien Chazelle', 'Christopher Nolan', 'Richard Linklater', 'Denis Villeneuve', 'David Fincher']
  },
  {
    id: 'bal_blockbuster_anim',
    name: 'Blockbusters, Animation & Comfort',
    shortName: 'Blockbusters & Animation',
    color: '#38bdf8',
    secondaryColor: '#1d7ba6',
    description: 'Harry Potter marathons, Lego Batman, Spider-Verse, Pixar soul, and late-night genre thrills.',
    anchorDirectors: ['Pete Docter', 'Chris McKay', 'Edgar Wright', 'Sam Raimi', 'Hayao Miyazaki']
  }
];

export const BROAD_CURRENTS: CinemaCurrent[] = [
  {
    id: 'broad_tamil',
    name: 'Tamil Cinema (Kollywood)',
    shortName: 'Tamil Cinema',
    color: '#e05a47',
    secondaryColor: '#9e3526',
    description: 'The complete spectrum of Tamil cinema from Vetrimaaran and Mani Ratnam to Lokesh and Nelson.',
    anchorDirectors: ['Vetrimaaran', 'Mani Ratnam', 'Lokesh Kanagaraj', 'Gautham Vasudev Menon']
  },
  {
    id: 'broad_indian',
    name: 'Malayalam, Telugu, Kannada & Hindi',
    shortName: 'Rest of Indian Cinema',
    color: '#3eb489',
    secondaryColor: '#237a5b',
    description: 'Cross-border Indian storytelling across Mollywood, Sandalwood, Tollywood, and Bollywood.',
    anchorDirectors: ['Hemanth M. Rao', 'S. S. Rajamouli', 'Vivek Athreya', 'Imtiaz Ali']
  },
  {
    id: 'broad_global',
    name: 'Global & Hollywood Cinema',
    shortName: 'Global & Hollywood',
    color: '#a78bfa',
    secondaryColor: '#6d4ec9',
    description: 'International auteur cinema, poetic romance, sci-fi thrillers, and animation.',
    anchorDirectors: ['Damien Chazelle', 'Christopher Nolan', 'Richard Linklater', 'Denis Villeneuve']
  }
];

export const DECADE_CURRENTS: CinemaCurrent[] = [
  {
    id: 'dec_2020s',
    name: '2020s Contemporary Era',
    shortName: '2020s Releases',
    color: '#e05a47',
    secondaryColor: '#9e3526',
    description: 'Modern theatre releases, new-wave OTT discoveries, and 2020–2026 cinema.',
    anchorDirectors: ['Lokesh Kanagaraj', 'Mari Selvaraj', 'Hemanth M. Rao', 'Denis Villeneuve']
  },
  {
    id: 'dec_2010s',
    name: '2010s Defining Classics',
    shortName: '2010s Releases',
    color: '#a78bfa',
    secondaryColor: '#6d4ec9',
    description: 'The golden decade of La La Land, 96, Vada Chennai, Interstellar, and Whiplash.',
    anchorDirectors: ['Damien Chazelle', 'Vetrimaaran', 'C. Prem Kumar', 'Christopher Nolan']
  },
  {
    id: 'dec_2000s',
    name: '2000s Nostalgia & Foundations',
    shortName: '2000s Releases',
    color: '#f0a830',
    secondaryColor: '#b37714',
    description: 'Childhood and formative staples: Vaaranam Aayiram, The Dark Knight, Alaipayuthey, Pudhupettai.',
    anchorDirectors: ['Gautham Vasudev Menon', 'Christopher Nolan', 'Selvaraghavan', 'Mani Ratnam']
  },
  {
    id: 'dec_1990s',
    name: '1990s Arthouse & Icons',
    shortName: '1990s Releases',
    color: '#3eb489',
    secondaryColor: '#237a5b',
    description: 'Before Sunrise, Se7en, Fight Club, GoodFellas, Chungking Express, and Good Will Hunting.',
    anchorDirectors: ['Richard Linklater', 'David Fincher', 'Martin Scorsese', 'Wong Kar-wai']
  },
  {
    id: 'dec_classic',
    name: 'Classic Cinema (≤1980s)',
    shortName: '≤1980s Classics',
    color: '#38bdf8',
    secondaryColor: '#1d7ba6',
    description: 'Foundational milestones: Nayakan, Mouna Raagam, Moondram Pirai, The Godfather, When Harry Met Sally.',
    anchorDirectors: ['Mani Ratnam', 'Balu Mahendra', 'Francis Ford Coppola', 'Rob Reiner']
  }
];

export function getActiveCinemaCurrents(resolution: CurrentResolution = 'nuanced'): CinemaCurrent[] {
  if (resolution === 'balanced') return BALANCED_CURRENTS;
  if (resolution === 'broad') return BROAD_CURRENTS;
  if (resolution === 'decades') return DECADE_CURRENTS;
  return CINEMA_CURRENTS;
}

export function mapRecordToCurrentId(record: FilmRecord, resolution: CurrentResolution = 'nuanced'): string {
  if (resolution === 'decades') {
    if (record.releaseYear >= 2020) return 'dec_2020s';
    if (record.releaseYear >= 2010) return 'dec_2010s';
    if (record.releaseYear >= 2000) return 'dec_2000s';
    if (record.releaseYear >= 1990) return 'dec_1990s';
    return 'dec_classic';
  }

  let nuancedId = 'prestige_thrillers';
  const m = record.movement;
  if (m === 'Tamil New Wave & Grit') nuancedId = 'tamil_new_wave';
  else if (m === 'Tamil Romance & Melodrama') nuancedId = 'tamil_romance';
  else if (m === 'Tamil Mass & Adrenaline') nuancedId = 'tamil_mass';
  else if (m === 'South Indian & Pan-Indian Soul') nuancedId = 'south_pan_indian';
  else if (m === 'Poetic Romance & Heartbreak') nuancedId = 'poetic_romance';
  else if (m === 'Prestige Crime, Sci-Fi & Thrillers') nuancedId = 'prestige_thrillers';
  else if (m === 'Blockbuster Epics, Action & Horror') nuancedId = 'blockbuster_genre';
  else if (m === 'Animation, Comfort & Whimsy') nuancedId = 'animation_whimsy';

  if (resolution === 'nuanced') return nuancedId;

  if (resolution === 'balanced') {
    if (nuancedId === 'tamil_new_wave' || nuancedId === 'tamil_romance') return 'bal_tamil_auteur';
    if (nuancedId === 'tamil_mass') return 'bal_tamil_mass';
    if (nuancedId === 'south_pan_indian') return 'bal_indian_pan';
    if (nuancedId === 'poetic_romance' || nuancedId === 'prestige_thrillers') return 'bal_western_prestige';
    return 'bal_blockbuster_anim';
  }

  // Broad
  if (nuancedId === 'tamil_new_wave' || nuancedId === 'tamil_romance' || nuancedId === 'tamil_mass') {
    return 'broad_tamil';
  }
  if (nuancedId === 'south_pan_indian') return 'broad_indian';
  return 'broad_global';
}

export function filterFilmRecords(records: FilmRecord[], diaryOnly: boolean): FilmRecord[] {
  if (!diaryOnly) return records;
  return records.filter((r) => r.isDiaryLogged);
}

export function computeArchiveStats(records: FilmRecord[], diaryOnly: boolean): ArchiveStats {
  const active = filterFilmRecords(records, diaryOnly);
  const diaryCount = records.filter((r) => r.isDiaryLogged).length;
  const uniqueTitles = new Set(active.map((r) => `${r.title}::${r.releaseYear}`)).size;
  const totalMinutes = active.reduce((acc, r) => acc + (r.runtimeMinutes || 120), 0);
  const withReview = active.filter((r) => r.review && r.review.trim().length > 0);
  const totalWords = withReview.reduce((acc, r) => acc + r.reviewWordCount, 0);
  const rewatches = active.filter((r) => r.isRewatch).length;

  const likedUnique = new Set(
    records.filter((r) => r.isLiked).map((r) => `${r.title}::${r.releaseYear}`)
  ).size;

  const rated = active.filter((r) => r.rating !== null && r.rating > 0);
  const avgRating =
    rated.length > 0
      ? rated.reduce((acc, r) => acc + (r.rating || 0), 0) / rated.length
      : 0;
  const fiveStars = active.filter((r) => r.rating === 5).length;

  return {
    totalDiaryScreenings: diaryCount,
    totalCatalogRecords: records.length,
    uniqueFilmsWatched: uniqueTitles,
    totalHoursWatched: Math.round(totalMinutes / 60),
    totalWrittenReviews: withReview.length,
    totalReviewWords: totalWords,
    totalRewatchScreenings: rewatches,
    totalLikedFilms: likedUnique,
    avgRating: Number(avgRating.toFixed(2)),
    fiveStarCount: fiveStars
  };
}

export function computeEmergentEras(records: FilmRecord[]): EmergentEra[] {
  const diaryRecords = records.filter((r) => r.isDiaryLogged);
  const activeCurrents = CINEMA_CURRENTS;

  const windows = [
    {
      id: 'era-1',
      roman: 'I',
      title: 'Genesis & Comfort Foundations',
      periodLabel: '2021 – 2022',
      startYear: 2021,
      endYear: 2022,
      narrative:
        'Where the archive began: Vaaranam Aayiram saving your life in 2021, first contact with La La Land, Nolan thrillers, and the joy of packed Tamil cinema halls for Doctor, Master, and Vikram.'
    },
    {
      id: 'era-2',
      roman: 'II',
      title: 'The Selective Year & Royal Albert Hall',
      periodLabel: '2023',
      startYear: 2023,
      endYear: 2023,
      narrative:
        'A quieter, intentional 29-film chapter punctuated by IMAX event cinema (Oppenheimer, Across the Spider-Verse), Tamil grit (Viduthalai, Chithha, Jigarthanda DoubleX), and seeing La La Land with a live orchestra at the Royal Albert Hall.'
    },
    {
      id: 'era-3',
      roman: 'III',
      title: 'The 254-Film Cinephile Supernova',
      periodLabel: '2024 – 2025',
      startYear: 2024,
      endYear: 2025,
      narrative:
        'An explosive two-year golden age: devouring 254 films, falling deeply into Sapta Sagaradaache Ello, Vada Chennai, Linklater’s Before trilogy, Mollywood/Tollywood gems, and pouring 500KB+ of raw autobiographical prose into your reviews.'
    },
    {
      id: 'era-4',
      roman: 'IV',
      title: 'The Quiet Sanctuary & Gestation',
      periodLabel: '2026',
      startYear: 2026,
      endYear: 2026,
      narrative:
        'Stepping back from the marathon velocity amidst mental fatigue and burnout. Every screening in 2026 is an intentional companion for rest, healing, and quiet reflection.'
    }
  ];

  return windows.map((w) => {
    const slice = diaryRecords.filter((r) => {
      const yr = parseInt(r.watchedDate.slice(0, 4), 10);
      return yr >= w.startYear && yr <= w.endYear;
    });

    const totalMinutes = slice.reduce((acc, r) => acc + r.runtimeMinutes, 0);
    const currentTotals: Record<string, number> = {};
    const filmCounts: Record<string, { count: number; rating: number }> = {};

    slice.forEach((r) => {
      const cid = mapRecordToCurrentId(r, 'nuanced');
      currentTotals[cid] = (currentTotals[cid] || 0) + 1;
      if (!filmCounts[r.title]) {
        filmCounts[r.title] = { count: 0, rating: r.rating || 0 };
      }
      filmCounts[r.title].count += 1;
      if ((r.rating || 0) > filmCounts[r.title].rating) {
        filmCounts[r.title].rating = r.rating || 0;
      }
    });

    const countSum = Math.max(slice.length, 1);
    const dominantCurrents = Object.entries(currentTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cid, cnt]) => {
        const meta = activeCurrents.find((c) => c.id === cid)!;
        return {
          currentId: cid,
          name: meta?.shortName || cid,
          sharePct: Math.round((cnt / countSum) * 100),
          color: meta?.color || '#d4a359'
        };
      });

    const topFilms = Object.entries(filmCounts)
      .sort((a, b) => b[1].count * 2 + b[1].rating - (a[1].count * 2 + a[1].rating))
      .slice(0, 4)
      .map(([title]) => title);

    const rated = slice.filter((r) => r.rating !== null);
    const avgRating =
      rated.length > 0
        ? Number((rated.reduce((s, r) => s + (r.rating || 0), 0) / rated.length).toFixed(2))
        : 0;

    return {
      id: w.id,
      roman: w.roman,
      title: w.title,
      periodLabel: w.periodLabel,
      dominantCurrents,
      totalHours: Math.round(totalMinutes / 60),
      totalFilms: slice.length,
      totalReviews: slice.filter((r) => r.review && r.review.length > 0).length,
      avgRating,
      topFilms,
      narrative: w.narrative
    };
  });
}

export function computeDirectorDossiers(records: FilmRecord[]): DirectorDossier[] {
  const byDirector = new Map<string, FilmRecord[]>();

  records.forEach((r) => {
    if (!r.director || r.director.includes('Various') || r.director.includes('Short')) return;
    const list = byDirector.get(r.director) || [];
    list.push(r);
    byDirector.set(r.director, list);
  });

  const dossiers: DirectorDossier[] = [];

  byDirector.forEach((logs, director) => {
    const uniqueTitles = new Set(logs.map((l) => l.title));
    if (logs.length < 2 && uniqueTitles.size < 2) return;

    const sorted = [...logs].sort((a, b) => a.watchedDate.localeCompare(b.watchedDate));
    const gateway = sorted[0];

    // Crown film: highest rating, tie-broken by review length and rewatch count
    const titleStats = new Map<
      string,
      { year: number; maxRating: number; count: number; reviewLen: number }
    >();
    sorted.forEach((l) => {
      const cur = titleStats.get(l.title) || {
        year: l.releaseYear,
        maxRating: l.rating || 3.5,
        count: 0,
        reviewLen: 0
      };
      cur.count += 1;
      if ((l.rating || 0) > cur.maxRating) cur.maxRating = l.rating || 0;
      if (l.review.length > cur.reviewLen) cur.reviewLen = l.review.length;
      titleStats.set(l.title, cur);
    });

    let crownTitle = gateway.title;
    let crownYear = gateway.releaseYear;
    let crownRating = gateway.rating || 4.0;
    let bestScore = -1;

    titleStats.forEach((st, title) => {
      const score = st.maxRating * 10 + st.count * 4 + (st.reviewLen > 200 ? 3 : 0);
      if (score > bestScore) {
        bestScore = score;
        crownTitle = title;
        crownYear = st.year;
        crownRating = st.maxRating;
      }
    });

    // Days to second distinct film (or second watch)
    let daysToSecond = 0;
    if (sorted.length > 1) {
      const d1 = new Date(sorted[0].watchedDate).getTime();
      const d2 = new Date(sorted[1].watchedDate).getTime();
      daysToSecond = Math.max(0, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
    }

    // Peak month
    const monthCounts: Record<string, number> = {};
    sorted.forEach((l) => {
      const ym = l.watchedDate.slice(0, 7);
      monthCounts[ym] = (monthCounts[ym] || 0) + 1;
    });
    const topYm = Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '2024-10';
    const [yrStr, moStr] = topYm.split('-');
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const peakMonth = `${monthNames[parseInt(moStr, 10) - 1] || 'Oct'} ${yrStr}`;

    const rated = sorted.filter((l) => l.rating !== null);
    const avgRating =
      rated.length > 0
        ? Number((rated.reduce((s, l) => s + (l.rating || 0), 0) / rated.length).toFixed(2))
        : 4.0;

    const likedCount = new Set(sorted.filter((l) => l.isLiked).map((l) => l.title)).size;
    const reviewCount = sorted.filter((l) => l.review && l.review.trim().length > 0).length;
    const totalHours = Math.round(sorted.reduce((s, l) => s + l.runtimeMinutes, 0) / 60);

    // Binge Velocity Score (0-100)
    const rawVelocity = Math.min(
      99,
      Math.round(
        uniqueTitles.size * 7 +
          sorted.length * 4 +
          avgRating * 6 +
          likedCount * 4 +
          (daysToSecond <= 14 ? 12 : daysToSecond <= 60 ? 6 : 0)
      )
    );

    const patternType: DirectorDossier['patternType'] =
      sorted.length - uniqueTitles.size >= 3
        ? 'Comfort Pillar'
        : uniqueTitles.size >= 5
        ? 'Auteur Obsession'
        : 'Marathon Binge';

    // Cumulative trajectory curve (up to 12 steps)
    const trajectoryCurve = sorted.map((_, idx) => idx + 1);

    dossiers.push({
      director,
      primaryMovement: gateway.movement,
      primaryLanguage: gateway.language,
      gatewayFilm: gateway.title,
      gatewayYear: gateway.releaseYear,
      gatewayDate: gateway.watchedDate,
      gatewayRating: gateway.rating,
      crownFilm: crownTitle,
      crownYear,
      crownRating,
      totalScreenings: sorted.length,
      uniqueFilmsWatched: uniqueTitles.size,
      totalHours,
      avgRating,
      likedCount,
      reviewCount,
      bingeVelocityScore: rawVelocity,
      daysToSecondFilm: daysToSecond,
      peakMonth,
      patternType,
      filmographyLogs: sorted.map((l) => ({
        id: l.id,
        title: l.title,
        year: l.releaseYear,
        watchedDate: l.watchedDate,
        rating: l.rating,
        isRewatch: l.isRewatch,
        isLiked: l.isLiked,
        hasReview: Boolean(l.review && l.review.trim().length > 0),
        reviewSnippet: l.review ? l.review.slice(0, 180) + (l.review.length > 180 ? '…' : '') : undefined,
        fullReview: l.review || undefined,
        tags: l.tags
      })),
      trajectoryCurve
    });
  });

  return dossiers.sort(
    (a, b) =>
      b.totalScreenings * 3 + b.uniqueFilmsWatched * 4 + b.avgRating * 2 -
      (a.totalScreenings * 3 + a.uniqueFilmsWatched * 4 + a.avgRating * 2)
  );
}

export function computeRewatchAnchors(records: FilmRecord[]): RewatchAnchor[] {
  const byFilm = new Map<string, FilmRecord[]>();
  const topFourTitles = new Set(RATH_PROFILE.favoriteFilms.map((f) => f.title));

  records
    .filter((r) => r.isDiaryLogged)
    .forEach((r) => {
      const key = `${r.title}::${r.releaseYear}`;
      const list = byFilm.get(key) || [];
      list.push(r);
      byFilm.set(key, list);
    });

  const anchors: RewatchAnchor[] = [];

  byFilm.forEach((logs) => {
    const hasRewatchFlag = logs.some((l) => l.isRewatch);
    if (logs.length < 2 && !hasRewatchFlag) return;

    const sorted = [...logs].sort((a, b) => a.watchedDate.localeCompare(b.watchedDate));
    const first = sorted[0];
    const rated = sorted.filter((l) => l.rating !== null);
    const avgRating =
      rated.length > 0
        ? Number((rated.reduce((s, l) => s + (l.rating || 0), 0) / rated.length).toFixed(2))
        : 4.5;

    const tagSet = new Set<string>();
    sorted.forEach((l) => l.tags.forEach((t) => tagSet.add(t)));

    anchors.push({
      title: first.title,
      year: first.releaseYear,
      director: first.director,
      language: first.language,
      movement: first.movement,
      runtimeMinutes: first.runtimeMinutes,
      totalScreenings: sorted.length,
      rewatchCount: Math.max(sorted.filter((l) => l.isRewatch).length, sorted.length - 1),
      avgRating,
      isLiked: sorted.some((l) => l.isLiked),
      isTopFour: topFourTitles.has(first.title),
      allTags: Array.from(tagSet),
      lists: first.lists,
      screenings: sorted.map((l) => ({
        id: l.id,
        watchedDate: l.watchedDate,
        loggedDate: l.loggedDate,
        rating: l.rating,
        isRewatch: l.isRewatch,
        review: l.review,
        reviewWordCount: l.reviewWordCount,
        tags: l.tags,
        uri: l.letterboxdUri
      }))
    });
  });

  return anchors.sort((a, b) => {
    if (b.totalScreenings !== a.totalScreenings) return b.totalScreenings - a.totalScreenings;
    if (a.isTopFour !== b.isTopFour) return a.isTopFour ? -1 : 1;
    return b.avgRating - a.avgRating;
  });
}

export interface TagStat {
  tag: string;
  count: number;
  avgRating: number;
  topFilms: string[];
}

export function computePersonalTagStats(records: FilmRecord[]): TagStat[] {
  const map = new Map<string, FilmRecord[]>();
  records.forEach((r) => {
    r.tags.forEach((t) => {
      const list = map.get(t) || [];
      list.push(r);
      map.set(t, list);
    });
  });

  const stats: TagStat[] = [];
  map.forEach((logs, tag) => {
    const rated = logs.filter((l) => l.rating !== null);
    const avg =
      rated.length > 0
        ? Number((rated.reduce((s, l) => s + (l.rating || 0), 0) / rated.length).toFixed(2))
        : 4.0;
    const uniqueTitles = Array.from(new Set(logs.map((l) => l.title))).slice(0, 4);
    stats.push({
      tag,
      count: logs.length,
      avgRating: avg,
      topFilms: uniqueTitles
    });
  });

  return stats.sort((a, b) => b.count - a.count);
}
