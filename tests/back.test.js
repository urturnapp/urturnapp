const {chromium,devices}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();
for(const dn of ['iPhone 13','Galaxy S9+']){
const ctx=await b.newContext({...devices[dn]});let fail=0;
let ord={id:'11111111-1111-1111-1111-111111111111',num:'42',status:'waiting',created_at:new Date().toISOString(),shop_id:'s2'};
await ctx.route('**/*',async route=>{const u=new URL(route.request().url());
 if(u.host==='test.local'){let f=u.pathname.replace(/^\/+/,'')||'index.html';f=path.join((process.env.ROOT||require('path').join(__dirname,'..')),f);if(!fs.existsSync(f))return route.fulfill({status:404,body:''});const ct=f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html';return route.fulfill({status:200,contentType:ct,body:fs.readFileSync(f)});}
 if(!u.host.includes('supabase'))return route.abort();const j=d=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(d)});
 if(u.pathname.endsWith('/urturn_shops'))return j([{id:'s2',slug:'cafe',name:'Cafe',color:'#1E3A8A',active:true}]);
 if(u.pathname.endsWith('/urturn_orders')){ if(fail>0){fail--;return route.abort();} return j([ord]);}
 if(u.pathname.includes('create_order'))return j(ord.id);return j(null);});
const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('https://test.local/?s=cafe');await p.waitForTimeout(500);await p.fill('.big-input','42');await p.click('button[type=submit]');await p.waitForTimeout(1200);
// go to background
await p.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>window.__vis||'visible'});window.__vis='hidden';document.dispatchEvent(new Event('visibilitychange'));});
ord={...ord,status:'ready',ring_at:new Date().toISOString(),ready_at:new Date().toISOString()};
fail=1; // first request after waking fails (network waking)
await p.waitForTimeout(500);
const t0=Date.now();
await p.evaluate(()=>{window.__vis='visible';document.dispatchEvent(new Event('visibilitychange'));});
await p.waitForSelector('.ringing',{timeout:8000});console.log(dn,'ring shown after',Date.now()-t0,'ms');
}
await b.close();})();
