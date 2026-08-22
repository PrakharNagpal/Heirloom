import { NextResponse } from "next/server";
import { callWithFallback, gemini, GENERATE_MODELS, UNDERSTAND_MODELS } from "@/lib/gemini";

export const runtime = "nodejs";

/** Phase 0 smoke test: proves GEMINI_API_KEY works from a route handler. */
export async function GET() {
  try {
    const ai = gemini();
    const { text, model } = await callWithFallback(GENERATE_MODELS, (m) =>
      ai.models
        .generateContent({
          model: m,
          contents: "Reply with exactly: Heirloom is listening.",
        })
        .then((r) => r.text ?? "")
    );
    return NextResponse.json({
      ok: true,
      model,
      reply: text.trim(),
      chains: { understand: UNDERSTAND_MODELS, generate: GENERATE_MODELS },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
