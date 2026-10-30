"use strict";
// UR TURN · customer: order page, ringing, notifications, home-screen app
// Loaded only on the pages that need it, so a problem here cannot affect the other parts.

// ---------- customer ----------
function Customer(root,shop,opts){
  opts=opts||{};
  const lsKey="urturn.order."+shop.slug+(opts.suffix||"");
  let orderId=ls.get(lsKey), order=null, rated=0, lastKey="", seenRing=null, timer=null, pushOk=false, pollN=0, aheadCache=null;
  const syncURL=()=>{ if(opts.inFrame) return; try{ const u=custURL(shop.slug)+(orderId?"&o="+encodeURIComponent(orderId):""); if(location.href!==u) history.replaceState(null,"",u); syncManifest(!!orderId); }catch(e){} };
  const setOrder=id=>{ orderId=id; ls.set(lsKey,id); aheadCache=null; syncURL(); };
  if(!opts.inFrame){ const o=P.get("o"); if(o&&/^[0-9a-f-]{36}$/i.test(o)&&!orderId){ orderId=o; ls.set(lsKey,o); } syncURL(); }
  async function poll(){
    if(!orderId){ order=null; render(); return; }
    try{
      pollN++; order=await Api.order(orderId);
      if(!order){ setOrder(null); }
      if(order&&order.status==="waiting"&&order.eta_at&&!order.eta_seen&&document.visibilityState==="visible"){ order.eta_seen=new Date().toISOString(); rpc("urturn_eta_seen",{p_id:orderId}).catch(()=>{}); }
      if(order&&order.status==="waiting"){ if(pollN%4===0||aheadCache==null){ aheadCache=(await Api.ahead(shop.id,order.created_at)).length; } order._ahead=aheadCache; }
      render(); return true;
    }catch(e){ return false; /* keep last state */ }
  }
  const instHTML=()=>!opts.inFrame&&!isIOS&&!isStandalone()&&installEvt&&!instOff()?`<div class="ios-note push-note install-note" role="alert"><button type="button" class="ios-x" data-a="instx" aria-label="x">✕</button><img src="icon-192.png" alt="" class="ios-ic"><div class="ios-body"><div class="ios-top"><b>UR TURN</b><span>${t("nowLbl")}</span></div><div class="ios-msg">${t("instNote")}</div><button class="btn small push-go" data-a="install" type="button">${t("instGo")}</button></div></div>`:"";
  function render(){
    const s=opts.store?opts.store.shop:shop;
    const state=!order?"enter":order.status;
    if(opts.onState) opts.onState(state);
    const k=[state,isOpenNow(s),pushOk,order&&order.num,order&&order.ring_at,order&&order.eta_at,lang,rated,s.name,s.logo,s.color,s.welcome,s.review_url].join("|");
    if(state==="waiting"&&k===lastKey){ const el=root.querySelector("[data-ahead]"); if(el) el.textContent=t("ahead",order._ahead||0); return; }
    if(k===lastKey) return; lastKey=k;
    const head=`<div class="cust-head">${logoHTML(s)}<h2><bdi>${esc(s.name)}</bdi></h2></div>`;
    const foot=`<div class="powered">${t("powered")} <a href="${esc(BASE)}" target="_blank" rel="noopener">UR TURN</a> · <button class="link-btn" data-a="lang" type="button" style="font-size:13px;padding:8px 6px;min-height:32px">${lang==="ar"?"English":"العربية"}</button></div>`;
    let body="";
    if(state==="enter"&&!isOpenNow(s)){
      Ring.stop();
      body=`<div class="cust-body" style="text-align:center;padding-top:28px"><h2>${t("closedTitle")}</h2><p>${t("closedP",fmtTime(s.open_at),fmtTime(s.close_at))}</p></div>`;
    } else if(state==="enter"){
      Ring.stop();
      body=`<div class="cust-body"><p>${esc(s.welcome||t("welcome"))}</p>
        <form data-f="enter" style="display:grid;gap:12px"><label for="r-${esc(lsKey)}" style="font-weight:600">${t("receiptLabel")}</label>
        <input class="big-input" id="r-${esc(lsKey)}" inputmode="numeric" pattern="[0-9]*" autocomplete="off" maxlength="8" placeholder="${t("receiptPh")}" required>
        <button class="btn shop" type="submit">${t("waitBtn")}</button></form>${!opts.inFrame&&isIOS&&!isStandalone()&&!iosTipOff()?`<div class="ios-note" role="alert"><button type="button" class="ios-x" data-a="iosx" aria-label="x">✕</button><img src="icon-192.png" alt="" class="ios-ic"><div class="ios-body"><div class="ios-top"><b>UR TURN</b><span>${t("nowLbl")}</span></div><div class="ios-msg">${t("iosNote")}</div></div></div><div class="ios-arrow" aria-hidden="true">${t("iosArrow")}<span>⬇</span></div>`:""}</div>`;
    } else if(state==="waiting"){
      Ring.stop();
      body=`<div class="cust-body"><div class="wait-card"><small>${t("receiptLabel")}</small><div class="num">${esc(order.num)}</div>
        <b>${t("waitingTitle")}</b>${order.eta_at?`<div class="eta"><small>${t("etaLabel")}</small><b class="num" data-eta="${esc(order.eta_at)}">${fmtLeft(new Date(order.eta_at)-Date.now())}</b></div>`:""}<span data-ahead>${t("ahead",order._ahead||0)}</span><div class="wait-anim" aria-hidden="true"><span></span><span></span><span></span></div></div>
        <p>${t("waitingP")}</p><div class="tip">${t("tipSound")}</div>${opts.inFrame?"":pushOk?`<div class="tip">${t("pushOn")}</div>`:Push.state()==="default"&&!sessionGet("urturn.pushOff")?`<div class="ios-note push-note" role="alert"><button type="button" class="ios-x" data-a="pushx" aria-label="x">✕</button><img src="icon-192.png" alt="" class="ios-ic"><div class="ios-body"><div class="ios-top"><b>UR TURN</b><span>${t("nowLbl")}</span></div><div class="ios-msg">${t("pushNote")}</div><button class="btn small push-go" data-a="push" type="button">${t("pushGo")}</button></div></div>`:isIOS&&!isStandalone()&&!iosTipOff()?`<div class="ios-note" role="alert"><button type="button" class="ios-x" data-a="iosx" aria-label="x">✕</button><img src="icon-192.png" alt="" class="ios-ic"><div class="ios-body"><div class="ios-top"><b>UR TURN</b><span>${t("nowLbl")}</span></div><div class="ios-msg">${t("iosNote")}</div></div></div><div class="ios-arrow" aria-hidden="true">${t("iosArrow")}<span>⬇</span></div>`:""}
        <button class="link-btn" data-a="cancel" type="button">${t("cancel")}</button></div>`;
    } else if(state==="ready"){
      body=`<div class="cust-body"><div class="wait-card"><div class="num">${esc(order.num)}</div><b>${t("ready")}</b></div></div>
        <div class="ringing" role="alert"><div class="bell" aria-hidden="true">🔔</div><h2>${t("ready")}</h2><div class="num">${esc(order.num)}</div>
        <p style="margin:0">${t("readyP")}</p><button class="btn" data-a="got" type="button">${t("gotIt")}</button></div>`;
      if(seenRing!==order.ring_at){ seenRing=order.ring_at; Ring.start(); if(opts.inFrame){ const ph=root.closest(".phone"); if(ph) setTimeout(()=>ph.scrollIntoView({behavior:"smooth",block:"center"}),50); } }
    } else {
      Ring.stop();
      const url=s.review_url||"https://www.google.com/maps";
      const stars=[1,2,3,4,5].map(n=>`<button type="button" data-star="${n}" class="${n<=rated?"on":""}" aria-label="${n}">★</button>`).join("");
      const gbtn=`<a class="btn g-btn" href="${esc(url)}" target="_blank" rel="noopener">${googleG()} ${t("rateGoogle")}</a>`;
      body=`<div class="cust-body" style="text-align:center"><h2 style="font-size:28px">${t("thanks")}</h2><p>${t("thanksP")}</p>
        <div class="stars">${stars}</div>${rated>=4||rated===0?gbtn:`<div class="tip">${t("rateThanks")}</div>`}
        <button class="link-btn" data-a="new" type="button">${t("newOrder")}</button></div>`;
    }
    const scanBar=!opts.inFrame&&(isStandalone()||!isIOS)&&(state==="enter"||state==="done")?`<div class="scan-bar"><button class="btn small" type="button" data-a="scan">${t("scanOther")}</button>${recentShops().length>1||isStandalone()?`<a class="btn small" href="${esc(BASE)}?v=app">${t("myShops")}</a>`:""}</div>`:"";
    const instNote=state==="enter"?instHTML():"";
    void 0;
    root.innerHTML=`<div class="cust">${head}${body}${scanBar}${foot}</div>${instNote}`;
    if(root.querySelector(".ios-note")) Ring.notify();
  }
  root.addEventListener("submit",async e=>{
    e.preventDefault(); const inp=root.querySelector(".big-input"); const v=(inp.value||"").replace(/\D/g,"");
    if(!v){ toast(t("badNumber")); inp.focus(); return; }
    Ring.unlock(); keepAwake(); rated=0; const perm=opts.inFrame?null:Push.ask();
    const btn=root.querySelector("button[type=submit]"); btn.disabled=true;
    try{ const id=await rpc("urturn_create_order",{p_slug:shop.slug,p_num:v}); setOrder(id); ls.set("urturn.iosTipOff","0"); ls.set("urturn.instOff","0"); sessionSet("urturn.pushOff",""); await poll(); if(perm) perm.then(()=>Push.subscribe(id)).then(ok=>{ pushOk=ok; lastKey=""; render(); }); }
    catch(err){ const c=String(err.code||""); toast(c.includes("subscription")?t("custPaused"):c.includes("shop_closed")?t("closedTitle"):t("errGeneric")); btn.disabled=false; lastKey=""; render(); }
  });
  root.addEventListener("click",async e=>{
    const st=e.target.closest("[data-star]"); if(st){ rated=+st.dataset.star; render(); if(orderId) rpc("urturn_rate",{p_id:orderId,p_rating:rated}).catch(()=>{}); return; }
    const a=e.target.closest("[data-a]"); if(!a) return;
    if(a.dataset.a==="lang"){ setLang(lang==="ar"?"en":"ar"); return; }
    if(a.dataset.a==="cancel"){ const id=orderId; setOrder(null); order=null; render(); rpc("urturn_cancel_order",{p_id:id}).catch(()=>{}); }
    if(a.dataset.a==="instx"){ ls.set("urturn.instOff",String(Date.now())); root.querySelectorAll(".install-note").forEach(x=>x.remove()); return; }
    if(a.dataset.a==="pushx"){ sessionSet("urturn.pushOff","1"); root.querySelectorAll(".push-note").forEach(x=>x.remove()); return; }
    if(a.dataset.a==="iosx"){ ls.set("urturn.iosTipOff",String(Date.now())); root.querySelectorAll(".ios-note,.ios-arrow").forEach(x=>x.remove()); return; }
    if(a.dataset.a==="scan"){ openScanner(); return; }
    if(a.dataset.a==="install"){ doInstall(); return; }
    if(a.dataset.a==="push"){ await Push.ask(); pushOk=await Push.subscribe(orderId); lastKey=""; render(); return; }
    if(a.dataset.a==="got"){ Ring.stop(); try{ await rpc("urturn_picked_up",{p_id:orderId}); }catch(err){} await poll(); }
    if(a.dataset.a==="new"){ setOrder(null); order=null; rated=0; render(); }
  });
  setInterval(()=>{ const el=root.querySelector("[data-eta]"); if(!el) return; const left=new Date(el.dataset.eta)-Date.now(); el.textContent=left>0?fmtLeft(left):t("etaSoon"); el.classList.toggle("soon",left<=0); },1000);
  poll(); timer=setInterval(()=>{ if(orderId&&(!order||order.status!=="done")) poll(); },3000);
  setInterval(()=>{ if(!orderId) render(); },30000);
  // Coming back to the page: ring right away from the last known state, then refresh fast (retry while the network wakes up).
  let backBusy=false, backAt=0;
  async function onBack(){
    if(document.visibilityState!=="visible"||!orderId||backBusy||Date.now()-backAt<800) return; backBusy=true; backAt=Date.now();
    Ring.unlock();
    if(order&&order.status==="ready"){ Ring.stop(); Ring.start(); }
    // iPhone needs a moment after coming back before audio is allowed again: keep trying for ~4s.
    let tries=0; const kick=()=>{ if(!Ring.on||tries++>13) return; try{ if(Ring.ctx&&Ring.ctx.resume){ const r=Ring.ctx.resume(); if(r&&r.catch) r.catch(()=>{}); } }catch(e){}
      if(Ring.el&&Ring.elOk&&Ring.el.paused){ Ring.el.play().then(()=>{ Ring.useEl=true; }).catch(()=>{}); }
      if(Ring.el&&!Ring.el.paused) return; setTimeout(kick,300); }; setTimeout(kick,150);
    for(const d of [0,400,900,1800]){ if(d) await new Promise(r=>setTimeout(r,d)); if(await poll()) break; }
    if(order&&order.status==="ready"){ if(!Ring.on) Ring.start(); } else Ring.stop();
    backBusy=false;
  }
  document.addEventListener("visibilitychange",onBack);
  document.addEventListener("urturn-install",()=>{ if(orderId||root.querySelector(".install-note")) return; const h=instHTML(); if(h){ root.insertAdjacentHTML("beforeend",h); Ring.notify(); } });
  window.addEventListener("pageshow",onBack); window.addEventListener("focus",onBack);
  try{ navigator.serviceWorker&&navigator.serviceWorker.addEventListener("message",e=>{ if(e.data&&e.data.type==="urturn-ring") onBack(); }); }catch(e){}
  if(orderId&&!opts.inFrame&&Push.state()==="granted") Push.subscribe(orderId).then(ok=>{ if(ok&&!pushOk){ pushOk=true; lastKey=""; render(); } });
  return {render(){ lastKey=""; render(); }, poll,
    reset(){ const id=orderId; Ring.stop(); setOrder(null); order=null; rated=0; lastKey=""; render(); if(id) rpc("urturn_cancel_order",{p_id:id}).catch(()=>{}); }};
}


