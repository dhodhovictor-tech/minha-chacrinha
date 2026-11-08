
  // ================= moinho da chacrinha =================
  // Construído pela Rosa. Põe trigo, beterraba ou girassol e no dia seguinte sai farinha, açúcar ou óleo.
  // Estado no próprio prédio: b.mo = { d: dia em que entrou, i: { trigo: n, ... } (moendo), o: { farinha: n, ... } (pronto) }
  const MOAGEM = { trigo: ['farinha', 1], beterraba: ['acucar', 3], girassol: ['oleo', 1] };
  BUILDS.moinho = { names: ['Moinho'], w: 4, h: 4, unique: true, lvs: [{ gold: 3000, need: { madeira: 150, pedra: 80, mpinho: 30, fibra: 30 } }], desc: ['Mói trigo em farinha, beterraba em açúcar (3 de cada) e girassol em óleo. Fica pronto no dia seguinte.'] };
  B2.add('moinho');

  // beterraba: planta nova do outono, só para o açúcar (e para vender)
  CROPS.beterraba = { name: 'Beterraba', seed: 20, sell: 60, days: 6, seasons: ['fall'], kind: 'root', col: '#a8204a', leaf: '#4a8a3a', cat: 'veg' };
  ITEMS.beterraba = { name: 'Beterraba', cat: 'veg', sell: 60, energy: 30, col: '#a8204a', desc: 'No moinho vira 3 de açúcar.' };
  ITEMS.s_beterraba = { name: 'Sementes de beterraba', cat: 'seed', sell: 10, crop: 'beterraba', desc: 'Plante no outono. Fica pronta em 6 dias. No moinho, cada beterraba vira 3 de açúcar.' };

  // o que estava moendo de ontem fica pronto
  function moPronto(b) {
    const mo = b.mo || {}, i = mo.i || {};
    if (!Object.keys(i).length || W.meta.day <= (mo.d || 0)) return mo;
    const o = { ...(mo.o || {}) };
    for (const [k, n] of Object.entries(i)) { const [out, x] = MOAGEM[k]; o[out] = (o[out] || 0) + n * x; }
    return { d: mo.d, i: {}, o };
  }
  function moSalva(id, mo) { const b = farmB()[id]; if (b) setFarm('b', id, { ...b, mo }); }
  function openMoinho(id) {
    const b = farmB()[id]; if (!b) return;
    const mo = moPronto(b); if (mo !== b.mo) moSalva(id, mo);
    const moendo = Object.entries(mo.i || {}).filter(([, n]) => n > 0), pronto = Object.entries(mo.o || {}).filter(([, n]) => n > 0);
    const linha = (k) => { const [out, x] = MOAGEM[k], n = count(k); return `<div class="item"><img src="${iconURL(k)}" alt=""><span class="nm"><b>${item(k).name} → ${item(out).name}</b><small>${x > 1 ? `cada uma vira ${x}` : 'uma por uma'} · na mochila: ${n}</small></span><button class="btn g" data-a="moPoe" data-id="${id}" data-k="${k}" type="button" ${n ? '' : 'disabled'}>Colocar ${n || ''}</button></div>`; };
    openPanel(`<h2>Moinho</h2><canvas id="mocv" width="80" height="104" style="width:120px;height:156px;image-rendering:pixelated;display:block;margin:0 auto"></canvas>
      <p style="text-align:center;font-size:13px">Coloque hoje e pegue amanhã de manhã. Também dá para segurar o trigo, a beterraba ou o girassol e tocar no moinho.</p>
      ${pronto.length ? `<h3>Pronto</h3><div class="list">${pronto.map(([k, n]) => `<div class="item"><img src="${iconURL(k)}" alt=""><span class="nm"><b>${n} ${item(k).name.toLowerCase()}</b></span></div>`).join('')}</div><div class="row"><button class="btn g" data-a="moPega" data-id="${id}" type="button">Pegar tudo</button></div>` : ''}
      ${moendo.length ? `<h3>Moendo (pronto amanhã)</h3><div class="list">${moendo.map(([k, n]) => `<div class="item"><img src="${iconURL(k)}" alt=""><span class="nm">${n} ${item(k).name.toLowerCase()} → ${n * MOAGEM[k][1]} ${item(MOAGEM[k][0]).name.toLowerCase()}</span></div>`).join('')}</div>` : ''}
      <h3>Moer</h3><div class="list">${Object.keys(MOAGEM).map(linha).join('')}</div>`, 'moinho', id);
    const c = document.getElementById('mocv');
    if (c) { const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(building2Canvas('moinho', 64, 64, false), 0, 0); const save = ctx; ctx = x; drawPas(8, 36, 64, 0.4); ctx = save; }
  }
  function moPoe(id, k, n) {
    const b = farmB()[id]; if (!b || !MOAGEM[k] || n <= 0) return 0;
    const mo = moPronto(b), i = { ...(mo.i || {}) };
    removeItem(k, n); i[k] = (i[k] || 0) + n;
    moSalva(id, { d: W.meta.day, i, o: mo.o || {} }); sfx.pop();
    toast(`${n} ${item(k).name.toLowerCase()} no moinho. Amanhã sai ${n * MOAGEM[k][1]} ${item(MOAGEM[k][0]).name.toLowerCase()}!`, '', MOAGEM[k][0], 'moinho');
    return n;
  }
  function moinhoBuilding(id, b) {
    const s = held();
    if (s && MOAGEM[s.id]) { moPoe(id, s.id, count(s.id)); renderHotbar(); return true; }
    const mo = moPronto(b);
    if (Object.values(mo.o || {}).some(n => n > 0)) { moPega(id); return true; }
    openMoinho(id); return true;
  }
  function moPega(id) {
    const b = farmB()[id]; if (!b) return;
    const mo = moPronto(b), o = { ...(mo.o || {}) }, got = [];
    for (const [k, n] of Object.entries(o)) { if (n > 0 && addItem(k, n, true)) { got.push(`${n} ${item(k).name.toLowerCase()}`); delete o[k]; } }
    moSalva(id, { d: mo.d || 0, i: mo.i || {}, o }); if (got.length) { sfx.coin(); toast(`Do moinho: ${got.join(', ')}!`, 'big', null, 'moinho'); }
  }
  function moinhoAction(a, b) {
    if (a === 'moPoe') { moPoe(b.dataset.id, b.dataset.k, count(b.dataset.k)); renderHotbar(); openMoinho(b.dataset.id); return true; }
    if (a === 'moPega') { moPega(b.dataset.id); openMoinho(b.dataset.id); return true; }
    return false;
  }

  // ---------- desenho ----------
  function drawMoinho(w, h, night, snow) {
    const cx = w / 2;
    // base de pedra
    R(4, h - 18, w - 8, 18, '#8a8278'); for (let yy = h - 16; yy < h; yy += 5) for (let xx = 4 + ((yy / 5) & 1 ? 0 : 4); xx < w - 6; xx += 9) R(xx, yy, 8, 4, '#a8a096');
    // torre de madeira afinando para cima
    poly([[8, h - 16], [cx - 14, -6], [cx + 14, -6], [w - 8, h - 16]], '#c8a070');
    for (let yy = 0; yy < h - 16; yy += 5) { const f = yy / (h - 16), hw = 14 + f * (cx - 22); R(cx - hw, yy - 6, hw * 2, 1, '#a8804a'); }
    R(cx - 14, -6, 2, 6, '#8a6038');
    // telhado em cone
    poly([[cx - 18, -4], [cx, -30], [cx + 18, -4]], snow ? '#e8eef4' : '#8a3a2a'); poly([[cx, -30], [cx + 18, -4], [cx + 6, -4]], snow ? '#c8d4e0' : '#6a2a1e');
    R(cx - 19, -5, 38, 3, '#5a2216');
    // porta, janela e sacos de farinha
    R(cx - 7, h - 20, 14, 20, '#5a3418'); R(cx - 6, h - 19, 12, 19, '#7a4a24'); disc(cx, h - 20, 7, '#5a3418'); disc(cx, h - 20, 6, '#7a4a24'); R(cx + 3, h - 10, 2, 2, '#f4c83a');
    winPx(cx - 5, 14, 10, 9, night, '#e8d8b0');
    for (const [x, c] of [[w - 20, '#f4f0e8'], [w - 13, '#f4e8c8'], [8, '#c8a050']]) { R(x, h - 10, 8, 10, c); R(x + 2, h - 12, 4, 2, c); R(x + 1, h - 8, 6, 1, shade(c, -0.15)); }
  }
  // pás girando (desenhadas por cima, todo quadro)
  function drawPas(x, y, w, t) {
    const cx = x + w / 2, cy = y - 14, a0 = t * 0.9;
    for (let k = 0; k < 4; k++) {
      const a = a0 + k * Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a);
      const pt = (r, o) => [cx + ca * r - sa * o, cy + sa * r + ca * o];
      ctx.strokeStyle = '#5a3418'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(...pt(34, 0)); ctx.stroke();
      poly([pt(8, 1), pt(34, 1), pt(34, 9), pt(10, 7)], '#f4ecd8');
      ctx.strokeStyle = '#c8b898'; ctx.lineWidth = 1; for (const r of [16, 24]) { ctx.beginPath(); ctx.moveTo(...pt(r, 1)); ctx.lineTo(...pt(r, 8)); ctx.stroke(); }
    }
    disc(cx, cy, 3.5, '#5a3418'); disc(cx, cy, 1.8, '#a8703a');
  }

  // ícone da beterraba
  function paintIcon12(id) {
    if (id !== 'beterraba') return false;
    disc(8, 10, 5, '#8a1838'); disc(7, 9, 4, '#b8284a'); R(5, 7, 2, 2, '#d8586a'); R(8, 14, 1, 2, '#6a1028');
    for (const [x, c] of [[5, '#3a8a3a'], [8, '#4aa83a'], [11, '#3a8a3a']]) { R(x, 1, 2, 5, c); R(x, 1, 1, 1, '#6ac84a'); }
    R(7, 4, 2, 2, '#a8204a');
    return true;
  }
