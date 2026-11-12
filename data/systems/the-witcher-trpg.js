registerSystem("the-witcher-trpg", {
  "groups": {
    "default": { "key": "tactical", "order": 46 },
    "family": { "key": "standalone", "order": 89 },
    "genre": { "key": "dark-fantasy", "order": 30 }
  },
  "name": "The Witcher TRPG",
  "publisher": "R. Talsorian Games",
  "dice": "d10 + Stat + Skill",
  "players": "3–6",
  "complexity": 4,
  "foundryStatus": "Community",
  "heroImage": "https://sessionzero.games/images/heroes/the-witcher-trpg.jpg",
  "playstyleTags": ["combat", "mystery", "social"],
  "settingTags": ["fantasy"],
  "gallery": [
    { "src": "https://sessionzero.games/images/systems/the-witcher-trpg-g1.jpg" },
    { "src": "https://sessionzero.games/images/systems/the-witcher-trpg-g2.jpg" },
    { "src": "https://sessionzero.games/images/systems/the-witcher-trpg-g3.jpg" }
  ],
  "resources": [
    { "type": "link", "url": "https://rtalsoriangames.com/witcher-trpg/", "fmt": "Web" },
    { "type": "sheet", "url": "https://rtalsoriangames.com/wp-content/uploads/2018/08/witcher-character-sheet-printer-friendly.pdf", "fmt": "PDF" },
    { "type": "link", "url": "https://rtalsoriangames.com/wp-content/uploads/2022/04/RTG-WI-DLC-WitchersTools.pdf", "fmt": "PDF" },
    { "type": "link", "url": "https://foundryvtt.com/packages/thewitchertrpg", "fmt": "Foundry" }
  ],
  "mechanics": [
    { "icon": "dices" },
    { "icon": "crosshair" },
    { "icon": "flask-conical" },
    { "icon": "scroll" }
  ],
  "quotes": [
    // VERIFIED-AT: https://cannibalhalflinggaming.com/2018/10/17/the-witcher-rpg-review/
    {
      "text": "The Witcher RPG is both a solid dark fantasy title and a return to form for R. Talsorian after a long hiatus.",
      "author": "Aaron Marks, Cannibal Halfling Gaming"
    },
    // VERIFIED-AT: https://spritesanddice.com/reviews/witcher-ttrpg-review/
    {
      "text": "Monster hunts are never as simple as stumbling into an encounter and fighting your way through them.",
      "author": "Adam Factor, Sprites and Dice"
    }
  ],
  "ru": {
    "tagShort": "Мрачное фэнтези по миру Сапковского",
    "tagline": "«Чудовища бывают разные. Самые страшные из них — люди».",
    "description": "Официальная настольная ролевая игра по «Ведьмаку» от R. Talsorian Games, авторов Cyberpunk, сделанная вместе с CD Projekt Red. Вы играете не обязательно за ведьмака: барды, маги, торговцы, ремесленники, медики, преступники и солдаты делят одну дорогу. Бросок d10 + характеристика + навык, жёсткие бои с прицельными ударами и критическими ранениями, алхимия и крафт как в видеоиграх — и квесты, где охота на чудовище всегда оборачивается чем-то большим.",
    "pickIf": ["хотите заказы на чудовищ, которые оборачиваются серой человеческой драмой", "группе нравятся жёсткие прицельные удары и критические раны", "игрокам интересны алхимия, крафт и биография, собранная по таблицам жизненного пути"],
    "skipIf": ["нужна лёгкая система с прощающими боями", "хотите героического фэнтези с понятным добром и злом"],
    "setting": "Континент в разгар войны с Нильфгаардом, между событиями второй и третьей игр серии. Северные королевства грызутся за власть, чародеи плетут интриги, нелюди живут в гетто и уходят в партизаны, а по трактам и болотам рыщут утопцы, гули и кое-что похуже. Мир морально серый: заказ на чудовище легко превращается в историю о людской жестокости.",
    "vignette": "Ведьмак атакует утопца мечом: Реакция 8 + Владение мечом 6 + d10. Выпадает 10 — кость «взрывается», вы бросаете ещё раз и добавляете 4: итого 28. Утопец уклоняется: его защита — 15. Разница 13 — это тяжёлое критическое ранение. Бросок d10 на место попадания — 3, туловище: урон проходит без множителя, за вычетом брони, плюс бонус за критическое ранение. А чародейка за его спиной вкладывает в заклинание больше Выносливости, чем позволяет её порог Энергии, — и каждая лишняя единица бьёт по её собственным хитам.",
    "prep": "~45 мин",
    "mechanics": [
      { "title": "d10 + характеристика + навык", "text": "Любая проверка — один d10 плюс характеристика и навык против Сложности или встречного броска. Десятка взрывается и бросается ещё раз с прибавкой, единица — провал с вычитанием второго броска." },
      { "title": "Прицельные удары и криты", "text": "Атака бьёт по конкретной части тела: голова получает тройной урон, конечности — половину. Если вы перебили защиту на 7 и больше, противник получает критическое ранение — от простого до смертельного." },
      { "title": "Алхимия и крафт", "text": "Чертежи, формулы и ингредиенты прямо как в играх серии. Ремесленники куют мечи и броню, алхимики варят эликсиры, масла и бомбы, а добыча с чудовищ становится сырьём." },
      { "title": "Жизненный путь", "text": "Персонаж создаётся через таблицы прошлого: судьба семьи, друзья, враги, романы и события каждого десятилетия жизни. Готовый герой приходит за стол уже с долгами и тайнами." }
    ],
    "gallery": [
      { "cap": "Обложка основной книги правил" },
      { "cap": "Разворот «Мир Ведьмака»" },
      { "cap": "Дополнение A Witcher's Tools" }
    ],
    "resources": [
      { "name": "R. Talsorian Games — страница игры" },
      { "name": "Официальный лист персонажа (PDF)" },
      { "name": "A Witcher's Tools — бесплатное дополнение (PDF)" },
      { "name": "Модуль сообщества для Foundry VTT" }
    ],
    "quotes": [
      { "text": "The Witcher RPG — одновременно добротное мрачное фэнтези и возвращение R. Talsorian в форму после долгого перерыва." },
      { "text": "Охота на чудовищ никогда не сводится к тому, чтобы наткнуться на тварь и прорубиться сквозь бой." }
    ]
  },
  "en": {
    "tagShort": "Grim fantasy in Sapkowski's world",
    "tagline": "\"Monsters come in many shapes. The worst of them are human.\"",
    "description": "The official Witcher tabletop RPG from R. Talsorian Games, the makers of Cyberpunk, built in collaboration with CD Projekt Red. You don't have to play a witcher: bards, mages, merchants, craftsmen, doctors, criminals and men-at-arms share the road. Roll d10 + Stat + Skill, survive brutal fights with aimed strikes and critical wounds, brew and craft just like in the video games — and take contracts where the monster hunt always turns into something bigger.",
    "pickIf": ["you want monster contracts that turn into morally grey human dramas", "your group enjoys brutal aimed strikes and critical wounds", "your players like alchemy, crafting and rolled lifepath backstories"],
    "skipIf": ["you want a light system with forgiving combat", "you want heroic fantasy with clear good and evil"],
    "setting": "The Continent in the thick of the war with Nilfgaard, between the events of the second and third games. The Northern Kingdoms claw at each other, sorcerers scheme, nonhumans live in ghettos or take to the woods as rebels, and drowners, ghouls and worse prowl the roads and swamps. It's a morally grey world: a monster contract easily becomes a story about human cruelty.",
    "vignette": "Your witcher swings at a drowner: REF 8 + Swordsmanship 6 + d10. The die shows a 10 — it explodes, you roll again and add 4, for a total of 28. The drowner tries to dodge and gets 15. Beating its defense by 13 means a difficult critical wound. Roll d10 for hit location: 3, the torso, so damage lands at full value minus armor, plus the critical's bonus. Behind him, the mage pours more Stamina into a spell than her Vigor threshold allows — and every point over it tears into her own health.",
    "prep": "~45 min",
    "mechanics": [
      { "title": "d10 + Stat + Skill", "text": "Every check is one d10 plus a Stat and a Skill against a Difficulty Value or an opposed roll. A 10 explodes and adds another roll; a 1 is a fumble that subtracts the next roll." },
      { "title": "Aimed strikes and crits", "text": "Attacks land on specific body parts: the head takes triple damage, limbs take half. Beat the defense by 7 or more and you inflict a critical wound, from simple all the way to deadly." },
      { "title": "Alchemy and crafting", "text": "Diagrams, formulae and ingredients straight out of the games. Craftsmen forge swords and armor, alchemists brew potions, oils and bombs, and monster loot becomes raw material." },
      { "title": "Lifepath", "text": "Characters are built through background tables: family fate, friends, enemies, romances and the events of each decade of their life. Your hero arrives at the table already carrying debts and secrets." }
    ],
    "gallery": [
      { "cap": "Core rulebook cover" },
      { "cap": "\"The World of the Witcher\" spread" },
      { "cap": "A Witcher's Tools supplement" }
    ],
    "resources": [
      { "name": "R. Talsorian Games — game page" },
      { "name": "Official character sheet (PDF)" },
      { "name": "A Witcher's Tools — free supplement (PDF)" },
      { "name": "Community module for Foundry VTT" }
    ]
  }
});
