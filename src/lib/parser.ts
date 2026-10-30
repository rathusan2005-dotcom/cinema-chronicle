import Papa from 'papaparse';
import { PlayRecord, RawPlayActivity, CleanserConfig } from '../types';
import { evaluatePlayRecord, DEFAULT_CLEANSER_CONFIG } from './cleanser';

// Map of known album cover filenames in public/covers
export const KNOWN_COVERS: { [key: string]: string } = {
  '3 ost': '/covers/3 - OST _Moonu_.jpg',
  'moonu': '/covers/3 - OST _Moonu_.jpg',
  'vibes two': '/covers/3d Sound - Vibes Two.jpg',
  '3d sound': '/covers/3d Sound - Vibes Two.jpg',
  'kadhal fever': '/covers/Achu _ Arshan Anton - Kadhal Fever.jpg',
  'butterfly': '/covers/Akshara - Butterfly.jpg',
  'clones ep': '/covers/Akshara - CLONES EP.jpg',
  'experimental ep': '/covers/Akshara - Experimental EP.jpg',
  'light years': '/covers/Akshara - Light Years.jpg',
  'universe': '/covers/Akshara - Universe.jpg',
  'theplaceicomefrom': '/covers/Akshara - theplaceicomefrom.jpg',
  'sonder son': '/covers/Brent Faiyaz - Sonder Son.jpg',
  'wasteland': '/covers/Brent Faiyaz - WASTELAND.jpg',
  'trapsoul': '/covers/Bryson Tiller - TRAPSOUL.jpg',
  'layers of love': '/covers/CPE - Layers of Love.jpg',
  'love, clickz 2': '/covers/Clickz _ 3d Sound - Love_ Clickz 2 _Deluxe_.jpg',
  'certified lover boy': '/covers/Drake - Certified Lover Boy.jpg',
  'honestly, nevermind': '/covers/Drake - Honestly_ Nevermind.jpg',
  'iceman': '/covers/Drake - ICEMAN.jpg',
  'if you_re reading this it_s too late': '/covers/Drake - If You_re Reading This It_s Too Late.jpg',
  'nothing was the same': '/covers/Drake - Nothing Was The Same _Deluxe_.jpg',
  'scorpion': '/covers/Drake - Scorpion.jpg',
  'dude': '/covers/Dude - OST.jpg',
  'ethir neechal': '/covers/Ethir Neechal - OST.jpg',
  'blonde': '/covers/Frank Ocean - Blonde.jpg',
  'hndrxx': '/covers/Future - HNDRXX.jpg',
  'arunachala': '/covers/Gayathri Krishnan - Arunachala.jpg',
  'create to express': '/covers/Gayathri Krishnan - Create to Express.jpg',
  '96 ost': '/covers/Govind Vasantha - 96 OST.jpg',
  '96': '/covers/Govind Vasantha - 96 OST.jpg',
  'bad love': '/covers/JanZee Official - Bad Love.jpg',
  'dola': '/covers/JanZee Official - Dola.jpg',
  'zaza': '/covers/JanZee Official - ZAZA.jpg',
  'la la land': '/covers/La La Land - OST.jpg',
  'bewitched': '/covers/Laufey - Bewitched _Goddess Edition_.jpg',
  'everything i know about love': '/covers/Laufey - Everything I Know About Love _Deluxe_.jpg',
  'oppenheimer': '/covers/Ludwig Goransson - Oppenheimer OST.jpg',
  'chasing euphoria': '/covers/M Huncho - Chasing Euphoria.jpg',
  'utopia': '/covers/M Huncho - Utopia.jpg',
  'mahaan': '/covers/Mahaan - OST.jpg',
  'mayakkam enna': '/covers/Mayakkam Enna - OST.jpg',
  'paayum theeye': '/covers/Paayum Theeye _From Por_.jpg',
  'pariyerum perumal': '/covers/Pariyerum Perumal - OST.jpg',
  'raavanan': '/covers/Raavanan - OST.jpg',
  'tamil ep': '/covers/Retro - TAMIL EP.jpg',
  'sapta sagaradaache ello': '/covers/Sapta Sagaradaache Ello - Side A.jpg',
  'sapta sagaradaache ello - side a': '/covers/Sapta Sagaradaache Ello - Side A.jpg',
  'sapta sagaradaache ello - side b': '/covers/Sapta Sagaradaache Ello - Side B.jpg',
  'cruel intentions': '/covers/Shreea Kaul - Cruel Intentions.jpg',
  'chasing summer': '/covers/SiR - Chasing Summer.jpg',
  'trilogy': '/covers/The Weeknd - Trilogy.jpg',
  'uyir ponaalum': '/covers/Uyir Ponaalum - EP.jpg',
  'vaazhai': '/covers/Vaazhai - OST.jpg',
  'vanakkam chennai': '/covers/Vanakkam Chennai - OST.jpg',
  'vendhu thanindhathu kaadu': '/covers/Vendhu Thanindhathu Kaadu - OST.jpg',
  'yeh jawaani hai deewani': '/covers/Yeh Jawaani Hai Deewani - OST.jpg',
  'last september': '/covers/natalie jinju - Last September.jpg',
};

