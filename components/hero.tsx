import { profile } from "@/lib/content";
import { HeroVisual } from "./hero-visual";

const MOBILE_STAGES = [
  "INPUT",
  "INTERFACE",
  "GUARDRAILS",
  "AGENT",
  "RAG",
  "MODEL",
];

export function Hero() {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-5xl px-5 pt-20 md:px-8 md:pt-28">
        <p className="label mb-8 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-amber">{profile.role}</span>
          <span aria-hidden className="text-rule">/</span>
          <span>{profile.location}</span>
          <span aria-hidden className="text-rule">/</span>
          <span>6+ yrs shipping</span>
        </p>

        <h1 className="max-w-[20ch] font-display text-[clamp(2.5rem,6.5vw,5rem)] font-normal leading-[1.02] tracking-[-0.02em] text-paper">
          {profile.statementLead}
        </h1>
        <p className="prose-mono mt-7 text-base leading-[1.7] text-paper-muted">
          {profile.statementRest}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-ground transition-colors hover:bg-amber-deep"
          >
            See the work
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="border border-rule px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:border-amber"
          >
            Email me
          </a>
        </div>

        <p className="label mt-8 text-paper-faint">
          <span className="mark mr-2 align-middle" aria-hidden />
          {profile.availability}
        </p>
      </div>

      {/* Pipeline — the focal proof block */}
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-14 md:px-8 md:pb-28 md:pt-16">
        <div className="border border-rule bg-ground shadow-[5px_5px_0_var(--color-rule)]">
          <div className="flex items-center justify-between border-b border-rule px-5 py-3 md:px-6">
            <span className="label flex items-center gap-2 text-paper-muted">
              <span className="mark" aria-hidden />
              Production inference pipeline
            </span>
            <span className="label hidden text-paper-faint sm:block">
              request → response
            </span>
          </div>

          {/* Detailed diagram on desktop */}
          <div className="hidden px-5 py-7 md:block md:px-8">
            <HeroVisual />
          </div>

          {/* Compact, readable fallback on mobile */}
          <div className="px-5 py-6 md:hidden">
            <ol className="flex flex-col gap-px overflow-hidden border border-rule bg-rule">
              {MOBILE_STAGES.map((s, i) => (
                <li
                  key={s}
                  className="flex items-center gap-3 bg-surface px-4 py-3"
                >
                  <span className="label text-paper-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mark shrink-0" aria-hidden />
                  <span className="label text-paper">{s}</span>
                </li>
              ))}
            </ol>
            <p className="label mt-3 text-paper-faint">
              tokens stream back to the interface
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
