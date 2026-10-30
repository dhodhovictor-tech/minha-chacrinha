// Desenha os ícones do app com a arte do próprio jogo: o casal, o Darth e um coração.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage();
  await page.goto('file://' + path.join(__dirname, '../.tmp/teste.html')); await page.waitForTimeout(1200);
  const out = await page.evaluate(() => {
    const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    // fundo 64x64
    const bg = mk(64, 64), g = bg.getContext('2d'), R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    const sky = ['#6cb8ec', '#7cc2ef', '#8ccbf1', '#9dd4f3', '#afdcf5', '#c2e4f6'];
    for (let y = 0; y < 36; y++) R(0, y, 64, 1, sky[Math.min(5, Math.floor(y / 6))]);
    for (let y = -7; y <= 7; y++) for (let x = -7; x <= 7; x++) { const d = x * x + y * y; if (d <= 49) R(49 + x, 11 + y, 1, 1, d > 36 ? '#ffe98a' : '#ffd23f'); }
    for (const [cx, cy, w] of [[12, 9, 12], [26, 15, 9]]) { R(cx, cy, w, 3, '#ffffff'); R(cx + 2, cy - 2, w - 5, 2, '#ffffff'); R(cx + 1, cy + 3, w - 2, 1, '#dcefff'); }
    for (let x = 0; x < 64; x++) { const h = Math.round(31 + 3 * Math.sin(x / 9) + 2 * Math.sin(x / 4 + 1)); R(x, h, 1, 64 - h, '#4f9e3c'); }
    for (let x = 0; x < 64; x++) { const h = Math.round(38 + 1.5 * Math.sin(x / 7 + 2)); R(x, h, 1, 64 - h, '#68bd45'); R(x, h, 1, 1, '#86d35a'); }
    for (let i = 0; i < 70; i++) { const x = Math.floor(rnd() * 64), y = 40 + Math.floor(rnd() * 24); R(x, y, 1, 2, rnd() < 0.5 ? '#57a83a' : '#7ccb52'); }
    for (const [x, y, c] of [[6, 47, '#ffd23f'], [58, 50, '#ff8fb0'], [10, 58, '#ffffff'], [55, 60, '#ffd23f']]) { R(x - 1, y, 3, 1, c); R(x, y - 1, 1, 3, c); R(x, y, 1, 1, '#c0502a'); }
    // personagens 64x64 transparentes
    const fg = mk(64, 64), P = __sv.PRESETS();
    __sv.drawPreview(fg, P.xadrez, 1, 22, 57);
    __sv.drawPreview(fg, P.casaco, 1, 41, 57);
    __sv.drawPreview(fg, null, 2, 53, 62, 'sit');
    const f = fg.getContext('2d'), H = (x, y, w, h, c) => { f.fillStyle = c; f.fillRect(x, y, w, h); };
    const heart = ['.XX.XX.', 'XooXooX', 'XowoooX', 'XoooooX', '.XoooX.', '..XoX..', '...X...'];
    heart.forEach((row, y) => [...row].forEach((ch, x) => { if (ch !== '.') H(29 + x, 16 + y, 1, 1, ch === 'X' ? '#5a1424' : ch === 'w' ? '#ffd6de' : '#e8455a'); }));
    const render = (size, scaleFg, full) => {
      const c = mk(size, size), x = c.getContext('2d'); x.imageSmoothingEnabled = false;
      x.drawImage(bg, 0, 0, size, size);
      const s = size * scaleFg, o = (size - s) / 2;
      x.drawImage(fg, o, full ? size - s : o + s * 0.02, s, s);
      return c.toDataURL('image/png');
    };
    return { i512: render(512, 1, true), i192: render(192, 1, true), i180: render(180, 1, true), m512: render(512, 0.74, false) };
  });
  const dir = path.join(__dirname, '../../icons'); fs.mkdirSync(dir, { recursive: true });
  const save = (n, d) => fs.writeFileSync(path.join(dir, n), Buffer.from(d.split(',')[1], 'base64'));
  save('icon-512.png', out.i512); save('icon-192.png', out.i192); save('icon-180.png', out.i180); save('icon-maskable-512.png', out.m512);
  await b.close(); console.log('icons ok');
})();
