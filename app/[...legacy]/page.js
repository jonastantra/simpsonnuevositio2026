import CategoryView from "@/components/CategoryView";
import EpisodeView from "@/components/EpisodeView";
import UtilityPage from "@/components/UtilityPage";
import capitulos from "@/data/capitulos.json";
import {
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
    return {
      title: capitulo.seoTitle || capitulo.tituloLimpio || capitulo.titulo,
      description:
        capitulo.seoDescription ||
        capitulo.descripcion ||
        `${capitulo.tituloLimpio || capitulo.titulo} online en Los Simpsons Online.`,
      keywords: [
        "Los Simpsons online",
        `Los Simpsons temporada ${capitulo.temporada}`,
        `Los Simpsons capitulo ${capitulo.numero}`,
        capitulo.tituloLimpio || capitulo.titulo,
        "Homer Simpson",
        "Bart Simpson",
        "Springfield",
      ],
      alternates: { canonical: episodeHref(capitulo) },
      openGraph: {
        type: "video.episode",
        url: `${siteUrl}${episodeHref(capitulo)}`,
        title: capitulo.tituloLimpio || capitulo.titulo,
        description: capitulo.seoDescription || `Ver ${capitulo.tituloLimpio || capitulo.titulo} online.`,
        images: capitulo.imagen ? [{ url: capitulo.imagen, alt: capitulo.tituloLimpio || capitulo.titulo }] : [],
      },
    };
  }

  const category = findCategoryByPath(path);
  if (category) {
    return {
      title: category.title,
      description: category.description,
      alternates: { canonical: category.path },
    };
  }

  const utility = findUtilityByPath(path);
  if (utility) {
    return {
      title: utility.title,
      alternates: { canonical: utility.path },
      robots: utility.path === "/blog/" ? { index: true, follow: true } : { index: false, follow: true },
    };
  }

  const legacyPage = findLegacyPageByPath(path);
  if (legacyPage) {
    return {
      title: legacyPage.title,
      description: legacyPage.description,
      alternates: { canonical: legacyPage.path },
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
    const videoSchema = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: capitulo.tituloLimpio || capitulo.titulo,
      description: capitulo.seoDescription || capitulo.descripcion || `Ver ${capitulo.titulo} online en Los Simpsons Online.`,
      thumbnailUrl: capitulo.imagen ? [capitulo.imagen] : undefined,
      uploadDate: "2026-05-19",
      genre: ["Animacion", "Comedia", "Sitcom"],
      duration: "PT22M",
      inLanguage: "es-MX",
      partOfSeries: {
        "@type": "TVSeries",
        name: "Los Simpsons",
        creator: "Matt Groening",
      },
      episodeNumber: capitulo.numero,
      partOfSeason: capitulo.temporada
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

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
        <EpisodeView capitulo={capitulo} capitulos={capitulos} />
      </>
    );
  }

  const category = findCategoryByPath(path);
  if (category) {
    const categoryCapitulos = getCategoryCapitulos(category);
    return <CategoryView category={category} capitulos={categoryCapitulos} />;
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
