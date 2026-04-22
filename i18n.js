// ============ INTERNATIONALIZATION ============
const LANG = {
  ru: {
    setup_title: 'Session Zero',
    setup_subtitle: 'Настройте группу перед началом. Каждый игрок голосует за системы, в которые хочет сыграть — инструмент для вашего цифрового Session Zero.',
    setup_players_label: 'Количество игроков',
    setup_names_label: 'Имена',
    setup_start: 'Начать',
    setup_skip: 'Просто посмотреть без голосования',
    setup_faq_title: 'Как это работает?',
    setup_faq_1: 'Пролистайте карточки систем и узнайте о каждой',
    setup_faq_2: 'Каждый игрок голосует за понравившиеся системы',
    setup_faq_3: 'На странице результатов видно что набрало больше голосов',
    setup_faq_4: 'Или просто просмотрите каталог без голосования',
    nav_title: 'SESSION ZERO',
    nav_subtitle: 'Помогите группе выбрать следующую игру',
    aria_open_menu: 'Открыть меню',
    aria_close_menu: 'Закрыть меню',
    aria_prev_system: 'Предыдущая система',
    aria_next_system: 'Следующая система',
    aria_view_cards: 'Вид карточками',
    aria_view_list: 'Вид списком',
    aria_move_up: 'Переместить выше',
    aria_move_down: 'Переместить ниже',
    aria_defer: 'Отложить на потом',
    nav_group_osr: 'The Odd & OSR',
    nav_group_fl: 'Free League (YZE)',
    nav_group_narrative: 'Narrative & Surreal',
    nav_group_tactical: 'Tactical & Modern',
    nav_group_borg: '*BORG',
    nav_group_resistance: 'Resistance (RRD)',
    'nav_group_into-the-odd': 'Семейство Into the Odd',
    'nav_group_year-zero': 'Year Zero Engine',
    'nav_group_osr-classic': 'Классический OSR',
    'nav_group_pbta-fitd': 'PbtA / FitD',
    nav_group_standalone: 'Отдельные системы',
    'nav_group_dark-fantasy': 'Тёмное фэнтези',
    'nav_group_sci-fi': 'Научная фантастика',
    nav_group_horror: 'Хоррор и оккультизм',
    'nav_group_narrative-weird': 'Нарратив и Weird',
    nav_group_adventure: 'Приключения',
    'nav_group_solo-adventure': 'Соло и кооп',
    'nav_group_solo-journaling': 'Журналинг',
    'nav_group_solo-compatible': 'Поддержка соло',
    grouping_default: 'Стандарт',
    grouping_family: 'По движку',
    grouping_genre: 'По жанру',
    grouping_solo: 'Соло',
    btn_results: 'РЕЗУЛЬТАТЫ ГОЛОСОВАНИЯ',
    btn_catalog: 'КАТАЛОГ СИСТЕМ',
    btn_presentation: 'Режим презентации',
    btn_reset: 'Сбросить игроков и голоса',
    btn_setup_players: 'Настроить игроков и голосование',
    btn_lang: 'EN / RU',
    pres_menu: 'Меню',
    section_system: 'Что это за система',
    section_setting: 'Сеттинг',
    section_vignette: 'Как это выглядит за столом',
    section_playstyle: 'Плейстайл',
    section_mechanics: 'Особенности механики',
    section_reviews: 'Что говорят на Reddit',
    section_gallery: 'Арт и материалы',
    section_resources: 'Бесплатные материалы',
    qs_dice: 'Кубики',
    qs_players: 'Игроки',
    qs_prep: 'Преп',
    qs_foundry: 'Foundry VTT',
    qs_complexity: 'Сложность',
    results_title_browse: 'Обзор систем',
    results_title_vote: 'Результаты голосования',
    results_subtitle_browse: 'Нажми на карточку, чтобы узнать больше о системе.',
    results_subtitle_vote: 'Системы отсортированы по голосам. Нажми на карточку для подробностей.',
    vote_title: 'Хочу сыграть!',
    veto_title: 'Против',
    nav_search: 'Поиск...',
    status_play_now: 'Сыграем!',
    status_play_later: 'Сыграем позже',
    btn_export: 'Экспорт',
    export_title: 'Экспорт списка',
    export_header: 'Session Zero Shortlist',
    btn_copy: 'Копировать',
    btn_close: 'Закрыть',
    copied: 'Скопировано!',
    move_up: 'Выше',
    move_down: 'Ниже',
    tag_filter_title: 'Фильтр',
    tag_filter_all: 'Все',
    player_placeholder: 'Имя игрока',
    res_sheet: 'Лист',
    res_quickstart: 'Quickstart',
    res_rules: 'Правила',
    res_map: 'Карта',
    res_tool: 'Инструмент',
    res_link: 'Сайт',
    setup_players_2: '2 игрока',
    setup_players_3: '3 игрока',
    setup_players_4: '4 игрока',
    setup_players_5: '5 игроков',
    setup_players_6: '6 игроков',
    setup_players_7: '7 игроков',
    setup_players_8: '8 игроков',
    btn_add_system: 'Добавить систему',
    editor_title: 'Новая система',
    editor_title_edit: 'Редактировать систему',
    editor_name: 'Название',
    editor_publisher: 'Издатель',
    editor_tagline: 'Тэглайн',
    editor_description: 'Описание',
    editor_setting: 'Сеттинг',
    editor_vignette: 'Пример за столом',
    editor_dice: 'Кубики',
    editor_players: 'Игроки',
    editor_prep: 'Время на преп',
    editor_complexity: 'Сложность',
    editor_image: 'URL изображения',
    editor_tags: 'Плейстайл',
    editor_save: 'Сохранить',
    editor_cancel: 'Отмена',
    editor_delete: 'Удалить',
    editor_submit: 'Предложить в каталог',
    editor_submit_sending: 'Отправка…',
    editor_submit_ok: 'Отправлено!',
    editor_submit_fail: 'Ошибка отправки',
    nav_group_custom: 'Мои системы',
    tag_exploration: 'Исследование',
    tag_combat: 'Боёвка',
    tag_narrative: 'Нарратив',
    tag_horror: 'Хоррор',
    tag_social: 'Социалка',
    tag_mystery: 'Детектив',
    tag_survival: 'Выживание',
    tag_tactical: 'Тактика',
    tag_sandbox: 'Песочница',
    tag_action: 'Экшн',
    tag_worldbuilding: 'Мироздание',
    tag_solo: 'Соло',
    tag_space: 'Космос',
    tag_fantasy: 'Фэнтези',
    tag_cyberpunk: 'Киберпанк',
    tag_modern: 'Современность',
    tag_postapoc: 'Постапок',
    tag_historical: 'История',
    tag_weird: 'Странное',
    tag_urban_fantasy: 'Городское фэнтези',
    editor_setting_tags: 'Сеттинг',
    tag_filter_playstyle: 'Плейстайл',
    tag_filter_setting: 'Сеттинг',
    sys_selector_filter_by_tags: 'Фильтр по тегам',
    sys_selector_filter_active: 'фильтров',
    btn_manage_systems: 'Управление списком',
    sys_selector_title: 'Управление списком',
    sys_selector_desc: 'Отметьте системы, которые хотите показать. Скрытые системы не отображаются в навигации и результатах.',
    sys_selector_all: 'Выбрать все',
    sys_selector_none: 'Снять все',
    sys_selector_save: 'Применить',
    sys_selector_cancel: 'Отмена',
  },
  en: {
    setup_title: 'Session Zero',
    setup_subtitle: 'Set up your group before starting. Each player votes for systems they want to try — a digital Session Zero for your table.',
    setup_players_label: 'Number of players',
    setup_names_label: 'Names',
    setup_start: 'Start',
    setup_skip: 'Just browse without voting',
    setup_faq_title: 'How does this work?',
    setup_faq_1: 'Browse system cards and learn about each one',
    setup_faq_2: 'Each player votes for systems they want to try',
    setup_faq_3: 'Results page shows which systems got the most votes',
    setup_faq_4: 'Or just browse the catalog without voting',
    nav_title: 'SESSION ZERO',
    nav_subtitle: 'Help your group pick your next game',
    aria_open_menu: 'Open menu',
    aria_close_menu: 'Close menu',
    aria_prev_system: 'Previous system',
    aria_next_system: 'Next system',
    aria_view_cards: 'Card view',
    aria_view_list: 'List view',
    aria_move_up: 'Move up',
    aria_move_down: 'Move down',
    aria_defer: 'Play later',
    nav_group_osr: 'The Odd & OSR',
    nav_group_fl: 'Free League (YZE)',
    nav_group_narrative: 'Narrative & Surreal',
    nav_group_tactical: 'Tactical & Modern',
    nav_group_borg: '*BORG',
    nav_group_resistance: 'Resistance (RRD)',
    'nav_group_into-the-odd': 'Into the Odd Family',
    'nav_group_year-zero': 'Year Zero Engine',
    'nav_group_osr-classic': 'Classic OSR',
    'nav_group_pbta-fitd': 'PbtA / FitD',
    nav_group_standalone: 'Standalone',
    'nav_group_dark-fantasy': 'Dark Fantasy',
    'nav_group_sci-fi': 'Sci-Fi',
    nav_group_horror: 'Horror & Occult',
    'nav_group_narrative-weird': 'Narrative & Weird',
    nav_group_adventure: 'Adventure',
    'nav_group_solo-adventure': 'Solo & Co-op',
    'nav_group_solo-journaling': 'Journaling',
    'nav_group_solo-compatible': 'Solo-Compatible',
    grouping_default: 'Default',
    grouping_family: 'By Engine',
    grouping_genre: 'By Genre',
    grouping_solo: 'Solo',
    btn_results: 'VOTING RESULTS',
    btn_catalog: 'SYSTEM CATALOG',
    btn_presentation: 'Presentation mode',
    btn_reset: 'Reset players & votes',
    btn_setup_players: 'Set up players & voting',
    btn_lang: 'EN / RU',
    pres_menu: 'Menu',
    section_system: 'What is this system',
    section_setting: 'Setting',
    section_vignette: 'What it looks like at the table',
    section_playstyle: 'Playstyle',
    section_mechanics: 'Key mechanics',
    section_reviews: 'What people say',
    section_gallery: 'Art & materials',
    section_resources: 'Free resources',
    qs_dice: 'Dice',
    qs_players: 'Players',
    qs_prep: 'Prep',
    qs_foundry: 'Foundry VTT',
    qs_complexity: 'Complexity',
    results_title_browse: 'System Catalog',
    results_title_vote: 'Voting Results',
    results_subtitle_browse: 'Click a card to learn more about the system.',
    results_subtitle_vote: 'Systems sorted by votes. Click a card for details.',
    vote_title: 'I want to play this!',
    veto_title: 'Against',
    nav_search: 'Search...',
    status_play_now: 'Playing!',
    status_play_later: 'Play later',
    btn_export: 'Export',
    export_title: 'Export List',
    export_header: 'Session Zero Shortlist',
    btn_copy: 'Copy',
    btn_close: 'Close',
    copied: 'Copied!',
    move_up: 'Move up',
    move_down: 'Move down',
    tag_filter_title: 'Filter',
    tag_filter_all: 'All',
    player_placeholder: 'Player name',
    res_sheet: 'Sheet',
    res_quickstart: 'Quickstart',
    res_rules: 'Rules',
    res_map: 'Map',
    res_tool: 'Tool',
    res_link: 'Website',
    setup_players_2: '2 players',
    setup_players_3: '3 players',
    setup_players_4: '4 players',
    setup_players_5: '5 players',
    setup_players_6: '6 players',
    setup_players_7: '7 players',
    setup_players_8: '8 players',
    btn_add_system: 'Add System',
    editor_title: 'New System',
    editor_title_edit: 'Edit System',
    editor_name: 'Name',
    editor_publisher: 'Publisher',
    editor_tagline: 'Tagline',
    editor_description: 'Description',
    editor_setting: 'Setting',
    editor_vignette: 'Table Example',
    editor_dice: 'Dice',
    editor_players: 'Players',
    editor_prep: 'Prep Time',
    editor_complexity: 'Complexity',
    editor_image: 'Image URL',
    editor_tags: 'Playstyle',
    editor_save: 'Save',
    editor_cancel: 'Cancel',
    editor_delete: 'Delete',
    editor_submit: 'Suggest for catalog',
    editor_submit_sending: 'Sending…',
    editor_submit_ok: 'Sent!',
    editor_submit_fail: 'Failed to send',
    nav_group_custom: 'My Systems',
    tag_exploration: 'Exploration',
    tag_combat: 'Combat',
    tag_narrative: 'Narrative',
    tag_horror: 'Horror',
    tag_social: 'Social',
    tag_mystery: 'Mystery',
    tag_survival: 'Survival',
    tag_tactical: 'Tactical',
    tag_sandbox: 'Sandbox',
    tag_action: 'Action',
    tag_worldbuilding: 'Worldbuilding',
    tag_solo: 'Solo',
    tag_space: 'Space',
    tag_fantasy: 'Fantasy',
    tag_cyberpunk: 'Cyberpunk',
    tag_modern: 'Modern',
    tag_postapoc: 'Post-Apoc',
    tag_historical: 'Historical',
    tag_weird: 'Weird',
    tag_urban_fantasy: 'Urban Fantasy',
    editor_setting_tags: 'Setting',
    tag_filter_playstyle: 'Playstyle',
    tag_filter_setting: 'Setting',
    sys_selector_filter_by_tags: 'Filter by tags',
    sys_selector_filter_active: 'filters',
    btn_manage_systems: 'Manage Systems',
    sys_selector_title: 'Manage Systems',
    sys_selector_desc: 'Check the systems you want to show. Hidden systems won\'t appear in navigation or results.',
    sys_selector_all: 'Select all',
    sys_selector_none: 'Deselect all',
    sys_selector_save: 'Apply',
    sys_selector_cancel: 'Cancel',
  }
};