// ---------- in-app QR scanner (home-screen app works for every shop) ----------
function slugFromQR(txt){ try{ const u=new URL(txt); const sl=u.searchParams.get("s"); if(sl&&(u.host===location.host||u.host.endsWith(".github.io"))) return sl; }catch(e){} return null; }
function recentShops(){ try{ return JSON.parse(ls.get("urturn.recent")||"[]"); }catch(e){ return []; } }
function rememberShop(sh){ const L=recentShops().filter(x=>x.slug!==sh.slug); L.unshift({slug:sh.slug,name:sh.name,color:sh.color}); ls.set("urturn.recent",JSON.stringify(L.slice(0,6))); }
async function openScanner(){
  if(!window.jsQR){ try{ await new Promise((res,rej)=>{ const sc=document.createElement("script"); sc.src="jsqr.js?v=1"; sc.onload=res; sc.onerror=rej; document.head.appendChild(sc); }); }catch(e){ toast(t("netErr")); return; } }
  const ov=document.createElement("div"); ov.className="scan-ov";
  ov.innerHTML=`<div class="scan-box"><div class="scan-cam"><video playsinline muted autoplay></video><div class="scan-frame"></div></div><p>${t("scanHint")}</p><button class="btn" type="button" data-x>${t("closeBtn")}</button></div>`;
  document.body.appendChild(ov);
  let stream=null, done=false, warned=0;
  const stop=()=>{ done=true; if(stream) stream.getTracks().forEach(tr=>tr.stop()); ov.remove(); };
  ov.querySelector("[data-x]").onclick=stop;
  try{ stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false}); }catch(e){ toast(t("camErr")); stop(); return; }
  const v=ov.querySelector("video"); v.srcObject=stream; try{ await v.play(); }catch(e){}
  const c=document.createElement("canvas"), x=c.getContext("2d",{willReadFrequently:true});
  const tick=()=>{ if(done) return;
    if(v.readyState>=2&&v.videoWidth){ const w=Math.min(640,v.videoWidth), h=Math.round(v.videoHeight*w/v.videoWidth); c.width=w; c.height=h; x.drawImage(v,0,0,w,h);
      const r=window.jsQR(x.getImageData(0,0,w,h).data,w,h,{inversionAttempts:"dontInvert"});
      if(r&&r.data){ const sl=slugFromQR(r.data); if(sl){ stop(); location.href=custURL(sl); return; } if(Date.now()-warned>3000){ warned=Date.now(); toast(t("badQR")); } } }
    requestAnimationFrame(tick); };
  tick();
}
async function activeOrderJump(){
  for(const r of recentShops()){ const id=ls.get("urturn.order."+r.slug); if(!id) continue;
    try{ const o=await Api.order(id); if(o&&(o.status==="waiting"||o.status==="ready")&&Date.now()-new Date(o.created_at)<12*3600e3){ location.replace(custURL(r.slug)+"&o="+encodeURIComponent(id)); return true; } }catch(e){} }
  return false;
}
function appHome(){
  if(isStandalone()){ const c=ls.get("urturn.cashierApp"); if(c&&c.startsWith(BASE)){ location.replace(c); return; } } // cashier device: the app opens the cashier screen
  activeOrderJump();
  const L=recentShops();
  app.innerHTML=`<div class="app-home"><img src="icon-192.png" width="84" height="84" alt=""><h1>UR TURN</h1><p>${t("appP")}</p>
    <button class="btn primary scan-big" type="button" data-scan>📷 ${t("scanBtn")}</button>
    ${L.length?`<div class="recent"><h3>${t("recentT")}</h3>${L.map(r=>`<a class="recent-item" href="${esc(custURL(r.slug))}"><span class="dot" style="background:${esc(r.color||"#14181C")}"></span><bdi>${esc(r.name)}</bdi>${ls.get("urturn.order."+r.slug)?`<span class="pill" style="margin-inline-start:auto">${t("activeOrder")}</span>`:""}</a>`).join("")}</div>`:""}
    <button class="link-btn" type="button" data-lang2 style="margin-top:18px">${lang==="ar"?"English":"العربية"}</button></div>`;
  app.querySelector("[data-scan]").onclick=openScanner;
  app.querySelector("[data-lang2]").onclick=()=>setLang(lang==="ar"?"en":"ar");
}


