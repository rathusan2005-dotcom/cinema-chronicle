export interface FilmRecord {
  id: string;
  title: string;
  releaseYear: number;
  releaseDecade: string; // '2020s' | '2010s' | '2000s' | '1990s' | 'Classic ≤80s'
  director: string;
  language: string;
  movement: string;
  runtimeMinutes: number;
  watchedDate: string; // YYYY-MM-DD
  loggedDate: string;  // YYYY-MM-DD
  timestamp: Date;
  rating: number | null; // 0.5 to 5.0
  isRewatch: boolean;
  isLiked: boolean;      // Hearted in likes/films.csv
  isDiaryLogged: boolean; // True if in diary.csv/reviews.csv, false if catalog-only watched.csv
  isImdbBackfill: boolean; // True if logged on or before 2022-10-26 (the IMDb migration dump)
  review: string;
  reviewWordCount: number;
  tags: string[];
  lists: string[];
  letterboxdUri: string;
}

export interface CuratedListItem {
  position: number;
  title: string;
  year: number;
  url: string;
  note: string;
  rating: number | null;
  isWatched: boolean;
  isLiked: boolean;
  director: string;
}

export interface CuratedList {
  id: string;
  name: string;
  createdDate: string;
  url: string;
  description: string;
  items: CuratedListItem[];
}

export interface CommentRecord {
  id: string;
  date: string;
  contentUrl: string;
  comment: string;
  wordCount: number;
}

export interface WatchlistRecord {
  dateAdded: string;
  title: string;
  year: number;
  uri: string;
  director: string;
  language: string;
  movement: string;
}

export interface RathProfile {
  username: string;
  givenName: string;
  dateJoined: string;
  location: string;
  bio: string;
  pronoun: string;
  favoriteFilms: {
    title: string;
    year: number;
    director: string;
    uri: string;
    screenings: number;
    rating: number;
    tagline: string;
  }[];
}

export interface ArchiveStats {
  totalBoxdFilms: number;       // All 477 unique films on Letterboxd
  totalDiaryScreenings: number; // 484 dated diary logs
  imdbBackfillCount: number;    // 177 films from the Oct 26, 2022 IMDb migration
  organicBoxdCount: number;     // 307 organic post-migration logs
  totalHoursWatched: number;
  totalWrittenReviews: number;
  totalReviewWords: number;
  totalRewatchScreenings: number;
  totalLikedFilms: number;
  avgRating: number;
  fiveStarCount: number;
}

export type TimeResolution = 'all' | 'year' | 'month' | 'week' | 'day';

export interface CinemaCurrent {
  id: string;
  name: string;
  shortName: string;
  color: string;
  secondaryColor: string;
  description: string;
  anchorDirectors: string[];
}

export interface EmergentEra {
  id: string;
  roman: string;
  title: string;
  periodLabel: string;
  dominantCurrents: {
    currentId: string;
    name: string;
    sharePct: number;
    color: string;
  }[];
  totalHours: number;
  totalFilms: number;
  totalReviews: number;
  avgRating: number;
  topFilms: string[];
  narrative: string;
}

export interface DirectorFilmLog {
  id: string;
  title: string;
  year: number;
  watchedDate: string;
  rating: number | null;
  isRewatch: boolean;
  isLiked: boolean;
  hasReview: boolean;
  reviewSnippet?: string;
  fullReview?: string;
  tags: string[];
}

export interface DirectorDossier {
  director: string;
  primaryMovement: string;
  primaryLanguage: string;
  gatewayFilm: string;
  gatewayYear: number;
  gatewayDate: string;
  gatewayRating: number | null;
  crownFilm: string;
  crownYear: number;
  crownRating: number;
  totalScreenings: number;
  uniqueFilmsWatched: number;
  totalHours: number;
  avgRating: number;
  likedCount: number;
  reviewCount: number;
  bingeVelocityScore: number; // 0 - 100
  daysToSecondFilm: number;
  peakMonth: string;
  patternType: 'Auteur Obsession' | 'Comfort Pillar' | 'Marathon Binge';
  psychoanalysis: string;
  filmographyLogs: DirectorFilmLog[];
  trajectoryCurve: number[];
}

export interface RewatchScreening {
  id: string;
  filmTitle?: string;
  watchedDate: string;
  loggedDate: string;
  rating: number | null;
  isRewatch: boolean;
  isImdbBackfill: boolean;
  review: string;
  reviewWordCount: number;
  tags: string[];
  uri: string;
}

export interface RewatchAnchor {
  id: string;
  title: string;
  subtitle?: string;
  year: number;
  director: string;
  language: string;
  movement: string;
  runtimeMinutes: number;
  totalScreenings: number;
  rewatchCount: number;
  avgRating: number;
  isLiked: boolean;
  isTopFour: boolean;
  anchorKind: 'multi_rewatch' | 'duology' | 'childhood_revival';
  psychoanalysis: string;
  allTags: string[];
  lists: string[];
  screenings: RewatchScreening[];
}

export interface FranchiseArc {
  id: string;
  title: string;
  subtitle: string;
  directorOrCreator: string;
  bingeMode: 'all_in_one_go' | 'spread_over_time';
  dateSpanLabel: string;
  totalScreenings: number;
  uniqueFilms: number;
  avgRating: number;
  psychoanalysis: string;
  films: {
    title: string;
    year: number;
    watchedDate: string;
    rating: number | null;
    tags: string[];
    reviewSnippet?: string;
    fullReview?: string;
  }[];
}

export interface UserPersonalNote {
  id: string;
  itemType: 'film' | 'director' | 'review';
  title: string;
  subtitle: string;
  meaningNote: string;
  evokedEmotion: string;
  updatedAt: string;
}
