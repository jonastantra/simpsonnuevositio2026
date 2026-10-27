# Los Simpsons Online

Catálogo estático de títulos, sinopsis y opciones externas de reproducción.

## Desarrollo y comprobación

```sh
npm ci --include=dev
npm run build
npm run test:seo
npm run preview -- 3187
```

`out/` es la salida pública. Vercel publica `main` mediante la integración Git existente.

## SEO y datos

- Origen canónico único: `lib/site-config.js` (`https://donsimpsononline.xyz`). Se usa en páginas, RSS, OpenSearch y mapas XML. No cambiarlo por una URL temporal de Vercel.
- `data.csv` conserva las URLs históricas y fuentes originales; `npm run migrar` genera `data/capitulos.json`.
- `data/episode-corrections.json` contiene los títulos originales y fechas de la temporada 34 contrastados con TVmaze, con enlace a cada fuente. Conserva los slugs históricos.
- Fichas sin reproductor: conservadas con `noindex,follow` y excluidas de los mapas. No inventar fuentes, calidad, valoraciones ni fechas de subida.
- El sitemap incluye únicamente URLs canónicas indexables; el mapa de videos exige un reproductor real en los datos. No se usa la fecha de compilación como fecha de modificación de todos los episodios.
- Los reproductores están en el HTML inicial; la disponibilidad y reproducción del proveedor externo no están garantizadas por estas pruebas.
- `scripts/generate-redirects.js` mantiene las variantes históricas, categorías WordPress y mapas antiguos mediante redirecciones 301. Genera `vercel.json`; no editar manualmente sus reglas generadas.
- `public/search-index.json` es un índice compacto sin HTML de reproductores. Se solicita únicamente en el buscador.
- `npm run test:seo` comprueba HTML exportado, canónicas, indexación, JSON-LD, imágenes, referencias internas, destinos y mapas.
- `scripts/check-browser.cjs` verifica móvil/escritorio, búsquedas y presencia del reproductor. Requiere Playwright instalado; admite `PLAYWRIGHT_MODULE`, `CHROMIUM_PATH` y `BASE_URL`.
- `artifacts/` se excluye de Git: puede contener métricas privadas de Search Console y evidencias locales.

Estas mejoras no garantizan posiciones de búsqueda. Search Console permite medir rastreo, selección canónica e impresiones después de que Google vuelva a procesar el sitio.

## Diseño y rendimiento

El diseño usa CSS y tipografías del sistema, sin librerías de animación ni fuentes externas. Los componentes de contenido se renderizan estáticamente; únicamente el buscador y el selector de reproductor usan estado en el navegador.

`scripts/optimize-images.js` genera WebP con variantes de ancho y un manifiesto para `SiteImage`. Los originales se conservan y las imágenes derivadas se regeneran durante `build` y `predev`. `/media/` tiene caché de un año porque sus nombres dependen del contenido original. Todas las imágenes del diseño reservan su relación de aspecto para evitar saltos al cargar.

Pruebas visuales y funcionales en 320, 390, 768 y 1440 px:

```sh
node scripts/check-design.cjs
```

Admite las mismas variables de Playwright y `BASE_URL` que el resto de las pruebas. Los informes y capturas quedan en `artifacts/`, fuera de Git.
