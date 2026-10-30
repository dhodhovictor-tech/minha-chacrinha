// ================= Minha Chacrinha fora do Claude: salvamento e "sala" no Firebase =================
// Imita a mesma interface que o jogo usa dentro do Claude (claude.use('db' | 'room' | 'user')),
// então o código do jogo não muda. Os dados ficam em chacrinhas/<código>/... e a presença em salas/<código>/...
(() => {
  const LSK = 'minha-chacrinha-app';
  const ls = { get: k => { try { return localStorage.getItem(LSK + ':' + k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(LSK + ':' + k, v); } catch (e) {} } };
  const MARK = '\u0001';
  // o Realtime Database não guarda listas com buracos nem null: listas viram texto, null apaga o campo.
  // Ele também não aceita . # $ / [ ] em nomes de campo e transforma campos 0,1,2... em lista: esses nomes vão codificados.
  const ek = k => { const e = String(k).replace(/[.#$\/\[\]%]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')); return /^\d+$/.test(e) ? '%_' + e : e; };
  const dk = k => (k.startsWith('%_') ? k.slice(2) : k).replace(/%([0-9A-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
  const enc = v => (typeof v === 'number' && !isFinite(v) ? null : Array.isArray(v) ? MARK + JSON.stringify(v) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => [ek(k), enc(x)])) : v);
  const dec = v => (typeof v === 'string' && v[0] === MARK ? JSON.parse(v.slice(1)) : Array.isArray(v) ? v.map(dec) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [dk(k), dec(x)])) : v);
  function flat(obj, pre, out) {
    for (const [k, v] of Object.entries(obj)) {
      if (v === undefined) continue;
      if (v && typeof v === 'object' && !Array.isArray(v)) { if (Object.keys(v).length) flat(v, pre + ek(k) + '/', out); }
      else out[pre + ek(k)] = v === null ? null : enc(v);
    }
    return out;
  }
  const dpath = p => p.split('/').map(ek).join('/');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  async function sha(s) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
  const WORDS = ['darth', 'girassol', 'abobora', 'galinha', 'colmeia', 'pipoca', 'morango', 'cereja', 'trufa', 'pastinaca', 'jujuba', 'cocada', 'canjica', 'mimosa', 'estrela', 'paçoca'];
  const newCode = () => { const r = crypto.getRandomValues(new Uint32Array(3)); return `${WORDS[r[0] % 16]}-${WORDS[r[1] % 16]}-${1000 + (r[2] % 9000)}`.normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  const cleanCode = s => String(s || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9-]/g, '');

  // tela simples antes do jogo: código da chacrinha e "quem é você"
  function overlay(html) {
    let el = document.getElementById('appgate');
    if (!el) { el = document.createElement('div'); el.id = 'appgate'; el.style.cssText = 'position:fixed;inset:0;z-index:100;display:grid;place-items:center;background:rgba(20,12,24,0.92);padding:16px;font-family:"Pixelify Sans",monospace'; document.body.appendChild(el); }
    el.innerHTML = `<div class="win frame" style="max-width:440px;width:100%;display:grid;gap:10px;padding:16px">${html}</div>`;
    el.hidden = false;
    return el;
  }
  const closeOverlay = () => { const el = document.getElementById('appgate'); if (el) el.remove(); };

  let readyP = null;
  function ready() { return readyP || (readyP = start()); }
  async function start() {
    const cfg = window.FIREBASE_CONFIG;
    if (!cfg || !window.firebase) throw new Error('sem configuração do Firebase');
    firebase.initializeApp(cfg);
    const fdb = firebase.database();
    if (cfg.emulator) fdb.useEmulator(cfg.emulator.host, cfg.emulator.port);
    // 1) código da chacrinha
    let code = cleanCode((location.hash.match(/c=([^&]+)/) || [])[1] ? decodeURIComponent(location.hash.match(/c=([^&]+)/)[1]) : '') || ls.get('code');
    while (!code) {
      code = await new Promise(res => {
        const el = overlay(`<h2>Minha Chacrinha</h2><p style="text-align:center">Digite o código da chacrinha de vocês. Quem tem o código entra na mesma chacrinha.</p>
          <input id="gcode" type="text" autocomplete="off" autocapitalize="off" placeholder="ex.: darth-girassol-1234" style="font-family:inherit;font-size:18px;padding:8px 10px;border:2px solid #6b3410;border-radius:6px">
          <div class="row"><button class="btn g" id="gok" type="button">Entrar</button></div>
          <p style="text-align:center;font-size:13px">Ainda não têm uma? <button class="btn" id="gnew" type="button">Criar chacrinha nova</button></p>`);
        el.querySelector('#gok').onclick = () => res(cleanCode(el.querySelector('#gcode').value));
        el.querySelector('#gnew').onclick = () => { const c = newCode(); overlay(`<h2>Chacrinha nova!</h2><p style="text-align:center">O código de vocês é:</p><p class="big" style="text-align:center;font-size:22px"><b>${c}</b></p><p style="text-align:center;font-size:13px">Anote e mande para a outra pessoa. Ela digita esse código para entrar na mesma chacrinha.</p><div class="row"><button class="btn g" id="gc" type="button">Combinado</button></div>`).querySelector('#gc').onclick = () => res(c); };
      });
    }
    ls.set('code', code);
    window.__chacrinhaApp = { code };
    const base = 'chacrinhas/' + code + '/';
    // 2) progresso trazido da versão do Claude (só para o código certo, que não fica escrito no app)
    try {
      const seed = window.CHACRINHA_SEED;
      if (seed && seed.codeHash === await sha(code)) {
        const has = (await fdb.ref(base + 'world/meta').get()).exists();
        if (!has) { const up = {}; for (const [p, d] of Object.entries(seed.docs)) up[base + dpath(p)] = enc(d); await fdb.ref().update(up); }
      }
    } catch (e) { console.warn('seed', e); }
    // 3) quem é você nesta chacrinha
    let uid = ls.get('uid:' + code);
    if (!uid) {
      const ps = dec((await fdb.ref(base + 'players').get()).val() || {});
      window.__chacrinhaApp.players = ps;
      uid = await new Promise(res => {
        const list = Object.entries(ps).filter(([, p]) => p && p.name);
        const el = overlay(`<h2>Quem é você?</h2><p style="text-align:center">${list.length ? 'Escolha o seu personagem nesta chacrinha:' : 'Ninguém entrou nesta chacrinha ainda.'}</p>
          <div class="row" style="flex-wrap:wrap">${list.map(([id, p]) => `<button class="btn g" data-u="${esc(id)}" type="button">Sou ${esc(p.name)}</button>`).join('')}</div>
          <div class="row"><button class="btn" data-u="" type="button">${list.length ? 'Sou uma pessoa nova aqui' : 'Criar meu personagem'}</button></div>`);
        el.querySelectorAll('[data-u]').forEach(b => (b.onclick = () => res(b.dataset.u || 'p' + crypto.getRandomValues(new Uint32Array(2)).join(''))));
      });
      ls.set('uid:' + code, uid);
    }
    closeOverlay();
    // ---------- banco ----------
    const snap = (id, s) => ({ id, exists: s.exists(), data: () => (s.exists() ? dec(s.val()) : undefined), metadata: { fromCache: false, hasPendingWrites: false } });
    const db = {
      doc: p => {
        const ref = fdb.ref(base + dpath(p)), id = p.split('/').pop();
        return {
          id, path: p,
          get: async () => snap(id, await ref.get()),
          set: async d => { await ref.set(enc(d)); },
          update: async d => { const up = flat(d, '', {}); if (Object.keys(up).length) await ref.update(up); },
          onSnapshot(fn, err) { const cb = s => fn(snap(id, s)); ref.on('value', cb, e => err && err({ code: 'unavailable', message: e.message })); return () => ref.off('value', cb); },
        };
      },
      collection: c => {
        const ref = fdb.ref(base + c);
        return { onSnapshot(fn, err) { const cb = s => { const v = s.val() || {}; const docs = Object.keys(v).map(k => ({ id: dk(k), exists: true, data: () => dec(v[k]), metadata: { fromCache: false } })); fn({ docs, size: docs.length, empty: !docs.length, metadata: { fromCache: false } }); }; ref.on('value', cb, e => err && err({ code: 'unavailable', message: e.message })); return () => ref.off('value', cb); } };
      },
    };
    // ---------- sala: quem está jogando agora e mensagens rápidas ----------
    const peerId = 'k' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const sala = 'salas/' + code + '/', peersRef = fdb.ref(sala + 'peers'), meRef = peersRef.child(peerId), evRef = fdb.ref(sala + 'ev');
    meRef.onDisconnect().remove();
    const parse = s => { try { return JSON.parse(s); } catch (e) { return null; } };
    const topics = {};
    let evOn = false;
    function listenEvents() {
      if (evOn) return; evOn = true;
      evRef.get().then(s => {
        const old = new Set(Object.keys(s.val() || {}));
        const cut = Date.now() - 60000;
        for (const [k, v] of Object.entries(s.val() || {})) if ((v.t || 0) < cut) evRef.child(k).remove().catch(() => {});
        evRef.on('child_added', c => {
          if (old.has(c.key)) return;
          const v = c.val() || {};
          for (const fn of topics[v.topic] || []) try { fn({ data: parse(v.d), by: v.by, peer: v.peer, sameTab: v.peer === peerId, isMe: v.by === uid }); } catch (e) { console.error(e); }
        });
      });
    }
    const room = {
      presence: async pr => { await meRef.set({ uid, p: JSON.stringify(pr) }); },
      onPeers(fn, err) {
        peersRef.on('value', s => {
          const v = s.val() || {};
          fn({ peers: Object.entries(v).map(([peer, x]) => ({ peer, presence: parse(x.p), kind: 'viewer', isMe: peer === peerId, sameTab: peer === peerId, by: x.uid, guest: false })) });
        }, e => err && err({ code: 'unavailable', message: e.message }));
      },
      emit: async (topic, data) => { const r = evRef.push(); await r.set({ topic, d: JSON.stringify(data), by: uid, peer: peerId, t: Date.now() }); setTimeout(() => r.remove().catch(() => {}), 15000); },
      on(topic, fn) { (topics[topic] = topics[topic] || []).push(fn); listenEvents(); return () => {}; },
    };
    const user = { id: async () => uid, me: async () => ({ name: '' }), isOwner: () => false, canEdit: () => true };
    return { db, room, user };
  }
  window.__PRES_DT = 0.2;
  window.claude = { use: name => ready().then(c => c[name] || null) };
  window.__chacrinhaGate = () => ready();
  // trocar de chacrinha ou de personagem (botão no menu do jogo)
  window.__chacrinhaReset = () => { try { Object.keys(localStorage).filter(k => k.startsWith(LSK)).forEach(k => localStorage.removeItem(k)); } catch (e) {} location.hash = ''; location.reload(); };
})();
