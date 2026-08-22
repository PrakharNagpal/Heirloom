/**
 * Phase 3 gate. Generates every shipped format from the seeded memory and checks
 * what HEIRLOOM.md says to check — including the two adversarial ones:
 * a deliberately vague memory (does it ask, or invent?) and a broken response
 * (does the retry fire and the fallback render, instead of a white screen?).
 *
 *   npm run gate:generate
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true });

import { writeFileSync } from "node:fs";
import { SEED_MEMORY } from "../lib/seed";
import { buildFallback, validateLesson, LessonInvalid } from "../lib/validate-lesson";
import { SHIPPED_FORMATS, type Lang, type LessonFormat, type Memory } from "../lib/types";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const C = {
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  ok: (s: string) => `\x1b[32m${s}\x1b[0m`,
  warn: (s: string) => `\x1b[33m${s}\x1b[0m`,
  bad: (s: string) => `\x1b[31m${s}\x1b[0m`,
};
const results: [boolean, string][] = [];
const check = (pass: boolean, label: string) => results.push([pass, label]);

async function generate(memory: Memory, format: LessonFormat, language: Lang = "en") {
  const res = await fetch(`${BASE}/api/generate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ memory, format, language }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
  return data as { lesson: { payload: any }; issues: string[]; elapsedMs: number; fallback: boolean; model?: string };
}

/** Every segmentIndex anywhere in a payload, whatever its shape. */
function allIndices(payload: any): number[] {
  const out: number[] = [];
  const walk = (v: any) => {
    if (Array.isArray(v)) return v.forEach(walk);
    if (v && typeof v === "object") {
      if (typeof v.segmentIndex === "number") out.push(v.segmentIndex);
      Object.values(v).forEach(walk);
    }
  };
  walk(payload);
  return out;
}

function elementCount(format: LessonFormat, payload: any): number {
  if (format === "cookalong") return payload.steps?.length ?? 0;
  if (format === "phrasecoach") return payload.phrases?.length ?? 0;
  if (format === "storybook") return payload.panels?.length ?? 0;
  return payload.nodes?.length ?? 0;
}

