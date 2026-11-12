registerSystem("rivers-of-london", {
  "groups": {
    "default": { "key": "narrative", "order": 87 },
    "family": { "key": "standalone", "order": 96 },
    "genre": { "key": "narrative-weird", "order": 17 },
    "solo": { "key": "solo-compatible", "order": 23 }
  },
  "name": "Rivers of London: the Roleplaying Game",
  "publisher": "Chaosium",
  "dice": "d100 (BRP)",
  "players": "1–6",
  "complexity": 3,
  "foundryStatus": "Community", // CHECK: fan-made system foundryvtt.com/packages/rol ("neither supported or endorsed by Chaosium")
  "heroImage": "https://sessionzero.games/images/heroes/rivers-of-london.jpg",
  "playstyleTags": ["mystery", "narrative", "social"],
  "settingTags": ["urban-fantasy", "modern"],
  "gallery": [
    { "src": "https://sessionzero.games/images/systems/rivers-of-london-g1.jpg" },
    { "src": "https://sessionzero.games/images/systems/rivers-of-london-g2.jpg" },
    { "src": "https://sessionzero.games/images/systems/rivers-of-london-g3.jpg" },
    { "src": "https://sessionzero.games/images/systems/rivers-of-london-g4.jpg" }
  ],
  "resources": [
    { "type": "link", "url": "https://www.chaosium.com/rivers-of-london/", "fmt": "Web" },
    { "type": "link", "url": "https://www.chaosium.com/free-rivers-of-london/", "fmt": "Web" },
    { "type": "quickstart", "url": "https://chaosium.itch.io/the-domestic-rivers-of-london-rpg-solo-adventure", "fmt": "PDF" },
    { "type": "link", "url": "https://downloads.chaosium.com/rivers-of-london/cha3200/Rivers_of_London_RPG_Player_Rules_Crib_Sheets.pdf", "fmt": "PDF" },
    { "type": "sheet", "url": "https://www.chaosium.com/content/FreePDFs/RiversOfLondon/CharacterSheets/Rivers%20of%20London%20Investigator%20Sheet%20Color.pdf", "fmt": "PDF" },
    { "type": "link", "url": "https://foundryvtt.com/packages/rol", "fmt": "Foundry" }
  ],
  "mechanics": [
    { "icon": "dices" },
    { "icon": "clover" },
    { "icon": "wand-sparkles" },
    { "icon": "heart-pulse" }
  ],
  "quotes": [
    // VERIFIED-AT: https://www.wargamer.com/rivers-of-london-rpg/review (Mollie Russell, Wargamer)
    {
      "text": "The entire book is peppered with loving details and in-jokes for avid fans.",
      "author": "Mollie Russell, Wargamer"
    },
    // VERIFIED-AT: https://geeknative.com/148828/rivers-of-london-rpg-review-rich-with-ben-aaronovitchs-magic (Andrew Girdwood, Geek Native)
    {
      "text": "This game feels like Rivers of London, which was the most crucial hurdle the game had to cross for me.",
      "author": "Andrew Girdwood, Geek Native"
    }
  ],
  "ru": {
    "tagShort": "Полиция и магия Лондона по романам Аароновича",
    "tagline": "«Магия существует. И кто-то должен заполнить по ней протокол».",
    "description": "Официальная ролевая игра по циклу городского фэнтези Бена Аароновича «Реки Лондона». Её написали Пол Фрикер, Линн Харди и соавторы, издаёт Chaosium; PDF вышел в 2022 году, твёрдая обложка — в 2023-м. Под капотом — Basic Roleplaying, тот же d100, что в Call of Cthulhu, только быстрее и мягче: персонажей тяжело убить, зато легко втянуть в неприятности. Игроки — новобранцы магического отдела столичной полиции, the Folly: они раскрывают дела, где замешаны речные божества, лисы-соглядатаи и люди, навсегда изменённые магией.",
    "pickIf": ["хотите полицейские расследования в волшебном современном Лондоне", "группе нравятся расследования, где выжить проще, чем в Call of Cthulhu", "вы фанаты романов и хотите служить в магическом отделе полиции"],
    "skipIf": ["хотите безнадёжный космический ужас, где персонажи ломаются", "игроки хотят эффектную боевую магию", "нужен фэнтезийный мир, а не реальный Лондон"],
    "setting": "Современный Лондон, под которым течёт другой, волшебный город: демимонд, где у каждой реки есть свой бог или богиня, а у каждого заклинания — след. Магия здесь — точная наука в ньютоновской традиции, и она жжёт электронику: после неосторожного заклинания смартфон может превратиться в песок. Книга подробно объясняет, как работает настоящая полиция и как ведётся расследование, а готовые «дела» (case files) выходят отдельными сборниками.",
    "vignette": "Выгоревшая квартира в Хакни, два часа ночи. У вашего персонажа Ощущение вестигиев (Sense Vestigia) 60%, Магия 60% и 13 очков магии. Бросок d100 — 74, провал. Вы давите бросок: снимаете перчатки и прижимаете ладонь к закопчённой стене. 41 — обычный успех. След слабый, поэтому вы улавливаете лишь его главный элемент: запах мокрой псины и трубочного табака. Чтобы осмотреться, вы творите Werelight — заклинание первого порядка, 1 очко магии, остаётся 12. И тут дверь слетает с петель: на вас бросается человек со слишком большим количеством зубов. Его удар проходит, но бросок урона против его СИЛ проваливается — всего 1 урон. Вы Ранены (Hurt): больно, но без штрафов, и это пройдёт, как только закончится драка.",
    "prep": "~30 мин",
    "mechanics": [
      { "title": "d100 по-лондонски", "text": "Навык в процентах: выбросить на d100 его значение или меньше — обычный успех, половину — сложный, 01 — критический, 100 — провал с последствиями. Проваленный бросок можно «надавить» — вторая попытка с более высокими ставками. Бонусные и штрафные кубы заменяют таблицы модификаторов." },
      { "title": "Преимущества и Удача", "text": "При создании персонаж берёт два малых преимущества или одно большое; Магический (Magical) — большое. Удача — это 50 + 2d10, её тратят, чтобы изменить результат броска. А когда удар смертелен, 30 очков Удачи превращают его в смертельную рану вместо гибели." },
      { "title": "Ньютоновская магия", "text": "Заклинания делятся на порядки, и базовая цена в очках магии равна порядку. Запас очков — пятая часть МОЩ плюс 1 за каждое освоенное заклинание, к следующей сцене он восполняется. Провал «надавленного» броска, критический провал или колдовство на нуле грозят гипертауматургической деградацией — вплоть до инсульта. Каждое заклинание оставляет вестигий и личную подпись мага." },
      { "title": "Состояния вместо хитов", "text": "Хитов нет: бросок урона идёт против СИЛ (ближний бой) или ЛОВ (оружие, заклинания) — 1, 2 или 3 урона плюс урон оружия. 1 урон — Ранен, 2 — В крови, 3 — Выбит из боя, 4 за один удар — смертельная рана, 5 за одну атаку — гибель, если не потратить 30 Удачи." }
    ],
    "gallery": [
      { "cap": "Обложка основной книги" },
      { "cap": "Иллюстрация из книги правил" },
      { "cap": "The Domestic — бесплатное одиночное приключение" },
      { "cap": "Underground, Overground — сборник дел" }
    ],
    "resources": [
      { "name": "Страница игры на сайте Chaosium" },
      { "name": "Бесплатные материалы Chaosium" },
      { "name": "The Domestic — бесплатное обучающее соло-приключение" },
      { "name": "Шпаргалки по правилам для игроков (PDF)" },
      { "name": "Лист следователя (официальный)" },
      { "name": "Фанатская система для Foundry VTT" }
    ],
    "quotes": [
      { "text": "Вся книга усыпана трогательными деталями и шутками для своих — для преданных фанатов." },
      { "text": "Эта игра ощущается как «Реки Лондона» — для меня это было самое важное препятствие, которое ей предстояло взять." }
    ]
  },
  "en": {
    "tagShort": "Police magic from Ben Aaronovitch's novels",
    "tagline": "\"Magic is real. Somebody still has to fill in the paperwork.\"",
    "description": "The official roleplaying game of Ben Aaronovitch's urban fantasy series, written by Paul Fricker, Lynne Hardy and friends and published by Chaosium (PDF in 2022, hardcover in 2023). Under the hood it runs on Basic Roleplaying, the same d100 engine as Call of Cthulhu, but faster and gentler: characters are hard to kill and easy to get into trouble. You play new recruits of the Metropolitan Police's magic branch, the Folly, solving cases that involve river gods, talking foxes and people changed for good by magic.",
    "pickIf": ["you want police procedural cases in a magical modern London", "your group likes investigation with gentler survival than Call of Cthulhu", "you are fans of the novels and want to join the Folly"],
    "skipIf": ["you want hopeless cosmic horror where characters break", "your players want flashy combat magic", "you want a fantasy world rather than real-world London"],
    "setting": "Modern London, with a second, magical city running underneath it: the demi-monde, where every river has its own god or goddess and every spell leaves a trace. Magic is a precise Newtonian discipline, and it fries electronics: one careless spell and your smartphone turns to sand. The book spends real effort on how London policing and criminal investigations actually work, and ready-made case files come in separate collections.",
    "vignette": "A burnt-out flat in Hackney, 2 AM. Your character has Sense Vestigia 60%, Magic 60% and 13 magic points. The d100 shows 74 — a failure. You push the roll: gloves off, palm flat against the sooty wall. 41 — a Regular success. The vestigium is weak, so you only catch its main element: wet dog and pipe smoke. To see better you cast Werelight, a first order spell: 1 magic point, 12 left. Then the door flies off its hinges and a man with too many teeth lunges at you. His blow lands, but he fails the damage roll against his STR — just 1 damage. You're Hurt: painful, no mechanical penalty, and gone as soon as the fight is over.",
    "prep": "~30 min",
    "mechanics": [
      { "title": "d100, London style", "text": "Skills are percentages: roll equal to or under your skill for a Regular success, under half for a Hard success, 01 is a critical and 100 a fumble. A failed roll can be pushed — a second attempt with higher stakes. Bonus and penalty dice replace modifier tables." },
      { "title": "Advantages & Luck", "text": "At creation you pick two minor advantages or one major one; Magical is a major advantage. Luck starts at 50 + 2D10 and is spent to change roll results. When a blow would kill outright, spending 30 Luck turns it into a mortal wound instead." },
      { "title": "Newtonian magic", "text": "Spells come in orders, and a spell's base cost in magic points equals its order. Your pool is one-fifth of POW plus 1 per mastered spell, and it refills by the next scene. Fumbling, failing a pushed casting roll or casting on empty risks Hyperthaumaturgical Degradation — up to a stroke. Every spell leaves vestigia and the caster's personal signare." },
      { "title": "Conditions, not hit points", "text": "There are no hit points: the damage roll is made against STR (melee) or DEX (firearms, spells) for 1, 2 or 3 damage plus weapon damage. 1 damage is Hurt, 2 Bloodied, 3 Down, 4 in one blow a Mortal Wound, and 5 in one attack kills unless you spend 30 Luck." }
    ],
    "gallery": [
      { "cap": "Core rulebook cover" },
      { "cap": "Interior illustration from the core book" },
      { "cap": "The Domestic — free solo adventure" },
      { "cap": "Underground, Overground — case file collection" }
    ],
    "resources": [
      { "name": "Chaosium game page" },
      { "name": "Chaosium free resources" },
      { "name": "The Domestic — free introductory solo adventure" },
      { "name": "Player rules crib sheets (PDF)" },
      { "name": "Investigator sheet (official)" },
      { "name": "Fan-made Foundry VTT system" }
    ]
  }
});
