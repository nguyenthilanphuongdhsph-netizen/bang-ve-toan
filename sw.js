/* Bảng vẽ Toán: keeps the app on the device so it opens without internet */
const C='bang-ve-toan-v3';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(FILES)}));self.skipWaiting()});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C}).map(function(k){return caches.delete(k)}))}));
  self.clients.claim();
});
self.addEventListener('fetch',function(e){
  const r=e.request;if(r.method!=='GET')return;
  /* version checks always go to the network */
  if(r.url.indexOf('nocache=')>=0)return;
  /* the page itself: try the network first so updates arrive, fall back to the saved copy offline */
  if(r.mode==='navigate'){
    e.respondWith(fetch(r.url,{cache:'no-store',credentials:'same-origin'}).then(function(res){const cp=res.clone();caches.open(C).then(function(c){c.put('./index.html',cp)});return res})
      .catch(function(){return caches.match('./index.html')}));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(function(hit){return hit||fetch(r)}));
});
