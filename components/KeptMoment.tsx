"use client";

import { t } from "@/lib/ui-strings";
import type { Lang, Memory } from "@/lib/types";

/**
 * Gold-leaf is reserved for two things: the gap prompts, and this — the moment her
 * memory is kept. Nowhere else. A colour used everywhere stops meaning anything.
 */
export default function KeptMoment({
  memory,
  lang,
  onContinue,
}: {
  memory: Memory;
  lang: Lang;
  onContinue: () => void;
}) {
  const c = t(lang);
  return (
    <div className="flex flex-col items-center gap-7 py-10 text-center">
      <span
        aria-hidden
        className="flex h-24 w-24 items-center justify-center rounded-full border border-gold/50 bg-gold/10"
      >
        <span className="h-10 w-10 rounded-full bg-gold/85" />
      </span>

      <div>
        <h1 className="font-[family-name:var(--font-display)] text-[38px] leading-none font-semibold text-gold">
          {c.keptHer}
        </h1>
        <p className="mt-4 text-[17px] text-rice">{memory.title}</p>
        <p className="mt-1 text-[14.5px] text-teal-muted">
          {memory.speakerName} · {memory.sourceLanguage} · {Math.round(memory.durationSec)}s
        </p>
      </div>

      <button
        onClick={onContinue}
        className="min-h-[56px] rounded-full bg-kueh px-8 text-[17px] font-semibold text-white"
      >
        {c.seeWhatSheSaid}
      </button>
    </div>
  );
}
