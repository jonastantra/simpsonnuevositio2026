"use client";
import { useState } from 'react';
export default function PlayerTabs({ players, title }) {
  const options=(players || []).filter(p=>p.embed);
  const [active,setActive]=useState(0);
  if(!options.length)return <div className="player-empty"><span aria-hidden="true">D’OH!</span><h2>Este capítulo aún no tiene reproductor.</h2><p>No hay reproductor disponible para esta ficha. Puedes consultar la sinopsis y explorar otros capítulos de la temporada.</p><a className="button button-yellow" href="/temporadas/">Explorar otras temporadas →</a></div>;
  return <div>{options.length>1 && <div className="player-options" aria-label="Opciones de video">{options.map((p,i)=><button key={i} type="button" aria-pressed={i===active} onClick={()=>setActive(i)}>{p.label}</button>)}</div>}<div className="video-frame" aria-label={`Video: ${title}`} dangerouslySetInnerHTML={{__html:options[active].embed}} /><p className="player-note">Reproductor externo · Si no carga, prueba otra opción disponible o consulta otro episodio.</p></div>;
}
