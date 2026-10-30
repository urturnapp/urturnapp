"use strict";
// UR TURN · cashier: cashier screen, new-order alert, owner reports
// Loaded only on the pages that need it, so a problem here cannot affect the other parts.

// ---------- cashier ----------
function Cashier(root,store,key){
  root.innerHTML=`<div class="panel">
    <div class="panel-head"><h2>${t("cashierTitle")}</h2></div>
    <div class="stats"><div class="stat"><b data-s="w">0</b><span>${t("stWaiting")}</span></div><div class="stat"><b data-s="r">0</b><span>${t("stReady")}</span></div><div class="stat"><b data-s="d">0</b><span>${t("stDone")}</span></div></div><div class="auto-reset" data-autoreset></div>
    <div class="col-title">${t("colWaiting")} <span class="count" data-c="w">0</span></div><div class="orders" data-l="w"></div>
    <div class="col-title">${t("colReady")} <span class="count" data-c="r">0</span></div><div class="orders" data-l="r"></div>
    <form class="add-row" data-f="add" style="margin-top:18px"><input id="cash-add" inputmode="numeric" autocomplete="off" maxlength="8" placeholder="${t("addPh")}" aria-label="${t("addPh")}"><button class="btn" type="submit">${t("addBtn")}</button></form>
  </div>`;
  const slug=store.shop.slug; let lastW="", lastR="", seen=null, newIds=new Set(), titleT=null; const baseTitle=document.title;
  // New-order alert: sound + vibration + highlight + tab title
  const snd=document.createElement("button"); snd.type="button"; snd.className="snd-bar"; snd.textContent=t("sndOn"); snd.hidden=true; root.prepend(snd);
  const inst=document.createElement("div"); inst.className="cash-inst"; inst.hidden=true; inst.innerHTML=`<span>${t("cashInst")}</span><button class="btn small push-go" type="button">${t("instGo")}</button>`; snd.after(inst);
  inst.querySelector("button").onclick=async()=>{ ls.set("urturn.cashierApp",location.href); await doInstall(); inst.hidden=true; };
  const instCheck=()=>{ inst.hidden=!(installEvt&&!isIOS&&!isStandalone()); }; instCheck(); document.addEventListener("urturn-install",instCheck);
  snd.onclick=()=>{ Ring.unlock(); setTimeout(()=>{ Ring.ding(); sndCheck(); },120); };
  let sndOn=false; const sndCheck=()=>{ if(Ring.dOk||(Ring.ctx&&Ring.ctx.state==="running")) sndOn=true; snd.hidden=sndOn; }; // once on, stays on (the unlocked sound element keeps working)
  setTimeout(sndCheck,1500); setInterval(sndCheck,5000); document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible") try{ Ring.ctx&&Ring.ctx.resume&&Ring.ctx.resume(); }catch(e){} }); document.addEventListener("pointerdown",()=>setTimeout(sndCheck,200),{passive:true});
  function alertNew(n){
    let k=0; const beep=()=>{ Ring.ding(); if(++k<2) setTimeout(beep,700); }; beep();
    try{ navigator.vibrate&&navigator.vibrate([200,100,200]); }catch(e){}
    clearInterval(titleT); let on=false, c=0; titleT=setInterval(()=>{ document.title=(on=!on)?"🔔 "+t("newOrderT",n):baseTitle; if(++c>=12||document.hasFocus()&&c>=4){ clearInterval(titleT); document.title=baseTitle; } },1000);
  }
  function row(o){
    if(o.status==="waiting") return `<div class="order${newIds.has(o.id)?" is-new":""}"><div class="num">${esc(o.num)}</div>
      <div class="meta"><span class="pill">${t("colWaiting")}</span><span>${t("since",mins(o.created_at))} · ${o.source==="customer"?t("fromCustomer"):t("fromCashier")}</span>
        <div class="eta-pick"><span>${t("etaSet")}</span>${ETA_CHOICES.map(m=>`<button type="button" class="${o._eta===m?"on":""}" data-a="eta" data-m="${m}" data-id="${o.id}">${m}</button>`).join("")}<span class="mu">${t("minShort")}</span>${o.eta_at&&new Date(o.eta_at)>Date.now()?`<span class="left" data-left="${esc(o.eta_at)}">${t("etaLeft",fmtLeft(new Date(o.eta_at)-Date.now()))}</span>`:""}${o.eta_at?`<span class="seen ${o.eta_seen?"ok":""}">${t(o.eta_seen?"etaSeen":"etaSent")}</span>`:""}</div></div>
      <div class="acts"><button class="btn small ghost" data-a="delete" data-id="${o.id}" type="button">${t("remove")}</button><button class="btn ready-btn" data-a="ready" data-id="${o.id}" type="button">${t("readyBtn")}</button></div></div>`;
    return `<div class="order ready"><div class="num">${esc(o.num)}</div><div class="meta"><span class="pill">${t("readyFor",mins(o.ready_at||o.created_at))}</span></div>
      <div class="acts"><button class="btn small" data-a="ring" data-id="${o.id}" type="button">${t("ringAgain")}</button><button class="btn small ok" data-a="done" data-id="${o.id}" type="button">${t("delivered")}</button></div></div>`;
  }
  function render(){
    const w=store.byStatus("waiting"), r=store.byStatus("ready").sort((a,b)=>String(a.ready_at).localeCompare(String(b.ready_at)));
    const today=dayStart(store.shop); { const nx=new Date(+today+864e5), left=Math.max(0,nx-Date.now()), h=Math.floor(left/36e5), m=Math.round((left%36e5)/6e4); const el=root.querySelector("[data-autoreset]"); if(el) el.textContent=t("autoReset",nx.toLocaleTimeString(lang==="ar"?"ar-EG":"en-GB",{hour:"numeric",minute:"2-digit",hour12:true}),(h?h+" "+t("hShort")+" ":"")+m+" "+t("mShort")); }
    const dl=store.byStatus("done").filter(o=>new Date(o.done_at||0)>=today).length; const d=Math.max(dl,store.doneCount||0);
    root.querySelector('[data-s="w"]').textContent=w.length; root.querySelector('[data-s="r"]').textContent=r.length; root.querySelector('[data-s="d"]').textContent=d;
    root.querySelector('[data-c="w"]').textContent=w.length; root.querySelector('[data-c="r"]').textContent=r.length;
    if(!store.loaded){ /* wait for first data */ }
    else if(seen===null){ seen=new Set(w.map(o=>o.id)); }
    else { const fresh=w.filter(o=>!seen.has(o.id)); fresh.forEach(o=>seen.add(o.id)); const fc=fresh.filter(o=>o.source==="customer");
      if(fc.length){ fc.forEach(o=>{ newIds.add(o.id); setTimeout(()=>{ newIds.delete(o.id); lastW=""; render(); },8000); }); alertNew(fc.map(o=>o.num).join("، ")); } }
    const hw=w.length?w.map(row).join(""):`<div class="empty">${t("emptyWaiting")}</div>`, hr=r.length?r.map(row).join(""):`<div class="empty">${t("emptyReady")}</div>`;
    if(hw!==lastW){ lastW=hw; root.querySelector('[data-l="w"]').innerHTML=hw; }
    if(hr!==lastR){ lastR=hr; root.querySelector('[data-l="r"]').innerHTML=hr; }
  }
  root.addEventListener("submit",async e=>{
    e.preventDefault(); const inp=root.querySelector("#cash-add"); const v=(inp.value||"").replace(/\D/g,""); if(!v) return; inp.value="";
    try{ await rpc("urturn_staff_add",{p_slug:slug,p_key:key,p_num:v}); store.refresh(); }catch(err){ toast(t("errGeneric")); }
  });
  root.addEventListener("click",async e=>{
    const a=e.target.closest("[data-a]"); if(!a||!a.dataset.id) return;
    const o=store.orders.find(x=>x.id===a.dataset.id);
    if(a.dataset.a==="eta"){ const m=+a.dataset.m; if(o){ o.eta_at=m?new Date(Date.now()+m*60000).toISOString():null; o.eta_seen=null; o._eta=m; render(); }
      try{ await rpc("urturn_staff_eta",{p_slug:slug,p_key:key,p_id:a.dataset.id,p_minutes:m}); }catch(err){ toast(t("errGeneric")); } return; }
    if(o){ // optimistic
      if(a.dataset.a==="ready"){ o.status="ready"; o.ready_at=o.ring_at=new Date().toISOString(); }
      if(a.dataset.a==="done"){ o.status="done"; o.done_at=new Date().toISOString(); }
      if(a.dataset.a==="delete"){ store.orders=store.orders.filter(x=>x!==o); }
      render();
    }
    try{ await rpc("urturn_staff_set",{p_slug:slug,p_key:key,p_id:a.dataset.id,p_action:a.dataset.a}); if(a.dataset.a==="ready"||a.dataset.a==="ring") Push.send(a.dataset.id); }catch(err){ toast(t("errGeneric")); }
    store.refresh();
  });
  store.listeners.add(render); render();
  setInterval(render,30000);
  setInterval(()=>root.querySelectorAll("[data-left]").forEach(el=>{ const l=new Date(el.dataset.left)-Date.now(); el.textContent=l>0?t("etaLeft",fmtLeft(l)):""; }),1000);
  return {render};
}

