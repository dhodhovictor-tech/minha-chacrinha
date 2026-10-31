// Etapa 3: lendários, tesouro na pesca, anzóis, chefes da mina, armas, anéis e botas (jogo local, sem servidor)
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
  await closeAll();
  // ícones novos
  const sheet = await ev(() => { const ids = ['adaga', 'martelo', 'espadaobsidiana', 'espadagalaxia', 'anelbrilho', 'anelvida', 'anelsorte', 'anelguerreiro', 'anelpedra', 'botascouro', 'botasvelozes', 'botasferro', 'botasdragao', 'boia', 'anzolgiratorio', 'anzolfarpado', 'imatesouro', 'lenda', 'carmim', 'tamboril', 'glacial', 'carpamutante']; const s = 5, C = 16 * s + 6, cols = 11; const c = document.createElement('canvas'); c.width = cols * C + 6; c.height = Math.ceil(ids.length / cols) * C + 6; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.fillStyle = '#3b1d0a'; g.fillRect(0, 0, c.width, c.height); ids.forEach((id, i) => { const x = 6 + (i % cols) * C, y = 6 + Math.floor(i / cols) * C; g.fillStyle = '#ffe4a8'; g.fillRect(x, y, C - 6, C - 6); g.drawImage(__sv.iconCanvas(id, 0), x, y, 16 * s, 16 * s); }); return c.toDataURL(); });
  require('fs').writeFileSync(SHOTS + 'e3_icons.png', Buffer.from(sheet.split(',')[1], 'base64'));
  // 1) lojas
  const ze = await ev(() => { __sv.openShop('ze'); return document.querySelector('.win').innerText; }); await closeAll();
  ok(/Boia de cortiça/.test(ze) && /Ímã de tesouro/.test(ze), 'Zé vende anzóis');
  const cl = await ev(() => { __sv.openShop('claudio'); return document.querySelector('.win').innerText; }); await closeAll();
  ok(/Adaga de prata/.test(cl) && /Martelo de pedra/.test(cl), 'Seu Cláudio vende adaga e martelo');
  // 2) anzol: só na vara de cobre ou melhor
  await ev(() => { const s = __sv, P = s.P; P.inv.fill(null); P.inv[0] = { id: 'rod', n: 1, lv: 0 }; P.inv[1] = { id: 'sword', n: 1, lv: 0 }; s.addItem('boia', 2, true); s.renderHotbar(); });
  await ev(() => { const P = __sv.P; P.sel = P.inv.findIndex(x => x && x.id === 'boia'); __sv.act(); });
  ok(await ev(() => !__sv.P.inv[0].tk), 'vara comum não aceita anzol');
  await ev(() => { const P = __sv.P; P.inv[0].lv = 1; P.sel = P.inv.findIndex(x => x && x.id === 'boia'); __sv.act(); });
  ok(await ev(() => __sv.P.inv[0].tk === 'boia' && __sv.P.inv[0].tkn === 20), 'boia presa na vara de cobre (20 usos)');
  // 3) lendário
  const leg = await ev(() => { const s = __sv; s.P.skills.fishing = 15000; s.W.meta.rain = true; const R0 = Math.random; Math.random = () => 0.01; const a = s.legendFor('pond'); Math.random = R0; return a; });
  ok(leg === 'lenda', 'na primavera com chuva, a Lenda pode morder na lagoa: ' + leg);
  // 4) pesca com tesouro e lendário
  await ev(() => { const s = __sv; s.fishing = { phase: 'game', id: 'lenda', diff: 1, barH: 118, bar: 1, bv: 0, fy: 60, fv: 0, target: 60, prog: 0.05, hold: true, tt: 0, chestAt: 0, water: 'pond' }; document.getElementById('fish').hidden = false; });
  await p.waitForTimeout(400);
  await p.waitForTimeout(800);
  await p.screenshot({ path: SHOTS + 'e3_fishchest.png' });
  await p.waitForTimeout(3600);
  const after = await ev(() => ({ lend: __sv.P.flags.lend, has: __sv.count('lenda'), tkn: __sv.P.inv[0].tkn, toasts: document.getElementById('toasts').innerText }));
  ok(after.has === 1 && after.lend && after.lend.lenda, 'pegou A Lenda e ficou registrado');
  ok(/Baú do tesouro/.test(after.toasts), 'baú do tesouro aberto: ' + (after.toasts.match(/Baú do tesouro[^\n]*/) || [''])[0]);
  ok(after.tkn === 19, 'a boia gastou 1 uso: ' + after.tkn);
  ok(await ev(() => { const R0 = Math.random; Math.random = () => 0.01; const a = __sv.legendFor('pond'); Math.random = R0; return a === null; }), 'a Lenda não aparece de novo para quem já pegou');
  // 5) anéis e botas
  await ev(() => { const s = __sv; s.addItem('anelguerreiro', 1, true); s.addItem('botasdragao', 1, true); s.addItem('anelbrilho', 1, true); });
  await p.click('#bMenu'); await p.waitForTimeout(200); await p.click('[data-t="items"]'); await p.waitForTimeout(200);
  for (const id of ['anelguerreiro', 'botasdragao', 'anelbrilho']) { const i = await ev(id => __sv.P.inv.findIndex(x => x && x.id === id), id); await p.click(`.win .grid [data-i="${i}"]`); await p.waitForTimeout(150); await p.click('[data-a="equipSel"]'); await p.waitForTimeout(200); }
  const eq = await ev(() => JSON.stringify(__sv.P.eq));
  ok(/anelguerreiro/.test(eq) && /botasdragao/.test(eq) && /anelbrilho/.test(eq), 'equipou 2 anéis e as botas: ' + eq);
  await p.screenshot({ path: SHOTS + 'e3_gear.png' });
  await closeAll();
  // 6) chefe do andar 25
  await ev(() => { __sv.goMap('mine25', 0, 0, 1); __sv.enterMine(25); });
  await p.waitForTimeout(1500);
  const boss = await ev(() => { const b = __sv.monsters().find(m => m.kind === 'boss'); return b && b.name; });
  ok(boss === 'Rei Gosma', 'andar 25 tem o chefe: ' + boss);
  ok(await ev(() => { const el = document.getElementById('bossbar'); return el && !el.hidden && /Rei Gosma/.test(el.innerText); }), 'barra de vida do chefe aparece');
  await ev(() => { const b = __sv.monsters().find(m => m.kind === 'boss'); const P = __sv.P; b.x = P.x + 40; b.y = P.y; P.hp = 100; });
  await p.waitForTimeout(500); await ev(() => document.querySelectorAll('#toasts > *').forEach(e => e.remove()));
  await p.screenshot({ path: SHOTS + 'e3_boss25.png' });
  // mata o chefe com a espada da galáxia
  await ev(() => { const s = __sv, P = s.P; s.addItem('espadagalaxia', 1, true); P.sel = P.inv.findIndex(x => x && x.id === 'espadagalaxia'); const b = s.monsters().find(m => m.kind === 'boss'); b.hp = 10; b.x = P.x + 14; b.y = P.y; P.dir = 3; s.act(); });
  await p.waitForTimeout(500);
  const won = await ev(() => ({ bosses: __sv.W.meta.bosses, adaga: __sv.count('adaga'), anel: __sv.count('anelvida'), bossLeft: __sv.monsters().some(m => m.kind === 'boss') }));
  ok(won.bosses && won.bosses[25] && won.adaga === 1 && won.anel === 1 && !won.bossLeft, 'venceu o Rei Gosma e ganhou adaga e anel da vida');
  await ev(() => { __sv.enterMine(25); }); await p.waitForTimeout(300);
  ok(await ev(() => !__sv.monsters().some(m => m.kind === 'boss')), 'chefe vencido não volta');
  // 7) os outros chefes se mexem sem erro
  for (const n of [50, 75, 100]) {
    await ev(n => { __sv.goMap('mine' + n, 0, 0, 1); __sv.enterMine(n); const b = __sv.monsters().find(m => m.kind === 'boss'); const P = __sv.P; P.hp = 100; if (b) { b.x = P.x + 50; b.y = P.y - 10; } }, n);
    await p.waitForTimeout(2500);
    await ev(() => { __sv.P.hp = 100; document.querySelectorAll('#toasts > *').forEach(e => e.remove()); });
    await p.screenshot({ path: SHOTS + `e3_boss${n}.png` });
    const nm = await ev(() => { const b = __sv.monsters().find(m => m.kind === 'boss'); return b ? b.name : null; });
    ok(!!nm, `andar ${n}: ${nm}`);
  }
  // 8) armas: dano diferente
  const dm = await ev(() => { const s = __sv, P = s.P, out = {}; for (const w of ['sword', 'adaga', 'martelo', 'espadaobsidiana']) { s.addItem(w, 1, true); P.sel = P.inv.findIndex(x => x && x.id === w); const mo = { kind: 'slime', x: P.x + 14, y: P.y, hp: 999, max: 999, dmg: 1, hitT: 0, vx: 0, vy: 0 }; s.monsters().length = 0; s.monsters().push(mo); P.dir = 3; const R0 = Math.random; Math.random = () => 0.99; s.swordHit(); Math.random = R0; out[w] = 999 - mo.hp; } return out; });
  ok(dm.martelo > dm.adaga && dm.espadaobsidiana > dm.sword, 'cada arma tem dano próprio: ' + JSON.stringify(dm));
  console.log('erros', errs);
  await b.close();
})();
