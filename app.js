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
    solo: 'user',
};
const TAG_I18N = {
    explore: 'tag_exploration', combat: 'tag_combat', narrative: 'tag_narrative',
    horror: 'tag_horror', social: 'tag_social', mystery: 'tag_mystery',
    survival: 'tag_survival', worldbuild: 'tag_worldbuilding', tactical: 'tag_tactical', sandbox: 'tag_sandbox',
    solo: 'tag_solo',
};
const SETTING_TAG_ICONS = {
    space: 'rocket', fantasy: 'castle', cyberpunk: 'cpu',
    modern: 'building-2', postapoc: 'radiation', historical: 'landmark',
    weird: 'sparkles', 'urban-fantasy': 'building',
};
const SETTING_TAG_I18N = {
    space: 'tag_space', fantasy: 'tag_fantasy', cyberpunk: 'tag_cyberpunk',
    modern: 'tag_modern', postapoc: 'tag_postapoc', historical: 'tag_historical',
    weird: 'tag_weird', 'urban-fantasy': 'tag_urban_fantasy',
};

function track(event) {
    window.goatcounter?.count?.({ path: event, event: true });
}

function tagLabel(tag) {
    const key = TAG_I18N[tag] || SETTING_TAG_I18N[tag] || 'tag_' + tag;
    const val = t(key);
    return val !== key ? val : tag;
}
// TAG_CONFIG proxy for backward compatibility
const TAG_CONFIG = new Proxy({}, {
    get(_, tag) { return { icon: TAG_ICONS[tag] || 'tag', label: tagLabel(tag) }; }
});
const SETTING_TAG_CONFIG = new Proxy({}, {
    get(_, tag) { return { icon: SETTING_TAG_ICONS[tag] || 'map-pin', label: tagLabel(tag) }; }
});

// Returns normalized tag arrays for any system (official or custom).
// Official systems use playstyleTags/settingTags; custom systems use tags/settingTags.
function getSystemTags(id) {
    const sysData = SYSTEMS_DATA[id];
    if (sysData) return { tagKeys: sysData.playstyleTags || [], settingKeys: sysData.settingTags || [] };
    const custom = CustomSystems.find(id);
    if (custom) return { tagKeys: custom.tags || [], settingKeys: custom.settingTags || [] };
    return { tagKeys: [], settingKeys: [] };
}

