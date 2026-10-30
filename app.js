(function(){
"use strict";
// ---------- config ----------
const SUPA_URL = "https://hlbccdgdsbgfuxppqiuc.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsYmNjZGdkc2JnZnV4cHBxaXVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMDQ5NjYsImV4cCI6MjEwODg4MDk2Nn0.5I4DTGNYoLC-43-6qJYgYdES-5S0FqwzkeV7q34Fzxw";
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
 trialTitle:"أسبوع تجربة مجاني",etaLabel:"الوقت المتوقع لطلبك",etaSoon:"قرّب يجهز، خليك قريب ⏳",etaSet:"وقت التحضير:",scanBtn:"امسح كود المحل",myShops:"🏠 محلاتي",installBtn:"📲 ثبّت UR TURN على جوالك (مرة وحدة لكل الكافيهات)",scanOther:"📷 امسح كود محل تاني",scanHint:"وجّه الكاميرا على كود الـ QR اللي عالكاونتر",camErr:"ما قدرنا نفتح الكاميرا. اسمح للكاميرا من إعدادات الجوال.",closeBtn:"إغلاق",badQR:"هاد مش كود UR TURN",appP:"بأي كافيه بيستعمل UR TURN: امسح الكود من هون، وبيوصلك تنبيه لما يجهز طلبك حتى لو الجوال مقفول 🔔",recentT:"محلاتي",activeOrder:"⏳ طلبك هون",autoReset:(a,b)=>`🔄 العداد بيتصفّر لحاله الساعة ${a} (بعد ${b})`,hShort:"س",mShort:"د",fHours:"ساعات العمل (الشفت)",fOpen:"بيفتح",fClose:"بيسكّر",hoursHint:"برّا هالوقت الزبون ما بيقدر يسجّل طلب. فاضي = 24 ساعة. العداد اليومي بيبدأ من وقت الفتح.",closedTitle:"المحل مسكّر هلق 🌙",closedP:(a,b)=>`بنستقبل الطلبات من ${a} لـ ${b}. نشوفك قريب!`,shopClosedNow:"خارج ساعات العمل",etaSent:"✓ انبعتت، الزبون لسا ما شافها",etaSeen:"✓✓ الزبون شافها",minShort:"د",etaLeft:x=>`باقي ${x}`,trialQr:"امسح الكود وكلّمنا واتساب 👇",trialWaMsg:"مرحبا، شفت UR TURN وبدي أجرّبه أسبوع ببلاش بمحلي.",trialWaBtn:"تواصل معنا واتساب",trialP:"التركيب بياخذ 5 دقايق. المحل بيجرّب النظام أسبوع كامل ببلاش، وبعدين بنحدد السعر سوا حسب النتيجة.",
 demoHint:"اكتب رقم فاتورة بجوال الزبون، بعدين اضغط «جاهز» من شاشة الكاشير. وجرّب كمان تفتح صفحة الزبون من جوال ثاني.",
 customerPhone:"جوال الزبون",
 welcome:"أهلاً فيك! اكتب رقم الفاتورة وخلّيك مرتاح، رح نبلغك لما يجهز طلبك.",
 receiptLabel:"رقم الفاتورة",receiptPh:"مثلاً 128",waitBtn:"انتظر دوري",
 waitingTitle:"طلبك قيد التحضير",waitingP:"خلّي هالصفحة مفتوحة. رح يرن جوالك ويهتز لما يجهز الطلب.",
 ahead:(n)=> n===0?"طلبك هو التالي":(n===1?"قبلك طلب واحد":"قبلك "+n+" طلبات"),
 tipSound:"خلّي صوت الجوال شغّال والشاشة مفتوحة.",nowLbl:"الآن",sndOn:"🔔 اضغط هون لتفعيل صوت الطلبات الجديدة",newOrderT:n=>"طلب جديد "+n,iosNote:"🔔 <b>عشان جوالك يرن حتى لو مقفول:</b> اضغط زر المشاركة <b>⬆️</b> تحت، وبعدين <b>«إضافة إلى الشاشة الرئيسية»</b>، وافتح من الأيقونة.",iosArrow:"زر المشاركة هون",iosTip:"📲 <b>نصيحة لأصحاب الآيفون:</b> اضغط زر المشاركة <b>⬆️</b> ثم <b>«إضافة إلى الشاشة الرئيسية»</b>، وافتح الصفحة من أيقونتها. هيك بيوصلك تنبيه لما يجهز طلبك حتى لو الجوال مقفول 🔔، ونفس الأيقونة بتشتغل بكل الكافيهات.",pushOn:"✅ رح يوصلك إشعار لما يجهز طلبك، حتى لو سكّرت الشاشة.",pushAsk:"🔔 فعّل الإشعارات عشان يوصلك تنبيه حتى لو الشاشة مطفية",cancel:"إلغاء ورقم مختلف",
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
 statsTitle:"آخر 7 أيام",ledgerTitle:"📒 الجرد اليومي",ledgerHint:"كل يوم شغل لحاله، من وقت الفتح لوقت الفتح اللي بعده. آخر 30 يوم.",lDay:"اليوم",lOrders:"الطلبات",lDone:"اتسلّم",lWait:"متوسط الانتظار",lRating:"التقييم",lPeak:"أزحم ساعة",lToday:"اليوم",lCsv:"⬇️ تنزيل Excel",lEmpty:"لسا ما في طلبات",lTotal:"المجموع",sOrders:"طلب",sWait:"متوسط الانتظار (د)",sRating:"متوسط التقييم",sRatings:"تقييم",
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
 trialTitle:"Free first week",etaLabel:"Estimated time",etaSoon:"Almost ready, stay close ⏳",etaSet:"Prep time:",scanBtn:"Scan the shop code",myShops:"🏠 My shops",installBtn:"📲 Install UR TURN on your phone (once, for every café)",scanOther:"📷 Scan another shop's code",scanHint:"Point the camera at the QR code on the counter",camErr:"Couldn't open the camera. Allow camera access in your phone settings.",closeBtn:"Close",badQR:"That's not a UR TURN code",appP:"At any café using UR TURN: scan the code from here and get alerted when your order is ready, even with your phone locked 🔔",recentT:"My shops",activeOrder:"⏳ Your order",autoReset:(a,b)=>`🔄 Counter resets automatically at ${a} (in ${b})`,hShort:"h",mShort:"m",fHours:"Working hours (shift)",fOpen:"Opens",fClose:"Closes",hoursHint:"Outside these hours customers can't place orders. Empty = 24h. The daily counter starts at opening time.",closedTitle:"We're closed right now 🌙",closedP:(a,b)=>`We take orders from ${a} to ${b}. See you soon!`,shopClosedNow:"Outside working hours",etaSent:"✓ Sent, not seen yet",etaSeen:"✓✓ Seen by customer",minShort:"min",etaLeft:x=>`${x} left`,trialQr:"Scan to message us on WhatsApp 👇",trialWaMsg:"Hi, I saw UR TURN and would like the free 1-week trial for my shop.",trialWaBtn:"Message us on WhatsApp",trialP:"Setup takes 5 minutes. The shop tries it free for a full week, then we agree on a price together.",
 demoHint:"Enter a receipt number on the customer phone, then tap “Ready” on the cashier screen. Also try opening the customer page on another phone.",
 customerPhone:"Customer phone",
 welcome:"Welcome! Enter your receipt number and relax. We'll alert you when your order is ready.",
 receiptLabel:"Receipt number",receiptPh:"e.g. 128",waitBtn:"Wait for my turn",
 waitingTitle:"Your order is being prepared",waitingP:"Keep this page open. Your phone will ring and vibrate when it's ready.",
 ahead:(n)=> n===0?"You're next":(n===1?"1 order ahead of you":n+" orders ahead of you"),
 tipSound:"Keep your sound on and the screen open.",nowLbl:"now",sndOn:"🔔 Tap here to turn on new-order sound",newOrderT:n=>"New order "+n,iosNote:"🔔 <b>Get alerted even with your phone locked:</b> tap Share <b>⬆️</b> below, then <b>“Add to Home Screen”</b>, and open from the icon.",iosArrow:"Share button here",iosTip:"📲 <b>iPhone tip:</b> tap Share <b>⬆️</b> then <b>“Add to Home Screen”</b> and open the page from its icon. You'll get an alert when your order is ready, even with your phone locked 🔔. The same icon works at every café.",pushOn:"✅ You'll get a notification when it's ready, even with the screen off.",pushAsk:"🔔 Turn on notifications to get alerted even with the screen off",cancel:"Cancel / different number",
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
 statsTitle:"Last 7 days",ledgerTitle:"📒 Daily ledger",ledgerHint:"Each working day on its own, from opening time to the next opening. Last 30 days.",lDay:"Day",lOrders:"Orders",lDone:"Served",lWait:"Avg wait",lRating:"Rating",lPeak:"Busiest hour",lToday:"Today",lCsv:"⬇️ Download Excel",lEmpty:"No orders yet",lTotal:"Total",sOrders:"orders",sWait:"avg wait (min)",sRating:"avg rating",sRatings:"ratings",
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
  if(!r.ok){ if(r.status>=500) reportErr("server "+r.status+" "+path.split("?")[0]); throw new Error("http_"+r.status); }
  return r.json();
}
async function rpc(name,args){
  const r=await fetch(SUPA_URL+"/rest/v1/rpc/"+name,{method:"POST",headers:H,body:JSON.stringify(args||{})});
  const txt=await r.text(); let data=null; try{ data=txt?JSON.parse(txt):null; }catch(e){ data=txt; }
  if(r.status>=500) reportErr("server "+r.status+" "+name);
  if(!r.ok){ const err=new Error((data&&data.message)||("http_"+r.status)); err.code=(data&&data.message)||""; throw err; }
  return data;
}
let errSent=0; const errSeen=new Set();
function reportErr(msg){ try{ msg=String(msg||"").slice(0,300); if(!msg||errSeen.has(msg)||errSent>=5) return; errSeen.add(msg); errSent++;
  fetch(SUPA_URL+"/rest/v1/rpc/urturn_log_error",{method:"POST",headers:H,keepalive:true,body:JSON.stringify({p_slug:SLUG,p_view:VIEW,p_msg:msg,p_ua:navigator.userAgent})}).catch(()=>{}); }catch(e){} }
window.addEventListener("error",e=>{ const f=e.filename||""; if(!f||!f.includes(location.host)) return; reportErr((e.message||"error")+" @"+f.split("/").pop()+":"+(e.lineno||0)); });
window.addEventListener("unhandledrejection",e=>{ const r=e.reason; reportErr("promise: "+((r&&r.message)||String(r))); });
const Api={
  shop:slug=>rest("urturn_shops?select=*&slug=eq."+encodeURIComponent(slug)).then(r=>r[0]||null),
  orders:(shopId,since)=>rest("urturn_orders?select=*&shop_id=eq."+shopId+"&created_at=gte."+encodeURIComponent(new Date(Math.min(Date.now()-12*3600e3,since||new Date().setHours(0,0,0,0))).toISOString())+"&order=created_at.asc"),
  order:id=>rest("urturn_orders?select=id,num,status,created_at,ring_at,eta_at,eta_seen,done_at&id=eq."+id).then(r=>r[0]||null),
  active:(shopId,since)=>rest("urturn_orders?select=*&shop_id=eq."+shopId+"&status=in.(waiting,ready)&created_at=gte."+encodeURIComponent(new Date(Math.min(Date.now()-12*3600e3,since)).toISOString())+"&order=created_at.asc"),
  ahead:(shopId,before)=>rest("urturn_orders?select=id&shop_id=eq."+shopId+"&status=eq.waiting&created_at=lt."+encodeURIComponent(before)+"&created_at=gte."+encodeURIComponent(new Date(Date.now()-12*3600e3).toISOString())),
  doneCount:(shopId,since)=>fetch(SUPA_URL+"/rest/v1/urturn_orders?select=id&limit=1&shop_id=eq."+shopId+"&status=eq.done&done_at=gte."+encodeURIComponent(new Date(since).toISOString()),{headers:{...H,"Prefer":"count=exact"},cache:"no-store"}).then(r=>{ if(!r.ok) throw new Error("http_"+r.status); const m=(r.headers.get("content-range")||"").split("/")[1]; return m&&m!=="*"?+m:null; }),
  shopLite:slug=>rest("urturn_shops?select=id,slug,name,color,review_url,welcome,active,open_at,close_at&slug=eq."+encodeURIComponent(slug)).then(r=>r[0]||null),
  month:shopId=>rest("urturn_orders?select=status,created_at,done_at,ready_at,rating&shop_id=eq."+shopId+"&created_at=gte."+encodeURIComponent(new Date(Date.now()-31*864e5).toISOString())+"&order=created_at.desc"),
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
function syncManifest(hasOrder){ try{ if(!isIOS||isStandalone()) return;
  if(!hasOrder){ const l0=document.querySelector('link[rel="manifest"]'); if(l0) l0.remove(); return; } const abs=u=>new URL(u,location.href).href;
  const m={name:"UR TURN",short_name:"UR TURN",display:"standalone",background_color:"#14181C",theme_color:"#14181C",scope:abs("./"),id:abs("./?v=app"),start_url:location.href,
    icons:[{src:abs("icon-192.png"),sizes:"192x192",type:"image/png"},{src:abs("icon-512.png"),sizes:"512x512",type:"image/png"}]};
  let l=document.querySelector('link[rel="manifest"]'); if(!l){ l=document.createElement("link"); l.rel="manifest"; document.head.appendChild(l); }
  l.href="data:application/manifest+json,"+encodeURIComponent(JSON.stringify(m)); }catch(e){} }
const cashURL=(slug,k)=>BASE+"?s="+encodeURIComponent(slug)+"&v=cashier&k="+encodeURIComponent(k);
const ownURL=(slug,k)=>BASE+"?s="+encodeURIComponent(slug)+"&v=owner&k="+encodeURIComponent(k);
function googleG(){ return `<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>`; }

// ---------- sound + vibration ----------
const Ring={ ctx:null,timer:null,on:false,
  unlock(){ try{ if(!this.ctx){ const C=window.AudioContext||window.webkitAudioContext; if(C) this.ctx=new C(); } this.ctx&&this.ctx.resume&&this.ctx.resume(); }catch(e){} },
  chime(){ if(!this.ctx) return; const now=this.ctx.currentTime;
    [880,1175,1568,1175,1568].forEach((f,i)=>{ const o=this.ctx.createOscillator(),g=this.ctx.createGain(); o.type="sine"; o.frequency.value=f; o.connect(g); g.connect(this.ctx.destination);
      const s=now+i*0.16; g.gain.setValueAtTime(0.0001,s); g.gain.exponentialRampToValueAtTime(0.4,s+0.02); g.gain.exponentialRampToValueAtTime(0.0001,s+0.15); o.start(s); o.stop(s+0.16); }); },
  dinged:0,
  ding(){ if(!this.ctx||this.ctx.state!=="running") return false; const now=this.ctx.currentTime;
    [[1318.5,0],[1046.5,0.13],[1568,0.26]].forEach(([f,d])=>{ const o=this.ctx.createOscillator(),g=this.ctx.createGain(); o.type="sine"; o.frequency.value=f; o.connect(g); g.connect(this.ctx.destination);
      const s=now+d; g.gain.setValueAtTime(0.0001,s); g.gain.exponentialRampToValueAtTime(0.35,s+0.015); g.gain.exponentialRampToValueAtTime(0.0001,s+0.4); o.start(s); o.stop(s+0.42); });
    try{ navigator.vibrate&&navigator.vibrate([120,80,120]); }catch(e){} return true; },
  notify(){ if(this.dinged>=2||this.on) return; this.unlock();
    const go=()=>{ if(this.dinged>=2||this.on) return; if(this.ding()) this.dinged++; };
    setTimeout(()=>{ if(this.ctx&&this.ctx.state==="running") go(); else document.addEventListener("pointerdown",()=>setTimeout(go,60),{once:true,passive:true}); },1300); },
  start(){ if(this.on) return; this.on=true; this.unlock(); const tick=()=>{ this.chime(); try{ navigator.vibrate&&navigator.vibrate([350,150,350,150,600]); }catch(e){} }; tick(); this.timer=setInterval(tick,1800); },
  stop(){ if(!this.on) return; this.on=false; clearInterval(this.timer); this.timer=null; try{ navigator.vibrate&&navigator.vibrate(0); }catch(e){} }
};
let wakeLock=null;
async function keepAwake(){ try{ if(navigator.wakeLock&&(!wakeLock||wakeLock.released)) wakeLock=await navigator.wakeLock.request("screen"); }catch(e){} }
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible") keepAwake(); });
["pointerdown","touchend","keydown"].forEach(ev=>document.addEventListener(ev,()=>{ const was=Ring.ctx&&Ring.ctx.state; Ring.unlock(); if(Ring.on&&was!=="running") setTimeout(()=>Ring.chime(),80); },{passive:true}));
// ---------- push notifications (ring even when the screen is off) ----------
const VAPID_PUB="BCWk-h1YhyHgZOu5bp_pxZGM9PKLquMaw7Vd9rD9ivAY_wLHYYr1_94H-uTqylpvnDpcIucHXyuGWe7b7vYUp5w";
const PUSH_FN=SUPA_URL+"/functions/v1/urturn-push";
const isIOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
const isStandalone=()=>window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
// iPhone: on a café page, no fixed manifest, so "Add to Home Screen" keeps the exact page (with the order). Everywhere else use manifest.json.
if(!(isIOS&&VIEW==="customer")){ const ml=document.createElement("link"); ml.rel="manifest"; ml.href="manifest.json"; document.head.appendChild(ml); }
const Push={
  ok(){ return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window; },
  state(){ return this.ok()?Notification.permission:"unsupported"; },
  ask(){ try{ return this.ok()&&Notification.permission==="default"?Notification.requestPermission():Promise.resolve(this.state()); }catch(e){ return Promise.resolve("denied"); } },
  async subscribe(orderId){
    if(!this.ok()||Notification.permission!=="granted") return false;
    try{
      const reg=await navigator.serviceWorker.register("sw.js"); await navigator.serviceWorker.ready;
      const key=Uint8Array.from(atob(VAPID_PUB.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-VAPID_PUB.length%4)%4)),c=>c.charCodeAt(0));
      let sub=await reg.pushManager.getSubscription();
      if(!sub) sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key});
      const j=sub.toJSON(); await rpc("urturn_set_push",{p_id:orderId,p_sub:{endpoint:j.endpoint,keys:j.keys,lang,url:location.href.split("#")[0]}});
      return true;
    }catch(e){ return false; }
  },
  send(orderId){ try{ fetch(PUSH_FN,{method:"POST",headers:H,body:JSON.stringify({order_id:orderId}),keepalive:true}).catch(()=>{}); }catch(e){} }
};



