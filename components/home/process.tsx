import { process } from "@/lib/home";
import { Reveal } from "./motion";
import { SectionHead } from "./section-head";

export function Process() {
  return (
    <section aria-labelledby="process-title" className="border-t border-rule">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10">
        <SectionHead
          id="process-title"
          label="Process"
          title={
            <>
              From first call to <em>safe in production.</em>
            </>
          }
        />
        <Reveal>
          <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {process.map((s) => (
              <li key={s.n} className="relative bg-canvas p-6 sm:p-8">
                <span className="font-mono text-[0.75rem] text-volt">{s.n}</span>
                <p className="mt-4 text-[1.35rem] font-medium leading-tight tracking-[-0.03em] text-ink">{s.t}</p>
                <p className="mt-2 text-[0.95rem] leading-snug text-ink-muted">{s.d}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
