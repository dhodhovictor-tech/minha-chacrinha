// Avisos sem repetir, Darth sem emojis, loja de roupas e mais diversão nos festivais (jogo local)
const { chromium } = require('playwright');
const SHOTS = __dirname + '/../.tmp/shots/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + __dirname + '/../.tmp/teste.html'); await p.waitForTimeout(1200);
  await p.click('[data-v="casaco"]'); await p.fill('#nm', 'Ela'); await p.click('[data-a="start"]'); await p.waitForTimeout(800);
  const ev = (f, x) => p.evaluate(f, x), ok = (c, m) => console.log((c ? 'OK   ' : 'FALHA') + ' ' + m);
  const closeAll = () => ev(() => document.querySelectorAll('[data-a="close"]').forEach(c => c.click()));
  await closeAll(); await p.waitForTimeout(1500);
  // carinho 3 vezes: um aviso só, sem emojis
  for (let i = 0; i < 3; i++) { await ev(() => { const s = __sv, P = s.P, st = s.petSt; P.x = st.x - 12; P.y = st.y + 6; P.dir = 3; P.sel = 0; s.act(); }); await p.waitForTimeout(350); }
  const tz = await ev(() => [...document.querySelectorAll('#toasts > *')].map(e => e.textContent));
  ok(tz.filter(t => /Darth/.test(t)).length === 1 && !/[💚🤍😻🐾]/u.test(tz.join('')), 'carinho 3 vezes: 1 aviso só, sem emojis: ' + tz.join(' | '));
  // loja de roupas na praça
  await ev(() => { __sv.W.meta.day = 39; __sv.P.lastDay = 39; __sv.earn(30000); __sv.goMap('town', 27.5 * 16, 15 * 16 + 12, 0); });
  await p.waitForTimeout(800); await ev(() => document.querySelectorAll('#toasts > *').forEach(e => e.remove()));
  await p.screenshot({ path: SHOTS + 'e9_praca.png' });
  await ev(() => { const P = __sv.P; P.x = 27.5 * 16; P.y = 15 * 16 + 12; P.dir = 0; __sv.act(); }); await p.waitForTimeout(300);
  const shop = await ev(() => (document.querySelector('.win') || {}).innerText || '');
  ok(/Ateliê da Bia/.test(shop) && /Galochas/.test(shop) && /Luvas de jardinagem/.test(shop) && /Capacete de minerador/.test(shop), 'Ateliê da Bia vende roupas');
  await p.screenshot({ path: SHOTS + 'e9_loja.png' });
  await closeAll();
  // vestir galochas: na chuva gasta 25% menos
  await ev(() => { __sv.addItem('galochas', 1, true); __sv.addItem('chapeupalha', 1, true); });
  await p.click('#bMenu'); await p.waitForTimeout(150); await p.click('[data-t="items"]'); await p.waitForTimeout(150);
  for (const id of ['galochas', 'chapeupalha']) { const i = await ev(id => __sv.P.inv.findIndex(x => x && x.id === id), id); await p.click(`.win .grid [data-i="${i}"]`); await p.waitForTimeout(120); await p.click('[data-a="equipSel"]'); await p.waitForTimeout(150); }
  const eq = await ev(() => JSON.stringify(__sv.P.eq));
  ok(/"bt":"galochas"/.test(eq) && /"hd":"chapeupalha"/.test(eq), 'vestiu galochas e chapéu de palha: ' + eq);
  ok(await ev(() => { __sv.W.meta.rain = true; const a = __sv.energyMul(); __sv.W.meta.rain = false; return a === 0.75 && __sv.energyMul() === 1; }), 'galochas: 25% menos energia só na chuva');
  await p.screenshot({ path: SHOTS + 'e9_equip.png' });
  await closeAll();
  // luau: mais diversão
  await ev(() => { __sv.goMap('town', 19.5 * 16, 15 * 16 + 12, 0); }); await p.waitForTimeout(700);
  await ev(() => { const P = __sv.P; P.x = 19.5 * 16; P.y = 15 * 16 + 12; P.dir = 0; __sv.act(); }); await p.waitForTimeout(300);
  const lu = await ev(() => document.querySelector('.win').innerText);
  ok(/Mais diversão/.test(lu) && /Pegue os cocos/.test(lu) && /marshmallow/.test(lu) && /comidinhas/.test(lu), 'Luau tem sopa, 2 minijogos e barraca');
  await p.click('[data-a="fxGame"][data-g="cocos"]'); await p.waitForTimeout(2500);
  await p.screenshot({ path: SHOTS + 'e9_cocos.png' });
  const g0 = await ev(() => __sv.gold());
  await ev(() => { const M = __sv.mini; M.score = 12; M.t = 0.01; }); await p.waitForTimeout(300);
  ok((await ev(() => __sv.gold())) - g0 === 700, 'pegou 12 cocos e ganhou 700 ₲');
  await p.click('[data-a="fxBack"]'); await p.waitForTimeout(200);
  await p.click('[data-a="fxGame"][data-g="marsh"]'); await p.waitForTimeout(500);
  for (let i = 0; i < 5; i++) { await ev(() => { const M = __sv.mini; M.m = M.zone; __sv.miniHit(); }); await p.waitForTimeout(100); }
  ok(await ev(() => __sv.mini && __sv.mini.over && __sv.mini.score >= 5), 'assou os marshmallows na hora certa: ' + await ev(() => __sv.mini && __sv.mini.score));
  await p.click('[data-a="fxBack"]'); await p.waitForTimeout(200);
  await p.click('[data-a="fxShop"]'); await p.waitForTimeout(200);
  ok(/Água de coco/.test(await ev(() => document.querySelector('.win').innerText)), 'barraca do Luau vende água de coco, espetinho e colar');
  await closeAll();
  const talk = await ev(() => { __sv.openTalk('pedro'); return document.querySelector('.speech').innerText; });
  ok(/sopa|coco|fogueira|cocos/.test(talk), 'moradores falam do Luau: ' + talk);
  await closeAll(); await ev(() => { __sv.W.clock.min = 1250; __sv.W.clock.at = Date.now(); }); await p.waitForTimeout(800); await ev(() => document.querySelectorAll('#toasts > *').forEach(e => e.remove()));
  await p.screenshot({ path: SHOTS + 'e9_luau.png' });
  console.log('erros', errs);
  await b.close();
})();
