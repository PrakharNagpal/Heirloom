import { GoogleGenAI } from "@google/genai";

// Model IDs verified against ai.google.dev. Never trust a hardcoded string in a
// doc — run `npm run models` and let the API tell you what this credential has.
//
// The audio pass is where dialect accuracy lives, so it gets the Pro tier and
// falls back down the chain if a preview id isn't enabled here.
export const UNDERSTAND_MODELS = split(
  process.env.GEMINI_UNDERSTAND_MODEL ??
    "gemini-3.1-pro-preview,gemini-3.7-flash,gemini-2.5-pro"
);

// Lesson generation is a writing task against a fixed schema. Flash tier.
export const GENERATE_MODELS = split(
  process.env.GEMINI_GENERATE_MODEL ?? "gemini-3.7-flash,gemini-2.5-flash"
);

function split(v: string): string[] {
  return v.split(",").map((m) => m.trim()).filter(Boolean);
}

let client: GoogleGenAI | null = null;

/**
 * Two ways in, and we take whichever is configured:
 *
 *  - Vertex AI with Application Default Credentials — set GOOGLE_CLOUD_PROJECT.
 *    Auth comes from `gcloud auth application-default login` or from a service
 *    account JSON pointed at by GOOGLE_APPLICATION_CREDENTIALS. No key in the repo.
 *  - Gemini API with a key — set GEMINI_API_KEY.
 *
 * Vertex wins if both are present. Either way this only ever runs server-side.
 */
export function gemini(): GoogleGenAI {
  if (client) return client;

  const project = process.env.GOOGLE_CLOUD_PROJECT?.trim();
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (project) {
    client = new GoogleGenAI({
      vertexai: true,
      project,
      location: process.env.GOOGLE_CLOUD_LOCATION?.trim() || "global",
    });
    return client;
  }

  if (apiKey) {
    client = new GoogleGenAI({ apiKey });
    return client;
  }

  throw new Error(
    "No Gemini credentials. Either set GOOGLE_CLOUD_PROJECT in .env.local and " +
      "authenticate with ADC, or set GEMINI_API_KEY."
  );
}

/** Which path we're on — the smoke-test route reports this. */
export function credentialMode(): "vertex-adc" | "api-key" | "none" {
  if (process.env.GOOGLE_CLOUD_PROJECT?.trim()) return "vertex-adc";
  if (process.env.GEMINI_API_KEY?.trim()) return "api-key";
  return "none";
}

/** A model id is unusable on this credential — try the next one in the chain. */
function isModelUnavailable(err: unknown): boolean {
  const msg = String((err as Error)?.message ?? err);
  return (
    /NOT_FOUND/i.test(msg) ||
    /is not found for API version/i.test(msg) ||
    /was not found or your project does not have access/i.test(msg) ||
    /PERMISSION_DENIED/i.test(msg) ||
    /does not (have access|support)/i.test(msg) ||
    /\b404\b/.test(msg)
  );
}

/** Transient — worth one automatic retry. */
function isTransient(err: unknown): boolean {
  const msg = String((err as Error)?.message ?? err);
  return (
    /\b(429|500|502|503|504)\b/.test(msg) ||
    /UNAVAILABLE|RESOURCE_EXHAUSTED|overloaded/i.test(msg)
  );
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Walk the model chain; one automatic retry per model on transient errors.
 * Returns the text plus which model actually answered, so the caller can log it.
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
