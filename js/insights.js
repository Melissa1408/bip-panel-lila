// Análisis de lo que ella cuenta: temas, dificultades, herramientas, tecnicismos y "a quién le llega".
// Todo se calcula en el navegador a partir de p.analisis (que la IA devuelve al generar cada post). Sin librerías.
(function () {
  const OBJETIVOS = ['Educar', 'Mostrar proceso', 'Generar debate', 'Atraer oportunidades', 'Construir credibilidad'];
  // Paleta categórica validada (colorblind-safe en pares adyacentes). El orden es fijo: el color sigue al público, no a su posición en el ranking.
  const PALETA = ['#6250d6', '#e87ba4', '#2a78d6', '#eb6834', '#1baf7a', '#8a8f98'];

  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const clean = (arr, max) => { const seen = new Set(); return (Array.isArray(arr) ? arr : []).map((x) => String(x || '').trim().slice(0, 60)).filter((x) => { const k = norm(x); if (!k || seen.has(k)) return false; seen.add(k); return true; }).slice(0, max); };

  // Normaliza el análisis que devuelve la IA: pesos que suman 100 y solo públicos que existen.
  function normalizeAnalisis(a, audiences, fuente) {
    a = a || {};
    const names = audiences.map((x) => x.nombre);
    let av = (Array.isArray(a.avatares) ? a.avatares : []).map((x) => {
      const hit = names.find((n) => norm(n) === norm(x && x.nombre));
      return hit ? { nombre: hit, peso: Math.max(0, Number(x.peso) || 0) } : null;
    }).filter(Boolean);
    const sum = av.reduce((t, x) => t + x.peso, 0);
    av = sum > 0 ? av.map((x) => ({ nombre: x.nombre, peso: Math.round((x.peso / sum) * 1000) / 10 })) : [];
    return {
      objetivo: OBJETIVOS.find((o) => norm(o) === norm(a.objetivo)) || '',
      temas: clean(a.temas, 3), dificultades: clean(a.dificultades, 3), herramientas: clean(a.herramientas, 6), tecnicismos: clean(a.tecnicismos, 6),
      avatares: av, fuente: fuente || 'ia'
    };
  }

  // Cuenta apariciones por campo; agrupa variantes de escritura (mayúsculas/acentos) y muestra la forma más usada.
  function ranking(posts, campo) {
    const map = new Map();
    posts.forEach((p) => {
      const seen = new Set();
      ((p.analisis && p.analisis[campo]) || []).forEach((t) => {
        const k = norm(t); if (!k || seen.has(k)) return; seen.add(k);
        const e = map.get(k) || { n: 0, formas: {} }; e.n++; e.formas[t] = (e.formas[t] || 0) + 1; map.set(k, e);
      });
    });
    return [...map.values()].map((e) => ({ nombre: Object.entries(e.formas).sort((a, b) => b[1] - a[1])[0][0], n: e.n })).sort((a, b) => b.n - a.n || a.nombre.localeCompare(b.nombre));
  }
  const objetivos = (posts) => OBJETIVOS.map((o) => ({ nombre: o, n: posts.filter((p) => p.analisis && p.analisis.objetivo === o).length })).filter((x) => x.n);
  const analizados = (posts) => posts.filter((p) => p.analisis && (p.analisis.avatares || []).length);

  // Promedio de pesos por público sobre un conjunto de posts → % (suman 100)
  function shares(posts, audiences) {
    const base = analizados(posts);
    const tot = audiences.map((a) => ({ nombre: a.nombre, pct: 0 }));
    if (!base.length) return { n: 0, items: tot };
    base.forEach((p) => p.analisis.avatares.forEach((x) => { const t = tot.find((y) => y.nombre === x.nombre); if (t) t.pct += x.peso; }));
    const sum = tot.reduce((s, x) => s + x.pct, 0) || 1;
    return { n: base.length, items: tot.map((x) => ({ nombre: x.nombre, pct: Math.round((x.pct / sum) * 1000) / 10 })) };
  }

  // Barra apilada 100% (una fila) en HTML/CSS: así el texto conserva su tamaño en cualquier pantalla.
  // 2px de separación entre segmentos, extremos redondeados, y cada segmento lleva su tooltip (title).
  function stackedBar(items, audiences, label) {
    const vis = items.filter((i) => i.pct > 0);
    const segs = vis.map((i) => {
      const idx = audiences.findIndex((a) => a.nombre === i.nombre), col = PALETA[Math.min(idx < 0 ? PALETA.length - 1 : idx, PALETA.length - 1)];
      return `<div class="seg" style="flex:${i.pct} 1 0;background:${col}" title="${esc(i.nombre)}: ${i.pct}%"><span>${Math.round(i.pct)}%</span></div>`;
    });
    return `<div class="stackbar" role="img" aria-label="${esc(label)}">${segs.join('') || '<div class="seg empty"></div>'}</div>`;
  }

  // Lista de barras horizontales (magnitud, un solo tono violeta)
  function barList(rows, total) {
    if (!rows.length) return '<p class="muted">Todavía no hay datos. Genera posts o pulsa <em>Analizar mis posts</em>.</p>';
    const max = Math.max(...rows.map((r) => r.n));
    return '<ul class="bars">' + rows.slice(0, 8).map((r) => `<li title="${esc(r.nombre)}: en ${r.n} de ${total} posts"><span class="bn">${esc(r.nombre)}</span><span class="bt"><i style="width:${Math.max(6, (r.n / max) * 100)}%"></i></span><span class="bv">${r.n}</span></li>`).join('') + '</ul>';
  }

  window.INS = { OBJETIVOS, PALETA, norm, normalizeAnalisis, ranking, objetivos, analizados, shares, stackedBar, barList, esc };
})();
