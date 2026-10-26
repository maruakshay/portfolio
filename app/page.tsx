import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { WorkGrid } from "@/components/work-grid";
import { Arcade } from "@/components/arcade/arcade";
import { MiiiSpotlight } from "@/components/miii-spotlight";
import { Career } from "@/components/career";
import { SiteFooter } from "@/components/site-footer";
import { Journey } from "@/components/journey";
import { HowIWork } from "@/components/how-i-work";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Marquee />
        <HowIWork />
        <WorkGrid />
        <Arcade />
        <MiiiSpotlight />
        <Career />
      </main>
      <SiteFooter withLetter />
      <Journey />
    </>
  );
}
