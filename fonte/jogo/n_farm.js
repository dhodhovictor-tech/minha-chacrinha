
  // ================= fazenda mais funda: qualidade, adubos, irrigadores, fazedor de sementes, para-raios e eventos da noite =================
  // qualidade fica no próprio espaço da mochila (s.q: 0 normal, 1 prata, 2 ouro); o mesmo item com qualidades diferentes não se mistura
  const Q_NAME = ['', 'prata', 'ouro'], Q_PRICE = [1, 1.25, 1.5], Q_ENERGY = [1, 1.4, 1.8], Q_GIFT = [1, 1.1, 1.25];
  // produtos de animais guardados no chão ou no animal levam a qualidade junto: "ovo#2"
  const splitQ = v => { const [id, q] = String(v).split('#'); return [id, +q || 0]; };
  const withQ = (id, q) => (q ? id + '#' + q : id);
  // chance de prata e ouro na colheita: nível de Lavoura e adubo na terra
  function cropQuality(tl) {
    const lvl = skillLv(P.skills.farming), fq = tl && tl.fe === 'adubobom' ? 2 : tl && tl.fe === 'adubo' ? 1 : 0;
    const gold = 0.01 + 0.2 * (lvl / 10) + 0.2 * fq * ((lvl + 2) / 12), silver = Math.min(0.75, gold * 2), r = Math.random();
    return r < gold ? 2 : r < silver ? 1 : 0;
  }
  // animais felizes dão produtos melhores
  function animalQuality(a) {
    const f = (a.fr || 0) / 1000, r = Math.random();
    return r < f * 0.33 ? 2 : r < f * 0.75 ? 1 : 0;
  }
  // dias até a planta ficar pronta (o acelerador encurta em 25%)
  const cropDays = c => c.d || CROPS[c.id].days;

  Object.assign(ITEMS, {
    adubo: { name: 'Adubo básico', cat: 'fert', sell: 2, desc: 'Na terra arada antes de plantar: mais chance de colheita prata e ouro.' },
    adubobom: { name: 'Adubo de qualidade', cat: 'fert', sell: 10, desc: 'Na terra arada antes de plantar: muito mais chance de colheita prata e ouro.' },
    acelerador: { name: 'Acelerador de crescimento', cat: 'fert', sell: 20, desc: 'Na terra arada antes de plantar: a planta fica pronta 25% mais rápido.' },
    irrigadorbom: { name: 'Irrigador de qualidade', cat: 'place', desc: 'Molha os 8 quadrados em volta toda manhã.' },
    irrigadorouro: { name: 'Irrigador de ouro', cat: 'place', desc: 'Molha 24 quadrados em volta (5×5) toda manhã.' },
    fazedorsementes: { name: 'Fazedor de sementes', cat: 'place', desc: 'Coloque uma colheita: em 1 hora vira de 1 a 3 sementes dela.' },
    pararaios: { name: 'Para-raios', cat: 'place', desc: 'Nas noites de tempestade, guarda a energia de um raio numa bateria.' },
    bateria: { name: 'Bateria', cat: 'res', sell: 500, desc: 'Energia de um raio. Serve para fazer o irrigador de ouro.' },
  });
  RECIPES.push(
    { id: 'adubo', need: { seiva: 2 }, skill: ['farming', 1] },
    { id: 'acelerador', need: { seiva: 1, ameijoa: 1 }, skill: ['farming', 3] },
    { id: 'pararaios', need: { barraferro: 1, quartzo: 1 }, skill: ['farming', 4] },
    { id: 'fazedorsementes', need: { madeira: 25, carvao: 10, barraouro: 1 }, skill: ['farming', 5] },
    { id: 'irrigadorbom', need: { barraferro: 1, barraouro: 1 }, skill: ['farming', 6] },
    { id: 'adubobom', need: { seiva: 4, fibra: 5 }, skill: ['farming', 7] },
    { id: 'irrigadorouro', need: { barraouro: 2, bateria: 1 }, skill: ['farming', 9] },
  );
  const FARM_SHOP = [{ id: 'adubo', price: 100 }, { id: 'acelerador', price: 100 }, { id: 'adubobom', price: 150 }];
  MACHINES.push('fazedorsementes', 'pararaios');
  PLACED.push('fazedorsementes', 'pararaios', 'irrigadorbom', 'irrigadorouro');
  for (const k of ['fazedorsementes', 'pararaios', 'irrigadorbom', 'irrigadorouro', 'meteorito']) SOLID_OBJ.add(k);
  const SPRINKLER_R = { irrigador: 'cross', irrigadorbom: 1, irrigadorouro: 2 };
  // quadrados que cada irrigador molha
  function sprinklerTiles(kind) {
    const r = SPRINKLER_R[kind];
    if (r === 'cross') return DIRS;
    const out = []; for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (dx || dy) out.push([dx, dy]);
    return out;
  }

  // adubo: na terra arada, antes de a planta começar a crescer
  function useFert(m, k, s) {
    if (!farmable(m)) { toast('Use o adubo na terra arada da chacrinha ou da estufa.'); return; }
    const tl = tile(k);
    if (!tl || !tl.s) { toast('Prepare a terra com a enxada antes de pôr adubo.'); sfx.no(); return; }
    if (tl.fe) { toast('Essa terra já tem adubo.'); sfx.no(); return; }
    if (tl.c && (tl.c.g > 0 || tl.c.harvested)) { toast('O adubo vai na terra antes de a planta começar a crescer.'); sfx.no(); return; }
    const nt = { ...tl, fe: s.id };
    if (tl.c && s.id === 'acelerador') nt.c = { ...tl.c, d: Math.max(1, Math.round(CROPS[tl.c.id].days * 0.75)) };
    setTile(k, nt); useHeld(1); sfx.hoe();
  }
  // ao plantar numa terra com acelerador, a planta já nasce sabendo que cresce mais rápido
  function plantedCrop(tl, id) {
    const f = (tl.fe === 'acelerador' ? 0.75 : 1) * (hasProf('agricultor') ? 0.9 : 1), days = CROPS[id].days;
    return f < 1 ? { id, g: 0, d: Math.max(1, Math.round(days * f)) } : { id, g: 0 };
  }

  // ================= eventos da noite (chamado na virada do dia, com a fazenda nova em t) =================
  function nightEvents(t, day, nd, newS) {
    const night = {};
    // raios da tempestade carregam os para-raios
    if (W.meta.storm) {
      let n = 0;
      for (const [k, v] of Object.entries(t)) if (v && v.o && v.o.k === 'pararaios' && !v.o.in && !k.startsWith('g:')) { v.o = { k: 'pararaios', in: 'raio', out: 'bateria', ready: 0 }; n++; }
      if (n) night.raio = n;
    }
    const r = Math.random(), m = MAPS.farm;
    if (newS !== 'winter' && r < 0.06) {
      // a fada faz crescer na hora as plantas em volta de uma delas
      const growing = Object.entries(t).filter(([k, v]) => !k.startsWith('g:') && v && v.c && !v.c.dead && !(v.c.g >= cropDays(v.c)));
      if (growing.length) {
        const [ck] = growing[Math.floor(Math.random() * growing.length)], [cx, cy] = ck.split(',').map(Number);
        let n = 0;
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const v = t[(cx + dx) + ',' + (cy + dy)]; if (v && v.c && !v.c.dead && v.c.g < cropDays(v.c)) { v.c.g = cropDays(v.c); delete v.c.rg; n++; } }
        if (n) night.fada = n;
      }
    } else if (r < 0.1) {
      // cai um meteorito num lugar livre da chacrinha
      for (let i = 0; i < 40; i++) {
        const x = 4 + Math.floor(Math.random() * (m.w - 8)), y = 6 + Math.floor(Math.random() * (m.h - 10)), k = x + ',' + y;
        if (t[k] || m.solid[y * m.w + x] || ![G.GRASS, G.FLOWERS, G.DIRT].includes(m.at(x, y)) || bGrid().has(k) || m.spots[k] || (x >= 5 && x <= 16 && y <= 12)) continue;
        t[k] = { o: { k: 'meteorito', hp: 12 } }; night.meteoro = k; break;
      }
    }
    return night;
  }
  function nightLines() {
    const n = W.meta.night || {}, out = [];
    if (n.fada) out.push(`✨ Uma fada visitou a chacrinha esta noite e fez ${n.fada} planta${n.fada > 1 ? 's' : ''} crescer${n.fada > 1 ? 'em' : ''} na hora!`);
    if (n.meteoro) out.push('☄️ Um meteorito caiu na chacrinha esta noite! Quebre com a picareta para pegar os minérios.');
    if (n.raio) out.push(`⚡ Os raios da tempestade carregaram ${n.raio} para-raios. Tem bateria esperando!`);
    return out.map(l => `<p class="big" style="text-align:center">${l}</p>`).join('');
  }
  function breakMeteor(k, tl, o, power) {
    const hp = o.hp - power; sfx.pick();
    if (hp > 0) { setTile(k, { ...tl, o: { ...o, hp, shake: performance.now() + 250 } }); return; }
    setTile(k, null);
    addItem('ouro', rint(4, 7)); addItem('ferro', rint(5, 8)); addItem('pedra', rint(8, 12));
    if (Math.random() < 0.5) addItem('geodomagma', 1);
    if (Math.random() < 0.15) addItem('diamante', 1);
    gainXP('mining', 25); toast('Você quebrou o meteorito!', 'big');
  }

  // ================= desenhos =================
  function drawObj3(o, px, py) {
    const t = performance.now() / 1000;
    switch (o.k) {
      case 'irrigadorbom': case 'irrigadorouro': {
        const gold = o.k === 'irrigadorouro', a = gold ? ['#8a5a0a', '#d8a020', '#f8d860'] : ['#4a5a6a', '#8aa0b4', '#cfdde8'];
        shadowAt(px + 8, py + 14, 6, 2);
        R(px + 3, py + 9, 10, 6, a[0]); R(px + 4, py + 9, 8, 5, a[1]); R(px + 5, py + 10, 3, 1, a[2]);
        R(px + 7, py + 3, 2, 7, a[0]); R(px + 7, py + 3, 1, 6, a[1]);
        R(px + 4, py + 2, 8, 2, a[1]); R(px + 4, py + 2, 8, 1, a[2]); R(px + (gold ? 2 : 3), py + 4, gold ? 12 : 10, 1, a[0]);
        for (const dx of [3, 12]) R(px + dx, py + 1, 1, 1, '#a8dcf8');
        return true;
      }
      case 'fazedorsementes': {
        const busy = o.in && o.ready > gm(), ready = o.in && o.ready <= gm();
        shadowAt(px + 8, py + 15, 7, 2);
        R(px + 2, py + 3, 12, 12, '#7a4a22'); R(px + 3, py + 4, 10, 10, '#a86a32'); R(px + 3, py + 4, 10, 2, '#c88a4a');
        R(px + 5, py, 6, 4, '#5a5a62'); R(px + 6, py, 4, 1, '#9a9aa2');
        R(px + 5, py + 8, 6, 4, '#3a2412'); R(px + 6, py + 9, 4, 2, busy ? '#f4c840' : ready ? '#7ad84a' : '#5a3a1a');
        for (const [x, y] of [[5, 6], [9, 6], [11, 12]]) R(px + x, py + y, 1, 1, '#e8c87a');
        if (busy && Math.sin(t * 8) > 0) R(px + 7, py - 2, 2, 2, '#c8a86a');
        if (ready) readyBubble(px, py, o.out);
        return true;
      }
      case 'pararaios': {
        const ready = o.in && o.ready <= gm();
        shadowAt(px + 8, py + 15, 5, 2);
        R(px + 5, py + 11, 6, 4, '#5a5a62'); R(px + 5, py + 11, 6, 1, '#8a8a92');
        R(px + 7, py - 8, 2, 20, '#8a8a92'); R(px + 7, py - 8, 1, 20, '#c8c8d0');
        R(px + 6, py - 10, 4, 2, '#f4c840'); R(px + 7, py - 12, 2, 2, '#f8e070');
        if (ready) { if (Math.sin(t * 10) > 0) { R(px + 4, py - 6, 1, 3, '#fff6a0'); R(px + 11, py - 2, 1, 3, '#fff6a0'); } readyBubble(px, py - 8, 'bateria'); }
        return true;
      }
      case 'meteorito': {
        const sh = o.shake > performance.now() ? Math.round(Math.sin(t * 60)) : 0;
        shadowAt(px + 8, py + 15, 9, 3);
        blit(bake('meteorito', 22, 20, () => {
          oval(11, 11, 10, 8, '#3a2e3e'); oval(10, 10, 8.5, 6.5, '#5a4a5e'); oval(8, 8, 4, 2.6, '#7a6a80');
          for (const [x, y, w] of [[5, 13, 4], [12, 6, 3], [14, 12, 4], [9, 10, 2]]) { R(x, y, w, 1, '#ff7a2a'); R(x + 1, y, Math.max(1, w - 2), 1, '#ffd060'); }
          for (const [x, y] of [[4, 8], [15, 9], [11, 15]]) R(x, y, 2, 2, '#2a2030');
        }), px - 3 + sh, py - 5);
        if (Math.sin(t * 3) > 0.6) R(px + 9, py + 2, 1, 1, '#ffe080');
        return true;
      }
    }
    return false;
  }
  // pontinhos de adubo na terra arada
  function drawFert(fe, px, py) {
    const c = fe === 'adubobom' ? '#7ab8f0' : fe === 'acelerador' ? '#9ae86a' : '#e8d8a0';
    for (const [x, y] of [[3, 3], [11, 5], [6, 10], [12, 12], [2, 12]]) R(px + x, py + y, 1, 1, c);
  }
  // relâmpagos nas tempestades (só lá fora)
  let flashT = 0;
  function drawStorm(dt) {
    if (!W.meta.storm || W.meta.snow) return;
    flashT -= dt;
    if (flashT < -2 && Math.random() < dt * 0.12) { flashT = 0.35; if (typeof sfx.thunder === 'function') sfx.thunder(); }
    if (flashT > 0) { ctx.fillStyle = `rgba(255,255,240,${(flashT / 0.35 * 0.55).toFixed(2)})`; ctx.fillRect(0, 0, VW, VH); }
  }
  function paintIcon3(id) {
    const sackC = { adubo: ['#c8a86a', '#8a6a3a', '#e8d8a0'], adubobom: ['#6a9ad8', '#3a5a9a', '#cfe4fa'], acelerador: ['#6ab84a', '#3a7a2a', '#d8f8b0'] }[id];
    if (sackC) {
      poly([[3, 15], [2, 7], [5, 4], [11, 4], [14, 7], [13, 15]], sackC[0]); R(5, 2, 6, 3, sackC[1]); R(6, 1, 4, 1, '#6a4a2a');
      R(4, 5, 2, 9, shade(sackC[0], 0.2)); R(5, 8, 6, 5, sackC[2]);
      if (id === 'acelerador') { R(7, 9, 2, 3, '#3a7a2a'); R(6, 10, 4, 1, '#3a7a2a'); }
      else for (const [x, y] of [[6, 9], [9, 10], [7, 11]]) R(x, y, 1, 1, sackC[1]);
      return true;
    }
    if (id === 'irrigadorbom' || id === 'irrigadorouro') {
      const a = id === 'irrigadorouro' ? ['#8a5a0a', '#d8a020', '#f8d860'] : ['#4a5a6a', '#8aa0b4', '#cfdde8'];
      R(3, 9, 10, 6, a[0]); R(4, 9, 8, 5, a[1]); R(5, 10, 3, 1, a[2]); R(7, 4, 2, 6, a[0]); R(3, 2, 10, 3, a[1]); R(3, 2, 10, 1, a[2]);
      for (const x of [2, 13]) R(x, 1, 1, 1, '#4a90d8');
      return true;
    }
    if (id === 'fazedorsementes') { R(2, 4, 12, 11, '#7a4a22'); R(3, 5, 10, 9, '#a86a32'); R(5, 1, 6, 4, '#5a5a62'); R(5, 9, 6, 4, '#3a2412'); R(6, 10, 4, 2, '#7ad84a'); return true; }
    if (id === 'pararaios') { R(7, 2, 2, 12, '#8a8a92'); R(7, 2, 1, 12, '#c8c8d0'); R(6, 1, 4, 2, '#f4c840'); R(5, 13, 6, 2, '#5a5a62'); R(11, 4, 2, 1, '#fff6a0'); R(12, 5, 1, 2, '#fff6a0'); return true; }
    if (id === 'bateria') { R(4, 3, 8, 12, '#3a3a42'); R(5, 4, 6, 10, '#5ab84a'); R(5, 4, 6, 3, '#7ad86a'); R(6, 1, 4, 2, '#9a9aa2'); R(7, 8, 2, 4, '#f8f070'); R(6, 9, 4, 1, '#f8f070'); return true; }
    return false;
  }
