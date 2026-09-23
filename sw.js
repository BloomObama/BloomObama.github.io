const CACHE_VERSION = "fullride-v1";
const CORE = [
  "./", "./index.html", "./practice.html", "./ielts-resources.html", "./compare.html",
  "./offline.html", "./styles.css", "./site-refresh.css", "./theme-accent.css",
  "./site-nav.js", "./college-index.js", "./college-data.js", "./assets/campus-placeholder.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_VERSION).then(cache => Promise.allSettled(CORE.map(asset => cache.add(asset)))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_VERSION).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

function cacheResponse(request, response) {
  if (response?.ok) caches.open(CACHE_VERSION).then(cache => cache.put(request, response.clone()));
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

  event.respondWith(caches.match(request).then(cached => {
    const update = fetch(request).then(response => cacheResponse(request, response)).catch(() => cached);
    return cached || update;
  }));
});
