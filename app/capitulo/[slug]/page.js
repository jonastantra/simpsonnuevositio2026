import EpisodeView from "@/components/EpisodeView";
import capitulos from "@/data/capitulos.json";
import { absoluteImageUrl, absoluteUrl, episodeHref, findCapituloBySlug, siteUrl } from "@/lib/site";
import { notFound } from "next/navigation";

export const dynamic = "force-static";
export const dynamicParams = false;

const placeholderSlug = "sin-datos";

export function generateStaticParams() {
  if (!capitulos.length) return [{ slug: placeholderSlug }];
  return capitulos.map((capitulo) => ({ slug: capitulo.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const capitulo = findCapituloBySlug(slug);

  if (!capitulo) {
    return {
      title: slug === placeholderSlug ? "CSV pendiente" : "Capitulo no encontrado",
      robots: { index: false, follow: false },
    };
  }

  const title = capitulo.seoTitle || capitulo.tituloLimpio || capitulo.titulo;
  const description =
    capitulo.seoDescription ||
    capitulo.descripcion ||
    `Ver ${capitulo.titulo} online en Los Simpsons Online. Reproductor responsivo optimizado para movil en espanol latino.`;
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
      "ver capitulo completo",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
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

export default async function CapituloPage({ params }) {
  const { slug } = await params;
  const capitulo = findCapituloBySlug(slug);
  if (!capitulo && slug === placeholderSlug) {
    return (
      <main className="min-h-screen px-6 py-16 text-white">
        <h1 className="text-4xl font-black">CSV de Los Simpsons pendiente</h1>
        <p className="mt-4 max-w-2xl text-zinc-300">
          Esta ruta tecnica existe solo para que el export estatico compile mientras se reemplaza el CSV de prueba.
        </p>
      </main>
    );
  }
  if (!capitulo) notFound();

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
