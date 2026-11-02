// Loyalty card: customer sees stamps, gift banner on the gift order, cashier sees the gift tag, admin has the setting.
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const ROOT=process.env.ROOT||path.join(__dirname,'..'), SHOTS=process.env.SHOTS;
(async()=>{
const b=await chromium.launch(); const now=Date.now();
const shop={id:'s2',slug:'cafe',name:'Cafe Nile',color:'#1E3A8A',active:true,open_at:null,close_at:null,review_url:'https://g.page/r/x',loyal_need:5,loyal_gift:'قهوة مجانية'};
let order={id:'11111111-1111-1111-1111-111111111111',num:'42',status:'waiting',created_at:new Date(now-60000).toISOString(),shop_id:'s2',source:'customer',has_push:true,gift:true};
let status={need:5,gift:'قهوة مجانية',n:3,this_gift:false};
const ctx=await b.newContext({viewport:{width:390,height:844}});
await ctx.addInitScript(()=>{ try{ localStorage.setItem('urturn.lang','ar'); }catch(e){} });
await ctx.route('**/*',async route=>{
  const u=new URL(route.request().url());
  if(u.host==='test.local'){ let f=u.pathname.replace(/^\/+/,'')||'index.html'; f=path.join(ROOT,f); if(!fs.existsSync(f)) return route.fulfill({status:404,body:''}); const ct=f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.json')?'application/json':f.endsWith('.png')?'image/png':f.endsWith('.svg')?'image/svg+xml':'text/html'; return route.fulfill({status:200,contentType:ct,body:fs.readFileSync(f)}); }
  if(u.host.includes('fonts.')) return route.fulfill({status:200,contentType:'text/css',body:''});
  if(!u.host.includes('supabase')) return route.abort();
  const p=u.pathname; const j=d=>route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','access-control-allow-headers':'*'},body:JSON.stringify(d)});
  if(route.request().method()==='OPTIONS') return j({});
  if(p.includes('/functions/v1/')) return j({ok:true});
  if(p.endsWith('/urturn_shops')) return j([shop]);
  if(p.endsWith('/urturn_orders')) return j([order]);
  const fn=p.split('/rpc/')[1];
  if(fn==='urturn_create_order') return j(order.id);
  if(fn==='urturn_set_device'){ status={...status,n:5,this_gift:true}; return j(status); }
  if(fn==='urturn_loyal_status') return j(status);
  if(fn==='urturn_public_status') return j({locked:false});
  if(fn==='urturn_staff_check'||fn==='urturn_admin_ok'||fn==='urturn_admin_check') return j(true);
  if(fn==='urturn_staff_status') return j({plan:'m1',ends_at:new Date(now+20*864e5).toISOString(),locked:false});
  if(fn==='urturn_admin_health') return j({db_mb:9,orders_total:1,shops:[],errors:[]});
  if(fn==='urturn_admin_daily') return j([]);
  if(fn==='urturn_admin_shops2') return j([{slug:'cafe',name:'Cafe Nile',active:true,plan:'m1',ends_at:new Date(now+20*864e5).toISOString(),orders_7d:3,avg_rating:4.5}]);
  return j(null);
});
const errs=[]; const pg=async u=>{ const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(e.message)); await p.goto('https://test.local/'+u); await p.waitForTimeout(1500); return p; };
// customer, fresh phone: card with 3 of 5
let p=await pg('?s=cafe');
const has=await p.$('[data-loyal]');
if(!has){ console.log('loyal old'); await b.close(); return; }
const on=await p.$$eval('.loyal-dots i.on',x=>x.length);
if(SHOTS) await p.screenshot({path:SHOTS+'/l-enter.png'});
await p.fill('.big-input','42'); await p.click('button[type=submit]'); await p.waitForTimeout(1500);
const gift=await p.$$eval('.loyal.gift-on',x=>x.length); await p.evaluate(()=>document.querySelectorAll('.gate').forEach(g=>g.remove()));
if(SHOTS) await p.screenshot({path:SHOTS+'/l-wait.png'});
// done with a stamp
order={...order,status:'done',ring_at:new Date().toISOString(),done_at:new Date().toISOString(),gift:false}; status={need:5,gift:'قهوة مجانية',n:4,this_gift:false};
await p.waitForTimeout(4500);
const plus=await p.$$eval('.loyal-plus',x=>x.length);
if(SHOTS){ await p.evaluate(()=>window.scrollTo(0,9999)); await p.screenshot({path:SHOTS+'/l-done.png'}); }
await p.close();
// cashier sees the gift tag
order={...order,status:'waiting',gift:true,done_at:null,ring_at:null};
p=await pg('?s=cafe&v=cashier&k=K');
const tag=await p.$$eval('.gift-tag',x=>x.length);
if(SHOTS) await p.screenshot({path:SHOTS+'/l-cash.png'});
await p.close();
// admin setting
p=await pg('?v=admin&k=K'); await p.click('[data-edit="cafe"]'); await p.waitForTimeout(800);
const need=await p.$eval('#a-lneed',e=>e.value).catch(()=>'');
if(SHOTS){ await p.$eval('#a-lneed',e=>e.scrollIntoView({block:'center'})); await p.screenshot({path:SHOTS+'/l-admin.png'}); }
await p.close();
console.log(`loyal enter${on} gift${gift} plus${plus} tag${tag} admin${need}`);
if(errs.length) console.log('ERR '+errs.join(' | '));
await b.close();})();