async function customerPage(){
  const shop=await loadShop(SLUG);
  if(shop===undefined){ msg(t("netErr")); setTimeout(customerPage,4000); return; }
  if(!shop||!shop.active){ msg(t("noShop")); return; }
  applyShop(shop); document.title=shop.name+" · UR TURN";
  try{ const ps=await rpc("urturn_public_status",{p_slug:SLUG}); if(ps&&ps.locked){ msg(t("custPaused")); return; } }catch(e){}
  // Opened from the home-screen icon with an old order: go to the app home (scan a new café) instead.
  const oid=P.get("o")||ls.get("urturn.order."+SLUG);
  if(isStandalone()&&oid){ Api.order(oid).then(od=>{
    const stale=od===null||(od&&(Date.now()-new Date(od.created_at)>12*3600e3||(od.status==="done"&&od.done_at&&Date.now()-new Date(od.done_at)>20*60000)));
    if(stale){ ls.set("urturn.order."+SLUG,null); location.replace(BASE+"?v=app"); } }).catch(()=>{}); }
  app.innerHTML=`<div class="cust-full" id="fullCust"></div>`;
  rememberShop(shop);
  try{ if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{}); }catch(e){}
  const c=Customer($("#fullCust"),shop,{});
  let n=0;
  setInterval(async()=>{ if(document.visibilityState!=="visible") return; n++;
    try{ const s2=await (n%5===0?Api.shop(SLUG):Api.shopLite(SLUG)); if(!s2) return;
      const keys=Object.keys(s2); if(keys.some(k=>String(s2[k])!==String(shop[k]))){ Object.assign(shop,s2); applyShop(shop); document.title=shop.name+" · UR TURN"; c.render(); }
    }catch(e){} },60000);
  watchVersion();
}

