  // ================= interface =================
  const $ = id => document.getElementById(id);
  const panel = $('panel');
  let panelOpen = false, panelKind = null, panelArg = null, invSel = -1, invTab = 'items', shopTab = 'buy';
  function toast(text, kind = '', icon = null) {
    const box = $('toasts'), el = document.createElement('div');
    el.className = 'toast frame' + (kind === 'big' ? ' big' : ''); el.textContent = text;
    if (icon) { const im = document.createElement('img'); im.src = iconURL(icon); im.alt = ''; im.style.cssText = 'width:32px;height:32px;image-rendering:pixelated;vertical-align:middle;margin-right:6px'; el.prepend(im); }
    if (kind === 'big') el.style.fontSize = '17px';
    box.appendChild(el);
    while (box.children.length > 3) box.firstChild.remove();
    setTimeout(() => el.remove(), 3400);
  }
  let lastNote = { id: null, n: 0, t: 0 };
  function pickupNote(id, n) {
    const now = performance.now();
    if (lastNote.id === id && now - lastNote.t < 1500 && lastNote.el && lastNote.el.isConnected) { lastNote.n += n; lastNote.el.textContent = `+${lastNote.n} ${item(id).name}`; lastNote.t = now; return; }
    const box = $('toasts'), el = document.createElement('div');
    el.className = 'toast frame'; el.textContent = `+${n} ${item(id).name}`;
    box.appendChild(el); while (box.children.length > 3) box.firstChild.remove();
    setTimeout(() => el.remove(), 2200);
    lastNote = { id, n, t: now, el };
  }
  function openPanel(html, kind = 'msg', arg = null) {
    panelKind = kind; panelArg = arg; panelOpen = true;
    panel.innerHTML = `<div class="win frame">${kind === 'start' || kind === 'loading' ? '' : '<button class="x" data-a="close" type="button" aria-label="Fechar">×</button>'}${html}</div>`;
    panel.hidden = false;
    input.jx = input.jy = 0;
  }
  function closePanel() { panelOpen = false; panel.hidden = true; panel.innerHTML = ''; panelKind = null; invSel = -1; dirty(); }
  const slotHTML = (s, i, on, act = 'slot') => `<button class="slot${on ? ' on' : ''}" data-a="${act}" data-i="${i}" type="button" title="${s ? item(s.id).name + (s.q ? ' (' + Q_NAME[s.q] + ')' : '') : 'vazio'}">${s ? `<img src="${iconURL(s.id, s.lv || 0)}" alt="">${s.q ? `<i class="q q${s.q}">★</i>` : ''}<span class="n">${stackable(s.id) && s.n > 1 ? s.n : ''}</span>` : ''}</button>`;
  function renderHotbar() {
    if (!P) return;
    $('hotbar').innerHTML = P.inv.slice(0, 10).map((s, i) => slotHTML(s, i, i === P.sel, 'hot')).join('');
  }
  // mostrador do relógio estilo Stardew: céu muda com a hora, sol/lua e ponteiro
  let dialKey = '';
  function drawDial(min) {
    const key = Math.floor(min / 10) + '|' + W.meta.rain + '|' + W.meta.snow;
    if (key === dialKey) return; dialKey = key;
    const c = $('dial'), x = c.getContext('2d'), h = min / 60;
    const saved = ctx; ctx = x;
    x.clearRect(0, 0, 26, 26);
    const sky = h < 17 ? '#5ab4f0' : h < 19 ? '#f0904a' : h < 21 ? '#6a4a9a' : '#1e2050';
    disc(13, 13, 12, '#6b3410'); disc(13, 13, 11, '#e09c4a'); disc(13, 13, 9, sky);
    R(3, 14, 21, 9, '#e8b060'); R(4, 14, 19, 1, '#b5651d');
    if (W.meta.rain) { for (let k = 0; k < 6; k++) R(6 + k * 3, 6 + (k % 2) * 3, 1, 3, W.meta.snow ? '#ffffff' : '#c8e4ff'); R(7, 4, 12, 3, '#d0d8e0'); }
    else if (h < 19) { disc(19, 7, 3, '#ffe04a'); R(18, 6, 1, 1, '#fff8c0'); }
    else { disc(19, 7, 3, '#f4f0d0'); disc(20, 6, 2, sky); }
    const a = Math.PI + clamp((min - DAY_START) / (DAY_END - DAY_START), 0, 1) * Math.PI;
    x.strokeStyle = '#3a1a0a'; x.lineWidth = 2; x.beginPath(); x.moveTo(13, 14); x.lineTo(13 + Math.cos(a) * 9, 14 + Math.sin(a) * 9); x.stroke();
    disc(13, 14, 2, '#3a1a0a');
    ctx = saved;
  }
  function updateHUD() {
    if (!P || !W.meta) return;
    const min = nowMin(), h = Math.floor(min / 60) % 24, mm = String(min % 60).padStart(2, '0');
    const s = season();
    $('cDay').textContent = `${weekday()} ${dom()} · Ano ${year()}`;
    $('cSeason').textContent = `${SEASONS[SEASON_ID.indexOf(s)]} · ${W.meta.rain ? (W.meta.snow ? 'neve' : W.meta.storm ? 'tempestade' : 'chuva') : 'sol'}`;
    $('cTime').textContent = `${h}:${mm}`;
    $('cGold').textContent = `${fmt(gold())} ₲`;
    $('enFill').style.height = clamp(P.energy / P.maxEnergy, 0, 1) * 100 + '%';
    const ef = clamp(P.energy / P.maxEnergy, 0, 1);
    $('enFill').style.background = ef < 0.25 ? '#e8402a' : ef < 0.5 ? '#f0c030' : '#58c83a';
    drawDial(min);
    const bf = $('buff'), bon = P.buff && P.buff.day === W.meta.day && P.buff.until > min;
    bf.hidden = !bon;
    if (bon) { const left = P.buff.until - min; bf.textContent = `${P.buff.name}: ${Object.entries(P.buff.b).map(([k, v]) => `${BUFF_NAMES[k]} +${v}`).join(', ')} (${Math.floor(left / 60)}h${String(left % 60).padStart(2, '0')})`; }
    $('hpFill').style.height = clamp(P.hp / 100, 0, 1) * 100 + '%';
    const others = peerPlayers().filter(p => !p.me);
    const pe = $('peer');
    if (online) {
      pe.hidden = false;
      pe.innerHTML = others.length
        ? others.map(p => `<span class="dot" style="background:${SHIRTS[(p.look || {}).shirt || 0]}"></span>${esc(p.name || 'Alguém')} · ${placeName(p.map)}${p.sleep ? ' · dormindo' : ''}`).join('<br>')
        : `<span class="dot" style="background:#aaa"></span>Só você na chacrinha agora`;
    } else pe.hidden = true;
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const placeName = id => !id ? '...' : id.startsWith('mine') && id !== 'minetop' ? 'Mina, andar ' + id.slice(4) : (id.startsWith('b:') ? 'com os animais' : { farm: 'na chacrinha', town: 'na vila', house: 'em casa', store: 'no armazém', smith: 'no ferreiro', minetop: 'na entrada da mina', beach: 'na praia', cc: 'no Centro Comunitário', museum: 'no museu', bar: 'no bar', carpentry: 'na carpintaria', ranch: 'no rancho', fishshop: 'na peixaria' }[id] || id);

  // ---------- mochila ----------
  function openInventory(tab) {
    invTab = tab || invTab; invSel = -1;
    renderInventory();
  }
  function renderInventory() {
    const tabs = `<div class="tabs">${[['items', 'Mochila'], ['craft', 'Criar'], ['skills', 'Habilidades'], ['rel', 'Amizades'], ['coop', 'Chacrinha']].map(([k, l]) => `<button type="button" data-a="tab" data-t="${k}" class="${invTab === k ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    let body = '';
    if (invTab === 'items') {
      const s = invSel >= 0 ? P.inv[invSel] : null, it = s ? item(s.id) : null;
      body = `<p style="text-align:center;font-size:13px">A primeira fileira é a barra de ferramentas. Toque num item e depois em outro lugar para trocar.</p>
        <div class="grid">${P.inv.map((s, i) => slotHTML(s, i, i === invSel)).join('')}</div>
        <div class="desc">${s ? `<b>${it.cat === 'tool' ? toolName(s.id, s.lv) : it.name}${s.q ? ` <span class="qtag q${s.q}">★ ${Q_NAME[s.q]}</span>` : ''}</b>${it.desc ? ' · ' + it.desc : ''}${it.sell ? ` · hoje vale ${fmt(sellPrice(s.id, s.q))} ₲ ${trendHTML(s.id)}` : ''}${it.energy ? ` · +${Math.round(it.energy * Q_ENERGY[s.q || 0])} de energia` : ''}${s.id === 'can' ? ` · água: ${P.water}/${canCap(s.lv || 0)}` : ''}` : 'Toque num item para ver o que é.'}</div>
        ${s && it.cat !== 'tool' ? `<div class="row">${it.energy ? '<button class="btn g" data-a="eatSel" type="button">Comer</button>' : ''}<button class="btn r" data-a="trash" type="button">Jogar fora</button></div>` : ''}
        <div class="row"><button class="btn" data-a="mute" type="button">${muted ? 'Ligar o som' : 'Desligar o som'}</button></div>`;
    } else if (invTab === 'craft') {
      body = `<div class="list">${RECIPES.map(r => {
        const ok = !r.skill || skillLv(P.skills[r.skill[0]]) >= r.skill[1];
        const has = Object.entries(r.need).every(([id, n]) => count(id) >= n);
        const need = Object.entries(r.need).map(([id, n]) => `<span style="color:${count(id) >= n ? '#2a7a2a' : '#a83a2a'}">${n} ${item(id).name.toLowerCase()} (${count(id)})</span>`).join(', ');
        return `<div class="item"><img src="${iconURL(r.id)}" alt=""><span class="nm"><b>${item(r.id).name}${r.out ? ' ×' + r.out : ''}</b><small>${ok ? need : `Libera com ${SKILLS[r.skill[0]]} nível ${r.skill[1]}`}</small><small>${item(r.id).desc || ''}</small></span><button class="btn g" data-a="craft" data-id="${r.id}" type="button" ${ok && has ? '' : 'disabled'}>Criar</button></div>`;
      }).join('')}</div>`;
    } else if (invTab === 'skills') {
      body = Object.entries(SKILLS).map(([k, n]) => { const lv = skillLv(P.skills[k]); return `<div class="skill"><span>${n}</span><span class="pip">${Array.from({ length: 10 }, (_, i) => `<i class="${i < lv ? 'on' : ''}"></i>`).join('')}</span><b>${lv}</b></div>`; }).join('')
        + `<p style="font-size:13px">Você sobe de nível colhendo, pescando, minerando, coletando e lutando. Novos níveis liberam receitas.</p>
        <p style="font-size:13px">Peixes pescados: ${P.stats.fish || 0} · Total enviado: ${fmt(P.stats.shipped || 0)} ₲ · Andar mais fundo da mina: ${P.mineFloor || 0}</p>`;
    } else if (invTab === 'rel') {
      body = `<div class="list">${Object.entries(NPCS).map(([id, n]) => `<div class="item"><span class="nm"><b>${n.name}</b> <small>${n.role} · aniversário: ${n.bday[1]} de ${SEASONS[SEASON_ID.indexOf(n.bday[0])].toLowerCase()}</small><span>${heartsHTML(hearts(id), 10)}</span><small>${rel(id).talk === W.meta.day ? 'Conversaram hoje' : 'Ainda não conversaram hoje'} · presentes na semana: ${giftsThisWeek(id)}/2</small></span></div>`).join('')}</div>
        <p style="font-size:13px">Converse todo dia e dê presentes (até 2 por semana). Com mais corações, os moradores mandam receitas pelo correio.</p>`;
    } else {
      const list = Object.values(W.players);
      body = `<h3>${esc(farmName())}</h3>
        <p>${online ? 'A chacrinha é compartilhada: plantações, baús, máquinas, dinheiro e o calendário são os mesmos para quem joga. O dia só vira quando todo mundo que está jogando vai dormir.' : 'Jogando só neste aparelho. Para jogar em dupla, abram este jogo pelo link do Claude, com a outra pessoa convidada como colaboradora.'}</p>
        <div class="list">${list.map(p => { const on = peerPlayers().some(q => q.uid === p.uid); return `<div class="item"><span class="dot" style="display:inline-block;width:14px;height:14px;border-radius:50%;border:2px solid #3b1d0a;background:${SHIRTS[(p.look || {}).shirt || 0]}"></span><span class="nm"><b>${esc(p.name)}</b>${p.uid === P.uid ? ' (você)' : ''}<small>${on ? 'jogando agora · ' + placeName((peerPlayers().find(q => q.uid === p.uid) || {}).map) : 'fora do jogo'} · ganhou ${fmt(p.uid === P.uid ? P.earned : p.earned || 0)} ₲</small></span></div>`; }).join('')}</div>
        <p style="font-size:13px">Dinheiro do casal: <b>${fmt(gold())} ₲</b>. Começou com 500 ₲.</p>
        ${P.spouse ? `<p class="big" style="text-align:center">💍 Casados: ${esc(P.name)} e ${esc(P.spouseName || 'amor')}${P.flags.wedDay ? ` desde o dia ${P.flags.wedDay}` : ''}</p>` : ''}
        <p style="font-size:13px">Feno no silo: ${W.farm.hay || 0}/${siloCap()} · Animais: ${Object.keys(farmA()).length} · Construções: ${Object.keys(farmB()).length}</p>
        <div class="row"><button class="btn" data-a="relook" type="button">Trocar visual do personagem</button></div>
        <div class="row"><button class="btn" data-a="moveStart" type="button">Mudar construções e árvores de lugar</button></div>
        ${window.__chacrinhaApp ? `<p style="font-size:13px;text-align:center">Código da chacrinha: <b>${esc(window.__chacrinhaApp.code)}</b></p><div class="row"><button class="btn" data-a="appswitch" type="button">Trocar de chacrinha ou de personagem</button></div><p style="font-size:12px;text-align:center">Versão do jogo: ${esc(window.__APP_DATE || '')} (${esc(window.__APP_VERSION || '?')})</p><div class="row"><button class="btn" data-a="appupdate" type="button">Procurar atualização</button></div>` : ''}
        ${!online ? '<div class="row"><button class="btn r" data-a="wipe" type="button">Apagar esta chacrinha e começar de novo</button></div>' : ''}`;
    }
    openPanel(`<h2>${P.name}</h2>${tabs}${body}`, 'inv');
  }
  const farmName = () => (W.meta && W.meta.name) || 'Minha Chacrinha';
  function invClick(i) {
    if (invSel < 0) { if (P.inv[i]) invSel = i; }
    else if (invSel === i) invSel = -1;
    else {
      const a = P.inv[invSel], b = P.inv[i];
      if (a && b && a.id === b.id && stackable(a.id)) { b.n += a.n; P.inv[invSel] = null; }
      else { P.inv[invSel] = b; P.inv[i] = a; }
      invSel = -1; dirty(); renderHotbar();
    }
    renderInventory();
  }
  function craft(id) {
    const r = RECIPES.find(x => x.id === id);
    if (!r || !Object.entries(r.need).every(([k, n]) => count(k) >= n)) return;
    if (r.skill && skillLv(P.skills[r.skill[0]]) < r.skill[1]) return;
    for (const [k, n] of Object.entries(r.need)) removeItem(k, n);
    addItem(id, r.out || 1, true); sfx.pop(); toast(`Você criou: ${item(id).name}${r.out ? ' ×' + r.out : ''}.`);
    renderInventory();
  }
  // ---------- lojas ----------
  const SHOP_INFO = {
    pedro: { title: 'Armazém do Seu Pedro', tabs: [['buy', 'Comprar'], ['sell', 'Vender']], greet: () => (season() === 'winter' ? '“No inverno nada brota, mas a cozinha não para!”' : '“Sementes fresquinhas da estação! Cada uma só cresce na sua época.”') },
    claudio: { title: 'Ferraria do Seu Cláudio', tabs: [['buy', 'Comprar'], ['up', 'Melhorar'], ['geode', 'Geodos'], ['sell', 'Vender']], greet: () => '“Traga barras e moedas que eu deixo suas ferramentas novinhas.”' },
    rosa: { title: 'Carpintaria da Rosa', tabs: [['build', 'Construir'], ['bup', 'Reformar'], ['buy', 'Materiais']], greet: () => '“O que vamos construir hoje?”' },
    marta: { title: 'Rancho da Marta', tabs: [['animals', 'Animais'], ['buy', 'Comprar'], ['sell', 'Vender']], greet: () => '“Bicho bem cuidado é bicho feliz!”' },
    ze: { title: 'Peixaria do Zé', tabs: [['buy', 'Comprar'], ['sell', 'Vender']], greet: () => '“Isca boa, peixe grande!”' },
    cida: { title: 'Mercado da Vila', tabs: [['prices', 'Preços'], ['buy', 'Comprar'], ['animals', 'Animais'], ['sell', 'Vender']], greet: () => '“Olha a feira! Preço bom é preço de hoje!”' },
    lia: { title: 'Bar da Lia', tabs: [['buy', 'Cardápio'], ['recipes', 'Receitas'], ['sell', 'Vender']], greet: () => '“Senta aí! Hoje tem pizza.”' },
  };
  const COOK_PRICES = { farinha: 100, acucar: 100, oleo: 200, arroz: 200, vinagre: 200 };
  function shopList(who) {
    switch (who) {
      case 'pedro': return [...SHOP_PEDRO(season()), ...FARM_SHOP, ...Object.entries(COOK_PRICES).map(([id, price]) => ({ id, price })), ...Object.entries(FTREES).map(([k, f]) => ({ id: 'm_' + k, price: f.price })), { id: 'colmeia', price: 1500 }, ...(P.spouse ? [] : [{ id: 'alianca', price: 5000, one: true }])];
      case 'claudio': return SHOP_CLAUDIO;
      case 'rosa': return [{ id: 'madeira', price: 10 }, { id: 'pedra', price: 20 }];
      case 'cida': return marketStock();
      case 'marta': return [{ id: 'feno', price: hayPrice() }, { id: 'balde', price: 1000, one: true }, { id: 'tesoura', price: 1000, one: true }];
      case 'ze': return [{ id: 'isca', price: 5 }, { id: 'covo', price: 1500 }];
      case 'lia': return [{ id: 'expresso', price: 250 }, { id: 'pizza', price: 600 }, { id: 'salada', price: 220 }, { id: 'pao', price: 120 }, { id: 'sopaabobora', price: 600 }, { id: 'biscoito', price: 280 }, { id: 'sorvete', price: 250 }];
    }
    return [];
  }
  const urlCanvasCache = new Map();
  function canvasURL(key, c) {
    if (urlCanvasCache.has(key)) return urlCanvasCache.get(key);
    const o = document.createElement('canvas'); o.width = 32; o.height = 32;
    const x = o.getContext('2d'); x.imageSmoothingEnabled = false;
    const sc = Math.min(32 / c.width, 32 / c.height); x.drawImage(c, (32 - c.width * sc) / 2, (32 - c.height * sc) / 2, c.width * sc, c.height * sc);
    const u = o.toDataURL(); urlCanvasCache.set(key, u); return u;
  }
  const trendAnimal = () => { const f = ANIMAL_BUY[seasonIdx()]; return Math.abs(f - 1) < 0.03 ? '' : `<span class="tr ${f > 1 ? 'up' : 'dn'}">${f > 1 ? '▲' : '▼'}${Math.round(Math.abs(f - 1) * 100)}%</span>`; };
  const needTxt = need => Object.entries(need).map(([k, n]) => `<span style="color:${count(k) >= n ? '#2a7a2a' : '#a83a2a'}">${n} ${item(k).name.toLowerCase()} (${count(k)})</span>`).join(', ');
  function openShop(who) { panelArg = who; shopTab = SHOP_INFO[who].tabs[0][0]; renderShop(who); }
  function renderShop(who) {
    const info = SHOP_INFO[who];
    const tabs = `<div class="tabs">${info.tabs.map(([k, l]) => `<button type="button" data-a="stab" data-t="${k}" class="${shopTab === k ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    const row = (img, name, small, right) => `<div class="item"><img src="${img}" alt=""><span class="nm">${name}<small>${small || ''}</small></span>${right}</div>`;
    let body = '';
    if (shopTab === 'buy') {
      const list = shopList(who);
      body = list.length ? `<div class="list">${list.map(o => { const have = o.one && P.inv.some(s => s && s.id === o.id); const pr = coopPrice(o.price); return row(iconURL(o.id), item(o.id).name, item(o.id).desc, `<span class="price">${fmt(pr)} ₲</span>${have ? '<small>Já tem</small>' : `<button class="btn" data-a="buy" data-id="${o.id}" data-n="1" type="button" ${gold() < pr ? 'disabled' : ''}>1</button>${o.one ? '' : `<button class="btn" data-a="buy" data-id="${o.id}" data-n="5" type="button" ${gold() < pr * 5 ? 'disabled' : ''}>5</button>`}`}`); }).join('')}</div>` : '<p>Nada à venda nesta estação.</p>';
    } else if (shopTab === 'up') {
      body = `<div class="list">${['hoe', 'can', 'axe', 'pick', 'sword', 'rod'].map(id => {
        const s = P.inv.find(x => x && x.id === id); if (!s) return '';
        const up = UPGRADES.find(u => u.lv === (s.lv || 0) + 1);
        if (!up) return `<div class="item"><img src="${iconURL(id, s.lv)}" alt=""><span class="nm">${toolName(id, s.lv)}<small>Já está no máximo.</small></span></div>`;
        const ok = gold() >= up.gold && count(up.bar) >= 5;
        const eff = { hoe: 'mais resistente', can: `leva ${canCap(up.lv)} de água`, axe: 'corta mais rápido', pick: 'quebra mais rápido', sword: 'mais dano', rod: 'barra de pesca maior' }[id];
        return `<div class="item"><img src="${iconURL(id, up.lv)}" alt=""><span class="nm">${toolName(id, up.lv)}<small>${fmt(up.gold)} ₲ + 5 ${item(up.bar).name.toLowerCase()} · ${eff}</small></span><button class="btn g" data-a="upgrade" data-id="${id}" type="button" ${ok ? '' : 'disabled'}>Melhorar</button></div>`;
      }).join('')}</div>`;
    } else if (shopTab === 'prices') {
      body = priceBoard();
    } else if (shopTab === 'geode') {
      body = `<p style="text-align:center;font-size:13px">${ccDone('caldeira') ? 'Graças à caldeira do Centro Comunitário, abro geodos de graça!' : 'Abro qualquer geodo por 25 ₲.'} Dentro pode ter minério, mineral ou até pedra preciosa.</p><div class="list">${['geodo', 'geodogelo', 'geodomagma'].map(id => row(iconURL(id), item(id).name + ' ×' + count(id), '', `<button class="btn g" data-a="geode" data-id="${id}" type="button" ${count(id) && (gold() >= 25 || ccDone('caldeira')) ? '' : 'disabled'}>Abrir</button>`)).join('')}</div>`;
    } else if (shopTab === 'build') {
      const busy = Object.values(farmB()).some(b => !bReady(b));
      body = `${busy ? '<p style="text-align:center"><b>Já tem uma obra em andamento. Fica pronta amanhã!</b></p>' : '<p style="text-align:center;font-size:13px">Escolha o que construir e depois o lugar na chacrinha. Fica pronto no dia seguinte.</p>'}<div class="list">${Object.entries(BUILDS).map(([type, B]) => { const lv = buildLv(type), have = B.unique && Object.values(farmB()).some(b => b.type === type), ok = !have && gold() >= lv.gold && Object.entries(lv.need).every(([k, n]) => count(k) >= n); return row(canvasURL('bi|' + type, building2Canvas(type, B.w * T, B.h * T, false, 1)), B.names[0], `${have ? '<b>Já construída.</b> ' : ''}${fmt(lv.gold)} ₲ · ${needTxt(lv.need)}<br>${B.desc[0]}`, `<button class="btn g" data-a="build" data-t="${type}" type="button" ${ok && !busy ? '' : 'disabled'}>Construir</button>`); }).join('')}</div>`;
    } else if (shopTab === 'bup') {
      const list = Object.entries(farmB()).filter(([, b]) => (b.type === 'coop' || b.type === 'barn'));
      body = list.length ? `<div class="list">${list.map(([id, b]) => { const B = BUILDS[b.type], lv = B.lvs[b.lv]; if (!lv) return row(canvasURL('bi|' + b.type + b.lv, building2Canvas(b.type, B.w * T, B.h * T, false, b.lv)), B.names[b.lv - 1], 'Já está no nível máximo.', ''); const ok = gold() >= lv.gold && Object.entries(lv.need).every(([k, n]) => count(k) >= n) && bReady(b); return row(canvasURL('bi|' + b.type + (b.lv + 1), building2Canvas(b.type, B.w * T, B.h * T, false, b.lv + 1)), B.names[b.lv], `${fmt(lv.gold)} ₲ · ${needTxt(lv.need)}<br>${B.desc[b.lv]}`, `<button class="btn g" data-a="bup" data-id="${id}" type="button" ${ok ? '' : 'disabled'}>Reformar</button>`); }).join('')}</div>` : '<p style="text-align:center">Construa um galinheiro ou celeiro primeiro.</p>';
    } else if (shopTab === 'animals') {
      body = `<div class="list">${Object.entries(ANIMALS).map(([k, d]) => { const slots = animalSlots(k); return row(canvasURL('an|' + k, animalCanvas(k, 0, 0)), d.name, `${d.desc}<br>Mora no ${BUILDS[d.house].names[d.lv - 1].toLowerCase()}. ${slots ? `Vagas: ${slots}.` : 'Sem vaga no momento.'}`, `<span class="price">${fmt(coopPrice(animalPrice(k)))} ₲</span>${trendAnimal()}<button class="btn g" data-a="banimal" data-k="${k}" type="button" ${slots && gold() >= coopPrice(animalPrice(k)) ? '' : 'disabled'}>Comprar</button>`); }).join('')}</div>`;
    } else if (shopTab === 'recipes') {
      body = `<div class="list">${COOK.filter(r => r.learn === 'lia').map(r => row(iconURL(r.id), 'Receita: ' + r.name, Object.entries(r.need).map(([k, n]) => `${n} ${needName(k)}`).join(', '), P.recipes.includes(r.id) ? '<small>Já sabe</small>' : `<span class="price">${fmt(r.price)} ₲</span><button class="btn g" data-a="brec" data-id="${r.id}" type="button" ${gold() >= r.price ? '' : 'disabled'}>Comprar</button>`)).join('')}</div>`;
    } else {
      const rows = P.inv.map((s, i) => [s, i]).filter(([s]) => s && stackable(s.id) && sellPrice(s.id, s.q) > 0);
      body = rows.length ? `<div class="list">${rows.map(([s, i]) => `<div class="item"><img src="${iconURL(s.id)}" alt=""><span class="nm">${item(s.id).name}${s.q ? ` <span class="qtag q${s.q}">★</span>` : ''} ×${s.n}<small>${fmt(sellPrice(s.id, s.q))} ₲ cada ${trendHTML(s.id)}</small></span><button class="btn" data-a="sell" data-i="${i}" data-n="1" type="button">1</button><button class="btn" data-a="sell" data-i="${i}" data-n="${s.n}" type="button">Tudo</button></div>`).join('')}</div>` : '<p>Nada para vender na mochila.</p>';
    }
    openPanel(`<h2>${info.title}</h2><p style="text-align:center;font-style:italic">${info.greet()}</p><div class="row"><button class="btn" data-a="talkTo" data-id="${who}" type="button">Conversar com ${NPCS[who].name}</button></div>${tabs}${body}<p style="text-align:center"><b>${fmt(gold())} ₲</b></p>`, 'shop', who);
  }
  // ---------- baú ----------
  function openChest(k) { invSel = -1; renderChest(k); }
  function renderChest(k) {
    const tl = tile(k); if (!tl || !tl.o || tl.o.k !== 'bau') { closePanel(); return; }
    const items = tl.o.items || Array(36).fill(null);
    openPanel(`<h2>Baú</h2><p style="text-align:center;font-size:13px">Toque num item para mudar de lugar entre o baú e a mochila.</p>
      <h3>Baú</h3><div class="grid">${items.map((s, i) => slotHTML(s, i, false, 'chestOut')).join('')}</div>
      <h3>Mochila</h3><div class="grid">${P.inv.map((s, i) => slotHTML(s, i, false, 'chestIn')).join('')}</div>`, 'chest', k);
  }
  function chestMove(k, i, toChest) {
    const tl = clone(tile(k)); if (!tl || !tl.o) return;
    const items = tl.o.items || Array(36).fill(null);
    if (toChest) {
      const s = P.inv[i]; if (!s) return;
      let j = items.findIndex(x => x && x.id === s.id && (x.q || 0) === (s.q || 0) && stackable(s.id));
      if (j >= 0) items[j].n += s.n; else { j = items.findIndex(x => !x); if (j < 0) { toast('O baú está cheio.'); return; } items[j] = s; }
      P.inv[i] = null;
    } else {
      const s = items[i]; if (!s) return;
      const free = P.inv.findIndex(x => !x), same = P.inv.findIndex(x => x && x.id === s.id && (x.q || 0) === (s.q || 0) && stackable(s.id));
      if (same >= 0) P.inv[same].n += s.n; else if (free >= 0) P.inv[free] = s; else { toast('A mochila está cheia.'); return; }
      items[i] = null;
    }
    tl.o.items = items; setTile(k, tl); dirty(); renderHotbar(); renderChest(k);
  }
  // ---------- outros painéis ----------
  function openSleep() { openPanel(`<h2>Dormir?</h2><p style="text-align:center">${online && peerPlayers().filter(p => !p.me).length ? 'O dia vira quando todo mundo que está jogando for dormir.' : 'Dormir encerra o dia e recupera a sua energia.'}</p><div class="row"><button class="btn g" data-a="sleep" type="button">Dormir</button><button class="btn" data-a="close" type="button">Ainda não</button></div>`, 'sleep'); }
  function openShipInfo() {
    const tot = P.ship.reduce((a, s) => a + (s.p || sellPrice(s.id, s.q)) * s.n, 0);
    openPanel(`<h2>Caixa de envio</h2><p>Segure um item na barra e toque em Usar na caixa para enviar a pilha inteira. O pagamento chega de manhã.</p>
      ${P.ship.length ? `<div class="list">${P.ship.map((s, i) => `<div class="item"><img src="${iconURL(s.id)}" alt=""><span class="nm">${s.n}× ${item(s.id).name}${s.q ? ` <span class="qtag q${s.q}">★</span>` : ''}<small>${fmt((s.p || sellPrice(s.id, s.q)) * s.n)} ₲</small></span><button class="btn" data-a="unship" data-i="${i}" type="button">Tirar</button></div>`).join('')}</div><p class="big">${fmt(tot)} ₲ amanhã</p>` : '<p style="text-align:center">A caixa está vazia.</p>'}`, 'ship');
  }
  function openElevator() {
    const max = W.meta.mineMax || 0, floors = [];
    for (let f = 5; f <= max; f += 5) floors.push(f);
    openPanel(`<h2>Elevador</h2><p style="text-align:center">${floors.length ? 'Escolha o andar.' : 'Chegue ao andar 5 para liberar o elevador.'}</p><div class="row">${floors.map(f => `<button class="btn" data-a="floor" data-f="${f}" type="button">${f}</button>`).join('')}</div>`, 'elev');
  }
  // ---------- criação de personagem ----------
  let look = { hair: 0, style: 0, shirt: 1, skin: 0 };
  // os dois personagens prontos do casal
  const PRESETS = {
    xadrez: { hair: 0, style: 0, shirt: 1, skin: 0, beard: true, hat: 'beanie', plaid: true, scarf: true, shirtC: '#3a5aa8', pants: '#34507e', boot: '#4a2e1a' },
    casaco: { hair: 0, style: 1, shirt: 1, skin: 0, jacket: true, shirtC: '#2e6e6a', pants: '#8496b0', boot: '#6a4228', pet: 'darth' },
  };
  let startMode = 'new';
  function openStart(prefName) {
    const sw = (key, list) => `<div class="swatches">${list.map((c, i) => `<button type="button" data-a="look" data-k="${key}" data-v="${i}" class="${look[key] === i && !(key === 'shirt' && look.shirtC) ? 'on' : ''}" style="background:${c}" aria-label="cor ${i + 1}"></button>`).join('')}</div>`;
    const edit = startMode === 'edit';
    openPanel(`<h2>${edit ? 'Trocar visual' : 'Boas-vindas à ' + esc(farmName())}</h2>
      ${edit ? '' : `<p style="text-align:center">${online ? (Object.keys(W.players).length ? 'Alguém já está cuidando desta chacrinha. Monte sua pessoa para entrar junto!' : 'Monte sua pessoa. Quem abrir este jogo depois entra no mesmo sítio.') : 'Monte sua pessoa para começar.'}</p>`}
      <h3>Personagens do casal</h3>
      <div class="row presets">${[['xadrez', 'Camisa xadrez e touca'], ['casaco', 'Casaco verde e o gato Darth']].map(([k, l]) => `<button class="btn preset${look.preset === k ? ' g' : ''}" data-a="preset" data-v="${k}" type="button"><canvas class="pv" data-p="${k}" width="40" height="40" aria-hidden="true"></canvas><span>${l}</span></button>`).join('')}</div>
      <canvas id="lookcv" width="40" height="40" style="width:120px;height:120px;image-rendering:pixelated;align-self:center;background:#f4dca0;border:2px solid #6b3410;border-radius:6px"></canvas>
      <label for="nm" style="font-weight:700">Nome</label><input id="nm" type="text" maxlength="16" value="${esc(prefName || '')}" placeholder="Seu nome no jogo">
      <h3>Cabelo</h3>${sw('hair', HAIRS)}
      <div class="row"><button class="btn${look.style === 0 ? ' g' : ''}" data-a="look" data-k="style" data-v="0" type="button">Curto</button><button class="btn${look.style === 1 ? ' g' : ''}" data-a="look" data-k="style" data-v="1" type="button">Longo</button><button class="btn${look.style === 2 ? ' g' : ''}" data-a="look" data-k="style" data-v="2" type="button">Coque</button></div>
      <div class="row"><button class="btn${look.beard ? ' g' : ''}" data-a="lookT" data-k="beard" type="button">Barba</button><button class="btn${look.hat ? ' g' : ''}" data-a="lookT" data-k="hat" type="button">Touca</button><button class="btn${look.glasses ? ' g' : ''}" data-a="lookT" data-k="glasses" type="button">Óculos</button><button class="btn${look.pet ? ' g' : ''}" data-a="lookT" data-k="pet" type="button">Gato Darth</button></div>
      <h3>Roupa</h3>${sw('shirt', SHIRTS)}
      <h3>Pele</h3>${sw('skin', SKINS)}
      <div class="row"><button class="btn g" data-a="${edit ? 'relookSave' : 'start'}" type="button">${edit ? 'Salvar' : 'Entrar na chacrinha'}</button></div>`, edit ? 'look' : 'start');
    drawLook();
    for (const c of panel.querySelectorAll('canvas.pv')) { const saved = ctx; ctx = c.getContext('2d'); drawFarmer(20, 36, PRESETS[c.dataset.p], 1, 0); if (c.dataset.p === 'casaco') drawCat(33, 37, 2, 0, 'sit'); ctx = saved; }
  }
  function drawLook() {
    const c = $('lookcv'); if (!c) return;
    const saved = ctx; ctx = c.getContext('2d'); ctx.clearRect(0, 0, 40, 40);
    drawFarmer(20, 34, look, 1, 0);
    ctx = saved;
  }

  // ---------- cliques nos painéis ----------
  panel.addEventListener('click', e => {
    const b = e.target.closest('[data-a]');
    if (!b) { if (e.target === panel && !['start', 'loading', 'day'].includes(panelKind)) closePanel(); return; }
    initAudio();
    const a = b.dataset.a;
    switch (a) {
      case 'close': closePanel(); break;
      default: panelAction2(a, b); break;
      case 'tab': invTab = b.dataset.t; invSel = -1; renderInventory(); break;
      case 'slot': invClick(+b.dataset.i); break;
      case 'trash': if (invSel >= 0 && P.inv[invSel] && item(P.inv[invSel].id).cat !== 'tool') { P.inv[invSel] = null; invSel = -1; dirty(); renderHotbar(); renderInventory(); } break;
      case 'eatSel': if (invSel >= 0) { P.sel = invSel < 10 ? invSel : P.sel; const s = P.inv[invSel]; if (s) { const it = item(s.id); P.energy = Math.min(P.maxEnergy, P.energy + it.energy); P.hp = Math.min(100, P.hp + Math.round(it.energy * 0.45)); afterEat(s.id); s.n--; if (!s.n) { P.inv[invSel] = null; invSel = -1; } sfx.eat(); dirty(); renderHotbar(); renderInventory(); } } break;
      case 'mute': muted = !muted; renderInventory(); break;
      case 'craft': craft(b.dataset.id); break;
      case 'wipe': if (b.dataset.sure) { store.wipe(); location.reload(); } else { b.dataset.sure = 1; b.textContent = 'Toque de novo para apagar tudo'; } break;
      case 'stab': shopTab = b.dataset.t; renderShop(panelArg); break;
      case 'buy': {
        const id = b.dataset.id, n = +b.dataset.n, list = shopList(panelArg), o = list.find(x => x.id === id);
        if (o && spend(coopPrice(o.price) * n)) {
          let left = n;
          if (id === 'feno') { const k = Math.min(left, siloCap() - (W.farm.hay || 0)); if (k > 0) { setFarmVal('hay', (W.farm.hay || 0) + k); left -= k; toast(`${k} de feno foi direto para o silo.`); } }
          if (left) addItem(id, left, true);
          sfx.coin(); if (left) toast(`Comprou ${left}× ${item(id).name}.`);
        }
        renderShop(panelArg); break;
      }
      case 'sell': {
        const i = +b.dataset.i, n = +b.dataset.n, s = P.inv[i];
        if (s) { const k = Math.min(n, s.n), pr = sellPrice(s.id, s.q); s.n -= k; if (!s.n) P.inv[i] = null; earn(pr * k); recordSold(s.id, k); sfx.coin(); renderHotbar(); }
        renderShop(panelArg); break;
      }
      case 'upgrade': {
        const s = P.inv.find(x => x && x.id === b.dataset.id), up = s && UPGRADES.find(u => u.lv === (s.lv || 0) + 1);
        if (up && count(up.bar) >= 5 && spend(up.gold)) { removeItem(up.bar, 5); s.lv = up.lv; iconCache.clear(); urlCache.clear(); sfx.level(); toast(`Pronto: ${toolName(s.id, s.lv)}!`); dirty(); renderHotbar(); }
        renderShop(panelArg); break;
      }
      case 'chestIn': chestMove(panelArg, +b.dataset.i, true); break;
      case 'chestOut': chestMove(panelArg, +b.dataset.i, false); break;
      case 'sleep': P.sleep = true; dirty(); savePlayer(); closePanel(); toast(online && peerPlayers().filter(p => !p.me && !p.sleep).length ? 'Esperando a outra pessoa ir dormir...' : 'Boa noite!'); if (!online || !peerPlayers().some(p => !p.me && !p.sleep)) setTimeout(() => checkDayEnd(true), 600); break;
      case 'unship': { const s = P.ship.splice(+b.dataset.i, 1)[0]; if (s) { addItem(s.id, s.n, true, s.q || 0); recordSold(s.id, -s.n); } openShipInfo(); break; }
      case 'floor': closePanel(); goMap('mine' + b.dataset.f, 0, 0, 1); break;
      case 'eat': eatHeld(); break;
      case 'look': look[b.dataset.k] = +b.dataset.v; if (b.dataset.k === 'shirt') { delete look.shirtC; delete look.plaid; delete look.jacket; } delete look.preset; { const nm = ($('nm') || {}).value; openStart(nm); } break;
      case 'lookT': { const k = b.dataset.k; look[k] = look[k] ? (k === 'hat' ? '' : false) : (k === 'hat' ? 'beanie' : k === 'pet' ? 'darth' : true); if (k !== 'pet') delete look.preset; const nm = ($('nm') || {}).value; openStart(nm); break; }
      case 'preset': { look = { ...PRESETS[b.dataset.v], preset: b.dataset.v }; const nm = ($('nm') || {}).value; openStart(nm); break; }
      case 'relook': startMode = 'edit'; look = { ...P.look }; openStart(P.name); break;
      case 'relookSave': {
        P.name = (($('nm') || {}).value || '').trim().slice(0, 16) || P.name; P.look = { ...look };
        if (look.pet && !P.pet) { P.pet = { name: 'Darth', mode: 'follow' }; petInit(); }
        if (!look.pet) P.pet = null;
        startMode = 'new'; dirty(); savePlayer(); closePanel(); toast('Visual novo salvo!'); break;
      }
      case 'start': {
        const name = (($('nm') || {}).value || '').trim().slice(0, 16) || 'Visitante';
        createPlayer(name, { ...look });
        break;
      }
    }
  });
