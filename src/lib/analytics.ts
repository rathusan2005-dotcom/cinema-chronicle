import { PlayRecord, CircadianHourCell, DiscoverySpike, LoopObsession, ComfortAlbum, EmergentEra, DormantBanger } from '../types';
import { SONIC_ERAS, SONIC_CURRENTS } from './mockData';

export interface StreamTimePoint {
  key: string;            // e.g. "2024-10" or "2024 Q4"
  label: string;          // e.g. "Oct 2024" or "2024 Q4"
  shortLabel: string;     // e.g. "Oct '24" or "Q4 '24"
  year: number;
  month?: number;         // 1-12
  quarter?: number;       // 1-4
  totalValue: number;     // minutes or plays
  eraValues: { [currentId: string]: number };
  rawCurrentValues: { [currentId: string]: number };
  eraPercentages: { [currentId: string]: number };
  activeCurrentIds: string[];
  dominantEraId: string;
  secondaryEraId: string;
  topArtist: string;
  isCrossover?: boolean;
  crossoverText?: string;
}

interface RiverBucket {
  totalMinutes: number;
  totalPlays: number;
  topArtistsMinutes: { [artist: string]: number };
  topArtistsPlays: { [artist: string]: number };
  erasMinutes: { [currentId: string]: number };
  erasPlays: { [currentId: string]: number };
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Resolves a PlayRecord into a pure SonicCurrent ID.
 * Separates Tamil Indie Soul/R&B (Akshara, Bebhumika) from Tamil Rap/Drill (JanZee, IFT PROD),
 * and merges redundant Apple Music tags (e.g. "Hip-Hop/Rap" == "Hip Hop") while respecting
 * sensitivity mode ('strict' | 'balanced' | 'broad').
 */
export function resolveSonicCurrent(
  r: PlayRecord,
  sensitivity: 'strict' | 'balanced' | 'broad' = 'balanced'
): string {
  const artistLower = r.artistName.toLowerCase();
  const trackLower = r.trackName.toLowerCase();
  const genreLower = (r.genre || '').toLowerCase();
  const playlistLower = (r.containerName || '').toLowerCase();

  // 1. Check 3D / Spatial / Slowed / Reverb Mix indicators first
  if (
    trackLower.includes('3d') ||
    trackLower.includes('8d') ||
    trackLower.includes('slowed') ||
    trackLower.includes('reverb') ||
    artistLower.includes('3d') ||
    playlistLower.includes('3d')
  ) {
    return sensitivity === 'broad' ? 'current-cinema' : 'current-remix';
  }

  // 2. Direct Artist Affinity Match against SONIC_CURRENTS
  for (const current of SONIC_CURRENTS) {
    if (current.anchorArtists.some((ka: string) => artistLower.includes(ka.toLowerCase()) || ka.toLowerCase().includes(artistLower))) {
      if (sensitivity === 'broad') {
        if (current.id === 'current-tamil-soul') return 'current-rnb';
        if (current.id === 'current-tamil-rap') return 'current-hiphop';
      }
      return current.id;
    }
  }

  // 3. Fuzzy Genre & Playlist Normalization
  if (genreLower.includes('hip-hop') || genreLower.includes('hip hop') || genreLower.includes('rap') || genreLower.includes('drill')) {
    if (genreLower.includes('tamil') || playlistLower.includes('tamil')) {
      return sensitivity === 'broad' ? 'current-hiphop' : 'current-tamil-rap';
    }
    return 'current-hiphop';
  }
  if (genreLower.includes('r&b') || genreLower.includes('soul')) {
    if (genreLower.includes('tamil') || playlistLower.includes('tamil')) {
      return sensitivity === 'broad' ? 'current-rnb' : 'current-tamil-soul';
    }
    return 'current-rnb';
  }
  if (genreLower.includes('sufi') || genreLower.includes('qawwali') || genreLower.includes('urdu') || genreLower.includes('devotional')) {
    return 'current-sufi';
  }
  if (genreLower.includes('jazz') || genreLower.includes('bossa')) {
    return 'current-jazz';
  }
  if (genreLower.includes('tamil') || genreLower.includes('kollywood') || genreLower.includes('indian') || genreLower.includes('soundtrack')) {
    return 'current-cinema';
  }

  return 'current-rnb';
}

export function computeRiverStreamData(
  records: PlayRecord[],
  granularity: 'monthly' | 'quarterly' = 'monthly',
  metric: 'minutes' | 'plays' = 'minutes',
  maxActiveCurrents: number = 4,
  sensitivity: 'strict' | 'balanced' | 'broad' = 'balanced'
): StreamTimePoint[] {
  const map: { [key: string]: RiverBucket } = {};

  records.forEach(r => {
    const d = r.timestamp;
    const year = d.getFullYear();
    const month = d.getMonth(); // 0-11
    const quarter = Math.floor(month / 3) + 1;

    let key = '';
    if (granularity === 'monthly') {
      const mStr = String(month + 1).padStart(2, '0');
      key = `${year}-${mStr}`;
    } else {
      key = `${year} Q${quarter}`;
    }

    if (!map[key]) {
      const emptyCurrents: { [id: string]: number } = {};
      SONIC_CURRENTS.forEach(c => { emptyCurrents[c.id] = 0; });
      map[key] = {
        totalMinutes: 0,
        totalPlays: 0,
        topArtistsMinutes: {},
        topArtistsPlays: {},
        erasMinutes: { ...emptyCurrents },
        erasPlays: { ...emptyCurrents }
      };
    }

    const mins = r.playDurationMs / (1000 * 60);
    map[key].totalMinutes += mins;
    map[key].totalPlays += 1;

    map[key].topArtistsMinutes[r.artistName] = (map[key].topArtistsMinutes[r.artistName] || 0) + mins;
    map[key].topArtistsPlays[r.artistName] = (map[key].topArtistsPlays[r.artistName] || 0) + 1;

    const currentId = resolveSonicCurrent(r, sensitivity);
    map[key].erasMinutes[currentId] = (map[key].erasMinutes[currentId] || 0) + mins;
    map[key].erasPlays[currentId] = (map[key].erasPlays[currentId] || 0) + 1;
  });

  // Sort keys chronologically
  const sortedKeys = Object.keys(map).sort();

  let previousDominantEra = '';

  const timePoints: StreamTimePoint[] = sortedKeys.map(key => {
    const bucket = map[key];
    const isMonthly = granularity === 'monthly';

    let year = 2020;
    let monthNum: number | undefined;
    let quarterNum: number | undefined;
    let label = '';
    let shortLabel = '';

    if (isMonthly) {
      const [y, m] = key.split('-').map(Number);
      year = y;
      monthNum = m;
      label = `${MONTH_NAMES[m - 1]} ${y}`;
      shortLabel = `${MONTH_NAMES[m - 1]} '${String(y).slice(2)}`;
    } else {
      const [yStr, qPart] = key.split(' Q');
      year = Number(yStr);
      quarterNum = Number(qPart);
      label = `${year} Q${quarterNum}`;
      shortLabel = `Q${quarterNum} '${String(year).slice(2)}`;
    }

    const totalVal = metric === 'minutes' ? Math.round(bucket.totalMinutes) : bucket.totalPlays;
    const eraSrc = metric === 'minutes' ? bucket.erasMinutes : bucket.erasPlays;

    const rawCurrentValues: { [currentId: string]: number } = {};
    for (const current of SONIC_CURRENTS) {
      rawCurrentValues[current.id] = Math.round(eraSrc[current.id] || 0);
    }

    // Sort currents by volume in this window to apply Top N Saliency Filter
    const rankedCurrents = [...SONIC_CURRENTS]
      .map(c => ({ id: c.id, val: rawCurrentValues[c.id] || 0 }))
      .sort((a, b) => b.val - a.val);

    const topN = rankedCurrents.slice(0, maxActiveCurrents);
    const activeCurrentIds = topN.filter(x => x.val > 0).map(x => x.id);

    const dominantEraId = rankedCurrents[0]?.id || 'current-rnb';
    const secondaryEraId = rankedCurrents[1]?.id || dominantEraId;

    // Fold residual currents outside Top N into the dominant current so total height stays truthful
    // while keeping at most maxActiveCurrents distinct ribbons visible in this slice
    const eraValues: { [currentId: string]: number } = {};
    const eraPercentages: { [currentId: string]: number } = {};

    let residualSum = 0;
    for (let i = maxActiveCurrents; i < rankedCurrents.length; i++) {
      residualSum += rankedCurrents[i].val;
    }

    for (const current of SONIC_CURRENTS) {
      const isTopN = topN.some(t => t.id === current.id);
      if (isTopN) {
        eraValues[current.id] = rawCurrentValues[current.id] + (current.id === dominantEraId ? residualSum : 0);
      } else {
        eraValues[current.id] = 0;
      }
    }

    const sumEraVals = Object.values(rawCurrentValues).reduce((a, b) => a + b, 0) || 1;
    for (const current of SONIC_CURRENTS) {
      eraPercentages[current.id] = Math.round(((rawCurrentValues[current.id] || 0) / sumEraVals) * 100);
    }

    // Top artist
    const artistSrc = metric === 'minutes' ? bucket.topArtistsMinutes : bucket.topArtistsPlays;
    let topArtist = 'None';
    let topArtistVal = -1;
    for (const [art, val] of Object.entries(artistSrc)) {
      if (val > topArtistVal) {
        topArtistVal = val;
        topArtist = art;
      }
    }

    // Check for Crossover event
    let isCrossover = false;
    let crossoverText = '';
    if (previousDominantEra && previousDominantEra !== dominantEraId) {
      const oldCurrent = SONIC_CURRENTS.find(e => e.id === previousDominantEra)?.name || '';
      const newCurrent = SONIC_CURRENTS.find(e => e.id === dominantEraId)?.name || '';
      isCrossover = true;
      crossoverText = `${newCurrent} overtook ${oldCurrent}`;
    }
    previousDominantEra = dominantEraId;

    return {
      key,
      label,
      shortLabel,
      year,
      month: monthNum,
      quarter: quarterNum,
      totalValue: totalVal,
      eraValues,
      rawCurrentValues,
      eraPercentages,
      activeCurrentIds,
      dominantEraId,
      secondaryEraId,
      topArtist,
      isCrossover,
      crossoverText
    };
  });

  return timePoints;
}

/**
 * Dynamically computes the 4 Emergent Life Eras from the actual co-dominant
 * Sonic Currents in each chronological period.
 */
export function computeEmergentEras(
  records: PlayRecord[],
  sensitivity: 'strict' | 'balanced' | 'broad' = 'balanced'
): EmergentEra[] {
  const chapterWindows = [
    {
      id: 'chapter-1',
      roman: 'I',
      periodLabel: '2020 – 2021',
      filter: (r: PlayRecord) => r.timestamp.getFullYear() <= 2021
    },
    {
      id: 'chapter-2',
      roman: 'II',
      periodLabel: '2022 – Mid 2024',
      filter: (r: PlayRecord) => {
        const y = r.timestamp.getFullYear();
        const m = r.timestamp.getMonth();
        return y >= 2022 && (y < 2024 || (y === 2024 && m < 7));
      }
    },
    {
      id: 'chapter-3',
      roman: 'III',
      periodLabel: 'Late 2024',
      filter: (r: PlayRecord) => r.timestamp.getFullYear() === 2024 && r.timestamp.getMonth() >= 7
    },
    {
      id: 'chapter-4',
      roman: 'IV',
      periodLabel: '2025 – 2026',
      filter: (r: PlayRecord) => r.timestamp.getFullYear() >= 2025
    }
  ];

  return chapterWindows.map(win => {
    const slice = records.filter(win.filter);
    let totalMinutes = 0;
    const currentMinutes: { [id: string]: number } = {};
    const artistMinutes: { [artist: string]: number } = {};

    slice.forEach(r => {
      const mins = r.playDurationMs / 60000;
      totalMinutes += mins;
      const cid = resolveSonicCurrent(r, sensitivity);
      currentMinutes[cid] = (currentMinutes[cid] || 0) + mins;
      artistMinutes[r.artistName] = (artistMinutes[r.artistName] || 0) + mins;
    });

    const ranked = SONIC_CURRENTS
      .map(c => ({
        current: c,
        mins: currentMinutes[c.id] || 0,
        sharePct: totalMinutes > 0 ? Math.round(((currentMinutes[c.id] || 0) / totalMinutes) * 100) : 0
      }))
      .sort((a, b) => b.mins - a.mins);

    const first = ranked[0] || { current: SONIC_CURRENTS[0], sharePct: 50 };
    const second = ranked[1] || { current: SONIC_CURRENTS[1], sharePct: 25 };
    const third = ranked[2];

    const topArtists = Object.entries(artistMinutes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name]) => name);

    const dominantCurrents = [
      { currentId: first.current.id, name: first.current.name, sharePct: first.sharePct, color: first.current.color },
      { currentId: second.current.id, name: second.current.name, sharePct: second.sharePct, color: second.current.color }
    ];
    if (third && third.sharePct >= 12) {
      dominantCurrents.push({
        currentId: third.current.id,
        name: third.current.name,
        sharePct: third.sharePct,
        color: third.current.color
      });
    }

    return {
      id: win.id,
      roman: win.roman,
      title: `${first.current.shortName} × ${second.current.shortName}`,
      periodLabel: win.periodLabel,
      dominantCurrents,
      totalHours: Math.round(totalMinutes / 60),
      totalPlays: slice.length,
      topArtists,
      narrative: `Defined by a ${first.sharePct}% surge in ${first.current.name} alongside ${second.sharePct}% ${second.current.name}.`
    };
  });
}

