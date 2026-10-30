"use strict";
// UR TURN · core: config, texts, server access, sounds, notifications, shared helpers.
// Every page loads this file first. Page parts: customer.js, cashier.js, admin.js, home.js.

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
 tipSound:"خلّي صوت الجوال شغّال والشاشة مفتوحة.",nowLbl:"الآن",cashInst:"💡 ثبّت شاشة الكاشير كتطبيق، وهيك صوت الطلبات بيشتغل لحاله كل ما تفتحها بدون ضغط.",instNote:"📲 <b>ثبّت UR TURN بضغطة وحدة</b> عشان يرن جوالك لما يجهز طلبك حتى لو مقفول، ونفس التطبيق بيشتغل بكل الكافيهات.",instGo:"تثبيت التطبيق",pushNote:"🔔 <b>فعّل الإشعارات</b> عشان يرن جوالك لما يجهز طلبك، حتى لو سكّرت الشاشة.",pushGo:"فعّل الإشعارات",sndOn:"🔔 اضغط هون لتفعيل صوت الطلبات الجديدة",newOrderT:n=>"طلب جديد "+n,iosNote:"🔔 <b>عشان جوالك يرن حتى لو مقفول:</b> اضغط زر المشاركة <b>⬆️</b> تحت، وبعدين <b>«إضافة إلى الشاشة الرئيسية»</b>، وافتح من الأيقونة.",iosArrow:"زر المشاركة هون",iosTip:"📲 <b>نصيحة لأصحاب الآيفون:</b> اضغط زر المشاركة <b>⬆️</b> ثم <b>«إضافة إلى الشاشة الرئيسية»</b>، وافتح الصفحة من أيقونتها. هيك بيوصلك تنبيه لما يجهز طلبك حتى لو الجوال مقفول 🔔، ونفس الأيقونة بتشتغل بكل الكافيهات.",pushOn:"✅ رح يوصلك إشعار لما يجهز طلبك، حتى لو سكّرت الشاشة.",pushAsk:"🔔 فعّل الإشعارات عشان يوصلك تنبيه حتى لو الشاشة مطفية",cancel:"إلغاء ورقم مختلف",
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
 tipSound:"Keep your sound on and the screen open.",nowLbl:"now",cashInst:"💡 Install the cashier screen as an app so order sounds work automatically every time you open it.",instNote:"📲 <b>Install UR TURN in one tap</b> so your phone rings when your order is ready, even when locked. The same app works at every café.",instGo:"Install app",pushNote:"🔔 <b>Turn on notifications</b> so your phone rings when your order is ready, even with the screen off.",pushGo:"Turn on",sndOn:"🔔 Tap here to turn on new-order sound",newOrderT:n=>"New order "+n,iosNote:"🔔 <b>Get alerted even with your phone locked:</b> tap Share <b>⬆️</b> below, then <b>“Add to Home Screen”</b>, and open from the icon.",iosArrow:"Share button here",iosTip:"📲 <b>iPhone tip:</b> tap Share <b>⬆️</b> then <b>“Add to Home Screen”</b> and open the page from its icon. You'll get an alert when your order is ready, even with your phone locked 🔔. The same icon works at every café.",pushOn:"✅ You'll get a notification when it's ready, even with the screen off.",pushAsk:"🔔 Turn on notifications to get alerted even with the screen off",cancel:"Cancel / different number",
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
window.__ringRef=()=>Ring;
try{ if(navigator.audioSession) navigator.audioSession.type="playback"; }catch(e){}
function silentWav(){ const n=2205, b=new ArrayBuffer(44+n*2), v=new DataView(b), w=(o,str)=>{ for(let i=0;i<str.length;i++) v.setUint8(o+i,str.charCodeAt(i)); };
  w(0,"RIFF"); v.setUint32(4,36+n*2,true); w(8,"WAVE"); w(12,"fmt "); v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,1,true); v.setUint32(24,22050,true); v.setUint32(28,44100,true); v.setUint16(32,2,true); v.setUint16(34,16,true); w(36,"data"); v.setUint32(40,n*2,true);
  return URL.createObjectURL(new Blob([b],{type:"audio/wav"})); }
