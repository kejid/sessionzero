// ============ DATA-DRIVEN SYSTEMS ============
let SYSTEMS_DATA = {};
const SYSTEM_NAMES = {};
let SYSTEM_IDS = [];
const PLAYER_COLORS = ['#38bdf8','#4ade80','#c084fc','#fde047','#f87171','#fb923c','#2dd4bf','#f472b6'];

const SYSTEM_GROUPS = {
    'osr': ['into-the-odd', 'electric-bastionland', 'mythic-bastionland', 'cairn', 'mork-borg', 'shadowdark'],
    'fl': ['alien', 'blade-runner', 'vaesen', 'forbidden-lands', 'twilight', 'tales-loop', 'dragonbane', 'coriolis'],
    'narrative': ['heart', 'triangle', 'mothership', 'blades', 'wildsea', 'delta-green', 'uvg', 'microscope', 'one-ring', 'outgunned', 'l5r', 'star-wars-ffg', 'call-of-cthulhu'],
    'tactical': ['draw-steel', 'nimble']
};

const TAG_ICONS = {
    explore: 'compass', combat: 'swords', narrative: 'book-open',
    horror: 'ghost', social: 'users', mystery: 'search',
    survival: 'skull', worldbuild: 'globe', tactical: 'crosshair', sandbox: 'map', action: 'zap',
};
const TAG_I18N = {
    explore: 'tag_exploration', combat: 'tag_combat', narrative: 'tag_narrative',
    horror: 'tag_horror', social: 'tag_social', mystery: 'tag_mystery',
    survival: 'tag_survival', worldbuild: 'tag_worldbuilding', tactical: 'tag_tactical', sandbox: 'tag_sandbox',
};
function tagLabel(tag) {
    const key = TAG_I18N[tag] || 'tag_' + tag;
    const val = t(key);
    return val !== key ? val : tag;
}
// TAG_CONFIG proxy for backward compatibility
const TAG_CONFIG = new Proxy({}, {
    get(_, tag) { return { icon: TAG_ICONS[tag] || 'tag', label: tagLabel(tag) }; }
});

// ============ DEBOUNCED LUCIDE REFRESH ============
let _lucideTimer;
function refreshIcons() {
    clearTimeout(_lucideTimer);
    _lucideTimer = setTimeout(() => lucide.createIcons(), 50);
}

// ============ MINI MARKDOWN ============
function miniMd(s) {
    if (!s) return '';
    return s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '<br><br>');
}

// ============ RESOURCE ICONS & LABELS ============
const RES_ICONS = { link: 'external-link', sheet: 'file-text', quickstart: 'book-open', rules: 'scroll-text', map: 'map', tool: 'wrench' };
let RES_LABELS = { link: 'Сайт', sheet: 'Лист', quickstart: 'Quickstart', rules: 'Правила', map: 'Карта', tool: 'Инструмент' };

// ============ LOAD SYSTEMS DATA ============
function loadSystems() {
    SYSTEMS_DATA = typeof SYSTEMS_JSON !== 'undefined' ? JSON.parse(JSON.stringify(SYSTEMS_JSON)) : {};
    const enData = typeof SYSTEMS_EN_JSON !== 'undefined' ? SYSTEMS_EN_JSON : {};

    for (const [id, sys] of Object.entries(SYSTEMS_DATA)) {
        SYSTEM_NAMES[id] = sys.name;
        if (enData[id]) {
            sys._en = enData[id];
        }
    }
    SYSTEM_IDS = Object.keys(SYSTEMS_DATA);

    renderAllSystems();
    renderNavItems();
}

// ============ LOCALIZATION HELPER ============
function localField(sys, field) {
    if (currentLang === 'en' && sys._en && sys._en[field]) return sys._en[field];
    return sys[field] || '';
}

function localArray(sys, field) {
    if (currentLang === 'en' && sys._en && sys._en[field]) return sys._en[field];
    return sys[field] || [];
}

// ============ SHARED HELPERS ============
function buildComplexityBar(level) {
    return [1,2,3,4,5].map(n => {
        let cls = 'complexity-pip';
        if (n <= level) cls += ' filled';
        if (n >= 4 && level >= 4) cls += ' warn';
        if (n >= 5 && level >= 5) cls += ' danger';
        return `<div class="${cls}"></div>`;
    }).join('');
}

function buildHeroBanner(id, sys) {
    const style = sys.heroStyle ? ` style="${sys.heroStyle}"` : '';
    const imgStyle = sys.heroImageStyle ? ` style="${sys.heroImageStyle}"` : '';
    const img = sys.heroImage ? `<img src="${sys.heroImage}" alt=""${imgStyle} onerror="this.style.display='none'">` : '';
    return `<div class="hero-banner"${style}>${img}<div class="hero-overlay"><div class="meta">${sys.publisher || ''}</div><h2>${sys.name}</h2></div></div>`;
}

