"use client";

import Emoji from "@/components/Emoji";

/**
 * A stand-in for the family's own photo, on a tinted circle. Obviously a
 * placeholder rather than pretending to be a picture of someone.
 */
const TINTS = ["bg-jade-tint", "bg-rose-tint", "bg-sand"] as const;

export default function Avatar({ seed = "", size = 52 }: { seed?: string; size?: number }) {
  let n = 0;
  for (const ch of seed) n = (n + ch.charCodeAt(0)) % 997;
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center rounded-full text-lacquer/45 ${TINTS[n % TINTS.length]}`}
    >
      <Emoji name="grandma" size={Math.round(size * 0.58)} />
    </span>
  );
}
