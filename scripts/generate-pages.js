#!/usr/bin/env node
// ============================================================================
// Session Zero — Static Site Generator
// ----------------------------------------------------------------------------
// Reads data/systems/*.js, renders per-system EN + RU static HTML pages,
// an about page in both languages, and regenerates sitemap.xml.
//
// Run via: npm run bundle  (which calls this after building systems-bundle.js)
// Node stdlib only — no deps. Uses `vm` to evaluate registerSystem() calls.
// ============================================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data', 'systems');
const OUT_SYSTEM = path.join(ROOT, 'system');
const OUT_RU = path.join(ROOT, 'ru');
const OUT_RU_SYSTEM = path.join(OUT_RU, 'system');
const SITEMAP = path.join(ROOT, 'sitemap.xml');
const ABOUT_EN = path.join(ROOT, 'about.html');
const ABOUT_RU = path.join(OUT_RU, 'about.html');

const SITE = 'https://sessionzero.games';
const TODAY = '2026-04-22';
const FALLBACK_OG = SITE + '/og-image.png';

// ---------- 1. Load systems via vm sandbox ----------
const SYSTEMS = {};
const sandbox = vm.createContext({
  registerSystem: (id, data) => { SYSTEMS[id] = data; }
});

const files = fs.readdirSync(DATA_DIR)
  .filter(f => f.endsWith('.js') && !f.startsWith('_'))
  .sort();

for (const f of files) {
  const src = fs.readFileSync(path.join(DATA_DIR, f), 'utf8');
  try {
    vm.runInContext(src, sandbox, { filename: f });
  } catch (e) {
    console.error(`[generate-pages] failed to parse ${f}:`, e.message);
    process.exit(1);
  }
}

const ids = Object.keys(SYSTEMS).sort();
console.log(`[generate-pages] loaded ${ids.length} systems`);