// ============ RENDER SYSTEM PAGES FROM JSON ============
function renderSystemPage(id, sys) {
    const foundry = sys.foundryStatus || '\u2014';
    const pips = buildComplexityBar(sys.complexity);

    const tagsHTML = (sys.playstyleTags || []).map(tag => {
        const cfg = TAG_CONFIG[tag] || { icon: 'tag', label: tag };
        return `<span class="playstyle-tag tag-${tag}"><i data-lucide="${cfg.icon}"></i> ${cfg.label}</span>`;
    }).join('');

    const mechanics = localArray(sys, 'mechanics');
    const mechanicsHTML = mechanics.map(m => {
        return `<div class="card"><h4><i data-lucide="${m.icon}"></i> ${m.title}</h4><p>${m.text}</p></div>`;
    }).join('');

    const quotesHTML = (sys.quotes || []).map(q =>
        `<div class="reddit-quote">${q.text}<span class="reddit-user">\u2014 ${q.author}</span></div>`
    ).join('');

    const vignette = localField(sys, 'vignette');
    const vignetteHTML = vignette
        ? `<div class="section-title" data-i18n="section_vignette">Как это выглядит за столом</div>
    <div class="setting-block" style="border-left: 3px solid var(--accent); font-style: italic;">${vignette}</div>`
        : '';

    return `<section id="${id}" class="system-page">
    ${buildHeroBanner(id, sys)}
    <p class="tagline">${localField(sys, 'tagline')}</p>
    <div class="quick-stats">
        <div class="qs"><span class="qs-label" data-i18n="qs_dice">Кубики</span><span class="qs-value">${sys.dice}</span></div>
        <div class="qs"><span class="qs-label" data-i18n="qs_players">Игроки</span><span class="qs-value">${sys.players}</span></div>
        <div class="qs"><span class="qs-label" data-i18n="qs_prep">Преп</span><span class="qs-value">${localField(sys, 'prep')}</span></div>
        <div class="qs"><span class="qs-label" data-i18n="qs_foundry">Foundry VTT</span><span class="qs-value">${foundry}</span></div>
        <div class="qs">
            <span class="qs-label" data-i18n="qs_complexity">Сложность</span>
            <div class="complexity-bar">${pips}</div>
        </div>
    </div>
    <div class="section-title" data-i18n="section_system">Что это за система</div>
    <div class="setting-block">${miniMd(localField(sys, 'description'))}</div>
    <div class="section-title" data-i18n="section_setting">Сеттинг</div>
    <div class="setting-block">${miniMd(localField(sys, 'setting'))}</div>
    ${vignetteHTML}
    <div class="section-title" data-i18n="section_playstyle">Плейстайл</div>
    <div class="playstyle-tags">${tagsHTML}</div>
    <div class="section-title" data-i18n="section_mechanics">Особенности механики</div>
    <div class="grid">${mechanicsHTML}</div>
    <div class="section-title" data-i18n="section_reviews">Что говорят на Reddit</div>
    <div class="reddit-quotes">${quotesHTML}</div>
    <div class="vote-section" data-system="${id}">
        <div class="vote-title" data-i18n="vote_title"><i data-lucide="thumbs-up"></i> Хочу сыграть!</div>
        <div class="vote-players"></div>
    </div>
</section>`;
}

function renderAllSystems() {
    const container = document.getElementById('systems-container');
    container.innerHTML = Object.entries(SYSTEMS_DATA).map(([id, sys]) =>
        renderSystemPage(id, sys)
    ).join('');
}

function renderNavItems() {
    for (const [group, ids] of Object.entries(SYSTEM_GROUPS)) {
        const container = document.getElementById(`nav-group-${group}`);
        if (!container) continue;
        ids.forEach(id => {
            if (!SYSTEMS_DATA[id]) return;
            const item = document.createElement('div');
            item.className = 'nav-item';
            item.dataset.page = id;
            item.onclick = () => showPage(id);
            item.innerHTML = `${SYSTEMS_DATA[id].name} <span class="nav-votes"></span>`;
            container.appendChild(item);
        });
    }
}

// ============ STATE ============
let PLAYERS = JSON.parse(localStorage.getItem('ttrpg-players') || 'null');
let votes = JSON.parse(localStorage.getItem('ttrpg-votes') || '{}');

// ============ SETUP SCREEN ============
function updateSetupFields() {
    const count = parseInt(document.getElementById('setup-count').value);
    const container = document.getElementById('setup-players');
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const row = document.createElement('div');
        row.className = 'setup-player-row';
        row.innerHTML = `
            <span class="player-num" style="background:${PLAYER_COLORS[i]}">${i+1}</span>
            <input type="text" placeholder="${t('player_placeholder')} ${i+1}" id="pname-${i}" oninput="checkSetupReady()">
        `;
        container.appendChild(row);
    }
    checkSetupReady();
}

