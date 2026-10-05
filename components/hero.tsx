import { ArrowDown } from "lucide-react";
import { profile } from "@/lib/content";
import { Placard } from "./placard";

export function Hero() {
  return (
    <section id="top" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-end gap-12 px-5 pb-16 pt-14 md:px-8 md:pt-20 lg:grid-cols-[1.35fr_1fr] lg:gap-16 lg:pb-24">
        <div>
          <p className="label mb-8 text-sanguine">
            <span className="text-ink-faint">{"// "}</span>
            {profile.role}
          </p>

          <h1 className="font-display text-[clamp(3rem,7.5vw,6rem)] font-normal leading-[0.95] tracking-[-0.015em] text-ink">
            Most AI demos die in{" "}
            <em className="italic text-sanguine">production</em>.
            <span className="mt-2 block text-ink-muted">
              I build the ones that don&apos;t.
            </span>
          </h1>

          <p className="prose-folio mt-8 text-[1.1875rem] leading-[1.65] text-ink-muted">
            {profile.statementRest}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 bg-ink px-6 py-3 font-mono text-xs font-medium uppercase tracking-[0.06em] text-canvas transition-colors hover:bg-sanguine"
            >
              See the work
              <ArrowDown className="size-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden />
            </a>
            <a
              href="#contact"
              className="border border-ink/40 px-6 py-3 font-mono text-xs font-medium uppercase tracking-[0.06em] text-ink transition-colors hover:border-sanguine hover:text-sanguine"
            >
              Start a conversation
            </a>
            <span className="label ml-1 hidden sm:inline">
              or press{" "}
              <kbd className="border border-rule bg-canvas-deep px-1.5 py-0.5 text-ink">⌘K</kbd>
            </span>
          </div>
        </div>

        <Placard />
      </div>
    </section>
  );
}
