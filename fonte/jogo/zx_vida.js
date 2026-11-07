  // ================= vida na vila e eventos: bichos, pombos, pasto, varais, feira de sábado, mercador e pedidos =================

  // ---------- pasto da Marta (cercado com vacas e ovelhas) ----------
  const PASTO = { x0: 13, y0: 31, x1: 26, y1: 38, porta: 35 };
  { const m = MAPS.town;
    for (let x = PASTO.x0; x <= PASTO.x1; x++) for (const y of [PASTO.y0, PASTO.y1]) m.solid[y * m.w + x] = 1;
    for (let y = PASTO.y0; y <= PASTO.y1; y++) for (const x of [PASTO.x0, PASTO.x1]) if (!(x === PASTO.x0 && y === PASTO.porta)) m.solid[y * m.w + x] = 1; }

  // ---------- bichos da vila (cada aparelho vê os seus; só enfeite e carinho) ----------
  const VILA_BICHOS = [
    { id: 'mingau', nome: 'Mingau', tipo: 'gato', cor: '#e8862a', cor2: '#f8c88a', area: [31, 20, 49, 37] },
    { id: 'nuvem', nome: 'Nuvem', tipo: 'gato', cor: '#e8e8e8', cor2: '#a8a8b0', area: [50, 30, 78, 44] },
    { id: 'pipoca', nome: 'Pipoca', tipo: 'cachorro', cor: '#c8944a', cor2: '#7a4a24', area: [3, 40, 78, 48] },
    { id: 'mimosa', nome: 'Mimosa', tipo: 'vaca', area: [PASTO.x0 + 1, PASTO.y0 + 1, PASTO.x1 - 1, PASTO.y1 - 1] },
    { id: 'estrela', nome: 'Estrela', tipo: 'vaca', v: 1, area: [PASTO.x0 + 1, PASTO.y0 + 1, PASTO.x1 - 1, PASTO.y1 - 1] },
    { id: 'algodao', nome: 'Algodão', tipo: 'ovelha', area: [PASTO.x0 + 1, PASTO.y0 + 1, PASTO.x1 - 1, PASTO.y1 - 1] },
  ];
  const bichoSt = {};
  function updateVidaBichos(dt) {
    if (P.map !== 'town') return;
    const m = MAPS.town;
    for (const b of VILA_BICHOS) {
      let s = bichoSt[b.id];
      if (!s) { const [x0, y0, x1, y1] = b.area; s = bichoSt[b.id] = { x: (x0 + (x1 - x0) * hash(b.id.length, 3, 7)) * T, y: (y0 + (y1 - y0) * hash(b.id.length, 5, 9)) * T, tx: 0, ty: 0, wait: rnd(0, 3), mv: 0, dir: 3, heart: 0 }; s.tx = s.x; s.ty = s.y; }
      s.heart = Math.max(0, s.heart - dt);
      if (s.mv) {
        const dx = s.tx - s.x, dy = s.ty - s.y, d = Math.hypot(dx, dy), sp = (b.tipo === 'cachorro' ? 40 : b.tipo === 'gato' ? 26 : 12) * dt;
        if (d < sp) { s.mv = 0; s.wait = rnd(2, 7); }
        else { const nx = s.x + dx / d * sp, ny = s.y + dy / d * sp; if (!m.solid[Math.floor((ny - 3) / T) * m.w + Math.floor(nx / T)]) { s.x = nx; s.y = ny; if (Math.abs(dx) > 0.5) s.dir = dx < 0 ? 2 : 3; } else { s.mv = 0; s.wait = 1; } }
      } else {
        s.wait -= dt;
        if (s.wait <= 0) { const [x0, y0, x1, y1] = b.area; s.tx = (x0 + Math.random() * (x1 - x0)) * T + 8; s.ty = (y0 + Math.random() * (y1 - y0)) * T + 12; s.mv = 1; }
      }
    }
  }
  function quadrupede(b, x, y, dir, mv) {
    const f = mv ? Math.floor(performance.now() / 140) % 2 : 0, c = b.cor, d = b.cor2;
    const key = `vb|${b.id}|${f}|${mv ? 1 : 0}`;
    const cv = bake(key, 22, 16, () => {
      const leg = f ? 1 : -1, cachorro = b.tipo === 'cachorro';
      R(5 + leg, 11, 2, 4, d); R(8 - leg, 11, 2, 4, d); R(12 + leg, 11, 2, 4, d); R(15 - leg, 11, 2, 4, d);
      oval(11, 9, 7, cachorro ? 3.8 : 3.4, c); R(7, 7, 7, 1, b.cor2 && !cachorro ? shade(c, 0.2) : shade(c, 0.15));
      disc(17, 6, cachorro ? 3.6 : 3.3, c);
      if (cachorro) { R(18, 6, 3, 2, d); R(20, 6, 1, 1, '#1a1010'); R(14, 3, 3, 5, d); R(17, 5, 1, 1, '#1a1010'); ctx.strokeStyle = d; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(4, 8); ctx.quadraticCurveTo(1, 6, 2, 3); ctx.stroke(); }
      else { poly([[14.5, 4], [15, 0.5], [17, 3]], c); poly([[18, 3], [20, 0.5], [20, 4.5]], c); R(18, 5, 1, 2, '#3a8a2a'); R(16, 5, 1, 2, '#3a8a2a'); R(19, 7, 1, 1, '#e88a9a'); for (const xx of [8, 11, 14]) R(xx, 6, 1, 3, d); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(4, 8); ctx.quadraticCurveTo(0, f ? 6 : 8, 1, 2); ctx.stroke(); }
    });
    x = Math.round(x); y = Math.round(y); shadowAt(x, y, 6, 1.6);
    ctx.save(); ctx.translate(x, y - 15); if (dir === 2) { ctx.scale(-1, 1); } ctx.drawImage(cv, -11, 0); ctx.restore();
  }
  // carinho nos bichos da vila
  function vidaBichoAct(m, fx, fy) {
    if (m.id !== 'town') return false;
    for (const b of VILA_BICHOS) {
      const s = bichoSt[b.id]; if (!s || Math.hypot(s.x - fx, s.y - 6 - fy) > 14) continue;
      s.heart = 1.6; s.mv = 0; s.wait = 3;
      if (b.tipo === 'gato') meow(); else if (b.tipo === 'cachorro') { tone(320, 240, 0.08, 'square', 0.05); tone(340, 260, 0.08, 'square', 0.05, 0.12); } else tone(180, 140, 0.4, 'sawtooth', 0.04);
      const fala = { gato: `${b.nome} se esfrega na sua perna e ronrona.`, cachorro: `${b.nome} abana o rabo e pede mais carinho!`, vaca: `${b.nome} faz "muuu" bem satisfeita.`, ovelha: `${b.nome} encosta a cabeça fofinha em você.` }[b.tipo];
      toast(fala, '', null, 'bichovila');
      if (!(P.flags.bichos && P.flags.bichos[b.id] === W.meta.day)) { P.flags.bichos = { ...(P.flags.bichos || {}), [b.id]: W.meta.day }; P.energy = Math.min(P.maxEnergy, P.energy + 3); dirty(); }
      return true;
    }
    return false;
  }

  // ---------- pombos na praça: voam quando alguém chega perto ----------
  const POMBOS = Array.from({ length: 6 }, (_, i) => ({ hx: (34 + i * 2.2 + (i % 2)) * T, hy: (24 + (i % 3) * 1.5) * T, x: 0, y: 0, voo: 0, volta: 0, ph: i * 1.7 }));
  for (const p of POMBOS) { p.x = p.hx; p.y = p.hy; }
  function updatePombos(dt) {
    if (P.map !== 'town') return;
    for (const p of POMBOS) {
      if (p.voo > 0) { p.voo += dt; p.x += (p.ph % 2 ? 60 : -60) * dt; p.y -= 70 * dt; if (p.voo > 2.5) { p.voo = 0; p.volta = rnd(12, 25); } continue; }
      if (p.volta > 0) { p.volta -= dt; if (p.volta <= 0) { p.x = p.hx; p.y = p.hy; } continue; }
      if (Math.hypot(P.x - p.x, P.y - p.y) < 30 && walkT > 0) { p.voo = 0.01; tone(900, 1300, 0.06, 'triangle', 0.02); }
    }
  }
  function drawPombo(p, t) {
    const x = Math.round(p.x), y = Math.round(p.y);
    if (p.volta > 0) return;
    if (p.voo > 0) { const asa = Math.sin(t * 30 + p.ph) > 0; R(x - 3, y - 2, 6, 3, '#8a8a98'); R(x - (asa ? 6 : 4), y - (asa ? 4 : 1), 3, 2, '#a8a8b8'); R(x + (asa ? 3 : 1), y - (asa ? 4 : 1), 3, 2, '#a8a8b8'); return; }
    const bica = Math.sin(t * 3 + p.ph) > 0.7 ? 1 : 0;
    shadowAt(x, y + 1, 3, 1); oval(x, y - 2, 3, 2, '#8a8a98'); disc(x + 3, y - 4 + bica, 1.6, '#6a6a7a'); R(x + 4, y - 4 + bica, 1, 1, '#e8a03a'); R(x + 2, y - 3 + bica, 1, 1, '#5ab88a'); R(x - 1, y, 1, 1, '#e8806a'); R(x + 1, y, 1, 1, '#e8806a');
  }

  // ---------- enfeites: cerca do pasto, varais, chaminés e a bola do Caio ----------
  const VARAIS = [[56, 42.8], [63, 42.8], [70, 42.8]];
  function vidaEnts(m, ents, t) {
    if (m.id !== 'town') return;
    // cerca
    ents.push({ y: PASTO.y0 * T + 12, f: () => { for (let x = PASTO.x0; x <= PASTO.x1; x++) { R(x * T, PASTO.y0 * T + 4, 16, 2, '#a8743a'); R(x * T, PASTO.y0 * T + 9, 16, 2, '#a8743a'); R(x * T + 7, PASTO.y0 * T + 1, 3, 13, '#7a4a24'); } } });
    ents.push({ y: PASTO.y1 * T + 12, f: () => { for (let x = PASTO.x0; x <= PASTO.x1; x++) { R(x * T, PASTO.y1 * T + 4, 16, 2, '#a8743a'); R(x * T, PASTO.y1 * T + 9, 16, 2, '#a8743a'); R(x * T + 7, PASTO.y1 * T + 1, 3, 13, '#7a4a24'); } } });
    for (let y = PASTO.y0 + 1; y < PASTO.y1; y++) for (const x of [PASTO.x0, PASTO.x1]) { if (x === PASTO.x0 && y === PASTO.porta) continue; ents.push({ y: y * T + 12, f: () => { R(x * T + 7, y * T, 3, 16, '#7a4a24'); R(x * T + 6, y * T, 5, 2, '#a8743a'); } }); }
    // bichos e pombos
    for (const b of VILA_BICHOS) {
      const s = bichoSt[b.id]; if (!s) continue;
      ents.push({ y: s.y, f: () => {
        if (b.tipo === 'vaca' || b.tipo === 'ovelha') drawAnimal({ kind: b.tipo, v: b.v || 0 }, s.x, s.y, s.dir, s.mv, false, false);
        else quadrupede(b, s.x, s.y, s.dir, s.mv);
        if (s.heart > 0) drawHeart(s.x, s.y - 22 - (1.6 - s.heart) * 6, '#e83a6a');
      } });
    }
    for (const p of POMBOS) ents.push({ y: p.voo > 0 ? 1e8 : p.y, f: () => drawPombo(p, t) });
    // varais no bairro das casas
    for (const [vx, vy] of VARAIS) ents.push({ y: vy * T + 12, f: () => {
      const x = vx * T, y = vy * T; R(x, y - 18, 2, 20, '#7a4a24'); R(x + 30, y - 18, 2, 20, '#7a4a24'); R(x, y - 18, 32, 1, '#e8e0d0');
      for (let k = 0; k < 3; k++) { const sw = Math.sin(t * 2 + k) * 1, c = ['#e8402a', '#3a8ad8', '#f4f0e8', '#f4c83a', '#5ab83a'][(k + vx) % 5]; R(x + 4 + k * 9 + sw, y - 17, 7, k % 2 ? 9 : 7, c); R(x + 4 + k * 9 + sw, y - 17, 7, 1, shade(c, -0.3)); }
    } });
    // chaminés com fumaça nas casinhas
    for (const [id, [hx, hy]] of Object.entries(VILA.casas)) { const ch = LAR_FUMACA[id]; if (ch) ents.push({ y: (hy + 4) * T + 2, f: () => {
      const cx = hx * T + ch[0], cy = hy * T + ch[1] + 8;
      for (let k = 0; k < 3; k++) { const pr = (t * 0.35 + k / 3) % 1; ctx.fillStyle = `rgba(230,230,235,${0.5 * (1 - pr)})`; ctx.beginPath(); ctx.arc(cx + Math.sin(pr * 6 + k) * 3, cy - 8 - pr * 22, 2 + pr * 4, 0, TAU); ctx.fill(); }
    } }); }
    // a bola do Caio quando ele está brincando na vila
    const caio = npcPos('caio');
    if (caio && caio.map === 'town' && !caio.walk) ents.push({ y: caio.y + 1, f: () => { const b = Math.abs(Math.sin(t * 4)) * 10; shadowAt(caio.x + 12, caio.y + 1, 3, 1); disc(caio.x + 12, caio.y - 3 - b, 3, '#e8402a'); R(caio.x + 11, caio.y - 5 - b, 2, 1, '#ffffff'); } });
  }

  // ---------- feira de sábado na praça ----------
  const isSabado = () => W.meta && (W.meta.day - 1) % 7 === 5;
  const feiraAberta = () => isSabado() && nowMin() >= 480 && nowMin() < 960;
  const FEIRA = [
    { id: 'feira1', x: 32, y: 25, nome: 'Barraca do Seu Bento', look: { hair: 5, shirt: 2, skin: 2, pants: '#5a4a3a', beard: true, apron: '#5aa83a' }, cor: '#5aa83a', titulo: 'Sementes de outras estações', greet: '“Semente boa de toda estação! Pra quem tem estufa, é ouro.”' },
    { id: 'feira2', x: 45, y: 25, nome: 'Barraca da Dona Lurdes', look: { hair: 3, style: 2, shirt: 4, skin: 0, pants: '#6a4a7a', apron: '#c86ad8' }, cor: '#c86ad8', titulo: 'Artesanato e raridades', greet: '“Tudo feito à mão ou achado longe daqui!”' },
  ];
  { const m = MAPS.town; for (const f of FEIRA) for (let x = f.x; x < f.x + 3; x++) spot(m, x, f.y + 1, { kind: 'feira', id: f.id }); }
  for (const f of FEIRA) SHOP_INFO[f.id] = { title: f.titulo, tabs: [['buy', 'Comprar']], greet: () => f.greet };
  function feiraList(id) {
    if (id === 'feira1') { const s = season(); return Object.entries(CROPS).filter(([k, c]) => !c.mix && !c.seasons.includes(s)).map(([k, c]) => ({ id: 's_' + k, price: Math.round(c.seed * 2) })).slice(0, 12); }
    if (id === 'feira2') return [['tecido', 900], ['la', 600], ['mel', 400], ['buque', 500], ['ametista', 300], ['topazio', 250], ['trufa', 1300], ['frutaestelar', 9000]].map(([id, price]) => ({ id, price, one: id === 'frutaestelar' }));
    return null;
  }
  function feiraEnts(m, ents, t) {
    if (m.id !== 'town' || !feiraAberta()) return;
    for (const f of FEIRA) {
      ents.push({ y: (f.y - 1) * T + 14, f: () => drawFarmer(f.x * T + 24, (f.y - 1) * T + 14, f.look, 1, 0) });
      ents.push({ y: (f.y + 1) * T + 15, f: () => {
        const x = f.x * T, y = f.y * T;
        R(x + 1, y + 6, 46, 20, '#a86a3a'); R(x + 1, y + 6, 46, 3, '#c88a5a');
        for (let k = 0; k < 6; k++) R(x + k * 8, y - 8, 8, 8, k % 2 ? '#ffffff' : f.cor);
        for (let k = 0; k < 6; k++) poly([[x + k * 8, y], [x + k * 8 + 8, y], [x + k * 8 + 4, y + 3]], k % 2 ? '#ffffff' : f.cor);
        R(x + 1, y, 2, 8, '#5a3418'); R(x + 45, y, 2, 8, '#5a3418');
        for (let k = 0; k < 5; k++) disc(x + 7 + k * 8, y + 9, 3, f.id === 'feira1' ? ['#c8a060', '#a87a40', '#d8b878', '#b88a50', '#c8a060'][k] : ['#e8e0f0', '#f4c83a', '#c86ad8', '#5ab8e8', '#ff6aa8'][k]);
      } });
    }
    ents.push({ y: 1e8, f: () => placa('Feira de sábado', 40 * T, 24 * T + 4) });
  }

  // ---------- mercador viajante (alguns dias por mês, perto da saída para a mata) ----------
  const MERC = { x: 71, y: 25 };
  const mercadorHoje = () => W.meta && !isSabado() && hash(W.meta.day, 7, 13) < 0.22 && nowMin() >= 540 && nowMin() < 1080;
  { const m = MAPS.town; for (let x = MERC.x; x < MERC.x + 3; x++) spot(m, x, MERC.y + 1, { kind: 'mercador' }); }
  SHOP_INFO.mercador = { title: 'Carroça do mercador viajante', tabs: [['buy', 'Comprar']], greet: () => '“Coisas raras de terras distantes. Só hoje, amanhã eu já fui!”' };
  const MERC_POOL = [['diamante', 2500], ['esmeralda', 900], ['anelsorte', 3500], ['botasvelozes', 4500], ['trufa', 1400], ['cogumelorei', 900], ['mdourada', 2500], ['madeiralei', 300], ['frutaestelar', 8000], ['oleotrufa', 2500], ['racaopremium', 90], ['cestacafe', 500], ['s_rosafada', 400], ['coroaflores', 1500], ['colarhavaiano', 1800], ['livroinsetos', 1600]];
  function mercList() {
    const r = srand(W.meta.day * 977 + 5), pool = MERC_POOL.slice(), out = [];
    for (let i = 0; i < 6 && pool.length; i++) { const [id, price] = pool.splice(Math.floor(r() * pool.length), 1)[0]; if (ITEMS[id]) out.push({ id, price, one: ['anelsorte', 'botasvelozes', 'frutaestelar', 'livroinsetos', 'coroaflores', 'colarhavaiano'].includes(id) }); }
    return out;
  }
  function mercEnts(m, ents, t) {
    if (m.id !== 'town' || !mercadorHoje()) return;
    const x = MERC.x * T, y = MERC.y * T;
    ents.push({ y: y + 6, f: () => drawFarmer(x + 24, y + 4, { hair: 4, shirt: 4, skin: 3, pants: '#3a2a4a', beard: true, hat: 'beanie' }, 1, 0) });
    ents.push({ y: y + 31, f: () => {
      shadowAt(x + 24, y + 30, 24, 4);
      R(x, y + 8, 48, 18, '#7a3a1a'); R(x, y + 8, 48, 3, '#9a5a2a'); for (let k = 0; k < 6; k++) R(x + 2 + k * 8, y + 12, 1, 14, '#5a2a10');
      ctx.fillStyle = '#e8d8b0'; ctx.beginPath(); ctx.ellipse(x + 24, y + 8, 26, 14, 0, Math.PI, 0); ctx.fill(); for (let k = 0; k < 5; k++) R(x + 4 + k * 10, y - 4, 2, 12, '#c8b890');
      disc(x + 8, y + 27, 5, '#3a2a1a'); disc(x + 8, y + 27, 2, '#8a6a4a'); disc(x + 40, y + 27, 5, '#3a2a1a'); disc(x + 40, y + 27, 2, '#8a6a4a');
      for (let k = 0; k < 4; k++) disc(x + 10 + k * 9, y + 13, 2.5, ['#5ab8e8', '#f4c83a', '#c86ad8', '#5ad87a'][k]);
      R(x + 50, y + 18, 10, 3, '#5a3418');
    } });
    ents.push({ y: 1e8, f: () => placa('Mercador viajante', x + 24, y - 20) });
  }
  // tocar nas barracas
  function eventoSpot(sp) {
    if (sp.kind === 'feira') { if (!feiraAberta()) return false; openShop(sp.id); return true; }
    if (sp.kind === 'mercador') { if (!mercadorHoje()) return false; openShop('mercador'); return true; }
    return false;
  }

  // ---------- pedidos da semana no quadro (um deles só fecha com os dois ajudando) ----------
  const semana = () => Math.floor(((W.meta && W.meta.day) || 1) / 7);
  function pedidosDaSemana() {
    const w = semana(), r = srand(w * 4099 + 17), s = season(w * 7 + 1);
    const crops = Object.keys(CROPS).filter(k => !CROPS[k].mix && CROPS[k].seasons.includes(s)), fish = Object.keys(FISH).filter(k => !FISH[k].legend && FISH[k].seasons.includes(s) && !FISH[k].where.includes('mine'));
    const npcs = Object.keys(NPCS).filter(k => !NPCS[k].kid);
    const pk = a => a[Math.floor(r() * a.length)];
    const list = [
      { npc: pk(npcs), id: pk(crops.length ? crops : ['pastinaca']), n: 8 + Math.floor(r() * 8) },
      { npc: pk(npcs), id: pk(fish.length ? fish : ['carpa']), n: 3 + Math.floor(r() * 3) },
      { npc: pk(npcs), id: pk(['cobre', 'ferro', 'carvao', 'quartzo', 'barracobre', 'barraferro']), n: 5 + Math.floor(r() * 6) },
      { npc: 'tonico', id: pk(['mpinho', 'mcarvalho', 'mipe']), n: 30 + Math.floor(r() * 21), dupla: true },
    ];
    for (const p of list) p.premio = Math.round((sellPrice(p.id) || 20) * p.n * 1.6 + (p.dupla ? 1500 : 200));
    return list;
  }
  const pedState = () => { const st = (W.meta && W.meta.pedidos) || {}; return st.w === semana() ? st : { w: semana(), got: {}, by: {} }; };
  const temParceiro = () => Object.values(W.players || {}).some(p => p && p.uid !== P.uid);
  function pedidosHTML() {
    const st = pedState(), list = pedidosDaSemana();
    return `<h3>Pedidos da semana</h3><p style="font-size:13px;text-align:center">Mudam toda semana. Dá para entregar aos poucos; o pedido em dupla só fecha com os dois ajudando.</p><div class="list">${list.map((p, i) => {
      const got = (st.got || {})[i] || 0, done = got >= p.n, by = Object.keys(((st.by || {})[i]) || {}), falta = p.dupla && temParceiro() && by.length < 2;
      return `<div class="item${done ? ' dim' : ''}"><img src="${iconURL(p.id)}" alt=""><span class="nm"><b>${NPCS[p.npc].name}${p.dupla ? ' · em dupla' : ''}</b><small>${p.n} ${item(p.id).name.toLowerCase()} · ${got}/${p.n} · prêmio ${fmt(p.premio)} ₲${done ? ' · entregue!' : falta && got > 0 ? ' · falta a outra pessoa ajudar' : ''}</small></span>${done ? '' : `<button class="btn g" data-a="pedEntregar" data-i="${i}" type="button" ${count(p.id) > 0 ? '' : 'disabled'}>Entregar (${count(p.id)})</button>`}</div>`;
    }).join('')}</div>`;
  }
  function pedEntregar(i) {
    const st = pedState(), list = pedidosDaSemana(), p = list[i]; if (!p) return;
    const got = (st.got || {})[i] || 0; if (got >= p.n) return;
    const by = { ...(((st.by || {})[i]) || {}), [P.uid]: 1 }, precisaDois = p.dupla && temParceiro();
    // no pedido em dupla, quem entrega primeiro deixa pelo menos 1 para a outra pessoa
    let k = Math.min(count(p.id), p.n - got);
    if (precisaDois && Object.keys(by).length < 2 && got + k >= p.n) k = p.n - got - 1;
    if (k <= 0) { toast('Deixe um pouquinho para a outra pessoa completar!', '', null, 'pedido'); return; }
    removeItem(p.id, k);
    const ng = got + k;
    W.meta.pedidos = { w: st.w, got: { ...(st.got || {}), [i]: ng }, by: { ...(st.by || {}), [i]: by } };
    queueUpdate('world/meta', { pedidos: { w: st.w, got: { [i]: ng }, by: { [i]: { [P.uid]: 1 } } } });
    const r = rel(p.npc); r.pts = Math.min(2500, r.pts + Math.round(150 * k / p.n));
    if (ng >= p.n) { earn(p.premio); sfx.level(); toast(`Pedido completo! ${NPCS[p.npc].name} agradece: +${fmt(p.premio)} ₲.`, 'big', null, 'pedido'); }
    else { sfx.pop(); toast(`Entregou ${k}. Faltam ${p.n - ng}.`, '', null, 'pedido'); }
    dirty(); openBoard();
  }
  function vidaAction(a, b) { if (a === 'pedEntregar') { pedEntregar(+b.dataset.i); return true; } return false; }
  function updateVida(dt) { if (!P || !W.meta) return; updateVidaBichos(dt); updatePombos(dt); }
