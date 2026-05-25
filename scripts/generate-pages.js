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
const OUT_COLLECTIONS = path.join(ROOT, 'collections');
const OUT_RU_COLLECTIONS = path.join(OUT_RU, 'collections');
const RU_HOME = path.join(OUT_RU, 'index.html');
const SITEMAP = path.join(ROOT, 'sitemap.xml');
const ABOUT_EN = path.join(ROOT, 'about.html');
const ABOUT_RU = path.join(OUT_RU, 'about.html');
const GUIDE_SLUG = 'how-to-choose-a-ttrpg';
const GUIDE_EN = path.join(ROOT, `${GUIDE_SLUG}.html`);
const GUIDE_RU = path.join(OUT_RU, `${GUIDE_SLUG}.html`);

const SITE = 'https://sessionzero.games';

// Reliable CTA click tracking for static pages. Builds the event URL via the
// already-loaded count.js (so the URL format matches GoatCounter exactly) and
// sends it with `fetch(..., {keepalive:true})` — a GET that survives the page
// navigating to the tool, where a plain <img> beacon would be cancelled.
// sendBeacon is intentionally not used: it forces a POST, but GoatCounter's
// /count endpoint is GET-based. Respects goatcounter.filter() (skips localhost
// /bots) and degrades to a plain Image if fetch is unavailable.
const CTA_TRACK_SCRIPT = `<script>(function(){function s(el){var g=window.goatcounter;if(!g||!g.url)return;if(g.filter&&g.filter())return;var u=g.url({path:el.getAttribute('data-gc-event'),title:el.getAttribute('data-gc-title')||'',event:true});if(!u)return;var img=function(){try{new Image().src=u;}catch(e){}};if(window.fetch){try{fetch(u,{method:'GET',mode:'no-cors',credentials:'omit',keepalive:true}).catch(img);}catch(e){img();}}else{img();}}function b(){var e=document.querySelectorAll('[data-gc-event]');for(var i=0;i<e.length;i++){e[i].addEventListener('click',function(){s(this);});e[i].addEventListener('auxclick',function(ev){if(ev.button===1)s(this);});}}if(document.readyState!=='loading')b();else document.addEventListener('DOMContentLoaded',b);})();</script>`;
const TODAY = '2026-04-22';
const HOMEPAGE_OG = SITE + '/og/home.jpg';
const HOMEPAGE_OG_ALT = 'Session Zero — TTRPG group voting tool';

