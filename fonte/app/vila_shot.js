// prints de pontos da vila: node vila_shot.js prefixo x,y x,y ...
const { chromium } = require('playwright');
const SHOTS = __dirname + '/../.tmp/shots/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 1, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + __dirname + '/../.tmp/teste.html'); await p.waitForTimeout(1200);
  await p.click('[data-v="casaco"]'); await p.fill('#nm', 'Ela'); await p.click('[data-a="start"]'); await p.waitForTimeout(800);
  await p.evaluate(() => { document.querySelectorAll('[data-a="close"]').forEach(c => c.click()); const s = __sv; s.W.clock.min = 720; s.W.clock.at = Date.now(); });
  const [pre, ...pts] = process.argv.slice(2);
  for (const pt of pts) {
    const [x, y, map] = pt.split(',');
    await p.evaluate(([x, y, map]) => __sv.goMap(map || 'town', +x * 16 + 8, +y * 16 + 8, 1), [x, y, map]); await p.waitForTimeout(800);
    await p.evaluate(() => document.querySelectorAll('#toasts > *').forEach(e => e.remove()));
    await p.screenshot({ path: SHOTS + pre + '_' + pt.replace(/,/g, '_') + '.png' });
  }
  console.log('erros', errs); await b.close();
})();
