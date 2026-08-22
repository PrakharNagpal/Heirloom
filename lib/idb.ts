"use client";

/**
 * One database, opened in one place.
 *
 * Audio blobs and storybook panels live in the same IndexedDB database, so they
 * have to agree on its version: two modules opening "heirloom" at different
 * versions means whichever one asks for the lower number gets a VersionError and
 * silently loses its data. Every store this app keeps is created here, and both
 * callers go through openDb().
 */

const DB_NAME = "heirloom";
const DB_VERSION = 2;
const STORES = ["audio", "panels"] as const;

export const AUDIO_STORE = "audio";
export const PANEL_STORE = "panels";

export function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const store of STORES) {
        if (!db.objectStoreNames.contains(store)) db.createObjectStore(store);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
