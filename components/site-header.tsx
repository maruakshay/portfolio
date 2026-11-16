"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { callHref, profile } from "@/lib/content";
import { MarkSvg } from "@/lib/brand";

const NAV = [
  { href: "/", label: "Play the town" },
  { href: "/work/miii-cli", label: "Work" },
  { href: "/chat", label: "Ask AI" },
];

const KEY = "am:topbar-closed";

function readClosed() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
const noSubscribe = () => () => {};

/**
 * Fixed chrome: a 30px announcement bar plus a 52px nav. The bar slides away
 * after 40px of scroll or when closed. `overlay` (home) skips the spacer so the
 * first section can sit under the chrome.
 */
export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const stored = useSyncExternalStore(noSubscribe, readClosed, () => false);
  const [dismissed, setDismissed] = useState(false);
  const closed = stored || dismissed;
  const [scrolled, setScrolled] = useState(false);
  const external = callHref().startsWith("http");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--chrome-h", closed ? "52px" : "82px");
  }, [closed]);

  function close() {
    setDismissed(true);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
  }

  const hidden = closed || scrolled;

  return (
    <>
      <header className="chrome" data-bar={hidden ? "off" : "on"}>
        <div className="chrome-bar" aria-hidden={hidden}>
          <a
            href={callHref()}
            target={external ? "_blank" : undefined}
            rel="noopener noreferrer"
            tabIndex={hidden ? -1 : undefined}
            className="chrome-bar-link"
          >
            <b>Now:</b> Open for freelance AI projects.
            <span className="chrome-bar-more"> Book a 20-min intro call</span> ↗
          </a>
          <button
            type="button"
            onClick={close}
            tabIndex={hidden ? -1 : undefined}
            className="chrome-bar-x"
            aria-label="Dismiss announcement"
          >
            ×
          </button>
        </div>

        <nav className="chrome-nav" aria-label="Primary">
          <Link href="/" className="chrome-logo" aria-label="Akshay Maru, home">
            <MarkSvg size={34} id="am-head" />
          </Link>
          <ul className="chrome-menu">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href}>{n.label}</Link>
              </li>
            ))}
          </ul>
          <a className="chrome-pad" href={profile.instagramAi} target="_blank" rel="noopener noreferrer">
            @akshaay.ai ↗
          </a>
          <div className="chrome-cta-cell">
            <a
              href={callHref()}
              target={external ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="chrome-cta"
            >
              <span aria-hidden className="chrome-cta-dots">
                ••
              </span>
              Hire me
            </a>
          </div>
        </nav>
      </header>
      {!overlay && <div className="chrome-spacer" aria-hidden />}
    </>
  );
}
