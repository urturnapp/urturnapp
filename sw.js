// UR TURN service worker: shows "order ready" notifications even when the page is closed.
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("push",e=>{
  let d={}; try{ d=e.data?e.data.json():{}; }catch(_){ d={title:"UR TURN",body:e.data&&e.data.text()}; }
  e.waitUntil(self.registration.showNotification(d.title||"UR TURN",{
    body:d.body||"", tag:d.tag||"urturn", renotify:true, requireInteraction:true,
    vibrate:[400,150,400,150,800,300,400,150,400], icon:"icon-192.png", badge:"icon-192.png", data:{url:d.url||self.registration.scope}
  }));
});
self.addEventListener("notificationclick",e=>{
  e.notification.close(); const url=(e.notification.data&&e.notification.data.url)||self.registration.scope;
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{
    for(const c of list){ if(c.url.split("#")[0]===url.split("#")[0]&&"focus" in c) return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
