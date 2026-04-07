// ============ DATA-DRIVEN SYSTEMS ============
let SYSTEMS_DATA = {};
const SYSTEM_NAMES = {};
let SYSTEM_IDS = [];
const PLAYER_COLORS = ['#38bdf8','#4ade80','#c084fc','#fde047','#f87171','#fb923c','#2dd4bf','#f472b6'];

// SYSTEM_GROUPS is built dynamically from per-system files via _registry.js
let SYSTEM_GROUPS = {};
let currentGrouping = localStorage.getItem('ttrpg-grouping') || 'default';

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

// ============ IMAGE PROXY ============
// Uses wsrv.nl free image CDN for resizing, WebP conversion, and caching
function imgProxy(url, opts) {
    if (!url) return '';
    var params = 'url=' + encodeURIComponent(url);
    if (opts.w) params += '&w=' + opts.w;
    if (opts.h) params += '&h=' + opts.h;
    if (opts.fit) params += '&fit=' + opts.fit;
    params += '&output=webp&q=80';
    return 'https://wsrv.nl/?' + params;
}

function heroThumb(url) { return imgProxy(url, { w: 400, h: 200, fit: 'cover' }); }
function heroFull(url) { return imgProxy(url, { w: 1200, h: 600, fit: 'cover' }); }
function galleryThumb(url) { return imgProxy(url, { w: 300, h: 300, fit: 'cover' }); }

// ============ RESOURCE ICONS & LABELS ============
const RES_ICONS = { link: 'external-link', sheet: 'file-text', quickstart: 'book-open', rules: 'scroll-text', map: 'map', tool: 'wrench' };
let RES_LABELS = { link: 'Сайт', sheet: 'Лист', quickstart: 'Quickstart', rules: 'Правила', map: 'Карта', tool: 'Инструмент' };

// ============ LOAD SYSTEMS DATA ============
function mergeTranslated(baseArr, transArr) {
    return (baseArr || []).map(function(item, i) {
        return Object.assign({}, item, (transArr && transArr[i]) || {});
    });
}

function loadSystems() {
    // Build SYSTEM_GROUPS from registry for current grouping scheme
    const allGroups = typeof SYSTEM_GROUPS_ALL !== 'undefined' ? SYSTEM_GROUPS_ALL : {};
    const groupsRaw = allGroups[currentGrouping] || allGroups['default'] || {};
    SYSTEM_GROUPS = {};
    for (const [group, entries] of Object.entries(groupsRaw)) {
        entries.sort(function(a, b) { return a.order - b.order; });
        SYSTEM_GROUPS[group] = entries.map(function(e) { return e.id; });
    }

    // Build SYSTEMS_DATA from registry
    const registry = typeof SYSTEMS_REGISTRY !== 'undefined' ? SYSTEMS_REGISTRY : {};
    SYSTEMS_DATA = {};

    for (const [id, raw] of Object.entries(registry)) {
        const lang = currentLang === 'en' ? (raw.en || raw.ru || {}) : (raw.ru || {});
        const sys = {};

        // Copy shared fields
        for (const key of Object.keys(raw)) {
            if (key !== 'ru' && key !== 'en') sys[key] = raw[key];
        }

        // Overlay translated top-level text fields
        for (const key of Object.keys(lang)) {
            if (key !== 'mechanics' && key !== 'gallery' && key !== 'resources') {
                sys[key] = lang[key];
            }
        }

        // Merge array translations
        sys.mechanics = mergeTranslated(raw.mechanics, lang.mechanics);
        sys.gallery = mergeTranslated(raw.gallery, lang.gallery);
        sys.resources = mergeTranslated(raw.resources, lang.resources);

        // Store _en for localField() compatibility
        if (raw.en) {
            const enMerged = Object.assign({}, raw.en);
            enMerged.mechanics = mergeTranslated(raw.mechanics, raw.en.mechanics);
            enMerged.gallery = mergeTranslated(raw.gallery, raw.en.gallery);
            enMerged.resources = mergeTranslated(raw.resources, raw.en.resources);
            sys._en = enMerged;
        }

        SYSTEMS_DATA[id] = sys;
        SYSTEM_NAMES[id] = raw.name;
    }
    SYSTEM_IDS = Object.keys(SYSTEMS_DATA);

    renderAllSystems();
    renderNavItems();
}

