import { GoogleGenAI } from "@google/genai";

// Model IDs verified against ai.google.dev. Never trust a hardcoded string in a
// doc — override from env if the API tells you otherwise.
//
// The audio pass is where dialect accuracy lives, so it gets the Pro tier and
// falls back down the chain if a preview id isn't enabled on this key.
export const UNDERSTAND_MODELS = (
  process.env.GEMINI_UNDERSTAND_MODEL ??
  "gemini-3.1-pro-preview,gemini-3.7-flash,gemini-2.5-pro"
)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

// Lesson generation is a writing task against a fixed schema. Flash tier.
export const GENERATE_MODELS = (
  process.env.GEMINI_GENERATE_MODEL ?? "gemini-3.7-flash,gemini-2.5-flash"
)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

let client: GoogleGenAI | null = null;

export function gemini(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Put it in .env.local (and in the Vercel dashboard for the deploy)."
    );
  }
  if (!client) client = new GoogleGenAI({ apiKey });
  return client;
}

/** A model id is unusable on this key — try the next one in the chain. */
function isModelUnavailable(err: unknown): boolean {
  const msg = String((err as Error)?.message ?? err);
  return (
    /NOT_FOUND/i.test(msg) ||
    /is not found for API version/i.test(msg) ||
    /PERMISSION_DENIED/i.test(msg) ||
    /does not (have access|support)/i.test(msg) ||
    /\b404\b/.test(msg)
  );
}

/** Transient — worth one automatic retry. */
function isTransient(err: unknown): boolean {
  const msg = String((err as Error)?.message ?? err);
  return /\b(429|500|502|503|504)\b/.test(msg) || /UNAVAILABLE|RESOURCE_EXHAUSTED|overloaded/i.test(msg);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Walk the model chain; one automatic retry per model on transient errors.
 * Returns the raw text plus which model actually answered, so the caller can log it.
 */
export async function callWithFallback(
  models: string[],
  run: (model: string) => Promise<string>
): Promise<{ text: string; model: string }> {
  let lastErr: unknown;
  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return { text: await run(model), model };
      } catch (err) {
        lastErr = err;
        if (isModelUnavailable(err)) break; // next model, don't retry this one
        if (attempt === 0 && isTransient(err)) {
          await sleep(1200);
          continue;
        }
        break;
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}