export function findCover(artist?: string, albumOrTrack?: string): string | undefined {
  const query = `${artist || ''} ${albumOrTrack || ''}`.toLowerCase();
  for (const [key, path] of Object.entries(KNOWN_COVERS)) {
    if (query.includes(key)) {
      return path;
    }
  }
  return undefined;
}

export function parsePlayRecord(
  raw: RawPlayActivity,
  index: number,
  config: CleanserConfig = DEFAULT_CLEANSER_CONFIG
): PlayRecord | null {
  // Try extracting track name
  const trackName = raw['Song Name'] || raw['Title'] || raw['Track Description'] || raw['trackName'] || 'Unknown Track';
  const artistName = raw['Artist Name'] || raw['Artist'] || raw['artistName'] || 'Unknown Artist';
  const albumName = raw['Container Description'] || raw['Album Name'] || raw['Collection Name'] || raw['Playlist Name'] || '';
  const genre = raw['Genre'] || raw['Genre Name'] || 'Music';

  // Parse Timestamp
  const rawTimestamp = raw['Event Start Timestamp'] || raw['Event End Timestamp'] || raw['Event Received Timestamp'] || raw['timestamp'] || raw['Date'];
  if (!rawTimestamp) return null;

  const timestamp = new Date(rawTimestamp);
  if (isNaN(timestamp.getTime())) return null;

  // Durations
  const playDurationMs = Number(raw['Play Duration Milliseconds'] || raw['Duration Milliseconds'] || raw['Play Duration In Milliseconds'] || 0);
  const mediaDurationMs = Number(raw['Media Duration In Milliseconds'] || raw['Media Duration'] || 0);

  // End Reason
  const endReason = String(raw['Event Reason Hint Type'] || raw['End Reason Type'] || raw['Event Type'] || '');
  const containerType = raw['Container Type'] || raw['Feature Name'] || '';
  const containerName = albumName;

  // Deduce sourceMode
  const featLower = (String(raw['Feature Name'] || '') + ' ' + String(containerType)).toLowerCase();
  let sourceMode: 'album' | 'playlist' | 'search' | 'radio' = 'album';
  if (featLower.includes('radio') || featLower.includes('station') || featLower.includes('auto')) {
    sourceMode = 'radio';
  } else if (featLower.includes('search')) {
    sourceMode = 'search';
  } else if (featLower.includes('playlist')) {
    sourceMode = 'playlist';
  } else {
    sourceMode = 'album';
  }

  const coverUrl = findCover(artistName, albumName || trackName);

  return evaluatePlayRecord({
    id: `play-${index}-${timestamp.getTime()}`,
    trackName,
    artistName,
    albumName,
    genre,
    timestamp,
    playDurationMs,
    mediaDurationMs,
    endReason,
    containerType,
    containerName,
    sourceMode,
    coverUrl
  }, config);
}

export function parseAppleMusicCSV(
  fileOrText: File | string,
  onProgress?: (progress: number) => void,
  config: CleanserConfig = DEFAULT_CLEANSER_CONFIG
): Promise<PlayRecord[]> {
  return new Promise((resolve, reject) => {
    const results: PlayRecord[] = [];
    let recordIndex = 0;

    Papa.parse<RawPlayActivity>(fileOrText as any, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      step: (row) => {
        if (row.data) {
          const parsed = parsePlayRecord(row.data, recordIndex++, config);
          if (parsed) {
            results.push(parsed);
          }
        }
      },
      complete: () => {
        // Sort chronologically ascending
        results.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        resolve(results);
      },
      error: (err) => {
        reject(err);
      }
    });
  });
}