function dingWav(){ const sr=22050, parts=[[1318.5,0],[1046.5,0.13],[1568,0.26]], n=Math.round(sr*0.75), d=new Float32Array(n);
  parts.forEach(([f,st])=>{ const o=Math.round(st*sr); for(let k=0;o+k<n&&k<sr*0.45;k++){ const t=k/sr; d[o+k]+=Math.sin(2*Math.PI*f*t)*Math.min(1,k/(sr*0.01))*Math.exp(-t*9)*0.4; } });
  const b=new ArrayBuffer(44+n*2), v=new DataView(b), w=(o,str)=>{ for(let i=0;i<str.length;i++) v.setUint8(o+i,str.charCodeAt(i)); };
  w(0,"RIFF"); v.setUint32(4,36+n*2,true); w(8,"WAVE"); w(12,"fmt "); v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,1,true); v.setUint32(24,sr,true); v.setUint32(28,sr*2,true); v.setUint16(32,2,true); v.setUint16(34,16,true); w(36,"data"); v.setUint32(40,n*2,true);
  const out=new Int16Array(b,44); for(let i=0;i<n;i++) out[i]=Math.max(-1,Math.min(1,d[i]))*32767; return URL.createObjectURL(new Blob([b],{type:"audio/wav"})); }
function chimeWav(){ // build the ring sound as a small WAV file (5 notes, ~0.8s, then short silence)
  const sr=22050, notes=[880,1175,1568,1175,1568], nl=Math.round(sr*0.16), gap=Math.round(sr*0.22), n=nl*notes.length+gap, d=new Int16Array(n);
  notes.forEach((f,i)=>{ for(let k=0;k<nl;k++){ const t=k/sr, env=Math.min(1,k/(sr*0.02))*Math.exp(-t*14); d[i*nl+k]=Math.round(Math.sin(2*Math.PI*f*t)*env*0.55*32767); } });
  const b=new ArrayBuffer(44+n*2), v=new DataView(b), w=(o,str)=>{ for(let i=0;i<str.length;i++) v.setUint8(o+i,str.charCodeAt(i)); };
  w(0,"RIFF"); v.setUint32(4,36+n*2,true); w(8,"WAVE"); w(12,"fmt "); v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,1,true); v.setUint32(24,sr,true); v.setUint32(28,sr*2,true); v.setUint16(32,2,true); v.setUint16(34,16,true); w(36,"data"); v.setUint32(40,n*2,true);
  new Int16Array(b,44).set(d); return URL.createObjectURL(new Blob([b],{type:"audio/wav"})); }
