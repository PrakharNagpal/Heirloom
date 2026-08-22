import { NextResponse } from "next/server";
import { callWithFallback, gemini, UNDERSTAND_MODELS } from "@/lib/gemini";
import { MEMORY_SCHEMA, understandPrompt } from "@/lib/prompts";
import { LANGUAGES, type Lang } from "@/lib/types";
import { validateMemory } from "@/lib/validate";
import { alignSegments, type Silence } from "@/lib/align";

export const runtime = "nodejs";
export const maxDuration = 300;

// Gemini's documented inline-data ceiling is 20MB for the whole request.
const MAX_AUDIO_BYTES = 18 * 1024 * 1024;

/** MediaRecorder's webm/opus, mapped onto a MIME type the audio API accepts. */
function normaliseMime(mimeType: string): string {
  const base = (mimeType || "").split(";")[0].trim().toLowerCase();
  if (!base) return "audio/ogg";
  if (base === "video/webm" || base === "audio/webm") return "audio/ogg";
  if (base === "video/ogg") return "audio/ogg";
  if (base === "audio/mpeg" || base === "audio/mpga") return "audio/mp3";
  if (base === "audio/x-m4a" || base === "audio/mp4") return "audio/aac";
  return base;
}

export type UnderstandRequest = {
  /** Raw base64, no data: prefix. */
  audioBase64: string;
  mimeType?: string;
  /** Where the player will fetch the audio from. */
  audioUrl?: string;
  durationSec?: number;
  id?: string;
  /** The one language to translate into now. The rest are filled in on demand. */
  targetLanguage?: Lang;
  /** What the family thinks she's speaking. A hint to the model, never a rule. */
  sourceLanguageHint?: string;
  /**
   * Pauses the browser found in the decoded audio. Optional, but it is what makes
   * tap-a-line-hear-her real — see lib/align.ts for why the model's own
   * timestamps cannot be used.
   */
  silences?: Silence[];
};

export async function POST(req: Request) {
  const startedAt = Date.now();
  let body: UnderstandRequest;
  try {
    body = (await req.json()) as UnderstandRequest;
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const audioBase64 = (body.audioBase64 ?? "").replace(/^data:[^,]+,/, "");
  if (!audioBase64)
    return NextResponse.json({ error: "No audio in the request." }, { status: 400 });

  const bytes = Math.floor((audioBase64.length * 3) / 4);
  if (bytes > MAX_AUDIO_BYTES)
    return NextResponse.json(
      {
        error:
          "That recording is too long to send in one piece. Keep it under about 90 seconds.",
      },
      { status: 413 }
    );

  const mimeType = normaliseMime(body.mimeType ?? "audio/webm");
  const id = body.id ?? `mem_${Date.now().toString(36)}`;
  const targetLanguage: Lang = LANGUAGES.includes(body.targetLanguage as Lang)
    ? (body.targetLanguage as Lang)
    : "en";
  const meta = {
    id,
    audioUrl: body.audioUrl ?? "",
    durationSec: Number(body.durationSec) > 0 ? Number(body.durationSec) : 0,
    targetLanguage,
  };
  const prompt = understandPrompt(targetLanguage, body.sourceLanguageHint);

  const ai = gemini();

  const runOnce = (extra: string) => (model: string) =>
    ai.models
      .generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { mimeType, data: audioBase64 } },
              { text: extra ? `${prompt}\n\n${extra}` : prompt },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: MEMORY_SCHEMA,
          temperature: 0.2,
        },
      })
      .then((res) => res.text ?? "");

  // One pass, then one corrective retry if the result doesn't survive validation.
  let lastError = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    const correction =
      attempt === 0
        ? ""
        : `Your previous answer was rejected: ${lastError}\nReturn the full object again, corrected. Every segment needs originalText, numeric startSec/endSec in seconds, and a translation.`;
    try {
      const { text, model } = await callWithFallback(UNDERSTAND_MODELS, runOnce(correction));
      const parsed = JSON.parse(text);
      const { memory, issues } = validateMemory(parsed, meta);

      // The model's timestamps are estimates and they drift. Rebuild the timeline.
      const aligned = alignSegments(memory.segments, {
        durationSec: meta.durationSec,
        silences: Array.isArray(body.silences) ? body.silences : undefined,
      });
      memory.segments = aligned.segments;
      if (aligned.method === "model")
        issues.push(
          "No audio duration was sent, so the model's own timestamps are being used unaligned. Tapping a line may play the wrong sentence."
        );

      const elapsedMs = Date.now() - startedAt;
      console.log(
        `[understand] ${model} · ${(elapsedMs / 1000).toFixed(1)}s · ${memory.segments.length} segments · ` +
          `aligned by ${aligned.method} (max shift ${aligned.maxShiftSec}s) · ${issues.length} issues`
      );
      issues.forEach((i) => console.warn(`[understand] ${i}`));
      return NextResponse.json({ memory, issues, model, elapsedMs, targetLanguage, alignment: aligned.method, maxShiftSec: aligned.maxShiftSec });
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.warn(`[understand] attempt ${attempt + 1} failed: ${lastError}`);
    }
  }

  return NextResponse.json(
    {
      error:
        "We couldn't make sense of that recording. Try again, or upload the file instead.",
      detail: lastError,
    },
    { status: 502 }
  );
}
