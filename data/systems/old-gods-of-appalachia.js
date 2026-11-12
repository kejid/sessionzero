registerSystem("old-gods-of-appalachia", {
  "groups": {
    "default": { "key": "narrative", "order": 88 },
    "family": { "key": "standalone", "order": 97 },
    "genre": { "key": "horror", "order": 28 }
  },
  "name": "Old Gods of Appalachia Roleplaying Game",
  "publisher": "Monte Cook Games",
  "dice": "d20 (Cypher System)",
  "players": "1–6",
  "complexity": 3,
  "foundryStatus": "Community", // CHECK: no dedicated module; the community Cypher System package foundryvtt.com/packages/cyphersystem lists Old Gods of Appalachia support (not affiliated with MCG)
  "heroImage": "https://sessionzero.games/images/heroes/old-gods-of-appalachia.jpg",
  "playstyleTags": ["horror", "mystery", "narrative"],
  "settingTags": ["historical", "weird"],
  "gallery": [
    { "src": "https://sessionzero.games/images/systems/old-gods-of-appalachia-g1.jpg" },
    { "src": "https://sessionzero.games/images/systems/old-gods-of-appalachia-g2.jpg" },
    { "src": "https://sessionzero.games/images/systems/old-gods-of-appalachia-g3.jpg" },
    { "src": "https://sessionzero.games/images/systems/old-gods-of-appalachia-g4.jpg" }
  ],
  "resources": [
    { "type": "link", "url": "https://www.montecookgames.com/old-gods-of-appalachia-roleplaying-game/", "fmt": "Web" },
    { "type": "link", "url": "https://www.montecookgames.com/store/product/old-gods-of-appalachia-roleplaying-game/", "fmt": "Store" },
    { "type": "sheet", "url": "https://www.montecookgames.com/store/product/old-gods-of-appalachia-character-portfolios-and-character-sheets/", "fmt": "PDF" },
    { "type": "link", "url": "https://foundryvtt.com/packages/cyphersystem", "fmt": "Foundry" }
  ],
  "mechanics": [
    { "icon": "dice-5" },
    { "icon": "gauge" },
    { "icon": "user-round-pen" },
    { "icon": "flame" }
  ],
  "quotes": [
    // VERIFIED-AT: https://www.gamesradar.com/old-gods-of-appalachia-roleplaying-game-review/ (Samantha Nelson, GamesRadar+, 2023-11-09)
    {
      "text": "This is a great game for fans of folk horror, where you'll be delving into remote settlements ruled by witches and haunted woods where you may be lost forever.",
      "author": "Samantha Nelson, GamesRadar+"
    },
    // VERIFIED-AT: https://massmovement.co.uk/old-gods-of-appalachia-rpg-monte-cook-games-review/ (Nathan Mainwaring, Mass Movement, 2025-05-23)
    {
      "text": "It feels immersive and rooted.",
      "author": "Nathan Mainwaring, Mass Movement"
    }
  ],
  "ru": {
    "tagShort": "Фолк-хоррор в горах старой Аппалачии",
    "tagline": "«Горы старше, чем вы думаете. И под ними кто-то не спит».",
    "description": "Ролевая игра по хоррор-подкасту-антологии Old Gods of Appalachia Стива Шелла и Кэма Коллинза. Издатель — Monte Cook Games (по лицензии DeepNerd Media), ведущий дизайнер — Шанна Жермен; книга выросла из Kickstarter 2022 года и вышла в 2023-м. Это самостоятельная игра на Cypher System: персонаж описывается одной фразой, бросок один — d20, а вся сила, будь то бабушкин заговор или ведьмин оберег, рано или поздно требует платы.",
    "setting": "Альтернативная Аппалачия 1920–30-х годов. Шахтёры копают всё глубже и будят древний Внутренний Мрак (Inner Dark), что шепчет отчаявшимся и раздаёт дары в обмен на службу. Против него — крепкие общины, знания, передаваемые бабушками из поколения в поколение, и сила самой земли. Ведьмины поселения, рабочие посёлки угольных компаний, проповедники с чересчур большой властью и леса, где можно сгинуть навсегда; книга даёт обзор каждого штата региона и большую карту.",
    "vignette": "Округ Уайз, 1927 год. Ваш *Protector* спускается по осыпи к устью шахты, из которого тянет холодом. Мастер ставит сложность 4 — нужно выбросить 12 или больше. Вы обучены лазанью: сложность падает на шаг. Вы тратите Усилие из запаса Скорости (3 очка минус Грань 1 — итого 2) — ещё шаг. Сложность 2, нужно 6. На d20 выпало 9 — вы внизу. И тут Мастер предлагает вмешательство вместе с очками опыта: фонарь гаснет, а из темноты кто-то зовёт вас голосом покойной матери. Отказаться можно, заплатив опытом, — вы соглашаетесь. А бабушкин оберег, на который вы рассчитывали, «пришёл к сроку»: он мёртв, пока вы не заплатите ведьме её цену. Остаётся последнее — свеча с травами, что не даёт умереть, пока горит.",
    "prep": "~30 мин",
    "mechanics": [
      { "title": "Один d20 и сложность", "text": "Мастер ставит сложность от 0 до 10, цель броска — сложность × 3. Навыки, полезные вещи и Усилие снижают сложность на шаг каждое, так что игроки бросают d20 без модификаторов. Сложность 0 — успех без броска." },
      { "title": "Запасы, Грань и Усилие", "text": "У героя три запаса — Мощь, Скорость и Интеллект. Из них платят за Усилие и способности, Грань снижает цену, а урон бьёт по тем же запасам. Каждое решение — вопрос, чем вы готовы рискнуть." },
      { "title": "Персонаж одной фразой", "text": "«Я [дескриптор] [тип], который [фокус]». Типы — Мудрец (Sage), Защитник (Protector), Исследователь (Explorer) и Оратор (Speaker); фокусы вроде «Не боится призраков» (Fears No Haints) или «Спускается во Мрак» (Delves the Darkness). Порядка сорока дескрипторов и двадцати пяти фокусов." },
      { "title": "Всё имеет цену", "text": "Сайферы — одноразовые народные чудеса: свеча, что не даёт умереть, пока горит, или пирог, возвращающий силы. Артефакты могут «прийти к сроку» и замолчать, пока вы не заплатите — кровью или услугой ведьме. А режим ужаса делает вмешательства Мастера всё чаще, когда тёмные силы вас замечают." }
    ],
    "gallery": [
      { "cap": "Обложка основной книги" },
      { "cap": "Древнее дерево в чаще" },
      { "cap": "Палаточное богослужение" },
      { "cap": "Дети шахтёрского посёлка" }
    ],
    "resources": [
      { "name": "Страница игры на сайте Monte Cook Games" },
      { "name": "Книга в магазине Monte Cook Games" },
      { "name": "Бесплатный лист персонажа и портфолио" },
      { "name": "Система Cypher для Foundry VTT (сообщество)" }
    ],
    "quotes": [
      { "text": "Отличная игра для любителей фолк-хоррора: вас ждут глухие поселения, где правят ведьмы, и заколдованные леса, в которых можно сгинуть навсегда." },
      { "text": "Она ощущается живой и укоренённой." }
    ]
  },
  "en": {
    "tagShort": "Folk horror in an alternate Appalachia",
    "tagline": "\"The mountains are older than you think. And something under them is awake.\"",
    "description": "The roleplaying game of Steve Shell and Cam Collins's horror anthology podcast Old Gods of Appalachia. It is published by Monte Cook Games under licence from DeepNerd Media, with Shanna Germain as lead designer; it grew out of a 2022 Kickstarter and came out in 2023. It is a standalone Cypher System game: your character is a single sentence, the only roll is a d20, and every power — a granny's charm or a witch's token — eventually asks for its price.",
    "setting": "An alternate Appalachia of the 1920s and '30s. Miners dig ever deeper and wake the ancient Inner Dark, which whispers to the desperate and grants boons in return for service. Against it stand tight-knit communities, secrets handed down by grannies and the raw might of the land itself. Witch-ruled settlements, company towns, preachers with too much power and woods where you can be lost forever; the book surveys each state of the region and comes with a large map.",
    "vignette": "Wise County, 1927. Your Protector scrambles down the scree toward a mine mouth breathing cold air. The GM sets difficulty 4 — you need 12 or higher. You're trained in climbing, so the difficulty drops a step. You apply Effort from your Speed Pool (3 points minus your Edge of 1, so 2) — another step. Difficulty 2, target 6. The d20 shows 9 — you're down. Then the GM offers an intrusion, with the XP that comes with it: your lantern dies and someone in the dark calls your name in your late mother's voice. You could refuse by spending XP; you take it. Worse, granny's charm has come due — it's inert until you pay the witch her price. All you have left is the herb candle that keeps you from dying while it burns.",
    "prep": "~30 min",
    "mechanics": [
      { "title": "One d20 vs. difficulty", "text": "The GM sets a difficulty from 0 to 10, and the target number is three times that. Skills, useful assets and Effort each lower the difficulty by one step, so players roll a bare d20. Difficulty 0 means automatic success." },
      { "title": "Pools, Edge & Effort", "text": "Every character has three Pools — Might, Speed and Intellect. You spend from them to apply Effort and use abilities, Edge lowers the cost, and damage comes out of the same Pools. Every choice is about what you're willing to risk." },
      { "title": "A character in one sentence", "text": "\"I am a [descriptor] [type] who [focus].\" The types are Sage, Protector, Explorer and Speaker; foci include Fears No Haints and Delves the Darkness. Around forty descriptors and twenty-five foci." },
      { "title": "Everything has a price", "text": "Cyphers are one-use folk wonders: a candle that keeps someone from dying while it burns, an apple pie that restores your strength. Artifacts can come due and go inert until you pay — in blood or a favour to a witch. And Horror Mode makes GM intrusions ever more frequent as the dark powers take notice." }
    ],
    "gallery": [
      { "cap": "Core rulebook cover" },
      { "cap": "An ancient tree in the deep woods" },
      { "cap": "A tent revival" },
      { "cap": "Children of a mining town" }
    ],
    "resources": [
      { "name": "Monte Cook Games game page" },
      { "name": "The book in the Monte Cook Games store" },
      { "name": "Free character sheet and portfolios" },
      { "name": "Cypher System for Foundry VTT (community)" }
    ]
  }
});
