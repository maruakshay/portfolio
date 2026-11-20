import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { callHref, profile } from "@/lib/content";
import { callSteps } from "@/lib/home";
import { Reveal } from "./motion";

const LINKS = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "@akshaay.lifts", href: profile.instagramLifts },
  { label: "Résumé", href: profile.resume },
];

export function FinalCta() {
  const external = callHref().startsWith("http");
  return (
    <footer id="contact" className="border-t border-rule">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 sm:pt-36 lg:px-10">
        <Reveal>
          <p className="label flex items-center gap-2.5">
            <span className="live-dot" aria-hidden />
            {profile.availability}
          </p>
          <h2 className="mt-6 max-w-[16ch] text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95]">
            Ready to make your AI app <em>production-ready?</em>
          </h2>
          <p className="mt-6 max-w-[52ch] text-[1.1rem] text-ink-muted">
            Book a free 20-min call. You&apos;ll leave with the top 3 risks I&apos;d fix first, whether we work together or
            not.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={callHref()}
              target={external ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Book a free 20-min call
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
            <a href={`mailto:${profile.email}`} className="btn-ghost">
              Email
            </a>
            <Link href="/chat" className="btn-ghost">
              Ask my AI about me
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="label mt-20">What happens on the call</p>
          <ol className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-rule bg-rule md:grid-cols-3">
            {callSteps.map((s) => (
              <li key={s.n} className="bg-canvas p-6 sm:p-8">
                <span className="font-mono text-[0.75rem] text-ink-faint">{s.n}</span>
                <p className="mt-4 text-[1.35rem] font-medium leading-tight tracking-[-0.03em] text-ink">{s.t}</p>
                <p className="mt-2 text-[0.95rem] leading-snug text-ink-muted">{s.d}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="mt-24 flex flex-col gap-6 border-t border-rule pt-8 sm:mt-32 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.08em] text-ink-faint">
            <span className="hl text-lg normal-case">AM</span>
            <span className="ml-3">Akshay Maru · {new Date().getFullYear()}</span>
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/town" className="link-underline text-[0.9rem] text-ink-muted hover:text-ink">
                Walk through my 3D town →
              </Link>
            </li>
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-[0.9rem] text-ink-muted hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
