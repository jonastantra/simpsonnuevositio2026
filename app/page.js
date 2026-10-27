import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SiteImage from '@/components/SiteImage';
import EpisodeCard from '@/components/EpisodeCard';
import Icon from '@/components/Icon';
import capitulos from '@/data/capitulos.json';
import { absoluteUrl, episodeHref, getArticles, siteUrl } from '@/lib/site';

export const dynamic = 'force-static';
export const metadata = { alternates: { canonical: '/' } };
const episodes = capitulos.filter(e => e.temporada > 0 && e.temporada < 999);
const playableCount = episodes.filter(e => e.players?.length).length;
const faqs = [
  { q: '¿Qué temporadas puedo consultar?', a: `El catálogo reúne ${episodes.length} fichas de las temporadas 1 a 34. Cada temporada tiene su propia lista de títulos y sinopsis.` },
  { q: '¿Todos los capítulos tienen reproductor?', a: `No. Hay ${playableCount} fichas con una opción de reproducción externa. Las demás están identificadas como «Solo sinopsis». La disponibilidad depende de cada proveedor.` },
  { q: '¿Cómo encuentro un capítulo?', a: 'Puedes buscar por título, personaje o número de temporada. Si prefieres verlos en orden, abre una temporada y usa los enlaces anterior y siguiente dentro de cada ficha.' },
];
const seasonNumbers = [1,3,4,5,6,7,8,21];
const seasons = seasonNumbers.map(number => {
  const items=episodes.filter(e=>e.temporada===number);
  return {number,count:items.length,available:items.filter(e=>e.players?.length).length,image:items.find(e=>e.imagen)?.imagen,path:`/category/temporada-${number}/`};
});
const hero=episodes.find(e=>e.temporada===7 && e.numero===1);
const classics=[[4,12],[5,2],[6,25],[7,4],[8,23],[1,1]].map(([s,n])=>episodes.find(e=>e.temporada===s && e.numero===n && e.players?.length)).filter(Boolean);
const articles=getArticles().filter(a=>['la-epoca-dorada-de-los-simpson-temporadas-3-a-8','voces-en-espanol-latino-de-los-simpson-doblaje-legendario','guia-para-ver-los-simpson-orden-cronologico-temporadas'].includes(a.slug));

