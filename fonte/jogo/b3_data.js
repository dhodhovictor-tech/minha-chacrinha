
  // ================= carnes =================
  Object.assign(ITEMS, {
    carnebovina: { name: 'Carne bovina', cat: 'animal', sell: 300, col: '#c8423a' },
    carnesuina: { name: 'Carne suína', cat: 'animal', sell: 250, col: '#e88a8a' },
    charque: { name: 'Charque', cat: 'art', sell: 520, energy: 60, col: '#8a3a2a' },
    bacon: { name: 'Bacon', cat: 'art', sell: 450, energy: 60, col: '#d86a5a' },
    defumador: { name: 'Defumador', cat: 'place', desc: 'Carne bovina vira charque e carne suína vira bacon em 8 horas.' },
    frutaestelar: { name: 'Fruta estelar', cat: 'special', sell: 0, energy: 1, desc: 'Uma fruta mágica. Comer aumenta a energia máxima para sempre.' },
  });
  ART_BASE.charque = 'carnebovina'; ART_BASE.bacon = 'carnesuina';
  SEASON_PRICE.carnebovina = [1, 0.95, 0.85, 1.25];
  SEASON_PRICE.carnesuina = [1, 0.95, 0.85, 1.3];
  RECIPES.push({ id: 'defumador', need: { madeira: 40, pedra: 20, carvao: 10 }, skill: ['farming', 4] });
  // quanto de carne cada animal rende no açougue (mais carinho, mais carne)
  const MEAT = { vaca: 'carnebovina', porco: 'carnesuina' };
  const meatAmount = a => 3 + Math.floor((a.fr || 0) / 250);
  const MEAT_COOK = [
    { id: 'churrasco', name: 'Churrasco', need: { carnebovina: 1, pimenta: 1 }, en: 180, sell: 520, learn: 'start', buff: { attack: 2 } },
    { id: 'ovosbacon', name: 'Ovos com bacon', need: { bacon: 1, '*ovo': 1 }, en: 150, sell: 520, learn: 'start', buff: { speed: 1 } },
    { id: 'bife', name: 'Bife acebolado', need: { carnebovina: 1, alhoporo: 1, oleo: 1 }, en: 160, sell: 450, learn: 'npc:marta:3' },
    { id: 'carnepanela', name: 'Carne de panela', need: { carnebovina: 1, batata: 1, inhame: 1 }, en: 220, sell: 600, learn: 'tv', buff: { defense: 2 } },
    { id: 'hamburguercasa', name: 'Hambúrguer caseiro', need: { carnebovina: 1, pao: 1, tomate: 1 }, en: 200, sell: 500, learn: 'lia', price: 1200, buff: { speed: 1 } },
    { id: 'feijoada', name: 'Feijoada', need: { carnesuina: 1, vagem: 1, arroz: 1 }, en: 250, sell: 650, learn: 'npc:nena:5', buff: { farming: 2, maxEnergy: 1 } },
    { id: 'lombo', name: 'Lombo com maçã', need: { carnesuina: 1, maca: 1 }, en: 180, sell: 520, learn: 'tv' },
    { id: 'costelinha', name: 'Costelinha com mel', need: { carnesuina: 1, mel: 1 }, en: 200, sell: 560, learn: 'npc:lia:4', buff: { luck: 1 } },
  ];
  for (const r of MEAT_COOK) { COOK.push(r); ITEMS[r.id] = { name: r.name, cat: 'food', sell: r.sell, energy: r.en, buff: r.buff, desc: r.buff ? 'Dá ' + Object.entries(r.buff).map(([k, v]) => `${BUFF_NAMES[k]} +${v}`).join(', ') + ' por um tempo.' : '' }; }

  // ================= artefatos (escavados nos pontos com minhoquinhas) e museu =================
  Object.assign(ITEMS, {
    pontaflecha: { name: 'Ponta de flecha', cat: 'artifact', sell: 40 },
    osso: { name: 'Osso antigo', cat: 'artifact', sell: 100 },
    moeda: { name: 'Moeda antiga', cat: 'artifact', sell: 120 },
    vaso: { name: 'Vaso quebrado', cat: 'artifact', sell: 60 },
    estatueta: { name: 'Estatueta rara', cat: 'artifact', sell: 250 },
    amonite: { name: 'Fóssil de amonite', cat: 'artifact', sell: 200 },
    boneca: { name: 'Boneca antiga', cat: 'artifact', sell: 150 },
    ovodino: { name: 'Ovo de dinossauro', cat: 'artifact', sell: 350 },
  });
  const ARTIFACTS = [['pontaflecha', 5], ['vaso', 5], ['osso', 4], ['moeda', 3], ['boneca', 3], ['amonite', 2], ['estatueta', 1], ['ovodino', 1]];
  const MUSEUM_ITEMS = ['quartzo', 'ametista', 'topazio', 'esmeralda', 'diamante', 'jaspe', 'malaquita', 'pedralua', 'obsidiana', 'opala', 'pontaflecha', 'vaso', 'osso', 'moeda', 'boneca', 'amonite', 'estatueta', 'ovodino'];
  const MUSEUM_REWARDS = [[3, [['m_cereja', 1]], 'Uma muda de cerejeira'], [6, [['colmeia', 1]], 'Uma colmeia'], [9, [['geodomagma', 3], ['isca', 30]], 'Geodos de magma e isca'], [12, [['pecoelho', 1]], 'Um pé de coelho da sorte'], [15, [['diamante', 2]], 'Dois diamantes'], [18, [['frutaestelar', 1]], 'A fruta estelar!']];
  NPCS.gil = { name: 'Professor Gil', role: 'curador do museu', look: { hair: 5, shirt: 6, skin: 1, pants: '#3a3a4a', glasses: true, beard: true }, bday: ['spring', 22], loves: ['estatueta', 'ovodino', 'amonite', 'diamante'], likes: ['*artifact', '*mineral', '*gem'], hates: ['*monster'],
    lines: ['Cada pedra conta uma história. Traga as que encontrar!', 'Viu umas minhoquinhas se mexendo no chão? Cave ali com a enxada.', 'Os geodos guardam minerais lindos. O Seu Cláudio abre para você.', 'O museu estava vazio há anos. Que alegria ver as vitrines enchendo!', 'Dizem que existe uma fruta estelar para quem completar a coleção...'],
    hi: ['Ninguém da vila coleciona tão bem quanto você.', 'Graças a você, a história do vale está sendo contada.'],
    season: ['Na primavera a terra mole revela muita coisa.', 'No verão a praia esconde tesouros na areia.', 'Outono: ótimo tempo para pesquisar na biblioteca.', 'Até no inverno dá para cavar. A terra não congela tão fundo.'],
    sched: [[360, null], [540, 'museum', 8, 2, 1], [1080, 'bar', 11, 4, 1], [1320, null]] };

  // ================= Centro Comunitário: salas, pacotes e recompensas =================
  // cada item: [id, quantidade]; ids que começam com '*' aceitam qualquer artesanal daquele tipo (ex.: *geleia)
  const CC_ROOMS = [
    { id: 'despensa', name: 'Despensa', reward: 'A Rosa constrói (ou paga) a estufa de graça', bundles: [
      { id: 'prim', name: 'Plantações da primavera', items: [['pastinaca', 1], ['vagem', 1], ['couveflor', 1], ['batata', 1]], need: 4, gift: [['s_morango', 5]] },
      { id: 'ver', name: 'Plantações do verão', items: [['tomate', 1], ['pimenta', 1], ['mirtilo', 1], ['melao', 1]], need: 4, gift: [['irrigador', 1]] },
      { id: 'out', name: 'Plantações do outono', items: [['milho', 1], ['berinjela', 1], ['abobora', 1], ['inhame', 1]], need: 4, gift: [['barril', 1]] },
      { id: 'ani', name: 'Animais', items: [['leite', 1], ['ovo', 1], ['la', 1], ['ovopato', 1], ['leitecabra', 1], ['carnebovina', 1]], need: 4, gift: [['feno', 30]] },
      { id: 'art', name: 'Artesão', items: [['*geleia', 1], ['*conserva', 1], ['*vinho', 1], ['queijo', 1], ['*mel', 1], ['maionese', 1], ['tecido', 1], ['oleotrufa', 1]], need: 5, gift: [['queijeira', 1]] },
    ] },
    { id: 'artesanato', name: 'Sala de Artesanato', reward: 'Os carrinhos de mina voltam a funcionar (viagem rápida)', bundles: [
      { id: 'cprim', name: 'Coleta da primavera', items: [['alhoporo', 1], ['narciso', 1], ['cebolinha', 1], ['dentedeleao', 1]], need: 4, gift: [['s_pastinaca', 20]] },
      { id: 'cver', name: 'Coleta do verão', items: [['ervilhadoce', 1], ['baga', 1], ['uvaselvagem', 1]], need: 3, gift: [['s_tomate', 10]] },
      { id: 'cout', name: 'Coleta do outono', items: [['cogumelo', 1], ['amora', 1], ['avela', 1]], need: 3, gift: [['s_abobora', 5]] },
      { id: 'cinv', name: 'Coleta do inverno', items: [['raizinverno', 1], ['frutacristal', 1], ['acafrao', 1]], need: 3, gift: [['s_mixinverno', 10]] },
      { id: 'cons', name: 'Construção', items: [['madeira', 99], ['pedra', 99], ['fibra', 50], ['seiva', 20]], need: 4, gift: [['bau', 2]] },
    ] },
    { id: 'aquario', name: 'Aquário', reward: 'O Zé melhora a sua vara de pesca e dá covos', bundles: [
      { id: 'rio', name: 'Peixes do rio', items: [['peixesol', 1], ['bagre', 1], ['truta', 1], ['salmao', 1]], need: 4, gift: [['isca', 30]] },
      { id: 'lago', name: 'Peixes do lago', items: [['carpa', 1], ['achiga', 1], ['perca', 1], ['tilapia', 1]], need: 4, gift: [['isca', 30]] },
      { id: 'mar', name: 'Peixes do mar', items: [['sardinha', 1], ['atum', 1], ['linguado', 1], ['salmonete', 1]], need: 4, gift: [['covo', 2]] },
      { id: 'covo', name: 'Covo', items: [['caranguejo', 1], ['lagosta', 1], ['camarao', 1], ['mexilhao', 1], ['ostra', 1], ['lagostim', 1]], need: 5, gift: [['covo', 3]] },
      { id: 'noite', name: 'Pesca noturna', items: [['enguia', 1], ['brema', 1], ['lula', 1]], need: 3, gift: [['sopamariscos', 3]] },
    ] },
    { id: 'caldeira', name: 'Sala da Caldeira', reward: 'O Seu Cláudio passa a abrir geodos de graça', bundles: [
      { id: 'ferr', name: 'Ferreiro', items: [['barracobre', 1], ['barraferro', 1], ['barraouro', 1]], need: 3, gift: [['fornalha', 1]] },
      { id: 'geo', name: 'Geólogo', items: [['quartzo', 1], ['ametista', 1], ['topazio', 1], ['esmeralda', 1]], need: 4, gift: [['geodogelo', 5]] },
      { id: 'avent', name: 'Aventureiro', items: [['gosma', 30], ['asamorcego', 10], ['carvao', 10], ['ectoplasma', 1]], need: 3, gift: [['lanchemineiro', 3]] },
    ] },
    { id: 'mural', name: 'Mural', reward: 'Toda a vila fica mais amiga de vocês (+1 coração com todos)', bundles: [
      { id: 'chef', name: 'Chef', items: [['ovofrito', 1], ['omelete', 1], ['panqueca', 1], ['pao', 1], ['sashimi', 1], ['tortaabobora', 1]], need: 4, gift: [['pizza', 3]] },
      { id: 'tint', name: 'Tinturas', items: [['morango', 1], ['narciso', 1], ['couve', 1], ['mirtilo', 1], ['uva', 1], ['abobora', 1]], need: 5, gift: [['tear', 1]] },
      { id: 'forr', name: 'Forragem', items: [['trigo', 10], ['feno', 10], ['maca', 3]], need: 3, gift: [['feno', 50]] },
      { id: 'carn', name: 'Carnes', items: [['carnebovina', 1], ['carnesuina', 1], ['charque', 1], ['bacon', 1]], need: 2, gift: [['churrasco', 3]] },
      { id: 'enc', name: 'Encantos', items: [['*vinho', 1], ['oleotrufa', 1], ['pecoelho', 1], ['roma', 1]], need: 3, gift: [['diamante', 1]] },
    ] },
    { id: 'cofre', name: 'Cofre', reward: 'Nasce a Cooperativa: 10% de desconto em todas as lojas', bundles: [
      { id: 'm1', name: '2.500 ₲', gold: 2500, gift: [['geleia:morango', 3]] },
      { id: 'm2', name: '5.000 ₲', gold: 5000, gift: [['maionesera', 1]] },
      { id: 'm3', name: '10.000 ₲', gold: 10000, gift: [['colmeia', 2]] },
      { id: 'm4', name: '25.000 ₲', gold: 25000, gift: [['prensaoleo', 1]] },
    ] },
  ];
