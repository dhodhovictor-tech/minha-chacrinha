  // ================= encantamentos: pedras preciosas nas armas (com o Seu Cláudio) =================
  // Cada arma guarda um encanto (s.enc). Encantar de novo troca o anterior.
  const ENCANTOS = {
    quartzo: { name: 'Brilho', gem: 'quartzo', n: 5, gold: 500, col: '#e8f0ff', desc: '+2 de dano.' },
    topazio: { name: 'Ligeireza', gem: 'topazio', n: 3, gold: 1500, col: '#f4c83a', desc: 'Golpes 15% mais rápidos.' },
    ametista: { name: 'Precisão', gem: 'ametista', n: 3, gold: 2000, col: '#b05ae0', desc: '+10% de chance de golpe crítico.' },
    esmeralda: { name: 'Vida', gem: 'esmeralda', n: 2, gold: 3000, col: '#3ad87a', desc: 'Cada bicho atingido devolve 2 de vida.' },
    diamante: { name: 'Fúria', gem: 'diamante', n: 1, gold: 5000, col: '#9ae8ff', desc: '+6 de dano.' },
  };
  // os bichos batem 30% mais forte
  const MON_DMG = 1.3;
  SHOP_INFO.claudio.tabs.splice(SHOP_INFO.claudio.tabs.length - 1, 0, ['enc', 'Encantar']);
  const encDmg = s => (s && s.enc === 'quartzo' ? 2 : s && s.enc === 'diamante' ? 6 : 0);
  const encCrit = s => (s && s.enc === 'ametista' ? 0.1 : 0);
  const encSpeed = s => (s && s.enc === 'topazio' ? 0.85 : 1);
  const encName = s => (s && s.enc && ENCANTOS[s.enc] ? ENCANTOS[s.enc].name : '');
  function encHTML() {
    const ws = P.inv.map((s, i) => [s, i]).filter(([s]) => s && WEAPONS[s.id]);
    if (!ws.length) return '<p style="text-align:center">Traga uma arma na mochila para encantar.</p>';
    return `<p style="text-align:center;font-size:13px">“Uma pedra preciosa bem colocada desperta a lâmina.” Cada arma guarda um encanto; encantar de novo troca o anterior.</p>
      ${ws.map(([s, i]) => `<div class="item" style="flex-direction:column;align-items:stretch">
        <div style="display:flex;align-items:center;gap:8px"><img src="${iconURL(s.id, s.lv)}" alt=""><span class="nm"><b>${toolName(s.id, s.lv)}</b><small>${s.enc ? `Encanto atual: <b style="color:#6a2a8a">${encName(s)}</b> · ${ENCANTOS[s.enc].desc}` : 'Sem encanto'}</small></span></div>
        <div class="list">${Object.entries(ENCANTOS).map(([k, e]) => { const can = count(e.gem) >= e.n && gold() >= e.gold, cur = s.enc === k; return `<div class="item"><img src="${iconURL(e.gem)}" alt=""><span class="nm"><b>${e.name}</b> <span style="display:inline-block;width:9px;height:9px;transform:rotate(45deg);background:${e.col};border:1px solid #3a1a0a"></span><small>${e.desc} · ${e.n} ${item(e.gem).name.toLowerCase()} (${count(e.gem)}) + ${fmt(e.gold)} ₲</small></span>${cur ? '<small>Já tem</small>' : `<button class="btn g" data-a="encApply" data-i="${i}" data-e="${k}" type="button" ${can ? '' : 'disabled'}>Encantar</button>`}</div>`; }).join('')}</div>
      </div>`).join('')}`;
  }
  function encApply(i, k) {
    const s = P.inv[i], e = ENCANTOS[k];
    if (!s || !WEAPONS[s.id] || !e || count(e.gem) < e.n || !spend(e.gold)) return;
    removeItem(e.gem, e.n); s.enc = k; dirty(); renderHotbar(); sfx.level();
    toast(`${toolName(s.id, s.lv)} encantada com ${e.name}! ${e.desc}`, 'big', null, 'encanto');
    renderShop(panelArg);
  }
  function encAction(a, b) { if (a === 'encApply') { encApply(+b.dataset.i, b.dataset.e); return true; } return false; }
