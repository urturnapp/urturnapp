"use strict";
// UR TURN · home: landing page and live demo
// Loaded only on the pages that need it, so a problem here cannot affect the other parts.

// ---------- landing page ----------
const LP={
ar:{
 navHow:"كيف يشتغل",navPrice:"الأسعار",navFaq:"أسئلة",
 eyebrow:"نظام نداء ذكي للكافيهات والمطاعم",
 h1a:"جوال الزبون",h1b:"صار البيجر",
 sub:"بلاش بيجر بيضيع أو بطارية بتخلص أو صوت بينادي فوق الزحمة. الزبون بيمسح الكود، بيكتب رقم فاتورته، وبيقعد مرتاح. أول ما الطلب يجهز، جواله بيرن ويهتز.",
 ctaDemo:"جرّب العرض الحي",ctaTrial:"ابدأ أسبوعك المجاني",
 heroNote:"أسبوع مجاني • بدون عقد • بدون رسوم تركيب",
 mWait:"طلبك قيد التحضير",mAhead:"قبلك 2 طلبات",mReady:"طلبك جاهز!",mPick:"تفضل استلمه من الكاونتر",mRate:"كيف كانت تجربتك؟",mGoogle:"قيّمنا على جوجل",mOrder:"فاتورة",
 k1:"أجهزة تشتريها",k2:"تطبيق ينزّله الزبون",k3:"دقايق للتركيب",
 howT:"كيف يشتغل؟",howEy:"التجربة خطوة بخطوة",
 st1t:"امسح الكود",st1d:"ستاند أنيق على الكاونتر بشعار محلك. الزبون بيمسحه بكاميرا جواله، بدون تطبيق وبدون تسجيل.",
 st2t:"اكتب رقم الفاتورة",st2d:"بيكتب رقم الفاتورة اللي معه، وخلص. ما في حساب ولا بيانات شخصية.",
 st3t:"استنى وإنت مرتاح",st3d:"عدّاد تنازلي للوقت المتوقع، وكم طلب قبله. ما في داعي يوقف عند الكاونتر ويسأل.",
 st4t:"الجوال بيرن",st4d:"الكاشير بيضغط «جاهز»، وجوال الزبون بيرن ويهتز وبتطلع شاشة «طلبك جاهز».",
 st5t:"تقييم على جوجل",st5d:"بعد ما يستلم، زر واحد بيوديه على صفحة تقييم محلك. زباين مبسوطين، يعني نجوم أكتر.",
 stScan:"امسح لتتابع طلبك",stEnter:"رقم الفاتورة",stStart:"ابدأ الانتظار",secEy1:"المقارنة",secEy2:"لأصحاب المحلات",secEy3:"الأسعار",secEy4:"أسئلة",secEy5:"تواصل",secEy0:"فيديو",howS:"4 خطوات، والزبون ما بيحتاج يسأل حدا.",
 h1t:"امسح الكود",h1d:"ستاند QR على الكاونتر، الزبون بيمسحه بكاميرا جواله. بدون تطبيق وبدون تسجيل.",
 h2t:"اكتب رقم الفاتورة",h2d:"بيكتب رقم فاتورته وبيشوف عدّاد تنازلي للوقت المتوقع، وكم طلب قبله.",
 h3t:"الجوال بيرن",h3d:"الكاشير بيضغط «جاهز»، وجوال الزبون بيرن ويهتز وبتطلع شاشة «طلبك جاهز».",
 h4t:"تقييم على جوجل",h4d:"بعد ما يستلم، زر واحد بيوديه على صفحة تقييم محلك على جوجل.",
 vidT:"شوفه بأقل من نص دقيقة",vid1:"بدون تطبيق ولا أجهزة",vid2:"شغال على أي جوال، آيفون وأندرويد",vid3:"بيجيبلك تقييمات جوجل بعد كل طلب",
 vsT:"البيجر القديم ولا UR TURN؟",vsOld:"البيجر التقليدي",vsNew:"UR TURN",
 o1:"أجهزة غالية، وكل ما ضاع واحد بتشتري غيره",o2:"بيضيع، بينكسر، وبطاريته لازم تنشحن كل يوم",o3:"الزبون ما بيعرف كم ضايل لطلبه",o4:"وقت الزحمة الأجهزة بتخلص",o5:"ما بيجيبلك ولا تقييم",
 n1:"اشتراك بسيط، بدون ما تشتري ولا جهاز",n2:"ما في إشي يضيع أو ينكسر، الجوال جوال الزبون",n3:"الزبون بيشوف عدّاد للوقت المتوقع وكم طلب قبله",n4:"عدد طلبات مفتوح مهما كانت الزحمة",n5:"زر تقييم جوجل بعد كل طلب",
 bT:"ليش أصحاب المحلات بيحبوه؟",
 b1t:"تركيب بنفس اليوم",b1d:"منجهّزلك كل إشي ومنعطيك ستاند الـ QR هدية.",
 b2t:"بدون تدريب",b2d:"الكاشير عنده زر واحد: «جاهز».",
 b3t:"تقييمات أكتر على جوجل",b3d:"كل زبون مبسوط بيوصل لصفحة تقييمك بضغطة.",
 b4t:"باسمك ولونك",b4d:"شعار محلك ولونه على شاشة الزبون والستاند.",
 b5t:"تقارير أسبوعية",b5d:"عدد الطلبات، متوسط الانتظار، ومتوسط التقييم.",
 b6t:"عربي وإنجليزي",b6d:"الزبون بيختار اللغة اللي بتريحه.",
 pT:"أسعار واضحة",pS:"أول أسبوع مجاناً. بدون عقد، وبدون رسوم تركيب. كل المميزات بكل الباقات.",
 pM:"شهري",pY:"سنوي",pBest:"الأوفر",pPerM:"/ شهر",pPerY:"/ سنة",pMNote:"بتلغي وقت ما بدك",pYNote:n=>`وفّر ${n} ج.م، يعني شهرين ببلاش`,
 f1:"طلبات بدون حد",f2:"ستاند QR هدية 🎁",f3:"شعار ولون محلك",f4:"دعوة لتقييم جوجل",f5:"تقارير الأداء",f6:"دعم على واتساب",
 pCta:"ابدأ أسبوعك المجاني",pWa:p=>`مرحبا، بدي أبدأ الأسبوع المجاني لـ UR TURN (الباقة ${p}).`,
 qT:"أسئلة بتتكرر",
 q1:"لازم الزبون ينزّل تطبيق؟",a1:"لا. بيمسح الكود بكاميرا جواله وبتفتح الصفحة مباشرة.",
 q2:"بيشتغل مع الكاشير أو نظام الـ POS اللي عندي؟",a2:"آه، وبدون أي ربط. الزبون بيكتب رقم الفاتورة اللي معه، والكاشير بيضغط «جاهز» من أي جوال أو تابلت.",
 q3:"لازم أشتري جهاز؟",a3:"لا. أي جوال أو تابلت عندك بيشتغل كشاشة كاشير.",
 q4:"كيف الزبون بيعرف إن طلبه جهز؟",a4:"جواله بيرن ويهتز وبتطلع شاشة «طلبك جاهز». على الآيفون الأحسن يخلي الصفحة مفتوحة، والشاشة بتضل صاحية لحالها.",
 q5:"إذا زبون ما بده يستخدم جواله؟",a5:"عادي، الكاشير بيضيف رقمه وبينادي عليه متل ما كان.",
 q6:"كيف بدفع؟",a6:"شهري أو سنوي، كاش أو إنستاباي أو فودافون كاش. ومنبعتلك تذكير على واتساب قبل التجديد.",
 endT:"شوفه بعينك بدقيقة",endS:"افتح العرض الحي على جوالك، أو امسح الكود وكلّمنا واتساب.",ctaWa:"كلّمنا واتساب",
 foot:"© 2026 UR TURN. صُنع بحب للكافيهات ☕",ctT:"تواصل معنا",ctS:"منرد عليك بسرعة، وبنجي نركّبلك بنفس اليوم.",ctWa:"واتساب",ctIg:"انستغرام",ctEm:"الإيميل",owned:n=>`<bdi>UR TURN</bdi> مملوكة لـ <bdi>${esc(n)}</bdi>`,regNo:n=>`سجل تجاري رقم ${n}`,rights:"جميع الحقوق محفوظة",navContact:"تواصل"
},
en:{
 navHow:"How it works",navPrice:"Pricing",navFaq:"FAQ",
 eyebrow:"Smart paging for cafés & restaurants",
 h1a:"Your customer’s phone",h1b:"is the pager",
 sub:"No more lost pagers, dead batteries or shouting over the crowd. Customers scan the code, type their receipt number and relax. The moment the order is ready, their phone rings and buzzes.",
 ctaDemo:"Try the live demo",ctaTrial:"Start your free week",
 heroNote:"Free week • No contract • No setup fees",
 mWait:"Preparing your order",mAhead:"2 orders ahead of you",mReady:"Your order is ready!",mPick:"Pick it up at the counter",mRate:"How was it?",mGoogle:"Rate us on Google",mOrder:"Receipt",
 k1:"devices to buy",k2:"apps to download",k3:"minutes to set up",
 howT:"How it works",howEy:"The experience, step by step",
 st1t:"Scan the code",st1d:"An elegant stand on the counter with your logo. Customers scan it with their camera, no app, no sign-up.",
 st2t:"Type the receipt number",st2d:"They type the number on their receipt. That’s it. No account, no personal data.",
 st3t:"Relax while waiting",st3d:"A live countdown and how many orders are ahead. No more hovering at the counter.",
 st4t:"The phone rings",st4d:"The cashier taps “Ready” and the customer’s phone rings, buzzes and shows “Your order is ready”.",
 st5t:"Google review",st5d:"After pickup, one button takes them to your review page. Happy customers, more stars.",
 stScan:"Scan to track your order",stEnter:"Receipt number",stStart:"Start waiting",secEy1:"Compare",secEy2:"For owners",secEy3:"Pricing",secEy4:"FAQ",secEy5:"Contact",secEy0:"Video",howS:"4 steps. Nobody has to ask “is mine ready?”.",
 h1t:"Scan the code",h1d:"A QR stand on the counter. Customers scan it with their camera. No app, no sign-up.",
 h2t:"Type the receipt number",h2d:"They enter their number and see a live countdown and how many orders are ahead.",
 h3t:"The phone rings",h3d:"The cashier taps “Ready” and the customer’s phone rings, buzzes and shows “Your order is ready”.",
 h4t:"Google review",h4d:"After pickup, one button takes them to your Google review page.",
 vidT:"See it in under 30 seconds",vid1:"No app, no hardware",vid2:"Works on any phone, iPhone and Android",vid3:"Brings you Google reviews after every order",
 vsT:"Old pagers vs UR TURN",vsOld:"Classic pagers",vsNew:"UR TURN",
 o1:"Expensive devices you keep replacing",o2:"Lost, broken, and need charging every day",o3:"Customers can’t see how long is left",o4:"Run out at rush hour",o5:"Bring you zero reviews",
 n1:"A simple subscription, nothing to buy",n2:"Nothing to lose or break, it’s the customer’s own phone",n3:"Customers see a countdown and how many orders are ahead",n4:"Unlimited orders, however busy you get",n5:"A Google review button after every order",
 bT:"Why shop owners love it",
 b1t:"Same-day setup",b1d:"We set everything up and the QR stand is on us.",
 b2t:"Zero training",b2d:"The cashier has one button: “Ready”.",
 b3t:"More Google reviews",b3d:"Every happy customer is one tap from your review page.",
 b4t:"Your brand",b4d:"Your logo and color on the customer screen and the stand.",
 b5t:"Weekly reports",b5d:"Orders, average wait and average rating.",
 b6t:"Arabic & English",b6d:"Customers pick the language they like.",
 pT:"Simple pricing",pS:"First week free. No contract, no setup fees. Every feature on every plan.",
 pM:"Monthly",pY:"Yearly",pBest:"Best value",pPerM:"/ month",pPerY:"/ year",pMNote:"Cancel anytime",pYNote:n=>`Save ${n} EGP, that’s 2 months free`,
 f1:"Unlimited orders",f2:"Free QR stand 🎁",f3:"Your logo & color",f4:"Google review invite",f5:"Performance reports",f6:"WhatsApp support",
 pCta:"Start your free week",pWa:p=>`Hi, I'd like to start the UR TURN free week (${p} plan).`,
 qT:"FAQ",
 q1:"Do customers need an app?",a1:"No. They scan with their camera and the page opens right away.",
 q2:"Does it work with my cashier / POS?",a2:"Yes, with no integration. Customers type the receipt number they already have, and the cashier taps “Ready” from any phone or tablet.",
 q3:"Do I need to buy a device?",a3:"No. Any phone or tablet you have works as the cashier screen.",
 q4:"How do customers know it’s ready?",a4:"Their phone rings, buzzes and shows “Your order is ready”. On iPhone it’s best to keep the page open; the screen stays awake on its own.",
 q5:"What if a customer doesn’t want to use their phone?",a5:"No problem. The cashier adds the number and calls it out like before.",
 q6:"How do I pay?",a6:"Monthly or yearly, by cash, InstaPay or Vodafone Cash. We remind you on WhatsApp before renewal.",
 endT:"See it for yourself in a minute",endS:"Open the live demo on your phone, or scan to message us on WhatsApp.",ctaWa:"Message us on WhatsApp",
 foot:"© 2026 UR TURN. Made with love for cafés ☕",ctT:"Contact us",ctS:"We reply fast and can set you up the same day.",ctWa:"WhatsApp",ctIg:"Instagram",ctEm:"Email",owned:n=>`UR TURN is owned by <bdi>${esc(n)}</bdi>`,regNo:n=>`Commercial reg. no. ${n}`,rights:"All rights reserved",navContact:"Contact"
}};
const L=k=>{ const v=(LP[lang]||LP.ar)[k]; return v===undefined?k:v; };
function lpMotion(){
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }),{threshold:.15});
  app.querySelectorAll(".rv").forEach(el=>io.observe(el));
  const sp=app.querySelector(".sp"), steps=[...app.querySelectorAll(".ss")];
  const midY=()=>{ if(innerWidth>860) return innerHeight*0.5; const ph=app.querySelector(".story-phone"); const top=$("#topbar").offsetHeight+(ph?ph.offsetHeight:320); return top+(innerHeight-top)/2; };
  window.__storyMid=midY;
  const pick=()=>{ const mid=midY(); let best=steps[0],bd=1e9; steps.forEach(st=>{ const r=st.getBoundingClientRect(); const d=Math.abs((r.top+r.bottom)/2-mid); if(d<bd){bd=d;best=st;} });
    sp.dataset.active=best.dataset.step; steps.forEach(st=>st.classList.toggle("on",st===best)); };
  const hero=app.querySelector(".lp-phone");
  let ticking=false;
  const onScroll=()=>{ if(ticking) return; ticking=true; requestAnimationFrame(()=>{ ticking=false; pick();
    if(hero&&!reduce){ const y=Math.min(scrollY,700); const dir=document.dir==="rtl"?1:-1; hero.style.transform=`translateY(${y*0.18}px) rotate(${dir*(3-y*0.012)}deg) scale(${1-y*0.00025})`; } }); };
  const setTop=()=>{ const h=$("#topbar").offsetHeight; document.documentElement.style.setProperty("--toph",h+"px"); }; setTop(); addEventListener("resize",setTop);
  addEventListener("scroll",onScroll,{passive:true}); addEventListener("resize",onScroll); onScroll();
}
function homePage(){
  topbar("home");
  $("#tabs").insertAdjacentHTML("beforeend",`<a href="#how">${L("navHow")}</a><a href="#price">${L("navPrice")}</a><a href="#faq">${L("navFaq")}</a><a href="#contact">${L("navContact")}</a>`);
  const wa=(m)=>esc(waLink(OUR_WA,m||t("trialWaMsg")));
  const check=`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const cross=`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>`;
  const m=PLANS.m1.price, y=PLANS.m12.price, save=(m*12-y).toLocaleString();
  const feats=[1,2,3,4,5,6].map(i=>`<li>${check}${L("f"+i)}</li>`).join("");
  app.innerHTML=`<div class="lp">
  <section class="lp-hero"><div class="wrap lp-hero-in">
    <div>
      <div class="lp-eyebrow"><span class="dot"></span>${L("eyebrow")}</div>
      <h1>${L("h1a")}<br><em>${L("h1b")}</em></h1>
      <p>${L("sub")}</p>
      <div class="cta"><a class="btn signal lg" href="?v=demo">${L("ctaDemo")}</a><a class="btn ghost lg on-dark" href="${wa()}" target="_blank" rel="noopener">${L("ctaTrial")}</a></div>
      <small class="lp-note">${L("heroNote")}</small>
    </div>
    <div class="lp-phone" aria-hidden="true"><div class="lp-scr">
      <div class="st st1"><div class="lg-logo">UR</div><small>${L("mOrder")}</small><b class="num">128</b><span>${L("mWait")}</span><b class="cd">04:12</b><i class="dots"><i></i><i></i><i></i></i><span class="chip">${L("mAhead")}</span></div>
      <div class="st st2"><div class="bell"><div class="wave"></div>📳</div><b>${L("mReady")}</b><span>${L("mPick")}</span><span class="chip dark">${L("mOrder")} 128</span></div>
      <div class="st st3"><b>${L("mRate")}</b><div class="stars5">★★★★★</div><span class="gbtn">${googleG()} ${L("mGoogle")}</span></div>
    </div></div>
  </div>
  <div class="wrap lp-kpis"><div><b>0</b><span>${L("k1")}</span></div><div><b>0</b><span>${L("k2")}</span></div><div><b>5</b><span>${L("k3")}</span></div></div>
  </section>

  <section class="lp-story" id="how"><div class="wrap">
    <div class="sec-head rv"><span class="sec-ey">${L("howEy")}</span><h2>${L("howT")}</h2></div>
    <div class="story">
      <div class="story-phone"><div class="sp" data-active="1">
        <div class="sc" data-s="1"><div class="sc-logo">ق</div><small>${L("stScan")}</small><div class="sc-qr">${qrSVG(custURL(DEMO_SLUG))}<i class="scan"></i></div></div>
        <div class="sc" data-s="2"><div class="sc-logo">ق</div><small>${L("stEnter")}</small><div class="sc-input num"><span class="ty">128</span><i class="caret"></i></div><div class="sc-btn">${L("stStart")}</div></div>
        <div class="sc" data-s="3"><small>${L("mOrder")} 128</small><div class="sc-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52"/><circle class="pr" cx="60" cy="60" r="52"/></svg><b class="num">04:12</b></div><span class="chip">${L("mAhead")}</span></div>
        <div class="sc ringing-s" data-s="4"><div class="bell2"><i></i>📳</div><b>${L("mReady")}</b><span>${L("mPick")}</span></div>
        <div class="sc" data-s="5"><b>${L("mRate")}</b><div class="stars5">★★★★★</div><span class="gbtn">${googleG()} ${L("mGoogle")}</span></div>
      </div></div>
      <ol class="story-steps">${[1,2,3,4,5].map(i=>`<li class="ss" data-step="${i}"><span class="n">0${i}</span><h3>${L("st"+i+"t")}</h3><p>${L("st"+i+"d")}</p></li>`).join("")}</ol>
    </div></div></section>

  <section class="wrap lp-sec lp-video"><div class="vid-frame"><video src="${lang==="ar"?"reel-ar.mp4?v=202610280021":"reel.mp4?v=202610280021"}" poster="${lang==="ar"?"reel-ar-poster.jpg":"reel-poster.jpg"}" muted autoplay loop playsinline preload="metadata"></video><button type="button" class="vid-sound" data-sound>${lang==="ar"?"🔊 شغّل الصوت":"🔊 Sound on"}</button></div>
    <div class="rv"><span class="sec-ey">${L("secEy0")}</span><h2>${L("vidT")}</h2><ul class="lp-checks">${[1,2,3].map(i=>`<li>${check}${L("vid"+i)}</li>`).join("")}</ul><div class="cta" style="margin-top:18px"><a class="btn primary lg" href="?v=demo">${L("ctaDemo")}</a></div></div></section>

  <section class="wrap lp-sec"><div class="sec-head rv"><span class="sec-ey">${L("secEy1")}</span><h2>${L("vsT")}</h2></div><div class="lp-vs rv">
    <div class="vs old"><h3>${L("vsOld")}</h3><ul>${[1,2,3,4,5].map(i=>`<li>${cross}${L("o"+i)}</li>`).join("")}</ul></div>
    <div class="vs new"><h3>${L("vsNew")}</h3><ul>${[1,2,3,4,5].map(i=>`<li>${check}${L("n"+i)}</li>`).join("")}</ul></div></div></section>

  <section class="wrap lp-sec"><div class="sec-head rv"><span class="sec-ey">${L("secEy2")}</span><h2>${L("bT")}</h2></div><div class="lp-ben rv">${[["⚡",1],["👆",2],["⭐",3],["🎨",4],["📊",5],["🌍",6]].map(([e,i])=>`<div><span class="e">${e}</span><b>${L("b"+i+"t")}</b><span>${L("b"+i+"d")}</span></div>`).join("")}</div></section>

  <section class="lp-price-wrap" id="price"><div class="wrap lp-sec"><div class="sec-head rv"><span class="sec-ey">${L("secEy3")}</span><h2>${L("pT")}</h2><p class="lp-lead">${L("pS")}</p></div>
    <div class="lp-plans rv">
      <div class="lp-plan"><h3>${L("pM")}</h3><div class="amt"><b class="num">${m.toLocaleString()}</b> <span>${t("egp")} ${L("pPerM")}</span></div><small>${L("pMNote")}</small>
        <ul class="lp-checks">${feats}</ul><a class="btn primary lg" href="${wa(L("pWa")(L("pM")))}" target="_blank" rel="noopener">${L("pCta")}</a></div>
      <div class="lp-plan best"><span class="ribbon">${L("pBest")}</span><h3>${L("pY")}</h3><div class="amt"><b class="num">${y.toLocaleString()}</b> <span>${t("egp")} ${L("pPerY")}</span></div><small class="save">${L("pYNote")(save)}</small>
        <ul class="lp-checks">${feats}</ul><a class="btn signal lg" href="${wa(L("pWa")(L("pY")))}" target="_blank" rel="noopener">${L("pCta")}</a></div>
    </div></div></section>

  <section class="wrap lp-sec" id="faq"><div class="sec-head rv"><span class="sec-ey">${L("secEy4")}</span><h2>${L("qT")}</h2></div><div class="lp-faq rv">${[1,2,3,4,5,6].map(i=>`<details><summary>${L("q"+i)}</summary><p>${L("a"+i)}</p></details>`).join("")}</div></section>

  <section class="wrap lp-sec"><div class="lp-end rv"><div><h2>${L("endT")}</h2><p>${L("endS")}</p>
      <div class="cta"><a class="btn signal lg" href="?v=demo">${L("ctaDemo")}</a><a class="btn ghost lg on-dark" href="${wa()}" target="_blank" rel="noopener">${L("ctaWa")}</a></div></div>
    <div class="qr">${qrSVG(waLink(OUR_WA,t("trialWaMsg")))}</div></div></section>
  <section class="wrap lp-sec" id="contact"><div class="sec-head rv"><span class="sec-ey">${L("secEy5")}</span><h2>${L("ctT")}</h2><p class="lp-lead">${L("ctS")}</p></div><div class="lp-contact rv">
    <a href="${wa()}" target="_blank" rel="noopener"><span class="e">💬</span><b>${L("ctWa")}</b><span dir="ltr">${esc(OUR_WA)}</span></a>
    ${BRAND.instagram?`<a href="https://instagram.com/${esc(BRAND.instagram)}" target="_blank" rel="noopener"><span class="e">📸</span><b>${L("ctIg")}</b><span dir="ltr">@${esc(BRAND.instagram)}</span></a>`:""}
    ${BRAND.email?`<a href="mailto:${esc(BRAND.email)}"><span class="e">✉️</span><b>${L("ctEm")}</b><span dir="ltr">${esc(BRAND.email)}</span></a>`:""}
  </div></section>
  <footer class="lp-footer"><div class="wrap">
    <div class="brandline"><img src="icon.svg" width="28" height="28" alt="">UR TURN</div>
    <div class="legal">${BRAND.owner?`<span>${L("owned")(BRAND.owner)}</span>`:""}${BRAND.reg?`<span>${esc(L("regNo")(BRAND.reg))}</span>`:""}<span>© 2026 <bdi>UR TURN</bdi> · ${L("rights")}</span></div>
  </div></footer>
  </div>`;
  lpMotion();
  const vb=app.querySelector("[data-sound]"); if(vb){ vb.addEventListener("click",()=>{ const v=app.querySelector(".vid-frame video"); v.muted=!v.muted; if(!v.muted){ v.currentTime=0; v.play(); } vb.textContent=v.muted?(lang==="ar"?"🔊 شغّل الصوت":"🔊 Sound on"):(lang==="ar"?"🔇 اكتم":"🔇 Mute"); }); }
}

const DEMO_T={
ar:{title:"العرض الحي",sub:"جرّب النظام كامل من هون: إنت الزبون وإنت الكاشير بنفس الوقت.",
 s1:"اكتب أي رقم فاتورة بجوال الزبون",s2:"حدّد وقت التحضير، وبعدين اضغط «جاهز»",s3:"اسمع الجوال كيف بيرن 🔔",
 sound:"🔊 علّي الصوت عشان تسمع الرنة",restart:"↺ ابدأ من جديد",cashTitle:"شاشة الكاشير",
 qrT:"جرّبها على جوالك الحقيقي 📱",qrP:"امسح الكود بجوالك واكتب أي رقم. الطلب بيظهر هون بشاشة الكاشير، اضغط «جاهز» وجوالك اللي بإيدك بيرن ويهتز.",
 live:"مباشر",endT:"عجبك؟ خلّيه عندك بالمحل",endP:"أول أسبوع مجاناً، بدون عقد، والتركيب بنفس اليوم.",endBtn:"ابدأ أسبوعك المجاني"},
en:{title:"Live demo",sub:"Try the whole system right here: you’re the customer and the cashier at the same time.",
 s1:"Type any receipt number on the customer phone",s2:"Pick a prep time, then tap “Ready”",s3:"Hear the phone ring 🔔",
 sound:"🔊 Turn your sound up to hear the ring",restart:"↺ Start over",cashTitle:"Cashier screen",
 qrT:"Try it on your real phone 📱",qrP:"Scan with your phone and type any number. The order shows up here on the cashier screen; tap “Ready” and the phone in your hand rings and buzzes.",
 live:"Live",endT:"Like it? Get it in your shop",endP:"First week free, no contract, same-day setup.",endBtn:"Start your free week"}};
async function demoPage(){
  topbar("demo");
  const D=k=>(DEMO_T[lang]||DEMO_T.ar)[k];
  const shop=await loadShop(DEMO_SLUG); if(!shop){ msg(t("netErr")); return; }
  applyShop(shop);
  const custLink=custURL(DEMO_SLUG);
  app.innerHTML=`<div class="wrap dm">
    <div class="dm-head"><div><h1>${D("title")}</h1><p>${D("sub")}</p></div><span class="dm-live"><i></i>${D("live")}</span></div>
    <ol class="dm-steps">${[1,2,3].map(i=>`<li data-step="${i}"><span class="n">${i}</span>${D("s"+i)}</li>`).join("")}</ol>
    <div class="dm-bar"><span>${D("sound")}</span><button class="btn small ghost" type="button" data-restart>${D("restart")}</button></div>
    <div class="dm-grid">
      <div><div class="label">${t("customerPhone")}</div><div class="phone"><div class="cust" id="demoCust"></div></div></div>
      <div class="dm-side"><div><div class="label">${D("cashTitle")}</div><div id="demoCash"></div></div>
        <div class="dm-qr"><div class="qr">${qrSVG(custLink)}</div><div><b>${D("qrT")}</b><p>${D("qrP")}</p></div></div></div>
    </div>
    <div class="dm-end"><div><h2>${D("endT")}</h2><p>${D("endP")}</p></div><a class="btn signal lg" href="${esc(waLink(OUR_WA,t("trialWaMsg")))}" target="_blank" rel="noopener">${D("endBtn")}</a></div>
  </div>`;
  const stepOf={enter:1,waiting:2,ready:3,done:3};
  const setStep=st=>{ const n=stepOf[st]||1; app.querySelectorAll("[data-step]").forEach(li=>{ const i=+li.dataset.step; li.classList.toggle("on",i===n); li.classList.toggle("done",i<n||st==="done"); }); };
  const store=ShopStore(shop); Cashier($("#demoCash"),store,DEMO_KEY);
  const c=Customer($("#demoCust"),shop,{suffix:".frame",inFrame:true,store,onState:setStep});
  app.querySelector("[data-restart]").addEventListener("click",()=>{ c.reset(); store.refresh(); });
  store.listeners.add(()=>c.poll()); store.start(2000);
}

