// UR TURN service worker: shows "order ready" notifications even when the page is closed.
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
// Pass-through fetch handler (lets Android offer "Install app").
self.addEventListener("fetch",e=>{ if(e.request.mode==="navigate") e.respondWith(fetch(e.request)); });
self.addEventListener("push",e=>{
  let d={}; try{ d=e.data?e.data.json():{}; }catch(_){ d={title:"UR TURN",body:e.data&&e.data.text()}; }
  // Repeat reminders: remove the previous one and show a fresh one, so the phone rings again (iPhone stays silent on a replaced notification).
  const base=d.tag||"urturn";
  e.waitUntil(self.registration.getNotifications().then(list=>{ list.forEach(n=>{ if((n.tag||"").startsWith(base)) n.close(); });
    return self.registration.showNotification(d.title||"UR TURN",{
      body:d.body||"", tag:base+"-"+Date.now(), renotify:true, requireInteraction:true,
      vibrate:[400,150,400,150,800,300,400,150,400], icon:"icon-192.png", badge:"icon-192.png", data:{url:d.url||self.registration.scope}
    }); }));
});
self.addEventListener("notificationclick",e=>{
  e.notification.close(); const url=(e.notification.data&&e.notification.data.url)||self.registration.scope;
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{
    const slug=u=>{ try{ return new URL(u).searchParams.get("s")||""; }catch(_){ return ""; } };
    const hit=list.find(c=>c.url.split("#")[0]===url.split("#")[0])||list.find(c=>slug(c.url)&&slug(c.url)===slug(url));
    if(hit&&"focus" in hit){ try{ hit.postMessage({type:"urturn-ring"}); }catch(_){} return hit.focus(); }
    return self.clients.openWindow(url);
  }));
});
