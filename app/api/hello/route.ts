import { NextResponse } from "next/server";
import { callWithFallback, credentialMode, gemini, GENERATE_MODELS, UNDERSTAND_MODELS } from "@/lib/gemini";

export const runtime = "nodejs";

/** Phase 0 smoke test: proves the credentials work from a route handler. */
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
      auth: credentialMode(),
      model,
      reply: text.trim(),
      chains: { understand: UNDERSTAND_MODELS, generate: GENERATE_MODELS },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, auth: credentialMode(), error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
