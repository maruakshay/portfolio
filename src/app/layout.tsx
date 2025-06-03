import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
  weight: "400",
});
export const metadata: Metadata = {
  title: "Akshay Maru | Product Manager Portfolio | SaaS, AI, Startup Expert",
  description:
    "Akshay Maru is a top Product Manager, SaaS Founder, and AI Product Leader. Explore his portfolio, case studies, resume, and expertise in product management, startups, SaaS, and AI. Hire a proven product manager for your next project.",
  authors: [{ name: "Akshay Maru" }],
  keywords:
    "Product Manager, Product Management, SaaS, AI, Artificial Intelligence, Startup, Product Leader, Product Portfolio, Resume, Case Studies, Product Owner, Agile, UX, UI, Roadmap, Product Strategy, Product Design, MVP, User Research, Product Development, Product Marketing, Growth, Akshay Maru, Hire Product Manager, Top Product Manager, Product Manager Portfolio, Product Manager Resume, Product Manager Case Studies, Product Management Expert, Product Management Consultant",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1.0",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSans.variable} ${instrumentSerif.variable} antialiased container mx-auto `}
      >
        <header className="font-sans text-primary">
          <div className="flex justify-center items-center p-6 ">
            <div className="relative flex items-center">
              {/* Decorative Blob */}
              <svg
                className="absolute -left-10 w-20 h-20 text-[#ff5941] opacity-30 -z-10 animate-pulse "
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M44.8,-67.2C56.7,-59.3,64.7,-45.1,68.2,-30.7C71.7,-16.3,70.7,-1.7,66.2,11.7C61.7,25.1,53.7,37.3,43.1,46.1C32.5,54.9,19.2,60.3,4.6,62.1C-10,63.9,-25,62.1,-37.7,54.7C-50.4,47.3,-60.8,34.3,-65.2,19.5C-69.6,4.7,-68,-11.9,-61.2,-25.7C-54.4,-39.5,-42.4,-50.5,-28.7,-58.2C-15,-65.9,0.3,-70.3,15.7,-71.2C31.1,-72.1,44.8,-67.2,44.8,-67.2Z"
                  transform="translate(100 100)"
                />
              </svg>
              <Link
                href="/"
                className="text-2xl font-medium tracking-wide relative z-10"
              >
                Akshay{" "}
                <span className="text-[#ff5941] font-serif text-3xl font-bold">
                  Maru
                </span>
              </Link>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
