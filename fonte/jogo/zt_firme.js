
  // ================= firmeza: cópias de segurança e caderninho de dicas =================
  // Toda manhã quem vira o dia grava uma cópia em "backup/b0..b2" (os 3 últimos dias).
  // Na aba Chacrinha da mochila dá para baixar uma cópia num arquivo e voltar para uma cópia (automática ou do arquivo).
  async function fotoDoJogo() {
    const players = {}, diarios = {};
    for (const uid of Object.keys(W.players || {})) {
      try { const s = await store.doc('players/' + uid).get(); if (s.exists) players[uid] = s.data(); } catch (e) { if (W.players[uid]) players[uid] = clone(W.players[uid]); }
      try { const d = await store.doc('diary/' + uid).get(); if (d.exists) diarios[uid] = d.data(); } catch (e) {}
    }
    if (P && P.uid) players[P.uid] = playerDoc();
    return { v: 1, at: Date.now(), dia: W.meta.day, nome: farmName(), meta: stripNull(clone(W.meta)), farm: stripNull(clone(W.farm)), clock: clone(W.clock), players, diarios };
  }
  async function salvarBackupAuto(nd) {
    try { const f = await fotoDoJogo(); await store.doc('backup/b' + (nd % 3)).set(f); } catch (e) { console.warn('backup', e); }
  }
  let backups = null;
  async function listarBackups() {
    const out = [];
    for (let i = 0; i < 3; i++) { try { const s = await store.doc('backup/b' + i).get(); if (s.exists) { const d = s.data(); out.push({ i, dia: d.dia, at: d.at }); } } catch (e) {} }
    backups = out.sort((a, b) => b.dia - a.dia);
    if (panelOpen && panelKind === 'backup') abrirBackup();
  }
  function abrirBackup() {
    if (!backups) listarBackups();
    const lista = !backups ? '<p style="text-align:center">Procurando as cópias...</p>' : backups.length ? `<div class="list">${backups.map(b => `<div class="item"><span class="nm"><b>${diaryDate(b.dia)}</b><small>Guardada em ${new Date(b.at).toLocaleString('pt-BR')}</small></span><button class="btn" data-a="bkVoltar" data-i="${b.i}" type="button">Voltar para esta</button></div>`).join('')}</div>` : '<p style="text-align:center">Ainda não tem cópia automática. A primeira é feita quando o próximo dia começar.</p>';
    openPanel(`<h2>Cópia de segurança</h2>
      <p style="text-align:center;font-size:13px">O jogo guarda sozinho uma cópia de tudo a cada manhã (os 3 últimos dias): chacrinha, casa, dinheiro, mochilas, diários. Também dá para baixar uma cópia para o celular.</p>
      <div class="row"><button class="btn g" data-a="bkBaixar" type="button">Baixar cópia agora</button><label class="btn" style="cursor:pointer">Restaurar de um arquivo<input id="bkArq" type="file" accept=".json,application/json" style="display:none"></label></div>
      <h3>Cópias automáticas</h3>${lista}
      <p style="text-align:center;font-size:12px">Antes de voltar para uma cópia, peça para a outra pessoa fechar o jogo. Depois o jogo recarrega sozinho.</p>`, 'backup');
    const inp = document.getElementById('bkArq');
    if (inp) inp.onchange = async () => { const f = inp.files && inp.files[0]; if (!f) return; try { const d = JSON.parse(await f.text()); if (!d || !d.meta || !d.farm) throw new Error('arquivo'); confirmarRestaurar(d); } catch (e) { toast('Esse arquivo não é uma cópia da chacrinha.'); } };
  }
  let bkConfirma = null;
  function confirmarRestaurar(d) {
    bkConfirma = d;
    openPanel(`<h2>Voltar para a cópia?</h2><p style="text-align:center">A chacrinha volta a ficar como estava em <b>${diaryDate(d.dia)}</b>. O que aconteceu depois disso some.</p><div class="row"><button class="btn r" data-a="bkSim" type="button">Sim, voltar</button><button class="btn" data-a="close" type="button">Cancelar</button></div>`, 'backup2');
  }
  async function restaurar(d) {
    try {
      await store.doc('world/meta').set(d.meta); await store.doc('world/farm').set(d.farm); await store.doc('world/clock').set({ ...d.clock, at: Date.now() });
      for (const [uid, pl] of Object.entries(d.players || {})) await store.doc('players/' + uid).set(pl);
      for (const [uid, di] of Object.entries(d.diarios || {})) await store.doc('diary/' + uid).set(di);
      toast('Cópia restaurada! Recarregando...', 'big'); setTimeout(() => location.reload(), 1200);
    } catch (e) { toast('Não deu para restaurar agora. Tente de novo com internet.'); }
  }
  // (síncrona: devolve true/false na hora; o trabalho com o banco segue sozinho)
  function firmeAction(a, b) {
    switch (a) {
      case 'bkAbrir': abrirBackup(); return true;
      case 'bkBaixar': baixarCopia(); return true;
      case 'bkVoltar': store.doc('backup/b' + b.dataset.i).get().then(s => { if (s.exists) confirmarRestaurar(s.data()); }).catch(() => toast('Não deu para abrir a cópia agora.')); return true;
      case 'bkSim': if (bkConfirma) restaurar(bkConfirma); return true;
      case 'dicas': abrirDicas(b.dataset.t); return true;
    }
    return false;
  }
  async function baixarCopia() {
    {
        const f = await fotoDoJogo(), blob = new Blob([JSON.stringify(f)], { type: 'application/json' }), url = URL.createObjectURL(blob), el = document.createElement('a');
        el.href = url; el.download = `chacrinha-dia${f.dia}.json`; document.body.appendChild(el); el.click(); el.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
        toast('Cópia baixada! Guarde o arquivo num lugar seguro.');
    }
  }

  // ---------- caderninho de dicas ----------
  const DICAS = [
    ['Chacrinha', [['Plantar', 'Enxada na terra, semente e regador. A estufa deixa plantar em qualquer estação.'], ['Arrancar uma planta', 'Picareta na planta: o primeiro golpe avisa, o segundo arranca.'], ['Máquinas', 'Toque numa máquina com a mão vazia para mudar de lugar, guardar ou jogar fora.'], ['Moinho', 'Construa com a Rosa. Trigo vira farinha, beterraba vira 3 açúcares, girassol vira óleo, no dia seguinte.'], ['Leite e lã', 'Um balãozinho aparece em cima da vaca, da cabra ou da ovelha quando dá para tirar.'], ['Mato e capim', 'Nascem devagar. A foice no capim vira feno no silo.']]],
    ['Casa', [['Móveis', 'Segure e toque no chão para colocar. Toque no móvel para girar, mover ou guardar.'], ['Sentar', 'Toque no sofá, poltrona ou cadeira. Ande para levantar. Juntinhos, a energia volta mais rápido.'], ['Comer juntos', 'Segure uma comida e toque na mesa. Depois toquem na mesa juntos: rende 50% a mais para os dois.'], ['Guarda-roupa', 'O guarda-roupa e a cômoda guardam roupas, sapatos, anéis e coleiras.'], ['Livro rosa', 'Fica no criado-mudo: as páginas do diário dos dois. Escreva pela mochila, na aba Diário.'], ['Aquário', 'Feito pelo Tonico. Começa com 3 peixes e cresce até 7. Lendários também nadam!'], ['Paredes e piso', 'Com o Tonico. A Rosa amplia a casa.']]],
    ['Vila', [['Cardápio da estação', 'O bar da Lia e a padaria mudam os pratos no dia 1 e no dia 16 de cada estação.'], ['Roupas', 'Ateliê da Bia: coleção da estação (bônus na estação dela), Para ela e Para ele (o ano todo).'], ['Clínica', 'Chuva sem capa dá resfriado, sol forte sem chapéu dá insolação, vespa pica, trabalhar até cansar dá dor nas costas. O Doutor Davi tem remédio.'], ['Floricultura', 'Sementes de flores de todas as estações e enfeites de jardim.'], ['Pet shop', 'Brinquedos do Darth: ele vai sozinho brincar em casa.']]],
    ['Mina e mata', [['Elevador e cabana', 'A mina e a mata guardam uma parada a cada 5 andares/clareiras.'], ['Andares e clareiras especiais', 'Veio rico, infestado, cogumelos, buraco, baú; colmeia, fadas, javalis, acampamento.'], ['Jogando juntos', 'Os bichos e as borboletas são os mesmos para os dois. Quem dá o último golpe ganha o prêmio.'], ['Relógio', 'Na mina e na mata ele fica pequeno. Toque nele para trocar.']]],
    ['Casal', [['Dançar', 'Toque na outra pessoa com a mão vazia: Dançar juntinhos ou beijinho.'], ['Gazebo', 'Sentar juntinhos, dançar, piquenique e ver estrelas.'], ['Estrelas cadentes', 'Em noites de chuva de estrelas, toque em Usar quando uma passar: faça um pedido (a dois vale o dobro).'], ['Cartinhas', 'Na aba Chacrinha da mochila.']]],
  ];
  function abrirDicas(t) {
    const aba = DICAS.find(d => d[0] === t) || DICAS[0];
    openPanel(`<h2>📒 Caderninho de dicas</h2><div class="tabs">${DICAS.map(([n]) => `<button type="button" data-a="dicas" data-t="${n}" class="${n === aba[0] ? 'on' : ''}">${n}</button>`).join('')}</div><div class="list">${aba[1].map(([n, d]) => `<div class="item"><span class="nm"><b>${n}</b><small>${d}</small></span></div>`).join('')}</div>`, 'dicas', aba[0]);
  }
