// Lojas sem voltar ao topo, quantidade na compra e venda, roupas à mostra no personagem e dia mais longo (jogo local)
const { chromium } = require('playwright');
const SHOTS = __dirname + '/../.tmp/shots/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + __dirname + '/../.tmp/teste.html'); await p.waitForTimeout(1200);
  await p.click('[data-v="casaco"]'); await p.fill('#nm', 'Ela'); await p.click('[data-a="start"]'); await p.waitForTimeout(800);
  const ev = (f, x) => p.evaluate(f, x), ok = (c, m) => console.log((c ? 'OK   ' : 'FALHA') + ' ' + m);
  const closeAll = () => ev(() => document.querySelectorAll('[data-a="close"]').forEach(c => c.click()));
  await closeAll(); await p.waitForTimeout(1000);
  await ev(() => { const s = __sv; s.W.meta.day = 38; s.W.clock.day = 38; s.P.lastDay = 38; s.W.clock.min = 600; s.W.clock.at = Date.now(); s.earn(100000); });
  // comprar o último item da lista não volta para o topo
  await ev(() => __sv.openShop('pedro')); await p.waitForTimeout(300);
  const sc = await ev(() => { const w = document.querySelector('.win'); w.scrollTop = w.scrollHeight; return w.scrollTop; });
  await p.screenshot({ path: SHOTS + 'e13_loja_fim.png' });
  const lastId = await ev(() => { const bs = [...document.querySelectorAll('[data-a="buy"][data-go]')]; const bt = bs[bs.length - 1]; bt.click(); return bt.dataset.id; });
  await p.waitForTimeout(250);
  const sc2 = await ev(() => document.querySelector('.win').scrollTop);
  ok(sc > 200 && Math.abs(sc2 - sc) < 4, `comprar o último item não volta para o topo (rolagem ${sc} → ${sc2})`);
  ok(await ev(id => __sv.count(id), lastId) >= 1, 'comprou o último item da lista: ' + lastId);
  // escolher a quantidade: + + +, digitar e Máx
  const row = '[data-k="b:s_pastinaca"]';
  const has = await ev(() => !!document.querySelector('.qn[data-qk="b:s_pastinaca"]'));
  const key = has ? 'b:s_pastinaca' : await ev(() => document.querySelector('.qn').dataset.qk);
  const id = key.slice(2);
  await ev(() => { const w = document.querySelector('.win'); w.scrollTop = 0; });
  for (let i = 0; i < 3; i++) await p.click(`[data-a="qty"][data-k="${key}"][data-d="1"]`);
  const lab = await ev(k => ({ v: document.querySelector(`.qn[data-qk="${k}"]`).value, t: document.querySelector(`[data-go][data-k="${k}"]`).textContent }), key);
  ok(lab.v === '4' && /Comprar · /.test(lab.t), 'apertar + três vezes deixa 4 e mostra o total: ' + lab.t);
  const c0 = await ev(id => __sv.count(id), id), g0 = await ev(() => __sv.gold());
  await p.click(`[data-go][data-k="${key}"]`); await p.waitForTimeout(200);
  const c1 = await ev(id => __sv.count(id), id), g1 = await ev(() => __sv.gold());
  ok(c1 - c0 === 4 && g0 > g1, `comprou 4 de uma vez (${item = id})`);
  await p.fill(`.qn[data-qk="${key}"]`, '12'); await p.waitForTimeout(100);
  ok(/Comprar · /.test(await ev(k => document.querySelector(`[data-go][data-k="${k}"]`).textContent, key)), 'digitar a quantidade atualiza o total');
  await p.click(`[data-go][data-k="${key}"]`); await p.waitForTimeout(200);
  ok(await ev(id => __sv.count(id), id) - c1 === 12, 'digitou 12 e comprou 12');
  await p.screenshot({ path: SHOTS + 'e13_quantidade.png' });
  // vender: escolher quantidade e não voltar ao topo
  await ev(() => { const s = __sv; for (const id of ['madeira', 'pedra', 'fibra', 'seiva', 'carvao', 'cobre', 'ferro', 'quartzo', 'amora', 'avela', 'cogumelo', 'narciso']) s.addItem(id, 20, true); });
  await p.click('[data-a="stab"][data-t="sell"]'); await p.waitForTimeout(200);
  const vs = await ev(() => { const w = document.querySelector('.win'); w.scrollTop = w.scrollHeight; return w.scrollTop; });
  const sk = await ev(() => { const bs = [...document.querySelectorAll('[data-a="sell"][data-go]')]; return bs[bs.length - 1].dataset.k; });
  const sid = sk.split(':')[2], s0 = await ev(id => __sv.count(id), sid);
  await ev(k => { const r = document.querySelector(`[data-go][data-k="${k}"]`).closest('.item'); for (let i = 0; i < 2; i++) r.querySelector('[data-d="1"]').click(); }, sk);
  await ev(k => document.querySelector(`[data-go][data-k="${k}"]`).click(), sk); await p.waitForTimeout(200);
  const vs2 = await ev(() => document.querySelector('.win').scrollTop);
  ok(s0 - await ev(id => __sv.count(id), sid) === 3 && Math.abs(vs2 - vs) < 40, `vendeu 3 de ${sid} e a lista ficou onde estava (${vs} → ${vs2})`);
  await ev(k => { const r = document.querySelector('[data-a="sell"][data-go]').closest('.item'); r.querySelector('[data-d="max"]').click(); }); 
  const mx = await ev(() => { const r = document.querySelector('[data-a="sell"][data-go]').closest('.item'); return [r.querySelector('.qn').value, r.dataset.max]; });
  ok(mx[0] === mx[1], 'Máx escolhe tudo o que tem: ' + mx.join('/'));
  await p.screenshot({ path: SHOTS + 'e13_venda.png' });
  await closeAll();
  // roupas à mostra
  await ev(() => { const s = __sv; for (const id of ['chapeupalha', 'macacao', 'luvasjardim', 'galochas']) s.addItem(id, 1, true); for (const id of ['chapeupalha', 'macacao', 'luvasjardim', 'galochas']) s.equipSlot(s.P.inv.findIndex(x => x && x.id === id)); });
  const lk = await ev(() => __sv.withEq(__sv.P.look, __sv.P.eq));
  ok(lk.eqh === 'chapeupalha' && lk.eqc === 'macacao' && lk.eqm === 'luvasjardim' && lk.boot === '#f4c020', 'o visual leva chapéu, macacão, luvas e galochas: ' + JSON.stringify({ h: lk.eqh, c: lk.eqc, m: lk.eqm, b: lk.boot }));
  await ev(() => __sv.goMap('town', 30 * 16, 17 * 16, 1)); await p.waitForTimeout(800); await closeAll();
  await ev(() => document.querySelectorAll('#toasts > *').forEach(e => e.remove()));
  await p.screenshot({ path: SHOTS + 'e13_personagem.png', clip: { x: 300, y: 80, width: 260, height: 200 } });
  // folha com todas as roupas nas 4 direções
  await ev(() => {
    const hats = ['chapeupalha', 'capacete', 'chapeupesca', 'coroaflores', 'mascara', 'gorro', 'chapeuapicultor'], bodies = ['macacao', 'avental', 'colete', 'cachecol', 'colarhavaiano', 'xadrezlenhador', 'capachuva'];
    const base = __sv.P.look, c = document.createElement('canvas'); c.width = 7 * 4 * 22 * 3; c.height = 2 * 44 * 3; c.id = 'sheet'; c.style.cssText = 'position:fixed;left:0;top:0;z-index:9999;background:#7ab85a';
    const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    hats.forEach((h, i) => [1, 3, 0, 2].forEach((d, j) => x.drawImage(__sv.farmerCanvas({ ...base, eqh: h, hat: '' }, d, 0), (i * 4 + j) * 66, 0, 54, 120)));
    bodies.forEach((bd, i) => [1, 3, 0, 2].forEach((d, j) => x.drawImage(__sv.farmerCanvas({ ...base, eqc: bd, eqm: i % 2 ? 'luvascouro' : 'luvasjardim', boot: ['#f4c020', '#7a5a3a', '#3a7ad0'][i % 3], pants: bd === 'macacao' ? '#3a5aa8' : base.pants }, d, 1), (i * 4 + j) * 66, 132, 54, 120)));
    document.body.appendChild(c);
  });
  await p.locator('#sheet').screenshot({ path: SHOTS + 'e13_roupas.png' });
  await ev(() => document.getElementById('sheet').remove());
  // dia mais longo: 19 minutos reais
  const ms = await ev(() => { const c = __sv.W.clock; c.min = 600; c.at = Date.now() - 9400; const a = __sv.nowMin(); c.at = Date.now() - 9600; const b = __sv.nowMin(); return [a - 600, b - 600]; });
  ok(ms[0] === 0 && ms[1] === 10, 'cada 10 minutos do jogo duram 9,5 s: o dia (6h às 2h) dura 19 minutos ' + JSON.stringify(ms));
  console.log('erros', errs);
  await b.close();
})();
