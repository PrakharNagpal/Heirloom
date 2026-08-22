"use client";

import { detectSilences, type Silence } from "./align";

/**
 * Everything we need from a recording, measured in the browser.
 *
 * decodeAudioData handles the recorder's webm/opus and Safari's mp4 natively, so
 * there is no codec to ship and no server round trip. This is also the only place
 * the true duration and the real pauses exist — Phase 1 established that Gemini's
 * own timestamps drift by up to ten seconds, and lib/align.ts needs both of these
 * to rebuild the timeline.
 */
export type AudioFacts = {
  durationSec: number;
  silences: Silence[];
  /** Normalised 0–1 amplitudes for drawing the voice spine. */
  peaks: number[];
};

export const PEAK_COUNT = 160;

export async function measureAudio(blob: Blob): Promise<AudioFacts> {
  const AudioCtx: typeof AudioContext =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AudioCtx();
  try {
    const decoded = await ctx.decodeAudioData(await blob.arrayBuffer());
    const channel = decoded.getChannelData(0);
    return {
      durationSec: decoded.duration,
      silences: detectSilences(channel, decoded.sampleRate),
      peaks: extractPeaks(channel),
    };
  } finally {
    void ctx.close();
  }
}

function extractPeaks(channel: Float32Array, count = PEAK_COUNT): number[] {
  const bucket = Math.max(1, Math.floor(channel.length / count));
  const peaks: number[] = [];
  let loudest = 0;
  for (let i = 0; i < count; i++) {
    let max = 0;
    const base = i * bucket;
    for (let k = 0; k < bucket; k += 4) {
      const v = Math.abs(channel[base + k] ?? 0);
      if (v > max) max = v;
    }
    peaks.push(max);
    if (max > loudest) loudest = max;
  }
  return loudest > 0 ? peaks.map((p) => Number((p / loudest).toFixed(3))) : peaks;
}

/** The container MediaRecorder will actually give us on this browser. */
export function pickRecorderMime(): string {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4", // Safari
    "audio/ogg;codecs=opus",
  ];
  for (const c of candidates)
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(c)) return c;
  return "";
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the recording."));
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.readAsDataURL(blob);
  });
}
