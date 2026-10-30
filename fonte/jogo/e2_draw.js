
  // ================= novos prédios, móveis e decoração =================
  const B2 = new Set(['carpentry', 'ranch', 'bar', 'fishshop', 'palm', 'driftwood', 'minechest', 'lumber', 'haybale', 'barshelf', 'bartable', 'barrels', 'fishtank', 'nets', 'fridge', 'stove', 'sink', 'hopper', 'trough', 'coop', 'barn', 'stable', 'silo', 'well', 'scaffold', 'greenhouse', 'marketstall', 'basin', 'ccbuilding', 'museumb', 'minecart', 'ccaltar', 'ccplaque', 'mcase']);
  function planks(x, y, w, h, c, step = 5) {
    const d = shade(c, -0.3), l = shade(c, 0.18);
    R(x, y, w, h, c);
    for (let yy = y + 2; yy < y + h; yy += step) { R(x, yy, w, 1, d); R(x, yy + 1, w, 1, l); }
  }
  function gable(x, y, w, h, base, roof, snow) {
    poly([[x - 6, y + h], [x + w / 2, y], [x + w + 6, y + h]], shade(roof, -0.45));
    ctx.save(); ctx.beginPath(); ctx.moveTo(x - 4, y + h - 2); ctx.lineTo(x + w / 2, y + 2); ctx.lineTo(x + w + 4, y + h - 2); ctx.closePath(); ctx.clip();
    shingleRoof(x - 6, y, w + 12, h, snow ? '#e8eef4' : roof); ctx.restore();
    R(x - 6, y + h - 2, w + 12, 3, shade(roof, -0.55));
  }
  function bigDoor(x, y, w, h, c) {
    R(x - 2, y - 2, w + 4, h + 2, '#f4ecd8'); R(x, y, w, h, c);
    ctx.strokeStyle = '#f4ecd8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 1, y + 1); ctx.lineTo(x + w - 1, y + h - 1); ctx.moveTo(x + w - 1, y + 1); ctx.lineTo(x + 1, y + h - 1); ctx.stroke();
    R(x + w / 2 - 1, y, 2, h, '#f4ecd8');
  }
  function building2Canvas(type, w, h, night, extra = '') {
    const s = season(), snow = s === 'winter';
    return bake(`b2|${type}|${w}|${h}|${night ? 1 : 0}|${s}|${extra}`, w + 16, h + 40, () => {
      ctx.translate(8, 36);
      switch (type) {
        case 'carpentry': {
          planks(2, 18, w - 4, h - 18, '#c8884a');
          gable(2, -22, w - 4, 42, '#c8884a', '#4a7a3a', snow);
          R(w / 2 - 12, -6, 24, 14, '#6a3a1a'); R(w / 2 - 10, -4, 20, 10, '#e8c890'); poly([[w / 2 - 6, 4], [w / 2 + 6, -2], [w / 2 + 7, 0], [w / 2 - 5, 6]], '#8a8a92'); R(w / 2 - 8, 2, 5, 3, '#8a4a20');
          winPx(w - 34, 34, 18, 14, night);
          doorPx(2 * T + 1, h - 22, '#7a4a24');
          for (let k = 0; k < 3; k++) R(w - 30 + k * 6, h - 10, 5, 10, '#a86a3a');
          R(w - 31, h - 11, 19, 2, '#d8a060');
          break;
        }
        case 'ranch': {
          planks(2, 16, w - 4, h - 16, '#b8382a', 6);
          for (const xx of [2, w - 4]) R(xx, 16, 2, h - 16, '#f4ecd8');
          poly([[-4, 20], [6, -8], [w / 2, -20], [w - 6, -8], [w + 4, 20]], '#3a2a2a');
          ctx.save(); ctx.beginPath(); ctx.moveTo(-2, 18); ctx.lineTo(7, -6); ctx.lineTo(w / 2, -18); ctx.lineTo(w - 7, -6); ctx.lineTo(w + 2, 18); ctx.closePath(); ctx.clip(); shingleRoof(-4, -20, w + 8, 40, snow ? '#e8eef4' : '#5a4a4a'); ctx.restore();
          R(w / 2 - 8, -4, 16, 12, '#f4ecd8'); R(w / 2 - 6, -2, 12, 8, '#3a2a1a');
          winPx(w - 30, 32, 16, 12, night, '#f4ecd8');
          bigDoor(2 * T - 2, h - 26, 20, 26, '#8a2a1e');
          R(w - 34, h - 8, 26, 8, '#e8c860'); R(w - 34, h - 8, 26, 2, '#f8e090');
          break;
        }
        case 'bar': {
          R(2, 18, w - 4, h - 18, '#d8c8a8');
          for (let yy = 20; yy < h - 14; yy += 6) R(2, yy, w - 4, 1, '#bca888');
          R(2, h - 14, w - 4, 14, '#7a6a5a'); for (let xx = 2; xx < w - 4; xx += 9) R(xx, h - 14, 1, 14, '#5a4a3e'); R(2, h - 14, w - 4, 1, '#9a8a7a');
          shingleRoof(-6, -12, w + 12, 32, snow ? '#e8eef4' : '#8a3a3a'); R(-6, 18, w + 12, 3, '#4a1a1a');
          R(w / 2 - 22, -6, 44, 18, '#5a3418'); R(w / 2 - 20, -4, 40, 14, '#e8b860');
          R(w / 2 - 6, -2, 9, 10, '#f4f0e0'); R(w / 2 - 6, -2, 9, 3, '#ffffff'); R(w / 2 + 3, 0, 3, 6, '#f4f0e0'); R(w / 2 - 5, 1, 7, 6, '#e8a020');
          winPx(12, 30, 22, 16, true); winPx(w - 34, 30, 22, 16, true);
          doorPx(3 * T + 1, h - 22, '#6a3a24');
          for (let k = 0; k < 6; k++) disc(10 + k * ((w - 20) / 5), 22, 1.8, ['#ff6a4a', '#ffe04a', '#6ae0ff', '#ff8ad8'][k % 4]);
          R(8, 22, w - 16, 1, '#3a2a1a');
          break;
        }
        case 'fishshop': {
          planks(2, 16, w - 4, h - 16, '#7a98a8', 6);
          poly([[-4, 18], [w / 2, -16], [w + 4, 18]], '#2a3a4a');
          ctx.save(); ctx.beginPath(); ctx.moveTo(-2, 16); ctx.lineTo(w / 2, -14); ctx.lineTo(w + 2, 16); ctx.closePath(); ctx.clip(); shingleRoof(-4, -16, w + 8, 34, snow ? '#e8eef4' : '#3a5a7a'); ctx.restore();
          R(-4, 16, w + 8, 3, '#1a2a3a');
          R(w / 2 - 16, 0, 32, 12, '#5a3418'); R(w / 2 - 14, 2, 28, 8, '#f4e8c8'); oval(w / 2 - 1, 6, 8, 3, '#e8803a'); poly([[w / 2 + 6, 6], [w / 2 + 11, 2], [w / 2 + 11, 10]], '#e8803a'); R(w / 2 - 6, 5, 1, 1, '#000');
          winPx(10, 30, 18, 14, night, '#f4ecd8');
          doorPx(3 * T + 1, h - 22, '#4a5a6a');
          ctx.strokeStyle = '#d8c8a0'; ctx.lineWidth = 1; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(w - 30 + k * 5, 28); ctx.lineTo(w - 32 + k * 5, 52); ctx.stroke(); } for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(w - 32, 32 + k * 5); ctx.lineTo(w - 8, 32 + k * 5); ctx.stroke(); }
          oval(w - 12, h - 6, 4, 4, '#e8402a'); R(w - 16, h - 7, 8, 2, '#ffffff');
          break;
        }
        case 'palm': {
          for (let k = 0; k < 9; k++) { R(6 + Math.round(Math.sin(k * 0.4) * 2), 14 - k * 5, 5, 5, k % 2 ? '#8a5a2a' : '#a8703a'); R(6 + Math.round(Math.sin(k * 0.4) * 2), 14 - k * 5, 5, 1, '#6a3e1a'); }
          const cx = 9 + Math.round(Math.sin(3.6) * 2), cy = -30, c = s === 'winter' ? '#a8b8b0' : s === 'fall' ? '#9a9a3a' : '#3a9a3a';
          for (const [dx, dy] of [[-16, 6], [16, 6], [-12, -6], [12, -6], [0, -10], [-6, 10], [8, 10]]) { poly([[cx, cy], [cx + dx, cy + dy - 2], [cx + dx * 1.1, cy + dy + 3], [cx + dx * 0.4, cy + dy * 0.4 + 3]], c); R(cx + dx * 0.5, cy + dy * 0.5, 2, 1, shade(c, 0.3)); }
          disc(cx - 2, cy + 4, 2.5, '#6a4a1a'); disc(cx + 3, cy + 5, 2.5, '#6a4a1a');
          break;
        }
        case 'driftwood': poly([[0, 10], [4, 6], [28, 5], [32, 9], [28, 13], [4, 13]], '#a8987a'); R(6, 7, 20, 1, '#c8b89a'); R(8, 11, 18, 1, '#7a6a5a'); oval(29, 9, 3, 4, '#c8b89a'); break;
        case 'minechest': {
          R(1, 4, 14, 12, '#7a4a24'); R(1, 4, 14, 1, '#a86a3a'); R(0, extra ? -2 : 1, 16, extra ? 4 : 6, '#9a5a2a'); R(0, extra ? -2 : 1, 16, 1, '#c8884a');
          for (const xx of [2, 13]) R(xx, 1, 1, 15, '#d8b040');
          if (extra) { R(2, 4, 12, 3, '#2a1a10'); } else { R(6, 5, 4, 4, '#ffd23a'); R(7, 6, 2, 2, '#8a6a10'); }
          break;
        }
        case 'lumber': for (let k = 0; k < 4; k++) { R(0, 10 + k * 5 - 8, w, 5, k % 2 ? '#c8884a' : '#b07438'); R(0, 10 + k * 5 - 8, w, 1, '#e0a868'); oval(w - 2, 12 + k * 5 - 8, 2, 2.5, '#e8c890'); } break;
        case 'haybale': for (let k = 0; k < w / 16; k++) { R(k * 16 + 1, 2, 14, 13, '#d8b048'); R(k * 16 + 1, 2, 14, 2, '#f0d070'); for (let yy = 5; yy < 15; yy += 3) R(k * 16 + 2, yy, 12, 1, '#b89030'); R(k * 16 + 4, 2, 1, 13, '#8a6a20'); R(k * 16 + 11, 2, 1, 13, '#8a6a20'); } break;
        case 'barshelf': R(0, -10, w, 24, '#5a3418'); for (const yy of [-4, 6]) { R(1, yy + 6, w - 2, 2, '#a86a3a'); for (let k = 0; k < w / 6 - 1; k++) { const c = ['#3a8a4a', '#8a2a3a', '#e8c040', '#5a3a8a', '#a8d0e8'][(k + yy) % 5 | 0]; R(4 + k * 6, yy, 3, 6, c); R(5 + k * 6, yy - 2, 1, 2, c); R(4 + k * 6, yy + 1, 1, 3, '#ffffff66'); } } break;
        case 'bartable': { const cy = h / 2; oval(w / 2, cy + 2, w / 2 - 3, Math.min(9, h / 2 - 1), '#6a3a1a'); oval(w / 2, cy, w / 2 - 3, Math.min(8, h / 2 - 2), '#a86a3a'); R(w / 2 - 8, cy - 5, 5, 6, '#e8a020'); R(w / 2 - 8, cy - 6, 5, 2, '#ffffff'); R(w / 2 + 4, cy - 3, 6, 3, '#f4f0e0'); break; }
        case 'barrels': for (const [dx, dy] of [[0, 6], [16, 6], [8, -6]]) { R(dx + 1, dy, 14, 18, '#8a5428'); R(dx + 3, dy, 3, 18, '#a86a3a'); for (const yy of [3, 9, 15]) R(dx + 1, dy + yy, 14, 1, '#3e3e46'); oval(dx + 8, dy, 7, 2, '#6a3c1a'); } break;
        case 'fishtank': R(0, -6, w, 20, '#3a3a42'); R(2, -4, w - 4, 16, '#4a90c8'); R(2, -4, w - 4, 3, '#8ac8f0'); oval(10, 4, 4, 2, '#f08a2a'); oval(22, 7, 3, 2, '#e8e04a'); R(4, 9, w - 8, 3, '#d8c890'); R(12, 2, 1, 8, '#3a8a3a'); break;
        case 'nets': ctx.strokeStyle = '#c8b890'; ctx.lineWidth = 1; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(2 + k * 4, -4); ctx.lineTo(1 + k * 4, 28); ctx.stroke(); } for (let k = 0; k < 7; k++) { ctx.beginPath(); ctx.moveTo(0, k * 5 - 2); ctx.lineTo(15, k * 5 - 2); ctx.stroke(); } disc(8, 22, 3, '#e8402a'); break;
        case 'fridge': R(1, -14, 14, 30, '#e8ecf0'); R(1, -14, 14, 2, '#ffffff'); R(13, -14, 2, 30, '#b8c0c8'); R(1, -2, 14, 1, '#a0a8b0'); R(11, -10, 2, 6, '#8a929a'); R(11, 2, 2, 8, '#8a929a'); break;
        case 'stove': R(0, -4, w, 20, '#3a3a42'); R(0, -4, w, 3, '#5a5a64'); for (const xx of [6, 20]) { oval(xx, -1, 4, 1.6, '#1a1a1e'); oval(xx, -1, 2.5, 1, '#e8502a'); } R(3, 4, w - 6, 10, '#2a2a30'); R(5, 6, w - 10, 6, '#4a3a2a'); R(6, 6, w - 12, 1, '#e88a3a'); R(w / 2 - 4, 3, 8, 1, '#a8a8b0'); break;
        case 'sink': R(0, -2, w, 18, '#c8884a'); R(0, -2, w, 3, '#e8d8c0'); R(4, -1, 12, 3, '#a8b8c8'); R(6, -6, 2, 5, '#a8a8b0'); R(6, -6, 5, 2, '#a8a8b0'); R(0, 4, w, 1, '#8a5428'); R(w / 2, 4, 1, 12, '#8a5428'); R(w / 4 - 1, 9, 3, 1, '#e8c060'); R(w * 3 / 4 - 1, 9, 3, 1, '#e8c060'); disc(w - 8, -4, 3, '#e86a3a'); R(w - 9, -8, 2, 3, '#5a9a3a'); break;
        case 'hopper': R(1, -10, 14, 26, '#8a5428'); R(1, -10, 14, 2, '#c8884a'); poly([[1, -10], [15, -10], [12, -4], [4, -4]], '#d8b048'); R(3, 2, 10, 6, '#5a3418'); R(5, 4, 6, 3, '#d8b048'); R(1, 10, 14, 1, '#5a3418'); break;
        case 'trough': R(0, 4, 16, 10, '#6a3c1a'); R(1, 5, 14, 6, extra ? '#d8b048' : '#3a2412'); if (extra) { for (let k = 0; k < 6; k++) R(2 + k * 2, 3 + (k % 2), 2, 3, '#f0d070'); } R(0, 13, 16, 2, '#4a2a12'); R(0, 4, 16, 1, '#a86a3a'); break;
        case 'greenhouse': {
          const glass = (x, y, w, h) => { R(x, y, w, h, '#8ac8d8'); R(x, y, w, Math.ceil(h / 3), '#b8e4f0'); R(x + 2, y + 2, 2, h - 4, '#e8f8ff'); };
          R(0, 6, w, h - 6, '#e8ecf0');
          for (let xx = 2; xx < w - 2; xx += 14) for (let yy = 8; yy < h - 4; yy += 14) { glass(xx, yy, 12, 12); if (yy > 20) { disc(xx + 6, yy + 11, 5, s === 'winter' ? '#4a9a3a' : '#3a8a2a'); disc(xx + 4, yy + 9, 3, '#6ac04a'); if ((xx + yy) % 3 === 0) R(xx + 6, yy + 7, 2, 2, '#e8402a'); } }
          poly([[-4, 8], [w / 2, -30], [w + 4, 8]], '#c8d0d8');
          ctx.save(); ctx.beginPath(); ctx.moveTo(-1, 6); ctx.lineTo(w / 2, -27); ctx.lineTo(w + 1, 6); ctx.closePath(); ctx.clip();
          for (let xx = -4; xx < w + 4; xx += 12) { R(xx, -30, 11, 40, snow ? '#e8f4fa' : '#9ad4e4'); R(xx + 2, -30, 2, 40, '#e0f6ff'); }
          ctx.restore();
          R(-4, 6, w + 8, 3, '#a8b0b8');
          R(3 * T, h - 20, 16, 20, '#e8ecf0'); R(3 * T + 2, h - 18, 12, 18, '#8ac8d8'); R(3 * T + 7, h - 18, 2, 18, '#e8ecf0'); R(3 * T + 11, h - 10, 2, 2, '#f4c83a');
          R(0, h - 3, w, 3, '#9a9088');
          break;
        }
        case 'marketstall': {
          R(2, 2, w - 4, h - 2, '#a86a3a'); R(2, 2, w - 4, 3, '#c8884a'); for (let xx = 10; xx < w; xx += 16) R(xx, 5, 1, h - 5, '#7a4a24');
          const goods = ['#e8402a', '#f4c83a', '#5ab83a', '#f08a2a', '#8a3ac8', '#f4f0e0'];
          for (let k = 0; k < 4; k++) { const x = 4 + k * 15; R(x, -6, 13, 8, '#c8944a'); R(x, -6, 13, 1, '#e0b06a'); for (let j = 0; j < 4; j++) disc(x + 3 + j * 2.5, -6 + (j % 2), 2.4, goods[(k * 2 + j) % goods.length]); }
          R(3, -30, 2, 32, '#6a3a1a'); R(w - 5, -30, 2, 32, '#6a3a1a');
          for (let k = 0; k < 8; k++) { R(-2 + k * 9, -34, 9, 10, k % 2 ? '#f4f0e0' : '#d83a2a'); poly([[-2 + k * 9, -24], [7 + k * 9, -24], [2.5 + k * 9, -20]], k % 2 ? '#f4f0e0' : '#d83a2a'); }
          R(-2, -35, w + 4, 2, '#8a2418');
          R(w / 2 - 12, 10, 24, 10, '#5a3418'); R(w / 2 - 10, 12, 20, 6, '#f4e8c0'); disc(w / 2 - 5, 15, 2, '#e8402a'); disc(w / 2, 15, 2, '#5ab83a'); disc(w / 2 + 5, 15, 2, '#f4c83a');
          break;
        }
        case 'basin': R(1, 2, 14, 13, '#8a8278'); R(1, 2, 14, 2, '#b0a89e'); R(3, 4, 10, 6, '#3c88d4'); R(4, 5, 4, 1, '#a8dcf8'); R(6, -4, 2, 7, '#a8a8b0'); R(6, -4, 5, 2, '#a8a8b0'); break;
        case 'ccbuilding': {
          const n = +extra || 0, done = n >= 6, wall = done ? '#d8b888' : '#a89070';
          planks(2, 14, w - 4, h - 14, wall, 6);
          R(2, h - 10, w - 4, 10, done ? '#9a8a7a' : '#7a6e62');
          for (let xx = 2; xx < w - 4; xx += 9) R(xx, h - 10, 1, 10, '#5e544a');
          gable(-2, -30, w + 4, 46, wall, done ? '#3a6a9a' : '#5a4a42', snow);
          if (!done) { R(20, -6, 12, 6, '#2a1e16'); R(w - 40, -14, 10, 8, '#2a1e16'); poly([[w / 2 - 6, -22], [w / 2 + 4, -26], [w / 2 + 2, -18]], '#2a1e16'); }
          R(w / 2 - 14, -10, 28, 14, '#5a3418'); R(w / 2 - 12, -8, 24, 10, done ? '#f4d050' : '#8a7a5a');
          if (done) { poly([[w / 2, -7], [w / 2 + 3, -2], [w / 2 + 8, -2], [w / 2 + 4, 1], [w / 2 + 6, 6], [w / 2, 3], [w / 2 - 6, 6], [w / 2 - 4, 1], [w / 2 - 8, -2], [w / 2 - 3, -2]], '#fff8c0'); }
          for (const xx of [14, w - 34]) { winPx(xx, 26, 20, 16, night && done, '#f4ecd8'); if (!done) { R(xx - 2, 30, 24, 3, '#8a5a2a'); R(xx - 2, 38, 24, 3, '#8a5a2a'); } }
          doorPx(3 * T + 1, h - 22, done ? '#7a3a2a' : '#5a4a3a');
          if (!done) { R(3 * T - 2, h - 16, 20, 3, '#8a5a2a'); R(3 * T - 2, h - 9, 20, 3, '#8a5a2a'); }
          for (let k = 0; k < Math.min(6, n); k++) disc(10 + k * 6, h - 4, 2, '#ffd23a');
          break;
        }
        case 'museumb': {
          R(2, 12, w - 4, h - 12, '#e8e0d0');
          for (const xx of [6, 22, w - 30, w - 14]) { R(xx, 14, 8, h - 18, '#f8f4ec'); R(xx + 6, 14, 2, h - 18, '#c8c0b0'); R(xx - 1, 12, 10, 3, '#d8d0c0'); }
          R(0, h - 4, w, 4, '#b8b0a0');
          poly([[-4, 14], [w / 2, -18], [w + 4, 14]], '#5a4a6a'); poly([[2, 12], [w / 2, -12], [w - 2, 12]], snow ? '#e8eef4' : '#7a6a9a');
          disc(w / 2, 2, 6, '#e8e0d0'); disc(w / 2, 2, 4, '#c8a040'); R(w / 2 - 1, -1, 2, 6, '#5a4a6a');
          doorPx(2 * T + 1, h - 22, '#4a3a5a');
          break;
        }
        case 'minecart': R(0, 12, 16, 2, '#6a6a72'); R(2, 14, 2, 2, '#4a3a2a'); R(12, 14, 2, 2, '#4a3a2a'); R(2, 2, 12, 9, '#8a5a2a'); R(1, 1, 14, 2, '#5a5a62'); R(2, 4, 12, 1, '#6a3a1a'); disc(5, 11, 2, '#3a3a42'); disc(11, 11, 2, '#3a3a42'); for (let k = 0; k < 3; k++) disc(5 + k * 3, 1, 2, '#7a7068'); break;
        case 'ccaltar': R(4, 10, w - 8, h - 10, '#8a8278'); R(4, 10, w - 8, 3, '#b0a89e'); R(8, -6, w - 16, 18, extra ? '#f4d050' : '#a89870'); R(8, -6, w - 16, 3, extra ? '#fff8c0' : '#c8b890'); poly([[w / 2, -20], [w / 2 + 5, -12], [w / 2, -4], [w / 2 - 5, -12]], extra ? '#ffe86a' : '#8a7a5a'); if (extra) R(w / 2 - 1, -15, 2, 2, '#ffffff'); break;
        case 'ccplaque': R(2, -8, 12, 14, '#6a3a1a'); R(3, -7, 10, 12, extra ? '#f4d050' : '#c8b890'); poly([[8, -5], [10, -1], [8, 3], [6, -1]], extra ? '#fff8c0' : '#8a7a5a'); R(4, 6, 8, 2, '#4a2a12'); break;
        case 'mcase': R(0, 2, w, 14, '#7a4a24'); R(0, 2, w, 2, '#a86a3a'); R(1, -8, w - 2, 11, '#bfe4f0'); R(1, -8, w - 2, 1, '#ffffff'); R(1, -8, 1, 11, '#ffffff'); R(0, 2, w, 1, '#5a3418'); for (let k = 1; k < 3; k++) R(Math.round(k * w / 3), -8, 1, 10, '#8ab8c8'); break;
        case 'scaffold': {
          planks(0, h - 20, w, 20, '#c8a070', 4);
          for (let xx = 2; xx < w; xx += 18) R(xx, -10, 3, h + 10, '#8a5a2a');
          for (let yy = -6; yy < h - 20; yy += 14) R(0, yy, w, 3, '#a8703a');
          ctx.strokeStyle = '#8a5a2a'; ctx.lineWidth = 2; for (let xx = 2; xx + 18 < w; xx += 18) { ctx.beginPath(); ctx.moveTo(xx, h - 22); ctx.lineTo(xx + 18, -6); ctx.stroke(); }
          R(w / 2 - 14, h - 16, 28, 10, '#f4e8c0'); R(w / 2 - 14, h - 16, 28, 1, '#ffffff'); R(w / 2 - 10, h - 13, 20, 1, '#8a5a2a'); R(w / 2 - 10, h - 10, 14, 1, '#8a5a2a');
          break;
        }
        case 'coop': {
          const lv = +extra || 1;
          planks(2, 4, w - 4, h - 4, '#c8884a', 6);
          gable(0, -30, w, 36, '#c8884a', lv === 3 ? '#4a6a9a' : '#a83a2a', snow);
          if (lv >= 2) { R(w - 22, -34, 8, 16, '#8a7a6a'); R(w - 23, -36, 10, 3, '#5a4a3a'); }
          if (lv === 3) { R(w / 2 - 1, -40, 2, 10, '#5a5a5a'); poly([[w / 2, -42], [w / 2 + 8, -38], [w / 2, -36]], '#e8c040'); }
          winPx(w - 34, 14, 14, 10, night); winPx(w - 58, 14, 14, 10, night);
          R(T + 2, h - 18, 12, 18, '#3a2412'); R(T + 3, h - 17, 10, 16, '#5a3418');
          for (let k = 0; k < 4; k++) R(T + 1, h - 2 + k, 14, 1, k % 2 ? '#a86a3a' : '#c8884a');
          R(4, h - 4, w - 8, 4, '#8a5428');
          break;
        }
        case 'barn': {
          const lv = +extra || 1;
          planks(2, 0, w - 4, h, '#b8382a', 7);
          for (const xx of [2, w - 4]) R(xx, 0, 2, h, '#f4ecd8');
          R(2, 0, w - 4, 2, '#f4ecd8');
          poly([[-6, 4], [4, -20], [w / 2, -34], [w - 4, -20], [w + 6, 4]], '#2a1a1a');
          ctx.save(); ctx.beginPath(); ctx.moveTo(-4, 2); ctx.lineTo(5, -18); ctx.lineTo(w / 2, -32); ctx.lineTo(w - 5, -18); ctx.lineTo(w + 4, 2); ctx.closePath(); ctx.clip(); shingleRoof(-6, -34, w + 12, 38, snow ? '#e8eef4' : lv === 3 ? '#3a4a6a' : '#4a3a3a'); ctx.restore();
          R(w / 2 - 9, -22, 18, 14, '#f4ecd8'); R(w / 2 - 7, -20, 14, 10, '#3a2412');
          if (lv >= 2) { R(w / 2 - 1, -44, 2, 12, '#5a5a5a'); poly([[w / 2, -46], [w / 2 + 9, -42], [w / 2, -38]], '#e8c040'); }
          bigDoor(3 * T - 8, h - 34, 32, 34, '#8a2418');
          winPx(10, 18, 14, 12, night, '#f4ecd8'); winPx(w - 24, 18, 14, 12, night, '#f4ecd8');
          break;
        }
        case 'stable': {
          R(2, -2, w - 4, h + 2, '#3a2412');
          planks(2, -2, w - 4, 8, '#a86a3a', 4);
          for (const xx of [2, w / 2 - 2, w - 6]) R(xx, -2, 4, h + 2, '#8a5428');
          R(6, h - 12, 16, 10, '#d8b048'); R(6, h - 12, 16, 2, '#f0d070');
          R(w - 22, h - 14, 14, 6, '#6a3c1a');
          poly([[-6, 0], [6, -24], [w - 6, -24], [w + 6, 0]], '#4a2a1a');
          ctx.save(); ctx.beginPath(); ctx.moveTo(-4, -1); ctx.lineTo(7, -22); ctx.lineTo(w - 7, -22); ctx.lineTo(w + 4, -1); ctx.closePath(); ctx.clip(); shingleRoof(-6, -24, w + 12, 26, snow ? '#e8eef4' : '#7a5a3a'); ctx.restore();
          ctx.strokeStyle = '#c8c8d0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(w / 2, -12, 4, 0.3, Math.PI - 0.3, true); ctx.stroke();
          break;
        }
        case 'silo': {
          const cx = w / 2, r = 18;
          R(cx - r, -20, r * 2, h + 20, '#7a3220');
          for (let yy = -16; yy < h; yy += 6) for (let xx = cx - r + ((yy / 6) % 2 ? 0 : 4); xx < cx + r - 2; xx += 8) { R(xx, yy, 7, 5, '#a84a32'); R(xx, yy, 7, 1, '#c86a4a'); }
          R(cx + r - 6, -20, 6, h + 20, '#5a2216'); R(cx - r, -20, 4, h + 20, '#c86a4a');
          ctx.fillStyle = snow ? '#e8eef4' : '#4a4a56'; ctx.beginPath(); ctx.ellipse(cx, -20, r + 2, 16, 0, Math.PI, 0); ctx.fill();
          R(cx - r - 2, -21, r * 2 + 4, 3, '#3a4a5a'); R(cx - 6, -34, 4, 8, '#8a9aaa');
          R(cx - 5, h - 18, 10, 18, '#5a3418'); R(cx - 4, h - 17, 8, 16, '#7a4a24');
          break;
        }
        case 'well': {
          const cx = w / 2;
          oval(cx, h - 14, 20, 10, '#7a7068'); oval(cx, h - 16, 18, 8, '#a8a096'); oval(cx, h - 16, 13, 5, '#2a4a7a'); oval(cx - 3, h - 17, 5, 2, '#5a8ac8');
          for (let k = 0; k < 8; k++) R(cx - 18 + k * 5, h - 12, 4, 6, k % 2 ? '#9a9088' : '#b0a89e');
          R(cx - 18, h - 40, 3, 28, '#6a3c1a'); R(cx + 15, h - 40, 3, 28, '#6a3c1a');
          poly([[cx - 24, h - 36], [cx, h - 52], [cx + 24, h - 36]], snow ? '#e8eef4' : '#8a3a2a'); R(cx - 24, h - 37, 48, 3, '#5a1a12');
          R(cx - 15, h - 32, 30, 2, '#8a5428'); R(cx + 2, h - 31, 1, 8, '#c8c0b0'); R(cx - 1, h - 24, 7, 6, '#8a5428'); R(cx - 1, h - 24, 7, 1, '#c8884a');
          break;
        }
      }
    });
  }

  // ================= animais =================
  const ANIM_COL = {
    galinha: [['#f8f4ec', '#d8d0c4'], ['#c87a3a', '#9a5a28']],
    pato: [['#ffffff', '#d8dce0']], coelho: [['#e8e0d8', '#b8b0a8'], ['#a88a6a', '#7a6248']],
    vaca: [['#f8f4ec', '#2a2a2a'], ['#a86a3a', '#f4ece0']], cabra: [['#e8e0d0', '#b8ae9c']],
    ovelha: [['#f4f0e8', '#d8d0c4']], porco: [['#f0a8a8', '#c87878']],
  };
  function animalCanvas(kind, v, f, sheared) {
    const cols = ANIM_COL[kind], [c, d] = cols[v % cols.length];
    const size = { galinha: [16, 16], pato: [16, 16], coelho: [16, 16], vaca: [32, 24], cabra: [26, 22], ovelha: [28, 22], porco: [28, 18] }[kind];
    return bake(`an|${kind}|${v}|${f}|${sheared ? 1 : 0}`, size[0], size[1], () => {
      const leg = f ? 1 : 0;
      switch (kind) {
        case 'galinha': {
          R(6 + leg, 12, 1, 3, '#e8a020'); R(9 - leg, 12, 1, 3, '#e8a020');
          oval(8, 9, 6, 4, c); oval(11, 7, 3, 3, c); R(5, 7, 3, 2, d); R(3, 6, 2, 3, c); R(2, 5, 2, 2, d);
          R(10, 3, 3, 2, '#e8302a'); R(14, 7, 2, 1, '#f4b020'); R(12, 6, 1, 1, '#1a1a1a'); R(12, 9, 1, 2, '#e8302a');
          break;
        }
        case 'pato': {
          R(6 + leg, 12, 2, 3, '#f08a20'); R(9 - leg, 12, 2, 3, '#f08a20');
          oval(7, 10, 6, 3.5, c); oval(11, 6, 3, 3, c); R(3, 9, 3, 2, d); R(13, 6, 3, 2, '#f08a20'); R(12, 5, 1, 1, '#1a1a1a'); R(5, 9, 5, 1, d);
          break;
        }
        case 'coelho': {
          oval(7, 10, 5.5, 4, c); oval(11, 8, 3.5, 3, c); R(9, 1, 2, 6, c); R(11, 2, 2, 5, d); R(9, 2, 1, 4, '#f0b0b0');
          disc(3, 9, 2, '#ffffff'); R(12, 8, 1, 1, '#1a1a1a'); R(14, 9, 1, 1, '#e88a8a'); R(4 + leg, 13, 3, 2, d); R(9 - leg, 13, 3, 2, d);
          break;
        }
        case 'vaca': {
          for (const [x, l] of [[7, leg], [11, -leg], [21, -leg], [25, leg]]) { R(x, 15, 3, 7 + l, c); R(x, 21 + l, 3, 2, '#3a2a20'); }
          R(5, 6, 22, 11, c); R(5, 6, 22, 1, shade(c, 0.1)); R(5, 16, 22, 1, shade(c, -0.15));
          if (v % 2 === 0) { R(8, 7, 6, 5, d); R(18, 10, 5, 4, d); R(22, 6, 3, 3, d); } else { R(10, 8, 8, 3, d); }
          R(3, 7, 2, 7, c); R(2, 13, 2, 3, d);
          R(25, 3, 7, 9, c); R(26, 9, 6, 4, '#f0b0a8'); R(29, 10, 1, 1, '#3a2a2a'); R(31, 10, 1, 1, '#3a2a2a'); R(27, 5, 1, 2, '#1a1a1a');
          R(24, 2, 2, 2, '#e8e0c8'); R(30, 1, 2, 2, '#e8e0c8'); R(23, 4, 2, 2, d);
          R(13, 16, 5, 3, '#f0b0b0');
          break;
        }
        case 'cabra': {
          for (const [x, l] of [[6, leg], [9, -leg], [17, -leg], [20, leg]]) { R(x, 14, 2, 6 + l, c); R(x, 19 + l, 2, 2, '#4a3a2a'); }
          R(4, 7, 18, 8, c); R(4, 14, 18, 1, d); R(2, 7, 3, 3, c);
          R(19, 2, 6, 8, c); R(21, 9, 2, 4, '#e8e0c8'); R(23, 4, 1, 1, '#1a1a1a'); R(18, 0, 2, 3, '#8a7a6a'); R(20, -1, 2, 2, '#8a7a6a'); R(17, 4, 2, 3, d);
          break;
        }
        case 'ovelha': {
          for (const [x, l] of [[7, leg], [10, -leg], [18, -leg], [21, leg]]) { R(x, 15, 2, 5 + l, '#3a3a3a'); }
          if (sheared) { oval(14, 11, 9, 5, '#f0d8d0'); oval(14, 10, 8, 4, '#f8e4dc'); }
          else { for (const [x, y, r] of [[8, 10, 5], [13, 8, 5], [18, 10, 5], [10, 13, 4], [16, 13, 4], [21, 12, 3], [5, 12, 3]]) disc(x, y, r, c); for (const [x, y] of [[8, 8], [13, 6], [18, 8]]) R(x - 1, y - 1, 3, 1, '#ffffff'); }
          R(21, 5, 6, 7, '#3a3a3a'); R(22, 6, 4, 2, '#5a5a5a'); R(25, 7, 1, 1, '#ffffff'); R(20, 6, 2, 3, '#2a2a2a');
          break;
        }
        case 'porco': {
          for (const [x, l] of [[7, leg], [11, -leg], [17, -leg], [21, leg]]) R(x, 13, 3, 4 + l, d);
          oval(14, 9, 11, 6, c); R(5, 7, 14, 1, shade(c, 0.2));
          oval(25, 9, 3, 3.5, '#f8b8b8'); R(26, 8, 1, 1, '#8a4a4a'); R(26, 10, 1, 1, '#8a4a4a'); R(21, 6, 1, 1, '#1a1a1a'); poly([[18, 4], [21, 1], [22, 5]], d);
          ctx.strokeStyle = d; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(3, 8, 2, 0, 5); ctx.stroke();
          break;
        }
      }
    });
  }
  // dir: 2 esquerda, 3 direita (os animais são desenhados de lado)
  function drawAnimal(a, x, y, dir, walk, baby, sheared) {
    const c = animalCanvas(a.kind, a.v || 0, walk ? Math.floor(performance.now() / 160) % 2 : 0, sheared);
    const sc = baby ? 0.7 : 1, w = Math.round(c.width * sc), h = Math.round(c.height * sc);
    x = Math.round(x); y = Math.round(y);
    shadowAt(x, y, w / 2.4, 2);
    ctx.save(); ctx.translate(x, y - h + 1);
    if (dir === 2) { ctx.scale(-1, 1); ctx.drawImage(c, -w / 2, 0, w, h); } else ctx.drawImage(c, -w / 2, 0, w, h);
    ctx.restore();
  }
  function horseCanvas(f) {
    return bake(`horse|${f}`, 34, 30, () => {
      const c = '#8a5428', d = '#5a3418', l = '#a86a3a', leg = f ? 2 : 0;
      for (const [x, k] of [[7, leg], [11, -leg], [22, -leg], [26, leg]]) { R(x, 18, 3, 9 + (k > 0 ? 0 : 0), d); R(x + (k > 0 ? 1 : 0), 26, 3, 3, '#2a1a10'); }
      R(5, 9, 24, 11, c); R(5, 9, 24, 2, l); R(5, 19, 24, 1, d);
      R(2, 10, 4, 10, '#2a1a10'); R(1, 16, 3, 5, '#2a1a10');
      R(25, 2, 6, 10, c); R(27, 0, 7, 7, c); R(30, 4, 4, 4, d); R(29, 2, 1, 1, '#1a1a1a'); R(26, -1, 2, 3, d);
      R(23, 1, 3, 11, '#2a1a10');
      R(12, 7, 10, 4, '#7a2a1a'); R(12, 7, 10, 1, '#a84a2a'); R(16, 11, 2, 6, '#c8a040');
    });
  }
  function drawHorse(x, y, dir, walk) {
    const c = horseCanvas(walk ? Math.floor(performance.now() / 120) % 2 : 0);
    x = Math.round(x); y = Math.round(y);
    shadowAt(x, y, 13, 3);
    ctx.save(); ctx.translate(x, y - 29);
    if (dir === 2) { ctx.scale(-1, 1); ctx.drawImage(c, -17, 0); } else if (dir === 0 || dir === 1) { ctx.drawImage(c, -17, 0); } else ctx.drawImage(c, -17, 0);
    ctx.restore();
  }

  // ================= objetos novos da chacrinha =================
  function obj2Canvas(k, extra = '') {
    return bake('obj2|' + k + '|' + extra + '|' + season(), 18, 26, () => {
      ctx.translate(1, 8);
      switch (k) {
        case 'maionesera': R(2, 2, 12, 14, '#c8c0b0'); R(2, 2, 12, 2, '#e8e0d0'); R(4, 6, 8, 6, '#3a3a42'); R(5, 7, 6, 4, extra === 'ready' ? '#fff4b0' : extra === 'on' ? '#e8d890' : '#5a5a64'); R(6, -2, 4, 4, '#8a8a92'); R(2, 14, 12, 2, '#8a8278'); break;
        case 'queijeira': R(2, 4, 12, 12, '#a86a3a'); R(2, 4, 12, 2, '#c8884a'); R(7, -4, 2, 8, '#6a6a72'); R(4, -5, 8, 2, '#8a8a92'); R(4, 8, 8, 6, extra ? '#f8d850' : '#6a4a2a'); break;
        case 'tear': R(1, 0, 2, 16, '#8a5428'); R(13, 0, 2, 16, '#8a5428'); R(1, 0, 14, 2, '#a86a3a'); for (let x = 4; x < 13; x += 2) R(x, 2, 1, 10, '#e8e0d0'); R(3, 8, 10, 4, extra ? '#e8e0f0' : '#c8b8a8'); R(1, 14, 14, 2, '#6a3c1a'); break;
        case 'prensaoleo': R(3, 4, 10, 12, '#5a4a3a'); R(3, 4, 10, 2, '#7a6a5a'); R(5, -2, 6, 6, '#8a8a92'); R(7, -5, 2, 4, '#6a6a72'); R(6, 9, 4, 5, extra ? '#e8c840' : '#3a3028'); break;
        case 'colmeia': R(3, 11, 2, 6, '#5a3418'); R(11, 11, 2, 6, '#5a3418'); R(2, 1, 12, 11, '#c8944a'); for (let y = 3; y < 12; y += 3) R(2, y, 12, 1, '#a8743a'); R(2, 1, 1, 11, '#e0b070'); R(13, 1, 1, 11, '#8a5a2a'); poly([[0, 2], [8, -6], [16, 2]], '#7a2e1e'); poly([[2, 1], [8, -4], [14, 1]], '#a84a2a'); R(7, -5, 2, 2, '#c86a3a'); disc(8, 8, 1.6, '#2a1a0e'); R(4, 13, 8, 1, '#5a3418'); if (extra === 'ready') { R(3, 11, 3, 3, '#f0a820'); R(4, 14, 1, 2, '#f0a820'); R(3, 11, 1, 1, '#fff0a0'); } break;
        case 'grass': {
          const s = season(), p = s === 'fall' ? ['#8a5a1a', '#c08a2a', '#e0b040'] : s === 'winter' ? ['#7a8a96', '#a8b8c4', '#d8e4ee'] : s === 'summer' ? ['#2a6a22', '#4a9a32', '#7ac04a'] : ['#2e7226', '#4fa438', '#86cc54'];
          const blades = [[2, 10], [4, 13], [6, 9], [8, 14], [10, 10], [12, 12], [14, 9], [5, 11], [11, 13]];
          for (const [x, hgt] of blades) { const sway = (+extra || 0); poly([[x - 1, 16], [x + 1, 16], [x + sway + 0.5, 16 - hgt]], p[0]); R(x, 16 - hgt + 3, 1, hgt - 4, p[1]); R(x + sway, 16 - hgt + 1, 1, 2, p[2]); }
          break;
        }
        case 'sapling': { R(7, 6, 2, 10, '#7a4a24'); for (const [x, y] of [[4, 6], [11, 5], [7, 2], [5, 9], [11, 9]]) oval(x, y, 3, 2, season() === 'winter' ? '#8a9a8a' : '#4aa83a'); R(6, 1, 1, 1, '#a8e070'); break; }
        case 'defumador': R(2, 0, 12, 16, '#5a4a42'); R(2, 0, 12, 2, '#7a6a62'); R(4, 4, 8, 7, '#2a1e18'); if (extra) { R(5, 7, 6, 4, extra === 'ready' ? '#c8423a' : '#e8702a'); } R(6, -6, 4, 7, '#6a5a52'); R(5, -7, 6, 2, '#4a3a32'); break;
        case 'covo': R(2, 4, 12, 8, '#8a5a2a'); for (let x = 3; x < 14; x += 3) R(x, 4, 1, 8, '#c8a06a'); R(2, 7, 12, 1, '#c8a06a'); R(6, -2, 2, 7, '#5a3a1a'); disc(7, -3, 2.5, '#e8402a'); R(5, -4, 2, 1, '#ffffff'); break;
      }
    });
  }
  // árvore frutífera: muda, pequena, média e adulta (com frutas)
  function ftreeCanvas(id, st, fr) {
    const s = season(), F = FTREES[id];
    return bake(`ft|${id}|${st}|${fr}|${s}`, 52, 76, () => {
      const cx = 26, by = 74;
      if (st === 0) { R(cx - 1, by - 14, 2, 14, '#7a4a24'); for (const [x, y] of [[-4, -14], [3, -15], [0, -18], [-3, -9], [4, -10]]) oval(cx + x, by + y, 3, 2, s === 'winter' ? '#8a9a8a' : '#4aa83a'); return; }
      if (st === 1) { R(cx - 2, by - 26, 4, 26, '#6a4224'); R(cx - 1, by - 26, 1, 26, '#8a5a32'); disc(cx, by - 30, 9, s === 'winter' ? '#8a9a8a' : '#3a8a2a'); disc(cx - 2, by - 32, 6, s === 'winter' ? '#c8d0c8' : '#5aac3a'); return; }
      const leaf = s === 'winter' ? ['#5a6a76', '#8a9aa8', '#c4d0da'] : s === 'fall' && F.season !== 'fall' ? ['#7a4a14', '#b07020', '#d89a3a'] : ['#2a6a24', '#3c8a2e', '#5aaa3e'];
      poly([[cx - 4, by - 30], [cx + 4, by - 30], [cx + 5, by - 3], [cx + 8, by], [cx - 9, by], [cx - 6, by - 3]], '#5a3820'); R(cx - 3, by - 30, 3, 26, '#7a4e2c');
      const r = st === 2 ? 0.75 : 1, cl = [[0, -44, 15], [-12, -38, 11], [12, -38, 11], [-6, -52, 10], [8, -52, 10], [0, -32, 11]];
      for (const [dx, dy, rr] of cl) disc(cx + dx * r, by + dy * (st === 2 ? 0.85 : 1) + 1, rr * r + 1, leaf[0]);
      for (const [dx, dy, rr] of cl) disc(cx + dx * r, by + dy * (st === 2 ? 0.85 : 1), rr * r, leaf[1]);
      for (const [dx, dy, rr] of cl.slice(0, 5)) disc(cx + dx * r - 2, by + dy * (st === 2 ? 0.85 : 1) - 2, Math.max(2, rr * r - 4), leaf[2]);
      if (st === 3 && s === F.season && s === 'spring' && !fr) for (let k = 0; k < 14; k++) { const a = hash(k, 3, 7) * TAU, d = hash(k, 5, 7) * 16; R(cx + Math.cos(a) * d, by - 44 + Math.sin(a) * d * 0.8, 2, 2, '#f8d0e0'); }
      const spots = [[-8, -44], [6, -40], [0, -52], [-12, -34], [10, -50], [-2, -36]];
      for (let k = 0; k < Math.min(3, fr) * 2; k++) { const [dx, dy] = spots[k]; disc(cx + dx, by + dy, 2.6, F.col); R(cx + dx - 1, by + dy - 2, 1, 1, '#ffffff'); R(cx + dx, by + dy - 3, 1, 2, '#3a6a1a'); }
    });
  }
  // capim alto, árvores com extrator, covos e o resto que não estava no drawObj original
  function drawObj2(o, px, py, k) {
    const t = performance.now() / 1000;
    switch (o.k) {
      case 'grass': blit(obj2Canvas('grass', Math.round(Math.sin(t * 1.6 + px * 0.05) * 1)), px - 1, py - 8); return true;
      case 'ftree': {
        const st = o.age < 7 ? 0 : o.age < 14 ? 1 : o.age < 28 ? 2 : 3;
        shadowAt(px + 8, py + 15, st ? 12 : 5, st ? 4 : 2);
        blit(ftreeCanvas(o.id, st, o.fr || 0), px + 8 - 26, py + 15 - 74);
        return true;
      }
      case 'colmeia': case 'defumador': case 'maionesera': case 'queijeira': case 'tear': case 'prensaoleo': {
        const busy = o.in && o.ready > gm(), ready = o.in && o.ready <= gm();
        shadowAt(px + 8, py + 15, 7, 2);
        blit(obj2Canvas(o.k, ready ? 'ready' : busy ? 'on' : ''), px - 1, py - 8);
        if (ready && !(o.k === 'colmeia' && season() === 'winter' && !(k || '').startsWith('g:'))) readyBubble(px, py - 2, o.k === 'colmeia' ? honeyAt(k) : o.out);
        if (o.k === 'colmeia' && season() !== 'winter') for (let k = 0; k < 2; k++) { const a = t * 3 + k * 3; R(px + 8 + Math.cos(a) * 7, py - 2 + Math.sin(a * 1.3) * 4, 1, 1, '#2a2a1a'); }
        return true;
      }
    }
    return false;
  }
  function drawTapper(px, py, o) {
    R(px + 10, py + 2, 5, 6, '#8a8a92'); R(px + 10, py + 2, 5, 1, '#c8c8d0'); R(px + 9, py + 1, 2, 2, '#6a6a72');
    if (o.tap && o.tap.ready <= gm()) readyBubble(px + 6, py - 20, o.tap.out);
  }
  function drawPot(px, py, p) {
    const b = Math.sin(performance.now() / 400 + px) * 1;
    blit(obj2Canvas('covo'), px - 1, py - 4 + b);
    if (p.c) readyBubble(px, py - 4, p.c);
    else if (p.bait) R(px + 11, py + 4 + b, 3, 3, '#8a6a4a');
  }
  // moradores: usam o mesmo desenho das pessoas, com o "look" de cada um
  function drawVillager(id, x, y, dir, walk) {
    const n = NPCS[id], lk = { ...n.look, npc: id };
    if (n.kid) {
      const c = farmerCanvas(lk, dir, walk ? Math.floor(walk * 8) % 4 : 0);
      shadowAt(x, y, 5, 2);
      ctx.drawImage(c, Math.round(x - 7), Math.round(y - 27), 14, 27);
    } else drawFarmer(x, y, lk, dir, walk);
  }

  // lampião de parede da mina
  function drawLantern(x, y) {
    const t = performance.now() / 1000;
    blit(bake('lantern', 14, 18, () => { R(6, 0, 2, 3, '#2a2a30'); R(2, 3, 10, 2, '#3a3a44'); R(3, 5, 8, 9, '#2a2a30'); R(4, 6, 6, 7, '#ffb040'); R(5, 7, 2, 4, '#fff0a0'); R(2, 14, 10, 2, '#3a3a44'); R(4, 16, 6, 1, '#2a2a30'); }), x * T + 1, y * T + 2);
    const f = Math.sin(t * 11) > 0.3 ? '#fff8c0' : '#ffd060'; R(x * T + 7, y * T + 9, 2, 2, f);
  }
