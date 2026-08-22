"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import Emoji, { type EmojiName } from "@/components/Emoji";
import Icon from "@/components/Icon";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { listMemories, readyFormats, type StoredMemory } from "@/lib/store";
import { useLang } from "@/lib/use-lang";
import { FORMAT_NAMES, t } from "@/lib/ui-strings";
import { LANGUAGES, SHIPPED_FORMATS, type LessonFormat } from "@/lib/types";

/**
 * The library. Home is the front door — hero, the record button, the last few
 * memories. This is everything she has told you, with every way through it laid
 * out, so you can go straight to a lesson instead of via the transcript.
 */
const FORMAT_STYLE: Record<string, { tint: string; icon: EmojiName }> = {
  cookalong: { tint: "bg-rose-tint", icon: "bowl" },
  phrasecoach: { tint: "bg-sand", icon: "speech" },
  storybook: { tint: "bg-jade-tint", icon: "book" },
  branching: { tint: "bg-[#eef1f6]", icon: "shuffle" },
};

export default function StoriesPage() {
  const [memories, setMemories] = useState<StoredMemory[] | null>(null);
  const [lang, setLang] = useLang();
  const c = t(lang);

  // Reading client-only storage after mount: there is no localStorage during SSR,
  // so this cannot be an initial state value.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMemories(listMemories()), []);

  return (
    <main className="with-nav mx-auto max-w-[430px] px-5 pt-8">
      <h1 className="font-[family-name:var(--font-display)] text-[26px] leading-tight font-semibold">
        {c.everythingKept}
      </h1>
      <p className="mt-1.5 text-[15px] text-muted">{c.storiesBlurb}</p>

      <div className="mt-5">
        <LanguageSwitcher lang={lang} available={[...LANGUAGES]} loading={null} onChange={setLang} />
      </div>

      {memories === null ? null : memories.length === 0 ? (
        <p className="mt-8 text-muted">{c.nothingYet}</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {memories.map(({ memory }) => {
            const ready = readyFormats(memory.id);
            return (
              <li key={memory.id} className="card overflow-hidden">
                <Link href={`/memory/${memory.id}`} className="flex items-center gap-3.5 px-4 py-4">
                  <Avatar seed={memory.id} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[16.5px] font-semibold">
                      {memory.titleTranslations?.[lang] ?? memory.titleTranslated}
                    </span>
                    <span className="mt-0.5 block text-[14px] text-muted">
                      {memory.speakerName} · {memory.sourceLanguage} ·{" "}
                      {Math.round(memory.durationSec)}s
                    </span>
                  </span>
                  <Icon name="chevron" size={18} className="shrink-0 text-muted2" />
                </Link>

                {/* Straight into a lesson, without going via the transcript first. */}
                <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3.5">
                  {SHIPPED_FORMATS.map((f) => {
                    const style = FORMAT_STYLE[f] ?? { tint: "bg-sand", icon: "book" as EmojiName };
                    const isReady = ready.includes(f as LessonFormat);
                    return (
                      <Link
                        key={f}
                        href={`/lesson/${memory.id}?format=${f}`}
                        className={`flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-[14px] ${style.tint} ${
                          isReady ? "" : "opacity-60"
                        }`}
                      >
                        <Emoji name={style.icon} size={16} />
                        {FORMAT_NAMES[lang][f]}
                        {isReady && (
                          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-pandan" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
