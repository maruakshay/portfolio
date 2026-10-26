"use client";

import { Github, Linkedin, FileText, Mail, ArrowUpRight, Phone, Check } from "lucide-react";
import { callHref, profile } from "@/lib/content";
import { Letter } from "./letter";
import { Monogram, SectionRule } from "./ornament";
import { useAchievements } from "./achievements";

const LINK = "group inline-flex items-center gap-2 text-ink transition-colors hover:text-volt";
const ICON = "size-4 text-ink-faint transition-colors group-hover:text-volt";
const OUT = "size-3.5 text-ink-faint transition-colors group-hover:text-volt";

const GETS = [
  "Owns the AI feature end to end: interface, model, evals, security",
  "Has shipped it before: an exit, an enterprise assistant, 49 open-source releases",
  "Leads: roadmaps, hiring, mentoring, code-review culture",
];

// `withLetter` renders the full contact section (home); other pages get the
// compact colophon only.
export function SiteFooter({ withLetter = false }: { withLetter?: boolean }) {
  const { unlock } = useAchievements();
  return (
    <footer id="contact" className="relative scroll-mt-20 overflow-hidden border-t border-rule">
      {withLetter && (
        <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-volt/10 blur-[120px]" />
      )}
      <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        {withLetter && (
          <>
            <SectionRule n="05" label="Your move" />
            <div className="grid grid-cols-1 gap-12 pb-16 pt-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div>
                <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[0.92] text-ink">
                  You were going to hire for three roles. <em className="text-volt">Talk to me first.</em>
                </h2>
                <ul className="mt-8 space-y-3">
                  {GETS.map((g) => (
                    <li key={g} className="flex gap-3 text-lg text-ink-muted">
                      <Check className="mt-1 size-5 shrink-0 text-volt" aria-hidden />
                      {g}
                    </li>
                  ))}
                </ul>
                <a
                  href={callHref()}
                  target={profile.booking ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  onClick={() => unlock("contact")}
                  className="btn-primary mt-10 px-7 py-4 text-sm"
                >
                  <Phone className="size-4" aria-hidden /> Book a 20-min call
                </a>
                <p className="mt-4 font-mono text-xs text-ink-faint">{profile.availability}</p>
              </div>
              <Letter />
            </div>
          </>
        )}

        <div className="grid grid-cols-1 gap-8 border-t border-rule pt-8 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <div className="flex items-center gap-3">
            <Monogram className="size-7" animated={false} />
            <p className="font-mono text-xs text-ink-faint">
              © {new Date().getFullYear()} Akshay Maru · Built from scratch, no template
            </p>
          </div>
          <span />
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-base">
            <a href={`mailto:${profile.email}`} onClick={() => unlock("contact")} className={LINK}>
              <Mail className={ICON} strokeWidth={1.5} aria-hidden />
              Email
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className={LINK}>
              <Github className={ICON} strokeWidth={1.5} aria-hidden />
              GitHub
              <ArrowUpRight className={OUT} aria-hidden />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={LINK}>
              <Linkedin className={ICON} strokeWidth={1.5} aria-hidden />
              LinkedIn
              <ArrowUpRight className={OUT} aria-hidden />
            </a>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className={LINK}>
              <FileText className={ICON} strokeWidth={1.5} aria-hidden />
              Résumé
              <ArrowUpRight className={OUT} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
