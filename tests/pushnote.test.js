const {chromium,devices}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['Galaxy S9+']});
let ord={id:'11111111-1111-1111-1111-111111111111',num:'42',status:'waiting',created_at:new Date().toISOString(),shop_id:'s2'};
await ctx.route('**/*',async route=>{const u=new URL(route.request().url());
 if(u.host==='test.local'){let f=u.pathname.replace(/^\/+/,'')||'index.html';f=path.join((process.env.ROOT||require('path').join(__dirname,'..')),f);if(!fs.existsSync(f))return route.fulfill({status:404,body:''});const ct=f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.png')?'image/png':'text/html';return route.fulfill({status:200,contentType:ct,body:fs.readFileSync(f)});}
 if(!u.host.includes('supabase'))return route.abort();const j=d=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(d)});
 if(u.pathname.endsWith('/urturn_shops'))return j([{id:'s2',slug:'cafe',name:'929 Specialty Coffee',color:'#7A2E1F',active:true}]);
 if(u.pathname.endsWith('/urturn_orders'))return j([ord]);if(u.pathname.includes('create_order'))return j(ord.id);return j(null);});
await ctx.addInitScript(()=>{try{Object.defineProperty(Notification,'permission',{get:()=>'default'});}catch(e){}});const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('https://test.local/?s=cafe');await p.waitForTimeout(500);await p.fill('.big-input','42');await p.click('button[type=submit]');await p.waitForTimeout(2500);
console.log('note',await p.$$eval('.push-note',x=>x.length),'dinged',await p.evaluate(()=>window.__ringRef().dinged));
await p.screenshot({path:'/tmp/push-note.png'});
await p.click('[data-a=pushx]');console.log('after x',await p.$$eval('.push-note',x=>x.length));await b.close();})();
