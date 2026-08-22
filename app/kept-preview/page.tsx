"use client";

import { useRouter } from "next/navigation";
import KeptMoment from "@/components/KeptMoment";
import { SEED_MEMORY_EN } from "@/lib/seed";
import { useLang } from "@/lib/use-lang";

/**
 * The kept moment on its own route. It normally appears for a few seconds inside the
 * recording flow, which makes it the one screen that is hard to look at while
 * designing — and it is one of only two places gold-leaf is spent.
 */
export default function KeptPreview() {
  const router = useRouter();
  const [lang] = useLang();
  return (
    <main className="flex min-h-screen items-center">
      <div className="mx-auto w-full max-w-[430px] px-5">
        <KeptMoment
          memory={SEED_MEMORY_EN.memory}
          lang={lang}
          onContinue={() => router.push(`/memory/${SEED_MEMORY_EN.memory.id}`)}
        />
      </div>
    </main>
  );
}
