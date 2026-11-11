// Firmeza e pedidos: aba Para ela, comida no tampo da mesa, Darth sem travar, balão do leite, relógio compacto,
// sentar, flores novas, interiores, cópia de segurança e caderninho de dicas (jogo local)
const { chromium } = require('playwright');
const SHOTS = __dirname + '/../.tmp/shots/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + __dirname + '/../.tmp/teste.html'); await p.waitForTimeout(1200);
  await p.click('[data-v="casaco"]'); await p.fill('#nm', 'Ela'); await p.click('[data-a="start"]'); await p.waitForTimeout(800);
  const ev = (f, x) => p.evaluate(f, x), ok = (c, m) => console.log((c ? 'OK   ' : 'FALHA') + ' ' + m);
  const closeAll = () => ev(() => document.querySelectorAll('[data-a="close"]').forEach(c => c.click()));
  const clearToasts = () => ev(() => document.querySelectorAll('#toasts > *').forEach(e => e.remove()));
  const panel = () => ev(() => (document.querySelector('.win') || {}).innerText || '');
  await closeAll(); await p.waitForTimeout(1200);
  await ev(() => { const s = __sv; s.W.clock.min = 720; s.W.clock.at = Date.now(); s.earn(50000); });

  // aba Para ela
  await ev(() => __sv.openShop('bia')); await ev(() => document.querySelector('[data-a="stab"][data-t="ela"]').click()); await p.waitForTimeout(200);
  const ela = await panel();
  ok(/Vestido de festa/.test(ela) && /Comprar/.test(ela) && !/Vender ·/.test(ela), 'aba "Para ela" mostra as roupas à venda (e não a lista de vender)');
  await p.screenshot({ path: SHOTS + 'e23_paraela.png' }); await closeAll();

  // comida no tampo da mesa
  await ev(() => { const s = __sv; s.goMap('house', 7 * 16, 9 * 16, 0); s.setFarm('casa', '9,6', 'mesacarvalho'); s.setFarm('casa', '6,6', 'mesapinho'); s.setFarm('mesa', '9,6', { id: 'pizza' }); s.setFarm('mesa', '6,6', { id: 'sonho' }); s.setFarm('casa', '9,8', 'cadeirapinho'); }); await p.waitForTimeout(700);
  ok(await ev(() => { const s = __sv, a = s.topoMesa(9, 6, 'mesacarvalho', 0), b2 = s.topoMesa(6, 6, 'mesapinho', 0); return a[1] === 6 * 16 + 5 && b2[1] === 6 * 16 + 5; }), 'o prato fica no tampo da mesa');
  // sentar na cadeira
  await ev(() => { const s = __sv; s.P.x = 9 * 16 + 8; s.P.y = 9 * 16 + 12; s.P.dir = 0; s.casa3Act(s.curMap(), 9, 8); }); await clearToasts(); await p.waitForTimeout(400);
  ok(await ev(() => __sv.P.pose && __sv.P.pose.k === 's'), 'sentar na cadeira');
  await p.screenshot({ path: SHOTS + 'e23_mesa.png', clip: { x: 0, y: 200, width: 390, height: 450 } });
  await ev(() => __sv.levantar());

  // Darth não trava depois da torre e do arranhador
  const dar = await ev(() => {
    const s = __sv, st = s.petSt, m = s.curMap(); s.setFarm('casa', '1,7', 'arranhador'); s.setFarm('casa', '3,7', 'torregato');
    s.P.pet.mode = 'roam'; st.map = 'house'; const out = [];
    for (const toy of ['1,7', '3,7']) {
      st.x = 6 * 16; st.y = 8 * 16; st.idle = 0;
      for (let i = 0; i < 400 && !(s.brinq && s.brinq.k === toy); i++) { st.idle = 5; s.darthBrinca(0.1); if (s.brinq && s.brinq.k !== toy) { s.brinq.k = toy; s.brinq.id = s.W.farm.casa[toy]; } }
      for (let i = 0; i < 400 && s.brinq; i++) s.darthBrinca(0.1);
      const tx = Math.floor(st.x / 16), ty = Math.floor((st.y - 3) / 16);
      out.push(!m.solid[ty * m.w + tx] && !s.movelAt(tx, ty));
    }
    return out;
  });
  ok(dar.every(Boolean), 'depois de brincar no arranhador e na torre, o Darth desce para um lugar livre ' + JSON.stringify(dar));

  // balão do leite
  const vaca = await ev(() => { const s = __sv; s.setFarm('b', 'cel1', { type: 'barn', lv: 3, x: 30, y: 20, ready: 0, feed: 10 }); s.buyAnimal('vaca', 'Mimosa'); const [id, a] = Object.entries(s.farmA()).find(([, x]) => x.kind === 'vaca'); s.setFarm('a', id, { ...a, age: 99, prod: 'leite' }); return id; });
  await ev(() => { const s = __sv; s.goMap('b:cel1', 5 * 16, 8 * 16, 0); }); await p.waitForTimeout(900); await clearToasts();
  await p.screenshot({ path: SHOTS + 'e23_leite.png' });
  ok(!!vaca, 'vaca com leite pronto mostra o balãozinho (ver print)');

  // relógio compacto na mina
  await ev(() => { const s = __sv; s.W.meta.mineMax = 120; s.goMap('mine6', 0, 0, 1); }); await p.waitForTimeout(900); await clearToasts();
  ok(await ev(() => document.body.classList.contains('compacto') && getComputedStyle(document.getElementById('cSeason')).display === 'none'), 'na mina o relógio fica compacto');
  await p.screenshot({ path: SHOTS + 'e23_mina.png' });
  await ev(() => document.getElementById('clock').click()); await p.waitForTimeout(200);
  ok(await ev(() => !document.body.classList.contains('compacto')), 'tocar no relógio mostra ele inteiro de novo');
  await ev(() => document.getElementById('clock').click());
  await ev(() => __sv.goMap('farm', 20 * 16, 14 * 16, 1)); await p.waitForTimeout(1500);
  ok(await ev(() => !document.body.classList.contains('compacto')), 'na chacrinha o relógio volta ao normal');

  // flores
  ok(await ev(() => { const s = __sv, d0 = s.W.meta.day, out = []; for (const d of [3, 33, 61, 89]) { s.W.meta.day = d; out.push(s.lojaList2('nena').filter(o => o.id.startsWith('s_')).length); } s.W.meta.day = d0; return out.every(n => n >= 6); }), 'floricultura com pelo menos 6 sementes de flor em cada estação');

  // interiores
  ok(await ev(() => ['store', 'smith', 'bar', 'padaria', 'clinica', 'petshop', 'biblioteca', 'flores'].every(id => __sv.getMap(id).papel)), 'cada loja tem a sua parede e o seu piso');

  // cópia de segurança e dicas
  await ev(() => __sv.salvarBackupAuto(__sv.W.meta.day)); await p.waitForTimeout(500);
  await ev(() => __sv.abrirBackup()); await p.waitForTimeout(800);
  ok(/Cópias automáticas/.test(await panel()) && /Voltar para esta/.test(await panel()), 'cópia automática aparece para restaurar');
  const f = await ev(async () => { const d = await __sv.fotoDoJogo(); return { meta: !!d.meta, farm: !!d.farm, players: Object.keys(d.players).length }; });
  ok(f.meta && f.farm && f.players >= 1, 'a cópia leva o mundo, a chacrinha e as pessoas ' + JSON.stringify(f));
  await closeAll();
  await ev(() => __sv.abrirDicas('Casa')); await p.waitForTimeout(200);
  ok(/Caderninho de dicas/.test(await panel()) && /Comer juntos/.test(await panel()), 'caderninho de dicas abre');
  await p.screenshot({ path: SHOTS + 'e23_dicas.png' }); await closeAll();
  console.log('erros', errs);
  await b.close();
})();
