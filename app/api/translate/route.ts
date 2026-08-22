import { NextResponse } from "next/server";
import { callWithFallback, gemini, GENERATE_MODELS } from "@/lib/gemini";
import { TRANSLATION_SCHEMA, translatePrompt } from "@/lib/prompts";
import { LANGUAGES, type Lang } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * One memory into one more language, the first time somebody asks for it.
 *
 * She speaks once and /api/understand translates into the language the app is
 * already showing. This fills in another only when a real person switches to it —
 * text-only, on the Flash tier, so it costs a fraction of the audio pass.
 */
export type TranslateRequest = {
  targetLanguage: Lang;
  sourceLanguage?: string;
  title?: string;
  summary?: string;
  emotionalCore?: string;
  lines: string[];
};

export async function POST(req: Request) {
  const startedAt = Date.now();
  let body: TranslateRequest;
  try {
    body = (await req.json()) as TranslateRequest;
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const target = body.targetLanguage;
  if (!LANGUAGES.includes(target))
    return NextResponse.json({ error: `Unknown language "${target}".` }, { status: 400 });

  const lines = (body.lines ?? []).map((l) => String(l ?? ""));
  if (lines.length === 0)
    return NextResponse.json({ error: "Nothing to translate." }, { status: 400 });

  const payload = {
    title: body.title ?? "",
    summary: body.summary ?? "",
    emotionalCore: body.emotionalCore ?? "",
    lines: lines.map((text, index) => ({ index, text })),
  };

  const ai = gemini();
  try {
    const { text, model } = await callWithFallback(GENERATE_MODELS, (m) =>
      ai.models
        .generateContent({
          model: m,
          contents: [
            {
              role: "user",
              parts: [
                { text: translatePrompt(target, body.sourceLanguage || "her own language") },
                { text: JSON.stringify(payload) },
              ],
            },
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: TRANSLATION_SCHEMA,
            temperature: 0.3,
          },
        })
        .then((r) => r.text ?? "")
    );

    const parsed = JSON.parse(text) as {
      title?: string;
      summary?: string;
      emotionalCore?: string;
      lines?: { index: number; text: string }[];
    };

    // Index back into place — a reordered or short list must not silently shift
    // every line onto the wrong sentence.
    const out: string[] = new Array(lines.length).fill("");
    for (const l of parsed.lines ?? []) {
      if (Number.isInteger(l?.index) && l.index >= 0 && l.index < out.length)
        out[l.index] = String(l.text ?? "").trim();
    }
    const missing: number[] = [];
    out.forEach((t, i) => !t && missing.push(i));
    if (missing.length > lines.length / 4)
      throw new Error(`${missing.length} of ${lines.length} lines came back empty.`);
    // A few gaps are survivable: show her original rather than a blank line.
    missing.forEach((i) => (out[i] = lines[i]));

    console.log(
      `[translate] ${model} · ${target} · ${lines.length} lines · ${((Date.now() - startedAt) / 1000).toFixed(1)}s`
    );

    return NextResponse.json({
      targetLanguage: target,
      title: (parsed.title ?? "").trim(),
      summary: (parsed.summary ?? "").trim(),
      emotionalCore: (parsed.emotionalCore ?? "").trim(),
      lines: out,
      model,
      elapsedMs: Date.now() - startedAt,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "We couldn't put this into that language just now. Her words are still here.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 }
    );
  }
}
