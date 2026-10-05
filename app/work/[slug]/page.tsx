import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SectionRule } from "@/components/ornament";
import { deepDives, getDeepDive, profile } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function generateStaticParams() {
  return deepDives.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dive = getDeepDive(slug);
  if (!dive) return { title: "Not found" };
  return {
    title: `${dive.name} — Akshay Maru`,
    description: dive.tagline,
  };
}

// Render the markdown-lite body: paragraphs split on blank lines, "- " => list.
// The first paragraph of the article opens with a large italic initial.
function Body({ text, illuminate }: { text: string; illuminate?: boolean }) {
  const blocks = text.split("\n\n");
  return (
    <>
      {blocks.map((block, i) => {
        if (block.trimStart().startsWith("- ")) {
          const items = block
            .split("\n")
            .filter((l) => l.trimStart().startsWith("- "))
            .map((l) => l.trimStart().slice(2));
          return (
            <ul key={i}>
              {items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className={illuminate && i === 0 ? "initial" : undefined}>
            {block}
          </p>
        );
      })}
    </>
  );
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dive = getDeepDive(slug);
  if (!dive) notFound();

  return (
    <>
      <SiteHeader />
      <main>
        {/* Masthead */}
        <section>
          <div className="mx-auto max-w-3xl px-5 pb-10 pt-16 md:px-8 md:pt-24">
            <Link
              href="/"
              className="label mb-10 inline-flex items-center gap-2 text-ink-faint transition-colors hover:text-sanguine"
            >
              <ArrowLeft className="size-3.5" /> All work
            </Link>

            <p className="label mb-5 text-sanguine">{"// "}open source</p>
            <h1 className="font-display text-[clamp(3rem,8vw,5.5rem)] font-normal leading-[0.95] text-ink">
              {dive.name}
            </h1>
            <p className="prose-folio mt-6 font-display text-[1.625rem] italic leading-[1.35] text-ink-muted">
              {dive.tagline}
            </p>

            <dl className="frame mt-10 grid grid-cols-1 gap-px bg-rule sm:grid-cols-3">
              {dive.meta.map((m) => (
                <div key={m.label} className="bg-canvas-deep px-4 py-3">
                  <dt className="label mb-1 text-sanguine">{m.label}</dt>
                  <dd className="text-base text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              {dive.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.06em] text-canvas transition-colors hover:bg-sanguine"
                >
                  {l.label}
                  <ArrowUpRight className="size-3.5" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Article */}
        <article className="mx-auto max-w-3xl px-5 pb-16 md:px-8 md:pb-20">
          <SectionRule n="00" label="Notes" className="mb-12" />
          {dive.sections.map((s, i) => (
            <section key={s.heading} className="mb-14 last:mb-0">
              <p className="label mb-2 text-sanguine">§ {String(i + 1).padStart(2, "0")}</p>
              <h2 className="mb-5 font-display text-[2rem] font-normal italic leading-tight text-ink">
                {s.heading}
              </h2>
              <div className="prose-folio text-[1.1875rem] leading-[1.7] [&_li]:mb-2 [&_p]:mb-4 [&_ul]:mb-4">
                <Body text={s.body} illuminate={i === 0} />
              </div>
            </section>
          ))}

          <div className="mt-16 border-t border-rule pt-8">
            <a
              href={`mailto:${profile.email}`}
              className="label inline-flex items-center gap-2.5 text-ink transition-colors hover:text-sanguine"
            >
              <span className="mark" aria-hidden /> Talk to me about this
            </a>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
