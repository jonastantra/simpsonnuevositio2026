import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/buscar/", "/buscar/*", "/*?*"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/buscar/", "/buscar/*", "/*?*"],
      },
      {
        userAgent: "Googlebot-Video",
        allow: "/",
      },
    ],
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/video-sitemap.xml`],
  };
}
