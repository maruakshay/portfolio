import { SiteHeader } from "@/components/site-header";
import { SideIndex } from "@/components/side-index";
import { Hero } from "@/components/hero";
import { Exhibition } from "@/components/exhibition";
import { MiiiSpotlight } from "@/components/miii-spotlight";
import { Career } from "@/components/career";
import { Method } from "@/components/method";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <SideIndex />
      <main>
        <Hero />
        <Exhibition />
        <MiiiSpotlight />
        <Career />
        <Method />
      </main>
      <SiteFooter withLetter />
    </>
  );
}
