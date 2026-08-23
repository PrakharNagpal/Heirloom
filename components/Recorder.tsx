"use client";

import { useEffect, useRef, useState } from "react";
import { blobToBase64, measureAudio, pickRecorderMime } from "@/lib/audio";
import Avatar from "@/components/Avatar";
import KeptMoment from "@/components/KeptMoment";
import { saveMemory } from "@/lib/store";
import { t } from "@/lib/ui-strings";
import { SOURCE_LANGUAGES, type Lang, type Memory } from "@/lib/types";

type Stage = "idle" | "recording" | "thinking" | "kept" | "error";

/** A speech-shaped envelope for the live meter — flat bars read as a machine. */
const BARS = [0.35, 0.6, 0.85, 0.5, 1, 0.7, 0.45, 0.9, 0.65, 1, 0.55, 0.8, 0.4, 0.7, 0.3];

/** Long enough to be a memory, short enough to stay inside the inline request limit. */
const MAX_SECONDS = 110;

/**
 * The real ceiling on an upload, and it is not ours.
 *
 * The host rejects a request body over 4.5MB at the edge — before the route runs,
 * so before any sentence we wrote can be returned. Base64 costs a third on top of
 * the bytes, which puts the true limit near 3.3MB of audio. A recording she makes
 * here is capped at MAX_SECONDS and lands well under it; a file the family picks
 * off the phone is not, and without this check a long one fails as a blank error.
 * Refuse it here instead, in her language.
 */
const MAX_UPLOAD_BYTES = Math.floor((4.5 * 1024 * 1024 * 3) / 4) - 8 * 1024;

