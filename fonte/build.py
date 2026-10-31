# Monta o jogo a partir das partes em fonte/jogo e gera o app (PWA) na raiz do repositório.
# Uso: python3 fonte/build.py   (config.js e seed.js da raiz não são tocados)
import datetime, hashlib, json, os, re, subprocess
FONTE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(FONTE)
JOGO, APP, TMP = os.path.join(FONTE, 'jogo'), os.path.join(FONTE, 'app'), os.path.join(FONTE, '.tmp')
os.makedirs(TMP, exist_ok=True)
PARTES = ['a_head.html', 'b_data.js', 'b2_data.js', 'b3_data.js', 'b4_data.js', 'c_maps.js', 'd_state.js', 'e_draw.js', 'e2_draw.js', 'f_icons.js', 'f2_icons.js', 'f3_fish.js', 'g_game.js', 'h_ui.js', 'j_systems.js', 'k_market.js', 'l_cc.js', 'm_pet.js', 'n_farm.js', 'o_prof.js', 'p_aventura.js', 'q_fest.js', 'r_conq.js', 's_music.js', 'i_main.js']
game = ''.join(open(os.path.join(JOGO, p)).read() for p in PARTES)
# confere a sintaxe do script do jogo
i = game.index('<script>\n(() =>'); j = game.rindex('</script>')
open(os.path.join(TMP, 'chk.js'), 'w').write(game[i + 8:j])
subprocess.run(['node', '--check', os.path.join(TMP, 'chk.js')], check=True)
# versão de teste: expõe window.__sv para os testes automáticos
HOOK = "  window.__sv = { get P() { return P; }, musicState: () => ({ theme: mTheme, notes: mNotes, on: musicOn, gain: MG && MG.gain.value, ac: AC && AC.state }), initAudio, checkAch, festOn, openFest, get festRun() { return festRun; }, deliverGifts, monsters: () => monsters, enterMine, swordHit, killMonster, equipSlot, unequip, attachTackle, giveTreasure, legendFor, pickFish, pendingProf, openProfChoice, hasProf, gainXP, iconCanvas, nightEvents, nightLines, cropDays, startMoving, renderHotbar, onNewDay, removeItem, W, act, goMap, tile, setTile: (...a) => setTile(...a), endDay, addItem, openShop, get fishing(){ return fishing; }, set fishing(v){ fishing = v; }, getMap, curMap, monsters: () => monsters, facing, setFarm, startPlacing, get placing(){ return placing; }, confirmPlacing, buyAnimal, farmB, farmA, openCooking, openTalk, npcPos, renderFridge, openTV, openBoard, openMail, earn, mount, animLocal, interactAnimal, giveGift, marketPrice, marketFactor, openMarket: () => openShop('cida'), sellPrice, openCC, openMuseum, ccGive, ccPay, museumDonate, artifactSpots, ccRoomsDone, butcher, openAnimalInfo, petSt, togglePet, PRESETS: () => PRESETS, openSleep, peerPlayers, gold, count, brokenSet, get host() { return host; }, nowMin, drawPreview: (c, lk, d, x, y, cat) => { const s = ctx; ctx = c.getContext('2d'); if (cat) drawCat(x, y, d, 0, cat); else drawFarmer(x, y, lk, d, 0); ctx = s; } };\n"
a = "  resize();\n  requestAnimationFrame(frame);"
assert a in game
test = game.replace(a, HOOK + a, 1)
open(os.path.join(TMP, 'jogo.html'), 'w').write(game)
open(os.path.join(TMP, 'teste.html'), 'w').write(test)

def split(g):
    cut = g.index('</style>\n') + len('</style>\n')
    return g[:cut], g[cut:]
head, body = split(game)
_, body_test = split(test)
head = re.sub(r'<link rel="preconnect"[^>]*>\n', '', head)
head = re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>\n', '', head)
head = head.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
fonts = ''.join(f'@font-face {{ font-family: "Pixelify Sans"; font-style: normal; font-weight: {w}; font-display: swap; src: url(fonts/pixelify-sans-{sub}-{w}-normal.woff2) format("woff2"); unicode-range: {rng}; }}\n'
                for w in (400, 500, 600, 700) for sub, rng in (('latin', 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'), ('latin-ext', 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF')))
