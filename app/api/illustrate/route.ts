import { NextResponse } from "next/server";
import { callWithFallback, gemini } from "@/lib/gemini";
import { STORYBOOK_STYLE } from "@/lib/lesson-prompts";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * One storybook panel, drawn.
 *
 * The same fixed style is appended to every prompt so six independent calls come
 * back looking like one book rather than six. Illustration, never a photograph —
 * we draw the memory, we do not manufacture a photograph of a real woman that her
 * family might one day mistake for real.
 *
 * Images do not depend on the reading language: the caption changes, the scene does
 * not. So a panel is drawn once per memory and reused across all four languages.
 */
const IMAGE_MODELS = (
  process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image,gemini-3-pro-image"
)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

export type IllustrateRequest = {
  imagePrompt: string;
  /**
   * Pin every panel of one book to the model that drew its first page. Two models
   * do not draw the same world — one produced a 1960s Singapore kitchen and the
   * other a European one at a different aspect ratio, in the same six-page book.
   */
  model?: string;
};

export async function POST(req: Request) {
  const startedAt = Date.now();
  let body: IllustrateRequest;
  try {
    body = (await req.json()) as IllustrateRequest;
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const scene = (body.imagePrompt ?? "").trim();
  if (!scene) return NextResponse.json({ error: "Nothing to draw." }, { status: 400 });

  const ai = gemini();
  const chain = body.model ? [body.model] : IMAGE_MODELS;

  /**
   * Image models intermittently answer with text instead of a picture — a stray
   * thought, or a soft refusal on something entirely ordinary like "slicing palm
   * sugar with a knife". The same prompt then works on the next call, so an empty
   * answer is worth retrying before giving up on the page.
   */
  const ATTEMPTS = 3;
  try {
    let lastText = "";
    for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
      try {
        const { text, model } = await callWithFallback(chain, async (m) => {
          const res = await ai.models.generateContent({
            model: m,
            contents: `${scene}\n\n${STORYBOOK_STYLE}`,
            config: {
              responseModalities: ["IMAGE"],
              // 3:2, always. Panels of different shapes in one book read as broken.
              imageConfig: { aspectRatio: "3:2" },
            },
          });
          const parts = res.candidates?.[0]?.content?.parts ?? [];
          const part = parts.find((p) => p.inlineData);
          const data = part?.inlineData?.data;
          if (!data) {
            lastText = parts.map((p) => p.text ?? "").join(" ").trim().slice(0, 160);
            throw new Error(`No picture came back${lastText ? `: ${lastText}` : "."}`);
          }
          return `${part?.inlineData?.mimeType ?? "image/png"}|${data}`;
        });

        const [mimeType, data] = text.split("|");
        console.log(
          `[illustrate] ${model} · ${((Date.now() - startedAt) / 1000).toFixed(1)}s` +
            (attempt ? ` · after ${attempt} empty ${attempt === 1 ? "answer" : "answers"}` : "")
        );
        return NextResponse.json({ mimeType, data, model, elapsedMs: Date.now() - startedAt });
      } catch (err) {
        if (attempt === ATTEMPTS - 1) throw err;
        // Say what actually happened — an empty answer and a rate limit look
        // identical from here otherwise, and they need different responses.
        console.warn(
          `[illustrate] attempt ${attempt + 1} failed, retrying: ${
            err instanceof Error ? err.message.slice(0, 140).replace(/\n/g, " ") : err
          }`
        );
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      }
    }
    throw new Error("Out of attempts.");
  } catch (err) {
    return NextResponse.json(
      {
        error: "We couldn't draw that one. The words are still here.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 }
    );
  }
}
