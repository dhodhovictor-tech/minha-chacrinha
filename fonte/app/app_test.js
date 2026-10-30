// Testa o app instalável contra o emulador do Firebase: dois aparelhos, jogo assíncrono, troca de chacrinha e modo offline.
// Antes: python3 fonte/build.py; emulador (npx firebase-tools emulators:start --only database --project demo-chacrinha, dentro de fonte/app);
// e o site servido em 127.0.0.1:8080 (python3 -m http.server 8080 --bind 127.0.0.1, na raiz do repositório).
const { chromium } = require('playwright');
const fs = require('fs');
const URL = 'http://127.0.0.1:8080/', DB = 'http://127.0.0.1:9000', NS = '?ns=demo-chacrinha';
const testHtml = fs.readFileSync(__dirname + '/../.tmp/index_test.html', 'utf8');
const EMU = "window.FIREBASE_CONFIG = { apiKey: 'demo', projectId: 'demo-chacrinha', databaseURL: 'http://127.0.0.1:9000?ns=demo-chacrinha', emulator: { host: '127.0.0.1', port: 9000 } };";
const rest = async (method, path, body) => { const r = await fetch(`${DB}/${path}.json${NS}`, { method, headers: { Authorization: 'Bearer owner' }, body: body === undefined ? undefined : JSON.stringify(body) }); return r.json(); };
(async () => {
  await rest('DELETE', '');
  const b = await chromium.launch({ args: ['--disable-features=LocalNetworkAccessChecks,PrivateNetworkAccessChecks,BlockInsecurePrivateNetworkRequests'] });
  const ok = (c, msg) => console.log((c ? 'OK   ' : 'FALHA') + ' ' + msg);
  const errs = [];
  async function device(name, opts = {}) {
    const ctx = await b.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, serviceWorkers: opts.sw ? 'allow' : 'block' });
    if (!opts.sw) await ctx.route(u => { const x = new globalThis.URL(u); return x.pathname === '/' || x.pathname === '/index.html'; }, r => r.fulfill({ status: 200, contentType: 'text/html', body: testHtml }));
    if (!opts.sw) await ctx.route('**/config.js', r => r.fulfill({ status: 200, contentType: 'text/javascript', body: EMU }));
    return { ctx, name };
  }
  async function open(dev, hash = '') {
    const page = await dev.ctx.newPage();
    page.on('pageerror', e => errs.push(dev.name + ': ' + e.message)); page.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errs.push(dev.name + ': ' + m.text()); });
    await page.goto(URL + hash); await page.waitForTimeout(1500);
    return page;
  }
  const ev = (p, f, x) => p.evaluate(f, x);
  const gateText = p => ev(p, () => (document.getElementById('appgate') || {}).innerText || '');
  // 1) aparelho A cria uma chacrinha nova
  const dA = await device('A');
  let A = await open(dA);
  ok(/Digite o código/.test(await gateText(A)), 'sem código, o app pede o código da chacrinha');
  await A.click('#gnew'); await A.waitForTimeout(200);
  const code = (await gateText(A)).match(/[a-z]+-[a-z]+-\d{4}/)[0];
  ok(!!code, 'código novo gerado: ' + code);
  await A.click('#gc'); await A.waitForTimeout(800);
  ok(/Ninguém entrou/.test(await gateText(A)), 'chacrinha nova: ninguém entrou ainda');
  await A.click('[data-u=""]'); await A.waitForTimeout(2000);
  await A.click('[data-v="xadrez"]'); await A.fill('#nm', 'Eu'); await A.click('[data-a="start"]'); await A.waitForTimeout(1200);
  ok(await ev(A, () => !!__sv.P && __sv.P.name === 'Eu'), 'A criou o personagem');
  // 2) aparelho B entra com o código
  const dB = await device('B');
  let B = await open(dB, '#c=' + code);
  const gB = await gateText(B);
  ok(/Sou Eu/.test(gB) && /pessoa nova/.test(gB), 'B vê quem já está na chacrinha: ' + gB.replace(/\s+/g, ' '));
  await B.click('[data-u=""]'); await B.waitForTimeout(2000);
  ok(/Alguém já está cuidando/.test(await ev(B, () => document.querySelector('.win').innerText)), 'B vê que a chacrinha já existe');
  await B.click('[data-v="casaco"]'); await B.fill('#nm', 'Ela'); await B.click('[data-a="start"]'); await B.waitForTimeout(1500);
  const hA = await ev(A, () => __sv.host), hB = await ev(B, () => __sv.host);
  ok(hA !== hB, `só uma pessoa controla o relógio (A ${hA}, B ${hB})`);
  await ev(A, () => __sv.goMap('farm', 10 * 16 + 8, 9 * 16 + 4, 3)); await ev(B, () => __sv.goMap('farm', 12 * 16 + 8, 9 * 16 + 4, 2));
  await A.waitForTimeout(1500);
  const seen = await ev(A, () => __sv.peerPlayers().filter(p => !p.me).map(p => p.name + '@' + p.map + (p.pt ? ' gato@' + p.pt[4] : '')));
  ok(seen.length === 1 && /Ela@farm/.test(seen[0]) && /gato@farm/.test(seen[0]), 'A vê B e o Darth: ' + seen);
  await A.screenshot({ path: 'app_A.png' }); await B.screenshot({ path: 'app_B.png' });
  // plantar
  await ev(A, () => { const s = __sv, P = s.P; P.x = 15 * 16 + 8; P.y = 13 * 16 + 12; P.dir = 0; s.setTile('15,12', null); P.sel = 0; s.act(); });
  await A.waitForTimeout(400);
  await ev(A, () => { const s = __sv, P = s.P; P.sel = 7; s.act(); });
  await A.waitForTimeout(1000);
  ok(/pastinaca/.test(await ev(B, () => JSON.stringify(__sv.tile('15,12')))), 'B vê a plantação feita por A');
  const g0 = await ev(A, () => __sv.gold());
  await ev(B, () => __sv.earn(1000)); await B.waitForTimeout(2500);
  ok(await ev(A, () => __sv.gold()) === g0 + 1000, 'dinheiro ganho por B aparece para A');
  // presente (mensagem direta entre aparelhos)
  const sB0 = await ev(B, () => __sv.count('s_pastinaca'));
  await ev(A, () => { const P = __sv.P; P.x = 10 * 16 + 8; P.y = 9 * 16 + 4; P.dir = 3; P.sel = 7; });
  await ev(B, () => { const P = __sv.P; P.x = 11 * 16 + 10; P.y = 9 * 16 + 6; });
  await A.waitForTimeout(1000);
  await ev(A, () => __sv.act()); await A.waitForTimeout(1200);
  ok(await ev(B, () => __sv.count('s_pastinaca')) === sB0 + 1, 'presente de A chegou para B');
  // mudar construção de lugar: A muda o silo, B vê
  await ev(A, () => { const s = __sv; for (let y = 18; y <= 26; y++) for (let x = 8; x <= 30; x++) if (s.tile(x + ',' + y)) s.setTile(x + ',' + y, null); s.setFarm('b', 'bsilo', { type: 'silo', lv: 1, x: 20, y: 22, ready: s.W.meta.day, feed: 0 }); });
  await A.waitForTimeout(800);
  await A.click('#bMenu'); await A.click('[data-t="coop"]'); await A.click('[data-a="moveStart"]'); await A.waitForTimeout(200);
  await ev(A, () => { const pl = __sv.placing; pl.x = 21; pl.y = 22; __sv.act(); }); await A.waitForTimeout(200);
  await ev(A, () => { const pl = __sv.placing; pl.x = 12; pl.y = 21; __sv.act(); }); await A.waitForTimeout(1200);
  ok(await ev(B, () => { const b = __sv.W.farm.b.bsilo; return b && b.x === 12 && b.y === 21; }), 'A mudou o silo de lugar e B vê no lugar novo');
  // mina
  await ev(A, () => __sv.goMap('mine1', 0, 0, 1)); await ev(B, () => __sv.goMap('mine1', 0, 0, 1)); await A.waitForTimeout(800);
  const rk = await ev(A, () => { const m = __sv.curMap(); const k = Object.keys(m.rocks)[0]; const [x, y] = k.split(',').map(Number); const P = __sv.P; P.x = x * 16 + 8; P.y = (y + 1) * 16 + 12; P.dir = 0; P.sel = 3; __sv.curMap().rocks[k].hp = 1; __sv.act(); return k; });
  await A.waitForTimeout(1000);
  ok(await ev(B, rk => __sv.brokenSet(1).has(rk), rk), 'pedra quebrada na mina sincroniza');
  const ta = await ev(A, () => __sv.nowMin()), tb = await ev(B, () => __sv.nowMin());
  ok(Math.abs(ta - tb) <= 10, `relógio igual nos dois (${ta} / ${tb})`);
  // dormir
  await ev(A, () => __sv.goMap('house', 2 * 16 + 8, 5 * 16 + 8, 0)); await A.waitForTimeout(500);
  await ev(A, () => { __sv.openSleep(); document.querySelector('[data-a="sleep"]').click(); }); await A.waitForTimeout(2000);
  ok(await ev(A, () => __sv.W.meta.day) === 1, 'com só A dormindo, o dia não vira');
  await ev(B, () => __sv.goMap('house', 3 * 16 + 8, 5 * 16 + 8, 0)); await B.waitForTimeout(500);
  await ev(B, () => { __sv.openSleep(); document.querySelector('[data-a="sleep"]').click(); }); await B.waitForTimeout(4000);
  const dayA = await ev(A, () => __sv.W.meta.day), dayB = await ev(B, () => __sv.W.meta.day);
  ok(dayA === 2 && dayB === 2, `os dois dormiram e o dia virou (${dayA} / ${dayB})`);
  ok(/pastinaca/.test(await ev(B, () => JSON.stringify(__sv.tile("15,12")))), "plantação continua lá no dia seguinte");
  await B.reload(); await B.waitForTimeout(3000);
  ok(await ev(B, () => !!__sv.P && __sv.P.name === 'Ela' && !!__sv.P.pet), 'B reabriu o app e voltou direto com o mesmo personagem e o Darth');
  await ev(B, () => { const c = document.querySelector('[data-a="close"]'); c && c.click(); });
  // 3) jogo assíncrono: B sai, A planta e sai, passam 3 horas, B volta
  await B.close();
  await ev(A, () => { const c = document.querySelector('[data-a="close"]'); c && c.click(); __sv.goMap('farm', 10 * 16 + 8, 9 * 16 + 4, 1); });
  await A.waitForTimeout(2500);
  ok(await ev(A, () => __sv.host), 'com B fora, A assume o relógio');
  await ev(A, () => { __sv.setTile('17,12', { s: 1, c: { id: 'batata', g: 0 } }); __sv.earn(500); });
  await A.waitForTimeout(1500);
  const minA = await ev(A, () => __sv.nowMin());
  await A.close(); await new Promise(r => setTimeout(r, 1500));
  const peersLeft = await rest('GET', `salas/${code}/peers`);
  ok(!peersLeft, 'ao fechar o app, a pessoa sai da sala: ' + JSON.stringify(peersLeft));
  const ck = await rest('GET', `chacrinhas/${code}/world/clock`);
  await rest('PATCH', `chacrinhas/${code}/world/clock`, { at: ck.at - 3 * 3600 * 1000 });
  B = await open(dB); await B.waitForTimeout(2500);
  ok(await ev(B, () => !!__sv.P && __sv.P.name === 'Ela'), 'B voltou direto, sem pedir código de novo');
  ok(/batata/.test(await ev(B, () => JSON.stringify(__sv.tile('17,12')))), 'B vê o que A plantou enquanto B estava fora');
  const minB = await ev(B, () => __sv.nowMin());
  ok(minB >= minA - 5 && minB <= minA + 40, `relógio não pulou (A saiu às ${minA}, B entrou às ${minB})`);
  ok(await ev(B, () => __sv.gold()) === g0 + 1000 + 500, 'dinheiro do casal soma tudo: ' + (await ev(B, () => __sv.gold())));
  const docs = await rest('GET', `chacrinhas/${code}`);
  console.log('tamanho no banco (KB):', Object.entries(docs).map(([c, v]) => Object.entries(v).map(([k, d]) => c + '/' + k + '=' + (JSON.stringify(d).length / 1024).toFixed(1)).join(' ')).join(' '));
  await B.close();
  const D = await open(dA, '');
  await ev(D, () => { const c = document.querySelector('[data-a="close"]'); c && c.click(); });
  // 5) trocar de chacrinha pelo menu
  await D.click('#bMenu'); await D.waitForTimeout(300);
  await D.click('[data-t="coop"]'); await D.waitForTimeout(300);
  ok((await ev(D, () => document.querySelector('.win').innerText)).includes(code), 'aba Chacrinha mostra o código');
  ok(/Versão do jogo: .*\(\w{7}\)/.test(await ev(D, () => document.querySelector('.win').innerText)) && !!(await D.$('[data-a="appupdate"]')), 'aba Chacrinha mostra a versão e o botão Procurar atualização');
  await D.click('[data-a="appswitch"]'); await D.waitForTimeout(200); await D.click('[data-a="appswitch2"]'); await D.waitForTimeout(2000);
  ok(/Digite o código/.test(await gateText(D)), 'trocar de chacrinha volta para a tela do código');
  await D.close();
  // 6) app instalado: guarda os arquivos e abre sem internet
  const dS = await device('S', { sw: true });
  const S = await dS.ctx.newPage(); await S.goto(URL); await S.waitForTimeout(500);
  await S.evaluate(() => navigator.serviceWorker.ready); await S.waitForTimeout(1500);
  const cached = await S.evaluate(async () => { const ks = await caches.keys(); const c = await caches.open(ks[0]); return (await c.keys()).length; });
  ok(cached >= 15, 'arquivos guardados no aparelho: ' + cached);
  await dS.ctx.setOffline(true);
  await S.reload(); await S.waitForTimeout(1500);
  ok(await S.evaluate(() => !!document.getElementById('cv') && /Digite o código/.test((document.getElementById('appgate') || {}).innerText || '')), 'sem internet o app ainda abre');
  const man = await (await fetch(URL + 'manifest.webmanifest')).json();
  ok(man.icons.length === 3 && man.display === 'fullscreen', 'manifest com ícones');
  console.log('ERROS', errs.slice(0, 8));
  await b.close();
})();
