import { Github, Linkedin, FileText, Mail, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/content";
import { Letter } from "./letter";
import { Monogram, SectionRule } from "./ornament";

const LINK =
  "group inline-flex items-center gap-2 text-ink transition-colors hover:text-sanguine";
const ICON = "size-4 text-ink-faint transition-colors group-hover:text-sanguine";
const OUT = "size-3.5 text-ink-faint transition-colors group-hover:text-sanguine";

// `withLetter` renders the full contact section (home); other pages get the
// compact colophon only.
export function SiteFooter({ withLetter = false }: { withLetter?: boolean }) {
  return (
    <footer id="contact" className="scroll-mt-20 border-t border-rule bg-canvas-deep/60">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        {withLetter && (
          <>
            <SectionRule n="05" label="Contact" />
            <div className="grid grid-cols-1 gap-12 pb-16 pt-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
              <div>
                <h2 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] font-normal leading-[1] text-ink">
                  You were going to hire for three roles.{" "}
                  <em className="italic text-sanguine">Talk to me first.</em>
                </h2>
                <p className="mt-6 text-lg text-ink-muted">{profile.availability}</p>
              </div>
              <Letter />
            </div>
          </>
        )}

        <div className="grid grid-cols-1 gap-8 border-t border-rule pt-8 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <div className="flex items-center gap-3">
            <Monogram className="size-8" />
            <p className="label normal-case tracking-normal">
              © {new Date().getFullYear()} Akshay Maru · Built from scratch, no template
            </p>
          </div>
          <span />
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-base">
            <a href={`mailto:${profile.email}`} className={LINK}>
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
