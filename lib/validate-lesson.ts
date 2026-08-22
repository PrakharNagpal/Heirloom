import type {
  BranchingPayload,
  StorybookPayload,
  CookalongPayload,
  LessonFormat,
  Memory,
  PhraseCoachPayload,
} from "./types";

/**
 * A lesson is only real if every element points at a segment of her speech that
 * actually exists. An out-of-range segmentIndex means silence when a judge taps —
 * the worst failure available, because it looks like the feature is faked.
 *
 * So: throw on anything structural, and let the route retry with the reason. If it
 * still fails, buildFallback() below makes a lesson straight from her segments,
 * which is plainer but true and never renders a white screen.
 */

export class LessonInvalid extends Error {}

const fail = (msg: string): never => {
  throw new LessonInvalid(msg);
};

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const gap = (v: unknown): string | null => str(v) || null;

function segIndex(v: unknown, count: number, where: string): number {
  const n = Number(v);
  if (!Number.isInteger(n)) fail(`${where} has no segmentIndex.`);
  if (n < 0 || n >= count)
    fail(`${where} points at segment ${n}, but there are only ${count} (0–${count - 1}).`);
  return n;
}

export type LessonValidation = { payload: unknown; issues: string[] };

export function validateLesson(
  raw: unknown,
  format: LessonFormat,
  memory: Memory
): LessonValidation {
  if (!raw || typeof raw !== "object") fail("The model returned no object.");
  const count = memory.segments.length;
  const issues: string[] = [];
  const r = raw as Record<string, unknown>;
  const openQuestions = Array.isArray(r.openQuestions)
    ? (r.openQuestions as unknown[]).map(str).filter(Boolean)
    : [];

  if (format === "cookalong") {
    const rawSteps = Array.isArray(r.steps) ? (r.steps as unknown[]) : [];
    if (rawSteps.length === 0) fail("Cook-along came back with no steps.");
    const steps = rawSteps.map((s, i) => {
      const o = (s ?? {}) as Record<string, unknown>;
      const instruction = str(o.instruction);
      if (!instruction) fail(`Step ${i + 1} has no instruction.`);
      return {
        n: i + 1,
        instruction,
        tip: gap(o.tip),
        askHer: gap(o.askHer),
        segmentIndex: segIndex(o.segmentIndex, count, `Step ${i + 1}`),
      };
    });
    const payload: CookalongPayload = {
      dish: str(r.dish) || memory.titleTranslated,
      servings: str(r.servings) || "She didn't say",
      ingredients: Array.isArray(r.ingredients)
        ? (r.ingredients as unknown[]).map(str).filter(Boolean)
        : [],
      steps,
      openQuestions,
    };
    if (payload.ingredients.length === 0)
      issues.push("No ingredients listed — check she actually named some.");
    if (!steps.some((s) => s.askHer) && openQuestions.length === 0)
      issues.push("Nothing was left as a question. Verify no detail was quietly invented.");
    return { payload, issues };
  }

  if (format === "phrasecoach") {
    const rawPhrases = Array.isArray(r.phrases) ? (r.phrases as unknown[]) : [];
    if (rawPhrases.length === 0) fail("Phrase coach came back with no phrases.");
    const phrases = rawPhrases.map((p, i) => {
      const o = (p ?? {}) as Record<string, unknown>;
      const original = str(o.original);
      if (!original) fail(`Phrase ${i + 1} has no original text.`);
      const segmentIndex = segIndex(o.segmentIndex, count, `Phrase ${i + 1}`);
      // Her audio is the pronunciation reference, so the phrase has to be in the
      // segment it claims — otherwise tapping it plays a sentence without the word.
      if (!memory.segments[segmentIndex].originalText.includes(original))
        issues.push(
          `Phrase ${i + 1} ("${original}") is not in segment ${segmentIndex} — tapping it may not play the phrase.`
        );
      return {
        original,
        romanisation: str(o.romanisation),
        meaning: str(o.meaning),
        whenToUse: str(o.whenToUse),
        askHer: gap(o.askHer),
        segmentIndex,
      };
    });
    return { payload: { phrases, openQuestions } as PhraseCoachPayload, issues };
  }

  if (format === "storybook") {
    const raw = Array.isArray(r.panels) ? (r.panels as unknown[]) : [];
    if (raw.length < 3) fail(`A storybook needs six panels; ${raw.length} came back.`);
    const panels = raw.slice(0, 6).map((p, i) => {
      const o = (p ?? {}) as Record<string, unknown>;
      const caption = str(o.caption);
      const imagePrompt = str(o.imagePrompt);
      if (!caption) fail(`Panel ${i + 1} has no caption.`);
      if (!imagePrompt) fail(`Panel ${i + 1} has nothing to draw.`);
      // Text in a generated image comes out garbled, and worse in non-Latin scripts.
      if (/\b(text|words?|letters?|writing|sign|label|caption|title)\b/i.test(imagePrompt))
        issues.push(`Panel ${i + 1} asks for writing in the picture — it will come out garbled.`);
      return {
        caption,
        imagePrompt,
        segmentIndex: segIndex(o.segmentIndex, count, `Panel ${i + 1}`),
      };
    });
    if (panels.length < 6) issues.push(`Only ${panels.length} panels — the book is short.`);
    return { payload: { panels, openQuestions } as StorybookPayload, issues };
  }

  if (format === "branching") {
    const rawNodes = Array.isArray(r.nodes) ? (r.nodes as unknown[]) : [];
    if (rawNodes.length < 2) fail("A branching story needs at least two nodes.");
    const nodes = rawNodes.map((n, i) => {
      const o = (n ?? {}) as Record<string, unknown>;
      const id = str(o.id) || `n${i}`;
      const text = str(o.text);
      if (!text) fail(`Node "${id}" has no text.`);
      return {
        id,
        text,
        segmentIndex: segIndex(o.segmentIndex, count, `Node "${id}"`),
        choices: (Array.isArray(o.choices) ? (o.choices as unknown[]) : []).map((c) => {
          const co = (c ?? {}) as Record<string, unknown>;
          return { label: str(co.label), nextId: str(co.nextId) };
        }),
      };
    });

    const ids = new Set(nodes.map((n) => n.id));
    // A choice has to lead somewhere. An empty nextId is the schema's way of saying
    // "this is the end" — keeping it renders a dead button the reader cannot press,
    // and hides the ending. A nextId naming a node we don't have is a dead end
    // mid-story. Both are dropped, which turns the node into a proper ending.
    for (const n of nodes) {
      n.choices = n.choices.filter((c) => {
        if (!c.label || !c.nextId) return false;
        if (!ids.has(c.nextId)) {
          issues.push(`Node "${n.id}" offered a choice leading nowhere — removed.`);
          return false;
        }
        return true;
      });
    }
    let trueEndingId = str(r.trueEndingId);
    if (!ids.has(trueEndingId)) {
      issues.push(`trueEndingId "${trueEndingId}" is not a node — using the last one.`);
      trueEndingId = nodes[nodes.length - 1].id;
    }
    // Reachability: an ending nobody can walk to is the same as not having one, so
    // this is a hard failure and the route retries with the reason.
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const seen = new Set<string>([nodes[0].id]);
    const queue = [nodes[0].id];
    while (queue.length) {
      // shift() must happen once per visit — hoisted out of any callback, which is
      // where it drained the queue once per node tested instead.
      const cur = byId.get(queue.shift()!);
      for (const c of cur?.choices ?? []) {
        if (c.nextId && !seen.has(c.nextId)) {
          seen.add(c.nextId);
          queue.push(c.nextId);
        }
      }
    }
    if (!seen.has(trueEndingId))
      fail(
        `The true ending "${trueEndingId}" can't be reached from "${nodes[0].id}". Every path must be walkable to what she actually did.`
      );
    const orphans = nodes.filter((n) => !seen.has(n.id)).map((n) => n.id);
    if (orphans.length) issues.push(`Nodes nobody can reach: ${orphans.join(", ")}.`);

    return {
      payload: { premise: str(r.premise), nodes, trueEndingId, openQuestions } as BranchingPayload,
      issues,
    };
  }

  return fail(`No generator for "${format}" yet.`);
}

