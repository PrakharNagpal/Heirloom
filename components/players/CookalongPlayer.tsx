"use client";

import { useState } from "react";
import AskHer from "./AskHer";
import HerVoice from "./HerVoice";
import type { CookalongPayload } from "@/lib/types";

/** Her recipe as steps, one at a time, with her voice under each one. */
export default function CookalongPlayer({
  payload,
  speaker,
  activeIndex,
  onPlay,
}: {
  payload: CookalongPayload;
  speaker: string;
  activeIndex: number | null;
  onPlay: (segmentIndex: number) => void;
}) {
  const [at, setAt] = useState(0);
  // Clamped, not trusted: a lesson rewritten in another language can be shorter, and
  // an index left over from the previous one would render nothing at all.
  const index = Math.min(at, payload.steps.length - 1);
  const step = payload.steps[index];
  const last = index === payload.steps.length - 1;
  if (!step) return null;

  return (
    <div>
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-[2rem] leading-tight">
          {payload.dish}
        </h1>
        <p className="mt-1 text-sm text-rice/50">Makes: {payload.servings}</p>
      </header>

      {payload.ingredients.length > 0 && (
        <section className="mt-6 rounded-2xl bg-jade/12 px-4 py-4">
          <h2 className="font-mono text-[11px] tracking-[0.18em] text-jade uppercase">
            What she used
          </h2>
          <ul className="mt-3 space-y-1.5 text-rice/85">
            {payload.ingredients.map((it, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="text-kueh">
                  ·
                </span>
                {it}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <p className="font-mono text-[11px] tracking-[0.18em] text-rice/40 uppercase">
          Step {index + 1} of {payload.steps.length}
        </p>

        <div className="mt-2 flex gap-1" aria-hidden>
          {payload.steps.map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= index ? "bg-kueh" : "bg-jade/25"}`}
            />
          ))}
        </div>

        <p className="mt-5 text-[1.35rem] leading-snug text-rice">{step.instruction}</p>

        {step.tip && (
          <p className="mt-4 border-l-2 border-jade/60 pl-4 text-rice/65 italic">{step.tip}</p>
        )}

        {step.askHer && <AskHer question={step.askHer} />}

        <div className="mt-5">
          <HerVoice
            speaker={speaker}
            playing={activeIndex === step.segmentIndex}
            onPlay={() => onPlay(step.segmentIndex)}
          />
        </div>
      </section>

      <nav className="mt-10 flex gap-3">
        <button
          onClick={() => setAt((n) => Math.max(0, n - 1))}
          disabled={index === 0}
          className="min-h-12 flex-1 rounded-full border border-jade/40 px-5 text-rice/70 disabled:opacity-30"
        >
          Back
        </button>
        <button
          onClick={() => setAt((n) => Math.min(payload.steps.length - 1, n + 1))}
          disabled={last}
          className="min-h-12 flex-[2] rounded-full bg-kueh px-5 font-medium text-lacquer disabled:opacity-40"
        >
          {last ? "That's the last step" : "Next step"}
        </button>
      </nav>
    </div>
  );
}
