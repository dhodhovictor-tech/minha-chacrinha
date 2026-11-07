// Prédios consertados, ruas arredondadas, moda da estação, paradas da mata de 5 em 5 e andares/clareiras especiais (jogo local)
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
  const panel = () => ev(() => (document.querySelector('.win') || {}).innerText || '');
  await closeAll(); await p.waitForTimeout(1200);
  await ev(() => { const s = __sv; s.W.clock.min = 720; s.W.clock.at = Date.now(); s.earn(80000); });

  // ---------- prédios e ruas ----------
  await ev(() => __sv.goMap('town', 50 * 16 + 8, 15 * 16 + 8, 1)); await p.waitForTimeout(900); await clearToasts();
  await p.screenshot({ path: SHOTS + 'e19_predios.png' });
  // ---------- moda ----------
  const shop = await ev(() => { const s = __sv; s.openShop('bia'); return (document.querySelector('.win') || {}).innerText; });
  ok(/Coleção de primavera/.test(shop) && /Vestido florido/.test(shop) && /Para ele/.test(shop), 'Ateliê da Bia abre na coleção da estação (primavera)');
  await p.screenshot({ path: SHOTS + 'e19_colecao.png' });
  const cols = await ev(() => { const s = __sv, out = {}, d0 = s.W.meta.day; for (const [d, nm] of [[5, 'spring'], [33, 'summer'], [61, 'fall'], [89, 'winter']]) { s.W.meta.day = d; out[nm] = s.modaList('moda').map(o => o.id); } s.W.meta.day = d0; return out; });
  ok(Object.values(cols).every(l => l.length === 4) && cols.summer.includes('vestidoverao') && cols.winter.includes('vestidola') && !cols.spring.includes('vestidola'), 'cada estação tem a sua coleção de 4 peças: ' + JSON.stringify(cols));
  ok(await ev(() => __sv.modaList('ele').length === 6), '"Para ele": dois conjuntos de 3 peças');
  await ev(() => { document.querySelector('[data-a="stab"][data-t="ele"]').click(); }); await p.waitForTimeout(200);
  ok(/Jaqueta de couro/.test(await panel()) && /Chapéu de rancheiro/.test(await panel()), 'aba "Para ele" mostra a jaqueta e o chapéu de rancheiro');
  await ev(() => { document.querySelector('[data-a="stab"][data-t="moda"]').click(); }); await p.waitForTimeout(200);
  for (const id of ['vestidoflorido', 'chapeuprimavera', 'sapatilhas']) { const r = await ev(id => { const b = document.querySelector(`[data-a="buy"][data-id="${id}"]`); if (!b) return (document.querySelector('.win') || {}).innerText.slice(0, 300); b.click(); return 'ok'; }, id); if (r !== 'ok') console.log('sem botão', id, r); await p.waitForTimeout(250); }
  ok(await ev(() => ['vestidoflorido', 'chapeuprimavera', 'sapatilhas'].every(id => __sv.P.inv.some(s => s && s.id === id))), 'comprou o vestido florido, o chapéu e as sapatilhas');
  await closeAll();
  const bon = await ev(() => { const s = __sv; for (const id of ['vestidoflorido', 'chapeuprimavera', 'sapatilhas']) s.equipSlot(s.P.inv.findIndex(x => x && x.id === id)); const d0 = s.W.meta.day; const pri = [s.roupaBuff('foraging'), s.roupaBuff('luck'), s.roupaBuff('speed')]; s.W.meta.day = 33; const ver = [s.roupaBuff('foraging'), s.roupaBuff('luck')]; s.W.meta.day = d0; return { pri, ver, eq: s.P.eq, pants: s.withEq(s.P.look, s.P.eq).pants }; });
  ok(bon.pri.join() === '1,1,1' && bon.ver.join() === '0,0', 'bônus da coleção valem na estação dela: ' + JSON.stringify(bon.pri) + ' / verão ' + JSON.stringify(bon.ver));
  ok(bon.eq.cp === 'vestidoflorido' && bon.eq.hd === 'chapeuprimavera' && bon.eq.bt === 'sapatilhas', 'vestiu as três peças');
  ok(/^#/.test(bon.pants) && bon.pants !== '#8496b0', 'de vestido, as pernas aparecem (sem a calça de antes): ' + bon.pants);
  await ev(() => __sv.goMap('town', 39 * 16 + 8, 30 * 16 + 8, 1)); await p.waitForTimeout(900); await clearToasts();
  await p.screenshot({ path: SHOTS + 'e19_vestido.png' });
  const ele = await ev(() => { const s = __sv, d0 = s.defTotal(); s.addItem('jaquetacouro', 1, true); s.equipSlot(s.P.inv.findIndex(x => x && x.id === 'jaquetacouro')); return { d: s.defTotal() - d0, a: s.roupaBuff('attack') }; });
  ok(ele.d === 1 && ele.a === 1, 'jaqueta de couro: +1 de defesa e +1 de ataque ' + JSON.stringify(ele));

  // ---------- mata: paradas de 5 em 5 ----------
  ok(await ev(() => JSON.stringify(__sv.mataParadas(25)) === '[1,5,10,15,20,25]' && JSON.stringify(__sv.mataParadas(13)) === '[1,5,10,13]'), 'paradas da cabana: 1, 5, 10, 15... (e a antiga 13 continua valendo)');
  await ev(() => { const s = __sv; s.W.meta.mataMax = 1; s.goMap('mata5', 0, 0, 0); }); await p.waitForTimeout(700);
  ok(await ev(() => __sv.W.meta.mataMax === 5), 'chegar na clareira 5 libera a parada na cabana');
  await ev(() => { const s = __sv; s.W.meta.mataMax = 20; s.goMap('mata', 5 * 16 + 8, 6 * 16 + 10, 0); }); await p.waitForTimeout(700);
  await ev(() => __sv.openCabana()); await p.waitForTimeout(200);
  const cab = await panel();
  ok(/Clareira 5/.test(cab) && /Clareira 15/.test(cab) && /Clareira 20/.test(cab) && !/Clareira 25/.test(cab), 'cabana mostra as paradas de 5 em 5 até a 20');
  await p.screenshot({ path: SHOTS + 'e19_cabana.png' }); await closeAll();

  // ---------- mina: andares especiais ----------
  const mt = await ev(() => { const s = __sv, out = {}; for (let n = 1; n < 120; n++) { const m = s.getMap('mine' + n); if (m.tipo) (out[m.tipo] = out[m.tipo] || []).push(n); } return out; });
  ok(['rico', 'infestado', 'cogumelos', 'buraco', 'bau'].every(k => mt[k] && mt[k].length), 'a mina tem andares especiais: ' + Object.entries(mt).map(([k, l]) => `${k} ${l.length}`).join(', '));
  ok(Object.values(mt).flat().every(n => n % 5 !== 0), 'os andares do elevador (de 5 em 5) continuam normais');
  ok(await ev(([l]) => l.every(n => { const m = __sv.getMap('mine' + n), sp = Object.values(m.spots).find(x => x.kind === 'avburaco'); return sp && sp.to > n && sp.to <= Math.ceil(n / 5) * 5; }), [mt.buraco]), 'o buraco nunca pula o andar do elevador');
  const inf = mt.infestado[0];
  await ev(n => { const s = __sv; s.W.meta.mineMax = 120; s.goMap('mine' + n, 0, 0, 1); }, inf); await p.waitForTimeout(700);
  const infR = await ev(() => { const s = __sv, m = s.curMap(), ms = s.monsters().filter(x => !x.dead), n0 = ms.length; const semEscada = !m.ladder; for (const mo of ms) s.killMonster(mo); return { n0, semEscada, ladder: m.ladder }; });
  ok(infR.n0 >= 6 && infR.semEscada && !!infR.ladder, `andar infestado: ${infR.n0} bichos, a escada só aparece depois de vencer todos`);
  ok(/Andar limpo/.test(await toasts()), 'aviso de andar limpo com prêmio');
  await clearToasts();
  const cg = mt.cogumelos[0];
  await ev(n => __sv.goMap('mine' + n, 0, 0, 1), cg); await p.waitForTimeout(700); await clearToasts();
  await p.screenshot({ path: SHOTS + 'e19_mina_cogumelos.png' });
  const pegou = await ev(() => { const s = __sv, m = s.curMap(), sp = Object.values(m.spots).find(x => x.kind === 'avpega'), id = sp.id, n0 = s.count(id); s.aventuraSpot(sp); const n1 = s.count(id); s.aventuraSpot(sp); return [n0, n1, s.count(id)]; });
  ok(pegou[1] === pegou[0] + 1 && pegou[2] === pegou[1], 'colhe o cogumelo da mina uma vez só ' + JSON.stringify(pegou));
  const bu = mt.buraco[0];
  await ev(n => __sv.goMap('mine' + n, 0, 0, 1), bu); await p.waitForTimeout(700);
  const pulo = await ev(() => { const s = __sv, sp = Object.values(s.curMap().spots).find(x => x.kind === 'avburaco'); s.aventuraSpot(sp); return [sp.to]; }); await p.waitForTimeout(700);
  ok(await ev(() => __sv.P.map) === 'mine' + pulo[0], 'pular no buraco leva ao andar ' + pulo[0]);
  const bz = mt.bau[0];
  await ev(n => __sv.goMap('mine' + n, 0, 0, 1), bz); await p.waitForTimeout(700); await clearToasts();
  const bauR = await ev(() => { const s = __sv, sp = Object.values(s.curMap().spots).find(x => x.kind === 'avbau'); s.aventuraSpot(sp); return document.getElementById('toasts').innerText; });
  ok(/Baú perdido na mina/.test(bauR), 'baú perdido na mina dá prêmio: ' + bauR.split('\n')[0]);

  // ---------- mata: clareiras especiais ----------
  const ft = await ev(() => { const s = __sv, out = {}; for (let n = 2; n < 48; n++) { const m = s.getMap('mata' + n); if (m.tipo) (out[m.tipo] = out[m.tipo] || []).push(n); } return out; });
  ok(Object.keys(ft).length >= 4, 'a mata tem clareiras especiais: ' + Object.entries(ft).map(([k, l]) => `${k} ${l.join('/')}`).join(', '));
  ok(Object.values(ft).flat().every(n => n % 12 !== 0), 'clareiras dos guardiões continuam só com o guardião');
  const forceTipo = async (tipo) => ev(tipo => { const s = __sv; for (let per = 0; per < 400; per++) for (let n = 2; n < 48; n++) { if (n % 12 === 0) continue; s.W.meta.day = per * 3 + 1; s.mataCache.clear(); const m = s.getMap('mata' + n); if (m.tipo === tipo) return [n, s.W.meta.day]; } return null; }, tipo);
  for (const tipo of ['colmeia', 'fadas', 'estouro', 'acampamento']) {
    const f = await forceTipo(tipo);
    if (!f) { ok(false, 'achou clareira do tipo ' + tipo); continue; }
    await ev(([n, d]) => { const s = __sv; s.W.meta.day = d; s.mataCache.clear(); s.W.clock.min = 720; s.goMap('mata' + n, 0, 0, 0); }, f); await p.waitForTimeout(700);
    const m = await ev(() => { const m = __sv.curMap(); return { tipo: m.tipo, sp: Object.entries(m.spots).filter(([, v]) => v.kind && v.kind.startsWith('av')).map(([k, v]) => [k, v.kind]), acamp: m.acamp }; });
    const goNear = async k => ev(k => { const s = __sv, [x, y] = k.split(',').map(Number); s.P.x = x * 16 + 8; s.P.y = (y + 1) * 16 + 10; s.P.dir = 0; }, k);
    if (tipo === 'colmeia') {
      await ev(k => { const s = __sv, [x, y] = k.split(',').map(Number); s.P.x = x * 16 + 40; s.P.y = (y + 3) * 16 + 10; s.P.dir = 2; }, m.sp[0][0]); await closeAll(); await p.waitForTimeout(400); await clearToasts();
      await p.screenshot({ path: SHOTS + 'e19_colmeia.png' });
      await goNear(m.sp[0][0]);
      const r = await ev(() => { const s = __sv, n0 = s.count('melsilvestre'), v0 = s.monsters().filter(x => x.kind === 'vespa' && !x.dead).length; s.act(); return { mel: s.count('melsilvestre') - n0, vespas: s.monsters().filter(x => x.kind === 'vespa' && !x.dead).length - v0 }; });
      ok(r.mel >= 2 && r.vespas === 3, 'colmeia selvagem: mel silvestre e 3 vespas bravas ' + JSON.stringify(r));
    }
    if (tipo === 'fadas') {
      await ev(k => { const s = __sv, [x, y] = k.split(',').map(Number); s.P.x = x * 16 + 8; s.P.y = (y + 3) * 16 + 10; s.P.dir = 0; s.W.clock.min = 1230; }, m.sp[0][0]); await closeAll(); await p.waitForTimeout(400); await clearToasts();
      await p.screenshot({ path: SHOTS + 'e19_fadas.png' });
      const r = await ev(() => { const s = __sv, sp = Object.values(s.curMap().spots).find(x => x.kind === 'avfadas'); s.aventuraSpot(sp); return s.P.buff && s.P.buff.name; });
      ok(r === 'Bênção das fadas', 'círculo das fadas dá uma bênção para o dia');
    }
    if (tipo === 'estouro') {
      // o dia do teste volta sozinho no banco local; marca uma clareira do período atual como estouro
      await ev(() => { const s = __sv, m = s.getMap('mata10'); m.tipo = 'estouro'; m.estouro = true; s.goMap('mata10', 0, 0, 0); }); await p.waitForTimeout(700);
      const r = await ev(() => { const s = __sv, js = s.monsters().filter(x => x.estouro); for (const mo of js) s.killMonster(mo); return js.length; }); await p.waitForTimeout(200);
      ok(r >= 4 && /bando de javalis/.test(await toasts()), `bando de ${r} javalis: vencer todos dá prêmio`);
    }
    if (tipo === 'acampamento') {
      await ev(([x, y]) => { const s = __sv; s.P.x = x * 16 + 8; s.P.y = (y + 3) * 16 + 10; s.P.dir = 0; s.W.clock.min = 1150; }, m.acamp); await closeAll(); await p.waitForTimeout(500); await clearToasts();
      await p.screenshot({ path: SHOTS + 'e19_acampamento.png' });
      const r = await ev(([x, y]) => { const m = __sv.curMap(); return !!(m.wood[(x + 1) + ',' + (y + 1)] && m.wood[(x + 1) + ',' + (y + 1)].kind === 'bau') && Object.values(m.spots).some(v => v.kind === 'avfogo'); }, m.acamp);
      ok(r, 'acampamento abandonado: barraca, fogueira e baú');
    }
  }
  console.log('erros', errs);
  await b.close();
})();
