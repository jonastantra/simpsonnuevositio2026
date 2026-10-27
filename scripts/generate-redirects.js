const fs = require('fs');
const capitulos = require('../data/capitulos.json');
const { siteUrl } = require('../lib/site-config');
const config = require('../vercel.json');
const escapePattern = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const redirects = [
  { source: '/:path*', has: [{ type: 'host', value: 'simpsonnuevositio2026.vercel.app' }], destination: `${siteUrl}/:path*`, statusCode: 301 },
  { source: '/:path*', has: [{ type: 'host', value: 'www.donsimpsononline.xyz' }], destination: `${siteUrl}/:path*`, statusCode: 301 },
  { source: '/feed/', destination: '/feed.xml', statusCode: 301 },
  { source: '/category/blog/', destination: '/blog/', statusCode: 301 },
];
for (const episode of capitulos) {
  const sources = new Set((episode.aliases || []).filter(alias => alias !== episode.url).map(alias => alias.replace(/^\/+|\/+$/g, '')));
  if (episode.id) sources.add(`archivos/${episode.id}`);
  sources.add(`${episode.slug}/feed`);
  redirects.push({ source: `/:legacy(${[...sources].map(escapePattern).join('|')})/`, destination: episode.url, statusCode: 301 });
}
for (let season = 1; season <= 34; season++) redirects.push({ source: `/temporada-${season}/`, destination: `/category/temporada-${season}/`, statusCode: 301 });
for (const article of require('../data/articles.json')) redirects.push({ source: `/blog/${article.slug}/`, destination: article.path, statusCode: 301 });
// Historical WordPress category names confirmed by Search Console.
const ordinals = ['primera','segunda','tercera','cuarta','quinta','sexta','septima','octava','novena','decima','onceava'];
for (let season = 1; season <= 34; season++) {
  const names = [`${season}-temporada`, `temporada-${season}`];
  if (ordinals[season-1]) names.push(`${ordinals[season-1]}-temporada`);
  const paths = names.flatMap(name => [name, `cats/${name}`]).filter(name => name !== `temporada-${season}`);
  if (season === 12) paths.push('cats/12-temporada/page/3');
  redirects.push({ source: `/:legacy(${paths.map(escapePattern).join('|')})/`, destination: `/category/temporada-${season}/`, statusCode: 301 });
}
for (const source of ['/todas-las-temporadas/', '/episodios-de-los-simpson/']) redirects.push({ source, destination: '/temporadas/', statusCode: 301 });
for (const source of ['/wp-sitemap.xml', '/sitemap-posttype-post.2023.xml', '/sitemap-posttype-post.2024.xml']) redirects.push({ source, destination: '/sitemap.xml', statusCode: 301 });
const direct = new Map(redirects.filter(rule => !rule.has && !rule.source.includes(":")).map(rule => [rule.source, rule.destination]));
for (const rule of redirects) {
  const seen = new Set();
  while (direct.has(rule.destination)) {
    if (seen.has(rule.destination)) throw new Error("Circular redirect");
    seen.add(rule.destination);
    rule.destination = direct.get(rule.destination);
  }
}
config.redirects = redirects;
config.installCommand = 'npm ci --include=dev';
fs.writeFileSync('vercel.json', JSON.stringify(config, null, 2) + '\n');
console.log(`${redirects.length} redirect rules generated (301).`);
