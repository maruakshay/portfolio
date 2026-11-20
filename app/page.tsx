import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/home/hero";
import { Proof } from "@/components/home/proof";
import { Work } from "@/components/home/work";
import { Experience } from "@/components/home/experience";
import { Approach } from "@/components/home/approach";
import { WhyBreak } from "@/components/home/why-break";
import { Services } from "@/components/home/services";
import { Testimonials } from "@/components/home/testimonials";
import { Faq } from "@/components/home/faq";
import { About } from "@/components/home/about";
import { Lab } from "@/components/home/lab";
import { ChecklistCard } from "@/components/home/checklist-card";
import { lab } from "@/lib/home";
import { leadMagnet } from "@/lib/offer";
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
        <Approach />
        <WhyBreak />
        <Work />
        <Services />
        <Testimonials />
        <Faq />
        <Experience />
        <About />
        <Lab
          items={lab.filter((l) => l.slug === "mii-ai-security")}
          label="Open source"
          title={
            <>
              Built in <em>the open.</em>
            </>
          }
          aside="The AI-security playbook I maintain publicly. Free to use, read and fork."
          extra={leadMagnet.endpoint ? <ChecklistCard /> : undefined}
        />
      </main>
      <FinalCta />
    </div>
  );
}
