import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import Icon from './Icon';
import { categoryPages, getCategoryCapitulos } from '@/lib/site';
const texts={
 '/politica-de-privacidad/':'Este sitio utiliza Google Tag Manager y Google AdSense. Estos servicios y los reproductores externos pueden tratar datos de navegación y utilizar cookies conforme a sus propias políticas. Puedes administrar las cookies desde la configuración de tu navegador y consultar las políticas de Google en policies.google.com/privacy.',
 '/terminos-y-condiciones/':'Este sitio ofrece un catálogo de títulos y sinopsis de Los Simpsons y enlaces a reproductores externos cuando están disponibles. La disponibilidad de cada fuente puede cambiar. No se garantiza una resolución, continuidad o disponibilidad específica de los videos externos.',
 '/aviso-legal/':'Este es un sitio de aficionados, no un sitio oficial de Los Simpsons, Disney o sus titulares. Las marcas, imágenes y personajes pertenecen a sus respectivos propietarios. Los reproductores enlazados son servicios externos al sitio.',
 '/contacto/':'Para identificar un problema, conserva la dirección de la ficha, la opción de reproductor y una descripción del error. Por ahora no hay un formulario de contacto habilitado en este sitio.',
};
export default function UtilityPage({page}){
 const directory=page.path==='/temporadas/';
 return <main><SiteHeader /><section className="shell utility-page" id="contenido"><span className="eyebrow">EL ARCHIVO DE SPRINGFIELD</span><h1>{directory ? <>34 temporadas.<br />Tu siguiente capítulo.</> : page.title}</h1>{directory ? <><p className="utility-intro">De los primeros días a nuevas historias en Springfield. Escoge una temporada y consulta sus capítulos en orden. Cada ficha indica si tiene reproductor.</p><div className="directory-grid">{categoryPages.filter(c=>c.temporada).map(c=>{const eps=getCategoryCapitulos(c);const count=eps.filter(e=>e.players?.length).length;return <a href={c.path} key={c.path} className="directory-card"><span>{String(c.temporada).padStart(2,'0')}</span><div><h2>{c.title}</h2><p>{eps.length} fichas<br />{count} con reproductor</p></div><Icon size={17} /></a>})}</div></> : <p className="utility-text">{texts[page.path] || page.description}</p>}<a className="button button-ink" href="/buscar/">Buscar un capítulo<Icon name="search" size={17} /></a></section><SiteFooter /></main>;
}
