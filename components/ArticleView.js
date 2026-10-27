import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import SiteImage from './SiteImage';
import EpisodeCard from './EpisodeCard';
import Icon from './Icon';
export default function ArticleView({article,relatedEpisodes=[],allArticles=[]}){
 const others=allArticles.filter(a=>a.slug!==article.slug).slice(0,3);
 return <main><SiteHeader /><article id="contenido" className="article-page"><nav className="breadcrumb" aria-label="Ruta de navegación"><a href="/">Inicio</a><span>/</span><a href="/blog/">El blog</a></nav><header className="article-heading"><span className="eyebrow">{article.tags?.[0] || 'DESDE SPRINGFIELD'} · {article.readTime || '5 min'} DE LECTURA</span><h1>{article.title}</h1><p className="lead">{article.excerpt}</p><div className="article-byline"><span>Por {article.author || 'Los Simpsons Online'}</span><time dateTime={article.date}>{new Date(`${article.date}T12:00:00Z`).toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'})}</time></div></header>{article.image && <SiteImage src={article.image} alt={article.title} eager sizes="(max-width: 760px) 95vw, 790px" className="article-hero-image" />}<div className="article-body" dangerouslySetInnerHTML={{__html:article.content}} />
 {relatedEpisodes.length>0 && <section className="article-related"><div className="section-heading"><div><span className="eyebrow">DEL BLOG AL CAPÍTULO</span><h2>Fichas relacionadas.</h2></div></div><div className="episode-grid">{relatedEpisodes.slice(0,4).map(e=><EpisodeCard key={e.slug} episode={e} />)}</div></section>}
 {others.length>0 && <section className="article-related"><span className="eyebrow">PARA SEGUIR EXPLORANDO</span>{others.map(a=><a href={a.path} key={a.slug} className="more-article"><h2>{a.title}</h2><Icon name="arrow" /></a>)}</section>}
 </article><SiteFooter /></main>;
}