// ---------- 2. Helpers ----------
function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// For text going into element bodies where em-dashes, curly quotes etc.
// should render as-is. Still escape &, <, > to avoid HTML injection.
function escBody(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Basic inline markdown: **bold** and paragraph breaks.
function miniMd(s) {
  if (!s) return '';
  return escBody(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n+/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

function truncate(s, n) {
  s = String(s || '').replace(/\s+/g, ' ').trim();
  if (s.length <= n) return s;
  return s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…';
}

function pickLang(sys, field, lang, fallback) {
  const lb = sys[lang] && sys[lang][field];
  if (lb != null && lb !== '') return lb;
  if (sys[field] != null && sys[field] !== '') return sys[field];
  return fallback !== undefined ? fallback : '';
}

// Merge localized array: top-level provides src/icon/url/type/fmt,
// the language block provides title/text/cap/name.
function mergeArr(base, trans) {
  base = base || [];
  trans = trans || [];
  return base.map((item, i) => Object.assign({}, item, trans[i] || {}));
}

// wsrv.nl CDN proxy — same as app.js heroFull().
function imgProxy(url, w, h, fit) {
  if (!url) return '';
  let p = 'url=' + encodeURIComponent(url);
  if (w) p += '&w=' + w;
  if (h) p += '&h=' + h;
  if (fit) p += '&fit=' + fit;
  p += '&output=webp&q=80';
  return 'https://wsrv.nl/?' + p;
}
const heroFull = url => imgProxy(url, 1200, 600, 'cover');
const galleryThumb = url => imgProxy(url, 300, 300, 'cover');

// Pick up to `count` systems similar to `id`, using groups.family first,
// falling back to groups.genre, then groups.default. Excludes the source
// system. Order within a bucket follows the `order` field on the group,
// then alphabetical by id for stability.
function pickSimilar(id, allSystems, count = 3) {
  const src = allSystems[id];
  if (!src || !src.groups) return [];

  const pickBy = (groupKey) => {
    const g = src.groups[groupKey];
    if (!g || !g.key) return [];
    const matches = [];
    for (const otherId of Object.keys(allSystems)) {
      if (otherId === id) continue;
      const other = allSystems[otherId];
      const og = other.groups && other.groups[groupKey];
      if (og && og.key === g.key) {
        matches.push({ id: otherId, order: Number(og.order) || 999 });
      }
    }
    matches.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
    return matches.map(m => m.id);
  };

  const out = [];
  const seen = new Set();
  for (const key of ['family', 'genre', 'default']) {
    if (out.length >= count) break;
    for (const candidateId of pickBy(key)) {
      if (out.length >= count) break;
      if (seen.has(candidateId)) continue;
      seen.add(candidateId);
      out.push(candidateId);
    }
  }
  return out.slice(0, count);
}

// ---------- 3. Localized UI strings ----------
const STR = {
  en: {
    section_system: 'What is this system',
    section_setting: 'Setting',
    section_vignette: 'What it looks like at the table',
    section_playstyle: 'Playstyle',
    section_mechanics: 'Key mechanics',
    section_reviews: 'What people say',
    section_gallery: 'Art & materials',
    section_resources: 'Free resources',
    section_similar: 'Similar systems',
    qs_dice: 'Dice',
    qs_players: 'Players',
    qs_prep: 'Prep',
    qs_foundry: 'Foundry VTT',
    qs_complexity: 'Complexity',
    back_to_catalog: '← Session Zero',
    vote_cta: name => `Vote on ${name} with your group →`,
    vote_cta_sub: 'Open in Session Zero to let every player vote and see the results.',
    footer_home: 'Home',
    footer_about: 'About',
    breadcrumb_home: 'Session Zero',
    lang_en: 'EN',
    lang_ru: 'RU',
    about_title: 'About — Session Zero',
    about_meta_desc: 'Can\'t agree on what TTRPG to play next? Session Zero is a free tool that lets your group vote together and see a shortlist. 44 systems, no signup, bilingual.',
    article_genre: 'Tabletop role-playing game',
  },
  ru: {
    section_system: 'Что это за система',
    section_setting: 'Сеттинг',
    section_vignette: 'Как это выглядит за столом',
    section_playstyle: 'Плейстайл',
    section_mechanics: 'Особенности механики',
    section_reviews: 'Что говорят на Reddit',
    section_gallery: 'Арт и материалы',
    section_resources: 'Бесплатные материалы',
    section_similar: 'Похожие системы',
    qs_dice: 'Кубики',
    qs_players: 'Игроки',
    qs_prep: 'Преп',
    qs_foundry: 'Foundry VTT',
    qs_complexity: 'Сложность',
    back_to_catalog: '← Session Zero',
    vote_cta: name => `Проголосуйте за ${name} всей группой →`,
    vote_cta_sub: 'Откройте в Session Zero, чтобы каждый игрок проголосовал и увидел итоги.',
    footer_home: 'Главная',
    footer_about: 'О проекте',
    breadcrumb_home: 'Session Zero',
    lang_en: 'EN',
    lang_ru: 'RU',
    about_title: 'О проекте — Session Zero',
    about_meta_desc: 'Не можете договориться, во что играть следующей кампанией? Session Zero — бесплатный инструмент для группового голосования с шортлистом. 44 системы, без регистрации, билингв.',
    article_genre: 'Настольная ролевая игра',
  },
};

// Tag labels + icons, mirrored from app.js
const TAG_ICONS = {
  explore: 'compass', combat: 'swords', narrative: 'book-open',
  horror: 'ghost', social: 'users', mystery: 'search',
  survival: 'skull', worldbuild: 'globe', tactical: 'crosshair',
  sandbox: 'map', action: 'zap', solo: 'user',
};
const SETTING_TAG_ICONS = {
  space: 'rocket', fantasy: 'castle', cyberpunk: 'cpu',
  modern: 'building-2', postapoc: 'radiation', historical: 'landmark',
  weird: 'sparkles', 'urban-fantasy': 'building',
};
const TAG_LABELS = {
  en: {
    explore: 'Exploration', combat: 'Combat', narrative: 'Narrative',
    horror: 'Horror', social: 'Social', mystery: 'Mystery',
    survival: 'Survival', tactical: 'Tactical', sandbox: 'Sandbox',
    worldbuild: 'Worldbuilding', solo: 'Solo',
    space: 'Space', fantasy: 'Fantasy', cyberpunk: 'Cyberpunk',
    modern: 'Modern', postapoc: 'Post-Apoc', historical: 'Historical',
    weird: 'Weird', 'urban-fantasy': 'Urban Fantasy',
  },
  ru: {
    explore: 'Исследование',
    combat: 'Боёвка',
    narrative: 'Нарратив',
    horror: 'Хоррор',
    social: 'Социалка',
    mystery: 'Детектив',
    survival: 'Выживание',
    tactical: 'Тактика',
    sandbox: 'Песочница',
    worldbuild: 'Мироздание',
    solo: 'Соло',
    space: 'Космос',
    fantasy: 'Фэнтези',
    cyberpunk: 'Киберпанк',
    modern: 'Современность',
    postapoc: 'Постапок',
    historical: 'История',
    weird: 'Странное',
    'urban-fantasy': 'Городское фэнтези',
  },
};
const RES_LABELS = {
  en: { link: 'Website', sheet: 'Sheet', quickstart: 'Quickstart', rules: 'Rules', map: 'Map', tool: 'Tool' },
  ru: { link: 'Сайт', sheet: 'Лист', quickstart: 'Quickstart', rules: 'Правила', map: 'Карта', tool: 'Инструмент' },
};
const RES_ICONS = {
  link: 'external-link', sheet: 'file-text', quickstart: 'book-open',
  rules: 'scroll-text', map: 'map', tool: 'wrench',
};

// ---------- 4. Renderers ----------
function complexityBar(level) {
  level = Number(level) || 0;
  let out = '';
  for (let n = 1; n <= 5; n++) {
    let cls = 'complexity-pip';
    if (n <= level) cls += ' filled';
    if (n >= 4 && level >= 4) cls += ' warn';
    if (n >= 5 && level >= 5) cls += ' danger';
    out += `<div class="${cls}"></div>`;
  }
  return out;
}

function renderSystemPage(id, sys, lang) {
  const S = STR[lang];
  const name = sys.name || id;
  const tagline = pickLang(sys, 'tagline', lang);
  const description = pickLang(sys, 'description', lang);
  const setting = pickLang(sys, 'setting', lang);
  const vignette = pickLang(sys, 'vignette', lang, null);
  const prep = pickLang(sys, 'prep', lang, '—');
  const foundry = sys.foundryStatus || '—';
  const publisher = sys.publisher || '';

  const mechanics = mergeArr(sys.mechanics, sys[lang] && sys[lang].mechanics);
  const gallery = mergeArr(sys.gallery, sys[lang] && sys[lang].gallery);
  const resources = mergeArr(sys.resources, sys[lang] && sys[lang].resources);

  const canonical = lang === 'en'
    ? `${SITE}/system/${id}.html`
    : `${SITE}/ru/system/${id}.html`;
  const enUrl = `${SITE}/system/${id}.html`;
  const ruUrl = `${SITE}/ru/system/${id}.html`;

  const ogImage = `${SITE}/og/${id}.jpg`;
  const metaDescSource = description || tagline || name;
  const metaDesc = truncate(metaDescSource, 155);

  const title = `${name} — Session Zero`;

  // Playstyle + setting tags
  const playTags = (sys.playstyleTags || []).map(tag => {
    const icon = TAG_ICONS[tag] || 'tag';
    const label = (TAG_LABELS[lang][tag]) || tag;
    return `<span class="playstyle-tag tag-${escapeHtml(tag)}"><i data-lucide="${escapeHtml(icon)}"></i> ${escBody(label)}</span>`;
  }).join('');
  const settingTags = (sys.settingTags || []).map(tag => {
    const icon = SETTING_TAG_ICONS[tag] || 'map-pin';
    const label = (TAG_LABELS[lang][tag]) || tag;
    return `<span class="playstyle-tag setting-tag"><i data-lucide="${escapeHtml(icon)}"></i> ${escBody(label)}</span>`;
  }).join('');

  const mechanicsHTML = mechanics.map(m => {
    if (!m || !m.title) return '';
    const icon = m.icon || 'dice-5';
    return `<div class="card"><h4><i data-lucide="${escapeHtml(icon)}"></i> ${escBody(m.title)}</h4><p>${escBody(m.text || '')}</p></div>`;
  }).join('');

  const quotesHTML = (sys.quotes || []).map(q =>
    `<div class="reddit-quote">${escBody(q.text)}<span class="reddit-user">— ${escBody(q.author || '')}</span></div>`
  ).join('');

  const vignetteHTML = vignette
    ? `<div class="section-title">${escBody(S.section_vignette)}</div>
    <div class="setting-block" style="border-left: 3px solid var(--accent); font-style: italic;">${miniMd(vignette)}</div>`
    : '';

  const galleryHTML = gallery.length ? `
    <div class="section-title">${escBody(S.section_gallery)}</div>
    <div class="gallery">
        <div class="gallery-grid">
            ${gallery.filter(g => g && g.src).map(img => `
                <div class="gallery-item static">
                    <img src="${escapeHtml(galleryThumb(img.src))}" alt="${escapeHtml(img.cap || name)}" loading="lazy" decoding="async">
                    <div class="gallery-overlay">
                        <div><div class="gallery-caption">${escBody(img.cap || '')}</div></div>
                    </div>
                </div>`).join('')}
        </div>
    </div>` : '';

  // Similar systems block — 3 nearby systems by family → genre → default.
  const similarIds = pickSimilar(id, SYSTEMS, 3);
  const similarHTML = similarIds.length ? `
    <div class="section-title">${escBody(S.section_similar)}</div>
    <div class="similar-systems-grid">
        ${similarIds.map(sid => {
          const ssys = SYSTEMS[sid];
          const sname = ssys.name || sid;
          const sHref = lang === 'en'
            ? `/system/${sid}.html`
            : `/ru/system/${sid}.html`;
          const sOg = `${SITE}/og/${sid}.jpg`;
          const sAlt = `${sname} hero art`;
          return `<a href="${escapeHtml(sHref)}" class="similar-system-card">
            <img src="${escapeHtml(sOg)}" alt="${escapeHtml(sAlt)}" loading="lazy" decoding="async">
            <span class="similar-system-name">${escBody(sname)}</span>
          </a>`;
        }).join('')}
    </div>` : '';

  const resourcesHTML = resources.length ? `
    <div class="section-title">${escBody(S.section_resources)}</div>
    <div class="resources-section" style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
        ${resources.filter(r => r && r.url).map(r => {
          const icon = RES_ICONS[r.type] || 'file';
          const label = RES_LABELS[lang][r.type] || '';
          return `<a href="${escapeHtml(r.url)}" target="_blank" rel="noopener" class="resource-link">
            <i data-lucide="${escapeHtml(icon)}" style="color:var(--accent);flex-shrink:0"></i>
            <div style="flex:1">
                <div style="font-size:15px;font-weight:600;">${escBody(r.name || r.url)}</div>
                <div style="font-size:12px;color:var(--dim);margin-top:2px;">${escBody(label)} · ${escBody(r.fmt || '')}</div>
            </div>
            <i data-lucide="external-link" style="color:var(--dim);flex-shrink:0"></i>
          </a>`;
        }).join('')}
    </div>` : '';

  // JSON-LD
  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    'name': name,
    'alternativeHeadline': tagline || undefined,
    'description': metaDesc,
    'inLanguage': lang,
    'genre': STR[lang].article_genre,
    'publisher': publisher ? { '@type': 'Organization', 'name': publisher } : undefined,
    'url': canonical,
    'image': ogImage,
  };
  // Strip undefined fields (JSON.stringify skips them anyway, but let's be tidy)
  Object.keys(jsonLdArticle).forEach(k => jsonLdArticle[k] === undefined && delete jsonLdArticle[k]);
  if (!jsonLdArticle.publisher) delete jsonLdArticle.publisher;

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': STR[lang].breadcrumb_home, 'item': lang === 'en' ? `${SITE}/` : `${SITE}/` },
      { '@type': 'ListItem', 'position': 2, 'name': name, 'item': canonical },
    ],
  };

  const heroStyle = sys.heroStyle ? ` style="${escapeHtml(sys.heroStyle)}"` : '';
  const imgStyle = sys.heroImageStyle ? ` style="${escapeHtml(sys.heroImageStyle)}"` : '';
  const heroImg = sys.heroImage
    ? `<img src="${escapeHtml(heroFull(sys.heroImage))}" alt="${escapeHtml(name + ' hero art')}"${imgStyle} loading="eager" decoding="async">`
    : '';

  const enHref = `/system/${id}.html`;
  const ruHref = `/ru/system/${id}.html`;
  const enActive = lang === 'en' ? ' class="active"' : '';
  const ruActive = lang === 'ru' ? ' class="active"' : '';

  // Relative-ish path to /style.css and /favicon.svg — we serve from root.
  // Using absolute paths (/style.css) works on GitHub Pages since we own the domain root.
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(metaDesc)}">
<link rel="canonical" href="${escapeHtml(canonical)}">
<link rel="alternate" hreflang="en" href="${escapeHtml(enUrl)}">
<link rel="alternate" hreflang="ru" href="${escapeHtml(ruUrl)}">
<link rel="alternate" hreflang="x-default" href="${escapeHtml(enUrl)}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="article">
<meta property="og:url" content="${escapeHtml(canonical)}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(metaDesc)}">
<meta property="og:image" content="${escapeHtml(ogImage)}">
<meta property="og:locale" content="${lang === 'ru' ? 'ru_RU' : 'en_US'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(metaDesc)}">
<meta name="twitter:image" content="${escapeHtml(ogImage)}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Manrope:wght@300;400;600;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">
<script defer src="/lib/lucide.min.js"></script>
<script type="application/ld+json">${JSON.stringify(jsonLdArticle)}</script>
<script type="application/ld+json">${JSON.stringify(jsonLdBreadcrumb)}</script>
</head>
<body class="static-page">
<header class="static-header">
  <a href="/" class="back-link">${escBody(S.back_to_catalog)}</a>
  <div class="lang-switch">
    <a href="${escapeHtml(enHref)}"${enActive}>${S.lang_en}</a>
    <a href="${escapeHtml(ruHref)}"${ruActive}>${S.lang_ru}</a>
  </div>
