
  // ================= casa: girar e sentar nos móveis, comer juntos, guarda-roupa, livro de memórias, brinquedos do Darth, dança e máquinas =================
  // W.farm.rot = { "x,y": 0..3 } (0 = de frente/sul, 1 = oeste, 2 = de costas/norte, 3 = leste)
  // W.farm.mesa = { "x,y" da mesa: id da comida } · W.farm.armario = [36 vagas] · W.farm.livro = "x,y" do livro rosa

  // ---------- móveis novos ----------
  Object.assign(MOVEIS, {
    guardaroupa: { name: 'Guarda-roupa', w: 2, h: 1, gold: 2800, need: { mcarvalho: 20, barraferro: 1 }, desc: 'Guarda até 36 roupas, sapatos e acessórios. A cômoda abre o mesmo guarda-roupa.' },
    criadomudo: { name: 'Criado-mudo', w: 1, h: 1, gold: 500, need: { mpinho: 8 }, desc: 'Mesinha de cabeceira. Dá para pôr o livro rosa em cima.' },
    torregato: { name: 'Torre do Darth', pet: true, w: 1, h: 1, gold: 1800, need: {}, desc: 'Ele sobe e fica lá em cima olhando tudo.' },
    tunelgato: { name: 'Túnel de brincar', pet: true, w: 2, h: 1, walk: true, gold: 900, need: {}, desc: 'O Darth entra e só fica o rabinho de fora.' },
    novelo: { name: 'Novelo de lã', pet: true, w: 1, h: 1, walk: true, gold: 300, need: {}, desc: 'Ele corre atrás do novelo pela casa.' },
    comedouro: { name: 'Comedouro do Darth', pet: true, w: 1, h: 1, walk: true, gold: 400, need: {}, desc: 'Potinhos de ração e água. Ele vai lá beliscar.' },
  });
  for (const id of ['guardaroupa', 'criadomudo', 'torregato', 'tunelgato', 'novelo', 'comedouro']) { const f = MOVEIS[id]; ITEMS[id] = { name: f.name, cat: 'movel', sell: Math.round(f.gold / 3), desc: `${f.desc} Segure dentro de casa e toque no chão para colocar${f.w > 1 || f.h > 1 ? ` (ocupa ${f.w}×${f.h})` : ''}.` }; }
  ITEMS.livrorosa = { name: 'Livro rosa de memórias', cat: 'livromem', sell: 0, desc: 'O diário da chacrinha. Segure em casa e toque numa mesa, criado-mudo ou no chão para deixar ali. Os dois podem ler.' };

  // ---------- girar ----------
  const GIRA = new Set(['cadeirapinho', 'poltrona', 'sofa', 'tvcasa', 'mesacarvalho', 'estanteipe', 'comoda', 'guardaroupa', 'aquario', 'lareira', 'estantetrofeus', 'tunelgato']);
  const rotOf = k => (k && W.farm && W.farm.rot && W.farm.rot[k]) || 0;
  function movelDims(k, id) { const f = MOVEIS[id] || { w: 1, h: 1 }, r = rotOf(k); return r % 2 ? { ...f, w: f.h, h: f.w } : f; }
  function girarMovel(k) {
    const id = casa()[k], f = MOVEIS[id]; if (!f || !GIRA.has(id)) return;
    const r = (rotOf(k) + 1) % 4, [x, y] = k.split(',').map(Number), d = r % 2 ? { ...f, w: f.h, h: f.w } : f;
    if (!canPlaceMovel(curMap(), x, y, d, k)) { toast('Girado não cabe aqui. Mude de lugar primeiro.'); sfx.no(); return; }
    setFarm('rot', k, r || null); sfx.hoe();
    toast(`${f.name} virado para o ${['sul', 'oeste', 'norte', 'leste'][r]}.`, '', null, 'movel');
  }
  // desenhos girados (os outros móveis ficam iguais de qualquer lado)
  function drawMovelRot(id, px, py, t, night, k, r) {
    const side = r % 2 === 1, back = r === 2, fl = r === 1;
    const flip = fn => { if (!fl) { fn(); return; } ctx.save(); ctx.translate(px * 2 + 16, 0); ctx.scale(-1, 1); fn(); ctx.restore(); };
    switch (id) {
      case 'cadeirapinho':
        shadowAt(px + 8, py + 14, 6, 2);
        if (back) { R(px + 3, py + 5, 10, 4, '#d8b070'); R(px + 4, py + 9, 2, 5, '#9a6a3a'); R(px + 10, py + 9, 2, 5, '#9a6a3a'); R(px + 4, py - 6, 8, 13, '#b88a4a'); R(px + 5, py - 5, 6, 2, '#9a6a3a'); R(px + 5, py - 1, 6, 1, '#9a6a3a'); return true; }
        flip(() => { R(px + 3, py + 5, 10, 4, '#d8b070'); R(px + 3, py + 5, 10, 1, '#f0d098'); R(px + 3, py - 7, 3, 13, '#b88a4a'); R(px + 4, py + 9, 2, 5, '#9a6a3a'); R(px + 11, py + 9, 2, 5, '#9a6a3a'); });
        return true;
      case 'poltrona':
        shadowAt(px + 8, py + 14, 7, 2);
        if (back) { R(px + 1, py + 2, 14, 7, '#8a2a3a'); R(px + 2, py - 6, 12, 12, '#7a2232'); R(px + 3, py - 5, 10, 2, '#9a3a4a'); R(px, py + 1, 3, 8, '#7a4a28'); R(px + 13, py + 1, 3, 8, '#7a4a28'); R(px + 2, py + 9, 2, 4, '#5a3418'); R(px + 12, py + 9, 2, 4, '#5a3418'); return true; }
        flip(() => { R(px + 2, py + 2, 12, 7, '#8a2a3a'); R(px + 3, py + 3, 10, 3, '#b84a5a'); R(px + 1, py - 7, 4, 15, '#7a2232'); R(px + 1, py - 1, 14, 3, '#7a4a28'); R(px + 3, py + 9, 2, 4, '#5a3418'); R(px + 11, py + 9, 2, 4, '#5a3418'); });
        return true;
      case 'sofa':
        if (back) { shadowAt(px + 16, py + 14, 15, 2); R(px, py + 2, 32, 8, '#3a5a98'); R(px + 1, py - 6, 30, 12, '#2a4a88'); R(px + 2, py - 5, 28, 2, '#4a6aa8'); R(px - 1, py - 2, 4, 12, '#2a4a88'); R(px + 29, py - 2, 4, 12, '#2a4a88'); R(px + 2, py + 10, 2, 4, '#5a3418'); R(px + 28, py + 10, 2, 4, '#5a3418'); return true; }
        if (side) { shadowAt(px + 8, py + 30, 8, 2); flip(() => { R(px + 3, py - 2, 11, 32, '#3a5a98'); R(px + 5, py, 8, 13, '#5a7ab8'); R(px + 5, py + 15, 8, 13, '#5a7ab8'); R(px + 1, py - 8, 5, 38, '#2a4a88'); R(px + 2, py - 7, 2, 36, '#4a6aa8'); R(px + 3, py - 4, 12, 4, '#2a4a88'); R(px + 3, py + 28, 12, 4, '#2a4a88'); R(px + 8, py + 2, 4, 5, '#f4c83a'); R(px + 8, py + 21, 4, 5, '#e86a8a'); }); return true; }
        return false;
      case 'tvcasa':
        if (back) { shadowAt(px + 16, py + 14, 14, 2); R(px + 3, py + 2, 26, 12, '#2a2a2e'); R(px + 5, py + 4, 22, 8, '#3a3a40'); R(px + 7, py + 14, 18, 2, '#5a3a2a'); return true; }
        if (side) { shadowAt(px + 8, py + 30, 6, 2); flip(() => { R(px + 4, py + 4, 8, 26, '#6a4a2a'); R(px + 5, py + 5, 6, 24, '#8a5a32'); R(px + 9, py - 6, 3, 30, '#2a2a2e'); R(px + 8, py - 6, 1, 30, night ? '#5a9ae8' : '#2a4a6a'); }); return true; }
        return false;
      case 'mesacarvalho':
        if (side) { shadowAt(px + 8, py + 30, 7, 2); R(px + 1, py + 2, 14, 28, '#5a3418'); R(px + 1, py + 1, 14, 28, '#7a4a28'); R(px + 2, py + 2, 1, 26, '#9a6a3a'); R(px + 2, py + 28, 2, 4, '#4a2a14'); R(px + 12, py + 28, 2, 4, '#4a2a14'); R(px + 3, py + 8, 10, 12, '#f4f0e8'); disc(px + 8, py + 13, 2.5, '#e8402a'); return true; }
        return false;
      case 'estanteipe': case 'comoda': case 'guardaroupa': case 'estantetrofeus': case 'aquario': case 'lareira': case 'tunelgato': {
        const f = MOVEIS[id], len = f.w * T, wood = id === 'comoda' ? '#3a180e' : id === 'aquario' ? '#5a3418' : id === 'lareira' ? '#7a7268' : id === 'tunelgato' ? '#8a4ab8' : '#5a2a10';
        if (back) { shadowAt(px + len / 2, py + 14, len / 2 - 2, 2); R(px + 1, py - 14, len - 2, 28, wood); R(px + 3, py - 12, len - 6, 24, shade(wood, 0.12)); for (let x = px + 6; x < px + len - 4; x += 6) R(x, py - 12, 1, 24, shade(wood, -0.15)); return true; }
        if (side) { shadowAt(px + 8, py + len - 2, 6, 2); R(px + 3, py - 14, 10, len + 12, wood); R(px + 4, py - 13, 8, len + 10, shade(wood, 0.15)); R(px + 4, py - 13, 1, len + 10, shade(wood, 0.3)); if (id === 'aquario') { R(px + 5, py - 10, 6, len - 2, '#5ab4e8'); R(px + 6, py - 9, 1, len - 4, '#c8f0ff'); } if (id === 'tunelgato') { disc(px + 8, py - 4, 4, '#2a1a3a'); } return true; }
        return false;
      }
    }
    return false;
  }

  // ---------- sentar ----------
  // lugares de cada assento (deslocamento em quadrados a partir do canto, já girado)
  const ASSENTO = { cadeirapinho: 1, poltrona: 1, sofa: 2 };
  function lugaresDe(k, id) {
    const r = rotOf(k), [x, y] = k.split(',').map(Number), n = ASSENTO[id] || 0, out = [];
    for (let i = 0; i < n; i++) out.push(r % 2 ? [x, y + i] : [x + i, y]);
    return out.map(([sx, sy]) => ({ x: sx * T + 8, y: sy * T + 12, dir: [1, 2, 0, 3][r] }));
  }
  function sentar(k, id) {
    const ls = lugaresDe(k, id); if (!ls.length) return false;
    const ocup = peerPlayers().filter(p => !p.me && p.map === P.map && p.ps && p.ps[0] === 's');
    const livres = ls.filter(l => !ocup.some(p => Math.hypot(p.x - l.x, p.y - l.y) < 6));
    if (!livres.length) { toast('Esse lugar já está ocupado. 💕'); return true; }
    const l = livres.sort((a, b) => Math.hypot(a.x - P.x, a.y - P.y) - Math.hypot(b.x - P.x, b.y - P.y))[0];
    P.pose = { k: 's', mk: k, back: { x: P.x, y: P.y } }; P.x = l.x; P.y = l.y; P.dir = l.dir; sfx.pop();
    const pt = ocup.find(p => Math.hypot(p.x - P.x, p.y - P.y) < 40);
    toast(pt ? `Sentadinhos juntos com ${pt.name}. 💕 A energia volta mais rápido.` : 'Você sentou. A energia volta devagarinho. Ande para levantar.', '', null, 'sentar');
    return true;
  }
  let sentT = 0;
  function poseTick(dt) {
    if (!P || !P.pose) return;
    if (P.pose.k === 's') {
      if (P.map !== 'house' || !casa()[P.pose.mk]) { P.pose = null; return; }
      sentT += dt; if (sentT >= 3) { sentT = 0; const pt = peerPlayers().some(p => !p.me && p.map === P.map && p.ps && p.ps[0] === 's' && Math.hypot(p.x - P.x, p.y - P.y) < 40); if (P.energy < P.maxEnergy) { P.energy = Math.min(P.maxEnergy, P.energy + (pt ? 2 : 1)); dirty(); } }
    }
    if (P.pose.k === 'd' && performance.now() - P.pose.t0 > 9000) P.pose = null;
  }
  // levantar (andar) devolve a pessoa para a frente do assento
  function levantar() {
    if (!P.pose) return;
    const ps = P.pose; P.pose = null;
    if (ps.k === 's') { const [x, y] = ps.mk.split(',').map(Number), id = casa()[ps.mk], d = movelDims(ps.mk, id), r = rotOf(ps.mk); const nx = r === 1 ? x - 1 : r === 3 ? x + d.w : P.x / T - 0.5, ny = r === 0 ? y + d.h : r === 2 ? y - 1 : P.y / T - 0.75; const cx = Math.floor(nx) * T + 8, cy = Math.floor(ny) * T + 12; if (!blocked(curMap(), cx, cy)) { P.x = cx; P.y = cy; } else if (ps.back) { P.x = ps.back.x; P.y = ps.back.y; } }
  }
  // desenho sentado: corpo de cima e pernas dobradas
  function drawSentado(cx, fy, look, dir) {
    // o quadril fica na altura do assento; as pernas dobram para a frente e balançam devagar
    const c = farmerCanvas(look || {}, dir, 0), pants = (look && look.pants) || '#3a4a7a', boot = (look && look.boot) || '#5a3420', pD = shade(pants, -0.25), pL = shade(pants, 0.15);
    const k = performance.now() / 1000, sw = Math.sin(k * 2.2) > 0 ? 1 : 0, resp = Math.sin(k * 1.6) > 0.6 ? 1 : 0;
    ctx.drawImage(c, 0, 0, 18, 29 - resp, cx - 9, fy - 37 + resp, 18, 29 - resp);
    if (dir === 1) {
      R(cx - 5, fy - 9, 10, 4, pants); R(cx - 5, fy - 9, 10, 1, pL); R(cx - 1, fy - 9, 1, 4, pD);
      R(cx - 5 + sw, fy - 5, 3, 5, pD); R(cx + 2 - sw, fy - 5, 3, 5, pD);
      R(cx - 5 + sw, fy, 4, 2, boot); R(cx + 2 - sw, fy, 4, 2, boot);
    } else if (dir === 3 || dir === 2) {
      const s2 = dir === 3 ? 1 : -1, x0 = s2 > 0 ? cx - 2 : cx - 7;
      R(x0, fy - 9, 9, 4, pants); R(x0, fy - 9, 9, 1, pL);
      const kx = s2 > 0 ? cx + 4 : cx - 7;
      R(kx + sw * s2, fy - 5, 3, 5, pD); R(kx + sw * s2 + (s2 > 0 ? 0 : -1), fy, 4, 2, boot);
    }
  }
  // dançar: gira, pula e solta notinhas; a dois, coraçõezinhos
  function drawDancando(cx, fy, look, t0, perto) {
    const k = (performance.now() - t0) / 1000, dir = [1, 3, 0, 2][Math.floor(k / 0.35) % 4], up = Math.abs(Math.sin(k * 9)) * 4;
    blit(farmerCanvas(look || {}, dir, Math.floor(k * 8) % 4), cx - 9, fy - 38 - up);
    for (let i = 0; i < 2; i++) { const p = (k * 0.8 + i * 0.5) % 1; drawText(i ? '♪' : '♫', cx - 10 + i * 18 + Math.sin(k * 3 + i) * 3, fy - 44 - p * 16, `rgba(255,255,255,${1 - p})`, 10); }
    if (perto) for (let i = 0; i < 2; i++) { const p = (k * 0.6 + i * 0.5) % 1; drawHeart(cx + (i ? 8 : -8), fy - 48 - p * 14); }
  }
  // como mostrar a pessoa (eu ou a outra) conforme a pose
  function drawPose(ps, cx, fy, look, dir, t0) {
    if (!ps) return false;
    if (ps[0] === 's') { drawSentado(cx, fy, look, dir); return true; }
    if (ps[0] === 'd') { const dz = peerPlayers().filter(p => p.map === P.map && (p.me ? P.pose && P.pose.k === 'd' : p.ps && p.ps[0] === 'd')); drawDancando(cx, fy, look, t0 || performance.now(), dz.length >= 2); return true; }
    return false;
  }
  const poseNet = () => (P && P.pose ? (P.pose.k === 's' ? ['s'] : ['d', Math.round(performance.now() - P.pose.t0)]) : 0);
  function comecarDanca(com) {
    P.pose = { k: 'd', t0: performance.now() }; sfx.level();
    for (const [f, d] of [[523, 0], [659, 0.2], [784, 0.4], [659, 0.6], [880, 0.8], [784, 1.0], [1046, 1.2]]) tone(f, f, 0.18, 'triangle', 0.05, d);
    if (com && P.flags.dancaJ !== W.meta.day) { P.flags.dancaJ = W.meta.day; P.energy = Math.min(P.maxEnergy, P.energy + 20); dirty(); toast(`Dançando juntinho com ${com}! 💃🕺 +20 de energia.`, 'big', null, 'danca'); }
    else if (com) toast(`Dançando juntinho com ${com}! 💃🕺`, '', null, 'danca');
  }

  // ---------- comer juntos à mesa ----------
  const MESAS = new Set(['mesapinho', 'mesacarvalho', 'mesacozinha']);
  const comida = id => { const it = ITEMS[id]; return !!(it && it.energy > 0 && ['food', 'veg', 'fruit', 'fish', 'forage', 'art', 'animal', 'flower'].includes(it.cat) && it.cat !== 'flower'); };
  function mesaAct(k, id) {
    if (!MESAS.has(id)) return false;
    const s = held(), prato = W.farm.mesa && W.farm.mesa[k];
    if (!prato) {
      if (s && comida(s.id)) { setFarm('mesa', k, { id: s.id }); useHeld(1); sfx.pop(); toast(`${item(s.id).name} na mesa. Chame a outra pessoa e toquem na mesa para comer juntos!`, 'big', s.id, 'mesa'); return true; }
      return false;
    }
    const pid = prato.id, it = item(pid), d = movelDims(k, id), [x, y] = k.split(',').map(Number), cx = (x + d.w / 2) * T, cy = (y + d.h / 2) * T;
    const pt = peerPlayers().find(p => !p.me && p.map === 'house' && Math.hypot(p.x - cx, p.y - cy) < 56);
    const en = Math.round((it.energy || 0) * (pt ? 1.5 : 1));
    setFarm('mesa', k, null);
    P.energy = Math.min(P.maxEnergy + (it.buff && it.buff.maxEnergy ? 50 : 0), P.energy + en);
    if (it.hp) P.hp = Math.min(100, P.hp + it.hp);
    if (it.buff) P.buff = { b: it.buff, until: nowMin() + 7 * 60, day: W.meta.day, name: it.name };
    dirty(); sfx.eat();
    if (pt) { emitP2P({ type: 'casa3', to: pt.uid, k: 'comer', id: pid }); toast(`Vocês comeram ${it.name.toLowerCase()} juntos à mesa! 💕 +${en} de energia para cada um.`, 'big', pid, 'mesa'); }
    else toast(`Você comeu ${it.name.toLowerCase()} à mesa. +${en} de energia. (Com a outra pessoa perto, rende 50% a mais para os dois!)`, '', pid, 'mesa');
    return true;
  }

  // ---------- guarda-roupa (e cômoda) ----------
  const ARM_N = 36, ARM_CAT = new Set(['roupa', 'boots', 'ring', 'acessorio', 'cama']);
  const armario = () => { const a = W.farm.armario || []; return Array.from({ length: ARM_N }, (_, i) => a[i] || null); };
  function openArmario() {
    const items = armario();
    openPanel(`<h2>Guarda-roupa</h2><p style="text-align:center;font-size:13px">Roupas, sapatos, anéis, coleiras e roupas de cama. Os dois usam o mesmo guarda-roupa.</p>
      <h3>Guarda-roupa</h3><div class="grid">${items.map((s, i) => slotHTML(s, i, false, 'arOut')).join('')}</div>
      <h3>Mochila</h3><div class="grid">${P.inv.map((s, i) => slotHTML(s, i, false, 'arIn')).join('')}</div>`, 'armario');
  }
  function armarioMove(i, guardar) {
    const items = armario().map(s => (s ? { ...s } : null));
    if (guardar) {
      const s = P.inv[i]; if (!s) return;
      if (!ARM_CAT.has(item(s.id).cat)) { toast('O guarda-roupa é para roupas, sapatos, anéis, coleiras e roupas de cama.'); sfx.no(); return; }
      let j = items.findIndex(x => x && x.id === s.id); if (j >= 0) items[j].n += s.n; else { j = items.findIndex(x => !x); if (j < 0) { toast('O guarda-roupa está cheio.'); return; } items[j] = { id: s.id, n: s.n }; }
      P.inv[i] = null;
    } else { const s = items[i]; if (!s) return; if (addItem(s.id, s.n, true) < s.n) return; items[i] = null; }
    setFarmVal('armario', items); dirty(); renderHotbar(); openArmario();
  }

  // ---------- livro rosa de memórias ----------
  let memorias = null, memEstado = '';
  async function carregarMemorias() {
    memEstado = 'carregando';
    const out = [];
    try {
      for (const [uid, pl] of Object.entries(W.players || {})) {
        const s = await store.doc('diary/' + uid).get(), d = (s.exists && s.data()) || {};
        for (const [k, e] of Object.entries(d.e || {})) out.push({ d: +k.slice(1), quem: (pl && pl.name) || 'Alguém', ...e });
      }
      memorias = out.sort((a, b) => b.d - a.d || (b.at || 0) - (a.at || 0)); memEstado = '';
    } catch (e) { memEstado = 'erro'; }
    if (panelOpen && panelKind === 'memorias') abrirMemorias();
  }
  function abrirMemorias(recarregar) {
    if (recarregar || (!memorias && memEstado !== 'carregando')) carregarMemorias();
    const paper = 'background:#fff0f6;border:2px solid #e8a0c0;border-radius:8px;padding:10px;margin:8px 0';
    const lista = !memorias ? `<p style="text-align:center">${memEstado === 'erro' ? 'O livro precisa de internet para abrir.' : 'Abrindo o livro...'}</p>`
      : memorias.length ? memorias.map(e => `<div style="${paper}"><div style="display:flex;align-items:center;gap:8px">${e.s && ITEMS[e.s] ? `<img src="${iconURL(e.s)}" alt="" style="width:28px;height:28px;image-rendering:pixelated">` : ''}<b>${diaryDate(e.d)}</b><small style="margin-left:auto">por ${esc(e.quem)}</small></div>${e.r ? `<p style="font-size:13px;margin:4px 0;color:#8a4a6a"><i>${esc(e.r)}</i></p>` : ''}${e.t ? `<p style="margin:4px 0;white-space:pre-wrap">${esc(e.t)}</p>` : ''}</div>`).join('')
      : '<p style="text-align:center">O livro ainda está em branco. Escreva a primeira memória!</p>';
    openPanel(`<h2 style="color:#c8507a">📖 Memórias da chacrinha</h2><p style="text-align:center;font-size:13px">O livro rosa de cabeceira: as páginas de diário de vocês dois, juntinhas.</p>
      <div class="row"><button class="btn g" data-a="memEscrever" type="button">Escrever a página de hoje</button><button class="btn" data-a="memGuardar" type="button">Guardar o livro na mochila</button></div>${lista}`, 'memorias');
  }
  const SUPERFICIE = new Set(['criadomudo', 'mesapinho', 'mesacarvalho', 'mesacozinha', 'comoda', 'estanteipe', 'guardaroupa']);
  function livroAct(m, tx, ty) {
    if (m.id !== 'house') return false;
    const k = tx + ',' + ty, s = held();
    if (s && s.id === 'livrorosa') {
      const mv = movelAt(tx, ty);
      if (mv && !SUPERFICIE.has(mv.id)) { toast('Ponha o livro numa mesa, criado-mudo, cômoda ou no chão.'); return true; }
      if (!mv && (m.solid[ty * m.w + tx] || m.spots[k])) { toast('Aí não cabe o livro.'); return true; }
      setFarmVal('livro', k); useHeld(1); sfx.pop(); toast('O livro rosa de memórias ficou ali. Qualquer um de vocês pode ler. 📖', '', 'livrorosa', 'livro'); return true;
    }
    if (W.farm.livro === k && !(s && item(s.id).cat === 'movel')) { abrirMemorias(true); return true; }
    return false;
  }

  // ---------- Darth brinca com os brinquedos da casa ----------
  let brinq = null;
  function darthBrinca(dt) {
    const s = petSt, p = P && P.pet;
    // ao terminar, desce para um quadrado livre ao lado do brinquedo (senão ele fica preso dentro do móvel)
    const parar = () => { brinq = null; s.alt = 0; s.pose2 = null; soltarDarth(); };
    if (!p || s.map !== 'house' || P.map !== 'house') { if (brinq) parar(); return false; }
    if (brinq) {
      if (casa()[brinq.k] !== brinq.id || (p.mode !== 'roam' && walkT > 0 && Math.hypot(P.x - s.x, P.y - s.y) > 64) || p.mode === 'come') { parar(); return false; }
      const [x, y] = brinq.k.split(',').map(Number), alvo = brinq.id === 'tunelgato' ? [x * T + 12, y * T + 10] : brinq.id === 'torregato' ? [x * T + 8, y * T + 15] : brinq.id === 'caminhagato' ? [x * T + 8, y * T + 11] : [x * T + 8 + (brinq.id === 'arranhador' ? -9 : 0), y * T + 13];
      if (brinq.fase === 'indo') {
        const dx = alvo[0] - s.x, dy = alvo[1] - s.y, d = Math.hypot(dx, dy), sp = 70 * dt;
        if (d <= sp + 1) { s.x = alvo[0]; s.y = alvo[1]; brinq.fase = 'brincando'; brinq.t = rnd(9, 16); s.mv = 0; if (brinq.id === 'torregato') { s.alt = 22; } }
        else { s.x += dx / d * sp; s.y += dy / d * sp; s.mv = 1; if (Math.abs(dx) > 1) s.dir = dx < 0 ? 2 : 3; }
        return true;
      }
      brinq.t -= dt; s.mv = 0;
      s.pose2 = { caminhagato: 'sleep', torregato: 'sit', arranhador: 'arranha', tunelgato: 'tunel', novelo: 'novelo', comedouro: 'come' }[brinq.id];
      if (brinq.id === 'arranhador') s.dir = 3;
      if (brinq.t <= 0) { if (brinq.id === 'torregato') s.y += 2; parar(); s.idle = 0; if (Math.random() < 0.5) meow(); }
      return true;
    }
    if (s.idle > 4 && Math.random() < dt * 0.3) {
      const toys = Object.entries(casa()).filter(([, id]) => MOVEIS[id] && MOVEIS[id].pet);
      if (toys.length) { const [k, id] = toys[Math.floor(Math.random() * toys.length)]; brinq = { k, id, fase: 'indo', t: 0 }; s.idle = 0; return true; }
    }
    return false;
  }
  function soltarDarth() {
    const s = petSt, m = getMap(s.map || 'house'); if (!m) return;
    if (petFree(m, s.x, s.y) && petFree(m, s.x + 4, s.y) && petFree(m, s.x - 4, s.y)) return;
    const tx = Math.floor(s.x / T), ty = Math.floor((s.y - 3) / T);
    for (let r = 1; r <= 4; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
      const nx = (tx + dx) * T + 8, ny = (ty + dy) * T + 12;
      if (petFree(m, nx, ny) && petFree(m, nx + 4, ny) && petFree(m, nx - 4, ny)) { s.x = nx; s.y = ny; s.mv = 0; s.wait = 0.5; s.tx = nx; s.ty = ny; if (P.pet) { P.pet.hx = nx; P.pet.hy = ny; } return; }
    }
  }
  // desenho do Darth brincando (poses especiais); devolve true se desenhou
  function drawDarthBrinca(s) {
    const pose = s.pose2; if (!pose) return false;
    const t = performance.now() / 1000, coat = s.coat, col = s.collar;
    if (pose === 'sit' || pose === 'sleep') { drawCat(s.x, s.y - (s.alt || 0), s.dir, 0, pose, coat, col); if (pose === 'sleep') drawText('z', s.x + 6, s.y - 18 - (t * 6) % 8, '#ffffffcc', 8); return true; }
    if (pose === 'arranha') { const f = Math.floor(t * 8) % 2; drawCat(s.x, s.y - f, 3, 1, 'walk', coat, col); if (f) { R(s.x + 7, s.y - 14, 1, 3, '#f4e8d0'); R(s.x + 9, s.y - 13, 1, 3, '#f4e8d0'); } return true; }
    if (pose === 'novelo') { const a = t * 2.2, bx = s.x + Math.cos(a) * 10, by = s.y + Math.sin(a) * 5; disc(bx, by - 3, 3, '#e86a8a'); R(bx - 2, by - 4, 3, 1, '#f8a8c0'); drawCat(s.x + Math.cos(a - 0.6) * 10, s.y + Math.sin(a - 0.6) * 5, Math.sin(a) > 0 ? 2 : 3, 1, 'walk', coat, col); return true; }
    if (pose === 'tunel') { const w = Math.sin(t * 4) * 2; R(s.x + 10, s.y - 7 + w, 2, 7, '#1c1c24'); R(s.x + 11, s.y - 8 + w, 2, 2, '#1c1c24'); return true; }
    if (pose === 'come') { drawCat(s.x + 9, s.y, 2, 0, 'sit', coat, col); if (Math.floor(t * 3) % 2) R(s.x + 3, s.y - 6, 2, 2, '#1c1c24'); return true; }
    return false;
  }
  function drawToy(id, px, py, t) {
    switch (id) {
      case 'torregato': shadowAt(px + 8, py + 14, 8, 2); R(px + 1, py + 10, 14, 4, '#c8a070'); R(px + 6, py - 20, 4, 30, '#d8c098'); for (let y = -18; y < 10; y += 3) R(px + 6, py + y, 4, 1, '#b89868'); R(px, py - 4, 16, 4, '#a85a8a'); R(px + 1, py - 4, 14, 1, '#c87aa8'); R(px - 1, py - 24, 18, 5, '#a85a8a'); R(px, py - 24, 16, 1, '#c87aa8'); disc(px + 13, py - 1, 1.6, '#f4c83a'); R(px + 13, py, 1, 4, '#c8b8a0'); return true;
      case 'tunelgato': shadowAt(px + 16, py + 13, 15, 2); R(px + 2, py + 2, 28, 11, '#8a4ab8'); for (let x = px + 4; x < px + 30; x += 4) R(x, py + 2, 1, 11, '#6a2a98'); R(px + 2, py + 2, 28, 2, '#a86ad8'); oval(px + 3, py + 8, 3, 5.5, '#2a1a3a'); oval(px + 29, py + 8, 3, 5.5, '#2a1a3a'); return true;
      case 'novelo': { const a = t * 0.8; shadowAt(px + 8, py + 13, 4, 1.5); disc(px + 8, py + 10, 4, '#e86a8a'); ctx.strokeStyle = '#f8a8c0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(px + 8, py + 10, 2.5, a, a + 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(px + 11, py + 12); ctx.quadraticCurveTo(px + 15, py + 14, px + 14, py + 15); ctx.stroke(); return true; }
      case 'comedouro': shadowAt(px + 8, py + 13, 7, 1.5); oval(px + 4, py + 10, 4, 2.5, '#d8402a'); oval(px + 4, py + 9, 3, 1.5, '#a86a3a'); oval(px + 12, py + 10, 4, 2.5, '#3a8ad8'); oval(px + 12, py + 9, 3, 1.5, '#8ad0f0'); return true;
      case 'criadomudo': shadowAt(px + 8, py + 14, 7, 2); R(px + 1, py - 2, 14, 16, '#7a4a28'); R(px + 2, py - 1, 12, 14, '#9a6a3a'); R(px + 1, py - 3, 14, 2, '#b8885a'); R(px + 3, py + 4, 10, 4, '#7a4a28'); R(px + 7, py + 6, 2, 1, '#f4c83a'); return true;
      case 'guardaroupa': shadowAt(px + 16, py + 14, 15, 2); R(px + 1, py - 22, 30, 36, '#7a4a28'); R(px + 2, py - 21, 28, 34, '#9a6a3a'); R(px + 15, py - 21, 2, 34, '#5a3418'); R(px + 12, py - 6, 2, 4, '#f4c83a'); R(px + 18, py - 6, 2, 4, '#f4c83a'); R(px, py - 24, 32, 3, '#5a3418'); R(px + 3, py + 10, 26, 2, '#5a3418'); return true;
    }
    return false;
  }

  // ---------- máquinas e enfeites da chacrinha: mudar de lugar, guardar ou jogar fora ----------
  const MAQ_MENU = () => [...MACHINES, 'pararaios', 'espantalho', 'irrigador', 'irrigadorbom', 'irrigadorouro', 'vasoflores', 'arcoflores', ...Object.keys(ENFEITES)];
  function maquinaMenu(k, tl, o) {
    if (held() || !MAQ_MENU().includes(o.k)) return false;
    if (o.in && o.ready <= gm()) return false;
    const trab = o.in && o.ready > gm();
    openPanel(`<h2>${item(o.k).name}</h2><p style="text-align:center;font-size:13px">${trab ? 'Está trabalhando agora.' : esc(item(o.k).desc || '')}</p>
      <div class="row"><button class="btn" data-a="maqMover" data-k="${k}" type="button">Mudar de lugar</button><button class="btn" data-a="maqGuardar" data-k="${k}" type="button" ${trab ? 'disabled' : ''}>Guardar na mochila</button><button class="btn r" data-a="maqLixo" data-k="${k}" type="button">Jogar fora</button></div>`, 'maquina', k);
    return true;
  }
  let lixoConfirm = '';

  // ---------- ações dos painéis ----------
  function casa3Action(a, b) {
    switch (a) {
      case 'movelGirar': girarMovel(b.dataset.k); closePanel(); return true;
      case 'movelSentar': { const k = b.dataset.k; closePanel(); sentar(k, casa()[k]); return true; }
      case 'arIn': armarioMove(+b.dataset.i, true); return true;
      case 'arOut': armarioMove(+b.dataset.i, false); return true;
      case 'armario': openArmario(); return true;
      case 'memEscrever': closePanel(); invTab = 'diario'; openInventory(); invTab = 'diario'; renderInventory(); return true;
      case 'memGuardar': if (W.farm.livro && addItem('livrorosa', 1, true)) { setFarmVal('livro', null); toast('O livro rosa foi para a mochila.'); } closePanel(); return true;
      case 'maqMover': { const k = b.dataset.k, tl = tile(k); closePanel(); if (!tl || !tl.o) return true; const [x, y] = k.split(',').map(Number); placing = { obj: k, o: clone(tl.o), x, y }; toast(`Escolha o lugar novo: ${item(tl.o.k).name}. Usar coloca aqui, Mochila cancela.`, 'big'); return true; }
      case 'maqGuardar': { const k = b.dataset.k, tl = tile(k); closePanel(); if (tl && tl.o) pickUpPlaced(k, tl, tl.o); return true; }
      case 'maqLixo': {
        const k = b.dataset.k, tl = tile(k); if (!tl || !tl.o) { closePanel(); return true; }
        if (lixoConfirm !== k) { lixoConfirm = k; b.textContent = 'Toque de novo para jogar fora'; return true; }
        lixoConfirm = ''; setTile(k, tl.s ? { s: 1, w: tl.w, ...(tl.fe ? { fe: tl.fe } : {}) } : null); sfx.pick(); toast(`${item(tl.o.k).name} foi para o lixo.`); closePanel(); return true;
      }
      case 'dancar': { const uid = b.dataset.uid, p = peerPlayers().find(x => x.uid === uid); closePanel(); if (!p) return true; emitP2P({ type: 'casa3', to: uid, k: 'danca' }); comecarDanca(p.name); return true; }
      case 'beijo': { const p = peerPlayers().find(x => x.uid === b.dataset.uid); closePanel(); if (p) interactPeerBeijo(p); return true; }
    }
    return false;
  }
  function casa3P2P(d) {
    if (d.k === 'comer') { const it = item(d.id), en = Math.round((it.energy || 0) * 1.5); P.energy = Math.min(P.maxEnergy, P.energy + en); if (it.buff) P.buff = { b: it.buff, until: nowMin() + 7 * 60, day: W.meta.day, name: it.name }; dirty(); sfx.eat(); toast(`${d.from} serviu ${it.name.toLowerCase()} e vocês comeram juntos! 💕 +${en} de energia.`, 'big', d.id, 'mesa'); }
    if (d.k === 'danca') comecarDanca(d.from);
  }
  // tocar na outra pessoa sem presente na mão: beijinho ou dança
  function menuPessoa(p) {
    openPanel(`<h2>${esc(p.name)}</h2><div class="row"><button class="btn g" data-a="dancar" data-uid="${p.uid}" type="button">💃 Dançar juntinhos</button>${P.spouse === p.uid ? `<button class="btn" data-a="beijo" data-uid="${p.uid}" type="button">💕 Beijinho</button>` : ''}</div><p style="text-align:center;font-size:13px">Para dar um presente, segure o item e toque na pessoa.</p>`, 'pessoa', p.uid);
  }

  // ---------- tocar em Usar dentro de casa (antes dos móveis comuns) ----------
  function casa3Act(m, tx, ty) {
    if (m.id !== 'house') return false;
    if (P.pose && P.pose.k === 's') { const k = P.pose.mk; levantar(); openMovelMenu(k); return true; }
    if (livroAct(m, tx, ty)) return true;
    const mv = movelAt(tx, ty), s = held();
    if (!mv || (s && item(s.id).cat === 'movel')) return false;
    if (mesaAct(mv.k, mv.id)) return true;
    if (ASSENTO[mv.id]) return sentar(mv.k, mv.id);
    if (mv.id === 'guardaroupa' || mv.id === 'comoda') { openArmario(); return true; }
    return false;
  }
  // painel de um móvel com girar / mover / guardar (e sentar, armário)
  function openMovelMenu(k) {
    const id = casa()[k], f = MOVEIS[id]; if (!f) return;
    openPanel(`<h2>${f.name}</h2><p style="text-align:center">${f.desc}</p><div class="row" style="flex-wrap:wrap">${ASSENTO[id] ? `<button class="btn g" data-a="movelSentar" data-k="${k}" type="button">Sentar</button>` : ''}${id === 'guardaroupa' || id === 'comoda' ? '<button class="btn g" data-a="armario" type="button">Abrir guarda-roupa</button>' : ''}${id === 'tvcasa' ? '<button class="btn g" data-a="movelTV" type="button">Ligar a TV</button>' : ''}${GIRA.has(id) ? `<button class="btn" data-a="movelGirar" data-k="${k}" type="button">Girar ↻</button>` : ''}<button class="btn" data-a="movelMove" data-k="${k}" type="button">Mover</button><button class="btn" data-a="movelPick" data-k="${k}" type="button">Guardar na mochila</button></div>`, 'movel', k);
  }

  // decoração de casa: livro rosa, comida na mesa e o criado-mudo/brinquedos
  // onde fica o tampo de cada mesa (centro do prato), em pixels
  function topoMesa(x, y, id, r) {
    const px = x * T, py = y * T;
    if (id === 'mesapinho') return [px + 8, py + 5];
    if (id === 'mesacozinha') return [px + 23, py + 11];
    if (id === 'mesacarvalho') return r % 2 ? [px + 8, py + 22] : [px + 25, py + 5];
    return [px + 8, py + 5];
  }
  function casa3Ents(m, ents, t) {
    if (m.id !== 'house') return;
    for (const [k, v] of Object.entries(W.farm.mesa || {})) {
      const id = casa()[k]; if (!id || !v) continue;
      const d = movelDims(k, id), [x, y] = k.split(',').map(Number), [cx, cy] = topoMesa(x, y, id, rotOf(k));
      // prato apoiado no tampo da mesa (cy = altura do tampo) e a comida em cima dele
      ents.push({ y: (y + d.h - 1) * T + 15, f: () => { oval(cx, cy, 6.5, 2.2, '#c8c0b0'); oval(cx, cy - 0.5, 6, 1.8, '#f8f4ec'); drawIconAt(v.id, cx - 5, cy - 10, 0.62); for (let i = 0; i < 2; i++) { const p = (t * 0.6 + i * 0.5) % 1; R(cx - 2 + i * 4, cy - 12 - p * 8, 1, 2, `rgba(255,255,255,${0.6 * (1 - p)})`); } } });
    }
    if (W.farm.livro) {
      const [x, y] = W.farm.livro.split(',').map(Number), mv = movelAt(x, y), top = mv ? (mv.id === 'criadomudo' ? -5 : mv.id === 'mesacozinha' ? 0 : mv.id === 'guardaroupa' ? -26 : mv.id === 'comoda' ? -8 : mv.id === 'estanteipe' ? -18 : 0) : 8;
      ents.push({ y: y * T + 15.5, f: () => { const px = x * T + 3, py = y * T + top; R(px, py + 2, 10, 4, '#b8406a'); R(px, py, 10, 3, '#f48ab8'); R(px + 1, py, 8, 1, '#ffc0d8'); R(px + 10, py + 1, 1, 4, '#f4f0e8'); disc(px + 5, py + 1, 1.2, '#f4c83a'); if (Math.sin(t * 2) > 0.85) R(px + 8, py - 2, 1, 1, '#ffffff'); } });
    }
  }
  // na primeira vez: criado-mudo ao lado da cama com o livro rosa em cima
  let livroIniFeito = false;
  function casa3Sync() {
    if (!W.farm || !W.farm.t || !P || W.farm.livroIni || livroIniFeito) return;
    livroIniFeito = true; setFarmVal('livroIni', 1);
    if (!movelAt(4, 2)) { setFarm('casa', '4,2', 'criadomudo'); setFarmVal('livro', '4,2'); }
    else addItem('livrorosa', 1, true);
  }

  function interactPeerBeijo(p) { emitP2P({ type: 'kiss', to: p.uid }); loveFx = 2; sfx.level(); if (P.flags.kiss !== W.meta.day) { P.flags.kiss = W.meta.day; P.energy = Math.min(P.maxEnergy, P.energy + 30); toast('Um beijinho deu +30 de energia. 💕'); dirty(); } }
