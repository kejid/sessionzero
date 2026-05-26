// ============================================================================
// Session Zero — shareable lists + async voting rooms (front-end).
//
// Self-contained overlay layered on top of the main app. Activated by a
// `#room=<id>` hash, or via szOpenCreate() from the sidebar. Talks to the tiny
// Railway API (window.SESSIONZERO_API). When that's empty, the feature is dark
// and the site behaves exactly as before — nothing here touches app.js state.
//
// Depends only on globals the main app already exposes: SYSTEMS_DATA,
// SYSTEM_IDS, SYSTEM_NAMES, hiddenSystems, currentLang, localField, heroThumb,
// showToast, setLang, refreshIcons, track.
// ============================================================================

const SZ_API = (window.SESSIONZERO_API || '').replace(/\/+$/, '');

// --- tiny self-contained i18n (avoids touching i18n.js / rebuild of bundles) ---
const SZ_STR = {
  en: {
    create_title: 'Create a shared vote',
    create_desc: 'Your group opens one link and votes whenever they like — from any device. You\'ll see a live ranked shortlist.',
    create_count: '{n} systems from your current list',
    create_label: 'Title (optional)',
    create_placeholder: 'e.g. What do we play after Strahd?',
    create_btn: 'Create link',
    create_cancel: 'Cancel',
    create_none: 'Your list is empty — pick some systems first (Manage list).',
    link_ready: 'Share this link with your group',
    open_room: 'Open the vote',
    copy: 'Copy',
    copied: 'Copied!',
    room_default_title: 'What should we play next?',
    room_intro: 'Vote for the games you\'d be up for. Veto the ones you definitely won\'t. Come back any time to change your mind.',
    your_name: 'Your name',
    name_placeholder: 'Enter your name to vote',
    up: 'Up for it',
    veto: 'Veto',
    open_page: 'Open game page (new tab)',
    save_vote: 'Save my vote',
    saved: 'Saved ✓',
    saving: 'Saving…',
    tally_title: 'Results so far',
    voted_count: '{n} voted',
    no_votes_yet: 'No votes yet — be the first.',
    not_found: 'This vote doesn\'t exist (or was removed).',
    back_home: 'Go to Session Zero',
    exit: 'Exit',
    load_error: 'Couldn\'t load this vote. Check your connection and retry.',
    retry: 'Retry',
    not_configured: 'Shared voting isn\'t configured on this site.',
    missing_systems: '{n} system(s) in this list aren\'t in your catalog and were skipped.',
    name_first: 'Enter your name first.',
    share_title: 'Share these systems',
    share_count: '{n} systems selected',
    list_btn: 'Copy list link',
    list_hint: 'Just a browsable list — no voting, no server.',
    or_vote: '…or collect everyone\'s votes:',
    pick_all: 'Select all',
    pick_none: 'Clear',
    pick_search: 'Search systems…',
    edit_list: 'Edit list',
    list_block_title: 'Just a list',
    list_block_desc: 'Read-only — they browse the games and open full pages. No voting, no signup, no server.',
    vote_block_title: 'Collect votes',
    vote_block_desc: 'Everyone votes Up / Veto on their own device, any time — you get a live ranked shortlist.',
    my_votes: 'Your shared votes',
    open: 'Open',
    list_title: 'Shortlist',
    list_intro: 'A shortlist of games shared with you. Tap any to read more.',
    list_to_vote: 'Collect votes on this list',
    copy_list_done: 'List link copied!',
    faq_summary: 'New here? How does this work?',
    faq_what_q: 'What is this?',
    faq_what_a: 'Someone shared a shortlist of tabletop RPGs from Session Zero so your group can pick what to play next. Tap a game’s title to read about it.',
    faq_acct_q: 'Do I need an account?',
    faq_acct_a: 'No signup. Your name is just a label so everyone sees who voted.',
    faq_vote_q: 'How do I vote?',
    faq_vote_a: 'Type your name, mark each game “Up for it” or “Veto”, then hit “Save my vote”.',
    faq_change_q: 'Can I change my mind?',
    faq_change_a: 'Yes — come back to this link anytime and update your vote.',
  },
  ru: {
    create_title: 'Создать общее голосование',
    create_desc: 'Группа открывает одну ссылку и голосует когда удобно — с любого устройства. Ты видишь живой ранжированный шортлист.',
    create_count: '{n} систем из твоего текущего списка',
    create_label: 'Название (необязательно)',
    create_placeholder: 'напр. Во что играем после Страда?',
    create_btn: 'Создать ссылку',
    create_cancel: 'Отмена',
    create_none: 'Список пуст — сначала выбери системы («Управление списком»).',
    link_ready: 'Отправь эту ссылку своей группе',
    open_room: 'Открыть голосование',
    copy: 'Копировать',
    copied: 'Скопировано!',
    room_default_title: 'Во что играем дальше?',
    room_intro: 'Голосуй за игры, в которые готов сыграть. Вето — за те, в которые точно нет. Можно вернуться и передумать в любой момент.',
    your_name: 'Твоё имя',
    name_placeholder: 'Введи имя, чтобы голосовать',
    up: 'За',
    veto: 'Вето',
    open_page: 'Открыть страницу игры (новая вкладка)',
    save_vote: 'Сохранить голос',
    saved: 'Сохранено ✓',
    saving: 'Сохраняю…',
    tally_title: 'Текущие результаты',
    voted_count: 'Проголосовало: {n}',
    no_votes_yet: 'Голосов пока нет — будь первым.',
    not_found: 'Такого голосования нет (или его удалили).',
    back_home: 'На Session Zero',
    exit: 'Выйти',
    load_error: 'Не удалось загрузить голосование. Проверь соединение и попробуй снова.',
    retry: 'Повторить',
    not_configured: 'Общее голосование на этом сайте не настроено.',
    missing_systems: '{n} систем(ы) из списка нет в твоём каталоге — пропущены.',
    name_first: 'Сначала введи имя.',
    share_title: 'Поделиться системами',
    share_count: 'Выбрано систем: {n}',
    list_btn: 'Скопировать ссылку на список',
    list_hint: 'Просто список для просмотра — без голосования и сервера.',
    or_vote: '…или собрать голоса группы:',
    pick_all: 'Выбрать все',
    pick_none: 'Снять все',
    pick_search: 'Поиск систем…',
    edit_list: 'Изменить список',
    list_block_title: 'Просто список',
    list_block_desc: 'Read-only — листают игры и открывают полные страницы. Без голосования, регистрации и сервера.',
    vote_block_title: 'Собрать голоса',
    vote_block_desc: 'Каждый со своего устройства жмёт За / Вето в удобное время — ты видишь живой ранжированный шортлист.',
    my_votes: 'Мои голосования',
    open: 'Открыть',
    list_title: 'Шортлист',
    list_intro: 'Кто-то поделился с тобой подборкой игр. Нажми на любую, чтобы узнать больше.',
    list_to_vote: 'Собрать голоса по списку',
    copy_list_done: 'Ссылка на список скопирована!',
    faq_summary: 'Впервые здесь? Как это работает?',
    faq_what_q: 'Что это?',
    faq_what_a: 'Кто-то поделился подборкой настолок из Session Zero, чтобы группа выбрала, во что играть. Нажми на название игры, чтобы почитать о ней.',
    faq_acct_q: 'Нужен аккаунт?',
    faq_acct_a: 'Регистрации нет. Имя нужно только чтобы остальные видели, кто голосовал.',
    faq_vote_q: 'Как голосовать?',
    faq_vote_a: 'Введи имя, отметь каждую игру «За» или «Вето» и нажми «Сохранить голос».',
    faq_change_q: 'Можно передумать?',
    faq_change_a: 'Да — вернись по ссылке в любой момент и поменяй голос.',
  },
};
function szT(key, vars) {
  const lang = (typeof currentLang !== 'undefined' && SZ_STR[currentLang]) ? currentLang : 'en';
  let s = SZ_STR[lang][key] || SZ_STR.en[key] || key;
  if (vars) for (const k in vars) s = s.replace('{' + k + '}', vars[k]);
  return s;
}

function szEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// --- API ---
async function szApi(path, opts) {
  const res = await fetch(SZ_API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const err = new Error('api_' + res.status);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

// --- room state (only while a room overlay is open) ---
let szRoomId = null;
let szData = null;              // last server payload
let szMyUp = new Set();
let szMyVeto = new Set();
let szPollTimer = null;
let szDirty = false;           // unsaved local changes
let szView = null;             // active overlay view: 'room' | 'list' | 'create'
let szPick = null;             // Set of system ids selected to share (create view)

function szVoterName() {
  try { return localStorage.getItem('sz-voter-name') || ''; } catch (e) { return ''; }
}
function szSetVoterName(name) {
  try { localStorage.setItem('sz-voter-name', name); } catch (e) {}
}

// "My shared votes" — rooms the author created or voted in, kept locally so they
// can return to the results without having saved the link elsewhere.
function szMyRooms() {
  try { return JSON.parse(localStorage.getItem('sz-my-rooms') || '[]'); } catch (e) { return []; }
}
function szRememberRoom(id, title) {
  try {
    const rooms = szMyRooms().filter(r => r.id !== id);
    rooms.unshift({ id, title: title || '', at: Date.now() });
    localStorage.setItem('sz-my-rooms', JSON.stringify(rooms.slice(0, 50)));
  } catch (e) {}
}

// Resolve a stored system id to a renderable system, skipping unknown ones.
function szResolve(id) {
  const sys = (typeof SYSTEMS_DATA !== 'undefined') ? SYSTEMS_DATA[id] : null;
  if (!sys) return null;
  return {
    id,
    name: sys.name || (typeof SYSTEM_NAMES !== 'undefined' ? SYSTEM_NAMES[id] : id) || id,
    tagline: (typeof localField === 'function') ? localField(sys, 'tagline', '') : (sys.tagline || ''),
    hero: sys.heroImage || '',
  };
}

function szThumb(url) {
  if (!url) return '';
  return (typeof heroThumb === 'function') ? heroThumb(url) : url;
}

// ============================ overlay shell ============================
function szEnsureOverlay() {
  let el = document.getElementById('sz-room');
  if (!el) {
    el = document.createElement('div');
    el.id = 'sz-room';
    document.body.appendChild(el);
  }
  document.body.classList.add('sz-room-open');
  return el;
}

function szCloseOverlay() {
  const el = document.getElementById('sz-room');
  if (el) el.remove();
  document.body.classList.remove('sz-room-open');
  if (szPollTimer) { clearInterval(szPollTimer); szPollTimer = null; }
}

function szTopBar() {
  return `
    <div class="sz-topbar">
      <a class="sz-brand" href="${location.pathname}" onclick="szExit(event)">SESSION ZERO</a>
      <div class="sz-topbar-actions">
        <div class="sz-lang">
          <button class="sz-lang-btn" data-lang="en" onclick="szSetLang('en')">EN</button>
          <button class="sz-lang-btn" data-lang="ru" onclick="szSetLang('ru')">RU</button>
        </div>
        <button class="sz-exit" onclick="szExit(event)"><i data-lucide="x"></i><span>${szEsc(szT('exit'))}</span></button>
      </div>
    </div>`;
}

function szMarkLang() {
  document.querySelectorAll('#sz-room .sz-lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === currentLang);
  });
}

// ============================ ROOM (voting) view ============================
async function szEnterRoom(id) {
  szRoomId = id;
  szView = 'room';
  const el = szEnsureOverlay();
  el.innerHTML = szTopBar() + `<div class="sz-body"><div class="sz-loading">…</div></div>`;
  szMarkLang();
  if (typeof refreshIcons === 'function') refreshIcons();

  if (!SZ_API) {
    szRenderMessage(szT('not_configured'));
    return;
  }
  try {
    await szLoadRoom();
    szRenderRoom();
    szStartPolling();
  } catch (e) {
    if (e.status === 404) szRenderMessage(szT('not_found'));
    else szRenderMessage(szT('load_error'), true);
  }
}

async function szLoadRoom() {
  szData = await szApi('/room/' + encodeURIComponent(szRoomId));
  // Seed my ballot from the server (so returning voters can edit), unless I have
  // unsaved local edits in this session.
  if (!szDirty) {
    const me = szVoterName();
    const mine = me ? szData.ballots.find(b => b.voter === me) : null;
    szMyUp = new Set(mine ? mine.up : []);
    szMyVeto = new Set(mine ? mine.veto : []);
  }
}

function szRenderMessage(msg, retry) {
  const body = document.querySelector('#sz-room .sz-body');
  if (!body) return;
  body.innerHTML = `
    <div class="sz-message">
      <p>${szEsc(msg)}</p>
      ${retry ? `<button class="sz-btn" onclick="szEnterRoom('${szEsc(szRoomId)}')">${szEsc(szT('retry'))}</button>` : ''}
      <a class="sz-link" href="${location.pathname}">${szEsc(szT('back_home'))}</a>
    </div>`;
}

function szRenderRoom() {
  const el = document.getElementById('sz-room');
  if (!el || !szData) return;
  const title = szData.title || szT('room_default_title');

  const resolved = szData.list.map(szResolve);
  const missing = resolved.filter(r => !r).length;
  const cards = resolved.filter(Boolean).map(szCardHTML).join('');

  el.innerHTML = szTopBar() + `
    <div class="sz-body">
      <header class="sz-head">
        <h1 class="sz-title">${szEsc(title)}</h1>
        <p class="sz-intro">${szEsc(szT('room_intro'))}</p>
        ${missing ? `<p class="sz-warn">${szEsc(szT('missing_systems', { n: missing }))}</p>` : ''}
        ${szFaqHTML('room')}
      </header>

      <div class="sz-namebar">
        <label class="sz-name-label" for="sz-name">${szEsc(szT('your_name'))}</label>
        <input id="sz-name" class="sz-name-input" type="text" maxlength="40"
               placeholder="${szEsc(szT('name_placeholder'))}" value="${szEsc(szVoterName())}"
               oninput="szOnName(this.value)">
      </div>

      <div class="sz-cards">${cards}</div>

      <div class="sz-savebar">
        <button id="sz-save" class="sz-btn sz-save" onclick="szSaveBallot()">${szEsc(szT('save_vote'))}</button>
        <button class="sz-btn sz-ghost" onclick="szCopyLink()"><i data-lucide="link"></i> ${szEsc(szT('copy'))}</button>
      </div>

      <section class="sz-tally" id="sz-tally"></section>
    </div>`;

  szMarkLang();
  szSyncCardButtons();
  szUpdateSaveBtn();
  szRenderTally();
  if (typeof refreshIcons === 'function') refreshIcons();
}

// Collapsible newcomer FAQ shown on shared-link landings (room + shortlist).
function szFaqHTML(mode) {
  const keys = mode === 'room' ? ['what', 'vote', 'change', 'acct'] : ['what', 'acct'];
  const rows = keys.map(k =>
    `<div class="sz-faq-item"><strong>${szEsc(szT('faq_' + k + '_q'))}</strong><p>${szEsc(szT('faq_' + k + '_a'))}</p></div>`
  ).join('');
  return `<details class="sz-faq"><summary>${szEsc(szT('faq_summary'))}</summary>${rows}</details>`;
}

function szCardHTML(s, readOnly) {
  const thumb = szThumb(s.hero);
  const img = thumb
    ? `<img class="sz-card-img" src="${szEsc(thumb)}" alt="" loading="lazy" decoding="async" onerror="this.style.visibility='hidden'">`
    : `<div class="sz-card-img sz-card-img-empty"></div>`;
  // Title + thumbnail link to the system's full page, opened in a new tab via
  // the main app's deep link (#<id>) so the voter never loses their ballot.
  const href = location.pathname + '#' + encodeURIComponent(s.id);
  const vote = readOnly ? '' : `
      <div class="sz-card-vote">
        <button class="sz-vbtn sz-up" data-id="${szEsc(s.id)}" onclick="szToggle('${szEsc(s.id)}','up')">
          <i data-lucide="thumbs-up"></i><span>${szEsc(szT('up'))}</span>
        </button>
        <button class="sz-vbtn sz-veto" data-id="${szEsc(s.id)}" onclick="szToggle('${szEsc(s.id)}','veto')">
          <i data-lucide="ban"></i><span>${szEsc(szT('veto'))}</span>
        </button>
      </div>`;
  return `
    <div class="sz-card" data-id="${szEsc(s.id)}">
      <a class="sz-card-link" href="${szEsc(href)}" target="_blank" rel="noopener" title="${szEsc(szT('open_page'))}">
        ${img}
        <div class="sz-card-body">
          <div class="sz-card-name">${szEsc(s.name)} <i data-lucide="external-link" class="sz-card-ext"></i></div>
          <div class="sz-card-tagline">${szEsc(s.tagline)}</div>
        </div>
      </a>
      ${vote}
    </div>`;
}

function szSyncCardButtons() {
  document.querySelectorAll('#sz-room .sz-card').forEach(card => {
    const id = card.dataset.id;
    const up = card.querySelector('.sz-up');
    const veto = card.querySelector('.sz-veto');
    if (up) up.classList.toggle('active', szMyUp.has(id));
    if (veto) veto.classList.toggle('active', szMyVeto.has(id));
  });
}

function szToggle(id, kind) {
  if (kind === 'up') {
    if (szMyUp.has(id)) szMyUp.delete(id);
    else { szMyUp.add(id); szMyVeto.delete(id); }
  } else {
    if (szMyVeto.has(id)) szMyVeto.delete(id);
    else { szMyVeto.add(id); szMyUp.delete(id); }
  }
  szDirty = true;
  szSyncCardButtons();
  szUpdateSaveBtn();
}

function szOnName(name) {
  szSetVoterName(name.trim());
  szUpdateSaveBtn();
}

function szUpdateSaveBtn() {
  const btn = document.getElementById('sz-save');
  if (!btn) return;
  const hasName = szVoterName().length > 0;
  btn.disabled = !hasName;
  btn.classList.toggle('sz-dirty', szDirty && hasName);
}

async function szSaveBallot() {
  const voter = szVoterName();
  if (!voter) { if (typeof showToast === 'function') showToast(szT('name_first')); return; }
  const btn = document.getElementById('sz-save');
  if (btn) { btn.disabled = true; btn.textContent = szT('saving'); }
  try {
    await szApi('/room/' + encodeURIComponent(szRoomId) + '/ballot', {
      method: 'PUT',
      body: JSON.stringify({ voter, up: [...szMyUp], veto: [...szMyVeto] }),
    });
    szDirty = false;
    if (typeof track === 'function') track('room-vote');
    szRememberRoom(szRoomId, szData && szData.title);
    if (btn) btn.textContent = szT('saved');
    await szLoadRoom();
    szSyncCardButtons();
    szRenderTally();
    if (typeof refreshIcons === 'function') refreshIcons();
    setTimeout(() => { const b = document.getElementById('sz-save'); if (b) { b.textContent = szT('save_vote'); szUpdateSaveBtn(); } }, 1500);
  } catch (e) {
    if (typeof showToast === 'function') showToast(szT('load_error'));
    if (btn) { btn.textContent = szT('save_vote'); btn.disabled = false; }
  }
}

// ============================ tally ============================
function szRenderTally() {
  const wrap = document.getElementById('sz-tally');
  if (!wrap || !szData) return;
  const voters = szData.voters || [];
  const nameById = {};
  szData.list.forEach(id => { const r = szResolve(id); if (r) nameById[id] = r.name; });

  const ranked = (szData.tally || []).filter(row => row.up > 0 || row.veto > 0);
  const rows = ranked.map(row => {
    const upChips = szData.ballots.filter(b => b.up.includes(row.id)).map(b => `<span class="sz-chip sz-chip-up">${szEsc(b.voter)}</span>`).join('');
    const vetoChips = szData.ballots.filter(b => b.veto.includes(row.id)).map(b => `<span class="sz-chip sz-chip-veto">${szEsc(b.voter)}</span>`).join('');
    return `
      <li class="sz-tally-row">
        <div class="sz-tally-main">
          <span class="sz-tally-name">${szEsc(nameById[row.id] || row.id)}</span>
          <span class="sz-tally-score" title="up − veto">${row.score > 0 ? '+' : ''}${row.score}</span>
        </div>
        <div class="sz-tally-chips">${upChips}${vetoChips}</div>
      </li>`;
  }).join('');

  wrap.innerHTML = `
    <h2 class="sz-tally-title">${szEsc(szT('tally_title'))} <span class="sz-voted">${szEsc(szT('voted_count', { n: voters.length }))}</span></h2>
    ${ranked.length ? `<ol class="sz-tally-list">${rows}</ol>` : `<p class="sz-empty">${szEsc(szT('no_votes_yet'))}</p>`}`;
}

function szStartPolling() {
  if (szPollTimer) clearInterval(szPollTimer);
  szPollTimer = setInterval(async () => {
    if (document.hidden) return;
    try { await szLoadRoom(); szSyncCardButtons(); szRenderTally(); }
    catch (e) { /* transient; next tick retries */ }
  }, 5000);
}

// ============================ LIST (read-only) view ============================
let szListIds = null;
function szEnterList(ids) {
  szListIds = ids;
  szRoomId = null;
  szView = 'list';
  const el = szEnsureOverlay();
  const resolved = ids.map(szResolve);
  const missing = resolved.filter(r => !r).length;
  const cards = resolved.filter(Boolean).map(s => szCardHTML(s, true)).join('');
  const voteCta = SZ_API ? `
    <div class="sz-savebar">
      <button class="sz-btn sz-save" onclick="szDoCreateFromList()">${szEsc(szT('list_to_vote'))}</button>
      <button class="sz-btn sz-ghost" onclick="szCopyListLink()"><i data-lucide="link"></i> ${szEsc(szT('copy'))}</button>
    </div>` : `
    <div class="sz-savebar">
      <button class="sz-btn sz-ghost" onclick="szCopyListLink()"><i data-lucide="link"></i> ${szEsc(szT('copy'))}</button>
    </div>`;
  el.innerHTML = szTopBar() + `
    <div class="sz-body">
      <header class="sz-head">
        <h1 class="sz-title">${szEsc(szT('list_title'))}</h1>
        <p class="sz-intro">${szEsc(szT('list_intro'))}</p>
        ${missing ? `<p class="sz-warn">${szEsc(szT('missing_systems', { n: missing }))}</p>` : ''}
        ${szFaqHTML('list')}
      </header>
      <div class="sz-cards">${cards}</div>
      ${voteCta}
    </div>`;
  szMarkLang();
  if (typeof refreshIcons === 'function') refreshIcons();
}

// Promote the currently-viewed shared list into a real async vote (needs API).
async function szDoCreateFromList() {
  if (!SZ_API || !szListIds || !szListIds.length) return;
  try {
    const { roomId } = await szApi('/room', { method: 'POST', body: JSON.stringify({ title: '', list: szListIds }) });
    if (typeof track === 'function') track('room-create');
    szRememberRoom(roomId, '');
    szGoRoom(null, roomId);
  } catch (e) {
    if (typeof showToast === 'function') showToast(szT('load_error'));
  }
}

function szListUrl(ids) {
  return SZ_API ? (SZ_API + '/l/' + ids.join(',')) : (location.origin + location.pathname + '#list=' + ids.join(','));
}
function szCopyListLink() {
  const ids = szListIds || (szPick ? [...szPick] : szSelectedSystems());
  if (!ids.length) return;
  const url = szListUrl(ids);
  const done = () => { if (typeof showToast === 'function') showToast(szT('copy_list_done')); };
  if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, () => prompt(szT('copy'), url));
  else prompt(szT('copy'), url);
}

