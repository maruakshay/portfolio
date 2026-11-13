"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { OPEN_PALETTE } from "@/components/command-palette";
import { briefs, callHref, channels, ledger, profile, services, shipped, type Channel } from "@/lib/content";
import "./landing.css";

const RobotScene = dynamic(() => import("./robot-scene"), { ssr: false });

const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "services", label: "Services" },
  { id: "content", label: "Content" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

const delay = (n: number) => ({ "--d": `${n * 0.1}s` }) as CSSProperties;

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

/** Corner brackets drawn just outside a box. */
function Brackets() {
  return (
    <span aria-hidden className="ln-brackets">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

/** Headline line in a gradient-outlined box. */
function Boxed({ children, cut = false, warm = false }: { children: ReactNode; cut?: boolean; warm?: boolean }) {
  return (
    <span className={`ln-boxed${cut ? " is-cut" : ""}${warm ? " is-warm" : ""}`}>
      <span>{children}</span>
    </span>
  );
}

// ── Intro: auto-typing client brief ─────────────────────────────────────
function useTypewriter(lines: string[], reduced: boolean) {
  const [i, setI] = useState(0);
  const [text, setText] = useState(reduced ? lines[0] : "");

  useEffect(() => {
    if (reduced) {
      setText(lines[0]);
      return;
    }
    let idx = 0;
    let n = 0;
    let timer: ReturnType<typeof setTimeout>;
    const type = () => {
      const line = lines[idx];
      if (n < line.length) {
        n++;
        setText(line.slice(0, n));
        timer = setTimeout(type, 38);
      } else {
        timer = setTimeout(erase, 2600);
      }
    };
    const erase = () => {
      if (n > 0) {
        n = Math.max(0, n - 2);
        setText(lines[idx].slice(0, n));
        timer = setTimeout(erase, 14);
      } else {
        idx = (idx + 1) % lines.length;
        setI(idx);
        timer = setTimeout(type, 250);
      }
    };
    setI(0);
    setText("");
    timer = setTimeout(type, 600);
    return () => clearTimeout(timer);
  }, [lines, reduced]);

  return { text, next: lines[(i + 1) % lines.length] };
}

function Intro({ reduced }: { reduced: boolean }) {
  const { text, next } = useTypewriter(briefs, reduced);
  return (
    <section id="intro" className="ln-sec ln-intro" aria-labelledby="intro-title">
      <div className="ln-prompt rv" style={delay(1)}>
        <span className="ln-prompt-tab" aria-hidden>
          “
        </span>
        <div className="ln-prompt-box">
          <Brackets />
          <p className="sr-only">Example client briefs I can build, such as: {briefs.join(" ")}</p>
          <p aria-hidden>
            {text}
            <span className="ln-caret" />
          </p>
        </div>
        <p className="ln-prompt-next" aria-hidden>
          {next}
        </p>
      </div>

      <span className="ln-intro-rule rv" style={delay(1)} aria-hidden />

      <ul className="ln-features rv" style={delay(2)} aria-label="What I build">
        <li>AI products</li>
        <li>RAG &amp; agents</li>
        <li>LLM security</li>
        <li className="is-dim">And much more</li>
      </ul>

      <div className="ln-hero-head">
        <p className="ln-kicker ln-back rv" style={delay(2)}>
          Akshay Maru · Open for freelance
        </p>
        <h1 id="intro-title" className="ln-hero-title rv" style={delay(3)}>
          <Boxed cut>AI Engineer</Boxed>
          <Boxed warm>&amp; Creator</Boxed>
        </h1>
      </div>

      <p className="ln-sub ln-back rv" style={delay(4)}>
        I build AI products for startups and teams, and make AI and fitness content on Instagram.
      </p>

      <a href="#services" className="ln-scroll rv" style={delay(4)}>
        <Brackets />
        Scroll
        <span className="ln-scroll-arrow" aria-hidden>
          ↓
        </span>
      </a>
      <span className="ln-intro-floor" aria-hidden />
    </section>
  );
}

// ── Services: sliding tab strip ─────────────────────────────────────────
function Services({ reduced }: { reduced: boolean }) {
  // The first tab is repeated at the end so the strip can loop seamlessly.
  const tabs = [...services, services[0]];
  const [active, setActive] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      if (!document.hidden) setActive((a) => a + 1);
    }, 2400);
    return () => clearInterval(id);
  }, [reduced]);

  // After sliding onto the duplicate, snap back to the real first tab unseen.
  useEffect(() => {
    if (active !== tabs.length - 1) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setActive(0);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    }, 950);
    return () => clearTimeout(t);
  }, [active, tabs.length]);

  return (
    <section id="services" className="ln-sec ln-services" aria-labelledby="services-title">
      <div className="ln-tabs rv" style={delay(1)}>
        <ol
          className="ln-tabs-track"
          style={{
            transform: `translateX(calc(${active} * var(--tab-w) * -1))`,
            transition: animate ? undefined : "none",
          }}
        >
          {tabs.map((s, i) => (
            <li
              key={i}
              aria-hidden={i === tabs.length - 1 || undefined}
              className={`ln-tab${i === active ? " is-active" : i < active ? " is-past" : ""}`}
            >
              <span className="ln-tab-box">
                {i === active && <Brackets />}
                <span className="ln-tab-n">{String((i % services.length) + 1).padStart(2, "0")}</span>
                <span className="ln-tab-label">{s}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="ln-services-head">
        <p className="ln-dots rv" style={delay(1)} aria-hidden>
          ··
        </p>
        <h2 id="services-title" className="ln-services-title rv" style={delay(2)}>
          <span className="ln-pill ln-back">Your AI Product</span>
          <span className="ln-back">Built End to End</span>
        </h2>
      </div>

      <div className="ln-shipped rv" style={delay(3)}>
        <p className="ln-mono-label">Shipped before</p>
        <dl>
          {shipped.map((s) => (
            <div key={s.k}>
              <dt>{s.k}</dt>
              <dd>{s.v}</dd>
            </div>
          ))}
        </dl>
        <div className="ln-shipped-cta">
          <a
            href={callHref()}
            target={callHref().startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="ln-btn ln-btn-ink"
          >
            Book a 20-min call ↗
          </a>
          <a href="#work" className="ln-btn">
            See the work ↓
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Content: Instagram channels ─────────────────────────────────────────
function Avatar({ glyph }: { glyph: Channel["glyph"] }) {
  return (
    <svg viewBox="0 0 56 56" className="ln-avatar" aria-hidden>
      <defs>
        <linearGradient id={`av-${glyph}`} x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffb347" />
          <stop offset="0.5" stopColor="#ff5a5f" />
          <stop offset="1" stopColor="#ff3d8b" />
        </linearGradient>
      </defs>
      <rect width="56" height="56" fill={`url(#av-${glyph})`} />
      {glyph === "ai" ? (
        <g>
          <rect x="13" y="15" width="30" height="26" rx="7" fill="#f8f6f2" />
          <rect x="18" y="20" width="20" height="16" rx="4" fill="#141414" />
          <ellipse cx="24" cy="28" rx="2.4" ry="3" fill="#fff" />
          <ellipse cx="32" cy="27.4" rx="2.4" ry="3" fill="#fff" />
        </g>
      ) : (
        <g fill="#141414">
          <rect x="12" y="20" width="6" height="16" rx="1.5" />
          <rect x="38" y="20" width="6" height="16" rx="1.5" />
          <rect x="8" y="23" width="4" height="10" rx="1" />
          <rect x="44" y="23" width="4" height="10" rx="1" />
          <rect x="18" y="26.5" width="20" height="3" fill="#f8f6f2" />
        </g>
      )}
    </svg>
  );
}

function Content() {
  const [i, setI] = useState(0);
  const [fading, setFading] = useState(false);
  const busy = useRef(false);
  const c = channels[i];
  const ghost = channels[(i + 1) % channels.length];

  function go(dir: 1 | -1) {
    if (busy.current) return;
    busy.current = true;
    setFading(true);
    setTimeout(() => {
      setI((v) => (v + dir + channels.length) % channels.length);
      setFading(false);
      busy.current = false;
    }, 450);
  }

  return (
    <section id="content" className="ln-sec ln-content" aria-labelledby="content-title">
      <h2 id="content-title" className="sr-only">
        I am also a content creator on Instagram
      </h2>
      <div className="ln-strip rv" style={delay(1)}>
        <p className="ln-strip-tag">
          Creator <span className="ln-strip-n">{String(i + 1).padStart(2, "0")}</span>
        </p>
        <Avatar glyph={c.glyph} />
        <span className="ln-strip-dot" aria-hidden />
        <div className={`ln-swap ln-strip-who${fading ? " is-out" : ""}`}>
          <p className="ln-strip-name">{c.handle}</p>
          <p className="ln-strip-role">{c.topic}</p>
        </div>
      </div>

      <div className="ln-quote-wrap rv" style={delay(2)}>
        <p className={`ln-swap ln-quote ln-back${fading ? " is-out" : ""}`} aria-live="polite">
          {c.pitch}
        </p>
        <a href={c.href} target="_blank" rel="noopener noreferrer" className="ln-try ln-back">
          Follow {c.handle} <span className="ln-dim">(Instagram ↗)</span>
        </a>
      </div>

      <div className="ln-arrows rv" style={delay(3)}>
        <button type="button" onClick={() => go(-1)} aria-label="Previous channel">
          ←
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next channel">
          →
        </button>
      </div>

      <p className={`ln-ghost ln-swap${fading ? " is-out" : ""}`} aria-hidden>
        {ghost.handle} — {ghost.pitch}
      </p>
    </section>
  );
}

// ── Work: proof, on a solid sheet ───────────────────────────────────────
function Work() {
  return (
    <section id="work" className="ln-solid ln-work" aria-labelledby="work-title">
      <div className="ln-solid-head rv" style={delay(1)}>
        <p className="ln-mono-label">Proof · selected work</p>
        <h2 id="work-title" className="ln-solid-title">
          <span className="ln-pill">Shipped,</span> not just demoed
        </h2>
      </div>
      <ol className="ln-ledger">
        {ledger.map((e, n) => {
          const internal = Boolean(e.slug);
          const inner = (
            <>
              <span className="ln-ledger-meta">{e.meta}</span>
              <span className="ln-ledger-title">{e.title}</span>
              <span className="ln-ledger-sub">{e.sub}</span>
              <span className="ln-ledger-go" aria-hidden>
                {internal ? "→" : "↗"}
              </span>
            </>
          );
          return (
            <li key={e.title} className="rv" style={delay(Math.min(n, 4))}>
              {internal ? (
                <Link href={`/work/${e.slug}`}>{inner}</Link>
              ) : (
                <a href={e.href} target="_blank" rel="noopener noreferrer">
                  {inner}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// ── Contact ─────────────────────────────────────────────────────────────
function Contact() {
  const links = [
    { label: "@akshaay.ai", note: "Instagram · AI", href: profile.instagramAi },
    { label: "@akshaay.lifts", note: "Instagram · Fitness", href: profile.instagramLifts },
    { label: "GitHub", note: "maruakshay", href: profile.github },
    { label: "LinkedIn", note: "akshaymaru61", href: profile.linkedin },
  ];
  return (
    <section id="contact" className="ln-solid ln-contact" aria-labelledby="contact-title">
      <div className="ln-contact-main">
        <p className="ln-mono-label rv" style={delay(1)}>
          {profile.availability}
        </p>
        <h2 id="contact-title" className="ln-contact-title rv" style={delay(2)}>
          <Boxed cut>Got an AI idea?</Boxed>
          <Boxed warm>Let&rsquo;s build it.</Boxed>
        </h2>
        <p className="ln-contact-body rv" style={delay(3)}>
          I take on freelance projects end to end: AI assistants, RAG on your data, agents, LLM security reviews,
          and the product UI around them. Tell me what you&rsquo;re building and I&rsquo;ll tell you honestly how
          I&rsquo;d approach it.
        </p>
        <div className="ln-contact-cta rv" style={delay(3)}>
          <a
            href={callHref()}
            target={callHref().startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="ln-btn ln-btn-ink"
          >
            •• Book a 20-min call ↗
          </a>
          <a href={`mailto:${profile.email}?subject=${encodeURIComponent("Freelance project")}`} className="ln-btn">
            Email {profile.email}
          </a>
        </div>
        <p className="ln-collab rv" style={delay(4)}>
          Brands and creators: for collabs on <b>@akshaay.ai</b> or <b>@akshaay.lifts</b>,{" "}
          <a href={`mailto:${profile.email}?subject=${encodeURIComponent("Collab inquiry")}`}>email me</a>.
        </p>
      </div>
      <ul className="ln-contact-links rv" style={delay(4)}>
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} target="_blank" rel="noopener noreferrer">
              <span>{l.label}</span>
              <span className="ln-dim">{l.note} ↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Right rail ──────────────────────────────────────────────────────────
function Rail({ active }: { active: number }) {
  return (
    <div className="ln-rail" aria-hidden>
      <div className="ln-rail-dots">
        {Array.from({ length: 14 }, (_, k) => (
          <i key={k} />
        ))}
      </div>
      <span className="ln-rail-label" style={{ top: `${active * 19}%` }}>
        <svg viewBox="0 0 12 12" width="12" height="12">
          <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" />
          <path d="M6 6V2.6" stroke="currentColor" strokeLinecap="round" />
        </svg>
        {SECTIONS[active].label}
      </span>
    </div>
  );
}

export function Landing() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);

  // Reveal each section's .rv blocks the first time it enters view.
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".ln-sec, .ln-solid");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // The rail label follows whichever section is more than half visible.
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(SECTIONS.findIndex((s) => s.id === e.target.id));
        }
      },
      { threshold: 0.5 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="ln">
      <noscript>
        <style>{`.ln .rv{opacity:1;transform:none}`}</style>
      </noscript>
      <div className="ln-guides" aria-hidden>
        <i />
        <i />
        <i />
      </div>
      <RobotScene />
      <SiteHeader overlay />
      <div className="ln-rail-wrap">
        <Rail active={active} />
        <button
          type="button"
          className="ln-rail-menu"
          onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE))}
        >
          ≡ Menu
        </button>
      </div>
      <main>
        <Intro reduced={reduced} />
        <Services reduced={reduced} />
        <Content />
        <Work />
        <Contact />
      </main>
      <footer className="ln-foot">
        <p>Akshay Maru · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
