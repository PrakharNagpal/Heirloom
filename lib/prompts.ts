import { Type } from "@google/genai";
import { LANGUAGE_LABELS, type Lang } from "./types";

// ---------------------------------------------------------------------------
// UNDERSTAND — audio in, Memory out
//
// She speaks once, and we translate into ONE language: the one the person who
// opened the app actually reads. The other three are filled in on demand by
// TRANSLATE below, the first time somebody switches. Translating into four
// languages up front was most of the output tokens on this call, and three
// quarters of it was never read.
// ---------------------------------------------------------------------------

export function understandPrompt(target: Lang, sourceHint?: string): string {
  const language = LANGUAGE_LABELS[target];
  const heard =
    sourceHint && sourceHint !== "auto"
      ? `The family says she is likely speaking ${sourceHint}. Treat that as a hint, not a rule — she may code-switch, and if what you hear is plainly something else, trust your ears.`
      : `You are not told which language she is speaking. Work it out from the audio.`;

  return `You are helping a family preserve a grandparent's spoken memory. You will receive audio of an elder speaking, possibly in a Chinese dialect (Hokkien, Teochew, Cantonese, Hakka), Malay, Tamil, Malayalam, or accented English — often code-switching mid-sentence.

${heard}

Transcribe faithfully in the original language, preserving dialect words rather than normalising them to Mandarin or standard English. Segment at natural sentence boundaries with timestamps. Translate each segment into ${language}, preserving warmth and register — she is a grandmother talking to family, not a narrator.

Then extract: title, summary, era, places, people, and any teachable real-world skills. Identify the emotional core in one sentence — what this memory is actually about beneath the events.

Finally, rank which lesson formats suit this memory, with a one-line reason each. Only recommend a format the content genuinely supports. If she did not describe a process, do not recommend Cook-along.

If you are unsure of a dialect word, mark that segment uncertain rather than guessing.

RULES YOU MUST NOT BREAK:
- Never state a fact she did not say. Do not infer her age, the year, her hometown, or a relationship from context. If she did not say it, leave the field empty or null.
- "era" is null unless she names a time. "places", "people" and "skills" contain only what she actually named. An empty list is a correct answer.
- Timestamps are seconds from the start of the audio, as numbers (e.g. 12.4), not "00:12", running in order without overlapping. Give your best estimate; the app rebuilds the timeline from the audio itself, so segmenting at the right places matters far more than the numbers being exact.
- Segments are one to three sentences. A ninety-second recording should produce roughly 10–25 segments, not 3.
- Transcribe every sentence she speaks. Do not skip, merge or condense any of them, even a short aside. A dropped sentence is a lost memory.
- Keep her script as it is. Do not convert Simplified Chinese to Traditional or the reverse; do not romanise a script that was not romanised.
- Every segment needs a "translation" in ${language}. Translate; do not summarise, tidy, or improve. If she repeats herself or trails off, so does the translation.
- "summary", "emotionalCore" and "titleTranslated" are written in ${language}. "title" stays in her own language.
- Set uncertain: true on a segment when a dialect word is genuinely ambiguous to you. Do not mark every segment, and do not hide a guess by leaving it false.
- Make no inference about her mood, cognitive state, or health. That is not what this is for.
- speakerName: use the name she is called in the recording if one is audible. Otherwise "Ah Ma".
- sourceLanguage: name the language and dialect as precisely as you can hear it, e.g. "zh-Hant / Teochew" or "Malay with English code-switching".`;
}

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
    translation: { type: Type.STRING, description: "This segment in the target language." },
  },
  required: ["startSec", "endSec", "originalText", "uncertain", "translation"],
  propertyOrdering: ["startSec", "endSec", "originalText", "uncertain", "translation"],
};

export const MEMORY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    sourceLanguage: { type: Type.STRING },
    speakerName: { type: Type.STRING },
    title: { type: Type.STRING, description: "In her source language." },
    titleTranslated: { type: Type.STRING, description: "In the target language." },
    summary: { type: Type.STRING, description: "Only what she actually said." },
    era: { type: Type.STRING, nullable: true, description: "Null unless she names a time." },
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
    "sourceLanguage", "speakerName", "title", "titleTranslated", "summary", "era",
    "places", "people", "skills", "emotionalCore", "segments", "suggestedFormats",
  ],
  propertyOrdering: [
    "sourceLanguage", "speakerName", "title", "titleTranslated", "summary", "era",
    "places", "people", "skills", "emotionalCore", "segments", "suggestedFormats",
  ],
};

// ---------------------------------------------------------------------------
// TRANSLATE — one memory into one more language, on demand
// ---------------------------------------------------------------------------

export function translatePrompt(target: Lang, sourceLanguage: string): string {
  const language = LANGUAGE_LABELS[target];
  return `A grandmother recorded a memory in ${sourceLanguage}. Her grandchild wants to read it in ${language}.

You will receive her lines, numbered, in her own words. Return each one in ${language}.

- Keep her warmth and her register. She is a grandmother talking to her family, not a narrator and not a documentary.
- Translate what is there. Do not summarise, tidy, explain, or add a word she did not say.
- If she repeats herself, hesitates or trails off, so does the translation.
- Leave dialect terms for foods, places and family members recognisable rather than replacing them with a generic word.
- Return exactly one translation per line, in the same order, with the same index. Never merge two lines or drop one.
- Also translate the title, the one-line summary and the emotional core into ${language}.`;
}

export const TRANSLATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    summary: { type: Type.STRING },
    emotionalCore: { type: Type.STRING },
    lines: {
      type: Type.ARRAY,
      description: "One entry per input line, same order, same index.",
      items: {
        type: Type.OBJECT,
        properties: {
          index: { type: Type.INTEGER },
          text: { type: Type.STRING },
        },
        required: ["index", "text"],
        propertyOrdering: ["index", "text"],
      },
    },
  },
  required: ["title", "summary", "emotionalCore", "lines"],
  propertyOrdering: ["title", "summary", "emotionalCore", "lines"],
};
