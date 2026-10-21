"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { Sparkles, Phone } from "lucide-react";
import { callHref } from "@/lib/content";
import { Monogram } from "./ornament";
import { PaletteButton } from "./command-palette";
import { XpMeter, useAchievements } from "./achievements";

const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#arcade", label: "Arcade" },
  { href: "/#miii", label: "miii" },
  { href: "/#career", label: "Career" },
];

export function SiteHeader() {
  const { unlock } = useAchievements();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.3 });
  const taps = useRef<number[]>([]);

  // Five quick taps on the logo is the touch-friendly easter egg.
  function onLogo() {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 2000), now];
    if (taps.current.length >= 5) unlock("secret");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-rule/70 bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        <Link href="/" onClick={onLogo} className="group flex items-center gap-2.5">
          <Monogram className="size-8 transition-transform duration-300 ease-[var(--ease-spring)] group-hover:-rotate-6 group-hover:scale-110 group-active:scale-95" />
          <span className="hidden leading-none sm:block">
            <span className="block font-display text-lg font-bold tracking-tight text-ink">Akshay Maru</span>
            <span className="block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-ink-faint transition-colors group-hover:text-volt">
              AI product engineer
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="label transition-colors hover:text-volt">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <XpMeter />
          <PaletteButton />
          <Link
            href="/chat"
            className="hidden items-center gap-1.5 rounded-full border border-rule px-3 py-1.5 font-mono text-xs text-ink transition-colors hover:border-volt hover:text-volt md:inline-flex"
          >
            <Sparkles className="size-3.5" strokeWidth={1.75} aria-hidden />
            Ask AI
          </Link>
          <a
            href={callHref()}
            target={callHref().startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            onClick={() => unlock("contact")}
            className="inline-flex items-center gap-1.5 rounded-full bg-volt px-3.5 py-1.5 font-mono text-xs font-semibold text-canvas transition-transform hover:-translate-y-px"
          >
            <Phone className="size-3.5" strokeWidth={2} aria-hidden />
            <span className="hidden sm:inline">Book a call</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </div>
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-volt via-cyan to-flare"
        style={{ scaleX: progress }}
      />
    </header>
  );
}
