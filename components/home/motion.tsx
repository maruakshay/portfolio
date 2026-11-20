"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { Fragment, useEffect, useRef, type ReactNode } from "react";

const EASE = [0.25, 1, 0.5, 1] as const;

/** Fade-and-rise on first scroll into view. Fast, never blocks content. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

/**
 * Splits a line into words that rise into place. Pure CSS (`.word-rise`), so
 * the words are in the server HTML and visible even if JS is slow or fails;
 * there is no opacity gate that could leave the headline blank.
 */
export function StaggerWords({
  text,
  className,
  delay = 0,
  step = 0.045,
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="inline-block overflow-hidden pb-[0.08em] pr-[0.06em] align-bottom">
            <span className="word-rise inline-block" style={{ animationDelay: `${delay + i * step}s` }}>
              {w}
            </span>
          </span>
          {/* Space outside the inline-block, or it gets trimmed */}
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}

/**
 * Counts up to `to` the first time it scrolls into view. Server HTML holds the
 * final value, so crawlers and no-JS readers see the real number.
 */
export function CountUp({ to, duration = 1.4 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const armed = useRef(false);

  // Arm on mount only when below the fold, so the reset to 0 is never seen.
  useEffect(() => {
    const el = ref.current;
    if (reduce || !el) return;
    if (el.getBoundingClientRect().top > window.innerHeight) {
      armed.current = true;
      el.textContent = "0";
    }
  }, [reduce]);

  useEffect(() => {
    const el = ref.current;
    if (!inView || !armed.current || !el) return;
    armed.current = false;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      el.textContent = String(Math.round((1 - Math.pow(1 - p, 4)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = String(to);
    };
  }, [inView, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {to}
    </span>
  );
}
