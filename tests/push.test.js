const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
(async()=>{
const b=await chromium.launch(); const calls=[];
const ctx=await b.newContext({viewport:{width:400,height:850}}); await ctx.grantPermissions(['notifications'],{origin:'https://test.local'});
let ord={id:'11111111-1111-1111-1111-111111111111',num:'42',status:'waiting',created_at:new Date().toISOString(),shop_id:'s2'};
await ctx.route('**/*',async route=>{
  const u=new URL(route.request().url());
  if(u.host==='test.local'){ let f=u.pathname.replace(/^\/+/,'')||'index.html'; f=path.join((process.env.ROOT||require('path').join(__dirname,'..')),f); if(!fs.existsSync(f)) return route.fulfill({status:404,body:''}); const ct=f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.html')?'text/html':'application/octet-stream'; return route.fulfill({status:200,contentType:ct,body:fs.readFileSync(f)}); }
  if(!u.host.includes('supabase')) return route.abort();
  const p=u.pathname; let body={}; try{body=route.request().postDataJSON()||{}}catch(e){} const j=d=>route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','access-control-allow-headers':'*'},body:JSON.stringify(d)});
  if(route.request().method()==='OPTIONS') return j({});
  if(p.includes('/functions/v1/')){ calls.push(['FN',body]); return j({ok:true}); }
  if(p.endsWith('/urturn_shops')) return j([{id:'s2',slug:'cafe',name:'Cafe Nile',color:'#1E3A8A',active:true}]);
  if(p.endsWith('/urturn_orders')) return j([ord]);
  const fn=p.split('/rpc/')[1]; calls.push([fn,body]);
  if(fn==='urturn_create_order') return j(ord.id);
  if(fn==='urturn_public_status') return j({locked:false});
  if(fn==='urturn_staff_check') return j(true);
  if(fn==='urturn_staff_status') return j({plan:'m1',ends_at:'2099-01-01',locked:false});
  return j(null);
});
const p=await ctx.newPage(); p.on('pageerror',e=>console.log('ERR',e.message)); p.on('console',m=>{ if(m.type()==='error') console.log('CONSOLE',m.text()); });
await p.goto('https://test.local/?s=cafe'); await p.waitForTimeout(800);
await p.fill('.big-input','42'); await p.click('button[type=submit]'); await p.waitForTimeout(4000);
await p.screenshot({path:''+(process.env.OUT||'/tmp')+'/push-wait.png'});
console.log('sw', await p.evaluate(async()=>{ const r=await navigator.serviceWorker.getRegistration(); return r?r.scope:null; }));
const c=await ctx.newPage(); c.on('pageerror',e=>console.log('ERR2',e.message));
await c.goto('https://test.local/?s=cafe&v=cashier&k=K'); await c.waitForTimeout(1200);
await c.click('[data-a="ready"]'); await c.waitForTimeout(800);
console.log(JSON.stringify(calls.filter(x=>x[0]!=='urturn_public_status').map(x=>x[0]+':'+JSON.stringify(x[1]).slice(0,120))));
await b.close();})();
