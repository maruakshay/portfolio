"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { faq } from "@/lib/home";
import { Reveal } from "./motion";

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();

  return (
    <section aria-labelledby="faq-title" className="border-t border-rule">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-[1fr_1.6fr] lg:gap-20 lg:px-10">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className="label">FAQ</p>
          <h2 id="faq-title" className="mt-4 text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95]">
            Questions, <em>answered.</em>
          </h2>
        </Reveal>

        <ul className="border-t border-rule">
          {faq.map((f, i) => {
            const isOpen = open === i;
            const panelId = `faq-${i}`;
            return (
              <li key={f.q} className="border-b border-rule">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-start gap-4 py-6 text-left"
                >
                  <span className="flex-1 text-[clamp(1.15rem,2.2vw,1.4rem)] font-medium leading-snug tracking-[-0.025em] text-ink">
                    {f.q}
                  </span>
                  <Plus
                    aria-hidden
                    className={`mt-1 size-5 shrink-0 text-ink-faint transition-transform duration-300 group-hover:text-ink ${
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
                      <p className="max-w-[60ch] pb-6 text-[0.975rem] leading-relaxed text-ink-muted">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
