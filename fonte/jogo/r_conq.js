
  // ================= conquistas do casal: troféus que valem para os dois (W.meta.ach[id] = dia em que ganharam) =================
  const NORMAL_FISH = () => Object.keys(FISH).filter(k => !FISH[k].legend);
  const ACH = [
    ['venda', 'Primeira venda', 'Vender alguma coisa na caixa de envio.', s => s.shipped > 0],
    ['dezmil', 'Fazendeiros de verdade', 'Juntos, ganhar 10.000 ₲ com a caixa de envio.', s => s.shipped >= 10000],
    ['cemmil', 'Ricos!', 'Juntos, ganhar 100.000 ₲ com a caixa de envio.', s => s.shipped >= 100000],
    ['ouro', 'Colheita de ouro', 'Colher uma planta de qualidade ouro.', s => s.goldCrop],
    ['pesca50', 'Pescadores', 'Juntos, pescar 50 peixes.', s => s.fish >= 50],
    ['todospeixes', 'Mestres da pesca', 'Pescar todos os peixes do vale (sem contar os lendários).', s => NORMAL_FISH().every(k => s.caught.has(k))],
    ['lendas', 'Caçadores de lendas', 'Pescar os 5 peixes lendários.', s => Object.keys(LEGENDS).every(k => s.legends.has(k))],
    ['fundo', 'Até o fundo', 'Chegar ao andar 120 da mina.', s => s.floor >= MINE_BOTTOM],
    ['chefes', 'Heróis da mina', 'Vencer os 4 chefes da mina.', () => Object.keys(BOSSES).every(n => W.meta.bosses && W.meta.bosses[n])],
    ['museu', 'Museu completo', 'Doar todas as peças ao museu.', () => MUSEUM_ITEMS.every(id => W.meta.museum && W.meta.museum[id])],
    ['cc', 'Vila restaurada', 'Completar todas as salas do Centro Comunitário.', () => ccRoomsDone() >= CC_ROOMS.length],
    ['bichos', 'Fazenda cheia', 'Ter 10 animais na chacrinha.', () => Object.keys(farmA()).length >= 10],
    ['obras', 'Construtores', 'Ter 4 construções na chacrinha.', () => Object.keys(farmB()).length >= 4],
    ['estufa', 'Verão o ano todo', 'Construir a estufa.', () => Object.values(farmB()).some(b => b.type === 'greenhouse' && bReady(b))],
    ['casamento', 'Felizes para sempre', 'Casar na chacrinha.', s => s.married],
    ['amizade', 'Melhores amigos', 'Chegar a 10 corações com alguém da vila.', s => s.bestFriend],
    ['festivais', 'Festeiros', 'Participar dos 8 festivais do ano.', () => Object.keys(FESTS).every(k => W.meta.festDone && W.meta.festDone[FESTS[k].id])],
    ['juntos', 'Juntinhos na festa', 'Os dois participarem do mesmo festival.', () => Object.values(W.meta.fest || {}).some(d => Object.keys(d).length >= 2)],
    ['mestre', 'Mestre no ofício', 'Escolher uma profissão de nível 10.', s => s.prof10],
    ['chef', 'Chefs de cozinha', 'Saber 20 receitas.', s => s.recipes >= 20],
  ];
  function achState() {
    const ps = [P, ...Object.values(W.players || {}).filter(p => p && p.uid !== P.uid)], st = { shipped: 0, fish: 0, caught: new Set(), legends: new Set(), floor: 0, goldCrop: false, married: false, bestFriend: false, prof10: false, recipes: 0 };
    for (const p of ps) {
      const s = p.stats || {};
      st.shipped += s.shipped || 0; st.fish += s.fish || 0;
      for (const k of Object.keys(s.caught || {})) st.caught.add(k);
      for (const k of Object.keys((p.flags || {}).lend || {})) st.legends.add(k);
      st.floor = Math.max(st.floor, p.mineFloor || 0);
      st.goldCrop = st.goldCrop || !!s.goldCrop;
      st.married = st.married || !!p.spouse;
      st.bestFriend = st.bestFriend || Object.values(p.rel || {}).some(r => r && r.pts >= 2500);
      st.prof10 = st.prof10 || Object.values(PROFS).some(d => Object.values(d[10]).some(l => l.some(x => (p.prof || []).includes(x[0]))));
      st.recipes = Math.max(st.recipes, (p.recipes || []).length + COOK.filter(r => r.learn === 'start').length);
    }
    return st;
  }
  let achT = 0;
  function checkAch(dt = 99) {
    achT -= dt; if (achT > 0 || !P || !W.meta) return; achT = 5;
    const st = achState(), have = W.meta.ach || {};
    for (const [id, name, , test] of ACH) {
      if (have[id]) continue;
      let okA = false; try { okA = test(st); } catch (e) { okA = false; }
      if (!okA) continue;
      W.meta.ach = { ...(W.meta.ach || {}), [id]: W.meta.day };
      queueUpdate('world/meta', { ach: { [id]: W.meta.day } });
      sfx.level(); toast(`🏆 Conquista do casal: ${name}!`, 'big');
    }
  }
  function achHTML() {
    const have = W.meta.ach || {}, n = ACH.filter(a => have[a[0]]).length;
    return `<p style="text-align:center">Conquistas de vocês dois: <b>${n} de ${ACH.length}</b></p><div class="list">${ACH.map(([id, name, desc]) => `<div class="item" style="${have[id] ? '' : 'opacity:0.55'}"><span style="font-size:22px;filter:${have[id] ? 'none' : 'grayscale(1)'}">🏆</span><span class="nm"><b>${name}</b><small>${desc}${have[id] ? ` · ganhou no dia ${have[id]}` : ''}</small></span></div>`).join('')}</div>`;
  }
