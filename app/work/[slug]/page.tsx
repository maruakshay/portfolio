import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SectionRule } from "@/components/ornament";
import { callHref, deepDives, getDeepDive } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Unlock } from "@/components/achievements";

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
    title: `${dive.name}: ${dive.tagline}`,
    description: `${dive.tagline} How Akshay Maru built ${dive.name}: the problem, the decisions that mattered, and what shipped.`,
    alternates: { canonical: `/work/${dive.slug}` },
    openGraph: { type: "article", url: `/work/${dive.slug}`, title: `${dive.name} — Akshay Maru` },
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
      <Unlock id="deep-dive" />
      <main>
        {/* Masthead */}
        <section>
          <div className="mx-auto max-w-3xl px-5 pb-10 pt-16 md:px-8 md:pt-24">
            <Link
              href="/"
              className="label mb-10 inline-flex items-center gap-2 text-ink-faint transition-colors hover:text-volt"
            >
              <ArrowLeft className="size-3.5" /> All work
            </Link>

            <p className="label mb-5 text-volt">{"// "}open source</p>
            <h1 className="font-display text-[clamp(3rem,9vw,6rem)] font-extrabold leading-[0.9] text-ink">
              {dive.name}
            </h1>
            <p className="prose-folio mt-6 font-serif text-[1.75rem] italic leading-[1.3] text-ink-muted">
              {dive.tagline}
            </p>

            <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-3">
              {dive.meta.map((m) => (
                <div key={m.label} className="bg-canvas-deep px-4 py-3">
                  <dt className="label mb-1 text-volt">{m.label}</dt>
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
                  className="btn-primary"
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
              <p className="label mb-2 text-volt">§ {String(i + 1).padStart(2, "0")}</p>
              <h2 className="mb-5 font-display text-[2rem] font-extrabold leading-tight text-ink">
                {s.heading}
              </h2>
              <div className="prose-folio text-[1.1875rem] leading-[1.7] [&_li]:mb-2 [&_p]:mb-4 [&_ul]:mb-4">
                <Body text={s.body} illuminate={i === 0} />
              </div>
            </section>
          ))}

          <div className="mt-16 border-t border-rule pt-8">
            <p className="font-display text-2xl font-bold text-ink">
              Want this kind of thinking on <em className="text-volt">your</em> product?
            </p>
            <a href={callHref(`I read your ${dive.name} deep-dive and want to talk.`)} className="btn-primary mt-5">
              Book a 20-min call
            </a>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
