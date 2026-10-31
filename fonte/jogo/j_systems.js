
  // ================= sítio: seções extras do documento (construções, animais, covos, silo, geladeira) =================
  let bVer = 0;
  function setFarm(sec, k, v) {
    W.farm[sec] = W.farm[sec] || {};
    const old = W.farm[sec][k];
    const nv = v ? stripNull(clone(v)) : null;
    if (nv) W.farm[sec][k] = nv; else delete W.farm[sec][k];
    if (sec === 'b') bVer++;
    queueUpdate('world/farm', { [sec]: { [k]: nv ? nullDiff(old, nv) : null } });
  }
  function setFarmVal(k, v) { W.farm[k] = v; queueUpdate('world/farm', { [k]: v }); }
  const farmB = () => W.farm.b || {};
  const farmA = () => W.farm.a || {};
  let bGridCache = null, bGridVer = -1;
  function bGrid() {
    if (bGridCache && bGridVer === bVer) return bGridCache;
    const g = new Map();
    for (const [id, b] of Object.entries(farmB())) {
      const B = BUILDS[b.type]; if (!B) continue;
      for (let y = b.y; y < b.y + B.h; y++) for (let x = b.x; x < b.x + B.w; x++) g.set(x + ',' + y, { id, door: B.door != null && x === b.x + B.door && y === b.y + B.h - 1 });
    }
    bGridCache = g; bGridVer = bVer;
    return g;
  }
  const bReady = b => !!b && (!b.ready || W.meta.day >= b.ready);
  const siloCap = () => Object.values(farmB()).filter(b => b.type === 'silo' && bReady(b)).length * SILO_CAP;
  const animalHouseCache = new Map();
  function animalHouseMap(bid) {
    const b = farmB()[bid]; if (!b) return null;
    const key = bid + ':' + b.lv;
    if (!animalHouseCache.has(key)) animalHouseCache.set(key, b.type === 'greenhouse' ? buildGreenhouse(bid, b) : buildAnimalHouse(bid, b));
    return animalHouseCache.get(key);
  }
  const nowMinF = () => { const c = W.clock; let m = c.min + (Date.now() - c.at) / MS_PER_TICK * MIN_PER_TICK; if (!host) m = Math.min(m, c.min + 20); return Math.min(m, DAY_END); };

  // ================= efeitos de comida =================
  function buffLv(k) { const b = P && P.buff; return b && b.day === W.meta.day && b.until > nowMin() ? (b.b[k] || 0) : 0; }
  function afterEat(id) {
    const it = item(id);
    if (id === 'frutaestelar') { P.maxEnergy += 34; P.energy = P.maxEnergy; P.flags.stars = (P.flags.stars || 0) + 1; dirty(); sfx.level(); toast('Você sente uma energia nova! Energia máxima +34.', 'big'); return; }
    if (it.buff) {
      P.buff = { b: it.buff, until: nowMin() + 7 * 60, day: W.meta.day, name: it.name };
      if (it.buff.maxEnergy) P.energy = Math.min(P.maxEnergy + 50, P.energy + 50);
      toast(`${it.name}: ${Object.entries(it.buff).map(([k, v]) => `${BUFF_NAMES[k]} +${v}`).join(', ')} por 7 horas.`);
      dirty();
    }
  }

  // ================= construir: escolher o lugar na chacrinha =================
  let placing = null, placeStep = 0;
  function placeTiles(type, px, py, skip) {
    const B = BUILDS[type], m = MAPS.farm, out = [];
    const grid = bGrid();
    const isWarp = (x, y) => m.warps.some(w => x >= w.x && x < w.x + (w.w || 1) && y >= w.y && y < w.y + (w.h || 1));
    const free = (x, y, front) => {
      if (x < 2 || y < 3 || x > m.w - 3 || y > m.h - 3) return false;
      if (![G.GRASS, G.DIRT, G.FLOWERS].includes(m.at(x, y)) || m.solid[y * m.w + x] || (grid.has(x + ',' + y) && grid.get(x + ',' + y).id !== skip) || isWarp(x, y) || m.spots[x + ',' + y]) return false;
      const tl = tile(x + ',' + y);
      if (tl && (tl.c || (tl.s && !front) || (tl.o && !['weed', 'grass', 'twig', 'forage'].includes(tl.o.k)))) return false;
      return true;
    };
    for (let y = py; y < py + B.h; y++) for (let x = px; x < px + B.w; x++) out.push([x, y, free(x, y)]);
    if (B.door != null) { const x = px + B.door, y = py + B.h; out.push([x, y, free(x, y, true), true]); }
    return out;
  }
  // tamanho do que está sendo posicionado: construção (nova ou mudando de lugar); árvore e cursor ocupam um quadrado
  const placeSize = () => (placing && placing.type ? BUILDS[placing.type] : { w: 1, h: 1 });
  function startPlacing(type) {
    const B = BUILDS[type], lv = buildLv(type);
    if (Object.values(farmB()).some(b => !bReady(b))) { toast('A Rosa já está ocupada com outra obra. Espere ficar pronta.'); return; }
    if (B.unique && Object.values(farmB()).some(b => b.type === type)) { toast('Você já tem uma.'); return; }
    if (gold() < lv.gold || !Object.entries(lv.need).every(([k, n]) => count(k) >= n)) { toast('Faltam moedas ou materiais.'); return; }
    closePanel();
    const onFarm = P.map === 'farm';
    placing = { type, x: onFarm ? clamp(Math.floor(P.x / T) - Math.floor(B.w / 2), 2, 40) : 18, y: onFarm ? clamp(Math.floor(P.y / T) + 2, 3, 32) : 22 };
    toast('Mova com o círculo ou toque na chacrinha. Usar constrói aqui, Mochila cancela.', 'big');
  }
  function updatePlacing(dt) {
    let dx = input.jx, dy = input.jy;
    if (input.keys.ArrowLeft || input.keys.KeyA) dx -= 1;
    if (input.keys.ArrowRight || input.keys.KeyD) dx += 1;
    if (input.keys.ArrowUp || input.keys.KeyW) dy -= 1;
    if (input.keys.ArrowDown || input.keys.KeyS) dy += 1;
    placeStep -= dt;
    if (Math.hypot(dx, dy) < 0.3) { placeStep = 0; return; }
    if (placeStep > 0) return;
    placeStep = 0.11;
    const B = placeSize();
    if (Math.abs(dx) > 0.3) placing.x = clamp(placing.x + Math.sign(dx), 1, MAPS.farm.w - B.w - 1);
    if (Math.abs(dy) > 0.3) placing.y = clamp(placing.y + Math.sign(dy), 1, MAPS.farm.h - B.h - 2);
  }
  function drawPlacing() {
    if (placing.pick) {
      const tg = pickTarget(), box = (x, y, w, h, c) => { ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.strokeRect(x * T + 1, y * T + 1, w * T - 2, h * T - 2); };
      if (tg && tg.b) { const b = farmB()[tg.b], B = BUILDS[b.type]; ctx.fillStyle = 'rgba(255,220,80,0.3)'; ctx.fillRect(b.x * T, b.y * T, B.w * T, B.h * T); box(b.x, b.y, B.w, B.h, '#ffd84a'); }
      else if (tg && tg.tree) { const [x, y] = tg.tree.split(',').map(Number); ctx.fillStyle = 'rgba(255,220,80,0.4)'; ctx.fillRect(x * T, y * T, T, T); box(x, y, 1, 1, '#ffd84a'); }
      box(placing.x, placing.y, 1, 1, '#ffffff');
      return;
    }
    if (placing.tree) {
      const ok = treeSpotOk(placing.x, placing.y, placing.tree);
      ctx.fillStyle = ok ? 'rgba(80,220,80,0.4)' : 'rgba(230,50,40,0.5)'; ctx.fillRect(placing.x * T + 1, placing.y * T + 1, T - 2, T - 2);
      ctx.globalAlpha = 0.7; drawObj(placing.o, placing.x * T, placing.y * T, placing.x + ',' + placing.y, 0); ctx.globalAlpha = 1;
      return;
    }
    const B = BUILDS[placing.type], tiles = placeTiles(placing.type, placing.x, placing.y, placing.move), mb = placing.move && farmB()[placing.move];
    ctx.globalAlpha = 0.55;
    blit(building2Canvas(placing.type, B.w * T, B.h * T, false, mb ? mb.lv : 1), placing.x * T - 8, placing.y * T - 36);
    ctx.globalAlpha = 1;
    for (const [x, y, ok, front] of tiles) { ctx.fillStyle = ok ? (front ? 'rgba(80,160,255,0.45)' : 'rgba(80,220,80,0.4)') : 'rgba(230,50,40,0.5)'; ctx.fillRect(x * T + 1, y * T + 1, T - 2, T - 2); }
  }
  // ================= mudar construções e árvores de lugar =================
  function startMoving() {
    closePanel();
    const [px, py] = P.map === 'farm' ? ptile() : [18, 22];
    placing = { pick: true, x: px, y: Math.max(3, py - 1) };
    toast('Toque numa construção ou árvore da chacrinha e aperte Usar. Mochila cancela.', 'big');
  }
  // o que está no quadrado escolhido (ou logo abaixo: o desenho de prédios e árvores fica mais alto que o chão que ocupam)
  function pickTarget() {
    const g = bGrid();
    for (let dy = 0; dy <= 2; dy++) {
      const k = placing.x + ',' + (placing.y + dy);
      if (g.has(k)) return { b: g.get(k).id };
      const tl = tile(k);
      if (tl && tl.o && (tl.o.k === 'tree' || tl.o.k === 'ftree')) return { tree: k };
    }
    return null;
  }
  // árvore precisa de chão livre e de espaço em volta (igual a plantar uma muda)
  function treeSpotOk(x, y, from) {
    const m = MAPS.farm, k = x + ',' + y, g = bGrid();
    if (x < 2 || y < 3 || x > m.w - 3 || y > m.h - 3) return false;
    if (![G.GRASS, G.DIRT, G.FLOWERS].includes(m.at(x, y)) || m.solid[y * m.w + x] || g.has(k) || m.spots[k]) return false;
    if (m.warps.some(w => x >= w.x && x < w.x + (w.w || 1) && y >= w.y && y < w.y + (w.h || 1))) return false;
    const tl = tile(k);
    if (k !== from && tl && (tl.c || tl.s || (tl.o && !['weed', 'grass', 'twig', 'forage'].includes(tl.o.k)))) return false;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const k2 = (x + dx) + ',' + (y + dy); if ((!dx && !dy) || k2 === from) continue;
      const t2 = tile(k2); if ((t2 && t2.o && ['tree', 'ftree', 'stump'].includes(t2.o.k)) || g.has(k2)) return false;
    }
    return true;
  }
  function confirmMoving() {
    const p = placing;
    if (p.pick) {
      const tg = pickTarget();
      if (!tg) { toast('Aqui não tem construção nem árvore. Toque numa delas.'); sfx.no(); return; }
      if (tg.b) {
        const b = farmB()[tg.b], name = BUILDS[b.type].names[(b.lv || 1) - 1];
        placing = { type: b.type, x: b.x, y: b.y, move: tg.b };
        toast(`Escolha o lugar novo: ${name}. Usar coloca aqui, Mochila cancela.`, 'big');
      } else {
        const [x, y] = tg.tree.split(',').map(Number);
        placing = { tree: tg.tree, o: clone(tile(tg.tree).o), x, y };
        toast('Escolha o lugar novo da árvore. Usar planta aqui, Mochila cancela.', 'big');
      }
      sfx.pop(); return;
    }
    if (p.tree) {
      const from = tile(p.tree);
      if (!from || !from.o || !['tree', 'ftree'].includes(from.o.k)) { placing = null; toast('A árvore não está mais lá.'); return; }
      if (!treeSpotOk(p.x, p.y, p.tree)) { toast('Não dá para plantar aí: a árvore precisa de chão livre e espaço em volta.'); sfx.no(); return; }
      const k = p.x + ',' + p.y;
      if (k !== p.tree) { const rest = { ...from }; delete rest.o; setTile(p.tree, Object.keys(rest).length ? rest : null); setTile(k, { o: from.o }); }
      placing = null; sfx.hoe(); toast('A árvore mudou de lugar!', 'big');
      return;
    }
    const b = farmB()[p.move];
    if (!b) { placing = null; toast('Essa construção não está mais lá.'); return; }
    const tiles = placeTiles(p.type, p.x, p.y, p.move);
    if (tiles.some(t => !t[2])) { toast('Não dá para colocar aí: precisa de chão livre (vermelho está ocupado).'); sfx.no(); return; }
    for (const [x, y] of tiles) { const tl = tile(x + ',' + y); if (tl && tl.o) setTile(x + ',' + y, null); }
    setFarm('b', p.move, { ...b, x: p.x, y: p.y });
    animLocal.clear();
    placing = null; sfx.level();
    toast(`${BUILDS[b.type].names[(b.lv || 1) - 1]} mudou de lugar!`, 'big');
  }
  function confirmPlacing() {
    if (placing.pick || placing.tree || placing.move) { confirmMoving(); return; }
    const p = placing, B = BUILDS[p.type], lv = buildLv(p.type), tiles = placeTiles(p.type, p.x, p.y);
    if (tiles.some(t => !t[2])) { toast('Não dá para construir aí: precisa de chão livre (vermelho está ocupado).'); sfx.no(); return; }
    if (!Object.entries(lv.need).every(([k, n]) => count(k) >= n) || !spend(lv.gold)) { toast('Faltam moedas ou materiais.'); placing = null; return; }
    for (const [k, n] of Object.entries(lv.need)) removeItem(k, n);
    for (const [x, y] of tiles) { const tl = tile(x + ',' + y); if (tl && tl.o) setTile(x + ',' + y, null); }
    const id = 'b' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
    setFarm('b', id, { type: p.type, lv: 1, x: p.x, y: p.y, ready: W.meta.day + 1, feed: 0, by: P.uid });
    placing = null; sfx.coin(); sfx.level();
    toast(`A Rosa vai construir ${B.names[0].toLowerCase() === 'poço' ? 'o poço' : 'o ' + B.names[0].toLowerCase()} durante a noite. Fica pronto amanhã!`, 'big');
  }
  function upgradeBuilding(id) {
    const b = farmB()[id]; if (!b) return;
    const B = BUILDS[b.type], lv = B.lvs[b.lv];
    if (!lv) return;
    if (Object.values(farmB()).some(x => !bReady(x))) { toast('A Rosa já está ocupada com outra obra.'); return; }
    if (!Object.entries(lv.need).every(([k, n]) => count(k) >= n) || !spend(lv.gold)) { toast('Faltam moedas ou materiais.'); return; }
    for (const [k, n] of Object.entries(lv.need)) removeItem(k, n);
    setFarm('b', id, { ...b, lv: b.lv + 1, ready: W.meta.day + 1 });
    sfx.level(); toast(`Reforma marcada: ${B.names[b.lv]} fica pronto amanhã!`, 'big');
  }
  function drawFarmBuilding(b, nf) {
    const B = BUILDS[b.type], x = b.x * T, y = b.y * T, w = B.w * T, h = B.h * T;
    shadowAt(x + w / 2, y + h, w / 2 + 2, 4);
    if (!bReady(b)) blit(building2Canvas('scaffold', w, h, false), x - 8, y - 36);
    else blit(building2Canvas(b.type, w, h, nf > 0.35, b.lv), x - 8, y - 36);
  }

  // ================= animais =================
  const animLocal = new Map();
  const animalsOutside = () => !W.meta.rain && season() !== 'winter' && nowMin() >= 540 && nowMin() < 1020;
  function animalWhere(a) {
    const b = farmB()[a.b];
    if (!b || !bReady(b)) return null;
    return animalsOutside() ? 'farm' : 'b:' + a.b;
  }
  function animalsOn(mapId) { return Object.entries(farmA()).filter(([, a]) => animalWhere(a) === mapId); }
  function animalSpot(id, a, mapId) {
    const r = Math.random;
    if (mapId === 'farm') {
      const b = farmB()[a.b], B = BUILDS[b.type], m = MAPS.farm;
      for (let k = 0; k < 30; k++) { const x = b.x + B.door + Math.floor((r() - 0.5) * 12), y = b.y + B.h + 1 + Math.floor(r() * 6); if (!solidAt(m, x, y)) return [x * T + 8, y * T + 12]; }
      return [(b.x + B.door) * T + 8, (b.y + B.h + 1) * T + 12];
    }
    const m = getMap(mapId), ft = m.floorTiles || [[3, 4]], [x, y] = ft[Math.floor(r() * ft.length)];
    return [x * T + 8, y * T + 12];
  }
  function animState(id, a, mapId) {
    let s = animLocal.get(id);
    if (!s || s.map !== mapId) { const [x, y] = animalSpot(id, a, mapId); s = { map: mapId, x, y, tx: x, ty: y, t: rnd(0.5, 3), dir: Math.random() < 0.5 ? 2 : 3, walk: false, heart: 0 }; animLocal.set(id, s); }
    return s;
  }
  function updateAnimals(dt) {
    const m = curMap();
    for (const [id, a] of animalsOn(m.id)) {
      const s = animState(id, a, m.id);
      s.heart = Math.max(0, s.heart - dt);
      if (s.walk) {
        const dx = s.tx - s.x, dy = s.ty - s.y, d = Math.hypot(dx, dy), sp = (['vaca', 'porco', 'ovelha', 'cabra'].includes(a.kind) ? 16 : 20) * dt;
        if (d < sp) { s.walk = false; s.t = rnd(1.5, 5); }
        else {
          const nx = s.x + dx / d * sp, ny = s.y + dy / d * sp;
          if (solidAt(m, Math.floor(nx / T), Math.floor((ny - 3) / T))) { s.walk = false; s.t = rnd(1, 3); }
          else { s.x = nx; s.y = ny; if (Math.abs(dx) > 1) s.dir = dx < 0 ? 2 : 3; }
        }
      } else {
        s.t -= dt;
        if (s.t <= 0) { const [x, y] = animalSpot(id, a, m.id); if (Math.hypot(x - s.x, y - s.y) < 90) { s.tx = x; s.ty = y; s.walk = true; } else s.t = rnd(0.5, 2); }
      }
    }
  }
  function animalAt(m, px, py) {
    let best = null, bd = 1e9;
    for (const [id, a] of animalsOn(m.id)) {
      const s = animState(id, a, m.id), big = ['vaca', 'porco', 'ovelha', 'cabra'].includes(a.kind);
      const d = Math.hypot(s.x - px, s.y - 6 - py);
      if (d < (big ? 18 : 12) && d < bd) { bd = d; best = [id, a, s]; }
    }
    return best;
  }
  function interactAnimal(id, a, st) {
    const def = ANIMALS[a.kind], s = held(), day = W.meta.day;
    if (s && (s.id === 'balde' || s.id === 'tesoura')) {
      if (def.tool !== s.id) { toast(`${def.name} não precisa ${s.id === 'balde' ? 'do balde' : 'da tesoura'}.`); return; }
      if (!a.prod) { toast(`${a.name} ainda não tem ${def.tool === 'balde' ? 'leite' : 'lã'} pronta.`); return; }
      { const [pid, pq] = splitQ(a.prod); if (!addItem(pid, 1, false, pq)) return; }
      swing(s.id, 0); sfx.pop(); gainXP('farming', 5);
      setFarm('a', id, { ...a, prod: null, fr: Math.min(1000, (a.fr || 0) + 5) });
      return;
    }
    if (a.pet !== day) {
      setFarm('a', id, { ...a, pet: day, fr: Math.min(1000, (a.fr || 0) + (hasProf('amigobichos') ? 30 : 15)) });
      st.heart = 1.6; st.walk = false; st.t = 2; sfx.pop(); gainXP('farming', 5);
      return;
    }
    openAnimalInfo(id);
  }
  function animalHearts(a) { return Math.min(5, Math.floor((a.fr || 0) / 200)); }
  function heartsHTML(n, max) { return `<span class="hearts">${Array.from({ length: max }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`; }
  const animalValue = a => Math.round(animalPrice(a.kind) * (0.3 + (a.fr || 0) / 1000 * 0.7));
  function openAnimalInfo(id) {
    const a = farmA()[id]; if (!a) return;
    const def = ANIMALS[a.kind], baby = (a.age || 0) < def.mature, fedToday = (farmB()[a.b] || {}).feed > 0;
    const mood = a.pet === W.meta.day ? (fedToday || animalsOutside() ? 'muito feliz' : 'feliz, mas com fome') : 'querendo carinho';
    openPanel(`<h2>${esc(a.name)}</h2><p style="text-align:center">${def.name}${baby ? ' (filhote)' : ''} · ${a.age || 0} dia${a.age === 1 ? '' : 's'} na chacrinha</p>
      <p style="text-align:center">${heartsHTML(animalHearts(a), 5)}</p>
      <p style="text-align:center">Está ${mood}. ${def.desc}${baby ? ` Começa a produzir com ${def.mature} dias.` : ''}</p>
      <div class="row"><button class="btn r" data-a="sellAnimal" data-id="${id}" type="button">Vender por ${fmt(animalValue(a))} ₲</button>${MEAT[a.kind] && !baby ? `<button class="btn r" data-a="butcher" data-id="${id}" type="button">Levar ao açougue (${meatAmount(a)} de carne)</button>` : ''}<button class="btn g" data-a="close" type="button">Fechar</button></div>`, 'animal', id);
  }
  function buyAnimal(kind, name) {
    const def = ANIMALS[kind];
    const homes = Object.entries(farmB()).filter(([, b]) => b.type === def.house && b.lv >= def.lv && bReady(b)).map(([bid, b]) => [bid, b, Object.values(farmA()).filter(x => x.b === bid).length]).filter(([, b, n]) => n < bCap(b));
    if (!homes.length) { toast('Não tem espaço livre numa construção adequada.'); return; }
    if (!spend(coopPrice(animalPrice(kind)))) { toast('Moedas insuficientes.'); return; }
    homes.sort((p, q) => p[2] - q[2]);
    const id = 'a' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
    setFarm('a', id, { kind, name: (name || '').trim().slice(0, 14) || pick(ANIMAL_NAMES), b: homes[0][0], v: Math.floor(Math.random() * ANIM_COL[kind].length), fr: 0, born: W.meta.day, age: 0, pet: 0, last: W.meta.day });
    sfx.coin(); toast(`${def.name} comprado! Já está ${def.house === 'coop' ? 'no galinheiro' : 'no celeiro'}.`, 'big');
  }
  function animalSlots(kind) {
    const def = ANIMALS[kind];
    let free = 0;
    for (const [bid, b] of Object.entries(farmB())) if (b.type === def.house && b.lv >= def.lv && bReady(b)) free += bCap(b) - Object.values(farmA()).filter(x => x.b === bid).length;
    return free;
  }
  // cocho e comedouro
  function feedTroughs(b, bid, fromHand) {
    const need = bCap(b) - (b.feed || 0);
    if (need <= 0) { toast('Os cochos já estão cheios.'); return; }
    let n = 0;
    if (fromHand) { n = Math.min(need, count('feno'), fromHand); removeItem('feno', n); }
    else {
      n = Math.min(need, W.farm.hay || 0);
      if (n) setFarmVal('hay', (W.farm.hay || 0) - n);
      if (n < need && count('feno')) { const k = Math.min(need - n, count('feno')); removeItem('feno', k); n += k; }
    }
    if (!n) { toast(siloCap() ? 'O silo está vazio. Compre feno com a Marta ou corte capim com a foice.' : 'Sem feno! Compre no rancho da Marta.'); sfx.no(); return; }
    setFarm('b', bid, { ...b, feed: (b.feed || 0) + n });
    sfx.pop(); toast(`${n} de feno no cocho.${siloCap() ? ` Silo: ${W.farm.hay || 0}/${siloCap()}.` : ''}`);
  }
  function pickupFloorItems() {
    const m = curMap(); if (!m.bid) return;
    const b = farmB()[m.bid]; if (!b || !b.items) return;
    const k = Math.floor(P.x / T) + ',' + Math.floor((P.y - 3) / T), id = b.items[k];
    if (!id) return;
    { const [pid, pq] = splitQ(id); if (!addItem(pid, 1, false, pq)) return; }
    const items = { ...b.items }; delete items[k];
    setFarm('b', m.bid, { ...b, items });
    gainXP('farming', 5); sfx.pop();
  }

  // ================= cavalo =================
  function horsesFree() {
    const stables = Object.entries(farmB()).filter(([, b]) => b.type === 'stable' && bReady(b));
    const riders = peerPlayers().filter(p => (p.me ? P.ride : p.ride)).length;
    return stables.slice(0, Math.max(0, stables.length - riders));
  }
  function mount() {
    if (P.ride) return;
    if (!horsesFree().length) { toast('O cavalo está com a outra pessoa.'); return; }
    P.ride = true; sfx.pop(); dirty();
    toast('Montou no cavalo! Toque em Usar para descer.');
  }
  function dismount(msg = true) { if (!P.ride) return; P.ride = false; dirty(); if (msg) toast('O cavalo voltou para o estábulo.'); }

  // ================= construções na chacrinha: tocar nelas =================
  function interactBuilding(tx, ty) {
    const g = bGrid().get(tx + ',' + ty); if (!g) return false;
    const b = farmB()[g.id];
    if (!bReady(b)) { toast('Em obra! Fica pronto amanhã.'); return true; }
    const s = held();
    switch (b.type) {
      case 'silo': if (s && s.id === 'feno') { const n = Math.min(s.n, siloCap() - (W.farm.hay || 0)); if (n > 0) { useHeld(n); setFarmVal('hay', (W.farm.hay || 0) + n); toast(`Guardou ${n} de feno no silo.`); } else toast('O silo está cheio.'); } else toast(`Silo: ${W.farm.hay || 0}/${siloCap()} de feno.`); return true;
      case 'well': if (s && s.id === 'can') { swing('can', s.lv || 0); P.water = canCap(s.lv || 0); toast('Regador cheio!'); sfx.water(); dirty(); } else toast('Um poço fresquinho. Use o regador aqui.'); return true;
      case 'stable': mount(); return true;
      case 'greenhouse': toast('A estufa! Entre pela porta: lá dentro tudo cresce em qualquer estação.'); return true;
      default: { const n = Object.values(farmA()).filter(a => a.b === g.id).length; toast(`${BUILDS[b.type].names[b.lv - 1]}: ${n}/${bCap(b)} animais. Entre pela porta.`); return true; }
    }
  }

  // ================= covos =================
  const potKey = (m, x, y) => m.id + ':' + x + ',' + y;
  function interactPot(m, tx, ty) {
    const k = potKey(m, tx, ty), p = (W.farm.pots || {})[k];
    const s = held();
    if (!p) {
      if (s && s.id === 'covo' && m.at(tx, ty) === G.WATER && ['farm', 'town', 'beach'].includes(m.id)) { setFarm('pots', k, { bait: 0 }); useHeld(1); sfx.pop(); toast('Covo na água! Ponha isca nele.'); return true; }
      return false;
    }
    if (p.c) { if (addItem(p.c, 1)) { setFarm('pots', k, { bait: 0 }); gainXP('fishing', 5); sfx.pop(); } return true; }
    if (s && s.id === 'isca' && !p.bait) { useHeld(1); setFarm('pots', k, { bait: 1 }); sfx.pop(); toast('Isca colocada. Amanhã tem fruto do mar!'); return true; }
    if (!p.bait) { if (addItem('covo', 1)) setFarm('pots', k, null); return true; }
    toast('O covo já tem isca. Volte amanhã.'); return true;
  }

  // ================= moradores: agenda, desenho e conversa =================
  function npcPath(map, a, b) {
    const A = [a[2] * T + 8, a[3] * T + 14], Bp = [b[2] * T + 8, b[3] * T + 14];
    const lane = map === 'town' ? 24 * T + 8 : map === 'beach' ? 20 * T + 8 : null;
    if (lane == null) return [A, Bp];
    return [A, [lane, A[1]], [lane, Bp[1]], Bp];
  }
  function npcPos(id) {
    const n = NPCS[id], now = nowMinF(), sc = n.sched;
    let i = -1;
    for (let k = 0; k < sc.length; k++) if (sc[k][0] <= now) i = k;
    if (i < 0 || !sc[i][1]) return null;
    const cur = sc[i], prev = sc[i - 1];
    let x = cur[2] * T + 8, y = cur[3] * T + 14, dir = cur[4] == null ? 1 : cur[4], walk = false;
    if (prev && prev[1] === cur[1]) {
      const path = npcPath(cur[1], prev, cur);
      let dist = (now - cur[0]) * 2 * T;
      for (let k = 1; k < path.length; k++) {
        const [ax, ay] = path[k - 1], [bx, by] = path[k], L = Math.hypot(bx - ax, by - ay);
        if (dist < L) { const f = dist / L; x = ax + (bx - ax) * f; y = ay + (by - ay) * f; walk = true; dir = Math.abs(bx - ax) > Math.abs(by - ay) ? (bx > ax ? 3 : 2) : by > ay ? 1 : 0; break; }
        dist -= L;
      }
    }
    return { map: cur[1], x, y, dir, walk };
  }
  function npcAt(m, px, py) {
    for (const id of Object.keys(NPCS)) { const p = npcPos(id); if (p && p.map === m.id && Math.hypot(p.x - px, p.y - 8 - py) < 14) return id; }
    return null;
  }
  const rel = id => (P.rel[id] = P.rel[id] || { pts: 0, talk: 0, gifts: [] });
  const hearts = id => Math.min(10, Math.floor(rel(id).pts / 250));
  const weekOf = d => Math.floor((d - 1) / 7);
  const giftsThisWeek = id => rel(id).gifts.filter(d => weekOf(d) === weekOf(W.meta.day)).length;
  const isBday = id => { const b = NPCS[id].bday; return season() === b[0] && dom() === b[1]; };
  function taste(id, itemId) {
    const it = item(itemId), n = NPCS[id];
    const match = list => (list || []).some(t => t === itemId || (t[0] === '*' && (t.slice(1) === it.cat || t.slice(1) === it.kind || (t === '*gem' && it.cat === 'gem'))));
    if (match(n.hates)) return 'hate';
    if (match(n.loves)) return 'love';
    if (match(n.likes)) return 'like';
    if (match(n.dislikes)) return 'dislike';
    if (match(UNIVERSAL.loves)) return 'love';
    if (match(UNIVERSAL.hates)) return 'hate';
    if (match(UNIVERSAL.likes)) return 'like';
    if (match(UNIVERSAL.dislikes)) return 'dislike';
    return 'neutral';
  }
  function npcLine(id) {
    const n = NPCS[id], d = W.meta.day, q = W.meta.quest;
    if (isBday(id)) return 'Hoje é o meu aniversário! Que bom que você veio.';
    if (q && q.npc === id && !q.done) return `Você teria ${item(q.id).name.toLowerCase()} pra mim? Estou precisando muito. Pago ${fmt(q.reward)} ₲!`;
    const h = hash(d, Object.keys(NPCS).indexOf(id), 77);
    if (hearts(id) >= 6 && h < 0.35) return n.hi[Math.floor(h * 10) % n.hi.length];
    if (h > 0.75) return n.season[SEASON_ID.indexOf(season())];
    return n.lines[Math.floor(hash(d, 3, Object.keys(NPCS).indexOf(id)) * n.lines.length)];
  }
  function giftable(s) { return s && item(s.id).cat !== 'tool' && s.id !== 'alianca'; }
  function openTalk(id, text) {
    const n = NPCS[id], r = rel(id), d = W.meta.day;
    if (!text) {
      text = npcLine(id);
      if (r.talk !== d) { r.talk = d; r.pts = Math.min(2500, r.pts + 20); dirty(); }
    }
    const s = held(), can = giftable(s);
    const q = W.meta.quest, questItem = q && q.npc === id && !q.done && s && s.id === q.id;
    openPanel(`<div class="talk"><canvas id="portrait" width="40" height="40" aria-hidden="true"></canvas><div><h2 style="text-align:left;margin:0">${n.name}</h2><small>${n.role}</small><div>${heartsHTML(hearts(id), 10)}</div></div></div>
      <p class="speech">${esc(text)}</p>
      <div class="row">${can ? `<button class="btn g" data-a="gift" data-id="${id}" type="button">${questItem ? 'Entregar' : 'Dar'} ${esc(item(s.id).name)}</button>` : ''}<button class="btn" data-a="close" type="button">Tchau</button></div>
      <p style="font-size:12px;text-align:center">Presentes nesta semana: ${giftsThisWeek(id)}/2${isBday(id) ? ' · aniversário hoje!' : ''}. ${can ? '' : 'Segure um item na barra para dar de presente.'}</p>`, 'talk', id);
    drawPortrait(id);
  }
  function drawPortrait(id) {
    const c = $('portrait'); if (!c) return;
    const saved = ctx; ctx = c.getContext('2d'); ctx.clearRect(0, 0, 40, 40);
    drawFarmer(20, 36, { ...NPCS[id].look, npc: id }, 1, 0);
    ctx = saved;
  }
  function giveGift(id) {
    const s = held(); if (!giftable(s)) return;
    const r = rel(id), d = W.meta.day, q = W.meta.quest;
    if (q && q.npc === id && !q.done && s.id === q.id) {
      useHeld(1); earn(q.reward); r.pts = Math.min(2500, r.pts + 150); q.done = P.uid;
      queueUpdate('world/meta', { quest: { done: P.uid } });
      sfx.coin(); openTalk(id, `Muito obrigado! Era exatamente o que eu precisava. Tome ${fmt(q.reward)} ₲!`); return;
    }
    const bd = isBday(id);
    if (r.gifts.includes(d)) { openTalk(id, 'Você já me deu um presente hoje. Obrigado!'); return; }
    if (giftsThisWeek(id) >= 2 && !bd) { openTalk(id, 'Você já me deu dois presentes esta semana. Assim eu fico sem graça!'); return; }
    const tst = taste(id, s.id), base = { love: 80, like: 45, neutral: 20, dislike: -20, hate: -40 }[tst];
    r.pts = clamp(r.pts + Math.round(base * Q_GIFT[s.q || 0]) * (bd ? 8 : 1), 0, 2500); r.gifts.push(d); r.gifts = r.gifts.filter(x => weekOf(x) >= weekOf(d) - 1);
    useHeld(1); dirty(); sfx[tst === 'love' || tst === 'like' ? 'coin' : 'no']();
    openTalk(id, (bd && (tst === 'love' || tst === 'like') ? 'Um presente de aniversário! ' : '') + pick(GIFT_LINES[tst]));
  }

  // ================= cartas =================
  function sendMail(id, from, text, extra = {}) {
    if (P.mail.some(m => m.id === id)) return;
    P.mail.unshift({ id, from, text, read: false, ...extra });
    if (P.mail.length > 40) P.mail.length = 40;
    dirty();
  }
  function checkMail() {
    const d = W.meta.day;
    sendMail('welcome', 'Seu Pedro', 'Boas-vindas à Minha Chacrinha! A vila inteira está feliz com gente nova cuidando da terra. Passe no armazém quando quiser. Mandei umas sementes de presente.', { items: [['s_pastinaca', 5]] });
    for (const [bid, b] of Object.entries(farmB())) if (b.ready && b.ready <= d) {
      const nm = BUILDS[b.type].names[b.lv - 1];
      sendMail(`built:${bid}:${b.lv}`, 'Rosa', `Terminei: ${nm} está pronto! ${b.type === 'coop' || b.type === 'barn' ? 'Agora é só comprar animais no rancho da Marta e deixar feno no cocho.' : b.type === 'stable' ? 'Seu cavalo já está esperando no estábulo!' : b.type === 'silo' ? 'Corte o capim com a foice e o feno vai direto pro silo.' : 'Dá pra encher o regador ali mesmo.'}`);
    }
    if (Object.values(farmB()).some(b => (b.type === 'coop' || b.type === 'barn') && bReady(b))) sendMail('marta1', 'Marta', 'Soube que você tem onde criar bichos! Passe no rancho: tenho galinhas, vacas e tudo mais. Dica: faça carinho todo dia e não deixe faltar feno.', { items: [['feno', 10]] });
    for (const r of COOK) if (r.learn.startsWith('npc:')) {
      const [, who, h] = r.learn.split(':');
      if (hearts(who) >= +h && !P.recipes.includes(r.id)) sendMail('rec:' + r.id, NPCS[who].name, `Pensei em você e quis dividir uma receita da família: ${r.name}. Espero que goste!`, { recipe: r.id });
    }
    if (d >= 5) sendMail('ze1', 'Zé', 'Ei! Se quiser pescar no mar, a praia fica descendo a ponte da vila. Passe na peixaria!', { items: [['isca', 10]] });
    checkCCMail();
    if (d >= 3) sendMail('rosa1', 'Rosa', 'Oi! Sou a carpinteira da vila. Construo galinheiro, celeiro, estábulo, silo e poço. Minha carpintaria fica na vila, perto do bar.');
  }
  function openMail() {
    const list = P.mail;
    openPanel(`<h2>Caixa de correio</h2>${list.length ? `<div class="list">${list.map((m, i) => `<div class="item mail${m.read ? '' : ' new'}"><span class="nm"><b>${esc(m.from)}</b><small>${esc(m.text)}</small>${m.items && !m.got ? `<small>Anexo: ${m.items.map(([id, n]) => `${n}× ${item(id).name}`).join(', ')}</small>` : ''}${m.recipe && !m.got ? `<small>Receita: ${item(m.recipe).name}</small>` : ''}</span>${(m.items || m.recipe || m.effect) && !m.got ? `<button class="btn g" data-a="mailGet" data-i="${i}" type="button">Pegar</button>` : ''}</div>`).join('')}</div>` : '<p style="text-align:center">Nenhuma carta.</p>'}`, 'mail');
    for (const m of list) if (!m.items && !m.recipe && !m.effect) m.read = true;
    dirty();
  }
  function mailGet(i) {
    const m = P.mail[i]; if (!m || m.got) return;
    if (m.items) for (const [id, n] of m.items) addItem(id, n, true);
    if (m.effect) applyMailEffect(m.effect);
    if (m.recipe && !P.recipes.includes(m.recipe)) { P.recipes.push(m.recipe); toast(`Receita aprendida: ${item(m.recipe).name}!`, 'big'); }
    m.got = true; m.read = true; dirty(); sfx.pop(); openMail();
  }
  const hasUnread = () => P && P.mail && P.mail.some(m => !m.read);

  // ================= TV =================
  const TV_RECIPES = COOK.filter(r => r.learn === 'tv');
  function openTV() {
    const d = W.meta.day, wd = (d - 1) % 7, rec = TV_RECIPES[weekOf(d) % TV_RECIPES.length];
    const luck = W.meta.luck || 0, lt = luck > 0.05 ? 'Os espíritos estão de ótimo humor hoje! Bom dia pra mina.' : luck < -0.05 ? 'Os espíritos estão meio ranzinzas hoje. Cuidado.' : 'Os espíritos estão tranquilos hoje.';
    const cook = wd === 6 || wd === 2;
    openPanel(`<h2>Televisão</h2><div class="list">
      <div class="item"><span class="nm"><b>Previsão do tempo</b><small>Amanhã: ${W.meta.rainTomorrow ? (season(d + 1) === 'winter' ? 'neve' : 'chuva') : 'sol'}.</small></span></div>
      <div class="item"><span class="nm"><b>Cartomante</b><small>${lt}</small></span></div>
      <div class="item"><span class="nm"><b>Rainha do Sabor</b><small>${cook ? `Receita da semana: ${rec.name}. ${P.recipes.includes(rec.id) ? 'Você já sabe esta!' : ''}` : 'Passa aos domingos (e reprise às quartas).'}</small></span>${cook && !P.recipes.includes(rec.id) ? `<button class="btn g" data-a="tvLearn" type="button">Aprender</button>` : ''}</div>
      <div class="item"><span class="nm"><b>Dicas do campo</b><small>${TV_TIPS[d % TV_TIPS.length]}</small></span></div>
    </div>`, 'tv');
  }

  // ================= cozinha e geladeira =================
  const fridge = () => W.farm.fridge || Array(36).fill(null);
  const fridgeCount = id => fridge().reduce((a, s) => a + (s && s.id === id ? s.n : 0), 0);
  const haveAny = key => anyList(key).reduce((a, id) => a + count(id) + fridgeCount(id), 0);
  function consumeAny(key, n) {
    const fr = fridge().map(s => (s ? { ...s } : null));
    for (const id of anyList(key)) {
      const k = Math.min(n, count(id)); if (k) { removeItem(id, k); n -= k; }
      for (let i = 0; i < fr.length && n > 0; i++) if (fr[i] && fr[i].id === id) { const q = Math.min(n, fr[i].n); fr[i].n -= q; n -= q; if (!fr[i].n) fr[i] = null; }
      if (!n) break;
    }
    setFarmVal('fridge', fr);
  }
  const knows = r => r.learn === 'start' || P.recipes.includes(r.id);
  function learnHint(r) {
    if (r.learn === 'tv') return 'Aparece na TV aos domingos.';
    if (r.learn === 'lia') return 'Vendida no bar da Lia.';
    if (r.learn.startsWith('npc:')) { const [, w, h] = r.learn.split(':'); return `${NPCS[w].name} ensina com ${h} corações.`; }
    if (r.learn.startsWith('skill:')) { const [, k, l] = r.learn.split(':'); return `Aprende com ${SKILLS[k]} nível ${l}.`; }
    return '';
  }
  function openCooking() {
    const rows = COOK.map(r => {
      if (!knows(r)) return `<div class="item dim"><span class="nm"><b>???</b><small>${learnHint(r)}</small></span></div>`;
      const ok = Object.entries(r.need).every(([k, n]) => haveAny(k) >= n);
      return `<div class="item"><img src="${iconURL(r.id)}" alt=""><span class="nm"><b>${r.name}</b><small>${Object.entries(r.need).map(([k, n]) => `<span style="color:${haveAny(k) >= n ? '#2a7a2a' : '#a83a2a'}">${n} ${needName(k)}</span>`).join(', ')}</small><small>+${r.en} de energia${r.buff ? ' · ' + Object.entries(r.buff).map(([k, v]) => `${BUFF_NAMES[k]} +${v}`).join(', ') : ''} · vale ${r.sell} ₲</small></span><button class="btn g" data-a="cook" data-id="${r.id}" type="button" ${ok ? '' : 'disabled'}>Cozinhar</button></div>`;
    });
    openPanel(`<h2>Fogão</h2><p style="text-align:center;font-size:13px">Usa ingredientes da mochila e da geladeira. Você sabe ${COOK.filter(knows).length} de ${COOK.length} receitas.</p><div class="list">${rows.join('')}</div>`, 'cook');
  }
  function cookIt(id) {
    const r = COOK.find(x => x.id === id);
    if (!r || !knows(r) || !Object.entries(r.need).every(([k, n]) => haveAny(k) >= n)) return;
    for (const [k, n] of Object.entries(r.need)) consumeAny(k, n);
    addItem(id, 1, true); sfx.eat(); toast(`Você cozinhou: ${r.name}!`);
    openCooking();
  }
  function renderFridge() {
    const items = fridge();
    openPanel(`<h2>Geladeira</h2><p style="text-align:center;font-size:13px">Os dois usam a mesma geladeira. O fogão também pega daqui.</p>
      <h3>Geladeira</h3><div class="grid">${items.map((s, i) => slotHTML(s, i, false, 'frOut')).join('')}</div>
      <h3>Mochila</h3><div class="grid">${P.inv.map((s, i) => slotHTML(s, i, false, 'frIn')).join('')}</div>`, 'fridge');
  }
  function fridgeMove(i, toFridge) {
    const items = fridge().map(s => (s ? { ...s } : null));
    if (toFridge) {
      const s = P.inv[i]; if (!s || !stackable(s.id)) return;
      let j = items.findIndex(x => x && x.id === s.id && (x.q || 0) === (s.q || 0));
      if (j >= 0) items[j].n += s.n; else { j = items.findIndex(x => !x); if (j < 0) { toast('A geladeira está cheia.'); return; } items[j] = s.q ? { id: s.id, n: s.n, q: s.q } : { id: s.id, n: s.n }; }
      P.inv[i] = null;
    } else {
      const s = items[i]; if (!s) return;
      if (addItem(s.id, s.n, true, s.q || 0) < s.n) return;
      items[i] = null;
    }
    setFarmVal('fridge', items); dirty(); renderHotbar(); renderFridge();
  }

  // ================= quadro de avisos e calendário =================
  function openBoard() {
    const s = season(), q = W.meta.quest;
    const bdays = {};
    for (const [id, n] of Object.entries(NPCS)) if (n.bday[0] === s) bdays[n.bday[1]] = n.name;
    const cal = Array.from({ length: 28 }, (_, i) => `<div class="${i + 1 === dom() ? 'today' : ''}${bdays[i + 1] ? ' bd' : ''}"><b>${i + 1}</b>${bdays[i + 1] ? `<small>${esc(bdays[i + 1])}</small>` : ''}</div>`).join('');
    openPanel(`<h2>Quadro de avisos</h2>
      <h3>Pedido de ajuda</h3>${q ? `<div class="item"><img src="${iconURL(q.id)}" alt=""><span class="nm"><b>${NPCS[q.npc].name} precisa de ${item(q.id).name.toLowerCase()}</b><small>${q.done ? 'Já foi entregue. Obrigado!' : `Recompensa: ${fmt(q.reward)} ₲. Segure o item e converse com ${NPCS[q.npc].name}. Vale só hoje.`}</small></span></div>` : '<p>Nenhum pedido hoje.</p>'}
      <h3>${SEASONS[SEASON_ID.indexOf(s)]} · aniversários</h3><div class="cal">${['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map(d => `<div class="hd">${d}</div>`).join('')}${cal}</div>`, 'board');
  }
  function newQuest(nd) {
    const r = srand(nd * 7919 + 13), s = season(nd);
    const pool = [...Object.keys(CROPS).filter(k => CROPS[k].seasons.includes(s)), ...Object.keys(FISH).filter(k => FISH[k].seasons.includes(s) && !FISH[k].where.includes('mine')), 'cobre', 'ferro', 'quartzo', 'carvao', ...(FORAGE[s] || [])];
    const id = pool[Math.floor(r() * pool.length)], npc = Object.keys(NPCS)[Math.floor(r() * 10)];
    return { npc, id, reward: Math.max(150, sellPrice(id) * 3), done: null, day: nd };
  }

  // ================= presente e casamento entre as duas pessoas =================
  function peerAt(px, py) {
    for (const p of peerPlayers()) {
      if (p.me || p.map !== P.map) continue;
      const r = remote.get(p.peer) || p;
      if (Math.hypot(r.x - px, r.y - 10 - py) < 16) return p;
    }
    return null;
  }
  function emitP2P(data) { if (room) room.emit('p2p', { ...data, fromUid: P.uid, from: P.name }).catch(() => toast('Não deu para enviar agora.')); }
  function interactPeer(p) {
    const s = held();
    if (s && s.id === 'alianca') {
      if (P.spouse) { toast('Vocês já são casados! 💕'); return; }
      emitP2P({ type: 'propose', to: p.uid }); toast(`Pedido feito! Esperando ${p.name} responder... 💍`, 'big'); return;
    }
    if (P.spouse === p.uid && !giftable(s)) {
      emitP2P({ type: 'kiss', to: p.uid }); loveFx = 2; sfx.level();
      if (P.flags.kiss !== W.meta.day) { P.flags.kiss = W.meta.day; P.energy = Math.min(P.maxEnergy, P.energy + 30); toast('Um beijinho deu +30 de energia. 💕'); dirty(); }
      return;
    }
    if (giftable(s)) { emitP2P({ type: 'give', to: p.uid, id: s.id, n: 1 }); useHeld(1); sfx.pop(); toast(`Você deu ${item(s.id).name} para ${p.name}.`); return; }
    toast(`Segure um item para dar de presente para ${p.name}.`);
  }
  let loveFx = 0;
  function onP2P(msg) {
    const d = (msg && msg.data) || {};
    if (!P || d.to !== P.uid || msg.sameTab) return;
    switch (d.type) {
      case 'give': if (typeof d.id === 'string' && item(d.id).name !== d.id) { addItem(d.id, clamp(+d.n || 1, 1, 999), true); toast(`${d.from} te deu: ${item(d.id).name}! 🎁`, 'big'); sfx.coin(); } break;
      case 'kiss': loveFx = 2; toast(`${d.from} te deu um beijo! 💕`); break;
      case 'propose': openPanel(`<h2>💍 Um pedido especial</h2><p style="text-align:center" class="big">${esc(d.from)} está pedindo você em casamento!</p><div class="row"><button class="btn g" data-a="wedYes" data-uid="${esc(d.fromUid)}" data-name="${esc(d.from)}" type="button">Aceito!</button><button class="btn" data-a="wedNo" data-uid="${esc(d.fromUid)}" type="button">Ainda não</button></div>`, 'propose'); break;
      case 'wed': if (d.yes) { if (count('alianca')) removeItem('alianca', 1); marry(d.fromUid, d.from); } else toast(`${d.from} pediu um pouco mais de tempo.`); break;
    }
  }
  function marry(uid, name) {
    P.spouse = uid; P.spouseName = name; P.flags.wedDay = W.meta.day; dirty(); savePlayer(); loveFx = 4; sfx.level();
    openPanel(`<h2>💒 Casamento no Vale Doce!</h2><p class="big" style="text-align:center">${esc(P.name)} e ${esc(name)} agora são casados!</p><p style="text-align:center">A vila inteira veio comemorar. Que vocês colham muita felicidade juntos.</p><canvas id="wedcv" width="80" height="44" style="width:240px;height:132px;image-rendering:pixelated;align-self:center" aria-hidden="true"></canvas><div class="row"><button class="btn g" data-a="close" type="button">💕</button></div>`, 'wed');
    const c = $('wedcv'); if (c) { const saved = ctx; ctx = c.getContext('2d'); ctx.fillStyle = '#f8e8f0'; ctx.fillRect(0, 0, 80, 44); drawFarmer(28, 40, P.look, 1, 0); const o = (W.players[uid] || {}).look || {}; drawFarmer(52, 40, o, 1, 0); for (let k = 0; k < 5; k++) drawHeart(16 + k * 12, 6 + (k % 2) * 3); ctx = saved; }
  }
  function drawHeart(x, y, c = '#e83a6a') { R(x - 3, y, 2, 2, c); R(x + 1, y, 2, 2, c); R(x - 3, y + 1, 6, 2, c); R(x - 2, y + 3, 4, 1, c); R(x - 1, y + 4, 2, 1, c); }

  // ================= praia: coletáveis do dia =================
  function beachForage() {
    const out = [], m = MAPS.beach, d = W.meta.day;
    for (let i = 0; i < 6; i++) {
      const x = 2 + Math.floor(hash(d, i, 13) * 36), y = 4 + Math.floor(hash(d, i, 19) * 10);
      if (m.solid[y * m.w + x] || m.at(x, y) !== G.SAND) continue;
      const k = `${d}:beach:${x},${y}`;
      if (W.meta.taken && W.meta.taken[k]) continue;
      out.push({ x, y, id: BEACH_FORAGE[Math.floor(hash(d, i, 23) * BEACH_FORAGE.length)], k });
    }
    return out;
  }

  // ================= virada do dia: animais, capim, árvores, covos =================
  function endDayFarm(t, day, nd, oldS, newS) {
    const b = clone(farmB()), a = clone(farmA()), pots = clone(W.farm.pots || {});
    let hay = W.farm.hay || 0;
    const r = srand(nd * 31 + 7), m = MAPS.farm;
    const grassKeys = Object.keys(t).filter(k => t[k] && t[k].o && t[k].o.k === 'grass');
    const outside = !W.meta.rain && oldS !== 'winter';
    for (const bb of Object.values(b)) if ((bb.type === 'coop' || bb.type === 'barn') && bb.lv === 3 && (!bb.ready || bb.ready <= day)) { const n = Math.min(bCap(bb) - (bb.feed || 0), hay); bb.feed = (bb.feed || 0) + n; hay -= n; }
    for (const an of Object.values(a)) {
      const bb = b[an.b], def = ANIMALS[an.kind];
      if (!bb || !def) continue;
      let fed = false;
      if ((bb.feed || 0) > 0) { bb.feed--; fed = true; }
      else if (outside && grassKeys.length) { const gi = Math.floor(r() * grassKeys.length); delete t[grassKeys[gi]]; grassKeys.splice(gi, 1); fed = true; }
      an.fr = clamp((an.fr || 0) - (an.pet === day ? 0 : 10) - (fed ? 0 : 20), 0, 1000);
      an.age = (an.age || 0) + 1;
      const sp = (SEASON_PROD[an.kind] || [1, 1, 1, 1])[SEASON_ID.indexOf(oldS)], every = Math.max(1, def.every - (sp > 1.1 && def.every > 1 ? 1 : 0));
      if (fed && an.age >= def.mature && nd - (an.last || 0) >= every && r() < sp) {
        let out = def.prod;
        if (def.big && an.fr >= 600 && r() < an.fr / 1500 * Math.max(0.8, sp) * (anyProf('granjeiro') ? 2 : 1)) out = def.big;
        if (def.rare && an.fr >= 800 && r() < 0.15) out = def.rare;
        if (an.kind === 'galinha' && an.v === 1 && out === 'ovo') out = 'ovomarrom';
        if (an.kind === 'porco' && !outside) out = null;
        if (out) {
          an.last = nd;
          const oq = animalQuality(an);
          if (def.tool) an.prod = withQ(out, oq);
          else {
            bb.items = bb.items || {};
            const im = buildAnimalHouse(an.b, bb), free = im.floorTiles.filter(([x, y]) => !bb.items[x + ',' + y]);
            if (free.length) { const [x, y] = free[Math.floor(r() * free.length)]; bb.items[x + ',' + y] = withQ(out, oq); }
          }
        }
      }
    }
    // capim alto cresce e se espalha (menos no inverno)
    const isFree = (x, y) => { const k = x + ',' + y; return !t[k] && !m.solid[y * m.w + x] && [G.GRASS, G.FLOWERS].includes(m.at(x, y)) && !(x >= 5 && x <= 16 && y <= 12) && y !== 19 && x !== 9 && !bGrid().has(k); };
    if (newS !== 'winter') {
      let total = grassKeys.length;
      for (const k of [...grassKeys]) { if (total > 350 || r() > 0.25) continue; const [x, y] = k.split(',').map(Number), [dx, dy] = DIRS[Math.floor(r() * 4)]; if (isFree(x + dx, y + dy)) { t[(x + dx) + ',' + (y + dy)] = { o: { k: 'grass' } }; total++; } }
      for (let i = 0; i < 4; i++) { const x = 3 + Math.floor(r() * 42), y = 3 + Math.floor(r() * 34); if (isFree(x, y)) t[x + ',' + y] = { o: { k: 'grass' } }; }
    }
    // árvores frutíferas
    for (const [k, v] of Object.entries(t)) {
      const o = v && v.o; if (!o || o.k !== 'ftree') continue;
      o.age = (o.age || 0) + 1;
      const gh = k.startsWith('g:');
      if (o.age >= FTREE_DAYS && (gh || FTREES[o.id].season === newS)) o.fr = Math.min(3, (o.fr || 0) + 1); else if (!gh && FTREES[o.id].season !== newS) o.fr = 0;
    }
    // covos
    for (const [k, p] of Object.entries(pots)) if (p.bait && !p.c) { const list = k.startsWith('beach:') ? CRAB_OCEAN : CRAB_FRESH; p.c = list[Math.floor(r() * list.length)]; p.bait = 0; }
    return { b, a, pots, hay };
  }
  // cada pessoa, de manhã: cartas, receitas por nível, avisos de aniversário
  function onNewDayExtra() {
    P.buff = null;
    for (const r of COOK) if (r.learn.startsWith('skill:')) { const [, k, l] = r.learn.split(':'); if (skillLv(P.skills[k]) >= +l && !P.recipes.includes(r.id)) { P.recipes.push(r.id); toast(`Nova receita de cozinha: ${r.name}!`); } }
    checkMail();
    for (const id of Object.keys(NPCS)) if (isBday(id)) setTimeout(() => toast(`Hoje é aniversário de ${NPCS[id].name}! Um presente vale muito mais.`), 2500);
    if (hasUnread()) setTimeout(() => toast('Tem carta nova na caixa de correio!'), 1200);
    if (dom() === 1) sendMail('season:' + W.meta.day, 'Dona Cida', 'Começou uma estação nova e os preços da feira mudaram! ' + SEASON_NEWS[seasonIdx()]);
  }

  // ================= mina: baú e geodos =================
  function openMineChest(n) {
    if (W.meta.chests && W.meta.chests[n]) { toast('O baú está vazio.'); return; }
    const loot = MINE_CHEST[n] || [['barracobre', 3]];
    for (const [id, k] of loot) addItem(id, k);
    W.meta.chests = W.meta.chests || {}; W.meta.chests[n] = P.uid;
    queueUpdate('world/meta', { chests: { [n]: P.uid } });
    sfx.level(); toast(`Tesouro do andar ${n}!`, 'big');
    if (n >= MINE_BOTTOM) setTimeout(() => toast('Você chegou ao fundo da mina! Que aventura!', 'big'), 1500);
  }
  function openGeode(id) {
    const list = GEODE[id]; if (!list || !count(id)) return;
    if (!ccDone('caldeira') && !spend(25)) { toast('Custa 25 ₲.'); return; }
    removeItem(id, 1);
    const [out, n] = list[Math.floor(Math.random() * list.length)];
    addItem(out, n, true); sfx.pick(); toast(`O geodo tinha: ${n > 1 ? n + '× ' : ''}${item(out).name}!`, 'big');
  }

  // ================= desenho extra do mundo =================
  function extraEnts(m, ents, nf, t, x0, x1, y0, y1) {
    if (m.id === 'farm') {
      for (const [bid, b] of Object.entries(farmB())) { const B = BUILDS[b.type]; if (!B || (placing && placing.move === bid)) continue; if ((b.x + B.w) * T < camX - 40 || b.x * T > camX + VW + 40 || (b.y + B.h) * T < camY - 10 || b.y * T > camY + VH + 60) continue; ents.push({ y: (b.y + B.h) * T - 1, f: () => drawFarmBuilding(b, nf) }); }
      for (const [, b] of horsesFree()) { const hx = (b.x + 2) * T, hy = (b.y + 2) * T + 12; ents.push({ y: hy, f: () => drawHorse(hx, hy, 3, false) }); }
      if (hasUnread()) ents.push({ y: 6 * T + 20, f: () => { const b = Math.round(Math.sin(performance.now() / 250) * 1.5); R(14 * T + 4, 6 * T - 22 + b, 8, 12, '#ffffff'); drawText('!', 14 * T + 8, 6 * T - 16 + b, '#e8402a', 10); } });
    }
    for (const [id, a] of animalsOn(m.id)) {
      const s = animState(id, a, m.id), def = ANIMALS[a.kind];
      ents.push({ y: s.y, f: () => { drawAnimal(a, s.x, s.y, s.dir, s.walk, (a.age || 0) < def.mature, a.kind === 'ovelha' && !a.prod); if (s.heart > 0) drawHeart(s.x, s.y - 24 - (1.6 - s.heart) * 6); } });
    }
    if (m.bid) { const b = farmB()[m.bid]; if (b && b.items) for (const [k, id] of Object.entries(b.items)) { const [x, y] = k.split(',').map(Number); ents.push({ y: y * T + 8, f: () => { shadowAt(x * T + 8, y * T + 13, 4, 1.5); drawIconAt(splitQ(id)[0], x * T, y * T - 1); } }); } }
    for (const id of Object.keys(NPCS)) {
      const p = npcPos(id); if (!p || p.map !== m.id) continue;
      const q = W.meta.quest;
      ents.push({ y: p.y, f: () => { drawVillager(id, p.x, p.y, p.dir, p.walk ? t : 0); if (q && q.npc === id && !q.done) { const b = Math.round(Math.sin(t * 4) * 1.5); drawText('!', p.x, p.y - 38 + b, '#ffe04a', 11, '#3b1d0a'); } if (isBday(id)) drawText('🎂', p.x + 8, p.y - 34, '#ffffff', 8); } });
    }
    for (const [k, p] of Object.entries(W.farm.pots || {})) {
      if (!k.startsWith(m.id + ':')) continue;
      const [x, y] = k.slice(m.id.length + 1).split(',').map(Number);
      ents.push({ y: y * T + 10, f: () => drawPot(x * T, y * T, p) });
    }
    for (const a of artifactSpots(m.id)) ents.push({ y: a.y * T + 8, f: () => drawWorms(a.x, a.y) });
    for (const [lx, ly] of m.lanterns || []) ents.push({ y: ly * T + 14, f: () => drawLantern(lx, ly) });
    if (m.id === 'beach') for (const f of beachForage()) ents.push({ y: f.y * T + 13, f: () => drawIconAt(f.id, f.x * T, f.y * T - 2 + Math.sin(t * 2 + f.x) * 1) });
  }
  function drawPlayerEnt(t) {
    const opts = { tool: toolAnim && toolAnim.tool, toolT: toolAnim ? toolAnim.t / toolAnim.dur : 0, toolLv: toolAnim && toolAnim.lv, item: !toolAnim && held() && item(held().id).cat !== 'tool' && !fishing ? held().id : null };
    if (P.ride) { drawHorse(P.x, P.y, P.dir === 2 ? 2 : 3, walkT > 0); drawFarmer(P.x, P.y - 12, P.look, P.dir, 0, opts); }
    else drawFarmer(P.x, P.y, P.look, P.dir, walkT, opts);
    if (loveFx > 0) for (let k = 0; k < 3; k++) drawHeart(P.x - 8 + k * 8, P.y - 40 - ((t * 20 + k * 7) % 14));
  }

  // ================= botões dos painéis novos =================
  let lastShop = 'marta';
  function panelAction2(a, b) {
    const id = b.dataset.id;
    switch (a) {
      case 'talkTo': openTalk(id); break;
      case 'gift': giveGift(id); break;
      case 'sellAnimal': { const an = farmA()[id]; if (!an) { closePanel(); break; } if (b.dataset.sure) { earn(animalValue(an)); setFarm('a', id, null); sfx.coin(); closePanel(); toast(`${an.name} foi para um novo lar. +${fmt(animalValue(an))} ₲`); } else { b.dataset.sure = 1; b.textContent = 'Toque de novo para confirmar'; } break; }
      case 'build': startPlacing(b.dataset.t); break;
      case 'bup': upgradeBuilding(id); renderShop(panelArg); break;
      case 'banimal': { const k = b.dataset.k; lastShop = panelArg; openPanel(`<h2>${ANIMALS[k].name} nova na chacrinha!</h2><label for="anm" style="font-weight:700">Que nome vamos dar?</label><input id="anm" type="text" maxlength="14" value="${pick(ANIMAL_NAMES)}"><div class="row"><button class="btn g" data-a="banimal2" data-k="${k}" type="button">Comprar por ${fmt(animalPrice(k))} ₲</button><button class="btn" data-a="close" type="button">Voltar</button></div>`, 'name', k); break; }
      case 'banimal2': { const back = SHOP_INFO[panelArg] ? panelArg : lastShop; buyAnimal(b.dataset.k, ($('anm') || {}).value); panelArg = back; shopTab = 'animals'; renderShop(back); break; }
      case 'brec': { const r = COOK.find(x => x.id === id); if (r && !P.recipes.includes(id) && spend(r.price)) { P.recipes.push(id); dirty(); sfx.coin(); toast(`Receita aprendida: ${r.name}!`, 'big'); } renderShop(panelArg); break; }
      case 'geode': openGeode(id); renderShop(panelArg); break;
      case 'mailGet': mailGet(+b.dataset.i); break;
      case 'tvLearn': { const rec = TV_RECIPES[weekOf(W.meta.day) % TV_RECIPES.length]; if (!P.recipes.includes(rec.id)) { P.recipes.push(rec.id); dirty(); sfx.level(); toast(`Receita aprendida: ${rec.name}!`, 'big'); } openTV(); break; }
      case 'cook': cookIt(id); break;
      case 'frIn': fridgeMove(+b.dataset.i, true); break;
      case 'frOut': fridgeMove(+b.dataset.i, false); break;
      case 'wedYes': emitP2P({ type: 'wed', to: b.dataset.uid, yes: 1 }); marry(b.dataset.uid, b.dataset.name); break;
      case 'wedNo': emitP2P({ type: 'wed', to: b.dataset.uid, yes: 0 }); closePanel(); break;
      default: panelAction3(a, b);
    }
  }
