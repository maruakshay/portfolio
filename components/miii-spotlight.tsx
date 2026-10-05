"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { miii } from "@/lib/content";
import { SectionRule } from "./ornament";

// A short, honest terminal session: only commands that exist on miii.in.
type Line = { kind: "cmd" | "out" | "ok"; text: string };
const SESSION: Line[] = [
  { kind: "cmd", text: miii.install },
  { kind: "out", text: `added miii-agent@${miii.version.slice(1)}` },
  { kind: "cmd", text: "miii provider add anthropic" },
  { kind: "ok", text: "Claude connected · or skip it and stay 100% offline" },
  { kind: "cmd", text: "miii doctor" },
  { kind: "out", text: "grading local + cloud models on agent tasks…" },
  { kind: "ok", text: "report ready · pick the model that actually passes" },
  { kind: "cmd", text: 'miii "fix the failing auth test"' },
  { kind: "out", text: "plan → edit 2 files → run tests → 1 failing → retry" },
  { kind: "ok", text: "all tests green · checkpoint saved" },
];

function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);

  // Reduced motion: show the whole session at once, no typing.
  const visible = reduce && inView ? SESSION.length : shown;

  useEffect(() => {
    if (!inView || reduce || shown >= SESSION.length) return;
    const delay = SESSION[shown].kind === "cmd" ? 650 : 380;
    const id = setTimeout(() => setShown((n) => n + 1), delay);
    return () => clearTimeout(id);
  }, [inView, reduce, shown]);

  return (
    <div ref={ref} className="border border-ink bg-ink text-canvas shadow-[6px_6px_0_var(--color-gilt)]">
      <div className="flex items-center justify-between border-b border-canvas/15 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-sanguine" />
          <span className="size-2.5 rounded-full bg-gilt" />
          <span className="size-2.5 rounded-full bg-canvas/30" />
        </span>
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-canvas/50">
          illustrative session
        </span>
      </div>
      <div
        className="min-h-[19rem] space-y-1.5 p-5 font-mono text-[0.8125rem] leading-relaxed"
        role="log"
        aria-label="Example miii session"
      >
        {SESSION.slice(0, visible).map((l, i) => (
          <p key={i} className={l.kind === "cmd" ? "text-canvas" : l.kind === "ok" ? "text-[oklch(0.8_0.1_150)]" : "text-canvas/55"}>
            {l.kind === "cmd" && <span className="select-none text-gilt">$ </span>}
            {l.kind === "ok" && <span className="select-none">✓ </span>}
            {l.text}
          </p>
        ))}
        {visible < SESSION.length && (
          <span className="inline-block h-4 w-2 animate-pulse bg-canvas/70 align-middle" aria-hidden />
        )}
      </div>
    </div>
  );
}

function CopyInstall() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(miii.install);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: the command is visible to copy by hand */
    }
  }
  return (
    <button
      onClick={copy}
      className="group flex w-full items-center justify-between gap-3 border border-rule bg-canvas px-4 py-3 text-left font-mono text-sm text-ink transition-colors hover:border-sanguine"
      aria-label={`Copy install command: ${miii.install}`}
    >
      <span className="truncate">
        <span className="select-none text-gilt">$ </span>
        {miii.install}
      </span>
      {copied ? (
        <Check className="size-4 shrink-0 text-sanguine" aria-hidden />
      ) : (
        <Copy className="size-4 shrink-0 text-ink-faint group-hover:text-sanguine" aria-hidden />
      )}
      <span className="sr-only" aria-live="polite">{copied ? "Copied" : ""}</span>
    </button>
  );
}

export function MiiiSpotlight() {
  return (
    <section id="miii" className="scroll-mt-20 border-y border-rule bg-canvas-deep/50">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
        <SectionRule n="02" label="In the studio now" />

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div>
            <p className="label text-ink">
              miii · {miii.version} · {miii.stars}★ · {miii.releases} releases · MIT
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.75rem)] font-normal leading-[1] text-ink">
              The open-source alternative to Claude Code.{" "}
              <em className="italic text-sanguine">Any model, free forever.</em>
            </h2>
            <p className="prose-folio mt-6 text-[1.125rem] leading-[1.65] text-ink-muted">
              A coding agent for your terminal or browser that plans, edits,
              runs, and verifies its own work, with Claude, GPT, Gemini,
              DeepSeek, or a model running entirely on your own GPU. No account,
              no subscription.
            </p>

            <div className="mt-8 max-w-md">
              <CopyInstall />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={miii.site}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.06em] text-canvas transition-colors hover:bg-sanguine"
              >
                miii.in <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
              <Link
                href="/work/miii-cli"
                className="inline-flex items-center gap-2 border border-ink/40 px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.06em] text-ink transition-colors hover:border-sanguine hover:text-sanguine"
              >
                How it&apos;s built
              </Link>
            </div>
          </div>

          <Terminal />
        </div>

        {/* Features as a ledger */}
        <dl className="mt-14 grid grid-cols-1 border-t border-rule sm:grid-cols-2 lg:grid-cols-3">
          {miii.features.map((f) => (
            <div key={f.k} className="border-b border-rule py-4 sm:pr-6">
              <dt className="label normal-case tracking-normal text-lapis">{f.k}</dt>
              <dd className="mt-1 text-[1.0625rem] leading-snug text-ink-muted">{f.v}</dd>
            </div>
          ))}
        </dl>

        {/* Providers */}
        <div className="mt-10">
          <p className="label mb-3">Works with 14+ providers, cloud or local</p>
          <ul className="flex flex-wrap gap-2">
            {miii.providers.map((p) => (
              <li
                key={p}
                className="border border-rule bg-canvas px-2.5 py-1 font-mono text-xs text-ink-muted transition-colors hover:border-sanguine hover:text-sanguine"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
