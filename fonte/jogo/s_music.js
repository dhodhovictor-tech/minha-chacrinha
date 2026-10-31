
  // ================= música: trilhas chiptune geradas na hora, uma para cada estação, noite, chuva, casa, mina e festival =================
  const MSCALE = { major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10] };
  const THEMES = {
    spring: { root: 60, scale: 'major', bpm: 100, prog: [0, 3, 4, 0, 5, 3, 1, 4], lead: 'triangle', bass: 'triangle', dens: 0.62, seed: 11, arp: true },
    summer: { root: 62, scale: 'major', bpm: 116, prog: [0, 4, 5, 3, 0, 4, 3, 4], lead: 'square', bass: 'triangle', dens: 0.7, seed: 23, arp: true },
    fall: { root: 57, scale: 'dorian', bpm: 90, prog: [0, 6, 5, 6, 0, 3, 4, 4], lead: 'triangle', bass: 'triangle', dens: 0.55, seed: 37, arp: true },
    winter: { root: 64, scale: 'major', bpm: 74, prog: [0, 5, 3, 4, 0, 5, 1, 4], lead: 'sine', bass: 'sine', dens: 0.4, seed: 41, bell: true },
    night: { root: 53, scale: 'major', bpm: 64, prog: [0, 3, 5, 4], lead: 'sine', bass: 'sine', dens: 0.32, seed: 5, bell: true },
    rain: { root: 57, scale: 'minor', bpm: 70, prog: [0, 5, 3, 6], lead: 'triangle', bass: 'sine', dens: 0.38, seed: 17 },
    house: { root: 58, scale: 'major', bpm: 82, prog: [0, 5, 1, 4], lead: 'triangle', bass: 'sine', dens: 0.48, seed: 7, arp: true },
    mine: { root: 50, scale: 'minor', bpm: 76, prog: [0, 5, 6, 4], lead: 'sine', bass: 'triangle', dens: 0.28, seed: 29, drip: true },
    fest: { root: 65, scale: 'major', bpm: 128, prog: [0, 4, 5, 3], lead: 'square', bass: 'square', dens: 0.82, seed: 53, arp: true },
  };
  const deg2midi = (th, d) => { const sc = MSCALE[th.scale], o = Math.floor(d / sc.length); return th.root + o * 12 + sc[((d % sc.length) + sc.length) % sc.length]; };
  // compõe 8 colcheias por compasso; a segunda metade repete a primeira com o final mudado, para soar como música
  function composeTheme(th) {
    if (th.song) return th.song;
    const r = srand(th.seed * 7717), bars = Math.max(8, th.prog.length * 2), mel = [];
    for (let b = 0; b < bars; b++) {
      const half = bars / 2, src = b >= half && b < bars - 1 ? mel[b - half] : null;
      if (src) { mel.push(src); continue; }
      const ch = th.prog[b % th.prog.length], notes = []; let s = 0;
      while (s < 8) {
        const len = r() < 0.55 ? 1 : r() < 0.7 ? 2 : 3;
        if (r() < th.dens) { const tone = r() < 0.7 ? [0, 2, 4][Math.floor(r() * 3)] : [1, 3, 5][Math.floor(r() * 3)]; notes.push([s, ch + tone + 7, Math.min(len, 8 - s)]); }
        s += len;
      }
      if (b === bars - 1) notes.push([6, ch + 7, 2]);
      mel.push(notes);
    }
    th.song = { bars, mel };
    return th.song;
  }
  let musicOn = (() => { try { return localStorage.getItem('minha-chacrinha-musica') !== '0'; } catch (e) { return true; } })();
  let MG = null, mTheme = null, mNext = 0, mStep = 0, mTimer = null, mWant = null, mNotes = 0;
  function musicNode() {
    if (!AC) return null;
    if (!MG) { MG = AC.createGain(); MG.gain.value = 0; MG.connect(AC.destination); }
    return MG;
  }
  function mNote(time, midi, dur, type, vol, bell) {
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.setValueAtTime(440 * Math.pow(2, (midi - 69) / 12), time);
    g.gain.setValueAtTime(0.0001, time); g.gain.exponentialRampToValueAtTime(vol, time + 0.015);
    g.gain.exponentialRampToValueAtTime(vol * (bell ? 0.25 : 0.6), time + Math.min(dur, 0.25)); g.gain.exponentialRampToValueAtTime(0.0001, time + dur + (bell ? 0.6 : 0.08));
    o.connect(g); g.connect(MG); o.start(time); o.stop(time + dur + (bell ? 0.7 : 0.12));
    mNotes++;
  }
  function mSchedule() {
    if (!AC || !MG || !mTheme) return;
    const th = THEMES[mTheme], song = composeTheme(th), step = 60 / th.bpm / 2;
    if (mNext < AC.currentTime) mNext = AC.currentTime + 0.05;
    while (mNext < AC.currentTime + 0.3) {
      const bar = Math.floor(mStep / 8) % song.bars, s = mStep % 8, ch = th.prog[bar % th.prog.length];
      for (const [ns, d, len] of song.mel[bar]) if (ns === s) mNote(mNext, deg2midi(th, d), len * step * 0.95, th.lead, th.lead === 'square' ? 0.028 : 0.05, th.bell);
      if (s === 0) mNote(mNext, deg2midi(th, ch) - 12, step * 3.6, th.bass, th.bass === 'square' ? 0.022 : 0.055);
      if (s === 4) mNote(mNext, deg2midi(th, ch + 4) - 12, step * 3.6, th.bass, th.bass === 'square' ? 0.018 : 0.045);
      if (th.arp && s % 2 === 1) mNote(mNext, deg2midi(th, ch + [0, 2, 4, 2][(s >> 1) % 4]), step * 0.8, 'triangle', 0.018);
      if (th.drip && Math.random() < 0.06) mNote(mNext, 84 + Math.floor(Math.random() * 10), 0.08, 'sine', 0.03, true);
      mNext += step; mStep++;
    }
  }
  function musicTarget() {
    if (!P || !W.meta) return null;
    const m = curMap();
    if (m.cave || m.id === 'maze') return 'mine';
    if (P.map === 'town' && typeof festOn === 'function' && festOn()) return 'fest';
    if (!m.outdoor) return 'house';
    if (W.meta.rain && !W.meta.snow) return 'rain';
    const t = nowMin();
    if (t >= 1200 || t < 360) return 'night';
    return season();
  }
  let mCheckT = 0;
  // chamado a cada quadro: escolhe a trilha e troca com um fade suave
  function musicUpdate(dt) {
    if (!AC || !musicNode()) return;
    mCheckT -= dt; if (mCheckT > 0) return; mCheckT = 0.5;
    const vol = musicOn && !muted && !document.hidden ? 0.5 : 0, want = vol ? musicTarget() : null, now = AC.currentTime;
    if (!want) { MG.gain.setTargetAtTime(0, now, 0.3); mTheme = null; return; }
    if (want !== mTheme) {
      if (mWant !== want) { mWant = want; MG.gain.setTargetAtTime(0, now, 0.35); mCheckT = 1.2; return; }
      mTheme = want; mStep = 0; mNext = now + 0.1; mWant = null;
    }
    MG.gain.setTargetAtTime(vol, now, 0.6);
    if (!mTimer) mTimer = setInterval(mSchedule, 80);
  }
  function toggleMusic() {
    musicOn = !musicOn;
    try { localStorage.setItem('minha-chacrinha-musica', musicOn ? '1' : '0'); } catch (e) {}
    if (!musicOn && MG && AC) MG.gain.setTargetAtTime(0, AC.currentTime, 0.2);
    mCheckT = 0;
  }
  // trovão nas tempestades
  sfx.thunder = () => { noise(1.6, 0.25, 220); tone(60, 40, 1.2, 'sine', 0.06); };
  // o iPhone pausa o som quando o app sai da tela; volta no próximo toque
  document.addEventListener('visibilitychange', () => { if (!AC) return; if (document.hidden) AC.suspend().catch(() => {}); else AC.resume().catch(() => {}); });
  document.addEventListener('pointerdown', () => { if (AC && AC.state !== 'running') AC.resume().catch(() => {}); }, true);
