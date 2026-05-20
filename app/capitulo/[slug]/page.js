import EpisodeView from "@/components/EpisodeView";
import capitulos from "@/data/capitulos.json";
import { episodeHref, findCapituloBySlug, siteUrl } from "@/lib/site";
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

  return {
    title: capitulo.seoTitle || capitulo.tituloLimpio || capitulo.titulo,
    description:
      capitulo.seoDescription ||
      capitulo.descripcion ||
      `${capitulo.titulo} online en Los Simpsons Online. Reproductor responsivo optimizado para movil.`,
    keywords: [
      "Los Simpsons online",
      `Los Simpsons temporada ${capitulo.temporada}`,
      `Los Simpsons capitulo ${capitulo.numero}`,
      capitulo.tituloLimpio || capitulo.titulo,
      "Homer Simpson",
      "Bart Simpson",
      "Springfield",
    ],
    alternates: {
      canonical: episodeHref(capitulo),
    },
    openGraph: {
      type: "video.episode",
      url: `${siteUrl}${episodeHref(capitulo)}`,
      title: capitulo.tituloLimpio || capitulo.titulo,
      description: capitulo.seoDescription || `Ver ${capitulo.tituloLimpio || capitulo.titulo} online.`,
      images: capitulo.imagen ? [{ url: capitulo.imagen, alt: capitulo.tituloLimpio || capitulo.titulo }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: capitulo.tituloLimpio || capitulo.titulo,
      description: capitulo.seoDescription || `Ver ${capitulo.tituloLimpio || capitulo.titulo} online.`,
      images: capitulo.imagen ? [capitulo.imagen] : [],
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
