
  // ================= aventura: peixes lendários, tesouro na pesca, anzóis, chefes da mina, armas, anéis e botas =================

  // ---------- peixes lendários: um por estação (mais um na mina), só uma vez para cada pessoa ----------
  const LEGENDS = {
    lenda: { name: 'A Lenda', sell: 5000, diff: 110, where: ['pond'], seasons: ['spring'], col: '#3a9a6a', need: 6, rain: true },
    carmim: { name: 'Peixe-carmim', sell: 1500, diff: 95, where: ['ocean'], seasons: ['summer'], col: '#d8203a', need: 4 },
    tamboril: { name: 'Tamboril-rei', sell: 900, diff: 95, where: ['river'], seasons: ['fall'], col: '#c8a03a', need: 3 },
    glacial: { name: 'Peixe-glacial', sell: 1000, diff: 100, where: ['river'], seasons: ['winter'], col: '#8ad8f0', need: 6 },
    carpamutante: { name: 'Carpa mutante', sell: 1000, diff: 100, where: ['mine'], seasons: ['spring', 'summer', 'fall', 'winter'], col: '#6ab83a', need: 5 },
  };
  for (const [k, f] of Object.entries(LEGENDS)) {
    FISH[k] = { ...f, legend: true };
    ITEMS[k] = { name: f.name, cat: 'fish', sell: f.sell, energy: 150, col: f.col, legend: true, desc: 'Peixe lendário! Só se pega uma vez.' };
  }
  Object.assign(FISH_ART, {
    lenda: { xs: 1, xt: 10, cy: 8.5, H: 4.4, Hl: 4, p: 0.4, s0: 0.5, pe: 0.28, tail: 'fork', tl: 4, c: ['#1e5a3e', '#3a9a6a', '#7ac89a', '#e8f4d0'], fin: '#e0b030', dorsal: [0.2, 0.8, 3, 'round'], anal: [0.55, 0.8, 2], mark: 'legend' },
    carmim: { xs: 1, xt: 11, cy: 8.5, H: 3.8, Hl: 3.4, p: 0.38, s0: 0.42, pe: 0.22, tail: 'lunate', tl: 3, c: ['#6a0a1a', '#d8203a', '#f05a6a', '#ffd8d8'], fin: '#ff8a3a', dorsal: [0.25, 0.55, 3, 'sail'], anal: [0.6, 0.75, 2], mark: 'legend' },
    tamboril: { xs: 2, xt: 11, cy: 9.5, H: 3.8, Hl: 3.6, p: 0.3, s0: 0.85, pe: 0.3, tail: 'round', tl: 3, c: ['#5a3a10', '#a8782a', '#c8a03a', '#ecd8a0'], fin: '#7a5418', dorsal: [0.5, 0.75, 2, 'spiny'], anal: [0.6, 0.8, 1], mark: 'angler', bigMouth: 1 },
    glacial: { xs: 1, xt: 11, cy: 8.5, H: 3.4, Hl: 3, p: 0.42, s0: 0.4, pe: 0.3, tail: 'fork', tl: 3, c: ['#2a6a9a', '#7ac8f0', '#bfe8fa', '#ffffff'], fin: '#d8f4ff', dorsal: [0.3, 0.6, 2, 'tri'], anal: [0.62, 0.78, 1], mark: 'ice' },
    carpamutante: { xs: 1, xt: 11, cy: 8.5, H: 4, Hl: 3.6, p: 0.38, s0: 0.45, pe: 0.32, tail: 'fork', tl: 3, c: ['#2a4a1a', '#6ab83a', '#9ad85a', '#e0f4b0'], fin: '#8a3ab8', dorsal: [0.3, 0.62, 2, 'round'], anal: [0.62, 0.78, 1], mark: 'mutant', barbel: 1 },
  });
  // um lendário aparece às vezes, se a pessoa tiver nível de Pesca e ainda não tiver pego esse
  function legendFor(water) {
    const s = season(), lv = skillLv(P.skills.fishing), got = (P.flags && P.flags.lend) || {};
    for (const [k, f] of Object.entries(LEGENDS)) {
      if (got[k] || !f.where.includes(water) || !f.seasons.includes(s) || lv < f.need || (f.rain && !W.meta.rain)) continue;
      if (Math.random() < 0.15) return k;
    }
    return null;
  }

  // ---------- anzóis: presos na vara (de cobre ou melhor), duram 20 peixes ----------
  Object.assign(ITEMS, {
    boia: { name: 'Boia de cortiça', cat: 'tackle', sell: 250, desc: 'Presa na vara: a barra verde fica 24% maior. Dura 20 peixes.' },
    anzolgiratorio: { name: 'Anzol giratório', cat: 'tackle', sell: 250, desc: 'Presa na vara: o peixe morde bem mais rápido. Dura 20 peixes.' },
    anzolfarpado: { name: 'Anzol farpado', cat: 'tackle', sell: 500, desc: 'Presa na vara: a barra gruda no peixe quando está em cima dele. Dura 20 peixes.' },
    imatesouro: { name: 'Ímã de tesouro', cat: 'tackle', sell: 375, desc: 'Presa na vara: baús de tesouro aparecem o dobro e enchem mais rápido. Dura 20 peixes.' },
  });
  const TACKLE_SHOP = [{ id: 'anzolgiratorio', price: 500 }, { id: 'boia', price: 750 }, { id: 'imatesouro', price: 750 }, { id: 'anzolfarpado', price: 1000 }];
  const rodSlot = () => P.inv.find(s => s && s.id === 'rod');
  const tackle = () => { const r = rodSlot(); return r && r.tk && r.tkn > 0 ? r.tk : null; };
  function attachTackle(i) {
    const s = P.inv[i], r = rodSlot(); if (!s) return;
    if (!r) { toast('Você precisa da vara de pesca na mochila.'); return; }
    if ((r.lv || 0) < 1) { toast('Anzóis só cabem na vara de cobre ou melhor. Melhore a vara no Seu Cláudio.'); sfx.no(); return; }
    if (r.tk && r.tkn > 0) addItem(r.tk, 1, true);
    r.tk = s.id; r.tkn = 20; s.n--; if (s.n <= 0) P.inv[i] = null; dirty(); renderHotbar(); sfx.pop();
    toast(`${item(s.id).name} preso na vara. Dura 20 peixes.`, 'big');
  }
  function useTackle() {
    const r = rodSlot(); if (!r || !r.tk) return;
    r.tkn = (r.tkn || 0) - 1;
    if (r.tkn <= 0) { toast(`${item(r.tk).name} gastou.`); delete r.tk; delete r.tkn; }
    dirty();
  }

  // ---------- baú de tesouro no minijogo de pesca ----------
  function treasureChance() { return 0.15 * (hasProf('pirata') ? 2 : 1) * (tackle() === 'imatesouro' ? 2 : 1) + (eqHas('anelsorte') ? 0.05 : 0); }
  function treasureLoot() {
    const pool = [['isca', 5, 15, 10], ['cobre', 5, 12, 8], ['ferro', 3, 8, 6], ['ouro', 2, 5, 4], ['carvao', 3, 8, 6], ['geodo', 1, 3, 5], ['ametista', 1, 1, 3], ['topazio', 1, 1, 3], ['esmeralda', 1, 1, 1.5], ['diamante', 1, 1, 0.6], ['barraouro', 1, 2, 1.5], ['boia', 1, 1, 1], ['anelsorte', 1, 1, 0.6], ['anelbrilho', 1, 1, 0.6]];
    const tot = pool.reduce((a, x) => a + x[3], 0), out = [], n = Math.random() < 0.3 ? 3 : Math.random() < 0.6 ? 2 : 1;
    for (let i = 0; i < n; i++) { let r = Math.random() * tot; for (const [id, a, b, w] of pool) { r -= w; if (r <= 0) { out.push([id, rint(a, b)]); break; } } }
    if (Math.random() < 0.25) out.push(['$', rint(100, 600)]);
    return out;
  }
  function giveTreasure() {
    const loot = treasureLoot(), names = [];
    for (const [id, n] of loot) { if (id === '$') { earn(n); names.push(`${fmt(n)} ₲`); } else { addItem(id, n, true); names.push(`${n}× ${item(id).name}`); } }
    sfx.level(); toast('Baú do tesouro! ' + names.join(', '), 'big');
  }
  function drawFishChest(c, f) {
    if (!f.chest || f.chest.got) return;
    const y = Math.round(f.chest.y) - 5;
    c.fillStyle = '#5a3412'; c.fillRect(13, y, 10, 8); c.fillStyle = '#a86a32'; c.fillRect(14, y + 1, 8, 6); c.fillStyle = '#f4c83a'; c.fillRect(17, y + 3, 2, 2); c.fillStyle = '#7a4a22'; c.fillRect(14, y + 3, 8, 1);
    c.fillStyle = '#2a1a0a'; c.fillRect(24, y, 2, 8); c.fillStyle = '#f4c83a'; c.fillRect(24, y + 8 - Math.round(8 * f.chest.p), 2, Math.round(8 * f.chest.p));
  }

  // ---------- armas ----------
  const WEAPONS = {
    sword: { dmg: 0, dur: 0.28 },
    adaga: { name: 'Adaga de prata', dmg: 8, dur: 0.18, crit: 0.12, reach: 12 },
    martelo: { name: 'Martelo de pedra', dmg: 15, dur: 0.46, knock: 300, reach: 16 },
    espadaobsidiana: { name: 'Espada de obsidiana', dmg: 18, dur: 0.28, crit: 0.06 },
    espadagalaxia: { name: 'Espada da galáxia', dmg: 28, dur: 0.24, crit: 0.08, reach: 16 },
  };
  Object.assign(ITEMS, {
    adaga: { name: 'Adaga de prata', cat: 'tool', sell: 400, desc: 'Arma rápida: golpes curtos e mais chance de crítico.' },
    martelo: { name: 'Martelo de pedra', cat: 'tool', sell: 600, desc: 'Arma pesada: lenta, mas bate forte e empurra longe.' },
    espadaobsidiana: { name: 'Espada de obsidiana', cat: 'tool', sell: 900, desc: 'Lâmina de vidro vulcânico. Corta muito.' },
    espadagalaxia: { name: 'Espada da galáxia', cat: 'tool', sell: 2000, desc: 'A arma mais forte do vale. Brilha com estrelas.' },
  });
  const WEAPON_SHOP = [{ id: 'adaga', price: 2500 }, { id: 'martelo', price: 5000 }];

  // ---------- anéis e botas (dois anéis e um par de botas equipados) ----------
  const GEAR = {
    anelbrilho: { name: 'Anel de brilho', cat: 'ring', sell: 100, desc: 'Ilumina bem mais em volta na mina.' },
    anelvida: { name: 'Anel da vida', cat: 'ring', sell: 300, desc: 'Recupera 4 de vida a cada monstro derrotado.' },
    anelsorte: { name: 'Anel da sorte', cat: 'ring', sell: 250, desc: 'Mais geodos na mina e mais baús de tesouro na pesca.' },
    anelguerreiro: { name: 'Anel do guerreiro', cat: 'ring', sell: 350, desc: '+2 de ataque.' },
    anelpedra: { name: 'Anel de pedra', cat: 'ring', sell: 200, desc: '+2 de defesa.' },
    botascouro: { name: 'Botas de couro', cat: 'boots', sell: 100, desc: '+1 de defesa.' },
    botasvelozes: { name: 'Botas velozes', cat: 'boots', sell: 300, desc: '+1 de defesa e anda 10% mais rápido.' },
    botasferro: { name: 'Botas de ferro', cat: 'boots', sell: 400, desc: '+3 de defesa.' },
    botasdragao: { name: 'Botas de dragão', cat: 'boots', sell: 1000, desc: '+4 de defesa e anda 10% mais rápido.' },
  };
  Object.assign(ITEMS, GEAR);
  const BOOT_DEF = { botascouro: 1, botasvelozes: 1, botasferro: 3, botasdragao: 4 };
  const eq = () => P.eq || (P.eq = {});
  const eqHas = id => { const e = P && P.eq; return !!e && (e.r1 === id || e.r2 === id || e.bt === id); };
  const eqAtk = () => (eqHas('anelguerreiro') ? 2 : 0);
  const eqDef = () => (eqHas('anelpedra') ? 2 : 0) + (BOOT_DEF[(P.eq || {}).bt] || 0);
  const eqSpeed = () => (eqHas('botasvelozes') || eqHas('botasdragao') ? 0.1 : 0);
  const defTotal = () => buffLv('defense') + profDef() + eqDef();
  function equipSlot(i) {
    const s = P.inv[i]; if (!s) return;
    const it = item(s.id), e = eq();
    if (it.cat !== 'ring' && it.cat !== 'boots') return;
    const slot = it.cat === 'boots' ? 'bt' : !e.r1 ? 'r1' : !e.r2 ? 'r2' : 'r1';
    const old = e[slot];
    e[slot] = s.id; s.n--; if (s.n <= 0) P.inv[i] = null;
    if (old) addItem(old, 1, true);
    dirty(); renderHotbar(); sfx.pop(); toast(`${it.name} equipado.`);
  }
  function unequip(slot) {
    const e = eq(); if (!e[slot]) return;
    if (addItem(e[slot], 1, true) < 1) return;
    delete e[slot]; dirty(); renderHotbar();
  }
  function gearHTML() {
    const e = P.eq || {}, cell = (k, label) => `<div class="item"><span class="nm">${e[k] ? `<img src="${iconURL(e[k])}" alt="" style="width:24px;height:24px;image-rendering:pixelated;vertical-align:middle"> <b>${item(e[k]).name}</b><small>${item(e[k]).desc}</small>` : `<small>${label}: vazio</small>`}</span>${e[k] ? `<button class="btn" data-a="unequip" data-k="${k}" type="button">Tirar</button>` : ''}</div>`;
    return `<h3>Equipado</h3><div class="list">${cell('r1', 'Anel')}${cell('r2', 'Anel')}${cell('bt', 'Botas')}</div>`;
  }
  // monstros às vezes deixam cair anéis e botas
  function monsterExtraDrops(mo) {
    if (eqHas('anelvida')) P.hp = Math.min(100, P.hp + 4);
    const f = curMap().floor || 1, mul = hasProf('ladrao') ? 2 : 1;
    if (Math.random() < 0.012 * mul) addItem(pick(f < 40 ? ['anelbrilho', 'anelpedra', 'anelsorte'] : ['anelvida', 'anelguerreiro', 'anelsorte']), 1);
    else if (Math.random() < 0.01 * mul) addItem(f < 40 ? 'botascouro' : f < 80 ? 'botasvelozes' : 'botasferro', 1);
  }

  // ---------- chefes da mina: andares 25, 50, 75 e 100 ----------
  const BOSSES = {
    25: { b: 'reigosma', name: 'Rei Gosma', hp: 140, dmg: 10, r: 18, loot: [['adaga', 1], ['anelvida', 1], ['barraferro', 5]] },
    50: { b: 'morcegao', name: 'Morcegão Sombrio', hp: 240, dmg: 14, r: 18, fly: true, loot: [['martelo', 1], ['botasvelozes', 1], ['barraouro', 3]] },
    75: { b: 'golem', name: 'Golem de Magma', hp: 380, dmg: 20, r: 20, loot: [['espadaobsidiana', 1], ['anelguerreiro', 1], ['diamante', 2]] },
    100: { b: 'rainhafantasma', name: 'Rainha Fantasma', hp: 520, dmg: 24, r: 18, fly: true, loot: [['espadagalaxia', 1], ['botasdragao', 1], ['frutaestelar', 1]] },
  };
  function spawnBoss(m, n, list) {
    const B = BOSSES[n]; if (!B || (W.meta.bosses && W.meta.bosses[n])) return;
    let x = Math.floor(m.w / 2), y = Math.floor(m.h / 2);
    for (let i = 0; i < 60 && (solidAt(m, x, y) || Math.hypot(x - m.start[0], y - m.start[1]) < 6); i++) { x = 3 + Math.floor(Math.random() * (m.w - 6)); y = 3 + Math.floor(Math.random() * (m.h - 6)); }
    list.push({ kind: 'boss', b: B.b, name: B.name, floor: n, x: x * T + 8, y: y * T + 12, hp: B.hp, max: B.hp, dmg: B.dmg, r: B.r, fly: B.fly, col: '#5ad84a', ph: 0, vx: 0, vy: 0, cd: 2, t2: 4, hitT: 0, hopT: 1 });
    setTimeout(() => toast(`⚠️ ${B.name} está neste andar!`, 'big'), 600);
  }
  function spawnMinion(kind, mo) {
    const f = mo.floor || 25, hp = ({ ghost: 14 }[kind] || 10) + f;
    monsters.push({ kind, x: mo.x + rnd(-24, 24), y: mo.y + rnd(-12, 12), hp, max: hp, dmg: 5 + Math.floor(f / 5), col: kind === 'slime' ? '#5ad84a' : '#b05ae0', ph: Math.random() * 10, vx: 0, vy: 0, cd: 0, hitT: 0, hopT: 1 });
  }
  function updateBoss(mo, dt, dx, dy, dist) {
    const m = curMap();
    mo.cd -= dt; mo.t2 -= dt; if (mo.stomp > 0) mo.stomp -= dt; if (mo.fade > 0) mo.fade -= dt;
    switch (mo.b) {
      case 'reigosma':
        mo.hopT -= dt;
        if (mo.hopT <= 0) { mo.hopT = rnd(0.9, 1.5); mo.vx = dx / dist * 95; mo.vy = dy / dist * 95; }
        if (mo.t2 <= 0) { mo.t2 = 6; if (monsters.filter(x => x.kind === 'slime').length < 4) spawnMinion('slime', mo); }
        break;
      case 'morcegao':
        if (mo.cd <= 0) { mo.cd = 2.4; mo.vx = dx / dist * 230; mo.vy = dy / dist * 230; }
        else if (mo.cd < 1.8) { mo.vx += (-dy / dist * 80 + dx / dist * 10 - mo.vx) * dt * 2; mo.vy += (dx / dist * 80 + dy / dist * 10 - mo.vy) * dt * 2; }
        break;
      case 'golem':
        mo.vx += (dx / dist * 30 - mo.vx) * dt * 2; mo.vy += (dy / dist * 30 - mo.vy) * dt * 2;
        if (mo.cd <= 0 && dist < 80) {
          mo.cd = 3.2; mo.stomp = 0.5; sfx.hit();
          if (dist < 50 && hurtT <= 0) { hurtT = 0.9; P.hp -= Math.max(1, Math.round(mo.dmg * 0.8) - defTotal()); sfx.hurt(); dirty(); }
        }
        break;
      case 'rainhafantasma':
        mo.vx += (dx / dist * 46 - mo.vx) * dt * 1.5; mo.vy += (dy / dist * 46 - mo.vy) * dt * 1.5;
        if (mo.cd <= 0) { mo.cd = 4.5; const a = Math.random() * TAU; mo.x = clamp(P.x + Math.cos(a) * 64, T * 2, (m.w - 2) * T); mo.y = clamp(P.y + Math.sin(a) * 64, T * 2, (m.h - 2) * T); mo.fade = 0.4; }
        if (mo.t2 <= 0) { mo.t2 = 7; if (monsters.filter(x => x.kind === 'ghost').length < 3) spawnMinion('ghost', mo); }
        break;
    }
  }
  function bossDefeated(mo) {
    const B = BOSSES[mo.floor];
    W.meta.bosses = W.meta.bosses || {}; W.meta.bosses[mo.floor] = P.uid;
    queueUpdate('world/meta', { bosses: { [mo.floor]: P.uid } });
    gainXP('combat', 120);
    const names = [];
    for (const [id, n] of B.loot) { addItem(id, n, true); names.push(`${n}× ${item(id).name}`); }
    monsters = monsters.filter(x => x === mo || x.kind === 'boss');
    const m = curMap(), [x, y] = [Math.floor(mo.x / T), Math.floor((mo.y - 4) / T)];
    if (!m.ladder && m.floor < MINE_BOTTOM && !solidAt(m, x, y)) m.ladder = x + ',' + y;
    sfx.level(); toast(`Você venceu ${B.name}! Ganhou: ${names.join(', ')}`, 'big');
  }
  // barra de vida do chefe no alto da tela
  function bossBarUpdate() {
    let el = document.getElementById('bossbar');
    const b = curMap().rocks && monsters.find(x => x.kind === 'boss');
    if (!b) { if (el) el.hidden = true; return; }
    if (!el) { el = document.createElement('div'); el.id = 'bossbar'; el.className = 'frame'; el.style.cssText = 'position:absolute;left:50%;transform:translateX(-50%);top:calc(10px + env(safe-area-inset-top, 0px));z-index:6;padding:4px 10px;min-width:180px;text-align:center;font-size:13px;pointer-events:none'; document.getElementById('game').appendChild(el); }
    el.hidden = false;
    el.innerHTML = `<b>${b.name}</b><div style="height:8px;margin-top:3px;background:#3a1010;border:2px solid #3b1d0a;border-radius:3px;overflow:hidden"><div style="height:100%;width:${Math.max(0, b.hp / b.max * 100).toFixed(1)}%;background:#e8402a"></div></div>`;
  }
  function drawBoss(mo) {
    const t = performance.now() / 1000 + mo.ph, x = Math.round(mo.x), y = Math.round(mo.y), hit = mo.hitT > 0;
    shadowAt(x, y, 16, 4);
    if (hit) ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 60);
    if (mo.fade > 0) ctx.globalAlpha = 1 - mo.fade / 0.4;
    const big = (c, w, h, oy, s) => { ctx.drawImage(c, x - w * s / 2, y - h * s + oy, w * s, h * s); };
    const crown = (cx, cy) => { R(cx - 6, cy, 12, 3, '#f4c83a'); for (const dx of [-6, -2, 2, 5]) R(cx + dx, cy - 3, 2, 3, '#f4c83a'); R(cx - 1, cy + 1, 2, 1, '#e8402a'); };
    if (mo.b === 'reigosma') { big(slimeCanvas('#3ab83a', Math.abs(Math.sin(t * 3)) > 0.6 ? 1 : 0), 20, 18, 4, 2.4); crown(x, y - 40); }
    else if (mo.b === 'morcegao') { big(batCanvas(Math.sin(t * 12) > 0 ? 1 : 0), 24, 14, -14 + Math.sin(t * 3) * 3, 2.2); R(x - 6, y - 38, 3, 2, '#ff2a2a'); R(x + 3, y - 38, 3, 2, '#ff2a2a'); }
    else if (mo.b === 'golem') {
      const sq = mo.stomp > 0 ? 3 : 0;
      oval(x, y - 16 + sq, 15, 15 - sq, '#3a2a28'); oval(x - 2, y - 18 + sq, 12, 12 - sq, '#5a4440');
      for (const [ox, oy, w] of [[-8, -20, 6], [2, -12, 7], [-4, -8, 4], [5, -24, 4]]) { R(x + ox, y + oy + sq, w, 1, '#ff7a2a'); R(x + ox + 1, y + oy + sq, Math.max(1, w - 2), 1, '#ffd060'); }
      R(x - 6, y - 24 + sq, 3, 3, '#ffd060'); R(x + 3, y - 24 + sq, 3, 3, '#ffd060');
      R(x - 17, y - 16, 5, 9, '#4a3834'); R(x + 12, y - 16, 5, 9, '#4a3834');
      if (mo.stomp > 0) { ctx.strokeStyle = `rgba(255,140,60,${(mo.stomp * 1.6).toFixed(2)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, 50 * (1 - mo.stomp), 18 * (1 - mo.stomp), 0, 0, TAU); ctx.stroke(); }
    } else if (mo.b === 'rainhafantasma') {
      ctx.globalAlpha = Math.min(ctx.globalAlpha, 0.85);
      const g = bake('ghostqueen', 20, 24, () => { ctx.fillStyle = '#e8d8f8'; ctx.beginPath(); ctx.arc(10, 9, 8, Math.PI, 0); ctx.lineTo(18, 22); for (let k = 0; k < 4; k++) ctx.lineTo(16 - k * 4, 19 + (k % 2) * 3); ctx.lineTo(2, 22); ctx.closePath(); ctx.fill(); R(6, 7, 2, 4, '#2a1a3a'); R(12, 7, 2, 4, '#2a1a3a'); R(8, 13, 4, 2, '#2a1a3a'); R(4, 4, 2, 2, '#ffffff'); });
      big(g, 20, 24, -10 + Math.sin(t * 2) * 3, 2.1); crown(x, y - 58 + Math.sin(t * 2) * 3);
      R(x - 8, y - 38, 4, 5, '#7a1a9a'); R(x + 4, y - 38, 4, 5, '#7a1a9a');
    }
    ctx.globalAlpha = 1;
  }

  // ---------- ícones das novidades ----------
  function paintIcon4(id) {
    const G2 = (rows, pal) => rows.forEach((row, y) => { for (let x = 0; x < row.length; x++) { const c = pal[row[x]]; if (c) R(x, y, 1, 1, c); } });
    if (WEAPONS[id] && id !== 'sword') {
      const pal = {
        adaga: { e: '#ffffff', d: '#d8e0e8', c: '#9aa6b4', b: '#5a6474', o: '#c8a040', O: '#8a6a20', g: '#3a2418', G: '#6a4430' },
        espadaobsidiana: { e: '#c8a8f0', d: '#5a3a8a', c: '#2e1e48', b: '#160e26', o: '#c84ae8', O: '#7a2a9a', g: '#2a1a2a', G: '#4a2a4a' },
        espadagalaxia: { e: '#ffffff', d: '#f8a8e8', c: '#a85ae8', b: '#4a2aa8', o: '#5ae0f0', O: '#2a8aa8', g: '#2a1a4a', G: '#4a3a7a' },
      }[id];
      if (id === 'adaga') G2(['................', '................', '................', '................', '................', '..........ed....', '.........edc....', '........edcb....', '.......edcb.....', '...Oo.edcb......', '....oOdcb.......', '.....oOb........', '....GgoOo.......', '...Gg..Oo.......', '..Gg............', '.oO.............'], pal);
      else if (id === 'martelo') {
        for (let k = 0; k <= 8; k++) { const x = 1 + k, y = 14 - k; R(x, y, 1, 1, k < 2 ? '#6a4430' : k % 3 === 1 ? '#d09450' : '#a8682e'); R(x + 1, y, 1, 1, k < 2 ? '#3a2418' : '#7a4620'); }
        poly([[8.1, 0.6], [14.4, 6.9], [10.9, 10.4], [4.6, 4.1]], '#6e6860'); poly([[8.1, 1.6], [13.4, 6.9], [10.9, 9.4], [5.6, 4.1]], '#8e877e');
        poly([[8.1, 1.6], [10, 3.5], [7.5, 6], [5.6, 4.1]], '#b0a89c'); R(7, 3, 1, 1, '#d8d0c4'); R(10, 8, 2, 1, '#5a544c'); R(12, 6, 1, 2, '#5a544c');
      }
      else G2(['................', '..............e.', '.............edb', '............edcb', '...........edcb.', '..........edcb..', '.........edcb...', '........edcb....', '...Oo..edcb.....', '....oOedcb......', '.....oOcb.......', '....GgoOo.......', '...Gg..Oo.......', '..Gg............', '.oO.............', '................'], pal);
      if (id === 'espadagalaxia') for (const [x, y] of [[11, 4], [8, 7], [13, 2]]) R(x, y, 1, 1, '#ffffff');
      return true;
    }
    const g = GEAR[id];
    if (g && g.cat === 'ring') {
      const gem = { anelbrilho: '#fff6a0', anelvida: '#e8402a', anelsorte: '#4ae88a', anelguerreiro: '#e88a2a', anelpedra: '#a8a098' }[id];
      ctx.strokeStyle = id === 'anelpedra' ? '#7a7068' : '#e0b030'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.ellipse(8, 10, 5, 4, 0, 0, TAU); ctx.stroke();
      R(5, 9, 1, 1, '#fff4c0');
      ctx.fillStyle = gem; ctx.beginPath(); ctx.moveTo(8, 1); ctx.lineTo(11, 4); ctx.lineTo(8, 7); ctx.lineTo(5, 4); ctx.fill(); R(7, 3, 1, 1, '#ffffff');
      return true;
    }
    if (g && g.cat === 'boots') {
      const c = { botascouro: ['#7a4a22', '#a86a32'], botasvelozes: ['#2a6ab8', '#5a9ae8'], botasferro: ['#5a6070', '#9aa0b0'], botasdragao: ['#8a1a1a', '#d84a2a'] }[id];
      for (const ox of [0, 6]) { R(2 + ox, 3, 4, 8, c[0]); R(3 + ox, 3, 2, 7, c[1]); R(2 + ox, 11, 6, 3, c[0]); R(3 + ox, 11, 4, 1, c[1]); R(2 + ox, 13, 6, 1, '#2a1a0a'); }
      if (id === 'botasvelozes' || id === 'botasdragao') for (const ox of [0, 6]) R(1 + ox, 5, 1, 3, '#ffffff');
      return true;
    }
    if (ITEMS[id] && ITEMS[id].cat === 'tackle') {
      if (id === 'boia') { disc(8, 9, 5, '#f8f4ee'); ctx.fillStyle = '#e8402a'; ctx.beginPath(); ctx.arc(8, 9, 5, Math.PI, 0); ctx.fill(); R(7, 2, 2, 3, '#5a3a1a'); R(5, 6, 2, 1, '#ff9a8a'); R(3, 9, 10, 1, '#c8302a'); return true; }
      if (id === 'anzolgiratorio') { ctx.strokeStyle = '#c8ccd4'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(8, 10, 3.5, 0.2, Math.PI * 1.3); ctx.stroke(); R(11, 3, 1, 7, '#c8ccd4'); oval(6, 5, 2.5, 1.5, '#f4c83a'); R(5, 4, 1, 1, '#ffffff'); return true; }
      if (id === 'anzolfarpado') { ctx.strokeStyle = '#9aa0aa'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(7, 10, 4, 0.3, Math.PI * 1.2); ctx.stroke(); R(10, 2, 1, 8, '#9aa0aa'); R(3, 7, 2, 1, '#9aa0aa'); R(3, 8, 1, 1, '#9aa0aa'); return true; }
      if (id === 'imatesouro') { R(3, 4, 4, 9, '#d8302a'); R(9, 4, 4, 9, '#d8302a'); R(3, 4, 10, 3, '#d8302a'); R(3, 11, 4, 2, '#d8d8e0'); R(9, 11, 4, 2, '#d8d8e0'); R(4, 5, 1, 4, '#ff8a7a'); return true; }
    }
    return false;
  }
