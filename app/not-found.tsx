import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="label mb-6 text-sanguine">
        <span className="mark mark-blink mr-2.5 align-middle" aria-hidden />
        {"// "}404
      </p>
      <h1 className="font-display text-[clamp(3rem,8vw,5rem)] font-normal leading-[1] text-ink">
        Nothing on this <em className="italic text-sanguine">path</em>.
      </h1>
      <p className="mt-5 text-xl text-ink-muted">
        That page does not exist. The work, though, does.
      </p>
      <Link
        href="/"
        className="mt-10 bg-ink px-6 py-3 font-mono text-xs font-medium uppercase tracking-[0.06em] text-canvas transition-colors hover:bg-sanguine"
      >
        Back home
      </Link>
    </main>
  );
}
