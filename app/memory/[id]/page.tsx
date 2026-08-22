"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import BackLink from "@/components/BackLink";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import TranscriptSpine, { timecode } from "@/components/TranscriptSpine";
import { deleteMemory, getMemory, updateMemory, type StoredMemory } from "@/lib/store";
import { addLanguage } from "@/lib/translate-client";
import { useSegmentAudio } from "@/lib/use-segment-audio";
import { useLang } from "@/lib/use-lang";
import { FORMAT_NAMES, t } from "@/lib/ui-strings";
import {
  availableLanguages,
  LANGUAGE_LABELS,
  SHIPPED_FORMATS,
  type Lang,
  type LessonFormat,
} from "@/lib/types";

/** Tinted surface per format, so the choices read as a set rather than a list. */
const FORMAT_STYLE: Record<string, { tint: string; icon: string }> = {
  cookalong: { tint: "bg-rose-tint", icon: "🥣" },
  phrasecoach: { tint: "bg-sand", icon: "💬" },
  storybook: { tint: "bg-jade-tint", icon: "📖" },
  branching: { tint: "bg-[#eef1f6]", icon: "🔀" },
  quiz: { tint: "bg-sand", icon: "❔" },
  skillcard: { tint: "bg-sand", icon: "🪡" },
};

export default function MemoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [entry, setEntry] = useState<StoredMemory | null | undefined>(undefined);
  const [lang, setLang] = useLang();
  const [translating, setTranslating] = useState<Lang | null>(null);
  const [translateError, setTranslateError] = useState<string | null>(null);

  const { activeIndex, failed, playSegment } = useSegmentAudio(entry ?? null);

  // Reading client-only storage after mount: there is no localStorage or IndexedDB
  // during SSR, so this cannot be an initial state value.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setEntry(getMemory(id)), [id]);

  const available = useMemo(
    () => (entry ? availableLanguages(entry.memory.segments) : []),
    [entry]
  );

  /**
   * Switching to a language she was already translated into is instant and free.
   * A new one costs exactly one text-only call, once — after that it is stored with
   * the memory and switching back and forth spends nothing. Her audio never changes.
   */
  const changeLang = useCallback(
    async (l: Lang) => {
      if (!entry) return;
      setTranslateError(null);
      if (available.includes(l)) return setLang(l);
      setTranslating(l);
      try {
        const memory = await addLanguage(entry.memory, l);
        updateMemory(memory);
        setEntry({ ...entry, memory });
        setLang(l);
      } catch (e) {
        setTranslateError(e instanceof Error ? e.message : t(lang).tryAgain);
      } finally {
        setTranslating(null);
      }
    },
    [entry, available, setLang, lang]
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
        <BackLink href="/">{t(lang).allMemories}</BackLink>
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-[24px] font-semibold">
          {t(lang).gone}
        </h1>
        <p className="mt-2 text-muted">{t(lang).goneSub}</p>
      </Shell>
    );

  const { memory } = entry;
  const c = t(lang);
  const shown: Lang = available.includes(lang) ? lang : (available[0] ?? "en");

  return (
    <Shell>
      <BackLink href="/">{c.allMemories}</BackLink>

      <header className="mt-2 flex items-start gap-3.5">
        <Avatar seed={memory.id} size={56} />
        <div className="min-w-0">
          <h1 className="font-[family-name:var(--font-display)] text-[21px] leading-tight font-semibold">
            {memory.titleTranslations?.[shown] ?? memory.titleTranslated}
          </h1>
          <p className="mt-1 text-[14.5px] text-muted">
            {c.recordedToday} · {timecode(memory.durationSec)} · {memory.sourceLanguage}
          </p>
        </div>
      </header>

      <div className="mt-5">
        <LanguageSwitcher
          lang={shown}
          available={available}
          loading={translating}
          onChange={(l) => void changeLang(l)}
        />
        {translating && (
          <p className="mt-2 text-[13.5px] text-muted">
            {c.translatingInto} {LANGUAGE_LABELS[translating]}. {c.onceOnly}
          </p>
        )}
        {translateError && <p className="mt-2 text-[13.5px] text-kueh">{translateError}</p>}
      </div>

      <section className="mt-5">
        <TranscriptSpine
          segments={memory.segments}
          lang={shown}
          activeIndex={activeIndex}
          failed={failed}
          onPlay={playSegment}
        />
      </section>

      <section className="mt-8">
        <h2 className="font-[family-name:var(--font-display)] text-[19px] font-semibold">
          {c.makeItALesson}
        </h2>
        <div className="mt-4 space-y-3">
          {suggested.map((f) => (
            <FormatCard
              key={f}
              format={f}
              memoryId={memory.id}
              lang={lang}
              reason={memory.suggestedFormats.find((s) => s.format === f)?.reason}
            />
          ))}
          {(["quiz", "skillcard"] as LessonFormat[]).map((f) => (
            <div
              key={f}
              aria-disabled
              className="flex items-center gap-3.5 rounded-[18px] border-[1.5px] border-dashed border-line px-4 py-4 text-muted2"
            >
              <span aria-hidden className="text-[20px] opacity-50">
                {FORMAT_STYLE[f].icon}
              </span>
              <span className="text-[16.5px]">
                {FORMAT_NAMES[lang][f]} · {c.notYet}
              </span>
            </div>
          ))}
        </div>
      </section>

      {!entry.seeded && (
        <button
          onClick={async () => {
            if (!confirm(c.deleteConfirm)) return;
            await deleteMemory(memory.id);
            router.push("/");
          }}
          className="mt-10 min-h-11 text-left text-[14.5px] text-muted underline underline-offset-4"
        >
          {c.deleteMemory}
        </button>
      )}
    </Shell>
  );
}

function FormatCard({
  format,
  memoryId,
  lang,
  reason,
}: {
  format: LessonFormat;
  memoryId: string;
  lang: Lang;
  reason?: string;
}) {
  const style = FORMAT_STYLE[format];
  return (
    <Link
      href={`/lesson/${memoryId}?format=${format}`}
      className={`flex items-center gap-3.5 rounded-[18px] border-[1.5px] border-line px-4 py-4 ${style.tint}`}
    >
      <span aria-hidden className="text-[22px]">
        {style.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[16.5px] font-semibold">{FORMAT_NAMES[lang][format]}</span>
        {reason && <span className="mt-0.5 block truncate text-[14px] text-muted">{reason}</span>}
      </span>
      <span aria-hidden className="text-[20px] text-muted2">
        ›
      </span>
    </Link>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="with-nav mx-auto max-w-[430px] px-5 pt-6">{children}</main>;
}
