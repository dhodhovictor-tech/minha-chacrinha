// vitrine: cada conjunto da moda nos dois personagens, de frente, de lado e de costas
const { chromium } = require('playwright');
const SHOTS = __dirname + '/../.tmp/shots/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 900, height: 700 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + __dirname + '/../.tmp/teste.html'); await p.waitForTimeout(1200);
  await p.click('[data-v="casaco"]'); await p.fill('#nm', 'Ela'); await p.click('[data-a="start"]'); await p.waitForTimeout(800);
  await p.evaluate(() => {
    const s = __sv, P = s.PRESETS();
    const sets = [['casaco', { cp: 'vestidoflorido', hd: 'chapeuprimavera', bt: 'sapatilhas' }], ['casaco', { cp: 'jardineira', bt: 'sapatilhas' }],
      ['casaco', { cp: 'vestidoverao', hd: 'chapeupraia', bt: 'sandalias' }], ['casaco', { cp: 'shortblusa', bt: 'sandalias' }],
      ['casaco', { cp: 'vestidoxadrez', hd: 'boina', bt: 'botinhas' }], ['casaco', { cp: 'cardiga', bt: 'botinhas' }],
      ['casaco', { cp: 'vestidola', hd: 'toucapompom', bt: 'botasneve' }], ['casaco', { cp: 'casacopelucia', bt: 'botasneve' }],
      ['xadrez', { cp: 'jaquetacouro', hd: 'chapeuexplorador', bt: 'botasaventura' }], ['xadrez', { cp: 'camisarancheiro', hd: 'chapeuvaqueiro', bt: 'botasrancheiro' }]];
    const c = document.createElement('canvas'); c.width = 900; c.height = 700; c.id = 'vit'; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.fillStyle = '#f4dca0'; x.fillRect(0, 0, 900, 700);
    sets.forEach(([pr, eq], i) => { const look = s.withEq(P[pr], eq); [1, 3, 0].forEach((d, j) => { const fc = s.farmerCanvas(look, d, 0); x.drawImage(fc, 20 + (i % 5) * 176 + j * 54, 30 + Math.floor(i / 5) * 330, fc.width * 3, fc.height * 3); });
      ['cp', 'hd', 'bt'].forEach((k, j) => { if (eq[k]) x.drawImage(s.iconCanvas(eq[k]), 30 + (i % 5) * 176 + j * 40, 180 + Math.floor(i / 5) * 330, 32, 32); }); });
    document.body.innerHTML = ''; document.body.appendChild(c);
  });
  await p.screenshot({ path: SHOTS + 'moda_vitrine.png' }); console.log('erros', errs); await b.close();
})();
