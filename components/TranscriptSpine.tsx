"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang, Segment } from "@/lib/types";

/**
 * Her words, listed. Tap any line and hear her actually say it — that is the whole
 * argument of the product, so the audio has to land on the right sentence. It does
 * because lib/align.ts rebuilt these timestamps from the audio itself.
 */
export default function TranscriptSpine({
  segments,
  lang,
  audioUrl,
  activeIndex,
  onActiveIndexChange,
  onTimeUpdate,
  seekRequest,
}: {
  segments: Segment[];
  lang: Lang;
  audioUrl: string | null;
  activeIndex: number | null;
  onActiveIndexChange: (i: number | null) => void;
  onTimeUpdate?: (sec: number) => void;
  /** A {sec} bumped by the parent when the spine is scrubbed. */
  seekRequest?: { sec: number; nonce: number } | null;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopAt = useRef<number | null>(null);
  const [failed, setFailed] = useState(false);

  // Stop at the end of the tapped segment rather than running into the next one.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => {
      onTimeUpdate?.(el.currentTime);
      if (stopAt.current !== null && el.currentTime >= stopAt.current) {
        el.pause();
        stopAt.current = null;
        onActiveIndexChange(null);
      }
    };
    const onEnded = () => {
      stopAt.current = null;
      onActiveIndexChange(null);
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
    };
  }, [onActiveIndexChange, onTimeUpdate]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !seekRequest) return;
    el.currentTime = seekRequest.sec;
    stopAt.current = null;
    void el.play().catch(() => setFailed(true));
    onActiveIndexChange(null);
  }, [seekRequest, onActiveIndexChange]);

  const play = (i: number) => {
    const el = audioRef.current;
    const seg = segments[i];
    if (!el || !seg) return;
    if (activeIndex === i && !el.paused) {
      el.pause();
      stopAt.current = null;
      onActiveIndexChange(null);
      return;
    }
    el.currentTime = seg.startSec;
    stopAt.current = seg.endSec;
    onActiveIndexChange(i);
    void el.play().catch(() => setFailed(true));
  };

  return (
    <div>
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="auto" />}

      {failed && (
        <p className="mb-4 rounded-xl bg-kueh/15 px-4 py-3 text-sm text-rice/80">
          Her recording won&rsquo;t play on this browser. The words are all still here.
        </p>
      )}

      <ol className="space-y-2">
        {segments.map((seg, i) => {
          const active = activeIndex === i;
          return (
            <li key={i}>
              <button
                onClick={() => play(i)}
                aria-label={`Hear her say line ${i + 1}`}
                className={`w-full rounded-2xl border-l-4 px-4 py-3 text-left transition ${
                  active
                    ? "border-kueh bg-jade/25"
                    : "border-jade/40 bg-jade/10 hover:bg-jade/20"
                }`}
              >
                <span className="mb-1 flex items-center gap-2">
                  <span className="font-mono text-[11px] text-rice/45">
                    {timecode(seg.startSec)}
                  </span>
                  <span className={`text-[11px] ${active ? "text-kueh" : "text-rice/35"}`}>
                    {active ? "playing" : "tap to hear her"}
                  </span>
                </span>

                <span
                  className={`block text-rice ${
                    seg.uncertain
                      ? "decoration-gold underline decoration-dotted decoration-2 underline-offset-4"
                      : ""
                  }`}
                >
                  {seg.originalText}
                </span>

                <span className="mt-1 block text-[0.95rem] text-rice/60">
                  {seg.translations[lang]}
                </span>

                {seg.uncertain && (
                  <span className="mt-2 block text-xs text-gold/90">
                    We&rsquo;re not certain of a word here. Tap to hear her say it.
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function timecode(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec - m * 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