function checkSetupReady() {
    const count = parseInt(document.getElementById('setup-count').value);
    let allFilled = true;
    for (let i = 0; i < count; i++) {
        if (!document.getElementById(`pname-${i}`).value.trim()) { allFilled = false; break; }
    }
    document.getElementById('setup-start').disabled = !allFilled;
}

function startApp() {
    const count = parseInt(document.getElementById('setup-count').value);
    PLAYERS = [];
    for (let i = 0; i < count; i++) {
        const name = document.getElementById(`pname-${i}`).value.trim();
        PLAYERS.push({ id: `p${i}`, name, color: PLAYER_COLORS[i] });
    }
    localStorage.setItem('ttrpg-players', JSON.stringify(PLAYERS));
    document.getElementById('setup-overlay').classList.add('hidden');
    initApp();
}

function resetPlayers() {
    localStorage.removeItem('ttrpg-players');
    localStorage.removeItem('ttrpg-votes');
    localStorage.removeItem('ttrpg-browse');
    PLAYERS = null;
    votes = {};
    location.reload();
}

function skipSetup() {
    localStorage.setItem('ttrpg-browse', 'true');
    document.getElementById('setup-overlay').classList.add('hidden');
    document.body.classList.add('browse-mode');
    initApp();
}

function enableVoting() {
    localStorage.removeItem('ttrpg-browse');
    document.body.classList.remove('browse-mode');
    location.reload();
}

let currentView = localStorage.getItem('ttrpg-view') || 'cards';
function setView(view) {
    currentView = view;
    localStorage.setItem('ttrpg-view', view);
    const grid = document.getElementById('results-grid');
    grid.classList.toggle('list-view', view === 'list');
    document.querySelectorAll('.view-toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
}

// ============ VOTING LOGIC ============
function toggleVote(systemId, playerId) {
    if (!votes[systemId]) votes[systemId] = [];
    const idx = votes[systemId].indexOf(playerId);
    if (idx === -1) {
        votes[systemId].push(playerId);
    } else {
        votes[systemId].splice(idx, 1);
    }
    localStorage.setItem('ttrpg-votes', JSON.stringify(votes));
    renderVoteButtons(systemId);
    updateNavVotes();
    if (document.getElementById('results').classList.contains('active')) renderResults();
}

function renderVoteButtons(systemId) {
    const section = document.querySelector(`.vote-section[data-system="${systemId}"]`);
    if (!section || !PLAYERS) return;
    const container = section.querySelector('.vote-players');
    const systemVotes = votes[systemId] || [];
    container.innerHTML = PLAYERS.map(p => {
        const voted = systemVotes.includes(p.id);
        return `<button class="vote-btn ${voted ? 'voted' : ''}" onclick="toggleVote('${systemId}', '${p.id}')" style="${voted ? `border-color:${p.color};color:${p.color};background:${p.color}15` : ''}">
            <i data-lucide="thumbs-up"></i>
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color};flex-shrink:0"></span>
            ${p.name}
        </button>`;
    }).join('');
    refreshIcons();
}

function updateNavVotes() {
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        const page = item.dataset.page;
        const count = (votes[page] || []).length;
        const badge = item.querySelector('.nav-votes');
        if (badge) badge.textContent = count > 0 ? `${count} \u2665` : '';
    });
}