// ============================ link / lang / exit ============================
// Shared URLs point at the server's OG routes (so links unfurl with previews),
// which redirect into the SPA. Without an API, fall back to direct hash links.
function szRoomUrl(id) {
  return SZ_API ? (SZ_API + '/r/' + id) : (location.origin + location.pathname + '#room=' + id);
}
function szCopyLink() {
  const url = szRoomUrl(szRoomId);
  const done = () => { if (typeof showToast === 'function') showToast(szT('copied')); };
  if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, () => prompt(szT('copy'), url));
  else prompt(szT('copy'), url);
}
function szSetLang(lang) {
  if (typeof setLang === 'function') setLang(lang); // rebuilds SYSTEMS_DATA via langchange
  szMarkLang();
}
function szExit(event) {
  if (event) event.preventDefault();
  szCloseOverlay();
  szRoomId = null; szData = null; szDirty = false; szListIds = null; szView = null;
  history.replaceState({ page: 'results' }, '', location.pathname + '#results');
}

// Re-render whichever overlay view is open when the app's language changes.
document.addEventListener('langchange', () => {
  if (!document.getElementById('sz-room')) return;
  if (szView === 'room' && szData) szRenderRoom();
  else if (szView === 'list' && szListIds) szEnterList(szListIds);
  else if (szView === 'create') szOpenCreate();
});