// ---------- working hours (shop.open_at / close_at, "HH:MM:SS") ----------
const hm=v=>{ if(!v) return null; const [h,m]=String(v).split(":").map(Number); return h*60+(m||0); };
function hasHours(s){ const o=hm(s&&s.open_at),c=hm(s&&s.close_at); return o!=null&&c!=null&&o!==c; }
function isOpenNow(s){ if(!hasHours(s)) return true; const o=hm(s.open_at),c=hm(s.close_at),d=new Date(),n=d.getHours()*60+d.getMinutes(); return o<c? (n>=o&&n<c) : (n>=o||n<c); }
function dayStart(s){ const d=new Date(); d.setSeconds(0,0); const o=hasHours(s)?hm(s.open_at):0; d.setHours(Math.floor(o/60),o%60); if(d>new Date()) d.setDate(d.getDate()-1); return d; }
function fmtTime(v){ const m=hm(v); const d=new Date(); d.setHours(Math.floor(m/60),m%60,0,0); return d.toLocaleTimeString(lang==="ar"?"ar-EG":"en-GB",{hour:"numeric",minute:"2-digit",hour12:true}); }

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
  // Light polling: active orders every tick; full day list and shop info only now and then.
  let lastFull=0, lastShop=Date.now(), lastCount=0, lastLogo=Date.now();
  st.refresh=async(full)=>{
    try{
      const since=+dayStart(st.shop), now=Date.now();
      const doFull= full===true || !lastFull || now-lastFull>(st.lite?600000:60000);
      const needCount= st.lite && (doFull || now-lastCount>60000);
      const [act,all,s,dc]=await Promise.all([
        doFull?null:Api.active(shop.id,since),
        doFull?Api.orders(shop.id,since):null,
        now-lastShop>30000?(now-lastLogo>300000?(lastLogo=now,Api.shop(shop.slug)):Api.shopLite(shop.slug)):null,
        needCount?Api.doneCount(shop.id,since).catch(()=>null):null]);
      if(needCount){ lastCount=now; if(dc!=null) st.doneCount=dc; }
      if(doFull){ st.orders=all; lastFull=now; st.loaded=true; }
      else {
        const ids=new Set(act.map(o=>o.id));
        const gone=st.orders.some(o=>(o.status==="waiting"||o.status==="ready")&&!ids.has(o.id)&&!o._local);
        if(gone){ lastFull=0; return st.refresh(true); }
        st.orders=[...st.orders.filter(o=>o.status==="done"&&!ids.has(o.id)), ...act].sort((a,b)=>String(a.created_at).localeCompare(String(b.created_at)));
      }
      if(s){ lastShop=now; st.shop={...st.shop,...s}; applyShop(st.shop); }
      if(st.failing){ st.failing=false; } st.listeners.forEach(f=>f());
    }catch(e){ if(!st.failing){ st.failing=true; toast(t("netErr")); } }
  };
  st.start=(ms)=>{ st.refresh(); st.timer=setInterval(()=>{ if(document.visibilityState==="visible") st.refresh(); },ms||2500); };
  st.byStatus=s=>st.orders.filter(o=>o.status===s);
  return st;
}

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
        <button class="btn shop" type="submit">${t("waitBtn")}</button></form>${!opts.inFrame&&isIOS&&!isStandalone()&&!ls.get("urturn.iosTipOff")?`<div class="ios-note" role="alert"><button type="button" class="ios-x" data-a="iosx" aria-label="x">✕</button><img src="icon-192.png" alt="" class="ios-ic"><div class="ios-body"><div class="ios-top"><b>UR TURN</b><span>${t("nowLbl")}</span></div><div class="ios-msg">${t("iosNote")}</div></div></div><div class="ios-arrow" aria-hidden="true">${t("iosArrow")}<span>⬇</span></div>`:""}</div>`;
    } else if(state==="waiting"){
      Ring.stop();
      body=`<div class="cust-body"><div class="wait-card"><small>${t("receiptLabel")}</small><div class="num">${esc(order.num)}</div>
        <b>${t("waitingTitle")}</b>${order.eta_at?`<div class="eta"><small>${t("etaLabel")}</small><b class="num" data-eta="${esc(order.eta_at)}">${fmtLeft(new Date(order.eta_at)-Date.now())}</b></div>`:""}<span data-ahead>${t("ahead",order._ahead||0)}</span><div class="wait-anim" aria-hidden="true"><span></span><span></span><span></span></div></div>
        <p>${t("waitingP")}</p><div class="tip">${t("tipSound")}</div>${opts.inFrame?"":pushOk?`<div class="tip">${t("pushOn")}</div>`:Push.state()==="default"?`<button class="btn small" data-a="push" type="button">${t("pushAsk")}</button>`:isIOS&&!isStandalone()&&!ls.get("urturn.iosTipOff")?`<div class="ios-note" role="alert"><button type="button" class="ios-x" data-a="iosx" aria-label="x">✕</button><img src="icon-192.png" alt="" class="ios-ic"><div class="ios-body"><div class="ios-top"><b>UR TURN</b><span>${t("nowLbl")}</span></div><div class="ios-msg">${t("iosNote")}</div></div></div><div class="ios-arrow" aria-hidden="true">${t("iosArrow")}<span>⬇</span></div>`:""}
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
    const scanBar=!opts.inFrame&&(isStandalone()||!isIOS)&&(state==="enter"||state==="done")?`<div class="scan-bar"><button class="btn small" type="button" data-a="scan">${t("scanOther")}</button>${recentShops().length>1||isStandalone()?`<a class="btn small" href="${esc(BASE)}?v=app">${t("myShops")}</a>`:""}${isStandalone()?"":`<button class="btn small" type="button" data-a="install" data-install ${installEvt?"":"hidden"}>${t("installBtn")}</button>`}</div>`:"";
    root.innerHTML=`<div class="cust">${head}${body}${scanBar}${foot}</div>`;
    if(root.querySelector(".ios-note")) Ring.notify();
  }
  root.addEventListener("submit",async e=>{
    e.preventDefault(); const inp=root.querySelector(".big-input"); const v=(inp.value||"").replace(/\D/g,"");
    if(!v){ toast(t("badNumber")); inp.focus(); return; }
    Ring.unlock(); keepAwake(); rated=0; const perm=opts.inFrame?null:Push.ask();
    const btn=root.querySelector("button[type=submit]"); btn.disabled=true;
    try{ const id=await rpc("urturn_create_order",{p_slug:shop.slug,p_num:v}); setOrder(id); await poll(); if(perm) perm.then(()=>Push.subscribe(id)).then(ok=>{ pushOk=ok; lastKey=""; render(); }); }
    catch(err){ const c=String(err.code||""); toast(c.includes("subscription")?t("custPaused"):c.includes("shop_closed")?t("closedTitle"):t("errGeneric")); btn.disabled=false; lastKey=""; render(); }
  });
  root.addEventListener("click",async e=>{
    const st=e.target.closest("[data-star]"); if(st){ rated=+st.dataset.star; render(); if(orderId) rpc("urturn_rate",{p_id:orderId,p_rating:rated}).catch(()=>{}); return; }
    const a=e.target.closest("[data-a]"); if(!a) return;
    if(a.dataset.a==="lang"){ setLang(lang==="ar"?"en":"ar"); return; }
    if(a.dataset.a==="cancel"){ const id=orderId; setOrder(null); order=null; render(); rpc("urturn_cancel_order",{p_id:id}).catch(()=>{}); }
    if(a.dataset.a==="iosx"){ ls.set("urturn.iosTipOff","1"); root.querySelectorAll(".ios-note,.ios-arrow").forEach(x=>x.remove()); return; }
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
    for(const d of [0,400,900,1800]){ if(d) await new Promise(r=>setTimeout(r,d)); if(await poll()) break; }
    if(order&&order.status==="ready"){ if(!Ring.on) Ring.start(); } else Ring.stop();
    backBusy=false;
  }
  document.addEventListener("visibilitychange",onBack);
  window.addEventListener("pageshow",onBack); window.addEventListener("focus",onBack);
  try{ navigator.serviceWorker&&navigator.serviceWorker.addEventListener("message",e=>{ if(e.data&&e.data.type==="urturn-ring") onBack(); }); }catch(e){}
  if(orderId&&!opts.inFrame&&Push.state()==="granted") Push.subscribe(orderId).then(ok=>{ if(ok&&!pushOk){ pushOk=true; lastKey=""; render(); } });
  return {render(){ lastKey=""; render(); }, poll,
    reset(){ const id=orderId; Ring.stop(); setOrder(null); order=null; rated=0; lastKey=""; render(); if(id) rpc("urturn_cancel_order",{p_id:id}).catch(()=>{}); }};
}

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
  snd.onclick=()=>{ Ring.unlock(); setTimeout(()=>{ Ring.ding(); sndCheck(); },120); };
  const sndCheck=()=>{ snd.hidden=!!(Ring.ctx&&Ring.ctx.state==="running"); };
  setTimeout(sndCheck,1500); setInterval(sndCheck,5000); document.addEventListener("pointerdown",()=>setTimeout(sndCheck,200),{passive:true});
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
      $r("[data-rows]").innerHTML=rows.map(r=>`<tr${r.active?"":' style="opacity:.55"'}><td><bdi>${esc(r.name)}</bdi></td><td dir="ltr"><a href="${esc(custURL(r.slug))}" target="_blank" rel="noopener">${esc(r.slug)}</a></td><td>${subCell(r)}</td><td>${r.orders_7d}</td><td>${r.avg_rating??"–"}</td>
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
        draft.slug=slug; mode="edit"; fill(); showLinks(slug,k);
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
    if(ed){ const s=await loadShop(ed.dataset.edit); if(s){ draft={...s}; mode="edit"; $r("[data-result]").innerHTML=""; fill(); root.scrollIntoView({behavior:"smooth"}); } return; }
    const b=e.target.closest("[data-reset]"); if(!b) return;
    try{ const k=await rpc("urturn_admin_reset_key",{p_admin:akey,p_slug:b.dataset.reset}); const s=await loadShop(b.dataset.reset); if(s){ draft={...s}; mode="edit"; fill(); } showLinks(b.dataset.reset,k); }catch(err){ toast(t("errGeneric")); }
  });
  fill(); load(); loadHealth();
  root.querySelector("[data-hrefresh]").addEventListener("click",loadHealth);
  setInterval(()=>{ if(document.visibilityState==="visible") loadHealth(); },120000);
}

// ---------- pages ----------
const app=$("#app");
function topbar(active){
  $("#topbar").hidden=false;
  $("#tabs").innerHTML=[["./","tabHome","home"],["?v=demo","tabDemo","demo"]].map(([h,k,v])=>`<a href="${h}" ${v===active?'aria-current="page"':""}>${t(k)}</a>`).join("");
}
function staffHead(shop,active,key){
  return `<div class="staff-head"><div class="wrap" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;width:100%">
    ${logoHTML(shop)}<b><bdi>${esc(shop.name)}</bdi></b>
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

// ---------- Android install prompt ----------
let installEvt=null;
window.addEventListener("beforeinstallprompt",e=>{ e.preventDefault(); installEvt=e; document.querySelectorAll("[data-install]").forEach(b=>b.hidden=false); });
window.addEventListener("appinstalled",()=>{ installEvt=null; document.querySelectorAll("[data-install]").forEach(b=>b.hidden=true); });
async function doInstall(){ if(!installEvt) return; installEvt.prompt(); try{ await installEvt.userChoice; }catch(e){} installEvt=null; document.querySelectorAll("[data-install]").forEach(b=>b.hidden=true); }
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
  activeOrderJump();
  const L=recentShops();
  app.innerHTML=`<div class="app-home"><img src="icon-192.png" width="84" height="84" alt=""><h1>UR TURN</h1><p>${t("appP")}</p>
    <button class="btn primary scan-big" type="button" data-scan>📷 ${t("scanBtn")}</button>
    ${L.length?`<div class="recent"><h3>${t("recentT")}</h3>${L.map(r=>`<a class="recent-item" href="${esc(custURL(r.slug))}"><span class="dot" style="background:${esc(r.color||"#14181C")}"></span><bdi>${esc(r.name)}</bdi>${ls.get("urturn.order."+r.slug)?`<span class="pill" style="margin-inline-start:auto">${t("activeOrder")}</span>`:""}</a>`).join("")}</div>`:""}
    <button class="link-btn" type="button" data-lang2 style="margin-top:18px">${lang==="ar"?"English":"العربية"}</button></div>`;
  app.querySelector("[data-scan]").onclick=openScanner;
  app.querySelector("[data-lang2]").onclick=()=>setLang(lang==="ar"?"en":"ar");
}

