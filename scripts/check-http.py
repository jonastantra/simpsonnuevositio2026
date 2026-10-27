#!/usr/bin/env python3
"""Read-only HTTP smoke checks against a deployed release."""
import concurrent.futures, json, re, sys
from pathlib import Path
from urllib.request import Request, build_opener, HTTPRedirectHandler
from urllib.error import HTTPError
from urllib.parse import urljoin
BASE=sys.argv[1] if len(sys.argv)>1 else 'https://donsimpsononline.xyz'
ORIGIN='https://donsimpsononline.xyz'
class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self,*args,**kwargs):return None
opener=build_opener(NoRedirect)
def fetch(url):
    try:r=opener.open(Request(url,headers={'User-Agent':'Mozilla/5.0 (compatible; SEO-Check/1.0)'}),timeout=25)
    except HTTPError as e:r=e
    return r.code,dict(r.headers),r.read().decode('utf-8','replace')
cases=[('/',200,None),('/robots.txt',200,None),('/sitemap.xml',200,None),('/video-sitemap.xml',200,None),('/feed.xml',200,None),('/buscar/?q=bart',200,None),('/temporadas/',200,None),('/category/temporada-1/',200,None),('/category/temporada-34/',200,None),('/primera-temporada-1-sin-blanca-navidad/',200,None),('/primera-temporada-4-hogar-agridulce-hogar/',200,None),('/no-existe-seo-20261027/',404,None),('/todas-las-temporadas/',301,'/temporadas/'),('/episodios-de-los-simpson/',301,'/temporadas/'),('/cats/primera-temporada/',301,'/category/temporada-1/'),('/cats/33-temporada/',301,'/category/temporada-33/'),('/cats/12-temporada/page/3/',301,'/category/temporada-12/'),('/onceava-temporada/',301,'/category/temporada-11/'),('/capitulo/primera-temporada-1-sin-blanca-navidad/',301,'/primera-temporada-1-sin-blanca-navidad/'),('/temporada-1/primera-temporada-1-sin-blanca-navidad/',301,'/primera-temporada-1-sin-blanca-navidad/'),('/archivos/2439/',301,'/primera-temporada-1-sin-blanca-navidad/'),('/primera-temporada-1-sin-blanca-navidad/feed/',301,'/primera-temporada-1-sin-blanca-navidad/'),('/wp-sitemap.xml',301,'/sitemap.xml'),('/sitemap-posttype-post.2023.xml',301,'/sitemap.xml'),('/category/blog/',301,'/blog/'),('/blog/guia-para-ver-los-simpson-orden-cronologico-temporadas/',301,'/guia-para-ver-los-simpson-orden-cronologico-temporadas/')]
if BASE.startswith('https'):
    cases += [('https://simpsonnuevositio2026.vercel.app/',301,ORIGIN+'/'),('https://simpsonnuevositio2026.vercel.app/category/temporada-1/',301,ORIGIN+'/category/temporada-1/'),('https://www.donsimpsononline.xyz/primera-temporada-1-sin-blanca-navidad/?utm_source=seo',301,ORIGIN+'/primera-temporada-1-sin-blanca-navidad/?utm_source=seo')]
def run(case):
    path,status,target=case;url=path if path.startswith('https://') else BASE+path
    try:
        code,h,text=fetch(url);location=h.get('Location') or h.get('location');passed=code==status
        if target:passed &= urljoin(url,location or '')==urljoin(BASE,target)
        if path=='/':passed &= 'seo-20261027-02' in text and f'href="{ORIGIN}/"' in text
        if path=='/buscar/?q=bart':passed &= bool(re.search(r'name="robots" content="noindex, follow"',text))
        if path=='/primera-temporada-4-hogar-agridulce-hogar/':passed &= 'noindex, follow' in text
        if path in ['/robots.txt','/sitemap.xml','/video-sitemap.xml','/feed.xml']:passed &= 'simpsonnuevositio2026.vercel.app' not in text
        return {'url':url,'status':code,'location':location,'pass':bool(passed)}
    except Exception as e:return {'url':url,'pass':False,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as ex:results=list(ex.map(run,cases))
result={'base':BASE,'passed':sum(r['pass'] for r in results),'total':len(results),'results':results}
Path('artifacts').mkdir(exist_ok=True);Path('artifacts/http-validation.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2));sys.exit(any(not r['pass'] for r in results))
