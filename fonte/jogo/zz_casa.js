  // ================= Marcenaria do Tonico: móveis para a casa e roupas de cama =================
  // Os móveis ficam em W.farm.casa ("x,y" do canto de cima à esquerda → id) e a roupa de cama em W.farm.cama:
  // a casa é a mesma para os dois.
  NPCS.tonico = {
    name: 'Seu Tonico', role: 'marceneiro', look: { hair: 4, shirt: 3, skin: 1, pants: '#5a4a3a', beard: true, apron: '#8a5a32' }, bday: ['fall', 9],
    loves: ['mipe', 'madeiralei', 'cafereforcado', 'tortamirtilo'], likes: ['*res', '*food', 'resina'], hates: ['gosma', 'asamorcego'],
    shop: 'moveis', hours: [540, 1020],
    lines: ['Madeira boa tem cheiro de floresta. Sente só!', 'Cada móvel que sai daqui leva um pedacinho da Mata do Vale.', 'Ipê é duro de trabalhar, mas dura a vida inteira.', 'Uma casa com móveis feitos à mão é outra coisa.', 'Se achar madeira dourada, me mostra? Nunca trabalhei com ela.'],
    hi: ['Vocês dois deixaram a casa uma beleza, ouvi dizer.', 'Guardei as tábuas mais bonitas pra vocês.'],
    season: ['Primavera: hora de lixar e envernizar tudo.', 'No verão a madeira seca rapidinho.', 'Outono é a melhor época pra buscar carvalho.', 'No inverno a oficina fica quentinha com a serragem.'],
    sched: [[360, null], [480, 'town', 17, 15, 1], [540, 'moveis', 6, 2, 1], [1020, 'town', 16, 27, 1], [1200, null]],
  };
  SHOP_INFO.tonico = { title: 'Marcenaria do Tonico', tabs: [['moveis', 'Móveis'], ['cama', 'Roupa de cama'], ['sell', 'Vender']], greet: () => '“Me traga madeira da mata que eu faço o móvel do jeitinho de vocês.”' };

  // ---------- móveis ----------
  // w,h em quadrados; walk: dá para pisar em cima (tapete); luz: acende à noite
  const MOVEIS = {
    cadeirapinho: { name: 'Cadeira de pinho', w: 1, h: 1, gold: 250, need: { mpinho: 8 }, desc: 'Simples e cheirosa.' },
    mesapinho: { name: 'Mesinha de pinho', w: 1, h: 1, gold: 400, need: { mpinho: 12 }, desc: 'Boa para o café da manhã.' },
    vaso: { name: 'Vaso de samambaia', w: 1, h: 1, gold: 300, need: { mpinho: 4, fibra: 10 }, desc: 'Um verdinho dentro de casa.' },
    luminaria: { name: 'Luminária de pé', w: 1, h: 1, gold: 800, need: { mpinho: 6, barracobre: 1 }, luz: true, desc: 'Acende sozinha à noite.' },
    mesacarvalho: { name: 'Mesa de carvalho', w: 2, h: 1, gold: 900, need: { mcarvalho: 15 }, desc: 'Mesa grande para dois.' },
    poltrona: { name: 'Poltrona de carvalho', w: 1, h: 1, gold: 1200, need: { mcarvalho: 10, fibra: 20 }, desc: 'Fofinha, com braços de carvalho.' },
    tapete: { name: 'Tapete de crochê', w: 2, h: 2, gold: 600, need: { fibra: 40 }, walk: true, desc: 'Dá para pisar. Feito à mão.' },
    estanteipe: { name: 'Estante de ipê', w: 2, h: 1, gold: 1800, need: { mipe: 15 }, desc: 'Cheia de livros e lembranças.' },
    relogio: { name: 'Relógio de pêndulo', w: 1, h: 1, gold: 2200, need: { mipe: 10, barraouro: 1 }, desc: 'Tique-taque de ipê e ouro.' },
    comoda: { name: 'Cômoda de madeira de lei', w: 2, h: 1, gold: 2500, need: { madeiralei: 8 }, desc: 'Pesada, bonita e para sempre.' },
    espelhodourado: { name: 'Espelho dourado', w: 1, h: 1, gold: 4000, need: { mdourada: 2 }, desc: 'Moldura de madeira dourada que brilha.' },
  };
  for (const [k, f] of Object.entries(MOVEIS)) ITEMS[k] = { name: f.name, cat: 'movel', sell: Math.round(f.gold / 3), desc: `${f.desc} Segure dentro de casa e toque no chão para colocar${f.w > 1 || f.h > 1 ? ` (ocupa ${f.w}×${f.h})` : ''}.` };

  // ---------- roupas de cama ----------
  const CAMAS = {
    camaxadrez: { name: 'Roupa de cama xadrez', gold: 300, desc: 'A azul de sempre.' },
    camaflorida: { name: 'Roupa de cama florida', gold: 1500, desc: 'Rosa com florzinhas.' },
    camalistrada: { name: 'Roupa de cama listrada', gold: 1500, desc: 'Listras amarelas de verão.' },
    camacoracoes: { name: 'Roupa de cama de coraçõezinhos', gold: 2000, desc: 'Para o casal mais fofo da vila.' },
    camala: { name: 'Colcha de lã', gold: 2500, desc: 'Quentinha para o inverno.' },
    camaestrelas: { name: 'Roupa de cama de céu estrelado', gold: 3000, desc: 'Azul-escuro com estrelinhas.' },
  };
  for (const [k, c] of Object.entries(CAMAS)) ITEMS[k] = { name: c.name, cat: 'cama', sell: Math.round(c.gold / 4), desc: `${c.desc} Segure e toque na cama para trocar.` };
  // dá para fazer em Criar
  RECIPES.push(
    { id: 'camaxadrez', need: { fibra: 20 }, skill: null },
    { id: 'camaflorida', need: { fibra: 30, narciso: 2 }, skill: ['farming', 2] },
    { id: 'camalistrada', need: { fibra: 30, tecido: 1 }, skill: ['farming', 3] },
    { id: 'camacoracoes', need: { fibra: 40, tecido: 2 }, skill: ['farming', 4] },
    { id: 'camala', need: { la: 10, fibra: 20 }, skill: ['farming', 4] },
    { id: 'camaestrelas', need: { tecido: 3, quartzo: 5 }, skill: ['farming', 6] },
  );

  // ---------- as reformas da chacrinha pedem madeira da floresta ----------
  Object.assign(BUILDS.coop.lvs[1].need, { mpinho: 60, mcarvalho: 30 });
  Object.assign(BUILDS.coop.lvs[2].need, { mcarvalho: 60, mipe: 40, madeiralei: 15 });
  Object.assign(BUILDS.barn.lvs[1].need, { mpinho: 80, mcarvalho: 40 });
  Object.assign(BUILDS.barn.lvs[2].need, { mcarvalho: 80, mipe: 50, madeiralei: 20 });
  Object.assign(BUILDS.stable.lvs[0].need, { mpinho: 40, mcarvalho: 20 });

  // ---------- painéis da marcenaria ----------
  const needTxtC = need => Object.entries(need).map(([k, n]) => `<span style="color:${count(k) >= n ? '#2a7a2a' : '#a83a2a'}">${n} ${item(k).name.toLowerCase()} (${count(k)})</span>`).join(', ');
  const canMake = f => gold() >= f.gold && Object.entries(f.need).every(([k, n]) => count(k) >= n);
  function moveisHTML() {
    return `<p style="text-align:center;font-size:13px">Cada móvel é feito na hora, com a madeira que vocês trazem da mata.</p><div class="list">${Object.entries(MOVEIS).filter(([, f]) => !f.pet).map(([k, f]) => `<div class="item"><img src="${iconURL(k)}" alt=""><span class="nm"><b>${f.name}</b><small>${f.desc} · ${fmt(f.gold)} ₲ + ${needTxtC(f.need)}</small></span><button class="btn g" data-a="movelMake" data-id="${k}" type="button" ${canMake(f) ? '' : 'disabled'}>Encomendar</button></div>`).join('')}</div>`;
  }
  function camasHTML() {
    return `<p style="text-align:center;font-size:13px">Também dá para fazer em casa, na aba Criar, com fibra, lã e tecido.</p><div class="list">${Object.entries(CAMAS).map(([k, c]) => `<div class="item"><img src="${iconURL(k)}" alt=""><span class="nm"><b>${c.name}</b><small>${c.desc}</small></span><span class="price">${fmt(c.gold)} ₲</span><button class="btn g" data-a="camaBuy" data-id="${k}" type="button" ${gold() >= c.gold ? '' : 'disabled'}>Comprar</button></div>`).join('')}</div>`;
  }
  // abas extras das lojas (Encantar no ferreiro, Móveis e Roupa de cama na marcenaria)
  function extraShopTab(who, tab) {
    const c2 = casa2Tab(who, tab); if (c2 != null) return c2;
    if (who === 'claudio' && tab === 'enc') return encHTML();
    if (who === 'tonico' && tab === 'moveis') return moveisHTML();
    if (who === 'tonico' && tab === 'cama') return camasHTML();
    if (who === 'davi' && tab === 'consulta') return consulta2HTML();
    return null;
  }

  // ---------- colocar, guardar e desenhar os móveis ----------
  const casa = () => (W.farm && W.farm.casa) || {};
  // quadrados ocupados pelos móveis: "x,y" → chave do móvel
  let casaVer = '', casaGrid = new Map();
  function casaCells() {
    const ver = JSON.stringify(casa());
    if (ver === casaVer) return casaGrid;
    casaVer = ver; casaGrid = new Map();
    for (const [k, id] of Object.entries(casa())) { if (!MOVEIS[id]) continue; const f = movelDims(k, id); const [x, y] = k.split(',').map(Number); for (let dy = 0; dy < f.h; dy++) for (let dx = 0; dx < f.w; dx++) casaGrid.set((x + dx) + ',' + (y + dy), k); }
    return casaGrid;
  }
  const movelAt = (x, y) => { const k = casaCells().get(x + ',' + y); return k ? { k, id: casa()[k] } : null; };
  function canPlaceMovel(m, x, y, f, skip) {
    for (let dy = 0; dy < f.h; dy++) for (let dx = 0; dx < f.w; dx++) {
      const xx = x + dx, yy = y + dy, k = xx + ',' + yy;
      if (xx < 1 || yy < 2 || xx > m.w - 2 || yy > m.h - 2) return false;
      const mv = movelAt(xx, yy);
      if (m.solid[yy * m.w + xx] || m.spots[k] || (mv && mv.k !== skip)) return false;
      if (xx === 7 && yy >= 8) return false; // caminho da porta
      if (Math.floor(P.x / T) === xx && Math.floor((P.y - 3) / T) === yy) return false;
    }
    return true;
  }
  function placeMovel(m, tx, ty, s) {
    const f = MOVEIS[s.id];
    if (m.id !== 'house') { toast('Os móveis vão dentro de casa.', '', null, 'movel'); return; }
    // em cima ou à esquerda do quadrado tocado, o que couber
    for (const [ox, oy] of [[0, 0], [-1, 0], [0, -1], [-1, -1]]) {
      const x = tx + ox, y = ty + oy;
      if ((ox && f.w < 2) || (oy && f.h < 2)) continue;
      if (canPlaceMovel(m, x, y, f)) { setFarm('casa', x + ',' + y, s.id); useHeld(1); sfx.hoe(); toast(`${f.name} no lugar!`, '', null, 'movel'); return; }
    }
    toast('Não cabe aqui. Tente outro cantinho.', '', null, 'movel'); sfx.no();
  }
  function openMovel(k) {
    const id = casa()[k], f = MOVEIS[id]; if (!f) return;
    if (openMovel2(k, id)) return;
    openMovelMenu(k); return;
    openPanel(`<h2>${f.name}</h2><p style="text-align:center">${f.desc}</p><div class="row">${id === 'tvcasa' ? '<button class="btn g" data-a="movelTV" type="button">Ligar a TV</button>' : ''}<button class="btn" data-a="movelMove" data-k="${k}" type="button">Mover</button><button class="btn" data-a="movelPick" data-k="${k}" type="button">Guardar na mochila</button></div>`, 'movel', k);
  }
  // tocar em Usar dentro de casa: roupa de cama na cama e móveis
  function casaAct(m, tx, ty) {
    if (m.id !== 'house') return false;
    if (casa3Act(m, tx, ty)) return true;
    const s = held();
    const mv = movelAt(tx, ty);
    if (mv && !(s && item(s.id).cat === 'movel')) { openMovel(mv.k); return true; }
    if (s && item(s.id).cat === 'movel') { placeMovel(m, tx, ty, s); return true; }
    return false;
  }
  function applyBedding() {
    const s = held(); if (!s || !CAMAS[s.id]) return false;
    const old = W.farm.cama;
    if (old === s.id) { toast('Essa roupa de cama já está na cama.', '', null, 'cama'); return true; }
    useHeld(1); setFarmVal('cama', s.id);
    if (old && CAMAS[old]) addItem(old, 1, true);
    sfx.pop(); toast(`Cama arrumada com a ${CAMAS[s.id].name.toLowerCase()}!${old && CAMAS[old] ? ' A antiga voltou para a mochila.' : ''}`, 'big', null, 'cama');
    return true;
  }
  function casaAction(a, b) {
    switch (a) {
      case 'movelMake': {
        const id = b.dataset.id, f = MOVEIS[id];
        if (!f || !canMake(f) || !spend(f.gold)) return true;
        for (const [k, n] of Object.entries(f.need)) removeItem(k, n);
        addItem(id, 1, true); sfx.coin(); toast(`O Seu Tonico fez: ${f.name}! Está na mochila.`, '', id, 'movel');
        renderShop(panelArg); return true;
      }
      case 'camaBuy': { const c = CAMAS[b.dataset.id]; if (c && spend(c.gold)) { addItem(b.dataset.id, 1, true); sfx.coin(); toast(`Comprou: ${c.name}.`, '', b.dataset.id, 'cama'); } renderShop(panelArg); return true; }
      case 'movelPick': {
        const k = b.dataset.k, id = casa()[k];
        if (id === 'aquario' && !aqGuardar(k)) return true;
        if (id && addItem(id, 1, true)) { setFarm('casa', k, null); if (rotOf(k)) setFarm('rot', k, null); if (W.farm.mesa && W.farm.mesa[k]) { addItem(W.farm.mesa[k].id, 1, true); setFarm('mesa', k, null); } sfx.pop(); toast(`${MOVEIS[id].name} guardado na mochila.`, '', null, 'movel'); }
        closePanel(); return true;
      }
    }
    return false;
  }

  // ---------- desenho dos móveis ----------
  function drawMovel(id, px, py, t, night, k) {
    if (k && rotOf(k) && drawMovelRot(id, px, py, t, night, k, rotOf(k))) return;
    if (drawMovelPet(id, px, py) || drawToy(id, px, py, t) || drawMovel2(id, px, py, t, night, k)) return;
    switch (id) {
      case 'cadeirapinho': shadowAt(px + 8, py + 14, 6, 2); R(px + 4, py - 6, 8, 12, '#b88a4a'); R(px + 5, py - 5, 6, 2, '#d8b070'); R(px + 5, py - 1, 6, 1, '#d8b070'); R(px + 3, py + 5, 10, 4, '#d8b070'); R(px + 3, py + 5, 10, 1, '#f0d098'); R(px + 4, py + 9, 2, 5, '#9a6a3a'); R(px + 10, py + 9, 2, 5, '#9a6a3a'); break;
      case 'mesapinho': shadowAt(px + 8, py + 14, 6, 2); oval(px + 8, py + 5, 7, 3.5, '#b88a4a'); oval(px + 8, py + 4, 7, 3, '#d8b070'); R(px + 7, py + 7, 2, 7, '#9a6a3a'); R(px + 4, py + 13, 8, 1, '#9a6a3a'); R(px + 7, py, 3, 3, '#f4f0e8'); R(px + 8, py - 1, 1, 1, '#ffffff99'); break;
      case 'vaso': shadowAt(px + 8, py + 14, 5, 2); R(px + 4, py + 7, 8, 7, '#c86a3a'); R(px + 4, py + 7, 8, 1, '#e08a5a'); for (const [dx, dy, l] of [[-5, -2, 7], [5, -2, 7], [-3, -6, 8], [3, -6, 8], [0, -8, 9]]) { ctx.strokeStyle = '#3a8a2a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px + 8, py + 7); ctx.quadraticCurveTo(px + 8 + dx * 0.4, py + 7 + dy, px + 8 + dx, py + 7 + dy - l * 0.3); ctx.stroke(); } break;
      case 'luminaria': shadowAt(px + 8, py + 14, 5, 2); R(px + 7, py - 4, 2, 17, '#4a3a2a'); R(px + 4, py + 12, 8, 2, '#4a3a2a'); poly([[px + 3, py - 4], [px + 13, py - 4], [px + 11, py - 12], [px + 5, py - 12]], night ? '#ffe8a0' : '#e8d8b0'); R(px + 3, py - 4, 10, 1, '#c8a870'); break;
      case 'mesacarvalho': shadowAt(px + 16, py + 14, 14, 2); R(px + 1, py + 2, 30, 7, '#5a3418'); R(px + 1, py + 1, 30, 7, '#7a4a28'); R(px + 2, py + 2, 28, 1, '#9a6a3a'); R(px + 2, py + 8, 2, 6, '#4a2a14'); R(px + 28, py + 8, 2, 6, '#4a2a14'); R(px + 10, py - 1, 12, 3, '#f4f0e8'); disc(px + 16, py - 2, 2.5, '#e8402a'); R(px + 15, py - 6, 2, 4, '#3a8a2a'); break;
      case 'poltrona': shadowAt(px + 8, py + 14, 7, 2); R(px + 2, py - 5, 12, 10, '#8a2a3a'); R(px + 3, py - 4, 10, 2, '#a83a4a'); R(px + 1, py + 2, 14, 7, '#8a2a3a'); R(px + 3, py + 3, 10, 4, '#b84a5a'); R(px, py + 1, 3, 8, '#7a4a28'); R(px + 13, py + 1, 3, 8, '#7a4a28'); R(px + 2, py + 9, 2, 4, '#5a3418'); R(px + 12, py + 9, 2, 4, '#5a3418'); break;
      case 'tapete': { const c = ['#e86a8a', '#f4c83a', '#5ab8e8', '#8ad86a']; for (let r = 0; r < 4; r++) oval(px + 16, py + 16, 15 - r * 3.4, 13 - r * 3, c[r]); oval(px + 16, py + 16, 2, 2, '#ffffff'); break; }
      case 'estanteipe': shadowAt(px + 16, py + 14, 14, 2); R(px + 1, py - 16, 30, 30, '#7a3a1a'); R(px + 3, py - 14, 26, 26, '#5a2a10');
        for (let r = 0; r < 3; r++) { R(px + 3, py - 6 + r * 9, 26, 2, '#9a5a2a'); for (let i = 0; i < 6; i++) { const c = ['#c83a3a', '#3a7ad0', '#f4c83a', '#5aa83a', '#f4f0e8', '#b05ae0'][(i + r * 2) % 6]; R(px + 4 + i * 4, py - 13 + r * 9, 3, 7 - (i + r) % 2, c); } }
        R(px + 22, py - 14, 5, 5, '#e8d8b0'); R(px + 23, py - 13, 3, 3, '#a8d8f0'); break;
      case 'relogio': shadowAt(px + 8, py + 14, 6, 2); R(px + 3, py - 18, 10, 32, '#7a3a1a'); disc(px + 8, py - 12, 4.5, '#f4f0e0'); R(px + 8, py - 15, 1, 3, '#2a1a0a'); R(px + 8, py - 12, 3, 1, '#2a1a0a'); R(px + 5, py - 5, 6, 14, '#3a1a0a');
        { const a = Math.sin(t * 3) * 0.35; ctx.strokeStyle = '#f4c83a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px + 8, py - 5); ctx.lineTo(px + 8 + Math.sin(a) * 9, py - 5 + Math.cos(a) * 9); ctx.stroke(); disc(px + 8 + Math.sin(a) * 9, py - 5 + Math.cos(a) * 9, 1.8, '#f4c83a'); } break;
      case 'comoda': shadowAt(px + 16, py + 14, 14, 2); R(px + 1, py - 4, 30, 18, '#3a180e'); R(px + 2, py - 3, 28, 16, '#5a2a1a'); for (let r = 0; r < 3; r++) { R(px + 3, py - 2 + r * 5, 26, 4, '#6a3420'); R(px + 15, py + r * 5, 2, 1, '#f4c83a'); }
        R(px + 4, py - 9, 6, 6, '#c8a050'); R(px + 5, py - 8, 4, 4, '#f8e8f0'); disc(px + 24, py - 7, 3, '#e8d8b0'); R(px + 23, py - 12, 2, 4, '#f4f0e8'); break;
      case 'espelhodourado': shadowAt(px + 8, py + 14, 6, 2); R(px + 7, py + 6, 2, 8, '#b8861a'); R(px + 4, py + 13, 8, 1, '#b8861a'); oval(px + 8, py - 3, 7, 10, '#e8b830'); oval(px + 8, py - 3, 5, 8, '#c8e8f8'); R(px + 5, py - 9, 2, 7, '#ffffffaa');
        if (Math.sin(t * 2.5) > 0.6) { R(px + 13, py - 12, 1, 3, '#ffffff'); R(px + 12, py - 11, 3, 1, '#ffffff'); } break;
    }
  }
  function casaEnts(m, ents, t) {
    const night = nightF() > 0.2;
    if (m.id === 'house') {
      for (const [k, id] of Object.entries(casa())) {
        if (!MOVEIS[id] || (placing && placing.casa === k)) continue; const f = movelDims(k, id);
        const [x, y] = k.split(',').map(Number);
        ents.push({ y: f.walk ? -500 : (y + f.h - 1) * T + 14, f: () => drawMovel(id, x * T, y * T, t, night, k) });
      }
    }
    if (m.id === 'moveis') {
      // mostruário da marcenaria
      for (const [id, x, y] of [['cadeirapinho', 1, 5], ['estanteipe', 9, 2], ['relogio', 1, 2], ['poltrona', 10, 5]]) ents.push({ y: y * T + 14, f: () => drawMovel(id, x * T, y * T, t, false) });
      ents.push({ y: -500, f: () => drawMovel('tapete', 4 * T, 5 * T, t, false) });
    }
  }
  function casaLights(m, light) {
    if (m.id !== 'house') return;
    for (const [k, id] of Object.entries(casa())) if (MOVEIS[id] && MOVEIS[id].luz) { const [x, y] = k.split(',').map(Number); light(x * T + 8, y * T - 6, 46, 0.55); }
  }
  // capa da cama conforme a roupa de cama
  function bedQuilt(col, w, h) {
    const st = { camaflorida: ['#f4a8c8', '#e888b0'], camalistrada: ['#f4d040', '#fff6d0'], camacoracoes: ['#f8f0f0', '#e8e0e0'], camala: ['#e8dcc8', '#c83a3a'], camaestrelas: ['#2a2a6a', '#1e1e4a'] }[col];
    if (!st) return false;
    R(4, 15, w - 8, h - 19, st[0]); R(4, 15, w - 8, 1, shade(st[0], -0.3));
    if (col === 'camalistrada') for (let yy = 17; yy < h - 4; yy += 4) R(4, yy, w - 8, 2, st[1]);
    if (col === 'camaflorida') for (let yy = 18; yy < h - 5; yy += 6) for (let xx = 5 + (yy % 12 ? 3 : 0); xx < w - 5; xx += 7) { R(xx - 1, yy, 3, 1, '#ffffff'); R(xx, yy - 1, 1, 3, '#ffffff'); R(xx, yy, 1, 1, '#f4c83a'); }
    if (col === 'camacoracoes') for (let yy = 18; yy < h - 5; yy += 6) for (let xx = 5 + (yy % 12 ? 3 : 0); xx < w - 6; xx += 8) { R(xx, yy, 2, 2, '#e83a6a'); R(xx + 3, yy, 2, 2, '#e83a6a'); R(xx, yy + 1, 5, 2, '#e83a6a'); R(xx + 1, yy + 3, 3, 1, '#e83a6a'); }
    if (col === 'camala') { R(4, h - 9, w - 8, 3, st[1]); for (let xx = 3; xx < w - 3; xx += 3) R(xx, h - 8, 1, 1, '#ffffff'); for (let yy = 18; yy < h - 10; yy += 3) for (let xx = 4; xx < w - 4; xx += 4) R(xx + (yy % 2), yy, 2, 1, '#d4c4a8'); }
    if (col === 'camaestrelas') { const r = srand(9); for (let k = 0; k < 18; k++) R(3 + r() * (w - 6), 17 + r() * (h - 23), 1, 1, k % 3 ? '#f4e8a0' : '#ffffff'); disc(w - 9, 20, 2.5, '#f4e8a0'); disc(w - 8, 19, 2.2, st[0]); }
    return true;
  }
  // a construção da marcenaria na vila
  function drawMoveisB(w, h, night, snow) {
    planks(2, 18, w - 4, h - 18, '#a8743a', 6);
    gable(2, -22, w - 4, 42, '#a8743a', '#3a6a4a', snow);
    R(w / 2 - 18, -6, 36, 16, '#5a3418'); R(w / 2 - 16, -4, 32, 12, '#f0dcb0');
    // plaquinha com uma cadeira
    R(w / 2 - 4, -3, 8, 5, '#9a5a2a'); R(w / 2 - 4, 2, 8, 2, '#c88a4a'); R(w / 2 - 4, 4, 1, 3, '#9a5a2a'); R(w / 2 + 3, 4, 1, 3, '#9a5a2a');
    winPx(8, 34, 20, 16, night);
    doorPx(2 * T + 1, h - 22, '#6a3a1e');
    // tábuas encostadas e um serrote
    for (let k = 0; k < 4; k++) R(w - 26 + k * 5, h - 22 + (k % 2) * 2, 4, 22 - (k % 2) * 2, ['#d8b070', '#7a4a28', '#c8763a', '#5a2a1a'][k]);
    poly([[w - 8, h - 30], [w - 2, h - 26], [w - 3, h - 24], [w - 9, h - 28]], '#a8a8b0');
  }
  // ícones
  function paintIcon8(id) {
    if (MOVEIS[id]) {
      const c = document.createElement('canvas'); c.width = 48; c.height = 56;
      const save = ctx; ctx = c.getContext('2d'); drawMovel(id, 8, 30, 0, false); const d = ctx.getImageData(0, 0, 48, 56).data; ctx = save;
      let x0 = 48, y0 = 56, x1 = 0, y1 = 0;
      for (let y = 0; y < 56; y++) for (let x = 0; x < 48; x++) if (d[(y * 48 + x) * 4 + 3] > 120) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
      if (x1 >= x0) { const bw = x1 - x0 + 1, bh = y1 - y0 + 1, sc = Math.min(15 / bw, 15 / bh, 1); ctx.drawImage(c, x0, y0, bw, bh, Math.round(8 - bw * sc / 2), Math.round(8 - bh * sc / 2), Math.round(bw * sc), Math.round(bh * sc)); }
      return true;
    }
    if (CAMAS[id]) {
      const c = { camaxadrez: ['#4a7ac8', '#6a9ae0'], camaflorida: ['#f4a8c8', '#ffffff'], camalistrada: ['#f4d040', '#fff6d0'], camacoracoes: ['#f8f0f0', '#e83a6a'], camala: ['#e8dcc8', '#c83a3a'], camaestrelas: ['#2a2a6a', '#f4e8a0'] }[id];
      for (let k = 0; k < 3; k++) { R(2, 10 - k * 3, 12, 3, k % 2 ? c[0] : shade(c[0], -0.1)); R(2, 10 - k * 3, 12, 1, shade(c[0], 0.2)); }
      R(4, 11, 3, 1, c[1]); R(9, 8, 3, 1, c[1]); R(6, 5, 3, 1, c[1]); R(2, 13, 12, 1, shade(c[0], -0.35));
      return true;
    }
    return false;
  }
