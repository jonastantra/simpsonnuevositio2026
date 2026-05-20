import { menuItems, utilityPages } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-db-black px-4 py-10 text-sm text-zinc-400 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-lg font-black text-white">
            <span className="text-db-gold">Los Simpsons</span> Online
          </p>
          <p className="mt-3 max-w-2xl leading-7">
            Tu sitio para ver capitulos de Los Simpsons online, organizados por temporadas.
            Los Simpsons es propiedad de Fox Broadcasting Company y Matt Groening.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:text-right">
          <div>
            <h2 className="mb-3 font-black uppercase text-white">Enlaces</h2>
            <div className="flex flex-wrap gap-3 md:justify-end">
              {menuItems.map((item) => (
                <a key={item.href} href={item.href} className="font-bold hover:text-db-gold">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-3 font-black uppercase text-white">Legal</h2>
            <div className="flex flex-wrap gap-3 md:justify-end">
              {utilityPages.slice(1).map((page) => (
                <a key={page.path} href={page.path} className="font-bold hover:text-db-gold">
                  {page.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
