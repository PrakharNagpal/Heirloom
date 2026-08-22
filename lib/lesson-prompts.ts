import { Type } from "@google/genai";
import { LANGUAGE_LABELS, type Lang, type LessonFormat, type Memory } from "./types";

/**
 * One prompt per format, sharing a preamble.
 *
 * Two rules do the real work here. Every element must carry a segmentIndex, because
 * that is how the grandchild hears her voice inside the lesson — an element without
 * one is silence when a judge taps it. And nothing may be invented: where the memory
 * lacks a detail, the lesson asks the grandchild to go and find out, which turns the
 * model's weakest property into the product's best feature.
 */

function preamble(memory: Memory, target: Lang): string {
  const language = LANGUAGE_LABELS[target];
  return `You are turning a grandparent's memory into an interactive lesson for a grandchild aged 8–25. Write in ${language}. Warm and specific, never saccharine, never generic. Use her actual details — the specific market, the specific year, the specific argument with her sister — not stand-ins.

Every element must include "segmentIndex", pointing at the segment of her speech it came from. This is how the grandchild hears her voice inside the lesson. An element without a segmentIndex is a failure. Valid values are whole numbers from 0 to ${memory.segments.length - 1}.

Do not invent facts she did not say. If the memory lacks the detail a step needs, write that step as a question the grandchild should go and ask her, and put the question in "askHer". That gap is a feature — it starts a conversation. Never guess a quantity, a time, a temperature or a year to fill a hole. A step that says "ask her how long she soaked the beans" is correct; a step that says "soak for two hours" when she never said so is a failure.

Speak about her as "${memory.speakerName}". She spoke in ${memory.sourceLanguage}.
Make no claim about her health, her memory or her state of mind.`;
}

function memoryContext(memory: Memory, target: Lang): string {
  return JSON.stringify({
    speaker: memory.speakerName,
    title: memory.title,
    summary: memory.summary,
    emotionalCore: memory.emotionalCore,
    era: memory.era,
    places: memory.places,
    people: memory.people,
    skills: memory.skills,
    segments: memory.segments.map((s, i) => ({
      segmentIndex: i,
      hers: s.originalText,
      meaning: s.translations[target] ?? s.translations.en ?? s.originalText,
      uncertain: s.uncertain || undefined,
    })),
  });
}

const FORMAT_INSTRUCTIONS: Record<"cookalong" | "branching" | "phrasecoach", string> = {
  cookalong: `Make a cook-along: her recipe as steps someone can actually follow standing in a kitchen.

- Keep her asides. "My mother always added more sugar" belongs in "tip", attached to the step it interrupts.
- "ingredients" lists only what she named. If she never said how much, write the ingredient without a quantity rather than inventing one.
- Steps are in the order she described them. If she doubled back, put it where it belongs in the cooking, not where it fell in the recording.
- Any step where she left out the detail you would need — a time, a heat, an amount — has "askHer" set to the question, and an "instruction" that says plainly what is missing.
- "servings" is her own number, or "She didn't say" — never a guess.`,

  branching: `Make a branching story. The grandchild plays as ${"{speaker}"} at the age she was in this memory, and reaches the choice she actually faced.

- Three to five nodes. Each is a moment, written in second person, present tense: "You are standing in the market and the fish is already turning."
- Choices are real alternatives she could plausibly have taken, not obviously-wrong decoys. Two or three per node.
- Exactly one node is the true ending — what she actually did — and "trueEndingId" names it. It must be reachable.
- Every node's "text" must come from something she said, and "segmentIndex" points at it.
- A node reached by a choice she did not take describes what would have happened without claiming it did. Do not invent a consequence and present it as her life.
- Every "nextId" must be the id of a node in the list, or the empty string for an ending. Do not point at a node you did not write.`,

  phrasecoach: `Make a phrase coach from the words she actually used.

- Pick four to eight phrases she genuinely said — dialect words, idioms, the way she names a food or scolds someone. Not vocabulary from a textbook.
- "original" is exactly as she said it, in her script. "romanisation" is how to say it out loud for someone who cannot read that script; if you are not confident, leave it empty rather than inventing a spelling.
- "meaning" is what it actually means to her, not a dictionary gloss.
- "whenToUse" is the real situation: who you would say it to, and when it would be wrong.
- Prefer segments marked uncertain — those are the ones the family most needs to hear her say.
- Where you are unsure of a term, set "askHer" to the question rather than guessing at it.`,
};