let currentLang = localStorage.getItem('ttrpg-lang') || ((navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en');

function t(key) {
    return (LANG[currentLang] && LANG[currentLang][key]) || (LANG['ru'] && LANG['ru'][key]) || key;
}

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('ttrpg-lang', lang);
    applyLang();
}

function translateI18nElements(root) {
    (root || document).querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = t(key);
        if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) return;
        if (el.tagName === 'OPTION') { el.textContent = val; return; }
        if (!el.querySelector('*')) { el.textContent = val; return; }
        // Preserve child elements (like <i> icons) — only update text nodes
        for (let node of el.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                node.textContent = ' ' + val;
                return;
            }
        }
        const nodes = Array.from(el.childNodes);
        for (let i = nodes.length - 1; i >= 0; i--) {
            if (nodes[i].nodeType === Node.TEXT_NODE) {
                nodes[i].textContent = ' ' + val;
                return;
            }
        }
    });
    (root || document).querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    (root || document).querySelectorAll('[data-i18n-aria]').forEach(el => {
        el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
}

function applyLang() {
    // Highlight active lang buttons
    document.querySelectorAll('.setup-lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.id.endsWith(`-${currentLang}`));
    });
    translateI18nElements();

    // Update setup player count dropdown options
    const setupCount = document.getElementById('setup-count');
    if (setupCount) {
        setupCount.querySelectorAll('option').forEach(opt => {
            const key = 'setup_players_' + opt.value;
            opt.textContent = t(key);
        });
    }

    // Update dynamically generated content
    if (typeof updateSetupFields === 'function' && document.getElementById('setup-players')) {
        // Only re-render setup fields if setup overlay is visible
        const overlay = document.getElementById('setup-overlay');
        if (overlay && !overlay.classList.contains('hidden')) {
            updateSetupFields();
        }
    }

    // Update RES_LABELS to use current language
    if (typeof RES_LABELS !== 'undefined') {
        RES_LABELS.link = t('res_link');
        RES_LABELS.sheet = t('res_sheet');
        RES_LABELS.quickstart = t('res_quickstart');
        RES_LABELS.rules = t('res_rules');
        RES_LABELS.map = t('res_map');
        RES_LABELS.tool = t('res_tool');
    }

    // Notify app.js to re-render with new language
    document.dispatchEvent(new Event('langchange'));
}
