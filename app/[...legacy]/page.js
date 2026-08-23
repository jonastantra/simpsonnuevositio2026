import CategoryView from "@/components/CategoryView";
import EpisodeView from "@/components/EpisodeView";
import UtilityPage from "@/components/UtilityPage";
import capitulos from "@/data/capitulos.json";
import {
  absoluteImageUrl,
  absoluteUrl,
  categoryPages,
  episodeHref,
  findCapituloByPath,
  findCategoryByPath,
  findLegacyPageByPath,
  findUtilityByPath,
  getCategoryCapitulos,
  getLegacyPages,
  pathToSegments,
  siteUrl,
  utilityPages,
} from "@/lib/site";
import { notFound } from "next/navigation";

export const dynamic = "force-static";
export const dynamicParams = false;

function paramsToPath(params) {
  return `/${(params.legacy || []).join("/")}/`;
}

export function generateStaticParams() {
  const paths = new Set();

  for (const capitulo of capitulos) {
    paths.add(episodeHref(capitulo));
    for (const alias of capitulo.aliases || []) {
      paths.add(alias);
    }
  }
  for (const category of categoryPages) {
    paths.add(category.path);
  }
  for (const page of utilityPages) {
    paths.add(page.path);
  }
  for (const page of getLegacyPages()) {
    paths.add(page.path);
  }

  return [...paths]
    .filter((path) => path && path !== "/")
    .map((path) => ({ legacy: pathToSegments(path) }));
}

export async function generateMetadata({ params }) {
  const path = paramsToPath(await params);
  const capitulo = findCapituloByPath(path);
  if (capitulo) {
    const title = capitulo.seoTitle || capitulo.tituloLimpio || capitulo.titulo;
    const description =
      capitulo.seoDescription ||
      capitulo.descripcion ||
      `Ver ${capitulo.tituloLimpio || capitulo.titulo} online en Los Simpsons Online en espanol latino.`;
    const canonicalUrl = absoluteUrl(episodeHref(capitulo));
    const imageUrl = absoluteImageUrl(capitulo.imagen);

    return {
      title,
      description,
      keywords: [
        "Los Simpsons online",
        `Los Simpsons temporada ${capitulo.temporada}`,
        `Los Simpsons capitulo ${capitulo.numero}`,
        capitulo.tituloLimpio || capitulo.titulo,
        "Los Simpsons espanol latino",
        "Homer Simpson",
        "Bart Simpson",
        "Springfield",
      ],
      alternates: { canonical: canonicalUrl },
      openGraph: {
        type: "video.episode",
        url: canonicalUrl,
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: capitulo.tituloLimpio || capitulo.titulo,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  }

  const category = findCategoryByPath(path);
  if (category) {
    const canonicalUrl = absoluteUrl(category.path);
    const defaultImage = absoluteImageUrl();
    return {
      title: category.title,
      description: category.description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        type: "website",
        url: canonicalUrl,
        title: `${category.title} | Los Simpsons Online`,
        description: category.description,
        images: [{ url: defaultImage, alt: category.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${category.title} | Los Simpsons Online`,
        description: category.description,
        images: [defaultImage],
      },
    };
  }

  const utility = findUtilityByPath(path);
  if (utility) {
    return {
      title: utility.title,
      alternates: { canonical: absoluteUrl(utility.path) },
      robots: utility.path === "/blog/" ? { index: true, follow: true } : { index: false, follow: true },
    };
  }

  const legacyPage = findLegacyPageByPath(path);
  if (legacyPage) {
    return {
      title: legacyPage.title,
      description: legacyPage.description,
      alternates: { canonical: absoluteUrl(legacyPage.path) },
    };
  }

  return {
    title: "Pagina no encontrada",
    robots: { index: false, follow: false },
  };
}

export default async function LegacyPage({ params }) {
  const path = paramsToPath(await params);
  const capitulo = findCapituloByPath(path);
  if (capitulo) {
    const episodeCanonical = absoluteUrl(episodeHref(capitulo));
    const episodeImage = absoluteImageUrl(capitulo.imagen);
    const episodeNumber = capitulo.numero === 9999 ? undefined : capitulo.numero;

    const videoSchema = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: capitulo.tituloLimpio || capitulo.titulo,
      description: capitulo.seoDescription || capitulo.descripcion || `Ver ${capitulo.titulo} online en Los Simpsons Online.`,
      thumbnailUrl: [episodeImage],
      uploadDate: "2026-05-19",
      genre: ["Animacion", "Comedia", "Sitcom"],
      duration: "PT22M",
      inLanguage: "es-MX",
      partOfSeries: {
        "@type": "TVSeries",
        name: "Los Simpsons",
        creator: "Matt Groening",
      },
      episodeNumber,
      partOfSeason: capitulo.temporada && capitulo.temporada !== 999
        ? {
            "@type": "TVSeason",
            seasonNumber: capitulo.temporada,
            name: `Temporada ${capitulo.temporada}`,
          }
        : undefined,
      actor: ["Homer Simpson", "Marge Simpson", "Bart Simpson", "Lisa Simpson", "Maggie Simpson"],
      creator: "Matt Groening",
      productionCompany: "Fox Broadcasting Company",
      embedUrl: capitulo.iframe?.match(/src=["']([^"']+)["']/i)?.[1],
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: `${siteUrl}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: capitulo.categoria || `Temporada ${capitulo.temporada}`,
          item: absoluteUrl(`/category/${capitulo.categoriaSlug}/`),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: capitulo.tituloLimpio || capitulo.titulo,
          item: episodeCanonical,
        },
      ],
    };

    const tvEpisodeSchema = {
      "@context": "https://schema.org",
      "@type": "TVEpisode",
      name: capitulo.tituloLimpio || capitulo.titulo,
      episodeNumber,
      description: capitulo.seoDescription || capitulo.descripcion,
      image: episodeImage,
      partOfSeries: {
        "@type": "TVSeries",
        name: "Los Simpsons",
      },
      partOfSeason: capitulo.temporada && capitulo.temporada !== 999
        ? {
            "@type": "TVSeason",
            seasonNumber: capitulo.temporada,
            name: `Temporada ${capitulo.temporada}`,
          }
        : undefined,
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(tvEpisodeSchema) }}
        />
        <EpisodeView capitulo={capitulo} capitulos={capitulos} />
      </>
    );
  }

  const category = findCategoryByPath(path);
  if (category) {
    const categoryCapitulos = getCategoryCapitulos(category);
    const categoryCanonical = absoluteUrl(category.path);

    const categoryBreadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: `${siteUrl}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: category.title,
          item: categoryCanonical,
        },
      ],
    };

    const collectionSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: category.title,
      description: category.description,
      url: categoryCanonical,
      mainEntity: {
        "@type": "ItemList",
        name: `Capitulos de ${category.title}`,
        numberOfItems: categoryCapitulos.length,
        itemListElement: categoryCapitulos.slice(0, 50).map((cap, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          url: absoluteUrl(episodeHref(cap)),
          name: cap.tituloLimpio || cap.titulo,
        })),
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryBreadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
        <CategoryView category={category} capitulos={categoryCapitulos} />
      </>
    );
  }

  const utility = findUtilityByPath(path);
  if (utility) {
    return <UtilityPage page={utility} />;
  }

  const legacyPage = findLegacyPageByPath(path);
  if (legacyPage) {
    return <UtilityPage page={legacyPage} />;
  }

  notFound();
}
