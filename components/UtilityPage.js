import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import capitulos from "@/data/capitulos.json";
import { categoryPages, getCategoryCapitulos } from "@/lib/site";
export default function UtilityPage({ page }) {
  const directory = page.path === "/temporadas/";
  const texts = {
    "/politica-de-privacidad/": "Este sitio utiliza Google Tag Manager y Google AdSense. Estos servicios y los reproductores externos pueden tratar datos de navegación y utilizar cookies conforme a sus propias políticas. Puedes administrar las cookies desde la configuración de tu navegador y consultar las políticas de Google en policies.google.com/privacy.",
    "/terminos-y-condiciones/": "Este sitio ofrece un catálogo de títulos y sinopsis de Los Simpsons y enlaces a reproductores externos cuando están disponibles. La disponibilidad de cada fuente puede cambiar. No se garantiza una resolución, continuidad o disponibilidad específica de los videos externos.",
    "/aviso-legal/": "Este es un sitio de aficionados, no un sitio oficial de Los Simpsons, Disney o sus titulares. Las marcas, imágenes y personajes pertenecen a sus respectivos propietarios. Los reproductores enlazados son servicios externos al sitio.",
    "/contacto/": "Para identificar un problema, conserva la dirección de la ficha, la opción de reproductor y una descripción del error. Por ahora no hay un formulario de contacto habilitado en este sitio.",
  };
  return <main className="min-h-screen">
    <SiteHeader />
    <section id="contenido" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-white">{directory ? "Temporadas de Los Simpsons: guía de capítulos" : page.title}</h1>
      {directory ? <>
        <p className="mt-6 leading-8 text-zinc-300">Explora las temporadas 1 a 34. El directorio reúne {capitulos.filter(item => item.temporada > 0 && item.temporada < 999).length} fichas. Cada temporada muestra sus títulos, sinopsis y cuántos capítulos tienen reproductor.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryPages.filter(category => category.temporada).map(category => {
            const episodes = getCategoryCapitulos(category);
            return <a key={category.path} href={category.path} className="focus-ring rounded-lg border border-white/10 bg-db-panel p-5 hover:border-db-gold"><h2 className="text-xl font-black text-white">{category.title}</h2><p className="mt-2 text-sm text-zinc-300">{episodes.length} fichas · {episodes.filter(item => item.players?.length).length} con reproductor</p></a>;
          })}
        </div>
      </> : <p className="mt-6 rounded-lg border border-white/10 bg-db-panel p-6 leading-8 text-zinc-300">{texts[page.path] || page.description}</p>}
      <a href="/buscar/" className="focus-ring mt-8 inline-block rounded bg-db-gold px-5 py-3 font-bold text-black">Buscar un capítulo</a>
    </section>
    <SiteFooter />
  </main>;
}
