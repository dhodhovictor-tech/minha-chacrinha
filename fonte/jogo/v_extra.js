
  // ================= loja de roupas (Ateliê da Bia) e mais diversão nos festivais =================

  // ---------- roupas: cabeça, corpo, mãos e pés; efeitos pequenos e preço salgado ----------
  const ROUPAS = {
    chapeupalha: { name: 'Chapéu de palha', slot: 'hd', price: 4500, desc: 'Lavoura conta 1 nível a mais para a qualidade das colheitas.' },
    capacete: { name: 'Capacete de minerador', slot: 'hd', price: 5500, desc: 'Lanterna na mina (ilumina mais em volta) e +1 de defesa.' },
    chapeupesca: { name: 'Chapéu de pescador', slot: 'hd', price: 5000, desc: 'O peixe morde 10% mais rápido.' },
    macacao: { name: 'Macacão de minerador', slot: 'cp', price: 6000, desc: '+2 de defesa.' },
    avental: { name: 'Avental de cozinha', slot: 'cp', price: 4000, desc: 'Comidas dão 10% a mais de energia.' },
    colete: { name: 'Colete de pesca', slot: 'cp', price: 6500, desc: 'A barra verde da pesca fica 8% maior.' },
    cachecol: { name: 'Cachecol de lã', slot: 'cp', price: 3500, desc: 'No inverno, tudo gasta 10% menos energia.' },
    luvasjardim: { name: 'Luvas de jardinagem', slot: 'mao', price: 5500, desc: '8% de chance de colher uma unidade a mais.' },
    luvascouro: { name: 'Luvas de couro', slot: 'mao', price: 4500, desc: '+1 de ataque.' },
    galochas: { name: 'Galochas', slot: 'bt', price: 4000, desc: 'Na chuva, as ferramentas gastam 25% menos energia.' },
    botastrilha: { name: 'Botas de trilha', slot: 'bt', price: 5000, desc: 'Fora da chuva, anda 5% mais rápido.' },
    // dos festivais
    coroaflores: { name: 'Coroa de flores', slot: 'hd', price: 1800, desc: 'Um pouco mais de sorte com geodos e baús de tesouro.' },
    colarhavaiano: { name: 'Colar havaiano', slot: 'cp', price: 2200, desc: 'Pesca conta 1 nível a mais no tamanho da barra.' },
    mascara: { name: 'Máscara de abóbora', slot: 'hd', price: 1500, desc: 'Só para o estilo. Bú!' },
    gorro: { name: 'Gorro de inverno', slot: 'hd', price: 2000, desc: 'No inverno, +1 de defesa.' },
  };
  for (const [k, r] of Object.entries(ROUPAS)) ITEMS[k] = { name: r.name, cat: 'roupa', slot: r.slot, sell: Math.round(r.price / 4), desc: r.desc };
  const SLOT_NAME = { hd: 'Cabeça', cp: 'Corpo', mao: 'Mãos', bt: 'Pés', r1: 'Anel', r2: 'Anel' };
  const CLOTHES_SHOP = ['chapeupalha', 'capacete', 'chapeupesca', 'macacao', 'avental', 'colete', 'cachecol', 'luvasjardim', 'luvascouro', 'galochas', 'botastrilha'].map(id => ({ id, price: ROUPAS[id].price, one: true }));
  SHOP_INFO.roupas = { npc: 'bia', title: 'Ateliê da Bia', tabs: [['buy', 'Comprar'], ['sell', 'Vender']], greet: () => '“Roupa boa é roupa que ajuda no trabalho. E fica linda!”' };
  // multiplicador de energia das roupas
  function energyMul() {
    let f = 1;
    if (eqHas('galochas') && W.meta && W.meta.rain && !W.meta.snow) f *= 0.75;
    if (eqHas('cachecol') && season() === 'winter') f *= 0.9;
    if (eqHas('capachuva') && W.meta && W.meta.rain && !W.meta.snow) f *= 0.9;
    return f;
  }
  // barraca da Bia na praça
  const STALL = { x: 26, y: 12 };
  const nearStall = () => P.map === 'town' && Math.hypot(P.x - (STALL.x + 1.5) * T, P.y - (STALL.y + 3) * T) < 28;
  function stallEnts(m, ents) {
    if (m.id !== 'town') return;
    const bx = STALL.x * T, by = STALL.y * T;
    ents.push({ y: by + 30, f: () => {
      shadowAt(bx + 24, by + 30, 24, 4);
      R(bx + 2, by + 14, 44, 14, '#7a4a8a'); R(bx + 2, by + 14, 44, 3, '#9a6aaa');
      for (let k = 0; k < 6; k++) R(bx + k * 8, by, 8, 8, k % 2 ? '#f8e8f0' : '#b04a8a');
      for (let k = 0; k < 6; k++) poly([[bx + k * 8, by + 8], [bx + k * 8 + 8, by + 8], [bx + k * 8 + 4, by + 11]], k % 2 ? '#f8e8f0' : '#b04a8a');
      R(bx + 2, by + 8, 2, 8, '#4a2a3a'); R(bx + 44, by + 8, 2, 8, '#4a2a3a');
      // roupas penduradas
      R(bx + 6, by + 16, 6, 7, '#4a8ad8'); R(bx + 15, by + 16, 6, 6, '#e8c040'); R(bx + 34, by + 16, 7, 5, '#5aa83a'); R(bx + 36, by + 21, 3, 4, '#5aa83a');
      // manequim com vestido (a Bia anda pela vila, então a barraca fica no autoatendimento)
      R(bx + 25, by + 22, 2, 7, '#5a3a2a'); R(bx + 22, by + 28, 8, 2, '#5a3a2a');
      R(bx + 23, by + 5, 6, 3, '#e8d8c0');
      poly([[bx + 21, by + 8], [bx + 31, by + 8], [bx + 33, by + 22], [bx + 19, by + 22]], '#d84a8a');
      R(bx + 21, by + 12, 10, 2, '#f8e8f0');
      nameTag('Ateliê da Bia', bx + 24, by - 4);
    } });
  }

  // ---------- mais coisas nos festivais: comidinhas, minijogos e conversa ----------
  Object.assign(ITEMS, {
    ovochocolate: { name: 'Ovo de chocolate', cat: 'food', sell: 40, energy: 60, buff: { luck: 1 }, desc: 'Dá Sorte +1 por um tempo.' },
    aguacoco: { name: 'Água de coco', cat: 'food', sell: 30, energy: 50, buff: { speed: 1 }, drink: true, desc: 'Dá Velocidade +1 por um tempo.' },
    espetinho: { name: 'Espetinho de peixe', cat: 'food', sell: 80, energy: 120, buff: { fishing: 1 }, desc: 'Dá Pesca +1 por um tempo.' },
    pipoca: { name: 'Pipoca', cat: 'food', sell: 20, energy: 40, desc: 'Crocante e quentinha.' },
    algodaodoce: { name: 'Algodão-doce', cat: 'food', sell: 30, energy: 35, buff: { speed: 1 }, desc: 'Dá Velocidade +1 por um tempo.' },
    docesabobora: { name: 'Doce de abóbora', cat: 'food', sell: 60, energy: 90, buff: { defense: 1 }, desc: 'Dá Defesa +1 por um tempo.' },
    chocolatequente: { name: 'Chocolate quente', cat: 'food', sell: 50, energy: 80, buff: { mining: 1 }, drink: true, desc: 'Dá Mineração +1 por um tempo.' },
    rabanada: { name: 'Rabanada', cat: 'food', sell: 90, energy: 150, buff: { farming: 1 }, desc: 'Dá Lavoura +1 por um tempo.' },
  });
  const FEST_SHOP = {
    ovo: [['ovochocolate', 120], ['coroaflores', 1800], ['s_morango', 120]],
    flores: [['coroaflores', 1800], ['s_tulipa', 30], ['s_jazz', 45]],
    luau: [['aguacoco', 100], ['espetinho', 220], ['colarhavaiano', 2200]],
    aguasvivas: [['aguacoco', 100], ['espetinho', 220]],
    feira: [['pipoca', 60], ['algodaodoce', 90], ['coroaflores', 1800]],
    espiritos: [['docesabobora', 180], ['mascara', 1500], ['pipoca', 60]],
    gelo: [['chocolatequente', 150], ['gorro', 2000]],
    estrela: [['rabanada', 250], ['chocolatequente', 150], ['gorro', 2000]],
  };
  SHOP_INFO.festa = { title: 'Barraca da festa', tabs: [['buy', 'Comprar']], greet: () => '“Delícias e lembrancinhas, só hoje!”' };
  // minijogos de cada festa: 'pegar' (pegar o que cai com a cesta) ou 'mira' (apertar na hora certa)
  const FEST_GAMES = {
    ovo: [{ id: 'cestaovo', type: 'pegar', name: 'Pegue os ovos na cesta', good: '#f4c83a', bad: null, prize: [10, 600] }],
    flores: [{ id: 'buque', type: 'mira', name: 'Jogue o buquê', zone: 'o alvo de flores', prize: [4, 500] }],
    luau: [{ id: 'cocos', type: 'pegar', name: 'Pegue os cocos', hint: 'Cuidado com os caranguejos!', good: '#8a5a2a', bad: '#e8502a', prize: [12, 700] }, { id: 'marsh', type: 'mira', name: 'Asse o marshmallow na fogueira', zone: 'o ponto dourado', prize: [4, 500] }],
    aguasvivas: [{ id: 'lanterna', type: 'mira', name: 'Solte a lanterna no vento certo', zone: 'o vento bom', prize: [3, 400] }],
    feira: [{ id: 'martelo', type: 'mira', name: 'Martelo de força', zone: 'a força máxima', prize: [4, 600] }, { id: 'macas', type: 'pegar', name: 'Pegue as maçãs', good: '#e8302a', bad: '#5a5a5a', prize: [12, 600] }],
    espiritos: [{ id: 'aboboras', type: 'mira', name: 'Acerte a abóbora', zone: 'a abóbora', prize: [4, 500] }],
    gelo: [{ id: 'flocos', type: 'pegar', name: 'Pegue os flocos de neve', good: '#ffffff', bad: null, prize: [12, 500] }],
    estrela: [{ id: 'estrela', type: 'mira', name: 'Coloque a estrela no topo da árvore', zone: 'o topo', prize: [3, 500] }],
  };
  const FEST_TALK = {
    ovo: ['Achou muitos ovos? Eu sempre perco os escondidos atrás da fonte!', 'O ovo de chocolate da barraca é o melhor do ano.'],
    flores: ['Que dia lindo para dançar, não é?', 'As flores da praça foram as crianças que plantaram.'],
    luau: ['O que você vai pôr na sopa? Eu trouxe um pouquinho de tudo!', 'Já experimentou a água de coco? Refresca a alma.', 'À noite tem fogueira e marshmallow!', 'Dizem que quem pega mais cocos tem sorte o verão inteiro.'],
    aguasvivas: ['Olha como elas brilham... parece mágica.', 'Todo ano elas passam por aqui, voltando para o fundo do mar.'],
    feira: ['O martelo de força é mais difícil do que parece!', 'Trouxe minha melhor abóbora para a exposição.'],
    espiritos: ['Uuuh! Ainda bem que é só fantasia...', 'Já entrou no labirinto? Eu me perdi duas vezes.'],
    gelo: ['Que frio! Ainda bem que tem chocolate quente.', 'Ano passado pesquei 7 peixes no gelo. Duvido que você bata!'],
    estrela: ['Feliz Estrela de Inverno!', 'Quem será que tirou você no amigo secreto?'],
  };
  function festTalk(id) { const f = festOn(); if (!f || P.map !== 'town' || !FEST_TALK[f.id]) return null; return pick(FEST_TALK[f.id]); }
  function festExtraHTML(f) {
    const games = FEST_GAMES[f.id] || [], done = (P.flags.fx || {});
    return `<h3>Mais diversão</h3><div class="list">${games.map(g => `<div class="item"><span class="nm"><b>${g.name}</b><small>${done[W.meta.day + ':' + g.id] != null ? `Seu melhor hoje: ${done[W.meta.day + ':' + g.id]} · prêmio já ganho` : `Prêmio: até ${fmt(g.prize[1])} ₲`}</small></span><button class="btn g" data-a="fxGame" data-g="${g.id}" type="button">Jogar</button></div>`).join('')}
      <div class="item"><span class="nm"><b>Barraca de comidinhas e lembranças</b><small>Só hoje!</small></span><button class="btn" data-a="fxShop" type="button">Ver</button></div></div>`;
  }
  // ---------- minijogos ----------
  let mini = null;
  function startMini(gid) {
    const f = festOn(); if (!f) return;
    const g = (FEST_GAMES[f.id] || []).find(x => x.id === gid); if (!g) return;
    const ctrl = g.type === 'mira' ? '<button class="btn g" data-a="fxHit" type="button" style="font-size:18px;padding:10px 26px">Agora!</button>' : `<p style="text-align:center;font-size:13px">${g.hint ? g.hint + ' ' : ''}Arraste o dedo no quadro para mexer a cesta.</p>`;
    openPanel(`<h2>${g.name}</h2><canvas id="minicv" width="160" height="110" style="width:100%;max-width:min(420px,62vh);image-rendering:pixelated;touch-action:none;display:block;margin:0 auto;border-radius:6px;border:2px solid #6b3410"></canvas><p id="minitxt" style="text-align:center;font-size:15px"></p><div class="row">${ctrl}</div>`, 'mini');
    mini = { g, f, t: g.type === 'pegar' ? 30 : 0, score: 0, tries: 0, x: 80, tx: 80, items: [], spawn: 0, m: 0, dir: 1, zone: 0.3 + Math.random() * 0.4, last: performance.now(), over: false };
    const cv = document.getElementById('minicv');
    const setX = e => { const r = cv.getBoundingClientRect(); mini.tx = clamp((e.clientX - r.left) / r.width * 160, 10, 150); };
    cv.addEventListener('pointerdown', e => { setX(e); cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', e => { if (e.buttons || e.pointerType === 'touch') setX(e); });
    requestAnimationFrame(miniLoop);
  }
  function miniHit() {
    const M = mini; if (!M || M.over || M.g.type !== 'mira') return;
    const d = Math.abs(M.m - M.zone), hit = d < 0.07;
    M.tries++; if (hit) { M.score += d < 0.025 ? 2 : 1; sfx.coin(); } else sfx.no();
    M.flash = hit ? 0.4 : -0.4; M.zone = 0.15 + Math.random() * 0.7;
    if (M.tries >= 5) miniEnd();
  }
  function miniEnd() {
    const M = mini; if (!M || M.over) return; M.over = true;
    const key = W.meta.day + ':' + M.g.id, fx = P.flags.fx || (P.flags.fx = {}), first = fx[key] == null;
    const [goal, max] = M.g.prize, prize = first ? Math.round(max * Math.min(1, M.score / goal)) : 0;
    fx[key] = Math.max(fx[key] || 0, M.score);
    for (const k of Object.keys(fx)) if (+k.split(':')[0] < W.meta.day - 3) delete fx[k];
    if (prize) earn(prize);
    dirty(); sfx.level();
    const txt = document.getElementById('minitxt');
    if (txt) txt.innerHTML = `<b>Fim! Pontos: ${M.score}.</b> ${first ? (prize ? `Prêmio: ${fmt(prize)} ₲` : 'Sem prêmio desta vez.') : 'O prêmio de hoje já foi ganho, mas valeu a diversão!'}`;
    const row = document.querySelector('.win .row'); if (row) row.innerHTML = `<button class="btn" data-a="fxGame" data-g="${M.g.id}" type="button">Jogar de novo</button><button class="btn g" data-a="fxBack" type="button">Voltar à barraca</button>`;
  }
  function miniLoop() {
    const M = mini, cv = document.getElementById('minicv');
    if (!M || !cv) { mini = null; return; }
    const now = performance.now(), dt = Math.min(0.05, (now - M.last) / 1000); M.last = now;
    const c = cv.getContext('2d'), saved = ctx; ctx = c;
    const bg = { luau: '#f4d8a0', aguasvivas: '#1a2a4a', espiritos: '#2a1a2a', gelo: '#dceef8', estrela: '#1e2a40' }[M.f.id] || '#a8d870';
    R(0, 0, 160, 110, bg);
    if (M.g.type === 'pegar') {
      if (!M.over) {
        M.t -= dt; M.spawn -= dt; M.x += (M.tx - M.x) * Math.min(1, dt * 12);
        if (M.spawn <= 0) { M.spawn = Math.max(0.35, 0.8 - (30 - M.t) * 0.012); M.items.push({ x: 10 + Math.random() * 140, y: -6, v: 38 + (30 - M.t) * 2.2, bad: !!M.g.bad && Math.random() < 0.25 }); }
        for (const it of M.items) { it.y += it.v * dt; if (!it.done && it.y >= 92 && it.y <= 102 && Math.abs(it.x - M.x) < 15) { it.done = true; if (it.bad) { M.score = Math.max(0, M.score - 2); sfx.hurt(); } else { M.score++; sfx.pop(); } } }
        M.items = M.items.filter(it => !it.done && it.y < 115);
        if (M.t <= 0) miniEnd();
      }
      for (const it of M.items) { if (it.bad) { R(it.x - 4, it.y - 2, 8, 5, M.g.bad); R(it.x - 6, it.y - 3, 2, 2, M.g.bad); R(it.x + 4, it.y - 3, 2, 2, M.g.bad); } else { oval(it.x, it.y, 4, 4, M.g.good); R(it.x - 2, it.y - 2, 1, 1, '#ffffff'); } }
      R(M.x - 13, 96, 26, 8, '#8a5a2a'); R(M.x - 13, 96, 26, 2, '#c88a4a'); R(M.x - 11, 100, 22, 1, '#5a3a1a');
      const tt = document.getElementById('minitxt'); if (tt && !M.over) tt.textContent = `Pontos: ${M.score} · ${Math.ceil(M.t)} s`;
    } else {
      if (!M.over) { M.m += M.dir * dt * (0.7 + M.tries * 0.12); if (M.m > 1) { M.m = 1; M.dir = -1; } if (M.m < 0) { M.m = 0; M.dir = 1; } }
      R(10, 48, 140, 14, '#3b1d0a'); R(12, 50, 136, 10, '#e8d8b0');
      R(12 + (M.zone - 0.07) * 136, 50, 0.14 * 136, 10, '#5ad84a'); R(12 + (M.zone - 0.025) * 136, 50, 0.05 * 136, 10, '#f4c83a');
      R(12 + M.m * 136 - 1, 44, 3, 22, '#e8402a');
      if (M.flash) { R(0, 0, 160, 6, M.flash > 0 ? '#5ad84a' : '#e8402a'); M.flash = M.flash > 0 ? Math.max(0, M.flash - dt) : Math.min(0, M.flash + dt); }
      const tt = document.getElementById('minitxt'); if (tt && !M.over) tt.textContent = `Aperte quando a linha vermelha estiver em ${M.g.zone} (verde; dourado vale 2). Pontos: ${M.score} · ${5 - M.tries} tentativas`;
    }
    ctx = saved;
    requestAnimationFrame(miniLoop);
  }
  function openFestShop() {
    const f = festOn(); if (!f) return;
    SHOP_INFO.festa.title = 'Barraca da ' + f.name;
    openShop('festa');
  }
  // decoração extra do luau: tochas tiki e fogueira perto da barraca
  function luauDecor(m, ents, t) {
    const f = festOn(); if (!f || f.id !== 'luau' || m.id !== 'town') return;
    for (const [x, y] of [[16, 14], [22, 14], [16, 11], [22, 11]]) ents.push({ y: y * T + 15, f: () => { R(x * T + 7, y * T - 6, 2, 20, '#7a4a22'); R(x * T + 5, y * T - 9, 6, 4, '#a86a32'); disc(x * T + 8, y * T - 12 + Math.sin(t * 9 + x) * 0.6, 3, '#ff8a1a'); R(x * T + 7, y * T - 13, 2, 2, '#ffe04a'); } });
    ents.push({ y: 15 * T + 12, f: () => { const fx = 14 * T + 8, fy = 15 * T + 8; for (const [dx, dy] of [[-6, 2], [5, 2], [-3, 4], [2, 4]]) R(fx + dx, fy + dy, 5, 2, '#6a3a1a'); for (let k = 0; k < 3; k++) disc(fx + (k - 1) * 3, fy - 2 - Math.abs(Math.sin(t * 7 + k)) * 3, 3 - k * 0.5, k === 1 ? '#ffd040' : '#ff7a1a'); } });
  }
  function luauLights(m, light) { const f = festOn(); if (!f || f.id !== 'luau' || m.id !== 'town') return; for (const [x, y] of [[16, 14], [22, 14], [16, 11], [22, 11]]) light(x * T + 8, y * T - 10, 34, 0.5); light(14 * T + 8, 15 * T + 6, 50, 0.6); }

  // ---------- ícones novos ----------
  function paintIcon5(id) {
    const r = ROUPAS[id];
    if (r) {
      const c = { chapeupalha: '#e8c860', capacete: '#e8b020', chapeupesca: '#5a7a4a', macacao: '#3a5aa8', avental: '#f4f0e8', colete: '#6a8a4a', cachecol: '#d84a3a', luvasjardim: '#5aa83a', luvascouro: '#8a5a2a', galochas: '#f4c020', botastrilha: '#7a5a3a', coroaflores: '#5aa83a', colarhavaiano: '#ff6aa8', mascara: '#f08a2a', gorro: '#4a8ad8' }[id];
      if (r.slot === 'hd') {
        if (id === 'coroaflores') { ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(8, 9, 6, 3, 0, 0, TAU); ctx.stroke(); for (const [x, y, k] of [[3, 8, '#ff8ac8'], [8, 6, '#f4c83a'], [13, 8, '#ffffff'], [6, 11, '#ff6a6a'], [11, 11, '#c86ae8']]) disc(x, y, 1.8, k); return true; }
        if (id === 'mascara') { disc(8, 9, 6, c); R(5, 7, 2, 2, '#1a1a1a'); R(9, 7, 2, 2, '#1a1a1a'); R(5, 11, 6, 1, '#1a1a1a'); R(7, 2, 2, 2, '#3a7a2a'); return true; }
        oval(8, 11, 7, 2.5, shade(c, -0.2)); oval(8, 8, 4.5, 4, c); R(5, 6, 3, 1, shade(c, 0.4));
        if (id === 'capacete') { disc(8, 7, 2, '#fff6a0'); R(7, 6, 1, 1, '#ffffff'); }
        if (id === 'gorro') { disc(8, 3, 2, '#ffffff'); R(3, 10, 10, 2, '#ffffff'); }
        if (id === 'chapeupalha') R(3, 10, 10, 1, '#c84a3a');
        return true;
      }
      if (r.slot === 'cp') {
        if (id === 'cachecol') { R(3, 4, 10, 4, c); R(9, 7, 4, 8, c); for (const y of [5, 10, 13]) R(9, y, 4, 1, '#ffffff'); return true; }
        if (id === 'colarhavaiano') { for (let a = 0; a < 10; a++) disc(8 + Math.cos(a / 10 * TAU) * 5, 8 + Math.sin(a / 10 * TAU) * 4, 1.8, a % 2 ? '#ff6aa8' : '#ffd040'); return true; }
        poly([[4, 3], [12, 3], [14, 7], [12, 8], [12, 15], [4, 15], [4, 8], [2, 7]], c); R(6, 3, 4, 2, shade(c, -0.25)); R(5, 6, 1, 8, shade(c, 0.3));
        if (id === 'avental') { R(5, 8, 6, 4, '#e8d8c8'); R(7, 9, 2, 2, '#d84a6a'); }
        if (id === 'colete') { for (const [x, y] of [[5, 8], [10, 8], [5, 11], [10, 11]]) R(x, y, 2, 2, '#4a6a3a'); }
        if (id === 'macacao') { R(5, 4, 1, 4, '#f4c020'); R(10, 4, 1, 4, '#f4c020'); }
        return true;
      }
      if (r.slot === 'mao') { for (const ox of [0, 7]) { R(2 + ox, 6, 5, 8, c); R(2 + ox, 3, 1, 4, c); R(3 + ox, 2, 1, 5, c); R(4 + ox, 2, 1, 5, c); R(5 + ox, 3, 1, 4, c); R(2 + ox, 12, 5, 2, shade(c, -0.3)); } return true; }
      if (r.slot === 'bt') { for (const ox of [0, 6]) { R(2 + ox, 3, 4, 8, c); R(3 + ox, 3, 2, 7, shade(c, 0.3)); R(2 + ox, 11, 6, 3, c); R(2 + ox, 13, 6, 1, '#2a1a0a'); } return true; }
    }
    const food = {
      ovochocolate: () => { oval(8, 9, 5, 6, '#6a3a1a'); oval(7, 8, 3, 4, '#8a5a2a'); R(5, 5, 2, 2, '#c88a5a'); R(4, 9, 8, 1, '#f4c83a'); },
      aguacoco: () => { disc(8, 9, 6, '#6a4a2a'); disc(8, 9, 4.5, '#8a6a3a'); R(9, 1, 1, 7, '#f4f4f4'); R(10, 1, 2, 1, '#e8402a'); disc(7, 8, 2, '#f8f4e8'); },
      espetinho: () => { R(2, 13, 12, 1, '#c8a06a'); for (const x of [4, 7, 10]) { oval(x + 1, 11, 2, 2.5, '#d8803a'); R(x, 10, 1, 1, '#f4c070'); } },
      pipoca: () => { poly([[4, 6], [12, 6], [11, 15], [5, 15]], '#e8402a'); R(6, 6, 2, 9, '#ffffff'); R(10, 6, 1, 9, '#ffffff'); for (const [x, y] of [[5, 4], [8, 3], [11, 4], [7, 5], [10, 5]]) disc(x, y, 2, '#fff8d8'); },
      algodaodoce: () => { R(7, 9, 2, 6, '#e8d8b0'); disc(8, 6, 5, '#ffa8d8'); disc(6, 5, 2, '#ffd0ec'); },
      docesabobora: () => { R(3, 9, 10, 5, '#e8e0d0'); oval(8, 9, 5, 2.5, '#f08a2a'); R(6, 8, 2, 1, '#ffc070'); },
      chocolatequente: () => { R(4, 6, 8, 8, '#f4f0e8'); R(12, 8, 2, 4, '#f4f0e8'); R(5, 6, 6, 2, '#6a3a1a'); R(6, 2, 1, 3, '#ffffffaa'); R(9, 3, 1, 2, '#ffffffaa'); },
      rabanada: () => { poly([[2, 10], [8, 6], [14, 10], [8, 14]], '#d8a050'); poly([[4, 10], [8, 8], [12, 10], [8, 12]], '#e8c070'); for (const [x, y] of [[6, 9], [9, 10], [8, 11]]) R(x, y, 1, 1, '#ffffff'); },
    }[id];
    if (food) { food(); return true; }
    return false;
  }