export interface QuarterData {
  quarterKey: string;
  label: string;
  year: number;
  quarter: number;
  totalMinutes: number;
  eraDistribution: { [eraId: string]: number };
  topArtist: string;
}

export function computeQuarterlyStreamgraph(records: PlayRecord[]): QuarterData[] {
  // Backwards compatibility helper
  const streamData = computeRiverStreamData(records, 'quarterly', 'minutes');
  return streamData.map(d => ({
    quarterKey: d.key,
    label: d.label,
    year: d.year,
    quarter: d.quarter || 1,
    totalMinutes: d.totalValue,
    eraDistribution: d.eraValues,
    topArtist: d.topArtist
  }));
}

export function computeCircadianMatrix(records: PlayRecord[]): CircadianHourCell[] {
  // 7 days x 24 hours
  const matrix: { [key: string]: { plays: number; minutes: number; genres: { [g: string]: number }; artists: { [a: string]: number } } } = {};

  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      matrix[`${d}-${h}`] = { plays: 0, minutes: 0, genres: {}, artists: {} };
    }
  }

  records.forEach(r => {
    const day = r.timestamp.getDay(); // 0 = Sun, 6 = Sat
    const hour = r.timestamp.getHours();
    const key = `${day}-${hour}`;

    if (matrix[key]) {
      const mins = r.playDurationMs / (1000 * 60);
      matrix[key].plays += 1;
      matrix[key].minutes += mins;
      matrix[key].genres[r.genre] = (matrix[key].genres[r.genre] || 0) + 1;
      matrix[key].artists[r.artistName] = (matrix[key].artists[r.artistName] || 0) + 1;
    }
  });

  const cells: CircadianHourCell[] = [];
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      const data = matrix[`${d}-${h}`];
      
      let dominantGenre = 'Acoustic';
      let maxG = -1;
      for (const [g, count] of Object.entries(data.genres)) {
        if (count > maxG) {
          maxG = count;
          dominantGenre = g;
        }
      }

      let topArtist = 'None';
      let maxA = -1;
      for (const [a, count] of Object.entries(data.artists)) {
        if (count > maxA) {
          maxA = count;
          topArtist = a;
        }
      }

      cells.push({
        dayOfWeek: d,
        hour: h,
        plays: data.plays,
        totalMinutes: Math.round(data.minutes),
        dominantGenre,
        topArtist
      });
    }
  }

  return cells;
}

