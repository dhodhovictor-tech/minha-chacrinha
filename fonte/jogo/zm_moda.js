
  // ================= moda da estação (Ateliê da Bia) =================
  // Para ela: uma coleção nova a cada estação (vestidos, saias, chapéus e sapatos), vendida só naquela estação.
  // Os bônus da coleção valem na estação dela. Para ele: dois conjuntos (aventureiro e rancheiro) o ano todo.
  const EST_NOME = { spring: 'primavera', summer: 'verão', fall: 'outono', winter: 'inverno' };
  const MODA = {
    // primavera
    vestidoflorido: { name: 'Vestido florido', slot: 'cp', price: 4800, est: 'spring', bonus: { foraging: 1 }, desc: 'Na primavera, Coleta +1.', vest: true, d: { top: '#f8a8c8', skirt: '#f48ab8', trim: '#ffffff', manga: 'bufante', pad: 'flor' } },
    jardineira: { name: 'Jardineira com blusinha', slot: 'cp', price: 4500, est: 'spring', bonus: { farming: 1 }, desc: 'Na primavera, Lavoura +1.', vest: true, d: { top: '#f8e070', skirt: '#6a9ad8', trim: '#4a7ab8', manga: 'curta', pad: 'jardineira' } },
    chapeuprimavera: { name: 'Chapéu de aba com laço', slot: 'hd', price: 3200, est: 'spring', bonus: { luck: 1 }, desc: 'Na primavera, Sorte +1.' },
    sapatilhas: { name: 'Sapatilhas rosa', slot: 'bt', price: 2800, est: 'spring', bonus: { speed: 1 }, desc: 'Na primavera, anda 10% mais rápido.', bota: '#f48ab8' },
    // verão
    vestidoverao: { name: 'Vestido de alcinha', slot: 'cp', price: 4800, est: 'summer', bonus: { fishing: 1 }, desc: 'No verão, Pesca +1.', vest: true, d: { top: '#8ad0f0', skirt: '#8ad0f0', trim: '#ffffff', manga: 'alca', pad: 'bolinha' } },
    shortblusa: { name: 'Short e blusinha', slot: 'cp', price: 3800, est: 'summer', bonus: { speed: 1 }, desc: 'No verão, anda 10% mais rápido.', vest: true, short: '#4a7ab8', d: { top: '#ffffff', trim: '#f4a020', manga: 'alca', pad: 'listra' } },
    chapeupraia: { name: 'Chapéu de praia', slot: 'hd', price: 3200, est: 'summer', bonus: { luck: 1 }, desc: 'No verão, Sorte +1.' },
    sandalias: { name: 'Sandálias', slot: 'bt', price: 2600, est: 'summer', bonus: { foraging: 1 }, desc: 'No verão, Coleta +1.', bota: '#d8a060' },
    // outono
    vestidoxadrez: { name: 'Vestido xadrez de outono', slot: 'cp', price: 5000, est: 'fall', bonus: { farming: 1 }, desc: 'No outono, Lavoura +1.', vest: true, meia: '#5a3a2a', d: { top: '#c8642a', skirt: '#c8642a', trim: '#7a2a1a', manga: 'longa', pad: 'xadrez' } },
    cardiga: { name: 'Cardigã e saia', slot: 'cp', price: 4600, est: 'fall', bonus: { foraging: 1 }, desc: 'No outono, Coleta +1.', vest: true, meia: '#4a2a2a', d: { top: '#e0a830', skirt: '#7a4a2a', trim: '#f4f0e8', manga: 'longa', pad: 'cardiga' } },
    boina: { name: 'Boina', slot: 'hd', price: 3000, est: 'fall', bonus: { luck: 1 }, desc: 'No outono, Sorte +1.' },
    botinhas: { name: 'Botinhas de outono', slot: 'bt', price: 3400, est: 'fall', bonus: { defense: 1 }, desc: 'No outono, +1 de defesa.', bota: '#7a4a2a' },
    // inverno
    vestidola: { name: 'Vestido de lã', slot: 'cp', price: 5200, est: 'winter', bonus: { defense: 1 }, energia: 0.95, desc: 'No inverno, +1 de defesa e tudo gasta 5% menos energia.', vest: true, meia: '#3a2a3a', d: { top: '#c8323a', skirt: '#c8323a', trim: '#ffffff', manga: 'longa', pad: 'trico' } },
    casacopelucia: { name: 'Casaco de pelúcia', slot: 'cp', price: 5600, est: 'winter', bonus: { mining: 1 }, desc: 'No inverno, Mineração +1.', vest: true, meia: '#4a3a5a', d: { top: '#f0e4d0', skirt: '#f0e4d0', trim: '#c8a880', manga: 'longa', pad: 'pelucia' } },
    toucapompom: { name: 'Touca de pompom', slot: 'hd', price: 3000, est: 'winter', bonus: { luck: 1 }, desc: 'No inverno, Sorte +1.' },
    botasneve: { name: 'Botas de neve', slot: 'bt', price: 3600, est: 'winter', bonus: { speed: 1 }, desc: 'No inverno, anda 10% mais rápido.', bota: '#f4f0ec' },
    // para ele: aventureiro
    chapeuexplorador: { name: 'Chapéu de explorador', slot: 'hd', price: 4200, ele: true, bonus: { mining: 1 }, desc: 'Mineração +1.' },
    jaquetacouro: { name: 'Jaqueta de couro', slot: 'cp', price: 6500, ele: true, bonus: { attack: 1, defense: 1 }, desc: '+1 de ataque e +1 de defesa.' },
    botasaventura: { name: 'Botas de aventureiro', slot: 'bt', price: 4800, ele: true, bonus: { foraging: 1, speed: () => (curMap().mata || curMap().cave ? 1 : 0) }, desc: 'Coleta +1 e anda 10% mais rápido na mata e na mina.', bota: '#5a3a1a' },
    // para ele: rancheiro
    chapeuvaqueiro: { name: 'Chapéu de rancheiro', slot: 'hd', price: 4200, ele: true, bonus: { luck: 1 }, desc: 'Sorte +1.' },
    camisarancheiro: { name: 'Camisa de rancheiro', slot: 'cp', price: 6000, ele: true, bonus: { farming: 1, fishing: 1 }, desc: 'Lavoura +1 e Pesca +1.' },
    botasrancheiro: { name: 'Botas de rancheiro', slot: 'bt', price: 4600, ele: true, bonus: { defense: 1, speed: 1 }, desc: '+1 de defesa e anda 10% mais rápido.', bota: '#8a4a1a' },
  };
  for (const [k, r] of Object.entries(MODA)) { ROUPAS[k] = r; ITEMS[k] = { name: r.name, cat: 'roupa', slot: r.slot, sell: Math.round(r.price / 4), desc: r.desc }; if (r.bota) BOOT_COL[k] = r.bota; }

  // bônus das roupas vestidas (somados aos das comidas em buffLv)
  function roupaBuff(k) {
    const e = P && P.eq; if (!e) return 0;
    let n = 0;
    for (const id of Object.values(e)) { const r = MODA[id]; if (!r || !r.bonus || r.bonus[k] == null || (r.est && r.est !== season())) continue; const v = r.bonus[k]; n += typeof v === 'function' ? v() : v; }
    return n;
  }
  function modaEnergia() { const e = P && P.eq; let f = 1; for (const id of Object.values(e || {})) { const r = MODA[id]; if (r && r.energia && (!r.est || r.est === season())) f *= r.energia; } return f; }

  // ---------- loja: coleção da estação e "para ele" ----------
  const modaList = tab => tab === 'moda' ? Object.keys(MODA).filter(k => MODA[k].est === season()).map(id => ({ id, price: MODA[id].price, one: true }))
    : tab === 'ele' ? Object.keys(MODA).filter(k => MODA[k].ele).map(id => ({ id, price: MODA[id].price, one: true })) : null;
  for (const k of ['roupas', 'bia']) Object.defineProperty(SHOP_INFO[k], 'tabs', { get: () => [['moda', 'Coleção de ' + EST_NOME[season()]], ['ele', 'Para ele'], ['buy', 'Trabalho'], ['sell', 'Vender']], configurable: true });
  for (const k of ['roupas', 'bia']) SHOP_INFO[k].greet = () => `“Chegou a coleção de ${EST_NOME[season()]}! Cada estação eu costuro coisas novas.”`;

  // ---------- desenho no personagem ----------
  function drawModa(look, dir, step, side) {
    const r = MODA[look.eqc]; if (!r) return false;
    const skin = SKINS[look.skin || 0], sD = shade(skin, -0.16), a = step, back = dir === 0;
    if (look.eqc === 'jaquetacouro') {
      const B = '#6a3a1a', D = '#4a2810', L = '#8a5a2a', tee = '#f4f0e8';
      if (!side) {
        R(3, 15, 10, 8, B); R(3, 15, 10, 1, L); R(11, 16, 2, 7, D);
        if (!back) { R(6, 15, 4, 7, tee); R(5, 15, 1, 4, L); R(10, 15, 1, 4, L); R(5, 20, 1, 2, D); } else R(7, 16, 2, 6, D);
        R(1, 16 + a, 2, 6, B); R(13, 16 - a, 2, 6, D); R(1, 21 + a, 2, 1, D); R(1, 22 + a, 2, 2, skin); R(13, 22 - a, 2, 2, sD);
      } else { const f = step * 2; R(3, 15, 10, 8, B); R(3, 15, 10, 1, L); R(10, 15, 2, 5, tee); R(7 + f, 16, 3, 6, D); R(8 + f, 16, 1, 5, B); R(7 + f, 22, 3, 2, skin); }
      return true;
    }
    if (look.eqc === 'camisarancheiro') {
      const J = '#5a8ac8', JD = '#3a6aa8', V = '#8a5a2a', VD = '#6a3a1a', Rd = '#c83a3a';
      if (!side) {
        R(3, 15, 10, 8, J); R(11, 16, 2, 7, JD);
        if (!back) { R(3, 15, 3, 8, V); R(10, 15, 3, 8, V); R(4, 17, 1, 1, '#f4c83a'); R(11, 17, 1, 1, '#f4c83a'); R(5, 14, 6, 2, Rd); R(7, 16, 2, 2, Rd); }
        else { R(3, 15, 10, 8, V); R(3, 15, 10, 1, VD); R(5, 14, 6, 2, Rd); }
        R(1, 16 + a, 2, 6, J); R(13, 16 - a, 2, 6, JD); R(1, 22 + a, 2, 2, skin); R(13, 22 - a, 2, 2, sD);
      } else { const f = step * 2; R(3, 15, 10, 8, V); R(9, 15, 3, 8, J); R(5, 14, 6, 2, Rd); R(7 + f, 16, 3, 6, JD); R(8 + f, 16, 1, 5, J); R(7 + f, 22, 3, 2, skin); }
      return true;
    }
    const d = r.d; if (!d) return false;
    const top = d.top, tD = shade(top, -0.25), tL = shade(top, 0.25), sk = d.skirt, kD = sk && shade(sk, -0.25);
    const longa = d.manga === 'longa', alca = d.manga === 'alca', curta = d.manga === 'curta' || d.manga === 'bufante';
    if (!side) {
      R(3, 15, 10, 7, top); R(3, 15, 10, 1, tL); R(11, 16, 2, 6, tD);
      if (alca) { R(3, 15, 10, 2, skin); R(4, 15, 1, 2, top); R(11, 15, 1, 2, top); }
      if (sk) { R(3, 21, 10, 1, d.trim); R(2, 22, 12, 2, sk); R(1, 24, 14, 3, sk); R(1, 26, 14, 1, kD); R(5, 23, 1, 3, kD); R(10, 23, 1, 3, kD); R(2, 22, 1, 2, shade(sk, 0.2)); }
      else if (r.short) { const s = r.short; R(3, 21, 10, 1, d.trim); R(4, 22, 8, 3, s); R(4, 24, 3, 1, shade(s, -0.25)); R(9, 24, 3, 1, shade(s, -0.25)); R(7, 22, 2, 1, shade(s, -0.25)); }
      R(1, 16 + a, 2, 6, longa ? top : skin); R(13, 16 - a, 2, 6, longa ? tD : sD);
      if (curta) { R(1, 16 + a, 2, 2, top); R(13, 16 - a, 2, 2, tD); if (d.manga === 'bufante') { R(0, 16 + a, 1, 2, top); R(15, 16 - a, 1, 2, tD); } }
      if (longa) { R(1, 21 + a, 2, 1, d.trim); R(13, 21 - a, 2, 1, d.trim); }
      R(1, 22 + a, 2, 2, skin); R(13, 22 - a, 2, 2, sD);
    } else {
      const f = step * 2;
      R(3, 15, 10, 7, top); R(3, 15, 10, 1, tL);
      if (alca) { R(3, 15, 10, 2, skin); R(7, 15, 1, 2, top); }
      if (sk) { R(3, 21, 10, 1, d.trim); R(3, 22, 10, 2, sk); R(2, 24, 12, 3, sk); R(2, 26, 12, 1, kD); R(6, 23, 1, 3, kD); R(11, 22, 1, 4, kD); }
      else if (r.short) { R(3, 21, 10, 1, d.trim); R(5, 22, 7, 3, r.short); R(5, 24, 7, 1, shade(r.short, -0.25)); }
      R(7 + f, 16, 3, 6, longa ? tD : sD); R(8 + f, 16, 1, 5, longa ? top : skin);
      if (curta) R(7 + f, 16, 3, 2, top);
      if (longa) R(7 + f, 21, 3, 1, d.trim);
      R(7 + f, 22, 3, 2, skin);
    }
    modaPadrao(d, back, side, step);
    return true;
  }
  function modaPadrao(d, back, side, step) {
    const sk = d.skirt, f = step * 2;
    switch (d.pad) {
      case 'flor':
        for (const [x, y] of side ? [[5, 17], [9, 19], [4, 24], [8, 25], [11, 23]] : [[5, 17], [9, 19], [4, 24], [8, 25], [12, 24], [6, 22], [10, 17]]) { R(x, y, 1, 1, '#ffffff'); R(x + 1, y, 1, 1, '#f4e060'); }
        break;
      case 'jardineira':
        if (!side) { if (!back) { R(5, 17, 6, 5, sk); R(5, 15, 1, 2, sk); R(10, 15, 1, 2, sk); R(7, 18, 2, 2, shade(sk, -0.25)); R(5, 17, 1, 1, '#f4c83a'); R(10, 17, 1, 1, '#f4c83a'); } else { R(4, 18, 8, 4, sk); R(5, 15, 1, 3, sk); R(10, 15, 1, 3, sk); } }
        else { R(4, 17, 8, 5, sk); R(8, 15, 1, 2, sk); }
        break;
      case 'bolinha':
        for (let y = 18; y < 27; y += 3) for (let x = (y % 2 ? 3 : 4); x < 13; x += 3) if (!side || (x > 3 && x < 12)) R(x, y, 1, 1, '#ffffff');
        break;
      case 'listra': for (const y of [17, 19]) R(3, y, 10, 1, d.trim); break;
      case 'xadrez': {
        const L = d.trim;
        for (const x of side ? [5, 9] : [5, 10]) R(x, 15, 1, 12, L);
        for (const y of [18, 24]) R(side ? 2 : 1, y, side ? 12 : 14, 1, L);
        R(side ? 3 : 3, 21, 10, 1, '#3a1a10');
        break;
      }
      case 'cardiga':
        if (!side) { if (!back) { R(6, 15, 4, 6, d.trim); R(5, 17, 1, 1, '#7a4a2a'); R(5, 19, 1, 1, '#7a4a2a'); } }
        else R(10, 15, 2, 6, d.trim);
        break;
      case 'trico':
        R(side ? 5 : 4, 14, side ? 6 : 8, 2, '#ffffff'); R(side ? 2 : 1, 26, side ? 12 : 14, 1, '#ffffff');
        for (let x = side ? 3 : 2; x < 13; x += 3) R(x, 24, 1, 1, shade(d.top, -0.3));
        break;
      case 'pelucia':
        R(side ? 5 : 4, 14, side ? 6 : 8, 2, shade(d.top, 0.3));
        if (!side && !back) { R(8, 15, 1, 12, shade(d.top, -0.2)); for (const y of [17, 20, 23]) R(9, y, 2, 1, '#8a5a3a'); }
        for (let k = 0; k < 10; k++) R(2 + (k * 7) % 11, 16 + (k * 5) % 10, 1, 1, shade(d.top, -0.12));
        break;
    }
  }
  function drawModaHat(look, dir, hx, side) {
    const back = dir === 0;
    switch (look.eqh) {
      case 'chapeuprimavera': {
        const S = '#f4e0a0', D = '#d8c070', Rb = '#f48ab8';
        R(hx - 3, 2, 18, 2, S); R(hx - 3, 3, 18, 1, D); R(hx + 1, -3, 10, 5, S); R(hx + 2, -4, 8, 1, S); R(hx + 1, 0, 10, 2, Rb);
        const bx = side ? hx : back ? hx + 6 : hx + 10; R(bx - 1, -1, 4, 3, Rb); R(bx, 0, 2, 1, shade(Rb, -0.3)); R(bx, 2, 1, 3, Rb); R(bx + 2, 2, 1, 2, Rb);
        return true;
      }
      case 'chapeupraia': {
        const W = '#f8f4ec', D = '#d8d0c0';
        R(hx - 4, 2, 20, 2, W); R(hx - 5, 3, 2, 2, W); R(hx + 15, 3, 2, 2, W); R(hx - 4, 4, 20, 1, D); R(hx + 1, -3, 10, 5, W); R(hx + 2, -4, 8, 1, W); R(hx + 1, 0, 10, 2, '#2a2a2a');
        if (!back) disc(hx + (side ? 2 : 10), 0, 1.8, '#f4c83a');
        return true;
      }
      case 'boina': {
        const C = '#8a2a3a', L = '#b04a5a';
        R(hx - 1, 0, 14, 3, C); R(hx, -1, 12, 1, C); R(side ? hx + 1 : hx - 2, 1, 4, 2, C); R(hx + 1, 0, 5, 1, L); R(hx + 6, -2, 1, 1, '#5a1a2a'); R(hx, 3, 12, 1, shade(C, -0.3));
        return true;
      }
      case 'toucapompom': {
        const P2 = '#f48ab8', D = '#d8689a';
        R(hx, -1, 12, 4, P2); R(hx + 1, -2, 10, 1, P2); for (let x = hx + 1; x < hx + 12; x += 2) R(x, -1, 1, 3, D);
        R(hx - 1, 2, 14, 2, '#ffffff'); disc(hx + 6, -4, 3, '#ffffff'); R(hx + 5, -5, 1, 1, '#f8d8e8');
        return true;
      }
      case 'chapeuexplorador': {
        const K = '#c8b080', D = '#a89060';
        R(hx - 2, 2, 16, 2, D); R(hx + 1, -3, 10, 5, K); R(hx + 2, -4, 8, 1, K); R(hx + 1, 0, 10, 1, '#6a5030'); R(hx + 4, -4, 4, 1, shade(K, 0.2));
        return true;
      }
      case 'chapeuvaqueiro': {
        const C = '#8a5a2a', D = '#6a3a1a';
        R(hx - 3, 2, 18, 2, C); R(hx - 4, 0, 2, 3, C); R(hx + 14, 0, 2, 3, C); R(hx - 3, 3, 18, 1, D);
        R(hx + 1, -4, 10, 6, C); R(hx + 5, -4, 2, 1, D); R(hx + 1, 0, 10, 1, '#2a1a10'); R(hx + 2, -3, 2, 3, shade(C, 0.2));
        return true;
      }
    }
    return false;
  }

  // ---------- ícones ----------
  function paintIcon11(id) {
    const r = MODA[id]; if (!r) return false;
    if (r.slot === 'bt') { const c = r.bota; for (const ox of [0, 6]) { R(2 + ox, 5, 4, 6, c); R(3 + ox, 5, 2, 5, shade(c, 0.3)); R(2 + ox, 11, 6, 3, c); R(2 + ox, 13, 6, 1, shade(c, -0.5)); } return true; }
    if (r.slot === 'hd') {
      const c = { chapeuprimavera: '#f4e0a0', chapeupraia: '#f8f4ec', boina: '#8a2a3a', toucapompom: '#f48ab8', chapeuexplorador: '#c8b080', chapeuvaqueiro: '#8a5a2a' }[id];
      if (id === 'boina') { oval(8, 9, 7, 3.5, c); R(7, 4, 2, 2, shade(c, -0.3)); R(4, 8, 4, 1, shade(c, 0.3)); return true; }
      if (id === 'toucapompom') { R(3, 7, 10, 6, c); R(3, 11, 10, 3, '#ffffff'); disc(8, 5, 3, '#ffffff'); return true; }
      oval(8, 11, 7.5, 2.5, shade(c, -0.15)); oval(8, 8, 4.5, 4, c); R(4, 9, 8, 1, id === 'chapeuprimavera' ? '#f48ab8' : id === 'chapeupraia' ? '#2a2a2a' : '#5a3a1a');
      if (id === 'chapeuprimavera') { R(11, 7, 3, 3, '#f48ab8'); }
      return true;
    }
    if (id === 'jaquetacouro' || id === 'camisarancheiro') {
      const c = id === 'jaquetacouro' ? '#6a3a1a' : '#5a8ac8';
      poly([[4, 3], [12, 3], [14, 7], [12, 8], [12, 15], [4, 15], [4, 8], [2, 7]], c);
      if (id === 'jaquetacouro') R(6, 3, 4, 11, '#f4f0e8'); else { R(4, 4, 2, 11, '#8a5a2a'); R(10, 4, 2, 11, '#8a5a2a'); R(6, 3, 4, 2, '#c83a3a'); }
      return true;
    }
    const d = r.d, sk = d.skirt || r.short;
    poly([[5, 2], [11, 2], [12, 7], [4, 7]], d.top);
    if (d.manga !== 'alca') { R(2, 3, 3, d.manga === 'longa' ? 7 : 3, d.top); R(11, 3, 3, d.manga === 'longa' ? 7 : 3, d.top); }
    R(4, 7, 8, 1, d.trim);
    if (d.skirt) poly([[4, 8], [12, 8], [14, 15], [2, 15]], sk); else { R(4, 8, 8, 4, sk); R(7, 10, 2, 2, '#ffffff00'); }
    if (d.pad === 'flor' || d.pad === 'bolinha') for (const [x, y] of [[5, 10], [9, 12], [11, 10], [6, 13], [8, 4]]) R(x, y, 1, 1, '#ffffff');
    if (d.pad === 'xadrez') { R(6, 2, 1, 13, d.trim); R(10, 2, 1, 13, d.trim); R(3, 11, 10, 1, d.trim); }
    if (d.pad === 'jardineira') { R(5, 4, 6, 4, sk); R(5, 2, 1, 2, sk); R(10, 2, 1, 2, sk); }
    if (d.pad === 'trico' || d.pad === 'pelucia') { R(5, 2, 6, 1, '#ffffff'); R(2, 14, 12, 1, d.pad === 'trico' ? '#ffffff' : shade(d.top, -0.2)); }
    if (d.pad === 'cardiga') R(7, 2, 2, 5, d.trim);
    return true;
  }
