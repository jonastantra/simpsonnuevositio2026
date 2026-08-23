const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const CAPITULOS_PATH = path.join(ROOT, "data", "capitulos.json");
const ARTICLES_PATH = path.join(ROOT, "data", "articles.json");
const RSS_PATH = path.join(ROOT, "public", "feed.xml");
const ATOM_PATH = path.join(ROOT, "public", "atom.xml");

function escapeXml(unsafe) {
  return String(unsafe || "")
    .replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<": return "&lt;";
        case ">": return "&gt;";
        case "&": return "&amp;";
        case "'": return "&apos;";
        case '"': return "&quot;";
      }
    });
}

function generateFeeds() {
  const capitulos = fs.existsSync(CAPITULOS_PATH) ? JSON.parse(fs.readFileSync(CAPITULOS_PATH, "utf8")) : [];
  const articles = fs.existsSync(ARTICLES_PATH) ? JSON.parse(fs.readFileSync(ARTICLES_PATH, "utf8")) : [];
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://simpsonnuevositio2026.vercel.app").replace(/\/+$/, "");

  const now = new Date().toUTCString();
  const isoNow = new Date().toISOString();

  // 1. RSS 2.0
  let rss = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  rss += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n`;
  rss += `  <channel>\n`;
  rss += `    <title>Los Simpsons Online - Streaming en Espanol Latino</title>\n`;
  rss += `    <link>${siteUrl}</link>\n`;
  rss += `    <description>Todas las temporadas y capitulos de Los Simpsons online en espanol latino HD con reproductor rapido.</description>\n`;
  rss += `    <language>es-MX</language>\n`;
  rss += `    <lastBuildDate>${now}</lastBuildDate>\n`;
  rss += `    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />\n`;

  // Add articles
  for (const art of articles) {
    const artUrl = `${siteUrl}${art.path}`;
    rss += `    <item>\n`;
    rss += `      <title>${escapeXml(art.title)}</title>\n`;
    rss += `      <link>${escapeXml(artUrl)}</link>\n`;
    rss += `      <guid isPermaLink="true">${escapeXml(artUrl)}</guid>\n`;
    rss += `      <description>${escapeXml(art.excerpt)}</description>\n`;
    rss += `      <pubDate>${now}</pubDate>\n`;
    rss += `      <category>Blog</category>\n`;
    rss += `    </item>\n`;
  }

  // Add featured/latest episodes
  for (const cap of capitulos.slice(-30).reverse()) {
    const epUrl = `${siteUrl}${cap.url || `/capitulo/${cap.slug}/`}`;
    const title = cap.seoTitle || `Ver Los Simpsons ${cap.temporada && cap.temporada !== 999 ? `T${cap.temporada} E${cap.numero}: ` : ""}${cap.tituloLimpio || cap.titulo} Online`;
    const desc = cap.seoDescription || cap.descripcion || `Capitulo completo de Los Simpsons en espanol latino.`;
    rss += `    <item>\n`;
    rss += `      <title>${escapeXml(title)}</title>\n`;
    rss += `      <link>${escapeXml(epUrl)}</link>\n`;
    rss += `      <guid isPermaLink="true">${escapeXml(epUrl)}</guid>\n`;
    rss += `      <description>${escapeXml(desc)}</description>\n`;
    rss += `      <pubDate>${now}</pubDate>\n`;
    rss += `      <category>${escapeXml(cap.categoria || "Los Simpsons")}</category>\n`;
    rss += `    </item>\n`;
  }

  rss += `  </channel>\n`;
  rss += `</rss>\n`;

  fs.mkdirSync(path.dirname(RSS_PATH), { recursive: true });
  fs.writeFileSync(RSS_PATH, rss, "utf8");

  // 2. ATOM XML
  let atom = `<?xml version="1.0" encoding="utf-8"?>\n`;
  atom += `<feed xmlns="http://www.w3.org/2005/Atom">\n`;
  atom += `  <title>Los Simpsons Online</title>\n`;
  atom += `  <link href="${siteUrl}/" />\n`;
  atom += `  <link href="${siteUrl}/atom.xml" rel="self" />\n`;
  atom += `  <id>${siteUrl}/</id>\n`;
  atom += `  <updated>${isoNow}</updated>\n`;

  for (const art of articles) {
    const artUrl = `${siteUrl}${art.path}`;
    atom += `  <entry>\n`;
    atom += `    <title>${escapeXml(art.title)}</title>\n`;
    atom += `    <link href="${escapeXml(artUrl)}" />\n`;
    atom += `    <id>${escapeXml(artUrl)}</id>\n`;
    atom += `    <updated>${isoNow}</updated>\n`;
    atom += `    <summary>${escapeXml(art.excerpt)}</summary>\n`;
    atom += `  </entry>\n`;
  }

  atom += `</feed>\n`;
  fs.writeFileSync(ATOM_PATH, atom, "utf8");

  console.log(`✓ Generated RSS feed (${RSS_PATH}) and Atom feed (${ATOM_PATH})`);
}

generateFeeds();
