"use client";

import { useRouter } from "next/navigation";
import BackLink from "@/components/BackLink";
import Recorder from "@/components/Recorder";
import { useLang } from "@/lib/use-lang";
import { DISPLAY_SIZE, t } from "@/lib/ui-strings";

export default function RecordPage() {
  const router = useRouter();
  const [lang] = useLang();
  const c = t(lang);

  return (
    <main className="mx-auto flex min-h-screen max-w-[430px] flex-col px-6 py-8">
      <BackLink href="/">{c.back}</BackLink>

      <h1 className={`mt-6 font-[family-name:var(--font-display)] text-balance ${DISPLAY_SIZE[lang]}`}>
        {c.askHerHow}
      </h1>
      <p className="mt-3 text-rice/60">{c.putThePhoneDown}</p>

      <div className="flex flex-1 items-center justify-center py-10">
        <Recorder lang={lang} onSaved={(m) => router.push(`/memory/${m.id}`)} />
      </div>

      {/* Consent, in plain words, before the first recording — not buried in a policy. */}
      <p className="border-t border-jade/25 pt-5 text-xs leading-relaxed text-rice/45">
        Her recording stays on this phone. Nothing is posted anywhere, no account is made,
        and you can delete a memory and its audio at any time. Her voice is never copied
        or synthesised &mdash; when you hear her, it is really her.
      </p>
    </main>
  );
}
