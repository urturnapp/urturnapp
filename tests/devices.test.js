const {chromium,devices}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const now=Date.now();const issues=[];
const D={iphoneSE:devices['iPhone SE'],iphone15:devices['iPhone 15 Pro Max']||devices['iPhone 14 Pro Max'],galaxyS24:devices['Galaxy S24']||devices['Galaxy S9+'],galaxyA:devices['Galaxy A55']||devices['Galaxy S8']};
for(const [name,dev] of Object.entries(D)){ if(!dev){issues.push('nodev '+name);continue;}
 const ctx=await b.newContext({...dev});
 let ord={id:'11111111-1111-1111-1111-111111111111',num:'42',status:'waiting',created_at:new Date(now-60000).toISOString(),shop_id:'s2'};
 await ctx.route('**/*',async route=>{const u=new URL(route.request().url());
  if(u.host==='test.local'){let f=u.pathname.replace(/^\/+/,'')||'index.html';f=path.join((process.env.ROOT||require('path').join(__dirname,'..')),f);if(!fs.existsSync(f))return route.fulfill({status:404,body:''});const ct=f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.html')?'text/html':f.endsWith('.png')?'image/png':f.endsWith('.json')?'application/json':f.endsWith('.svg')?'image/svg+xml':'application/octet-stream';return route.fulfill({status:200,contentType:ct,body:fs.readFileSync(f)});}
  if(u.host.includes('fonts.'))return route.fulfill({status:200,contentType:'text/css',body:''});
  if(!u.host.includes('supabase'))return route.abort();const j=d=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(d)});
  const p=u.pathname;if(p.includes('/functions/'))return j({ok:true});
  if(p.endsWith('/urturn_shops'))return j([{id:'s2',slug:'cafe',name:'929 Specialty Coffee',color:'#7A2E1F',active:true,review_url:'https://g.page/r/x'}]);
  if(p.endsWith('/urturn_orders'))return j([ord]);const fn=p.split('/rpc/')[1];
  if(fn==='urturn_create_order')return j(ord.id);if(fn==='urturn_public_status')return j({locked:false});if(fn==='urturn_staff_check')return j(true);
  if(fn==='urturn_staff_status')return j({plan:'m1',ends_at:new Date(now+20*864e5).toISOString(),locked:false});
  if(fn==='urturn_staff_set'){ord={...ord,status:'ready',ready_at:new Date().toISOString(),ring_at:new Date().toISOString()};return j(true);}
  return j(null);});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 const chk=async(tag)=>{const r=await p.evaluate(()=>{const W=innerWidth;const out=[];if(document.documentElement.scrollWidth>W+1)out.push('overflow '+document.documentElement.scrollWidth);
   document.querySelectorAll('input,select,textarea').forEach(i=>{if(i.offsetParent&&parseFloat(getComputedStyle(i).fontSize)<16)out.push('input<16px('+(i.id||i.className)+')');});
   document.querySelectorAll('button,a.btn').forEach(x=>{const r=x.getBoundingClientRect();if(x.offsetParent&&r.height>0&&r.height<30)out.push('small-tap:'+(x.textContent||'').trim().slice(0,15)+' '+Math.round(r.height));});
   document.querySelectorAll('body *').forEach(x=>{const r=x.getBoundingClientRect();if(r.width>0&&r.right>W+2&&getComputedStyle(x).position!=='fixed'&&!x.closest('.tbl-wrap'))out.push('offscreen:'+x.tagName+'.'+x.className);});
   return [...new Set(out)].slice(0,8);});if(r.length)issues.push(name+' '+tag+': '+r.join(', '));await p.screenshot({path:`/tmp/dev-${name}-${tag}.png`});};
 await p.goto('https://test.local/?s=cafe');await p.waitForTimeout(1800);await chk('start');
 await p.fill('.big-input','42');await p.click('button[type=submit]');await p.waitForTimeout(1800);await chk('wait');
 const c=await ctx.newPage();c.on('pageerror',e=>errs.push('cash '+e.message));await c.goto('https://test.local/?s=cafe&v=cashier&k=K');await c.waitForTimeout(1500);
 const pp=p;await c.screenshot({path:`/tmp/dev-${name}-cashier.png`});
 await c.click('[data-a="ready"]').catch(e=>issues.push(name+' no ready btn'));await p.waitForTimeout(4000);await chk('ready');
 const o=await ctx.newPage();await o.goto('https://test.local/?s=cafe&v=owner&k=K');await o.waitForTimeout(1500);await o.screenshot({path:`/tmp/dev-${name}-owner.png`,fullPage:true});
 const ow=await o.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);if(ow)issues.push(name+' owner overflow');
 const h=await ctx.newPage();await h.goto('https://test.local/');await h.waitForTimeout(1000);const hw=await h.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);if(hw)issues.push(name+' home overflow');
 if(errs.length)issues.push(name+' errors: '+errs.join('|'));
 await ctx.close();}
console.log(issues.length?issues.join('\n'):'ALL CLEAN');await b.close();})();
