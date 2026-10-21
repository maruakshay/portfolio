"use client";

import { Phone, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { callHref } from "@/lib/content";
import { useAchievements } from "../achievements";

export function readBest(key: string) {
  try {
    return Number(localStorage.getItem(key) ?? 0) || 0;
  } catch {
    return 0;
  }
}

export function writeBest(key: string, v: number) {
  try {
    localStorage.setItem(key, String(v));
  } catch {
    /* storage blocked */
  }
}

/** End-of-game card shared by every arcade game: score, a line, and the ask. */
export function GameResult({
  kicker,
  title,
  children,
  context,
  onReplay,
}: {
  kicker: string;
  title: ReactNode;
  children: ReactNode;
  context: string;
  onReplay: () => void;
}) {
  const { unlock } = useAchievements();
  return (
    <div className="flex min-h-[26rem] flex-col items-start justify-center gap-5 p-6 md:p-10 [animation:pop_420ms_var(--ease-spring)]">
      <p className="label text-volt">{kicker}</p>
      <h3 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[0.95] text-ink">{title}</h3>
      <div className="max-w-xl text-lg leading-relaxed text-ink-muted">{children}</div>
      <div className="mt-2 flex flex-wrap gap-3">
        <a
          href={callHref(context)}
          target={callHref().startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          onClick={() => unlock("contact")}
          className="btn-primary"
        >
          <Phone className="size-4" aria-hidden /> Talk to the real thing
        </a>
        <button onClick={onReplay} className="btn-ghost">
          <RotateCcw className="size-4" aria-hidden /> Play again
        </button>
      </div>
    </div>
  );
}