function renderResults() {
    const grid = document.getElementById('results-grid');
    const browseMode = document.body.classList.contains('browse-mode');
    const title = document.getElementById('results-title');
    const subtitle = document.getElementById('results-subtitle');
    if (title) title.textContent = browseMode ? t('results_title_browse') : t('results_title_vote');
    if (subtitle) subtitle.textContent = browseMode
        ? t('results_subtitle_browse')
        : t('results_subtitle_vote');
    const systems = SYSTEM_IDS.filter(id => !hiddenSystems.includes(id)).map(id => {
        const sysData = SYSTEMS_DATA[id];
        const page = document.getElementById(id);
        const heroImg = sysData ? sysData.heroImage : (page?.querySelector('.hero-banner img')?.src || '');
        const tagline = sysData ? localField(sysData, 'tagline') : (page?.querySelector('.tagline')?.textContent || '');
        const tags = sysData ? (sysData.playstyleTags || []).map(tag => {
            const cfg = TAG_CONFIG[tag];
            return cfg ? cfg.label : tag;
        }) : Array.from(page?.querySelectorAll('.playstyle-tag') || []).map(t => t.textContent.trim());
        return {
            id, name: SYSTEM_NAMES[id], heroImg, tagline, tags,
            voters: PLAYERS ? (votes[id] || []).map(vid => PLAYERS.find(p => p.id === vid)).filter(Boolean) : [],
            count: (votes[id] || []).length
        };
    });
    if (!browseMode && PLAYERS) systems.sort((a, b) => b.count - a.count);

    grid.classList.toggle('list-view', currentView === 'list');
    document.querySelectorAll('.view-toggle-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.view === currentView));

    grid.innerHTML = systems.map(s => {
        const votesHTML = !browseMode && PLAYERS && s.count > 0 ? `
            <div class="result-card-votes">
                <span class="result-card-vote-count">${s.count}</span>
                ${s.voters.map(v => `<span class="result-voter-chip" style="background:${v.color}20;color:${v.color}">${v.name}</span>`).join('')}
            </div>` : '';
        const isCustom = customSystems.some(cs => cs.id === s.id);
        const badgeHTML = isCustom ? '<span class="custom-badge"><i data-lucide="user"></i></span>' : '';
        return `<div class="result-card" onclick="showPage('${s.id}')">
            ${badgeHTML}
            <img class="result-card-img" src="${s.heroImg}" alt="" loading="lazy" onerror="this.style.background='linear-gradient(135deg,#1a1a2e,#0f3460)'">
            <div class="result-card-body">
                <div class="result-card-name">${s.name}</div>
                <div class="result-card-tagline">${s.tagline}</div>
                <div class="result-card-tags">${s.tags.slice(0, 3).map(t => `<span class="result-card-tag">${t}</span>`).join('')}</div>
                ${votesHTML}
            </div>
        </div>`;
    }).join('');
    refreshIcons();
}

// ============ NAVIGATION ============
function showPage(id, pushHistory = true) {
    document.querySelectorAll('.system-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const page = document.getElementById(id);
    if (page) {
        page.classList.add('active');
        document.querySelector('.main').scrollTop = 0;
    }
    const navItem = document.querySelector(`.nav-item[data-page="${id}"]`);
    if (navItem) navItem.classList.add('active');
    if (id === 'results') renderResults();
    if (pushHistory) {
        history.pushState({ page: id }, '', '#' + id);
    }
    // Auto-close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.remove('open');
        document.querySelector('.sidebar-backdrop').classList.remove('open');
    }
}

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('open');
    document.querySelector('.sidebar-backdrop').classList.toggle('open');
}

function getCurrentSystemIndex() {
    const active = document.querySelector('.system-page.active');
    if (!active) return -1;
    return SYSTEM_IDS.indexOf(active.id);
}

function getVisibleSystemIds() {
    return SYSTEM_IDS.filter(id => !hiddenSystems.includes(id));
}

function nextSystem() {
    const visible = getVisibleSystemIds();
    if (!visible.length) return;
    const active = document.querySelector('.system-page.active');
    let idx = active ? visible.indexOf(active.id) : -1;
    idx = (idx + 1) % visible.length;
    showPage(visible[idx]);
}

function prevSystem() {
    const visible = getVisibleSystemIds();
    if (!visible.length) return;
    const active = document.querySelector('.system-page.active');
    let idx = active ? visible.indexOf(active.id) : 0;
    idx = (idx - 1 + visible.length) % visible.length;
    showPage(visible[idx]);
}

// ============ PRESENTATION MODE ============
function togglePresentation() {
    document.body.classList.toggle('presentation');
}

document.addEventListener('keydown', e => {
    if (document.getElementById('setup-overlay') && !document.getElementById('setup-overlay').classList.contains('hidden')) return;
    // Close system selector on Escape
    const sysSelector = document.getElementById('sys-selector-overlay');
    if (sysSelector && !sysSelector.classList.contains('hidden')) {
        if (e.key === 'Escape') closeSystemSelector();
        return;
    }
    // Close editor on Escape
    const editorOverlay = document.getElementById('editor-overlay');
    if (editorOverlay && !editorOverlay.classList.contains('hidden')) {
        if (e.key === 'Escape') closeEditor();
        return;
    }
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); nextSystem(); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prevSystem(); }
    if (e.key === 'Escape' && document.body.classList.contains('presentation')) togglePresentation();
    if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
        togglePresentation();
    }
});

// ============ GALLERY RENDERER ============
let _lbImages = [];
let _lbIndex = 0;

function renderGalleries() {
    document.querySelectorAll('.vote-section').forEach(section => {
        const systemId = section.dataset.system;
        const sysData = SYSTEMS_DATA[systemId];
        const images = sysData ? localArray(sysData, 'gallery') : null;
        if (!images || images.length === 0) return;
        if (section.parentElement.querySelector('.gallery')) return;
        const galleryHTML = `
            <div class="section-title" data-i18n="section_gallery">${t('section_gallery')}</div>
            <div class="gallery">
                <div class="gallery-grid">
                    ${images.map((img, i) => `
                        <div class="gallery-item" onclick="openLightbox('${systemId}', ${i})">
                            <img src="${img.src}" alt="${img.cap}" loading="lazy" onerror="this.parentElement.style.display='none'">
                            <div class="gallery-overlay">
                                <div>
                                    <div class="gallery-caption">${img.cap}</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        section.insertAdjacentHTML('beforebegin', galleryHTML);
    });
}

