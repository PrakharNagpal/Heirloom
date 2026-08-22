"use client";

import Link from "next/link";
import Emoji, { type EmojiName } from "@/components/Emoji";
import Icon from "@/components/Icon";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/use-lang";
import { t } from "@/lib/ui-strings";

/**
 * The shell. Record is the primary action and is reachable from anywhere, so it is
 * raised out of the bar rather than sitting in it as a third equal tab.
 *
 * Hidden on the Record screen itself, which is full-bleed and hers.
 */
export default function TabBar() {
  const pathname = usePathname();
  const [lang] = useLang();
  const c = t(lang);

  if (pathname.startsWith("/record")) return null;

  const onHome = pathname === "/";
  const onStories =
    pathname.startsWith("/stories") ||
    pathname.startsWith("/memory") ||
    pathname.startsWith("/lesson");

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-[rgba(251,247,238,0.96)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-[430px] items-end justify-around px-6 pt-2 pb-[max(10px,env(safe-area-inset-bottom))]">
        <Tab href="/" label={c.navHome} icon="home" active={onHome} />

        <Link
          href="/record"
          aria-label={c.navRecord}
          className="-mt-[26px] flex flex-col items-center gap-1"
        >
          {/* White line mic, not the emoji: the emoji microphone is blue-grey and
              fights the rose it sits on. Full-colour glyphs belong on light ground. */}
          <span className="flex h-[62px] w-[62px] items-center justify-center rounded-full border-4 border-white bg-kueh text-white shadow-[0_8px_20px_rgba(217,106,138,0.35)]">
            <Icon name="mic" size={26} strokeWidth={1.9} />
          </span>
          <span className="text-[12.5px] font-bold text-kueh">{c.navRecord}</span>
        </Link>

        <Tab href="/stories" label={c.navStories} icon="book" active={onStories} />
      </div>
    </nav>
  );
}

function Tab({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: EmojiName;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className="flex min-h-11 w-20 flex-col items-center gap-1 py-1"
    >
      <Emoji name={icon} size={22} className={active ? "" : "opacity-55"} />
      <span className={`text-[12.5px] ${active ? "font-semibold text-kueh" : "text-muted2"}`}>
        {label}
      </span>
    </Link>
  );
}
