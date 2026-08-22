"use client";

import { t } from "@/lib/ui-strings";
import type { Lang, Segment } from "@/lib/types";

/**
 * The signature element: her words as a list of rows you can tap.
 *
 * Each row is a dark ▶ button, the segment in the language you are reading, and a
 * mono timestamp. Tapping plays that exact slice of her recording — never a
 * synthesised voice — and the row it is playing takes a sand highlight.
 *
 * Uncertain segments carry a gold caption underneath. That is the dialect-honesty
 * feature and it is permanent, not an error state: the app never quietly guesses at
 * a word the family can check for themselves.
 */
export default function TranscriptSpine({
  segments,
  lang,
  activeIndex,
  failed,
  onPlay,
}: {
  segments: Segment[];
  lang: Lang;
  activeIndex: number | null;
  failed?: boolean;
  onPlay: (i: number) => void;
}) {
  const c = t(lang);
  return (
    <div className="card overflow-hidden">
      {failed && (
        <p className="border-b border-line bg-rose-tint px-4 py-3 text-[14.5px]">{c.wontPlay}</p>
      )}

      <ol>
        {segments.map((seg, i) => {
          const active = activeIndex === i;
          return (
            <li key={i} className={i > 0 ? "border-t border-line" : ""}>
              <button
                onClick={() => onPlay(i)}
                aria-label={`Hear her say line ${i + 1}`}
                className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition ${
                  active ? "bg-sand" : ""
                }`}
              >
                <span
                  aria-hidden
                  className={`mt-0.5 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full text-[13px] ${
                    active ? "bg-kueh text-white" : "bg-lacquer text-rice"
                  }`}
                >
                  {active ? "❚❚" : "▶"}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[16.5px] leading-snug">{seg.originalText}</span>
                  <span className="mt-1 block text-[15px] leading-snug text-muted">
                    {seg.translations[lang]}
                  </span>
                  {seg.uncertain && (
                    <span className="mt-1.5 block text-[12.5px] font-semibold text-gold underline decoration-dotted decoration-from-font underline-offset-[3px]">
                      {c.notCertain}
                    </span>
                  )}
                </span>

                <span className="mt-1 shrink-0 font-mono text-[12.5px] text-muted2">
                  {timecode(seg.startSec)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function timecode(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec - m * 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
