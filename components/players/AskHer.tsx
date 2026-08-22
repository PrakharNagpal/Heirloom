"use client";

import { t } from "@/lib/ui-strings";
import type { Lang } from "@/lib/types";

/**
 * A detail she never gave, shown as a question instead of a guess.
 *
 * This is the safety behaviour made visible: the app does not fill the hole, it
 * hands the hole back as a reason to talk to her. Dashed rather than solid, because
 * it is deliberately unfinished — and in kueh-rose, which throughout the app means
 * "you are needed here". Gold is spent once, on the memory being kept, and nowhere
 * else; a colour used twice stops meaning anything.
 */
export default function AskHer({ question, lang = "en" }: { question: string; lang?: Lang }) {
  return (
    <p className="mt-3 rounded-xl border border-dashed border-kueh/70 bg-kueh/8 px-4 py-3 text-[0.95rem] text-rice/90">
      <span className="mr-2 font-mono text-[10px] tracking-[0.18em] text-kueh uppercase">
        {t(lang).goAskHer}
      </span>
      {question}
    </p>
  );
}
