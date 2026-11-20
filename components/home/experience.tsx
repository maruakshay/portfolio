"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { career } from "@/lib/content";
import { roleImpact } from "@/lib/home";
import { Reveal } from "./motion";

function yearsShort(y: string) {
  // "Sep 2026 — now" → "2026–now", "2025 — 2026" → "2025–26"
  const parts = y.replace(/[A-Za-z]{3}\s/g, "").split(/\s*—\s*/);
  if (parts.length === 1) return parts[0];
  const [a, b] = parts;
  if (/now/i.test(b)) return `${a}–now`;
  return `${a}–${b.slice(-2)}`;
}

export function Experience() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section id="experience" aria-labelledby="exp-title" className="border-t border-rule">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-[1fr_1.6fr] lg:gap-20 lg:px-10">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className="label">Experience</p>
          <h2 id="exp-title" className="mt-4 text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95]">
            Seven years, <em>one exit.</em>
          </h2>
          <p className="mt-6 max-w-[38ch] text-ink-muted">
            From frontends to founding an AI company and selling it, then enterprise AI at a security company. I&apos;ve
            led and mentored teams of 4 to 5 engineers. Today I help teams ship AI their customers can trust.
          </p>
        </Reveal>

        <ol className="relative">
          <span aria-hidden className="absolute bottom-3 left-[7px] top-3 w-px bg-rule" />
          {career.map((c, i) => {
            const isOpen = open === i;
            const panelId = `role-${i}`;
            return (
              <li key={c.org} className="relative pl-10">
                <span
                  aria-hidden
                  className={`absolute left-0 top-[1.85rem] size-[15px] rounded-full border transition-colors duration-300 ${
                    isOpen ? "border-ink bg-ink" : "border-ink/30 bg-canvas"
                  }`}
                />
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-start gap-4 border-b border-rule py-6 text-left"
                >
                  <span className="flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <span className="text-[clamp(1.5rem,3vw,2rem)] font-medium leading-tight tracking-[-0.035em] text-ink">
                        {c.org.replace(" Technologies · TopDoc AI", " / TopDoc AI")}
                      </span>
                      <span className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-ink-faint">
                        {yearsShort(c.years)}
                        {/acquired/i.test(c.title) ? " · acquired" : ""}
                      </span>
                    </span>
                    <span className="mt-2 block max-w-[56ch] text-[0.975rem] text-ink-muted">
                      {roleImpact[c.org] ?? c.points[0]}
                    </span>
                  </span>
                  <Plus
                    aria-hidden
                    className={`mt-3 size-5 shrink-0 text-ink-faint transition-transform duration-300 group-hover:text-ink ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pt-5">
                        <p className="label">
                          {c.title.replace(/\s*·\s*acquired/i, "")} · {c.place}
                        </p>
                        <ul className="mt-4 space-y-3">
                          {[...c.points, ...(c.lead ? [c.lead] : [])].map((p) => (
                            <li key={p} className="flex gap-3 text-[0.975rem] leading-relaxed text-ink-muted">
                              <span aria-hidden className="mt-[0.75em] h-px w-3 shrink-0 bg-ink-faint" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
