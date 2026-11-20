import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Lab } from "@/components/home/lab";
import { Creator } from "@/components/home/creator";
import { Reveal } from "@/components/home/motion";
import { lab } from "@/lib/home";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "Akshay Maru's side projects: open-source AI tools, interactive 3D atlases of the brain and eye, a 3D town of his career, and his training channel.",
  alternates: { canonical: "/lab" },
  openGraph: { url: "/lab", title: "Lab · Akshay Maru" },
};

export default function LabPage() {
  return (
    <div className="grain">
      <SiteHeader />
      <main>
        <Lab
          items={lab}
          label="Lab"
          title={
            <>
              Side projects &amp; <em>experiments.</em>
            </>
          }
          aside="Open-source tools, 3D in the browser and things I build for fun. Free to use, read and fork."
        />

        <section aria-labelledby="town-title" className="border-t border-rule">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-10">
            <Reveal>
              <Link
                href="/town"
                className="group flex flex-col items-start justify-between gap-6 rounded-xl border border-rule bg-canvas-deep p-6 transition-colors duration-300 hover:border-ink/25 sm:flex-row sm:items-center sm:p-10"
              >
                <div>
                  <p className="label">3D · Playable</p>
                  <h2 id="town-title" className="mt-4 text-[clamp(2rem,4.5vw,3.25rem)] leading-[0.98]">
                    Walk through my career <em>as a 3D town.</em>
                  </h2>
                  <p className="mt-3 max-w-[52ch] text-ink-muted">
                    Buildings are past roles, shops are skills, and the AI Core at the end hosts my AI.
                  </p>
                </div>
                <ArrowUpRight
                  aria-hidden
                  className="size-8 shrink-0 text-ink-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                />
              </Link>
            </Reveal>
          </div>
        </section>

        <Creator />
      </main>
      <SiteFooter />
    </div>
  );
}
