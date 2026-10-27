import SiteImage from './SiteImage';
import Icon from './Icon';
import { episodeHref } from '@/lib/site';
export default function EpisodeCard({ episode, index = 0, eager = false }) {
  const playable = Boolean(episode.players?.length);
  return <a href={episodeHref(episode)} className="episode-card">
    <div className="episode-art">{episode.imagen ? <SiteImage src={episode.imagen} alt={episode.tituloLimpio || episode.titulo} eager={eager} /> : <span className="art-placeholder">D’OH!</span>}<span className={`availability ${playable ? 'is-playable' : ''}`}>{playable ? <><Icon name="play" size={11} />Con reproductor</> : 'Solo sinopsis'}</span><span className="episode-play"><Icon name={playable ? 'play' : 'arrow'} /></span></div>
    <div className="episode-card-body"><span className="overline">{episode.temporada > 0 && episode.temporada < 999 ? `TEMPORADA ${episode.temporada} · CAPÍTULO ${episode.numero}` : episode.categoria}</span><h3>{episode.tituloLimpio || episode.titulo}</h3></div>
  </a>;
}
