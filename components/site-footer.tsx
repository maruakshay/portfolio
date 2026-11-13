import { ArrowUpRight } from "lucide-react";
import { callHref, profile } from "@/lib/content";
import { Monogram } from "./ornament";

const LINKS = [
  { label: "@akshaay.ai", href: profile.instagramAi },
  { label: "@akshaay.lifts", href: profile.instagramLifts },
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
];

// Compact colophon for inner pages. The home page has its own contact section.
export function SiteFooter() {
  const external = callHref().startsWith("http");
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-14 md:grid-cols-[1fr_auto] md:items-end md:px-8">
        <div>
          <p className="label">{profile.availability}</p>
          <a
            href={callHref()}
            target={external ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="btn-primary mt-4"
          >
            •• Book a 20-min call
          </a>
          <div className="mt-8 flex items-center gap-3">
            <Monogram className="size-6" />
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-ink-faint">
              Akshay Maru · {new Date().getFullYear()}
            </p>
          </div>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <a href={`mailto:${profile.email}`} className="group inline-flex items-center gap-1 text-ink hover:underline">
              Email
            </a>
          </li>
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-ink hover:underline"
              >
                {l.label}
                <ArrowUpRight className="size-3.5 text-ink-faint" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
