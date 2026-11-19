"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { callHref } from "@/lib/content";
import { selectedWork, type WorkItem } from "@/lib/home";
import { Reveal } from "./motion";
import { WorkPreview } from "./work-previews";

function WorkCard({ item, flip }: { item: WorkItem; flip: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  // Touch screens have no hover: play while the card is mostly on screen.
  const inView = useInView(ref, { amount: 0.55 });
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once after hydration
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);
  const playing = !reduce && (canHover ? hover : inView);

  const LinkTag = item.external ? "a" : Link;
  const linkProps = item.external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <article
      ref={ref}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="group grid overflow-hidden rounded-xl border border-rule bg-canvas-deep transition-colors duration-300 hover:border-ink/25 lg:grid-cols-2"
    >
      <div className={`flex flex-col p-6 sm:p-8 lg:p-10 ${flip ? "lg:order-2" : ""}`}>
        <div className="flex items-center justify-between gap-4">
          <span className="label">{item.org}</span>
          <span className="font-mono text-[0.75rem] text-ink-faint">{item.index}</span>
        </div>
        <p className="hl mt-8 text-[clamp(1.6rem,3vw,2.2rem)] leading-tight">{item.outcome}</p>
        <h3 className="mt-5 text-[clamp(2rem,4vw,2.8rem)] leading-[0.95]">{item.title}</h3>
        <p className="mt-2 text-[1.1rem] text-ink-muted">{item.kicker}</p>
        <p className="mt-6 max-w-[52ch] text-ink-muted">{item.summary}</p>
        <ul className="mt-6 space-y-2.5">
          {item.points.map((p) => (
            <li key={p} className="flex gap-3 text-[0.975rem] text-ink">
              <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-ink-faint" />
              {p}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-8">
          <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
            {item.stack.map((s) => (
              <li
                key={s}
                className="rounded-full border border-rule px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.06em] text-ink-faint"
              >
                {s}
              </li>
            ))}
          </ul>
          <LinkTag
            href={item.href}
            {...linkProps}
            className="inline-flex items-center gap-1.5 text-[0.95rem] text-ink transition-colors hover:text-volt"
          >
            <span className="link-underline">{item.hrefLabel}</span>
            <ArrowUpRight className="size-4" aria-hidden />
          </LinkTag>
        </div>
      </div>

      <div
        className={`relative min-h-[320px] border-t border-rule bg-[radial-gradient(ellipse_at_50%_0%,rgba(242,236,226,0.06),transparent_70%)] p-4 sm:p-8 lg:min-h-[460px] lg:border-t-0 ${
          flip ? "lg:order-1 lg:border-r" : "lg:border-l"
        }`}
        aria-hidden
      >
        <div className="h-full transition-transform duration-500 ease-out group-hover:-translate-y-1">
          <WorkPreview kind={item.id} playing={playing} />
        </div>
        <span className="absolute bottom-3 right-4 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-ink-faint/70">
          {canHover && !reduce ? (hover ? "Illustration" : "Hover to play") : "Illustration"}
        </span>
      </div>
    </article>
  );
}

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10">
      <Reveal className="mb-12 flex flex-col gap-4 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label">Selected work</p>
          <h2 id="work-title" className="mt-4 text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95]">
            Out of the demo, <em>into production.</em>
          </h2>
        </div>
        <p className="max-w-[36ch] text-ink-muted">
          Three products, each in front of real users: an enterprise assistant, a SaaS I sold, and an open-source agent.
        </p>
      </Reveal>
      <div className="space-y-6 sm:space-y-8">
        {selectedWork.map((w, i) => (
          <Reveal key={w.id}>
            <WorkCard item={w} flip={i % 2 === 1} />
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 flex flex-col items-start justify-between gap-6 rounded-xl border border-rule px-6 py-7 sm:flex-row sm:items-center sm:px-10">
        <p className="text-[clamp(1.4rem,2.6vw,1.9rem)] font-medium leading-tight tracking-[-0.03em] text-ink">
          Your AI feature could be <em>next on this list.</em>
        </p>
        <a
          href={callHref("I saw your work and have an AI feature I'd like to get into production.")}
          target={callHref().startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="btn-primary shrink-0"
        >
          Book a 20-min call
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </Reveal>
    </section>
  );
}
