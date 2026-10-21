import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { CommandPalette } from "@/components/command-palette";
import { AchievementsProvider } from "@/components/achievements";
import { profile, siteUrl } from "@/lib/content";

// A loud grotesk to speak, a serif italic for the one human word, a clean
// sans to read, and a monospace for the engineer's annotations.
const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#121218",
};

const DESCRIPTION =
  "Akshay Maru is a senior AI product engineer who ships production AI end to end: an enterprise AI assistant on AWS Bedrock (JupiterOne), an AI SaaS grown to 40K+ users and acquired, and miii, an open-source alternative to Claude Code.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Akshay Maru — AI Product Engineer who ships",
    template: "%s · Akshay Maru",
  },
  description: DESCRIPTION,
  applicationName: "Akshay Maru",
  keywords: [
    "Akshay Maru",
    "AI Product Engineer",
    "Senior AI Engineer",
    "LLM Engineer",
    "Full-stack AI Engineer",
    "Hire AI engineer",
    "RAG",
    "AI agents",
    "LangGraph",
    "AWS Bedrock",
    "AI Security",
    "OWASP LLM Top 10",
    "Prompt injection",
    "miii",
    "Claude Code alternative",
    "Local-first AI",
    "React",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Akshay Maru — Most AI demos die in production. Mine ship.",
    description:
      "Enterprise AI on Bedrock, an AI SaaS to 40K+ users and an exit, and open-source AI tooling. Play the arcade, then book a call.",
    url: "/",
    siteName: "Akshay Maru",
    locale: "en_US",
    type: "profile",
    firstName: "Akshay",
    lastName: "Maru",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akshay Maru — Most AI demos die in production. Mine ship.",
    description:
      "Enterprise AI on Bedrock, an exited AI SaaS (40K+ users), and open-source AI tooling.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Structured data so search engines can show a proper person / profile result.
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: siteUrl,
  mainEntity: {
    "@type": "Person",
    name: profile.name,
    url: siteUrl,
    jobTitle: "Senior Full-Stack AI Engineer",
    description: DESCRIPTION,
    email: `mailto:${profile.email}`,
    image: `${siteUrl}/opengraph-image`,
    worksFor: { "@type": "Organization", name: "Commotion", url: "https://gocommotion.com/" },
    homeLocation: { "@type": "Country", name: profile.location },
    sameAs: [profile.github, profile.linkedin, "https://miii.in/"],
    knowsAbout: [
      "Large language models",
      "Retrieval-augmented generation",
      "AI agents",
      "LLM security",
      "OWASP LLM Top 10",
      "LLMOps",
      "React",
      "Next.js",
      "TypeScript",
      "Python",
      "AWS Bedrock",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${instrument.variable} ${geist.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
        />
        <AchievementsProvider>
          {children}
          <CommandPalette />
          <Toaster position="bottom-right" />
        </AchievementsProvider>
        <Analytics />
      </body>
    </html>
  );
}
