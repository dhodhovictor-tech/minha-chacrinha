
  // ================= profissões: no nível 5 e no nível 10 de cada habilidade, uma escolha que muda o jeito de jogar =================
  // a escolha do nível 10 depende da do nível 5; cada pessoa tem as suas (P.prof)
  const PROFS = {
    farming: {
      5: [['lavrador', 'Lavrador', 'Colheitas valem 10% a mais.'], ['pecuarista', 'Pecuarista', 'Ovos, leite, lã e outros produtos dos animais valem 20% a mais.']],
      10: {
        lavrador: [['artesao', 'Artesão', 'Geleias, vinhos, queijos, mel e outros produtos artesanais valem 40% a mais.'], ['agricultor', 'Agricultor', 'Tudo o que você planta fica pronto 10% mais rápido.']],
        pecuarista: [['granjeiro', 'Granjeiro', 'Os animais da chacrinha dão produtos grandes com o dobro de frequência.'], ['amigobichos', 'Amigo dos bichos', 'Carinho nos animais vale o dobro de amizade.']],
      },
    },
    fishing: {
      5: [['pescador', 'Pescador', 'Peixes valem 25% a mais.'], ['paciente', 'Paciente', 'A barra verde da pesca fica 20% maior.']],
      10: {
        pescador: [['mestrepesca', 'Mestre da pesca', 'Peixes valem 50% a mais (em vez de 25%).'], ['pirata', 'Pirata', 'Baús de tesouro aparecem na pesca com o dobro de frequência.']],
        paciente: [['calmo', 'Calmo', 'Os peixes fogem 25% mais devagar no minijogo.'], ['sortudo', 'Sortudo', 'Muito mais peixes de prata e de ouro.']],
      },
    },
    mining: {
      5: [['minerador', 'Minerador', '+1 minério em cada pedra com minério.'], ['geologo', 'Geólogo', 'Pedras com gema dão 2 gemas.']],
      10: {
        minerador: [['ferreiro', 'Ferreiro', 'Barras de metal valem 50% a mais.'], ['prospector', 'Prospector', 'Dobro de carvão na mina.']],
        geologo: [['joalheiro', 'Joalheiro', 'Gemas e minerais valem 30% a mais.'], ['escavador', 'Escavador', 'Geodos aparecem com o dobro de frequência.']],
      },
    },
    foraging: {
      5: [['lenhador', 'Lenhador', 'Árvores derrubadas dão 25% mais madeira.'], ['coletor', 'Coletor', '20% de chance de pegar coletáveis em dobro.']],
      10: {
        lenhador: [['seiveiro', 'Seiveiro', 'Extratores nas árvores ficam prontos na metade do tempo.'], ['mestrelenhador', 'Mestre lenhador', 'O machado derruba árvores com metade dos golpes.']],
        coletor: [['botanico', 'Botânico', 'Coletáveis saem sempre de ouro.'], ['rastreador', 'Rastreador', 'Aparecem mais coletáveis na chacrinha.']],
      },
    },
    combat: {
      5: [['lutador', 'Lutador', '+1 de ataque e +1 de defesa.'], ['batedor', 'Batedor', '15% de chance de golpe crítico (dano em dobro).']],
      10: {
        lutador: [['brutamontes', 'Brutamontes', '+3 de ataque.'], ['defensor', 'Defensor', '+3 de defesa.']],
        batedor: [['desesperado', 'Desesperado', 'Golpes críticos dão o triplo de dano.'], ['ladrao', 'Ladrão', 'Monstros deixam cair o dobro de coisas.']],
      },
    },
  };
  const PROF_INFO = {};
  for (const sk of Object.values(PROFS)) { for (const [id, name, desc] of sk[5]) PROF_INFO[id] = { name, desc }; for (const list of Object.values(sk[10])) for (const [id, name, desc] of list) PROF_INFO[id] = { name, desc }; }
  const hasProf = id => !!(P && P.prof && P.prof.includes(id));
  // efeitos que valem para a chacrinha toda (animais, coletáveis): basta uma das duas pessoas ter
  const anyProf = id => hasProf(id) || Object.values(W.players || {}).some(p => p && p.prof && p.prof.includes(id));
  const isArtisan = (id, it) => it.cat === 'art' || it.kind === 'mel';
  // quanto a profissão de quem vende muda o preço
  function profPrice(id) {
    if (!P || !P.prof || !P.prof.length) return 1;
    const it = item(id);
    if (it.cat === 'fish') return hasProf('mestrepesca') ? 1.5 : hasProf('pescador') ? 1.25 : 1;
    if (CROPS[id] && hasProf('lavrador')) return 1.1;
    if (it.cat === 'animal' && hasProf('pecuarista')) return 1.2;
    if (isArtisan(id, it) && hasProf('artesao')) return 1.4;
    if (it.cat === 'bar' && hasProf('ferreiro')) return 1.5;
    if ((it.cat === 'gem' || it.cat === 'mineral') && hasProf('joalheiro')) return 1.3;
    return 1;
  }
  // a profissão que falta escolher (habilidade e nível), se houver
  function pendingProf() {
    for (const sk of Object.keys(PROFS)) {
      const lv = skillLv(P.skills[sk]), mine = (P.prof || []).filter(id => profSkill(id) === sk);
      if (lv >= 5 && mine.length < 1) return [sk, 5];
      if (lv >= 10 && mine.length < 2) return [sk, 10];
    }
    return null;
  }
  function profSkill(id) { for (const [sk, d] of Object.entries(PROFS)) { if (d[5].some(x => x[0] === id) || Object.values(d[10]).some(l => l.some(x => x[0] === id))) return sk; } return null; }
  function profOptions(sk, lvl) {
    if (lvl === 5) return PROFS[sk][5];
    const first = (P.prof || []).find(id => profSkill(id) === sk && PROFS[sk][10][id]);
    return first ? PROFS[sk][10][first] : [];
  }
  function openProfChoice() {
    const pend = pendingProf(); if (!pend) { closePanel(); return; }
    const [sk, lvl] = pend;
    openPanel(`<h2>${SKILLS[sk]} nível ${lvl}!</h2><p style="text-align:center">Escolha uma profissão. Ela vale para sempre e só para você.</p>
      <div class="list">${profOptions(sk, lvl).map(([id, name, desc]) => `<div class="item"><span class="nm"><b>${name}</b><small>${desc}</small></span><button class="btn g" data-a="profPick" data-p="${id}" type="button">Escolher</button></div>`).join('')}</div>`, 'prof');
  }
  function pickProf(id) {
    const pend = pendingProf(); if (!pend) return;
    if (!profOptions(pend[0], pend[1]).some(x => x[0] === id)) return;
    P.prof = [...(P.prof || []), id]; dirty(); savePlayer(); sfx.level();
    toast(`Agora você é ${PROF_INFO[id].name}! ${PROF_INFO[id].desc}`, 'big');
    if (pendingProf()) openProfChoice(); else closePanel();
  }
  function profsHTML() {
    const mine = (P.prof || []).map(id => `<div class="item"><span class="nm"><b>${PROF_INFO[id].name}</b> <small>${SKILLS[profSkill(id)]} · ${PROF_INFO[id].desc}</small></span></div>`).join('');
    return `<h3>Profissões</h3>${mine ? `<div class="list">${mine}</div>` : '<p style="font-size:13px">No nível 5 e no nível 10 de cada habilidade você escolhe uma profissão.</p>'}${pendingProf() ? '<div class="row"><button class="btn g" data-a="profOpen" type="button">Escolher profissão nova!</button></div>' : ''}`;
  }
  // combate
  const profAtk = () => (hasProf('lutador') ? 1 : 0) + (hasProf('brutamontes') ? 3 : 0);
  const profDef = () => (hasProf('lutador') ? 1 : 0) + (hasProf('defensor') ? 3 : 0);
  const critMul = () => (hasProf('batedor') && Math.random() < 0.15 ? (hasProf('desesperado') ? 3 : 2) : 1);
  // dias da extração com a profissão Seiveiro
  const tapDays = tp => (hasProf('seiveiro') ? Math.max(1, Math.ceil(tp.days / 2)) : tp.days);
