  // ================= som =================
  let AC = null, muted = false;
  function initAudio() { if (AC) return; try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  function tone(f1, f2, dur, type = 'square', vol = 0.06, delay = 0) {
    if (!AC || muted) return;
    const t = AC.currentTime + delay, o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(Math.max(30, f2), t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur, vol = 0.12, f = 900) {
    if (!AC || muted) return;
    const b = AC.createBuffer(1, Math.floor(AC.sampleRate * dur), AC.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const s = AC.createBufferSource(), fl = AC.createBiquadFilter(), g = AC.createGain();
    fl.type = 'lowpass'; fl.frequency.value = f; g.gain.value = vol;
    s.buffer = b; s.connect(fl); fl.connect(g); g.connect(AC.destination); s.start();
  }
  const sfx = {
    hoe: () => noise(0.12, 0.15, 500), water: () => noise(0.25, 0.1, 2400), chop: () => { noise(0.08, 0.18, 700); tone(180, 120, 0.08, 'triangle', 0.08); },
    pick: () => { tone(900, 700, 0.06, 'square', 0.05); noise(0.06, 0.1, 3000); }, pop: () => tone(500, 900, 0.1, 'sine', 0.1), coin: () => { tone(1200, 1200, 0.06, 'square', 0.04); tone(1600, 1600, 0.1, 'square', 0.04, 0.06); },
    cast: () => tone(400, 900, 0.2, 'sine', 0.06), bite: () => { tone(900, 900, 0.06, 'square', 0.07); tone(900, 900, 0.06, 'square', 0.07, 0.1); }, catch: () => { tone(600, 1200, 0.15, 'triangle', 0.08); tone(900, 1800, 0.2, 'triangle', 0.08, 0.12); },
    hurt: () => tone(300, 80, 0.2, 'sawtooth', 0.08), hit: () => tone(200, 60, 0.1, 'square', 0.08), level: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, f, 0.15, 'triangle', 0.07, i * 0.1)),
    door: () => noise(0.15, 0.08, 400), eat: () => { noise(0.05, 0.1, 1200); noise(0.05, 0.1, 1200); }, step: () => noise(0.03, 0.02, 600), no: () => tone(200, 150, 0.12, 'square', 0.05),
  };

  // ================= mapa atual e colisão =================
  const mineCache = new Map();
  function getMap(id) {
    if (MAPS[id]) return MAPS[id];
    if (id.startsWith('mine')) {
      const n = +id.slice(4), key = n + ':' + W.meta.day;
      if (!mineCache.has(key)) { if (mineCache.size > 8) mineCache.clear(); mineCache.set(key, buildMineFloor(n, W.meta.day)); }
      return mineCache.get(key);
    }
    if (id.startsWith('b:')) return animalHouseMap(id.slice(2)) || MAPS.farm;
    return MAPS.farm;
  }
  const curMap = () => getMap(P.map);
  const SOLID_OBJ = new Set(['tree', 'stump', 'rock', 'twig', 'weed', 'bau', 'pote', 'barril', 'fornalha', 'espantalho', 'cerca', 'tocha', 'ftree', 'maionesera', 'queijeira', 'tear', 'prensaoleo', 'colmeia', 'defumador']);
  const MACHINES = ['pote', 'barril', 'fornalha', 'maionesera', 'queijeira', 'tear', 'prensaoleo', 'colmeia', 'defumador'];
  const PLACED = ['bau', 'cerca', 'espantalho', 'tocha', 'irrigador', ...MACHINES];
  const mineBroken = {};
  const brokenSet = n => (mineBroken[W.meta.day + ':' + n] = mineBroken[W.meta.day + ':' + n] || new Set());
  // a estufa guarda as plantas no mesmo documento da chacrinha, com chaves "g:x,y"
  const farmable = m => m.id === 'farm' || !!m.gh;
  const KP = m => (m.gh ? 'g:' : '');
  function objAt(m, x, y) {
    const k = x + ',' + y;
    if (farmable(m)) { const t = tile(KP(m) + k); return t && t.o ? t.o : null; }
    if (m.rocks && m.rocks[k] && !brokenSet(m.floor).has(k)) return { k: 'mrock', ...m.rocks[k] };
    return null;
  }
  function solidAt(m, x, y) {
    if (x < 0 || y < 0 || x >= m.w || y >= m.h) return true;
    if (m.solid[y * m.w + x]) return true;
    if (m.id === 'farm') { const g = bGrid().get(x + ',' + y); if (g && !(g.door && bReady(farmB()[g.id]))) return true; }
    const o = objAt(m, x, y);
    return !!(o && (SOLID_OBJ.has(o.k) || o.k === 'mrock'));
  }
  function blocked(m, px, py) {
    for (const [dx, dy] of [[-5, -4], [5, -4], [-5, 0], [5, 0]]) if (solidAt(m, Math.floor((px + dx) / T), Math.floor((py + dy) / T))) return true;
    return false;
  }
  const ptile = () => [Math.floor(P.x / T), Math.floor((P.y - 3) / T)];
  const DIRS = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  function facing() { const [x, y] = ptile(), d = DIRS[P.dir]; return [x + d[0], y + d[1]]; }

  // ================= movimento =================
  const input = { jx: 0, jy: 0, keys: {} };
  let walkT = 0, stepT = 0, toolAnim = null, fishing = null, lockT = 0, fadeT = 0;
  function movePlayer(dt) {
    if (panelOpen || fishing && fishing.phase === 'game') return;
    let dx = input.jx, dy = input.jy;
    if (input.keys.ArrowLeft || input.keys.KeyA) dx -= 1;
    if (input.keys.ArrowRight || input.keys.KeyD) dx += 1;
    if (input.keys.ArrowUp || input.keys.KeyW) dy -= 1;
    if (input.keys.ArrowDown || input.keys.KeyS) dy += 1;
    const len = Math.hypot(dx, dy);
    if (len < 0.2 || lockT > 0) { walkT = 0; return; }
    if (fishing) { fishing = null; toast('Você recolheu a linha.'); }
    dx /= Math.max(1, len); dy /= Math.max(1, len);
    if (Math.abs(dx) > Math.abs(dy)) P.dir = dx > 0 ? 3 : 2; else P.dir = dy > 0 ? 1 : 0;
    const sp = (P.energy <= 0 ? 50 : 82) * (P.ride ? 1.65 : 1) * (1 + 0.1 * buffLv('speed')) * dt, m = curMap();
    const nx = P.x + dx * sp, ny = P.y + dy * sp;
    if (!blocked(m, nx, P.y)) P.x = nx;
    if (!blocked(m, P.x, ny)) P.y = ny;
    walkT += dt; stepT -= dt;
    if (stepT <= 0) { stepT = 0.28; sfx.step(); }
    checkWarp();
    pickupForage();
    pickupFloorItems();
  }
  function checkWarp() {
    const m = curMap(), x = Math.floor(P.x / T), y = Math.floor((P.y - 2) / T);
    if (m.id === 'farm') { const g = bGrid().get(x + ',' + y); if (g && g.door) { const b = farmB()[g.id]; if (bReady(b) && ['coop', 'barn', 'greenhouse'].includes(b.type)) { const im = animalHouseMap(g.id); goMap('b:' + g.id, im.entry[0] * T + 8, im.entry[1] * T + 12, 0); return; } } }
    for (const w of m.warps) if (x >= w.x && x < w.x + (w.w || 1) && y >= w.y && y < w.y + (w.h || 1)) { goMap(w.to, w.tx * T + 8, w.ty * T + 12, w.dir); return; }
  }
  function goMap(id, x, y, dir) {
    sfx.door();
    const fade = document.getElementById('fade');
    fade.style.opacity = 1; lockT = 0.3;
    setTimeout(() => {
      if (P.ride && !getMap(id).outdoor) dismount();
      P.map = id; P.x = x; P.y = y; if (dir !== undefined) P.dir = dir;
      if (id.startsWith('mine') && id !== 'minetop') enterMine(+id.slice(4));
      else monsters = [];
      dirty(); fade.style.opacity = 0;
      document.getElementById('hpBar').hidden = !curMap().cave;
    }, 220);
  }
  // ================= coletáveis da vila =================
  function townForage() {
    const out = [], m = MAPS.town, s = season(), list = FORAGE[s], d = W.meta.day;
    for (let i = 0; i < 5; i++) {
      const x = 1 + Math.floor(hash(d, i, 3) * 47), y = 3 + Math.floor(hash(d, i, 9) * 25);
      if (m.solid[y * m.w + x] || ![G.GRASS, G.FLOWERS].includes(m.at(x, y))) continue;
      const k = `${d}:town:${x},${y}`;
      if (W.meta.taken && W.meta.taken[k]) continue;
      out.push({ x, y, id: list[Math.floor(hash(d, i, 5) * list.length)], k });
    }
    return out;
  }
  function pickupForage() {
    if (P.map !== 'town' && P.map !== 'beach') return;
    const [x, y] = [Math.floor(P.x / T), Math.floor((P.y - 3) / T)];
    for (const f of P.map === 'town' ? townForage() : beachForage()) if (f.x === x && f.y === y) {
      if (!addItem(f.id, 1)) return;
      queueUpdate('world/meta', { taken: { [f.k]: 1 } }); W.meta.taken[f.k] = 1;
      gainXP('foraging', 7); sfx.pop();
    }
  }

  // ================= ação principal =================
  function useEnergy(n) {
    if (P.energy < n && P.energy <= 0) { toast('Sem energia! Coma algo ou vá dormir.'); sfx.no(); return false; }
    P.energy = Math.max(-10, P.energy - n); dirty(); return true;
  }
  function swing(tool, lv) { toolAnim = { tool, lv, t: 0, dur: 0.28 }; lockT = 0.22; }
  function act(target) {
    if (panelOpen || lockT > 0.05) return;
    if (placing) { confirmPlacing(); return; }
    if (fishing) { fishAction(); return; }
    const m = curMap();
    let [tx, ty] = target || facing();
    const k = tx + ',' + ty;
    // gente e bichos na frente
    const d = DIRS[P.dir], fx = P.x + d[0] * 13, fy = P.y - 6 + d[1] * 13;
    if (petCatAt(m, fx, fy)) return;
    const npc = npcAt(m, fx, fy) || npcAt(m, P.x + d[0] * 6, P.y - 6 + d[1] * 6);
    if (npc) { openTalk(npc); return; }
    const pr = peerAt(fx, fy);
    if (pr) { interactPeer(pr); return; }
    if (!P.ride) { const an = animalAt(m, fx, fy) || animalAt(m, P.x + d[0] * 6, P.y - 4 + d[1] * 6); if (an) { interactAnimal(...an); return; } }
    // atalho: se não houver nada na frente, tenta o quadrado onde a pessoa está (colher andando por cima)
    const sp = m.spots[k] || (m.id === 'farm' && m.spots[ptile().join(',')]);
    if (sp && interactSpot(sp)) return;
    if (m.id === 'farm') { const hs = horsesFree().find(([, b]) => Math.hypot((b.x + 2) * T - fx, (b.y + 2) * T + 4 - fy) < 18); if (hs && !P.ride) { mount(); return; } }
    if (P.ride) { dismount(); return; }
    if (interactPot(m, tx, ty)) return;
    if (m.id === 'farm' && interactBuilding(tx, ty)) return;
    if (m.ladder === k) { goMap('mine' + (m.floor + 1), 0, 0, 1); return; }
    if (farmable(m) && interactFarm(tx, ty, m)) return;
    useItem(m, tx, ty);
  }
  function interactSpot(sp) {
    switch (sp.kind) {
      case 'bin': {
        const s = held();
        if (s && stackable(s.id) && sellPrice(s.id) > 0) { P.ship.push({ id: s.id, n: s.n, p: sellPrice(s.id) }); recordSold(s.id, s.n); toast(`${s.n}× ${item(s.id).name} na caixa (${fmt(sellPrice(s.id))} ₲ cada, preço de hoje). Paga de manhã.`); P.inv[P.sel] = null; dirty(); renderHotbar(); sfx.pop(); }
        else openShipInfo();
        return true;
      }
      case 'bed': openSleep(); return true;
      case 'shop': { const pos = npcPos(sp.who), [o, c] = SHOP_HOURS(NPCS[sp.who].shop); if (!pos || pos.map !== curMap().id) { toast(`${NPCS[sp.who].name} não está agora. Horário: ${o / 60}h às ${c / 60 % 24}h.`); return true; } openShop(sp.who); return true; }
      case 'mail': openMail(); return true;
      case 'cc': openCC(sp.room); return true;
      case 'museum': openMuseum(); return true;
      case 'minecart': openCarts(); return true;
      case 'basin': { const s = held(); if (s && s.id === 'can') { swing('can', s.lv || 0); P.water = canCap(s.lv || 0); toast('Regador cheio!'); sfx.water(); dirty(); } else toast('Uma pia para encher o regador.'); return true; }
      case 'tv': openTV(); return true;
      case 'fridge': renderFridge(); return true;
      case 'stove': openCooking(); return true;
      case 'board': openBoard(); return true;
      case 'mchest': openMineChest(sp.floor); return true;
      case 'hopper': case 'trough': { const m = curMap(), b = farmB()[m.bid]; if (!b) return true; const s = held(); feedTroughs(b, m.bid, sp.kind === 'trough' && s && s.id === 'feno' ? 1 : 0); return true; }
      case 'down': goMap('mine' + sp.floor, 0, 0, 1); return true;
      case 'up': goMap('minetop', 8 * T + 8, 5 * T + 4, 1); return true;
      case 'elevator': openElevator(); return true;
    }
    return false;
  }
  function interactFarm(tx, ty, m) {
    const k = KP(m) + tx + ',' + ty, tl = tile(k);
    if (!tl) return false;
    const o = tl.o, c = tl.c;
    if (c && !c.dead) { const d = CROPS[c.id]; if (c.g >= d.days && !(c.rg > 0)) { harvest(k, tl); return true; } }
    if (o) {
      if (o.k === 'forage') { if (addItem(o.id, 1)) { setTile(k, null); gainXP('foraging', 7); sfx.pop(); } return true; }
      if (o.k === 'bau') { openChest(k); return true; }
      if (MACHINES.includes(o.k)) return machine(k, tl, o);
      if (o.k === 'ftree' && o.fr > 0) { if (addItem(o.id, o.fr)) { setTile(k, { ...tl, o: { ...o, fr: 0 } }); gainXP('foraging', 3 * o.fr); sfx.pop(); } return true; }
      if (o.k === 'ftree') { toast(o.age < 28 ? `${FTREES[o.id].name}: cresce mais ${28 - o.age} dia${28 - o.age === 1 ? '' : 's'}.` : `${FTREES[o.id].name}: dá frutas no ${SEASONS[SEASON_ID.indexOf(FTREES[o.id].season)].toLowerCase()}.`); return true; }
      if (o.k === 'tree' && o.tap && o.tap.ready <= gm()) { if (addItem(o.tap.out, 1)) { setTile(k, { ...tl, o: { ...o, tap: { out: o.tap.out, ready: gm() + TAPS[(o.v || 0) % 3].days * 1440 } } }); gainXP('foraging', 5); sfx.pop(); } return true; }
    }
    return false;
  }
  function harvest(k, tl) {
    const c = tl.c, d = CROPS[c.id];
    let n = d.n || 1; if (d.extra && Math.random() < d.extra) n++;
    if (!addItem(d.mix ? pick(FORAGE.winter) : c.id, n)) return;
    gainXP('farming', Math.round(16 * Math.log(0.018 * d.sell + 1)));
    sfx.pop();
    const nt = clone(tl);
    if (d.regrow) { nt.c.rg = d.regrow; nt.c.harvested = true; } else delete nt.c;
    setTile(k, nt);
  }
  function machine(k, tl, o) {
    if (o.in && o.ready <= gm()) {
      if (o.k === 'colmeia') { if (season() === 'winter' && !k.startsWith('g:')) { toast('As abelhas estão hibernando. Voltam na primavera!'); return true; } o = { ...o, out: honeyAt(k) }; }
      if (!addItem(o.out, o.outN || 1)) return true;
      gainXP(o.k === 'fornalha' ? 'mining' : 'farming', 5); sfx.pop();
      setTile(k, { ...clone(tl), o: o.k === 'colmeia' ? { k: o.k, in: 'flor', out: 'mel', ready: gm() + 4 * 1440 } : { k: o.k } });
      return true;
    }
    if (o.in) { const mins = o.ready - gm(); toast(`${item(o.out).name}: fica pronto em ${mins >= 60 ? Math.ceil(mins / 60) + ' h' : mins + ' min'}.`); return true; }
    const s = held();
    if (!s) { toast(item(o.k).desc); return true; }
    let out = null, time = 0, n = 1;
    if (o.k === 'pote') { if (isFruit(s.id)) out = 'geleia:' + s.id; else if (isVeg(s.id)) out = 'conserva:' + s.id; time = 1200; }
    if (o.k === 'barril' && item(s.id).kind === 'mel') { out = 'hidromel'; time = 600; }
    else if (o.k === 'barril') { if (isFruit(s.id)) { out = 'vinho:' + s.id; time = 2400; } else if (isVeg(s.id)) { out = 'suco:' + s.id; time = 1200; } }
    const simple = { maionesera: [{ ovo: 'maionese', ovomarrom: 'maionese', ovogrande: 'maionese', ovopato: 'maionesepato' }, 180], queijeira: [{ leite: 'queijo', leitegrande: 'queijo', leitecabra: 'queijocabra', leitecabragrande: 'queijocabra' }, 200], tear: [{ la: 'tecido' }, 240], prensaoleo: [{ trufa: 'oleotrufa' }, 360], defumador: [{ carnebovina: 'charque', carnesuina: 'bacon' }, 480] }[o.k];
    if (simple) { out = simple[0][s.id]; time = simple[1]; if (!out) { toast(item(o.k).desc); sfx.no(); return true; } }
    const outN = ['ovogrande', 'leitegrande', 'leitecabragrande'].includes(s.id) ? 2 : 1;
    if (o.k === 'fornalha') {
      const bar = { cobre: ['barracobre', 30], ferro: ['barraferro', 120], ouro: ['barraouro', 300] }[s.id];
      if (bar) { if (s.n < 5 || count('carvao') < 1) { toast('A fornalha precisa de 5 minérios e 1 carvão.'); return true; } removeItem(s.id, 5); removeItem('carvao', 1); out = bar[0]; time = bar[1]; n = 0; }
      else { toast('Coloque minério (com carvão na mochila).'); return true; }
    }
    if (!out) { toast(o.k === 'pote' || o.k === 'barril' ? 'Coloque uma fruta ou um legume.' : 'Isso não serve aqui.'); sfx.no(); return true; }
    if (n) useHeld(1);
    item(out);
    setTile(k, { ...clone(tl), o: { k: o.k, in: s.id, out, ready: gm() + time, outN: outN > 1 && simple ? outN : undefined } });
    toast(`${item(out).name} vai ficar pronto em ${time >= 60 ? Math.round(time / 60) + ' h' : time + ' min'}.`);
    sfx.pop();
    return true;
  }
  function useItem(m, tx, ty) {
    const s = held();
    if (!s) return;
    const it = item(s.id), k0 = tx + ',' + ty, k = KP(m) + k0, lv = s.lv || 0, power = 1 + lv;
    if (it.cat === 'tool') {
      const isWater = m.at(tx, ty) === G.WATER;
      if (s.id === 'rod') { startFishing(m); return; }
      if (s.id === 'balde' || s.id === 'tesoura') { toast(s.id === 'balde' ? 'Fique de frente para uma vaca ou cabra.' : 'Fique de frente para uma ovelha.'); return; }
      if (s.id === 'sword') { swing('sword', lv); swordHit(); return; }
      if (s.id === 'scythe') { swing('scythe', lv); scythe(m, tx, ty); return; }
      if (s.id === 'can' && isWater) { swing('can', lv); P.water = canCap(lv); toast('Regador cheio!'); sfx.water(); dirty(); return; }
      if (!useEnergy(s.id === 'can' ? 1 : Math.max(1, 2 - (buffLv('farming') && s.id === 'hoe' ? 1 : 0)))) return;
      swing(s.id, lv);
      if (s.id === 'hoe' && digArtifact(m, tx, ty)) return;
      if (m.rocks) { mineHit(m, tx, ty, s.id, power + (buffLv('mining') ? 1 : 0)); return; }
      if (!farmable(m)) { sfx.no(); return; }
      const tl = tile(k), o = tl && tl.o;
      if (s.id === 'hoe') {
        if (!o && !(tl && tl.s) && !solidAt(m, tx, ty) && [G.GRASS, G.DIRT, G.FLOWERS].includes(m.at(tx, ty)) && !m.spots[k0] && !m.warps.some(w => tx >= w.x && tx < w.x + (w.w || 1) && ty >= w.y && ty < w.y + (w.h || 1))) { setTile(k, { ...(tl || {}), s: 1 }); sfx.hoe(); }
        else if (o && (o.k === 'weed' || o.k === 'grass')) { setTile(k, null); sfx.hoe(); }
        else sfx.no();
        return;
      }
      if (s.id === 'can') {
        if (P.water <= 0) { toast('O regador está vazio. Encha na lagoa.'); P.energy += 1; return; }
        P.water--; sfx.water();
        if (tl && tl.s) setTile(k, { ...tl, w: W.meta.day });
        dirty(); return;
      }
      if (s.id === 'axe') {
        if (!o) { sfx.no(); return; }
        if (o.k === 'tree' || o.k === 'ftree') {
          const hp = (o.hp || 10) - power; sfx.chop();
          if (o.k === 'ftree' && o.age < 7) { setTile(k, null); addItem('m_' + o.id, 1); return; }
          if (hp <= 0 && o.tap) addItem('extrator', 1);
          if (hp <= 0) { setTile(k, { o: { k: 'stump', hp: 5 } }); addItem('madeira', rint(8, 12)); if (Math.random() < 0.7) addItem('seiva', rint(1, 3)); gainXP('foraging', 12); toast('Árvore derrubada!'); }
          else setTile(k, { ...tl, o: { ...o, hp, shake: performance.now() + 300 } });
          return;
        }
        if (o.k === 'stump') { const hp = o.hp - power; sfx.chop(); if (hp <= 0) { setTile(k, null); addItem('madeira', rint(3, 5)); gainXP('foraging', 5); } else setTile(k, { ...tl, o: { ...o, hp } }); return; }
        if (o.k === 'twig') { setTile(k, null); addItem('madeira', 1); sfx.chop(); return; }
        if (o.k === 'weed') { setTile(k, null); sfx.chop(); return; }
        if (PLACED.includes(o.k)) { pickUpPlaced(k, tl, o); return; }
        if (o.k === 'grass') { setTile(k, null); sfx.chop(); return; }
        sfx.no(); return;
      }
      if (s.id === 'pick') {
        if (o && o.k === 'rock') { const hp = o.hp - power; sfx.pick(); if (hp <= 0) { setTile(k, null); addItem('pedra', rint(1, 3)); gainXP('mining', 1); } else setTile(k, { ...tl, o: { ...o, hp } }); return; }
        if (o && o.k === 'twig') { setTile(k, null); addItem('madeira', 1); return; }
        if (o && PLACED.includes(o.k)) { pickUpPlaced(k, tl, o); return; }
        if (tl && tl.s && !tl.c) { setTile(k, tl.f ? { f: 1 } : null); sfx.hoe(); return; }
        if (tl && tl.f && !o && !tl.s) { setTile(k, null); addItem('caminho', 1); return; }
        sfx.no(); return;
      }
      return;
    }
    if (it.cat === 'seed') {
      if (!farmable(m)) { toast('Plante as sementes na chacrinha ou na estufa.'); return; }
      const tl = tile(k), c = CROPS[it.crop];
      if (!tl || !tl.s) { toast('Prepare a terra com a enxada primeiro.'); sfx.no(); return; }
      if (tl.c) { sfx.no(); return; }
      if (!m.gh && !c.seasons.includes(season())) { toast(`${c.name} não cresce nesta estação. Na estufa cresce o ano todo!`); sfx.no(); return; }
      setTile(k, { ...tl, c: { id: it.crop, g: 0 } }); useHeld(1); sfx.hoe();
      return;
    }
    if (it.cat === 'sapling') {
      if (!farmable(m)) { toast('Plante a muda na chacrinha ou na estufa.'); return; }
      const tl = tile(k);
      if (solidAt(m, tx, ty) || (tl && (tl.o || tl.c || tl.s)) || ![G.GRASS, G.DIRT, G.FLOWERS, ...(m.gh ? [G.COBBLE] : [])].includes(m.at(tx, ty)) || m.spots[k0]) { toast('Plante num lugar livre.'); sfx.no(); return; }
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const t2 = tile(KP(m) + (tx + dx) + ',' + (ty + dy)); if ((dx || dy) && ((t2 && t2.o && ['tree', 'ftree', 'stump'].includes(t2.o.k)) || (!m.gh && bGrid().has((tx + dx) + ',' + (ty + dy))))) { toast('A muda precisa de espaço livre em volta.'); sfx.no(); return; } }
      setTile(k, { o: { k: 'ftree', id: it.tree, age: 0, fr: 0, hp: 10 } }); useHeld(1); sfx.hoe(); toast('Muda plantada! Em 28 dias vira árvore.');
      return;
    }
    if (s.id === 'extrator') {
      const tl = tile(k), o = tl && tl.o;
      if (m.id !== 'farm' || !o || o.k !== 'tree') { toast('Coloque o extrator numa árvore da chacrinha.'); sfx.no(); return; }
      if (o.tap) { toast('Essa árvore já tem um extrator.'); return; }
      const tp = TAPS[(o.v || 0) % 3];
      setTile(k, { ...tl, o: { ...o, tap: { out: tp.out, ready: gm() + tp.days * 1440 } } }); useHeld(1); sfx.hoe();
      toast(`Extrator colocado: ${item(tp.out).name.toLowerCase()} em ${tp.days} dias.`);
      return;
    }
    if (s.id === 'covo') { toast('Fique de frente para a água para colocar o covo.'); return; }
    if (it.cat === 'place') {
      if (!farmable(m)) { toast('Coloque isso na chacrinha.'); return; }
      const tl = tile(k);
      if (solidAt(m, tx, ty) || (tl && (tl.o || tl.c)) || m.spots[k0] || [G.WATER, G.FOREST].includes(m.at(tx, ty))) { toast('Não dá para colocar aqui.'); sfx.no(); return; }
      if (s.id === 'caminho') { if (tl && tl.s) { toast('Desfaça a terra arada antes.'); return; } setTile(k, { f: 1 }); useHeld(1); sfx.hoe(); return; }
      if (s.id !== 'irrigador' && tl && tl.s) { toast('Não dá para colocar em terra arada.'); return; }
      const o = { k: s.id };
      if (s.id === 'bau') o.items = Array(36).fill(null);
      if (s.id === 'colmeia') Object.assign(o, { in: 'flor', out: 'mel', ready: gm() + 4 * 1440 });
      setTile(k, { ...(tl || {}), o }); useHeld(1); sfx.hoe();
      if (s.id === 'pote') toast('Pote colocado! Segure uma fruta ou legume e toque em Usar no pote.');
      return;
    }
    if (it.energy) { openEat(); return; }
    toast('Venda isso na caixa de envio ao lado da casa.');
  }
  function pickUpPlaced(k, tl, o) {
    if (o.k === 'bau' && o.items && o.items.some(Boolean)) { toast('Esvazie o baú antes de recolher.'); return; }
    if (o.in && o.ready > gm()) { toast('Espere terminar antes de recolher.'); return; }
    if (o.in) addItem(o.out, 1);
    addItem(o.k, 1); setTile(k, tl.s ? { s: 1, w: tl.w } : null); sfx.pick();
  }
  function scythe(m, tx, ty) {
    let hit = false;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const x = tx + (P.dir >= 2 ? 0 : dx), y = ty + (P.dir >= 2 ? dy : 0);
      if (P.dir >= 2 && dx || P.dir < 2 && dy) continue;
      const k = KP(m) + x + ',' + y, tl = farmable(m) ? tile(k) : null;
      if (!tl) continue;
      if (tl.o && tl.o.k === 'weed') { setTile(k, null); if (Math.random() < 0.6) addItem('fibra', 1, true); hit = true; }
      else if (tl.o && tl.o.k === 'grass') { setTile(k, null); hit = true; if ((W.farm.hay || 0) < siloCap() && Math.random() < 0.6) { setFarmVal('hay', (W.farm.hay || 0) + 1); pickupNote('feno', 1); } }
      else if (tl.c && tl.c.dead) { setTile(k, { ...tl, c: undefined }); hit = true; }
      else if (tl.c) { const d = CROPS[tl.c.id]; if (tl.c.g >= d.days && !(tl.c.rg > 0)) { harvest(k, tl); hit = true; } }
    }
    if (hit) sfx.chop(); else noise(0.1, 0.05, 2000);
    if (P.map === 'town') { /* mato da vila é decorativo */ }
  }
  function openEat() {
    const s = held(), it = item(s.id);
    openPanel(`<h2>Comer ${it.name}?</h2><p style="text-align:center">Recupera <b>${it.energy}</b> de energia${it.energy > 30 ? ' e um pouco de vida' : ''}.</p>
      <div class="row"><button class="btn g" data-a="eat" type="button">Comer</button><button class="btn" data-a="close" type="button">Agora não</button></div>`);
  }
  function eatHeld() {
    const s = held(); if (!s) return;
    const it = item(s.id);
    P.energy = Math.min(P.maxEnergy, P.energy + it.energy); P.hp = Math.min(100, P.hp + Math.round(it.energy * 0.45));
    afterEat(s.id); useHeld(1); sfx.eat(); closePanel();
  }

  // ================= mina =================
  let monsters = [], hurtT = 0;
  function enterMine(n) {
    const m = getMap('mine' + n);
    P.x = m.start[0] * T + 8; P.y = m.start[1] * T + 12; P.dir = 1;
    P.mineFloor = Math.max(P.mineFloor || 0, n);
    if (n % 5 === 0 && n > (W.meta.mineMax || 0)) { W.meta.mineMax = n; queueUpdate('world/meta', { mineMax: n }); toast(`O elevador agora chega ao andar ${n}!`); }
    const r = srand(m.monSeed), list = [];
    if (n % 5 !== 0) {
      const cnt = Math.min(11, 2 + Math.floor(n / 8) + Math.floor(r() * 3));
      for (let i = 0; i < cnt; i++) {
        let x, y, tries = 0;
        do { x = 1 + Math.floor(r() * (m.w - 2)); y = 1 + Math.floor(r() * (m.h - 2)); tries++; } while ((solidAt(m, x, y) || Math.hypot(x - m.start[0], y - m.start[1]) < 5) && tries < 40);
        const q = r(), kind = m.tier === 0 ? (n >= 20 && q < 0.25 ? 'bat' : 'slime') : m.tier === 1 ? (q < 0.35 ? 'duster' : q < 0.55 ? 'bat' : 'slime') : (q < 0.4 ? 'ghost' : q < 0.7 ? 'bat' : 'slime');
        const bat = kind === 'bat';
        const hp = ({ bat: 8, duster: 6, ghost: 14 }[kind] || 10) + n;
        list.push({ kind, x: x * T + 8, y: y * T + 12, hp, max: hp, dmg: 5 + Math.floor(n / 5), col: ['#5ad84a', '#4a8ae8', '#b05ae0'][m.tier], ph: r() * 10, vx: 0, vy: 0, cd: 0, hitT: 0, hopT: r() * 2 });
      }
    }
    monsters = list;
    if (n === 1 && !P.stats.mineIntro) { P.stats.mineIntro = 1; toast('Quebre pedras com a picareta. Uma delas esconde a escada para descer.'); }
  }
  function mineHit(m, tx, ty, tool, power) {
    const k = tx + ',' + ty, r = m.rocks[k];
    if (!r || brokenSet(m.floor).has(k)) { sfx.no(); return; }
    if (tool !== 'pick') { sfx.no(); toast('Use a picareta nas pedras.'); return; }
    r.hp -= power; sfx.pick();
    if (r.hp > 0) return;
    breakRock(m, k, true);
  }
  function breakRock(m, k, mine) {
    const set = brokenSet(m.floor);
    if (set.has(k)) return;
    set.add(k);
    const r = m.rocks[k];
    if (mine) {
      addItem('pedra', 1, true);
      if (r.kind === 'coal') addItem('carvao', rint(1, 2));
      else if (['cobre', 'ferro', 'ouro'].includes(r.kind)) addItem(r.kind, rint(1, 3));
      else if (r.kind.startsWith('gem')) addItem(r.kind.split(':')[1], 1);
      else if (Math.random() < 0.04) addItem('carvao', 1);
      if (r.kind === 'stone' && Math.random() < 0.025 + (W.meta.luck || 0) * 0.1 + buffLv('luck') * 0.01) addItem(['geodo', 'geodogelo', 'geodomagma'][m.tier || 0], 1);
      gainXP('mining', r.kind === 'stone' ? 1 : 5);
      let ladder = null;
      if (!m.ladder && m.floor < MINE_BOTTOM) {
        const left = m.total - set.size;
        const p = 0.02 + 0.9 / Math.max(3, left) + (set.size / m.total) * 0.12;
        if (Math.random() < p || left <= 2) { ladder = k; m.ladder = k; toast('Você achou a escada para descer!'); sfx.level(); }
      }
      if (room) room.emit('mine', { d: W.meta.day, f: m.floor, k, ladder }).catch(() => {});
    }
  }
  function swordHit() {
    const lv = (held() && held().lv) || 0, d = DIRS[P.dir], cx = P.x + d[0] * 14, cy = P.y - 8 + d[1] * 14;
    let any = false;
    for (const mo of monsters) {
      if (Math.hypot(mo.x - cx, mo.y - 6 - cy) < 20) {
        mo.hp -= 4 + lv * 3 + skillLv(P.skills.combat) + buffLv('attack') * 2; mo.hitT = 0.15; mo.vx = d[0] * 160; mo.vy = d[1] * 160; any = true;
        if (mo.hp <= 0) { mo.dead = true; gainXP('combat', mo.kind === 'slime' ? 5 : 6); const drop = { bat: 'asamorcego', slime: 'gosma', duster: 'carvao', ghost: 'ectoplasma' }[mo.kind]; if (Math.random() < 0.6) addItem(drop, 1); if (Math.random() < 0.08 && !curMap().ladder && curMap().floor < MINE_BOTTOM) { const m = curMap(), [x, y] = [Math.floor(mo.x / T), Math.floor((mo.y - 4) / T)]; if (!solidAt(m, x, y)) { m.ladder = x + ',' + y; toast('Uma escada apareceu!'); } } }
      }
    }
    monsters = monsters.filter(m => !m.dead);
    if (any) sfx.hit(); else noise(0.08, 0.05, 2500);
    if (P.map === 'farm') { const [tx, ty] = facing(), k = tx + ',' + ty, tl = tile(k); if (tl && tl.o && tl.o.k === 'weed') { setTile(k, null); if (Math.random() < 0.5) addItem('fibra', 1, true); } }
  }
  function updateMonsters(dt) {
    const m = curMap();
    if (!m.rocks) return;
    hurtT -= dt;
    for (const mo of monsters) {
      mo.hitT -= dt;
      const dx = P.x - mo.x, dy = P.y - mo.y, dist = Math.hypot(dx, dy) || 1;
      if (mo.kind === 'slime' || mo.kind === 'duster') {
        mo.hopT -= dt;
        const fast = mo.kind === 'duster';
        if (mo.hopT <= 0 && dist < 120) { mo.hopT = fast ? rnd(0.35, 0.7) : rnd(0.7, 1.4); mo.vx = dx / dist * (fast ? 110 : 70); mo.vy = dy / dist * (fast ? 110 : 70); }
      } else if (mo.kind === 'ghost') { mo.vx += (dx / dist * 38 + Math.sin(performance.now() / 300 + mo.ph) * 30 - mo.vx) * dt * 1.5; mo.vy += (dy / dist * 38 - mo.vy) * dt * 1.5; } else { mo.vx += (dx / dist * 60 + rnd(-40, 40) - mo.vx) * dt * 2; mo.vy += (dy / dist * 60 + rnd(-40, 40) - mo.vy) * dt * 2; }
      const nx = mo.x + mo.vx * dt, ny = mo.y + mo.vy * dt;
      const flies = mo.kind === 'bat' || mo.kind === 'ghost';
      if (flies || !solidAt(m, Math.floor(nx / T), Math.floor((mo.y - 3) / T))) mo.x = clamp(nx, T, (m.w - 1) * T);
      if (flies || !solidAt(m, Math.floor(mo.x / T), Math.floor((ny - 3) / T))) mo.y = clamp(ny, T, (m.h - 1) * T);
      mo.vx *= Math.pow(0.05, dt); mo.vy *= Math.pow(0.05, dt);
      if (dist < 12 && hurtT <= 0) {
        hurtT = 0.9; P.hp -= Math.max(1, mo.dmg - buffLv('defense')); sfx.hurt(); P.x += dx / dist * 10; P.y += dy / dist * 10;
        if (blocked(m, P.x, P.y)) { P.x -= dx / dist * 10; P.y -= dy / dist * 10; }
        if (P.hp <= 0) { P.hp = 40; P.energy = Math.max(10, P.energy - 40); toast('Você desmaiou e acordou na entrada da mina.'); goMap('minetop', 8 * T + 8, 5 * T + 4, 1); }
        dirty();
      }
    }
  }

  // ================= pesca =================
  function waterAhead(m) {
    const d = DIRS[P.dir], [x, y] = ptile();
    for (let i = 1; i <= 3; i++) { const tx = x + d[0] * i, ty = y + d[1] * i; if (m.at(tx, ty) === G.WATER) return [tx, ty]; if (solidAt(m, tx, ty) && m.at(tx, ty) !== G.WATER) return null; }
    return null;
  }
  function startFishing(m) {
    const w = waterAhead(m);
    if (!w) { toast('Fique de frente para a água para pescar.'); sfx.no(); return; }
    if (!useEnergy(4)) return;
    swing('rod', 0);
    const bait = count('isca') > 0; if (bait) removeItem('isca', 1);
    fishing = { phase: 'wait', t: rnd(1.5, 5.5) * (bait ? 0.5 : 1), bx: w[0] * T + 8, by: w[1] * T + 8, water: m.water };
    sfx.cast();
  }
  function pickFish(water) {
    const s = season(), min = nowMin(), opts = Object.entries(FISH).filter(([, f]) => f.where.includes(water) && f.seasons.includes(s) && (!f.from || min >= f.from) && (!f.to || min <= f.to) && (!f.rain || W.meta.rain || Math.random() < 0.3));
    if (!opts.length) return 'carpa';
    const w = opts.map(([k, f]) => [k, 120 - f.diff]), tot = w.reduce((a, x) => a + x[1], 0);
    let r = Math.random() * tot;
    for (const [k, v] of w) { r -= v; if (r <= 0) return k; }
    return opts[0][0];
  }
  function updateFishing(dt) {
    if (!fishing) return;
    const f = fishing;
    if (f.phase === 'wait') { f.t -= dt; if (f.t <= 0) { f.phase = 'bite'; f.t = 1.1; sfx.bite(); if (navigator.vibrate) try { navigator.vibrate(80); } catch (e) {} } }
    else if (f.phase === 'bite') { f.t -= dt; if (f.t <= 0) { fishing = null; toast('O peixe escapou. Toque em Usar quando aparecer o “!”.'); } }
    else if (f.phase === 'game') updateFishGame(dt);
  }
  function fishAction() {
    const f = fishing;
    if (f.phase === 'wait') { fishing = null; toast('Você recolheu a linha.'); return; }
    if (f.phase === 'bite') {
      const id = pickFish(f.water), d = FISH[id];
      f.phase = 'game'; f.id = id; f.diff = d.diff;
      const lv = skillLv(P.skills.fishing);
      f.barH = 30 + lv * 2.5 + buffLv('fishing') * 4; f.bar = 120 - f.barH - 2; f.bv = 0; f.fy = 80; f.fv = 0; f.target = 60; f.prog = 0.3; f.hold = false; f.tt = 0;
      document.getElementById('fish').hidden = false;
    }
  }
  function updateFishGame(dt) {
    const f = fishing;
    f.tt += dt;
    const accel = f.hold ? -260 : 200;
    f.bv = clamp(f.bv + accel * dt, -140, 160); f.bar += f.bv * dt;
    if (f.bar < 2) { f.bar = 2; f.bv = Math.max(0, f.bv) * 0.3; }
    if (f.bar > 118 - f.barH) { f.bar = 118 - f.barH; f.bv = -Math.abs(f.bv) * 0.35; }
    if (Math.random() < dt * (0.6 + f.diff / 40)) f.target = clamp(f.fy + rnd(-1, 1) * (20 + f.diff), 6, 112);
    f.fv += ((f.target - f.fy) * (1 + f.diff / 30) - f.fv * 3) * dt; f.fy = clamp(f.fy + f.fv * dt, 4, 114);
    const inside = f.fy > f.bar && f.fy < f.bar + f.barH;
    f.prog = clamp(f.prog + (inside ? 0.34 : -0.24 - f.diff / 600) * dt, 0, 1);
    drawFishGame();
    if (f.prog >= 1) {
      document.getElementById('fish').hidden = true;
      if (addItem(f.id, 1)) { P.stats.fish = (P.stats.fish || 0) + 1; gainXP('fishing', Math.round(3 + f.diff / 3)); sfx.catch(); toast(`Você pescou: ${FISH[f.id].name}!`, 'big', f.id); }
      fishing = null;
    } else if (f.prog <= 0) { document.getElementById('fish').hidden = true; fishing = null; toast('O peixe escapou!'); sfx.no(); }
  }
  const fcv = document.getElementById('fishcv'), fctx = fcv.getContext('2d');
  function drawFishGame() {
    const f = fishing, c = fctx;
    c.clearRect(0, 0, 50, 120);
    c.fillStyle = '#6b3410'; c.fillRect(0, 0, 50, 120);
    c.fillStyle = '#e09c4a'; c.fillRect(1, 1, 48, 118);
    c.fillStyle = '#2a6ab8'; c.fillRect(6, 2, 22, 116);
    c.fillStyle = '#3a8ad8'; for (let y = 4; y < 118; y += 10) c.fillRect(8, y + (Math.floor(f.tt * 6) % 10), 18, 2);
    c.fillStyle = (f.fy > f.bar && f.fy < f.bar + f.barH) ? '#7ae84a' : '#5ab83a'; c.fillRect(7, Math.round(f.bar), 20, Math.round(f.barH));
    c.fillStyle = '#ffffff55'; c.fillRect(7, Math.round(f.bar), 20, 2);
    const fx = 12, fy = Math.round(f.fy) - 4;
    c.drawImage(iconCanvas(f.id), fx - 3 + Math.round(Math.sin(f.tt * 9)), fy - 4);
    c.fillStyle = '#3a1a0a'; c.fillRect(33, 2, 12, 116);
    const ph = Math.round(114 * f.prog);
    c.fillStyle = f.prog > 0.66 ? '#5ad84a' : f.prog > 0.33 ? '#f4c83a' : '#e8502a'; c.fillRect(35, 116 - ph, 8, ph);
  }

  // ================= virada do dia =================
  let ending = false;
  async function endDay(passOut) {
    if (ending || !host) return;
    ending = true;
    try {
      const day = W.meta.day, nd = day + 1, oldS = season(day), newS = season(nd), late = nowMin() >= DAY_END;
      const rainToday = W.meta.rain && !W.meta.snow;
      const t = clone(W.farm.t), m = MAPS.farm;
      const scare = Object.entries(t).filter(([k, v]) => v && v.o && v.o.k === 'espantalho' && !k.startsWith('g:')).map(([k]) => k.split(',').map(Number));
      const sprinklers = Object.entries(t).filter(([, v]) => v && v.o && v.o.k === 'irrigador').map(([k]) => { const pre = k.startsWith('g:') ? 'g:' : ''; return [pre, ...k.slice(pre.length).split(',').map(Number)]; });
      let crows = 0;
      for (const [k, v] of Object.entries(t)) {
        if (!v) { delete t[k]; continue; }
        const gh = k.startsWith('g:');
        if (v.c && !v.c.dead) {
          const d = CROPS[v.c.id];
          if (!d) { delete v.c; continue; }
          if (!gh && newS !== oldS && !d.seasons.includes(newS)) { v.c.dead = true; continue; }
          if (v.w === day || (rainToday && !gh)) {
            if (v.c.rg > 0) v.c.rg--; else if (v.c.g < d.days) v.c.g++;
          }
          if (gh) continue;
          const [x, y] = k.split(',').map(Number);
          if (!scare.some(([sx, sy]) => Math.hypot(sx - x, sy - y) <= 8) && Math.random() < 0.012) { delete v.c; crows++; }
        } else if (!gh && v.s && !v.c && !v.o && v.w !== day && !rainToday && Math.random() < (oldS === 'summer' ? 0.2 : 0.12)) { delete v.s; delete v.w; if (!v.f) delete t[k]; }
      }
      for (const [pre, x, y] of sprinklers) for (const [dx, dy] of DIRS) { const k = pre + (x + dx) + ',' + (y + dy); if (t[k] && t[k].s) t[k].w = nd; }
      // mato e coletáveis novos
      const r = srand(nd * 977);
      const free = (x, y) => { const k = x + ',' + y; return !t[k] && !m.solid[y * m.w + x] && [G.GRASS, G.FLOWERS].includes(m.at(x, y)) && !(x >= 5 && x <= 16 && y <= 12) && y !== 19; };
      for (let i = 0; i < 6; i++) { const x = 3 + Math.floor(r() * 42), y = 3 + Math.floor(r() * 34); if (free(x, y)) t[x + ',' + y] = { o: { k: 'weed', hp: 1, v: Math.floor(r() * 3) } }; }
      const fl = FORAGE[newS];
      for (let i = 0; i < 2; i++) { const x = 3 + Math.floor(r() * 42), y = 3 + Math.floor(r() * 34); if (free(x, y)) t[x + ',' + y] = { o: { k: 'forage', id: fl[Math.floor(r() * fl.length)] } }; }
      if (newS === 'winter' && oldS !== 'winter') for (const [k, v] of Object.entries(t)) if (v && v.c && !k.startsWith('g:') && !CROPS[v.c.id].mix) v.c.dead = true;
      const s2 = season(nd), rainP = s2 === 'summer' ? 0.12 : s2 === 'winter' ? 0.15 : 0.2;
      const ex = endDayFarm(t, day, nd, oldS, newS);
      const meta = { day: nd, rain: !!W.meta.rainTomorrow, snow: s2 === 'winter' && !!W.meta.rainTomorrow, rainTomorrow: nd > 2 && Math.random() < rainP, crows, quest: newQuest(nd), luck: Math.round((Math.random() - 0.5) * 20) / 100, sold: decaySold(), late };
      W.farm.t = t; W.farm.b = ex.b; W.farm.a = ex.a; W.farm.pots = ex.pots; W.farm.hay = ex.hay; bVer++;
      if (pend['world/farm']) pend['world/farm'].patch = null;
      await store.doc('world/farm').set({ t, b: ex.b, a: ex.a, pots: ex.pots, hay: ex.hay, fridge: W.farm.fridge || null });
      deepMerge(W.meta, meta);
      // regrava o documento inteiro de vez em quando, limpando o que só vale para dias passados (o banco aceita até 256 KB por documento)
      const taken = {};
      for (const [k, v] of Object.entries(W.meta.taken || {})) if (v && +k.split(':')[0] >= nd - 1) taken[k] = v;
      W.meta.taken = taken;
      if (pend['world/meta']) pend['world/meta'].patch = null;
      await store.doc('world/meta').set(stripNull(clone(W.meta)));
      W.clock = { min: DAY_START, at: Date.now(), day: nd, by: P.uid };
      await store.doc('world/clock').set(W.clock);
      onNewDay();
    } catch (e) { netError(e); }
    ending = false;
  }
  // cada pessoa, ao ver o dia novo: recebe pelo que enviou, acorda na cama e recupera a energia
  let shownDay = 0, lastFrameAt = performance.now();
  function onNewDay() {
    if (!P || !W.meta || P.lastDay >= W.meta.day) return;
    // só desmaiou quem estava jogando quando bateu 2h; quem estava fora do jogo acorda descansado
    const passed = !P.sleep && !!W.meta.late && performance.now() - lastFrameAt < 15000;
    let total = 0; const lines = [];
    for (const s of P.ship) { const v = (s.p || sellPrice(s.id)) * s.n; total += v; lines.push(`${s.n}× ${item(s.id).name}: ${fmt(v)} ₲`); }
    if (total) { earn(total); P.stats.shipped = (P.stats.shipped || 0) + total; }
    P.ship = []; P.lastDay = W.meta.day; P.sleep = false;
    P.energy = passed ? Math.round(P.maxEnergy * 0.6) : P.maxEnergy; P.hp = 100; P.water = canCap((P.inv.find(s => s && s.id === 'can') || {}).lv || 0);
    P.map = 'house'; P.x = 2 * T + 8; P.y = 5 * T + 8; P.dir = 1; monsters = []; fishing = null;
    document.getElementById('hpBar').hidden = true;
    P.ride = false; onNewDayExtra();
    dirty(); savePlayer();
    if (shownDay === W.meta.day) return;
    shownDay = W.meta.day;
    const s = season();
    openPanel(`<h2>${weekday()} ${dom()} de ${SEASONS[SEASON_ID.indexOf(s)]}</h2>
      ${dom() === 1 ? `<p class="big">Começou ${s === 'summer' ? 'o verão' : s === 'fall' ? 'o outono' : s === 'winter' ? 'o inverno' : 'a primavera'}!</p>` : ''}
      ${passed ? '<p style="text-align:center">Você desmaiou de cansaço e acordou em casa com menos energia.</p>' : ''}
      <h3>Caixa de envio</h3>
      ${lines.length ? `<div class="list">${lines.map(l => `<div class="item"><span class="nm">${l}</span></div>`).join('')}</div><p class="big">+${fmt(total)} ₲</p>` : '<p>Nada foi enviado ontem.</p>'}
      ${W.meta.crows ? `<p>Os corvos comeram ${W.meta.crows} planta${W.meta.crows > 1 ? 's' : ''}. Um espantalho ajuda.</p>` : ''}
      <p>Previsão: ${W.meta.rain ? (W.meta.snow ? 'neve hoje' : 'chuva hoje, as plantas já estão regadas') : 'sol hoje'}${W.meta.rainTomorrow ? ', e amanhã vai chover.' : '.'}</p>
      <div class="row"><button class="btn g" data-a="close" type="button">Bom dia!</button></div>`);
  }
