// Guarda os arquivos do app no aparelho. O nome do cache muda a cada versão nova do jogo.
const CACHE = 'chacrinha-5a1ea9113519';
const FILES = ["./", "index.html", "manifest.webmanifest", "vendor/firebase-app-compat.js", "vendor/firebase-database-compat.js", "config.js", "seed.js", "shim.js", "fonts/pixelify-sans-latin-400-normal.woff2", "fonts/pixelify-sans-latin-500-normal.woff2", "fonts/pixelify-sans-latin-600-normal.woff2", "fonts/pixelify-sans-latin-700-normal.woff2", "fonts/pixelify-sans-latin-ext-400-normal.woff2", "fonts/pixelify-sans-latin-ext-500-normal.woff2", "fonts/pixelify-sans-latin-ext-600-normal.woff2", "fonts/pixelify-sans-latin-ext-700-normal.woff2", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('chacrinha-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  const key = r.mode === 'navigate' ? 'index.html' : r;
  e.respondWith(caches.open(CACHE).then(c => c.match(key, { ignoreSearch: true }).then(hit => hit || fetch(r))));
});
