import type { Metadata } from "next";
import { Fraunces, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://akshay-portfolio-zeta.vercel.app"),
  title: "Akshay Maru — AI Product Engineer",
  description:
    "Senior AI product engineer. Leads the frontend of an enterprise AI assistant on AWS Bedrock, founded and exited an AI SaaS (40K+ users), ships local-first AI tooling and LLM security as open source.",
  keywords: [
    "Akshay Maru",
    "AI Product Engineer",
    "LLM Engineer",
    "Local-first AI",
    "Ollama",
    "RAG",
    "LangGraph",
    "AI Security",
    "OWASP LLM Top 10",
    "React",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "Akshay Maru" }],
  openGraph: {
    title: "Akshay Maru — AI Product Engineer",
    description:
      "Ships real AI products. Enterprise AI assistant on Bedrock, an exited AI SaaS, and a maintained open-source ecosystem of local-first AI tooling and LLM security.",
    url: "https://akshay-portfolio-zeta.vercel.app/",
    siteName: "Akshay Maru",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akshay Maru — AI Product Engineer",
    description:
      "Ships real AI products. Enterprise AI on Bedrock, an exited AI SaaS, and open-source local-first AI tooling.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
