const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(process.argv[2] || 'dist/build/mp-weixin');
function bytes(dir){return fs.readdirSync(dir,{withFileTypes:true}).reduce((n,e)=>n+(e.isDirectory()?bytes(path.join(dir,e.name)):fs.statSync(path.join(dir,e.name)).size),0)}
for(const item of Object.values(require('../data/art-manifest.json'))){if(!fs.existsSync(path.join(root,item.src))) throw Error('Missing artwork: '+item.src);}
const size=bytes(root),limit=2*1024*1024;
console.log(`Package: ${size} bytes (${(size/1024/1024).toFixed(2)} MiB); limit: 2 MiB`);
if(size>=limit) process.exitCode=1;
// Reject mixed output from different compiler runs before uploading.
function validateStyles(dir) {
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    const file=path.join(dir,entry.name);
    if(entry.isDirectory()) { validateStyles(file); continue; }
    if(!file.endsWith('.wxss')) continue;
    const template=file.slice(0,-5)+'.wxml';
    if(!fs.existsSync(template)) continue;
    const css=fs.readFileSync(file,'utf8'),wxml=fs.readFileSync(template,'utf8');
    const ids=[...new Set(css.match(/data-v-[a-f0-9]+/g)||[])];
    for(const id of ids) if(!wxml.includes(id)) throw Error(`Mismatched scoped styles: ${file} (${id}). Rebuild using one compiler for this output directory.`);
  }
}
validateStyles(root);
console.log('Template/style scope identifiers match.');
for(const item of Object.values(require('../data/art-manifest.json'))) {
  const file=path.join(root,item.src),content=fs.readFileSync(file);
  const png=content.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const jpg=content[0]===255&&content[1]===216&&content[2]===255;
  if(!png&&!jpg) throw Error('Unsupported bundled image format: '+file);
  const source=path.resolve(__dirname,'..','.'+item.src);
  if(!content.equals(fs.readFileSync(source))) throw Error('Stale artwork: '+file);
}
console.log('All packaged image paths, PNG/JPEG signatures and bytes verified.');