export default function HomePage() {
  const schemas=[
    {'@context':'https://schema.org','@type':'CollectionPage',name:'Los Simpsons Online: capítulos y temporadas',url:`${siteUrl}/`,description:'Catálogo de capítulos, sinopsis y guías de Los Simpsons en español latino.'},
    {'@context':'https://schema.org','@type':'ItemList',name:'Temporadas para explorar',numberOfItems:seasons.length,itemListElement:seasons.map((s,i)=>({'@type':'ListItem',position:i+1,name:`Los Simpsons temporada ${s.number}`,url:absoluteUrl(s.path)}))},
    {'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))},
  ];
  return <main>
    {schemas.map((schema,index)=><script key={index} type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}} />)}
    <SiteHeader />
    <section id="contenido" className="home-hero"><div className="shell hero-layout">
      <div className="hero-copy"><span className="eyebrow"><span className="status-dot" />BIENVENIDO DE VUELTA A SPRINGFIELD</span><h1>Los Simpsons<br /><span>online.</span><i aria-hidden="true">✳</i></h1><p>Tu familia amarilla de siempre.<br />Encuentra ese capítulo que nunca te cansas de volver a ver.</p><div className="hero-actions"><a className="button button-ink" href="/temporadas/">Explorar temporadas<Icon name="arrow" /></a><a className="text-link" href="/buscar/"><Icon name="search" size={18} />Buscar un capítulo</a></div><div className="hero-footnote"><strong>34</strong> temporadas<span /> <strong>{episodes.length}</strong> fichas<span /> En español latino</div></div>
      <div className="hero-visual"><div className="tv-sticker">CLÁSICOS QUE<br />NO FALLAN <span>↘</span></div><a className="hero-tv" href={episodeHref(hero)}><div className="tv-top"><span><i />EN SPRINGFIELD</span><span>EST. 1989</span></div><div className="tv-image"><SiteImage src={hero.imagen} alt="La familia Simpson junto al señor Burns en el hospital" eager sizes="(max-width: 760px) 90vw, 46vw" /><span className="tv-play"><Icon name="play" size={27} /></span></div><div className="tv-caption"><span>T07 · E01</span><strong>¿Quién mató al Sr. Burns?<small>Segunda parte</small></strong><Icon name="arrow" /></div></a><span className="hero-orbit" aria-hidden="true">✳</span></div>
    </div></section>
    <div className="catalog-note"><div className="shell"><span className="status-dot" /><p><strong>Sin perderte entre enlaces.</strong> Cada ficha indica si tiene reproductor o solo sinopsis.</p><a href="/temporadas/">Conoce el catálogo<Icon name="arrow" size={16} /></a></div></div>

    <section className="section shell"><div className="section-heading"><div><span className="eyebrow">DE LOS QUE DAN GANAS DE REPETIR</span><h2>Un buen lugar para empezar<span>.</span></h2></div><a className="text-link" href="/buscar/">Encontrar otro<Icon name="arrow" size={18} /></a></div><div className="home-classics">{classics.map((episode,index)=><EpisodeCard key={episode.slug} episode={episode} index={index} />)}</div></section>

    <section className="seasons-section"><div className="shell section"><div className="section-heading"><div><span className="eyebrow">CADA ETAPA TIENE LO SUYO</span><h2>¿Por cuál temporada vamos?</h2></div><a className="button button-outline" href="/temporadas/">Ver las 34<Icon name="arrow" size={18} /></a></div><div className="home-seasons">{seasons.map(s=><a className="season-card" href={s.path} key={s.number}><div className="season-art"><SiteImage src={s.image} alt={`Los Simpsons, temporada ${s.number}`} /><span>{String(s.number).padStart(2,'0')}</span></div><div className="season-card-copy"><h3>Temporada {s.number}</h3><p>{s.count} capítulos · {s.available} con reproductor</p><Icon name="arrow" size={17} /></div></a>)}</div><div className="season-directory-link"><p>¿Buscas otra? El archivo completo está organizado del 1 al 34.</p><a className="text-link" href="/temporadas/">Ir al directorio completo<Icon name="arrow" size={17} /></a></div></div></section>

    <section className="shell special-section"><div className="special-copy"><span className="eyebrow">UN POCO DE TERROR. MUCHO SPRINGFIELD.</span><h2>Bienvenido a<br />la casita del horror<span>!</span></h2><p>Los especiales de Halloween también tienen su propio rincón. Entra bajo tu propio riesgo… de querer ver otro.</p><a className="button button-yellow" href="/category/especiales/">Explorar los especiales<Icon name="arrow" /></a></div><div className="special-art" aria-hidden="true"><span>BOO<span>!</span></span><div className="special-eye"><i /><i /></div><p>LA NOCHE ES JOVEN.</p></div></section>

    <section className="section shell"><div className="section-heading"><div><span className="eyebrow">MÁS ALLÁ DEL SOFÁ</span><h2>Historias desde Springfield<span>.</span></h2></div><a className="text-link" href="/blog/">Ir al blog<Icon name="arrow" size={18} /></a></div><div className="article-grid">{articles.map(a=><article className="article-card" key={a.slug}><a href={a.path} className="article-cover"><SiteImage src={a.image} alt={a.title} sizes="(max-width: 760px) 115px, 30vw" /></a><div className="article-card-copy"><span className="eyebrow">{a.tags?.[0]} · {a.readTime}</span><h3><a href={a.path}>{a.title}</a></h3><a className="text-link" href={a.path}>Leer la historia<Icon name="arrow" size={16} /></a></div></article>)}</div></section>

    <section className="faq-section shell"><div><span className="eyebrow">ANTES DE DARLE PLAY</span><h2>Por si te lo<br />preguntabas<span>…</span></h2><p>Lo importante, sin letra chiquita.</p></div><div className="faq-list">{faqs.map(f=><details key={f.q}><summary>{f.q}<span aria-hidden="true">+</span></summary><p>{f.a}</p></details>)}</div></section>
    <SiteFooter />
  </main>;
}
