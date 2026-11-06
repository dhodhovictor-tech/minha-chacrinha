  // ================= floresta: a Mata do Vale =================
  // entrada fixa ("mata") no alto da chacrinha + 48 clareiras ("mata1".."mata48") em 4 áreas.
  // As clareiras são geradas pelo número e por um período de 3 dias: as árvores voltam a cada 3 dias.
  const MATA_N = 48, MATA_RENOVA = 3;
  const MATA_AREAS = [
    { name: 'Bosque', from: 1, wood: 'mpinho' },
    { name: 'Mata Fechada', from: 13, wood: 'mcarvalho' },
    { name: 'Mata Antiga', from: 25, wood: 'mipe' },
    { name: 'Coração da Floresta', from: 37, wood: 'mipe' },
  ];
  const mataArea = n => Math.min(3, Math.floor((n - 1) / 12));
  const mataPer = () => Math.floor(((W.meta && W.meta.day) || 1) / MATA_RENOVA);
  const isMataN = id => /^mata\d+$/.test(id || '');

  // ---------- itens novos ----------
  Object.assign(ITEMS, {
    mpinho: { name: 'Madeira de pinho', cat: 'res', sell: 8, desc: 'Cheirosa e leve. Do Bosque da Mata do Vale.' },
    mcarvalho: { name: 'Madeira de carvalho', cat: 'res', sell: 15, desc: 'Firme e escura. Da Mata Fechada.' },
    mipe: { name: 'Madeira de ipê', cat: 'res', sell: 30, desc: 'Dura e bonita. Da Mata Antiga.' },
    madeiralei: { name: 'Madeira de lei', cat: 'res', sell: 60, desc: 'Só sai dos troncos antigos e das árvores gigantes.' },
    mdourada: { name: 'Madeira dourada', cat: 'res', sell: 300, desc: 'Rara! Das árvores douradas do Coração da Floresta.' },
    melsilvestre: { name: 'Mel silvestre', cat: 'forage', sell: 160, energy: 60, desc: 'Achado em tocos e com as vespas.' },
    morchela: { name: 'Morchela', cat: 'forage', sell: 120, energy: 40 },
    framboesa: { name: 'Framboesa', cat: 'forage', sell: 60, energy: 30, fruit: true },
    castanha: { name: 'Castanha', cat: 'forage', sell: 50, energy: 25 },
    pinha: { name: 'Pinha', cat: 'forage', sell: 25 },
    cogumelorei: { name: 'Cogumelo-rei', cat: 'forage', sell: 320, energy: 90, desc: 'Só aparece na floresta em dia de chuva.' },
    couro: { name: 'Couro', cat: 'res', sell: 70, desc: 'Deixado pelos javalis.' },
    carnesuina: { name: 'Carne suína', cat: 'animal', sell: 140, desc: 'De vez em quando os javalis deixam. Asse na fogueira.' },
    lombo: { name: 'Lombo assado', cat: 'food', sell: 280, energy: 180, buff: { attack: 1 }, desc: 'Assado na fogueira. Dá Ataque +1 por um tempo.' },
    escama: { name: 'Escama de cobra', cat: 'res', sell: 60 },
    ferrao: { name: 'Ferrão de vespa', cat: 'res', sell: 45 },
    cogumeloassado: { name: 'Cogumelo assado', cat: 'food', sell: 110, energy: 95, buff: { foraging: 1 }, desc: 'Assado na fogueira. Dá Coleta +1 por um tempo.' },
    castanhaassada: { name: 'Castanha assada', cat: 'food', sell: 90, energy: 75, buff: { defense: 1 }, desc: 'Assada na fogueira. Dá Defesa +1 por um tempo.' },
    fogueira: { name: 'Fogueira', cat: 'place', desc: 'Coloque na chacrinha. Aquece, ilumina e assa comidinhas. Descansar nela junto é melhor.' },
    xadrezlenhador: { name: 'Camisa de lenhador', cat: 'roupa', slot: 'cp', sell: 1500, desc: 'Cortar árvores gasta 15% menos energia.' },
    chapeuapicultor: { name: 'Chapéu de apicultor', cat: 'roupa', slot: 'hd', sell: 1500, desc: 'Na floresta, +2 de defesa.' },
    botasmata: { name: 'Botas da mata', cat: 'roupa', slot: 'bt', sell: 1800, desc: 'Na floresta, anda 10% mais rápido.' },
  });
  // muda rara: só se acha na floresta
  FTREES.jabuticaba = { name: 'Jabuticabeira', season: 'summer', price: 8000, sell: 150, col: '#2a0a2a', rare: true };
  ITEMS.jabuticaba = { name: 'Jabuticaba', cat: 'fruit', sell: 150, energy: 75, col: '#2a0a2a' };
  ITEMS.m_jabuticaba = { name: 'Muda de jabuticabeira', cat: 'sapling', sell: 4000, tree: 'jabuticaba', desc: `Rara, achada na floresta. Plante na chacrinha com espaço em volta. Cresce em ${FTREE_DAYS} dias e dá jabuticaba no verão.` };
  RECIPES.push({ id: 'fogueira', need: { mpinho: 8, pedra: 10, carvao: 1 }, skill: ['foraging', 2] });
  PLACED.push('fogueira'); SOLID_OBJ.add('fogueira');
  const MATA_FORAGE = { spring: ['morchela', 'alhoporo', 'narciso'], summer: ['framboesa', 'baga', 'cogumelo'], fall: ['castanha', 'cogumelo', 'avela', 'amora'], winter: ['pinha', 'raizinverno', 'frutacristal'] };
  const ROAST = { cogumelo: 'cogumeloassado', morchela: 'cogumeloassado', castanha: 'castanhaassada', carnesuina: 'lombo' };
  // o machado melhora com barras e também com as madeiras da floresta
  const AXE_WOOD = { 1: ['mpinho', 10], 2: ['mcarvalho', 10], 3: ['madeiralei', 5] };
  const axeWoodOk = (id, lv) => id !== 'axe' || !AXE_WOOD[lv] || count(AXE_WOOD[lv][0]) >= AXE_WOOD[lv][1];
  const axeWoodTxt = (id, lv) => (id === 'axe' && AXE_WOOD[lv] ? ` + ${AXE_WOOD[lv][1]} ${item(AXE_WOOD[lv][0]).name.toLowerCase()}` : '');
  const axeWoodSpend = (id, lv) => { if (id === 'axe' && AXE_WOOD[lv]) removeItem(AXE_WOOD[lv][0], AXE_WOOD[lv][1]); };

  // ---------- o que tem nas clareiras ----------
  // lv: nível mínimo do machado (1 cobre, 2 ferro)
  const FOBJ = {
    galho: { hp: 1 }, arbusto: { hp: 2, solid: true }, arvore: { hp: 9, solid: true }, toco: { hp: 4, solid: true }, tronco: { hp: 6, solid: true },
    antigo: { hp: 18, solid: true, lv: 2 }, gigante: { hp: 40, solid: true, lv: 1 }, dourada: { hp: 24, solid: true, lv: 2 }, forage: {}, bau: { solid: true },
  };

  // ---------- mapas ----------
  function buildMataEntrance() {
    const m = newMap('mata', 24, 18, G.GRASS, { name: 'Mata do Vale', mata: true, water: 'pond' });
    m.rect(0, 0, 23, 1, G.FOREST); m.rect(0, 16, 23, 17, G.FOREST); m.rect(0, 0, 1, 17, G.FOREST); m.rect(22, 0, 23, 17, G.FOREST);
    // a trilha chega da vila pela esquerda e sobe para as clareiras
    m.rect(0, 9, 12, 10, G.DIRT); m.rect(11, 0, 12, 10, G.DIRT); m.rect(5, 6, 11, 6, G.DIRT);
    const r = srand(77);
    for (let k = 0; k < 30; k++) { const x = 2 + Math.floor(r() * 20), y = 2 + Math.floor(r() * 14); if (m.at(x, y) === G.GRASS) m.set(x, y, G.FLOWERS); }
    // cabana do lenhador (3,2)-(7,5); porta em (5,5)
    for (let y = 2; y <= 5; y++) for (let x = 3; x <= 7; x++) m.solid[y * m.w + x] = 1;
    spot(m, 5, 5, { kind: 'cabana' }); spot(m, 4, 5, { kind: 'cabana' }); spot(m, 6, 5, { kind: 'cabana' });
    // fogueira com troncos para sentar
    m.solid[10 * m.w + 16] = 1; spot(m, 16, 10, { kind: 'fogueirafix' }); m.solid[12 * m.w + 4] = 1;
    m.fire = [16, 10];
    m.warps.push({ x: 11, y: 0, w: 2, to: 'mata1', tx: 0, ty: 0, dir: 0 });
    m.warps.push({ x: 0, y: 9, h: 2, to: 'town', tx: 47, ty: 18, dir: 2 });
    return finalize(m);
  }
  MAPS.mata = buildMataEntrance();

  function buildMata(n, per) {
    const Wd = 30, H = 20, r = srand(n * 7907 + per * 15485863 + 11), area = mataArea(n), boss = n % 12 === 0;
    const m = newMap('mata' + n, Wd, H, G.GRASS, { name: `${MATA_AREAS[area].name} · clareira ${n}`, mata: true, mataN: n, area, per, water: 'pond' });
    m.rect(0, 0, Wd - 1, 1, G.FOREST); m.rect(0, H - 2, Wd - 1, H - 1, G.FOREST); m.rect(0, 0, 1, H - 1, G.FOREST); m.rect(Wd - 2, 0, Wd - 1, H - 1, G.FOREST);
    const sx = 14; m.rect(sx, H - 5, sx + 1, H - 1, G.DIRT);
    m.warps.push({ x: sx, y: H - 1, w: 2, to: 'mata', tx: 11, ty: 3, dir: 1 });
    m.start = [sx, H - 4];
    const nearStart = (x, y) => Math.abs(x - sx - 0.5) + Math.abs(y - (H - 4)) < 4;
    // moitas de mata fechada no meio
    const nc = boss ? 2 : 3 + Math.floor(r() * 4);
    for (let k = 0; k < nc; k++) {
      const cx = 4 + Math.floor(r() * (Wd - 8)), cy = 3 + Math.floor(r() * (H - 9)), rx = 1 + r() * 1.6, ry = 1 + r() * 1.2;
      for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1 && !nearStart(x, y) && x > 2 && y > 2 && x < Wd - 3 && y < H - 3) m.set(x, y, G.FOREST);
    }
    // lago em algumas clareiras
    if (n % 4 === 2 || (n % 4 === 3 && r() < 0.5)) {
      const cx = 5 + Math.floor(r() * (Wd - 10)), cy = 4 + Math.floor(r() * 6);
      for (let y = cy - 2; y <= cy + 2; y++) for (let x = cx - 3; x <= cx + 3; x++) if (((x - cx) / 3.2) ** 2 + ((y - cy) / 2.1) ** 2 <= 1 && !nearStart(x, y)) m.set(x, y, G.WATER);
    }
    for (let k = 0; k < 26; k++) { const x = 2 + Math.floor(r() * (Wd - 4)), y = 2 + Math.floor(r() * (H - 4)); if (m.at(x, y) === G.GRASS) m.set(x, y, G.FLOWERS); }
    m.wood = {};
    const free = (x, y) => x > 1 && y > 1 && x < Wd - 2 && y < H - 2 && [G.GRASS, G.FLOWERS].includes(m.at(x, y)) && !nearStart(x, y) && !m.wood[x + ',' + y];
    const s = season(), list = MATA_FORAGE[s];
    // árvores com espaço entre elas (a copa ocupa uns 3 quadrados de largura)
    const BIG = ['arvore', 'antigo', 'gigante', 'dourada'];
    const roomy = (x, y, rx = 2, ry = 1) => { for (let dy = -ry; dy <= ry; dy++) for (let dx = -rx; dx <= rx; dx++) { const o = m.wood[(x + dx) + ',' + (y + dy)]; if (o && BIG.includes(o.kind)) return false; if (m.at(x + dx, y + dy) === G.FOREST && Math.abs(dx) <= 1 && Math.abs(dy) <= 1) return false; } return true; };
    for (let y = 2; y < H - 2; y++) for (let x = 2; x < Wd - 2; x++) {
      if (!free(x, y) || r() > (boss ? 0.08 : 0.2)) continue;
      const q = r(); let kind;
      if (q < 0.2) kind = 'galho'; else if (q < 0.36) kind = 'arbusto'; else if (q < 0.64) kind = 'arvore'; else if (q < 0.78) kind = 'toco'; else if (q < 0.88) kind = 'tronco';
      else if (q < 0.94 && area >= 1) kind = 'antigo'; else kind = 'forage';
      if (BIG.includes(kind) && !roomy(x, y)) kind = r() < 0.5 ? 'arbusto' : 'galho';
      if (kind === 'tronco' && (m.wood[(x - 1) + ',' + y] || m.wood[(x + 1) + ',' + y])) kind = 'toco';
      const o = { kind, hp: FOBJ[kind].hp, v: Math.floor(r() * 4) };
      if (kind === 'arvore') o.hp += area * 2;
      if (kind === 'forage') o.id = list[Math.floor(r() * list.length)];
      m.wood[x + ',' + y] = o;
    }
    const place = (kind, extra = {}) => { for (let k = 0; k < 80; k++) { const x = 4 + Math.floor(r() * (Wd - 8)), y = 3 + Math.floor(r() * (H - 8)); if (free(x, y) && free(x - 1, y) && free(x + 1, y) && (kind === 'bau' || roomy(x, y, kind === 'gigante' ? 3 : 2, 2))) { m.wood[x + ',' + y] = { kind, hp: FOBJ[kind].hp, v: 0, ...extra }; return; } } };
    if (n % 3 === 0 && !boss) place('gigante');
    if (area === 3 && r() < 0.6) place('dourada');
    if (r() < 0.2) place('bau');
    m.total = Object.values(m.wood).filter(o => o.kind !== 'forage' && o.kind !== 'bau').length;
    m.monSeed = r() * 1e9;
    return finalize(m);
  }
  const mataCache = new Map();
  function mataMap(n) {
    const per = mataPer(), key = n + ':' + per;
    if (!mataCache.has(key)) { if (mataCache.size > 8) mataCache.clear(); mataCache.set(key, buildMata(n, per)); }
    return mataCache.get(key);
  }
  // o que já foi cortado em cada clareira (os dois veem igual quando estão juntos)
  const mataBrokenMap = {};
  const mBroken = m => (mataBrokenMap[m.per + ':' + m.mataN] = mataBrokenMap[m.per + ':' + m.mataN] || new Set());
  function mataObjAt(m, k) { const o = m.wood && m.wood[k]; return o && !mBroken(m).has(k) ? o : null; }
  // chuva: cogumelo-rei no lugar de alguns coletáveis
  const forageId = (m, k, o) => (W.meta && W.meta.rain && !W.meta.snow && hash(m.mataN, +k.split(',')[0], +k.split(',')[1]) < 0.3 ? 'cogumelorei' : o.id);

  // ---------- entrar numa clareira ----------
  function enterMata(n) {
    const m = getMap('mata' + n);
    P.x = (m.start[0] + 1) * T; P.y = m.start[1] * T + 12; P.dir = 0;
    const st = P.stats; st.mata = Math.max(st.mata || 0, n);
    if ((n - 1) % 12 === 0 && n > (W.meta.mataMax || 0)) { W.meta.mataMax = n; queueUpdate('world/meta', { mataMax: n }); if (n > 1) toast(`A cabana do lenhador agora leva até ${MATA_AREAS[mataArea(n)].name}!`, 'big'); }
    const r = srand(m.monSeed), list = [], area = m.area, boss = n % 12 === 0, night = nowMin() >= 1140, win = season() === 'winter';
    let cnt = area === 0 ? (n >= 3 ? Math.floor(r() * 2.5) : 0) : 2 + area + Math.floor(r() * 2);
    if (night && cnt) cnt++;
    if (boss) cnt = 0;
    const pool = win ? ['javali'] : area === 0 ? ['javali'] : area === 1 ? ['javali', 'cobra'] : ['javali', 'cobra', 'vespa'];
    for (let i = 0; i < cnt; i++) {
      let x, y, tries = 0;
      do { x = 2 + Math.floor(r() * (m.w - 4)); y = 2 + Math.floor(r() * (m.h - 4)); tries++; } while ((solidAt(m, x, y) || Math.hypot(x - m.start[0], y - m.start[1]) < 7) && tries < 50);
      list.push(mataMon(pool[Math.floor(r() * pool.length)], x * T + 8, y * T + 12, n, r()));
    }
    if (boss) spawnFBoss(m, n, list);
    monsters = list;
    if (n === 1 && !st.mataIntro) { st.mataIntro = 1; toast('Corte árvores com o machado. Uma delas esconde a trilha para a próxima clareira.', 'big'); }
  }
  function mataMon(kind, x, y, n, ph) {
    const s = { javali: [20 + n, 6 + Math.floor(n / 6)], cobra: [14 + Math.round(n * 0.8), 7 + Math.floor(n / 6)], vespa: [9 + Math.round(n / 2), 4 + Math.floor(n / 8)] }[kind];
    return { kind, mata: true, x, y, hp: s[0], max: s[0], dmg: s[1], ph: ph * 10, vx: 0, vy: 0, cd: 1 + ph * 2, hitT: 0, hopT: 1, fly: kind === 'vespa', dir: 1 };
  }

  // ---------- cortar e pegar ----------
  function partnerChopping(tx, ty) {
    const now = performance.now();
    for (const p of peerPlayers()) {
      if (p.me || p.map !== P.map) continue;
      if (p.tool === 'axe' && Math.hypot(p.x - (tx * T + 8), p.y - (ty * T + 8)) < 44) chopSeen.set(p.peer, now);
      if (now - (chopSeen.get(p.peer) || 0) < 2500) return p;
    }
    return null;
  }
  const chopSeen = new Map();
  function mataHit(m, tx, ty, s) {
    const lv = s.lv || 0, d = DIRS[P.dir];
    if (s.id === 'axe') {
      const fx = P.x + d[0] * 14, fy = P.y - 8 + d[1] * 14;
      const b = monsters.find(mo => mo.axeOnly && !mo.dead && Math.hypot(mo.x - fx, mo.y - 10 - fy) < (mo.r || 18) + 12);
      if (b) { b.hp -= 5 + lv * 4 + skillLv(P.skills.foraging); b.hitT = 0.15; sfx.chop(); if (b.hp <= 0) killMonster(b); monsters = monsters.filter(x => !x.dead); return; }
    }
    const k = tx + ',' + ty, o = mataObjAt(m, k);
    if (!o || o.kind === 'forage' || o.kind === 'bau') { sfx.no(); return; }
    if (s.id !== 'axe') { sfx.no(); if (s.id === 'pick' || s.id === 'hoe') toast('Use o machado para cortar.', '', null, 'machado'); return; }
    const need = FOBJ[o.kind].lv || 0;
    if (lv < need) { o.shake = performance.now() + 300; sfx.no(); toast(need === 1 ? 'Essa árvore gigante precisa de um machado de cobre ou melhor.' : o.kind === 'dourada' ? 'A árvore dourada precisa de um machado de ferro ou melhor.' : 'Esse tronco antigo é duro demais. Precisa de um machado de ferro ou melhor.', '', null, 'machado'); return; }
    let pw = (1 + lv) * (hasProf('mestrelenhador') ? 2 : 1);
    if (o.kind === 'gigante') { const pt = partnerChopping(tx, ty); if (pt) { pw *= 2; toast(`Cortando junto com ${pt.name}: o dobro de força!`, '', null, 'juntos'); } }
    o.hp -= pw; o.hit = 1; o.shake = performance.now() + 300; sfx.chop();
    if (o.hp > 0) return;
    breakMata(m, k, true);
  }
  function mataLoot(m, o, share) {
    const area = m.area, wood = MATA_AREAS[area].wood, lj = hasProf('lenhador') ? 1.25 : 1, got = [];
    const add = (id, n) => { if (n > 0 && addItem(id, n, true)) got.push(`${n} ${item(id).name.toLowerCase()}`); };
    switch (o.kind) {
      case 'galho': add('madeira', rint(1, 2)); if (Math.random() < 0.3) add('fibra', 1); break;
      case 'arbusto': add('fibra', rint(1, 2)); if (Math.random() < 0.5) add('madeira', 1); if (Math.random() < 0.25) add(pick(MATA_FORAGE[season()]), 1); break;
      case 'arvore': add('madeira', Math.round(3 * lj)); add(wood, rint(1, 3)); if (Math.random() < 0.5) add('seiva', rint(1, 2)); if (season() === 'winter' && Math.random() < 0.3) add('pinha', 1); break;
      case 'toco': add('madeira', rint(2, 3)); if (Math.random() < 0.03) add('trufa', 1); else if (Math.random() < 0.45) add(pick(['cogumelo', 'melsilvestre', 'pena', 'resina', 'avela']), 1); break;
      case 'tronco': add('madeira', Math.round(rint(3, 5) * lj)); add(wood, rint(1, 2)); if (Math.random() < 0.35) add(pick(['cogumelo', 'morchela', 'seiva', 'resina']), 1); break;
      case 'antigo': add('madeiralei', rint(2, 3)); add('madeira', Math.round(8 * lj)); add(wood, 2); break;
      case 'gigante': add('madeiralei', share ? rint(2, 3) : rint(3, 5)); add('madeira', Math.round((share ? 8 : 15) * lj)); add(wood, share ? 3 : 5); if (Math.random() < 0.06) add('m_jabuticaba', 1); else add(pick(['melsilvestre', 'trufa', 'resina']), 1); break;
      case 'dourada': add('mdourada', rint(1, 2)); add('madeira', Math.round(6 * lj)); break;
    }
    return got;
  }
  function breakMata(m, k, mine) {
    const set = mBroken(m); if (set.has(k)) return;
    set.add(k);
    const o = m.wood[k];
    if (!mine) {
      // a outra pessoa derrubou: se você também estava cortando a gigante, ganha a sua parte
      if (o.kind === 'gigante' && o.hit) { const got = mataLoot(m, o, true); sfx.level(); toast(`A árvore gigante caiu! Vocês dividiram: ${got.join(', ')}.`, 'big', null, 'gigante'); }
      return;
    }
    const got = mataLoot(m, o, false), tree = ['arvore', 'antigo', 'gigante', 'dourada'].includes(o.kind);
    if (tree) { P.stats.trees = (P.stats.trees || 0) + 1; logAct('arvore', o.kind, 1); }
    gainXP('foraging', { galho: 1, arbusto: 2, arvore: 8, toco: 4, tronco: 6, antigo: 15, gigante: 30, dourada: 25 }[o.kind] || 2);
    if (o.kind === 'gigante') { sfx.level(); toast(`A árvore gigante caiu! ${got.join(', ')}.`, 'big', null, 'gigante'); }
    else if (o.kind === 'antigo' || o.kind === 'dourada') toast(`${o.kind === 'antigo' ? 'Tronco antigo' : 'Árvore dourada'} derrubado: ${got.join(', ')}.`, '', null, 'arvore');
    let trail = null;
    const bossAlive = monsters.some(x => x.kind === 'boss' && !x.dead);
    if (!m.trail && m.mataN < MATA_N && !bossAlive && o.kind !== 'galho') {
      const left = m.total - set.size, p = 0.02 + 0.9 / Math.max(3, left) + (set.size / Math.max(1, m.total)) * 0.12;
      if (Math.random() < p || left <= 2) { trail = k; m.trail = k; toast('Você achou a trilha para a próxima clareira!', '', null, 'trilha'); sfx.level(); }
    }
    if (room) room.emit('mata', { p: m.per, n: m.mataN, k, trail }).catch(() => {});
  }
  function onMataMsg(msg) {
    if (msg.sameTab) return;
    const d = msg.data || {};
    if (d.p !== mataPer()) return;
    const m = getMap('mata' + d.n);
    breakMata(m, d.k, false);
    if (d.trail && !m.trail) m.trail = d.trail;
    if (d.boss) { W.meta.fbosses = W.meta.fbosses || {}; W.meta.fbosses[d.n] = d.boss; if (P.map === 'mata' + d.n) monsters = monsters.filter(x => x.kind !== 'boss'); }
  }
  function openFChest(m, k) {
    const set = mBroken(m); set.add(k);
    const area = m.area, got = [];
    const loot = [['madeiralei', rint(2, 4)], [pick(['melsilvestre', 'trufa', 'cogumelorei', 'resina']), 1], [pick(['ouro', 'barraferro', 'esmeralda', 'ametista']), rint(1, 2)]];
    if (Math.random() < 0.15 + area * 0.05) loot.push(['m_jabuticaba', 1]);
    if (area >= 2 && Math.random() < 0.3) loot.push(['mdourada', 1]);
    for (const [id, n] of loot) if (addItem(id, n, true)) got.push(`${n} ${item(id).name.toLowerCase()}`);
    sfx.coin(); toast(`Baú esquecido na mata! ${got.join(', ')}.`, 'big', null, 'baumata');
    if (room) room.emit('mata', { p: m.per, n: m.mataN, k }).catch(() => {});
  }
  // tocar em Usar na floresta (e na fogueira da chacrinha)
  function mataAct(m, tx, ty) {
    const k = tx + ',' + ty, s = held(), isTool = s && item(s.id).cat === 'tool';
    if (m.id === 'farm') { const tl = tile(k); if (tl && tl.o && tl.o.k === 'fogueira' && !isTool) { useFire(tx * T + 8, ty * T + 8); return true; } return false; }
    if (!m.mata) return false;
    if (m.id === 'mata') {
      const sp = m.spots[k];
      if (sp && sp.kind === 'cabana') { openCabana(); return true; }
      if (sp && sp.kind === 'fogueirafix') { useFire(tx * T + 8, ty * T + 8); return true; }
      return false;
    }
    if (m.trail === k) { goMap('mata' + (m.mataN + 1), 0, 0, 0); return true; }
    let kk = k, o = mataObjAt(m, k);
    if (!o) { const [px, py] = ptile(); kk = px + ',' + py; o = mataObjAt(m, kk); if (o && o.kind !== 'forage' && o.kind !== 'galho') o = null; }
    if (!o) return false;
    if (o.kind === 'forage') {
      const id = forageId(m, kk, o);
      if (!addItem(id, hasProf('coletor') && Math.random() < 0.2 ? 2 : 1, false, hasProf('botanico') ? 2 : 0)) return true;
      mBroken(m).add(kk); gainXP('foraging', 7); sfx.pop();
      if (room) room.emit('mata', { p: m.per, n: m.mataN, k: kk }).catch(() => {});
      return true;
    }
    if (o.kind === 'galho') { breakMata(m, kk, true); sfx.pop(); return true; }
    if (o.kind === 'bau') { openFChest(m, kk); return true; }
    if (!isTool) { toast('Segure o machado para cortar.', '', null, 'machado'); return true; }
    return false;
  }
  // ---------- fogueira: descansar (melhor a dois) e assar ----------
  function useFire(fx, fy) {
    const s = held();
    if (s && (ROAST[s.id] || item(s.id).cat === 'fish')) {
      const out = ROAST[s.id] || 'espetinho';
      useHeld(1); addItem(out, 1, true); sfx.pop(); toast(`Você assou na fogueira: ${item(out).name}!`, '', out, 'assou'); return;
    }
    const day = W.meta.day, f = P.flags;
    if (f.fogD === day && (f.fogN || 0) >= 3) { toast('Você já descansou bastante na fogueira hoje.', '', null, 'fogueira'); return; }
    f.fogN = f.fogD === day ? (f.fogN || 0) + 1 : 1; f.fogD = day;
    const pt = peerPlayers().find(p => !p.me && p.map === P.map && Math.hypot(p.x - fx, p.y - fy) < 50);
    const gain = pt ? 40 : 20;
    P.energy = Math.min(P.maxEnergy, P.energy + gain); P.hp = Math.min(100, P.hp + 15);
    if (pt) { loveFx = 2; P.stats.fogJuntos = (P.stats.fogJuntos || 0) + 1; }
    dirty(); sfx.pop();
    toast(pt ? `Você e ${pt.name} se aquecem juntinhos na fogueira. +${gain} de energia.` : `Você descansa um pouco na fogueira. +${gain} de energia. Com companhia rende o dobro.`, 'big', null, 'fogueira');
  }
  // ---------- cabana do lenhador: atalho para as áreas ----------
  function openCabana() {
    const max = Math.max(1, W.meta.mataMax || 0), fb = W.meta.fbosses || {};
    const btns = MATA_AREAS.map(a => max >= a.from ? `<button class="btn" data-a="mataGo" data-f="${a.from}" type="button">${a.name}</button>` : '').join('');
    const gs = Object.entries(FBOSSES).map(([n, B]) => `<div class="item${fb[n] ? '' : ' dim'}"><span class="nm"><b>${B.name}</b><small>Clareira ${n} · ${fb[n] ? 'vencido!' : 'ainda guarda a mata'}</small></span></div>`).join('');
    openPanel(`<h2>Cabana do lenhador</h2><p style="text-align:center">Escolha onde começar. As clareiras mudam a cada ${MATA_RENOVA} dias e as árvores voltam a crescer.</p><div class="row">${btns}</div><p style="text-align:center;font-size:13px">Clareira mais funda: ${P.stats.mata || 0} de ${MATA_N}</p><h3>Guardiões da mata</h3><div class="list">${gs}</div>`, 'cabana');
  }

  // ---------- bichos da mata ----------
  function mataMove(mo, dt, dx, dy, dist) {
    mo.cd -= dt;
    if (Math.abs(mo.vx) > 4) mo.dir = mo.vx > 0 ? 3 : 2;
    if (mo.kind === 'javali') {
      if (mo.wind > 0) { mo.wind -= dt; mo.vx = 0; mo.vy = 0; if (mo.wind <= 0) { mo.vx = mo.cx * 170; mo.vy = mo.cy * 170; mo.dash = 0.6; } }
      else if (mo.dash > 0) { mo.dash -= dt; mo.vx = mo.cx * 170; mo.vy = mo.cy * 170; }
      else if (mo.cd <= 0 && dist < 110) { mo.cd = rnd(2, 2.8); mo.wind = 0.5; mo.cx = dx / dist; mo.cy = dy / dist; mo.dir = dx > 0 ? 3 : 2; }
      else if (dist < 140) { mo.vx += (dx / dist * 22 - mo.vx) * dt * 2; mo.vy += (dy / dist * 22 - mo.vy) * dt * 2; }
    } else if (mo.kind === 'cobra') {
      mo.hide = dist > 64;
      if (!mo.hide) { mo.hopT -= dt; if (mo.hopT <= 0) { mo.hopT = rnd(1.2, 1.8); mo.vx = dx / dist * 140; mo.vy = dy / dist * 140; } }
    } else if (mo.kind === 'vespa') {
      if (dist < 150) { mo.vx += (dx / dist * 75 + rnd(-70, 70) - mo.vx) * dt * 2.5; mo.vy += (dy / dist * 75 + rnd(-70, 70) - mo.vy) * dt * 2.5; }
      else { mo.vx += (Math.cos(performance.now() / 600 + mo.ph) * 30 - mo.vx) * dt; mo.vy += (Math.sin(performance.now() / 500 + mo.ph) * 20 - mo.vy) * dt; }
    }
  }
  function mataKill(mo) {
    if (mo.kind === 'boss') { fbossDefeated(mo); return; }
    gainXP('combat', 6);
    if (eqHas('anelvida')) P.hp = Math.min(100, P.hp + 4);
    const mul = hasProf('ladrao') ? 2 : 1;
    if (mo.kind === 'javali') { if (Math.random() < 0.22) addItem('carnesuina', 1); else if (Math.random() < 0.5) addItem('couro', mul); }
    if (mo.kind === 'cobra' && Math.random() < 0.5) addItem('escama', mul);
    if (mo.kind === 'vespa') { if (Math.random() < 0.15) addItem('melsilvestre', 1); else if (Math.random() < 0.45) addItem('ferrao', mul); }
  }
  // ---------- guardiões (chefes) da mata ----------
  const FBOSSES = {
    12: { b: 'javalirei', name: 'Javali Rei', hp: 200, dmg: 11, r: 18, loot: [['xadrezlenhador', 1], ['madeiralei', 3], ['couro', 5], ['carnesuina', 3]] },
    24: { b: 'rainhavespa', name: 'Rainha das Vespas', hp: 300, dmg: 13, r: 16, fly: true, loot: [['chapeuapicultor', 1], ['melsilvestre', 8], ['madeiralei', 4]] },
    36: { b: 'sucuri', name: 'Sucuri Gigante', hp: 420, dmg: 17, r: 18, loot: [['botasmata', 1], ['escama', 8], ['madeiralei', 5]] },
    48: { b: 'anciao', name: 'Árvore Anciã', hp: 520, dmg: 20, r: 22, axeOnly: true, loot: [['m_jabuticaba', 1], ['mdourada', 5], ['madeiralei', 10]] },
  };
  function spawnFBoss(m, n, list) {
    const B = FBOSSES[n]; if (!B || (W.meta.fbosses && W.meta.fbosses[n])) return;
    let x = Math.floor(m.w / 2), y = 7;
    for (let i = 0; i < 80 && (solidAt(m, x, y) || Math.hypot(x - m.start[0], y - m.start[1]) < 7); i++) { x = 4 + Math.floor(Math.random() * (m.w - 8)); y = 3 + Math.floor(Math.random() * (m.h - 9)); }
    list.push({ kind: 'boss', mata: true, b: B.b, name: B.name, floor: n, x: x * T + 8, y: y * T + 12, hp: B.hp, max: B.hp, dmg: B.dmg, r: B.r, fly: B.fly, axeOnly: B.axeOnly, ph: 0, vx: 0, vy: 0, cd: 2, t2: 5, hitT: 0, hopT: 1, dir: 2, drops: [] });
    setTimeout(() => toast(B.axeOnly ? `${B.name} acordou! Só o machado corta a casca dela.` : `${B.name} guarda esta clareira!`, 'big', null, 'chefe'), 600);
  }
  function fMinion(kind, mo) { if (monsters.filter(x => x.kind === kind).length < 3) monsters.push(mataMon(kind, mo.x + rnd(-24, 24), mo.y + rnd(-12, 12), Math.round(mo.floor / 2), Math.random())); }
  function updateFBoss(mo, dt, dx, dy, dist) {
    switch (mo.b) {
      case 'javalirei':
        if (mo.wind > 0) { mo.wind -= dt; mo.vx = 0; mo.vy = 0; if (mo.wind <= 0) mo.dash = 0.7; }
        else if (mo.dash > 0) { mo.dash -= dt; mo.vx = mo.cx * 210; mo.vy = mo.cy * 210; }
        else if (mo.cd <= 0) { mo.cd = 2.6; mo.wind = 0.6; mo.cx = dx / dist; mo.cy = dy / dist; }
        else { mo.vx += (dx / dist * 26 - mo.vx) * dt * 2; mo.vy += (dy / dist * 26 - mo.vy) * dt * 2; }
        if (Math.abs(dx) > 4) mo.dir = dx > 0 ? 3 : 2;
        if (mo.t2 <= 0) { mo.t2 = 8; fMinion('javali', mo); }
        break;
      case 'rainhavespa': {
        const a = performance.now() / 900, tx = P.x + Math.cos(a) * 60, ty = P.y - 10 + Math.sin(a) * 40;
        if (mo.cd <= 0) { mo.cd = 3; mo.vx = dx / dist * 230; mo.vy = dy / dist * 230; }
        else if (mo.cd < 2.4) { mo.vx += ((tx - mo.x) * 2 - mo.vx) * dt * 2; mo.vy += ((ty - mo.y) * 2 - mo.vy) * dt * 2; }
        if (mo.t2 <= 0) { mo.t2 = 6; fMinion('vespa', mo); }
        break;
      }
      case 'sucuri':
        if (mo.cd <= 0) { mo.cd = 3; mo.vx = dx / dist * 220; mo.vy = dy / dist * 220; }
        else if (mo.cd < 2.4) { mo.vx += (dx / dist * 40 - mo.vx) * dt * 2; mo.vy += (dy / dist * 40 - mo.vy) * dt * 2; }
        if (Math.abs(dx) > 4) mo.dir = dx > 0 ? 3 : 2;
        if (mo.t2 <= 0) { mo.t2 = 9; fMinion('cobra', mo); }
        break;
      case 'anciao':
        mo.vx = 0; mo.vy = 0;
        // derruba galhos onde a pessoa está: dá para desviar
        if (mo.cd <= 0) { mo.cd = Math.max(1.4, 2.4 * mo.hp / mo.max + 0.6); mo.drops.push({ x: P.x, y: P.y, t: 0.9 }); }
        for (const d of mo.drops) { d.t -= dt; if (d.t <= 0 && !d.done) { d.done = true; sfx.chop(); if (Math.hypot(P.x - d.x, P.y - d.y) < 14 && hurtT <= 0) { hurtT = 0.9; P.hp -= Math.max(1, Math.round(mo.dmg * MON_DMG) - defTotal()); sfx.hurt(); dirty(); if (P.hp <= 0) mataFaint(); } } }
        mo.drops = mo.drops.filter(d => d.t > -0.3);
        break;
    }
  }
  function mataFaint() { P.hp = 40; P.energy = Math.max(10, P.energy - 40); toast('Você desmaiou e acordou na entrada da mata.'); goMap('mata', 11 * T + 8, 13 * T + 8, 0); }
  function fbossDefeated(mo) {
    const B = FBOSSES[mo.floor];
    W.meta.fbosses = W.meta.fbosses || {}; W.meta.fbosses[mo.floor] = P.uid;
    queueUpdate('world/meta', { fbosses: { [mo.floor]: P.uid } });
    gainXP('combat', 120); logAct('chefe', B.name, 1);
    const names = [];
    for (const [id, n] of B.loot) { addItem(id, n, true); names.push(`${n}× ${item(id).name}`); }
    monsters = monsters.filter(x => x === mo || x.kind === 'boss');
    const m = curMap();
    let trail = null;
    if (mo.floor < MATA_N && !m.trail) {
      let tx = Math.floor(mo.x / T), ty = Math.floor((mo.y - 4) / T);
      for (let i = 0; i < 40 && solidAt(m, tx, ty); i++) { tx += rint(-1, 1); ty += rint(-1, 1); }
      trail = tx + ',' + ty; m.trail = trail;
    }
    sfx.level(); toast(`Você venceu ${B.name}! Ganhou: ${names.join(', ')}${mo.floor === MATA_N ? '. Vocês chegaram ao coração da floresta!' : ''}`, 'big');
    if (room) room.emit('mata', { p: m.per, n: m.mataN, k: '_', trail, boss: P.uid }).catch(() => {});
  }

  // ---------- desenho ----------
  const TREE_SKIN = {
    ipe: ['#8a5a10', '#c8901a', '#e8b82a', '#f4d84a', '#fff07a'],
    ipeR: ['#7a1a4a', '#b02a6a', '#d84a8a', '#f07aaa', '#ffc8e0'],
    dourada: ['#7a5a0a', '#b8901a', '#e8c030', '#ffe060', '#fff8c0'],
    anciao: ['#14301c', '#1e4426', '#2a5a30', '#3a7040', '#5a8a50'],
  };
  function skinTree(skin, s) {
    return bake(`ftree|${skin}|${s}`, 52, 76, () => {
      const p = TREE_SKIN[skin], cx = 26, by = 74;
      trunk(cx, by, by - 30, skin === 'dourada' ? ['#5a3a10', '#8a6020', '#b88a30'] : undefined);
      if (s === 'winter' && skin !== 'dourada') { bareBranches(cx, by, 23); return; }
      leafCanopy(cx, by, p, [[0, -60, 10], [-11, -56, 10], [11, -56, 10], [-18, -46, 10], [18, -46, 10], [-16, -34, 9], [16, -34, 9], [-6, -30, 10], [7, -30, 10], [0, -46, 15], [-8, -48, 11], [8, -48, 11]], skin.length * 17);
      if (skin === 'dourada') { const r2 = srand(5); for (let k = 0; k < 10; k++) R(cx - 18 + r2() * 36, by - 64 + r2() * 34, 1, 1, '#ffffff'); }
    });
  }
  function drawBigTree(c, bx, by, sc, shake) {
    const sx = shake ? Math.round(Math.sin(performance.now() / 25) * 1.5) : 0;
    shadowAt(bx, by, 13 * sc, 4 * sc);
    ctx.drawImage(c, Math.round(bx - 26 * sc + sx), Math.round(by - 74 * sc), Math.round(52 * sc), Math.round(76 * sc));
  }
  function treeFor(m, o) {
    const s = season(), a = m.area;
    if (o.kind === 'dourada') return [skinTree('dourada', s), 1.15];
    if (o.kind === 'gigante') return [treeCanvas(a === 0 ? 2 : 0), 1.7];
    if (o.kind === 'antigo') return [treeCanvas(a >= 2 ? 0 : 1), 1.3];
    if (a === 0) return [treeCanvas(o.v % 2 ? 2 : 0), 1];
    if (a === 1) return [treeCanvas(s === 'winter' ? 2 : o.v % 2), 1];
    if (a === 2) return [o.v === 3 ? skinTree('ipeR', s) : o.v % 2 ? skinTree('ipe', s) : treeCanvas(0), 1];
    return [o.v % 2 ? skinTree('ipe', s) : treeCanvas(o.v === 2 ? 2 : 0), 1];
  }
  const LOG = () => bake('mlog', 26, 14, () => { R(2, 4, 22, 8, '#6a4224'); R(2, 4, 22, 2, '#8a5a32'); R(2, 10, 22, 2, '#4a2e1a'); oval(3, 8, 3, 4, '#a8783a'); oval(3, 8, 1.5, 2, '#7a4a24'); R(10, 6, 4, 1, '#4a2e1a'); R(18, 8, 3, 1, '#4a2e1a'); R(14, 2, 3, 3, '#4a8a3a'); R(15, 1, 2, 1, '#6aaa4a'); });
  const BUSH = v => bake('mbush|' + v + '|' + season(), 18, 16, () => {
    const s = season(), c = s === 'winter' ? ['#6a7a6a', '#8a9a8a', '#d8e4ec'] : s === 'fall' ? ['#6a3a14', '#9a5a1a', '#c8862a'] : ['#245a24', '#367a30', '#58a03e'];
    disc(9, 10, 6, c[0]); disc(5, 10, 4, c[0]); disc(13, 10, 4, c[0]); disc(9, 8, 5, c[1]); disc(6, 9, 3.5, c[1]); disc(12, 9, 3.5, c[1]); disc(8, 6, 2.5, c[2]);
    if (s === 'summer' && v % 2) for (const [x, y] of [[6, 9], [11, 7], [9, 11], [13, 10]]) R(x, y, 2, 2, '#d8203a');
  });
  function drawMataObj(m, o, x, y, k) {
    const px = x * T, py = y * T, t = performance.now() / 1000, sh = o.shake > performance.now();
    switch (o.kind) {
      case 'galho': blit(TWIG(), px, py); break;
      case 'arbusto': shadowAt(px + 8, py + 14, 7, 2); blit(BUSH(o.v), px - 1, py + (sh ? Math.round(Math.sin(t * 40)) : 0)); break;
      case 'toco': shadowAt(px + 8, py + 15, 7, 2); blit(STUMP(), px - 1, py); break;
      case 'tronco': shadowAt(px + 8, py + 13, 12, 2); blit(LOG(), px - 5, py + 2 + (sh ? 1 : 0)); break;
      case 'forage': shadowAt(px + 8, py + 14, 5, 1.5); drawIconAt(forageId(m, k, o), px, py - 2 + Math.sin(t * 2 + px) * 1); break;
      case 'bau': shadowAt(px + 8, py + 15, 7, 2); blit(objCanvas('bau'), px - 1, py - 4); if (Math.sin(t * 3 + x) > 0.6) R(px + 12, py - 4, 1, 1, '#ffffff'); break;
      default: { const [c, sc] = treeFor(m, o); drawBigTree(c, px + 8, py + 15, sc, sh); if (o.kind === 'dourada' && Math.sin(t * 2 + x) > 0.3) R(px + 2 + ((t * 9) % 12), py - 40 - ((t * 7) % 20), 1, 1, '#fff8c0'); }
    }
  }
  function javaliCanvas(f, big) {
    return bake(`javali|${f}|${big ? 1 : 0}`, 22, 16, () => {
      const c = big ? '#5a3a2a' : '#6a4a32', d = big ? '#3a2418' : '#4a3020', l = '#8a6a4a', leg = f ? 1 : 0;
      R(5 + leg, 11, 2, 4, d); R(9 - leg, 11, 2, 4, d); R(13 + leg, 11, 2, 4, d); R(16 - leg, 11, 2, 4, d);
      oval(11, 8, 8, 4.5, c); R(5, 4, 11, 2, d); for (let x = 5; x < 16; x += 2) R(x, 3, 1, 2, d);
      oval(18, 8, 3.5, 3, c); R(20, 8, 2, 2, '#c89a8a'); R(17, 6, 1, 1, '#1a1010'); R(19, 10, 2, 1, '#ffffff'); R(16, 3, 2, 3, d); R(9, 7, 4, 1, l);
      R(2, 6, 2, 1, d); R(1, 5, 1, 1, d);
    });
  }
  function cobraCanvas(f, big) {
    return bake(`cobra|${f}|${big ? 1 : 0}`, 26, 12, () => {
      const c = big ? '#3a6a2a' : '#4a9a3a', d = big ? '#1e3a14' : '#2e6a24';
      for (let i = 0; i < 9; i++) { const x = 2 + i * 2.4, y = 7 + Math.sin(i * 0.9 + f * 1.5) * 2; disc(x, y, 2.2, i % 2 ? c : d); }
      disc(23, 6, 3, c); R(23, 4, 1, 1, '#f4e04a'); R(25, 6, 1, 1, '#e8402a');
      if (big) for (let i = 1; i < 8; i += 2) R(2 + i * 2.4, 6 + Math.sin(i * 0.9 + f * 1.5) * 2, 2, 1, '#c8b04a');
    });
  }
  function vespaCanvas(f) {
    return bake('vespa|' + f, 14, 12, () => {
      ctx.globalAlpha = 0.7; oval(5, f ? 3 : 4, 3, f ? 2 : 1.5, '#e8f4ff'); oval(9, f ? 3 : 4, 3, f ? 2 : 1.5, '#e8f4ff'); ctx.globalAlpha = 1;
      oval(7, 7, 4, 2.6, '#f4c020'); R(5, 5, 1, 5, '#1a1a1a'); R(8, 5, 1, 5, '#1a1a1a'); disc(11, 7, 1.8, '#1a1a1a'); R(2, 7, 1, 1, '#1a1a1a');
    });
  }
  function ancianCanvas(hurt) {
    return bake('anciao|' + season() + '|' + (hurt ? 1 : 0), 52, 76, () => {
      const cx = 26, by = 74;
      poly([[cx - 9, by], [cx - 6, by - 34], [cx + 6, by - 34], [cx + 9, by]], '#4a3020'); R(cx - 4, by - 34, 3, 32, '#6a4630');
      for (const [ox, w] of [[-14, 6], [9, 6]]) poly([[cx + ox, by], [cx + ox + w / 2, by - 6], [cx + ox + w, by]], '#3a2418');
      leafCanopy(cx, by, TREE_SKIN.anciao, [[0, -60, 11], [-12, -56, 11], [12, -56, 11], [-19, -46, 10], [19, -46, 10], [-16, -34, 9], [16, -34, 9], [0, -46, 15]], 99);
      R(cx - 6, by - 26, 4, 3, hurt ? '#ff6a2a' : '#f4e04a'); R(cx + 2, by - 26, 4, 3, hurt ? '#ff6a2a' : '#f4e04a'); R(cx - 4, by - 18, 8, 3, '#1a0e08'); R(cx - 3, by - 17, 2, 1, '#3a2418');
    });
  }
  function drawMataMon(mo) {
    const t = performance.now() / 1000 + mo.ph, x = Math.round(mo.x), y = Math.round(mo.y), hit = mo.hitT > 0, flip = mo.dir === 2;
    const put = (c, w, h, oy, s = 1) => { ctx.save(); ctx.translate(x, y + oy); if (flip) ctx.scale(-1, 1); ctx.drawImage(c, -w * s / 2, -h * s, w * s, h * s); ctx.restore(); };
    if (mo.kind === 'boss') { shadowAt(x, y, 16, 4); if (mo.b === 'anciao') for (const d of mo.drops) { const k = clamp(1 - d.t / 0.9, 0, 1); if (d.t > 0) { ctx.globalAlpha = 0.25 + k * 0.35; oval(d.x, d.y, 12 * k + 2, 5 * k + 1, '#1a0e08'); ctx.globalAlpha = 1; R(d.x - 6, d.y - 60 * (1 - k) - 6, 12, 3, '#5a3820'); R(d.x - 2, d.y - 60 * (1 - k) - 9, 2, 3, '#3a7a2a'); } else if (!d.gone) { R(d.x - 7, d.y - 2, 14, 3, '#5a3820'); } } }
    else shadowAt(x, y, mo.kind === 'vespa' ? 4 : 7, 2);
    if (hit) ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 60);
    if (mo.kind === 'cobra' && mo.hide) ctx.globalAlpha = Math.min(ctx.globalAlpha, 0.45);
    const crown = (cx, cy) => { R(cx - 6, cy, 12, 3, '#f4c83a'); for (const dx of [-6, -2, 2, 5]) R(cx + dx, cy - 3, 2, 3, '#f4c83a'); R(cx - 1, cy + 1, 2, 1, '#e8402a'); };
    const sh = mo.wind > 0 ? Math.round(Math.sin(t * 50)) : 0;
    if (mo.kind === 'javali') put(javaliCanvas(Math.floor(t * 8) % 2 && (Math.abs(mo.vx) + Math.abs(mo.vy) > 10) ? 1 : 0), 22, 16, 1 + sh);
    else if (mo.kind === 'cobra') put(cobraCanvas(Math.floor(t * 4) % 2), 26, 12, 1);
    else if (mo.kind === 'vespa') put(vespaCanvas(Math.floor(t * 20) % 2), 14, 12, -10 + Math.sin(t * 4) * 3);
    else if (mo.b === 'javalirei') { put(javaliCanvas(Math.floor(t * 8) % 2, true), 22, 16, 2 + sh, 2.3); crown(x + (flip ? -15 : 15), y - 30); }
    else if (mo.b === 'rainhavespa') { put(vespaCanvas(Math.floor(t * 20) % 2), 14, 12, -14 + Math.sin(t * 3) * 3, 2.6); crown(x, y - 50 + Math.sin(t * 3) * 3); }
    else if (mo.b === 'sucuri') put(cobraCanvas(Math.floor(t * 4) % 2, true), 26, 12, 2, 2.4);
    else if (mo.b === 'anciao') { const s = 1.6; ctx.drawImage(ancianCanvas(mo.hp < mo.max / 2), x - 26 * s, y - 74 * s + 4, 52 * s, 76 * s); }
    ctx.globalAlpha = 1;
    if (mo.kind !== 'boss' && mo.hp < mo.max) { R(x - 8, y - 22, 16, 3, '#2a1010'); R(x - 7, y - 21, 14 * Math.max(0, mo.hp) / mo.max, 1, '#e8402a'); }
  }
  function drawCabana(bx, by) {
    const x = bx * T, y = by * T;
    R(x, y + 18, 80, 46, '#7a4a28');
    for (let k = 0; k < 6; k++) { R(x, y + 20 + k * 8, 80, 6, k % 2 ? '#8a5a32' : '#7a4a28'); R(x, y + 25 + k * 8, 80, 1, '#4a2e1a'); oval(x + 2, y + 23 + k * 8, 3, 3, '#a8783a'); oval(x + 78, y + 23 + k * 8, 3, 3, '#a8783a'); }
    poly([[x - 6, y + 22], [x + 40, y - 6], [x + 86, y + 22]], '#5a3420'); poly([[x - 2, y + 20], [x + 40, y - 2], [x + 82, y + 20]], '#7a4a2a');
    for (let k = 0; k < 5; k++) R(x + 6 + k * 15, y + 14 - Math.abs(k - 2) * 5, 10, 1, '#5a3420');
    R(x + 58, y - 2, 8, 14, '#6a6a6a'); R(x + 58, y - 2, 8, 2, '#8a8a8a');
    R(x + 33, y + 40, 14, 24, '#4a2a14'); R(x + 34, y + 41, 12, 23, '#6a3a1e'); R(x + 43, y + 52, 2, 2, '#f4c83a');
    R(x + 10, y + 34, 14, 12, '#3a2414'); R(x + 11, y + 35, 12, 10, nightF() > 0.3 ? '#ffd27a' : '#a8c8e8'); R(x + 16, y + 35, 1, 10, '#3a2414');
    R(x + 56, y + 34, 14, 12, '#3a2414'); R(x + 57, y + 35, 12, 10, nightF() > 0.3 ? '#ffd27a' : '#a8c8e8'); R(x + 62, y + 35, 1, 10, '#3a2414');
    // machado na porta e lenha empilhada
    R(x + 76, y + 50, 14, 14, '#6a4224'); for (let k = 0; k < 3; k++) for (let j = 0; j < 3; j++) oval(x + 79 + j * 4, y + 53 + k * 4, 2, 2, '#a8783a');
  }
  function drawFire(fx, fy, t) {
    for (const [dx, dy] of [[-6, 2], [5, 2], [-3, 4], [2, 4]]) R(fx + dx, fy + dy, 5, 2, '#6a3a1a');
    for (let k = 0; k < 4; k++) { const a = k / 4 * TAU; R(fx + Math.cos(a) * 7 - 1, fy + 3 + Math.sin(a) * 3, 3, 2, '#8a8a8a'); }
    for (let k = 0; k < 3; k++) disc(fx + (k - 1) * 3, fy - 2 - Math.abs(Math.sin(t * 9 + k)) * 3, 3 - Math.abs(k - 1), k === 1 ? '#ffd040' : '#ff7a1a');
    R(fx - 1, fy - 6 - ((t * 10) % 6), 1, 1, '#ffd040');
  }
  function mataEnts(m, ents, t) {
    if (!m.mata) return;
    if (m.id === 'mata') {
      ents.push({ y: 5 * T + 15, f: () => { drawCabana(3, 2); nameTag('Cabana do lenhador', 5 * T + 8, 2 * T - 8); } });
      const [fx, fy] = m.fire;
      ents.push({ y: fy * T + 12, f: () => { drawFire(fx * T + 8, fy * T + 8, t); for (const [dx, dy] of [[-22, 6], [22, 6], [0, 20]]) { R(fx * T + 8 + dx - 7, fy * T + 8 + dy, 14, 5, '#7a4a28'); R(fx * T + 8 + dx - 7, fy * T + 8 + dy, 14, 1, '#a8783a'); } } });
      ents.push({ y: 12 * T + 15, f: () => { const sx = 4 * T + 8, sy = 12 * T; R(sx - 1, sy + 2, 2, 13, '#5a3820'); R(sx - 22, sy - 6, 44, 11, '#8a5a32'); R(sx - 21, sy - 5, 42, 9, '#a8703a'); drawText('Mata do Vale', sx, sy - 1, '#3a1e0a', 7); } });
      return;
    }
    const set = mBroken(m), x0 = Math.floor(camX / T) - 3, x1 = Math.ceil((camX + VW) / T) + 3, y0 = Math.floor(camY / T) - 1, y1 = Math.ceil((camY + VH) / T) + 6;
    for (const [k, o] of Object.entries(m.wood)) {
      if (set.has(k)) continue;
      const [x, y] = k.split(',').map(Number); if (x < x0 || x > x1 || y < y0 || y > y1) continue;
      ents.push({ y: y * T + (o.kind === 'galho' || o.kind === 'forage' ? 12 : 15), f: () => drawMataObj(m, o, x, y, k) });
    }
    if (m.trail) { const [x, y] = m.trail.split(',').map(Number); ents.push({ y: y * T + 4, f: () => { oval(x * T + 8, y * T + 10, 8, 5, '#9a6a3a'); oval(x * T + 8, y * T + 9, 6, 3.5, '#b0804a'); R(x * T + 7, y * T - 8, 2, 14, '#5a3820'); poly([[x * T + 2, y * T - 10], [x * T + 12, y * T - 10], [x * T + 16, y * T - 6], [x * T + 12, y * T - 2], [x * T + 2, y * T - 2]], '#a8703a'); nameTag('Trilha', x * T + 8, y * T - 16); } }); }
    for (const mo of monsters) ents.push({ y: mo.y, f: () => drawMataMon(mo) });
  }
  // fogueiras colocadas na chacrinha
  function drawObj5(o, px, py) { if (o.k !== 'fogueira') return false; drawFire(px + 8, py + 9, performance.now() / 1000); return true; }
  let fireT = 0, fireCache = [];
  function farmFires() { const now = performance.now(); if (now - fireT < 1000) return fireCache; fireT = now; fireCache = []; for (const [k, v] of Object.entries(W.farm.t)) if (v && v.o && v.o.k === 'fogueira' && !k.startsWith('g:')) fireCache.push(k.split(',').map(Number)); return fireCache; }
  function mataLights(m, light) {
    if (m.id === 'farm') for (const [x, y] of farmFires()) light(x * T + 8, y * T + 6, 48, 0.6);
    if (m.id === 'mata') { light(m.fire[0] * T + 8, m.fire[1] * T + 6, 56, 0.65); light(4 * T + 8, 4 * T, 22, 0.4); light(8 * T + 8, 4 * T, 22, 0.4); }
    if (m.mata && m.wood) { const set = mBroken(m); for (const [k, o] of Object.entries(m.wood)) if (o.kind === 'dourada' && !set.has(k)) { const [x, y] = k.split(',').map(Number); light(x * T + 8, y * T - 20, 40, 0.35, '255,230,140'); } }
  }

  // ---------- ícones ----------
  function paintIcon7(id) {
    const wood = { mpinho: ['#d8b070', '#b88a4a', '#f0d098'], mcarvalho: ['#7a4a28', '#5a3418', '#9a6a3a'], mipe: ['#9a5a2a', '#7a3a1a', '#c08048'], madeiralei: ['#5a2a1a', '#3a180e', '#8a4a2a'], mdourada: ['#e8b830', '#b8861a', '#fff080'] }[id];
    if (wood) { for (const [x, y] of [[2, 8], [6, 4], [8, 9]]) { R(x, y, 7, 5, wood[0]); R(x, y + 4, 7, 1, wood[1]); oval(x + 7, y + 2.5, 1.5, 2.5, wood[2]); R(x + 2, y + 2, 3, 1, wood[1]); } if (id === 'mdourada') { R(4, 5, 1, 1, '#ffffff'); R(12, 10, 1, 1, '#ffffff'); } return true; }
    switch (id) {
      case 'melsilvestre': R(4, 5, 8, 10, '#c88a1a'); R(5, 6, 6, 8, '#f4b83a'); R(4, 3, 8, 2, '#8a5a2a'); R(6, 8, 2, 4, '#ffe080'); return true;
      case 'morchela': R(7, 11, 2, 4, '#e8d8b0'); oval(8, 7, 3.5, 5, '#8a6a3a'); for (const [x, y] of [[6, 5], [9, 7], [7, 9], [9, 4]]) R(x, y, 1, 1, '#5a3a1a'); return true;
      case 'framboesa': for (const [x, y] of [[6, 7], [9, 7], [7, 9], [10, 10], [5, 10], [8, 12]]) disc(x, y, 2, '#d8204a'); R(7, 3, 2, 3, '#3a8a2a'); R(5, 4, 6, 1, '#4aa83a'); return true;
      case 'castanha': oval(8, 10, 5, 4, '#7a3a1a'); poly([[3, 9], [8, 3], [13, 9]], '#7a3a1a'); R(5, 11, 6, 2, '#c8a070'); R(6, 6, 2, 2, '#a85a2a'); return true;
      case 'pinha': oval(8, 9, 4, 6, '#8a5a2a'); for (let y = 4; y < 15; y += 2) R(5 + (y % 4 ? 1 : 0), y, 6, 1, '#5a3418'); R(7, 1, 2, 3, '#4a8a3a'); return true;
      case 'cogumelorei': R(6, 9, 4, 6, '#f4ecd8'); oval(8, 8, 7, 4, '#b0281a'); for (const [x, y] of [[4, 7], [8, 6], [11, 8]]) disc(x, y, 1.2, '#ffffff'); R(5, 3, 6, 2, '#f4c83a'); R(6, 1, 1, 2, '#f4c83a'); R(9, 1, 1, 2, '#f4c83a'); return true;
      case 'carnesuina': poly([[3, 6], [10, 3], [14, 7], [12, 13], [5, 13], [2, 10]], '#e88a8a'); poly([[4, 7], [10, 4], [12, 7], [10, 11], [5, 11]], '#f4aaaa'); R(5, 8, 6, 1, '#fff0f0'); R(7, 10, 4, 1, '#fff0f0'); R(12, 10, 3, 3, '#f4ecd8'); return true;
      case 'lombo': oval(8, 12, 7, 2.5, '#e8e8f0'); oval(8, 9, 5.5, 3.5, '#8a4a20'); oval(7, 8, 4, 2.2, '#b06a30'); for (const x of [5, 8, 11]) R(x, 7, 1, 4, '#5a2a10'); R(12, 5, 1, 3, '#5aa83a'); return true;
      case 'couro': poly([[3, 4], [13, 3], [14, 12], [8, 14], [2, 12]], '#a8683a'); R(5, 6, 6, 1, '#c88a5a'); R(4, 10, 8, 1, '#8a4a2a'); return true;
      case 'escama': for (const [x, y] of [[5, 5], [10, 5], [7, 9], [12, 9], [4, 11]]) { oval(x, y, 3, 2.5, '#4a9a3a'); R(x - 1, y - 1, 2, 1, '#8ad86a'); } return true;
      case 'ferrao': poly([[8, 1], [11, 12], [5, 12]], '#1a1a1a'); R(5, 12, 6, 3, '#f4c020'); R(7, 4, 1, 4, '#6a6a6a'); return true;
      case 'cogumeloassado': R(2, 13, 12, 1, '#c8a06a'); for (const x of [4, 9]) { R(x + 1, 8, 2, 4, '#e8d0a0'); oval(x + 2, 7, 3, 2.5, '#6a3a1a'); } return true;
      case 'castanhaassada': R(3, 10, 10, 4, '#3a2a1a'); for (const [x, y] of [[5, 8], [8, 7], [11, 8], [7, 10]]) { oval(x, y, 2.2, 2, '#5a2a10'); R(x - 1, y - 1, 2, 1, '#e8c890'); } return true;
      case 'fogueira': for (const [dx, dy] of [[2, 12], [8, 12], [4, 13]]) R(dx, dy, 6, 2, '#6a3a1a'); disc(8, 9, 3.5, '#ff7a1a'); disc(8, 8, 2, '#ffd040'); R(7, 3, 2, 3, '#ff9a2a'); return true;
      case 'xadrezlenhador': poly([[4, 3], [12, 3], [14, 7], [12, 8], [12, 15], [4, 15], [4, 8], [2, 7]], '#c83a2a'); for (const x of [5, 8, 11]) R(x, 3, 1, 12, '#1a1a1a'); for (const y of [6, 10, 13]) R(4, y, 8, 1, '#1a1a1a'); return true;
      case 'chapeuapicultor': oval(8, 11, 7, 2.5, '#e8e0c8'); oval(8, 8, 4.5, 4, '#f4f0e0'); ctx.globalAlpha = 0.6; R(2, 11, 12, 4, '#2a2a2a'); ctx.globalAlpha = 1; for (let x = 3; x < 14; x += 2) R(x, 11, 1, 4, '#1a1a1a'); return true;
      case 'botasmata': for (const ox of [0, 6]) { R(2 + ox, 3, 4, 8, '#4a6a2a'); R(3 + ox, 3, 2, 7, '#6a8a3a'); R(2 + ox, 11, 6, 3, '#4a6a2a'); R(2 + ox, 13, 6, 1, '#2a1a0a'); R(2 + ox, 5, 4, 1, '#a8783a'); } return true;
    }
    return false;
  }

  // ---------- conquistas ----------
  const allStats = () => [P, ...Object.values(W.players || {}).filter(p => p && p.uid !== P.uid)].map(p => (p && p.stats) || {});
  ACH.push(
    ['lenhadores', 'Lenhadores', 'Juntos, derrubar 500 árvores.', () => allStats().reduce((a, s) => a + (s.trees || 0), 0) >= 500],
    ['coracaomata', 'Até o coração da mata', 'Chegar à última clareira da Mata do Vale.', () => allStats().some(s => (s.mata || 0) >= MATA_N)],
    ['guardioes', 'Guardiões da floresta', 'Vencer os 4 guardiões da mata.', () => Object.keys(FBOSSES).every(n => W.meta.fbosses && W.meta.fbosses[n])],
  );
