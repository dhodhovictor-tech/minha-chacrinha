
  // ================= Centro Comunitário =================
  const ccData = () => (W.meta.cc = W.meta.cc || {});
  const ccSlots = bid => ccData()[bid] || {};
  function bundleDone(b) { const got = Object.keys(ccSlots(b.id)).filter(k => ccSlots(b.id)[k]).length; return b.gold ? got >= 1 : got >= b.need; }
  function ccRoomDone(i) { const r = CC_ROOMS[i]; return !!r && !!W.meta && r.bundles.every(bundleDone); }
  function ccRoomsDone() { return W.meta ? CC_ROOMS.filter((r, i) => ccRoomDone(i)).length : 0; }
  const ccDone = id => ccRoomDone(CC_ROOMS.findIndex(r => r.id === id));
  const anyIcon = key => (key === '*mel' ? 'mel' : key[0] === '*' ? key.slice(1) + ':' + ({ geleia: 'morango', conserva: 'batata', vinho: 'uva' }[key.slice(1)] || 'morango') : key);
  const anyName = key => (key[0] === '*' ? 'Qualquer ' + ({ geleia: 'geleia', conserva: 'conserva', vinho: 'vinho', mel: 'mel' }[key.slice(1)] || key.slice(1)) : item(key).name);
  const slotMatch = (key, id) => (key[0] === '*' ? item(id).kind === key.slice(1) : id === key);
  function slotHave(key, n) { for (const s of P.inv) if (s && slotMatch(key, s.id) && count(s.id) >= n) return s.id; return null; }
  const coopPrice = p => (W.meta && ccDone('cofre') ? Math.round(p * 0.9) : p);
  let ccTab = 0;
  function openCC(room) {
    if (room != null) ccTab = room;
    const r = CC_ROOMS[ccTab], rd = ccRoomDone(ccTab);
    const tabs = `<div class="tabs">${CC_ROOMS.map((x, i) => `<button type="button" data-a="ccTab" data-i="${i}" class="${ccTab === i ? 'on' : ''}">${x.name}${ccRoomDone(i) ? ' ✓' : ''}</button>`).join('')}</div>`;
    const cards = r.bundles.map(b => {
      const got = ccSlots(b.id), done = bundleDone(b);
      if (b.gold) return `<div class="item ccb${done ? ' done' : ''}"><span class="nm"><b>${b.name}</b><small>${done ? 'Pago! ✓' : 'Doação em dinheiro para a reforma.'} Presente: ${b.gift.map(([id, n]) => `${n}× ${item(id).name}`).join(', ')}</small></span>${done ? '' : `<button class="btn g" data-a="ccPay" data-b="${b.id}" type="button" ${gold() >= b.gold ? '' : 'disabled'}>Pagar</button>`}</div>`;
      const n = Object.keys(got).filter(k => got[k]).length;
      const slots = b.items.map(([key, q], i) => `<span class="cslot${got[i] ? ' on' : ' miss'}" title="${esc(anyName(key))}"><img src="${iconURL(anyIcon(key))}" alt="">${q > 1 ? `<b>${q}</b>` : ''}</span>`).join('');
      const give = done ? '' : b.items.map(([key, q], i) => { if (got[i]) return ''; const id = slotHave(key, q); return id ? `<button class="btn" data-a="ccGive" data-b="${b.id}" data-i="${i}" type="button">Doar ${q > 1 ? q + ' ' : ''}${esc(item(id).name)}</button>` : ''; }).join('');
      return `<div class="item ccb${done ? ' done' : ''}"><span class="nm"><b>${b.name}</b> <small>${Math.min(n, b.need)}/${b.need}${done ? ' · completo ✓' : ''} · presente: ${b.gift.map(([id, q]) => `${q}× ${item(id).name}`).join(', ')}</small><span>${slots}</span>${give ? `<span class="row" style="justify-content:flex-start">${give}</span>` : ''}</span></div>`;
    }).join('');
    openPanel(`<h2>Centro Comunitário</h2><p style="text-align:center;font-size:13px">O prédio da vila está abandonado. Cada pacote completo traz um presente, e cada sala restaurada melhora a vida no vale. Os dois podem doar.</p>${tabs}
      <p class="speech"><b>${r.name}</b> · recompensa: ${r.reward}${rd ? ' <b>(restaurada!)</b>' : ''}</p><div class="list">${cards}</div>
      <p style="text-align:center;font-size:13px">Salas restauradas: ${ccRoomsDone()}/6</p>`, 'cc');
  }
  function markSlot(bid, i) {
    ccData()[bid] = { ...ccSlots(bid), [i]: P.uid };
    queueUpdate('world/meta', { cc: { [bid]: { [i]: P.uid } } });
  }
  function afterDonation(b, roomBefore) {
    if (bundleDone(b)) { for (const [id, n] of b.gift) addItem(id, n, true); toast(`Pacote completo: ${b.name}! Presente: ${b.gift.map(([id, n]) => `${n}× ${item(id).name}`).join(', ')}`, 'big'); sfx.level(); }
    const ri = CC_ROOMS.findIndex(r => r.bundles.includes(b));
    if (!roomBefore && ccRoomDone(ri)) {
      const r = CC_ROOMS[ri];
      setTimeout(() => toast(`${r.name} restaurada! ${r.reward}.`, 'big'), 900);
      if (r.id === 'despensa' && Object.values(farmB()).some(x => x.type === 'greenhouse')) { earn(15000); setTimeout(() => toast('A vila devolveu os 15.000 ₲ da estufa!', 'big'), 2200); }
      if (ccRoomsDone() >= 6) setTimeout(ccCelebrate, 1600);
    }
  }
  function ccGive(bid, i) {
    const r = CC_ROOMS.find(x => x.bundles.some(b => b.id === bid)), b = r.bundles.find(x => x.id === bid);
    if (!b || bundleDone(b) || ccSlots(bid)[i]) return;
    const [key, q] = b.items[i], id = slotHave(key, q);
    if (!id) return;
    const before = ccRoomDone(CC_ROOMS.indexOf(r));
    removeItem(id, q); markSlot(bid, i); sfx.pop();
    afterDonation(b, before); openCC();
  }
  function ccPay(bid) {
    const r = CC_ROOMS.find(x => x.bundles.some(b => b.id === bid)), b = r.bundles.find(x => x.id === bid);
    if (!b || bundleDone(b)) return;
    const before = ccRoomDone(CC_ROOMS.indexOf(r));
    if (!spend(b.gold)) { toast('Moedas insuficientes.'); return; }
    markSlot(bid, 0); sfx.coin(); afterDonation(b, before); openCC();
  }
  function ccCelebrate() {
    openPanel(`<h2>🎉 O Centro Comunitário renasceu!</h2><p class="big" style="text-align:center">A vila inteira se reuniu na praça para agradecer.</p><p style="text-align:center">Graças a vocês, o Vale Doce voltou a ter vida: estufa, carrinhos da mina, aquário, caldeira, mural e cooperativa funcionando. Que orgulho!</p><div class="row"><button class="btn g" data-a="close" type="button">Que alegria!</button></div>`, 'msg');
    sfx.level();
  }
  // cartas das salas (cada pessoa recebe a sua, com o efeito da sala)
  function checkCCMail() {
    for (let i = 0; i < CC_ROOMS.length; i++) {
      if (!ccRoomDone(i)) continue;
      const r = CC_ROOMS[i];
      const text = { despensa: 'A despensa está cheia! Como agradecimento, a Rosa constrói a estufa de graça (ou a vila devolve o que vocês pagaram).', artesanato: 'Os carrinhos de mina foram consertados! Há carrinhos na chacrinha, na vila, na praia e na mina para viajar rapidinho.', aquario: 'O aquário ficou lindo! O Zé melhorou sua vara de pesca e mandou covos.', caldeira: 'A caldeira voltou a funcionar! O Seu Cláudio agora abre geodos de graça.', mural: 'O mural está completo e a vila toda ficou mais próxima de vocês. +1 coração com todos!', cofre: 'O cofre está cheio! Nasceu a Cooperativa do Vale: 10% de desconto em todas as lojas.' }[r.id];
      sendMail('cc:' + r.id, 'Centro Comunitário', text, r.id === 'aquario' || r.id === 'mural' ? { effect: r.id } : {});
    }
    if (ccRoomsDone() >= 6) sendMail('cc:all', 'Toda a vila', 'Obrigado por devolverem a alegria ao Vale Doce! Juntamos um presentinho para vocês dois.', { items: [['diamante', 3], ['frutaestelar', 1]] });
  }
  function applyMailEffect(fx) {
    if (fx === 'aquario') { const rod = P.inv.find(s => s && s.id === 'rod'); if (rod && (rod.lv || 0) < 3) { rod.lv = (rod.lv || 0) + 1; iconCache.clear(); urlCache.clear(); toast(`Vara de pesca melhorada: ${toolName('rod', rod.lv)}!`, 'big'); } addItem('covo', 3, true); }
    if (fx === 'mural') { for (const id of Object.keys(NPCS)) { const r = rel(id); r.pts = Math.min(2500, r.pts + 250); } toast('+1 coração com todos os moradores!', 'big'); }
  }
  // construir: a estufa sai de graça depois da despensa
  function buildLv(type) {
    const B = BUILDS[type];
    if (type === 'greenhouse' && W.meta && ccDone('despensa')) return { gold: 0, need: {} };
    return B.lvs[0];
  }

  // ================= museu =================
  function openMuseum() {
    const don = W.meta.museum || {}, n = MUSEUM_ITEMS.filter(id => don[id]).length;
    const cells = MUSEUM_ITEMS.map(id => { const has = !don[id] && count(id) > 0; return `<div class="mcell${don[id] ? ' on' : ''}"><img src="${iconURL(id)}" alt=""><small>${don[id] ? esc(item(id).name) : '???'}</small>${has ? `<button class="btn g" data-a="mDonate" data-id="${id}" type="button">Doar</button>` : ''}</div>`; }).join('');
    openPanel(`<h2>Museu do Vale</h2><p style="text-align:center;font-size:13px">Doe pedras preciosas, minerais e artefatos. Artefatos aparecem onde o chão tem minhoquinhas se mexendo: cave com a enxada.</p>
      <p style="text-align:center"><b>Coleção: ${n}/${MUSEUM_ITEMS.length}</b></p><div class="mgrid">${cells}</div>
      <h3>Recompensas</h3><div class="list">${MUSEUM_REWARDS.map(([k, , txt]) => `<div class="item${n >= k ? '' : ' dim'}"><span class="nm"><b>${k} doações</b><small>${txt}${n >= k ? ' ✓' : ''}</small></span></div>`).join('')}</div>`, 'museum');
  }
  function museumDonate(id) {
    W.meta.museum = W.meta.museum || {};
    if (W.meta.museum[id] || !count(id) || !MUSEUM_ITEMS.includes(id)) return;
    removeItem(id, 1); W.meta.museum[id] = P.uid;
    queueUpdate('world/meta', { museum: { [id]: P.uid } });
    sfx.level(); gainXP('foraging', 10);
    const n = MUSEUM_ITEMS.filter(x => W.meta.museum[x]).length, rw = MUSEUM_REWARDS.find(r => r[0] === n);
    if (rw) { for (const [k, q] of rw[1]) addItem(k, q, true); setTimeout(() => toast(`Recompensa do museu: ${rw[2]}!`, 'big'), 400); }
    openMuseum();
  }

  // ================= pontos de escavação (minhoquinhas) =================
  function artifactSpots(mapId) {
    if (!W.meta || !['farm', 'town', 'beach'].includes(mapId)) return [];
    const m = MAPS[mapId], d = W.meta.day, out = [], max = mapId === 'town' ? 3 : 2, salt = mapId.length * 7;
    for (let i = 0; i < 10 && out.length < max; i++) {
      const x = 2 + Math.floor(hash(d, i, 61 + salt) * (m.w - 4)), y = 3 + Math.floor(hash(d, i, 67 + salt) * (m.h - 6)), g = m.at(x, y);
      if (m.solid[y * m.w + x] || m.spots[x + ',' + y]) continue;
      if (mapId === 'beach' ? g !== G.SAND : ![G.GRASS, G.FLOWERS].includes(g)) continue;
      if (mapId === 'farm' && (tile(x + ',' + y) || bGrid().has(x + ',' + y))) continue;
      if (m.warps.some(w => x >= w.x && x < w.x + (w.w || 1) && y >= w.y && y < w.y + (w.h || 1))) continue;
      const k = `${d}:art:${mapId}:${x},${y}`;
      if (W.meta.taken && W.meta.taken[k]) continue;
      out.push({ x, y, k });
    }
    return out;
  }
  function digArtifact(m, tx, ty) {
    const s = artifactSpots(m.id).find(a => a.x === tx && a.y === ty);
    if (!s) return false;
    W.meta.taken = W.meta.taken || {}; W.meta.taken[s.k] = 1;
    queueUpdate('world/meta', { taken: { [s.k]: 1 } });
    if (Math.random() < 0.6 + (W.meta.luck || 0)) {
      const tot = ARTIFACTS.reduce((a, x) => a + x[1], 0); let q = Math.random() * tot;
      for (const [id, w] of ARTIFACTS) { q -= w; if (q <= 0) { addItem(id, 1); toast(`Você desenterrou: ${item(id).name}! O museu adoraria ver isso.`); break; } }
    } else addItem(m.id === 'beach' ? pick(['concha', 'coral', 'geodo']) : pick(['geodo', 'pedra', 'carvao', 'cobre']), 1);
    gainXP('foraging', 10); sfx.hoe();
    return true;
  }
  function drawWorms(x, y) {
    const t = performance.now() / 1000;
    for (let k = 0; k < 3; k++) { const ox = x * T + 4 + k * 4, oy = y * T + 10, h = 3 + Math.round(Math.abs(Math.sin(t * 5 + k * 1.7)) * 3); R(ox, oy - h, 2, h, '#6a4a2a'); R(ox + (Math.sin(t * 6 + k) > 0 ? 1 : -1), oy - h - 1, 2, 1, '#8a6a4a'); }
  }

  // ================= carrinhos de mina =================
  const CARTS = [['farm', 'Chacrinha', 16, 7], ['town', 'Vila', 21, 5], ['beach', 'Praia', 17, 3], ['minetop', 'Mina', 13, 8]];
  function openCarts() {
    if (!ccDone('artesanato')) { toast('O carrinho está quebrado. Talvez o Centro Comunitário consiga consertar.'); return; }
    openPanel(`<h2>Carrinho de mina</h2><p style="text-align:center">Para onde vamos?</p><div class="row">${CARTS.filter(c => c[0] !== P.map).map(([id, nm]) => `<button class="btn g" data-a="cart" data-id="${id}" type="button">${nm}</button>`).join('')}</div>`, 'carts');
  }

  // ================= açougue =================
  function butcher(id) {
    const a = farmA()[id]; if (!a || !MEAT[a.kind]) return;
    const n = meatAmount(a);
    if (!addItem(MEAT[a.kind], n, true)) return;
    setFarm('a', id, null); closePanel(); sfx.pop();
    toast(`${a.name} foi para o açougue. Você recebeu ${n}× ${item(MEAT[a.kind]).name}.`, 'big');
  }

  function panelAction3(a, b) {
    switch (a) {
      case 'ccTab': openCC(+b.dataset.i); break;
      case 'reload': location.reload(); break;
      case 'appswitch': openPanel(`<h2>Trocar de chacrinha?</h2><p style="text-align:center">Seu progresso continua salvo. Na próxima tela você digita o código da chacrinha e escolhe quem você é.</p><div class="row"><button class="btn" data-a="close" type="button">Voltar</button><button class="btn g" data-a="appswitch2" type="button">Trocar</button></div>`); break;
      case 'appswitch2': if (window.__chacrinhaReset) window.__chacrinhaReset(); break;
      case 'appupdate': {
        // pede ao aparelho para conferir se há versão nova e recarrega; com internet, o app abre sempre o jogo mais novo
        toast('Procurando versão nova...');
        const sw = navigator.serviceWorker;
        (sw ? sw.getRegistration().then(r => r && r.update()).catch(() => {}) : Promise.resolve()).then(() => setTimeout(() => location.reload(), 1200));
        break;
      }
      case 'ccGive': ccGive(b.dataset.b, +b.dataset.i); break;
      case 'ccPay': ccPay(b.dataset.b); break;
      case 'mDonate': museumDonate(b.dataset.id); break;
      case 'cart': { const c = CARTS.find(x => x[0] === b.dataset.id); if (c) { closePanel(); goMap(c[0], c[2] * T + 8, c[3] * T + 12, 1); } break; }
      case 'butcher': if (b.dataset.sure) butcher(b.dataset.id); else { b.dataset.sure = 1; b.textContent = 'Toque de novo para confirmar'; } break;
    }
  }
