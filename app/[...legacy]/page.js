import ArticleView from "@/components/ArticleView";
import BlogIndexView from "@/components/BlogIndexView";
import CategoryView from "@/components/CategoryView";
import EpisodeView from "@/components/EpisodeView";
import UtilityPage from "@/components/UtilityPage";
import capitulos from "@/data/capitulos.json";
import seasonsInfo from "@/data/seasons-info.json";
import {
  absoluteImageUrl,
  absoluteUrl,
  categoryPages,
  episodeHref,
  findArticleByPath,
  findCapituloByPath,
  findCategoryByPath,
  findLegacyPageByPath,
  findUtilityByPath,
  getArticles,
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
  for (const article of getArticles()) {
    paths.add(article.path);
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

  const article = findArticleByPath(path);
  if (article) {
    const canonicalUrl = absoluteUrl(article.path);
    const imageUrl = absoluteImageUrl(article.image);
    return {
      title: `${article.title} | Blog Los Simpsons`,
      description: article.excerpt,
      keywords: [
        ...(article.tags || []),
        "Los Simpsons blog",
        "Los Simpsons online",
        "curiosidades Los Simpsons",
        "ver Los Simpsons",
      ],
      alternates: { canonical: canonicalUrl },
      openGraph: {
        type: "article",
        url: canonicalUrl,
        title: article.title,
        description: article.excerpt,
        publishedTime: article.date,
        authors: [article.author || "Los Simpsons Online"],
        tags: article.tags,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.excerpt,
        images: [imageUrl],
      },
    };
  }

  const capitulo = findCapituloByPath(path);
  if (capitulo) {
    const title =
      capitulo.seoTitle ||
      `Ver Los Simpsons ${capitulo.temporada && capitulo.temporada !== 999 ? `T${capitulo.temporada} E${capitulo.numero}: ` : ""}${capitulo.tituloLimpio || capitulo.titulo} Online Streaming HD`;
    const description =
      capitulo.seoDescription ||
      capitulo.descripcion ||
      `Ver ${capitulo.tituloLimpio || capitulo.titulo} online en streaming en espanol latino. Capitulo completo en alta definicion.`;
    const canonicalUrl = absoluteUrl(episodeHref(capitulo));
    const imageUrl = absoluteImageUrl(capitulo.imagen);

    return {
      title,
      description,
      keywords: [
        "Los Simpsons online",
        "streaming Los Simpsons",
        `Los Simpsons temporada ${capitulo.temporada}`,
        `Los Simpsons capitulo ${capitulo.numero}`,
        capitulo.tituloLimpio || capitulo.titulo,
        "Los Simpsons espanol latino",
        "capitulo completo HD",
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

  if (path === "/blog/") {
    const canonicalUrl = absoluteUrl("/blog/");
    const defaultImage = absoluteImageUrl();
    return {
      title: "Blog de Los Simpsons: Curiosidades, Guías y Análisis",
      description:
        "Artículos, secretos de producción, predicciones cumplidas y guías de streaming para ver todas las temporadas de Los Simpsons.",
      alternates: { canonical: canonicalUrl },
      openGraph: {
        type: "website",
        url: canonicalUrl,
        title: "Blog de Los Simpsons | Los Simpsons Online",
        description: "Curiosidades, análisis y guías de episodios de Los Simpsons.",
        images: [{ url: defaultImage, alt: "Blog de Los Simpsons" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Blog de Los Simpsons",
        description: "Curiosidades y guías de streaming de Los Simpsons.",
        images: [defaultImage],
      },
    };
  }

  const category = findCategoryByPath(path);
  if (category) {
    const canonicalUrl = absoluteUrl(category.path);
    const defaultImage = absoluteImageUrl();
    return {
      title: `${category.title} - Ver Capitulos Completos Online Streaming`,
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

  const article = findArticleByPath(path);
  if (article) {
    const articleCanonical = absoluteUrl(article.path);
    const articleImage = absoluteImageUrl(article.image);
    const allArticles = getArticles();
    const relatedEpisodes = capitulos
      .filter((c) => c.categoriaSlug === article.relatedCategorySlug || (article.tags && article.tags.includes(c.categoria)))
      .slice(0, 8);

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.title,
      description: article.excerpt,
      image: [articleImage],
      datePublished: `${article.date}T00:00:00+00:00`,
      dateModified: `${article.date}T00:00:00+00:00`,
      author: {
        "@type": "Organization",
        name: article.author || "Los Simpsons Online",
        url: siteUrl,
      },
      publisher: {
        "@type": "Organization",
        name: "Los Simpsons Online",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/uploads/2024/07/11200.jpg`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": articleCanonical,
      },
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
          name: "Blog",
          item: absoluteUrl("/blog/"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.title,
          item: articleCanonical,
        },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <ArticleView article={article} relatedEpisodes={relatedEpisodes} allArticles={allArticles} />
      </>
    );
  }

  if (path === "/blog/") {
    const articles = getArticles();
    const blogCanonical = absoluteUrl("/blog/");

    const collectionSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Blog de Los Simpsons",
      description: "Artículos, curiosidades y guías de streaming de Los Simpsons.",
      url: blogCanonical,
      mainEntity: {
        "@type": "ItemList",
        name: "Artículos del Blog de Los Simpsons",
        numberOfItems: articles.length,
        itemListElement: articles.map((art, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          url: absoluteUrl(art.path),
          name: art.title,
        })),
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
        <BlogIndexView articles={articles} />
      </>
    );
  }

  const capitulo = findCapituloByPath(path);
  if (capitulo) {
    const episodeCanonical = absoluteUrl(episodeHref(capitulo));
    const episodeImage = absoluteImageUrl(capitulo.imagen);
    const episodeNumber = capitulo.numero === 9999 ? undefined : capitulo.numero;
    const embedSrc = capitulo.iframe?.match(/src=["']([^"']+)["']/i)?.[1];

    const videoSchema = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: capitulo.seoTitle || `Ver ${capitulo.tituloLimpio || capitulo.titulo} Online Streaming`,
      description: capitulo.seoDescription || capitulo.descripcion || `Ver ${capitulo.titulo} online en streaming en espanol latino.`,
      thumbnailUrl: [episodeImage],
      uploadDate: "2026-05-19",
      genre: ["Animacion", "Comedia", "Sitcom", "Streaming"],
      duration: "PT22M",
      inLanguage: "es-MX",
      isAccessibleForFree: "True",
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
      embedUrl: embedSrc,
      contentUrl: episodeCanonical,
      potentialAction: {
        "@type": "WatchAction",
        target: episodeCanonical,
      },
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
      potentialAction: {
        "@type": "WatchAction",
        target: episodeCanonical,
      },
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `¿Cómo ver ${capitulo.tituloLimpio || capitulo.titulo} online en español latino?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Puedes reproducir ${capitulo.tituloLimpio || capitulo.titulo} online en streaming en español latino directamente en Los Simpsons Online en HD y sin cortes.`,
          },
        },
        {
          "@type": "Question",
          name: `¿A qué temporada pertenece el capítulo ${capitulo.tituloLimpio || capitulo.titulo}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Este episodio pertenece a ${capitulo.categoria || `la Temporada ${capitulo.temporada}`} de Los Simpsons (episodio número ${episodeNumber || 1}).`,
          },
        },
        {
          "@type": "Question",
          name: `¿De qué trata este capítulo de Los Simpsons?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: capitulo.descripcion || `Capítulo completo de Los Simpsons en audio latino.`,
          },
        },
      ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <EpisodeView capitulo={capitulo} capitulos={capitulos} />
      </>
    );
  }

  const category = findCategoryByPath(path);
  if (category) {
    const categoryCapitulos = getCategoryCapitulos(category);
    const categoryCanonical = absoluteUrl(category.path);
    const isSeason = Boolean(category.temporada && category.temporada !== 999 && category.temporada !== 0);
    const seasonData = isSeason ? seasonsInfo[String(category.temporada)] : null;

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

    const tvSeasonSchema = isSeason
      ? {
          "@context": "https://schema.org",
          "@type": "TVSeason",
          seasonNumber: category.temporada,
          name: `Los Simpsons Temporada ${category.temporada}`,
          url: categoryCanonical,
          numberOfEpisodes: categoryCapitulos.length,
          partOfSeries: {
            "@type": "TVSeries",
            name: "Los Simpsons",
            url: siteUrl,
          },
        }
      : null;

    const seasonFaqSchema = seasonData
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: seasonData.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

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
        {tvSeasonSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(tvSeasonSchema) }}
          />
        )}
        {seasonFaqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(seasonFaqSchema) }}
          />
        )}
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
