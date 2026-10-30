const {chromium,devices}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['iPhone 13']});
let ord={id:'11111111-1111-1111-1111-111111111111',num:'42',status:'waiting',created_at:new Date().toISOString(),shop_id:'s2'};
const logged=[];
await ctx.route('**/*',async route=>{const u=new URL(route.request().url());
 if(u.host==='test.local'){let f=u.pathname.replace(/^\/+/,'')||'index.html';f=path.join((process.env.ROOT||path.join(__dirname,'..')),f);if(!fs.existsSync(f))return route.fulfill({status:404,body:''});const ct=f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.png')?'image/png':'text/html';return route.fulfill({status:200,contentType:ct,body:fs.readFileSync(f)});}
 if(!u.host.includes('supabase'))return route.abort();const j=d=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(d)});
 if(u.pathname.includes('log_error')){try{logged.push(JSON.parse(route.request().postData()||'{}').p_msg)}catch(e){}return j(null);}
 if(u.pathname.endsWith('/urturn_shops'))return j([{id:'s2',slug:'cafe',name:'Cafe',color:'#7A2E1F',active:true}]);
 if(u.pathname.endsWith('/urturn_orders'))return j([ord]);if(u.pathname.includes('create_order'))return j(ord.id);return j(null);});
await ctx.addInitScript(()=>{const C=window.AudioContext;window.AudioContext=class extends C{resume(){return Promise.reject(new Error('Failed to start the audio device'));}};});
const p=await ctx.newPage();
await p.goto('https://test.local/?s=cafe');await p.waitForTimeout(800);await p.fill('.big-input','42');await p.click('button[type=submit]');await p.waitForTimeout(1500);
ord={...ord,status:'ready',ring_at:new Date().toISOString(),ready_at:new Date().toISOString()};await p.waitForTimeout(4500);
await p.mouse.click(50,300);await p.waitForTimeout(800);
console.log('audio rejections logged',logged.filter(m=>/audio device/.test(m||'')).length);await b.close();})();