// ---------- 1. Load systems via vm sandbox ----------
const SYSTEMS = {};
const COLLECTIONS = {};
const sandbox = vm.createContext({
  registerSystem: (id, data) => { SYSTEMS[id] = data; },
  registerCollection: (slug, config) => { COLLECTIONS[slug] = config; }
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
const SYSTEM_COUNT = ids.length;
console.log(`[generate-pages] loaded ${ids.length} systems`);

// Intent / decision landing pages ("best solo TTRPGs", "OSR vs PbtA", ...).
// Optional file — prose is hand-written by the author; the generator only
// assembles SEO scaffolding + the system list pulled from the catalog.
const COLLECTIONS_FILE = path.join(ROOT, 'data', 'collections.js');
if (fs.existsSync(COLLECTIONS_FILE)) {
  try {
    vm.runInContext(fs.readFileSync(COLLECTIONS_FILE, 'utf8'), sandbox, { filename: 'collections.js' });
  } catch (e) {
    console.error('[generate-pages] failed to parse collections.js:', e.message);
    process.exit(1);
  }
}
const collectionSlugs = Object.keys(COLLECTIONS).sort();
console.log(`[generate-pages] loaded ${collectionSlugs.length} collections`);

// Resolve which systems belong to a collection: explicit ids, or every
// system in a grouping scheme (optionally a specific key within it).
function resolveCollectionSystems(filter) {
  if (!filter) return [];
  if (filter.ids) return filter.ids.filter(id => SYSTEMS[id]);
  const matches = [];
  for (const id of Object.keys(SYSTEMS)) {
    const g = SYSTEMS[id].groups && SYSTEMS[id].groups[filter.scheme];
    if (!g) continue;
    if (filter.key && g.key !== filter.key) continue;
    matches.push({ id, order: Number(g.order) || 999 });
  }
  matches.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  return matches.map(m => m.id);
}

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
    vote_cta_short: 'Vote with your group →',
    vote_cta_sub: 'Open in Session Zero to let every player vote and see the results.',
    coll_systems_title: 'Systems in this list',
    coll_breadcrumb: 'Guides',
    coll_cta: 'Open Session Zero and vote with your group →',
    footer_home: 'Home',
    footer_about: 'About',
    breadcrumb_home: 'Session Zero',
    lang_en: 'EN',
    lang_ru: 'RU',
    about_title: 'About — Session Zero',
    about_meta_desc: `Can't agree on what TTRPG to play next? Session Zero is a free tool that lets your group vote together and see a shortlist. ${SYSTEM_COUNT} systems, no signup, bilingual.`,
    article_genre: 'Tabletop role-playing game',
    author_credit: 'Written and curated by <a href="https://github.com/kejid" target="_blank" rel="noopener">Kejid</a> — TTRPG player &amp; GM',
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
    vote_cta_short: 'Голосовать всей группой →',
    vote_cta_sub: 'Откройте в Session Zero, чтобы каждый игрок проголосовал и увидел итоги.',
    coll_systems_title: 'Системы из этой подборки',
    coll_breadcrumb: 'Гайды',
    coll_cta: 'Открыть Session Zero и проголосовать всей группой →',
    footer_home: 'Главная',
    footer_about: 'О проекте',
    breadcrumb_home: 'Session Zero',
    lang_en: 'EN',
    lang_ru: 'RU',
    about_title: 'О проекте — Session Zero',
    about_meta_desc: `Не можете договориться, во что играть следующей кампанией? Session Zero — бесплатный инструмент для группового голосования с шортлистом. ${SYSTEM_COUNT}+ систем, без регистрации, билингв.`,
    article_genre: 'Настольная ролевая игра',
    author_credit: 'Написано и курируется <a href="https://github.com/kejid" target="_blank" rel="noopener">Kejid</a> — игрок и ГМ в TTRPG',
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
  const tagShort = pickLang(sys, 'tagShort', lang, '');
  const description = pickLang(sys, 'description', lang);
  const setting = pickLang(sys, 'setting', lang);
  const vignette = pickLang(sys, 'vignette', lang, null);
  const prep = pickLang(sys, 'prep', lang, '—');
  const foundry = sys.foundryStatus || '—';
  const publisher = sys.publisher || '';

  const mechanics = mergeArr(sys.mechanics, sys[lang] && sys[lang].mechanics);
  const gallery = mergeArr(sys.gallery, sys[lang] && sys[lang].gallery);
  const resources = mergeArr(sys.resources, sys[lang] && sys[lang].resources);
  const quotes = mergeArr(sys.quotes, sys[lang] && sys[lang].quotes);

  const canonical = lang === 'en'
    ? `${SITE}/system/${id}.html`
    : `${SITE}/ru/system/${id}.html`;
  const enUrl = `${SITE}/system/${id}.html`;
  const ruUrl = `${SITE}/ru/system/${id}.html`;

  const ogImage = lang === 'ru'
    ? `${SITE}/og/ru/${id}.jpg`
    : `${SITE}/og/${id}.jpg`;
  const metaDescSource = description || tagline || name;
  const metaDesc = truncate(metaDescSource, 155);

  const title = tagShort
    ? `${name} — ${tagShort} | Session Zero`
    : `${name} — Session Zero`;

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

  const quotesHTML = quotes.map(q =>
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
                    <img src="${escapeHtml(galleryThumb(img.src))}" alt="${escapeHtml(img.cap || name)}" loading="lazy" decoding="async" fetchpriority="low">
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
            <img src="${escapeHtml(sOg)}" alt="${escapeHtml(sAlt)}" loading="lazy" decoding="async" fetchpriority="low">
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
    'author': {
      '@type': 'Person',
      'name': 'Kejid',
      'url': 'https://github.com/kejid',
    },
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
    ? `<img src="${escapeHtml(heroFull(sys.heroImage))}" alt="${escapeHtml(name + ' hero art')}"${imgStyle} loading="eager" decoding="async" fetchpriority="high">`
    : '';

  const enHref = `/system/${id}.html`;
  const ruHref = `/ru/system/${id}.html`;
  const enActive = lang === 'en' ? ' class="active"' : '';
  const ruActive = lang === 'ru' ? ' class="active"' : '';

  // GoatCounter click event fired when a reader follows the CTA into the
  // voting tool. Lets us measure SEO-landing → tool conversion per system.
  // Sent by CTA_TRACK_SCRIPT (fetch keepalive, survives the navigation away);
  // top + bottom CTA share the same path so clicks aggregate per page.
  const ctaEvent = `cta-vote-${id}`;
  const ctaTitle = `${name} → tool`;
  const ctaAttrs = `data-gc-event="${escapeHtml(ctaEvent)}" data-gc-title="${escapeHtml(ctaTitle)}"`;
  // RU pages hand the chosen language to the app via ?lang=ru (see i18n.js).
  const homeHref = `/${lang === 'ru' ? '?lang=ru' : ''}`;
  const toolHref = `${homeHref}#${escapeHtml(id)}`;

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
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="${escapeHtml(name)} — TTRPG on Session Zero">
<meta property="og:locale" content="${lang === 'ru' ? 'ru_RU' : 'en_US'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(metaDesc)}">
<meta name="twitter:image" content="${escapeHtml(ogImage)}">
<meta name="twitter:image:alt" content="${escapeHtml(name)} — TTRPG on Session Zero">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Manrope:wght@300;400;600;800&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Manrope:wght@300;400;600;800&display=swap"></noscript>
<link rel="stylesheet" href="/style.min.css">
<script defer src="/lib/lucide.min.js"></script>
<script type="application/ld+json">${JSON.stringify(jsonLdArticle)}</script>
<script type="application/ld+json">${JSON.stringify(jsonLdBreadcrumb)}</script>
</head>
<body class="static-page">
<header class="static-header">
  <a href="${homeHref}" class="back-link">${escBody(S.back_to_catalog)}</a>
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
    <div class="vote-cta vote-cta-top">
      <a href="${toolHref}" class="vote-cta-btn" ${ctaAttrs}>${escBody(S.vote_cta_short)}</a>
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
    <p class="author-credit">${S.author_credit}</p>
    ${similarHTML}
    <div class="vote-cta">
      <a href="${toolHref}" class="vote-cta-btn" ${ctaAttrs}>${escBody(S.vote_cta(name))}</a>
      <p class="vote-cta-sub">${escBody(S.vote_cta_sub)}</p>
    </div>
  </article>
</main>
<footer class="static-footer">
  <a href="${homeHref}">${escBody(S.footer_home)}</a> ·
  <a href="${lang === 'ru' ? '/ru/about.html' : '/about.html'}">${escBody(S.footer_about)}</a> ·
  <a href="https://github.com/kejid/sessionzero" target="_blank" rel="noopener">GitHub</a>
</footer>
${CTA_TRACK_SCRIPT}
<script data-goatcounter="https://kejid.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</body>
</html>
`;
}

// ---------- 5. About pages ----------
function renderAbout(lang) {
  const S = STR[lang];
  const homeHref = `/${lang === 'ru' ? '?lang=ru' : ''}`;
  const canonical = lang === 'en' ? `${SITE}/about.html` : `${SITE}/ru/about.html`;
  const enUrl = `${SITE}/about.html`;
  const ruUrl = `${SITE}/ru/about.html`;
  const title = S.about_title;
  const desc = S.about_meta_desc;
  const ogImage = lang === 'ru' ? `${SITE}/og/ru/home.jpg` : HOMEPAGE_OG;

  const bodyEn = `
    <h1>About Session Zero</h1>
    <p class="tagline">A small tool that helps your tabletop RPG group decide what to play next.</p>

    <div class="section-title">What is Session Zero?</div>
    <div class="setting-block"><p>Session Zero solves a specific problem: your TTRPG group can't agree on what to play next. One player wants D&amp;D 5e, another wants something weird, the GM wants prep-light. Session Zero compresses that discussion into a structured vote. Each player browses human-written summaries of ${SYSTEM_COUNT}+ systems (OSR, PbtA, FitD, narrative, solo, sci-fi, horror, weird), marks the ones they'd actually be excited about, and the group sees a shortlist together. No accounts, no data collection — everything lives in your browser.</p></div>

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
      <a href="/" class="vote-cta-btn" data-gc-event="cta-vote-about" data-gc-title="About → tool">Start your group's session zero →</a>
    </div>
  `;

  const bodyRu = `
    <h1>О проекте Session Zero</h1>
    <p class="tagline">Небольшой инструмент, который помогает вашей TTRPG-группе выбрать, во что играть дальше.</p>

    <div class="section-title">Что такое Session Zero?</div>
    <div class="setting-block"><p>Session Zero решает конкретную проблему: ваша TTRPG-группа не может договориться, во что играть следующей кампанией. Один хочет D&amp;D 5e, второй — что-то необычное, ГМ хочет минимум препа. Session Zero сжимает это в структурированное голосование: каждый игрок смотрит описания ${SYSTEM_COUNT}+ систем (OSR, PbtA, FitD, нарративные, соло, sci-fi, хоррор, странное), отмечает те, в которые реально хочет сыграть, и группа видит общий шортлист. Без регистраций, без сбора данных — всё хранится в вашем браузере.</p></div>

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
      <a href="/?lang=ru" class="vote-cta-btn" data-gc-event="cta-vote-about" data-gc-title="About → tool">Начать Session Zero с группой →</a>
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
<meta property="og:image" content="${escapeHtml(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="${escapeHtml(HOMEPAGE_OG_ALT)}">
<meta property="og:locale" content="${lang === 'ru' ? 'ru_RU' : 'en_US'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(desc)}">
<meta name="twitter:image" content="${escapeHtml(ogImage)}">
<meta name="twitter:image:alt" content="${escapeHtml(HOMEPAGE_OG_ALT)}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Manrope:wght@300;400;600;800&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Manrope:wght@300;400;600;800&display=swap"></noscript>
<link rel="stylesheet" href="/style.min.css">
<script defer src="/lib/lucide.min.js"></script>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body class="static-page">
<header class="static-header">
  <a href="${homeHref}" class="back-link">${escBody(S.back_to_catalog)}</a>
  <div class="lang-switch">
    <a href="/about.html"${enActive}>${S.lang_en}</a>
    <a href="/ru/about.html"${ruActive}>${S.lang_ru}</a>
  </div>
</header>
<main class="static-main">
  <article class="static-article">${body}</article>
</main>
<footer class="static-footer">
  <a href="${homeHref}">${escBody(S.footer_home)}</a> ·
  <a href="${lang === 'ru' ? '/ru/about.html' : '/about.html'}">${escBody(S.footer_about)}</a> ·
  <a href="https://github.com/kejid/sessionzero" target="_blank" rel="noopener">GitHub</a>
</footer>
${CTA_TRACK_SCRIPT}
<script data-goatcounter="https://kejid.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</body>
</html>
`;
}

// ---------- 5b. Collection (intent / decision) pages ----------
function renderCollectionPage(slug, cfg, lang) {
  const S = STR[lang];
  const title = (lang === 'ru' ? cfg.title_ru : cfg.title) || cfg.title || slug;
  const h1 = (lang === 'ru' ? cfg.h1_ru : cfg.h1) || title;
  const descSource = (lang === 'ru' ? cfg.description_ru : cfg.description) || cfg.description || title;
  const metaDesc = truncate(descSource, 155);
  const intro = (lang === 'ru' ? cfg.intro_ru : cfg.intro) || cfg.intro || '';
  const fullTitle = `${title} | Session Zero`;

  const canonical = lang === 'en' ? `${SITE}/collections/${slug}.html` : `${SITE}/ru/collections/${slug}.html`;
  const enUrl = `${SITE}/collections/${slug}.html`;
  const ruUrl = `${SITE}/ru/collections/${slug}.html`;
  const ogImage = lang === 'ru' ? `${SITE}/og/ru/home.jpg` : HOMEPAGE_OG;

  const enHref = `/collections/${slug}.html`;
  const ruHref = `/ru/collections/${slug}.html`;
  const enActive = lang === 'en' ? ' class="active"' : '';
  const ruActive = lang === 'ru' ? ' class="active"' : '';
  const toolHref = `/${lang === 'ru' ? '?lang=ru' : ''}`;

  const sysIds = resolveCollectionSystems(cfg.filter);
  const cardsHTML = sysIds.map(sid => {
    const ssys = SYSTEMS[sid];
    const sname = ssys.name || sid;
    const sHref = lang === 'en' ? `/system/${sid}.html` : `/ru/system/${sid}.html`;
    return `<a href="${escapeHtml(sHref)}" class="similar-system-card">
            <img src="${escapeHtml(`${SITE}/og/${sid}.jpg`)}" alt="${escapeHtml(sname + ' hero art')}" loading="lazy" decoding="async" fetchpriority="low">
            <span class="similar-system-name">${escBody(sname)}</span>
          </a>`;
  }).join('');

  const jsonLdList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': title,
    'description': metaDesc,
    'itemListElement': sysIds.map((sid, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'url': lang === 'en' ? `${SITE}/system/${sid}.html` : `${SITE}/ru/system/${sid}.html`,
      'name': SYSTEMS[sid].name || sid,
    })),
  };
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': STR[lang].breadcrumb_home, 'item': `${SITE}/` },
      { '@type': 'ListItem', 'position': 2, 'name': title, 'item': canonical },
    ],
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(fullTitle)}</title>
<meta name="description" content="${escapeHtml(metaDesc)}">
<link rel="canonical" href="${escapeHtml(canonical)}">
<link rel="alternate" hreflang="en" href="${escapeHtml(enUrl)}">
<link rel="alternate" hreflang="ru" href="${escapeHtml(ruUrl)}">
<link rel="alternate" hreflang="x-default" href="${escapeHtml(enUrl)}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:url" content="${escapeHtml(canonical)}">
<meta property="og:title" content="${escapeHtml(fullTitle)}">
<meta property="og:description" content="${escapeHtml(metaDesc)}">
<meta property="og:image" content="${escapeHtml(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="${escapeHtml(HOMEPAGE_OG_ALT)}">
<meta property="og:locale" content="${lang === 'ru' ? 'ru_RU' : 'en_US'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(fullTitle)}">
<meta name="twitter:description" content="${escapeHtml(metaDesc)}">
<meta name="twitter:image" content="${escapeHtml(ogImage)}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Manrope:wght@300;400;600;800&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Manrope:wght@300;400;600;800&display=swap"></noscript>
<link rel="stylesheet" href="/style.min.css">
<script defer src="/lib/lucide.min.js"></script>
<script type="application/ld+json">${JSON.stringify(jsonLdList)}</script>
<script type="application/ld+json">${JSON.stringify(jsonLdBreadcrumb)}</script>
</head>
<body class="static-page">
<header class="static-header">
  <a href="${toolHref}" class="back-link">${escBody(S.back_to_catalog)}</a>
  <div class="lang-switch">
    <a href="${escapeHtml(enHref)}"${enActive}>${S.lang_en}</a>
    <a href="${escapeHtml(ruHref)}"${ruActive}>${S.lang_ru}</a>
  </div>
</header>
<main class="static-main">
  <article class="static-article">
    <h1>${escBody(h1)}</h1>
    ${intro ? `<div class="setting-block">${intro}</div>` : ''}
    ${cardsHTML ? `<div class="section-title">${escBody(S.coll_systems_title)}</div>
    <div class="similar-systems-grid">${cardsHTML}</div>` : ''}
    <div class="vote-cta">
      <a href="${toolHref}" class="vote-cta-btn" data-gc-event="cta-vote-coll-${escapeHtml(slug)}" data-gc-title="${escapeHtml(title)} → tool">${escBody(S.coll_cta)}</a>
    </div>
  </article>
</main>
<footer class="static-footer">
  <a href="${toolHref}">${escBody(S.footer_home)}</a> ·
  <a href="${lang === 'ru' ? '/ru/about.html' : '/about.html'}">${escBody(S.footer_about)}</a> ·
  <a href="https://github.com/kejid/sessionzero" target="_blank" rel="noopener">GitHub</a>
</footer>
${CTA_TRACK_SCRIPT}
<script data-goatcounter="https://kejid.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</body>
</html>
`;
}

// ---------- 5c. Russian homepage landing (static, indexable; funnels to /) ----------
// Copy here is condensed from the author's hand-written RU about page.
function renderRuHome() {
  const title = 'Во что поиграть всей группой? Голосование по TTRPG | Session Zero';
  const metaDesc = `Не можете выбрать настольную ролевую игру для следующей кампании? Session Zero — бесплатный инструмент: каждый игрок голосует за системы, а группа видит общий шортлист. ${SYSTEM_COUNT}+ систем, без регистрации.`;
  const canonical = `${SITE}/ru/`;
  const ogImage = `${SITE}/og/ru/home.jpg`;

  const featured = ids.filter((_, i) => i % Math.max(1, Math.ceil(ids.length / 8)) === 0).slice(0, 8);
  const cardsHTML = featured.map(sid => {
    const sname = SYSTEMS[sid].name || sid;
    return `<a href="/ru/system/${escapeHtml(sid)}.html" class="similar-system-card">
            <img src="${escapeHtml(`${SITE}/og/${sid}.jpg`)}" alt="${escapeHtml(sname + ' hero art')}" loading="lazy" decoding="async" fetchpriority="low">
            <span class="similar-system-name">${escBody(sname)}</span>
          </a>`;
  }).join('');

  const collLinks = collectionSlugs.map(slug => {
    const c = COLLECTIONS[slug];
    return `<li><a href="/ru/collections/${escapeHtml(slug)}.html">${escBody(c.title_ru || c.title || slug)}</a></li>`;
  }).join('');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Session Zero',
    'url': canonical,
    'description': metaDesc,
    'applicationCategory': 'GameApplication',
    'operatingSystem': 'Any (web-based)',
    'offers': { '@type': 'Offer', 'price': '0' },
    'inLanguage': 'ru',
  };

  const faq = [
    ['Как работает голосование?', 'Настройте группу — только имена, без аккаунтов. Каждый игрок листает каталог из ' + SYSTEM_COUNT + '+ систем и голосует за те, в которые хочет сыграть. Страница результатов показывает шортлист по голосам — выбираете одну или спорите за топ-3 под пиццу.'],
    ['Это то же самое, что нулевая сессия (session zero) с safety tools?', 'Нет. Нулевая сессия — это когда вы уже выбрали игру и обсуждаете ожидания, безопасность и создаёте персонажей. Этот инструмент — про шаг раньше: какую систему вообще взять. Сначала выберите систему здесь, потом проводите нулевую сессию.'],
    ['Нужна регистрация?', 'Нет, без логинов. Группа, голоса и свои системы хранятся в браузере. Полностью бесплатно, EN/RU.'],
    ['Какие системы можно выбрать?', SYSTEM_COUNT + '+ настольных ролёвок: OSR, PbtA, Year Zero Engine, нарративные, соло, sci-fi и хоррор — от Mothership и Blades in the Dark до Mörk Borg, Dragonbane и Call of Cthulhu. Можно добавить свою.'],
  ];
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faq.map(([q, a]) => ({
      '@type': 'Question',
      'name': q,
      'acceptedAnswer': { '@type': 'Answer', 'text': a },
    })),
  };
  const faqHTML = faq.map(([q, a]) => `<div class="seo-faq-item"><h3>${escBody(q)}</h3><p>${escBody(a)}</p></div>`).join('');

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(metaDesc)}">
<link rel="canonical" href="${escapeHtml(canonical)}">
<link rel="alternate" hreflang="en" href="${SITE}/">
<link rel="alternate" hreflang="ru" href="${SITE}/ru/">
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:url" content="${escapeHtml(canonical)}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(metaDesc)}">
<meta property="og:image" content="${escapeHtml(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="${escapeHtml(HOMEPAGE_OG_ALT)}">
<meta property="og:locale" content="ru_RU">
<meta property="og:locale:alternate" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(metaDesc)}">
<meta name="twitter:image" content="${escapeHtml(ogImage)}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Manrope:wght@300;400;600;800&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Manrope:wght@300;400;600;800&display=swap"></noscript>
<link rel="stylesheet" href="/style.min.css">
<script defer src="/lib/lucide.min.js"></script>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body class="static-page">
<header class="static-header">
  <a href="/?lang=ru" class="back-link">Session Zero</a>
  <div class="lang-switch">
    <a href="/?lang=en">EN</a>
    <a href="/ru/" class="active">RU</a>
  </div>
