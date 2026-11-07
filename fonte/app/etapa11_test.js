// Floresta (Mata do Vale), madeiras novas, bichos, guardiões, fogueira e energia de cortar/pescar (jogo local)
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
  const actN = async n => { for (let i = 0; i < n; i++) { await ev(() => __sv.act()); await p.waitForTimeout(270); } };
  await closeAll(); await p.waitForTimeout(1200);
  await ev(() => { const s = __sv; s.W.meta.day = 37; s.P.lastDay = 37; s.W.clock.min = 600; s.W.clock.at = Date.now(); s.W.meta.rain = false; s.earn(50000); });
  // a mata fica à direita da vila
  await ev(() => __sv.goMap('town', 77.5 * 16, 28 * 16 + 10, 3)); await p.waitForTimeout(600);
  await p.keyboard.down('ArrowRight'); await p.waitForTimeout(900); await p.keyboard.up('ArrowRight'); await p.waitForTimeout(700);
  ok(await ev(() => __sv.P.map) === 'mata', 'seguindo a rua da vila para a direita chega à Mata do Vale: ' + await ev(() => __sv.P.map));
  await ev(() => __sv.goMap('mata', 11.5 * 16, 11 * 16 + 8, 0)); await p.waitForTimeout(700); await clearToasts();
  await p.screenshot({ path: SHOTS + 'e11_entrada.png' });
  // fogueira: descansar e assar
  await ev(() => { const P = __sv.P; P.x = 16 * 16 + 8; P.y = 11 * 16 + 10; P.dir = 0; P.energy = 100; P.sel = 8; P.inv[8] = null; });
  const e0 = await ev(() => __sv.P.energy); await ev(() => __sv.act()); await p.waitForTimeout(250);
  ok(await ev(() => __sv.P.energy) - e0 === 20, 'descansar na fogueira dá +20 de energia (+40 com companhia): ' + await toasts());
  await ev(() => { const P = __sv.P; P.inv[8] = { id: 'cogumelo', n: 2 }; P.sel = 8; __sv.act(); });
  ok(await ev(() => __sv.P.inv.some(x => x && x.id === 'cogumeloassado')), 'assou um cogumelo na fogueira');
  // cabana do lenhador
  await ev(() => { const P = __sv.P; P.x = 5 * 16 + 8; P.y = 6 * 16 + 10; P.dir = 0; P.sel = 0; __sv.act(); }); await p.waitForTimeout(250);
  const cab = await ev(() => (document.querySelector('.win') || {}).innerText || '');
  ok(/Cabana do lenhador/.test(cab) && /Bosque/.test(cab) && /Javali Rei/.test(cab) && !/Mata Fechada\n/.test(cab), 'cabana do lenhador: atalho para as áreas e guardiões');
  await p.screenshot({ path: SHOTS + 'e11_cabana.png' }); await closeAll();
  // clareira 1
  await ev(() => { __sv.W.meta.day = 37; __sv.W.clock.day = 37; __sv.goMap('mata1', 0, 0, 0); }); await p.waitForTimeout(700);
  const c1 = await ev(() => { const m = __sv.getMap('mata1'), kinds = {}; for (const o of Object.values(m.wood)) kinds[o.kind] = (kinds[o.kind] || 0) + 1; return { map: __sv.P.map, kinds, mon: __sv.monstersArr.length, x: __sv.P.x, y: __sv.P.y, hp: !document.getElementById('hpBar').hidden }; });
  ok(c1.map === 'mata1' && c1.kinds.arvore > 5 && c1.kinds.galho > 0 && c1.mon === 0 && c1.hp, 'clareira 1 tem árvores, galhos e tocos, sem bichos: ' + JSON.stringify(c1.kinds));
  await clearToasts(); await p.waitForTimeout(300);
  await p.screenshot({ path: SHOTS + 'e11_clareira.png' });
  // cortar uma árvore: gasta 15% a mais e dá pinho
  const setup = await ev(() => { const s = __sv, m = s.getMap('mata1'), P = s.P; for (const [k, o] of Object.entries(m.wood)) { if (o.kind !== 'arvore' || s.mBroken(m).has(k)) continue; const [x, y] = k.split(',').map(Number); if (!m.wood[x + ',' + (y + 1)] && [0, 13].includes(m.at(x, y + 1))) { P.x = x * 16 + 8; P.y = (y + 1) * 16 + 10; P.dir = 0; P.sel = P.inv.findIndex(i => i && i.id === 'axe'); P.energy = 200; return { k, hp: o.hp }; } } return null; });
  ok(!!setup, 'achou uma árvore para cortar');
  const en0 = await ev(() => __sv.P.energy); await actN(1); const en1 = await ev(() => __sv.P.energy);
  ok(Math.abs((en0 - en1) - 2.3) < 0.01, 'cada machadada gasta 15% a mais (2 → 2,3): ' + (en0 - en1).toFixed(2));
  await actN(setup.hp + 1);
  const gotTree = await ev(() => ({ pinho: __sv.P.inv.some(x => x && x.id === 'mpinho'), trees: __sv.P.stats.trees, mad: __sv.P.inv.some(x => x && x.id === 'madeira') }));
  ok(gotTree.pinho && gotTree.mad && gotTree.trees === 1, 'árvore do Bosque deu madeira e madeira de pinho: ' + JSON.stringify(gotTree));
  // trilha escondida
  const tr = await ev(() => { const s = __sv, m = s.getMap('mata1'); for (const k of Object.keys(m.wood)) { if (m.trail) break; if (m.wood[k].kind !== 'forage' && m.wood[k].kind !== 'bau') s.breakMata(m, k, true); } return m.trail; });
  ok(!!tr, 'cortando, aparece a trilha escondida: ' + tr);
  await ev(t => { const [x, y] = t.split(',').map(Number), P = __sv.P; P.x = x * 16 + 8; P.y = (y + 1) * 16 + 10; P.dir = 0; P.sel = 0; }, tr);
  await clearToasts(); await p.waitForTimeout(200); await p.screenshot({ path: SHOTS + 'e11_trilha.png' });
  await ev(() => __sv.act()); await p.waitForTimeout(700);
  ok(await ev(() => __sv.P.map) === 'mata2', 'a trilha leva à clareira 2');
  // tronco antigo precisa de machado de ferro
  const anc = await ev(() => { const s = __sv; for (let n = 13; n < 24; n++) { const m = s.getMap('mata' + n); for (const [k, o] of Object.entries(m.wood)) if (o.kind === 'antigo') return { n, k }; } return null; });
  ok(!!anc, 'a Mata Fechada tem troncos antigos');
  await ev(a => __sv.goMap('mata' + a.n, 0, 0, 0), anc); await p.waitForTimeout(700);
  await ev(a => { const s = __sv, m = s.getMap('mata' + a.n), P = s.P, [x, y] = a.k.split(',').map(Number); s.monstersArr = []; m.wood[x + ',' + (y + 1)] = undefined; delete m.wood[x + ',' + (y + 1)]; P.x = x * 16 + 8; P.y = (y + 1) * 16 + 10; P.dir = 0; P.sel = P.inv.findIndex(i => i && i.id === 'axe'); P.inv[P.sel].lv = 0; }, anc);
  await clearToasts(); await actN(1);
  ok(/duro demais/.test(await toasts()), 'tronco antigo com machado simples: "duro demais"');
  await ev(() => { const P = __sv.P; P.inv[P.sel].lv = 2; P.energy = 270; }); await actN(8);
  ok(await ev(() => __sv.P.inv.some(x => x && x.id === 'madeiralei')), 'com machado de ferro, o tronco antigo dá madeira de lei');
  // bichos
  const mons = await ev(a => __sv.monstersArr.length, anc);
  await ev(() => __sv.goMap('mata20', 0, 0, 0)); await p.waitForTimeout(700);
  const m20 = await ev(() => __sv.monstersArr.map(m => m.kind));
  ok(m20.length >= 2 && m20.every(k => ['javali', 'cobra'].includes(k)), 'Mata Fechada tem javalis e cobras: ' + m20.join(','));
  await ev(() => { const mo = __sv.monstersArr[0]; mo.x = __sv.P.x + 30; mo.y = __sv.P.y - 4; }); await p.waitForTimeout(500);
  await clearToasts(); await p.screenshot({ path: SHOTS + 'e11_bichos.png' });
  await ev(() => { const s = __sv, mo = s.monstersArr[0]; mo.hp = 0; s.killMonster(mo); s.monstersArr = s.monstersArr.filter(x => !x.dead); });
  ok(await ev(() => __sv.monstersArr.length) === m20.length - 1, 'derrotou um bicho da mata');
  // Javali Rei na clareira 12
  await ev(() => __sv.goMap('mata12', 0, 0, 0)); await p.waitForTimeout(1300);
  const boss = await ev(() => { const b = __sv.monstersArr.find(x => x.kind === 'boss'); return b && b.name; });
  ok(boss === 'Javali Rei', 'clareira 12 tem o Javali Rei');
  await ev(() => { const b = __sv.monstersArr.find(x => x.kind === 'boss'); b.x = __sv.P.x + 40; b.y = __sv.P.y - 30; b.cd = 9; }); await p.waitForTimeout(400);
  ok(await ev(() => !document.getElementById('bossbar').hidden), 'barra de vida do guardião aparece');
  await clearToasts(); await p.screenshot({ path: SHOTS + 'e11_javalirei.png' });
  await ev(() => { const s = __sv, b = s.monstersArr.find(x => x.kind === 'boss'); b.hp = 0; s.killMonster(b); });
  const kb = await ev(() => ({ eq: __sv.P.inv.some(x => x && x.id === 'xadrezlenhador'), fb: __sv.W.meta.fbosses, trail: __sv.getMap('mata12').trail }));
  ok(kb.eq && kb.fb[12] && kb.trail, 'venceu o Javali Rei: camisa de lenhador e trilha liberada');
  // Árvore Anciã: só o machado corta
  await ev(() => __sv.goMap('mata48', 0, 0, 0)); await p.waitForTimeout(1300);
  await ev(() => { const s = __sv, P = s.P, b = s.monstersArr.find(x => x.kind === 'boss'); b.x = P.x; b.y = P.y - 22; b.cd = 99; P.dir = 0; P.hp = 100; P.sel = P.inv.findIndex(i => i && i.id === 'sword'); });
  const h0 = await ev(() => __sv.monstersArr.find(x => x.kind === 'boss').hp);
  await clearToasts(); await actN(1);
  const h1 = await ev(() => __sv.monstersArr.find(x => x.kind === 'boss').hp);
  ok(h1 === h0 && /nem arranha/.test(await toasts()), 'a espada nem arranha a Árvore Anciã');
  await ev(() => { const P = __sv.P; P.sel = P.inv.findIndex(i => i && i.id === 'axe'); }); await actN(1);
  ok(await ev(() => __sv.monstersArr.find(x => x.kind === 'boss').hp) < h0, 'o machado corta a Árvore Anciã');
  await ev(() => { const b = __sv.monstersArr.find(x => x.kind === 'boss'); b.cd = 0; }); await p.waitForTimeout(500);
  await clearToasts(); await p.screenshot({ path: SHOTS + 'e11_anciao.png' });
  await ev(() => { const s = __sv, b = s.monstersArr.find(x => x.kind === 'boss'); b.hp = 0; s.killMonster(b); });
  ok(await ev(() => __sv.P.inv.some(x => x && x.id === 'm_jabuticaba')) && /coração da floresta/.test(await toasts()), 'venceu a Árvore Anciã: muda de jabuticabeira');
  // árvore gigante: a parte de quem cortou junto
  const gi = await ev(() => { const s = __sv; for (let n = 3; n < 12; n += 3) { const m = s.getMap('mata' + n); for (const [k, o] of Object.entries(m.wood)) if (o.kind === 'gigante') { o.hit = 1; const before = s.P.inv.filter(Boolean).reduce((a, x) => a + (x.id === 'madeiralei' ? x.n : 0), 0); s.onMataMsg({ data: { p: m.per, n, k } }); const after = s.P.inv.filter(Boolean).reduce((a, x) => a + (x.id === 'madeiralei' ? x.n : 0), 0); return after - before; } } return -1; });
  ok(gi > 0 && /dividiram/.test(await toasts()), 'quando a outra pessoa derruba a gigante que você também cortava, você ganha a sua parte: +' + gi + ' madeira de lei');
  // insetos da floresta
  const pool = await ev(() => { const s = __sv; s.W.meta.day = 37; s.W.clock.day = 37; s.W.clock.min = 1250; s.W.clock.at = Date.now(); return s.bugPool(s.getMap('mata3')).map(x => x[0]).join(',') + ' [min ' + Math.round(s.nowMin()) + ', chuva ' + s.W.meta.rain + ', dia ' + s.W.meta.day + ']'; });
  ok(/vagalume/.test(pool) && /besouro/.test(pool) && Object.keys(await ev(() => __sv.BUGS)).length === 12, 'na floresta à noite: ' + pool + ' (12 insetos ao todo)');
  // chuva: cogumelo-rei no lugar de alguns coletáveis
  const rei = await ev(() => { const s = __sv; s.W.meta.rain = true; let n = 0; for (let c = 1; c < 12; c++) { const m = s.getMap('mata' + c); for (const [k, o] of Object.entries(m.wood)) if (o.kind === 'forage' && s.forageId(m, k, o) === 'cogumelorei') n++; } s.W.meta.rain = false; return n; });
  ok(rei > 0, 'na chuva aparecem cogumelos-rei na floresta: ' + rei);
  // salvar fora da clareira
  const doc = await ev(() => { __sv.P.map = 'mata7'; const d = __sv.playerDoc(); __sv.P.map = 'mata48'; return d.map; });
  ok(doc === 'mata', 'ao salvar numa clareira, volta para a entrada da mata');
  // machado: melhorar pede madeira da floresta
  await ev(() => __sv.goMap('town', 20 * 16, 20 * 16, 1)); await p.waitForTimeout(600);
  await ev(() => { const P = __sv.P, a = P.inv.find(i => i && i.id === 'axe'); a.lv = 0; __sv.openShop('claudio'); }); await p.click('[data-t="up"]'); await p.waitForTimeout(200);
  ok(/10 madeira de pinho/.test(await ev(() => document.querySelector('.win').innerText)), 'melhorar o machado pede madeira de pinho');
  await closeAll();
  // jabuticabeira não está à venda
  await ev(() => __sv.openShop('pedro'));
  ok(!/jabuticab/i.test(await ev(() => document.querySelector('.win').innerText)), 'a muda de jabuticabeira não está à venda');
  await closeAll();
  // pescar gasta 45% a mais
  const fishE = await ev(() => { const s = __sv, P = s.P, m = s.getMap('farm'); s.goMap('farm', 38 * 16 + 8, 24 * 16 + 12, 1); P.map = 'farm'; P.x = 38 * 16 + 8; P.y = 24 * 16 + 12; P.dir = 1; P.energy = 200; for (const k of ['38,25', '38,26']) if (s.tile(k)) s.setTile(k, null); s.startFishing(m); return 200 - P.energy; });
  ok(Math.abs(fishE - 4 * 1.17 * 1.45) < 0.01, 'lançar a linha gasta 45% a mais: ' + fishE.toFixed(2));
  // árvore normal dá 3 madeiras e pedra dá 1 pedra (na chacrinha)
  await p.waitForTimeout(600); await ev(() => { if (__sv.fishing) __sv.act(); }); await p.waitForTimeout(300);
  const yields = await ev(() => { const s = __sv, P = s.P; s.setTile('30,20', { o: { k: 'tree', hp: 1, v: 0 } }); s.setTile('31,20', { o: { k: 'rock', hp: 1, v: 0 } }); P.x = 30 * 16 + 8; P.y = 21 * 16 + 10; P.dir = 0; P.energy = 200; P.sel = P.inv.findIndex(i => i && i.id === 'axe'); const m0 = s.count('madeira'); s.act(); return { m: s.count('madeira') - m0 }; });
  await p.waitForTimeout(400);
  const rockY = await ev(() => { const s = __sv, P = s.P; P.x = 31 * 16 + 8; P.y = 21 * 16 + 10; P.dir = 0; P.sel = P.inv.findIndex(i => i && i.id === 'pick'); const p0 = s.count('pedra'); s.act(); return s.count('pedra') - p0; });
  ok(yields.m === 3 && rockY === 1, `árvore normal dá 3 madeiras (${yields.m}) e pedra dá 1 pedra (${rockY})`);
  // fogueira na chacrinha
  await p.waitForTimeout(600); await ev(() => { if (__sv.fishing) __sv.act(); }); await p.waitForTimeout(300);
  await ev(() => { const s = __sv, P = s.P; s.setTile('30,22', { o: { k: 'fogueira' } }); P.x = 30 * 16 + 8; P.y = 23 * 16 + 10; P.dir = 0; P.sel = 8; P.inv[8] = null; P.energy = 100; s.W.clock.min = 1260; s.W.clock.at = Date.now(); });
  await ev(() => __sv.act()); await p.waitForTimeout(400);
  ok(await ev(() => __sv.P.energy) > 100, 'fogueira feita na chacrinha também aquece');
  await clearToasts(); await p.waitForTimeout(300); await p.screenshot({ path: SHOTS + 'e11_fogueira.png' });
  console.log('erros', errs);
  await b.close();
})();
