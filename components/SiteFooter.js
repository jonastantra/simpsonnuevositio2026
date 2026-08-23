import { menuItems, utilityPages } from "@/lib/site";

export default function SiteFooter() {
  const seasons = Array.from({ length: 34 }, (_, i) => i + 1);

  return (
    <footer className="border-t border-white/10 bg-db-black px-4 py-12 text-sm text-zinc-400 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Seasons directory */}
        <div className="mb-10 border-b border-white/10 pb-8">
          <p className="mb-3 text-xs font-black uppercase tracking-wider text-db-gold">
            Directorio de Temporadas en Streaming
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {seasons.map((num) => (
              <a
                key={num}
                href={`/category/temporada-${num}/`}
                className="rounded border border-white/10 bg-white/[0.03] px-2.5 py-1 font-bold text-zinc-300 transition hover:border-db-gold hover:bg-db-gold/10 hover:text-db-gold"
              >
                T{num}
              </a>
            ))}
            <a
              href="/category/especiales/"
              className="rounded border border-white/10 bg-white/[0.03] px-2.5 py-1 font-bold text-zinc-300 transition hover:border-db-gold hover:bg-db-gold/10 hover:text-db-gold"
            >
              Especiales
            </a>
            <a
              href="/category/peliculas/"
              className="rounded border border-white/10 bg-white/[0.03] px-2.5 py-1 font-bold text-zinc-300 transition hover:border-db-gold hover:bg-db-gold/10 hover:text-db-gold"
            >
              Películas
            </a>
            <a
              href="/blog/"
              className="rounded border border-white/10 bg-white/[0.03] px-2.5 py-1 font-bold text-zinc-300 transition hover:border-db-gold hover:bg-db-gold/10 hover:text-db-gold"
            >
              Blog
            </a>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-lg font-black text-white">
              <span className="text-db-gold">Los Simpsons</span> Online
            </p>
            <p className="mt-3 max-w-2xl text-xs leading-6 text-zinc-400">
              Tu portal para ver todas las temporadas de Los Simpsons online en streaming en español latino HD.
              Todos los episodios organizados de forma cronológica para una visualización rápida.
              Los Simpsons es una marca registrada de 20th Century Studios y Fox Broadcasting Company.
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs">
              <a href="/sitemap.xml" className="text-zinc-500 hover:text-db-gold">
                Sitemap XML
              </a>
              <span className="text-zinc-700">•</span>
              <a href="/video-sitemap.xml" className="text-zinc-500 hover:text-db-gold">
                Video Sitemap
              </a>
              <span className="text-zinc-700">•</span>
              <a href="/feed.xml" className="text-zinc-500 hover:text-db-gold">
                RSS Feed
              </a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:text-right">
            <div>
              <h2 className="mb-3 font-black uppercase text-white">Navegación</h2>
              <div className="flex flex-wrap gap-3 md:justify-end">
                {menuItems.map((item) => (
                  <a key={item.href} href={item.href} className="font-bold hover:text-db-gold">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h2 className="mb-3 font-black uppercase text-white">Información</h2>
              <div className="flex flex-wrap gap-3 md:justify-end">
                {utilityPages.slice(1).map((page) => (
                  <a key={page.path} href={page.path} className="font-bold hover:text-db-gold">
                    {page.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
