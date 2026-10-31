  // ================= armazenamento: banco compartilhado (online) ou só neste aparelho =================
  const LS = 'sitio-vale-doce-v1';
  const clone = o => (o == null ? o : JSON.parse(JSON.stringify(o)));
  function deepMerge(a, b) {
    for (const k in b) {
      const v = b[k];
      if (v && typeof v === 'object' && !Array.isArray(v) && a[k] && typeof a[k] === 'object' && !Array.isArray(a[k])) deepMerge(a[k], v);
      else a[k] = v;
    }
    return a;
  }
  function LocalStore() {
    let data = {};
    try { data = JSON.parse(localStorage.getItem(LS) || '{}') || {}; } catch (e) { data = {}; }
    const subs = {};
    let saveT = 0;
    const save = () => { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(LS, JSON.stringify(data)); } catch (e) {} }, 300); };
    const snap = p => ({ id: p.split('/').pop(), exists: !!data[p], data: () => (data[p] ? clone(data[p]) : undefined), metadata: {} });
    const colSnap = col => ({ docs: Object.keys(data).filter(p => p.startsWith(col + '/') && p.split('/').length === col.split('/').length + 1).map(snap) });
    const fire = p => {
      (subs[p] || []).forEach(fn => fn(snap(p)));
      const col = p.split('/').slice(0, -1).join('/');
      (subs['c:' + col] || []).forEach(fn => fn(colSnap(col)));
    };
    return {
      local: true,
      doc: p => ({
        get: async () => snap(p),
        set: async d => { data[p] = clone(d); save(); fire(p); },
        update: async d => { if (!data[p]) throw { code: 'invalid_argument' }; deepMerge(data[p], clone(d)); save(); fire(p); },
        onSnapshot(fn) { (subs[p] = subs[p] || []).push(fn); setTimeout(() => fn(snap(p)), 0); return () => {}; },
      }),
      collection: c => ({ onSnapshot(fn) { (subs['c:' + c] = subs['c:' + c] || []).push(fn); setTimeout(() => fn(colSnap(c)), 0); return () => {}; } }),
      wipe() { data = {}; try { localStorage.removeItem(LS); } catch (e) {} },
    };
  }
  let store = null, room = null, userCap = null, online = false;
  // uma escrita por vez em cada documento, juntando as mudanças que chegam enquanto isso
  const pend = {};
  function queueUpdate(path, patch) {
    const q = (pend[path] = pend[path] || { patch: null, busy: false });
    q.patch = q.patch ? deepMerge(q.patch, patch) : clone(patch);
    flush(path);
  }
  async function flush(path) {
    const q = pend[path];
    if (!q || q.busy || !q.patch) return;
    const p = q.patch; q.patch = null; q.busy = true;
    try { await store.doc(path).update(p); }
    catch (e) {
      if (e && e.code === 'unavailable') { await new Promise(r => setTimeout(r, 600 + Math.random() * 600)); try { await store.doc(path).update(p); } catch (e2) { netError(e2); } }
      else netError(e);
    }
    q.busy = false;
    if (q.patch) flush(path);
  }
  let netWarned = false;
  function netError(e) { if (!netWarned) { netWarned = true; toast('A conexão falhou ao salvar. Tentando de novo na próxima ação.'); setTimeout(() => (netWarned = false), 15000); } console.warn(e); }
  const playerWrite = { busy: false, again: false };
  async function savePlayer() {
    if (!P || !store) return;
    if (playerWrite.busy) { playerWrite.again = true; return; }
    playerWrite.busy = true;
    try { await store.doc('players/' + P.uid).set(playerDoc()); } catch (e) { netError(e); }
    playerWrite.busy = false;
    if (playerWrite.again) { playerWrite.again = false; setTimeout(savePlayer, 400); }
  }
  let pDirty = 0;
  const dirty = () => { pDirty = performance.now(); };

  // ================= mundo =================
  const W = { meta: null, farm: { t: {} }, clock: { min: DAY_START, at: Date.now(), day: 1 }, players: {} };
  const season = (d = W.meta ? W.meta.day : 1) => SEASON_ID[Math.floor((d - 1) / 28) % 4];
  const dom = (d = W.meta.day) => ((d - 1) % 28) + 1;
  const year = (d = W.meta.day) => Math.floor((d - 1) / 112) + 1;
  const weekday = (d = W.meta.day) => WEEK[(d - 1) % 7];
  const gm = () => W.meta.day * 1440 + nowMin();
  const tile = k => W.farm.t[k] || null;
  function setTile(k, v) {
    if (v) W.farm.t[k] = v; else delete W.farm.t[k];
    queueUpdate('world/farm', { t: { [k]: v || null } });
  }
  const isWatered = (tl, gh) => !!tl && !!tl.s && (tl.w === W.meta.day || (!gh && W.meta.rain && !W.meta.snow));

  // dinheiro do casal: soma do que cada um ganhou menos o que gastou (cada um só escreve o próprio)
  function gold() {
    let g = 500;
    for (const [id, p] of Object.entries(W.players)) if (id !== (P && P.uid)) g += (p.earned || 0) - (p.spent || 0);
    if (P) g += P.earned - P.spent;
    return g;
  }
  const spend = n => { if (gold() < n) return false; P.spent += n; dirty(); return true; };
  const earn = n => { P.earned += n; dirty(); };

  // ================= relógio (quem chegou primeiro na sala controla o tempo) =================
  let host = true, peers = [], myPeer = null;
  function nowMin() {
    const c = W.clock;
    let m = c.min + Math.floor((Date.now() - c.at) / MS_PER_TICK) * MIN_PER_TICK;
    // o relógio só anda com alguém jogando: sem gravação recente, ele espera em vez de pular horas
    m = Math.min(m, c.min + 20);
    return Math.min(m, DAY_END);
  }
  let clockBusy = false;
  async function hostTick() {
    if (!W.meta || clockBusy || !P) return;
    const c = W.clock, gap = Date.now() - c.at;
    // quem cuidava do relógio parou de jogar (celular bloqueado, por exemplo): a outra pessoa assume
    if (!host && gap < 25000) return;
    const ticks = Math.floor(gap / MS_PER_TICK);
    if (ticks < 1) return;
    let next;
    // ninguém jogou por um tempo: continua de onde parou
    if (ticks > 3) next = { min: Math.min(DAY_END, c.min + (host ? MIN_PER_TICK : 20)), at: Date.now(), day: W.meta.day, by: P.uid };
    else next = { min: Math.min(DAY_END, c.min + ticks * MIN_PER_TICK), at: c.at + ticks * MS_PER_TICK, day: W.meta.day, by: P.uid };
    W.clock = next;
    clockBusy = true;
    try { await store.doc('world/clock').set(next); } catch (e) { netError(e); }
    clockBusy = false;
  }
  function pauseClock(ms) { if (store && store.local) W.clock.at += ms; }

  function newMeta() { return { day: 1, rain: false, snow: false, rainTomorrow: false, mineMax: 0, created: Date.now(), taken: {}, chests: {}, quest: null, luck: 0 }; }
  // fazenda inicial: mato, pedras, galhos e árvores espalhados
  function newFarm() {
    const t = {}, r = srand(2024), m = MAPS.farm;
    for (let y = 3; y < 37; y++) for (let x = 3; x < 45; x++) {
      if (m.solid[y * m.w + x] || m.at(x, y) !== G.GRASS && m.at(x, y) !== G.FLOWERS) continue;
      if (x >= 5 && x <= 16 && y <= 12) continue;
      if (y === 19 || x === 9) continue;
      const q = r();
      if (q < 0.035) t[x + ',' + y] = { o: { k: 'tree', hp: 10, v: Math.floor(r() * 3) } };
      else if (q < 0.08) t[x + ',' + y] = { o: { k: 'rock', hp: 2, v: Math.floor(r() * 3) } };
      else if (q < 0.15) t[x + ',' + y] = { o: { k: 'weed', hp: 1, v: Math.floor(r() * 3) } };
      else if (q < 0.17) t[x + ',' + y] = { o: { k: 'twig', hp: 1, v: Math.floor(r() * 2) } };
      else if (q < 0.175) t[x + ',' + y] = { o: { k: 'stump', hp: 5 } };
    }
    return { t, b: {}, a: {}, pots: {}, hay: 0, fridge: null };
  }

  // ================= jogador local =================
  let P = null;
  const NEW_INV = () => {
    const inv = Array(36).fill(null);
    ['hoe', 'can', 'axe', 'pick', 'scythe', 'rod', 'sword'].forEach((id, i) => (inv[i] = { id, n: 1, lv: 0 }));
    inv[7] = { id: 's_pastinaca', n: 15 };
    return inv;
  };
  function newPlayer(uid, name, look) {
    return { uid, name, look, map: 'house', x: 6 * T + 8, y: 5 * T + 8, dir: 1, inv: NEW_INV(), sel: 0, energy: 270, maxEnergy: 270, hp: 100, skills: { farming: 0, fishing: 0, mining: 0, foraging: 0, combat: 0 }, earned: 0, spent: 0, ship: [], water: 40, lastDay: 1, sleep: false, mineFloor: 0, stats: { shipped: 0, fish: 0 }, recipes: [], rel: {}, mail: [], flags: {}, buff: null, spouse: null, spouseName: '', ride: false, pet: null, prof: [], eq: {} };
  }
  function playerDoc() {
    const { uid, name, look, map, x, y, dir, inv, sel, energy, maxEnergy, hp, skills, earned, spent, ship, water, lastDay, mineFloor, stats, recipes, rel, mail, flags, buff, spouse, spouseName, pet, prof, eq } = P;
    return clone({ uid, name, look, map: map.startsWith('mine') && map !== 'minetop' ? 'minetop' : map, x: map.startsWith('mine') && map !== 'minetop' ? 8 * T + 8 : x, y: map.startsWith('mine') && map !== 'minetop' ? 9 * T + 8 : y, dir, inv, sel, energy, maxEnergy, hp, skills, earned, spent, ship, water, lastDay, mineFloor, stats, recipes, rel, mail, flags, buff, spouse, spouseName, prof: prof || [], eq: eq || {}, pet: pet ? { ...pet, map: (petSt.map || '').startsWith('mine') && petSt.map !== 'minetop' ? 'minetop' : petSt.map, x: Math.round(petSt.x), y: Math.round(petSt.y) } : null, seen: Date.now() });
  }
  // ================= inventário =================
  const stackable = id => item(id).cat !== 'tool';
  function addItem(id, n = 1, silent, q = 0) {
    let left = n;
    if (stackable(id)) for (const s of P.inv) if (s && s.id === id && (s.q || 0) === q && s.n < 999) { const k = Math.min(left, 999 - s.n); s.n += k; left -= k; if (!left) break; }
    while (left > 0) {
      const i = P.inv.findIndex(s => !s);
      if (i < 0) break;
      const k = stackable(id) ? Math.min(left, 999) : 1;
      P.inv[i] = q ? { id, n: k, lv: 0, q } : { id, n: k, lv: 0 }; left -= k;
    }
    dirty(); renderHotbar();
    if (!silent && n - left > 0) pickupNote(id, n - left);
    if (left > 0) toast('A mochila está cheia!');
    return n - left;
  }
  const count = id => P.inv.reduce((a, s) => a + (s && s.id === id ? s.n : 0), 0);
  function removeItem(id, n = 1) {
    if (count(id) < n) return false;
    // gasta primeiro os de qualidade mais baixa
    for (let q = 0; q <= 2 && n > 0; q++) for (let i = P.inv.length - 1; i >= 0 && n > 0; i--) { const s = P.inv[i]; if (s && s.id === id && (s.q || 0) === q) { const k = Math.min(n, s.n); s.n -= k; n -= k; if (!s.n) P.inv[i] = null; } }
    dirty(); renderHotbar();
    return true;
  }
  const held = () => P.inv[P.sel];
  function useHeld(n = 1) { const s = held(); if (!s) return; s.n -= n; if (s.n <= 0) P.inv[P.sel] = null; dirty(); renderHotbar(); }
  function gainXP(skill, n) {
    const before = skillLv(P.skills[skill]);
    P.skills[skill] += n;
    const after = skillLv(P.skills[skill]);
    if (after > before) {
      toast(`${SKILLS[skill]} subiu para o nível ${after}!`, 'big');
      if (after === 5 || after === 10) toast('Profissão nova para escolher! Abra a Mochila > Habilidades.', 'big');
      const rec = RECIPES.filter(r => r.skill && r.skill[0] === skill && r.skill[1] === after);
      if (rec.length) toast('Nova receita: ' + rec.map(r => item(r.id).name).join(', '));
      sfx.level();
    }
    dirty();
  }
