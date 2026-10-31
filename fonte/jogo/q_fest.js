
  // ================= festivais das estações: barraca da Dona Cida na praça da vila =================
  // resultados ficam em W.meta.fest[dia][uid]; presentes do amigo secreto em W.meta.gifts[uid]
  const FESTS = {
    'spring:13': { id: 'ovo', name: 'Festa do Ovo', desc: 'Caça aos ovos pela vila: 1 minuto para achar o máximo de ovos coloridos.' },
    'spring:24': { id: 'flores', name: 'Dança das Flores', desc: 'Uma dança na praça, cheia de flores, com quem você ama.' },
    'summer:11': { id: 'luau', name: 'Luau', desc: 'Cada um põe um ingrediente na sopa da vila. Sopa boa deixa todo mundo feliz.' },
    'summer:28': { id: 'aguasvivas', name: 'Noite das Águas-vivas', desc: 'Depois das 20h, águas-vivas brilhantes passam pelo mar da praia.' },
    'fall:16': { id: 'feira', name: 'Feira do Vale', desc: 'Exposição de produtos com prêmios e a Roda da Sorte.' },
    'fall:27': { id: 'espiritos', name: 'Noite dos Espíritos', desc: 'Um labirinto assombrado com uma abóbora dourada no fim.' },
    'winter:8': { id: 'gelo', name: 'Festival do Gelo', desc: 'Pescaria no gelo: 1 minuto para pegar o máximo de peixes.' },
    'winter:25': { id: 'estrela', name: 'Estrela de Inverno', desc: 'Amigo secreto: escolha um presente para a outra pessoa.' },
  };
  const festOn = (d = W.meta.day) => FESTS[season(d) + ':' + dom(d)] || null;
  const BOOTH = { x: 18, y: 13 };
  const HOST_LOOK = { hair: 3, style: 1, shirt: 4, skin: 1, pants: '#6a3a5a', apron: '#d84a6a' };
  const festMine = () => ((W.meta.fest || {})[W.meta.day] || {})[P.uid] || null;
  function festSave(data) {
    const d = W.meta.day; W.meta.fest = W.meta.fest || {}; W.meta.fest[d] = W.meta.fest[d] || {}; W.meta.fest[d][P.uid] = data;
    queueUpdate('world/meta', { fest: { [d]: { [P.uid]: data } } });
  }
  const partner = () => Object.values(W.players).find(p => p && p.uid !== P.uid) || null;
  function festOthersHTML(fmtFn) {
    const all = (W.meta.fest || {})[W.meta.day] || {};
    const rows = Object.entries(all).filter(([u]) => u !== 'gifts').map(([u, v]) => `<div class="item"><span class="nm"><b>${esc((W.players[u] || {}).name || (u === P.uid ? P.name : '?'))}</b><small>${fmtFn(v)}</small></span></div>`);
    return rows.length ? `<div class="list">${rows.join('')}</div>` : '';
  }
  function nearBooth() { return P.map === 'town' && !!festOn() && Math.hypot(P.x - (BOOTH.x + 1.5) * T, P.y - (BOOTH.y + 2) * T) < 30; }
  function festLine() { const f = festOn(); return f ? `<p class="big" style="text-align:center">🎉 Hoje tem ${f.name} na praça da vila! Fale com a Dona Cida na barraca.</p>` : ''; }

  // ---------- painel da barraca ----------
  let festRun = null; // minijogo em andamento: { kind, t, n, eggs }
  function openFest() {
    const f = festOn(); if (!f) return;
    const mine = festMine(), pt = partner();
    let body = `<p style="text-align:center">${f.desc}</p>`;
    const done = mine ? '<p class="big" style="text-align:center">Você já participou hoje!</p>' : '';
    switch (f.id) {
      case 'ovo': body += done || '<div class="row"><button class="btn g" data-a="festGo" type="button">Começar a caça!</button></div>'; body += festOthersHTML(v => `${v.n} ovos`); break;
      case 'gelo': body += done || '<div class="row"><button class="btn g" data-a="festGo" type="button">Começar a pescaria!</button></div>'; body += festOthersHTML(v => `${v.n} peixes`); break;
      case 'flores': body += mine ? '<p class="big" style="text-align:center">Que dança linda! 💐</p>' : `<div class="row"><button class="btn g" data-a="festGo" type="button">Dançar${pt ? ' com ' + esc(pt.name) : ''}</button></div>`; break;
      case 'aguasvivas': body += `<p style="text-align:center">${nowMin() >= 1200 ? 'Corra para a praia: as águas-vivas já estão brilhando!' : 'Volte depois das 20h e vá até a praia.'}</p>`; break;
      case 'luau': {
        if (!mine) body += `<p style="text-align:center">Escolha o que vai na sopa:</p><div class="list">${luauChoices().map(([s, i]) => `<div class="item"><img src="${iconURL(s.id)}" alt=""><span class="nm">${item(s.id).name}${s.q ? ` <span class="qtag q${s.q}">★</span>` : ''}</span><button class="btn g" data-a="festSoup" data-i="${i}" type="button">Pôr</button></div>`).join('') || '<p>Nada na mochila serve para sopa.</p>'}</div>`;
        else body += done;
        body += festOthersHTML(v => `pôs ${item(v.id).name}: ${v.r}`);
        break;
      }
      case 'feira': {
        body += mine ? `<p class="big" style="text-align:center">Sua exposição: ${mine.place}</p>` : `<p style="text-align:center">Escolha até 9 itens para a exposição (eles voltam para você):</p><div class="list">${fairChoices().map(([s, i]) => `<div class="item"><img src="${iconURL(s.id)}" alt=""><span class="nm">${item(s.id).name}${s.q ? ` <span class="qtag q${s.q}">★</span>` : ''}</span><button class="btn ${fairPick.includes(i) ? 'g' : ''}" data-a="festPick" data-i="${i}" type="button">${fairPick.includes(i) ? '✓' : '+'}</button></div>`).join('')}</div><div class="row"><button class="btn g" data-a="festShow" type="button">Apresentar (${fairPick.length}/9)</button></div>`;
        body += festOthersHTML(v => `exposição: ${v.place}`);
        body += `<h3>Roda da Sorte</h3><p style="text-align:center;font-size:13px">Aposte: verde dobra, laranja perde.</p><div class="row"><button class="btn" data-a="festSpin" data-v="100" type="button">100 ₲</button><button class="btn" data-a="festSpin" data-v="500" type="button">500 ₲</button></div>`;
        break;
      }
      case 'espiritos': body += `<div class="row"><button class="btn g" data-a="festGo" type="button">Entrar no labirinto</button></div>`; break;
      case 'estrela': {
        const sent = ((W.meta.fest || {})[W.meta.day] || {})[P.uid];
        if (!pt) body += '<p style="text-align:center">Quando a outra pessoa entrar na chacrinha, vocês podem trocar presentes.</p>';
        else if (sent) body += `<p class="big" style="text-align:center">Você deu ${item(sent.id).name} para ${esc(pt.name)}! 🎁</p>`;
        else body += `<p style="text-align:center">Escolha o presente de ${esc(pt.name)}:</p><div class="list">${P.inv.map((s, i) => [s, i]).filter(([s]) => s && item(s.id).cat !== 'tool').map(([s, i]) => `<div class="item"><img src="${iconURL(s.id)}" alt=""><span class="nm">${item(s.id).name}${s.q ? ` <span class="qtag q${s.q}">★</span>` : ''}</span><button class="btn g" data-a="festGift" data-i="${i}" type="button">Dar</button></div>`).join('')}</div>`;
        break;
      }
    }
    openPanel(`<h2>${f.name}</h2>${body}`, 'fest');
  }

  // ---------- caça aos ovos ----------
  function startEggHunt() {
    const m = MAPS.town, eggs = [];
    for (let i = 0; i < 400 && eggs.length < 26; i++) {
      const x = 4 + Math.floor(Math.random() * 40), y = 4 + Math.floor(Math.random() * 24);
      if (m.solid[y * m.w + x] || [G.WATER, G.FOREST].includes(m.at(x, y)) || eggs.some(e => e.x === x && e.y === y)) continue;
      eggs.push({ x, y, c: pick(['#e8402a', '#4a8ae8', '#f4c83a', '#5ad84a', '#c86ae8', '#ff8ac8']) });
    }
    festRun = { kind: 'ovo', t: 60, n: 0, eggs };
    closePanel(); toast('Ache os ovos coloridos pela vila! Você tem 1 minuto.', 'big');
  }
  // ---------- pescaria no gelo ----------
  function startIceFishing() {
    festRun = { kind: 'gelo', t: 60, n: 0 };
    closePanel(); toast('Pegue o máximo de peixes em 1 minuto!', 'big');
  }
  function iceNextFish() {
    const pool = ['perca', 'brema', 'carpa', 'sardinha', 'lucio'], id = pick(pool), lv = skillLv(P.skills.fishing);
    fishing = { phase: 'game', id, diff: Math.min(40, FISH[id].diff), water: 'river', barH: 34 + lv * 2.5, bv: 0, fy: 80, fv: 0, target: 60, prog: 0.35, hold: false, tt: 0, chestAt: -1, ice: true };
    fishing.bar = 120 - fishing.barH - 2;
    document.getElementById('fish').hidden = false;
  }
  // chamado a cada quadro
  function festUpdate(dt) {
    if (!festRun) return;
    festRun.t -= dt;
    if (festRun.kind === 'ovo') {
      if (P.map === 'town') for (const e of festRun.eggs) if (!e.got && Math.hypot(P.x - (e.x * T + 8), P.y - (e.y * T + 10)) < 11) { e.got = true; festRun.n++; sfx.pop(); }
      if (festRun.t <= 0 || festRun.eggs.every(e => e.got)) {
        const n = festRun.n, prize = n >= 15 ? 1000 : n >= 8 ? 500 : 200;
        festRun = null; festSave({ n }); earn(prize); sfx.level();
        const pt = partner(), other = pt && ((W.meta.fest || {})[W.meta.day] || {})[pt.uid];
        toast(`Fim da caça! Você achou ${n} ovos e ganhou ${fmt(prize)} ₲.${other ? ` ${pt.name} achou ${other.n}.` : ''}`, 'big');
      }
    } else if (festRun.kind === 'gelo') {
      if (festRun.t <= 0) {
        const n = festRun.n, prize = n >= 5 ? 1000 : n >= 3 ? 500 : 200;
        festRun = null; fishing = null; document.getElementById('fish').hidden = true;
        festSave({ n }); earn(prize); if (n >= 5) addItem('anzolfarpado', 1, true); sfx.level();
        toast(`Fim da pescaria! ${n} peixe${n === 1 ? '' : 's'} e ${fmt(prize)} ₲${n >= 5 ? ' + um anzol farpado' : ''}.`, 'big');
      } else if (!fishing) iceNextFish();
    }
    festHud();
  }
  function festHud() {
    let el = document.getElementById('festhud');
    if (!festRun) { if (el) el.hidden = true; return; }
    if (!el) { el = document.createElement('div'); el.id = 'festhud'; el.className = 'frame'; el.style.cssText = 'position:absolute;left:50%;transform:translateX(-50%);top:calc(10px + env(safe-area-inset-top, 0px));z-index:30;padding:4px 12px;font-size:15px;pointer-events:none'; document.getElementById('game').appendChild(el); }
    el.hidden = false;
    el.textContent = `${festRun.kind === 'ovo' ? '🥚 ' + festRun.n + ' ovos' : '🐟 ' + festRun.n + ' peixes'} · ${Math.ceil(festRun.t)} s`;
  }
  const festFishCaught = () => { if (festRun && festRun.kind === 'gelo') festRun.n++; };

  // ---------- luau ----------
  const luauChoices = () => P.inv.map((s, i) => [s, i]).filter(([s]) => s && ['veg', 'fruit', 'fish', 'art', 'animal', 'forage', 'food', 'flower', 'grao'].includes(item(s.id).cat));
  function addToSoup(i) {
    const s = P.inv[i]; if (!s || festMine()) return;
    const v = sellPrice(s.id, s.q), r = v >= 300 ? 'a vila amou! 😍' : v >= 100 ? 'ficou gostosa! 😋' : v >= 30 ? 'deu pro gasto 🙂' : 'ficou esquisita... 😖', pts = v >= 300 ? 120 : v >= 100 ? 60 : v >= 30 ? 20 : -30;
    s.n--; if (s.n <= 0) P.inv[i] = null;
    for (const id of Object.keys(NPCS)) { const rr = rel(id); rr.pts = clamp(rr.pts + pts, 0, 2500); }
    festSave({ id: s.id, r }); dirty(); renderHotbar(); sfx.pop();
    toast(`Você pôs ${item(s.id).name} na sopa: ${r}`, 'big');
    openFest();
  }
  // ---------- feira ----------
  let fairPick = [];
  const fairChoices = () => P.inv.map((s, i) => [s, i]).filter(([s]) => s && ['veg', 'fruit', 'fish', 'art', 'animal', 'forage', 'flower', 'grao', 'gem', 'mineral'].includes(item(s.id).cat));
  function fairShow() {
    if (!fairPick.length || festMine()) return;
    const items = fairPick.map(i => P.inv[i]).filter(Boolean), cats = new Set(items.map(s => item(s.id).cat));
    const score = items.reduce((a, s) => a + 10 + (s.q || 0) * 8 + Math.min(10, item(s.id).sell / 30), 0) + cats.size * 6;
    const [place, prize] = score >= 170 ? ['1º lugar! 🥇', 1500] : score >= 110 ? ['2º lugar! 🥈', 800] : score >= 60 ? ['3º lugar! 🥉', 400] : ['participação', 100];
    fairPick = []; festSave({ place, score: Math.round(score) }); earn(prize); sfx.level();
    toast(`Exposição: ${place} Prêmio de ${fmt(prize)} ₲.`, 'big'); openFest();
  }
  function fairSpin(v) {
    if (gold() < v || !spend(v)) { toast('Faltam moedas.'); return; }
    const win = Math.random() < 0.5;
    if (win) earn(v * 2);
    sfx[win ? 'coin' : 'no'](); toast(win ? `A roda parou no verde! +${fmt(v * 2)} ₲` : 'A roda parou no laranja... Não foi dessa vez.', 'big');
  }
  // ---------- dança das flores ----------
  function flowerDance() {
    const pt = partner();
    openPanel(`<h2>Dança das Flores</h2><canvas id="dancecv" width="120" height="70" style="width:100%;max-width:360px;image-rendering:pixelated;display:block;margin:0 auto;border-radius:6px"></canvas><p style="text-align:center">${pt ? `Você e ${esc(pt.name)} dançaram juntinhos! 💕` : 'Você dançou na praça cheia de flores!'}</p><div class="row"><button class="btn g" data-a="close" type="button">Que lindo!</button></div>`, 'fest');
    const c = document.getElementById('dancecv'), t0 = performance.now(), petals = Array.from({ length: 30 }, () => ({ x: Math.random() * 120, y: Math.random() * 70, s: 6 + Math.random() * 10, c: pick(['#ff8ac8', '#f4c83a', '#ffffff', '#e8402a']) }));
    const loop = () => {
      if (!document.getElementById('dancecv')) return;
      const t = (performance.now() - t0) / 1000, saved = ctx; ctx = c.getContext('2d');
      ctx.fillStyle = '#8ad05a'; ctx.fillRect(0, 0, 120, 70); ctx.fillStyle = '#b8e07a'; ctx.fillRect(0, 50, 120, 20);
      const step = Math.floor(t * 3) % 4, dirA = [1, 3, 0, 2][step], dirB = [1, 2, 0, 3][step], sway = Math.sin(t * 6) * 3;
      drawFarmer(48 + sway, 56, P.look, dirA, step % 2);
      if (pt) drawFarmer(72 - sway, 56, pt.look || {}, dirB, (step + 1) % 2);
      for (const p of petals) { p.y += 0.25 * p.s / 10; p.x += Math.sin(t * 2 + p.s) * 0.3; if (p.y > 70) { p.y = -2; p.x = Math.random() * 120; } R(p.x, p.y, 2, 2, p.c); }
      if (pt) drawHeart(60, 18 + Math.sin(t * 4) * 2);
      ctx = saved;
      requestAnimationFrame(loop);
    };
    loop();
    if (!festMine()) {
      festSave({ n: 1 });
      for (const id of Object.keys(NPCS)) { const rr = rel(id); rr.pts = clamp(rr.pts + 40, 0, 2500); }
      P.buff = { b: { luck: 2, speed: 1 }, until: nowMin() + 7 * 60, day: W.meta.day, name: 'Dança das Flores' }; dirty();
    }
  }
  // ---------- estrela de inverno: amigo secreto ----------
  function winterGift(i) {
    const s = P.inv[i], pt = partner(); if (!s || !pt || festMine()) return;
    const g = { id: s.id, n: 1, from: P.name, day: W.meta.day };
    s.n--; if (s.n <= 0) P.inv[i] = null;
    W.meta.gifts = W.meta.gifts || {}; W.meta.gifts[pt.uid] = g;
    queueUpdate('world/meta', { gifts: { [pt.uid]: g } });
    festSave({ id: g.id });
    // a vila também tem um amigo secreto para você
    const npcGift = pick(['frutaestelar', 'diamante', 'bolomel', 'tortaabobora', 'anelsorte', 'adubobom']);
    addItem(npcGift, npcGift === 'adubobom' ? 10 : 1, true);
    dirty(); renderHotbar(); sfx.level();
    toast(`Presente entregue para ${pt.name}! E o seu amigo secreto da vila te deu: ${item(npcGift).name}.`, 'big');
    openFest();
  }
  // presentes que chegaram pela troca chegam como carta
  function deliverGifts() {
    const g = W.meta.gifts && W.meta.gifts[P.uid]; if (!g) return;
    sendMail('ws:' + g.day + ':' + g.id, g.from, `Amigo secreto da Estrela de Inverno! Um presente com carinho para você. 🎁`, { items: [[g.id, g.n]] });
    delete W.meta.gifts[P.uid]; queueUpdate('world/meta', { gifts: { [P.uid]: null } });
  }
  // ---------- noite dos espíritos: labirinto ----------
  function buildMaze() {
    const cw = 10, ch = 7, Wd = cw * 2 + 3, Hd = ch * 2 + 4, r = srand(W.meta.day * 31 + 7);
    const m = newMap('maze', Wd, Hd, G.ROCKWALL, { name: 'Labirinto assombrado', outdoor: false, cave: true, tier: 2, water: 'mine' });
    const vis = new Set(), cell = (x, y) => [2 + x * 2, 2 + y * 2];
    const stack = [[0, ch - 1]]; vis.add('0,' + (ch - 1)); m.set(...cell(0, ch - 1), G.CAVE);
    while (stack.length) {
      const [x, y] = stack[stack.length - 1], nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [x + dx, y + dy]).filter(([a, b]) => a >= 0 && b >= 0 && a < cw && b < ch && !vis.has(a + ',' + b));
      if (!nb.length) { stack.pop(); continue; }
      const [nx, ny] = nb[Math.floor(r() * nb.length)]; vis.add(nx + ',' + ny);
      const [ax, ay] = cell(x, y), [bx, by] = cell(nx, ny);
      m.set((ax + bx) / 2, (ay + by) / 2, G.CAVE); m.set(bx, by, G.CAVE);
      stack.push([nx, ny]);
    }
    const [sx, sy] = cell(0, ch - 1); m.set(sx, sy + 1, G.CAVE); m.set(sx, sy + 2, G.CAVE);
    m.warps.push({ x: sx, y: sy + 2, to: 'town', tx: BOOTH.x + 1, ty: BOOTH.y + 3, dir: 1 });
    m.start = [sx, sy + 1];
    m.gold = cell(cw - 1, 0);
    m.pumpkins = [];
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) { const [px, py] = cell(x, y); const open = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => m.at(px + dx, py + dy) === G.CAVE).length; if (open === 1 && r() < 0.6 && !(x === cw - 1 && y === 0)) m.pumpkins.push([px, py]); }
    return finalize(m);
  }
  function enterMaze() {
    if (nowMin() < 1080) toast('O labirinto fica mais assustador à noite... mas pode entrar!');
    MAPS.maze = buildMaze();
    closePanel(); goMap('maze', MAPS.maze.start[0] * T + 8, MAPS.maze.start[1] * T + 12, 0);
  }
  function mazeCheck() {
    const m = MAPS.maze; if (!m || P.map !== 'maze') return;
    const [gx, gy] = m.gold;
    if (Math.hypot(P.x - (gx * T + 8), P.y - (gy * T + 12)) < 12 && P.flags.gp !== year()) {
      P.flags.gp = year(); addItem('aboboradourada', 1); festSave({ n: 1 }); sfx.level(); toast('Você achou a abóbora dourada! 🎃', 'big');
    }
  }
  ITEMS.aboboradourada = { name: 'Abóbora dourada', cat: 'art', sell: 2500, desc: 'Prêmio do labirinto da Noite dos Espíritos.' };

  // ---------- desenhos: barraca, bandeirinhas, ovos, águas-vivas e labirinto ----------
  function festEnts(m, ents, t) {
    const f = festOn();
    if (m.id === 'town' && f) {
      const bx = BOOTH.x * T, by = BOOTH.y * T;
      ents.push({ y: by + 30, f: () => {
        shadowAt(bx + 24, by + 30, 24, 4);
        R(bx + 2, by + 14, 44, 14, '#a86a32'); R(bx + 2, by + 14, 44, 3, '#c88a4a'); R(bx + 4, by + 28, 3, 4, '#6a3a1a'); R(bx + 41, by + 28, 3, 4, '#6a3a1a');
        for (let k = 0; k < 6; k++) R(bx + k * 8, by, 8, 8, k % 2 ? '#ffffff' : '#e8402a');
        for (let k = 0; k < 6; k++) poly([[bx + k * 8, by + 8], [bx + k * 8 + 8, by + 8], [bx + k * 8 + 4, by + 11]], k % 2 ? '#ffffff' : '#e8402a');
        R(bx + 2, by + 8, 2, 8, '#6a3a1a'); R(bx + 44, by + 8, 2, 8, '#6a3a1a');
        drawFarmer(bx + 24, by + 22, HOST_LOOK, 1, 0);
        nameTag(f.name, bx + 24, by - 4);
      } });
      // bandeirinhas atravessando a praça
      ents.push({ y: 0, f: () => { for (let x = 6; x < 46; x++) { const yy = 16 * T - 6 + Math.round(Math.sin((x % 6) / 6 * Math.PI) * 4); R(x * T, yy, T, 1, '#6a3a1a'); if (x % 1 === 0) poly([[x * T + 2, yy + 1], [x * T + 10, yy + 1], [x * T + 6, yy + 8]], ['#e8402a', '#f4c83a', '#4a8ae8', '#5ad84a', '#ff8ac8'][x % 5]); } } });
      if (festRun && festRun.kind === 'ovo') for (const e of festRun.eggs) if (!e.got) ents.push({ y: e.y * T + 12, f: () => { oval(e.x * T + 8, e.y * T + 10, 3.5, 4.5, e.c); R(e.x * T + 6, e.y * T + 7, 2, 2, '#ffffff'); R(e.x * T + 5, e.y * T + 11, 6, 1, shade(e.c, -0.3)); } });
    }
    if (m.id === 'beach' && f && f.id === 'aguasvivas' && nowMin() >= 1200) {
      if (!m.jelly) { m.jelly = []; for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) if (m.at(x, y) === G.WATER && (x * 7 + y * 13) % 9 === 0) m.jelly.push([x, y]); }
      for (let k = 0; k < m.jelly.length; k++) { const [jx, jy] = m.jelly[k], x = jx * T + 8 + Math.sin(t * 0.4 + k) * 10, y = jy * T + 8 + Math.sin(t * 0.7 + k * 2) * 4; ents.push({ y: 0, f: () => { ctx.globalAlpha = 0.55 + 0.35 * Math.sin(t * 2 + k); oval(x, y, 4, 3, '#8af0ff'); R(x - 3, y + 2, 1, 4, '#c8fbff'); R(x, y + 2, 1, 5, '#c8fbff'); R(x + 3, y + 2, 1, 4, '#c8fbff'); ctx.globalAlpha = 1; } }); }
    }
    if (m.id === 'maze' && m.gold) {
      const [gx, gy] = m.gold;
      if (P.flags.gp !== year()) ents.push({ y: gy * T + 14, f: () => { oval(gx * T + 8, gy * T + 10, 7, 5.5, '#f4c020'); oval(gx * T + 6, gy * T + 9, 3, 2.5, '#fff080'); R(gx * T + 7, gy * T + 2, 2, 4, '#5a3a1a'); if (Math.sin(t * 4) > 0) R(gx * T + 12, gy * T + 3, 1, 1, '#ffffff'); } });
      for (const [px, py] of m.pumpkins) ents.push({ y: py * T + 14, f: () => { oval(px * T + 8, py * T + 11, 6, 4.5, '#e8701a'); R(px * T + 5, py * T + 9, 2, 2, '#ffe060'); R(px * T + 9, py * T + 9, 2, 2, '#ffe060'); R(px * T + 6, py * T + 12, 4, 1, '#ffe060'); R(px * T + 7, py * T + 5, 2, 2, '#3a5a1a'); } });
    }
  }
  // luz das abóboras no labirinto
  function festLights(m, light) { if (m.id === 'maze' || (m.id === 'beach' && m.jelly && festOn() && festOn().id === 'aguasvivas' && nowMin() >= 1200)) { for (const [jx, jy] of m.jelly || []) light(jx * T + 8, jy * T + 8, 22, 0.55, '120,230,255'); for (const [px, py] of m.pumpkins || []) light(px * T + 8, py * T + 10, 40, 0.5); if (m.gold) light(m.gold[0] * T + 8, m.gold[1] * T + 10, 50, 0.6); } }
