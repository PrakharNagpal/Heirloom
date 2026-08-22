"use client";

import AskHer from "./AskHer";
import HerVoice from "./HerVoice";
import type { PhraseCoachPayload } from "@/lib/types";

/**
 * Her dialect, with her as the pronunciation reference. No synthesised voice
 * anywhere — the model that says the word out loud is her.
 */
export default function PhraseCoachPlayer({
  payload,
  speaker,
  activeIndex,
  onPlay,
}: {
  payload: PhraseCoachPayload;
  speaker: string;
  activeIndex: number | null;
  onPlay: (segmentIndex: number) => void;
}) {
  return (
    <div>
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-[2rem] leading-tight">
          Her words
        </h1>
        <p className="mt-2 text-rice/60">
          {payload.phrases.length} things {speaker} said. She is the pronunciation guide &mdash;
          nothing here is a machine voice.
        </p>
      </header>

      <ol className="mt-8 space-y-5">
        {payload.phrases.map((p, i) => (
          <li key={i} className="rounded-2xl bg-jade/12 px-4 py-5">
            <p className="font-[family-name:var(--font-display)] text-[1.6rem] leading-tight text-rice">
              {p.original}
            </p>
            {p.romanisation && (
              <p className="mt-1 font-mono text-sm text-kueh">{p.romanisation}</p>
            )}

            <p className="mt-3 text-rice/85">{p.meaning}</p>

            {p.whenToUse && (
              <p className="mt-3 text-[0.95rem] text-rice/55">
                <span className="font-mono text-[10px] tracking-[0.18em] text-jade uppercase">
                  When
                </span>{" "}
                {p.whenToUse}
              </p>
            )}

            {p.askHer && <AskHer question={p.askHer} />}

            <div className="mt-4">
              <HerVoice
                speaker={speaker}
                playing={activeIndex === p.segmentIndex}
                onPlay={() => onPlay(p.segmentIndex)}
                label={activeIndex === p.segmentIndex ? "Listen" : "Hear her say it"}
              />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
