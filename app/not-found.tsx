import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="label mb-6 text-amber">
        <span className="mark mark-blink mr-2 align-middle" aria-hidden />
        404
      </p>
      <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-normal leading-[1] tracking-[-0.02em] text-paper">
        Nothing on this path.
      </h1>
      <p className="prose-mono mt-5 text-paper-muted">
        That page does not exist. The work, though, does.
      </p>
      <Link
        href="/"
        className="mt-9 bg-amber px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-ground transition-colors hover:bg-amber-deep"
      >
        Back home
      </Link>
    </main>
  );
}
