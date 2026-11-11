  // ================= diário: cada pessoa tem o seu, e só quem escreve lê =================
  // Fica guardado em "diary/<uid>", separado do resto do jogador. Cada página é um dia do jogo ("d37").
  const DIA_SEM = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const diaryDate = d => `${DIA_SEM[(d - 1) % 7]}, ${dom(d)} de ${SEASONS[SEASON_ID.indexOf(season(d))].toLowerCase()} · ano ${year(d)}`;
  const DIARY_STICKERS = ['narciso', 'morango', 'girassol', 'abobora', 'jabuticaba', 'sardinha', 'monarca', 'vagalume', 'petisco', 'cogumelo', 'frutaestelar', 'diamante'];
  let diary = null, diaryState = '', diaryDay = 0, diarySticker = null;

  // o que aconteceu no dia: conta a partir do começo do dia
  const diarySnap = () => { const st = P.stats || {}; return { d: W.meta.day, h: st.harv || 0, f: st.fish || 0, t: st.trees || 0, b: st.bugN || 0, mi: P.mineFloor || 0, ma: st.mata || 0 }; };
  function diaryTick() { if (P && W.meta && P.flags && (!P.flags.ds || P.flags.ds.d !== W.meta.day)) P.flags.ds = diarySnap(); }
  function diarySummary() {
    const a = P.flags.ds || diarySnap(), b = diarySnap(), out = [], dif = k => Math.max(0, (b[k] || 0) - (a[k] || 0));
    const f = festOn && festOn();
    if (f) out.push(`Foi dia de ${f.name}`);
    if (W.meta.rain) out.push(W.meta.snow ? 'Nevou' : W.meta.storm ? 'Teve tempestade' : 'Choveu');
    if (dif('h')) out.push(`colhi ${dif('h')} da horta`);
    if (dif('f')) out.push(`pesquei ${dif('f')} ${dif('f') === 1 ? 'peixe' : 'peixes'}`);
    if (dif('t')) out.push(`derrubei ${dif('t')} ${dif('t') === 1 ? 'árvore' : 'árvores'}`);
    if (dif('b')) out.push(`peguei ${dif('b')} ${dif('b') === 1 ? 'bichinho' : 'bichinhos'} com a rede`);
    if (b.mi > a.mi) out.push(`desci até o andar ${b.mi} da mina`);
    if (b.ma > a.ma) out.push(`cheguei à clareira ${b.ma} da mata`);
    if (!out.length) return '';
    const s = out.join(', ');
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
  }
  async function diaryLoad() {
    if (diary || diaryState === 'loading') return;
    diaryState = 'loading';
    try { const s = await store.doc('diary/' + P.uid).get(); diary = (s.exists && s.data()) || {}; diary.e = diary.e || {}; diaryState = ''; }
    catch (e) { diaryState = 'erro'; }
    if (panelOpen && invTab === 'diario') renderInventory();
  }
  async function diarySave() {
    if (!diary) return;
    const ta = document.getElementById('diarytxt'), txt = ta ? ta.value.trim().slice(0, 1200) : '';
    const d = diaryDay || W.meta.day, key = 'd' + d, old = diary.e[key] || {};
    if (!txt && !diarySticker) { delete diary.e[key]; }
    else diary.e[key] = { t: txt, s: diarySticker || '', r: d === W.meta.day ? diarySummary() : old.r || '', at: Date.now() };
    try { await store.doc('diary/' + P.uid).set(diary); toast('Página guardada no diário.', '', null, 'diario'); sfx.pop(); }
    catch (e) { toast('Não deu para guardar agora. Tente de novo com internet.', '', null, 'diario'); }
    diaryDay = 0; diarySticker = null; window.__diaryDraft = null;
    renderInventory();
  }
  function diaryEdit(d) {
    const e = (diary && diary.e['d' + d]) || {};
    diaryDay = d; diarySticker = e.s || null; window.__diaryDraft = e.t || '';
    renderInventory();
  }
  function diaryHTML() {
    if (!diary) {
      diaryLoad();
      return diaryState === 'erro' ? '<p style="text-align:center">O diário precisa de internet para abrir. Tente de novo daqui a pouco.</p><div class="row"><button class="btn" data-a="diaryRetry" type="button">Tentar de novo</button></div>' : '<p style="text-align:center">Abrindo o diário...</p>';
    }
    const d = diaryDay || W.meta.day, e = diary.e['d' + d] || {}, today = d === W.meta.day;
    if (diarySticker === null && e.s) diarySticker = e.s;
    const sum = today ? diarySummary() : e.r || '';
    const draft = window.__diaryDraft != null ? window.__diaryDraft : e.t || '';
    const stickers = DIARY_STICKERS.filter(id => ITEMS[id]);
    const pages = Object.entries(diary.e).map(([k, v]) => [+k.slice(1), v]).filter(([n]) => n !== d).sort((a, b) => b[0] - a[0]);
    const paper = 'background:#fffaf0;border:2px solid #c8a070;border-radius:8px;padding:10px;margin:8px 0';
    return `<h3 style="text-align:center">Diário de ${esc(P.name)}</h3>
      <p style="text-align:center;font-size:13px">Suas páginas vão para o livro rosa de memórias, em cima do criado-mudo: os dois podem ler.</p>
      <div style="${paper}">
        <b>${diaryDate(d)}${today ? ' · hoje' : ''}</b>
        ${sum ? `<p style="font-size:13px;margin:6px 0;color:#6a4a2a"><i>${esc(sum)}</i></p>` : ''}
        <textarea id="diarytxt" maxlength="1200" rows="6" placeholder="Como foi o dia?" style="width:100%;box-sizing:border-box;font-family:inherit;font-size:16px;padding:8px;border:2px solid #6b3410;border-radius:6px;background:#fffef8">${esc(draft)}</textarea>
        <p style="font-size:13px;margin:6px 0 2px">Carimbo do dia:</p>
        <div class="row" style="flex-wrap:wrap;gap:4px">${stickers.map(id => `<button class="btn ${diarySticker === id ? 'g' : ''}" data-a="diaryStk" data-s="${id}" type="button" style="padding:4px"><img src="${iconURL(id)}" alt="${item(id).name}" style="width:24px;height:24px;image-rendering:pixelated;vertical-align:middle"></button>`).join('')}</div>
        <div class="row"><button class="btn g" data-a="diarySave" type="button">Guardar página</button>${!today ? '<button class="btn" data-a="diaryToday" type="button">Voltar para hoje</button>' : ''}</div>
      </div>
      ${pages.length ? `<h3>Páginas anteriores</h3>${pages.map(([n, v]) => `<div style="${paper}"><div style="display:flex;align-items:center;gap:8px">${v.s && ITEMS[v.s] ? `<img src="${iconURL(v.s)}" alt="" style="width:28px;height:28px;image-rendering:pixelated">` : ''}<b style="flex:1">${diaryDate(n)}</b><button class="btn" data-a="diaryEdit" data-d="${n}" type="button" style="padding:4px 10px">Editar</button></div>${v.r ? `<p style="font-size:13px;margin:6px 0;color:#6a4a2a"><i>${esc(v.r)}</i></p>` : ''}${v.t ? `<p style="white-space:pre-wrap;margin:6px 0">${esc(v.t)}</p>` : ''}</div>`).join('')}` : ''}`;
  }
  // guarda o que está escrito antes de trocar de carimbo, para não perder o texto
  const diaryKeep = () => { const ta = document.getElementById('diarytxt'); if (ta) window.__diaryDraft = ta.value; };
  function diaryAction(a, b) {
    switch (a) {
      case 'diaryStk': diaryKeep(); diarySticker = diarySticker === b.dataset.s ? '' : b.dataset.s; renderInventory(); return true;
      case 'diarySave': diarySave(); return true;
      case 'diaryEdit': diaryEdit(+b.dataset.d); return true;
      case 'diaryToday': diaryDay = 0; diarySticker = null; window.__diaryDraft = null; renderInventory(); return true;
      case 'diaryRetry': diaryState = ''; renderInventory(); return true;
    }
    return false;
  }
