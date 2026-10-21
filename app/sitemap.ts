import type { MetadataRoute } from "next";
import { deepDives, siteUrl } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...deepDives.map((d) => ({
      url: `${siteUrl}/work/${d.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${siteUrl}/chat`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];
}
