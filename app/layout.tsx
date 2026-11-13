import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Serif, Schibsted_Grotesk, Yellowtail } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { CommandPalette } from "@/components/command-palette";
import { profile, siteUrl } from "@/lib/content";

// Schibsted Grotesk speaks, IBM Plex Mono annotates (all small labels),
// and a serif italic is kept for the one human word in long-form headlines.
// Variable font: the full weight axis, so inner-page headings never fake bold.
const schibsted = Schibsted_Grotesk({
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

// Signature script, used only for "Akshay" in the header wordmark.
const script = Yellowtail({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#efece6",
};

const DESCRIPTION =
  "Akshay Maru is a freelance AI engineer and content creator. He builds AI products end to end (assistants, RAG, agents, LLM security) and makes AI and fitness content on Instagram as @akshaay.ai and @akshaay.lifts.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Akshay Maru — Freelance AI Engineer & Content Creator",
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
    "akshaay.ai",
    "akshaay.lifts",
    "AI education",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Akshay Maru — Freelance AI Engineer & Creator",
    description:
      "Open for freelance AI projects: assistants, RAG, agents and LLM security, built end to end. Also making AI and fitness content on Instagram.",
    url: "/",
    siteName: "Akshay Maru",
    locale: "en_US",
    type: "profile",
    firstName: "Akshay",
    lastName: "Maru",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akshay Maru — Freelance AI Engineer & Creator",
    description:
      "Open for freelance AI projects. AI and fitness content on Instagram as @akshaay.ai and @akshaay.lifts.",
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
    jobTitle: "Freelance AI Engineer & Content Creator",
    description: DESCRIPTION,
    email: `mailto:${profile.email}`,
    image: `${siteUrl}/opengraph-image`,
    homeLocation: { "@type": "Country", name: profile.location },
    sameAs: [profile.github, profile.linkedin, profile.instagramAi, profile.instagramLifts, "https://miii.in/"],
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
        className={`${schibsted.variable} ${instrument.variable} ${script.variable} ${plexMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
        />
        {children}
        <CommandPalette />
        <Toaster position="bottom-right" />
        <Analytics />
      </body>
    </html>
  );
}
