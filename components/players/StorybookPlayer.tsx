"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import HerVoice from "./HerVoice";
import { getPanelImage } from "@/lib/panel-images";
import { t } from "@/lib/ui-strings";
import type { Lang, StorybookPayload } from "@/lib/types";

/**
 * Her memory as six pages, for a grandchild too young to read a transcript.
 *
 * Swipe or tap through; her real voice sits under every page. The pictures are
 * illustrations, never photographs — we draw the memory rather than manufacture a
 * photograph of her that a family might one day mistake for real.
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
  const [at, setAt] = useState(0);
  const index = Math.min(at, payload.panels.length - 1);
  const panel = payload.panels[index];

  const go = useCallback(
    (delta: number) => setAt((n) => Math.max(0, Math.min(payload.panels.length - 1, n + delta))),
    [payload.panels.length]
  );

  // Swipe, because a six-year-old will try to.
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (!panel) return null;

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-[1.9rem] leading-tight">
          {c.herWords}
        </h1>
        <p className="mt-2 text-sm text-rice/50">{c.drawnNotPhotographed}</p>
      </header>

      <div className="mt-5 flex gap-1" aria-hidden>
        {payload.panels.map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= index ? "bg-kueh" : "bg-jade/25"}`}
          />
        ))}
      </div>

      <figure className="mt-4">
        <Panel
          key={index}
          memoryId={memoryId}
          panelIndex={index}
          imagePrompt={panel.imagePrompt}
          lang={lang}
        />
        <figcaption className="mt-5 text-[1.3rem] leading-snug text-rice">
          {panel.caption}
        </figcaption>
      </figure>

      <div className="mt-5">
        <HerVoice
          speaker={speaker}
          lang={lang}
          playing={activeIndex === panel.segmentIndex}
          onPlay={() => onPlay(panel.segmentIndex)}
        />
      </div>

      <nav className="mt-8 flex items-center gap-3">
        <button
          onClick={() => go(-1)}
          disabled={index === 0}
          className="min-h-12 flex-1 rounded-full border border-jade/40 px-5 text-rice/70 disabled:opacity-30"
        >
          {c.back}
        </button>
        <span className="font-mono text-xs text-rice/40">
          {index + 1} / {payload.panels.length}
        </span>
        <button
          onClick={() => go(1)}
          disabled={index === payload.panels.length - 1}
          className="min-h-12 flex-[2] rounded-full bg-kueh px-5 font-medium text-lacquer disabled:opacity-40"
        >
          {index === payload.panels.length - 1 ? c.theEnd : c.turnThePage}
        </button>
      </nav>
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
    // Clearing the previous page before fetching the next: the effect IS the source
    // of this state, and showing a stale drawing under a new caption is worse.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(null);
    setFailed(false);
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
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-jade/15">
      {url ? (
        /* eslint-disable-next-line @next/next/no-img-element --
           blob: and object URLs, which the image optimiser cannot fetch or resize. */
        <img
          src={url}
          alt=""
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
          {failed ? (
            <p className="text-sm text-rice/60">{c.couldNotDraw}</p>
          ) : (
            <>
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-jade/40 border-t-kueh" />
              <p className="text-sm text-rice/50">{c.drawingThis}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
