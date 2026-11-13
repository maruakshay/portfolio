import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Akshay Maru — Freelance AI Engineer & Creator",
    short_name: "Akshay Maru",
    description: "Freelance AI engineer and content creator. AI products, RAG, agents and LLM security, built end to end.",
    start_url: "/",
    display: "standalone",
    background_color: "#efece6",
    theme_color: "#efece6",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
