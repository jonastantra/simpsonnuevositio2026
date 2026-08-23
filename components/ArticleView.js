import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { absoluteImageUrl, absoluteUrl, episodeHref } from "@/lib/site";

export default function ArticleView({ article, relatedEpisodes = [], allArticles = [] }) {
  const otherArticles = allArticles.filter((item) => item.slug !== article.slug).slice(0, 4);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav className="text-sm font-semibold text-zinc-400" aria-label="Breadcrumb">
          <a className="hover:text-db-gold" href="/">
            Inicio
          </a>
          <span className="mx-2 text-zinc-600">/</span>
          <a className="hover:text-db-gold" href="/blog/">
            Blog
          </a>
          <span className="mx-2 text-zinc-600">/</span>
          <span className="text-zinc-200 line-clamp-1">{article.title}</span>
        </nav>
      </div>

      <article id="contenido" className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {(article.tags || ["Blog", "Los Simpsons"]).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-db-gold/15 border border-db-gold/30 px-3 py-1 text-xs font-black uppercase text-db-gold"
              >
                {tag}
              </span>
            ))}
            <span className="text-xs font-bold text-zinc-400">• Lectura {article.readTime || "5 min"}</span>
          </div>

          <h1 className="text-3xl font-black leading-tight text-white sm:text-5xl">
            {article.title}
          </h1>

          <p className="mt-4 text-lg font-medium leading-relaxed text-zinc-300">
            {article.excerpt}
          </p>

          <div className="mt-6 flex items-center justify-between border-y border-white/10 py-4 text-sm text-zinc-400">
            <span>Por <strong className="text-white">{article.author || "Los Simpsons Online"}</strong></span>
            <time dateTime={article.date}>{article.date || "2026-05-20"}</time>
          </div>
        </header>

        {article.image && (
          <div className="mb-10 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl">
            <img
              src={article.image}
              alt={article.title}
              className="h-auto w-full max-h-[480px] object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        )}

        <div
          className="article-body space-y-6 text-base leading-8 text-zinc-200 sm:text-lg [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-white [&_h2]:sm:text-3xl [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-black [&_h3]:text-db-gold [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_li]:text-zinc-300 [&_strong]:text-white [&_em]:text-db-gold [&_em]:not-italic"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {relatedEpisodes.length > 0 && (
          <section className="mt-14 rounded-xl border border-db-gold/40 bg-gradient-to-b from-[#1c1404] to-db-panel p-6 shadow-glow">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase text-db-gold">Streaming disponible</p>
                <h2 className="text-2xl font-black text-white">Ver episodios relacionados</h2>
              </div>
              <a
                href="/temporadas/"
                className="focus-ring rounded-md border border-white/10 px-3 py-1.5 text-xs font-bold text-white hover:border-db-gold"
              >
                Todas las temporadas
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {relatedEpisodes.slice(0, 4).map((cap) => (
                <a
                  key={cap.slug}
                  href={episodeHref(cap)}
                  className="group overflow-hidden rounded-lg border border-white/10 bg-db-panel2 transition hover:-translate-y-1 hover:border-db-gold"
                >
                  <div className="aspect-video bg-zinc-950">
                    {cap.imagen ? (
                      <img
                        src={cap.imagen}
                        alt={cap.tituloLimpio || cap.titulo}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-bold text-zinc-400">
                        Los Simpsons
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-[10px] font-black uppercase text-db-gold">
                      T{cap.temporada} - E{cap.numero}
                    </p>
                    <p className="line-clamp-2 text-xs font-bold text-white group-hover:text-db-gold">
                      {cap.tituloLimpio || cap.titulo}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {otherArticles.length > 0 && (
          <section className="mt-14 border-t border-white/10 pt-10">
            <h2 className="mb-6 text-2xl font-black text-white">Más artículos y curiosidades</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {otherArticles.map((item) => (
                <a
                  key={item.slug}
                  href={item.path}
                  className="group block rounded-lg border border-white/10 bg-db-panel p-4 transition hover:-translate-y-1 hover:border-db-gold"
                >
                  <p className="text-xs font-black uppercase text-db-gold">{item.readTime || "5 min"} de lectura</p>
                  <h3 className="mt-1 font-bold text-white group-hover:text-db-gold">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">{item.excerpt}</p>
                </a>
              ))}
            </div>
          </section>
        )}
      </article>
      <SiteFooter />
    </main>
  );
}
