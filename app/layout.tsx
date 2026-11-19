import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter_Tight, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { CommandPalette } from "@/components/command-palette";
import { profile, siteUrl } from "@/lib/content";

// Claude-style pairing with free near-matches: Inter Tight (for Styrene) sets
// all normal text and headlines; Source Serif 4 bold italic (for Tiempos) is
// reserved for highlighted words that make the point. Plex Mono annotates.
const sans = Inter_Tight({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const serif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["italic"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
};

const DESCRIPTION =
  "Akshay Maru is a freelance AI engineer. He doesn't build demos: he builds AI products your customers rely on for years, end to end (assistants, RAG, agents, LLM security). Ex-JupiterOne; founded and sold an AI SaaS with 40K+ users.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Akshay Maru — Freelance AI Engineer",
    template: "%s · Akshay Maru",
  },
  description: DESCRIPTION,
  applicationName: "Akshay Maru",
  keywords: [
    "Akshay Maru",
    "Freelance AI engineer",
    "Hire AI developer",
    "AI product engineer",
    "AI chatbot developer",
    "RAG",
    "AI agents",
    "LLM security",
    "Prompt injection",
    "Next.js",
    "React",
    "Content creator",
    "akshaay.lifts",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Akshay Maru — I don't build demos. I build AI that lasts.",
    description:
      "Freelance AI engineer, open for projects. Ex-JupiterOne, founded and sold an AI SaaS (40K+ users). Book a free 20-min call.",
    url: "/",
    siteName: "Akshay Maru",
    locale: "en_US",
    type: "profile",
    firstName: "Akshay",
    lastName: "Maru",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akshay Maru — I don't build demos. I build AI that lasts.",
    description:
      "Freelance AI engineer, open for projects. Ex-JupiterOne, founded and sold an AI SaaS (40K+ users).",
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
    jobTitle: "Freelance AI Engineer",
    description: DESCRIPTION,
    email: `mailto:${profile.email}`,
    image: `${siteUrl}/opengraph-image`,
    homeLocation: { "@type": "Country", name: profile.location },
    sameAs: [profile.github, profile.linkedin, profile.instagramLifts, "https://miii.in/"],
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
    <html lang="en" className="bg-[#0b0b0c]">
      <body
        className={`${sans.variable} ${serif.variable} ${plexMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
        />
        {children}
        <CommandPalette />
        <Toaster position="bottom-right" theme="dark" />
        <Analytics />
      </body>
    </html>
  );
}
