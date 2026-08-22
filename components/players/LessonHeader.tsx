"use client";

import BackLink from "@/components/BackLink";

/** Same header on every player: back to her words, the title, then a meta line. */
export default function LessonHeader({
  backHref,
  backLabel,
  title,
  meta,
}: {
  backHref: string;
  backLabel: string;
  title: string;
  meta: string;
}) {
  return (
    <header>
      <BackLink href={backHref}>{backLabel}</BackLink>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-[24px] leading-tight font-semibold">
        {title}
      </h1>
      <p className="mt-1.5 text-[14.5px] text-muted">{meta}</p>
    </header>
  );
}
