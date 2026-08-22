"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listMemories, type StoredMemory } from "@/lib/store";

export default function Home() {
  const [memories, setMemories] = useState<StoredMemory[] | null>(null);
  useEffect(() => setMemories(listMemories()), []);

  return (
    <main className="mx-auto flex min-h-screen max-w-[430px] flex-col px-6 py-10">
      <p className="font-mono text-xs tracking-[0.2em] text-jade uppercase">Heirloom</p>

      <h1 className="mt-6 font-[family-name:var(--font-display)] text-[2.6rem] leading-[1.05]">
        Your grandmother knows something you don&rsquo;t.
      </h1>
      <p className="mt-5 text-rice/70">
        She talks. You get something you can actually follow &mdash; her recipe, her words,
        the choice she made. In her voice, in your language.
      </p>

      <Link
        href="/record"
        className="mt-9 flex items-center justify-center rounded-full bg-kueh px-8 py-4 text-lg font-medium text-lacquer"
      >
        Record her story
      </Link>

      <section className="mt-12 flex-1">
        {memories === null ? null : memories.length === 0 ? (
          <p className="text-rice/45">Nothing here yet. Call your grandmother.</p>
        ) : (
          <>
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-rice/40 uppercase">
              Kept
            </h2>
            <ul className="mt-4 space-y-3">
              {memories.map(({ memory }) => (
                <li key={memory.id}>
                  <Link
                    href={`/memory/${memory.id}`}
                    className="block rounded-2xl bg-jade/15 px-4 py-4 transition hover:bg-jade/25"
                  >
                    <span className="block text-rice">{memory.titleTranslated}</span>
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

      <p className="border-t border-jade/25 pt-5 text-center text-sm text-rice/35">
        English 中文 Bahasa Melayu தமிழ்
      </p>
    </main>
  );
}