export function computeDynamicDiscoverySpikes(records: PlayRecord[]): DiscoverySpike[] {
  // Map of artist -> first seen date and first track
  const firstContactMap: { [artist: string]: { date: Date; track: string; cover?: string } } = {};
  
  // Chronological order
  const sorted = [...records].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  sorted.forEach(r => {
    if (!firstContactMap[r.artistName]) {
      firstContactMap[r.artistName] = {
        date: r.timestamp,
        track: r.trackName,
        cover: r.coverUrl
      };
    }
  });

  const spikes: DiscoverySpike[] = [];

  for (const [artist, contact] of Object.entries(firstContactMap)) {
    const contactTime = contact.date.getTime();
    const ms7Days = 7 * 24 * 60 * 60 * 1000;
    const ms14Days = 14 * 24 * 60 * 60 * 1000;
    const ms30Days = 30 * 24 * 60 * 60 * 1000;

    let p7 = 0;
    let p14 = 0;
    let p30 = 0;

    sorted.forEach(r => {
      if (r.artistName === artist) {
        const diff = r.timestamp.getTime() - contactTime;
        if (diff >= 0 && diff <= ms7Days) p7++;
        if (diff >= 0 && diff <= ms14Days) p14++;
        if (diff >= 0 && diff <= ms30Days) p30++;
      }
    });

    if (p30 >= 8) {
      // Calculate binge velocity index (0 to 100)
      const rawScore = (p7 * 2.5) + (p14 * 1.2) + p30;
      const bingeVelocityScore = Math.min(100, Math.round(rawScore / 3.5));

      // Compute discography spread and crown track
      const albumCounts: { [alb: string]: { plays: number; minutes: number; cover?: string } } = {};
      const trackCounts: { [trk: string]: number } = {};
      const monthCounts: { [m: string]: { artistMins: number; totalMins: number } } = {};
      let allTimePlays = 0;
      let allTimeMinutes = 0;

      sorted.forEach(r => {
        const mKey = `${r.timestamp.getFullYear()}-${r.timestamp.getMonth() + 1}`;
        if (!monthCounts[mKey]) monthCounts[mKey] = { artistMins: 0, totalMins: 0 };
        const durationMin = r.playDurationMs / (1000 * 60);
        monthCounts[mKey].totalMins += durationMin;

        if (r.artistName === artist) {
          allTimePlays++;
          allTimeMinutes += durationMin;
          trackCounts[r.trackName] = (trackCounts[r.trackName] || 0) + 1;
          const albName = r.albumName || 'Singles / EPs';
          if (!albumCounts[albName]) albumCounts[albName] = { plays: 0, minutes: 0, cover: r.coverUrl };
          albumCounts[albName].plays++;
          albumCounts[albName].minutes += durationMin;
          monthCounts[mKey].artistMins += durationMin;
        }
      });

      // Crown track
      let allTimeCrownTrack = contact.track;
      let maxTrk = 0;
      for (const [t, c] of Object.entries(trackCounts)) {
        if (c > maxTrk) {
          maxTrk = c;
          allTimeCrownTrack = t;
        }
      }

      // Peak month & Share of ear
      let peakMonth = 'Unknown';
      let peakShare = 0;
      for (const [m, counts] of Object.entries(monthCounts)) {
        if (counts.totalMins > 0) {
          const share = (counts.artistMins / counts.totalMins) * 100;
          if (share > peakShare) {
            peakShare = Math.round(share * 10) / 10;
            const [y, mo] = m.split('-').map(Number);
            peakMonth = `${MONTH_NAMES[mo - 1]} ${y}`;
          }
        }
      }

      // Discography spread
      const discographySpread = Object.entries(albumCounts)
        .map(([albumName, d]) => ({ albumName, plays: d.plays, minutes: Math.round(d.minutes), coverUrl: d.cover }))
        .sort((a, b) => b.plays - a.plays);

      // Trajectory curve (first 30 days)
      const trajectoryCurve: number[] = [p7, p14, p30];

      spikes.push({
        artistName: artist,
        firstTrack: contact.track,
        firstPlayedDate: contact.date,
        albumCover: contact.cover,
        playsNext7Days: p7,
        playsNext14Days: p14,
        playsNext30Days: p30,
        bingeVelocityScore,
        allTimeCrownTrack,
        allTimePlays,
        allTimeMinutes: Math.round(allTimeMinutes),
        peakMonth,
        peakMonthShareOfEar: peakShare,
        daysToSecondRelease: discographySpread.length > 1 ? 4 : 0,
        patternType: bingeVelocityScore > 90 ? 'Flashfire Binge' : 'Permanent Anchor',
        discographySpread,
        trajectoryCurve
      });
    }
  }

  // Sort by binge velocity score descending
  return spikes.sort((a, b) => b.bingeVelocityScore - a.bingeVelocityScore);
}

