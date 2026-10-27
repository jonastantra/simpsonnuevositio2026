const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('fs');
const base = process.env.BASE_URL || 'http://127.0.0.1:3187';
(async () => {
  const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH, args:['--no-sandbox']});
  const context = await browser.newContext();
  const page = await context.newPage();
  const results=[]; const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  for (const width of [390,1440]) {
    await page.setViewportSize({width,height:900});
    for (const route of ['/','/temporadas/','/category/temporada-1/','/primera-temporada-1-sin-blanca-navidad/','/primera-temporada-4-hogar-agridulce-hogar/','/no-existe-seo-20261027/']) {
      const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});
      await page.waitForTimeout(400);
      const dimensions=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelector('h1')?.innerText,brokenImages:[...document.images].filter(i=>i.complete && !i.naturalWidth).map(i=>i.src)}));
      const pass=dimensions.scroll<=width && !dimensions.brokenImages.length && response.status()===(route.includes('no-existe')?404:200);
      results.push({width,route,status:response.status(),pass,...dimensions});
      if(route==='/') {
        const height=await page.evaluate(()=>document.documentElement.scrollHeight);
        for(let y=0;y<height;y+=750){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(80);}
        await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(200);
        await page.screenshot({path:`artifacts/${base.startsWith('https')?'public':'local'}-home-${width}.png`,fullPage:true});
      }
    }
  }
  await page.goto(base+'/buscar/?q=sin+blanca+navidad',{waitUntil:'domcontentloaded'});
  await page.getByRole('link',{name:/Sin Blanca Navidad/i}).first().waitFor();
  results.push({test:'query search',pass:await page.getByRole('link',{name:/Sin Blanca Navidad/i}).count()>0});
  await page.getByRole('searchbox').last().fill('temporada 3 Bart');
  await page.waitForTimeout(400);
  const searchCount=await page.locator('section a[href*="/"]').filter({hasText:/Bart/i}).count();
  results.push({test:'multi-term search',pass:searchCount>0,count:searchCount});
  await page.goto(base+'/primera-temporada-1-sin-blanca-navidad/',{waitUntil:'domcontentloaded'});
  const iframe=page.locator('.video-frame iframe');
  results.push({test:'player iframe visible without click',pass:await iframe.count()===1 && await iframe.isVisible(),src:await iframe.getAttribute('src')});
  await page.goto(base+'/primera-temporada-4-hogar-agridulce-hogar/',{waitUntil:'domcontentloaded'});
  results.push({test:'missing source explicit message',pass:await page.getByText('No hay reproductor disponible para esta ficha.',{exact:false}).count()>0});
  const result={base,results,errors};
  fs.writeFileSync(`artifacts/${base.startsWith('https')?'public':'local'}-browser.json`,JSON.stringify(result,null,2));
  console.log(JSON.stringify(result,null,2));
  await browser.close();
  if(errors.length || results.some(result=>!result.pass))process.exitCode=1;
})().catch(error=>{console.error(error);process.exit(1)});
