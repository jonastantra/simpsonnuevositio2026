"use client";
import { useState } from "react";
export default function PlayerTabs({ players, title }) {
  const options = (players || []).filter(player => player.embed);
  const [active, setActive] = useState(0);
  if (!options.length) return <p className="rounded-lg bg-zinc-950 p-8 text-center text-zinc-300">No hay reproductor disponible para esta ficha. Puedes consultar la sinopsis y explorar otros capítulos de la temporada.</p>;
  const embed = options[active].embed;
  return <div>
    {options.length > 1 && <div className="mb-3 flex gap-2 overflow-x-auto pb-1" aria-label="Opciones de video">
      {options.map((player, index) => <button key={index} type="button" aria-pressed={index === active} onClick={() => setActive(index)} className={`focus-ring shrink-0 rounded-md border px-4 py-2 text-sm font-black ${index === active ? "border-db-orange bg-db-orange text-white" : "border-white/10 text-zinc-200"}`}>{player.label}</button>)}
    </div>}
    <div aria-label={`Video: ${title}`} className="video-frame relative aspect-video overflow-hidden rounded-lg bg-black" dangerouslySetInnerHTML={{ __html: embed }} />
    <p className="mt-3 text-xs leading-6 text-zinc-400">El reproductor es externo. Si no carga, prueba otra opción disponible o consulta otro episodio.</p>
  </div>;
}