// ============================ CREATE flow ============================
function szSelectedSystems() {
  // Official, currently-visible systems only. Custom systems live in the GM's
  // localStorage and won't resolve for anyone else, so they can't be shared.
  const hidden = (typeof hiddenSystems !== 'undefined') ? hiddenSystems : [];
  const all = (typeof SYSTEM_IDS !== 'undefined') ? SYSTEM_IDS : [];
  const visible = all.filter(id => !hidden.includes(id));
  return visible.length ? visible : all;
}

// ---- inline system picker (edit the shared list right in the panel) ----
// All official systems, grouped exactly like the catalog (localized via t()).
function szPickGroups() {
  return (typeof getNavGroups === 'function') ? getNavGroups(typeof currentGrouping !== 'undefined' ? currentGrouping : 'default') : [];
}
function szAllPickIds() {
  const ids = [];
  szPickGroups().forEach(g => g.ids.forEach(id => { if (SYSTEMS_DATA[id]) ids.push(id); }));
  return ids;
}
// Persist the share selection across reloads.
function szLoadPick() {
  try {
    const raw = JSON.parse(localStorage.getItem('sz-picker-selection') || 'null');
    if (Array.isArray(raw)) {
      const f = raw.filter(id => SYSTEMS_DATA[id]);
      if (f.length) return new Set(f);
    }
  } catch (e) {}
  return new Set(szAllPickIds());
}
function szSavePick() {
  try { localStorage.setItem('sz-picker-selection', JSON.stringify([...szPick])); } catch (e) {}
}