// ============ LOCALIZATION HELPER ============
function localField(sys, field, fallback = '') {
    if (currentLang === 'en' && sys._en && sys._en[field]) return sys._en[field];
    return sys[field] || fallback;
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
    const img = sys.heroImage ? `<img src="${heroFull(sys.heroImage)}" alt=""${imgStyle} loading="lazy" decoding="async" onerror="this.style.display='none'">` : '';
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

    const mechanics = localField(sys, 'mechanics', []);
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

const _renderedSystems = new Set();

function renderAllSystems() {
    // Clear previously rendered pages
    const container = document.getElementById('systems-container');
    container.innerHTML = '';
    _renderedSystems.clear();
}

function ensureSystemRendered(id) {
    if (_renderedSystems.has(id)) return;
    const sys = SYSTEMS_DATA[id];
    if (!sys) return;
    const container = document.getElementById('systems-container');
    container.insertAdjacentHTML('beforeend', renderSystemPage(id, sys));
    _renderedSystems.add(id);
    // Render gallery and resources for this system
    const section = container.querySelector(`.vote-section[data-system="${id}"]`);
    if (section) {
        renderGalleryFor(id, section);
        renderResourcesFor(id, section);
    }
    refreshIcons();
}

function renderNavItems() {
    // Remove old dynamic nav groups (keep custom-nav-group)
    document.querySelectorAll('.nav-group.dynamic-group').forEach(el => el.remove());

    const navContainer = document.querySelector('.nav-systems');
    const customGroup = document.getElementById('custom-nav-group');

    for (const [group, ids] of Object.entries(SYSTEM_GROUPS)) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'nav-group dynamic-group';
        groupDiv.id = `nav-group-${group}`;

        const titleDiv = document.createElement('div');
        titleDiv.className = 'nav-group-title';
        const i18nKey = 'nav_group_' + group;
        titleDiv.setAttribute('data-i18n', i18nKey);
        titleDiv.textContent = t(i18nKey);
        groupDiv.appendChild(titleDiv);

        ids.forEach(id => {
            if (!SYSTEMS_DATA[id]) return;
            const item = document.createElement('div');
            item.className = 'nav-item';
            item.dataset.page = id;
            item.onclick = () => showPage(id);
            item.innerHTML = `${SYSTEMS_DATA[id].name} <span class="nav-votes"></span>`;
            groupDiv.appendChild(item);
        });

        navContainer.insertBefore(groupDiv, customGroup);
    }
}

