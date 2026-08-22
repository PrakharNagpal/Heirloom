// The data model. Spec: HEIRLOOM.md Part 3.
// `segments` is the spine. Every lesson payload references a segmentIndex so the
// player can pull her original audio. A lesson with no segment references is a failure.

export const LANGUAGES = ["en", "zh", "ms", "ta"] as const;
export type Lang = (typeof LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Lang, string> = {
  en: "English",
  zh: "中文",
  ms: "Bahasa Melayu",
  ta: "தமிழ்",
};

export type LessonFormat =
  | "cookalong"
  | "branching"
  | "phrasecoach"
  | "storybook"
  | "quiz"
  | "skillcard";

export type Segment = {
  startSec: number;
  endSec: number;
  originalText: string; // her words, her language
  uncertain?: boolean; // dialect word Gemini isn't sure of
  /**
   * Keyed by language code, and deliberately PARTIAL. She speaks once; the first
   * pass translates into one language only, and the rest are filled in by
   * /api/translate the first time somebody actually switches to them. Translating
   * into four languages nobody reads is most of the output tokens on the call.
   */
  translations: Partial<Record<Lang, string>>;
};

export type SuggestedFormat = {
  format: LessonFormat;
  reason: string;
};

export type Memory = {
  id: string;
  createdAt: string;
  audioUrl: string;
  durationSec: number;
  sourceLanguage: string; // "zh-Hant / Teochew"
  speakerName: string; // "Ah Ma", "Nani", "Lola"
  title: string; // in source language
  titleTranslated: string;
  segments: Segment[]; // the spine
  summary: string;
  era: string | null; // "late 1960s"
  places: string[];
  people: string[];
  skills: string[]; // "making kaya", "haggling"
  emotionalCore: string; // one sentence: what it's really about
  suggestedFormats: SuggestedFormat[];
  /** Translations of the title, filled in alongside the segments. */
  titleTranslations: Partial<Record<Lang, string>>;
};

export type Lesson = {
  id: string;
  memoryId: string;
  format: LessonFormat;
  language: string;
  payload: unknown;
};

// ---- Lesson payload shapes (Phase 3/4 build against these) ----

/** A detail she never gave, rendered as a question instead of a guess. */
export type Gap = string | null;

export type CookalongPayload = {
  dish: string;
  servings: string;
  ingredients: string[];
  steps: {
    n: number;
    instruction: string;
    tip: string | null;
    askHer: Gap;
    segmentIndex: number;
  }[];
  openQuestions: string[];
};

export type BranchingPayload = {
  premise: string;
  nodes: {
    id: string;
    text: string;
    segmentIndex: number;
    choices: { label: string; nextId: string }[];
  }[];
  trueEndingId: string;
  openQuestions: string[];
};

export type PhraseCoachPayload = {
  phrases: {
    original: string;
    romanisation: string;
    meaning: string;
    whenToUse: string;
    askHer: Gap;
    segmentIndex: number;
  }[];
  openQuestions: string[];
};

export type StorybookPayload = {
  panels: { caption: string; imagePrompt: string; segmentIndex: number }[];
  openQuestions: string[];
};

export const FORMAT_LABELS: Record<LessonFormat, string> = {
  cookalong: "Cook along with her",
  branching: "Live her decision",
  phrasecoach: "Learn her words",
  storybook: "Storybook",
  quiz: "How well do you know her?",
  skillcard: "Skill card",
};

// The three we ship. The rest render as honest greyed-out cards.
export const SHIPPED_FORMATS: LessonFormat[] = [
  "cookalong",
  "branching",
  "phrasecoach",
  "storybook",
];

/**
 * What she might be speaking. This is a hint we pass to Gemini, never a
 * restriction — she is free to code-switch mid-sentence and usually will.
 * "auto" is the default so the one-button screen stays one button.
 */
export const SOURCE_LANGUAGES = [
  { id: "auto", label: "She'll just talk" },
  { id: "Teochew (潮州话)", label: "Teochew · 潮州话" },
  { id: "Hokkien (福建话)", label: "Hokkien · 福建话" },
  { id: "Cantonese (广东话)", label: "Cantonese · 广东话" },
  { id: "Hakka (客家话)", label: "Hakka · 客家话" },
  { id: "Mandarin (华语)", label: "Mandarin · 华语" },
  { id: "Malay (Bahasa Melayu)", label: "Melayu" },
  { id: "Tamil (தமிழ்)", label: "தமிழ்" },
  { id: "Malayalam (മലയാളം)", label: "മലയാളം" },
  { id: "English", label: "English" },
] as const;

/** Which languages this memory already has, so the switcher knows what costs a call. */
export function availableLanguages(segments: Segment[]): Lang[] {
  if (segments.length === 0) return [];
  return LANGUAGES.filter((l) => segments.every((s) => Boolean(s.translations[l]?.trim())));
}
