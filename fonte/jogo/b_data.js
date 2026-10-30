  'use strict';
  // ================= utilidades =================
  const T = 16;
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const rint = (a, b) => Math.floor(rnd(a, b + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function hash(a, b = 0, c = 0) { let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; h ^= h >>> 16; return (h >>> 0) / 4294967296; }
  function srand(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const fmt = n => Math.floor(n).toLocaleString('pt-BR');
  const SEASONS = ['Primavera', 'Verão', 'Outono', 'Inverno'];
  const SEASON_ID = ['spring', 'summer', 'fall', 'winter'];
  const WEEK = ['Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.', 'Dom.'];
  // 10 minutos do jogo a cada 8 s: o dia (6h às 2h) dura 16 minutos reais
  const MIN_PER_TICK = 10, MS_PER_TICK = 8000;
  const DAY_START = 360, DAY_END = 26 * 60;

  // ================= plantações =================
  // days: dias até colher; regrow: dias para dar de novo; n: quantos frutos; kind: forma do pé
  const CROPS = {
    pastinaca: { name: 'Pastinaca', seed: 20, sell: 35, days: 3, seasons: ['spring'], kind: 'root', col: '#f4e8c8', leaf: '#5aa83c', cat: 'veg' },
    batata: { name: 'Batata', seed: 50, sell: 80, days: 5, seasons: ['spring'], kind: 'root', col: '#c8964a', leaf: '#4e9a34', cat: 'veg', extra: 0.2 },
    couveflor: { name: 'Couve-flor', seed: 80, sell: 175, days: 11, seasons: ['spring'], kind: 'big', col: '#fff8e8', leaf: '#4a9a4a', cat: 'veg' },
    couve: { name: 'Couve', seed: 70, sell: 110, days: 5, seasons: ['spring'], kind: 'bush', col: '#3a8a4a', leaf: '#3a8a4a', cat: 'veg' },
    vagem: { name: 'Vagem', seed: 60, sell: 40, days: 9, regrow: 3, seasons: ['spring'], kind: 'vine', col: '#6ac84a', leaf: '#3a8a3a', cat: 'veg' },
    morango: { name: 'Morango', seed: 100, sell: 120, days: 7, regrow: 4, seasons: ['spring'], kind: 'bush', col: '#e83a4a', leaf: '#4aa83a', cat: 'fruit' },
    melao: { name: 'Melão', seed: 80, sell: 250, days: 11, seasons: ['summer'], kind: 'big', col: '#8ad84a', leaf: '#3a8a3a', cat: 'fruit' },
    tomate: { name: 'Tomate', seed: 50, sell: 60, days: 10, regrow: 4, seasons: ['summer'], kind: 'vine', col: '#e8402a', leaf: '#3a8a3a', cat: 'veg' },
    mirtilo: { name: 'Mirtilo', seed: 80, sell: 50, days: 12, regrow: 4, n: 3, seasons: ['summer'], kind: 'bush', col: '#4a5ae0', leaf: '#3a7a3a', cat: 'fruit' },
    pimenta: { name: 'Pimenta', seed: 40, sell: 40, days: 4, regrow: 3, seasons: ['summer'], kind: 'bush', col: '#e8302a', leaf: '#4a9a3a', cat: 'fruit' },
    trigo: { name: 'Trigo', seed: 10, sell: 25, days: 3, seasons: ['summer', 'fall'], kind: 'tall', col: '#e8c84a', leaf: '#c8b04a', cat: 'veg' },
    milho: { name: 'Milho', seed: 150, sell: 50, days: 13, regrow: 4, seasons: ['summer', 'fall'], kind: 'tall', col: '#f4d83a', leaf: '#4a9a3a', cat: 'veg' },
    abobora: { name: 'Abóbora', seed: 100, sell: 320, days: 12, seasons: ['fall'], kind: 'big', col: '#f08a2a', leaf: '#4a8a3a', cat: 'veg' },
    uva: { name: 'Uva', seed: 60, sell: 80, days: 9, regrow: 3, seasons: ['fall'], kind: 'vine', col: '#8a3ac8', leaf: '#3a7a3a', cat: 'fruit' },
    berinjela: { name: 'Berinjela', seed: 20, sell: 60, days: 4, regrow: 5, seasons: ['fall'], kind: 'bush', col: '#6a2a8a', leaf: '#4a8a3a', cat: 'veg' },
    inhame: { name: 'Inhame', seed: 60, sell: 160, days: 9, seasons: ['fall'], kind: 'root', col: '#c86a4a', leaf: '#5a9a3a', cat: 'veg' },
    mixinverno: { name: 'Mix de inverno', seed: 60, sell: 0, days: 6, seasons: ['winter'], kind: 'root', col: '#a86a5a', leaf: '#6a8a7a', cat: 'veg', mix: true },
    oxicoco: { name: 'Oxicoco', seed: 240, sell: 75, days: 6, regrow: 5, n: 2, seasons: ['fall'], kind: 'bush', col: '#c8202a', leaf: '#5a7a2a', cat: 'fruit' },
  };
  // ================= peixes =================
  // where: pond (lagoa da chacrinha), river (rio da vila), mine (lago da mina); diff 1-100
  const FISH = {
    carpa: { name: 'Carpa', sell: 30, diff: 15, where: ['pond', 'mine'], seasons: ['spring', 'summer', 'fall', 'winter'], col: '#a8945a' },
    achiga: { name: 'Achigã', sell: 100, diff: 50, where: ['pond'], seasons: ['spring', 'summer', 'fall', 'winter'], col: '#6a8a3a', from: 6 * 60 },
    peixesol: { name: 'Peixe-sol', sell: 30, diff: 20, where: ['river'], seasons: ['spring', 'summer'], col: '#e8b83a', to: 19 * 60 },
    truta: { name: 'Truta-arco-íris', sell: 65, diff: 45, where: ['river'], seasons: ['summer'], col: '#e87aa8' },
    salmao: { name: 'Salmão', sell: 75, diff: 50, where: ['river'], seasons: ['fall'], col: '#e86a4a' },
    bagre: { name: 'Bagre', sell: 200, diff: 75, where: ['river'], seasons: ['spring', 'fall'], col: '#5a5a6a', rain: true },
    perca: { name: 'Perca', sell: 55, diff: 35, where: ['river', 'pond'], seasons: ['winter'], col: '#8aa84a' },
    lucio: { name: 'Lúcio', sell: 100, diff: 60, where: ['river'], seasons: ['summer', 'winter'], col: '#4a7a5a' },
    brema: { name: 'Brema', sell: 45, diff: 35, where: ['river'], seasons: ['spring', 'summer', 'fall', 'winter'], col: '#9a9aaa', from: 18 * 60 },
    enguia: { name: 'Enguia', sell: 85, diff: 70, where: ['river'], seasons: ['spring', 'fall'], col: '#4a4a3a', from: 16 * 60, rain: true },
    peixepedra: { name: 'Peixe-pedra', sell: 300, diff: 65, where: ['mine'], seasons: ['spring', 'summer', 'fall', 'winter'], col: '#8a8a8a' },
    tilapia: { name: 'Tilápia', sell: 75, diff: 50, where: ['pond', 'river'], seasons: ['summer', 'fall'], col: '#7a9aa8' },
  };
  // ================= coletáveis da estação =================
  const FORAGE = {
    spring: ['alhoporo', 'narciso', 'cebolinha', 'dentedeleao'],
    summer: ['ervilhadoce', 'baga', 'uvaselvagem'],
    fall: ['cogumelo', 'amora', 'avela'],
    winter: ['raizinverno', 'frutacristal', 'acafrao'],
  };
  // ================= itens =================
  // cat: tool, seed, veg, fruit, fish, forage, res (recurso), ore, bar, gem, art (artesanal), place (colocável), food, monster
  const ITEMS = {
    hoe: { name: 'Enxada', cat: 'tool', desc: 'Prepara a terra para o plantio.' },
    can: { name: 'Regador', cat: 'tool', desc: 'Molha as plantas. Encha na água.' },
    axe: { name: 'Machado', cat: 'tool', desc: 'Corta árvores e tocos.' },
    pick: { name: 'Picareta', cat: 'tool', desc: 'Quebra pedras e minérios.' },
    scythe: { name: 'Foice', cat: 'tool', desc: 'Corta mato e colhe.' },
    rod: { name: 'Vara de pesca', cat: 'tool', desc: 'Use virado para a água.' },
    sword: { name: 'Espada', cat: 'tool', desc: 'Para os monstros da mina.' },
    madeira: { name: 'Madeira', cat: 'res', sell: 2 },
    pedra: { name: 'Pedra', cat: 'res', sell: 2 },
    fibra: { name: 'Fibra', cat: 'res', sell: 1 },
    seiva: { name: 'Seiva', cat: 'res', sell: 2 },
    carvao: { name: 'Carvão', cat: 'res', sell: 15 },
    cobre: { name: 'Minério de cobre', cat: 'ore', sell: 5 },
    ferro: { name: 'Minério de ferro', cat: 'ore', sell: 10 },
    ouro: { name: 'Minério de ouro', cat: 'ore', sell: 25 },
    barracobre: { name: 'Barra de cobre', cat: 'bar', sell: 60 },
    barraferro: { name: 'Barra de ferro', cat: 'bar', sell: 120 },
    barraouro: { name: 'Barra de ouro', cat: 'bar', sell: 250 },
    quartzo: { name: 'Quartzo', cat: 'gem', sell: 25 },
    ametista: { name: 'Ametista', cat: 'gem', sell: 100 },
    topazio: { name: 'Topázio', cat: 'gem', sell: 80 },
    esmeralda: { name: 'Esmeralda', cat: 'gem', sell: 250 },
    diamante: { name: 'Diamante', cat: 'gem', sell: 750 },
    gosma: { name: 'Gosma', cat: 'monster', sell: 5 },
    asamorcego: { name: 'Asa de morcego', cat: 'monster', sell: 15 },
    alhoporo: { name: 'Alho-poró', cat: 'forage', sell: 60, energy: 40 },
    narciso: { name: 'Narciso', cat: 'forage', sell: 30 },
    cebolinha: { name: 'Cebolinha', cat: 'forage', sell: 8, energy: 13 },
    dentedeleao: { name: 'Dente-de-leão', cat: 'forage', sell: 40, energy: 25 },
    ervilhadoce: { name: 'Ervilha-de-cheiro', cat: 'forage', sell: 50 },
    baga: { name: 'Baga picante', cat: 'forage', sell: 80, energy: 25, fruit: true },
    uvaselvagem: { name: 'Uva selvagem', cat: 'forage', sell: 80, energy: 38, fruit: true },
    cogumelo: { name: 'Cogumelo', cat: 'forage', sell: 40, energy: 38 },
    amora: { name: 'Amora', cat: 'forage', sell: 20, energy: 25, fruit: true },
    avela: { name: 'Avelã', cat: 'forage', sell: 90, energy: 30 },
    raizinverno: { name: 'Raiz de inverno', cat: 'forage', sell: 70, energy: 25 },
    frutacristal: { name: 'Fruta de cristal', cat: 'forage', sell: 150, energy: 63, fruit: true },
    acafrao: { name: 'Açafrão', cat: 'forage', sell: 60 },
    // colocáveis
    bau: { name: 'Baú', cat: 'place', desc: 'Guarda 36 itens. Os dois podem usar.' },
    pote: { name: 'Pote de conserva', cat: 'place', desc: 'Fruta vira geleia, legume vira conserva.' },
    barril: { name: 'Barril', cat: 'place', desc: 'Fruta vira vinho, legume vira suco.' },
    fornalha: { name: 'Fornalha', cat: 'place', desc: '5 minérios + 1 carvão viram uma barra.' },
    irrigador: { name: 'Irrigador', cat: 'place', desc: 'Molha os 4 lados toda manhã.' },
    espantalho: { name: 'Espantalho', cat: 'place', desc: 'Afasta os corvos num raio de 8 quadrados.' },
    tocha: { name: 'Tocha', cat: 'place', desc: 'Ilumina à noite.' },
    cerca: { name: 'Cerca', cat: 'place', desc: 'Decoração que bloqueia a passagem.' },
    caminho: { name: 'Caminho de pedra', cat: 'place', desc: 'Piso de pedra para enfeitar.', floor: true },
    // comidas da loja
    salada: { name: 'Salada', cat: 'food', sell: 110, energy: 113 },
    pao: { name: 'Pão', cat: 'food', sell: 60, energy: 50 },
  };
  for (const [k, c] of Object.entries(CROPS)) {
    ITEMS[k] = { name: c.name, cat: c.cat, sell: c.sell, energy: Math.round(clamp(c.sell * 0.45, 13, 120)), col: c.col };
    ITEMS['s_' + k] = { name: 'Sementes de ' + c.name.toLowerCase(), cat: 'seed', sell: Math.floor(c.seed / 2), crop: k, desc: `Plante na ${c.seasons.map(s => SEASONS[SEASON_ID.indexOf(s)].toLowerCase()).join(' ou ')}. Fica pronto em ${c.days} dias${c.regrow ? ` e dá de novo a cada ${c.regrow}` : ''}.` };
  }
  for (const [k, f] of Object.entries(FISH)) ITEMS[k] = { name: f.name, cat: 'fish', sell: f.sell, energy: Math.round(f.sell * 0.4 + 10), col: f.col };
  // itens artesanais: "geleia:morango", "conserva:batata", "vinho:uva", "suco:tomate", "barra..." etc
  const ART = {
    geleia: { name: 'Geleia de', price: p => 2 * p + 50, from: 'fruit' },
    conserva: { name: 'Conserva de', price: p => 2 * p + 50, from: 'veg' },
    vinho: { name: 'Vinho de', price: p => 3 * p, from: 'fruit' },
    suco: { name: 'Suco de', price: p => Math.round(2.25 * p), from: 'veg' },
  };
  function item(id) {
    if (ITEMS[id]) return ITEMS[id];
    const [a, b] = String(id).split(':');
    if (ART[a] && ITEMS[b]) {
      const base = ITEMS[b];
      ITEMS[id] = { name: `${ART[a].name} ${base.name.toLowerCase()}`, cat: 'art', sell: ART[a].price(base.sell), energy: Math.round(base.sell * 0.6 + 20), base: b, kind: a, col: base.col };
      return ITEMS[id];
    }
    return { name: id, cat: 'res', sell: 0 };
  }
  const isFruit = id => { const it = item(id); return it.cat === 'fruit' || !!it.fruit; };
  const isVeg = id => item(id).cat === 'veg' || (item(id).cat === 'forage' && !item(id).fruit && item(id).energy);
  const basePrice = id => item(id).sell || 0;
  const sellPrice = id => marketPrice(id);
  const TOOL_LV = ['', 'de cobre', 'de ferro', 'de ouro'];
  const toolName = (id, lv) => item(id).name + (lv ? ' ' + TOOL_LV[lv] : '');

  // ================= receitas =================
  const RECIPES = [
    { id: 'bau', need: { madeira: 50 }, skill: null },
    { id: 'cerca', need: { madeira: 2 }, skill: null, out: 4 },
    { id: 'tocha', need: { madeira: 1, seiva: 2 }, skill: null, out: 2 },
    { id: 'caminho', need: { pedra: 1 }, skill: null },
    { id: 'pote', need: { madeira: 50, pedra: 40, carvao: 2 }, skill: ['farming', 1] },
    { id: 'espantalho', need: { madeira: 50, carvao: 1, fibra: 20 }, skill: ['farming', 1] },
    { id: 'irrigador', need: { barracobre: 1, barraferro: 1 }, skill: ['farming', 2] },
    { id: 'barril', need: { madeira: 30, barracobre: 1, barraferro: 1 }, skill: ['farming', 3] },
    { id: 'fornalha', need: { cobre: 20, pedra: 25 }, skill: ['mining', 1] },
  ];
  const SKILLS = { farming: 'Lavoura', fishing: 'Pesca', mining: 'Mineração', foraging: 'Coleta', combat: 'Combate' };
  const XP_LV = [100, 380, 770, 1300, 2150, 3300, 4800, 6900, 10000, 15000];
  const skillLv = xp => { let l = 0; while (l < 10 && xp >= XP_LV[l]) l++; return l; };

  // ================= lojas =================
  const SHOP_PEDRO = season => [
    ...Object.entries(CROPS).filter(([, c]) => c.seasons.includes(season)).map(([k, c]) => ({ id: 's_' + k, price: c.seed })),
    { id: 'pao', price: 120 }, { id: 'salada', price: 220 },
  ];
  const SHOP_CLAUDIO = [
    { id: 'carvao', price: 150 }, { id: 'cobre', price: 75 }, { id: 'ferro', price: 150 }, { id: 'ouro', price: 400 }, { id: 'pedra', price: 20 }, { id: 'madeira', price: 10 },
  ];
  const UPGRADES = [
    { lv: 1, gold: 2000, bar: 'barracobre' },
    { lv: 2, gold: 5000, bar: 'barraferro' },
    { lv: 3, gold: 10000, bar: 'barraouro' },
  ];
  const canCap = lv => 40 + 15 * lv;