function setGrouping(scheme) {
    currentGrouping = scheme;
    localStorage.setItem('ttrpg-grouping', scheme);
    loadSystems();
    updateNavVotes();
    applySystemVisibility();
    // Update toggle buttons
    document.querySelectorAll('.grouping-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.grouping === scheme);
    });
    refreshIcons();
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
        const isCustom = !!CustomSystems.find(s.id);
        const badgeHTML = isCustom ? '<span class="custom-badge"><i data-lucide="user"></i></span>' : '';
        return `<div class="result-card" onclick="showPage('${s.id}')">
            ${badgeHTML}
            <img class="result-card-img" src="${heroThumb(s.heroImg)}" alt="" loading="lazy" decoding="async" onerror="this.style.background='linear-gradient(135deg,#1a1a2e,#0f3460)'">
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
function openSidebar() {
    document.querySelector('.sidebar').classList.add('open');
    document.querySelector('.sidebar-backdrop').classList.add('open');
}
function closeSidebar() {
    document.querySelector('.sidebar').classList.remove('open');
    document.querySelector('.sidebar-backdrop').classList.remove('open');
}

function showPage(id, pushHistory = true) {
    document.querySelectorAll('.system-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    // Lazy-render system page on demand
    if (id !== 'results') ensureSystemRendered(id);
    const page = document.getElementById(id);
    if (page) {
        page.classList.add('active');
        document.querySelector('.main').scrollTo({ top: 0, behavior: 'instant' });
    }
    const navItem = document.querySelector(`.nav-item[data-page="${id}"]`);
    if (navItem) navItem.classList.add('active');
    if (id === 'results') renderResults();
    if (pushHistory) {
        history.pushState({ page: id }, '', '#' + id);
    }
    // Auto-close sidebar on mobile after navigation
    if (window.innerWidth <= 768) closeSidebar();
}

function toggleSidebar() {
    document.querySelector('.sidebar').classList.contains('open') ? closeSidebar() : openSidebar();
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

function renderGalleryFor(systemId, section) {
    const sysData = SYSTEMS_DATA[systemId];
    const images = sysData ? localField(sysData, 'gallery', []) : null;
    if (!images || images.length === 0) return;
    if (section.parentElement.querySelector('.gallery')) return;
    const galleryHTML = `
        <div class="section-title" data-i18n="section_gallery">${t('section_gallery')}</div>
        <div class="gallery">
            <div class="gallery-grid">
                ${images.map((img, i) => `
                    <div class="gallery-item" onclick="openLightbox('${systemId}', ${i})">
                        <img src="${galleryThumb(img.src)}" alt="${img.cap}" loading="lazy" decoding="async" onerror="this.parentElement.style.display='none'">
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
}

function renderGalleries() {
    document.querySelectorAll('.vote-section').forEach(section => {
        renderGalleryFor(section.dataset.system, section);
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
function renderResourcesFor(id, section) {
    const sysData = SYSTEMS_DATA[id];
    const res = sysData ? localField(sysData, 'resources', []) : null;
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
}

function renderResources() {
    document.querySelectorAll('.vote-section').forEach(section => {
        renderResourcesFor(section.dataset.system, section);
    });
    refreshIcons();
}

// ============ CUSTOM SYSTEMS ============
// ============ CUSTOM SYSTEMS MANAGER ============
const CustomSystems = {
    _list: JSON.parse(localStorage.getItem('ttrpg-custom') || '[]'),

    get all() { return this._list; },
    get length() { return this._list.length; },

    find(id) { return this._list.find(s => s.id === id); },

    _save() { localStorage.setItem('ttrpg-custom', JSON.stringify(this._list)); },

    _register(sys) {
        SYSTEM_NAMES[sys.id] = sys.name;
        if (!SYSTEM_IDS.includes(sys.id)) SYSTEM_IDS.push(sys.id);
    },

    _unregister(id) {
        delete SYSTEM_NAMES[id];
        const idx = SYSTEM_IDS.indexOf(id);
        if (idx !== -1) SYSTEM_IDS.splice(idx, 1);
    },

    add(sysData) {
        this._list.push(sysData);
        this._save();
        this._register(sysData);
    },

    update(id, sysData) {
        const idx = this._list.findIndex(s => s.id === id);
        if (idx !== -1) this._list[idx] = sysData;
        this._save();
        this._register(sysData);
    },

    remove(id) {
        this._list = this._list.filter(s => s.id !== id);
        this._save();
        this._unregister(id);
        delete votes[id];
        localStorage.setItem('ttrpg-votes', JSON.stringify(votes));
    },

    loadAll() {
        this._list.forEach(sys => this._register(sys));
    }
};
// Backward compat
let customSystems = CustomSystems._list;

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

// ============ DIALOG MANAGEMENT ============
const DIALOGS = {
    editor: 'editor-overlay',
    selector: 'sys-selector-overlay'
};
let _dialogOpen = null;

function openDialog(name) {
    var el = document.getElementById(DIALOGS[name]);
    if (el) el.classList.remove('hidden');
    _dialogOpen = name;
    history.pushState({ dialog: name }, '');
}

function closeDialog(name) {
    var el = document.getElementById(DIALOGS[name]);
    if (el) el.classList.add('hidden');
    if (_dialogOpen === name) {
        _dialogOpen = null;
        if (history.state && history.state.dialog === name) history.back();
    }
}

window.addEventListener('popstate', (e) => {
    // Close dialog if one is open
    if (_dialogOpen) {
        var el = document.getElementById(DIALOGS[_dialogOpen]);
        if (el) el.classList.add('hidden');
        _dialogOpen = null;
        return;
    }
    // Ignore popstate without state (Safari fires this on initial load)
    if (!e.state) return;
    showPage(e.state.page || 'results', false);
});

function setFormFields(prefix, fields) {
    for (var key in fields) {
        var el = document.getElementById(prefix + '-' + key);
        if (el) el.value = fields[key] || '';
    }
}

function getFormFields(prefix, keys) {
    var result = {};
    keys.forEach(function(key) {
        var el = document.getElementById(prefix + '-' + key);
        result[key] = el ? el.value.trim() : '';
    });
    return result;
}

function openEditor(editId) {
    const overlay = document.getElementById('editor-overlay');
    const heading = document.getElementById('editor-heading');
    const deleteBtn = document.getElementById('editor-delete-btn');

    // Reset form
    setFormFields('editor', {
        id: '', name: '', publisher: '', tagline: '', description: '',
        setting: '', vignette: '', dice: '', players: '', prep: '',
        complexity: '3', image: ''
    });
    document.querySelectorAll('.editor-tag-check input').forEach(cb => cb.checked = false);

    if (editId) {
        const sys = CustomSystems.find(editId);
        if (sys) {
            setFormFields('editor', {
                id: sys.id, name: sys.name, publisher: sys.publisher,
                tagline: sys.tagline, description: sys.description,
                setting: sys.setting, vignette: sys.vignette,
                dice: sys.dice, players: sys.players, prep: sys.prep,
                complexity: String(sys.complexity || 3), image: sys.image
            });
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

    openDialog('editor');
}

function closeEditor() { closeDialog('editor'); }

function generateSlug(name) {
    return 'custom-' + name.toLowerCase().replace(/[^a-z0-9\u0400-\u04ff]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function saveCustomSystem() {
    const fields = getFormFields('editor', [
        'id', 'name', 'publisher', 'tagline', 'description',
        'setting', 'vignette', 'dice', 'players', 'prep',
        'complexity', 'image'
    ]);

    if (!fields.name) { document.getElementById('editor-name').focus(); return; }

    const existingId = fields.id;
    let id = existingId || generateSlug(fields.name);

    // Ensure unique ID for new systems
    if (!existingId && (SYSTEM_NAMES[id] || CustomSystems.find(id))) {
        id = id + '-' + Date.now();
    }

    const tags = [];
    document.querySelectorAll('.editor-tag-check input:checked').forEach(cb => tags.push(cb.value));

    const sysData = {
        id: id,
        name: fields.name,
        publisher: fields.publisher,
        tagline: fields.tagline,
        description: fields.description,
        setting: fields.setting,
        vignette: fields.vignette,
        dice: fields.dice,
        players: fields.players,
        prep: fields.prep,
        complexity: parseInt(fields.complexity) || 3,
        image: fields.image,
        tags: tags,
    };

    if (existingId) {
        CustomSystems.update(existingId, sysData);
        document.getElementById(existingId)?.remove();
        document.querySelector(`.nav-item[data-page="${existingId}"]`)?.remove();
    } else {
        CustomSystems.add(sysData);
    }

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
    group.style.display = CustomSystems.length > 0 ? '' : 'none';
}

function deleteCustomSystem(id) {
    CustomSystems.remove(id);
    customSystems = CustomSystems._list;

    document.getElementById(id)?.remove();
    document.querySelector('.nav-item[data-page="' + id + '"]')?.remove();

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
    CustomSystems.loadAll();
    customSystems = CustomSystems._list;
    CustomSystems.all.forEach(sys => {
        buildCustomSystemPage(sys);
        buildCustomNavItem(sys);
    });
    showCustomNavGroup();
    refreshIcons();
}

// ============ SYSTEM SELECTOR ============
let hiddenSystems = JSON.parse(localStorage.getItem('ttrpg-hidden-systems') || '[]');

// Nav group definitions for the selector UI
function getNavGroups(scheme) {
    var src = scheme ? buildGroupsForScheme(scheme) : SYSTEM_GROUPS;
    return Object.entries(src).map(function(entry) {
        return { key: 'nav_group_' + entry[0], ids: entry[1] };
    });
}

function buildGroupsForScheme(scheme) {
    var allGroups = typeof SYSTEM_GROUPS_ALL !== 'undefined' ? SYSTEM_GROUPS_ALL : {};
    var raw = allGroups[scheme] || allGroups['default'] || {};
    var result = {};
    for (var group in raw) {
        var entries = raw[group].slice().sort(function(a, b) { return a.order - b.order; });
        result[group] = entries.map(function(e) { return e.id; });
    }
    return result;
}

let _selectorGrouping = null;

function setSelectorGrouping(scheme) {
    _selectorGrouping = scheme;
    document.querySelectorAll('#selector-grouping-toggle .grouping-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.grouping === scheme);
    });
    rebuildSelectorList();
    refreshIcons();
}

function rebuildSelectorList() {
    var list = document.getElementById('sys-selector-list');
    // Save current checked state
    var checked = {};
    list.querySelectorAll('input[data-sys-id]').forEach(function(cb) {
        checked[cb.dataset.sysId] = cb.checked;
    });

    list.innerHTML = '';
    var groups = getNavGroups(_selectorGrouping || currentGrouping);

    groups.forEach(function(group) {
        var title = document.createElement('div');
        title.className = 'sys-selector-group-title';
        title.textContent = t(group.key);
        list.appendChild(title);

        var container = document.createElement('div');
        container.className = 'sys-selector-list';
        group.ids.forEach(function(id) {
            var name = SYSTEM_NAMES[id] || id;
            var isHidden = hiddenSystems.includes(id);
            // Use saved state if exists, otherwise use hidden state
            var isChecked = (id in checked) ? checked[id] : !isHidden;
            var item = document.createElement('label');
            item.className = 'sys-selector-item' + (!isChecked ? ' disabled-sys' : '');
            item.innerHTML = '<input type="checkbox" data-sys-id="' + id + '"' + (isChecked ? ' checked' : '') + '> ' + name;
            item.querySelector('input').addEventListener('change', function() {
                item.classList.toggle('disabled-sys', !this.checked);
            });
            container.appendChild(item);
        });
        list.appendChild(container);
    });

    // Custom systems
    if (CustomSystems.length > 0) {
        var title = document.createElement('div');
        title.className = 'sys-selector-group-title';
        title.textContent = t('nav_group_custom');
        list.appendChild(title);

        var container = document.createElement('div');
        container.className = 'sys-selector-list';
        CustomSystems.all.forEach(function(sys) {
            var isHidden = hiddenSystems.includes(sys.id);
            var isChecked = (sys.id in checked) ? checked[sys.id] : !isHidden;
            var item = document.createElement('label');
            item.className = 'sys-selector-item' + (!isChecked ? ' disabled-sys' : '');
            item.innerHTML = '<input type="checkbox" data-sys-id="' + sys.id + '"' + (isChecked ? ' checked' : '') + '> ' + sys.name;
            item.querySelector('input').addEventListener('change', function() {
                item.classList.toggle('disabled-sys', !this.checked);
            });
            container.appendChild(item);
        });
        list.appendChild(container);
    }
}

function openSystemSelector() {
    _selectorGrouping = currentGrouping;
    document.querySelectorAll('#selector-grouping-toggle .grouping-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.grouping === currentGrouping);
    });
    rebuildSelectorList();
    openDialog('selector');
}

function closeSystemSelector() { closeDialog('selector'); }

// Close dialogs on backdrop click
document.getElementById('editor-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeEditor();
});
document.getElementById('sys-selector-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeSystemSelector();
});

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

// ============ LANGUAGE CHANGE HANDLER ============
document.addEventListener('langchange', function() {
    var activePage = document.querySelector('.system-page.active');
    var activeId = activePage ? activePage.id : null;

    // Reload data with new language, clear all rendered pages
    loadSystems();
    if (typeof renderResults === 'function') renderResults();

    // Re-render active system page if any
    if (activeId && activeId !== 'results') {
        ensureSystemRendered(activeId);
        var restored = document.getElementById(activeId);
        if (restored) restored.classList.add('active');
    }

    translateI18nElements();

    if (PLAYERS) {
        document.querySelectorAll('.vote-section').forEach(function(section) {
            renderVoteButtons(section.dataset.system);
        });
    }

    applySystemVisibility();
    refreshIcons();
});

// ============ INIT ============
function initApp() {
    // Set active grouping button
    document.querySelectorAll('.grouping-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.grouping === currentGrouping);
    });
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
// Disable browser scroll restoration — we handle it in showPage()
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
// Set initial history state so popstate can return to the start page
history.replaceState({ page: 'results' }, '', window.location.hash || '#results');

loadSystems();

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
