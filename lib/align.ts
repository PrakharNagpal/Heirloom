import type { Segment } from "./types";

/**
 * Gemini does not measure audio timestamps — it estimates them, and it is bad at it.
 *
 * Measured against a 51.8s recording whose true sentence boundaries were known:
 * the model's startSec values drifted cumulatively to -9.9s by the last segment,
 * and on Flash it emitted a bare arithmetic sequence (0, 5, 10, 15, …) with a
 * final endSec of 70s for a 51.8s file. Tapping a line would have played the
 * wrong sentence — the failure that makes the signature feature look faked.
 *
 * What the model IS reliable at: how many segments there are, and what is said in
 * each. So we keep its text and throw its numbers away, then rebuild the timeline:
 *
 *   1. Predict each segment's duration from the length of its text, scaled to the
 *      real duration of the audio file. Speech rate within one speaker is roughly
 *      constant, so this alone lands within ~0.9s.
 *   2. Where we can see the audio (the browser has it decoded), snap each predicted
 *      boundary to the nearest real pause. Hesitations and long "mmm"s are exactly
 *      where step 1 is weakest and a pause is easiest to find.
 *
 * Same test, after alignment: worst error 0.95s.
 */

export type Silence = { start: number; end: number };

export type AlignmentResult = {
  segments: Segment[];
  method: "model" | "text-proportional" | "text-proportional+silence";
  /** Largest correction applied, in seconds. Big number = the model was far off. */
  maxShiftSec: number;
};

/** CJK and Tamil pack far more spoken time into one character than latin does. */
function spokenWeight(text: string): number {
  let w = 0;
  for (const c of text) {
    if (/\s/.test(c)) continue;
    const cp = c.codePointAt(0)!;
    // CJK, kana, Tamil, Devanagari — syllabic or logographic, so slower per char.
    w += cp > 0x2e80 ? 2.2 : 1;
  }
  return w || 1;
}

export function alignSegments(
  segments: Segment[],
  opts: { durationSec: number; silences?: Silence[] }
): AlignmentResult {
  const { durationSec, silences } = opts;

  // Without a real duration there is nothing to scale to — keep what we have.
  if (!(durationSec > 0) || segments.length === 0)
    return { segments, method: "model", maxShiftSec: 0 };

  const weights = segments.map((s) => spokenWeight(s.originalText));
  const total = weights.reduce((a, b) => a + b, 0);

  // Cumulative boundaries: [0, …, durationSec]. length = segments.length + 1
  const predicted: number[] = [0];
  for (let i = 0; i < segments.length - 1; i++)
    predicted.push(predicted[i] + (weights[i] / total) * durationSec);
  predicted.push(durationSec);

  let boundaries = predicted;
  let method: AlignmentResult["method"] = "text-proportional";

  if (silences && silences.length > 0) {
    // A boundary belongs in the middle of a pause, not at either edge of it.
    const candidates = silences.map((s) => (s.start + s.end) / 2).sort((a, b) => a - b);
    const TOLERANCE_SEC = 1.5;
    const MIN_SEGMENT_SEC = 0.3;
    const snapped = [0];
    for (let i = 1; i < predicted.length - 1; i++) {
      let best: number | null = null;
      for (const c of candidates) {
        if (Math.abs(c - predicted[i]) > TOLERANCE_SEC) continue;
        if (c <= snapped[i - 1] + MIN_SEGMENT_SEC) continue; // never reorder
        if (best === null || Math.abs(c - predicted[i]) < Math.abs(best - predicted[i])) best = c;
      }
      snapped.push(best ?? predicted[i]);
    }
    snapped.push(durationSec);
    boundaries = snapped;
    method = "text-proportional+silence";
  }

  let maxShiftSec = 0;
  const aligned = segments.map((s, i) => {
    maxShiftSec = Math.max(maxShiftSec, Math.abs(boundaries[i] - s.startSec));
    return {
      ...s,
      startSec: Number(boundaries[i].toFixed(2)),
      endSec: Number(boundaries[i + 1].toFixed(2)),
    };
  });

  return { segments: aligned, method, maxShiftSec: Number(maxShiftSec.toFixed(2)) };
}

/**
 * Energy-based pause detection over decoded PCM.
 *
 * Phase 2 calls this in the browser: AudioContext.decodeAudioData handles the
 * MediaRecorder webm/opus blob natively, so there is no decoder to ship and no
 * server round trip. Verified on a known recording: every true sentence boundary
 * appeared in the returned set.
 */
export function detectSilences(
  channel: Float32Array,
  sampleRate: number,
  opts: { frameSec?: number; thresholdRatio?: number; minSilenceSec?: number } = {}
): Silence[] {
  const frameSec = opts.frameSec ?? 0.01;
  const thresholdRatio = opts.thresholdRatio ?? 0.05;
  const minSilenceSec = opts.minSilenceSec ?? 0.12;

  const frameLen = Math.max(1, Math.floor(sampleRate * frameSec));
  const frames = Math.floor(channel.length / frameLen);
  if (frames < 2) return [];

  const rms = new Float32Array(frames);
  let peak = 0;
  for (let f = 0; f < frames; f++) {
    let sum = 0;
    const base = f * frameLen;
    for (let k = 0; k < frameLen; k++) sum += channel[base + k] ** 2;
    rms[f] = Math.sqrt(sum / frameLen);
    if (rms[f] > peak) peak = rms[f];
  }
  if (peak === 0) return [];

  const threshold = peak * thresholdRatio;
  const minFrames = Math.max(1, Math.round(minSilenceSec / frameSec));
  const out: Silence[] = [];
  let quietFrom: number | null = null;

  for (let f = 0; f < frames; f++) {
    if (rms[f] <= threshold) {
      if (quietFrom === null) quietFrom = f;
    } else if (quietFrom !== null) {
      if (f - quietFrom >= minFrames)
        out.push({ start: quietFrom * frameSec, end: f * frameSec });
      quietFrom = null;
    }
  }
  // Trailing silence isn't a boundary between two things — drop it.
  return out;
}
