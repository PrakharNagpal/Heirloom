"use client";

import BackLink from "@/components/BackLink";
import { useParams, useSearchParams } from "next/navigation";
import { FORMAT_LABELS, type LessonFormat } from "@/lib/types";

// Phases 3 and 4 build this. The route exists so the format picker never dead-ends.
export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const format = (useSearchParams().get("format") ?? "cookalong") as LessonFormat;
  return (
    <main className="mx-auto flex min-h-screen max-w-[430px] flex-col justify-center gap-5 px-6 py-10">
      <h1 className="font-[family-name:var(--font-display)] text-3xl leading-tight">
        {FORMAT_LABELS[format]}
      </h1>
      <p className="text-rice/60">Not built yet — this arrives in the next phase.</p>
      <BackLink href={`/memory/${id}`}>Back to her words</BackLink>
    </main>
  );
}
