const {chromium,devices}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['Galaxy S9+']});
await ctx.route('**/*',async route=>{const u=new URL(route.request().url());
 if(u.host==='test.local'){let f=u.pathname.replace(/^\/+/,'')||'index.html';f=path.join((process.env.ROOT||require('path').join(__dirname,'..')),f);if(!fs.existsSync(f))return route.fulfill({status:404,body:''});const ct=f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.png')?'image/png':'text/html';return route.fulfill({status:200,contentType:ct,body:fs.readFileSync(f)});}
 if(!u.host.includes('supabase'))return route.abort();const j=d=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(d)});
 if(u.pathname.endsWith('/urturn_shops'))return j([{id:'s2',slug:'cafe',name:'Cafe',color:'#7A2E1F',active:true}]);return j([]);});
const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('https://test.local/?s=cafe');await p.waitForTimeout(600);
await p.fill('.big-input','55');
await p.evaluate(()=>{const e=new Event('beforeinstallprompt');e.prompt=()=>{window.__prompted=1;};e.userChoice=Promise.resolve({outcome:'accepted'});window.dispatchEvent(e);});
await p.waitForTimeout(500);
console.log('note',await p.$$eval('.install-note',x=>x.length),'input kept',await p.inputValue('.big-input'),'old btn',await p.$$eval('[data-install]',x=>x.length));
await p.click('.install-note [data-a=install]');await p.waitForTimeout(300);console.log('prompted',await p.evaluate(()=>window.__prompted),'note after',await p.$$eval('.install-note',x=>x.length));
const i=await b.newContext({...devices['iPhone 13']});const q=await i.newPage();await q.route('**/*',r=>ctx._routes?r.continue():r.abort());await b.close();})();