async function main() {
  const memory = SEED_MEMORY.memory;
  const count = memory.segments.length;
  console.log(C.dim(`\nSeed: "${memory.titleTranslated}" · ${count} segments\n`));

  const outputs: Record<string, unknown> = {};

  for (const format of SHIPPED_FORMATS) {
    let data;
    try {
      data = await generate(memory, format);
    } catch (e) {
      check(false, `${format}: ${e instanceof Error ? e.message : e}`);
      continue;
    }
    const payload = data.lesson.payload as any;
    outputs[format] = payload;

    check(!data.fallback, `${format}: generated, not fallen back to (${(data.elapsedMs / 1000).toFixed(1)}s)`);

    const els = elementCount(format, payload);
    const idx = allIndices(payload);
    check(els > 0, `${format}: ${els} elements`);
    check(
      idx.length >= els,
      `${format}: every element carries a segmentIndex (${idx.length} found for ${els} elements)`
    );
    const outOfRange = idx.filter((i) => !Number.isInteger(i) || i < 0 || i >= count);
    check(
      outOfRange.length === 0,
      `${format}: all indices in range 0–${count - 1}${outOfRange.length ? ` — BAD: ${outOfRange.join(", ")}` : ` (${[...new Set(idx)].sort((a, b) => a - b).join(", ")})`}`
    );
    check(
      new Set(idx).size > 1,
      `${format}: points at ${new Set(idx).size} different moments, not all the same one`
    );

    // Hers, or filler? Her extracted places/people are in her own script, and the
    // lesson is written in English, so compare against the ENGLISH rendering of what
    // she said: distinctive words that appear there and nowhere in a generic recipe.
    const text = JSON.stringify(payload).toLowerCase();
    const herEnglish = memory.segments
      .map((s) => s.translations.en ?? "")
      .join(" ")
      .toLowerCase();
    const generic = new Set(
      "the a an and or but if then you your she her his my our we they it is are was were to of in on at for with from that this have has had will would can could not no do does did make made cook cooked put use used one two three first next after before very much more most all some when what how why who".split(" ")
    );
    const distinctive = [...new Set(herEnglish.match(/[a-z']{4,}/g) ?? [])].filter(
      (w) => !generic.has(w)
    );
    const hits = distinctive.filter((w) => text.includes(w));
    check(
      hits.length >= 3,
      `${format}: uses her own details — ${hits.length} of her distinctive words${hits.length ? ` (${hits.slice(0, 4).join(", ")})` : " — looks like filler"}`
    );

    if (format === "branching") {
      const ids = new Set(payload.nodes.map((n: any) => n.id));
      const dangling = payload.nodes.flatMap((n: any) =>
        n.choices.filter((c: any) => c.nextId && !ids.has(c.nextId)).map(() => n.id)
      );
      check(dangling.length === 0, `branching: no choice leads to a node that doesn't exist`);
      check(ids.has(payload.trueEndingId), `branching: trueEndingId "${payload.trueEndingId}" is a real node`);
    }
    if (format === "storybook") {
      check(els === 6, `storybook: exactly six panels (${els})`);
      const withText = payload.panels.filter((p: any) =>
        /\b(text|letters?|writing|sign)\b/i.test(p.imagePrompt)
      );
      check(withText.length === 0, "storybook: no panel asks for writing inside the picture");
      const longest = Math.max(...payload.panels.map((p: any) => p.caption.split(/\s+/).length));
      check(longest <= 35, `storybook: captions short enough for a 7-year-old (longest ${longest} words)`);
    }
    if (format === "phrasecoach") {
      const off = payload.phrases.filter(
        (p: any) => !memory.segments[p.segmentIndex]?.originalText.includes(p.original)
      );
      check(
        off.length === 0,
        `phrasecoach: every phrase is inside the segment it points at${off.length ? ` (${off.length} are not)` : ""}`
      );
    }
    data.issues.forEach((i) => console.log(C.warn(`  note · ${format}: ${i}`)));
  }

  // ---- the gap prompt, forced ------------------------------------------------
  // A memory with a process but no numbers in it. If it invents a quantity or a
  // time here, the safety claim is not true and must not be said on camera.
  const vague: Memory = {
    ...memory,
    id: "mem_vague",
    title: "汤",
    titleTranslated: "The soup",
    summary: "She says she made a soup with beans and it took a while.",
    emotionalCore: "She misses cooking for a full house.",
    era: null,
    places: [],
    people: [],
    skills: ["making soup"],
    segments: [
      "我们那时候常常煮汤。",
      "要先泡豆子。",
      "然后煮，煮到软。",
      "放一点盐。",
      "全家人一起吃。",
    ].map((originalText, i) => ({
      startSec: i * 4,
      endSec: i * 4 + 4,
      originalText,
      translations: {
        en: [
          "We used to make soup often back then.",
          "You have to soak the beans first.",
          "Then cook them, until they're soft.",
          "Put in a little salt.",
          "The whole family ate together.",
        ][i],
      },
    })),
    suggestedFormats: [{ format: "cookalong", reason: "She describes a process." }],
  };

  try {
    const data = await generate(vague, "cookalong");
    const payload = data.lesson.payload as any;
    outputs.vague = payload;
    const asks = payload.steps.filter((s: any) => s.askHer).length;
    check(
      asks > 0 || payload.openQuestions.length > 0,
      `Gap prompt fires on a vague memory (${asks} steps ask her, ${payload.openQuestions.length} open questions)`
    );

    // She never gave a number. Any number in the output is invented.
    const blob = JSON.stringify({ steps: payload.steps, ingredients: payload.ingredients });
    const invented = (
      blob.match(
        /\b\d+\s*(minute|min|hour|hr|gram|g|kg|ml|litre|liter|cup|tablespoon|teaspoon|tbsp|tsp|degree|°)/gi
      ) ?? []
    ).filter((m: string) => !/\bn"\s*:\s*\d/.test(m));
    check(
      invented.length === 0,
      `Nothing invented where she gave no detail${invented.length ? ` — INVENTED: ${invented.join(", ")}` : ""}`
    );
    const soak = payload.steps.find((s: any) =>
      `${s.instruction} ${s.askHer ?? ""}`.toLowerCase().includes("soak")
    );
    check(
      !soak || Boolean(soak.askHer) || !/\d/.test(soak.instruction),
      `The soaking step asks rather than guesses ("${(soak?.askHer ?? soak?.instruction ?? "").slice(0, 70)}")`
    );
  } catch (e) {
    check(false, `Vague-memory run failed: ${e instanceof Error ? e.message : e}`);
  }

  // ---- break it on purpose ---------------------------------------------------
  // The route's retry needs a live model to exercise, so verify the two things it
  // depends on directly: bad output is rejected, and the fallback is always valid.
  const broken = [
    ['{"steps":[{"n":1,"instruction":"Stir","tip":null,"askHer":null,"segmentIndex":99}]}', "an out-of-range segmentIndex"],
    ['{"steps":[{"n":1,"instruction":"Stir","tip":null,"askHer":null}]}', "a missing segmentIndex"],
    ['{"steps":[]}', "no steps at all"],
  ];
  const caught = broken.filter(([json]) => {
    try {
      validateLesson(JSON.parse(json), "cookalong", memory);
      return false;
    } catch (e) {
      return e instanceof LessonInvalid;
    }
  });
  check(caught.length === broken.length, `Malformed payloads rejected (${caught.length}/${broken.length}: ${broken.map(([, w]) => w).join(", ")})`);

  const fallbacksValid = SHIPPED_FORMATS.every((f) => {
    try {
      validateLesson(buildFallback(f, memory, "en"), f, memory);
      return true;
    } catch {
      return false;
    }
  });
  check(fallbacksValid, "Every fallback payload passes the same validation a real one must");

  writeFileSync("generate-output.json", JSON.stringify(outputs, null, 2));

  console.log(C.bold("\n─── Phase 3 gate ──────────────────────────────────────\n"));
  for (const [pass, label] of results) console.log(`  ${pass ? C.ok("✓") : C.bad("✗")} ${label}`);
  const failed = results.filter(([p]) => !p).length;
  console.log(
    `\n  ${results.length - failed}/${results.length} passed. Full payloads → generate-output.json\n`
  );
  console.log(C.bold("  Still yours to do:"));
  console.log("    · Read one lesson end to end. Her details, or generic filler?\n");
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(C.bad(String(e)));
  process.exit(1);
});
