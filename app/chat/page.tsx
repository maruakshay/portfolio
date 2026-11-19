import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { ChatFull } from "@/components/chat-full";

export const metadata: Metadata = {
  title: "Ask the AI",
  alternates: { canonical: "/chat" },
  openGraph: { url: "/chat", title: "Ask Akshay Maru's AI about his work" },
  description:
    "Ask Akshay Maru's portfolio AI about his work, the miii ecosystem, the AI security framework, and his experience. Grounded in his actual résumé.",
};

export default function ChatPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <ChatFull />
      </main>
    </>
  );
}
