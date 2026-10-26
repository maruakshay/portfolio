"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { ledger, type LedgerEntry } from "@/lib/content";
import { Reveal } from "./reveal";
import { SectionRule } from "./ornament";

function onMove(e: React.MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

function Card({ e }: { e: LedgerEntry }) {
  const internal = Boolean(e.slug);
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
      <h3 className="mt-6 font-display text-4xl font-extrabold leading-none tracking-tight text-ink md:text-5xl">
        {e.title}
      </h3>
      <p className="mt-2 font-serif text-lg italic text-ink-muted">{e.sub}</p>
      <p className="mt-4 text-base leading-relaxed text-ink-muted">{e.blurb}</p>
      {e.stack && (
        <p className="mt-5 font-mono text-xs leading-relaxed text-ink-faint">
          <span className="text-cyan">Built with </span>
          {e.stack}
        </p>
      )}
      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 font-mono text-xs text-ink transition-colors group-hover:text-volt">
        {internal ? "How I built it" : e.hrefLabel}
        {internal ? (
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
        ) : (
          <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        )}
      </span>
    </>
  );
  const cls =
    "spotlight frame group flex h-full flex-col bg-canvas-deep/60 p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-volt/50 md:p-8";
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

// One project in focus at a time: swipe (touch or trackpad), the arrow
// buttons, the dots, or ←/→ on the keyboard. Native scroll-snap does the work.
export function WorkGrid() {
  const track = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [edge, setEdge] = useState({ start: true, end: false });

  const sync = useCallback(() => {
    const el = track.current;
    const first = el?.children[0] as HTMLElement | undefined;
    if (!el || !first) return;
    const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setActive(end ? ledger.length - 1 : Math.round(el.scrollLeft / step));
    setEdge({ start: el.scrollLeft <= 4, end });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const go = (i: number) => {
    const el = track.current;
    const card = el?.children[Math.max(0, Math.min(ledger.length - 1, i))] as HTMLElement | undefined;
    if (!el || !card) return;
    // The track is `relative`, so offsetLeft is measured from its own edge.
    el.scrollTo({ left: card.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), behavior: reduce ? "auto" : "smooth" });
  };

  function onKey(e: React.KeyboardEvent) {
    const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    go(active + dir);
  }

  const btn =
    "grid size-11 place-items-center rounded-full border border-rule bg-canvas-deep text-ink transition-colors hover:border-volt hover:text-volt disabled:pointer-events-none disabled:opacity-30";

  return (
    <section id="work" className="scroll-mt-20 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pt-20 md:px-8 md:pt-28">
        <SectionRule n="02" label="Shipped" />
        <div className="flex flex-wrap items-end justify-between gap-4 pb-10 pt-8">
          <h2 className="max-w-[18ch] font-display text-[clamp(2.25rem,5.5vw,4rem)] font-extrabold leading-[0.95] text-ink">
            Not demos. Things people <em className="text-volt">actually use.</em>
          </h2>
          <p className="max-w-xs text-sm text-ink-faint">
            Jobs and personal projects, most important first. Swipe or use the arrows; open any project to see the problem, the design choices, and how it was built.
          </p>
        </div>
      </div>

      {/* Full-bleed track: side gutters line the first card up with the
          page column, and neighbours peek in from the screen edge. */}
      <Reveal>
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Shipped work"
            tabIndex={0}
            onKeyDown={onKey}
            className="rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-volt"
          >
            <ul
              ref={track}
              onScroll={sync}
              className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain py-2 [--gutter:max(1rem,calc((100%_-_72rem)/2_+_1rem))] [scrollbar-width:none] px-[var(--gutter)] scroll-px-[var(--gutter)] md:[--gutter:max(2rem,calc((100%_-_72rem)/2_+_2rem))] [&::-webkit-scrollbar]:hidden"
            >
              {ledger.map((e, i) => (
                <li
                  key={e.title}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${ledger.length}: ${e.title}`}
                  className={`w-[86%] shrink-0 snap-start transition-opacity duration-300 sm:w-[70%] lg:w-[calc(50%-0.5rem)] ${
                    i === active ? "opacity-100" : "opacity-70 lg:opacity-100"
                  }`}
                >
                  <Card e={e} />
                </li>
              ))}
            </ul>
          </div>
      </Reveal>

      {/* Controls: counter, dots, arrows */}
      <div className="mx-auto max-w-6xl px-4 pb-20 md:px-8 md:pb-28">
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="hidden flex-1 items-center justify-center gap-1.5 md:flex">
            {ledger.map((e, i) => (
              <button
                key={e.title}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show ${e.title}`}
                aria-current={i === active}
                className="grid h-6 place-items-center px-0.5"
              >
                <span className={`block h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-volt" : "w-1.5 bg-rule hover:bg-ink-faint"}`} />
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-4">
            <p className="font-mono text-xs text-ink-faint" aria-live="polite">
              <span className="text-ink">{String(active + 1).padStart(2, "0")}</span> / {String(ledger.length).padStart(2, "0")}
              <span className="hidden sm:inline"> · {ledger[active].title}</span>
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => go(active - 1)} disabled={edge.start} aria-label="Previous project" className={btn}>
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <button type="button" onClick={() => go(active + 1)} disabled={edge.end} aria-label="Next project" className={btn}>
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
