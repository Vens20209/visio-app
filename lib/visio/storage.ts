// lib/visio/storage.ts
//
// Visio device storage, powered by IndexedDB.
//
// Why this file exists:
// Visio used to keep saved looks and feedback (including photos) inside
// localStorage — a tiny ~5MB box. Photos are big, so the box overflowed
// and saving crashed. IndexedDB is the browser's large storage system
// (hundreds of MB or more), built for exactly this kind of data.
//
// This file also performs a one-time migration: anything still sitting in
// the old localStorage keys is moved into IndexedDB automatically, then
// the old copies are removed to free up space.

const DB_NAME = "visio";
const DB_VERSION = 1;
const STORE_NAME = "lists";
const MIGRATION_FLAG = "visio:storage-migrated-v1";
const LEGACY_KEYS = ["visio:saved-looks", "visio:feedback-history"];

function hasIndexedDb() {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open Visio storage."));
  });
}

async function idbGet<T>(key: string): Promise<T | undefined> {
  const db = await openDb();
  try {
    return await new Promise<T | undefined>((resolve, reject) => {
      const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(key);
      request.onsuccess = () => resolve(request.result as T | undefined);
      request.onerror = () => reject(request.error ?? new Error("Could not read from Visio storage."));
    });
  } finally {
    db.close();
  }
}

async function idbSet(key: string, value: unknown): Promise<void> {
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("Could not write to Visio storage."));
      tx.onabort = () => reject(tx.error ?? new Error("Could not write to Visio storage."));
    });
  } finally {
    db.close();
  }
}

/** One-time move of any old localStorage data into IndexedDB. */
async function migrateLegacyData(): Promise<void> {
  try {
    if (window.localStorage.getItem(MIGRATION_FLAG)) return;
    for (const key of LEGACY_KEYS) {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const existing = await idbGet<unknown[]>(key);
          if (Array.isArray(parsed) && (!existing || existing.length === 0)) {
            await idbSet(key, parsed);
          }
        } catch {
          // Old data was unreadable; skip it rather than crash.
        }
        window.localStorage.removeItem(key);
      }
    }
    window.localStorage.setItem(MIGRATION_FLAG, "1");
  } catch {
    // localStorage may be blocked (e.g. strict private mode); safe to ignore.
  }
}

/** Read a stored list. Always returns an array, never throws. */
export async function getStoredList<T>(key: string): Promise<T[]> {
  if (!hasIndexedDb()) return [];
  try {
    await migrateLegacyData();
    const value = await idbGet<T[]>(key);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

/** Write a stored list. Returns true on success, false on failure. Never throws. */
export async function setStoredList<T>(key: string, items: T[]): Promise<boolean> {
  if (!hasIndexedDb()) return false;
  try {
    await migrateLegacyData();
    await idbSet(key, items);
    return true;
  } catch {
    return false;
  }
}
