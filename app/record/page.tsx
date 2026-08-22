"use client";

import { useRouter } from "next/navigation";
import BackLink from "@/components/BackLink";
import Recorder from "@/components/Recorder";

export default function RecordPage() {
  const router = useRouter();
  return (
    <main className="mx-auto flex min-h-screen max-w-[430px] flex-col px-6 py-8">
      <BackLink href="/">Back</BackLink>

      <h1 className="mt-8 font-[family-name:var(--font-display)] text-3xl leading-tight">
        Ask her how she learned to make it.
      </h1>
      <p className="mt-3 text-rice/60">
        Then put the phone down between you and let her tell it her way.
      </p>

      <div className="flex flex-1 items-center justify-center py-10">
        <Recorder onSaved={(m) => router.push(`/memory/${m.id}`)} />
      </div>

      <p className="border-t border-jade/25 pt-5 text-xs leading-relaxed text-rice/45">
        Her recording stays on this phone. Nothing is posted anywhere, no account is made,
        and you can delete a memory and its audio at any time. Her voice is never copied
        or synthesised &mdash; when you hear her, it is really her.
      </p>
    </main>
  );
}
