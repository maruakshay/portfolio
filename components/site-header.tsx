"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { callHref } from "@/lib/content";
import { Wordmark } from "@/components/ornament";

const NAV = [
  { hash: "work", label: "Work" },
  { hash: "services", label: "Services" },
  { hash: "experience", label: "Experience" },
  { hash: "creator", label: "Creator" },
];

/** Nav is 60% work (Work, Services, Experience), 40% creator (Creator, CP guide).
 *  Standalone pages shown in the nav next to the home anchors. */
const PAGES = [{ href: "/cerebral-palsy", label: "Cerebral palsy" }];

/**
 * Sticky minimal nav: "am." wordmark (name lives in the hero eyebrow) · Work · Services · Experience · About · Book a call.
 * Transparent over the hero, a blurred bar once the page scrolls. On inner
 * pages the section links point back to the home page anchors.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const home = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const external = callHref().startsWith("http");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Links close the mobile menu on click; Escape closes it too.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    ...NAV.map((n) => ({ href: home ? `#${n.hash}` : `/#${n.hash}`, label: n.label, page: false })),
    ...PAGES.map((p) => ({ ...p, page: true })),
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled || !home || open
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
            className="flex items-center text-[1.7rem] leading-none"
          >
            <Wordmark />
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <ul className="mr-1 hidden items-center gap-1 lg:flex">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={l.page && pathname === l.href ? "page" : undefined}
                    className="rounded-full px-3.5 py-2 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-ink-muted transition-colors hover:text-ink aria-[current=page]:text-ink"
                  >
                    {l.label}
                  </Link>
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
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex size-10 items-center justify-center rounded-full border border-rule text-ink transition-colors hover:border-ink/30 lg:hidden"
            >
              {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            </button>
          </div>
        </nav>
        {open && (
          <nav id="mobile-nav" aria-label="Mobile" className="border-t border-rule lg:hidden">
            <ul className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={l.page && pathname === l.href ? "page" : undefined}
                    className="flex items-center justify-between border-b border-rule py-4 text-[1.15rem] text-ink-muted transition-colors last:border-0 hover:text-ink aria-[current=page]:text-ink"
                  >
                    {l.label}
                    {l.page && (
                      <span className="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-volt">
                        Guide
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
      {!home && <div className="h-16" aria-hidden />}
    </>
  );
}