function szPickerHTML() {
  return szPickGroups().map((g, idx) => {
    const items = g.ids.filter(id => SYSTEMS_DATA[id]);
    if (!items.length) return '';
    const title = (typeof t === 'function') ? t(g.key) : g.key;
    const rows = items.map(id => {
      const name = (SYSTEMS_DATA[id] && SYSTEMS_DATA[id].name) ||
        (typeof SYSTEM_NAMES !== 'undefined' && SYSTEM_NAMES[id]) || id;
      return `<label class="sz-pick-item">
        <input type="checkbox" data-id="${szEsc(id)}" ${szPick.has(id) ? 'checked' : ''} onchange="szTogglePick('${szEsc(id)}', this.checked)">
        <span>${szEsc(name)}</span>
      </label>`;
    }).join('');
    return `<div class="sz-pick-group" data-group="${idx}">
      <label class="sz-pick-gtitle">
        <input type="checkbox" class="sz-group-cb" onchange="szToggleGroup(${idx}, this.checked)">
        <span>${szEsc(title)}</span>
      </label>${rows}</div>`;
  }).join('');
}
function szTogglePick(id, on) {
  if (on) szPick.add(id); else szPick.delete(id);
  szSavePick();
  szUpdatePickUI();
}
function szPickAll(on) {
  szPick = new Set(on ? szAllPickIds() : []);
  document.querySelectorAll('#sz-picker input[data-id]').forEach(cb => { cb.checked = on; });
  szSavePick();
  szUpdatePickUI();
}
// Toggle a whole group (by its index in szPickGroups()).
function szToggleGroup(idx, on) {
  const g = szPickGroups()[idx];
  if (!g) return;
  g.ids.filter(id => SYSTEMS_DATA[id]).forEach(id => { if (on) szPick.add(id); else szPick.delete(id); });
  const div = document.querySelector('#sz-picker .sz-pick-group[data-group="' + idx + '"]');
  if (div) div.querySelectorAll('input[data-id]').forEach(cb => { cb.checked = on; });
  szSavePick();
  szUpdatePickUI();
}
// Reflect per-group checkbox state (checked / indeterminate) from szPick.
function szSyncGroupChecks() {
  document.querySelectorAll('#sz-picker .sz-pick-group').forEach(div => {
    const g = szPickGroups()[+div.dataset.group];
    const cb = div.querySelector('.sz-group-cb');
    if (!g || !cb) return;
    const ids = g.ids.filter(id => SYSTEMS_DATA[id]);
    const sel = ids.filter(id => szPick.has(id)).length;
    cb.checked = ids.length > 0 && sel === ids.length;
    cb.indeterminate = sel > 0 && sel < ids.length;
  });
}
// Filter the checklist by name (substring), hiding empty groups.
function szFilterPicker(q) {
  q = (q || '').toLowerCase().trim();
  document.querySelectorAll('#sz-picker .sz-pick-group').forEach(div => {
    let any = false;
    div.querySelectorAll('.sz-pick-item').forEach(item => {
      const show = !q || item.textContent.toLowerCase().includes(q);
      item.style.display = show ? '' : 'none';
      if (show) any = true;
    });
    div.style.display = any ? '' : 'none';
  });
}
function szUpdatePickUI() {
  const c = document.getElementById('sz-pick-count');
  if (c) c.textContent = szT('share_count', { n: szPick.size });
  const disabled = szPick.size === 0;
  document.querySelectorAll('#sz-room .sz-pick-action').forEach(b => { b.disabled = disabled; });
  document.querySelectorAll('#sz-room .sz-pick-n').forEach(s => { s.textContent = ' (' + szPick.size + ')'; });
  szSyncGroupChecks();
}

