import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { deepDives, getDeepDive, profile } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ChatLauncher } from "@/components/chat-launcher";

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
function Body({ text }: { text: string }) {
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
        return <p key={i}>{block}</p>;
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
        <section className="border-b border-rule">
          <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
            <Link
              href="/"
              className="label mb-10 inline-flex items-center gap-2 text-paper-faint transition-colors hover:text-amber"
            >
              <ArrowLeft className="size-3.5" /> All work
            </Link>

            <p className="label mb-5 text-amber">Open source</p>
            <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-normal leading-[1] tracking-[-0.02em] text-paper">
              {dive.name}
            </h1>
            <p className="prose-mono mt-6 text-lg leading-[1.5] text-paper-muted">
              {dive.tagline}
            </p>

            <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-3">
              {dive.meta.map((m) => (
                <div key={m.label} className="bg-surface px-4 py-3">
                  <dt className="label mb-1">{m.label}</dt>
                  <dd className="text-[0.8125rem] text-paper">{m.value}</dd>
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
                  className="inline-flex items-center gap-2 bg-amber px-5 py-2.5 text-xs font-medium uppercase tracking-[0.08em] text-ground transition-colors hover:bg-amber-deep"
                >
                  {l.label}
                  <ArrowUpRight className="size-3.5" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Article */}
        <article className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
          {dive.sections.map((s) => (
            <section key={s.heading} className="mb-14 last:mb-0">
              <h2 className="mb-5 font-display text-2xl font-medium text-paper">
                {s.heading}
              </h2>
              <div className="prose-mono text-[0.9375rem] leading-[1.75] [&_li]:mb-2 [&_p]:mb-4 [&_ul]:mb-4">
                <Body text={s.body} />
              </div>
            </section>
          ))}

          <div className="mt-16 border-t border-rule pt-8">
            <a
              href={`mailto:${profile.email}`}
              className="label inline-flex items-center gap-2 text-paper transition-colors hover:text-amber"
            >
              <span className="mark" aria-hidden /> Talk to me about this
            </a>
          </div>
        </article>
      </main>
      <SiteFooter />
      <ChatLauncher />
    </>
  );
}
