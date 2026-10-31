
  // ================= peixes: um desenho próprio para cada espécie (16x16, cabeça à esquerda) =================
  // Corpo gerado por perfil (altura em cima e embaixo ao longo do comprimento), com sombreado de dorso, lado e barriga,
  // e por cima as nadadeiras, o rabo e as marcas de cada espécie. Polvo, lula, linguado, baiacu, enguia e peixe-pedra são desenhados à parte.
  const FISH_ART = {
    carpa: { xs: 1, xt: 11, cy: 8.5, H: 4, Hl: 3.6, p: 0.38, s0: 0.45, pe: 0.32, tail: 'fork', tl: 3, c: ['#5e4c1e', '#b0903e', '#d8bc66', '#f0e2aa'], fin: '#9a6e2a', dorsal: [0.3, 0.62, 2, 'round'], anal: [0.62, 0.78, 1], mark: 'scales', barbel: 1 },
    achiga: { xs: 1, xt: 11, cy: 8.5, H: 3.6, Hl: 3.4, p: 0.4, s0: 0.5, pe: 0.3, tail: 'square', tl: 3, c: ['#2e4818', '#6a8a36', '#9ab45a', '#e4ecc0'], fin: '#4e6e26', dorsal: [0.25, 0.75, 2, 'spiny'], anal: [0.6, 0.78, 1], mark: 'band', bigMouth: 1 },
    peixesol: { xs: 2, xt: 10, cy: 8.5, H: 5, Hl: 4.6, p: 0.42, s0: 0.55, pe: 0.3, tail: 'round', tl: 3, c: ['#8a5a1a', '#e8a832', '#f4c850', '#ffe8a0'], fin: '#c87a22', dorsal: [0.3, 0.8, 1, 'round'], anal: [0.55, 0.85, 1], mark: 'sunfish' },
    truta: { xs: 1, xt: 11, cy: 8.5, H: 3.2, Hl: 3, p: 0.4, s0: 0.42, pe: 0.32, tail: 'square', tl: 3, c: ['#3e5a40', '#a8b48a', '#d8dcc0', '#f6f2e4'], fin: '#7a8a5a', dorsal: [0.38, 0.55, 2, 'round'], anal: [0.65, 0.8, 1], mark: 'rainbow' },
    salmao: { xs: 1, xt: 11, cy: 8.5, H: 3.6, Hl: 3.2, p: 0.38, s0: 0.38, pe: 0.3, tail: 'fork', tl: 3, c: ['#3e4c5e', '#d8684a', '#ec9070', '#f8dccc'], fin: '#8a3e30', dorsal: [0.36, 0.55, 2, 'round'], anal: [0.65, 0.8, 1], mark: 'salmon' },
    bagre: { xs: 3, xt: 12, cy: 8.5, H: 3, Hl: 3.2, p: 0.2, s0: 0.75, pe: 0.32, tail: 'fork', tl: 2, c: ['#2a2a36', '#565666', '#7c7c8c', '#c8c8d2'], fin: '#3e3e4c', dorsal: [0.28, 0.42, 2, 'spiny'], anal: [0.55, 0.85, 1], mark: 'catfish' },
    perca: { xs: 1, xt: 11, cy: 8.5, H: 3.6, Hl: 3.2, p: 0.38, s0: 0.42, pe: 0.3, tail: 'fork', tl: 3, c: ['#3e5418', '#b4ac30', '#d6cc56', '#f2f0d0'], fin: '#e05a26', dorsal: [0.22, 0.72, 2, 'spiny'], anal: [0.62, 0.78, 1], mark: 'bars' },
    lucio: { xs: 1, xt: 12, cy: 8.5, H: 2.4, Hl: 2.4, p: 0.5, s0: 0.3, pe: 0.45, tail: 'fork', tl: 2, c: ['#223e22', '#4e7e40', '#7aa45e', '#e0e8c4'], fin: '#5e7a34', dorsal: [0.72, 0.9, 2, 'round'], anal: [0.72, 0.9, 1], mark: 'pike' },
    brema: { xs: 2, xt: 10, cy: 8.5, H: 4.6, Hl: 4.8, p: 0.4, s0: 0.45, pe: 0.25, tail: 'fork', tl: 4, c: ['#4a4a58', '#a8a49a', '#c8c4b4', '#ecebe4'], fin: '#6a6a78', dorsal: [0.42, 0.6, 2, 'tri'], anal: [0.5, 0.95, 1], mark: 'shine' },
    tilapia: { xs: 1, xt: 11, cy: 8.5, H: 4, Hl: 3.6, p: 0.4, s0: 0.5, pe: 0.32, tail: 'round', tl: 3, c: ['#3e4c5a', '#7e94a4', '#a4b6c2', '#dce4e6'], fin: '#c8584a', dorsal: [0.22, 0.85, 2, 'spiny'], anal: [0.6, 0.85, 1], mark: 'tilapia' },
    sardinha: { xs: 1, xt: 11, cy: 8.5, H: 2.6, Hl: 2.4, p: 0.4, s0: 0.35, pe: 0.36, tail: 'fork', tl: 3, c: ['#1a5a62', '#8ab8c0', '#c4dce0', '#f4f8fc'], fin: '#5a8a92', dorsal: [0.42, 0.56, 1, 'tri'], anal: [0.7, 0.8, 1], mark: 'sardine' },
    anchova: { xs: 1, xt: 11, cy: 8.5, H: 2, Hl: 1.8, p: 0.5, s0: 0.5, pe: 0.42, tail: 'fork', tl: 3, c: ['#4a6a3a', '#a8b89a', '#d0dccc', '#f0f4ee'], fin: '#7a8a6a', bigMouth: 1, dorsal: [0.45, 0.58, 1, 'tri'], anal: [0.65, 0.8, 1], mark: 'silverline' },
    atum: { xs: 1, xt: 10, cy: 8.5, H: 3.6, Hl: 3.4, p: 0.42, s0: 0.35, pe: 0.18, tail: 'lunate', tl: 4, c: ['#14224e', '#3c5c96', '#8aa4cc', '#e6ecf4'], fin: '#22305e', dorsal: [0.35, 0.5, 2, 'tri'], anal: [0.55, 0.68, 2], mark: 'tuna' },
    arenque: { xs: 1, xt: 11, cy: 8.5, H: 3.2, Hl: 3, p: 0.42, s0: 0.38, pe: 0.34, tail: 'deepfork', tl: 3, c: ['#2a4e6e', '#b0c0d4', '#d2dce8', '#f6f8fa'], fin: '#7e94ac', dorsal: [0.4, 0.55, 2, 'tri'], anal: [0.68, 0.8, 1], mark: 'herring' },
    salmonete: { xs: 1, xt: 11, cy: 8.5, H: 3.2, Hl: 2.8, p: 0.32, s0: 0.62, pe: 0.32, tail: 'fork', tl: 3, c: ['#a83a2e', '#e87a5e', '#f4a084', '#f8e4d8'], fin: '#d8503a', dorsal: [0.25, 0.4, 2, 'tri'], anal: [0.6, 0.75, 1], mark: 'mullet' },
    peixeespada: { xs: 4, xt: 11, cy: 8.5, H: 2.8, Hl: 2.6, p: 0.35, s0: 0.45, pe: 0.2, tail: 'lunate', tl: 3, c: ['#1e2a4e', '#5a6a96', '#9eaacc', '#e2e6f0'], fin: '#2a3660', dorsal: [0.12, 0.35, 4, 'sail'], anal: [0.62, 0.75, 1], mark: 'sword' },
  };
  function paintFish(id) {
    const P = (x, y, c) => R(x, y, 1, 1, c);
    const special = FISH_SPECIAL[id];
    if (special) { special(P); return true; }
    const o = FISH_ART[id];
    if (!o) return false;
    const [cBack, cSide, cSideL, cBelly] = o.c, L = o.xt - o.xs;
    const prof = (t, H) => {
      const f = t < o.p ? Math.sqrt(1 - Math.pow((o.p - t) / o.p, 2)) * (1 - o.s0) + o.s0 : ((Math.cos(Math.PI * (t - o.p) / (1 - o.p)) + 1) / 2) * (1 - o.pe) + o.pe;
      return H * f;
    };
    const top = {}, bot = {}, body = {};
    // corpo
    for (let x = o.xs; x <= o.xt; x++) {
      const t = (x + 0.5 - o.xs) / (L + 1), hu = prof(t, o.H), hl = prof(t, o.Hl);
      let y0 = 99, y1 = -1;
      for (let y = 0; y < 16; y++) { const yc = y + 0.5; if (yc >= o.cy - hu && yc <= o.cy + hl) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); } }
      if (y1 < 0) continue;
      top[x] = y0; bot[x] = y1;
      for (let y = y0; y <= y1; y++) {
        const v = (y - y0) / Math.max(1, y1 - y0);
        body[x + ',' + y] = v;
        P(x, y, v < 0.24 ? cBack : v < 0.5 ? cSide : v < 0.74 ? cSideL : cBelly);
      }
      // brilho logo abaixo do dorso
      if (t > 0.2 && t < 0.62 && y1 - y0 >= 4) P(x, y0 + 1 + (y1 - y0 >= 7 ? 1 : 0), shade(cSide, 0.35));
    }
    const midY = x => (top[x] + bot[x]) / 2, at = t => Math.round(o.xs + t * L);
    // nadadeira dorsal
    if (o.dorsal) {
      const [d0, d1, h, kind] = o.dorsal, x0 = at(d0), x1 = at(d1);
      for (let x = x0; x <= x1; x++) {
        if (top[x] == null) continue;
        const u = (x - x0) / Math.max(1, x1 - x0);
        let hh = kind === 'round' ? Math.round(h * Math.sin(Math.PI * (0.15 + u * 0.75))) : kind === 'tri' ? Math.round(h * (1 - u)) + (u < 0.3 ? 0 : 0) : kind === 'sail' ? Math.round(h * (1 - Math.pow(u, 0.7))) : Math.max(1, Math.round(h * (x % 2 ? 1 : 0.6)));
        if (kind === 'spiny' && u > 0.55) hh = Math.max(1, hh - 1);
        for (let k = 1; k <= hh; k++) P(x, top[x] - k, k === hh ? shade(o.fin, -0.25) : o.fin);
      }
    }
    // nadadeira anal (embaixo, perto do rabo) e peitoral (atrás da guelra)
    if (o.anal) {
      const [a0, a1, h] = o.anal, x0 = at(a0), x1 = at(a1);
      for (let x = x0; x <= x1; x++) { if (bot[x] == null) continue; const hh = Math.max(1, Math.round(h * (1 - (x - x0) / Math.max(1, x1 - x0 + 1)) + 0.4)); for (let k = 1; k <= hh; k++) P(x, bot[x] + k, k === hh ? shade(o.fin, -0.25) : o.fin); }
    }
    // rabo
    const tb = o.xt, ph = Math.max(1, (bot[tb] - top[tb] + 1) / 2), cyT = (top[tb] + bot[tb] + 1) / 2;
    for (let k = 1; k <= o.tl; k++) {
      const x = tb + k, u = k / o.tl;
      for (let y = 0; y < 16; y++) {
        const dy = Math.abs(y + 0.5 - cyT);
        let on = false;
        if (o.tail === 'fork') on = dy <= ph + k * 1.1 && !(u > 0.55 && dy < (u - 0.45) * 4);
        else if (o.tail === 'deepfork') on = dy <= ph + k * 1.2 && !(u > 0.3 && dy < (u - 0.2) * 5);
        else if (o.tail === 'square') on = dy <= ph + k * 0.9;
        else if (o.tail === 'round') on = dy <= ph + Math.min(k, o.tl - 0.6) * 0.9 - (u > 0.8 ? 0.8 : 0);
        else if (o.tail === 'lunate') on = (dy <= ph * 0.6 && k === 1) || (dy >= (k - 1) * 1.4 && dy <= 1.2 + k * 1.6 && k > 1) || (k === 1 && dy <= 2);
        if (on) P(x, y, k === o.tl || (o.tail === 'lunate' && dy > k * 1.4) ? shade(o.fin, -0.25) : o.fin);
      }
    }
    // marcas de cada espécie
    const inB = (x, y) => body[x + ',' + y] != null;
    const V = (x, y) => body[x + ',' + y];
    const paintIf = (x, y, c) => { if (inB(x, y)) P(x, y, c); };
    switch (o.mark) {
      case 'scales': for (const k in body) { const [x, y] = k.split(',').map(Number); const v = body[k]; if (x > at(0.25) && x < o.xt && v > 0.15 && v < 0.85 && (x + y * 2) % 4 === 0) P(x, y, shade(v < 0.5 ? cSide : cSideL, -0.18)); } break;
      case 'band': for (let x = at(0.22); x < o.xt; x++) { const y = Math.round(midY(x)) + ((x * 7) % 3 === 0 ? -1 : 0); paintIf(x, y, '#2a3a14'); if (x % 3 === 1) paintIf(x, y + 1, '#3a4e1c'); } break;
      case 'sunfish': for (let x = o.xs; x <= at(0.3); x++) paintIf(x, Math.round(midY(x)) + 1, '#3a98d8'); { const gx = at(0.45), gy = Math.round(midY(gx)) - 1; P(gx, gy, '#1a1a1a'); P(gx, gy + 1, '#1a1a1a'); P(gx + 1, gy, '#e8402a'); } for (const [tx, dv] of [[0.5, -0.5], [0.62, 0.8], [0.72, -1.5], [0.8, 1]]) { const x = at(tx); paintIf(x, Math.round(midY(x) + dv), '#e8702a'); } break;
      case 'rainbow': for (let x = at(0.2); x <= o.xt; x++) { const y = Math.round(midY(x)); paintIf(x, y, '#e8709e'); paintIf(x, y - 1, '#f0a0c0'); } for (const k in body) { const [x, y] = k.split(',').map(Number); if (body[k] < 0.4 && (x * 5 + y * 3) % 7 === 0) P(x, y, '#1e2a1e'); } break;
      case 'salmon': for (const k in body) { const [x, y] = k.split(',').map(Number); if (body[k] < 0.3 && x > at(0.3) && (x * 3 + y) % 4 === 0) P(x, y, '#1e2630'); } P(o.xs, Math.round(o.cy), '#3e4c5e'); P(o.xs + 1, top[o.xs + 1] - 0, '#3e4c5e'); break;
      case 'catfish': { const y = Math.round(o.cy); for (const [x, yy] of [[2, y], [1, y + 1], [1, y + 2], [2, y + 2], [2, y + 3], [3, y + 4]]) P(x, yy, '#b8b8c8'); const ax = at(0.75); if (top[ax] != null) { P(ax, top[ax] - 1, o.fin); P(ax + 1, top[ax + 1] - 1, o.fin); } break; }
      case 'bars': for (const xb of [0.3, 0.42, 0.54, 0.66, 0.78]) { const x = at(xb); for (let y = top[x]; y <= bot[x]; y++) if (V(x, y) < 0.68) P(x, y, '#30401a'); } break;
      case 'pike': for (const k in body) { const [x, y] = k.split(',').map(Number); const v = body[k]; if (v > 0.2 && v < 0.75 && x > at(0.25) && ((x * 2 + y) % 4 === 0)) P(x, y, '#cad88e'); } P(o.xs, Math.round(o.cy), '#5e8a4a'); P(o.xs, Math.round(o.cy) - 1, '#223e22'); break;
      case 'shine': for (let x = at(0.25); x <= at(0.7); x++) paintIf(x, Math.round(midY(x)) - 1, '#e8e4d8'); for (let x = at(0.2); x <= at(0.8); x += 2) paintIf(x, Math.round(midY(x)) + 1, '#b8a888'); break;
      case 'tilapia': for (const xb of [0.35, 0.5, 0.65, 0.8]) { const x = at(xb); for (let y = top[x]; y <= bot[x]; y++) if (V(x, y) > 0.15 && V(x, y) < 0.8) P(x, y, shade(V(x, y) < 0.5 ? cSide : cSideL, -0.2)); } for (let x = o.xt + 1; x <= o.xt + o.tl; x++) { P(x, top[o.xt] - 2 + (x - o.xt), shade(o.fin, 0.2)); } break;
      case 'sardine': for (let x = at(0.3); x <= at(0.85); x += 2) { paintIf(x, top[x] + 1, '#0e2a30'); if (x % 4 === 1) paintIf(x + 1, top[x] + 2, '#1e4a52'); } break;
      case 'silverline': for (let x = at(0.15); x <= o.xt; x++) { const y = Math.round(midY(x)); paintIf(x, y, '#f4fafc'); paintIf(x, y - 1, '#6a8e98'); } break;
      case 'tuna': for (let x = at(0.62); x <= o.xt; x++) { if (top[x] != null && x % 2 === 0) P(x, top[x] - 1, '#f4d03a'); if (bot[x] != null && x % 2 === 1) P(x, bot[x] + 1, '#f4d03a'); } { const px = at(0.25), py = Math.round(midY(px)); P(px, py, '#22305e'); P(px + 1, py, '#22305e'); P(px + 2, py + 1, '#22305e'); P(px + 3, py + 1, '#22305e'); } break;
      case 'herring': for (let x = at(0.15); x <= o.xt; x++) paintIf(x, Math.round(midY(x)) - 1, (x % 2 ? '#a8c4ec' : '#c8b0e0')); break;
      case 'mullet': for (let x = at(0.15); x <= o.xt; x++) paintIf(x, Math.round(midY(x)), '#f4c83a'); { const y = bot[o.xs + 1]; P(o.xs, y + 1, '#f4c83a'); P(o.xs + 1, y + 1, '#f4c83a'); P(o.xs, y + 2, '#e8a82a'); } break;
      case 'legend': for (const k in body) { const [x, y] = k.split(',').map(Number); const v = body[k]; if (v > 0.15 && v < 0.8 && (x * 3 + y) % 5 === 0) P(x, y, '#f8e070'); } break;
      case 'angler': { const hx = o.xs + 2, hy = top[hx]; for (let k = 1; k <= 3; k++) P(hx - (k > 2 ? 1 : 0), hy - k, '#5a3a10'); P(hx - 2, hy - 4, '#fff6a0'); P(hx - 1, hy - 4, '#f8e070'); for (let x = o.xs; x <= o.xs + 2; x++) P(x, Math.round(o.cy) + 1, '#f4f0e0'); break; }
      case 'ice': for (const k in body) { const [x, y] = k.split(',').map(Number); if (body[k] < 0.5 && (x * 5 + y * 3) % 6 === 0) P(x, y, '#ffffff'); } P(o.xt + 2, top[o.xt] - 2, '#ffffff'); break;
      case 'mutant': for (const k in body) { const [x, y] = k.split(',').map(Number); const v = body[k]; if (v > 0.2 && v < 0.8 && (x * 7 + y * 3) % 6 === 0) P(x, y, '#8a3ab8'); } break;
      case 'sword': { const y = Math.round(o.cy) - 1; for (let x = 0; x < o.xs; x++) P(x, y, x === 0 ? '#8a96b8' : '#c8d2e6'); P(o.xs - 1, y + 1, '#8a96b8'); break; }
    }
    // guelra, peitoral e olho
    const gx = at(0.26);
    if (top[gx] != null) for (let y = top[gx] + 1; y < bot[gx]; y++) if (V(gx, y) > 0.2 && V(gx, y) < 0.85 && o.mark !== 'sunfish') P(gx, y, shade(V(gx, y) < 0.5 ? cSide : cSideL, -0.28));
    const px = gx + 1, py = Math.round(midY(px) + 0.5);
    if (top[px] != null) { P(px, py, shade(o.fin, 0.1)); P(px + 1, py, o.fin); P(px + 1, py + 1, shade(o.fin, -0.15)); }
    const ex = o.mark === 'sword' ? o.xs + 1 : Math.max(o.xs + 1, at(0.1)), ey = Math.max(top[ex] + 1, Math.round(midY(ex) - 1));
    if (o.H > 3.5) { P(ex, ey, '#ffffff'); P(ex + 1, ey, '#141414'); P(ex, ey + 1, '#141414'); P(ex + 1, ey + 1, '#141414'); }
    else { P(ex, ey, '#141414'); P(ex + 1, ey, '#f4f4f4'); }
    if (FISH[id] && FISH[id].legend) { P(o.xt, Math.max(0, (top[o.xt] || 4) - 3), '#fff6a0'); P(o.xs + 3, Math.max(0, (top[o.xs + 3] || 4) - 2), '#fff6a0'); }
    // boca
    const my = Math.round(o.cy + (o.bigMouth ? 0.5 : 0.8));
    P(o.xs, my, shade(cBack, -0.2)); if (o.bigMouth) { P(o.xs + 1, my, '#1a1a1a'); P(o.xs + 2, my, '#3a2a1a'); }
    if (o.barbel) { P(o.xs, bot[o.xs] + 1, '#8a6a2a'); P(o.xs - 1 < 0 ? 0 : o.xs, bot[o.xs] + 2, '#8a6a2a'); }
    return true;
  }
  const FISH_SPECIAL = {
    // enguia: corpo comprido em onda, nadadeira contínua no dorso
    enguia(P) {
      const yc = x => 8.5 - 2.3 * Math.sin((x - 2) / 12 * Math.PI * 2);
      for (let x = 1; x <= 14; x++) {
        const th = x <= 11 ? 3 : x === 12 ? 2 : 1, y0 = Math.round(yc(x) - th / 2);
        for (let k = 0; k < th; k++) P(x, y0 + k, th === 1 ? '#3a4424' : k === 0 ? '#2e3a1e' : k === th - 1 ? '#c8c088' : '#5e6c3a');
        if (x >= 4 && x <= 13) P(x, y0 - 1, x % 2 ? '#8a9a52' : '#76864a');
        if (x >= 8 && x <= 13) P(x, y0 + th, '#76864a');
      }
      const h = Math.round(yc(2) - 1.5);
      P(2, h, '#f4f0d0'); P(3, h, '#141414'); P(1, h + 2, '#1a1a10'); P(4, h + 1, '#4a5630');
    },
    // peixe-pedra: parece uma pedra com calombos, olhos pequenos e espinhos
    peixepedra(P) {
      const pal = ['#4a443e', '#6a625a', '#8a8278', '#a89e92'];
      for (let y = 4; y <= 13; y++) for (let x = 2; x <= 13; x++) {
        const dx = (x - 7.5) / 6, dy = (y - 9) / (y < 9 ? 4.5 : 4), bump = 0.08 * Math.sin(x * 2.3 + y * 1.7);
        if (dx * dx + dy * dy <= 1 + bump) { const n = (x * 13 + y * 7) % 5; const v = (y - 4) / 9; P(x, y, n === 0 ? pal[0] : v < 0.3 ? pal[2] : v < 0.7 ? (n === 1 ? pal[3] : pal[1]) : pal[1]); }
      }
      for (const [x, y] of [[4, 4], [7, 3], [10, 4], [12, 6]]) P(x, y, '#5a524a');
      for (const [x, y] of [[5, 6], [9, 8], [11, 11], [6, 11]]) P(x, y, '#c8784a');
      P(14, 8, '#5a524a'); P(14, 10, '#5a524a'); P(14, 9, '#6a625a');
      P(4, 7, '#f4e070'); P(5, 7, '#141414'); P(7, 7, '#f4e070'); P(8, 7, '#141414');
      P(3, 10, '#2a2420'); P(4, 10, '#2a2420'); P(5, 10, '#2a2420');
    },
    // linguado: corpo achatado visto de cima, franja de nadadeira em volta e os dois olhos do mesmo lado
    linguado(P) {
      for (let y = 2; y <= 14; y++) for (let x = 1; x <= 12; x++) {
        const dx = (x - 6.5) / 5.6, dy = (y - 8) / 6, d = dx * dx + dy * dy;
        if (d <= 1) P(x, y, d > 0.72 ? '#c8b48a' : (x * 3 + y * 5) % 9 === 0 ? '#7a6a48' : (x + y * 3) % 11 === 0 ? '#e0d0a8' : d > 0.5 ? '#a8946a' : '#b8a47a');
      }
      for (let y = 6; y <= 10; y++) { P(13, y, '#a8946a'); P(14, y - 1 + (y > 8 ? 2 : 0) - (y === 8 ? 1 : 0), '#8a7650'); }
      P(14, 5, '#8a7650'); P(14, 11, '#8a7650'); P(13, 8, '#c8b48a');
      for (let y = 5; y <= 11; y++) P(7 + (y === 8 ? 0 : 0), y, (y % 2 ? '#9a8660' : '#b8a47a'));
      P(3, 5, '#f4f0e0'); P(4, 5, '#141414'); P(4, 7, '#f4f0e0'); P(5, 7, '#141414');
      P(2, 9, '#5a4a30'); P(3, 9, '#5a4a30');
    },
    // polvo: cabeça redonda e oito braços enrolados com ventosas
    polvo(P) {
      for (let y = 1; y <= 8; y++) for (let x = 4; x <= 11; x++) { const dx = (x - 7.5) / 4, dy = (y - 5) / 4; if (dx * dx + dy * dy <= 1) P(x, y, dy < -0.4 ? '#e88aa8' : dx < -0.3 ? '#d8708e' : '#c25a7a'); }
      P(6, 3, '#f8c0d4'); P(5, 4, '#f8c0d4');
      for (const [x, y] of [[6, 6], [9, 6]]) { P(x, y, '#ffffff'); P(x, y + 1, '#141414'); }
      const arms = [[[5, 9], [4, 10], [3, 11], [2, 12], [2, 13], [3, 14]], [[6, 9], [6, 10], [5, 11], [5, 12], [6, 13]], [[7, 9], [7, 10], [8, 11], [8, 12], [7, 13], [7, 14]], [[9, 9], [9, 10], [10, 11], [10, 12], [9, 13]], [[10, 9], [11, 10], [12, 11], [13, 12], [13, 13], [12, 14]], [[11, 8], [12, 9], [13, 9], [14, 10]], [[4, 8], [3, 9], [2, 9], [1, 10]]];
      arms.forEach(a => a.forEach(([x, y], i) => P(x, y, i % 2 ? '#a84866' : '#c25a7a')));
      for (const [x, y] of [[3, 11], [8, 12], [12, 11], [5, 12]]) P(x, y, '#f4b0c8');
    },
    // lula: manto comprido com aletas na ponta e tentáculos embaixo
    lula(P) {
      for (let y = 1; y <= 10; y++) { const w = y < 3 ? y : y < 8 ? 3 : 2; for (let x = 8 - w; x <= 7 + w; x++) P(x, y, x === 8 - w ? '#f4e0ea' : x === 7 + w ? '#c8a0b4' : (x * 3 + y * 5) % 7 === 0 ? '#c8789a' : '#e8c8d8'); }
      for (const [x, y] of [[3, 3], [4, 3], [4, 4], [11, 3], [12, 3], [11, 4], [2, 4], [13, 4]]) P(x, y, '#e0b8cc');
      P(6, 8, '#ffffff'); P(6, 9, '#141414'); P(9, 8, '#ffffff'); P(9, 9, '#141414');
      for (const [x0, dx] of [[5, -1], [6, 0], [7, 0], [8, 0], [9, 0], [10, 1]]) for (let y = 11; y <= 13 + (x0 === 7 || x0 === 8 ? 1 : 0); y++) P(x0 + (y > 12 ? dx : 0), y, y % 2 ? '#d8a8bc' : '#e8c8d8');
      P(6, 14, '#c88aa8'); P(9, 14, '#c88aa8');
    },
    // baiacu: bola amarela cheia de espinhos, olhos grandes
    baiacu(P) {
      for (let y = 3; y <= 13; y++) for (let x = 2; x <= 12; x++) { const dx = (x - 7) / 5.2, dy = (y - 8) / 5.2, d = dx * dx + dy * dy; if (d <= 1) P(x, y, dy > 0.35 ? '#fff4c0' : dy < -0.45 ? '#c8a82a' : '#e8d84a'); }
      for (const [x, y] of [[7, 1], [3, 3], [11, 3], [1, 7], [1, 10], [3, 13], [7, 14], [11, 13], [13, 6]]) P(x, y, '#a88a22');
      for (const [x, y] of [[7, 2], [4, 4], [10, 4], [2, 8], [6, 13], [10, 12]]) P(x, y, '#c8a82a');
      for (const [x, y] of [[8, 5], [10, 7], [9, 10], [6, 9], [11, 9]]) P(x, y, '#8a5a22');
      P(4, 6, '#ffffff'); P(5, 6, '#ffffff'); P(4, 7, '#141414'); P(5, 7, '#141414'); P(4, 6, '#ffffff');
      P(2, 9, '#a8402a'); P(3, 9, '#e87a5a');
      P(13, 8, '#c8a82a'); P(14, 7, '#a88a22'); P(14, 8, '#e8d84a'); P(14, 9, '#a88a22');
      P(8, 8, '#e8b83a'); P(9, 8, '#c8a82a');
    },
  };
