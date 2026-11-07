  // ================= mapas =================
  // tipos de chão
  const G = { GRASS: 0, DIRT: 1, WATER: 2, SAND: 3, WOOD: 4, CAVE: 5, ROCKWALL: 6, VOID: 7, COBBLE: 8, FOREST: 9, WALL: 10, BRIDGE: 11, CARPET: 12, FLOWERS: 13, CLIFF: 14, STRAW: 15, TILE: 16 };
  const SOLID_G = new Set([G.WATER, G.ROCKWALL, G.VOID, G.FOREST, G.WALL, G.CLIFF]);
  function newMap(id, w, h, fill, opts = {}) {
    const m = { id, w, h, g: new Uint8Array(w * h).fill(fill), solid: new Uint8Array(w * h), sprites: [], warps: [], spots: {}, outdoor: true, water: 'pond', ...opts };
    m.at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? G.VOID : m.g[y * w + x]);
    m.set = (x, y, v) => { if (x >= 0 && y >= 0 && x < w && y < h) m.g[y * w + x] = v; };
    m.rect = (x0, y0, x1, y1, v) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) m.set(x, y, v); };
    return m;
  }
  function sprite(m, type, x, y, w, h, extra = {}) {
    const s = { type, x, y, w, h, ...extra };
    m.sprites.push(s);
    if (!extra.walk) for (let yy = y + (extra.solidFrom || 0); yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) m.solid[yy * m.w + xx] = 1;
    return s;
  }
  const spot = (m, x, y, data) => { m.spots[x + ',' + y] = data; };
  function finalize(m) {
    for (let i = 0; i < m.w * m.h; i++) if (SOLID_G.has(m.g[i])) m.solid[i] = 1;
    for (const w of m.warps) for (let y = w.y; y < w.y + (w.h || 1); y++) for (let x = w.x; x < w.x + (w.w || 1); x++) m.solid[y * m.w + x] = 0;
    return m;
  }

  function buildFarm() {
    const m = newMap('farm', 48, 40, G.GRASS, { name: 'Chacrinha', water: 'pond' });
    m.rect(0, 0, 47, 1, G.FOREST); m.rect(0, 38, 47, 39, G.FOREST); m.rect(0, 0, 1, 39, G.FOREST); m.rect(46, 0, 47, 39, G.FOREST);
    m.rect(46, 18, 47, 20, G.DIRT);
    m.rect(9, 7, 9, 10, G.DIRT); m.rect(9, 10, 47, 10, G.GRASS);
    m.rect(9, 19, 47, 19, G.DIRT); m.rect(9, 10, 9, 19, G.DIRT);
    const r = srand(42);
    for (let y = 0; y < 40; y++) for (let x = 0; x < 48; x++) {
      const dx = (x - 38) / 5.5, dy = (y - 30) / 3.8;
      if (dx * dx + dy * dy < 1) m.set(x, y, G.WATER);
    }
    for (let k = 0; k < 40; k++) { const x = 3 + Math.floor(r() * 42), y = 3 + Math.floor(r() * 34); if (m.at(x, y) === G.GRASS && (x < 5 || y < 9 || y > 34 || x > 42)) m.set(x, y, G.FLOWERS); }
    sprite(m, 'house', 6, 2, 7, 5, { door: [9, 6] });
    m.solid[6 * m.w + 9] = 0;
    m.warps.push({ x: 9, y: 6, to: 'house', tx: 7, ty: 9, dir: 1 });
    sprite(m, 'bin', 12, 6, 2, 1);
    spot(m, 12, 6, { kind: 'bin' }); spot(m, 13, 6, { kind: 'bin' });
    sprite(m, 'mailbox', 14, 6, 1, 1); spot(m, 14, 6, { kind: 'mail' });
    sprite(m, 'minecart', 16, 6, 1, 1); spot(m, 16, 6, { kind: 'minecart' });
    m.warps.push({ x: 47, y: 18, h: 3, to: 'town', tx: 1, ty: 28, dir: 3 });
    return finalize(m);
  }
  // ================= a vila: 80×56, em bairros =================
  // [x, y, largura, altura, coluna da porta]; a porta fica na linha de baixo do prédio
  const VILA = {
    w: 80, h: 56, rua: 27, av: 39, ruaN: 15, ruaS: 45,
    store: [4, 20, 9, 6, 8], atelie: [15, 21, 5, 5, 17], moveis: [22, 21, 5, 5, 24],
    smith: [32, 8, 6, 5, 35], carpentry: [43, 8, 6, 5, 45], cc: [52, 8, 8, 5, 55], museum: [62, 8, 6, 5, 64],
    bar: [61, 20, 8, 5, 64], ranch: [5, 31, 6, 5, 7],
    padaria: [4, 9, 5, 5, 6], flores: [11, 9, 5, 5, 13], petshop: [18, 9, 5, 5, 20], clinica: [52, 20, 6, 5, 54], biblioteca: [70, 8, 6, 5, 72],
    booth: { x: 33, y: 31 }, board: [33, 21], stall: [44, 21], fonte: [39, 32], coreto: [44, 31], cart: [42, 4], pier: [20, 49],
    // casas dos moradores (casinhas 5×4, porta na 4ª coluna)
    casas: { nena: [51, 31, '#c85a3a'], davi: [58, 31, '#3a6a9a'], helena: [65, 31, '#7a4a8a'], juca: [72, 31, '#c8a03a'], rosa: [51, 40, '#4a8a4a'], bia: [58, 40, '#d84a8a'], tonico: [65, 40, '#8a5a32'], cida: [72, 40, '#d8763a'] },
  };
  // prédio com porta, entrada e calçadinha até a rua
  function predio(m, type, [x, y, w, h, dx], to, ate, extra = {}) {
    sprite(m, type, x, y, w, h, extra);
    const dy = y + h - 1; m.solid[dy * m.w + dx] = 0;
    if (to) m.warps.push({ x: dx, y: dy, to, tx: extra.tx != null ? extra.tx : 6, ty: extra.ty != null ? extra.ty : 7, dir: extra.dir != null ? extra.dir : 0, lar: extra.lar });
    if (ate) m.rect(dx, dy + 1, dx, ate, G.COBBLE);
  }
  function buildTown() {
    const V = VILA, m = newMap('town', V.w, V.h, G.GRASS, { name: 'Vila', water: 'river' });
    const W2 = V.w - 1, H2 = V.h - 1;
    m.rect(0, 0, W2, 2, G.FOREST); m.rect(W2, 0, W2, H2, G.FOREST); m.rect(0, 0, 0, H2, G.FOREST); m.rect(0, H2, W2, H2, G.FOREST);
    // estrada da mina ao norte
    m.rect(V.av - 2, 0, V.av + 4, 2, G.CLIFF); m.rect(V.av, 1, V.av + 2, 2, G.DIRT);
    // rio, beira-rio e ponte ao sul
    m.rect(1, 50, W2 - 1, 53, G.WATER); m.rect(1, 49, W2 - 1, 49, G.SAND); m.rect(1, 54, W2 - 1, 54, G.SAND);
    m.rect(V.av, 49, V.av + 2, 54, G.BRIDGE); m.rect(V.av, H2, V.av + 2, H2, G.SAND);
    m.rect(V.pier[0], V.pier[1], V.pier[0] + 1, V.pier[1] + 2, G.BRIDGE);
    // ruas: principal (leste-oeste), avenida (norte-sul), rua de cima e rua de baixo
    m.rect(0, V.rua, W2, V.rua + 2, G.COBBLE); m.rect(V.av, 3, V.av + 2, 48, G.COBBLE);
    m.rect(3, V.ruaN, W2 - 2, V.ruaN + 1, G.COBBLE); m.rect(3, V.ruaS, W2 - 2, V.ruaS + 1, G.COBBLE);
    m.rect(50, 36, W2 - 2, 37, G.COBBLE); m.rect(49, 31, 49, 46, G.COBBLE);
    // praça central
    m.rect(31, 19, 49, 37, G.COBBLE);
    const r = srand(7);
    for (let k = 0; k < 160; k++) { const x = 1 + Math.floor(r() * (W2 - 1)), y = 3 + Math.floor(r() * 44); if (m.at(x, y) === G.GRASS) m.set(x, y, G.FLOWERS); }
    for (const [x0, y0, x1, y1] of [[32, 34, 34, 36], [46, 34, 48, 36], [32, 20, 33, 20], [47, 20, 48, 20]]) m.rect(x0, y0, x1, y1, G.FLOWERS);
    // comércio (norte da rua principal)
    predio(m, 'store', V.store, 'store', V.rua - 1, { tx: 7, ty: 8, dir: 1 });
    predio(m, 'atelie', V.atelie, 'atelie', V.rua - 1);
    predio(m, 'moveis', V.moveis, 'moveis', V.rua - 1);
    // ofícios, centro comunitário e museu (rua de cima)
    predio(m, 'smith', V.smith, 'smith', V.ruaN - 1, { dir: 1 });
    predio(m, 'carpentry', V.carpentry, 'carpentry', V.ruaN - 1);
    predio(m, 'ccbuilding', V.cc, 'cc', V.ruaN - 1, { tx: 11, ty: 10 });
    predio(m, 'museumb', V.museum, 'museum', V.ruaN - 1, { tx: 9, ty: 9 });
    // bar e rancho
    predio(m, 'bar', V.bar, 'bar', V.rua - 1, { tx: 8, ty: 8 });
    predio(m, 'ranch', V.ranch, 'ranch', V.ruaS - 1);
    // casas dos moradores
    for (const [id, [x, y, col]] of Object.entries(V.casas)) predio(m, 'cottage', [x, y, 5, 4, x + 3], 'lar_' + id, y < 36 ? 35 : V.ruaS - 1, { col, tx: 5, ty: 6, lar: id });
    // praça: fonte, coreto, quadro, barraca da Cida, bancos
    sprite(m, 'fountain', V.fonte[0], V.fonte[1], 3, 3);
    sprite(m, 'coreto', V.coreto[0], V.coreto[1], 5, 4);
    sprite(m, 'board', V.board[0], V.board[1], 2, 2, { solidFrom: 1 }); spot(m, V.board[0], V.board[1] + 1, { kind: 'board' }); spot(m, V.board[0] + 1, V.board[1] + 1, { kind: 'board' });
    sprite(m, 'marketstall', V.stall[0], V.stall[1], 4, 2);
    for (let x = V.stall[0]; x < V.stall[0] + 4; x++) spot(m, x, V.stall[1] + 1, { kind: 'shop', who: 'cida' });
    for (const [x, y] of [[31, 24], [47, 24], [36, 36], [43, 36], [24, 47], [56, 47], [70, 22]]) sprite(m, 'bench', x, y, 2, 1);
    sprite(m, 'minecart', V.cart[0], V.cart[1], 1, 1); spot(m, V.cart[0], V.cart[1], { kind: 'minecart' });
    // árvores
    for (const [x, y] of [[2, 6], [29, 7], [50, 6], [77, 6], [29, 22], [2, 23], [77, 22], [73, 21], [75, 25], [14, 34], [20, 37], [27, 33], [27, 40], [2, 38], [12, 40], [33, 44], [47, 41], [77, 34], [77, 43], [6, 47], [16, 47], [32, 48], [46, 48], [62, 48], [72, 48], [23, 12], [27, 13]]) sprite(m, 'tree', x, y, 1, 1, { big: true });
    // postes de luz
    m.lanterns = [[3, 26], [13, 26], [27, 26], [30, 14], [48, 14], [61, 14], [76, 14], [50, 26], [70, 26], [31, 30], [48, 30], [37, 36], [44, 26], [50, 35], [76, 35], [12, 44], [28, 44], [50, 44], [66, 44], [22, 48]];
    // saídas: chacrinha (oeste), mata (leste), mina (norte), praia (sul)
    m.warps.push({ x: 0, y: V.rua, h: 3, to: 'farm', tx: 46, ty: 19, dir: 2 });
    m.warps.push({ x: W2, y: V.rua, h: 3, to: 'mata', tx: 2, ty: 9, dir: 3 });
    m.warps.push({ x: V.av, y: 0, w: 3, to: 'minetop', tx: 8, ty: 10, dir: 0 });
    m.warps.push({ x: V.av, y: H2, w: 3, to: 'beach', tx: 20, ty: 1, dir: 1 });
    return finalize(m);
  }

  function buildHouse() {
    const m = newMap('house', 16, 11, G.WOOD, { name: 'Casa', outdoor: false });
    m.rect(0, 0, 15, 1, G.WALL); m.rect(0, 0, 0, 10, G.WALL); m.rect(15, 0, 15, 10, G.WALL); m.rect(0, 10, 15, 10, G.WALL);
    m.rect(4, 5, 8, 8, G.CARPET);
    m.rect(10, 2, 14, 9, G.TILE);
    m.set(7, 10, G.WOOD);
    sprite(m, 'bed', 1, 2, 3, 3);
    for (let x = 1; x <= 3; x++) for (let y = 2; y <= 4; y++) spot(m, x, y, { kind: 'bed' });
    sprite(m, 'tv', 5, 2, 2, 1); spot(m, 5, 2, { kind: 'tv' }); spot(m, 6, 2, { kind: 'tv' });
    sprite(m, 'plant', 8, 2, 1, 1);
    sprite(m, 'fridge', 10, 2, 1, 1); spot(m, 10, 2, { kind: 'fridge' });
    sprite(m, 'stove', 11, 2, 2, 1); spot(m, 11, 2, { kind: 'stove' }); spot(m, 12, 2, { kind: 'stove' });
    sprite(m, 'sink', 13, 2, 2, 1); spot(m, 13, 2, { kind: 'stove' }); spot(m, 14, 2, { kind: 'stove' });
    sprite(m, 'table', 11, 5, 2, 2);
    sprite(m, 'plant', 1, 8, 1, 1);
    m.warps.push({ x: 7, y: 10, to: 'farm', tx: 9, ty: 7, dir: 1 });
    return finalize(m);
  }
  function buildStore() {
    const m = newMap('store', 14, 10, G.WOOD, { name: 'Armazém', outdoor: false });
    m.rect(0, 0, 13, 1, G.WALL); m.rect(0, 0, 0, 9, G.WALL); m.rect(13, 0, 13, 9, G.WALL); m.rect(0, 9, 13, 9, G.WALL);
    m.set(7, 9, G.WOOD);
    sprite(m, 'shelf', 1, 1, 3, 2); sprite(m, 'shelf', 10, 1, 3, 2);
    sprite(m, 'counter', 4, 3, 6, 1);
    for (let x = 4; x <= 9; x++) spot(m, x, 3, { kind: 'shop', who: 'pedro' });
    sprite(m, 'crates', 1, 6, 2, 2); sprite(m, 'crates', 11, 6, 2, 2);
    m.warps.push({ x: 7, y: 9, to: 'town', tx: 8, ty: 26, dir: 1 });
    return finalize(m);
  }
  function buildSmith() {
    const m = newMap('smith', 12, 9, G.COBBLE, { name: 'Ferreiro', outdoor: false });
    m.rect(0, 0, 11, 1, G.WALL); m.rect(0, 0, 0, 8, G.WALL); m.rect(11, 0, 11, 8, G.WALL); m.rect(0, 8, 11, 8, G.WALL);
    m.set(6, 8, G.COBBLE);
    sprite(m, 'forge', 1, 1, 2, 2); sprite(m, 'anvil', 9, 2, 1, 1);
    sprite(m, 'counter', 3, 3, 6, 1);
    for (let x = 3; x <= 8; x++) spot(m, x, 3, { kind: 'shop', who: 'claudio' });
    m.warps.push({ x: 6, y: 8, to: 'town', tx: 35, ty: 13, dir: 1 });
    return finalize(m);
  }
  function buildMineTop() {
    const m = newMap('minetop', 16, 12, G.CAVE, { name: 'Mina', outdoor: false, water: 'mine', cave: true });
    m.rect(0, 0, 15, 1, G.ROCKWALL); m.rect(0, 0, 0, 11, G.ROCKWALL); m.rect(15, 0, 15, 11, G.ROCKWALL); m.rect(0, 11, 15, 11, G.ROCKWALL);
    m.set(8, 11, G.CAVE);
    m.rect(1, 6, 4, 9, G.WATER);
    sprite(m, 'ladder', 8, 3, 1, 1, { walk: true }); spot(m, 8, 3, { kind: 'down', floor: 1 });
    sprite(m, 'elevator', 11, 2, 2, 2); spot(m, 11, 3, { kind: 'elevator' }); spot(m, 12, 3, { kind: 'elevator' });
    sprite(m, 'cart', 5, 2, 2, 1);
    sprite(m, 'minecart', 13, 7, 1, 1); spot(m, 13, 7, { kind: 'minecart' });
    m.warps.push({ x: 8, y: 11, to: 'town', tx: 40, ty: 3, dir: 1 });
    m.lanterns = [[3, 1], [7, 1], [14, 1]];
    return finalize(m);
  }
  // andares da mina: gerados pelo andar e pelo dia (os dois veem o mesmo andar)
  function mineTier(n) { return n < 40 ? 0 : n < 80 ? 1 : 2; }
  function buildMineFloor(n, day) {
    const W = 26, H = 18, r = srand(n * 7919 + day * 104729);
    const m = newMap('mine' + n, W, H, G.CAVE, { name: `Mina · andar ${n}`, outdoor: false, water: 'mine', cave: true, floor: n, tier: mineTier(n) });
    m.rect(0, 0, W - 1, 0, G.ROCKWALL); m.rect(0, H - 1, W - 1, H - 1, G.ROCKWALL); m.rect(0, 0, 0, H - 1, G.ROCKWALL); m.rect(W - 1, 0, W - 1, H - 1, G.ROCKWALL);
    for (let k = 0; k < 7; k++) { const cx = 2 + Math.floor(r() * (W - 4)), cy = 2 + Math.floor(r() * (H - 4)), rw = 1 + Math.floor(r() * 3), rh = 1 + Math.floor(r() * 2); m.rect(cx, cy, Math.min(W - 2, cx + rw), Math.min(H - 2, cy + rh), G.ROCKWALL); }
    if (n % 10 === 3 || n % 10 === 8) { const cx = 3 + Math.floor(r() * (W - 9)), cy = 3 + Math.floor(r() * (H - 8)); for (let y = cy; y < cy + 3; y++) for (let x = cx; x < cx + 5; x++) m.set(x, y, G.WATER); }
    let sx, sy;
    do { sx = 2 + Math.floor(r() * (W - 4)); sy = 2 + Math.floor(r() * (H - 4)); } while (m.at(sx, sy) !== G.CAVE);
    m.start = [sx, sy + 1];
    sprite(m, 'ladderup', sx, sy, 1, 1, { walk: true }); spot(m, sx, sy, { kind: 'up' });
    for (let dy = -1; dy <= 2; dy++) for (let dx = -1; dx <= 1; dx++) if (m.at(sx + dx, sy + dy) === G.ROCKWALL && !(sx + dx <= 0 || sy + dy <= 0 || sx + dx >= W - 1 || sy + dy >= H - 1)) m.set(sx + dx, sy + dy, G.CAVE);
    m.rocks = {};
    const tier = m.tier;
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      if (m.at(x, y) !== G.CAVE || Math.abs(x - sx) + Math.abs(y - sy) < 3) continue;
      if (r() > 0.42) continue;
      const q = r();
      let kind = 'stone';
      // ferro: bem pouco do andar 25 ao 39; do 40 para baixo é comum
      if (tier === 0) kind = q < 0.1 ? 'cobre' : q < 0.15 ? 'coal' : n >= 25 && q < 0.165 ? 'ferro' : 'stone';
      else if (tier === 1) kind = q < 0.1 ? 'ferro' : q < 0.15 ? 'cobre' : q < 0.2 ? 'coal' : 'stone';
      else kind = q < 0.08 ? 'ouro' : q < 0.14 ? 'ferro' : q < 0.2 ? 'coal' : 'stone';
      const g = r();
      if (g < 0.035) kind = 'gem:quartzo';
      else if (g < 0.05 && n > 10) kind = 'gem:ametista';
      else if (g < 0.065) kind = 'gem:topazio';
      else if (g < 0.072 && n > 30) kind = 'gem:esmeralda';
      else if (g < 0.075 && n > 50) kind = 'gem:diamante';
      m.rocks[x + ',' + y] = { kind, hp: kind === 'stone' ? 1 : kind.startsWith('gem') ? 2 : 3, v: Math.floor(r() * 4) };
    }
    if (n % 10 === 0) { let cx = Math.floor(W / 2), cy = Math.floor(H / 2); while (m.at(cx, cy) !== G.CAVE || m.rocks[cx + ',' + cy] || (cx === sx && cy === sy)) { cx = 2 + Math.floor(r() * (W - 4)); cy = 2 + Math.floor(r() * (H - 4)); } delete m.rocks[cx + ',' + cy]; m.chest = cx + ',' + cy; sprite(m, 'minechest', cx, cy, 1, 1); spot(m, cx, cy, { kind: 'mchest', floor: n }); }
    // lampiões nas paredes
    m.lanterns = [];
    for (let k = 0; k < 40 && m.lanterns.length < 4; k++) { const x = 1 + Math.floor(r() * (W - 2)), y = Math.floor(r() * (H - 2)); if (m.at(x, y) === G.ROCKWALL && m.at(x, y + 1) === G.CAVE && !m.lanterns.some(([a, b]) => Math.abs(a - x) + Math.abs(b - y) < 5)) m.lanterns.push([x, y]); }
    m.total = Object.keys(m.rocks).length;
    m.monSeed = r() * 1e9;
    return finalize(m);
  }
  // lojinhas com balcão: a pessoa da loja fica atrás do balcão (linha 2) e o balcão na linha 3
  function shopRoom(id, name, w, h, floor, who, deco) {
    const m = newMap(id, w, h, floor, { name, outdoor: false });
    m.rect(0, 0, w - 1, 1, G.WALL); m.rect(0, 0, 0, h - 1, G.WALL); m.rect(w - 1, 0, w - 1, h - 1, G.WALL); m.rect(0, h - 1, w - 1, h - 1, G.WALL);
    const dx = Math.floor(w / 2); m.set(dx, h - 1, floor);
    sprite(m, 'counter', 3, 3, 6, 1);
    for (let x = 3; x <= 8; x++) spot(m, x, 3, { kind: 'shop', who });
    deco(m);
    return m;
  }
  function buildAtelie() {
    const m = shopRoom('atelie', 'Ateliê da Bia', 12, 9, G.WOOD, 'bia', () => {});
    // espelho, arara de roupas e manequins (desenhados em v_extra.js)
    for (const [x, y] of [[1, 2], [9, 2], [10, 2], [1, 5], [10, 5]]) m.solid[y * m.w + x] = 1;
    m.warps.push({ x: 6, y: 8, to: 'town', tx: 17, ty: 26, dir: 1 });
    return finalize(m);
  }
  function buildMoveis() {
    const m = shopRoom('moveis', 'Marcenaria do Tonico', 12, 9, G.WOOD, 'tonico', m => { sprite(m, 'lumber', 1, 6, 2, 2); });
    // peças do mostruário (desenhadas em zz_casa.js)
    for (const [x, y] of [[1, 5], [9, 2], [10, 2], [1, 2], [10, 5]]) m.solid[y * m.w + x] = 1;
    m.warps.push({ x: 6, y: 8, to: 'town', tx: 24, ty: 26, dir: 1 });
    return finalize(m);
  }
  function buildCarpentry() {
    const m = shopRoom('carpentry', 'Carpintaria', 12, 9, G.WOOD, 'rosa', m => { sprite(m, 'lumber', 9, 2, 2, 2); sprite(m, 'crates', 1, 5, 2, 2); sprite(m, 'plant', 10, 6, 1, 1); });
    m.warps.push({ x: 6, y: 8, to: 'town', tx: 45, ty: 13, dir: 1 });
    return finalize(m);
  }
  function buildRanch() {
    const m = shopRoom('ranch', 'Rancho da Marta', 12, 9, G.STRAW, 'marta', m => { sprite(m, 'haybale', 9, 2, 2, 1); sprite(m, 'haybale', 1, 5, 2, 1); sprite(m, 'haybale', 9, 6, 2, 1); });
    m.warps.push({ x: 6, y: 8, to: 'town', tx: 7, ty: 36, dir: 1 }); m.woodWall = true;
    return finalize(m);
  }
  function buildBar() {
    const m = newMap('bar', 16, 10, G.WOOD, { name: 'Bar da Lia', outdoor: false });
    m.rect(0, 0, 15, 1, G.WALL); m.rect(0, 0, 0, 9, G.WALL); m.rect(15, 0, 15, 9, G.WALL); m.rect(0, 9, 15, 9, G.WALL);
    m.set(8, 9, G.WOOD);
    m.rect(10, 3, 14, 8, G.CARPET);
    sprite(m, 'barshelf', 1, 1, 8, 1);
    sprite(m, 'counter', 2, 3, 7, 1);
    for (let x = 2; x <= 8; x++) spot(m, x, 3, { kind: 'shop', who: 'lia' });
    sprite(m, 'bartable', 12, 4, 2, 2); sprite(m, 'bartable', 12, 7, 2, 1);
    sprite(m, 'barrels', 1, 6, 2, 2);
    sprite(m, 'plant', 14, 2, 1, 1);
    m.warps.push({ x: 8, y: 9, to: 'town', tx: 64, ty: 25, dir: 1 });
    return finalize(m);
  }
  function buildFishShop() {
    const m = shopRoom('fishshop', 'Peixaria do Zé', 12, 9, G.WOOD, 'ze', m => { sprite(m, 'fishtank', 9, 2, 2, 1); sprite(m, 'barrels', 1, 5, 2, 2); sprite(m, 'nets', 10, 5, 1, 2); });
    m.warps.push({ x: 6, y: 8, to: 'beach', tx: 27, ty: 10, dir: 1 });
    return finalize(m);
  }
  function buildBeach() {
    const m = newMap('beach', 40, 22, G.SAND, { name: 'Praia', water: 'ocean' });
    m.rect(0, 0, 39, 0, G.FOREST); m.rect(0, 0, 0, 13, G.FOREST); m.rect(39, 0, 39, 13, G.FOREST);
    m.rect(19, 0, 21, 0, G.SAND);
    m.rect(1, 1, 18, 2, G.GRASS); m.rect(22, 1, 38, 2, G.GRASS);
    for (let x = 0; x < 40; x++) { const top = 15 + Math.round(Math.sin(x * 0.45) * 0.8); m.rect(x, top, x, 21, G.WATER); }
    m.rect(8, 11, 9, 12, G.WATER);
    m.rect(27, 12, 28, 19, G.BRIDGE);
    sprite(m, 'fishshop', 24, 5, 7, 5); m.solid[9 * m.w + 27] = 0;
    m.warps.push({ x: 27, y: 9, to: 'fishshop', tx: 6, ty: 7, dir: 0 });
    sprite(m, 'palm', 4, 4, 1, 1); sprite(m, 'palm', 35, 6, 1, 1); sprite(m, 'palm', 15, 5, 1, 1);
    sprite(m, 'driftwood', 33, 12, 2, 1);
    sprite(m, 'minecart', 17, 2, 1, 1); spot(m, 17, 2, { kind: 'minecart' });
    m.warps.push({ x: 19, y: 0, w: 3, to: 'town', tx: 40, ty: 54, dir: 0 });
    return finalize(m);
  }
  // galinheiro e celeiro por dentro (o tamanho cresce com o nível)
  function buildAnimalHouse(id, b) {
    const coop = b.type === 'coop', w = (coop ? 10 : 12) + 4 * (b.lv - 1), h = coop ? 9 : 10;
    const m = newMap('b:' + id, w, h, G.STRAW, { name: BUILDS[b.type].names[b.lv - 1], outdoor: false, gkey: b.type + b.lv, bid: id, woodWall: true });
    m.rect(0, 0, w - 1, 1, G.WALL); m.rect(0, 0, 0, h - 1, G.WALL); m.rect(w - 1, 0, w - 1, h - 1, G.WALL); m.rect(0, h - 1, w - 1, h - 1, G.WALL);
    const door = 2; m.set(door, h - 1, G.STRAW);
    sprite(m, 'hopper', 1, 2, 1, 1); spot(m, 1, 2, { kind: 'hopper' });
    for (let i = 0; i < bCap(b); i++) { sprite(m, 'trough', 3 + i, 2, 1, 1, { i }); spot(m, 3 + i, 2, { kind: 'trough', i }); }
    sprite(m, 'haybale', w - 3, h - 3, 2, 1);
    const B = BUILDS[b.type];
    m.warps.push({ x: door, y: h - 1, to: 'farm', tx: b.x + B.door, ty: b.y + B.h, dir: 1 });
    m.entry = [door, h - 2];
    m.floorTiles = [];
    for (let y = 3; y < h - 1; y++) for (let x = 1; x < w - 1; x++) m.floorTiles.push([x, y]);
    finalize(m);
    m.floorTiles = m.floorTiles.filter(([x, y]) => !m.solid[y * w + x] && !(x === door && y === h - 2));
    return m;
  }
  // estufa por dentro: canteiros de terra no meio, chão de pedra em volta e uma pia para encher o regador
  function buildGreenhouse(id, b) {
    const w = 16, h = 13;
    const m = newMap('b:' + id, w, h, G.COBBLE, { name: 'Estufa', outdoor: false, gkey: 'estufa', bid: id, gh: true });
    m.rect(0, 0, w - 1, 1, G.WALL); m.rect(0, 0, 0, h - 1, G.WALL); m.rect(w - 1, 0, w - 1, h - 1, G.WALL); m.rect(0, h - 1, w - 1, h - 1, G.WALL);
    m.rect(2, 3, 13, 9, G.DIRT);
    const door = 7; m.set(door, h - 1, G.COBBLE);
    sprite(m, 'basin', 14, 10, 1, 1); spot(m, 14, 10, { kind: 'basin' });
    sprite(m, 'plant', 1, 2, 1, 1); sprite(m, 'plant', 14, 2, 1, 1); sprite(m, 'plant', 1, 10, 1, 1);
    m.warps.push({ x: door, y: h - 1, to: 'farm', tx: b.x + BUILDS.greenhouse.door, ty: b.y + BUILDS.greenhouse.h, dir: 1 });
    m.entry = [door, h - 2];
    return finalize(m);
  }
  // Centro Comunitário: altar no meio e uma placa para cada sala
  function buildCC() {
    const m = newMap('cc', 22, 12, G.WOOD, { name: 'Centro Comunitário', outdoor: false });
    m.rect(0, 0, 21, 1, G.WALL); m.rect(0, 0, 0, 11, G.WALL); m.rect(21, 0, 21, 11, G.WALL); m.rect(0, 11, 21, 11, G.WALL);
    m.set(11, 11, G.WOOD);
    m.rect(8, 4, 13, 8, G.CARPET);
    sprite(m, 'ccaltar', 10, 5, 2, 2); for (const [x, y] of [[10, 5], [11, 5], [10, 6], [11, 6]]) spot(m, x, y, { kind: 'cc' });
    const pl = [[2, 2], [6, 2], [15, 2], [19, 2], [2, 8], [19, 8]];
    pl.forEach(([x, y], i) => { sprite(m, 'ccplaque', x, y, 1, 1, { room: i }); spot(m, x, y, { kind: 'cc', room: i }); });
    m.warps.push({ x: 11, y: 11, to: 'town', tx: 55, ty: 13, dir: 1 });
    return finalize(m);
  }
  // museu: vitrines com 3 lugares cada, preenchidas pelas doações
  function buildMuseum() {
    const m = newMap('museum', 18, 11, G.WOOD, { name: 'Museu', outdoor: false });
    m.rect(0, 0, 17, 1, G.WALL); m.rect(0, 0, 0, 10, G.WALL); m.rect(17, 0, 17, 10, G.WALL); m.rect(0, 10, 17, 10, G.WALL);
    m.set(9, 10, G.WOOD);
    m.rect(7, 5, 10, 9, G.CARPET);
    let slot = 0;
    for (const [x, y] of [[2, 3], [5, 3], [11, 3], [14, 3], [2, 6], [5, 6], [11, 6], [14, 6]]) {
      const slots = [0, 1, 2].map(() => MUSEUM_ITEMS[slot++]).filter(Boolean);
      if (!slots.length) continue;
      sprite(m, 'mcase', x, y, 2, 1, { slots });
      spot(m, x, y, { kind: 'museum' }); spot(m, x + 1, y, { kind: 'museum' });
    }
    sprite(m, 'shelf', 1, 1, 3, 2); sprite(m, 'shelf', 14, 1, 3, 2);
    sprite(m, 'plant', 7, 2, 1, 1); sprite(m, 'plant', 10, 2, 1, 1);
    m.warps.push({ x: 9, y: 10, to: 'town', tx: 64, ty: 13, dir: 1 });
    return finalize(m);
  }
  const MAPS = { farm: buildFarm(), town: buildTown(), house: buildHouse(), store: buildStore(), smith: buildSmith(), minetop: buildMineTop(), carpentry: buildCarpentry(), ranch: buildRanch(), bar: buildBar(), fishshop: buildFishShop(), beach: buildBeach(), cc: buildCC(), museum: buildMuseum(), atelie: buildAtelie(), moveis: buildMoveis() };
