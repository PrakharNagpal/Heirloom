"use client";

import { t } from "@/lib/ui-strings";
import type { Lang, Segment } from "@/lib/types";

/**
 * Her words, listed. Tap any line and hear her actually say it — that is the whole
 * argument of the product, so the audio has to land on the right sentence. It does
 * because lib/align.ts rebuilt these timestamps from the audio itself.
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
    <div>
      {failed && (
        <p className="mb-4 rounded-xl bg-kueh/15 px-4 py-3 text-sm text-rice/80">
          {c.wontPlay}
        </p>
      )}

      <ol className="space-y-2">
        {segments.map((seg, i) => {
          const active = activeIndex === i;
          return (
            <li key={i}>
              <button
                onClick={() => onPlay(i)}
                aria-label={`Hear her say line ${i + 1}`}
                className={`w-full rounded-2xl border-l-4 px-4 py-3 text-left transition ${
                  active ? "border-kueh bg-jade/25" : "border-jade/40 bg-jade/10 hover:bg-jade/20"
                }`}
              >
                <span className="mb-1 flex items-center gap-2">
                  <span className="font-mono text-[11px] text-rice/45">
                    {timecode(seg.startSec)}
                  </span>
                  <span className={`text-[11px] ${active ? "text-kueh" : "text-rice/35"}`}>
                    {active ? c.playing : c.tapToHear}
                  </span>
                </span>

                <span
                  className={`block text-rice ${
                    seg.uncertain
                      ? "decoration-kueh underline decoration-dotted decoration-2 underline-offset-4"
                      : ""
                  }`}
                >
                  {seg.originalText}
                </span>

                <span className="mt-1 block text-[0.95rem] text-rice/60">
                  {seg.translations[lang]}
                </span>

                {seg.uncertain && (
                  <span className="mt-2 block text-xs text-kueh/90">{c.notCertain}</span>
                )}
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
