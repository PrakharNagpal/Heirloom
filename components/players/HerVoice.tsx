"use client";

import { t } from "@/lib/ui-strings";
import type { Lang } from "@/lib/types";

/**
 * The button that carries the whole product claim: this line came from something
 * she said, and here she is saying it. Her original recording, never a synthesised
 * voice. Every element of every lesson gets one.
 */
export default function HerVoice({
  speaker,
  playing,
  onPlay,
  lang = "en",
  variant = "icon",
}: {
  speaker: string;
  playing: boolean;
  onPlay: () => void;
  lang?: Lang;
  /** "icon" is the small dark circle beside a step; "wide" is a labelled button. */
  variant?: "icon" | "wide";
}) {
  const c = t(lang);
  const label = playing ? c.sheIsSpeaking : c.hearHerSayThis;

  if (variant === "wide")
    return (
      <button
        onClick={onPlay}
        aria-label={`Hear ${speaker} say this`}
        className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[14.5px] font-medium transition ${
          playing ? "bg-kueh text-white" : "bg-sand text-lacquer"
        }`}
      >
        <span aria-hidden>{playing ? "❚❚" : "🔊"}</span>
        {label}
      </button>
    );

  return (
    <button
      onClick={onPlay}
      aria-label={`Hear ${speaker} say this`}
      title={label}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[16px] transition ${
        playing ? "bg-kueh text-white" : "bg-lacquer text-rice"
      }`}
    >
      <span aria-hidden>{playing ? "❚❚" : "🔊"}</span>
    </button>
  );
}
