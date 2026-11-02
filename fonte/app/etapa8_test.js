// Regador de lado, presentinho do Darth e carinho com reação (jogo local)
const { chromium } = require('playwright');
const SHOTS = __dirname + '/../.tmp/shots/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + __dirname + '/../.tmp/teste.html'); await p.waitForTimeout(1200);
  await p.click('[data-v="casaco"]'); await p.fill('#nm', 'Ela'); await p.click('[data-a="start"]'); await p.waitForTimeout(800);
  const ev = (f, x) => p.evaluate(f, x), ok = (c, m) => console.log((c ? 'OK   ' : 'FALHA') + ' ' + m);
  await ev(() => document.querySelectorAll('[data-a="close"]').forEach(c => c.click()));
  // regador: virado para cima, nível 2 molha 3 quadrados lado a lado
  await ev(() => { const s = __sv; for (let x = 8; x <= 14; x++) for (let y = 18; y <= 22; y++) s.setTile(x + ',' + y, { s: 1 }); s.P.inv[1] = { id: 'can', n: 1, lv: 2 }; s.P.water = 40; s.goMap('farm', 11 * 16 + 8, 21 * 16 + 12, 0); });
  await p.waitForTimeout(700);
  await ev(() => { const P = __sv.P; P.x = 11 * 16 + 8; P.y = 21 * 16 + 12; P.dir = 0; P.sel = 1; __sv.act(); });
  const w = await ev(() => { const d = __sv.W.meta.day, wet = (x, y) => (__sv.tile(x + ',' + y) || {}).w === d; return [wet(10, 20), wet(11, 20), wet(12, 20), wet(11, 19), wet(9, 20)]; });
  ok(w[0] && w[1] && w[2] && !w[3] && !w[4], 'virado para cima: regou 3 quadrados lado a lado (como a foice): ' + w);
  // carinho: reação e medidor
  await p.waitForTimeout(1500);
  const pet = await ev(() => { const s = __sv, P = s.P, st = s.petSt; P.x = st.x - 12; P.y = st.y + 6; P.dir = 3; P.sel = 0; s.act(); return { react: st.react && st.react.k, love: P.pet.love, toast: document.getElementById('toasts').innerText }; });
  ok(!!pet.react && pet.love === 3 && /Carinho: 💚/.test(pet.toast), 'carinho: Darth reage (' + pet.react + ') e mostra o medidor: ' + pet.toast.split('\n').pop());
  await p.waitForTimeout(300); await p.screenshot({ path: SHOTS + 'e8_carinho.png' });
  // petisco hoje, presentinho na manhã seguinte (sempre)
  await p.waitForTimeout(1800);
  await ev(() => { const s = __sv, P = s.P, st = s.petSt; s.addItem('petisco', 1, true); P.sel = P.inv.findIndex(x => x && x.id === 'petisco'); P.x = st.x - 12; P.y = st.y + 6; P.dir = 3; s.act(); });
  await p.waitForTimeout(400);
  const n0 = await ev(() => __sv.P.inv.filter(Boolean).reduce((a, x) => a + x.n, 0));
  await ev(() => __sv.endDay()); await p.waitForTimeout(1500);
  const morning = await ev(() => (document.querySelector('.win') || {}).innerText || '');
  ok(/Darth deixou um presentinho/.test(morning), 'manhã seguinte: ' + (morning.match(/Darth deixou[^\n]*/) || [''])[0]);
  await p.screenshot({ path: SHOTS + 'e8_manha.png' });
  console.log('erros', errs);
  await b.close();
})();
