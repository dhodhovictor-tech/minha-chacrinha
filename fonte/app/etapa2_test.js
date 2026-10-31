// Etapa 2: profissões (jogo local, sem servidor)
const { chromium } = require('playwright');
const SHOTS = __dirname + '/../.tmp/shots/';
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true }); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('file://' + __dirname + '/../.tmp/teste.html'); await p.waitForTimeout(1200);
  await p.click('[data-v="casaco"]'); await p.fill('#nm', 'Ela'); await p.click('[data-a="start"]'); await p.waitForTimeout(800);
  const ev = (f, x) => p.evaluate(f, x);
  const ok = (c, m) => console.log((c ? 'OK   ' : 'FALHA') + ' ' + m);
  await ev(() => document.querySelectorAll('[data-a="close"]').forEach(c => c.click()));
  ok(await ev(() => __sv.pendingProf() === null), 'sem profissão para escolher no começo');
  const base = await ev(() => __sv.sellPrice('pastinaca', 0));
  // sobe Lavoura para o nível 5
  await ev(() => __sv.gainXP('farming', 2150));
  ok(/Profissão nova/.test(await ev(() => document.getElementById('toasts').innerText)), 'avisa que tem profissão nova ao chegar no nível 5');
  await p.click('#bMenu'); await p.waitForTimeout(200); await p.click('[data-t="skills"]'); await p.waitForTimeout(200);
  ok(!!(await p.$('[data-a="profOpen"]')), 'aba Habilidades mostra o botão de escolher profissão');
  await p.click('[data-a="profOpen"]'); await p.waitForTimeout(200);
  const opts = await ev(() => document.querySelector('.win').innerText);
  ok(/Lavrador/.test(opts) && /Pecuarista/.test(opts), 'nível 5 de Lavoura: Lavrador ou Pecuarista');
  await p.screenshot({ path: SHOTS + 'e2_choice.png' });
  await p.click('[data-p="lavrador"]'); await p.waitForTimeout(300);
  ok(await ev(() => __sv.hasProf('lavrador')), 'virou Lavrador');
  const lav = await ev(() => __sv.sellPrice('pastinaca', 0));
  ok(Math.abs(lav / base - 1.1) < 0.06, `pastinaca vale 10% a mais (${base} → ${lav})`);
  // nível 10: opções do ramo Lavrador
  await ev(() => __sv.gainXP('farming', 20000));
  await ev(() => __sv.openProfChoice()); await p.waitForTimeout(200);
  const opts10 = await ev(() => document.querySelector('.win').innerText);
  ok(/Artesão/.test(opts10) && /Agricultor/.test(opts10) && !/Granjeiro/.test(opts10), 'nível 10 mostra só o ramo do Lavrador (Artesão ou Agricultor)');
  await p.click('[data-p="agricultor"]'); await p.waitForTimeout(300);
  // agricultor: couve-flor (11 dias) fica pronta em 10
  await ev(() => { const s = __sv, P = s.P; s.goMap('farm', 10 * 16 + 8, 21 * 16 + 12, 0); });
  await p.waitForTimeout(700);
  const cf = await ev(() => { const s = __sv, P = s.P; s.setTile('10,20', { s: 1 }); s.addItem('s_couveflor', 1, true); P.sel = P.inv.findIndex(x => x && x.id === 's_couveflor'); P.x = 10 * 16 + 8; P.y = 21 * 16 + 12; P.dir = 0; s.act(); return JSON.stringify(s.tile('10,20').c); });
  ok(/"d":10/.test(cf), 'Agricultor: couve-flor plantada fica pronta em 10 dias (era 11): ' + cf);
  // pesca: Paciente aumenta a barra
  await ev(() => __sv.gainXP('fishing', 2150)); await ev(() => __sv.openProfChoice()); await p.waitForTimeout(200);
  await p.click('[data-p="paciente"]'); await p.waitForTimeout(300);
  ok(await ev(() => __sv.hasProf('paciente')), 'Pesca nível 5: virou Paciente');
  // combate e coleta continuam sem escolha até o nível 5
  ok(await ev(() => __sv.pendingProf() === null), 'nada mais pendente');
  await p.click('#bMenu'); await p.waitForTimeout(200); await p.click('[data-t="skills"]'); await p.waitForTimeout(200);
  const tab = await ev(() => document.querySelector('.win').innerText);
  ok(/Lavrador/.test(tab) && /Agricultor/.test(tab) && /Paciente/.test(tab), 'aba Habilidades lista as profissões escolhidas');
  await p.screenshot({ path: SHOTS + 'e2_skills.png' });
  // fica salvo ao reabrir
  await p.waitForTimeout(1500);
  await p.reload(); await p.waitForTimeout(2000);
  ok(await ev(() => __sv.P && JSON.stringify(__sv.P.prof) === '["lavrador","agricultor","paciente"]'), 'profissões continuam depois de reabrir o jogo: ' + await ev(() => JSON.stringify(__sv.P && __sv.P.prof)));
  console.log('erros', errs);
  await b.close();
})();
