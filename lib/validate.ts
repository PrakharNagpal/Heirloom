import type { Lang, Memory, Segment, SuggestedFormat, LessonFormat } from "./types";

const KNOWN_FORMATS: LessonFormat[] = [
  "cookalong",
  "branching",
  "phrasecoach",
  "storybook",
  "quiz",
  "skillcard",
];

export type ValidationResult = {
  memory: Memory;
  /** Non-fatal notes worth logging — the gate checklist reads these. */
  issues: string[];
};

class ValidationError extends Error {}

function fail(msg: string): never {
  throw new ValidationError(msg);
}

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const strArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.map(str).filter(Boolean) : [];

/**
 * Turn whatever the model returned into a Memory, or throw so the caller can retry.
 *
 * Hard failures (throw): no usable segments, a segment missing a translation,
 * timestamps that aren't real numbers. Everything else is normalised and noted.
 */
export function validateMemory(
  raw: unknown,
  meta: { id: string; audioUrl: string; durationSec: number; targetLanguage: Lang }
): ValidationResult {
  const issues: string[] = [];
  if (!raw || typeof raw !== "object") fail("Model returned no object.");
  const r = raw as Record<string, unknown>;

  if (!Array.isArray(r.segments) || r.segments.length === 0)
    fail("No segments — the spine is the product, so this is a hard failure.");

  const segments: Segment[] = [];
  (r.segments as unknown[]).forEach((s, i) => {
    if (!s || typeof s !== "object") fail(`Segment ${i} is not an object.`);
    const seg = s as Record<string, unknown>;

    const originalText = str(seg.originalText);
    if (!originalText) {
      issues.push(`Segment ${i} had empty originalText — dropped.`);
      return;
    }

    const startSec = Number(seg.startSec);
    const endSec = Number(seg.endSec);
    if (!Number.isFinite(startSec) || !Number.isFinite(endSec))
      fail(`Segment ${i} has non-numeric timestamps (${seg.startSec}–${seg.endSec}).`);

    // One language per pass now; the rest arrive via /api/translate on demand.
    const translated = str(seg.translation);
    if (!translated)
      fail(`Segment ${i} came back with no ${meta.targetLanguage} translation.`);
    const translations: Segment["translations"] = { [meta.targetLanguage]: translated };

    const clampedStart = Math.max(0, startSec);
    const clampedEnd = Math.max(clampedStart + 0.2, endSec);
    if (endSec < startSec)
      issues.push(`Segment ${i}: endSec was before startSec — corrected.`);
    if (meta.durationSec > 0 && clampedStart > meta.durationSec + 1)
      issues.push(
        `Segment ${i}: startSec ${clampedStart.toFixed(1)}s is past the end of a ${meta.durationSec.toFixed(1)}s recording.`
      );

    segments.push({
      startSec: clampedStart,
      endSec: meta.durationSec > 0 ? Math.min(clampedEnd, meta.durationSec) : clampedEnd,
      originalText,
      uncertain: seg.uncertain === true,
      translations,
    });
  });

  if (segments.length === 0) fail("Every segment was empty after cleaning.");

  segments.sort((a, b) => a.startSec - b.startSec);
  for (let i = 1; i < segments.length; i++) {
    if (segments[i].startSec < segments[i - 1].endSec - 0.01)
      issues.push(`Segments ${i - 1} and ${i} overlap in time.`);
  }

  const suggestedFormats: SuggestedFormat[] = (
    Array.isArray(r.suggestedFormats) ? (r.suggestedFormats as unknown[]) : []
  )
    .map((f) => {
      const o = (f ?? {}) as Record<string, unknown>;
      return { format: str(o.format) as LessonFormat, reason: str(o.reason) };
    })
    .filter((f) => KNOWN_FORMATS.includes(f.format));

  if (suggestedFormats.length === 0)
    issues.push("No usable suggestedFormats — the picker will show all of them instead.");

  const speakerName = str(r.speakerName) || "Ah Ma";
  const title = str(r.title) || str(r.titleTranslated) || "Untitled memory";

  return {
    memory: {
      id: meta.id,
      createdAt: new Date().toISOString(),
      audioUrl: meta.audioUrl,
      durationSec: meta.durationSec,
      sourceLanguage: str(r.sourceLanguage) || "unknown",
      speakerName,
      title,
      titleTranslated: str(r.titleTranslated) || title,
      titleTranslations: { [meta.targetLanguage]: str(r.titleTranslated) || title },
      segments,
      summary: str(r.summary),
      era: str(r.era) || null,
      places: strArray(r.places),
      people: strArray(r.people),
      skills: strArray(r.skills),
      emotionalCore: str(r.emotionalCore),
      suggestedFormats,
    },
    issues,
  };
}
