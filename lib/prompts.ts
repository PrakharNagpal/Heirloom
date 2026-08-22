import { Type } from "@google/genai";

// ---------------------------------------------------------------------------
// UNDERSTAND — audio in, Memory out
// ---------------------------------------------------------------------------

export const UNDERSTAND_PROMPT = `You are helping a family preserve a grandparent's spoken memory. You will receive audio of an elder speaking, possibly in a Chinese dialect (Hokkien, Teochew, Cantonese, Hakka), Malay, Tamil, Malayalam, or accented English — often code-switching mid-sentence.

Transcribe faithfully in the original language, preserving dialect words rather than normalising them to Mandarin or standard English. Segment at natural sentence boundaries with timestamps. Translate each segment into English, Mandarin, Malay and Tamil, preserving warmth and register — she is a grandmother talking to family, not a narrator.

Then extract: title, summary, era, places, people, and any teachable real-world skills. Identify the emotional core in one sentence — what this memory is actually about beneath the events.

Finally, rank which lesson formats suit this memory, with a one-line reason each. Only recommend a format the content genuinely supports. If she did not describe a process, do not recommend Cook-along.

If you are unsure of a dialect word, mark that segment uncertain rather than guessing.

RULES YOU MUST NOT BREAK:
- Never state a fact she did not say. Do not infer her age, the year, her hometown, or a relationship from context. If she did not say it, leave the field empty or null.
- "era" is null unless she names a time. "places", "people" and "skills" contain only what she actually named. An empty list is a correct answer.
- Timestamps are seconds from the start of the audio, as numbers (e.g. 12.4), not "00:12". startSec and endSec must cover her speech in order, without overlapping, and each segment must be the slice where those exact words are spoken — a family will tap the line and expect to hear it.
- Segments are one to three sentences. A ninety-second recording should produce roughly 10–25 segments, not 3.
- Fill all four translation keys — "en", "zh", "ms", "ta" — for every segment. Never leave one empty and never copy the English into the others.
- Translate; do not summarise, tidy, or improve. If she repeats herself or trails off, so does the translation.
- Set uncertain: true on a segment when a dialect word is genuinely ambiguous to you. Do not mark every segment, and do not hide a guess by leaving it false.
- Make no inference about her mood, cognitive state, or health. That is not what this is for.
- speakerName: use the name she is called in the recording if one is audible. Otherwise "Ah Ma".
- sourceLanguage: name the language and dialect as precisely as you can hear it, e.g. "zh-Hant / Teochew" or "Malay with English code-switching".`;

const SEGMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    startSec: { type: Type.NUMBER, description: "Seconds from start of audio." },
    endSec: { type: Type.NUMBER, description: "Seconds from start of audio." },
    originalText: {
      type: Type.STRING,
      description: "Her exact words in her own language, dialect preserved.",
    },
    uncertain: {
      type: Type.BOOLEAN,
      description: "True only when a dialect word here is genuinely ambiguous.",
    },
    translations: {
      type: Type.OBJECT,
      description: "All four keys required.",
      properties: {
        en: { type: Type.STRING },
        zh: { type: Type.STRING },
        ms: { type: Type.STRING },
        ta: { type: Type.STRING },
      },
      required: ["en", "zh", "ms", "ta"],
      propertyOrdering: ["en", "zh", "ms", "ta"],
    },
  },
  required: ["startSec", "endSec", "originalText", "uncertain", "translations"],
  propertyOrdering: ["startSec", "endSec", "originalText", "uncertain", "translations"],
};

export const MEMORY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    sourceLanguage: { type: Type.STRING },
    speakerName: { type: Type.STRING },
    title: { type: Type.STRING, description: "In her source language." },
    titleTranslated: { type: Type.STRING, description: "In English." },
    summary: { type: Type.STRING, description: "Only what she actually said." },
    era: {
      type: Type.STRING,
      nullable: true,
      description: "Null unless she names a time.",
    },
    places: { type: Type.ARRAY, items: { type: Type.STRING } },
    people: { type: Type.ARRAY, items: { type: Type.STRING } },
    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
    emotionalCore: { type: Type.STRING, description: "One sentence." },
    segments: { type: Type.ARRAY, items: SEGMENT_SCHEMA },
    suggestedFormats: {
      type: Type.ARRAY,
      description: "Best first. Only formats the content genuinely supports.",
      items: {
        type: Type.OBJECT,
        properties: {
          format: {
            type: Type.STRING,
            enum: ["cookalong", "branching", "phrasecoach", "storybook", "quiz", "skillcard"],
          },
          reason: { type: Type.STRING, description: "One line." },
        },
        required: ["format", "reason"],
        propertyOrdering: ["format", "reason"],
      },
    },
  },
  required: [
    "sourceLanguage",
    "speakerName",
    "title",
    "titleTranslated",
    "summary",
    "era",
    "places",
    "people",
    "skills",
    "emotionalCore",
    "segments",
    "suggestedFormats",
  ],
  propertyOrdering: [
    "sourceLanguage",
    "speakerName",
    "title",
    "titleTranslated",
    "summary",
    "era",
    "places",
    "people",
    "skills",
    "emotionalCore",
    "segments",
    "suggestedFormats",
  ],
};