has_seed = os.path.exists(os.path.join(ROOT, 'seed.js'))
scripts = ['vendor/firebase-app-compat.js', 'vendor/firebase-database-compat.js', 'config.js'] + (['seed.js'] if has_seed else []) + ['shim.js']
shim = open(os.path.join(APP, 'shim.js')).read()
open(os.path.join(ROOT, 'shim.js'), 'w').write(shim)
extra = ''.join(open(os.path.join(ROOT, f)).read() for f in ('config.js', 'seed.js') if os.path.exists(os.path.join(ROOT, f)))
APPVER = hashlib.sha256((game + shim + extra).encode()).hexdigest()[:7]
APPDATE = datetime.datetime.now().strftime('%d/%m/%Y')
def page(body): return f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#120d1e">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Chacrinha">
<meta name="description" content="Jogo de fazenda em dupla: plantar, pescar, minerar e cuidar dos bichos juntos.">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/icon-180.png">
<style>
{fonts}</style>
{head}</head>
<body>
<script>window.__APP_VERSION = '{APPVER}'; window.__APP_DATE = '{APPDATE}';</script>
{''.join(f'<script src="{s}"></script>' + chr(10) for s in scripts)}{body}
<script>
  // o app abre sempre a versão mais nova quando há internet; se uma versão nova sair com o app aberto, aparece um aviso para atualizar
  if ('serviceWorker' in navigator) {{
    const showUpd = () => {{
      if (document.getElementById('appUpd')) return;
      const b = document.createElement('button');
      b.id = 'appUpd'; b.type = 'button'; b.className = 'btn g'; b.textContent = 'Versão nova! Toque aqui para atualizar';
      b.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);top:calc(56px + env(safe-area-inset-top, 0px));z-index:200;max-width:calc(100% - 32px);font-size:14px';
      b.onclick = () => location.reload();
      document.body.appendChild(b);
    }};
    navigator.serviceWorker.addEventListener('message', e => {{ if (e.data && e.data.v && e.data.v !== window.__APP_VERSION) showUpd(); }});
    addEventListener('load', () => navigator.serviceWorker.register('sw.js').then(r => {{
      const check = () => r.update().catch(() => {{}});
      setInterval(check, 30 * 60 * 1000);
      document.addEventListener('visibilitychange', () => {{ if (document.visibilityState === 'visible') check(); }});
    }}).catch(() => {{}}));
  }}
</script>
</body>
</html>
'''
html = page(body)
open(os.path.join(ROOT, 'index.html'), 'w').write(html)
open(os.path.join(TMP, 'index_test.html'), 'w').write(page(body_test))
manifest = {
  'name': 'Minha Chacrinha', 'short_name': 'Chacrinha', 'lang': 'pt-BR',
  'description': 'Jogo de fazenda em dupla: plantar, pescar, minerar e cuidar dos bichos juntos.',
  'start_url': './', 'scope': './', 'display': 'fullscreen', 'display_override': ['fullscreen', 'standalone'],
  'orientation': 'any', 'background_color': '#120d1e', 'theme_color': '#120d1e',
  'icons': [{'src': 'icons/icon-192.png', 'sizes': '192x192', 'type': 'image/png'}, {'src': 'icons/icon-512.png', 'sizes': '512x512', 'type': 'image/png'},
            {'src': 'icons/icon-maskable-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'}],
}
open(os.path.join(ROOT, 'manifest.webmanifest'), 'w').write(json.dumps(manifest, ensure_ascii=False, indent=2))
files = ['./', 'index.html', 'manifest.webmanifest'] + scripts + sorted('fonts/' + f for f in os.listdir(os.path.join(ROOT, 'fonts'))) + sorted('icons/' + f for f in os.listdir(os.path.join(ROOT, 'icons')))
h = hashlib.sha256()
for f in files:
    if f != './': h.update(open(os.path.join(ROOT, f), 'rb').read())
ver = h.hexdigest()[:12]
sw = f'''// Guarda os arquivos do app no aparelho para abrir sem internet.
// O jogo (index.html, shim.js, config.js) vem sempre da internet quando possível; fontes, ícones e bibliotecas saem do aparelho.
const VERSION = '{APPVER}';
const CACHE = 'chacrinha-{ver}';
const FILES = {json.dumps(files)};
const STATIC = /\\/(vendor|fonts|icons)\\//;
self.addEventListener('install', e => {{ e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {{ cache: 'reload' }})))).then(() => self.skipWaiting())); }});
self.addEventListener('activate', e => {{
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('chacrinha-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
    .then(() => self.clients.matchAll({{ type: 'window' }}))
    .then(cs => cs.forEach(c => c.postMessage({{ v: VERSION }}))));
}});
async function fresh(req, key) {{
  const c = await caches.open(CACHE);
  try {{
    const res = await Promise.race([fetch(req, {{ cache: 'no-cache' }}), new Promise((_, no) => setTimeout(() => no(new Error('lento')), 6000))]);
    if (res.ok) c.put(key, res.clone());
    return res;
  }} catch (e) {{
    return (await c.match(key, {{ ignoreSearch: true }})) || Response.error();
  }}
}}
self.addEventListener('fetch', e => {{
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  if (r.mode === 'navigate') {{ e.respondWith(fresh(new Request('index.html'), 'index.html')); return; }}
  if (STATIC.test(u.pathname)) {{ e.respondWith(caches.open(CACHE).then(c => c.match(r, {{ ignoreSearch: true }}).then(hit => hit || fetch(r)))); return; }}
  e.respondWith(fresh(r, r));
}});
'''
open(os.path.join(ROOT, 'sw.js'), 'w').write(sw)
print('ok: jogo', APPVER, APPDATE, '· cache', ver, '·', len(html) // 1024, 'KB', '· com seed' if has_seed else '· sem seed')
