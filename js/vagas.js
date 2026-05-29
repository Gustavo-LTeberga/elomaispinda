/* ───────── FILTRO / BUSCA ───────── */
const searchInput = document.getElementById('searchInput');
const areaSelect = document.getElementById('areaSelect');
const resultsCount = document.getElementById('resultsCount');
const noResults = document.getElementById('noResults');
const filterBadge = document.getElementById('filterBadge');

// chips ativos
const activeChips = { tipo: null, esc: null, novo: null };

function toggleFilter() {
    const panel = document.getElementById('filterPanel');
    panel.classList.toggle('open');
}

function toggleChip(el) {
    const filter = el.dataset.filter;
    const value = el.dataset.value;

    // desativa outros chips do mesmo grupo
    document.querySelectorAll(`[data-filter="${filter}"]`).forEach(c => c.classList.remove('active'));

    if (activeChips[filter] === value) {
        activeChips[filter] = null;
    } else {
        el.classList.add('active');
        activeChips[filter] = value;
    }
    updateBadge();
    applyFilters();
}

function updateBadge() {
    const count = Object.values(activeChips).filter(Boolean).length;
    filterBadge.textContent = count;
    filterBadge.style.display = count > 0 ? 'inline' : 'none';
}

function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();
    const area = areaSelect.value;
    const items = document.querySelectorAll('.vaga-item');
    const blocos = document.querySelectorAll('.categoria-bloco');

    let visible = 0;

    items.forEach(item => {
        const texto = item.dataset.texto.toLowerCase();
        const catItem = item.dataset.categoria;
        const tipo = item.dataset.tipo;
        const esc = item.dataset.esc;
        const isNovo = item.dataset.novo === 'true';

        const matchQuery = !query || texto.includes(query);
        const matchArea = !area || catItem === area;
        const matchTipo = !activeChips.tipo || tipo === activeChips.tipo;
        const matchEsc = !activeChips.esc || esc === activeChips.esc;
        const matchNovo = !activeChips.novo || isNovo;

        if (matchQuery && matchArea && matchTipo && matchEsc && matchNovo) {
            item.style.display = '';
            visible++;
        } else {
            item.style.display = 'none';
        }
    });

    // esconde categorias sem nenhuma vaga visível
    blocos.forEach(bloco => {
        const visiveis = bloco.querySelectorAll('.vaga-item:not([style*="display: none"])');
        bloco.style.display = visiveis.length > 0 ? '' : 'none';
    });

    resultsCount.textContent = visible;
    noResults.style.display = visible === 0 ? 'block' : 'none';
}

searchInput.addEventListener('input', applyFilters);
areaSelect.addEventListener('change', applyFilters);

/* ───────── SCROLL SUAVE ───────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});