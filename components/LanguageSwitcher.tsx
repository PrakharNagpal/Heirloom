"use client";

import { LANGUAGES, LANGUAGE_LABELS, type Lang } from "@/lib/types";

/**
 * Pill row, one per language. Active is rose on white; the rest sit on sand.
 * Switching never touches her audio — only the text and the font it renders in.
 */
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
    <div role="group" aria-label="Read this in" className="flex gap-1.5 overflow-x-auto pb-0.5">
      {LANGUAGES.map((l) => {
        const active = lang === l;
        const ready = available.includes(l);
        const busy = loading === l;
        return (
          <button
            key={l}
            onClick={() => onChange(l)}
            disabled={loading !== null}
            aria-pressed={active}
            className={`min-h-11 shrink-0 rounded-full px-3 text-[14px] font-medium whitespace-nowrap transition disabled:opacity-60 ${
              active ? "bg-kueh text-white" : "bg-sand text-muted"
            }`}
          >
            {LANGUAGE_LABELS[l]}
            {busy ? (
              <span className="ml-2 inline-block h-3 w-3 animate-spin rounded-full border border-current border-t-transparent align-[-1px]" />
            ) : (
              !ready && (
                <span
                  aria-hidden
                  className={`ml-2 inline-block h-1.5 w-1.5 rounded-full align-middle ${
                    active ? "bg-white/60" : "bg-muted2"
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
