import SearchClient from "@/components/SearchClient";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-static";

export const metadata = {
  title: "Buscar capitulos de Los Simpsons",
  description:
    "Busca capitulos de Los Simpsons online por titulo, temporada o numero de episodio en espanol latino.",
  alternates: {
    canonical: "/buscar/",
  },
};

export default function BuscarPage() {
  return (
    <main>
      <SiteHeader />
      <section
        id="contenido"
        className="border-b border-db-gold/30 bg-[linear-gradient(135deg,#101010_0%,#1c1c11_48%,#003b63_100%)] px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-wide text-db-gold">Buscador</p>
          <h1 className="mt-2 text-4xl font-black uppercase text-white sm:text-6xl">
            Buscar capitulos de Los Simpsons
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold text-zinc-200">
            Encuentra episodios por temporada, numero o titulo sin cargar todo el catalogo en la portada.
          </p>
        </div>
      </section>
      <SearchClient />
      <SiteFooter />
    </main>
  );
}
