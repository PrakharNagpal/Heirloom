"use client";

import type { Memory } from "./types";
import { SEED_MEMORY } from "./seed";

/**
 * Two stores, deliberately.
 *
 * The Memory JSON is small and goes in localStorage. The audio does NOT: base64 in
 * localStorage blows the ~5MB quota on the second recording, and an object URL is
 * dead the moment you refresh. IndexedDB stores the Blob itself, survives a reload,
 * and has room to spare. The seeded memory keeps its audio as a static file in
 * /public so the demo renders with the network off.
 */

const INDEX_KEY = "heirloom.memories.v1";
const LANG_KEY = "heirloom.lang.v1";
const DB_NAME = "heirloom";
const DB_STORE = "audio";

export type StoredMemory = {
  memory: Memory;
  /** Waveform amplitudes for the voice spine. */
  peaks: number[];
  /** True when the audio lives in /public rather than IndexedDB. */
  seeded?: boolean;
};

// ---- the index (localStorage) ---------------------------------------------

function readIndex(): StoredMemory[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(INDEX_KEY);
    return raw ? (JSON.parse(raw) as StoredMemory[]) : [];
  } catch {
    return [];
  }
}

function writeIndex(items: StoredMemory[]) {
  try {
    window.localStorage.setItem(INDEX_KEY, JSON.stringify(items));
  } catch {
    // Quota. The seed still renders, which is what the demo depends on.
    console.warn("Could not save to localStorage.");
  }
}

/** Newest first, with the seeded memory always available at the end. */
export function listMemories(): StoredMemory[] {
  const saved = readIndex();
  const hasSeed = saved.some((m) => m.memory.id === SEED_MEMORY.memory.id);
  return hasSeed ? saved : [...saved, SEED_MEMORY];
}

export function getMemory(id: string): StoredMemory | null {
  return listMemories().find((m) => m.memory.id === id) ?? null;
}

export async function saveMemory(entry: StoredMemory, audio: Blob | null) {
  if (audio) await putAudio(entry.memory.id, audio);
  const rest = readIndex().filter((m) => m.memory.id !== entry.memory.id);
  writeIndex([entry, ...rest]);
}

/** Replace a stored memory in place — used when a language is filled in later. */
export function updateMemory(memory: Memory) {
  const items = readIndex();
  const at = items.findIndex((m) => m.memory.id === memory.id);
  if (at < 0) return; // the seed lives in code, not storage
  items[at] = { ...items[at], memory };
  writeIndex(items);
}

/** Removes the memory and its audio. Deletion has to actually delete. */
export async function deleteMemory(id: string) {
  writeIndex(readIndex().filter((m) => m.memory.id !== id));
  await deleteAudio(id);
}

// ---- the audio (IndexedDB) -------------------------------------------------

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(DB_STORE)) req.result.createObjectStore(DB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function putAudio(id: string, blob: Blob) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).put(blob, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

async function deleteAudio(id: string) {
  try {
    const db = await openDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(DB_STORE, "readwrite");
      tx.objectStore(DB_STORE).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
    db.close();
  } catch {
    /* nothing stored */
  }
}

/**
 * A URL the <audio> element can play. Static path for the seed, a fresh object URL
 * for a recording — the caller must revoke it, which is why the flag comes back.
 */
export async function audioUrlFor(
  entry: StoredMemory
): Promise<{ url: string; revoke: boolean } | null> {
  if (entry.seeded) return { url: entry.memory.audioUrl, revoke: false };
  try {
    const db = await openDb();
    const blob = await new Promise<Blob | undefined>((resolve, reject) => {
      const tx = db.transaction(DB_STORE, "readonly");
      const req = tx.objectStore(DB_STORE).get(entry.memory.id);
      req.onsuccess = () => resolve(req.result as Blob | undefined);
      req.onerror = () => reject(req.error);
    });
    db.close();
    if (blob) return { url: URL.createObjectURL(blob), revoke: true };
  } catch {
    /* fall through */
  }
  return entry.memory.audioUrl ? { url: entry.memory.audioUrl, revoke: false } : null;
}

// ---- language preference ---------------------------------------------------

export function readLang(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LANG_KEY);
  } catch {
    return null;
  }
}

export function writeLang(lang: string) {
  try {
    window.localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* private mode */
  }
}
