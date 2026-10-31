"use strict";
// UR TURN · admin: admin panel (shops, subscriptions, system health)
// Loaded only on the pages that need it, so a problem here cannot affect the other parts.

// ---------- admin ----------
function Admin(root,akey){
  const COLORS=["#0E5E5A","#7A2E1F","#1E3A8A","#3F3A33","#8A1C4A","#2F6B2A","#B45309","#14181C"];
  const blank=()=>({slug:"",name:"",color:"#0E5E5A",logo:null,review_url:"",welcome:"",open_at:null,close_at:null});
  let mode="new", draft=blank();
  const HT=lang==="ar"?{title:"صحة السيستم",refresh:"تحديث",db:"حجم البيانات",of:"من",orders:"كل الطلبات",errs:"أخطاء آخر 7 أيام",ok:"تمام",archived:"مؤرشف",closed:"مسكّر هلق",stuck:n=>n+" طلب عالق أكتر من 3 ساعات",quiet:h=>"مفتوح وما في طلبات من "+h+" ساعة",never:"لسا ما وصل ولا طلب",last:"آخر طلب",today:"آخر 24 ساعة",noErr:"ما في ولا خطأ ✓",times:"مرة",allGood:"كل إشي شغال تمام ✓",issues:n=>n+" شغلات بدها انتباه"}
    :{title:"System health",refresh:"Refresh",db:"Data size",of:"of",orders:"All orders",errs:"Errors, last 7 days",ok:"OK",archived:"Archived",closed:"Closed now",stuck:n=>n+" order(s) stuck over 3h",quiet:h=>"Open, no orders for "+h+"h",never:"No orders yet",last:"Last order",today:"Last 24h",noErr:"No errors ✓",times:"×",allGood:"All systems OK ✓",issues:n=>n+" item(s) need attention"};
  const ago=v=>{ if(!v) return "–"; const m=Math.round((Date.now()-new Date(v))/60000); return m<60?(lang==="ar"?"قبل "+m+" د":m+"m ago"):m<1440?(lang==="ar"?"قبل "+Math.round(m/60)+" س":Math.round(m/60)+"h ago"):(lang==="ar"?"قبل "+Math.round(m/1440)+" يوم":Math.round(m/1440)+"d ago"); };
  const dev=ua=>!ua?"":/iPhone|iPad/.test(ua)?"iPhone":/Android/.test(ua)?"Android":/Mac/.test(ua)?"Mac":/Windows/.test(ua)?"Windows":"other";
  async function loadHealth(){
    const box=root.querySelector("[data-health]"); if(!box) return;
    let h; try{ h=await rpc("urturn_admin_health",{p_admin:akey}); }catch(e){ box.innerHTML=`<div class="empty">${t("netErr")}</div>`; return; }
    let issues=0;
    const rows=h.shops.map(s=>{ let cls="good", st=HT.ok;
      if(!s.active){ cls="muted"; st=HT.archived; }
      else if(s.stuck>0&&s.slug!==DEMO_SLUG){ cls="bad"; st=HT.stuck(s.stuck); issues++; }
      else if(!isOpenNow(s)){ cls="muted"; st=HT.closed; }
      else if(s.slug!==DEMO_SLUG&&s.orders_7d>=7&&s.last_order&&Date.now()-new Date(s.last_order)>3*3600e3){ cls="warn"; st=HT.quiet(Math.round((Date.now()-new Date(s.last_order))/3600e3)); issues++; }
      return `<tr><td><bdi>${esc(s.name)}</bdi></td><td><span class="dl ${cls}">${st}</span></td><td>${s.last_order?ago(s.last_order):HT.never}</td><td>${s.orders_24h}</td></tr>`; }).join("");
    issues+=h.errors.length?1:0;
    const pct=Math.min(100,Math.round(h.db_mb/500*100));
    box.innerHTML=`<div class="health-sum ${issues?"warn":"good"}">${issues?HT.issues(issues):HT.allGood}</div>
      <div class="health-kpis"><div><b dir="ltr">${h.db_mb} MB</b><small>${HT.db} (${pct}% ${HT.of} 500 MB)</small></div><div><b>${h.orders_total}</b><small>${HT.orders}</small></div><div><b>${h.errors.reduce((a,e)=>a+e.n,0)}</b><small>${HT.errs}</small></div></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t("colShop")}</th><th></th><th>${HT.last}</th><th>${HT.today}</th></tr></thead><tbody>${rows}</tbody></table></div>
      <div class="label" style="margin-top:14px">${HT.errs}</div>
      ${h.errors.length?`<div class="health-errs">${h.errors.map(e=>`<div><code dir="ltr">${esc(e.msg)}</code><small>${esc(e.slug||"–")} · ${esc(e.view)} · ${dev(e.ua)} · ${e.n} ${HT.times} · ${ago(e.last_at)}</small></div>`).join("")}</div>`:`<div class="empty">${HT.noErr}</div>`}`;
  }
  const inputCss="border:1px solid var(--line);border-radius:12px;padding:10px 12px;background:var(--bg);width:100%";
  root.innerHTML=`<div class="wrap owner">
    <div style="display:grid;gap:16px;min-width:0">
      <div class="panel"><div class="panel-head"><h2>🩺 ${HT.title}</h2><button class="btn small ghost" type="button" data-hrefresh>${HT.refresh}</button></div><div data-health><div class="empty">…</div></div></div>
      <div class="panel"><div class="panel-head"><h2>🔔 ${t("alertsTitle")}</h2></div><div data-alerts></div></div>
      <div class="panel" data-subpanel hidden><div class="panel-head"><h2 data-subtitle></h2></div>
        <form class="form" data-f="sub">
          <div class="field"><label for="s-wa">${t("shopWa")}</label><input type="tel" id="s-wa" dir="ltr" placeholder="${t("shopWaPh")}" style="${inputCss}"></div>
          <div class="field"><label for="s-plan">${t("renew")}</label><select id="s-plan" style="${inputCss}">${Object.entries(PLANS).map(([k,p])=>`<option value="${k}">${t("plan_"+k)} · ${p.price.toLocaleString()} ${t("egp")}</option>`).join("")}</select></div>
          <div class="field"><label for="s-notes">${t("notes")}</label><input type="text" id="s-notes" maxlength="400" style="${inputCss}"></div>
          <div data-subinfo class="tip"></div>
          <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn primary" type="submit">${t("renewNow")}</button><button class="btn ghost" type="button" data-a="subsave">${t("saveOnly")}</button></div>
        </form></div>
      <div class="panel"><div class="panel-head"><h2 data-title></h2><button class="btn small ghost" type="button" data-a="new" hidden>+ ${t("newShop")}</button></div>
        <form class="form" data-f="shop">
          <div class="field"><label for="a-name">${t("shopName")}</label><input type="text" id="a-name" required maxlength="80" style="${inputCss}"></div>
          <div class="field" data-slugf><label for="a-slug">${t("slug")}</label><input type="text" id="a-slug" dir="ltr" pattern="[a-z0-9\\-]{2,40}" placeholder="${t("slugPh")}" style="${inputCss}"><small dir="auto">${t("slugHint")}<span dir="ltr" data-slugprev></span></small></div>
          <div class="field"><label>${t("fLogo")}</label><div class="logo-row"><div data-logo></div>
            <label class="btn small" for="a-logo" style="cursor:pointer">${t("upload")}</label><input type="file" id="a-logo" accept="image/*" hidden>
            <button type="button" class="btn small ghost" data-a="nologo">${t("removeLogo")}</button></div></div>
          <div class="field"><label>${t("fColor")}</label><div class="swatches" data-sw></div>
            <label style="display:flex;gap:8px;align-items:center;font-weight:500;font-size:14px">${t("customColor")} <input type="color" id="a-color" style="width:44px;height:34px;border:0;background:none;padding:0"></label></div>
          <div class="field"><label for="a-review">${t("fReview")}</label><input type="url" id="a-review" dir="ltr" placeholder="https://g.page/r/..." style="${inputCss}"><small>${t("fReviewHint")}</small></div>
          <div class="field"><label for="a-welcome">${t("fWelcome")}</label><input type="text" id="a-welcome" maxlength="280" placeholder="${esc(t("welcome"))}" style="${inputCss}"></div>
          <div class="field"><label>${t("fHours")}</label><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><span>${t("fOpen")}</span><input type="time" id="a-open" style="${inputCss};width:auto"><span>${t("fClose")}</span><input type="time" id="a-close" style="${inputCss};width:auto"></div><small style="color:var(--muted)">${t("hoursHint")}</small></div>
          <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><button class="btn primary" type="submit" data-submit></button><span class="saved" data-saved hidden>${t("saved")}</span></div>
        </form>
        <div data-result></div></div>
      <div class="panel"><div class="panel-head"><h2>${t("shops")}</h2></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t("colShop")}</th><th>${t("colSlug")}</th><th>${t("colSub")}</th><th>${t("colOrders")}</th><th>${t("colRating")}</th><th></th></tr></thead><tbody data-rows></tbody></table></div></div>
    </div>
    <div style="display:grid;gap:16px;align-content:start"><div class="panel"><div class="panel-head"><h2>${t("offersTitle")}</h2></div>${plansHTML()}</div><div><div class="label">${t("posterTitle")}</div><div class="poster" data-poster></div><button class="btn small" type="button" data-printposter style="margin-top:10px;width:100%">${t("printPoster")}</button></div>
      <div class="panel links" data-custbox hidden><label>${t("custLink")}</label><div class="copy-row"><input id="a-cust" readonly><button class="btn small" type="button" data-copy="a-cust">${t("copy")}</button></div></div></div>
  </div>`;
  const $r=s=>root.querySelector(s);
  copyBtn($r('[data-copy="a-cust"]'),$r("#a-cust"));
  const curSlug=()=> mode==="edit"?draft.slug:($r("#a-slug").value.trim().toLowerCase()||"your-shop");
  function swatches(){ $r("[data-sw]").innerHTML=COLORS.map(c=>`<button type="button" class="swatch" style="background:${c}" data-color="${c}" aria-label="${c}" aria-pressed="${draft.color===c}"></button>`).join(""); $r("#a-color").value=draft.color; }
  function poster(){
    const p=$r("[data-poster]"); p.style.setProperty("--shop",draft.color); p.style.setProperty("--shop-ink",inkFor(draft.color));
    const name=draft.name||t("shopName");
    p.innerHTML=`${logoHTML({...draft,name},`style="color:${esc(draft.color)}"`)}<h3>${t("posterH")}</h3><div class="qr">${qrSVG(custURL(curSlug()))}</div><p>${t("posterP")}</p><b><bdi>${esc(name)}</bdi></b><span class="ur">UR TURN</span>`;
    $r("[data-logo]").innerHTML=logoHTML({...draft,name},`style="color:${esc(draft.color)}"`);
    const sp=$r("[data-slugprev]"); if(sp) sp.textContent=custURL(curSlug());
    const cb=$r("[data-custbox]"); cb.hidden=!(mode==="edit"); $r("#a-cust").value=custURL(curSlug());
  }
  function fill(){
    $r("[data-title]").textContent= mode==="edit"? t("editShop")+": "+draft.name : t("newShop");
    $r("[data-a=new]").hidden= mode!=="edit";
    $r("[data-slugf]").hidden= mode==="edit"; $r("#a-slug").required= mode!=="edit";
    $r("[data-submit]").textContent= mode==="edit"? t("save") : t("create");
    $r("#a-name").value=draft.name||""; $r("#a-slug").value=mode==="edit"?draft.slug:""; $r("#a-review").value=draft.review_url||""; $r("#a-welcome").value=draft.welcome||""; $r("#a-open").value=draft.open_at?String(draft.open_at).slice(0,5):""; $r("#a-close").value=draft.close_at?String(draft.close_at).slice(0,5):"";
    swatches(); poster();
  }
  function read(){ draft.name=$r("#a-name").value.trim(); draft.review_url=$r("#a-review").value.trim(); draft.welcome=$r("#a-welcome").value.trim(); draft.open_at=$r("#a-open").value||null; draft.close_at=$r("#a-close").value||null; }
  const waShare=u=>"https://wa.me/?text="+encodeURIComponent(u);
  function showLinks(slug,k,o={}){
    const box=$r("[data-result]"), r=rowsCache.find(x=>x.slug===slug);
    const links=[["custLink",custURL(slug)]]; if(k){ links.push(["cashLink",cashURL(slug,k)],["ownLink",ownURL(slug,k)]); }
    const head=o.created?`<div class="tip" style="margin-top:14px">${t("created")}</div>`:`<div class="label" style="margin-top:14px">🔗 ${t("linksTitle")}</div>${r?`<div style="margin:6px 0">${subCell(r)}${r.slug===DEMO_SLUG?"":` <button class="btn small primary" data-sub="${esc(slug)}" type="button">${t("renew")}</button>`}</div>`:""}`;
    const paste=!k&&o.ok?`<div data-pastebox><label for="a-paste">${t("cashLink")}</label><small style="display:block;color:var(--muted);margin-bottom:6px">${t("pasteCash")}</small><div class="copy-row"><input id="a-paste" dir="ltr" placeholder="https://...&v=cashier&k=..."><button class="btn small primary" type="button" data-a="savelink" data-slug="${esc(slug)}">${t("saveLink")}</button></div></div>`:"";
    box.innerHTML=`${head}<div class="links" style="margin-top:12px">
      ${links.map(([l,u],i)=>`<div><label>${t(l)}</label><div class="copy-row"><input id="al${i}" readonly dir="ltr" value="${esc(u)}"><button class="btn small" type="button" data-copy2="al${i}">${t("copy")}</button><a class="btn small signal" href="${esc(waShare(u))}" target="_blank" rel="noopener">WhatsApp</a></div></div>`).join("")}${paste}</div>`;
    box.querySelectorAll("[data-copy2]").forEach(b=>copyBtn(b,box.querySelector("#"+b.dataset.copy2)));
    if(o.created) box.scrollIntoView({behavior:"smooth",block:"center"});
  }
  async function shopCard(slug){
    let k=null, ok=true;
    try{ k=await rpc("urturn_admin_shop_link",{p_admin:akey,p_slug:slug}); }catch(e){ ok=false; }
    if(mode==="edit"&&draft.slug===slug) showLinks(slug,k,{ok});
  }
  let rowsCache=[], subSlug=null;
  function subCell(r){
    if(!r.active) return `<span class="pill">${t("archived")}</span>`;
    if(!r.ends_at||r.plan==="demo") return t("plan_demo");
    const d=daysLeft(r.ends_at), cls=d<=0?"bad":d<=7?"warn":"good";
    return `<span class="dl ${cls}">${d<=0?t("expired"):t("daysLeft",d)}</span><br><small>${t("plan_"+r.plan)} · ${fmtDate(r.ends_at)}</small>`;
  }
  function waMsg(r){ const d=daysLeft(r.ends_at); return d<=0?t("waEnded",r.name):t("waSoon",r.name,d,fmtDate(r.ends_at)); }
  function waBtn(r){ return r.whatsapp?`<a class="btn small signal" href="${esc(waLink(r.whatsapp,waMsg(r)))}" target="_blank" rel="noopener">${t("sendWa")}</a>`:`<small style="color:var(--muted)">${t("noWa")}</small>`; }
  async function load(){
    try{ const rows=rowsCache=await rpc("urturn_admin_shops2",{p_admin:akey});
      $r("[data-rows]").innerHTML=rows.map(r=>`<tr${r.active?"":' style="opacity:.55"'}><td><button class="link-btn" type="button" data-edit="${esc(r.slug)}" style="font-weight:600"><bdi>${esc(r.name)}</bdi></button></td><td dir="ltr"><a href="${esc(custURL(r.slug))}" target="_blank" rel="noopener">${esc(r.slug)}</a></td><td>${subCell(r)}</td><td>${r.orders_7d}</td><td>${r.avg_rating??"–"}</td>
        <td><div style="display:flex;gap:6px;flex-wrap:wrap">${r.slug===DEMO_SLUG?"":`<button class="btn small primary" data-sub="${esc(r.slug)}" type="button">${t("renew")}</button>`}<button class="btn small" data-edit="${esc(r.slug)}" type="button">${t("edit")}</button><button class="btn small ghost" data-reset="${esc(r.slug)}" type="button">${t("newKey")}</button>${r.slug===DEMO_SLUG?"":`<button class="btn small ghost" data-arch="${esc(r.slug)}" data-on="${r.active?0:1}" type="button">${r.active?t("archive"):t("restore")}</button>`}</div></td></tr>`).join("");
      const al=rows.filter(r=>r.active&&r.ends_at&&r.plan!=="demo"&&daysLeft(r.ends_at)<=3);
      $r("[data-alerts]").innerHTML=al.length?`<div class="orders">${al.map(r=>`<div class="order${daysLeft(r.ends_at)<=0?" late":""}"><div style="font-weight:600"><bdi>${esc(r.name)}</bdi></div><div class="meta">${subCell(r)}</div><div class="acts">${waBtn(r)}<button class="btn small primary" data-sub="${esc(r.slug)}" type="button">${t("renew")}</button></div></div>`).join("")}</div>`:`<div class="empty">${t("noAlerts")}</div>`;
    }catch(e){ root.innerHTML=`<div class="center-msg"><h2>${t("badLink")}</h2></div>`; }
  }
  function openSub(slug){
    const r=rowsCache.find(x=>x.slug===slug); if(!r) return; subSlug=slug;
    const p=$r("[data-subpanel]"); p.hidden=false;
    $r("[data-subtitle]").textContent=t("subTitle")+": "+r.name;
    $r("#s-wa").value=r.whatsapp||""; $r("#s-notes").value=r.notes||""; $r("#s-plan").value="m1";
    $r("[data-subinfo]").innerHTML=r.ends_at?subCell(r)+(r.whatsapp?" "+waBtn(r):""):"";
    p.scrollIntoView({behavior:"smooth",block:"center"});
  }
  async function saveSub(renew){
    const r=rowsCache.find(x=>x.slug===subSlug); if(!r) return;
    let plan=r.plan||"trial", ends=new Date(r.ends_at||Date.now());
    if(renew){ plan=$r("#s-plan").value; const base=new Date(Math.max(Date.now(),ends.getTime()));
      if(plan==="trial") base.setDate(base.getDate()+7); else base.setMonth(base.getMonth()+PLANS[plan].months); ends=base; }
    try{ await rpc("urturn_admin_set_sub",{p_admin:akey,p_slug:subSlug,p_plan:plan,p_ends_at:ends.toISOString(),p_whatsapp:$r("#s-wa").value,p_notes:$r("#s-notes").value});
      toast(renew?t("renewed",fmtDate(ends)):t("saved")); await load(); openSub(subSlug);
    }catch(err){ toast(t("errGeneric")); }
  }
  let slugTouched=false;
  root.addEventListener("input",e=>{
    if(e.target.id==="a-slug"){ slugTouched=true; e.target.value=e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,""); }
    if(e.target.id==="a-name"&&mode==="new"&&!slugTouched){ const g=e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,30); $r("#a-slug").value=g.length>=2?g:""; }
    if(["a-name","a-slug"].includes(e.target.id)){ read(); poster(); } if(e.target.id==="a-color"){ draft.color=e.target.value; swatches(); poster(); } });
  root.addEventListener("change",e=>{
    if(e.target.id!=="a-logo"||!e.target.files[0]) return;
    const fr=new FileReader();
    fr.onload=()=>{ const img=new Image(); img.onload=()=>{ const c=document.createElement("canvas"),S=200; c.width=S;c.height=S; const x=c.getContext("2d"); const m=Math.min(img.width,img.height);
      x.fillStyle="#fff"; x.fillRect(0,0,S,S); x.drawImage(img,(img.width-m)/2,(img.height-m)/2,m,m,0,0,S,S); draft.logo=c.toDataURL("image/jpeg",0.85); poster(); }; img.src=fr.result; };
    fr.readAsDataURL(e.target.files[0]);
  });
  root.addEventListener("submit",async e=>{
    e.preventDefault();
    if(e.target.dataset.f==="sub"){ saveSub(true); return; }
    read();
    const args={p_admin:akey,p_name:draft.name,p_color:draft.color,p_logo:draft.logo||"",p_review_url:draft.review_url||"",p_welcome:draft.welcome||""};
    try{
      if(mode==="new"){
        const slug=$r("#a-slug").value.trim().toLowerCase();
        const k=await rpc("urturn_admin_create_shop",{p_admin:akey,p_slug:slug,p_name:draft.name});
        await rpc("urturn_admin_save_shop",{...args,p_slug:slug});
        await rpc("urturn_admin_set_hours",{p_admin:akey,p_slug:slug,p_open:draft.open_at||"",p_close:draft.close_at||""});
        draft.slug=slug; mode="edit"; fill(); await load(); showLinks(slug,k,{created:true});
        await load(); openSub(slug); return;
      } else {
        await rpc("urturn_admin_save_shop",{...args,p_slug:draft.slug});
        await rpc("urturn_admin_set_hours",{p_admin:akey,p_slug:draft.slug,p_open:draft.open_at||"",p_close:draft.close_at||""});
        const s=$r("[data-saved]"); s.hidden=false; setTimeout(()=>s.hidden=true,2500); fill();
      }
      load();
    }catch(err){ toast(String(err.code||"").includes("duplicate")?t("slugTaken"):t("errGeneric")); }
  });
  root.addEventListener("click",async e=>{
    const sw=e.target.closest("[data-color]"); if(sw){ draft.color=sw.dataset.color; swatches(); poster(); return; }
    const a=e.target.closest("[data-a]");
    if(a&&a.dataset.a==="subsave"){ saveSub(false); return; }
    const sb=e.target.closest("[data-sub]"); if(sb){ await load(); openSub(sb.dataset.sub); return; }
    const ar=e.target.closest("[data-arch]");
    if(ar){ const on=ar.dataset.on==="1"; const r=rowsCache.find(x=>x.slug===ar.dataset.arch);
      if(!on&&!confirm(t("confirmArchive",r?r.name:ar.dataset.arch))) return;
      try{ await rpc("urturn_admin_set_active",{p_admin:akey,p_slug:ar.dataset.arch,p_active:on}); load(); }catch(err){ toast(t("errGeneric")); } return; }
    if(a&&a.dataset.a==="nologo"){ draft.logo=null; poster(); return; }
    if(a&&a.dataset.a==="new"){ mode="new"; draft=blank(); slugTouched=false; $r("[data-result]").innerHTML=""; fill(); return; }
    const ed=e.target.closest("[data-edit]");
    if(ed){ const s=await loadShop(ed.dataset.edit); if(s){ draft={...s}; mode="edit"; $r("[data-result]").innerHTML=""; fill(); shopCard(s.slug); root.querySelector("[data-title]").scrollIntoView({behavior:"smooth",block:"start"}); } return; }
    if(a&&a.dataset.a==="savelink"){ const v=($r("#a-paste").value||"").trim(); let k=v; try{ k=new URL(v).searchParams.get("k")||v; }catch(_){ }
      if(!k) return; try{ await rpc("urturn_admin_save_link",{p_admin:akey,p_slug:a.dataset.slug,p_key:k}); toast(t("linkSaved")); shopCard(a.dataset.slug); }catch(err){ toast(String(err.message||err.code||"").includes("wrong_key")?t("wrongLink"):t("errGeneric")); } return; }
    const b=e.target.closest("[data-reset]"); if(!b) return;
    { const r=rowsCache.find(x=>x.slug===b.dataset.reset); if(!confirm(t("confirmReset",r?r.name:b.dataset.reset))) return; }
    try{ const k=await rpc("urturn_admin_reset_key",{p_admin:akey,p_slug:b.dataset.reset}); const s=await loadShop(b.dataset.reset); if(s){ draft={...s}; mode="edit"; fill(); } showLinks(b.dataset.reset,k,{created:true}); }catch(err){ toast(t("errGeneric")); }
  });
  fill(); load(); loadHealth();
  root.querySelector("[data-hrefresh]").addEventListener("click",loadHealth);
  setInterval(()=>{ if(document.visibilityState==="visible") loadHealth(); },120000);
}