</header>
<main class="static-main">
  <article class="static-article">
    <h1>Во что поиграть всей группой?</h1>
    <p class="tagline">Session Zero помогает TTRPG-группе выбрать систему для следующей кампании — без бесконечных споров в чате.</p>

    <div class="setting-block"><p>Один игрок хочет D&amp;D, другой — что-то необычное, ГМ хочет минимум препа. Session Zero сжимает этот спор в короткое голосование: каждый отмечает системы, в которые хочет сыграть, а группа видит общий шортлист. Без регистрации, всё хранится в браузере. В каталоге ${SYSTEM_COUNT}+ систем — OSR, PbtA, Year Zero, нарративные, соло, sci-fi, хоррор.</p></div>

    <div class="section-title">Как это работает</div>
    <div class="setting-block"><p>
    1. Настройте группу — только имена, без логинов.<br>
    2. Каждый игрок листает каталог и голосует за то, что хочет попробовать.<br>
    3. Страница результатов показывает шортлист по голосам. Выбираете одну — или спорите за топ-3 под пиццу.
    </p></div>

    <div class="setting-block"><p>Не можете договориться? Гайд: <a href="/ru/how-to-choose-a-ttrpg.html">как выбрать TTRPG всей группой</a> — четыре способа решить и три правила, чтобы спор не начался заново.</p></div>

    <div class="vote-cta vote-cta-top">
      <a href="/?lang=ru" class="vote-cta-btn" data-gc-event="cta-vote-home-ru" data-gc-title="RU home → tool">Открыть Session Zero →</a>
    </div>

    ${collLinks ? `<div class="section-title">Подборки</div>
    <ul>${collLinks}</ul>` : ''}

    ${cardsHTML ? `<div class="section-title">Несколько систем из каталога</div>
    <div class="similar-systems-grid">${cardsHTML}</div>` : ''}

    <div class="section-title">Частые вопросы</div>
    ${faqHTML}
    <script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>

    <div class="vote-cta">
      <a href="/?lang=ru" class="vote-cta-btn" data-gc-event="cta-vote-home-ru" data-gc-title="RU home → tool">Открыть Session Zero и проголосовать →</a>
      <p class="vote-cta-sub">Откройте инструмент, чтобы вся группа проголосовала и увидела итоги.</p>
    </div>
  </article>
