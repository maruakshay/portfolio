import type { Metadata } from "next";
import { ArrowUpRight, Check, X } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/home/motion";
import { SectionHead } from "@/components/home/section-head";
import {
  cpCauses,
  cpDisclaimer,
  cpExercise,
  cpFacts,
  cpHero,
  cpMoves,
  cpMyths,
  cpSafety,
  cpSignal,
  cpWeek,
  cpWhat,
  cpWhy,
} from "@/lib/cerebral-palsy";
import { instagram } from "@/lib/instagram";

export const metadata: Metadata = {
  title: "Cerebral palsy, explained simply",
  description:
    "What cerebral palsy is, how it happens, why muscles get tight, and how exercise helps. A plain-language guide from Akshay Maru, who lives with unilateral CP.",
  alternates: { canonical: "/cerebral-palsy" },
  openGraph: {
    url: "/cerebral-palsy",
    title: "Cerebral palsy, explained simply · Akshay Maru",
  },
};

const card =
  "flex flex-col rounded-xl border border-rule bg-canvas-deep p-6 transition-colors duration-300 hover:border-ink/25 sm:p-7";
const section = "mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10";

/** Brain → spinal cord → muscles, drawn twice: a clean signal and a scrambled one. */
function SignalRow({ scrambled }: { scrambled?: boolean }) {
  return (
    <div className="rounded-xl border border-rule bg-canvas-deep p-6 sm:p-7">
      <p className="label">{scrambled ? "With cerebral palsy" : "Typical"}</p>
      <div className="relative mt-8">
        <svg
          aria-hidden
          viewBox="0 0 600 40"
          preserveAspectRatio="none"
          className="absolute inset-x-[8%] top-[14px] h-10 w-[84%] -translate-y-1/2"
        >
          {scrambled ? (
            <path
              d="M0 20 L60 20 L75 4 L90 36 L105 8 L120 32 L135 14 L150 26 L165 20 L300 20 L315 10 L330 30 L345 20 L600 20"
              fill="none"
              stroke="var(--color-volt)"
              strokeWidth="2"
              strokeDasharray="6 5"
              vectorEffect="non-scaling-stroke"
            />
          ) : (
            <path
              d="M0 20 L600 20"
              fill="none"
              stroke="var(--color-ink)"
              strokeOpacity="0.5"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
        <ol className="relative grid grid-cols-3">
          {cpSignal.map((s, i) => (
            <li key={s.t} className="flex flex-col items-center text-center">
              <span
                className={`flex size-7 items-center justify-center rounded-full border font-mono text-[0.7rem] ${
                  scrambled && i === 0
                    ? "border-volt bg-volt text-canvas"
                    : "border-rule bg-canvas text-ink"
                }`}
              >
                {i + 1}
              </span>
              <span className="mt-3 text-[1.05rem] font-medium text-ink">{s.t}</span>
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-6 text-[0.95rem] leading-snug text-ink-muted">
        {scrambled
          ? "The injury is in the brain. The command leaves scrambled, so muscles get it too strong, too weak or at the wrong time."
          : "The brain plans a movement and the command travels cleanly to the muscles."}
      </p>
    </div>
  );
}

export default function CerebralPalsyPage() {
  return (
    <div className="grain">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section
          aria-labelledby="cp-title"
          className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 sm:pt-40 lg:px-10"
        >
          <Reveal>
            <p className="label">{cpHero.label}</p>
            <h1
              id="cp-title"
              className="mt-4 max-w-[16ch] text-[clamp(2.8rem,8vw,6rem)] leading-[0.92]"
            >
              {cpHero.title[0]} <em>{cpHero.title[1]}</em>
            </h1>
            <p className="mt-8 max-w-[58ch] text-[1.1rem] text-ink-muted">{cpHero.sub}</p>
            <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-2">
              {[
                ["#what", "What it is"],
                ["#how", "How it happens"],
                ["#why", "Why"],
                ["#myths", "Myths"],
                ["#exercise", "Exercise"],
              ].map(([href, l]) => (
                <a
                  key={href}
                  href={href}
                  className="rounded-full border border-rule px-4 py-2 text-[0.95rem] text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
                >
                  {l}
                </a>
              ))}
            </nav>
          </Reveal>

          <ul className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
            {cpFacts.map((f, i) => (
              <Reveal
                as="li"
                key={f.label}
                delay={i * 0.05}
                className={`${card} min-h-[160px] justify-between`}
              >
                <span className="text-[clamp(2.6rem,6vw,4.5rem)] font-medium leading-none tracking-[-0.05em] text-ink">
                  {f.value}
                </span>
                <span className="mt-6 block text-ink-muted">{f.label}</span>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* What it is */}
        <section id="what" aria-labelledby="what-title" className="scroll-mt-16 border-t border-rule">
          <div className={section}>
            <SectionHead
              id="what-title"
              label={cpWhat.label}
              title={
                <>
                  {cpWhat.title[0]} <em>{cpWhat.title[1]}</em>
                </>
              }
              aside={cpWhat.intro}
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:gap-4">
              <Reveal>
                <SignalRow />
              </Reveal>
              <Reveal delay={0.06}>
                <SignalRow scrambled />
              </Reveal>
            </div>
            <ul className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3 lg:mt-4 lg:gap-4">
              {cpWhat.points.map((p, i) => (
                <Reveal as="li" key={p.t} delay={i * 0.06} className={`${card} min-h-[200px] justify-between`}>
                  <span className="font-mono text-[0.75rem] text-ink-faint">0{i + 1}</span>
                  <span className="mt-10 block">
                    <span className="block text-[1.4rem] font-medium leading-tight tracking-[-0.03em] text-ink">
                      {p.t}
                    </span>
                    <span className="mt-2 block text-[0.95rem] leading-snug text-ink-muted">{p.d}</span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* How it happens */}
        <section id="how" aria-labelledby="how-title" className="scroll-mt-16 border-t border-rule">
          <div className={section}>
            <SectionHead
              id="how-title"
              label={cpCauses.label}
              title={
                <>
                  {cpCauses.title[0]} <em>{cpCauses.title[1]}</em>
                </>
              }
              aside={cpCauses.intro}
            />
            <ol className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:gap-4">
              {cpCauses.stages.map((s, i) => (
                <Reveal as="li" key={s.when} delay={i * 0.06} className={card}>
                  <span className="flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.08em] text-ink-faint">
                    <span>Stage 0{i + 1}</span>
                    <span className={i === 0 ? "text-volt" : undefined}>{s.share}</span>
                  </span>
                  <span className="mt-8 block text-[1.6rem] font-medium leading-tight tracking-[-0.03em] text-ink">
                    {s.when}
                  </span>
                  <ul className="mt-5 space-y-2.5">
                    {s.items.map((it) => (
                      <li key={it} className="flex gap-3 text-[0.95rem] leading-snug text-ink-muted">
                        <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-ink/40" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Why */}
        <section id="why" aria-labelledby="why-title" className="scroll-mt-16 border-t border-rule">
          <div className={section}>
            <SectionHead
              id="why-title"
              label={cpWhy.label}
              title={
                <>
                  {cpWhy.title[0]} <em>{cpWhy.title[1]}</em>
                </>
              }
              aside={cpWhy.intro}
            />
            <p className="label">Types, by how movement is affected</p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {cpWhy.types.map((t, i) => (
                <Reveal as="li" key={t.t} delay={(i % 4) * 0.05} className={`${card} min-h-[200px]`}>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-ink-faint">
                    {t.share}
                  </span>
                  <span className="mt-8 block text-[1.4rem] font-medium leading-tight tracking-[-0.03em] text-ink">
                    {t.t}
                  </span>
                  <span className="mt-2 block text-[0.95rem] leading-snug text-ink-muted">{t.d}</span>
                </Reveal>
              ))}
            </ul>
            <p className="label mt-14">Where it shows up in the body</p>
            <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:gap-4">
              {cpWhy.where.map((w, i) => (
                <Reveal as="li" key={w.t} delay={i * 0.06} className={card}>
                  <span className="block text-[1.6rem] font-medium leading-tight tracking-[-0.03em] text-ink">
                    {w.t}
                  </span>
                  <span className="mt-2 block text-[0.95rem] leading-snug text-ink-muted">{w.d}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Myths */}
        <section id="myths" aria-labelledby="myths-title" className="scroll-mt-16 border-t border-rule">
          <div className={section}>
            <SectionHead
              id="myths-title"
              label="Myths vs facts"
              title={
                <>
                  What people get <em>wrong.</em>
                </>
              }
            />
            <ul className="divide-y divide-rule border-y border-rule">
              {cpMyths.map((m, i) => (
                <Reveal
                  as="li"
                  key={m.myth}
                  delay={i * 0.04}
                  className="grid grid-cols-1 gap-4 py-7 md:grid-cols-2 md:gap-10"
                >
                  <p className="flex gap-3 text-[1.15rem] text-ink-faint line-through decoration-ink/30">
                    <X aria-hidden className="mt-1 size-5 shrink-0 text-ink-faint" />
                    <span>
                      <span className="sr-only">Myth: </span>
                      {m.myth}
                    </span>
                  </p>
                  <p className="flex gap-3 text-[1.15rem] text-ink">
                    <Check aria-hidden className="mt-1 size-5 shrink-0 text-volt" />
                    <span>
                      <span className="sr-only">Fact: </span>
                      {m.fact}
                    </span>
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Exercise */}
        <section id="exercise" aria-labelledby="exercise-title" className="scroll-mt-16 border-t border-rule">
          <div className={section}>
            <SectionHead
              id="exercise-title"
              label={cpExercise.label}
              title={
                <>
                  {cpExercise.title[0]} <em>{cpExercise.title[1]}</em>
                </>
              }
              aside={cpExercise.intro}
            />
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {cpExercise.why.map((w, i) => (
                <Reveal as="li" key={w.t} delay={(i % 4) * 0.05} className={`${card} min-h-[180px] justify-between`}>
                  <span className="font-mono text-[0.75rem] text-ink-faint">0{i + 1}</span>
                  <span className="mt-8 block">
                    <span className="block text-[1.4rem] font-medium leading-tight tracking-[-0.03em] text-ink">
                      {w.t}
                    </span>
                    <span className="mt-2 block text-[0.95rem] leading-snug text-ink-muted">{w.d}</span>
                  </span>
                </Reveal>
              ))}
            </ul>

            <p className="label mt-20">Moves to start with</p>
            <div className="mt-6 space-y-3 lg:space-y-4">
              {cpMoves.map((g) => (
                <Reveal
                  key={g.t}
                  className="grid grid-cols-1 gap-6 rounded-xl border border-rule bg-canvas-deep p-6 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-10"
                >
                  <div>
                    <h3 className="text-[1.6rem] font-medium leading-tight tracking-[-0.03em] text-ink">{g.t}</h3>
                    <p className="mt-2 text-[0.95rem] text-ink-muted">{g.goal}</p>
                  </div>
                  <ul className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                    {g.moves.map((m) => (
                      <li key={m.name}>
                        <span className="block font-medium text-ink">{m.name}</span>
                        <span className="mt-1 block text-[0.95rem] leading-snug text-ink-muted">{m.how}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>

            <p className="label mt-20">A good week, according to research</p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
              {cpWeek.map((w, i) => (
                <Reveal as="li" key={w.label} delay={i * 0.05} className={`${card} min-h-[160px] justify-between`}>
                  <span className="text-[clamp(2.4rem,5vw,3.8rem)] font-medium leading-none tracking-[-0.05em] text-volt">
                    {w.value}
                  </span>
                  <span className="mt-6 block text-ink-muted">{w.label}</span>
                </Reveal>
              ))}
            </ul>
            <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-ink-faint">
              Source: Verschuren et al., 2016, exercise recommendations for people with CP
            </p>

            <Reveal className="mt-20 grid grid-cols-1 gap-8 rounded-xl border border-volt/40 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10">
              <h3 className="text-[1.8rem] font-medium leading-tight tracking-[-0.03em] text-ink">
                Train <em>safely.</em>
              </h3>
              <ol className="space-y-4">
                {cpSafety.map((s, i) => (
                  <li key={s} className="flex gap-4 text-ink-muted">
                    <span className="font-mono text-[0.75rem] leading-[1.9] text-ink-faint">0{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="cp-cta" className="border-t border-rule">
          <div className={section}>
            <Reveal>
              <h2 id="cp-cta" className="max-w-[18ch] text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95]">
                See what this looks like <em>in real life.</em>
              </h2>
              <p className="mt-6 max-w-[52ch] text-ink-muted">
                I share my training with unilateral CP on Instagram: the adaptations, the progress and the
                unglamorous days.
              </p>
              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[0.95rem] font-medium text-canvas transition-opacity hover:opacity-85"
              >
                Follow {instagram.handle}
                <ArrowUpRight aria-hidden className="size-4" />
              </a>
              <p className="mt-16 max-w-[70ch] border-t border-rule pt-6 text-[0.85rem] text-ink-faint">
                {cpDisclaimer}
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
