import { Play } from "lucide-react";
import { instagram, reelUrl } from "@/lib/instagram";

type Reel = (typeof instagram.recent)[number];

/** Reel shown as its on-screen hook: story progress bar, hook text, play button. */
export function ReelCard({ r, i }: { r: Reel; i: number }) {
  return (
    <a
      href={reelUrl(r.reel)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch the reel: ${r.hook.join("")}`}
      className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-xl border border-rule bg-canvas-deep p-5 transition-colors duration-300 hover:border-ink/25 sm:p-6"
    >
      {/* Warm glow that wakes up on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-1/3 -right-1/4 size-[80%] rounded-full bg-volt/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 sm:opacity-60"
      />

      {/* Story-style progress bar + meta */}
      <span className="relative block">
        <span className="block h-[2px] overflow-hidden rounded-full bg-ink/15">
          <span
            className="reel-progress block h-full w-full origin-left bg-ink"
            style={{ animationDelay: `${i * 1.6}s` }}
          />
        </span>
        <span className="mt-4 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.08em] text-ink-faint">
          <span>{r.tag}</span>
          <span>Reel 0{i + 1}</span>
        </span>
      </span>

      {/* The hook, as it appears on screen */}
      <span className="relative block">
        <span className="block text-[clamp(1.7rem,2.6vw,2.4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-ink">
          {r.hook[0]}
          <em className="text-volt">{r.hook[1]}</em>
          {r.hook[2]}
        </span>
        {r.caption && (
          <span className="mt-4 inline-flex items-center gap-1 font-mono text-[0.8rem] text-ink-muted">
            {r.caption}
            <span aria-hidden className="reel-caret inline-block h-[1em] w-[2px] bg-volt" />
          </span>
        )}
      </span>

      {/* Footer */}
      <span className="relative flex items-end justify-between gap-4">
        <span className="max-w-[28ch] text-[0.9rem] leading-snug text-ink-muted">{r.line}</span>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-rule text-ink transition-colors duration-300 group-hover:border-volt group-hover:bg-volt group-hover:text-canvas">
          <Play aria-hidden className="size-4 translate-x-[1px] fill-current" />
        </span>
      </span>
    </a>
  );
}
