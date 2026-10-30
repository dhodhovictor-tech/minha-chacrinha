// Guarda os arquivos do app no aparelho para abrir sem internet.
// O jogo (index.html, shim.js, config.js) vem sempre da internet quando possível; fontes, ícones e bibliotecas saem do aparelho.
const VERSION = 'd6b0c8f';
const CACHE = 'chacrinha-388cfb1f25a4';
const FILES = ["./", "index.html", "manifest.webmanifest", "vendor/firebase-app-compat.js", "vendor/firebase-database-compat.js", "config.js", "seed.js", "shim.js", "fonts/pixelify-sans-latin-400-normal.woff2", "fonts/pixelify-sans-latin-500-normal.woff2", "fonts/pixelify-sans-latin-600-normal.woff2", "fonts/pixelify-sans-latin-700-normal.woff2", "fonts/pixelify-sans-latin-ext-400-normal.woff2", "fonts/pixelify-sans-latin-ext-500-normal.woff2", "fonts/pixelify-sans-latin-ext-600-normal.woff2", "fonts/pixelify-sans-latin-ext-700-normal.woff2", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
const STATIC = /\/(vendor|fonts|icons)\//;
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('chacrinha-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
    .then(() => self.clients.matchAll({ type: 'window' }))
    .then(cs => cs.forEach(c => c.postMessage({ v: VERSION }))));
});
async function fresh(req, key) {
  const c = await caches.open(CACHE);
  try {
    const res = await Promise.race([fetch(req, { cache: 'no-cache' }), new Promise((_, no) => setTimeout(() => no(new Error('lento')), 6000))]);
    if (res.ok) c.put(key, res.clone());
    return res;
  } catch (e) {
    return (await c.match(key, { ignoreSearch: true })) || Response.error();
  }
}
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  if (r.mode === 'navigate') { e.respondWith(fresh(new Request('index.html'), 'index.html')); return; }
  if (STATIC.test(u.pathname)) { e.respondWith(caches.open(CACHE).then(c => c.match(r, { ignoreSearch: true }).then(hit => hit || fetch(r)))); return; }
  e.respondWith(fresh(r, r));
});
