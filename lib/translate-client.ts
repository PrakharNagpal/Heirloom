"use client";

import type { Lang, Memory } from "./types";

/**
 * Fill in one more language for a memory she already recorded, then hand back a
 * new Memory with it merged in. The caller persists it, so each language costs
 * exactly one call, ever — switch back and forth afterwards and nothing is spent.
 */
export async function addLanguage(memory: Memory, target: Lang): Promise<Memory> {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      targetLanguage: target,
      sourceLanguage: memory.sourceLanguage,
      title: memory.title,
      summary: memory.summary,
      emotionalCore: memory.emotionalCore,
      lines: memory.segments.map((s) => s.originalText),
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? "That language didn't come through.");

  const lines = data.lines as string[];
  return {
    ...memory,
    titleTranslations: { ...memory.titleTranslations, [target]: data.title || memory.title },
    segments: memory.segments.map((s, i) => ({
      ...s,
      translations: { ...s.translations, [target]: lines[i] ?? s.originalText },
    })),
  };
}
