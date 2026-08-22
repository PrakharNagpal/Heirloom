"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BackLink from "@/components/BackLink";
import { useParams, useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import TranscriptSpine from "@/components/TranscriptSpine";
import VoiceSpine from "@/components/VoiceSpine";
import {
  audioUrlFor,
  deleteMemory,
  getMemory,
  readLang,
  updateMemory,
  writeLang,
  type StoredMemory,
} from "@/lib/store";
import { addLanguage } from "@/lib/translate-client";
import {
  availableLanguages,
  FORMAT_LABELS,
  LANGUAGES,
  LANGUAGE_LABELS,
  SHIPPED_FORMATS,
  type Lang,
  type LessonFormat,
} from "@/lib/types";

export default function MemoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [entry, setEntry] = useState<StoredMemory | null | undefined>(undefined);
  const [lang, setLang] = useState<Lang>("en");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [currentSec, setCurrentSec] = useState(0);
  const [seekRequest, setSeekRequest] = useState<{ sec: number; nonce: number } | null>(null);
  const [translating, setTranslating] = useState<Lang | null>(null);
  const [translateError, setTranslateError] = useState<string | null>(null);

  useEffect(() => {
    setEntry(getMemory(id));
    const saved = readLang();
    if (saved && (LANGUAGES as readonly string[]).includes(saved)) setLang(saved as Lang);
  }, [id]);

  // Object URLs die on refresh, so the blob is fetched from IndexedDB every mount.
  useEffect(() => {
    if (!entry) return;
    let revokeUrl: string | null = null;
    let cancelled = false;
    void audioUrlFor(entry).then((res) => {
      if (!res || cancelled) return;
      setAudioUrl(res.url);
      if (res.revoke) revokeUrl = res.url;
    });
    return () => {
      cancelled = true;
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [entry]);

  const available = useMemo(
    () => (entry ? availableLanguages(entry.memory.segments) : []),
    [entry]
  );

  /**
   * Switching to a language she was already translated into is instant and free.
   * A new one costs exactly one text-only call, once — after that it is stored
   * with the memory and switching back and forth spends nothing.
   */
  const changeLang = useCallback(
    async (l: Lang) => {
      if (!entry) return;
      setTranslateError(null);
      if (available.includes(l)) {
        setLang(l);
        writeLang(l);
        return;
      }
      setTranslating(l);
      try {
        const memory = await addLanguage(entry.memory, l);
        updateMemory(memory);
        setEntry({ ...entry, memory });
        setLang(l);
        writeLang(l);
      } catch (e) {
        setTranslateError(
          e instanceof Error ? e.message : "That language didn't come through."
        );
      } finally {
        setTranslating(null);
      }
    },
    [entry, available]
  );

  const suggested = useMemo(() => {
    if (!entry) return [];
    const ranked = entry.memory.suggestedFormats
      .map((f) => f.format)
      .filter((f) => SHIPPED_FORMATS.includes(f));
    return [...new Set([...ranked, ...SHIPPED_FORMATS])];
  }, [entry]);

  if (entry === undefined) return <Shell>{null}</Shell>;

  if (entry === null)
    return (
      <Shell>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">That memory is gone.</h1>
        <p className="mt-3 text-rice/60">It may have been deleted, or saved on another phone.</p>
        <BackLink href="/">Back to the start</BackLink>
      </Shell>
    );

  const { memory, peaks } = entry;
  const activeRange = activeIndex === null ? null : memory.segments[activeIndex];
  // Falls back to English, then to her own words — never to a blank screen.
  const shown: Lang = available.includes(lang) ? lang : (available[0] ?? "en");

  return (
    <Shell>
      <BackLink href="/">Back</BackLink>

      <header className="mt-6">
        <p className="font-mono text-[11px] tracking-[0.18em] text-jade uppercase">
          {memory.speakerName} · {memory.sourceLanguage}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-[2rem] leading-[1.1]">
          {memory.title}
        </h1>
        <p className="mt-1 text-rice/50">
          {memory.titleTranslations?.[shown] ?? memory.titleTranslated}
        </p>
        {memory.emotionalCore && <p className="mt-3 text-rice/60">{memory.emotionalCore}</p>}
      </header>

      {/* The voice spine. Her audio is the thread; everything else hangs off it. */}
      <div className="sticky top-0 z-10 -mx-6 mt-6 bg-lacquer/95 px-6 py-3 backdrop-blur">
        <VoiceSpine
          peaks={peaks}
          durationSec={memory.durationSec}
          currentSec={currentSec}
          activeRange={activeRange}
          onSeek={(sec) => setSeekRequest({ sec, nonce: Date.now() })}
        />
        <div className="mt-3">
          <LanguageSwitcher
            lang={shown}
            available={available}
            loading={translating}
            onChange={(l) => void changeLang(l)}
          />
        </div>
        {translating && (
          <p className="mt-2 text-xs text-rice/50">
            Putting her words into {LANGUAGE_LABELS[translating]}. Once only &mdash; it stays.
          </p>
        )}
        {translateError && <p className="mt-2 text-xs text-kueh">{translateError}</p>}
      </div>

      <section className="mt-6">
        <TranscriptSpine
          segments={memory.segments}
          lang={shown}
          audioUrl={audioUrl}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          onTimeUpdate={setCurrentSec}
          seekRequest={seekRequest}
        />
      </section>

      <section className="mt-12">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          Now make something of it.
        </h2>
        <p className="mt-2 text-sm text-rice/55">
          {memory.suggestedFormats[0]?.reason ?? "Pick how you want to learn this."}
        </p>
        <div className="mt-5 grid gap-3">
          {suggested.map((f) => (
            <FormatCard key={f} format={f} memoryId={memory.id} />
          ))}
          {(["storybook", "quiz", "skillcard"] as LessonFormat[]).map((f) => (
            <div
              key={f}
              className="rounded-2xl border border-jade/20 px-4 py-4 text-rice/30"
              aria-disabled
            >
              {FORMAT_LABELS[f]} <span className="text-xs">· not yet</span>
            </div>
          ))}
        </div>
      </section>

      {!entry.seeded && (
        <button
          onClick={async () => {
            if (!confirm("Delete this memory and her recording? This cannot be undone.")) return;
            await deleteMemory(memory.id);
            router.push("/");
          }}
          className="mt-12 min-h-12 self-start text-left text-sm text-rice/40 underline underline-offset-4"
        >
          Delete this memory and her recording
        </button>
      )}
    </Shell>
  );
}

function FormatCard({ format, memoryId }: { format: LessonFormat; memoryId: string }) {
  return (
    <Link
      href={`/lesson/${memoryId}?format=${format}`}
      className="flex items-center justify-between rounded-2xl bg-jade/15 px-4 py-4 text-rice transition hover:bg-jade/25"
    >
      {FORMAT_LABELS[format]}
      <span aria-hidden className="text-kueh">
        &rarr;
      </span>
    </Link>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-[430px] flex-col px-6 py-8">{children}</main>
  );
}
