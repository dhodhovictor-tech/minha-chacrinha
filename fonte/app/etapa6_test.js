// Etapa 6: música (jogo local, sem servidor)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const p = await b.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('file://' + __dirname + '/../.tmp/teste.html'); await p.waitForTimeout(1200);
  await p.click('[data-v="xadrez"]'); await p.fill('#nm', 'Eu'); await p.click('[data-a="start"]'); await p.waitForTimeout(800);
  const ev = (f, x) => p.evaluate(f, x);
  const ok = (c, m) => console.log((c ? 'OK   ' : 'FALHA') + ' ' + m);
  await ev(() => { document.querySelectorAll('[data-a="close"]').forEach(c => c.click()); __sv.initAudio(); });
  await p.mouse.click(400, 200); await p.waitForTimeout(2500);
  const s1 = await ev(() => __sv.musicState());
  ok(s1.theme === 'house' && s1.notes > 5, 'em casa toca a música de casa: ' + JSON.stringify(s1));
  await ev(() => __sv.goMap('farm', 20 * 16, 20 * 16, 1)); await p.waitForTimeout(3500);
  ok((await ev(() => __sv.musicState().theme)) === 'spring', 'na chacrinha de manhã toca a da primavera');
  await ev(() => { __sv.W.meta.rain = true; }); await p.waitForTimeout(3500);
  ok((await ev(() => __sv.musicState().theme)) === 'rain', 'com chuva muda para a da chuva');
  await ev(() => { __sv.W.meta.rain = false; __sv.goMap('mine5', 0, 0, 1); __sv.enterMine(5); }); await p.waitForTimeout(3500);
  ok((await ev(() => __sv.musicState().theme)) === 'mine', 'na mina toca a da mina');
  await ev(() => { __sv.W.meta.day = 13; __sv.P.lastDay = 13; __sv.goMap('town', 20 * 16, 20 * 16, 1); }); await p.waitForTimeout(3500);
  ok((await ev(() => __sv.musicState().theme)) === 'fest', 'na vila em dia de festival toca a do festival');
  await p.click('#bMenu'); await p.waitForTimeout(200); await p.click('[data-t="items"]'); await p.waitForTimeout(200);
  await p.click('[data-a="music"]'); await p.waitForTimeout(2000);
  const off = await ev(() => __sv.musicState());
  ok(!off.on && off.gain < 0.05, 'botão desliga a música: ' + JSON.stringify(off));
  await p.click('[data-a="music"]');
  console.log('erros', errs);
  await b.close();
})();
