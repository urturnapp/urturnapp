const {chromium,devices}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['Galaxy S9+']});
let ord={id:'11111111-1111-1111-1111-111111111111',num:'42',status:'waiting',created_at:new Date().toISOString(),shop_id:'s2'};
await ctx.route('**/*',async route=>{const u=new URL(route.request().url());
 if(u.host==='test.local'){let f=u.pathname.replace(/^\/+/,'')||'index.html';f=path.join((process.env.ROOT||require('path').join(__dirname,'..')),f);if(!fs.existsSync(f))return route.fulfill({status:404,body:''});const ct=f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.png')?'image/png':'text/html';return route.fulfill({status:200,contentType:ct,body:fs.readFileSync(f)});}
 if(!u.host.includes('supabase'))return route.abort();const j=d=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(d)});
 if(u.pathname.endsWith('/urturn_shops'))return j([{id:'s2',slug:'cafe',name:'929 Specialty Coffee',color:'#7A2E1F',active:true}]);
 if(u.pathname.endsWith('/urturn_orders'))return j([ord]);if(u.pathname.includes('create_order'))return j(ord.id);return j(null);});
await ctx.addInitScript(()=>{try{Object.defineProperty(Notification,'permission',{get:()=>'default'});}catch(e){}});
const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('https://test.local/?s=cafe');await p.waitForTimeout(500);
await p.evaluate(()=>{Push.ask=()=>Promise.resolve('granted');Push.subscribe=()=>Promise.resolve(true);const e=new Event('beforeinstallprompt');e.prompt=()=>{window.__prompted=1;};e.userChoice=Promise.resolve({outcome:'accepted'});window.dispatchEvent(e);});
await p.fill('.big-input','42');await p.click('button[type=submit]');await p.waitForTimeout(1500);
const go=await p.$('.gate [data-a=push]');console.log('alert gate',go?1:0);if(go){await go.click();await p.waitForTimeout(800);}
const ig=await p.$('.gate [data-a=gateinst]');console.log('install gate',ig?1:0);await p.waitForTimeout(2500);console.log('still',await p.$$eval('.gate',x=>x.length));await p.screenshot({path:'/tmp/gate-inst.png'});
if(ig){await ig.click();await p.waitForTimeout(500);}console.log('prompted',await p.evaluate(()=>window.__prompted||0),'gates left',await p.$$eval('.gate',x=>x.length));await b.close();})();
