// Vila nova: mapa maior em bairros, portas, caminhos dos moradores, rotinas, casas, conversas, momentos e mapa (jogo local)
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
  const setT = (min, day = 38, rain = false) => ev(([min, day, rain]) => { const s = __sv; s.W.meta.day = day; s.W.clock.day = day; s.P.lastDay = day; s.W.clock.min = min; s.W.clock.at = Date.now(); s.W.meta.rain = rain; s.W.meta.snow = false; }, [min, day, rain]);
  await closeAll(); await p.waitForTimeout(1000); await setT(720);
  // mapa e portas
  const town = await ev(() => { const m = __sv.getMap('town'); return { w: m.w, h: m.h, warps: m.warps.map(w => w.to) }; });
  ok(town.w === 80 && town.h === 56, 'vila maior: 80×56');
  const portas = await ev(() => { const s = __sv, t = s.getMap('town'), bad = [];
    for (const w of t.warps) { const m = s.getMap(w.to); if (!m) bad.push('sem mapa ' + w.to); else if (m.solid[w.ty * m.w + w.tx] && !['minetop'].includes(w.to)) bad.push('chega em parede: ' + w.to); }
    for (const id of new Set(t.warps.map(w => w.to))) { const m = s.getMap(id); if (!m || id === 'farm' || id === 'mata' || id === 'beach' || id === 'minetop') continue; const back = m.warps.find(w => w.to === 'town'); if (!back) bad.push('sem saída: ' + id); else if (t.solid[back.ty * t.w + back.tx]) bad.push('volta em parede: ' + id + ' ' + back.tx + ',' + back.ty); }
    for (const id of ['farm', 'mata', 'beach', 'minetop']) { const back = s.getMap(id).warps.find(w => w.to === 'town'); if (!back || t.solid[back.ty * t.w + back.tx]) bad.push('saída ruim de ' + id); }
    return bad; });
  ok(portas.length === 0, 'todas as portas e saídas levam e trazem para lugares livres ' + JSON.stringify(portas));
  // caminhos dos moradores pelas ruas
  const caminhos = await ev(() => { const s = __sv, bad = []; let n = 0;
    for (const [id, nn] of Object.entries(s.npcSchedOf ? { x: 1 } : {})) {}
    for (const id of ['pedro', 'claudio', 'rosa', 'marta', 'lia', 'bia', 'davi', 'nena', 'caio', 'cida', 'tonico']) for (const sc of ['sched', 'schedSun', 'schedRain']) { const L = (window.__npcs || {})[id]; }
    return { bad, n }; });
  const rotas = await ev(() => { const s = __sv, out = []; for (let min = 360; min < 1500; min += 30) { s.W.clock.min = min; s.W.clock.at = Date.now(); for (const id of ['pedro', 'claudio', 'rosa', 'marta', 'lia', 'bia', 'davi', 'nena', 'caio', 'cida', 'tonico']) { const p = s.npcPos(id); if (p && !s.getMap(p.map)) out.push(id + '@' + min); } } return out; });
  ok(rotas.length === 0, 'os moradores estão sempre em lugares que existem');
  const path = await ev(() => { const s = __sv, pts = s.vilaPath('town', [0, 'town', 36, 25], [0, 'town', 41, 36]), m = s.getMap('town'); return { n: pts.length, bloq: pts.slice(1, -1).filter(([x, y]) => m.solid[Math.floor((y - 6) / 16) * m.w + Math.floor(x / 16)]).length }; });
  ok(path.n >= 2 && path.bloq === 0, 'o Doutor Davi anda pela praça desviando da fonte: ' + JSON.stringify(path));
  // rotinas: dia comum, chuva, domingo e festa
  await setT(800, 38, false); const nena1 = await ev(() => __sv.npcPos('nena'));
  await setT(800, 38, true); const nena2 = await ev(() => __sv.npcPos('nena'));
  ok(nena1 && nena1.map === 'town' && nena2 && nena2.map === 'lar_nena', `chuva: a Vó Nena fica em casa (${nena1.map} → ${nena2.map})`);
  await setT(600, 42, false); const davi = await ev(() => __sv.npcPos('davi'));
  ok(davi && davi.map === 'town' && Math.abs(davi.x / 16 - 71) < 3, 'domingo: o Doutor Davi passeia no parque');
  await setT(1100, 39, false); const fest = await ev(() => { const p = __sv.npcPos('pedro'), b = __sv.VILA.booth; return p && p.map === 'town' && Math.hypot(p.x / 16 - b.x, p.y / 16 - b.y) < 8; });
  ok(fest, 'dia de festa: os moradores vão para a praça à tarde');
  // casas: abertas de dia, fechadas de noite
  await setT(1320, 38);
  await ev(() => { const s = __sv, [x, y] = s.VILA.casas.nena; s.goMap('town', (x + 3) * 16 + 8, (y + 5) * 16 + 4, 0); }); await p.waitForTimeout(700);
  await ev(() => { const s = __sv, [x, y] = s.VILA.casas.nena; s.P.x = (x + 3) * 16 + 8; s.P.y = (y + 3) * 16 + 10; s.checkWarp(); }); await p.waitForTimeout(500);
  ok(await ev(() => __sv.P.map) === 'town' && /fechada/.test(await ev(() => document.getElementById('toasts').innerText)), 'de noite a casa da Vó Nena está fechada');
  await setT(1200, 38);
  await ev(() => { const s = __sv, [x, y] = s.VILA.casas.nena; s.P.x = (x + 3) * 16 + 8; s.P.y = (y + 3) * 16 + 10; s.checkWarp(); }); await p.waitForTimeout(700);
  ok(await ev(() => __sv.P.map) === 'lar_nena', 'de dia dá para visitar a casa da Vó Nena');
  ok(await ev(() => { const a = __sv.npcPos('nena'), c = __sv.npcPos('caio'); return a && c && a.map === 'lar_nena' && c.map === 'lar_nena'; }), 'às 20h a Vó Nena e o Caio estão em casa');
  await clearToasts(); await p.waitForTimeout(300); await p.screenshot({ path: SHOTS + 'e15_lar.png' });
  // conversa entre moradores
  await setT(1060, 38);
  await ev(() => __sv.goMap('town', 45 * 16 + 8, 37 * 16 + 4, 0)); await p.waitForTimeout(900);
  const conv = await ev(() => { const s = __sv; for (let i = 0; i < 30 && !s.convos.length; i++) s.updateConvos(2); return s.convos.map(c => c.a + '+' + c.b); });
  ok(conv.length > 0, 'moradores conversam entre si: ' + conv.join(', '));
  await clearToasts(); await p.waitForTimeout(300); await p.screenshot({ path: SHOTS + 'e15_conversa.png' });
  // momento com 4 corações
  await ev(() => { const s = __sv; s.P.rel.pedro = { pts: 1000, talk: 0, gifts: [] }; s.openTalk('pedro'); }); await p.waitForTimeout(200);
  const mom = await ev(() => (document.querySelector('.win') || {}).innerText || '');
  ok(/Um momento com Seu Pedro/.test(mom) && await ev(() => __sv.count('s_morango')) >= 10, 'com 4 corações, o Seu Pedro conta uma história e dá um presente');
  await p.screenshot({ path: SHOTS + 'e15_momento.png' }); await closeAll();
  await ev(() => __sv.openTalk('pedro')); await p.waitForTimeout(150);
  ok(!/Um momento/.test(await ev(() => (document.querySelector('.win') || {}).innerText || '')), 'o momento acontece uma vez só');
  await closeAll();
  // mapa da vila no menu
  await setT(720, 38);
  await ev(() => document.getElementById('bMenu').click()); await p.waitForTimeout(150); await p.click('[data-t="mapa"]'); await p.waitForTimeout(300);
  const mapa = await ev(() => ({ cv: !!document.getElementById('mapcv'), txt: document.querySelector('.win').innerText }));
  ok(mapa.cv && /Onde está cada um/.test(mapa.txt) && /Seu Pedro/.test(mapa.txt) && /Armazém/.test(mapa.txt), 'aba Mapa mostra a vila e onde está cada morador');
  await p.screenshot({ path: SHOTS + 'e15_mapa.png' }); await closeAll();
  // as lojas continuam abrindo pela porta
  await ev(() => { const s = __sv, [x, y, w, h, dx] = s.VILA.store; s.goMap('town', dx * 16 + 8, (y + h + 1) * 16 + 10, 0); }); await p.waitForTimeout(700);
  await ev(() => { const s = __sv, [x, y, w, h, dx] = s.VILA.store; s.P.x = dx * 16 + 8; s.P.y = (y + h - 1) * 16 + 10; s.checkWarp(); }); await p.waitForTimeout(700);
  ok(await ev(() => __sv.P.map) === 'store', 'a porta do Armazém leva para dentro');
  console.log('erros', errs);
  await b.close();
})();
