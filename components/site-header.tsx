import Link from "next/link";
import { Sparkles, FileText } from "lucide-react";
import { profile } from "@/lib/content";
import { Monogram } from "./ornament";
import { PaletteButton } from "./command-palette";

const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#miii", label: "miii" },
  { href: "/#career", label: "Career" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-canvas">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <Monogram className="size-8 transition-transform duration-500 group-hover:rotate-[360deg]" />
          <span className="font-display text-lg font-medium text-ink">Akshay Maru</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="label transition-colors hover:text-sanguine">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <PaletteButton />
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="label hidden items-center gap-1.5 border border-rule px-2.5 py-1.5 transition-colors hover:border-ink-faint hover:text-ink sm:inline-flex"
          >
            <FileText className="size-3.5" strokeWidth={1.5} aria-hidden />
            Résumé
          </a>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-ink px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.06em] text-canvas transition-colors hover:bg-sanguine"
          >
            <Sparkles className="size-3.5" strokeWidth={1.5} aria-hidden />
            Ask AI
          </Link>
        </div>
      </div>
    </header>
  );
}
