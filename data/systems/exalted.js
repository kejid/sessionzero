registerSystem("exalted", {
  "groups": {
    "default": { "key": "narrative", "order": 74 },
    "family": { "key": "standalone", "order": 81 },
    "genre": { "key": "adventure", "order": 43 }
  },
  "name": "Exalted",
  "publisher": "Onyx Path Publishing",
  "dice": "d10 pool (7+, 10s count double)",
  "players": "3–5",
  "complexity": 4,
  "free": false,
  "edition": "3rd Edition",
  "foundryStatus": "Community",
  "heroImage": "https://sessionzero.games/images/heroes/exalted.jpg",
  "playstyleTags": ["combat", "narrative", "social"],
  "settingTags": ["fantasy"],
  "gallery": [
    { "src": "https://sessionzero.games/images/systems/exalted-g1.jpg" },
    { "src": "https://sessionzero.games/images/systems/exalted-g2.jpg" },
    { "src": "https://sessionzero.games/images/systems/exalted-g3.jpg" },
    { "src": "https://sessionzero.games/images/systems/exalted-g4.jpg" }
  ],
  "resources": [
    { "type": "link", "url": "https://theonyxpath.com/category/worlds/exalted/", "fmt": "Web" },
    { "type": "sheet", "url": "https://theonyxpath.com/sheets/Exalted3rdED_2-Page_NoBackground_Interactive.pdf", "fmt": "PDF" },
    { "type": "sheet", "url": "https://theonyxpath.com/sheets/Exalted_Essence_Character_Sheet_Interactive.pdf", "fmt": "PDF" },
    { "type": "link", "url": "https://foundryvtt.com/packages/exaltedthird", "fmt": "Foundry" }
  ],
  "mechanics": [
    { "icon": "sun" },
    { "icon": "swords" },
    { "icon": "sparkles" },
    { "icon": "book-open" }
  ],
  "quotes": [
    // VERIFIED-AT: https://www.geeknative.com/55612/great-game-read-review-exalted-third-edition/
    {
      "text": "EX3 is one of the best role-playing corebooks I’ve ever read, and it’s an easy recommend for anyone interested in a quality role-playing game.",
      "author": "Ed Gibbs, Geek Native"
    }
  ],
  "ru": {
    "tagShort": "Эпическое фэнтези о полубогах на пулах d10",
    "tagline": "«Вы рождены, чтобы править Творением. Мир называет вас Анафемой».",
    "description": "Exalted — эпическое фэнтези от Onyx Path. Вы играете Возвышенными: смертными, в которых вселилась частица божественной силы, способной рубить горы и спорить с богами. Третья редакция (2016) — это книга на 650+ страниц: пулы d10, где успех на 7+, а десятка считается за два, бой на Инициативе вместо хитов, и сотни Чар, складывающихся в личный боевой стиль. Сеттинг — Творение, огромный мир, который сочетает уся, аниме и мифологию. Если Ex3 кажется тяжеловатым, есть Exalted: Essence — облегчённое ядро в одной книге, где можно играть Возвышенными любого типа.",
    "pickIf": [
      "хотите эпических полубогов, которые рассекают горы и торгуются с богами",
      "игрокам нравится красочно описывать трюки и получать за это кубики",
      "группа готова осваивать большую боевую систему с сотнями Чармов"
    ],
    "skipIf": [
      "нужно что-то, что осваивается за вечер, — тогда начните с Exalted: Essence",
      "группе ближе приземлённые слабые герои, которым трудно выжить"
    ],
    "setting": "Творение — плоский мир, окружённый хаосом Вильда и подземным царством мёртвых. Полторы тысячи лет назад Возвышенные Драконьей Крови свергли Солнечных и объявили их демонами. Теперь Алая Императрица, правившая Царством, исчезла, империя трещит по швам, а Солнечные снова возвращаются в мир — и на них уже ведётся Охота Вильда. Шёлковые дворцы, руины Первой Эпохи, мёртвые лорды и падшие боги: всё это ждёт тех, кто осмелится взять мир в свои руки.",
    "vignette": "Пылающий паланкин падает в пропасть, а ваш Солнечный Касты Рассвета прыгает с него прямо на генерала. Описание впечатляет стол, и Рассказчик даёт трюк на два очка: +2 куба и единица Силы воли обратно. У вас 14 Инициативы, пора бить решающим ударом. Ловкость 5 + Ближний бой 5, ещё 2 куба за трюк и 4 куба от Совершенства за 4 частицы Сущности — всего 16 кубов против Защиты 4. Успехов с запасом. Урон — сама ваша Инициатива: бросаете 14 кубов, и каждый успех — уровень ранения без поглощения. Генерал падает, а ваша Инициатива сбрасывается до 3.",
    "prep": "~60 мин",
    "mechanics": [
      { "title": "Пулы d10: 7+ и двойные десятки", "text": "Атрибут + Способность в d10. Каждый куб на 7+ — успех, десятка считается за два. Трюки — красочное описание действия — дают +2 куба, а трюки посильнее ещё и возвращают Силу воли, так что стол сам задирает планку пафоса." },
      { "title": "Бой на Инициативе", "text": "Изматывающие атаки отнимают Инициативу у врага и прибавляют вам. Решающий удар бросает накопленную Инициативу как урон и сбрасывает её до 3. Довести противника до нуля — значит сломать его." },
      { "title": "Чары и Сущность", "text": "Сотни Чар, привязанных к Способностям: от фехтования, сносящего армии, до ремесла и интриг. Они питаются частицами Сущности, а тратя много силы сразу, вы разжигаете анима-ауру, которую видно издалека." },
      { "title": "Ex3 или Essence", "text": "Exalted Third Edition — полная тяжёлая версия, с отдельными книгами для других типов Возвышенных. Exalted: Essence — облегчённое ядро в одной книге для любых Возвышенных; дополнения к нему, Player's Guide и Storyteller's Guide, собраны краудфандингом и готовятся к выходу." }
    ],
    "gallery": [
      { "cap": "Круг Возвышенных в бою, арт из Exalted: Essence" },
      { "cap": "Рыцарь Смерти ведёт армию мертвецов" },
      { "cap": "Мастер боевых искусств против доспешного воина" },
      { "cap": "Карта Творения" }
    ],
    "resources": [
      { "name": "Exalted на сайте Onyx Path" },
      { "name": "Лист персонажа Ex3 (интерактивный PDF)" },
      { "name": "Лист персонажа Exalted: Essence (PDF)" },
      { "name": "Фанатская система для Foundry VTT (Exalted Third Edition)" }
    ],
    "quotes": [
      { "text": "EX3 — одна из лучших базовых книг ролевых игр, что я когда-либо читал, и её легко советовать всем, кто ищет качественную RPG." }
    ]
  },
  "en": {
    "tagShort": "Epic demigod fantasy on a d10 dice pool",
    "tagline": "\"You were born to rule Creation. The world calls you Anathema.\"",
    "description": "Exalted is epic fantasy from Onyx Path. You play the Exalted: mortals touched by a shard of divine power that lets them cleave mountains and bargain with gods. The Third Edition (2016) is a 650+ page book: d10 pools where 7+ succeeds and 10s count double, initiative-driven combat instead of hit-point attrition, and hundreds of Charms that build into a personal fighting style. The setting, Creation, mixes wuxia, anime and myth on a vast scale. If Ex3 feels heavy, Exalted: Essence is the lighter one-book core where any kind of Exalt is playable.",
    "pickIf": [
      "you want epic demigods who cleave mountains and bargain with gods",
      "your players love describing flashy stunts and getting dice for it",
      "your group enjoys mastering a big, crunchy combat system with hundreds of Charms"
    ],
    "skipIf": [
      "you want something learnable in one evening — start with Exalted: Essence instead",
      "your group prefers grounded, low-power heroes who struggle to survive"
    ],
    "setting": "Creation is a flat world ringed by the chaos of the Wyld and the shadowlands of the dead. Fifteen centuries ago the Dragon-Blooded overthrew the Solar Exalted and branded them demons. Now the Scarlet Empress who ruled the Realm has vanished, her empire is cracking, and the Solars are returning — with the Wyld Hunt already on their trail. Silk palaces, First Age ruins, Deathlords and fallen gods wait for anyone bold enough to seize the world.",
    "vignette": "A burning palanquin tips into the gorge and your Dawn Caste Solar leaps from it straight at the general. The table loves the description: a two-point stunt, +2 dice and a Willpower back. You sit at 14 Initiative — time for a decisive attack. Dexterity 5 + Melee 5, plus 2 stunt dice and 4 more from your Excellency for 4 motes of Essence: 16 dice against Defense 4. Successes to spare. Damage is your Initiative itself: roll 14 dice, each success a level of damage with no soak. The general falls, and your Initiative resets to 3.",
    "prep": "~60 min",
    "mechanics": [
      { "title": "d10 pools: 7+ and double 10s", "text": "Roll Attribute + Ability in d10s. Every 7+ is a success and 10s count twice. Stunts — vivid descriptions of an action — add +2 dice, and the better ones restore Willpower too, so the table keeps raising the stakes." },
      { "title": "Initiative combat", "text": "Withering attacks strip Initiative from a foe and add it to yours. A decisive attack rolls your banked Initiative as damage, then resets you to 3. Drop an enemy to zero Initiative or below and they crash." },
      { "title": "Charms and Essence", "text": "Hundreds of Charms tied to Abilities, from swordplay that scatters armies to crafting and court intrigue. They burn motes of Essence, and spending big lights up an anima banner seen for miles." },
      { "title": "Ex3 or Essence", "text": "Exalted Third Edition is the full, crunchy game, with separate books for other types of Exalt. Exalted: Essence is the lighter one-book core for any Exalt; its crowdfunded Player's Guide and Storyteller's Guide expansions are on the way." }
    ],
    "gallery": [
      { "cap": "A Circle of Exalted in battle, art from Exalted: Essence" },
      { "cap": "A Deathknight leads an army of the dead" },
      { "cap": "A martial artist faces an armoured warrior" },
      { "cap": "Map of Creation" }
    ],
    "resources": [
      { "name": "Exalted at Onyx Path" },
      { "name": "Ex3 character sheet (interactive PDF)" },
      { "name": "Exalted: Essence character sheet (PDF)" },
      { "name": "Community Foundry VTT system (Exalted Third Edition)" }
    ]
  }
});
