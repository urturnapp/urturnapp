const {chromium,devices}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();
for(const dn of ['iPhone 13','Galaxy S9+']){
const ctx=await b.newContext({...devices[dn]});
await ctx.route('**/*',async route=>{const u=new URL(route.request().url());
 if(u.host==='test.local'){let f=u.pathname.replace(/^\/+/,'')||'index.html';f=path.join(process.env.ROOT,f);if(!fs.existsSync(f))return route.fulfill({status:404,body:''});const ct=f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html';return route.fulfill({status:200,contentType:ct,body:fs.readFileSync(f)});}
 if(!u.host.includes('supabase'))return route.abort();return route.fulfill({status:200,contentType:'application/json',body:'[]'});});
const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('https://test.local/#contact');await p.waitForTimeout(2500);
const top=await p.evaluate(()=>{const e=document.getElementById('contact');return e?Math.round(e.getBoundingClientRect().top):99999});console.log('contact link', Math.abs(top)<250?'ok':'off '+top);
}await b.close();})();
