"use client";

/**
 * Storybook panels, cached so a page is drawn once and never again.
 *
 * Three places a panel can come from, in order:
 *  1. /public/storybook/ — the seeded memory's panels, drawn ahead of time and
 *     shipped in the repo. Instant, free, and works with the network off.
 *  2. IndexedDB — anything drawn on this device before. Blobs, not base64: six
 *     images would blow the localStorage quota on their own.
 *  3. The model, once, and then straight into (2).
 *
 * Keyed by memory and panel, NOT by language: the caption changes between English
 * and Tamil, the scene does not, so one drawing serves all four.
 */

import { PANEL_STORE as STORE, openDb } from "./idb";

const key = (memoryId: string, panel: number) => `${memoryId}::${panel}`;

/** Memories whose panels are drawn ahead of time and shipped in the repo. */
export const BAKED_PANEL_MEMORIES = ["mem_seed", "mem_seed_en"] as const;

/** Panels shipped in the repo, per memory. */
export function bakedPanelUrl(memoryId: string, panel: number): string | null {
  return (BAKED_PANEL_MEMORIES as readonly string[]).includes(memoryId)
    ? `/storybook/${memoryId}/panel-${panel + 1}.webp`
    : null;
}

async function readCached(memoryId: string, panel: number): Promise<Blob | null> {
  try {
    const db = await openDb();
    const blob = await new Promise<Blob | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(key(memoryId, panel));
      req.onsuccess = () => resolve(req.result as Blob | undefined);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return blob ?? null;
  } catch {
    return null;
  }
}

async function writeCached(memoryId: string, panel: number, blob: Blob) {
  try {
    const db = await openDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(blob, key(memoryId, panel));
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
    db.close();
  } catch {
    /* private mode, or out of room */
  }
}

function base64ToBlob(data: string, mimeType: string): Blob {
  const bin = atob(data);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
}

export type PanelImage = { url: string; revoke: boolean };

export async function getPanelImage(
  memoryId: string,
  panel: number,
  imagePrompt: string
): Promise<PanelImage> {
  const baked = bakedPanelUrl(memoryId, panel);
  if (baked) return { url: baked, revoke: false };

  const cached = await readCached(memoryId, panel);
  if (cached) return { url: URL.createObjectURL(cached), revoke: true };

  const res = await fetch("/api/illustrate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ imagePrompt }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? "We couldn't draw that one.");

  const blob = base64ToBlob(data.data, data.mimeType ?? "image/png");
  await writeCached(memoryId, panel, blob);
  return { url: URL.createObjectURL(blob), revoke: true };
}
