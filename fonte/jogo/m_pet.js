
  // ================= Darth, o gato preto de olhos verdes =================
  // follow: anda atrás da dona · roam: fica passeando onde foi deixado · come: foi chamado e está vindo
  const petSt = { map: null, x: 0, y: 0, dir: 3, mv: 0, idle: 0, lost: 0, tx: 0, ty: 0, wait: 0, heart: 0 };
  function petInit() {
    if (!P || !P.pet) return;
    const p = P.pet;
    if (p.mode === 'roam' && p.map) { petSt.map = p.map; petSt.x = p.x || p.hx || P.x; petSt.y = p.y || p.hy || P.y; }
    else { p.mode = 'follow'; petSt.map = P.map; petSt.x = P.x - 14; petSt.y = P.y + 2; }
    petSt.tx = petSt.x; petSt.ty = petSt.y; updatePetButton();
  }
  function meow() { tone(760, 520, 0.18, 'sine', 0.07); tone(560, 820, 0.22, 'sine', 0.06, 0.16); }
  function updatePetButton() {
    const b = $('bPet'); if (!b) return;
    b.hidden = !(P && P.pet);
    if (P && P.pet) { b.classList.toggle('roam', P.pet.mode === 'roam'); b.title = P.pet.mode === 'roam' ? 'Chamar o Darth' : 'Deixar o Darth passear'; }
  }
  function togglePet() {
    if (!P || !P.pet) return;
    const p = P.pet;
    if (p.mode === 'roam') { p.mode = 'come'; meow(); toast(petSt.map === P.map ? 'Darth! Vem cá! 🐾' : 'Chamando o Darth... ele já vem! 🐾'); }
    else { p.mode = 'roam'; p.map = petSt.map; p.hx = petSt.x; p.hy = petSt.y; toast(`Darth vai ficar passeando por aqui (${placeName(petSt.map)}). Toque no 🐾 para chamar de volta.`); }
    dirty(); updatePetButton();
  }
  function petFree(m, x, y) { return !solidAt(m, Math.floor(x / T), Math.floor((y - 3) / T)); }
  function updatePet(dt) {
    if (!P || !P.pet) return;
    const p = P.pet, s = petSt;
    s.heart = Math.max(0, s.heart - dt);
    if (p.mode === 'roam') {
      if (s.map !== P.map) return;
      const m = getMap(s.map);
      if (s.mv) {
        const dx = s.tx - s.x, dy = s.ty - s.y, d = Math.hypot(dx, dy), sp = 34 * dt;
        if (d < sp) { s.mv = 0; s.wait = rnd(2, 6); }
        else { const nx = s.x + dx / d * sp, ny = s.y + dy / d * sp; if (petFree(m, nx, ny)) { s.x = nx; s.y = ny; if (Math.abs(dx) > 0.5) s.dir = dx < 0 ? 2 : 3; } else { s.mv = 0; s.wait = 1; } }
      } else {
        s.wait -= dt; s.idle += dt;
        if (s.wait <= 0) { const a = Math.random() * TAU, r = Math.random() * 56, x = (p.hx || s.x) + Math.cos(a) * r, y = (p.hy || s.y) + Math.sin(a) * r * 0.7; if (petFree(m, x, y)) { s.tx = x; s.ty = y; s.mv = 1; s.idle = 0; } else s.wait = 0.5; }
      }
      return;
    }
    // seguindo (ou vindo depois de chamado)
    if (s.map !== P.map) {
      s.lost += dt;
      if (s.lost > (p.mode === 'come' ? 1.4 : 0.5)) {
        s.map = P.map; s.x = P.x - DIRS[P.dir][0] * 18 - 6; s.y = P.y - DIRS[P.dir][1] * 14 + 2; s.lost = 0;
        if (p.mode === 'come') { p.mode = 'follow'; meow(); toast('Darth veio correndo! 🐈‍⬛'); dirty(); updatePetButton(); }
      }
      return;
    }
    s.lost = 0;
    const off = [[12, 7], [-15, 1], [18, 3], [-18, 3]][P.dir], tx = P.x + off[0], ty = P.y + off[1];
    const dx = tx - s.x, dy = ty - s.y, d = Math.hypot(dx, dy);
    if (d > 260) { s.x = tx; s.y = ty; return; }
    const sp = (d > 70 || p.mode === 'come' ? 150 : d > 16 ? 95 : 0) * dt;
    if (sp > 0) { const k = Math.min(1, sp / d); s.x += dx * k; s.y += dy * k; s.mv = 1; s.idle = 0; if (Math.abs(dx) > 1) s.dir = dx < 0 ? 2 : 3; }
    else { s.mv = 0; s.idle += dt; }
    if (p.mode === 'come' && d < 22) { p.mode = 'follow'; meow(); toast('Darth chegou! 💚'); dirty(); updatePetButton(); }
  }
  const petPresence = () => (P && P.pet && petSt.map ? [Math.round(petSt.x), Math.round(petSt.y), petSt.dir, petSt.mv ? 1 : 0, petSt.map, petSt.idle > 4 ? (petSt.idle > 12 ? 2 : 1) : 0, darthDeCapa(petSt.map) ? 1 : 0] : null);
  // desenho: de lado, andando, sentado ou dormindo enroladinho
  function catCanvas(pose, f, coat) {
    return bake(`cat|${pose}|${f}|${coat ? 1 : 0}`, 20, 16, () => {
      const body = () => {
      const c = '#1c1c24', l = '#34343f', eye = '#5ae05a';
      if (pose === 'sleep') {
        oval(10, 11, 8, 4.5, c); oval(9, 10, 6, 3, l); disc(15, 10, 3.5, c); poly([[13, 7], [14, 4], [16, 7]], c); poly([[16, 7], [18, 4], [18, 8]], c);
        R(14, 10, 2, 1, '#3a6a3a'); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(10, 11, 7, 0.2, 2.6); ctx.stroke();
        return;
      }
      if (pose === 'sit') {
        oval(9, 11, 5, 4.5, c); oval(8, 10, 3, 3, l); disc(12, 6, 3.6, c); poly([[9.5, 4], [10, 0], [12, 3]], c); poly([[13, 3], [15, 0], [15.5, 4.5]], c);
        R(13, 5, 2, 2, eye); R(14, 5, 1, 2, '#0a1a0a'); R(10, 5, 2, 2, eye); R(11, 5, 1, 2, '#0a1a0a'); R(12, 8, 1, 1, '#e88a9a');
        ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(5, 14); ctx.quadraticCurveTo(1, 14, 2, 10); ctx.stroke();
        R(7, 14, 2, 2, c); R(10, 14, 2, 2, c);
        return;
      }
      const leg = f ? 1 : -1;
      R(5 + leg, 11, 2, 4, c); R(8 - leg, 11, 2, 4, c); R(11 + leg, 11, 2, 4, c); R(13 - leg, 11, 2, 4, c);
      oval(10, 9, 6.5, 3.5, c); R(6, 7, 7, 1, l);
      disc(15.5, 6, 3.4, c); poly([[13, 4], [13.5, 0.5], [15.5, 3]], c); poly([[16.5, 3], [18.5, 0.5], [18.5, 4.5]], c);
      R(16, 5, 2, 2, eye); R(17, 5, 1, 2, '#0a1a0a'); R(18, 7, 1, 1, '#e88a9a');
      ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(4, 8); ctx.quadraticCurveTo(0, f ? 6 : 8, 1, 2); ctx.stroke();
      };
      body();
      if (coat) drawCatCoat(pose, f);
    });
  }
  function drawCat(x, y, dir, mv, pose, coat) {
    const f = mv ? Math.floor(performance.now() / 120) % 2 : 0;
    const c = catCanvas(mv ? 'walk' : pose || 'walk', f, coat);
    x = Math.round(x); y = Math.round(y);
    shadowAt(x, y, 6, 1.6);
    ctx.save(); ctx.translate(x, y - 15);
    if (dir === 2) { ctx.scale(-1, 1); ctx.drawImage(c, -10, 0); } else ctx.drawImage(c, -10, 0);
    ctx.restore();
    if (!mv && pose !== 'sleep' && P && nightF() > 0.3) { R(x + (dir === 2 ? -6 : 5), y - 10, 1, 1, '#9aff9a'); }
  }
  const POSES = ['walk', 'sit', 'sleep'];
  function petEnts(m, ents) {
    if (P && P.pet && petSt.map === m.id) {
      const s = petSt, pose = s.idle > 12 ? 'sleep' : s.idle > 2.5 ? 'sit' : 'walk';
      s.coat = darthDeCapa(m.id);
      ents.push({ y: s.y, f: () => { if (!drawCatReact(s, s.x, s.y, s.dir, s.mv, pose)) drawCat(s.x, s.y, s.dir, s.mv, pose, s.coat); if (s.heart > 0) drawHeart(s.x, s.y - 20 - (1.6 - s.heart) * 6, '#5ae05a'); } });
    }
    for (const p of peerPlayers()) {
      if (p.me || !p.pt || p.pt[4] !== m.id) continue;
      const key = 'pet:' + p.peer;
      let r = remote.get(key); if (!r) { r = { x: p.pt[0], y: p.pt[1], heart: 0 }; remote.set(key, r); }
      r.x += (p.pt[0] - r.x) * 0.25; r.y += (p.pt[1] - r.y) * 0.25; r.coat = !!p.pt[6];
      ents.push({ y: r.y, f: () => { if (!drawCatReact(r, r.x, r.y, p.pt[2], p.pt[3], POSES[p.pt[5]] || 'walk')) drawCat(r.x, r.y, p.pt[2], p.pt[3], POSES[p.pt[5]] || 'walk', r.coat); r.heart = Math.max(0, (r.heart || 0) - 1 / 60); if (r.heart > 0) drawHeart(r.x, r.y - 20 - (1.6 - r.heart) * 6, '#5ae05a'); } });
    }
  }
  // fazer carinho no Darth (o seu ou o da outra pessoa)
  function petCatAt(m, px, py) {
    if (P.pet && petSt.map === m.id && Math.hypot(petSt.x - px, petSt.y - 6 - py) < 14) { if (vestirDarth()) return true; if (feedCat(true)) { catReact(petSt); return true; } petSt.idle = 3; petOwnCat(); return true; }
    for (const p of peerPlayers()) {
      if (p.me || !p.pt || p.pt[4] !== m.id) continue;
      const r = remote.get('pet:' + p.peer) || { x: p.pt[0], y: p.pt[1] };
      if (Math.hypot(r.x - px, r.y - 6 - py) < 14) { if (feedCat(false, p.uid)) { catReact(r); return true; } meow(); toast(catReact(r), 'big', null, 'darth'); emitP2P({ type: 'petlove', to: p.uid }); return true; }
    }
    return false;
  }