</main>
<footer class="static-footer">
  <a href="/?lang=ru">Session Zero</a> ·
  <a href="/ru/about.html">О проекте</a> ·
  <a href="https://github.com/kejid/sessionzero" target="_blank" rel="noopener">GitHub</a>
</footer>
${CTA_TRACK_SCRIPT}
<script data-goatcounter="https://kejid.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</body>
</html>
`;
}

// ---------- 5c. Guide / pillar page (decision-intent how-to) ----------
function renderGuidePage(lang) {
  const S = STR[lang];
  const canonical = lang === 'en' ? `${SITE}/${GUIDE_SLUG}.html` : `${SITE}/ru/${GUIDE_SLUG}.html`;
  const enUrl = `${SITE}/${GUIDE_SLUG}.html`;
  const ruUrl = `${SITE}/ru/${GUIDE_SLUG}.html`;
  const ogImage = lang === 'ru' ? `${SITE}/og/ru/home.jpg` : HOMEPAGE_OG;
  const homeHref = `/${lang === 'ru' ? '?lang=ru' : ''}`;
  const toolHref = homeHref;
  const sys = (id) => lang === 'en' ? `/system/${id}.html` : `/ru/system/${id}.html`;
  const coll = (slug) => lang === 'en' ? `/collections/${slug}.html` : `/ru/collections/${slug}.html`;
  const enActive = lang === 'en' ? ' class="active"' : '';
  const ruActive = lang === 'ru' ? ' class="active"' : '';

  const title = lang === 'en'
    ? 'How to Choose a TTRPG Your Whole Group Will Play | Session Zero'
    : 'Как выбрать TTRPG, в которую согласится играть вся группа | Session Zero';
  const headline = lang === 'en'
    ? 'How to choose a TTRPG your whole group will actually play'
    : 'Как выбрать TTRPG, в которую реально согласится играть вся группа';
  const desc = lang === 'en'
    ? 'Can’t agree on what tabletop RPG to play? Four honest ways a group can decide — quick consensus, approval voting, pitches, ranked choice — and how to do it in ten minutes.'
    : 'Группа не может договориться, во что играть? Четыре честных способа выбрать настольную ролёвку — консенсус, approval-голосование, питчи, ранжирование — и как сделать это за десять минут.';

  const faq = lang === 'en' ? [
    ['Isn’t this just a poll?', 'A generic poll asks which one is your favourite, which recreates the split-vote problem. Approval voting asks which of these you’re happy to play, and finds the option with the broadest support. Session Zero is built around that second question and pairs it with a summary of each game, so people vote informed.'],
    ['Is this the same as a session zero?', 'No. A session zero is the prep meeting where the group sets expectations, agrees on safety tools and makes characters — that comes after you’ve chosen the game. This is the step before: deciding what to play. Pick the system first, then run your prep session.'],
    ['Do we need accounts?', 'No signup and nothing stored on a server — your group, votes and any custom systems live in your browser. It’s free and works in English and Russian.'],
  ] : [
    ['Это просто опрос?', 'Обычный опрос спрашивает «что нравится больше всего» — и воссоздаёт проблему расщепления голосов. Approval-голосование спрашивает «во что из этого ты готов сыграть» и находит вариант с самой широкой поддержкой. Session Zero построен вокруг второго вопроса и даёт описание каждой игры, чтобы голосовали осознанно.'],
    ['Это то же самое, что нулевая сессия?', 'Нет. Нулевая сессия — это встреча, где группа уже выбрала игру и обсуждает ожидания, безопасность и создаёт персонажей. Здесь — шаг раньше: какую систему вообще взять. Сначала выберите систему, потом проводите нулевую сессию.'],
    ['Нужны аккаунты?', 'Нет регистрации, ничего не хранится на сервере — группа, голоса и свои системы живут в браузере. Бесплатно, EN/RU.'],
  ];
  const faqHTML = faq.map(([q, a]) => `<div class="seo-faq-item"><h3>${escBody(q)}</h3><p>${escBody(a)}</p></div>`).join('');

  const bodyEn = `
    <h1>${escBody(headline)}</h1>
    <p class="tagline">Four honest ways to pick your next tabletop RPG — and how to do it in ten minutes instead of letting the group chat drag on for three weeks.</p>

    <div class="setting-block"><p>Choosing the next game is the quietest way a campaign dies. One player is set on D&amp;D 5e, another wants something weird and rules-light, the GM wants minimal prep, and someone hasn&rsquo;t said a word but will absolutely bail if it&rsquo;s another dungeon crawl. The conversation spreads across three Discord channels, nobody wants to be the pushy one, and two weeks later you&rsquo;re either defaulting to D&amp;D again or not playing at all. This is a guide to actually deciding — fairly, fast, and in a way nobody resents.</p></div>

    <div class="section-title">Why groups stall</div>
    <div class="setting-block"><p>
    <strong>Split vote.</strong> Five people, five favourites, no majority — so the most stubborn person wins by attrition.<br>
    <strong>The vocal minority.</strong> One firm &ldquo;I&rsquo;d really rather not&rdquo; quietly kills an option everyone else liked.<br>
    <strong>Paradox of choice.</strong> There are thousands of TTRPGs now. Past a handful of options, people freeze instead of choosing.<br>
    <strong>Undefined scope.</strong> &ldquo;What should we play&rdquo; means something different for a one-shot than for a two-year campaign. People vote differently when they don&rsquo;t know what they&rsquo;re committing to.
    </p></div>

    <div class="section-title">Four ways to decide</div>
    <div class="setting-block"><p>Pick the one that fits how your table actually behaves:</p></div>
    <div class="setting-block"><p>
    <strong>1. Quick consensus</strong> — best for small, agreeable groups. Someone proposes two or three options, show of hands, done. Fast, but it falls apart the moment opinions genuinely differ.<br><br>
    <strong>2. Approval voting</strong> — the best default for most groups. Everyone votes for <em>every</em> game they&rsquo;d be happy to play, not just their favourite. The option with the broadest support wins. This is the one that kills the &ldquo;stuck playing something I hate&rdquo; problem, because a game only wins if most of the table is at least OK with it.<br><br>
    <strong>3. Everyone pitches</strong> — best for passionate groups. Each person gets two minutes to sell one game. Enthusiasm is contagious, and people often warm to an option they&rsquo;d have skipped on a list. Then vote.<br><br>
    <strong>4. Ranked choice</strong> — best when the options are similar. Everyone ranks their top few; if nothing has a majority, the lowest drops and its votes flow to second choices. Genuinely useful when, say, two OSR games are splitting the same voters.
    </p></div>
    <div class="setting-block"><p>For most groups, <strong>approval voting</strong> is the sweet spot: low drama, no vote-splitting, and the winner is something the whole table can live with.</p></div>

    <div class="section-title">The ten-minute version</div>
    <div class="setting-block"><p><a href="${toolHref}">Session Zero</a> is built around approval voting, because it&rsquo;s the format that holds up with real groups. Add your players (just names — no accounts), everyone browses a catalogue of ${SYSTEM_COUNT}+ systems with honest, human-written summaries, and each person flags the ones they&rsquo;d genuinely be up for. The results page shows a shortlist ranked by votes. Pick the winner, or argue over the top three over pizza — except now you&rsquo;re arguing over three games everyone already approved, not starting from zero.</p></div>

    <div class="vote-cta vote-cta-top">
      <a href="${toolHref}" class="vote-cta-btn" data-gc-event="cta-vote-guide" data-gc-title="Guide → tool">Start a vote with your group →</a>
    </div>

    <div class="section-title">If you don&rsquo;t know where to start</div>
    <div class="setting-block"><p>Half the stall is just not knowing what&rsquo;s out there. A few directions, by what your group is actually after:</p></div>
    <div class="setting-block"><p>
    <strong>Prep-light, pick-up-and-play:</strong> <a href="${sys('cairn')}">Cairn</a>, <a href="${sys('mausritter')}">Mausritter</a>, <a href="${sys('mork-borg')}">Mörk Borg</a> — rules you can teach in five minutes.<br>
    <strong>Story-first, low-crunch:</strong> <a href="${sys('blades')}">Blades in the Dark</a>, <a href="${sys('heart')}">Heart</a> — mechanics that push the fiction, not stat blocks.<br>
    <strong>Horror for a tense night:</strong> <a href="${sys('mothership')}">Mothership</a>, <a href="${sys('call-of-cthulhu')}">Call of Cthulhu</a> — two very different flavours of dread.<br>
    <strong>One evening, no commitment:</strong> <a href="${sys('the-wretched')}">The Wretched</a>, <a href="${sys('last-tea-shop')}">Last Tea Shop</a> — one-shots that resolve in a single sitting.<br>
    <strong>Playing solo or between sessions:</strong> see <a href="${coll('best-solo-ttrpgs')}">the best solo TTRPGs</a>.<br>
    <strong>Old-school dungeon energy:</strong> see <a href="${coll('osr-tabletop-rpgs')}">OSR tabletop RPGs</a>.
    </p></div>

    <div class="section-title">Three rules that stop the argument restarting</div>
    <div class="setting-block"><p>
    <strong>Define the scope first.</strong> One-shot, mini-arc, or open-ended campaign — say it out loud before anyone votes. People commit differently to three sessions than to three years.<br><br>
    <strong>Let people veto, not just vote.</strong> One honest &ldquo;I will not enjoy this&rdquo; is worth knowing before session one, not halfway through it.<br><br>
    <strong>Timebox it.</strong> Give the decision ten minutes and a hard deadline. Endless deliberation is exactly how the default option — D&amp;D again — wins by exhaustion.
    </p></div>

    <div class="section-title">FAQ</div>
    ${faqHTML}

    <div class="vote-cta">
      <a href="${toolHref}" class="vote-cta-btn" data-gc-event="cta-vote-guide" data-gc-title="Guide → tool">Start your group&rsquo;s vote →</a>
      <p class="vote-cta-sub">Free, no signup — everyone votes, the group sees a shortlist.</p>
    </div>
  `;

  const bodyRu = `
    <h1>${escBody(headline)}</h1>
    <p class="tagline">Четыре честных способа выбрать следующую настольную ролёвку — и как сделать это за десять минут, а не растягивать обсуждение в чате на три недели.</p>

    <div class="setting-block"><p>Выбор следующей игры — самый тихий способ убить кампанию. Один игрок намертво за D&amp;D 5e, другой хочет что-то странное и лёгкое по правилам, ГМ хочет минимум препа, а кто-то молчит, но точно сольётся, если это снова данжен-кроул. Обсуждение расползается по трём каналам в Discord, никто не хочет давить — и через две недели вы либо по умолчанию опять играете в D&amp;D, либо не играете вообще. Это гайд о том, как реально выбрать — честно, быстро и так, чтобы никто не затаил обиду.</p></div>

    <div class="section-title">Почему группа застревает</div>
    <div class="setting-block"><p>
    <strong>Расщепление голосов.</strong> Пятеро игроков, пять фаворитов, ни у кого нет большинства — и побеждает самый упёртый, измором.<br>
    <strong>Громкое меньшинство.</strong> Одно твёрдое «я бы лучше не надо» тихо убивает вариант, который нравился всем остальным.<br>
    <strong>Парадокс выбора.</strong> Систем сейчас тысячи. После пары-тройки вариантов люди не выбирают, а зависают.<br>
    <strong>Неопределённый масштаб.</strong> «Во что играть» — это разное для ваншота и для двухлетней кампании. Люди голосуют иначе, когда не знают, на что подписываются.
    </p></div>

    <div class="section-title">Четыре способа решить</div>
    <div class="setting-block"><p>Выберите тот, что подходит вашему столу:</p></div>
    <div class="setting-block"><p>
    <strong>1. Быстрый консенсус</strong> — для маленьких сговорчивых групп. Кто-то предлагает два-три варианта, поднятие рук, готово. Быстро, но рассыпается, как только мнения реально расходятся.<br><br>
    <strong>2. Approval-голосование</strong> — лучший дефолт для большинства групп. Каждый голосует за <em>все</em> игры, в которые был бы рад сыграть, а не только за фаворита. Побеждает вариант с самой широкой поддержкой. Именно это снимает проблему «застрял в том, что ненавижу»: игра побеждает, только если большинство стола хотя бы не против.<br><br>
    <strong>3. Каждый питчит</strong> — для увлечённых групп. У каждого две минуты, чтобы продать одну игру. Энтузиазм заразителен, и люди часто теплеют к варианту, который пропустили бы в списке. Потом голосуете.<br><br>
    <strong>4. Ранжирование</strong> — когда варианты похожи. Каждый ранжирует топ; если ни у кого нет большинства, нижний выбывает, а его голоса перетекают ко вторым выборам. Реально полезно, когда, скажем, две OSR-игры тянут одних и тех же избирателей.
    </p></div>
    <div class="setting-block"><p>Для большинства групп <strong>approval-голосование</strong> — золотая середина: мало драмы, нет расщепления голосов, а победитель — то, с чем готов жить весь стол.</p></div>

    <div class="section-title">Версия за десять минут</div>
    <div class="setting-block"><p><a href="${toolHref}">Session Zero</a> построен вокруг approval-голосования, потому что именно этот формат выдерживает реальные группы. Добавьте игроков (только имена — без аккаунтов), каждый листает каталог из ${SYSTEM_COUNT}+ систем с честными, написанными вручную описаниями и отмечает те, в которые правда готов сыграть. Страница результатов показывает шортлист по голосам. Выбираете победителя — или спорите за топ-3 под пиццу, только теперь спор идёт между тремя играми, которые все уже одобрили, а не с нуля.</p></div>

    <div class="vote-cta vote-cta-top">
      <a href="${toolHref}" class="vote-cta-btn" data-gc-event="cta-vote-guide" data-gc-title="Guide → tool">Запустить голосование с группой →</a>
    </div>

    <div class="section-title">Если не знаете, с чего начать</div>
    <div class="setting-block"><p>Половина ступора — это просто незнание, что вообще есть. Несколько направлений по тому, чего хочет ваша группа:</p></div>
    <div class="setting-block"><p>
    <strong>Лёгкие правила, сел-и-играешь:</strong> <a href="${sys('cairn')}">Cairn</a>, <a href="${sys('mausritter')}">Mausritter</a>, <a href="${sys('mork-borg')}">Mörk Borg</a> — правила объясняются за пять минут.<br>
    <strong>История важнее цифр:</strong> <a href="${sys('blades')}">Blades in the Dark</a>, <a href="${sys('heart')}">Heart</a> — механики толкают сюжет, а не стат-блоки.<br>
    <strong>Хоррор на напряжённый вечер:</strong> <a href="${sys('mothership')}">Mothership</a>, <a href="${sys('call-of-cthulhu')}">Call of Cthulhu</a> — два очень разных вкуса ужаса.<br>
    <strong>Один вечер, без обязательств:</strong> <a href="${sys('the-wretched')}">The Wretched</a>, <a href="${sys('last-tea-shop')}">Last Tea Shop</a> — ваншоты, которые закрываются за одну сессию.<br>
    <strong>Соло или между сессиями:</strong> смотрите <a href="${coll('best-solo-ttrpgs')}">лучшие соло-TTRPG</a>.<br>
    <strong>Олдскульный данжен-вайб:</strong> смотрите <a href="${coll('osr-tabletop-rpgs')}">OSR-системы</a>.
    </p></div>

    <div class="section-title">Три правила, чтобы спор не начался заново</div>
    <div class="setting-block"><p>
    <strong>Сначала определите масштаб.</strong> Ваншот, мини-арка или открытая кампания — проговорите это вслух до голосования. На три сессии и на три года подписываются по-разному.<br><br>
    <strong>Дайте право вето, не только голос.</strong> Одно честное «мне это не зайдёт» лучше узнать до первой сессии, а не на середине.<br><br>
    <strong>Ограничьте время.</strong> Дайте на решение десять минут и жёсткий дедлайн. Бесконечное обсуждение — это ровно то, как побеждает вариант по умолчанию (снова D&amp;D), измором.
    </p></div>

    <div class="section-title">FAQ</div>
    ${faqHTML}

    <div class="vote-cta">
      <a href="${toolHref}" class="vote-cta-btn" data-gc-event="cta-vote-guide" data-gc-title="Guide → tool">Запустить голосование группы →</a>
      <p class="vote-cta-sub">Бесплатно, без регистрации — все голосуют, группа видит шортлист.</p>
    </div>
  `;

  const body = lang === 'en' ? bodyEn : bodyRu;

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': headline,
    'description': desc,
    'url': canonical,
    'inLanguage': lang,
    'author': { '@type': 'Person', 'name': 'Kejid' },
    'publisher': { '@type': 'Organization', 'name': 'Session Zero', 'url': `${SITE}/` },
    'mainEntityOfPage': canonical,
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faq.map(([q, a]) => ({ '@type': 'Question', 'name': q, 'acceptedAnswer': { '@type': 'Answer', 'text': a } })),
  };

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
<meta property="og:type" content="article">
<meta property="og:url" content="${escapeHtml(canonical)}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(desc)}">
<meta property="og:image" content="${escapeHtml(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="${escapeHtml(HOMEPAGE_OG_ALT)}">
<meta property="og:locale" content="${lang === 'ru' ? 'ru_RU' : 'en_US'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(desc)}">
<meta name="twitter:image" content="${escapeHtml(ogImage)}">
<meta name="twitter:image:alt" content="${escapeHtml(HOMEPAGE_OG_ALT)}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Manrope:wght@300;400;600;800&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Manrope:wght@300;400;600;800&display=swap"></noscript>
<link rel="stylesheet" href="/style.min.css">
<script defer src="/lib/lucide.min.js"></script>
<script type="application/ld+json">${JSON.stringify(articleLd)}</script>
<script type="application/ld+json">${JSON.stringify(faqLd)}</script>
</head>
<body class="static-page">
<header class="static-header">
  <a href="${homeHref}" class="back-link">${escBody(S.back_to_catalog)}</a>
  <div class="lang-switch">
    <a href="/${GUIDE_SLUG}.html"${enActive}>${S.lang_en}</a>
    <a href="/ru/${GUIDE_SLUG}.html"${ruActive}>${S.lang_ru}</a>
  </div>
</header>
<main class="static-main">
  <article class="static-article">${body}</article>
</main>
<footer class="static-footer">
  <a href="${homeHref}">${escBody(S.footer_home)}</a> ·
  <a href="${lang === 'ru' ? '/ru/about.html' : '/about.html'}">${escBody(S.footer_about)}</a> ·
  <a href="https://github.com/kejid/sessionzero" target="_blank" rel="noopener">GitHub</a>
</footer>
${CTA_TRACK_SCRIPT}
<script data-goatcounter="https://kejid.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</body>
</html>
`;
}

