  // ================= rede: presença dos jogadores =================
  const remote = new Map(); // peer -> {x,y,...} suavizado
  function peerPlayers() {
    const me = P ? { me: true, uid: P.uid, name: P.name, look: P.look, map: P.map, sleep: P.sleep } : null;
    const list = peers.filter(p => !p.isMe || !p.sameTab).filter(activePeer).filter(p => p.presence && p.presence.uid && p.kind === 'viewer' && !(p.isMe && p.presence.uid === (P && P.uid)))
      .map(p => ({ peer: p.peer, ...p.presence }));
    return me ? [me, ...list] : list;
  }
  // quem está com o jogo aberto e ativo: a presença manda um sinal a cada 5 s; sem sinal por 25 s, a pessoa conta como fora
  const seenAt = new Map(), seenJson = new Map();
  function notePeers(list) { const now = Date.now(); for (const p of list) { const j = JSON.stringify(p.presence || null); if (seenJson.get(p.peer) !== j) { seenJson.set(p.peer, j); seenAt.set(p.peer, now); } } }
  const activePeer = p => (p.isMe && p.sameTab) || Date.now() - (seenAt.get(p.peer) || 0) < 25000;
  let lastPres = '';
  function pushPresence(force) {
    if (!room || !P) return;
    const pr = { uid: P.uid, name: P.name, look: P.look, map: P.map, x: Math.round(P.x), y: Math.round(P.y), dir: P.dir, mv: walkT > 0 ? 1 : 0, sleep: P.sleep ? 1 : 0, tool: toolAnim ? toolAnim.tool : null, fish: fishing ? 1 : 0, ride: P.ride ? 1 : 0, pt: petPresence(), hb: Math.floor(Date.now() / 5000) % 1000 };
    const s = JSON.stringify(pr);
    if (s === lastPres && !force) return;
    lastPres = s;
    room.presence(pr).catch(() => {});
  }
  function electHost() {
    if (!room || !myPeer) { host = true; return; }
    const ids = peers.filter(p => p.kind === 'viewer' && p.presence && p.presence.uid && activePeer(p)).map(p => p.peer);
    if (!ids.includes(myPeer)) ids.push(myPeer);
    ids.sort();
    host = ids[0] === myPeer;
  }
  function checkDayEnd(force) {
    if (!W.meta || !P || ending) return;
    const all = peerPlayers();
    const everyoneAsleep = all.length > 0 && all.every(p => p.sleep);
    if (host && (everyoneAsleep || nowMin() >= DAY_END)) endDay(nowMin() >= DAY_END && !P.sleep);
  }

  // ================= setTile com remoção explícita de campos (o banco junta objetos) =================
  function nullDiff(oldV, newV) {
    if (!newV) return null;
    const out = clone(newV);
    if (oldV && typeof oldV === 'object' && !Array.isArray(oldV)) for (const k of Object.keys(oldV)) {
      if (!(k in out) || out[k] === undefined) out[k] = null;
      else if (out[k] && typeof out[k] === 'object' && !Array.isArray(out[k]) && oldV[k] && typeof oldV[k] === 'object' && !Array.isArray(oldV[k])) out[k] = nullDiff(oldV[k], out[k]);
    }
    return out;
  }
  function stripNull(o) {
    if (!o || typeof o !== 'object' || Array.isArray(o)) return o;
    for (const k of Object.keys(o)) { if (o[k] === null || o[k] === undefined) delete o[k]; else if (typeof o[k] === 'object' && !Array.isArray(o[k])) stripNull(o[k]); }
    return o;
  }
  // substitui a versão simples definida antes
  setTile = function (k, v) {
    const old = W.farm.t[k];
    const nv = v ? stripNull(clone(v)) : null;
    if (nv && Object.keys(nv).length) W.farm.t[k] = nv; else delete W.farm.t[k];
    queueUpdate('world/farm', { t: { [k]: nv && Object.keys(nv).length ? nullDiff(old, nv) : null } });
  };

  // ================= desenho do mundo =================
  let zoom = 3, VW = 200, VH = 150, camX = 0, camY = 0;
  function resize() {
    const r = cv.getBoundingClientRect(), dpr = Math.min(3, window.devicePixelRatio || 1);
    const w = Math.max(200, r.width * dpr), h = Math.max(200, r.height * dpr), short = Math.min(w, h);
    zoom = Math.max(2, Math.floor(short / (11 * T)));
    cv.width = Math.ceil(w / zoom); cv.height = Math.ceil(h / zoom);
    VW = cv.width; VH = cv.height;
    ctx.imageSmoothingEnabled = false;
  }
  new ResizeObserver(resize).observe(cv);
  function nightF() {
    if (!W.meta) return 0;
    const m = nowMin();
    return clamp((m - 18 * 60) / 180, 0, 1) * (curMap().outdoor ? 0.75 : 0.25);
  }
  const rain = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), s: rnd(0.8, 1.2) }));
  function render(dt) {
    const m = placing ? MAPS.farm : curMap(), t = performance.now() / 1000;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, VW, VH);
    const PB = placing && placeSize();
    const tx = placing ? (placing.x + PB.w / 2) * T - VW / 2 : P.x - VW / 2, ty = placing ? (placing.y + PB.h / 2) * T - VH / 2 : P.y - 12 - VH / 2;
    camX = m.w * T <= VW ? (m.w * T - VW) / 2 : clamp(tx, 0, m.w * T - VW);
    camY = m.h * T <= VH ? (m.h * T - VH) / 2 : clamp(ty, 0, m.h * T - VH);
    camX = Math.round(camX); camY = Math.round(camY);
    ctx.translate(-camX, -camY);
    ctx.drawImage(groundFor(m), 0, 0);
    const x0 = Math.max(0, Math.floor(camX / T) - 1), x1 = Math.min(m.w - 1, Math.ceil((camX + VW) / T) + 1);
    const y0 = Math.max(0, Math.floor(camY / T) - 1), y1 = Math.min(m.h - 1, Math.ceil((camY + VH) / T) + 2);
    // brilho na água
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (m.at(x, y) === G.WATER) { const p = (t * 0.6 + hash(x, y)) % 1; if (p < 0.35) R(x * T + 3 + hash(y, x) * 8, y * T + 5 + p * 16, 3, 1, m.cave && m.tier === 2 ? '#ffe080' : '#d8f0ff'); }
    const nf = nightF();
    const ents = [];
    // chão da chacrinha: terra arada, molhada e caminhos
    if (m.id === 'farm' || m.gh) {
      const s = season(), pre = m.gh ? 'g:' : '';
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        const tl = W.farm.t[pre + x + ',' + y]; if (!tl) continue;
        const px = x * T, py = y * T;
        if (tl.f) { R(px, py, T, T, '#a8a098'); R(px + 1, py + 1, 6, 6, '#c0b8ae'); R(px + 8, py + 2, 7, 5, '#b8b0a6'); R(px + 2, py + 8, 5, 7, '#b4aca2'); R(px + 8, py + 8, 7, 7, '#c0b8ae'); }
        if (tl.s) {
          const wet = isWatered(tl, m.gh);
          R(px, py, T, T, wet ? '#5a3a1e' : '#9a6a3a');
          for (let k = 2; k < T; k += 4) R(px + 1, py + k, T - 2, 1, wet ? '#4a2e16' : '#7a5028');
          if (s === 'winter' && !m.gh) R(px + 2, py + 2, 4, 2, '#ffffff88');
          if (tl.fe) drawFert(tl.fe, px, py);
        }
        if (tl.c) ents.push({ y: py + 14, f: () => drawCrop(tl.c, px, py) });
        if (tl.o && !(placing && placing.tree === pre + x + ',' + y)) ents.push({ y: py + 15 + (tl.o.k === 'forage' ? -2 : 0), f: () => drawObj(tl.o, px, py, pre + x + ',' + y, nf) });
      }
    }
    if (m.id === 'town') for (const f of townForage()) ents.push({ y: f.y * T + 13, f: () => drawIconAt(f.id, f.x * T, f.y * T - 2 + Math.sin(t * 2 + f.x) * 1) });
    if (m.rocks) {
      const set = brokenSet(m.floor);
      for (const [k, r] of Object.entries(m.rocks)) { if (set.has(k)) continue; const [x, y] = k.split(',').map(Number); if (x < x0 || x > x1 || y < y0 || y > y1) continue; ents.push({ y: y * T + 14, f: () => drawRock(x * T, y * T, r.v, r.kind, m.tier) }); }
      if (m.ladder) { const [x, y] = m.ladder.split(',').map(Number); ents.push({ y: y * T, f: () => { R(x * T + 2, y * T + 1, 12, 14, '#1a1410'); R(x * T + 3, y * T + 1, 2, 14, '#a86a3a'); R(x * T + 11, y * T + 1, 2, 14, '#a86a3a'); for (let k = 3; k < 15; k += 4) R(x * T + 3, y * T + k, 10, 1, '#c8884a'); } }); }
      for (const mo of monsters) ents.push({ y: mo.y, f: () => drawMonster(mo) });
    }
    if (m.outdoor) for (const tr of forestTrees(m)) { if (tr.x < camX - 30 || tr.x > camX + VW + 30 || tr.y < camY - 4 || tr.y > camY + VH + 80) continue; ents.push({ y: tr.y, f: () => drawTree(tr.x, tr.y, 1, tr.v) }); }
    extraEnts(m, ents, nf, t, x0, x1, y0, y1);
    petEnts(m, ents);
    for (const s of m.sprites) ents.push({ y: (s.y + s.h) * T - (s.type === 'bed' || s.type === 'ladder' || s.type === 'ladderup' ? 40 : 0), f: () => drawSprite(s, nf) });
    // outras pessoas
    for (const p of peerPlayers()) {
      if (p.me || p.map !== P.map || p.x == null) continue;
      let r = remote.get(p.peer); if (!r) { r = { x: p.x, y: p.y, t: 0 }; remote.set(p.peer, r); }
      const k = Math.min(1, dt * 10); r.x += (p.x - r.x) * k; r.y += (p.y - r.y) * k; if (p.mv) r.t += dt; else r.t = 0;
      ents.push({ y: r.y, f: () => { const up = p.ride ? 12 : 0; if (p.ride) drawHorse(r.x, r.y, p.dir === 2 ? 2 : 3, p.mv); drawFarmer(r.x, r.y - up, p.look || {}, p.dir || 1, p.mv && !p.ride ? r.t : 0, { tool: p.tool, toolT: (t * 4) % 1 }); nameTag(p.name || '', r.x, r.y - 44 - up, P.spouse && p.uid === P.spouse); } });
    }
    if (P.map === m.id) ents.push({ y: P.y, f: () => drawPlayerEnt(t) });
    ents.sort((a, b) => a.y - b.y);
    for (const e of ents) e.f();
    if (placing) drawPlacing();
    // alvo
    if (!panelOpen && !fishing && !placing && !P.ride) {
      const [fx, fy] = facing();
      ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1; ctx.strokeRect(fx * T + 0.5, fy * T + 0.5, T - 1, T - 1);
    }
    // pesca: linha e boia
    if (fishing && fishing.phase !== 'game') {
      const f = fishing, bob = f.phase === 'bite' ? Math.sin(t * 30) * 2 : Math.sin(t * 3);
      ctx.strokeStyle = '#ffffffaa'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(P.x + DIRS[P.dir][0] * 8, P.y - 22); ctx.quadraticCurveTo((P.x + f.bx) / 2, Math.min(P.y, f.by) - 18, f.bx, f.by + bob); ctx.stroke();
      R(f.bx - 2, f.by - 2 + bob, 4, 4, '#e8402a'); R(f.bx - 2, f.by - 2 + bob, 4, 1, '#ffffff');
      if (f.phase === 'bite') drawText('!', P.x, P.y - 36, '#ffe04a', 14, '#3b1d0a');
    }
    // noite, luzes e chuva
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const mn = W.meta ? nowMin() : 0, dusk = m.outdoor ? clamp((mn - 16.5 * 60) / 90, 0, 1) * (1 - clamp((mn - 19.5 * 60) / 60, 0, 1)) : 0;
    if (dusk > 0.01) { ctx.fillStyle = `rgba(255, 120, 40, ${dusk * 0.16})`; ctx.fillRect(0, 0, VW, VH); }
    if (nf > 0.01) {
      ctx.fillStyle = `rgba(20, 16, 60, ${nf})`; ctx.fillRect(0, 0, VW, VH);
      ctx.globalCompositeOperation = 'lighter';
      const light = (x, y, r, a) => { const g = ctx.createRadialGradient(x - camX, y - camY, 2, x - camX, y - camY, r); g.addColorStop(0, `rgba(255,200,120,${a})`); g.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = g; ctx.fillRect(x - camX - r, y - camY - r, r * 2, r * 2); };
      if (m.id === 'farm') for (const [k, v] of Object.entries(W.farm.t)) if (v && v.o && v.o.k === 'tocha') { const [x, y] = k.split(',').map(Number); light(x * T + 8, y * T + 4, 40, nf * 0.6); }
      if (m.id === 'farm') for (const b of Object.values(farmB())) if (bReady(b) && (b.type === 'coop' || b.type === 'barn')) light((b.x + BUILDS[b.type].w / 2) * T, (b.y + 1) * T, 40, nf * 0.3);
      for (const s of m.sprites) if (['house', 'store', 'smith', 'cottage', 'carpentry', 'ranch', 'bar', 'fishshop'].includes(s.type)) light(s.x * T + s.w * T / 2, (s.y + s.h) * T - 20, 50, nf * 0.35);
      if (m.cave) light(P.x, P.y - 10, 60, 0.15);
      ctx.globalCompositeOperation = 'source-over';
    }
    if (m.cave) {
      ctx.fillStyle = m.tier === 2 ? 'rgba(24,4,4,0.3)' : 'rgba(6,4,14,0.3)'; ctx.fillRect(0, 0, VW, VH);
      ctx.globalCompositeOperation = 'lighter';
      const glow = (x, y, r, a, col) => { const g = ctx.createRadialGradient(x - camX, y - camY, 1, x - camX, y - camY, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(x - camX - r, y - camY - r, r * 2, r * 2); };
      const fl = 0.85 + Math.sin(t * 9) * 0.06 + Math.sin(t * 23) * 0.04;
      for (const [lx, ly] of m.lanterns || []) glow(lx * T + 8, ly * T + 12, 70, 0.3 * fl, '255,160,70');
      if (m.tier === 2) for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (m.at(x, y) === G.WATER && (x + y) % 2 === 0) glow(x * T + 8, y * T + 8, 26, 0.12, '255,90,20');
      glow(P.x, P.y - 10, eqHas('anelbrilho') ? 120 : 64, eqHas('anelbrilho') ? 0.22 : 0.1, '255,220,170');
      ctx.globalCompositeOperation = 'source-over';
      const g = ctx.createRadialGradient(P.x - camX, P.y - 10 - camY, 30, P.x - camX, P.y - 10 - camY, Math.max(VW, VH) * 0.7);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.55)'); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
    }
    if (W.meta.rain && m.outdoor) {
      ctx.fillStyle = W.meta.snow ? 'rgba(255,255,255,0.85)' : 'rgba(180,210,255,0.55)';
      for (const d of rain) {
        d.y += dt * (W.meta.snow ? 0.15 : 1.2) * d.s; d.x += dt * (W.meta.snow ? 0.03 * Math.sin(t + d.s * 9) : -0.15);
        if (d.y > 1) { d.y -= 1; d.x = Math.random(); } if (d.x < 0) d.x += 1;
        if (W.meta.snow) ctx.fillRect(d.x * VW, d.y * VH, 2, 2); else ctx.fillRect(d.x * VW, d.y * VH, 1, 5);
      }
      ctx.fillStyle = 'rgba(40,60,90,0.12)'; ctx.fillRect(0, 0, VW, VH);
      drawStorm(dt);
    }
  }

  // ================= laço =================
  let last = performance.now(), hudT = 0, presT = 0, saveT = 0, tickT = 0;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; lastFrameAt = now;
    if (P && W.meta) {
      if (panelOpen) pauseClock(dt * 1000);
      lockT = Math.max(0, lockT - dt);
      if (toolAnim) { toolAnim.t += dt; if (toolAnim.t >= toolAnim.dur) toolAnim = null; }
      if (placing) updatePlacing(dt); else movePlayer(dt);
      updateAnimals(dt);
      updatePet(dt);
      loveFx = Math.max(0, loveFx - dt);
      updateMonsters(dt); bossBarUpdate();
      updateFishing(dt);
      if (holdUse && !panelOpen && !fishing && !placing && !P.ride && lockT <= 0) { const s = held(); if (s && item(s.id).cat === 'tool' && s.id !== 'rod') act(); }
      render(dt);
      hudT -= dt; if (hudT <= 0) { hudT = 0.25; updateHUD(); }
      presT -= dt; if (presT <= 0) { presT = window.__PRES_DT || 0.1; pushPresence(); }
      tickT -= dt; if (tickT <= 0) { tickT = 1; electHost(); hostTick(); checkDayEnd(); if (P.lastDay < W.meta.day) onNewDay(); }
      if (pDirty && now - pDirty > 1200) { pDirty = 0; savePlayer(); }
      saveT -= dt; if (saveT <= 0) { saveT = 20; savePlayer(); }
    }
    requestAnimationFrame(frame);
  }

  // ================= controles =================
  const joy = $('joy'), knob = joy.querySelector('i');
  let joyId = null, holdUse = false;
  function joyMove(e) {
    const r = joy.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let dx = e.clientX - cx, dy = e.clientY - cy; const max = r.width / 2 - 10, d = Math.hypot(dx, dy);
    if (d > max) { dx *= max / d; dy *= max / d; }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    input.jx = dx / max; input.jy = dy / max;
  }
  joy.addEventListener('pointerdown', e => { initAudio(); joyId = e.pointerId; try { joy.setPointerCapture(e.pointerId); } catch (_) {} joyMove(e); e.preventDefault(); });
  joy.addEventListener('pointermove', e => { if (e.pointerId === joyId) joyMove(e); });
  const joyEnd = e => { if (e.pointerId !== joyId) return; joyId = null; input.jx = input.jy = 0; knob.style.transform = ''; };
  joy.addEventListener('pointerup', joyEnd); joy.addEventListener('pointercancel', joyEnd);
  const bUse = $('bUse');
  bUse.addEventListener('pointerdown', e => { e.preventDefault(); initAudio(); holdUse = true; useTimer = performance.now(); act(); });
  let useTimer = 0;
  const useEnd = () => { holdUse = false; };
  bUse.addEventListener('pointerup', useEnd); bUse.addEventListener('pointercancel', useEnd); bUse.addEventListener('pointerleave', useEnd);
  $('bPet').addEventListener('click', () => { initAudio(); if (!panelOpen) togglePet(); });
  $('bMenu').addEventListener('click', () => { initAudio(); if (!P) return; if (placing) { toast(placing.type && !placing.move ? 'Construção cancelada.' : 'Mudança cancelada.'); placing = null; return; } if (panelOpen) closePanel(); else openInventory(); });
  $('hotbar').addEventListener('click', e => { const b = e.target.closest('[data-a="hot"]'); if (!b || !P) return; P.sel = +b.dataset.i; renderHotbar(); dirty(); });
  // tocar num quadrado perto da pessoa age nele
  cv.addEventListener('pointerdown', e => {
    initAudio();
    if (!P || panelOpen) return;
    const r = cv.getBoundingClientRect(), wx = (e.clientX - r.left) / r.width * VW + camX, wy = (e.clientY - r.top) / r.height * VH + camY;
    const tx = Math.floor(wx / T), ty = Math.floor(wy / T), [px, py] = ptile();
    if (placing) { const B = placeSize(); placing.x = clamp(tx - Math.floor(B.w / 2), 1, MAPS.farm.w - B.w - 1); placing.y = clamp(placing.type ? ty - B.h + 1 : ty, 1, MAPS.farm.h - B.h - 2); return; }
    if (Math.abs(tx - px) <= 1 && Math.abs(ty - py) <= 1 && !(tx === px && ty === py)) {
      const dx = tx - px, dy = ty - py;
      P.dir = Math.abs(dx) >= Math.abs(dy) && dx ? (dx > 0 ? 3 : 2) : dy > 0 ? 1 : 0;
      act([tx, ty]);
    } else if (tx === px && ty === py) act([tx, ty]);
  });
  // fisgada: segurar em qualquer lugar sobe a barra
  const fishEl = $('fish');
  fishEl.addEventListener('pointerdown', e => { e.preventDefault(); if (fishing) fishing.hold = true; });
  const fishUp = () => { if (fishing) fishing.hold = false; };
  fishEl.addEventListener('pointerup', fishUp); fishEl.addEventListener('pointercancel', fishUp);
  addEventListener('keydown', e => {
    if (e.target && e.target.tagName === 'INPUT') return;
    initAudio();
    input.keys[e.code] = true;
    if (!P) return;
    if (e.code === 'Escape') { if (panelOpen && panelKind !== 'start') closePanel(); return; }
    if (e.code === 'KeyE' || e.code === 'KeyI' || e.code === 'Tab') { e.preventDefault(); if (panelOpen) { if (panelKind !== 'start') closePanel(); } else openInventory(); return; }
    if (panelOpen) return;
    if (e.code === 'Space' || e.code === 'KeyJ' || e.code === 'KeyC' || e.code === 'Enter') { e.preventDefault(); if (fishing && fishing.phase === 'game') fishing.hold = true; else if (!e.repeat) { holdUse = true; act(); } }
    const n = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0'].indexOf(e.code);
    if (n >= 0) { P.sel = n; renderHotbar(); }
  });
  addEventListener('keyup', e => {
    input.keys[e.code] = false;
    if (e.code === 'Space' || e.code === 'KeyJ' || e.code === 'KeyC' || e.code === 'Enter') { holdUse = false; if (fishing) fishing.hold = false; }
  });
  addEventListener('blur', () => { input.keys = {}; holdUse = false; });
  addEventListener('pagehide', () => { if (P) savePlayer(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && P) savePlayer(); });

  // ================= início =================
  function createPlayer(name, lk) {
    // se o personagem salvo chegou enquanto a tela de criação estava aberta, carrega ele em vez de criar outro por cima
    if (W.players[myUid] && W.players[myUid].inv) { loadMine(W.players[myUid]); return; }
    P = newPlayer(myUid, name, lk);
    P.lastDay = W.meta.day;
    if (lk.pet) { P.pet = { name: 'Darth', mode: 'follow' }; petInit(); }
    W.players[P.uid] = playerDoc();
    savePlayer();
    closePanel(); renderHotbar();
    toast(`Boas-vindas, ${name}!`, 'big');
    setTimeout(() => toast('Use o círculo para andar e o botão Usar para agir. A mochila guarda tudo.'), 1500);
    setTimeout(() => toast('Plante as pastinacas: enxada na terra, sementes, e depois o regador.'), 5000);
  }
  let myUid = null;
  const withTimeout = (p, ms) => Promise.race([p, new Promise(r => setTimeout(() => r(null), ms))]);
  // o banco pode entregar primeiro uma versão provisória (do cache); só a versão do servidor vale para decidir se há jogo salvo
  const definitive = s => !(s && s.metadata && s.metadata.fromCache);
  function bootError(msg) {
    openPanel(`<h2>Não consegui abrir a chacrinha</h2><p style="text-align:center">${esc(msg)}</p><p style="text-align:center;font-size:13px">O progresso de vocês continua salvo. Verifique a internet e tente de novo. Se esta conta foi convidada, o convite precisa ser de Colaborador.</p><div class="row"><button class="btn g" data-a="reload" type="button">Tentar de novo</button></div>`, 'loading');
  }
  async function boot() {
    try { await bootInner(); } catch (e) { console.error(e); bootError('Algo deu errado ao abrir o jogo (' + ((e && e.message) || e) + ').'); }
  }
  function loadMine(mine) {
    // os dados que chegam do banco são somente leitura: trabalha sempre numa cópia
    const m = clone(mine);
    P = deepMerge(newPlayer(myUid, m.name, clone(m.look) || {}), m);
    P.sleep = false; P.ride = false;
    setTimeout(petInit, 0);
    if (!MAPS[P.map] && !(P.map || '').startsWith('mine') && !((P.map || '').startsWith('b:') && farmB()[P.map.slice(2)])) { P.map = 'farm'; P.x = 9 * T + 8; P.y = 8 * T + 8; }
    if (P.map.startsWith('mine') && P.map !== 'minetop') { P.map = 'minetop'; P.x = 8 * T + 8; P.y = 9 * T + 8; }
    closePanel(); renderHotbar();
    if (P.lastDay < W.meta.day) { P.sleep = true; onNewDay(); } else toast(`Que bom te ver, ${P.name}!`);
    document.getElementById('hpBar').hidden = !curMap().cave;
  }
  async function bootInner() {
    // no app instalado, antes de tudo a pessoa diz qual é a chacrinha e quem ela é
    if (window.__chacrinhaGate) { try { await window.__chacrinhaGate(); } catch (e) { bootError('Não consegui conectar ao servidor da chacrinha (' + ((e && e.message) || e) + ').'); return; } }
    openPanel('<h2>Carregando a chacrinha...</h2><p id="loadmsg" style="text-align:center;font-size:13px">Conectando ao salvamento online...</p>', 'loading');
    let db = null, rm = null, us = null;
    const inClaude = !!(window.claude && window.claude.use);
    if (inClaude) {
      [db, rm, us] = await Promise.all([withTimeout(window.claude.use('db'), 20000), withTimeout(window.claude.use('room'), 20000), withTimeout(window.claude.use('user'), 20000)]).catch(() => [null, null, null]);
      // dentro do Claude, nunca cair num jogo só do aparelho: isso pareceria que o progresso sumiu
      if (!db) { bootError('O salvamento online não respondeu.'); return; }
    }
    if (us) { try { myUid = await us.id(); } catch (e) { myUid = null; } }
    if (!myUid) { try { myUid = localStorage.getItem(LS + ':uid'); if (!myUid) { myUid = 'p' + Math.floor(Math.random() * 1e9); localStorage.setItem(LS + ':uid', myUid); } } catch (e) { myUid = 'p' + Math.floor(Math.random() * 1e9); } }
    if (db) { store = db; online = true; room = rm; userCap = us; }
    else { store = LocalStore(); online = false; room = null; }
    // assina os documentos compartilhados
    let gotMeta = false, gotFarm = false, gotPlayers = false, gotClock = false;
    const err = e => console.warn('db', e);
    store.doc('world/meta').onSnapshot(s => {
      if (definitive(s)) gotMeta = true;
      if (!s.exists) return;
      const d = s.data(), prevDay = W.meta ? W.meta.day : 0;
      W.meta = deepMerge(newMeta(), clone(d)); W.meta.taken = W.meta.taken || {};
      if (prevDay && W.meta.day > prevDay) { mineCache.clear(); onNewDay(); }
    }, err);
    store.doc('world/farm').onSnapshot(s => {
      if (definitive(s)) gotFarm = true;
      if (!s.exists) return;
      const d = s.data() || {};
      const t = stripNull(clone(d.t || {}));
      for (const k of Object.keys(t)) if (!t[k] || !Object.keys(t[k]).length) delete t[k];
      W.farm.t = t;
      for (const sec of ['b', 'a', 'pots']) W.farm[sec] = stripNull(clone(d[sec] || {}));
      W.farm.hay = d.hay || 0; W.farm.fridge = d.fridge ? clone(d.fridge) : null;
      const q = pend['world/farm'];
      if (q && q.patch) {
        for (const sec of ['t', 'b', 'a', 'pots']) for (const [k, v] of Object.entries(q.patch[sec] || {})) { if (v) W.farm[sec][k] = stripNull(clone(v)); else delete W.farm[sec][k]; }
        if ('hay' in q.patch) W.farm.hay = q.patch.hay;
        if ('fridge' in q.patch) W.farm.fridge = q.patch.fridge;
      }
      bVer++;
      if (panelKind === 'fridge' && panelOpen) renderFridge();
      if (panelKind === 'chest' && panelOpen) renderChest(panelArg);
    }, err);
    store.doc('world/clock').onSnapshot(s => { if (definitive(s)) gotClock = true; if (s.exists) { const c = s.data(); if (!host || !W.clock.by || c.by !== (P && P.uid)) W.clock = clone(c); } }, err);
    store.collection('players').onSnapshot(qs => {
      if (definitive(qs)) gotPlayers = true;
      for (const d of qs.docs) { const v = d.data(); if (v && v.uid) W.players[v.uid] = clone(v); }
    }, err);
    const t0 = Date.now();
    while (!(gotMeta && gotFarm && gotPlayers && gotClock)) {
      await new Promise(r => setTimeout(r, 100));
      const el = $('loadmsg'), wait = Date.now() - t0;
      if (el && wait > 8000) el.textContent = 'A conexão está lenta, ainda carregando...';
      if (wait > 45000) { bootError('O servidor demorou demais para responder.'); return; }
    }
    // só cria uma chacrinha nova quando o servidor confirma que não existe nenhuma
    if (!W.meta) {
      // primeira vez: cria o sítio
      const meta = newMeta(), farm = newFarm(), clock = { min: DAY_START, at: Date.now(), day: 1, by: myUid };
      W.meta = meta; W.farm = farm; W.clock = clock;
      try { await store.doc('world/meta').set(meta); await store.doc('world/farm').set(farm); await store.doc('world/clock').set(clock); } catch (e) { netError(e); }
    }
    if (room) {
      room.onPeers(ch => {
        const list = (ch && ch.peers) || [];
        peers = list; notePeers(list);
        const me = list.find(p => p.isMe && p.sameTab); if (me) myPeer = me.peer;
        electHost();
        for (const k of [...remote.keys()]) if (!list.some(p => p.peer === k)) remote.delete(k);
      }, () => { room = null; host = true; });
      room.on('p2p', onP2P);
      room.on('mine', msg => {
        if (msg.sameTab) return;
        const d = msg.data || {};
        if (d.d !== W.meta.day) return;
        const m = getMap('mine' + d.f);
        brokenSet(d.f).add(d.k);
        if (d.ladder && !m.ladder) m.ladder = d.ladder;
      });
    }
    const mine = W.players[myUid];
    if (mine) loadMine(mine);
    else {
      let nm = '';
      if (userCap && userCap.me) { try { const me = await userCap.me(); nm = (me && me.name || '').split(' ')[0]; } catch (e) {} }
      openStart(nm);
    }
    pushPresence(true);
  }
  resize();
  requestAnimationFrame(frame);
  boot();
})();
</script>