function szOpenCreate() {
  szView = 'create';
  const el = szEnsureOverlay();
  if (szPick === null) szPick = szLoadPick(); // restore last selection, else all on
  const myRooms = szMyRooms();

  // Inline picker — collapsed by default into a summary so the share actions stay
  // above the fold; expand to curate. Native <details> = free a11y + keyboard.
  const picker = `
    <details class="sz-share-block sz-pick-details">
      <summary class="sz-pick-summary">
        <span class="sz-count" id="sz-pick-count">${szEsc(szT('share_count', { n: szPick.size }))}</span>
        <span class="sz-pick-toggle">${szEsc(szT('edit_list'))} <i data-lucide="chevron-down"></i></span>
      </summary>
      <div class="sz-pick-tools">
        <input class="sz-name-input sz-pick-search" type="text" placeholder="${szEsc(szT('pick_search'))}" oninput="szFilterPicker(this.value)">
        <span class="sz-pick-allnone">
          <button onclick="szPickAll(true)">${szEsc(szT('pick_all'))}</button>
          <button onclick="szPickAll(false)">${szEsc(szT('pick_none'))}</button>
        </span>
      </div>
      <div class="sz-picker" id="sz-picker">${szPickerHTML()}</div>
    </details>`;

  // Read-only list link — always available, needs no backend.
  const listSection = `
    <div class="sz-share-block">
      <h2 class="sz-subhead">${szEsc(szT('list_block_title'))}</h2>
      <p class="sz-hint">${szEsc(szT('list_block_desc'))}</p>
      <div class="sz-savebar">
        <button class="sz-btn sz-save sz-pick-action" onclick="szCopyListLink()"><i data-lucide="link"></i> ${szEsc(szT('list_btn'))}<span class="sz-pick-n"></span></button>
      </div>
    </div>`;

  // Async vote — only when the rooms API is configured.
  const voteSection = SZ_API ? `
    <div class="sz-share-block">
      <h2 class="sz-subhead">${szEsc(szT('vote_block_title'))}</h2>
      <p class="sz-hint">${szEsc(szT('vote_block_desc'))}</p>
      <input id="sz-room-title" class="sz-name-input" type="text" maxlength="120" placeholder="${szEsc(szT('create_placeholder'))}">
      <div class="sz-savebar">
        <button class="sz-btn sz-save sz-pick-action" onclick="szDoCreate()">${szEsc(szT('create_btn'))}<span class="sz-pick-n"></span></button>
      </div>
    </div>` : '';

  // "Your shared votes" — rooms created or voted in, for easy return.
  const historySection = myRooms.length ? `
    <div class="sz-share-block sz-history">
      <h2 class="sz-subhead">${szEsc(szT('my_votes'))}</h2>
      <ul class="sz-history-list">
        ${myRooms.map(r => `<li><a href="${szEsc(szRoomUrl(r.id))}" onclick="szGoRoom(event,'${szEsc(r.id)}')">${szEsc(r.title || szT('room_default_title'))}</a></li>`).join('')}
      </ul>
    </div>` : '';

  el.innerHTML = szTopBar() + `
    <div class="sz-body">
      <div class="sz-create">
        <h1 class="sz-title">${szEsc(szT('share_title'))}</h1>
        ${picker}${listSection}${voteSection}${historySection}
      </div>
    </div>`;
  szMarkLang();
  szUpdatePickUI();
  if (typeof refreshIcons === 'function') refreshIcons();
}

