"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { listMemories, type StoredMemory } from "@/lib/store";
import { useLang } from "@/lib/use-lang";
import { DISPLAY_SIZE, t } from "@/lib/ui-strings";
import { LANGUAGES } from "@/lib/types";

export default function Home() {
  const [memories, setMemories] = useState<StoredMemory[] | null>(null);
  const [lang, setLang] = useLang();
  const c = t(lang);

  // Reading client-only storage after mount: there is no localStorage or IndexedDB
  // during SSR, so this cannot be an initial state value.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMemories(listMemories()), []);

  return (
    <main className="mx-auto flex min-h-screen max-w-[430px] flex-col px-6 py-9">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs tracking-[0.22em] text-jade uppercase">Heirloom</p>
      </div>

      <h1 className={`mt-8 font-[family-name:var(--font-display)] text-balance ${DISPLAY_SIZE[lang]}`}>
        {c.tagline}
      </h1>
      <p className="mt-5 text-rice/70">{c.blurb}</p>

      {/* The language is chosen here, before anything is recorded, because it decides
          which one her words are put into first — and only that one is produced. */}
      <div className="mt-7">
        <LanguageSwitcher
          lang={lang}
          available={[...LANGUAGES]}
          loading={null}
          onChange={setLang}
        />
      </div>

      <Link
        href="/record"
        className="mt-6 flex items-center justify-center rounded-full bg-kueh px-8 py-4 text-lg font-medium text-lacquer"
      >
        {c.record}
      </Link>

      <section className="mt-12 flex-1">
        {memories === null ? null : memories.length === 0 ? (
          <p className="text-rice/45">{c.empty}</p>
        ) : (
          <>
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-rice/40 uppercase">
              {c.kept}
            </h2>
            <ul className="mt-4 space-y-3">
              {memories.map(({ memory }) => (
                <li key={memory.id}>
                  <Link
                    href={`/memory/${memory.id}`}
                    className="block rounded-2xl bg-jade/15 px-4 py-4 transition hover:bg-jade/25"
                  >
                    <span className="block text-rice">
                      {memory.titleTranslations?.[lang] ?? memory.titleTranslated}
                    </span>
                    <span className="mt-1 block text-sm text-rice/50">
                      {memory.speakerName} · {memory.sourceLanguage} ·{" "}
                      {Math.round(memory.durationSec)}s
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}
