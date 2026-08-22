"use client";

import AskHer from "./AskHer";
import HerVoice from "./HerVoice";
import LessonHeader from "./LessonHeader";
import { t } from "@/lib/ui-strings";
import type { Lang, PhraseCoachPayload } from "@/lib/types";

/**
 * Her dialect, with her as the pronunciation reference. Nothing here is a machine
 * voice — the model saying the word is her.
 */
export default function PhraseCoachPlayer({
  payload,
  memoryId,
  speaker,
  lang,
  activeIndex,
  onPlay,
}: {
  payload: PhraseCoachPayload;
  memoryId: string;
  speaker: string;
  lang: Lang;
  activeIndex: number | null;
  onPlay: (segmentIndex: number) => void;
}) {
  const c = t(lang);
  return (
    <div>
      <LessonHeader
        backHref={`/memory/${memoryId}`}
        backLabel={c.backToHerWords}
        title={c.herWords}
        meta={`${payload.phrases.length} · ${c.pronunciationNote}`}
      />

      <ol className="mt-6 space-y-3">
        {payload.phrases.map((p, i) => (
          <li key={i} className="card px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-[family-name:var(--font-display)] text-[19px] leading-tight font-semibold">
                  {p.original}
                </p>
                {p.romanisation && (
                  <p className="mt-1 font-mono text-[13.5px] font-medium text-kueh">
                    {p.romanisation}
                  </p>
                )}
              </div>
              <HerVoice
                speaker={speaker}
                lang={lang}
                playing={activeIndex === p.segmentIndex}
                onPlay={() => onPlay(p.segmentIndex)}
              />
            </div>

            <p className="mt-3 text-[15.5px] leading-snug">{p.meaning}</p>
            {p.whenToUse && (
              <p className="mt-2 text-[15px] leading-snug text-muted">
                <span className="font-semibold">{c.whenToUseIt}</span> {p.whenToUse}
              </p>
            )}
            {p.askHer && <AskHer question={p.askHer} lang={lang} />}
          </li>
        ))}
      </ol>
    </div>
  );
}
