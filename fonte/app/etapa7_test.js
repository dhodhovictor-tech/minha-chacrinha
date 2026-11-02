// Etapa 7: cartinhas, "enquanto você estava fora", petiscos do Darth, mover máquinas, regador, pesca e cabra (jogo local)
const { chromium } = require('playwright');
const SHOTS = __dirname + '/../.tmp/shots/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('file://' + __dirname + '/../.tmp/teste.html'); await p.waitForTimeout(1200);
  await p.click('[data-v="casaco"]'); await p.fill('#nm', 'Ela'); await p.click('[data-a="start"]'); await p.waitForTimeout(800);
  const ev = (f, x) => p.evaluate(f, x);
  const ok = (c, m) => console.log((c ? 'OK   ' : 'FALHA') + ' ' + m);
  const closeAll = () => ev(() => document.querySelectorAll('[data-a="close"]').forEach(c => c.click()));
  await closeAll();
  // pesca: preço 10% menor, energia e espera 17% maiores
  const fishP = await ev(() => ({ sard: window.__sv.sellPrice('sardinha', 0) }));
  console.log('   sardinha hoje vale', fishP.sard, '(base 40 → 36)');
  // regador nível 2 rega 3 quadrados em fila
  await ev(() => { const s = __sv; for (let x = 10; x <= 14; x++) s.setTile(x + ',20', { s: 1 }); s.P.inv[1] = { id: 'can', n: 1, lv: 2 }; s.P.water = 40; s.goMap('farm', 9 * 16 + 8, 20 * 16 + 12, 3); });
  await p.waitForTimeout(700);
  await ev(() => { const P = __sv.P; P.x = 9 * 16 + 8; P.y = 20 * 16 + 12; P.dir = 3; P.sel = 1; __sv.act(); });
  const wet = await ev(() => [10, 11, 12, 13].map(x => (__sv.tile(x + ',20') || {}).w === __sv.W.meta.day));
  ok(wet[0] && wet[1] && wet[2] && !wet[3], 'regador de ferro (nível 2) molhou 3 quadrados em fila: ' + wet);
  // mover a fornalha trabalhando
  await ev(() => { const s = __sv; s.setTile('20,22', { o: { k: 'fornalha', in: 'cobre', out: 'barracobre', ready: 99999 } }); for (let y = 20; y <= 26; y++) for (let x = 22; x <= 28; x++) if (s.tile(x + ',' + y)) s.setTile(x + ',' + y, null); });
  await p.click('#bMenu'); await p.waitForTimeout(150); await p.click('[data-t="coop"]'); await p.waitForTimeout(150); await p.click('[data-a="moveStart"]'); await p.waitForTimeout(200);
  await ev(() => { const pl = __sv.placing; pl.x = 20; pl.y = 22; __sv.act(); }); await p.waitForTimeout(200);
  ok(await ev(() => __sv.placing && __sv.placing.obj === '20,22'), 'escolheu a fornalha para mudar');
  await ev(() => { const pl = __sv.placing; pl.x = 25; pl.y = 24; __sv.act(); }); await p.waitForTimeout(200);
  ok(await ev(() => { const t = __sv.tile('25,24'); return t && t.o && t.o.k === 'fornalha' && t.o.out === 'barracobre' && !(__sv.tile('20,22') || {}).o; }), 'fornalha mudou de lugar sem perder o que estava derretendo');
  // petisco para o Darth
  await ev(() => { const s = __sv; s.addItem('petisco', 3, true); s.P.sel = s.P.inv.findIndex(x => x && x.id === 'petisco'); });
  await p.waitForTimeout(1500);
  const fed = await ev(() => { const s = __sv, P = s.P, pt = s.petSt; P.x = pt.x - 12; P.y = pt.y + 6; P.dir = 3; s.act(); return { love: P.pet.love, fed: P.pet.fedDay, left: s.count('petisco') }; });
  ok(fed.love >= 8 && fed.left === 2, 'Darth comeu o petisco: ' + JSON.stringify(fed));
  const gift = await ev(() => { const R0 = Math.random; Math.random = () => 0.01; const n0 = __sv.P.inv.filter(Boolean).length; __sv.catMorningGift(); Math.random = R0; return __sv.P.inv.filter(Boolean).length > n0; });
  ok(gift, 'Darth bem tratado deixa presentinho de manhã');
  // cartinha para a outra pessoa
  await ev(() => { __sv.W.players.uB = { uid: 'uB', name: 'Victor', look: {}, feed: [] }; });
  await p.click('#bMenu'); await p.waitForTimeout(150); await p.click('[data-t="coop"]'); await p.waitForTimeout(150);
  await p.click('[data-a="letterOpen"]'); await p.waitForTimeout(200);
  await p.fill('#lettertxt', 'Te amo! Deixei umas abóboras no baú 🎃');
  await p.screenshot({ path: SHOTS + 'e7_letter.png' });
  await p.click('[data-a="letterSend"]'); await p.waitForTimeout(300);
  ok(await ev(() => Object.values(__sv.W.meta.letters.uB || {}).some(L => /Te amo/.test(L.text))), 'cartinha guardada para o Victor');
  await ev(() => { const s = __sv; s.W.meta.letters[s.P.uid] = { c1: { from: 'Victor', text: 'Saudade! Trouxe um diamante', gift: { id: 'diamante', n: 1 }, day: 1 } }; s.deliverLetters(99); });
  ok(await ev(() => __sv.P.mail.some(m => /Saudade/.test(m.text) && m.items && m.items[0][0] === 'diamante')), 'cartinha recebida chega na caixa de correio com o presente');
  // enquanto você estava fora
  const sum = await ev(() => __sv.feedSummary({ feed: [{ t: 10, k: 'colheu', id: 'morango', n: 12 }, { t: 20, k: 'pescou', id: 'sardinha', n: 2 }, { t: 30, k: 'mina', id: 'andar', n: 22 }, { t: 40, k: 'darth', id: 'petisco', n: 1 }] }, 5));
  ok(sum.length === 4 && /12× Morango/.test(sum[0]) && /andar 22/.test(sum.join(' ')), 'resumo: ' + sum.join(' | '));
  // cabra nova
  await closeAll();
  await ev(() => { const s = __sv, d = s.W.meta.day; s.setFarm('b', 'bb', { type: 'barn', lv: 2, x: 12, y: 27, ready: d }); s.setFarm('a', 'c1', { kind: 'cabra', name: 'Mimosa', b: 'bb', age: 9, v: 0 }); s.setFarm('a', 'c2', { kind: 'cabra', name: 'Pipoca', b: 'bb', age: 9, v: 1 }); s.W.clock.min = 400; s.W.clock.at = Date.now(); s.goMap('b:bb', 5 * 16, 5 * 16, 1); });
  await p.waitForTimeout(1500); await ev(() => document.querySelectorAll('#toasts > *').forEach(e => e.remove()));
  await p.screenshot({ path: SHOTS + 'e7_goats.png' });
  console.log('erros', errs);
  await b.close();
})();
