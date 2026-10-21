import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Akshay Maru — AI Product Engineer",
    short_name: "Akshay Maru",
    description: "AI product engineer who ships: enterprise AI, an exited AI SaaS, and open-source AI tooling.",
    start_url: "/",
    display: "standalone",
    background_color: "#121218",
    theme_color: "#121218",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
