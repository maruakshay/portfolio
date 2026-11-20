import { approach } from "@/lib/home";
import { Reveal } from "./motion";

/** Right after the hero: trust first, then deep understanding of the client's customers. */
export function Approach() {
  return (
    <section aria-labelledby="approach-title" className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 sm:pt-32 lg:px-10">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal>
          <p className="label">{approach.label}</p>
          <h2 id="approach-title" className="mt-4 text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95]">
            {approach.title[0]} <em>{approach.title[1]}</em>
          </h2>
          <p className="mt-6 max-w-[44ch] text-ink-muted">{approach.intro}</p>
        </Reveal>

        <ol className="border-t border-rule">
          {approach.steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.06} className="flex gap-6 border-b border-rule py-7">
              <span className="pt-1.5 font-mono text-[0.75rem] text-volt">{s.n}</span>
              <span>
                <span className="block text-[clamp(1.35rem,2.4vw,1.6rem)] font-medium leading-tight tracking-[-0.03em] text-ink">
                  {s.t}
                </span>
                <span className="mt-2 block max-w-[52ch] text-[0.975rem] leading-snug text-ink-muted">{s.d}</span>
              </span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
