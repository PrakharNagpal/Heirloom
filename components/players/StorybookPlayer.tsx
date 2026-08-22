"use client";

import { useEffect, useState } from "react";
import AskHer from "./AskHer";
import HerVoice from "./HerVoice";
import LessonHeader from "./LessonHeader";
import { getPanelImage } from "@/lib/panel-images";
import { t } from "@/lib/ui-strings";
import type { Lang, StorybookPayload } from "@/lib/types";

/**
 * Her memory as six illustrated pages, for a grandchild too young to read a
 * transcript. One card per panel, scrolled — a small child goes through this next
 * to an adult, and a list is easier to share a screen over than a slideshow.
 *
 * The pictures are illustrations, never photographs: we draw the memory rather than
 * manufacture a photograph of her that a family might one day mistake for real.
 */
export default function StorybookPlayer({
  payload,
  memoryId,
  speaker,
  lang,
  activeIndex,
  onPlay,
}: {
  payload: StorybookPayload;
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
        meta={c.panelsMeta}
      />
      <p className="mt-2 text-[14px] text-muted2">{c.drawnNotPhotographed}</p>

      <ol className="mt-5 space-y-4">
        {payload.panels.map((panel, i) => (
          <li key={i} className="card overflow-hidden">
            <Panel memoryId={memoryId} panelIndex={i} imagePrompt={panel.imagePrompt} lang={lang} />
            <div className="flex items-start gap-3 px-4 py-4">
              <span
                aria-hidden
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-kueh text-[15px] font-bold text-white"
              >
                {i + 1}
              </span>
              <p className="min-w-0 flex-1 font-[family-name:var(--font-display)] text-[17px] leading-snug">
                {panel.caption}
              </p>
              <HerVoice
                speaker={speaker}
                lang={lang}
                playing={activeIndex === panel.segmentIndex}
                onPlay={() => onPlay(panel.segmentIndex)}
              />
            </div>
          </li>
        ))}
      </ol>

      {payload.openQuestions.length > 0 && (
        <section className="mt-8">
          {payload.openQuestions.map((q, i) => (
            <AskHer key={i} question={q} lang={lang} />
          ))}
        </section>
      )}
    </div>
  );
}

/** One page. Drawn once per memory, then it comes from the cache forever. */
function Panel({
  memoryId,
  panelIndex,
  imagePrompt,
  lang,
}: {
  memoryId: string;
  panelIndex: number;
  imagePrompt: string;
  lang: Lang;
}) {
  const c = t(lang);
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let revoke: string | null = null;
    let cancelled = false;
    void getPanelImage(memoryId, panelIndex, imagePrompt)
      .then((res) => {
        if (cancelled) return;
        setUrl(res.url);
        if (res.revoke) revoke = res.url;
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [memoryId, panelIndex, imagePrompt]);

  return (
    <div className="relative aspect-3/2 w-full bg-jade-tint">
      {url ? (
        /* eslint-disable-next-line @next/next/no-img-element --
           blob: and object URLs, which the image optimiser cannot fetch or resize. */
        <img
          src={url}
          alt=""
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
          loading={panelIndex < 2 ? "eager" : "lazy"}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
          {failed ? (
            <p className="text-[14.5px] text-muted">{c.couldNotDraw}</p>
          ) : (
            <>
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-line border-t-kueh" />
              <p className="text-[14.5px] text-muted">{c.drawingThis}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
