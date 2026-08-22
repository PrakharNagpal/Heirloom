"use client";

import AskHer from "./AskHer";
import HerVoice from "./HerVoice";
import { t } from "@/lib/ui-strings";
import type { Lang, PhraseCoachPayload } from "@/lib/types";

/**
 * Her dialect, with her as the pronunciation reference. No synthesised voice
 * anywhere — the model that says the word out loud is her.
 */
export default function PhraseCoachPlayer({
  payload,
  speaker,
  lang,
  activeIndex,
  onPlay,
}: {
  payload: PhraseCoachPayload;
  speaker: string;
  lang: Lang;
  activeIndex: number | null;
  onPlay: (segmentIndex: number) => void;
}) {
  const c = t(lang);
  return (
    <div>
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-[2rem] leading-tight">
          {c.herWords}
        </h1>
        <p className="mt-2 text-rice/60">{c.pronunciationNote}</p>
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
                  {c.when}
                </span>{" "}
                {p.whenToUse}
              </p>
            )}

            {p.askHer && <AskHer question={p.askHer} lang={lang} />}

            <div className="mt-4">
              <HerVoice
                speaker={speaker}
                lang={lang}
                playing={activeIndex === p.segmentIndex}
                onPlay={() => onPlay(p.segmentIndex)}
              />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
