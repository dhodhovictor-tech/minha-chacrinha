// Rede de borboleta (borboletas e libélulas), capa de chuva e capinha do Darth (jogo local)
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
  await closeAll(); await p.waitForTimeout(1200);
  // a rede no armazém do Pedro
  await ev(() => { __sv.W.meta.day = 39; __sv.P.lastDay = 39; __sv.earn(30000); __sv.openShop('pedro'); });
  const loja = await ev(() => document.querySelector('.win').innerText);
  ok(/Rede de borboleta/.test(loja), 'Seu Pedro vende a rede de borboleta');
  await closeAll();
  // quais aparecem em cada hora
  const pools = await ev(() => { const s = __sv, set = (min, rain) => { s.W.clock.min = min; s.W.clock.at = Date.now(); s.W.meta.rain = rain; s.W.meta.snow = false; return s.bugPool(s.getMap('farm')).map(x => x[0]).join(','); }; return { dia: set(600, false), noite: set(1250, false), chuva: set(600, true) }; });
  ok(/borbbranca/.test(pools.dia) && /monarca/.test(pools.dia) && !/mariposa/.test(pools.dia), 'de dia no verão: ' + pools.dia);
  ok(/mariposa/.test(pools.noite) && !/monarca/.test(pools.noite), 'de noite: ' + pools.noite);
  ok(/libesmeralda/.test(pools.chuva) && !/borbbranca/.test(pools.chuva), 'na chuva: ' + pools.chuva);
  ok(Object.keys(await ev(() => __sv.BUGS)).length === 12, '12 espécies (8 + 4 da floresta)');
  // aparecem voando perto
  await ev(() => { const s = __sv; s.W.clock.min = 600; s.W.clock.at = Date.now(); s.W.meta.rain = false; s.goMap('town', 27 * 16 + 8, 17 * 16 + 8, 1); });
  await p.waitForTimeout(800);
  await ev(() => { for (let i = 0; i < 12; i++) __sv.updateBugs(10); });
  const n = await ev(() => __sv.bugs.length);
  ok(n >= 2, 'bichinhos voando na vila: ' + n);
  await clearToasts(); await p.waitForTimeout(500);
  await p.screenshot({ path: SHOTS + 'e10_voando.png' });
  // pegar com a rede: minijogo igual ao da pesca
  await ev(() => { const s = __sv, P = s.P; s.addItem('rede', 1, true); P.sel = P.inv.findIndex(x => x && x.id === 'rede'); s.bugs = [{ id: 'monarca', x: P.x, y: P.y + 2, hx: P.x, hy: P.y + 2, tx: P.x, ty: P.y, a: 0, ph: 0, wait: 9, h: 10, life: 60 }]; P.dir = 1; s.act(); });
  await p.waitForTimeout(500);
  const g = await ev(() => ({ bug: __sv.fishing && __sv.fishing.bug, id: __sv.fishing && __sv.fishing.id, vis: !document.getElementById('fish').hidden }));
  ok(g.bug && g.id === 'monarca' && g.vis, 'a rede abre a barra, como na pesca: ' + JSON.stringify(g));
  await p.screenshot({ path: SHOTS + 'e10_barra.png' });
  await ev(() => { __sv.fishing.prog = 2; }); await p.waitForTimeout(300);
  const got = await ev(() => ({ inv: __sv.P.inv.some(x => x && x.id === 'monarca'), col: Object.keys(__sv.P.stats.bugs || {}), t: document.getElementById('toasts').innerText, fish: !!__sv.fishing }));
  ok(got.inv && got.col.includes('monarca') && /Você pegou: Borboleta-monarca/.test(got.t) && !got.fish, 'pegou a monarca: ' + got.t.replace(/\n/g, ' | '));
  await p.waitForTimeout(900);
  ok(/Espécie nova na coleção! 1 de 12/.test(await ev(() => document.getElementById('toasts').innerText)), 'conta a coleção (1 de 12)');
  // escapar
  await ev(() => { const s = __sv, P = s.P; s.bugs = [{ id: 'libazul', x: P.x, y: P.y + 2, hx: P.x, hy: P.y + 2, tx: P.x, ty: P.y + 2, a: 0, ph: 0, wait: 9, h: 10, life: 60 }]; s.act(); });
  await p.waitForTimeout(450);
  await ev(() => { __sv.fishing.prog = 0; }); await p.waitForTimeout(300);
  ok(/Escapou da rede/.test(await ev(() => document.getElementById('toasts').innerText)), 'quando perde, escapa da rede');
  // sem bicho por perto
  await ev(() => { __sv.bugs = []; }); await p.waitForTimeout(500); const e0 = await ev(() => __sv.P.energy); await ev(() => __sv.act()); await p.waitForTimeout(200);
  ok(!(await ev(() => __sv.fishing)) && await ev(() => __sv.P.energy) < e0, 'rede no vazio gasta um pouquinho de energia');
  // capa de chuva e capinha do Darth no Ateliê
  await ev(() => __sv.openShop('roupas'));
  const atl = await ev(() => document.querySelector('.win').innerText);
  ok(/Capa de chuva/.test(atl) && /Capinha de chuva do Darth/.test(atl), 'Ateliê vende capa de chuva e capinha do Darth');
  await closeAll();
  await ev(() => { __sv.addItem('capachuva', 1, true); __sv.addItem('capadarth', 1, true); });
  await p.click('#bMenu'); await p.waitForTimeout(150); await p.click('[data-t="items"]'); await p.waitForTimeout(150);
  { const i = await ev(() => __sv.P.inv.findIndex(x => x && x.id === 'capachuva')); await p.click(`.win .grid [data-i="${i}"]`); await p.waitForTimeout(120); await p.click('[data-a="equipSel"]'); await p.waitForTimeout(150); }
  await closeAll();
  await ev(() => { __sv.W.meta.rain = false; });
  ok(!(await ev(() => __sv.comCapa())), 'sem chuva, a capa fica guardada');
  await ev(() => { __sv.W.meta.rain = true; });
  const cc = await ev(() => ({ capa: __sv.comCapa(), e: __sv.energyMul() }));
  ok(cc.capa && Math.abs(cc.e - 0.9) < 1e-9, 'na chuva: veste a capa e gasta 10% menos energia: ' + JSON.stringify(cc));
  // capinha no Darth
  await p.waitForTimeout(1500);
  await ev(() => { const s = __sv, P = s.P, st = s.petSt; P.sel = P.inv.findIndex(x => x && x.id === 'capadarth'); P.x = st.x - 12; P.y = st.y + 6; P.dir = 3; s.act(); });
  await p.waitForTimeout(300);
  const dc = await ev(() => ({ capa: __sv.P.pet.capa, on: __sv.darthDeCapa('town'), casa: __sv.darthDeCapa('house'), t: document.getElementById('toasts').innerText }));
  ok(dc.capa && dc.on && !dc.casa && /capinha/.test(dc.t), 'Darth de capinha na chuva (dentro de casa não): ' + dc.t.split('\n').pop());
  ok(await ev(() => !!__sv.catCanvas('walk', 0, true)), 'desenho do Darth de capinha');
  await ev(() => { const s = __sv, P = s.P, st = s.petSt; P.sel = 0; P.dir = 1; P.pet.mode = 'roam'; P.pet.hx = P.x + 34; P.pet.hy = P.y; st.x = P.x + 34; st.y = P.y; st.tx = st.x; st.ty = st.y; st.mv = 0; st.wait = 99; st.idle = 3; st.react = null; s.bugs = [{ id: 'libesmeralda', x: P.x - 30, y: P.y - 4, hx: P.x - 30, hy: P.y - 4, tx: P.x - 30, ty: P.y - 4, a: 0, ph: 0, wait: 99, h: 10, life: 60 }, { id: 'monarca', x: P.x - 10, y: P.y + 30, hx: P.x - 10, hy: P.y + 30, tx: 0, ty: 0, a: 0, ph: 0, wait: 0, h: 10, life: 60 }]; });
  await clearToasts(); await p.waitForTimeout(400);
  await p.screenshot({ path: SHOTS + 'e10_chuva.png' });
  await p.screenshot({ path: SHOTS + 'e10_zoom.png', clip: { x: 300, y: 80, width: 260, height: 180 } });
  await ev(() => { const s = __sv, P = s.P, st = s.petSt; P.sel = P.inv.findIndex(x => x && x.id === 'capadarth'); P.x = st.x - 12; P.y = st.y + 6; P.dir = 3; s.act(); });
  ok(!(await ev(() => __sv.P.pet.capa)), 'tocar de novo tira a capinha');
  console.log('erros', errs);
  await b.close();
})();
