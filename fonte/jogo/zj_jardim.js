  // ================= Nosso Jardim: o cantinho do casal à beira do lago da chacrinha =================
  // Gazebo e fogueira de pedra em lugares fixos (encomendados na placa), e enfeites que se colocam onde quiser:
  // canteiros (para plantar as flores colhidas), banquinhos, balanço de dois lugares, lanterna e varal de luzinhas.
  // O estado fica em W.farm.jardim = { init, gazebo: dia em que encomendou, fogo: dia }.
  const JARDIM = { x0: 23, y0: 20, x1: 45, y1: 28, placa: [24, 21], gz: { x: 36, y: 22, w: 5, h: 4 }, fogo: [30, 24] };
  const inJardim = (x, y) => x >= JARDIM.x0 && x <= JARDIM.x1 && y >= JARDIM.y0 && y <= JARDIM.y1;
  const jard = () => (W.farm && W.farm.jardim) || {};
  const pronto = k => { const d = jard()[k]; return !!d && W.meta && W.meta.day > d; };
  const inGazebo = (x, y) => { const g = JARDIM.gz; return x >= g.x && x < g.x + g.w && y >= g.y && y < g.y + g.h; };
  // a plaquinha do jardim
  { const f = MAPS.farm, [px, py] = JARDIM.placa; f.solid[py * f.w + px] = 1; spot(f, px, py, { kind: 'jardim' }); }
  // postes do gazebo e a fogueira de pedra não deixam passar; o piso do gazebo sim
  function jardimSolid(x, y) {
    const g = JARDIM.gz;
    if (pronto('gazebo') && (x === g.x || x === g.x + g.w - 1) && (y === g.y + 1 || y === g.y + g.h - 1)) return true;
    if (pronto('fogo') && x === JARDIM.fogo[0] && y === JARDIM.fogo[1]) return true;
    return false;
  }
  // na primeira vez, o jardim é limpo (só mato, pedras e galhos; plantações e máquinas ficam)
  let jardimLimpo = false;
  function jardimInit() {
    if (jardimLimpo || !W.farm || !W.farm.t || !W.meta) return; jardimLimpo = true;
    if (jard().init) return;
    for (let y = JARDIM.y0; y <= JARDIM.y1; y++) for (let x = JARDIM.x0; x <= JARDIM.x1; x++) { const tl = tile(x + ',' + y); if (tl && tl.o && ['weed', 'grass', 'rock', 'twig', 'stump', 'tree', 'forage'].includes(tl.o.k) && !tl.c) setTile(x + ',' + y, null); }
    setFarmVal('jardim', { ...jard(), init: 1 });
  }

  // ---------- itens do jardim ----------
  Object.assign(ITEMS, {
    canteiro: { name: 'Canteiro de flores', cat: 'place', desc: 'Coloque e plante nele uma flor colhida (narciso, dente-de-leão, açafrão, tulipa...). Ela fica bonita e dá uma flor a cada 3 dias.' },
    banquinho: { name: 'Banquinho de madeira', cat: 'place', desc: 'Para sentar. Com a outra pessoa sentada perto, é bem melhor.' },
    balanco: { name: 'Balanço de dois lugares', cat: 'place', desc: 'Pendurado num arco de carvalho. Balancem juntos!' },
    lanternajardim: { name: 'Lanterna de jardim', cat: 'place', desc: 'Acende sozinha à noite.' },
    varalluzes: { name: 'Varal de luzinhas', cat: 'place', desc: 'Luzinhas coloridas que acendem à noite.' },
  });
  for (const k of ['canteiro', 'banquinho', 'balanco', 'lanternajardim', 'varalluzes']) { PLACED.push(k); SOLID_OBJ.add(k); }
  RECIPES.push(
    { id: 'canteiro', need: { madeira: 5, pedra: 5 }, skill: null },
    { id: 'banquinho', need: { mpinho: 6 }, skill: null },
    { id: 'lanternajardim', need: { madeira: 4, barracobre: 1, seiva: 2 }, skill: null },
    { id: 'varalluzes', need: { madeira: 10, barracobre: 1, quartzo: 2 }, skill: ['foraging', 2] },
    { id: 'balanco', need: { mcarvalho: 12, fibra: 20, barraferro: 1 }, skill: ['foraging', 3] },
  );
  // flores que dá para plantar no canteiro e a cor de cada uma
  const FLOR_COR = { narciso: '#f4d040', dentedeleao: '#f8e040', acafrao: '#a85ae8', tulipa: '#e84a6a', jazz: '#5a8ae8', papoula: '#e8302a', flordeverao: '#e87ad8', girassol: '#f4c820', rosafada: '#f0a8d8', alhoporo: '#f4f0e8' };
  const FLOR_INVERNO = new Set(['acafrao']);

  // ---------- encomendar o gazebo e a fogueira (pela placa) ----------
  const OBRAS = {
    gazebo: { name: 'Gazebo à beira do lago', gold: 5000, need: { madeira: 80, mpinho: 40, mcarvalho: 30, barraferro: 2 }, desc: 'Branquinho, com trepadeira e luzinhas. Dá para sentar juntinhos, dançar e fazer piquenique.' },
    fogo: { name: 'Fogueira de pedra', gold: 800, need: { pedra: 50, madeira: 20, carvao: 2 }, desc: 'Com troncos em volta para sentar. Aquece, assa comidinhas e descansa melhor a dois.' },
  };
  function livreObra(k) {
    const tiles = k === 'gazebo' ? (() => { const g = JARDIM.gz, l = []; for (let y = g.y; y < g.y + g.h; y++) for (let x = g.x; x < g.x + g.w; x++) l.push([x, y]); return l; })() : [JARDIM.fogo];
    return tiles.every(([x, y]) => { const tl = tile(x + ',' + y); return !(tl && (tl.o || tl.c || tl.s)) && !bGrid().has(x + ',' + y) && !MAPS.farm.solid[y * MAPS.farm.w + x]; });
  }
  function jardimHTML() {
    const j = jard();
    return `<h2>Nosso Jardim</h2><p style="text-align:center">Um cantinho de vocês dois à beira do lago. Encomende as construções aqui e decore com canteiros, banquinhos, balanço, lanternas e luzinhas (aba Criar).</p>
      <div class="list">${Object.entries(OBRAS).map(([k, o]) => {
        const st = j[k] ? (pronto(k) ? '<small>Pronto!</small>' : '<small>A Rosa constrói esta noite</small>') : '';
        const can = gold() >= o.gold && Object.entries(o.need).every(([i, n]) => count(i) >= n);
        return `<div class="item"><span class="nm"><b>${o.name}</b><small>${o.desc} · ${fmt(o.gold)} ₲ + ${needTxtC(o.need)}</small></span>${st || `<button class="btn g" data-a="jardimObra" data-k="${k}" type="button" ${can ? '' : 'disabled'}>Encomendar</button>`}</div>`;
      }).join('')}</div>
      <p style="font-size:13px;text-align:center">Canteiro: segure uma flor colhida (narciso, dente-de-leão, açafrão ou flores da horta) e toque nele para plantar.</p>`;
  }
  function jardimObra(k) {
    const o = OBRAS[k]; if (!o || jard()[k]) return;
    if (!livreObra(k)) { toast('Libere o espaço marcado no jardim antes (tire plantas, objetos ou terra arada).', '', null, 'jardim'); return; }
    if (!(gold() >= o.gold && Object.entries(o.need).every(([i, n]) => count(i) >= n)) || !spend(o.gold)) return;
    for (const [i, n] of Object.entries(o.need)) removeItem(i, n);
    setFarmVal('jardim', { ...jard(), [k]: W.meta.day }); sfx.coin();
    toast(`Encomendado! A Rosa vem construir ${o.name.toLowerCase()} hoje à noite.`, 'big', null, 'jardim');
    openPanel(jardimHTML(), 'jardim');
  }
  function jardimSpot(sp) { if (sp.kind !== 'jardim') return false; openPanel(jardimHTML(), 'jardim'); return true; }

  // ---------- os dois juntos ----------
  const parceiroPerto = (r = 40) => peerPlayers().find(p => !p.me && p.map === P.map && Math.hypot(p.x - P.x, p.y - P.y) < r);
  const parceiroNoGazebo = () => peerPlayers().find(p => !p.me && p.map === 'farm' && inGazebo(Math.floor(p.x / T), Math.floor((p.y - 3) / T)));
  const jflag = k => (P.flags.jd || {})[k] === W.meta.day;
  const setJflag = k => { P.flags.jd = { ...(P.flags.jd || {}), [k]: W.meta.day }; dirty(); };
  function gazeboHTML() {
    const pt = parceiroNoGazebo(), noite = nowMin() >= 1200, s = held(), comida = s && item(s.id).energy && item(s.id).cat === 'food';
    const btn = (a, txt, ok, why) => `<div class="item"><span class="nm"><b>${txt}</b><small>${why}</small></span><button class="btn g" data-a="${a}" type="button" ${ok ? '' : 'disabled'}>${txt.split(' ')[0]}</button></div>`;
    return `<h2>Gazebo</h2><p style="text-align:center">${pt ? `Você e ${esc(pt.name)} estão no gazebo.` : 'Chame a outra pessoa para vir aqui: a dois tudo fica melhor.'}</p><div class="list">
      ${btn('gzSentar', pt ? 'Sentar juntinhos' : 'Sentar e olhar o lago', !jflag('sentar'), jflag('sentar') ? 'Já fizeram isso hoje.' : pt ? '+40 de energia para os dois.' : '+15 de energia.')}
      ${btn('gzDancar', 'Dançar juntinhos', !!pt && !jflag('dancar'), !pt ? 'Precisa dos dois aqui.' : jflag('dancar') ? 'Já dançaram hoje.' : 'Sorte +1 para os dois pelo resto do dia.')}
      ${btn('gzPique', 'Piquenique a dois', !!pt && !!comida && !jflag('pique'), !pt ? 'Precisa dos dois aqui.' : !comida ? 'Segure uma comida na barra (a cesta de café da manhã é perfeita).' : jflag('pique') ? 'Já fizeram piquenique hoje.' : `Dividir ${esc(item(s.id).name)}: os dois ganham a energia e o bônus.`)}
      ${noite ? btn('gzEstrelas', 'Ver as estrelas', !jflag('estrelas'), jflag('estrelas') ? 'Já viram hoje.' : pt ? 'Quem sabe passa uma estrela cadente...' : 'Mais bonito a dois, mas vale sozinho também.') : ''}
    </div>`;
  }
  function gzEfeito(k, pt, extra = {}) {
    setJflag(k); loveFx = pt ? 3 : 0; sfx.level();
    if (pt) { emitP2P({ type: 'jardim', to: pt.uid, k, ...extra }); P.stats.jardim = (P.stats.jardim || 0) + 1; if (k === 'dancar') P.stats.danca = 1; }
  }
  function gazeboAction(a) {
    const pt = parceiroNoGazebo();
    if (a === 'gzSentar' && !jflag('sentar')) { const g = pt ? 40 : 15; P.energy = Math.min(P.maxEnergy, P.energy + g); gzEfeito('sentar', pt, { g }); toast(pt ? `Vocês sentam juntinhos olhando o lago. +${g} de energia.` : `Você senta e olha o lago. +${g} de energia.`, 'big', null, 'gazebo'); }
    else if (a === 'gzDancar' && pt && !jflag('dancar')) { P.buff = { b: { luck: 1 }, until: 26 * 60, day: W.meta.day, name: 'Dança no gazebo' }; gzEfeito('dancar', pt); for (const [f, d] of [[523, 0], [659, 0.18], [784, 0.36], [1046, 0.54]]) tone(f, f, 0.16, 'triangle', 0.06, d); toast(`Você e ${pt.name} dançam no gazebo. Sorte +1 hoje!`, 'big', null, 'gazebo'); }
    else if (a === 'gzPique' && pt && !jflag('pique')) {
      const s = held(); if (!s || !item(s.id).energy || item(s.id).cat !== 'food') return true;
      const it = item(s.id), en = Math.round(it.energy * Q_ENERGY[s.q || 0]); useHeld(1);
      P.energy = Math.min(P.maxEnergy, P.energy + en); if (it.buff) P.buff = { b: it.buff, until: nowMin() + 7 * 60, day: W.meta.day, name: it.name };
      gzEfeito('pique', pt, { en, id: s.id }); toast(`Piquenique a dois com ${it.name}! +${en} de energia para cada um.`, 'big', null, 'gazebo');
    }
    else if (a === 'gzEstrelas' && !jflag('estrelas')) {
      gzEfeito('estrelas', pt); estrelaCadente = 2.5;
      if (pt && Math.random() < 0.25) { addItem('quartzo', 1, true); toast('Uma estrela cadente! Vocês fizeram um pedido... e acharam um quartzo brilhando na grama.', 'big', null, 'gazebo'); }
      else toast(pt ? 'Vocês deitam no gazebo e contam estrelas juntinhos.' : 'Você conta estrelas no gazebo.', 'big', null, 'gazebo');
    }
    else return false;
    openPanel(gazeboHTML(), 'gazebo'); return true;
  }
  // o que chega da outra pessoa
  function jardimP2P(d) {
    if (d.k === 'sentar') { P.energy = Math.min(P.maxEnergy, P.energy + (d.g || 40)); setJflag('sentar'); toast(`${d.from} sentou juntinho com você no gazebo. +${d.g || 40} de energia.`, 'big', null, 'gazebo'); }
    if (d.k === 'dancar') { P.buff = { b: { luck: 1 }, until: 26 * 60, day: W.meta.day, name: 'Dança no gazebo' }; setJflag('dancar'); P.stats.danca = 1; toast(`${d.from} te tirou para dançar no gazebo! Sorte +1 hoje.`, 'big', null, 'gazebo'); }
    if (d.k === 'pique') { const it = item(d.id); P.energy = Math.min(P.maxEnergy, P.energy + (d.en || 0)); if (it.buff) P.buff = { b: it.buff, until: nowMin() + 7 * 60, day: W.meta.day, name: it.name }; setJflag('pique'); toast(`${d.from} dividiu ${it.name} com você no piquenique! +${d.en} de energia.`, 'big', null, 'gazebo'); }
    if (d.k === 'estrelas') { setJflag('estrelas'); estrelaCadente = 2.5; toast(`${d.from} te chamou para ver as estrelas.`, 'big', null, 'gazebo'); }
    if (d.k === 'banco') toast(`${d.from} sentou pertinho de você.`, '', null, 'banco');
    if (d.k === 'balanco') toast(`${d.from} balançou junto com você!`, '', null, 'balanco');
    loveFx = 3; dirty();
  }
  let estrelaCadente = 0;

  // ---------- tocar nas coisas do jardim ----------
  function jardimAct(m, tx, ty) {
    if (m.id !== 'farm') return false;
    const s = held(), isTool = s && item(s.id).cat === 'tool';
    const [px, py] = ptile();
    if (pronto('gazebo') && (inGazebo(px, py) || inGazebo(tx, ty))) {
      if (isTool) { toast('Esse cantinho é do gazebo. Guarde a ferramenta para aproveitar!', '', null, 'gazebo'); return true; }
      openPanel(gazeboHTML(), 'gazebo'); return true;
    }
    if (pronto('fogo') && tx === JARDIM.fogo[0] && ty === JARDIM.fogo[1] && !isTool) { useFire(tx * T + 8, ty * T + 8); return true; }
    const k = tx + ',' + ty, tl = tile(k), o = tl && tl.o; if (!o) return false;
    if (o.k === 'canteiro') {
      if (isTool) return false;
      if (!o.fl) {
        if (!s || !FLOR_COR[s.id]) { toast('Segure uma flor (narciso, dente-de-leão, açafrão ou flores da horta) para plantar no canteiro.', '', null, 'canteiro'); return true; }
        useHeld(1); setTile(k, { ...tl, o: { ...o, fl: s.id, d: W.meta.day } }); sfx.hoe(); toast(`Você plantou ${item(s.id).name.toLowerCase()} no canteiro.`, '', null, 'canteiro'); return true;
      }
      if (canteiroFlorido(o)) { if (addItem(o.fl, 1)) { setTile(k, { ...tl, o: { ...o, pick: W.meta.day } }); gainXP('foraging', 3); sfx.pop(); } return true; }
      toast(`${item(o.fl).name}: ${season() === 'winter' && !FLOR_INVERNO.has(o.fl) ? 'descansando no inverno.' : 'dá flor de novo em breve.'}`, '', null, 'canteiro'); return true;
    }
    if (o.k === 'banquinho' && !isTool) {
      const pt = parceiroPerto(48);
      if (jflag('banco')) { toast(pt ? `Vocês ficam um tempinho sentados juntos.` : 'Você já descansou no banquinho hoje.', '', null, 'banco'); if (pt) loveFx = 2; return true; }
      setJflag('banco'); const g = pt ? 20 : 10; P.energy = Math.min(P.maxEnergy, P.energy + g); if (pt) { loveFx = 3; emitP2P({ type: 'jardim', to: pt.uid, k: 'banco' }); }
      sfx.pop(); toast(pt ? `Você senta pertinho de ${pt.name}. +${g} de energia.` : `Você senta no banquinho. +${g} de energia.`, '', null, 'banco'); return true;
    }
    if (o.k === 'balanco' && !isTool) {
      const pt = parceiroPerto(48); balancoT = 3;
      if (!jflag('balanco')) { setJflag('balanco'); P.energy = Math.min(P.maxEnergy, P.energy + (pt ? 25 : 10)); }
      if (pt) { loveFx = 3; emitP2P({ type: 'jardim', to: pt.uid, k: 'balanco' }); }
      sfx.pop(); toast(pt ? `Vocês balançam juntinhos!` : 'Você balança devagarinho.', '', null, 'balanco'); return true;
    }
    return false;
  }
  let balancoT = 0;
  const canteiroFlorido = o => o.fl && W.meta.day > o.d && (W.meta.day - o.d) % 3 === 0 && o.pick !== W.meta.day && (season() !== 'winter' || FLOR_INVERNO.has(o.fl));

  // ---------- desenho ----------
  function drawGazebo(w, h, night, snow) {
    const c = '#f8f4ec', d = '#d8ccb8', vinha = '#3a8a3a';
    R(2, h - 30, w - 4, 26, '#c8a878'); for (let x = 4; x < w - 4; x += 6) R(x, h - 30, 1, 26, '#b8946a');
    R(0, h - 6, w, 6, '#e8e0d0');
    for (const x of [2, w - 6]) { R(x, 4, 4, h - 8, c); R(x + 3, 4, 1, h - 8, d); for (let y = 10; y < h - 8; y += 7) { disc(x + 1, y, 2, vinha); disc(x + 4, y + 3, 1.6, '#5ab84a'); } }
    poly([[-8, 8], [w / 2, -30], [w + 8, 8]], snow ? '#e8eef4' : '#f4f0e8'); poly([[-8, 8], [w / 2, -26], [w + 8, 8], [w + 8, 12], [-8, 12]], snow ? '#ffffff' : '#e8e0d0');
    for (let k = 0; k < 9; k++) disc(-6 + k * ((w + 12) / 8), 12, 3, snow ? '#ffffff' : '#e8e0d0');
    for (let k = 0; k < 8; k++) disc(-2 + k * ((w + 4) / 7), 9, 2, vinha);
    R(w / 2 - 1, -34, 2, 6, '#c8a050'); disc(w / 2, -35, 2.5, '#f4c83a');
    // coração de flores no topo
    R(w / 2 - 6, -18, 4, 4, '#ff6aa8'); R(w / 2 + 2, -18, 4, 4, '#ff6aa8'); R(w / 2 - 6, -15, 12, 4, '#ff6aa8'); R(w / 2 - 4, -11, 8, 2, '#ff6aa8'); R(w / 2 - 2, -9, 4, 2, '#ff6aa8');
    // luzinhas
    for (let k = 0; k < 10; k++) disc(2 + k * ((w - 4) / 9), 15 + Math.sin(k * 0.9) * 2, 1.6, night ? ['#ffe08a', '#ff8ac8', '#8ad8ff', '#a8ff8a'][k % 4] : '#d8ccb8');
    // banco com almofadas no fundo
    R(10, h - 34, w - 20, 6, '#a8743a'); R(10, h - 36, w - 20, 3, '#c8945a'); for (let k = 0; k < 3; k++) R(14 + k * ((w - 30) / 2), h - 37, 8, 4, ['#e86a8a', '#f4c83a', '#5ab8e8'][k]);
  }
  const FOGO_SEATS = [[-22, 4], [20, 4], [-2, 18]];
  function drawObj7(o, px, py) {
    const t = performance.now() / 1000, night = nightF() > 0.25;
    switch (o.k) {
      case 'canteiro': {
        shadowAt(px + 8, py + 14, 7, 2); R(px + 1, py + 6, 14, 9, '#8a5a32'); R(px + 1, py + 6, 14, 2, '#a8743a'); R(px + 3, py + 8, 10, 4, '#5a3a1e');
        if (o.fl) { const cor = FLOR_COR[o.fl] || '#ff6aa8', dorme = season() === 'winter' && !FLOR_INVERNO.has(o.fl); for (const [dx, dy] of [[4, 3], [8, 1], [12, 3], [6, 5], [10, 5]]) { R(px + dx, py + dy + 2, 1, 5, '#3a8a2a'); if (!dorme) { disc(px + dx, py + dy + 1, 1.8, cor); R(px + dx, py + dy + 1, 1, 1, '#ffe080'); } } if (canteiroFlorido(o)) { const b = Math.round(Math.sin(t * 4) * 1.5); R(px + 7, py - 8 + b, 2, 4, '#ffffff'); R(px + 7, py - 3 + b, 2, 1, '#ffffff'); } }
        return true;
      }
      case 'banquinho': shadowAt(px + 8, py + 14, 7, 2); R(px + 1, py + 6, 14, 4, '#c8945a'); R(px + 1, py + 6, 14, 1, '#e0b07a'); R(px + 2, py + 10, 2, 5, '#8a5a32'); R(px + 12, py + 10, 2, 5, '#8a5a32'); return true;
      case 'lanternajardim': shadowAt(px + 8, py + 14, 4, 1.5); R(px + 7, py, 2, 14, '#3a3a40'); R(px + 4, py + 13, 8, 2, '#3a3a40'); R(px + 4, py - 6, 8, 8, '#2a2a30'); R(px + 5, py - 5, 6, 6, night ? '#ffd87a' : '#c8b88a'); R(px + 3, py - 7, 10, 2, '#3a3a40'); return true;
      case 'varalluzes': { R(px + 1, py - 14, 2, 28, '#7a4a24'); R(px + 29, py - 14, 2, 28, '#7a4a24'); ctx.strokeStyle = '#3a3a3a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px + 2, py - 13); ctx.quadraticCurveTo(px + 16, py - 5, px + 30, py - 13); ctx.stroke(); for (let k = 1; k < 8; k++) { const u = k / 8, x = px + 2 + u * 28, y = py - 13 + Math.sin(u * Math.PI) * 4; disc(x, y + 1, 1.7, night ? ['#ffe08a', '#ff8ac8', '#8ad8ff', '#a8ff8a'][k % 4] : '#d8d0c0'); } return true; }
      case 'balanco': {
        const sw = balancoT > 0 ? Math.sin(t * 5) * 3 : Math.sin(t * 1.2) * 0.6;
        shadowAt(px + 8, py + 14, 10, 2); R(px - 6, py - 22, 3, 36, '#6a4224'); R(px + 19, py - 22, 3, 36, '#6a4224'); R(px - 6, py - 24, 28, 4, '#7a4a2a');
        R(px - 1 + sw, py - 20, 1, 22, '#c8b890'); R(px + 16 + sw, py - 20, 1, 22, '#c8b890'); R(px - 3 + sw, py + 1, 22, 4, '#a8743a'); R(px - 3 + sw, py + 1, 22, 1, '#c8945a');
        for (let k = 0; k < 4; k++) disc(px - 4 + k * 8, py - 22, 1.8, ['#ff6aa8', '#ffffff', '#f4c83a', '#ff6aa8'][k]);
        return true;
      }
    }
    return false;
  }
  function jardimEnts(m, ents, t) {
    if (m.id !== 'farm') return;
    const [sx, sy] = JARDIM.placa;
    ents.push({ y: sy * T + 15, f: () => { const x = sx * T + 8, y = sy * T; R(x - 1, y + 2, 2, 13, '#5a3820'); R(x - 20, y - 6, 40, 11, '#8a5a32'); R(x - 19, y - 5, 38, 9, '#a8703a'); drawText('Nosso Jardim', x, y - 1, '#3a1e0a', 7); disc(x + 16, y - 6, 2, '#ff6aa8'); } });
    // bordinha de flores marcando o jardim
    ents.push({ y: -900, f: () => { for (let x = JARDIM.x0; x <= JARDIM.x1; x += 2) for (const y of [JARDIM.y0 + 0.1]) { disc(x * T + 6, y * T, 1.6, ['#ff6aa8', '#f4c83a', '#ffffff', '#c86ad8'][x % 4]); R(x * T + 6, y * T + 1, 1, 3, '#3a8a2a'); } } });
    const g = JARDIM.gz;
    if (jard().gazebo) {
      if (pronto('gazebo')) ents.push({ y: (g.y + g.h - 1) * T + 15, f: () => blit(building2Canvas('gazebo', g.w * T, g.h * T, nightF() > 0.25), g.x * T - 8, g.y * T - 36) });
      else ents.push({ y: (g.y + g.h - 1) * T + 15, f: () => { for (let k = 0; k < 4; k++) R(g.x * T + 6 + k * 18, (g.y + g.h) * T - 12, 14, 8, '#c8945a'); placa('Em obra: pronto amanhã', (g.x + g.w / 2) * T, (g.y + 1) * T); } });
    }
    if (jard().fogo) {
      const [fx, fy] = JARDIM.fogo;
      if (pronto('fogo')) ents.push({ y: fy * T + 14, f: () => { const cx = fx * T + 8, cy = fy * T + 8; for (let k = 0; k < 10; k++) { const a = k / 10 * TAU; oval(cx + Math.cos(a) * 9, cy + 4 + Math.sin(a) * 5, 3, 2.4, k % 2 ? '#8a8a8a' : '#a8a098'); } drawFire(cx, cy, t); for (const [dx, dy] of FOGO_SEATS) { R(cx + dx - 7, cy + dy, 14, 5, '#7a4a28'); R(cx + dx - 7, cy + dy, 14, 1, '#a8783a'); oval(cx + dx - 7, cy + dy + 2.5, 1.5, 2.5, '#c8945a'); } } });
      else ents.push({ y: fy * T + 14, f: () => placa('Em obra', fx * T + 8, fy * T) });
    }
    // estrela cadente
    if (estrelaCadente > 0) ents.push({ y: 1e9, f: () => { const k = 1 - estrelaCadente / 2.5, x = camX + VW * (0.2 + k * 0.6), y = camY + 20 + k * 30; ctx.strokeStyle = 'rgba(255,255,220,0.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 30, y - 12); ctx.stroke(); disc(x, y, 2.5, '#ffffff'); } });
  }
  function jardimLights(m, light, nf) {
    if (m.id !== 'farm' || nf <= 0) return;
    const g = JARDIM.gz;
    if (pronto('gazebo')) light((g.x + g.w / 2) * T, (g.y + 1) * T, 70, nf * 0.55, '255,210,150');
    if (pronto('fogo')) light(JARDIM.fogo[0] * T + 8, JARDIM.fogo[1] * T + 6, 60, nf * 0.7);
    for (const [k, v] of Object.entries(W.farm.t || {})) if (v && v.o && (v.o.k === 'lanternajardim' || v.o.k === 'varalluzes')) { const [x, y] = k.split(',').map(Number); light(x * T + (v.o.k === 'varalluzes' ? 16 : 8), y * T - 6, v.o.k === 'varalluzes' ? 44 : 36, nf * 0.55, v.o.k === 'varalluzes' ? '255,190,220' : '255,210,140'); }
  }
  function updateJardim(dt) { jardimInit(); estrelaCadente = Math.max(0, estrelaCadente - dt); balancoT = Math.max(0, balancoT - dt); }
  // ícones
  function paintIcon10(id) {
    if (!['canteiro', 'banquinho', 'balanco', 'lanternajardim', 'varalluzes'].includes(id)) return false;
    ctx.save();
    if (id === 'balanco') { ctx.translate(3, 7); ctx.scale(0.45, 0.45); }
    else if (id === 'varalluzes') { ctx.translate(0, 8); ctx.scale(0.5, 0.5); }
    else if (id === 'lanternajardim') { ctx.translate(2, 4); ctx.scale(0.75, 0.75); }
    drawObj7({ k: id, fl: id === 'canteiro' ? 'tulipa' : null, d: 0 }, id === 'balanco' ? 8 : 0, id === 'balanco' ? 10 : 0);
    ctx.restore(); return true;
  }
  function jardimAction(a, b) {
    if (a === 'jardimObra') { jardimObra(b.dataset.k); return true; }
    if (['gzSentar', 'gzDancar', 'gzPique', 'gzEstrelas'].includes(a)) return gazeboAction(a);
    return false;
  }
  ACH.push(['gazebo', 'Nosso cantinho', 'Construir o gazebo no jardim à beira do lago.', () => !!(W.farm && W.farm.jardim && W.farm.jardim.gazebo && W.meta.day > W.farm.jardim.gazebo)],
    ['dancajardim', 'Dança no jardim', 'Dançar juntinhos no gazebo.', () => [P, ...Object.values(W.players || {})].some(p => p && p.stats && p.stats.danca)]);
