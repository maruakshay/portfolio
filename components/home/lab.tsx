import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { lab, type LabPreview } from "@/lib/home";
import { Reveal } from "./motion";

/* Tiny looping previews, pure SVG/CSS (keyframes in globals.css, .lab-*). */
function Preview({ kind }: { kind: LabPreview }) {
  if (kind === "terminal") {
    const lines = ["$ npm i -g miii-agent", "$ miii", "● plan → edit → test", "✓ 14 passed"];
    return (
      <div className="flex h-full flex-col justify-center gap-1.5 px-5 font-mono text-[0.72rem] text-ink-muted">
        {lines.map((l, i) => (
          <span key={l} className="lab-line whitespace-nowrap" style={{ animationDelay: `${i * 0.7}s` }}>
            {l}
          </span>
        ))}
        <span className="mark-blink inline-block h-3 w-1.5 bg-ink/70" />
      </div>
    );
  }
  if (kind === "grid") {
    return (
      <div className="flex h-full items-center justify-center" aria-hidden>
        <div className="grid grid-cols-[repeat(15,8px)] gap-[5px]">
          {Array.from({ length: 58 }, (_, i) => (
            <span
              key={i}
              className="lab-cell size-2 rounded-[1px] bg-ink"
              style={{ animationDelay: `${((i % 15) + Math.floor(i / 15) * 3) * 0.09}s` }}
            />
          ))}
        </div>
      </div>
    );
  }
  if (kind === "neuron") {
    return (
      <svg viewBox="0 0 240 120" className="h-full w-full text-ink" fill="none" stroke="currentColor" aria-hidden>
        <g opacity="0.45" strokeWidth="1">
          <path d="M60 60 32 30M60 60 24 52M60 60 30 86M60 60 46 100M60 60 50 20" />
          <path d="M32 30 20 22M32 30 26 16M30 86 16 94M24 52 10 48" />
          <path d="M60 60 C110 60 140 58 200 60" />
          <path d="M200 60 220 44M200 60 224 62M200 60 218 80" />
        </g>
        <circle cx="60" cy="60" r="9" fill="currentColor" opacity="0.85" stroke="none" />
        <path className="lab-axon" d="M60 60 C110 60 140 58 200 60" strokeWidth="2" pathLength={1} />
        <circle className="lab-soma" cx="60" cy="60" r="14" strokeWidth="1" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 240 120" className="h-full w-full text-ink" fill="none" stroke="currentColor" aria-hidden>
      <circle cx="120" cy="60" r="44" opacity="0.35" />
      <path d="M78 44 C96 26 144 26 162 44" opacity="0.25" />
      <g className="lab-iris" style={{ transformOrigin: "120px 60px" }}>
        <circle cx="120" cy="60" r="22" strokeDasharray="2 3" opacity="0.8" />
        <circle cx="120" cy="60" r="16" strokeDasharray="1 4" opacity="0.5" />
      </g>
      <circle className="lab-pupil" cx="120" cy="60" r="8" fill="currentColor" stroke="none" style={{ transformOrigin: "120px 60px" }} />
      <ellipse cx="120" cy="60" rx="5" ry="13" opacity="0.3" transform="translate(-34 0)" />
      <path d="M164 60 h44" strokeDasharray="2 4" opacity="0.35" />
    </svg>
  );
}

export function Lab() {
  return (
    <section aria-labelledby="lab-title" className="border-t border-rule">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10">
        <Reveal className="mb-12 flex flex-col gap-4 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label">Open source &amp; 3D lab</p>
            <h2 id="lab-title" className="mt-4 text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95]">
              Built in the open.
            </h2>
          </div>
          <p className="max-w-[36ch] text-ink-muted">Tools and experiments I maintain publicly. Free to use, read and fork.</p>
        </Reveal>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4">
          {lab.map((l, i) => (
            <Reveal
              as="li"
              key={l.slug}
              delay={(i % 2) * 0.06}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-rule bg-canvas-deep transition-colors duration-300 hover:border-ink/25"
            >
              <div className="h-40 border-b border-rule bg-[radial-gradient(ellipse_at_50%_100%,rgba(242,236,226,0.05),transparent_70%)] sm:h-44">
                <Preview kind={l.preview} />
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[1.6rem] leading-tight tracking-[-0.03em]">
                    <Link href={`/work/${l.slug}`} className="after:absolute after:inset-0 after:content-['']">
                      {l.name}
                    </Link>
                  </h3>
                  <span className="label shrink-0 text-right">{l.tag}</span>
                </div>
                <p className="mt-2 max-w-[48ch] text-[0.95rem] leading-snug text-ink-muted">{l.line}</p>
                <div className="mt-6 flex items-center justify-between gap-4 pt-1">
                  <span className="font-mono text-[0.72rem] uppercase tracking-[0.08em] text-ink-faint transition-colors group-hover:text-ink">
                    Deep-dive →
                  </span>
                  <a
                    href={l.external.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 inline-flex items-center gap-1 text-[0.9rem] text-ink-muted hover:text-ink"
                  >
                    {l.external.label}
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