export function computeLoopObsessions(records: PlayRecord[]): LoopObsession[] {
  // Group by Track and 24h day string
  const map: { [key: string]: { track: string; artist: string; cover?: string; date: string; count: number; minutes: number } } = {};

  records.forEach(r => {
    const dateStr = r.timestamp.toISOString().split('T')[0];
    const key = `${dateStr}:::${r.artistName}:::${r.trackName}`;

    if (!map[key]) {
      map[key] = {
        track: r.trackName,
        artist: r.artistName,
        cover: r.coverUrl,
        date: dateStr,
        count: 0,
        minutes: 0
      };
    }

    map[key].count += 1;
    map[key].minutes += r.playDurationMs / (1000 * 60);
  });

  const obsessions: LoopObsession[] = [];
  for (const item of Object.values(map)) {
    if (item.count >= 6) { // Looped 6+ times in a single day
      obsessions.push({
        trackName: item.track,
        artistName: item.artist,
        coverUrl: item.cover,
        date: item.date,
        loopCount24h: item.count,
        totalMinutes24h: Math.round(item.minutes)
      });
    }
  }

  return obsessions.sort((a, b) => b.loopCount24h - a.loopCount24h);
}

export function computeRepeatLeaderboard(
  records: PlayRecord[],
  dimension: 'tracks' | 'albums' | 'artists',
  yearFilter: 'all' | number = 'all'
) {
  const filtered = yearFilter === 'all'
    ? records
    : records.filter(r => r.timestamp.getFullYear() === yearFilter);

  const groups: {
    [key: string]: {
      name: string;
      artist: string;
      album?: string;
      coverUrl?: string;
      plays: number;
      minutes: number;
      days: Set<string>;
      dayLoopCounts: { [d: string]: number };
    };
  } = {};

  filtered.forEach(r => {
    let key = '';
    let name = '';
    let artist = r.artistName;
    let album = r.albumName;
    let cover = r.coverUrl;

    if (dimension === 'tracks') {
      key = `${r.artistName}:::${r.trackName}`;
      name = r.trackName;
    } else if (dimension === 'albums') {
      key = `${r.artistName}:::${r.albumName || 'Singles'}`;
      name = r.albumName || 'Singles / EPs';
    } else {
      key = r.artistName;
      name = r.artistName;
    }

    if (!groups[key]) {
      groups[key] = {
        name,
        artist,
        album,
        coverUrl: cover,
        plays: 0,
        minutes: 0,
        days: new Set(),
        dayLoopCounts: {}
      };
    }

    const dStr = r.timestamp.toISOString().split('T')[0];
    groups[key].plays += 1;
    groups[key].minutes += r.playDurationMs / (1000 * 60);
    groups[key].days.add(dStr);
    groups[key].dayLoopCounts[dStr] = (groups[key].dayLoopCounts[dStr] || 0) + 1;
    if (!groups[key].coverUrl && r.coverUrl) {
      groups[key].coverUrl = r.coverUrl;
    }
  });

  return Object.values(groups)
    .map(g => {
      const peakDayLoops = Math.max(...Object.values(g.dayLoopCounts), 1);
      const uniqueDays = Math.max(g.days.size, 1);
      const repeatRatio = Math.round((g.plays / uniqueDays) * 10) / 10;

      return {
        name: g.name,
        artist: g.artist,
        album: g.album,
        coverUrl: g.coverUrl,
        plays: g.plays,
        minutes: Math.round(g.minutes),
        repeatRatio,
        peakDayLoops
      };
    })
    .sort((a, b) => b.plays - a.plays);
}

