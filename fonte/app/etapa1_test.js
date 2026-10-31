// Etapa 1: qualidade das colheitas, adubos, irrigadores, fazedor de sementes, para-raios e eventos da noite (jogo local, sem servidor)
const { chromium } = require('playwright');
const SHOTS = __dirname + '/../.tmp/shots/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('file://' + __dirname + '/../.tmp/teste.html'); await p.waitForTimeout(1200);
  await p.click('[data-v="xadrez"]'); await p.fill('#nm', 'Eu'); await p.click('[data-a="start"]'); await p.waitForTimeout(800);
  await p.evaluate(() => { const c = document.querySelector('[data-a="close"]'); c && c.click(); });
  const ok = (c, m) => console.log((c ? 'OK   ' : 'FALHA') + ' ' + m);
  const ev = (f, x) => p.evaluate(f, x);
  const closeAll = () => ev(() => document.querySelectorAll('[data-a="close"]').forEach(c => c.click()));
  const nextDay = async () => { await ev(() => __sv.endDay()); await p.waitForTimeout(1200); await closeAll(); await ev(() => { __sv.P.sleep = false; __sv.goMap('farm', 20 * 16 + 8, 22 * 16 + 8, 1); }); await p.waitForTimeout(700); };
  await ev(() => { const s = __sv; for (let y = 18; y <= 33; y++) for (let x = 6; x <= 32; x++) if (s.tile(x + ',' + y)) s.setTile(x + ',' + y, null); s.P.skills.farming = 15000; s.P.inv.fill(null); s.P.inv[0] = { id: 'hoe', n: 1, lv: 0 }; s.P.inv[1] = { id: 'pick', n: 1, lv: 0 }; s.addItem('adubobom', 30); s.addItem('adubo', 5); s.addItem('acelerador', 5); s.addItem('s_pastinaca', 40); s.renderHotbar(); });
  // 1) adubo e qualidade
  await ev(() => __sv.goMap('farm', 10 * 16 + 8, 21 * 16 + 12, 0)); await p.waitForTimeout(700);
  const fe = await ev(() => { const s = __sv, P = s.P; s.setTile('10,20', { s: 1 }); P.sel = P.inv.findIndex(x => x && x.id === 'adubobom'); P.x = 10 * 16 + 8; P.y = 21 * 16 + 12; P.dir = 0; s.act(); return JSON.stringify(s.tile('10,20')); });
  ok(/"fe":"adubobom"/.test(fe), 'adubo vai na terra arada: ' + fe);
  await p.waitForTimeout(300);
  await ev(() => { const s = __sv; s.setTile('11,20', { s: 1, c: { id: 'pastinaca', g: 2 } }); const P = s.P; P.x = 11 * 16 + 8; P.y = 21 * 16 + 12; P.dir = 0; P.sel = P.inv.findIndex(x => x && x.id === 'adubo'); s.act(); });
  ok(await ev(() => !__sv.tile('11,20').fe), 'não aceita adubo em planta que já está crescendo');
  await p.waitForTimeout(300);
  // acelerador: planta nasce com 25% menos dias
  await ev(() => { const s = __sv, P = s.P; s.setTile('12,20', { s: 1 }); P.x = 12 * 16 + 8; P.y = 21 * 16 + 12; P.dir = 0; P.sel = P.inv.findIndex(x => x && x.id === 'acelerador'); s.act(); });
  await p.waitForTimeout(300);
  await ev(() => { const s = __sv, P = s.P; P.sel = P.inv.findIndex(x => x && x.id === 's_pastinaca'); s.act(); });
  const acc = await ev(() => JSON.stringify(__sv.tile('12,20')));
  ok(/"d":2/.test(acc), 'pastinaca com acelerador fica pronta em 2 dias (era 3): ' + acc);
  // colher muitas pastinacas com Lavoura 10 e adubo de qualidade: sai prata e ouro
  const qs = await ev(async () => {
    const s = __sv, P = s.P, out = [0, 0, 0];
    for (let i = 0; i < 60; i++) {
      s.setTile('14,20', { s: 1, fe: 'adubobom', c: { id: 'pastinaca', g: 3 } });
      P.inv = P.inv.map(x => (x && x.id === 'pastinaca' ? null : x));
      P.x = 14 * 16 + 8; P.y = 21 * 16 + 12; P.dir = 0; P.sel = 0;
      s.act(); await new Promise(r => setTimeout(r, 260));
      const got = P.inv.find(x => x && x.id === 'pastinaca'); if (got) out[got.q || 0]++;
    }
    return out;
  });
  ok(qs[1] > 1 && qs[2] > 15, `colheitas com Lavoura 10 e adubo de qualidade: ${qs[0]} normais, ${qs[1]} prata, ${qs[2]} ouro`);
  // mochila: estrelas, preço e não mistura qualidades
  await ev(() => { const s = __sv, P = s.P; P.inv = P.inv.map(x => (x && x.id === 'pastinaca' ? null : x)); s.addItem('pastinaca', 3, true, 0); s.addItem('pastinaca', 2, true, 2); s.addItem('pastinaca', 1, true, 1); s.renderHotbar(); });
  const st = await ev(() => { const P = __sv.P, sl = P.inv.filter(x => x && x.id === 'pastinaca').map(x => (x.q || 0) + ':' + x.n).join(' '); return { sl, gold: __sv.sellPrice('pastinaca', 2), base: __sv.sellPrice('pastinaca', 0), stars: document.querySelectorAll('#hotbar .q').length }; });
  ok(st.sl.split(' ').length === 3 && Math.abs(st.gold / st.base - 1.5) < 0.05 && st.stars >= 2, `pilhas separadas (${st.sl}), ouro vale ${st.gold} e normal ${st.base}, estrelas na barra: ${st.stars}`);
  await ev(() => __sv.P.inv && 0);
  ok(await ev(() => { const s = __sv; s.removeItem('pastinaca', 3); const left = s.P.inv.filter(x => x && x.id === 'pastinaca').map(x => (x.q || 0) + ':' + x.n).join(' '); return left === '2:2 1:1' || left === '1:1 2:2'; }), 'receitas gastam primeiro as de qualidade normal');
  await p.screenshot({ path: SHOTS + 'e1_hotbar.png', clip: { x: 0, y: 0, width: 70, height: 390 } });
  // 2) irrigadores
  await ev(() => { const s = __sv; for (let y = 24; y <= 30; y++) for (let x = 8; x <= 22; x++) s.setTile(x + ',' + y, { s: 1, w: s.W.meta.day }); s.setTile('10,26', { s: 1, o: { k: 'irrigador' } }); s.setTile('15,26', { s: 1, o: { k: 'irrigadorbom' } }); s.setTile('20,27', { s: 1, o: { k: 'irrigadorouro' } }); });
  await nextDay();
  const w = await ev(() => { const s = __sv, d = s.W.meta.day, wet = (x, y) => (s.tile(x + ',' + y) || {}).w === d; return { cross: [wet(10, 25), wet(11, 26), !wet(11, 25)], bom: [wet(14, 25), wet(16, 27), !wet(17, 26)], ouro: [wet(18, 25), wet(22, 29), wet(19, 28), !wet(17, 27)] }; });
  ok(w.cross.every(Boolean) && w.bom.every(Boolean) && w.ouro.every(Boolean), 'irrigador molha cruz, o de qualidade 3×3 e o de ouro 5×5: ' + JSON.stringify(w));
  // 3) fazedor de sementes
  await ev(() => { const s = __sv, P = s.P; s.setTile('25,20', { o: { k: 'fazedorsementes' } }); s.addItem('pastinaca', 1, true, 0); P.sel = P.inv.findIndex(x => x && x.id === 'pastinaca' && !x.q); P.x = 25 * 16 + 8; P.y = 21 * 16 + 12; P.dir = 0; s.act(); });
  const sm = await ev(() => JSON.stringify(__sv.tile('25,20').o));
  ok(/"out":"s_pastinaca"/.test(sm), 'fazedor de sementes aceitou a pastinaca: ' + sm);
  await ev(() => { const s = __sv, t = s.tile('25,20'); s.setTile('25,20', { ...t, o: { ...t.o, ready: 0 } }); });
  const n0 = await ev(() => __sv.count('s_pastinaca'));
  await p.waitForTimeout(300); await ev(() => __sv.act());
  const n1 = await ev(() => __sv.count('s_pastinaca'));
  ok(n1 - n0 >= 1 && n1 - n0 <= 3, `recolheu ${n1 - n0} semente(s)`);
  // 4) noite: para-raios na tempestade, fada e meteorito
  await ev(() => { const s = __sv; s.setTile('27,22', { o: { k: 'pararaios' } }); s.W.meta.storm = true; s.W.meta.rain = true; });
  await nextDay();
  ok(await ev(() => { const o = __sv.tile('27,22').o; return o.in === 'raio' && o.out === 'bateria'; }), 'tempestade carregou o para-raios');
  await ev(() => { const s = __sv, P = s.P; P.x = 27 * 16 + 8; P.y = 23 * 16 + 12; P.dir = 0; s.act(); });
  ok(await ev(() => __sv.count('bateria')) === 1, 'pegou a bateria do para-raios');
  const fairy = await ev(() => { const s = __sv, t = {}; t['30,30'] = { s: 1, c: { id: 'couveflor', g: 1 } }; t['31,30'] = { s: 1, c: { id: 'pastinaca', g: 0 } }; const R0 = Math.random; Math.random = () => 0.01; const n = s.nightEvents(t, 5, 6, 'spring'); Math.random = R0; return [n.fada, t['30,30'].c.g, t['31,30'].c.g]; });
  ok(fairy[0] >= 2 && fairy[1] === 11 && fairy[2] === 3, 'fada fez as plantas em volta crescerem: ' + fairy);
  const met = await ev(() => { const s = __sv, t = JSON.parse(JSON.stringify(s.W.farm.t)); let i = 0; const R0 = Math.random; Math.random = () => (i++ === 0 ? 0.08 : R0()); const n = s.nightEvents(t, 5, 6, 'spring'); Math.random = R0; if (n.meteoro) { s.setTile(n.meteoro, t[n.meteoro]); } return n.meteoro; });
  ok(!!met, 'meteorito caiu em ' + met);
  const [mx, my] = met.split(',').map(Number);
  await ev(([mx, my]) => { const s = __sv, P = s.P; s.goMap('farm', mx * 16 + 8, (my + 1) * 16 + 12, 0); P.dir = 0; P.sel = 1; }, [mx, my]);
  await p.waitForTimeout(500);
  await p.screenshot({ path: SHOTS + 'e1_meteor.png' });
  const ouro0 = await ev(() => __sv.count('ouro'));
  for (let i = 0; i < 14; i++) { await ev(([mx, my]) => { const P = __sv.P; P.x = mx * 16 + 8; P.y = (my + 1) * 16 + 12; P.dir = 0; P.energy = 200; __sv.act(); }, [mx, my]); await p.waitForTimeout(280); }
  ok(await ev(() => __sv.count('ouro')) > ouro0 && await ev(([k]) => !(__sv.tile(k) || {}).o, [met]), 'quebrou o meteorito e ganhou ouro');
  // manhã com as notícias da noite
  const morning = await ev(() => { const s = __sv; s.W.meta.night = { fada: 4, meteoro: '1,1', raio: 1 }; return s.nightLines(); });
  ok(/fada/.test(morning) && /meteorito/.test(morning) && /para-raios/.test(morning), 'a manhã conta o que aconteceu à noite');
  await closeAll();
  // 5) animais felizes: produto com qualidade
  await ev(() => { const s = __sv, d = s.W.meta.day; s.setFarm('b', 'bcoop', { type: 'coop', lv: 1, x: 8, y: 31, ready: d, feed: 5 }); for (let i = 0; i < 6; i++) s.setFarm('a', 'g' + i, { kind: 'galinha', name: 'G' + i, b: 'bcoop', age: 9, fr: 1000, pet: d, last: 0 }); });
  await nextDay();
  const eggs = await ev(() => Object.values(__sv.W.farm.b.bcoop.items || {}));
  ok(eggs.length > 0 && eggs.some(e => /#/.test(e)), 'galinhas felizes botaram ovos com qualidade: ' + eggs.join(' '));
  // 6) pesca perfeita sai em ouro
  await ev(() => { const s = __sv; s.P.inv = s.P.inv.map(x => (x && x.id === 'sardinha' ? null : x)); s.fishing = { phase: 'game', id: 'sardinha', diff: 1, barH: 118, bar: 1, bv: 0, fy: 60, fv: 0, target: 60, prog: 0.95, hold: true, tt: 0, water: 'ocean' }; document.getElementById('fish').hidden = false; });
  await p.waitForTimeout(1500);
  ok(await ev(() => (__sv.P.inv.find(x => x && x.id === 'sardinha') || {}).q === 2), 'pesca perfeita: sardinha de ouro');
  // 7) loja e receitas
  const shop = await ev(() => { __sv.openShop('pedro'); return document.querySelector('.win').innerText; });
  ok(/Adubo básico/.test(shop) && /Acelerador/.test(shop) && /Adubo de qualidade/.test(shop), 'Seu Pedro vende os adubos');
  await closeAll();
  await p.click('#bMenu'); await p.waitForTimeout(200); await p.click('[data-t="craft"]'); await p.waitForTimeout(200);
  const craft = await ev(() => document.querySelector('.win').innerText);
  ok(['Irrigador de qualidade', 'Irrigador de ouro', 'Fazedor de sementes', 'Para-raios', 'Adubo básico'].every(n => craft.includes(n)), 'receitas novas aparecem em Criar');
  await p.screenshot({ path: SHOTS + 'e1_craft.png' });
  await closeAll();
  // 8) desenhos no chão
  await ev(() => { const s = __sv; s.setTile('16,22', { s: 1, fe: 'adubobom' }); s.setTile('17,22', { s: 1, fe: 'acelerador' }); s.setTile('18,22', { s: 1, fe: 'adubo' }); s.setTile('16,24', { o: { k: 'irrigadorbom' } }); s.setTile('18,24', { o: { k: 'irrigadorouro' } }); s.setTile('20,24', { o: { k: 'fazedorsementes' } }); s.setTile('22,24', { o: { k: 'pararaios', in: 'raio', out: 'bateria', ready: 0 } }); s.goMap('farm', 19 * 16 + 8, 26 * 16 + 8, 0); });
  await p.waitForTimeout(600); await ev(() => document.querySelectorAll('#toasts > *').forEach(e => e.remove()));
  await p.screenshot({ path: SHOTS + 'e1_objs.png', clip: { x: 422 - 130, y: 195 - 140, width: 260, height: 170 } });
  console.log('erros', errs);
  await b.close();
})();
