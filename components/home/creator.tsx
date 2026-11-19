/* eslint-disable @next/next/no-img-element -- small local thumbnails, optional */
import { ArrowUpRight } from "lucide-react";
import { channels } from "@/lib/content";
import { reels } from "@/lib/home";
import { Reveal } from "./motion";

/** Designed cover tile, shown until real reel thumbnails are added in lib/home.ts. */
function Cover({ i }: { i: number }) {
  return (
    <svg viewBox="0 0 90 160" className="h-full w-full text-ink" fill="none" stroke="currentColor" aria-hidden>
      <path d="M14 80h62" strokeWidth="2.4" opacity="0.7" />
      {[18, 26, 64, 72].map((x, k) => (
        <rect
          key={x}
          x={x - 2.5}
          y={80 - (k % 3 === 0 ? 14 : 10)}
          width="5"
          height={k % 3 === 0 ? 28 : 20}
          rx="1"
          fill="currentColor"
          opacity="0.6"
          stroke="none"
        />
      ))}
      {Array.from({ length: 6 }, (_, k) => (
        <path
          key={k}
          d={`M${18 + k * 11} ${136 - ((k * (i + 2)) % 5) * 6}v${8 + ((k * (i + 2)) % 5) * 6}`}
          opacity="0.35"
          strokeWidth="3"
        />
      ))}
    </svg>
  );
}

export function Creator() {
  const ch = channels[0];
  if (!ch) return null;
  const list = reels.lifts;
  const tiles = list.length ? list.slice(0, 3) : [0, 1, 2];

  return (
    <section aria-labelledby="creator-title" className="border-t border-rule">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10">
        <Reveal>
          <a
            href={ch.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid gap-10 rounded-xl border border-rule bg-canvas-deep p-6 transition-colors duration-300 hover:border-ink/25 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16"
          >
            <div>
              <p className="label">Creator · {ch.topic}</p>
              <h2 id="creator-title" className="mt-4 text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95]">
                I also make things <em>people watch.</em>
              </h2>
              <p className="mt-8 flex items-center gap-3 text-[clamp(1.6rem,3vw,2.2rem)] font-medium tracking-[-0.04em] text-ink">
                {ch.handle}
                <ArrowUpRight
                  aria-hidden
                  className="size-6 text-ink-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                />
              </p>
              <p className="mt-3 max-w-[46ch] text-ink-muted">{ch.pitch}</p>
              <span className="mt-8 inline-block font-mono text-[0.72rem] uppercase tracking-[0.08em] text-ink-faint transition-colors group-hover:text-ink">
                Watch on Instagram →
              </span>
            </div>
            <ul className="grid grid-cols-3 gap-2 sm:gap-3">
              {tiles.map((t, i) => (
                <li
                  key={i}
                  className="relative aspect-[9/16] overflow-hidden rounded-lg border border-rule bg-[#141416] transition-transform duration-500 ease-out group-hover:-translate-y-1"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  {typeof t === "number" ? (
                    <Cover i={t} />
                  ) : (
                    <img src={t.src} alt={t.alt} loading="lazy" className="h-full w-full object-cover" />
                  )}
                  <span className="absolute bottom-2 left-2 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-ink-faint">
                    ▶ Reel
                  </span>
                </li>
              ))}
            </ul>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
