"use client";

import { LANGUAGES, LANGUAGE_LABELS, type Lang } from "@/lib/types";

export default function LanguageSwitcher({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (lang: Lang) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Read this in"
      className="flex gap-1 overflow-x-auto rounded-full bg-lacquer/60 p-1 ring-1 ring-jade/30"
    >
      {LANGUAGES.map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          aria-pressed={lang === l}
          className={`min-h-0 shrink-0 rounded-full px-3 py-2 text-sm whitespace-nowrap transition ${
            lang === l ? "bg-kueh text-lacquer" : "text-rice/70 hover:text-rice"
          }`}
        >
          {LANGUAGE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