</header>
<main class="static-main">
  <article class="system-page static active">
    <div class="hero-banner"${heroStyle}>${heroImg}<div class="hero-overlay"><div class="meta">${escBody(publisher)}</div><h1>${escBody(name)}</h1></div></div>
    ${tagline ? `<p class="tagline">${escBody(tagline)}</p>` : ''}
    <div class="quick-stats">
        <div class="qs"><span class="qs-label">${escBody(S.qs_dice)}</span><span class="qs-value">${escBody(sys.dice || '—')}</span></div>
        <div class="qs"><span class="qs-label">${escBody(S.qs_players)}</span><span class="qs-value">${escBody(sys.players || '—')}</span></div>
        <div class="qs"><span class="qs-label">${escBody(S.qs_prep)}</span><span class="qs-value">${escBody(prep)}</span></div>
        <div class="qs"><span class="qs-label">${escBody(S.qs_foundry)}</span><span class="qs-value">${escBody(foundry)}</span></div>
        <div class="qs"><span class="qs-label">${escBody(S.qs_complexity)}</span><div class="complexity-bar">${complexityBar(sys.complexity)}</div></div>
    </div>
    ${description ? `<div class="section-title">${escBody(S.section_system)}</div>
    <div class="setting-block"><p>${miniMd(description)}</p></div>` : ''}
    ${setting ? `<div class="section-title">${escBody(S.section_setting)}</div>
    <div class="setting-block"><p>${miniMd(setting)}</p></div>` : ''}
    ${vignetteHTML}
    ${(playTags || settingTags) ? `<div class="section-title">${escBody(S.section_playstyle)}</div>
    <div class="playstyle-tags">${playTags}${settingTags}</div>` : ''}
    ${mechanicsHTML ? `<div class="section-title">${escBody(S.section_mechanics)}</div>
    <div class="grid">${mechanicsHTML}</div>` : ''}
    ${quotesHTML ? `<div class="section-title">${escBody(S.section_reviews)}</div>
    <div class="reddit-quotes">${quotesHTML}</div>` : ''}
    ${galleryHTML}
    ${resourcesHTML}
    ${similarHTML}
    <div class="vote-cta">
      <a href="/#${escapeHtml(id)}" class="vote-cta-btn">${escBody(S.vote_cta(name))}</a>
      <p class="vote-cta-sub">${escBody(S.vote_cta_sub)}</p>
    </div>
  </article>