// ---------- owner (read-only reports) ----------
function Owner(root,store,key){
  const shop=store.shop, slug=shop.slug;
  root.innerHTML=`<div class="wrap owner">
    <div style="display:grid;gap:16px;min-width:0">
      <div class="panel"><div class="panel-head"><h2>${t("statsTitle")}</h2></div><div class="stats four">
        <div class="stat"><b data-k="n">–</b><span>${t("sOrders")}</span></div><div class="stat"><b data-k="w">–</b><span>${t("sWait")}</span></div>
        <div class="stat"><b data-k="r">–</b><span>${t("sRating")}</span></div><div class="stat"><b data-k="c">–</b><span>${t("sRatings")}</span></div></div></div>
      <div class="panel"><div class="panel-head" style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><h2>${t("ledgerTitle")}</h2><button class="btn small" type="button" data-csv>${t("lCsv")}</button></div><small style="color:var(--muted)">${t("ledgerHint")}</small><div class="tbl-wrap" style="margin-top:10px"><table class="tbl ledger"><thead><tr><th>${t("lDay")}</th><th>${t("lOrders")}</th><th>${t("lDone")}</th><th>${t("lWait")}</th><th>${t("lRating")}</th><th>${t("lPeak")}</th></tr></thead><tbody data-ledger><tr><td colspan="6">…</td></tr></tbody></table></div></div>
      <div class="panel"><div class="panel-head"><h2>${t("ownerTitle")}</h2></div>
        <div class="list" style="display:grid;gap:10px">
          <div><small style="color:var(--muted)">${t("fName")}</small><div style="font-weight:600"><bdi>${esc(shop.name)}</bdi></div></div>
          <div><small style="color:var(--muted)">${t("fReview")}</small><div dir="ltr" style="word-break:break-all">${shop.review_url?`<a href="${esc(shop.review_url)}" target="_blank" rel="noopener">${esc(shop.review_url)}</a>`:"–"}</div></div>
          <div class="tip">${t("contactToEdit")}</div>
        </div></div>
    </div>
    <div style="display:grid;gap:16px;align-content:start">
      <div><div class="label">${t("posterTitle")}</div><div class="poster" data-poster></div><button class="btn small" type="button" data-printposter style="margin-top:10px;width:100%">${t("printPoster")}</button></div>
      <div class="panel links"><label>${t("custLink")}</label><div class="copy-row"><input id="lk0" readonly value="${esc(custURL(slug))}"><button class="btn small" type="button" data-copy="lk0">${t("copy")}</button></div></div>
    </div></div>`;
  copyBtn(root.querySelector("[data-copy]"),root.querySelector("#lk0"));
  const p=root.querySelector("[data-poster]");
  p.innerHTML=`${logoHTML(shop,`style="color:${esc(shop.color)}"`)}<h3>${t("posterH")}</h3><div class="qr">${qrSVG(custURL(slug))}</div><p>${t("posterP")}</p><b><bdi>${esc(shop.name)}</bdi></b><span class="ur">UR TURN</span>`;
  async function stats(){
    try{
      const rows=await Api.week(shop.id);
      const waits=rows.filter(o=>o.ready_at).map(o=>(new Date(o.ready_at)-new Date(o.created_at))/60000);
      const rates=rows.filter(o=>o.rating).map(o=>o.rating);
      const q=k=>root.querySelector(`[data-k="${k}"]`);
      q("n").textContent=rows.length; q("w").textContent=waits.length?(waits.reduce((a,b)=>a+b,0)/waits.length).toFixed(1):"–";
      q("r").textContent=rates.length?(rates.reduce((a,b)=>a+b,0)/rates.length).toFixed(1):"–"; q("c").textContent=rates.length;
    }catch(e){}
  }
  stats(); setInterval(stats,60000);
  let ledgerRows=[];
  async function ledger(){
    try{
      const rows=await Api.month(shop.id);
      const o=hasHours(store.shop)?hm(store.shop.open_at):0;
      const key=ts=>{ const d=new Date(new Date(ts).getTime()-o*60000); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); };
      const days={};
      rows.forEach(r=>{ const k=key(r.created_at); const D=days[k]||(days[k]={n:0,done:0,waits:[],rates:[],hours:{}}); D.n++; if(r.status==="done") D.done++; if(r.ready_at) D.waits.push((new Date(r.ready_at)-new Date(r.created_at))/60000); if(r.rating) D.rates.push(r.rating); const h=new Date(r.created_at).getHours(); D.hours[h]=(D.hours[h]||0)+1; });
      const todayKey=key(Date.now()); const avg=a=>a.length?(a.reduce((x,y)=>x+y,0)/a.length):null;
      const hourLbl=h=>{ const d=new Date(); d.setHours(+h,0,0,0); return d.toLocaleTimeString(lang==="ar"?"ar-EG":"en-GB",{hour:"numeric",hour12:true}); };
      ledgerRows=Object.keys(days).sort().reverse().map(k=>{ const D=days[k]; const pk=Object.entries(D.hours).sort((a,b)=>b[1]-a[1])[0]; const w=avg(D.waits), r=avg(D.rates);
        const dl=new Date(k+"T12:00:00").toLocaleDateString(lang==="ar"?"ar-EG":"en-GB",{weekday:"short",day:"numeric",month:"short"});
        return {k,label:k===todayKey?t("lToday")+" · "+dl:dl,n:D.n,done:D.done,wait:w==null?"–":w.toFixed(1),rate:r==null?"–":r.toFixed(1)+" ("+D.rates.length+")",peak:pk?hourLbl(pk[0])+" ("+pk[1]+")":"–",today:k===todayKey}; });
      const tb=root.querySelector("[data-ledger]");
      if(!ledgerRows.length){ tb.innerHTML=`<tr><td colspan="6">${t("lEmpty")}</td></tr>`; return; }
      const tot=ledgerRows.reduce((a,r)=>({n:a.n+r.n,done:a.done+r.done}),{n:0,done:0});
      tb.innerHTML=ledgerRows.map(r=>`<tr class="${r.today?"today":""}"><td>${esc(r.label)}</td><td><b>${r.n}</b></td><td>${r.done}</td><td>${r.wait}</td><td>${r.rate}</td><td>${esc(r.peak)}</td></tr>`).join("")+`<tr class="total"><td>${t("lTotal")}</td><td><b>${tot.n}</b></td><td>${tot.done}</td><td colspan="3"></td></tr>`;
    }catch(e){}
  }
  ledger(); setInterval(()=>{ if(document.visibilityState==="visible") ledger(); },300000);
  root.querySelector("[data-csv]").addEventListener("click",()=>{
    const head=[t("lDay"),t("lOrders"),t("lDone"),t("lWait"),t("lRating"),t("lPeak")];
    const csv="\ufeff"+[head,...ledgerRows.map(r=>[r.k,r.n,r.done,r.wait,r.rate,r.peak])].map(a=>a.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\n");
    const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"})); a.download="UR-TURN-"+slug+"-"+new Date().toISOString().slice(0,10)+".csv"; document.body.appendChild(a); a.click(); a.remove();
  });
}


