"use client";

import AskHer from "./AskHer";
import HerVoice from "./HerVoice";
import LessonHeader from "./LessonHeader";
import { t } from "@/lib/ui-strings";
import type { CookalongPayload, Lang } from "@/lib/types";

/** Her recipe as cards you can follow standing up, with her voice on every step. */
export default function CookalongPlayer({
  payload,
  memoryId,
  speaker,
  lang,
  activeIndex,
  onPlay,
}: {
  payload: CookalongPayload;
  memoryId: string;
  speaker: string;
  lang: Lang;
  activeIndex: number | null;
  onPlay: (segmentIndex: number) => void;
}) {
  const c = t(lang);

  // The model often names the dish possessively already ("Ah Ma's Mother's Kaya"),
  // and prefixing the speaker again gives "Ah Ma's Ah Ma's Mother's Kaya".
  const dish = payload.dish.includes(speaker)
    ? payload.dish
    : `${speaker}${lang === "en" ? "\u2019s" : " \u00b7"} ${payload.dish}`;

  // "serves 6" reads as a label; "She didn't say" is already a sentence.
  const servings = /^\d/.test(payload.servings)
    ? `${c.serves} ${payload.servings}`
    : payload.servings;

  return (
    <div>
      <LessonHeader
        backHref={`/memory/${memoryId}`}
        backLabel={c.backToHerWords}
        title={`${dish}, ${c.stepByStep}`}
        meta={`${c.tapToHearMeta} · ${servings} · ${c.tapToHearHer}`}
      />

      {payload.ingredients.length > 0 && (
        <section className="card mt-6 px-4 py-4">
          <h2 className="text-[12.5px] font-semibold tracking-wide text-muted uppercase">
            {c.whatSheUsed}
          </h2>
          <ul className="mt-3 space-y-1.5">
            {payload.ingredients.map((it, i) => (
              <li key={i} className="flex gap-2 text-[16px]">
                <span aria-hidden className="text-kueh">
                  ·
                </span>
                {it}
              </li>
            ))}
          </ul>
        </section>
      )}

      <ol className="mt-4 space-y-3">
        {payload.steps.map((step, i) => (
          <li key={i} className="card px-4 py-4">
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pandan text-[15px] font-bold text-white"
              >
                {i + 1}
              </span>
              <p className="min-w-0 flex-1 text-[17px] leading-snug font-semibold">
                {step.instruction}
              </p>
              <HerVoice
                speaker={speaker}
                lang={lang}
                playing={activeIndex === step.segmentIndex}
                onPlay={() => onPlay(step.segmentIndex)}
              />
            </div>

            {step.tip && (
              <p className="mt-3 flex gap-2.5 rounded-[14px] bg-sand px-3.5 py-3 font-[family-name:var(--font-display)] text-[15.5px] leading-snug italic">
                <span aria-hidden className="not-italic">
                  💡
                </span>
                {step.tip}
              </p>
            )}

            {step.askHer && <AskHer question={step.askHer} lang={lang} />}
          </li>
        ))}
      </ol>
    </div>
  );
}