async function szDoCreate() {
  const titleEl = document.getElementById('sz-room-title');
  const title = titleEl ? titleEl.value.trim() : '';
  const list = szPick ? [...szPick] : szSelectedSystems();
  if (!list.length) return;
  try {
    const { roomId } = await szApi('/room', { method: 'POST', body: JSON.stringify({ title, list }) });
    if (typeof track === 'function') track('room-create');
    szRememberRoom(roomId, title);
    const url = szRoomUrl(roomId);
    const el = document.getElementById('sz-room');
    el.innerHTML = szTopBar() + `
      <div class="sz-body">
        <div class="sz-create sz-link-ready">
          <h1 class="sz-title">${szEsc(szT('link_ready'))}</h1>
          <div class="sz-linkbox">
            <input class="sz-name-input" id="sz-share-url" readonly value="${szEsc(url)}" onclick="this.select()">
            <button class="sz-btn sz-save" onclick="szCopyShare()"><i data-lucide="link"></i> ${szEsc(szT('copy'))}</button>
          </div>
          <a class="sz-btn sz-ghost sz-open" href="${szEsc(url)}" onclick="szGoRoom(event,'${szEsc(roomId)}')">${szEsc(szT('open_room'))}</a>
        </div>
      </div>`;
    szMarkLang();
    if (typeof refreshIcons === 'function') refreshIcons();
  } catch (e) {
    if (typeof showToast === 'function') showToast(szT('load_error'));
  }
}

