// Ferreiro menor, Ateliê da Bia como loja de verdade, mata à direita da vila, diário e carne suína (jogo local)
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
  const setTime = min => ev(min => { const s = __sv; s.W.meta.day = 38; s.W.clock.day = 38; s.P.lastDay = 38; s.W.clock.min = min; s.W.clock.at = Date.now(); s.W.meta.rain = false; }, min);
  const walk = async (key, ms = 900) => { await p.keyboard.down(key); await p.waitForTimeout(ms); await p.keyboard.up(key); await p.waitForTimeout(700); };
  await closeAll(); await p.waitForTimeout(1000);
  await setTime(600); await ev(() => __sv.earn(30000));
  // praça: ferreiro menor e ateliê
  await ev(() => __sv.goMap('town', 31 * 16, 16 * 16, 0)); await p.waitForTimeout(800); await clearToasts();
  await p.screenshot({ path: SHOTS + 'e12_praca.png' });
  const sm = await ev(() => { const m = __sv.getMap('town'), s = m.sprites.find(x => x.type === 'smith'), a = m.sprites.find(x => x.type === 'atelie'); return { s: [s.w, s.h], a: a && [a.x, a.y, a.w, a.h] }; });
  ok(sm.s[0] === 6 && sm.s[1] === 5 && sm.a, 'ferreiro menor (6×5) e ateliê na praça: ' + JSON.stringify(sm));
  // entrar no ateliê pela porta
  await ev(() => { const P = __sv.P; P.x = 17 * 16 + 8; P.y = 26 * 16 + 10; P.dir = 0; }); await walk('ArrowUp', 500);
  ok(await ev(() => __sv.P.map) === 'atelie', 'a porta leva para dentro do Ateliê da Bia');
  ok(await ev(() => (__sv.npcPos('bia') || {}).map) === 'atelie', 'a Bia está atrás do balcão às 10h');
  await clearToasts(); await p.waitForTimeout(400); await p.screenshot({ path: SHOTS + 'e12_atelie.png' });
  await ev(() => { const P = __sv.P; P.x = 6 * 16 + 8; P.y = 4 * 16 + 10; P.dir = 0; __sv.act(); }); await p.waitForTimeout(300);
  const shop = await ev(() => (document.querySelector('.win') || {}).innerText || '');
  ok(/Ateliê da Bia/.test(shop) && /Galochas/.test(shop) && /Conversar com Bia/.test(shop), 'no balcão abre a loja de roupas');
  await p.screenshot({ path: SHOTS + 'e12_loja.png' }); await closeAll();
  await setTime(1100); await clearToasts();
  await ev(() => { const P = __sv.P; P.x = 6 * 16 + 8; P.y = 4 * 16 + 10; P.dir = 0; __sv.act(); }); await p.waitForTimeout(300);
  ok(/Bia não está agora. Horário: 9h às 17h/.test(await toasts()), 'fora do horário: ' + await toasts());
  await setTime(600);
  await ev(() => { const P = __sv.P; P.x = 6 * 16 + 8; P.y = 7 * 16 + 10; P.dir = 1; }); await walk('ArrowDown', 500);
  ok(await ev(() => __sv.P.map) === 'town', 'sai do ateliê de volta para a praça');
  // ferreiro continua abrindo pela porta
  await ev(() => { const P = __sv.P; P.x = 35 * 16 + 8; P.y = 13 * 16 + 10; P.dir = 0; }); await walk('ArrowUp', 500);
  ok(await ev(() => __sv.P.map) === 'smith', 'a porta do ferreiro continua funcionando');
  // mata à direita da vila (e não mais pela chacrinha)
  await ev(() => __sv.goMap('town', 77.5 * 16, 28 * 16 + 10, 3)); await p.waitForTimeout(600); await walk('ArrowRight');
  ok(await ev(() => __sv.P.map) === 'mata', 'a rua da vila continua para a direita até a mata');
  await clearToasts(); await p.screenshot({ path: SHOTS + 'e12_mata.png' });
  await ev(() => { const P = __sv.P; P.x = 1 * 16 + 8; P.y = 10 * 16 + 4; }); await walk('ArrowLeft', 500);
  ok(await ev(() => __sv.P.map) === 'town', 'pela esquerda da mata volta para a vila');
  ok(await ev(() => !__sv.getMap('farm').warps.some(w => w.to === 'mata')), 'a chacrinha não tem mais trilha para a mata');
  // javali: carne suína de vez em quando, que se assa na fogueira
  const carne = await ev(() => { const s = __sv, c0 = s.count('carnesuina'); for (let i = 0; i < 60; i++) s.killMonster({ kind: 'javali', mata: true, hp: 0 }); return s.count('carnesuina') - c0; });
  ok(carne >= 3 && carne <= 30, 'carne suína de vez em quando (60 javalis → ' + carne + ')');
  await ev(() => __sv.goMap('mata', 16 * 16 + 8, 11 * 16 + 10, 0)); await p.waitForTimeout(700);
  await ev(() => { const P = __sv.P; P.x = 16 * 16 + 8; P.y = 11 * 16 + 10; P.dir = 0; P.sel = P.inv.findIndex(i => i && i.id === 'carnesuina'); __sv.act(); }); await p.waitForTimeout(200);
  ok(await ev(() => __sv.count('lombo')) === 1, 'assou a carne na fogueira: lombo assado');
  // diário
  await ev(() => { const s = __sv; s.P.flags.ds = null; }); await p.waitForTimeout(300);
  await ev(() => { const st = __sv.P.stats; st.fish = (st.fish || 0) + 2; st.trees = (st.trees || 0) + 1; });
  await p.click('#bMenu'); await p.waitForTimeout(150); await p.click('[data-t="diario"]'); await p.waitForTimeout(600);
  let di = await ev(() => document.querySelector('.win').innerText);
  ok(/Diário de Ela/.test(di) && /Só você lê/.test(di) && /pesquei 2 peixes, derrubei 1 árvore/i.test(di), 'diário abre com as lembranças do dia');
  await p.fill('#diarytxt', 'Hoje pesquei com o Victor e o Darth dormiu no meu colo.');
  await p.click('[data-a="diaryStk"][data-s="morango"]'); await p.waitForTimeout(150);
  ok(await ev(() => document.getElementById('diarytxt').value) === 'Hoje pesquei com o Victor e o Darth dormiu no meu colo.', 'escolher o carimbo não apaga o texto');
  await p.click('[data-a="diarySave"]'); await p.waitForTimeout(500);
  const saved = await ev(() => JSON.stringify(__sv.diary.e['d' + __sv.W.meta.day]));
  ok(/Darth dormiu/.test(saved) && /morango/.test(saved) && /pesquei 2 peixes/i.test(saved), 'página guardada: ' + saved);
  // página antiga e editar
  await ev(() => { __sv.diary.e.d3 = { t: 'Primeiro dia regando morangos!', s: 'narciso', r: 'Choveu.' }; __sv.renderInventory(); }); await p.waitForTimeout(200);
  di = await ev(() => document.querySelector('.win').innerText);
  ok(/Páginas anteriores/.test(di) && /Primeiro dia regando/.test(di) && /Quarta, 3 de primavera/.test(di), 'mostra as páginas anteriores com a data');
  await p.screenshot({ path: SHOTS + 'e12_diario.png' });
  await p.click('[data-a="diaryEdit"][data-d="3"]'); await p.waitForTimeout(200);
  ok(await ev(() => document.getElementById('diarytxt').value) === 'Primeiro dia regando morangos!', 'editar abre a página antiga');
  // reabrir lê do banco
  const reload = await ev(async () => { const s = __sv; s.diary = null; s.renderInventory(); await new Promise(r => setTimeout(r, 600)); return document.querySelector('.win').innerText; });
  ok(/Darth dormiu/.test(reload), 'ao abrir de novo, o diário vem do banco');
  console.log('erros', errs);
  await b.close();
})();
