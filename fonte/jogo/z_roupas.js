  // ================= roupas equipadas aparecem no personagem =================
  // O desenho da pessoa (farmerCanvas) recebe no "look" o que está vestido: eqh (cabeça), eqc (corpo), eqm (mãos) e a cor da bota.
  const BOOT_COL = { galochas: '#f4c020', botastrilha: '#7a5a3a', botasmata: '#4a6a2a', botascouro: '#8a5a32', botasvelozes: '#3a7ad0', botasferro: '#8a8e9a', botasdragao: '#b82a22' };
  const GLOVE_COL = { luvasjardim: '#5aa83a', luvascouro: '#8a5a2a' };
  function withEq(look, eq) {
    if (!eq || !look) return look;
    const o = { ...look }, h = eq.hd, c = eq.cp, m = eq.mao, b = eq.bt;
    if (h) { o.eqh = h; o.hat = ''; }
    if (c) o.eqc = c;
    if (m && GLOVE_COL[m]) o.eqm = m;
    if (b && BOOT_COL[b]) o.boot = BOOT_COL[b];
    if (c === 'macacao') o.pants = '#3a5aa8';
    const rv = c && ROUPAS[c]; if (rv && rv.vest) o.pants = rv.meia || SKINS[look.skin || 0];
    return o;
  }
  // corpo e mãos (desenhado depois da roupa normal e antes da cabeça)
  function drawEqBody(look, dir, step, side) {
    const c = look.eqc, back = dir === 0;
    switch (c) {
      case 'macacao': {
        const B = '#3a5aa8', D = '#2a4a8a';
        if (back) { R(4, 15, 1, 7, B); R(11, 15, 1, 7, B); R(4, 19, 8, 4, B); }
        else if (side) { R(5, 18, 7, 5, B); R(8, 14, 1, 4, B); R(6, 19, 3, 2, D); }
        else { R(4, 18, 8, 5, B); R(5, 17, 6, 1, B); R(4, 14, 1, 4, B); R(11, 14, 1, 4, B); R(6, 19, 4, 2, D); R(4, 17, 1, 1, '#f4c020'); R(11, 17, 1, 1, '#f4c020'); }
        break;
      }
      case 'avental': {
        const W = '#f4f0e8', D = '#d8d0c0';
        if (back) { R(4, 19, 8, 1, W); R(7, 19, 2, 2, W); }
        else if (side) { R(9, 17, 4, 6, W); R(9, 17, 1, 6, D); R(8, 14, 1, 3, W); }
        else { R(4, 17, 8, 6, W); R(5, 16, 6, 1, W); R(6, 14, 1, 2, W); R(9, 14, 1, 2, W); R(6, 19, 4, 2, D); R(7, 20, 2, 1, '#d84a6a'); }
        break;
      }
      case 'colete': {
        const G = '#6a8a4a', D = '#4a6a2a';
        if (back) { R(3, 15, 10, 8, G); R(3, 15, 10, 1, D); }
        else if (side) { R(4, 15, 8, 8, G); R(9, 18, 2, 2, D); }
        else { R(3, 15, 3, 8, G); R(10, 15, 3, 8, G); R(4, 18, 2, 2, D); R(10, 18, 2, 2, D); R(4, 21, 2, 1, D); R(10, 21, 2, 1, D); }
        break;
      }
      case 'cachecol': {
        const Rd = '#d84a3a';
        if (side) { R(5, 14, 7, 2, Rd); R(4, 16, 2, 4, Rd); R(4, 18, 2, 1, '#ffffff'); }
        else { R(4, 14, 8, 2, Rd); if (!back) { R(9, 16, 2, 5, Rd); R(9, 18, 2, 1, '#ffffff'); R(9, 20, 2, 1, '#ffffff'); } }
        break;
      }
      case 'colarhavaiano': {
        const cs = ['#ff6aa8', '#ffd040', '#ffffff', '#ff6aa8', '#ffd040'];
        if (side) for (let k = 0; k < 4; k++) R(5 + k * 2, 15 + (k % 2), 2, 2, cs[k]);
        else for (let k = 0; k < 5; k++) R(3 + k * 2, 15 + (k === 0 || k === 4 ? 0 : 1) + (back ? 0 : k === 2 ? 1 : 0), 2, 2, cs[k]);
        break;
      }
      case 'xadrezlenhador': {
        const Rd = '#b83228', K = '#2a1a1a', L = '#e86a5a';
        R(3, 15, 10, 8, Rd); R(3, 15, 10, 1, L);
        if (!side) { R(1, 16 + step, 2, 6, Rd); R(13, 16 - step, 2, 6, shade(Rd, -0.2)); for (const x of [5, 9]) R(x, 15, 1, 7, K); for (const y of [17, 20]) R(3, y, 10, 1, K); R(1, 18 + step, 2, 1, K); R(13, 18 - step, 2, 1, K); if (dir === 1) { R(7, 15, 2, 2, shade(SKINS[look.skin || 0], -0.16)); R(7, 17, 1, 5, K); } }
        else { const a = step * 2; for (const x of [5, 9]) R(x, 15, 1, 7, K); R(3, 18, 10, 1, K); R(7 + a, 16, 3, 6, shade(Rd, -0.2)); R(7 + a, 18, 3, 1, K); }
        R(3, 22, 10, 1, shade(look.pants || '#3a4a7a', -0.2));
        break;
      }
      case 'capachuva': if (!look.rc) drawRaincoat(look, dir, step, true); break;
      default: if (c) drawModa(look, dir, step, side);
    }
    // luvas
    if (look.eqm) {
      const g = GLOVE_COL[look.eqm], gd = shade(g, -0.25);
      if (!side) { R(1, 22 + step, 2, 2, g); R(13, 22 - step, 2, 2, gd); }
      else { const a = step * 2; R(7 + a, 22, 3, 2, g); }
    }
  }
  // cabeça (desenhado por cima do cabelo); hx = canto esquerdo da cabeça
  function drawEqHat(look, dir, hx, side) {
    const back = dir === 0;
    switch (look.eqh) {
      case 'chapeupalha': {
        const S = '#e8c860', D = '#c8a040', L = '#f8e098', band = '#c84a3a';
        if (side) { R(hx - 2, 2, 16, 2, S); R(hx - 2, 3, 16, 1, D); R(hx + 1, -3, 9, 5, S); R(hx + 2, -4, 7, 1, S); R(hx + 2, -3, 3, 1, L); R(hx + 1, 1, 9, 1, band);
          disc(hx + 2, 0, 1.6, '#ff7ab8'); R(hx + 2, 0, 1, 1, '#ffd040'); }
        else { R(hx - 2, 2, 16, 2, S); R(hx - 2, 3, 16, 1, D); R(hx + 1, -3, 10, 5, S); R(hx + 2, -4, 8, 1, S); R(hx + 2, -3, 3, 1, L); R(hx + 1, 1, 10, 1, band);
          // florzinha na fita
          const fx = back ? hx + 2 : hx + 9; for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) R(fx + dx, 0 + dy, 1, 1, '#ff7ab8'); R(fx, 0, 1, 1, '#ffd040'); R(fx + 1, 2, 2, 1, '#4aa83a'); }
        break;
      }
      case 'capacete': {
        const Y = '#e8b020', D = '#b88a10', L = '#ffd860';
        R(hx, -2, 12, 5, Y); R(hx + 1, -3, 10, 1, Y); R(hx + 2, -2, 4, 1, L); R(hx - 1, 3, 14, 1, D);
        if (side) { R(hx + 10, -1, 3, 3, '#8a8a92'); R(hx + 11, 0, 2, 1, '#fff6a0'); }
        else if (!back) { R(hx + 4, -1, 4, 3, '#8a8a92'); R(hx + 5, 0, 2, 1, '#fff6a0'); }
        break;
      }
      case 'chapeupesca': {
        const G = '#5a7a4a', D = '#3a5a2a';
        R(hx + 1, -2, 10, 4, G); R(hx + 2, -3, 8, 1, G); R(hx - 1, 2, 14, 2, D); R(hx, 2, 12, 1, G);
        if (!back) { R(hx + (side ? 4 : 8), 0, 1, 2, '#c8c8d0'); R(hx + (side ? 3 : 9), 1, 1, 1, '#e8402a'); }
        break;
      }
      case 'coroaflores': {
        const cs = ['#ff8ac8', '#f4c83a', '#ffffff', '#ff6a6a', '#c86ad8', '#ff8ac8'];
        R(hx, 1, 12, 1, '#4aa83a');
        for (let k = 0; k < 6; k++) { const x = hx + k * 2, y = side && k > 3 ? 1 : 0; R(x, y, 2, 2, cs[k]); R(x, y, 1, 1, shade(cs[k], 0.3)); }
        break;
      }
      case 'mascara': {
        const O = '#f08a2a', D = '#c8661a';
        R(hx - 1, 1, 14, 12, O); R(hx, 0, 12, 1, O); R(hx, 13, 12, 1, D);
        for (const x of [hx + 3, hx + 7]) R(x, 1, 1, 12, D);
        R(hx + 5, -2, 2, 2, '#3a7a2a');
        if (!back) {
          const ex = side ? [hx + 8] : [hx + 2, hx + 8];
          for (const x of ex) poly([[x, 7], [x + 2, 4], [x + 4, 7]], '#2a1a0a');
          R(side ? hx + 7 : hx + 3, 9, side ? 5 : 7, 2, '#2a1a0a'); R(side ? hx + 8 : hx + 5, 9, 1, 1, O);
        }
        break;
      }
      case 'gorro': {
        R(hx, -1, 12, 4, '#c83a3a'); R(hx + 1, -2, 10, 1, '#c83a3a'); R(hx + 2, -1, 3, 1, '#e86a5a');
        R(hx - 1, 2, 14, 2, '#ffffff'); disc(hx + 6, -3, 2, '#ffffff');
        break;
      }
      case 'chapeuapicultor': {
        const W = '#f4f0e0';
        R(hx + 1, -3, 10, 5, W); R(hx + 2, -4, 8, 1, W); R(hx - 2, 2, 16, 1, '#d8d0b8');
        ctx.globalAlpha = 0.45; R(hx - 1, 3, 14, 9, '#2a2a2a'); ctx.globalAlpha = 1;
        for (let x = hx - 1; x < hx + 13; x += 2) R(x, 3, 1, 9, '#1a1a1a55');
        break;
      }
      default: drawModaHat(look, dir, hx, side);
    }
  }
