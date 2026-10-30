
  // ================= flores e mel =================
  // a colmeia faz mel do sabor da flor madura mais perto (até 5 quadrados); sem flor, sai mel silvestre
  const FLOWERS = {
    tulipa: { name: 'Tulipa', seed: 20, sell: 30, days: 6, seasons: ['spring'], kind: 'flower', col: '#e84a6a', leaf: '#4aa83a', cat: 'flower' },
    jazz: { name: 'Jazz-azul', seed: 30, sell: 50, days: 7, seasons: ['spring'], kind: 'flower', col: '#5a8ae8', leaf: '#4aa83a', cat: 'flower' },
    papoula: { name: 'Papoula', seed: 100, sell: 140, days: 7, seasons: ['summer'], kind: 'flower', col: '#e8302a', leaf: '#4a9a3a', cat: 'flower' },
    flordeverao: { name: 'Flor-de-verão', seed: 50, sell: 90, days: 8, seasons: ['summer'], kind: 'flower', col: '#e87ad8', leaf: '#4a9a3a', cat: 'flower' },
    girassol: { name: 'Girassol', seed: 200, sell: 80, days: 8, seasons: ['summer', 'fall'], kind: 'sunflower', col: '#f4c820', leaf: '#4a9a3a', cat: 'flower' },
    rosafada: { name: 'Rosa-fada', seed: 200, sell: 290, days: 12, seasons: ['fall'], kind: 'flower', col: '#f0a8d8', leaf: '#4a8a3a', cat: 'flower' },
  };
  for (const [k, c] of Object.entries(FLOWERS)) {
    CROPS[k] = c;
    ITEMS[k] = { name: c.name, cat: 'flower', sell: c.sell, col: c.col, desc: 'Abelhas por perto fazem mel com o sabor desta flor.' };
    ITEMS['s_' + k] = { name: 'Sementes de ' + c.name.toLowerCase(), cat: 'seed', sell: Math.floor(c.seed / 2), crop: k, desc: `Plante na ${c.seasons.map(s => SEASONS[SEASON_ID.indexOf(s)].toLowerCase()).join(' ou ')}. Floresce em ${c.days} dias. Perto de uma colmeia, dá mel de ${c.name.toLowerCase()}. Na estufa cresce o ano todo.` };
  }
  ART.mel = { name: 'Mel de', price: p => 100 + 2 * p, from: 'flower' };
  Object.assign(ITEMS.mel, { name: 'Mel silvestre', kind: 'mel', desc: 'Plante flores perto da colmeia para fazer mel de outros sabores.' });
  ITEMS.hidromel = { name: 'Hidromel', cat: 'art', sell: 300, energy: 75, col: '#e8b040', desc: 'Feito de mel no barril.' };
  ART_BASE.hidromel = 'mel';
  ANY['*mel'] = ['mel', ...Object.keys(FLOWERS).map(k => 'mel:' + k)];
  const colm = RECIPES.find(r => r.id === 'colmeia');
  colm.need = { madeira: 40, carvao: 8, barracobre: 1 }; colm.skill = ['farming', 1];
  ITEMS.colmeia.desc = 'Dá mel a cada 4 dias (menos no inverno). Flores maduras por perto mudam o sabor do mel.';
  for (const r of [
    { id: 'torradamel', name: 'Torrada com mel', need: { pao: 1, '*mel': 1 }, en: 120, sell: 220, learn: 'start', buff: { speed: 1 } },
    { id: 'bolomel', name: 'Bolo de mel', need: { farinha: 1, '*ovo': 1, '*mel': 1 }, en: 180, sell: 380, learn: 'npc:nena:3' },
  ]) { COOK.push(r); ITEMS[r.id] = { name: r.name, cat: 'food', sell: r.sell, energy: r.en, buff: r.buff, desc: r.buff ? 'Dá ' + Object.entries(r.buff).map(([k, v]) => `${BUFF_NAMES[k]} +${v}`).join(', ') + ' por um tempo.' : '' }; }
  NPCS.nena.likes.push('*flower'); NPCS.bia.likes.push('*flower'); NPCS.nena.loves.push('mel:rosafada');
  // mel do sabor da flor madura mais próxima da colmeia
  function honeyAt(k) {
    const pre = k.startsWith('g:') ? 'g:' : '', [x, y] = k.slice(pre.length).split(',').map(Number);
    let best = null, bd = 99;
    for (let dy = -5; dy <= 5; dy++) for (let dx = -5; dx <= 5; dx++) {
      const d = Math.abs(dx) + Math.abs(dy); if (d > 5 || d >= bd) continue;
      const t = W.farm.t[pre + (x + dx) + ',' + (y + dy)], c = t && t.c;
      if (c && !c.dead && FLOWERS[c.id] && c.g >= CROPS[c.id].days) { best = c.id; bd = d; }
    }
    return best ? 'mel:' + best : 'mel';
  }
