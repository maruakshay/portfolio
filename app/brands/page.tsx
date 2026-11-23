import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/home/motion";
import { SectionHead } from "@/components/home/section-head";
import { profile } from "@/lib/content";
import { beyondWork } from "@/lib/home";
import { brandFits, brandHref, brandsHero, offers, whyMe } from "@/lib/brands";
import { instagram, instagramStats, reelEmbed, reelUrl } from "@/lib/instagram";

export const metadata: Metadata = {
  title: "Work with brands",
  description:
    "Partner with Akshay Maru (@akshaay.lifts): a creator living with cerebral palsy and a stammer who trains anyway. 40K+ monthly views, an audience built on trust.",
  alternates: { canonical: "/brands" },
  openGraph: { url: "/brands", title: "Work with brands · Akshay Maru" },
};

const card =
  "flex flex-col justify-between rounded-xl border border-rule bg-canvas-deep p-6 transition-colors duration-300 hover:border-ink/25 sm:p-7";

export default function BrandsPage() {
  return (
    <div className="grain">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section
          aria-labelledby="brands-title"
          className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 sm:pt-40 lg:px-10"
        >
          <Reveal>
            <p className="label">
              {brandsHero.label} ·{" "}
              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline transition-colors hover:text-ink"
              >
                {instagram.handle}
              </a>
            </p>
            <h1
              id="brands-title"
              className="mt-4 max-w-[16ch] text-[clamp(2.8rem,8vw,6rem)] leading-[0.92]"
            >
              {brandsHero.title[0]} <em>{brandsHero.title[1]}</em>
            </h1>
            <p className="mt-6 font-mono text-[0.8rem] uppercase tracking-[0.1em] text-ink">
              {instagram.displayLine}
            </p>
            <p className="mt-8 max-w-[56ch] text-[1.1rem] text-ink-muted">
              {brandsHero.sub}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={brandHref()}
                className="rounded-full bg-ink px-6 py-3 text-[0.95rem] font-medium text-canvas transition-opacity hover:opacity-85"
              >
                Work with me
              </a>
              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-ink"
              >
                See the content
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </Reveal>
        </section>

        {/* Numbers + content */}
        <section
          aria-label="Numbers and content"
          className="border-t border-rule"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
            {instagramStats.length > 0 && (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
                {instagramStats.map((s, i) => (
                  <Reveal
                    as="li"
                    key={s.label}
                    delay={i * 0.05}
                    className={`${card} min-h-[160px]`}
                  >
                    <span className="text-[clamp(2.6rem,6vw,4.5rem)] font-medium leading-none tracking-[-0.05em] text-ink">
                      {s.value}
                    </span>
                    <span className="mt-6 block text-ink-muted">{s.label}</span>
                  </Reveal>
                ))}
              </ul>
            )}

            <Reveal className={`${card} mt-3 lg:mt-4`}>
              <span className="label">What I talk about</span>
              <span className="mt-6 flex flex-wrap gap-2">
                {beyondWork.pillars.map((p) => (
                  <span
                    key={p.t}
                    className="rounded-full border border-rule px-4 py-2 text-[1.05rem] text-ink"
                  >
                    {p.t}
                  </span>
                ))}
              </span>
            </Reveal>

            <p className="label mt-14">Recent content</p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
              {instagram.recent.map((r, i) => (
                <Reveal
                  as="li"
                  key={r.title}
                  delay={i * 0.05}
                  className="overflow-hidden rounded-xl border border-rule bg-canvas-deep transition-colors duration-300 hover:border-ink/25"
                >
                  {/* Official Instagram embed: real cover, plays inline. Cropped to hide the caption footer. */}
                  <div className="relative h-[560px] overflow-hidden bg-white">
                    <iframe
                      src={reelEmbed(r.reel)}
                      title={`Instagram reel: ${r.title}`}
                      loading="lazy"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-[680px] w-full border-0"
                    />
                  </div>
                  <a
                    href={reelUrl(r.reel)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-5 sm:p-6"
                  >
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-ink-faint">
                      {r.tag}
                    </span>
                    <span className="mt-2 flex items-start justify-between gap-3">
                      <span className="text-[1.2rem] font-medium leading-tight tracking-[-0.02em] text-ink">
                        {r.title}
                      </span>
                      <ArrowUpRight
                        aria-hidden
                        className="mt-1 size-4 shrink-0 text-ink-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                      />
                    </span>
                    <span className="mt-2 block text-[0.95rem] leading-snug text-ink-muted">
                      {r.line}
                    </span>
                  </a>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Why me */}
        <section
          aria-labelledby="why-me-title"
          className="border-t border-rule"
        >
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10">
            <SectionHead
              id="why-me-title"
              label="Why partner with me"
              title={
                <>
                  Not another fitness page. <em>A story people follow.</em>
                </>
              }
            />
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:gap-4">
              {whyMe.map((w, i) => (
                <Reveal
                  as="li"
                  key={w.t}
                  delay={(i % 2) * 0.06}
                  className={`${card} min-h-[200px]`}
                >
                  <span className="font-mono text-[0.75rem] text-ink-faint">
                    0{i + 1}
                  </span>
                  <span className="mt-10 block">
                    <span className="block text-[1.6rem] font-medium leading-tight tracking-[-0.03em] text-ink">
                      {w.t}
                    </span>
                    <span className="mt-2 block max-w-[48ch] text-[0.95rem] leading-snug text-ink-muted">
                      {w.d}
                    </span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* What I offer */}
        <section
          aria-labelledby="offers-title"
          className="border-t border-rule"
        >
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10">
            <SectionHead
              id="offers-title"
              label="What I offer"
              title={
                <>
                  Ways we can <em>work together.</em>
                </>
              }
              aside="Pick one, or mix. Rates depend on scope and usage rights, so tell me what you have in mind."
            />
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {offers.map((o, i) => (
                <Reveal
                  as="li"
                  key={o.t}
                  delay={(i % 4) * 0.05}
                  className={`${card} min-h-[220px]`}
                >
                  <span className="block text-[1.4rem] font-medium leading-tight tracking-[-0.03em] text-ink">
                    {o.t}
                  </span>
                  <span className="mt-6 block text-[0.95rem] leading-snug text-ink-muted">
                    {o.d}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Brand fit */}
        <section aria-labelledby="fit-title" className="border-t border-rule">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10">
            <SectionHead
              id="fit-title"
              label="Good fit for"
              title={
                <>
                  Brands that want <em>every body</em> in the room.
                </>
              }
            />
            <Reveal>
              <ul className="flex flex-wrap gap-2 sm:gap-3">
                {brandFits.map((f) => (
                  <li
                    key={f}
                    className="rounded-full border border-rule bg-canvas-deep px-5 py-3 text-ink"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="brands-cta" className="border-t border-rule">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10">
            <Reveal>
              <h2
                id="brands-cta"
                className="max-w-[18ch] text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95]"
              >
                Let&apos;s make something <em>people believe.</em>
              </h2>
              <p className="mt-6 max-w-[48ch] text-ink-muted">
                Send your brand, product and what you have in mind. I reply
                within two days.
              </p>
              <a
                href={brandHref()}
                className="mt-10 inline-block rounded-full bg-ink px-6 py-3 text-[0.95rem] font-medium text-canvas transition-opacity hover:opacity-85"
              >
                {profile.email}
              </a>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
