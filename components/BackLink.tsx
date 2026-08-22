import Link from "next/link";

/** A back link you can hit with a thumb — 48px, not a 17px line of text. */
export default function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="-ml-2 inline-flex min-h-12 items-center gap-2 self-start px-2 text-sm text-rice/60"
    >
      <span aria-hidden>&larr;</span>
      {children}
    </Link>
  );
}
