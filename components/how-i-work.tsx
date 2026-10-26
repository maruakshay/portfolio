import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { process, quickFacts } from "@/lib/content";
import { Reveal } from "./reveal";
import { SectionRule } from "./ornament";

// How I work: the 30-second version for anyone skimming, then the four steps
// (think, design, build, measure), each backed by a real project.
export function HowIWork() {
  return (
    <section id="approach" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
        <SectionRule n="01" label="How I work" />

        <div className="flex flex-wrap items-end justify-between gap-4 pb-10 pt-8">
          <h2 className="max-w-[20ch] font-display text-[clamp(2.25rem,5.5vw,4rem)] font-extrabold leading-[0.95] text-ink">
            Not just a developer. I <em className="text-volt">think, design, and build.</em>
          </h2>
          <p className="max-w-xs text-sm text-ink-faint">
            Most engineers wait for a spec. I help figure out what to build, how it should feel, and whether it worked.
          </p>
        </div>

        {/* The 30-second version */}
        <Reveal>
          <dl className="frame grid grid-cols-1 gap-px overflow-hidden bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {quickFacts.map((f) => (
              <div key={f.k} className="bg-canvas-deep px-5 py-5">
                <dt className="label text-volt">{f.k}</dt>
                <dd className="mt-2 text-[1.0625rem] leading-snug text-ink">{f.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p, i) => {
            const internal = p.href.startsWith("/");
            const cls =
              "spotlight frame group flex h-full flex-col bg-canvas-deep/60 p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-volt/50";
            const body = (
              <>
                <span className="font-mono text-xs text-ink-faint">0{i + 1}</span>
                <h3 className="mt-3 font-display text-3xl font-extrabold leading-none tracking-tight text-ink">{p.step}</h3>
                <p className="mt-3 text-[1.0625rem] leading-snug text-ink-muted">{p.line}</p>
                <p className="mt-auto border-t border-rule pt-4 font-serif text-[1rem] italic leading-snug text-ink-faint">
                  <span className="not-italic text-volt">For example: </span>
                  {p.proof}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-ink transition-colors group-hover:text-volt">
                  See it <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </>
            );
            return (
              <li key={p.step}>
                <Reveal delay={i * 0.05} className="h-full">
                  {internal ? (
                    <Link href={p.href} className={cls}>
                      {body}
                    </Link>
                  ) : (
                    <a href={p.href} className={cls}>
                      {body}
                    </a>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
