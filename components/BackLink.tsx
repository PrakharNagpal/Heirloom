import Link from "next/link";

/** "‹ All memories" — a back link you can hit with a thumb, not a 15px line of text. */
export default function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="-ml-1 inline-flex min-h-11 items-center gap-1.5 self-start px-1 text-[15px] text-muted"
    >
      <span aria-hidden className="text-[18px] leading-none">
        ‹
      </span>
      {children}
    </Link>
  );
}
