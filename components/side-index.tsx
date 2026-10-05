"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "work", n: "01", label: "Work" },
  { id: "miii", n: "02", label: "miii" },
  { id: "career", n: "03", label: "Career" },
  { id: "method", n: "04", label: "Method" },
  { id: "contact", n: "05", label: "Contact" },
];

// A margin index, like a book's running table of contents. Only on wide
// screens where there is a real margin to hold it; tracks the section in view.
export function SideIndex() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Sections"
      className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 2xl:block"
    >
      <ol className="space-y-3 border-l border-rule pl-4">
        {SECTIONS.map((s) => {
          const on = active === s.id;
          return (
            <li key={s.id} className="relative">
              {on && <span className="absolute -left-[17px] top-0.5 h-3.5 w-px bg-sanguine" aria-hidden />}
              <a
                href={`#${s.id}`}
                aria-current={on ? "true" : undefined}
                className={`flex items-baseline gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.06em] transition-colors ${
                  on ? "text-sanguine" : "text-ink-faint hover:text-ink"
                }`}
              >
                <span>{s.n}</span>
                <span>{s.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
