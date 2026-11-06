  // ================= borboletas e libélulas (rede) e capas de chuva =================

  // ---------- os insetos ----------
  // k: 'b' borboleta, 'm' mariposa, 'l' libélula · de/até em minutos do dia · agua: aparece perto da água · chuva: só na chuva
  const BUGS = {
    borbbranca: { name: 'Borboleta-branca', k: 'b', col: '#f4f4ec', col2: '#3a3a3a', seasons: ['spring', 'summer'], maps: ['farm', 'town'], de: 360, ate: 1080, diff: 12, sell: 35 },
    borbamarela: { name: 'Borboleta-amarela', k: 'b', col: '#f4d43a', col2: '#b8860a', seasons: ['spring', 'summer', 'fall'], maps: ['farm', 'town'], de: 420, ate: 1080, diff: 22, sell: 50 },
    monarca: { name: 'Borboleta-monarca', k: 'b', col: '#f08a1a', col2: '#1a1a1a', seasons: ['summer', 'fall'], maps: ['farm', 'town', 'beach'], de: 480, ate: 1020, diff: 36, sell: 95 },
    morpho: { name: 'Borboleta-azul', k: 'b', col: '#3a8af0', col2: '#14244a', seasons: ['summer'], maps: ['town', 'beach'], de: 360, ate: 660, diff: 60, sell: 240 },
    mariposa: { name: 'Mariposa-lua', k: 'm', col: '#bfe8a8', col2: '#6aa04a', seasons: ['spring', 'summer', 'fall'], maps: ['farm', 'town', 'mata'], de: 1140, ate: 1560, diff: 50, sell: 170 },
    libvermelha: { name: 'Libélula-vermelha', k: 'l', col: '#e8402a', col2: '#8a1a10', seasons: ['summer', 'fall'], maps: ['farm', 'town'], de: 480, ate: 1140, agua: true, diff: 38, sell: 110 },
    libazul: { name: 'Libélula-azul', k: 'l', col: '#3ab0e8', col2: '#145a8a', seasons: ['spring', 'summer'], maps: ['farm', 'town', 'beach'], de: 420, ate: 1080, agua: true, diff: 45, sell: 130 },
    libesmeralda: { name: 'Libélula-esmeralda', k: 'l', col: '#3ad87a', col2: '#0a6a3a', seasons: ['spring', 'summer', 'fall'], maps: ['farm', 'town', 'mata'], de: 360, ate: 1260, agua: true, chuva: true, diff: 70, sell: 280 },
    // só na floresta
    borbcoruja: { name: 'Borboleta-coruja', k: 'b', col: '#a8845a', col2: '#2a1a10', seasons: ['spring', 'summer', 'fall'], maps: ['mata'], de: 1020, ate: 1260, diff: 48, sell: 150 },
    borbfolha: { name: 'Borboleta-folha', k: 'b', col: '#c8762a', col2: '#6a3a14', seasons: ['fall'], maps: ['mata'], de: 420, ate: 1080, diff: 55, sell: 190 },
    besouro: { name: 'Besouro-rinoceronte', k: 'be', col: '#3a2a1a', col2: '#6a4a2a', seasons: ['summer'], maps: ['mata'], de: 960, ate: 1440, diff: 58, sell: 210 },
    vagalume: { name: 'Vaga-lume', k: 'v', col: '#e8f05a', col2: '#3a3a1a', seasons: ['spring', 'summer'], maps: ['mata'], de: 1140, ate: 1560, diff: 30, sell: 90 },
  };
  const BUG_WHERE = { farm: 'chacrinha', town: 'vila', beach: 'praia', mata: 'floresta' };
  for (const [k, b] of Object.entries(BUGS)) {
    const quando = b.de >= 1080 ? 'à noite' : b.ate <= 720 ? 'de manhã' : 'de dia';
    const est = b.seasons.map(s => SEASONS[SEASON_ID.indexOf(s)].toLowerCase()).join(', ');
    ITEMS[k] = { name: b.name, cat: 'inseto', sell: b.sell, desc: `${b.chuva ? 'Só na chuva, ' : ''}${quando}, ${b.agua ? 'perto da água, ' : ''}${b.maps.map(m => BUG_WHERE[m]).join(' e ')} · ${est}.`.replace(/^./, c => c.toUpperCase()) };
  }
  ITEMS.rede = { name: 'Rede de borboleta', cat: 'tool', desc: 'Chegue pertinho de uma borboleta ou libélula e use a rede.' };
  ITEMS.capadarth = { name: 'Capinha de chuva do Darth', cat: 'acessorio', sell: 500, desc: 'Segure e toque no Darth para ele usar (ou tirar). Ele só veste quando chove.' };
  ROUPAS.capachuva = { name: 'Capa de chuva', slot: 'cp', price: 4500, desc: 'Na chuva, tudo gasta 10% menos energia. E você fica sequinho.' };
  ITEMS.capachuva = { name: 'Capa de chuva', cat: 'roupa', slot: 'cp', sell: 1125, desc: ROUPAS.capachuva.desc };
  CLOTHES_SHOP.push({ id: 'capachuva', price: 4500, one: true }, { id: 'capadarth', price: 2500, one: true });

  const chovendo = () => !!(W.meta && W.meta.rain && !W.meta.snow);
  const aoArLivre = () => { const m = curMap(); return m && m.outdoor; };
  // a pessoa aparece de capa amarela quando está com ela e chove lá fora
  const comCapa = () => eqHas('capachuva') && chovendo() && aoArLivre();
  // o Darth usa a capinha quando chove e ele está lá fora
  const darthDeCapa = map => !!(P && P.pet && P.pet.capa && chovendo() && getMap(map) && getMap(map).outdoor);
  function vestirDarth() {
    const s = held(); if (!s || s.id !== 'capadarth' || !P.pet) return false;
    P.pet.capa = !P.pet.capa; dirty(); meow(); catReact(petSt);
    toast(P.pet.capa ? (chovendo() ? 'Darth está de capinha de chuva! Fica uma graça.' : 'Pronto! Quando chover, o Darth vai de capinha.') : 'Você tirou a capinha do Darth.', 'big', null, 'darth');
    return true;
  }

  // ---------- insetos voando pelo mapa (cada pessoa vê os seus) ----------
  let bugs = [], bugMap = null, bugSpawnT = 0, bugHint = false;
  function bugPool(m) {
    const s = season(), min = nowMin(), rain = chovendo();
    return Object.entries(BUGS).filter(([, b]) => b.maps.includes(m.mata ? 'mata' : m.id) && b.seasons.includes(s) && min >= b.de && min <= b.ate && (b.chuva ? rain : !rain || b.k === 'l' && Math.random() < 0.15));
  }
  function bugSpot(m, b) {
    const px = Math.floor(P.x / T), py = Math.floor(P.y / T);
    for (let tries = 0; tries < 30; tries++) {
      const x = px + Math.floor(rnd(-7, 8)), y = py + Math.floor(rnd(-4, 5));
      if (x < 1 || y < 1 || x >= m.w - 1 || y >= m.h - 1 || Math.hypot(x - px, y - py) < 3) continue;
      if (m.at(x, y) === G.WATER) continue;
      if (b.agua) { let w = false; for (let dy = -2; dy <= 2 && !w; dy++) for (let dx = -2; dx <= 2; dx++) if (m.at(x + dx, y + dy) === G.WATER) { w = true; break; } if (!w) continue; }
      return [x * T + 8, y * T + 8];
    }
    return null;
  }
  function updateBugs(dt) {
    const m = curMap();
    if (!m || bugMap !== m.id) { bugs = []; bugMap = m && m.id; bugSpawnT = 1.5; }
    if (!m || !m.outdoor || m.cave) return;
    const t = performance.now() / 1000;
    for (const b of bugs) {
      b.life -= dt;
      const d = BUGS[b.id];
      // borboleta: zigue-zague mole; libélula: para no ar e dá arrancadas
      if (d.k === 'l') {
        b.wait -= dt;
        if (b.wait <= 0) { b.tx = b.hx + rnd(-26, 26); b.ty = b.hy + rnd(-18, 18); b.wait = rnd(0.8, 2.2); }
        b.x += (b.tx - b.x) * Math.min(1, dt * 5); b.y += (b.ty - b.y) * Math.min(1, dt * 5);
      } else {
        b.a += rnd(-2.5, 2.5) * dt; const sp = 16;
        b.x += Math.cos(b.a) * sp * dt; b.y += Math.sin(b.a) * sp * 0.7 * dt;
        if (Math.hypot(b.x - b.hx, b.y - b.hy) > 40) b.a = Math.atan2(b.hy - b.y, b.hx - b.x);
      }
      // foge um pouco se alguém chega correndo sem a rede
      const pd = Math.hypot(P.x - b.x, P.y - 12 - b.y), s = held();
      if (pd < 18 && walkT > 0 && !(s && s.id === 'rede')) { b.hx += (b.x - P.x) * 0.05; b.hy += (b.y - P.y) * 0.05; }
      b.h = 10 + Math.sin(t * 2 + b.ph) * 3;
    }
    bugs = bugs.filter(b => b.life > 0);
    bugSpawnT -= dt;
    if (bugSpawnT <= 0) {
      bugSpawnT = rnd(5, 9);
      const max = season() === 'summer' ? 4 : 3;
      const pool = bugPool(m);
      if (pool.length && bugs.length < max) {
        // os mais difíceis aparecem menos
        const w = pool.map(([k, b]) => [k, 100 - b.diff]), tot = w.reduce((a, x) => a + x[1], 0);
        let r = Math.random() * tot, id = pool[0][0];
        for (const [k, v] of w) { r -= v; if (r <= 0) { id = k; break; } }
        const sp = bugSpot(m, BUGS[id]);
        if (sp) bugs.push({ id, x: sp[0], y: sp[1], hx: sp[0], hy: sp[1], tx: sp[0], ty: sp[1], a: rnd(0, TAU), ph: rnd(0, TAU), wait: 0, h: 10, life: rnd(50, 90) });
      }
    }
  }
  function drawBug(b, t) {
    const d = BUGS[b.id], x = Math.round(b.x), y = Math.round(b.y - b.h);
    shadowAt(b.x, b.y, 2, 0.8);
    if (d.k === 'v') { const on = Math.sin(t * 3 + b.ph) > -0.2; if (on) { ctx.globalAlpha = 0.35; disc(x, y + 1, 3, '#f4ff8a'); ctx.globalAlpha = 1; } R(x, y - 1, 1, 2, '#3a3a1a'); R(x, y + 1, 1, 1, on ? '#f4ff6a' : '#6a6a3a'); return; }
    if (d.k === 'be') { const f = Math.floor(t * 24 + b.ph) % 2; ctx.globalAlpha = 0.6; R(x - 4, y - 2 - f, 3, 2, '#e8f0ff'); R(x + 2, y - 2 - f, 3, 2, '#e8f0ff'); ctx.globalAlpha = 1; oval(x + 0.5, y + 1, 2.5, 3, d.col); R(x - 1, y - 1, 1, 3, d.col2); R(x, y - 4, 1, 3, '#2a1a10'); R(x - 1, y - 5, 1, 1, '#2a1a10'); return; }
    if (d.k === 'l') {
      const f = Math.floor(t * 30 + b.ph) % 2, wc = f ? '#ffffffdd' : '#ffffff88';
      R(x - 5, y - 2, 5, 1, wc); R(x + 1, y - 2, 5, 1, wc); R(x - 4, y, 4, 1, wc); R(x + 1, y, 4, 1, wc);
      R(x, y - 4, 1, 9, d.col); R(x - 1, y - 4, 3, 2, d.col2); R(x, y + 3, 1, 2, d.col2);
    } else {
      const open = Math.sin(t * (d.k === 'm' ? 14 : 18) + b.ph) > 0;
      if (open) { R(x - 4, y - 3, 4, 4, d.col); R(x + 1, y - 3, 4, 4, d.col); R(x - 3, y + 1, 3, 3, d.col2); R(x + 1, y + 1, 3, 3, d.col2); R(x - 4, y - 3, 1, 1, d.col2); R(x + 4, y - 3, 1, 1, d.col2); }
      else { R(x - 2, y - 3, 2, 5, d.col); R(x + 1, y - 3, 2, 5, d.col); }
      R(x, y - 3, 1, 6, '#2a1a12'); R(x - 1, y - 5, 1, 2, '#2a1a12'); R(x + 1, y - 5, 1, 2, '#2a1a12');
      if (d.k === 'm' && nightF() > 0.3) { ctx.globalAlpha = 0.25; disc(x, y, 4, '#dfffcf'); ctx.globalAlpha = 1; }
    }
  }
  function bugEnts(m, ents) {
    if (m.id !== bugMap) return;
    const t = performance.now() / 1000;
    for (const b of bugs) ents.push({ y: b.y + 2, f: () => drawBug(b, t) });
  }
  function bugLights(m, light) { const t = performance.now() / 1000; if (m.id === bugMap) for (const b of bugs) { const k = BUGS[b.id].k; if (k === 'm') light(b.x, b.y - b.h, 10, 0.25); if (k === 'v' && Math.sin(t * 3 + b.ph) > -0.2) light(b.x, b.y - b.h, 14, 0.5, '230,255,120'); } }

  // ---------- usar a rede ----------
  function swingNet() {
    if (!useEnergy(2)) return;
    swing('rede', 0, 0.32);
    const d = DIRS[P.dir], fx = P.x + d[0] * 14, fy = P.y - 10 + d[1] * 12;
    let best = null, bd = 20;
    for (const b of bugs) { const dist = Math.hypot(b.x - fx, b.y - b.h - fy); if (dist < bd) { bd = dist; best = b; } }
    if (!best) {
      sfx.no();
      if (!bugHint) { bugHint = true; toast(bugs.length ? 'Chegue mais pertinho e vire para ela.' : 'Nenhum bichinho por perto. Procure perto das flores e da água.', '', null, 'rede'); }
      return;
    }
    bugs = bugs.filter(b => b !== best);
    const bd2 = BUGS[best.id], lv = skillLv(P.skills.foraging);
    fishing = { phase: 'game', bug: true, id: best.id, diff: bd2.diff, barH: 30 + lv * 2.5 + buffLv('foraging') * 4, bv: 0, fy: 80, fv: 0, target: 60, prog: 0.3, hold: false, tt: 0, chestAt: -1 };
    fishing.bar = 120 - fishing.barH - 2;
    document.getElementById('fish').hidden = false;
    sfx.cast();
  }
  function bugCaught(f) {
    const fq = !f.miss ? 2 : Math.random() < skillLv(P.skills.foraging) * 0.06 ? 1 : 0;
    if (!addItem(f.id, 1, true, fq)) return;
    const st = P.stats, nova = !(st.bugs && st.bugs[f.id]);
    st.bugs = { ...(st.bugs || {}), [f.id]: 1 }; st.bugN = (st.bugN || 0) + 1;
    gainXP('foraging', Math.round(3 + f.diff / 4) + (fq === 2 ? 4 : 0)); sfx.catch(); dirty();
    toast(`${!f.miss ? 'Na mosca! ' : ''}Você pegou: ${BUGS[f.id].name}${fq ? ' (' + Q_NAME[fq] + ')' : ''}!`, 'big', f.id);
    if (nova) { const n = Object.keys(st.bugs).length; setTimeout(() => toast(`Espécie nova na coleção! ${n} de ${Object.keys(BUGS).length}`, '', null, 'colecao'), 700); }
  }
  // conquista do casal
  ACH.push(['insetos', 'Colecionadores de asas', `Pegar os ${Object.keys(BUGS).length} insetos: borboletas, libélulas, besouro e vaga-lume.`, () => { const got = new Set(); for (const p of [P, ...Object.values(W.players || {})]) for (const k of Object.keys(((p || {}).stats || {}).bugs || {})) got.add(k); return Object.keys(BUGS).every(k => got.has(k)); }]);

  // ---------- desenhos: capa de chuva na pessoa e no Darth ----------
  function drawRaincoat(look, dir, step, noHood) {
    const Y = '#f4c020', D = '#c8901a', L = '#ffe070', side = dir === 2 || dir === 3, hx = side ? 3 : 2;
    // corpo e mangas
    R(2, 14, 12, 10, Y); R(2, 14, 12, 1, L); R(12, 15, 2, 9, D); R(2, 23, 12, 1, D);
    if (!side) {
      R(0, 15 + step, 3, 7, Y); R(0, 15 + step, 1, 7, L); R(13, 15 - step, 3, 7, D);
      if (dir === 1) { R(7, 15, 1, 8, D); for (const y of [16, 19, 22]) R(6, y, 1, 1, '#ffffff'); }
    } else { const a = step * 2; R(7 + a, 15, 4, 7, D); R(8 + a, 15, 2, 6, Y); }
    // capuz
    if (noHood) return;
    if (dir === 0) { R(hx - 1, -1, 14, 14, Y); R(hx, -1, 12, 1, L); R(hx + 10, 1, 3, 11, D); }
    else if (side) { R(hx - 1, -1, 13, 5, Y); R(hx - 1, 3, 6, 10, Y); R(hx, -1, 10, 1, L); R(hx - 1, 8, 2, 5, D); }
    else { R(hx - 1, -1, 14, 4, Y); R(hx, -1, 12, 1, L); R(hx - 1, 3, 2, 10, Y); R(hx + 11, 3, 2, 10, D); }
  }
  function drawCatCoat(pose, f) {
    const Y = '#f4c020', D = '#c8901a';
    if (pose === 'sleep') { oval(9, 9, 6.5, 3, Y); R(4, 10, 11, 1, D); return; }
    if (pose === 'sit') { oval(8, 9.5, 4.5, 3.5, Y); R(5, 12, 7, 1, D); poly([[10.5, 3.5], [12, 2.2], [13.5, 3.5], [13.5, 4.5], [10.5, 4.5]], Y); return; }
    oval(10, 7.8, 6, 2.8, Y); R(5, 9, 11, 1, D); R(7, 6, 5, 1, '#ffe070');
    poly([[14, 3.5], [15.5, 2], [17, 3.5], [17, 4.5], [14, 4.5]], Y);
  }

  // ---------- ícones ----------
  function paintIcon6(id) {
    const b = BUGS[id];
    if (b) {
      if (b.k === 'v') { ctx.globalAlpha = 0.4; disc(8, 10, 6, '#f4ff8a'); ctx.globalAlpha = 1; oval(8, 7, 2.5, 3.5, '#3a3a1a'); oval(8, 11, 2.5, 2.5, '#f4ff5a'); R(7, 2, 2, 2, '#e8402a'); R(4, 6, 3, 2, '#c8d8e8'); R(9, 6, 3, 2, '#c8d8e8'); return true; }
      if (b.k === 'be') { oval(8, 9, 5, 5.5, b.col); R(8, 4, 1, 10, '#1a1008'); oval(6, 8, 1.5, 3, b.col2); R(7, 1, 2, 3, b.col); R(8, 0, 1, 2, b.col); R(3, 7, 2, 1, '#1a1008'); R(11, 7, 2, 1, '#1a1008'); R(3, 11, 2, 1, '#1a1008'); R(11, 11, 2, 1, '#1a1008'); return true; }
      if (b.k === 'l') {
        for (const [x, y] of [[1, 5], [10, 5], [2, 8], [10, 8]]) { R(x, y, 5, 2, '#d8f0ff'); R(x, y, 5, 1, '#ffffff'); }
        R(7, 2, 2, 13, b.col); R(7, 2, 2, 3, b.col2); R(6, 3, 1, 1, '#1a1a1a'); R(9, 3, 1, 1, '#1a1a1a'); R(7, 11, 2, 1, b.col2);
      } else {
        const low = b.k === 'm' ? shade(b.col, -0.12) : id === 'borbbranca' ? '#e8e8dc' : shade(b.col, -0.18), M = pts => pts.map(([x, y]) => [16 - x, y]);
        const up = [[8, 5], [4, 1], [1, 1], [0, 4], [1, 8], [8, 9]], lo = [[8, 9], [3, 9], [2, 12], [4, 15], [8, 12]];
        poly(up, b.col); poly(M(up), b.col); poly(lo, low); poly(M(lo), low);
        // bordas e manchas
        if (id === 'monarca' || id === 'morpho') { for (const sx of [0, 1]) { const f = x => sx ? 15 - x : x; R(f(0), 2, 1, 6, b.col2); R(Math.min(f(1), f(3)), 1, 3, 1, b.col2); R(Math.min(f(3), f(5)), 9, 3, 1, b.col2); R(f(2), 11, 1, 3, b.col2); } }
        if (id === 'monarca') { for (const [x, y] of [[1, 3], [14, 3], [1, 6], [14, 6]]) R(x, y, 1, 1, '#ffffff'); R(4, 4, 1, 4, b.col2); R(11, 4, 1, 4, b.col2); }
        if (id === 'morpho') { R(3, 4, 2, 2, '#9ad8ff'); R(11, 4, 2, 2, '#9ad8ff'); }
        if (id === 'borbbranca' || id === 'borbamarela') { R(1, 2, 2, 2, b.col2); R(13, 2, 2, 2, b.col2); R(4, 5, 1, 1, b.col2); R(11, 5, 1, 1, b.col2); }
        if (b.k === 'm') { disc(5, 11, 1.3, '#f4e04a'); disc(11, 11, 1.3, '#f4e04a'); R(3, 14, 1, 2, b.col); R(12, 14, 1, 2, b.col); }
        R(7, 3, 2, 10, '#2a1a12'); R(7, 2, 2, 1, '#4a3a2a'); R(6, 0, 1, 2, '#2a1a12'); R(9, 0, 1, 2, '#2a1a12');
      }
      return true;
    }
    if (id === 'rede') {
      R(2, 9, 2, 2, '#7a4a22'); for (let k = 0; k < 6; k++) R(3 + k, 10 - k, 2, 2, '#a86a32');
      ctx.strokeStyle = '#d8d8d0'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(11, 5, 4.2, 0, TAU); ctx.stroke();
      ctx.globalAlpha = 0.5; R(8, 3, 6, 1, '#ffffff'); R(8, 5, 6, 1, '#ffffff'); R(8, 7, 6, 1, '#ffffff'); R(9, 2, 1, 7, '#ffffff'); R(12, 2, 1, 7, '#ffffff'); ctx.globalAlpha = 1;
      return true;
    }
    if (id === 'capachuva') {
      poly([[4, 4], [12, 4], [14, 15], [2, 15]], '#f4c020'); R(5, 1, 6, 4, '#f4c020'); R(6, 2, 4, 3, '#c8901a');
      R(8, 6, 1, 9, '#c8901a'); for (const y of [7, 10, 13]) R(7, y, 1, 1, '#ffffff'); R(3, 14, 11, 1, '#c8901a');
      return true;
    }
    if (id === 'capadarth') {
      oval(8, 10, 6.5, 4, '#f4c020'); R(2, 12, 13, 1, '#c8901a'); poly([[10, 3], [12, 1], [14, 3], [14, 7], [10, 7]], '#f4c020');
      R(11, 4, 1, 1, '#1c1c24'); R(13, 4, 1, 1, '#1c1c24'); R(6, 9, 1, 1, '#ffffff'); R(9, 9, 1, 1, '#ffffff');
      return true;
    }
    return false;
  }
