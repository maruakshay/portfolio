import { risks } from "@/lib/home";
import { Reveal } from "./motion";
import { SectionHead } from "./section-head";

export function WhyBreak() {
  return (
    <section aria-labelledby="why-title" className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 sm:pt-32 lg:px-10">
      <SectionHead
        id="why-title"
        label="Why AI apps break in production"
        title={
          <>
            Your demo works. <em>Production is a different game.</em>
          </>
        }
      />
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:gap-4">
        {risks.map((r, i) => (
          <Reveal
            as="li"
            key={r.t}
            delay={i * 0.06}
            className="flex min-h-[200px] flex-col justify-between rounded-xl border border-rule bg-canvas-deep p-6 transition-colors duration-300 hover:border-ink/25 sm:p-7"
          >
            <span className="font-mono text-[0.75rem] text-ink-faint">0{i + 1}</span>
            <span className="mt-10 block">
              <span className="block text-[1.6rem] font-medium leading-tight tracking-[-0.03em] text-ink">{r.t}</span>
              <span className="mt-2 block max-w-[40ch] text-[0.95rem] leading-snug text-ink-muted">{r.d}</span>
            </span>
          </Reveal>
        ))}
      </ul>
      <Reveal>
        <p className="mt-10 max-w-[52ch] text-[clamp(1.25rem,2.4vw,1.6rem)] font-medium leading-snug tracking-[-0.025em] text-ink">
          I fix all three. <em>It&apos;s what I did at JupiterOne and in the AI SaaS I built and sold.</em>
        </p>
      </Reveal>
    </section>
  );
}