</main>
<footer class="static-footer">
  <a href="/">${escBody(S.footer_home)}</a> ·
  <a href="${lang === 'ru' ? '/ru/about.html' : '/about.html'}">${escBody(S.footer_about)}</a> ·
  <a href="https://github.com/kejid/sessionzero" target="_blank" rel="noopener">GitHub</a>
</footer>
<script data-goatcounter="https://kejid.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</body>
</html>
`;
}

// ---------- 5. About pages ----------
function renderAbout(lang) {
  const S = STR[lang];
  const canonical = lang === 'en' ? `${SITE}/about.html` : `${SITE}/ru/about.html`;
  const enUrl = `${SITE}/about.html`;
  const ruUrl = `${SITE}/ru/about.html`;
  const title = S.about_title;
  const desc = S.about_meta_desc;

  const bodyEn = `
    <h1>About Session Zero</h1>
    <p class="tagline">A small tool that helps your tabletop RPG group decide what to play next.</p>

    <div class="section-title">What is Session Zero?</div>
    <div class="setting-block"><p>Session Zero solves a specific problem: your TTRPG group can't agree on what to play next. One player wants D&amp;D 5e, another wants something weird, the GM wants prep-light. Session Zero compresses that discussion into a structured vote. Each player browses human-written summaries of 44+ systems (OSR, PbtA, FitD, narrative, solo, sci-fi, horror, weird), marks the ones they'd actually be excited about, and the group sees a shortlist together. No accounts, no data collection — everything lives in your browser.</p></div>

    <div class="section-title">The problem</div>
    <div class="setting-block"><p>Picking a new game as a group is the single biggest reason campaigns die before session one. One player wants D&amp;D 5e, another wants something weird, the GM wants prep-light. The conversation drags across three Discord channels for two weeks and then the group just... plays D&amp;D again, or doesn't play at all. Session Zero collapses that conversation into ten minutes of structured voting.</p></div>

    <div class="section-title">How it works</div>
    <div class="setting-block"><p>
    1. Set up your group — names only, no logins.<br>
    2. Browse the catalog. Each system has a tagline, a description, mechanics, real Reddit quotes, art, and free resources (quickstarts, SRDs).<br>
    3. Every player votes for what they want to try. Players can also veto systems they'll never play.<br>
    4. The results page shows a shortlist ranked by votes, with vetoes filtered out. Pick one, or argue about the top three over pizza — that's your call.
    </p></div>

    <div class="section-title">Who runs this?</div>
    <div class="setting-block"><p>Session Zero is a hobby project by <strong>Kejid</strong>, a long-time TTRPG player and GM. Every system description is hand-written based on playing or reading the rulebook — no AI-generated summaries, no Wikipedia copy-paste. The source code is on <a href="https://github.com/kejid/sessionzero" target="_blank" rel="noopener">GitHub</a>; suggestions, corrections, and new-system PRs are welcome.</p></div>

    <div class="section-title">What's next</div>
    <div class="setting-block"><p>Goals: keep the catalog curated (not comprehensive — Wargamer does that better), add comparison articles for specific use cases (solo, small groups, OSR vs PbtA), and keep everything free and ad-free. If you want to support the project, <a href="https://github.com/kejid/sessionzero" target="_blank" rel="noopener">star the repo</a> or tell a group you play with.</p></div>

    <div class="vote-cta">
      <a href="/" class="vote-cta-btn">Start your group's session zero →</a>
    </div>
  `;

  const bodyRu = `
    <h1>О проекте Session Zero</h1>
    <p class="tagline">Небольшой инструмент, который помогает вашей TTRPG-группе выбрать, во что играть дальше.</p>

    <div class="section-title">Что такое Session Zero?</div>
    <div class="setting-block"><p>Session Zero решает конкретную проблему: ваша TTRPG-группа не может договориться, во что играть следующей кампанией. Один хочет D&amp;D 5e, второй — что-то необычное, ГМ хочет минимум препа. Session Zero сжимает это в структурированное голосование: каждый игрок смотрит описания 44+ систем (OSR, PbtA, FitD, нарративные, соло, sci-fi, хоррор, странное), отмечает те, в которые реально хочет сыграть, и группа видит общий шортлист. Без регистраций, без сбора данных — всё хранится в вашем браузере.</p></div>

    <div class="section-title">Проблема</div>
    <div class="setting-block"><p>Выбор новой системы — главная причина, по которой кампании разваливаются ещё до первой сессии. Один хочет D&amp;D 5e, второй — что-то необычное, ГМ хочет минимум препа. Дискуссия растягивается на две недели, а потом группа всё равно играет в D&amp;D — или не играет вообще. Session Zero сжимает всё это в десять минут структурированного голосования.</p></div>

    <div class="section-title">Как это работает</div>
    <div class="setting-block"><p>
    1. Настраиваете группу — только имена, без регистраций.<br>
    2. Смотрите каталог. У каждой системы есть таглайн, описание, механики, реальные цитаты игроков с Reddit, арт и бесплатные материалы.<br>
    3. Каждый игрок голосует за то, что хочет попробовать. Или накладывает вето.<br>
    4. Страница результатов показывает шортлист по голосам, с учётом вето. Выбираете одну — или спорите за топ-3 под пиццу.
    </p></div>

    <div class="section-title">Кто ведёт проект?</div>
    <div class="setting-block"><p>Session Zero — хобби-проект <strong>Kejid</strong>, игрока и ГМ с большим опытом. Каждое описание системы написано вручную после чтения или игры в систему — без AI-генерации, без копи-паста с Википедии. Исходники на <a href="https://github.com/kejid/sessionzero" target="_blank" rel="noopener">GitHub</a>; PR, правки и предложения новых систем приветствуются.</p></div>

    <div class="section-title">Что дальше</div>
    <div class="setting-block"><p>Цели: держать каталог курированным (не список-всех-систем — Wargamer делает это лучше), добавлять статьи-сравнения для конкретных задач (соло, маленькие группы, OSR vs PbtA), держать всё бесплатным и без рекламы. Если хочется поддержать — <a href="https://github.com/kejid/sessionzero" target="_blank" rel="noopener">поставьте звёзду</a> или расскажите своей группе.</p></div>

    <div class="vote-cta">
      <a href="/" class="vote-cta-btn">Начать Session Zero с группой →</a>
    </div>
  `;

  const body = lang === 'en' ? bodyEn : bodyRu;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'url': canonical,
    'name': title,
    'description': desc,
    'inLanguage': lang,
  };

  const enActive = lang === 'en' ? ' class="active"' : '';
  const ruActive = lang === 'ru' ? ' class="active"' : '';

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(desc)}">
<link rel="canonical" href="${escapeHtml(canonical)}">
<link rel="alternate" hreflang="en" href="${escapeHtml(enUrl)}">
<link rel="alternate" hreflang="ru" href="${escapeHtml(ruUrl)}">
<link rel="alternate" hreflang="x-default" href="${escapeHtml(enUrl)}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:url" content="${escapeHtml(canonical)}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(desc)}">
<meta property="og:image" content="${escapeHtml(FALLBACK_OG)}">
<meta property="og:locale" content="${lang === 'ru' ? 'ru_RU' : 'en_US'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(desc)}">
<meta name="twitter:image" content="${escapeHtml(FALLBACK_OG)}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Manrope:wght@300;400;600;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">
<script defer src="/lib/lucide.min.js"></script>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body class="static-page">
<header class="static-header">
  <a href="/" class="back-link">${escBody(S.back_to_catalog)}</a>
  <div class="lang-switch">
    <a href="/about.html"${enActive}>${S.lang_en}</a>
    <a href="/ru/about.html"${ruActive}>${S.lang_ru}</a>
  </div>
</header>
<main class="static-main">
  <article class="static-article">${body}</article>
</main>
<footer class="static-footer">
  <a href="/">${escBody(S.footer_home)}</a> ·
  <a href="${lang === 'ru' ? '/ru/about.html' : '/about.html'}">${escBody(S.footer_about)}</a> ·
  <a href="https://github.com/kejid/sessionzero" target="_blank" rel="noopener">GitHub</a>
</footer>
<script data-goatcounter="https://kejid.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</body>
</html>
`;
}

