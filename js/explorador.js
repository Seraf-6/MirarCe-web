/* ===========================================================
   MirarCE — Explorador de datos (2024 + 2025)
   Flujo: insights en carrusel -> ranking interactivo -> detalle
   Fuente: window.MIRARCE_YEARS (js/data-years.js)
   =========================================================== */
(function () {
  const YEARS = window.MIRARCE_YEARS;
  const PALETTE = ['#003E56', '#F36F60', '#60C8D3', '#FFC53D', '#9BD4A6', '#C9A0DC', '#10242E'];
  const UNICOLOR = {
    'UNIVERSIDAD NACIONAL DE ASUNCIÓN': '#003E56',
    'UNIVERSIDAD NACIONAL DEL ESTE': '#60C8D3',
    'UNIVERSIDAD CATÓLICA NUESTRA SEÑORA DE LA ASUNCIÓN': '#F36F60',
    'UNIVERSIDAD CATÓLICA DE ASUNCIÓN': '#F36F60',
    'UNIVERSIDAD DEL CONO SUR DE LAS AMÉRICAS': '#9BD4A6',
    'UNIVERSIDAD AUTÓNOMA DE ASUNCIÓN': '#C9A0DC',
    'UNIVERSIDAD AMERICANA': '#FFC53D'
  };
  const state = { year: '2025', uni: 'Todas', sort: 'total' };

  const D = () => YEARS[state.year];
  const colorEje = (i) => PALETTE[i % PALETTE.length];
  const colorUni = (u) => UNICOLOR[u] || '#888';
  const labelOf = (c) => (c.ce && c.ce.length ? c.ce : c.facultad);
  const ejeNum = (c, i) => (typeof c.etapas[i] === 'number' ? c.etapas[i] : null);
  const ejeVal = (c, i) => (typeof c.etapas[i] === 'number' ? c.etapas[i] : 0);
  const hasGap = (c) => c.etapas.some(v => v === null || v === undefined);
  const pct = (c) => Math.round((c.total / D().total_max) * 100);
  const shortUni = (u) => u
    .replace('UNIVERSIDAD NACIONAL DE ASUNCIÓN', 'UNA')
    .replace('UNIVERSIDAD NACIONAL DEL ESTE', 'UNE')
    .replace('UNIVERSIDAD CATÓLICA NUESTRA SEÑORA DE LA ASUNCIÓN', 'UC')
    .replace('UNIVERSIDAD CATÓLICA DE ASUNCIÓN', 'UC')
    .replace('UNIVERSIDAD DEL CONO SUR DE LAS AMÉRICAS', 'UCSA')
    .replace('UNIVERSIDAD AUTÓNOMA DE ASUNCIÓN', 'UAA')
    .replace('UNIVERSIDAD AMERICANA', 'Americana');
  const acroOf = (c) => {
    const src = c.ce || '';
    const paren = src.match(/\(([^)]+)\)\s*$/);
    if (paren) return paren[1];
    const caps = src.match(/\b[A-Z]{3,}\b/g);
    if (caps) return caps[caps.length - 1];
    const skip = new Set(['de','del','la','las','los','el','y','e','en','un','una']);
    const words = src.split(/\s+/).filter(w => w.length > 3 && !skip.has(w.toLowerCase()));
    return words.length ? words[words.length - 1] : shortUni(c.institucion);
  };

  /* ===========================================================
     1) CARRUSEL DE INSIGHTS
     =========================================================== */
  function genderSplit(year) {
    const cs = YEARS[year].centros; const f = cs.filter(c => c.genero === 'F').length;
    return { f, n: cs.length, pf: Math.round(f / cs.length * 100) };
  }
  function uniAverages(year) {
    const D0 = YEARS[year]; const by = {};
    D0.centros.forEach(c => { (by[c.institucion] = by[c.institucion] || []).push(c.total / D0.total_max * 100); });
    return Object.entries(by).map(([u, v]) => ({ u: shortUni(u), avg: Math.round(v.reduce((a, b) => a + b, 0) / v.length), n: v.length }))
      .sort((a, b) => b.avg - a.avg);
  }

  function slideFachada() {
    const crit = YEARS['2024'].criterios.slice();
    const vis = crit.slice().sort((a, b) => b.pct - a.pct).slice(0, 4);
    const sus = crit.slice().sort((a, b) => a.pct - b.pct).slice(0, 4);
    const col = (title, sub, arr, color) => `<div class="ins-col"><div class="ins-colh">${title}</div><div class="ins-cols">${sub}</div>
      ${arr.map(c => `<div class="ins-bar"><div class="ins-bt"><span>${c.label}</span><b style="color:${color}">${c.pct}%</b></div>
        <div class="ins-tr"><div class="ins-fl" style="width:${c.pct}%;background:${color}"></div></div></div>`).join('')}</div>`;
    return `<div class="ins-eyebrow">La historia detrás del puntaje · 2024</div>
      <h3 class="ins-title">La fachada es fácil. La sustancia, rara.</h3>
      <div class="ins-2col">${col('La fachada', 'lo que casi todos tienen', vis, '#1D9E75')}${col('La sustancia', 'lo que casi nadie cumple', sus, '#F36F60')}</div>`;
  }
  function slideCompetencia() {
    const c = YEARS['2024'].criterios;
    const lista = c.find(x => x.n === 4).pct, rend = c.find(x => x.n === 13).pct;
    return `<div class="ins-eyebrow">Quién compite de verdad · 2024</div>
      <h3 class="ins-title">La mayoría gana sin rival</h3>
      <div class="ins-stats">
        <div class="ins-stat"><div class="ins-num">${lista}<small>%</small></div><div class="ins-lbl">tuvo más de una lista compitiendo en sus elecciones</div></div>
        <div class="ins-stat"><div class="ins-num">${rend}<small>%</small></div><div class="ins-lbl">rindió cuentas de sus gastos de campaña</div></div>
      </div>
      <p class="ins-foot">La marca de una elección sana es que haya con quién competir. En 2024, casi nunca lo hubo.</p>`;
  }
  function slideGenero() {
    const g24 = genderSplit('2024'), g25 = genderSplit('2025');
    const bar = (g, y) => `<div class="gn-row"><div class="gn-year">${y}</div>
      <div class="gn-bar"><div class="gn-f" style="width:${g.pf}%">${g.pf}% mujeres</div></div>
      <div class="gn-meta">${g.f} de ${g.n}</div></div>`;
    return `<div class="ins-eyebrow">Quién lidera</div>
      <h3 class="ins-title">Cada vez más mujeres al frente</h3>
      <div class="ins-gender">${bar(g24, '2024')}${bar(g25, '2025')}</div>
      <p class="ins-foot">La proporción de centros presididos por mujeres creció entre los dos relevamientos.</p>`;
  }
  function slideBrecha() {
    const a = uniAverages('2025');
    const top = a[0], bottom = a[a.length - 1];
    const gap = top.avg - bottom.avg;
    return `<div class="ins-eyebrow">La brecha institucional · 2025</div>
      <h3 class="ins-title">No todas cuidan igual su democracia</h3>
      <p class="ins-sub">Promedio de calidad democrática de los centros de cada universidad. Entre la primera y la última hay ${gap} puntos de diferencia: dónde estudiás influye en qué tan democrático es tu centro.</p>
      <div class="ins-uni">${a.map(r => `<div class="uv-group"><div class="uv-name">${r.u} <small>(${r.n} ${r.n === 1 ? 'centro' : 'centros'})</small></div>
        <div class="uv-bar"><div class="uv-fill" style="width:${r.avg}%"></div><span class="uv-num">${r.avg}%</span></div></div>`).join('')}</div>
      <p class="ins-foot">Las universidades con más centros medidos (UNA, UNE) sostienen promedios altos; las de muestra chica (Americana, UAA: 1–2 centros) son todavía preliminares.</p>`;
  }

  function buildCarousel() {
    const track = document.getElementById('car-track');
    const dotsWrap = document.getElementById('car-dots');
    if (!track) return;
    const slides = [slideFachada(), slideCompetencia(), slideGenero()];
    track.innerHTML = slides.map(s => `<div class="car-slide"><div class="car-card">${s}</div></div>`).join('');
    dotsWrap.innerHTML = slides.map((_, i) => `<button class="car-dot${i === 0 ? ' on' : ''}" data-i="${i}" aria-label="Insight ${i + 1}"></button>`).join('');
    let idx = 0; const n = slides.length;
    const view = document.querySelector('#insights .car-view');
    const setH = () => { const s = track.children[idx]; if (s && view) view.style.height = s.offsetHeight + 'px'; };
    const go = (i) => {
      idx = (i + n) % n;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dotsWrap.querySelectorAll('.car-dot').forEach((d, k) => d.classList.toggle('on', k === idx));
      setH();
    };
    setH();
    setTimeout(setH, 400);            // re-medir tras cargar fuentes
    window.addEventListener('load', setH);
    window.addEventListener('resize', setH);
    let timer = setInterval(() => go(idx + 1), 7000);
    const reset = () => { clearInterval(timer); timer = setInterval(() => go(idx + 1), 7000); };
    document.getElementById('car-prev').addEventListener('click', () => { go(idx - 1); reset(); });
    document.getElementById('car-next').addEventListener('click', () => { go(idx + 1); reset(); });
    dotsWrap.querySelectorAll('.car-dot').forEach(d => d.addEventListener('click', () => { go(+d.dataset.i); reset(); }));
    const car = document.getElementById('insights');
    car.addEventListener('mouseenter', () => clearInterval(timer));
    car.addEventListener('mouseleave', reset);
    let tx = 0;
    const carView = document.querySelector('#insights .car-view');
    carView.addEventListener('touchstart', (e) => { clearInterval(timer); tx = e.touches[0].clientX; }, { passive: true });
    carView.addEventListener('touchend', (e) => {
      const dx = tx - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 50) go(dx > 0 ? idx + 1 : idx - 1);
      timer = setInterval(() => go(idx + 1), 7000);
    }, { passive: true });
  }

  /* ===========================================================
     2) CONTROLES
     =========================================================== */
  const yearWrap = document.getElementById('year-switch');
  function buildYearSwitch() {
    yearWrap.innerHTML = '';
    ['2024', '2025'].forEach(y => {
      const b = document.createElement('button');
      b.className = 'yr' + (y === state.year ? ' active' : '');
      b.textContent = y;
      b.addEventListener('click', () => {
        if (state.year === y) return;
        state.year = y; state.uni = 'Todas';
        yearWrap.querySelectorAll('.yr').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        buildUniFilters(); updateYearCopy(); render();
      });
      yearWrap.appendChild(b);
    });
  }
  const uniWrap = document.getElementById('uni-filters');
  function buildUniFilters() {
    const unis = ['Todas', ...Array.from(new Set(D().centros.map(c => c.institucion)))];
    uniWrap.innerHTML = '';
    unis.forEach((u) => {
      const b = document.createElement('button');
      b.className = 'chip' + (u === state.uni ? ' active' : '');
      b.textContent = shortUni(u); b.title = u;
      b.addEventListener('click', () => {
        state.uni = u;
        uniWrap.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
        b.classList.add('active'); render();
      });
      uniWrap.appendChild(b);
    });
  }
  document.querySelectorAll('.controls [data-sort]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.sort = btn.dataset.sort;
      document.querySelectorAll('.controls [data-sort]').forEach(x => x.classList.remove('active'));
      btn.classList.add('active'); render();
    });
  });
  function buildLegend() {
    const legend = document.getElementById('legend');
    legend.innerHTML = '';
    D().ejes.forEach((name, i) => {
      const s = document.createElement('span');
      s.className = 'leg-item';
      s.innerHTML = `<i style="background:${colorEje(i)}"></i>${name} <b>·${D().eje_max[i]}</b>`;
      legend.appendChild(s);
    });
  }

  /* ===========================================================
     3) RANKING
     =========================================================== */
  const chart = document.getElementById('chart');
  const legendBox = document.getElementById('legend');
  function currentList() {
    let list = D().centros.slice();
    if (state.uni !== 'Todas') list = list.filter(c => c.institucion === state.uni);
    if (state.sort === 'alpha') list.sort((a, b) => labelOf(a).localeCompare(labelOf(b), 'es'));
    else list.sort((a, b) => b.total - a.total);
    return list;
  }
  function render() {
    const sc = document.getElementById('scale-note');
    if (sc) sc.textContent = state.uni === 'Todas'
      ? 'sobre ' + D().total_max + ' · tocá un centro para ver su detalle'
      : 'columnas apiladas por eje · ' + shortUni(state.uni);
    if (state.uni === 'Todas') { legendBox.style.display = 'none'; renderDots(); }
    else { legendBox.style.display = 'flex'; renderColumns(); }
  }

  function renderDots() {
    const list = currentList();
    chart.className = 'chart chart--dots';
    const grid = `<div class="dot-grid"><span style="left:0%"></span><span style="left:25%"></span><span style="left:50%"></span><span style="left:75%"></span><span style="left:100%"></span></div>`;
    const axis = `<div class="dot-axis"><span style="left:0%">0</span><span style="left:25%">25</span><span style="left:50%">50</span><span style="left:75%">75</span><span style="left:100%">100%</span></div>`;
    let rows = '';
    list.forEach((c, idx) => {
      const champ = (idx === 0 && state.sort === 'total') ? '<span class="dot-champ" aria-hidden="true"></span>' : '';
      const gap = hasGap(c) ? ' <span class="inc" title="Datos incompletos">∗</span>' : '';
      rows += `<div class="dot-row" data-idx="${idx}">
        <div class="dot-label"><span class="label-full">${labelOf(c)}${gap}</span><span class="label-short">${acroOf(c)}${gap}</span><small>${shortUni(c.institucion)}</small></div>
        <div class="dot-track">
          <div class="dot-fill" data-w="${pct(c)}" style="background:${colorUni(c.institucion)}"></div>
          <span class="dot-mark" data-x="${pct(c)}" style="background:${colorUni(c.institucion)}">${champ}</span>
        </div>
        <div class="dot-val">${pct(c)}<small>%</small></div></div>`;
    });
    chart.innerHTML = `<div class="dot-head"><span class="dot-label"></span><div class="dot-track">${axis}</div><span></span></div>
      <div class="dot-body">${grid}${rows}</div>`;
    const rowsEl = chart.querySelectorAll('.dot-row');
    rowsEl.forEach((r, k) => {
      r.addEventListener('click', () => openDrawer(list[+r.dataset.idx]));
      setTimeout(() => {
        r.querySelector('.dot-fill').style.width = r.querySelector('.dot-fill').dataset.w + '%';
        r.querySelector('.dot-mark').style.left = r.querySelector('.dot-mark').dataset.x + '%';
        r.classList.add('in');
      }, k * 26);
    });
  }

  function renderColumns() {
    const D0 = D(); const list = currentList();
    chart.className = 'chart chart--cols';
    const grid = [100, 75, 50, 25, 0].map(v => `<div class="gl" style="bottom:${v}%"><span>${v}${v === 100 ? '%' : ''}</span></div>`).join('');
    const bars = list.map(c => {
      const barH = (c.total / D0.total_max) * 100;            // altura de la barra = puntaje del centro
      const segs = D0.ejes.map((_, i) => {
        const segH = c.total > 0 ? (ejeVal(c, i) / c.total) * 100 : 0; // proporción dentro de la barra
        return `<div class="col-seg" data-h="${segH}" style="background:${colorEje(i)}" title="${D0.ejes[i]}: ${ejeVal(c, i)}/${D0.eje_max[i]}"></div>`;
      }).join('');
      return `<div class="colc" data-ce="${labelOf(c)}"><div class="col-track"></div><div class="col-bar" data-h="${barH}">${segs}</div></div>`;
    }).join('');
    const foot = list.map(c => `<div class="colf"><div class="col-val">${pct(c)}%</div><div class="col-name">${labelOf(c)}</div></div>`).join('');
    chart.innerHTML = `<div class="cols-plot"><div class="cols-grid">${grid}</div><div class="cols-bars">${bars}</div></div><div class="cols-foot">${foot}</div>`;
    chart.querySelectorAll('.colc').forEach((col, idx) => col.addEventListener('click', () => openDrawer(list[idx])));
    requestAnimationFrame(() => {
      chart.querySelectorAll('.col-bar').forEach(b => { b.style.height = b.dataset.h + '%'; });
      chart.querySelectorAll('.col-seg').forEach((s, k) => setTimeout(() => { s.style.height = s.dataset.h + '%'; }, 80 + (k % 7) * 45));
    });
  }

  function updateYearCopy() {
    const D0 = D();
    const eb = document.getElementById('hero-eyebrow'), by = document.getElementById('hero-byline');
    if (eb) eb.textContent = 'Explorador de datos · ' + state.year;
    if (by) by.innerHTML = 'Observatorio <b>MirarCE</b> · ' + D0.centros.length + ' centros · sobre ' + D0.total_max + (state.year === '2025' ? ' puntos (7 ejes)' : ' puntos (16 criterios)');
    const countEl = document.getElementById('count-centros');
    if (countEl) countEl.textContent = D0.centros.length;
    const maxI = D0.eje_max.indexOf(Math.max(...D0.eje_max));
    const co = document.getElementById('callout-body');
    if (co) co.innerHTML = `<p class="eyebrow" style="color:var(--teal)">El eje que más pesa en ${state.year}</p>
      <div class="display">${D0.eje_max[maxI]} de ${D0.total_max} puntos</div>
      <p>En ${state.year}, la mayor parte del puntaje se concentra en <b style="color:var(--gold)">${D0.ejes[maxI].toLowerCase()}</b>.
      Por eso dos centros muy activos pueden terminar lejos: lo que más los separa es cómo cuidan su proceso democrático.</p>`;
    buildLegend();
  }

  /* ===========================================================
     4) DETALLE (radar + presidente)
     =========================================================== */
  const drawer = document.getElementById('drawer');
  const backdrop = document.getElementById('backdrop');
  const body = document.getElementById('drawer-body');
  let radarChart = null;

  function openDrawer(c) {
    const D0 = D();
    const measured = D0.ejes.map((_, i) => ejeNum(c, i));
    const myPct = measured.map((v, i) => v === null ? null : Math.round((v / D0.eje_max[i]) * 100));
    const present = myPct.filter(v => v !== null);
    const total = D0.centros.length;                                  // ranking global del año, no del filtro
    const rank = 1 + D0.centros.filter(x => x.total > c.total).length; // puesto con empates correctos
    const initials = (c.pres || labelOf(c)).split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();

    // Insight (con manejo de casos límite)
    let insight = '';
    const pendingEjes = D0.ejes.map((e, i) => measured[i] === null ? { e, w: D0.eje_max[i] } : null).filter(Boolean);
    const minv = present.length ? Math.min(...present) : null;
    const maxv = present.length ? Math.max(...present) : null;
    if (present.length === 0) {
      insight = 'Todavía no hay ejes medidos para este centro.';
    } else if (pendingEjes.length) {
      // Incompleto: lo importante es lo que falta, no declarar perfección
      const big = pendingEjes.slice().sort((a, b) => b.w - a.w)[0];
      insight = `Le falta medir <b>${big.e.toLowerCase()}</b> (el eje que más pesa). El puntaje actual solo refleja los ejes ya medidos.`;
    } else if (minv >= 100) {
      insight = '<b>Puntaje perfecto:</b> cumple al máximo en cada ' + (state.year === '2025' ? 'eje' : 'categoría') + '.';
    } else if (maxv === minv) {
      insight = `Puntaje parejo: ${minv}% en cada eje.`;
    } else {
      let wi = 0; myPct.forEach((v, i) => { if (v !== null && (myPct[wi] === null || v < myPct[wi])) wi = i; });
      insight = `Punto más débil: <b>${D0.ejes[wi].toLowerCase()}</b> (${myPct[wi]}%)`;
    }
    const pendNote = pendingEjes.length ? `<div class="pend">Pendiente: ${pendingEjes.map(p => p.e.toLowerCase()).join(', ')}</div>` : '';

    body.innerHTML = `
      <img class="drawer-lupa" src="assets/mascota-lupa.svg" alt="" aria-hidden="true">
      <p class="uni">${c.institucion} · ${state.year}</p>
      <h3>${labelOf(c)}</h3>
      <p class="uni">${c.facultad}</p>
      <div class="score-row">
        <div class="sc"><div class="sc-num" style="color:var(--coral)">${pct(c)}<small>%</small></div><div class="sc-lbl">Puntaje</div></div>
        <div class="sc"><div class="sc-num">${rank}<small>/${total}</small></div><div class="sc-lbl">Puesto</div></div>
      </div>
      ${hasGap(c) ? '<div class="caveat" style="margin:var(--s2) 0"><b>Datos incompletos.</b> Tiene ejes sin información; su puntaje puede subir al completarlos.</div>' : ''}

      <div class="pres-card">
        <div class="pres-avatar" data-photo="">${initials || '—'}</div>
        <div class="pres-info">
          <div class="pres-name">${c.pres || 'Representante no registrado/a'}</div>
          <div class="pres-role">${c.genero === 'F' ? 'Presidenta' : 'Presidente'} · ${state.year}</div>
        </div>
        ${c.pres ? '<button class="pres-more" type="button">Leer más</button>' : ''}
      </div>
      <div class="pres-bio" hidden>
        <p class="pres-bio-txt">Biografía próximamente. (Espacio reservado para una breve reseña del representante.)</p>
        <a class="pres-social" href="#" data-social="" aria-disabled="true">Ver red social</a>
      </div>

      <div class="radar-box"><canvas id="radar" role="img" aria-label="Radar de ejes del centro"></canvas></div>
      <div class="weak">${insight}</div>
      ${pendNote}`;

    const moreBtn = body.querySelector('.pres-more');
    if (moreBtn) moreBtn.addEventListener('click', () => {
      const bio = body.querySelector('.pres-bio');
      const open = bio.hasAttribute('hidden');
      if (open) bio.removeAttribute('hidden'); else bio.setAttribute('hidden', '');
      moreBtn.textContent = open ? 'Ocultar' : 'Leer más';
    });

    drawer.classList.add('open'); backdrop.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (radarChart) { radarChart.destroy(); radarChart = null; }
    const wrapLabel = (str, max) => {
      const words = String(str).split(' '); const lines = []; let cur = '';
      words.forEach(w => { if ((cur + ' ' + w).trim().length > max) { if (cur) lines.push(cur.trim()); cur = w; } else cur += ' ' + w; });
      if (cur.trim()) lines.push(cur.trim());
      return lines;
    };
    radarChart = new Chart(document.getElementById('radar'), {
      type: 'radar',
      data: {
        labels: D0.ejes.map(e => wrapLabel(e, 13)),
        datasets: [{ data: myPct.map(v => v === null ? 0 : v), borderColor: '#F36F60', backgroundColor: 'rgba(243,111,96,.20)', borderWidth: 2.5, pointBackgroundColor: '#F36F60', pointRadius: 3.5 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        layout: { padding: 6 },
        plugins: { legend: { display: false }, tooltip: { callbacks: { title: (i) => D0.ejes[i[0].dataIndex], label: (i) => i.raw + '%' } } },
        scales: { r: { min: 0, max: 100, ticks: { display: false, stepSize: 25 }, grid: { color: 'rgba(0,62,86,.12)' }, angleLines: { color: 'rgba(0,62,86,.12)' }, pointLabels: { font: { size: window.innerWidth < 480 ? 8 : 9.5 }, color: '#3a5560' } } }
      }
    });
  }
  function closeDrawer() {
    drawer.classList.remove('open'); backdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (radarChart) { radarChart.destroy(); radarChart = null; }
  }
  document.getElementById('drawer-close').addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  /* ---------- Evolución ---------- */
  function buildEvolution() {
    const wrap = document.getElementById('evo-rows');
    if (!wrap || !YEARS.matches) return;
    const ms = YEARS.matches.slice().sort((a, b) => b.p25 - a.p25);
    wrap.innerHTML = ms.map(m => {
      const up = m.p25 - m.p24, dir = up > 0 ? 'up' : (up < 0 ? 'down' : 'flat');
      const arrow = up > 0 ? '▲' : (up < 0 ? '▼' : '■');
      return `<div class="evo-row ${dir}">
        <div class="evo-name" role="button" tabindex="0" title="Tocá para ver el nombre completo">
          <span class="evo-acro">${m.acro}</span>
          <small class="evo-uni">${shortUni(m.uni)}</small>
          <span class="evo-full" hidden>${m.ce}</span>
        </div>
        <div class="evo-track">
          <span class="evo-dot d24" style="left:${m.p24}%"><b>${m.p24}%</b><span>'24</span></span>
          <span class="evo-line" style="left:${Math.min(m.p24, m.p25)}%;width:${Math.abs(m.p25 - m.p24)}%"></span>
          <span class="evo-dot d25" style="left:${m.p25}%"><b>${m.p25}%</b><span>'25</span></span>
        </div><div class="evo-delta ${dir}">${arrow} ${up > 0 ? '+' : ''}${up}</div></div>`;
    }).join('');
    wrap.querySelectorAll('.evo-name').forEach(el => {
      el.addEventListener('click', () => {
        const full = el.querySelector('.evo-full');
        if (full.hasAttribute('hidden')) full.removeAttribute('hidden');
        else full.setAttribute('hidden', '');
      });
    });
  }

  const rio = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => rio.observe(el));

  /* ---------- Init ---------- */
  buildCarousel();
  buildYearSwitch();
  buildUniFilters();
  updateYearCopy();
  render();
  buildEvolution();
})();
