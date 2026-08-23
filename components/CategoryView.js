import CapituloGrid from "@/components/CapituloGrid";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import seasonsInfo from "@/data/seasons-info.json";

export default function CategoryView({ category, capitulos }) {
  const isSeason = Boolean(category.temporada && category.temporada !== 999 && category.temporada !== 0);
  const seasonNum = category.temporada;
  const seasonData = isSeason ? seasonsInfo[String(seasonNum)] : null;
  const categoryLabel = isSeason ? `Temporada ${seasonNum}` : category.title;

  const prevSeason = isSeason && seasonNum > 1 ? seasonNum - 1 : null;
  const nextSeason = isSeason && seasonNum < 34 ? seasonNum + 1 : null;

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav className="text-sm font-semibold text-zinc-400" aria-label="Breadcrumb">
          <a className="hover:text-db-gold" href="/">
            Inicio
          </a>
          <span className="mx-2 text-zinc-600">/</span>
          <a className="hover:text-db-gold" href="/temporadas/">
            Temporadas
          </a>
          <span className="mx-2 text-zinc-600">/</span>
          <span className="text-zinc-200">{categoryLabel}</span>
        </nav>
      </div>

      <section
        id="contenido"
        className="border-b border-db-gold/40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,217,15,.24),transparent_34%),linear-gradient(135deg,#0b0b0b_0%,#101820_55%,#003b63_100%)] px-4 py-16 text-center sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-sm font-black uppercase tracking-wide text-db-gold">
            Los Simpsons Streaming HD
          </p>
          <h1 className="site-hero-title text-4xl font-black uppercase text-white sm:text-6xl">
            {category.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold text-white/90">
            {category.description}
          </p>

          {seasonData && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
              <span className="rounded-full border border-db-gold/40 bg-db-gold/15 px-3 py-1 text-db-gold">
                Emisión: {seasonData.year}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-zinc-200">
                {capitulos.length} Episodios Completos
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-zinc-200">
                Audio: Español Latino
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-zinc-200">
                Calidad: HD 1080p / 720p
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Season Navigation Top */}
      {isSeason && (
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            {prevSeason ? (
              <a
                href={`/category/temporada-${prevSeason}/`}
                className="focus-ring rounded-lg border border-white/10 bg-db-panel px-4 py-2 text-xs font-black uppercase text-white transition hover:border-db-gold hover:text-db-gold"
              >
                ← Temporada {prevSeason}
              </a>
            ) : (
              <div />
            )}
            <span className="text-xs font-black uppercase tracking-wider text-db-gold">
              Temporada {seasonNum} de 34
            </span>
            {nextSeason ? (
              <a
                href={`/category/temporada-${nextSeason}/`}
                className="focus-ring rounded-lg border border-white/10 bg-db-panel px-4 py-2 text-xs font-black uppercase text-white transition hover:border-db-gold hover:text-db-gold"
              >
                Temporada {nextSeason} →
              </a>
            ) : (
              <div />
            )}
          </div>
        </div>
      )}

      {/* Episode Grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-db-orange">
              {capitulos.length} capitulos en audio latino
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">Todos los episodios</h2>
          </div>
          <a className="focus-ring rounded-md border border-white/10 px-4 py-2 font-bold hover:border-db-gold" href="/">
            Inicio
          </a>
        </div>
        <CapituloGrid capitulos={capitulos} />
      </section>

      {/* Season Editorial Details & FAQs for SEO */}
      {seasonData && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-xl border border-white/10 bg-db-panel p-6 shadow-card">
              <h2 className="text-2xl font-black text-white">
                Guía y sinopsis de {categoryLabel}
              </h2>
              <p className="mt-4 text-base leading-8 text-zinc-300">
                {seasonData.synopsis}
              </p>

              {seasonData.curiosity && (
                <div className="mt-6 rounded-lg border border-db-gold/30 bg-db-gold/10 p-4">
                  <p className="text-xs font-black uppercase text-db-gold">Dato curioso de esta temporada</p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-zinc-200">
                    {seasonData.curiosity}
                  </p>
                </div>
              )}

              {seasonData.bestEpisodes?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-black uppercase text-db-gold">Capítulos destacados recomendados</h3>
                  <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                    {seasonData.bestEpisodes.map((ep) => (
                      <li key={ep} className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-zinc-200">
                        ⭐ {ep}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* FAQs Accordion */}
            <div className="rounded-xl border border-white/10 bg-db-panel p-6 shadow-card">
              <h2 className="text-2xl font-black text-white">
                Preguntas frecuentes
              </h2>
              <div className="mt-4 space-y-4">
                {seasonData.faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    className="group rounded-lg border border-white/10 bg-white/[0.03] p-4 transition open:border-db-gold/40 open:bg-white/[0.06]"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-white group-open:text-db-gold">
                      <span>{faq.question}</span>
                      <span className="ml-2 transition-transform group-open:rotate-180">▾</span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
