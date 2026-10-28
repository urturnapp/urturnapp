(function(){
"use strict";
// ---------- config ----------
const SUPA_URL = "https://exfxqtgcvbfpvgiykupk.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZnhxdGdjdmJmcHZnaXlrdXBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzgzNjQsImV4cCI6MjA5MDQ1NDM2NH0.cCqvsJ1fgZ4xs0x-q57iHIjbpwrBBO8GvZ1X2h-6LBo";
const DEMO_SLUG = "demo";
const OUR_WA = "+201055602979"; // UR TURN sales WhatsApp
const BRAND = { instagram:"urturn.app", email:"urturnapp1@gmail.com", owner:"Azmi Elwahedi", reg:"" }; // fill in: instagram handle (no @), email, legal owner name, commercial reg. no.
const DEMO_KEY = "7d4ff772fa0a253cfabc7855"; // demo shop only: settings are locked on the server
const BASE = location.origin + location.pathname.replace(/index\.html$/,"");
const P = new URLSearchParams(location.search);
const SLUG = (P.get("s")||"").toLowerCase();
const VIEW = P.get("v") || (SLUG ? "customer" : "home");
const KEY = P.get("k") || "";

// ---------- i18n ----------
const T = {
ar:{
 tabHome:"الرئيسية",tabDemo:"عرض تجريبي",
 eyebrow:"نظام نداء ذكي للمقاهي والمطاعم",heroA:"جوال الزبون صار",heroB:"البيجر",
 heroP:"بدون تطبيق وبدون أجهزة. الزبون يمسح الكود على الكاونتر، يكتب رقم فاتورته، ويقعد مرتاح. لما الطلب يجهز، الكاشير يضغط زر واحد وجوال الزبون يرن ويهتز.",
 tryDemo:"جرّب العرض الكامل",artYour:"طلبك جاهز",artSub:"تفضل استلمه من الكاونتر",artOrder:"فاتورة رقم",
 howTitle:"كيف يشتغل",
 s1b:"الكاشير يطبع الفاتورة",s1:"زي ما هو معتاد، بدون أي تغيير بطريقة الشغل.",
 s2b:"الزبون يمسح الكود",s2:"QR على الكاونتر يفتح صفحة المحل مباشرة، بدون تحميل تطبيق.",
 s3b:"يكتب رقم الفاتورة",s3:"الطلب بينزل لحاله على شاشة الكاشير، والكاشير ما بيسجّل إشي.",
 s4b:"الكاشير يضغط «جاهز»",s4:"جوال الزبون يرن ويهتز، وبعد الاستلام نطلب منه تقييم على جوجل.",
 screensTitle:"جرّب الشاشات",
 scDemo:"العرض التجريبي",scDemoP:"جوال الزبون وشاشة الكاشير جنب بعض.",
 scCust:"صفحة الزبون",scCustP:"اللي بتفتح لما الزبون يمسح الكود. جرّبها من جوال ثاني.",
 scCash:"شاشة الكاشير",scCashP:"الطلبات بتنزل لحالها، وزر «جاهز» لكل طلب.",
 open:"افتح ←",
 whyTitle:"ليش UR TURN",
 w1:"ما في أجهزة بيجر تنكسر أو تضيع أو تحتاج شحن.",w2:"تقييمات أكثر على جوجل لأننا نطلبها لحظة الاستلام.",
 w3:"يشتغل مع أي كاشير، والكاشير شغله زر واحد.",w4:"كل محل باسمه وشعاره ولونه ورابطه.",
 trialTitle:"أسبوع تجربة مجاني",etaLabel:"الوقت المتوقع لطلبك",etaSoon:"قرّب يجهز، خليك قريب ⏳",etaSet:"وقت التحضير:",minShort:"د",etaLeft:x=>`باقي ${x}`,trialQr:"امسح الكود وكلّمنا واتساب 👇",trialWaMsg:"مرحبا، شفت UR TURN وبدي أجرّبه أسبوع ببلاش بمحلي.",trialWaBtn:"تواصل معنا واتساب",trialP:"التركيب بياخذ 5 دقايق. المحل بيجرّب النظام أسبوع كامل ببلاش، وبعدين بنحدد السعر سوا حسب النتيجة.",
 demoHint:"اكتب رقم فاتورة بجوال الزبون، بعدين اضغط «جاهز» من شاشة الكاشير. وجرّب كمان تفتح صفحة الزبون من جوال ثاني.",
 customerPhone:"جوال الزبون",
 welcome:"أهلاً فيك! اكتب رقم الفاتورة وخلّيك مرتاح، رح نبلغك لما يجهز طلبك.",
 receiptLabel:"رقم الفاتورة",receiptPh:"مثلاً 128",waitBtn:"انتظر دوري",
 waitingTitle:"طلبك قيد التحضير",waitingP:"خلّي هالصفحة مفتوحة. رح يرن جوالك ويهتز لما يجهز الطلب.",
 ahead:(n)=> n===0?"طلبك هو التالي":(n===1?"قبلك طلب واحد":"قبلك "+n+" طلبات"),
 tipSound:"خلّي صوت الجوال شغّال والشاشة مفتوحة.",cancel:"إلغاء ورقم مختلف",
 ready:"طلبك جاهز!",readyP:"تفضل استلمه من الكاونتر",gotIt:"استلمت طلبي",
 thanks:"بالعافية!",thanksP:"شكراً لزيارتك. كيف كانت تجربتك؟",rateGoogle:"قيّمنا على جوجل",
 rateThanks:"شكراً! رأيك بيوصل للإدارة مباشرة.",newOrder:"طلب جديد",powered:"يعمل بنظام",
 cashierTitle:"الطلبات",stWaiting:"قيد التحضير",stReady:"بانتظار الاستلام",stDone:"تم التسليم اليوم",
 addPh:"رقم فاتورة (اختياري)",addBtn:"إضافة",
 colWaiting:"قيد التحضير",colReady:"جاهز، بانتظار الزبون",
 readyBtn:"جاهز",ringAgain:"رنّ مرة ثانية",delivered:"تم التسليم",remove:"حذف",
 emptyWaiting:"ما في طلبات حالياً. لما الزبون يكتب رقم فاتورته بيظهر هون لحاله.",emptyReady:"ما في طلبات جاهزة.",
 since:(m)=> m<1?"الآن":("منذ "+m+" د"),fromCustomer:"سجّله الزبون",fromCashier:"أضافه الكاشير",
 readyFor:(m)=> m<1?"جاهز الآن":("جاهز منذ "+m+" د"),
 navCashier:"الكاشير",navOwner:"التقارير",
 ownerTitle:"بيانات المحل",fName:"اسم المحل",fLogo:"الشعار",fLogoHint:"صورة مربعة أفضل.",
 upload:"رفع شعار",removeLogo:"إزالة",fColor:"لون المحل",
 fReview:"رابط تقييم جوجل",fReviewHint:"من Google Maps: صفحة المحل ← «اكتب مراجعة» ← انسخ الرابط.",
 fWelcome:"رسالة الترحيب (اختياري)",save:"حفظ",saved:"تم الحفظ ✓",demoLocked:"هذا محل تجريبي، الإعدادات مقفلة.",
 posterTitle:"ستاند الكاونتر",printPoster:"🖨️ اطبع الستاند / حمّله PDF",posterH:"امسح وانتظر دورك",posterP:"اكتب رقم فاتورتك وبنرن على جوالك لما يجهز طلبك",
 linksTitle:"الروابط",custLink:"رابط الزبون (هو نفسه الـ QR)",cashLink:"رابط شاشة الكاشير (سرّي)",ownLink:"رابط التقارير لصاحب المحل (سرّي)",
 copy:"نسخ",copied:"تم النسخ",
 statsTitle:"آخر 7 أيام",sOrders:"طلب",sWait:"متوسط الانتظار (د)",sRating:"متوسط التقييم",sRatings:"تقييم",
 setupTitle:"التركيب بـ5 دقايق",
 su1:"الاسم والشعار",su2:"لون المحل",su3:"رابط تقييم جوجل",su4:"اطبع الستاند وحطه على الكاونتر",su5:"افتح شاشة الكاشير وجرّب طلب",
 adminTitle:"لوحة UR TURN",newShop:"محل جديد",slug:"اسم المحل بالرابط (أحرف إنجليزية وأرقام فقط)",slugPh:"مثلاً alhara",slugHint:"بيظهر بآخر رابط الزبون والـ QR: ",
 shopName:"اسم المحل",create:"إنشاء",created:"جاهز! هاي روابط المحل. رابط الكاشير والتقارير بيظهروا مرة وحدة، احفظهم أو ابعثهم لصاحب المحل.",
 shops:"المحلات",colShop:"المحل",colSlug:"المعرّف",colOrders:"طلبات 7 أيام",colRating:"التقييم",newKey:"رابط كاشير جديد",
 badLink:"الرابط غير صحيح أو منتهي. اطلب رابط جديد.",noShop:"ما لقينا هذا المحل. تأكد من الكود.",
 netErr:"في مشكلة بالاتصال، بنحاول مرة ثانية...",errGeneric:"صار خطأ، جرّب مرة ثانية.",
 badNumber:"اكتب أرقام بس.",contactToEdit:"لتعديل الاسم أو الشعار أو اللون أو رابط جوجل، تواصل مع فريق UR TURN.",editShop:"تعديل",edit:"تعديل",customColor:"أو اختار أي لون:",slugTaken:"هذا المعرّف مستخدم، اختار غيره.",
 subTitle:"الاشتراك",plan_trial:"تجربة مجانية (7 أيام)",plan_m1:"شهري",plan_m3:"3 شهور",plan_m12:"سنوي",plan_demo:"عرض تجريبي",
 egp:"ج.م",month:"شهر",daysLeft:d=>`باقي ${d} يوم`,expired:"منتهي",until:"لغاية",
 renew:"تجديد",renewNow:"جدّد الاشتراك",saveOnly:"حفظ بدون تجديد",shopWa:"واتساب المحل أو صاحبه",shopWaPh:"مثلاً 01012345678",
 notes:"ملاحظات (مثلاً: استلم الستاند)",archive:"أرشفة",restore:"استرجاع",archived:"مؤرشف",confirmArchive:n=>`أرشفة "${n}"؟ رح يوقف عندهم النظام، وبتقدر ترجّعه بأي وقت.`,
 alertsTitle:"تنبيهات التجديد",noAlerts:"ما في اشتراكات قربت تخلص.",sendWa:"ابعت واتساب",noWa:"ما في رقم واتساب",
 colSub:"الاشتراك",renewed:d=>`تم التجديد لغاية ${d} ✓`,standGift:"ستاند QR هدية مع كل اشتراك",save2:n=>`وفّر ${n} ج.م`,
 offersTitle:"باقات الاشتراك",
 subOk:(d,dt)=>`اشتراكك فعّال، باقي ${d} يوم (لغاية ${dt}).`,subSoon:d=>d<=0?"اشتراكك بيخلص اليوم. للتجديد تواصل معنا.":`اشتراكك بيخلص بعد ${d} يوم. للتجديد تواصل معنا.`,
 subEnded:"انتهى اشتراك UR TURN وتوقف النظام مؤقتاً. للتجديد تواصل معنا على واتساب ومنرجّعه فوراً.",contactWa:"تواصل معنا واتساب",
 custPaused:"الخدمة متوقفة مؤقتاً. اسأل الكاشير عن طلبك.",
 waSoon:(n,d,dt)=>`أهلاً ${n} 👋\nحابين نفكّركم إن اشتراك UR TURN عندكم بيخلص بعد ${d} يوم (${dt}).\nعشان يفضل النظام شغال بدون توقف، رد علينا هنا ومنجدّد لكم بدقيقة.\nشكراً لثقتكم ☕`,
 waEnded:n=>`أهلاً ${n} 👋\nاشتراك UR TURN عندكم خلص، والنظام توقف مؤقتاً.\nللتجديد تواصل معنا هنا على الواتساب، ومنرجّع كل اشي شغال فوراً.\nمستنيينكم ☕`,
 waRenew:"مرحبا، بدي أجدد اشتراك UR TURN لمحل: "
},
en:{
 tabHome:"Home",tabDemo:"Live demo",
 eyebrow:"Smart pickup paging for cafes and restaurants",heroA:"The customer's phone is",heroB:"the pager",
 heroP:"No app and no hardware. The customer scans the counter QR, types their receipt number and relaxes. When the order is ready, the cashier taps one button and the phone rings and vibrates.",
 tryDemo:"Try the full demo",artYour:"Your order is ready",artSub:"Please pick it up at the counter",artOrder:"Receipt",
 howTitle:"How it works",
 s1b:"Cashier prints the receipt",s1:"Exactly as today.",
 s2b:"Customer scans the QR",s2:"Opens the shop's page. No app download.",
 s3b:"Types the receipt number",s3:"The order appears on the cashier screen by itself. The cashier types nothing.",
 s4b:"Cashier taps “Ready”",s4:"The phone rings and vibrates. After pickup we ask for a Google review.",
 screensTitle:"Try the screens",
 scDemo:"Live demo",scDemoP:"Customer phone and cashier screen side by side.",
 scCust:"Customer page",scCustP:"What opens after scanning the QR. Try it from another phone.",
 scCash:"Cashier screen",scCashP:"Orders appear by themselves, with a “Ready” button.",
 open:"Open →",
 whyTitle:"Why UR TURN",
 w1:"No pager devices to break, lose or charge.",w2:"More Google reviews, asked for at pickup.",
 w3:"Works with any cashier; one button to use.",w4:"Each shop with its own name, logo, color and link.",
 trialTitle:"Free first week",etaLabel:"Estimated time",etaSoon:"Almost ready, stay close ⏳",etaSet:"Prep time:",minShort:"min",etaLeft:x=>`${x} left`,trialQr:"Scan to message us on WhatsApp 👇",trialWaMsg:"Hi, I saw UR TURN and would like the free 1-week trial for my shop.",trialWaBtn:"Message us on WhatsApp",trialP:"Setup takes 5 minutes. The shop tries it free for a full week, then we agree on a price together.",
 demoHint:"Enter a receipt number on the customer phone, then tap “Ready” on the cashier screen. Also try opening the customer page on another phone.",
 customerPhone:"Customer phone",
 welcome:"Welcome! Enter your receipt number and relax. We'll alert you when your order is ready.",
 receiptLabel:"Receipt number",receiptPh:"e.g. 128",waitBtn:"Wait for my turn",
 waitingTitle:"Your order is being prepared",waitingP:"Keep this page open. Your phone will ring and vibrate when it's ready.",
 ahead:(n)=> n===0?"You're next":(n===1?"1 order ahead of you":n+" orders ahead of you"),
 tipSound:"Keep your sound on and the screen open.",cancel:"Cancel / different number",
 ready:"Your order is ready!",readyP:"Please pick it up at the counter",gotIt:"I picked it up",
 thanks:"Enjoy!",thanksP:"Thanks for visiting. How was your experience?",rateGoogle:"Rate us on Google",
 rateThanks:"Thank you! Your feedback goes straight to the manager.",newOrder:"New order",powered:"Powered by",
 cashierTitle:"Orders",stWaiting:"Preparing",stReady:"Awaiting pickup",stDone:"Served today",
 addPh:"Receipt number (optional)",addBtn:"Add",
 colWaiting:"Preparing",colReady:"Ready, waiting for customer",
 readyBtn:"Ready",ringAgain:"Ring again",delivered:"Picked up",remove:"Remove",
 emptyWaiting:"No orders yet. They appear here by themselves when a customer enters a receipt number.",emptyReady:"No ready orders.",
 since:(m)=> m<1?"just now":(m+" min ago"),fromCustomer:"added by customer",fromCashier:"added by cashier",
 readyFor:(m)=> m<1?"ready now":("ready "+m+" min"),
 navCashier:"Cashier",navOwner:"Reports",
 ownerTitle:"Shop details",fName:"Shop name",fLogo:"Logo",fLogoHint:"Square works best.",
 upload:"Upload logo",removeLogo:"Remove",fColor:"Brand color",
 fReview:"Google review link",fReviewHint:"From Google Maps: shop page → “Write a review” → copy the link.",
 fWelcome:"Welcome message (optional)",save:"Save",saved:"Saved ✓",demoLocked:"This is a demo shop; settings are locked.",
 posterTitle:"Counter stand",printPoster:"🖨️ Print stand / save PDF",posterH:"Scan & wait for your turn",posterP:"Enter your receipt number and we'll ring your phone when it's ready",
 linksTitle:"Links",custLink:"Customer link (same as the QR)",cashLink:"Cashier screen link (private)",ownLink:"Owner reports link (private)",
 copy:"Copy",copied:"Copied",
 statsTitle:"Last 7 days",sOrders:"orders",sWait:"avg wait (min)",sRating:"avg rating",sRatings:"ratings",
 setupTitle:"Set up in 5 minutes",
 su1:"Name and logo",su2:"Brand color",su3:"Google review link",su4:"Print the stand, put it on the counter",su5:"Open the cashier screen and test an order",
 adminTitle:"UR TURN admin",newShop:"New shop",slug:"Shop name in the link (English letters and numbers)",slugPh:"e.g. alhara",slugHint:"Appears at the end of the customer link and QR: ",
 shopName:"Shop name",create:"Create",created:"Shop created. Save the links; the cashier link is shown once.",
 shops:"Shops",colShop:"Shop",colSlug:"Id",colOrders:"Orders 7d",colRating:"Rating",newKey:"New cashier link",
 badLink:"This link is invalid or expired. Ask for a new one.",noShop:"We couldn't find this shop. Check the code.",
 netErr:"Connection problem, retrying...",errGeneric:"Something went wrong, try again.",
 badNumber:"Numbers only.",contactToEdit:"To change the name, logo, color or Google link, contact the UR TURN team.",editShop:"Edit",edit:"Edit",customColor:"Or pick any color:",slugTaken:"That id is taken, pick another.",
 subTitle:"Subscription",plan_trial:"Free trial (7 days)",plan_m1:"Monthly",plan_m3:"3 months",plan_m12:"Yearly",plan_demo:"Demo",
 egp:"EGP",month:"month",daysLeft:d=>`${d} days left`,expired:"Expired",until:"until",
 renew:"Renew",renewNow:"Renew subscription",saveOnly:"Save without renewing",shopWa:"Shop / owner WhatsApp",shopWaPh:"e.g. 01012345678",
 notes:"Notes (e.g. got the stand)",archive:"Archive",restore:"Restore",archived:"Archived",confirmArchive:n=>`Archive "${n}"? Their system stops; you can restore it any time.`,
 alertsTitle:"Renewal alerts",noAlerts:"No subscriptions ending soon.",sendWa:"Send WhatsApp",noWa:"No WhatsApp number",
 colSub:"Subscription",renewed:d=>`Renewed until ${d} ✓`,standGift:"Free QR stand with every plan",save2:n=>`Save ${n} EGP`,
 offersTitle:"Plans",
 subOk:(d,dt)=>`Subscription active, ${d} days left (until ${dt}).`,subSoon:d=>d<=0?"Your subscription ends today. Contact us to renew.":`Your subscription ends in ${d} days. Contact us to renew.`,
 subEnded:"Your UR TURN subscription has ended and the system is paused. Contact us on WhatsApp to renew and we'll turn it back on right away.",contactWa:"Contact us on WhatsApp",
 custPaused:"Service is paused. Please ask the cashier about your order.",
 waSoon:(n,d,dt)=>`Hi ${n} 👋\nA friendly reminder that your UR TURN subscription ends in ${d} days (${dt}).\nReply here and we'll renew it in a minute.\nThank you ☕`,
 waEnded:n=>`Hi ${n} 👋\nYour UR TURN subscription has ended and the system is paused.\nTo renew, just reply here on WhatsApp and we'll turn everything back on right away.\nThank you ☕`,
 waRenew:"Hi, I'd like to renew UR TURN for: "
}};
let lang="ar"; try{ lang=localStorage.getItem("urturn.lang")||"ar"; }catch(e){}
const t=(k,...a)=>{ const v=(T[lang]||T.ar)[k]; return typeof v==="function"? v(...a) : (v ?? k); };
const esc=s=>String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $=sel=>document.querySelector(sel);
const mins=ts=>Math.max(0,Math.floor((Date.now()-new Date(ts).getTime())/60000));
const ls={ get(k){ try{return localStorage.getItem(k);}catch(e){return null;} }, set(k,v){ try{ v==null?localStorage.removeItem(k):localStorage.setItem(k,v);}catch(e){} } };

// ---------- API ----------
const H={"apikey":SUPA_KEY,"Authorization":"Bearer "+SUPA_KEY,"Content-Type":"application/json"};
async function rest(path){
  const r=await fetch(SUPA_URL+"/rest/v1/"+path,{headers:H,cache:"no-store"});
  if(!r.ok) throw new Error("http_"+r.status);
  return r.json();
}
async function rpc(name,args){
  const r=await fetch(SUPA_URL+"/rest/v1/rpc/"+name,{method:"POST",headers:H,body:JSON.stringify(args||{})});
  const txt=await r.text(); let data=null; try{ data=txt?JSON.parse(txt):null; }catch(e){ data=txt; }
  if(!r.ok){ const err=new Error((data&&data.message)||("http_"+r.status)); err.code=(data&&data.message)||""; throw err; }
  return data;
}
const Api={
  shop:slug=>rest("urturn_shops?select=*&slug=eq."+encodeURIComponent(slug)).then(r=>r[0]||null),
  orders:shopId=>rest("urturn_orders?select=*&shop_id=eq."+shopId+"&created_at=gte."+encodeURIComponent(new Date(Date.now()-12*3600e3).toISOString())+"&order=created_at.asc"),
  order:id=>rest("urturn_orders?select=*&id=eq."+id).then(r=>r[0]||null),
  week:shopId=>rest("urturn_orders?select=status,created_at,done_at,ready_at,rating&shop_id=eq."+shopId+"&created_at=gte."+encodeURIComponent(new Date(Date.now()-7*864e5).toISOString())),
};

// ---------- UI helpers ----------
let toastTimer=null;
function toast(msg){ const el=$("#toast"); el.textContent=msg; el.hidden=false; clearTimeout(toastTimer); toastTimer=setTimeout(()=>{el.hidden=true;},3000); }
function inkFor(hex){ const n=parseInt((hex||"#000000").slice(1),16); const r=(n>>16)&255,g=(n>>8)&255,b=n&255; return (0.299*r+0.587*g+0.114*b)/255>0.6?"#14181C":"#FFFFFF"; }
function applyShop(shop){ const c=(shop&&shop.color)||"#0E5E5A"; document.documentElement.style.setProperty("--shop",c); document.documentElement.style.setProperty("--shop-ink",inkFor(c)); }
function logoHTML(shop,extra){ if(shop&&shop.logo) return `<img class="shop-logo" src="${esc(shop.logo)}" alt="" ${extra||""}>`; return `<div class="shop-logo" aria-hidden="true" ${extra||""}>${esc(((shop&&shop.name)||"U").trim().charAt(0))}</div>`; }
function qrSVG(text){ const q=qrcode(0,"M"); q.addData(text); q.make(); return q.createSvgTag({cellSize:6,margin:2,scalable:true}); }
function printPoster(el){
  const cs=getComputedStyle(el), bg=cs.backgroundColor, ink=cs.color;
  const w=window.open("","_blank"); if(!w) return;
  const css=`@page{size:A5;margin:0}*{box-sizing:border-box}html,body{margin:0;background:#fff}body{min-height:100vh;display:grid;place-items:center;font-family:"IBM Plex Sans Arabic","Readex Pro",system-ui,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.poster{width:128mm;height:190mm;background:${bg};color:${ink};border-radius:8mm;padding:12mm 10mm;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6mm;text-align:center}
.shop-logo{width:24mm;height:24mm;border-radius:6mm;object-fit:cover;background:#fff;display:grid;place-items:center;font-family:"Readex Pro",sans-serif;font-weight:700;font-size:12mm;box-shadow:0 2mm 6mm rgba(0,0,0,.18)}
h3{font-family:"Readex Pro",sans-serif;font-size:30pt;line-height:1.15;margin:0}
.qr{background:#fff;padding:5mm;border-radius:5mm;line-height:0}.qr svg{width:78mm;height:78mm;display:block}
p{margin:0;font-size:13pt;opacity:.92;max-width:100mm}b{font-family:"Readex Pro",sans-serif;font-size:19pt;display:block}.ur{display:block;font-size:10pt;letter-spacing:.12em;opacity:.8}`;
  w.document.write(`<!doctype html><html lang="${document.documentElement.lang||"ar"}" dir="${document.documentElement.dir||"rtl"}"><head><meta charset="utf-8"><title>UR TURN QR</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;600&display=swap"><style>${css}</style></head><body><div class="poster">${el.innerHTML}</div><script>addEventListener("load",()=>{(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>setTimeout(()=>print(),300))})<\/script></body></html>`);
  w.document.close();
}
document.addEventListener("click",e=>{ const b=e.target.closest("[data-printposter]"); if(!b) return; const p=b.parentElement.querySelector("[data-poster]"); if(p) printPoster(p); });
function copyBtn(btn,input){ btn.addEventListener("click",async()=>{ try{ await navigator.clipboard.writeText(input.value); btn.textContent=t("copied"); setTimeout(()=>btn.textContent=t("copy"),1500);}catch(e){ input.select(); } }); }
const custURL=slug=>BASE+"?s="+encodeURIComponent(slug);
const cashURL=(slug,k)=>BASE+"?s="+encodeURIComponent(slug)+"&v=cashier&k="+encodeURIComponent(k);
const ownURL=(slug,k)=>BASE+"?s="+encodeURIComponent(slug)+"&v=owner&k="+encodeURIComponent(k);
function googleG(){ return `<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>`; }

// ---------- sound + vibration ----------
const Ring={ ctx:null,timer:null,on:false,
  unlock(){ try{ if(!this.ctx){ const C=window.AudioContext||window.webkitAudioContext; if(C) this.ctx=new C(); } this.ctx&&this.ctx.resume&&this.ctx.resume(); }catch(e){} },
  chime(){ if(!this.ctx) return; const now=this.ctx.currentTime;
    [880,1175,1568,1175,1568].forEach((f,i)=>{ const o=this.ctx.createOscillator(),g=this.ctx.createGain(); o.type="sine"; o.frequency.value=f; o.connect(g); g.connect(this.ctx.destination);
      const s=now+i*0.16; g.gain.setValueAtTime(0.0001,s); g.gain.exponentialRampToValueAtTime(0.4,s+0.02); g.gain.exponentialRampToValueAtTime(0.0001,s+0.15); o.start(s); o.stop(s+0.16); }); },
  start(){ if(this.on) return; this.on=true; this.unlock(); const tick=()=>{ this.chime(); try{ navigator.vibrate&&navigator.vibrate([350,150,350,150,600]); }catch(e){} }; tick(); this.timer=setInterval(tick,1800); },
  stop(){ if(!this.on) return; this.on=false; clearInterval(this.timer); this.timer=null; try{ navigator.vibrate&&navigator.vibrate(0); }catch(e){} }
};
let wakeLock=null;
async function keepAwake(){ try{ if(navigator.wakeLock&&(!wakeLock||wakeLock.released)) wakeLock=await navigator.wakeLock.request("screen"); }catch(e){} }
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible") keepAwake(); });


// ---------- subscriptions ----------
// Prices in EGP. Change them here.
const PLANS={ m1:{months:1,price:1500}, m12:{months:12,price:15000} };
const daysLeft=ts=>Math.ceil((new Date(ts).getTime()-Date.now())/864e5);
const fmtDate=ts=>new Date(ts).toLocaleDateString(lang==="ar"?"ar-EG":"en-GB",{day:"numeric",month:"long",year:"numeric"});
function waNum(n){ let d=String(n||"").replace(/\D/g,""); if(d.startsWith("00")) d=d.slice(2); if(/^01\d{9}$/.test(d)) d="2"+d; return d; }
const waLink=(n,text)=>"https://wa.me/"+waNum(n)+(text?"?text="+encodeURIComponent(text):"");
function plansHTML(){
  return `<div class="plans">${Object.entries(PLANS).filter(([k,p])=>!p.hidden).map(([k,p])=>{ const full=PLANS.m1.price*p.months, sv=full-p.price;
    return `<div class="plan"><b>${t("plan_"+k)}</b><div class="price">${p.price.toLocaleString()} <small>${t("egp")}</small></div>${sv>0?`<span class="pill">${t("save2",sv.toLocaleString())}</span>`:""}</div>`; }).join("")}</div>
    <div class="tip" style="margin-top:10px">🎁 ${t("standGift")}</div>`;
}
function subBanner(st,shop,always){
  if(!st||!st.ends_at||st.plan==="demo") return "";
  const d=daysLeft(st.ends_at), wa=st.whatsapp?waLink(st.whatsapp,t("waRenew")+shop.name):"";
  const btn=wa?`<a class="btn small signal" href="${esc(wa)}" target="_blank" rel="noopener">${t("contactWa")}</a>`:"";
  if(st.locked) return `<div class="subbar ended"><span>${t("subEnded")}</span>${btn}</div>`;
  if(d<=7) return `<div class="subbar soon"><span>${t("subSoon",d)}</span>${btn}</div>`;
  return always?`<div class="subbar ok"><span>${t("subOk",d,fmtDate(st.ends_at))}</span></div>`:"";
}

const fmtLeft=ms=>{ const t2=Math.max(0,Math.round(ms/1000)); return Math.floor(t2/60)+":"+String(t2%60).padStart(2,"0"); };
const ETA_CHOICES=[5,10,15,20];
// ---------- shop store (polling) ----------
function ShopStore(shop){
  const st={shop,orders:[],listeners:new Set(),timer:null,failing:false};
  st.refresh=async()=>{
    try{ const [o,s]=await Promise.all([Api.orders(shop.id), Api.shop(shop.slug)]); st.orders=o; if(s){ st.shop=s; applyShop(s); } if(st.failing){ st.failing=false; } st.listeners.forEach(f=>f()); }
    catch(e){ if(!st.failing){ st.failing=true; toast(t("netErr")); } }
  };
  st.start=(ms)=>{ st.refresh(); st.timer=setInterval(()=>{ if(document.visibilityState==="visible") st.refresh(); },ms||2500); };
  st.byStatus=s=>st.orders.filter(o=>o.status===s);
  return st;
}

// ---------- customer ----------
function Customer(root,shop,opts){
  opts=opts||{};
  const lsKey="urturn.order."+shop.slug+(opts.suffix||"");
  let orderId=ls.get(lsKey), order=null, rated=0, lastKey="", seenRing=null, timer=null;
  const setOrder=id=>{ orderId=id; ls.set(lsKey,id); };
  async function poll(){
    if(!orderId){ order=null; render(); return; }
    try{
      order=await Api.order(orderId);
      if(!order){ setOrder(null); }
      if(order&&order.status==="waiting"){ const all=await Api.orders(shop.id); const ahead=all.filter(x=>x.status==="waiting"&&x.created_at<order.created_at).length; order._ahead=ahead; }
      render();
    }catch(e){ /* keep last state */ }
  }
  function render(){
    const s=opts.store?opts.store.shop:shop;
    const state=!order?"enter":order.status;
    if(opts.onState) opts.onState(state);
    const k=[state,order&&order.num,order&&order.ring_at,order&&order.eta_at,lang,rated,s.name,s.logo,s.color,s.welcome,s.review_url].join("|");
    if(state==="waiting"&&k===lastKey){ const el=root.querySelector("[data-ahead]"); if(el) el.textContent=t("ahead",order._ahead||0); return; }
    if(k===lastKey) return; lastKey=k;
    const head=`<div class="cust-head">${logoHTML(s)}<h2>${esc(s.name)}</h2></div>`;
    const foot=`<div class="powered">${t("powered")} <a href="${esc(BASE)}" target="_blank" rel="noopener">UR TURN</a> · <button class="link-btn" data-a="lang" type="button" style="font-size:12px;padding:0">${lang==="ar"?"English":"العربية"}</button></div>`;
    let body="";
    if(state==="enter"){
      Ring.stop();
      body=`<div class="cust-body"><p>${esc(s.welcome||t("welcome"))}</p>
        <form data-f="enter" style="display:grid;gap:12px"><label for="r-${esc(lsKey)}" style="font-weight:600">${t("receiptLabel")}</label>
        <input class="big-input" id="r-${esc(lsKey)}" inputmode="numeric" pattern="[0-9]*" autocomplete="off" maxlength="8" placeholder="${t("receiptPh")}" required>
        <button class="btn shop" type="submit">${t("waitBtn")}</button></form></div>`;
    } else if(state==="waiting"){
      Ring.stop();
      body=`<div class="cust-body"><div class="wait-card"><small>${t("receiptLabel")}</small><div class="num">${esc(order.num)}</div>
        <b>${t("waitingTitle")}</b>${order.eta_at?`<div class="eta"><small>${t("etaLabel")}</small><b class="num" data-eta="${esc(order.eta_at)}">${fmtLeft(new Date(order.eta_at)-Date.now())}</b></div>`:""}<span data-ahead>${t("ahead",order._ahead||0)}</span><div class="wait-anim" aria-hidden="true"><span></span><span></span><span></span></div></div>
        <p>${t("waitingP")}</p><div class="tip">${t("tipSound")}</div>
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
    root.innerHTML=`<div class="cust">${head}${body}${foot}</div>`;
  }
  root.addEventListener("submit",async e=>{
    e.preventDefault(); const inp=root.querySelector(".big-input"); const v=(inp.value||"").replace(/\D/g,"");
    if(!v){ toast(t("badNumber")); inp.focus(); return; }
    Ring.unlock(); keepAwake(); rated=0;
    const btn=root.querySelector("button[type=submit]"); btn.disabled=true;
    try{ const id=await rpc("urturn_create_order",{p_slug:shop.slug,p_num:v}); setOrder(id); await poll(); }
    catch(err){ toast(String(err.code||"").includes("subscription")?t("custPaused"):t("errGeneric")); btn.disabled=false; }
  });
  root.addEventListener("click",async e=>{
    const st=e.target.closest("[data-star]"); if(st){ rated=+st.dataset.star; render(); if(orderId) rpc("urturn_rate",{p_id:orderId,p_rating:rated}).catch(()=>{}); return; }
    const a=e.target.closest("[data-a]"); if(!a) return;
    if(a.dataset.a==="lang"){ setLang(lang==="ar"?"en":"ar"); return; }
    if(a.dataset.a==="cancel"){ const id=orderId; setOrder(null); order=null; render(); rpc("urturn_cancel_order",{p_id:id}).catch(()=>{}); }
    if(a.dataset.a==="got"){ Ring.stop(); try{ await rpc("urturn_picked_up",{p_id:orderId}); }catch(err){} await poll(); }
    if(a.dataset.a==="new"){ setOrder(null); order=null; rated=0; render(); }
  });
  setInterval(()=>{ const el=root.querySelector("[data-eta]"); if(!el) return; const left=new Date(el.dataset.eta)-Date.now(); el.textContent=left>0?fmtLeft(left):t("etaSoon"); el.classList.toggle("soon",left<=0); },1000);
  poll(); timer=setInterval(()=>{ if(orderId&&(!order||order.status!=="done")) poll(); },2500);
  return {render(){ lastKey=""; render(); }, poll,
    reset(){ const id=orderId; Ring.stop(); setOrder(null); order=null; rated=0; lastKey=""; render(); if(id) rpc("urturn_cancel_order",{p_id:id}).catch(()=>{}); }};
}

// ---------- cashier ----------
function Cashier(root,store,key){
  root.innerHTML=`<div class="panel">
    <div class="panel-head"><h2>${t("cashierTitle")}</h2></div>
    <div class="stats"><div class="stat"><b data-s="w">0</b><span>${t("stWaiting")}</span></div><div class="stat"><b data-s="r">0</b><span>${t("stReady")}</span></div><div class="stat"><b data-s="d">0</b><span>${t("stDone")}</span></div></div>
    <div class="col-title">${t("colWaiting")} <span class="count" data-c="w">0</span></div><div class="orders" data-l="w"></div>
    <div class="col-title">${t("colReady")} <span class="count" data-c="r">0</span></div><div class="orders" data-l="r"></div>
    <form class="add-row" data-f="add" style="margin-top:18px"><input id="cash-add" inputmode="numeric" autocomplete="off" maxlength="8" placeholder="${t("addPh")}" aria-label="${t("addPh")}"><button class="btn" type="submit">${t("addBtn")}</button></form>
  </div>`;
  const slug=store.shop.slug;
  function row(o){
    if(o.status==="waiting") return `<div class="order"><div class="num">${esc(o.num)}</div>
      <div class="meta"><span class="pill">${t("colWaiting")}</span><span>${t("since",mins(o.created_at))} · ${o.source==="customer"?t("fromCustomer"):t("fromCashier")}</span>
        <div class="eta-pick"><span>${t("etaSet")}</span>${ETA_CHOICES.map(m=>`<button type="button" class="${o._eta===m?"on":""}" data-a="eta" data-m="${m}" data-id="${o.id}">${m}</button>`).join("")}<span class="mu">${t("minShort")}</span>${o.eta_at&&new Date(o.eta_at)>Date.now()?`<span class="left" data-left="${esc(o.eta_at)}">${t("etaLeft",fmtLeft(new Date(o.eta_at)-Date.now()))}</span>`:""}</div></div>
      <div class="acts"><button class="btn small ghost" data-a="delete" data-id="${o.id}" type="button">${t("remove")}</button><button class="btn ready-btn" data-a="ready" data-id="${o.id}" type="button">${t("readyBtn")}</button></div></div>`;
    return `<div class="order ready"><div class="num">${esc(o.num)}</div><div class="meta"><span class="pill">${t("readyFor",mins(o.ready_at||o.created_at))}</span></div>
      <div class="acts"><button class="btn small" data-a="ring" data-id="${o.id}" type="button">${t("ringAgain")}</button><button class="btn small ok" data-a="done" data-id="${o.id}" type="button">${t("delivered")}</button></div></div>`;
  }
  function render(){
    const w=store.byStatus("waiting"), r=store.byStatus("ready").sort((a,b)=>String(a.ready_at).localeCompare(String(b.ready_at)));
    const today=new Date(); today.setHours(0,0,0,0);
    const d=store.byStatus("done").filter(o=>new Date(o.done_at||0)>=today).length;
    root.querySelector('[data-s="w"]').textContent=w.length; root.querySelector('[data-s="r"]').textContent=r.length; root.querySelector('[data-s="d"]').textContent=d;
    root.querySelector('[data-c="w"]').textContent=w.length; root.querySelector('[data-c="r"]').textContent=r.length;
    root.querySelector('[data-l="w"]').innerHTML=w.length?w.map(row).join(""):`<div class="empty">${t("emptyWaiting")}</div>`;
    root.querySelector('[data-l="r"]').innerHTML=r.length?r.map(row).join(""):`<div class="empty">${t("emptyReady")}</div>`;
  }
  root.addEventListener("submit",async e=>{
    e.preventDefault(); const inp=root.querySelector("#cash-add"); const v=(inp.value||"").replace(/\D/g,""); if(!v) return; inp.value="";
    try{ await rpc("urturn_staff_add",{p_slug:slug,p_key:key,p_num:v}); store.refresh(); }catch(err){ toast(t("errGeneric")); }
  });
  root.addEventListener("click",async e=>{
    const a=e.target.closest("[data-a]"); if(!a||!a.dataset.id) return;
    const o=store.orders.find(x=>x.id===a.dataset.id);
    if(a.dataset.a==="eta"){ const m=+a.dataset.m; if(o){ o.eta_at=new Date(Date.now()+m*60000).toISOString(); o._eta=m; render(); }
      try{ await rpc("urturn_staff_eta",{p_slug:slug,p_key:key,p_id:a.dataset.id,p_minutes:m}); }catch(err){ toast(t("errGeneric")); } return; }
    if(o){ // optimistic
      if(a.dataset.a==="ready"){ o.status="ready"; o.ready_at=o.ring_at=new Date().toISOString(); }
      if(a.dataset.a==="done"){ o.status="done"; o.done_at=new Date().toISOString(); }
      if(a.dataset.a==="delete"){ store.orders=store.orders.filter(x=>x!==o); }
      render();
    }
    try{ await rpc("urturn_staff_set",{p_slug:slug,p_key:key,p_id:a.dataset.id,p_action:a.dataset.a}); }catch(err){ toast(t("errGeneric")); }
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
      <div class="panel"><div class="panel-head"><h2>${t("ownerTitle")}</h2></div>
        <div class="list" style="display:grid;gap:10px">
          <div><small style="color:var(--muted)">${t("fName")}</small><div style="font-weight:600">${esc(shop.name)}</div></div>
          <div><small style="color:var(--muted)">${t("fReview")}</small><div dir="ltr" style="word-break:break-all">${shop.review_url?`<a href="${esc(shop.review_url)}" target="_blank" rel="noopener">${esc(shop.review_url)}</a>`:"–"}</div></div>
          <div class="tip">${t("contactToEdit")}</div>
        </div></div>
    </div>
    <div style="display:grid;gap:16px;align-content:start">
      <div class="panel"><div class="panel-head"><h2>${t("offersTitle")}</h2></div>${plansHTML()}</div>
      <div><div class="label">${t("posterTitle")}</div><div class="poster" data-poster></div><button class="btn small" type="button" data-printposter style="margin-top:10px;width:100%">${t("printPoster")}</button></div>
      <div class="panel links"><label>${t("custLink")}</label><div class="copy-row"><input id="lk0" readonly value="${esc(custURL(slug))}"><button class="btn small" type="button" data-copy="lk0">${t("copy")}</button></div></div>
    </div></div>`;
  copyBtn(root.querySelector("[data-copy]"),root.querySelector("#lk0"));
  const p=root.querySelector("[data-poster]");
  p.innerHTML=`${logoHTML(shop,`style="color:${esc(shop.color)}"`)}<h3>${t("posterH")}</h3><div class="qr">${qrSVG(custURL(slug))}</div><p>${t("posterP")}</p><b>${esc(shop.name)}</b><span class="ur">UR TURN</span>`;
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
}

// ---------- admin ----------
function Admin(root,akey){
  const COLORS=["#0E5E5A","#7A2E1F","#1E3A8A","#3F3A33","#8A1C4A","#2F6B2A","#B45309","#14181C"];
  const blank=()=>({slug:"",name:"",color:"#0E5E5A",logo:null,review_url:"",welcome:""});
  let mode="new", draft=blank();
  const inputCss="border:1px solid var(--line);border-radius:12px;padding:10px 12px;background:var(--bg);width:100%";
  root.innerHTML=`<div class="wrap owner">
    <div style="display:grid;gap:16px;min-width:0">
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
    p.innerHTML=`${logoHTML({...draft,name},`style="color:${esc(draft.color)}"`)}<h3>${t("posterH")}</h3><div class="qr">${qrSVG(custURL(curSlug()))}</div><p>${t("posterP")}</p><b>${esc(name)}</b><span class="ur">UR TURN</span>`;
    $r("[data-logo]").innerHTML=logoHTML({...draft,name},`style="color:${esc(draft.color)}"`);
    const sp=$r("[data-slugprev]"); if(sp) sp.textContent=custURL(curSlug());
    const cb=$r("[data-custbox]"); cb.hidden=!(mode==="edit"); $r("#a-cust").value=custURL(curSlug());
  }
  function fill(){
    $r("[data-title]").textContent= mode==="edit"? t("editShop")+": "+draft.name : t("newShop");
    $r("[data-a=new]").hidden= mode!=="edit";
    $r("[data-slugf]").hidden= mode==="edit"; $r("#a-slug").required= mode!=="edit";
    $r("[data-submit]").textContent= mode==="edit"? t("save") : t("create");
    $r("#a-name").value=draft.name||""; $r("#a-slug").value=mode==="edit"?draft.slug:""; $r("#a-review").value=draft.review_url||""; $r("#a-welcome").value=draft.welcome||"";
    swatches(); poster();
  }
  function read(){ draft.name=$r("#a-name").value.trim(); draft.review_url=$r("#a-review").value.trim(); draft.welcome=$r("#a-welcome").value.trim(); }
  function showLinks(slug,k){
    const box=$r("[data-result]");
    box.innerHTML=`<div class="tip" style="margin-top:14px">${t("created")}</div><div class="links" style="margin-top:12px">
      ${[["custLink",custURL(slug)],["cashLink",cashURL(slug,k)],["ownLink",ownURL(slug,k)]].map(([l,u],i)=>`<div><label>${t(l)}</label><div class="copy-row"><input id="al${i}" readonly value="${esc(u)}"><button class="btn small" type="button" data-copy2="al${i}">${t("copy")}</button></div></div>`).join("")}</div>`;
    box.querySelectorAll("[data-copy2]").forEach(b=>copyBtn(b,box.querySelector("#"+b.dataset.copy2)));
    box.scrollIntoView({behavior:"smooth",block:"center"});
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
      $r("[data-rows]").innerHTML=rows.map(r=>`<tr${r.active?"":' style="opacity:.55"'}><td>${esc(r.name)}</td><td dir="ltr"><a href="${esc(custURL(r.slug))}" target="_blank" rel="noopener">${esc(r.slug)}</a></td><td>${subCell(r)}</td><td>${r.orders_7d}</td><td>${r.avg_rating??"–"}</td>
        <td><div style="display:flex;gap:6px;flex-wrap:wrap">${r.slug===DEMO_SLUG?"":`<button class="btn small primary" data-sub="${esc(r.slug)}" type="button">${t("renew")}</button>`}<button class="btn small" data-edit="${esc(r.slug)}" type="button">${t("edit")}</button><button class="btn small ghost" data-reset="${esc(r.slug)}" type="button">${t("newKey")}</button>${r.slug===DEMO_SLUG?"":`<button class="btn small ghost" data-arch="${esc(r.slug)}" data-on="${r.active?0:1}" type="button">${r.active?t("archive"):t("restore")}</button>`}</div></td></tr>`).join("");
      const al=rows.filter(r=>r.active&&r.ends_at&&r.plan!=="demo"&&daysLeft(r.ends_at)<=3);
      $r("[data-alerts]").innerHTML=al.length?`<div class="orders">${al.map(r=>`<div class="order${daysLeft(r.ends_at)<=0?" late":""}"><div style="font-weight:600">${esc(r.name)}</div><div class="meta">${subCell(r)}</div><div class="acts">${waBtn(r)}<button class="btn small primary" data-sub="${esc(r.slug)}" type="button">${t("renew")}</button></div></div>`).join("")}</div>`:`<div class="empty">${t("noAlerts")}</div>`;
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
        draft.slug=slug; mode="edit"; fill(); showLinks(slug,k);
        await load(); openSub(slug); return;
      } else {
        await rpc("urturn_admin_save_shop",{...args,p_slug:draft.slug});
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
    if(ed){ const s=await loadShop(ed.dataset.edit); if(s){ draft={...s}; mode="edit"; $r("[data-result]").innerHTML=""; fill(); root.scrollIntoView({behavior:"smooth"}); } return; }
    const b=e.target.closest("[data-reset]"); if(!b) return;
    try{ const k=await rpc("urturn_admin_reset_key",{p_admin:akey,p_slug:b.dataset.reset}); const s=await loadShop(b.dataset.reset); if(s){ draft={...s}; mode="edit"; fill(); } showLinks(b.dataset.reset,k); }catch(err){ toast(t("errGeneric")); }
  });
  fill(); load();
}

// ---------- pages ----------
const app=$("#app");
function topbar(active){
  $("#topbar").hidden=false;
  $("#tabs").innerHTML=[["./","tabHome","home"],["?v=demo","tabDemo","demo"]].map(([h,k,v])=>`<a href="${h}" ${v===active?'aria-current="page"':""}>${t(k)}</a>`).join("");
}
function staffHead(shop,active,key){
  return `<div class="staff-head"><div class="wrap" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;width:100%">
    ${logoHTML(shop)}<b>${esc(shop.name)}</b>
    <nav class="tabs"><a href="${esc(cashURL(shop.slug,key))}" ${active==="cashier"?'aria-current="page"':""}>${t("navCashier")}</a><a href="${esc(ownURL(shop.slug,key))}" ${active==="owner"?'aria-current="page"':""}>${t("navOwner")}</a></nav>
    <button class="btn lang" type="button" data-lang>${lang==="ar"?"English":"العربية"}</button></div></div>`;
}
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
async function loadShop(slug){ try{ return await Api.shop(slug); }catch(e){ return undefined; } }
function msg(text){ app.innerHTML=`<div class="center-msg"><img src="icon.svg" width="56" height="56" alt="" style="margin:0 auto"><h2>${esc(text)}</h2></div>`; }

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
async function customerPage(){
  const shop=await loadShop(SLUG);
  if(shop===undefined){ msg(t("netErr")); setTimeout(customerPage,4000); return; }
  if(!shop||!shop.active){ msg(t("noShop")); return; }
  applyShop(shop); document.title=shop.name+" · UR TURN";
  try{ const ps=await rpc("urturn_public_status",{p_slug:SLUG}); if(ps&&ps.locked){ msg(t("custPaused")); return; } }catch(e){}
  app.innerHTML=`<div class="cust-full" id="fullCust"></div>`;
  Customer($("#fullCust"),shop,{});
}
async function staffPage(kind){
  const shop=await loadShop(SLUG);
  if(shop===undefined){ msg(t("netErr")); return; }
  let ok=false; try{ ok=shop && await rpc("urturn_staff_check",{p_slug:SLUG,p_key:KEY}); }catch(e){}
  if(!ok||!shop.active){ msg(t("badLink")); return; }
  applyShop(shop); document.title=shop.name+" · UR TURN";
  const store=ShopStore(shop);
  let st=null; try{ st=await rpc("urturn_staff_status",{p_slug:SLUG,p_key:KEY}); }catch(e){}
  app.innerHTML=staffHead(shop,kind,KEY)+`<div class="wrap" style="padding-top:14px">${subBanner(st,shop,kind==="owner")}</div><div id="staff"></div>`;
  setInterval(async()=>{ try{ const n=await rpc("urturn_staff_status",{p_slug:SLUG,p_key:KEY}); if(n&&st&&(n.locked!==st.locked||n.ends_at!==st.ends_at)) location.reload(); }catch(e){} },5*60000);
  app.querySelector("[data-lang]").addEventListener("click",()=>setLang(lang==="ar"?"en":"ar"));
  if(kind==="cashier"&&st&&st.locked){ return; }
  if(kind==="cashier"){ $("#staff").className="wrap"; $("#staff").style.cssText="padding-block:20px;max-width:760px"; $("#staff").innerHTML=`<div id="cash"></div>`; Cashier($("#cash"),store,KEY); store.start(2000); keepAwake(); }
  else { Owner($("#staff"),store,KEY); store.start(10000); }
}
function setLang(l){ lang=l; ls.set("urturn.lang",l); location.reload(); }

document.documentElement.lang=lang; document.documentElement.dir=lang==="ar"?"rtl":"ltr";
$("#langBtn").textContent=lang==="ar"?"English":"العربية";
$("#langBtn").addEventListener("click",()=>setLang(lang==="ar"?"en":"ar"));
if(VIEW==="home") homePage();
else if(VIEW==="demo") demoPage();
else if(VIEW==="admin"){ topbar(""); $("#tabs").innerHTML=`<span class="admin-tag">${t("adminTitle")}</span>`; document.title="Admin · UR TURN"; Admin(app,KEY); }
else if(VIEW==="cashier"||VIEW==="owner") staffPage(VIEW);
else customerPage();
})();
