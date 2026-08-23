import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import capitulos from "@/data/capitulos.json";
import { absoluteUrl, episodeHref, getArticles, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

const seasonPremieres = {
  1: "Dic. 17, 1989",
  2: "Oct. 11, 1990",
  3: "Sep. 19, 1991",
  4: "Sep. 24, 1992",
  5: "Sep. 30, 1993",
  6: "Sep. 04, 1994",
  7: "Sep. 17, 1995",
  8: "Oct. 27, 1996",
  9: "Sep. 21, 1997",
  10: "Ago. 23, 1998",
  11: "Sep. 26, 1999",
  12: "Nov. 01, 2000",
  13: "Nov. 06, 2001",
  14: "Nov. 03, 2002",
  15: "Nov. 02, 2003",
  16: "Nov. 07, 2004",
  17: "Sep. 11, 2005",
  18: "Sep. 10, 2006",
  19: "Sep. 23, 2007",
  20: "Sep. 28, 2008",
  21: "Sep. 27, 2009",
  22: "Sep. 26, 2010",
  23: "Sep. 25, 2011",
  24: "Sep. 30, 2012",
  25: "Sep. 29, 2013",
  26: "Sep. 28, 2014",
  27: "Sep. 27, 2015",
  28: "Sep. 25, 2016",
  29: "Oct. 01, 2017",
  30: "Sep. 30, 2018",
  31: "Sep. 29, 2019",
  32: "Sep. 27, 2020",
  33: "Sep. 26, 2021",
  34: "Sep. 25, 2022",
};

const homeFaqs = [
  {
    q: "¿Dónde ver todas las temporadas de Los Simpsons en español latino?",
    a: "En Los Simpsons Online puedes ver todas las 34 temporadas completas y más de 800 episodios en streaming en español latino clásico con alta calidad de video y sin costo.",
  },
  {
    q: "¿Cuántas temporadas y capítulos tiene la serie Los Simpsons?",
    a: "Los Simpsons cuenta con 34 temporadas completas y más de 800 episodios emitidos, además de películas y especiales de Halloween (La Casita del Horror).",
  },
  {
    q: "¿Qué temporadas corresponden a la Época Dorada de Los Simpsons?",
    a: "La aclamada Época Dorada abarca desde la Temporada 3 hasta la Temporada 8, periodo en el que se produjeron obras maestras como 'Marge contra el monorriel', 'Última salida a Springfield' y 'Cabo de miedosos'.",
  },
  {
    q: "¿Puedo ver los episodios desde mi teléfono móvil?",
    a: "Sí, todos los reproductores y páginas están optimizados para teléfonos inteligentes, tablets y computadoras de escritorio para una reproducción rápida.",
  },
  {
    q: "¿Quiénes hacen las voces en español latino de Los Simpsons?",
    a: "El doblaje histórico fue liderado por Humberto Vélez (Homero), Nancy MacKenzie (Marge), Marina Huerta y Claudia Motta (Bart), Patricia Acevedo (Lisa) y Gabriel Chávez (Sr. Burns).",
  },
];

function seasonSummary(number, episodes) {
  const seasonEpisodes = episodes.filter((capitulo) => capitulo.temporada === number);
  const poster =
    seasonEpisodes.find((capitulo) => capitulo.imagen && capitulo.numero && capitulo.numero > 3)?.imagen ||
    seasonEpisodes.find((capitulo) => capitulo.imagen)?.imagen ||
    "";

  return {
    number,
    count: seasonEpisodes.length,
    href: `/category/temporada-${number}/`,
    poster,
    premiere: seasonPremieres[number] || "",
  };
}

export default function HomePage() {
  const total = capitulos.length;
  const episodes = capitulos.filter((capitulo) => capitulo.temporada && capitulo.temporada !== 999);
  const featured = episodes.filter((capitulo) => capitulo.imagen).slice(0, 6);
  const articles = getArticles().slice(0, 6);
  const seasons = Array.from({ length: 34 }, (_, index) => seasonSummary(index + 1, episodes))
    .filter((season) => season.count > 0)
    .reverse();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Temporadas de Los Simpsons Online",
    numberOfItems: seasons.length,
    itemListElement: seasons.map((season, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(season.href),
      name: `Los Simpsons temporada ${season.number}`,
    })),
  };

  const tvSeriesSchema = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: "Los Simpsons",
    alternateName: ["The Simpsons", "Los Simpson en espanol latino", "Los Simpson Streaming"],
    url: siteUrl,
    image: `${siteUrl}/uploads/2024/07/11200.jpg`,
    description: "Serie de animacion y comedia que sigue las aventuras satíricas de la familia Simpson en la ciudad de Springfield.",
    creator: {
      "@type": "Person",
      name: "Matt Groening",
    },
    genre: ["Animacion", "Comedia", "Sitcom", "Streaming"],
    inLanguage: "es-MX",
    numberOfSeasons: 34,
    numberOfEpisodes: episodes.length,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "18450",
      bestRating: "5",
      worstRating: "1",
    },
    containsSeason: seasons.map((s) => ({
      "@type": "TVSeason",
      seasonNumber: s.number,
      url: absoluteUrl(s.href),
      name: `Temporada ${s.number}`,
      numberOfEpisodes: s.count,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tvSeriesSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SiteHeader />

      <section
        id="contenido"
        className="border-b border-white/10 bg-[linear-gradient(135deg,#ffd90f_0%,#0088cc_100%)] px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-wide text-black/75">
              Springfield por temporadas
            </p>
            <h1 className="site-hero-title max-w-4xl text-4xl font-black uppercase text-white sm:text-6xl">
              Ver Los Simpsons Online
            </h1>
            <p className="mt-4 max-w-2xl text-lg font-semibold text-white/95">
              Todas las 34 temporadas completas ordenadas en streaming rápido. Disfruta de más de 800 episodios en español latino clásico en alta definición HD.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-black/10 bg-black/25 p-4">
              <p className="text-3xl font-black text-white">{episodes.length}</p>
              <p className="mt-1 text-xs font-black uppercase text-white/80">Capitulos</p>
            </div>
            <div className="rounded-lg border border-black/10 bg-black/25 p-4">
              <p className="text-3xl font-black text-white">{seasons.length}</p>
              <p className="mt-1 text-xs font-black uppercase text-white/80">Temporadas</p>
            </div>
            <div className="rounded-lg border border-black/10 bg-black/25 p-4">
              <p className="text-3xl font-black text-white">{capitulos.filter((item) => item.players?.length).length}</p>
              <p className="mt-1 text-xs font-black uppercase text-white/80">Con video</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seasons Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-db-gold">Temporadas</p>
            <h2 className="mt-2 text-3xl font-black text-white">Elige una temporada</h2>
          </div>
          <a href="/buscar/" className="focus-ring rounded-md border border-white/10 px-4 py-2 font-bold hover:border-db-gold">
            Buscar capitulo
          </a>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {seasons.map((season) => (
            <a
              key={season.number}
              href={season.href}
              className="focus-ring group block"
            >
              <span className="block overflow-hidden rounded-lg border border-white/10 bg-db-panel2 shadow-card transition duration-200 group-hover:-translate-y-1 group-hover:border-db-gold group-hover:shadow-glow">
                <span className="block aspect-[4/5] bg-zinc-950">
                  {season.poster ? (
                    <img
                      src={season.poster}
                      alt={`Los Simpsons temporada ${season.number}`}
                      loading={season.number >= 29 ? "eager" : "lazy"}
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#ffd90f,#0088cc)] p-4 text-center text-3xl font-black text-black">
                      T{season.number}
                    </span>
                  )}
                </span>
              </span>
              <span className="mt-3 block text-lg font-black text-white group-hover:text-db-gold">
                Temporada {season.number}
              </span>
              <span className="mt-1 block text-sm font-semibold text-zinc-400">
                {season.premiere || `${season.count} capitulos`} - {season.count} capitulos
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Episodes */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-db-gold">Para empezar</p>
            <h2 className="mt-2 text-3xl font-black text-white">Capitulos destacados</h2>
          </div>
          <a href="/category/temporada-1/" className="focus-ring rounded-md border border-white/10 px-4 py-2 font-bold hover:border-db-gold">
            Temporada 1
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((capitulo, index) => (
            <a
              key={capitulo.slug}
              href={episodeHref(capitulo)}
              className={`group overflow-hidden rounded-lg border border-white/10 bg-db-panel shadow-card transition hover:-translate-y-1 hover:border-db-gold ${
                index === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <div className="aspect-video bg-zinc-950">
                <img
                  src={capitulo.imagen}
                  alt={capitulo.tituloLimpio || capitulo.titulo}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
              <div className="p-3">
                <p className="text-xs font-black uppercase text-db-gold">
                  T{capitulo.temporada} - E{capitulo.numero}
                </p>
                <h2 className="mt-1 line-clamp-2 text-sm font-bold text-white">{capitulo.tituloLimpio || capitulo.titulo}</h2>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Blog and SEO Articles */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-db-gold">Artículos y guías</p>
            <h2 className="mt-2 text-3xl font-black text-white">Blog de Los Simpsons</h2>
          </div>
          <a href="/blog/" className="focus-ring rounded-md border border-white/10 px-4 py-2 font-bold hover:border-db-gold">
            Ver todos los artículos
          </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((art) => (
            <a
              key={art.slug}
              href={art.path}
              className="group flex flex-col justify-between rounded-lg border border-white/10 bg-db-panel p-5 transition hover:-translate-y-1 hover:border-db-gold hover:shadow-glow"
            >
              <div>
                <p className="text-xs font-black uppercase text-db-gold">{art.tags?.[0] || "Blog"} • {art.readTime}</p>
                <h3 className="mt-2 font-black text-white group-hover:text-db-gold">{art.title}</h3>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">{art.excerpt}</p>
              </div>
              <span className="mt-4 inline-block text-xs font-bold text-db-gold">Leer más →</span>
            </a>
          ))}
        </div>
      </section>

      {/* Editorial Guide & FAQs for Google Authority */}
      <section className="border-t border-white/10 bg-db-panel py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-db-gold">Guía Completa</p>
              <h2 className="mt-2 text-3xl font-black text-white">
                La Guía Definitiva para ver Los Simpsons Online
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-zinc-300">
                <p>
                  Creada por <strong>Matt Groening</strong> y desarrollada junto a James L. Brooks y Sam Simon, <strong>Los Simpsons</strong> es la serie de comedia animada más influyente y premiada en la historia de la televisión mundial. Desde su debut en 1989, la familia amarilla de la Avenida Siempreviva 742 ha entretenido a múltiples generaciones con su sátira aguda de la vida cotidiana, la política y la cultura pop.
                </p>
                <p>
                  En nuestra plataforma tienes acceso inmediato a todas las <strong>34 temporadas completas</strong> con más de <strong>800 capítulos en audio español latino clásico</strong>. Explora la Época Dorada (Temporadas 3 a 8), los especiales legendarios de Halloween (<em>La Casita del Horror</em>), las películas y los episodios más recientes en streaming optimizado para computadoras y móviles.
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-db-gold">Preguntas Frecuentes</p>
              <h2 className="mt-2 text-3xl font-black text-white">
                Preguntas frecuentes
              </h2>
              <div className="mt-6 space-y-3">
                {homeFaqs.map((faq, idx) => (
                  <details
                    key={idx}
                    className="group rounded-lg border border-white/10 bg-white/[0.03] p-4 transition open:border-db-gold/40 open:bg-white/[0.06]"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-white group-open:text-db-gold">
                      <span>{faq.q}</span>
                      <span className="ml-2 transition-transform group-open:rotate-180">▾</span>
                    </summary>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
