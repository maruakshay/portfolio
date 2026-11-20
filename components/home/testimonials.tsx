import { realTestimonials } from "@/lib/offer";
import { Reveal } from "./motion";
import { SectionHead } from "./section-head";

/** Renders only once real quotes are filled in lib/offer.ts. */
export function Testimonials() {
  if (realTestimonials.length === 0) return null;
  return (
    <section aria-labelledby="testimonials-title" className="border-t border-rule">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10">
        <SectionHead id="testimonials-title" label="Testimonials" title={<>What people <em>say</em></>} />
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:gap-4">
          {realTestimonials.map((t, i) => (
            <Reveal
              as="li"
              key={`${t.name}-${i}`}
              delay={i * 0.06}
              className="flex flex-col justify-between rounded-xl border border-rule bg-canvas-deep p-6 sm:p-8"
            >
              <blockquote className="text-[1.1rem] leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
              <p className="mt-8">
                <span className="block font-medium text-ink">{t.name}</span>
                <span className="label mt-1 block">{t.role}</span>
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