async function staffPage(kind){
  const shop=await loadShop(SLUG);
  if(shop===undefined){ msg(t("netErr")); return; }
  let ok=false; try{ ok=shop && await rpc("urturn_staff_check",{p_slug:SLUG,p_key:KEY}); }catch(e){}
  if(!ok||!shop.active){ msg(t("badLink")); return; }
  applyShop(shop); document.title=shop.name+" · UR TURN"; window.__shop=shop;
  const store=ShopStore(shop);
  let st=null; try{ st=await rpc("urturn_staff_status",{p_slug:SLUG,p_key:KEY}); }catch(e){}
  app.innerHTML=staffHead(shop,kind,KEY)+`<div class="wrap" style="padding-top:14px">${subBanner(st,shop,kind==="owner")}</div><div id="staff"></div>`;
  setInterval(async()=>{ try{ const n=await rpc("urturn_staff_status",{p_slug:SLUG,p_key:KEY}); if(n&&st&&(n.locked!==st.locked||n.ends_at!==st.ends_at)) location.reload(); }catch(e){} },5*60000);
  app.querySelector("[data-lang]").addEventListener("click",()=>setLang(lang==="ar"?"en":"ar"));
  if(kind==="cashier"&&st&&st.locked){ return; }
  if(kind==="cashier"){ if(ls.get("urturn.cashierApp")) ls.set("urturn.cashierApp",location.href); setTimeout(()=>Ring.unlock(),300); $("#staff").className="wrap"; $("#staff").style.cssText="padding-block:20px;max-width:760px"; $("#staff").innerHTML=`<div id="cash"></div>`; store.lite=true; Cashier($("#cash"),store,KEY); store.start(3000); keepAwake(); }
  else { Owner($("#staff"),store,KEY); store.start(10000); }
  let headKey=shop.name+"|"+(shop.logo||"").length;
  store.listeners.add(()=>{ const sh=store.shop, k=sh.name+"|"+(sh.logo||"").length; if(k===headKey) return; headKey=k; const h=app.querySelector(".staff-head .wrap"); if(!h) return; const b=h.querySelector(":scope > b"); if(b) b.innerHTML="<bdi>"+esc(sh.name)+"</bdi>"; const lg=h.querySelector(":scope > .shop-logo"); if(lg) lg.outerHTML=logoHTML(sh); document.title=sh.name+" · UR TURN"; });
  watchVersion();
}