function openLightbox(systemId, index) {
    const sysData = SYSTEMS_DATA[systemId];
    _lbImages = sysData ? (sysData.gallery || []) : [];
    _lbIndex = index;
    renderLightbox();
}

function renderLightbox() {
    closeLightbox();
    if (!_lbImages.length) return;
    const img = _lbImages[_lbIndex];
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.id = 'lightbox';
    lb.innerHTML = `
        <div class="lightbox-backdrop" onclick="closeLightbox()"></div>
        <div class="lightbox-content">
            <img src="${img.src}" alt="${img.cap}">
            <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
            ${_lbImages.length > 1 ? `
                <button class="lightbox-nav prev" onclick="event.stopPropagation(); lbPrev()">&#8249;</button>
                <button class="lightbox-nav next" onclick="event.stopPropagation(); lbNext()">&#8250;</button>
                <div class="lightbox-counter">${_lbIndex + 1} / ${_lbImages.length}</div>
            ` : ''}
            <div class="lightbox-caption">${img.cap}</div>
        </div>
    `;
    document.body.appendChild(lb);
}

function closeLightbox() {
    document.getElementById('lightbox')?.remove();
}

function lbNext() {
    _lbIndex = (_lbIndex + 1) % _lbImages.length;
    renderLightbox();
}

function lbPrev() {
    _lbIndex = (_lbIndex - 1 + _lbImages.length) % _lbImages.length;
    renderLightbox();
}

