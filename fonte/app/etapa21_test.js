// Moinho: trigo vira farinha, beterraba vira açúcar e girassol vira óleo (jogo local)
const { chromium } = require('playwright');
const SHOTS = __dirname + '/../.tmp/shots/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + __dirname + '/../.tmp/teste.html'); await p.waitForTimeout(1200);
  await p.click('[data-v="xadrez"]'); await p.fill('#nm', 'Eu'); await p.click('[data-a="start"]'); await p.waitForTimeout(800);
  const ev = (f, x) => p.evaluate(f, x), ok = (c, m) => console.log((c ? 'OK   ' : 'FALHA') + ' ' + m);
  const closeAll = () => ev(() => document.querySelectorAll('[data-a="close"]').forEach(c => c.click()));
  const clearToasts = () => ev(() => document.querySelectorAll('#toasts > *').forEach(e => e.remove()));
  const panel = () => ev(() => (document.querySelector('.win') || {}).innerText || '');
  await closeAll(); await p.waitForTimeout(1200);
  await ev(() => { const s = __sv; s.W.clock.min = 720; s.W.clock.at = Date.now(); s.earn(20000); for (const [k, n] of [['madeira', 200], ['pedra', 100], ['mpinho', 40], ['fibra', 40], ['trigo', 10], ['beterraba', 4], ['girassol', 2]]) s.addItem(k, n, true); });
  // na Rosa
  await ev(() => __sv.openShop('rosa')); await p.waitForTimeout(200);
  ok(/Moinho/.test(await panel()) && /farinha/.test(await panel()), 'a Rosa constrói o moinho');
  await closeAll();
  // um lugar livre na chacrinha
  const pos = await ev(() => {
    const s = __sv, m = s.getMap('farm');
    for (let y = 4; y < m.h - 8; y++) for (let x = 4; x < m.w - 8; x++) {
      let free = true;
      for (let dy = -1; dy < 5 && free; dy++) for (let dx = -1; dx < 5 && free; dx++) { const k = (x + dx) + ',' + (y + dy), t = s.tile(k); if (m.solid[(y + dy) * m.w + x + dx] || m.at(x + dx, y + dy) !== m.at(5, 12) || (t && (t.c || t.s || (t.o && !['weed', 'grass', 'twig'].includes(t.o.k)))) || Object.values(s.W.farm.b || {}).some(b => x + dx >= b.x - 1 && x + dx < b.x + 8 && y + dy >= b.y - 1 && y + dy < b.y + 5)) free = false; }
      if (free) { for (let dy = 0; dy < 4; dy++) for (let dx = 0; dx < 4; dx++) s.setTile((x + dx) + ',' + (y + dy), null); s.setFarm('b', 'moinho1', { type: 'moinho', lv: 1, x, y, ready: s.W.meta.day, feed: 0 }); return [x, y]; }
    }
    return null;
  });
  ok(!!pos, 'moinho construído na chacrinha em ' + JSON.stringify(pos));
  await ev(([x, y]) => __sv.goMap('farm', (x + 2) * 16, (y + 6) * 16, 0), pos); await p.waitForTimeout(900); await clearToasts();
  await p.screenshot({ path: SHOTS + 'e21_moinho.png' });
  // segurando o trigo e tocando no moinho
  const r1 = await ev(() => { const s = __sv, b = s.W.farm.b.moinho1; s.P.sel = s.P.inv.findIndex(x => x && x.id === 'trigo'); s.moinhoBuilding('moinho1', b); return { trigo: s.count('trigo'), mo: s.W.farm.b.moinho1.mo }; });
  ok(r1.trigo === 0 && r1.mo.i.trigo === 10, 'segurar o trigo e tocar no moinho põe tudo para moer');
  await ev(() => __sv.openMoinho('moinho1')); await p.waitForTimeout(200);
  ok(/Moendo/.test(await panel()) && /Beterraba → Açúcar/.test(await panel()), 'painel do moinho mostra o que está moendo e o que dá para moer');
  await ev(() => document.querySelector('[data-a="moPoe"][data-k="beterraba"]').click()); await p.waitForTimeout(150);
  await ev(() => document.querySelector('[data-a="moPoe"][data-k="girassol"]').click()); await p.waitForTimeout(150);
  await p.screenshot({ path: SHOTS + 'e21_painel.png' });
  ok(await ev(() => { const mo = __sv.W.farm.b.moinho1.mo; return mo.i.beterraba === 4 && mo.i.girassol === 2; }), 'beterraba e girassol também entram');
  ok(await ev(() => !Object.keys(__sv.moPronto(__sv.W.farm.b.moinho1).o || {}).length), 'no mesmo dia ainda não está pronto');
  await closeAll();
  // dia seguinte
  await ev(() => { const s = __sv, b = s.W.farm.b.moinho1; s.setFarm('b', 'moinho1', { ...b, mo: { ...b.mo, d: s.W.meta.day - 1 } }); });
  const r2 = await ev(() => { const s = __sv, f0 = s.count('farinha'), a0 = s.count('acucar'), o0 = s.count('oleo'); s.P.sel = s.P.inv.findIndex(x => !x); s.moinhoBuilding('moinho1', s.W.farm.b.moinho1); return [s.count('farinha') - f0, s.count('acucar') - a0, s.count('oleo') - o0]; });
  ok(r2.join() === '10,12,2', 'no dia seguinte: 10 farinha, 12 açúcar (3 por beterraba) e 2 óleo ' + JSON.stringify(r2));
  ok(await ev(() => { const mo = __sv.W.farm.b.moinho1.mo; return !Object.values(mo.i || {}).some(Boolean) && !Object.values(mo.o || {}).some(Boolean); }), 'o moinho fica vazio depois de pegar');
  // sementes de beterraba no outono
  ok(await ev(() => { const s = __sv, d0 = s.W.meta.day; s.W.meta.day = 61; s.openShop('pedro'); const t = (document.querySelector('.win') || {}).innerText; s.W.meta.day = d0; return /Sementes de beterraba/.test(t); }), 'Seu Pedro vende semente de beterraba no outono');
  await closeAll();
  // escolher quanto colocar
  await ev(() => { __sv.addItem('trigo', 8, true); __sv.openMoinho('moinho1'); }); await p.waitForTimeout(200);
  const q0 = await ev(() => document.querySelector('.mq[data-mk="trigo"]').value);
  await ev(() => { const m = document.querySelector('[data-a="moQty"][data-k="trigo"][data-d="-1"]'); for (let i = 0; i < 5; i++) m.click(); }); await p.waitForTimeout(100);
  const q1 = await ev(() => document.querySelector('.mq[data-mk="trigo"]').value);
  await p.screenshot({ path: SHOTS + 'e21_quantia.png' });
  await ev(() => document.querySelector('[data-a="moPoe"][data-k="trigo"]').click()); await p.waitForTimeout(200);
  const r3 = await ev(() => ({ i: __sv.W.farm.b.moinho1.mo.i.trigo, sobra: __sv.count('trigo') }));
  ok(q0 === '8' && q1 === '3' && r3.i === 3 && r3.sobra === 5, `escolhe a quantia: começa em tudo (${q0}), baixa para ${q1}, põe ${r3.i} e sobram ${r3.sobra}`);
  await ev(() => { const i = document.querySelector('.mq[data-mk="trigo"]'); i.value = 99; document.querySelector('[data-a="moPoe"][data-k="trigo"]').click(); }); await p.waitForTimeout(200);
  ok(await ev(() => __sv.W.farm.b.moinho1.mo.i.trigo === 8 && __sv.count('trigo') === 0), 'digitar mais do que tem coloca só o que tem');
  await closeAll();
  // arrancar uma planta com a picareta (dois golpes)
  await ev(() => { const s = __sv, k = '20,30'; s.setTile(k, { s: 1, c: { id: 'trigo', g: 1 } }); s.goMap('farm', 20 * 16 + 8, 31 * 16 + 10, 0); }); await p.waitForTimeout(900);
  await ev(() => { const s = __sv; s.P.x = 20 * 16 + 8; s.P.y = 31 * 16 + 10; s.P.dir = 0; s.P.sel = s.P.inv.findIndex(i => i && i.id === 'pick'); s.act(); }); await p.waitForTimeout(700);
  const r1a = await ev(() => !!(__sv.tile('20,30') || {}).c);
  await ev(() => __sv.act()); await p.waitForTimeout(700);
  const r1b = await ev(() => { const t = __sv.tile('20,30'); return { c: !!(t && t.c), s: !!(t && t.s) }; });
  ok(r1a && !r1b.c && r1b.s, 'picareta: o 1º golpe avisa, o 2º arranca a planta e a terra continua preparada');
  console.log('erros', errs);
  await b.close();
})();
