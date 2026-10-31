// Admin: clicking a shop shows its links; unsaved cashier link can be pasted; "new cashier link" asks first.
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const now=Date.now();const calls=[];let saved=null;
const ctx=await b.newContext({viewport:{width:1200,height:900}});
await ctx.route('**/*',async route=>{const u=new URL(route.request().url());
 if(u.host==='test.local'){let f=u.pathname.replace(/^\/+/,'')||'index.html';f=path.join(process.env.ROOT||path.join(__dirname,'..'),f);if(!fs.existsSync(f))return route.fulfill({status:404,body:''});const ct=f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.png')?'image/png':'text/html';return route.fulfill({status:200,contentType:ct,body:fs.readFileSync(f)});}
 if(!u.host.includes('supabase'))return route.abort();let body={};try{body=route.request().postDataJSON()||{}}catch(e){}
 const j=(d,s=200)=>route.fulfill({status:s,contentType:'application/json',body:JSON.stringify(d)});
 if(u.pathname.endsWith('/urturn_shops'))return j([{id:'s2',slug:'cafe',name:'Cafe Nile',color:'#1E3A8A',active:true}]);
 const fn=u.pathname.split('/rpc/')[1];if(fn)calls.push(fn);
 if(fn==='urturn_admin_shops2')return j([{slug:'cafe',name:'Cafe Nile',active:true,plan:'m1',ends_at:new Date(now+20*864e5).toISOString(),orders_7d:3,avg_rating:4.5}]);
 if(fn==='urturn_admin_health')return j({db_mb:9,orders_total:1,shops:[],errors:[]});
 if(fn==='urturn_admin_ok')return j(true);
 if(fn==='urturn_admin_shop_link')return j(saved);
 if(fn==='urturn_admin_save_link'){ if(body.p_key==='goodkey'){saved='goodkey';return j(null);} return j({message:'wrong_key',code:'P0001'},400);}
 return j(null);});
const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('https://test.local/?v=admin&k=K');await p.waitForTimeout(1200);
await p.click('[data-rows] button[data-edit="cafe"] >> nth=0');await p.waitForTimeout(800);
const pb=await p.$$eval('[data-pastebox]',x=>x.length);console.log('paste box',pb);if(!pb){console.log('adminlinks old');await b.close();return;}
await p.fill('#a-paste','https://x/?s=cafe&v=cashier&k=badkey');await p.click('[data-a=savelink]');await p.waitForTimeout(600);
console.log('after bad',await p.$$eval('[data-pastebox]',x=>x.length));
await p.fill('#a-paste','https://x/?s=cafe&v=cashier&k=goodkey');await p.click('[data-a=savelink]');await p.waitForTimeout(800);
const vals=await p.$$eval('[data-result] input[readonly]',x=>x.map(i=>i.value));
console.log('links',vals.length,'cash ok',vals.some(v=>v.includes('v=cashier')&&v.includes('k=goodkey')));
p.once('dialog',d=>d.dismiss());await p.click('[data-reset="cafe"]');await p.waitForTimeout(500);
const rc=calls.includes('urturn_admin_reset_key')?1:0;console.log('reset called',rc);const okAll=vals.length===3&&vals.some(v=>v.includes('k=goodkey'))&&!rc;console.log(okAll?'adminlinks ok':'adminlinks FAIL');
await p.screenshot({path:'/tmp/adminlinks.png'});await b.close();})();
