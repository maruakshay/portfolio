import Link from "next/link";
import { Sparkles, Github, FileText } from "lucide-react";
import { profile } from "@/lib/content";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-ground">
      {/* masthead hairline */}
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5 md:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="mark mark-blink" aria-hidden />
          <span className="font-display text-base font-medium text-paper transition-colors group-hover:text-paper">
            Akshay Maru
          </span>
        </Link>

        <nav className="flex items-center gap-5">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 border border-amber/40 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.08em] text-amber transition-colors hover:border-amber hover:bg-tint"
          >
            <Sparkles className="size-3.5" strokeWidth={1.5} aria-hidden />
            Ask AI
          </Link>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="label hidden items-center gap-1.5 transition-colors hover:text-paper sm:inline-flex"
          >
            <Github className="size-4" strokeWidth={1.5} aria-hidden />
            GitHub
          </a>
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="label inline-flex items-center gap-1.5 transition-colors hover:text-paper"
          >
            <FileText className="size-4" strokeWidth={1.5} aria-hidden />
            Résumé
          </a>
        </nav>
      </div>
    </header>
  );
}
