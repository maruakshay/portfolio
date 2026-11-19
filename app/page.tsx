import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/home/hero";
import { Proof } from "@/components/home/proof";
import { Work } from "@/components/home/work";
import { Experience } from "@/components/home/experience";
import { Services } from "@/components/home/services";
import { Lab } from "@/components/home/lab";
import { Creator } from "@/components/home/creator";
import { FinalCta } from "@/components/home/final-cta";

export default function Home() {
  return (
    <div className="grain">
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-20 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas"
      >
        Skip to work
      </a>
      <SiteHeader />
      <main>
        <Hero />
        <Proof />
        <Work />
        <Experience />
        <Services />
        <Lab />
        <Creator />
      </main>
      <FinalCta />
    </div>
  );
}
