"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import BackLink from "@/components/BackLink";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import VoiceSpine from "@/components/VoiceSpine";
import AskHer from "@/components/players/AskHer";
import BranchingPlayer from "@/components/players/BranchingPlayer";
import CookalongPlayer from "@/components/players/CookalongPlayer";
import PhraseCoachPlayer from "@/components/players/PhraseCoachPlayer";
import StorybookPlayer from "@/components/players/StorybookPlayer";
import { getLesson, getMemory, saveLesson, type StoredMemory } from "@/lib/store";
import { useSegmentAudio } from "@/lib/use-segment-audio";
import { FORMAT_NAMES, t } from "@/lib/ui-strings";
import { useLang } from "@/lib/use-lang";
import {
  availableLanguages,
  LANGUAGE_LABELS,
  SHIPPED_FORMATS,
  type BranchingPayload,
  type CookalongPayload,
  type Lang,
  type Lesson,
  type LessonFormat,
  type PhraseCoachPayload,
  type StorybookPayload,
} from "@/lib/types";

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const format = (params.get("format") ?? "cookalong") as LessonFormat;

  const [entry, setEntry] = useState<StoredMemory | null | undefined>(undefined);
  const [lang, setLang] = useLang();
  // Lessons already written are derived, not stored in state: a cached one renders
  // on the first pass with no loading flash, and nothing has to be copied into
  // state when the language changes.
  const [written, setWritten] = useState<Record<string, Lesson>>({});
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { activeIndex, currentSec, failed, playSegment, seek } = useSegmentAudio(entry ?? null);

  // Reading client-only storage after mount: there is no localStorage during SSR,
  // so this cannot be an initial state value.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setEntry(getMemory(id)), [id]);

  const key = `${format}::${lang}`;
  const lesson = useMemo(
    () => (entry ? (written[key] ?? getLesson(entry.memory.id, format, lang)) : null),
    [entry, written, key, format, lang]
  );

  /**
   * A lesson is written once per memory + format + language and kept. Switching to a
   * language it hasn't been written in costs one call, once; every visit after that
   * is instant.
   */
  const write = useCallback(
    async (target: Lang) => {
      if (!entry) return;
      setBuilding(true);
      setError(null);
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ memory: entry.memory, format, language: target }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "That didn't come through.");
        saveLesson(data.lesson);
        setWritten((w) => ({ ...w, [`${format}::${target}`]: data.lesson as Lesson }));
      } catch (e) {
        setError(e instanceof Error ? e.message : "That didn't come through.");
      } finally {
        setBuilding(false);
      }
    },
    [entry, format]
  );

  useEffect(() => {
    // Kicking off a fetch is what an effect is for. write() flips the loading flag on
    // its way to the network, which the rule counts as a synchronous setState; there
    // is no data layer here to hand it to instead.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (entry && !lesson && !building && !error) void write(lang);
  }, [entry, lesson, building, error, lang, write]);

  if (entry === undefined) return <Shell>{null}</Shell>;

  if (entry === null || !SHIPPED_FORMATS.includes(format))
    return (
      <Shell>
        <BackLink href="/">{t(lang).backToStart}</BackLink>
        <h1 className="mt-8 font-[family-name:var(--font-display)] text-3xl">
          {entry === null ? t(lang).gone : t(lang).notYet}
        </h1>
      </Shell>
    );

  const { memory, peaks } = entry;
  const speaker = memory.speakerName;
  const c = t(lang);
  const openQuestions =
    ((lesson?.payload as { openQuestions?: string[] } | undefined)?.openQuestions ?? []).filter(
      Boolean
    );

  return (
    <Shell>
      <BackLink href={`/memory/${memory.id}`}>{c.backToHerWords}</BackLink>
      <p className="font-mono text-[10px] tracking-[0.16em] text-jade uppercase">
        {FORMAT_NAMES[lang][format]}
      </p>

      {/* The spine stays pinned: her voice is the thread through the whole lesson. */}
      <div className="sticky top-0 z-10 -mx-6 mt-3 border-b border-jade/20 bg-lacquer/95 px-6 py-2 backdrop-blur">
        <VoiceSpine
          peaks={peaks}
          durationSec={memory.durationSec}
          currentSec={currentSec}
          activeRange={activeIndex === null ? null : memory.segments[activeIndex]}
          onSeek={seek}
          compact
        />
        {/* The switcher needs the full width at 390px — four language names in four
            scripts do not fit beside a label, and clipping "Bahasa Mela…" reads as
            broken rather than scrollable. */}
        <div className="mt-2">
          <LanguageSwitcher
            lang={lang}
            available={availableLanguages(memory.segments)}
            loading={building ? lang : null}
            onChange={setLang}
          />
        </div>
      </div>

      {failed && (
        <p className="mt-4 rounded-xl bg-kueh/15 px-4 py-3 text-sm text-rice/80">
          {c.wontPlay}
        </p>
      )}

      {/* Rebuilding in another language keeps the old one on screen rather than
          blanking it, so say plainly what is happening. */}
      {building && lesson && (
        <p className="mt-4 rounded-xl bg-jade/20 px-4 py-3 text-sm text-rice/80">
          {c.writingThisIn} {LANGUAGE_LABELS[lang]}. {c.onceOnly}
        </p>
      )}

      <div className={`mt-7 pb-16 transition-opacity ${building && lesson ? "opacity-40" : ""}`}>
        {building && !lesson ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-jade/30 border-t-kueh" />
            <p className="text-rice">{c.makingThis}</p>
            <p className="text-sm text-rice/50">{c.writtenOnce}</p>
          </div>
        ) : error && !lesson ? (
          <div className="py-16">
            <p className="text-rice">{error}</p>
            <button
              onClick={() => void write(lang)}
              className="mt-5 min-h-12 rounded-full bg-kueh px-6 font-medium text-lacquer"
            >
              {c.tryAgain}
            </button>
          </div>
        ) : lesson ? (
          <>
            {/* Keyed on the lesson so switching language starts the new one cleanly
                rather than carrying a step or a story path over from the old one. */}
            {format === "cookalong" && (
              <CookalongPlayer
                key={lesson.id}
                lang={lang}
                payload={lesson.payload as CookalongPayload}
                speaker={speaker}
                activeIndex={activeIndex}
                onPlay={playSegment}
              />
            )}
            {format === "phrasecoach" && (
              <PhraseCoachPlayer
                key={lesson.id}
                lang={lang}
                payload={lesson.payload as PhraseCoachPayload}
                speaker={speaker}
                activeIndex={activeIndex}
                onPlay={playSegment}
              />
            )}
            {format === "storybook" && (
              <StorybookPlayer
                key={lesson.id}
                lang={lang}
                payload={lesson.payload as StorybookPayload}
                memoryId={memory.id}
                speaker={speaker}
                activeIndex={activeIndex}
                onPlay={playSegment}
              />
            )}
            {format === "branching" && (
              <BranchingPlayer
                key={lesson.id}
                lang={lang}
                payload={lesson.payload as BranchingPayload}
                speaker={speaker}
                activeIndex={activeIndex}
                onPlay={playSegment}
              />
            )}

            {openQuestions.length > 0 && (
              <section className="mt-14 border-t border-jade/20 pt-7">
                <h2 className="font-[family-name:var(--font-display)] text-xl">
                  {c.onlyShe}
                </h2>
                <p className="mt-2 text-sm text-rice/50">{c.weLeftThese}</p>
                <div className="mt-4">
                  {openQuestions.map((q, i) => (
                    <AskHer key={i} question={q} lang={lang} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : null}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-[430px] flex-col px-6 py-8">{children}</main>
  );
}
