import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import PlayerTabs from "@/components/PlayerTabs";
import { absoluteUrl, episodeHref } from "@/lib/site";

export default function EpisodeView({ capitulo, capitulos }) {
  const sameSeason = capitulos.filter((item) => item.categoriaSlug === capitulo.categoriaSlug);
  const index = sameSeason.findIndex((item) => item.slug === capitulo.slug);
  const anterior = index > 0 ? sameSeason[index - 1] : null;
  const siguiente = index < sameSeason.length - 1 ? sameSeason[index + 1] : null;
  const relacionados = sameSeason.filter((item) => item.slug !== capitulo.slug).slice(0, 6);
  const displayTitle = capitulo.tituloLimpio || capitulo.titulo;
  const episodeNumber = capitulo.numero === 9999 ? index + 1 : capitulo.numero;
  const episodeLabel =
    capitulo.temporada && capitulo.temporada !== 999
      ? `Temporada ${capitulo.temporada} - Capitulo ${episodeNumber}`
      : capitulo.categoria;

  const currentUrl = absoluteUrl(episodeHref(capitulo));
  const shareText = encodeURIComponent(`Ver Los Simpsons - ${displayTitle} (${episodeLabel}) Online en Espanol Latino`);
  const encodedUrl = encodeURIComponent(currentUrl);

  const episodeFaqs = [
    {
      q: `¿Cómo ver ${displayTitle} online en español latino?`,
      a: `Puedes reproducir ${displayTitle} directamente en nuestro reproductor web en streaming HD con audio en español latino clásico sin cortes ni registros.`,
    },
    {
      q: `¿A qué temporada pertenece el capítulo ${displayTitle}?`,
      a: `Este capítulo pertenece a ${capitulo.categoria || `la Temporada ${capitulo.temporada}`} de Los Simpsons (episodio número ${episodeNumber}).`,
    },
    {
      q: `¿De qué trata este capítulo de Los Simpsons?`,
      a: `${capitulo.descripcion}`,
    },
    {
      q: `¿En qué calidad de video está disponible?`,
      a: `El episodio está optimizado en streaming de alta definición (HD 720p / 1080p) con reproducción fluida para dispositivos móviles y computadoras.`,
    },
  ];

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <article id="contenido" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm font-semibold text-zinc-400" aria-label="Breadcrumb">
          <a className="hover:text-db-gold" href="/">
            Inicio
          </a>
          <span className="mx-2 text-zinc-600">/</span>
          <a className="hover:text-db-gold" href={`/category/${capitulo.categoriaSlug}/`}>
            {capitulo.categoria}
          </a>
          <span className="mx-2 text-zinc-600">/</span>
          <span className="text-zinc-300">{displayTitle}</span>
        </nav>

        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-db-gold px-3 py-1 text-xs font-black uppercase tracking-wide text-black">
                {episodeLabel}
              </span>
              <span className="rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-bold text-zinc-300">
                ⏱ 22 min
              </span>
              <span className="rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-bold text-zinc-300">
                🔊 Español Latino
              </span>
              <span className="rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-bold text-zinc-300">
                📺 Calidad HD
              </span>
            </div>
            <h1 className="max-w-5xl text-3xl font-black leading-tight text-white sm:text-5xl">
              {displayTitle}
            </h1>
          </div>
          <p className="max-w-sm text-sm font-semibold text-zinc-400 lg:text-right">
            {capitulo.titulo}
          </p>
        </div>

        <section className="rounded-lg border border-white/10 bg-db-panel p-2 shadow-card sm:p-4">
          <PlayerTabs
            players={capitulo.players?.length ? capitulo.players : [{ label: "Opcion 1", embed: capitulo.iframe }]}
            coverImage={capitulo.imagen}
            title={displayTitle}
          />
        </section>

        {/* Share buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-xs">
          <span className="font-bold text-zinc-300">Compartir este capítulo:</span>
          <div className="flex flex-wrap items-center gap-2 font-bold">
            <a
              href={`https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-[#25D366]/20 border border-[#25D366]/40 px-3 py-1 text-[#25D366] hover:bg-[#25D366]/30"
            >
              WhatsApp
            </a>
            <a
              href={`https://t.me/share/url?url=${encodedUrl}&text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-[#0088cc]/20 border border-[#0088cc]/40 px-3 py-1 text-[#0088cc] hover:bg-[#0088cc]/30"
            >
              Telegram
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-white/10 border border-white/20 px-3 py-1 text-white hover:bg-white/20"
            >
              X / Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-[#1877F2]/20 border border-[#1877F2]/40 px-3 py-1 text-[#1877F2] hover:bg-[#1877F2]/30"
            >
              Facebook
            </a>
          </div>
        </div>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-2xl font-black text-white">Sinopsis del capitulo</h2>
            <p className="mt-3 leading-8 text-zinc-300">{capitulo.descripcion}</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-2xl font-black text-white">Enlaces de descarga</h2>
            {capitulo.links?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {capitulo.links.map((link, linkIndex) => (
                  <a
                    key={`${link.url}-${linkIndex}`}
                    href={link.url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="focus-ring rounded-md border border-db-orange/45 px-4 py-2 text-sm font-black text-db-gold transition hover:border-db-gold hover:bg-db-orange hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-3 leading-8 text-zinc-400">
                Las descargas externas disponibles se agregan automaticamente desde la migracion.
              </p>
            )}
          </div>
        </section>

        {/* FAQs Section */}
        <section className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-2xl font-black text-white">Preguntas frecuentes sobre este capítulo</h2>
          <div className="mt-4 space-y-3">
            {episodeFaqs.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-md border border-white/10 bg-db-panel p-3.5 transition open:border-db-gold/40"
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
        </section>

        <nav className="mt-6 grid gap-3 md:grid-cols-2" aria-label="Navegacion de capitulos">
          {anterior ? (
            <a
              href={episodeHref(anterior)}
              className="focus-ring rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-db-gold hover:bg-db-gold/10"
            >
              <span className="text-xs font-black uppercase text-db-gold">Anterior</span>
              <p className="mt-1 line-clamp-2 font-bold text-white">{anterior.tituloLimpio || anterior.titulo}</p>
            </a>
          ) : (
            <div />
          )}
          {siguiente && (
            <a
              href={episodeHref(siguiente)}
              className="focus-ring rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-db-gold hover:bg-db-gold/10 md:text-right"
            >
              <span className="text-xs font-black uppercase text-db-gold">Siguiente</span>
              <p className="mt-1 line-clamp-2 font-bold text-white">{siguiente.tituloLimpio || siguiente.titulo}</p>
            </a>
          )}
        </nav>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">Mas capitulos de esta temporada</h2>
            <a
              href={`/category/${capitulo.categoriaSlug}/`}
              className="focus-ring rounded-md border border-white/10 px-3 py-1.5 text-xs font-bold text-white hover:border-db-gold"
            >
              Ver {capitulo.categoria || "Temporada"} completa
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {relacionados.map((item) => (
              <a
                key={item.slug}
                href={episodeHref(item)}
                className="group overflow-hidden rounded-lg border border-white/10 bg-db-panel2 transition hover:-translate-y-1 hover:border-db-gold"
              >
                <div className="aspect-video bg-zinc-950">
                  {item.imagen ? (
                    <img
                      src={item.imagen}
                      alt={item.tituloLimpio || item.titulo}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#151515,#2d1608)] px-2 text-center text-xs font-black uppercase text-db-gold">
                      Los Simpsons
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-bold text-white">{item.tituloLimpio || item.titulo}</h3>
                </div>
              </a>
            ))}
          </div>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
