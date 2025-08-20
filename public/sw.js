const CACHE = "fitness-cache-v2";
const BASE = self.location.pathname.replace(/sw\.js$/, );
const ASSETS = [ BASE, BASE+"index.html", BASE+"manifest.webmanifest" ];
// ASSETS updated above for relative base
self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
});
self.addEventListener("fetch", e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
