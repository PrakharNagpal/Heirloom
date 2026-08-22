"use client";

/**
 * The signature element: a continuous waveform of her audio with a marker that
 * travels it as the lesson moves. Her voice is the thread; everything else hangs
 * off it. Vertical down the left edge on wide screens, a horizontal scrubber above
 * the content on a phone.
 */
export default function VoiceSpine({
  peaks,
  durationSec,
  currentSec,
  activeRange,
  orientation = "horizontal",
  onSeek,
}: {
  peaks: number[];
  durationSec: number;
  currentSec: number;
  activeRange?: { startSec: number; endSec: number } | null;
  orientation?: "horizontal" | "vertical";
  onSeek?: (sec: number) => void;
}) {
  const vertical = orientation === "vertical";
  const progress = durationSec > 0 ? Math.min(1, currentSec / durationSec) : 0;

  const inRange = (i: number) => {
    if (!activeRange || durationSec <= 0) return false;
    const at = (i / peaks.length) * durationSec;
    return at >= activeRange.startSec && at <= activeRange.endSec;
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek || durationSec <= 0) return;
    const box = e.currentTarget.getBoundingClientRect();
    const ratio = vertical
      ? (e.clientY - box.top) / box.height
      : (e.clientX - box.left) / box.width;
    onSeek(Math.max(0, Math.min(1, ratio)) * durationSec);
  };

  return (
    <div
      onClick={seek}
      role={onSeek ? "slider" : undefined}
      aria-label={onSeek ? "Scrub her recording" : undefined}
      aria-valuemin={0}
      aria-valuemax={Math.round(durationSec)}
      aria-valuenow={Math.round(currentSec)}
      tabIndex={onSeek ? 0 : undefined}
      className={`relative ${onSeek ? "cursor-pointer" : ""} ${
        vertical ? "h-full w-12 flex-col" : "h-14 w-full"
      } flex items-center gap-px`}
    >
      {peaks.map((p, i) => {
        const passed = i / peaks.length <= progress;
        const active = inRange(i);
        const size = `${Math.max(8, p * 100)}%`;
        return (
          <span
            key={i}
            style={vertical ? { width: size } : { height: size }}
            className={`flex-1 rounded-full transition-colors duration-150 ${
              active ? "bg-kueh" : passed ? "bg-jade" : "bg-jade/30"
            }`}
          />
        );
      })}
    </div>
  );
}