function szCopyShare() {
  const input = document.getElementById('sz-share-url');
  if (!input) return;
  const done = () => { if (typeof showToast === 'function') showToast(szT('copied')); };
  if (navigator.clipboard) navigator.clipboard.writeText(input.value).then(done, () => { input.select(); });
  else { input.select(); document.execCommand && document.execCommand('copy'); done(); }
}

function szGoRoom(event, id) {
  if (event) event.preventDefault();
  history.replaceState({ page: 'room' }, '', location.pathname + '#room=' + id);
  szEnterRoom(id);
}

// ============================ boot / hash routing ============================
function szRoomIdFromHash() {
  const m = (location.hash || '').match(/[#&]room=([A-Za-z0-9]+)/);
  return m ? m[1] : null;
}
function szListFromHash() {
  const m = (location.hash || '').match(/[#&]list=([A-Za-z0-9_,-]+)/);
  if (!m) return null;
  const ids = m[1].split(',').map(s => s.trim()).filter(Boolean);
  return ids.length ? ids : null;
}
function szRoute() {
  const room = szRoomIdFromHash();
  if (room) { if (room !== szRoomId) szEnterRoom(room); return true; }
  const list = szListFromHash();
  if (list) { szEnterList(list); return true; }
  return false;
}
function szInit() {
  // The "Share these systems" sidebar entry is always useful — read-only list
  // sharing needs no backend. (Vote creation inside is gated on the API.)
  const btn = document.getElementById('sz-create-btn');
  if (btn) btn.style.display = '';
  szRoute();
}
window.addEventListener('hashchange', szRoute);

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', szInit);
else szInit();