const Ring={ ctx:null,timer:null,on:false,el:null,elOk:false,
  unlock(){ try{ if(navigator.audioSession&&navigator.audioSession.type!=="playback") navigator.audioSession.type="playback"; }catch(e){} // iPhone: play even when the silent switch is on
    try{ if(!this.ctx){ const C=window.AudioContext||window.webkitAudioContext; if(C) this.ctx=new C(); } if(this.ctx&&this.ctx.resume){ const r=this.ctx.resume(); if(r&&r.catch) r.catch(()=>{}); } }catch(e){}
    // Unlock with a silent clip first (so nothing is heard), then switch to the ring sound. iPhone keeps the element allowed after that.
    try{ if(!this.el){ this.el=new Audio(); this.el.setAttribute("playsinline",""); this.el.preload="auto"; this.chimeUrl=chimeWav(); this.silentUrl=silentWav(); }
      if(!this.elOk&&!this.on&&!this.unlocking){ const a=this.el; this.unlocking=true; a.loop=false; a.src=this.silentUrl; const p=a.play();
        const fin=ok=>{ this.unlocking=false; try{ a.pause(); }catch(e){} a.loop=true; a.src=this.chimeUrl; a.load(); if(ok) this.elOk=true; };
        if(p&&p.then) p.then(()=>fin(true)).catch(()=>fin(false)); else fin(true); }
      if(!this.dEl){ this.dEl=new Audio(); this.dEl.setAttribute("playsinline",""); this.dingUrl=dingWav(); }
      if(!this.dOk&&!this.dUnlocking){ const a=this.dEl; this.dUnlocking=true; a.src=this.silentUrl; const p2=a.play();
        const fin2=ok=>{ this.dUnlocking=false; try{ a.pause(); }catch(e){} a.src=this.dingUrl; a.load(); if(ok) this.dOk=true; };
        if(p2&&p2.then) p2.then(()=>fin2(true)).catch(()=>fin2(false)); else fin2(true); } }catch(e){} },
  chime(){ if(!this.ctx) return; const now=this.ctx.currentTime;
    [880,1175,1568,1175,1568].forEach((f,i)=>{ const o=this.ctx.createOscillator(),g=this.ctx.createGain(); o.type="sine"; o.frequency.value=f; o.connect(g); g.connect(this.ctx.destination);
      const s=now+i*0.16; g.gain.setValueAtTime(0.0001,s); g.gain.exponentialRampToValueAtTime(0.4,s+0.02); g.gain.exponentialRampToValueAtTime(0.0001,s+0.15); o.start(s); o.stop(s+0.16); }); },
  dinged:0,
  ding(){ if(this.dEl&&this.dOk){ try{ this.dEl.currentTime=0; const p=this.dEl.play(); if(p&&p.catch) p.catch(()=>{}); try{ navigator.vibrate&&navigator.vibrate([120,80,120]); }catch(e){} return true; }catch(e){} }
    if(!this.ctx||this.ctx.state!=="running") return false; const now=this.ctx.currentTime;
    [[1318.5,0],[1046.5,0.13],[1568,0.26]].forEach(([f,d])=>{ const o=this.ctx.createOscillator(),g=this.ctx.createGain(); o.type="sine"; o.frequency.value=f; o.connect(g); g.connect(this.ctx.destination);
      const s=now+d; g.gain.setValueAtTime(0.0001,s); g.gain.exponentialRampToValueAtTime(0.35,s+0.015); g.gain.exponentialRampToValueAtTime(0.0001,s+0.4); o.start(s); o.stop(s+0.42); });
    try{ navigator.vibrate&&navigator.vibrate([120,80,120]); }catch(e){} return true; },
  notify(){ if(this.dinged>=2||this.on) return; this.unlock();
    const go=(k=0)=>{ if(this.dinged>=2||this.on) return; if(this.ding()){ this.dinged++; if(isIOS) reportErr("info: ding el="+!!this.dOk+" ctx="+(this.ctx&&this.ctx.state)+" sess="+(navigator.audioSession?navigator.audioSession.type:"none")); } else if(k<15) setTimeout(()=>go(k+1),100); else if(isIOS) reportErr("info: ding failed ctx="+(this.ctx&&this.ctx.state)); };
    setTimeout(()=>{ if(this.ctx&&this.ctx.state==="running") go(); else document.addEventListener("pointerdown",()=>{ this.unlock(); setTimeout(go,60); },{once:true,passive:true}); },1300); },
  start(){ if(this.on) return; this.on=true; this.unlock(); this.useEl=false;
    if(this.el&&this.elOk){ try{ this.el.muted=false; this.el.currentTime=0; const p=this.el.play(); this.useEl=true; if(p&&p.catch) p.catch(()=>{ this.useEl=false; }); }catch(e){} }
    const tick=()=>{ if(!this.useEl||(this.el&&this.el.paused)){ this.useEl=false; this.chime(); } try{ navigator.vibrate&&navigator.vibrate([350,150,350,150,600]); }catch(e){} }; tick(); this.timer=setInterval(tick,1800); },
  stop(){ if(!this.on) return; this.on=false; clearInterval(this.timer); this.timer=null; try{ if(this.el){ this.el.pause(); this.el.currentTime=0; } }catch(e){} try{ navigator.vibrate&&navigator.vibrate(0); }catch(e){} }
};
let wakeLock=null;
async function keepAwake(){ try{ if(navigator.wakeLock&&(!wakeLock||wakeLock.released)) wakeLock=await navigator.wakeLock.request("screen"); }catch(e){} }
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible") keepAwake(); });
["pointerdown","touchend","click","keydown"].forEach(ev=>document.addEventListener(ev,()=>{ const was=Ring.ctx&&Ring.ctx.state; Ring.unlock(); if(Ring.on&&was!=="running") setTimeout(()=>Ring.chime(),80); },{passive:true}));
// ---------- push notifications (ring even when the screen is off) ----------
const VAPID_PUB="BCWk-h1YhyHgZOu5bp_pxZGM9PKLquMaw7Vd9rD9ivAY_wLHYYr1_94H-uTqylpvnDpcIucHXyuGWe7b7vYUp5w";
const PUSH_FN=SUPA_URL+"/functions/v1/urturn-push";
const isIOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
const sessionGet=k=>{ try{ return sessionStorage.getItem(k); }catch(e){ return null; } }, sessionSet=(k,v)=>{ try{ sessionStorage.setItem(k,v); }catch(e){} };
const instOff=()=>{ const v=+(ls.get("urturn.instOff")||0); return v>1&&Date.now()-v<6*3600e3; };
const iosTipOff=()=>{ const v=+(ls.get("urturn.iosTipOff")||0); return v>1&&Date.now()-v<6*3600e3; };
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
const ETA_CHOICES=[5,10,15,20,30,40,60];
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

