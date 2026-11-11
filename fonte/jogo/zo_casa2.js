
  // ================= casa por dentro: reforma, paredes e piso, mover móveis, aquário e estante de troféus =================
  // W.farm.reforma = { lv, d } (pronta no dia seguinte a d) · W.farm.estilo = { papel, piso, tem: { id: 1 } }
  // W.farm.aquario = { "x,y" do aquário: { lv, p: "peixe1,peixe2" } } · W.farm.casaIni = 1 (decoração antiga virou móvel)

  // ---------- reforma: a casa cresce para o lado ----------
  const REFORMAS = [
    null,
    { name: 'Sala de estar', gold: 12000, need: { madeira: 200, mpinho: 100, mcarvalho: 60, pedra: 100 }, desc: 'A casa ganha uma sala nova à direita, com lareira e espaço para sofá, aquário e o que mais quiserem.' },
    { name: 'Sala das lembranças', gold: 35000, need: { mcarvalho: 120, mipe: 80, madeiralei: 25, barraferro: 5 }, desc: 'Mais um cômodo, perfeito para a estante de troféus e um aquário bem grande.' },
  ];
  const casaLv = () => { const r = W.farm && W.farm.reforma; return !r ? 0 : W.meta.day > r.d ? r.lv : r.lv - 1; };
  const casaObra = () => { const r = W.farm && W.farm.reforma; return !!r && W.meta.day <= r.d; };

  // ---------- papel de parede e piso ----------
  const PAPEIS = {
    classico: { name: 'Listrado bege (o de sempre)', gold: 0 },
    rosa: { name: 'Listrado rosa', gold: 1500, rod: '#c87a8a' },
    floral: { name: 'Florzinhas no verde', gold: 2000, rod: '#5a8a4a' },
    lavanda: { name: 'Lavanda de bolinhas', gold: 2000, rod: '#7a6aa8' },
    xadrez: { name: 'Xadrez de vichy', gold: 2200, rod: '#a83a3a' },
    estrelas: { name: 'Céu estrelado', gold: 3500, rod: '#1a2448' },
    tijolo: { name: 'Tijolinho branco', gold: 2500, rod: '#8a8a92' },
    lambri: { name: 'Lambri de madeira', gold: 3000, rod: '#5a3418', need: { mcarvalho: 20 } },
  };
  const PISOS = {
    tabua: { name: 'Tábua clara (o de sempre)', gold: 0 },
    escuro: { name: 'Tábua escura', gold: 2000, need: { mcarvalho: 25 } },
    taco: { name: 'Taco espinha de peixe', gold: 3000, need: { mipe: 20 } },
    ladrilho: { name: 'Ladrilho hidráulico', gold: 3500, need: { pedra: 60 } },
    xadrez: { name: 'Xadrez preto e branco', gold: 3000, need: { pedra: 40, carvao: 10 } },
  };
  const estilo = () => (W.farm && W.farm.estilo) || {};
  const hsh = (x, y, s) => hash(x, y, s);
  // cor de um pixel da parede ou do chão de casa (null = desenho de sempre)
  function casaPx(m, gt, px, py, tx, ty) {
    if (gt === G.WALL && m.papel && m.papel !== 'classico' && m.at(tx, ty + 1) !== G.WALL) {
      const ly = py % T;
      if (ly < 2 || ly === 10) return null;
      if (ly > 10) { const r = PAPEIS[m.papel].rod; return rgb(ly === 15 ? shade(r, -0.3) : (px % 8) === 0 ? shade(r, -0.2) : r); }
      switch (m.papel) {
        case 'rosa': return rgb((px % 6) < 3 ? '#f4c0d0' : '#f8dce4');
        case 'floral': { const fx = (px + (ly > 5 ? 4 : 0)) % 8, on = ly === 4 || ly === 8; return rgb(on && fx === 2 ? '#f48ab8' : on && (fx === 1 || fx === 3) ? '#fbd0e0' : (ly === 3 || ly === 9) && fx === 2 ? '#4aa83a' : '#d8ecc8'); }
        case 'lavanda': return rgb((px % 6 === 2 && ly % 4 === 3) || (px % 6 === 5 && ly % 4 === 1) ? '#ffffff' : '#c8b8e8');
        case 'xadrez': { const a = (px >> 2) % 2, b = (ly >> 2) % 2; return rgb(a && b ? '#c84a4a' : a || b ? '#e8a0a0' : '#f8ece4'); }
        case 'estrelas': { const h = hsh(px, ly, 41); return rgb(h > 0.97 ? '#f4e8a0' : h > 0.94 ? '#8a9ad8' : ly < 5 ? '#24305e' : '#2a3a6a'); }
        case 'tijolo': { const row = Math.floor((ly - 2) / 3), lx = (px + (row % 2) * 4) % 8; return rgb((ly - 2) % 3 === 2 || lx === 0 ? '#c8c4bc' : hsh(px >> 3, row, 5) < 0.3 ? '#e8e4dc' : '#f4f0e8'); }
        case 'lambri': return rgb((px % 5) === 0 ? '#5a3418' : (px % 5) === 1 ? '#a8703a' : hsh(px / 5 | 0, 0, 3) < 0.5 ? '#8a5428' : '#94602e');
      }
    }
    if (gt === G.WOOD && m.piso && m.piso !== 'tabua') {
      switch (m.piso) {
        case 'escuro': { const row = Math.floor(py / 5), ly = py % 5, j = (px + hsh(row, 0, 9) * 48) % 48 | 0, h = hsh(row, Math.floor((px + hsh(row, 0, 9) * 48) / 48), 4); return rgb(ly === 4 || j === 0 ? '#2a160a' : ly === 0 ? '#6a4024' : h < 0.5 ? '#4a2a16' : '#55321a'); }
        case 'taco': { const bx = px >> 3, by = py >> 3, hor = (bx + by) % 2, lx = px % 8, ly = py % 8; const e = hor ? ly % 4 === 3 || lx === 7 : lx % 4 === 3 || ly === 7; return rgb(e ? '#7a4a24' : hor ? '#c8884a' : '#b8783e'); }
        case 'ladrilho': { const lx = px % 16, ly = py % 16, dx = Math.abs(lx - 7.5), dy = Math.abs(ly - 7.5); if (lx === 0 || ly === 0) return rgb('#b8ac98'); if (dx + dy < 3) return rgb('#c84a3a'); if (dx + dy < 6 && (dx < 1 || dy < 1)) return rgb('#3a7a9a'); if (dx > 5.5 && dy > 5.5) return rgb('#3a7a9a'); return rgb(Math.abs(dx - dy) < 0.6 && dx + dy < 11 ? '#e8b850' : '#f0e6d4'); }
        case 'xadrez': { const d = ((px >> 3) + (py >> 3)) % 2, e = px % 8 === 0 || py % 8 === 0; return rgb(e ? (d ? '#3a3a42' : '#d8d4cc') : d ? '#24242a' : '#f4f2ec'); }
      }
    }
    return null;
  }

  // a casa certa (tamanho da reforma, papel e piso) e a decoração antiga como móveis
  const DECOR_ANTIGA = [['5,2', 'tvcasa'], ['8,2', 'plantacasa'], ['1,8', 'plantacasa'], ['11,5', 'mesacozinha']];
  let casaIniFeito = false, lareiraFeita = false;
  function casaSync() {
    if (!W.farm || !MAPS.house) return;
    const lv = casaLv(), e = estilo();
    if ((MAPS.house.lv || 0) !== lv) MAPS.house = buildHouse(lv);
    const m = MAPS.house; m.papel = e.papel || 'classico'; m.piso = e.piso || 'tabua'; m.gkey = `house|${lv}|${m.papel}|${m.piso}`;
    if (!W.farm.casaIni && !casaIniFeito && W.farm.t && P) {
      casaIniFeito = true; setFarmVal('casaIni', 1);
      for (const [k, id] of DECOR_ANTIGA) { const [x, y] = k.split(',').map(Number), f = MOVEIS[id]; let ok = true; for (let dy = 0; dy < f.h; dy++) for (let dx = 0; dx < f.w; dx++) if (movelAt(x + dx, y + dy)) ok = false; if (ok) setFarm('casa', k, id); }
    }
    if (lv >= 1 && !W.farm.lareiraIni && !lareiraFeita) { lareiraFeita = true; setFarmVal('lareiraIni', 1); if (!movelAt(19, 2) && !movelAt(20, 2)) setFarm('casa', '19,2', 'lareira'); }
  }

  // ---------- móveis novos ----------
  Object.assign(MOVEIS, {
    tvcasa: { name: 'Televisão', w: 2, h: 1, gold: 1500, need: { barracobre: 2, quartzo: 1 }, desc: 'A TV de casa: previsão, receitas e dicas.' },
    plantacasa: { name: 'Planta no vaso', w: 1, h: 1, gold: 200, need: { fibra: 10 }, desc: 'Uma plantinha para qualquer canto.' },
    mesacozinha: { name: 'Mesa da cozinha', w: 2, h: 2, gold: 600, need: { madeira: 30 }, desc: 'A mesa de sempre, com toalha xadrez.' },
    lareira: { name: 'Lareira de pedra', w: 2, h: 1, gold: 3000, need: { pedra: 80, barraferro: 1 }, luz: true, desc: 'Fogo quentinho. Aquece a casa nas noites de inverno.' },
    sofa: { name: 'Sofá de dois lugares', w: 2, h: 1, gold: 2500, need: { mcarvalho: 15, fibra: 40, tecido: 1 }, desc: 'Para os dois verem TV juntinhos.' },
    aquario: { name: 'Aquário', w: 3, h: 1, gold: 4000, need: { mcarvalho: 15, quartzo: 6, barraferro: 2 }, luz: true, desc: 'Cabem 3 peixes, e dá para aumentar até 7. Lendários também!' },
    estantetrofeus: { name: 'Estante de troféus', w: 2, h: 1, gold: 3000, need: { mipe: 12, barraouro: 1 }, desc: 'Mostra os chefes, guardiões e peixes lendários que vocês venceram.' },
  });
  for (const id of ['tvcasa', 'plantacasa', 'mesacozinha', 'lareira', 'sofa', 'aquario', 'estantetrofeus']) { const f = MOVEIS[id]; ITEMS[id] = { name: f.name, cat: 'movel', sell: Math.round(f.gold / 3), desc: `${f.desc} Segure dentro de casa e toque no chão para colocar${f.w > 1 || f.h > 1 ? ` (ocupa ${f.w}×${f.h})` : ''}.` }; }

  // ---------- aquário ----------
  const AQ_MAX = 4, aqCap = aq => 3 + (aq.lv || 0);
  const aqOf = k => { const a = W.farm.aquario && W.farm.aquario[k]; return { lv: (a && a.lv) || 0, p: a && a.p ? a.p.split(',').filter(Boolean) : [] }; };
  const aqSave = (k, aq) => setFarm('aquario', k, { lv: aq.lv, p: aq.p.join(',') || '' });
  const aqUp = lv => ({ gold: 2500 * (lv + 1), need: { quartzo: 3 + lv * 2, mcarvalho: 8 + lv * 4, ...(lv >= 2 ? { barraouro: lv - 1 } : {}) } });
  function openAquario(k) {
    const aq = aqOf(k), cap = aqCap(aq), inv = P.inv.map((s, i) => [s, i]).filter(([s]) => s && item(s.id).cat === 'fish');
    const up = aq.lv < AQ_MAX ? aqUp(aq.lv) : null, upOk = up && gold() >= up.gold && Object.entries(up.need).every(([kk, n]) => count(kk) >= n);
    const row = (id, right) => `<div class="item"><img src="${iconURL(id)}" alt=""><span class="nm">${item(id).name}${item(id).legend ? ' <b style="color:#b8861a">★ lendário</b>' : ''}</span>${right}</div>`;
    openPanel(`<h2>Aquário</h2>
      <canvas id="aqcv" width="160" height="92" style="width:100%;max-width:480px;image-rendering:pixelated;display:block;margin:0 auto;border-radius:8px;border:3px solid #3a2a1a;background:#1a3a5a"></canvas>
      <p style="text-align:center"><b>${aq.p.length} de ${cap} peixes</b></p>
      ${aq.p.length ? `<h3>Nadando aqui</h3><div class="list">${aq.p.map((id, i) => row(id, `<button class="btn" data-a="aqTira" data-k="${k}" data-i="${i}" type="button">Tirar</button>`)).join('')}</div>` : ''}
      <h3>Peixes da mochila</h3>${inv.length ? `<div class="list">${inv.map(([s, i]) => row(s.id, `<button class="btn g" data-a="aqPoe" data-k="${k}" data-i="${i}" type="button" ${aq.p.length >= cap ? 'disabled' : ''}>Colocar</button>`)).join('')}</div>` : '<p style="text-align:center;font-size:13px">Nenhum peixe na mochila. Vá pescar!</p>'}
      ${up ? `<h3>Aumentar o aquário</h3><div class="item"><span class="nm">Mais uma vaga (fica com ${cap + 1})<small>${fmt(up.gold)} ₲ · ${needTxtC(up.need)}</small></span><button class="btn g" data-a="aqUp" data-k="${k}" type="button" ${upOk ? '' : 'disabled'}>Aumentar</button></div>` : '<p style="text-align:center">O aquário já está no tamanho máximo: 7 peixes!</p>'}
      <div class="row"><button class="btn" data-a="movelMove" data-k="${k}" type="button">Mover</button><button class="btn" data-a="movelPick" data-k="${k}" type="button">Guardar na mochila</button></div>`, 'aquario', k);
    aqAnim();
  }
  let aqRaf = 0;
  function aqAnim() {
    cancelAnimationFrame(aqRaf);
    const step = () => {
      const c = document.getElementById('aqcv');
      if (!c || !panelOpen || panelKind !== 'aquario') return;
      const save = ctx; ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = false;
      try { ctx.clearRect(0, 0, c.width, c.height); drawTank(0, 0, c.width, c.height, aqOf(panelArg), performance.now() / 1000, true); } catch (e) { console.warn(e); }
      ctx = save; aqRaf = requestAnimationFrame(step);
    };
    aqRaf = requestAnimationFrame(step);
  }
  // o tanque: água em degradê, raios de luz, areia, pedrinhas, algas balançando, bolhas, enfeites e os peixes nadando
  function drawTank(x, y, w, h, aq, t, big) {
    const k = big ? 3 : 1, sandH = Math.round(h * 0.2), wy = y + (big ? 6 : 3), bot = y + h - sandH;
    const g = ctx.createLinearGradient(0, wy, 0, y + h); g.addColorStop(0, '#8ad8f4'); g.addColorStop(0.55, '#3a8ac8'); g.addColorStop(1, '#245a98');
    ctx.fillStyle = g; ctx.fillRect(x, wy, w, y + h - wy);
    R(x, y, w, wy - y, '#c8e8f4'); ctx.globalAlpha = 0.25; R(x, y, w, wy - y, '#ffffff'); ctx.globalAlpha = 1;
    // raios de luz
    ctx.globalAlpha = 0.09 + Math.sin(t * 0.8) * 0.03;
    for (let i = 0; i < 3; i++) { const rx = x + w * (0.15 + i * 0.3) + Math.sin(t * 0.5 + i) * 3 * k; poly([[rx, wy], [rx + 6 * k, wy], [rx + 14 * k, bot], [rx + 4 * k, bot]], '#ffffff'); }
    ctx.globalAlpha = 1;
    // superfície brilhando
    R(x, wy, w, k, '#d8f4ff'); for (let i = 0; i < 6; i++) R(x + ((t * 6 * k + i * w / 6) % w), wy + k, 2 * k, k, '#ffffff');
    // areia e pedrinhas
    R(x, bot, w, y + h - bot, '#e0c888'); R(x, bot, w, k, '#f0dca0');
    for (let i = 0; i < 14; i++) { const px = x + Math.floor(hsh(i, 3, 7) * (w - 2 * k)), py = bot + 1 * k + Math.floor(hsh(i, 5, 7) * (sandH - 2 * k)); R(px, py, k + (i % 3 ? 0 : k), k, ['#b89a68', '#a8a8b0', '#e8a8a0', '#9ab8c8', '#c8b080'][i % 5]); }
    // pedra com arco à direita
    oval(x + w * 0.82, bot, 9 * k, 6 * k, '#6a6a78'); oval(x + w * 0.82, bot - k, 7 * k, 5 * k, '#8a8a98'); oval(x + w * 0.82, bot + k, 3 * k, 3 * k, '#2a4a78'); R(x + w * 0.79, bot - 5 * k, 3 * k, k, '#a8a8b8');
    // castelinho (aquário maior) e baú com bolhas (aquário máximo)
    if (aq.lv >= 2) { const cx = x + w * 0.62; R(cx, bot - 10 * k, 8 * k, 10 * k, '#c8a888'); for (let i = 0; i < 3; i++) R(cx + i * 3 * k, bot - 12 * k, 2 * k, 2 * k, '#c8a888'); R(cx + 3 * k, bot - 5 * k, 2 * k, 5 * k, '#3a2a28'); R(cx + k, bot - 9 * k, k, 2 * k, '#3a2a28'); R(cx + 6 * k, bot - 9 * k, k, 2 * k, '#3a2a28'); }
    if (aq.lv >= 4) { const bx = x + w * 0.3; R(bx, bot - 4 * k, 7 * k, 4 * k, '#8a5a2a'); R(bx, bot - 6 * k, 7 * k, 2 * k, '#a8703a'); R(bx + 3 * k, bot - 4 * k, k, k, '#f4c83a'); if (Math.sin(t * 2) > 0.5) disc(bx + 4 * k, bot - 8 * k - ((t * 8) % 6) * k, k, '#e8f8ff'); }
    // algas balançando
    const algas = big ? 7 : 5;
    for (let i = 0; i < algas; i++) {
      const ax = x + (0.06 + i / algas * 0.9) * w + hsh(i, 1, 9) * 4 * k, hh = (0.35 + hsh(i, 2, 9) * 0.35) * (bot - wy), c = i % 3 === 0 ? '#2a8a3a' : i % 3 === 1 ? '#3aa848' : '#6ab83a';
      for (let s = 0; s < hh; s += k) { const sw = Math.sin(t * 1.6 + i * 1.3 + s * 0.12 / k) * (s / hh) * 3 * k; R(ax + sw, bot - s, (s < hh * 0.7 ? 2 : 1) * k, k, s % (4 * k) < k ? shade(c, 0.2) : c); }
    }
    // bolhas da pedrinha de ar
    const ax = x + w * 0.08;
    R(ax - k, bot - k, 3 * k, k, '#5a5a62');
    for (let i = 0; i < 6; i++) { const p = (t * 0.45 + i / 6) % 1, by = bot - 2 * k - p * (bot - wy - 2 * k), bx = ax + Math.sin(p * 9 + i) * 2 * k; disc(bx, by, (big ? 1.4 : 0.8) * (0.6 + p * 0.6) * k, '#e8f8ff'); }
    // peixes
    const n = aq.p.length;
    aq.p.forEach((id, i) => {
      const ph = hsh(i, id.length, 13) * 6.28, sp = 0.18 + hsh(i, 3, 13) * 0.22, lend = item(id).legend;
      const sc = (big ? 1 : 0.42) * (lend ? 1.3 : 1), fw = 16 * sc;
      const u = Math.sin(t * sp + ph), vx = Math.cos(t * sp + ph), dir = vx >= 0 ? 1 : -1;
      const fx = x + 3 * k + (0.5 + 0.5 * u) * (w - 6 * k - fw), lane = wy + 3 * k + ((i + 0.5) / Math.max(n, 3)) * (bot - wy - 10 * k - 8 * sc);
      const fy = lane + Math.sin(t * 0.9 + ph * 2) * 1.5 * k;
      ctx.save(); ctx.translate(Math.round(fx + (dir > 0 ? fw : 0)), Math.round(fy)); ctx.scale(-dir * sc, sc); ctx.drawImage(iconCanvas(id), 0, 0); ctx.restore();
      if (lend && Math.sin(t * 3 + i) > 0.3) { R(fx + hsh(i, Math.floor(t * 2), 3) * fw, fy - k, k, k, '#fff8c0'); }
    });
    // vidro: reflexos e moldura
    ctx.globalAlpha = 0.18; poly([[x + 3 * k, y], [x + 9 * k, y], [x + 2 * k, y + h], [x - 4 * k, y + h]], '#ffffff'); poly([[x + 12 * k, y], [x + 14 * k, y], [x + 7 * k, y + h], [x + 5 * k, y + h]], '#ffffff'); ctx.globalAlpha = 1;
  }

  // ---------- desenho dos móveis novos ----------
  function trofeus() {
    const b = Object.keys(W.meta.bosses || {}).length, f = Object.keys(W.meta.fbosses || {}).length, l = Object.keys((P && P.flags && P.flags.lend) || {}).length;
    return { b, f, l };
  }
  function drawMovel2(id, px, py, t, night, k) {
    switch (id) {
      case 'tvcasa': blit(buildingCanvas('tv', 32, 16, night), px - 8, py - 36); return true;
      case 'plantacasa': blit(buildingCanvas('plant', 16, 16, false), px - 8, py - 36); return true;
      case 'mesacozinha': blit(buildingCanvas('table', 32, 32, false), px - 8, py - 36); return true;
      case 'lareira': {
        shadowAt(px + 16, py + 14, 15, 2);
        R(px, py - 18, 32, 32, '#7a7268'); for (let yy = -16; yy < 12; yy += 5) for (let xx = (yy / 5) & 1 ? 0 : 4; xx < 32; xx += 8) R(px + xx, py + yy, 7, 4, '#9a9288');
        R(px - 2, py - 20, 36, 4, '#5a4a3a'); R(px - 2, py - 20, 36, 1, '#8a6a4a');
        R(px + 7, py - 6, 18, 18, '#1a100a'); R(px + 8, py - 5, 16, 1, '#3a2418');
        for (const dx of [10, 16, 21]) R(px + dx - 3, py + 9, 7, 2, '#6a3a1a');
        for (let i = 0; i < 3; i++) { const fl = Math.sin(t * 10 + i * 2) * 1.5; disc(px + 11 + i * 5, py + 6 - fl, 3 - (i % 2) * 0.5, '#ff7a1a'); disc(px + 11 + i * 5, py + 5 - fl, 1.6, '#ffd84a'); }
        R(px + 4, py - 17, 4, 3, '#c83a3a'); R(px + 24, py - 18, 4, 4, '#e8d8b0'); R(px + 25, py - 17, 2, 2, '#a8d8f0');
        return true;
      }
      case 'sofa': {
        shadowAt(px + 16, py + 14, 15, 2);
        R(px + 1, py - 6, 30, 10, '#4a6aa8'); R(px + 2, py - 5, 28, 2, '#6a8ac8'); R(px, py + 2, 32, 8, '#3a5a98'); R(px + 2, py + 3, 13, 4, '#5a7ab8'); R(px + 17, py + 3, 13, 4, '#5a7ab8');
        R(px - 1, py - 2, 4, 12, '#2a4a88'); R(px + 29, py - 2, 4, 12, '#2a4a88'); R(px + 2, py + 10, 2, 4, '#5a3418'); R(px + 28, py + 10, 2, 4, '#5a3418');
        R(px + 4, py - 3, 6, 5, '#f4c83a'); R(px + 22, py - 3, 6, 5, '#e86a8a');
        return true;
      }
      case 'aquario': {
        const aq = k ? aqOf(k) : { lv: 0, p: [] };
        shadowAt(px + 24, py + 14, 22, 2);
        // móvel de madeira com portinhas
        R(px, py, 48, 14, '#5a3418'); R(px + 1, py + 1, 46, 12, '#7a4a28'); for (const dx of [2, 25]) { R(px + dx, py + 3, 21, 8, '#8a5a32'); R(px + dx + 19, py + 6, 1, 2, '#f4c83a'); }
        // tanque
        R(px + 1, py - 30, 46, 31, '#22222a'); drawTank(px + 2, py - 28, 44, 28, aq, t, false);
        R(px, py - 32, 48, 3, '#3a3a44'); R(px + 4, py - 31, 12, 1, '#6a6a78'); if (night) { ctx.globalAlpha = 0.25; R(px + 2, py - 28, 44, 6, '#fff8d0'); ctx.globalAlpha = 1; }
        R(px + 1, py - 1, 46, 1, '#1a1a22');
        return true;
      }
      case 'estantetrofeus': {
        const tr = trofeus();
        shadowAt(px + 16, py + 14, 14, 2);
        R(px + 1, py - 22, 30, 36, '#5a2a10'); R(px + 3, py - 20, 26, 32, '#3a1a0a');
        for (let r = 0; r < 3; r++) R(px + 3, py - 10 + r * 10, 26, 2, '#8a4a1a');
        const cup = (x, y, c) => { R(x, y, 5, 3, c); R(x + 1, y + 3, 3, 1, shade(c, -0.25)); R(x + 2, y + 4, 1, 2, c); R(x + 1, y + 6, 3, 1, shade(c, -0.25)); R(x - 1, y, 1, 2, c); R(x + 5, y, 1, 2, c); R(x + 1, y, 1, 1, shade(c, 0.4)); };
        for (let i = 0; i < Math.min(4, tr.b); i++) cup(px + 5 + i * 6, py - 17, '#f4c83a');
        for (let i = 0; i < Math.min(4, tr.f); i++) cup(px + 5 + i * 6, py - 7, '#5ab84a');
        for (let i = 0; i < Math.min(3, tr.l); i++) { R(px + 5 + i * 8, py + 2, 7, 5, '#c8a050'); R(px + 6 + i * 8, py + 3, 5, 3, '#3a8ac8'); R(px + 7 + i * 8, py + 4, 3, 1, '#f4f0e8'); }
        if (!tr.b && !tr.f && !tr.l) { R(px + 12, py - 16, 8, 5, '#c8b8a0'); R(px + 13, py - 15, 6, 3, '#f4f0e8'); }
        if (Math.sin(t * 2) > 0.7) R(px + 7, py - 18, 1, 1, '#ffffff');
        return true;
      }
    }
    return false;
  }
  function trofeusHTML(k) {
    const tr = trofeus(), lend = Object.keys((P.flags && P.flags.lend) || {}).map(id => item(id).name);
    openPanel(`<h2>Estante de troféus</h2><div class="list">
      <div class="item"><span class="nm"><b>Chefes da mina vencidos: ${tr.b} de ${Object.keys(BOSSES).length}</b><small>${Object.keys(W.meta.bosses || {}).map(n => BOSSES[n].name).join(', ') || 'Nenhum ainda.'}</small></span></div>
      <div class="item"><span class="nm"><b>Guardiões da mata vencidos: ${tr.f} de ${Object.keys(FBOSSES).length}</b><small>${Object.keys(W.meta.fbosses || {}).map(n => FBOSSES[n].name).join(', ') || 'Nenhum ainda.'}</small></span></div>
      <div class="item"><span class="nm"><b>Peixes lendários pescados: ${lend.length} de ${Object.keys(LEGENDS).length}</b><small>${lend.join(', ') || 'Nenhum ainda.'}</small></span></div>
    </div><div class="row"><button class="btn" data-a="movelMove" data-k="${k}" type="button">Mover</button><button class="btn" data-a="movelPick" data-k="${k}" type="button">Guardar na mochila</button></div>`, 'movel', k);
  }

  // ---------- mover móveis (o mesmo jeito de mudar as máquinas de lugar) ----------
  function movStart(k) {
    const id = casa()[k], f = MOVEIS[id]; if (!f) return;
    closePanel();
    const [x, y] = k.split(',').map(Number);
    placing = { casa: k, id, x, y };
    toast(`Mova com o círculo ou toque no chão. Usar coloca aqui, Mochila cancela.`, 'big');
  }
  function drawMovPlacing() {
    const p = placing, f = movelDims(p.casa, p.id), ok = canPlaceMovel(curMap(), p.x, p.y, f, p.casa);
    ctx.globalAlpha = 0.65; drawMovel(p.id, p.x * T, p.y * T, performance.now() / 1000, false, p.casa); ctx.globalAlpha = 1;
    ctx.fillStyle = ok ? 'rgba(80,220,80,0.35)' : 'rgba(230,50,40,0.45)';
    for (let dy = 0; dy < f.h; dy++) for (let dx = 0; dx < f.w; dx++) ctx.fillRect((p.x + dx) * T + 1, (p.y + dy) * T + 1, T - 2, T - 2);
  }
  function confirmMovMovel() {
    const p = placing, m = curMap(), f = movelDims(p.casa, p.id), nk = p.x + ',' + p.y, rot = rotOf(p.casa), prato = W.farm.mesa && W.farm.mesa[p.casa];
    if (m.id !== 'house' || casa()[p.casa] !== p.id) { placing = null; return; }
    if (nk === p.casa) { placing = null; toast('Ficou no mesmo lugar.'); return; }
    if (!canPlaceMovel(m, p.x, p.y, f, p.casa)) { toast('Não cabe aí. O vermelho está ocupado.'); sfx.no(); return; }
    setFarm('casa', p.casa, null); setFarm('casa', nk, p.id);
    if (rot) { setFarm('rot', p.casa, null); setFarm('rot', nk, rot); }
    if (prato) { setFarm('mesa', p.casa, null); setFarm('mesa', nk, prato); }
    if (p.id === 'aquario' && W.farm.aquario && W.farm.aquario[p.casa]) { const aq = aqOf(p.casa); setFarm('aquario', p.casa, null); aqSave(nk, aq); }
    placing = null; sfx.hoe(); toast(`${f.name} mudou de lugar!`, '', null, 'movel');
  }
  // ao guardar o aquário, os peixes voltam para a mochila
  function aqGuardar(k) {
    const aq = aqOf(k);
    if (!aq.p.length) { if (W.farm.aquario && W.farm.aquario[k]) setFarm('aquario', k, null); return true; }
    const livres = P.inv.filter(s => !s).length;
    if (livres < aq.p.length + 1) { toast('Tire os peixes do aquário antes (falta espaço na mochila).'); sfx.no(); return false; }
    for (const id of aq.p) addItem(id, 1, true);
    setFarm('aquario', k, null); toast('Os peixes voltaram para a mochila.'); return true;
  }

  // ---------- painéis da Rosa (ampliar a casa) e do Tonico (paredes e piso) ----------
  SHOP_INFO.rosa.tabs.push(['casa', 'Ampliar a casa']);
  SHOP_INFO.tonico.tabs.splice(2, 0, ['estilo', 'Paredes e piso']);
  function reformaHTML() {
    const lv = casaLv(), next = REFORMAS[(W.farm.reforma && W.farm.reforma.lv || 0) + 1];
    let body = `<p style="text-align:center;font-size:13px">A casa de vocês tem ${lv + 1} ${lv ? 'cômodos' : 'cômodo'}. ${casaObra() ? '<b>A obra fica pronta amanhã!</b>' : ''}</p>`;
    if (next && !casaObra()) { const ok = gold() >= next.gold && Object.entries(next.need).every(([k, n]) => count(k) >= n); body += `<div class="list"><div class="item"><span class="nm"><b>${next.name}</b><small>${next.desc}<br>${fmt(next.gold)} ₲ · ${needTxtC(next.need)}</small></span><button class="btn g" data-a="casaReforma" type="button" ${ok ? '' : 'disabled'}>Ampliar</button></div></div>`; }
    else if (!next) body += '<p style="text-align:center">A casa já está no tamanho máximo. Ficou linda!</p>';
    return body;
  }
  function estiloHTML() {
    const e = estilo(), tem = e.tem || {};
    const linha = (tipo, id, o, atual) => { const own = !o.gold || tem[tipo + ':' + id], ok = own || (gold() >= o.gold && Object.entries(o.need || {}).every(([k, n]) => count(k) >= n)); return `<div class="item"><span class="nm"><b>${o.name}</b><small>${own ? 'Já é de vocês.' : `${fmt(o.gold)} ₲${o.need ? ' · ' + needTxtC(o.need) : ''}`}</small></span>${atual === id ? '<small><b>Na casa</b></small>' : `<button class="btn g" data-a="casaEstilo" data-t="${tipo}" data-id="${id}" type="button" ${ok ? '' : 'disabled'}>${own ? 'Usar' : 'Comprar e usar'}</button>`}</div>`; };
    return `<p style="text-align:center;font-size:13px">O Seu Tonico troca na hora. O que vocês já compraram fica guardado para trocar de novo de graça.</p><h3>Papel de parede</h3><div class="list">${Object.entries(PAPEIS).map(([id, o]) => linha('papel', id, o, e.papel || 'classico')).join('')}</div><h3>Piso</h3><div class="list">${Object.entries(PISOS).map(([id, o]) => linha('piso', id, o, e.piso || 'tabua')).join('')}</div>`;
  }
  function casa2Tab(who, tab) {
    if (who === 'rosa' && tab === 'casa') return reformaHTML();
    if (who === 'tonico' && tab === 'estilo') return estiloHTML();
    return null;
  }
  function casa2Action(a, b) {
    switch (a) {
      case 'casaReforma': {
        const lv = (W.farm.reforma && W.farm.reforma.lv) || 0, next = REFORMAS[lv + 1];
        if (!next || casaObra() || !Object.entries(next.need).every(([k, n]) => count(k) >= n) || !spend(next.gold)) return true;
        for (const [k, n] of Object.entries(next.need)) removeItem(k, n);
        setFarmVal('reforma', { lv: lv + 1, d: W.meta.day }); sfx.coin(); sfx.level();
        toast(`A Rosa vai construir a ${next.name.toLowerCase()} esta noite. Amanhã a casa está maior!`, 'big');
        renderShop(panelArg); return true;
      }
      case 'casaEstilo': {
        const tipo = b.dataset.t, id = b.dataset.id, o = (tipo === 'papel' ? PAPEIS : PISOS)[id], e = clone(estilo()); e.tem = e.tem || {};
        if (!o) return true;
        if (o.gold && !e.tem[tipo + ':' + id]) {
          if (!Object.entries(o.need || {}).every(([k, n]) => count(k) >= n) || !spend(o.gold)) return true;
          for (const [k, n] of Object.entries(o.need || {})) removeItem(k, n);
          e.tem[tipo + ':' + id] = 1;
        }
        e[tipo] = id; setFarmVal('estilo', e); casaSync(); sfx.coin();
        toast(`${tipo === 'papel' ? 'Papel de parede' : 'Piso'} novo: ${o.name.toLowerCase()}!`, '', null, 'movel');
        renderShop(panelArg); return true;
      }
      case 'movelMove': movStart(b.dataset.k); return true;
      case 'movelTV': closePanel(); openTV(); return true;
      case 'aqPoe': {
        const k = b.dataset.k, i = +b.dataset.i, s = P.inv[i], aq = aqOf(k);
        if (!s || item(s.id).cat !== 'fish' || aq.p.length >= aqCap(aq)) return true;
        aq.p.push(s.id); s.n--; if (s.n <= 0) P.inv[i] = null; dirty(); renderHotbar();
        aqSave(k, aq); sfx.pop(); toast(`${item(s.id).name} está nadando no aquário!`, '', s.id, 'aquario');
        openAquario(k); return true;
      }
      case 'aqTira': {
        const k = b.dataset.k, i = +b.dataset.i, aq = aqOf(k), id = aq.p[i];
        if (!id || !addItem(id, 1, true)) return true;
        aq.p.splice(i, 1); aqSave(k, aq); sfx.pop(); openAquario(k); return true;
      }
      case 'aqUp': {
        const k = b.dataset.k, aq = aqOf(k), up = aq.lv < AQ_MAX && aqUp(aq.lv);
        if (!up || !Object.entries(up.need).every(([kk, n]) => count(kk) >= n) || !spend(up.gold)) return true;
        for (const [kk, n] of Object.entries(up.need)) removeItem(kk, n);
        aq.lv++; aqSave(k, aq); sfx.coin(); sfx.level(); toast(`O aquário cresceu: agora cabem ${aqCap(aq)} peixes!`, 'big', null, 'aquario');
        openAquario(k); return true;
      }
    }
    return false;
  }
  // tocar em Usar num móvel: alguns têm painel próprio
  function openMovel2(k, id) {
    if (id === 'aquario') { openAquario(k); return true; }
    if (id === 'estantetrofeus') { trofeusHTML(k); return true; }
    return false;
  }

  // ================= clima com eventos =================
  // arco-íris na manhã depois da chuva (Sorte +1), nevasca no inverno (andar lá fora fica difícil sem roupa de frio),
  // noite de estrelas cadentes (faça um pedido!) e raios desenhados nas tempestades.
  function climaNovo(meta, s2) {
    meta.arcoiris = !!W.meta.rain && !W.meta.snow && !meta.rain && Math.random() < 0.6;
    meta.nevasca = !!meta.snow && Math.random() < 0.35;
    meta.estrelas = !meta.rain && Math.random() < (s2 === 'summer' ? 0.16 : 0.1);
  }
  const quenteNaNeve = () => ['botasneve', 'toucapompom', 'gorro', 'cachecol', 'vestidola', 'casacopelucia'].some(id => eqHas(id));
  function climaBuff(k) {
    if (!W.meta) return 0;
    if (k === 'luck' && W.meta.arcoiris) return 1;
    if (k === 'speed' && W.meta.nevasca && P && curMap().outdoor && !quenteNaNeve()) return -2;
    return 0;
  }
  function climaNome() {
    const m = W.meta;
    if (m.rain) return m.snow ? (m.nevasca ? 'nevasca' : 'neve') : m.storm ? 'tempestade' : 'chuva';
    if (m.arcoiris && nowMin() < 14 * 60) return 'arco-íris';
    if (m.estrelas && nowMin() >= 19 * 60) return 'estrelas cadentes';
    return 'sol';
  }
  function climaTxt() {
    const m = W.meta, l = [];
    if (m.arcoiris) l.push(' 🌈 Tem arco-íris no céu depois da chuva: Sorte +1 hoje!');
    if (m.nevasca) l.push(' ❄ Nevasca: lá fora fica difícil andar sem roupa de frio.');
    if (m.estrelas) l.push(' ✨ Hoje à noite vai ter chuva de estrelas cadentes. Faça um pedido!');
    return l.join('');
  }
  let estrelas = [], estrelaT = 0, neve2 = [];
  const estrelaNoCeu = () => estrelas.some(s => s.life > 0.15);
  function climaDraw(dt, m, t) {
    if (!m.outdoor || !W.meta) return;
    const min = nowMin();
    // arco-íris de manhã
    if (W.meta.arcoiris && !W.meta.rain && min >= 360 && min < 840) {
      const a = Math.min(1, (840 - min) / 120, (min - 360) / 40) * 0.32;
      ctx.save(); ctx.globalAlpha = a; ctx.lineWidth = Math.max(3, VW / 90);
      ['#e8402a', '#f48a2a', '#f4d040', '#5ab83a', '#3a8ad8', '#4a4ab8', '#9a4ad8'].forEach((c, i) => { ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(VW * 0.62, VH * 0.95, VW * 0.55 - i * ctx.lineWidth, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke(); });
      ctx.restore();
    }
    // nevasca: neve forte de lado e tudo meio branco
    if (W.meta.nevasca && W.meta.snow) {
      if (neve2.length < 140) for (let i = 0; i < 140; i++) neve2.push({ x: Math.random(), y: Math.random(), s: 0.6 + Math.random() });
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      for (const d of neve2) { d.x -= dt * 0.35 * d.s; d.y += dt * 0.28 * d.s; if (d.x < 0) d.x += 1; if (d.y > 1) d.y -= 1; ctx.fillRect(d.x * VW, d.y * VH, d.s > 1.2 ? 3 : 2, 2); }
      ctx.fillStyle = `rgba(235,242,255,${0.16 + Math.sin(t * 0.7) * 0.05})`; ctx.fillRect(0, 0, VW, VH);
    }
    // raio desenhado nas tempestades
    if (W.meta.storm && !W.meta.snow && typeof flashT === 'number' && flashT > 0.18) {
      const r = srand(Math.floor(t * 3)); let x = VW * (0.2 + r() * 0.6), y = 0;
      ctx.strokeStyle = 'rgba(255,255,230,0.95)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y);
      while (y < VH * 0.55) { x += (r() - 0.5) * 30; y += 10 + r() * 16; ctx.lineTo(x, y); }
      ctx.stroke();
    }
    // estrelas cadentes
    if (W.meta.estrelas && !W.meta.rain && min >= 19 * 60 + 30) {
      estrelaT -= dt;
      if (estrelaT <= 0) { estrelaT = 0.7 + Math.random() * 1.6; estrelas.push({ x: VW * (0.3 + Math.random() * 0.8), y: VH * Math.random() * 0.35, vx: -(160 + Math.random() * 120), vy: 70 + Math.random() * 60, life: 1 }); }
      for (const s of estrelas) {
        s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt * 0.9;
        const a = Math.max(0, Math.min(1, s.life * 1.4)), g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 0.35, s.y - s.vy * 0.35); g.addColorStop(0, `rgba(255,250,210,${a})`); g.addColorStop(1, 'rgba(255,250,210,0)');
        ctx.strokeStyle = g; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 0.35, s.y - s.vy * 0.35); ctx.stroke();
        ctx.fillStyle = `rgba(255,255,240,${a})`; ctx.fillRect(s.x - 2, s.y - 2, 5, 5); ctx.fillStyle = `rgba(255,240,170,${a * 0.35})`; ctx.fillRect(s.x - 5, s.y - 5, 11, 11);
      }
      estrelas = estrelas.filter(s => s.life > 0);
    } else estrelas = [];
  }
  // tocar em Usar com uma estrela cadente no céu: fazer um pedido (uma vez por noite; a dois vale mais)
  function pedidoAct() {
    if (!W.meta.estrelas || W.meta.rain || !curMap().outdoor || nowMin() < 19 * 60 + 30 || !estrelaNoCeu()) return false;
    if (P.flags.pedido === W.meta.day) return false;
    const s = held(); if (s && item(s.id).cat === 'tool') return false;
    P.flags.pedido = W.meta.day; dirty();
    const pt = peerPlayers().find(p => !p.me && p.map === P.map && Math.hypot(p.x - P.x, p.y - P.y) < 120);
    const z = Math.random(), id = z < 0.08 ? 'frutaestelar' : z < 0.35 ? 'pedralua' : 'quartzo', n = pt ? 2 : 1;
    addItem(id, n, true);
    for (const [f, d] of [[880, 0], [1175, 0.12], [1397, 0.24], [1760, 0.36]]) tone(f, f, 0.2, 'sine', 0.05, d);
    toast(pt ? `Você e ${pt.name} fizeram um pedido juntos para a estrela cadente... e ela deixou ${n} ${item(id).name.toLowerCase()}!` : `Você fez um pedido para a estrela cadente... e ela deixou ${item(id).name.toLowerCase()}!`, 'big', id, 'estrela');
    return true;
  }
