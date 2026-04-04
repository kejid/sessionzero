// ============ INTERNATIONALIZATION ============
const LANG = {
  ru: {
    setup_title: 'TTRPG Showcase',
    setup_subtitle: 'Настрой группу перед началом. Каждый игрок сможет голосовать за системы, которые хочет попробовать.',
    setup_players_label: 'Количество игроков',
    setup_names_label: 'Имена',
    setup_start: 'Начать',
    setup_skip: 'Просто посмотреть без голосования',
    setup_faq_title: 'Как это работает?',
    setup_faq_1: 'Пролистайте карточки систем и узнайте о каждой',
    setup_faq_2: 'Каждый игрок голосует за понравившиеся системы',
    setup_faq_3: 'На странице результатов видно что набрало больше голосов',
    setup_faq_4: 'Или просто просмотрите каталог без голосования',
    nav_title: 'TTRPG SHOWCASE',
    nav_subtitle: 'Голосуй за системы, в которые хочешь сыграть',
    nav_group_osr: 'The Odd & OSR',
    nav_group_fl: 'Free League (YZE)',
    nav_group_narrative: 'Narrative & Surreal',
    nav_group_tactical: 'Tactical & Modern',
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
    btn_manage_systems: 'Управление списком',
    sys_selector_title: 'Управление списком',
    sys_selector_desc: 'Отметьте системы, которые хотите показать. Скрытые системы не отображаются в навигации и результатах.',
    sys_selector_all: 'Выбрать все',
    sys_selector_none: 'Снять все',
    sys_selector_save: 'Применить',
    sys_selector_cancel: 'Отмена',
  },
  en: {
    setup_title: 'TTRPG Showcase',
    setup_subtitle: 'Set up your group before starting. Each player will be able to vote for systems they want to try.',
    setup_players_label: 'Number of players',
    setup_names_label: 'Names',
    setup_start: 'Start',
    setup_skip: 'Just browse without voting',
    setup_faq_title: 'How does this work?',
    setup_faq_1: 'Browse system cards and learn about each one',
    setup_faq_2: 'Each player votes for systems they want to try',
    setup_faq_3: 'Results page shows which systems got the most votes',
    setup_faq_4: 'Or just browse the catalog without voting',
    nav_title: 'TTRPG SHOWCASE',
    nav_subtitle: 'Vote for systems you want to play',
    nav_group_osr: 'The Odd & OSR',
    nav_group_fl: 'Free League (YZE)',
    nav_group_narrative: 'Narrative & Surreal',
    nav_group_tactical: 'Tactical & Modern',
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
    btn_manage_systems: 'Manage Systems',
    sys_selector_title: 'Manage Systems',
    sys_selector_desc: 'Check the systems you want to show. Hidden systems won\'t appear in navigation or results.',
    sys_selector_all: 'Select all',
    sys_selector_none: 'Deselect all',
    sys_selector_save: 'Apply',
    sys_selector_cancel: 'Cancel',
  }
};

let currentLang = localStorage.getItem('ttrpg-lang') || 'en';

function t(key) {
    return (LANG[currentLang] && LANG[currentLang][key]) || (LANG['ru'] && LANG['ru'][key]) || key;
}

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('ttrpg-lang', lang);
    applyLang();
}

function applyLang() {
    // Highlight active lang buttons
    document.querySelectorAll('.setup-lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.id.endsWith(`-${currentLang}`));
    });
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = t(key);
        if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
            // Don't change text content for inputs, they use placeholder
        } else if (el.tagName === 'OPTION') {
            el.textContent = val;
        } else {
            // Preserve child elements (like <i> icons) — only update text nodes
            // If element has only text, set textContent directly
            const hasChildElements = el.querySelector('*');
            if (!hasChildElements) {
                el.textContent = val;
            } else {
                // Find the text node and update it, preserving child elements
                // Strategy: update the last text node or append one
                let found = false;
                for (let node of el.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                        node.textContent = ' ' + val;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    // Look for text after icon elements
                    const nodes = Array.from(el.childNodes);
                    for (let i = nodes.length - 1; i >= 0; i--) {
                        if (nodes[i].nodeType === Node.TEXT_NODE) {
                            nodes[i].textContent = ' ' + val;
                            found = true;
                            break;
                        }
                    }
                }
            }
        }
    });

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

    // Re-render dynamic sections that use t()
    if (typeof renderResults === 'function') {
        const resultsPage = document.getElementById('results');
        if (resultsPage) renderResults();
    }

    // Re-render galleries and resources (they use t() for section titles)
    // Remove existing dynamically-added gallery/resource titles and sections, then re-render
    document.querySelectorAll('.gallery-section-title, .resources-section-title').forEach(el => {
        el.remove();
    });

    // Update RES_LABELS to use current language
    if (typeof RES_LABELS !== 'undefined') {
        RES_LABELS.link = t('res_link');
        RES_LABELS.sheet = t('res_sheet');
        RES_LABELS.quickstart = t('res_quickstart');
        RES_LABELS.rules = t('res_rules');
        RES_LABELS.map = t('res_map');
        RES_LABELS.tool = t('res_tool');
    }

    // Re-render resources and galleries (remove and re-add)
    document.querySelectorAll('.resources-section').forEach(el => {
        // Remove the section-title before it too
        const prev = el.previousElementSibling;
        if (prev && prev.classList.contains('section-title')) prev.remove();
        el.remove();
    });
    document.querySelectorAll('.gallery').forEach(el => {
        const prev = el.previousElementSibling;
        if (prev && prev.classList.contains('section-title')) prev.remove();
        el.remove();
    });
    // Re-render system pages with localized content
    if (typeof renderAllSystems === 'function' && typeof SYSTEMS_DATA !== 'undefined' && Object.keys(SYSTEMS_DATA).length > 0) {
        // Save current active page
        const activePage = document.querySelector('.system-page.active');
        const activeId = activePage ? activePage.id : null;

        renderAllSystems();
        if (typeof renderGalleries === 'function') renderGalleries();
        if (typeof renderResources === 'function') renderResources();

        // Re-translate data-i18n elements created by renderAllSystems
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = t(key);
            const hasChild = el.querySelector('*');
            if (!hasChild) {
                el.textContent = val;
            } else {
                for (let node of el.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                        node.textContent = ' ' + val;
                        break;
                    }
                }
            }
        });

        // Re-render vote buttons if players exist
        if (typeof PLAYERS !== 'undefined' && PLAYERS && typeof renderVoteButtons === 'function') {
            document.querySelectorAll('.vote-section').forEach(section => {
                renderVoteButtons(section.dataset.system);
            });
        }

        // Restore active page
        if (activeId) {
            const restored = document.getElementById(activeId);
            if (restored) restored.classList.add('active');
        }

        // Re-apply system visibility
        if (typeof applySystemVisibility === 'function') applySystemVisibility();
    }

    if (typeof refreshIcons === 'function') refreshIcons();
    else lucide.createIcons();
}
