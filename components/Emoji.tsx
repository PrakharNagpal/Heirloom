/**
 * Emoji as vendored SVG files, not as text characters.
 *
 * A device without a colour emoji font renders every emoji as a blank box — an iOS
 * simulator did exactly that to this app's whole icon set. These come from Google's
 * Noto Emoji (Apache-2.0, see public/emoji/LICENSE.txt) and are served as images, so
 * they look the same everywhere and survive an offline demo.
 *
 * Use these for identity and decoration. Controls that change colour with their
 * state — play, pause, chevrons — use the monochrome line set in Icon.tsx instead,
 * because a full-colour glyph cannot invert on a rose background.
 */
export type EmojiName =
  | "home"
  | "mic"
  | "book"
  | "grandma"
  | "bowl"
  | "speech"
  | "shuffle"
  | "bulb"
  | "question"
  | "speaker";

export default function Emoji({
  name,
  size = 22,
  className = "",
}: {
  name: EmojiName;
  size?: number;
  className?: string;
}) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element --
       a tiny static SVG; the optimiser cannot resize vectors and would only cost
       the offline cache an extra request. */
    <img
      src={`/emoji/${name}.svg`}
      alt=""
      aria-hidden
      width={size}
      height={size}
      draggable={false}
      className={`inline-block shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