// ============ DEBOUNCED LUCIDE REFRESH ============
let _lucideTimer;
function refreshIcons() {
    clearTimeout(_lucideTimer);
    _lucideTimer = setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 50);
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
    CustomSystems.loadAll();

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
    const img = sys.heroImage ? `<img src="${heroFull(sys.heroImage)}" alt="${sys.name} hero art"${imgStyle} loading="lazy" decoding="async" onerror="this.style.opacity='0'">` : '';
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
    const settingTagsHTML = (sys.settingTags || []).map(tag => {
        const cfg = SETTING_TAG_CONFIG[tag] || { icon: 'map-pin', label: tag };
        return `<span class="playstyle-tag setting-tag"><i data-lucide="${cfg.icon}"></i> ${cfg.label}</span>`;
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
        ? `<div class="section-title" data-i18n="section_vignette">${t('section_vignette')}</div>
    <div class="setting-block" style="border-left: 3px solid var(--accent); font-style: italic;">${vignette}</div>`
        : '';

    return `<section id="${id}" class="system-page">
    ${buildHeroBanner(id, sys)}
    <p class="tagline">${localField(sys, 'tagline')}</p>
    <div class="quick-stats">
        <div class="qs"><span class="qs-label" data-i18n="qs_dice">${t('qs_dice')}</span><span class="qs-value">${sys.dice}</span></div>
        <div class="qs"><span class="qs-label" data-i18n="qs_players">${t('qs_players')}</span><span class="qs-value">${sys.players}</span></div>
        <div class="qs"><span class="qs-label" data-i18n="qs_prep">${t('qs_prep')}</span><span class="qs-value">${localField(sys, 'prep')}</span></div>
        <div class="qs"><span class="qs-label" data-i18n="qs_foundry">${t('qs_foundry')}</span><span class="qs-value">${foundry}</span></div>
        <div class="qs">
            <span class="qs-label" data-i18n="qs_complexity">${t('qs_complexity')}</span>
            <div class="complexity-bar">${pips}</div>
        </div>
    </div>
    <div class="section-title" data-i18n="section_system">${t('section_system')}</div>
    <div class="setting-block">${miniMd(localField(sys, 'description'))}</div>
    <div class="section-title" data-i18n="section_setting">${t('section_setting')}</div>
    <div class="setting-block">${miniMd(localField(sys, 'setting'))}</div>
    ${vignetteHTML}
    <div class="section-title" data-i18n="section_playstyle">${t('section_playstyle')}</div>
    <div class="playstyle-tags">${tagsHTML}${settingTagsHTML}</div>
    <div class="section-title" data-i18n="section_mechanics">${t('section_mechanics')}</div>
    <div class="grid">${mechanicsHTML}</div>
    <div class="section-title" data-i18n="section_reviews">${t('section_reviews')}</div>
    <div class="reddit-quotes">${quotesHTML}</div>
    <div class="vote-section" data-system="${id}">
        <div class="vote-title" data-i18n="vote_title"><i data-lucide="thumbs-up"></i> ${t('vote_title')}</div>
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
    // Translate data-i18n elements within the new page
    const page = document.getElementById(id);
    if (page) translateI18nElements(page);
    refreshIcons();
}

// Intercepts clicks on sidebar <a href="/system/...">. Lets middle-click / cmd-click /
// ctrl-click / shift-click through for new-tab behavior; otherwise preventDefault and
// keep the SPA navigation path.
function handleNavClick(e, id) {
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    showPage(id);
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
            // Custom (user-added) systems have no static page — keep them as div.
            // Official systems get a real <a href> so Googlebot crawls deep links.
            const isCustom = CustomSystems && CustomSystems.find && CustomSystems.find(id);
            let item;
            if (isCustom) {
                item = document.createElement('div');
                item.className = 'nav-item';
                item.onclick = () => showPage(id);
            } else {
                item = document.createElement('a');
                item.className = 'nav-item nav-system-link';
                item.href = '/system/' + id + '.html';
                item.onclick = (e) => handleNavClick(e, id);
            }
            item.dataset.page = id;
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
let vetoes = JSON.parse(localStorage.getItem('ttrpg-vetoes') || '{}');
let deferred = JSON.parse(localStorage.getItem('ttrpg-deferred') || '[]');
let manualOrder = JSON.parse(localStorage.getItem('ttrpg-order') || '[]');
let tagFilter = new Set(JSON.parse(localStorage.getItem('ttrpg-tag-filter') || '[]'));

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
    track('start-session');
}

function resetPlayers() {
    localStorage.removeItem('ttrpg-players');
    localStorage.removeItem('ttrpg-votes');
    localStorage.removeItem('ttrpg-vetoes');
    localStorage.removeItem('ttrpg-deferred');
    localStorage.removeItem('ttrpg-order');
    localStorage.removeItem('ttrpg-browse');
    PLAYERS = null;
    votes = {};
    vetoes = {};
    deferred = [];
    manualOrder = [];
    location.reload();
}

function skipSetup() {
    localStorage.setItem('ttrpg-browse', 'true');
    document.getElementById('setup-overlay').classList.add('hidden');
    document.body.classList.add('browse-mode');
    initApp();
    track('skip-setup');
}

function enableVoting() {
    // Open setup overlay in-place so the user can (re)configure players.
    // We don't reload: the overlay HTML is now hidden by default, so a reload
    // would put the visitor back on the catalog instead of the setup screen.
    localStorage.removeItem('ttrpg-browse');
    document.body.classList.remove('browse-mode');
    const overlay = document.getElementById('setup-overlay');
    if (overlay) {
        updateSetupFields();
        if (typeof applyLang === 'function') applyLang();
        overlay.classList.remove('hidden');
        refreshIcons();
    }
    track('enable-voting');
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
    let added = false;
    if (idx === -1) {
        votes[systemId].push(playerId);
        added = true;
        // Remove veto if voting for
        if (vetoes[systemId]) {
            const vi = vetoes[systemId].indexOf(playerId);
            if (vi !== -1) vetoes[systemId].splice(vi, 1);
            localStorage.setItem('ttrpg-vetoes', JSON.stringify(vetoes));
        }
    } else {
        votes[systemId].splice(idx, 1);
    }
    localStorage.setItem('ttrpg-votes', JSON.stringify(votes));
    renderVoteButtons(systemId);
    updateNavVotes();
    if (document.getElementById('results').classList.contains('active')) renderResults();

    // Unanimous celebration: triggered when last player upvotes a system in a group
    if (added && PLAYERS && PLAYERS.length >= 2 && votes[systemId].length === PLAYERS.length) {
        celebrateUnanimous(systemId);
    }
}

function celebrateUnanimous(systemId) {
    const page = document.getElementById(systemId);
    if (!page) return;
    page.classList.add('unanimous-celebrate');
    setTimeout(() => page.classList.remove('unanimous-celebrate'), 2000);
    // Confetti emoji burst
    const burst = document.createElement('div');
    burst.className = 'unanimous-burst';
    const symbols = ['\u2728', '\ud83c\udf89', '\u2b50', '\ud83c\udfb2', '\ud83d\udd25'];
    for (let i = 0; i < 18; i++) {
        const span = document.createElement('span');
        span.textContent = symbols[i % symbols.length];
        span.style.left = Math.random() * 100 + '%';
        span.style.animationDelay = (Math.random() * 0.3) + 's';
        span.style.animationDuration = (1.2 + Math.random() * 0.8) + 's';
        burst.appendChild(span);
    }
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 2200);
}

function toggleVeto(systemId, playerId) {
    if (!vetoes[systemId]) vetoes[systemId] = [];
    const idx = vetoes[systemId].indexOf(playerId);
    if (idx === -1) {
        vetoes[systemId].push(playerId);
        // Remove upvote if vetoing
        if (votes[systemId]) {
            const vi = votes[systemId].indexOf(playerId);
            if (vi !== -1) votes[systemId].splice(vi, 1);
            localStorage.setItem('ttrpg-votes', JSON.stringify(votes));
        }
    } else {
        vetoes[systemId].splice(idx, 1);
    }
    localStorage.setItem('ttrpg-vetoes', JSON.stringify(vetoes));
    renderVoteButtons(systemId);
    updateNavVotes();
    if (document.getElementById('results').classList.contains('active')) renderResults();
}

function renderVoteButtons(systemId) {
    const section = document.querySelector(`.vote-section[data-system="${systemId}"]`);
    if (!section || !PLAYERS) return;
    const container = section.querySelector('.vote-players');
    const systemVotes = votes[systemId] || [];
    const systemVetoes = vetoes[systemId] || [];
    const sysName = SYSTEM_NAMES[systemId] || systemId;
    container.innerHTML = PLAYERS.map(p => {
        const voted = systemVotes.includes(p.id);
        const vetoed = systemVetoes.includes(p.id);
        return `<div class="vote-player-group">
            <button class="vote-btn ${voted ? 'voted' : ''}" onclick="toggleVote('${systemId}', '${p.id}')" aria-label="${p.name}: ${voted ? 'voted' : 'vote'} ${sysName}" style="${voted ? `border-color:${p.color};color:${p.color};background:${p.color}15` : ''}">
                <i data-lucide="thumbs-up"></i>
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color};flex-shrink:0"></span>
                ${p.name}
            </button>
            <button class="vote-btn veto-btn ${vetoed ? 'vetoed' : ''}" onclick="toggleVeto('${systemId}', '${p.id}')" aria-label="${p.name}: veto ${sysName}" title="${t('veto_title')}">
                <i data-lucide="thumbs-down"></i>
            </button>
        </div>`;
    }).join('');
    refreshIcons();
}

function updateNavVotes() {
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        const page = item.dataset.page;
        const upCount = (votes[page] || []).length;
        const downCount = (vetoes[page] || []).length;
        const badge = item.querySelector('.nav-votes');
        if (badge) {
            let text = '';
            if (upCount > 0) text += `${upCount} \u2665`;
            if (downCount > 0) text += `${text ? ' ' : ''}${downCount} \u2717`;
            badge.textContent = text;
        }
    });
}

function toggleDeferred(id, e) {
    e.stopPropagation();
    const idx = deferred.indexOf(id);
    if (idx === -1) deferred.push(id);
    else deferred.splice(idx, 1);
    localStorage.setItem('ttrpg-deferred', JSON.stringify(deferred));

    // Update card in-place
    const card = document.querySelector(`[data-system-id="${id}"]`);
    if (card) {
        const isDef = deferred.includes(id);
        card.classList.toggle('result-card-deferred', isDef);
        const deferBtn = card.querySelector('.rc-defer-btn');
        if (deferBtn) {
            deferBtn.classList.toggle('active', isDef);
            deferBtn.title = isDef ? t('status_play_now') : t('status_play_later');
        }
    }
}

function moveSystem(id, dir, e) {
    e.stopPropagation();
    if (!manualOrder.length) initManualOrder();
    const idx = manualOrder.indexOf(id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= manualOrder.length) return;

    const grid = document.getElementById('results-grid');
    const cardA = grid.querySelector(`[data-system-id="${manualOrder[idx]}"]`);
    const cardB = grid.querySelector(`[data-system-id="${manualOrder[swapIdx]}"]`);
    if (!cardA || !cardB) return;

    // Capture positions for FLIP
    const rectA = cardA.getBoundingClientRect();
    const rectB = cardB.getBoundingClientRect();

    // Swap in manualOrder
    [manualOrder[idx], manualOrder[swapIdx]] = [manualOrder[swapIdx], manualOrder[idx]];
    localStorage.setItem('ttrpg-order', JSON.stringify(manualOrder));

    // Swap DOM nodes
    if (dir === 1) cardB.after(cardA); // moving down: put A after B
    else cardB.before(cardA);          // moving up: put A before B

    // Update positions and arrows
    updateCardsAfterReorder(grid);

    // FLIP animate the two swapped cards
    flipAnimate(cardA, rectA);
    flipAnimate(cardB, rectB);
}

function flipAnimate(el, oldRect) {
    const newRect = el.getBoundingClientRect();
    const dx = oldRect.left - newRect.left;
    const dy = oldRect.top - newRect.top;
    if (dx === 0 && dy === 0) return;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    el.style.transition = 'none';
    requestAnimationFrame(() => {
        el.style.transition = 'transform 0.25s ease';
        el.style.transform = '';
        el.addEventListener('transitionend', () => { el.style.transition = ''; }, { once: true });
    });
}

function updateCardsAfterReorder(grid) {
    const cards = Array.from(grid.querySelectorAll('.result-card[data-system-id]'));
    cards.forEach((card, idx) => {
        const posEl = card.querySelector('.result-card-pos');
        if (posEl) posEl.textContent = idx + 1;
        const upBtn = card.querySelector('.rc-move-up');
        const downBtn = card.querySelector('.rc-move-down');
        if (upBtn) upBtn.classList.toggle('rc-hidden', idx === 0);
        if (downBtn) downBtn.classList.toggle('rc-hidden', idx === cards.length - 1);
    });
}

function initManualOrder() {
    const systems = SYSTEM_IDS.filter(id => !hiddenSystems.includes(id)).map(id => ({
        id,
        score: (votes[id] || []).length - (vetoes[id] || []).length
    }));
    systems.sort((a, b) => b.score - a.score);
    manualOrder = systems.map(s => s.id);
    localStorage.setItem('ttrpg-order', JSON.stringify(manualOrder));
}

function sortSystems(systems, browseMode) {
    if (browseMode || !PLAYERS) return systems;
    if (manualOrder.length) {
        systems.sort((a, b) => {
            let ia = manualOrder.indexOf(a.id);
            let ib = manualOrder.indexOf(b.id);
            if (ia === -1) ia = 9999;
            if (ib === -1) ib = 9999;
            return ia - ib;
        });
    } else {
        systems.sort((a, b) => b.score - a.score);
    }
    return systems;
}

function exportResults() {
    const browseMode = document.body.classList.contains('browse-mode');
    let systems = SYSTEM_IDS.filter(id => !hiddenSystems.includes(id)).map(id => ({
        id, name: SYSTEM_NAMES[id],
        ...getSystemTags(id),
        count: (votes[id] || []).length,
        vetoCount: (vetoes[id] || []).length,
        score: (votes[id] || []).length - (vetoes[id] || []).length,
        voters: PLAYERS ? (votes[id] || []).map(vid => PLAYERS.find(p => p.id === vid)).filter(Boolean) : [],
        vetoers: PLAYERS ? (vetoes[id] || []).map(vid => PLAYERS.find(p => p.id === vid)).filter(Boolean) : []
    }));
    if (tagFilter.size > 0) {
        systems = systems.filter(s =>
            s.tagKeys.some(k => tagFilter.has(k)) ||
            s.settingKeys.some(k => tagFilter.has(k))
        );
    }
    sortSystems(systems, browseMode);
    let lines = [];
    lines.push(t('export_header'));
    lines.push('');
    let num = 1;
    if (!browseMode && PLAYERS) {
        systems.forEach(s => {
            const isDef = deferred.includes(s.id);
            let info = isDef ? `\u23f3 ${s.name}` : s.name;
            const parts = [];
            if (s.count > 0) parts.push(`+${s.count}`);
            if (s.vetoCount > 0) parts.push(`\u2212${s.vetoCount}`);
            if (parts.length) info += ` (${parts.join(' / ')})`;
            if (s.voters.length) info += ` \u2014 ${s.voters.map(v => v.name).join(', ')}`;
            if (isDef) info += ` \u2014 ${t('status_play_later').toLowerCase()}`;
            lines.push(`${num++}. ${info}`);
        });
    } else {
        systems.forEach(s => {
            lines.push(`${num++}. ${s.name}`);
        });
    }
    const text = lines.join('\n');
    const textarea = document.getElementById('export-text');
    textarea.value = text;
    document.getElementById('export-overlay').classList.remove('hidden');
    track(browseMode ? 'export-browse' : 'export-vote');
}

function copyExport() {
    const textarea = document.getElementById('export-text');
    navigator.clipboard.writeText(textarea.value).then(() => {
        const btn = document.getElementById('export-copy-btn');
        const orig = btn.textContent;
        btn.textContent = t('copied');
        setTimeout(() => { btn.textContent = orig; }, 1500);
        track('copy-export');
    });
}

function closeExport() {
    document.getElementById('export-overlay').classList.add('hidden');
}

function toggleTagFilter(tag) {
    if (tagFilter.has(tag)) tagFilter.delete(tag);
    else tagFilter.add(tag);
    localStorage.setItem('ttrpg-tag-filter', JSON.stringify([...tagFilter]));
    renderResults();
}

function clearTagFilter() {
    tagFilter.clear();
    localStorage.setItem('ttrpg-tag-filter', '[]');
    renderResults();
}

function toggleTagFilterPanel() {
    const panel = document.getElementById('results-tag-filter');
    if (panel) panel.classList.toggle('expanded');
}

function updateTagFilterHeaderCount() {
    const panel = document.getElementById('results-tag-filter');
    if (!panel) return;
    const badge = panel.querySelector('.tag-filter-active-count');
    if (badge) badge.textContent = tagFilter.size > 0 ? `(${tagFilter.size})` : '';
}

function renderTagFilter(allSystems) {
    const panel = document.getElementById('results-tag-filter');
    if (!panel) return;
    // Collect tag counts split by category — uses already-resolved tag keys from allSystems
    // (which handles both official and custom systems)
    const playCounts = {};
    const setCounts = {};
    allSystems.forEach(s => {
        (s.tagKeys || []).forEach(k => { playCounts[k] = (playCounts[k] || 0) + 1; });
        (s.settingKeys || []).forEach(k => { setCounts[k] = (setCounts[k] || 0) + 1; });
    });
    const sortedPlay = Object.keys(playCounts).sort((a, b) => playCounts[b] - playCounts[a]);
    const sortedSet = Object.keys(setCounts).sort((a, b) => setCounts[b] - setCounts[a]);
    const totalCount = allSystems.length;

    // Fingerprint of the rendered DOM. If unchanged, only update .active classes
    // in place — avoids innerHTML rewrite + lucide re-creation (which causes flicker).
    const fingerprint = JSON.stringify({
        lang: typeof currentLang !== 'undefined' ? currentLang : '',
        n: totalCount,
        p: sortedPlay.map(k => [k, playCounts[k]]),
        s: sortedSet.map(k => [k, setCounts[k]])
    });
    if (panel.dataset.tagFingerprint === fingerprint) {
        panel.querySelectorAll('.tag-filter-btn[data-tag-key]').forEach(btn => {
            btn.classList.toggle('active', tagFilter.has(btn.dataset.tagKey));
        });
        const allBtn = panel.querySelector('.tag-filter-btn[data-tag-all]');
        if (allBtn) allBtn.classList.toggle('active', tagFilter.size === 0);
        updateTagFilterHeaderCount();
        return;
    }

    let html = `<button type="button" class="tag-filter-header" onclick="toggleTagFilterPanel()">
        <i data-lucide="sliders-horizontal"></i>
        <span class="tag-filter-title-text" data-i18n="tag_filter_title">${t('tag_filter_title')}</span>
        <span class="tag-filter-active-count"></span>
        <i data-lucide="chevron-down" class="tag-filter-chev"></i>
    </button>`;
    html += `<div class="tag-filter-body">`;
    html += `<button class="tag-filter-btn ${tagFilter.size === 0 ? 'active' : ''}" data-tag-all onclick="clearTagFilter()">
        <span class="tag-filter-label" data-i18n="tag_filter_all">${t('tag_filter_all')}</span>
        <span class="tag-filter-count">${totalCount}</span>
    </button>`;

    if (sortedPlay.length > 0) {
        html += `<div class="tag-filter-section" data-i18n="tag_filter_playstyle">${t('tag_filter_playstyle')}</div>`;
        sortedPlay.forEach(tag => {
            const cfg = TAG_CONFIG[tag];
            const isActive = tagFilter.has(tag);
            html += `<button class="tag-filter-btn ${isActive ? 'active' : ''}" data-tag-key="${tag}" onclick="toggleTagFilter('${tag}')">
                <i data-lucide="${cfg.icon}"></i>
                <span class="tag-filter-label">${cfg.label}</span>
                <span class="tag-filter-count">${playCounts[tag]}</span>
            </button>`;
        });
    }

    if (sortedSet.length > 0) {
        html += `<div class="tag-filter-section" data-i18n="tag_filter_setting">${t('tag_filter_setting')}</div>`;
        sortedSet.forEach(tag => {
            const cfg = SETTING_TAG_CONFIG[tag];
            const isActive = tagFilter.has(tag);
            html += `<button class="tag-filter-btn setting ${isActive ? 'active' : ''}" data-tag-key="${tag}" onclick="toggleTagFilter('${tag}')">
                <i data-lucide="${cfg.icon}"></i>
                <span class="tag-filter-label">${cfg.label}</span>
                <span class="tag-filter-count">${setCounts[tag]}</span>
            </button>`;
        });
    }
    html += `</div>`;

    panel.innerHTML = html;
    panel.dataset.tagFingerprint = fingerprint;
    updateTagFilterHeaderCount();
    refreshIcons();
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
    const allSystems = SYSTEM_IDS.filter(id => !hiddenSystems.includes(id)).map(id => {
        const sysData = SYSTEMS_DATA[id];
        const customSys = sysData ? null : CustomSystems.find(id);
        const page = document.getElementById(id);
        const heroImg = sysData ? sysData.heroImage : (customSys?.image || page?.querySelector('.hero-banner img')?.src || '');
        const tagline = sysData ? localField(sysData, 'tagline') : (customSys?.tagline || page?.querySelector('.tagline')?.textContent || '');
        const { tagKeys, settingKeys } = getSystemTags(id);
        const tags = tagKeys.map(tag => {
            const cfg = TAG_CONFIG[tag];
            return cfg ? cfg.label : tag;
        });
        return {
            id, name: SYSTEM_NAMES[id], heroImg, tagline, tags, tagKeys, settingKeys,
            voters: PLAYERS ? (votes[id] || []).map(vid => PLAYERS.find(p => p.id === vid)).filter(Boolean) : [],
            vetoers: PLAYERS ? (vetoes[id] || []).map(vid => PLAYERS.find(p => p.id === vid)).filter(Boolean) : [],
            count: (votes[id] || []).length,
            vetoCount: (vetoes[id] || []).length,
            score: (votes[id] || []).length - (vetoes[id] || []).length
        };
    });

    // Render tag filter sidebar (uses unfiltered system list for stable counts)
    renderTagFilter(allSystems);

    // Apply tag filter (OR semantics: system shown if it matches ANY selected tag from EITHER category)
    const systems = tagFilter.size === 0
        ? allSystems
        : allSystems.filter(s =>
            s.tagKeys.some(k => tagFilter.has(k)) ||
            s.settingKeys.some(k => tagFilter.has(k))
        );

    sortSystems(systems, browseMode);

    const votingMode = !browseMode && PLAYERS;
    // Force list view in voting mode
    const effectiveView = votingMode ? 'list' : currentView;
    grid.classList.toggle('list-view', effectiveView === 'list');
    document.querySelectorAll('.view-toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === effectiveView);
        btn.style.display = votingMode ? 'none' : '';
    });
    // No section split — deferred is just a visual marker

    // Global position counter for numbering across sections
    let posNum = 0;

    function renderCard(s, idx, total) {
        posNum++;
        const hasVotes = s.count > 0 || s.vetoCount > 0;
        const votesHTML = votingMode && hasVotes ? `
            <div class="result-card-votes">
                ${s.count > 0 ? `<span class="result-card-vote-count">+${s.count}</span>` : ''}
                ${s.voters.map(v => `<span class="result-voter-chip" style="background:${v.color}20;color:${v.color}">${v.name}</span>`).join('')}
                ${s.vetoCount > 0 ? `<span class="result-card-veto-count">\u2212${s.vetoCount}</span>` : ''}
                ${s.vetoers.map(v => `<span class="result-voter-chip result-vetoer-chip" style="background:${v.color}20;color:${v.color}">${v.name}</span>`).join('')}
            </div>` : '';
        const isCustom = !!CustomSystems.find(s.id);
        const badgeHTML = isCustom ? '<span class="custom-badge"><i data-lucide="user"></i></span>' : '';
        const isDef = deferred.includes(s.id);
        const actionsHTML = votingMode ? `
            <div class="result-card-actions">
                <button class="rc-action-btn rc-move-up ${idx <= 0 ? 'rc-hidden' : ''}" onclick="moveSystem('${s.id}', -1, event)" title="${t('move_up')}" aria-label="${t('aria_move_up')}"><i data-lucide="chevron-up" aria-hidden="true"></i></button>
                <button class="rc-action-btn rc-move-down ${idx >= total - 1 ? 'rc-hidden' : ''}" onclick="moveSystem('${s.id}', 1, event)" title="${t('move_down')}" aria-label="${t('aria_move_down')}"><i data-lucide="chevron-down" aria-hidden="true"></i></button>
                <button class="rc-action-btn rc-defer-btn ${isDef ? 'active' : ''}" onclick="toggleDeferred('${s.id}', event)" title="${isDef ? t('status_play_now') : t('status_play_later')}" aria-label="${t('aria_defer')}"><i data-lucide="clock" aria-hidden="true"></i></button>
            </div>` : '';
        const posHTML = votingMode ? `<div class="result-card-pos">${posNum}</div>` : '';
        const dragAttrs = votingMode ? `draggable="true" data-system-id="${s.id}"` : '';
        const leftColHTML = votingMode ? `<div class="result-card-left">${posHTML}${actionsHTML}</div>` : posHTML;
        return `<div class="result-card ${isDef ? 'result-card-deferred' : ''}" ${dragAttrs} onclick="if(typeof _didDrag!=='undefined'&&_didDrag){_didDrag=false;return}showPage('${s.id}')">
            ${leftColHTML}
            ${badgeHTML}
            <img class="result-card-img" src="${heroThumb(s.heroImg)}" alt="${s.name}" loading="lazy" decoding="async" onerror="this.style.background='linear-gradient(135deg,#1a1a2e,#0f3460)'">
            <div class="result-card-body">
                <div class="result-card-name">${s.name}</div>
                <div class="result-card-tagline">${s.tagline}</div>
                <div class="result-card-tags">${s.tags.slice(0, 3).map(t => `<span class="result-card-tag">${t}</span>`).join('')}</div>
                ${votesHTML}
            </div>
        </div>`;
    }

    const html = systems.map((s, i) => renderCard(s, i, systems.length)).join('');

    grid.innerHTML = html;
    refreshIcons();
    if (votingMode) initDragAndDrop(grid);
}

// ============ DRAG AND DROP ============
let _dragId = null;
let _didDrag = false;

function initDragAndDrop(grid) {
    // Per-card listeners only for dragstart/dragend (need to know source)
    grid.querySelectorAll('.result-card[draggable]').forEach(card => {
        card.addEventListener('dragstart', onDragStart);
        card.addEventListener('dragend', onDragEnd);
    });
    // Grid-level listeners — both dragenter AND dragover MUST preventDefault for drop to fire
    grid.addEventListener('dragenter', onGridDragEnter);
    grid.addEventListener('dragover', onGridDragOver);
    grid.addEventListener('drop', onGridDrop);
    grid.addEventListener('dragleave', onGridDragLeave);
}

function onGridDragEnter(e) {
    e.preventDefault();
}

function findTargetCard(clientX, clientY) {
    // Returns the topmost result-card under the cursor that is NOT the source
    const elements = document.elementsFromPoint(clientX, clientY);
    for (const el of elements) {
        const card = el.closest && el.closest('.result-card[data-system-id]');
        if (card && card.dataset.systemId !== _dragId) return card;
    }
    return null;
}

function onDragStart(e) {
    _dragId = this.dataset.systemId;
    _didDrag = true;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', _dragId);
    setTimeout(() => this.style.opacity = '0.4', 0);
}

function onDragEnd(e) {
    this.classList.remove('dragging');
    this.style.opacity = '';
    document.querySelectorAll('.result-card.drag-over').forEach(c => c.classList.remove('drag-over'));
    _dragId = null;
    setTimeout(() => { _didDrag = false; }, 0);
}

function onGridDragOver(e) {
    if (!_dragId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const target = findTargetCard(e.clientX, e.clientY);
    document.querySelectorAll('.result-card.drag-over').forEach(c => {
        if (c !== target) c.classList.remove('drag-over');
    });
    if (target) target.classList.add('drag-over');
}

function onGridDragLeave(e) {
    // Only clear if leaving the grid entirely
    if (e.target === e.currentTarget) {
        document.querySelectorAll('.result-card.drag-over').forEach(c => c.classList.remove('drag-over'));
    }
}

function onGridDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    document.querySelectorAll('.result-card.drag-over').forEach(c => c.classList.remove('drag-over'));

    const fromId = _dragId;
    if (!fromId) return;

    const grid = document.getElementById('results-grid');
    const fromCard = grid.querySelector(`[data-system-id="${fromId}"]`);
    if (!fromCard) return;

    // Find target card under cursor (excluding source)
    const toCard = findTargetCard(e.clientX, e.clientY);
    if (!toCard) return;

    // Determine direction: if source is BEFORE target in DOM → dragging DOWN → insert AFTER target
    // If source is AFTER target → dragging UP → insert BEFORE target
    // This ensures any drop on a different card produces a real move (no no-ops).
    const cards = Array.from(grid.querySelectorAll('.result-card[data-system-id]'));
    const fromIdx = cards.indexOf(fromCard);
    const toIdx = cards.indexOf(toCard);
    if (fromIdx === -1 || toIdx === -1) return;
    const draggingDown = fromIdx < toIdx;

    // Capture FLIP positions BEFORE moving
    const firstRects = {};
    cards.forEach(c => { firstRects[c.dataset.systemId] = c.getBoundingClientRect(); });

    // Reset source visual so FLIP animation works
    fromCard.style.opacity = '';
    fromCard.classList.remove('dragging');

    // Move DOM node
    if (draggingDown) toCard.after(fromCard);
    else toCard.before(fromCard);

    // Derive new manualOrder directly from DOM
    manualOrder = Array.from(grid.querySelectorAll('.result-card[data-system-id]'))
        .map(c => c.dataset.systemId);
    localStorage.setItem('ttrpg-order', JSON.stringify(manualOrder));

    // Update position numbers and arrow visibility
    updateCardsAfterReorder(grid);

    // FLIP animate all affected cards
    cards.forEach(c => {
        const oldR = firstRects[c.dataset.systemId];
        if (oldR) flipAnimate(c, oldR);
    });
}

// ============ NAV SEARCH ============
function filterNav(query) {
    const q = query.toLowerCase().trim();
    document.querySelectorAll('.nav-systems .nav-group').forEach(group => {
        let anyVisible = false;
        group.querySelectorAll('.nav-item').forEach(item => {
            const name = item.textContent.toLowerCase();
            const show = !q || name.includes(q);
            item.style.display = show ? '' : 'none';
            if (show) anyVisible = true;
        });
        group.style.display = anyVisible ? '' : 'none';
    });
}

// ============ NAVIGATION ============
function openSidebar() {
    document.querySelector('.sidebar').classList.add('open');
    document.querySelector('.sidebar-backdrop').classList.add('open');
    document.body.classList.add('sidebar-open');
    document.querySelector('.sidebar-close')?.focus();
}
function closeSidebar() {
    document.querySelector('.sidebar').classList.remove('open');
    document.querySelector('.sidebar-backdrop').classList.remove('open');
    document.body.classList.remove('sidebar-open');
    document.querySelector('.hamburger')?.focus();
}

function showPage(id, pushHistory = true) {
    document.querySelectorAll('.system-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    // Lazy-render system page on demand
    if (id !== 'results') {
        ensureSystemRendered(id);
        renderVoteButtons(id);
    }
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
    updatePresCounter();
    // Auto-close sidebar on mobile after navigation
    if (window.innerWidth <= 768) closeSidebar();
}

function updatePresCounter() {
    const el = document.getElementById('pres-counter');
    if (!el) return;
    const visible = getVisibleSystemIds();
    const active = document.querySelector('.system-page.active');
    if (!active || active.id === 'results' || !visible.length) {
        el.textContent = '';
        return;
    }
    const idx = visible.indexOf(active.id);
    if (idx === -1) { el.textContent = ''; return; }
    el.textContent = `${idx + 1} / ${visible.length}`;
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
    updatePresCounter();
}

document.addEventListener('keydown', e => {
    if (document.getElementById('setup-overlay') && !document.getElementById('setup-overlay').classList.contains('hidden')) return;
    // Close system selector on Escape
    const sysSelector = document.getElementById('sys-selector-overlay');
    if (sysSelector && !sysSelector.classList.contains('hidden')) {
        if (e.key === 'Escape') closeSystemSelector();
        return;
    }
    // Close export on Escape
    const exportOverlay = document.getElementById('export-overlay');
    if (exportOverlay && !exportOverlay.classList.contains('hidden')) {
        if (e.key === 'Escape') closeExport();
        return;
    }
    // Close editor on Escape
    const editorOverlay = document.getElementById('editor-overlay');
    if (editorOverlay && !editorOverlay.classList.contains('hidden')) {
        if (e.key === 'Escape') closeEditor();
        return;
    }
    // Mobile sidebar: Escape closes, Tab traps focus inside drawer
    if (document.body.classList.contains('sidebar-open')) {
        if (e.key === 'Escape') { closeSidebar(); return; }
        if (e.key === 'Tab') {
            const sidebar = document.querySelector('.sidebar');
            const focusables = sidebar.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])');
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            return;
        }
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
            <img src="${img.src}" alt="${img.cap}" onload="this.dataset.loaded='1'">
            <div class="lightbox-spinner"></div>
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
        delete vetoes[id];
        localStorage.setItem('ttrpg-votes', JSON.stringify(votes));
        localStorage.setItem('ttrpg-vetoes', JSON.stringify(vetoes));
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
                const cb = document.querySelector(`.editor-tag-check input[value="${tag}"]:not([data-cat="setting"])`);
                if (cb) cb.checked = true;
            });
            (sys.settingTags || []).forEach(tag => {
                const cb = document.querySelector(`.editor-tag-check input[data-cat="setting"][value="${tag}"]`);
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
    const settingTags = [];
    document.querySelectorAll('.editor-tag-check input:checked').forEach(cb => {
        if (cb.dataset.cat === 'setting') settingTags.push(cb.value);
        else tags.push(cb.value);
    });

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
        settingTags: settingTags,
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
    const settingTagsHTML = (sys.settingTags || []).map(tag => {
        const cfg = SETTING_TAG_CONFIG[tag] || { icon: 'map-pin', label: tag };
        return '<span class="playstyle-tag setting-tag"><i data-lucide="' + cfg.icon + '"></i> ' + cfg.label + '</span>';
    }).join('');
    const allTagsHTML = tagsHTML + settingTagsHTML;

    const customHeroSys = {
        name: sys.name,
        publisher: sys.publisher,
        heroImage: sys.image,
        heroStyle: sys.image ? '' : 'background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)',
    };

    const escId = sys.id.replace(/'/g, "\\'");
    const editBtn = ' <button class="custom-edit-btn" onclick="event.stopPropagation();openEditor(\'' + escId + '\')"><i data-lucide="pencil"></i> Edit</button>' +
        ' <button class="custom-edit-btn custom-submit-btn" id="submit-btn-' + sys.id + '" onclick="event.stopPropagation();submitCustomSystemById(\'' + escId + '\')"><i data-lucide="send"></i> <span data-i18n="editor_submit">' + t('editor_submit') + '</span></button>';

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
        (allTagsHTML ? '<div class="section-title" data-i18n="section_playstyle">' + t('section_playstyle') + '</div><div class="playstyle-tags">' + allTagsHTML + '</div>' : '') +
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

async function submitCustomSystemById(id) {
    const sys = CustomSystems.find(id);
    if (!sys) return;

    const btn = document.getElementById('submit-btn-' + id);
    if (!btn) return;
    const label = btn.querySelector('span');
    const original = label.textContent;
    label.textContent = t('editor_submit_sending');
    btn.disabled = true;

    try {
        const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                access_key: '23fd8c3c-3ebc-4a65-a73e-373385fb9c0b',
                subject: 'Session Zero — System Suggestion: ' + sys.name,
                from_name: 'Session Zero',
                system_json: JSON.stringify(sys, null, 2)
            })
        });
        const data = await res.json();
        label.textContent = res.ok ? t('editor_submit_ok') : t('editor_submit_fail');
    } catch (e) {
        label.textContent = t('editor_submit_fail');
    }

    setTimeout(() => { label.textContent = original; btn.disabled = false; }, 2000);
}

function renderCustomSystems() {
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

// Manage Systems modal: tag filter (in-memory, not persisted)
let _selectorTagFilter = new Set();

function toggleSelectorTagFilter(tag) {
    if (_selectorTagFilter.has(tag)) _selectorTagFilter.delete(tag);
    else _selectorTagFilter.add(tag);
    renderSelectorTagFilter();
    rebuildSelectorList();
}

function clearSelectorTagFilter() {
    _selectorTagFilter.clear();
    renderSelectorTagFilter();
    rebuildSelectorList();
}

function renderSelectorTagFilter() {
    const panel = document.getElementById('sys-selector-tag-filter');
    if (!panel) return;
    // Collect available tag keys from all systems (official + custom)
    const playCounts = {};
    const setCounts = {};
    const allIds = SYSTEM_IDS.concat(CustomSystems.all.map(s => s.id));
    const seen = new Set();
    allIds.forEach(id => {
        if (seen.has(id)) return;
        seen.add(id);
        const { tagKeys, settingKeys } = getSystemTags(id);
        tagKeys.forEach(k => { playCounts[k] = (playCounts[k] || 0) + 1; });
        settingKeys.forEach(k => { setCounts[k] = (setCounts[k] || 0) + 1; });
    });
    const sortedPlay = Object.keys(playCounts).sort((a, b) => playCounts[b] - playCounts[a]);
    const sortedSet = Object.keys(setCounts).sort((a, b) => setCounts[b] - setCounts[a]);

    let html = `<button class="tag-filter-btn ${_selectorTagFilter.size === 0 ? 'active' : ''}" onclick="clearSelectorTagFilter()">
        <span class="tag-filter-label" data-i18n="tag_filter_all">${t('tag_filter_all')}</span>
    </button>`;
    if (sortedPlay.length > 0) {
        html += `<div class="tag-filter-section" data-i18n="tag_filter_playstyle">${t('tag_filter_playstyle')}</div>`;
        sortedPlay.forEach(tag => {
            const cfg = TAG_CONFIG[tag];
            const isActive = _selectorTagFilter.has(tag);
            html += `<button class="tag-filter-btn ${isActive ? 'active' : ''}" onclick="toggleSelectorTagFilter('${tag}')">
                <i data-lucide="${cfg.icon}"></i>
                <span class="tag-filter-label">${cfg.label}</span>
                <span class="tag-filter-count">${playCounts[tag]}</span>
            </button>`;
        });
    }
    if (sortedSet.length > 0) {
        html += `<div class="tag-filter-section" data-i18n="tag_filter_setting">${t('tag_filter_setting')}</div>`;
        sortedSet.forEach(tag => {
            const cfg = SETTING_TAG_CONFIG[tag];
            const isActive = _selectorTagFilter.has(tag);
            html += `<button class="tag-filter-btn setting ${isActive ? 'active' : ''}" onclick="toggleSelectorTagFilter('${tag}')">
                <i data-lucide="${cfg.icon}"></i>
                <span class="tag-filter-label">${cfg.label}</span>
                <span class="tag-filter-count">${setCounts[tag]}</span>
            </button>`;
        });
    }
    panel.innerHTML = html;

    // Update summary badge in the details summary
    const sumEl = document.getElementById('sys-selector-tag-summary');
    if (sumEl) {
        sumEl.textContent = _selectorTagFilter.size > 0 ? `(${_selectorTagFilter.size})` : '';
    }
    refreshIcons();
}

function systemMatchesTagFilter(id) {
    if (_selectorTagFilter.size === 0) return true;
    const { tagKeys, settingKeys } = getSystemTags(id);
    return tagKeys.some(k => _selectorTagFilter.has(k)) ||
           settingKeys.some(k => _selectorTagFilter.has(k));
}

function attachGroupToggle(title) {
    title.addEventListener('click', function() {
        var next = title.nextElementSibling;
        if (!next || !next.classList.contains('sys-selector-list')) return;
        var boxes = next.querySelectorAll('input[type="checkbox"]');
        var groupCb = title.querySelector('.group-toggle-cb');
        var allChecked = Array.from(boxes).every(function(cb) { return cb.checked; });
        boxes.forEach(function(cb) {
            cb.checked = !allChecked;
            cb.closest('label').classList.toggle('disabled-sys', allChecked);
        });
        if (groupCb) groupCb.checked = !allChecked;
    });
}

function buildTagIconsHTML(id) {
    const { tagKeys, settingKeys } = getSystemTags(id);
    let html = '';
    tagKeys.forEach(k => {
        const cfg = TAG_CONFIG[k];
        html += `<i class="sys-tag-icon" data-lucide="${cfg.icon}" title="${cfg.label}"></i>`;
    });
    settingKeys.forEach(k => {
        const cfg = SETTING_TAG_CONFIG[k];
        html += `<i class="sys-tag-icon setting" data-lucide="${cfg.icon}" title="${cfg.label}"></i>`;
    });
    return html ? `<span class="sys-tag-icons">${html}</span>` : '';
}

function buildSelectorItem(id, name, isChecked) {
    const item = document.createElement('label');
    item.className = 'sys-selector-item' + (!isChecked ? ' disabled-sys' : '');
    item.innerHTML = '<input type="checkbox" data-sys-id="' + id + '"' + (isChecked ? ' checked' : '') + '>'
        + '<span class="sys-name">' + name + '</span>'
        + buildTagIconsHTML(id);
    item.querySelector('input').addEventListener('change', function() {
        item.classList.toggle('disabled-sys', !this.checked);
    });
    return item;
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
        var visibleIds = group.ids.filter(systemMatchesTagFilter);
        if (visibleIds.length === 0) return;

        var title = document.createElement('div');
        title.className = 'sys-selector-group-title';
        title.innerHTML = '<input type="checkbox" checked class="group-toggle-cb"> ' + t(group.key);
        attachGroupToggle(title);
        list.appendChild(title);

        var container = document.createElement('div');
        container.className = 'sys-selector-list';
        visibleIds.forEach(function(id) {
            var name = SYSTEM_NAMES[id] || id;
            var isHidden = hiddenSystems.includes(id);
            var isChecked = (id in checked) ? checked[id] : !isHidden;
            container.appendChild(buildSelectorItem(id, name, isChecked));
        });
        list.appendChild(container);
    });

    // Custom systems
    if (CustomSystems.length > 0) {
        var visibleCustom = CustomSystems.all.filter(function(sys) { return systemMatchesTagFilter(sys.id); });
        if (visibleCustom.length > 0) {
            var title = document.createElement('div');
            title.className = 'sys-selector-group-title';
            title.innerHTML = '<input type="checkbox" checked class="group-toggle-cb"> ' + t('nav_group_custom');
            attachGroupToggle(title);
            list.appendChild(title);

            var container = document.createElement('div');
            container.className = 'sys-selector-list';
            visibleCustom.forEach(function(sys) {
                var isHidden = hiddenSystems.includes(sys.id);
                var isChecked = (sys.id in checked) ? checked[sys.id] : !isHidden;
                container.appendChild(buildSelectorItem(sys.id, sys.name, isChecked));
            });
            list.appendChild(container);
        }
    }
    refreshIcons();
}

function openSystemSelector() {
    _selectorGrouping = currentGrouping;
    _selectorTagFilter.clear();
    document.querySelectorAll('#selector-grouping-toggle .grouping-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.grouping === currentGrouping);
    });
    renderSelectorTagFilter();
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
    // Visible (rendered) checkboxes are authoritative for systems matching the filter.
    // Systems filtered out keep their previous hidden state — preserves filter+save UX.
    const visibleIds = new Set();
    const newHidden = new Set();
    document.querySelectorAll('#sys-selector-list input[data-sys-id]').forEach(cb => {
        visibleIds.add(cb.dataset.sysId);
        if (!cb.checked) newHidden.add(cb.dataset.sysId);
    });
    // Carry over previous state for filtered-out systems
    hiddenSystems.forEach(id => {
        if (!visibleIds.has(id)) newHidden.add(id);
    });
    hiddenSystems = [...newHidden];
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
    // First-time visitor: overlay stays hidden (SEO: no intrusive interstitial).
    // Land directly on the catalog in browse mode; overlay opens via the
    // sidebar "Настроить игроков и голосование" button (enableVoting()).
    document.body.classList.add('browse-mode');
    initApp();
}
refreshIcons();
