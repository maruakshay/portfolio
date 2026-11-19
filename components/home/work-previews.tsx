"use client";

import { useEffect, useState } from "react";
import type { PreviewKind } from "@/lib/home";

/**
 * Looping UI illustrations for the Selected Work cards. Each is a tiny state
 * machine driven by one ticker: it plays while `playing`, and otherwise rests
 * on its finished frame (also the reduced-motion and no-JS view).
 */

function useTicker(playing: boolean, max: number, ms: number, hold = 2200) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!playing) return;
    let t = 0;
    let id = 0;
    const step = () => {
      if (t > max) {
        id = window.setTimeout(() => {
          t = 0;
          step();
        }, hold);
        return;
      }
      setTick(t);
      t += 1;
      id = window.setTimeout(step, ms);
    };
    id = window.setTimeout(step, 0);
    return () => window.clearTimeout(id);
  }, [playing, max, ms, hold]);
  // At rest (and with reduced motion) show the finished frame.
  return playing ? tick : max;
}

function Chrome({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border border-rule bg-[#111113] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-2 border-b border-rule px-3.5 py-2.5">
        <span className="size-2 rounded-full bg-ink/20" />
        <span className="size-2 rounded-full bg-ink/20" />
        <span className="size-2 rounded-full bg-ink/20" />
        <span className="ml-2 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-ink-faint">{title}</span>
      </div>
      <div className="relative flex-1 overflow-hidden p-4 sm:p-5">{children}</div>
    </div>
  );
}

/* ── Juno: streaming answer, then a live table ───────────────────────── */

const JUNO_ANSWER =
  "Found 3 publicly readable buckets in production. Two hold access logs and should be locked down; one serves static assets behind a CDN and is expected.";
const JUNO_ROWS = [
  ["prod-access-logs", "Public read", "High"],
  ["prod-elb-logs", "Public read", "High"],
  ["prod-static-assets", "CDN origin", "Expected"],
];
const JUNO_WORDS = JUNO_ANSWER.split(" ");

function Juno({ playing }: { playing: boolean }) {
  const max = JUNO_WORDS.length + JUNO_ROWS.length * 3;
  const tick = useTicker(playing, max, 70);
  const words = Math.min(tick, JUNO_WORDS.length);
  const rows = Math.max(0, Math.floor((tick - JUNO_WORDS.length) / 3));
  const streaming = tick < JUNO_WORDS.length;
  return (
    <Chrome title="Juno · security assistant">
      <div className="ml-auto w-fit max-w-[85%] rounded-lg rounded-br-sm bg-ink/[0.08] px-3 py-2 text-[0.82rem] text-ink">
        Which production S3 buckets are publicly readable?
      </div>
      <p className="mt-4 min-h-[4.5em] text-[0.82rem] leading-relaxed text-ink-muted">
        {JUNO_WORDS.slice(0, words).join(" ")}
        {streaming && <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-ink/70" />}
      </p>
      <div className="mt-3 overflow-hidden rounded border border-rule font-mono text-[0.68rem]">
        <div className="grid grid-cols-[1.6fr_1fr_0.8fr] gap-2 border-b border-rule bg-ink/[0.04] px-2.5 py-1.5 uppercase tracking-[0.06em] text-ink-faint">
          <span>Bucket</span>
          <span>Exposure</span>
          <span>Risk</span>
        </div>
        {JUNO_ROWS.map((r, i) => (
          <div
            key={r[0]}
            className="grid grid-cols-[1.6fr_1fr_0.8fr] gap-2 border-b border-rule px-2.5 py-1.5 text-ink-muted transition-all duration-300 last:border-b-0"
            style={{ opacity: i < rows ? 1 : 0, transform: i < rows ? "none" : "translateY(4px)" }}
          >
            <span className="truncate text-ink">{r[0]}</span>
            <span>{r[1]}</span>
            <span className={r[2] === "High" ? "text-ink" : "text-ink-faint"}>{r[2]}</span>
          </div>
        ))}
      </div>
    </Chrome>
  );
}

/* ── Remote Leaps: résumé scored, checks ticking in ─────────────────── */

const LEAPS_CHECKS = ["Impact quantified", "Role keywords matched", "No invented experience"];

function Leaps({ playing }: { playing: boolean }) {
  const max = 30;
  const tick = useTicker(playing, max, 55);
  const score = Math.round(52 + (34 * Math.min(tick, 20)) / 20);
  const checks = Math.max(0, Math.floor((tick - 20) / 3));
  const C = 2 * Math.PI * 34;
  return (
    <Chrome title="Remote Leaps · résumé score">
      <div className="grid h-full grid-cols-[1.1fr_1fr] gap-4">
        <div className="rounded border border-rule bg-ink/[0.03] p-3">
          <div className="h-2.5 w-2/3 rounded-sm bg-ink/30" />
          <div className="mt-1.5 h-1.5 w-1/2 rounded-sm bg-ink/15" />
          {[0, 1, 2].map((b) => (
            <div key={b} className="mt-4 space-y-1.5">
              <div className="h-1.5 w-1/3 rounded-sm bg-ink/25" />
              {[0.92, 0.8, 0.86].map((w, j) => (
                <div
                  key={j}
                  className="h-1.5 rounded-sm transition-colors duration-500"
                  style={{
                    width: `${w * 100}%`,
                    backgroundColor: tick > 6 + b * 4 + j ? "rgba(242,236,226,0.32)" : "rgba(242,236,226,0.12)",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative size-28">
            <svg viewBox="0 0 80 80" className="size-full -rotate-90">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(242,236,226,0.1)" strokeWidth="5" />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="#f2ece2"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - score / 100)}
                style={{ transition: "stroke-dashoffset 120ms linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-medium leading-none tracking-[-0.04em] text-ink tabular-nums">{score}</span>
              <span className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-ink-faint">score</span>
            </div>
          </div>
          <ul className="w-full space-y-1.5 font-mono text-[0.66rem] text-ink-muted">
            {LEAPS_CHECKS.map((c, i) => (
              <li
                key={c}
                className="flex items-center gap-2 transition-opacity duration-300"
                style={{ opacity: i < checks ? 1 : 0.2 }}
              >
                <span className="text-ink">✓</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Chrome>
  );
}

/* ── miii-cli: plan, fail, roll back, pass ──────────────────────────── */

const MIII_LINES: { t: string; k?: "cmd" | "bad" | "good" | "dim" }[] = [
  { t: '$ miii "add rate limiting to /api/login"', k: "cmd" },
  { t: "● plan     3 steps · claude / qwen3-coder", k: "dim" },
  { t: "✎ edit     src/middleware/rate-limit.ts" },
  { t: "✎ edit     src/api/login.ts" },
  { t: "▶ test     npm test" },
  { t: "✗ 2 failed  login.spec.ts", k: "bad" },
  { t: "↺ rollback src/api/login.ts", k: "dim" },
  { t: "✎ edit     src/api/login.ts" },
  { t: "▶ test     npm test" },
  { t: "✓ 14 passed · checkpoint saved", k: "good" },
];

function Miii({ playing }: { playing: boolean }) {
  const tick = useTicker(playing, MIII_LINES.length, 380);
  return (
    <Chrome title="miii · terminal">
      <div className="space-y-1.5 font-mono text-[0.72rem] leading-relaxed sm:text-[0.76rem]">
        {MIII_LINES.map((l, i) => (
          <div
            key={i}
            className={`whitespace-pre transition-opacity duration-200 ${
              l.k === "cmd"
                ? "text-ink"
                : l.k === "bad"
                  ? "text-[#ff8a7a]"
                  : l.k === "good"
                    ? "text-[#8fe3a7]"
                    : l.k === "dim"
                      ? "text-ink-faint"
                      : "text-ink-muted"
            }`}
            style={{ opacity: i < tick ? 1 : 0 }}
          >
            {l.t}
          </div>
        ))}
        {tick < MIII_LINES.length && <span className="inline-block h-3.5 w-1.5 bg-ink/70" />}
      </div>
    </Chrome>
  );
}

export function WorkPreview({ kind, playing }: { kind: PreviewKind; playing: boolean }) {
  if (kind === "juno") return <Juno playing={playing} />;
  if (kind === "leaps") return <Leaps playing={playing} />;
  return <Miii playing={playing} />;
}
