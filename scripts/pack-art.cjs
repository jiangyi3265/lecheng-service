// Lossless packaging: keep original bytes or encode exact visible pixels, whichever is smaller.
const fs = require('node:fs/promises');
const path = require('node:path');
const vm = require('node:vm');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
async function main() {
  const output = path.join(root, 'static/art');
  await fs.mkdir(output, { recursive: true });
  const groups = new Map();
  for (const [component, constant, directory] of [['NativeArt','assets','captures'],['ReferenceArt','regions',null]]) {
    const code = await fs.readFile(path.join(root,'components',component+'.vue'),'utf8');
    const map = vm.runInNewContext('('+code.match(new RegExp('const '+constant+' = (\\{[\\s\\S]*?\\n\\});'))[1]+')');
    for (const [name, values] of Object.entries(map)) {
      const [file,x,y,width,height] = directory ? values : ['reference',...values];
      const input = path.join(root,'art-source',directory||'',file+'.png');
      if (!groups.has(input)) groups.set(input,[]);
      groups.get(input).push({name:(directory?'native-':'reference-')+name,x,y,width,height});
    }
  }
  const manifest = {}, files = new Map();
  for (const [input, items] of groups) {
    const original = await fs.readFile(input), meta = await sharp(input).metadata();
    let sum = 0;
    for (const item of items) {
      const rect = {left:item.x,top:item.y,width:item.width,height:item.height};
      const png = await sharp(input).extract(rect).png({compressionLevel:9,adaptiveFiltering:true}).toBuffer();
      // Bundled artwork uses PNG/JPEG for consistent device decoding.
      item.ext = 'png';
      item.bytes = png;
      const before = await sharp(input).extract(rect).ensureAlpha().raw().toBuffer();
      const after = await sharp(item.bytes).ensureAlpha().raw().toBuffer();
      if (!before.equals(after)) throw new Error('Pixel mismatch: '+item.name);
      sum += item.bytes.length;
    }
    if (original.length < sum) {
      const filename = path.basename(input,'.png')+'.'+(meta.format === 'jpeg'?'jpg':meta.format);
      files.set(filename,original);
      for(const item of items) manifest[item.name]={src:'/static/art/'+filename,width:meta.width,height:meta.height,x:item.x,y:item.y};
    } else {
      for(const item of items) {
        const filename=item.name+'.'+item.ext;
        files.set(filename,item.bytes);
        manifest[item.name]={src:'/static/art/'+filename,width:item.width,height:item.height,x:0,y:0};
      }
    }
  }
  for(const f of await fs.readdir(output)) if(!files.has(f)) await fs.unlink(path.join(output,f));
  for(const [name,bytes] of files) await fs.writeFile(path.join(output,name),bytes);
  await fs.writeFile(path.join(root,'data/art-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  console.log('Verified lossless artwork:', [...files.values()].reduce((n,b)=>n+b.length,0),'bytes');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
