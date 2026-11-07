// Nosso Jardim: cantinho do casal à beira do lago, com gazebo, fogueira de pedra, canteiros, banquinhos, balanço e luzinhas (jogo local)
const { chromium } = require('playwright');
const SHOTS = __dirname + '/../.tmp/shots/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + __dirname + '/../.tmp/teste.html'); await p.waitForTimeout(1200);
  await p.click('[data-v="casaco"]'); await p.fill('#nm', 'Ela'); await p.click('[data-a="start"]'); await p.waitForTimeout(800);
  const ev = (f, x) => p.evaluate(f, x), ok = (c, m) => console.log((c ? 'OK   ' : 'FALHA') + ' ' + m);
  const closeAll = () => ev(() => document.querySelectorAll('[data-a="close"]').forEach(c => c.click()));
  const clearToasts = () => ev(() => document.querySelectorAll('#toasts > *').forEach(e => e.remove()));
  const toasts = () => ev(() => document.getElementById('toasts').innerText.replace(/\n/g, ' | '));
  await closeAll(); await p.waitForTimeout(1200);
  await ev(() => { const s = __sv; s.W.clock.min = 720; s.W.clock.at = Date.now(); s.earn(50000); for (const [k, n] of [['madeira', 200], ['mpinho', 80], ['mcarvalho', 60], ['barraferro', 4], ['pedra', 80], ['carvao', 4], ['narciso', 3]]) s.addItem(k, n, true); });
  ok(await ev(() => { const s = __sv, J = s.JARDIM; for (let y = J.y0; y <= J.y1; y++) for (let x = J.x0; x <= J.x1; x++) { const t = s.tile(x + ',' + y); if (t && t.o && ['weed', 'rock', 'twig', 'stump', 'grass'].includes(t.o.k)) return false; } return true; }), 'o cantinho do jardim começa limpo');
  // placa do jardim
  await ev(() => __sv.goMap('farm', 24 * 16 + 8, 22 * 16 + 10, 0)); await p.waitForTimeout(800);
  await ev(() => { const P = __sv.P; P.x = 24 * 16 + 8; P.y = 22 * 16 + 10; P.dir = 0; P.sel = P.inv.findIndex(x => !x); __sv.act(); }); await p.waitForTimeout(250);
  ok(/Nosso Jardim/.test(await ev(() => (document.querySelector('.win') || {}).innerText || '')), 'a placa "Nosso Jardim" abre o projeto do jardim');
  await p.screenshot({ path: SHOTS + 'e18_projeto.png' });
  await ev(() => { const s = __sv, J = s.JARDIM; for (let y = J.y0; y <= J.y1; y++) for (let x = J.x0; x <= J.x1; x++) { const t = s.tile(x + ',' + y); if (t && (t.o || t.c || t.s)) s.setTile(x + ',' + y, null); } s.openPanel ? 0 : 0; document.querySelectorAll('[data-a="close"]').forEach(c => c.click()); const P = s.P; s.act(); });
  await p.waitForTimeout(200);
  await p.click('[data-a="jardimObra"][data-k="gazebo"]'); await p.waitForTimeout(200);
  await p.click('[data-a="jardimObra"][data-k="fogo"]'); await p.waitForTimeout(200);
  const enc = await ev(() => __sv.W.farm.jardim);
  ok(!!(enc.gazebo && enc.fogo), 'encomendou o gazebo e a fogueira de pedra');
  ok(await ev(() => !__sv.pronto('gazebo')), 'no mesmo dia, o gazebo ainda está em obra');
  await closeAll();
  // dia seguinte: pronto
  await ev(() => { const s = __sv; s.W.meta.day += 1; s.P.lastDay = s.W.meta.day; s.W.clock.min = 720; s.W.clock.at = Date.now(); });
  await p.waitForTimeout(400); await closeAll();
  ok(await ev(() => __sv.pronto('gazebo') && __sv.pronto('fogo')), 'no dia seguinte, gazebo e fogueira prontos');
  await ev(() => { __sv.setFarm('jardim', 'gazebo', -1); __sv.setFarm('jardim', 'fogo', -1); }); await p.waitForTimeout(300);
  // decorar: canteiros com narciso, banquinhos, balanço, lanterna e luzinhas
  await ev(() => { const s = __sv; for (const [k, id] of [['25,24', 'canteiro'], ['26,24', 'canteiro'], ['33,25', 'banquinho'], ['34,22', 'lanternajardim'], ['43,23', 'balanco'], ['27,24', 'canteiro'], ['42,21', 'varalluzes'], ['29,22', 'banquinho']]) s.setTile(k, { o: { k: id } }); });
  await ev(() => { const s = __sv, P = s.P; P.x = 25 * 16 + 8; P.y = 25 * 16 + 10; P.dir = 0; P.sel = P.inv.findIndex(x => x && x.id === 'narciso'); s.act(); });
  ok(await ev(() => (__sv.tile('25,24').o || {}).fl) === 'narciso', 'plantou um narciso no canteiro');
  await ev(() => { const s = __sv, t = s.tile('25,24'); s.setTile('25,24', { ...t, o: { ...t.o, d: s.W.meta.day - 3 } }); s.setTile('26,24', { o: { k: 'canteiro', fl: 'tulipa', d: s.W.meta.day - 1 } }); s.setTile('27,24', { o: { k: 'canteiro', fl: 'papoula', d: s.W.meta.day - 1 } }); const P = s.P; P.sel = P.inv.findIndex(x => !x); });
  const n0 = await ev(() => __sv.count('narciso')); await ev(() => __sv.act()); await p.waitForTimeout(200);
  ok(await ev(() => __sv.count('narciso')) === n0 + 1, 'o canteiro deu flor depois de 3 dias');
  await ev(() => { const s = __sv, P = s.P; P.x = 33 * 16 + 8; P.y = 26 * 16 + 10; P.dir = 0; P.energy = 100; s.act(); });
  ok(await ev(() => __sv.P.energy) === 110, 'sentar no banquinho sozinho dá +10');
  // gazebo: sentar sozinho olhando o lago
  await ev(() => { const s = __sv, P = s.P; P.x = 38 * 16 + 8; P.y = 24 * 16 + 10; P.dir = 0; P.energy = 100; s.act(); }); await p.waitForTimeout(200);
  const gz = await ev(() => (document.querySelector('.win') || {}).innerText || '');
  ok(/Gazebo/.test(gz) && /Sentar e olhar o lago/.test(gz) && /Precisa dos dois/.test(gz), 'o gazebo oferece sentar, dançar e piquenique (dançar e piquenique precisam dos dois)');
  await p.screenshot({ path: SHOTS + 'e18_gazebo_menu.png' });
  await p.click('[data-a="gzSentar"]'); await p.waitForTimeout(200);
  ok(await ev(() => __sv.P.energy) === 115, 'sentar no gazebo sozinho dá +15');
  await closeAll();
  // fogueira de pedra (com o Darth passeando longe para não pegar o toque)
  await ev(() => { const s = __sv; s.P.pet.mode = 'roam'; s.P.pet.map = 'farm'; s.P.pet.hx = 10 * 16; s.P.pet.hy = 30 * 16; s.petSt.x = 10 * 16; s.petSt.y = 30 * 16; }); await p.waitForTimeout(200);
  await ev(() => { const s = __sv, P = s.P, [fx, fy] = s.JARDIM.fogo; P.x = fx * 16 + 8; P.y = (fy + 1) * 16 + 10; P.dir = 0; P.energy = 100; P.sel = P.inv.findIndex(x => !x); s.act(); }); await p.waitForTimeout(200);
  ok(await ev(() => __sv.P.energy) === 120, 'descansar na fogueira de pedra (+20 sozinho)');
  // fotos de dia e de noite
  await clearToasts(); await ev(() => { const s = __sv, P = s.P; s.setFarm('jardim', 'gazebo', -1); s.setFarm('jardim', 'fogo', -1); const J = s.JARDIM; for (let y = J.y0; y <= J.y1 + 1; y++) for (let x = J.x0; x <= J.x1; x++) { const t = s.tile(x + ',' + y); if (t && t.o && ['tree', 'rock', 'weed', 'twig', 'stump', 'grass'].includes(t.o.k)) s.setTile(x + ',' + y, null); } P.x = 33 * 16 + 8; P.y = 27 * 16 + 4; P.dir = 0; }); await p.waitForTimeout(400);
  await p.screenshot({ path: SHOTS + 'e18_jardim.png' });
  await ev(() => { __sv.W.clock.min = 1290; __sv.W.clock.at = Date.now(); }); await p.waitForTimeout(500); await clearToasts();
  await p.screenshot({ path: SHOTS + 'e18_jardim_noite.png' });
  console.log('erros', errs);
  await b.close();
})();
