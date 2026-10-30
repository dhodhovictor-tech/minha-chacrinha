
  // ================= ícones dos itens novos =================
  const DISH = {
    ovofrito: ['plate', '#ffffff', '#f4c020'], omelete: ['plate', '#f4d040', '#7ab83a'], pao: ['bread', '#d8944a', '#a8642a'], sashimi: ['plate', '#f08a7a', '#ffffff'],
    panqueca: ['stack', '#e8b060', '#a85a1a'], rosti: ['plate', '#d8a040', '#a86a20'], peixeassado: ['plate', '#c88a5a', '#f4e8c0'], carpasurpresa: ['plate', '#a8945a', '#5a3a1a'],
    percafrita: ['plate', '#d8a040', '#f4e8c0'], tortaabobora: ['pie', '#e88a2a', '#c8884a'], salada: ['bowl', '#5ab83a', '#e8402a'], pizza: ['pizza', '#e8c050', '#d83a2a'],
    sopatruta: ['bowl', '#e8a0a8', '#f4e8d0'], maki: ['maki', '#2a3a2a', '#ffffff'], saladafrutas: ['bowl', '#e8402a', '#4a5ae0'], tacopeixe: ['taco', '#e8c070', '#5ab83a'],
    enguiapicante: ['plate', '#5a4a3a', '#e8302a'], sopamariscos: ['bowl', '#f4f0e0', '#d8c0a0'], bolinhosiri: ['plate', '#d8944a', '#e8a060'], bisque: ['bowl', '#e8803a', '#ffffff'],
    sopaabobora: ['bowl', '#f08a2a', '#ffffff'], biscoito: ['cookie', '#d8a050', '#5a3418'], sorvete: ['cone', '#f8f0f0', '#f0a0c0'], arrozdoce: ['bowl', '#f8f4e8', '#c88a4a'],
    tortamirtilo: ['pie', '#4a5ae0', '#d8a050'], couveflorqueijo: ['plate', '#f8e8a0', '#fff8e8'], parmegiana: ['plate', '#d8302a', '#f8e8a0'], ensopadovagem: ['bowl', '#6ac84a', '#a86a3a'],
    cogumelofrito: ['plate', '#c88a5a', '#8a5a3a'], sopapastinaca: ['bowl', '#f4e8c8', '#7ab83a'], almocofazenda: ['plate', '#f4d040', '#f4e8c8'], hamburguer: ['burger', '#c88a3a', '#6a3a1a'],
    lanchemineiro: ['bowl', '#e8803a', '#f8f4e8'], torradamel: ['bread', '#d8944a', '#f0a820'], bolomel: ['pie', '#e8b050', '#f0a820'], churrasco: ['skewer', '#8a3a2a', '#e8302a'], ovosbacon: ['plate', '#f4c020', '#d86a5a'], bife: ['plate', '#8a4a2a', '#f4e8c0'], carnepanela: ['bowl', '#8a4a2a', '#e8a040'],
    hamburguercasa: ['burger', '#c88a3a', '#6a2a1a'], feijoada: ['bowl', '#2a1a1a', '#f4f0e0'], lombo: ['plate', '#d8906a', '#e0302a'], costelinha: ['plate', '#a84a2a', '#f0a820'], jantarsalmao: ['plate', '#e86a4a', '#3a8a4a'], cafereforcado: ['plate', '#f4c020', '#d8a040'],
  };
  function paintIcon2(id, it) {
    const blob = (x, y, rx, ry, c) => oval(x, y, rx, ry, c);
    const sack = (c, lab) => { poly([[3, 15], [2, 7], [5, 4], [11, 4], [14, 7], [13, 15]], c); R(5, 2, 6, 3, shade(c, -0.15)); R(6, 1, 4, 1, '#8a6a3a'); R(5, 8, 6, 5, lab); R(4, 5, 2, 8, shade(c, 0.2)); };
    const bottle = (c, cap = '#5a3a1a') => { R(6, 1, 4, 3, cap); R(7, 4, 2, 2, '#d8e8e0'); R(4, 6, 8, 9, c); R(4, 6, 8, 1, shade(c, 0.3)); R(5, 7, 1, 7, '#ffffff66'); R(5, 9, 6, 4, '#f4e8c8'); };
    const jar = (c, lid = '#c8a06a') => { R(3, 4, 10, 11, '#e8f0f4'); R(4, 6, 8, 8, c); R(3, 2, 10, 3, lid); R(4, 7, 2, 4, '#ffffff66'); };
    const jug = (c, big) => { R(4, 4, 8, 11, c); R(5, 2, 6, 2, c); R(6, 1, 4, 1, '#c8c0b0'); R(12, 6, 2, 5, c); R(12, 6, 1, 1, '#8a8a8a'); R(5, 8, 6, 4, big ? '#e8402a' : '#3a8ad8'); R(5, 5, 1, 9, '#ffffff'); };
    const mineral = (c, d) => { poly([[8, 1], [14, 6], [12, 14], [4, 14], [2, 6]], d); poly([[8, 2], [12, 6], [10, 12], [5, 12], [4, 6]], c); R(6, 4, 2, 2, '#ffffff'); };
    if (id === 'mel' || String(id).startsWith('mel:')) { R(3, 5, 10, 10, '#c8780a'); R(4, 6, 8, 8, '#f0a820'); R(3, 2, 10, 3, '#8a5a2a'); R(3, 2, 10, 1, '#b07a3a'); R(5, 7, 2, 5, '#ffd870'); R(4, 4, 3, 3, '#f0a820'); if (it.base) { disc(10, 10, 2.5, item(it.base).col || '#ffffff'); R(9, 9, 1, 1, '#ffffff'); } return true; }
    if (FLOWERS[id]) {
      const c = it.col;
      R(7, 7, 2, 8, '#3a8a2a'); poly([[8, 12], [3, 9], [5, 13]], '#4aa83a'); poly([[8, 11], [13, 8], [11, 12]], '#4aa83a');
      if (id === 'girassol') { for (let a = 0; a < 10; a++) disc(8 + Math.cos(a / 10 * TAU) * 4, 5 + Math.sin(a / 10 * TAU) * 4, 2, c); disc(8, 5, 3, '#6a3a12'); R(7, 4, 1, 1, '#9a6a2a'); return true; }
      for (let a = 0; a < 5; a++) disc(8 + Math.cos(a / 5 * TAU - 1.57) * 3, 5 + Math.sin(a / 5 * TAU - 1.57) * 3, 2.3, c);
      disc(8, 5, 1.6, '#ffe04a'); R(6, 3, 1, 1, '#ffffff'); return true;
    }
    switch (id) {
      case 'balde': R(3, 6, 10, 9, '#a8b0b8'); R(3, 6, 10, 2, '#d8e0e8'); R(4, 7, 8, 2, '#ffffff'); R(3, 14, 10, 1, '#6a7078'); ctx.strokeStyle = '#6a7078'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(8, 6, 5, Math.PI, 0); ctx.stroke(); return true;
      case 'tesoura': R(7, 1, 2, 9, '#d8e0e8'); R(9, 1, 2, 9, '#a8b0b8'); disc(6, 12, 3, '#e8402a'); disc(11, 12, 3, '#e8402a'); disc(6, 12, 1.4, '#ffffff00'); R(5, 11, 2, 2, '#2b1a12'); R(10, 11, 2, 2, '#2b1a12'); return true;
      case 'ovo': case 'ovogrande': case 'ovomarrom': case 'ovopato': { const big = id === 'ovogrande'; blob(8, 9, big ? 5.5 : 4.5, big ? 6.5 : 5.5, it.col); R(6, 5, 2, 2, '#ffffff'); if (id === 'ovopato') R(9, 10, 2, 1, '#a8c0a0'); return true; }
      case 'pena': ctx.fillStyle = '#f4f4f8'; ctx.beginPath(); ctx.moveTo(3, 14); ctx.quadraticCurveTo(4, 3, 13, 2); ctx.quadraticCurveTo(12, 10, 3, 14); ctx.fill(); ctx.strokeStyle = '#a8a8b8'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(3, 14); ctx.lineTo(12, 3); ctx.stroke(); return true;
      case 'la': for (const [x, y, r] of [[5, 9, 4], [10, 8, 4.5], [8, 11, 4], [7, 5, 3.5], [11, 12, 3]]) disc(x, y, r, '#f4f0e8'); R(6, 5, 2, 1, '#ffffff'); R(5, 12, 6, 1, '#d8d0c4'); return true;
      case 'pecoelho': blob(8, 7, 4, 5, '#e8e0d8'); R(6, 11, 4, 4, '#c8a87a'); R(5, 13, 6, 2, '#8a6a4a'); R(7, 4, 2, 2, '#ffffff'); return true;
      case 'leite': case 'leitegrande': jug('#f8f8f8', id === 'leitegrande'); return true;
      case 'leitecabra': case 'leitecabragrande': jug('#f4ecd8', id === 'leitecabragrande'); return true;
      case 'trufa': for (const [x, y, r] of [[7, 9, 5], [10, 8, 4], [8, 6, 3.5]]) disc(x, y, r, '#5a3a2a'); for (const [x, y] of [[6, 7], [9, 10], [11, 7]]) R(x, y, 1, 1, '#8a6a4a'); return true;
      case 'feno': for (let x = 3; x < 14; x += 2) R(x, 3 + (x % 3), 2, 11, x % 4 ? '#e8c860' : '#c8a040'); R(2, 8, 12, 2, '#8a6a20'); return true;
      case 'maionese': case 'maionesepato': jar(it.col, '#e8e0d0'); return true;
      case 'queijo': poly([[1, 12], [14, 6], [14, 13], [1, 15]], '#e8c040'); poly([[1, 12], [14, 6], [12, 4]], '#f8e070'); for (const [x, y] of [[5, 13], [10, 11], [12, 8]]) R(x, y, 2, 1, '#c89a20'); return true;
      case 'queijocabra': blob(8, 10, 7, 4, '#e8e0cc'); blob(8, 8, 7, 4, '#f8f4e8'); R(4, 6, 4, 1, '#ffffff'); return true;
      case 'tecido': R(2, 5, 12, 9, '#c8b8e0'); R(2, 5, 12, 2, '#e8e0f8'); R(2, 9, 12, 1, '#a898c8'); for (let x = 3; x < 14; x += 3) R(x, 7, 1, 7, '#b8a8d8'); return true;
      case 'oleotrufa': bottle('#d8c040', '#3a3a3a'); return true;
      case 'hidromel': bottle('#e8b040', '#6a3a1a'); return true;
      case 'xarope': bottle('#a85a1a'); return true;
      case 'resina': blob(8, 9, 5, 5, '#e8a030'); R(6, 6, 2, 2, '#fff0a0'); return true;
      case 'alcatrao': jar('#3a2a20', '#6a6a6a'); return true;
      case 'farinha': sack('#f4f0e8', '#e8c860'); return true;
      case 'acucar': sack('#f8f8ff', '#f0a0c0'); return true;
      case 'arroz': sack('#e8dcc0', '#7ab83a'); return true;
      case 'oleo': bottle('#f0d050', '#3a8a3a'); return true;
      case 'vinagre': bottle('#c8402a', '#3a3a3a'); return true;
      case 'maionesera': case 'queijeira': case 'tear': case 'prensaoleo': case 'colmeia': case 'covo': ctx.drawImage(obj2Canvas(id), 0, 4, 18, 22, 1, 0, 14, 16); return true;
      case 'extrator': R(4, 5, 8, 9, '#8a8a92'); R(4, 5, 8, 2, '#c8c8d0'); R(7, 2, 2, 4, '#6a6a72'); R(9, 2, 4, 2, '#6a6a72'); R(5, 10, 6, 3, '#a85a1a'); return true;
      case 'isca': ctx.strokeStyle = '#d87a7a'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(3, 12); ctx.quadraticCurveTo(6, 4, 9, 10); ctx.quadraticCurveTo(12, 15, 13, 5); ctx.stroke(); R(12, 4, 2, 2, '#f0a0a0'); return true;
      case 'alianca': ctx.strokeStyle = '#f4c83a'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(8, 10, 5, 4.5, 0, 0, TAU); ctx.stroke(); poly([[8, 1], [11, 4], [8, 7], [5, 4]], '#bff8ff'); R(7, 3, 1, 1, '#ffffff'); return true;
      case 'carnebovina': case 'carnesuina': { const c = it.col; ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(2, 8); ctx.quadraticCurveTo(3, 2, 10, 3); ctx.quadraticCurveTo(15, 5, 14, 10); ctx.quadraticCurveTo(10, 15, 4, 13); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#f8e8e0'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(4, 7); ctx.quadraticCurveTo(8, 5, 12, 8); ctx.stroke(); disc(11, 10, 1.6, '#f8f0e8'); return true; }
      case 'charque': for (let k = 0; k < 3; k++) { R(2 + k * 4, 2 + k, 3, 12 - k, '#7a2e22'); R(2 + k * 4, 2 + k, 1, 12 - k, '#a84a3a'); } return true;
      case 'bacon': for (let k = 0; k < 2; k++) { ctx.strokeStyle = '#d86a5a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1, 5 + k * 6); for (let x = 1; x <= 15; x += 2) ctx.lineTo(x, 5 + k * 6 + (x % 4 ? 1.5 : -1.5)); ctx.stroke(); ctx.strokeStyle = '#f8e0d0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(1, 5 + k * 6); for (let x = 1; x <= 15; x += 2) ctx.lineTo(x, 5 + k * 6 + (x % 4 ? 1.5 : -1.5)); ctx.stroke(); } return true;
      case 'defumador': ctx.drawImage(obj2Canvas(id), 0, 4, 18, 22, 1, 0, 14, 16); return true;
      case 'frutaestelar': poly([[8, 1], [10, 6], [15, 6], [11, 9], [13, 15], [8, 11], [3, 15], [5, 9], [1, 6], [6, 6]], '#a85ae0'); poly([[8, 3], [9, 7], [12, 7], [9, 9], [8, 12], [7, 9], [4, 7], [7, 7]], '#e8b0ff'); R(7, 5, 1, 1, '#ffffff'); return true;
      case 'pontaflecha': poly([[8, 1], [13, 9], [8, 15], [3, 9]], '#8a8a96'); poly([[8, 3], [11, 9], [8, 12]], '#b8b8c4'); return true;
      case 'osso': R(4, 6, 8, 4, '#f0e8d0'); disc(3, 6, 2, '#f0e8d0'); disc(3, 10, 2, '#f0e8d0'); disc(13, 6, 2, '#f0e8d0'); disc(13, 10, 2, '#f0e8d0'); R(5, 7, 6, 1, '#ffffff'); return true;
      case 'moeda': disc(8, 8, 6, '#c8962a'); disc(8, 8, 4.5, '#e8b83a'); R(7, 5, 2, 6, '#a87a1a'); R(6, 4, 2, 1, '#fff0a0'); return true;
      case 'vaso': poly([[4, 2], [12, 2], [14, 9], [11, 15], [5, 15], [2, 9]], '#c8703a'); R(4, 6, 8, 2, '#8a4a20'); poly([[10, 2], [12, 2], [13, 7]], '#2b1a12'); return true;
      case 'estatueta': R(6, 12, 5, 3, '#6a5a3a'); disc(8, 4, 2.5, '#d8b040'); R(6, 6, 5, 6, '#d8b040'); R(5, 7, 1, 3, '#d8b040'); R(11, 7, 1, 3, '#d8b040'); R(7, 3, 1, 1, '#fff0a0'); return true;
      case 'amonite': disc(8, 8, 6.5, '#b8a080'); ctx.strokeStyle = '#7a6040'; ctx.lineWidth = 1; ctx.beginPath(); for (let a = 0; a < 13; a += 0.25) { const r = 0.5 + a * 0.45; ctx.lineTo(8 + Math.cos(a) * r, 8 + Math.sin(a) * r); } ctx.stroke(); return true;
      case 'boneca': disc(8, 4, 3, '#f0d0b0'); R(5, 7, 6, 7, '#c84a6a'); R(4, 8, 1, 4, '#f0d0b0'); R(11, 8, 1, 4, '#f0d0b0'); R(6, 1, 4, 2, '#8a5a2a'); R(7, 4, 1, 1, '#2a1a10'); R(9, 4, 1, 1, '#2a1a10'); return true;
      case 'ovodino': oval(8, 9, 5.5, 6.5, '#d8e0a8'); for (const [x, y] of [[6, 6], [10, 9], [7, 12], [9, 4]]) R(x, y, 2, 2, '#8a9a5a'); R(6, 4, 1, 2, '#ffffff'); return true;
      case 'concha': ctx.fillStyle = '#f4e0c8'; ctx.beginPath(); ctx.arc(8, 9, 6, 0, TAU); ctx.fill(); ctx.strokeStyle = '#c86a3a'; ctx.lineWidth = 1; ctx.beginPath(); for (let a = 0; a < 12; a += 0.3) { const r = a * 0.5; ctx.lineTo(8 + Math.cos(a) * r, 9 + Math.sin(a) * r); } ctx.stroke(); return true;
      case 'coral': for (const [x, y, h] of [[5, 6, 9], [8, 3, 12], [11, 5, 10]]) R(x, y, 2, h, '#f07a8a'); R(4, 8, 3, 2, '#f07a8a'); R(10, 7, 4, 2, '#f07a8a'); R(8, 3, 1, 3, '#ffb0c0'); R(3, 14, 10, 1, '#c84a5a'); return true;
      case 'ourico': for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; R(8 + Math.cos(a) * 6, 9 + Math.sin(a) * 5, 1, 1, '#4a1a5a'); } disc(8, 9, 4.5, '#7a3a8a'); R(6, 7, 2, 1, '#b07ac0'); return true;
      case 'geodo': case 'geodogelo': case 'geodomagma': { const c = { geodo: ['#9a8a7a', '#c8b8a8'], geodogelo: ['#8aa8c8', '#c8e0f0'], geodomagma: ['#a84a3a', '#e88a5a'] }[id]; disc(8, 9, 6, c[0]); disc(7, 8, 4, c[1]); ctx.strokeStyle = '#3a2a20'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(4, 7); ctx.lineTo(7, 10); ctx.lineTo(9, 7); ctx.lineTo(12, 10); ctx.stroke(); return true; }
      case 'jaspe': mineral('#c8503a', '#8a2a1a'); return true;
      case 'malaquita': mineral('#3ab87a', '#1a6a4a'); R(4, 9, 8, 1, '#1a6a4a'); return true;
      case 'pedralua': mineral('#d8e4f8', '#8a9ac8'); return true;
      case 'obsidiana': mineral('#3a3a4a', '#1a1a24'); return true;
      case 'opala': mineral('#f8a04a', '#c8502a'); R(8, 8, 2, 2, '#6ae0ff'); R(6, 10, 2, 1, '#ff6ad8'); return true;
      case 'ectoplasma': blob(8, 10, 6, 5, '#a8f0a0'); blob(8, 9, 4, 3.5, '#d8ffd0'); R(5, 13, 2, 2, '#a8f0a0'); R(10, 13, 2, 2, '#a8f0a0'); return true;
    }
    if (it.cat === 'fish' && it.shell === 1) { blob(8, 10, 5, 3.5, it.col); R(2, 6, 3, 3, it.col); R(11, 6, 3, 3, it.col); R(3, 5, 1, 1, shade(it.col, 0.4)); for (const x of [4, 7, 10]) R(x, 13, 1, 2, shade(it.col, -0.3)); R(6, 8, 1, 1, '#000'); R(9, 8, 1, 1, '#000'); return true; }
    if (it.cat === 'fish' && it.shell === 2) { ctx.fillStyle = it.col; ctx.beginPath(); ctx.moveTo(8, 14); ctx.lineTo(2, 6); ctx.quadraticCurveTo(8, 0, 14, 6); ctx.closePath(); ctx.fill(); ctx.strokeStyle = shade(it.col, -0.35); ctx.lineWidth = 1; for (const x of [5, 8, 11]) { ctx.beginPath(); ctx.moveTo(8, 14); ctx.lineTo(x, 4); ctx.stroke(); } return true; }
    if (FTREES[id]) {
      const c = it.col;
      if (id === 'cereja') { for (const x of [5, 11]) { disc(x, 11, 3, c); R(x - 1, 9, 1, 1, '#ffffff'); } ctx.strokeStyle = '#4a7a2a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(5, 8); ctx.lineTo(9, 2); ctx.lineTo(11, 8); ctx.stroke(); R(9, 2, 3, 2, '#5aa83a'); return true; }
      disc(8, 9, 6, c); R(5, 6, 2, 2, '#ffffff88'); R(8, 2, 1, 3, '#5a3a1a'); R(9, 2, 3, 2, '#5aa83a');
      if (id === 'pessego') R(8, 5, 1, 8, shade(c, -0.2)); if (id === 'roma') { R(6, 2, 5, 2, shade(c, -0.3)); for (const [x, y] of [[6, 9], [9, 10], [7, 12]]) R(x, y, 1, 1, '#ff8aa8'); }
      return true;
    }
    if (it.cat === 'sapling') { R(4, 10, 8, 5, '#c86a3a'); R(4, 10, 8, 1, '#e08a5a'); R(7, 4, 2, 7, '#7a4a24'); for (const [x, y] of [[5, 4], [10, 4], [7, 2]]) blob(x, y, 2.5, 2, '#4aa83a'); disc(10, 6, 1.4, FTREES[it.tree].col); return true; }
    const dsh = DISH[id];
    if (dsh) {
      const [k, a, b] = dsh;
      if (k === 'bread') { blob(8, 10, 7, 4, shade(a, -0.15)); blob(8, 9, 6, 3, a); R(5, 8, 1, 2, b); R(9, 8, 1, 2, b); return true; }
      if (k === 'cookie') { for (const [x, y] of [[6, 9], [10, 7], [9, 11]]) { disc(x, y, 3.5, a); R(x - 1, y - 1, 1, 1, b); R(x + 1, y + 1, 1, 1, b); } return true; }
      if (k === 'cone') { poly([[5, 8], [11, 8], [8, 15]], '#d8a050'); disc(8, 6, 3.5, a); disc(8, 4, 2.5, b); return true; }
      if (k === 'skewer') { R(1, 8, 14, 1, '#a8a8b0'); for (let i = 0; i < 4; i++) { R(2 + i * 3, 5, 3, 7, i % 2 ? b : a); R(2 + i * 3, 5, 3, 1, shade(i % 2 ? b : a, 0.3)); } return true; }
      if (k === 'burger') { blob(8, 6, 6, 3, a); R(2, 8, 12, 2, '#5ab83a'); R(2, 10, 12, 2, b); blob(8, 13, 6, 2, a); R(5, 5, 1, 1, '#f8e8c0'); return true; }
      if (k === 'taco') { ctx.fillStyle = a; ctx.beginPath(); ctx.arc(8, 11, 6, Math.PI, 0); ctx.fill(); R(3, 8, 10, 2, b); R(5, 7, 2, 1, '#e8402a'); return true; }
      if (k === 'maki') { for (const x of [5, 11]) { disc(x, 9, 3.5, a); disc(x, 9, 2.4, b); R(x - 1, 8, 2, 2, '#e8803a'); } return true; }
      if (k === 'pizza') { poly([[2, 4], [14, 4], [8, 15]], a); R(2, 3, 12, 2, '#c8884a'); for (const [x, y] of [[6, 6], [9, 8], [8, 11]]) disc(x, y, 1.4, b); return true; }
      if (k === 'pie') { blob(8, 11, 7, 3.5, '#c8884a'); blob(8, 9, 6, 3, a); R(4, 7, 8, 1, '#e8b070'); R(6, 9, 1, 1, '#ffffff66'); return true; }
      if (k === 'stack') { for (let i = 0; i < 3; i++) blob(8, 12 - i * 3, 6, 2, i % 2 ? shade(a, -0.1) : a); R(5, 4, 6, 2, b); R(7, 6, 2, 3, b); return true; }
      if (k === 'bowl') { ctx.fillStyle = '#e8e0d0'; ctx.beginPath(); ctx.arc(8, 8, 7, 0, Math.PI); ctx.fill(); oval(8, 8, 7, 2.2, a); R(5, 7, 2, 1, b); R(9, 8, 2, 1, b); R(4, 13, 8, 1, '#b8b0a0'); return true; }
      blob(8, 10, 7, 4, '#e8eef4'); blob(8, 10, 5.5, 2.8, '#ffffff'); blob(8, 9, 4, 2.5, a); R(6, 8, 2, 1, b); R(9, 9, 2, 1, b);
      return true;
    }
    return false;
  }
