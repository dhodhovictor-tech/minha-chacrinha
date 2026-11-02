
  // ================= para vocês dois: "enquanto você estava fora", cartinhas e petiscos do Darth =================

  // ---------- registro do que cada um fez (fica no documento da pessoa, P.feed) ----------
  function logAct(k, id, n = 1) {
    return; // o resumo "enquanto você estava fora" foi tirado
    if (!P) return;
    const f = P.feed || (P.feed = []), now = Date.now(), last = f[f.length - 1];
    if (last && last.k === k && last.id === id && now - last.t < 15 * 60000) { last.n += n; last.t = now; }
    else f.push({ t: now, k, id, n });
    if (f.length > 150) f.splice(0, f.length - 150);
    dirty();
  }
  const FEED_TXT = {
    colheu: (l) => `colheu ${l.map(([id, n]) => `${n}× ${item(id).name}`).join(', ')}`,
    pescou: (l) => `pescou ${l.reduce((a, x) => a + x[1], 0)} peixe(s): ${l.map(([id, n]) => `${n}× ${item(id).name}`).join(', ')}`,
    coletou: (l) => `pegou dos bichos ${l.map(([id, n]) => `${n}× ${item(id).name}`).join(', ')}`,
    enviou: (l) => `mandou ${l.reduce((a, x) => a + x[1], 0)} itens na caixa de envio`,
    cozinhou: (l) => `cozinhou ${l.map(([id, n]) => `${n}× ${item(id).name}`).join(', ')}`,
    construiu: (l) => `mandou construir ${l.map(([id]) => BUILDS[id] ? BUILDS[id].names[0] : id).join(', ')}`,
    mina: (l) => `desceu até o andar ${Math.max(...l.map(x => x[1]))} da mina`,
    chefe: (l) => `venceu ${l.map(([id]) => id).join(', ')} na mina`,
    festa: (l) => `foi ${l.map(([id]) => 'à ' + id).join(', ')}`,
    presente: (l) => `deu presente para ${l.map(([id]) => (NPCS[id] || {}).name || id).join(', ')}`,
    darth: (l) => `deu ${l.reduce((a, x) => a + x[1], 0)} petisco(s) para o Darth`,
  };
  // resume o que a outra pessoa fez depois de um momento
  function feedSummary(p, since) {
    const groups = {};
    for (const e of p.feed || []) {
      if (e.t <= since) continue;
      const g = groups[e.k] || (groups[e.k] = {});
      g[e.id] = e.k === 'mina' ? Math.max(g[e.id] || 0, e.n) : (g[e.id] || 0) + e.n;
    }
    return Object.entries(groups).filter(([k]) => FEED_TXT[k]).map(([k, g]) => FEED_TXT[k](Object.entries(g)));
  }
  let feedSince = 0, feedShown = false, feedT = 0;
  function feedCheck(dt) {
    feedT -= dt; if (feedT > 0 || feedShown || !P || panelOpen || placing || fishing) return; feedT = 1.5;
    feedShown = true;
    const pt = partner(); if (!pt) return;
    const seen = (P.flags.feedSeen && P.flags.feedSeen[pt.uid]) || feedSince || 0;
    const lines = feedSummary(pt, seen);
    P.flags.feedSeen = { ...(P.flags.feedSeen || {}), [pt.uid]: Date.now() }; dirty();
    if (!lines.length) return;
    openPanel(`<h2>Enquanto você estava fora</h2><p style="text-align:center">${esc(pt.name)}:</p><div class="list">${lines.map(l => `<div class="item"><span class="nm">• ${esc(l)}</span></div>`).join('')}</div><div class="row"><button class="btn g" data-a="close" type="button">Que bom!</button></div>`, 'feed');
  }

  // ---------- cartinhas entre vocês (W.meta.letters[para][id]) ----------
  let letterGift = -1;
  function openLetter() {
    const pt = partner(); if (!pt) { toast('Quando a outra pessoa entrar na chacrinha, dá para mandar cartinhas.'); return; }
    const opts = P.inv.map((s, i) => [s, i]).filter(([s]) => s && item(s.id).cat !== 'tool');
    openPanel(`<h2>Cartinha para ${esc(pt.name)} 💌</h2>
      <textarea id="lettertxt" maxlength="400" rows="5" placeholder="Escreva aqui..." style="width:100%;box-sizing:border-box;font-family:inherit;font-size:16px;padding:8px;border:2px solid #6b3410;border-radius:6px;background:#fffaf0">${esc((window.__letterDraft || ''))}</textarea>
      <p style="text-align:center;font-size:13px">Presente junto (opcional):</p>
      <div class="list">${opts.map(([s, i]) => `<div class="item"><img src="${iconURL(s.id)}" alt=""><span class="nm">${item(s.id).name}${s.q ? ` <span class="qtag q${s.q}">★</span>` : ''}</span><button class="btn ${letterGift === i ? 'g' : ''}" data-a="letterGift" data-i="${i}" type="button">${letterGift === i ? '✓' : '+'}</button></div>`).join('') || '<p>Mochila vazia.</p>'}</div>
      <div class="row"><button class="btn g" data-a="letterSend" type="button">Enviar cartinha</button></div>`, 'letter');
  }
  function sendLetter() {
    const pt = partner(), ta = document.getElementById('lettertxt'), text = ta ? ta.value.trim().slice(0, 400) : '';
    if (!pt) return;
    if (!text) { toast('Escreva alguma coisa na cartinha.'); return; }
    let gift = null;
    if (letterGift >= 0 && P.inv[letterGift]) { const s = P.inv[letterGift]; gift = { id: s.id, n: 1 }; s.n--; if (s.n <= 0) P.inv[letterGift] = null; renderHotbar(); }
    const id = 'c' + Date.now().toString(36), L = { from: P.name, text, gift, day: W.meta.day };
    W.meta.letters = W.meta.letters || {}; W.meta.letters[pt.uid] = { ...(W.meta.letters[pt.uid] || {}), [id]: L };
    queueUpdate('world/meta', { letters: { [pt.uid]: { [id]: L } } });
    letterGift = -1; window.__letterDraft = ''; dirty(); sfx.level(); closePanel();
    toast(`Cartinha enviada para ${pt.name}! 💌`, 'big');
  }
  let letterT = 0;
  function deliverLetters(dt = 99) {
    letterT -= dt; if (letterT > 0 || !P || !W.meta) return; letterT = 3;
    const mine = (W.meta.letters || {})[P.uid]; if (!mine) return;
    for (const [id, L] of Object.entries(mine)) {
      if (!L) continue;
      sendMail('carta:' + id, L.from, '💌 ' + L.text, L.gift ? { items: [[L.gift.id, L.gift.n || 1]] } : {});
      toast(`💌 Chegou uma cartinha de ${L.from}! Veja na caixa de correio.`, 'big'); sfx.level();
      queueUpdate('world/meta', { letters: { [P.uid]: { [id]: null } } });
    }
    delete W.meta.letters[P.uid];
  }

  // ---------- petiscos e presentinhos do Darth ----------
  ITEMS.petisco = { name: 'Petisco do Darth', cat: 'res', sell: 10, desc: 'Um petisco de gato. Segure e toque no Darth para dar. Peixes também servem!' };
  const isTreat = s => s && (s.id === 'petisco' || item(s.id).cat === 'fish');
  // dar petisco para o próprio Darth (dono) ou para o Darth da outra pessoa (vai por mensagem)
  function feedCat(own, peerUid) {
    const s = held(); if (!isTreat(s)) return false;
    useHeld(1); meow(); logAct('darth', 'petisco', 1);
    if (own) { const p = P.pet; p.love = Math.min(100, (p.love || 0) + 8); p.fedDay = W.meta.day; petSt.heart = 2.2; dirty(); toast(pick(['Darth adorou o petisco!', 'Darth comeu tudo e lambeu os bigodes.', 'Darth ronrona de barriguinha cheia.']), 'big', null, 'darth'); }
    else { emitP2P({ type: 'petfeed', to: peerUid }); toast('Darth adorou o petisco!', 'big', null, 'darth'); }
    return true;
  }
  function petFedByPartner(from) { if (!P.pet) return; P.pet.love = Math.min(100, (P.pet.love || 0) + 8); P.pet.fedDay = W.meta.day; petSt.heart = 2.2; dirty(); toast(`${from} deu um petisco para o Darth!`, '', null, 'darth'); }
  // de manhã, depois de um dia com petisco, o Darth sempre deixa um presentinho na porta (melhor quanto mais carinho)
  let catGiftLine = '';
  function catMorningGift() {
    catGiftLine = '';
    const p = P && P.pet; if (!p || !p.fedDay || p.fedDay >= W.meta.day || p.giftDay === p.fedDay) return;
    p.giftDay = p.fedDay;
    const love = p.love || 0, r = Math.random();
    const g = r < 0.02 + love / 2500 ? 'frutaestelar' : love >= 60 && r < 0.3 ? pick(['diamante', 'esmeralda', 'trufa', 'pena']) : pick(['sardinha', 'anchova', 'cogumelo', 'narciso', 'avela', 'quartzo', 'amora', 'pena']);
    addItem(g, 1, true); dirty();
    catGiftLine = `<p class="big" style="text-align:center">Darth deixou um presentinho na porta: ${item(g).name}!</p>`;
  }
  // carinho: o Darth reage de jeitos diferentes e mostra o quanto gosta de você
  const loveBar = l => `${Math.min(5, Math.ceil(l / 20))} de 5`;
  function catReact(st) {
    st.react = { k: pick(['pulo', 'esfrega', 'rola']), t: 1.8 }; st.heart = 2.2;
    tone(90, 70, 0.6, 'sawtooth', 0.025); tone(95, 75, 0.6, 'sawtooth', 0.02, 0.65);
    return { pulo: 'Darth dá pulinhos de alegria!', esfrega: 'Darth se esfrega nas suas pernas.', rola: 'Darth rola de barriga pra cima!' }[st.react.k];
  }
  function petOwnCat() {
    const p = P.pet; if (p.petDay !== W.meta.day) { p.love = Math.min(100, (p.love || 0) + 3); p.petDay = W.meta.day; } else p.love = Math.min(100, (p.love || 0) + 1);
    dirty(); meow();
    toast(`${catReact(petSt)} Carinho: ${loveBar(p.love)}`, 'big', null, 'darth');
  }
  // desenha o Darth com a reação do carinho
  function drawCatReact(st, x, y, dir, mv, pose) {
    const r = st.react;
    if (r && r.t > 0) {
      r.t -= 1 / 60;
      const k = 1.8 - r.t;
      if (r.k === 'pulo') { drawCat(x, y - Math.abs(Math.sin(k * 7)) * 6, dir, 0, 'walk'); }
      else if (r.k === 'esfrega') { drawCat(x + Math.sin(k * 10) * 3, y, Math.sin(k * 5) > 0 ? 3 : 2, 1, 'walk'); }
      else { drawCat(x, y, Math.floor(k * 4) % 2 ? 3 : 2, 0, Math.floor(k * 3) % 2 ? 'sleep' : 'sit'); }
      for (let i = 0; i < 3; i++) { const hk = (k * 1.2 + i * 0.35) % 1.2; drawHeart(x - 6 + i * 6, y - 18 - hk * 14, '#5ae05a'); }
      if (r.t <= 0) st.react = null;
      return true;
    }
    return false;
  }
  // ---------- mudar máquinas e objetos de lugar ----------
  function objSpotOk(x, y, from, o) {
    const m = MAPS.farm, k = x + ',' + y;
    if (x < 1 || y < 1 || x > m.w - 2 || y > m.h - 2) return false;
    if (![G.GRASS, G.DIRT, G.FLOWERS].includes(m.at(x, y)) || m.solid[y * m.w + x] || bGrid().has(k) || m.spots[k]) return false;
    if (m.warps.some(w => x >= w.x && x < w.x + (w.w || 1) && y >= w.y && y < w.y + (w.h || 1))) return false;
    const tl = tile(k);
    if (k === from || !tl) return true;
    if (tl.c || (tl.o && !['weed', 'grass', 'twig', 'forage'].includes(tl.o.k))) return false;
    if (tl.s && !String(o.k).startsWith('irrigador')) return false;
    return true;
  }
  function moveObject(p) {
    const from = tile(p.obj);
    if (!from || !from.o || from.o.k !== p.o.k) { placing = null; toast('Isso não está mais lá.'); return; }
    if (!objSpotOk(p.x, p.y, p.obj, from.o)) { toast('Não dá para colocar aí: precisa de chão livre.'); sfx.no(); return; }
    const k = p.x + ',' + p.y;
    if (k !== p.obj) { const rest = { ...from }; delete rest.o; const dest = tile(k); setTile(p.obj, Object.keys(rest).length ? rest : null); setTile(k, { ...(dest && dest.s ? { s: dest.s, w: dest.w, ...(dest.fe ? { fe: dest.fe } : {}) } : {}), o: from.o }); }
    placing = null; sfx.hoe(); toast(`${item(from.o.k).name} mudou de lugar!`, 'big');
  }

  // ---------- pescaria um pouco mais difícil: peixes 10% mais baratos ----------
  for (const k of Object.keys(FISH)) if (ITEMS[k]) ITEMS[k].sell = Math.round(ITEMS[k].sell * 0.9);

  // ---------- leveza: coisas que não precisam ser recalculadas a cada quadro ----------
  let torchCache = [], torchT = 0;
  function torchList() {
    const now = performance.now(); if (now - torchT < 1000) return torchCache; torchT = now;
    torchCache = []; for (const [k, v] of Object.entries(W.farm.t)) if (v && v.o && v.o.k === 'tocha' && !k.startsWith('g:')) torchCache.push(k.split(',').map(Number));
    return torchCache;
  }
  const honeyCache = new Map();
  function honeyAtCached(k) {
    const now = performance.now(), c = honeyCache.get(k);
    if (c && now - c[0] < 2000) return c[1];
    const v = honeyAt(k); honeyCache.set(k, [now, v]); return v;
  }
