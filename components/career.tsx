import { Users } from "lucide-react";
import { career } from "@/lib/content";
import { Reveal } from "./reveal";
import { SectionRule } from "./ornament";

// Career as a provenance record: where each piece of experience was made,
// with the leadership line in each role called out in sanguine.
export function Career() {
  return (
    <section id="career" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
        <SectionRule n="03" label="Provenance" />
        <div className="grid grid-cols-1 gap-10 pt-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] font-normal leading-[1] text-ink">
              Seven years, <em className="italic text-sanguine">six rooms</em>.
            </h2>
            <p className="prose-folio mt-5 text-[1.125rem] leading-[1.65] text-ink-muted">
              From frontend engineer to founder to AI systems architect, and
              now full-stack AI and security. Every role added a layer: the
              interface, the model, the ops, the team, and the trust.
            </p>
            <p className="label mt-6 flex items-center gap-2 text-sanguine">
              <Users className="size-3.5" strokeWidth={1.5} aria-hidden />
              marks the leadership in each role
            </p>
          </div>

          <ol className="relative border-l border-gilt">
            {career.map((c, i) => (
              <li key={c.org} className="relative pb-12 pl-8 last:pb-0 md:pl-10">
                <span
                  aria-hidden
                  className={`absolute -left-[7px] top-2 size-[13px] rounded-full border ${
                    i === 0 ? "border-sanguine bg-sanguine" : "border-gilt bg-canvas"
                  }`}
                />
                <Reveal>
                  <p className="label">
                    {c.years} · {c.place}
                  </p>
                  <h3 className="mt-2 font-display text-[1.875rem] font-normal leading-tight text-ink">
                    {c.org}
                  </h3>
                  <p className="font-display text-lg italic text-ink-faint">{c.title}</p>

                  <ul className="prose-folio mt-4 space-y-2 text-[1.0625rem] leading-[1.55]">
                    {c.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>

                  {c.lead && (
                    <p className="mt-4 flex gap-3 border border-sanguine/30 bg-sanguine/5 px-4 py-3 text-[1.0625rem] leading-[1.5] text-ink">
                      <Users className="mt-1 size-4 shrink-0 text-sanguine" strokeWidth={1.5} aria-label="Leadership" />
                      {c.lead}
                    </p>
                  )}
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
