"use client";

import capitulos from "@/data/capitulos.json";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

const normalizar = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function initialQuery() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("q") || "";
}

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    setQuery(initialQuery());
  }, []);

  const indice = useMemo(
    () =>
      capitulos
        .filter((capitulo) => capitulo.temporada && capitulo.temporada !== 999)
        .map((capitulo) => ({
          ...capitulo,
          busqueda: normalizar(
            `${capitulo.titulo} ${capitulo.tituloLimpio || ""} temporada ${capitulo.temporada} capitulo ${
              capitulo.numero || ""
            } ${capitulo.slug}`
          ),
        })),
    []
  );

  const resultados = useMemo(() => {
    const value = normalizar(deferredQuery.trim());
    if (!value) return [];
    return indice.filter((capitulo) => capitulo.busqueda.includes(value)).slice(0, 80);
  }, [deferredQuery, indice]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <label className="relative block">
        <span className="sr-only">Buscar capitulos</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ejemplo: temporada 3, Bart, Navidad, capitulo 18..."
          className="focus-ring h-14 w-full rounded-lg border border-white/10 bg-white px-4 pr-28 text-base font-semibold text-zinc-950 shadow-card placeholder:text-zinc-500"
          type="search"
          autoComplete="off"
          autoFocus
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-db-gold px-3 py-2 text-xs font-black uppercase text-black">
          {resultados.length}
        </span>
      </label>

      {!query.trim() && (
        <div className="mt-8 rounded-lg border border-white/10 bg-db-panel p-8 text-center">
          <p className="text-xl font-black text-white">Escribe para buscar en el catalogo.</p>
          <p className="mt-2 text-zinc-300">
            La portada queda rapida y esta pagina carga los resultados solo cuando necesitas encontrar un episodio.
          </p>
        </div>
      )}

      {query.trim() && resultados.length === 0 && (
        <div className="mt-8 rounded-lg border border-white/10 bg-db-panel p-8 text-center text-zinc-300">
          No encontre capitulos con esa busqueda.
        </div>
      )}

      {resultados.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {resultados.map((capitulo, index) => (
            <a
              key={capitulo.slug}
              href={capitulo.url || `/capitulo/${capitulo.slug}/`}
              className="group overflow-hidden rounded-lg border border-white/10 bg-db-panel2 transition duration-200 hover:-translate-y-1 hover:border-db-gold hover:shadow-glow"
            >
              <div className="aspect-video bg-zinc-950">
                {capitulo.imagen ? (
                  <img
                    src={capitulo.imagen}
                    alt={capitulo.tituloLimpio || capitulo.titulo}
                    loading={index < 6 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#ffd90f,#0088cc)] px-3 text-center text-xs font-black uppercase text-black">
                    Los Simpsons Online
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-black uppercase text-db-gold">
                  T{capitulo.temporada} - E{capitulo.numero}
                </p>
                <h2 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-white">
                  {capitulo.tituloLimpio || capitulo.titulo}
                </h2>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
