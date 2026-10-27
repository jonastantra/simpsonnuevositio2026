import EpisodeCard from './EpisodeCard';
export default function CapituloGrid({ capitulos, eagerCount = 0 }) {
  return <div className="episode-grid">{capitulos.map((episode,index)=><EpisodeCard key={episode.slug} episode={episode} index={index} eager={index < eagerCount} />)}</div>;
}
