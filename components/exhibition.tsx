"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { ledger } from "@/lib/content";
import { SectionRule, roman } from "./ornament";

// The work, hung as an exhibition: an index of pieces on one wall, the
// selected piece lit on the other. A vertical tablist, arrow-key navigable.
export function Exhibition() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();
  const entry = ledger[active];
  const internal = Boolean(entry.slug);

  function onKey(e: React.KeyboardEvent) {
    const dir = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (e.key === "Home" || e.key === "End" || dir) {
      e.preventDefault();
      const next =
        e.key === "Home" ? 0
        : e.key === "End" ? ledger.length - 1
        : (active + dir! + ledger.length) % ledger.length;
      setActive(next);
      tabs.current[next]?.focus();
    }
  }

  return (
    <section id="work" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
        <SectionRule n="01" label="Selected work" />
        <div className="flex flex-wrap items-end justify-between gap-3 pb-10 pt-8">
          <h2 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] font-normal leading-[1] text-ink">
            The <em className="italic text-sanguine">exhibition</em>
          </h2>
          <span className="label">Roles &amp; open source · hung by impact · use ↑ ↓</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-10">
          {/* Index wall */}
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Works"
            onKeyDown={onKey}
            className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-rule lg:px-0 lg:pb-0"
          >
            {ledger.map((e, i) => {
              const on = i === active;
              return (
                <button
                  key={e.title}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`work-tab-${i}`}
                  aria-selected={on}
                  aria-controls="work-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`group flex shrink-0 items-baseline gap-4 border px-4 py-3 text-left transition-colors lg:border-x-0 lg:border-t-0 lg:px-1 lg:py-4 ${
                    on
                      ? "border-sanguine bg-canvas-deep lg:border-b-rule lg:bg-transparent"
                      : "border-rule hover:border-ink-faint lg:border-b-rule"
                  }`}
                >
                  <span className={`w-9 font-display text-sm italic ${on ? "text-sanguine" : "text-gilt"}`}>
                    {roman(i + 1)}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block whitespace-nowrap font-display text-xl leading-tight transition-colors lg:text-2xl ${
                        on ? "text-sanguine" : "text-ink group-hover:text-ink"
                      }`}
                    >
                      {e.title}
                    </span>
                    <span className="label mt-0.5 hidden lg:block">
                      {e.kind === "role" ? "role" : "oss"} · {e.meta}
                    </span>
                  </span>
                  <ArrowRight
                    className={`ml-auto hidden size-4 shrink-0 self-center transition-all lg:block ${
                      on ? "translate-x-0 text-sanguine opacity-100" : "-translate-x-1 opacity-0"
                    }`}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>

          {/* Lit piece */}
          <div
            id="work-panel"
            role="tabpanel"
            aria-labelledby={`work-tab-${active}`}
            className="frame relative min-h-[26rem] overflow-hidden bg-canvas-deep/60"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={entry.title}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
                className="flex h-full flex-col p-7 md:p-10"
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="label text-sanguine">
                    Fig. {roman(active + 1)} · {entry.kind === "role" ? "role" : "open source"}
                  </span>
                  <span className="label">{entry.meta}</span>
                </div>

                <h3 className="mt-8 font-display text-[clamp(2.75rem,6vw,4.5rem)] font-normal leading-[0.95] text-ink">
                  {entry.title}
                </h3>
                <p className="mt-3 font-display text-xl italic leading-snug text-ink-faint md:text-2xl">
                  {entry.sub}
                </p>

                <p className="prose-folio initial mt-8 text-[1.1875rem] leading-[1.65] text-ink-muted">
                  {entry.blurb}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-10">
                  {internal && (
                    <Link
                      href={`/work/${entry.slug}`}
                      className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.06em] text-canvas transition-colors hover:bg-sanguine"
                    >
                      Read the deep-dive <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                  )}
                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-ink/40 px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.06em] text-ink transition-colors hover:border-sanguine hover:text-sanguine"
                  >
                    {entry.hrefLabel} <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                </div>
              </motion.article>
            </AnimatePresence>

            {/* Gallery numeral, watermark */}
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-10 right-4 select-none font-display text-[12rem] italic leading-none text-gilt/15"
            >
              {roman(active + 1)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