// ---------- auto-update: reload open pages when a new version is published ----------
function watchVersion(){
  const cur=(document.querySelector('script[src*="app.js?v="]')||{}).src||""; const mine=(cur.match(/v=(\d+)/)||[])[1]; if(!mine) return;
  setInterval(async()=>{
    if(document.visibilityState!=="visible") return;
    try{ const r=await fetch(BASE+"index.html?_="+Date.now(),{cache:"no-store"}); if(!r.ok) return; const v=((await r.text()).match(/app\.js\?v=(\d+)/)||[])[1];
      if(v&&v!==mine){ const busy=Ring.on||(document.activeElement&&/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)); if(!busy) location.reload(); }
    }catch(e){} },120000);
}
async function customerPage(){
  const shop=await loadShop(SLUG);
  if(shop===undefined){ msg(t("netErr")); setTimeout(customerPage,4000); return; }
  if(!shop||!shop.active){ msg(t("noShop")); return; }
  applyShop(shop); document.title=shop.name+" · UR TURN";
  try{ const ps=await rpc("urturn_public_status",{p_slug:SLUG}); if(ps&&ps.locked){ msg(t("custPaused")); return; } }catch(e){}
  // Opened from the home-screen icon with an old order: go to the app home (scan a new café) instead.
  const oid=P.get("o")||ls.get("urturn.order."+SLUG);
  if(isStandalone()&&oid){ let od=null; try{ od=await Api.order(oid); }catch(e){ od=undefined; }
    const stale=od===null||(od&&(Date.now()-new Date(od.created_at)>12*3600e3||(od.status==="done"&&od.done_at&&Date.now()-new Date(od.done_at)>20*60000)));
    if(stale){ ls.set("urturn.order."+SLUG,null); location.replace(BASE+"?v=app"); return; } }
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
  if(kind==="cashier"){ $("#staff").className="wrap"; $("#staff").style.cssText="padding-block:20px;max-width:760px"; $("#staff").innerHTML=`<div id="cash"></div>`; store.lite=true; Cashier($("#cash"),store,KEY); store.start(3000); keepAwake(); }
  else { Owner($("#staff"),store,KEY); store.start(10000); }
  let headKey=shop.name+"|"+(shop.logo||"").length;
  store.listeners.add(()=>{ const sh=store.shop, k=sh.name+"|"+(sh.logo||"").length; if(k===headKey) return; headKey=k; const h=app.querySelector(".staff-head .wrap"); if(!h) return; const b=h.querySelector(":scope > b"); if(b) b.innerHTML="<bdi>"+esc(sh.name)+"</bdi>"; const lg=h.querySelector(":scope > .shop-logo"); if(lg) lg.outerHTML=logoHTML(sh); document.title=sh.name+" · UR TURN"; });
  watchVersion();
}
function setLang(l){ lang=l; ls.set("urturn.lang",l); location.reload(); }

document.documentElement.lang=lang; document.documentElement.dir=lang==="ar"?"rtl":"ltr";
$("#langBtn").textContent=lang==="ar"?"English":"العربية";
$("#langBtn").addEventListener("click",()=>setLang(lang==="ar"?"en":"ar"));
if(isStandalone()){ try{ const k=Object.keys(localStorage).filter(x=>x.startsWith("urturn.order.")).length; reportErr("info: app opened "+location.search.replace(/o=[^&]+/,"o=ID")+" saved_orders="+k); }catch(e){} }
if((VIEW==="home"&&isStandalone())||VIEW==="app") appHome();
else if(VIEW==="home") homePage();
else if(VIEW==="demo") demoPage();
else if(VIEW==="admin"){ topbar(""); $("#tabs").innerHTML=`<span class="admin-tag">${t("adminTitle")}</span>`; document.title="Admin · UR TURN"; Admin(app,KEY); }
else if(VIEW==="cashier"||VIEW==="owner") staffPage(VIEW);
else customerPage();
})();
