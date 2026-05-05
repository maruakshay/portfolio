import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  description: "Founder turned Product Builder creating AI products users love. Built products across resumes, hiring, growth, automation, and AI experiences.",
  keywords: ["Akshay Maru", "AI Product Engineer", "LLM Systems", "RAG Architecture", "Retrieval Augmented Generation", "Vector Databases", "LangChain", "LangGraph", "OpenAI", "Claude API", "Full Stack Developer", "React", "Next.js", "TypeScript", "Python"],
  authors: [{ name: "Akshay Maru" }],
  openGraph: {
    title: "Akshay Maru | Founder turned Product Builder",
    description: "Senior AI Product Engineer creating AI products users love.",
    url: "https://akshay-portfolio-zeta.vercel.app/",
    siteName: "Akshay Maru Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akshay Maru | Founder turned Product Builder",
    description: "Senior AI Product Engineer creating AI products users love.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}
      >
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
        <Analytics />
        <footer className="hidden md:block text-xs text-slate-500 z-20 fixed left-0 bottom-0.5 ml-4">
          <p>© {new Date().getFullYear()} Akshay Maru. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