document.addEventListener('keydown', e => {
    if (!document.getElementById('lightbox')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lbNext();
    if (e.key === 'ArrowLeft') lbPrev();
});

// ============ RESOURCES RENDERER ============
function renderResources() {
    document.querySelectorAll('.vote-section').forEach(section => {
        const id = section.dataset.system;
        const sysData = SYSTEMS_DATA[id];
        const res = sysData ? localArray(sysData, 'resources') : null;
        if (!res || res.length === 0) return;
        if (section.parentElement.querySelector('.resources-section')) return;
        const html = `
            <div class="section-title" data-i18n="section_resources">${t('section_resources')}</div>
            <div class="resources-section" style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
                ${res.map(r => `
                    <a href="${r.url}" target="_blank" rel="noopener" class="resource-link">
                        <i data-lucide="${RES_ICONS[r.type] || 'file'}" style="color:var(--accent);flex-shrink:0"></i>
                        <div style="flex:1">
                            <div style="font-size:15px;font-weight:600;">${r.name}</div>
                            <div style="font-size:12px;color:var(--dim);margin-top:2px;">${RES_LABELS[r.type] || ''} \u00b7 ${r.fmt}</div>
                        </div>
                        <i data-lucide="external-link" style="color:var(--dim);flex-shrink:0"></i>
                    </a>
                `).join('')}
            </div>
        `;
        section.insertAdjacentHTML('beforebegin', html);
    });
    refreshIcons();
}

// ============ CUSTOM SYSTEMS ============
let customSystems = JSON.parse(localStorage.getItem('ttrpg-custom') || '[]');

const TAG_CSS_MAP = {
    exploration: 'tag-explore',
    combat: 'tag-combat',
    narrative: 'tag-narrative',
    horror: 'tag-horror',
    social: 'tag-social',
    mystery: 'tag-mystery',
    survival: 'tag-survival',
    tactical: 'tag-tactical',
    sandbox: 'tag-sandbox',
    worldbuilding: 'tag-worldbuild',
};

// ============ DIALOG HISTORY (back button closes dialogs) ============
let _dialogOpen = null;

function _openDialog(name) {
    _dialogOpen = name;
    history.pushState({ dialog: name }, '');
}

function _closeDialog(name) {
    document.getElementById(name === 'editor' ? 'editor-overlay' : 'sys-selector-overlay').classList.add('hidden');
    if (_dialogOpen === name) {
        _dialogOpen = null;
        if (history.state && history.state.dialog === name) history.back();
    }
}

window.addEventListener('popstate', (e) => {
    // Close dialog if one is open
    if (_dialogOpen) {
        const id = _dialogOpen === 'editor' ? 'editor-overlay' : 'sys-selector-overlay';
        document.getElementById(id).classList.add('hidden');
        _dialogOpen = null;
        return;
    }
    // Navigate to the page stored in history state
    const pageId = (e.state && e.state.page) || 'results';
    showPage(pageId, false);
});

function openEditor(editId) {
    const overlay = document.getElementById('editor-overlay');
    const heading = document.getElementById('editor-heading');
    const deleteBtn = document.getElementById('editor-delete-btn');

    // Reset form
    document.getElementById('editor-id').value = '';
    document.getElementById('editor-name').value = '';
    document.getElementById('editor-publisher').value = '';
    document.getElementById('editor-tagline').value = '';
    document.getElementById('editor-description').value = '';
    document.getElementById('editor-setting').value = '';
    document.getElementById('editor-vignette').value = '';
    document.getElementById('editor-dice').value = '';
    document.getElementById('editor-players').value = '';
    document.getElementById('editor-prep').value = '';
    document.getElementById('editor-complexity').value = '3';
    document.getElementById('editor-image').value = '';
    document.querySelectorAll('.editor-tag-check input').forEach(cb => cb.checked = false);

    if (editId) {
        const sys = customSystems.find(s => s.id === editId);
        if (sys) {
            document.getElementById('editor-id').value = sys.id;
            document.getElementById('editor-name').value = sys.name || '';
            document.getElementById('editor-publisher').value = sys.publisher || '';
            document.getElementById('editor-tagline').value = sys.tagline || '';
            document.getElementById('editor-description').value = sys.description || '';
            document.getElementById('editor-setting').value = sys.setting || '';
            document.getElementById('editor-vignette').value = sys.vignette || '';
            document.getElementById('editor-dice').value = sys.dice || '';
            document.getElementById('editor-players').value = sys.players || '';
            document.getElementById('editor-prep').value = sys.prep || '';
            document.getElementById('editor-complexity').value = String(sys.complexity || 3);
            document.getElementById('editor-image').value = sys.image || '';
            (sys.tags || []).forEach(tag => {
                const cb = document.querySelector(`.editor-tag-check input[value="${tag}"]`);
                if (cb) cb.checked = true;
            });
            heading.textContent = t('editor_title_edit');
            heading.setAttribute('data-i18n', 'editor_title_edit');
            deleteBtn.style.display = 'block';
        }
    } else {
        heading.textContent = t('editor_title');
        heading.setAttribute('data-i18n', 'editor_title');
        deleteBtn.style.display = 'none';
    }

    overlay.classList.remove('hidden');
    _openDialog('editor');
}

function closeEditor() { _closeDialog('editor'); }

function generateSlug(name) {
    return 'custom-' + name.toLowerCase().replace(/[^a-z0-9\u0400-\u04ff]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function saveCustomSystem() {
    const name = document.getElementById('editor-name').value.trim();
    if (!name) { document.getElementById('editor-name').focus(); return; }

    const existingId = document.getElementById('editor-id').value;
    let id = existingId || generateSlug(name);

    // Ensure unique ID for new systems
    if (!existingId && (SYSTEM_NAMES[id] || customSystems.some(s => s.id === id))) {
        id = id + '-' + Date.now();
    }

    const tags = [];
    document.querySelectorAll('.editor-tag-check input:checked').forEach(cb => tags.push(cb.value));

    const sysData = {
        id: id,
        name: name,
        publisher: document.getElementById('editor-publisher').value.trim(),
        tagline: document.getElementById('editor-tagline').value.trim(),
        description: document.getElementById('editor-description').value.trim(),
        setting: document.getElementById('editor-setting').value.trim(),
        vignette: document.getElementById('editor-vignette').value.trim(),
        dice: document.getElementById('editor-dice').value.trim(),
        players: document.getElementById('editor-players').value.trim(),
        prep: document.getElementById('editor-prep').value.trim(),
        complexity: parseInt(document.getElementById('editor-complexity').value),
        image: document.getElementById('editor-image').value.trim(),
        tags: tags,
    };

    if (existingId) {
        const idx = customSystems.findIndex(s => s.id === existingId);
        if (idx !== -1) customSystems[idx] = sysData;
        document.getElementById(existingId)?.remove();
        document.querySelector(`.nav-item[data-page="${existingId}"]`)?.remove();
    } else {
        customSystems.push(sysData);
    }

    localStorage.setItem('ttrpg-custom', JSON.stringify(customSystems));

    SYSTEM_NAMES[id] = name;
    if (!SYSTEM_IDS.includes(id)) SYSTEM_IDS.push(id);

    buildCustomSystemPage(sysData);
    buildCustomNavItem(sysData);
    showCustomNavGroup();

    renderResults();
    updateNavVotes();
    if (PLAYERS) {
        const section = document.querySelector(`.vote-section[data-system="${id}"]`);
        if (section) renderVoteButtons(id);
    }
    refreshIcons();
    closeEditor();
    showPage(id);
}

function buildCustomSystemPage(sys) {
    const pips = buildComplexityBar(sys.complexity || 3);

    const tagsHTML = (sys.tags || []).map(tag => {
        const cssClass = TAG_CSS_MAP[tag] || 'tag-explore';
        const label = t('tag_' + tag) || tag;
        return '<span class="playstyle-tag ' + cssClass + '">' + label + '</span>';
    }).join('');

    const customHeroSys = {
        name: sys.name,
        publisher: sys.publisher,
        heroImage: sys.image,
        heroStyle: sys.image ? '' : 'background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)',
    };

    const escId = sys.id.replace(/'/g, "\\'");
    const editBtn = ' <button class="custom-edit-btn" onclick="event.stopPropagation();openEditor(\'' + escId + '\')"><i data-lucide="pencil"></i> Edit</button>';

    const html =
        '<section id="' + sys.id + '" class="system-page">' +
        buildHeroBanner(sys.id, customHeroSys).replace('</div><h2>', editBtn + '</div><h2>') +
        (sys.tagline ? '<p class="tagline">' + sys.tagline + '</p>' : '') +
        '<div class="quick-stats">' +
        (sys.dice ? '<div class="qs"><span class="qs-label" data-i18n="qs_dice">' + t('qs_dice') + '</span><span class="qs-value">' + sys.dice + '</span></div>' : '') +
        (sys.players ? '<div class="qs"><span class="qs-label" data-i18n="qs_players">' + t('qs_players') + '</span><span class="qs-value">' + sys.players + '</span></div>' : '') +
        (sys.prep ? '<div class="qs"><span class="qs-label" data-i18n="qs_prep">' + t('qs_prep') + '</span><span class="qs-value">' + sys.prep + '</span></div>' : '') +
        '<div class="qs"><span class="qs-label" data-i18n="qs_complexity">' + t('qs_complexity') + '</span><div class="complexity-bar">' + pips + '</div></div>' +
        '</div>' +
        (sys.description ? '<div class="section-title" data-i18n="section_system">' + t('section_system') + '</div><div class="setting-block">' + miniMd(sys.description) + '</div>' : '') +
        (sys.setting ? '<div class="section-title" data-i18n="section_setting">' + t('section_setting') + '</div><div class="setting-block">' + miniMd(sys.setting) + '</div>' : '') +
        (sys.vignette ? '<div class="section-title" data-i18n="section_vignette">' + t('section_vignette') + '</div><div class="setting-block" style="border-left:3px solid var(--accent);font-style:italic;">' + sys.vignette + '</div>' : '') +
        (tagsHTML ? '<div class="section-title" data-i18n="section_playstyle">' + t('section_playstyle') + '</div><div class="playstyle-tags">' + tagsHTML + '</div>' : '') +
        '<div class="vote-section" data-system="' + sys.id + '">' +
        '<div class="vote-title" data-i18n="vote_title"><i data-lucide="thumbs-up"></i> ' + t('vote_title') + '</div>' +
        '<div class="vote-players"></div>' +
        '</div>' +
        '</section>';

    document.querySelector('.main').insertAdjacentHTML('beforeend', html);
}

function buildCustomNavItem(sys) {
    const group = document.getElementById('custom-nav-group');
    const existing = group.querySelector('.nav-item[data-page="' + sys.id + '"]');
    if (existing) existing.remove();

    const item = document.createElement('div');
    item.className = 'nav-item';
    item.dataset.page = sys.id;
    item.onclick = function() { showPage(sys.id); };
    item.innerHTML = sys.name + ' <span class="custom-badge"><i data-lucide="user"></i></span> <span class="nav-votes"></span>';
    group.appendChild(item);
}

function showCustomNavGroup() {
    const group = document.getElementById('custom-nav-group');
    group.style.display = customSystems.length > 0 ? '' : 'none';
}

function deleteCustomSystem(id) {
    customSystems = customSystems.filter(s => s.id !== id);
    localStorage.setItem('ttrpg-custom', JSON.stringify(customSystems));

    document.getElementById(id)?.remove();
    document.querySelector('.nav-item[data-page="' + id + '"]')?.remove();

    delete SYSTEM_NAMES[id];
    const idx = SYSTEM_IDS.indexOf(id);
    if (idx !== -1) SYSTEM_IDS.splice(idx, 1);

    delete votes[id];
    localStorage.setItem('ttrpg-votes', JSON.stringify(votes));

    showCustomNavGroup();
    renderResults();
    updateNavVotes();
    showPage('results');
}

function deleteCustomSystemFromEditor() {
    const id = document.getElementById('editor-id').value;
    if (!id) return;
    closeEditor();
    deleteCustomSystem(id);
}

function renderCustomSystems() {
    customSystems.forEach(sys => {
        SYSTEM_NAMES[sys.id] = sys.name;
        if (!SYSTEM_IDS.includes(sys.id)) SYSTEM_IDS.push(sys.id);
        buildCustomSystemPage(sys);
        buildCustomNavItem(sys);
    });
    showCustomNavGroup();
    refreshIcons();
}

// ============ SYSTEM SELECTOR ============
let hiddenSystems = JSON.parse(localStorage.getItem('ttrpg-hidden-systems') || '[]');

// Nav group definitions for the selector UI
const NAV_GROUPS = [
    { key: 'nav_group_osr', ids: ['into-the-odd','electric-bastionland','mythic-bastionland','cairn','mork-borg','shadowdark'] },
    { key: 'nav_group_fl', ids: ['alien','blade-runner','vaesen','forbidden-lands','twilight','tales-loop','dragonbane','coriolis'] },
    { key: 'nav_group_narrative', ids: ['heart','triangle','mothership','blades','wildsea','delta-green','uvg','microscope','one-ring','outgunned','l5r','draw-steel','nimble'] },
];

function openSystemSelector() {
    const overlay = document.getElementById('sys-selector-overlay');
    const list = document.getElementById('sys-selector-list');
    list.innerHTML = '';

    NAV_GROUPS.forEach(group => {
        const title = document.createElement('div');
        title.className = 'sys-selector-group-title';
        title.textContent = t(group.key);
        list.appendChild(title);

        const container = document.createElement('div');
        container.className = 'sys-selector-list';
        group.ids.forEach(id => {
            const name = SYSTEM_NAMES[id] || id;
            const isHidden = hiddenSystems.includes(id);
            const item = document.createElement('label');
            item.className = 'sys-selector-item' + (isHidden ? ' disabled-sys' : '');
            item.innerHTML = '<input type="checkbox" data-sys-id="' + id + '"' + (!isHidden ? ' checked' : '') + '> ' + name;
            item.querySelector('input').addEventListener('change', function() {
                item.classList.toggle('disabled-sys', !this.checked);
            });
            container.appendChild(item);
        });
        list.appendChild(container);
    });

    // Custom systems
    if (customSystems.length > 0) {
        const title = document.createElement('div');
        title.className = 'sys-selector-group-title';
        title.textContent = t('nav_group_custom');
        list.appendChild(title);

        const container = document.createElement('div');
        container.className = 'sys-selector-list';
        customSystems.forEach(sys => {
            const isHidden = hiddenSystems.includes(sys.id);
            const item = document.createElement('label');
            item.className = 'sys-selector-item' + (isHidden ? ' disabled-sys' : '');
            item.innerHTML = '<input type="checkbox" data-sys-id="' + sys.id + '"' + (!isHidden ? ' checked' : '') + '> ' + sys.name;
            item.querySelector('input').addEventListener('change', function() {
                item.classList.toggle('disabled-sys', !this.checked);
            });
            container.appendChild(item);
        });
        list.appendChild(container);
    }

    overlay.classList.remove('hidden');
    _openDialog('selector');
}

function closeSystemSelector() { _closeDialog('selector'); }

function sysSelectAll() {
    document.querySelectorAll('#sys-selector-list input[type="checkbox"]').forEach(cb => {
        cb.checked = true;
        cb.closest('.sys-selector-item').classList.remove('disabled-sys');
    });
}

function sysDeselectAll() {
    document.querySelectorAll('#sys-selector-list input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
        cb.closest('.sys-selector-item').classList.add('disabled-sys');
    });
}

function saveSystemSelection() {
    hiddenSystems = [];
    document.querySelectorAll('#sys-selector-list input[type="checkbox"]').forEach(cb => {
        if (!cb.checked) {
            hiddenSystems.push(cb.dataset.sysId);
        }
    });
    localStorage.setItem('ttrpg-hidden-systems', JSON.stringify(hiddenSystems));
    applySystemVisibility();
    closeSystemSelector();
    // If currently viewing a hidden system, navigate to results
    const activePage = document.querySelector('.system-page.active');
    if (activePage && hiddenSystems.includes(activePage.id)) {
        showPage('results');
    }
    renderResults();
}

function applySystemVisibility() {
    // Nav items
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        const pageId = item.dataset.page;
        item.style.display = hiddenSystems.includes(pageId) ? 'none' : '';
    });
}

// ============ INIT ============
function initApp() {
    renderCustomSystems();
    document.querySelectorAll('.vote-section').forEach(section => {
        renderVoteButtons(section.dataset.system);
    });
    updateNavVotes();
    applySystemVisibility();
    renderResults();
    applyLang();
    refreshIcons();
    // Restore page from URL hash if present
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
        showPage(hash, false);
    }
}

// ============ BOOT ============
// Set initial history state so popstate can return to the start page
history.replaceState({ page: 'results' }, '', window.location.hash || '#results');

loadSystems();
renderGalleries();
renderResources();

const isBrowseMode = localStorage.getItem('ttrpg-browse') === 'true';
if (PLAYERS) {
    document.getElementById('setup-overlay').classList.add('hidden');
    initApp();
} else if (isBrowseMode) {
    document.getElementById('setup-overlay').classList.add('hidden');
    document.body.classList.add('browse-mode');
    initApp();
} else {
    updateSetupFields();
    applyLang();
}
refreshIcons();
