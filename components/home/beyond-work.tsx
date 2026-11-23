import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/content";
import { beyondWork } from "@/lib/home";
import { Reveal } from "./motion";
import { SectionHead } from "./section-head";

export function BeyondWork() {
  return (
    <section id="beyond-work" aria-labelledby="beyond-title" className="border-t border-rule">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10">
        <SectionHead
          id="beyond-title"
          label={beyondWork.label}
          title={
            <>
              {beyondWork.title[0]} <em>{beyondWork.title[1]}</em>
            </>
          }
          aside={beyondWork.intro}
        />
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:gap-4">
          {beyondWork.pillars.map((p, i) => (
            <Reveal
              as="li"
              key={p.t}
              delay={i * 0.06}
              className="flex min-h-[200px] flex-col justify-between rounded-xl border border-rule bg-canvas-deep p-6 transition-colors duration-300 hover:border-ink/25 sm:p-7"
            >
              <span className="font-mono text-[0.75rem] text-ink-faint">0{i + 1}</span>
              <span className="mt-10 block">
                <span className="block text-[1.6rem] font-medium leading-tight tracking-[-0.03em] text-ink">{p.t}</span>
                <span className="mt-2 block max-w-[40ch] text-[0.95rem] leading-snug text-ink-muted">{p.d}</span>
              </span>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={0.2} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={profile.instagramLifts}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-[clamp(1.4rem,2.6vw,2rem)] font-medium tracking-[-0.04em] text-ink"
          >
            Follow along at @akshaay.lifts
            <ArrowUpRight
              aria-hidden
              className="size-6 text-ink-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
            />
          </a>
          <Link
            href="/brands"
            className="font-mono text-[0.72rem] uppercase tracking-[0.08em] text-ink-faint transition-colors hover:text-ink"
          >
            For brands: work with me →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
