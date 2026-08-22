"use client";

import { t } from "@/lib/ui-strings";
import type { Lang } from "@/lib/types";

/**
 * The button that carries the whole product claim: this line came from something
 * she said, and here she is saying it. Every element of every lesson gets one.
 */
export default function HerVoice({
  speaker,
  playing,
  onPlay,
  lang = "en",
  label,
}: {
  speaker: string;
  playing: boolean;
  onPlay: () => void;
  lang?: Lang;
  label?: string;
}) {
  const c = t(lang);
  return (
    <button
      onClick={onPlay}
      aria-label={`Hear ${speaker} say this`}
      className={`inline-flex min-h-12 items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
        playing ? "bg-kueh text-lacquer" : "bg-jade/25 text-rice/85 hover:bg-jade/40"
      }`}
    >
      <span aria-hidden className="text-base leading-none">
        {playing ? "❚❚" : "▶"}
      </span>
      {playing ? c.sheIsSpeaking : (label ?? c.hearHerSayThis)}
    </button>
  );
}