export default function Recorder({
  lang,
  onSaved,
}: {
  lang: Lang;
  onSaved: (memory: Memory) => void;
}) {
  const c = t(lang);
  const [stage, setStage] = useState<Stage>("idle");
  const [kept, setKept] = useState<Memory | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  // A hint to the model about what she is speaking. Default is "she'll just talk",
  // so her screen stays one button; naming a dialect only sharpens the transcript.
  const [sourceHint, setSourceHint] = useState<string>("auto");
  const [showLanguages, setShowLanguages] = useState(false);

  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const stream = useRef<MediaStream | null>(null);
  const meter = useRef<{ ctx: AudioContext; raf: number } | null>(null);

  useEffect(() => () => teardown(), []);

  function teardown() {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    if (meter.current) {
      cancelAnimationFrame(meter.current.raf);
      void meter.current.ctx.close();
      meter.current = null;
    }
  }

  async function start() {
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = s;

      // A live level meter, so she can see the app is hearing her.
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(s).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let peak = 0;
        for (const v of data) peak = Math.max(peak, Math.abs(v - 128) / 128);
        setLevel(peak);
        meter.current = { ctx, raf: requestAnimationFrame(tick) };
      };
      meter.current = { ctx, raf: requestAnimationFrame(tick) };

      const mimeType = pickRecorderMime();
      const rec = new MediaRecorder(s, mimeType ? { mimeType } : undefined);
      chunks.current = [];
      rec.ondataavailable = (e) => e.data.size > 0 && chunks.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunks.current, { type: rec.mimeType || "audio/webm" });
        teardown();
        void understand(blob);
      };
      recorder.current = rec;
      rec.start();
      setSeconds(0);
      setStage("recording");
    } catch {
      setStage("error");
      setError(c.micRefused);
    }
  }

  function stop() {
    if (recorder.current?.state === "recording") recorder.current.stop();
  }

  useEffect(() => {
    if (stage !== "recording") return;
    const t = setInterval(() => {
      setSeconds((s) => {
        if (s + 1 >= MAX_SECONDS) stop();
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [stage]);

  async function understand(blob: Blob) {
    if (blob.size > MAX_UPLOAD_BYTES) {
      setStage("error");
      setError(c.recordingTooBig);
      return;
    }
    setStage("thinking");
    setError(null);
    try {
      // The browser is the only place the true duration and the real pauses exist.
      // Both go to the server, or the timeline can't be rebuilt — see lib/align.ts.
      const facts = await measureAudio(blob);
      // Translate into the language this phone is already reading, and only that
      // one. The others are filled in by /api/translate if anybody switches.
      const targetLanguage: Lang = lang;
      const res = await fetch("/api/understand", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          audioBase64: await blobToBase64(blob),
          mimeType: blob.type,
          durationSec: facts.durationSec,
          silences: facts.silences,
          targetLanguage,
          sourceLanguageHint: sourceHint,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "That didn't work.");

      const memory = data.memory as Memory;
      await saveMemory({ memory, peaks: facts.peaks }, blob);
      setKept(memory);
      setStage("kept");
    } catch (e) {
      setStage("error");
      setError(e instanceof Error ? e.message : c.tryAgain);
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) await understand(file);
  }

  if (stage === "kept" && kept)
    return <KeptMoment memory={kept} lang={lang} onContinue={() => onSaved(kept)} />;

  if (stage === "thinking")
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <div className="h-11 w-11 animate-spin rounded-full border-2 border-line border-t-kueh" />
        <p className="text-[17px]">{c.thinking}</p>
        <p className="max-w-[17rem] text-[14.5px] text-muted">{c.thinkingSub}</p>
      </div>
    );

  const recording = stage === "recording";

  return (
    <div className="flex w-full flex-col items-center">
      {/* Her, mid-story. A placeholder for the family's own photograph. */}
      <Avatar seed="recording" size={128} />

      <p className="mt-7 px-2 text-center font-[family-name:var(--font-display)] text-[22px] leading-snug italic">
        &ldquo;{c.askHerHow}&rdquo;
      </p>
      <p className="mt-3 text-center text-[15px] text-muted">{c.askHerOneQuestion}</p>

      {/* Live level, so she can see it is hearing her. */}
      <div aria-hidden className="mt-9 flex h-16 items-center justify-center gap-[3px]">
        {BARS.map((base, i) => {
          // At rest it still reads as a waveform; a flat row of dots looks broken.
          const height = recording
            ? Math.max(6, Math.min(64, base * (0.35 + level * 2.6) * 64))
            : Math.max(5, base * 16);
          return (
            <span
              key={i}
              style={{ height, transition: "height 90ms linear" }}
              className={`w-[3px] rounded-full ${recording ? "bg-kueh" : "bg-kueh/35"}`}
            />
          );
        })}
      </div>

      <button
        onClick={recording ? stop : start}
        aria-label={recording ? c.done : c.startListening.replace("\n", " ")}
        className="mt-9 flex h-[84px] w-[84px] items-center justify-center rounded-full border-[6px] border-white bg-kueh shadow-[0_10px_28px_rgba(217,106,138,0.35)]"
      >
        <span
          aria-hidden
          className={`bg-white transition-all ${recording ? "h-7 w-7 rounded-[6px]" : "h-0 w-0"}`}
        />
      </button>

      <p className="mt-5 text-[15px] text-muted">
        {recording
          ? `${c.tapToFinish} · ${String(Math.floor(seconds / 60))}:${String(seconds % 60).padStart(2, "0")}`
          : c.justPressPlay}
      </p>

      {error && (
        <p className="mt-6 rounded-[14px] bg-rose-tint px-4 py-3 text-center text-[14.5px]">
          {error}
        </p>
      )}

      {!recording && (
        <div className="mt-8 flex w-full flex-col items-center gap-4">
          {showLanguages ? (
            <div className="w-full">
              <p className="mb-3 text-center text-[14.5px] text-muted">{c.whichLanguage}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SOURCE_LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setSourceHint(l.id);
                      setShowLanguages(false);
                    }}
                    className={`min-h-11 rounded-full px-4 text-[14.5px] transition ${
                      sourceHint === l.id ? "bg-kueh text-white" : "bg-sand text-muted"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-[13px] text-muted2">{c.onlyAHint}</p>
            </div>
          ) : (
            <button
              onClick={() => setShowLanguages(true)}
              className="min-h-11 text-[14.5px] text-muted underline underline-offset-4"
            >
              {sourceHint === "auto"
                ? c.dialectPrompt
                : `${c.listening} · ${SOURCE_LANGUAGES.find((l) => l.id === sourceHint)?.label}`}
            </button>
          )}

          <label className="min-h-11 cursor-pointer pt-1 text-[14.5px] text-muted underline underline-offset-4">
            {c.useExisting}
            <input type="file" accept="audio/*,video/webm" onChange={onFile} className="hidden" />
          </label>
        </div>
      )}
    </div>
  );
}
