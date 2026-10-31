// Admin: "orders per day" panel shows today's count, the trend and 14 day bars per shop.
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();
for(const mode of ['data','missing']){
const ctx=await b.newContext({viewport:{width:1200,height:1000}});
await ctx.route('**/*',async route=>{const u=new URL(route.request().url());
 if(u.host==='test.local'){let f=u.pathname.replace(/^\/+/,'')||'index.html';f=path.join(process.env.ROOT||path.join(__dirname,'..'),f);if(!fs.existsSync(f))return route.fulfill({status:404,body:''});const ct=f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.png')?'image/png':'text/html';return route.fulfill({status:200,contentType:ct,body:fs.readFileSync(f)});}
 if(!u.host.includes('supabase'))return route.abort();
 const j=(d,s=200)=>route.fulfill({status:s,contentType:'application/json',body:JSON.stringify(d)});
 const fn=u.pathname.split('/rpc/')[1];
 if(fn==='urturn_admin_shops2')return j([{slug:'cafe',name:'Cafe Nile',active:true,plan:'m1',ends_at:new Date(Date.now()+20*864e5).toISOString(),orders_7d:3,avg_rating:4.5}]);
 if(fn==='urturn_admin_health')return j({db_mb:9,orders_total:1,shops:[],errors:[]});
 if(fn==='urturn_admin_daily'){ if(mode==='missing')return j({message:'function not found',code:'PGRST202'},404);
   const days=[...Array(14).keys()].map(i=>({d:new Date(Date.UTC(2026,9,18+i)).toISOString().slice(0,10),n:i<7?2:(i===13?9:4),p:i===13?6:1}));
   return j([{slug:'cafe',name:'Cafe Nile',days}]);}
 return j(null);});
const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('https://test.local/?v=admin&k=K');await p.waitForTimeout(1500);
const has=await p.$('[data-daily]');if(!has){console.log('daily old');await b.close();return;}
const txt=await p.$eval('[data-daily]',e=>e.innerText.replace(/\s+/g,' '));
if(mode==='data'){const bars=await p.$$eval('[data-bars] > div',x=>x.length);
 console.log('daily bars',bars,'today9',/9/.test(txt)?1:0,'trend',/▲ 136%/.test(txt)?'up':'no:'+txt.slice(0,200));
 await p.screenshot({path:'/tmp/claude-0/daily.png',clip:{x:0,y:0,width:1200,height:700}});}
else console.log('daily missing msg',/daily_orders|SQL/.test(txt)?1:0);
await ctx.close();}
await b.close();})();
