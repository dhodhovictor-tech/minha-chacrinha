  // ================= ícones dos itens (16x16) =================
  const iconCache = new Map(), urlCache = new Map();
  const METAL = ['#9aa0a8', '#e0883a', '#d8e0e8', '#f4c83a'];
  function paintIcon(id, lv) {
    const it = item(id), [a, b] = String(id).split(':');
    const blob = (x, y, rx, ry, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill(); };
    const out = c => { ctx.strokeStyle = c; ctx.lineWidth = 1; ctx.stroke(); };
    const m = METAL[lv || 0];
    if (paintIcon2(id, it)) return;
    switch (id) {
      case 'hoe': R(3, 12, 2, 2, '#6a3a1a'); for (let k = 0; k < 9; k++) R(4 + k, 11 - k, 2, 2, '#a86a3a'); R(10, 2, 5, 3, m); R(13, 2, 2, 6, m); return;
      case 'can': R(3, 6, 9, 8, m); R(3, 6, 9, 2, '#ffffff66'); R(11, 5, 4, 2, m); R(13, 3, 2, 3, m); R(4, 3, 6, 2, '#6a6a6a'); R(4, 3, 1, 4, '#6a6a6a'); R(9, 3, 1, 4, '#6a6a6a'); return;
      case 'axe': for (let k = 0; k < 11; k++) R(3 + k, 13 - k, 2, 2, '#a86a3a'); R(9, 2, 6, 7, m); R(9, 2, 2, 7, '#ffffff55'); return;
      case 'pick': for (let k = 0; k < 11; k++) R(3 + k, 13 - k, 2, 2, '#a86a3a'); ctx.strokeStyle = m; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(11, 7, 7, -2.6, -0.2); ctx.stroke(); return;
      case 'scythe': for (let k = 0; k < 11; k++) R(3 + k * 0.3, 14 - k, 2, 1, '#a86a3a'); ctx.strokeStyle = m; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(10, 8, 6, -2.8, -0.6); ctx.stroke(); return;
      case 'rod': for (let k = 0; k < 13; k++) R(2 + k, 14 - k, 1, 1, '#8a5428'); R(2, 12, 3, 3, '#3a3a3a'); ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(14.5, 2); ctx.lineTo(14.5, 12); ctx.stroke(); R(14, 12, 2, 2, '#e8402a'); return;
      case 'sword': for (let k = 0; k < 9; k++) R(6 + k, 9 - k, 2, 2, '#d8e0e8'); R(6, 9, 2, 1, '#ffffff'); R(3, 8, 5, 2, '#8a6a2a'); R(5, 6, 2, 6, '#8a6a2a'); R(2, 12, 3, 3, '#5a3a1a'); return;
      case 'madeira': R(1, 6, 14, 6, '#8a5428'); R(1, 6, 14, 2, '#a86a3a'); blob(14, 9, 2, 3, '#d8a868'); R(13, 9, 1, 1, '#8a5428'); return;
      case 'pedra': blob(8, 9, 6, 5, '#7a7068'); blob(7, 8, 5, 4, '#9a9088'); R(5, 6, 2, 2, '#b8b0a6'); return;
      case 'fibra': for (const [x, c] of [[4, '#5aa83a'], [7, '#3e8a2a'], [10, '#5aa83a'], [12, '#3e8a2a']]) R(x, 3, 2, 12, c); R(3, 9, 11, 2, '#c8a86a'); return;
      case 'seiva': blob(8, 10, 4, 4, '#c88a3a'); ctx.fillStyle = '#c88a3a'; ctx.beginPath(); ctx.moveTo(8, 3); ctx.lineTo(4, 9); ctx.lineTo(12, 9); ctx.fill(); R(6, 8, 2, 2, '#f4c86a'); return;
      case 'carvao': blob(8, 9, 6, 5, '#2a2a2a'); R(5, 6, 2, 2, '#5a5a5a'); R(9, 10, 2, 1, '#4a4a4a'); return;
      case 'cobre': case 'ferro': case 'ouro': { blob(8, 9, 6, 5, '#7a7068'); blob(7, 8, 5, 4, '#9a9088'); const c = { cobre: '#e8823a', ferro: '#e8e8f4', ouro: '#ffd23a' }[id]; for (const [x, y] of [[5, 7], [9, 6], [8, 10], [11, 9]]) R(x, y, 2, 2, c); return; }
      case 'barracobre': case 'barraferro': case 'barraouro': { const c = { barracobre: ['#e8823a', '#a85a1a'], barraferro: ['#e0e4ec', '#8a909a'], barraouro: ['#ffe04a', '#c8962a'] }[id]; ctx.fillStyle = c[1]; ctx.beginPath(); ctx.moveTo(1, 13); ctx.lineTo(4, 6); ctx.lineTo(15, 6); ctx.lineTo(13, 13); ctx.fill(); ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(4, 6); ctx.lineTo(6, 4); ctx.lineTo(15, 4); ctx.lineTo(15, 6); ctx.fill(); R(5, 8, 6, 1, '#ffffff88'); return; }
      case 'gosma': blob(8, 10, 6, 5, '#5ae05a'); R(5, 7, 3, 2, '#c8ffc8'); return;
      case 'asamorcego': ctx.fillStyle = '#5a3a6a'; ctx.beginPath(); ctx.moveTo(2, 6); ctx.lineTo(14, 4); ctx.lineTo(11, 9); ctx.lineTo(8, 8); ctx.lineTo(5, 12); ctx.fill(); return;
      case 'bau': R(1, 4, 14, 10, '#a86a3a'); R(1, 4, 14, 4, '#c8884a'); R(1, 8, 14, 1, '#6a3a1a'); R(6, 7, 4, 3, '#f4c83a'); return;
      case 'pote': R(3, 3, 10, 12, '#8a6a4a'); R(4, 4, 8, 2, '#a88a6a'); R(5, 7, 6, 6, '#c8885a'); R(4, 2, 8, 2, '#5a4a3a'); return;
      case 'barril': R(3, 2, 10, 13, '#8a5428'); for (const y of [4, 8, 12]) R(3, y, 10, 1, '#4a4a52'); R(6, 2, 4, 13, '#a86a3a'); return;
      case 'fornalha': R(3, 2, 10, 13, '#8a8a8a'); R(5, 8, 6, 5, '#ff8a2a'); R(3, 2, 10, 2, '#aaaaaa'); return;
      case 'irrigador': R(6, 8, 5, 5, '#c8823a'); R(7, 4, 2, 5, '#a86a2a'); R(5, 3, 6, 2, '#e8a85a'); return;
      case 'espantalho': R(7, 3, 2, 12, '#7a4a24'); R(3, 7, 10, 2, '#7a4a24'); R(5, 7, 6, 5, '#c84a2a'); R(5, 1, 6, 5, '#e8c870'); return;
      case 'tocha': R(7, 6, 2, 9, '#6a3a1a'); R(6, 2, 4, 5, '#ff9a2a'); R(7, 3, 2, 2, '#ffe04a'); return;
      case 'cerca': R(3, 3, 2, 12, '#a86a3a'); R(11, 3, 2, 12, '#a86a3a'); R(1, 6, 14, 2, '#c8884a'); R(1, 10, 14, 2, '#c8884a'); return;
      case 'caminho': R(1, 3, 14, 11, '#9a9088'); R(2, 4, 5, 4, '#b8b0a6'); R(8, 4, 6, 5, '#b0a89e'); R(3, 9, 6, 4, '#a8a096'); return;
      case 'pao': blob(8, 10, 7, 4, '#c8843a'); blob(8, 9, 6, 3, '#e8a85a'); R(5, 8, 1, 2, '#a8682a'); R(9, 8, 1, 2, '#a8682a'); return;
      case 'salada': blob(8, 11, 7, 3, '#f4f0e0'); blob(6, 9, 3, 3, '#5ab83a'); blob(10, 9, 3, 3, '#7ac84a'); R(8, 7, 2, 2, '#e8402a'); return;
      case 'quartzo': case 'ametista': case 'topazio': case 'esmeralda': case 'diamante': {
        const c = { quartzo: ['#f0f0ff', '#c8c8e8'], ametista: ['#c86ae8', '#8a3ac8'], topazio: ['#f4c83a', '#d8902a'], esmeralda: ['#4ae88a', '#2aa85a'], diamante: ['#d8ffff', '#8ae0f0'] }[id];
        ctx.fillStyle = c[1]; ctx.beginPath(); ctx.moveTo(8, 2); ctx.lineTo(14, 7); ctx.lineTo(8, 15); ctx.lineTo(2, 7); ctx.fill(); ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(8, 2); ctx.lineTo(11, 7); ctx.lineTo(8, 12); ctx.lineTo(5, 7); ctx.fill(); R(6, 5, 2, 2, '#ffffff'); return;
      }
    }
    // sementes: saquinho com a cor da planta
    if (it.cat === 'seed') { const c = CROPS[it.crop]; R(3, 3, 10, 12, '#e8d0a0'); R(3, 3, 10, 2, '#c8a870'); R(5, 7, 6, 5, c.col); R(6, 8, 2, 1, '#ffffff'); R(7, 1, 2, 3, '#c8a870'); return; }
    if (it.cat === 'fish') { blob(7, 9, 6, 3.5, it.col); ctx.fillStyle = it.col; ctx.beginPath(); ctx.moveTo(12, 9); ctx.lineTo(15, 5); ctx.lineTo(15, 13); ctx.fill(); R(3, 8, 1, 1, '#000'); R(5, 7, 5, 1, '#ffffff66'); return; }
    if (it.cat === 'art') {
      const c = it.col || '#c8402a';
      if (a === 'vinho' || a === 'suco') { R(6, 1, 4, 4, a === 'vinho' ? '#3a2a1a' : '#e8e0d0'); R(4, 5, 8, 10, a === 'vinho' ? '#5a1a2a' : '#f4f0e0'); R(5, 7, 6, 7, c); R(5, 7, 1, 6, '#ffffff66'); return; }
      R(3, 4, 10, 11, '#e8f0f4'); R(4, 6, 8, 8, a === 'conserva' ? '#7ab84a' : c); R(3, 2, 10, 3, '#c8a06a'); R(4, 7, 2, 4, '#ffffff66'); if (a === 'conserva') R(6, 8, 4, 2, c); return;
    }
    const crop = CROPS[id];
    if (crop) {
      const c = crop.col, l = crop.leaf;
      switch (id) {
        case 'pastinaca': case 'batata': case 'inhame': ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(4, 6); ctx.lineTo(12, 6); ctx.lineTo(8, 15); ctx.fill(); if (id !== 'pastinaca') blob(8, 9, 5, 4, c); R(6, 1, 2, 5, l); R(9, 2, 2, 4, l); R(5, 7, 2, 2, '#ffffff55'); return;
        case 'couveflor': blob(8, 11, 7, 4, l); blob(8, 8, 5, 4, c); R(6, 6, 2, 2, '#ffffff'); return;
        case 'couve': for (const [x, y] of [[5, 8], [10, 8], [8, 5]]) blob(x, y, 4, 5, c); R(7, 10, 2, 5, '#7ab84a'); return;
        case 'vagem': for (const x of [5, 9]) { R(x, 3, 3, 11, c); R(x, 3, 1, 11, '#ffffff44'); } R(6, 1, 4, 2, l); return;
        case 'morango': ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(3, 6); ctx.lineTo(13, 6); ctx.lineTo(8, 15); ctx.fill(); R(4, 3, 8, 3, l); for (const [x, y] of [[6, 8], [9, 9], [7, 11]]) R(x, y, 1, 1, '#ffe04a'); return;
        case 'melao': blob(8, 9, 7, 6, c); for (const x of [4, 8, 12]) R(x, 4, 1, 10, '#4a9a2a'); R(5, 5, 2, 2, '#ffffff66'); return;
        case 'abobora': blob(8, 10, 7, 5, c); R(7, 5, 1, 10, '#c86a1a'); R(4, 6, 1, 8, '#c86a1a'); R(11, 6, 1, 8, '#c86a1a'); R(7, 2, 2, 4, '#5a3a1a'); return;
        case 'tomate': case 'pimenta': case 'berinjela': if (id === 'pimenta') { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(4, 5); ctx.quadraticCurveTo(14, 4, 12, 15); ctx.quadraticCurveTo(6, 8, 4, 5); ctx.fill(); } else blob(8, 9, id === 'berinjela' ? 5 : 6, id === 'berinjela' ? 6 : 5, c); R(6, 2, 5, 3, l); R(5, 6, 2, 2, '#ffffff66'); return;
        case 'mirtilo': case 'oxicoco': case 'uva': for (const [x, y] of id === 'uva' ? [[5, 5], [9, 5], [7, 8], [11, 8], [5, 10], [9, 11], [7, 13]] : [[5, 7], [10, 6], [7, 11], [11, 11]]) blob(x, y, 2.5, 2.5, c); R(7, 1, 2, 4, l); return;
        case 'trigo': for (const x of [5, 8, 11]) { R(x, 6, 1, 9, '#c8a84a'); blob(x, 4, 1.8, 3.5, c); } return;
        case 'milho': blob(8, 9, 3.5, 6.5, c); for (let y = 5; y < 14; y += 2) R(6, y, 5, 1, '#e8b82a'); R(3, 8, 3, 7, '#7ab83a'); R(11, 8, 3, 7, '#7ab83a'); return;
      }
    }
    if (it.cat === 'forage') {
      switch (id) {
        case 'alhoporo': R(7, 2, 2, 8, '#5ab83a'); R(5, 2, 2, 6, '#7ad84a'); R(6, 10, 4, 5, '#f4f0e0'); return;
        case 'narciso': R(7, 7, 2, 8, '#4a9a2a'); for (const [x, y] of [[8, 3], [5, 5], [11, 5], [8, 7]]) blob(x, y, 2.5, 2.5, '#fff4a0'); blob(8, 5, 1.8, 1.8, '#f4a83a'); return;
        case 'cebolinha': R(6, 2, 2, 9, '#5ab83a'); R(9, 3, 2, 8, '#5ab83a'); blob(8, 12, 3, 3, '#f4f0e0'); return;
        case 'dentedeleao': R(7, 8, 2, 7, '#5aa83a'); blob(8, 6, 4, 4, '#ffe04a'); return;
        case 'ervilhadoce': R(7, 7, 2, 8, '#5aa83a'); blob(6, 5, 3, 3, '#e87ab8'); blob(10, 5, 3, 3, '#c85a98'); return;
        case 'cogumelo': R(6, 8, 4, 6, '#f4e8d0'); blob(8, 7, 6, 4, '#c88a5a'); R(5, 5, 2, 1, '#e8b88a'); return;
        case 'avela': blob(8, 9, 5, 5, '#a8682a'); R(6, 3, 4, 4, '#5a8a2a'); return;
        case 'raizinverno': ctx.fillStyle = '#a86a5a'; ctx.beginPath(); ctx.moveTo(4, 4); ctx.lineTo(12, 4); ctx.lineTo(8, 15); ctx.fill(); return;
        case 'frutacristal': ctx.fillStyle = '#8ad8f8'; ctx.beginPath(); ctx.moveTo(8, 2); ctx.lineTo(14, 8); ctx.lineTo(8, 14); ctx.lineTo(2, 8); ctx.fill(); R(6, 5, 2, 2, '#ffffff'); return;
        case 'acafrao': R(7, 8, 2, 7, '#5aa83a'); blob(8, 6, 4, 4, '#b07ae8'); R(7, 5, 2, 2, '#ffe04a'); return;
        default: for (const [x, y] of [[5, 7], [10, 6], [7, 11], [11, 11]]) blob(x, y, 2.5, 2.5, id === 'baga' ? '#e8402a' : id === 'amora' ? '#3a2a5a' : '#6a3ac8'); R(7, 2, 2, 4, '#4a9a2a'); return;
      }
    }
    R(4, 4, 8, 8, '#c8a06a');
  }
  function iconCanvas(id, lv = 0) {
    const key = id + '|' + lv;
    if (iconCache.has(key)) return iconCache.get(key);
    const c = document.createElement('canvas'); c.width = 16; c.height = 16;
    const saved = ctx; ctx = c.getContext('2d');
    try { paintIcon(id, lv); } catch (e) { console.warn(e); }
    ctx = saved;
    pixelize(c, OUT);
    iconCache.set(key, c);
    return c;
  }
  function drawIconAt(id, x, y, s = 1, lv = 0) { ctx.drawImage(iconCanvas(id, lv), Math.round(x), Math.round(y), 16 * s, 16 * s); }
  function iconURL(id, lv = 0) {
    const key = id + '|' + lv;
    if (urlCache.has(key)) return urlCache.get(key);
    const c = document.createElement('canvas'); c.width = 32; c.height = 32;
    const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(iconCanvas(id, lv), 0, 0, 32, 32);
    const u = c.toDataURL(); urlCache.set(key, u); return u;
  }
