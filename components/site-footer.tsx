import { ArrowUpRight } from "lucide-react";
import { callHref, profile } from "@/lib/content";
import { Wordmark } from "@/components/ornament";

const LINKS = [
  { label: "@akshaay.lifts", href: profile.instagramLifts },
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
];

// Compact footer for inner pages. The home page ends with its own CTA footer.
export function SiteFooter() {
  const external = callHref().startsWith("http");
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-14 md:grid-cols-[1fr_auto] md:items-end md:px-8">
        <div>
          <p className="label flex items-center gap-2.5">
            <span className="live-dot" aria-hidden />
            {profile.availability}
          </p>
          <a
            href={callHref()}
            target={external ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="btn-primary mt-5"
          >
            Book a 20-min call
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.08em] text-ink-faint">
            <Wordmark className="text-lg" />
            <span className="ml-3">Akshay Maru · {new Date().getFullYear()}</span>
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <a href={`mailto:${profile.email}`} className="link-underline text-ink-muted hover:text-ink">
              Email
            </a>
          </li>
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-ink-muted hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
