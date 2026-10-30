const {chromium,devices}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['iPhone 13']});
await ctx.route('**/*',async route=>{const u=new URL(route.request().url());
 if(u.host==='test.local'){let f=u.pathname.replace(/^\/+/,'')||'index.html';f=path.join((process.env.ROOT||require('path').join(__dirname,'..')),f);if(!fs.existsSync(f))return route.fulfill({status:404,body:''});const ct=f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html';return route.fulfill({status:200,contentType:ct,body:fs.readFileSync(f)});}
 if(!u.host.includes('supabase'))return route.abort();const j=d=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(d)});
 if(u.pathname.endsWith('/urturn_shops'))return j([{id:'s2',slug:'cafe',name:'Cafe',color:'#1E3A8A',active:true}]);return j([]);});
const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.addInitScript(()=>{window.__plays=[];const o=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){window.__plays.push(this.src.slice(0,10)+(this.muted?'m':''));return o.call(this);};});
await p.goto('https://test.local/?s=cafe');await p.waitForTimeout(1600);await p.tap('.big-input');await p.waitForTimeout(1500);
console.log('plays',await p.evaluate(()=>window.__plays.length),'dOk',await p.evaluate(()=>window.__ringRef().dOk),'dinged',await p.evaluate(()=>window.__ringRef().dinged));
await b.close();})();
