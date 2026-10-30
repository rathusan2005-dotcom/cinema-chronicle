import {
  FilmRecord,
  CinemaCurrent,
  EmergentEra,
  DirectorDossier,
  RewatchAnchor,
  FranchiseArc,
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
    secondaryColor: '#23775b',
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

  if (nuancedId === 'tamil_new_wave' || nuancedId === 'tamil_romance' || nuancedId === 'tamil_mass') {
    return 'broad_tamil';
  }
  if (nuancedId === 'south_pan_indian') return 'broad_indian';
  return 'broad_global';
}

/**
 * Only returns dated diary/review records (excludes the 70 undated watched.csv catalog entries
 * so fake mark-dates never pollute time-series visualizations).
 */
export function getDatedDiaryRecords(records: FilmRecord[]): FilmRecord[] {
  return records.filter((r) => r.isDiaryLogged);
}

export function computeArchiveStats(records: FilmRecord[]): ArchiveStats {
  const diary = records.filter((r) => r.isDiaryLogged);
  const allUniqueBoxd = new Set(records.map((r) => `${r.title}::${r.releaseYear}`)).size;
  const imdbBackfill = diary.filter((r) => r.isImdbBackfill).length;
  const organicBoxd = diary.length - imdbBackfill;

  const totalMinutes = diary.reduce((acc, r) => acc + (r.runtimeMinutes || 120), 0);
  const withReview = records.filter((r) => r.review && r.review.trim().length > 0);
  const totalWords = withReview.reduce((acc, r) => acc + r.reviewWordCount, 0);
  const rewatches = diary.filter((r) => r.isRewatch).length;

  const likedUnique = new Set(
    records.filter((r) => r.isLiked).map((r) => `${r.title}::${r.releaseYear}`)
  ).size;

  const rated = records.filter((r) => r.rating !== null && r.rating > 0);
  const avgRating =
    rated.length > 0
      ? rated.reduce((acc, r) => acc + (r.rating || 0), 0) / rated.length
      : 0;
  const fiveStars = diary.filter((r) => r.rating === 5).length;

  return {
    totalBoxdFilms: allUniqueBoxd,
    totalDiaryScreenings: diary.length,
    imdbBackfillCount: imdbBackfill,
    organicBoxdCount: organicBoxd,
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
  const diaryRecords = getDatedDiaryRecords(records);
  const activeCurrents = CINEMA_CURRENTS;

  const windows = [
    {
      id: 'era-1',
      roman: 'I',
      title: 'The IMDb Migration & Formative Backfill',
      periodLabel: 'Pre-Oct 2022 (IMDb Dump)',
      filterFn: (r: FilmRecord) => r.isImdbBackfill,
      narrative:
        'Your 177-film retrospective migration from IMDb onto Letterboxd on Oct 26, 2022: capturing the foundational movies that shaped your teenage years—Vaaranam Aayiram saving your life in 2021, Soorarai Pottru, Doctor in theatres, and your very first encounter with La La Land.'
    },
    {
      id: 'era-2',
      roman: 'II',
      title: 'The Selective Year & Royal Albert Hall',
      periodLabel: 'Nov 2022 – Dec 2023',
      filterFn: (r: FilmRecord) =>
        !r.isImdbBackfill && r.watchedDate >= '2022-10-27' && r.watchedDate <= '2023-12-31',
      narrative:
        'Your first true year of real-time Letterboxd logging: IMAX event cinema (Oppenheimer, Across the Spider-Verse), Tamil theatre highs (Vikram, Jailer, Leo, Chithha), and watching La La Land with a live orchestra at the Royal Albert Hall.'
    },
    {
      id: 'era-3',
      roman: 'III',
      title: 'The 254-Film Cinephile Supernova',
      periodLabel: '2024 – 2025',
      filterFn: (r: FilmRecord) =>
        !r.isImdbBackfill && r.watchedDate >= '2024-01-01' && r.watchedDate <= '2025-12-31',
      narrative:
        'An explosive two-year golden age: devouring 254 films, double-billing Sapta Sagaradaache Ello at 3 AM, binging Harry Potter and Linklater’s Before trilogy, and using Letterboxd reviews as your personal life journal ("less intimidating than a blank journal page").'
    },
    {
      id: 'era-4',
      roman: 'IV',
      title: 'Grief, Vaanu & The Quiet Sanctuary',
      periodLabel: '2026',
      filterFn: (r: FilmRecord) => !r.isImdbBackfill && r.watchedDate >= '2026-01-01',
      narrative:
        'After losing Vaanu in January 2026 and entering a deep depressive spiral, the appetite for constant movie-watching fell away. Left behind is your heartbreaking poem for Vaanu under Aftersun, the "grieving (i need to heal)" list, and a quiet space waiting gently for whenever you feel ready.'
    }
  ];

  return windows.map((w) => {
    const slice = diaryRecords.filter(w.filterFn);

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

const DIRECTOR_PSYCHOANALYSIS_DB: Record<string, string> = {
  'Damien Chazelle':
    "Your 12 screenings of Chazelle (with La La Land reigning as your #1 film of all time) diagnose a deep romantic melancholia. Chazelle's obsession with artistic sacrifice, bittersweet yearning, and the dissonance where love and ambition cannot coexist mirrors your own desire for greatness while carrying a quiet emotional ache.",
  'Christopher Nolan':
    "With 8 Nolan films logged (including 5★ for Interstellar and The Prestige), Nolan represents your intellectual sanctuary. You turn to him when you need grand cinematic architecture and cosmic high-concept stories anchored by aching, unshakeable grief—a father trying to reach his daughter across spacetime.",
  'Vetrimaaran':
    "Logging Vetrimaaran's raw filmography (Asuran, Vada Chennai, Viduthalai Part 1, Aadukalam) reveals your hunger for uncompromising moral realism. You reject sterile, formulaic entertainment when engaging with Tamil cinema—you crave soil-deep authenticity, systemic confrontation, and visceral justice.",
  'Mani Ratnam':
    "Your reverence for Mani Ratnam (Iruvar, Nayakan, Alaipayuthey, Bombay, Thalapathi) shows your deep cultural root in classical cinematic poetry. Mani Ratnam's interplay of shadows, rain, and AR Rahman's melodies connects directly to your innate sentimentality and historical romanticism.",
  'Gautham Vasudev Menon':
    "Your 5★ love for Vaaranam Aayiram and Vinnaithaandi Varuvaayaa diagnoses an acute vulnerability to boyhood nostalgia, father-son bonds, and devastating first-love heartbreaks that never fully heal.",
  'Lokesh Kanagaraj':
    "Your immersion into the LCU (Kaithi, Vikram, Master, Leo) functions as your cinematic adrenaline engine. You relish high-octane mass storytelling when it carries stylistic grit, Anirudh's intoxicating pulse, and layered world-building.",
  'Rajkumar Hirani':
    "Your 5★ devotion to 3 Idiots and PK points to a deep craving for heartfelt humanist warmth, critique of societal pressure, and laughter that softens existential anxiety.",
  'Prashanth Neel':
    "Your screenings of K.G.F 1 & 2 and Salaar represent your attraction to unapologetic, larger-than-life scale, mythic hero elevation, and theatrical euphoria.",
  'Karthik Subbaraj':
    "Your appetite for Karthik Subbaraj (Jigarthanda DoubleX, Petta, Mahaan, Iraivi) reveals a cinephile who worships metacinema, retro swagger, and the tension between art and violence.",
  'S. S. Rajamouli':
    "Bāhubali and RRR are your epic mythic compass—stories of brotherhood, impossible devotion, and unbridled cinematic spectacle that remind you why movies were invented.",
  'Richard Linklater':
    "Devouring the Before Trilogy in 3 days exposes your desire for unfiltered conversational intimacy—watching two souls speak across decades with zero pretense.",
  'Mari Selvaraj':
    "Pariyerum Perumal and Karnan strike straight at your emotional core through poetic resistance, symbolic animal grief, and the agonizing weight of caste oppression."
};

export function computeDirectorDossiers(records: FilmRecord[]): DirectorDossier[] {
  const diary = getDatedDiaryRecords(records);
  const byDirector = new Map<string, FilmRecord[]>();

  diary.forEach((r) => {
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

    let daysToSecond = 0;
    if (sorted.length > 1) {
      const d1 = new Date(sorted[0].watchedDate).getTime();
      const d2 = new Date(sorted[1].watchedDate).getTime();
      daysToSecond = Math.max(0, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
    }

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
      crownYear: crownYear,
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
      psychoanalysis:
        DIRECTOR_PSYCHOANALYSIS_DB[director] ||
        `A recurring anchor in your personal archive (${sorted.length} screenings across ${uniqueTitles.size} films). Returning to ${director}'s directorial voice offers a reliable aesthetic rhythm and emotional resonance in your cinematic journey.`,
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

/**
 * Therapist-style psychoanalytical syntheses written in Rath's own cadence and emotional vocabulary.
 */
const PSYCHOANALYSIS_DB: Record<string, string> = {
  'La La Land':
    'More than a favourite film, La La Land is your emotional baseline and personal time capsule. Look at how your relationship with it evolved across 11 logs: in Oct 2022, your highest praise was that the songs felt like watching a South Indian movie and taking 70 screenshots. By 2023 and 2024, it became a physical part of your life—watching it with a live orchestra at the Royal Albert Hall, buying a guitar just to learn Mia & Sebastian’s theme, forcing your mum and sister to watch it, and putting three friends onto it until they cried. Notice when you reach for it: whenever life feels heavy or lonely, or when you want to induct someone special (like Movie Night with Nadu) into how your heart works. You love it because you secretly identify with Seb’s stubborn romanticism—the belief that loving someone enough to push them toward their dreams, even if you don’t end up together, is the purest form of devotion.',

  'Sapta Sagaradaache Ello (Side A & Side B Duology)':
    'You never treat Side A and Side B as two separate movies—to you, they are one continuous 5-hour emotional wound that you willingly reopen every six months. After Niki pestered you 300 times to watch it, Side A shattered you so badly that even at 3 AM you couldn’t sleep without immediately starting Side B. What’s fascinating psychologically is how Side B grew on you: on Watch #1 you gave it 3.5★ because the pacing after the 10-year jump caught you off guard, yet by Watch #2 and #3 it jumped to 4.5★ as you wrote "i adore how much manu loved priya man i can’t wait to love a woman like that!" Manu remembering her phone number after ten years in prison hits the exact nerve you share across your entire Top 4: you are deeply drawn to men who love with an almost self-destructive, unwavering permanence.',

  '96':
    'If La La Land is your technicolour dream, 96 is your midnight ache. You literally dreamed about this film two weeks before your October 2024 rewatch and woke up itching to feel that heartbreak again. Every time you watch Ram and Jaanu, you drop the "rath try not to use letterboxd as a journal challenge (IMPOSSIBLE)" disclaimer because this movie strips away your comedic armour. And notice May 2025: when mental fatigue hit and you couldn’t bring yourself to watch anything new, 96 was the exact comfort blanket you pulled over yourself—proving that for you, bittersweet nostalgia isn’t depressing; it’s where you feel most alive and understood.',

  'Vada Chennai':
    'Your 4 logs of Vada Chennai track your growth from a casual viewer into an obsessive detail-hunter. In 2021 it was a 4★ gangster flick; by 2023 you were dissecting why Samuthirakani’s Guna has that scar across his chest; and by late 2025 you were confessing that Dhanush’s bearded Anbu look literally inspired you to grow out your own beard. It satisfies the other half of your brain—when you aren’t yearning for poetic romance, you crave world-building with "holy aura", nonlinear puzzle pieces, and Santhosh Narayanan basslines that make you feel invincible.',

  'Bāhubali Duology (The Beginning & The Conclusion)':
    'Your July 2025 back-to-back double bill reads like pure inner-child euphoria. Having first logged them back in the 2021 IMDb era, sitting down for both parts in one go ten years after release made you feel like you’d been "living under a GINORMOUS ROCK". You aren’t cynical here at all—you let yourself completely geek out over Amarendra Baahubali knowing every soldier’s name in the Kunthala army, Keeravani’s god-tier score, and how gorgeous Rana and Anushka look. It’s the ultimate reminder that maximalist Indian myth-making still gives you goosebumps.',

  '(500) Days of Summer':
    'This is your most honest mirror. Many guys watch (500) Days of Summer and blame Summer, but across your 3 watches—from fresh off a breakup in 2021 to your Feb 2025 journal entry—you do the exact opposite: "everytime i watch this movie i get this deep feeling that i need to change myself cos i see a lot of myself in tom (which is NOT A GOOD THING !!!)". You use this film as a periodic self-audit against romantic projection and idealizing people in your head.',

  'Lover':
    'Alongside (500) Days of Summer, Lover is where you are bravest with yourself on this app. In Feb and May 2025, when life felt "bare stressful" and Letterboxd was your only outlet, you didn’t hide behind jokes—you admitted seeing flickers of Arun’s toxic insecurities in yourself and wanting badly to outgrow them. You return to Lover not because it’s easy, but because watching flawed people suffocate a relationship gives you the clarity to not repeat their mistakes.',

  'Velaiyilla Pattathari':
    'VIP is your pure dopamine reset button ("i’m SINGLE AND IM YOUNGUUUUUUUU !!!!"). Whenever adulthood or uni stress gets too serious, the first half of VIP—Dhanush’s comedic timing, Anirudh’s undefeated album, and your shameless Amala Paul crush—instantly restores your energy. Yet your refusal to emotionally process the "Amma Amma" sequence ("most depressing 15 mins of cinematic history, need it wiped off the face of the earth") shows how fiercely protective you are of family and maternal warmth.',

  'Sarpatta Parambarai':
    'From wanting to name your future kid Kabilan when it dropped in 2021 to your December 2024 rewatch, Sarpatta is your ultimate inertia-breaker. Even when you sat down in 2024 feeling zero motivation for a 3-hour boxing drama, the moment that first round bell rang and SaNa’s drums kicked in, you were locked in. It reminds you what it feels like to get off the canvas when you’re mentally exhausted.',

  'The Lego Batman Movie':
    'Behind all the tragic Tamil & Kannada romance in your Top 4, Lego Batman is your purest inner child. Ranked proudly as your #3 Batman movie right behind The Dark Knight and Matt Reeves’ The Batman, you reach for it with a plate of chicken biriyani whenever you feel homesick for uni accommodation or just need to laugh at dumb jokes ("alfred da buttler", the pirate ship bit, and Batman’s laugh that you admit is literally your own laugh).',

  'Rocky Aur Rani Kii Prem Kahaani':
    'The ultimate sleeper hit of your comfort vault. In Feb 2024 you started it thinking Ranveer might be cringey and gave it 3.5★; by December 2025, while sick in bed, you watched it TWO DAYS IN A ROW back-to-back and bumped it to 4.5★. Rocky Randhawa’s Shamshera-level golden-retriever himbo energy and English malapropisms ("hallos and walcomes") became your exact medicine when your body and mind needed pure, unpretentious warmth.',

  'Ante... Sundaraniki!':
    'You watched this 3-hour gem three times in barely six weeks (Nov 2024, Dec 2024 with your mum, and Jan 2025 with Niki). Notice why: Vivek Athreya’s non-linear, chaotic, deeply tender storytelling matches the exact rhythm of how you write your own "unnecessarily long and full of waffle" reviews. Even Nani’s terrible Tamil dubbing artist couldn’t ruin it for you—it became an instant safe harbour during late 2024.',

  'Vaaranam Aayiram':
    'The spiritual bedrock of your entire archive. You wrote it plain as day: "this film got me through a really tough time in life, and ava enna is nothing short of magic, that song lowkey saved my life in 2021." Every time you love a movie about grief, moving on, and rebuilding yourself from the ashes, you are echoing what Suriya and GVM gave you in 2021.',

  'Premalu':
    'Hidden inside your second Premalu review (Nov 2024) is the single most revealing sentence of your entire 2024–2025 marathon era: "lately i’ve only been feeling like peaceful when im watching a movie it’s acc a problem 😭😭😭😭". Premalu wasn’t just a cute Malayalam rom-com to you—it was nostalgia for your own friendship group and a 2.5-hour shelter where your racing brain could finally feel at peace.',

  'Monkey Man':
    'Your December 2024 rewatch of Monkey Man holds the key to why Cinema Chronicle exists: "i find reviewing movies easier than journalling bro i haven’t done an entry in over a month im actually SO cooked mentally it’s insane . i think thats y i like doing life updates on here lmao it’s less intimidating than a blank journal page." Movies gave you a prompt so you could talk about your life without the pressure of staring at an empty page.',

  'Raayan':
    'From ranting about Deadpool & Wolverine stealing showtimes to going to the cinema with your whole family for the first time in ages, Raayan became a 3-log summer 2024 fixation driven by A.R. Rahman’s score, Dhanush’s direction, and the rare joy of a shared family theatre night.',

  'Soul':
    'Three 4.5★–5★ logs across 2022–2024. Pixar’s quiet meditation on "spark" versus "purpose"—that you don’t need to be achieving some grand productivity milestone just to justify being alive—speaks directly to the part of you that burned out in 2026.'
};

function buildPsychoanalysis(
  title: string,
  logs: FilmRecord[],
  anchorKind: RewatchAnchor['anchorKind']
): string {
  if (PSYCHOANALYSIS_DB[title]) return PSYCHOANALYSIS_DB[title];

  const reviews = logs.filter((l) => l.review && l.review.trim().length > 0);
  const tagList = Array.from(new Set(logs.flatMap((l) => l.tags)));

  if (anchorKind === 'childhood_revival') {
    if (reviews.length > 0) {
      return `A nostalgic bridge between your pre-Letterboxd childhood and who you are now. Returning to ${title} after years away wasn't just about rewatching the plot—it was about checking in on a younger version of yourself (${reviews[reviews.length - 1].review.slice(0, 140).replace(/\n/g, ' ')}...).`;
    }
    return `A formative pre-Letterboxd memory that you intentionally revisited to reconnect with the comfort, humour, and pacing of your earlier watching years.`;
  }

  if (reviews.length >= 2) {
    return `Across ${logs.length} screenings (${logs.map((l) => l.watchedDate.slice(0, 4)).join(' → ')}), ${title} has acted as a reliable emotional touchstone${tagList.length > 0 ? ` anchored by ${tagList.slice(0, 3).join(', ')}` : ''}. Comparing your thoughts between watches shows how you use rewatches not out of boredom, but to measure how much your own headspace and taste have shifted since the first time the credits rolled.`;
  }

  if (reviews.length === 1) {
    return `Logged ${logs.length} times across your archive. While your first watch lived in your pre-2022 memory bank, returning to ${title} on Letterboxd unlocked a rush of nostalgia and sensory appreciation${tagList.length > 0 ? ` (${tagList.join(', ')})` : ''}.`;
  }

  return `Returned to ${logs.length} times across your viewing history—a quiet, wordless comfort anchor when you just wanted to sit back and let a familiar story carry the evening.`;
}

export function computeRewatchAnchors(records: FilmRecord[]): RewatchAnchor[] {
  const diary = getDatedDiaryRecords(records);
  const byFilm = new Map<string, FilmRecord[]>();
  const topFourTitles = new Set(RATH_PROFILE.favoriteFilms.map((f) => f.title));

  diary.forEach((r) => {
    const key = `${r.title}::${r.releaseYear}`;
    const list = byFilm.get(key) || [];
    list.push(r);
    byFilm.set(key, list);
  });

  const anchors: RewatchAnchor[] = [];
  const handledKeys = new Set<string>();

  // 1. Special Duology Unification: Sapta Sagaradaache Ello (Side A + Side B)
  const sseAKey = 'Sapta Sagaradaache Ello – Side A::2023';
  const sseBKey = 'Sapta Sagaradaache Ello - Side B::2023';
  const sseALogs = byFilm.get(sseAKey) || [];
  const sseBLogs = byFilm.get(sseBKey) || [];
  if (sseALogs.length > 0 || sseBLogs.length > 0) {
    handledKeys.add(sseAKey);
    handledKeys.add(sseBKey);
    const combined = [...sseALogs, ...sseBLogs].sort((a, b) =>
      a.watchedDate.localeCompare(b.watchedDate) || a.title.localeCompare(b.title)
    );
    const rated = combined.filter((l) => l.rating !== null);
    const avgRating =
      rated.length > 0
        ? Number((rated.reduce((s, l) => s + (l.rating || 0), 0) / rated.length).toFixed(2))
        : 4.7;
    const tagSet = new Set<string>();
    combined.forEach((l) => l.tags.forEach((t) => tagSet.add(t)));

    anchors.push({
      id: 'duology-sse',
      title: 'Sapta Sagaradaache Ello (Side A & Side B Duology)',
      subtitle: '3 Back-to-Back Double Bills · 6 Total Screenings',
      year: 2023,
      director: 'Hemanth M. Rao',
      language: 'Kannada',
      movement: 'South Indian & Pan-Indian Soul',
      runtimeMinutes: 145,
      totalScreenings: combined.length,
      rewatchCount: combined.filter((l) => l.isRewatch).length,
      avgRating,
      isLiked: true,
      isTopFour: true,
      anchorKind: 'duology',
      psychoanalysis: PSYCHOANALYSIS_DB['Sapta Sagaradaache Ello (Side A & Side B Duology)'],
      allTags: Array.from(tagSet),
      lists: combined[0]?.lists || [],
      screenings: combined.map((l) => ({
        id: l.id,
        filmTitle: l.title.includes('Side A') ? 'Side A' : 'Side B',
        watchedDate: l.watchedDate,
        loggedDate: l.loggedDate,
        rating: l.rating,
        isRewatch: l.isRewatch,
        isImdbBackfill: l.isImdbBackfill,
        review: l.review,
        reviewWordCount: l.reviewWordCount,
        tags: l.tags,
        uri: l.letterboxdUri
      }))
    });
  }

  // 2. Special Duology Unification: Bāhubali (The Beginning + The Conclusion)
  const bahu1Key = 'Bāhubali: The Beginning::2015';
  const bahu2Key = 'Bāhubali 2: The Conclusion::2017';
  const bahu1Logs = byFilm.get(bahu1Key) || [];
  const bahu2Logs = byFilm.get(bahu2Key) || [];
  if (bahu1Logs.length > 0 || bahu2Logs.length > 0) {
    handledKeys.add(bahu1Key);
    handledKeys.add(bahu2Key);
    const combined = [...bahu1Logs, ...bahu2Logs].sort((a, b) =>
      a.watchedDate.localeCompare(b.watchedDate) || a.releaseYear - b.releaseYear
    );
    const rated = combined.filter((l) => l.rating !== null);
    const avgRating =
      rated.length > 0
        ? Number((rated.reduce((s, l) => s + (l.rating || 0), 0) / rated.length).toFixed(2))
        : 4.5;
    const tagSet = new Set<string>();
    combined.forEach((l) => l.tags.forEach((t) => tagSet.add(t)));

    anchors.push({
      id: 'duology-baahubali',
      title: 'Bāhubali Duology (The Beginning & The Conclusion)',
      subtitle: 'Epic Double Bill · 4 Total Screenings',
      year: 2015,
      director: 'S. S. Rajamouli',
      language: 'Telugu',
      movement: 'South Indian & Pan-Indian Soul',
      runtimeMinutes: 163,
      totalScreenings: combined.length,
      rewatchCount: combined.filter((l) => l.isRewatch).length,
      avgRating,
      isLiked: true,
      isTopFour: false,
      anchorKind: 'duology',
      psychoanalysis: PSYCHOANALYSIS_DB['Bāhubali Duology (The Beginning & The Conclusion)'],
      allTags: Array.from(tagSet),
      lists: combined[0]?.lists || [],
      screenings: combined.map((l) => ({
        id: l.id,
        filmTitle: l.releaseYear === 2015 ? 'Part 1: The Beginning' : 'Part 2: The Conclusion',
        watchedDate: l.watchedDate,
        loggedDate: l.loggedDate,
        rating: l.rating,
        isRewatch: l.isRewatch,
        isImdbBackfill: l.isImdbBackfill,
        review: l.review,
        reviewWordCount: l.reviewWordCount,
        tags: l.tags,
        uri: l.letterboxdUri
      }))
    });
  }

  // 3. Remaining multi-rewatch films & childhood revivals
  byFilm.forEach((logs, key) => {
    if (handledKeys.has(key)) return;
    const hasRewatchFlag = logs.some((l) => l.isRewatch);
    if (logs.length < 2 && !hasRewatchFlag) return;

    const sorted = [...logs].sort((a, b) => a.watchedDate.localeCompare(b.watchedDate));
    const first = sorted[0];
    const rated = sorted.filter((l) => l.rating !== null);
    const avgRating =
      rated.length > 0
        ? Number((rated.reduce((s, l) => s + (l.rating || 0), 0) / rated.length).toFixed(2))
        : 4.2;

    const tagSet = new Set<string>();
    sorted.forEach((l) => l.tags.forEach((t) => tagSet.add(t)));

    // Determine if this is a Childhood / Past-Life Revival:
    // Either logged only once with Rewatch=Yes, OR logged twice where #1 was the unreviewed 2022-10-26 IMDb backfill and #2 was years later
    const isChildhoodRevival =
      sorted.length === 1 ||
      (sorted.length === 2 &&
        sorted[0].isImdbBackfill &&
        !sorted[0].review &&
        sorted[1].watchedDate >= '2024-01-01');

    const anchorKind: RewatchAnchor['anchorKind'] = isChildhoodRevival
      ? 'childhood_revival'
      : 'multi_rewatch';

    anchors.push({
      id: `anchor-${key}`,
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
      anchorKind,
      psychoanalysis: buildPsychoanalysis(first.title, sorted, anchorKind),
      allTags: Array.from(tagSet),
      lists: first.lists,
      screenings: sorted.map((l) => ({
        id: l.id,
        watchedDate: l.watchedDate,
        loggedDate: l.loggedDate,
        rating: l.rating,
        isRewatch: l.isRewatch,
        isImdbBackfill: l.isImdbBackfill,
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

/**
 * Computes both "All-In-One-Go" Series Binge Pills and "Spread-Over-Time" Universe Runs.
 */
export function computeFranchiseArcs(records: FilmRecord[]): FranchiseArc[] {
  const diary = getDatedDiaryRecords(records);

  const pickFilms = (predicate: (r: FilmRecord) => boolean) =>
    diary
      .filter(predicate)
      .sort((a, b) => a.watchedDate.localeCompare(b.watchedDate))
      .map((r) => ({
        title: r.title,
        year: r.releaseYear,
        watchedDate: r.watchedDate,
        rating: r.rating,
        tags: r.tags,
        reviewSnippet: r.review ? r.review.slice(0, 160) + (r.review.length > 160 ? '…' : '') : undefined,
        fullReview: r.review || undefined
      }));

  const buildArc = (
    id: string,
    title: string,
    subtitle: string,
    directorOrCreator: string,
    bingeMode: FranchiseArc['bingeMode'],
    dateSpanLabel: string,
    psychoanalysis: string,
    predicate: (r: FilmRecord) => boolean
  ): FranchiseArc => {
    const films = pickFilms(predicate);
    const unique = new Set(films.map((f) => f.title)).size;
    const rated = films.filter((f) => f.rating !== null);
    const avg =
      rated.length > 0
        ? Number((rated.reduce((s, f) => s + (f.rating || 0), 0) / rated.length).toFixed(2))
        : 4.3;

    return {
      id,
      title,
      subtitle,
      directorOrCreator,
      bingeMode,
      dateSpanLabel,
      totalScreenings: films.length,
      uniqueFilms: unique,
      avgRating: avg,
      psychoanalysis,
      films
    };
  };

  return [
    // ALL-IN-ONE-GO MARATHON PILLS
    buildArc(
      'series-sse',
      'Sapta Sagaradaache Ello (Side A + Side B)',
      'Always Double-Billed · Never One Without The Other',
      'Hemanth M. Rao · Charan Raj',
      'all_in_one_go',
      'Sep 1, 2024 (3 AM) · Mar 5, 2025 · Sep 1–3, 2025',
      'Every single time you touch Side A, you immediately queue Side B right after—even when it was 3 AM on your very first watch. Treating them as one indivisible poem is how you honour Manu’s ten-year devotion.',
      (r) => r.title.startsWith('Sapta Sagaradaache Ello')
    ),
    buildArc(
      'series-before',
      'The Before Trilogy (Sunrise · Sunset · Midnight)',
      '4-Day Valentine’s Week Binge w/ Nadu',
      'Richard Linklater · Ethan Hawke & Julie Delpy',
      'all_in_one_go',
      'Feb 12 – Feb 15, 2025',
      'Having given Before Sunrise a 3★ back in 2022, you came back in February 2025 with Nadu and devoured the entire trilogy in four days—realizing how much you love pure conversational intimacy and confessing on Valentine’s Day (Before Sunset) how deeply Jesse & Céline’s missed connections hit you.',
      (r) => r.title === 'Before Sunrise' || r.title === 'Before Sunset' || r.title === 'Before Midnight'
    ),
    buildArc(
      'series-hp',
      'The "Karry Potturr" 8-Film Wizarding Marathon',
      'Reclaiming British Citizenship Run w/ Niki & Niko',
      'Chris Columbus · Alfonso Cuarón · David Yates',
      'all_in_one_go',
      'Feb 10 – Mar 11, 2025 (All 8 Films)',
      'After falling asleep in the cinema during the May 2024 Prisoner of Azkaban rerelease after work, you locked in for a full month-long 8-movie marathon in early 2025 with Niki and Niko—complete with proud "DID NOT FALL ASLEEP" updates, George’s book lore drops, and absolute devastation over Gary Oldman’s Sirius Black.',
      (r) => r.title.startsWith('Harry Potter')
    ),
    buildArc(
      'series-baahubali',
      'The Bāhubali Crown Duology (Part 1 + Part 2)',
      'Same-Day Back-to-Back Double Feature',
      'S. S. Rajamouli · M. M. Keeravani',
      'all_in_one_go',
      'July 2, 2025 Double Bill',
      'Ten years after release, you sat down on July 2, 2025 and binged both parts back-to-back so fast that you joked in your review you might mix up which scene belonged to which film.',
      (r) => r.title.startsWith('Bāhubali')
    ),

    // SPREAD-OVER-TIME UNIVERSE RUNS
    buildArc(
      'universe-lcu',
      'The Lokesh Kanagaraj & LCU Trajectory',
      'Consumed Across Years as First-Day Theatre Events',
      'Lokesh Kanagaraj · Anirudh Ravichander',
      'spread_over_time',
      '2021 – 2025 (Maanagaram · Kaithi · Master · Vikram · Leo · Coolie)',
      'Unlike series you binged in a weekend, Lokesh’s filmography has been a multi-year companion across your teenage and uni years—experienced in loud cinema halls with friends, dissecting weak second-half flashbacks vs peak first-half Anirudh adrenaline.',
      (r) => r.director === 'Lokesh Kanagaraj'
    ),
    buildArc(
      'universe-tdk',
      'The Dark Knight & Gotham Trilogy',
      'Watched Across Distinct Life Chapters (Plus Matt Reeves’ The Batman & The Penguin)',
      'Christopher Nolan · Matt Reeves',
      'spread_over_time',
      '2021 – 2024',
      'The Dark Knight was your original #1 most-rewatched movie before La La Land dethroned it. Rather than binging Batman in one sitting, you return to Gotham across years—culminating in your 5★ obsession with The Penguin in late 2024.',
      (r) =>
        r.title === 'Batman Begins' ||
        r.title === 'The Dark Knight' ||
        r.title === 'The Dark Knight Rises' ||
        r.title === 'The Batman' ||
        r.title === 'The Penguin' ||
        r.title === 'The Lego Batman Movie'
    ),
    buildArc(
      'universe-spiderman',
      'The Spider-Man & Spider-Verse Multiverse',
      'Every Era of Peter Parker & Miles Morales',
      'Sam Raimi · Marc Webb · Jon Watts · Lord & Miller',
      'spread_over_time',
      '2021 – 2023 (9 Films)',
      'From Tobey Maguire and Andrew Garfield to No Way Home and the visual euphoria of Into/Across the Spider-Verse, Spider-Man is the one superhero thread woven through your entire archive.',
      (r) => r.title.includes('Spider-Man') || r.title.includes('Spider-Verse')
    )
  ];
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
