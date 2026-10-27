import { absoluteImageUrl, absoluteUrl, episodeHref, siteUrl } from "./site";

export function episodeMetadata(episode) {
  const title = episode.seoTitle || episode.tituloLimpio || episode.titulo;
  const description = episode.seoDescription || episode.descripcion;
  const url = absoluteUrl(episodeHref(episode));
  const image = absoluteImageUrl(episode.imagen);
  return {
    title, description,
    alternates: { canonical: url },
    robots: { index: Boolean(episode.players?.length), follow: true },
    openGraph: { type: episode.temporada === 999 ? "article" : "video.episode", url, title, description, images: [{ url: image, alt: episode.tituloLimpio || episode.titulo }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function episodeSchemas(episode) {
  const url = absoluteUrl(episodeHref(episode));
  const season = episode.temporada > 0 && episode.temporada < 999;
  const title = episode.tituloLimpio || episode.titulo;
  const entity = {
    "@context": "https://schema.org",
    "@type": season ? "TVEpisode" : "WebPage",
    "@id": `${url}#entry`, url, name: title,
    description: episode.descripcion, image: absoluteImageUrl(episode.imagen), inLanguage: "es-MX",
    ...(season ? {
      episodeNumber: episode.numero === 9999 ? undefined : episode.numero,
      partOfSeason: { "@type": "TVSeason", seasonNumber: episode.temporada, url: absoluteUrl(`/category/${episode.categoriaSlug}/`) },
      partOfSeries: { "@type": "TVSeries", name: "Los Simpsons" },
    } : {}),
  };
  // No invented upload date, duration, rating, actors or HTML page used as a video file.
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: season ? episode.categoria : "Blog", item: absoluteUrl(season ? `/category/${episode.categoriaSlug}/` : "/blog/") },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ],
  };
  return [entity, breadcrumb];
}
