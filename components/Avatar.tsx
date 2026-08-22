"use client";

/**
 * A stand-in for the family's own photo. Emoji on a tinted circle rather than a
 * generic silhouette — warmer, and obviously a placeholder rather than pretending
 * to be a picture of someone.
 */
const TINTS = ["bg-jade-tint", "bg-rose-tint", "bg-sand"] as const;

export default function Avatar({
  seed = "",
  size = 52,
  emoji = "👵",
}: {
  seed?: string;
  size?: number;
  emoji?: string;
}) {
  let n = 0;
  for (const ch of seed) n = (n + ch.charCodeAt(0)) % 997;
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.46 }}
      className={`flex shrink-0 items-center justify-center rounded-full ${TINTS[n % TINTS.length]}`}
    >
      {emoji}
    </span>
  );
}
