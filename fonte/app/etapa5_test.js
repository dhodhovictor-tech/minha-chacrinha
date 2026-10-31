// Etapa 5: conquistas do casal (jogo local, sem servidor)
const { chromium } = require('playwright');
const SHOTS = __dirname + '/../.tmp/shots/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('file://' + __dirname + '/../.tmp/teste.html'); await p.waitForTimeout(1200);
  await p.click('[data-v="xadrez"]'); await p.fill('#nm', 'Eu'); await p.click('[data-a="start"]'); await p.waitForTimeout(800);
  const ev = (f, x) => p.evaluate(f, x);
  const ok = (c, m) => console.log((c ? 'OK   ' : 'FALHA') + ' ' + m);
  await ev(() => document.querySelectorAll('[data-a="close"]').forEach(c => c.click()));
  await p.waitForTimeout(5500);
  ok(await ev(() => Object.keys(__sv.W.meta.ach || {}).length === 0), 'começa sem conquistas');
  // vendas somadas dos dois e peixes somados dos dois
  await ev(() => { const s = __sv; s.P.stats.shipped = 7000; s.P.stats.fish = 25; s.W.players.uB = { uid: 'uB', name: 'Ela', stats: { shipped: 4000, fish: 30 }, flags: {}, rel: {}, prof: [], recipes: [] }; s.checkAch(99); });
  const a1 = await ev(() => Object.keys(__sv.W.meta.ach || {}).sort().join(','));
  ok(/venda/.test(a1) && /dezmil/.test(a1) && /pesca50/.test(a1), 'somou os dois: vendas (11.000 ₲) e peixes (55): ' + a1);
  ok(/Conquista do casal/.test(await ev(() => document.getElementById('toasts').innerText)), 'avisa a conquista nova');
  // chefes e animais
  await ev(() => { const s = __sv; s.W.meta.bosses = { 25: 'u', 50: 'u', 75: 'u', 100: 'u' }; const d = s.W.meta.day; s.setFarm('b', 'bb', { type: 'barn', lv: 3, x: 10, y: 25, ready: d }); for (let i = 0; i < 10; i++) s.setFarm('a', 'a' + i, { kind: 'vaca', name: 'V' + i, b: 'bb', age: 9 }); s.checkAch(99); });
  const a2 = await ev(() => Object.keys(__sv.W.meta.ach || {}));
  ok(a2.includes('chefes') && a2.includes('bichos'), 'heróis da mina e fazenda cheia');
  // aba Troféus
  await p.click('#bMenu'); await p.waitForTimeout(200); await p.click('[data-t="ach"]'); await p.waitForTimeout(200);
  const tab = await ev(() => document.querySelector('.win').innerText);
  ok(/Conquistas de vocês dois: 5 de 20/.test(tab), 'aba Troféus mostra 5 de 20');
  await p.screenshot({ path: SHOTS + 'e5_trofeus.png' });
  console.log('erros', errs);
  await b.close();
})();
