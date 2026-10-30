import { FilmRecord, UserPersonalNote } from '../types';

const DB_NAME = 'cinema_chronicle_db';
const DB_VERSION = 1;
const STORE_DATA = 'cinema_dataset';
const STORE_NOTES = 'user_notes';

interface StoredDataset {
  id: 'current_archive';
  filename: string;
  importedAt: string;
  records: Array<Omit<FilmRecord, 'timestamp'> & { timestamp: string }>;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_DATA)) {
        db.createObjectStore(STORE_DATA, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_NOTES)) {
        db.createObjectStore(STORE_NOTES, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves parsed Letterboxd film records to local IndexedDB.
 */
export async function saveArchiveToDB(
  records: FilmRecord[],
  filename: string
): Promise<void> {
  try {
    const db = await openDB();
    const serializedRecords = records.map(r => ({
      ...r,
      timestamp: r.timestamp.toISOString()
    }));

    const payload: StoredDataset = {
      id: 'current_archive',
      filename,
      importedAt: new Date().toISOString(),
      records: serializedRecords
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_DATA], 'readwrite');
      const store = tx.objectStore(STORE_DATA);
      const putReq = store.put(payload);

      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    });
  } catch (err) {
    console.error('Failed to save archive to IndexedDB:', err);
  }
}

/**
 * Loads persisted Letterboxd film records from IndexedDB.
 */
export async function loadArchiveFromDB(): Promise<{
  records: FilmRecord[];
  filename: string;
  importedAt: string;
} | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction([STORE_DATA], 'readonly');
      const store = tx.objectStore(STORE_DATA);
      const getReq = store.get('current_archive');

      getReq.onsuccess = () => {
        const result: StoredDataset | undefined = getReq.result;
        if (!result || !result.records || result.records.length === 0) {
          resolve(null);
          return;
        }

        const deserialized: FilmRecord[] = result.records.map(r => ({
          ...r,
          timestamp: new Date(r.timestamp)
        }));

        resolve({
          records: deserialized,
          filename: result.filename,
          importedAt: result.importedAt
        });
      };

      getReq.onerror = () => resolve(null);
    });
  } catch (err) {
    console.error('Failed to load archive from IndexedDB:', err);
    return null;
  }
}

/**
 * Purges the custom dataset from IndexedDB (resets to Rath's preloaded Letterboxd archive).
 */
export async function clearArchiveFromDB(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_DATA], 'readwrite');
      const store = tx.objectStore(STORE_DATA);
      const delReq = store.delete('current_archive');

      delReq.onsuccess = () => resolve();
      delReq.onerror = () => reject(delReq.error);
    });
  } catch (err) {
    console.error('Failed to clear archive from IndexedDB:', err);
  }
}

/**
 * Saves personal notes & celluloid annotations to IndexedDB.
 */
export async function saveNotesToDB(notes: Record<string, UserPersonalNote>): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction([STORE_NOTES], 'readwrite');
    const store = tx.objectStore(STORE_NOTES);

    store.clear();
    Object.entries(notes).forEach(([key, note]) => {
      store.put({ key, ...note });
    });
  } catch (err) {
    console.error('Failed to save notes to IndexedDB:', err);
  }
}

/**
 * Loads personal notes & celluloid annotations from IndexedDB.
 */
export async function loadNotesFromDB(): Promise<Record<string, UserPersonalNote> | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction([STORE_NOTES], 'readonly');
      const store = tx.objectStore(STORE_NOTES);
      const getAllReq = store.getAll();

      getAllReq.onsuccess = () => {
        const rows = getAllReq.result;
        if (!rows || rows.length === 0) {
          resolve(null);
          return;
        }
        const map: Record<string, UserPersonalNote> = {};
        rows.forEach((row: any) => {
          const { key, ...note } = row;
          map[key] = note as UserPersonalNote;
        });
        resolve(map);
      };

      getAllReq.onerror = () => resolve(null);
    });
  } catch (err) {
    console.error('Failed to load notes from IndexedDB:', err);
    return null;
  }
}
