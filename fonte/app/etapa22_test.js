// Lista grande: cardápio da estação, floricultura, Darth brincando, doenças, móveis (girar, sentar, mesa), guarda-roupa,
// livro rosa, máquinas, chacrinha sem minhoquinhas, roupas para ela, gazebo novo, dança e bichos sincronizados (jogo local)
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
  await closeAll(); await p.waitForTimeout(1200);
  await ev(() => { const s = __sv; s.W.clock.min = 720; s.W.clock.at = Date.now(); s.earn(100000); for (const [k, n] of [['mcarvalho', 80], ['mpinho', 40], ['barraferro', 5], ['pedra', 50]]) s.addItem(k, n, true); });

  // ---------- consertos rápidos ----------
  ok(await ev(() => { const s = __sv; s.addItem('maionese', 1, true); s.P.sel = s.P.inv.findIndex(x => x && x.id === 'maionese'); return !s.coleiraDarth(); }), 'Darth não "veste" maionese (só coleiras)');
  ok(await ev(() => __sv.artifactSpots('farm').length === 0 && __sv.artifactSpots('town').length > 0), 'minhoquinhas só na vila e na praia, não na chacrinha');
  ok(await ev(() => __sv.fridge().length === 51), 'geladeira com 51 vagas (15 a mais)');

  // ---------- cardápio da estação ----------
  const card = await ev(() => { const s = __sv, d0 = s.W.meta.day, out = {}; for (const d of [3, 20, 33, 60, 88, 100]) { s.W.meta.day = d; out[d] = [s.lojaList2('lia').slice(0, 3).map(o => o.id), s.lojaList2('gloria').slice(0, 3).map(o => o.id)]; } s.W.meta.day = d0; return out; });
  ok(card[3][0].includes('saladaflores') && card[20][0].includes('quichealhoporo') && card[33][1].includes('picole') && card[88][0].includes('fondue') && card[100][0].includes('feijoada'), 'cardápio muda na metade de cada estação: ' + JSON.stringify([card[3][0], card[20][0], card[88][0], card[100][0]]));
  ok(await ev(() => __sv.lojaList2('lia').some(o => o.id === 'pizza')), 'os pratos de sempre continuam no bar');
  await ev(() => __sv.openShop('lia')); await p.waitForTimeout(200);
  await p.screenshot({ path: SHOTS + 'e22_cardapio.png' }); await closeAll();

  // ---------- floricultura ----------
  const flor = await ev(() => { const l = __sv.lojaList2('nena').map(o => o.id); return { margarida: l.includes('s_margarida'), lavanda: l.includes('s_lavanda'), fonte: l.includes('fontejardim'), anao: l.includes('anaojardim') }; });
  ok(Object.values(flor).every(Boolean), 'floricultura com flores novas e enfeites: ' + JSON.stringify(flor));
  await ev(() => __sv.openShop('nena')); await p.waitForTimeout(200); await p.screenshot({ path: SHOTS + 'e22_floricultura.png' }); await closeAll();

  // ---------- doenças ----------
  const doe = await ev(() => { const s = __sv; s.goMap('farm', 20 * 16 + 8, 14 * 16 + 8, 1); s.W.meta.rain = true; s.W.meta.snow = false; s.P.flags.expo = { d: s.W.meta.day, chuva: 149, sol: 0 }; return true; }); await p.waitForTimeout(1600);
  const d1 = await ev(() => { const s = __sv, d = s.doenca(); s.W.meta.rain = false; return { k: d && d.k, hud: document.getElementById('buff').textContent }; });
  ok(d1.k === 'resfriado' && /Resfriado/.test(d1.hud), 'tomar chuva sem capa dá resfriado (e aparece na tela): ' + d1.hud);
  await ev(() => __sv.openShop('davi')); await ev(() => { const t = document.querySelector('[data-a="stab"][data-t="consulta"]'); if (t) t.click(); }); await p.waitForTimeout(200);
  ok(/Diagnóstico: resfriado/.test(await panel()), 'o Doutor Davi diagnostica e indica o remédio');
  await p.screenshot({ path: SHOTS + 'e22_clinica.png' }); await closeAll();
  ok(await ev(() => { const s = __sv; s.addItem('xaropegripe', 1, true); s.P.sel = s.P.inv.findIndex(x => x && x.id === 'xaropegripe'); s.afterEat('xaropegripe'); return !s.doenca(); }), 'o xarope cura o resfriado');

  // ---------- casa: livro rosa, cadeira, sofá, mesa, guarda-roupa ----------
  await ev(() => __sv.goMap('house', 6 * 16 + 8, 6 * 16 + 8, 1)); await p.waitForTimeout(900); await closeAll();
  ok(await ev(() => __sv.W.farm.casa['4,2'] === 'criadomudo' && __sv.W.farm.livro === '4,2'), 'criado-mudo com o livro rosa ao lado da cama');
  await ev(() => __sv.livroAct(__sv.curMap(), 4, 2)); await p.waitForTimeout(600);
  ok(/Memórias da chacrinha/.test(await panel()), 'o livro rosa abre as memórias');
  await p.screenshot({ path: SHOTS + 'e22_memorias.png' }); await closeAll();
  await ev(() => { const s = __sv; s.setFarm('casa', '9,7', 'sofa'); s.setFarm('casa', '6,7', 'poltrona'); s.setFarm('casa', '12,7', 'mesacarvalho'); s.setFarm('casa', '13,3', 'guardaroupa'); s.setFarm('casa', '2,7', 'torregato'); s.setFarm('casa', '3,9', 'novelo'); });
  await ev(() => __sv.girarMovel('6,7')); await ev(() => __sv.girarMovel('6,7'));
  ok(await ev(() => __sv.rotOf('6,7') === 2), 'girar a poltrona (agora de costas, para o norte)');
  await ev(() => __sv.girarMovel('9,7'));
  ok(await ev(() => { const d = __sv.movelDims('9,7', 'sofa'); return d.w === 1 && d.h === 2; }), 'o sofá girado fica em pé (1×2)');
  await ev(() => { const s = __sv; s.setFarm('rot', '9,7', null); s.P.x = 9 * 16 + 8; s.P.y = 8 * 16 + 10; s.P.dir = 0; s.casa3Act(s.curMap(), 9, 7); });
  const sent = await ev(() => ({ pose: __sv.P.pose && __sv.P.pose.k, net: __sv.poseNet() }));
  ok(sent.pose === 's' && sent.net[0] === 's', 'sentar no sofá');
  await clearToasts(); await p.waitForTimeout(300); await p.screenshot({ path: SHOTS + 'e22_sofa.png' });
  await ev(() => __sv.levantar()); ok(await ev(() => !__sv.P.pose), 'andar levanta do sofá');
  const mesa = await ev(() => { const s = __sv; s.addItem('pizza', 1, true); s.P.sel = s.P.inv.findIndex(x => x && x.id === 'pizza'); s.mesaAct('12,7', 'mesacarvalho'); const posto = !!(s.W.farm.mesa && s.W.farm.mesa['12,7']); s.P.energy = 50; s.P.sel = s.P.inv.findIndex(x => !x); s.mesaAct('12,7', 'mesacarvalho'); return { posto, en: s.P.energy, vazio: !(s.W.farm.mesa || {})['12,7'] }; });
  ok(mesa.posto && mesa.en > 50 && mesa.vazio, 'pôr a pizza na mesa e comer: ' + JSON.stringify(mesa));
  await ev(() => { const s = __sv; s.addItem('pizza', 1, true); s.P.sel = s.P.inv.findIndex(x => x && x.id === 'pizza'); s.mesaAct('12,7', 'mesacarvalho'); });
  await ev(() => { const s = __sv; s.addItem('chapeupalha', 1, true); s.openArmario(); s.armarioMove(s.P.inv.findIndex(x => x && x.id === 'chapeupalha'), true); s.armarioMove(s.P.inv.findIndex(x => x && x.id === 'pedra'), true); });
  ok(await ev(() => (__sv.W.farm.armario || []).some(x => x && x.id === 'chapeupalha') && !(__sv.W.farm.armario || []).some(x => x && x.id === 'pedra')), 'guarda-roupa guarda roupa (e recusa pedra)');
  await p.screenshot({ path: SHOTS + 'e22_guardaroupa.png' }); await closeAll();
  // Darth brinca
  const br = await ev(() => { const s = __sv; s.P.pet.mode = 'roam'; s.petSt.map = 'house'; s.petSt.x = 5 * 16; s.petSt.y = 8 * 16; s.petSt.idle = 5; let i = 0; while (!s.brinq && i++ < 400) s.darthBrinca(0.1); for (let k = 0; k < 80; k++) s.darthBrinca(0.1); return s.brinq && { id: s.brinq.id, fase: s.brinq.fase }; });
  ok(br && br.fase === 'brincando', 'Darth vai sozinho brincar: ' + JSON.stringify(br));
  await ev(() => { __sv.P.x = 6 * 16 + 8; __sv.P.y = 9 * 16 + 8; }); await clearToasts(); await p.waitForTimeout(500);
  await p.screenshot({ path: SHOTS + 'e22_casa.png' });
  // dança
  await ev(() => __sv.comecarDanca('Ele')); await p.waitForTimeout(700); await clearToasts();
  ok(await ev(() => __sv.P.pose && __sv.P.pose.k === 'd'), 'dançar juntinhos');
  await p.screenshot({ path: SHOTS + 'e22_danca.png' });
  await ev(() => __sv.levantar());

  // ---------- máquinas ----------
  const maq = await ev(() => { const s = __sv, k = '30,30'; s.setTile(k, { o: { k: 'maionesera' } }); s.goMap('farm', 30 * 16 + 8, 31 * 16 + 10, 0); s.P.sel = s.P.inv.findIndex(x => !x); return s.maquinaMenu(k, s.tile(k), s.tile(k).o); });
  await p.waitForTimeout(200);
  ok(maq && /Mudar de lugar/.test(await panel()) && /Jogar fora/.test(await panel()), 'tocar na máquina com a mão livre: mudar de lugar, guardar ou jogar fora');
  await ev(() => { const b2 = document.querySelector('[data-a="maqLixo"]'); b2.click(); }); await p.waitForTimeout(100);
  await ev(() => { const b2 = document.querySelector('[data-a="maqLixo"]'); if (b2) b2.click(); }); await p.waitForTimeout(150);
  ok(await ev(() => !(__sv.tile('30,30') || {}).o), 'jogar fora pede confirmação e some com a máquina');
  await closeAll();

  // ---------- roupas para ela ----------
  ok(await ev(() => __sv.modaList('ela').length === 9), 'aba "Para ela" com 9 peças novas');
  ok(await ev(() => { const s = __sv; s.addItem('vestidofesta', 1, true); s.equipSlot(s.P.inv.findIndex(x => x && x.id === 'vestidofesta')); return s.roupaBuff('luck') >= 1; }), 'vestido de festa dá Sorte +1');

  // ---------- gazebo novo e bichos ----------
  await ev(() => { const s = __sv; s.setFarm('jardim', 'gazebo', -1); s.goMap('farm', 38 * 16 + 8, 27 * 16 + 8, 0); }); await p.waitForTimeout(900); await clearToasts();
  await p.screenshot({ path: SHOTS + 'e22_gazebo.png' });
  const mob = await ev(() => { const s = __sv; s.W.meta.mineMax = 120; s.goMap('mine3', 0, 0, 1); return true; }); await p.waitForTimeout(800);
  const mb = await ev(() => { const s = __sv, ms = s.monsters(), n0 = ms.length, sid = ms[0] && ms[0].sid; s.onBichos({ data: { k: s.mobKey(), h: [[sid, 9999]] } }); return { n0, n1: s.monsters().length, ids: ms.every(m => m.sid) }; });
  ok(mb.ids && mb.n1 === mb.n0 - 1, 'bicho que a outra pessoa derrotou some daqui também ' + JSON.stringify(mb));
  console.log('erros', errs);
  await b.close();
})();
