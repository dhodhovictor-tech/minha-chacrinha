// Casa por dentro (reforma, paredes, piso, mover móveis, estante), aquário, lendários de novo e clima com eventos (jogo local)
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
  const panel = () => ev(() => (document.querySelector('.win') || {}).innerText || '');
  const act = (a, ds) => ev(([a, ds]) => __sv.casa2Action(a, { dataset: ds }), [a, ds]);
  await closeAll(); await p.waitForTimeout(1200);
  await ev(() => { const s = __sv; s.W.clock.min = 720; s.W.clock.at = Date.now(); s.earn(200000); for (const [k, n] of [['madeira', 400], ['mpinho', 200], ['mcarvalho', 300], ['mipe', 200], ['madeiralei', 60], ['pedra', 300], ['barraferro', 20], ['barraouro', 10], ['quartzo', 60], ['carvao', 30], ['fibra', 100], ['tecido', 5]]) s.addItem(k, n, true); });

  // ---------- decoração antiga virou móvel ----------
  await ev(() => __sv.goMap('house', 6 * 16 + 8, 6 * 16 + 8, 1)); await p.waitForTimeout(700);
  const casa = await ev(() => __sv.W.farm.casa);
  ok(casa['5,2'] === 'tvcasa' && casa['8,2'] === 'plantacasa' && casa['1,8'] === 'plantacasa' && casa['11,5'] === 'mesacozinha', 'TV, plantas e mesa da cozinha viraram móveis');
  // ---------- mover ----------
  await ev(() => __sv.movStart('5,2')); await p.waitForTimeout(200);
  ok(await ev(() => !!__sv.placing2 && __sv.placing2.casa === '5,2'), 'Mover a TV entra no modo de mudar de lugar');
  const bloq = await ev(() => { const s = __sv; s.placing2.x = 11; s.placing2.y = 5; s.confirmMovMovel(); return !!s.placing2 && s.W.farm.casa['5,2'] === 'tvcasa'; });
  ok(bloq, 'não deixa pôr em cima da mesa');
  await ev(() => { const s = __sv; s.placing2.x = 12; s.placing2.y = 8; }); await p.waitForTimeout(300);
  await p.screenshot({ path: SHOTS + 'e20_movendo.png' });
  await ev(() => __sv.confirmMovMovel()); await p.waitForTimeout(200);
  ok(await ev(() => __sv.W.farm.casa['12,8'] === 'tvcasa' && !__sv.W.farm.casa['5,2']), 'a TV mudou de lugar');
  // ---------- papel de parede e piso ----------
  await ev(() => __sv.openShop('tonico')); await ev(() => document.querySelector('[data-a="stab"][data-t="estilo"]').click()); await p.waitForTimeout(200);
  ok(/Papel de parede/.test(await panel()) && /Taco espinha de peixe/.test(await panel()), 'Marcenaria tem a aba Paredes e piso');
  await act('casaEstilo', { t: 'papel', id: 'floral' }); await act('casaEstilo', { t: 'piso', id: 'taco' });
  ok(await ev(() => { const e = __sv.W.farm.estilo; return e.papel === 'floral' && e.piso === 'taco' && e.tem['papel:floral'] && /floral\|taco/.test(__sv.getMap('house').gkey); }), 'trocou o papel de parede e o piso');
  const g0 = await ev(() => __sv.gold()); await act('casaEstilo', { t: 'papel', id: 'rosa' }); await act('casaEstilo', { t: 'papel', id: 'floral' });
  ok(await ev(g0 => g0 - __sv.gold() === 1500, g0), 'voltar para um papel já comprado é de graça');
  await closeAll();
  // ---------- reforma ----------
  await ev(() => __sv.openShop('rosa')); await ev(() => document.querySelector('[data-a="stab"][data-t="casa"]').click()); await p.waitForTimeout(200);
  ok(/Sala de estar/.test(await panel()), 'Rosa oferece ampliar a casa');
  await ev(() => document.querySelector('[data-a="casaReforma"]').click()); await p.waitForTimeout(200);
  ok(await ev(() => __sv.W.farm.reforma.lv === 1 && __sv.casaLv() === 0), 'a obra fica pronta só amanhã');
  await closeAll();
  await ev(() => { const s = __sv; s.setFarmVal('reforma', { lv: 2, d: s.W.meta.day - 1 }); }); await p.waitForTimeout(400);
  const hs = await ev(() => { const m = __sv.getMap('house'); return { w: m.w, lv: __sv.casaLv(), lar: __sv.W.farm.casa['19,2'] }; });
  ok(hs.w === 32 && hs.lv === 2 && hs.lar === 'lareira', 'casa ampliada com 3 cômodos e lareira na sala: ' + JSON.stringify(hs));
  // ---------- aquário ----------
  await ev(() => { const s = __sv; s.setFarm('casa', '19,7', 'aquario'); s.setFarm('casa', '26,2', 'estantetrofeus'); s.setFarm('casa', '17,4', 'sofa'); for (const id of ['carpa', 'salmao', 'truta', 'peixesol']) s.addItem(id, 1, true); s.addItem('lenda', 1, true); s.goMap('house', 20 * 16 + 8, 9 * 16 + 8, 0); }); await p.waitForTimeout(700);
  await ev(() => __sv.openAquario('19,7')); await p.waitForTimeout(200);
  ok(/0 de 3 peixes/.test(await panel()), 'aquário novo: 3 vagas');
  for (let k = 0; k < 4; k++) await ev(() => { const s = __sv, i = s.P.inv.findIndex(x => x && s.item(x.id).cat === 'fish'); s.casa2Action('aqPoe', { dataset: { k: '19,7', i } }); });
  ok(await ev(() => __sv.aqOf('19,7').p.length === 3), 'cabem só 3 peixes no começo');
  await act('aqUp', { k: '19,7' }); await act('aqUp', { k: '19,7' }); await act('aqUp', { k: '19,7' }); await act('aqUp', { k: '19,7' });
  ok(await ev(() => __sv.aqOf('19,7').lv === 4), 'aquário aumentado até o máximo');
  await ev(() => { const s = __sv; for (let k = 0; k < 4; k++) { const i = s.P.inv.findIndex(x => x && s.item(x.id).cat === 'fish'); if (i >= 0) s.casa2Action('aqPoe', { dataset: { k: '19,7', i } }); } });
  const aq = await ev(() => __sv.aqOf('19,7'));
  ok(aq.p.length >= 5 && aq.p.includes('lenda'), 'peixes e o lendário nadando no aquário: ' + aq.p.join(', '));
  ok(/de 7 peixes/.test(await panel()), 'aquário máximo: 7 vagas');
  await p.waitForTimeout(600); await p.screenshot({ path: SHOTS + 'e20_aquario_painel.png' });
  await closeAll(); await clearToasts(); await p.waitForTimeout(400);
  await p.screenshot({ path: SHOTS + 'e20_sala.png' });
  await ev(() => { const s = __sv; s.P.x = 27 * 16 + 8; s.P.y = 4 * 16 + 8; s.trofeusHTML('26,2'); }); await p.waitForTimeout(200);
  ok(/Estante de troféus/.test(await panel()) && /Peixes lendários/.test(await panel()), 'estante de troféus mostra chefes, guardiões e lendários');
  await closeAll();
  // guardar o aquário devolve os peixes
  const n0 = await ev(() => __sv.P.inv.filter(x => x && __sv.item(x.id).cat === 'fish').reduce((a, x) => a + x.n, 0));
  await ev(() => __sv.casaAction('movelPick', { dataset: { k: '19,7' } })); await p.waitForTimeout(200);
  const n1 = await ev(() => __sv.P.inv.filter(x => x && __sv.item(x.id).cat === 'fish').reduce((a, x) => a + x.n, 0));
  ok(n1 - n0 === aq.p.length && !(await ev(() => __sv.W.farm.casa['19,7'])), `guardar o aquário devolve os ${aq.p.length} peixes`);
  await ev(() => { const s = __sv; s.setFarm('casa', '19,7', 'aquario'); s.setFarm('aquario', '19,7', { lv: 2, p: 'carpa,salmao,lenda,truta,peixesol' }); }); await closeAll();
  await ev(() => { const s = __sv; s.P.x = 20 * 16 + 8; s.P.y = 9 * 16 + 8; s.W.clock.min = 1250; }); await p.waitForTimeout(500); await clearToasts();
  await p.screenshot({ path: SHOTS + 'e20_sala_noite.png' });
  await ev(() => { __sv.P.x = 6 * 16 + 8; __sv.P.y = 6 * 16 + 8; __sv.W.clock.min = 720; }); await p.waitForTimeout(400); await clearToasts();
  await p.screenshot({ path: SHOTS + 'e20_quarto.png' });

  // ---------- lendário de novo ----------
  const lend = await ev(() => { const s = __sv, r = Math.random; s.P.flags.lend = { lenda: 1 }; s.P.skills.fishing = 99999; s.W.meta.rain = true; Math.random = () => 0.05; const a = s.legendFor('pond'); Math.random = () => 0.1; const b2 = s.legendFor('pond'); Math.random = r; s.W.meta.rain = false; return [a, b2]; });
  ok(lend[0] === 'lenda' && lend[1] === null, 'quem já pegou A Lenda pode pegar de novo (um pouco mais raro): ' + JSON.stringify(lend));

  // ---------- clima ----------
  const cl = await ev(() => { const s = __sv, r = Math.random; Math.random = () => 0.05; s.W.meta.rain = true; s.W.meta.snow = false; const m1 = { rain: false, snow: false }; s.climaNovo(m1, 'spring'); const m2 = { rain: true, snow: true }; s.climaNovo(m2, 'winter'); Math.random = r; s.W.meta.rain = false; return [m1, m2]; });
  ok(cl[0].arcoiris && cl[0].estrelas && !cl[0].nevasca && cl[1].nevasca && !cl[1].arcoiris, 'depois da chuva vem arco-íris; neve forte vira nevasca; noite limpa tem estrelas');
  await ev(() => { const s = __sv; s.W.meta.arcoiris = true; s.W.clock.min = 480; s.goMap('farm', 20 * 16 + 8, 14 * 16 + 8, 1); }); await p.waitForTimeout(800); await clearToasts();
  ok(await ev(() => __sv.climaBuff('luck') === 1 && /arco-íris/.test(document.getElementById('cSeason').textContent)), 'arco-íris dá Sorte +1 e aparece no relógio');
  await p.screenshot({ path: SHOTS + 'e20_arcoiris.png' });
  const nev = await ev(() => { const s = __sv; s.W.meta.arcoiris = false; s.W.meta.rain = true; s.W.meta.snow = true; s.W.meta.nevasca = true; const a = s.climaBuff('speed'); s.P.eq.bt = 'botasneve'; const b2 = s.climaBuff('speed'); delete s.P.eq.bt; return [a, b2]; });
  ok(nev[0] === -2 && nev[1] === 0, 'nevasca deixa mais lento lá fora, menos com roupa de frio ' + JSON.stringify(nev));
  await p.waitForTimeout(500); await clearToasts(); await p.screenshot({ path: SHOTS + 'e20_nevasca.png' });
  await ev(() => { const s = __sv; s.W.meta.rain = false; s.W.meta.snow = false; s.W.meta.nevasca = false; s.W.meta.estrelas = true; s.W.clock.min = 1290; }); await p.waitForTimeout(3500); await clearToasts();
  await p.screenshot({ path: SHOTS + 'e20_estrelas.png' });
  const ped = await ev(() => { const s = __sv; s.P.sel = s.P.inv.findIndex(x => !x); s.estrelasArr = [{ x: 100, y: 40, vx: -200, vy: 80, life: 1 }]; const q0 = s.count('quartzo') + s.count('pedralua') + s.count('frutaestelar'); const a = s.pedidoAct(); const q1 = s.count('quartzo') + s.count('pedralua') + s.count('frutaestelar'); s.estrelasArr = [{ x: 100, y: 40, vx: -200, vy: 80, life: 1 }]; const b2 = s.pedidoAct(); return [a, q1 - q0, b2]; });
  ok(ped[0] && ped[1] >= 1 && !ped[2], 'pedido para a estrela cadente: um presente por noite ' + JSON.stringify(ped));
  console.log('erros', errs);
  await b.close();
})();
