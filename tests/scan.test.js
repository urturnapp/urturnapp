const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),cp=require('child_process');
(async()=>{
// 1) make a QR image
let b=await chromium.launch();
let p=await b.newPage({viewport:{width:640,height:480}});
await p.setContent(`<html><body style="margin:0;background:#fff;display:grid;place-items:center;height:480px"><div id=q></div><script>${fs.readFileSync(''+(process.env.ROOT||require('path').join(__dirname,'..'))+'/qrcode.js','utf8')}</script><script>const q=qrcode(0,'M');q.addData('https://urturnapp.github.io/urturnapp/?s=cafe');q.make();document.getElementById('q').innerHTML=q.createImgTag(8,8);</script></body></html>`);
await p.screenshot({path:''+(process.env.OUT||'/tmp')+'/qr.png'}); await b.close();
cp.execSync('ffmpeg -y -loglevel error -loop 1 -i '+(process.env.OUT||'/tmp')+'/qr.png -t 3 -pix_fmt yuv420p '+(process.env.OUT||'/tmp')+'/qr.y4m');
// 2) run app with fake camera, standalone
b=await chromium.launch({args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--use-file-for-fake-video-capture='+(process.env.OUT||'/tmp')+'/qr.y4m']});
const ctx=await b.newContext({viewport:{width:390,height:844},permissions:['camera']});
await ctx.addInitScript(()=>{ Object.defineProperty(navigator,'standalone',{get:()=>true}); });
await ctx.route('**/*',async route=>{
  const u=new URL(route.request().url());
  if(u.host==='test.local'){ let f=u.pathname.replace(/^\/+/,'')||'index.html'; f=path.join((process.env.ROOT||require('path').join(__dirname,'..')),f); if(!fs.existsSync(f)) return route.fulfill({status:404,body:''}); const ct=f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.html')?'text/html':f.endsWith('.png')?'image/png':'application/octet-stream'; return route.fulfill({status:200,contentType:ct,body:fs.readFileSync(f)}); }
  if(!u.host.includes('supabase')) return route.abort();
  const j=d=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(d)});
  if(u.pathname.endsWith('/urturn_shops')) return j([{id:'s2',slug:'cafe',name:'Cafe Nile',color:'#1E3A8A',active:true}]);
  if(u.pathname.endsWith('/urturn_orders')) return j([]);
  if(u.pathname.includes('urturn_public_status')) return j({locked:false});
  return j(null);
});
p=await ctx.newPage(); p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('https://test.local/'); await p.waitForTimeout(800);
await p.screenshot({path:''+(process.env.OUT||'/tmp')+'/apphome.png'});
await p.click('[data-scan]'); await p.waitForTimeout(500);
await p.screenshot({path:''+(process.env.OUT||'/tmp')+'/scanning.png'});
await p.waitForURL(/s=cafe/,{timeout:10000}).catch(()=>{});
console.log('url after scan:',p.url());
await p.waitForTimeout(1000);
await p.screenshot({path:''+(process.env.OUT||'/tmp')+'/aftscan.png'});
await p.goto('https://test.local/'); await p.waitForTimeout(800);
await p.screenshot({path:''+(process.env.OUT||'/tmp')+'/apphome2.png'});
await b.close();})();
