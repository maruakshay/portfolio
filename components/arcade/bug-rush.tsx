"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bug, Rocket, Zap } from "lucide-react";
import { useAchievements } from "../achievements";
import { GameResult, readBest, writeBest } from "./shared";

// 20 seconds of production. Squash bugs, leave the feature releases alone.
// Bugs get faster as you go; a combo multiplies every hit.
const CELLS = 16;
const DURATION = 20;
const BEST_KEY = "am:bugrush:best";
const GOAL = 15;

type Kind = "bug" | "ship";
type Cell = { kind: Kind; id: number } | null;
type Pop = { id: number; cell: number; text: string; good: boolean };

export function BugRush() {
  const { unlock } = useAchievements();
  const [phase, setPhase] = useState<"idle" | "play" | "over">("idle");
  const [grid, setGrid] = useState<Cell[]>(() => Array(CELLS).fill(null));
  const [left, setLeft] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [squashed, setSquashed] = useState(0);
  const [combo, setCombo] = useState(0);
  const [pops, setPops] = useState<Pop[]>([]);
  const [best, setBest] = useState(0);
  const [shake, setShake] = useState(0);
  const seq = useRef(0);
  const comboRef = useRef(0);

  useEffect(() => setBest(readBest(BEST_KEY)), []);

  const pop = useCallback((cell: number, text: string, good: boolean) => {
    const id = ++seq.current;
    setPops((p) => [...p, { id, cell, text, good }]);
    setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 650);
  }, []);

  // Clock
  useEffect(() => {
    if (phase !== "play") return;
    if (left <= 0) {
      setPhase("over");
      setGrid(Array(CELLS).fill(null));
      return;
    }
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, left]);

  // Spawner: speeds up as time runs out.
  useEffect(() => {
    if (phase !== "play") return;
    const elapsed = DURATION - left;
    const every = Math.max(330, 720 - elapsed * 22);
    const life = Math.max(700, 1300 - elapsed * 30);
    const id = setInterval(() => {
      const cell = Math.floor(Math.random() * CELLS);
      const kind: Kind = Math.random() < 0.2 ? "ship" : "bug";
      const spawn = ++seq.current;
      setGrid((g) => {
        if (g[cell]) return g;
        const n = [...g];
        n[cell] = { kind, id: spawn };
        return n;
      });
      setTimeout(() => {
        setGrid((g) => {
          if (g[cell]?.id !== spawn) return g;
          // A bug that escapes breaks the combo.
          if (g[cell]!.kind === "bug") {
            comboRef.current = 0;
            setCombo(0);
          }
          const n = [...g];
          n[cell] = null;
          return n;
        });
      }, life);
    }, every);
    return () => clearInterval(id);
  }, [phase, left]);

  useEffect(() => {
    if (phase !== "over") return;
    if (squashed >= GOAL) unlock("exterminator");
    if (score > best) {
      setBest(score);
      writeBest(BEST_KEY, score);
    }
    // Only on the transition into "over".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function hit(i: number) {
    if (phase !== "play") return;
    const c = grid[i];
    if (!c) return;
    setGrid((g) => {
      const n = [...g];
      n[i] = null;
      return n;
    });
    if (c.kind === "bug") {
      comboRef.current += 1;
      const mult = 1 + Math.floor(comboRef.current / 4);
      setCombo(comboRef.current);
      setScore((s) => s + 10 * mult);
      setSquashed((n) => n + 1);
      pop(i, `+${10 * mult}`, true);
    } else {
      comboRef.current = 0;
      setCombo(0);
      setScore((s) => Math.max(0, s - 25));
      setShake((n) => n + 1);
      pop(i, "−25 · that was a release", false);
    }
  }

  function start() {
    comboRef.current = 0;
    setGrid(Array(CELLS).fill(null));
    setLeft(DURATION);
    setScore(0);
    setSquashed(0);
    setCombo(0);
    setPhase("play");
  }

  if (phase === "over") {
    return (
      <GameResult
        kicker={`Bug Rush · ${squashed} squashed${score >= best && score > 0 ? " · new best" : ` · best ${best}`}`}
        title={
          <>
            <span className="text-volt">{score}</span> points.
          </>
        }
        context={`I scored ${score} in Bug Rush on your portfolio. Our production has more bugs than that.`}
        onReplay={start}
      >
        {squashed >= GOAL
          ? "Fast hands. "
          : `Squash ${GOAL}+ to unlock Exterminator. `}
        Akshay prefers fewer bugs to begin with: his TypeScript migration across 20+ services cut incidents
        40% and doubled developer velocity.
      </GameResult>
    );
  }

  const mult = 1 + Math.floor(combo / 4);

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label text-flare">Production · {DURATION}s</p>
          <h3 className="mt-2 font-display text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight text-ink">
            Squash the <span className="text-hot">bugs</span>. Don&apos;t touch the <span className="text-volt">releases</span>.
          </h3>
        </div>
        <dl className="flex gap-6 font-mono text-sm">
          <div>
            <dt className="label">Time</dt>
            <dd className={`text-2xl tabular-nums ${left <= 5 && phase === "play" ? "text-hot" : "text-ink"}`}>{left}s</dd>
          </div>
          <div>
            <dt className="label">Score</dt>
            <dd className="text-2xl tabular-nums text-ink">{score}</dd>
          </div>
          <div>
            <dt className="label">Combo</dt>
            <dd key={mult} className={`text-2xl tabular-nums ${mult > 1 ? "text-volt [animation:pop_300ms_var(--ease-spring)]" : "text-ink-faint"}`}>
              ×{mult}
            </dd>
          </div>
        </dl>
      </div>

      <div className="relative mt-6">
        <div
          key={shake}
          className={`grid grid-cols-4 gap-2 md:gap-3 ${shake ? "[animation:shake_260ms]" : ""}`}
          role="group"
          aria-label="Production grid"
        >
          {grid.map((c, i) => (
            <button
              key={i}
              onPointerDown={() => hit(i)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && hit(i)}
              disabled={phase !== "play"}
              aria-label={c ? (c.kind === "bug" ? "Bug" : "Release, don't click") : "Empty"}
              className={`relative grid aspect-[4/3] place-items-center rounded-sm border transition-colors ${
                c?.kind === "bug"
                  ? "border-hot/60 bg-hot/10"
                  : c?.kind === "ship"
                    ? "border-volt/50 bg-volt/10"
                    : "border-rule bg-canvas"
              }`}
            >
              {c && (
                <span key={c.id} className="[animation:pop_220ms_var(--ease-spring)]">
                  {c.kind === "bug" ? (
                    <Bug className="size-7 text-hot md:size-9" aria-hidden />
                  ) : (
                    <Rocket className="size-7 text-volt md:size-9" aria-hidden />
                  )}
                </span>
              )}
              {pops
                .filter((p) => p.cell === i)
                .map((p) => (
                  <span
                    key={p.id}
                    className={`pointer-events-none absolute top-1 whitespace-nowrap font-mono text-xs font-semibold [animation:float-up_650ms_ease-out_forwards] ${
                      p.good ? "text-volt" : "text-hot"
                    }`}
                  >
                    {p.text}
                  </span>
                ))}
            </button>
          ))}
        </div>

        {phase === "idle" && (
          <div className="absolute inset-0 grid place-items-center rounded-sm bg-canvas/80 backdrop-blur-sm">
            <div className="text-center">
              <button onClick={start} className="btn-primary text-base">
                <Zap className="size-4" aria-hidden /> Start the shift
              </button>
              <p className="mt-3 font-mono text-xs text-ink-faint">
                Every 4 hits in a row raises the multiplier{best ? ` · your best: ${best}` : ""}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
