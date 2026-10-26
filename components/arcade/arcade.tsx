"use client";

import { useRef, useState } from "react";
import { Brain, Bug, ShieldAlert, Trophy, type LucideIcon } from "lucide-react";
import { SectionRule } from "../ornament";
import { useAchievements, type AchievementId } from "../achievements";
import { MakeTheCall } from "./make-the-call";
import { BugRush } from "./bug-rush";
import { SpotInjection } from "./spot-injection";

const GAMES: { id: string; title: string; blurb: string; time: string; icon: LucideIcon; award: AchievementId; Game: () => React.JSX.Element }[] = [
  { id: "call", title: "Make the call", blurb: "Six real product decisions I made. Would you choose the same?", time: "90 sec", icon: Brain, award: "thinker", Game: MakeTheCall },
  { id: "bugs", title: "Bug Rush", blurb: "20 seconds of a live app breaking. How fast can you fix it?", time: "20 sec", icon: Bug, award: "exterminator", Game: BugRush },
  { id: "inject", title: "Spot the injection", blurb: "Be the safety filter on an AI chatbot. Allow or block.", time: "60 sec", icon: ShieldAlert, award: "red-team", Game: SpotInjection },
];

export function Arcade() {
  const { unlocked } = useAchievements();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { Game } = GAMES[active];

  function onKey(e: React.KeyboardEvent) {
    const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const n = (active + dir + GAMES.length) % GAMES.length;
    setActive(n);
    tabs.current[n]?.focus();
  }

  return (
    <section id="arcade" className="relative scroll-mt-20 overflow-hidden border-y border-rule bg-canvas-deep/40">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-20 h-[420px] w-[420px] rounded-full bg-flare/10 blur-[110px]" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
        <SectionRule n="03" label="The arcade" />
        <div className="flex flex-wrap items-end justify-between gap-4 pb-10 pt-8">
          <h2 className="max-w-[18ch] font-display text-[clamp(2.25rem,5.5vw,4rem)] font-extrabold leading-[0.95] text-ink">
            Don&apos;t take my word for it. <em className="text-volt">Play it.</em>
          </h2>
          <p className="max-w-xs text-sm text-ink-faint">
            Three quick games, no tech knowledge needed, built from real decisions in my work. Each one unlocks an achievement.
          </p>
        </div>

        <div role="tablist" aria-label="Games" onKeyDown={onKey} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {GAMES.map((g, i) => {
            const on = i === active;
            const won = unlocked.has(g.award);
            return (
              <button
                key={g.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`tab-${g.id}`}
                aria-selected={on}
                aria-controls={`panel-${g.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                className={`group relative flex items-start gap-4 rounded-sm border p-4 text-left transition-all ${
                  on ? "border-volt bg-volt/10" : "border-rule bg-canvas hover:-translate-y-0.5 hover:border-ink-faint"
                }`}
              >
                <span className={`grid size-10 shrink-0 place-items-center rounded-sm ${on ? "bg-volt text-canvas" : "bg-canvas-shade text-ink"}`}>
                  <g.icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                    {g.title}
                    {won && <Trophy className="size-3.5 text-volt" aria-label="completed" />}
                  </span>
                  <span className="block text-sm leading-snug text-ink-faint">{g.blurb}</span>
                  <span className="mt-1.5 block font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-ink-faint">{g.time}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${GAMES[active].id}`}
          aria-labelledby={`tab-${GAMES[active].id}`}
          className="frame mt-4 bg-canvas-deep"
        >
          <Game key={active} />
        </div>
      </div>
    </section>
  );
}
