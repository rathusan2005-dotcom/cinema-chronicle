export interface RawPlayActivity {
  'Apple Identifier'?: string;
  'Apple Music Subscription'?: string;
  'Artist Name'?: string;
  'Container Description'?: string;
  'Container Id'?: string;
  'Container Type'?: string;
  'Device Type'?: string;
  'End Position In Milliseconds'?: string | number;
  'Event End Timestamp'?: string;
  'Event Reason Hint Type'?: string;
  'Event Received Timestamp'?: string;
  'Event Start Timestamp'?: string;
  'Event Type'?: string;
  'Feature Name'?: string;
  'Genre'?: string;
  'Item Added To Library Date'?: string;
  'Media Duration In Milliseconds'?: string | number;
  'Play Duration Milliseconds'?: string | number;
  'Song Name'?: string;
  'Source Type'?: string;
  'UTC Offset In Seconds'?: string | number;
  [key: string]: any;
}

export interface PlayRecord {
  id: string;
  trackName: string;
  artistName: string;
  albumName?: string;
  genre: string;
  timestamp: Date;
  playDurationMs: number;
  mediaDurationMs: number;
  endReason: string;
  containerType?: string;
  containerName?: string;
  sourceMode?: 'album' | 'playlist' | 'search' | 'radio';
  isSleepPlay: boolean;
  isNightPlay: boolean;
  isSkipped: boolean;
  coverUrl?: string;
}

export interface CleanserConfig {
  purgeSleepPlaylists: boolean;
  purgeNightHours: boolean;
  nightStartHour: number; // e.g., 23.5 (11:30 PM)
  nightEndHour: number;   // e.g., 7.0 (7:00 AM)
  minPlaySeconds: number; // e.g., 10 seconds
  customSleepKeywords: string[];
}

export type TimeResolution = 'all' | 'year' | 'month' | 'week' | 'day';

export interface SonicCurrent {
  id: string;
  name: string;
  shortName: string;
  color: string;
  secondaryColor: string;
  description: string;
  anchorArtists: string[];
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
  totalPlays: number;
  topArtists: string[];
  narrative: string;
}

export interface SonicEra {
  id: string;
  name: string;
  subtitle: string;
  timeRange: string;
  startDate: string;
  endDate: string;
  color: string;
  gradient: string;
  description: string;
  keyArtists: string[];
  vibeTags: string[];
  icon: string;
}

export interface DiscographyRelease {
  albumName: string;
  plays: number;
  minutes: number;
  coverUrl?: string;
  firstPlayedInAlbum?: string;
}

export interface DiscoverySpike {
  artistName: string;
  firstTrack: string; // Gateway track
  firstPlayedDate: Date;
  albumCover?: string;
  playsNext7Days: number;
  playsNext14Days: number;
  playsNext30Days: number;
  bingeVelocityScore: number; // 0 - 100
  notes?: string;
  
  // Detailed Lifecycle Dossier (Artist Deep Dive)
  allTimeCrownTrack: string;
  allTimePlays: number;
  allTimeMinutes: number;
  peakMonth: string;                 // e.g. "October 2024"
  peakMonthShareOfEar: number;        // e.g. 38.4% of total listening that month
  daysToSecondRelease: number;        // e.g. 2 days before exploring another project
  patternType: 'Flashfire Binge' | 'Seasonal Wave' | 'Permanent Anchor';
  discographySpread: DiscographyRelease[];
  trajectoryCurve: number[];          // 30-day cumulative play trajectory
}

export interface CircadianHourCell {
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  hour: number;      // 0 to 23
  plays: number;
  totalMinutes: number;
  dominantGenre: string;
  topArtist: string;
}

export interface ComfortAlbum {
  albumName: string;
  artistName: string;
  coverUrl: string;
  totalPlays: number;
  totalMinutes: number;
  topTrack: string;
  highStressSpikePeriod: string;
  emotionalTag: string;
  repeatRatio: number; // repeats per session
}

export interface LoopObsession {
  trackName: string;
  artistName: string;
  albumName?: string;
  coverUrl?: string;
  date: string;
  loopCount24h: number;
  totalMinutes24h: number;
  consecutiveStreak?: number;
  personalMeaning?: string;
}

export interface UserPersonalNote {
  id: string;
  itemType: 'track' | 'album' | 'artist';
  title: string;
  artist: string;
  meaningNote: string;
  evokedEmotion: string;
  updatedAt: string;
}

export interface RepeatLeaderboardItem {
  name: string;
  artist: string;
  album?: string;
  coverUrl?: string;
  plays: number;
  minutes: number;
  repeatRatio: number; // repeats per listening day
  peakDayLoops: number;
  personalNote?: string;
}

export interface DormantBanger {
  id: string;
  trackName: string;
  artistName: string;
  albumName?: string;
  coverUrl?: string;
  peakPeriodLabel: string; // e.g. "Oct 2021"
  peakPlaysInMonth: number;
  lastPlayedDate: Date;
  daysInHibernation: number;
  totalHistoricalPlays: number;
  eraName: string;
  eraColor: string;
}
