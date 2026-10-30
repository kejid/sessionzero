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
    opt_expected: 'How many people will vote',
    opt_expected_hint: 'Optional. Everyone sees how many votes are still missing.',
    opt_veto: 'Allow vetoes',
    opt_veto_hint: 'One veto takes a game out of the running.',
    create_btn: 'Create link',
    create_cancel: 'Cancel',
    create_none: 'Your shortlist is empty — tap + on games in the catalog first.',
    link_ready: 'Share this link with your group',
    open_room: 'Open the vote',
    copy: 'Copy',
    copied: 'Copied!',
    copy_link: 'Copy link',
    ballot_counts: 'Up: {up} · Against: {down} · Veto: {veto}',
    ballot_counts_no_veto: 'Up: {up} · Against: {down}',
    unsaved: 'not saved yet',
    all_saved: 'saved',
    see_results: 'Results',
    tab_results: 'Results',
    share_image: 'Share results',
    save_image: 'Save as image',
    share_short: 'Share',
    custom_game: 'custom',
    list_custom_skipped: 'Your own games only travel in a vote, not in a list link.',
    down_not_saved: '"Against" votes are not saved yet — the rest of your vote is saved.',
    gm_toggle: 'I\'m the GM',
    gm_toggle_hint: '— I\'ll run the game. Your "up" votes show as "GM wants to run".',
    gm_short: 'GM',
    gm_up: 'GM wants to run',
    gm_veto: 'GM vetoed',
    gm_down: 'GM is against',
    img_down: 'against',
    suggest_btn: 'Suggest a game',
    suggest_left: '{n} left',
    suggest_title: 'Add a game to this vote',
    suggest_hint: 'Everyone will see it and can vote on it. You can add {n} more.',
    suggest_search: 'Search the catalog…',
    suggest_none: 'Nothing found — try another name.',
    suggest_added: 'Added to the vote. Don\'t forget to save your vote.',
    suggest_limit: 'You\'ve already suggested the maximum number of games.',
    suggested_by: 'Suggested by {name}',
    copy_image: 'Copy image',
    image_copied: 'Image copied — paste it into a chat (Ctrl+V)',
    save_short: 'Image',
    go_vote: 'Vote',
    img_results: 'Vote results',
    img_winner: 'We play',
    img_veto: 'veto',
    img_more: '+{n} more',
    img_footer: 'Pick your next TTRPG as a group',
    tab_vote: 'My vote',
    results_locked: '{n} voted so far. Results open after you vote.',
    results_locked_of: '{n} of {m} voted so far. Results open after you vote.',
    peek_results: 'See results without voting',
    leave_unsaved: 'Your vote is not saved yet. Leave anyway?',
    room_default_title: 'What should we play next?',
    room_intro: 'Up for it is +1, Against is −1. Veto is for games you won\'t play at all: one veto takes a game out. Come back any time to change your mind.',
    room_intro_no_veto: 'Up for it is +1, Against is −1. Come back any time to change your mind.',
    veto_out: 'vetoed',
    vetoed_title: 'Vetoed — out of the running',
    your_name: 'Your name',
    name_placeholder: 'Enter your name to vote',
    up: 'Up for it',
    down: 'Against',
    veto: 'Veto',
    open_page: 'Open game page (new tab)',
    save_vote: 'Save my vote',
    save_need_name: 'Enter your name above to save.',
    saved: 'Saved ✓',
    saving: 'Saving…',
    tally_title: 'Results so far',
    voted_count: '{n} voted',
    voted_of: '{n} of {m} voted',
    no_votes_yet: 'No votes yet — be the first.',
    not_found: 'This vote doesn\'t exist (or was removed).',
    back_home: 'Go to Session Zero',
    exit: 'Exit',
    load_error: 'Couldn\'t load this vote. Check your connection and retry.',
    retry: 'Retry',
    not_configured: 'Shared voting isn\'t configured on this site.',
    missing_systems: '{n} system(s) in this list aren\'t in your catalog and were skipped.',
    name_first: 'Enter your name first.',
    name_restored: 'Loaded the vote saved under this name.',
    name_taken: 'This name already has a vote. Saving will replace it.',
    share_title: 'Share your shortlist',
    share_count: '{n} systems selected',
    list_btn: 'Copy list link',
    list_hint: 'Just a browsable list — no voting, no server.',
    or_vote: '…or collect everyone\'s votes:',
    pick_all: 'Select all',
    pick_none: 'Clear',
    pick_search: 'Search systems…',
    edit_list: 'Edit list',
    pick_empty_hint: 'Your shortlist is empty. Tap + on games in the catalog, or tick them below.',
    list_block_title: 'Just a list',
    list_block_desc: 'Read-only — they browse the games and open full pages. No voting, no signup, no server.',
    vote_block_title: 'Collect votes',
    vote_block_desc: 'Everyone votes on their own device, any time — you get a live ranked shortlist.',
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
    faq_vote_a: 'Type your name, mark the games you have an opinion on, then hit “Save my vote”.',
    faq_change_q: 'Can I change my mind?',
    faq_change_a: 'Yes — come back to this link anytime and update your vote.',
  },
  ru: {
    create_title: 'Создать общее голосование',
    create_desc: 'Группа открывает одну ссылку и голосует когда удобно — с любого устройства. Ты видишь живой ранжированный шортлист.',
    create_count: '{n} систем из твоего текущего списка',
    create_label: 'Название (необязательно)',
    create_placeholder: 'напр. Во что играем после Страда?',
    opt_expected: 'Сколько человек будут голосовать',
    opt_expected_hint: 'Необязательно. Все увидят, сколько голосов ещё ждём.',
    opt_veto: 'Разрешить вето',
    opt_veto_hint: 'Одно вето убирает игру из выбора.',
    create_btn: 'Создать ссылку',
    create_cancel: 'Отмена',
    create_none: 'Шортлист пуст — сначала нажми + на играх в каталоге.',
    link_ready: 'Отправь эту ссылку своей группе',
    open_room: 'Открыть голосование',
    copy: 'Копировать',
    copied: 'Скопировано!',
    copy_link: 'Скопировать ссылку',
    ballot_counts: 'За: {up} · Против: {down} · Вето: {veto}',
    ballot_counts_no_veto: 'За: {up} · Против: {down}',
    unsaved: 'не сохранено',
    all_saved: 'сохранено',
    see_results: 'Итоги',
    tab_results: 'Итоги',
    share_image: 'Поделиться итогами',
    save_image: 'Сохранить картинкой',
    share_short: 'Поделиться',
    custom_game: 'своя игра',
    list_custom_skipped: 'Свои игры попадают только в голосование, не в ссылку на список.',
    down_not_saved: 'Голоса «против» пока не сохранились — остальной голос сохранён.',
    gm_toggle: 'Я мастер',
    gm_toggle_hint: '— буду вести игру. Мои «за» видны всем как «мастер хочет вести».',
    gm_short: 'мастер',
    gm_up: 'Мастер хочет вести',
    gm_veto: 'Вето мастера',
    gm_down: 'Мастер против',
    img_down: 'против',
    suggest_btn: 'Предложить игру',
    suggest_left: 'осталось {n}',
    suggest_title: 'Добавить игру в голосование',
    suggest_hint: 'Её увидят все и смогут за неё голосовать. Можно добавить ещё {n}.',
    suggest_search: 'Поиск по каталогу…',
    suggest_none: 'Ничего не нашлось — попробуй другое название.',
    suggest_added: 'Игра добавлена. Не забудь сохранить голос.',
    suggest_limit: 'Ты уже предложил максимум игр.',
    suggested_by: 'Предложил(а) {name}',
    copy_image: 'Скопировать картинку',
    image_copied: 'Картинка скопирована — вставьте в чат (Ctrl+V)',
    save_short: 'Картинка',
    go_vote: 'Голосовать',
    img_results: 'Итоги голосования',
    img_winner: 'Играем в',
    img_veto: 'вето',
    img_more: 'и ещё {n}',
    img_footer: 'Выбирайте настольную ролёвку всей группой',
    tab_vote: 'Мой голос',
    results_locked: 'Уже проголосовали: {n}. Итоги откроются после твоего голоса.',
    results_locked_of: 'Уже проголосовали: {n} из {m}. Итоги откроются после твоего голоса.',
    peek_results: 'Посмотреть итоги без голоса',
    leave_unsaved: 'Голос ещё не сохранён. Всё равно уйти?',
    room_default_title: 'Во что играем дальше?',
    room_intro: '«За» — плюс очко, «Против» — минус очко. «Вето» — для игр, в которые ты точно не будешь играть: одно вето убирает игру из выбора. Можно вернуться и передумать в любой момент.',
    room_intro_no_veto: '«За» — плюс очко, «Против» — минус очко. Можно вернуться и передумать в любой момент.',
    veto_out: 'вето',
    vetoed_title: 'Вето — выбывают',
    your_name: 'Твоё имя',
    name_placeholder: 'Введи имя, чтобы голосовать',
    up: 'За',
    down: 'Против',
    veto: 'Вето',
    open_page: 'Открыть страницу игры (новая вкладка)',
    save_vote: 'Сохранить голос',
    save_need_name: 'Введи имя выше, чтобы сохранить.',
    saved: 'Сохранено ✓',
    saving: 'Сохраняю…',
    tally_title: 'Текущие результаты',
    voted_count: 'Проголосовало: {n}',
    voted_of: 'Проголосовало: {n} из {m}',
    no_votes_yet: 'Голосов пока нет — будь первым.',
    not_found: 'Такого голосования нет (или его удалили).',
    back_home: 'На Session Zero',
    exit: 'Выйти',
    load_error: 'Не удалось загрузить голосование. Проверь соединение и попробуй снова.',
    retry: 'Повторить',
    not_configured: 'Общее голосование на этом сайте не настроено.',
    missing_systems: '{n} систем(ы) из списка нет в твоём каталоге — пропущены.',
    name_first: 'Сначала введи имя.',
    name_restored: 'Голос под этим именем загружен.',
    name_taken: 'Под этим именем уже есть голос. Сохранение заменит его.',
    share_title: 'Поделиться списком',
    share_count: 'Выбрано систем: {n}',
    list_btn: 'Скопировать ссылку на список',
    list_hint: 'Просто список для просмотра — без голосования и сервера.',
    or_vote: '…или собрать голоса группы:',
    pick_all: 'Выбрать все',
    pick_none: 'Снять все',
    pick_search: 'Поиск систем…',
    edit_list: 'Изменить список',
    pick_empty_hint: 'Шортлист пуст. Нажми + на играх в каталоге или отметь их ниже.',
    list_block_title: 'Просто список',
    list_block_desc: 'Только просмотр — листают игры и открывают полные страницы. Без голосования, регистрации и сервера.',
    vote_block_title: 'Собрать голоса',
    vote_block_desc: 'Каждый голосует со своего устройства в удобное время — ты видишь живой ранжированный шортлист.',
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
    faq_vote_a: 'Введи имя, отметь игры, по которым есть мнение, и нажми «Сохранить голос».',
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
let szMyDown = new Set();      // soft "against" (−1); a veto knocks the game out
let szDownUnsupported = false; // server didn't echo `down` → keep against votes locally
let szMyGm = false;            // "I'm the GM" on my ballot
let szPollTimer = null;
let szDirty = false;           // unsaved local changes
let szView = null;             // active overlay view: 'room' | 'list' | 'create'
let szPeek = false;            // results opened without voting (e.g. the GM)
let szTab = 'vote';            // phone tab once results are open: 'vote' | 'results'
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
function szRememberRoom(id, title, created) {
  try {
    const prev = szMyRooms().find(r => r.id === id);
    const rooms = szMyRooms().filter(r => r.id !== id);
    rooms.unshift({ id, title: title || '', at: Date.now(), created: !!(created || (prev && prev.created)) });
    localStorage.setItem('sz-my-rooms', JSON.stringify(rooms.slice(0, 50)));
  } catch (e) {}
}

// Resolve a stored system id to a renderable system, skipping unknown ones.
function szResolve(id) {
  const sys = (typeof SYSTEMS_DATA !== 'undefined') ? SYSTEMS_DATA[id] : null;
  if (!sys) {
    const c = (szData && szData.custom && szData.custom[id]) || szLocalCustom(id);
    return c ? { id, name: c.name, tagline: c.tagline || '', hero: c.image || '', custom: true } : null;
  }
  return {
    id,
    name: sys.name || (typeof SYSTEM_NAMES !== 'undefined' ? SYSTEM_NAMES[id] : id) || id,
    tagline: (typeof localField === 'function') ? localField(sys, 'tagline', '') : (sys.tagline || ''),
    hero: sys.heroImage || '',
  };
}

// ---- the user's own (non-catalog) games ----
function szLocalCustom(id) {
  return (typeof CustomSystems !== 'undefined' && CustomSystems.find(id)) || null;
}
// Catalog game or one of this browser's own games: both can go on the shortlist.
function szPickable(id) {
  return !!((typeof SYSTEMS_DATA !== 'undefined' && SYSTEMS_DATA[id]) || szLocalCustom(id));
}
// Room-safe id for a custom game: local ids can hold Cyrillic or be long.
function szRoomCustomId(id) {
  if (/^custom-[a-z0-9_-]{1,40}$/i.test(id)) return id;
  let h = 5381;
  for (const ch of id) h = ((h * 33) ^ ch.codePointAt(0)) >>> 0;
  return 'custom-' + h.toString(36);
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
  szSuggestOpen = false;
  szDownUnsupported = false;
  szView = 'room';
  szPeek = false;
  szTab = 'vote';
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
    if (szHasVoted()) szTab = 'results';  // returning voters land on results
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
  if (!szDirty) szSeedBallot();
}

function szSeedBallot() {
  const me = szVoterName();
  const mine = me ? szData.ballots.find(b => b.voter === me) : null;
  szMyUp = new Set(mine ? mine.up : []);
  szMyVeto = new Set(mine ? mine.veto : []);
  if (!szDownUnsupported) szMyDown = new Set(mine ? (mine.down || []) : []);
  // No ballot yet: whoever created the room here is most likely the GM
  szMyGm = mine ? !!mine.gm : szMyRooms().some(r => r.id === szRoomId && r.created);
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
  const cards = resolved.filter(Boolean).map(s => szCardHTML(s)).join(''); // not .map(szCardHTML) — map's index arg would become readOnly

  el.innerHTML = szTopBar() + `
    <div class="sz-body">
      <header class="sz-head">
        <h1 class="sz-title">${szEsc(title)}</h1>
        <p class="sz-intro">${szEsc(szT(szData.noVeto ? 'room_intro_no_veto' : 'room_intro'))}</p>
        ${missing ? `<p class="sz-warn">${szEsc(szT('missing_systems', { n: missing }))}</p>` : ''}
        ${szFaqHTML('room')}
        <p class="sz-teaser" id="sz-teaser"></p>
      </header>

      <div class="sz-tabs" role="tablist">
        <button class="sz-tab" data-tab="vote" onclick="szSetTab('vote')">${szEsc(szT('tab_vote'))}</button>
        <button class="sz-tab" data-tab="results" onclick="szSetTab('results')"><i data-lucide="lock" class="sz-tab-lock"></i>${szEsc(szT('tab_results'))}</button>
      </div>

      <div class="sz-room-layout" id="sz-room-layout">
      <div class="sz-col-vote">
      <div class="sz-namebar">
        <label class="sz-name-label" for="sz-name">${szEsc(szT('your_name'))}</label>
        <input id="sz-name" class="sz-name-input" type="text" maxlength="40"
               placeholder="${szEsc(szT('name_placeholder'))}" value="${szEsc(szVoterName())}"
               oninput="szOnName(this.value)">
        <label class="sz-gm-toggle">
          <input type="checkbox" id="sz-gm" ${szMyGm ? 'checked' : ''} onchange="szSetGm(this.checked)">
          <span><strong>${szEsc(szT('gm_toggle'))}</strong> ${szEsc(szT('gm_toggle_hint'))}</span>
        </label>
      </div>

      <div class="sz-cards">${cards}</div>
      <div class="sz-suggest" id="sz-suggest">${szSuggestHTML()}</div>

      <div class="sz-savebar sz-savebar-sticky">
        <div class="sz-savebar-status">
          <span id="sz-status"></span>
          <span class="sz-save-hint" id="sz-save-hint">${szEsc(szT('save_need_name'))}</span>
        </div>
        <div class="sz-savebar-actions">
          <button class="sz-btn sz-ghost sz-btn-sm" onclick="szCopyLink()" title="${szEsc(szT('copy_link'))}"><i data-lucide="link"></i><span class="sz-btn-label">${szEsc(szT('copy_link'))}</span></button>
          <button id="sz-save" class="sz-btn sz-save" onclick="szSaveBallot()">${szEsc(szT('save_vote'))}</button>
        </div>
      </div>

      </div>
      <aside class="sz-col-results"><section class="sz-tally" id="sz-tally"></section></aside>
      </div>
    </div>`;

  szMarkLang();
  szSyncCardButtons();
  szUpdateSaveBtn();
  szApplyLayout();
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
  const hasPage = !s.custom || !!szLocalCustom(s.id);
  const vote = readOnly ? '' : `
      <div class="sz-card-vote">
        <button class="sz-vbtn sz-up" data-id="${szEsc(s.id)}" onclick="szToggle('${szEsc(s.id)}','up')">
          <i data-lucide="thumbs-up"></i><span>${szEsc(szT('up'))}</span>
        </button>
        <button class="sz-vbtn sz-down" data-id="${szEsc(s.id)}" onclick="szToggle('${szEsc(s.id)}','down')">
          <i data-lucide="thumbs-down"></i><span>${szEsc(szT('down'))}</span>
        </button>
        ${szData && szData.noVeto ? '' : `<button class="sz-vbtn sz-veto" data-id="${szEsc(s.id)}" onclick="szToggle('${szEsc(s.id)}','veto')">
          <i data-lucide="ban"></i><span>${szEsc(szT('veto'))}</span>
        </button>`}
      </div>`;
  return `
    <div class="sz-card" data-id="${szEsc(s.id)}">
      <${hasPage ? `a class="sz-card-link" href="${szEsc(href)}" target="_blank" rel="noopener" title="${szEsc(szT('open_page'))}"` : 'div class="sz-card-link"'}>
        ${img}
        <div class="sz-card-body">
          <div class="sz-card-name">${szEsc(s.name)} ${hasPage ? '<i data-lucide="external-link" class="sz-card-ext"></i>' : ''}${s.custom ? `<span class="sz-custom-tag">${szEsc(szT('custom_game'))}</span>` : ''}</div>
          <div class="sz-card-tagline">${szEsc(s.tagline)}</div>
          ${readOnly ? '' : szGmTag(s.id)}
          ${!readOnly && szData && szData.suggested && szData.suggested[s.id] ? `<span class="sz-suggested-by"><i data-lucide="user-plus"></i>${szEsc(szT('suggested_by', { name: szData.suggested[s.id] }))}</span>` : ''}
        </div>
      </${hasPage ? 'a' : 'div'}>
      ${vote}
    </div>`;
}

function szSyncCardButtons() {
  let tagsChanged = false;
  document.querySelectorAll('#sz-room .sz-card').forEach(card => {
    const id = card.dataset.id;
    // Keep the "GM would run it" tag in step with the latest server ballots
    const body = card.querySelector('.sz-card-body');
    if (body && card.querySelector('.sz-card-vote')) {
      const want = szGmStance(id) || '';
      const old = body.querySelector('.sz-gm-tag');
      if ((old ? old.dataset.st : '') !== want) {
        if (old) old.remove();
        if (want) body.insertAdjacentHTML('beforeend', szGmTag(id));
        tagsChanged = true;
      }
    }
    const up = card.querySelector('.sz-up');
    const veto = card.querySelector('.sz-veto');
    const down = card.querySelector('.sz-down');
    if (down) down.classList.toggle('active', szMyDown.has(id));
    if (up) up.classList.toggle('active', szMyUp.has(id));
    if (veto) veto.classList.toggle('active', szMyVeto.has(id));
  });
  if (tagsChanged && typeof refreshIcons === 'function') refreshIcons();
}

// One choice per game: up, against or veto (tap again to clear).
function szToggle(id, kind) {
  const sets = { up: szMyUp, down: szMyDown, veto: szMyVeto };
  const was = sets[kind].has(id);
  Object.values(sets).forEach(s => s.delete(id));
  if (!was) sets[kind].add(id);
  szDirty = true;
  szSyncCardButtons();
  szUpdateSaveBtn();
}

// "3 of 5 voted" when the creator said how many to expect, else "3 voted".
// Once more people voted than expected, the "of" would only confuse.
function szVotedText(key) {
  const n = (szData && szData.voters || []).length;
  const m = szData && szData.expected;
  const withTotal = key === 'voted_count' ? 'voted_of' : key + '_of';
  return szT(m && n <= m ? withTotal : key, { n, m });
}

// Has the person on this device already voted in this room?
function szHasVoted() {
  const me = szVoterName();
  return !!(me && szData && szData.ballots.some(b => b.voter === me));
}

// Results stay hidden until you vote, so the ranking can't sway your ballot.
function szResultsOpen() {
  return szPeek || szHasVoted();
}

// Two tabs at every width: "My vote" and "Results". Results stay locked until
// you vote (or peek); saving a vote switches to them.
function szApplyLayout() {
  const room = document.getElementById('sz-room');
  if (!room) return;
  const open = szResultsOpen();
  room.classList.toggle('sz-split', open);
  room.classList.toggle('sz-tab-results', szTab === 'results');
  room.querySelectorAll('.sz-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === szTab));
  room.classList.toggle('sz-results-open', open);  // hides the tab's lock icon
  const teaser = document.getElementById('sz-teaser');
  if (teaser) {
    teaser.hidden = open;
    teaser.innerHTML = open ? '' :
      `<i data-lucide="lock"></i> ${szEsc(szVotedText('results_locked'))} <button type="button" class="sz-link-btn" onclick="szPeekResults()">${szEsc(szT('peek_results'))}</button>`;
  }
}

function szSetTab(tab) {
  szTab = tab;
  szApplyLayout();
  szRenderTally();
  const room = document.getElementById('sz-room');
  if (room) room.scrollTop = 0;
}

function szPeekResults() {
  szPeek = true;
  szTab = 'results';
  szApplyLayout();
  szRenderTally();
}

// Don't let a voter close the tab or leave the room with an unsaved ballot.
window.addEventListener('beforeunload', e => {
  if (szView === 'room' && szDirty) { e.preventDefault(); e.returnValue = ''; }
});

// ---- players add games to the room ----
let szSuggestOpen = false;

function szSuggestLeft() {
  const max = (szData && szData.maxSuggest) || 3;
  const me = szVoterName();
  const used = Object.values((szData && szData.suggested) || {}).filter(v => v === me).length;
  return me ? Math.max(0, max - used) : max;
}

function szSuggestHTML() {
  const left = szSuggestLeft();
  if (!szSuggestOpen) {
    return `<button class="sz-btn sz-ghost sz-suggest-btn" onclick="szToggleSuggest(true)" ${left ? '' : 'disabled'}>
      <i data-lucide="plus"></i> ${szEsc(szT('suggest_btn'))} <span class="sz-suggest-left">${szEsc(szT('suggest_left', { n: left }))}</span>
    </button>`;
  }
  return `
    <div class="sz-suggest-panel">
      <div class="sz-suggest-head">
        <strong>${szEsc(szT('suggest_title'))}</strong>
        <button class="sz-link-btn" onclick="szToggleSuggest(false)">${szEsc(szT('create_cancel'))}</button>
      </div>
      <p class="sz-suggest-hint">${szEsc(szT('suggest_hint', { n: left }))}</p>
      <input class="sz-name-input" id="sz-suggest-q" type="search" autocomplete="off"
             placeholder="${szEsc(szT('suggest_search'))}" oninput="szRenderSuggestResults(this.value)">
      <div class="sz-suggest-results" id="sz-suggest-results"></div>
    </div>`;
}

function szToggleSuggest(open) {
  if (open && !szVoterName()) {
    const inp = document.getElementById('sz-name');
    if (inp) { inp.classList.add('sz-name-needed'); inp.focus(); inp.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    if (typeof showToast === 'function') showToast(szT('name_first'));
    return;
  }
  szSuggestOpen = open;
  const el = document.getElementById('sz-suggest');
  if (!el) return;
  el.innerHTML = szSuggestHTML();
  if (open) { szRenderSuggestResults(''); const q = document.getElementById('sz-suggest-q'); if (q) q.focus(); }
  if (typeof refreshIcons === 'function') refreshIcons();
}

function szRenderSuggestResults(q) {
  const box = document.getElementById('sz-suggest-results');
  if (!box || !szData) return;
  const inList = new Set(szData.list);
  const query = (q || '').trim().toLowerCase();
  const ids = szAllPickIds().filter(id => !inList.has(id) && SYSTEMS_DATA[id]);
  const hits = ids.map(szResolve).filter(Boolean)
    .filter(s => !query || s.name.toLowerCase().includes(query) || (s.tagline || '').toLowerCase().includes(query))
    .slice(0, 8);
  box.innerHTML = hits.length ? hits.map(s => `
    <button class="sz-suggest-item" onclick="szSuggest('${szEsc(s.id)}')">
      <img src="${szEsc(szThumb(s.hero))}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
      <span><strong>${szEsc(s.name)}</strong><small>${szEsc(s.tagline)}</small></span>
      <i data-lucide="plus"></i>
    </button>`).join('') : `<p class="sz-empty">${szEsc(szT('suggest_none'))}</p>`;
  if (typeof refreshIcons === 'function') refreshIcons();
}

async function szSuggest(id) {
  const voter = szVoterName();
  if (!voter) return szToggleSuggest(true);
  try {
    await szApi('/room/' + encodeURIComponent(szRoomId) + '/suggest', {
      method: 'POST', body: JSON.stringify({ voter, id }),
    });
    if (typeof track === 'function') track('room-suggest');
    // You suggested it, so you're up for it — counts once you save your vote
    szMyUp.add(id); szMyVeto.delete(id); szDirty = true;
    szSuggestOpen = false;
    await szLoadRoom();
    szRenderRoom();
    const card = document.querySelector(`#sz-room .sz-card[data-id="${CSS.escape(id)}"]`);
    if (card) { card.scrollIntoView({ block: 'center', behavior: 'smooth' }); card.classList.add('sz-card-new'); }
    if (typeof showToast === 'function') showToast(szT('suggest_added'));
  } catch (e) {
    const msg = e.status === 429 ? 'suggest_limit' : 'load_error';
    if (typeof showToast === 'function') showToast(szT(msg));
  }
}

function szSetGm(on) {
  szMyGm = on;
  szDirty = true;
  szUpdateSaveBtn();
}

// What the GM(s) think of a game: 'up' if any GM would run it, 'veto' if a GM
// vetoed it (and none is up for it), else null.
function szGmStance(id) {
  const gms = (szData && szData.ballots || []).filter(b => b.gm);
  if (gms.some(b => b.up.includes(id))) return 'up';
  if (gms.some(b => b.veto.includes(id))) return 'veto';
  if (gms.some(b => (b.down || []).includes(id))) return 'down';
  return null;
}

function szGmTag(id) {
  const st = szGmStance(id);
  if (!st) return '';
  return `<span class="sz-gm-tag sz-gm-tag-${st}" data-st="${st}"><i data-lucide="dices"></i>${szEsc(szT('gm_' + st))}</span>`;
}

function szOnName(name) {
  szSetVoterName(name.trim());
  // Same name, same ballot: there are no accounts, so a name typed on a new
  // device has to bring its saved vote along, or Save would wipe it.
  const voted = szHasVoted();
  if (!szDirty) {
    szSeedBallot();
    const gm = document.getElementById('sz-gm');
    if (gm) gm.checked = szMyGm;
    szSyncCardButtons();
    szApplyLayout();
    szRenderTally();
    if (typeof refreshIcons === 'function') refreshIcons();
  }
  if (voted && typeof showToast === 'function') showToast(szT(szDirty ? 'name_taken' : 'name_restored'));
  szUpdateSaveBtn();
  if (!szSuggestOpen) { const el = document.getElementById('sz-suggest'); if (el) { el.innerHTML = szSuggestHTML(); if (typeof refreshIcons === 'function') refreshIcons(); } }
}

function szUpdateSaveBtn() {
  const btn = document.getElementById('sz-save');
  if (!btn) return;
  const hasName = szVoterName().length > 0;
  // Save stays enabled even without a name — clicking guides the user to the
  // name field instead of dead-ending on a greyed button.
  btn.classList.toggle('sz-dirty', szDirty);
  const status = document.getElementById('sz-status');
  if (status) {
    const counts = szT(szData && szData.noVeto ? 'ballot_counts_no_veto' : 'ballot_counts', { up: szMyUp.size, down: szMyDown.size, veto: szMyVeto.size });
    const state = szDirty ? szT('unsaved') : (szMyUp.size || szMyDown.size || szMyVeto.size ? szT('all_saved') : '');
    status.innerHTML = szEsc(counts) + (state ? ` · <span class="${szDirty ? 'sz-unsaved' : 'sz-saved'}">${szEsc(state)}</span>` : '');
  }
  const hint = document.getElementById('sz-save-hint');
  if (hint) hint.style.display = hasName ? 'none' : '';
  if (hasName) {
    const inp = document.getElementById('sz-name');
    if (inp) inp.classList.remove('sz-name-needed');
  }
}

async function szSaveBallot() {
  const voter = szVoterName();
  if (!voter) {
    const inp = document.getElementById('sz-name');
    if (inp) { inp.classList.add('sz-name-needed'); inp.focus(); inp.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    if (typeof showToast === 'function') showToast(szT('name_first'));
    return;
  }
  const btn = document.getElementById('sz-save');
  if (btn) { btn.disabled = true; btn.textContent = szT('saving'); }
  try {
    const saved = await szApi('/room/' + encodeURIComponent(szRoomId) + '/ballot', {
      method: 'PUT',
      body: JSON.stringify({ voter, up: [...szMyUp], down: [...szMyDown], veto: [...szMyVeto], gm: szMyGm }),
    });
    // A server without "against" support doesn't echo `down`: keep those votes
    // local and marked unsaved rather than letting the reload wipe them.
    const downLost = szMyDown.size > 0 && !(saved && Array.isArray(saved.down));
    if (downLost && !szDownUnsupported && typeof showToast === 'function') showToast(szT('down_not_saved'));
    if (downLost) szDownUnsupported = true;
    szDirty = false;
    szUpdateSaveBtn();
    if (typeof track === 'function') track('room-vote');
    szRememberRoom(szRoomId, szData && szData.title);
    if (btn) btn.textContent = szT('saved');
    await szLoadRoom();
    szSyncCardButtons();
    szTab = 'results';
    szApplyLayout();
    szRenderTally();
    const room = document.getElementById('sz-room');
    if (room) room.scrollTop = 0;
    if (typeof refreshIcons === 'function') refreshIcons();
    setTimeout(() => { const b = document.getElementById('sz-save'); if (b) { b.textContent = szT('save_vote'); b.disabled = false; szUpdateSaveBtn(); } }, 1500);
  } catch (e) {
    if (typeof showToast === 'function') showToast(szT('load_error'));
    if (btn) { btn.textContent = szT('save_vote'); btn.disabled = false; }
  }
}

// ============================ tally ============================
// A veto knocks a game out. Games nobody vetoed rank by score = up − against
// (then by ups); vetoed ones are listed separately. Computed from the ballots so it doesn't depend on
// which ranking rule the server's tally uses.
function szRank() {
  const ballots = (szData && szData.ballots) || [];
  const rows = ((szData && szData.list) || []).map(id => {
    const up = ballots.filter(b => b.up.includes(id)).length;
    const down = ballots.filter(b => (b.down || []).includes(id)).length;
    return { id, up, down, veto: ballots.filter(b => b.veto.includes(id)).length, score: up - down };
  });
  const byScore = (a, b) => b.score - a.score || b.up - a.up || a.id.localeCompare(b.id);
  const active = rows.filter(r => r.veto === 0 && (r.up > 0 || r.down > 0)).sort(byScore);
  const vetoed = rows.filter(r => r.veto > 0).sort(byScore);
  const top = active.length && active[0].score > 0 ? active[0].score : null;
  return { active, vetoed, top };
}

function szRenderTally() {
  const wrap = document.getElementById('sz-tally');
  if (!wrap || !szData) return;
  const nameById = {};
  szData.list.forEach(id => { const r = szResolve(id); if (r) nameById[id] = r.name; });

  const { active, vetoed, top } = szRank();
  const ranked = active.concat(vetoed);
  const rowHTML = (row, out) => {
    const lead = !out && row.score === top;
    const chip = (b, kind) => `<span class="sz-chip sz-chip-${kind}${b.gm ? ' sz-chip-gm' : ''}">${b.gm ? '<i data-lucide="dices"></i>' : ''}${szEsc(b.voter)}${b.gm ? ` · ${szEsc(szT('gm_short'))}` : ''}</span>`;
    // GM first: their pick is the one that decides what can actually run
    const byGm = (a, b) => (b.gm ? 1 : 0) - (a.gm ? 1 : 0);
    const upChips = szData.ballots.filter(b => b.up.includes(row.id)).sort(byGm).map(b => chip(b, 'up')).join('');
    const downChips = szData.ballots.filter(b => (b.down || []).includes(row.id)).sort(byGm).map(b => chip(b, 'down')).join('');
    const vetoChips = szData.ballots.filter(b => b.veto.includes(row.id)).sort(byGm).map(b => chip(b, 'veto')).join('');
    const tone = row.score > 0 ? 'pos' : row.score < 0 ? 'neg' : 'zero';
    return `
      <li class="sz-tally-row${lead ? ' sz-tally-lead' : ''}">
        <div class="sz-tally-main">
          ${lead ? '<i data-lucide="crown" class="sz-tally-crown"></i>' : ''}
          <span class="sz-tally-name">${szEsc(nameById[row.id] || row.id)}</span>
          ${out
            ? `<span class="sz-tally-score sz-score-neg">${szEsc(szT('veto_out'))}</span>`
            : `<span class="sz-tally-score sz-score-${tone}">${row.score > 0 ? '+' : row.score < 0 ? '\u2212' : ''}${Math.abs(row.score)}</span>`}
        </div>
        <div class="sz-tally-chips">${upChips}${downChips}${vetoChips}</div>
      </li>`;
  };
  const rows = active.map(r => rowHTML(r, false)).join('');
  const outRows = vetoed.map(r => rowHTML(r, true)).join('');

  if (!szResultsOpen()) {
    wrap.innerHTML = `
      <div class="sz-locked">
        <i data-lucide="lock"></i>
        <p>${szEsc(szVotedText('results_locked'))}</p>
        <button class="sz-btn sz-save" onclick="szSetTab('vote')">${szEsc(szT('go_vote'))}</button>
        <button type="button" class="sz-link-btn" onclick="szPeekResults()">${szEsc(szT('peek_results'))}</button>
      </div>`;
    if (typeof refreshIcons === 'function') refreshIcons();
    return;
  }
  const mode = szImageMode();
  const label = { share: 'share_short', copy: 'copy_image', download: 'save_short' }[mode];
  const icon = { share: 'share-2', copy: 'copy', download: 'download' }[mode];
  wrap.innerHTML = `
    <div class="sz-tally-head">
      <h2 class="sz-tally-title">${szEsc(szT('tally_title'))} <span class="sz-voted">${szEsc(szVotedText('voted_count'))}</span></h2>
      ${ranked.length ? `<div class="sz-share-actions">
        <button class="sz-btn sz-ghost sz-btn-sm sz-share-img" onclick="szShareResultsImage(this, '${mode}')"><i data-lucide="${icon}"></i><span>${szEsc(szT(label))}</span></button>
        ${mode === 'copy' ? `<button class="sz-btn sz-ghost sz-btn-sm sz-share-dl" onclick="szShareResultsImage(this, 'download')" title="${szEsc(szT('save_image'))}" aria-label="${szEsc(szT('save_image'))}"><i data-lucide="download"></i></button>` : ''}
      </div>` : ''}
    </div>
    ${ranked.length ? '' : `<p class="sz-empty">${szEsc(szT('no_votes_yet'))}</p>`}
    ${rows ? `<ol class="sz-tally-list">${rows}</ol>` : ''}
    ${outRows ? `<h3 class="sz-tally-subtitle"><i data-lucide="ban"></i>${szEsc(szT('vetoed_title'))}</h3>
      <ul class="sz-tally-list sz-tally-out">${outRows}</ul>` : ''}`;
  if (typeof refreshIcons === 'function') refreshIcons();
}

// ============================ results as an image ============================
// Drawn on a canvas at 1080×1350 — the 4:5 size Instagram/Telegram feeds show
// uncropped. The leader's cover comes through the wsrv.nl proxy, which sends
// CORS headers, so the canvas stays exportable; if it fails we draw without it.
function szCanShareFiles() {
  try {
    return !!(navigator.canShare && navigator.canShare({ files: [new File([''], 'x.png', { type: 'image/png' })] }));
  } catch (e) { return false; }
}

function szFitText(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
  return t + '…';
}

function szRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
}

function szLoadImage(url) {
  return new Promise(resolve => {
    if (!url) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
    setTimeout(() => resolve(null), 6000);
  });
}

function szDrawCover(ctx, img, x, y, w, h) {
  const s = Math.max(w / img.width, h / img.height);
  const sw = w / s, sh = h / s;
  ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
}

function szDrawCrown(ctx, x, base, color) {
  ctx.fillStyle = color; ctx.beginPath();
  ctx.moveTo(x, base); ctx.lineTo(x, base - 26); ctx.lineTo(x + 11, base - 12); ctx.lineTo(x + 20, base - 34);
  ctx.lineTo(x + 29, base - 12); ctx.lineTo(x + 40, base - 26); ctx.lineTo(x + 40, base); ctx.closePath(); ctx.fill();
}

async function szDrawResults() {
  const W = 1080, H = 1350, P = 72;
  const C = { bg: '#050505', card: '#121419', border: '#2a2d35', text: '#f1f5f9', dim: '#94a3b8',
              accent: '#38bdf8', green: '#4ade80', red: '#f87171', gold: '#facc15' };
  const names = {}, heroes = {};
  szData.list.forEach(id => { const r = szResolve(id); if (r) { names[id] = r.name; heroes[id] = r.hero; } });
  const { active, vetoed, top } = szRank();
  const ranked = active.concat(vetoed);
  const leaders = top === null ? [] : active.filter(r => r.score === top);
  const winner = leaders.length === 1 ? leaders[0] : null;
  const rest = ranked.filter(r => r !== winner);

  const [cover] = await Promise.all([
    winner && typeof imgProxy === 'function'
      ? szLoadImage(imgProxy(heroes[winner.id], { w: 1080, h: 540, fit: 'cover', q: 85 }).replace('output=webp', 'output=jpg'))
      : Promise.resolve(null),
    Promise.all(['900 64px Unbounded', '700 32px Unbounded', '600 28px Manrope', '800 28px Manrope']
      .map(f => document.fonts.load(f).catch(() => null))),
  ]);
  const head = 'Unbounded, system-ui, sans-serif', body = 'Manrope, system-ui, sans-serif';
  const nm = b => b.gm ? `${b.voter} (${szT('gm_short')})` : b.voter;
  const who = id => {
    const ups = szData.ballots.filter(b => b.up.includes(id)).map(nm);
    const downs = szData.ballots.filter(b => (b.down || []).includes(id)).map(nm);
    const vetoes = szData.ballots.filter(b => b.veto.includes(id)).map(nm);
    return [ups.join(', '),
      downs.length ? szT('img_down') + ': ' + downs.join(', ') : '',
      vetoes.length ? szT('img_veto') + ': ' + vetoes.join(', ') : ''].filter(Boolean).join(' · ');
  };
  const scoreText = s => (s > 0 ? '+' : s < 0 ? '−' : '') + Math.abs(s);

  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.8, 160, 0, W * 0.8, 160, 700);
  glow.addColorStop(0, 'rgba(56,189,248,0.16)'); glow.addColorStop(1, 'rgba(56,189,248,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

  // Brand + heading
  ctx.fillStyle = C.text; ctx.font = `900 28px ${head}`;
  ctx.fillText('SESSION ZERO', P, P + 22);
  ctx.fillStyle = C.accent; ctx.font = `700 24px ${head}`;
  ctx.fillText(szT('img_results').toUpperCase(), P, 190);
  ctx.fillStyle = C.text; ctx.font = `900 54px ${head}`;
  ctx.fillText(szFitText(ctx, szData.title || szT('room_default_title'), W - P * 2), P, 258);
  ctx.fillStyle = C.dim; ctx.font = `600 28px ${body}`;
  ctx.fillText(szVotedText('voted_count'), P, 304);

  let y = 350;
  // Winner: big card, with the game's cover when it loaded
  if (winner) {
    const h = 400, w = W - P * 2;
    ctx.save();
    szRoundRect(ctx, P, y, w, h, 28); ctx.clip();
    ctx.fillStyle = C.card; ctx.fillRect(P, y, w, h);
    if (cover) {
      szDrawCover(ctx, cover, P, y, w, h);
      const shade = ctx.createLinearGradient(0, y, 0, y + h);
      shade.addColorStop(0, 'rgba(5,5,5,0.15)'); shade.addColorStop(0.45, 'rgba(5,5,5,0.35)'); shade.addColorStop(1, 'rgba(5,5,5,0.92)');
      ctx.fillStyle = shade; ctx.fillRect(P, y, w, h);
    }
    ctx.restore();
    szRoundRect(ctx, P, y, w, h, 28);
    ctx.lineWidth = 4; ctx.strokeStyle = C.green; ctx.stroke();

    szDrawCrown(ctx, P + 36, y + h - 150, C.gold);
    ctx.fillStyle = C.gold; ctx.font = `700 24px ${head}`;
    ctx.fillText(szT('img_winner').toUpperCase(), P + 92, y + h - 152);
    ctx.font = `900 56px ${head}`;
    const st = scoreText(winner.score), sw = ctx.measureText(st).width;
    ctx.fillStyle = C.green; ctx.fillText(st, P + w - 36 - sw, y + h - 78);
    ctx.fillStyle = C.text;
    ctx.fillText(szFitText(ctx, names[winner.id] || winner.id, w - 72 - sw - 30), P + 36, y + h - 78);
    ctx.fillStyle = '#cbd5e1'; ctx.font = `600 26px ${body}`;
    ctx.fillText(szFitText(ctx, who(winner.id), w - 72), P + 36, y + h - 32);
    y += h + 24;
  }

  // The rest (or every leader when it's a tie)
  const maxY = H - P - 120;  // keep clear of the footer
  let shown = 0;
  for (const row of rest) {
    const h = 104, w = W - P * 2;
    if (y + h > maxY) break;
    shown++;
    const out = row.veto > 0;
    const tie = !winner && !out && row.score === top;
    szRoundRect(ctx, P, y, w, h, 20);
    ctx.fillStyle = tie ? 'rgba(74,222,128,0.10)' : C.card; ctx.fill();
    ctx.lineWidth = tie ? 3 : 2; ctx.strokeStyle = tie ? C.green : C.border; ctx.stroke();
    let x = P + 32;
    const mid = y + 46;  // name baseline; with the voters line below, the block sits centred
    ctx.fillStyle = C.dim; ctx.font = `800 26px ${body}`;
    ctx.fillText(out ? '\u2715' : String(ranked.indexOf(row) + 1), x, mid);
    x += 44;
    if (tie) { szDrawCrown(ctx, x, mid, C.gold); x += 56; }
    ctx.font = `700 32px ${head}`;
    const st = out ? szT('veto_out').toUpperCase() : scoreText(row.score), sw = ctx.measureText(st).width;
    ctx.fillStyle = out || row.score < 0 ? C.red : row.score > 0 ? C.green : C.dim;
    ctx.fillText(st, W - P - 32 - sw, y + h / 2 + 12);  // centred in the row, not on the name line
    ctx.fillStyle = C.text;
    ctx.fillText(szFitText(ctx, names[row.id] || row.id, W - P - 32 - sw - 24 - x), x, mid);
    ctx.fillStyle = C.dim; ctx.font = `600 22px ${body}`;
    ctx.fillText(szFitText(ctx, who(row.id), w - 108), P + 76, y + h - 26);
    y += h + 14;
  }
  const more = ranked.length - (winner ? 1 : 0) - shown;
  if (more > 0) {
    ctx.fillStyle = C.dim; ctx.font = `600 24px ${body}`;
    ctx.fillText(szT('img_more', { n: more }), P + 32, y + 22);
  }

  // Footer
  ctx.fillStyle = C.dim; ctx.font = `600 26px ${body}`;
  ctx.fillText(szT('img_footer'), P, H - P - 42);
  ctx.fillStyle = C.accent; ctx.font = `700 30px ${head}`;
  ctx.fillText('sessionzero.games', P, H - P);
  return canvas;
}

// Phones get the native share sheet; desktops copy the image to the
// clipboard (paste straight into a chat); download is the last resort.
function szImageMode() {
  const touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (touch && szCanShareFiles()) return 'share';
  if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) return 'copy';
  return szCanShareFiles() ? 'share' : 'download';
}

async function szShareResultsImage(btn, mode) {
  if (!szData) return;
  mode = mode || szImageMode();
  if (btn) btn.disabled = true;
  try {
    // Clipboard writes must start inside the click, so hand it a promise of the blob.
    const blobP = szDrawResults().then(c => new Promise(res => c.toBlob(res, 'image/png')));
    if (typeof track === 'function') track('room-share-image-' + mode);
    if (mode === 'copy') {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blobP })]);
        if (typeof showToast === 'function') showToast(szT('image_copied'));
        return;
      } catch (e) { /* fall through to download */ }
    }
    const blob = await blobP;
    if (!blob) return;
    const file = new File([blob], 'session-zero-results.png', { type: 'image/png' });
    if (mode === 'share') {
      try {
        await navigator.share({ files: [file], title: szData.title || szT('room_default_title'), text: szRoomUrl(szRoomId) });
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return;  // user closed the share sheet
      }
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = file.name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  } finally {
    if (btn) btn.disabled = false;
  }
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
  return SZ_API ? (SZ_API + '/l/' + ids.join(',') + '?l=' + szShareLang()) : (location.origin + location.pathname + '#list=' + ids.join(','));
}
function szCopyListLink() {
  const all = szListIds || [...szGetPick()];
  const ids = all.filter(id => typeof SYSTEMS_DATA !== 'undefined' && SYSTEMS_DATA[id]);
  if (ids.length < all.length && typeof showToast === 'function') showToast(szT('list_custom_skipped'));
  if (!ids.length) return;
  const url = szListUrl(ids);
  const done = () => { if (typeof showToast === 'function') showToast(szT('copy_list_done')); };
  if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, () => prompt(szT('copy'), url));
  else prompt(szT('copy'), url);
}

