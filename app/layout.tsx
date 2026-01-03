import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Akshay Maru | AI Full Stack Developer Portfolio",
  description: "Explore the professional portfolio of Akshay Maru, featuring innovative web development projects, technical skills, and software engineering expertise.",
  keywords: ["Akshay Maru", "Full Stack Developer", "Portfolio", "Software Engineer", "Web Development", "React", "Next.js"],
  authors: [{ name: "Akshay Maru" }],
  openGraph: {
    title: "Akshay Maru | AI Full Stack Developer Portfolio",
    description: "Personal portfolio of Akshay Maru, showcasing projects and skills.",
    url: "https://akshay-portfolio-zeta.vercel.app/",
    siteName: "Akshay Maru Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akshay Maru | AI Full Stack Developer Portfolio",
    description: "Personal portfolio of Akshay Maru, showcasing projects and skills.",
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
        
        {children}
        <footer className="text-center md:block hidden text-xs text-muted-foreground fixed bottom-0.5 ml-3">
          <p>© {new Date().getFullYear()} Akshay Portfolio. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
