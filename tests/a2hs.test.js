const {chromium,devices}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();
let ord={id:'11111111-1111-1111-1111-111111111111',num:'42',status:'waiting',created_at:new Date().toISOString(),shop_id:'s2'};
const mk=async(dev,standalone)=>{const ctx=await b.newContext({...devices[dev]});
 if(standalone) await ctx.addInitScript(()=>{Object.defineProperty(navigator,'standalone',{get:()=>true});});
 await ctx.route('**/*',async route=>{const u=new URL(route.request().url());
 if(u.host==='test.local'){let f=u.pathname.replace(/^\/+/,'')||'index.html';f=path.join((process.env.ROOT||require('path').join(__dirname,'..')),f);if(!fs.existsSync(f))return route.fulfill({status:404,body:''});const ct=f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html';return route.fulfill({status:200,contentType:ct,body:fs.readFileSync(f)});}
 if(!u.host.includes('supabase'))return route.abort();const j=d=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(d)});
 if(u.pathname.endsWith('/urturn_shops'))return j([{id:'s2',slug:'cafe',name:'Cafe',color:'#1E3A8A',active:true}]);
 if(u.pathname.endsWith('/urturn_orders'))return j([ord]);
 if(u.pathname.includes('create_order'))return j(ord.id);return j(null);});return ctx;};
// iPhone Safari
let ctx=await mk('iPhone 13',false);let p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('https://test.local/?s=cafe');await p.waitForTimeout(500);await p.fill('.big-input','42');await p.click('button[type=submit]');await p.waitForTimeout(1000);
console.log('safari url:',p.url());
const man=await p.evaluate(()=>{const l=document.querySelector('link[rel=manifest]');if(!l)return location.href;const h=l.href;return h.startsWith('data:')?JSON.parse(decodeURIComponent(h.split(',')[1])).start_url:'STATIC '+h;});
console.log('manifest start_url:',man);await ctx.close();
// iPhone home-screen app (separate storage) opens start_url
ctx=await mk('iPhone 13',true);p=await ctx.newPage();await p.goto(man);await p.waitForTimeout(1200);
console.log('app opened -> waiting screen:',await p.$$eval('.big-num, .num',x=>x.map(e=>e.textContent).join(',')),'| url',p.url());
// later: order done long ago -> goes to app home
ord={...ord,status:'done',done_at:new Date(Date.now()-3600e3).toISOString()};
await p.goto(man);await p.waitForTimeout(1500);console.log('old order ->',p.url(), await p.$('[data-scan]')?'scanner shown':'');
await ctx.close();
// Android: installed app opens ?v=app with shared storage -> jumps to active order
ord={...ord,status:'waiting',done_at:null};
ctx=await mk('Galaxy S9+',false);p=await ctx.newPage();await p.goto('https://test.local/?s=cafe');await p.waitForTimeout(500);await p.fill('.big-input','42');await p.click('button[type=submit]');await p.waitForTimeout(800);
await p.goto('https://test.local/?v=app');await p.waitForTimeout(1500);console.log('android app ->',p.url());
await b.close();})();