async function loadShop(slug){ try{ return await Api.shop(slug); }catch(e){ return undefined; } }
function msg(text){ app.innerHTML=`<div class="center-msg"><img src="icon.svg" width="56" height="56" alt="" style="margin:0 auto"><h2>${esc(text)}</h2></div>`; }

// ---------- Android install prompt ----------
let installEvt=null;
window.addEventListener("beforeinstallprompt",e=>{ e.preventDefault(); installEvt=e; document.querySelectorAll("[data-install]").forEach(b=>b.hidden=false); document.dispatchEvent(new Event("urturn-install")); });
window.addEventListener("appinstalled",()=>{ installEvt=null; document.querySelectorAll("[data-install]").forEach(b=>b.hidden=true); });
async function doInstall(){ if(!installEvt) return; installEvt.prompt(); try{ await installEvt.userChoice; }catch(e){} installEvt=null; document.querySelectorAll("[data-install]").forEach(b=>b.hidden=true); document.querySelectorAll(".install-note").forEach(x=>x.remove()); }

// ---------- auto-update: reload open pages when a new version is published ----------
function watchVersion(){
  const cur=(document.querySelector('script[src*="core.js?v="]')||{}).src||""; const mine=(cur.match(/v=(\d+)/)||[])[1]; if(!mine) return;
  setInterval(async()=>{
    if(document.visibilityState!=="visible") return;
    try{ const r=await fetch(BASE+"index.html?_="+Date.now(),{cache:"no-store"}); if(!r.ok) return; const v=((await r.text()).match(/core\.js\?v=(\d+)/)||[])[1];
      if(v&&v!==mine){ let busy=Ring.on||(document.activeElement&&/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName));
        if(VIEW==="cashier"&&window.__shop){ const sh=window.__shop, h=new Date().getHours(); busy=busy||(hasHours(sh)?isOpenNow(sh):!(h>=3&&h<6)); }
        if(!busy) location.reload(); }
    }catch(e){} },120000);
}

function setLang(l){ lang=l; ls.set("urturn.lang",l); location.reload(); }

// ---------- start: core.js runs boot() after the page part has loaded ----------
function boot(){
  document.documentElement.lang=lang; document.documentElement.dir=lang==="ar"?"rtl":"ltr";
  $("#langBtn").textContent=lang==="ar"?"English":"العربية";
  $("#langBtn").addEventListener("click",()=>setLang(lang==="ar"?"en":"ar"));
  if((VIEW==="home"&&isStandalone())||VIEW==="app") appHome();
  else if(VIEW==="home") homePage();
  else if(VIEW==="demo") demoPage();
  else if(VIEW==="admin"){ topbar(""); $("#tabs").innerHTML=`<span class="admin-tag">${t("adminTitle")}</span>`; document.title="Admin · UR TURN"; Admin(app,KEY); }
  else if(VIEW==="cashier"||VIEW==="owner") staffPage(VIEW);
  else customerPage();
}
