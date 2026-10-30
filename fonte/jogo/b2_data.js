
  // ================= mar, covo e praia =================
  Object.assign(FISH, {
    sardinha: { name: 'Sardinha', sell: 40, diff: 30, where: ['ocean'], seasons: ['spring', 'fall', 'winter'], col: '#8aa8c8' },
    anchova: { name: 'Anchova', sell: 30, diff: 30, where: ['ocean'], seasons: ['spring', 'fall'], col: '#6a8ab0' },
    atum: { name: 'Atum', sell: 100, diff: 70, where: ['ocean'], seasons: ['summer', 'winter'], col: '#3a5a8a' },
    linguado: { name: 'Linguado', sell: 100, diff: 50, where: ['ocean'], seasons: ['spring', 'summer'], col: '#b8a888' },
    polvo: { name: 'Polvo', sell: 150, diff: 95, where: ['ocean'], seasons: ['summer'], col: '#c85a7a', from: 6 * 60, to: 13 * 60 },
    lula: { name: 'Lula', sell: 80, diff: 75, where: ['ocean'], seasons: ['winter'], col: '#e8c8d8', from: 18 * 60 },
    baiacu: { name: 'Baiacu', sell: 200, diff: 80, where: ['ocean'], seasons: ['summer'], col: '#e8d84a', from: 12 * 60, to: 16 * 60 },
    arenque: { name: 'Arenque', sell: 30, diff: 25, where: ['ocean'], seasons: ['spring', 'winter'], col: '#a8b8c8' },
    salmonete: { name: 'Salmonete', sell: 75, diff: 55, where: ['ocean'], seasons: ['summer', 'winter'], col: '#e8705a' },
    peixeespada: { name: 'Peixe-espada', sell: 110, diff: 60, where: ['ocean'], seasons: ['summer', 'fall'], col: '#c8d8e8' },
  });
  FISH.enguia.where.push('ocean');
  // o que o covo pega (água salgada ou doce)
  const CRAB_OCEAN = ['caranguejo', 'lagosta', 'camarao', 'mexilhao', 'ostra', 'berbigao'];
  const CRAB_FRESH = ['lagostim', 'caramujo', 'pervinca'];
  const BEACH_FORAGE = ['concha', 'coral', 'ourico', 'mexilhao', 'ameijoa', 'ostra'];

  // ================= árvores frutíferas e extrator =================
  const FTREES = {
    cereja: { name: 'Cerejeira', season: 'spring', price: 3400, sell: 80, col: '#d8203a' },
    damasco: { name: 'Damasqueiro', season: 'spring', price: 2000, sell: 50, col: '#f4a83a' },
    laranja: { name: 'Laranjeira', season: 'summer', price: 4000, sell: 100, col: '#f48a1a' },
    pessego: { name: 'Pessegueiro', season: 'summer', price: 6000, sell: 140, col: '#f8a08a' },
    maca: { name: 'Macieira', season: 'fall', price: 4000, sell: 100, col: '#e0302a' },
    roma: { name: 'Romãzeira', season: 'fall', price: 6000, sell: 140, col: '#c02848' },
  };
  const TAPS = [{ out: 'resina', days: 7 }, { out: 'xarope', days: 9 }, { out: 'alcatrao', days: 5 }];

  // ================= novos itens =================
  Object.assign(ITEMS, {
    balde: { name: 'Balde de leite', cat: 'tool', desc: 'Tira leite de vacas e cabras.' },
    tesoura: { name: 'Tesoura', cat: 'tool', desc: 'Tosa a lã das ovelhas.' },
    // produtos dos animais
    ovo: { name: 'Ovo', cat: 'animal', sell: 50, energy: 25, col: '#f4f0e0' },
    ovogrande: { name: 'Ovo grande', cat: 'animal', sell: 95, energy: 38, col: '#f8f4e8' },
    ovomarrom: { name: 'Ovo caipira', cat: 'animal', sell: 50, energy: 25, col: '#d8a06a' },
    ovopato: { name: 'Ovo de pata', cat: 'animal', sell: 95, energy: 38, col: '#d8e8d0' },
    pena: { name: 'Pena de pato', cat: 'animal', sell: 250 },
    la: { name: 'Lã', cat: 'animal', sell: 340 },
    pecoelho: { name: 'Pé de coelho', cat: 'animal', sell: 565, desc: 'Dizem que dá sorte.' },
    leite: { name: 'Leite', cat: 'animal', sell: 125, energy: 38 },
    leitegrande: { name: 'Leite grande', cat: 'animal', sell: 190, energy: 63 },
    leitecabra: { name: 'Leite de cabra', cat: 'animal', sell: 225, energy: 63 },
    leitecabragrande: { name: 'Leite de cabra grande', cat: 'animal', sell: 345, energy: 88 },
    trufa: { name: 'Trufa', cat: 'animal', sell: 625, energy: 13 },
    feno: { name: 'Feno', cat: 'res', sell: 0, desc: 'Comida dos animais. Ponha no cocho ou guarde no silo.' },
    // artesanais
    maionese: { name: 'Maionese', cat: 'art', sell: 190, energy: 50, col: '#fff4c0' },
    maionesepato: { name: 'Maionese de pata', cat: 'art', sell: 375, energy: 75, col: '#e8f0c8' },
    queijo: { name: 'Queijo', cat: 'art', sell: 230, energy: 125, col: '#f8d850' },
    queijocabra: { name: 'Queijo de cabra', cat: 'art', sell: 400, energy: 125, col: '#f4f0e0' },
    tecido: { name: 'Tecido', cat: 'art', sell: 470, col: '#e8e0f0' },
    oleotrufa: { name: 'Óleo de trufa', cat: 'art', sell: 1065, energy: 38, col: '#d8c040' },
    mel: { name: 'Mel', cat: 'art', sell: 100, energy: 50, col: '#f0a820' },
    xarope: { name: 'Xarope de bordo', cat: 'res', sell: 200, col: '#a85a1a' },
    resina: { name: 'Resina de carvalho', cat: 'res', sell: 150, col: '#e8a030' },
    alcatrao: { name: 'Alcatrão de pinho', cat: 'res', sell: 100, col: '#3a2a20' },
    // ingredientes de cozinha
    farinha: { name: 'Farinha de trigo', cat: 'cook', sell: 50 },
    acucar: { name: 'Açúcar', cat: 'cook', sell: 50 },
    oleo: { name: 'Óleo', cat: 'cook', sell: 100 },
    arroz: { name: 'Arroz', cat: 'cook', sell: 100 },
    vinagre: { name: 'Vinagre', cat: 'cook', sell: 100 },
    // máquinas e outros colocáveis
    maionesera: { name: 'Máquina de maionese', cat: 'place', desc: 'Ovo vira maionese em 3 horas.' },
    queijeira: { name: 'Prensa de queijo', cat: 'place', desc: 'Leite vira queijo em 3 horas.' },
    tear: { name: 'Tear', cat: 'place', desc: 'Lã vira tecido em 4 horas.' },
    prensaoleo: { name: 'Prensa de óleo', cat: 'place', desc: 'Trufa vira óleo de trufa em 6 horas.' },
    colmeia: { name: 'Colmeia', cat: 'place', desc: 'Dá mel a cada 4 dias (menos no inverno).' },
    extrator: { name: 'Extrator de seiva', cat: 'place', desc: 'Coloque numa árvore: dá xarope, resina ou alcatrão.' },
    covo: { name: 'Covo', cat: 'place', desc: 'Coloque na água e ponha isca. Pega frutos do mar toda noite.' },
    isca: { name: 'Isca', cat: 'res', sell: 1, desc: 'Na mochila, o peixe morde mais rápido. No covo, pega frutos do mar.' },
    alianca: { name: 'Aliança', cat: 'gift', sell: 0, desc: 'Entregue para a outra pessoa da chacrinha para fazer o pedido de casamento.' },
    // frutos do mar e da praia
    caranguejo: { name: 'Caranguejo', cat: 'fish', sell: 100, energy: 25, col: '#d8502a', shell: 1 },
    lagosta: { name: 'Lagosta', cat: 'fish', sell: 120, energy: 25, col: '#c8302a', shell: 1 },
    camarao: { name: 'Camarão', cat: 'fish', sell: 60, energy: 25, col: '#f08a6a', shell: 1 },
    mexilhao: { name: 'Mexilhão', cat: 'fish', sell: 30, energy: 25, col: '#2a2a4a', shell: 2 },
    ostra: { name: 'Ostra', cat: 'fish', sell: 40, energy: 25, col: '#a8a098', shell: 2 },
    berbigao: { name: 'Berbigão', cat: 'fish', sell: 50, energy: 25, col: '#e8c89a', shell: 2 },
    ameijoa: { name: 'Amêijoa', cat: 'fish', sell: 50, energy: 25, col: '#d8c0a0', shell: 2 },
    lagostim: { name: 'Lagostim', cat: 'fish', sell: 75, energy: 25, col: '#b8402a', shell: 1 },
    caramujo: { name: 'Caramujo', cat: 'fish', sell: 65, energy: 25, col: '#8a6a4a', shell: 2 },
    pervinca: { name: 'Pervinca', cat: 'fish', sell: 20, energy: 25, col: '#6a8a9a', shell: 2 },
    concha: { name: 'Concha náutilo', cat: 'forage', sell: 120 },
    coral: { name: 'Coral', cat: 'forage', sell: 80 },
    ourico: { name: 'Ouriço-do-mar', cat: 'forage', sell: 160, energy: 38 },
    // mina
    geodo: { name: 'Geodo', cat: 'mineral', sell: 50, desc: 'O ferreiro abre por 25 ₲.' },
    geodogelo: { name: 'Geodo congelado', cat: 'mineral', sell: 100, desc: 'O ferreiro abre por 25 ₲.' },
    geodomagma: { name: 'Geodo de magma', cat: 'mineral', sell: 150, desc: 'O ferreiro abre por 25 ₲.' },
    jaspe: { name: 'Jaspe', cat: 'mineral', sell: 150 },
    malaquita: { name: 'Malaquita', cat: 'mineral', sell: 100 },
    pedralua: { name: 'Pedra da lua', cat: 'mineral', sell: 160 },
    obsidiana: { name: 'Obsidiana', cat: 'mineral', sell: 200 },
    opala: { name: 'Opala de fogo', cat: 'mineral', sell: 350 },
    ectoplasma: { name: 'Ectoplasma', cat: 'monster', sell: 100 },
  });
  for (const [k, f] of Object.entries(FTREES)) {
    ITEMS[k] = { name: { cereja: 'Cereja', damasco: 'Damasco', laranja: 'Laranja', pessego: 'Pêssego', maca: 'Maçã', roma: 'Romã' }[k], cat: 'fruit', sell: f.sell, energy: Math.round(f.sell * 0.5), col: f.col };
    ITEMS['m_' + k] = { name: 'Muda de ' + f.name.toLowerCase(), cat: 'sapling', sell: Math.floor(f.price / 2), tree: k, desc: `Plante na chacrinha com espaço em volta. Cresce em 28 dias e dá ${ITEMS[k].name.toLowerCase()} no ${SEASONS[SEASON_ID.indexOf(f.season)].toLowerCase()}.` };
  }
  for (const k of ['peixeespada', 'sardinha', 'anchova', 'atum', 'linguado', 'polvo', 'lula', 'baiacu', 'arenque', 'salmonete']) { const f = FISH[k]; ITEMS[k] = { name: f.name, cat: 'fish', sell: f.sell, energy: Math.round(f.sell * 0.4 + 10), col: f.col }; }
  RECIPES.push(
    { id: 'maionesera', need: { madeira: 15, pedra: 15, barracobre: 1 }, skill: ['farming', 2] },
    { id: 'colmeia', need: { madeira: 40, carvao: 8, barraferro: 1 }, skill: ['farming', 3] },
    { id: 'queijeira', need: { madeira: 45, pedra: 45, barracobre: 1 }, skill: ['farming', 4] },
    { id: 'tear', need: { madeira: 60, fibra: 30, alcatrao: 1 }, skill: ['farming', 5] },
    { id: 'prensaoleo', need: { gosma: 50, madeira: 20, barraouro: 1 }, skill: ['farming', 6] },
    { id: 'extrator', need: { madeira: 40, barracobre: 2 }, skill: ['foraging', 3] },
    { id: 'covo', need: { madeira: 40, barraferro: 1 }, skill: ['fishing', 3] },
    { id: 'isca', need: { gosma: 1 }, skill: ['fishing', 2], out: 5 },
  );

  // ================= cozinha =================
  // '*ovo', '*leite' e '*peixe' aceitam qualquer um do tipo. learn: start, tv, lia (compra no bar), npc:<quem>:<corações>, skill:<qual>:<nível>
  const COOK = [
    { id: 'ovofrito', name: 'Ovo frito', need: { '*ovo': 1 }, en: 50, sell: 35, learn: 'start' },
    { id: 'pao', name: 'Pão', need: { farinha: 1 }, en: 50, sell: 60, learn: 'start' },
    { id: 'sashimi', name: 'Sashimi', need: { '*peixe': 1 }, en: 75, sell: 75, learn: 'start' },
    { id: 'omelete', name: 'Omelete', need: { '*ovo': 1, '*leite': 1 }, en: 100, sell: 125, learn: 'tv' },
    { id: 'panqueca', name: 'Panquecas', need: { farinha: 1, '*ovo': 1 }, en: 90, sell: 80, learn: 'tv', buff: { foraging: 2 } },
    { id: 'rosti', name: 'Batata rösti', need: { batata: 1, oleo: 1 }, en: 90, sell: 120, learn: 'tv', buff: { farming: 1 } },
    { id: 'peixeassado', name: 'Peixe assado', need: { peixesol: 1, brema: 1, farinha: 1 }, en: 75, sell: 100, learn: 'tv' },
    { id: 'carpasurpresa', name: 'Carpa surpresa', need: { carpa: 4 }, en: 90, sell: 150, learn: 'tv' },
    { id: 'percafrita', name: 'Perca frita', need: { perca: 1, oleo: 1, farinha: 1 }, en: 90, sell: 150, learn: 'tv' },
    { id: 'tortaabobora', name: 'Torta de abóbora', need: { abobora: 1, farinha: 1, '*leite': 1, acucar: 1 }, en: 225, sell: 385, learn: 'tv', buff: { defense: 2 } },
    { id: 'salada', name: 'Salada', need: { alhoporo: 1, dentedeleao: 1, vinagre: 1 }, en: 113, sell: 110, learn: 'npc:bia:3' },
    { id: 'pizza', name: 'Pizza', need: { farinha: 1, tomate: 1, queijo: 1 }, en: 150, sell: 300, learn: 'lia', price: 1000 },
    { id: 'sopatruta', name: 'Sopa de truta', need: { truta: 1, cebolinha: 1 }, en: 100, sell: 100, learn: 'lia', price: 500, buff: { fishing: 1 } },
    { id: 'maki', name: 'Maki', need: { '*peixe': 1, arroz: 1 }, en: 100, sell: 220, learn: 'lia', price: 800, buff: { fishing: 1 } },
    { id: 'saladafrutas', name: 'Salada de frutas', need: { mirtilo: 1, melao: 1, damasco: 1 }, en: 205, sell: 450, learn: 'lia', price: 1500 },
    { id: 'tacopeixe', name: 'Taco de peixe', need: { tilapia: 1, tomate: 1, pimenta: 1, maionese: 1 }, en: 165, sell: 500, learn: 'npc:ze:7', buff: { fishing: 2 } },
    { id: 'enguiapicante', name: 'Enguia picante', need: { enguia: 1, pimenta: 1 }, en: 115, sell: 175, learn: 'npc:ze:3', buff: { speed: 1, luck: 1 } },
    { id: 'sopamariscos', name: 'Sopa de mariscos', need: { ameijoa: 1, '*leite': 1 }, en: 125, sell: 135, learn: 'npc:ze:5' },
    { id: 'bolinhosiri', name: 'Bolinho de caranguejo', need: { caranguejo: 2, farinha: 1, '*ovo': 1, oleo: 1 }, en: 225, sell: 275, learn: 'npc:lia:7', buff: { speed: 1, defense: 1 } },
    { id: 'bisque', name: 'Bisque de lagosta', need: { lagosta: 1, '*leite': 1 }, en: 225, sell: 205, learn: 'npc:ze:9', buff: { fishing: 3 } },
    { id: 'sopaabobora', name: 'Sopa de abóbora', need: { abobora: 1, '*leite': 1 }, en: 200, sell: 300, learn: 'npc:nena:7', buff: { luck: 2, defense: 2 } },
    { id: 'biscoito', name: 'Biscoitos', need: { farinha: 1, acucar: 1, '*ovo': 1 }, en: 90, sell: 140, learn: 'npc:nena:4' },
    { id: 'sorvete', name: 'Sorvete', need: { '*leite': 1, acucar: 1 }, en: 100, sell: 120, learn: 'npc:caio:5' },
    { id: 'arrozdoce', name: 'Arroz-doce', need: { '*leite': 1, acucar: 1, arroz: 1 }, en: 115, sell: 260, learn: 'npc:marta:7' },
    { id: 'tortamirtilo', name: 'Torta de mirtilo', need: { mirtilo: 1, farinha: 1, acucar: 1, '*ovo': 1 }, en: 125, sell: 150, learn: 'npc:pedro:3' },
    { id: 'couveflorqueijo', name: 'Couve-flor gratinada', need: { couveflor: 1, queijo: 1 }, en: 138, sell: 300, learn: 'npc:pedro:6' },
    { id: 'parmegiana', name: 'Berinjela à parmegiana', need: { berinjela: 1, tomate: 1 }, en: 113, sell: 200, learn: 'npc:claudio:3', buff: { mining: 1, defense: 3 } },
    { id: 'ensopadovagem', name: 'Ensopado de vagem', need: { vagem: 2 }, en: 125, sell: 100, learn: 'npc:claudio:7', buff: { maxEnergy: 1 } },
    { id: 'cogumelofrito', name: 'Cogumelo frito', need: { cogumelo: 1, oleo: 1 }, en: 135, sell: 200, learn: 'npc:davi:3', buff: { attack: 2 } },
    { id: 'sopapastinaca', name: 'Sopa de pastinaca', need: { pastinaca: 1, '*leite': 1, vinagre: 1 }, en: 85, sell: 120, learn: 'npc:caio:3' },
    { id: 'almocofazenda', name: 'Almoço do fazendeiro', need: { omelete: 1, pastinaca: 1 }, en: 200, sell: 150, learn: 'skill:farming:3', buff: { farming: 3 } },
    { id: 'hamburguer', name: 'Hambúrguer da trilha', need: { pao: 1, berinjela: 1, cogumelo: 1 }, en: 125, sell: 180, learn: 'skill:foraging:2', buff: { foraging: 3 } },
    { id: 'lanchemineiro', name: 'Lanche do minerador', need: { inhame: 1, acucar: 1, '*leite': 1 }, en: 125, sell: 200, learn: 'skill:mining:3', buff: { mining: 3, speed: 1 } },
    { id: 'jantarsalmao', name: 'Jantar de salmão', need: { salmao: 1, couve: 1, vagem: 1 }, en: 125, sell: 300, learn: 'npc:rosa:5' },
    { id: 'cafereforcado', name: 'Café da manhã completo', need: { ovofrito: 1, '*leite': 1, rosti: 1, panqueca: 1 }, en: 200, sell: 350, learn: 'npc:davi:6', buff: { farming: 2, speed: 1 } },
  ];
  const BUFF_NAMES = { farming: 'Lavoura', fishing: 'Pesca', mining: 'Mineração', foraging: 'Coleta', luck: 'Sorte', speed: 'Velocidade', attack: 'Ataque', defense: 'Defesa', maxEnergy: 'Energia máx.' };
  for (const r of COOK) if (!ITEMS[r.id] || r.id === 'salada' || r.id === 'pao') ITEMS[r.id] = { name: r.name, cat: 'food', sell: r.sell, energy: r.en, buff: r.buff, desc: r.buff ? 'Dá ' + Object.entries(r.buff).map(([k, v]) => `${BUFF_NAMES[k]} +${v}`).join(', ') + ' por um tempo.' : '' };
  const ANY = { '*ovo': ['ovo', 'ovomarrom', 'ovogrande', 'ovopato'], '*leite': ['leite', 'leitegrande', 'leitecabra', 'leitecabragrande'] };
  const anyList = key => ANY[key] || (key === '*peixe' ? Object.keys(ITEMS).filter(k => ITEMS[k].cat === 'fish') : [key]);
  const needName = key => ({ '*mel': 'mel (qualquer)', '*ovo': 'ovo (qualquer)', '*leite': 'leite (qualquer)', '*peixe': 'peixe (qualquer)' }[key] || item(key).name.toLowerCase());

  // ================= animais e construções =================
  const ANIMALS = {
    galinha: { name: 'Galinha', house: 'coop', lv: 1, price: 800, mature: 3, every: 1, prod: 'ovo', big: 'ovogrande', desc: 'Bota um ovo por dia.' },
    pato: { name: 'Pato', house: 'coop', lv: 2, price: 1200, mature: 5, every: 2, prod: 'ovopato', rare: 'pena', desc: 'Ovo de pata a cada 2 dias. Às vezes uma pena.' },
    coelho: { name: 'Coelho', house: 'coop', lv: 3, price: 8000, mature: 6, every: 4, prod: 'la', rare: 'pecoelho', desc: 'Lã a cada 4 dias. Com muito carinho, um pé de coelho.' },
    vaca: { name: 'Vaca', house: 'barn', lv: 1, price: 1500, mature: 5, every: 1, prod: 'leite', big: 'leitegrande', tool: 'balde', desc: 'Leite todo dia (use o balde).' },
    cabra: { name: 'Cabra', house: 'barn', lv: 2, price: 4000, mature: 5, every: 2, prod: 'leitecabra', big: 'leitecabragrande', tool: 'balde', desc: 'Leite de cabra a cada 2 dias (use o balde).' },
    ovelha: { name: 'Ovelha', house: 'barn', lv: 3, price: 8000, mature: 4, every: 3, prod: 'la', tool: 'tesoura', desc: 'Lã a cada 3 dias (use a tesoura).' },
    porco: { name: 'Porco', house: 'barn', lv: 3, price: 16000, mature: 10, every: 1, prod: 'trufa', desc: 'Fuça trufas nos dias de sol fora do inverno.' },
  };
  const ANIMAL_NAMES = ['Pipoca', 'Mimosa', 'Estrela', 'Bolinha', 'Paçoca', 'Fubá', 'Canjica', 'Amora', 'Nina', 'Tico', 'Pituca', 'Biscoito', 'Malhada', 'Neve', 'Caramelo', 'Jujuba', 'Pandora', 'Luna', 'Pingo', 'Tapioca', 'Cocada', 'Dengo', 'Flor', 'Chuvisco'];
  const BUILDS = {
    coop: { names: ['Galinheiro', 'Galinheiro grande', 'Galinheiro de luxo'], w: 6, h: 3, door: 1, lvs: [{ gold: 4000, need: { madeira: 300, pedra: 100 } }, { gold: 10000, need: { madeira: 400, pedra: 150 } }, { gold: 20000, need: { madeira: 500, pedra: 200 } }], desc: ['Abriga 4 aves: galinhas.', 'Abriga 8 aves. Libera patos.', 'Abriga 12. Libera coelhos e enche o cocho sozinho.'] },
    barn: { names: ['Celeiro', 'Celeiro grande', 'Celeiro de luxo'], w: 7, h: 4, door: 3, lvs: [{ gold: 6000, need: { madeira: 350, pedra: 150 } }, { gold: 12000, need: { madeira: 450, pedra: 200 } }, { gold: 25000, need: { madeira: 550, pedra: 300 } }], desc: ['Abriga 4 animais: vacas.', 'Abriga 8. Libera cabras.', 'Abriga 12. Libera ovelhas e porcos e enche o cocho sozinho.'] },
    stable: { names: ['Estábulo'], w: 4, h: 2, lvs: [{ gold: 10000, need: { madeira: 100, barraferro: 5 } }], desc: ['Vem com um cavalo para andar bem mais rápido.'] },
    silo: { names: ['Silo'], w: 3, h: 3, lvs: [{ gold: 100, need: { pedra: 100, barracobre: 5 } }], desc: ['Guarda até 240 de feno. A foice no capim vira feno.'] },
    well: { names: ['Poço'], w: 3, h: 3, lvs: [{ gold: 1000, need: { pedra: 75 } }], desc: ['Enche o regador perto das plantações.'] },
  };
  const bCap = b => (b.type === 'coop' || b.type === 'barn' ? 4 * b.lv : 0);
  const SILO_CAP = 240;

  // ================= moradores =================
  // gostos: id do item ou '*categoria' (veg, fruit, fish, art, food, gem, mineral, forage, res, ore, bar, animal, monster, conserva, vinho)
  const NPCS = {
    pedro: { name: 'Seu Pedro', role: 'dono do armazém', look: { hair: 1, shirt: 2, skin: 1, pants: '#5a4a3a', glasses: true, apron: '#4a9a4a' }, bday: ['spring', 4], loves: ['tortamirtilo', 'couveflorqueijo', 'salada', 'vinho:uva'], likes: ['*veg', '*art'], hates: ['*monster'], shop: 'store', hours: [540, 1020],
      lines: ['Bom dia! As sementes chegaram fresquinhas hoje.', 'Plantando no começo da estação, dá tempo de colher várias vezes.', 'Minha filha diz que eu falo demais de adubo. Ela tem razão.', 'Movimento bom hoje no armazém. Obrigado pela preferência!', 'O segredo da horta é regar todo dia. Ou torcer pra chover.'],
      hi: ['Você virou parte da vila, sabia? Fico feliz de verdade.', 'Guardei as melhores sementes pra você olhar primeiro.'],
      season: ['A primavera é a melhor época pra quem planta.', 'Nesse calor, regue cedo, antes do sol esquentar.', 'Abóbora no outono rende um bom dinheiro!', 'No inverno o armazém fica calmo. Bom pra arrumar as prateleiras.'],
      sched: [[360, null], [540, 'store', 6, 2, 1], [1020, 'town', 11, 14, 1], [1140, 'bar', 13, 4, 1], [1320, null]] },
    claudio: { name: 'Seu Cláudio', role: 'ferreiro', look: { hair: 4, shirt: 6, skin: 2, pants: '#3a3a3a', bald: true, beard: true, apron: '#7a4a2a' }, bday: ['summer', 26], loves: ['ouro', 'barraouro', 'diamante', 'omelete', 'parmegiana'], likes: ['*gem', '*bar', '*ore', '*mineral'], hates: ['narciso', 'ervilhadoce'], shop: 'smith', hours: [540, 960],
      lines: ['Hm. Precisa de alguma coisa?', 'Cinco minérios e um carvão na fornalha viram uma barra.', 'A mina fica mais perigosa quanto mais fundo se vai.', 'O barulho da bigorna me acalma.', 'Traga geodos que eu abro pra você.'],
      hi: ['Você é das poucas pessoas que eu gosto de ver por aqui.', 'Obrigado por sempre passar na ferraria. Significa muito.'],
      season: ['Primavera... muita chuva, ferramenta enferruja.', 'O calor da forja no verão é pesado.', 'Outono é bom pra descer na mina.', 'No inverno a forja é o lugar mais quentinho da vila.'],
      sched: [[360, null], [540, 'smith', 5, 2, 1], [960, 'town', 34, 14, 1], [1080, 'bar', 4, 6, 3], [1380, null]] },
    rosa: { name: 'Rosa', role: 'carpinteira', look: { hair: 3, style: 1, shirt: 0, skin: 1, pants: '#4a5a8a', apron: '#c88a3a' }, bday: ['fall', 21], loves: ['queijocabra', 'pessego', 'pizza', 'cogumelofrito'], likes: ['madeira', '*fruit', '*art'], hates: ['gosma'], shop: 'carpentry', hours: [540, 1020],
      lines: ['Precisa de uma construção nova? É só falar!', 'Madeira boa é a base de tudo.', 'Um galinheiro na chacrinha faz uma diferença enorme.', 'Adoro o cheiro de serragem pela manhã.', 'Construo galinheiro, celeiro, estábulo, silo, poço...'],
      hi: ['Sua chacrinha está ficando linda. Dá gosto de ver!', 'Se precisar de qualquer ajuda, pode me chamar.'],
      season: ['Na primavera todo mundo quer construir alguma coisa!', 'Verão é ótimo pra trabalhar ao ar livre.', 'Hora de reforçar os telhados antes do inverno.', 'Madeira molhada de neve dá trabalho, mas eu dou conta.'],
      sched: [[360, null], [540, 'carpentry', 5, 2, 1], [1020, 'town', 9, 20, 1], [1200, null]] },
    marta: { name: 'Marta', role: 'dona do rancho', look: { hair: 1, style: 2, shirt: 4, skin: 2, pants: '#5a3a2a', apron: '#e8d8b8' }, bday: ['fall', 18], loves: ['tortaabobora', 'almocofazenda', 'diamante', 'sorvete'], likes: ['*animal', '*art'], hates: ['*monster'], shop: 'ranch', hours: [540, 960],
      lines: ['Animal feliz é animal que ganha carinho todo dia.', 'Não esqueça de deixar feno no cocho!', 'Com um silo, a foice guarda o capim como feno.', 'As galinhas botam ovos maiores quando estão felizes.', 'Nos dias de sol os bichos adoram passear lá fora.'],
      hi: ['Seus animais estão sempre tão bem cuidados. Que orgulho!', 'Você tem jeito com bicho. Isso não se ensina.'],
      season: ['Primavera é tempo de filhote!', 'No calor, os animais precisam de sombra e água.', 'O outono é a melhor época pro capim.', 'No inverno os bichos ficam dentro. Feno no cocho todo dia!'],
      sched: [[360, null], [540, 'ranch', 5, 2, 1], [960, 'town', 40, 20, 1], [1140, null]] },
    ze: { name: 'Zé', role: 'pescador', look: { hair: 5, shirt: 1, skin: 3, pants: '#3a4a3a', beard: true, apron: '#e8c84a' }, bday: ['summer', 24], loves: ['bagre', 'polvo', 'lula', 'diamante', 'sopamariscos'], likes: ['*fish'], hates: ['gosma'], shop: 'fishshop', hours: [540, 1020],
      lines: ['O mar tá calmo hoje. Bom pra pescar.', 'Com isca na mochila, o peixe morde bem mais rápido.', 'Coloque um covo na água e vá cuidar da vida. Ele trabalha sozinho.', 'Peixe bom de verdade aparece quando chove.', 'Já pesquei um polvo que lutou por meia hora!'],
      hi: ['Você pesca melhor que muita gente que conheço.', 'Quando quiser companhia no píer, é só aparecer.'],
      season: ['Na primavera as sardinhas aparecem em cardume.', 'Verão é época de polvo e baiacu.', 'No outono o salmão sobe o rio.', 'No inverno, a lula sai à noite.'],
      sched: [[360, 'beach', 27, 14, 1], [540, 'fishshop', 5, 2, 1], [1020, 'beach', 27, 14, 1], [1260, 'bar', 14, 7, 2], [1440, null]] },
    lia: { name: 'Lia', role: 'dona do bar', look: { hair: 6, style: 1, shirt: 5, skin: 0, pants: '#3a2a4a', apron: '#f4f0e0' }, bday: ['summer', 8], loves: ['pizza', 'tacopeixe', 'vinho:uva', 'salmao'], likes: ['*food', '*art'], hates: ['*monster'], shop: 'bar', hours: [720, 1500],
      lines: ['Boas-vindas ao bar! Senta aí.', 'A pizza de hoje saiu caprichada.', 'À noite o pessoal da vila toda aparece por aqui.', 'Se quiser aprender receitas, eu vendo algumas.', 'Cozinhar é o melhor jeito de cuidar de alguém.'],
      hi: ['Você é sempre a melhor parte da minha noite.', 'Tem um lugar guardado no balcão só pra você.'],
      season: ['Primavera pede salada fresquinha.', 'No verão o suco de fruta sai que é uma beleza.', 'Outono é tempo de sopa de abóbora!', 'No inverno, nada como um prato quente.'],
      sched: [[360, null], [480, 'town', 27, 20, 1], [720, 'bar', 5, 2, 1], [1500, null]] },
    bia: { name: 'Bia', role: 'artista', look: { hair: 2, style: 1, shirt: 2, skin: 0, pants: '#8a5a3a' }, bday: ['winter', 23], loves: ['salada', 'queijocabra', 'trufa', 'vinho:uva'], likes: ['*forage', '*fruit'], hates: ['pao', 'pizza'],
      lines: ['Estou tentando pintar o rio com a luz da manhã.', 'Achei uns cogumelos lindos perto da mata.', 'Arte e plantação têm algo em comum: paciência.', 'Você já reparou nas cores do outono por aqui?', 'Prefiro comida simples, feita com o que a terra dá.'],
      hi: ['Pintei um quadro da sua chacrinha. Um dia te mostro!', 'Conversar com você me dá ideias novas.'],
      season: ['As flores da primavera são minhas modelos favoritas.', 'O mar no verão tem um azul impossível de pintar.', 'Outono: laranja, vermelho, dourado... que paleta!', 'A neve deixa tudo silencioso. Gosto disso.'],
      sched: [[360, null], [480, 'town', 10, 28, 1], [660, 'beach', 14, 8, 1], [840, 'town', 26, 26, 1], [1020, 'town', 38, 28, 1], [1140, 'bar', 11, 7, 3], [1320, null]] },
    davi: { name: 'Doutor Davi', role: 'médico', look: { hair: 0, shirt: 7, skin: 2, pants: '#4a4a5a', glasses: true }, bday: ['winter', 14], loves: ['oleotrufa', 'vinho:uva', '*conserva', 'cafereforcado'], likes: ['*food', '*fruit'], hates: ['gosma', 'asamorcego'],
      lines: ['Lembre-se de comer bem. Energia não vem do nada!', 'Se desmaiar na mina, alguém sempre te traz de volta. Mas tome cuidado.', 'Dormir cedo faz milagres pela saúde.', 'Estou estudando as plantas medicinais da região.', 'Uma salada por dia mantém o médico longe. Bom, eu sou o médico.'],
      hi: ['Você anda cuidando bem da saúde. Fico contente.', 'É bom ter alguém com quem conversar além dos pacientes.'],
      season: ['Primavera: cuidado com o pólen!', 'Beba bastante água nesse calor.', 'Outono é época de gripe. Agasalhe-se.', 'Neve na mina deixa o chão escorregadio.'],
      sched: [[360, null], [480, 'town', 19, 14, 1], [720, 'town', 30, 18, 1], [960, 'town', 15, 18, 1], [1080, 'bar', 6, 6, 2], [1320, null]] },
    nena: { name: 'Vó Nena', role: 'jardineira da praça', look: { hair: 5, style: 2, shirt: 4, skin: 1, pants: '#6a4a7a', glasses: true }, bday: ['winter', 20], loves: ['tortamirtilo', 'narciso', 'biscoito', 'sopaabobora'], likes: ['*food', 'ervilhadoce', 'dentedeleao'], hates: ['gosma', 'asamorcego'],
      lines: ['Ah, que alegria te ver por aqui! Venha sempre.', 'Na minha época a vila era bem menor.', 'Cuido do jardim da praça desde menina.', 'Um biscoito quentinho resolve qualquer tristeza.', 'Vocês formam um par tão bonito lá na chacrinha.'],
      hi: ['Você me lembra meu falecido Joaquim. Ele também amava a terra.', 'Separei uma receita de família pra você. Já já te mando.'],
      season: ['Os narcisos da primavera são meus preferidos.', 'No verão eu rego o jardim duas vezes.', 'Outono... as folhas caem e a gente agradece.', 'Inverno é tempo de tricô e chá quentinho.'],
      sched: [[360, null], [480, 'town', 26, 26, 1], [720, 'town', 27, 20, 1], [960, 'town', 19, 14, 1], [1140, null]] },
    caio: { name: 'Caio', role: 'menino da vila', look: { hair: 3, shirt: 3, skin: 3, pants: '#3a5a8a' }, kid: true, bday: ['spring', 10], loves: ['morango', 'biscoito', 'sorvete', 'ourico'], likes: ['*fruit', 'concha', 'coral'], hates: ['couve', 'berinjela'],
      lines: ['Você já foi na mina? Dizem que tem monstros!', 'Achei uma concha gigante na praia ontem!', 'Minha mãe não deixa eu ir na mina sozinho.', 'Quando eu crescer quero ter uma chacrinha igual à sua.', 'Você tem doce? Não? Tudo bem...'],
      hi: ['Você é a pessoa mais legal da vila!', 'Quer ver meu esconderijo secreto? É segredo, hein!'],
      season: ['Primavera tem muito sapo no rio!', 'Verão! Praia todo dia!', 'Achei uma folha do tamanho da minha cabeça!', 'Vamos fazer um boneco de neve?'],
      sched: [[360, null], [480, 'town', 38, 28, 1], [660, 'beach', 10, 10, 1], [900, 'town', 12, 28, 1], [1140, null]] },
  };
  const UNIVERSAL = { loves: ['pecoelho', 'diamante'], likes: ['*art', '*food', '*gem', '*fruit'], dislikes: ['*res', '*ore', '*cook'], hates: ['*monster'] };
  const GIFT_LINES = {
    love: ['Nossa! É exatamente o que eu queria! Muito obrigado, de coração!', 'Você lembrou! Esse é o meu preferido!'],
    like: ['Que gentileza! Obrigado.', 'Ah, que legal! Gostei muito.'],
    neutral: ['Obrigado pelo presente.', 'Hm, obrigado. Que atencioso.'],
    dislike: ['Hm... obrigado, eu acho.', 'Ah... não é bem a minha cara.'],
    hate: ['Eca! Por que você me daria isso?', 'Prefiro nem comentar...'],
  };
  const SHOP_HOURS = who => { const n = Object.values(NPCS).find(x => x.shop === who); return n ? n.hours : [0, 9999]; };

  // ================= mina: geodos e baús =================
  const GEODE = {
    geodo: [['cobre', 5], ['ferro', 3], ['carvao', 3], ['pedra', 8], ['quartzo', 1], ['jaspe', 1], ['malaquita', 1], ['topazio', 1], ['ametista', 1]],
    geodogelo: [['ferro', 5], ['ouro', 3], ['quartzo', 1], ['pedralua', 1], ['esmeralda', 1], ['ametista', 1], ['obsidiana', 1], ['carvao', 4]],
    geodomagma: [['ouro', 5], ['ferro', 8], ['obsidiana', 1], ['opala', 1], ['diamante', 1], ['esmeralda', 1], ['carvao', 5], ['jaspe', 2]],
  };
  const MINE_CHEST = { 10: [['barracobre', 5], ['salada', 3]], 20: [['barraferro', 3], ['geodo', 5]], 30: [['esmeralda', 1], ['barraferro', 5]], 40: [['geodogelo', 5], ['diamante', 1]], 50: [['barraouro', 3], ['parmegiana', 2]], 60: [['ametista', 3], ['topazio', 3]], 70: [['geodomagma', 5], ['barraouro', 5]], 80: [['diamante', 2], ['lanchemineiro', 2]], 90: [['opala', 2], ['barraouro', 5]], 100: [['diamante', 3], ['oleotrufa', 1]], 110: [['esmeralda', 3], ['opala', 3]], 120: [['diamante', 5], ['pecoelho', 1]] };
  const MINE_BOTTOM = 120;

  // ================= TV =================
  const TV_TIPS = [
    'Regue as plantas todo dia, a não ser que chova.',
    'Um espantalho protege 8 quadrados para cada lado dos corvos.',
    'Animais felizes dão produtos maiores. Faça carinho todo dia!',
    'Frutas no pote de conserva viram geleia, que vale bem mais.',
    'Na mina, a cada 5 andares o elevador guarda o caminho.',
    'Trufas viram óleo de trufa na prensa de óleo. Vale ouro!',
    'Os moradores adoram presentes no aniversário: vale 8 vezes mais!',
    'Covos na água salgada pegam caranguejo e lagosta.',
    'Plantas que dão de novo, como morango e mirtilo, rendem a estação inteira.',
    'Um poço perto da horta poupa muitas viagens até a lagoa.',
  ];

  // ================= estufa, feira e estações =================
  BUILDS.greenhouse = { names: ['Estufa'], w: 7, h: 4, door: 3, unique: true, lvs: [{ gold: 15000, need: { madeira: 300, pedra: 200, barracobre: 10 } }], desc: ['Planta qualquer semente em qualquer estação, até no inverno. A chuva não rega lá dentro.'] };
  ITEMS.s_mixinverno.name = 'Sementes de inverno';
  ITEMS.s_mixinverno.desc = 'Plante no inverno (a neve não mata): em 7 dias dá raiz de inverno, fruta de cristal ou açafrão.';
  for (const k of Object.keys(CROPS)) if (!CROPS[k].mix) ITEMS['s_' + k].desc += ' Na estufa cresce o ano todo.';
  NPCS.cida = { name: 'Dona Cida', role: 'feirante do mercado', look: { hair: 5, style: 2, shirt: 3, skin: 3, pants: '#5a3a2a', apron: '#d84a3a' }, bday: ['fall', 5], loves: ['melao', 'abobora', 'queijo', 'mel'], likes: ['*veg', '*fruit', '*animal'], hates: ['*monster'], shop: 'market', hours: [480, 1080],
    lines: ['Olha a fruta fresquinha! Hoje tá barato!', 'Preço de feira muda todo dia, viu? Fica de olho.', 'Quando todo mundo vende a mesma coisa, o preço cai. Diversifica!', 'Planta fora da estação vale ouro aqui. Quem tem estufa sabe.', 'No inverno o leite e a lã sobem. Ninguém quer passar frio!'],
    hi: ['Pra você eu sempre faço um precinho camarada.', 'Você é minha freguesa preferida. Ou freguês. Enfim, a melhor pessoa!'],
    season: ['Primavera: muito ovo e muito filhote. Animal sai mais barato!', 'Verão: o capim cresce e o feno fica baratinho.', 'Outono: abóbora pra todo lado. Mas o leite começa a subir.', 'Inverno: leite, ovo, lã e mel valem bem mais. E verdura da estufa, então!'],
    sched: [[360, null], [480, 'town', 33, 21, 1], [1080, 'bar', 9, 6, 2], [1320, null]] };
  // quanto cada produto animal vale em cada estação (primavera, verão, outono, inverno)
  const SEASON_PRICE = {
    ovo: [0.85, 1, 1, 1.3], ovomarrom: [0.85, 1, 1, 1.3], ovogrande: [0.85, 1, 1, 1.3], ovopato: [0.9, 1, 1, 1.3],
    leite: [0.85, 1, 1.05, 1.3], leitegrande: [0.85, 1, 1.05, 1.3], leitecabra: [0.9, 1, 1.05, 1.3], leitecabragrande: [0.9, 1, 1.05, 1.3],
    la: [1, 0.8, 1.1, 1.4], pena: [1, 1, 1, 1.2], trufa: [1, 1, 1.1, 1.5], mel: [1, 0.9, 1, 1.35],
  };
  const ART_BASE = { maionese: 'ovo', maionesepato: 'ovopato', queijo: 'leite', queijocabra: 'leitecabra', tecido: 'la', oleotrufa: 'trufa' };
  // produção dos animais por estação (chance de produzir no dia)
  const SEASON_PROD = { galinha: [1, 1, 1, 0.7], pato: [1, 1, 0.9, 0.6], coelho: [1, 1, 1, 0.8], vaca: [1.15, 0.9, 1, 0.8], cabra: [1.1, 1, 0.9, 0.7], ovelha: [1.2, 0.8, 1, 1], porco: [1, 1, 1, 0] };
  const ANIMAL_BUY = [0.85, 1, 1.05, 1.25];
  const HAY_BUY = [1, 0.8, 0.9, 1.5];
  const SEASON_NEWS = [
    'Primavera: muitos filhotes, então animais estão mais baratos. Ovos e leite sobram e o preço cai. As vacas dão mais leite.',
    'Verão: o capim cresce e o feno fica barato. No calor, vacas e ovelhas produzem um pouco menos e a terra seca mais rápido.',
    'Outono: hora da colheita! Leite e lã começam a valer mais.',
    'Inverno: nada cresce lá fora (só as sementes de inverno). Os animais ficam dentro e produzem menos, então leite, ovos, lã e mel valem bem mais. Plantas da estufa valem muito!',
  ];
