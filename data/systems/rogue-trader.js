registerSystem("rogue-trader", {
  "groups": {
    "default": { "key": "tactical", "order": 44 },
    "family": { "key": "standalone", "order": 87 },
    "genre": { "key": "sci-fi", "order": 23 }
  },
  "name": "Warhammer 40,000: Rogue Trader",
  "publisher": "Fantasy Flight Games",
  "dice": "d100",
  "players": "3–6",
  "complexity": 4,
  // CHECK: covered by the community "wh40k-rpg" system (Dark Heresy 1e/2e, Rogue Trader, Black Crusade, Deathwatch, Only War), still in prerelease testing — foundryvtt.com/packages/wh40k-rpg
  "foundryStatus": "Community",
  // Official FFG 2009 wallpaper of the core rulebook cover art (1920x1200), archived; logos and URL along the bottom — crop from the top when self-hosting
  "heroImage": "https://sessionzero.games/images/heroes/rogue-trader.jpg",
  "playstyleTags": ["explore", "social", "combat"],
  "settingTags": ["space"],
  "gallery": [
    { "src": "https://sessionzero.games/images/systems/rogue-trader-g1.jpg" },
    { "src": "https://sessionzero.games/images/systems/rogue-trader-g2.jpg" },
    { "src": "https://sessionzero.games/images/systems/rogue-trader-g3.jpg" },
    { "src": "https://sessionzero.games/images/systems/rogue-trader-g4.webp" }
  ],
  "resources": [
    { "type": "link", "url": "https://cubicle7games.com/rogue-trader-core-rulebook", "fmt": "PDF" },
    { "type": "link", "url": "https://foundryvtt.com/packages/wh40k-rpg", "fmt": "Foundry" }
  ],
  "mechanics": [
    { "icon": "route" },
    { "icon": "coins" },
    { "icon": "rocket" },
    { "icon": "dices" }
  ],
  "quotes": [
    // VERIFIED-AT: https://www.pcgamer.com/warhammer-TTRPGs/
    {
      "text": "Rogue Trader focuses on the journeys of 40k's rascally merchant explorers, allowing for more adventurous stories and more diverse parties—even including xenos characters.",
      "author": "Robin Valentine, PC Gamer"
    }
  ],
  "ru": {
    "tagShort": "Вольные торговцы на краю Империума",
    "tagline": "«Амбиции не знают границ. Как и Просторы Коронуса».",
    "description": "Ролевая игра Fantasy Flight Games 2009 года о династиях вольных торговцев — капитанах с варрантом от самого Императора, которым позволено летать за пределы Империума, торговать, воевать и открывать новые миры. Тот же d100-движок, что и в первой редакции Dark Heresy, но масштаб другой: вы с первой сессии командуете кораблём длиной в несколько километров, и герои здесь гораздо сильнее аколитов. Линейка больше не издаётся; PDF продаёт Cubicle 7. Среди трёх игр по 40k это самая авантюрная: Dark Heresy и Imperium Maledictum — про интриги внутри Империума, Wrath & Glory — про кубиковых героев, а Rogue Trader — про золото, звёзды и неизвестность.",
    "pickIf": ["хотите командовать звёздной династией во вселенной Warhammer 40k", "группе нравятся торговля, исследования и захват новых миров", "любите подробный d100 с Безумием и Порчей"],
    "skipIf": ["хотите интриги Инквизиции внутри Империума (это Dark Heresy)", "мастеру некогда готовиться по часу к сессии", "нужна линейка, которая ещё издаётся и пополняется"],
    "setting": "Просторы Коронуса — неизведанный регион за Пастью, варп-проходом из сектора Каликсис. Забытые миры, руины ксеносов, орочьи флотилии, эльдарские тайны и чудовищные прибыли для тех, кто доживёт. Корабль — ваш дом, ваша армия и ваш самый дорогой персонаж.",
    "vignette": "Вашему вольному торговцу нужен полк ветеранов-гвардейцев для высадки на дикий мир. Это проверка Приобретения против Фактора Прибыли 42; Мастер вешает −10 за редкость — цель 32. На d100 выпадает 19: полк ваш. Через неделю на орбите появляется орочий налётчик. Пустотник бросает Пилотирование, чтобы развернуть корабль бортом к врагу, и макробатареи дают залп. Если вы его захватите, это сразу шаг к цели Предприятия — и новые Очки Достижений.",
    "prep": "~60 мин",
    "mechanics": [
      { "title": "Путь Происхождения", "text": "Персонаж собирается по цепочке: родной мир, происхождение, зов пустоты, испытания, мотивация, карьера. Пути разных игроков пересекаются, и предыстории группы связываются сами собой." },
      { "title": "Фактор Прибыли", "text": "Деньги не считают в тронах. Нужен корабль, полк или груз — бросок против Фактора Прибыли династии. Предприятия с Очками Достижений поднимают его, провалы роняют." },
      { "title": "Свой звездолёт", "text": "Группа строит корабль из корпуса, систем и пушек, расходуя энергию и место. Космические бои — отдельная мини-игра, где у каждого игрока свой пост на мостике." },
      { "title": "d100 первой редакции", "text": "Бросок процентников под Характеристику со степенями успеха, перевёрнутые цифры для попаданий, Судьба, Безумие и Скверна — та же основа, что у Dark Heresy 1e, Deathwatch и Only War." }
    ],
    "gallery": [
      { "cap": "Космический бой" },
      { "cap": "Переговоры с эльдарами" },
      { "cap": "Залп по орочьему кораблю" },
      { "cap": "Hostile Acquisitions" }
    ],
    "resources": [
      { "name": "Основная книга (PDF, Cubicle 7)" },
      { "name": "Система wh40k-rpg для Foundry VTT (бета)" }
    ],
    "quotes": [
      { "text": "Rogue Trader посвящена странствиям плутоватых торговцев-первопроходцев сорокатысячника и открывает простор для более авантюрных историй и более пёстрых отрядов — вплоть до персонажей-ксеносов." }
    ]
  },
  "en": {
    "tagShort": "Merchant princes beyond the Imperium",
    "tagline": "\"Ambition knows no bounds. Neither does the Koronus Expanse.\"",
    "description": "Fantasy Flight Games' 2009 RPG about Rogue Trader dynasties — captains holding a Warrant of Trade from the Emperor himself, free to fly beyond the Imperium's borders, to trade, wage war and claim new worlds. The same d100 engine as Dark Heresy's first edition, but at a very different scale: from session one you command a starship kilometres long, and characters start far more capable than acolytes. The line is out of print; Cubicle 7 sells the PDFs. Of the 40k RPGs this is the swashbuckling one: Dark Heresy and Imperium Maledictum are about intrigue inside the Imperium, Wrath & Glory is dice-pool heroics, and Rogue Trader is about gold, stars and the unknown.",
    "pickIf": ["you want to command a starship dynasty in the Warhammer 40k universe", "your group enjoys trade, exploration and claiming new worlds", "you like crunchy d100 rules with Insanity and Corruption"],
    "skipIf": ["you want Inquisition intrigue inside the Imperium (see Dark Heresy)", "your GM can't spend an hour preparing each session", "you want a game still in print with new books coming"],
    "setting": "The Koronus Expanse, an uncharted region beyond the Maw, a warp passage out of the Calixis Sector. Lost worlds, xenos ruins, Ork raiders, Eldar secrets and obscene profits for whoever survives. Your ship is your home, your army and your most expensive character.",
    "vignette": "Your Rogue Trader needs a regiment of veteran Guardsmen for a landing on a feral world. That is an Acquisition test against Profit Factor 42; the GM applies −10 for scarcity, so the target is 32. The d100 shows 19: the regiment is yours. A week later an Ork raider drops out of the warp. Your Void-master rolls Pilot to swing the ship broadside-on, and the macrobatteries open fire. Capture that ship and it counts toward your Endeavour's objective — and more Achievement Points.",
    "prep": "~60 min",
    "mechanics": [
      { "title": "Origin Path", "text": "Characters are built along a chain: home world, birthright, lure of the void, trials, motivation, career. Players' paths cross, and the group's shared history writes itself." },
      { "title": "Profit Factor", "text": "Nobody counts Thrones. Want a ship, a regiment or a cargo? Roll against the dynasty's Profit Factor. Endeavours earn Achievement Points that raise it; misfortunes and failures drag it down." },
      { "title": "Your own starship", "text": "The group builds its ship from a hull, essential components and weapons, balancing power and space. Void combat is its own mini-game, with every player holding a post on the bridge." },
      { "title": "First-edition d100", "text": "Roll-under percentile tests with Degrees of Success, reversed digits for hit location, Fate, Insanity and Corruption — the same core as Dark Heresy 1e, Deathwatch and Only War." }
    ],
    "gallery": [
      { "cap": "Void combat" },
      { "cap": "Meeting with the Eldar" },
      { "cap": "Broadside on an Ork vessel" },
      { "cap": "Hostile Acquisitions art" }
    ],
    "resources": [
      { "name": "Core Rulebook (PDF, Cubicle 7)" },
      { "name": "wh40k-rpg system for Foundry VTT (beta)" }
    ]
  }
});
