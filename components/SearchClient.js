"use client";
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import Icon from './Icon';
const normalize=value=>String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export default function SearchClient(){
  const [query,setQuery]=useState('');
  const [episodes,setEpisodes]=useState([]);
  const [status,setStatus]=useState('loading');
  const deferred=useDeferredValue(query);
  useEffect(()=>{
    setQuery(new URLSearchParams(window.location.search).get('q') || '');
    const controller=new AbortController();
    fetch('/search-index.json',{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('No se pudo cargar el catálogo');return r.json()}).then(items=>{setEpisodes(items);setStatus('ready')}).catch(e=>{if(e.name!=='AbortError')setStatus('error')});
    return()=>controller.abort();
  },[]);
  const index=useMemo(()=>episodes.map(e=>({...e,search:normalize(`${e.titulo} ${e.tituloLimpio} temporada ${e.temporada} capitulo ${e.numero} ${e.slug}`)})),[episodes]);
  const matches=useMemo(()=>{const terms=normalize(deferred.trim()).split(/\s+/);return deferred.trim() ? index.filter(e=>terms.every(t=>e.search.includes(t))) : []},[deferred,index]);
  function update(value){setQuery(value);const url=new URL(window.location.href);if(value)url.searchParams.set('q',value);else url.searchParams.delete('q');window.history.replaceState(null,'',url.pathname+url.search)}
  return <section className="shell search-section"><label className="search-label" htmlFor="episode-search">Título, personaje o número de temporada</label><div className="search-input-wrap"><Icon name="search" /><input id="episode-search" type="search" value={query} onChange={e=>update(e.target.value)} placeholder="Ej. Bart, Navidad o temporada 3…" autoComplete="off" /></div><p role="status" aria-live="polite" className="search-status">{status==='loading' ? 'Cargando catálogo…' : status==='error' ? 'No se pudo cargar el catálogo. Intenta recargar la página.' : query.trim() ? `${matches.length} resultados${matches.length>80 ? ' · Mostrando los primeros 80' : ''}` : 'Una pista es suficiente para empezar.'}</p><div className="search-hints" aria-label="Búsquedas sugeridas">{['Bart','Navidad','Temporada 3','La casita del horror'].map(value=><button key={value} type="button" onClick={()=>update(value)}>{value}</button>)}</div>
    {!query.trim() && <div className="search-empty"><h2>¿Cómo iba ese capítulo?</h2><p>Prueba con un personaje, una palabra del título o una temporada.</p></div>}
    {status==='ready' && query.trim() && !matches.length && <div className="search-empty"><h2>Por aquí no apareció.</h2><p>Prueba con menos palabras o entra al <a className="text-link" href="/temporadas/">directorio de temporadas</a>.</p></div>}
    {matches.length>0 && <div className="episode-grid">{matches.slice(0,80).map(e=><a href={e.url} key={e.slug} className="episode-card"><div className="episode-art">{e.imagen && <img src={e.imagen} width={e.imageWidth || 480} height={e.imageHeight || 270} alt={e.tituloLimpio || e.titulo} loading="lazy" decoding="async" />}<span className={`availability ${e.playable ? 'is-playable' : ''}`}>{e.playable ? 'Con reproductor' : 'Solo sinopsis'}</span></div><div className="episode-card-body"><span className="overline">TEMPORADA {e.temporada} · CAPÍTULO {e.numero}</span><h2 style={{fontSize:17,lineHeight:1.25,marginTop:6}}>{e.tituloLimpio || e.titulo}</h2></div></a>)}</div>}
  </section>;
}
