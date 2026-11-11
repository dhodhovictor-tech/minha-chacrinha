
  // ================= vila: cardápio da estação, floricultura, doenças e remédios, roupas para ela, gazebo novo e bichos sincronizados =================

  // ---------- cardápio da estação (bar da Lia e padaria da Glória) ----------
  // Muda no dia 1 e no dia 16 de cada estação (mais ou menos a cada 15 dias). t = tipo do desenho, c = cores
  const CARDAPIO = {
    // primavera
    saladaflores: { n: 'Salada de flores', en: 90, b: { luck: 1 }, t: 'prato', c: ['#6ac84a', '#f48ab8'], p: 260, onde: 'lia', e: 0 },
    sucomorango: { n: 'Suco de morango', en: 60, b: { speed: 1 }, t: 'copo', c: ['#e8405a', '#ffd0d8'], p: 180, onde: 'lia', e: 0 },
    risotoervilha: { n: 'Risoto de ervilha', en: 160, b: { farming: 1 }, t: 'prato', c: ['#f4e8c0', '#6ac84a'], p: 420, onde: 'lia', e: 0 },
    tortamorango: { n: 'Torta de morango', en: 140, b: { luck: 1 }, t: 'torta', c: ['#e8405a', '#f4d090'], p: 360, onde: 'gloria', e: 0 },
    paomel: { n: 'Pão de mel', en: 90, b: { foraging: 1 }, t: 'doce', c: ['#6a3a1a', '#f4c060'], p: 200, onde: 'gloria', e: 0 },
    biscoitoflor: { n: 'Biscoito de flor', en: 70, t: 'biscoito', c: ['#f4d090', '#f48ab8'], p: 150, onde: 'gloria', e: 0 },
    quichealhoporo: { n: 'Quiche de alho-poró', en: 150, b: { defense: 1 }, t: 'torta', c: ['#f4e090', '#6ab84a'], p: 400, onde: 'lia', e: 1 },
    limonada: { n: 'Limonada', en: 50, b: { speed: 1 }, t: 'copo', c: ['#f4f0a0', '#8ad84a'], p: 160, onde: 'lia', e: 1 },
    omeleteervas: { n: 'Omelete de ervas', en: 120, b: { mining: 1 }, t: 'prato', c: ['#f4d040', '#4a9a3a'], p: 300, onde: 'lia', e: 1 },
    colomba: { n: 'Colomba', en: 160, b: { luck: 1 }, t: 'pao', c: ['#c8843a', '#f4f0e8'], p: 420, onde: 'gloria', e: 1 },
    brigadeiro: { n: 'Brigadeiros', en: 60, b: { luck: 1 }, t: 'bolinhas', c: ['#4a2a1a', '#e86a8a'], p: 150, onde: 'gloria', e: 1 },
    bolofuba: { n: 'Bolo de fubá', en: 120, b: { farming: 1 }, t: 'doce', c: ['#f4c850', '#f8e8a0'], p: 260, onde: 'gloria', e: 1 },
    // verão
    acai: { n: 'Açaí na tigela', en: 150, b: { speed: 1 }, t: 'tigela', c: ['#5a1a5a', '#f4d040'], p: 380, onde: 'lia', e: 2 },
    peixelimao: { n: 'Peixe grelhado com limão', en: 170, b: { fishing: 1 }, t: 'peixe', c: ['#d8a060', '#a8e04a'], p: 440, onde: 'lia', e: 2 },
    sucomelancia: { n: 'Suco de melancia', en: 60, t: 'copo', c: ['#f0506a', '#5ab84a'], p: 160, onde: 'lia', e: 2 },
    picole: { n: 'Picolé de fruta', en: 50, b: { speed: 1 }, t: 'picole', c: ['#ff8a4a', '#f4d040'], p: 120, onde: 'gloria', e: 2 },
    tortalimao: { n: 'Torta de limão', en: 130, b: { fishing: 1 }, t: 'torta', c: ['#e8f080', '#f4d090'], p: 340, onde: 'gloria', e: 2 },
    sanduichenatural: { n: 'Sanduíche natural', en: 120, b: { foraging: 1 }, t: 'sanduiche', c: ['#f4e0b0', '#6ac84a'], p: 280, onde: 'gloria', e: 2 },
    moqueca: { n: 'Moqueca', en: 220, b: { fishing: 2 }, t: 'tigela', c: ['#e8802a', '#f4d040'], p: 560, onde: 'lia', e: 3 },
    aguacocogelada: { n: 'Água de coco gelada', en: 60, b: { speed: 1 }, t: 'coco', c: ['#6ab84a', '#f4f0e8'], p: 160, onde: 'lia', e: 3 },
    milhobrasa: { n: 'Milho na brasa', en: 100, b: { farming: 1 }, t: 'milho', c: ['#f4d040', '#8a5a2a'], p: 220, onde: 'lia', e: 3 },
    sorvetemanga: { n: 'Sorvete de manga', en: 70, b: { luck: 1 }, t: 'casquinha', c: ['#ffb030', '#d8a060'], p: 180, onde: 'gloria', e: 3 },
    paomilho: { n: 'Pão de milho', en: 100, t: 'pao', c: ['#f4c040', '#f8e8a0'], p: 200, onde: 'gloria', e: 3 },
    cocada: { n: 'Cocada', en: 90, b: { defense: 1 }, t: 'bolinhas', c: ['#f4ecd8', '#c8a070'], p: 200, onde: 'gloria', e: 3 },
    // outono
    caldoverde: { n: 'Caldo verde', en: 160, b: { defense: 1 }, t: 'tigela', c: ['#c8d890', '#3a8a3a'], p: 400, onde: 'lia', e: 4 },
    chamate: { n: 'Chá mate quente', en: 50, b: { mining: 1 }, t: 'xicara', c: ['#a8783a', '#f4f0e8'], p: 150, onde: 'lia', e: 4 },
    tortacogumelo: { n: 'Torta de cogumelo', en: 170, b: { foraging: 2 }, t: 'torta', c: ['#8a5a3a', '#e0c080'], p: 460, onde: 'lia', e: 4 },
    tortamaca: { n: 'Torta de maçã', en: 140, b: { luck: 1 }, t: 'torta', c: ['#c8402a', '#e8b860'], p: 360, onde: 'gloria', e: 4 },
    pamonha: { n: 'Pamonha', en: 120, b: { farming: 1 }, t: 'pamonha', c: ['#8ab84a', '#f4e080'], p: 260, onde: 'gloria', e: 4 },
    roscacanela: { n: 'Rosca de canela', en: 100, b: { speed: 1 }, t: 'rosca', c: ['#c8843a', '#f4f0e8'], p: 220, onde: 'gloria', e: 4 },
    canjica: { n: 'Canjica', en: 140, b: { luck: 1 }, t: 'tigela', c: ['#f8f0d8', '#c8843a'], p: 340, onde: 'lia', e: 5 },
    chococanela: { n: 'Chocolate com canela', en: 70, b: { defense: 1 }, t: 'xicara', c: ['#6a3a1a', '#f4f0e8'], p: 180, onde: 'lia', e: 5 },
    escondidinho: { n: 'Escondidinho', en: 220, b: { mining: 1 }, t: 'travessa', c: ['#f4d080', '#c8843a'], p: 560, onde: 'lia', e: 5 },
    bolomilho: { n: 'Bolo de milho', en: 120, b: { farming: 1 }, t: 'doce', c: ['#f4d040', '#f8e8a0'], p: 260, onde: 'gloria', e: 5 },
    pedemoleque: { n: 'Pé de moleque', en: 80, b: { mining: 1 }, t: 'biscoito', c: ['#a8682a', '#e8c070'], p: 180, onde: 'gloria', e: 5 },
    paoabobora: { n: 'Pão de abóbora', en: 110, b: { foraging: 1 }, t: 'pao', c: ['#f08a2a', '#f8d8a0'], p: 240, onde: 'gloria', e: 5 },
    // inverno
    fondue: { n: 'Fondue de queijo', en: 200, b: { luck: 1 }, t: 'tigela', c: ['#f4d040', '#e8b030'], p: 520, onde: 'lia', e: 6 },
    sopacebola: { n: 'Sopa de cebola', en: 150, b: { defense: 2 }, t: 'tigela', c: ['#c8843a', '#f4e8c0'], p: 380, onde: 'lia', e: 6 },
    cappuccino: { n: 'Cappuccino', en: 70, b: { speed: 1 }, t: 'xicara', c: ['#a8783a', '#f8f0e0'], p: 200, onde: 'lia', e: 6 },
    panetone: { n: 'Panetone', en: 180, b: { luck: 2 }, t: 'pao', c: ['#c8843a', '#e8402a'], p: 480, onde: 'gloria', e: 6 },
    biscoitogengibre: { n: 'Biscoito de gengibre', en: 80, b: { defense: 1 }, t: 'boneco', c: ['#a8682a', '#f4f0e8'], p: 180, onde: 'gloria', e: 6 },
    strudel: { n: 'Strudel de maçã', en: 140, b: { foraging: 1 }, t: 'rosca', c: ['#e8c070', '#c8402a'], p: 340, onde: 'gloria', e: 6 },
    feijoada: { n: 'Feijoada', en: 260, b: { mining: 2 }, t: 'tigela', c: ['#2a1a1a', '#f4f0e8'], p: 640, onde: 'lia', e: 7 },
    chacanela: { n: 'Chá de canela', en: 50, b: { defense: 1 }, t: 'xicara', c: ['#c8602a', '#f4f0e8'], p: 150, onde: 'lia', e: 7 },
    empadao: { n: 'Empadão', en: 190, b: { farming: 1 }, t: 'travessa', c: ['#e8b860', '#a8682a'], p: 480, onde: 'lia', e: 7 },
    bolochocolate: { n: 'Bolo de chocolate', en: 160, b: { luck: 1 }, t: 'doce', c: ['#4a2a1a', '#8a4a2a'], p: 380, onde: 'gloria', e: 7 },
    paoqueijorecheado: { n: 'Pão de queijo recheado', en: 120, b: { defense: 1 }, t: 'bolinhas', c: ['#f4d080', '#f4f0e8'], p: 260, onde: 'gloria', e: 7 },
    churros: { n: 'Churros', en: 110, b: { speed: 1 }, t: 'churros', c: ['#c8843a', '#6a3a1a'], p: 240, onde: 'gloria', e: 7 },
  };
  for (const [k, c] of Object.entries(CARDAPIO)) ITEMS[k] = { name: c.n, cat: 'food', sell: Math.round(c.p / 2.5), energy: c.en, ...(c.b ? { buff: c.b } : {}), ...(['copo', 'xicara', 'coco'].includes(c.t) ? { drink: true } : {}), desc: `Do cardápio da estação${c.onde === 'lia' ? ' do bar da Lia' : ' da padaria'}.${c.b ? ' Dá ' + Object.entries(c.b).map(([kk, v]) => `${BUFF_NAMES[kk]} +${v}`).join(', ') + '.' : ''}` };
  const metadeEstacao = () => seasonIdx() * 2 + (dom(W.meta.day) > 15 ? 1 : 0);
  const cardapio = onde => Object.entries(CARDAPIO).filter(([, c]) => c.onde === onde && c.e === metadeEstacao()).map(([k, c]) => [k, c.p]);
  const LIA_FIXO = [['expresso', 250], ['pizza', 600], ['salada', 220], ['pao', 120], ['sopaabobora', 600], ['biscoito', 280], ['sorvete', 250]];
  const GLORIA_FIXO = LOJA3_ITENS.gloria;
  LOJA3_ITENS.lia = () => [...cardapio('lia'), ...LIA_FIXO];
  LOJA3_ITENS.gloria = () => [...cardapio('gloria'), ...GLORIA_FIXO];
  const proxTroca = () => { const d = dom(W.meta.day); return d > 15 ? 29 - d : 16 - d; };
  { const g0 = SHOP_INFO.lia && SHOP_INFO.lia.greet; if (SHOP_INFO.lia) SHOP_INFO.lia.greet = () => `“Tem prato novo da estação! O cardápio muda daqui a ${proxTroca()} ${proxTroca() === 1 ? 'dia' : 'dias'}.”`; void g0; }
  { if (SHOP_INFO.gloria) SHOP_INFO.gloria.greet = () => `“Fornada da estação saindo! Troco as receitas daqui a ${proxTroca()} ${proxTroca() === 1 ? 'dia' : 'dias'}.”`; }

  // ícones das comidinhas, remédios e enfeites
  function paintIcon13(id) {
    const c = CARDAPIO[id];
    if (c) {
      const [a, b] = c.c;
      switch (c.t) {
        case 'prato': oval(8, 11, 7, 3.5, '#f4f0e8'); oval(8, 10, 5.5, 2.5, '#d8d0c0'); oval(7, 9, 4, 2.5, a); disc(10, 8, 1.8, b); disc(5, 9, 1.4, b); break;
        case 'tigela': R(3, 8, 10, 5, '#f4f0e8'); R(4, 13, 8, 1, '#c8c0b0'); oval(8, 8, 5, 2, a); disc(6, 7, 1.3, b); disc(10, 8, 1.3, b); break;
        case 'copo': R(5, 4, 6, 10, '#e8f4ff'); R(6, 6, 4, 7, a); R(6, 6, 4, 1, b); R(9, 1, 1, 5, '#f4f4f4'); R(10, 1, 2, 1, '#e8402a'); break;
        case 'xicara': R(4, 7, 8, 6, b); R(12, 8, 2, 3, b); R(5, 7, 6, 2, a); oval(8, 14, 6, 1.5, '#d8d0c0'); for (const x of [6, 9]) R(x, 2 + (x % 2), 1, 3, '#ffffffaa'); break;
        case 'coco': disc(8, 9, 6, a); disc(8, 9, 4.5, shade(a, -0.2)); disc(7, 8, 2, b); R(9, 1, 1, 6, '#f4f4f4'); break;
        case 'torta': poly([[2, 12], [8, 3], [14, 12]], b); poly([[3, 11], [8, 4], [13, 11]], a); R(2, 12, 12, 2, shade(b, -0.2)); break;
        case 'doce': R(3, 6, 10, 8, b); R(3, 6, 10, 2, a); R(3, 10, 10, 1, a); R(7, 4, 2, 2, '#e8402a'); break;
        case 'pao': oval(8, 10, 7, 4, a); oval(8, 9, 6, 3, shade(a, 0.15)); for (const x of [5, 8, 11]) R(x, 8, 1, 2, b); break;
        case 'biscoito': for (const [x, y] of [[5, 7], [10, 9], [6, 12]]) { disc(x, y, 3, a); disc(x - 1, y - 1, 1, b); } break;
        case 'bolinhas': for (const [x, y] of [[5, 10], [11, 10], [8, 6]]) { disc(x, y, 3, a); R(x - 1, y - 2, 1, 1, b); } break;
        case 'picole': R(5, 2, 6, 10, a); R(5, 2, 6, 3, b); R(7, 12, 2, 4, '#d8b080'); break;
        case 'casquinha': poly([[5, 8], [11, 8], [8, 15]], b); disc(8, 6, 4, a); R(6, 4, 2, 1, '#ffffff'); break;
        case 'sanduiche': poly([[2, 12], [14, 12], [8, 4]], a); R(3, 10, 10, 1, b); R(3, 11, 10, 1, '#e8402a'); break;
        case 'peixe': oval(8, 11, 7, 3, '#f4f0e8'); oval(7, 9, 5, 2.5, a); poly([[11, 9], [14, 7], [14, 11]], a); disc(4, 9, 1.5, b); break;
        case 'milho': R(6, 3, 4, 11, a); for (let y = 4; y < 14; y += 2) R(6, y, 4, 1, shade(a, -0.2)); poly([[6, 14], [3, 8], [6, 9]], '#6ab84a'); R(7, 13, 2, 3, b); break;
        case 'pamonha': oval(8, 9, 6, 4, a); R(4, 8, 8, 2, b); R(7, 4, 2, 3, '#8a6a3a'); break;
        case 'rosca': ctx.strokeStyle = a; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(8, 9, 4, 0, TAU); ctx.stroke(); ctx.strokeStyle = b; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(8, 9, 4, 0.3, 2); ctx.stroke(); break;
        case 'travessa': R(2, 7, 12, 7, '#c8c0b0'); R(3, 7, 10, 5, a); for (const x of [5, 9]) R(x, 8, 2, 1, b); break;
        case 'boneco': disc(8, 4, 2.5, a); R(5, 6, 6, 6, a); R(3, 7, 2, 3, a); R(11, 7, 2, 3, a); R(5, 12, 2, 3, a); R(9, 12, 2, 3, a); R(7, 4, 1, 1, b); R(7, 8, 2, 1, b); break;
        case 'churros': for (const x of [4, 8, 12]) { R(x - 1, 2, 3, 12, a); R(x, 3, 1, 10, shade(a, 0.2)); } R(2, 12, 12, 3, '#e8402a'); break;
      }
      return true;
    }
    const rem = { xaropegripe: ['#c83a3a', '#f4f0e8'], soro: ['#8ad0f0', '#ffffff'], pomada: ['#f4f0e8', '#3a8ad8'], emplastro: ['#f4d8b0', '#c83a3a'] }[id];
    if (rem) { if (id === 'pomada' || id === 'emplastro') { R(3, 6, 10, 6, rem[0]); R(3, 6, 10, 2, rem[1]); R(12, 7, 2, 4, '#a8a8b0'); } else { R(5, 5, 6, 10, rem[0]); R(6, 2, 4, 3, '#f4f0e8'); R(5, 8, 6, 3, rem[1]); R(7, 9, 2, 1, '#e8402a'); } return true; }
    if (ENFEITES[id]) { ctx.save(); ctx.translate(1, 3); ctx.scale(0.8, 0.8); drawObj8({ k: id }, 2, 6); ctx.restore(); return true; }
    return false;
  }

  // ---------- floricultura: flores novas e enfeites de jardim ----------
  const FLORES2 = {
    margarida: { name: 'Margarida', seed: 30, sell: 45, days: 5, seasons: ['spring'], kind: 'flower', col: '#f8f8f0', leaf: '#4aa83a', cat: 'flower' },
    lavanda: { name: 'Lavanda', seed: 60, sell: 90, days: 7, seasons: ['spring', 'summer'], kind: 'flower', col: '#a87ad8', leaf: '#6a9a5a', cat: 'flower' },
    hortensia: { name: 'Hortênsia', seed: 80, sell: 120, days: 8, seasons: ['summer'], kind: 'flower', col: '#7aa8f0', leaf: '#3a8a3a', cat: 'flower' },
    lirio: { name: 'Lírio', seed: 70, sell: 110, days: 7, seasons: ['summer'], kind: 'flower', col: '#f8a04a', leaf: '#4a9a3a', cat: 'flower' },
    crisantemo: { name: 'Crisântemo', seed: 50, sell: 80, days: 6, seasons: ['fall'], kind: 'flower', col: '#f4b030', leaf: '#4a8a3a', cat: 'flower' },
    dalia: { name: 'Dália', seed: 90, sell: 140, days: 8, seasons: ['fall'], kind: 'flower', col: '#c8203a', leaf: '#3a7a3a', cat: 'flower' },
    camelia: { name: 'Camélia', seed: 120, sell: 160, days: 9, seasons: ['winter'], kind: 'flower', col: '#f07aa0', leaf: '#2a6a3a', cat: 'flower' },
    amorperfeito: { name: 'Amor-perfeito', seed: 60, sell: 90, days: 6, seasons: ['winter', 'spring'], kind: 'flower', col: '#7a4ac8', leaf: '#3a7a3a', cat: 'flower' },
  };
  Object.assign(FLOWERS, FLORES2); // ícone de flor e mel com o sabor dela na colmeia
  for (const [k, c] of Object.entries(FLORES2)) {
    CROPS[k] = c; FLOR_COR[k] = c.col; if (c.seasons.includes('winter')) FLOR_INVERNO.add(k);
    ITEMS[k] = { name: c.name, cat: 'flower', sell: c.sell, col: c.col, desc: 'Fica linda no canteiro do jardim. Perto de uma colmeia, dá mel com o sabor dela.' };
    ITEMS['s_' + k] = { name: 'Sementes de ' + c.name.toLowerCase(), cat: 'seed', sell: Math.floor(c.seed / 2), crop: k, desc: `Plante na ${c.seasons.map(s => SEASONS[SEASON_ID.indexOf(s)].toLowerCase()).join(' ou ')}. Floresce em ${c.days} dias.${c.seasons.includes('winter') ? ' Aguenta o frio do inverno.' : ''}` };
  }
  const ENFEITES = {
    fontejardim: { name: 'Fonte de passarinho', p: 2500, desc: 'Uma fontezinha de pedra onde os passarinhos vêm beber.' },
    cercabranca: { name: 'Cerquinha branca', p: 150, desc: 'Um pedaço de cerca de madeira branca, para contornar o jardim.' },
    anaojardim: { name: 'Anãozinho de jardim', p: 1200, desc: 'Um anão de gorro vermelho cuidando das flores.' },
    casapassarinho: { name: 'Casinha de passarinho', p: 1500, desc: 'Num poste, com passarinho entrando e saindo.' },
    catavento: { name: 'Cata-vento colorido', p: 600, desc: 'Gira com o vento.' },
    luminariacogumelo: { name: 'Luminária de cogumelo', p: 900, desc: 'Um cogumelo que acende à noite.' },
  };
  for (const [k, e] of Object.entries(ENFEITES)) { ITEMS[k] = { name: e.name, cat: 'place', sell: Math.round(e.p / 4), desc: e.desc + ' Segure e toque no chão da chacrinha para colocar.' }; PLACED.push(k); SOLID_OBJ.add(k); }
  { const nena = LOJA3_ITENS.nena; LOJA3_ITENS.nena = () => [...nena(), ...Object.entries(ENFEITES).map(([k, e]) => [k, e.p])]; }
  function drawObj8(o, px, py) {
    const t = performance.now() / 1000;
    switch (o.k) {
      case 'fontejardim': shadowAt(px + 8, py + 14, 8, 2); R(px + 6, py + 2, 4, 12, '#a8a098'); R(px + 3, py + 12, 10, 3, '#8a8278'); oval(px + 8, py + 1, 8, 3.5, '#a8a098'); oval(px + 8, py + 1, 6.5, 2.5, '#5ab4e8'); oval(px + 6, py, 2, 1, '#c8f0ff'); if (Math.sin(t * 1.3) > 0) { R(px + 11, py - 4, 3, 2, '#8a5a3a'); R(px + 13, py - 5, 2, 2, '#8a5a3a'); R(px + 15, py - 5, 1, 1, '#f4a020'); } return true;
      case 'cercabranca': for (const x of [1, 6, 11]) { R(px + x, py + 2, 3, 12, '#f8f8f0'); R(px + x + 1, py + 1, 1, 1, '#f8f8f0'); R(px + x + 2, py + 2, 1, 12, '#d8d0c0'); } R(px, py + 5, 16, 2, '#f8f8f0'); R(px, py + 10, 16, 2, '#f8f8f0'); return true;
      case 'anaojardim': shadowAt(px + 8, py + 14, 5, 1.5); R(px + 5, py + 6, 6, 7, '#3a7ad8'); R(px + 5, py + 12, 2, 2, '#5a3418'); R(px + 9, py + 12, 2, 2, '#5a3418'); disc(px + 8, py + 4, 3, '#f8c8a8'); poly([[px + 4, py + 3], [px + 8, py - 6], [px + 12, py + 3]], '#e8302a'); R(px + 5, py + 5, 6, 3, '#f4f0e8'); R(px + 7, py + 5, 2, 1, '#e88a7a'); return true;
      case 'casapassarinho': shadowAt(px + 8, py + 14, 4, 1.5); R(px + 7, py - 2, 2, 16, '#7a4a28'); R(px + 3, py - 12, 10, 10, '#c8884a'); poly([[px + 1, py - 11], [px + 8, py - 17], [px + 15, py - 11]], '#a83a2a'); disc(px + 8, py - 7, 2, '#2a1a0a'); R(px + 7, py - 4, 2, 1, '#7a4a28'); if (Math.sin(t * 0.9) > 0.5) { R(px + 6, py - 8, 4, 2, '#f4c83a'); R(px + 9, py - 9, 1, 1, '#2a1a0a'); } return true;
      case 'catavento': { R(px + 7, py - 2, 2, 16, '#c8c8d0'); const a = t * 4; for (let i = 0; i < 4; i++) { const aa = a + i * Math.PI / 2; poly([[px + 8, py - 4], [px + 8 + Math.cos(aa) * 7, py - 4 + Math.sin(aa) * 7], [px + 8 + Math.cos(aa + 0.6) * 5, py - 4 + Math.sin(aa + 0.6) * 5]], ['#e8402a', '#f4c83a', '#3a8ad8', '#5ab84a'][i]); } disc(px + 8, py - 4, 1.5, '#ffffff'); return true; }
      case 'luminariacogumelo': { const n = nightF() > 0.3; shadowAt(px + 8, py + 14, 6, 2); R(px + 6, py + 4, 4, 10, '#f4ecd8'); oval(px + 8, py + 3, 7, 5, n ? '#ff8aa8' : '#e84a6a'); oval(px + 8, py + 1, 6, 3.5, n ? '#ffb0c8' : '#f06a8a'); for (const [dx, dy] of [[-3, 1], [2, 0], [0, 3], [4, 3]]) disc(px + 8 + dx, py + 1 + dy, 1, '#ffffff'); if (n) { ctx.globalAlpha = 0.25; disc(px + 8, py + 4, 10, '#ffd0e0'); ctx.globalAlpha = 1; } return true; }
    }
    return false;
  }

  // ---------- doenças e remédios (a clínica do Doutor Davi) ----------
  // P.flags.doenca = { k, d }: some sozinha em 3 dias, ou na hora com o remédio certo ou uma consulta
  const DOENCAS = {
    resfriado: { n: 'Resfriado', ic: '🤧', cura: 'xaropegripe', efeito: 'tudo gasta 20% mais energia', aviso: 'Atchim! Você tomou chuva demais e ficou resfriado.' },
    insolacao: { n: 'Insolação', ic: '🥵', cura: 'soro', efeito: 'anda mais devagar', aviso: 'Ficou sol demais na cabeça sem chapéu... insolação!' },
    picada: { n: 'Picada de vespa', ic: '🐝', cura: 'pomada', efeito: '-1 de ataque, coça muito', aviso: 'Ai! A picada da vespa inchou e está coçando.' },
    costas: { n: 'Dor nas costas', ic: '😣', cura: 'emplastro', efeito: 'tudo gasta 15% mais energia', aviso: 'Trabalhou até cansar de vez... dor nas costas!' },
  };
  Object.assign(ITEMS, {
    xaropegripe: { name: 'Xarope para gripe', cat: 'food', sell: 60, energy: 10, drink: true, cura: 'resfriado', desc: 'Cura o resfriado na hora.' },
    soro: { name: 'Soro caseiro', cat: 'food', sell: 50, energy: 30, drink: true, cura: 'insolacao', desc: 'Cura a insolação na hora.' },
    pomada: { name: 'Pomada para picada', cat: 'food', sell: 50, energy: 5, cura: 'picada', desc: 'Passe na picada: cura na hora.' },
    emplastro: { name: 'Emplastro para as costas', cat: 'food', sell: 60, energy: 5, cura: 'costas', desc: 'Cura a dor nas costas na hora.' },
  });
  LOJA3_ITENS.davi.push(['xaropegripe', 250], ['soro', 200], ['pomada', 200], ['emplastro', 250]);
  const doenca = () => { const d = P && P.flags && P.flags.doenca; if (!d) return null; if (W.meta.day - d.d >= 3) { P.flags.doenca = null; toast(`Você sarou da ${DOENCAS[d.k] ? DOENCAS[d.k].n.toLowerCase() : 'doença'} sozinho. Que alívio!`); dirty(); return null; } return d; };
  function adoecer(k) { if (!P || doenca()) return; P.flags.doenca = { k, d: W.meta.day }; dirty(); sfx.hurt(); toast(`${DOENCAS[k].ic} ${DOENCAS[k].aviso} (${DOENCAS[k].efeito}). A clínica do Doutor Davi tem remédio.`, 'big', null, 'doenca'); }
  function curarCom(id) { const d = doenca(), it = ITEMS[id]; if (!d || !it || it.cura !== d.k) { if (it && it.cura) toast('Esse remédio não é para o que você tem.'); return; } P.flags.doenca = null; dirty(); toast(`${DOENCAS[d.k].n} curado! Novinho em folha.`, 'big', null, 'doenca'); }
  const doencaEnergia = () => { const d = doenca(); return !d ? 1 : d.k === 'resfriado' ? 1.2 : d.k === 'costas' ? 1.15 : 1; };
  function doencaBuff(k) { const d = doenca(); if (!d) return 0; if (k === 'speed' && d.k === 'insolacao') return -2; if (k === 'attack' && d.k === 'picada') return -1; return 0; }
  // o que faz adoecer: chuva sem capa, sol forte sem chapéu, vespas e trabalhar até zerar a energia
  let expoT = 0, espirroT = 20;
  function doencaTick(dt) {
    if (!P || !W.meta || panelOpen) return;
    const m = curMap(), min = nowMin(), f = P.flags, dia = W.meta.day;
    if (!f.expo || f.expo.d !== dia) f.expo = { d: dia, chuva: 0, sol: 0 };
    expoT += dt; if (expoT >= 1) {
      expoT = 0;
      const gmin = 10 / 9.5; // um segundo ≈ 1 minuto de jogo
      if (m.outdoor && W.meta.rain && !W.meta.snow && !comCapa()) f.expo.chuva += gmin;
      if (m.outdoor && !W.meta.rain && season() === 'summer' && min >= 660 && min <= 900 && !(P.eq && P.eq.hd)) f.expo.sol += gmin;
      if (f.expo.chuva > 150 && !f.expo.avisouC) { f.expo.avisouC = 1; adoecer('resfriado'); }
      if (f.expo.sol > 120 && !f.expo.avisouS) { f.expo.avisouS = 1; adoecer('insolacao'); }
      if (P.energy <= 0 && !f.expo.avisouE && Math.random() < 0.5) { f.expo.avisouE = 1; adoecer('costas'); }
    }
    const d = doenca();
    if (d && d.k === 'resfriado') { espirroT -= dt; if (espirroT <= 0) { espirroT = rnd(25, 60); toast('Atchim! 🤧', '', null, 'atchim'); tone(900, 300, 0.12, 'sawtooth', 0.04); } }
  }
  function doencaDano(mo) { if (mo && mo.kind === 'vespa' && Math.random() < 0.3) adoecer('picada'); }
  function consulta2HTML() {
    const d = doenca(), pr = 200;
    return `<p style="text-align:center">“Deita aqui que eu dou uma olhada.” A consulta cura toda a vida, devolve energia e trata qualquer doença.</p>
      ${d ? `<div class="item"><span class="nm"><b>${DOENCAS[d.k].ic} Diagnóstico: ${DOENCAS[d.k].n.toLowerCase()}</b><small>${DOENCAS[d.k].efeito}. Remédio certo: ${item(DOENCAS[d.k].cura).name.toLowerCase()}. Some sozinho em ${Math.max(1, 3 - (W.meta.day - d.d))} dia(s).</small></span></div>` : '<p style="text-align:center;font-size:13px">Você está com saúde! Cuidado com chuva sem capa, sol forte sem chapéu e vespas.</p>'}
      <div class="item"><span class="nm"><b>Consulta</b><small>Vida ${Math.round(P.hp)}/100 · energia +30${d ? ' · cura a doença' : ''}</small></span><span class="price">${pr} ₲</span><button class="btn g" data-a="consulta" type="button" ${gold() >= pr && (P.hp < 100 || d) ? '' : 'disabled'}>Consultar</button></div>`;
  }
  const doencaHUD = () => { const d = doenca(); return d ? `${DOENCAS[d.k].ic} ${DOENCAS[d.k].n}` : ''; };

  // ---------- mais roupas para ela (o ano todo) ----------
  Object.assign(MODA, {
    vestidofesta: { name: 'Vestido de festa', slot: 'cp', price: 7000, ela: true, bonus: { luck: 1 }, desc: 'Sorte +1.', vest: true, d: { top: '#c8204a', skirt: '#c8204a', trim: '#f4c83a', manga: 'alca', pad: 'brilho' } },
    saiajeans: { name: 'Saia jeans e blusa listrada', slot: 'cp', price: 5500, ela: true, bonus: { foraging: 1 }, desc: 'Coleta +1.', vest: true, d: { top: '#ffffff', skirt: '#4a7ab8', trim: '#e8402a', manga: 'curta', pad: 'listra' } },
    vestidopiquenique: { name: 'Vestido de piquenique', slot: 'cp', price: 6000, ela: true, bonus: { fishing: 1 }, desc: 'Pesca +1.', vest: true, d: { top: '#f8b0c8', skirt: '#f8b0c8', trim: '#e86a9a', manga: 'bufante', pad: 'xadrez' } },
    vestidopoa: { name: 'Vestido de poá', slot: 'cp', price: 6500, ela: true, bonus: { defense: 1, attack: 1 }, desc: '+1 de ataque e +1 de defesa.', vest: true, meia: '#2a2a32', d: { top: '#2a2a32', skirt: '#2a2a32', trim: '#e8402a', manga: 'curta', pad: 'bolinha' } },
    quimono: { name: 'Quimono florido', slot: 'cp', price: 6000, ela: true, bonus: { farming: 1 }, energia: 0.95, desc: 'Lavoura +1 e tudo gasta 5% menos energia.', vest: true, meia: '#f4ecd8', d: { top: '#3a6ab8', skirt: '#3a6ab8', trim: '#f4c83a', manga: 'longa', pad: 'flor' } },
    lacocabelo: { name: 'Laço de cabelo', slot: 'hd', price: 2500, ela: true, bonus: { luck: 1 }, desc: 'Sorte +1.' },
    chapeusol: { name: 'Chapéu de sol com flores', slot: 'hd', price: 3500, ela: true, bonus: { farming: 1 }, desc: 'Lavoura +1. Também protege do sol forte.' },
    sapatinhovermelho: { name: 'Sapatinho vermelho', slot: 'bt', price: 3000, ela: true, bonus: { luck: 1 }, desc: 'Sorte +1.', bota: '#d8203a' },
    tenisbranco: { name: 'Tênis branco', slot: 'bt', price: 3200, ela: true, bonus: { speed: 1 }, desc: 'Anda 10% mais rápido.', bota: '#f4f4f0' },
  });
  for (const k of ['vestidofesta', 'saiajeans', 'vestidopiquenique', 'vestidopoa', 'quimono', 'lacocabelo', 'chapeusol', 'sapatinhovermelho', 'tenisbranco']) { const r = MODA[k]; ROUPAS[k] = r; ITEMS[k] = { name: r.name, cat: 'roupa', slot: r.slot, sell: Math.round(r.price / 4), desc: r.desc }; if (r.bota) BOOT_COL[k] = r.bota; }
  function drawModaHat2(look, dir, hx, side) {
    const back = dir === 0;
    if (look.eqh === 'lacocabelo') { const c = '#e84a8a', bx = side ? hx + 1 : back ? hx + 6 : hx + 6; R(bx - 4, -2, 4, 4, c); R(bx + 2, -2, 4, 4, c); R(bx, -1, 2, 2, shade(c, -0.3)); R(bx - 3, -1, 2, 1, shade(c, 0.3)); R(bx + 3, -1, 2, 1, shade(c, 0.3)); R(bx - 1, 2, 1, 2, c); R(bx + 2, 2, 1, 2, c); return true; }
    if (look.eqh === 'chapeusol') { const S = '#f0d890', D = '#c8a860'; R(hx - 4, 2, 20, 2, S); R(hx - 4, 3, 20, 1, D); R(hx + 1, -3, 10, 5, S); R(hx + 2, -4, 8, 1, S); R(hx + 1, 0, 10, 1, '#5ab84a'); if (!back) for (const [dx, c] of [[2, '#e8402a'], [5, '#f4f0e8'], [8, '#f48ab8']]) { disc(hx + dx + (side ? -1 : 0), 0, 1.5, c); R(hx + dx + (side ? -1 : 0), 0, 1, 1, '#f4d040'); } return true; }
    return false;
  }
  const modaListEla = () => Object.keys(MODA).filter(k => MODA[k].ela).map(id => ({ id, price: MODA[id].price, one: true }));

  // ---------- gazebo novo: redondo, de colunas brancas e cúpula verde ----------
  function drawGazebo2(w, h, night, snow) {
    const cx = w / 2, c = '#fbf8f0', d = '#d8ccb8', cupula = snow ? '#e8eef4' : '#3a9a7a', cupD = snow ? '#c8d4e0' : '#2a7a5e';
    // plataforma de pedra com degraus
    oval(cx, h - 8, w / 2 + 2, 10, '#9a9288'); oval(cx, h - 10, w / 2, 9, '#c8c0b4'); oval(cx, h - 11, w / 2 - 4, 7, '#d8d0c4');
    R(cx - 10, h - 4, 20, 4, '#b0a89c'); R(cx - 8, h - 2, 16, 2, '#9a9288');
    // piso de tábuas lá dentro
    oval(cx, h - 12, w / 2 - 7, 5, '#c8a070'); for (let x = 12; x < w - 12; x += 5) R(x, h - 16, 1, 8, '#b08a5a');
    // colunas (6 à vista), com trepadeira de rosas nas da frente
    const cols = [6, 18, 31, w - 31, w - 18, w - 6].map(x => x - 2);
    for (const [i, x] of cols.entries()) { const fr = i === 0 || i === 5, y0 = 2, y1 = h - (fr ? 12 : 16); R(x, y0, 4, y1 - y0, c); R(x + 3, y0, 1, y1 - y0, d); R(x - 1, y1 - 2, 6, 2, d); if (fr) for (let y = 6; y < y1 - 4; y += 6) { disc(x + (y % 12 ? 0 : 4), y, 2, '#3a8a3a'); disc(x + (y % 12 ? 0 : 4), y - 1, 1.3, '#e85a7a'); } }
    // grade baixa entre as colunas (menos na entrada)
    for (const [a, b2] of [[cols[0], cols[1]], [cols[1], cols[2]], [cols[3], cols[4]], [cols[4], cols[5]]]) { R(a + 4, h - 26, b2 - a - 4, 2, c); for (let x = a + 6; x < b2; x += 3) R(x, h - 24, 1, 8, c); }
    // arcos de treliça entre as colunas
    ctx.strokeStyle = c; ctx.lineWidth = 2;
    for (let i = 0; i < cols.length - 1; i++) { const a = cols[i] + 4, b2 = cols[i + 1]; ctx.beginPath(); ctx.moveTo(a, 10); ctx.quadraticCurveTo((a + b2) / 2, 2, b2, 10); ctx.stroke(); }
    // beiral e cúpula
    R(-4, -2, w + 8, 5, c); R(-4, 2, w + 8, 1, d);
    for (let x = -4; x < w + 4; x += 6) poly([[x, 3], [x + 3, 7], [x + 6, 3]], c);
    ctx.fillStyle = shade(cupula, -0.3); ctx.beginPath(); ctx.ellipse(cx, -2, w / 2 + 2, 28, 0, Math.PI, 0); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.ellipse(cx, -2, w / 2, 26, 0, Math.PI, 0); ctx.clip();
    R(0, -30, w, 30, cupula); for (let i = -4; i <= 4; i++) { ctx.strokeStyle = cupD; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx + i * 9, -2); ctx.quadraticCurveTo(cx + i * 4, -18, cx, -28); ctx.stroke(); }
    for (let y = -24; y < -2; y += 6) R(0, y, w, 1, shade(cupula, 0.2));
    ctx.restore();
    // lanterninha e coração no topo
    R(cx - 4, -36, 8, 8, c); R(cx - 3, -35, 6, 6, night ? '#ffe8a0' : '#a8d8f0'); poly([[cx - 6, -36], [cx, -42], [cx + 6, -36]], cupD); R(cx - 1, -48, 2, 6, '#c8a050');
    disc(cx - 2, -50, 2, '#e84a6a'); disc(cx + 2, -50, 2, '#e84a6a'); poly([[cx - 4, -50], [cx, -45], [cx + 4, -50]], '#e84a6a');
    // luzinhas penduradas no beiral
    for (let i = 0; i < 9; i++) { const x = 2 + i * ((w - 4) / 8), y = 8 + Math.sin(i * 1.2) * 1.5; disc(x, y, 1.6, night ? ['#ffe08a', '#ff9ac8', '#9ae0ff'][i % 3] : '#d8d0c0'); }
    // vasos pendurados nas colunas do meio
    for (const x of [cols[2] + 2, cols[3] + 2]) { R(x, 10, 1, 4, '#8a8a92'); oval(x, 16, 4, 3, '#c86a3a'); disc(x - 2, 14, 2, '#3a8a3a'); disc(x + 2, 15, 1.6, '#e84a8a'); }
  }

  // ---------- bichos iguais para os dois: mina, mata e borboletas ----------
  // Quem tem o menor uid entre as pessoas no mesmo mapa é o "dono": move os bichos e manda as posições.
  // Os outros seguem as posições e mandam os golpes que deram; quem dá o último golpe ganha o prêmio.
  let syncT = 0, mobNet = new Map(), bugNetAt = 0, matouSids = [], pegouBugs = [];
  const outroNoMapa = () => !!room && peerPlayers().some(p => !p.me && p.map === P.map);
  function donoDoMapa() { const ps = peerPlayers().filter(p => p.map === P.map && p.uid); if (ps.length < 2) return true; return ps.map(p => p.uid).sort()[0] === P.uid; }
  function mobKey() { const m = curMap(); return m.id + '|' + (m.mata ? m.per : W.meta.day); }
  function mobIds(list) { list.forEach((mo, i) => { mo.sid = i + 1; mo.hpSync = mo.hp; }); mobNet.clear(); matouSids = []; }
  function mobMatou(mo) { if (mo && mo.sid) matouSids.push(mo.sid); }
  // o alvo dos bichos (no dono): a pessoa mais perto
  function alvoMob(mo) {
    let best = [P.x, P.y], bd = Math.hypot(P.x - mo.x, P.y - mo.y);
    if (room) for (const p of peerPlayers()) if (!p.me && p.map === P.map && p.x != null) { const dd = Math.hypot(p.x - mo.x, p.y - mo.y); if (dd < bd) { bd = dd; best = [p.x, p.y]; } }
    return best;
  }
  // nos outros: segue a posição que o dono mandou
  function mobSeguir(mo, dt) {
    if (!mo.sid || !room || donoDoMapa()) return false;
    const n = mobNet.get(mo.sid); if (!n || performance.now() - n.at > 1200) return false;
    const k = Math.min(1, dt * 8); mo.x += (n.x - mo.x) * k; mo.y += (n.y - mo.y) * k; mo.vx = 0; mo.vy = 0;
    return true;
  }
  function bugsSeguir(dt) {
    if (!room || donoDoMapa() || performance.now() - bugNetAt > 2500) return false;
    const t = performance.now() / 1000, k = Math.min(1, dt * 6);
    for (const b of bugs) { if (b.nx != null) { b.x += (b.nx - b.x) * k; b.y += (b.ny - b.y) * k; } b.h = 10 + Math.sin(t * 2 + (b.ph || 0)) * 3; }
    return true;
  }
  function bugPego(b) { if (b && b.uid && room && !donoDoMapa()) pegouBugs.push(b.uid); }
  function syncBichos(dt) {
    if (!room || !P || !W.meta) return;
    syncT -= dt; if (syncT > 0) return; syncT = 0.2;
    if (!outroNoMapa()) { matouSids = []; pegouBugs = []; return; }
    const m = curMap(), dono = donoDoMapa(), msg = { k: mobKey(), h: [], x: matouSids.splice(0) };
    for (const mo of monsters) if (mo.sid && mo.hpSync != null && mo.hp < mo.hpSync - 0.01) { msg.h.push([mo.sid, Math.round((mo.hpSync - mo.hp) * 10) / 10]); mo.hpSync = mo.hp; }
    if (pegouBugs.length) msg.bc = pegouBugs.splice(0);
    if (dono) {
      if (m.rocks || m.mata) msg.p = monsters.filter(mo => mo.sid && !mo.dead).map(mo => [mo.sid, Math.round(mo.x), Math.round(mo.y), Math.round(mo.hp)]);
      if (m.outdoor && !m.cave) { for (const b of bugs) if (!b.uid) b.uid = Math.random().toString(36).slice(2, 8); msg.b = bugs.map(b => [b.uid, b.id, Math.round(b.x), Math.round(b.y)]); }
    }
    if (msg.h.length || msg.x.length || msg.bc || msg.p || msg.b) room.emit('bichos', msg).catch(() => {});
  }
  function onBichos(ev) {
    if (!P || !W.meta || ev.sameTab) return;
    const d = ev.data || {}; if (d.k !== mobKey()) return;
    for (const [sid, dmg] of d.h || []) { const mo = monsters.find(x => x.sid === sid); if (!mo) continue; mo.hp -= dmg; mo.hpSync = mo.hp; mo.hitT = 0.15; if (mo.hp <= 0) mo.dead = true; }
    for (const sid of d.x || []) { const mo = monsters.find(x => x.sid === sid); if (mo) mo.dead = true; }
    if (d.p && !donoDoMapa()) {
      const vivos = new Set(d.p.map(a => a[0])), now = performance.now();
      for (const [sid, x, y, hp] of d.p) { mobNet.set(sid, { x, y, at: now }); const mo = monsters.find(z => z.sid === sid); if (mo && hp < mo.hp) { mo.hp = hp; mo.hpSync = hp; } }
      for (const mo of monsters) if (mo.sid && !vivos.has(mo.sid)) mo.dead = true;
    }
    monsters = monsters.filter(x => !x.dead || x.kind === 'boss' && x.hp > 0);
    if (d.bc && donoDoMapa()) bugs = bugs.filter(b => !d.bc.includes(b.uid));
    if (d.b && !donoDoMapa()) {
      bugNetAt = performance.now();
      const vistos = new Set();
      for (const [uid, id, x, y] of d.b) { if (!BUGS[id]) continue; vistos.add(uid); let b = bugs.find(z => z.uid === uid); if (!b) { b = { uid, id, x, y, hx: x, hy: y, tx: x, ty: y, a: 0, ph: Math.random() * 6, wait: 0, h: 10, life: 999 }; bugs.push(b); } b.nx = x; b.ny = y; }
      bugs = bugs.filter(b => vistos.has(b.uid));
    }
  }
