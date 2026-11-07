
  // ================= mais variedade na mina e na mata =================
  // Mina (andares que não são de 5 em 5): veio rico, andar infestado (a escada só aparece depois de vencer todos),
  // andar de cogumelos, buraco que desce até 3 andares (sem pular o elevador) e baú perdido.
  // Mata (clareiras sem guardião): frutas silvestres, colmeia selvagem, círculo das fadas, bando de javalis e acampamento abandonado.
  const AV_NOME = { rico: 'Veio rico! Este andar está cheio de minério.', infestado: 'Andar infestado! Vença todos os bichos para a escada aparecer.', cogumelos: 'Andar dos cogumelos! Dá para colher com o botão Usar.', buraco: 'Tem um buraco no chão... dá para pular e descer mais rápido.', bau: 'Tem um baú perdido em algum lugar deste andar!',
    frutas: 'Clareira de frutas silvestres!', colmeia: 'Uma colmeia selvagem zumbe numa árvore...', fadas: 'Um círculo de cogumelos das fadas! Fique no meio e toque em Usar.', estouro: 'Estouro de javalis! Vença o bando para ganhar um prêmio.', acampamento: 'Um acampamento abandonado. Será que deixaram algo?' };
  // o que já foi usado hoje (colher, abrir, prêmio): P.flags.av = { d: dia, k: { chave: 1 } }
  const avUsado = key => { const f = P.flags.av; return !!(f && f.d === W.meta.day && f.k[key]); };
  const avMarca = key => { let f = P.flags.av; if (!f || f.d !== W.meta.day) f = P.flags.av = { d: W.meta.day, k: {} }; f.k[key] = 1; dirty(); };
  function avLivres(m, ok, r, longe = 3) {
    const l = [];
    for (let y = 2; y < m.h - 2; y++) for (let x = 2; x < m.w - 2; x++) if (ok(x, y) && !m.spots[x + ',' + y] && Math.abs(x - m.start[0]) + Math.abs(y - m.start[1]) >= longe) l.push([x, y]);
    return { tira: () => (l.length ? l.splice(Math.floor(r() * l.length), 1)[0] : null) };
  }

  // ---------- mina ----------
  function minaTipo(m, n, r) {
    if (n % 5 === 0 || n < 3) return;
    const q = r(), livre = (x, y) => m.at(x, y) === G.CAVE && !m.rocks[x + ',' + y] && m.at(x, y + 1) !== G.ROCKWALL;
    if (q < 0.1) {
      m.tipo = 'rico';
      for (const o of Object.values(m.rocks)) if (o.kind === 'stone' && r() < 0.4) { const z = r(); o.kind = m.tier === 0 ? (z < 0.5 ? 'cobre' : z < 0.8 ? 'coal' : n >= 20 ? 'ferro' : 'gem:quartzo') : m.tier === 1 ? (z < 0.5 ? 'ferro' : z < 0.8 ? 'cobre' : 'gem:ametista') : (z < 0.45 ? 'ouro' : z < 0.75 ? 'ferro' : 'gem:esmeralda'); o.hp = 3; }
    } else if (q < 0.19 && n >= 6) { m.tipo = 'infestado'; m.infest = true; }
    else if (q < 0.27) {
      m.tipo = 'cogumelos'; const L = avLivres(m, livre, r), cnt = 7 + Math.floor(r() * 5);
      for (let k = 0; k < cnt; k++) { const p = L.tira(); if (!p) break; const z = r(); spot(m, p[0], p[1], { kind: 'avpega', id: z < 0.15 ? 'cogumelorei' : z < 0.5 ? 'morchela' : 'cogumelo' }); }
    } else if (q < 0.33 && 5 - (n % 5) >= 2) {
      const p = avLivres(m, livre, r, 5).tira(); if (!p) return;
      m.tipo = 'buraco'; spot(m, p[0], p[1], { kind: 'avburaco', to: Math.min(n + 3, Math.ceil(n / 5) * 5) });
    } else if (q < 0.4) {
      const p = avLivres(m, livre, r, 5).tira(); if (!p) return;
      m.tipo = 'bau'; spot(m, p[0], p[1], { kind: 'avbau' }); m.solid[p[1] * m.w + p[0]] = 1;
    }
  }
  function minaEntrar(m, n, list, r) {
    if (!m.tipo) return;
    if (m.infest) for (const mo of list.slice()) { let x, y, k = 0; do { x = 1 + Math.floor(r() * (m.w - 2)); y = 1 + Math.floor(r() * (m.h - 2)); k++; } while ((solidAt(m, x, y) || Math.hypot(x - m.start[0], y - m.start[1]) < 5) && k < 40); list.push({ ...mo, x: x * T + 8, y: y * T + 12, ph: r() * 10, hopT: r() * 2 }); }
    toast(AV_NOME[m.tipo], m.tipo === 'infestado' ? 'big' : '');
  }
  function minaBauLoot(m) {
    const t = m.tier || 0, l = [[['cobre', rint(5, 9)], ['carvao', rint(2, 4)], ['geodo', rint(1, 2)], ['quartzo', 1]], [['ferro', rint(4, 7)], ['carvao', rint(3, 5)], ['geodogelo', 2], [pick(['ametista', 'topazio']), 1]], [['ouro', rint(3, 6)], ['ferro', rint(3, 5)], ['geodomagma', 2], [pick(['esmeralda', 'rubi', 'diamante']), 1]]][t];
    if (Math.random() < 0.2) l.push([pick(['anelsorte', 'anelbrilho', 'anelpedra']), 1]);
    return l.filter(([id]) => ITEMS[id]);
  }
  function darLoot(l) { const got = []; for (const [id, n] of l) if (addItem(id, n, true)) got.push(`${n} ${item(id).name.toLowerCase()}`); return got.join(', '); }

  // ---------- mata ----------
  function mataTipo(m, n, r, boss) {
    if (boss || n < 2) return;
    const q = r(), livre = (x, y) => [G.GRASS, G.FLOWERS].includes(m.at(x, y)) && !m.wood[x + ',' + y] && Math.abs(x - m.start[0]) + Math.abs(y - m.start[1]) >= 4;
    const livre3 = (x, y) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (!livre(x + dx, y + dy)) return false; return true; };
    if (q < 0.1) {
      m.tipo = 'frutas'; const L = avLivres(m, livre, r, 4), s = season(), fr = { spring: ['morchela', 'alhoporo', 'narciso'], summer: ['framboesa', 'baga', 'framboesa'], fall: ['amora', 'avela', 'amora'], winter: ['frutacristal', 'pinha', 'frutacristal'] }[s].filter(id => ITEMS[id]);
      for (let k = 0; k < 8; k++) { const p = L.tira(); if (!p) break; m.wood[p[0] + ',' + p[1]] = { kind: 'forage', hp: 1, v: 0, id: fr[Math.floor(r() * fr.length)] }; }
    } else if (q < 0.19) {
      const p = avLivres(m, livre3, r, 6).tira(); if (!p) return;
      m.tipo = 'colmeia'; m.colmeia = p.join(','); spot(m, p[0], p[1], { kind: 'avcolmeia' }); m.solid[p[1] * m.w + p[0]] = 1;
    } else if (q < 0.27) {
      const p = avLivres(m, livre3, r, 6).tira(); if (!p) return;
      m.tipo = 'fadas'; m.fadas = p.join(','); spot(m, p[0], p[1], { kind: 'avfadas' });
    } else if (q < 0.35 && n >= 4) { m.tipo = 'estouro'; m.estouro = true; }
    else if (q < 0.41) {
      const p = avLivres(m, (x, y) => livre3(x, y) && livre3(x + 2, y), r, 6).tira(); if (!p) return;
      m.tipo = 'acampamento'; const [x, y] = p; m.acamp = [x, y];
      m.solid[y * m.w + x] = 1; m.solid[(y - 1) * m.w + x] = 1; m.solid[y * m.w + x - 1] = 1; m.solid[(y - 1) * m.w + x - 1] = 1;
      spot(m, x + 2, y, { kind: 'avfogo' }); m.solid[y * m.w + x + 2] = 1;
      m.wood[(x + 1) + ',' + (y + 1)] = { kind: 'bau', hp: 1, v: 0 };
    }
  }
  function mataEntrar(m, n, list, r) {
    if (!m.tipo) return;
    if (m.estouro) for (let i = 0; i < 4 + m.area; i++) { let x, y, k = 0; do { x = 2 + Math.floor(r() * (m.w - 4)); y = 2 + Math.floor(r() * (m.h - 4)); k++; } while ((solidAt(m, x, y) || Math.hypot(x - m.start[0], y - m.start[1]) < 7) && k < 50); list.push({ ...mataMon('javali', x * T + 8, y * T + 12, n, r()), estouro: true }); }
    toast(AV_NOME[m.tipo], m.tipo === 'estouro' ? 'big' : '');
  }

  // ---------- quando um bicho cai ----------
  function aventuraKill(mo) {
    const m = curMap();
    if (m.infest && !m.ladder && m.floor < MINE_BOTTOM && monsters.every(x => x.dead)) {
      let x = Math.floor(mo.x / T), y = Math.floor((mo.y - 4) / T);
      if (solidAt(m, x, y)) [x, y] = [m.start[0], m.start[1] + 1];
      m.ladder = x + ',' + y;
      const got = darLoot(minaBauLoot(m));
      sfx.level(); toast(`Andar limpo! A escada apareceu, e os bichos guardavam: ${got}.`, 'big');
      if (room) room.emit('mine', { d: W.meta.day, f: m.floor, k: 'limpo', ladder: m.ladder }).catch(() => {});
    }
    if (m.estouro && mo.estouro && monsters.filter(x => x.estouro).every(x => x.dead)) {
      const key = m.id + '|estouro|' + m.per; if (avUsado(key)) return;
      avMarca(key); sfx.level();
      toast(`Você venceu o bando de javalis! Prêmio: ${darLoot([['couro', 4], ['carnesuina', 2], ['madeiralei', 1 + m.area]])}.`, 'big');
    }
  }

  // ---------- tocar em Usar ----------
  function aventuraSpot(sp) {
    const m = curMap(), k = Object.keys(m.spots).find(kk => m.spots[kk] === sp), key = m.id + '|' + k;
    switch (sp.kind) {
      case 'avpega':
        if (avUsado(key)) return false;
        if (!addItem(sp.id, 1)) return true;
        avMarca(key); gainXP('foraging', 3); sfx.pop(); return true;
      case 'avburaco': sfx.pop(); toast(`Você pulou no buraco e caiu no andar ${sp.to}!`); goMap('mine' + sp.to, 0, 0, 1); return true;
      case 'avbau':
        if (avUsado(key)) { toast('O baú está vazio.'); return true; }
        avMarca(key); sfx.coin(); toast(`Baú perdido na mina! ${darLoot(minaBauLoot(m))}.`, 'big'); return true;
      case 'avcolmeia': {
        const kk = key + '|' + m.per;
        if (avUsado(kk)) { toast('A colmeia já foi colhida. As abelhas estão fazendo mais mel.'); return true; }
        avMarca(kk); const api = eqHas('chapeuapicultor'), n = rint(2, 3) + (api ? 1 : 0);
        addItem('melsilvestre', n, true); sfx.pop();
        if (api) toast(`Com o chapéu de apicultor, as vespas nem ligaram. Você pegou ${n} mel silvestre!`, 'big');
        else {
          const [x, y] = k.split(',').map(Number);
          for (let i = 0; i < 3; i++) monsters.push(mataMon('vespa', x * T + 8 + rnd(-20, 20), y * T + rnd(-10, 10), m.mataN, Math.random()));
          toast(`Você pegou ${n} mel silvestre... e as vespas acordaram!`, 'big');
        }
        return true;
      }
      case 'avfadas': {
        const kk = 'fadas|' + m.per;
        if (avUsado(kk)) { toast('As fadas já te abençoaram hoje.'); return true; }
        avMarca(kk); addItem('cogumelorei', 1, true);
        const b = pick([{ luck: 2 }, { foraging: 2 }, { speed: 1, luck: 1 }]);
        P.buff = { b, until: 26 * 60, day: W.meta.day, name: 'Bênção das fadas' };
        for (const [f, d] of [[784, 0], [988, 0.1], [1175, 0.2], [1568, 0.3]]) tone(f, f, 0.18, 'sine', 0.05, d);
        toast(`As fadas te abençoaram: ${Object.entries(b).map(([kk2, v]) => `${BUFF_NAMES[kk2]} +${v}`).join(', ')} até o fim do dia! E deixaram um cogumelo-rei.`, 'big');
        return true;
      }
      case 'avfogo': { const [x, y] = k.split(',').map(Number); useFire(x * T + 8, y * T + 8); return true; }
    }
    return false;
  }

  // ---------- desenho ----------
  function cogumeloPx(x, y, id) {
    if (id === 'morchela') { oval(x, y - 3, 3, 4, '#c8a060'); for (const [dx, dy] of [[-1, -5], [1, -3], [-1, -1]]) R(x + dx, y + dy, 1, 1, '#7a5a30'); R(x - 1, y, 2, 2, '#f4e8d0'); return; }
    const cap = id === 'cogumelorei' ? '#d83a2a' : '#a8703a';
    R(x - 1, y - 2, 2, 4, '#f4e8d0'); oval(x, y - 3, 4, 2.6, cap); R(x - 2, y - 4, 2, 1, shade(cap, 0.3));
    if (id === 'cogumelorei') { R(x - 2, y - 3, 1, 1, '#ffffff'); R(x + 1, y - 4, 1, 1, '#ffffff'); }
  }
  function aventuraEnts(m, ents, t) {
    if (!m.tipo) return;
    for (const [k, sp] of Object.entries(m.spots)) {
      if (!sp.kind || !sp.kind.startsWith('av')) continue;
      const [x, y] = k.split(',').map(Number), px = x * T, py = y * T, key = m.id + '|' + k;
      if (sp.kind === 'avpega' && !avUsado(key)) ents.push({ y: py + 12, f: () => { shadowAt(px + 8, py + 13, 4, 1.5); cogumeloPx(px + 8, py + 13, sp.id); } });
      if (sp.kind === 'avburaco') ents.push({ y: -900, f: () => { oval(px + 8, py + 9, 9, 5, '#4a3a2a'); oval(px + 8, py + 9, 7, 4, '#0a0604'); R(px + 2, py + 5, 3, 1, '#7a6a5a'); } });
      if (sp.kind === 'avbau') ents.push({ y: py + 15, f: () => { shadowAt(px + 8, py + 15, 7, 2); if (!avUsado(key)) { blit(objCanvas('bau'), px - 1, py - 4); if (Math.sin(t * 3 + x) > 0.6) R(px + 12, py - 4, 1, 1, '#ffffff'); } else { R(px + 1, py + 4, 14, 10, '#6a3a1a'); R(px + 2, py + 5, 12, 4, '#1a0e08'); R(px + 1, py - 2, 14, 5, '#8a5a2a'); } } });
      if (sp.kind === 'avcolmeia') ents.push({ y: py + 15, f: () => {
        // tronco seco com galhos e a colmeia pendurada
        shadowAt(px + 8, py + 15, 9, 3);
        R(px + 4, py - 26, 8, 41, '#6a4424'); R(px + 5, py - 26, 2, 41, '#8a5a32'); R(px + 10, py - 26, 2, 41, '#4a2c14');
        R(px - 6, py - 22, 11, 3, '#6a4424'); R(px - 8, py - 25, 3, 4, '#6a4424'); R(px + 11, py - 16, 10, 3, '#6a4424'); R(px + 19, py - 20, 3, 5, '#6a4424');
        for (const [dx, dy] of [[-7, -27], [20, -22], [2, -30]]) { disc(px + dx, py + dy, 3.5, '#3a8a2a'); disc(px + dx - 1, py + dy - 1, 2, '#5ab84a'); }
        const cheia = !avUsado(m.id + '|' + k + '|' + m.per), hx = px + 17, hy = py - 6;
        R(hx - 1, py - 14, 2, 3, '#4a2c14');
        oval(hx, hy, 7, 9, cheia ? '#e8b030' : '#a8783a'); oval(hx - 2, hy - 3, 3, 4, cheia ? '#f8d060' : '#c89858');
        for (const yy of [-6, -2, 2, 6]) R(hx - 6 + Math.abs(yy) / 3, hy + yy, 12 - Math.abs(yy) / 1.5, 1, '#a86a18');
        R(hx - 1, hy + 3, 3, 3, '#2a1a0a');
        if (cheia) for (let i = 0; i < 5; i++) { const a = t * 3 + i * 1.3; R(hx + Math.cos(a) * 11, hy + Math.sin(a * 1.3) * 8, 2, 1, '#f4d020'); R(hx + Math.cos(a) * 11, hy + Math.sin(a * 1.3) * 8 - 1, 1, 1, '#ffffff'); }
      } });
      if (sp.kind === 'avfadas') ents.push({ y: -900, f: () => {
        ctx.globalAlpha = 0.35 + Math.sin(t * 2) * 0.1; oval(px + 8, py + 10, 20, 13, '#b8f0a0'); oval(px + 8, py + 10, 15, 9, '#d8ffc8'); ctx.globalAlpha = 1;
        for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; cogumeloPx(px + 8 + Math.cos(a) * 17, py + 10 + Math.sin(a) * 11, i % 3 ? 'cogumelo' : 'cogumelorei'); }
        if (!avUsado('fadas|' + m.per)) for (let i = 0; i < 5; i++) { const a = t * 1.5 + i * 1.3; R(px + 8 + Math.cos(a) * 10, py + 4 + Math.sin(a * 1.7) * 8 - Math.abs(Math.sin(t * 2 + i)) * 6, 1, 1, ['#fff8c0', '#c8f0ff', '#ffc8f0'][i % 3]); }
      } });
      if (sp.kind === 'avfogo') ents.push({ y: py + 12, f: () => { for (const [dx, dy] of [[-6, 4], [6, 4], [0, 7]]) R(px + 8 + dx - 3, py + 8 + dy, 6, 3, '#8a8278'); drawFire(px + 8, py + 8, t); } });
    }
    if (m.acamp) { const [x, y] = m.acamp; ents.push({ y: y * T + 15, f: () => {
      const bx = (x - 1) * T, by = y * T + 16;
      shadowAt(bx + 16, by - 1, 18, 3);
      poly([[bx - 2, by], [bx + 16, by - 30], [bx + 34, by]], '#c8783a'); poly([[bx + 16, by - 30], [bx + 34, by], [bx + 26, by]], '#a85a2a');
      poly([[bx + 10, by], [bx + 16, by - 16], [bx + 22, by]], '#2a1a0e'); R(bx + 15, by - 33, 2, 5, '#6a4424');
      for (let k2 = 0; k2 < 4; k2++) R(bx + 3 + k2 * 4, by - 4 - k2 * 6, 2, 1, '#e8a860');
    } }); }
  }
