import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Akshay Maru | Senior AI Product Engineer",
  description: "Senior AI Product Engineer specializing in LLM Systems, RAG Architecture, and Production AI. Expert in hybrid retrieval, vector databases, agentic workflows, and full-stack AI development.",
  keywords: ["Akshay Maru", "AI Product Engineer", "LLM Systems", "RAG Architecture", "Retrieval Augmented Generation", "Vector Databases", "LangChain", "LangGraph", "OpenAI", "Claude API", "Full Stack Developer", "React", "Next.js", "TypeScript", "Python"],
  authors: [{ name: "Akshay Maru" }],
  openGraph: {
    title: "Akshay Maru | Senior AI Product Engineer",
    description: "Senior AI Product Engineer specializing in LLM Systems, RAG Architecture, and Production AI. Building scalable AI solutions with hybrid retrieval and agentic workflows.",
    url: "https://akshay-portfolio-zeta.vercel.app/",
    siteName: "Akshay Maru Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akshay Maru | Senior AI Product Engineer",
    description: "Senior AI Product Engineer specializing in LLM Systems, RAG Architecture, and Production AI.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuroraBackground className="h-svh">
 {children}
 <Analytics />
        <footer className=" md:block hidden text-xs text-muted-foreground z-20 fixed left-0 bottom-0.5 ml-3">
          <p>© {new Date().getFullYear()} Akshay Portfolio. All rights reserved.</p>
        </footer>
        </AuroraBackground>
        
       
      </body>
    </html>
  );
}
