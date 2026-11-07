// print das casas dos moradores (de dia e à noite)
const { chromium } = require('playwright');
const SHOTS = __dirname + '/../.tmp/shots/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + __dirname + '/../.tmp/teste.html'); await p.waitForTimeout(1200);
  await p.click('[data-v="casaco"]'); await p.fill('#nm', 'Ela'); await p.click('[data-a="start"]'); await p.waitForTimeout(800);
  const ev = (f, x) => p.evaluate(f, x);
  await ev(() => document.querySelectorAll('[data-a="close"]').forEach(c => c.click()));
  const pre = process.argv[2] || 'casas';
  const setT = (min, season) => ev(([min, season]) => { const s = __sv; s.W.clock.min = min; s.W.clock.at = Date.now(); s.W.meta.rain = false; s.W.meta.snow = false; if (season != null) { s.W.meta.day = 1 + season * 28 + 5; s.W.clock.day = s.W.meta.day; s.P.lastDay = s.W.meta.day; } }, [min, season]);
  for (const [nm, x, y] of [['n', 61, 36], ['s', 61, 45], ['ln', 71, 36], ['ls', 71, 45]]) {
    await setT(720, 0); await ev(([x, y]) => __sv.goMap('town', x * 16 + 8, y * 16 + 8, 1), [x, y]); await p.waitForTimeout(900);
    await ev(() => document.querySelectorAll('#toasts > *').forEach(e => e.remove()));
    await p.screenshot({ path: SHOTS + pre + '_' + nm + '.png' });
  }
  await setT(1230, 0); await p.waitForTimeout(600); await p.screenshot({ path: SHOTS + pre + '_noite.png' });
  await setT(720, 3); await p.waitForTimeout(600); await p.screenshot({ path: SHOTS + pre + '_inverno.png' });
  console.log('erros', errs); await b.close();
})();
