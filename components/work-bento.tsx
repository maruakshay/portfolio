import Link from "next/link";
import {
  ArrowUpRight,
  Terminal,
  ShieldCheck,
  Bot,
  Rocket,
  Copy,
  Blocks,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import { ledger, type LedgerEntry } from "@/lib/content";
import { Reveal } from "./reveal";

const ICONS: Record<string, LucideIcon> = {
  JupiterOne: Waypoints,
  "miii-cli": Terminal,
  "Remote Leaps": Rocket,
  "mii-ai-security": ShieldCheck,
  miii: Bot,
  copytap: Copy,
  "react-jsx-skills-framework": Blocks,
};

// Asymmetric bento spans, ordered to match `ledger` (by impact).
// Three clean rows on desktop: 4+2, 3+3, 2+2+2.
const SPANS = [
  "md:col-span-4", // JupiterOne — feature
  "md:col-span-2", // miii-cli
  "md:col-span-3", // Remote Leaps
  "md:col-span-3", // mii-ai-security
  "md:col-span-2", // miii
  "md:col-span-2", // copytap
  "md:col-span-2", // react-jsx-skills-framework
];

function Cell({ entry, feature }: { entry: LedgerEntry; feature: boolean }) {
  const internal = Boolean(entry.slug);
  const href = internal ? `/work/${entry.slug}` : entry.href;
  const Icon = ICONS[entry.title] ?? Terminal;

  const inner = (
    <div className="group flex h-full flex-col justify-between border border-rule bg-surface p-6 transition-colors duration-200 hover:border-amber md:p-7">
      <div>
        <div className="flex items-start justify-between gap-4">
          <Icon
            className={`shrink-0 text-paper-faint transition-colors group-hover:text-amber ${
              feature ? "size-7" : "size-6"
            }`}
            strokeWidth={1.5}
            aria-hidden
          />
          <ArrowUpRight
            className="size-4 shrink-0 text-paper-faint transition-colors group-hover:text-amber"
            aria-hidden
          />
        </div>

        <span className="label mt-5 block">{entry.meta}</span>

        <h3
          className={`mt-2.5 font-display font-medium leading-tight text-paper transition-colors group-hover:text-amber ${
            feature ? "text-3xl md:text-[2.5rem]" : "text-2xl"
          }`}
        >
          {entry.title}
        </h3>
        <p className="label mt-1.5 normal-case tracking-normal text-paper-faint">
          {entry.sub}
        </p>

        <p
          className={`prose-mono mt-4 text-[0.875rem] leading-[1.65] text-paper-muted ${
            feature ? "" : "line-clamp-4"
          }`}
        >
          {entry.blurb}
        </p>
      </div>

      <span className="label mt-6 inline-flex items-center gap-2 text-paper-faint transition-colors group-hover:text-amber">
        {internal ? "Read the deep-dive" : entry.hrefLabel}
      </span>
    </div>
  );

  return internal ? (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  ) : (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      {inner}
    </a>
  );
}

export function WorkBento() {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="flex items-baseline justify-between py-8">
          <h2 className="font-display text-xl font-medium text-paper">
            Selected work
          </h2>
          <span className="label">Roles &amp; open source, by impact</span>
        </div>

        <div className="grid grid-cols-1 gap-3 pb-12 md:grid-cols-6">
          {ledger.map((entry, i) => (
            <Reveal
              key={entry.title}
              delay={Math.min(i * 0.04, 0.2)}
              className={`h-full ${SPANS[i] ?? "md:col-span-2"}`}
            >
              <Cell entry={entry} feature={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
