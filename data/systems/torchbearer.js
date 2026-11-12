registerSystem("torchbearer", {
  "groups": {
    "default": { "key": "narrative", "order": 82 },
    "family": { "key": "standalone", "order": 90 },
    "genre": { "key": "dark-fantasy", "order": 31 }
  },
  "name": "Torchbearer",
  "publisher": "Burning Wheel HQ",
  "dice": "d6 pool",
  "players": "3–5",
  "complexity": 4,
  "foundryStatus": "None", // CHECK: no Torchbearer system listed on foundryvtt.com/packages as of 2026-11
  "heroImage": "https://sessionzero.games/images/heroes/torchbearer.jpg",
  "playstyleTags": ["survival", "explore", "tactical"],
  "settingTags": ["fantasy"],
  "gallery": [
    { "src": "https://sessionzero.games/images/systems/torchbearer-g1.jpg" },
    { "src": "https://sessionzero.games/images/systems/torchbearer-g2.jpg" },
    { "src": "https://sessionzero.games/images/systems/torchbearer-g3.jpg" },
    { "src": "https://sessionzero.games/images/systems/torchbearer-g4.jpg" }
  ],
  "resources": [
    { "type": "link", "url": "https://www.torchbearerrpg.com/", "fmt": "Web" },
    { "type": "quickstart", "url": "https://www.burningwheel.com/products/torchbearer-2e-introductory-chapter-pdf", "fmt": "PDF" },
    { "type": "sheet", "url": "https://www.burningwheel.com/products/torchbearer-2e-character-sheets-pdf", "fmt": "PDF" },
    { "type": "link", "url": "https://www.burningwheel.com/products/torchbearer-2e-core-set", "fmt": "Store" }
  ],
  "mechanics": [
    { "icon": "flame" },
    { "icon": "hourglass" },
    { "icon": "backpack" },
    { "icon": "tent" }
  ],
  "quotes": [
    // VERIFIED-AT: https://www.shutupandsitdown.com/rpg-review-torchbearer/ (Quintin Smith, Shut Up & Sit Down, 2016-05-31; review covers the 1st edition)
    {
      "text": "Torchbearer has actually become my favourite system ever for fostering role-playing on a long-term basis.",
      "author": "Quintin Smith, Shut Up & Sit Down"
    }
  ],
  "ru": {
    "tagShort": "Данжен-кроул, где выживание — уже победа",
    "tagline": "«Факел догорает. Еда кончается. А сокровище ещё внизу».",
    "description": "Torchbearer — суровый данжен-кроул от авторов Burning Wheel и Mouse Guard: Тора Олавсруда и Люка Крейна. Здесь главный враг не дракон, а голод, темнота и усталость: каждый ход приближает отряд к новому состоянию, факелы гаснут, а в рюкзаке хватает места лишь на самое нужное. Проверки решаются пулом d6, где каждая 4–6 — успех, но даже провал двигает историю вперёд. Второе издание, собранное на краудфандинге в 2020 году, — набор из двух книг: Dungeoneer's Handbook и Scholar's Guide.",
    "pickIf": ["хотите подземелья, где главные враги — голод, темнота и усталость", "группа любит головоломки с ресурсами: ходы факела, ячейки рюкзака, проверки в лагере", "игрокам нравится зарабатывать преимущества, играя черты против себя"],
    "skipIf": ["нужна лёгкая игра про подземелья без долгого изучения правил", "за столом не любят вести учёт состояний, ходов и ячеек", "хочется героев, а не отчаявшихся бродяг, которым не на что жить"],
    "setting": "Мрачное классическое фэнтези: забытые гробницы, разрушенные башни и подземелья, полные чудовищ и ловушек. Герои здесь не избранные, а отчаявшиеся бродяги, которые лезут под землю, потому что иначе им не на что жить. Между вылазками отряд возвращается в город — потратить добычу на ночлег, еду и снаряжение и снова уйти во тьму.",
    "vignette": "Вашему взломщику остаётся один ход света, а замок на сундуке всё ещё заперт. Мастер ставит Препятствие 3. Ваш навык Criminal — 3, бросаете три d6: 6, 4 и 1. Два успеха, не хватает одного. Мастер выбирает не поворот сюжета, а успех ценой состояния: крышка откидывается, но вы теперь Exhausted. Ход заканчивается, факел гаснет, и износ подбирается к следующему состоянию.",
    "prep": "~45 мин",
    "mechanics": [
      { "title": "Свет как ресурс", "text": "Факелы, фонари и свечи горят ограниченное число ходов и освещают лишь нескольких героев. Кто остался во тьме — хуже действует и рискует больше." },
      { "title": "Износ (the Grind)", "text": "Каждая проверка в подземелье отнимает ход. Каждый четвёртый ход все герои получают новое состояние — сперва Hungry and Thirsty, потом всё хуже, вплоть до Injured, Afraid и, наконец, смерти. Время — самый жестокий противник." },
      { "title": "Инвентарь по слотам", "text": "Рюкзак, пояс, руки — у каждого места фиксированное число ячеек. Взял лишний мешок — не возьмёшь меч. Каждая единица добычи — решение, что бросить." },
      { "title": "Приключение, лагерь, город", "text": "Черты, сыгранные против себя, приносят проверки. В лагере каждая проверка — это одна попытка восстановиться, починить снаряжение или подготовиться, а без проверок нельзя даже перевести дух. В городе платят уже иначе: за ночлег и покупки отвечает образ жизни и бросок Ресурсов перед уходом." }
    ],
    "gallery": [
      { "cap": "Обложка Lore Master's Manual" },
      { "cap": "Ширма мастера второго издания" },
      { "cap": "Герои Torchbearer" },
      { "cap": "Фирменные деревянные кубики" }
    ],
    "resources": [
      { "name": "Официальный сайт Torchbearer" },
      { "name": "Бесплатная вводная глава (PDF)" },
      { "name": "Бесплатные листы персонажа (PDF)" },
      { "name": "Купить Core Set второго издания" }
    ],
    "quotes": [
      { "text": "Torchbearer стал моей любимой системой из всех, если говорить о ролевой игре на долгой дистанции." }
    ]
  },
  "en": {
    "tagShort": "Dungeon crawling where survival is the win",
    "tagline": "\"The torch is guttering. The food is running out. The treasure is still below.\"",
    "description": "Torchbearer is a harsh dungeon crawler from the makers of Burning Wheel and Mouse Guard, Thor Olavsrud and Luke Crane. The real enemy is not the dragon but hunger, darkness and fatigue: every turn drags the party toward a new condition, torches burn out, and your pack has room only for what truly matters. Tests use a pool of d6s where every 4–6 is a success, yet even failure pushes the story forward. The second edition, crowdfunded in 2020, is a two-book set: the Dungeoneer's Handbook and the Scholar's Guide.",
    "pickIf": ["you want dungeon crawls where hunger, darkness and fatigue are the real enemy", "your group enjoys resource puzzles: torch turns, pack slots, camp checks", "players like earning advantages by playing their traits against themselves"],
    "skipIf": ["you want a light dungeon game you can run without much rules study", "your table dislikes tracking conditions, turns and inventory slots", "you want heroic adventurers, not desperate drifters scraping by"],
    "setting": "Grim classic fantasy: forgotten tombs, ruined towers and dungeons packed with monsters and traps. The heroes are not chosen ones but desperate drifters who go underground because there is no other way to make a living. Between delves the party returns to town to spend its loot on lodging, food and gear, then heads back into the dark.",
    "vignette": "Your burglar has one turn of light left and the chest is still locked. The GM sets Obstacle 3. Your Criminal skill is 3, so you roll three d6: 6, 4 and 1. Two successes, one short. Instead of a twist the GM grants success with a condition: the lid swings open, but now you're Exhausted. The turn ends, the torch dies, and the grind creeps toward the next condition.",
    "prep": "~45 min",
    "mechanics": [
      { "title": "Light as a resource", "text": "Torches, lanterns and candles burn for a limited number of turns and light only a few characters. Whoever is left in the dark acts worse and risks more." },
      { "title": "The grind", "text": "Every test in the dungeon takes a turn. Every fourth turn each adventurer takes a new condition, starting with Hungry and Thirsty and getting worse from there, all the way to Injured, Afraid and finally Dead. Time is the cruellest opponent." },
      { "title": "Slot-based inventory", "text": "Pack, belt and hands each hold a fixed number of slots. Carry an extra sack and you can't carry your sword. Every piece of loot is a choice about what to leave behind." },
      { "title": "Adventure, camp, town", "text": "Traits played against yourself earn checks. In camp each check buys one test — to recover, mend gear or prepare — and without checks you can't even catch your breath. In town the currency changes: lodging and shopping are paid for with a Lifestyle and Resources test on the way out." }
    ],
    "gallery": [
      { "cap": "Lore Master's Manual cover" },
      { "cap": "Second edition GM screen" },
      { "cap": "Torchbearer adventurers" },
      { "cap": "Custom wooden dice" }
    ],
    "resources": [
      { "name": "Official Torchbearer website" },
      { "name": "Free introductory chapter (PDF)" },
      { "name": "Free character sheets (PDF)" },
      { "name": "Buy the second edition Core Set" }
    ]
  }
});
