import capitulos from "@/data/capitulos.json";
import { absoluteUrl, categoryPages, episodeHref, getArticles, getCategoryCapitulos, siteUrl } from "@/lib/site";
export const dynamic = "force-static";
export default function sitemap() {
  const entries = [
    { url: `${siteUrl}/` },
    { url: absoluteUrl("/temporadas/") },
    { url: absoluteUrl("/blog/") },
    ...categoryPages.filter(category => getCategoryCapitulos(category).length > 0 && category.path !== "/category/blog/").map(category => ({ url: absoluteUrl(category.path) })),
    ...capitulos.filter(episode => episode.players?.length).map(episode => ({ url: absoluteUrl(episodeHref(episode)) })),
    ...getArticles().map(article => ({ url: absoluteUrl(article.path), lastModified: new Date(article.date) })),
  ];
  return [...new Map(entries.map(entry => [entry.url, entry])).values()];
}
