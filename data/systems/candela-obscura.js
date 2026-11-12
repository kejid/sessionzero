registerSystem("candela-obscura", {
  "groups": {
    "default": { "key": "narrative", "order": 75 },
    "family": { "key": "pbta-fitd", "order": 40 },
    "genre": { "key": "horror", "order": 23 }
  },
  "name": "Candela Obscura",
  "publisher": "Darrington Press",
  "dice": "d6 pool (Illuminated Worlds)",
  "players": "3–5",
  "complexity": 2,
  "foundryStatus": "Community",
  "heroImage": "https://sessionzero.games/images/heroes/candela-obscura.jpg",
  "playstyleTags": ["horror", "mystery", "narrative"],
  "settingTags": ["historical", "weird"],
  "gallery": [
    { "src": "https://sessionzero.games/images/systems/candela-obscura-g1.jpg" },
    { "src": "https://sessionzero.games/images/systems/candela-obscura-g2.jpg" },
    { "src": "https://sessionzero.games/images/systems/candela-obscura-g3.jpg" },
    { "src": "https://sessionzero.games/images/systems/candela-obscura-g4.jpg" }
  ],
  "resources": [
    { "type": "link", "url": "https://darringtonpress.com/candela/", "fmt": "Web" },
    { "type": "quickstart", "url": "https://darringtonpress.com/play-candela-obscura-with-our-new-quickstart-guide/", "fmt": "Web" },
    { "type": "sheet", "url": "https://darringtonpress.com/wp-content/uploads/2024/06/CO_Character-Circle-Sheets_Interactive.pdf", "fmt": "PDF" },
    { "type": "link", "url": "https://darringtonpress.com/wp-content/uploads/2023/11/Candela-Obscura-Guides-and-FAQ-11-20-23.pdf", "fmt": "PDF" },
    { "type": "link", "url": "https://foundryvtt.com/packages/candelafvtt", "fmt": "Foundry" }
  ],
  "mechanics": [
    { "icon": "dices" },
    { "icon": "flame" },
    { "icon": "brain" },
    { "icon": "users" }
  ],
  "quotes": [
    // VERIFIED-AT: https://techraptor.net/tabletop/reviews/candela-obscura-core-rulebook-review-comprehensive-guide-to-newfaire-and-horror
    {
      "text": "Candela Obscura makes itself extremely accessible to those who don't have the time for a long-form TTRPG campaign or simply only want a short adventure.",
      "author": "Andrew Stretch, TechRaptor"
    }
  ],
  "ru": {
    "tagShort": "Готический хоррор тайного общества",
    "tagline": "«Магия просачивается в мир. Кто-то должен держать свечу».",
    "description": "Candela Obscura — первая ролевая игра Darrington Press, издательства Critical Role, и первая на движке Illuminated Worlds. Игроки — Круг следователей тайного общества Candela Obscura, которые расследуют сверхъестественные происшествия, выслеживают тварей и запечатывают опасные артефакты. Короткие задания на одну-две сессии, пул d6, Мастер, который не бросает кубики, и травмы, навсегда меняющие героя.",
    "pickIf": [
      "хотите готические хоррор-расследования на одну-две сессии",
      "группе нравится, когда мастер не бросает кубы и всё решают игроки",
      "хотите ран и шрамов, которые меняют персонажей навсегда"
    ],
    "skipIf": [
      "нужна долгая песочница с развитием банды и даунтаймом",
      "игроки хотят побеждать монстров грубой силой",
      "за столом предпочитают медленный смертельный тон классического лавкрафтовского хоррора"
    ],
    "setting": "Фейрленды — мир в духе Позолоченного века: газовые фонари, железные дороги, послевоенная усталость. В центре — Ньюфейр, город, выросший прямо на руинах древнего Олдфейра. Из иного измерения, Вспышки, в мир сочится магия, порождая чудовищ и порчу. Общество Candela Obscura хранит тайну и защищает людей, даже если это стоит его следователям рассудка и тела.",
    "vignette": "Ваш детектив крадётся по складу в районе Стил. Действие Скрытность — 2, вы тратите 1 Хитрость и бросаете 3d6: 6, 6, 2. Две шестёрки — критический успех: вы не только прошли незамеченным, но и нашли журнал контрабандиста. Медиум ощущает присутствие у алтаря: Чутьё — 2, и оно позолочено, поэтому одна из костей особого цвета. Выпадает 4 и позолоченная 5 — частичный успех, а выбор позолоченной кости возвращает 1 Интуицию. Цена — 2 метки Порчи. Их уже было две, значит, это четвёртая метка: медиум падает без сил и получает шрам, перенося очко из одного действия в другое.",
    "prep": "~30 мин",
    "mechanics": [
      { "title": "Пул d6, берётся лучшая", "text": "Бросаете столько d6, каков рейтинг действия, и берёте наибольшую. 6 — успех, 4–5 — успех с ценой, 1–3 — провал, несколько шестёрок — критический успех. Мастер не бросает никогда." },
      { "title": "Влечения и позолота", "text": "Три Влечения — Отвага, Хитрость, Интуиция — добавляют кости к броску и питают сопротивления. Позолоченные действия бросаются с особой костью: возьмите её результат — и вернёте очко Влечения." },
      { "title": "Метки и шрамы", "text": "Три шкалы урона: Тело, Разум и Порча от магии. Четвёртая метка выводит героя из сцены и оставляет шрам, который навсегда сдвигает его рейтинги. Четвёртый шрам — конец истории." },
      { "title": "Круг и задания", "text": "Партия — это Круг со своим названием, способностями и общими ресурсами на лечение и восстановление. Каждое задание — законченная тайна на один-два вечера, удобная для разовых игр." }
    ],
    "gallery": [
      { "cap": "Следователи перед Вспышкой" },
      { "cap": "Тварь из иного мира" },
      { "cap": "Разворот о районе Саут-Соффит" },
      { "cap": "Разворот книги правил" }
    ],
    "resources": [
      { "name": "Darrington Press — официальная страница" },
      { "name": "Бесплатный квикстарт" },
      { "name": "Листы персонажей и Круга (PDF)" },
      { "name": "Памятки и FAQ для игроков и Мастера (PDF)" },
      { "name": "Модуль сообщества для Foundry VTT" }
    ],
    "quotes": [
      { "text": "Candela Obscura чрезвычайно доступна для тех, у кого нет времени на долгую кампанию или кто просто хочет короткое приключение." }
    ]
  },
  "en": {
    "tagShort": "Secret-society gothic horror",
    "tagline": "\"Magick bleeds into the world. Someone has to hold the candle.\"",
    "description": "Candela Obscura is the first roleplaying game from Darrington Press, Critical Role's publishing arm, and the debut of the Illuminated Worlds engine. You play a Circle of investigators for the secret society Candela Obscura, looking into supernatural incidents, hunting creatures and sealing away dangerous artifacts. Short one-or-two-session assignments, a d6 dice pool, a GM who never rolls, and injuries that change your character for good.",
    "pickIf": [
      "you want gothic horror investigations that fit into one or two sessions",
      "your group likes a GM who never rolls and players driving the dice",
      "you want injuries and scars that change characters for good"
    ],
    "skipIf": [
      "you want a long sandbox with crew growth and downtime",
      "your players want to defeat monsters through sheer power",
      "your table prefers the slow, lethal tone of classic Lovecraftian horror"
    ],
    "setting": "The Fairelands — a Gilded Age-inspired world of gas lamps, railways and post-war weariness. At its heart is Newfaire, a city built over the ruins of ancient Oldfaire. Magick seeps in from another plane called the Flare, breeding monsters and corruption. The Candela Obscura keeps the secret and protects the public, even when it costs its investigators their minds and bodies.",
    "vignette": "Your Detective slips through a warehouse in the Steel. Hide is rated 2, you spend 1 Cunning and roll 3d6: 6, 6, 2. Two sixes — a critical success: you go unseen and find the smuggler's ledger too. The Medium senses something at the altar: Sense is rated 2 and gilded, so one die is a different color. It comes up 4 and a gilded 5 — a mixed success, and taking the gilded die earns back 1 Intuition. The cost is 2 Bleed. She already had two, so that's a fourth mark: the Medium drops incapacitated and takes a scar, shifting a point from one action to another.",
    "prep": "~30 min",
    "mechanics": [
      { "title": "d6 pool, take the highest", "text": "Roll as many d6 as the action's rating and keep the best. A 6 succeeds, 4–5 succeeds at a cost, 1–3 fails, and multiple sixes are a critical. The GM never rolls." },
      { "title": "Drives and gilded dice", "text": "Three Drives — Nerve, Cunning, Intuition — add dice to rolls and fuel your resistances. Gilded actions swap in a special die: take its result and you earn back a point of Drive." },
      { "title": "Marks and scars", "text": "Three harm tracks: Body, Brain and Bleed from magick. A fourth mark knocks you out of the scene and leaves a scar that permanently shifts your ratings. A fourth scar ends your story." },
      { "title": "Circles and assignments", "text": "The party is a Circle with its own name, abilities and shared resources for healing and recovery. Each assignment is a self-contained mystery for one or two nights — perfect for one-shots." }
    ],
    "gallery": [
      { "cap": "Investigators before the Flare" },
      { "cap": "A creature from beyond" },
      { "cap": "South Soffit district spread" },
      { "cap": "Rulebook interior spread" }
    ],
    "resources": [
      { "name": "Darrington Press — official page" },
      { "name": "Free Quickstart Guide" },
      { "name": "Character & Circle sheets (PDF)" },
      { "name": "Player & GM field guides and FAQ (PDF)" },
      { "name": "Community module for Foundry VTT" }
    ]
  }
});