// ---------- 6. Sitemap ----------
function mtimeIso(filePath) {
  try {
    return fs.statSync(filePath).mtime.toISOString().slice(0, 10);
  } catch (e) {
    return TODAY;
  }
}

function renderSitemap() {
  const urls = [];
  const homeMtime = mtimeIso(path.join(ROOT, 'index.html'));
  const aboutMtime = mtimeIso(path.join(ROOT, 'scripts', 'generate-pages.js'));

  urls.push({
    loc: `${SITE}/`, priority: '1.0', changefreq: 'weekly',
    alts: null, lastmod: homeMtime,
  });
  urls.push({
    loc: `${SITE}/about.html`, priority: '0.6', changefreq: 'monthly',
    alts: { en: `${SITE}/about.html`, ru: `${SITE}/ru/about.html` },
    lastmod: aboutMtime,
  });
  urls.push({
    loc: `${SITE}/ru/about.html`, priority: '0.6', changefreq: 'monthly',
    alts: { en: `${SITE}/about.html`, ru: `${SITE}/ru/about.html` },
    lastmod: aboutMtime,
  });
  urls.push({
    loc: `${SITE}/${GUIDE_SLUG}.html`, priority: '0.8', changefreq: 'monthly',
    alts: { en: `${SITE}/${GUIDE_SLUG}.html`, ru: `${SITE}/ru/${GUIDE_SLUG}.html` },
    lastmod: aboutMtime,
  });
  urls.push({
    loc: `${SITE}/ru/${GUIDE_SLUG}.html`, priority: '0.8', changefreq: 'monthly',
    alts: { en: `${SITE}/${GUIDE_SLUG}.html`, ru: `${SITE}/ru/${GUIDE_SLUG}.html` },
    lastmod: aboutMtime,
  });
  for (const id of ids) {
    const sysMtime = mtimeIso(path.join(DATA_DIR, `${id}.js`));
    urls.push({
      loc: `${SITE}/system/${id}.html`, priority: '0.8', changefreq: 'monthly',
      alts: { en: `${SITE}/system/${id}.html`, ru: `${SITE}/ru/system/${id}.html` },
      lastmod: sysMtime,
    });
    urls.push({
      loc: `${SITE}/ru/system/${id}.html`, priority: '0.8', changefreq: 'monthly',
      alts: { en: `${SITE}/system/${id}.html`, ru: `${SITE}/ru/system/${id}.html` },
      lastmod: sysMtime,
    });
  }
  // RU homepage landing
  urls.push({
    loc: `${SITE}/ru/`, priority: '0.9', changefreq: 'weekly',
    alts: { en: `${SITE}/`, ru: `${SITE}/ru/` },
    lastmod: mtimeIso(path.join(ROOT, 'scripts', 'generate-pages.js')),
  });
  // Collection (intent) pages
  for (const slug of collectionSlugs) {
    const collMtime = mtimeIso(COLLECTIONS_FILE);
    urls.push({
      loc: `${SITE}/collections/${slug}.html`, priority: '0.7', changefreq: 'monthly',
      alts: { en: `${SITE}/collections/${slug}.html`, ru: `${SITE}/ru/collections/${slug}.html` },
      lastmod: collMtime,
    });
    urls.push({
      loc: `${SITE}/ru/collections/${slug}.html`, priority: '0.7', changefreq: 'monthly',
      alts: { en: `${SITE}/collections/${slug}.html`, ru: `${SITE}/ru/collections/${slug}.html` },
      lastmod: collMtime,
    });
  }
  // Home: EN canonical at root, RU variant at /ru/
  urls[0].alts = { en: `${SITE}/`, ru: `${SITE}/ru/` };

  const out = ['<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">'];
  for (const u of urls) {
    out.push('  <url>');
    out.push(`    <loc>${u.loc}</loc>`);
    out.push(`    <lastmod>${u.lastmod || TODAY}</lastmod>`);
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
ensureDir(OUT_COLLECTIONS);
ensureDir(OUT_RU_COLLECTIONS);

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

fs.writeFileSync(GUIDE_EN, renderGuidePage('en'), 'utf8');
fs.writeFileSync(GUIDE_RU, renderGuidePage('ru'), 'utf8');
written += 2;

for (const slug of collectionSlugs) {
  const cfg = COLLECTIONS[slug];
  try {
    fs.writeFileSync(path.join(OUT_COLLECTIONS, `${slug}.html`), renderCollectionPage(slug, cfg, 'en'), 'utf8');
    fs.writeFileSync(path.join(OUT_RU_COLLECTIONS, `${slug}.html`), renderCollectionPage(slug, cfg, 'ru'), 'utf8');
    written += 2;
  } catch (e) {
    console.error(`[generate-pages] failed to render collection ${slug}:`, e.message);
    process.exit(1);
  }
}

fs.writeFileSync(RU_HOME, renderRuHome(), 'utf8');
written += 1;

fs.writeFileSync(SITEMAP, renderSitemap(), 'utf8');

console.log(`[generate-pages] wrote ${written} HTML pages + sitemap.xml`);
console.log(`[generate-pages] systems: ${ids.length} (×2 langs = ${ids.length * 2} system pages), collections: ${collectionSlugs.length}`);
