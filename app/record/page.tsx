"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Recorder from "@/components/Recorder";
import { useLang } from "@/lib/use-lang";
import { t } from "@/lib/ui-strings";

/**
 * The only dark screen, and the only one without the tab bar.
 *
 * This is the screen she holds. Everything else in the app is for the grandchild,
 * so this one is full-bleed, high-contrast, and has exactly one thing to press.
 */
export default function RecordPage() {
  const router = useRouter();
  const [lang] = useLang();
  const c = t(lang);

  return (
    <main className="min-h-screen bg-lacquer">
      <div className="mx-auto flex min-h-screen max-w-[430px] flex-col px-5 pt-6 pb-10">
        <Link
          href="/"
          className="-ml-1 inline-flex min-h-11 w-fit items-center gap-1.5 px-1 text-[15px] text-teal-muted"
        >
          <span aria-hidden className="text-[18px] leading-none">
            ‹
          </span>
          {c.back}
        </Link>

        <div className="flex flex-1 items-center justify-center py-6">
          <Recorder lang={lang} onSaved={(m) => router.push(`/memory/${m.id}`)} />
        </div>

        {/* Consent in plain words, before the first recording — not buried in a policy. */}
        <p className="border-t border-white/10 pt-5 text-[12.5px] leading-relaxed text-teal-muted">
          Her recording stays on this phone. Nothing is posted anywhere, no account is made,
          and you can delete a memory and its audio at any time. Her voice is never copied
          or synthesised &mdash; when you hear her, it is really her.
        </p>
      </div>
    </main>
  );
}
