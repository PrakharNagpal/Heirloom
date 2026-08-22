import Link from "next/link";

// Phase 2 builds this. Phase 1 only needs the route to exist so the CTA isn't broken.
export default function RecordPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[430px] flex-col justify-center gap-6 px-6 py-10">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">Not built yet.</h1>
      <p className="text-rice/70">Recording arrives in the next phase.</p>
      <Link href="/" className="text-kueh underline underline-offset-4">
        Back
      </Link>
    </main>
  );
}
