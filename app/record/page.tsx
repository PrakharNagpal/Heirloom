"use client";

import { useRouter } from "next/navigation";
import BackLink from "@/components/BackLink";
import Recorder from "@/components/Recorder";
import { useLang } from "@/lib/use-lang";
import { t } from "@/lib/ui-strings";

/**
 * The recording flow. Same rice ground and cards as everywhere else, so nothing
 * about it feels like a different app — but the tab bar stays hidden, because
 * during a recording the last thing anyone needs is a way to navigate away.
 */
export default function RecordPage() {
  const router = useRouter();
  const [lang] = useLang();
  const c = t(lang);

  return (
    <main className="mx-auto flex min-h-screen max-w-[430px] flex-col px-5 pt-6 pb-10">
      <BackLink href="/">{c.back}</BackLink>

      <div className="flex flex-1 items-center justify-center py-4">
        <Recorder lang={lang} onSaved={(m) => router.push(`/memory/${m.id}`)} />
      </div>

      {/* Consent in plain words, before the first recording — not buried in a policy. */}
      <p className="rounded-[16px] bg-sand px-4 py-3.5 text-[13px] leading-relaxed text-muted">
        Her recording stays on this phone. Nothing is posted anywhere, no account is made,
        and you can delete a memory and its audio at any time. Her voice is never copied
        or synthesised &mdash; when you hear her, it is really her.
      </p>
    </main>
  );
}
