import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { WorkBento } from "@/components/work-bento";
import { SiteFooter } from "@/components/site-footer";
import { ChatLauncher } from "@/components/chat-launcher";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <WorkBento />
      </main>
      <SiteFooter />
      <ChatLauncher />
    </>
  );
}