// ============================ link / lang / exit ============================
// Shared URLs point at the server's OG routes (so links unfurl with previews),
// which redirect into the SPA. The sharer's language is baked in (?l=) so the
// preview card matches the channel's language — crawlers don't forward locale.
// Without an API, fall back to direct hash links.
function szShareLang() {
  return (typeof currentLang !== 'undefined' && currentLang === 'ru') ? 'ru' : 'en';
}
function szRoomUrl(id) {
  return SZ_API ? (SZ_API + '/r/' + id + '?l=' + szShareLang()) : (location.origin + location.pathname + '#room=' + id);
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
  if (szView === 'room' && szDirty && !confirm(szT('leave_unsaved'))) return;
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

// ---- inline system picker (edit the shared list right in the panel) ----
// All official systems, grouped exactly like the catalog (localized via t()).
function szPickGroups() {
  const groups = (typeof getNavGroups === 'function') ? getNavGroups(typeof currentGrouping !== 'undefined' ? currentGrouping : 'default') : [];
  const mine = (typeof CustomSystems !== 'undefined') ? CustomSystems.all.map(s => s.id) : [];
  return mine.length ? groups.concat([{ key: 'nav_group_custom', ids: mine }]) : groups;
}
function szAllPickIds() {
  const ids = [];
  szPickGroups().forEach(g => g.ids.forEach(id => { if (szPickable(id)) ids.push(id); }));
  return ids;
}
// The share selection doubles as the catalog's shortlist: "+" on cards, the
// shortlist bar and this panel all edit the same set. Persisted across reloads.
// It starts empty — the GM builds it — so an untouched catalog never shares
// all 100+ games by accident.
function szLoadPick() {
  try {
    const raw = JSON.parse(localStorage.getItem('sz-shortlist') || 'null');
    if (Array.isArray(raw)) return new Set(raw.filter(szPickable));
    // Migrate the old picker selection, unless it was just the old "all on" default.
    const old = JSON.parse(localStorage.getItem('sz-picker-selection') || 'null');
    if (Array.isArray(old)) {
      const f = old.filter(id => SYSTEMS_DATA[id]);
      if (f.length && f.length < szAllPickIds().length) return new Set(f);
    }
  } catch (e) {}
  return new Set();
}
function szGetPick() {
  if (szPick === null) szPick = szLoadPick();
  return szPick;
}
// Persist, then let the catalog refresh its "+" buttons and shortlist bar.
function szSavePick() {
  try { localStorage.setItem('sz-shortlist', JSON.stringify([...szPick])); } catch (e) {}
  if (typeof updateShortlistUI === 'function') updateShortlistUI();
}
function szAddPicks(ids) {
  const pick = szGetPick();
  ids.forEach(id => { if (szPickable(id)) pick.add(id); });
  szSavePick();
}
// Selection count label — handles EN singular without declension headaches.
function szCountLabel(n) {
  if (typeof currentLang !== 'undefined' && currentLang === 'ru') return 'Выбрано: ' + n;
  return n === 1 ? '1 system selected' : n + ' systems selected';
}

function szPickerHTML() {
  return szPickGroups().map((g, idx) => {
    const items = g.ids.filter(szPickable);
    if (!items.length) return '';
    const title = (typeof t === 'function') ? t(g.key) : g.key;
    const rows = items.map(id => {
      const name = (SYSTEMS_DATA[id] && SYSTEMS_DATA[id].name) ||
        (szLocalCustom(id) && szLocalCustom(id).name) ||
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
  const pick = szGetPick();
  if (on) pick.add(id); else pick.delete(id);
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
  g.ids.filter(szPickable).forEach(id => { if (on) szPick.add(id); else szPick.delete(id); });
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
  const hint = document.querySelector('#sz-room .sz-pick-empty');
  if (hint) hint.hidden = szPick.size > 0;
  const c = document.getElementById('sz-pick-count');
  if (c) c.textContent = szCountLabel(szPick.size);
  const disabled = szPick.size === 0;
  document.querySelectorAll('#sz-room .sz-pick-action').forEach(b => { b.disabled = disabled; });
  document.querySelectorAll('#sz-room .sz-pick-n').forEach(s => { s.textContent = ' (' + szPick.size + ')'; });
  szSyncGroupChecks();
}

// `presetIds` (optional array) replaces the selection — used by the results
// "Share" button to hand over the currently filtered systems.
function szOpenCreate(presetIds) {
  szView = 'create';
  const el = szEnsureOverlay();
  if (Array.isArray(presetIds)) {
    szPick = new Set(presetIds.filter(szPickable));
    szSavePick();
  } else szGetPick(); // restore the shortlist (empty on first visit)
  const myRooms = szMyRooms();
  const empty = szPick.size === 0;

  // Inline picker — collapsed by default into a summary so the share actions stay
  // above the fold; expand to curate. Native <details> = free a11y + keyboard.
  const picker = `
    <details class="sz-share-block sz-pick-details"${empty ? ' open' : ''}>
      <summary class="sz-pick-summary">
        <span class="sz-count" id="sz-pick-count">${szEsc(szCountLabel(szPick.size))}</span>
        <span class="sz-pick-toggle">${szEsc(szT('edit_list'))} <i data-lucide="chevron-down"></i></span>
      </summary>
      <p class="sz-hint sz-pick-empty"${empty ? '' : ' hidden'}>${szEsc(szT('pick_empty_hint'))}</p>
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
      <div class="sz-room-opts">
        <label class="sz-opt">
          <span><strong>${szEsc(szT('opt_expected'))}</strong> ${szEsc(szT('opt_expected_hint'))}</span>
          <input id="sz-room-expected" class="sz-name-input sz-opt-count" type="number" min="1" max="50" inputmode="numeric">
        </label>
        <label class="sz-opt">
          <span><strong>${szEsc(szT('opt_veto'))}</strong> ${szEsc(szT('opt_veto_hint'))}</span>
          <input id="sz-room-veto" type="checkbox" checked>
        </label>
      </div>
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
  const picked = [...szGetPick()];
  if (!picked.length) return;
  const custom = {};
  const list = picked.map(id => {
    const c = szLocalCustom(id);
    if (!c || (typeof SYSTEMS_DATA !== 'undefined' && SYSTEMS_DATA[id])) return id;
    const rid = szRoomCustomId(id);
    custom[rid] = { name: c.name, tagline: c.tagline || '', image: c.image || '' };
    return rid;
  });
  const expected = parseInt((document.getElementById('sz-room-expected') || {}).value, 10) || null;
  const noVeto = !(document.getElementById('sz-room-veto') || { checked: true }).checked;
  try {
    const { roomId } = await szApi('/room', { method: 'POST', body: JSON.stringify({ title, list, custom, expected, noVeto }) });
    if (typeof track === 'function') track('room-create');
    szRememberRoom(roomId, title, true);
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
  if (typeof updateShortlistUI === 'function') updateShortlistUI();
  szRoute();
}
window.addEventListener('hashchange', szRoute);

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', szInit);
else szInit();
