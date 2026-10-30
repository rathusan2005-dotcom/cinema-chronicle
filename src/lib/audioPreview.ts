export interface AudioPreviewResult {
  previewUrl: string;
  artworkUrl?: string;
  trackName: string;
  artistName: string;
  collectionName?: string;
}

const previewCache = new Map<string, AudioPreviewResult | null>();

/**
 * Fetches a 30-second AAC audio preview from the public iTunes Search API.
 * Free, client-side, and unauthenticated.
 */
export async function fetchAudioPreview(
  artist: string,
  track: string
): Promise<AudioPreviewResult | null> {
  const cleanTrack = track
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/feat\..*$/i, '')
    .trim();
  const cleanArtist = artist.split('&')[0].split(',')[0].trim();

  const cacheKey = `${cleanArtist.toLowerCase()}:::${cleanTrack.toLowerCase()}`;
  if (previewCache.has(cacheKey)) {
    return previewCache.get(cacheKey) || null;
  }

  try {
    const query = encodeURIComponent(`${cleanArtist} ${cleanTrack}`);
    const url = `https://itunes.apple.com/search?term=${query}&entity=song&limit=1`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      previewCache.set(cacheKey, null);
      return null;
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0 || !data.results[0].previewUrl) {
      previewCache.set(cacheKey, null);
      return null;
    }

    const item = data.results[0];
    let hiResArtwork = item.artworkUrl100;
    if (hiResArtwork) {
      hiResArtwork = hiResArtwork.replace('100x100bb.jpg', '600x600bb.jpg');
    }

    const result: AudioPreviewResult = {
      previewUrl: item.previewUrl,
      artworkUrl: hiResArtwork,
      trackName: item.trackName || track,
      artistName: item.artistName || artist,
      collectionName: item.collectionName
    };

    previewCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.warn(`Audio preview fetch error for "${artist} - ${track}":`, err);
    previewCache.set(cacheKey, null);
    return null;
  }
}
