 const searchInput  = document.getElementById('searchInput');
  const areaSelect   = document.getElementById('areaSelect');
  const resultsCount = document.getElementById('resultsCount');
  const filterBadge  = document.getElementById('filterBadge');

  const activeChips = { mod: null, carga: null, novo: null };

  function toggleFilter() {
    document.getElementById('filterPanel').classList.toggle('open');
  }

  function toggleChip(el) {
    const filter = el.dataset.filter;
    const value  = el.dataset.value;
    document.querySelectorAll(`[data-filter="${filter}"]`).forEach(c => c.classList.remove('active'));
    if (activeChips[filter] === value) { activeChips[filter] = null; }
    else { el.classList.add('active'); activeChips[filter] = value; }
    updateBadge();
    applyFilters();
  }

  function updateBadge() {
    const count = Object.values(activeChips).filter(Boolean).length;
    filterBadge.textContent = count;
    filterBadge.style.display = count > 0 ? 'inline' : 'none';
  }

  function applyFilters() {
    const query  = searchInput.value.toLowerCase().trim();
    const area   = areaSelect.value;
    const items  = document.querySelectorAll('.curso-item');
    const blocos = document.querySelectorAll('.categoria-bloco');
    let visible  = 0;

    items.forEach(item => {
      const matchQuery = !query || item.dataset.texto.toLowerCase().includes(query);
      const matchArea  = !area  || item.dataset.categoria === area;
      const matchMod   = !activeChips.mod   || item.dataset.mod   === activeChips.mod;
      const matchCarga = !activeChips.carga || item.dataset.carga === activeChips.carga;
      const matchNovo  = !activeChips.novo  || item.dataset.novo  === 'true';

      if (matchQuery && matchArea && matchMod && matchCarga && matchNovo) {
        item.style.display = ''; visible++;
      } else {
        item.style.display = 'none';
      }
    });

    blocos.forEach(bloco => {
      const vis = bloco.querySelectorAll('.curso-item:not([style*="display: none"])');
      bloco.style.display = vis.length > 0 ? '' : 'none';
    });

    resultsCount.textContent = visible;
    document.getElementById('noResults').style.display = visible === 0 ? 'block' : 'none';
  }

  searchInput.addEventListener('input', applyFilters);
  areaSelect.addEventListener('change', applyFilters);

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });