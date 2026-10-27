import SearchClient from '@/components/SearchClient';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
export const dynamic='force-static';
export const metadata={title:'Buscar capítulos de Los Simpsons',description:'Encuentra capítulos de Los Simpsons por título, personaje, temporada o número de episodio.',alternates:{canonical:'/buscar/'},robots:{index:false,follow:true}};
export default function Page(){return <main><SiteHeader /><section className="shell blog-intro" id="contenido"><span className="eyebrow">EL ARCHIVO DE SPRINGFIELD</span><h1>Ese capítulo<br />está por aquí.</h1><p>Encuentra episodios por título, temporada o personaje. Tú pones la pista.</p></section><SearchClient /><SiteFooter /></main>}
