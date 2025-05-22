import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
            <Link href="/" className="text-2xl font-medium tracking-wide ">
              Akshay <span className="text-secondary">Maru</span>
            </Link>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
