import Icon from './Icon';
export default function SiteHeader() {
  return <header className="site-header">
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <div className="shell header-row">
      <a href="/" className="brand"><span className="brand-screen" aria-hidden="true">S<span>.</span></span><span className="brand-word">LOS SIMPSONS<small>ONLINE · ARCHIVO DE SPRINGFIELD</small></span></a>
      <nav className="desktop-nav" aria-label="Navegación principal"><a href="/temporadas/">Temporadas</a><a href="/category/especiales/">Halloween</a><a href="/blog/">El blog</a></nav>
      <a className="header-search" href="/buscar/" aria-label="Buscar un capítulo"><Icon name="search" /><span>Buscar un capítulo</span><kbd aria-hidden="true">↵</kbd></a>
    </div>
    <nav className="mobile-nav shell" aria-label="Navegación móvil"><a href="/temporadas/"><Icon name="grid" size={16} />Temporadas</a><a href="/category/especiales/">Halloween</a><a href="/blog/">El blog</a><a href="/buscar/">Buscar<Icon name="search" size={15} /></a></nav>
  </header>;
}
