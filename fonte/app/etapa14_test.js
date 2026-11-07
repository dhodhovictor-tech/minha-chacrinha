// Encantamentos, bichos mais fortes, Marcenaria do Tonico, móveis em casa, roupas de cama e reformas com madeira da mata (jogo local)
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
  const walk = async (key, ms = 500) => { await p.keyboard.down(key); await p.waitForTimeout(ms); await p.keyboard.up(key); await p.waitForTimeout(700); };
  await closeAll(); await p.waitForTimeout(1000);
  await ev(() => { const s = __sv; s.W.meta.day = 38; s.W.clock.day = 38; s.P.lastDay = 38; s.W.clock.min = 600; s.W.clock.at = Date.now(); s.earn(200000); });
  // bichos 30% mais fortes
  await ev(() => __sv.goMap('mine3', 0, 0, 1)); await p.waitForTimeout(800);
  const hit = await ev(() => { const s = __sv, P = s.P; s.monstersArr = [{ kind: 'slime', x: P.x, y: P.y, hp: 50, max: 50, dmg: 10, col: '#5ad84a', ph: 0, vx: 0, vy: 0, cd: 0, hitT: 0, hopT: 9 }]; P.hp = 100; const d = s.defTotal(); s.updateMonsters(0.016); return { lost: 100 - P.hp, def: d }; });
  ok(hit.lost === Math.max(1, 13 - hit.def), `bicho de dano 10 tira 13 de vida (perdeu ${hit.lost}, defesa ${hit.def})`);
  await ev(() => { __sv.monstersArr = []; __sv.P.hp = 100; });
  // encantar no Seu Cláudio
  await ev(() => { const s = __sv; s.addItem('quartzo', 5, true); s.addItem('esmeralda', 2, true); s.addItem('topazio', 3, true); s.openShop('claudio'); });
  await p.click('[data-a="stab"][data-t="enc"]'); await p.waitForTimeout(200);
  const encTab = await ev(() => document.querySelector('.win').innerText);
  ok(/Brilho/.test(encTab) && /Fúria/.test(encTab) && /Espada/.test(encTab), 'aba Encantar mostra as armas e os 5 encantos');
  await p.screenshot({ path: SHOTS + 'e14_encantar.png' });
  await p.click('[data-a="encApply"][data-e="quartzo"]'); await p.waitForTimeout(200);
  const sw = await ev(() => { const s = __sv.P.inv.find(x => x && x.id === 'sword'); return { enc: s.enc, q: __sv.count('quartzo') }; });
  ok(sw.enc === 'quartzo' && sw.q === 0, 'espada encantada com Brilho (gastou 5 quartzos)');
  await closeAll();
  ok(await ev(() => !!document.querySelector('#hotbar .slot .enc')), 'a espada mostra o losango do encanto na barra');
  // Vida: cada golpe devolve vida
  await ev(() => { const s = __sv, sw = s.P.inv.find(x => x && x.id === 'sword'); sw.enc = 'esmeralda'; const P = s.P; P.hp = 50; P.dir = 1; P.sel = P.inv.indexOf(sw); s.monstersArr = [{ kind: 'slime', x: P.x, y: P.y + 16, hp: 999, max: 999, dmg: 1, col: '#5ad84a', ph: 0, vx: 0, vy: 0, cd: 0, hitT: 0, hopT: 9 }]; s.swordHit(); });
  ok(await ev(() => __sv.P.hp) === 52, 'encanto Vida: acertar devolve 2 de vida');
  await ev(() => { const s = __sv, sw = s.P.inv.find(x => x && x.id === 'sword'); sw.enc = 'topazio'; s.monstersArr = []; s.act(); });
  const dur = await ev(() => __sv.toolAnim && __sv.toolAnim.dur);
  ok(Math.abs(dur - 0.28 * 0.85) < 0.001, 'encanto Ligeireza deixa o golpe 15% mais rápido: ' + dur);
  await p.waitForTimeout(300);
  // Marcenaria do Tonico
  await ev(() => __sv.goMap('town', 24 * 16 + 8, 27 * 16 + 10, 0)); await p.waitForTimeout(800); await clearToasts();
  await p.screenshot({ path: SHOTS + 'e14_praca.png' });
  await ev(() => { const P = __sv.P; P.x = 24 * 16 + 8; P.y = 26 * 16 + 10; P.dir = 0; }); await walk('ArrowUp');
  ok(await ev(() => __sv.P.map) === 'moveis', 'a porta leva para dentro da Marcenaria do Tonico');
  ok(await ev(() => (__sv.npcPos('tonico') || {}).map) === 'moveis', 'o Seu Tonico está atrás do balcão às 10h');
  await clearToasts(); await p.waitForTimeout(300); await p.screenshot({ path: SHOTS + 'e14_marcenaria.png' });
  await ev(() => { const s = __sv; for (const [k, n] of [['mpinho', 60], ['mcarvalho', 60], ['mipe', 40], ['madeiralei', 20], ['mdourada', 4], ['fibra', 200], ['barracobre', 3], ['barraouro', 2]]) s.addItem(k, n, true); const P = s.P; P.x = 6 * 16 + 8; P.y = 4 * 16 + 10; P.dir = 0; s.act(); });
  await p.waitForTimeout(300);
  const mshop = await ev(() => (document.querySelector('.win') || {}).innerText || '');
  ok(/Marcenaria do Tonico/.test(mshop) && /Mesa de carvalho/.test(mshop) && /Espelho dourado/.test(mshop) && /Roupa de cama/.test(mshop), 'a marcenaria tem móveis e roupa de cama');
  await p.screenshot({ path: SHOTS + 'e14_moveis.png' });
  const lei0 = await ev(() => __sv.count('mcarvalho'));
  await p.click('[data-a="movelMake"][data-id="mesacarvalho"]'); await p.waitForTimeout(200);
  ok(await ev(() => __sv.count('mesacarvalho')) === 1 && lei0 - await ev(() => __sv.count('mcarvalho')) === 15, 'encomendou a mesa de carvalho (15 de carvalho)');
  for (const id of ['luminaria', 'poltrona', 'tapete', 'estanteipe', 'relogio', 'comoda', 'espelhodourado', 'vaso', 'cadeirapinho', 'mesapinho']) await ev(id => document.querySelector(`[data-a="movelMake"][data-id="${id}"]`).click(), id);
  await p.click('[data-a="stab"][data-t="cama"]'); await p.waitForTimeout(150);
  await p.click('[data-a="camaBuy"][data-id="camaflorida"]'); await p.click('[data-a="camaBuy"][data-id="camaestrelas"]'); await p.waitForTimeout(150);
  ok(await ev(() => __sv.count('camaflorida') + __sv.count('camaestrelas')) === 2, 'comprou duas roupas de cama');
  await closeAll();
  // colocar a mesa em casa e guardar de novo
  await ev(() => __sv.goMap('house', 5 * 16 + 8, 7 * 16 + 10, 0)); await p.waitForTimeout(800);
  await ev(() => { const s = __sv, P = s.P; P.x = 5 * 16 + 8; P.y = 7 * 16 + 10; P.dir = 0; P.sel = P.inv.findIndex(x => x && x.id === 'mesacarvalho'); s.act(); });
  const casa1 = await ev(() => ({ casa: JSON.stringify(__sv.W.farm.casa), solid: __sv.solidAt ? null : null }));
  ok(/"5,6":"mesacarvalho"/.test(casa1.casa), 'colocou a mesa de carvalho na sala: ' + casa1.casa);
  await ev(() => { const P = __sv.P; P.sel = 9; P.inv[9] = null; __sv.act(); }); await p.waitForTimeout(200);
  ok(/Guardar na mochila/.test(await ev(() => (document.querySelector('.win') || {}).innerText || '')), 'tocar no móvel oferece guardar');
  await p.click('[data-a="movelPick"]'); await p.waitForTimeout(200);
  ok(await ev(() => __sv.count('mesacarvalho') === 1 && !(__sv.W.farm.casa || {})['5,6']), 'guardou a mesa de volta na mochila');
  // arrumar a casa toda para a foto
  await ev(() => { const s = __sv; for (const [k, id] of [['4,5', 'tapete'], ['1,6', 'estanteipe'], ['3,6', 'luminaria'], ['6,5', 'poltrona'], ['9,3', 'relogio'], ['8,3', 'espelhodourado'], ['11,8', 'comoda'], ['9,8', 'vaso'], ['5,8', 'mesacarvalho'], ['4,8', 'cadeirapinho']]) { s.setFarm('casa', k, id); const i = s.P.inv.findIndex(x => x && x.id === id); if (i >= 0) s.P.inv[i] = null; } });
  // roupa de cama
  await ev(() => { const s = __sv, P = s.P; P.x = 2 * 16 + 8; P.y = 5 * 16 + 10; P.dir = 0; P.sel = P.inv.findIndex(x => x && x.id === 'camaflorida'); s.act(); });
  ok(await ev(() => __sv.W.farm.cama) === 'camaflorida', 'trocou a roupa de cama para a florida');
  await closeAll();
  await ev(() => { const s = __sv, P = s.P; P.x = 2 * 16 + 8; P.y = 5 * 16 + 10; P.dir = 0; P.sel = P.inv.findIndex(x => x && x.id === 'camaestrelas'); s.act(); });
  ok(await ev(() => __sv.W.farm.cama) === 'camaestrelas' && await ev(() => __sv.count('camaflorida')) === 1, 'trocou para o céu estrelado e a florida voltou para a mochila');
  await closeAll(); await ev(() => { const P = __sv.P; P.x = 7 * 16 + 8; P.y = 7 * 16 + 10; P.dir = 1; P.sel = 0; }); await clearToasts(); await p.waitForTimeout(400);
  await p.screenshot({ path: SHOTS + 'e14_casa.png' });
  await ev(() => { __sv.W.clock.min = 1290; __sv.W.clock.at = Date.now(); }); await p.waitForTimeout(500); await clearToasts();
  await p.screenshot({ path: SHOTS + 'e14_casa_noite.png' });
  // receitas e reformas
  const rc = await ev(() => document.querySelector('#bMenu') && true);
  await p.click('#bMenu'); await p.waitForTimeout(150); await p.click('[data-t="craft"]'); await p.waitForTimeout(200);
  ok(/Colcha de lã/.test(await ev(() => document.querySelector('.win').innerText)), 'dá para fazer roupa de cama em Criar');
  await closeAll();
  const bu = await ev(() => ({ c2: __sv.BUILDS.coop.lvs[1].need, c3: __sv.BUILDS.coop.lvs[2].need, b3: __sv.BUILDS.barn.lvs[2].need }));
  ok(bu.c2.mpinho === 60 && bu.c3.madeiralei === 15 && bu.b3.mipe === 50, 'reformas pedem madeiras da mata: ' + JSON.stringify(bu.c3));
  // os móveis continuam depois de dormir
  await ev(() => __sv.endDay()); await p.waitForTimeout(2500); await closeAll();
  ok(Object.keys(await ev(() => __sv.W.farm.casa || {})).length >= 9 && await ev(() => __sv.W.farm.cama) === 'camaestrelas', 'móveis e roupa de cama continuam depois de dormir');
  console.log('erros', errs);
  await b.close();
})();
