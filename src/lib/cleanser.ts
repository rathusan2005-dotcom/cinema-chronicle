import { PlayRecord, CleanserConfig } from '../types';

export const DEFAULT_SLEEP_PLAYLISTS = [
  '🥱chilling and sleeping ?!?',
  '😴 sleeping in tamil',
  '50% sleepy deepy',
  'kan mooditu thoongu da',
  'sleep',
  'sleeping',
  'thoongu',
  'ambient sleep',
  'sleepy deepy'
];

export const DEFAULT_CLEANSER_CONFIG: CleanserConfig = {
  purgeSleepPlaylists: true,
  purgeNightHours: true,
  nightStartHour: 23.5, // 11:30 PM
  nightEndHour: 7.0,    // 07:00 AM
  minPlaySeconds: 10,   // Accidental skip threshold
  customSleepKeywords: ['sleep', 'thoongu', 'ambient', 'chilling and sleeping']
};

export function isSleepPlaylist(containerName: string | undefined, customKeywords: string[] = []): boolean {
  if (!containerName) return false;
  const lower = containerName.toLowerCase().trim();

  // Exact known titles or substrings
  for (const known of DEFAULT_SLEEP_PLAYLISTS) {
    if (lower.includes(known.toLowerCase())) return true;
  }

  for (const kw of customKeywords) {
    if (kw && lower.includes(kw.toLowerCase())) return true;
  }

  return false;
}

export function isNightHours(date: Date, startHour: number = 23.5, endHour: number = 7.0): boolean {
  const hours = date.getHours() + date.getMinutes() / 60;
  if (startHour > endHour) {
    // Overnight window (e.g. 23:30 to 07:00)
    return hours >= startHour || hours < endHour;
  }
  return hours >= startHour && hours < endHour;
}

export function isAccidentalSkip(playDurationMs: number, minPlaySeconds: number = 10, endReason?: string): boolean {
  const seconds = playDurationMs / 1000;
  if (seconds < minPlaySeconds) {
    return true;
  }
  if (endReason && (endReason.includes('SKIPPED') || endReason.includes('MANUAL_SKIP')) && seconds < 15) {
    return true;
  }
  return false;
}

export interface CleanserStats {
  totalRawPlays: number;
  totalCleanPlays: number;
  sleepPlaylistPurged: number;
  nightHoursPurged: number;
  skipsPurged: number;
  totalRawMinutes: number;
  totalCleanMinutes: number;
  purgedSleepMinutes: number;
  activeListeningRatio: number; // percentage
}

export function evaluatePlayRecord(
  record: Omit<PlayRecord, 'isSleepPlay' | 'isNightPlay' | 'isSkipped'>,
  config: CleanserConfig = DEFAULT_CLEANSER_CONFIG
): PlayRecord {
  const isSleep = isSleepPlaylist(record.containerName, config.customSleepKeywords);
  const isNight = isNightHours(record.timestamp, config.nightStartHour, config.nightEndHour);
  const isSkip = isAccidentalSkip(record.playDurationMs, config.minPlaySeconds, record.endReason);

  return {
    ...record,
    isSleepPlay: isSleep,
    isNightPlay: isNight,
    isSkipped: isSkip
  };
}

export function filterRecords(
  records: PlayRecord[],
  activeOnly: boolean,
  config: CleanserConfig = DEFAULT_CLEANSER_CONFIG
): PlayRecord[] {
  if (!activeOnly) {
    return records;
  }

  return records.filter(r => {
    if (config.purgeSleepPlaylists && r.isSleepPlay) return false;
    if (config.purgeNightHours && r.isNightPlay && r.isSleepPlay) return false; // If nighttime AND ambient/sleep
    if (r.isSkipped) return false;
    return true;
  });
}

export function calculateCleanserStats(
  records: PlayRecord[],
  config: CleanserConfig = DEFAULT_CLEANSER_CONFIG
): CleanserStats {
  let sleepPlaylistPurged = 0;
  let nightHoursPurged = 0;
  let skipsPurged = 0;
  let rawMinutes = 0;
  let cleanMinutes = 0;
  let purgedSleepMinutes = 0;
  let cleanCount = 0;

  for (const r of records) {
    const durationMin = r.playDurationMs / (1000 * 60);
    rawMinutes += durationMin;

    const shouldPurgeSleep = config.purgeSleepPlaylists && r.isSleepPlay;
    const shouldPurgeNight = config.purgeNightHours && r.isNightPlay && r.isSleepPlay;
    const shouldPurgeSkip = r.isSkipped;

    if (shouldPurgeSleep) {
      sleepPlaylistPurged++;
      purgedSleepMinutes += durationMin;
    } else if (shouldPurgeNight) {
      nightHoursPurged++;
      purgedSleepMinutes += durationMin;
    }

    if (shouldPurgeSkip) {
      skipsPurged++;
    }

    const isClean = !(shouldPurgeSleep || shouldPurgeNight || shouldPurgeSkip);
    if (isClean) {
      cleanCount++;
      cleanMinutes += durationMin;
    }
  }

  const activeListeningRatio = rawMinutes > 0 ? (cleanMinutes / rawMinutes) * 100 : 100;

  return {
    totalRawPlays: records.length,
    totalCleanPlays: cleanCount,
    sleepPlaylistPurged,
    nightHoursPurged,
    skipsPurged,
    totalRawMinutes: Math.round(rawMinutes),
    totalCleanMinutes: Math.round(cleanMinutes),
    purgedSleepMinutes: Math.round(purgedSleepMinutes),
    activeListeningRatio: Math.round(activeListeningRatio * 10) / 10
  };
}
