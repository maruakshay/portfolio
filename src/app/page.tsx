import { Metadata } from "next";
import HomeClient from "./HomeClient";
import {
  processSteps,
  experiences,
  philosophyCards,
  socialLinks,
} from "@/data/portfolio-data";

export const metadata: Metadata = {
  title: "Akshay Maru | Product Developer & AI Product Leader",
  description:
    "Akshay Maru is a top Product Developer, SaaS Founder, and AI Product Leader. Explore his portfolio, case studies, and expertise in product development, startups, and AI.",
  openGraph: {
    title: "Akshay Maru | Product Developer & AI Product Leader",
    description:
      "Akshay Maru is a top Product Developer, SaaS Founder, and AI Product Leader. Explore his portfolio, case studies, and expertise in product development, startups, and AI.",
    url: "https://akshay-portfolio-zeta.vercel.app/", // Replace with actual domain
    siteName: "Akshay Maru Portfolio",
    images: [
      {
        url: "/opengraph-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Akshay Maru Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akshay Maru | Product Developer & AI Product Leader",
    description:
      "Akshay Maru is a top Product Developer, SaaS Founder, and AI Product Leader.",
    images: ["/opengraph-image.jpeg"],
  },
  alternates: {
    canonical: "https://akshaymaru.com", // Replace with actual domain
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Akshay Maru",
    url: "https://akshay-portfolio-zeta.vercel.app/",
    image: "https://akshaymaru.com/opengraph-image.jpeg",
    sameAs: [
      "https://www.linkedin.com/in/akshaymaru61",
      "https://twitter.com/akshaymaru", // Add if available
    ],
    jobTitle: "Product Developer & AI Product Leader",
    worksFor: {
      "@type": "Organization",
      name: "Smart Working (Client: JupiterOne)",
    },
    alumniOf: [
      {
        "@type": "Organization",
        name: "Remote Leaps",
      },
      {
        "@type": "Organization",
        name: "Virtual Internships",
      },
    ],
    description:
      "I believe in the power of first principles thinking. No problem is too complex when you break it down to its fundamentals.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient
        processSteps={processSteps}
        experiences={experiences}
        philosophyCards={philosophyCards}
        socialLinks={socialLinks}
      />
    </>
  );
}
