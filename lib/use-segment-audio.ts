"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { audioUrlFor, type StoredMemory } from "./store";

/**
 * Her recording, addressable by segment. Every player and the transcript share
 * this so "tap a thing, hear her say it" behaves identically everywhere.
 *
 * Playback stops at the end of the segment rather than running into the next one —
 * hearing the following sentence is how a spine stops feeling exact.
 */
export function useSegmentAudio(entry: StoredMemory | null) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [currentSec, setCurrentSec] = useState(0);
  const [failed, setFailed] = useState(false);

  const elRef = useRef<HTMLAudioElement | null>(null);
  const stopAtRef = useRef<number | null>(null);

  // Object URLs die on refresh, so the blob is re-fetched from IndexedDB on mount.
  useEffect(() => {
    if (!entry) return;
    let revoke: string | null = null;
    let cancelled = false;
    void audioUrlFor(entry).then((res) => {
      if (!res || cancelled) return;
      setAudioUrl(res.url);
      if (res.revoke) revoke = res.url;
    });
    return () => {
      cancelled = true;
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [entry]);

  useEffect(() => {
    if (!audioUrl) return;
    const el = new Audio(audioUrl);
    el.preload = "auto";
    // Kept in the document rather than floating free: iOS is happier about
    // resuming a real element, and it stays inspectable from devtools and tests.
    el.hidden = true;
    document.body.appendChild(el);
    elRef.current = el;

    const onTime = () => {
      setCurrentSec(el.currentTime);
      if (stopAtRef.current !== null && el.currentTime >= stopAtRef.current) {
        el.pause();
        stopAtRef.current = null;
        setActiveIndex(null);
      }
    };
    const onEnded = () => {
      stopAtRef.current = null;
      setActiveIndex(null);
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
      el.pause();
      el.remove();
      elRef.current = null;
    };
  }, [audioUrl]);

  const stop = useCallback(() => {
    elRef.current?.pause();
    stopAtRef.current = null;
    setActiveIndex(null);
  }, []);

  /** Play exactly one segment. Tapping the one already playing stops it. */
  const playSegment = useCallback(
    (i: number) => {
      const el = elRef.current;
      const seg = entry?.memory.segments[i];
      if (!el || !seg) return;
      if (activeIndex === i && !el.paused) return stop();
      el.currentTime = seg.startSec;
      stopAtRef.current = seg.endSec;
      setActiveIndex(i);
      void el.play().catch(() => setFailed(true));
    },
    [entry, activeIndex, stop]
  );

  /** Free scrubbing from the waveform — runs on past the segment boundary. */
  const seek = useCallback((sec: number) => {
    const el = elRef.current;
    if (!el) return;
    el.currentTime = sec;
    stopAtRef.current = null;
    setActiveIndex(null);
    void el.play().catch(() => setFailed(true));
  }, []);

  return { audioUrl, activeIndex, currentSec, failed, playSegment, seek, stop };
}
