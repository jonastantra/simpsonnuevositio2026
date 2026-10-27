import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import SiteImage from './SiteImage';
import Icon from './Icon';
export default function BlogIndexView({articles=[]}){
 return <main><SiteHeader /><section className="shell blog-intro" id="contenido"><span className="eyebrow">MÁS ALLÁ DEL SOFÁ</span><h1>Historias desde<br />Springfield.</h1><p>Personajes, doblaje, capítulos memorables y pequeñas curiosidades para quienes nunca se cansan de Los Simpsons.</p></section><section className="shell article-grid blog-grid" aria-label="Artículos del blog">{articles.map(a=><article key={a.slug} className="article-card"><a href={a.path} className="article-cover"><SiteImage src={a.image} alt={a.title} sizes="(max-width: 760px) 115px, 33vw" /></a><div className="article-card-copy"><span className="eyebrow">{a.tags?.[0] || 'EL BLOG'} · {a.readTime}</span><h2><a href={a.path}>{a.title}</a></h2><a className="text-link" href={a.path}>Leer la historia<Icon size={16} /></a></div></article>)}</section><SiteFooter /></main>;
}
