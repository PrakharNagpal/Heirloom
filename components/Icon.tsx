/**
 * Inline SVG, not emoji.
 *
 * The design called for emoji icons, and on an iOS simulator without the colour
 * emoji font every one of them rendered as a tofu box — the tab bar, the record
 * button, the avatars, all of it. Emoji are a font dependency you do not control,
 * so nothing structural in the UI is allowed to rely on one.
 *
 * All strokes use currentColor, so an icon takes the colour of whatever it sits in.
 */
export type IconName =
  | "home"
  | "mic"
  | "book"
  | "play"
  | "pause"
  | "speaker"
  | "bowl"
  | "quote"
  | "branch"
  | "ask"
  | "tip"
  | "chevron"
  | "quiz"
  | "thread"
  | "person";

const PATHS: Record<IconName, React.ReactNode> = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M9.75 20v-5.5h4.5V20" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="2.5" width="6" height="11.5" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
      <path d="M12 18v3.5" />
    </>
  ),
  book: (
    <>
      <path d="M3.5 4.5h6a3 3 0 0 1 2.5 1.4A3 3 0 0 1 14.5 4.5h6v14h-6a3 3 0 0 0-2.5 1.4A3 3 0 0 0 9.5 18.5h-6z" />
      <path d="M12 6v14" />
    </>
  ),
  play: <path d="M8 5.5 18.5 12 8 18.5z" fill="currentColor" stroke="none" />,
  pause: (
    <>
      <rect x="7.5" y="5.5" width="3.5" height="13" rx="1" fill="currentColor" stroke="none" />
      <rect x="13" y="5.5" width="3.5" height="13" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  speaker: (
    <>
      <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" />
      <path d="M16 9a4.5 4.5 0 0 1 0 6" />
      <path d="M18.5 6.5a8 8 0 0 1 0 11" />
    </>
  ),
  bowl: (
    <>
      <path d="M3.5 11h17a8.5 8.5 0 0 1-8.5 8.5A8.5 8.5 0 0 1 3.5 11z" />
      <path d="M9 7.5c0-1.5 1.5-1.5 1.5-3" />
      <path d="M13.5 7.5c0-1.5 1.5-1.5 1.5-3" />
    </>
  ),
  quote: (
    <>
      <path d="M4 5.5h16v11H9l-5 4z" />
      <path d="M8.5 11h7" />
    </>
  ),
  branch: (
    <>
      <path d="M6 20V9a3 3 0 0 1 3-3h9" />
      <path d="M15 3l3 3-3 3" />
      <path d="M18 15H9" />
      <path d="M15 12l3 3-3 3" />
    </>
  ),
  ask: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.75 9.5a2.4 2.4 0 0 1 4.5 1c0 1.6-2.25 1.9-2.25 3.4" />
      <path d="M12 17.2h.01" />
    </>
  ),
  tip: (
    <>
      <path d="M9 17.5h6" />
      <path d="M10 20.5h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.8V15h7v-1.2A6 6 0 0 0 12 3z" />
    </>
  ),
  chevron: <path d="M9.5 5.5 16 12l-6.5 6.5" />,
  quiz: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.75 9.5a2.4 2.4 0 0 1 4.5 1c0 1.6-2.25 1.9-2.25 3.4" />
      <path d="M12 17.2h.01" />
    </>
  ),
  thread: (
    <>
      <path d="M19 4 8.5 14.5" />
      <path d="M5 20l3.5-5.5L14 11" />
      <circle cx="18.5" cy="4.5" r="1.6" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8.5" r="4" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  ),
};

export default function Icon({
  name,
  size = 22,
  className = "",
  strokeWidth = 1.7,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      aria-hidden
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
