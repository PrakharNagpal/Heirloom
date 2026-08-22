"use client";

/**
 * A detail she never gave, shown as a question instead of a guess.
 *
 * This is the safety behaviour made visible: the app does not fill the hole, it
 * hands the hole back as a reason to talk to her. Styled deliberately unlike every
 * other block so it reads as a different kind of thing, not a footnote.
 */
export default function AskHer({ question }: { question: string }) {
  return (
    <p className="mt-3 rounded-xl border border-dashed border-gold/60 bg-gold/10 px-4 py-3 text-[0.95rem] text-rice/90">
      <span className="mr-2 font-mono text-[10px] tracking-[0.18em] text-gold uppercase">
        Go ask her
      </span>
      {question}
    </p>
  );
}
