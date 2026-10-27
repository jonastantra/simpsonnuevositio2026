import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import PlayerTabs from './PlayerTabs';
import EpisodeCard from './EpisodeCard';
import Icon from './Icon';
import { episodeHref } from '@/lib/site';
export default function EpisodeView({ capitulo, capitulos }) {
  const items=capitulos.filter(e=>e.categoriaSlug===capitulo.categoriaSlug);
  const index=items.findIndex(e=>e.slug===capitulo.slug);
  const previous=items[index-1],next=items[index+1];
  const season=capitulo.temporada>0 && capitulo.temporada<999;
  const title=capitulo.tituloLimpio || capitulo.titulo;
  const available=Boolean(capitulo.players?.length);
  const categoryPath=season ? `/category/${capitulo.categoriaSlug}/` : '/blog/';
  return <main><SiteHeader /><article id="contenido" className="episode-page shell"><nav className="breadcrumb" aria-label="Ruta de navegación"><a href="/">Inicio</a><span>/</span><a href={categoryPath}>{capitulo.categoria}</a><span>/</span><span>{title}</span></nav><header className="episode-heading"><div className="episode-kicker"><span className="eyebrow">{season ? `TEMPORADA ${capitulo.temporada} · CAPÍTULO ${capitulo.numero}` : capitulo.categoria}</span><span className={`availability ${available ? 'is-playable' : ''}`}>{available ? 'Con reproductor' : 'Solo sinopsis'}</span></div><h1>{title}</h1><p>{season ? `Los Simpsons · T${capitulo.temporada} E${capitulo.numero}` : 'El archivo de Springfield'}</p></header><section className="player-shell" aria-label="Reproductor del capítulo"><PlayerTabs players={capitulo.players} title={title} /></section>
    <nav className="episode-pagination" aria-label="Navegación de capítulos">{previous ? <a href={episodeHref(previous)}><span>← ANTERIOR</span><strong>{previous.tituloLimpio || previous.titulo}</strong></a> : <div />}<a href={categoryPath} className="episode-all"><Icon name="grid" /><span>Ver {season ? 'temporada' : 'catálogo'}</span></a>{next ? <a href={episodeHref(next)}><span>SIGUIENTE →</span><strong>{next.tituloLimpio || next.titulo}</strong></a> : <div />}</nav>
    <div className="episode-details"><section><span className="eyebrow">¿DE QUÉ VA ESTE CAPÍTULO?</span><h2>La sinopsis.</h2><p>{capitulo.descripcion}</p>{capitulo.referenceUrl && <p className="source-note">Título original y fecha contrastados con <a href={capitulo.referenceUrl} target="_blank" rel="noopener noreferrer">TVmaze</a>.</p>}</section><aside className="episode-info"><span className="eyebrow">EN ESTA FICHA</span><dl><div><dt>Serie</dt><dd>Los Simpsons</dd></div><div><dt>Temporada</dt><dd>{season ? capitulo.temporada : '—'}</dd></div><div><dt>Reproductores</dt><dd>{capitulo.players?.length || 0} disponibles</dd></div></dl><p>La disponibilidad y calidad del video dependen del proveedor externo.</p>{capitulo.links?.length>0 && <div className="download-links">{capitulo.links.map((link,i)=><a key={i} href={link.url} rel="nofollow noopener noreferrer" target="_blank">{link.label}<Icon name="arrow" size={16} /></a>)}</div>}</aside></div>
    <section className="episode-related"><div className="section-heading"><div><span className="eyebrow">POR SI TE QUEDASTE CON GANAS</span><h2>Otro capítulo, ¿no?</h2></div><a className="text-link" href={categoryPath}>Ver todos<Icon name="arrow" size={17} /></a></div><div className="home-classics">{items.filter(e=>e.slug!==capitulo.slug).slice(0,6).map(e=><EpisodeCard episode={e} key={e.slug} />)}</div></section></article><SiteFooter /></main>;
}
