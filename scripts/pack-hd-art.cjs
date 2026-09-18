// Higher-resolution crops from the official App Store screenshots (1242 × 2688).
// Generated JPEGs retain twice the display resolution without exceeding the mini-program budget.
const sharp=require('sharp');
const fs=require('node:fs/promises');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const regions={
 'native-travel':['page-4.png',218,932,806,288],
 'native-drug-vosoritide':['page-3.png',244,2059,178,184],
 'reference-hero':['page-3.png',189,800,864,159],
};
(async()=>{
 const map={}; await fs.mkdir(path.join(root,'static/hd'),{recursive:true});
 for(const file of await fs.readdir(path.join(root,'static/hd'))) if(!regions[file.replace(/\.jpg$/,'')]) await fs.unlink(path.join(root,'static/hd',file));
 for(const [key,[file,left,top,width,height]] of Object.entries(regions)){
  const source=path.join(root,'art-source/store',file);
  const dest=path.join(root,'static/hd',key+'.jpg');
  await sharp(source).extract({left,top,width,height}).jpeg({quality:94,chromaSubsampling:'4:4:4',mozjpeg:true}).toFile(dest);
  map[key]={src:'/static/hd/'+key+'.jpg',width,height,x:0,y:0};
 }
 await fs.writeFile(path.join(root,'data/hd-art-manifest.json'),JSON.stringify(map,null,2)+'\n');
})();
