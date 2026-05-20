import capitulos from "@/data/capitulos.json";
import legacyPages from "@/data/legacy-pages.json";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lossimpsonsonline.vercel.app";

export const menuItems = [
  { label: "Inicio", href: "/" },
  { label: "T1", href: "/category/temporada-1/" },
  { label: "T2", href: "/category/temporada-2/" },
  { label: "T3", href: "/category/temporada-3/" },
  { label: "T4", href: "/category/temporada-4/" },
  {
    label: "Temporadas",
    href: "/temporadas/",
    children: Array.from({ length: 36 }, (_, index) => {
      const number = index + 1;
      return { label: `Temporada ${number}`, href: `/category/temporada-${number}/` };
    }),
  },
  { label: "Especiales", href: "/category/especiales/" },
  { label: "Blog", href: "/blog/" },
];

export const utilityPages = [
  { path: "/blog/", title: "Blog" },
  { path: "/temporadas/", title: "Temporadas" },
  { path: "/feed/", title: "Feed" },
  { path: "/comments/feed/", title: "Comentarios" },
  { path: "/wp-json/", title: "API WordPress" },
  { path: "/xmlrpc.php/", title: "XML-RPC" },
  { path: "/politica-de-privacidad/", title: "Politica de Privacidad" },
  { path: "/terminos-y-condiciones/", title: "Terminos y Condiciones" },
  { path: "/aviso-legal/", title: "Aviso Legal" },
  { path: "/contacto/", title: "Contacto" },
];

export const categoryPages = [
  ...Array.from({ length: 36 }, (_, index) => {
    const number = index + 1;
    return {
      path: `/category/temporada-${number}/`,
      title: `Temporada ${number}`,
      description: `Capitulos de Los Simpsons temporada ${number} online en espanol latino.`,
      filter: (capitulo) => capitulo.temporada === number,
    };
  }),
  {
    path: "/category/especiales/",
    title: "Especiales",
    description: "Especiales y capitulos destacados de Los Simpsons.",
    filter: (capitulo) => capitulo.saga === "especiales",
  },
  {
    path: "/category/peliculas/",
    title: "Peliculas",
    description: "Peliculas y especiales largos de Los Simpsons.",
    filter: (capitulo) => capitulo.saga === "peliculas",
  },
  {
    path: "/category/blog/",
    title: "Blog",
    description: "Articulos y curiosidades de Los Simpsons.",
    filter: (capitulo) => capitulo.saga === "blog",
  },
];

export function normalizePath(value) {
  const path = String(value || "").split("?")[0].split("#")[0].trim();
  if (!path || path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
}

export function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch (_error) {
    return value;
  }
}

export function comparePath(value) {
  return safeDecode(normalizePath(value)).toLowerCase();
}

export function pathToSegments(value) {
  return normalizePath(value)
    .replace(/^\/|\/$/g, "")
    .split("/")
    .filter(Boolean)
    .map((segment) => safeDecode(segment));
}

export function episodeHref(capitulo) {
  return capitulo.url || `/capitulo/${capitulo.slug}/`;
}

export function findCapituloBySlug(slug) {
  return capitulos.find((capitulo) => capitulo.slug === slug);
}

export function findCapituloByPath(path) {
  const target = comparePath(path);
  return capitulos.find((capitulo) => {
    if (comparePath(episodeHref(capitulo)) === target) return true;
    return Array.isArray(capitulo.aliases) && capitulo.aliases.some((alias) => comparePath(alias) === target);
  });
}

export function findCategoryByPath(path) {
  const target = comparePath(path);
  return categoryPages.find((category) => comparePath(category.path) === target);
}

export function findUtilityByPath(path) {
  const target = comparePath(path);
  return utilityPages.find((page) => comparePath(page.path) === target);
}

export function findLegacyPageByPath(path) {
  const target = comparePath(path);
  return legacyPages.find((page) => comparePath(page.path) === target);
}

export function getLegacyPages() {
  return legacyPages;
}

export function getCategoryCapitulos(category) {
  const seen = new Set();
  return capitulos.filter((capitulo) => {
    if (!category.filter(capitulo)) return false;
    const key = capitulo.slug || episodeHref(capitulo);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function pageTitle(title) {
  return `${title} | Los Simpsons Online`;
}
