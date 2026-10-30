const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
(async()=>{
const b=await chromium.launch(); const issues=[];
const now=Date.now();
const shop={id:'s2',slug:'cafe',name:'Cafe Nile',color:'#1E3A8A',active:true,open_at:null,close_at:null,review_url:'https://g.page/r/x'};
const orders=[
 {id:'11111111-1111-1111-1111-111111111111',num:'42',status:'waiting',created_at:new Date(now-5*60000).toISOString(),shop_id:'s2',eta_at:new Date(now+5*60000).toISOString(),eta_seen:null,source:'customer'},
 {id:'22222222-2222-2222-2222-222222222222',num:'43',status:'ready',created_at:new Date(now-9*60000).toISOString(),ready_at:new Date(now-60000).toISOString(),ring_at:new Date(now-60000).toISOString(),shop_id:'s2',source:'staff'},
 {id:'33333333-3333-3333-3333-333333333333',num:'40',status:'done',created_at:new Date(now-30*60000).toISOString(),done_at:new Date(now-20*60000).toISOString(),rating:5,shop_id:'s2',source:'customer'}];
async function mk(w,h){
 const ctx=await b.newContext({viewport:{width:w,height:h}});
 await ctx.route('**/*',async route=>{
  const u=new URL(route.request().url());
  if(u.host==='test.local'){ let f=u.pathname.replace(/^\/+/,'')||'index.html'; f=path.join((process.env.ROOT||require('path').join(__dirname,'..')),f); if(!fs.existsSync(f)) return route.fulfill({status:404,body:''}); const ct=f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.html')?'text/html':f.endsWith('.json')?'application/json':f.endsWith('.svg')?'image/svg+xml':f.endsWith('.png')?'image/png':f.endsWith('.jpg')?'image/jpeg':f.endsWith('.mp4')?'video/mp4':'application/octet-stream'; return route.fulfill({status:200,contentType:ct,body:fs.readFileSync(f)}); }
  if(u.host.includes('fonts.')) return route.fulfill({status:200,contentType:'text/css',body:''});
  if(!u.host.includes('supabase')) return route.abort();
  const p=u.pathname; let body={}; try{body=route.request().postDataJSON()||{}}catch(e){} const j=d=>route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','access-control-allow-headers':'*'},body:JSON.stringify(d)});
  if(route.request().method()==='OPTIONS') return j({});
  if(p.includes('/functions/v1/')) return j({ok:true});
  if(p.endsWith('/urturn_shops')){ const sl=(u.searchParams.get('slug')||'').slice(3); return j(sl==='cafe'||sl==='demo'?[{...shop,slug:sl,id:sl==='demo'?'s1':'s2'}]:[]); }
  if(p.endsWith('/urturn_orders')){ const id=(u.searchParams.get('id')||'').slice(3); return j(id?orders.filter(o=>o.id===id):orders); }
  const fn=p.split('/rpc/')[1];
  if(fn==='urturn_create_order') return j(orders[0].id);
  if(fn==='urturn_public_status') return j({locked:false});
  if(fn==='urturn_staff_check') return j(true);
  if(fn==='urturn_staff_status') return j({plan:'m1',ends_at:new Date(now+20*864e5).toISOString(),locked:false,whatsapp:'+201055602979'});
  if(fn==='urturn_admin_shops2') return j([{slug:'cafe',name:'Cafe Nile',active:true,plan:'trial',ends_at:new Date(now+2*864e5).toISOString(),orders_7d:3,avg_rating:4.5}]);
  if(fn==='urturn_admin_health') return j({db_mb:9.4,orders_total:120,shops:[{slug:'cafe',name:'Cafe Nile',active:true,open_at:null,close_at:null,last_order:new Date(now-4*3600e3).toISOString(),orders_24h:12,orders_7d:80,stuck:0},{slug:'demo',name:'Demo',active:true,last_order:null,orders_24h:0,orders_7d:0,stuck:2}],errors:[{day:'2026-10-29',slug:'cafe',view:'customer',msg:"TypeError: Cannot read properties of null (reading 'x') @app.js:12",ua:'Mozilla iPhone',n:3,last_at:new Date(now-600000).toISOString()}]});
  if(fn==='urturn_admin_get_contact') return j({whatsapp:'+201055602979'});
  if(fn==='urturn_admin_check'||fn==='urturn_admin_ok') return j(true);
  return j(null);
 });
 return ctx;
}
const routes=['','?v=demo','?s=cafe','?s=cafe&v=cashier&k=K','?s=cafe&v=owner&k=K','?v=admin&k=K','?s=nope'];
for(const [w,h] of [[390,844],[1280,900]]) for(const lg of ['ar','en']){
 const ctx=await mk(w,h);
 await ctx.addInitScript(l=>{ try{ localStorage.setItem('urturn.lang',l); }catch(e){} },lg);
 for(const r of routes){
  const p=await ctx.newPage(); const errs=[];
  p.on('pageerror',e=>errs.push('pageerror '+e.message));
  p.on('console',m=>{ if(m.type()==='error'&&!/ERR_FAILED|404/.test(m.text())) errs.push('console '+m.text()); });
  const t0=Date.now(); await p.goto('https://test.local/'+r,{waitUntil:'load'}); await p.waitForTimeout(1500);
  const sw=await p.evaluate(()=>document.documentElement.scrollWidth); const txt=(await p.textContent('body')).trim().length;
  if(sw>w+1) errs.push('overflow '+sw);
  if(txt<40) errs.push('empty page');
  const und=await p.evaluate(()=>/undefined|NaN|\[object/.test(document.body.innerText));
  if(und) errs.push('text has undefined/NaN');
  if(errs.length) issues.push(`${w} ${lg} ${r||'home'}: ${errs.join(' | ')}`);
  await p.close();
 }
 await ctx.close();
}
console.log(issues.length?issues.join('\n'):'ALL CLEAN');
await b.close();})();
