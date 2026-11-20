import { ArrowUpRight, Check } from "lucide-react";
import { callHref } from "@/lib/content";
import { plans } from "@/lib/offer";
import { Reveal } from "./motion";
import { SectionHead } from "./section-head";

export function Services() {
  const href = callHref();
  const external = href.startsWith("http");
  return (
    <section id="services" aria-labelledby="services-title" className="border-t border-rule">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10">
        <SectionHead
          id="services-title"
          label="Services"
          title={
            <>
              How we <em>work together</em>
            </>
          }
          aside="Start small with an audit. Fix what matters. Keep it safe."
        />

        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
          {plans.map((p, i) => (
            <Reveal
              as="li"
              key={p.name}
              delay={i * 0.06}
              className={`relative flex flex-col rounded-xl border p-6 transition-colors duration-300 sm:p-8 ${
                p.featured
                  ? "border-volt/60 bg-canvas-shade hover:border-volt"
                  : "border-rule bg-canvas-deep hover:border-ink/25"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-6 rounded-full bg-volt px-3 py-1 font-mono text-[0.68rem] font-medium uppercase tracking-[0.08em] text-[#0b0b0c] sm:left-8">
                  Most popular
                </span>
              )}
              <span className="font-mono text-[0.75rem] text-ink-faint">0{i + 1}</span>
              <h3 className="mt-6 text-[1.75rem] font-medium leading-tight tracking-[-0.035em] text-ink">{p.name}</h3>
              <p className="label mt-3 normal-case tracking-[0.02em]">{p.meta}</p>

              <ul className="mt-8 space-y-3 border-t border-rule pt-6">
                {p.includes.map((x) => (
                  <li key={x} className="flex gap-3 text-[0.95rem] leading-snug text-ink-muted">
                    <Check aria-hidden className="mt-[0.2em] size-4 shrink-0 text-volt" />
                    {x}
                  </li>
                ))}
              </ul>

              {p.deliverable && (
                <p className="mt-6 rounded-lg border border-rule bg-canvas/60 p-4 text-[0.95rem] leading-snug text-ink">
                  <span className="label mb-1.5 block">You get</span>
                  {p.deliverable}
                </p>
              )}

              <div className="mt-auto pt-8">
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={`${p.featured ? "btn-primary" : "btn-ghost"} w-full`}
                >
                  {p.cta}
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <p className="mt-8 text-center text-[0.95rem] text-ink-muted">
            Not sure where to start? The audit pays for itself in most cases through cost savings alone.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
