const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(process.cwd(), "public", "covers");

const colors = [
  ["#ffd90f", "#0088cc"],
  ["#f15bb5", "#00bbf9"],
  ["#fee440", "#9b5de5"],
  ["#00f5d4", "#f15bb5"],
  ["#ffbe0b", "#fb5607"],
  ["#8ecae6", "#ffb703"],
  ["#cdb4db", "#ffc8dd"],
  ["#90be6d", "#277da1"],
];

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[char];
  });
}

function svgForSeason(number) {
  const [a, b] = colors[(number - 1 + colors.length) % colors.length];
  const title = number ? `TEMPORADA ${number}` : "LOS SIMPSONS";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" role="img" aria-label="${esc(title)}">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="${a}"/>
      <stop offset="1" stop-color="${b}"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="6" flood-color="#000" flood-opacity=".35"/>
    </filter>
  </defs>
  <rect width="640" height="360" fill="url(#bg)"/>
  <circle cx="535" cy="70" r="96" fill="#fff" opacity=".22"/>
  <circle cx="92" cy="302" r="132" fill="#fff" opacity=".15"/>
  <path d="M0 283c76-32 151-26 226 18 74 44 154 46 240 5 63-30 121-39 174-28v82H0z" fill="#111" opacity=".28"/>
  <g filter="url(#shadow)">
    <text x="42" y="86" font-family="Arial Black, Impact, sans-serif" font-size="56" font-style="italic" fill="#111">TV</text>
    <text x="136" y="86" font-family="Arial Black, Impact, sans-serif" font-size="38" font-style="italic" fill="#fff">LOS SIMPSONS</text>
    <text x="42" y="208" font-family="Arial Black, Impact, sans-serif" font-size="66" font-style="italic" fill="#fff">${esc(title)}</text>
    <text x="46" y="266" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#111" opacity=".86">Online en espanol latino</text>
  </g>
</svg>`;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "default.svg"), svgForSeason(0));
  for (let season = 1; season <= 36; season += 1) {
    fs.writeFileSync(path.join(OUT_DIR, `season-${season}.svg`), svgForSeason(season));
  }
  console.log("Portadas locales generadas: public/covers");
}

main();