export interface CrossGenreRecommendation {
  id: string;
  title: string;
  artist: string;
  album: string;
  genreIntersection: string[];
  description: string;
  vibeScore: number;
  coverUrl?: string;
  spotifyOrAppleQuery: string;
}

export const CROSS_GENRE_RECOMMENDATIONS: CrossGenreRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Nee Kavithaigala (Acoustic Unplugged)',
    artist: 'Pradeep Kumar & Sean Roldan',
    album: 'Maragadha Naanayam',
    genreIntersection: ['Acoustic Folk', 'Vocal Jazz Phrasing', 'Tamil Cinema'],
    description: 'Bridges Laufey’s intimate close-mic vocal jazz aesthetic with earthy Carnatic microtonal acoustic guitar improvisation.',
    vibeScore: 97,
    coverUrl: '/covers/Gayathri Krishnan - Arunachala.jpg',
    spotifyOrAppleQuery: 'Pradeep Kumar Nee Kavithaigala'
  },
  {
    id: 'rec-2',
    title: 'Pookal Pookum (Midnight Velvet Re-Imagining)',
    artist: 'GV Prakash & Haricharan',
    album: 'Madrasapattinam',
    genreIntersection: ['SiR Neo-Soul Swells', 'Laufey Orchestral Strings', 'Tamil Period OST'],
    description: 'Lush harp plucks and vintage cinematic horn swells that hit the same emotional nerve as Laufey’s "Promise" and SiR’s "John Redcorn".',
    vibeScore: 95,
    coverUrl: '/covers/3 - OST _Moonu_.jpg',
    spotifyOrAppleQuery: 'Pookal Pookum Madrasapattinam'
  },
  {
    id: 'rec-3',
    title: 'Moongil Thottam (Late Night Rain Rework)',
    artist: 'A.R. Rahman & Abhay Jodhpurkar',
    album: 'Kadal',
    genreIntersection: ['Atmospheric R&B', 'Ambient Tamil Acoustic', 'Introspective Melancholy'],
    description: 'Water drops, deep sub-bass frequencies, and breathy falsettos matching Brent Faiyaz’s minimalist nocturnal soundstage.',
    vibeScore: 94,
    coverUrl: '/covers/Frank Ocean - Blonde.jpg',
    spotifyOrAppleQuery: 'Moongil Thottam Kadal AR Rahman'
  },
  {
    id: 'rec-4',
    title: 'Kanne Kalaimaane (Lo-Fi Jazz Cello Cut)',
    artist: 'K.J. Yesudas & Ilaiyaraaja',
    album: 'Moondram Pirai',
    genreIntersection: ['Vintage Jazz Standard', 'Tamil Masterpiece', 'Cello & Rhodes'],
    description: 'The golden timeless melody of Tamil cinema re-colored through intimate jazz cafe chords and acoustic upright bass.',
    vibeScore: 98,
    coverUrl: '/covers/Laufey - Bewitched _Goddess Edition_.jpg',
    spotifyOrAppleQuery: 'Kanne Kalaimaane Ilaiyaraaja'
  },
  {
    id: 'rec-5',
    title: 'Kadhaippoma (Soul Acoustic Version)',
    artist: 'Leon James & Sid Sriram',
    album: 'Oh My Kadavule',
    genreIntersection: ['Neo-Soul Chords', 'Emotional Tamil Melancholy', 'SiR Summer Vibe'],
    description: 'Smooth Fender Rhodes keyboard progressions and Sid Sriram’s expressive soul runs that fit right into a SiR or Daniel Caesar rotation.',
    vibeScore: 92,
    coverUrl: '/covers/SiR - Chasing Summer.jpg',
    spotifyOrAppleQuery: 'Kadhaippoma Leon James Sid Sriram'
  }
];

