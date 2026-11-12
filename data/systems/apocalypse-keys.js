registerSystem("apocalypse-keys", {
  "groups": {
    "default": { "key": "narrative", "order": 89 },
    "family": { "key": "pbta-fitd", "order": 44 },
    "genre": { "key": "narrative-weird", "order": 18 }
  },
  "name": "Apocalypse Keys",
  "publisher": "Evil Hat Productions",
  "dice": "2d6 + Darkness Tokens (PbtA)",
  "players": "3–6",
  "complexity": 3,
  "foundryStatus": "None",
  "heroImage": "https://sessionzero.games/images/heroes/apocalypse-keys.jpg",
  "playstyleTags": ["mystery", "narrative", "social"],
  "settingTags": ["urban-fantasy", "weird"],
  "gallery": [
    { "src": "https://sessionzero.games/images/systems/apocalypse-keys-g1.jpg" },
    { "src": "https://sessionzero.games/images/systems/apocalypse-keys-g2.jpg" },
    { "src": "https://sessionzero.games/images/systems/apocalypse-keys-g3.jpg" },
    { "src": "https://sessionzero.games/images/systems/apocalypse-keys-g4.jpg" }
  ],
  "resources": [
    { "type": "link", "url": "https://evilhat.itch.io/apocalypse-keys", "fmt": "Web" },
    { "type": "sheet", "url": "https://evilhat.com/wp-content/uploads/2023/04/Apocalypse-Keys-Playbooks-Moves-Reference-and-Keepers-Handouts.pdf", "fmt": "PDF" },
    { "type": "link", "url": "https://temporalhiccup.itch.io/apocalypse-keys", "fmt": "Web" }
  ],
  "mechanics": [
    { "icon": "dices" },
    { "icon": "moon" },
    { "icon": "key" },
    { "icon": "heart-crack" }
  ],
  "quotes": [
    // VERIFIED-AT: https://cannibalhalflinggaming.com/2022/09/28/apocalypse-keys-review/ (Aaron Marks, Cannibal Halfling Gaming, 2022-09-28; written during the Evil Hat Kickstarter, before the final edition)
    {
      "text": "Apocalypse Keys is at its heart an investigation game, and the investigation mechanics are really neat.",
      "author": "Aaron Marks, Cannibal Halfling Gaming"
    }
  ],
  "ru": {
    "tagShort": "Чудовища спасают мир от апокалипсиса",
    "tagline": "«Даже у самых могущественных чудовищ есть сердце».",
    "description": "Детективная игра на движке Powered by the Apocalypse от Рэй Неджади. В 2020 году автор выпустила её сама на itch.io, а потом права купила Evil Hat Productions и собрала на Kickstarter новое издание (PDF — 2023). Игроки — Омены, чудовища на службе тайной организации DIVISION: они ищут Ключи, раскрывают замысел Предвестника и не дают ему отпереть Дверь Рока. Главный конфликт при этом внутри: сила, которая спасает мир, тянет самих героев к тому, чтобы стать следующим апокалипсисом.",
    "pickIf": [
      "хотите расследования «монстр недели» в духе «Хеллбоя» и «Роковой патруль»",
      "игрокам нравится играть монстров, которые борются с собственной тьмой",
      "группе нравится самой собирать разгадку тайны из найденных улик"
    ],
    "skipIf": [
      "хотите детектив, где мастер заранее написал единственную разгадку",
      "за столом избегают тяжёлых эмоций и драмы отношений",
      "нужен тактический бой или детальные билды персонажей"
    ],
    "setting": "Наш мир, в котором древние Двери Силы ждут своего часа, а Предвестники (Harbingers) охотятся за ними ради собственного возвышения. DIVISION — теневое агентство и одновременно найденная семья для монстров, которым больше некуда идти. Вдохновение — «Хеллбой», «Люди в чёрном», «Страшные сказки» и «Роковой патруль»: громкие силы, ещё более громкие чувства.",
    "vignette": "Библиотека, где книги переписывают сами себя. Ваш *Surge* ищет Ключи (Grasp Keys), не вкладывая жетонов: 4 + 4 = 8 — на 8–10 Мастер называет найденный Ключ. Из-за стеллажей выходит библиотекарь-культист. *Hungry* обрушивает на него Тьму (Unleash the Dark): у неё 6 жетонов Тьмы, она вкладывает один — 5 + 3 + 1 = 9, на 8–10 выбирает два пункта: пробить защиту и наложить Состояние, избежать ответного удара. Но после хода у неё всё ещё 5 жетонов, и она Разрывается (Torn Between). Вместо того чтобы отметить Разрушение, она тратит Связь с *Surge*: он помогает ей вернуть контроль. В конце сессии команда соединяет 4 Ключа с гранями тайны и отпирает Дверь Рока при сложности тайны 3: 3 + 5 + 4 − 3 = 9. Они точно знают, где Дверь и как её открыть.",
    "prep": "~30 мин",
    "mechanics": [
      { "title": "Перевёрнутые 2d6", "text": "Перед броском можно вложить до трёх жетонов Тьмы — они прибавляются к результату. На 8–10 — чистый успех, на 11+ сила выходит из-под контроля: успех с непредвиденными последствиями, на 7 и ниже — ход Мастера. Слишком много силы — тоже проблема." },
      { "title": "Жетоны Тьмы", "text": "Каждый плейбук получает 2–4 жетона за свои триггеры — например, когда воплощает отмеченное Состояние. Если после хода у вас 5 и больше жетонов, вы Разрываетесь: отметить Разрушение, сбросить все жетоны или потратить Связь с тем, кто вас удержит." },
      { "title": "Ключи и Дверь Рока", "text": "Ход «Ищи Ключи» добывает улики, а теорию проверяет «Отопри Дверь Рока»: 2d6 плюс число связанных Ключей минус сложность тайны, без жетонов и Связей. На 7 и ниже все отмечают Разрушение, а Часы Судного дня тикают дальше." },
      { "title": "Разрушение и сердце", "text": "Опыт и Разрушение копятся параллельно: 8 опыта дают обычное развитие, 5 Разрушения — шаг к чудовищности. Последний шаг — отправить героя на покой Предвестником апокалипсиса. Спасают Связи и ход «Открой сердце», который может стереть отметку Разрушения." }
    ],
    "gallery": [
      { "cap": "Обложка издания Evil Hat" },
      { "cap": "Агенты DIVISION — арт оригинального издания" },
      { "cap": "Семь плейбуков" },
      { "cap": "Разворот о Двери Рока" }
    ],
    "resources": [
      { "name": "Evil Hat — книга на itch.io" },
      { "name": "Плейбуки, базовые ходы и памятки Мастера (PDF)" },
      { "name": "Страница автора на itch.io (издание 2020 года)" }
    ],
    "quotes": [
      { "text": "Apocalypse Keys в душе — игра-расследование, и механики расследования в ней по-настоящему изящны." }
    ]
  },
  "en": {
    "tagShort": "Monsters save the world from the apocalypse",
    "tagline": "\"Even the most powerful monsters have hearts.\"",
    "description": "A Powered by the Apocalypse mystery game by Rae Nedjadi. Nedjadi self-published it on itch.io in 2020; Evil Hat Productions then acquired the rights and crowdfunded a new edition on Kickstarter (PDF in 2023). You play Omens, monsters working for the secret agency DIVISION: you hunt Keys, piece together a Harbinger's plan and stop them from unlocking Doom's Door. The real conflict is inside — the power that saves the world keeps pulling your monster toward becoming the next apocalypse.",
    "pickIf": [
      "you want monster-of-the-week mysteries in the vein of Hellboy and Doom Patrol",
      "your players like playing monsters wrestling with their own dark power",
      "your group enjoys building the solution to a mystery from collected clues"
    ],
    "skipIf": [
      "you want a GM-authored mystery with one fixed solution to uncover",
      "your table avoids heavy emotional themes and relationship drama",
      "you want tactical combat or detailed character builds"
    ],
    "setting": "Our world, where ancient Doors of Power wait to be opened and Harbingers hunt them to claim that power for themselves. DIVISION is a shadowy agency and a found family for monsters with nowhere else to go. Inspirations include Hellboy, Men in Black, Penny Dreadful and Doom Patrol: big powers, bigger feelings.",
    "vignette": "A library where the books rewrite themselves. Your Surge Grasps Keys without committing any tokens: 4 + 4 = 8 — on an 8–10 the Keeper tells you what Key you've uncovered. A cultist librarian steps out from the stacks. The Hungry Unleashes the Dark: she has 6 Darkness Tokens and commits one — 5 + 3 + 1 = 9, so on an 8–10 she picks two: get past his defences and inflict a Condition, and avoid reprisals. But after the move she still holds 5 tokens, so she's Torn Between. Instead of marking Ruin, she spends a Bond with the Surge, who helps her regain control. At session's end the team connects 4 Keys to the Facets and tries to Unlock Doom's Door against a Mystery complexity of 3: 3 + 5 + 4 − 3 = 9. They know exactly where the Door is and how to unlock it.",
    "prep": "~30 min",
    "mechanics": [
      { "title": "Upside-down 2d6", "text": "Before rolling you may commit up to three Darkness Tokens, which add to the result. 8–10 is a clean success; on 11+ your power slips out of control — success with an unintended consequence; 7 or less is a Keeper move. Too much power is a problem too." },
      { "title": "Darkness Tokens", "text": "Each playbook gains 2–4 tokens from its own triggers, such as embodying a marked Condition. If you hold 5 or more after a move, you're Torn Between: mark Ruin, lose all your tokens, or spend a Bond with someone who pulls you back." },
      { "title": "Keys & Doom's Door", "text": "Grasp Keys uncovers clues; Unlock Doom's Door tests your theory: 2d6 plus connected Keys minus the Mystery's complexity, with no tokens or Bonds allowed. On a 7 or less every PC marks Ruin and the Doomsday Clock ticks forward." },
      { "title": "Ruin & the heart", "text": "XP and Ruin build side by side: 8 XP buys a normal advance, 5 Ruin a step toward monstrosity. The final Ruin advance retires your character as a Harbinger of the apocalypse. Bonds and Reveal Your Heart — which can clear a mark of Ruin — hold you together." }
    ],
    "gallery": [
      { "cap": "Evil Hat edition cover" },
      { "cap": "DIVISION agents — art from the original edition" },
      { "cap": "The seven playbooks" },
      { "cap": "Spread on Doom's Door" }
    ],
    "resources": [
      { "name": "Evil Hat — the book on itch.io" },
      { "name": "Playbooks, basic moves and Keeper handouts (PDF)" },
      { "name": "Designer's itch.io page (2020 edition)" }
    ]
  }
});
