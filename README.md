# Heirloom

**Heirloom turns a grandparent's spoken story into an interactive lesson their
grandchild actually wants to do — in any language, in her real voice.**

Ah Ma talks for two minutes in Teochew. Heirloom returns a cook-along, a branching
story, or a dialect phrase coach — in English, Mandarin, Malay or Tamil — with her
original audio still attached under every line. Tap any sentence and hear her say it.

The build plan, spec and clock live in [HEIRLOOM.md](./HEIRLOOM.md).

## Why Gemini is essential, not decorative

Her audio goes to Gemini directly. There is no transcription service in between —
which is the only reason this works in a dialect at all. Strip that out and there is
no product, just a voice recorder.

## Running it

```bash
npm install
cp .env.example .env.local     # then fill in ONE of the two auth paths
npm run dev
```

Auth, either way:

- **Vertex AI + ADC** — set `GOOGLE_CLOUD_PROJECT`, then
  `gcloud auth application-default login`. Nothing secret lands in the repo.
- **Gemini API key** — set `GEMINI_API_KEY` from https://aistudio.google.com/apikey.

Vertex wins if both are set. Check it works:

```bash
curl localhost:3000/api/hello        # -> {"ok":true,"auth":"vertex-adc",...}
npm run understand -- public/your-recording.aiff
```

`npm run understand` runs the audio through the UNDERSTAND pass, prints the full
`Memory` with all four translations, runs the Phase 1 gate checks, and writes
`public/spot-check.html` — open that and tap a line to hear the exact slice it
claims those words are in.

## What we found out about audio timestamps

The spine — tap a line, hear her — depends on knowing when each sentence was said.
**Gemini does not measure that. It guesses, and it guesses badly.**

Measured against a 52.7s recording with known sentence boundaries:

| | worst boundary error |
|---|---|
| `gemini-3.1-pro-preview`, raw | **9.9s** — cumulative drift, every line playing the previous one |
| `gemini-3.7-flash`, raw | starts at 0, 5, 10, 15, 20… and a final `endSec` of 70s on a 52.7s file |
| with Vertex's `audioTimestamp: true` | no better — still an arithmetic sequence |
| **after `lib/align.ts`** | **1.0s** |

So we keep what the model is good at — where the sentence breaks are, and what is
said in each — and throw its numbers away. [`lib/align.ts`](./lib/align.ts) rebuilds
the timeline from the audio itself: predict each segment's length from its text,
scaled to the real file duration, then snap each boundary to the nearest real pause.

`public/synthetic-test.aiff` is a machine-generated recording used only to measure
this, because its true boundaries are known to the millisecond. It is a test fixture,
never demo content — the demo uses a real person.

## Safety

- **No invented memories.** Where a lesson needs a detail she didn't give, it renders
  as a question to go and ask her, not a plausible number.
- **Uncertainty is visible.** Dialect words the model isn't sure of are marked, shown
  with a dotted underline, and tappable to hear the original.
- **Her voice is never synthesised.** Translation is a subtitle layer. No cloning —
  a synthetic grandparent voice is not something a family can consent to on behalf of
  someone who may not be around to object.
- Heirloom makes **no inference about cognitive state, mood, or health** from her
  speech, and the prompt forbids it explicitly.

## Stack

Next.js App Router · TypeScript · Tailwind · `@google/genai` from route handlers only.
Mobile-first at 390px — the setting is a grandchild holding a phone next to their
grandmother at a kitchen table.
