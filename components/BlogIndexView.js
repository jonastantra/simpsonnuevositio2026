import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function BlogIndexView({ articles = [] }) {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section
        id="contenido"
        className="border-b border-db-gold/40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,217,15,.24),transparent_34%),linear-gradient(135deg,#0b0b0b_0%,#101820_55%,#003b63_100%)] px-4 py-16 text-center sm:px-6 lg:px-8"
      >
        <p className="mb-3 text-sm font-black uppercase tracking-wide text-db-gold">
          Springfield al detalle
        </p>
        <h1 className="site-hero-title mx-auto max-w-5xl text-4xl font-black uppercase text-white sm:text-6xl">
          Blog de Los Simpsons
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold text-white/90">
          Curiosidades, análisis de episodios, predicciones cumplidas, secretos de producción y guías de streaming.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase text-db-gold">Artículos destacados</p>
            <h2 className="mt-1 text-3xl font-black text-white">{articles.length} Artículos informativos</h2>
          </div>
          <a
            href="/temporadas/"
            className="focus-ring rounded-md border border-white/10 px-4 py-2 font-bold text-white hover:border-db-gold"
          >
            Ver Temporadas
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <article
              key={article.slug}
              className={`group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-db-panel transition duration-300 hover:-translate-y-1.5 hover:border-db-gold hover:shadow-glow ${
                index === 0 ? "sm:col-span-2 lg:col-span-2" : ""
              }`}
            >
              <a href={article.path} className="block aspect-[16/9] overflow-hidden bg-zinc-950">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    loading={index < 3 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#ffd90f,#0088cc)] p-4 text-center text-xl font-black text-black">
                    Los Simpsons
                  </div>
                )}
              </a>

              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-md bg-db-gold/15 border border-db-gold/30 px-2.5 py-0.5 text-[11px] font-black uppercase text-db-gold">
                      {article.tags?.[0] || "Blog"}
                    </span>
                    <span className="text-xs font-semibold text-zinc-400">• {article.readTime || "5 min"}</span>
                  </div>

                  <h2 className={`font-black text-white group-hover:text-db-gold ${index === 0 ? "text-xl sm:text-2xl" : "text-lg"}`}>
                    <a href={article.path}>{article.title}</a>
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-zinc-400">
                  <span>{article.author || "Los Simpsons Online"}</span>
                  <a href={article.path} className="font-bold text-db-gold hover:underline">
                    Leer artículo →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
