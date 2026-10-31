// Etapa 4: festivais das estações (jogo local, sem servidor)
const { chromium } = require('playwright');
const SHOTS = __dirname + '/../.tmp/shots/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('file://' + __dirname + '/../.tmp/teste.html'); await p.waitForTimeout(1200);
  await p.click('[data-v="xadrez"]'); await p.fill('#nm', 'Eu'); await p.click('[data-a="start"]'); await p.waitForTimeout(800);
  const ev = (f, x) => p.evaluate(f, x);
  const ok = (c, m) => console.log((c ? 'OK   ' : 'FALHA') + ' ' + m);
  const closeAll = () => ev(() => document.querySelectorAll('[data-a="close"]').forEach(c => c.click()));
  const clearToasts = () => ev(() => document.querySelectorAll('#toasts > *').forEach(e => e.remove()));
  await closeAll();
  const setDay = d => ev(d => { const s = __sv; s.W.meta.day = d; s.P.lastDay = d; s.W.clock.day = d; s.W.clock.min = 600; s.W.clock.at = Date.now(); }, d);
  const toBooth = async () => { await ev(() => __sv.goMap('town', 19.5 * 16, 15 * 16 + 12, 0)); await p.waitForTimeout(700); await ev(() => { const P = __sv.P; P.x = 19.5 * 16; P.y = 15 * 16 + 12; P.dir = 0; __sv.act(); }); await p.waitForTimeout(300); };
  // calendário
  ok(await ev(() => !__sv.festOn(1) && __sv.festOn(13).id === 'ovo' && __sv.festOn(24).id === 'flores' && __sv.festOn(39).id === 'luau' && __sv.festOn(72).id === 'feira' && __sv.festOn(83).id === 'espiritos' && __sv.festOn(92).id === 'gelo' && __sv.festOn(109).id === 'estrela'), 'datas dos festivais certas');
  // 1) Festa do Ovo
  await setDay(13); await toBooth();
  ok(/Festa do Ovo/.test(await ev(() => (document.querySelector('.win') || {}).innerText || '')), 'barraca da Dona Cida abre a Festa do Ovo');
  await p.click('[data-a="festGo"]'); await p.waitForTimeout(300);
  ok(await ev(() => __sv.festRun && __sv.festRun.eggs.length >= 20), 'ovos espalhados pela vila: ' + await ev(() => __sv.festRun && __sv.festRun.eggs.length));
  await clearToasts();
  await ev(() => { const e = __sv.festRun.eggs.slice(0, 1)[0]; const P = __sv.P; P.x = e.x * 16 + 30; P.y = e.y * 16 + 10; });
  await p.waitForTimeout(400);
  await p.screenshot({ path: SHOTS + 'e4_eggs.png' });
  for (const k of [0, 1, 2, 3, 4]) { await ev(k => { const e = __sv.festRun.eggs[k]; const P = __sv.P; P.x = e.x * 16 + 8; P.y = e.y * 16 + 10; }, k); await p.waitForTimeout(120); }
  const g0 = await ev(() => __sv.gold());
  await ev(() => { __sv.festRun.t = 0.05; }); await p.waitForTimeout(400);
  const egg = await ev(() => ({ mine: __sv.W.meta.fest[13][__sv.P.uid], run: !!__sv.festRun, gold: __sv.gold() }));
  ok(!egg.run && egg.mine && egg.mine.n >= 5 && egg.gold > g0, `caça terminou: ${egg.mine && egg.mine.n} ovos, +${egg.gold - g0} ₲`);
  // 2) Dança das Flores
  await setDay(24); await ev(() => { __sv.W.players.uB = { uid: 'uB', name: 'Ela', look: __sv.PRESETS().casaco }; }); await toBooth();
  await p.click('[data-a="festGo"]'); await p.waitForTimeout(1500);
  await p.screenshot({ path: SHOTS + 'e4_dance.png' });
  ok(await ev(() => !!document.getElementById('dancecv') && __sv.P.buff && __sv.P.buff.name === 'Dança das Flores'), 'dançaram juntinhos e ganhou o bônus do dia');
  await closeAll();
  // 3) Luau
  await setDay(39); await ev(() => { __sv.addItem('melao', 1, true, 2); }); await toBooth();
  const rel0 = await ev(() => (__sv.P.rel.pedro || { pts: 0 }).pts);
  await ev(() => { const b = [...document.querySelectorAll('[data-a="festSoup"]')].find(x => /Melão/.test(x.parentElement.innerText)); b.click(); });
  await p.waitForTimeout(300);
  ok(await ev(() => __sv.W.meta.fest[39][__sv.P.uid].id === 'melao') && (await ev(() => __sv.P.rel.pedro.pts)) > rel0, 'melão de ouro na sopa: a vila gostou');
  await closeAll();
  // 4) Águas-vivas
  await setDay(56); await ev(() => { __sv.W.clock.min = 1260; __sv.W.clock.at = Date.now(); const m = __sv.getMap('beach'); let wy = 0; for (let y = 0; y < m.h; y++) if (m.at(18, y) === 2) { wy = y; break; } __sv.goMap('beach', 18 * 16, (wy - 2) * 16, 1); });
  await p.waitForTimeout(1200); await clearToasts();
  await p.screenshot({ path: SHOTS + 'e4_jellies.png' });
  // 5) Feira
  await setDay(72); await ev(() => { const s = __sv; s.W.clock.min = 600; s.W.clock.at = Date.now(); for (const [id, q] of [['melao', 2], ['abobora', 1], ['sardinha', 2], ['queijo', 0], ['ametista', 0]]) s.addItem(id, 1, true, q); });
  await toBooth();
  for (let k = 0; k < 5; k++) { await p.click(`[data-a="festPick"] >> nth=${k}`); await p.waitForTimeout(120); }
  await p.click('[data-a="festShow"]'); await p.waitForTimeout(300);
  ok(/lugar|participação/.test(await ev(() => (__sv.W.meta.fest[72][__sv.P.uid] || {}).place || '')), 'exposição avaliada: ' + await ev(() => JSON.stringify(__sv.W.meta.fest[72][__sv.P.uid])));
  const gs = await ev(() => __sv.gold()); await p.click('[data-a="festSpin"][data-v="100"]'); await p.waitForTimeout(200);
  ok(Math.abs((await ev(() => __sv.gold())) - gs) === 100, 'roda da sorte girou (±100 ₲)');
  await closeAll();
  // 6) Noite dos Espíritos
  await setDay(83); await ev(() => { __sv.W.clock.min = 1290; __sv.W.clock.at = Date.now(); }); await toBooth();
  await p.click('[data-a="festGo"]'); await p.waitForTimeout(1000); await clearToasts();
  ok(await ev(() => __sv.P.map === 'maze'), 'entrou no labirinto');
  await p.screenshot({ path: SHOTS + 'e4_maze.png' });
  await ev(() => { const m = __sv.getMap('maze'), P = __sv.P; P.x = m.gold[0] * 16 + 8; P.y = m.gold[1] * 16 + 12; });
  await p.waitForTimeout(400);
  ok(await ev(() => __sv.count('aboboradourada')) === 1, 'achou a abóbora dourada');
  // 7) Festival do Gelo
  await setDay(92); await ev(() => { __sv.W.clock.min = 600; __sv.W.clock.at = Date.now(); }); await toBooth();
  await p.click('[data-a="festGo"]'); await p.waitForTimeout(500);
  ok(await ev(() => !!__sv.fishing && __sv.fishing.ice), 'pescaria no gelo começou');
  for (let k = 0; k < 3; k++) { await ev(() => { const f = __sv.fishing; if (f) { f.barH = 118; f.bar = 1; f.prog = 0.99; f.hold = true; } }); await p.waitForTimeout(500); }
  await clearToasts(); await p.screenshot({ path: SHOTS + 'e4_ice.png' });
  await ev(() => { __sv.festRun.t = 0.05; }); await p.waitForTimeout(400);
  const ice = await ev(() => __sv.W.meta.fest[92][__sv.P.uid]);
  ok(ice && ice.n >= 2, 'pescaria no gelo contou os peixes: ' + JSON.stringify(ice));
  // 8) Estrela de Inverno
  await setDay(109); await ev(() => { __sv.addItem('diamante', 1, true); }); await toBooth();
  await ev(() => { const b = [...document.querySelectorAll('[data-a="festGift"]')].find(x => /Diamante/.test(x.parentElement.innerText)); b.click(); });
  await p.waitForTimeout(300);
  ok(await ev(() => __sv.W.meta.gifts.uB && __sv.W.meta.gifts.uB.id === 'diamante'), 'presente do amigo secreto guardado para a outra pessoa');
  await ev(() => { const s = __sv; s.W.meta.gifts[s.P.uid] = { id: 'tortaabobora', n: 1, from: 'Ela', day: 109 }; s.deliverGifts(); });
  ok(await ev(() => __sv.P.mail.some(m => /Amigo secreto/.test(m.text) && m.items && m.items[0][0] === 'tortaabobora')), 'presente recebido chega como carta');
  await closeAll();
  // calendário no quadro da vila
  await p.waitForTimeout(300); await closeAll(); await p.waitForTimeout(200);
  await setDay(109);
  const cal = await ev(() => { __sv.openBoard(); return document.querySelector('.win').innerText; });
  ok(/Estrela de Inverno/.test(cal), 'quadro da vila mostra o festival no calendário' + (/Estrela de Inverno/.test(cal) ? '' : ': ' + cal.slice(0, 120).replace(/\n/g, ' ')));
  console.log('erros', errs);
  await b.close();
})();
