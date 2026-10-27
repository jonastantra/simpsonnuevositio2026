const { chromium }=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('fs');
const base=process.env.BASE_URL || 'http://127.0.0.1:3189';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']});
 const page=await browser.newPage();const errors=[];const results=[];
 page.on('pageerror',e=>errors.push(e.message));
 const routes=['/','/temporadas/','/category/temporada-1/','/category/temporada-34/','/primera-temporada-1-sin-blanca-navidad/','/primera-temporada-4-hogar-agridulce-hogar/','/blog/','/la-epoca-dorada-de-los-simpson-temporadas-3-a-8/','/buscar/','/no-existe-diseno/'];
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const route of routes){
   const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});await page.waitForTimeout(150);
   const view=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,bodyFont:getComputedStyle(document.body).fontSize,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),unsized:[...document.images].filter(i=>!i.getAttribute('width')||!i.getAttribute('height')).map(i=>i.src)}));
   results.push({width,route,status:response.status(),pass:view.scroll<=width && view.h1===1 && !view.broken.length && !view.unsized.length && response.status()===(route.includes('no-existe')?404:200),...view});
   if([390,1440].includes(width) && ['/', '/category/temporada-1/','/primera-temporada-1-sin-blanca-navidad/'].includes(route)){
    const height=await page.evaluate(()=>document.documentElement.scrollHeight);
    for(let y=0;y<height;y+=800){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(65)}
    await page.evaluate(async()=>{document.querySelectorAll("img").forEach(i=>i.loading="eager");await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));scrollTo(0,0)});await page.waitForTimeout(100);
    const label=route==='/'?'home':route.includes('/category/')?'season':'episode';
    await page.screenshot({path:`artifacts/design-${base.startsWith('https')?'public':'local'}-${label}-${width}.png`,fullPage:true});
   }
  }
 }
 await page.goto(base+'/buscar/?q=Sin+Blanca+Navidad',{waitUntil:'domcontentloaded'});
 await page.getByRole('link',{name:/Sin Blanca Navidad/i}).first().waitFor();
 results.push({test:'Search query URL',pass:await page.getByRole('link',{name:/Sin Blanca Navidad/i}).count()>0});
 await page.getByRole('button',{name:'Navidad',exact:true}).click();
 await page.waitForTimeout(250);
 results.push({test:'Search suggestion + shareable URL',pass:new URL(page.url()).searchParams.get('q')==='Navidad' && await page.locator('.episode-card').count()>0});
 await page.getByRole('searchbox').fill('temporada 3 Bart');await page.waitForTimeout(250);
 results.push({test:'Multi-term search',pass:await page.locator('.episode-card').count()>0});
 await page.goto(base+'/',{waitUntil:'domcontentloaded'});
 const summary=page.locator('.faq-list summary').first();await summary.click();
 results.push({test:'FAQ interaction',pass:await summary.evaluate(el=>el.parentElement.open)});
 await page.keyboard.press('Tab');
 const focus=await page.evaluate(()=>document.activeElement.tagName);
 results.push({test:'Keyboard focus continues after FAQ',pass:['SUMMARY','A','BUTTON'].includes(focus)});
 const result={base,cases:results.length,passed:results.filter(r=>r.pass).length,errors,results};
 fs.writeFileSync(`artifacts/design-${base.startsWith('https')?'public':'local'}-validation.json`,JSON.stringify(result,null,2));
 console.log(JSON.stringify({cases:result.cases,passed:result.passed,errors,failed:results.filter(r=>!r.pass)},null,2));
 await browser.close();if(errors.length || results.some(r=>!r.pass))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