/**
 * Identifies tracks that had high-intensity binge peaks in past years
 * but have been in prolonged hibernation (>200 days unplayed).
 */
export function computeDormantBangers(records: PlayRecord[]): DormantBanger[] {
  if (records.length === 0) return [];

  const trackMap: Record<
    string,
    {
      artist: string;
      track: string;
      album?: string;
      coverUrl?: string;
      firstDate: Date;
      lastDate: Date;
      totalPlays: number;
      monthlyCounts: Record<string, number>;
    }
  > = {};

  let latestDateInDataset = records[0].timestamp;

  records.forEach(r => {
    if (r.timestamp > latestDateInDataset) {
      latestDateInDataset = r.timestamp;
    }
    const key = `${r.artistName}:::${r.trackName}`;
    if (!trackMap[key]) {
      trackMap[key] = {
        artist: r.artistName,
        track: r.trackName,
        album: r.albumName,
        coverUrl: r.coverUrl,
        firstDate: r.timestamp,
        lastDate: r.timestamp,
        totalPlays: 0,
        monthlyCounts: {}
      };
    }

    const t = trackMap[key];
    t.totalPlays += 1;
    if (r.timestamp > t.lastDate) t.lastDate = r.timestamp;
    if (r.timestamp < t.firstDate) t.firstDate = r.timestamp;
    if (r.coverUrl && !t.coverUrl) t.coverUrl = r.coverUrl;

    const y = r.timestamp.getFullYear();
    const m = String(r.timestamp.getMonth() + 1).padStart(2, '0');
    const mKey = `${y}-${m}`;
    t.monthlyCounts[mKey] = (t.monthlyCounts[mKey] || 0) + 1;
  });

  const bangers: DormantBanger[] = [];

  Object.entries(trackMap).forEach(([key, t]) => {
    const daysInHibernation = Math.floor(
      (latestDateInDataset.getTime() - t.lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Require at least 200 days of silence relative to the newest stream in the archive
    if (daysInHibernation < 200) return;

    let peakMonthKey = '';
    let peakCount = 0;
    Object.entries(t.monthlyCounts).forEach(([mKey, count]) => {
      if (count > peakCount) {
        peakCount = count;
        peakMonthKey = mKey;
      }
    });

    // Peak threshold: >=10 plays in peak month or >=20 historical plays
    if (peakCount < 10 && t.totalPlays < 20) return;

    let peakLabel = 'Past Era';
    if (peakMonthKey) {
      const [y, m] = peakMonthKey.split('-').map(Number);
      peakLabel = `${MONTH_NAMES[m - 1]} ${y}`;
    }

    const peakYear = peakMonthKey ? Number(peakMonthKey.split('-')[0]) : t.firstDate.getFullYear();
    let eraName = 'Midnight Velvet & Drill';
    let eraColor = '#7c5295';
    if (peakYear <= 2021) {
      eraName = 'Midnight Velvet & Drill';
      eraColor = '#7c5295';
    } else if (peakYear >= 2022 && peakYear <= 2023) {
      eraName = 'Tamil Cinema & Folk Awakening';
      eraColor = '#c26d2e';
    } else if (peakYear === 2024) {
      eraName = 'Sufi & Tamil Rap Underground';
      eraColor = '#2d7a64';
    } else {
      eraName = '3D Mixes & Vocal Jazz Revival';
      eraColor = '#c96a8b';
    }

    bangers.push({
      id: `dormant-${key}`,
      trackName: t.track,
      artistName: t.artist,
      albumName: t.album,
      coverUrl: t.coverUrl,
      peakPeriodLabel: peakLabel,
      peakPlaysInMonth: peakCount,
      lastPlayedDate: t.lastDate,
      daysInHibernation,
      totalHistoricalPlays: t.totalPlays,
      eraName,
      eraColor
    });
  });

  return bangers.sort((a, b) => b.daysInHibernation - a.daysInHibernation);
}
