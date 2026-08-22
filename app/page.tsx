"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import Emoji from "@/components/Emoji";
import Icon from "@/components/Icon";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { listMemories, SEED_LESSON_COUNT, type StoredMemory } from "@/lib/store";
import { useLang } from "@/lib/use-lang";
import { t } from "@/lib/ui-strings";
import { LANGUAGES } from "@/lib/types";

/** Home is the front door, not the library — the Stories tab has everything. */
const RECENT = 3;

export default function Home() {
  const [memories, setMemories] = useState<StoredMemory[] | null>(null);
  const [lang, setLang] = useLang();
  const c = t(lang);

  // Reading client-only storage after mount: there is no localStorage during SSR,
  // so this cannot be an initial state value.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMemories(listMemories()), []);

  const speaker = memories?.[0]?.memory.speakerName ?? "Ah Ma";
  const count = memories?.length ?? 0;

  return (
    <main className="with-nav mx-auto max-w-[430px] px-5 pt-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[15px] text-muted">{c.greeting}</p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-[26px] leading-tight font-semibold">
            {c.familyStories}
          </h1>
        </div>
        <Avatar seed={speaker} />
      </header>

      <div className="mt-5">
        <LanguageSwitcher lang={lang} available={[...LANGUAGES]} loading={null} onChange={setLang} />
      </div>

      {/* Hero: her, mid-story, with the app listening on the table beside her. */}
      <section className="relative mt-5 h-[220px] overflow-hidden rounded-[22px] bg-jade-tint">
        {/* eslint-disable-next-line @next/next/no-img-element --
            a static illustration; the optimiser adds nothing and costs the offline cache. */}
        <img
          src="/hero-telling.webp"
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
        />
        {count > 0 && (
          <span className="absolute bottom-4 left-4 rounded-full bg-lacquer/80 px-3.5 py-1.5 text-[13px] font-medium text-rice backdrop-blur">
            {count} {count === 1 ? c.memoryFrom : c.memoriesFrom} {speaker}
          </span>
        )}
      </section>

      <Link
        href="/record"
        className="mt-5 flex items-center gap-3.5 rounded-[18px] bg-kueh px-4 py-3.5"
      >
        <span
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rice"
        >
          <Emoji name="mic" size={22} />
        </span>
        <span className="min-w-0">
          <span className="block text-[18px] leading-tight font-bold text-white">
            {c.recordNewMemory}
          </span>
          <span className="mt-0.5 block text-[14px] text-white/85">{c.justPressPlay}</span>
        </span>
      </Link>

      {/* Home shows the last few; the Stories tab is the whole library. */}
      <section className="mt-8">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-[19px] font-semibold">
            {c.savedMemories}
          </h2>
          {(memories?.length ?? 0) > RECENT && (
            <Link href="/stories" className="text-[14.5px] font-medium text-kueh">
              {c.seeAll}
            </Link>
          )}
        </div>

        {memories === null ? null : memories.length === 0 ? (
          <p className="mt-4 text-muted">{c.empty}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {memories.slice(0, RECENT).map(({ memory }) => (
              <li key={memory.id}>
                <Link
                  href={`/memory/${memory.id}`}
                  className="card flex items-center gap-3.5 px-4 py-3.5"
                >
                  <Avatar seed={memory.id} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[16.5px] font-semibold">
                      {memory.titleTranslations?.[lang] ?? memory.titleTranslated}
                    </span>
                    <span className="mt-0.5 block text-[14px] text-muted">
                      {SEED_LESSON_COUNT(memory.id)} {c.lessonsReady}
                    </span>
                  </span>
                  <Icon name="chevron" size={18} className="shrink-0 text-muted2" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
