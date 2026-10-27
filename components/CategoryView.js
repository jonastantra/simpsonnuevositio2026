import CapituloGrid from './CapituloGrid';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import Icon from './Icon';
import seasonsInfo from '@/data/seasons-info.json';
export default function CategoryView({ category, capitulos }) {
  const number=category.temporada;
  const season=number>0 && number<999;
  const info=season ? seasonsInfo[String(number)] : null;
  const available=capitulos.filter(e=>e.players?.length).length;
  return <main><SiteHeader /><section className="collection-hero" id="contenido"><div className="shell"><nav className="breadcrumb" aria-label="Ruta de navegación"><a href="/">Inicio</a><span>/</span><a href="/temporadas/">Temporadas</a><span>/</span><span>{category.title}</span></nav><div className="collection-heading"><div><span className="eyebrow">EL ARCHIVO DE SPRINGFIELD</span><h1>{season ? <>Los Simpsons<span>Temporada {number}.</span></> : category.title}</h1><p>{category.description}</p><div className="collection-meta">{info && <span>{info.year}</span>}<span>{capitulos.length} fichas</span><span>{available} con reproductor</span></div></div><div className="collection-number" aria-hidden="true">{season ? String(number).padStart(2,'0') : 'BOO!'}</div></div></div></section>
    <section className="section shell"><div className="collection-toolbar"><div><span className="eyebrow">EN ORDEN, COMO TE GUSTA</span><h2>Los capítulos</h2></div>{season && <nav className="season-pagination" aria-label="Cambiar temporada">{number>1 && <a href={`/category/temporada-${number-1}/`}>← T{number-1}</a>}<a href="/temporadas/">Todas</a>{number<34 && <a href={`/category/temporada-${number+1}/`}>T{number+1} →</a>}</nav>}</div><CapituloGrid capitulos={capitulos} />{!capitulos.length && <div className="empty-state"><h2>Aún no hay fichas aquí.</h2><a href="/temporadas/" className="button button-ink">Explorar temporadas<Icon /></a></div>}</section>
    {info && <section className="shell season-editorial"><div><span className="eyebrow">UN POCO DE CONTEXTO</span><h2>La temporada, en pocas palabras.</h2><p>{info.synopsis}</p>{info.curiosity && <aside><strong>¿Sabías que…?</strong><p>{info.curiosity}</p></aside>}</div><div className="faq-list">{info.faqs.map(f=><details key={f.question}><summary>{f.question}<span aria-hidden="true">+</span></summary><p>{f.answer}</p></details>)}</div></section>}
    <SiteFooter /></main>;
}
