// Vida na vila: bichos, pombos, pasto, varais, feira de sábado, mercador viajante e pedidos da semana (jogo local)
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
  const setT = (min, day = 38) => ev(([min, day]) => { const s = __sv; s.W.meta.day = day; s.W.clock.day = day; s.P.lastDay = day; s.W.clock.min = min; s.W.clock.at = Date.now(); s.W.meta.rain = false; }, [min, day]);
  await closeAll(); await p.waitForTimeout(1000); await setT(600); await ev(() => __sv.earn(100000));
  // pasto com bichos e o gato da praça
  await ev(() => __sv.goMap('town', 20 * 16, 39 * 16 + 10, 0)); await p.waitForTimeout(1500); await clearToasts();
  ok(await ev(() => Object.keys(__sv.bichoSt).length) >= 6, 'bichos da vila passeando (gatos, cachorro, vacas e ovelha)');
  await p.screenshot({ path: SHOTS + 'e17_pasto.png' });
  const carinho = await ev(() => { const s = __sv, b = s.bichoSt.mingau; s.goMap('town', b.x - 12, b.y + 6, 3); return true; }); await p.waitForTimeout(700);
  await ev(() => { const s = __sv, b = s.bichoSt.mingau; b.mv = 0; b.wait = 99; s.P.x = b.x - 12; s.P.y = b.y + 6; s.P.dir = 3; s.act(); });
  ok(/Mingau/.test(await ev(() => document.getElementById('toasts').innerText)), 'dá para fazer carinho no gato Mingau da praça');
  // pombos voam quando alguém chega correndo
  await ev(() => { const s = __sv, pb = s.POMBOS[0]; s.P.x = pb.x + 40; s.P.y = pb.y; }); await p.waitForTimeout(200);
  await p.keyboard.down('ArrowLeft'); await p.waitForTimeout(600); await p.keyboard.up('ArrowLeft');
  ok(await ev(() => __sv.POMBOS.some(p => p.voo > 0 || p.volta > 0)), 'os pombos voam quando alguém passa correndo');
  // feira de sábado
  await setT(600, 41);
  ok(await ev(() => __sv.feiraAberta()), 'sábado de manhã tem feira na praça');
  await ev(() => __sv.goMap('town', 33 * 16 + 8, 27 * 16 + 10, 0)); await p.waitForTimeout(800);
  await ev(() => { const P = __sv.P; P.x = 33 * 16 + 8; P.y = 27 * 16 + 10; P.dir = 0; __sv.act(); }); await p.waitForTimeout(250);
  const feira = await ev(() => (document.querySelector('.win') || {}).innerText || '');
  ok(/Sementes de outras estações/.test(feira) && /Sementes de/.test(feira), 'a barraca do Seu Bento vende sementes de outras estações');
  await closeAll(); await clearToasts(); await ev(() => { __sv.P.y = 28 * 16 + 4; }); await p.waitForTimeout(400);
  await p.screenshot({ path: SHOTS + 'e17_feira.png' });
  await setT(600, 40); ok(!(await ev(() => __sv.feiraAberta())), 'na sexta não tem feira');
  // mercador viajante
  const dia = await ev(() => { const s = __sv; for (let d = 30; d < 90; d++) { s.W.meta.day = d; s.W.clock.min = 700; s.W.clock.at = Date.now(); if (s.mercadorHoje()) return d; } return 0; });
  ok(dia > 0, 'o mercador viajante aparece em alguns dias: dia ' + dia);
  await setT(700, dia);
  await ev(() => __sv.goMap('town', 72 * 16 + 8, 27 * 16 + 10, 0)); await p.waitForTimeout(800);
  await ev(() => { const P = __sv.P; P.x = 72 * 16 + 8; P.y = 27 * 16 + 10; P.dir = 0; __sv.act(); }); await p.waitForTimeout(250);
  ok(/mercador viajante/i.test(await ev(() => (document.querySelector('.win') || {}).innerText || '')) && await ev(() => __sv.mercList().length) === 6, 'a carroça do mercador abre com 6 raridades do dia');
  await closeAll(); await clearToasts(); await p.waitForTimeout(300);
  await p.screenshot({ path: SHOTS + 'e17_mercador.png' });
  // pedidos da semana, com o pedido em dupla (no dia guardado no banco)
  await setT(700, 1);
  await ev(() => { const s = __sv; s.W.players.uB = { uid: 'uB', name: 'Victor', look: {}, stats: {} }; const L = s.pedidosDaSemana(); window.__L0 = JSON.stringify([s.W.meta.day, L.map(x => x.id)]); for (const p of L) s.addItem(p.id, p.n + 5, true); s.openBoard(); });
  await p.waitForTimeout(200);
  const quadro = await ev(() => document.querySelector('.win').innerText);
  ok(/Pedidos da semana/.test(quadro) && /em dupla/.test(quadro), 'o quadro tem os pedidos da semana e um em dupla');
  await p.screenshot({ path: SHOTS + 'e17_quadro.png' });
  const g0 = await ev(() => __sv.gold());
  await ev(() => __sv.pedEntregar(0)); await p.waitForTimeout(150);
  ok(await ev(() => __sv.gold()) > g0, 'entregou um pedido e ganhou o prêmio');
  await ev(() => __sv.pedEntregar(3)); await p.waitForTimeout(150);
  const dupla = await ev(() => { const st = __sv.W.meta.pedidos, L = __sv.pedidosDaSemana(); return { got: st.got[3], n: L[3].n }; });
  ok(dupla.got === dupla.n - 1, `no pedido em dupla, sozinho chega a ${dupla.got}/${dupla.n}: falta a outra pessoa`);
  await ev(() => { const s = __sv, st = s.W.meta.pedidos; st.by[3] = { ...st.by[3], uB: 1 }; s.pedEntregar(3); }); await p.waitForTimeout(150);
  ok(await ev(() => __sv.W.meta.pedidos.got[3] === __sv.pedidosDaSemana()[3].n), 'com a outra pessoa ajudando, o pedido em dupla fecha');
  await closeAll();
  // varais e chaminés no bairro das casas
  await ev(() => __sv.goMap('town', 62 * 16, 45 * 16, 0)); await p.waitForTimeout(900); await clearToasts();
  await p.screenshot({ path: SHOTS + 'e17_casas.png' });
  console.log('erros', errs);
  await b.close();
})();
