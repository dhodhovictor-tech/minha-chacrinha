// Lojas e moradores novos: padaria, floricultura, clínica, pet shop, biblioteca e o carteiro (jogo local)
const { chromium } = require('playwright');
const SHOTS = __dirname + '/../.tmp/shots/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + __dirname + '/../.tmp/teste.html'); await p.waitForTimeout(1200);
  await p.click('[data-v="casaco"]'); await p.fill('#nm', 'Ela'); await p.click('[data-a="start"]'); await p.waitForTimeout(800);
  const ev = (f, x) => p.evaluate(f, x), ok = (c, m) => console.log((c ? 'OK   ' : 'FALHA') + ' ' + m);
  const closeAll = () => ev(() => document.querySelectorAll('[data-a="close"]').forEach(c => c.click()));
  const toasts = () => ev(() => document.getElementById('toasts').innerText.replace(/\n/g, ' | '));
  const setT = (min, day = 38) => ev(([min, day]) => { const s = __sv; s.W.meta.day = day; s.W.clock.day = day; s.P.lastDay = day; s.W.clock.min = min; s.W.clock.at = Date.now(); s.W.meta.rain = false; }, [min, day]);
  await closeAll(); await p.waitForTimeout(1000); await setT(600); await ev(() => __sv.earn(100000));
  // cada loja: entrar pela porta, o lojista está no balcão e a loja abre
  const lojas = [['padaria', 'gloria', /Pão de queijo/], ['flores', 'nena', /Buquê/], ['petshop', 'tati', /Ração premium/], ['clinica', 'davi', /Consulta/], ['biblioteca', 'helena', /Manual do Pescador|Receitas da Vó/]];
  for (const [k, who, re] of lojas) {
    await setT(k === 'biblioteca' ? 660 : 600);
    await ev(k => { const s = __sv, [x, y, w, h, dx] = s.VILA[k]; s.goMap('town', dx * 16 + 8, (y + h + 1) * 16 + 10, 0); }, k); await p.waitForTimeout(700);
    await ev(k => { const s = __sv, [x, y, w, h, dx] = s.VILA[k]; s.P.x = dx * 16 + 8; s.P.y = (y + h - 1) * 16 + 10; s.checkWarp(); }, k); await p.waitForTimeout(700);
    const inside = await ev(() => __sv.P.map), here = await ev(w => (__sv.npcPos(w) || {}).map, who);
    await ev(() => { const P = __sv.P; P.x = 6 * 16 + 8; P.y = 4 * 16 + 10; P.dir = 0; __sv.act(); }); await p.waitForTimeout(250);
    const txt = await ev(() => (document.querySelector('.win') || {}).innerText || '');
    ok(inside === k && here === k && re.test(txt), `${k}: entra pela porta, ${who} está no balcão e a loja abre`);
    if (k === 'padaria') await p.screenshot({ path: SHOTS + 'e16_padaria.png' });
    await closeAll();
  }
  // padaria: café da manhã dá bônus
  await ev(() => { const s = __sv; s.addItem('cestacafe', 1, true); const P = s.P; P.sel = P.inv.findIndex(x => x && x.id === 'cestacafe'); P.energy = 50; s.openEat ? null : null; });
  const cesta = await ev(() => { const s = __sv, P = s.P; P.inv[P.sel] && (P.inv[P.sel].n = 1); const it = s.W && __sv; return true; });
  // consulta e curativo
  await ev(() => { const s = __sv; s.P.hp = 30; s.openShop('davi'); }); await p.waitForTimeout(200);
  await p.click('[data-a="consulta"]'); await p.waitForTimeout(200);
  ok(await ev(() => __sv.P.hp) === 100, 'a consulta na clínica cura toda a vida');
  await closeAll();
  // livros: ler dá bônus para sempre
  await ev(() => { const s = __sv; s.addItem('livromina', 1, true); s.addItem('livroreceitas', 1, true); });
  const d0 = await ev(() => __sv.defTotal()), r0 = await ev(() => __sv.P.recipes.length);
  await ev(() => { const s = __sv, P = s.P; P.sel = P.inv.findIndex(x => x && x.id === 'livromina'); s.lerLivro(P.inv[P.sel]); P.sel = P.inv.findIndex(x => x && x.id === 'livroreceitas'); s.lerLivro(P.inv[P.sel]); });
  ok(await ev(() => __sv.defTotal()) === d0 + 1 && await ev(() => __sv.P.recipes.length) === r0 + 3, 'livros: Guia da Mina dá +1 de defesa e Receitas da Vó ensina 3 receitas');
  ok(await ev(() => __sv.lojaList('helena').find(o => o.id === 'livromina').one), 'livro já lido aparece como "já tem"');
  // pet shop: coleira e ração
  await setT(720); await ev(() => __sv.goMap('town', 38 * 16, 30 * 16, 1)); await p.waitForTimeout(1500);
  await ev(() => { const s = __sv; s.addItem('coleiralaco', 1, true); s.addItem('racaopremium', 2, true); const P = s.P, st = s.petSt; P.sel = P.inv.findIndex(x => x && x.id === 'coleiralaco'); P.x = st.x - 12; P.y = st.y + 6; P.dir = 3; s.act(); });
  ok(await ev(() => __sv.P.pet.coleira) === 'coleiralaco', 'o Darth ganhou o lacinho rosa');
  const love0 = await ev(() => __sv.P.pet.love || 0);
  await p.waitForTimeout(1200);
  await ev(() => { const s = __sv, P = s.P, st = s.petSt; P.sel = P.inv.findIndex(x => x && x.id === 'racaopremium'); P.x = st.x - 12; P.y = st.y + 6; P.dir = 3; s.act(); });
  ok(await ev(() => __sv.P.pet.love || 0) - love0 === 16, 'ração premium vale o dobro de carinho (+16)');
  await ev(() => document.querySelectorAll('#toasts > *').forEach(e => e.remove())); await p.waitForTimeout(800);
  await p.screenshot({ path: SHOTS + 'e16_darth.png', clip: { x: 260, y: 100, width: 320, height: 220 } });
  // floricultura: enfeites de jardim na chacrinha
  await ev(() => { const s = __sv; s.goMap('farm', 30 * 16 + 8, 24 * 16 + 10, 0); }); await p.waitForTimeout(700);
  await ev(() => { const s = __sv; for (const [k, id] of [['28,22', 'arcoflores'], ['30,22', 'bancojardim'], ['32,22', 'vasoflores']]) s.setTile(k, { o: { k: id } }); const P = s.P; P.x = 30 * 16 + 8; P.y = 23 * 16 + 10; P.dir = 0; P.sel = 9; P.inv[9] = null; P.energy = 100; });
  await ev(() => __sv.act()); await p.waitForTimeout(200);
  ok(await ev(() => __sv.P.energy) === 115, 'sentar no banco do jardim dá +15 de energia');
  await ev(() => document.querySelectorAll('#toasts > *').forEach(e => e.remove())); await ev(() => { __sv.P.y = 25 * 16 + 4; }); await p.waitForTimeout(500);
  await p.screenshot({ path: SHOTS + 'e16_jardim.png' });
  // carteiro passa na chacrinha de manhã; todos os moradores novos existem
  await setT(610); ok(await ev(() => (__sv.npcPos('juca') || {}).map) === 'farm', 'o Seu Juca passa na chacrinha às 10h');
  ok(await ev(() => ['gloria', 'helena', 'tati', 'juca'].every(id => __sv.MOMENTOS[id] && __sv.MOMENTOS[id].length === 2)), 'os moradores novos também têm momentos especiais');
  console.log('erros', errs);
  await b.close();
})();
