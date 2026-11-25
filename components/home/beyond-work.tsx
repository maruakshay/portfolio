import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { beyondWork } from "@/lib/home";
import { instagram, instagramStats } from "@/lib/instagram";
import { ReelCard } from "@/components/reel-card";
import { Reveal } from "./motion";
import { SectionHead } from "./section-head";

const card =
  "flex flex-col justify-between rounded-xl border border-rule bg-canvas-deep p-6 transition-colors duration-300 hover:border-ink/25 sm:p-7";

/** The creator half of the site: stats, pinned reels, topics, and where to go next. */
export function BeyondWork() {
  return (
    <section id="creator" aria-labelledby="creator-title" className="scroll-mt-16 border-t border-rule">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10">
        <SectionHead
          id="creator-title"
          label={beyondWork.label}
          title={
            <>
              {beyondWork.title[0]} <em>{beyondWork.title[1]}</em>
            </>
          }
          aside={beyondWork.intro}
        />

        {instagramStats.length > 0 && (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
            {instagramStats.map((s, i) => (
              <Reveal as="li" key={s.label} delay={i * 0.05} className={`${card} min-h-[150px]`}>
                <span className="text-[clamp(2.6rem,6vw,4.5rem)] font-medium leading-none tracking-[-0.05em] text-ink">
                  {s.value}
                </span>
                <span className="mt-6 block text-ink-muted">{s.label}</span>
              </Reveal>
            ))}
            <Reveal as="li" delay={0.1} className={`${card} min-h-[150px]`}>
              <span className="text-[clamp(2.6rem,6vw,4.5rem)] font-medium leading-none tracking-[-0.05em] text-volt">
                3
              </span>
              <span className="mt-6 block text-ink-muted">topics: CP, stammering and fitness</span>
            </Reveal>
          </ul>
        )}

        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:mt-4 lg:gap-4">
          {instagram.recent.map((r, i) => (
            <Reveal as="li" key={r.reel} delay={i * 0.05}>
              <ReelCard r={r} i={i} />
            </Reveal>
          ))}
        </ul>

        <ul className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3 lg:mt-4 lg:gap-4">
          {beyondWork.pillars.map((p, i) => (
            <Reveal as="li" key={p.t} delay={i * 0.06} className={`${card} min-h-[200px]`}>
              <span className="font-mono text-[0.75rem] text-ink-faint">0{i + 1}</span>
              <span className="mt-10 block">
                <span className="block text-[1.6rem] font-medium leading-tight tracking-[-0.03em] text-ink">{p.t}</span>
                <span className="mt-2 block max-w-[40ch] text-[0.95rem] leading-snug text-ink-muted">{p.d}</span>
                {p.href && (
                  <Link
                    href={p.href}
                    className="mt-5 inline-flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-volt transition-opacity hover:opacity-80"
                  >
                    {p.cta} →
                  </Link>
                )}
              </span>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.15} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-[clamp(1.4rem,2.6vw,2rem)] font-medium tracking-[-0.04em] text-ink"
          >
            Follow along at {instagram.handle}
            <ArrowUpRight
              aria-hidden
              className="size-6 text-ink-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
            />
          </a>
          <Link href="/brands" className="btn-ghost">
            For brands: work with me
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
