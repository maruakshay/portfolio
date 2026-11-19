"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { callHref } from "@/lib/content";

const NAV = [
  { hash: "work", label: "Work" },
  { hash: "experience", label: "Experience" },
  { hash: "about", label: "About" },
];

/**
 * Sticky minimal nav: AM logo · Work · Experience · About · Book a call.
 * Transparent over the hero, a blurred bar once the page scrolls. On inner
 * pages the section links point back to the home page anchors.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const home = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const external = callHref().startsWith("http");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled || !home
            ? "border-b border-rule bg-canvas/75 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10"
        >
          <Link
            href="/"
            aria-label="Akshay Maru, home"
            className="group flex items-center gap-2.5 hl text-[1.6rem] leading-none"
          >
            AM
            <span className="hidden font-mono text-[0.7rem] font-normal not-italic tracking-normal uppercase tracking-[0.08em] text-ink-faint transition-colors group-hover:text-ink-muted sm:inline">
              Akshay Maru
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <ul className="mr-1 hidden items-center gap-1 md:flex">
              {NAV.map((n) => (
                <li key={n.hash}>
                  <a
                    href={home ? `#${n.hash}` : `/#${n.hash}`}
                    className="rounded-full px-3.5 py-2 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-ink-muted transition-colors hover:text-ink"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={callHref()}
              target={external ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-full bg-volt px-4 text-[0.9rem] font-semibold text-[#0b0b0c] transition-colors hover:bg-[#ff6d38]"
            >
              Book a call
            </a>
          </div>
        </nav>
      </header>
      {!home && <div className="h-16" aria-hidden />}
    </>
  );
}
