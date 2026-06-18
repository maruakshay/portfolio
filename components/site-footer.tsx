import { Github, Linkedin, FileText, Mail, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-24">
        <p className="label mb-4">Let&apos;s talk</p>
        <h2 className="max-w-[18ch] font-display text-[clamp(1.75rem,4.5vw,3rem)] font-medium leading-[1.08] tracking-[-0.015em] text-paper">
          You were going to hire for three roles. Talk to me first.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 border-t border-rule pt-8 sm:grid-cols-3">
          <div>
            <p className="label mb-2">Email</p>
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-center gap-2 text-sm text-paper transition-colors hover:text-amber"
            >
              <Mail className="size-4 text-paper-faint transition-colors group-hover:text-amber" strokeWidth={1.5} aria-hidden />
              {profile.email}
            </a>
          </div>
          <div>
            <p className="label mb-2">Elsewhere</p>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-paper transition-colors hover:text-amber"
              >
                <Github className="size-4 text-paper-faint transition-colors group-hover:text-amber" strokeWidth={1.5} aria-hidden />
                GitHub
                <ArrowUpRight className="size-3.5 text-paper-faint transition-colors group-hover:text-amber" aria-hidden />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-paper transition-colors hover:text-amber"
              >
                <Linkedin className="size-4 text-paper-faint transition-colors group-hover:text-amber" strokeWidth={1.5} aria-hidden />
                LinkedIn
                <ArrowUpRight className="size-3.5 text-paper-faint transition-colors group-hover:text-amber" aria-hidden />
              </a>
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-paper transition-colors hover:text-amber"
              >
                <FileText className="size-4 text-paper-faint transition-colors group-hover:text-amber" strokeWidth={1.5} aria-hidden />
                Résumé
                <ArrowUpRight className="size-3.5 text-paper-faint transition-colors group-hover:text-amber" aria-hidden />
              </a>
            </div>
          </div>
          <div>
            <p className="label mb-2">Status</p>
            <p className="text-sm text-paper-muted">{profile.availability}</p>
          </div>
        </div>

        <p className="label mt-16 text-paper-faint">
          © {new Date().getFullYear()} Akshay Maru · Built from scratch, no template
        </p>
      </div>
    </footer>
  );
}
