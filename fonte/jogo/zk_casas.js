
  // ================= casas dos moradores: cada uma com o jeito de quem mora =================
  // Nena: chalé florido com telha colonial · Davi: sobrado com sacada · Helena: tijolinho com mansarda
  // Juca: madeira azul com varanda e caixa do correio · Rosa: cabana de troncos · Bia: casinha colorida
  // Tonico: enxaimel com lambrequim · Cida: casa colonial com platibanda
  function clipPts(pts, fn) { ctx.save(); ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.clip(); fn(); ctx.restore(); }
  function telhaRoof(x, y, w, h, c) {
    const d = shade(c, -0.32), l = shade(c, 0.25);
    R(x, y, w, h, c);
    for (let yy = y; yy < y + h; yy += 5) { R(x, yy + 4, w, 1, d); for (let xx = x + (((yy - y) / 5) % 2 ? 0 : 3); xx < x + w; xx += 6) { R(xx, yy, 2, 4, l); R(xx + 5, yy, 1, 4, d); } }
  }
  function winArc(x, y, w, h, night, frame) {
    const r = w / 2, g = night ? '#ffd870' : '#6ab4e8', g2 = night ? '#ffe8a0' : '#9ad4f8';
    disc(x + r, y + r, r + 2, frame); R(x - 2, y + r, w + 4, h - r + 2, frame); R(x - 2, y + h + 1, w + 4, 2, shade(frame, -0.3));
    disc(x + r, y + r, r, g2); R(x, y + r, w, h - r, g); R(x, y + r, w, Math.ceil((h - r) / 3), g2);
    R(x + Math.floor(w / 2), y, 1, h, frame); R(x, y + r + 2, w, 1, frame);
    if (!night) R(x + 2, y + r, 1, 3, '#e8f8ff');
  }
  function winRound(cx, cy, r, night, frame) {
    disc(cx, cy, r + 2, frame); disc(cx, cy, r, night ? '#ffd870' : '#6ab4e8'); disc(cx - 1, cy - 1, r - 2, night ? '#ffe8a0' : '#9ad4f8');
    R(cx - r, cy, r * 2, 1, frame); R(cx, cy - r, 1, r * 2, frame);
  }
  function venez(x, y, h, c) { R(x, y, 5, h, c); for (let yy = y + 2; yy < y + h; yy += 3) R(x, yy, 5, 1, shade(c, -0.3)); R(x, y, 1, h, shade(c, 0.2)); }
  function floreira(x, y, w, cols, box = '#8a5a2a') {
    R(x, y, w, 4, box); R(x, y, w, 1, shade(box, 0.25));
    for (let k = 0; x + 2 + k * 4 < x + w; k++) { disc(x + 2 + k * 4, y - 1, 2.2, '#3a8a2a'); disc(x + 2 + k * 4, y - 2, 1.6, cols[k % cols.length]); }
  }
  function vaso(x, y, c, flor) { R(x, y, 8, 7, c); R(x, y, 8, 1, shade(c, 0.3)); R(x + 1, y + 6, 6, 1, shade(c, -0.3)); oval(x + 4, y - 3, 5, 4, '#3a8a2a'); oval(x + 3, y - 4, 2, 2, '#5ab84a'); if (flor) for (const [dx, dy] of [[-2, -4], [2, -6], [4, -2]]) disc(x + 4 + dx, y + dy, 1.6, flor); }
  function larGable(w, base, top, over, col, snow, roofFn = shingleRoof) {
    poly([[-over, base + 2], [w / 2, top], [w + over, base + 2]], shade(col, -0.45));
    clipPts([[-over + 2, base], [w / 2, top + 2], [w + over - 2, base]], () => roofFn(-over, top, w + over * 2, base - top + 2, snow ? '#e8eef4' : col));
    R(-over, base, w + over * 2, 3, shade(col, -0.5));
    if (snow) R(-over, base - 1, w + over * 2, 1, '#ffffff');
  }

  const LAR_DESENHO = {
    nena(w, h, night, snow) {
      const wall = '#f6e6c6', wd = '#e2c89a';
      R(2, 14, w - 4, h - 14, wall);
      for (let i = 0; i < 40; i++) R(4 + (i * 37) % (w - 8), 16 + (i * 23) % (h - 22), 1, 1, wd);
      R(2, h - 6, w - 4, 6, '#b8a088'); for (let x = 4; x < w - 4; x += 8) R(x, h - 4, 6, 3, '#a08870');
      R(12, -12, 9, 20, '#c8603a'); R(11, -14, 11, 3, '#8a3a20');
      larGable(w, 16, -22, 6, '#c8603a', snow, telhaRoof);
      winRound(w / 2, 0, 5, night, '#ffffff');
      venez(6, 28, 17, '#4a8a4a'); winPx(13, 28, 16, 17, night, '#ffffff'); venez(31, 28, 17, '#4a8a4a');
      doorPx(49, h - 22, '#4a8a4a');
      disc(56, h - 18, 2, '#e84a6a'); disc(55, h - 19, 1, '#ff8aa8');
      // roseira subindo pela parede
      for (let yy = h - 6; yy > 18; yy -= 3) { disc(w - 7 + Math.sin(yy * 0.4) * 2, yy, 2.2, '#3a8a3a'); if (yy % 9 === 0) disc(w - 6 + Math.sin(yy * 0.4) * 2, yy - 1, 1.8, '#e84a6a'); }
      // cerquinha branca e canteiro
      for (let x = -4; x < 40; x += 5) { R(x, h - 13, 3, 13, '#ffffff'); R(x + 1, h - 14, 1, 1, '#ffffff'); R(x + 2, h - 13, 1, 13, '#d8d0c0'); }
      R(-4, h - 10, 44, 2, '#ffffff'); R(-4, h - 5, 44, 2, '#ffffff');
      for (let k = 0; k < 7; k++) disc(-1 + k * 6, h - 16, 2, ['#ff8ac8', '#f4d040', '#ffffff', '#e84a6a'][k % 4]);
    },
    davi(w, h, night, snow) {
      const wall = '#f4f6f8', line = '#d4dae2', azul = '#3a6a9a';
      R(2, -4, w - 4, h + 4, wall); for (let yy = -2; yy < h; yy += 5) R(2, yy, w - 4, 1, line);
      poly([[-5, 0], [10, -28], [w - 10, -28], [w + 5, 0]], shade(azul, -0.45));
      clipPts([[-3, -2], [11, -26], [w - 11, -26], [w + 3, -2]], () => shingleRoof(-5, -28, w + 10, 30, snow ? '#e8eef4' : azul));
      R(-5, -2, w + 10, 3, '#24486e'); if (snow) R(-5, -3, w + 10, 1, '#ffffff');
      R(w - 22, -34, 8, 12, '#d8dce4'); R(w - 23, -36, 10, 3, '#9aa4b0');
      R(0, 24, w, 3, azul); R(0, 27, w, 1, '#24486e');
      // andar de cima: janelas e sacada
      for (const x of [8, w - 22]) { venez(x - 6, 5, 14, azul); winPx(x, 5, 14, 14, night, '#ffffff'); venez(x + 15, 5, 14, azul); }
      winPx(w / 2 - 6, 4, 12, 17, night, '#ffffff');
      R(w / 2 - 14, 19, 28, 3, '#ffffff'); for (let x = w / 2 - 13; x < w / 2 + 14; x += 3) R(x, 12, 1, 7, '#ffffff'); R(w / 2 - 14, 11, 28, 2, '#ffffff');
      vaso(w / 2 - 12, 13, '#c86a3a', '#e84a6a');
      // térreo
      winPx(8, 34, 26, 16, night, '#ffffff'); R(6, 52, 30, 2, '#c8ccd4');
      doorPx(49, h - 22, azul); R(52, h - 26, 8, 3, '#f4c83a'); R(55, h - 26, 2, 3, '#e8402a');
      R(44, h - 2, 24, 2, '#c8ccd4');
      vaso(68, h - 9, '#c86a3a'); vaso(36, h - 9, '#c86a3a');
    },
    helena(w, h, night, snow) {
      const tij = '#b8573a', arg = '#8a3a24';
      R(2, 10, w - 4, h - 10, tij);
      for (let yy = 10; yy < h; yy += 4) { R(2, yy, w - 4, 1, arg); for (let x = 2 + ((yy / 4) % 2 ? 0 : 4); x < w - 2; x += 8) R(x, yy, 1, 4, arg); }
      for (let i = 0; i < 14; i++) R(4 + (i * 29) % (w - 12), 12 + (i * 17) % (h - 16) & ~3, 6, 2, '#c8694a');
      R(w - 18, -26, 10, 20, tij); R(w - 19, -28, 12, 3, '#6a2a18');
      const roxo = '#7a4a8a';
      poly([[-4, 14], [3, -8], [w - 3, -8], [w + 4, 14]], shade(roxo, -0.45));
      clipPts([[-2, 12], [4, -6], [w - 4, -6], [w + 2, 12]], () => shingleRoof(-4, -8, w + 8, 22, snow ? '#e8eef4' : roxo));
      poly([[3, -6], [12, -18], [w - 12, -18], [w - 3, -6]], snow ? '#ffffff' : '#4a2a5a');
      R(-4, 12, w + 8, 3, '#3a1a4a');
      for (const dx of [12, w - 30]) { R(dx, -6, 18, 14, '#f4f0e8'); poly([[dx - 3, -5], [dx + 9, -15], [dx + 21, -5]], snow ? '#ffffff' : '#4a2a5a'); winPx(dx + 4, -2, 10, 8, night, '#f4f0e8'); }
      // hera subindo
      for (let yy = h - 2; yy > 14; yy -= 3) for (const dx of [0, 4]) disc(4 + dx + Math.sin(yy * 0.5 + dx) * 2, yy, 2.4, yy % 2 ? '#3a7a3a' : '#4a9a3a');
      winArc(14, 24, 18, 22, night, '#f4f0e8'); R(12, 48, 22, 2, '#d8d0c0');
      doorPx(49, h - 22, '#2a4a3a');
      disc(56, h - 23, 8, '#f4f0e8'); disc(56, h - 23, 6, night ? '#ffd870' : '#9ad4f8'); R(47, h - 23, 18, 2, '#f4f0e8'); R(55, h - 29, 2, 6, '#f4f0e8');
      // pilha de livros na janela
      for (let k = 0; k < 3; k++) R(16 + k * 4, 40, 3, 6, ['#c83a3a', '#3a7ad0', '#f4c83a'][k]);
    },
    juca(w, h, night, snow) {
      const az = '#8ac4e0';
      R(2, 16, w - 4, h - 16, az); for (let yy = 18; yy < h; yy += 4) { R(2, yy, w - 4, 1, '#6aa4c4'); R(2, yy + 1, w - 4, 1, '#a8d8f0'); }
      R(2, 16, 3, h - 16, '#ffffff'); R(w - 5, 16, 3, h - 16, '#ffffff');
      R(w - 20, -10, 9, 16, '#c8c0b8'); R(w - 21, -12, 11, 3, '#8a8278');
      larGable(w, 18, -20, 6, '#d8a03a', snow);
      poly([[w / 2 - 7, 10], [w / 2, 2], [w / 2 + 7, 10]], '#ffffff'); poly([[w / 2 - 5, 9], [w / 2, 4], [w / 2 + 5, 9]], night ? '#ffd870' : '#6ab4e8');
      // cata-vento com envelope
      R(w / 2, -32, 1, 12, '#3a3a3a'); R(w / 2 - 7, -30, 15, 1, '#3a3a3a'); R(w / 2 - 4, -28, 9, 6, '#ffffff'); R(w / 2 - 4, -28, 1, 6, '#c8c8c8'); poly([[w / 2 - 4, -28], [w / 2, -25], [w / 2 + 5, -28]], '#c8c8c8');
      venez(5, 30, 18, '#ffffff'); winPx(12, 30, 18, 18, night, '#ffffff'); venez(32, 30, 18, '#ffffff');
      floreira(10, 49, 22, ['#e8402a', '#ffffff', '#f4d040']);
      // varanda com telhadinho
      R(38, h - 32, 38, 5, '#c8902a'); R(38, h - 32, 38, 1, '#e8b850'); R(38, h - 28, 38, 1, '#8a6018'); if (snow) R(38, h - 33, 38, 2, '#ffffff');
      R(40, h - 27, 3, 27, '#ffffff'); R(71, h - 27, 3, 27, '#ffffff');
      R(36, h - 4, 42, 4, '#c8a070'); for (let x = 38; x < 78; x += 6) R(x, h - 4, 1, 4, '#a07a4a');
      doorPx(49, h - 22, '#3a5ab8');
      // caixa de correio amarela e azul
      R(4, h - 12, 2, 12, '#6a4a2a'); R(-2, h - 22, 14, 10, '#f4c83a'); R(-2, h - 22, 14, 2, '#3a5ab8'); R(-2, h - 13, 14, 1, '#b88a1a'); R(1, h - 25, 7, 4, '#ffffff'); R(2, h - 24, 5, 1, '#c83a3a');
    },
    rosa(w, h, night, snow) {
      for (let yy = 14; yy < h - 4; yy += 6) {
        R(0, yy, w, 6, '#a8683a'); R(0, yy, w, 1, '#c8884a'); R(0, yy + 5, w, 1, '#6a3a1a'); for (let x = 6 + (yy % 12); x < w - 4; x += 14) R(x, yy + 2, 4, 1, '#8a5428');
        for (const x of [0, w]) { disc(x, yy + 3, 3.2, '#d8a870'); disc(x, yy + 3, 1.6, '#b07a48'); }
      }
      R(-2, h - 4, w + 4, 4, '#8a8278'); for (let x = 0; x < w; x += 7) R(x, h - 3, 5, 2, '#a8a096');
      // chaminé de pedra
      R(8, -18, 14, 30, '#8a8278'); for (let yy = -16; yy < 10; yy += 4) for (let x = 8 + ((yy / 4) & 1 ? 0 : 3); x < 21; x += 6) R(x, yy, 5, 3, '#a8a096'); R(6, -20, 18, 3, '#5a524a');
      larGable(w, 16, -24, 9, '#4a7a3a', snow);
      R(w / 2 - 2, -6, 4, 10, '#6a3a1a'); disc(w / 2, -8, 3, '#d8a870');
      venez(5, 26, 16, '#6a3a1a'); winPx(12, 26, 16, 16, night, '#d8a870'); venez(30, 26, 16, '#6a3a1a');
      doorPx(49, h - 22, '#7a4a2a'); R(51, h - 18, 10, 1, '#5a3418'); R(51, h - 12, 10, 1, '#5a3418');
      // lenha empilhada e cavalete
      for (let r = 0; r < 3; r++) for (let k = 0; k < 6 - r; k++) { const cx = 4 + r * 3 + k * 6, cy = h - 6 - r * 5; disc(cx, cy, 3, '#c8944a'); disc(cx, cy, 1.5, '#a06a32'); }
      R(68, h - 14, 12, 2, '#c8884a'); R(69, h - 12, 2, 12, '#8a5428'); R(77, h - 12, 2, 12, '#8a5428'); R(66, h - 18, 4, 4, '#9a9aa2');
    },
    bia(w, h, night, snow) {
      const rosa = '#f8b8cc';
      R(2, 12, w - 4, h - 12, rosa); R(2, h - 6, w - 4, 6, '#e890b0');
      // mural: flor grande e arco-íris
      for (let k = 0; k < 4; k++) { ctx.strokeStyle = ['#e8402a', '#f4c83a', '#5ab84a', '#3a8ad8'][k]; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(20, 55, 14 - k * 2.5, Math.PI, 0); ctx.stroke(); }
      for (let a = 0; a < 6; a++) disc(64 + Math.cos(a) * 5, 24 + Math.sin(a) * 5, 3, '#ffffff'); disc(64, 24, 3, '#f4c83a');
      for (let i = 0; i < 16; i++) disc(6 + (i * 31) % (w - 12), 16 + (i * 19) % (h - 24), 1, ['#3ab8b0', '#f4c83a', '#b05ae0', '#e8402a'][i % 4]);
      // telhado arredondado de escamas
      const tq = snow ? '#e8eef4' : '#3ab8b0', tqd = snow ? '#c8d4e0' : '#2a8a84';
      ctx.fillStyle = shade(tq, -0.45); ctx.beginPath(); ctx.ellipse(w / 2, 16, w / 2 + 7, 34, 0, Math.PI, 0); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.ellipse(w / 2, 15, w / 2 + 5, 32, 0, Math.PI, 0); ctx.clip();
      R(-8, -20, w + 16, 40, tq);
      for (let yy = -18, r = 0; yy < 18; yy += 5, r++) for (let x = -8 + (r % 2 ? 3 : 0); x < w + 8; x += 6) { disc(x, yy + 3, 3.2, tqd); disc(x, yy + 2, 2.6, tq); R(x - 1, yy, 2, 1, shade(tq, 0.3)); }
      ctx.restore();
      R(-6, 14, w + 12, 3, shade(tq, -0.5));
      // estrela no alto
      R(w / 2, -26, 1, 8, '#8a8a92'); poly([[w / 2, -34], [w / 2 + 2, -29], [w / 2 + 6, -29], [w / 2 + 3, -26], [w / 2 + 4, -21], [w / 2, -24], [w / 2 - 4, -21], [w / 2 - 3, -26], [w / 2 - 6, -29], [w / 2 - 2, -29]], '#f4c83a');
      winRound(w / 2, 2, 5, night, '#ffffff');
      winRound(14, 28, 7, night, '#ffffff'); winRound(32, 28, 7, night, '#ffffff');
      doorPx(49, h - 22, '#f4c83a'); disc(54, h - 15, 2, '#e84a6a'); disc(58, h - 15, 2, '#e84a6a'); poly([[52, h - 15], [56, h - 10], [60, h - 15]], '#e84a6a');
      vaso(66, h - 9, '#3ab8b0', '#ff8ac8'); vaso(36, h - 9, '#b05ae0', '#f4d040'); vaso(-2, h - 9, '#f4c83a', '#e8402a');
    },
    tonico(w, h, night, snow) {
      const reb = '#f4ecdc', vig = '#5a3418';
      R(2, 14, w - 4, h - 14, reb);
      ctx.strokeStyle = vig; ctx.lineWidth = 3;
      const lin = (a, b, c, d) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); };
      lin(4, 16, 24, 36); lin(24, 16, 4, 36); lin(26, 38, 44, h - 4); lin(70, 16, w - 4, 36);
      for (const x of [2, 24, 44, 68, w - 5]) R(x, 14, 3, h - 14, vig);
      R(2, 14, w - 4, 3, vig); R(2, 36, w - 4, 3, vig); R(2, h - 4, w - 4, 4, vig);
      R(w - 24, -20, 9, 14, '#a84a30'); for (let yy = -18; yy < -6; yy += 3) R(w - 24, yy, 9, 1, '#7a3020'); R(w - 25, -22, 11, 3, '#5a2a18');
      larGable(w, 16, -28, 8, '#8a4a2a', snow);
      // lambrequim de madeira recortada
      for (let x = -6; x < w + 6; x += 6) poly([[x, 19], [x + 3, 24], [x + 6, 19]], '#d8a870');
      R(w / 2 - 1, -34, 2, 8, '#5a3418'); poly([[w / 2 - 5, -34], [w / 2, -40], [w / 2 + 5, -34]], '#d8a870');
      winPx(w / 2 - 7, -8, 14, 12, night, '#d8a870'); for (let x = w / 2 - 10; x < w / 2 + 10; x += 4) R(x, 6, 2, 3, '#d8a870');
      winPx(30, 20, 10, 12, night, '#d8a870'); winPx(52, 20, 10, 12, night, '#d8a870');
      winPx(8, 42, 12, 14, night, '#d8a870'); floreira(6, 58, 16, ['#e8402a', '#f4d040']);
      doorPx(49, h - 22, '#8a4a2a');
      // barril e banquinho entalhado
      R(70, h - 12, 9, 12, '#a86a3a'); R(70, h - 10, 9, 1, '#5a5a62'); R(70, h - 4, 9, 1, '#5a5a62'); R(70, h - 12, 9, 1, '#c8884a');
      R(28, h - 8, 12, 2, '#c8884a'); R(29, h - 6, 2, 6, '#8a5428'); R(37, h - 6, 2, 6, '#8a5428');
    },
    cida(w, h, night, snow) {
      const wall = '#f4a83a', bran = '#fbf6ea';
      clipPts([[0, 6], [w / 2, -16], [w, 6]], () => telhaRoof(0, -16, w, 22, snow ? '#e8eef4' : '#c8603a'));
      R(0, 2, w, h - 2, wall); R(0, h - 10, w, 10, '#c8762a'); R(0, h - 10, w, 1, '#a85a1a');
      // platibanda com frontão e pináculos
      R(-3, 0, w + 6, 5, bran); R(-3, 5, w + 6, 2, '#d8ccb0');
      disc(w / 2, 0, 11, bran); disc(w / 2, 0, 8, wall); R(w / 2 - 11, 0, 22, 5, bran);
      disc(w / 2, -1, 4, bran); for (let a = 0; a < 5; a++) disc(w / 2 + Math.cos(a * 1.26) * 3, -1 + Math.sin(a * 1.26) * 3, 1.3, '#e84a6a');
      for (const x of [-2, w - 4]) { R(x, -8, 6, 8, bran); disc(x + 3, -10, 3, bran); R(x, -2, 6, 1, '#d8ccb0'); }
      if (snow) R(-3, -1, w + 6, 2, '#ffffff');
      R(0, 0, 5, h, bran); R(w - 5, 0, 5, h, bran); R(0, 22, w, 3, bran);
      // janelões em arco com venezianas verdes abertas
      for (const x of [12, 30]) { venez(x - 6, 30, 22, '#2a8a6a'); winArc(x, 30, 12, 22, night, bran); venez(x + 13, 30, 22, '#2a8a6a'); }
      disc(56, h - 22, 9, bran); doorPx(49, h - 22, '#2a8a6a'); disc(56, h - 23, 6, '#2a8a6a'); disc(56, h - 23, 4, night ? '#ffd870' : '#9ad4f8'); R(48, h - 23, 16, 2, bran);
      for (let x = 8; x < w - 8; x += 12) R(x, 10, 6, 6, shade(wall, -0.15));
      // caixotes de fruta da feira
      for (const [x, c] of [[66, '#f4a020'], [-2, '#e8402a']]) { R(x, h - 10, 13, 10, '#c8944a'); R(x, h - 10, 13, 2, '#e0b06a'); R(x + 6, h - 8, 1, 8, '#8a5a28'); for (let k = 0; k < 3; k++) disc(x + 2 + k * 4, h - 11, 2.2, c); }
    },
  };
  // onde sai a fumaça de cada chaminé (em pixels, a partir do canto da casa)
  const LAR_FUMACA = { nena: [16, -14], davi: [62, -36], helena: [67, -28], juca: [64, -12], rosa: [15, -20], tonico: [60, -22] };
  function larCanvas(id, w, h, night) {
    const s = season();
    return bake(`lar|${id}|${w}|${h}|${night ? 1 : 0}|${s}`, w + 24, h + 44, () => { ctx.translate(12, 40); LAR_DESENHO[id](w, h, night, s === 'winter'); });
  }
  function drawLarSprite(s, x, y, w, h, night) {
    if (!LAR_DESENHO[s.lar]) return false;
    shadowAt(x + w / 2, y + h, w / 2 + 4, 4);
    blit(larCanvas(s.lar, w, h, night), x - 12, y - 40);
    return true;
  }