/**
 * Last resort. Built from her segments directly, so it is plainer than a generated
 * lesson but every word is hers and every segmentIndex is right by construction.
 */
export function buildFallback(format: LessonFormat, memory: Memory, lang: string): unknown {
  const line = (i: number) =>
    memory.segments[i].translations[lang as keyof (typeof memory.segments)[0]["translations"]] ??
    memory.segments[i].originalText;

  if (format === "storybook")
    return {
      panels: memory.segments.slice(0, 6).map((s, i) => ({
        caption: line(i),
        imagePrompt: `${memory.speakerName} in the scene she describes: ${line(i)}`,
        segmentIndex: i,
      })),
      openQuestions: [`Ask ${memory.speakerName} what this looked like.`],
    } satisfies StorybookPayload;

  if (format === "phrasecoach")
    return {
      phrases: memory.segments.slice(0, 6).map((s, i) => ({
        original: s.originalText,
        romanisation: "",
        meaning: line(i),
        whenToUse: "",
        askHer: `Ask ${memory.speakerName} what she means by this.`,
        segmentIndex: i,
      })),
      openQuestions: [`Ask ${memory.speakerName} to say each of these again slowly.`],
    } satisfies PhraseCoachPayload;

  if (format === "branching")
    return {
      premise: memory.summary,
      nodes: memory.segments.slice(0, 4).map((s, i, all) => ({
        id: `n${i}`,
        text: line(i),
        segmentIndex: i,
        choices: i < all.length - 1 ? [{ label: "What happened next?", nextId: `n${i + 1}` }] : [],
      })),
      trueEndingId: `n${Math.min(3, memory.segments.length - 1)}`,
      openQuestions: [`Ask ${memory.speakerName} what she nearly did instead.`],
    } satisfies BranchingPayload;

  return {
    dish: memory.titleTranslated,
    servings: "She didn't say",
    ingredients: memory.skills,
    steps: memory.segments.map((s, i) => ({
      n: i + 1,
      instruction: line(i),
      tip: null,
      askHer: null,
      segmentIndex: i,
    })),
    openQuestions: [`Ask ${memory.speakerName} to walk you through this again.`],
  } satisfies CookalongPayload;
}