// ---------- 6. Sitemap ----------
function renderSitemap() {
  const urls = [];
  urls.push({ loc: `${SITE}/`, priority: '1.0', changefreq: 'weekly', alts: null });
  urls.push({
    loc: `${SITE}/about.html`, priority: '0.6', changefreq: 'monthly',
    alts: { en: `${SITE}/about.html`, ru: `${SITE}/ru/about.html` },
  });
  urls.push({
    loc: `${SITE}/ru/about.html`, priority: '0.6', changefreq: 'monthly',
    alts: { en: `${SITE}/about.html`, ru: `${SITE}/ru/about.html` },
  });
  for (const id of ids) {
    urls.push({
      loc: `${SITE}/system/${id}.html`, priority: '0.8', changefreq: 'monthly',
      alts: { en: `${SITE}/system/${id}.html`, ru: `${SITE}/ru/system/${id}.html` },
    });
    urls.push({
      loc: `${SITE}/ru/system/${id}.html`, priority: '0.8', changefreq: 'monthly',
      alts: { en: `${SITE}/system/${id}.html`, ru: `${SITE}/ru/system/${id}.html` },
    });
  }
  // Home gets the same hreflang set as before (en/ru both point to root)
  urls[0].alts = { en: `${SITE}/`, ru: `${SITE}/` };

  const out = ['<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">'];
  for (const u of urls) {
    out.push('  <url>');
    out.push(`    <loc>${u.loc}</loc>`);
    out.push(`    <lastmod>${TODAY}</lastmod>`);
    out.push(`    <changefreq>${u.changefreq}</changefreq>`);
    out.push(`    <priority>${u.priority}</priority>`);
    if (u.alts) {
      out.push(`    <xhtml:link rel="alternate" hreflang="en" href="${u.alts.en}"/>`);
      out.push(`    <xhtml:link rel="alternate" hreflang="ru" href="${u.alts.ru}"/>`);
      out.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${u.alts.en}"/>`);
    }
    out.push('  </url>');
  }
  out.push('</urlset>');
  return out.join('\n') + '\n';
}

// ---------- 7. Write output ----------
function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

ensureDir(OUT_SYSTEM);
ensureDir(OUT_RU);
ensureDir(OUT_RU_SYSTEM);

let written = 0;
for (const id of ids) {
  const sys = SYSTEMS[id];
  try {
    const enHtml = renderSystemPage(id, sys, 'en');
    fs.writeFileSync(path.join(OUT_SYSTEM, `${id}.html`), enHtml, 'utf8');
    written++;
    const ruHtml = renderSystemPage(id, sys, 'ru');
    fs.writeFileSync(path.join(OUT_RU_SYSTEM, `${id}.html`), ruHtml, 'utf8');
    written++;
  } catch (e) {
    console.error(`[generate-pages] failed to render ${id}:`, e.message);
    process.exit(1);
  }
}

fs.writeFileSync(ABOUT_EN, renderAbout('en'), 'utf8');
fs.writeFileSync(ABOUT_RU, renderAbout('ru'), 'utf8');
written += 2;

fs.writeFileSync(SITEMAP, renderSitemap(), 'utf8');

console.log(`[generate-pages] wrote ${written} HTML pages + sitemap.xml`);
console.log(`[generate-pages] systems: ${ids.length} (×2 langs = ${ids.length * 2} system pages)`);
