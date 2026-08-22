"use client";

import { useEffect, useRef, useState } from "react";
import { blobToBase64, measureAudio, pickRecorderMime } from "@/lib/audio";
import { readLang, saveMemory } from "@/lib/store";
import { LANGUAGES, SOURCE_LANGUAGES, type Lang, type Memory } from "@/lib/types";

type Stage = "idle" | "recording" | "thinking" | "error";

/** Long enough to be a memory, short enough to stay inside the inline request limit. */
const MAX_SECONDS = 110;

export default function Recorder({ onSaved }: { onSaved: (memory: Memory) => void }) {
  const [stage, setStage] = useState<Stage>("idle");
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
      setError(
        "We can't reach the microphone. Allow it in your browser, or upload a recording instead."
      );
    }
  }

  function stop() {
    recorder.current?.state === "recording" && recorder.current.stop();
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
    setStage("thinking");
    setError(null);
    try {
      // The browser is the only place the true duration and the real pauses exist.
      // Both go to the server, or the timeline can't be rebuilt — see lib/align.ts.
      const facts = await measureAudio(blob);
      // Translate into the language this phone is already reading, and only that
      // one. The others are filled in by /api/translate if anybody switches.
      const saved = readLang();
      const targetLanguage: Lang = (LANGUAGES as readonly string[]).includes(saved ?? "")
        ? (saved as Lang)
        : "en";
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
      onSaved(memory);
    } catch (e) {
      setStage("error");
      setError(e instanceof Error ? e.message : "That didn't work. Try once more.");
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) await understand(file);
  }

  if (stage === "thinking")
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-3 border-jade/30 border-t-kueh" />
        <p className="text-rice">Listening to her.</p>
        <p className="text-sm text-rice/55">
          Working out what she said, and what it means. About half a minute.
        </p>
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-6">
      {stage === "recording" ? (
        <>
          <button
            onClick={stop}
            className="relative flex h-40 w-40 items-center justify-center rounded-full bg-kueh text-lg font-medium text-lacquer"
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full bg-kueh/40"
              style={{ transform: `scale(${1 + level * 0.35})`, transition: "transform 80ms" }}
            />
            <span className="relative">Done</span>
          </button>
          <p className="font-mono text-sm text-rice/60">
            {String(Math.floor(seconds / 60))}:{String(seconds % 60).padStart(2, "0")} · listening
          </p>
          <p className="text-center text-sm text-rice/50">
            Let her finish. Tap Done when she&rsquo;s said everything.
          </p>
        </>
      ) : (
        <>
          <button
            onClick={start}
            className="flex h-40 w-40 items-center justify-center rounded-full bg-kueh text-center text-lg leading-tight font-medium text-lacquer"
          >
            Start
            <br />
            listening
          </button>
          <p className="max-w-[18rem] text-center text-rice/60">
            Ask her one thing, then let her talk. Any language — hers is fine.
          </p>
        </>
      )}

      {error && (
        <p className="rounded-xl bg-kueh/15 px-4 py-3 text-center text-sm text-rice/85">{error}</p>
      )}

      {stage !== "recording" && (
        <div className="flex w-full flex-col items-center gap-4">
          {showLanguages ? (
            <div className="w-full">
              <p className="mb-3 text-center text-sm text-rice/55">
                What is she most likely to speak?
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SOURCE_LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setSourceHint(l.id);
                      setShowLanguages(false);
                    }}
                    className={`min-h-11 rounded-full px-4 py-2 text-sm transition ${
                      sourceHint === l.id
                        ? "bg-kueh text-lacquer"
                        : "bg-jade/15 text-rice/75 hover:bg-jade/25"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-xs text-rice/40">
                Only a hint. She can switch language mid-sentence and it still works.
              </p>
            </div>
          ) : (
            <button
              onClick={() => setShowLanguages(true)}
              className="min-h-11 text-sm text-rice/55 underline underline-offset-4"
            >
              {sourceHint === "auto"
                ? "She speaks a dialect? Tell us which"
                : `Listening for ${SOURCE_LANGUAGES.find((l) => l.id === sourceHint)?.label}`}
            </button>
          )}

          <label className="min-h-11 cursor-pointer pt-2 text-sm text-rice/55 underline underline-offset-4">
            Or use a recording you already have
            <input type="file" accept="audio/*,video/webm" onChange={onFile} className="hidden" />
          </label>
        </div>
      )}
    </div>
  );
}
