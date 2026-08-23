const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const CAPITULOS_PATH = path.join(ROOT, "data", "capitulos.json");
const OUTPUT_PATH = path.join(ROOT, "public", "video-sitemap.xml");

function escapeXml(unsafe) {
  return String(unsafe || "")
    .replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        case "'":
          return "&apos;";
        case '"':
          return "&quot;";
      }
    });
}

function extractEmbedSrc(iframeHtml) {
  const match = String(iframeHtml || "").match(/src=["']([^"']+)["']/i);
  return match ? match[1] : "";
}

function generateVideoSitemap() {
  if (!fs.existsSync(CAPITULOS_PATH)) {
    console.error("Capitulos JSON not found at", CAPITULOS_PATH);
    return;
  }

  const capitulos = JSON.parse(fs.readFileSync(CAPITULOS_PATH, "utf8"));
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://simpsonnuevositio2026.vercel.app").replace(/\/+$/, "");

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n`;

  let videoCount = 0;

  for (const c of capitulos) {
    if (!c.url && !c.slug) continue;
    const pageUrl = `${siteUrl}${c.url || `/capitulo/${c.slug}/`}`;
    const imgUrl = c.imagen
      ? (c.imagen.startsWith("http") ? c.imagen : `${siteUrl}${c.imagen.startsWith("/") ? "" : "/"}${c.imagen}`)
      : `${siteUrl}/uploads/2024/07/11200.jpg`;
    
    const embedUrl = extractEmbedSrc(c.iframe || c.players?.[0]?.embed);
    const title = c.seoTitle || `Ver Los Simpsons ${c.temporada && c.temporada !== 999 ? `Temporada ${c.temporada} Capitulo ${c.numero}: ` : ""}${c.tituloLimpio || c.titulo} Online`;
    const desc = c.seoDescription || c.descripcion || `Ver ${c.tituloLimpio || c.titulo} online en streaming en espanol latino.`;

    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(pageUrl)}</loc>\n`;
    xml += `    <video:video>\n`;
    xml += `      <video:thumbnail_loc>${escapeXml(imgUrl)}</video:thumbnail_loc>\n`;
    xml += `      <video:title>${escapeXml(title)}</video:title>\n`;
    xml += `      <video:description>${escapeXml(desc.slice(0, 1000))}</video:description>\n`;
    if (embedUrl) {
      xml += `      <video:player_loc allow_embed="yes" autoplay="ap=1">${escapeXml(embedUrl)}</video:player_loc>\n`;
    }
    xml += `      <video:duration>1320</video:duration>\n`;
    xml += `      <video:publication_date>2026-05-19T00:00:00+00:00</video:publication_date>\n`;
    xml += `      <video:family_friendly>yes</video:family_friendly>\n`;
    xml += `      <video:category>${escapeXml(c.categoria || "Los Simpsons")}</video:category>\n`;
    xml += `      <video:tag>Los Simpsons</video:tag>\n`;
    if (c.temporada && c.temporada !== 999) {
      xml += `      <video:tag>Temporada ${c.temporada}</video:tag>\n`;
      xml += `      <video:tag>Capitulo ${c.numero}</video:tag>\n`;
    }
    xml += `      <video:tag>Streaming HD</video:tag>\n`;
    xml += `      <video:tag>Espanol Latino</video:tag>\n`;
    xml += `    </video:video>\n`;
    xml += `  </url>\n`;

    videoCount += 1;
  }

  xml += `</urlset>\n`;

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, xml, "utf8");
  console.log(`✓ Video sitemap generated successfully with ${videoCount} videos at ${OUTPUT_PATH}`);
}

generateVideoSitemap();
