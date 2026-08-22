"use client";

import { useState } from "react";
import HerVoice from "./HerVoice";
import { t } from "@/lib/ui-strings";
import type { BranchingPayload, Lang } from "@/lib/types";

/**
 * You play as her, at the age she was, and reach the choice she actually faced.
 *
 * A path she did not take is written as what would have happened — never asserted
 * as her life. Reaching the true ending says so plainly.
 */
export default function BranchingPlayer({
  payload,
  speaker,
  lang,
  activeIndex,
  onPlay,
}: {
  payload: BranchingPayload;
  speaker: string;
  lang: Lang;
  activeIndex: number | null;
  onPlay: (segmentIndex: number) => void;
}) {
  const c = t(lang);
  const [path, setPath] = useState<string[]>([payload.nodes[0]?.id ?? ""]);
  const currentId = path[path.length - 1];
  const node = payload.nodes.find((n) => n.id === currentId) ?? payload.nodes[0];
  const isTrueEnding = node?.id === payload.trueEndingId;
  // Defensive: a lesson cached before the validator dropped these would otherwise
  // show a choice that cannot be pressed instead of the ending.
  const choices = (node?.choices ?? []).filter((c) => c.label && c.nextId);
  const ended = choices.length === 0;

  if (!node) return null;

  return (
    <div>
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-[1.8rem] leading-tight">
          {c.youAre} {speaker}.
        </h1>
        <p className="mt-3 text-rice/65">{payload.premise}</p>
      </header>

      <section className="mt-8 rounded-2xl bg-jade/12 px-5 py-6">
        <p className="text-[1.25rem] leading-relaxed text-rice">{node.text}</p>
        <div className="mt-5">
          <HerVoice
            speaker={speaker}
            lang={lang}
            playing={activeIndex === node.segmentIndex}
            onPlay={() => onPlay(node.segmentIndex)}
            label={c.whereThisCameFrom}
          />
        </div>
      </section>

      {!ended ? (
        <div className="mt-7">
          <p className="font-mono text-[11px] tracking-[0.18em] text-rice/40 uppercase">
            {c.whatDoYouDo}
          </p>
          <div role="group" aria-label={c.yourChoices} className="mt-3 grid gap-3">
            {choices.map((c, i) => (
              <button
                key={i}
                onClick={() => setPath((p) => [...p, c.nextId])}
                className="min-h-12 rounded-2xl border border-jade/40 px-4 py-4 text-left text-rice transition hover:border-kueh hover:bg-jade/20"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-7">
          <p
            className={`rounded-2xl px-4 py-4 ${
              isTrueEnding ? "bg-pandan/20 text-rice" : "bg-jade/12 text-rice/75"
            }`}
          >
            {isTrueEnding ? c.actuallyDid : c.choseDifferently}
          </p>
          <button
            onClick={() => setPath([payload.nodes[0].id])}
            className="mt-4 min-h-12 w-full rounded-full bg-kueh px-5 font-medium text-lacquer"
          >
            {c.startOver}
          </button>
        </div>
      )}

      {path.length > 1 && !ended && (
        <button
          onClick={() => setPath((p) => p.slice(0, -1))}
          className="mt-6 min-h-12 text-sm text-rice/45 underline underline-offset-4"
        >
          {c.undoChoice}
        </button>
      )}
    </div>
  );
}
