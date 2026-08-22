"use client";

import { useState } from "react";
import HerVoice from "./HerVoice";
import LessonHeader from "./LessonHeader";
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
  memoryId,
  speaker,
  lang,
  activeIndex,
  onPlay,
}: {
  payload: BranchingPayload;
  memoryId: string;
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
      <LessonHeader
        backHref={`/memory/${memoryId}`}
        backLabel={c.backToHerWords}
        title={`${c.youAre} ${speaker}.`}
        meta={payload.premise}
      />

      <section className="card mt-6 px-4 py-5">
        <p className="text-[17px] leading-relaxed">{node.text}</p>
        <div className="mt-4">
          <HerVoice
            speaker={speaker}
            lang={lang}
            variant="wide"
            playing={activeIndex === node.segmentIndex}
            onPlay={() => onPlay(node.segmentIndex)}
          />
        </div>
      </section>

      {!ended ? (
        <div className="mt-7">
          <p className="text-[12.5px] font-semibold tracking-wide text-muted uppercase">
            {c.whatDoYouDo}
          </p>
          <div role="group" aria-label={c.yourChoices} className="mt-3 grid gap-3">
            {choices.map((c, i) => (
              <button
                key={i}
                onClick={() => setPath((p) => [...p, c.nextId])}
                className="card min-h-12 w-full px-4 py-3.5 text-left text-[16.5px] transition hover:border-kueh"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-7">
          <p
            className={`rounded-[16px] px-4 py-4 text-[16.5px] ${
              isTrueEnding ? "bg-[#eef4e6] text-lacquer" : "bg-sand text-muted"
            }`}
          >
            {isTrueEnding ? c.actuallyDid : c.choseDifferently}
          </p>
          <button
            onClick={() => setPath([payload.nodes[0].id])}
            className="mt-4 min-h-12 w-full rounded-full bg-kueh px-5 font-semibold text-white"
          >
            {c.startOver}
          </button>
        </div>
      )}

      {path.length > 1 && !ended && (
        <button
          onClick={() => setPath((p) => p.slice(0, -1))}
          className="mt-5 min-h-11 text-[14.5px] text-muted underline underline-offset-4"
        >
          {c.undoChoice}
        </button>
      )}
    </div>
  );
}
