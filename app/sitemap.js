import capitulos from "@/data/capitulos.json";
import { absoluteUrl, categoryPages, episodeHref, getLegacyPages, siteUrl, utilityPages } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap() {
  const now = new Date();

  return [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...categoryPages.map((category) => ({
      url: absoluteUrl(category.path),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    })),
    ...capitulos.map((capitulo) => ({
      url: absoluteUrl(episodeHref(capitulo)),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
    ...utilityPages.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: now,
      changeFrequency: "yearly",
      priority: page.path === "/blog/" ? 0.6 : 0.3,
    })),
    ...getLegacyPages().map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.35,
    })),
  ];
}
