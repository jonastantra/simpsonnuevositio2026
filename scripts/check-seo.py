#!/usr/bin/env python3
"""Validate actual exported HTML, sitemap coverage, links and redirect destinations."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote, urljoin
import json, re, xml.etree.ElementTree as ET
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'out'
ORIGIN = 'https://donsimpsononline.xyz'
errors = []
checks = 0

def check(condition, message):
    global checks
    checks += 1
    if not condition: errors.append(message)

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.canonical=[]; self.robots=[]; self.links=[]; self.images=[]; self.h1=0; self.iframes=[]; self.title=False; self.description=False; self.schemas=[]; self.script=False; self.payload=''; self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='link' and a.get('rel')=='canonical': self.canonical.append(a.get('href'))
        if tag=='meta' and a.get('name') in ('robots','googlebot'): self.robots.append(a.get('content',''))
        if tag=='meta' and a.get('name')=='description': self.description=bool(a.get('content'))
        if tag=='a' and a.get('href'): self.links.append(a['href'])
        if tag=='img' and a.get('src'): self.images.append(a['src'])
        if tag=='h1': self.h1+=1
        if tag=='title': self.title=True
        if tag=='iframe': self.iframes.append(a.get('src'))
        if tag=='script' and a.get('type')=='application/ld+json': self.script=True; self.payload=''
    def handle_data(self, data):
        if self.script:self.payload+=data
    def handle_endtag(self, tag):
        if tag=='script' and self.script:
            try:self.schemas.append(json.loads(self.payload))
            except Exception as e: errors.append(f'Invalid JSON-LD: {e}')
            self.script=False

def file_for(url):
    p=unquote(urlparse(url).path)
    return OUT / (p.lstrip('/')+'index.html' if p.endswith('/') else p.lstrip('/'))

caps=json.loads((ROOT/'data/capitulos.json').read_text())
articles=json.loads((ROOT/'data/articles.json').read_text())
config=json.loads((ROOT/'vercel.json').read_text())
redirects={}
for rule in config['redirects']:
    if 'has' in rule:continue
    source=rule['source']
    paths=source[9:-2].split('|') if source.startswith('/:legacy(') else [source.strip('/')]
    for p in paths:redirects['/'+p+'/']=rule['destination']

pages={}
for f in OUT.rglob('*.html'):
    if f.name=='404.html' or '/404/' in str(f):continue
    rel=f.relative_to(OUT).as_posix()
    path='/'+rel.removesuffix('index.html')
    if path in redirects:continue
    text=f.read_text()
    page=Page(text); pages[path]=page
    check(page.h1==1,f'{path}: expected one h1, got {page.h1}')
    check(page.title and page.description,f'{path}: title or description missing')
    check(page.canonical==[ORIGIN+path],f'{path}: wrong canonical {page.canonical}')
    check('simpsonnuevositio2026.vercel.app' not in text,f'{path}: wrong origin')
    for schema in page.schemas:
        check('aggregateRating' not in schema,f'{path}: unsupported rating')
        check(schema.get('@type')!='VideoObject',f'{path}: video metadata needs verified upload date')
        if schema.get('@type')=='FAQPage':
            for q in schema['mainEntity']:
                check(q['acceptedAnswer']['text'] in text,f'{path}: FAQ differs from visible text')

links=0
for path,page in pages.items():
    for link in page.links+page.images:
        parsed=urlparse(urljoin(ORIGIN+path,link))
        if parsed.netloc!='donsimpsononline.xyz':continue
        target=parsed.path
        if target.startswith('/_next/'):continue
        links+=1
        check(file_for(target).is_file() or target in redirects,f'{path}: missing {target}')

ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9','v':'http://www.google.com/schemas/sitemap-video/1.1'}
sitemap=ET.parse(OUT/'sitemap.xml')
urls=[e.text for e in sitemap.findall('.//s:loc',ns)]
check(len(urls)==len(set(urls)),'Duplicate sitemap URLs')
for url in urls:
    p=urlparse(url).path
    check(url.startswith(ORIGIN+'/') and p in pages,f'Sitemap entry missing: {url}')
    check(not any('noindex' in rule for rule in pages[p].robots),f'Sitemap includes noindex {url}')
    check(p not in redirects,f'Sitemap includes redirect {url}')
for c in caps:
    if c['url'] in redirects:
        check(ORIGIN+c['url'] not in urls, f"Redirected entry in sitemap {c['url']}")
        continue
    page=pages[c['url']]
    check(any('noindex' in rule for rule in page.robots)==(not bool(c['players'])),f"Wrong indexing on {c['url']}")
    check((ORIGIN+c['url'] in urls)==bool(c['players']),f"Wrong sitemap coverage on {c['url']}")
    if c['players']:check(any(src and src!='https://www.googletagmanager.com/ns.html?id=GTM-TSPLMFD' for src in page.iframes),f"Player absent from initial HTML {c['url']}")
    for alias in c['aliases']:
        if alias!=c['url']:check(redirects.get(alias)==redirects.get(c['url'],c['url']),f'Missing alias redirect {alias}')
for source,target in redirects.items():
    check(file_for(target).is_file(),f'Redirect destination missing: {source} -> {target}')
    check(target not in redirects,f'Redirect chain {source}')
video=ET.parse(OUT/'video-sitemap.xml')
videos=video.findall('s:url',ns)
for entry in videos:
    url=entry.find('s:loc',ns).text
    check(url in urls,f'Video entry not indexed {url}')
    player=entry.find('v:video/v:player_loc',ns)
    check(player is not None and player.text.startswith('https://'),f'Video without player {url}')
    check(entry.find('v:video/v:duration',ns) is None,'Unverified duration')
    check(entry.find('v:video/v:publication_date',ns) is None,'Unverified publication date')
check(len(videos)==sum(bool(c['players']) for c in caps),'Video sitemap count mismatch')
robots=(OUT/'robots.txt').read_text()
check('Disallow: /buscar' not in robots,'Search noindex blocked from crawling')
check('noindex' in ','.join(pages['/buscar/'].robots),'Search not noindex')
check('noindex' in (OUT/'404.html').read_text(),'404 not noindex')
for filename in ['feed.xml','atom.xml','video-sitemap.xml']:
    ET.parse(OUT/filename)
    check('simpsonnuevositio2026.vercel.app' not in (OUT/filename).read_text(),f'{filename}: wrong domain')
result={'checks':checks,'canonical_pages':len(pages),'internal_references':links,'sitemap_urls':len(urls),'video_entries':len(videos),'redirect_sources':len(redirects),'errors':errors}
(ROOT/'artifacts').mkdir(exist_ok=True)
(ROOT/'artifacts/seo-validation.json').write_text(json.dumps(result,indent=2,ensure_ascii=False))
print(json.dumps({**result,'errors':errors[:20]},indent=2,ensure_ascii=False))
raise SystemExit(bool(errors))
