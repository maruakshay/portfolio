"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { ledger, type LedgerEntry } from "@/lib/content";
import { Reveal } from "./reveal";
import { SectionRule } from "./ornament";

// Bento layout on a 6-col grid: the two current roles lead at half width,
// everything after at a third.
const SPAN = ["md:col-span-3", "md:col-span-3"];

function onMove(e: React.MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

function Card({ e, i }: { e: LedgerEntry; i: number }) {
  const internal = Boolean(e.slug);
  const big = i < SPAN.length;
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-2.5 py-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] ${
            e.kind === "role" ? "bg-volt/15 text-volt" : "bg-flare/15 text-flare"
          }`}
        >
          {e.kind === "role" ? "Shipped at work" : "Open source"}
        </span>
        <span className="font-mono text-xs text-ink-faint">{e.meta}</span>
      </div>
      <h3 className={`mt-6 font-display font-extrabold leading-none tracking-tight text-ink ${big ? "text-4xl md:text-5xl" : "text-3xl"}`}>
        {e.title}
      </h3>
      <p className="mt-2 font-serif text-lg italic text-ink-muted">{e.sub}</p>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-faint">{e.blurb}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 font-mono text-xs text-ink transition-colors group-hover:text-volt">
        {internal ? "Read the deep-dive" : e.hrefLabel}
        {internal ? (
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
        ) : (
          <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        )}
      </span>
    </>
  );
  const cls =
    "spotlight frame group flex h-full flex-col bg-canvas-deep/60 p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-volt/50 md:p-7";
  return internal ? (
    <Link href={`/work/${e.slug}`} onMouseMove={onMove} className={cls}>
      {body}
    </Link>
  ) : (
    <a href={e.href} target="_blank" rel="noopener noreferrer" onMouseMove={onMove} className={cls}>
      {body}
    </a>
  );
}

export function WorkGrid() {
  return (
    <section id="work" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
        <SectionRule n="01" label="Shipped" />
        <div className="flex flex-wrap items-end justify-between gap-4 pb-10 pt-8">
          <h2 className="max-w-[18ch] font-display text-[clamp(2.25rem,5.5vw,4rem)] font-extrabold leading-[0.95] text-ink">
            Not demos. Things people <em className="text-volt">actually use.</em>
          </h2>
          <p className="max-w-xs text-sm text-ink-faint">
            Roles and open source, ranked by impact. Hover anything; the deep-dives show the decisions.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-6">
          {ledger.map((e, i) => (
            <li key={e.title} className={SPAN[i] ?? "md:col-span-2"}>
              <Reveal delay={Math.min(i, 4) * 0.04} className="h-full">
                <Card e={e} i={i} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
