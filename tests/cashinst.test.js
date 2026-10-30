const {chromium,devices}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['Galaxy Tab S4']||devices['Galaxy S9+']});
await ctx.route('**/*',async route=>{const u=new URL(route.request().url());
 if(u.host==='test.local'){let f=u.pathname.replace(/^\/+/,'')||'index.html';f=path.join((process.env.ROOT||require('path').join(__dirname,'..')),f);if(!fs.existsSync(f))return route.fulfill({status:404,body:''});const ct=f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.png')?'image/png':'text/html';return route.fulfill({status:200,contentType:ct,body:fs.readFileSync(f)});}
 if(!u.host.includes('supabase'))return route.abort();const j=d=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(d)});
 if(u.pathname.endsWith('/urturn_shops'))return j([{id:'s2',slug:'cafe',name:'Cafe',color:'#7A2E1F',active:true}]);const fn=u.pathname.split('/rpc/')[1];
 if(fn==='urturn_staff_check')return j(true);if(fn==='urturn_staff_status')return j({plan:'m1',ends_at:'2099-01-01',locked:false});return j([]);});
const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('https://test.local/?s=cafe&v=cashier&k=K');await p.waitForTimeout(1500);
console.log('inst hidden before event',await p.$eval('.cash-inst',e=>e.hidden));
await p.evaluate(()=>{const e=new Event('beforeinstallprompt');e.prompt=()=>{window.__p=1;};e.userChoice=Promise.resolve({});window.dispatchEvent(e);});await p.waitForTimeout(300);
console.log('inst shown',!(await p.$eval('.cash-inst',e=>e.hidden)));await p.screenshot({path:'/tmp/cashier-install.png'});
await p.click('.cash-inst button');await p.waitForTimeout(300);console.log('prompted',await p.evaluate(()=>window.__p),'flag',await p.evaluate(()=>!!localStorage.getItem('urturn.cashierApp')));
await ctx.addInitScript(()=>{Object.defineProperty(window,'matchMedia',{value:q=>({matches:q.includes('standalone'),addListener(){},removeListener(){}})});});
const p2=await ctx.newPage();await p2.goto('https://test.local/?v=app');await p2.waitForTimeout(1500);console.log('installed app opens',p2.url());
// customer device w/o flag stays on app home
const c2=await b.newContext({...devices['Galaxy S9+']});await c2.route('**/*',r=>r.abort());await b.close();})();
