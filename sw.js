const CACHE_VERSION = "fullride-v4";
const CORE = [
  "./offline.html", "./assets/app-icon.svg", "./assets/campus-placeholder.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_VERSION).then(cache => Promise.allSettled(CORE.map(asset => cache.add(asset)))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_VERSION).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

async function cacheResponse(request, response) {
  if (response?.ok) {
    const copy=response.clone();
    try { const cache=await caches.open(CACHE_VERSION);await cache.put(request,copy); } catch {}
  }
  return response;
}

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(response => cacheResponse(request, response)).catch(async () => (await caches.match(request)) || caches.match("./offline.html")));
    return;
  }

  const cached=caches.match(request);
  const update=fetch(request).then(response=>cacheResponse(request,response)).catch(async()=>await cached || Response.error());
  event.waitUntil(update.then(()=>{}));
  event.respondWith(cached.then(response=>response || update));
});
