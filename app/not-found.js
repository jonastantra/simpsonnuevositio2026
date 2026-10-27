import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
export const metadata={title:'Página no encontrada',alternates:{canonical:null},robots:{index:false,follow:true}};
export default function NotFound(){return <main><SiteHeader /><section className="shell not-found" id="contenido"><strong aria-hidden="true">D’OH!</strong><span className="eyebrow">ERROR 404 · NOS SALIMOS DE SPRINGFIELD</span><h1>Por aquí no era.</h1><p>Esta página no existe, pero hay muchas historias esperando en el archivo.</p><a className="button button-ink" href="/">Volver al inicio</a><a className="button button-outline" href="/buscar/">Buscar un capítulo →</a></section><SiteFooter /></main>}
