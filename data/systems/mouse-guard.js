registerSystem("mouse-guard", {
  "groups": {
    "default": { "key": "narrative", "order": 80 },
    "family": { "key": "standalone", "order": 85 },
    "genre": { "key": "adventure", "order": 44 }
  },
  "name": "Mouse Guard Roleplaying Game",
  "publisher": "Archaia (BOOM! Studios)",
  "dice": "d6 pool",
  "players": "2–5",
  "complexity": 3,
  "foundryStatus": "Community", // CHECK: foundryvtt.com/packages/mouseguard by LostPhoenix, last verified on Foundry v10
  "heroImage": "https://sessionzero.games/images/heroes/mouse-guard.jpg",
  "playstyleTags": ["narrative", "explore", "survival"],
  "settingTags": ["fantasy"],
  "gallery": [
    { "src": "https://sessionzero.games/images/systems/mouse-guard-g1.jpg" },
    { "src": "https://sessionzero.games/images/systems/mouse-guard-g2.jpg" },
    { "src": "https://sessionzero.games/images/systems/mouse-guard-g3.jpg" },
    { "src": "https://sessionzero.games/images/systems/mouse-guard-g4.jpg" }
  ],
  "resources": [
    { "type": "link", "url": "https://www.mouseguard.net/rpg", "fmt": "Web" },
    { "type": "sheet", "url": "https://www.burningwheel.com/products/mouse-guard-character-gm-sheets-pdf", "fmt": "PDF" },
    { "type": "link", "url": "https://www.boom-studios.com/series/mouse-guard/", "fmt": "Web" },
    { "type": "link", "url": "https://foundryvtt.com/packages/mouseguard", "fmt": "Foundry" }
  ],
  "mechanics": [
    { "icon": "target" },
    { "icon": "leaf" },
    { "icon": "swords" },
    { "icon": "heart-crack" }
  ],
  "quotes": [
    // VERIFIED-AT: https://reactormag.com/mouse-guard-roleplaying-game/ (Steven Padnick, Tor.com, 2009-08-06; review of the 1st edition)
    {
      "text": "Like Petersen’s comic, Mouse Guard RPG seems simple at first but holds surprising depth.",
      "author": "Steven Padnick, Tor.com"
    },
    // VERIFIED-AT: https://reactormag.com/mouse-guard-roleplaying-game/
    {
      "text": "Mouse Guard is a storytelling experience that happens to involve a dice game.",
      "author": "Steven Padnick, Tor.com"
    }
  ],
  "ru": {
    "tagShort": "Мыши-стражи против большого мира",
    "tagline": "«Ты всего лишь мышь. Но патруль должен дойти».",
    "description": "Ролевая игра Люка Крейна по комиксам Дэвида Петерсена, удостоенным премии Eisner, — облегчённая и самая дружелюбная к новичкам игра семейства Burning Wheel. Вы — мыши Гвардии, что водят патрули между городами, охраняют тропы и спасают сородичей от непогоды, хищников и друг друга. Проверки решаются пулом d6, где каждая 4–6 — успех, а персонажа двигают Убеждение, Цель и Инстинкт. Второе издание (2015) вышло коробкой с картами действий, кубиками и картой Территорий.",
    "pickIf": ["хотите благородных мышей-стражей против погоды, хищников и долга", "группе нравится, когда Убеждения и Цели персонажей движут игрой", "нужен мягкий вход в семейство Burning Wheel"],
    "skipIf": ["хотите свободную песочницу без миссий", "игрокам не нравится заранее тайно расписывать действия в конфликте", "нужны правила, которые осваиваются за десять минут"],
    "setting": "Мышиные Территории, 1152 год. Мыши живут в городах, спрятанных в корнях деревьев и под камнями, а Гвардия из крепости Локхейвен держит дороги между ними. Совы, ласки, змеи, снег и паводки здесь страшнее любого дракона, а смена времён года задаёт ритм всей кампании — от весенних разливов до голодной зимы.",
    "vignette": "Осень. На патруль пикирует сова, и ваша мышь бросается вверх по стволу дуба. Лазать — в мышиной Природе, поэтому мастер даёт бросить Природу 3 против Препятствия 2. Трёх кубиков маловато, и перед броском вы тратите очко Персоны: +1D. Выпадают 5, 2, 1 и 6 — два успеха, и когти совы скребут кору там, где миг назад был ваш хвост.",
    "prep": "~30 мин",
    "mechanics": [
      { "title": "Убеждение, Цель, Инстинкт", "text": "У каждой мыши есть Убеждение, Цель на эту сессию и Инстинкт. Играть по ним (или против них) — значит получать очки Судьбы и Персоны, которыми потом гнут кубики." },
      { "title": "Ход мастера и ход игроков", "text": "Сначала мастер ставит патрулю задание и бросает в него погоду, зверей и препятствия. Потом игроки тратят заработанные проверки на свои дела — лечиться, вербовать союзников, гнать собственные цели." },
      { "title": "Конфликты на картах", "text": "Бои, погони и споры решаются одинаково: стороны тайно планируют по три действия — Атака, Защита, Финт, Манёвр — и вскрывают их по одному, сбивая расположение противника." },
      { "title": "Провал — это поворот", "text": "Проваленная проверка не останавливает историю: мастер даёт либо сюжетный поворот, либо успех ценой состояния — Голоден и хочет пить, Зол, Устал, Ранен или Болен." }
    ],
    "gallery": [
      { "cap": "Коробка второго издания" },
      { "cap": "Обложка книги правил" },
      { "cap": "Карта Мышиных Территорий" },
      { "cap": "Разворот книги: кубики и успехи" }
    ],
    "resources": [
      { "name": "Страница игры у Дэвида Петерсена" },
      { "name": "Бесплатные листы персонажа и мастера" },
      { "name": "Серия Mouse Guard у BOOM! Studios" },
      { "name": "Комьюнити-система для Foundry VTT" }
    ],
    "quotes": [
      { "text": "Как и комикс Петерсена, Mouse Guard RPG поначалу кажется простой, но таит удивительную глубину." },
      { "text": "Mouse Guard — это опыт совместного рассказа истории, в котором заодно бросают кубики." }
    ]
  },
  "en": {
    "tagShort": "Mouse rangers against a huge world",
    "tagline": "\"You're only a mouse. The patrol still has to get through.\"",
    "description": "Luke Crane's RPG of David Petersen's Eisner-winning comics is the lightest and most newcomer-friendly game in the Burning Wheel family. You play mice of the Guard, leading patrols between towns, keeping the trails open and saving fellow mice from weather, predators and each other. Tests use a pool of d6s where every 4–6 is a success, and each mouse runs on a Belief, a Goal and an Instinct. The 2015 second edition comes as a boxed set with action cards, dice and a map of the Territories.",
    "pickIf": ["you want noble mice on patrol, facing weather, predators and duty", "your group likes Beliefs and Goals that drive play and earn rewards", "you want a gentler entry into the Burning Wheel family"],
    "skipIf": ["you want a free-roaming sandbox with no mission structure", "your players dislike secretly scripting combat actions in advance", "you want lightweight rules you can learn in ten minutes"],
    "setting": "The Mouse Territories, 1152. Mice live in towns hidden among tree roots and under stones, and the Guard of Lockhaven keeps the roads between them alive. Owls, weasels, snakes, snow and floods are more frightening than any dragon, and the turning seasons set the rhythm of a campaign, from spring floods to a starving winter.",
    "vignette": "Autumn. An owl drops on the patrol and your mouse bolts up an oak trunk. Climbing is in a mouse's Nature, so the GM lets you roll Nature 3 against Obstacle 2. Three dice feel thin, so before rolling you spend a Persona point for +1D. You get 5, 2, 1 and 6: two successes, and the owl's talons rake the bark where your tail was a heartbeat ago.",
    "prep": "~30 min",
    "mechanics": [
      { "title": "Belief, Goal, Instinct", "text": "Every mouse carries a Belief, a Goal for this session and an Instinct. Playing to them, or against them, earns Fate and Persona points you later spend to bend the dice." },
      { "title": "GM's turn and players' turn", "text": "First the GM hands the patrol a mission and throws weather, animals and obstacles at it. Then the players spend the checks they earned on their own business: healing, recruiting allies, chasing personal goals." },
      { "title": "Scripted conflicts", "text": "Fights, chases and arguments all work the same way: each side secretly scripts three actions (Attack, Defend, Feint, Maneuver) and reveals them one by one, wearing down the other side's disposition." },
      { "title": "Failure as a twist", "text": "A failed test never stalls the story. The GM either introduces a twist or grants success at the cost of a condition: Hungry and Thirsty, Angry, Tired, Injured or Sick." }
    ],
    "gallery": [
      { "cap": "Second edition boxed set" },
      { "cap": "Rulebook cover" },
      { "cap": "Map of the Mouse Territories" },
      { "cap": "Rulebook spread: dice and successes" }
    ],
    "resources": [
      { "name": "Game page by David Petersen" },
      { "name": "Free character and GM sheets" },
      { "name": "Mouse Guard series at BOOM! Studios" },
      { "name": "Foundry VTT community system" }
    ]
  }
});
