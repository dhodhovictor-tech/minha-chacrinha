  // ================= lojas e moradores novos da vila =================
  // Padaria (Dona Glória), Floricultura (Vó Nena), Clínica (Doutor Davi), Pet shop (Tati), Biblioteca (Professora Helena) e o carteiro Seu Juca.

  // ---------- moradores novos ----------
  Object.assign(NPCS, {
    gloria: { name: 'Dona Glória', role: 'padeira', look: { hair: 1, style: 2, shirt: 0, skin: 2, pants: '#6a4a3a', apron: '#f4f0e8' }, bday: ['spring', 18],
      loves: ['trigo', 'leite', 'ovo', 'mel', 'cafereforcado'], likes: ['*food', '*fruit', 'acucar'], hates: ['gosma', 'asamorcego'], shop: 'padaria', hours: [420, 900],
      lines: ['Pão quentinho saindo agora!', 'Acordo às 4h todo dia. O forno não espera ninguém.', 'O segredo do pão de queijo? Paciência e queijo bom.', 'Quem toma café da manhã direito trabalha melhor.', 'Hoje tem bolo de cenoura com cobertura de chocolate!'],
      hi: ['Separei o pão mais bonito pra vocês.', 'Vocês são meus fregueses preferidos. Não conta pros outros!'],
      season: ['Primavera: hora do bolo de morango.', 'No verão o pão cresce rapidinho com o calor.', 'Outono pede um bolo de abóbora.', 'Inverno é tempo de chocolate quente com rabanada.'],
      sched: [[360, null], [420, 'padaria', 6, 2, 1], [900, 'town', 36, 25, 1], [1080, 'bar', 12, 6, 2], [1260, null]] },
    helena: { name: 'Professora Helena', role: 'bibliotecária', look: { hair: 0, style: 1, shirt: 5, skin: 0, pants: '#3a3a5a', glasses: true }, bday: ['fall', 21],
      loves: ['tortamirtilo', 'cafereforcado', 'rosafada', 'ametista'], likes: ['*fruit', '*art', 'narciso'], hates: ['gosma', 'peixepedra'], shop: 'biblioteca', hours: [600, 1080],
      lines: ['Silêncio na biblioteca, mas pode falar baixinho comigo.', 'Todo livro é uma janela. Escolha a sua!', 'Ensinei metade da vila a ler. A outra metade fugia da aula.', 'Estou escrevendo a história da vila. Vocês vão aparecer nela.', 'Um capítulo por noite antes de dormir. É a regra.'],
      hi: ['Guardei um livro novo pensando em vocês.', 'Vocês leem juntos à noite? Que coisa mais linda.'],
      season: ['Primavera: livros de jardinagem esgotam.', 'Verão é para ler na beira do rio.', 'No outono, a biblioteca fica mais cheia.', 'Inverno, cobertor e um bom romance.'],
      sched: [[360, 'lar_helena', 4, 4, 1], [540, 'town', 42, 24, 1], [600, 'biblioteca', 6, 2, 1], [1080, 'town', 26, 48, 1], [1200, 'lar_helena', 5, 4, 1], [1380, null]],
      schedSun: [[360, 'lar_helena', 4, 4, 1], [540, 'town', 72, 23, 1], [900, 'biblioteca', 6, 2, 1], [1080, 'lar_helena', 5, 4, 1], [1380, null]] },
    tati: { name: 'Tati', role: 'dona do pet shop', look: { hair: 6, style: 1, shirt: 1, skin: 3, pants: '#4a6a8a', apron: '#5ab8e8' }, bday: ['summer', 7],
      loves: ['petisco', 'sardinha', 'morango', 'sorvete'], likes: ['*fish', '*fruit', 'pena'], hates: ['gosma', 'asamorcego'], shop: 'petshop', hours: [540, 1020],
      lines: ['Como está o Darth? Manda um beijo pra ele!', 'Gato preto dá sorte, viu? Não acredite no contrário.', 'Ração premium deixa o pelo brilhando.', 'Um dia ainda abro um abrigo de bichinhos na vila.', 'Já pensou numa coleira com sininho pro Darth?'],
      hi: ['O Darth é o gato mais fofo da vila. Empate com nenhum.', 'Vocês cuidam tão bem do Darth...'],
      season: ['Primavera: época de filhotinhos!', 'No verão, água fresquinha pros bichos.', 'Outono: hora de escovar o pelo.', 'Inverno: caminha quentinha pro Darth!'],
      sched: [[360, null], [480, 'town', 21, 16, 1], [540, 'petshop', 6, 2, 1], [1020, 'town', 30, 47, 1], [1140, 'bar', 10, 4, 1], [1320, null]] },
    juca: { name: 'Seu Juca', role: 'carteiro', look: { hair: 4, shirt: 1, skin: 1, pants: '#3a4a7a', beard: true, apron: '#c8a03a' }, bday: ['winter', 3],
      loves: ['cafereforcado', 'pao', 'queijo', 'vinho:uva'], likes: ['*food', '*art'], hates: ['gosma'],
      lines: ['Carta pra vocês? Hoje não, mas amanhã quem sabe!', 'Conheço cada porta dessa vila.', 'Trinta anos de carteiro e nunca perdi uma carta. Bom, quase nunca.', 'O correio mais bonito do mundo é o de vocês.', 'Andar faz bem. Ando uns dez quilômetros por dia!'],
      hi: ['Vocês recebem as cartinhas mais lindas da vila.', 'Fico feliz de entregar coisas boas pra vocês.'],
      season: ['Primavera: muita carta de amor por aí.', 'Verão: carta da praia e cartão-postal.', 'Outono: convites de festa!', 'No inverno o correio dobra. Todo mundo manda presente.'],
      sched: [[360, 'lar_juca', 4, 4, 1], [480, 'town', 60, 37, 1], [540, 'town', 8, 26, 1], [600, 'farm', 14, 8, 1], [660, 'town', 20, 16, 1], [720, 'town', 55, 16, 1], [810, 'town', 38, 25, 1], [960, 'town', 45, 46, 1], [1080, 'bar', 3, 5, 1], [1260, 'lar_juca', 5, 4, 1], [1380, null]],
      schedRain: [[360, 'lar_juca', 4, 4, 1], [540, 'town', 8, 26, 1], [600, 'farm', 14, 8, 1], [660, 'town', 55, 16, 1], [780, 'bar', 3, 5, 1], [1260, 'lar_juca', 5, 4, 1], [1380, null]] },
  });
  // a Vó Nena cuida da floricultura e o Doutor Davi atende na clínica
  Object.assign(NPCS.nena, { shop: 'flores', hours: [540, 1020],
    sched: [[360, 'lar_nena', 4, 4, 1], [540, 'flores', 6, 2, 1], [1020, 'town', 34, 24, 1], [1140, 'lar_nena', 5, 4, 1], [1320, null]],
    schedRain: [[360, 'lar_nena', 4, 4, 1], [540, 'flores', 6, 2, 1], [1020, 'lar_nena', 5, 4, 1], [1320, null]] });
  Object.assign(NPCS.davi, { shop: 'clinica', hours: [540, 900],
    sched: [[360, 'lar_davi', 4, 4, 1], [540, 'clinica', 6, 2, 1], [900, 'town', 41, 36, 1], [1080, 'bar', 6, 6, 2], [1260, 'lar_davi', 5, 4, 1], [1380, null]],
    schedRain: [[360, 'lar_davi', 4, 4, 1], [540, 'clinica', 6, 2, 1], [1080, 'bar', 6, 6, 2], [1260, 'lar_davi', 5, 4, 1], [1380, null]] });

  // ---------- produtos ----------
  Object.assign(ITEMS, {
    paoqueijo: { name: 'Pão de queijo', cat: 'food', sell: 30, energy: 60, buff: { speed: 1 }, desc: 'Dá Velocidade +1 por um tempo.' },
    cafecoado: { name: 'Café coado', cat: 'food', sell: 40, energy: 45, drink: true, buff: { speed: 1 }, desc: 'Dá Velocidade +1 por um tempo.' },
    bolocenoura: { name: 'Bolo de cenoura', cat: 'food', sell: 120, energy: 140, buff: { farming: 1 }, desc: 'Com cobertura de chocolate. Dá Lavoura +1.' },
    sonho: { name: 'Sonho', cat: 'food', sell: 90, energy: 100, buff: { luck: 1 }, desc: 'Recheado de creme. Dá Sorte +1.' },
    broa: { name: 'Broa de milho', cat: 'food', sell: 60, energy: 80, buff: { foraging: 1 }, desc: 'Dá Coleta +1 por um tempo.' },
    cestacafe: { name: 'Cesta de café da manhã', cat: 'food', sell: 300, energy: 260, buff: { farming: 1, fishing: 1, mining: 1 }, desc: 'Para começar o dia: Lavoura, Pesca e Mineração +1.' },
    buque: { name: 'Buquê de flores', cat: 'art', sell: 200, desc: 'Todo mundo na vila ama receber.' },
    vasoflores: { name: 'Vaso de flores', cat: 'place', desc: 'Enfeite para a chacrinha.' },
    bancojardim: { name: 'Banco de jardim', cat: 'place', desc: 'Enfeite para a chacrinha. Dá para sentar e descansar.' },
    arcoflores: { name: 'Arco de flores', cat: 'place', desc: 'Enfeite romântico para a chacrinha.' },
    curativo: { name: 'Curativo', cat: 'food', sell: 40, energy: 5, hp: 40, desc: 'Recupera 40 de vida.' },
    xaropeenergia: { name: 'Xarope de energia', cat: 'food', sell: 100, energy: 120, drink: true, desc: 'Recupera bastante energia.' },
    vitamina: { name: 'Vitamina do doutor', cat: 'food', sell: 120, energy: 40, hp: 20, buff: { defense: 1 }, drink: true, desc: 'Dá Defesa +1 e recupera vida.' },
    racaopremium: { name: 'Ração premium', cat: 'animal', sell: 40, desc: 'O Darth adora: vale o dobro de carinho de um petisco.' },
    coleiravermelha: { name: 'Coleira vermelha', cat: 'acessorio', sell: 100, desc: 'Segure e toque no Darth para colocar ou tirar.', col: '#d8302a' },
    coleiraazul: { name: 'Coleira azul', cat: 'acessorio', sell: 100, desc: 'Segure e toque no Darth para colocar ou tirar.', col: '#2a6ad8' },
    coleiralaco: { name: 'Lacinho rosa', cat: 'acessorio', sell: 150, desc: 'Segure e toque no Darth para colocar ou tirar.', col: '#ff6aa8' },
    livropesca: { name: 'Manual do Pescador', cat: 'livro', sell: 500, desc: 'Segure e toque em Usar para ler: a barra da pesca fica 5% maior para sempre.' },
    livrohorta: { name: 'Hortas Felizes', cat: 'livro', sell: 500, desc: 'Segure e toque em Usar para ler: colheitas um pouco melhores para sempre.' },
    livromina: { name: 'Guia da Mina', cat: 'livro', sell: 500, desc: 'Segure e toque em Usar para ler: +1 de defesa para sempre.' },
    livrolenha: { name: 'Diário do Lenhador', cat: 'livro', sell: 500, desc: 'Segure e toque em Usar para ler: cortar árvores gasta 5% menos energia para sempre.' },
    livroreceitas: { name: 'Receitas da Vó', cat: 'livro', sell: 400, desc: 'Segure e toque em Usar para ler: aprende 3 receitas novas.' },
    livroinsetos: { name: 'Atlas das Borboletas', cat: 'livro', sell: 400, desc: 'Segure e toque em Usar para ler: aparecem mais bichinhos para a rede.' },
  });
  UNIVERSAL.loves.push('buque');
  PLACED.push('vasoflores', 'bancojardim', 'arcoflores'); for (const k of ['vasoflores', 'bancojardim', 'arcoflores']) SOLID_OBJ.add(k);
  Object.assign(MOVEIS, {
    caminhagato: { name: 'Caminha do Darth', pet: true, w: 1, h: 1, gold: 800, need: {}, desc: 'Fofinha, do tamanho de um gato.' },
    arranhador: { name: 'Arranhador', pet: true, w: 1, h: 1, gold: 1200, need: {}, desc: 'Torre com casinha para o Darth.' },
  });
  for (const k of ['caminhagato', 'arranhador']) ITEMS[k] = { name: MOVEIS[k].name, cat: 'movel', sell: Math.round(MOVEIS[k].gold / 3), desc: MOVEIS[k].desc + ' Segure dentro de casa e toque no chão para colocar.' };
  const livro = id => !!(P && P.flags && P.flags.livros && P.flags.livros[id]);
  function lerLivro(s) {
    const id = s.id; if (livro(id)) { toast('Você já leu esse livro. Dá para vender ou dar de presente.', '', null, 'livro'); return; }
    P.flags.livros = { ...(P.flags.livros || {}), [id]: W.meta.day };
    useHeld(1); sfx.level();
    if (id === 'livroreceitas') {
      const novas = COOK.filter(r => !P.recipes.includes(r.id) && String(r.learn || '').startsWith('npc:')).slice(0, 3);
      for (const r of novas) P.recipes.push(r.id);
      toast(novas.length ? `Você aprendeu: ${novas.map(r => r.name).join(', ')}!` : 'Você já sabia todas essas receitas!', 'big', null, 'livro');
    } else toast(`Você leu ${item(id).name}! ${item(id).desc.split(': ')[1] || ''}`, 'big', null, 'livro');
    dirty();
  }

  // ---------- as lojas na vila ----------
  const LOJAS3 = [['padaria', 'gloria', 'Padaria da Glória', G.WOOD], ['flores', 'nena', 'Floricultura da Vó Nena', G.WOOD], ['petshop', 'tati', 'Pet Shop da Tati', G.TILE], ['clinica', 'davi', 'Clínica do Doutor Davi', G.TILE], ['biblioteca', 'helena', 'Biblioteca da Vila', G.WOOD]];
  for (const [k, who, nome, piso] of LOJAS3) {
    const p = VILA[k], top = p[1] + p[3] < VILA.ruaN ? VILA.ruaN - 1 : VILA.rua - 1;
    predio(MAPS.town, k, p, k, top);
    const m = shopRoom(k, nome, 12, 9, piso, who, () => {});
    for (const [x, y] of [[1, 2], [10, 2], [1, 5], [10, 5], [9, 2]]) m.solid[y * m.w + x] = 1;
    m.warps.push({ x: 6, y: 8, to: 'town', tx: p[4], ty: p[1] + p[3], dir: 1 });
    MAPS[k] = finalize(m);
  }
  PLACAS.push(['padaria', 'Padaria', 'gloria'], ['flores', 'Floricultura', 'nena'], ['petshop', 'Pet Shop', 'tati'], ['clinica', 'Clínica', 'davi'], ['biblioteca', 'Biblioteca', 'helena']);
  MAPA_ROTULOS.push(['padaria', 'Padaria'], ['flores', 'Flores'], ['petshop', 'Pet shop'], ['clinica', 'Clínica'], ['biblioteca', 'Biblioteca']);
  Object.assign(SHOP_INFO, {
    gloria: { title: 'Padaria da Glória', tabs: [['buy', 'Comprar'], ['sell', 'Vender']], greet: () => '“Bom dia! Pão quentinho e café passado agorinha.”' },
    nena: { title: 'Floricultura da Vó Nena', tabs: [['buy', 'Comprar'], ['sell', 'Vender']], greet: () => '“Flor é carinho que a gente planta, minha filha.”' },
    tati: { title: 'Pet Shop da Tati', tabs: [['buy', 'Comprar'], ['sell', 'Vender']], greet: () => '“Oi! Como está o Darth hoje?”' },
    davi: { title: 'Clínica do Doutor Davi', tabs: [['consulta', 'Consulta'], ['buy', 'Remédios']], greet: () => '“Vamos ver como está essa saúde.”' },
    helena: { title: 'Biblioteca da Vila', tabs: [['buy', 'Livros']], greet: () => '“Cada livro ensina algo para a vida toda.”' },
  });
  const LOJA3_ITENS = {
    gloria: [['pao', 120], ['paoqueijo', 80], ['cafecoado', 90], ['broa', 140], ['sonho', 200], ['bolocenoura', 280], ['cestacafe', 650]],
    nena: () => [...Object.entries(CROPS).filter(([k, c]) => c.cat === 'flower' && c.seasons.includes(season())).map(([k, c]) => ['s_' + k, Math.round(c.seed * 1.1)]), ['buque', 600], ['vasoflores', 900], ['bancojardim', 1800], ['arcoflores', 3500]],
    tati: [['petisco', 30], ['racaopremium', 120], ['coleiravermelha', 600], ['coleiraazul', 600], ['coleiralaco', 900], ['caminhagato', 800], ['arranhador', 1200]],
    davi: [['curativo', 150], ['xaropeenergia', 300], ['vitamina', 450]],
    helena: [['livroreceitas', 2500], ['livroinsetos', 2000], ['livropesca', 3000], ['livrohorta', 3000], ['livromina', 3000], ['livrolenha', 3000]],
  };
  const LOJA3_UMA = new Set(['coleiravermelha', 'coleiraazul', 'coleiralaco', 'livropesca', 'livrohorta', 'livromina', 'livrolenha', 'livroreceitas', 'livroinsetos']);
  function lojaList(who) {
    let l = LOJA3_ITENS[who]; if (!l) return null; if (typeof l === 'function') l = l();
    return l.map(([id, price]) => ({ id, price, one: LOJA3_UMA.has(id) || (id.startsWith('livro') && livro(id)) }));
  }
  function consultaHTML() {
    const pr = 200;
    return `<p style="text-align:center">“Deita aqui que eu dou uma olhada.” A consulta cura toda a vida e devolve um pouco de energia.</p>
      <div class="item"><span class="nm"><b>Consulta</b><small>Vida ${Math.round(P.hp)}/100 · energia +30</small></span><span class="price">${pr} ₲</span><button class="btn g" data-a="consulta" type="button" ${gold() >= pr && P.hp < 100 ? '' : 'disabled'}>Consultar</button></div>`;
  }
  function loja3Action(a) {
    if (a !== 'consulta') return false;
    if (spend(200)) { P.hp = 100; P.energy = Math.min(P.maxEnergy, P.energy + 30); dirty(); sfx.level(); toast('“Pronto! Novinho em folha.” Vida cheia.', 'big', null, 'clinica'); }
    renderShop(panelArg); return true;
  }

  // ---------- coleira do Darth ----------
  function coleiraDarth() {
    const s = held(); if (!s || !ITEMS[s.id] || !ITEMS[s.id].col || !P.pet) return false;
    P.pet.coleira = P.pet.coleira === s.id ? null : s.id; dirty(); meow(); catReact(petSt);
    toast(P.pet.coleira ? `Darth está de ${item(s.id).name.toLowerCase()}! Que charme.` : 'Você tirou a coleira do Darth.', 'big', null, 'darth');
    return true;
  }
  const coleiraCol = id => (id && ITEMS[id] && ITEMS[id].col) || '';

  // ---------- enfeites de jardim na chacrinha ----------
  function drawObj6(o, px, py) {
    const t = performance.now() / 1000;
    if (o.k === 'vasoflores') { shadowAt(px + 8, py + 14, 6, 2); R(px + 3, py + 7, 10, 8, '#b85a3a'); R(px + 3, py + 7, 10, 2, '#d8805a'); for (const [dx, dy, c] of [[-3, 0, '#ff6aa8'], [3, -1, '#f4c83a'], [0, -3, '#ffffff'], [-1, 2, '#c86ad8'], [3, 2, '#ff8a4a']]) { disc(px + 8 + dx, py + 5 + dy, 2, c); R(px + 8 + dx, py + 5 + dy, 1, 1, '#ffe080'); } return true; }
    if (o.k === 'bancojardim') { shadowAt(px + 8, py + 14, 9, 2); R(px - 2, py + 2, 20, 4, '#a86a3a'); R(px - 2, py + 2, 20, 1, '#c88a5a'); R(px - 2, py + 7, 20, 3, '#a86a3a'); R(px - 1, py + 10, 2, 5, '#3a3a3a'); R(px + 15, py + 10, 2, 5, '#3a3a3a'); return true; }
    if (o.k === 'arcoflores') { shadowAt(px + 8, py + 14, 9, 2); R(px - 2, py - 18, 3, 33, '#f4f0e8'); R(px + 15, py - 18, 3, 33, '#f4f0e8'); ctx.strokeStyle = '#f4f0e8'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(px + 8, py - 18, 9, Math.PI, 0); ctx.stroke(); for (let k = 0; k < 11; k++) { const a = Math.PI + k / 10 * Math.PI; disc(px + 8 + Math.cos(a) * 9, py - 18 + Math.sin(a) * 9, 2, k % 2 ? '#ff6aa8' : '#ffffff'); } for (let k = 0; k < 5; k++) { disc(px - 1, py - 14 + k * 6, 1.8, '#ff6aa8'); disc(px + 17, py - 12 + k * 6, 1.8, '#ffffff'); } return true; }
    return false;
  }
  // sentar no banco do jardim: descansa um pouco
  function bancoAct(m, tx, ty) {
    if (m.id !== 'farm') return false; const tl = tile(tx + ',' + ty); if (!tl || !tl.o || tl.o.k !== 'bancojardim') return false;
    const s = held(); if (s && item(s.id).cat === 'tool') return false;
    const d = W.meta.day, f = P.flags; if (f.bancoD === d) { toast('Você já descansou no banco hoje.', '', null, 'banco'); return true; }
    f.bancoD = d; P.energy = Math.min(P.maxEnergy, P.energy + 15); dirty(); sfx.pop(); toast('Você senta um pouquinho no banco do jardim. +15 de energia.', '', null, 'banco'); return true;
  }

  // ---------- desenho dos prédios ----------
  function lojaFrente(type, w, h, night, snow) {
    const S = {
      padaria: { wall: '#f4e4c4', line: '#e0cc9c', roof: '#a8542a', toldo: ['#e8862a', '#fff4e0'], door: '#7a4a24' },
      flores: { wall: '#f4f8ec', line: '#dce8cc', roof: '#4a9a5a', toldo: ['#5ab86a', '#ffffff'], door: '#3a7a4a' },
      petshop: { wall: '#d8eef8', line: '#bcdcec', roof: '#3a7ac8', toldo: ['#5ab8e8', '#ffffff'], door: '#2a5a9a' },
      clinica: { wall: '#f8f8f4', line: '#e0e0dc', roof: '#4a6a9a', toldo: ['#e8402a', '#ffffff'], door: '#5a7a9a' },
      biblioteca: { wall: '#b8584a', line: '#9a463a', roof: '#3a3a4a', toldo: null, door: '#4a2a1a' },
    }[type];
    R(2, 18, w - 4, h - 18, S.wall); for (let yy = 20; yy < h - 6; yy += 6) R(2, yy, w - 4, 1, S.line);
    if (type === 'biblioteca') { for (let yy = 19; yy < h - 6; yy += 5) for (let xx = 2 + ((yy / 5) & 1) * 4; xx < w - 4; xx += 8) R(xx, yy, 7, 4, '#c8685a'); for (const x of [6, w - 12]) { R(x, 20, 6, h - 26, '#e8e0d0'); R(x + 4, 20, 2, h - 26, '#c8c0b0'); } }
    R(2, h - 6, w - 4, 6, '#8a7a6a');
    shingleRoof(-6, -12, w + 12, 32, snow ? '#e8eef4' : S.roof); R(-6, 18, w + 12, 3, shade(S.roof, -0.4));
    if (S.toldo) { for (let k = 0; k < 8; k++) R(3 + k * ((w - 6) / 8), 24, (w - 6) / 8 + 1, 6, S.toldo[k % 2]); for (let k = 0; k < 8; k++) disc(3 + (k + 0.5) * ((w - 6) / 8), 30, (w - 6) / 16, S.toldo[k % 2]); }
    winPx(type === 'biblioteca' ? 14 : 7, 36, 22, 18, true, '#f4e8d0');
    const wx = type === 'biblioteca' ? 14 : 7;
    // vitrine de cada loja
    if (type === 'padaria') { for (let k = 0; k < 3; k++) { oval(wx + 5 + k * 6, 48, 3, 2, '#c8843a'); R(wx + 3 + k * 6, 47, 4, 1, '#e8b060'); } disc(wx + 11, 41, 3, '#f4d8a0'); }
    if (type === 'flores') { for (let k = 0; k < 4; k++) { R(wx + 3 + k * 5, 46, 3, 6, '#7a4a24'); disc(wx + 4 + k * 5, 44, 2.4, ['#ff6aa8', '#f4c83a', '#c86ad8', '#ffffff'][k]); } }
    if (type === 'petshop') { oval(wx + 11, 49, 6, 3, '#e8402a'); oval(wx + 11, 47, 3, 2.5, '#1c1c24'); R(wx + 12, 44, 2, 2, '#1c1c24'); disc(wx + 5, 42, 1.5, '#8a5a2a'); }
    if (type === 'clinica') { R(wx + 9, 39, 4, 12, '#e8402a'); R(wx + 5, 43, 12, 4, '#e8402a'); }
    if (type === 'biblioteca') { for (let k = 0; k < 5; k++) R(wx + 3 + k * 4, 41, 3, 10, ['#c83a3a', '#3a7ad0', '#f4c83a', '#5aa83a', '#b05ae0'][k]); }
    // placa no telhado
    R(w / 2 - 16, -6, 32, 14, '#5a3418'); R(w / 2 - 14, -4, 28, 10, '#f8ecd0');
    const cx = w / 2;
    if (type === 'padaria') { oval(cx, 1, 7, 3, '#c8843a'); R(cx - 5, 0, 10, 1, '#e8b060'); }
    if (type === 'flores') { for (const [dx, c] of [[-6, '#ff6aa8'], [0, '#f4c83a'], [6, '#c86ad8']]) { disc(cx + dx, 0, 2.5, c); R(cx + dx, 2, 1, 3, '#4aa83a'); } }
    if (type === 'petshop') { disc(cx, 2, 3, '#3a7ac8'); for (const [dx, dy] of [[-4, -2], [-1.5, -4], [1.5, -4], [4, -2]]) disc(cx + dx, 2 + dy, 1.4, '#3a7ac8'); }
    if (type === 'clinica') { R(cx - 1.5, -3, 3, 9, '#e8402a'); R(cx - 4.5, 0, 9, 3, '#e8402a'); }
    if (type === 'biblioteca') { R(cx - 7, -2, 6, 8, '#3a7ad0'); R(cx + 1, -2, 6, 8, '#c83a3a'); R(cx - 1, -2, 2, 8, '#5a3418'); }
    doorPx(2 * T + 1, h - 22, S.door);
    if (type === 'flores') for (let k = 0; k < 5; k++) disc(w - 28 + k * 5, h - 9, 2.4, ['#ff6aa8', '#f4c83a', '#ffffff', '#c86ad8', '#ff8a4a'][k]);
  }
  // decoração de dentro de cada loja
  function loja3Ents(m, ents, t) {
    const k = m.id; if (!LOJA3_ITENS[{ padaria: 'gloria', flores: 'nena', petshop: 'tati', clinica: 'davi', biblioteca: 'helena' }[k]]) return;
    ents.push({ y: -998, f: () => {
      if (k === 'padaria') { R(1 * T, 2, 30, 26, '#8a5a3a'); for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) oval(T + 5 + i * 7, 8 + r * 8, 3, 2, ['#c8843a', '#e8b060', '#f4d8a0'][r]); R(9 * T, 0, 30, 28, '#8a8278'); R(9 * T + 4, 8, 22, 14, '#2a1a10'); R(9 * T + 6, 12, 18, 8, Math.sin(t * 6) > 0 ? '#ff7a2a' : '#ffa040'); }
      if (k === 'flores') { for (let i = 0; i < 6; i++) { R(T + i * 6, 14, 5, 10, '#6a8a9a'); for (let j = 0; j < 3; j++) disc(T + 2 + i * 6, 12 - j * 3, 2, ['#ff6aa8', '#f4c83a', '#c86ad8', '#ffffff', '#ff8a4a', '#e8402a'][(i + j) % 6]); } R(9 * T, 6, 30, 3, '#7a4a24'); for (let i = 0; i < 4; i++) { R(9 * T + 2 + i * 7, 9, 1, 6, '#4aa83a'); disc(9 * T + 2 + i * 7, 16, 3, '#c86a3a'); } }
      if (k === 'petshop') { R(T, 4, 30, 22, '#4a8ab8'); R(T + 2, 6, 26, 18, '#8ad8f8'); for (let i = 0; i < 3; i++) { const fx = T + 8 + ((t * 10 + i * 9) % 18); R(fx, 10 + i * 4, 4, 2, ['#f4a03a', '#e8402a', '#f4d84a'][i]); } R(9 * T + 4, 2, 6, 26, '#c8a070'); R(9 * T, 2, 14, 6, '#e8c890'); R(9 * T + 14, 16, 12, 10, '#e8c890'); }
      if (k === 'clinica') { R(T, 4, 26, 24, '#e8e8e4'); R(T + 2, 6, 22, 20, '#ffffff'); R(T + 11, 9, 4, 12, '#e8402a'); R(T + 7, 13, 12, 4, '#e8402a'); R(9 * T, 10, 30, 18, '#d8e8f4'); R(9 * T, 10, 30, 4, '#ffffff'); }
      if (k === 'biblioteca') { for (const bx of [T, 9 * T]) { R(bx, 0, 30, 30, '#5a2a10'); for (let r = 0; r < 3; r++) for (let i = 0; i < 7; i++) R(bx + 2 + i * 4, 3 + r * 9, 3, 7, ['#c83a3a', '#3a7ad0', '#f4c83a', '#5aa83a', '#f4f0e8', '#b05ae0', '#e8862a'][(i + r) % 7]); } }
    } });
    // peças embaixo
    ents.push({ y: 5 * T + 14, f: () => {
      if (k === 'padaria') { R(T, 5 * T, 16, 14, '#c89a6a'); for (let i = 0; i < 3; i++) oval(T + 4 + i * 4, 5 * T + 4, 2, 1.5, '#e8b060'); R(10 * T, 5 * T, 16, 14, '#c89a6a'); oval(10 * T + 8, 5 * T + 4, 6, 3, '#f4f0e8'); oval(10 * T + 8, 5 * T + 2, 5, 2.5, '#e8862a'); }
      if (k === 'flores') { for (const bx of [T, 10 * T]) { R(bx + 2, 5 * T + 6, 12, 9, '#b85a3a'); for (let i = 0; i < 4; i++) disc(bx + 4 + i * 3, 5 * T + 3, 2.4, ['#ff6aa8', '#ffffff', '#f4c83a', '#c86ad8'][i]); } }
      if (k === 'petshop') { oval(T + 8, 5 * T + 10, 7, 4, '#e8402a'); oval(T + 8, 5 * T + 9, 5, 2.5, '#f4c8c8'); R(10 * T + 2, 5 * T + 4, 12, 10, '#8a5a3a'); R(10 * T + 4, 5 * T + 6, 8, 6, '#2a1a10'); }
      if (k === 'clinica') { R(T, 5 * T - 4, 16, 18, '#a8c8e8'); R(T, 5 * T - 4, 16, 5, '#ffffff'); R(10 * T + 3, 5 * T - 6, 10, 20, '#8a8a92'); R(10 * T + 5, 5 * T - 4, 6, 6, '#e8402a'); }
      if (k === 'biblioteca') { R(T + 2, 5 * T + 4, 12, 8, '#7a4a24'); disc(10 * T + 8, 5 * T + 2, 6, '#3a8ad8'); R(10 * T + 4, 5 * T - 1, 5, 3, '#5aa83a'); R(10 * T + 7, 5 * T + 8, 2, 6, '#7a4a24'); }
    } });
  }
  // ícones
  function paintIcon9(id) {
    switch (id) {
      case 'paoqueijo': for (const [x, y] of [[5, 9], [11, 9], [8, 5]]) { disc(x, y, 3.5, '#e8b060'); disc(x - 1, y - 1, 1.5, '#f8d898'); } return true;
      case 'cafecoado': R(4, 6, 8, 8, '#f4f0e8'); R(12, 8, 2, 4, '#f4f0e8'); R(5, 6, 6, 2, '#5a3018'); R(6, 2, 1, 3, '#ffffff99'); R(9, 3, 1, 2, '#ffffff99'); return true;
      case 'bolocenoura': R(2, 8, 12, 6, '#e8862a'); R(2, 6, 12, 3, '#5a2a10'); R(2, 13, 12, 1, '#c86a1a'); for (const x of [4, 8, 11]) R(x, 6, 1, 1, '#f4c83a'); return true;
      case 'sonho': oval(8, 9, 6, 4.5, '#e8a858'); R(3, 8, 10, 2, '#fff4d8'); for (let x = 3; x < 13; x += 2) R(x, 5, 1, 1, '#ffffff'); return true;
      case 'broa': disc(8, 9, 5.5, '#e8c048'); disc(7, 8, 3, '#f4d870'); for (const [x, y] of [[5, 7], [10, 10], [8, 12]]) R(x, y, 1, 1, '#c89a28'); return true;
      case 'cestacafe': R(2, 8, 12, 7, '#b8843a'); for (let x = 3; x < 14; x += 3) R(x, 8, 1, 7, '#8a5a2a'); ctx.strokeStyle = '#8a5a2a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(8, 8, 5, Math.PI, 0); ctx.stroke(); disc(5, 7, 2, '#e8b060'); R(9, 5, 4, 4, '#f4f0e8'); disc(12, 7, 1.5, '#e8402a'); return true;
      case 'buque': poly([[5, 9], [11, 9], [9, 15], [7, 15]], '#f4f0e8'); R(7, 11, 2, 1, '#e8402a'); for (const [x, y, c] of [[5, 6, '#ff6aa8'], [8, 4, '#f4c83a'], [11, 6, '#ffffff'], [7, 8, '#c86ad8'], [10, 8, '#e8402a']]) disc(x, y, 2.2, c); return true;
      case 'vasoflores': case 'bancojardim': case 'arcoflores': { ctx.save(); ctx.translate(id === 'arcoflores' ? 3 : 0, id === 'arcoflores' ? 13 : 0); ctx.scale(id === 'arcoflores' ? 0.6 : 0.8, id === 'arcoflores' ? 0.6 : 0.8); drawObj6({ k: id }, id === 'bancojardim' ? 2 : 2, 0); ctx.restore(); return true; }
      case 'curativo': R(2, 6, 12, 5, '#f4d8b8'); R(6, 6, 4, 5, '#ffffff'); R(7, 8, 2, 1, '#e8a0a0'); return true;
      case 'xaropeenergia': R(5, 4, 6, 11, '#3ab86a'); R(6, 2, 4, 2, '#5a3a2a'); R(6, 7, 4, 4, '#f4f0e8'); R(7, 8, 2, 2, '#e8402a'); return true;
      case 'vitamina': R(5, 4, 6, 11, '#f4a03a'); R(5, 4, 6, 2, '#ffffff'); R(10, 1, 1, 5, '#e8402a'); R(6, 9, 4, 1, '#ffd060'); return true;
      case 'racaopremium': R(3, 4, 10, 11, '#3a7ac8'); R(3, 4, 10, 2, '#5a9ae8'); disc(8, 10, 2.5, '#f4f0e8'); for (const [dx, dy] of [[-2, -2], [0, -3], [2, -2]]) R(8 + dx, 10 + dy - 1, 1, 1, '#f4f0e8'); return true;
      case 'coleiravermelha': case 'coleiraazul': case 'coleiralaco': { const c = ITEMS[id].col; ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(8, 8, 5.5, 4, 0, 0, TAU); ctx.stroke(); disc(8, 13, 2, '#f4c83a'); if (id === 'coleiralaco') { poly([[8, 3], [3, 0], [3, 6]], c); poly([[8, 3], [13, 0], [13, 6]], c); } return true; }
      case 'caminhagato': case 'arranhador': { ctx.save(); ctx.translate(0, 6); ctx.scale(0.55, 0.55); drawMovel(id, 6, 6, 0, false); ctx.restore(); return true; }
    }
    if (id && id.startsWith('livro') && ITEMS[id]) {
      const c = { livropesca: '#3a7ad0', livrohorta: '#5aa83a', livromina: '#7a6a5a', livrolenha: '#a8543a', livroreceitas: '#e8862a', livroinsetos: '#b05ae0' }[id] || '#c83a3a';
      R(3, 2, 10, 13, c); R(3, 2, 2, 13, shade(c, -0.3)); R(6, 4, 6, 1, '#f4f0e8'); R(6, 6, 5, 1, '#f4f0e8'); R(12, 3, 1, 11, '#f4f0e8'); R(6, 10, 4, 3, shade(c, 0.35));
      return true;
    }
    return false;
  }
  // caminha e arranhador do Darth
  function drawMovelPet(id, px, py) {
    if (id === 'caminhagato') { shadowAt(px + 8, py + 13, 7, 2); oval(px + 8, py + 10, 7, 4, '#a83a5a'); oval(px + 8, py + 9, 5, 2.5, '#f4c8d8'); return true; }
    if (id === 'arranhador') { shadowAt(px + 8, py + 14, 7, 2); R(px + 2, py + 10, 12, 4, '#c8a070'); R(px + 6, py - 10, 4, 20, '#d8c098'); for (let y = -8; y < 10; y += 3) R(px + 6, py + y, 4, 1, '#b89868'); R(px + 1, py - 16, 14, 7, '#e8c890'); R(px + 5, py - 14, 6, 4, '#3a2a1a'); return true; }
    return false;
  }

  // ---------- conversas e momentos dos novos moradores ----------
  Object.assign(CONVOS, {
    'gloria|juca': [['juca', 'Bom dia, Dona Glória! Tem pão?'], ['gloria', 'Pra você, sempre o primeiro!']],
    'helena|bia': [['helena', 'Li um livro sobre Monet ontem.'], ['bia', 'Me empresta? Por favor!']],
    'tati|caio': [['caio', 'Tati, posso ter um gato?'], ['tati', 'Pergunta pra sua avó primeiro!']],
    'gloria|lia': [['lia', 'Me vende pão pro lanche?'], ['gloria', 'Separei uma fornada só pra você.']],
    'helena|davi': [['davi', 'Tem livro de medicina novo?'], ['helena', 'Chegou ontem! Guardei pra você.']],
    'juca|cida': [['juca', 'Carta pra senhora, Dona Cida!'], ['cida', 'Ai, é do meu sobrinho!']],
    'tati|nena': [['nena', 'Tati, o gato da vila sumiu?'], ['tati', 'Tá dormindo no coreto, Vó!']],
  });
  Object.assign(MOMENTOS, {
    gloria: [{ h: 4, falas: ['Aprendi a fazer pão com a minha avó, num forno de barro.', 'Até hoje acordo cedinho só pra sentir o cheiro da primeira fornada.'], presente: ['paoqueijo', 6] },
      { h: 8, falas: ['Inventei uma receita pra vocês: a cesta do casal!', 'Tem pão de queijo, bolo e café. Tudo em dobro, claro.'], presente: ['cestacafe', 2] }],
    helena: [{ h: 4, falas: ['Quando cheguei, a biblioteca era um depósito cheio de poeira.', 'Hoje é o meu cantinho favorito no mundo.'], presente: ['livroinsetos', 1] },
      { h: 8, falas: ['Estou escrevendo um capítulo só sobre vocês dois.', 'Chama "O casal da chacrinha". Ainda não tem fim. Que bom.'], presente: ['livroreceitas', 1] }],
    tati: [{ h: 4, falas: ['Achei um gatinho na chuva quando eu era pequena. Foi aí que tudo começou.', 'O Darth me lembra ele. Os mesmos olhos verdes.'], presente: ['racaopremium', 5] },
      { h: 8, falas: ['Fiz um lacinho especial pro Darth, com o nome dele bordado.', 'Ele é parte da família de vocês, e um pouquinho da minha também.'], presente: ['coleiralaco', 1] }],
    juca: [{ h: 4, falas: ['Sabia que eu entrego cartas pra chacrinha desde antes de vocês chegarem?', 'Era tudo mato. Agora dá gosto de passar por lá.'], presente: ['cafereforcado', 2] },
      { h: 8, falas: ['Guardei uma coisa: a primeira cartinha que vocês trocaram passou pela minha mão.', 'Não li, prometo! Mas o envelope tinha um coraçãozinho.'], presente: ['buque', 2] }],
  });