export function lessonPrompt(memory: Memory, format: LessonFormat, target: Lang): string {
  const key = format as keyof typeof FORMAT_INSTRUCTIONS;
  const instructions = (FORMAT_INSTRUCTIONS[key] ?? "").replace("{speaker}", memory.speakerName);
  return `${preamble(memory, target)}

${instructions}

Also return "openQuestions": the things this memory left unanswered that the grandchild should go and ask her. Two to four of them, phrased as questions to say out loud. If the memory is complete enough that nothing is missing, return an empty list rather than padding it.

Here is her memory:
${memoryContext(memory, target)}`;
}

// ---- schemas ---------------------------------------------------------------

const SEGMENT_INDEX = {
  type: Type.INTEGER,
  description: "Which segment of her speech this came from. Required.",
};
const ASK_HER = {
  type: Type.STRING,
  nullable: true,
  description: "A question to go and ask her, when the memory lacks the detail. Never a guess.",
};
const OPEN_QUESTIONS = {
  type: Type.ARRAY,
  items: { type: Type.STRING },
  description: "What to go and ask her. Empty is a valid answer.",
};

const COOKALONG_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    dish: { type: Type.STRING },
    servings: { type: Type.STRING, description: 'Her number, or "She didn\'t say".' },
    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          n: { type: Type.INTEGER },
          instruction: { type: Type.STRING },
          tip: { type: Type.STRING, nullable: true, description: "Her aside, if she made one." },
          askHer: ASK_HER,
          segmentIndex: SEGMENT_INDEX,
        },
        required: ["n", "instruction", "tip", "askHer", "segmentIndex"],
        propertyOrdering: ["n", "instruction", "tip", "askHer", "segmentIndex"],
      },
    },
    openQuestions: OPEN_QUESTIONS,
  },
  required: ["dish", "servings", "ingredients", "steps", "openQuestions"],
  propertyOrdering: ["dish", "servings", "ingredients", "steps", "openQuestions"],
};

const BRANCHING_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    premise: { type: Type.STRING, description: "Second person, sets the scene." },
    nodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING },
          segmentIndex: SEGMENT_INDEX,
          choices: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                nextId: { type: Type.STRING, description: "An id in nodes, or empty to end." },
              },
              required: ["label", "nextId"],
              propertyOrdering: ["label", "nextId"],
            },
          },
        },
        required: ["id", "text", "segmentIndex", "choices"],
        propertyOrdering: ["id", "text", "segmentIndex", "choices"],
      },
    },
    trueEndingId: { type: Type.STRING, description: "The node where she does what she did." },
    openQuestions: OPEN_QUESTIONS,
  },
  required: ["premise", "nodes", "trueEndingId", "openQuestions"],
  propertyOrdering: ["premise", "nodes", "trueEndingId", "openQuestions"],
};

const PHRASECOACH_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    phrases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING, description: "Exactly as she said it." },
          romanisation: { type: Type.STRING, description: "Empty if you are not confident." },
          meaning: { type: Type.STRING },
          whenToUse: { type: Type.STRING },
          askHer: ASK_HER,
          segmentIndex: SEGMENT_INDEX,
        },
        required: ["original", "romanisation", "meaning", "whenToUse", "askHer", "segmentIndex"],
        propertyOrdering: [
          "original", "romanisation", "meaning", "whenToUse", "askHer", "segmentIndex",
        ],
      },
    },
    openQuestions: OPEN_QUESTIONS,
  },
  required: ["phrases", "openQuestions"],
  propertyOrdering: ["phrases", "openQuestions"],
};

export const LESSON_SCHEMAS: Record<string, object> = {
  cookalong: COOKALONG_SCHEMA,
  branching: BRANCHING_SCHEMA,
  phrasecoach: PHRASECOACH_SCHEMA,
};
