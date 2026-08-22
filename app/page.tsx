import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[430px] flex-col justify-between px-6 py-10">
      <div>
        <p className="font-mono text-xs tracking-[0.2em] text-jade uppercase">Heirloom</p>
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-[2.6rem] leading-[1.05] text-rice">
          Your grandmother knows something you don&rsquo;t.
        </h1>
        <p className="mt-5 text-rice/70">
          She talks. You get something you can actually follow — a recipe, her words,
          the choice she made. In her voice, in your language.
        </p>
      </div>

      <div className="my-10">
        <Link
          href="/record"
          className="flex items-center justify-center rounded-full bg-kueh px-8 py-4 text-center text-lg font-medium text-lacquer"
        >
          Record her story
        </Link>
        <p className="mt-4 text-center text-sm text-rice/50">
          Nothing here yet. Call your grandmother.
        </p>
      </div>

      {/* Phase 0 font check — every script must render, no tofu boxes. */}
      <p className="border-t border-jade/30 pt-5 text-center text-sm text-rice/40">
        English 中文 Bahasa Melayu தமிழ்
      </p>
    </main>
  );
}
