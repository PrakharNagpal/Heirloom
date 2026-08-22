"use client";

import { LANGUAGES, LANGUAGE_LABELS, type Lang } from "@/lib/types";

export default function LanguageSwitcher({
  lang,
  available,
  loading,
  onChange,
}: {
  lang: Lang;
  /** Languages this memory already holds. The rest cost one call to add. */
  available: Lang[];
  loading: Lang | null;
  onChange: (lang: Lang) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Read this in"
      className="flex gap-1 overflow-x-auto rounded-full bg-lacquer/60 p-1 ring-1 ring-jade/30"
    >
      {LANGUAGES.map((l) => {
        const ready = available.includes(l);
        const busy = loading === l;
        return (
          <button
            key={l}
            onClick={() => onChange(l)}
            disabled={loading !== null}
            aria-pressed={lang === l}
            className={`relative min-h-0 shrink-0 rounded-full px-3 py-2 text-sm whitespace-nowrap transition disabled:opacity-60 ${
              lang === l ? "bg-kueh text-lacquer" : "text-rice/70 hover:text-rice"
            }`}
          >
            {LANGUAGE_LABELS[l]}
            {busy ? (
              <span className="ml-1.5 inline-block h-3 w-3 animate-spin rounded-full border border-current border-t-transparent align-[-1px]" />
            ) : (
              !ready && (
                <span
                  aria-hidden
                  title="Not translated yet"
                  className={`ml-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle ${
                    lang === l ? "bg-lacquer/50" : "bg-rice/25"
                  }`}
                />
              )
            )}
          </button>
        );
      })}
    </div>
  );
}
