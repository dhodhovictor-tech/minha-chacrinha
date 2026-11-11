
  // ================= interiores com a cara de cada lugar: parede, piso, tapete da porta e enfeites na parede =================
  // Usa as mesmas regras de papel de parede e piso da casa (casaPx), com padrões novos só das lojas.
  Object.assign(PAPEIS, {
    armazem: { rod: '#4a6a3a' }, forja: { rod: '#2a2220' }, celeiro: { rod: '#5a1a12' }, ondas: { rod: '#24486e' },
    padaria: { rod: '#8a5a2a' }, azulejo: { rod: '#3a8a6a' }, patinhas: { rod: '#4a7ab8' }, estante: { rod: '#3a1a0a' }, tijolobar: { rod: '#3a1a10' },
  });
  Object.assign(PISOS, { serragem: {}, deck: {}, terracota: {}, azulclaro: {}, clinica: {}, marmore: {} });
  // cor de um pixel dos padrões novos (ly = linha dentro do quadrado da parede)
  function lojaParede(papel, px, ly) {
    switch (papel) {
      case 'armazem': return (px % 8) < 4 ? '#d8e4b8' : '#c4d49c';
      case 'forja': { const row = Math.floor((ly - 2) / 3), lx = (px + (row % 2) * 4) % 8; return (ly - 2) % 3 === 2 || lx === 0 ? '#2a2220' : hash(px >> 3, row, 9) < 0.3 ? '#5a3a30' : '#6a4a3a'; }
      case 'celeiro': return (px % 6) === 0 ? '#5a1a12' : (px % 6) === 1 ? '#c84a3a' : '#a83228';
      case 'ondas': { const w = Math.round(Math.sin(px * 0.5) * 1.2); return ly === 4 + w || ly === 8 + w ? '#e8f8ff' : ly < 6 ? '#5a9ad8' : '#3a7ac0'; }
      case 'padaria': return (px % 6 === 0 || (ly - 2) % 4 === 0) ? '#c8c0b0' : ((px >> 3) + (ly >> 2)) % 2 ? '#f8f4ec' : '#e8f0f8';
      case 'azulejo': return ly === 7 ? '#3a8a6a' : (px % 5 === 0 || (ly - 2) % 3 === 0) ? '#d8e0dc' : '#f8fbfa';
      case 'patinhas': { const cx = (px % 12), cy = ly; const pata = (Math.abs(cx - 5) <= 1 && cy >= 5 && cy <= 7) || ((cx === 3 || cx === 7) && cy === 3) || ((cx === 4 || cx === 6) && cy === 2); return pata ? '#ffffff' : '#a8d0f0'; }
      case 'estante': { const lv = (ly - 2) % 4, livro = Math.floor(px / 3); return lv === 3 ? '#5a2a10' : ['#c83a3a', '#3a7ad0', '#e8b83a', '#5aa83a', '#8a4ab8', '#f4f0e8', '#c86a3a'][(livro * 7 + Math.floor((ly - 2) / 4)) % 7]; }
      case 'tijolobar': { const row = Math.floor((ly - 2) / 3), lx = (px + (row % 2) * 4) % 8; return (ly - 2) % 3 === 2 || lx === 0 ? '#8a7a6a' : hash(px >> 3, row, 4) < 0.3 ? '#9a3a28' : '#b84a32'; }
    }
    return null;
  }
  function lojaPiso(piso, px, py) {
    switch (piso) {
      case 'serragem': { const row = Math.floor(py / 6), j = (px + hash(row, 0, 7) * 40) % 40 | 0; if (hash(px, py, 21) > 0.97) return '#f0d8a0'; return py % 6 === 5 || j === 0 ? '#7a5428' : hash(row, Math.floor(px / 40), 3) < 0.5 ? '#c8945a' : '#bc8a50'; }
      case 'deck': { const row = Math.floor(py / 5), j = (px + hash(row, 0, 5) * 32) % 32 | 0; return py % 5 === 4 || j === 0 ? '#4a5a68' : hash(row, 1, 2) < 0.5 ? '#8a9aa8' : '#7a8a98'; }
      case 'terracota': { const lx = px % 12, ly = py % 12; return lx === 0 || ly === 0 ? '#e8d8c0' : ((px / 12 | 0) + (py / 12 | 0)) % 2 ? '#c86a3a' : '#d47a48'; }
      case 'azulclaro': { const d = ((px >> 3) + (py >> 3)) % 2, e = px % 8 === 0 || py % 8 === 0; return e ? '#d8e8f0' : d ? '#a8d4ec' : '#f4fafc'; }
      case 'clinica': { const e = px % 16 === 0 || py % 16 === 0; return e ? '#b8d8c8' : hash(px >> 4, py >> 4, 3) < 0.2 ? '#e0f0e8' : '#f0f8f4'; }
      case 'marmore': { const v = Math.sin(px * 0.15 + py * 0.08 + Math.sin(py * 0.2) * 2); return px % 16 === 0 || py % 16 === 0 ? '#c8c0b8' : v > 0.92 ? '#b8b0a8' : '#ece8e2'; }
    }
    return null;
  }
  // estilo de cada lugar: [papel de parede, piso]
  const ESTILO_LOJA = {
    store: ['armazem', 'taco'], smith: ['forja', null], carpentry: ['lambri', 'serragem'], ranch: ['celeiro', null], bar: ['tijolobar', 'escuro'],
    fishshop: ['ondas', 'deck'], atelie: ['lavanda', 'taco'], moveis: ['lambri', 'serragem'], padaria: ['padaria', 'ladrilho'], flores: ['floral', 'terracota'],
    petshop: ['patinhas', 'azulclaro'], clinica: ['azulejo', 'clinica'], biblioteca: ['estante', 'escuro'], museum: ['tijolo', 'marmore'], cc: ['lambri', null],
  };
  for (const [id, [pa, pi]] of Object.entries(ESTILO_LOJA)) {
    const m = MAPS[id]; if (!m) continue;
    const cont = new Map(); for (let i = 0; i < m.w * m.h; i++) { const g = m.g[i]; if (g !== G.WALL && g !== G.CARPET) cont.set(g, (cont.get(g) || 0) + 1); }
    m.pisoG = [...cont.entries()].sort((a, b) => b[1] - a[1])[0][0];
    m.papel = pa; if (pi) m.piso = pi; m.estiloLoja = true;
  }

  // enfeites na parede do fundo e tapetinho na porta (desenhos simples, não ocupam lugar)
  const ENFEITE_PAREDE = {
    store: [[5, 'lousa'], [8, 'cartaz']], smith: [[4, 'ferramentas'], [8, 'ferradura']], carpentry: [[3, 'serrote'], [6, 'planta']], ranch: [[3, 'ferradura'], [6, 'sino']],
    bar: [[10, 'alvo'], [12, 'letreiro']], fishshop: [[3, 'ancora'], [6, 'boia'], [8, 'trofeu']], padaria: [[3, 'paes'], [6, 'relogio'], [8, 'paes']], flores: [[3, 'vasoparede'], [6, 'quadroflor'], [8, 'vasoparede']],
    petshop: [[3, 'quadrogato'], [6, 'osso'], [8, 'quadrogato']], clinica: [[3, 'cruz'], [6, 'tabela'], [8, 'quadro']], biblioteca: [[6, 'relogio']], atelie: [[5, 'quadroflor']], moveis: [[5, 'serrote']],
  };
  const TAPETE = { store: '#4a8a4a', smith: '#5a3a2a', carpentry: '#a86a3a', ranch: '#c84a3a', bar: '#8a2a3a', fishshop: '#3a6ab8', padaria: '#e8b860', flores: '#e86a9a', petshop: '#4a8ad8', clinica: '#3a8a6a', biblioteca: '#6a3a8a', atelie: '#e86a9a', moveis: '#8a5a2a' };
  function enfeite(tipo, x, t) {
    const px = x * T, py = T;
    switch (tipo) {
      case 'lousa': R(px - 6, py + 2, 28, 14, '#7a4a24'); R(px - 5, py + 3, 26, 12, '#2a3a2e'); for (let i = 0; i < 3; i++) R(px - 2, py + 5 + i * 3, 10 + (i % 2) * 8, 1, '#e8f0e0'); disc(px + 18, py + 6, 1.5, '#f4c83a'); break;
      case 'cartaz': R(px + 1, py + 3, 14, 12, '#f8f0d8'); disc(px + 8, py + 8, 3.5, '#e8402a'); R(px + 7, py + 3, 2, 3, '#4a9a3a'); R(px + 3, py + 13, 10, 1, '#8a5a2a'); break;
      case 'ferramentas': R(px - 4, py + 3, 24, 2, '#5a3418'); for (const [dx, c] of [[-2, '#8a8a92'], [4, '#5a5a62'], [10, '#a8a8b0'], [16, '#7a7a82']]) { R(px + dx, py + 5, 2, 9, '#6a4a2a'); R(px + dx - 1, py + 5, 4, 3, c); } break;
      case 'ferradura': ctx.strokeStyle = '#a8a8b0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px + 8, py + 10, 4, Math.PI * 0.1, Math.PI * 0.9, true); ctx.stroke(); break;
      case 'serrote': poly([[px, py + 6], [px + 16, py + 9], [px + 16, py + 12], [px, py + 11]], '#c8c8d0'); R(px - 3, py + 6, 4, 6, '#a86a3a'); for (let i = 1; i < 16; i += 2) R(px + i, py + 11 + (i % 4 === 1 ? 1 : 0), 1, 1, '#8a8a92'); break;
      case 'planta': R(px + 5, py + 9, 6, 5, '#c86a3a'); disc(px + 8, py + 7, 4, '#3a8a3a'); disc(px + 6, py + 5, 2.5, '#5ab84a'); break;
      case 'sino': R(px + 7, py + 2, 2, 3, '#5a3418'); poly([[px + 4, py + 12], [px + 6, py + 5], [px + 10, py + 5], [px + 12, py + 12]], '#d8a830'); disc(px + 8, py + 13, 1.5, '#8a6a20'); break;
      case 'alvo': for (const [r, c] of [[7, '#2a2a2a'], [5.5, '#f4f0e8'], [4, '#e8402a'], [2.5, '#f4f0e8'], [1.2, '#e8402a']]) disc(px + 8, py + 9, r, c); R(px + 10, py + 6, 4, 1, '#f4c83a'); break;
      case 'letreiro': { const on = Math.sin(t * 3) > -0.6; R(px - 6, py + 4, 28, 9, '#2a1a2a'); drawText('BAR', px + 8, py + 9, on ? '#ff6ab8' : '#8a3a6a', 7); break; }
      case 'ancora': ctx.strokeStyle = '#4a4a52'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px + 8, py + 3); ctx.lineTo(px + 8, py + 14); ctx.stroke(); ctx.beginPath(); ctx.arc(px + 8, py + 10, 5, 0.2, Math.PI - 0.2); ctx.stroke(); R(px + 4, py + 5, 8, 2, '#4a4a52'); disc(px + 8, py + 2, 1.6, '#4a4a52'); break;
      case 'boia': disc(px + 8, py + 9, 6, '#f4f0e8'); disc(px + 8, py + 9, 3, '#3a7ac0'); for (const a of [0.4, 2, 3.6, 5.2]) disc(px + 8 + Math.cos(a) * 4.5, py + 9 + Math.sin(a) * 4.5, 1.8, '#e8402a'); break;
      case 'trofeu': R(px + 1, py + 4, 14, 10, '#7a4a24'); R(px + 2, py + 5, 12, 8, '#c8a060'); oval(px + 8, py + 9, 5, 2.5, '#3a8ad8'); R(px + 12, py + 8, 2, 3, '#3a8ad8'); break;
      case 'paes': R(px - 2, py + 11, 20, 2, '#7a4a24'); for (let i = 0; i < 3; i++) { oval(px + 2 + i * 6, py + 9, 3, 2.2, '#c8843a'); R(px + 1 + i * 6, py + 8, 2, 1, '#e8b870'); } break;
      case 'relogio': disc(px + 8, py + 8, 6, '#7a4a24'); disc(px + 8, py + 8, 5, '#f8f4ec'); R(px + 8, py + 5, 1, 4, '#2a1a0a'); R(px + 8, py + 8, 3, 1, '#2a1a0a'); break;
      case 'vasoparede': R(px + 4, py + 9, 8, 5, '#c86a3a'); for (const [dx, dy, c] of [[-3, 0, '#ff6aa8'], [0, -3, '#f4c83a'], [3, -1, '#ffffff'], [2, 2, '#c86ad8']]) disc(px + 8 + dx, py + 8 + dy, 1.8, c); R(px + 5, py + 13, 1, 3, '#3a8a3a'); R(px + 10, py + 13, 1, 4, '#3a8a3a'); break;
      case 'quadroflor': R(px, py + 2, 16, 13, '#c8a050'); R(px + 1, py + 3, 14, 11, '#f8f4e8'); for (const [dx, dy, c] of [[4, 6, '#e8402a'], [8, 5, '#f4c83a'], [11, 7, '#e86ab0']]) { R(px + dx, py + dy + 2, 1, 5, '#3a8a3a'); disc(px + dx, py + dy, 2, c); } break;
      case 'quadrogato': R(px, py + 2, 16, 13, '#7a4a24'); R(px + 1, py + 3, 14, 11, '#f8e8c8'); oval(px + 8, py + 10, 5, 3, '#2a2a32'); disc(px + 8, py + 6, 3, '#2a2a32'); poly([[px + 5, py + 5], [px + 6, py + 2], [px + 7, py + 5]], '#2a2a32'); poly([[px + 9, py + 5], [px + 10, py + 2], [px + 11, py + 5]], '#2a2a32'); R(px + 7, py + 6, 1, 1, '#5ae05a'); R(px + 9, py + 6, 1, 1, '#5ae05a'); break;
      case 'osso': R(px + 3, py + 8, 10, 3, '#f8f4ec'); for (const dx of [2, 13]) { disc(px + dx, py + 7.5, 2, '#f8f4ec'); disc(px + dx, py + 11.5, 2, '#f8f4ec'); } break;
      case 'cruz': R(px + 2, py + 3, 12, 12, '#ffffff'); R(px + 6, py + 4, 4, 10, '#e8402a'); R(px + 3, py + 7, 10, 4, '#e8402a'); break;
      case 'tabela': R(px + 1, py + 2, 14, 14, '#ffffff'); for (let i = 0; i < 5; i++) R(px + 8 - (5 - i), py + 3 + i * 3, (5 - i) * 2, 2, '#2a2a2a'); break;
      case 'quadro': R(px, py + 3, 16, 11, '#5a3418'); R(px + 1, py + 4, 14, 9, '#a8d8f0'); poly([[px + 1, py + 13], [px + 6, py + 7], [px + 10, py + 11], [px + 15, py + 6], [px + 15, py + 13]], '#5aa83a'); break;
    }
  }
  function interiorEnts(m, ents, t) {
    const lista = ENFEITE_PAREDE[m.id];
    if (lista) ents.push({ y: -997, f: () => { for (const [x, tipo] of lista) enfeite(tipo, x, t); } });
    const tc = TAPETE[m.id], porta = m.warps.find(w => w.to === 'town' || w.to === 'beach');
    if (tc && porta) ents.push({ y: -996, f: () => { const px = porta.x * T - 8, py = (porta.y - 1) * T + 3; R(px, py, 32, 11, shade(tc, -0.3)); R(px + 1, py + 1, 30, 9, tc); for (let x = px + 3; x < px + 30; x += 4) R(x, py + 1, 1, 9, shade(tc, 0.2)); } });
  }
