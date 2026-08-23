import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function NotFound() {
  const topSeasons = [
    { num: 1, label: "Temporada 1", href: "/category/temporada-1/" },
    { num: 3, label: "Temporada 3", href: "/category/temporada-3/" },
    { num: 4, label: "Temporada 4 (Época Dorada)", href: "/category/temporada-4/" },
    { num: 5, label: "Temporada 5", href: "/category/temporada-5/" },
    { num: 6, label: "Temporada 6", href: "/category/temporada-6/" },
    { num: 8, label: "Temporada 8", href: "/category/temporada-8/" },
  ];

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-wide text-db-gold">Error 404</p>
        <h1 className="site-hero-title mt-2 text-5xl font-black uppercase text-white sm:text-7xl">
          ¡D'OH! PÁGINA NO ENCONTRADA
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg font-medium text-zinc-300">
          Parece que Homero presionó el botón incorrecto en la planta nuclear y este capítulo o página no existe.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/"
            className="focus-ring rounded-lg bg-db-gold px-6 py-3 font-black uppercase text-black transition hover:bg-yellow-400"
          >
            Ir al Inicio
          </a>
          <a
            href="/buscar/"
            className="focus-ring rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-bold text-white transition hover:border-db-gold hover:text-db-gold"
          >
            Buscar capítulos
          </a>
        </div>

        <div className="mt-14 rounded-xl border border-white/10 bg-db-panel p-6 text-left">
          <h2 className="text-xl font-black text-white">Temporadas populares para ver ahora</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topSeasons.map((s) => (
              <a
                key={s.num}
                href={s.href}
                className="group block rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm font-bold text-zinc-200 transition hover:border-db-gold hover:bg-db-gold/10 hover:text-db-gold"
              >
                ⭐ {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
