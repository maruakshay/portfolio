"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { Gamepad2, Phone } from "lucide-react";
import { callHref, profile, proof } from "@/lib/content";
import { useAchievements } from "./achievements";

const ROTATE = [
  "streaming AI interfaces",
  "RAG that doesn't hallucinate",
  "coding agents",
  "LLM security",
  "AI products, 0 → exit",
];

function Rotator() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % ROTATE.length), 2200);
    return () => clearInterval(id);
  }, [reduce]);
  return (
    <span className="relative inline-grid">
      {/* Widest phrase reserves the space so nothing below jumps. */}
      <span className="invisible col-start-1 row-start-1">{ROTATE.reduce((a, b) => (b.length > a.length ? b : a))}</span>
      <span
        key={i}
        className="col-start-1 row-start-1 origin-left text-volt [animation:pop_380ms_var(--ease-spring)]"
        aria-live="polite"
      >
        {ROTATE[i]}
      </span>
    </span>
  );
}

function Count({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduce) {
      ref.current.textContent = `${to}${suffix}`;
      return;
    }
    const c = animate(0, to, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => c.stop();
  }, [inView, reduce, to, suffix]);
  return (
    <span ref={ref} className="tabular-nums">
      {to}
      {suffix}
    </span>
  );
}

export function Hero() {
  const { unlock } = useAchievements();
  return (
    <section id="top" className="relative scroll-mt-20 overflow-hidden">
      <div aria-hidden className="drafting pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-volt/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 md:px-8 md:pb-24 md:pt-24">
        <p className="inline-flex items-center gap-2.5 rounded-full border border-rule bg-canvas-deep/80 px-3.5 py-1.5 font-mono text-xs text-ink">
          <span className="live-dot" aria-hidden />
          Open to work · US / UK / Canada · remote or relocation
        </p>

        <h1 className="mt-8 max-w-[16ch] font-display text-[clamp(2.75rem,8vw,6.25rem)] font-extrabold leading-[0.92] tracking-[-0.045em] text-ink">
          Most AI demos die in <em className="text-volt">production.</em>
          <span className="block text-ink-faint">Mine ship.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-[clamp(1.125rem,2vw,1.375rem)] leading-snug text-ink-muted">
          I build
          <span className="my-1 block font-display text-[clamp(1.5rem,3.2vw,2.25rem)] font-bold tracking-tight">
            <Rotator />
          </span>
          end to end: from the interface people touch to the model behind it. Fast, and built to stay up.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={callHref()}
            target={profile.booking ? "_blank" : undefined}
            rel="noopener noreferrer"
            onClick={() => unlock("contact")}
            className="btn-primary [animation:pulse-ring_2s_var(--ease-out-quart)_infinite]"
          >
            <Phone className="size-4" aria-hidden />
            Book a 20-min call
          </a>
          <a href="#arcade" className="btn-ghost">
            <Gamepad2 className="size-4" aria-hidden />
            Test how I think · 60 sec
          </a>
        </div>

        {/* Proof wall: every number is sourced from the résumé or miii.in */}
        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-rule bg-rule md:grid-cols-3">
          {proof.map((p) => (
            <div key={p.label} className="group bg-canvas px-5 py-5 transition-colors hover:bg-canvas-deep md:px-6 md:py-6">
              <dt className="sr-only">{p.label}</dt>
              <dd>
                <span className="block font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-none tracking-tight text-ink transition-colors group-hover:text-volt">
                  <Count to={p.value} suffix={p.suffix} />
                </span>
                <span className="mt-2 block text-sm leading-snug text-ink-faint">{p.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
