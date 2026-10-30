
  // ================= economia: preços do mercado mudam com a estação, o dia e o quanto se vende =================
  const strHash = s => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; };
  function seasonFactor(id, day) {
    const it = item(id), s = season(day), si = SEASON_ID.indexOf(s);
    const base = it.kind === 'mel' ? 'mel' : it.base || ART_BASE[id] || id;
    let f = 1;
    if (CROPS[base] && !CROPS[base].mix) f = CROPS[base].seasons.includes(s) ? 0.9 : 1.6;
    else if (FTREES[base]) f = FTREES[base].season === s ? 0.9 : 1.5;
    else if (FISH[base]) f = FISH[base].seasons.includes(s) ? 1 : 1.25;
    else if (it.cat === 'forage' && FORAGE[s]) f = FORAGE[s].includes(id) ? 1 : 1.3;
    if (SEASON_PRICE[base]) f *= SEASON_PRICE[base][si];
    if (it.cat === 'art' && base !== id) f = 1 + (f - 1) * 0.6;
    return f;
  }
  function marketFactor(id, day = W.meta ? W.meta.day : 1) {
    const it = item(id);
    if (!it.sell || ['tool', 'place', 'seed', 'sapling', 'gift'].includes(it.cat)) return 1;
    const wob = 1 + (hash(day, strHash(String(id)), 41) - 0.5) * 0.16;
    const sold = (W.meta && W.meta.sold && W.meta.sold[id]) || 0;
    const sat = Math.max(0.6, 1 - sold / 400);
    return seasonFactor(id, day) * wob * sat;
  }
  function marketPrice(id) { const b = basePrice(id); return b ? Math.max(1, Math.round(b * marketFactor(id))) : 0; }
  function trendHTML(id) {
    const f = marketFactor(id), pct = Math.round((f - 1) * 100);
    if (Math.abs(pct) < 3) return '<span class="tr eq">=</span>';
    return `<span class="tr ${pct > 0 ? 'up' : 'dn'}">${pct > 0 ? '▲' : '▼'}${Math.abs(pct)}%</span>`;
  }
  function recordSold(id, n) {
    W.meta.sold = W.meta.sold || {};
    W.meta.sold[id] = Math.round(((W.meta.sold[id] || 0) + n) * 10) / 10;
    queueUpdate('world/meta', { sold: { [id]: W.meta.sold[id] } });
  }
  // de noite o mercado "esquece" um pouco do que foi vendido
  function decaySold() {
    const out = {};
    for (const [k, v] of Object.entries(W.meta.sold || {})) { const nv = Math.floor((v || 0) * 0.6); out[k] = nv >= 1 ? nv : null; }
    return out;
  }
  const seasonIdx = () => SEASON_ID.indexOf(season());
  const wobble = (id, amt = 0.1) => 1 + (hash(W.meta.day, strHash(id), 57) - 0.5) * amt;
  const animalPrice = kind => Math.round(ANIMALS[kind].price * ANIMAL_BUY[seasonIdx()] * wobble('an' + kind, 0.08) / 10) * 10;
  const hayPrice = () => Math.round(50 * HAY_BUY[seasonIdx()] * wobble('feno', 0.1));
  // o que a feira vende hoje: produtos da estação de outros sítios da região (mais caro do que vende)
  function marketStock() {
    const s = season(), d = W.meta.day, list = [];
    for (const [k, c] of Object.entries(CROPS)) if (!c.mix && c.seasons.includes(s) && hash(d, strHash(k), 3) < 0.7) list.push(k);
    for (const [k, f] of Object.entries(FTREES)) if (f.season === s) list.push(k);
    list.push('ovo', 'leite', 'queijo', 'maionese', 'mel', 'carnebovina', 'carnesuina', 'farinha', 'acucar');
    for (const [k, f] of Object.entries(FISH)) if (f.seasons.includes(s) && !f.where.includes('mine') && hash(d, strHash(k), 9) < 0.35) list.push(k);
    return [{ id: 'feno', price: hayPrice() }, ...list.map(id => ({ id, price: Math.max(5, Math.round((COOK_PRICES[id] ? COOK_PRICES[id] / 1.6 : marketPrice(id)) * 1.6)) }))];
  }
  // tabela de preços: o que está em alta e em baixa hoje
  function priceBoard() {
    const pool = [...Object.keys(CROPS).filter(k => !CROPS[k].mix), ...Object.keys(FTREES), ...Object.keys(SEASON_PRICE), 'maionese', 'queijo', 'queijocabra', 'tecido', 'oleotrufa', ...Object.keys(FISH).filter(k => FISH[k].seasons.includes(season())), 'cobre', 'ferro', 'ouro', 'quartzo', 'ametista'];
    const rows = [...new Set(pool)].map(id => [id, marketFactor(id)]).sort((a, b) => b[1] - a[1]);
    const line = ([id]) => `<div class="item"><img src="${iconURL(id)}" alt=""><span class="nm">${item(id).name}<small>normal ${fmt(basePrice(id))} ₲</small></span><span class="price">${fmt(marketPrice(id))} ₲</span>${trendHTML(id)}</div>`;
    return `<p class="speech">${SEASON_NEWS[seasonIdx()]}</p>
      <h3>Em alta hoje</h3><div class="list">${rows.slice(0, 8).map(line).join('')}</div>
      <h3>Em baixa hoje</h3><div class="list">${rows.slice(-8).reverse().map(line).join('')}</div>
      <p style="font-size:12px;text-align:center">Os preços mudam com a estação e um pouco a cada dia. Vender muito da mesma coisa derruba o preço, que volta aos poucos. A caixa de envio paga o preço do dia em que você colocou o item.</p>`;
  }
