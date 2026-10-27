const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
const root = process.cwd();
const episodes = require('../data/capitulos.json');
const articles = require('../data/articles.json');
const sources = [...new Set([...episodes.map(item => item.imagen), ...articles.map(item => item.image)].filter(src => src?.startsWith('/uploads/')))];
const target = path.join(root, 'public/media');
fs.mkdirSync(target, { recursive: true });
const manifest = {};
let originalBytes=0, optimizedBytes=0;
async function convert(src) {
  const input=path.join(root,'public',src);
  if(!fs.existsSync(input))return;
  const buffer=fs.readFileSync(input);
  const info=await sharp(buffer).metadata();
  const widths=[...new Set([Math.min(360,info.width),Math.min(720,info.width)])];
  const key=crypto.createHash('sha256').update(buffer).digest('hex').slice(0,14);
  const variants=[];
  for(const width of widths){
    const filename=`${key}-${width}.webp`;
    const output=path.join(target,filename);
    if(!fs.existsSync(output))await sharp(buffer).rotate().resize({width,withoutEnlargement:true}).webp({quality:78,effort:4}).toFile(output);
    variants.push({src:`/media/${filename}`,width});
  }
  const largest=variants.at(-1);
  originalBytes+=buffer.length;optimizedBytes+=fs.statSync(path.join(root,'public',largest.src)).size;
  manifest[src]={src:largest.src,width:info.width,height:info.height,srcSet:variants.map(v=>`${v.src} ${v.width}w`).join(', ')};
}
(async()=>{
  for(let i=0;i<sources.length;i+=4)await Promise.all(sources.slice(i,i+4).map(convert));
  const icon=fs.readFileSync('public/icon.svg');
  for(const size of [192,512])await sharp(icon).resize(size,size).png().toFile(`public/app-icon-${size}.png`);
  fs.writeFileSync('data/image-manifest.json',JSON.stringify(manifest));
  fs.mkdirSync('artifacts',{recursive:true});
  const result={images:Object.keys(manifest).length,originalBytes,optimizedBytes};
  fs.writeFileSync('artifacts/image-optimization.json',JSON.stringify(result,null,2));
  console.log(result);
})().catch(error=>{console.error(error);process.exit(1)});
