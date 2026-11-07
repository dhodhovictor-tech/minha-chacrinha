  // ================= a vila viva: caminhos, rotinas, casas, conversas, placas e mapa =================

  // ---------- caminhos dos moradores: andam pelas ruas, desviando dos prédios ----------
  const pathCache = new Map();
  function vilaPath(map, a, b) {
    const A = [a[2] * T + 8, a[3] * T + 14], Bp = [b[2] * T + 8, b[3] * T + 14];
    const m = MAPS[map];
    if (!m || !m.outdoor) return [A, Bp];
    const key = map + '|' + a[2] + ',' + a[3] + '|' + b[2] + ',' + b[3];
    if (pathCache.has(key)) return pathCache.get(key);
    const W0 = m.w, N = W0 * m.h, sx = a[2], sy = a[3], tx = b[2], ty = b[3];
    const cost = i => { const g = m.g[i]; return g === G.COBBLE || g === G.BRIDGE || g === G.DIRT ? 1 : 3; };
    const free = (x, y) => x >= 0 && y >= 0 && x < W0 && y < m.h && (!m.solid[y * W0 + x] || (x === tx && y === ty) || (x === sx && y === sy));
    // Dijkstra com baldes (custos 1 ou 3): rápido numa grade pequena
    const dist = new Int32Array(N).fill(1e9), prev = new Int32Array(N).fill(-1), buckets = [[]];
    const s0 = sy * W0 + sx, goal = ty * W0 + tx; dist[s0] = 0; buckets[0].push(s0);
    for (let d = 0; d < buckets.length; d++) {
      const bk = buckets[d]; if (!bk) continue;
      for (const i of bk) {
        if (dist[i] !== d) continue;
        if (i === goal) { d = buckets.length; break; }
        const x = i % W0, y = (i / W0) | 0;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy; if (!free(nx, ny)) continue;
          const j = ny * W0 + nx, nd = d + cost(j);
          if (nd < dist[j]) { dist[j] = nd; prev[j] = i; (buckets[nd] = buckets[nd] || []).push(j); }
        }
      }
    }
    let out;
    if (prev[goal] < 0 && goal !== s0) out = [A, Bp];
    else {
      const cells = []; for (let i = goal; i >= 0; i = prev[i]) { cells.push(i); if (i === s0) break; }
      cells.reverse();
      // só as curvas
      out = [A];
      for (let k = 1; k < cells.length - 1; k++) {
        const p0 = cells[k - 1], p1 = cells[k], p2 = cells[k + 1];
        if ((p1 - p0) !== (p2 - p1)) out.push([(p1 % W0) * T + 8, ((p1 / W0) | 0) * T + 14]);
      }
      out.push(Bp);
    }
    if (pathCache.size > 400) pathCache.clear();
    pathCache.set(key, out);
    return out;
  }

  // ---------- rotinas: dia comum, domingo e chuva; em dia de festa todo mundo vai para a praça ----------
  const V = VILA, lar = id => 'lar_' + id;
  const ROTINAS = {
    pedro: { sched: [[360, null], [540, 'store', 6, 2, 1], [1020, 'town', 36, 26, 1], [1140, 'bar', 13, 4, 1], [1320, null]],
      schedRain: [[360, null], [540, 'store', 6, 2, 1], [1020, 'bar', 13, 4, 1], [1320, null]] },
    claudio: { sched: [[360, null], [540, 'smith', 5, 2, 1], [960, 'town', 35, 16, 1], [1080, 'bar', 4, 6, 3], [1380, null]],
      schedRain: [[360, null], [540, 'smith', 5, 2, 1], [960, 'bar', 4, 6, 3], [1380, null]] },
    rosa: { sched: [[360, lar('rosa'), 4, 4, 1], [480, 'town', 46, 16, 1], [540, 'carpentry', 5, 2, 1], [1020, 'town', 45, 35, 1], [1140, lar('rosa'), 5, 4, 1], [1320, null]],
      schedSun: [[360, lar('rosa'), 4, 4, 1], [540, 'carpentry', 5, 2, 1], [900, 'town', 70, 23, 1], [1080, lar('rosa'), 5, 4, 1], [1320, null]] },
    marta: { sched: [[360, null], [540, 'ranch', 5, 2, 1], [960, 'town', 16, 34, 1], [1140, null]],
      schedRain: [[360, null], [540, 'ranch', 5, 2, 1], [1140, null]] },
    lia: { sched: [[360, null], [480, 'town', 37, 30, 1], [720, 'bar', 5, 2, 1], [1500, null]],
      schedRain: [[360, null], [600, 'bar', 5, 2, 1], [1500, null]] },
    bia: { sched: [[360, lar('bia'), 4, 4, 1], [480, 'town', 25, 48, 1], [540, 'atelie', 6, 2, 1], [1020, 'town', 57, 48, 1], [1140, 'bar', 11, 7, 3], [1260, lar('bia'), 5, 4, 1], [1380, null]],
      schedRain: [[360, lar('bia'), 4, 4, 1], [540, 'atelie', 6, 2, 1], [1020, lar('bia'), 8, 3, 1], [1380, null]] },
    davi: { sched: [[360, lar('davi'), 4, 4, 1], [480, 'town', 36, 25, 1], [720, 'town', 41, 36, 1], [960, 'town', 30, 29, 1], [1080, 'bar', 6, 6, 2], [1260, lar('davi'), 5, 4, 1], [1380, null]],
      schedSun: [[360, lar('davi'), 4, 4, 1], [540, 'town', 71, 23, 1], [780, 'town', 42, 34, 1], [1080, 'bar', 6, 6, 2], [1260, lar('davi'), 5, 4, 1], [1380, null]],
      schedRain: [[360, lar('davi'), 4, 4, 1], [1080, 'bar', 6, 6, 2], [1260, lar('davi'), 5, 4, 1], [1380, null]] },
    nena: { sched: [[360, lar('nena'), 4, 4, 1], [480, 'town', 33, 33, 1], [720, 'town', 42, 30, 1], [960, 'town', 34, 24, 1], [1140, lar('nena'), 5, 4, 1], [1320, null]],
      schedSun: [[360, lar('nena'), 4, 4, 1], [540, 'town', 36, 35, 1], [840, 'town', 44, 35, 1], [1080, lar('nena'), 5, 4, 1], [1320, null]],
      schedRain: [[360, lar('nena'), 4, 4, 1], [1320, null]] },
    caio: { sched: [[360, lar('nena'), 8, 3, 1], [480, 'town', 30, 47, 1], [660, 'beach', 10, 10, 1], [900, 'town', 38, 30, 1], [1080, lar('nena'), 8, 3, 1], [1260, null]],
      schedSun: [[360, lar('nena'), 8, 3, 1], [540, 'town', 37, 35, 1], [840, 'town', 21, 50, 1], [1080, lar('nena'), 8, 3, 1], [1260, null]],
      schedRain: [[360, lar('nena'), 8, 3, 1], [1260, null]] },
    cida: { sched: [[360, lar('cida'), 4, 4, 1], [480, 'town', V.stall[0] + 1, V.stall[1], 1], [1080, 'bar', 9, 6, 2], [1260, lar('cida'), 5, 4, 1], [1380, null]] },
    tonico: { sched: [[360, lar('tonico'), 4, 4, 1], [480, 'town', 24, 26, 1], [540, 'moveis', 6, 2, 1], [1020, 'town', 46, 35, 1], [1200, lar('tonico'), 5, 4, 1], [1320, null]],
      schedRain: [[360, lar('tonico'), 4, 4, 1], [540, 'moveis', 6, 2, 1], [1020, lar('tonico'), 5, 4, 1], [1320, null]] },
  };
  for (const [id, r] of Object.entries(ROTINAS)) if (NPCS[id]) Object.assign(NPCS[id], r);
  const isSunday = () => W.meta && (W.meta.day - 1) % 7 === 6;
  function npcSchedOf(id) { const n = NPCS[id], rain = W.meta && W.meta.rain; return (rain && n.schedRain) || (isSunday() && n.schedSun) || n.sched; }
  // em dia de festa, do fim da tarde até a noite, todo mundo em volta da barraca
  function festSpot(id, now) {
    const f = typeof festOn === 'function' && festOn(); if (!f || now < 1020 || now >= 1320) return null;
    const ids = Object.keys(NPCS).filter(k => !NPCS[k].kid || true).sort(), i = ids.indexOf(id), n = ids.length;
    const a = (i / n) * TAU, cx = V.booth.x + 1.5, cy = V.booth.y + 3.5;
    let x = Math.round(cx + Math.cos(a) * 5), y = Math.round(cy + Math.sin(a) * 3.2);
    const m = MAPS.town; for (let k = 0; k < 6 && m.solid[y * m.w + x]; k++) y++;
    return { map: 'town', x: x * T + 8, y: y * T + 14, dir: Math.abs(Math.cos(a)) > 0.6 ? (Math.cos(a) > 0 ? 2 : 3) : (Math.sin(a) > 0 ? 0 : 1), walk: false };
  }

  // ---------- casas dos moradores: dá para visitar das 7h às 21h ----------
  const LAR_DONO = { nena: 'Vó Nena e Caio', davi: 'Doutor Davi', helena: 'Professora Helena', juca: 'Seu Juca', rosa: 'Rosa', bia: 'Bia', tonico: 'Seu Tonico', cida: 'Dona Cida' };
  function buildLar(id) {
    const [hx, hy] = V.casas[id];
    const m = newMap(lar(id), 11, 8, G.WOOD, { name: 'Casa de ' + LAR_DONO[id], outdoor: false, lar: id });
    m.rect(0, 0, 10, 1, G.WALL); m.rect(0, 0, 0, 7, G.WALL); m.rect(10, 0, 10, 7, G.WALL); m.rect(0, 7, 10, 7, G.WALL);
    m.set(5, 7, G.WOOD); m.rect(3, 4, 7, 6, G.CARPET);
    sprite(m, 'bed', 1, 2, 3, 3, { col: { nena: 'camaflorida', bia: 'camacoracoes', helena: 'camaestrelas', davi: 'camala' }[id] || '' });
    sprite(m, 'table', 6, 4, 2, 2); sprite(m, 'plant', 9, 2, 1, 1);
    m.warps.push({ x: 5, y: 7, to: 'town', tx: hx + 3, ty: hy + 4, dir: 1 });
    return finalize(m);
  }
  for (const id of Object.keys(V.casas)) MAPS[lar(id)] = buildLar(id);
  const larOpen = () => { const t = nowMin(); return t >= 420 && t < 1260; };
  // decoração de cada casa conforme quem mora
  function larEnts(m, ents, t) {
    if (!m.lar) return;
    const id = m.lar, night = nightF() > 0.2;
    ents.push({ y: -998, f: () => {
      // quadro na parede e janela
      R(5 * T, 3, 22, 15, '#7a4a24'); R(5 * T + 2, 5, 18, 11, night ? '#2a3a6a' : '#a8d8f0'); R(5 * T + 10, 5, 1, 11, '#7a4a24');
      if (id === 'helena' || id === 'davi') { R(8 * T, 4, 26, 22, '#5a2a10'); for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) R(8 * T + 2 + i * 4, 6 + r * 10, 3, 8, ['#c83a3a', '#3a7ad0', '#f4c83a', '#5aa83a', '#f4f0e8', '#b05ae0'][(i + r) % 6]); }
      if (id === 'bia') { R(8 * T + 4, 2, 2, 24, '#8a5a2a'); R(8 * T, 4, 14, 12, '#f8f4ec'); R(8 * T + 2, 6, 5, 4, '#e86a8a'); R(8 * T + 7, 9, 4, 5, '#5ab8e8'); }
      if (id === 'tonico') { for (let k = 0; k < 4; k++) R(8 * T + k * 6, 2 + (k % 2) * 3, 4, 22, ['#d8b070', '#7a4a28', '#c8763a', '#5a2a1a'][k]); }
      if (id === 'juca') { R(8 * T, 8, 24, 16, '#8a5a2a'); for (let k = 0; k < 6; k++) R(8 * T + 2 + (k % 3) * 7, 10 + Math.floor(k / 3) * 6, 6, 4, '#f4f0e8'); }
      if (id === 'cida') { for (let k = 0; k < 3; k++) { R(8 * T + k * 9, 14, 8, 8, '#c8944a'); disc(8 * T + k * 9 + 4, 13, 3, ['#e8402a', '#f4c83a', '#5aa83a'][k]); } }
      if (id === 'nena') { R(8 * T + 2, 10, 20, 12, '#c86a9a'); for (let k = 0; k < 3; k++) disc(8 * T + 6 + k * 6, 8, 3, ['#ff8ac8', '#f4c83a', '#ffffff'][k]); }
      if (id === 'rosa') { R(8 * T, 6, 26, 3, '#7a4a24'); for (const [x, c] of [[2, '#8a8a92'], [9, '#c8a050'], [16, '#8a8a92']]) R(8 * T + x, 9, 4, 12, c); }
    } });
    // brinquedo do Caio na casa da Vó Nena
    if (id === 'nena') ents.push({ y: 6 * T, f: () => { disc(8 * T + 8, 6 * T + 10, 4, '#e8402a'); R(8 * T + 6, 6 * T + 7, 4, 1, '#ffffff'); } });
  }

  // ---------- placas com nome e horário ----------
  const PLACAS = [['store', 'Armazém', 'pedro'], ['atelie', 'Ateliê', 'bia'], ['moveis', 'Marcenaria', 'tonico'], ['smith', 'Ferraria', 'claudio'], ['carpentry', 'Carpintaria', 'rosa'], ['bar', 'Bar da Lia', 'lia'], ['ranch', 'Rancho', 'marta'], ['cc', 'Centro Comunitário'], ['museum', 'Museu']];
  const hh = m => `${Math.floor(m / 60) % 24}h`;
  function placa(txt, x, y) {
    ctx.font = '700 7px "Pixelify Sans", monospace';
    const w = Math.ceil(ctx.measureText(txt).width) + 8;
    R(Math.round(x - w / 2) - 1, y - 6, w + 2, 12, '#5a3418'); R(Math.round(x - w / 2), y - 5, w, 10, '#e8c890');
    drawText(txt, x, y, '#3a1e0a', 7);
  }
  function placaEnts(m, ents) {
    if (m.id !== 'town') return;
    for (const [k, nome, who] of PLACAS) {
      const p = V[k]; if (!p) continue;
      const n = who && NPCS[who], txt = n && n.hours ? `${nome} · ${hh(n.hours[0])}–${hh(n.hours[1])}` : nome;
      ents.push({ y: (p[1] + p[3]) * T + 1, f: () => placa(txt, p[4] * T + 8, (p[1] + p[3]) * T - 30) });
    }
    for (const [id, [x, y]] of Object.entries(V.casas)) ents.push({ y: (y + 4) * T + 1, f: () => placa(LAR_DONO[id].replace(/^(Doutor|Professora|Seu|Dona) /, '').split(' e ')[0], (x + 1.4) * T, (y + 4) * T - 12) });
  }

  // postes acesos e janelas das lojas à noite
  function vilaLights(m, light, nf) {
    if (!m.outdoor || !m.lanterns || nf <= 0) return;
    for (const [lx, ly] of m.lanterns) light(lx * T + 8, ly * T + 8, 48, nf * 0.7);
    for (const s of m.sprites) if (['atelie', 'moveis', 'ccbuilding', 'museumb', 'coreto'].includes(s.type)) light(s.x * T + s.w * T / 2, (s.y + s.h) * T - 20, 50, nf * 0.35);
  }
  // ---------- coreto da praça ----------
  function drawCoreto(w, h, night, snow) {
    const c = '#f4f0e8', d = '#c8b8a0';
    R(0, h - 10, w, 10, '#b8a888'); R(2, h - 12, w - 4, 3, '#d8c8a8');
    for (const x of [2, w / 2 - 2, w - 6]) { R(x, 8, 4, h - 18, c); R(x + 3, 8, 1, h - 18, d); }
    for (let x = 4; x < w - 4; x += 4) R(x, h - 22, 2, 10, c); R(2, h - 23, w - 4, 2, c);
    poly([[-6, 10], [w / 2, -22], [w + 6, 10]], snow ? '#e8eef4' : '#2a6a5a'); poly([[-6, 10], [w / 2, -18], [w + 6, 10], [w + 6, 13], [-6, 13]], snow ? '#ffffff' : '#3a8a6a');
    for (let k = 0; k < 8; k++) disc(k * (w / 7), 13, 3, snow ? '#ffffff' : '#3a8a6a');
    R(w / 2 - 1, -26, 2, 6, '#c8a050'); disc(w / 2, -27, 2, '#f4c83a');
    for (let k = 0; k < 6; k++) disc(6 + k * ((w - 12) / 5), 17, 1.6, night ? ['#ffe08a', '#ff8ac8', '#8ad8ff'][k % 3] : '#c8b8a0');
  }

  // ---------- moradores conversando ----------
  const CONVOS = {
    'caio|nena': [['caio', 'Vó, posso ir na praia?'], ['nena', 'Só se levar o chapéu!'], ['caio', 'Tá booom...']],
    'nena|caio': [['nena', 'Comeu o lanche, meu neto?'], ['caio', 'Comi! E o biscoito também!']],
    'rosa|tonico': [['tonico', 'Rosa, me arruma um prego?'], ['rosa', 'Prego eu tenho. Paciência, não!'], ['tonico', 'Haha, justo.']],
    'tonico|rosa': [['rosa', 'Esse ipê ficou lindo, Tonico.'], ['tonico', 'Veio lá da Mata Antiga!']],
    'davi|lia': [['davi', 'Lia, menos sal hoje, hein?'], ['lia', 'Doutor, sal é amor!']],
    'lia|davi': [['lia', 'O de sempre, doutor?'], ['davi', 'Uma salada. E uma pizza.']],
    'cida|pedro': [['pedro', 'Como estão os preços hoje?'], ['cida', 'A abóbora disparou!'], ['pedro', 'Vou plantar mais, então.']],
    'pedro|cida': [['cida', 'Seu Pedro, me vende semente?'], ['pedro', 'Pra você, a melhor!']],
    'claudio|tonico': [['claudio', 'Precisa de prego de ferro?'], ['tonico', 'Do bom! Os seus duram.']],
    'bia|nena': [['bia', 'Posso pintar o seu jardim?'], ['nena', 'Ai, que honra, minha filha!']],
    'caio|bia': [['caio', 'Me desenha um dragão?'], ['bia', 'Só se você posar de cavaleiro!']],
    'davi|nena': [['davi', 'Tomando o remédio, Vó?'], ['nena', 'Tomando, doutor. Com chá!']],
    'marta|cida': [['marta', 'Leite fresquinho chegando!'], ['cida', 'Guarda dois litros pra mim!']],
    'claudio|davi': [['davi', 'Machucou a mão de novo?'], ['claudio', 'Martelo teimoso...']],
  };
  const CONVO_GERAL = {
    rain: [['Que chuvarada!', 'Bom pra horta, pelo menos.'], ['Esqueci o guarda-chuva...', 'Corre pro bar!']],
    spring: [['As flores voltaram!', 'A praça fica linda assim.'], ['Que cheirinho de primavera.', 'É o jardim da Vó Nena!']],
    summer: [['Que calor!', 'Bora pra praia mais tarde?'], ['Viu o pôr do sol ontem?', 'Lindo demais!']],
    fall: [['Olha as folhas caindo.', 'Época de abóbora!'], ['Já tá esfriando...', 'Hora do cachecol.']],
    winter: [['Que frio!', 'Chocolate quente no bar?'], ['Nevou na mina?', 'Dizem que sim!']],
    fest: [['Animado pra festa?', 'Muito! Vai ter comidinha!'], ['Que festa bonita!', 'A vila caprichou.']],
    casal: [['Viu o casal da chacrinha?', 'Trabalham tanto! Uns fofos.'], ['A chacrinha tá linda.', 'Dá gosto de ver.']],
  };
  let convos = [], convoT = 0;
  const convoRecent = new Map();
  function npcVisible(m) { const out = []; for (const id of Object.keys(NPCS)) { const p = npcPos(id); if (p && p.map === m.id) out.push([id, p]); } return out; }
  // quem salvou na vila antiga pode cair dentro de um prédio: vai para a praça
  let vilaFixed = false;
  function vilaFix() {
    if (vilaFixed || !P || !W.meta) return; vilaFixed = true;
    const m = MAPS.town;
    if (P.map === 'town' && blocked(m, P.x, P.y)) { P.x = 40 * T + 8; P.y = 29 * T + 10; dirty(); }
    const pt = P.pet; if (pt && pt.mode === 'roam' && pt.map === 'town' && (!pt.hx || blocked(m, pt.hx, pt.hy))) { pt.hx = 38 * T; pt.hy = 30 * T; petSt.x = pt.hx; petSt.y = pt.hy; dirty(); }
  }
  function updateConvos(dt) {
    vilaFix();
    const m = curMap(); if (!m) return;
    const now = performance.now();
    for (const c of convos) { c.t -= dt; if (c.t <= 0) { c.i++; c.t = 3; } }
    convos = convos.filter(c => c.i < c.lines.length && c.map === m.id);
    convoT -= dt; if (convoT > 0) return; convoT = 1.5;
    const vis = npcVisible(m).filter(([, p]) => !p.walk), busy = new Set(convos.flatMap(c => [c.a, c.b]));
    for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) {
      const [a, pa] = vis[i], [b, pb] = vis[j];
      if (busy.has(a) || busy.has(b) || Math.hypot(pa.x - pb.x, pa.y - pb.y) > 3.2 * T) continue;
      const key = [a, b].sort().join('|'); if (convoRecent.has(key) && now - convoRecent.get(key) < 45000) continue;
      if (Math.random() > 0.5) continue;
      convoRecent.set(key, now);
      let lines = CONVOS[a + '|' + b] || CONVOS[b + '|' + a];
      if (!lines || Math.random() < 0.3) {
        const f = typeof festOn === 'function' && festOn(), pool = f ? CONVO_GERAL.fest : W.meta.rain ? CONVO_GERAL.rain : Math.random() < 0.25 ? CONVO_GERAL.casal : CONVO_GERAL[season()];
        const [x, y] = pick(pool); lines = [[a, x], [b, y]];
      }
      convos.push({ a, b, lines, i: 0, t: 3, map: m.id }); busy.add(a); busy.add(b);
    }
  }
  function balao(txt, x, y) {
    ctx.font = '700 7px "Pixelify Sans", monospace';
    const w = Math.ceil(ctx.measureText(txt).width) + 8, bx = Math.round(x - w / 2), by = Math.round(y - 12);
    R(bx - 1, by - 1, w + 2, 13, '#3a1e0a'); R(bx, by, w, 11, '#ffffff'); poly([[x - 3, by + 11], [x + 3, by + 11], [x, by + 15]], '#ffffff');
    drawText(txt, x, by + 6, '#3a1e0a', 7);
  }
  function convoEnts(m, ents) {
    for (const c of convos) {
      if (c.map !== m.id) continue;
      const [who, txt] = c.lines[c.i] || []; if (!who) continue;
      ents.push({ y: 1e9, f: () => { const p = npcPos(who); if (p && p.map === m.id) balao(txt, p.x, p.y - 40); } });
    }
  }

  // ---------- momentos com os moradores (com 4 e 8 corações) ----------
  const MOMENTOS = {
    pedro: [{ h: 4, falas: ['Sabe, meu pai abriu esse armazém com um saco de feijão e muita teimosia.', 'Ver vocês dois plantando me lembra ele. Ele ia gostar de vocês.'], presente: ['s_morango', 10] },
      { h: 8, falas: ['Tenho uma coisa pra vocês. É a balança antiga do armazém.', 'Ela já pesou a colheita da vila inteira. Agora pesa a de vocês, simbolicamente!'], presente: ['ouro', 3] }],
    claudio: [{ h: 4, falas: ['O fogo da forja nunca apagou desde que eu era menino.', 'Meu avô dizia: ferro bom é igual amizade, só fica firme se passar pelo fogo.'], presente: ['barraferro', 3] },
      { h: 8, falas: ['Forjei isso pensando em vocês. Um par de alianças de ferro... brincadeira!', 'Mas o carinho é de verdade. Toma, uma barra de ouro pra caprichar nas ferramentas.'], presente: ['barraouro', 2] }],
    rosa: [{ h: 4, falas: ['Todo prédio da vila tem um pedacinho de mim. O coreto foi o primeiro.', 'Quando a chacrinha crescer, quero construir algo bem bonito pra vocês.'], presente: ['madeira', 50] },
      { h: 8, falas: ['Guardei as melhores tábuas de carvalho que já vi.', 'São de vocês. Façam algo que dure a vida inteira.'], presente: ['mcarvalho', 20] }],
    marta: [{ h: 4, falas: ['A Mimosa, minha vaca mais velha, me acordou às 4h hoje. De novo.', 'Mas sabe que eu nem ligo? Bicho é família.'], presente: ['feno', 30] },
      { h: 8, falas: ['Vocês cuidam tão bem dos animais que eu fico orgulhosa.', 'Esse queijo é da receita da minha mãe. Ninguém mais tem.'], presente: ['queijo', 5] }],
    ze: [{ h: 4, falas: ['Uma vez fisguei um peixe tão grande que ele me puxou pro rio!', 'Até hoje não sei quem pescou quem.'], presente: ['isca', 30] },
      { h: 8, falas: ['Essa vara foi do meu pai. A linha é nova, mas a sorte é antiga.', 'Pega essas iscas especiais. E um segredo: o peixe gosta de silêncio.'], presente: ['anzolgiratorio', 1] }],
    lia: [{ h: 4, falas: ['Abri o bar porque queria um lugar onde todo mundo se sentisse em casa.', 'E vocês dois sempre chegam sorrindo. Isso faz meu dia.'], presente: ['pizza', 3] },
      { h: 8, falas: ['Inventei um prato novo e quero que vocês sejam os primeiros a provar.', 'Se gostarem, ele vai se chamar "o prato do casal"!'], presente: ['parmegiana', 2] }],
    bia: [{ h: 4, falas: ['Tô pintando um quadro da vila inteira, casinha por casinha.', 'A chacrinha de vocês vai ficar bem no meio. É a parte mais bonita.'], presente: ['narciso', 5] },
      { h: 8, falas: ['Terminei o quadro! Olha vocês dois aqui, de mãos dadas na horta.', 'Fiz uma cópia pequenininha pra vocês guardarem.'], presente: ['frutaestelar', 1] }],
    davi: [{ h: 4, falas: ['Vim pra vila só por um verão. Já faz doze anos.', 'Acho que o ar daqui cura mais do que meus remédios.'], presente: ['cafereforcado', 2] },
      { h: 8, falas: ['Promete que vão cuidar um do outro quando estiverem cansados?', 'Isso aqui é por conta da casa. Receita do doutor: descanso e carinho.'], presente: ['tortamirtilo', 2] }],
    nena: [{ h: 4, falas: ['Meu Joaquim plantou o primeiro canteiro da praça para mim.', 'Toda primavera, quando as flores abrem, parece que ele tá me dando bom-dia.'], presente: ['biscoito', 4] },
      { h: 8, falas: ['Vocês dois me lembram tanto eu e o Joaquim...', 'Toma essas sementes do jardim dele. Plantem juntinhos.'], presente: ['s_jazz', 10] }],
    caio: [{ h: 4, falas: ['Psiu! Quer saber meu esconderijo secreto? Fica atrás do coreto!', 'Não conta pra Vó, tá?'], presente: ['concha', 3] },
      { h: 8, falas: ['Quando eu crescer quero ser igual a vocês e ter uma chacrinha!', 'Toma, achei essa pedra brilhante na praia. É a minha mais especial.'], presente: ['ametista', 2] }],
    cida: [{ h: 4, falas: ['Trinta anos de feira, sabia? Já vi essa vila mudar tanto!', 'Mas freguês bom igual vocês, poucas vezes.'], presente: ['melao', 3] },
      { h: 8, falas: ['Sabe o que é o segredo de uma boa feira? Gente que volta.', 'E vocês sempre voltam. Isso aqui é presente da tia Cida.'], presente: ['mel', 5] }],
    tonico: [{ h: 4, falas: ['Meu primeiro móvel foi uma cadeira torta pra minha mãe.', 'Ela usou até o fim. Disse que era a mais confortável do mundo.'], presente: ['mpinho', 20] },
      { h: 8, falas: ['Fiz uma coisa pra vocês sem cobrar nada. Uma cadeira de pinho.', 'Essa não ficou torta. Mas é feita com o mesmo carinho.'], presente: ['cadeirapinho', 2] }],
  };
  function momentoFor(id) {
    const evs = MOMENTOS[id]; if (!evs) return null;
    const seen = P.flags.mom || {};
    return evs.find(e => hearts(id) >= e.h && !seen[id + e.h]) || null;
  }
  function openMomento(id, e) {
    P.flags.mom = { ...(P.flags.mom || {}), [id + e.h]: W.meta.day };
    const [pid, pn] = e.presente || [];
    if (pid && ITEMS[pid]) addItem(pid, pn, true);
    dirty(); sfx.level();
    openPanel(`<div class="talk"><canvas id="portrait" width="40" height="40" aria-hidden="true"></canvas><div><h2 style="text-align:left;margin:0">Um momento com ${NPCS[id].name}</h2><small>${e.h} corações</small></div></div>
      ${e.falas.map(f => `<p class="speech">${esc(f)}</p>`).join('')}
      ${pid && ITEMS[pid] ? `<p style="text-align:center"><img src="${iconURL(pid)}" alt="" style="width:24px;height:24px;image-rendering:pixelated;vertical-align:middle"> Você ganhou ${pn}× ${item(pid).name}!</p>` : ''}
      <div class="row"><button class="btn g" data-a="close" type="button">Obrigado!</button></div>`, 'talk', id);
    drawPortrait(id);
  }

  // ---------- onde fica cada coisa (para o mapa) ----------
  const LUGARES = [['Praça', 31, 19, 49, 37], ['Rua do Comércio', 3, 17, 30, 26], ['Rua de cima', 3, 3, 78, 16], ['Bairro das casas', 50, 30, 78, 44], ['Rancho e pasto', 3, 30, 30, 44], ['Beira-rio', 1, 45, 78, 54], ['Rua principal', 0, 27, 79, 29], ['Leste da vila', 50, 17, 78, 29]];
  function lugarNome(map, x, y) {
    if (map === 'town') { const tx = x / T, ty = y / T; const l = LUGARES.find(([, x0, y0, x1, y1]) => tx >= x0 && tx <= x1 + 1 && ty >= y0 && ty <= y1 + 1); return l ? l[0] : 'na vila'; }
    const m = getMap(map); return m ? m.name : map;
  }
  const MAPA_ROTULOS = [['store', 'Armazém'], ['atelie', 'Ateliê'], ['moveis', 'Marcenaria'], ['smith', 'Ferraria'], ['carpentry', 'Carpintaria'], ['cc', 'Centro'], ['museum', 'Museu'], ['bar', 'Bar'], ['ranch', 'Rancho']];
  function mapaHTML() {
    const list = Object.keys(NPCS).map(id => { const p = npcPos(id); return `<div class="item"><span class="nm"><b>${NPCS[id].name}</b><small>${p ? lugarNome(p.map, p.x, p.y) : 'em casa, descansando'}</small></span></div>`; }).join('');
    return `<p style="text-align:center;font-size:13px">A vila agora: você é o ponto vermelho; os moradores são os pontinhos amarelos.</p>
      <canvas id="mapcv" width="${V.w * 6}" height="${V.h * 6}" style="width:100%;image-rendering:pixelated;border:2px solid #6b3410;border-radius:6px"></canvas>
      <h3>Onde está cada um</h3><div class="list">${list}</div>`;
  }
  function drawMapa() {
    const c = document.getElementById('mapcv'); if (!c) return;
    const x = c.getContext('2d'), m = MAPS.town, k = 6;
    const col = g => ({ [G.GRASS]: '#6ab04a', [G.FLOWERS]: '#7ab85a', [G.COBBLE]: '#d8c8a0', [G.WATER]: '#4a8ad8', [G.SAND]: '#e8d8a0', [G.FOREST]: '#2a6a2a', [G.BRIDGE]: '#a8743a', [G.DIRT]: '#b88a5a', [G.CLIFF]: '#7a6a5a' }[g] || '#6ab04a');
    for (let ty = 0; ty < m.h; ty++) for (let tx = 0; tx < m.w; tx++) { x.fillStyle = col(m.at(tx, ty)); x.fillRect(tx * k, ty * k, k, k); }
    x.fillStyle = '#9a5a3a'; for (const s of m.sprites) if (s.w >= 3 && s.type !== 'fountain' && s.type !== 'marketstall' && s.type !== 'bench') x.fillRect(s.x * k, s.y * k, s.w * k, s.h * k);
    x.fillStyle = '#5ab8e8'; x.fillRect(V.fonte[0] * k, V.fonte[1] * k, 3 * k, 3 * k);
    x.font = '700 9px "Pixelify Sans", monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
    const label = (t, px, py) => { x.fillStyle = '#3a1e0a'; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) x.fillText(t, px + dx, py + dy); x.fillStyle = '#ffffff'; x.fillText(t, px, py); };
    for (const [key, nome] of MAPA_ROTULOS) { const p = V[key]; if (p) label(nome, (p[0] + p[2] / 2) * k, (p[1] + p[3] / 2) * k); }
    for (const [id, [hx, hy]] of Object.entries(V.casas)) label(LAR_DONO[id].split(' ')[0], (hx + 2.5) * k, (hy + 2) * k);
    label('Praça', 40 * k, 23 * k); label('Mina', 40 * k, 4 * k); label('Praia', 40 * k, 52 * k); label('Chacrinha', 6 * k, 28 * k); label('Mata', 74 * k, 28 * k);
    for (const id of Object.keys(NPCS)) { const p = npcPos(id); if (!p || p.map !== 'town') continue; x.fillStyle = '#3a1e0a'; x.fillRect(p.x / T * k - 3, p.y / T * k - 3, 6, 6); x.fillStyle = '#ffd040'; x.fillRect(p.x / T * k - 2, p.y / T * k - 2, 4, 4); }
    if (P.map === 'town') { x.fillStyle = '#ffffff'; x.fillRect(P.x / T * k - 4, P.y / T * k - 4, 8, 8); x.fillStyle = '#e8402a'; x.fillRect(P.x / T * k - 3, P.y / T * k - 3, 6, 6); }
  }
