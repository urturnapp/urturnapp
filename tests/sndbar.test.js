const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:400,height:850}});let orders=[];
await ctx.route('**/*',async route=>{const u=new URL(route.request().url());
 if(u.host==='test.local'){let f=u.pathname.replace(/^\/+/,'')||'index.html';f=path.join((process.env.ROOT||require('path').join(__dirname,'..')),f);if(!fs.existsSync(f))return route.fulfill({status:404,body:''});const ct=f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html';return route.fulfill({status:200,contentType:ct,body:fs.readFileSync(f)});}
 if(!u.host.includes('supabase'))return route.abort();const j=d=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(d)});
 if(u.pathname.endsWith('/urturn_shops'))return j([{id:'s2',slug:'cafe',name:'Cafe',color:'#1E3A8A',active:true}]);
 if(u.pathname.endsWith('/urturn_orders'))return j(orders);const fn=u.pathname.split('/rpc/')[1];
 if(fn==='urturn_staff_check')return j(true);if(fn==='urturn_staff_status')return j({plan:'m1',ends_at:'2099-01-01',locked:false});return j(null);});
const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('https://test.local/?s=cafe&v=cashier&k=K');await p.waitForTimeout(2000);
console.log('bar before tap',await p.isVisible('.snd-bar'));await p.click('.snd-bar');await p.waitForTimeout(800);
await p.evaluate(()=>window.__ringRef().ctx.suspend());await p.waitForTimeout(6000);
console.log('bar after audio suspended (should stay hidden)',await p.isVisible('.snd-bar'));
let n=0;const R=await p.evaluateHandle(()=>window.__ringRef());await p.evaluate(()=>{window.__d=0;const a=window.__ringRef().dEl;const o=a.play.bind(a);a.play=()=>{window.__d++;return o();};});
orders=[{id:'a1',num:'77',status:'waiting',source:'customer',created_at:new Date().toISOString(),shop_id:'s2'}];await p.waitForTimeout(4500);
console.log('ding plays on new order',await p.evaluate(()=>window.__d));await b.close();})();
