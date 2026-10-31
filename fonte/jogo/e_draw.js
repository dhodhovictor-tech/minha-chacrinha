  // ================= desenho em pixel art =================
  // Tudo que é objeto é "assado" uma vez num canvas pequeno: os pixels ficam nítidos e ganham contorno escuro,
  // como no Stardew. O chão de cada mapa é pintado pixel a pixel com ruído (manchas, bordas irregulares).
  const cv = document.getElementById('cv');
  let ctx = cv.getContext('2d');
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  const rgb = h => { const n = parseInt(h.slice(1, 7), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const hex3 = (r, g, b) => '#' + [r, g, b].map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
  const shadeCache = new Map();
  function shade(h, a) { const k = h + a; if (shadeCache.has(k)) return shadeCache.get(k); const [r, g, b] = rgb(h); const v = a >= 0 ? hex3(r + (255 - r) * a, g + (255 - g) * a, b + (255 - b) * a) : hex3(r * (1 + a), g * (1 + a), b * (1 + a)); shadeCache.set(k, v); return v; }
  const OUT = '#2b1a12';
  function poly(pts, c) { ctx.fillStyle = c; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); }
  function disc(x, y, r, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  function oval(x, y, rx, ry, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill(); }
  // ---------- assar sprites: pixels nítidos + contorno ----------
  const bakeCache = new Map();
  function pixelize(c, outline) {
    const x = c.getContext('2d'), W = c.width, H = c.height, d = x.getImageData(0, 0, W, H), a = d.data;
    for (let i = 3; i < a.length; i += 4) a[i] = a[i] >= 100 ? 255 : 0;
    if (outline) {
      const [r, g, b] = rgb(outline), add = [];
      for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) {
        const i = (y * W + xx) * 4;
        if (a[i + 3]) continue;
        if ((xx > 0 && a[i - 1]) || (xx < W - 1 && a[i + 7]) || (y > 0 && a[i - W * 4 + 3]) || (y < H - 1 && a[i + W * 4 + 3])) add.push(i);
      }
      for (const i of add) { a[i] = r; a[i + 1] = g; a[i + 2] = b; a[i + 3] = 255; }
    }
    x.putImageData(d, 0, 0);
  }
  function bake(key, w, h, fn, outline = OUT) {
    let c = bakeCache.get(key);
    if (c) return c;
    if (bakeCache.size > 900) bakeCache.clear();
    c = document.createElement('canvas'); c.width = w; c.height = h;
    const saved = ctx; ctx = c.getContext('2d');
    try { fn(); } catch (e) { console.warn(e); }
    ctx = saved;
    pixelize(c, outline);
    bakeCache.set(key, c);
    return c;
  }
  const blit = (c, x, y) => ctx.drawImage(c, Math.round(x), Math.round(y));
  function shadowAt(x, y, rx, ry = rx * 0.35) { ctx.fillStyle = 'rgba(30, 20, 40, 0.25)'; ctx.beginPath(); ctx.ellipse(Math.round(x), Math.round(y), rx, ry, 0, 0, TAU); ctx.fill(); }

  // ================= chão =================
  const PAL = {
    spring: { g: ['#2f7a2a', '#3f922e', '#52a836', '#68bc3e', '#84d04e'], tip: '#a8e070', fl: ['#f4a0c8', '#fff4a0', '#ffffff', '#a8c8ff', '#ff8a8a'] },
    summer: { g: ['#266a28', '#317e2c', '#3f9432', '#4ea83a', '#66bc46'], tip: '#8cd456', fl: ['#ffe04a', '#ff8a4a', '#ffffff', '#e86ab0'] },
    fall: { g: ['#8a4a1c', '#a8621e', '#c07c26', '#d4962e', '#e4ae44'], tip: '#f4c860', fl: ['#e8702a', '#c84a2a', '#f4b83a', '#a83a1a'] },
    winter: { g: ['#a4b8d4', '#c0d2e8', '#d6e4f2', '#e8f0f8', '#f8fbff'], tip: '#ffffff', fl: ['#ffffff', '#d8e4ee'] },
  };
  const CAVE_PAL = [
    { f: ['#6a4a32', '#7c5a3c', '#8e6a48', '#a27c56'], w: ['#2a1a12', '#3e2a1c', '#56402c', '#6e5438', '#8a6c4a'] },
    { f: ['#7a98b8', '#90b0cc', '#a8c6dc', '#c4dcec'], w: ['#14243a', '#22385a', '#34507a', '#4a6a96', '#6a8ab4'] },
    { f: ['#2e2a3a', '#3a3446', '#464054', '#564e64'], w: ['#0e0a10', '#1c1216', '#2e1c20', '#44282a', '#5e3430'] },
  ];
  function noise2(x, y, s = 11) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  const fbm = (x, y, s = 11) => noise2(x, y, s) * 0.6 + noise2(x * 2.07 + 5.3, y * 2.07 + 9.1, s + 1) * 0.28 + noise2(x * 4.3 + 1.7, y * 4.3 + 3.3, s + 2) * 0.12;
  const SOFT = new Set([G.GRASS, G.FLOWERS, G.DIRT, G.SAND, G.FOREST]);
  function groundPixels(m, c) {
    const W = m.w * T, H = m.h * T, x = c.getContext('2d'), img = x.createImageData(W, H), a = img.data;
    const s = m.outdoor ? season() : 'summer', pal = PAL[s], cave = CAVE_PAL[m.tier || 0];
    const gcol = pal.g.map(rgb), ccol = cave.f.map(rgb), wcol = cave.w.map(rgb);
    const put = (i, c) => { a[i] = c[0]; a[i + 1] = c[1]; a[i + 2] = c[2]; a[i + 3] = 255; };
    const winter = s === 'winter';
    const dirt = (winter ? ['#a89a8a', '#beb0a0', '#d0c4b6', '#e0d6ca'] : ['#8a5e36', '#a8764a', '#bc8a58', '#cfa06a']).map(rgb);
    const sand = ['#c8a46a', '#dcbc7e', '#ecd092', '#f6e0aa'].map(rgb);
    const wood = ['#8a5228', '#a8683a', '#bc7c48', '#cc8e56', '#dca06a'].map(rgb);
    const water = (m.cave && m.tier === 2 ? ['#6a1006', '#a02008', '#d84a10', '#f8862a', '#ffd860'] : m.cave ? ['#1a3a5a', '#22507a', '#2c6696', '#3c7cae', '#7ab4dc'] : ['#2a5aa8', '#3070c0', '#3c88d4', '#4ea0e4', '#a8dcf8']).map(rgb);
    const cob = ['#6e665e', '#8a8278', '#9e968a', '#b2aa9e', '#c8c0b4'].map(rgb);
    const tan = ['#8a7252', '#ae9670', '#c8b088', '#d8c49c', '#ecdcb8'].map(rgb);
    // distância de cada quadrado de água até a margem (para a cor da profundidade)
    const deep = new Uint8Array(m.w * m.h);
    for (let ty = 0; ty < m.h; ty++) for (let tx = 0; tx < m.w; tx++) {
      if (m.at(tx, ty) !== G.WATER) continue;
      let d = 3;
      for (let r = 1; r <= 2 && d === 3; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const g = m.at(tx + dx, ty + dy); if (g !== G.WATER && g !== G.BRIDGE) d = Math.min(d, r); }
      deep[ty * m.w + tx] = d;
    }
    // profundidade suavizada (interpolação entre centros dos quadrados): margens arredondadas e degradê
    const dv = (x, y) => { x = clamp(x, 0, m.w - 1); y = clamp(y, 0, m.h - 1); const g = m.at(x, y); return g === G.WATER ? deep[y * m.w + x] : g === G.BRIDGE ? 2 : 0; };
    const depthAt = (px, py) => {
      const fx = px / T - 0.5, fy = py / T - 0.5, x0 = Math.floor(fx), y0 = Math.floor(fy), ax = fx - x0, ay = fy - y0;
      return (dv(x0, y0) * (1 - ax) + dv(x0 + 1, y0) * ax) * (1 - ay) + (dv(x0, y0 + 1) * (1 - ax) + dv(x0 + 1, y0 + 1) * ax) * ay;
    };
    for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) {
      const i = (py * W + px) * 4, tx = Math.floor(px / T), ty = Math.floor(py / T);
      let gt = m.at(tx, ty);
      if (SOFT.has(gt)) {
        const jx = Math.round((noise2(px * 0.19, py * 0.19, 31) - 0.5) * 9), jy = Math.round((noise2(px * 0.19 + 40, py * 0.19 + 70, 37) - 0.5) * 9);
        const g2 = m.at(Math.floor((px + jx) / T), Math.floor((py + jy) / T));
        if (SOFT.has(g2)) gt = g2;
      }
      const n = fbm(px / 26, py / 26), dith = hash(px, py, 5);
      switch (gt) {
        case G.GRASS: case G.FLOWERS: case G.FOREST: {
          let k = n < 0.36 ? 1 : n < 0.5 ? 2 : n < 0.64 ? 3 : 4;
          if (gt === G.FOREST) k = Math.max(0, k - 2);
          if (!winter) {
            // folhinhas de grama: ponta clara, base escura, espalhadas em células de 4x4
            const cx = px >> 2, cy = py >> 2, hh = hash(cx, cy, 13), lx = px & 3, ly = py & 3, bx = (hh * 4) | 0, by = ((hh * 16) | 0) & 3;
            if (lx === bx && ly === by) k = Math.min(4, k + 1);
            else if (lx === bx && ly === ((by + 1) & 3)) k = Math.max(0, k - 1);
            else if (hash(cx, cy, 17) < 0.3 && lx === ((bx + 2) & 3) && ly === ((by + 2) & 3)) k = Math.max(0, k - 1);
            if (dith < 0.04) k = Math.max(0, k - 1);
          } else { if (dith > 0.985) k = 4; else if (dith < 0.03) k = Math.max(0, k - 1); }
          put(i, gcol[k]); break;
        }
        case G.DIRT: { let k = n < 0.4 ? 1 : n < 0.6 ? 2 : 3; if (dith < 0.05) k = 0; else if (dith > 0.97) k = 3; put(i, dirt[k]); break; }
        case G.SAND: { let k = n < 0.4 ? 1 : n < 0.6 ? 2 : 3; if (dith < 0.04) k = 0; put(i, sand[k]); break; }
        case G.WATER: {
          const f = depthAt(px, py) + (noise2(px * 0.25, py * 0.25, 91) - 0.5) * 0.16;
          let k = f > 2.3 ? 1 : f > 1.4 ? 2 : 3;
          if (n > 0.66) k = Math.min(3, k + 1); else if (n < 0.28) k = Math.max(0, k - 1);
          const wave = (py + Math.round(Math.sin(px * 0.21 + py * 0.05) * 1.5)) % 7 === 0 && noise2(px * 0.12, py * 0.3, 77) > 0.55;
          put(i, wave ? water[4] : water[k]);
          // margem arredondada: grama por cima, borda escura e espuma
          const sandy = !m.cave && [m.at(tx, ty - 1), m.at(tx, ty + 1), m.at(tx - 1, ty), m.at(tx + 1, ty), m.at(tx - 1, ty - 1), m.at(tx + 1, ty - 1)].includes(G.SAND);
          if (f < 0.58) put(i, m.cave ? wcol[1] : sandy ? sand[2] : gcol[n < 0.5 ? 1 : 2]);
          else if (f < 0.66) put(i, m.cave ? wcol[2] : sandy ? sand[0] : rgb('#2a4a1e'));
          else if (f < 0.74) put(i, m.cave ? wcol[0] : water[3]);
          else if (f < 0.8) put(i, water[4]);
          break;
        }
        case G.COBBLE: {
          // pedras arredondadas cor de areia, como as ruas da vila do Stardew
          const row = Math.floor(py / 7), off = (row % 2) * 4 + Math.floor(hash(row, 1, 5) * 3), cx = Math.floor((px + off) / 8), lx = (px + off) % 8, ly = py % 7;
          const h = hash(cx, row, 3), C = tan;
          let c;
          if (lx === 0 || ly === 0) c = C[0];
          else if ((lx === 1 || lx === 7) && (ly === 1 || ly === 6)) c = C[1];
          else if ((ly === 1 && lx <= 4) || (lx === 1 && ly <= 3)) c = C[4];
          else if (lx === 7 || ly === 6) c = C[1];
          else c = h < 0.3 ? C[2] : h < 0.75 ? C[3] : C[2];
          if (c === C[3] && hash(px, py, 77) < 0.05) c = C[2];
          put(i, c);
          if (winter && n > 0.6 && ly < 4) put(i, rgb('#eef4fa'));
          break;
        }
        case G.WOOD: {
          const row = Math.floor(py / 5), ly = py % 5, joint = (px + hash(row, 0, 9) * 48) % 48 | 0;
          const h = hash(row, Math.floor((px + hash(row, 0, 9) * 48) / 48), 4);
          let k = h < 0.33 ? 2 : h < 0.66 ? 3 : 4;
          if (ly === 4 || joint === 0) k = 0; else if (ly === 0) k = Math.min(4, k + 1);
          if (ly === 2 && noise2(px * 0.4, row * 3, 12) > 0.72) k = Math.max(1, k - 1);
          put(i, wood[k]); break;
        }
        case G.CARPET: {
          const lx = px % T, ly = py % T, C = G.CARPET;
          const edge = (lx < 2 && m.at(tx - 1, ty) !== C) || (lx > 13 && m.at(tx + 1, ty) !== C) || (ly < 2 && m.at(tx, ty - 1) !== C) || (ly > 13 && m.at(tx, ty + 1) !== C);
          const motif = ((px >> 2) + (py >> 2)) % 4 === 0;
          put(i, rgb(edge ? '#e8c060' : motif ? '#b84a4a' : (lx + ly) % 2 ? '#9a3434' : '#a23a3a')); break;
        }
        case G.TILE: {
          const dark = ((px >> 3) + (py >> 3)) % 2 === 1, lx = px % 8, ly = py % 8;
          let c = dark ? '#3e3c48' : '#ece6da';
          if (lx === 0 || ly === 0) c = dark ? '#4c4a58' : '#fffaf0'; else if (lx === 7 || ly === 7) c = dark ? '#2e2c36' : '#d0c8ba';
          put(i, rgb(c)); break;
        }
        case G.STRAW: {
          const st = hash(px >> 1, py, 3), row = Math.floor(py / 6), ly = py % 6;
          let c = n < 0.45 ? '#9a7044' : '#a87c4c';
          if (ly === 5) c = '#86603a';
          if (st < 0.1) c = '#e8c86a'; else if (st < 0.2) c = '#d0a854'; else if (st > 0.97) c = '#6e4a2a';
          put(i, rgb(c)); break;
        }
        case G.WALL: {
          const front = m.at(tx, ty + 1) !== G.WALL, ly = py % T;
          if (m.woodWall) {
            // paredes de tábuas do galinheiro e do celeiro
            if (!front) { put(i, rgb(ly < 2 ? '#2a1808' : (px % 8) === 0 ? '#3a2210' : '#4a2c14')); break; }
            const lx = px % 8, hv = hash(px >> 3, 0, 3);
            put(i, rgb(ly === 15 ? '#3a2210' : lx === 0 ? '#5a3418' : lx === 1 ? '#b07a42' : hv < 0.5 ? '#8e5c2c' : '#9a6632'));
            if (ly === 4 || ly === 11) put(i, rgb('#6a4220'));
            break;
          }
          if (!front) { put(i, rgb(ly < 2 ? '#3a2214' : '#5a3a22')); break; }
          if (ly < 2) put(i, rgb('#3a2214'));
          else if (ly < 10) put(i, rgb((px % 6) < 3 ? '#e8c88a' : '#dcb878'));
          else if (ly === 10) put(i, rgb('#f0d098'));
          else put(i, rgb(ly === 15 ? '#5a3418' : (px % 8) === 0 ? '#7a4a24' : '#a0683a'));
          break;
        }
        case G.CAVE: {
          const cx = Math.floor(px / 5), cy = Math.floor(py / 4), lx = px % 5, ly = py % 4, h = hash(cx, cy, 8);
          let k = n < 0.4 ? 1 : n < 0.62 ? 2 : 1;
          if (h > 0.55) { if (lx === 1 && ly === 1) k = 3; else if (lx >= 3 && ly >= 2) k = 0; }
          if (dith < 0.03) k = 0;
          put(i, ccol[k]); break;
        }
        case G.ROCKWALL: { put(i, wcol[n < 0.5 ? 0 : 1]); break; }
        case G.CLIFF: { const ly = py % 8; put(i, rgb(ly === 0 ? '#5a3a22' : ly === 1 ? '#a8805a' : n < 0.5 ? '#8a6444' : '#7a563a')); break; }
        case G.BRIDGE: { const lx = px % 4, ly = py % T; put(i, rgb(ly === 0 || ly === 15 ? '#4a2a14' : lx === 0 ? '#7a4a24' : ly === 1 ? '#d8a068' : '#b8783e')); break; }
        default: put(i, [0, 0, 0]);
      }
    }
    x.putImageData(img, 0, 0);
  }
  // segunda passada: tufos, flores, pedrinhas e o paredão da caverna
  function groundDetails(m) {
    const s = m.outdoor ? season() : 'summer', pal = PAL[s];
    for (let ty = 0; ty < m.h; ty++) for (let tx = 0; tx < m.w; tx++) {
      const gt = m.at(tx, ty), px = tx * T, py = ty * T, h = i => hash(tx * 13 + i, ty * 7 + i * 3, 21);
      if (gt === G.GRASS || gt === G.FLOWERS) {
        const n = h(1) < 0.55 ? 1 : 0;
        for (let k = 0; k < n + (gt === G.FLOWERS ? 1 : 0); k++) {
          const bx = px + 2 + Math.floor(h(k + 2) * 11), by = py + 4 + Math.floor(h(k + 5) * 10);
          R(bx, by - 2, 1, 3, pal.g[0]); R(bx + 2, by - 3, 1, 4, pal.g[0]); R(bx + 4, by - 2, 1, 3, pal.g[0]); R(bx + 1, by, 3, 1, pal.g[0]);
          R(bx, by - 3, 1, 1, pal.g[3]); R(bx + 2, by - 4, 1, 1, pal.tip); R(bx + 4, by - 3, 1, 1, pal.g[3]);
        }
        if (gt === G.FLOWERS) for (let k = 0; k < 3; k++) {
          const fx = px + 2 + Math.floor(h(k + 10) * 11), fy = py + 2 + Math.floor(h(k + 14) * 11), c = pal.fl[Math.floor(h(k + 18) * pal.fl.length)];
          R(fx, fy + 2, 1, 2, pal.g[0]); R(fx - 1, fy, 3, 2, shade(c, -0.25)); R(fx, fy - 1, 1, 1, c); R(fx - 1, fy, 1, 1, c); R(fx + 1, fy, 1, 1, c); R(fx, fy, 1, 1, '#ffe86a');
        }
      } else if (gt === G.DIRT && h(3) < 0.4) { const bx = px + Math.floor(h(4) * 13), by = py + Math.floor(h(5) * 13); R(bx, by, 2, 2, '#d8b888'); R(bx, by + 2, 2, 1, '#6a4428'); }
      else if (gt === G.ROCKWALL && m.at(tx, ty + 1) !== G.ROCKWALL && m.at(tx, ty + 1) !== G.VOID) {
        const c = CAVE_PAL[m.tier || 0].w;
        for (let k = 0; k < 3; k++) {
          const bx = px + 2 + k * 5 + Math.floor(h(k) * 3), by = py + 6 + Math.floor(h(k + 3) * 4), r = 4 + Math.floor(h(k + 6) * 3);
          oval(bx, by + 1, r + 1, r, c[0]); oval(bx, by, r, r - 1, c[2]); oval(bx - 1, by - 1, r - 2, r - 2, c[3]); R(bx - 2, by - 3, 2, 1, c[4]);
        }
        R(px, py + 14, T, 2, c[0]);
      } else if (gt === G.WALL && m.woodWall && ty <= 2 && m.at(tx, ty + 1) !== G.WALL && tx % 4 === 2 && tx < m.w - 2) {
        R(px + 1, py + 2, 14, 11, '#5a3418'); R(px + 2, py + 3, 12, 9, '#f8e8a0'); R(px + 2, py + 3, 12, 3, '#fff8d8'); R(px + 7, py + 3, 2, 9, '#5a3418'); R(px + 2, py + 7, 12, 1, '#5a3418'); R(px, py + 13, 16, 2, '#8a5a2a');
      } else if (gt === G.STRAW && h(30) < 0.05) {
        oval(px + 8, py + 11, 7, 3, '#b08a30'); oval(px + 8, py + 10, 6, 2.5, '#d8b048');
        for (let k = 0; k < 7; k++) R(px + 3 + k * 2, py + 7 + (k % 3), 1, 3, k % 2 ? '#f0d070' : '#c89a38');
      } else if (gt === G.CAVE && h(7) < 0.08) { const bx = px + 3 + Math.floor(h(8) * 9), by = py + 4 + Math.floor(h(9) * 8), c = CAVE_PAL[m.tier || 0].f; R(bx, by, 3, 2, c[3]); R(bx, by + 2, 3, 1, c[0]); }
      else if (gt === G.WATER && !m.cave && m.id === 'farm' && h(11) < 0.05) { const bx = px + 4, by = py + 6; oval(bx + 3, by + 2, 4, 2.5, '#3a8a3a'); R(bx + 3, by, 2, 3, '#2a6a2a'); R(bx + 2, by + 1, 2, 1, '#6ac04a'); }
    }
  }
  const groundCache = new Map();
  function groundFor(m) {
    const key = (m.gkey || m.id) + '|' + (m.outdoor ? season() : 'in');
    if (groundCache.has(key)) return groundCache.get(key);
    if (groundCache.size > 10) groundCache.clear();
    const c = document.createElement('canvas'); c.width = m.w * T; c.height = m.h * T;
    groundPixels(m, c);
    const saved = ctx; ctx = c.getContext('2d');
    try { groundDetails(m); } catch (e) { console.warn(e); }
    ctx = saved;
    groundCache.set(key, c);
    return c;
  }
  // árvores da mata nas bordas dos mapas (cobrem tudo que é FOREST)
  function forestTrees(m) {
    if (m.forest) return m.forest;
    const list = [];
    for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) if (m.at(x, y) === G.FOREST && (x + y * 2) % 3 === 0) list.push({ x: x * T + 8 + Math.round((hash(x, y, 2) - 0.5) * 8), y: y * T + 14 + Math.round((hash(x, y, 4) - 0.5) * 6), v: (h => (h < 0.45 ? 2 : h < 0.8 ? 0 : 1))(hash(x, y, 6)) });
    m.forest = list;
    return list;
  }

  // ================= árvores =================
  const TREE_PAL = {
    spring: [['#1e5222', '#2e7230', '#45923a', '#64b046', '#94d266'], ['#1e5222', '#2e7230', '#45923a', '#64b046', '#f4b8d8'], ['#14402a', '#1e5a34', '#2a7440', '#3a8e4c', '#5aa860']],
    summer: [['#174a1e', '#256828', '#368630', '#4ca23a', '#78c050'], ['#174a1e', '#256828', '#368630', '#4ca23a', '#78c050'], ['#123a26', '#1a522e', '#246a38', '#328444', '#4e9c56']],
    fall: [['#6a3410', '#9a5014', '#c8761e', '#e89a2e', '#f8c858'], ['#5e1410', '#8e2214', '#be3a1c', '#e2602a', '#f8a050'], ['#123a26', '#1a522e', '#246a38', '#328444', '#4e9c56']],
    winter: [['#4a3626', '#6a4a30', '#8a6440', '#d8e4f0', '#ffffff'], ['#7a92b4', '#a4bad6', '#c8daec', '#e6f0f8', '#ffffff'], ['#14382a', '#1e5034', '#2a6a40', '#e8f0f8', '#ffffff']],
  };
  // copa de folhas em cachos: sombra embaixo, luz em cima à esquerda, textura de folhinhas
  function leafCanopy(cx, by, p, clumps, seed) {
    for (const [dx, dy, r] of clumps) disc(cx + dx + 1, by + dy + 2, r + 1, p[0]);
    for (const [dx, dy, r] of clumps) disc(cx + dx, by + dy, r, p[1]);
    for (const [dx, dy, r] of clumps) disc(cx + dx - 2, by + dy - 2, r - 3, p[2]);
    for (const [dx, dy, r] of clumps) if (dy < -40) disc(cx + dx - 3, by + dy - 4, Math.max(2, r - 6), p[3]);
    const r2 = srand(seed);
    for (let k = 0; k < 70; k++) {
      const [dx, dy, r] = clumps[Math.floor(r2() * clumps.length)], a = r2() * TAU, d = r2() * (r - 2);
      const x = cx + dx + Math.cos(a) * d, y = by + dy + Math.sin(a) * d;
      if (Math.sin(a) > 0.2) { R(x, y, 2, 1, p[0]); R(x + 1, y - 1, 1, 1, p[1]); } else { R(x, y, 2, 1, p[3]); R(x, y - 1, 1, 1, p[4]); }
    }
  }
  function trunk(cx, by, top, c = ['#4a2e1a', '#6a4426', '#8a5a32']) {
    poly([[cx - 5, top], [cx + 4, top], [cx + 5, by - 5], [cx + 10, by], [cx + 2, by - 2], [cx - 2, by], [cx - 11, by], [cx - 6, by - 5]], c[0]);
    R(cx - 4, top, 4, by - top - 3, c[1]); R(cx - 3, top, 2, by - top - 4, c[2]);
    for (let y = top + 4; y < by - 6; y += 6) { R(cx - 1, y, 3, 1, c[0]); R(cx - 4, y + 3, 2, 1, c[0]); }
    R(cx - 8, by - 2, 4, 1, c[1]); R(cx + 5, by - 2, 3, 1, c[1]);
  }
  // galhos pelados com neve em cima (carvalho no inverno)
  function bareBranches(cx, by, seed) {
    const r = srand(seed);
    const seg = (x, y, a, len, w, d) => {
      const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
      ctx.strokeStyle = '#5a3a24'; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = '#f4f8fc'; ctx.lineWidth = Math.max(1, w * 0.45); ctx.beginPath(); ctx.moveTo(x, y - w * 0.6); ctx.lineTo(x2, y2 - w * 0.6); ctx.stroke();
      if (d > 0) { seg(x2, y2, a - 0.45 - r() * 0.25, len * 0.72, Math.max(1, w * 0.68), d - 1); seg(x2, y2, a + 0.4 + r() * 0.25, len * 0.7, Math.max(1, w * 0.66), d - 1); }
    };
    seg(cx, by - 26, -Math.PI / 2 - 0.1, 14, 5, 3);
    seg(cx - 1, by - 30, -Math.PI / 2 - 0.9, 11, 3, 2);
    seg(cx + 1, by - 32, -Math.PI / 2 + 0.85, 11, 3, 2);
  }
  // pinheiro em camadas
  function pineTree(cx, by, p, snow) {
    R(cx - 3, by - 16, 6, 16, '#4a2e1a'); R(cx - 2, by - 16, 2, 16, '#6a4426'); poly([[cx - 7, by], [cx - 3, by - 4], [cx + 3, by - 4], [cx + 7, by]], '#4a2e1a');
    const tiers = [[44, 10], [38, 19], [32, 28], [25, 37], [18, 45], [10, 52]];
    for (const [w, up] of tiers) {
      const yb = by - up, yt = yb - 18;
      const pts = [[cx, yt]]; for (let k = 0; k <= 6; k++) { const x = cx + w / 2 - k * w / 6; pts.push([x, yb + (k % 2 ? -3 : 1)]); }
      poly([[cx, yt - 1], [cx + w / 2 + 1, yb + 2], [cx - w / 2 - 1, yb + 2]], p[0]);
      poly(pts, p[1]);
      poly([[cx, yt + 2], [cx - 2, yb - 2], [cx - w / 2 + 3, yb - 2]], p[2]);
      for (let k = 0; k < w / 5; k++) R(cx - w / 2 + 3 + k * 5, yb - 3 - (k % 2) * 3, 1, 3, p[0]);
      R(cx - 1, yt + 3, 1, 4, p[3]);
      if (snow) { poly([[cx, yt], [cx + w / 4, yt + 9], [cx - w / 4, yt + 9]], '#eef4fa'); R(cx - w / 4 + 2, yt + 9, w / 2 - 4, 1, '#c8d8ea'); }
    }
  }
  function treeCanvas(v = 0, big = false) {
    const s = season();
    return bake(`tree|${s}|${v}|${big}`, 52, 76, () => {
      const p = TREE_PAL[s][v % 3], cx = 26, by = 74;
      if (v % 3 === 2) { pineTree(cx, by, p, s === 'winter'); return; }
      if (s === 'winter' && v % 3 === 0) { trunk(cx, by, by - 30); bareBranches(cx, by, 17 + v); return; }
      trunk(cx, by, by - 30);
      const clumps = v % 3 === 1
        ? [[0, -58, 10], [-10, -54, 9], [10, -55, 9], [-17, -44, 9], [17, -45, 9], [-14, -34, 8], [14, -33, 8], [-5, -30, 9], [6, -31, 9], [0, -45, 14], [-8, -47, 10], [8, -47, 10]]
        : [[0, -60, 10], [-11, -56, 10], [11, -56, 10], [-18, -46, 10], [18, -46, 10], [-16, -34, 9], [16, -34, 9], [-6, -30, 10], [7, -30, 10], [0, -46, 15], [-8, -48, 11], [8, -48, 11]];
      leafCanopy(cx, by, p, clumps, v * 31 + 7);
      const r2 = srand(v * 13 + 3);
      if (s === 'spring' && v === 1) for (let k = 0; k < 14; k++) { const a = r2() * TAU, d = r2() * 18; R(cx + Math.cos(a) * d, by - 46 + Math.sin(a) * d * 0.8, 2, 2, '#f8c8e0'); R(cx + Math.cos(a) * d, by - 46 + Math.sin(a) * d * 0.8, 1, 1, '#ffffff'); }
      if (s === 'winter') for (let k = 0; k < 18; k++) { const a = -Math.PI * r2(), d = 8 + r2() * 12; R(cx + Math.cos(a) * d, by - 46 + Math.sin(a) * d, 3, 1, '#ffffff'); }
    });
  }
  function drawTree(bx, by, sc = 1, v = 0, hp = 10, shake = 0) {
    const sx = shake ? Math.round(Math.sin(performance.now() / 25) * 1.5) : 0;
    shadowAt(bx, by, 13, 4);
    blit(treeCanvas(v), bx - 26 + sx, by - 74);
  }

  // ================= pedras, mato, gravetos =================
  function rockCanvas(v, kind, tier) {
    return bake(`rock|${v}|${kind}|${tier}`, 18, 18, () => {
      const p = tier === 1 ? ['#3e5a7a', '#5c7ea0', '#7ea2c2', '#b4d0e6'] : tier === 2 ? ['#3a2a2a', '#5a4040', '#7a5a54', '#a07a6a'] : ['#5e544c', '#7e746a', '#a0968a', '#c8c0b2'];
      const big = v % 2;
      poly([[2, 14], [3, 7 - big], [7, 3 - big], [12, 3], [16, 7], [16, 14], [13, 16], [5, 16]], p[0]);
      poly([[3, 13], [4, 7 - big], [8, 4 - big], [12, 4], [15, 8], [15, 12], [12, 14], [5, 14]], p[1]);
      poly([[4, 10], [5, 6 - big], [9, 4 - big], [12, 5], [11, 9], [7, 11]], p[2]);
      R(6, 5 - big, 3, 1, p[3]); R(5, 6 - big, 1, 2, p[3]);
      R(11, 10, 3, 1, p[0]); R(13, 9, 1, 1, p[0]);
      const spec = { cobre: ['#c86a2a', '#f4a060'], ferro: ['#a8b0b8', '#ffffff'], ouro: ['#d8a020', '#fff080'], coal: ['#141414', '#4a4a4a'] }[kind];
      if (spec) for (const [x, y] of [[5, 9], [10, 7], [8, 12], [12, 11], [7, 6]]) { R(x, y, 2, 2, spec[0]); R(x, y, 1, 1, spec[1]); }
      if (kind.startsWith('gem')) { const gc = { quartzo: '#f0f0ff', ametista: '#b05ae0', topazio: '#f4b83a', esmeralda: '#3ae07a', diamante: '#bff8ff' }[kind.split(':')[1]]; for (const [x, y] of [[5, 8], [10, 7], [8, 11]]) { poly([[x + 1, y - 1], [x + 3, y + 1], [x + 1, y + 3], [x - 1, y + 1]], gc); R(x, y, 1, 1, '#ffffff'); } }
    });
  }
  function drawRock(px, py, v = 0, kind = 'stone', tier = 0) { shadowAt(px + 8, py + 15, 7, 2.5); blit(rockCanvas(v, kind, tier), px - 1, py - 2); }
  function weedCanvas(v) {
    const s = season();
    return bake(`weed|${s}|${v}`, 16, 16, () => {
      const p = s === 'fall' ? ['#7a4a1a', '#a86a24', '#d0902e', '#f0b840'] : s === 'winter' ? ['#6a7a86', '#98a8b4', '#c8d4de', '#ffffff'] : ['#245a1e', '#3a7e2a', '#5aa83a', '#8ad050'];
      for (const [x, y, r] of [[5, 10, 4], [10, 9, 4], [8, 6, 4], [4, 6, 3], [12, 5, 3]]) disc(x, y, r, p[1]);
      for (const [x, y, r] of [[5, 9, 3], [10, 8, 3], [8, 5, 3]]) disc(x - 1, y - 1, r - 1, p[2]);
      R(6, 3, 1, 2, p[3]); R(9, 2, 1, 2, p[3]); R(3, 5, 1, 1, p[3]); R(12, 4, 1, 1, p[3]);
      R(4, 12, 2, 2, p[0]); R(10, 12, 2, 2, p[0]);
      if (v === 1 && s !== 'winter') { R(7, 3, 2, 2, s === 'spring' ? '#f4e04a' : '#e86a8a'); }
    });
  }
  const TWIG = () => bake('twig', 16, 16, () => { poly([[2, 11], [12, 8], [14, 9], [4, 13]], '#7a4a24'); R(5, 10, 6, 1, '#a8703a'); poly([[8, 9], [6, 5], [7, 5], [9, 9]], '#6a3e1e'); R(12, 7, 2, 2, '#5a8a2a'); });
  const STUMP = () => bake('stump', 18, 16, () => { poly([[2, 14], [3, 6], [15, 6], [16, 14], [12, 15], [6, 15]], '#6a4224'); R(4, 7, 3, 7, '#8a5a32'); R(12, 7, 2, 7, '#4a2c18'); oval(9, 6, 6.5, 2.6, '#d4a86a'); oval(9, 6, 4, 1.6, '#b88850'); R(8, 6, 2, 1, '#d4a86a'); });

  // ================= objetos da chacrinha =================
  function objCanvas(k, extra = '') {
    return bake('obj|' + k + '|' + extra, 18, 22, () => {
      ctx.translate(1, 4);
      switch (k) {
        case 'bau': R(1, 5, 14, 11, '#9a5a2a'); R(1, 2, 14, 5, '#b8743a'); R(1, 2, 14, 1, '#d89a5a'); R(1, 7, 14, 1, '#5a3418'); R(1, 15, 14, 1, '#5a3418'); R(1, 5, 1, 11, '#c88a4a'); R(14, 5, 1, 11, '#6a3a1a'); R(6, 6, 4, 4, '#e8c040'); R(7, 7, 2, 2, '#8a6a10'); for (const x of [3, 12]) R(x, 3, 1, 12, '#c8a040'); break;
        case 'pote': R(2, 1, 12, 15, '#7a5a3a'); R(3, 2, 10, 13, '#9a7a52'); R(3, 2, 2, 13, '#b8946a'); R(5, 5, 6, 8, extra === 'on' ? '#d8482a' : extra === 'ready' ? '#f05a3a' : '#5a4434'); R(5, 5, 2, 2, '#ffffff66'); R(1, 0, 14, 2, '#5a4434'); R(2, -1, 12, 1, '#7a5a3a'); break;
        case 'barril': R(2, 1, 12, 15, '#8a5428'); R(3, 1, 3, 15, '#a86a3a'); R(11, 1, 2, 15, '#6a3c1a'); for (const y of [3, 8, 13]) { R(2, y, 12, 1, '#3e3e46'); R(2, y + 1, 12, 1, '#6a6a74'); } R(6, 0, 4, 1, '#c8884a'); if (extra) R(7, 9, 2, 2, extra === 'ready' ? '#e8402a' : '#8a3a1a'); break;
        case 'fornalha': R(2, 0, 12, 16, '#6a6a6a'); for (let y = 1; y < 16; y += 3) for (let x = 2 + (y % 2) * 2; x < 14; x += 4) R(x, y, 3, 2, '#8a8a8a'); R(4, 7, 8, 7, '#2a2a2a'); if (extra === 'on') { R(5, 9, 6, 5, '#ff7a1a'); R(6, 10, 4, 3, '#ffd23a'); } R(1, -1, 14, 2, '#9a9a9a'); break;
        case 'irrigador': R(5, 9, 6, 6, '#b86a2a'); R(6, 10, 4, 4, '#d8883a'); R(7, 4, 2, 6, '#9a5a20'); R(5, 3, 6, 2, '#e8a84a'); R(4, 14, 8, 2, '#7a7a82'); break;
        case 'espantalho': R(7, -2, 2, 18, '#6a4224'); R(1, 4, 14, 2, '#6a4224'); R(3, 5, 10, 7, '#c8402a'); R(4, 6, 2, 5, '#a83020'); R(7, 6, 2, 1, '#f4c040'); oval(8, 0, 4, 4, '#e8c870'); R(4, -4, 8, 2, '#8a5a2a'); R(6, -6, 4, 2, '#8a5a2a'); R(6, 0, 1, 1, '#2a1a10'); R(9, 0, 1, 1, '#2a1a10'); R(7, 2, 2, 1, '#a8603a'); R(2, 12, 3, 4, '#e8c870'); R(11, 12, 3, 4, '#e8c870'); break;
        case 'tocha': R(7, 4, 2, 12, '#6a3a1a'); R(6, 3, 4, 2, '#4a4a52'); break;
        case 'cerca': R(2, 2, 3, 14, '#a86a3a'); R(11, 2, 3, 14, '#a86a3a'); R(2, 2, 1, 14, '#c8884a'); R(0, 5, 16, 2, '#c8884a'); R(0, 10, 16, 2, '#c8884a'); R(0, 7, 16, 1, '#7a4a24'); R(0, 12, 16, 1, '#7a4a24'); R(3, 1, 1, 1, '#d8a060'); R(12, 1, 1, 1, '#d8a060'); break;
      }
    });
  }
  // cerca de madeira que se emenda com as vizinhas
  function drawFence(px, py, k) {
    const pre = k.startsWith('g:') ? 'g:' : '', [x, y] = k.slice(pre.length).split(',').map(Number);
    const is = (dx, dy) => { const t = W.farm.t[pre + (x + dx) + ',' + (y + dy)]; return !!(t && t.o && t.o.k === 'cerca'); };
    const mask = (is(-1, 0) ? 1 : 0) | (is(1, 0) ? 2 : 0);
    shadowAt(px + 8, py + 15, 5, 1.5);
    blit(bake('fence|' + mask, 16, 26, () => {
      for (const [on, x0] of [[mask & 1, 0], [mask & 2, 10]]) if (on) for (const yy of [9, 17]) { R(x0, yy, 6, 3, '#b07a42'); R(x0, yy, 6, 1, '#d8a868'); R(x0, yy + 2, 6, 1, '#7a4a24'); }
      R(5, 4, 6, 20, '#8a5428'); R(5, 4, 2, 20, '#b07a42'); R(10, 4, 1, 20, '#5a3418'); R(5, 2, 6, 2, '#c8904a'); R(6, 1, 4, 1, '#d8a868');
    }), px, py - 10);
  }
  function drawObj(o, px, py, k, nf) {
    const t = performance.now() / 1000;
    if (drawObj2(o, px, py, k) || drawObj3(o, px, py)) return;
    switch (o.k) {
      case 'tree': drawTree(px + 8, py + 15, 1, o.v || 0, o.hp, o.shake > performance.now()); if (o.tap) drawTapper(px, py, o); break;
      case 'stump': shadowAt(px + 8, py + 15, 7, 2); blit(STUMP(), px - 1, py); break;
      case 'rock': drawRock(px, py, o.v); break;
      case 'twig': blit(TWIG(), px, py); break;
      case 'weed': blit(weedCanvas(o.v || 0), px, py); break;
      case 'forage': shadowAt(px + 8, py + 14, 5, 1.5); drawIconAt(o.id, px, py - 2 + Math.sin(t * 2 + px) * 1); break;
      case 'cerca': drawFence(px, py, k); break;
      case 'tocha': shadowAt(px + 8, py + 15, 4, 1.5); blit(objCanvas('tocha'), px - 1, py - 4); disc(px + 8, py + 1 + Math.sin(t * 14) * 0.6, 2.6, '#ff8a1a'); R(px + 7, py + 1, 2, 2, '#ffe04a'); break;
      default: {
        const busy = o.in && o.ready > gm(), ready = o.in && o.ready <= gm();
        shadowAt(px + 8, py + 15, 7, 2);
        blit(objCanvas(o.k, o.k === 'fornalha' ? (busy ? 'on' : '') : ready ? 'ready' : busy ? 'on' : ''), px - 1, py - 4);
        if (o.k === 'fornalha' && busy && Math.sin(t * 6) > 0) { R(px + 4, py - 6 - (t * 8) % 6, 2, 2, '#a8a8a888'); }
        if (ready) readyBubble(px, py, o.out);
      }
    }
  }
  function readyBubble(px, py, id) {
    const b = Math.round(Math.sin(performance.now() / 250) * 1.5);
    blit(bake('bubble', 18, 20, () => { oval(9, 8, 8, 7.5, '#ffffff'); poly([[6, 14], [12, 14], [9, 18]], '#ffffff'); }), px - 1, py - 22 + b);
    drawIconAt(id, px + 2, py - 19 + b, 0.75);
  }

  // ================= plantações =================
  function cropCanvas(c) {
    const d = CROPS[c.id];
    const dd = cropDays(c), st = c.dead ? 'dead' : c.g >= dd && !(c.rg > 0) ? 'ripe' : c.g / dd < 0.25 && !c.harvested ? 's0' : c.g / dd < 0.6 && !c.harvested ? 's1' : 's2';
    return bake(`crop|${c.id}|${st}|${season()}`, 18, 30, () => {
      ctx.translate(1, 12);
      const L = d.leaf, Ld = shade(L, -0.35), Ll = shade(L, 0.3), P = d.col, Pd = shade(P, -0.3), Pl = shade(P, 0.4);
      const leaf = (x, y, w, h, flip) => { poly(flip ? [[x, y + h], [x + w, y], [x + w * 0.3, y + h * 0.4]] : [[x, y + h], [x - w, y], [x - w * 0.3, y + h * 0.4]], L); R(x + (flip ? 1 : -2), y + h - 2, 1, 1, Ll); };
      if (st === 'dead') { R(7, 8, 2, 7, '#8a6a3a'); poly([[8, 9], [3, 5], [5, 9]], '#a8844a'); poly([[8, 7], [13, 4], [11, 8]], '#9a7440'); return; }
      if (st === 's0') { R(7, 11, 2, 4, Ld); poly([[8, 12], [3, 8], [5, 12]], L); poly([[8, 11], [13, 7], [11, 11]], L); R(4, 9, 1, 1, Ll); return; }
      const grow = st === 's1' ? 0.6 : 1;
      switch (d.kind) {
        case 'root':
          for (const [x, h, f] of [[6, 9, 0], [8, 12, 1], [10, 9, 1], [7, 11, 0]]) { const hh = Math.round(h * grow); poly([[x, 15], [x - 2 + f * 4, 15 - hh], [x + 1, 15 - hh + 3]], f ? L : Ld); R(x - 1 + f * 2, 15 - hh + 1, 1, 2, Ll); }
          if (st === 'ripe') { oval(8, 14, 4.5, 3, P); R(5, 13, 2, 1, Pl); R(8, 15, 3, 1, Pd); }
          break;
        case 'big':
          for (const [x, y, f] of [[3, 9, 0], [13, 9, 1], [8, 6, 0]]) oval(x, y + 2, 4.5 * grow + 1, 3.5 * grow + 1, f ? Ld : L);
          R(5, 8, 2, 1, Ll); R(10, 7, 2, 1, Ll);
          if (st !== 's1') { const r = st === 'ripe' ? 6 : 3.5; oval(8, 15 - r * 0.7, r + 1, r, st === 'ripe' ? P : '#9ac86a'); if (st === 'ripe') { oval(6, 13 - r * 0.7, r * 0.4, r * 0.35, Pl); if (c.id === 'melao') for (let k = -4; k <= 4; k += 4) R(8 + k, 11 - r * 0.4, 1, r * 1.4, Pd); if (c.id === 'abobora') { R(7, 3, 2, 4, '#5a3a1a'); R(5, 8, 1, 6, Pd); R(11, 8, 1, 6, Pd); } if (c.id === 'couveflor') for (const [x, y] of [[5, 10], [8, 9], [10, 11], [7, 12]]) R(x, y, 2, 1, '#e8dcc0'); } }
          break;
        case 'bush': {
          const r = st === 's1' ? 4 : 6;
          oval(8, 15 - r, r + 1, r, Ld); oval(7, 14 - r, r, r - 1, L); oval(6, 13 - r, r - 2, r - 3, Ll);
          if (st === 'ripe') for (const [x, y] of [[4, 8], [10, 6], [7, 11], [12, 10], [7, 5], [3, 12]]) { R(x, y, 2, 2, P); R(x, y, 1, 1, Pl); }
          break;
        }
        case 'coffee': {
          const hh = st === 's1' ? 12 : 21, top = 15 - hh, wood = '#7a5432';
          R(7, top + 2, 2, hh - 2, wood); R(7, top + 2, 1, hh - 2, '#9a7048');
          const levels = st === 's1' ? [top + 3, top + 8] : [top + 2, top + 7, top + 12, top + 17];
          const wOf = i => 3 + Math.min(i, 2) * 1.5;
          levels.forEach((y, i) => {
            const w = wOf(i);
            R(8 - w, y + 2, w * 2, 1, wood);
            for (const f of [-1, 1]) { oval(8 + f * (w + 1), y + 1, 2.6, 1.4, i % 2 ? L : Ld); R(8 + f * (w + 1) - 1, y + 1, 2, 1, Ll); }
          });
          // frutinhos por cima das folhas: verdes crescendo, vermelhos quando maduros
          if (st === 'ripe' || st === 's2') levels.forEach((y, i) => {
            const w = wOf(i);
            for (const f of [-1, 1]) for (const [dx, dy] of [[0, 0], [2, 0], [1, 2]]) { const x = 8 + f * (w - 1) + dx - 1, yy = y + 2 + dy; R(x, yy, 2, 2, st === 'ripe' ? (dy ? Pd : P) : '#7ab84a'); R(x, yy, 1, 1, st === 'ripe' ? Pl : '#a8d878'); }
          });
          oval(8, top + 1, 2.6, 2, Ld); R(7, top, 1, 1, Ll);
          break;
        }
        case 'vine': {
          R(7, -8, 2, 23, '#a8783e'); R(7, -8, 1, 23, '#c8985a'); R(3, -5, 10, 2, '#8a5a2a'); R(3, 4, 10, 1, '#8a5a2a');
          const n = st === 's1' ? 3 : 6;
          for (let k = 0; k < n; k++) { const x = k % 2 ? 10 : 4, y = 12 - k * 3; oval(x, y, 3, 2, k % 2 ? L : Ld); R(x - 1, y - 1, 1, 1, Ll); }
          if (st === 'ripe') for (const [x, y] of [[3, 0], [11, -3], [4, 7], [11, 5], [6, -6]]) { if (c.id === 'vagem') { R(x, y, 2, 6, P); R(x, y, 1, 3, Pl); } else if (c.id === 'uva') { for (const [dx, dy] of [[0, 0], [2, 0], [1, 2], [0, 3], [2, 3], [1, 5]]) R(x + dx, y + dy, 2, 2, P); R(x, y, 1, 1, Pl); } else { disc(x + 1, y + 1, 2.2, P); R(x, y, 1, 1, Pl); } }
          break;
        }
        case 'flower': {
          const ripe = st === 'ripe';
          for (const [x, h, f] of [[5, 9, 0], [8, 12, 1], [11, 8, 0]]) {
            const hh = Math.round(h * (st === 's1' ? 0.6 : 1));
            R(x, 15 - hh, 1, hh, Ld); poly([[x, 14], [x - 3 + f * 6, 11], [x, 12]], L); R(x - 2 + f * 4, 12, 1, 1, Ll);
            if (st === 's2') { oval(x + 0.5, 14 - hh, 1.5, 2, P); R(x, 13 - hh, 1, 1, Pl); }
            if (ripe) { const cy = 14 - hh; for (let a = 0; a < 5; a++) disc(x + 0.5 + Math.cos(a / 5 * TAU - 1.57) * 2.2, cy + Math.sin(a / 5 * TAU - 1.57) * 2.2, 1.6, P); R(x - 1, cy - 2, 1, 1, Pl); R(x, cy, 1, 1, '#ffe04a'); }
          }
          break;
        }
        case 'sunflower': {
          const hh = st === 's1' ? 10 : 22;
          R(7, 15 - hh, 2, hh, Ld); R(7, 15 - hh, 1, hh, L);
          for (const [y, f] of [[12, 0], [7, 1], [2, 0]]) if (15 - y < hh + 2) poly([[8, y], [f ? 14 : 2, y - 3], [f ? 12 : 4, y + 1]], f ? L : Ld);
          if (st === 's2') { disc(8, 15 - hh, 3, '#7ab83a'); disc(8, 15 - hh, 1.5, '#e8c840'); }
          if (st === 'ripe') { const cy = 15 - hh; for (let a = 0; a < 12; a++) disc(8 + Math.cos(a / 12 * TAU) * 5, cy + Math.sin(a / 12 * TAU) * 5, 2.2, a % 2 ? P : Pl); disc(8, cy, 3.6, '#6a3a12'); R(7, cy - 2, 2, 1, '#9a6a2a'); R(9, cy + 1, 1, 1, '#4a2208'); }
          break;
        }
        case 'tall': {
          const hh = st === 's1' ? 10 : 22, ripeWheat = c.id === 'trigo' && st === 'ripe';
          for (const x of [4, 8, 12]) { R(x, 15 - hh, 2, hh, ripeWheat ? '#c8a03a' : L); R(x, 15 - hh, 1, hh, ripeWheat ? '#e8c860' : Ll); poly([[x + 1, 15 - hh * 0.5], [x + 5, 15 - hh * 0.7], [x + 1, 15 - hh * 0.4]], ripeWheat ? '#b88a2a' : Ld); }
          if (st === 'ripe') { if (c.id === 'trigo') for (const x of [3, 7, 11]) { oval(x + 1, 15 - hh - 2, 2, 4, P); R(x, 15 - hh - 4, 1, 2, Pl); } else { oval(10, 0, 2.5, 5, P); R(9, -4, 1, 6, Pl); poly([[8, 4], [12, 4], [10, -3]], '#7ab83a'); } }
          break;
        }
      }
    });
  }
  function drawCrop(c, px, py) { if (!CROPS[c.id]) return; blit(cropCanvas(c), px - 1, py - 12); }

  // ================= personagens (16×32, com contorno) =================
  const HAIRS = ['#3a2416', '#7a4a24', '#e8c05a', '#c8502a', '#1e1a2a', '#e8e0d0', '#c86ab8', '#4a8ad8'];
  const SHIRTS = ['#d84a3a', '#3a8ad8', '#5ab83a', '#e8b83a', '#a85ad8', '#f08ab0', '#3a3a4a', '#f4f0e0'];
  const SKINS = ['#f8d8b8', '#eab894', '#c88a5e', '#8e5c3c', '#5e3c26'];
  function farmerCanvas(look, dir, frame) {
    const key = `f|${look.hair || 0}|${look.style || 0}|${look.shirt || 0}|${look.skin || 0}|${look.pants || ''}|${look.npc || ''}|${look.hat || ''}|${look.plaid ? 1 : 0}|${look.shirtC || ''}|${look.jacket ? 1 : 0}|${look.scarf ? 1 : 0}|${look.beard ? 1 : 0}|${look.glasses ? 1 : 0}|${look.boot || ''}|${dir}|${frame}`;
    return bake(key, 18, 35, () => {
      ctx.translate(1, 2);
      const hair = HAIRS[look.hair || 0], hD = shade(hair, -0.35), hL = shade(hair, 0.3);
      const skin = SKINS[look.skin || 0], sD = shade(skin, -0.16), sL = shade(skin, 0.25);
      const shirt = look.apron || look.shirtC || SHIRTS[look.shirt || 0], cD = shade(shirt, -0.3), cL = shade(shirt, 0.25);
      const pants = look.pants || '#3a4a7a', pD = shade(pants, -0.3), boot = look.boot || '#5a3420', bD = shade(boot, -0.35);
      const step = frame === 1 ? 1 : frame === 3 ? -1 : 0, side = dir === 2 || dir === 3;
      const style = look.bald ? 3 : look.style || 0;
      if (dir === 2) { ctx.translate(16, 0); ctx.scale(-1, 1); }
      // cabelo comprido atrás do corpo
      if (style === 1 && dir !== 0) { R(side ? 3 : 1, 6, side ? 6 : 14, 13, hD); }
      // pernas e botas
      if (!side) {
        R(4, 22, 8, 5, pants); R(4, 22, 2, 5, shade(pants, 0.15)); R(10, 22, 2, 5, pD);
        R(4, 27 - (step > 0 ? 1 : 0), 3, 2, pants); R(9, 27 - (step < 0 ? 1 : 0), 3, 2, pants);
        R(4, 29 - (step > 0 ? 1 : 0), 4, 2, boot); R(8, 29 - (step < 0 ? 1 : 0), 4, 2, boot); R(4, 30 - (step > 0 ? 1 : 0), 4, 1, bD); R(8, 30 - (step < 0 ? 1 : 0), 4, 1, bD);
      } else {
        const f = step * 2;
        R(6, 22, 5, 4, pants); R(6, 22, 1, 4, shade(pants, 0.15));
        R(6 + f, 26, 3, 3, pants); R(8 - f, 26, 3, 3, pD);
        R(6 + f, 29, 4, 2, boot); R(8 - f, 29, 4, 2, bD);
      }
      // tronco
      R(3, 15, 10, 8, shirt); R(3, 15, 10, 1, cL); R(11, 16, 2, 7, cD); R(3, 16, 1, 6, cL);
      if (!side && dir === 1) { R(7, 15, 2, 2, sD); R(6, 15, 1, 1, sD); R(9, 15, 1, 1, sD); }
      R(3, 22, 10, 1, shade(pants, -0.2)); if (!side) R(7, 22, 2, 1, '#d8b040');
      if (look.apron) { R(4, 17, 8, 6, look.apron); R(5, 16, 6, 1, look.apron); }
      // braços
      if (!side) {
        const a = step;
        R(1, 16 + a, 2, 6, shirt); R(1, 16 + a, 1, 6, cL); R(1, 22 + a, 2, 2, skin);
        R(13, 16 - a, 2, 6, cD); R(13, 22 - a, 2, 2, sD);
      } else { const a = step * 2; R(7 + a, 16, 3, 6, cD); R(8 + a, 16, 1, 5, shirt); R(7 + a, 22, 3, 2, skin); }
      // detalhes da roupa: camisa xadrez, casaco com capuz, gola
      if (look.plaid) {
        const L = '#e8eaf2', Rd = '#c83a3a', D = shade(shirt, -0.35);
        if (!side) {
          for (const x of [4, 7, 10]) R(x, 15, 1, 7, x === 7 ? Rd : L);
          for (const y of [17, 20]) R(3, y, 10, 1, y === 20 ? D : L);
          const a = step; R(1, 18 + a, 2, 1, L); R(13, 18 - a, 2, 1, L); R(1, 20 + a, 2, 1, Rd); R(13, 20 - a, 2, 1, Rd);
          if (dir === 1) { R(7, 15, 1, 8, D); R(6, 17, 1, 1, '#d8d8e0'); R(6, 20, 1, 1, '#d8d8e0'); }
        } else { const a = step * 2; for (const x of [4, 9]) R(x, 15, 1, 7, L); R(3, 18, 10, 1, L); R(3, 20, 10, 1, Rd); R(7 + a, 18, 3, 1, L); }
      }
      if (look.jacket) {
        const D = shade(shirt, -0.3), Lg = shade(shirt, 0.25);
        if (dir === 1) { R(7, 15, 1, 8, D); R(4, 19, 3, 1, D); R(9, 19, 3, 1, D); R(3, 14, 3, 2, Lg); R(10, 14, 3, 2, Lg); R(6, 15, 1, 2, '#3a4a7a'); R(9, 15, 1, 2, '#3a4a7a'); }
        else if (dir === 0) { R(4, 14, 8, 3, D); R(5, 15, 6, 1, Lg); }
        else { R(4, 14, 4, 2, Lg); R(4, 19, 3, 1, D); }
        R(3, 22, 10, 1, D);
      }
      if (look.scarf) { if (!side) R(4, 14, 8, 2, '#1e1e24'); else R(5, 14, 6, 2, '#1e1e24'); }
      // cabeça
      const hx = side ? 3 : 2;
      R(hx + 1, 2, 10, 1, skin); R(hx, 3, 12, 10, skin); R(hx + 1, 13, 10, 1, skin);
      R(hx + 10, 4, 2, 9, sD); R(hx + 1, 13, 10, 1, sD); R(hx + 2, 4, 2, 2, sL);
      if (dir === 1) {
        R(4, 8, 2, 3, '#2a1a14'); R(10, 8, 2, 3, '#2a1a14'); R(4, 8, 1, 1, '#ffffff'); R(10, 8, 1, 1, '#ffffff');
        R(3, 11, 2, 1, '#f0a090'); R(11, 11, 2, 1, '#f0a090'); R(7, 11, 2, 1, sD); R(7, 12, 2, 1, '#b85a4a');
        if (look.glasses) { R(3, 7, 4, 1, '#2a2a2a'); R(9, 7, 4, 1, '#2a2a2a'); R(3, 7, 1, 4, '#2a2a2a'); R(6, 7, 1, 4, '#2a2a2a'); R(9, 7, 1, 4, '#2a2a2a'); R(12, 7, 1, 4, '#2a2a2a'); R(3, 10, 4, 1, '#2a2a2a'); R(9, 10, 4, 1, '#2a2a2a'); R(7, 8, 2, 1, '#2a2a2a'); }
        if (look.beard) { R(3, 9, 1, 4, hair); R(12, 9, 1, 4, hair); R(4, 12, 8, 2, hair); R(5, 14, 6, 1, hair); R(6, 11, 4, 1, hair); R(7, 12, 2, 1, '#b85a4a'); R(7, 13, 2, 1, shade(hair, 0.15)); }
      } else if (side) {
        R(11, 8, 2, 3, '#2a1a14'); R(11, 8, 1, 1, '#ffffff'); R(15, 9, 1, 2, skin); R(12, 12, 2, 1, '#b85a4a'); R(12, 11, 1, 1, '#f0a090');
        R(7, 8, 2, 3, sD); R(8, 9, 1, 1, shade(skin, -0.3));
        if (look.glasses) { R(10, 7, 4, 1, '#2a2a2a'); R(10, 10, 4, 1, '#2a2a2a'); R(10, 7, 1, 4, '#2a2a2a'); R(13, 7, 1, 4, '#2a2a2a'); R(5, 8, 5, 1, '#2a2a2a'); }
        if (look.beard) { R(8, 11, 7, 3, hair); R(9, 14, 5, 1, hair); }
      }
      // cabelo
      if (style !== 3) {
        if (dir === 0) {
          R(hx, 1, 12, 12, hair); R(hx + 1, 0, 10, 1, hair); R(hx + 9, 2, 3, 10, hD); R(hx + 2, 2, 4, 2, hL);
          if (style === 1) R(hx, 12, 12, 7, hair);
        } else if (side) {
          R(hx + 1, 0, 10, 1, hair); R(hx, 1, 12, 4, hair); R(hx, 5, 6, 6, hair); R(hx + 8, 5, 4, 2, hair); R(hx + 11, 5, 1, 3, hair);
          R(hx + 2, 1, 5, 1, hL); R(hx, 7, 2, 4, hD);
          if (style === 1) R(hx - 1, 8, 5, 10, hair);
        } else {
          R(hx + 1, 0, 10, 1, hair); R(hx, 1, 12, 4, hair); R(hx, 5, 3, 1, hair); R(hx + 6, 5, 6, 2, hair); R(hx + 9, 7, 3, 1, hair);
          R(hx - 1, 4, 2, style === 1 ? 14 : 6, hair); R(hx + 11, 4, 2, style === 1 ? 14 : 6, hair);
          R(hx + 3, 1, 5, 1, hL); R(hx + 2, 2, 2, 1, hL); R(hx + 10, 3, 2, 3, hD);
        }
        if (style === 2) { disc(8, -1, 3.5, hair); R(6, -3, 2, 1, hL); }
      } else { R(hx + 3, 3, 3, 1, sL); if (dir !== 0) { R(hx, 4, 1, 5, hair); R(hx + 11, 4, 1, 5, hair); } }
      // touca
      if (look.hat === 'beanie') {
        const c = '#1e1e24', d = '#2e2e36';
        R(hx, -1, 12, 6, c); R(hx + 1, -2, 10, 1, c); R(hx - 1, 3, 14, 3, d);
        for (let x = hx; x < hx + 12; x += 2) R(x, 3, 1, 3, '#16161a');
        R(hx + 2, -1, 3, 1, '#3a3a44');
      }
    });
  }
  function drawFarmer(cx, fy, look, dir, walk, opts = {}) {
    cx = Math.round(cx); fy = Math.round(fy);
    shadowAt(cx, fy, 6, 2);
    if (opts.sleep) return;
    const frame = walk ? Math.floor(walk * 8) % 4 : 0, bob = frame % 2 ? -1 : 0;
    blit(farmerCanvas(look || {}, dir, frame), cx - 9, fy - 33 + bob);
    if (opts.item) { const ix = cx - 8; drawIconAt(opts.item, ix, fy - 50 + bob, 1); }
    if (opts.tool) drawToolSwing(cx, fy + bob, dir, opts.tool, opts.toolT || 0, opts.toolLv || 0);
  }
  function drawToolSwing(cx, y, dir, tool, t, lv) {
    const ic = iconCanvas(tool, lv);
    ctx.save();
    const a = dir === 3 ? -1.7 + t * 2.4 : dir === 2 ? 1.7 - t * 2.4 : dir === 1 ? -0.7 + t * 1.4 : 0.7 - t * 1.4;
    const ox = dir === 3 ? 6 : dir === 2 ? -6 : dir === 1 ? 2 : 0, oy = dir === 0 ? -18 : -12;
    // rastro do golpe para espada e foice
    if (tool === 'sword' || tool === 'scythe') {
      const a0 = dir === 3 ? -1.7 : dir === 2 ? 1.7 : dir === 1 ? -0.7 : 0.7;
      const off = dir === 2 ? -2.2 : -0.94;
      ctx.strokeStyle = `rgba(255,255,255,${(0.75 * (1 - t)).toFixed(2)})`; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cx + ox, y + oy, 15, Math.min(a0, a) + off, Math.max(a0, a) + off); ctx.stroke();
    }
    ctx.translate(cx + ox, y + oy); ctx.rotate(a); if (dir === 2) ctx.scale(-1, 1);
    ctx.drawImage(ic, -3, -16, 16, 16);
    ctx.restore();
  }
  const NPC_LOOK = {
    pedro: { hair: 1, shirt: 2, skin: 1, pants: '#5a4a3a', glasses: true, apron: '#4a9a4a', npc: 'pedro' },
    claudio: { hair: 4, shirt: 6, skin: 2, pants: '#3a3a3a', bald: true, beard: true, apron: '#7a4a2a', npc: 'claudio' },
  };
  function drawNPC(who, cx, fy) { drawFarmer(cx, fy, NPC_LOOK[who], 1, 0); }

  // ================= monstros =================
  function slimeCanvas(col, f) {
    return bake(`slime|${col}|${f}`, 20, 18, () => {
      const sq = f ? 2 : 0, d = shade(col, -0.35), l = shade(col, 0.4);
      ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(10, 15 - 6 + sq, 8 + sq, 7 - sq, 0, Math.PI, 0); ctx.lineTo(18 + sq, 16); ctx.lineTo(2 - sq, 16); ctx.closePath(); ctx.fill();
      R(2 - sq, 13, 16 + sq * 2, 3, d); oval(7, 7 + sq, 3, 2, l); R(5, 6 + sq, 2, 1, '#ffffff');
      R(6, 10 + sq, 2, 3, '#1a1a1a'); R(12, 10 + sq, 2, 3, '#1a1a1a'); R(6, 10 + sq, 1, 1, '#ffffff'); R(12, 10 + sq, 1, 1, '#ffffff');
    });
  }
  function batCanvas(f) {
    return bake(`bat|${f}`, 24, 14, () => {
      const c = '#5a3a7a', d = '#3a2050';
      if (f) { poly([[12, 7], [1, 2], [4, 7], [2, 10], [8, 9]], d); poly([[12, 7], [23, 2], [20, 7], [22, 10], [16, 9]], d); }
      else { poly([[12, 6], [2, 11], [5, 6], [3, 3], [9, 5]], d); poly([[12, 6], [22, 11], [19, 6], [21, 3], [15, 5]], d); }
      oval(12, 7, 4, 4, c); R(10, 2, 1, 3, c); R(13, 2, 1, 3, c); R(10, 6, 1, 1, '#ff4a4a'); R(13, 6, 1, 1, '#ff4a4a'); R(11, 9, 2, 1, '#ffffff');
    });
  }
  function drawMonster(mo) {
    const t = performance.now() / 1000 + mo.ph, x = Math.round(mo.x), y = Math.round(mo.y), hit = mo.hitT > 0;
    shadowAt(x, y, 7, 2);
    if (hit) ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 60);
    if (mo.kind === 'slime') blit(slimeCanvas(mo.col, Math.abs(Math.sin(t * 4)) > 0.6 ? 1 : 0), x - 10, y - 16);
    else if (mo.kind === 'duster') blit(bake('duster|' + (Math.sin(t * 10) > 0 ? 1 : 0), 18, 18, () => { const f = Math.sin(t * 10) > 0; for (let k = 0; k < 14; k++) { const a = k / 14 * TAU; R(9 + Math.cos(a) * (f ? 7 : 6), 10 + Math.sin(a) * (f ? 6 : 7), 2, 2, '#1a1a22'); } disc(9, 10, 6, '#24242e'); R(6, 8, 2, 3, '#ffffff'); R(11, 8, 2, 3, '#ffffff'); R(7, 9, 1, 2, '#e8402a'); R(12, 9, 1, 2, '#e8402a'); }), x - 9, y - 18 - Math.abs(Math.sin(t * 8)) * 3);
    else if (mo.kind === 'ghost') { ctx.globalAlpha = hit ? 0.5 : 0.8; blit(bake('ghost', 20, 24, () => { ctx.fillStyle = '#e8f0f8'; ctx.beginPath(); ctx.arc(10, 9, 8, Math.PI, 0); ctx.lineTo(18, 22); for (let k = 0; k < 4; k++) { ctx.lineTo(16 - k * 4, 19 + (k % 2) * 3); } ctx.lineTo(2, 22); ctx.closePath(); ctx.fill(); R(6, 7, 2, 4, '#2a2a3a'); R(12, 7, 2, 4, '#2a2a3a'); R(8, 13, 4, 2, '#2a2a3a'); }), x - 10, y - 30 + Math.sin(t * 2) * 3); ctx.globalAlpha = 1; }
    else blit(batCanvas(Math.sin(t * 16) > 0 ? 1 : 0), x - 12, y - 22 + Math.sin(t * 3) * 3);
    ctx.globalAlpha = 1;
    if (mo.hp < mo.max) { R(x - 8, y - 22, 16, 3, '#2a1010'); R(x - 7, y - 21, 14 * mo.hp / mo.max, 1, '#e8402a'); }
  }

  // ================= prédios e móveis =================
  function shingleRoof(x, y, w, h, c) {
    const d = shade(c, -0.3), l = shade(c, 0.22);
    R(x, y, w, h, c);
    for (let yy = y; yy < y + h; yy += 4) { R(x, yy + 3, w, 1, d); for (let xx = x + ((yy - y) / 4 % 2 ? 0 : 3); xx < x + w; xx += 6) { R(xx, yy, 1, 3, d); R(xx + 1, yy, 2, 1, l); } }
  }
  function winPx(x, y, w, h, night, frame = '#f4e8d0') {
    R(x - 2, y - 2, w + 4, h + 4, frame); R(x - 2, y + h + 1, w + 4, 2, shade(frame, -0.3));
    R(x, y, w, h, night ? '#ffd870' : '#6ab4e8'); R(x, y, w, Math.ceil(h / 2), night ? '#ffe8a0' : '#9ad4f8');
    R(x + Math.floor(w / 2), y, 1, h, frame); R(x, y + Math.floor(h / 2), w, 1, frame);
    if (!night) { R(x + 1, y + 1, 2, 1, '#e8f8ff'); R(x + 1, y + 2, 1, 2, '#e8f8ff'); }
  }
  function doorPx(x, y, c = '#8a4a2a', w = 14, h = 20) { R(x - 2, y - 2, w + 4, h + 2, '#e8dcc0'); R(x, y, w, h, shade(c, -0.25)); R(x + 1, y + 1, w - 2, h - 1, c); R(x + 2, y + 3, w - 4, 6, shade(c, 0.15)); R(x + 2, y + 11, w - 4, 6, shade(c, 0.15)); R(x + w - 4, y + 11, 2, 2, '#f4c83a'); }
  function buildingCanvas(type, w, h, night, col) {
    const s = season();
    return bake(`b|${type}|${w}|${h}|${night ? 1 : 0}|${s}|${col || ''}`, w + 16, h + 40, () => {
      ctx.translate(8, 36);
      const snow = s === 'winter';
      switch (type) {
        case 'house': {
          // casa da chacrinha: troncos, varanda coberta, janelas com venezianas e base de pedra
          const wl = '#c8783a', wd = '#8a4a20', wl2 = '#e09a52';
          R(2, 18, w - 4, h - 26, wl);
          for (let yy = 20; yy < h - 8; yy += 6) { R(2, yy + 4, w - 4, 1, wd); R(2, yy, w - 4, 1, wl2); }
          for (const xx of [2, w - 6]) { for (let yy = 20; yy < h - 8; yy += 6) { disc(xx + 2, yy + 2, 2.6, '#a85a28'); R(xx + 1, yy + 1, 2, 1, '#e8b070'); } }
          // telhado
          poly([[-7, 24], [w / 2, -28], [w + 7, 24]], '#6a1a12');
          ctx.save(); ctx.beginPath(); ctx.moveTo(-5, 22); ctx.lineTo(w / 2, -26); ctx.lineTo(w + 5, 22); ctx.closePath(); ctx.clip(); shingleRoof(-7, -28, w + 14, 52, snow ? '#e8eef4' : '#c0402a'); ctx.restore();
          R(-7, 22, w + 14, 3, '#4a120c'); R(-7, 21, w + 14, 1, snow ? '#ffffff' : '#e86a42');
          winPx(w / 2 - 6, -4, 12, 10, night, '#f4e8d0');
          // chaminé de pedra
          R(w - 30, -20, 13, 24, '#8a8278'); for (let yy = -18; yy < 4; yy += 4) for (let xx = w - 30 + ((yy / 4) & 1 ? 0 : 3); xx < w - 18; xx += 6) R(xx, yy, 5, 3, '#a8a096'); R(w - 32, -22, 17, 3, '#5a524a');
          // janelas com venezianas vermelhas e floreiras
          for (const xx of [14, w - 32]) {
            R(xx - 6, 32, 5, 20, '#a83a2a'); R(xx + 19, 32, 5, 20, '#a83a2a'); for (let yy = 34; yy < 52; yy += 3) { R(xx - 6, yy, 5, 1, '#7a2418'); R(xx + 19, yy, 5, 1, '#7a2418'); }
            winPx(xx, 34, 18, 16, night, '#f4e8d0');
            R(xx - 2, 52, 22, 4, '#6a4a2a'); for (let k = 0; k < 5; k++) disc(xx + 1 + k * 4, 51, 2, ['#e8402a', '#f4d040', '#e86ab0', '#ffffff', '#e8402a'][k]);
          }
          // base de pedra
          R(2, h - 10, w - 4, 10, '#7a7268'); for (let xx = 2; xx < w - 4; xx += 8) for (let yy = h - 10; yy < h; yy += 5) R(xx + ((yy / 5) & 1 ? 0 : 4), yy, 7, 4, '#9a9288');
          // varanda com telhadinho e colunas
          const px0 = 3 * T - 14, pw = T + 28;
          R(px0, h - 8, pw, 8, '#b07a44'); for (let xx = px0; xx < px0 + pw; xx += 5) R(xx, h - 8, 1, 8, '#8a5a2e'); R(px0, h - 8, pw, 1, '#d8a868');
          doorPx(3 * T + 1, h - 30, '#8a3a2a', 14, 22);
          R(px0 + 1, h - 40, 3, 32, '#e8dcc0'); R(px0 + pw - 4, h - 40, 3, 32, '#e8dcc0');
          poly([[px0 - 4, h - 38], [px0 + 4, h - 46], [px0 + pw - 4, h - 46], [px0 + pw + 4, h - 38]], snow ? '#e8eef4' : '#a8301e'); R(px0 - 4, h - 38, pw + 8, 2, '#5a1a12');
          R(px0 + pw - 12, h - 18, 6, 10, '#c8884a'); disc(px0 + pw - 9, h - 19, 3.5, '#5ab83a'); disc(px0 + pw - 9, h - 22, 2, '#f4d040');
          break;
        }
        case 'store': {
          R(2, 18, w - 4, h - 18, '#f0dcb0');
          for (let yy = 20; yy < h; yy += 6) R(2, yy, w - 4, 1, '#d8bc8a');
          R(2, h - 8, w - 4, 8, '#a87a4a'); R(2, h - 8, w - 4, 1, '#c89a6a');
          shingleRoof(-6, -14, w + 12, 34, snow ? '#e8eef4' : '#3a8a5a');
          R(-6, 18, w + 12, 3, '#1e4a34');
          R(w / 2 - 38, 24, 76, 16, '#5a3418'); R(w / 2 - 36, 26, 72, 12, '#e8c070'); R(w / 2 - 36, 26, 72, 2, '#f8dc98');
          for (let k = 0; k < 9; k++) { R(6 + k * ((w - 12) / 9), 46, (w - 12) / 9 + 1, 6, k % 2 ? '#f4f0e0' : '#d84a3a'); }
          R(6, 52, w - 12, 1, '#8a2a1a');
          winPx(12, 58, 30, 18, true, '#f4e8d0'); winPx(w - 42, 58, 30, 18, true, '#f4e8d0');
          for (let k = 0; k < 4; k++) disc(16 + k * 7, 72, 2.5, ['#e8402a', '#f4d040', '#5ab83a', '#e8a040'][k]);
          doorPx(4 * T + 1, h - 22, '#3a6a4a');
          break;
        }
        case 'smith': {
          R(2, 18, w - 4, h - 18, '#7a7a78');
          for (let yy = 19, r = 0; yy < h; yy += 7, r++) for (let xx = 2 + (r % 2) * 6; xx < w - 3; xx += 12) { R(xx, yy, 11, 6, '#9a9a96'); R(xx, yy, 11, 1, '#b8b8b2'); R(xx, yy + 5, 11, 1, '#6a6a68'); }
          shingleRoof(-6, -10, w + 12, 30, snow ? '#e8eef4' : '#4a3e3e');
          R(-6, 18, w + 12, 3, '#2a1e1e');
          R(w - 26, -26, 14, 30, '#5a4a4a'); R(w - 28, -28, 18, 4, '#3a2e2e');
          R(8, 26, 46, 15, '#3a2a1a'); R(10, 28, 42, 11, '#5a3e24');
          winPx(w - 42, 48, 26, 16, true, '#d8d0c0');
          R(12, 50, 22, 8, '#4a4a52'); R(16, 58, 14, 4, '#3a3a42'); R(14, 62, 18, 4, '#3a3a42');
          doorPx(4 * T + 1, h - 22, '#5a3a2a');
          break;
        }
        case 'cottage': {
          R(2, 16, w - 4, h - 16, '#e8d4ac'); for (let yy = 18; yy < h; yy += 5) R(2, yy, w - 4, 1, '#cfb888');
          poly([[-4, 20], [w / 2, -18], [w + 4, 20]], shade(col, -0.4));
          ctx.save(); ctx.beginPath(); ctx.moveTo(-2, 18); ctx.lineTo(w / 2, -16); ctx.lineTo(w + 2, 18); ctx.closePath(); ctx.clip(); shingleRoof(-4, -18, w + 8, 38, snow ? '#e8eef4' : col); ctx.restore();
          R(-4, 18, w + 8, 3, shade(col, -0.5));
          winPx(12, 32, 16, 14, night); doorPx(w - 30, h - 22, '#7a4a2a');
          break;
        }
        case 'bin': R(1, 4, w - 2, 12, '#9a5a2a'); for (let k = 4; k < w - 2; k += 6) R(k, 4, 1, 12, '#7a4220'); R(0, 0, w, 5, '#c8884a'); R(0, 0, w, 1, '#e0a868'); R(0, 4, w, 1, '#5a3418'); R(w / 2 - 4, 1, 8, 2, '#e8c040'); R(2, 15, w - 4, 1, '#5a3418'); break;
        case 'mailbox': R(7, 6, 2, 10, '#6a4a2a'); R(2, 0, 12, 8, '#c83a2a'); R(2, 0, 12, 2, '#e86a4a'); R(2, 7, 12, 1, '#8a2418'); R(12, -4, 1, 6, '#3a3a3a'); R(13, -4, 3, 2, '#f4c83a'); break;
        case 'fountain': oval(w / 2, h / 2 + 4, w / 2, h / 2 - 2, '#8a8278'); oval(w / 2, h / 2 + 3, w / 2 - 2, h / 2 - 4, '#b0a89e'); oval(w / 2, h / 2 + 3, w / 2 - 6, h / 2 - 8, '#3c88d4'); oval(w / 2 - 4, h / 2, 6, 3, '#6ab4e8'); R(w / 2 - 3, 4, 6, 18, '#b0a89e'); R(w / 2 - 3, 4, 2, 18, '#d0c8be'); R(w / 2 - 7, 2, 14, 4, '#c8c0b6'); break;
        case 'bench': R(0, 4, w, 5, '#a86a3a'); R(0, 4, w, 1, '#c8884a'); R(0, 0, w, 3, '#8a5428'); R(2, 9, 2, 6, '#3a3a3a'); R(w - 4, 9, 2, 6, '#3a3a3a'); break;
        case 'board': R(2, 18, 3, 14, '#6a3a1a'); R(w - 5, 18, 3, 14, '#6a3a1a'); R(0, 2, w, 18, '#8a5428'); R(2, 4, w - 4, 14, '#c8a06a'); R(5, 6, 8, 7, '#fff4e0'); R(17, 7, 9, 8, '#ffe0e0'); R(8, 5, 2, 2, '#e8402a'); R(21, 6, 2, 2, '#3a8ad8'); break;
        case 'bed': R(1, 0, w - 2, 6, '#7a4220'); R(2, 1, w - 4, 4, '#a0602e'); R(2, 6, w - 4, h - 8, '#a0602e'); R(4, 6, w - 8, 9, '#f4f0e8'); R(5, 7, w - 10, 6, '#ffffff');
          for (let yy = 15; yy < h - 4; yy += 6) for (let xx = 4; xx < w - 4; xx += 6) R(xx, yy, 6, 6, ((xx + yy) / 6) % 2 ? '#4a7ac8' : '#6a9ae0'); R(4, 15, w - 8, 1, '#3a5a9a'); R(1, h - 3, w - 2, 3, '#6a3a1a'); break;
        case 'table': R(2, 6, w - 4, 12, '#a86a3a'); R(2, 6, w - 4, 2, '#c8884a'); R(4, 18, 2, 10, '#6a3a1a'); R(w - 6, 18, 2, 10, '#6a3a1a'); R(9, 0, 8, 7, '#e8e0d0'); disc(13, 0, 3, '#5ab83a'); R(12, -2, 2, 2, '#e8402a'); break;
        case 'tv': R(3, 2, w - 6, 12, '#2a2a2e'); R(5, 4, w - 10, 8, night ? '#5a9ae8' : '#2a4a6a'); R(6, 5, 3, 2, '#ffffff44'); R(7, 14, w - 14, 2, '#5a3a2a'); break;
        case 'plant': R(4, 9, 8, 7, '#c86a3a'); R(4, 9, 8, 1, '#e08a5a'); for (const [dx, dy] of [[0, 0], [-3, 2], [3, 2], [0, 4], [-2, -2], [2, -3]]) { oval(8 + dx, 4 + dy, 2.5, 3.5, '#3a8a2a'); R(7 + dx, 2 + dy, 1, 2, '#6ac04a'); } break;
        case 'shelf': R(0, 0, w, h, '#7a4a24'); R(2, 2, w - 4, h - 4, '#5a3418'); for (let k = 0; k < 3; k++) { R(2, 10 + k * 9, w - 4, 2, '#a86a3a'); for (let i = 0; i < 5; i++) { const c = ['#e8402a', '#f4c83a', '#5ab83a', '#f4f0e0', '#c86ad8'][(i + k) % 5]; R(4 + i * 9, 3 + k * 9, 6, 7, c); R(4 + i * 9, 3 + k * 9, 6, 1, shade(c, 0.3)); } } break;
        case 'counter': R(0, 0, w, h, '#a86a3a'); R(0, 0, w, 3, '#d89a5a'); R(0, 3, w, 1, '#6a3a1a'); for (let k = 8; k < w; k += 16) R(k, 4, 1, h - 4, '#8a5428'); R(10, -4, 10, 4, '#e8e0d0'); R(w - 22, -6, 6, 6, '#f4c83a'); break;
        case 'crates': for (const [dx, dy] of [[0, 8], [16, 8], [8, -4]]) { R(dx, dy, 15, 14, '#c8944a'); R(dx, dy, 15, 2, '#e0b06a'); R(dx + 7, dy, 1, 14, '#8a5a28'); R(dx, dy + 13, 15, 1, '#7a4a20'); } break;
        case 'forge': R(0, 4, w, h - 4, '#5a5a5a'); for (let yy = 6; yy < h; yy += 6) R(0, yy, w, 1, '#4a4a4a'); R(6, 14, w - 12, 10, '#e86a2a'); R(8, 16, w - 16, 6, '#ffd04a'); R(4, 0, w - 8, 6, '#3a3a3a'); break;
        case 'anvil': R(1, 3, 14, 4, '#4a4a52'); R(1, 3, 14, 1, '#7a7a84'); R(5, 7, 6, 4, '#3a3a42'); R(3, 11, 10, 4, '#3a3a42'); break;
        case 'elevator': R(0, 0, w, h, '#5a4a3a'); R(3, 3, w - 6, h - 6, '#2a2018'); R(w / 2 - 1, 3, 2, h - 6, '#8a7a6a'); R(w - 9, 12, 5, 8, '#c8b048'); R(w - 8, 13, 3, 2, '#fff080'); for (let k = 3; k < h - 3; k += 4) R(3, k, w - 6, 1, '#3a3028'); break;
        case 'cart': R(2, 4, w - 4, 8, '#6a4a2a'); R(2, 4, w - 4, 1, '#8a6a4a'); for (const dx of [6, w - 8]) { disc(dx + 1, 13, 2.5, '#3a3a3a'); } for (let k = 0; k < 4; k++) oval(7 + k * 5, 3, 3, 2.5, ['#9a8a7a', '#c86a2a', '#9a8a7a', '#b8b0a8'][k]); break;
      }
    });
  }
  function drawSprite(s, nf) {
    const x = s.x * T, y = s.y * T, w = s.w * T, h = s.h * T, night = nf > 0.35;
    switch (s.type) {
      case 'tree': drawTree(x + 8, y + 15, 1, 2); return;
      case 'npc': drawNPC(s.npc, x + 8, y + 16); return;
      case 'ladder': R(x + 2, y + 1, 12, 14, '#120c08'); blit(bake('ladder', 16, 18, () => { ctx.translate(0, 1); R(3, 0, 2, 16, '#a86a3a'); R(11, 0, 2, 16, '#a86a3a'); for (let k = 2; k < 16; k += 4) R(3, k, 10, 1, '#c8884a'); }), x, y - 1); return;
      case 'ladderup': blit(bake('ladderup', 16, 30, () => { R(3, 0, 2, 30, '#a86a3a'); R(11, 0, 2, 30, '#a86a3a'); R(3, 0, 1, 30, '#c8884a'); for (let k = 2; k < 30; k += 4) R(3, k, 10, 1, '#c8884a'); }), x, y - 14); return;
    }
    if (B2.has(s.type)) {
      let extra = '';
      const cm = curMap();
      if (s.type === 'trough') { const b = cm.bid && W.farm.b && W.farm.b[cm.bid]; extra = b && (b.feed || 0) > s.i ? 'hay' : ''; }
      if (s.type === 'minechest') extra = W.meta.chests && W.meta.chests[cm.floor] ? 'open' : '';
      if (s.type === 'ccbuilding') extra = ccRoomsDone();
      if (s.type === 'ccaltar') extra = ccRoomsDone() >= 6 ? 'on' : '';
      if (s.type === 'ccplaque') extra = ccRoomDone(s.room) ? 'on' : '';
      if (s.type === 'museumb' || s.type === 'ccbuilding') shadowAt(x + w / 2, y + h, w / 2 + 2, 4);
      if (s.type === 'mcase') { blit(building2Canvas(s.type, w, h, false), x - 8, y - 36); s.slots.forEach((id, i) => { if (W.meta.museum && W.meta.museum[id]) drawIconAt(id, x + i * w / 3 + (w / 3 - 10) / 2, y - 7, 0.62); }); return; }
      if (['carpentry', 'ranch', 'bar', 'fishshop'].includes(s.type)) shadowAt(x + w / 2, y + h, w / 2 + 2, 4);
      if (s.type === 'palm') shadowAt(x + 10, y + 15, 8, 3);
      blit(building2Canvas(s.type, w, h, night, extra), x - 8, y - 36);
      return;
    }
    if (['house', 'store', 'smith', 'cottage', 'fountain'].includes(s.type)) shadowAt(x + w / 2, y + h, w / 2 + 2, 4);
    blit(buildingCanvas(s.type, w, h, night && ['house', 'cottage', 'tv'].includes(s.type), s.col), x - 8, y - 36);
    const t = performance.now() / 1000;
    if (s.type === 'smith' || s.type === 'house') { const cxp = x + w - (s.type === 'smith' ? 19 : 24), cyp = y - (s.type === 'smith' ? 30 : 22); for (let k = 0; k < 3; k++) { const p = (t * 0.4 + k / 3) % 1; ctx.fillStyle = `rgba(220,220,230,${0.55 * (1 - p)})`; ctx.beginPath(); ctx.arc(cxp + Math.sin(p * 6 + k) * 3, cyp - p * 24, 2 + p * 4, 0, TAU); ctx.fill(); } }
    if (s.type === 'fountain') for (let k = 0; k < 5; k++) { const p = (t * 1.2 + k / 5) % 1; R(x + w / 2 - 6 + k * 3, y + 2 - Math.sin(p * Math.PI) * 6, 1, 2, '#bfe6ff'); }
    if (s.type === 'forge') { R(x + 8, y + 16, w - 16, 6, Math.sin(t * 8) > 0 ? '#ffd04a' : '#ffb03a'); }
  }
  // plaquinha com o nome da outra pessoa, acima da cabeça
  function nameTag(name, x, y, heart) {
    ctx.font = '700 8px "Pixelify Sans", monospace';
    const w = Math.ceil(ctx.measureText(name).width) + (heart ? 12 : 6);
    ctx.fillStyle = 'rgba(40, 20, 10, 0.7)'; ctx.fillRect(Math.round(x - w / 2), Math.round(y - 6), w, 11);
    drawText(name, x - (heart ? 3 : 0), y, '#ffffff', 8);
    if (heart) drawHeart(Math.round(x + w / 2 - 6), Math.round(y - 2), '#e83a6a');
  }
  // ---------- texto ----------
  function drawText(s, x, y, c = '#ffffff', size = 7, outline) {
    ctx.font = `700 ${size}px "Pixelify Sans", monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (outline) { ctx.fillStyle = outline; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) ctx.fillText(s, x + dx, y + dy); }
    ctx.fillStyle = c; ctx.fillText(s, x, y);
  }
