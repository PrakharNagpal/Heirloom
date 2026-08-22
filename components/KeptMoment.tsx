"use client";

import { t } from "@/lib/ui-strings";
import type { Lang, Memory } from "@/lib/types";

/**
 * The one place gold-leaf is spent.
 *
 * Everything else in the app is lacquer, jade and kueh-rose. This screen — her
 * memory now kept, and safe — is the only gold, which is what makes it read as the
 * moment rather than as decoration. Use it anywhere else and it stops working.
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
    <div className="flex flex-col items-center gap-7 py-14 text-center">
      <div
        aria-hidden
        className="flex h-24 w-24 items-center justify-center rounded-full border border-gold/50 bg-gold/10"
      >
        <span className="h-10 w-10 rounded-full bg-gold/80" />
      </div>

      <div>
        <h1 className="font-[family-name:var(--font-display)] text-[2.4rem] leading-none text-gold">
          {c.keptHer}
        </h1>
        <p className="mt-4 text-[1.15rem] text-rice">{memory.title}</p>
        <p className="mt-1 text-rice/55">
          {memory.speakerName} · {memory.sourceLanguage} · {Math.round(memory.durationSec)}s
        </p>
      </div>

      <button
        onClick={onContinue}
        className="min-h-12 rounded-full bg-kueh px-8 py-3 text-lg font-medium text-lacquer"
      >
        {c.seeWhatSheSaid}
      </button>
    </div>
  );
}
