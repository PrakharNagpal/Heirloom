"use client";

import Emoji from "@/components/Emoji";
import { t } from "@/lib/ui-strings";
import type { Lang } from "@/lib/types";

/**
 * A detail she never gave, shown as a question instead of a guess.
 *
 * Cream ground, dashed gold-leaf border, and a "?" — deliberately unlike the tip
 * callout beside it, because it is a different kind of thing. Calm, not a warning:
 * this is a permanent feature of an honest transcript, not an error state.
 */
export default function AskHer({ question, lang = "en" }: { question: string; lang?: Lang }) {
  return (
    <p className="mt-3 flex gap-2.5 rounded-[14px] border-[1.5px] border-dashed border-gold bg-[#fdfaf0] px-3.5 py-3 text-[15.5px] leading-snug">
      <Emoji name="question" size={16} className="mt-0.5" />
      <span>
        <span className="mr-1.5 text-[12.5px] font-semibold tracking-wide text-gold uppercase">
          {t(lang).goAskHer}
        </span>
        {question}
      </span>
    </p>
  );
}
