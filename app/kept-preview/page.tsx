"use client";

import { useRouter } from "next/navigation";
import KeptMoment from "@/components/KeptMoment";
import { SEED_MEMORY } from "@/lib/seed";
import { useLang } from "@/lib/use-lang";

/**
 * The kept moment on its own route. It normally appears for a few seconds inside the
 * recording flow, which makes it the one screen that is hard to look at while
 * designing — and it is the only place gold-leaf is spent, so it has to be right.
 */
export default function KeptPreview() {
  const router = useRouter();
  const [lang] = useLang();
  return (
    <main className="mx-auto flex min-h-screen max-w-[430px] flex-col justify-center px-6">
      <KeptMoment
        memory={SEED_MEMORY.memory}
        lang={lang}
        onContinue={() => router.push(`/memory/${SEED_MEMORY.memory.id}`)}
      />
    </main>
  );
}
